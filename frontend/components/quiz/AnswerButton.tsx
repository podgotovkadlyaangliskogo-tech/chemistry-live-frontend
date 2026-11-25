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

const LETTERS = ['A', 'B', 'C', 'D'];

// Насыщенные, но не кислотные цвета — ближе к Kahoot, но чище
const COLOR_MAP = {
  red: {
    base: '#D63B3F',
    dark: '#a82c2f',
  },
  blue: {
    base: '#2D6CF5',
    dark: '#1f4fb8',
  },
  yellow: {
    base: '#D47E22',
    dark: '#a85f10',
  },
  green: {
    base: '#1A9B6A',
    dark: '#0f7050',
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
  const letter = LETTERS[index % LETTERS.length];
  const palette = COLOR_MAP[color] || COLOR_MAP.blue;

  let extraClasses = '';
  let bgStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${palette.base}, ${palette.dark})`,
  };

  if (isRevealed) {
    if (isCorrect) {
      bgStyle = { background: 'linear-gradient(135deg, #1A9B6A, #0f7050)' };
      extraClasses = 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-[#09090B] scale-[1.02]';
    } else {
      bgStyle = { background: '#1A1A24' };
      extraClasses = 'opacity-35 grayscale';
    }
  } else if (isSelected) {
    extraClasses = 'ring-2 ring-white scale-[1.02]';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full text-left px-5 py-4 rounded-2xl text-white shadow-lg transition-all duration-200 flex flex-col gap-3 select-none border border-white/10 min-h-[90px] sm:min-h-[110px] ${extraClasses} ${
        disabled && !isRevealed ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-110 active:scale-[0.98]'
      }`}
      style={bgStyle}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold opacity-70 w-5 h-5 flex items-center justify-center rounded bg-black/20">
          {letter}
        </span>
        {isSelected && !isRevealed && (
          <span className="text-xs font-bold bg-white text-[#09090B] px-2.5 py-0.5 rounded-full">
            Мой выбор
          </span>
        )}
        {isRevealed && isCorrect && (
          <span className="text-xs font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-full">
            ✓ Верно
          </span>
        )}
      </div>

      <div className="font-sans font-semibold text-sm sm:text-base leading-snug">
        {text}
      </div>

      {statsPercentage !== undefined && (
        <div className="mt-auto pt-2 border-t border-white/15 flex items-center justify-between text-xs font-mono font-bold">
          <span className="opacity-70">{statsCount ?? 0} чел.</span>
          <span>{Math.round(statsPercentage)}%</span>
        </div>
      )}
    </button>
  );
};
