'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/frontend/components/ui/Card';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { QuestionCard } from '@/frontend/components/quiz/QuestionCard';
import { AnswerButton } from '@/frontend/components/quiz/AnswerButton';
import { CountdownTimer } from '@/frontend/components/quiz/CountdownTimer';
import { QuestionProgress } from '@/frontend/components/quiz/QuestionProgress';
import { AnswerResult } from '@/frontend/components/student/AnswerResult';
import { usePlayerSession } from '@/frontend/hooks/usePlayerSession';
import { useGameSession } from '@/frontend/hooks/useGameSession';
import { Flame, Trophy } from 'lucide-react';
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

  // Navigate to results if game finishes
  useEffect(() => {
    if (session?.status === 'game_over') {
      router.push(`/play/${sessionId}/results`);
    }
  }, [session?.status, sessionId, router]);

  const handleSelectOption = async (optionId: string) => {
    if (hasAnswered || isSubmitting || session?.status !== 'question_active') {
      return;
    }

    try {
      setSelectedOptionId(optionId);
      setIsSubmitting(true);
      setSubmitError(null);

      // Measure response time from question start
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

  if (isLoading && !activeQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
        <LoadingSpinner label="Загрузка вопроса..." />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAFAF8]">
        <ErrorMessage message={error || 'Сессия недоступна'} />
      </div>
    );
  }

  const isRevealed =
    session.status === 'question_review' || session.status === 'leaderboard';

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between p-3 sm:p-6 max-w-2xl mx-auto w-full">
      {/* Top Header: Nickname, Score, Streak */}
      <header className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
        <div>
          <span className="text-xs font-semibold text-stone-500 block">Ученик</span>
          <span className="font-black text-base text-stone-900 truncate">
            {player?.nickname || 'Участник'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {player && player.streak > 1 && (
            <div className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Flame className="w-4 h-4 mr-1 text-amber-600 fill-amber-500" />
              <span>{player.streak}</span>
            </div>
          )}

          <div className="text-right">
            <span className="text-xs font-semibold text-stone-500 block">Счет</span>
            <span className="font-mono font-black text-base sm:text-lg text-blue-600">
              {formatScore(player?.score || 0)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Question & Timer Area */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* Progress & Timer */}
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex-1">
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
                size="sm"
              />
            </div>
          )}
        </div>

        {submitError && <ErrorMessage message={submitError} className="my-2" />}

        {/* Question Text */}
        {activeQuestion && (
          <QuestionCard
            text={activeQuestion.text}
            explanation={activeQuestion.explanation}
            imageUrl={activeQuestion.image_url}
            isRevealed={isRevealed}
          />
        )}

        {/* If submitted or revealed: show status card */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = isRevealed && (lastAnswerResult?.is_correct && isSelected);

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

      {/* Bottom Footer Note */}
      <footer className="pt-4 text-center text-xs text-stone-400">
        Chemistry Live • Быстрый и точный ответ приносит больше баллов
      </footer>
    </div>
  );
}
