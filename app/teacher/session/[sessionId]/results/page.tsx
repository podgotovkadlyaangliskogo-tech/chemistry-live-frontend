'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { Podium } from '@/frontend/components/podium/Podium';
import { LeaderboardList } from '@/frontend/components/leaderboard/LeaderboardList';
import { useLeaderboard } from '@/frontend/hooks/useLeaderboard';
import { formatScore } from '@/frontend/lib/formatting';
import { Trophy, ArrowLeft, Home } from 'lucide-react';

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function TeacherResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { leaderboard, isLoading, error, refetch } = useLeaderboard(sessionId);

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('chemistry_teacher_auth');
    if (!isAuth) router.push('/teacher/login');
  }, [router]);

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#09090B]">
        <LoadingSpinner label="Подсчёт финальных результатов..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#09090B]">
        <ErrorMessage message={error} onRetry={refetch} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="secondary">Вернуться в дашборд</Button>
        </Link>
      </div>
    );
  }

  const winner = leaderboard[0];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F5F4F0] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 z-30 bg-[#09090B]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/teacher/dashboard" className="p-2 rounded-lg text-[#71717A] hover:text-white hover:bg-white/[0.05] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#E8C547]" />
              <span className="font-bold text-sm text-white">Итоги викторины</span>
            </div>
          </div>
          <Link href="/teacher/dashboard">
            <Button variant="secondary" size="sm">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              В дашборд
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto px-5 py-10 flex-1 flex flex-col gap-8">
        {/* Победитель */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8C547]/10 border border-[#E8C547]/20 text-xs font-mono font-bold text-[#E8C547] uppercase tracking-widest mb-4">
            🏆 Игра завершена
          </div>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Пьедестал почёта
          </h1>
          {winner && (
            <p className="text-sm text-[#71717A] mt-2">
              Победитель:{' '}
              <span className="font-bold text-[#E8C547]">{winner.nickname}</span>
              {' · '}
              <span className="font-mono text-emerald-400">{formatScore(winner.score)} pts</span>
            </p>
          )}
        </div>

        {/* Подиум */}
        {leaderboard.length > 0 ? (
          <Podium entries={leaderboard} />
        ) : (
          <div className="text-center py-12 text-[#71717A] text-sm">
            Нет данных об игроках
          </div>
        )}

        {/* Таблица лидеров */}
        {leaderboard.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#E8C547]" />
                Все участники ({leaderboard.length})
              </h3>
              <button
                onClick={refetch}
                className="text-xs text-[#71717A] hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/[0.05]"
              >
                Обновить
              </button>
            </div>
            <LeaderboardList entries={leaderboard} />
          </div>
        )}
      </main>
    </div>
  );
}
