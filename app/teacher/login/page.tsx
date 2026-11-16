'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Input } from '@/frontend/components/ui/Input';
import { Button } from '@/frontend/components/ui/Button';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { createClient } from '@/frontend/lib/supabase.client';
import { Atom, GraduationCap, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

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

      // Store teacher session flag locally
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FAFAF8]">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        На главную
      </Link>

      <Card className="max-w-md w-full p-8 bg-white border-stone-200 shadow-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Вход для учителя
          </h1>
          <p className="text-xs text-stone-500 mt-1.5">
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
            className="w-full mt-2 font-bold shadow-sm"
          >
            Войти в аккаунт
          </Button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <span className="relative px-3 bg-white text-xs text-stone-400 font-medium">
            или
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={handleDemoLogin}
          className="w-full font-bold border-stone-200 text-stone-800 hover:bg-stone-100"
        >
          <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
          Быстрый демо-вход преподавателя
        </Button>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Безопасная аутентификация через Supabase</span>
        </div>
      </Card>
    </div>
  );
}
