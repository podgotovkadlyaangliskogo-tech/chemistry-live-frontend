'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WaitingScreen } from '@/frontend/components/student/WaitingScreen';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { Button } from '@/frontend/components/ui/Button';
import { usePlayerSession } from '@/frontend/hooks/usePlayerSession';
import { UserX } from 'lucide-react';

interface WaitingPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function StudentWaitingPage({ params }: WaitingPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { player, session, isKicked, isLoading } = usePlayerSession(sessionId);

  // Когда ведущий начинает вопрос или игра уже идет — перенаправляем на экран вопросов
  useEffect(() => {
    if (!session) return;
    if (['question_active', 'question_review', 'leaderboard'].includes(session.status)) {
      router.push(`/play/${sessionId}/game`);
    } else if (session.status === 'game_over') {
      router.push(`/play/${sessionId}/results`);
    }
  }, [session?.status, sessionId, router]);

  if (isKicked) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[#0A0E1A]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#10172A]/90 border border-rose-500/30 text-center shadow-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <UserX className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Исключение из комнаты</h2>
          <p className="text-sm text-slate-400 mb-6">
            Ведущий исключил вас из этой игровой сессии.
          </p>
          <Link href="/play">
            <Button variant="secondary" className="w-full">
              Войти в другую комнату
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && !player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A] px-4">
        <LoadingSpinner label="Подключение к игровой комнате..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[#0A0E1A]">
      <WaitingScreen
        nickname={player ? player.nickname : 'Ученик'}
        pinCode={session?.pin_code}
      />
    </div>
  );
}
