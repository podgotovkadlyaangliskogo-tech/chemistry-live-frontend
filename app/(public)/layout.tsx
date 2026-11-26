import React from 'react';
import Link from 'next/link';
import { FlaskConical } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-[#F5F4F0]">
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-5 sm:px-10">
        {/* Стеклянный фон только когда контент под ним */}
        <div className="absolute inset-0 bg-[#09090B]/70 backdrop-blur-md border-b border-white/[0.06]" />

        <div className="relative max-w-6xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <FlaskConical className="w-5 h-5 text-[#E8C547] group-hover:scale-110 transition-transform" />
            <span className="font-sans font-bold text-base text-[#F5F4F0]">
              Chemistry<span className="text-[#E8C547]">Live</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1.5">
            <Link
              href="/play"
              className="px-4 py-2 text-sm font-medium text-[#71717A] hover:text-[#F5F4F0] rounded-lg hover:bg-white/[0.05] transition-all"
            >
              Войти по PIN
            </Link>
            <Link
              href="/teacher/login"
              className="px-4 py-2 text-sm font-semibold text-[#09090B] bg-[#E8C547] hover:bg-[#f0d060] rounded-lg transition-colors"
            >
              Панель учителя
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-4 h-4 text-[#E8C547]" />
            <span className="font-sans font-semibold text-sm text-[#F5F4F0]">
              Chemistry<span className="text-[#E8C547]">Live</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#71717A]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Realtime · Supabase
            </span>
            <span>20 вопросов · «Каучук и резина»</span>
            <span>Формат Kahoot</span>
          </div>

          <p className="text-xs text-[#71717A]">
            © {new Date().getFullYear()} Chemistry Live
          </p>
        </div>
      </footer>
    </div>
  );
}
