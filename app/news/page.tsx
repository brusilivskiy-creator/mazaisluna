"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { News } from "@/lib/news";
import { Clock, ArrowLeft } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      setNews(data.sort((a: News, b: News) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("uk-UA", { month: "long" });
    const time = date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
    return { day, month, time, fullDate: `${day} ${month} ${time}` };
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

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <section className="py-fluid-lg">
            <div className="content-wrapper">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#23527c] hover:text-[#1a3d5c] transition-colors mb-fluid-lg"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Повернутися на головну
              </Link>

              <h1
                className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Усі новини Уряду
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid-md">
                {news.map((item) => {
                  const dateInfo = formatDate(item.date);
                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="group bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                    >
                      {item.image && (
                        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-fluid-md flex-1 flex flex-col">
                        <h3
                          className="font-semibold text-gray-900 mb-fluid-sm line-clamp-2 group-hover:text-[#23527c] transition-colors flex-1"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-fluid-xs mb-fluid-xs flex-wrap">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span
                              className="text-sm"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {dateInfo.fullDate}
                            </span>
                          </div>
                          {item.category && (
                            <span
                              className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {item.category}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-sm text-gray-600 line-clamp-3"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {item.text}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {news.length === 0 && (
                <div className="text-center py-fluid-lg">
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    Новини відсутні
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}


