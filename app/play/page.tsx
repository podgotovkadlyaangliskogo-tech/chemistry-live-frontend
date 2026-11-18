'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { PinInput } from '@/frontend/components/student/PinInput';
import { NicknameInput } from '@/frontend/components/student/NicknameInput';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { Atom, Zap, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

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
      setError(err instanceof Error ? err.message : 'Ошибка подключения к комнате');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full p-6 sm:p-9 bg-[#10172A]/90 border border-white/[0.08] shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-7">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4F8EF7] to-[#39D98A] text-white flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(79,142,247,0.4)]">
          <Atom className="w-7 h-7 animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Вход в викторину
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
          Введи 6 цифр PIN-кода, отображаемого на экране учителя
        </p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <form onSubmit={handleJoin} className="space-y-6">
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
          className="w-full font-black text-base sm:text-lg shadow-[0_0_25px_rgba(79,142,247,0.4)]"
        >
          <Zap className="w-5 h-5 mr-2 text-amber-300" />
          <span>Присоединиться к игре</span>
        </Button>
      </form>

      <div className="mt-8 pt-5 border-t border-white/[0.08] text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Мгновенный вход без регистрации и паролей</span>
        </p>
      </div>
    </Card>
  );
}

export default function StudentJoinPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-[#0A0E1A]">
      <Link
        href="/"
        className="inline-flex items-center text-xs sm:text-sm font-bold text-slate-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Вернуться на главную</span>
      </Link>

      <Suspense fallback={<Card className="max-w-md w-full p-8 text-center text-slate-400">Загрузка...</Card>}>
        <JoinForm />
      </Suspense>
    </div>
  );
}
