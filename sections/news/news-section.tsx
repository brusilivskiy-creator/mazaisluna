import { getAllNews } from "@/lib/news";
import { getCategoriesByType } from "@/lib/categories";
import { NewsSectionClient } from "./news-section-client";
import { News } from "@/lib/news";

export async function NewsSection() {
  // Fetch data on the server - no delay!
  const news = getAllNews();
  const categories = getCategoriesByType("news_navigation");

  // Sort news by date (newest first)
  const sortedNews = news.sort(
    (a: News, b: News) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Build navigation items
  const navigationItems = [
    { label: "Новини Уряду", category: null },
    ...categories.map((cat) => ({
      label: cat.name,
      category: cat.name,
    })),
  ];

  if (sortedNews.length === 0) {
    return null;
  }

  return <NewsSectionClient news={sortedNews} navigationItems={navigationItems} />;
}
