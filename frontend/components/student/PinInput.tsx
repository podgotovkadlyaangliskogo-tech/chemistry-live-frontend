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

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-stone-700 text-center mb-2">
        Введите 6-значный PIN игры
      </label>
      <div className="relative max-w-xs mx-auto">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          placeholder="000000"
          className="w-full text-center text-3xl sm:text-4xl font-mono font-black tracking-widest py-3.5 px-4 rounded-2xl bg-white border-2 border-stone-300 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
        />
      </div>
    </div>
  );
};
