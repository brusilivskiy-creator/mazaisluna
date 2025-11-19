# 🚀 Інструкції для деплою з базою даних

## ✅ Що вже зроблено:

- ✅ Проєкт опубліковано на GitHub
- ✅ Prisma схема створена
- ✅ Seed скрипт готовий
- ✅ Build команда оновлена для генерації Prisma Client
- ✅ `.env` файл захищений (не потрапить в репозиторій)

## 🔧 Налаштування для роботи бази даних

### Для Netlify:

1. Перейдіть на [Netlify Dashboard](https://app.netlify.com)
2. Виберіть ваш проєкт
3. Перейдіть в **Site settings** → **Environment variables**
4. Натисніть **Add variable** і додайте:
   - **Key**: `DATABASE_URL`
   - **Value**: Ваш connection string з Prisma Remote
     ```
     postgres://8ac9bb33f14494249b5a6ba5d17e91e46d1b7e0e43dfecadc068b85e668fe506:sk_prsk8tieV4SXTb9NanLC7@db.prisma.io:5432/postgres?sslmode=require
     ```
5. Натисніть **Save**
6. Перейдіть в **Deploys** → **Trigger deploy** → **Deploy site**

### Для Vercel:

1. Перейдіть на [Vercel Dashboard](https://vercel.com/dashboard)
2. Виберіть ваш проєкт
3. Перейдіть в **Settings** → **Environment Variables**
4. Додайте змінну:
   - **Key**: `DATABASE_URL`
   - **Value**: Ваш connection string
   - **Environment**: Production, Preview, Development (виберіть всі)
5. Натисніть **Save**
6. Перейдіть в **Deployments** → **Redeploy**

### Для GitHub Actions (CI/CD):

1. Перейдіть у ваш репозиторій на GitHub
2. Натисніть **Settings** → **Secrets and variables** → **Actions**
3. Натисніть **New repository secret**
4. Додайте:
   - **Name**: `DATABASE_URL`
   - **Value**: Ваш connection string
5. Натисніть **Add secret**

## 🔍 Перевірка після деплою

Після деплою перевірте:

1. **Логи збірки** - мають містити:
   ```
   ✔ Generated Prisma Client
   ✔ Build completed
   ```

2. **API routes** - перевірте, що API працює:
   - `/api/news`
   - `/api/politicians`
   - `/api/parties`

3. **База даних** - переконайтеся, що дані завантажуються:
   ```bash
   npm run db:studio
   ```

## ⚠️ Важливо

- **Ніколи не комітьте `.env` файл** з реальним `DATABASE_URL`
- Використовуйте **Secrets/Environment Variables** на хостингу
- Переконайтеся, що `DATABASE_URL` правильно встановлений перед деплоєм

## 🐛 Troubleshooting

### Помилка: "Prisma Client not generated"

**Рішення**: Переконайтеся, що build команда включає `prisma generate`:
```json
"build": "prisma generate && next build"
```

### Помилка: "Can't reach database server"

**Рішення**: 
- Перевірте, що `DATABASE_URL` правильно встановлений
- Перевірте, що база даних активна в Prisma Console
- Перевірте firewall налаштування

### Помилка: "Environment variable not found"

**Рішення**:
- Переконайтеся, що змінна додана в налаштуваннях хостингу
- Перевірте назву змінної (має бути `DATABASE_URL`)
- Перезапустіть деплой після додавання змінної

## 📚 Додаткові ресурси

- [Prisma Remote Documentation](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-prisma-cloud)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

