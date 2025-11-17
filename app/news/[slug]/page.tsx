"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { News } from "@/lib/news";
import { getNewsSlug } from "@/lib/utils";
import { Clock, ArrowLeft } from "lucide-react";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string | undefined;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNews = async (newsSlug: string) => {
    if (!newsSlug) {
      setLoading(false);
      return;
    }
    
    try {
      // Декодируем slug из URL (на случай если есть спецсимволы)
      const decodedSlug = decodeURIComponent(newsSlug);
      
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      
      // Проверяем, является ли slug числом (старый формат по ID)
      const isNumericId = /^\d+$/.test(decodedSlug);
      
      let newsItem: News | undefined;
      
      if (isNumericId) {
        // Старый формат - ищем по ID и редиректим на slug
        const newsId = parseInt(decodedSlug, 10);
        newsItem = data.find((item: News) => item.id === newsId);
        
        if (newsItem) {
          // Редиректим на правильный slug
          const correctSlug = getNewsSlug(newsItem.title);
          // Используем replace для замены URL без добавления в историю
          router.replace(`/news/${correctSlug}`, { scroll: false });
          return;
        }
      } else {
        // Новый формат - ищем по slug
        // Сначала пробуем найти точное совпадение
        for (const item of data) {
          const itemSlug = getNewsSlug(item.title);
          if (itemSlug === decodedSlug) {
            newsItem = item;
            break;
          }
        }
        
        // Если не нашли точное совпадение, пробуем найти без учета регистра
        if (!newsItem) {
          for (const item of data) {
            const itemSlug = getNewsSlug(item.title);
            if (itemSlug.toLowerCase() === decodedSlug.toLowerCase()) {
              newsItem = item;
              break;
            }
          }
        }
        
        // Если все еще не нашли, пробуем найти по частичному совпадению (без дефисов)
        if (!newsItem) {
          const normalizedSlug = decodedSlug.replace(/-/g, '').toLowerCase();
          for (const item of data) {
            const itemSlug = getNewsSlug(item.title);
            const normalizedItemSlug = itemSlug.replace(/-/g, '').toLowerCase();
            if (normalizedItemSlug === normalizedSlug) {
              newsItem = item;
              break;
            }
          }
        }
        
        // Последний fallback - поиск по ключевым словам
        if (!newsItem) {
          const slugWords = decodedSlug.split('-').filter(w => w.length > 2);
          if (slugWords.length > 0) {
            for (const item of data) {
              const itemSlug = getNewsSlug(item.title);
              if (slugWords.every(word => itemSlug.includes(word))) {
                newsItem = item;
                break;
              }
            }
          }
        }
      }
      
      setNews(newsItem || null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchNews(slug);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="page-wrapper">
          <main className="bg-white min-h-screen w-full">
            <section className="py-fluid-lg">
              <div className="content-wrapper">
                <p style={{ fontFamily: "var(--font-proba)" }}>Завантаження...</p>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Header />
        <div className="page-wrapper">
          <main className="bg-white min-h-screen w-full">
            <section className="py-fluid-lg">
              <div className="content-wrapper">
                <div className="text-center">
                  <h1
                    className="font-semibold text-gray-900 mb-fluid-md"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    Новину не знайдено
                  </h1>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#23527c] hover:text-[#1a3d5c] transition-colors"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Повернутися на головну
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <section className="py-fluid-lg">
            <div className="content-wrapper">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#23527c] hover:text-[#1a3d5c] transition-colors mb-fluid-md"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Повернутися на головну
              </Link>

              <article className="max-w-4xl mx-auto">
                {news.image && (
                  <div className="relative w-full h-96 mb-fluid-lg rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-fluid-sm mb-fluid-md flex-wrap">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      {formatDate(news.date)}
                    </span>
                  </div>
                  {news.category && (
                    <span
                      className="inline-block px-3 py-1 text-sm bg-white border border-[#23527c] rounded-full uppercase"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      {news.category}
                    </span>
                  )}
                </div>

                <h1
                  className="font-semibold text-gray-900 mb-fluid-lg"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {news.title}
                </h1>

                <div
                  className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {news.text}
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

