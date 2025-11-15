# Інструкція по деплою на Netlify

## Крок 1: Підготовка до публікації на GitHub

1. Переконайтеся, що всі зміни збережені:
   ```bash
   git status
   git add .
   git commit -m "Initial commit"
   ```

2. Створіть репозиторій на GitHub та додайте remote:
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git branch -M main
   git push -u origin main
   ```

## Крок 2: Деплой на Netlify

### Варіант 1: Через GitHub (Рекомендовано)

1. Перейдіть на [Netlify](https://www.netlify.com/) та увійдіть/зареєструйтесь
2. Натисніть "Add new site" → "Import an existing project"
3. Оберіть "GitHub" та авторизуйтесь
4. Оберіть ваш репозиторій
5. Netlify автоматично визначить налаштування:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18+
6. Натисніть "Deploy site"

### Варіант 2: Через Netlify CLI

```bash
# Встановіть Netlify CLI
npm install -g netlify-cli

# Ввійдіть в Netlify
netlify login

# Ініціалізуйте проєкт
netlify init

# Деплой
netlify deploy --prod
```

## Крок 3: Налаштування змінних оточення (опціонально)

У панелі Netlify:
1. Перейдіть до Site settings → Environment variables
2. Додайте змінні (якщо потрібно):
   - `NEXT_PUBLIC_SITE_URL` - URL вашого сайту
   - `NEXT_PUBLIC_API_URL` - URL API (якщо потрібен)

## Автоматичний деплой

Після підключення GitHub, кожен push до `main` гілки автоматично запускає новий деплой на Netlify.

## Структура даних

Важливо: Дані зберігаються в JSON файлах у папці `data/`:
- `data/politicians.json` - Політики
- `data/positions.json` - Посади  
- `data/parties.json` - Партії
- `data/leadership.json` - Призначення

Ці файли мають бути включені в репозиторій для роботи сайту.

## Після деплою

1. Перевірте, що сайт працює
2. Перевірте адмін-панель: `https://your-site.netlify.app/admin`
3. Перевірте завантаження файлів в адмін-панелі

## Troubleshooting

### Помилка збірки
- Переконайтеся, що Node версія 18+
- Перевірте логи збірки в Netlify
- Локально запустіть `npm run build` для перевірки

### Помилки з даними
- Переконайтеся, що папка `data/` включена в репозиторій
- Перевірте формат JSON файлів

### Помилки з зображеннями
- Переконайтеся, що папка `public/images/` включена в репозиторій
- Перевірте шляхи до зображень

