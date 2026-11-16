'use client';

import React, { use, useState, useEffect } from 'react';
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
import { Atom, Users, CheckCircle2, Trophy, ArrowLeft } from 'lucide-react';

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

  if (isLoading && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <LoadingSpinner label="Загрузка сессии викторины..." size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAFAF8]">
        <ErrorMessage message={error || 'Сессия не найдена'} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="outline">Вернуться в дашборд</Button>
        </Link>
      </div>
    );
  }

  const isRevealed =
    session.status === 'question_review' || session.status === 'leaderboard';
  const isLeaderboardPhase = session.status === 'leaderboard';
  const isLastQuestion =
    session.current_question_index + 1 >= (totalQuestions || 20);

  const handleReveal = async () => {
    try {
      setIsAdvancing(true);
      await advanceQuestion('reveal');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleShowLeaderboard = async () => {
    try {
      setIsAdvancing(true);
      await advanceQuestion('leaderboard');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleNext = async () => {
    try {
      setIsAdvancing(true);
      await advanceQuestion('next');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleEnd = async () => {
    try {
      setIsAdvancing(true);
      await endGame();
      router.push(`/teacher/session/${sessionId}/results`);
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Game Header */}
      <header className="bg-white border-b border-[#E8E5E0] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-stone-900">
                Экран ведущего
              </span>
              <span className="font-mono text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                PIN: {session.pin_code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              <Users className="w-4 h-4 text-stone-500" />
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <div className="flex-1 w-full">
            <QuestionProgress
              currentIndex={session.current_question_index}
              totalQuestions={totalQuestions || 20}
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
        ) : (
          /* Phase: Question / Review view */
          activeQuestion && (
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
          )
        )}

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
