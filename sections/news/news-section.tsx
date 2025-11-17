import { getAllNews } from "@/lib/news";
import { getCategoriesByType } from "@/lib/categories";
import { NewsSectionClient } from "./news-section-client";
import { News } from "@/lib/news";

export async function NewsSection() {
  try {
    // Fetch data on the server - no delay!
    const news = getAllNews();
    const allCategories = getCategoriesByType("news_navigation");

  // Sort news by date (newest first)
  const sortedNews = news.sort(
    (a: News, b: News) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Отримуємо унікальні категорії для навігації, які реально використовуються в новинах
  const usedNavigationCategories = new Set(
    news
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

  if (sortedNews.length === 0) {
    return null;
  }

  return <NewsSectionClient news={sortedNews} navigationItems={navigationItems} />;
  } catch (error) {
    console.error("Error rendering NewsSection:", error);
    return null;
  }
}
