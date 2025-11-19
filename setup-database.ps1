# Скрипт для автоматической настройки базы данных
Write-Host "🚀 Настройка базы данных для проекта Mazais" -ForegroundColor Cyan

# Проверка наличия .env файла
if (-not (Test-Path .env)) {
    Write-Host "📝 Создание .env файла..." -ForegroundColor Yellow
    
    # Пробуем получить connection string из Prisma Remote
    Write-Host "⚠️  Вам нужно создать базу данных в Prisma Remote:" -ForegroundColor Yellow
    Write-Host "   1. Перейдите на https://console.prisma.io" -ForegroundColor White
    Write-Host "   2. Создайте новый проект 'mazais'" -ForegroundColor White
    Write-Host "   3. Выберите регион eu-central-1" -ForegroundColor White
    Write-Host "   4. Скопируйте connection string" -ForegroundColor White
    Write-Host ""
    
    $connectionString = Read-Host "Введите DATABASE_URL (или нажмите Enter для пропуска)"
    
    if ($connectionString) {
        Add-Content -Path .env -Value "DATABASE_URL=`"$connectionString`""
        Write-Host "✅ .env файл создан!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env файл не создан. Создайте его вручную с DATABASE_URL" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ .env файл уже существует" -ForegroundColor Green
}

# Генерация Prisma Client
Write-Host ""
Write-Host "🔧 Генерация Prisma Client..." -ForegroundColor Cyan
npm run db:generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client сгенерирован!" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка при генерации Prisma Client" -ForegroundColor Red
    exit 1
}

# Применение схемы
Write-Host ""
Write-Host "📊 Применение схемы к базе данных..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Схема применена!" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка при применении схемы" -ForegroundColor Red
    exit 1
}

# Заполнение данными
Write-Host ""
Write-Host "🌱 Заполнение базы данных данными..." -ForegroundColor Cyan
npm run db:seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ База данных заполнена данными!" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка при заполнении данными" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Настройка завершена успешно!" -ForegroundColor Green
Write-Host "   Вы можете открыть Prisma Studio командой: npm run db:studio" -ForegroundColor Cyan

