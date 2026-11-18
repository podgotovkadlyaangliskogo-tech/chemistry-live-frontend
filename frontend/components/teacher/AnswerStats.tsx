import React from 'react';
import { AnswerOption } from '@/shared/types/quiz.types';
import { CheckCircle2 } from 'lucide-react';

export interface AnswerStatsProps {
  options: AnswerOption[];
  counts: Record<string, number>;
  totalAnswers: number;
  correctOptionId?: string;
}

const SHAPES = ['▲', '◆', '●', '■'];

export const AnswerStats: React.FC<AnswerStatsProps> = ({
  options,
  counts,
  totalAnswers,
  correctOptionId,
}) => {
  return (
    <div className="w-full p-5 sm:p-6 rounded-3xl border border-white/[0.08] bg-[#10172A]/90 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-black text-white font-sans">Распределение ответов</h3>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full text-slate-300 bg-white/[0.06] border border-white/10">
          Всего ответило: {totalAnswers}
        </span>
      </div>

      <div className="space-y-4">
        {options.map((opt, idx) => {
          const count = counts[opt.id] || 0;
          const percentage = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
          const isCorrect = opt.id === correctOptionId || opt.is_correct;

          return (
            <div key={opt.id} className="space-y-1.5">
              <div
                className={`flex items-center justify-between text-xs sm:text-sm font-bold ${
                  isCorrect ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-sm opacity-70 shrink-0">{SHAPES[idx % SHAPES.length]}</span>
                  <span className="truncate max-w-[200px] sm:max-w-md">{opt.text}</span>
                  {isCorrect && (
                    <span className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-md bg-[#39D98A]/20 text-[#39D98A] border border-[#39D98A]/30 shrink-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Верно
                    </span>
                  )}
                </div>
                <span className={`font-mono font-black shrink-0 ml-3 ${isCorrect ? 'text-emerald-400' : 'text-white'}`}>
                  {count} ({percentage}%)
                </span>
              </div>

              {/* Animated bar */}
              <div className="w-full h-3 rounded-full overflow-hidden bg-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isCorrect
                      ? 'bg-gradient-to-r from-[#39D98A] to-[#10B981] shadow-[0_0_12px_rgba(57,217,138,0.6)]'
                      : 'bg-slate-600/50'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
