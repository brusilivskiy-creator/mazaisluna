"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Party } from "@/lib/parties";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/admin/auth-guard";
import Link from "next/link";
import { ImageDisplay } from "@/components/ui/image-display";

const AVAILABLE_LOGOS = [
  "/images/political-parties/pa.png",
  "/images/political-parties/nz.png",
  "/images/political-parties/alt.png",
  "/images/political-parties/vic.png",
  "/images/political-parties/bat.png",
  "/images/political-parties/cons.png",
];

export default function AdminParliamentPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "/images/political-parties/alt.png",
    seats: 0,
    note: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [parliamentDiagram, setParliamentDiagram] = useState<string | null>(null);
  const [uploadingDiagram, setUploadingDiagram] = useState(false);
  const [diagramPreview, setDiagramPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Оптимізоване завантаження даних - паралельні запити
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [partiesResponse, parliamentResponse] = await Promise.all([
        fetch("/api/parties"),
        fetch("/api/parliament"),
      ]);

      const partiesData = await partiesResponse.json();
      const partiesList = partiesData.data || partiesData;
      const partiesWithSeats = partiesList.filter((party: Party) => party.seats > 0);
      setParties(partiesWithSeats);

      const parliamentData = await parliamentResponse.json();
      setParliamentDiagram(parliamentData.diagram);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await fetch("/api/parties", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            ...formData,
            seats: parseInt(formData.seats.toString()) || 0,
            note: formData.note || null,
          }),
        });

        if (response.ok) {
          await fetchData();
          resetForm();
        }
      } else {
        const response = await fetch("/api/parties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            seats: parseInt(formData.seats.toString()) || 0,
            note: formData.note || null,
          }),
        });

        if (response.ok) {
          await fetchData();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving party:", error);
      alert("Помилка при збереженні");
    }
  }, [formData, editingId, fetchData]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю партію з парламенту? Мандати будуть встановлені в 0.")) return;

    try {
      const party = parties.find((p) => p.id === id);
      if (party) {
        const response = await fetch("/api/parties", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: party.id,
            name: party.name,
            logo: party.logo,
            seats: 0,
            note: party.note || null,
          }),
        });

        if (response.ok) {
          await fetchData();
        }
      }
    } catch (error) {
      console.error("Error deleting party:", error);
      alert("Помилка при видаленні");
    }
  }, [parties, fetchData]);

  const handleEdit = useCallback((party: Party) => {
    setEditingId(party.id);
    setFormData({
      name: party.name,
      logo: party.logo,
      seats: party.seats,
      note: party.note || "",
    });
    setShowForm(true);
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFormData({ name: "", logo: "/images/political-parties/alt.png", seats: 0, note: "" });
    setShowForm(false);
  }, []);

  const handleDiagramPreview = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setDiagramPreview(null);
      setSelectedFile(null);
      return;
    }

    // Перевірка типу файлу
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, виберіть файл зображення");
      setDiagramPreview(null);
      setSelectedFile(null);
      return;
    }

    // Перевірка розміру файлу (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Розмір файлу не повинен перевищувати 10MB");
      setDiagramPreview(null);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    // Создаем preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setDiagramPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDiagramUpload = useCallback(async () => {
    if (!selectedFile && !diagramPreview) {
      alert("Будь ласка, виберіть файл зображення");
      return;
    }

    if (!diagramPreview) {
      alert("Будь ласка, виберіть файл зображення");
      return;
    }

    setUploadingDiagram(true);

    try {
      // Используем preview (уже base64) для сохранения
      const diagramData = diagramPreview;

      // Зберігаємо діаграму
      const saveResponse = await fetch("/api/parliament", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagram: diagramData }),
      });

      if (saveResponse.ok) {
        const savedData = await saveResponse.json();
        setParliamentDiagram(savedData.diagram);
        setDiagramPreview(null);
        setSelectedFile(null);
        alert("Діаграму успішно завантажено!");
        await fetchData();
      } else {
        const errorData = await saveResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Помилка при збереженні діаграми");
      }
    } catch (error) {
      console.error("Error uploading diagram:", error);
      alert(error instanceof Error ? error.message : "Помилка при завантаженні файлу");
    } finally {
      setUploadingDiagram(false);
    }
  }, [selectedFile, diagramPreview, fetchData]);

  const handleRemoveDiagram = useCallback(async () => {
    if (!confirm("Ви впевнені, що хочете видалити діаграму?")) return;

    try {
      const response = await fetch("/api/parliament", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagram: null }),
      });

      if (response.ok) {
        setParliamentDiagram(null);
        setDiagramPreview(null);
        setSelectedFile(null);
        alert("Діаграму видалено");
        await fetchData();
      } else {
        alert("Помилка при видаленні діаграми");
      }
    } catch (error) {
      console.error("Error removing diagram:", error);
      alert("Помилка при видаленні діаграми");
    }
  }, [fetchData]);

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
                  Склад парламенту - Адмін панель
                </h1>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                  className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {showForm ? "Скасувати" : "+ Додати партію"}
                </button>
              </div>

              {/* Секція завантаження діаграми */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Діаграма парламенту
                </h2>
                <div className="space-y-4">
                  {/* Показываем текущую диаграмму или preview */}
                  {(parliamentDiagram || diagramPreview) && (
                    <div className="relative">
                      <ImageDisplay
                        src={diagramPreview || parliamentDiagram || null}
                        alt="Діаграма парламенту"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg border border-gray-300"
                        objectFit="contain"
                      />
                      {parliamentDiagram && !diagramPreview && (
                        <button
                          onClick={handleRemoveDiagram}
                          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Видалити діаграму
                        </button>
                      )}
                      {diagramPreview && (
                        <div className="mt-2 flex gap-2">
                          <span className="text-sm text-gray-600" style={{ fontFamily: "var(--font-proba)" }}>
                            Попередній перегляд
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      {parliamentDiagram ? "Замінити діаграму" : "Завантажити діаграму"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDiagramPreview}
                      disabled={uploadingDiagram}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent mb-2"
                      style={{ fontFamily: "var(--font-proba)" }}
                    />
                    {diagramPreview && (
                      <button
                        onClick={handleDiagramUpload}
                        disabled={uploadingDiagram}
                        className="px-6 py-2 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {uploadingDiagram ? "Завантаження..." : "Зберегти діаграму"}
                      </button>
                    )}
                    {!diagramPreview && !parliamentDiagram && (
                      <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: "var(--font-proba)" }}>
                        Виберіть файл для попереднього перегляду
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {editingId ? "Редагувати партію" : "Додати партію до парламенту"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Назва партії *
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

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Логотип
                      </label>
                      <select
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {AVAILABLE_LOGOS.map((logo) => (
                          <option key={logo} value={logo}>
                            {logo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Кількість мандатів *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.seats}
                        onChange={(e) =>
                          setFormData({ ...formData, seats: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Примітка
                      </label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parties.map((party) => (
                  <div
                    key={party.id}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <ImageDisplay
                          src={party.logo}
                          alt={party.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-gray-900 mb-1"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {party.name}
                        </h3>
                        <p
                          className="text-sm font-bold text-[#23527c]"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {party.seats} мандатів
                        </p>
                      </div>
                    </div>
                    {party.note && (
                      <p
                        className="text-xs text-gray-600 italic mb-4"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {party.note}
                      </p>
                    )}
                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(party)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(party.id)}
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

