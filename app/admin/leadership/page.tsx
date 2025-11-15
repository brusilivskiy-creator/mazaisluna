"use client";

import { useState, useEffect } from "react";
import { LeadershipPerson } from "@/lib/leadership";
import { Politician } from "@/lib/politicians";
import { Position } from "@/lib/positions";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import Image from "next/image";

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

  useEffect(() => {
    fetchLeadership();
    fetchPoliticians();
    fetchPositions();
  }, []);

  const fetchPoliticians = async () => {
    try {
      const response = await fetch("/api/politicians");
      const data = await response.json();
      setPoliticians(data);
    } catch (error) {
      console.error("Error fetching politicians:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/positions");
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const fetchLeadership = async () => {
    try {
      const response = await fetch("/api/leadership");
      const data = await response.json();
      setLeadership(data);
    } catch (error) {
      console.error("Error fetching leadership:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await fetch("/api/leadership", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            politicianId: formData.politicianId ? parseInt(formData.politicianId) : null,
            position: formData.position,
          }),
        });

        if (response.ok) {
          await fetchLeadership();
          resetForm();
        }
      } else {
        const response = await fetch("/api/leadership", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            politicianId: formData.politicianId ? parseInt(formData.politicianId) : null,
            position: formData.position,
          }),
        });

        if (response.ok) {
          await fetchLeadership();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving leadership:", error);
      alert("Помилка при збереженні");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю особу?")) return;

    try {
      const response = await fetch(`/api/leadership?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchLeadership();
      }
    } catch (error) {
      console.error("Error deleting leadership:", error);
      alert("Помилка при видаленні");
    }
  };

  const handleEdit = (person: LeadershipPerson) => {
    setEditingId(person.id);
    setFormData({
      politicianId: person.politicianId?.toString() || "",
      position: person.position,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ politicianId: "", position: "" });
    setShowForm(false);
  };

  const getPoliticianById = (id: number | null): Politician | undefined => {
    if (!id) return undefined;
    return politicians.find((p) => p.id === id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ fontFamily: "var(--font-proba)" }}>Завантаження...</p>
      </div>
    );
  }

  return (
    <>
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
                {leadership.map((person) => {
                  const politician = getPoliticianById(person.politicianId);
                  return (
                    <div
                      key={person.id}
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col"
                    >
                      <div className="flex-1 mb-4">
                        {politician?.image && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 mb-3">
                            <Image
                              src={politician.image}
                              alt={politician.name}
                              fill
                              className="object-cover"
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
                                <Image
                                  src={politician.partyLogo}
                                  alt={politician.party}
                                  width={24}
                                  height={24}
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
                        onClick={() => handleEdit(person)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
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
    </>
  );
}

