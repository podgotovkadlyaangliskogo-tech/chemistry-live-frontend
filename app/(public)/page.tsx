import React from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { GraduationCap, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[88dvh] px-5 text-center overflow-hidden">

        {/* Ambient: мягкое свечение янтаря сверху */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[320px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, #E8C547 0%, #9B7E1A 60%, transparent 100%)' }}
        />
        {/* Второй источник — синий снизу */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(ellipse, #5B8FF9 0%, transparent 80%)' }}
        />

        {/* Метка */}
        <span className="inline-flex items-center gap-2 mb-10 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#E8C547]/80 border border-[#E8C547]/20 bg-[#E8C547]/5 tracking-widest uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C547] opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E8C547]" />
          </span>
          Живые викторины · Химия
        </span>

        {/* Заголовок */}
        <h1
          className="font-sans font-extrabold text-[clamp(2.6rem,8vw,6rem)] leading-[0.95] tracking-[-0.03em] text-balance mb-7"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Химия,{' '}
          <span className="text-[#E8C547]">которую</span>
          <br />
          не забудешь
        </h1>

        <p className="max-w-[46ch] mx-auto text-[#71717A] text-[clamp(1rem,2.2vw,1.2rem)] leading-relaxed mb-12" style={{ textWrap: 'pretty' } as React.CSSProperties}>
          Учитель запускает викторину — ученики отвечают со смартфонов.
          Лидерборд, таймер, объяснения реакций — всё в реальном времени.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-sm mx-auto">
          <Link href="/play" className="flex-1">
            <Button size="xl" className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Я ученик
            </Button>
          </Link>
          <Link href="/teacher/login" className="flex-1">
            <Button size="xl" variant="secondary" className="w-full">
              <GraduationCap className="w-4 h-4 mr-2" />
              Я учитель
            </Button>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#F5F4F0]" />
        </div>
      </section>

      {/* ── ЦИФРЫ ──────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-16 px-5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
          {[
            { value: '20', label: 'вопросов', note: 'авторских' },
            { value: '3', label: 'уровня', note: 'от базы до олимпа' },
            { value: '<100мс', label: 'задержка', note: 'реального времени' },
            { value: '0 сек', label: 'на вход', note: 'ученику без логина' },
          ].map(({ value, label, note }) => (
            <div key={label} className="bg-[#09090B] p-7 flex flex-col gap-1">
              <span className="font-mono font-bold text-[clamp(1.6rem,4vw,2.4rem)] text-[#F5F4F0] leading-none tracking-tight">{value}</span>
              <span className="text-sm font-semibold text-[#F5F4F0]/70">{label}</span>
              <span className="text-xs text-[#71717A] mt-0.5">{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── УРОВНИ ─────────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest mb-3">Тематический блок</p>
            <h2
              className="font-sans font-extrabold text-[clamp(1.8rem,4vw,3rem)] leading-tight tracking-tight text-balance"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              «Каучук и резина»
            </h2>
            <p className="text-[#71717A] mt-3 max-w-[52ch] text-sm leading-relaxed">
              Охватывает школьную программу 10 класса, углублённый курс и олимпиадный уровень.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                tier: 'Базовый',
                count: '10 вопросов',
                pts: '1000 pts',
                time: '20 сек',
                grade: '10 класс',
                title: 'Строение и классификация',
                body: 'Натуральный каучук (цис-1,4-полиизопрен), гуттаперча (транс-изомер), физические свойства, эластичность и мономер.',
                accentBg: 'bg-emerald-500/8',
                accentBorder: 'border-emerald-500/20',
                accentText: 'text-emerald-400',
              },
              {
                tier: 'Продвинутый',
                count: '5 вопросов',
                pts: '1500 pts',
                time: '30 сек',
                grade: '11 класс / ЕГЭ',
                title: 'Вулканизация и синтез',
                body: 'Дисульфидные мостики, метод Лебедева, эбонит (перевулканизация), сополимеры бутадиен-стирола.',
                accentBg: 'bg-[#5B8FF9]/8',
                accentBorder: 'border-[#5B8FF9]/20',
                accentText: 'text-[#5B8FF9]',
              },
              {
                tier: 'Олимпиадный',
                count: '5 вопросов',
                pts: '2000 pts',
                time: '45 сек',
                grade: 'Олимпиады / ВУЗ',
                title: 'Механизмы и катализ',
                body: 'Катализаторы Циглера–Натта, стереорегулярность, свободнорадикальная и ионная полимеризация, озонолиз.',
                accentBg: 'bg-[#E8C547]/8',
                accentBorder: 'border-[#E8C547]/20',
                accentText: 'text-[#E8C547]',
              },
            ].map(({ tier, count, pts, time, grade, title, body, accentBg, accentBorder, accentText }) => (
              <div
                key={tier}
                className={`rounded-2xl border ${accentBorder} ${accentBg} p-6 flex flex-col gap-4`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest ${accentText}`}>{tier}</span>
                    <p className="text-[#71717A] text-xs mt-0.5">{count}</p>
                  </div>
                  <span className="font-mono text-xs text-[#71717A]">{pts}</span>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-base text-[#F5F4F0] leading-tight mb-2">{title}</h3>
                  <p className="text-xs text-[#71717A] leading-relaxed">{body}</p>
                </div>

                <div className={`mt-auto pt-4 border-t ${accentBorder} flex items-center justify-between text-xs text-[#71717A]`}>
                  <span>{time} на ответ</span>
                  <span className={accentText}>{grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРИМЕР ВОПРОСА ─────────────────────────────────────── */}
      <section className="py-20 px-5 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest mb-8 text-center">Как это выглядит</p>

          {/* Mockup вопроса */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111117] overflow-hidden">
            {/* Chrome bar */}
            <div className="border-b border-white/[0.06] px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#5B8FF9] text-xs font-bold">Вопрос 4 / 20</span>
                <span className="text-[#71717A] text-xs">Вулканизация</span>
              </div>
              <span className="font-mono text-xs text-[#E8C547] tabular-nums">18 сек</span>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-[#F5F4F0] font-sans font-semibold text-base sm:text-lg leading-snug mb-6 text-center">
                Какой химический элемент традиционно используется для вулканизации каучука с образованием резины?
              </p>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {[
                  { letter: 'A', text: 'Фосфор (P)', color: '#E03A3E', correct: false },
                  { letter: 'B', text: 'Хлор (Cl₂)', color: '#2D70F6', correct: false },
                  { letter: 'C', text: 'Сера (S)', color: '#D9822B', correct: true },
                  { letter: 'D', text: 'Азот (N₂)', color: '#10B981', correct: false },
                ].map(({ letter, text, color, correct }) => (
                  <div
                    key={letter}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-white transition-all ${correct ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-[#111117]' : 'opacity-40'}`}
                    style={{ backgroundColor: color + '99' }}
                  >
                    <span className="font-mono font-black text-xs opacity-70">{letter}</span>
                    <span>{text}</span>
                    {correct && <span className="ml-auto text-emerald-300 text-xs font-bold">✓</span>}
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-xs text-[#71717A] leading-relaxed">
                <span className="text-[#5B8FF9] font-semibold">Пояснение: </span>
                Сера при нагревании образует поперечные дисульфидные мостики (–S–S–) между макромолекулами полиизопрена, превращая линейный полимер в пространственную сетку — резину.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ──────────────────────────────────────── */}
      <section className="py-24 px-5 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="font-sans font-extrabold text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight mb-5 text-balance"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Запустите викторину прямо сейчас
          </h2>
          <p className="text-[#71717A] text-sm leading-relaxed mb-10">
            Создайте комнату — ученики подключаются за 10 секунд по PIN-коду с любого устройства.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link href="/teacher/login">
              <Button size="lg" className="w-full sm:w-auto">
                <GraduationCap className="w-4 h-4 mr-2" />
                Открыть панель учителя
              </Button>
            </Link>
            <Link href="/play">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Zap className="w-4 h-4 mr-2" />
                Подключиться как ученик
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
