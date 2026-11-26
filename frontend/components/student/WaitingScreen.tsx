'use client';

import React from 'react';
import { Clock } from 'lucide-react';

export interface WaitingScreenProps {
  nickname: string;
  pinCode?: string;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ nickname, pinCode }) => {
  const initial = nickname ? nickname[0].toUpperCase() : '?';

  return (
    <div className="max-w-sm w-full mx-auto text-center">
      {/* Аватар */}
      <div className="w-20 h-20 rounded-2xl bg-[#E8C547] flex items-center justify-center text-3xl font-extrabold text-[#09090B] mx-auto mb-6 shadow-[0_0_40px_rgba(232,197,71,0.35)]">
        {initial}
      </div>

      <h2 className="font-sans font-extrabold text-2xl text-white mb-1 tracking-tight">
        {nickname}
      </h2>
      <p className="text-sm text-white/40 mb-8">Вы в игре</p>

      {/* PIN */}
      {pinCode && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 mb-6 inline-block mx-auto">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">
            PIN комнаты
          </p>
          <p className="text-3xl font-mono font-bold text-[#E8C547] tracking-widest tabular-nums">
            {pinCode}
          </p>
        </div>
      )}

      {/* Индикатор ожидания */}
      <div className="flex items-center justify-center gap-2 text-sm text-white/40">
        <Clock className="w-4 h-4" />
        <span>Ожидаем начала от учителя...</span>
      </div>

      {/* Анимированные точки */}
      <div className="flex justify-center gap-2 mt-5">
        {[0, 200, 400].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-[#E8C547]/60 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>

      <p className="text-xs text-white/20 mt-8">
        Не закрывайте страницу — вопрос появится автоматически
      </p>
    </div>
  );
};
