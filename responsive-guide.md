# Профессиональное руководство по современной адаптивной разработке 2025
## Гибридный подход: shadcn/ui + Modern CSS Techniques

**Версия:** 1.0  
**Дата:** Ноябрь 2025  
**Автор:** Best Practices Guide

---

## 📋 Содержание

1. [Введение и философия](#1-введение-и-философия)
2. [Базовая конфигурация](#2-базовая-конфигурация)
3. [Брейкпоинты и стратегия](#3-брейкпоинты-и-responsive-стратегия)
4. [Container Queries](#4-container-queries)
5. [Fluid Typography](#5-fluid-typography)
6. [Intrinsic Layouts](#6-intrinsic-layouts)
7. [Компоненты и паттерны](#7-компоненты-и-паттерны)
8. [Accessibility](#8-accessibility-и-performance)
9. [Практические примеры](#9-практические-примеры)
10. [Production Checklist](#10-production-checklist)

---

## 1. Введение и философия

### 1.1 Проблема традиционного подхода

Классические media queries и фиксированные breakpoints имеют ограничения:

❌ **Viewport-centric** — всё адаптируется к размеру экрана, а не контенту  
❌ **Device-specific** — фиксированные значения (768px, 1024px) устаревают  
❌ **Component coupling** — компоненты зависят от глобального viewport  
❌ **Code duplication** — множество media queries с повторяющимися стилями  
❌ **Maintenance hell** — сложно поддерживать при масштабировании  

### 1.2 Современная философия (2025)

**Гибридный подход** — лучшее из всех миров:

✅ **Content-first design** — брейкпоинты там, где контент "ломается"  
✅ **Component isolation** — компоненты адаптируются к контейнеру (container queries)  
✅ **Fluid everything** — плавное масштабирование вместо резких переходов  
✅ **Progressive enhancement** — работает везде, улучшается где возможно  
✅ **Performance-first** — минимум кода, максимум эффективности  
✅ **Accessibility-driven** — уважение к настройкам пользователя  

### 1.3 Архитектура подхода

```
┌─────────────────────────────────────────────────────────┐
│                 Modern Responsive Stack                  │
├─────────────────────────────────────────────────────────┤
│  1. Strategic Breakpoints (только критичные изменения)  │
│  2. Container Queries (компонент-центрический подход)   │
│  3. Fluid Typography (clamp-based scaling)              │
│  4. Intrinsic Layouts (auto-responsive grids)           │
│  5. Accessible Patterns (ARIA, focus, keyboard)         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Базовая конфигурация

### 2.1 Tailwind Config (Modern + shadcn/ui)

```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  
  theme: {
    // ═══════════════════════════════════════════════════════
    // CONTAINER (shadcn/ui standard + enhanced)
    // ═══════════════════════════════════════════════════════
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',    // 16px - мобильные
        sm: '1.5rem',       // 24px - планшеты
        lg: '2rem',         // 32px - десктопы
        xl: '3rem',         // 48px - большие экраны
        '2xl': '4rem',      // 64px - широкие экраны
      },
      screens: {
        '2xl': '1400px',    // shadcn/ui кастом (вместо 1536px)
      },
    },
    
    // ═══════════════════════════════════════════════════════
    // BREAKPOINTS (Strategic, content-driven)
    // ═══════════════════════════════════════════════════════
    screens: {
      'xs': '20rem',        // 320px - малые мобильные
      'sm': '40em',         // 640px - планшеты (портрет)
      'md': '48em',         // 768px - критичный (dialog/drawer)
      'lg': '64em',         // 1024px - десктопы
      'xl': '80em',         // 1280px - большие десктопы
      '2xl': '87.5em',      // 1400px - широкие экраны
      '3xl': '100em',       // 1600px - ultra wide
      '4k': '120em',        // 1920px - Full HD
    },
    
    extend: {
      // ═══════════════════════════════════════════════════════
      // COLORS (shadcn/ui variables)
      // ═══════════════════════════════════════════════════════
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // ═══════════════════════════════════════════════════════
      // FLUID TYPOGRAPHY
      // ═══════════════════════════════════════════════════════
      fontSize: {
        'fluid-xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.5' }],
        'fluid-sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'fluid-lg': ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.3' }],
        'fluid-3xl': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2' }],
        'fluid-4xl': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1' }],
        'fluid-5xl': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1' }],
      },
      
      // ═══════════════════════════════════════════════════════
      // FLUID SPACING
      // ═══════════════════════════════════════════════════════
      spacing: {
        'fluid-xs': 'clamp(0.25rem, 1vw, 0.5rem)',
        'fluid-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'fluid-md': 'clamp(1rem, 4vw, 2rem)',
        'fluid-lg': 'clamp(2rem, 6vw, 3rem)',
        'fluid-xl': 'clamp(3rem, 8vw, 5rem)',
        'fluid-2xl': 'clamp(4rem, 12vw, 8rem)',
      },
      
      // ═══════════════════════════════════════════════════════
      // BORDER RADIUS
      // ═══════════════════════════════════════════════════════
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // ═══════════════════════════════════════════════════════
      // MAX-WIDTH (Content constraints)
      // ═══════════════════════════════════════════════════════
      maxWidth: {
        'readable': '65ch',      // Оптимальная читабельность
        'readable-wide': '80ch', // Широкий текст
        'prose': '75ch',         // Для статей
      },
    },
  },
  
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
}

export default config
```

### 2.2 Global CSS (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ══════════════════════════════════════════════
       COLORS - Light Mode
       ══════════════════════════════════════════════ */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    
    /* ══════════════════════════════════════════════
       RADIUS
       ══════════════════════════════════════════════ */
    --radius: 0.5rem;
    
    /* ══════════════════════════════════════════════
       FLUID TYPOGRAPHY
       ══════════════════════════════════════════════ */
    --fs-xs: clamp(0.75rem, 1.5vw, 0.875rem);
    --fs-sm: clamp(0.875rem, 2vw, 1rem);
    --fs-base: clamp(1rem, 2.5vw, 1.125rem);
    --fs-lg: clamp(1.125rem, 3vw, 1.25rem);
    --fs-xl: clamp(1.25rem, 3.5vw, 1.5rem);
    --fs-2xl: clamp(1.5rem, 4vw, 2rem);
    --fs-3xl: clamp(2rem, 5vw, 3rem);
    --fs-4xl: clamp(2.5rem, 6vw, 4rem);
    --fs-5xl: clamp(3rem, 8vw, 5rem);
    
    /* ══════════════════════════════════════════════
       FLUID SPACING
       ══════════════════════════════════════════════ */
    --space-xs: clamp(0.25rem, 1vw, 0.5rem);
    --space-sm: clamp(0.5rem, 2vw, 1rem);
    --space-md: clamp(1rem, 4vw, 2rem);
    --space-lg: clamp(2rem, 6vw, 3rem);
    --space-xl: clamp(3rem, 8vw, 5rem);
    --space-2xl: clamp(4rem, 12vw, 8rem);
    
    /* ══════════════════════════════════════════════
       COMPONENTS
       ══════════════════════════════════════════════ */
    --sidebar-width: 240px;
    --sidebar-width-icon: 56px;
    --sidebar-width-mobile: 320px;
  }
  
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
  
  * { @apply border-border; }
  
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    @apply bg-background text-foreground;
    font-size: var(--fs-base);
    line-height: 1.6;
    overflow-x: hidden;
  }
  
  /* Fluid Typography */
  h1 { font-size: var(--fs-4xl); line-height: 1.1; font-weight: 800; }
  h2 { font-size: var(--fs-3xl); line-height: 1.2; font-weight: 700; }
  h3 { font-size: var(--fs-2xl); line-height: 1.3; font-weight: 600; }
  h4 { font-size: var(--fs-xl); line-height: 1.4; font-weight: 600; }
  h5 { font-size: var(--fs-lg); line-height: 1.5; font-weight: 500; }
  h6 { font-size: var(--fs-base); line-height: 1.5; font-weight: 500; }
  
  p, li { max-width: 75ch; }
  
  *:focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2;
  }
}

@layer utilities {
  .auto-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, var(--min-column-width, 300px)), 1fr)
    );
    gap: var(--grid-gap, clamp(1rem, 3vw, 2rem));
  }
  
  .flex-stack {
    display: flex;
    flex-wrap: wrap;
    gap: var(--stack-gap, 1rem);
  }
  
  .flex-stack > * {
    flex: 1 1 min(100%, var(--stack-min-width, 300px));
  }
}
```

---

## 3. Брейкпоинты и Responsive стратегия

### 3.1 Полная таблица брейкпоинтов

| Breakpoint | Width | Usage | Devices |
|------------|-------|-------|---------|
| **xs** | 320px | Малые мобильные | iPhone SE |
| **sm** | 640px | Планшеты (портрет) | iPad Mini |
| **md** | 768px | **Критичный** | Dialog/Drawer переключение |
| **lg** | 1024px | Десктопы | Laptops |
| **xl** | 1280px | Большие десктопы | 15"+ monitors |
| **2xl** | 1400px | Широкие экраны | shadcn/ui кастом |
| **3xl** | 1600px | Ultra wide | 27" monitors |
| **4k** | 1920px | Full HD+ | Desktop monitors |

### 3.2 Когда использовать breakpoints

#### ✅ Используйте breakpoints для:

1. **Радикальных изменений layout**
   - Hamburger menu ↔ Full navigation
   - Dialog ↔ Drawer (md: 768px)
   - Sidebar toggle
   
2. **Критичных UI паттернов**
   - Navigation patterns
   - Modal behaviors
   - Major grid changes

#### ❌ НЕ используйте breakpoints для:

1. **Spacing** → используйте `clamp()`
2. **Typography** → fluid typography
3. **Grid columns** → `auto-fit`/`minmax()`
4. **Component sizing** → container queries

### 3.3 Mobile-First подход

```tsx
// ✅ Правильно
<div className="
  text-base             /* Mobile */
  md:text-lg            /* Tablet+ */
  lg:text-xl            /* Desktop+ */
">

// ❌ Неправильно - не используйте max-width
```

---

## 4. Container Queries

### 4.1 Основы

Container queries = компоненты адаптируются к **контейнеру**, а не viewport.

```tsx
// Wrapper с container query
<div className="@container">
  <Card /> {/* Адаптируется к размеру контейнера */}
</div>
```

### 4.2 Tailwind Container Queries

```tsx
<div className="@container">
  <div className="
    flex flex-col gap-4
    @md:flex-row @md:gap-6
    @lg:grid @lg:grid-cols-2
  ">
    {children}
  </div>
</div>
```

### 4.3 Пример: Adaptive Card

```tsx
export function AdaptiveCard({ title, image, description }: Props) {
  return (
    <div className="@container">
      <div className="
        flex flex-col gap-3 p-4 border rounded-lg
        @sm:flex-row @sm:gap-4
        @lg:grid @lg:grid-cols-[200px_1fr]
      ">
        <img src={image} className="w-full @sm:w-32 @lg:w-full" />
        <div>
          <h3 className="text-fluid-xl">{title}</h3>
          <p className="text-fluid-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}
```

---

## 5. Fluid Typography

### 5.1 clamp() формула

```css
font-size: clamp(MIN, IDEAL, MAX);
           /* ↑     ↑       ↑
           мин   идеал   макс  */
```

### 5.2 Типографическая шкала

```css
:root {
  --fs-xs: clamp(0.75rem, 1.5vw, 0.875rem);
  --fs-sm: clamp(0.875rem, 2vw, 1rem);
  --fs-base: clamp(1rem, 2.5vw, 1.125rem);
  --fs-lg: clamp(1.125rem, 3vw, 1.25rem);
  --fs-xl: clamp(1.25rem, 3.5vw, 1.5rem);
  --fs-2xl: clamp(1.5rem, 4vw, 2rem);
  --fs-3xl: clamp(2rem, 5vw, 3rem);
  --fs-4xl: clamp(2.5rem, 6vw, 4rem);
}
```

### 5.3 Использование

```tsx
<h1 className="text-fluid-4xl">Hero Title</h1>
<p className="text-fluid-base">Body text</p>
```

---

## 6. Intrinsic Layouts

### 6.1 Auto-responsive Grid

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 300px), 1fr)
  );
  gap: clamp(1rem, 3vw, 2rem);
}
```

**Результат:** Автоматическая адаптация без media queries!

### 6.2 Flex Stack

```css
.flex-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-stack > * {
  flex: 1 1 min(100%, 300px);
}
```

---

## 7. Компоненты и паттерны

### 7.1 Layout Patterns

```tsx
// Pattern 1: Full-width mobile, constrained desktop
<div className="max-w-screen-xl sm:px-6 lg:px-8">
  {content}
