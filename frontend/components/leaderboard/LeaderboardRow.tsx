import React from 'react';
import { LeaderboardEntry } from '@/shared/types/player.types';
import { formatScore } from '@/frontend/lib/formatting';
import { Flame, Medal } from 'lucide-react';

export interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentPlayer?: boolean;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  entry,
  isCurrentPlayer = false,
}) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black text-sm">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 border border-slate-300 flex items-center justify-center font-black text-sm">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-900 border border-amber-700/30 flex items-center justify-center font-black text-sm">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-sm">
        {rank}
      </span>
    );
  };

  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        isCurrentPlayer
          ? 'bg-blue-50/80 border-blue-300 shadow-sm'
          : 'bg-white border-stone-200 hover:border-stone-300'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {getRankBadge(entry.rank)}
        <div className="truncate">
          <span
            className={`font-bold text-sm sm:text-base ${
              isCurrentPlayer ? 'text-blue-900' : 'text-stone-800'
            }`}
          >
            {entry.nickname}
          </span>
          {isCurrentPlayer && (
            <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
              Вы
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {entry.streak > 1 && (
          <span className="hidden sm:inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500" />
            {entry.streak}
          </span>
        )}
        <span className="font-mono font-black text-base sm:text-lg text-stone-900">
          {formatScore(entry.score)}
        </span>
      </div>
    </div>
  );
};
