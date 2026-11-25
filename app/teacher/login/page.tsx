'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/frontend/components/ui/Card';
import { Input } from '@/frontend/components/ui/Input';
import { Button } from '@/frontend/components/ui/Button';
import { ErrorMessage } from '@/frontend/components/ui/ErrorMessage';
import { createClient } from '@/frontend/lib/supabase.client';
import { ArrowLeft } from 'lucide-react';

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
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
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
    <div className="min-h-dvh flex flex-col justify-center items-center px-4 py-12 bg-[#09090B]">
      <Link
        href="/"
        className="inline-flex items-center text-xs text-[#71717A] hover:text-[#F5F4F0] mb-6 transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
        На главную
      </Link>

      <Card className="max-w-md w-full px-7 py-8 bg-[#111117] border border-white/[0.07] shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        <div className="mb-7">
          <h1 className="font-sans font-extrabold text-2xl text-[#F5F4F0] tracking-tight leading-tight">
            Кабинет учителя
          </h1>
          <p className="text-sm text-[#71717A] mt-1.5">
            Войдите, чтобы создавать и запускать викторины
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.07]" />
          </div>
          <span className="relative px-3 bg-[#111117] text-xs text-[#71717A] flex justify-center">
            или
          </span>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={handleDemoLogin}
          className="w-full"
        >
          Быстрый демо-вход
        </Button>

        <p className="mt-6 text-center text-xs text-[#71717A]">
          Аутентификация через Supabase Auth
        </p>
      </Card>
    </div>
  );
}
