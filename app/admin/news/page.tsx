"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { News } from "@/lib/news";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/admin/auth-guard";
import Link from "next/link";
import { ImageDisplay } from "@/components/ui/image-display";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Мемоізований компонент картки новини
const NewsCard = memo(({ 
  newsItem, 
  onEdit, 
  onDelete 
}: { 
  newsItem: News; 
  onEdit: (item: News) => void;
  onDelete: (id: number) => void;
}) => {
  const handleEdit = useCallback(() => {
    onEdit(newsItem);
  }, [newsItem, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(newsItem.id);
  }, [newsItem.id, onDelete]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col">
      {newsItem.image && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
          <ImageDisplay
            src={newsItem.image}
            alt={newsItem.title}
            fill
            objectFit="cover"
          />
        </div>
      )}
      <h3
        className="text-lg font-bold text-gray-900 mb-2 line-clamp-2"
        style={{ fontFamily: "var(--font-proba)" }}
      >
        {newsItem.title}
      </h3>
      <p
        className="text-sm text-gray-600 mb-2"
        style={{ fontFamily: "var(--font-proba)" }}
      >
        {new Date(newsItem.date).toLocaleDateString("uk-UA")}
      </p>
      <div className="flex flex-wrap gap-2 mb-2">
        {newsItem.category && (
          <span
            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            📰 {newsItem.category}
          </span>
        )}
        {newsItem.navigationCategory && (
          <span
            className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            🗂️ {newsItem.navigationCategory}
          </span>
        )}
      </div>
      <p
        className="text-sm text-gray-700 line-clamp-3 mb-4"
        style={{ fontFamily: "var(--font-proba)" }}
      >
        {newsItem.text}
      </p>
      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={handleEdit}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Редагувати
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Видалити
        </button>
      </div>
    </div>
  );
});

