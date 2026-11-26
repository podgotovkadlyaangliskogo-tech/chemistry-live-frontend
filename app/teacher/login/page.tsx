'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/frontend/components/ui/Input';
import { Button } from '@/frontend/components/ui/Button';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { createClient } from '@/frontend/lib/supabase.client';
import { ArrowLeft } from 'lucide-react';

// Unsplash: молекулярная структура / лаборатория
const BG_PHOTO = 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=1200&q=80&fit=crop';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Заполните все поля'); return; }
    try {
      setIsLoading(true); setError(null);
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw new Error(authError.message || 'Ошибка входа');
      }
      sessionStorage.setItem('chemistry_teacher_auth', 'true');
      router.push('/teacher/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    sessionStorage.setItem('chemistry_teacher_auth', 'true');
    router.push('/teacher/dashboard');
  };

  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Фото-фон */}
      <div className="absolute inset-0">
        <img src={BG_PHOTO} alt="" className="w-full h-full object-cover" aria-hidden />
        <div className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-[2px]" />
      </div>

      <Link
        href="/"
        className="absolute top-5 left-5 z-10 flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        На главную
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-7 py-8 shadow-2xl">
          <div className="mb-7">
            <h1 className="font-sans font-extrabold text-2xl text-white leading-tight">
              Кабинет учителя
            </h1>
            <p className="text-sm text-white/50 mt-1.5">
              Создавайте и запускайте викторины
            </p>
          </div>

          {error && <ErrorMessage message={error} className="mb-5" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="teacher@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-1">
              Войти
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.1]" />
            </div>
            <span className="relative flex justify-center px-3 text-xs text-white/30 bg-transparent">или</span>
          </div>

          <Button type="button" variant="secondary" size="lg" onClick={handleDemoLogin} className="w-full text-white border-white/15 bg-white/8 hover:bg-white/15">
            Быстрый демо-вход
          </Button>

          <p className="mt-5 text-center text-xs text-white/30">
            Суперbase Auth · безопасно
          </p>
        </div>
      </div>
    </div>
  );
}
