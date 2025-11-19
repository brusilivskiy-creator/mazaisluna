# Урядовий портал Мезайс Луни

Офіційний урядовий портал держави Мезайс Луна. Сайт містить інформацію про керівництво держави, склад парламенту, політичні партії та основні переваги держави.

## Технології

- **Next.js 16** - React framework для production
- **TypeScript** - Типізація коду
- **Tailwind CSS** - Стилізація
- **shadcn/ui** - UI компоненти
- **Lucide React** - Іконки
- **Prisma 6** - ORM для роботи з базою даних
- **PostgreSQL** - База даних (Prisma Remote)

## Функціональність

### Публічні сторінки
- Головна сторінка з перевагами держави
- Секція керівництва держави
- Склад парламенту з розподілом мандатів
- Сторінка з повним списком керівництва

### Адмін-панель
- **Політики** - Управління картками політиків (фото, ім'я, партія)
- **Посади** - Управління списком посад з можливістю drag-and-drop для встановлення ієрархії
- **Керівництво** - Призначення політиків на посади
- **Партії** - Управління політичними партіями та їх логотипами
- **Склад парламенту** - Управління мандатами партій

## Встановлення та запуск

### Вимоги
- Node.js 18+ 
- npm або yarn

### Крок 1: Клонування репозиторію
```bash
git clone <repository-url>
cd mazais
```

### Крок 2: Встановлення залежностей
```bash
npm install
# або
yarn install
```

### Крок 3: Налаштування бази даних

1. **Створіть базу даних в Prisma Remote:**
   - Перейдіть на [console.prisma.io](https://console.prisma.io)
   - Створіть новий проект
   - Скопіюйте Connection String

2. **Налаштуйте змінні оточення:**
   ```bash
   cp .env.example .env
   ```
   Відредагуйте `.env` файл і вставте ваш `DATABASE_URL` з Prisma Remote.

3. **Застосуйте схему та заповніть базу даних:**
   ```bash
   npm run db:push    # Застосувати схему
   npm run db:seed    # Заповнити даними
   ```

### Крок 4: Запуск development сервера
```bash
npm run dev
# або
yarn dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

## Збірка для production

```bash
npm run build
npm start
# або
yarn build
yarn start
```

## Деплой на Netlify

Проєкт налаштований для автоматичного деплою на Netlify через GitHub.

### Через GitHub (Рекомендовано)

1. Публікуйте проєкт на GitHub
2. Перейдіть на [Netlify](https://www.netlify.com/) та увійдіть
3. Натисніть "Add new site" → "Import an existing project"
4. Оберіть "GitHub" та авторизуйтесь
5. Оберіть ваш репозиторій
6. Netlify автоматично визначить налаштування з `netlify.toml`
7. Натисніть "Deploy site"

### Через Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Налаштування

Файл `netlify.toml` вже налаштований з правильними параметрами:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18
- **Plugin**: `@netlify/plugin-nextjs` (автоматично встановлюється)

**Важливо**: Переконайтеся, що папка `data/` з JSON файлами включена в репозиторій!

## Структура проєкту

```
mazais/
├── app/                    # Next.js App Router
│   ├── admin/             # Адмін-панель
│   ├── api/               # API routes
│   ├── government/        # Публічна сторінка керівництва
│   └── page.tsx           # Головна сторінка
├── components/            # React компоненти
├── sections/              # Секції сторінок
├── lib/                   # Утиліти та бібліотеки
│   └── prisma.ts         # Prisma Client instance
├── prisma/               # Prisma схема та міграції
│   ├── schema.prisma     # Схема бази даних
│   └── seed.ts           # Скрипт для заповнення даними
├── data/                 # JSON дані (використовуються для seed)
└── public/               # Статичні файли (зображення, шрифти)
```

## База даних

Проєкт використовує **Prisma** з **PostgreSQL** базою даних (Prisma Remote).

### Структура бази даних

- **Category** - Категорії новин та навігації
- **News** - Новости
- **Party** - Політичні партії
- **Politician** - Політики
- **Position** - Посади
- **Leadership** - Зв'язок політиків з посадами
- **Parliament** - Парламентські вибори
- **ParliamentResult** - Результати партій на виборах
- **MajoritarianDistrict** - Мажоритарні округи
- **LeaderElection** - Вибори провідника
- **LeaderElectionResult** - Результати виборів провідника

### Команди для роботи з базою даних

```bash
npm run db:generate  # Генерація Prisma Client
npm run db:push      # Застосування схеми (без міграцій)
npm run db:migrate   # Створення та застосування міграцій
npm run db:seed      # Заповнення бази даних даними
npm run db:studio    # Відкрити Prisma Studio (http://localhost:5555)
```

### Налаштування для production

Для деплою на GitHub/Vercel/Netlify додайте змінну оточення `DATABASE_URL` у налаштуваннях вашого хостингу.

**Важливо**: Ніколи не комітьте `.env` файл з реальним `DATABASE_URL` в репозиторій!

## Ліцензія

Цей проєкт є власністю держави Мезайс Луна і створений гравцем Вікторією Коваленко.
