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

  const colorClass = isUrgent
    ? 'text-red-600 bg-red-50 border-red-300'
    : remainingSeconds <= 10
    ? 'text-amber-600 bg-amber-50 border-amber-300'
    : 'text-blue-600 bg-blue-50 border-blue-200';

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm font-bold',
    md: 'w-16 h-16 text-xl font-black',
    lg: 'w-24 h-24 text-3xl font-black',
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-full border-2 transition-all duration-300 ${colorClass} ${sizeClasses[size]}`}
      >
        <span>{Math.max(0, Math.ceil(remainingSeconds))}</span>
      </div>
      {/* Progress bar below */}
      <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden max-w-xs">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isUrgent ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
