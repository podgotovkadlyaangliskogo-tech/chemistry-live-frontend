import { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from './supabase.client';
import { GameSession } from '@/shared/types/game.types';
import { Player, PlayerAnswer } from '@/shared/types/player.types';

export interface RealtimeGameEvents {
  onSessionUpdate?: (session: GameSession) => void;
  onPlayerJoined?: (player: Player) => void;
  onPlayerLeft?: (playerId: string) => void;
  onPlayerUpdated?: (player: Player) => void;
  onAnswerSubmitted?: (answer: PlayerAnswer) => void;
}

interface RoomSubscription {
  channel: RealtimeChannel;
  subscribers: Set<RealtimeGameEvents>;
  subscribed: boolean;
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

// Singleton registry: один WebSocket-канал на sessionId для всех хуков на странице
const activeRooms = new Map<string, RoomSubscription>();

function buildChannel(supabase: ReturnType<typeof createClient>, sessionId: string, subscribers: Set<RealtimeGameEvents>): RealtimeChannel {
  const channelName = `game_room_${sessionId}_${Date.now()}`;

  const channel = supabase
    .channel(channelName)
    // 1. Изменения игровой сессии
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
      (payload) => {
        if (payload.new) {
          subscribers.forEach((h) => {
            try { h.onSessionUpdate?.(payload.new as GameSession); } catch { /* ignore */ }
          });
        }
      }
    )
    // 2. Игроки: новый участник
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` },
      (payload) => {
        if (payload.new) {
          subscribers.forEach((h) => {
            try { h.onPlayerJoined?.(payload.new as Player); } catch { /* ignore */ }
          });
        }
      }
    )
    // 3. Игроки: обновление очков/стрика
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` },
      (payload) => {
        if (payload.new) {
          subscribers.forEach((h) => {
            try { h.onPlayerUpdated?.(payload.new as Player); } catch { /* ignore */ }
          });
        }
      }
    )
    // 4. Игроки: кик / отключение
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` },
      (payload) => {
        const oldId = (payload.old as { id?: string })?.id;
        if (oldId) {
          subscribers.forEach((h) => {
            try { h.onPlayerLeft?.(oldId); } catch { /* ignore */ }
          });
        }
      }
    )
    // 5. Ответы участников
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'player_answers', filter: `session_id=eq.${sessionId}` },
      (payload) => {
        if (payload.new) {
          subscribers.forEach((h) => {
            try { h.onAnswerSubmitted?.(payload.new as PlayerAnswer); } catch { /* ignore */ }
          });
        }
      }
    );

  channel.subscribe((status, err) => {
    if (err) console.warn(`[Realtime] Error on ${channelName}:`, err);
  });

  return channel;
}

export function subscribeToGame(
  sessionId: string,
  handlers: RealtimeGameEvents
): { channel: RealtimeChannel; unsubscribe: () => void } {
  const supabase = createClient();
  let room = activeRooms.get(sessionId);

  // Отменяем запланированное удаление канала (переход между страницами)
  if (room?.cleanupTimer) {
    clearTimeout(room.cleanupTimer);
    room.cleanupTimer = undefined;
  }

  if (room) {
    // Канал уже существует и подписан — просто добавляем handler в Set.
    // НЕ вызываем .on() повторно — это запрещено Supabase после subscribe().
    room.subscribers.add(handlers);
    return {
      channel: room.channel,
      unsubscribe: makeUnsubscribe(supabase, sessionId, handlers),
    };
  }

  // Создаём новый канал: сначала регистрируем Set, потом вешаем .on(), потом subscribe()
  const subscribers = new Set<RealtimeGameEvents>();
  subscribers.add(handlers);

  const channel = buildChannel(supabase, sessionId, subscribers);

  room = { channel, subscribers, subscribed: true };
  activeRooms.set(sessionId, room);

  return {
    channel,
    unsubscribe: makeUnsubscribe(supabase, sessionId, handlers),
  };
}

function makeUnsubscribe(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
  handlers: RealtimeGameEvents
): () => void {
  return () => {
    const room = activeRooms.get(sessionId);
    if (!room) return;

    room.subscribers.delete(handlers);

    // Если все подписчики ушли — удаляем канал через 800мс (буфер для SPA-навигации)
    if (room.subscribers.size === 0) {
      room.cleanupTimer = setTimeout(() => {
        const current = activeRooms.get(sessionId);
        if (current && current.subscribers.size === 0) {
          try { supabase.removeChannel(current.channel); } catch { /* ignore */ }
          activeRooms.delete(sessionId);
        }
      }, 2000);
    }
  };
}
