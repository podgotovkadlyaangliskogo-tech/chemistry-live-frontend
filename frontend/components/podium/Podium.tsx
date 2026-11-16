'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PodiumPlace } from './PodiumPlace';
import { LeaderboardEntry } from '@/shared/types/player.types';

export interface PodiumProps {
  entries: LeaderboardEntry[];
}

export const Podium: React.FC<PodiumProps> = ({ entries }) => {
  const first = entries[0];
  const second = entries[1];
  const third = entries[2];

  useEffect(() => {
    // Fire festive confetti
    try {
      const end = Date.now() + 2 * 1000;
      const colors = ['#3B82F6', '#22C55E', '#EAB308', '#EF4444'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // Fallback if canvas is not supported
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto pt-6 px-4">
      {/* 2nd on left, 1st in center, 3rd on right */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 h-64 sm:h-72">
        <PodiumPlace entry={second} place={2} />
        <PodiumPlace entry={first} place={1} />
        <PodiumPlace entry={third} place={3} />
      </div>
    </div>
  );
};
