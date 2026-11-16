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
      className={`flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-red-700 underline hover:text-red-900"
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
};
