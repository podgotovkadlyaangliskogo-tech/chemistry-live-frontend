'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '@/shared/types/player.types';
import { formatScore } from '@/frontend/lib/formatting';
import { Crown, Medal } from 'lucide-react';

export interface PodiumPlaceProps {
  entry?: LeaderboardEntry;
  place: 1 | 2 | 3;
}

export const PodiumPlace: React.FC<PodiumPlaceProps> = ({ entry, place }) => {
  const configs = {
    1: {
      height: 'h-48 sm:h-56',
      bg: 'bg-amber-100 border-amber-300 text-amber-900',
      podiumBg: 'bg-gradient-to-t from-amber-400 to-amber-300 text-stone-900',
      icon: <Crown className="w-8 h-8 text-amber-500 fill-amber-400 mx-auto" />,
      delay: 0.5,
      label: '1 место',
      scale: 'scale-105',
    },
    2: {
      height: 'h-36 sm:h-44',
      bg: 'bg-slate-100 border-slate-300 text-slate-800',
      podiumBg: 'bg-gradient-to-t from-slate-300 to-slate-200 text-stone-800',
      icon: <Medal className="w-7 h-7 text-slate-400 fill-slate-300 mx-auto" />,
      delay: 0.3,
      label: '2 место',
      scale: '',
    },
    3: {
      height: 'h-28 sm:h-36',
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      podiumBg: 'bg-gradient-to-t from-amber-300 to-amber-200 text-amber-950',
      icon: <Medal className="w-6 h-6 text-amber-700/60 fill-amber-700/30 mx-auto" />,
      delay: 0.1,
      label: '3 место',
      scale: '',
    },
  };

  const config = configs[place];

  if (!entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-end">
        <div className="w-full text-center text-xs text-stone-400 mb-2">—</div>
        <div className={`w-full ${config.height} bg-stone-100 rounded-t-2xl border border-stone-200 flex items-center justify-center text-stone-300 font-bold`}>
          {place}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: config.delay, type: 'spring' }}
      className={`flex-1 flex flex-col items-center justify-end ${config.scale}`}
    >
      <div className="text-center mb-3">
        {config.icon}
        <h4 className="font-extrabold text-sm sm:text-lg text-stone-900 mt-1 truncate max-w-[110px] sm:max-w-[150px]">
          {entry.nickname}
        </h4>
        <span className="font-mono font-black text-xs sm:text-sm text-stone-600">
          {formatScore(entry.score)}
        </span>
      </div>

      <div
        className={`w-full ${config.height} ${config.podiumBg} rounded-t-2xl shadow-md border-t-2 border-white/60 flex flex-col items-center justify-center p-2 font-black`}
      >
        <span className="text-2xl sm:text-4xl opacity-90">{place}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-wider opacity-75">
          {config.label}
        </span>
      </div>
    </motion.div>
  );
};
