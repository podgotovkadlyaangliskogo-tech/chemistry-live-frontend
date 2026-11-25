'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameSession } from '@/shared/types/game.types';
import { Player, PlayerAnswer, LeaderboardEntry } from '@/shared/types/player.types';
import { QuestionWithCorrectAnswer } from '@/shared/types/quiz.types';
import { useRealtime } from './useRealtime';

export function useGameSession(sessionId: string) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuestionWithCorrectAnswer | null>(null);
  const [questionReview, setQuestionReview] = useState<QuestionWithCorrectAnswer | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answersCount, setAnswersCount] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Ошибка загрузки сессии');
      }

      setSession(data.data.session);
      setActiveQuestion(data.data.activeQuestion || null);
      setTotalQuestions(data.data.totalQuestions || 0);

      // Load players
      const lbRes = await fetch(`/api/leaderboard/${sessionId}`);
      const lbData = await lbRes.json();
      if (lbData.success) {
        const pList: Player[] = (lbData.data.leaderboard || []).map((entry: LeaderboardEntry) => ({
          id: entry.playerId,
          session_id: sessionId,
          nickname: entry.nickname,
          score: entry.score,
          streak: entry.streak,
          is_connected: true,
          joined_at: '',
          last_active_at: '',
        }));
        setPlayers(pList);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Realtime subscription
  useRealtime(sessionId, {
    onSessionUpdate: (updated) => {
      setSession((prev) => {
        // Сбрасывать счётчик ответов при смене вопроса (баг 6 фикс)
        if (prev && prev.current_question_id !== updated.current_question_id) {
          setAnswersCount(0);
        }
        return updated;
      });
    },
    onPlayerJoined: (player) => {
      setPlayers((prev) => {
        if (prev.some((p) => p.id === player.id)) return prev;
        return [...prev, player];
      });
    },
    onPlayerUpdated: (updatedPlayer) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === updatedPlayer.id ? { ...p, ...updatedPlayer } : p))
      );
    },
    onPlayerLeft: (kickedId) => {
      setPlayers((prev) => prev.filter((p) => p.id !== kickedId));
    },
    onAnswerSubmitted: () => {
      setAnswersCount((prev) => prev + 1);
    },
  });

  const startGame = async () => {
    const res = await fetch(`/api/sessions/${sessionId}/start`, { method: 'POST' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    await fetchSession();
  };

  const advanceQuestion = async (action: 'next' | 'reveal' | 'leaderboard') => {
    const res = await fetch(`/api/sessions/${sessionId}/next-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    await fetchSession();
  };

  const endGame = async () => {
    const res = await fetch(`/api/sessions/${sessionId}/end`, { method: 'POST' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    await fetchSession();
  };

  const kickPlayer = async (playerId: string) => {
    const res = await fetch(`/api/sessions/${sessionId}/kick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  };

  return {
    session,
    activeQuestion,
    questionReview,
    players,
    answersCount,
    totalQuestions,
    isLoading,
    error,
    refetch: fetchSession,
    startGame,
    advanceQuestion,
    endGame,
    kickPlayer,
  };
}
