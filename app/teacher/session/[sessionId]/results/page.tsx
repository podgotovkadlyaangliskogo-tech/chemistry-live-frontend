'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { Podium } from '@/frontend/components/podium/Podium';
import { LeaderboardList } from '@/frontend/components/leaderboard/LeaderboardList';
import { useLeaderboard } from '@/frontend/hooks/useLeaderboard';
import { formatScore } from '@/frontend/lib/formatting';
import { Trophy, ArrowLeft, Sparkles, Home } from 'lucide-react';

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function TeacherResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = use(params);
  const { leaderboard, results, isLoading, error, refetch } = useLeaderboard(sessionId);

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A]">
        <LoadingSpinner label="Подсчет финальных результатов викторины..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0E1A]">
        <ErrorMessage message={error} onRetry={refetch} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="secondary">Вернуться в дашборд</Button>
        </Link>
      </div>
    );
  }

  const winner = leaderboard[0];

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col">
      {/* Top Header */}
      <header className="bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-black text-lg text-white">
              Финальные итоги викторины
            </span>
          </div>

          <Link href="/teacher/dashboard">
            <Button variant="secondary" size="sm">
              В панель учителя
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 flex flex-col gap-8">
        {/* Podium celebration banner */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 mb-3 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Игра успешно завершена!
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Пьедестал почёта
          </h1>
          {winner && (
            <p className="text-sm sm:text-base text-slate-300 mt-2.5 font-medium">
              Победитель викторины:{' '}
              <span className="font-black text-[#4F8EF7] text-lg">{winner.nickname}</span> с результатом{' '}
              <span className="font-mono font-black text-emerald-400 text-lg">
                {formatScore(winner.score)} pts
              </span>
              !
            </p>
          )}
        </div>

        {/* Podium */}
        <Podium entries={leaderboard} />

        {/* Results detail table */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Полная таблица участников ({leaderboard.length})</span>
            </h3>
          </div>

          <LeaderboardList entries={leaderboard} />
        </div>
      </main>
    </div>
  );
}