NewsCard.displayName = "NewsCard";

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsCategories, setNewsCategories] = useState<string[]>([]);
  const [navigationCategories, setNavigationCategories] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null as string | null,
    date: new Date().toISOString().split("T")[0],
    text: "",
    category: "",
    navigationCategory: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const ITEMS_PER_PAGE = 25;

  // Мемоізовані категорії для fallback
  const defaultNewsCats = useMemo(() => [
    "Прем'єр-міністр",
    "Віце-прем'єр-міністр",
    "Енергетика",
    "Будівництво",
    "Антикорупційна діяльність",
    "Засідання Уряду",
    "Надзвичайні ситуації",
    "Соціальна політика",
    "Економіка",
    "Освіта",
    "Охорона здоров'я",
    "Транспорт",
    "Сільське господарство",
    "Екологія",
    "Міжнародні відносини",
  ], []);

  const defaultNavCats = useMemo(() => [
    "Новини Парламенту",
    "Виступи та коментарі",
  ], []);

  // Оптимізоване завантаження даних - паралельні запити
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [newsResponse, newsCatResponse, navCatResponse] = await Promise.all([
        fetch(`/api/news?page=${currentPage}&limit=${ITEMS_PER_PAGE}&admin=true`),
        fetch("/api/categories?type=news_category"),
        fetch("/api/categories?type=news_navigation"),
      ]);

      // Обробка новин
      const newsData = await newsResponse.json();
      if (newsData.data && newsData.pagination) {
        // З пагінацією
        setNews(newsData.data);
        setPagination(newsData.pagination);
      } else {
        // Без пагінації (fallback)
        setNews(newsData);
        setPagination(null);
      }

      // Обробка категорій
      try {
        const newsCatData = await newsCatResponse.json();
        const newsCatNames = newsCatData.map((cat: { name: string }) => cat.name);
        setNewsCategories(newsCatNames);
      } catch (error) {
        console.error("Error parsing news categories:", error);
        setNewsCategories(defaultNewsCats);
      }

      try {
        const navCatData = await navCatResponse.json();
        const navCatNames = navCatData.map((cat: { name: string }) => cat.name);
        setNavigationCategories(navCatNames);
      } catch (error) {
        console.error("Error parsing navigation categories:", error);
        setNavigationCategories(defaultNavCats);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback до дефолтних категорій
      setNewsCategories(defaultNewsCats);
      setNavigationCategories(defaultNavCats);
    } finally {
      setLoading(false);
    }
  }, [currentPage, defaultNewsCats, defaultNavCats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dateISO = new Date(formData.date).toISOString();

      if (editingId) {
        const response = await fetch("/api/news", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            image: formData.image,
            date: dateISO,
            text: formData.text,
            category: formData.category || null,
            navigationCategory: formData.navigationCategory || null,
          }),
        });

        if (response.ok) {
          await fetchData();
          resetForm();
        }
      } else {
        const response = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            image: formData.image,
            date: dateISO,
            text: formData.text,
            category: formData.category || null,
            navigationCategory: formData.navigationCategory || null,
          }),
        });

        if (response.ok) {
          await fetchData();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Помилка при збереженні");
    }
  }, [editingId, formData, fetchData]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю новину?")) return;

    try {
      const response = await fetch(`/api/news?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Помилка при видаленні");
    }
  }, [fetchData]);

  const handleEdit = useCallback((newsItem: News) => {
    setEditingId(newsItem.id);
    const dateStr = new Date(newsItem.date).toISOString().split("T")[0];
    setFormData({
      title: newsItem.title,
      image: newsItem.image,
      date: dateStr,
      text: newsItem.text,
      category: newsItem.category || "",
      navigationCategory: newsItem.navigationCategory || "",
    });
    setImagePreview(newsItem.image);
    setShowForm(true);
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFormData({
      title: "",
      image: null,
      date: new Date().toISOString().split("T")[0],
      text: "",
      category: "",
      navigationCategory: "",
    });
    setImagePreview(null);
    setShowForm(false);
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, виберіть файл зображення");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір файлу не повинен перевищувати 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("type", "news");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        // Використовуємо dataUrl (base64) для збереження в базі даних
        const imageData = data.dataUrl || data.path;
        setFormData((prev) => ({ ...prev, image: imageData }));
        setImagePreview(imageData);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Помилка при завантаженні файлу: ${errorData.error || "Невідома помилка"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка при завантаженні файлу");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  // Мемоізований відсортований список новин
  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [news]);

  // Обробники пагінації
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p style={{ fontFamily: "var(--font-proba)" }}>Завантаження...</p>
        </div>
        <Footer />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Header />
      <div className="page-wrapper">
        <main className="bg-white min-h-screen w-full">
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="content-wrapper">
              <div className="mb-6">
                <Link
                  href="/admin"
                  className="text-[#23527c] hover:text-[#1a3d5c] transition-colors inline-flex items-center gap-2 mb-4"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  ← Назад до адмін-панелі
                </Link>
              </div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl md:text-4xl font-semibold text-gray-900"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Новини - Адмін панель
                </h1>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                  className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {showForm ? "Скасувати" : "+ Додати новину"}
                </button>
              </div>

              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {editingId ? "Редагувати новину" : "Додати нову новину"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Заголовок *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Фото новини
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#23527c] file:text-white hover:file:bg-[#1a3d5c] cursor-pointer"
                        style={{ fontFamily: "var(--font-proba)" }}
                      />
                      {uploadingImage && (
                        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                          Завантаження...
                        </p>
                      )}
                      {(imagePreview || formData.image) && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: "var(--font-proba)" }}>
                            Попередній перегляд:
                          </p>
                          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
                            <ImageDisplay
                              src={imagePreview || formData.image || ""}
                              alt="Попередній перегляд"
                              fill
                              objectFit="cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Дата *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                          style={{ fontFamily: "var(--font-proba)" }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Категорія для новин
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            setFormData({ ...formData, category: e.target.value || "" });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          <option value="">Не вибрано</option>
                          {newsCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                          Категорія для класифікації новини
                        </p>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Категорія для навігації (роздільник)
                        </label>
                        <select
                          value={formData.navigationCategory}
                          onChange={(e) => {
                            setFormData({ ...formData, navigationCategory: e.target.value || "" });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          <option value="">Не вибрано</option>
                          {navigationCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                          Категорія для відображення в роздільниках зверху (таби навігації)
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Текст новини *
                      </label>
                      <textarea
                        required
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        rows={8}
                        style={{ fontFamily: "var(--font-proba)" }}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {editingId ? "Зберегти зміни" : "Додати"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Скасувати
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedNews.map((newsItem) => (
                  <NewsCard
                    key={newsItem.id}
                    newsItem={newsItem}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Пагінація */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Попередня
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNum
                              ? "bg-[#23527c] text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    Наступна
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {pagination && (
                <div className="mt-4 text-center text-sm text-gray-600" style={{ fontFamily: "var(--font-proba)" }}>
                  Сторінка {pagination.page} з {pagination.totalPages} (всього: {pagination.total})
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </AuthGuard>
  );
}
