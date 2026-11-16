import React from 'react';
import { Card } from '../ui/Card';
import { AnswerOption } from '@/shared/types/quiz.types';
import { CheckCircle2 } from 'lucide-react';

export interface AnswerStatsProps {
  options: AnswerOption[];
  counts: Record<string, number>;
  totalAnswers: number;
  correctOptionId?: string;
}

const COLOR_MAP = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  yellow: 'bg-amber-500',
  green: 'bg-emerald-500',
};

const SHAPES = ['▲', '◆', '●', '■'];

export const AnswerStats: React.FC<AnswerStatsProps> = ({
  options,
  counts,
  totalAnswers,
  correctOptionId,
}) => {
  return (
    <Card className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-stone-800">Распределение ответов</h3>
        <span className="text-xs font-semibold text-stone-500">
          Всего ответило: {totalAnswers}
        </span>
      </div>

      <div className="space-y-3">
        {options.map((opt, idx) => {
          const count = counts[opt.id] || 0;
          const percentage = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
          const isCorrect = opt.id === correctOptionId || opt.is_correct;
          const barColor = COLOR_MAP[opt.color] || 'bg-blue-500';

          return (
            <div key={opt.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{SHAPES[idx % SHAPES.length]}</span>
                  <span className="truncate max-w-[200px] sm:max-w-md">{opt.text}</span>
                  {isCorrect && (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Верно
                    </span>
                  )}
                </div>
                <span>
                  {count} ({percentage}%)
                </span>
              </div>

              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-stone-200">
                <div
                  className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
