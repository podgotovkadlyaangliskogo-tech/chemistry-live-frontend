'use client';

import React from 'react';
import { CheckCircle2, XCircle, Flame, Clock } from 'lucide-react';
import { formatScore } from '@/frontend/lib/formatting';

export interface AnswerResultProps {
  isRevealed: boolean;
  isCorrect?: boolean;
  pointsAwarded?: number;
  streak?: number;
  newScore?: number;
}

export const AnswerResult: React.FC<AnswerResultProps> = ({
  isRevealed,
  isCorrect = false,
  pointsAwarded = 0,
  streak = 0,
  newScore,
}) => {
  // If answered but question is not revealed yet
  if (!isRevealed) {
    return (
      <div className="w-full text-center p-6 rounded-3xl bg-[#10172A]/90 backdrop-blur-xl border border-white/[0.08] shadow-xl animate-in fade-in duration-300">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#4F8EF7]/15 border border-[#4F8EF7]/30 flex items-center justify-center">
          <Clock className="w-6 h-6 text-[#4F8EF7] animate-pulse" />
        </div>
        <h3 className="text-lg font-black text-white mb-1">Ответ принят!</h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Ждем остальных участников и раскрытие правильного ответа
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full text-center p-6 sm:p-7 rounded-3xl backdrop-blur-xl border shadow-xl transition-all duration-300 ${
        isCorrect
          ? 'bg-[#39D98A]/10 border-[#39D98A]/40 shadow-[0_0_35px_rgba(57,217,138,0.2)]'
          : 'bg-[#FF4757]/10 border-[#FF4757]/40 shadow-[0_0_35px_rgba(255,71,87,0.2)]'
      }`}
    >
      {/* Result Icon */}
      <div className="flex justify-center mb-3">
        {isCorrect ? (
          <div className="w-16 h-16 rounded-2xl bg-[#39D98A]/20 flex items-center justify-center shadow-[0_0_24px_rgba(57,217,138,0.5)]">
            <CheckCircle2 className="w-9 h-9 text-[#39D98A]" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-[#FF4757]/20 flex items-center justify-center shadow-[0_0_24px_rgba(255,71,87,0.5)]">
            <XCircle className="w-9 h-9 text-[#FF4757]" />
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
        {isCorrect ? 'Точно в цель!' : 'Неверный ответ'}
      </h3>

      {/* Points & Streak Badges */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {isCorrect && (
          <span className="text-xl sm:text-2xl font-black font-mono px-4 py-1.5 rounded-2xl bg-[#39D98A]/20 text-[#39D98A] border border-[#39D98A]/30 shadow-[0_0_15px_rgba(57,217,138,0.4)]">
            +{formatScore(pointsAwarded)} pts
          </span>
        )}

        {streak > 1 && (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black px-3 py-1.5 rounded-2xl bg-amber-400/15 text-amber-300 border border-amber-400/30">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            Серия: {streak} подряд
          </span>
        )}
      </div>

      {/* Total Score */}
      {newScore !== undefined && (
        <p className="mt-4 text-xs sm:text-sm font-semibold text-slate-400">
          Твой общий счет:{' '}
          <span className="font-black font-mono text-base text-white ml-1">
            {formatScore(newScore)}
          </span>
        </p>
      )}
    </div>
  );
};
