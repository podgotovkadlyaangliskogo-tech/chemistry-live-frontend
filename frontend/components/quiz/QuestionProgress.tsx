import React from 'react';
import { Badge } from '../ui/Badge';
import { Difficulty } from '@/shared/types/game.types';

export interface QuestionProgressProps {
  currentIndex: number;
  totalQuestions: number;
  difficulty?: Difficulty;
  points?: number;
}

export const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentIndex,
  totalQuestions,
  difficulty = 'easy',
  points = 1000,
}) => {
  const currentNum = currentIndex + 1;
  const progressPercent = Math.min(100, Math.round((currentNum / Math.max(1, totalQuestions)) * 100));

  const difficultyLabels: Record<Difficulty, { label: string; variant: 'green' | 'yellow' | 'red' }> = {
    easy: { label: 'Базовый', variant: 'green' },
    medium: { label: 'Средний', variant: 'yellow' },
    ultra_hard: { label: 'Сложный', variant: 'red' },
  };

  const diffConfig = difficultyLabels[difficulty] || difficultyLabels.easy;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-700">
            Вопрос {currentNum} из {totalQuestions}
          </span>
          <Badge variant={diffConfig.variant}>{diffConfig.label}</Badge>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          +{points} баллов
        </span>
      </div>

      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
