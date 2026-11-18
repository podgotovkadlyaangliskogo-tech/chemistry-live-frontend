'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WaitingScreen } from '@/frontend/components/student/WaitingScreen';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { usePlayerSession } from '@/frontend/hooks/usePlayerSession';

interface WaitingPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function StudentWaitingPage({ params }: WaitingPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { player, session, isLoading } = usePlayerSession(sessionId);

  // When game status changes to question_active, immediately navigate to game screen
  useEffect(() => {
    if (session && session.status === 'question_active') {
      router.push(`/play/${sessionId}/game`);
    } else if (session && session.status === 'game_over') {
      router.push(`/play/${sessionId}/results`);
    }
  }, [session?.status, sessionId, router]);

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
