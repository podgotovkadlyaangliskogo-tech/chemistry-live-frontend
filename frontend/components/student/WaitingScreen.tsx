'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Sparkles, Atom } from 'lucide-react';

export interface WaitingScreenProps {
  nickname: string;
  pinCode?: string;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ nickname, pinCode }) => {
  return (
    <Card className="max-w-md w-full mx-auto text-center p-8 bg-white/95 backdrop-blur-sm border-stone-200">
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-30" />
        <div className="relative w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-inner">
          <Atom className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        Вы в игре!
      </span>

      <h2 className="text-2xl font-black text-stone-900 mb-1">{nickname}</h2>
      {pinCode && (
        <p className="text-xs font-mono font-semibold text-stone-500 mb-6">
          Комната PIN: {pinCode}
        </p>
      )}

      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 mt-4">
        <p className="text-sm font-semibold text-stone-700">
          Ждите начала игры учителем...
        </p>
        <div className="flex justify-center gap-1.5 mt-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      <p className="text-xs text-stone-400 mt-6">
        Не закрывайте страницу — первый вопрос появится здесь автоматически
      </p>
    </Card>
  );
};
