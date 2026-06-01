# DDPU_Grading_Book

React SPA для роботи з журналом успішності, студентами, викладачами, предметами, доступами викладачів і ролями користувачів. PHP не використовується.

## Стек

- React + Vite
- React Router
- Redux Toolkit
- React Final Form / Final Form
- Supabase Auth + Supabase Postgres
- JWT токен авторизації через Supabase Auth

## Запуск локально

Не відкривай `index.html` напряму через `file:///`. Це React/Vite SPA, тому сторінка має запускатися через локальний HTTP-сервер.

Найпростіший варіант:

```text
start-dev.bat
```

Або командами:

```bash
npm install
npm run dev
```

Після запуску відкрий:

```text
http://127.0.0.1:5177/
```

Для перевірки production-збірки:

```text
start-preview.bat
```

Якщо `.env` не налаштовано, сайт працює у demo-режимі з локальними seed-даними в `localStorage`.

## Підключення Supabase

1. Створи Supabase project.
2. У SQL Editor виконай `supabase/schema.sql`.
3. У SQL Editor виконай `supabase/seed.sql`.
4. Скопіюй `.env.example` у `.env` і заповни:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. Створи тестові акаунти:

```bash
npm run seed:supabase
```

## Тестові акаунти

```text
Адмін: admin@ddpu.edu.ua / Admin2026!
Викладач: teacher.shevchenko@ddpu.edu.ua / Teacher2026!
Викладач: teacher.kovalenko@ddpu.edu.ua / Teacher2026!
Викладач: teacher.melnyk@ddpu.edu.ua / Teacher2026!
Студент: student.buryk@ddpu.edu.ua / Student2026!
Студент: student.yurkiv@ddpu.edu.ua / Student2026!
Студент: student.kuchera@ddpu.edu.ua / Student2026!
```

## Деплой

Для Vercel або Netlify потрібно додати environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Команда збірки:

```bash
npm run build
```

Папка публікації:

```text
dist
```

`vercel.json` і `netlify.toml` вже додані для коректної роботи SPA-маршрутів.
