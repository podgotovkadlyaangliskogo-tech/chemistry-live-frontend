import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { GraduationCap, Zap, ChevronDown } from 'lucide-react';

// Unsplash фото — chemistry lab с колбами (прямой CDN, без hotlinking violation)
const HERO_PHOTO = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d';
const LAB_PHOTO_1 = 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c';
const LAB_PHOTO_2 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d';
const LAB_PHOTO_3 = 'https://images.unsplash.com/photo-1576086213369-97a306d36557';
const CTA_PHOTO = 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2';

export default function LandingPage() {
  return (
    <div className="flex flex-col">

      {/* ═══════════════════════════════════════════════════════
          HERO — полный экран с фото лаборатории
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">

        {/* Фоновое фото — priority: LCP element, загружается первым */}
        <div className="absolute inset-0">
          <Image
            src={HERO_PHOTO}
            alt="Chemistry laboratory"
            fill
            priority
            fetchPriority="high"
            quality={80}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Тёмный градиент поверх — делает текст читаемым */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/75 via-[#09090B]/65 to-[#09090B]" />
          {/* Дополнительный оверлей снизу */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent" />
        </div>

        {/* Контент поверх фото */}
        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center pt-20 pb-32">

          {/* Лейбл */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs text-white/70 font-mono uppercase tracking-widest">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-[#E8C547] opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#E8C547]" />
            </span>
            Органическая химия · 10–11 класс
          </div>

          <h1 className="font-sans font-extrabold text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.03em] text-white mb-6">
            Химия, которую<br />
            <span className="text-[#E8C547]">не забудешь</span>
          </h1>

          <p className="text-white/60 text-[clamp(1rem,2vw,1.2rem)] leading-relaxed max-w-[42ch] mx-auto mb-10">
            Учитель запускает викторину — ученики отвечают со смартфонов.
            Таймер, лидерборд, объяснения реакций — всё в реальном времени.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center max-w-sm mx-auto">
            <Link href="/play" className="flex-1">
              <Button size="xl" className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Я ученик
              </Button>
            </Link>
            <Link href="/teacher/login" className="flex-1">
              <Button size="xl" variant="secondary" className="w-full text-white border-white/20 bg-white/10 hover:bg-white/20">
                <GraduationCap className="w-4 h-4 mr-2" />
                Я учитель
              </Button>
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ЦИФРЫ — на фоне #09090B (seamless переход от hero)
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#09090B] py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.05]">
            {[
              { value: '20', label: 'авторских вопросов' },
              { value: '3', label: 'уровня сложности' },
              { value: '<100мс', label: 'задержка ответа' },
              { value: '0 сек', label: 'на вход ученику' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-[#09090B] px-6 py-8 flex flex-col gap-1.5">
                <span className="font-mono font-bold text-[clamp(1.4rem,3vw,2rem)] text-[#E8C547] tabular-nums leading-none">
                  {value}
                </span>
                <span className="text-xs text-[#71717A] leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          КАК ЭТО РАБОТАЕТ — фото + текст в колонках
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#09090B] py-24 px-5 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest mb-3">Как это работает</p>
            <h2 className="font-sans font-extrabold text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-tight text-[#F5F4F0]">
              Три шага до начала игры
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Учитель создаёт сессию',
                body: 'Нажимает «Создать сессию» в своём кабинете — система генерирует уникальный 6-значный PIN-код.',
                photo: LAB_PHOTO_1,
                alt: 'Teacher at computer',
              },
              {
                step: '02',
                title: 'Ученики подключаются',
                body: 'Вводят PIN с любого телефона или планшета без установки приложений и регистрации.',
                photo: LAB_PHOTO_3,
                alt: 'Students with phones',
              },
              {
                step: '03',
                title: 'Игра идёт в реальном времени',
                body: 'Таймер на экране, лидерборд обновляется после каждого вопроса, правильный ответ показывается с объяснением.',
                photo: LAB_PHOTO_2,
                alt: 'Chemistry quiz',
              },
            ].map(({ step, title, body, photo, alt }) => (
              <div key={step} className="flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] bg-[#111117]">
                {/* Фото */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={photo}
                    alt={alt}
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111117] to-transparent" />
                  <span className="absolute top-3 left-3 font-mono text-xs font-bold text-[#E8C547]/70">
                    {step}
                  </span>
                </div>
                {/* Текст */}
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="font-sans font-bold text-base text-[#F5F4F0] leading-tight">{title}</h3>
                  <p className="text-xs text-[#71717A] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ТЕМЫ ВОПРОСОВ
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#09090B] py-24 px-5 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-xs text-[#71717A] uppercase tracking-widest mb-3">Содержание</p>
            <h2 className="font-sans font-extrabold text-[clamp(1.8rem,4vw,2.8rem)] leading-tight tracking-tight text-[#F5F4F0]">
              «Каучук и резина»
            </h2>
            <p className="text-[#71717A] text-sm mt-2 max-w-[48ch]">
              20 вопросов, охватывающих программу 10–11 класса и олимпиадный уровень.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                tier: 'Базовый',
                count: '10 вопросов',
                pts: '1000 pts',
                time: '20 сек',
                grade: '10 класс',
                body: 'Строение, классификация. Натуральный каучук, гуттаперча, мономеры.',
                accent: '#1A9B6A',
              },
              {
                tier: 'Продвинутый',
                count: '5 вопросов',
                pts: '1500 pts',
                time: '30 сек',
                grade: '11 класс / ЕГЭ',
                body: 'Вулканизация серой, метод Лебедева, эбонит, сополимеры.',
                accent: '#5B8FF9',
              },
              {
                tier: 'Олимпиадный',
                count: '5 вопросов',
                pts: '2000 pts',
                time: '45 сек',
                grade: 'Олимпиады',
                body: 'Катализаторы Циглера–Натта, стереорегулярность, озонолиз.',
                accent: '#E8C547',
              },
            ].map(({ tier, count, pts, time, grade, body, accent }) => (
              <div
                key={tier}
                className="rounded-2xl border p-5 bg-[#111117] flex flex-col gap-3"
                style={{ borderColor: accent + '30' }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono font-bold uppercase tracking-widest"
                    style={{ color: accent }}
                  >
                    {tier}
                  </span>
                  <span className="font-mono text-xs text-[#71717A]">{pts}</span>
                </div>
                <p className="text-[#71717A] text-xs leading-relaxed flex-1">{body}</p>
                <div
                  className="pt-3 border-t flex items-center justify-between text-xs text-[#71717A]"
                  style={{ borderColor: accent + '20' }}
                >
                  <span>{time} · {count}</span>
                  <span style={{ color: accent }}>{grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ФИНАЛЬНЫЙ CTA — снова фото-фон
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-5 overflow-hidden">
        {/* Фото-фон */}
        <div className="absolute inset-0">
          <Image
            src={CTA_PHOTO}
            alt="Chemistry lab beakers"
            fill
            quality={70}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#09090B]/80" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-sans font-extrabold text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight text-white mb-5">
            Запустите викторину прямо сейчас
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-[44ch] mx-auto">
            Создайте комнату — ученики подключаются за 10 секунд с любого устройства по PIN-коду.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link href="/teacher/login">
              <Button size="lg" className="w-full sm:w-auto">
                <GraduationCap className="w-4 h-4 mr-2" />
                Открыть кабинет учителя
              </Button>
            </Link>
            <Link href="/play">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-white border-white/20 bg-white/10 hover:bg-white/20">
                <Zap className="w-4 h-4 mr-2" />
                Войти как ученик
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
