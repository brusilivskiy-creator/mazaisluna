import { prisma } from "@/lib/prisma";
import { NewsSectionClient } from "./news-section-client";

export async function NewsSection() {
  try {
    // Fetch data from database using Prisma
    const news = await prisma.news.findMany({
      include: {
        category: true,
        navigationCategory: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const allCategories = await prisma.category.findMany({
      where: {
        type: 'news_navigation',
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Format news for client component
    const formattedNews = news.map((n) => ({
      id: n.id,
      title: n.title,
      image: n.image,
      date: n.date.toISOString(),
      text: n.text,
      category: n.category?.name || null,
      navigationCategory: n.navigationCategory?.name || null,
    }));

    // Отримуємо унікальні категорії для навігації, які реально використовуються в новинах
    const usedNavigationCategories = new Set(
      formattedNews
        .map((item) => item.navigationCategory)
        .filter((cat): cat is string => cat !== null && cat !== undefined)
    );

    // Статична категорія "Новини Уряду" - завжди показується першою
    const defaultCategoryLabel = "Новини Уряду";

    // Фільтруємо категорії навігації - показуємо тільки ті, які є в новинах
    // Виключаємо "Новини Уряду", щоб не дублювати статичний елемент
    const activeCategories = allCategories
      .filter((cat) => 
        usedNavigationCategories.has(cat.name) && 
        cat.name !== defaultCategoryLabel // Виключаємо дублікат
      )
      .sort((a, b) => a.order - b.order); // Сортуємо за порядком

    // Build navigation items - статичний елемент "Новини Уряду" + інші категорії
    const navigationItems = [
      { label: defaultCategoryLabel, category: null },
      ...activeCategories.map((cat) => ({
        label: cat.name,
        category: cat.name,
      })),
    ];

    if (formattedNews.length === 0) {
      return null;
    }

    return <NewsSectionClient news={formattedNews} navigationItems={navigationItems} />;
  } catch (error) {
    console.error("Error rendering NewsSection:", error);
    return null;
  }
}
