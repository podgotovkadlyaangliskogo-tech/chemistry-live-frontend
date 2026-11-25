import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GameSession } from '@/shared/types/game.types';
import { formatDateRussian } from '@/frontend/lib/formatting';
import { Play, BarChart2 } from 'lucide-react';

export interface SessionCardProps {
  session: GameSession;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const statusLabels: Record<string, { label: string; variant: 'green' | 'yellow' | 'stone' | 'red' | 'blue' }> = {
    lobby: { label: 'Лобби', variant: 'yellow' },
    question_active: { label: 'Идёт вопрос', variant: 'green' },
    question_review: { label: 'Показ ответа', variant: 'blue' },
    leaderboard: { label: 'Лидерборд', variant: 'blue' },
    game_over: { label: 'Завершена', variant: 'stone' },
    cancelled: { label: 'Отменена', variant: 'red' },
  };

  const statusConfig = statusLabels[session.status] || { label: session.status, variant: 'stone' as const };
  const isFinished = session.status === 'game_over' || session.status === 'cancelled';
  const targetUrl = isFinished
    ? `/teacher/session/${session.id}/results`
    : session.status === 'lobby'
    ? `/teacher/session/${session.id}/lobby`
    : `/teacher/session/${session.id}/game`;

  return (
    <Card className="bg-[#111117] border border-white/[0.07] hover:border-white/[0.14] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <span className="font-mono font-bold text-lg text-[#E8C547] tabular-nums tracking-widest">
              {session.pin_code}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>
            <p className="text-xs text-[#71717A]">
              {formatDateRussian(session.created_at)}
            </p>
          </div>
        </div>

        <Link href={targetUrl}>
          <Button variant={isFinished ? 'secondary' : 'outline'} size="sm">
            {isFinished ? (
              <>
                <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
                Результаты
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Открыть
              </>
            )}
          </Button>
        </Link>
      </div>
    </Card>
  );
};
