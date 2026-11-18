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
    <div className="flex flex-wrap items-center justify-end gap-3 p-4 bg-[#10172A]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-xl">
      {status === 'question_active' && (
        <Button
          variant="secondary"
          onClick={onRevealAnswer}
          isLoading={isLoading}
          className="border-white/10"
        >
          <Eye className="w-4 h-4 mr-2 text-amber-400" />
          <span>Показать правильный ответ</span>
        </Button>
      )}

      {status === 'question_review' && (
        <Button
          variant="primary"
          onClick={onShowLeaderboard}
          isLoading={isLoading}
        >
          <Trophy className="w-4 h-4 mr-2 text-amber-300" />
          <span>Показать таблицу лидеров</span>
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
          className="bg-gradient-to-r from-[#39D98A] to-[#10B981] hover:from-[#2ecc71] hover:to-[#059669] shadow-[0_0_24px_rgba(57,217,138,0.4)]"
        >
          <Trophy className="w-4 h-4 mr-2" />
          <span>Завершить игру и открыть пьедестал</span>
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onEndGame}
        className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
      >
        <StopCircle className="w-4 h-4 mr-1.5" />
        <span>Завершить досрочно</span>
      </Button>
    </div>
  );
};
