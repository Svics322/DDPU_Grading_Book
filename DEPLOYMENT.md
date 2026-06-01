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

7. У Supabase задеплой Edge Function для створення акаунтів з адмінки:

```bash
supabase functions deploy admin-create-user
```

8. Для Edge Function додай secret:

```text
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Його можна встановити командою:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
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

6. У Supabase задеплой Edge Function:

```bash
supabase functions deploy admin-create-user
```

7. Для Edge Function додай secret:

```text
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Його можна встановити командою:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Файл `netlify.toml` містить redirect на `index.html`, тому прямі переходи на сторінки SPA працюють після перезавантаження.
