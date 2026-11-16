'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { Podium } from '@/frontend/components/podium/Podium';
import { LeaderboardList } from '@/frontend/components/leaderboard/LeaderboardList';
import { useLeaderboard } from '@/frontend/hooks/useLeaderboard';
import { formatScore } from '@/frontend/lib/formatting';
import { Trophy, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function TeacherResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = use(params);
  const { leaderboard, results, isLoading, error, refetch } = useLeaderboard(sessionId);

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <LoadingSpinner label="Подсчет финальных результатов викторины..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAFAF8]">
        <ErrorMessage message={error} onRetry={refetch} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="outline">В дашборд</Button>
        </Link>
      </div>
    );
  }

  const winner = leaderboard[0];

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E8E5E0] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="text-stone-500 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-black text-lg text-stone-900">
              Финальные итоги викторины
            </span>
          </div>

          <Link href="/teacher/dashboard">
            <Button variant="outline" size="sm" className="border-stone-300">
              В панель учителя
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 flex flex-col gap-8">
        {/* Podium celebration banner */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Игра успешно завершена!
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Пьедестал почета
          </h1>
          {winner && (
            <p className="text-base text-stone-600 mt-2 font-medium">
              Победитель викторины: <span className="font-extrabold text-blue-600">{winner.nickname}</span> с результатом{' '}
              <span className="font-extrabold text-stone-900">{formatScore(winner.score)} очков</span>!
            </p>
          )}
        </div>

        {/* Podium component */}
        <Podium entries={leaderboard} />

        {/* Results detail table */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Полная таблица участников ({leaderboard.length})</span>
            </h3>
          </div>

          <LeaderboardList entries={leaderboard} />
        </div>
      </main>
    </div>
  );
}
