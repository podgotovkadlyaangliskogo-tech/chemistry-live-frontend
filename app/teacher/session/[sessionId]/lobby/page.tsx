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
  Atom,
  Play,
  Lock,
  Unlock,
  Share2,
  Users,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <LoadingSpinner label="Подготовка комнаты викторины..." size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAFAF8]">
        <ErrorMessage message={error || 'Сессия не найдена'} />
        <Link href="/teacher/dashboard" className="mt-4">
          <Button variant="outline">Вернуться в дашборд</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E8E5E0] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="text-stone-500 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-stone-900">Лобби сессии</span>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                PIN: {session.pin_code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleLock}
              isLoading={isLocking}
              className="border-stone-300"
            >
              {isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  Комната закрыта
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 mr-1.5 text-stone-600" />
                  Комната открыта
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={handleStart}
              isLoading={isStarting}
              disabled={players.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold focus:ring-emerald-500 shadow-sm"
            >
              <Play className="w-4 h-4 mr-1.5" />
              <span>Начать игру ({players.length})</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1 flex flex-col gap-8">
        {/* Big PIN and QR Code Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Large PIN Display */}
          <Card className="md:col-span-2 p-8 flex flex-col justify-between bg-gradient-to-br from-white via-white to-blue-50/30 border-blue-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Подключение участников
              </div>
              <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">
                Перейдите на страницу входа и введите PIN:
              </h2>
              <div className="text-5xl sm:text-7xl font-mono font-black text-stone-900 tracking-wider my-3 select-all">
                {session.pin_code}
              </div>
              <p className="text-sm text-stone-600 font-medium">
                Адрес для учеников: <span className="font-bold text-blue-600">/play</span>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="border-stone-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Ссылка скопирована!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    Скопировать прямую ссылку
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* QR Code */}
          <Card className="p-6 flex flex-col items-center justify-center text-center bg-white border-stone-200">
            <h3 className="text-sm font-bold text-stone-800 mb-4">
              Сканируйте камерой смартфона:
            </h3>
            <div className="p-4 bg-white rounded-2xl border-2 border-stone-200 shadow-xs inline-block">
              {joinUrl && (
                <QRCodeSVG
                  value={joinUrl}
                  size={160}
                  level="M"
                  includeMargin={false}
                />
              )}
            </div>
            <p className="text-xs text-stone-400 mt-4">
              Быстрое подключение без ввода PIN-кода
            </p>
          </Card>
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
