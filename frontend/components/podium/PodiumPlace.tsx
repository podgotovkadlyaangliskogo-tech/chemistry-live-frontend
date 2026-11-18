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
      podiumBg: 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 text-stone-950 border-t-2 border-amber-200 shadow-[0_0_35px_rgba(245,158,11,0.5)]',
      icon: <Crown className="w-9 h-9 text-amber-400 fill-amber-400 mx-auto drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-bounce" />,
      delay: 0.4,
      label: '1 место',
      scale: 'scale-105 z-10',
    },
    2: {
      height: 'h-36 sm:h-44',
      podiumBg: 'bg-gradient-to-t from-slate-600 via-slate-400 to-slate-200 text-stone-950 border-t-2 border-slate-100 shadow-[0_0_25px_rgba(148,163,184,0.3)]',
      icon: <Medal className="w-8 h-8 text-slate-300 fill-slate-300 mx-auto" />,
      delay: 0.2,
      label: '2 место',
      scale: '',
    },
    3: {
      height: 'h-28 sm:h-36',
      podiumBg: 'bg-gradient-to-t from-amber-900 via-amber-700 to-amber-500 text-stone-950 border-t-2 border-amber-400/80 shadow-[0_0_20px_rgba(180,83,9,0.3)]',
      icon: <Medal className="w-7 h-7 text-amber-500 fill-amber-500 mx-auto" />,
      delay: 0.1,
      label: '3 место',
      scale: '',
    },
  };

  const config = configs[place];

  if (!entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-end">
        <div className="w-full text-center text-xs text-slate-500 mb-2">—</div>
        <div className={`w-full ${config.height} bg-white/[0.03] rounded-t-3xl border border-white/5 flex items-center justify-center text-slate-600 font-bold font-mono`}>
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
        <h4 className="font-black text-sm sm:text-base text-white mt-1 truncate max-w-[100px] sm:max-w-[140px]">
          {entry.nickname}
        </h4>
        <span className="font-mono font-black text-xs sm:text-sm text-emerald-400">
          {formatScore(entry.score)}
        </span>
      </div>

      <div
        className={`w-full ${config.height} ${config.podiumBg} rounded-t-3xl shadow-2xl flex flex-col items-center justify-center p-2 font-black`}
      >
        <span className="text-3xl sm:text-5xl font-mono">{place}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold mt-1">
          {config.label}
        </span>
      </div>
    </motion.div>
  );
};
