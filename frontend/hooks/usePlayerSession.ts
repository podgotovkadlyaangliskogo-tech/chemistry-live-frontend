'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '@/shared/types/player.types';
import { GameSession } from '@/shared/types/game.types';
import { useRealtime } from './useRealtime';

export function usePlayerSession(sessionId: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    is_correct: boolean;
    points_awarded: number;
    new_score: number;
    new_streak: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // BUG 6 fix: track previous question id via ref to avoid stale closure in onSessionUpdate
  const prevQuestionIdRef = useRef<string | null | undefined>(null);

  // Restore player info from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`chemistry_player_${sessionId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPlayer(parsed);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [sessionId]);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setSession(data.data.session);
        // Seed ref so the first realtime update compares against the actual current question
        prevQuestionIdRef.current = data.data.session?.current_question_id ?? null;
      }
    } catch {
      // Fail silently on background poll
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Realtime updates
  useRealtime(sessionId, {
    onSessionUpdate: (updatedSession) => {
      // BUG 6 fix: compare via ref (not stale `session` from closure)
      if (prevQuestionIdRef.current !== updatedSession.current_question_id) {
        setHasAnswered(false);
        setLastAnswerResult(null);
      }
      prevQuestionIdRef.current = updatedSession.current_question_id;
      setSession(updatedSession);
    },
    onPlayerUpdated: (updatedPlayer) => {
      if (player && updatedPlayer.id === player.id) {
        setPlayer(updatedPlayer);
        try {
          sessionStorage.setItem(`chemistry_player_${sessionId}`, JSON.stringify(updatedPlayer));
        } catch {}
      }
    },
  });

  const submitAnswer = async (selectedOptionId: string, responseTimeMs: number) => {
    if (!player || !session?.current_question_id) {
      throw new Error('Невозможно отправить ответ: нет активного вопроса или игрока');
    }

    const res = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        player_id: player.id,
        question_id: session.current_question_id,
        selected_option_id: selectedOptionId,
        response_time_ms: responseTimeMs,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Ошибка отправки ответа');
    }

    setHasAnswered(true);
    setLastAnswerResult(data.data);

    // Update local score
    setPlayer((prev) =>
      prev
        ? {
            ...prev,
            score: data.data.new_score,
            streak: data.data.new_streak,
          }
        : null
    );

    return data.data;
  };

  const registerPlayer = (newPlayer: Player) => {
    setPlayer(newPlayer);
    try {
      sessionStorage.setItem(`chemistry_player_${sessionId}`, JSON.stringify(newPlayer));
    } catch {}
  };

  return {
    player,
    session,
    hasAnswered,
    lastAnswerResult,
    isLoading,
    error,
    submitAnswer,
    registerPlayer,
  };
}
