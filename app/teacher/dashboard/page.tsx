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
import {
  Atom,
  PlusCircle,
  BookOpen,
  Sparkles,
  RefreshCw,
  LogOut,
  Layers
} from 'lucide-react';

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
      if (!data.success) {
        throw new Error(data.error || 'Ошибка загрузки сессий');
      }
      setSessions(data.data.sessions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Проверка авторизации преподавателя
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('chemistry_teacher_auth');
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
      if (!data.success) {
        throw new Error(data.error || 'Не удалось создать сессию');
      }

      const sessionId = data.data.session.id;
      router.push(`/teacher/session/${sessionId}/lobby`);
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
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#0A0E1A]/85 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8EF7] to-[#39D98A] flex items-center justify-center shadow-[0_0_15px_rgba(79,142,247,0.4)]">
                <Atom className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '12s' }} />
              </div>
              <span className="font-black text-lg text-white">
                Chemistry<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8EF7] to-[#39D98A]">Live</span>
              </span>
            </Link>
            <span className="text-slate-600 font-bold hidden sm:inline">/</span>
            <span className="text-xs font-bold text-slate-300 bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-lg hidden sm:inline">
              Кабинет преподавателя
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        {/* Banner with Action */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#121A30] via-[#10172A] to-[#121A30] border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.5)] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#39D98A]/10 text-[#39D98A] border border-[#39D98A]/25 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Готовый интерактивный модуль
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Тематическая викторина: «Каучук и резина»
            </h1>
            <p className="text-sm text-slate-400 max-w-xl font-normal leading-relaxed">
              20 научно выверенных вопросов с формулами, реакциями вулканизации и синтеза полимеров.
              10 базовых, 5 средних и 5 олимпиадных задач.
            </p>
          </div>

          <div className="shrink-0 relative z-10">
            <Button
              size="lg"
              onClick={handleCreateSession}
              isLoading={isCreating}
              className="w-full sm:w-auto shadow-[0_0_25px_rgba(79,142,247,0.4)]"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>Создать новую сессию</span>
            </Button>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchSessions} className="mb-6" />}

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-white">Игровые сессии</h2>
              <span className="text-xs font-bold text-slate-300 bg-white/[0.08] px-2.5 py-0.5 rounded-full font-mono">
                {sessions.length}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={fetchSessions}
              disabled={isLoading}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner label="Загрузка сессий..." />
          ) : sessions.length === 0 ? (
            <Card className="text-center py-14 px-4 border-dashed border-2 border-white/10 bg-white/[0.02]">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">У вас пока нет активных сессий</h3>
              <p className="text-sm text-slate-500 mt-1 mb-6 max-w-sm mx-auto">
                Создайте первую сессию, чтобы ученики могли подключиться по 6-значному PIN-коду
              </p>
              <Button onClick={handleCreateSession} isLoading={isCreating}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Создать сессию
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
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
