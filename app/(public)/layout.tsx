import React from 'react';
import Link from 'next/link';
import { Atom } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <header className="sticky top-0 z-30 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E8E5E0]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-stone-900">
                Chemistry<span className="text-blue-600">Live</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-bold text-stone-500 uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                Викторины
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/play"
              className="px-4 py-2 text-sm font-bold text-stone-700 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
            >
              Войти как ученик
            </Link>
            <Link
              href="/teacher/login"
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95"
            >
              Учителю
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="border-t border-[#E8E5E0] bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-stone-500">
          <p className="font-semibold text-stone-700 mb-1">
            Chemistry Live — Образовательная платформа по химии
          </p>
          <p>© {new Date().getFullYear()} Все права защищены. Создано для интерактивного обучения.</p>
        </div>
      </footer>
    </div>
  );
}
