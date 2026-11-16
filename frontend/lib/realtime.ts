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

export function subscribeToGame(
  sessionId: string,
  handlers: RealtimeGameEvents
): { channel: RealtimeChannel; unsubscribe: () => void } {
  const supabase = createClient();
  // Unique channel name per subscriber to prevent collisions when multiple hooks subscribe simultaneously
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const channelName = `game_room_${sessionId}_${uniqueId}`;

  const channel = supabase
    .channel(channelName)
    // 1. Listen to game session changes (status, question, time)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_sessions',
        filter: `id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.new && handlers.onSessionUpdate) {
          handlers.onSessionUpdate(payload.new as GameSession);
        }
      }
    )
    // 2. Listen to players joining, updating score, or disconnecting
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'players',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.new && handlers.onPlayerJoined) {
          handlers.onPlayerJoined(payload.new as Player);
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'players',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.new && handlers.onPlayerUpdated) {
          handlers.onPlayerUpdated(payload.new as Player);
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'players',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.old && (payload.old as { id?: string }).id && handlers.onPlayerLeft) {
          handlers.onPlayerLeft((payload.old as { id: string }).id);
        }
      }
    )
    // 3. Listen to player answers count / events
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'player_answers',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.new && handlers.onAnswerSubmitted) {
          handlers.onAnswerSubmitted(payload.new as PlayerAnswer);
        }
      }
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        console.warn('Error removing channel:', err);
      }
    },
  };
}
