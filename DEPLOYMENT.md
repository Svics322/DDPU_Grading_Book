# Деплой на безкоштовний хостинг

## Vercel

1. Завантаж проєкт у GitHub.
2. У Vercel обери `Add New Project`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Environment Variables:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Netlify

1. Завантаж проєкт у GitHub.
2. У Netlify обери `Add new site`.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Environment Variables:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Файл `netlify.toml` містить redirect на `index.html`, тому прямі переходи на сторінки SPA працюють після перезавантаження.
