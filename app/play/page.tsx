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

// Unsplash: пробирки с цветными жидкостями
const BG_PHOTO = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80&fit=crop';

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pinParam = searchParams.get('pin');
    if (pinParam) setPin(pinParam.replace(/\D/g, '').slice(0, 6));
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) { setError('PIN должен содержать 6 цифр'); return; }
    if (nickname.trim().length < 2) { setError('Никнейм — минимум 2 символа'); return; }
    try {
      setIsLoading(true); setError(null);
      const res = await fetch('/api/players/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin_code: pin, nickname: nickname.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Не удалось войти');
      const { session, player } = data.data;
      sessionStorage.setItem(`chemistry_player_${session.id}`, JSON.stringify(player));
      router.push(`/play/${session.id}/waiting`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Фото-фон */}
      <div className="absolute inset-0">
        <img src={BG_PHOTO} alt="" className="w-full h-full object-cover" aria-hidden />
        <div className="absolute inset-0 bg-[#09090B]/75 backdrop-blur-[2px]" />
      </div>

      {/* Назад */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-10 flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        На главную
      </Link>

      {/* Карточка */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-7 py-8 shadow-2xl">
          <div className="mb-7">
            <h1 className="font-sans font-extrabold text-2xl text-white leading-tight">
              Войти в игру
            </h1>
            <p className="text-sm text-white/50 mt-1.5">
              PIN-код — на экране учителя
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
              className="w-full"
            >
              Присоединиться
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-white/30">
            Без регистрации и приложений
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StudentJoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center bg-[#09090B]">
        <div className="text-white/40 text-sm">Загрузка...</div>
      </div>
    }>
      <JoinForm />
    </Suspense>
  );
}
