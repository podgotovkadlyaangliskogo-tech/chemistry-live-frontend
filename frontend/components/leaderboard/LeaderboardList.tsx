import React from 'react';
import { Card } from '../ui/Card';
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
      <Card className="text-center p-8 bg-white border-stone-200">
        <Trophy className="w-8 h-8 text-stone-300 mx-auto mb-2" />
        <p className="text-sm text-stone-500">Пока никто не набрал очков</p>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 sm:p-6 bg-white border-stone-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="font-extrabold text-base sm:text-lg text-stone-900">
          Таблица лидеров
        </h3>
      </div>

      <div className="space-y-2">
        {displayEntries.map((entry) => (
          <LeaderboardRow
            key={entry.playerId}
            entry={entry}
            isCurrentPlayer={entry.playerId === currentPlayerId}
          />
        ))}
      </div>
    </Card>
  );
};
