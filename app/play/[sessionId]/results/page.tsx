'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { Podium } from '@/frontend/components/podium/Podium';
import { LeaderboardList } from '@/frontend/components/leaderboard/LeaderboardList';
import { useLeaderboard } from '@/frontend/hooks/useLeaderboard';
import { usePlayerSession } from '@/frontend/hooks/usePlayerSession';
import { formatScore } from '@/frontend/lib/formatting';
import { Trophy, Sparkles, Home, Award } from 'lucide-react';

interface StudentResultsProps {
  params: Promise<{ sessionId: string }>;
}

export default function StudentResultsPage({ params }: StudentResultsProps) {
  const { sessionId } = use(params);
  const { player } = usePlayerSession(sessionId);
  const { leaderboard, isLoading } = useLeaderboard(sessionId);

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A] px-4">
        <LoadingSpinner label="Подсчет финальных итогов..." size="lg" />
      </div>
    );
  }

  const myRank = leaderboard.findIndex((e) => e.playerId === player?.id) + 1;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col justify-between p-4 sm:p-8 max-w-3xl mx-auto w-full">
      <div className="space-y-8">
        {/* Celebration Banner */}
        <div className="text-center pt-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 mb-3 shadow-[0_0_15px_rgba(255,184,0,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Викторина завершена
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Финальные итоги
          </h1>
        </div>

        {/* Player Result Summary Card */}
        {player && (
          <Card className="text-center p-6 sm:p-8 bg-gradient-to-br from-[#121A30] to-[#0D1322] border-white/10 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#4F8EF7] to-[#39D98A] flex items-center justify-center text-white shadow-[0_0_25px_rgba(79,142,247,0.4)]">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{player.nickname}</h2>
            <p className="text-xs text-slate-400 mb-5">Спасибо за участие в научной викторине!</p>

            <div className="grid grid-cols-2 gap-3.5 max-w-xs mx-auto">
              <div className="bg-white/[0.04] p-3.5 rounded-2xl border border-white/[0.08]">
                <span className="text-xs text-slate-400 block font-semibold mb-0.5">Место</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  {myRank > 0 ? `#${myRank}` : '—'}
                </span>
              </div>
              <div className="bg-white/[0.04] p-3.5 rounded-2xl border border-white/[0.08]">
                <span className="text-xs text-slate-400 block font-semibold mb-0.5">Баллы</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {formatScore(player.score)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Podium for top 3 */}
        <Podium entries={leaderboard} />

        {/* Full Leaderboard List */}
        <div className="space-y-3">
          <LeaderboardList
            entries={leaderboard}
            currentPlayerId={player?.id}
            limit={10}
          />
        </div>
      </div>

      <div className="pt-10 pb-6 text-center">
        <Link href="/">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            <Home className="w-4 h-4 mr-2" />
            На главную страницу
          </Button>
        </Link>
      </div>
    </div>
  );
}
