'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '@/shared/types/player.types';
import { GameSession } from '@/shared/types/game.types';
import { QuestionWithOptions } from '@/shared/types/quiz.types';
import { useRealtime } from './useRealtime';

export function usePlayerSession(sessionId: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuestionWithOptions | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    is_correct: boolean;
    points_awarded: number;
    new_score: number;
    new_streak: number;
  } | null>(null);
  // БАГ 4 фикс: хранить correct_option_id чтобы подсвечивать правильный вариант даже при timeout
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [isKicked, setIsKicked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Счётчик ответивших игроков
  const [answersCount, setAnswersCount] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);

  // Refs for realtime callbacks to avoid stale closures
  const prevQuestionIdRef = useRef<string | null | undefined>(null);
  const playerRef = useRef<Player | null>(null);
  playerRef.current = player;
  const correctOptionIdRef = useRef<string | null>(null);
  correctOptionIdRef.current = correctOptionId;

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

  // AbortController — отменяем fetch при размонтировании / смене sessionId
  const abortRef = useRef<AbortController | null>(null);

  const fetchSession = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, { signal: ctrl.signal });
      const data = await res.json();
      if (data.success) {
        setSession(data.data.session);
        setActiveQuestion(data.data.activeQuestion || null);
        setTotalQuestions(data.data.totalQuestions || 0);
        // Количество игроков из players[]
        if (Array.isArray(data.data.players)) {
          setTotalPlayers(data.data.players.length);
        }
        // Seed ref so the first realtime update compares against the actual current question
        prevQuestionIdRef.current = data.data.session?.current_question_id ?? null;
      }
    } catch (err: unknown) {
      // AbortError — нормальное поведение при размонтировании, не показываем ошибку
      if (err instanceof Error && err.name === 'AbortError') return;
      // Fail silently для остальных — не ставим error state чтобы не ломать порядок хуков в рендере
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
    return () => { abortRef.current?.abort(); };
  }, [fetchSession]);

  // Realtime updates
  useRealtime(sessionId, {
    onSessionUpdate: (updatedSession) => {
      // При смене вопроса сбрасываем состояние ответа и загружаем новый вопрос
      if (prevQuestionIdRef.current !== updatedSession.current_question_id) {
        setHasAnswered(false);
        setLastAnswerResult(null);
        setCorrectOptionId(null);
        // Сбрасываем счётчик ответов при смене вопроса
        setAnswersCount(0);
        // ✅ FAST: фетчим только вопрос (2 БД запроса) вместо fetchSession (4+ запросов)
        setActiveQuestion(null); // очищаем → скелетон сразу виден
        fetch(`/api/questions/${updatedSession.current_question_id}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.success) {
              setActiveQuestion(data.data.question || null);
            }
          })
          .catch(() => {});
      }
      prevQuestionIdRef.current = updatedSession.current_question_id;
      setSession(updatedSession);

      // Если ведущий перешел к разбору ответа, а игрок не отвечал (таймаут) — получаем правильный ответ
      if (
        (updatedSession.status === 'question_review' || updatedSession.status === 'leaderboard') &&
        updatedSession.current_question_id &&
        !correctOptionIdRef.current
      ) {
        fetch(`/api/sessions/${sessionId}/stats/${updatedSession.current_question_id}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.success && data.data?.correctOptionId) {
              setCorrectOptionId(data.data.correctOptionId);
            }
          })
          .catch(() => {});
      }
    },
    onPlayerUpdated: (updatedPlayer) => {
      if (playerRef.current && updatedPlayer.id === playerRef.current.id) {
        setPlayer(updatedPlayer);
        try {
          sessionStorage.setItem(`chemistry_player_${sessionId}`, JSON.stringify(updatedPlayer));
        } catch {}
      }
    },
    onAnswerSubmitted: () => {
      // Инкрементируем счётчик ответивших при каждом realtime-событии ответа
      setAnswersCount((prev) => prev + 1);
    },
    onPlayerLeft: (kickedPlayerId) => {
      // Если ведущий исключил текущего игрока
      if (playerRef.current && kickedPlayerId === playerRef.current.id) {
        try {
          sessionStorage.removeItem(`chemistry_player_${sessionId}`);
        } catch {}
        setPlayer(null);
        setIsKicked(true);
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

    // Сохраняем correct_option_id для подсветки правильного ответа
    if (data.data.correct_option_id) {
      setCorrectOptionId(data.data.correct_option_id);
    }

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
    activeQuestion,
    totalQuestions,
    hasAnswered,
    lastAnswerResult,
    correctOptionId,
    isKicked,
    isLoading,
    error,
    submitAnswer,
    registerPlayer,
    answersCount,
    totalPlayers,
  };
}
