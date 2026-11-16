# Chemistry Live — Next.js Frontend 🧪

Интерактивная образовательная платформа в формате Kahoot для проведения живых викторин по химии в реальном времени.

## 🚀 Стек технологий
- **Фреймворк:** [Next.js](https://nextjs.org/) (App Router, Server & Client Components, Route Handlers)
- **Язык:** TypeScript (строгий режим)
- **Стилизация:** [Tailwind CSS](https://tailwindcss.com/) (светлая теплая дизайн-система)
- **База данных и Realtime:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`)
- **Анимации:** [Framer Motion](https://www.framer.com/motion/) и `canvas-confetti`
- **Иконки:** [Lucide React](https://lucide.dev/)
- **QR-коды:** `qrcode.react`
- **Валидация:** [Zod](https://zod.dev/)

---

## 🎨 Дизайн-система (Light Theme)
Платформа строго спроектирована в теплой светлой палитре:
- **Фон:** `#FAFAF8` (теплый белый)
- **Поверхности карточек:** `#FFFFFF`
- **Границы:** `#E8E5E0`
- **Текст:** `#1A1A1A` (основной), `#6B7280` (второстепенный)
- **Акцентные цвета вариантов ответов:**
  - Вариант A: `#EF4444` (красный треугольник ▲)
  - Вариант B: `#3B82F6` (синий ромб ◆)
  - Вариант C: `#EAB308` (желтый круг ●)
  - Вариант D: `#22C55E` (зеленый квадрат ■)

---

## 📁 Структура проекта
```
chemistry-live-frontend/
├── app/
│   ├── (public)/              # Публичный лэндинг с информацией и входами
│   ├── teacher/
│   │   ├── login/             # Аутентификация преподавателя
│   │   ├── dashboard/         # Список активных и завершенных сессий, создание игры
│   │   └── session/[sessionId]/
│   │       ├── lobby/         # Комната ожидания: большой PIN, QR-код, список игроков, блокировка
│   │       ├── game/          # Экран ведущего: вопрос, таймер, распределение ответов, объяснения
│   │       └── results/       # Финальный подиум 1/2/3 места и общая таблица
│   ├── play/
│   │   ├── page.tsx           # Вход ученика по 6-значному PIN и никнейму
│   │   └── [sessionId]/
│   │       ├── waiting/       # Экран ожидания старта с автопереходом по Realtime
│   │       ├── game/          # Экран ученика: 4 большие кнопки, таймер, результат ответа
│   │       └── results/       # Индивидуальный итог ученика и пьедестал
│   └── api/                   # Route Handlers (сессии, игроки, ответы, лидерборд)
├── frontend/
│   ├── components/            # UI, Quiz, Teacher, Student, Leaderboard, Podium
│   ├── hooks/                 # useGameSession, usePlayerSession, useRealtime, useTimer, useLeaderboard
│   └── lib/                   # Supabase Browser Client, Realtime helper, форматирование
├── backend/
│   ├── repositories/          # QuizRepository, PlayerRepository, GameRepository
│   ├── services/              # GameService, RoomService, PlayerService, ScoringService
│   ├── security/              # Auth middleware
│   ├── validation/            # Zod validation helpers
│   └── lib/                   # Supabase Admin Service Role client
└── shared/
    ├── types/                 # TypeScript интерфейсы игры, вопросов, игроков
    ├── constants/             # Константы таймингов, баллов, цветов
    └── schemas/               # Схемы валидации Zod
```

---

## ⚡ Формула начисления баллов
Начисление баллов стимулирует скорость и точность ответа:
```typescript
earned_points = base_points * speed_multiplier + streak_bonus

// где speed_multiplier изменяется от 1.0 (мгновенный ответ) до 0.5 (ответ на исходе таймера):
speed_multiplier = clamp(0.5 + 0.5 * (1 - response_ms / time_limit_ms), 0.5, 1.0)
```
Серия правильных ответов (Streak) добавляет до +500 дополнительных бонусных очков.

---

## 🔧 Запуск проекта локально

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env.local` на основе `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_publishable_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here
```

3. Запустите сервер разработки:
```bash
npm run dev
```
Откройте браузер по адресу `http://localhost:3000`.

4. Сборка для продакшена:
```bash
npm run build
npm run start
```
