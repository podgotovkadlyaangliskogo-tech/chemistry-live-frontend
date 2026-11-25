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
  const isWarning = remainingSeconds <= 10 && remainingSeconds > 5;

  // Цвет индикатора
  const ringColor = isUrgent
    ? 'text-red-400 border-red-500/50 bg-red-500/10'
    : isWarning
    ? 'text-[#E8C547] border-[#E8C547]/50 bg-[#E8C547]/10'
    : 'text-[#5B8FF9] border-[#5B8FF9]/30 bg-[#5B8FF9]/8';

  const barColor = isUrgent
    ? 'bg-red-500'
    : isWarning
    ? 'bg-[#E8C547]'
    : 'bg-[#5B8FF9]';

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-xl border-2 font-mono font-bold tabular-nums transition-colors duration-300 ${ringColor} ${sizeClasses[size]} ${isUrgent ? 'animate-pulse' : ''}`}
      >
        {Math.max(0, Math.ceil(remainingSeconds))}
      </div>
      <div className="w-full bg-white/[0.07] h-1 rounded-full overflow-hidden max-w-[3rem]">
        <div
          className={`h-full transition-all duration-300 rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
