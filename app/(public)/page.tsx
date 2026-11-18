import React from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import {
  Zap,
  Trophy,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Atom,
  FlaskConical,
  Flame,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Timer as TimerIcon,
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section with Frontend Mentor Inspired Visual Polish */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid background & glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#4F8EF7]/20 via-[#6366F1]/15 to-[#39D98A]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 mb-8 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39D98A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39D98A]" />
            </span>
            <span>Формат Kahoot · 20 вопросов по органической химии</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-8 font-sans">
            Учи химию через <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8EF7] via-[#60A5FA] to-[#39D98A]">
              живые викторины
            </span>{' '}
            в реальном времени
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Интерактивная научная игра для уроков химии, подготовки к олимпиадам и лекций.
            Мгновенные ответы со смартфонов, научные объяснения формул и динамический лидерборд.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            <Link href="/play" className="w-full sm:w-auto flex-1">
              <Button size="xl" className="w-full shadow-[0_0_30px_rgba(79,142,247,0.4)]">
                <Zap className="w-5 h-5 mr-2 text-amber-300" />
                <span>Войти как ученик</span>
              </Button>
            </Link>

            <Link href="/teacher/login" className="w-full sm:w-auto flex-1">
              <Button size="xl" variant="secondary" className="w-full">
                <GraduationCap className="w-5 h-5 mr-2 text-[#4F8EF7]" />
                <span>Комната учителя</span>
              </Button>
            </Link>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/[0.08]">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">20</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Авторских вопросов</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl sm:text-3xl font-black text-[#39D98A] font-mono">3</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Уровня сложности</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl sm:text-3xl font-black text-[#4F8EF7] font-mono">&lt; 100мс</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Синхронизация ответа</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl sm:text-3xl font-black text-[#FFB800] font-mono">0 сек</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Без регистрации ученику</div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics & Challenges Section (Frontend Mentor Cards Style) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/[0.08] bg-[#070A14]/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F8EF7] bg-[#4F8EF7]/10 px-3 py-1 rounded-full border border-[#4F8EF7]/20">
              Тематический блок
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4 mb-3 font-sans">
              Органическая химия: «Каучук и резина»
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Вопросы охватывают школьную программу 10 класса, углубленный курс и олимпиадный уровень
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Easy / Базовый */}
            <div className="group rounded-3xl p-7 bg-[#10172A]/80 border border-white/[0.08] hover:border-[#39D98A]/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#39D98A]/10 text-[#39D98A] border border-[#39D98A]/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39D98A]" />
                    Базовый уровень (10 вопросов)
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">1000 pts</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#39D98A] transition-colors">
                  Строение и классификация
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Натуральный каучук (цис-1,4-полиизопрен), гуттаперча (транс-изомер), физические свойства, эластичность и формула мономера.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  20 сек на ответ
                </span>
                <span className="text-emerald-400 font-semibold">10 класс</span>
              </div>
            </div>

            {/* Card 2: Medium / Средний */}
            <div className="group rounded-3xl p-7 bg-[#10172A]/80 border border-white/[0.08] hover:border-[#4F8EF7]/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#4F8EF7]/10 text-[#4F8EF7] border border-[#4F8EF7]/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7]" />
                    Продвинутый (5 вопросов)
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">1500 pts</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4F8EF7] transition-colors">
                  Вулканизация и синтез
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Дисульфидные мостики, метод Лебедева (синтез бутадиена из этанола), эбонит (перевулканизация) и сополимеры бутадиен-стирола.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  30 сек на ответ
                </span>
                <span className="text-blue-400 font-semibold">11 класс / ЕГЭ</span>
              </div>
            </div>

            {/* Card 3: Ultra Hard / Олимпиадный */}
            <div className="group rounded-3xl p-7 bg-[#10172A]/80 border border-white/[0.08] hover:border-[#FF4757]/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF4757]/10 text-[#FF4757] border border-[#FF4757]/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4757]" />
                    Олимпиадный (5 вопросов)
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">2000 pts</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF4757] transition-colors">
                  Механизмы и катализ
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Катализаторы Циглера-Натта, стереорегулярность, свободнорадикальная и ионная полимеризация диенов, озонолиз каучука.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  45 сек на ответ
                </span>
                <span className="text-rose-400 font-semibold">Олимпиады / ВУЗ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Gameplay Demo Teaser */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#121A30] to-[#0A0E1A] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-[#4F8EF7]/15 text-[#4F8EF7] font-mono text-xs font-bold">
                  Вопрос 4 из 20
                </span>
                <span className="text-xs text-slate-400">Тема: Вулканизация</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                <Clock className="w-3.5 h-3.5" />
                <span>18 сек</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white text-center mb-8 leading-snug">
              Какой химический элемент традиционно используется для вулканизации каучука с образованием резины?
            </h3>

            {/* 4 Answers Grid preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/90 to-red-600/90 text-white font-bold text-base flex items-center gap-3 shadow-md">
                <span className="text-xl">▲</span>
                <span>Фосфор (P)</span>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white font-bold text-base flex items-center gap-3 shadow-md">
                <span className="text-xl">◆</span>
                <span>Хлор (Cl₂)</span>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white font-bold text-base flex items-center gap-3 shadow-md ring-2 ring-emerald-400">
                <span className="text-xl">●</span>
                <span className="flex-1">Сера (S)</span>
                <span className="text-xs font-extrabold bg-white text-emerald-700 px-2 py-0.5 rounded-full">
                  ✓ Правильно
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 text-white font-bold text-base flex items-center gap-3 shadow-md">
                <span className="text-xl">■</span>
                <span>Азот (N₂)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-[#4F8EF7] mr-1">Научное пояснение:</span>
              Сера при нагревании с каучуком образует поперечные дисульфидные мостики (-S-S-) между макромолекулами полиизопрена, превращая линейный полимер в прочную пространственную сетку — резину.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#070A14]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#4F8EF7] via-[#6366F1] to-[#39D98A] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(79,142,247,0.5)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-sans">
            Готовы провести викторину в классе?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Создайте комнату в один клик. Ученикам достаточно отсканировать QR-код или ввести 6 цифр на телефоне.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/teacher/login" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto shadow-[0_0_30px_rgba(79,142,247,0.4)]">
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>Открыть панель учителя</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/play" className="w-full sm:w-auto">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2 text-amber-400" />
                <span>Подключиться как ученик</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
