'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { PinInput } from '@/frontend/components/student/PinInput';
import { NicknameInput } from '@/frontend/components/student/NicknameInput';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { ArrowLeft } from 'lucide-react';

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pinParam = searchParams.get('pin');
    if (pinParam) {
      setPin(pinParam.replace(/\D/g, '').slice(0, 6));
    }
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== 6) {
      setError('PIN-код должен содержать ровно 6 цифр');
      return;
    }

    if (nickname.trim().length < 2) {
      setError('Никнейм должен содержать минимум 2 символа');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/players/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin_code: pin,
          nickname: nickname.trim(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Не удалось присоединиться к комнате');
      }

      const { session, player } = data.data;
      sessionStorage.setItem(`chemistry_player_${session.id}`, JSON.stringify(player));
      router.push(`/play/${session.id}/waiting`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения к комнате');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full px-7 py-8 bg-[#111117] border border-white/[0.07] shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
      {/* Заголовок */}
      <div className="mb-7">
        <h1 className="font-sans font-extrabold text-2xl text-[#F5F4F0] tracking-tight leading-tight">
          Вход в викторину
        </h1>
        <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
          Введи PIN-код с экрана учителя и придумай никнейм
        </p>
      </div>

      {error && <ErrorMessage message={error} className="mb-5" />}

      <form onSubmit={handleJoin} className="space-y-5">
        <PinInput value={pin} onChange={setPin} disabled={isLoading} />
        <NicknameInput value={nickname} onChange={setNickname} disabled={isLoading} />

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={pin.length !== 6 || nickname.trim().length < 2}
          className="w-full mt-1"
        >
          Войти в игру
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[#71717A]">
        Без регистрации и пароля
      </p>
    </Card>
  );
}

export default function StudentJoinPage() {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center px-4 py-10 bg-[#09090B]">
      <Link
        href="/"
        className="inline-flex items-center text-xs text-[#71717A] hover:text-[#F5F4F0] mb-6 transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
        На главную
      </Link>

      <Suspense fallback={<Card className="max-w-md w-full p-8 text-center text-[#71717A]">Загрузка...</Card>}>
        <JoinForm />
      </Suspense>
    </div>
  );
}
