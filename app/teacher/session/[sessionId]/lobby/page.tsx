'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { PlayerList } from '@/frontend/components/teacher/PlayerList';
import { useGameSession } from '@/frontend/hooks/useGameSession';
import { Play, Lock, Unlock, Copy, Check, ArrowLeft } from 'lucide-react';

interface LobbyPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function TeacherLobbyPage({ params }: LobbyPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { session, players, isLoading, error, startGame, kickPlayer } = useGameSession(sessionId);

  const [isStarting, setIsStarting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');

  useEffect(() => {
    if (session?.is_locked !== undefined) setIsLocked(session.is_locked);
  }, [session?.is_locked]);

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('chemistry_teacher_auth');
    if (!isAuth) router.push('/teacher/login');
  }, [router]);

  useEffect(() => {
    if (session?.pin_code && typeof window !== 'undefined') {
      setJoinUrl(`${window.location.origin}/play?pin=${session.pin_code}`);
    }
  }, [session?.pin_code]);

  useEffect(() => {
    if (session && session.status !== 'lobby') {
      router.push(`/teacher/session/${sessionId}/game`);
    }
  }, [session, sessionId, router]);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      // ✅ FIX: сначала POST, потом мгновенный роутер — не ждём fetchSession
      await startGame();
      router.push(`/teacher/session/${sessionId}/game`);
    } catch { setIsStarting(false); }
  };

  const handleToggleLock = async () => {
    try {
      setIsLocking(true);
      const nextState = !isLocked;
      const res = await fetch(`/api/sessions/${sessionId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: nextState }),
      });
      const data = await res.json();
      if (data.success) setIsLocked(nextState);
    } finally { setIsLocking(false); }
  };

  const handleCopyLink = () => {
    if (joinUrl) {
      navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading && !session) {
    return (
      <div className="min-h-screen bg-[#09090B] text-[#F5F4F0] flex flex-col">
        {/* Skeleton header */}
        <header className="border-b border-white/[0.06] bg-[#09090B]/90 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="w-14 h-4 rounded bg-white/[0.06] animate-pulse" />
                <div className="w-16 h-5 rounded-md bg-[#E8C547]/10 animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-8 rounded-lg bg-white/[0.06] animate-pulse" />
              <div className="w-28 h-8 rounded-lg bg-[#E8C547]/20 animate-pulse" />
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-5 py-8 flex-1 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl border border-white/[0.07] bg-[#111117] p-7 flex flex-col gap-5">
            <div className="w-32 h-3 rounded bg-white/[0.06] animate-pulse" />
            <div className="w-48 h-20 rounded-xl bg-[#E8C547]/10 animate-pulse" />
            <div className="w-40 h-3 rounded bg-white/[0.06] animate-pulse" />
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-6 flex items-center justify-center">
            <div className="w-40 h-40 rounded-xl bg-white/[0.06] animate-pulse" />
          </div>
          <div className="md:col-span-3 rounded-2xl border border-white/[0.07] bg-[#111117] p-6">
            <div className="w-28 h-4 rounded bg-white/[0.06] animate-pulse mb-4" />
            <div className="text-center py-8 text-sm text-[#71717A]">Ожидаем игроков...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#09090B]">
        <ErrorMessage message={error || 'Сессия не найдена'} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="secondary">Вернуться в дашборд</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F5F4F0] flex flex-col">

      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 z-30 bg-[#09090B]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/teacher/dashboard" className="p-2 rounded-lg text-[#71717A] hover:text-white hover:bg-white/[0.05] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Лобби</span>
              <span className="font-mono text-xs font-bold text-[#E8C547] bg-[#E8C547]/10 border border-[#E8C547]/20 px-2 py-0.5 rounded-md">
                {session.pin_code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleToggleLock} isLoading={isLocking}>
              {isLocked ? (
                <><Lock className="w-3.5 h-3.5 mr-1.5 text-[#E8C547]" />Закрыта</>
              ) : (
                <><Unlock className="w-3.5 h-3.5 mr-1.5" />Открыта</>
              )}
            </Button>
            <Button size="sm" onClick={handleStart} isLoading={isStarting} disabled={players.length === 0}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Начать ({players.length})
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 flex-1 grid md:grid-cols-3 gap-6">
        {/* PIN + ссылка */}
        <div className="md:col-span-2 rounded-2xl border border-white/[0.07] bg-[#111117] p-7 flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#71717A] uppercase tracking-widest font-mono mb-3">
              Скажите ученикам зайти на /play и ввести PIN:
            </p>
            <div className="font-mono font-black text-[clamp(3rem,10vw,5rem)] text-[#E8C547] tracking-widest tabular-nums leading-none mb-5 select-all">
              {session.pin_code}
            </div>
            <p className="text-xs text-[#71717A]">
              Или отправьте прямую ссылку:
            </p>
          </div>
          <div className="pt-5 border-t border-white/[0.07]">
            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
              {copied ? (
                <><Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />Скопировано!</>
              ) : (
                <><Copy className="w-3.5 h-3.5 mr-1.5" />Скопировать ссылку с PIN</>
              )}
            </Button>
          </div>
        </div>

        {/* QR */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-6 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-xs text-[#71717A]">QR-код для смартфонов</p>
          <div className="p-3 bg-white rounded-xl inline-block">
            {joinUrl && <QRCodeSVG value={joinUrl} size={148} level="M" includeMargin={false} />}
          </div>
          <p className="text-xs text-[#71717A]">Сканировать камерой</p>
        </div>

        {/* Список игроков */}
        <div className="md:col-span-3">
          <PlayerList players={players} onKickPlayer={kickPlayer} isLobby={true} />
        </div>
      </main>
    </div>
  );
}
