import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-300 focus:border-blue-500 focus:ring-blue-100 hover:border-stone-400'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
