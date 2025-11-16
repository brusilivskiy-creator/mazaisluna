import fs from "fs";
import path from "path";

export interface News {
  id: number;
  title: string;
  image: string | null;
  date: string; // ISO date string
  text: string;
  category?: string | null;
}

const dataFilePath = path.join(process.cwd(), "data", "news.json");

export function getAllNews(): News[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading news data:", error);
    return [];
  }
}

export function saveNews(news: News[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(news, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving news data:", error);
    throw error;
  }
}

export function getNewsById(id: number): News | undefined {
  const news = getAllNews();
  return news.find((item) => item.id === id);
}

export function addNews(newsItem: Omit<News, "id">): News {
  const news = getAllNews();
  const newId = news.length > 0 ? Math.max(...news.map((n) => n.id)) + 1 : 1;
  const newNews: News = { ...newsItem, id: newId };
  news.push(newNews);
  saveNews(news);
  return newNews;
}

export function updateNews(id: number, newsItem: Omit<News, "id">): News | null {
  const news = getAllNews();
  const index = news.findIndex((n) => n.id === id);
  if (index === -1) return null;
  news[index] = { ...newsItem, id };
  saveNews(news);
  return news[index];
}

export function deleteNews(id: number): boolean {
  const news = getAllNews();
  const filtered = news.filter((n) => n.id !== id);
  if (filtered.length === news.length) return false;
  saveNews(filtered);
  return true;
}

export function getLatestNews(limit: number = 6): News[] {
  const news = getAllNews();
  return news
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}


