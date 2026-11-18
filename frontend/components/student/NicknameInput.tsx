'use client';

import React from 'react';

export interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const NicknameInput: React.FC<NicknameInputProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2 text-center">
        Твой никнейм в игре
      </label>

      <input
        type="text"
        placeholder="Например: Менделеев"
        maxLength={20}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full text-center font-bold text-base sm:text-lg px-4 py-3.5 rounded-2xl bg-[#0A0E1A]/80 border text-white placeholder-slate-500 transition-all duration-200 outline-none ${
          error
            ? 'border-[#FF4757] focus:ring-4 focus:ring-[#FF4757]/20'
            : 'border-white/10 hover:border-white/20 focus:border-[#4F8EF7] focus:ring-4 focus:ring-[#4F8EF7]/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />

      {error && (
        <p className="mt-2 text-xs text-center font-semibold text-[#FF4757]">
          {error}
        </p>
      )}
    </div>
  );
};
