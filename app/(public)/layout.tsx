import React from 'react';
import Link from 'next/link';
import { Atom, Sparkles, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E1A] text-[#F0F4FF]">
      {/* Top Navigation - Frontend Mentor Style */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0A0E1A]/85 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#4F8EF7] via-[#6366F1] to-[#39D98A] flex items-center justify-center shadow-[0_0_24px_rgba(79,142,247,0.45)] group-hover:scale-105 transition-transform duration-300">
              <Atom className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '14s' }} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  Chemistry<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8EF7] to-[#39D98A]">Live</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#39D98A]/10 text-[#39D98A] border border-[#39D98A]/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39D98A] animate-ping" />
                  Live
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 hidden sm:block">
                Интерактивная научная платформа
              </span>
            </div>
          </Link>

          {/* Action Navigation */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/play"
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <span>Войти по PIN</span>
            </Link>

            <Link
              href="/teacher/login"
              className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#4F8EF7] to-[#6366F1] hover:from-[#3b7fe9] hover:to-[#5558e6] shadow-[0_0_20px_rgba(79,142,247,0.35)] hover:shadow-[0_0_28px_rgba(79,142,247,0.5)] transition-all duration-200 active:scale-95 border border-white/10 flex items-center gap-2"
            >
              <span>Панель учителя</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer - Frontend Mentor Style Clean Navy */}
      <footer className="border-t border-white/[0.08] bg-[#070A14] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F8EF7] to-[#39D98A] flex items-center justify-center">
              <Atom className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Chemistry Live</p>
              <p className="text-xs text-slate-400">
                Живые синхронные викторины по органической химии
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Realtime Supabase Engine
            </span>
            <span>20 вопросов: «Каучук и резина»</span>
            <span>Формат Kahoot Live</span>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Chemistry Live. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
