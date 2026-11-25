'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { LoadingSpinner } from '@/frontend/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { SessionCard } from '@/frontend/components/teacher/SessionCard';
import { GameSession } from '@/shared/types/game.types';
import { Plus, RefreshCw, LogOut, FlaskConical } from 'lucide-react';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/sessions');
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Ошибка загрузки сессий');
      setSessions(data.data.sessions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isAuth =
      typeof window !== 'undefined' && sessionStorage.getItem('chemistry_teacher_auth');
    if (!isAuth) {
      router.push('/teacher/login');
      return;
    }
    fetchSessions();
  }, [router]);

  const handleCreateSession = async () => {
    try {
      setIsCreating(true);
      setError(null);
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Не удалось создать сессию');
      router.push(`/teacher/session/${data.data.session.id}/lobby`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка создания');
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('chemistry_teacher_auth');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F5F4F0] flex flex-col">

      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 z-30 bg-[#09090B]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <FlaskConical className="w-5 h-5 text-[#E8C547]" />
            <span className="font-sans font-bold text-[#F5F4F0] text-sm">
              Chemistry<span className="text-[#E8C547]">Live</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#F5F4F0] transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-5 py-10 flex-1">

        {/* Top banner */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest mb-2">Активный модуль</p>
            <h1 className="font-sans font-extrabold text-xl sm:text-2xl text-[#F5F4F0] leading-tight tracking-tight">
              «Каучук и резина»
            </h1>
            <p className="text-sm text-[#71717A] mt-1.5 max-w-md">
              20 вопросов · формулы реакций вулканизации · базовый, продвинутый, олимпиадный уровень
            </p>
          </div>
          <div className="shrink-0">
            <Button size="lg" onClick={handleCreateSession} isLoading={isCreating}>
              <Plus className="w-4 h-4 mr-2" />
              Создать сессию
            </Button>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchSessions} className="mb-6" />}

        {/* Sessions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-sans font-bold text-sm text-[#F5F4F0]">Сессии</h2>
              <span className="font-mono text-xs text-[#71717A] bg-white/[0.06] px-2 py-0.5 rounded-md">
                {sessions.length}
              </span>
            </div>
            <button
              onClick={fetchSessions}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#F5F4F0] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner label="Загружаем сессии..." />
          ) : sessions.length === 0 ? (
            <Card className="text-center py-16 px-5 border-dashed border border-white/[0.07] bg-transparent">
              <FlaskConical className="w-8 h-8 text-[#71717A] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#71717A]">Нет активных сессий</p>
              <p className="text-xs text-[#71717A]/60 mt-1 mb-6 max-w-xs mx-auto">
                Создайте первую сессию — ученики подключатся по PIN-коду
              </p>
              <Button onClick={handleCreateSession} isLoading={isCreating} size="sm">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Создать сессию
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {sessions.map((sess) => (
                <SessionCard key={sess.id} session={sess} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
