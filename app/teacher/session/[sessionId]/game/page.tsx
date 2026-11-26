'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { QuestionCard } from '@/frontend/components/quiz/QuestionCard';
import { AnswerButton } from '@/frontend/components/quiz/AnswerButton';
import { QuestionProgress } from '@/frontend/components/quiz/QuestionProgress';
import { CountdownTimer } from '@/frontend/components/quiz/CountdownTimer';
import { QuestionControl } from '@/frontend/components/teacher/QuestionControl';
import { AnswerStats } from '@/frontend/components/teacher/AnswerStats';
import { LeaderboardList } from '@/frontend/components/leaderboard/LeaderboardList';
import { useGameSession } from '@/frontend/hooks/useGameSession';
import { useLeaderboard } from '@/frontend/hooks/useLeaderboard';
import { AnswerOption } from '@/shared/types/quiz.types';
import { Users, ArrowLeft } from 'lucide-react';

interface GamePageProps {
  params: Promise<{ sessionId: string }>;
}

export default function TeacherGamePage({ params }: GamePageProps) {
  const { sessionId } = use(params);
  const router = useRouter();

  const {
    session,
    activeQuestion,
    players,
    answersCount,
    totalQuestions,
    isLoading,
    error,
    advanceQuestion,
    endGame,
  } = useGameSession(sessionId);

  const { leaderboard } = useLeaderboard(sessionId);

  const [isAdvancing, setIsAdvancing] = useState(false);
  const [stats, setStats] = useState<{
    counts: Record<string, number>;
    totalAnswers: number;
    correctOptionId: string | null;
  }>({ counts: {}, totalAnswers: 0, correctOptionId: null });

  // Защита маршрута: проверка авторизации преподавателя
  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('chemistry_teacher_auth');
    if (!isAuth) {
      router.push('/teacher/login');
    }
  }, [router]);

  // Load question stats when question ends or is revealed
  useEffect(() => {
    if (
      session?.current_question_id &&
      (session.status === 'question_review' || session.status === 'leaderboard')
    ) {
      fetch(`/api/sessions/${sessionId}/stats/${session.current_question_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStats(data.data);
          }
        })
        .catch(() => {});
    }
  }, [session?.status, session?.current_question_id, sessionId]);

  // Navigate to results if game is over
  useEffect(() => {
    if (session?.status === 'game_over') {
      router.push(`/teacher/session/${sessionId}/results`);
    }
  }, [session?.status, sessionId, router]);

  // ✅ Все useCallback ДОЛЖНЫ быть ДО conditional return (Rules of Hooks)
  const handleReveal = useCallback(async () => {
    try {
      setIsAdvancing(true);
      await advanceQuestion('reveal');
    } finally {
      setIsAdvancing(false);
    }
  }, [advanceQuestion]);

  const handleShowLeaderboard = useCallback(async () => {
    try {
      setIsAdvancing(true);
      await advanceQuestion('leaderboard');
    } finally {
      setIsAdvancing(false);
    }
  }, [advanceQuestion]);

  const handleNext = useCallback(async () => {
    try {
      setIsAdvancing(true);
      await advanceQuestion('next');
    } finally {
      setIsAdvancing(false);
    }
  }, [advanceQuestion]);

  const handleEnd = useCallback(async () => {
    try {
      setIsAdvancing(true);
      await endGame();
      router.push(`/teacher/session/${sessionId}/results`);
    } finally {
      setIsAdvancing(false);
    }
  }, [endGame, router, sessionId]);

  if (isLoading && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A]">
        <LoadingSpinner label="Загрузка сессии викторины..." size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0E1A]">
        <ErrorMessage message={error || 'Сессия не найдена'} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="secondary">Вернуться в дашборд</Button>
        </Link>
      </div>
    );
  }

  const isRevealed =
    session.status === 'question_review' || session.status === 'leaderboard';
  const isLeaderboardPhase = session.status === 'leaderboard';
  const isLastQuestion =
    totalQuestions > 0 && session.current_question_index + 1 >= totalQuestions;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col">
      {/* Game Header */}
      <header className="bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-white">
                Экран ведущего
              </span>
              <span className="font-mono text-xs font-bold text-[#4F8EF7] bg-[#4F8EF7]/15 border border-[#4F8EF7]/30 px-2.5 py-0.5 rounded-lg">
                PIN: {session.pin_code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/[0.06] px-3.5 py-1.5 rounded-xl border border-white/10 font-mono">
              <Users className="w-4 h-4 text-[#4F8EF7]" />
              <span>
                Ответили: {answersCount} / {players.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
        {/* Progress & Countdown Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-[#10172A]/90 border border-white/[0.08] rounded-3xl shadow-xl">
          <div className="flex-1 w-full">
            <QuestionProgress
              currentIndex={session.current_question_index}
              totalQuestions={totalQuestions ?? undefined}
              difficulty={activeQuestion?.difficulty}
              points={activeQuestion?.points}
            />
          </div>

          {session.status === 'question_active' && activeQuestion && (
            <div className="shrink-0">
              <CountdownTimer
                startTime={session.question_start_time}
                timeLimitSeconds={activeQuestion.time_limit_seconds}
                onExpire={handleReveal}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Phase: Leaderboard view */}
        {isLeaderboardPhase ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <LeaderboardList entries={leaderboard} />
          </div>
        ) : activeQuestion ? (
          /* Phase: Question / Review view */
          <div className="space-y-6">
            <QuestionCard
              text={activeQuestion.text}
              explanation={activeQuestion.explanation}
              imageUrl={activeQuestion.image_url}
              isRevealed={isRevealed}
            />

            {/* 4 Answer Option Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeQuestion.options.map((option, idx) => {
                const count = stats.counts[option.id] || 0;
                const total = stats.totalAnswers || answersCount || 1;
                const pct = total > 0 ? (count / total) * 100 : 0;
                const isCorrect = isRevealed && stats.correctOptionId === option.id;

                return (
                  <AnswerButton
                    key={option.id}
                    index={idx}
                    text={option.text}
                    color={option.color}
                    isRevealed={isRevealed}
                    isCorrect={isCorrect}
                    disabled={true}
                    statsCount={isRevealed ? count : undefined}
                    statsPercentage={isRevealed ? pct : undefined}
                  />
                );
              })}
            </div>

            {/* Stats Bar Chart if revealed */}
            {isRevealed && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AnswerStats
                  options={activeQuestion.options as AnswerOption[]}
                  counts={stats.counts}
                  totalAnswers={stats.totalAnswers}
                  correctOptionId={stats.correctOptionId || undefined}
                />
              </div>
            )}
          </div>
        ) : session.status !== 'leaderboard' ? (
          /* Скелетон пока вопрос грузится */
          <div className="space-y-6 animate-pulse">
            <div className="w-full h-28 rounded-3xl bg-[#10172A]/90 border border-white/[0.08]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0,1,2,3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-[#10172A]/90 border border-white/[0.08]" />
              ))}
            </div>
          </div>
        ) : null}

        {/* Правильный ответ — только для учителя, тихо */}
        {activeQuestion && session.status !== 'leaderboard' && (() => {
          const correctOpt = activeQuestion.options.find((o) => (o as { is_correct?: boolean }).is_correct);
          return correctOpt ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 text-sm text-emerald-400/80 select-none">
              <svg className="w-3.5 h-3.5 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium opacity-70">Ответ:</span>
              <span className="font-semibold">{correctOpt.text}</span>
            </div>
          ) : null;
        })()}

        {/* Teacher Controls Bar */}
        <div className="mt-auto pt-4">
          <QuestionControl
            status={session.status}
            isLastQuestion={isLastQuestion}
            onRevealAnswer={handleReveal}
            onShowLeaderboard={handleShowLeaderboard}
            onNextQuestion={handleNext}
            onEndGame={handleEnd}
            isLoading={isAdvancing}
          />
        </div>
      </main>
    </div>
  );
}
