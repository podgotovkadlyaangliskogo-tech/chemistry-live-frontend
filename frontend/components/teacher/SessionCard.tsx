import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GameSession } from '@/shared/types/game.types';
import { formatDateRussian } from '@/frontend/lib/formatting';
import { Users, Play, ExternalLink } from 'lucide-react';

export interface SessionCardProps {
  session: GameSession;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const statusLabels: Record<string, { label: string; variant: 'green' | 'yellow' | 'stone' | 'red' | 'blue' }> = {
    lobby: { label: 'Лобби (ожидание)', variant: 'yellow' },
    question_active: { label: 'Идет вопрос', variant: 'green' },
    question_review: { label: 'Показ ответа', variant: 'blue' },
    leaderboard: { label: 'Таблица лидеров', variant: 'blue' },
    game_over: { label: 'Завершена', variant: 'stone' },
    cancelled: { label: 'Отменена', variant: 'red' },
  };

  const statusConfig = statusLabels[session.status] || { label: session.status, variant: 'stone' };
  const isFinished = session.status === 'game_over' || session.status === 'cancelled';
  const targetUrl = isFinished
    ? `/teacher/session/${session.id}/results`
    : session.status === 'lobby'
    ? `/teacher/session/${session.id}/lobby`
    : `/teacher/session/${session.id}/game`;

  return (
    <Card className="hover:border-stone-300 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-black font-mono tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              {session.pin_code}
            </span>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
          <p className="text-xs text-stone-500">
            Создана: {formatDateRussian(session.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={targetUrl}>
            <Button variant={isFinished ? 'outline' : 'primary'} size="sm">
              {isFinished ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Результаты
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5" />
                  Открыть сессию
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
