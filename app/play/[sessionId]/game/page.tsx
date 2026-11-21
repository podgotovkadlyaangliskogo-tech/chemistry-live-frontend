'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { Button } from '@/frontend/components/ui/Button';
import { QuestionCard } from '@/frontend/components/quiz/QuestionCard';
import { AnswerButton } from '@/frontend/components/quiz/AnswerButton';
import { CountdownTimer } from '@/frontend/components/quiz/CountdownTimer';
import { QuestionProgress } from '@/frontend/components/quiz/QuestionProgress';
import { AnswerResult } from '@/frontend/components/student/AnswerResult';
import { usePlayerSession } from '@/frontend/hooks/usePlayerSession';
import { useGameSession } from '@/frontend/hooks/useGameSession';
import { Flame, Trophy, Zap, ShieldCheck, UserX } from 'lucide-react';
import { formatScore } from '@/frontend/lib/formatting';

interface StudentGameProps {
  params: Promise<{ sessionId: string }>;
}

export default function StudentGamePage({ params }: StudentGameProps) {
  const { sessionId } = use(params);
  const router = useRouter();

  const {
    player,
    hasAnswered,
    lastAnswerResult,
    correctOptionId,
    isKicked,
    submitAnswer,
  } = usePlayerSession(sessionId);

  const {
    session,
    activeQuestion,
    totalQuestions,
    isLoading,
    error,
  } = useGameSession(sessionId);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset local selection when question changes
  useEffect(() => {
    setSelectedOptionId(null);
    setSubmitError(null);
  }, [session?.current_question_id]);

  // Navigate to results if game finishes, or back to waiting if game is in lobby
  useEffect(() => {
    if (session?.status === 'game_over') {
      router.push(`/play/${sessionId}/results`);
    } else if (session?.status === 'lobby') {
      router.push(`/play/${sessionId}/waiting`);
    }
  }, [session?.status, sessionId, router]);

  // Redirect to /play if player is missing
  useEffect(() => {
    if (!isLoading && !player && !isKicked) {
      router.push('/play');
    }
  }, [player, isLoading, isKicked, router]);

  const handleSelectOption = async (optionId: string) => {
    if (hasAnswered || isSubmitting || session?.status !== 'question_active') {
      return;
    }

    try {
      setSelectedOptionId(optionId);
      setIsSubmitting(true);
      setSubmitError(null);

      const startTime = session.question_start_time
        ? new Date(session.question_start_time).getTime()
        : Date.now() - 1000;
      const responseTimeMs = Math.max(0, Date.now() - startTime);

      await submitAnswer(optionId, responseTimeMs);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось отправить ответ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isKicked) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[#0A0E1A]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#10172A]/90 border border-rose-500/30 text-center shadow-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <UserX className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Исключение из комнаты</h2>
          <p className="text-sm text-slate-400 mb-6">
            Ведущий исключил вас из этой игровой сессии.
          </p>
          <Link href="/play">
            <Button variant="secondary" className="w-full">
              Войти в другую комнату
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && !activeQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A] px-4">
        <LoadingSpinner label="Загрузка вопроса..." size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0E1A]">
        <ErrorMessage message={error || 'Сессия недоступна'} />
      </div>
    );
  }

  const isRevealed =
    session.status === 'question_review' || session.status === 'leaderboard';

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col justify-between p-4 sm:p-6 max-w-3xl mx-auto w-full">
      {/* Top Header: Nickname, Streak, Score */}
      <header className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8EF7] to-[#39D98A] flex items-center justify-center text-sm font-black text-white shadow-md">
            {player?.nickname ? player.nickname[0].toUpperCase() : 'У'}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Игрок
            </span>
            <span className="font-black text-base text-white truncate">
              {player?.nickname || 'Ученик'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {player && player.streak > 1 && (
            <div className="flex items-center text-xs font-black text-amber-300 bg-amber-400/15 px-3 py-1.5 rounded-xl border border-amber-400/30">
              <Flame className="w-4 h-4 mr-1 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{player.streak}</span>
            </div>
          )}

          <div className="text-right bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Счет
            </span>
            <span className="font-mono font-black text-base sm:text-lg text-emerald-400">
              {formatScore(player?.score || 0)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Question & Timer Area */}
      <div className="flex-1 flex flex-col justify-center gap-5">
        {/* Progress & Countdown Header */}
        <div className="flex items-center justify-between gap-4 bg-[#10172A]/90 p-4 rounded-3xl border border-white/[0.08] shadow-lg">
          <div className="flex-1">
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
                size="sm"
              />
            </div>
          )}
        </div>

        {submitError && <ErrorMessage message={submitError} className="my-2" />}

        {/* Question Card */}
        {activeQuestion && (
          <QuestionCard
            text={activeQuestion.text}
            explanation={activeQuestion.explanation}
            imageUrl={activeQuestion.image_url}
            isRevealed={isRevealed}
          />
        )}

        {/* Status result if submitted or revealed */}
        {(hasAnswered || isRevealed) && (
          <AnswerResult
            isRevealed={isRevealed}
            isCorrect={lastAnswerResult?.is_correct}
            pointsAwarded={lastAnswerResult?.points_awarded}
            streak={lastAnswerResult?.new_streak || player?.streak}
            newScore={player?.score}
          />
        )}

        {/* 4 Large Mobile Touch Buttons */}
        {activeQuestion && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
              // БАГ 4 фикс: подсвечиваем правильный ответ если знаем его id (даже при timeout)
              const isCorrect = isRevealed && (
                option.id === correctOptionId ||
                (lastAnswerResult?.is_correct === true && isSelected)
              );

              return (
                <AnswerButton
                  key={option.id}
                  index={idx}
                  text={option.text}
                  color={option.color}
                  isSelected={isSelected}
                  isRevealed={isRevealed}
                  isCorrect={isCorrect}
                  disabled={hasAnswered || session.status !== 'question_active'}
                  onClick={() => handleSelectOption(option.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="pt-5 text-center text-xs text-slate-500 font-medium">
        Chemistry Live • Скорость и точность ответа определяют баллы
      </footer>
    </div>
  );
}
