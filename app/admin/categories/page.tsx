"use client";

import { useState, useEffect } from "react";
import { Category } from "@/lib/categories";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/admin/auth-guard";
import Link from "next/link";

const CATEGORY_TYPES: { value: Category["type"]; label: string }[] = [
  { value: "news_category", label: "Категорії новин" },
  { value: "news_navigation", label: "Навігація новин" },
  { value: "general", label: "Загальні" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Category["type"]>("news_category");
  const [formData, setFormData] = useState({
    name: "",
    type: "news_category" as Category["type"],
    order: 0,
    description: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            ...formData,
            description: formData.description || null,
          }),
        });

        if (response.ok) {
          await fetchCategories();
          resetForm();
        }
      } else {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            description: formData.description || null,
          }),
        });

        if (response.ok) {
          await fetchCategories();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Помилка при збереженні");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю рубрику?")) return;

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Помилка при видаленні");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      type: category.type,
      order: category.order,
      description: category.description || "",
    });
    setActiveTab(category.type);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      type: "news_category",
      order: 0,
      description: "",
    });
    setShowForm(false);
  };

  const filteredCategories = categories.filter((cat) => cat.type === activeTab);

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
                  Рубрики - Адмін панель
                </h1>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                  className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {showForm ? "Скасувати" : "+ Додати рубрику"}
                </button>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-300">
                <div className="flex gap-4">
                  {CATEGORY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setActiveTab(type.value);
                        resetForm();
                      }}
                      className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                        activeTab === type.value
                          ? "text-[#23527c] border-[#23527c]"
                          : "text-gray-600 border-transparent hover:text-[#23527c]"
                      }`}
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {editingId ? "Редагувати рубрику" : "Додати нову рубрику"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Назва рубрики *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Тип рубрики *
                        </label>
                        <select
                          required
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              type: e.target.value as Category["type"],
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {CATEGORY_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Порядок сортування
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.order}
                          onChange={(e) =>
                            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                          style={{ fontFamily: "var(--font-proba)" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Опис (опціонально)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        rows={3}
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

              <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      Рубрики відсутні
                    </p>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3
                          className="text-lg font-semibold text-gray-900 mb-1"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span style={{ fontFamily: "var(--font-proba)" }}>
                            Тип: {CATEGORY_TYPES.find((t) => t.value === category.type)?.label}
                          </span>
                          <span style={{ fontFamily: "var(--font-proba)" }}>
                            Порядок: {category.order}
                          </span>
                        </div>
                        {category.description && (
                          <p
                            className="text-sm text-gray-600 mt-2"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </AuthGuard>
  );
}






