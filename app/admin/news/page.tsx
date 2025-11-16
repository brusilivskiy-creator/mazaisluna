"use client";

import { useState, useEffect } from "react";
import { News } from "@/lib/news";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/admin/auth-guard";
import Link from "next/link";
import Image from "next/image";

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsCategories, setNewsCategories] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null as string | null,
    date: new Date().toISOString().split("T")[0],
    text: "",
    category: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?type=news_category");
      const data = await response.json();
      setNewsCategories(data.map((cat: { name: string }) => cat.name));
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback к дефолтным категориям
      setNewsCategories([
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
      ]);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Форматируем дату в ISO формат
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
          }),
        });

        if (response.ok) {
          await fetchNews();
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
          }),
        });

        if (response.ok) {
          await fetchNews();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Помилка при збереженні");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю новину?")) return;

    try {
      const response = await fetch(`/api/news?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Помилка при видаленні");
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingId(newsItem.id);
    const dateStr = new Date(newsItem.date).toISOString().split("T")[0];
    setFormData({
      title: newsItem.title,
      image: newsItem.image,
      date: dateStr,
      text: newsItem.text,
      category: newsItem.category || "",
    });
    setImagePreview(newsItem.image);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      image: null,
      date: new Date().toISOString().split("T")[0],
      text: "",
      category: "",
    });
    setImagePreview(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData({ ...formData, image: data.path });
        setImagePreview(data.path);
      } else {
        alert("Помилка при завантаженні файлу");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка при завантаженні файлу");
    } finally {
      setUploadingImage(false);
    }
  };

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
                            <Image
                              src={imagePreview || formData.image || ""}
                              alt="Попередній перегляд"
                              fill
                              className="object-cover"
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

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Категорія
                        </label>
                        <select
                          value={newsCategories.includes(formData.category) ? formData.category : ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              setFormData({ ...formData, category: e.target.value });
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          <option value="">Виберіть стандартну категорію</option>
                          {newsCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Або введіть свою категорію"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                          style={{ fontFamily: "var(--font-proba)" }}
                        />
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                          Оберіть категорію зі списку або введіть свою
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
                {news
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((newsItem) => (
                    <div
                      key={newsItem.id}
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col"
                    >
                      {newsItem.image && (
                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={newsItem.image}
                            alt={newsItem.title}
                            fill
                            className="object-cover"
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
                      {newsItem.category && (
                        <span
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {newsItem.category}
                        </span>
                      )}
                      <p
                        className="text-sm text-gray-700 line-clamp-3 mb-4"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {newsItem.text}
                      </p>
                      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(newsItem)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDelete(newsItem.id)}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </AuthGuard>
  );
}

