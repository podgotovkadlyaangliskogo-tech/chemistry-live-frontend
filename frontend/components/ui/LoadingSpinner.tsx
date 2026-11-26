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
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-8 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[#E8C547]`} />
      {label && <p className="text-sm text-[#71717A]">{label}</p>}
    </div>
  );
};
