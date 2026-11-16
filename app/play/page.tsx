'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { PinInput } from '@/frontend/components/student/PinInput';
import { NicknameInput } from '@/frontend/components/student/NicknameInput';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { Atom, Zap, ArrowLeft, Sparkles } from 'lucide-react';

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

      // Save player info in sessionStorage
      sessionStorage.setItem(`chemistry_player_${session.id}`, JSON.stringify(player));

      router.push(`/play/${session.id}/waiting`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full p-6 sm:p-8 bg-white border-stone-200 shadow-md">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Atom className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          Вход в викторину
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Введите PIN игры, который отображается на экране учителя
        </p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <form onSubmit={handleJoin} className="space-y-5">
        <PinInput
          value={pin}
          onChange={setPin}
          disabled={isLoading}
        />

        <NicknameInput
          value={nickname}
          onChange={setNickname}
          disabled={isLoading}
        />

        <Button
          type="submit"
          size="xl"
          isLoading={isLoading}
          disabled={pin.length !== 6 || nickname.trim().length < 2}
          className="w-full font-black text-base sm:text-lg shadow-sm"
        >
          <Zap className="w-5 h-5 mr-2" />
          Присоединиться к игре
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-stone-100 text-center">
        <p className="text-xs text-stone-400">
          Присоединяясь, вы соглашаетесь с правилами честной игры
        </p>
      </div>
    </Card>
  );
}

export default function StudentJoinPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[#FAFAF8]">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        На главную
      </Link>

      <Suspense fallback={<Card className="max-w-md w-full p-8 text-center">Загрузка...</Card>}>
        <JoinForm />
      </Suspense>
    </div>
  );
}
