"use client";

import { useState, useEffect } from "react";
import { Party } from "@/lib/parties";
import { Politician } from "@/lib/politicians";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/admin/auth-guard";
import Link from "next/link";
import Image from "next/image";

const AVAILABLE_LOGOS = [
  "/images/political-parties/pa.png",
  "/images/political-parties/nz.png",
  "/images/political-parties/alt.png",
  "/images/political-parties/vic.png",
  "/images/political-parties/bat.png",
  "/images/political-parties/cons.png",
];

export default function AdminPartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "/images/political-parties/alt.png",
    seats: 0,
    note: "",
    leaderId: null as number | null,
    color: "#23527c",
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchParties();
    fetchPoliticians();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await fetch("/api/parties");
      const data = await response.json();
      setParties(data);
    } catch (error) {
      console.error("Error fetching parties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoliticians = async () => {
    try {
      const response = await fetch("/api/politicians");
      const data = await response.json();
      setPoliticians(data);
    } catch (error) {
      console.error("Error fetching politicians:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
            leaderId: formData.leaderId || null,
            color: formData.color || null,
          }),
        });

        if (response.ok) {
          await fetchParties();
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
            leaderId: formData.leaderId || null,
            color: formData.color || null,
          }),
        });

        if (response.ok) {
          await fetchParties();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving party:", error);
      alert("Помилка при збереженні");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю партію?")) return;

    try {
      const response = await fetch(`/api/parties?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchParties();
      }
    } catch (error) {
      console.error("Error deleting party:", error);
      alert("Помилка при видаленні");
    }
  };

  const handleEdit = (party: Party) => {
    setEditingId(party.id);
    setFormData({
      name: party.name,
      logo: party.logo,
      seats: party.seats,
      note: party.note || "",
      leaderId: party.leaderId || null,
      color: party.color || "#23527c",
    });
    setLogoPreview(party.logo);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", logo: "/images/political-parties/alt.png", seats: 0, note: "", leaderId: null, color: "#23527c" });
    setLogoPreview(null);
    setShowForm(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Перевірка типу файлу
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, виберіть файл зображення");
      return;
    }

    // Перевірка розміру файлу (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір файлу не повинен перевищувати 5MB");
      return;
    }

    setUploadingLogo(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("type", "party");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Upload error response:", responseData);
        alert(`Помилка при завантаженні файлу: ${responseData.error || "Невідома помилка"}`);
        return;
      }

      if (responseData.success && responseData.path) {
        console.log("Upload successful:", responseData.path);
        setFormData({ ...formData, logo: responseData.path });
        setLogoPreview(responseData.path);
      } else {
        alert("Помилка: некоректна відповідь від сервера");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Помилка при завантаженні файлу: " + (error instanceof Error ? error.message : "Невідома помилка"));
    } finally {
      setUploadingLogo(false);
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
                  Партії - Адмін панель
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

              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {editingId ? "Редагувати партію" : "Додати нову партію"}
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
                        Логотип партії
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#23527c] file:text-white hover:file:bg-[#1a3d5c] cursor-pointer"
                        style={{ fontFamily: "var(--font-proba)" }}
                      />
                      {uploadingLogo && (
                        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                          Завантаження...
                        </p>
                      )}
                      {(logoPreview || formData.logo) && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: "var(--font-proba)" }}>
                            Попередній перегляд:
                          </p>
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
                            <Image
                              src={logoPreview || formData.logo}
                              alt="Попередній перегляд"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        </div>
                      )}
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

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Колір партії (для діаграм)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="#23527c"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                          style={{ fontFamily: "var(--font-proba)" }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                        Цей колір буде використовуватися у діаграмах на виборах та в парламенті
                      </p>
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
                {parties.map((party) => {
                  return (
                    <div
                      key={party.id}
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
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
                          {party.color && (
                            <div className="flex items-center gap-2 mt-2">
                              <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: party.color }}
                              />
                              <span
                                className="text-xs text-gray-600"
                                style={{ fontFamily: "var(--font-proba)" }}
                              >
                                {party.color}
                              </span>
                            </div>
                          )}
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
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </AuthGuard>
  );
}

