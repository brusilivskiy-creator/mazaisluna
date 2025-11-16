"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { News } from "@/lib/news";
import { Clock } from "lucide-react";

interface NavigationItem {
  label: string;
  category: string | null;
}

interface NewsSectionClientProps {
  news: News[];
  navigationItems: NavigationItem[];
}

export function NewsSectionClient({ news, navigationItems }: NewsSectionClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Фильтруем новости по выбранной категории
  const filteredNews = activeCategory
    ? news.filter((item) => item.category === activeCategory)
    : news;

  // Первые 2 новости с изображениями - большие карточки
  const featuredNews = filteredNews.slice(0, 2);
  // Следующие новости без фото - маленькие карточки
  const smallNews = filteredNews.slice(2);
  // Все новости для правой колонки
  const listNews = filteredNews;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("uk-UA", { month: "long" });
    const time = date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
    return { day, month, time, fullDate: `${day} ${month} ${time}` };
  };

  return (
    <section className="py-fluid-lg bg-white">
      <div className="content-wrapper px-0 md:px-[var(--container-padding)]">
        {/* Навигационное меню */}
        <div className="mb-fluid-lg">
          <nav className="flex items-center gap-fluid-md overflow-x-auto">
            {navigationItems.length > 0 ? (
              navigationItems.map((item) => {
                const isActive = activeCategory === item.category;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveCategory(item.category)}
                    className={`font-bold transition-colors whitespace-nowrap pb-2 ${
                      isActive
                        ? "text-black border-b-4 border-[#23527c]"
                        : "text-[#23527c] border-b-4 border-transparent hover:text-[#23527c]"
                    }`}
                    style={{ fontFamily: "var(--font-proba)", fontVariant: "small-caps" }}
                  >
                    {item.label}
                  </button>
                );
              })
            ) : (
              // Fallback пока загружаются данные
              <button
                onClick={() => setActiveCategory(null)}
                className="font-bold transition-colors whitespace-nowrap pb-2 border-b-4 text-black border-[#23527c]"
                style={{ fontFamily: "var(--font-proba)", fontVariant: "small-caps" }}
              >
                Новини Уряду
              </button>
            )}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-fluid-lg">
          {/* Левая колонка - главные новости */}
          <div className="lg:col-span-2 space-y-fluid-md">
            {/* Две большие карточки с изображениями */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-md items-start">
              {featuredNews.map((item) => {
                const dateInfo = formatDate(item.date);
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group bg-white overflow-hidden flex flex-col items-start"
                  >
                    {item.image && (
                      <div className="relative w-full overflow-hidden bg-gray-100 flex-shrink-0" style={{ height: '12rem', width: '100%' }}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col w-full">
                      <h3
                        className="font-semibold text-[#23527c] mt-fluid-md mb-fluid-sm px-0"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-fluid-xs flex-wrap pt-fluid-sm pr-0 md:pr-fluid-md pb-fluid-md pl-0">
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
                            className="inline-block px-3 py-1 text-xs bg-white border border-[#23527c] rounded-full uppercase"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Новости без фото - маленькие карточки */}
            {smallNews.length > 0 && (
              <div className="mt-fluid-md grid grid-cols-1 md:grid-cols-2 gap-fluid-md">
                {smallNews.map((item) => {
                  const dateInfo = formatDate(item.date);
                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="block bg-white"
                    >
                      <div className="flex-1 flex flex-col w-full">
                        <p
                          className="font-medium text-gray-900 mt-fluid-sm mb-fluid-sm px-0"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {item.title}
                        </p>
                        <div className="flex items-center gap-fluid-xs flex-wrap pt-fluid-sm pr-0 md:pr-fluid-md pb-fluid-md pl-0">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span
                              className="text-xs"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {dateInfo.fullDate}
                            </span>
                          </div>
                          {item.category && (
                            <span
                              className="inline-block px-2 py-0.5 text-xs bg-white border border-[#23527c] rounded-full uppercase"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Правая колонка - список новостей */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg pt-0 px-0 md:px-fluid-md pb-fluid-md sticky top-4">
              <div className="space-y-fluid-sm">
                {listNews.slice(0, 6).map((item) => {
                  const dateInfo = formatDate(item.date);
                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="group block pb-fluid-sm hover:text-[#23527c] transition-colors"
                    >
                      <div
                        className="text-xs text-gray-500 mb-1"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {dateInfo.time}, {dateInfo.day} {dateInfo.month}
                      </div>
                      <p
                        className="font-medium text-gray-900 group-hover:text-[#23527c]"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {item.title}
                      </p>
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 mt-fluid-md text-[#23527c] hover:text-[#1a3d5c] transition-colors"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Усі новини Уряду →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

