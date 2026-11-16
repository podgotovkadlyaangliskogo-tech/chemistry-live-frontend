'use client';

import { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry } from '@/shared/types/player.types';
import { GameResult } from '@/shared/types/game.types';
import { useRealtime } from './useRealtime';

export function useLeaderboard(sessionId: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/leaderboard/${sessionId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Ошибка загрузки лидеров');
      }

      setLeaderboard(data.data.leaderboard || []);
      setResults(data.data.results || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useRealtime(sessionId, {
    onPlayerUpdated: () => {
      fetchLeaderboard();
    },
    onPlayerJoined: () => {
      fetchLeaderboard();
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
