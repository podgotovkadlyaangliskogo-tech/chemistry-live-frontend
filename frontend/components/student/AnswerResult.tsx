'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, XCircle, Flame, Clock } from 'lucide-react';
import { formatScore } from '@/frontend/lib/formatting';

export interface AnswerResultProps {
  isRevealed: boolean;
  isCorrect?: boolean;
  pointsAwarded?: number;
  streak?: number;
  newScore?: number;
}

export const AnswerResult: React.FC<AnswerResultProps> = ({
  isRevealed,
  isCorrect,
  pointsAwarded = 0,
  streak = 0,
  newScore,
}) => {
  if (!isRevealed) {
    return (
      <Card className="text-center p-6 bg-white border-stone-200 shadow-sm animate-in fade-in">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-1">Ответ принят!</h3>
        <p className="text-xs text-stone-500">
          Ждем остальных участников и показ результатов учителем
        </p>
      </Card>
    );
  }

  return (
    <Card
      className={`text-center p-6 border-2 transition-all ${
        isCorrect
          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          : 'bg-rose-50/70 border-rose-300 text-rose-950'
      }`}
    >
      <div className="flex justify-center mb-3">
        {isCorrect ? (
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <XCircle className="w-8 h-8" />
          </div>
        )}
      </div>

      <h3 className="text-2xl font-black mb-1">
        {isCorrect ? 'Правильный ответ!' : 'Неверный ответ'}
      </h3>

      <div className="mt-3 flex items-center justify-center gap-3">
        {isCorrect && (
          <span className="text-lg font-black text-emerald-700 bg-white/90 px-3 py-1 rounded-xl shadow-xs border border-emerald-200">
            +{formatScore(pointsAwarded)}
          </span>
        )}
        {streak > 1 && (
          <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg">
            <Flame className="w-4 h-4 mr-1 text-amber-600 fill-amber-500" />
            Серия {streak}
          </span>
        )}
      </div>

      {newScore !== undefined && (
        <p className="mt-4 text-xs font-semibold text-stone-600">
          Ваш общий счет: <span className="font-bold text-stone-900">{formatScore(newScore)}</span>
        </p>
      )}
    </Card>
  );
};
