import React from 'react';
import { Button } from '../ui/Button';
import { GameStatus } from '@/shared/types/game.types';
import { Eye, ArrowRight, Trophy, StopCircle } from 'lucide-react';

export interface QuestionControlProps {
  status: GameStatus;
  isLastQuestion: boolean;
  onRevealAnswer: () => void;
  onShowLeaderboard: () => void;
  onNextQuestion: () => void;
  onEndGame: () => void;
  isLoading?: boolean;
}

export const QuestionControl: React.FC<QuestionControlProps> = ({
  status,
  isLastQuestion,
  onRevealAnswer,
  onShowLeaderboard,
  onNextQuestion,
  onEndGame,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 p-4 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-sm">
      {status === 'question_active' && (
        <Button
          variant="secondary"
          onClick={onRevealAnswer}
          isLoading={isLoading}
          className="border-stone-300"
        >
          <Eye className="w-4 h-4 mr-2 text-stone-600" />
          Показать правильный ответ
        </Button>
      )}

      {status === 'question_review' && (
        <Button
          variant="primary"
          onClick={onShowLeaderboard}
          isLoading={isLoading}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Показать таблицу лидеров
        </Button>
      )}

      {status === 'leaderboard' && !isLastQuestion && (
        <Button
          variant="primary"
          onClick={onNextQuestion}
          isLoading={isLoading}
        >
          <span>Следующий вопрос</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}

      {(status === 'leaderboard' || status === 'question_review') && isLastQuestion && (
        <Button
          variant="primary"
          onClick={onEndGame}
          isLoading={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Завершить игру и показать подиум
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onEndGame}
        className="text-stone-500 hover:text-red-600"
      >
        <StopCircle className="w-4 h-4 mr-1.5" />
        Завершить досрочно
      </Button>
    </div>
  );
};
