import React from 'react';

export interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  size?: 'sm' | 'md' | 'lg';
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds,
  size = 'md',
}) => {
  const percentage = Math.max(0, Math.min(100, (remainingSeconds / (totalSeconds || 1)) * 100));
  const isUrgent = remainingSeconds <= 5 && remainingSeconds > 0;

  const colorStyles = isUrgent
    ? 'text-[#FF4757] bg-[#FF4757]/15 border-[#FF4757]/40 shadow-[0_0_20px_rgba(255,71,87,0.4)] animate-pulse'
    : remainingSeconds <= 10
    ? 'text-[#FFB800] bg-[#FFB800]/15 border-[#FFB800]/40 shadow-[0_0_15px_rgba(255,184,0,0.3)]'
    : 'text-[#4F8EF7] bg-[#4F8EF7]/15 border-[#4F8EF7]/40 shadow-[0_0_15px_rgba(79,142,247,0.3)]';

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm font-bold',
    md: 'w-16 h-16 text-xl font-black',
    lg: 'w-24 h-24 text-3xl font-black',
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-2xl border-2 transition-all duration-300 font-mono ${colorStyles} ${sizeClasses[size]}`}
      >
        <span>{Math.max(0, Math.ceil(remainingSeconds))}</span>
      </div>
      {/* Progress bar below */}
      <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-2.5 overflow-hidden max-w-xs">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isUrgent
              ? 'bg-[#FF4757] shadow-[0_0_8px_rgba(255,71,87,0.8)]'
              : remainingSeconds <= 10
              ? 'bg-[#FFB800]'
              : 'bg-[#4F8EF7]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
