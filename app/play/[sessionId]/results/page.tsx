'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { Podium } from '@/frontend/components/podium/Podium';
import { LeaderboardList } from '@/frontend/components/leaderboard/LeaderboardList';
import { useLeaderboard } from '@/frontend/hooks/useLeaderboard';
import { usePlayerSession } from '@/frontend/hooks/usePlayerSession';
import { formatScore } from '@/frontend/lib/formatting';
import { Trophy, Home } from 'lucide-react';

interface StudentResultsProps {
  params: Promise<{ sessionId: string }>;
}

export default function StudentResultsPage({ params }: StudentResultsProps) {
  const { sessionId } = use(params);
  const { player } = usePlayerSession(sessionId);
  const { leaderboard, isLoading } = useLeaderboard(sessionId);

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
        <LoadingSpinner label="Подсчёт финальных итогов..." size="lg" />
      </div>
    );
  }

  const myRank = leaderboard.findIndex((e) => e.playerId === player?.id) + 1;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F5F4F0] flex flex-col max-w-2xl mx-auto w-full px-4 py-10">
      {/* Заголовок */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[#E8C547] flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-7 h-7 text-[#09090B]" />
        </div>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Финальные итоги
        </h1>
        <p className="text-sm text-[#71717A]">Викторина завершена</p>
      </div>

      {/* Личный результат */}
      {player && (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-6 mb-8 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-[#E8C547] flex items-center justify-center text-2xl font-extrabold text-[#09090B] shrink-0">
            {player.nickname[0]?.toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-white text-lg">{player.nickname}</p>
            <p className="text-xs text-[#71717A] mt-0.5">Спасибо за участие!</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <span className="text-xs text-[#71717A] block mb-0.5">Место</span>
              <span className="font-mono font-bold text-xl text-[#E8C547] tabular-nums">
                {myRank > 0 ? `#${myRank}` : '—'}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-[#71717A] block mb-0.5">Баллы</span>
              <span className="font-mono font-bold text-xl text-emerald-400 tabular-nums">
                {formatScore(player.score)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Подиум */}
      <Podium entries={leaderboard} />

      {/* Лидерборд */}
      <div className="mt-6">
        <LeaderboardList entries={leaderboard} currentPlayerId={player?.id} limit={10} />
      </div>

      <div className="pt-10 text-center">
        <Link href="/">
          <Button variant="secondary" size="lg">
            <Home className="w-4 h-4 mr-2" />
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
