"use client";

import { useState, useEffect, useCallback } from "react";
import { Position } from "@/lib/positions";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/admin/auth-guard";
import Link from "next/link";
import { GripVertical } from "lucide-react";

export default function AdminPositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = useCallback(async () => {
    try {
      const response = await fetch("/api/positions");
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await fetch("/api/positions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: formData.name,
            category: formData.category || null,
          }),
        });

        if (response.ok) {
          await fetchPositions();
          resetForm();
        }
      } else {
        const response = await fetch("/api/positions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category || null,
          }),
        });

        if (response.ok) {
          await fetchPositions();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving position:", error);
      alert("Помилка при збереженні");
    }
  }, [editingId, formData, fetchPositions]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю посаду?")) return;

    try {
      const response = await fetch(`/api/positions?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPositions();
      }
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Помилка при видаленні");
    }
  }, [fetchPositions]);

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", id.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = positions.findIndex((p) => p.id === draggedItem);
    const targetIndex = positions.findIndex((p) => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    // Оновлюємо порядок локально для швидкої реакції
    const newPositions = [...positions];
    const [removed] = newPositions.splice(draggedIndex, 1);
    newPositions.splice(targetIndex, 0, removed);

    // Оновлюємо order для всіх позицій
    newPositions.forEach((pos, index) => {
      pos.order = index + 1;
    });

    setPositions(newPositions);
    setDraggedItem(null);

    // Зберігаємо на сервері
    try {
      await Promise.all(
        newPositions.map((pos) =>
          fetch("/api/positions", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: pos.id,
              name: pos.name,
              category: pos.category || null,
              order: pos.order,
            }),
          })
        )
      );
      await fetchPositions(); // Оновлюємо з сервера
    } catch (error) {
      console.error("Error updating positions order:", error);
      alert("Помилка при збереженні порядку");
      await fetchPositions(); // Відновлюємо з сервера у разі помилки
    }
  }, [draggedItem, positions, fetchPositions]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleEdit = useCallback((position: Position) => {
    setEditingId(position.id);
    setFormData({
      name: position.name,
      category: position.category || "",
    });
    setShowForm(true);
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFormData({ name: "", category: "" });
    setShowForm(false);
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
                  Посади - Адмін панель
                </h1>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                  className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {showForm ? "Скасувати" : "+ Додати посаду"}
                </button>
              </div>

              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {editingId ? "Редагувати посаду" : "Додати нову посаду"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Назва посади *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                        placeholder="Наприклад: Прем'єр-міністр Мезайс Луни"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Категорія (опціонально)
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                        placeholder="Наприклад: Уряд, Міністерства, Місцеве самоврядування"
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
                <div className="mb-4">
                  <p className="text-sm text-gray-600" style={{ fontFamily: "var(--font-proba)" }}>
                    Впорядкуйте посади за важливістю. Перетягніть посаду мишкою для зміни порядку.
                  </p>
                </div>
                {positions.map((position, index) => (
                  <div
                    key={position.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, position.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, position.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white p-6 rounded-lg shadow-md border border-gray-300 flex items-center gap-4 cursor-move transition-all ${
                      draggedItem === position.id ? "opacity-50 scale-95" : "hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-sm font-semibold text-gray-500 w-6 text-center"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {index + 1}.
                        </span>
                        <h3
                          className="text-lg font-bold text-gray-900"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {position.name}
                        </h3>
                      </div>
                      {position.category && (
                        <p
                          className="text-sm text-gray-600 italic ml-9"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {position.category}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(position)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
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

