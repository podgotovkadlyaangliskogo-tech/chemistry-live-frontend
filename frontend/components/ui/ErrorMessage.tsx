import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-4 bg-[#FF4757]/10 border border-[#FF4757]/30 rounded-2xl text-rose-200 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-[#FF4757] shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-bold text-[#FF4757] hover:underline cursor-pointer"
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
};
