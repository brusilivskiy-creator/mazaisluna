"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { News } from "@/lib/news";
import { Clock, ArrowLeft } from "lucide-react";

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params?.id ? parseInt(params.id as string) : null;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNews = async (id: number) => {
    if (!id || isNaN(id)) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      const newsItem = data.find((item: News) => item.id === id);
      setNews(newsItem || null);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newsId && !isNaN(newsId)) {
      fetchNews(newsId);
    } else {
      setLoading(false);
    }
  }, [newsId]);

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

