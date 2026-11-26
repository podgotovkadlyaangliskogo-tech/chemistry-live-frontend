'use client';

import React, { use, useState, useEffect, useRef } from 'react';
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
import { useCountUp } from '@/frontend/hooks/useCountUp';
import { Flame, UserX, Users } from 'lucide-react';
import { formatScore } from '@/frontend/lib/formatting';

interface StudentGameProps {
  params: Promise<{ sessionId: string }>;
}

export default function StudentGamePage({ params }: StudentGameProps) {
  const { sessionId } = use(params);
  const router = useRouter();

  const {
    player, session, activeQuestion, totalQuestions,
    hasAnswered, lastAnswerResult, correctOptionId,
    isKicked, isLoading, error, submitAnswer,
    answersCount, totalPlayers,
  } = usePlayerSession(sessionId);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Animated score ───────────────────────────────────────────
  const animatedScore = useCountUp(player?.score ?? 0, 700);

  // +N бонус флэш над счётом
  const [bonusFlash, setBonusFlash] = useState<number | null>(null);
  const bonusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (lastAnswerResult?.points_awarded && lastAnswerResult.points_awarded > 0) {
      setBonusFlash(lastAnswerResult.points_awarded);
      if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
      bonusTimerRef.current = setTimeout(() => setBonusFlash(null), 1800);
    }
    return () => {
      if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
    };
  }, [lastAnswerResult]);

  useEffect(() => {
    setSelectedOptionId(null);
    setSubmitError(null);
  }, [session?.current_question_id]);

  useEffect(() => {
    if (session?.status === 'game_over') router.push(`/play/${sessionId}/results`);
    else if (session?.status === 'lobby') router.push(`/play/${sessionId}/waiting`);
  }, [session?.status, sessionId, router]);

  useEffect(() => {
    if (!isLoading && !player && !isKicked) router.push('/play');
  }, [player, isLoading, isKicked, router]);

  const handleSelectOption = async (optionId: string) => {
    if (hasAnswered || isSubmitting || session?.status !== 'question_active') return;
    setSelectedOptionId(optionId);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const startTime = session.question_start_time
        ? new Date(session.question_start_time).getTime()
        : Date.now() - 1000;
      await submitAnswer(optionId, Math.max(0, Date.now() - startTime));
    } catch (err: unknown) {
      setSelectedOptionId(null);
      setSubmitError(err instanceof Error ? err.message : 'Не удалось отправить ответ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isKicked) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[#09090B]">
        <div className="max-w-sm w-full text-center p-8 rounded-2xl bg-[#111117] border border-red-500/20">
          <UserX className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="font-bold text-white text-lg mb-2">Вас исключили из комнаты</h2>
          <p className="text-sm text-[#71717A] mb-6">Ведущий исключил вас из этой сессии.</p>
          <Link href="/play"><Button variant="secondary" className="w-full">Войти в другую комнату</Button></Link>
        </div>
      </div>
    );
  }

  if (isLoading && !activeQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
        <LoadingSpinner label="Загрузка вопроса..." size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#09090B]">
        <ErrorMessage message={error || 'Сессия недоступна'} />
      </div>
    );
  }

  const isRevealed = session.status === 'question_review' || session.status === 'leaderboard';

  // Скелетон карточки вопроса (пока activeQuestion ещё грузится)
  const questionSkeleton = (
    <div className="w-full rounded-2xl bg-[#111117] border border-white/[0.07] p-6 animate-pulse">
      <div className="h-5 bg-white/[0.06] rounded-lg w-3/4 mb-3" />
      <div className="h-5 bg-white/[0.06] rounded-lg w-1/2" />
    </div>
  );

  // Скелетон кнопок ответов
  const answersSkeleton = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-16 rounded-2xl bg-[#111117] border border-white/[0.07] animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
      {/* ── HEADER ─────────────────────────── */}
      <header className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between max-w-3xl mx-auto w-full">
        {/* Игрок */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E8C547] flex items-center justify-center text-sm font-extrabold text-[#09090B]">
            {player?.nickname ? player.nickname[0].toUpperCase() : 'У'}
          </div>
          <div>
            <span className="text-[10px] text-[#71717A] block uppercase tracking-wider">Игрок</span>
            <span className="font-bold text-sm text-white truncate max-w-[120px] block">
              {player?.nickname || 'Ученик'}
            </span>
          </div>
        </div>

        {/* Счёт + серия */}
        <div className="flex items-center gap-2.5">
          {player && player.streak > 1 && (
            <div className="flex items-center text-xs font-bold text-[#E8C547] bg-[#E8C547]/10 px-2.5 py-1 rounded-lg border border-[#E8C547]/20">
              <Flame className="w-3.5 h-3.5 mr-1 fill-[#E8C547]" />
              {player.streak}
            </div>
          )}
          <div className="relative text-right bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-xl">
            {/* +N флэш над счётом */}
            {bonusFlash !== null && (
              <span
                key={bonusFlash + Date.now()}
                className="absolute -top-6 right-0 text-xs font-black font-mono text-emerald-400
                           animate-[scoreBonus_1.8s_ease-out_forwards] pointer-events-none select-none"
              >
                +{formatScore(bonusFlash)}
              </span>
            )}
            <span className="text-[10px] text-[#71717A] block uppercase tracking-wider">Счёт</span>
            <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
              {formatScore(animatedScore)}
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────── */}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-5 gap-4">
        {/* Прогресс + таймер + счётчик ответивших */}
        <div className="flex items-center justify-between gap-4 bg-[#111117] border border-white/[0.07] rounded-2xl p-4">
          <div className="flex-1">
            <QuestionProgress
              currentIndex={session.current_question_index}
              totalQuestions={totalQuestions ?? undefined}
              difficulty={activeQuestion?.difficulty}
              points={activeQuestion?.points}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Счётчик ответивших */}
            {session.status === 'question_active' && totalPlayers > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold
                              text-[#71717A] bg-white/[0.03] border border-white/[0.06]
                              px-2.5 py-1 rounded-lg">
                <Users className="w-3 h-3" />
                <span className={answersCount > 0 ? 'text-emerald-400' : ''}>
                  {answersCount}/{totalPlayers}
                </span>
              </div>
            )}

            {session.status === 'question_active' && activeQuestion && (
              <CountdownTimer
                startTime={session.question_start_time}
                timeLimitSeconds={activeQuestion.time_limit_seconds}
                size="sm"
              />
            )}
          </div>
        </div>

        {submitError && <ErrorMessage message={submitError} />}

        {/* Вопрос — сразу скелетон если грузится */}
        {activeQuestion ? (
          <QuestionCard
            text={activeQuestion.text}
            explanation={activeQuestion.explanation}
            imageUrl={activeQuestion.image_url}
            isRevealed={isRevealed}
          />
        ) : session.status === 'question_active' ? questionSkeleton : null}

        {/* Результат ответа */}
        {(hasAnswered || isRevealed) && (
          <AnswerResult
            isRevealed={isRevealed}
            isCorrect={lastAnswerResult?.is_correct}
            pointsAwarded={lastAnswerResult?.points_awarded}
            streak={lastAnswerResult?.new_streak || player?.streak}
            newScore={player?.score}
          />
        )}

        {/* 4 кнопки ответов — скелетон пока грузится */}
        {activeQuestion ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
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
                  disabled={hasAnswered || isRevealed || session.status !== 'question_active'}
                  onClick={() => handleSelectOption(option.id)}
                />
              );
            })}
          </div>
        ) : session.status === 'question_active' ? answersSkeleton : null}
      </main>

      <footer className="pb-5 text-center text-xs text-[#71717A]">
        Скорость + точность = больше баллов
      </footer>
    </div>
  );
}
