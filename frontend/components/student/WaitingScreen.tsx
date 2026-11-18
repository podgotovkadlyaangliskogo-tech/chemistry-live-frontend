'use client';

import React from 'react';
import { Sparkles, Atom, Clock, Users } from 'lucide-react';

export interface WaitingScreenProps {
  nickname: string;
  pinCode?: string;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ nickname, pinCode }) => {
  const initial = nickname ? nickname[0].toUpperCase() : '?';

  return (
    <div className="max-w-md w-full mx-auto text-center p-8 sm:p-10 rounded-3xl bg-[#10172A]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
      {/* Animated Atom Graphic */}
      <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#4F8EF7]/20 blur-xl animate-pulse" />
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#4F8EF7] to-[#39D98A] flex items-center justify-center shadow-[0_0_30px_rgba(79,142,247,0.5)]">
          <Atom className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '10s' }} />
        </div>
      </div>

      {/* In Game Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-5 bg-[#39D98A]/10 text-[#39D98A] border border-[#39D98A]/25">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Вы подключены к викторине!</span>
      </div>

      {/* Avatar + Nickname */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4F8EF7] to-[#6366F1] flex items-center justify-center text-xl font-black text-white shadow-lg">
          {initial}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {nickname}
        </h2>
      </div>

      {/* PIN Code Box */}
      {pinCode && (
        <div className="rounded-2xl p-4 mb-6 bg-white/[0.03] border border-white/[0.08]">
          <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
            PIN комнаты
          </p>
          <p className="text-4xl font-black font-mono tracking-widest text-[#4F8EF7] drop-shadow-[0_0_15px_rgba(79,142,247,0.4)]">
            {pinCode}
          </p>
        </div>
      )}

      {/* Waiting Indicator */}
      <div className="rounded-2xl p-5 bg-white/[0.02] border border-white/[0.05]">
        <p className="text-sm font-bold text-slate-300 mb-3 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-[#4F8EF7] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Ожидаем старта игры ведущим...</span>
        </p>

        <div className="flex justify-center gap-2">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2.5 h-2.5 rounded-full bg-[#4F8EF7] animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs mt-6 text-slate-500">
        Не закрывайте страницу — первый вопрос появится на экране автоматически
      </p>
    </div>
  );
};
