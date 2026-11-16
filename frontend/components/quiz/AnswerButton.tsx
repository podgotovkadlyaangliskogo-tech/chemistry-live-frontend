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
    bg: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
    border: 'border-red-600',
    selected: 'ring-4 ring-red-400 bg-red-600',
    muted: 'opacity-40 bg-red-400',
    badge: 'bg-red-700 text-white',
  },
  blue: {
    bg: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
    border: 'border-blue-600',
    selected: 'ring-4 ring-blue-400 bg-blue-600',
    muted: 'opacity-40 bg-blue-400',
    badge: 'bg-blue-700 text-white',
  },
  yellow: {
    bg: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
    border: 'border-amber-600',
    selected: 'ring-4 ring-amber-300 bg-amber-600',
    muted: 'opacity-40 bg-amber-400',
    badge: 'bg-amber-700 text-white',
  },
  green: {
    bg: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700',
    border: 'border-emerald-600',
    selected: 'ring-4 ring-emerald-400 bg-emerald-600',
    muted: 'opacity-40 bg-emerald-400',
    badge: 'bg-emerald-700 text-white',
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
      stateClasses = 'bg-emerald-600 ring-4 ring-emerald-300 scale-[1.02]';
    } else {
      stateClasses = 'opacity-35 bg-stone-400';
    }
  } else if (isSelected) {
    stateClasses = colorStyles.selected;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full text-left p-4 sm:p-6 rounded-2xl text-white shadow-md transition-all duration-200 flex flex-col justify-between min-h-[90px] sm:min-h-[120px] select-none ${stateClasses} ${
        disabled && !isRevealed ? 'cursor-not-allowed opacity-80' : 'cursor-pointer active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl drop-shadow-sm">{shape}</span>
          <span className="px-2 py-0.5 rounded-md bg-black/20 text-xs sm:text-sm font-bold tracking-wider">
            {letter}
          </span>
        </div>
        {isSelected && (
          <span className="bg-white text-stone-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            Ваш выбор
          </span>
        )}
        {isRevealed && isCorrect && (
          <span className="bg-white text-emerald-700 text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
            ✓ Правильно
          </span>
        )}
      </div>

      <div className="text-base sm:text-xl font-bold leading-snug drop-shadow-sm">
        {text}
      </div>

      {statsPercentage !== undefined && (
        <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm font-semibold">
          <span>{statsCount ?? 0} ответов</span>
          <span>{Math.round(statsPercentage)}%</span>
        </div>
      )}
    </button>
  );
};
