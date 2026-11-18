'use client';

import React, { useRef } from 'react';

export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({ value, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(raw);
  };

  const digits = value.padEnd(6, ' ').split('');

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-bold text-slate-300 text-center mb-3">
        Введите 6-значный PIN код игры
      </label>

      {/* Real input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        className="sr-only"
        aria-label="PIN code"
      />

      {/* Visual digit boxes - Frontend Mentor style */}
      <div
        className="flex justify-center gap-2 sm:gap-3 cursor-text select-none"
        onClick={() => inputRef.current?.focus()}
      >
        {digits.map((digit, i) => {
          const isFilled = i < value.length;
          const isCurrent = i === value.length;
          return (
            <div
              key={i}
              className={`relative w-11 h-14 sm:w-14 sm:h-16 flex items-center justify-center rounded-2xl transition-all duration-200 border bg-[#0A0E1A]/80 backdrop-blur-md ${
                isCurrent
                  ? 'border-[#4F8EF7] ring-4 ring-[#4F8EF7]/20 shadow-[0_0_20px_rgba(79,142,247,0.3)]'
                  : isFilled
                  ? 'border-white/25 text-white'
                  : 'border-white/10 text-transparent'
              }`}
            >
              <span
                className={`text-2xl sm:text-3xl font-black font-mono transition-transform duration-150 ${
                  isFilled ? 'text-white scale-100' : 'text-slate-600 scale-90'
                }`}
              >
                {isFilled ? digit : '·'}
              </span>

              {isCurrent && !disabled && (
                <span className="absolute bottom-2.5 left-1/2 w-0.5 h-4 -translate-x-1/2 rounded-full bg-[#4F8EF7] animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
