import React from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card } from '@/frontend/components/ui/Card';
import {
  Sparkles,
  Zap,
  Trophy,
  BookOpen,
  ArrowRight,
  FlaskConical,
  GraduationCap,
  Atom,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col justify-center">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4">
        {/* Subtle decorative chemistry background shapes */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-bold mb-6 animate-in fade-in duration-500">
            <FlaskConical className="w-4 h-4 text-blue-600" />
            <span>Интерактивные викторины по химии</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] mb-6">
            Изучайте химию с азартом в{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Chemistry Live
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Проводите живые викторины в классе и онлайн в формате Kahoot. Мгновенные ответы,
            научные объяснения формул и динамическая таблица лидеров.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link href="/play" className="w-full sm:w-auto flex-1">
              <Button size="xl" className="w-full shadow-md bg-blue-600 hover:bg-blue-700 text-white">
                <Zap className="w-5 h-5 mr-2" />
                Войти как ученик
              </Button>
            </Link>

            <Link href="/teacher/login" className="w-full sm:w-auto flex-1">
              <Button size="xl" variant="outline" className="w-full border-stone-300">
                <GraduationCap className="w-5 h-5 mr-2 text-stone-700" />
                Войти как учитель
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-semibold text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Без регистрации для учеников
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Поддержка любых смартфонов
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white border-y border-[#E8E5E0] px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Все для увлекательного урока
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2">
              Современные инструменты для вовлечения каждого школьника и студента
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:border-blue-200 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Синхронизация в реальном времени
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Вопросы, таймер и ответы участников отображаются мгновенно на экранах благодаря Supabase Realtime.
              </p>
            </Card>

            <Card className="hover:border-emerald-200 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                20 вопросов по органической химии
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Готовый проверенный блок вопросов по теме &laquo;Каучук и резина&raquo; с градацией сложности: от базовых до олимпиадных.
              </p>
            </Card>

            <Card className="hover:border-amber-200 transition-all p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-100">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Азартный лидерборд и подиум
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Начисление очков с учетом скорости реакции и серии правильных ответов, финальный пьедестал почета и конфетти.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 text-center px-4">
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
            <Atom className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-2">
            Готовы начать викторину прямо сейчас?
          </h2>
          <p className="text-sm text-stone-600 mb-6">
            Запустите сессию с компьютера учителя и раздайте 6-значный PIN ученикам.
          </p>
          <Link href="/teacher/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              <span>Панель учителя</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
