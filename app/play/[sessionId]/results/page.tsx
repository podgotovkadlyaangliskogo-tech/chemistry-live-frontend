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
import { Trophy, Medal, Sparkles, Home, ArrowRight } from 'lucide-react';

interface StudentResultsProps {
  params: Promise<{ sessionId: string }>;
}

export default function StudentResultsPage({ params }: StudentResultsProps) {
  const { sessionId } = use(params);
  const { player } = usePlayerSession(sessionId);
  const { leaderboard, isLoading } = useLeaderboard(sessionId);

  if (isLoading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
        <LoadingSpinner label="Подсчет финальных итогов..." size="lg" />
      </div>
    );
  }

  const myRank = leaderboard.findIndex((e) => e.playerId === player?.id) + 1;
  const isWinner = myRank === 1;

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between p-4 sm:p-8 max-w-2xl mx-auto w-full">
      <div className="space-y-6">
        {/* Celebration Banner */}
        <div className="text-center pt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Викторина завершена
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Ваш результат
          </h1>
        </div>

        {/* Player Result Summary Card */}
        {player && (
          <Card className="text-center p-6 bg-gradient-to-br from-white to-blue-50/40 border-blue-200 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 mb-1">{player.nickname}</h2>
            <p className="text-xs text-stone-500 mb-4">Спасибо за участие в викторине!</p>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Место</span>
                <span className="text-2xl font-black text-stone-900 font-mono">
                  {myRank > 0 ? `#${myRank}` : '—'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Баллы</span>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {formatScore(player.score)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Podium */}
        <Podium entries={leaderboard} />

        {/* Leaderboard */}
        <div className="space-y-2">
          <LeaderboardList
            entries={leaderboard}
            currentPlayerId={player?.id}
            limit={10}
          />
        </div>
      </div>

      <div className="pt-8 text-center">
        <Link href="/">
          <Button variant="outline" size="lg" className="border-stone-300 w-full sm:w-auto">
            <Home className="w-4 h-4 mr-2" />
            На главную страницу
          </Button>
        </Link>
      </div>
    </div>
  );
}
