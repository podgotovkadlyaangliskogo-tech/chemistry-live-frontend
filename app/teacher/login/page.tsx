'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Input } from '@/frontend/components/ui/Input';
import { Button } from '@/frontend/components/ui/Button';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { createClient } from '@/frontend/lib/supabase.client';
import { GraduationCap, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Try sign-up if user doesn't exist yet in Supabase
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          throw new Error(authError.message || 'Не удалось войти в аккаунт');
        }
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0A0E1A]">
      <Link
        href="/"
        className="inline-flex items-center text-xs sm:text-sm font-bold text-slate-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Вернуться на главную</span>
      </Link>

      <Card className="max-w-md w-full p-6 sm:p-9 bg-[#10172A]/90 border border-white/[0.08] shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4F8EF7] to-[#6366F1] text-white flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(79,142,247,0.4)]">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Вход для учителя
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Управление сессиями и проведение викторин в Chemistry Live
          </p>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Электронная почта"
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

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 font-bold shadow-[0_0_20px_rgba(79,142,247,0.35)]"
          >
            Войти в систему
          </Button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <span className="relative px-3 bg-[#10172A] text-xs text-slate-500 font-semibold uppercase tracking-wider">
            или
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={handleDemoLogin}
          className="w-full font-bold text-white hover:bg-white/[0.08]"
        >
          <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
          Быстрый демо-вход преподавателя
        </Button>

        <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Безопасная аутентификация через Supabase</span>
        </div>
      </Card>
    </div>
  );
}
