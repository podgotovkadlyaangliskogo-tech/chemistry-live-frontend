'use client';

import { useEffect, useRef } from 'react';
import { subscribeToGame, RealtimeGameEvents } from '@/frontend/lib/realtime';

export function useRealtime(sessionId: string | null | undefined, events: RealtimeGameEvents) {
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    if (!sessionId) return;

    const sub = subscribeToGame(sessionId, {
      onSessionUpdate: (s) => eventsRef.current.onSessionUpdate?.(s),
      onPlayerJoined: (p) => eventsRef.current.onPlayerJoined?.(p),
      onPlayerLeft: (id) => eventsRef.current.onPlayerLeft?.(id),
      onPlayerUpdated: (p) => eventsRef.current.onPlayerUpdated?.(p),
      onAnswerSubmitted: (a) => eventsRef.current.onAnswerSubmitted?.(a),
    });

    return () => {
      sub.unsubscribe();
    };
  }, [sessionId]);
}
