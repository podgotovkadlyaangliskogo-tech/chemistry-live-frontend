import React from 'react';
import { Difficulty } from '@/shared/types/game.types';

export interface QuestionProgressProps {
  currentIndex: number;
  totalQuestions: number;
  difficulty?: Difficulty;
  points?: number;
}

export const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentIndex,
  totalQuestions,
  difficulty = 'easy',
  points = 1000,
}) => {
  const currentNum = currentIndex + 1;
  const progressPercent = Math.min(100, Math.round((currentNum / Math.max(1, totalQuestions)) * 100));

  const difficultyConfigs: Record<Difficulty, { label: string; badgeClass: string }> = {
    easy: {
      label: 'Базовый',
      badgeClass: 'bg-[#39D98A]/10 text-[#39D98A] border-[#39D98A]/30',
    },
    medium: {
      label: 'Продвинутый',
      badgeClass: 'bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30',
    },
    ultra_hard: {
      label: 'Олимпиадный',
      badgeClass: 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/30',
    },
  };

  const diff = difficultyConfigs[difficulty] || difficultyConfigs.easy;

  return (
    <div className="w-full">
      {/* Top progress line */}
      <div className="w-full h-1.5 rounded-full mb-3 overflow-hidden bg-white/[0.08]">
        <div
          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#4F8EF7] to-[#39D98A] shadow-[0_0_12px_rgba(79,142,247,0.7)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            Вопрос <span className="text-white font-mono font-black">{currentNum}</span> из {totalQuestions}
          </span>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${diff.badgeClass}`}>
            {diff.label}
          </span>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
          ⭐ {points} pts
        </span>
      </div>
    </div>
  );
};
