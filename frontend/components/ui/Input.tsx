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
          <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3.5 rounded-2xl bg-[#0A0E1A]/80 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? 'border-[#FF4757] focus:border-[#FF4757] focus:ring-[#FF4757]/30'
              : 'border-white/10 hover:border-white/20 focus:border-[#4F8EF7] focus:ring-[#4F8EF7]/30'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-2 text-xs font-semibold text-[#FF4757]">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-xs text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
