'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function PlayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Play Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#10172A]/90 border border-white/[0.08] shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Связь с комнатой прервана</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Не удалось синхронизировать данные с сервером викторины. Попробуйте обновить подключение.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={() => reset()} size="lg" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Переподключиться
          </Button>

          <Link href="/play">
            <Button variant="secondary" size="lg" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              На страницу входа
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
