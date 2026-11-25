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
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

// Реестр активных комнат на клиенте (один канал на сессию для всех хуков на странице)
const activeRooms = new Map<string, RoomSubscription>();

// Счётчик для гарантии уникальных имён каналов при пересоздании
let channelCounter = 0;

export function subscribeToGame(
  sessionId: string,
  handlers: RealtimeGameEvents
): { channel: RealtimeChannel; unsubscribe: () => void } {
  const supabase = createClient();
  let room = activeRooms.get(sessionId);

  // Если для этой сессии был запланирован демонтаж канала (при переходе со страницы на страницу) — отменяем его
  if (room?.cleanupTimer) {
    clearTimeout(room.cleanupTimer);
    room.cleanupTimer = undefined;
  }

  // Если канал существует, но уже закрыт/убран (например, после React Strict Mode двойного монтирования) —
  // удаляем протухшую запись и создаём свежий канал
  if (room) {
    const state = (room.channel as unknown as { state?: string }).state;
    if (state === 'closed' || state === 'errored') {
      try { supabase.removeChannel(room.channel); } catch { /* ignore */ }
      activeRooms.delete(sessionId);
      room = undefined;
    }
  }

  if (!room) {
    const channelName = `game_room_${sessionId}_${++channelCounter}`;
    const subscribers = new Set<RealtimeGameEvents>();

    // Создаем канал ровно ОДИН РАЗ со всеми обработчиками
    const channel = supabase
      .channel(channelName)
      // 1. Изменения игровой сессии (статус, активный вопрос, таймер)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            subscribers.forEach((h) => {
              try {
                h.onSessionUpdate?.(payload.new as GameSession);
              } catch (err) {
                console.error('[Realtime] Error in onSessionUpdate handler:', err);
              }
            });
          }
        }
      )
      // 2. Игроки (подключение)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            subscribers.forEach((h) => {
              try {
                h.onPlayerJoined?.(payload.new as Player);
              } catch (err) {
                console.error('[Realtime] Error in onPlayerJoined handler:', err);
              }
            });
          }
        }
      )
      // 3. Игроки (обновление очков, стрика)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            subscribers.forEach((h) => {
              try {
                h.onPlayerUpdated?.(payload.new as Player);
              } catch (err) {
                console.error('[Realtime] Error in onPlayerUpdated handler:', err);
              }
            });
          }
        }
      )
      // 4. Игроки (удаление / исключение)
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const oldId = (payload.old as { id?: string })?.id;
          if (oldId) {
            subscribers.forEach((h) => {
              try {
                h.onPlayerLeft?.(oldId);
              } catch (err) {
                console.error('[Realtime] Error in onPlayerLeft handler:', err);
              }
            });
          }
        }
      )
      // 5. Ответы участников (подсчет количества ответивших)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'player_answers',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            subscribers.forEach((h) => {
              try {
                h.onAnswerSubmitted?.(payload.new as PlayerAnswer);
              } catch (err) {
                console.error('[Realtime] Error in onAnswerSubmitted handler:', err);
              }
            });
          }
        }
      );

    channel.subscribe((status, err) => {
      if (err) {
        console.warn(`[Realtime] Subscription error on channel ${channelName}:`, err);
      }
    });

    room = {
      channel,
      subscribers,
    };
    activeRooms.set(sessionId, room);
  }

  // Добавляем обработчик текущего подписчика в набор
  room.subscribers.add(handlers);

  return {
    channel: room.channel,
    unsubscribe: () => {
      const currentRoom = activeRooms.get(sessionId);
      if (!currentRoom) return;

      currentRoom.subscribers.delete(handlers);

      // Если все подписчики на странице отключились — даем 500мс буфер перед закрытием сокета
      // (предотвращает разрыв соединения при мгновенном переходе между страницами lobby -> game)
      if (currentRoom.subscribers.size === 0) {
        currentRoom.cleanupTimer = setTimeout(() => {
          if (currentRoom.subscribers.size === 0) {
            try {
              supabase.removeChannel(currentRoom.channel);
            } catch (err) {
              console.warn('[Realtime] Error removing channel:', err);
            }
            activeRooms.delete(sessionId);
          }
        }, 500);
      }
    },
  };
}
