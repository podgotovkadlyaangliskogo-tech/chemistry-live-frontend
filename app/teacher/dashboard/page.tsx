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
  ArrowLeft,
  RefreshCw,
  LogOut,
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
    fetchSessions();
  }, []);

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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E5E0] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <span className="font-black text-lg text-stone-900">
                Chemistry<span className="text-blue-600">Live</span>
              </span>
            </Link>
            <span className="text-xs font-bold text-stone-400">/</span>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              Кабинет преподавателя
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1">
        {/* Banner with Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Готовый интерактивный модуль
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Тематическая викторина: &laquo;Каучук и резина&raquo;
            </h1>
            <p className="text-sm text-blue-100 max-w-xl font-normal leading-relaxed">
              20 научно выверенных вопросов с формулами, реакциями вулканизации и синтеза полимеров.
              10 базовых, 5 средних и 5 олимпиадных задач.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              size="lg"
              onClick={handleCreateSession}
              isLoading={isCreating}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold border-none shadow-md w-full sm:w-auto"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Создать новую сессию
            </Button>
          </div>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchSessions} className="mb-6" />}

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-stone-900">Игровые сессии</h2>
              <span className="text-xs font-bold text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded-full">
                {sessions.length}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchSessions}
              disabled={isLoading}
              className="border-stone-200 text-stone-600"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner label="Загрузка сессий..." />
          ) : sessions.length === 0 ? (
            <Card className="text-center py-12 px-4 border-dashed border-2 border-stone-200 bg-stone-50/50">
              <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-700">У вас пока нет активных сессий</h3>
              <p className="text-sm text-stone-500 mt-1 mb-6 max-w-sm mx-auto">
                Создайте первую сессию, чтобы ученики могли подключиться по PIN-коду
              </p>
              <Button onClick={handleCreateSession} isLoading={isCreating}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Создать сессию
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
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