</div>

// Pattern 2: Always constrained
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {content}
</div>

// Pattern 3: Narrow content
<div className="max-w-3xl mx-auto px-4">
  {content}
</div>
```

### 7.2 Course Booking App Example

```tsx
// components/CourseGrid.tsx
export function CourseGrid({ courses }: Props) {
  return (
    <div className="@container">
      <div className="auto-grid" style={{
        '--min-column-width': '280px',
        '--grid-gap': 'clamp(1rem, 3vw, 2rem)'
      }}>
        {courses.map(course => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  )
}

// components/CourseCard.tsx
export function CourseCard({ title, price, image }: Props) {
  return (
    <div className="@container">
      <div className="
        flex flex-col gap-4 p-fluid-md
        border rounded-lg
        @md:flex-row
      ">
        <img className="w-full @md:w-32" src={image} />
        <div>
          <h3 className="text-fluid-xl font-semibold">{title}</h3>
          <p className="text-fluid-2xl font-bold">{price}</p>
          <Button className="mt-fluid-sm">Записаться</Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 8. Accessibility и Performance

### 8.1 Accessibility Checklist

- ✅ Focus states для всех интерактивных элементов
- ✅ ARIA labels для компонентов
- ✅ Keyboard navigation
- ✅ Color contrast (WCAG AA минимум)
- ✅ Responsive images с `srcset`
- ✅ `prefers-reduced-motion` support

### 8.2 Performance Best Practices

```tsx
// Lazy loading изображений
<img 
  src={image} 
  loading="lazy"
  decoding="async"
/>

// Responsive images
<img
  srcSet="
    image-320.webp 320w,
    image-640.webp 640w,
    image-1280.webp 1280w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
/>
```

---

## 9. Практические примеры

### 9.1 Hero Section

```tsx
export function Hero() {
  return (
    <section className="
      px-fluid-md py-fluid-xl
      container mx-auto
    ">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="
          text-fluid-5xl font-bold
          mb-fluid-md
        ">
          Записывайтесь на курсы онлайн
        </h1>
        
        <p className="
          text-fluid-lg text-muted-foreground
          mb-fluid-lg
        ">
          Более 1000 курсов от лучших преподавателей
        </p>
        
        <Button size="lg">
          Начать обучение
        </Button>
      </div>
    </section>
  )
}
```

### 9.2 Responsive Navigation

```tsx
export function Navigation() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  return (
    <nav className="
      border-b
      px-4 sm:px-6 lg:px-8
    ">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <Logo />
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <MobileNav />
            </SheetContent>
          </Sheet>
        ) : (
          <DesktopNav />
        )}
      </div>
    </nav>
  )
}
```

---

## 10. Production Checklist

### Before Deploy

- ✅ Все брейкпоинты протестированы (320px - 1920px+)
- ✅ Container queries работают корректно
- ✅ Fluid typography масштабируется плавно
- ✅ Images оптимизированы (WebP/AVIF)
- ✅ Accessibility audit пройден
- ✅ Performance metrics (LCP < 2.5s, CLS < 0.1)
- ✅ Dark mode работает
- ✅ Keyboard navigation проверен
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Заключение

Этот гибридный подход сочетает:

1. **Проверенные практики shadcn/ui** — стабильная основа
2. **Container Queries** — компонент-центрический подход
3. **Fluid Typography** — плавное масштабирование
4. **Intrinsic Layouts** — автоматическая адаптация
5. **Accessibility-first** — доступность для всех

**Результат:** Современное, производительное, доступное приложение.