'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { PlayerList } from '@/frontend/components/teacher/PlayerList';
import { useGameSession } from '@/frontend/hooks/useGameSession';
import {
  Play,
  Lock,
  Unlock,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface LobbyPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function TeacherLobbyPage({ params }: LobbyPageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const {
    session,
    players,
    isLoading,
    error,
    startGame,
    kickPlayer,
  } = useGameSession(sessionId);

  const [isStarting, setIsStarting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');

  useEffect(() => {
    if (session?.pin_code && typeof window !== 'undefined') {
      const origin = window.location.origin;
      setJoinUrl(`${origin}/play?pin=${session.pin_code}`);
    }
  }, [session?.pin_code]);

  // If game is active, redirect teacher to game view
  useEffect(() => {
    if (session && session.status !== 'lobby') {
      router.push(`/teacher/session/${sessionId}/game`);
    }
  }, [session, sessionId, router]);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      await startGame();
      router.push(`/teacher/session/${sessionId}/game`);
    } catch {
      setIsStarting(false);
    }
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
      if (data.success) {
        setIsLocked(nextState);
      }
    } finally {
      setIsLocking(false);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A]">
        <LoadingSpinner label="Подготовка комнаты викторины..." size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0E1A]">
        <ErrorMessage message={error || 'Сессия не найдена'} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="secondary">Вернуться в дашборд</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0A0E1A]/85 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-white">Лобби сессии</span>
              <span className="text-xs font-mono font-bold text-[#4F8EF7] bg-[#4F8EF7]/15 border border-[#4F8EF7]/30 px-2.5 py-0.5 rounded-lg">
                PIN: {session.pin_code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleLock}
              isLoading={isLocking}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4 mr-1.5 text-amber-400" />
                  <span>Комната закрыта</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>Комната открыта</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={handleStart}
              isLoading={isStarting}
              disabled={players.length === 0}
              className="bg-gradient-to-r from-[#39D98A] to-[#10B981] hover:from-[#2ecc71] hover:to-[#059669] shadow-[0_0_20px_rgba(57,217,138,0.4)]"
            >
              <Play className="w-4 h-4 mr-1.5" />
              <span>Начать игру ({players.length})</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1 flex flex-col gap-8">
        {/* Big PIN & QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Large PIN Display */}
          <div className="md:col-span-2 p-8 sm:p-10 flex flex-col justify-between rounded-3xl bg-[#10172A]/90 border border-white/[0.08] shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[#4F8EF7]/15 text-[#4F8EF7] border border-[#4F8EF7]/30">
                <Sparkles className="w-3.5 h-3.5" />
                Подключение участников к игре
              </div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Перейдите на страницу входа и введите PIN:
              </h2>
              <div className="text-5xl sm:text-7xl font-mono font-black text-white tracking-widest my-3 select-all drop-shadow-[0_0_35px_rgba(79,142,247,0.5)]">
                {session.pin_code}
              </div>
              <p className="text-sm font-medium text-slate-400">
                Ссылка для учеников:{' '}
                <span className="font-bold text-[#4F8EF7]">/play</span>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                    <span>Ссылка скопирована!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    <span>Скопировать прямую ссылку с PIN</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center rounded-3xl bg-[#10172A]/90 border border-white/[0.08] shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold text-white mb-4">
              Сканируйте камерой смартфона:
            </h3>
            <div className="p-4 bg-white rounded-2xl shadow-xl inline-block border-2 border-[#4F8EF7]/40">
              {joinUrl && (
                <QRCodeSVG
                  value={joinUrl}
                  size={160}
                  level="M"
                  includeMargin={false}
                />
              )}
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Мгновенный вход без ручного ввода PIN
            </p>
          </div>
        </div>

        {/* Players Waiting List */}
        <div className="flex-1">
          <PlayerList
            players={players}
            onKickPlayer={kickPlayer}
            isLobby={true}
          />
        </div>
      </main>
    </div>
  );
}
