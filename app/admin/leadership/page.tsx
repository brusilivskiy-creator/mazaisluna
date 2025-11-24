"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { LeadershipPerson } from "@/lib/leadership";
import { Politician } from "@/lib/politicians";
import { Position } from "@/lib/positions";
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

// Мемоізований компонент картки керівництва
const LeadershipCard = memo(({ 
  person, 
  politician,
  onEdit, 
  onDelete 
}: { 
  person: LeadershipPerson;
  politician?: Politician;
  onEdit: (item: LeadershipPerson) => void;
  onDelete: (id: number) => void;
}) => {
  const handleEdit = useCallback(() => {
    onEdit(person);
  }, [person, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(person.id);
  }, [person.id, onDelete]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col">
      <div className="flex-1 mb-4">
        {politician?.image && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 mb-3 bg-gray-100">
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
          {politician?.name || "Політик не вибрано"}
        </h3>
        <p
          className="text-sm font-semibold text-[#23527c] mb-3"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          {person.position}
        </p>
        {politician?.party && (
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

LeadershipCard.displayName = "LeadershipCard";

export default function AdminLeadershipPage() {
  const [leadership, setLeadership] = useState<LeadershipPerson[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    politicianId: "",
    position: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const ITEMS_PER_PAGE = 25;

  // Оптимізоване завантаження даних - паралельні запити
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadershipResponse, politiciansResponse, positionsResponse] = await Promise.all([
        fetch(`/api/leadership?page=${currentPage}&limit=${ITEMS_PER_PAGE}`),
        fetch("/api/politicians"),
        fetch("/api/positions"),
      ]);

      // Обробка керівництва
      const leadershipData = await leadershipResponse.json();
      if (leadershipData.data && leadershipData.pagination) {
        setLeadership(leadershipData.data);
        setPagination(leadershipData.pagination);
      } else {
        setLeadership(leadershipData);
        setPagination(null);
      }

      // Обробка політиків
      const politiciansData = await politiciansResponse.json();
      if (politiciansData.data) {
        setPoliticians(politiciansData.data);
      } else {
        setPoliticians(politiciansData);
      }

      // Обробка посад
      const positionsData = await positionsResponse.json();
      setPositions(positionsData);
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
      const payload = {
        politicianId: formData.politicianId ? parseInt(formData.politicianId) : null,
        position: formData.position,
      };

      if (editingId) {
        (payload as any).id = editingId;
      }

      const response = await fetch("/api/leadership", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchData();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving leadership:", error);
      alert("Помилка при збереженні");
    }
  }, [editingId, formData, fetchData]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю особу?")) return;

    try {
      const response = await fetch(`/api/leadership?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting leadership:", error);
      alert("Помилка при видаленні");
    }
  }, [fetchData]);

  const handleEdit = useCallback((person: LeadershipPerson) => {
    setEditingId(person.id);
    setFormData({
      politicianId: person.politicianId?.toString() || "",
      position: person.position,
    });
    setShowForm(true);
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFormData({ politicianId: "", position: "" });
    setShowForm(false);
  }, []);

  // Мемоізована функція отримання політика
  const getPoliticianById = useCallback((id: number | null): Politician | undefined => {
    if (!id) return undefined;
    return politicians.find((p) => p.id === id);
  }, [politicians]);

  // Мемоізований список керівництва з політиками
  const leadershipWithPoliticians = useMemo(() => {
    return leadership.map((person) => ({
      person,
      politician: getPoliticianById(person.politicianId),
    }));
  }, [leadership, getPoliticianById]);

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
                  Керівництво - Адмін панель
                </h1>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                  className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {showForm ? "Скасувати" : "+ Додати особу"}
                </button>
              </div>

              {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {editingId ? "Редагувати особу" : "Додати нову особу"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Політик *
                      </label>
                      <select
                        required
                        value={formData.politicianId}
                        onChange={(e) => setFormData({ ...formData, politicianId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        <option value="">Виберіть політика</option>
                        {politicians.map((politician) => (
                          <option key={politician.id} value={politician.id}>
                            {politician.name}
                          </option>
                        ))}
                      </select>
                      {formData.politicianId && (
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                          Для додавання нового політика перейдіть до розділу "Політики"
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Посада *
                      </label>
                      <select
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        <option value="">Виберіть посаду</option>
                        {positions.map((position) => (
                          <option key={position.id} value={position.name}>
                            {position.name}
                          </option>
                        ))}
                      </select>
                      {positions.length === 0 && (
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "var(--font-proba)" }}>
                          Список посад порожній. Додайте посади в розділі "Посади"
                        </p>
                      )}
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
                {leadershipWithPoliticians.map(({ person, politician }) => (
                  <LeadershipCard
                    key={person.id}
                    person={person}
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
