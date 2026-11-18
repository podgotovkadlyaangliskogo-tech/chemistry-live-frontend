import React from 'react';
import { LeaderboardEntry } from '@/shared/types/player.types';
import { formatScore } from '@/frontend/lib/formatting';
import { Flame } from 'lucide-react';

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
        <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(251,191,36,0.3)]">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-8 h-8 rounded-xl bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-black text-xs">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-8 h-8 rounded-xl bg-amber-700/25 text-amber-400 border border-amber-600/40 flex items-center justify-center font-black text-xs">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-xl bg-white/[0.05] text-slate-400 border border-white/5 flex items-center justify-center font-bold text-xs font-mono">
        {rank}
      </span>
    );
  };

  return (
    <div
      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
        isCurrentPlayer
          ? 'bg-[#4F8EF7]/15 border-[#4F8EF7]/50 shadow-[0_0_20px_rgba(79,142,247,0.25)]'
          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {getRankBadge(entry.rank)}
        <div className="truncate">
          <span className="font-bold text-sm sm:text-base text-white">
            {entry.nickname}
          </span>
          {isCurrentPlayer && (
            <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-[#4F8EF7] bg-[#4F8EF7]/20 border border-[#4F8EF7]/30 px-2 py-0.5 rounded-md">
              Ты
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {entry.streak > 1 && (
          <span className="hidden sm:inline-flex items-center text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
            <Flame className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" />
            {entry.streak}
          </span>
        )}
        <span className="font-mono font-black text-base sm:text-lg text-emerald-400">
          {formatScore(entry.score)}
        </span>
      </div>
    </div>
  );
};
