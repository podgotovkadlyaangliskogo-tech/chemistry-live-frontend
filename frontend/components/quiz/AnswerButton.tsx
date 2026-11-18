import React from 'react';

export interface AnswerButtonProps {
  index: number;
  text: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
  isSelected?: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  statsCount?: number;
  statsPercentage?: number;
}

const SHAPES = ['▲', '◆', '●', '■'];
const LETTERS = ['A', 'B', 'C', 'D'];

const COLOR_MAP = {
  red: {
    bg: 'bg-gradient-to-br from-[#E03A3E] to-[#B31D28]',
    border: 'border-red-400/40',
    selected: 'ring-4 ring-white bg-[#E03A3E] shadow-[0_0_30px_rgba(224,58,62,0.6)] scale-[1.02]',
    badge: 'bg-black/25 text-white',
  },
  blue: {
    bg: 'bg-gradient-to-br from-[#2D70F6] to-[#1E4DC2]',
    border: 'border-blue-400/40',
    selected: 'ring-4 ring-white bg-[#2D70F6] shadow-[0_0_30px_rgba(45,112,246,0.6)] scale-[1.02]',
    badge: 'bg-black/25 text-white',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-[#D9822B] to-[#B36214]',
    border: 'border-amber-400/40',
    selected: 'ring-4 ring-white bg-[#D9822B] shadow-[0_0_30px_rgba(217,130,43,0.6)] scale-[1.02]',
    badge: 'bg-black/25 text-white',
  },
  green: {
    bg: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
    border: 'border-emerald-400/40',
    selected: 'ring-4 ring-white bg-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-[1.02]',
    badge: 'bg-black/25 text-white',
  },
};

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  index,
  text,
  color,
  isSelected = false,
  isCorrect = false,
  isRevealed = false,
  disabled = false,
  onClick,
  statsCount,
  statsPercentage,
}) => {
  const shape = SHAPES[index % SHAPES.length];
  const letter = LETTERS[index % LETTERS.length];
  const colorStyles = COLOR_MAP[color] || COLOR_MAP.blue;

  let stateClasses = colorStyles.bg;

  if (isRevealed) {
    if (isCorrect) {
      stateClasses = 'bg-gradient-to-br from-[#10B981] to-[#047857] ring-4 ring-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.7)] scale-[1.02] z-10';
    } else {
      stateClasses = 'opacity-30 bg-slate-800 border border-white/5 grayscale';
    }
  } else if (isSelected) {
    stateClasses = colorStyles.selected;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full text-left p-5 sm:p-6 rounded-3xl text-white shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[105px] sm:min-h-[135px] select-none border border-white/10 ${stateClasses} ${
        disabled && !isRevealed
          ? 'cursor-not-allowed opacity-90'
          : 'cursor-pointer hover:brightness-110 active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl drop-shadow-md">{shape}</span>
          <span className={`px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black tracking-wider ${colorStyles.badge}`}>
            {letter}
          </span>
        </div>
        {isSelected && (
          <span className="bg-white text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-md animate-bounce">
            Твой выбор
          </span>
        )}
        {isRevealed && isCorrect && (
          <span className="bg-white text-emerald-800 text-xs sm:text-sm font-black px-3 py-1 rounded-full shadow-md">
            ✓ Правильный ответ
          </span>
        )}
      </div>

      <div className="text-base sm:text-xl font-bold leading-snug drop-shadow-sm text-white">
        {text}
      </div>

      {statsPercentage !== undefined && (
        <div className="mt-4 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm font-bold">
          <span>{statsCount ?? 0} ответов</span>
          <span className="font-mono text-base">{Math.round(statsPercentage)}%</span>
        </div>
      )}
    </button>
  );
};
