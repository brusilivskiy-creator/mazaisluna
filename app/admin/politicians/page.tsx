"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Politician } from "@/lib/politicians";
import { Party } from "@/lib/parties";
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

// Мемоізований компонент картки політика
const PoliticianCard = memo(({ 
  politician, 
  onEdit, 
  onDelete 
}: { 
  politician: Politician; 
  onEdit: (item: Politician) => void;
  onDelete: (id: number) => void;
}) => {
  const handleEdit = useCallback(() => {
    onEdit(politician);
  }, [politician, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(politician.id);
  }, [politician.id, onDelete]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col">
      <div className="flex-1 mb-4">
        {politician.image && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mb-3 bg-gray-100">
            <ImageDisplay
              src={politician.image}
              alt={politician.name}
              fill
              objectFit="cover"
            />
          </div>
        )}
        <h3
          className="text-lg font-bold text-gray-900 mb-2"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          {politician.name}
        </h3>
        {politician.party && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
            {politician.partyLogo && (
              <div className="relative w-6 h-6 flex-shrink-0 rounded overflow-hidden bg-white border border-gray-200">
                <ImageDisplay
                  src={politician.partyLogo}
                  alt={politician.party}
                  width={24}
                  height={24}
                  objectFit="contain"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
            )}
            <p
              className="text-xs text-gray-600"
              style={{ fontFamily: "var(--font-proba)" }}
            >
              {politician.party}
            </p>
          </div>
        )}
      </div>

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

PoliticianCard.displayName = "PoliticianCard";

export default function AdminPoliticiansPage() {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    party: "",
    partyLogo: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const ITEMS_PER_PAGE = 25;

  // Оптимізоване завантаження даних - паралельні запити
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [politiciansResponse, partiesResponse] = await Promise.all([
        fetch(`/api/politicians?page=${currentPage}&limit=${ITEMS_PER_PAGE}`),
        fetch("/api/parties"),
      ]);

      // Обробка політиків
      const politiciansData = await politiciansResponse.json();
      if (politiciansData.data && politiciansData.pagination) {
        // З пагінацією
        setPoliticians(politiciansData.data);
        setPagination(politiciansData.pagination);
      } else {
        // Без пагінації (fallback)
        setPoliticians(politiciansData);
        setPagination(null);
      }

      // Обробка партій
      const partiesData = await partiesResponse.json();
      if (partiesData.data) {
        setParties(partiesData.data);
      } else {
        setParties(partiesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedParty = parties.find((p) => p.name === formData.party);
      const partyId = selectedParty?.id || null;

      const payload: any = {
        name: formData.name,
        image: formData.image || null,
      };

      if (partyId) {
        payload.partyId = partyId;
      } else if (formData.party) {
        payload.party = formData.party;
      }

      if (editingId) {
        payload.id = editingId;
      }

      const response = await fetch("/api/politicians", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(`Помилка при збереженні: ${responseData.error || "Невідома помилка"}`);
        return;
      }

      await fetchData();
      resetForm();
      alert(editingId ? "Політика оновлено" : "Політика додано");
    } catch (error) {
      console.error("Error saving politician:", error);
      alert("Помилка при збереженні: " + (error instanceof Error ? error.message : "Невідома помилка"));
    }
  }, [editingId, formData, parties, fetchData]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цього політика?")) return;

    try {
      const response = await fetch(`/api/politicians?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting politician:", error);
      alert("Помилка при видаленні");
    }
  }, [fetchData]);

  const handleEdit = useCallback((politician: Politician) => {
    setEditingId(politician.id);
    setFormData({
      name: politician.name,
      image: politician.image || "",
      party: politician.party || "",
      partyLogo: politician.partyLogo || "",
    });
    setImagePreview(politician.image || null);
    setShowForm(true);
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFormData({ name: "", image: "", party: "", partyLogo: "" });
    setImagePreview(null);
    setShowForm(false);
  }, []);

  const handlePartyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const partyName = e.target.value;
    const selectedParty = parties.find((p) => p.name === partyName);
    setFormData((prev) => ({
      ...prev,
      party: partyName,
      partyLogo: selectedParty?.logo || "",
    }));
  }, [parties]);

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
      uploadFormData.append("type", "person");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(`Помилка при завантаженні файлу: ${responseData.error || "Невідома помилка"}`);
        return;
      }

      const imageData = responseData.dataUrl || responseData.path;
      setFormData((prev) => ({ ...prev, image: imageData }));
      setImagePreview(imageData);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка при завантаженні файлу");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  // Мемоізований список політиків
  const sortedPoliticians = useMemo(() => {
    return [...politicians].sort((a, b) => a.id - b.id);
  }, [politicians]);

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
                  Політики - Адмін панель
                </h1>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                  className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {showForm ? "Скасувати" : "+ Додати політика"}
                </button>
              </div>

              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {editingId ? "Редагувати політика" : "Додати нового політика"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Ім'я та прізвище *
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
                        Фото політика
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
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
                            <ImageDisplay
                              src={imagePreview || formData.image}
                              alt="Попередній перегляд"
                              fill
                              objectFit="cover"
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
                        Партія
                      </label>
                      <select
                        value={formData.party}
                        onChange={handlePartyChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        <option value="">Без партії</option>
                        {parties.map((party) => (
                          <option key={party.id} value={party.name}>
                            {party.name}
                          </option>
                        ))}
                      </select>
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
                {sortedPoliticians.map((politician) => (
                  <PoliticianCard
                    key={politician.id}
                    politician={politician}
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
