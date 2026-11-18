import React from 'react';
import { LeaderboardRow } from './LeaderboardRow';
import { LeaderboardEntry } from '@/shared/types/player.types';
import { Trophy } from 'lucide-react';

export interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  currentPlayerId?: string;
  limit?: number;
}

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  entries,
  currentPlayerId,
  limit,
}) => {
  const displayEntries = limit ? entries.slice(0, limit) : entries;

  if (entries.length === 0) {
    return (
      <div className="text-center p-8 rounded-3xl bg-[#10172A]/90 border border-white/[0.08]">
        <Trophy className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-400">Пока никто не набрал баллы</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 rounded-3xl bg-[#10172A]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-base sm:text-lg text-white font-sans">
            Таблица лидеров
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          Участников: {entries.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {displayEntries.map((entry) => (
          <LeaderboardRow
            key={entry.playerId}
            entry={entry}
            isCurrentPlayer={entry.playerId === currentPlayerId}
          />
        ))}
      </div>
    </div>
  );
};
