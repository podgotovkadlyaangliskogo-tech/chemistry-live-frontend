'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LeaderboardEntry } from '@/shared/types/player.types';
import { GameResult } from '@/shared/types/game.types';
import { useRealtime } from './useRealtime';

export function useLeaderboard(sessionId: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      setError(null);
      const res = await fetch(`/api/leaderboard/${sessionId}`, { signal: ctrl.signal });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Ошибка загрузки лидеров');
      setLeaderboard(data.data.leaderboard || []);
      setResults(data.data.results || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchLeaderboard();
    return () => { abortRef.current?.abort(); };
  }, [fetchLeaderboard]);

  // ✅ FIX: дебаунс при ответах игроков
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedFetch = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => fetchLeaderboard(), 400);
  }, [fetchLeaderboard]);

  // ✅ FIX: рефетч при game_over (досрочное завершение и конец игры)
  useRealtime(sessionId, {
    onPlayerUpdated: debouncedFetch,
    onPlayerJoined: debouncedFetch,
    onSessionUpdate: (session) => {
      // При переходе к game_over или leaderboard — сразу обновляем
      if (session.status === 'game_over' || session.status === 'leaderboard') {
        // Небольшая задержка чтобы backend успел записать финальные очки
        setTimeout(() => fetchLeaderboard(), 300);
      }
    },
  });

  return {
    leaderboard,
    results,
    isLoading,
    error,
    refetch: fetchLeaderboard,
  };
}
