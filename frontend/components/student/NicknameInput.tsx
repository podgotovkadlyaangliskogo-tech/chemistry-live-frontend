'use client';

import React from 'react';
import { Input } from '../ui/Input';

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
    <div className="w-full max-w-xs mx-auto">
      <Input
        label="Ваш никнейм"
        type="text"
        placeholder="Например: Менделеев"
        maxLength={20}
        value={value}
        error={error}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="text-center font-bold text-lg"
      />
    </div>
  );
};
