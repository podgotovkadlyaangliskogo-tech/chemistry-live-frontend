import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Загрузка...',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-[#4F8EF7]`} />
        <div className="absolute inset-0 rounded-full blur-md bg-[#4F8EF7]/40 pointer-events-none" />
      </div>
      {label && <p className="text-sm font-semibold text-slate-300">{label}</p>}
    </div>
  );
};
