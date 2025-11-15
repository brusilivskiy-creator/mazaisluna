"use client";

import { useState, useEffect } from "react";
import { ElectionsData, ParliamentElection, LeaderElection } from "@/lib/elections";
import { Party } from "@/lib/parties";
import { Politician } from "@/lib/politicians";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/admin/auth-guard";
import Link from "next/link";
import Image from "next/image";

export default function AdminElectionsPage() {
  const [elections, setElections] = useState<ElectionsData | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"parliament" | "leader">("parliament");

  // Parliament election form
  const [parliamentForm, setParliamentForm] = useState({
    date: "",
    parties: [] as { partyId: number; partyName: string; percentage: number }[],
    majoritarianDistricts: Array.from({ length: 10 }, (_, i) => ({
      districtNumber: i + 1,
      candidateId: null as number | null,
      candidateName: "" as string,
      partyId: null as number | null,
      partyName: "" as string,
    })),
  });

  // Leader election form
  const [leaderForm, setLeaderForm] = useState({
    date: "",
    candidates: [] as { candidateId: number | null; candidateName: string; percentage: number }[],
  });

  useEffect(() => {
    fetchElections();
    fetchParties();
    fetchPoliticians();
  }, []);

  useEffect(() => {
    if (elections) {
      if (elections.parliament) {
        // Забезпечуємо, що завжди є рівно 10 округів
        const districts = [...elections.parliament.majoritarianDistricts];
        while (districts.length < 10) {
          districts.push({
            districtNumber: districts.length + 1,
            candidateId: null,
            candidateName: "",
            partyId: null,
            partyName: "",
          });
        }
        // Обмежуємо до 10, якщо більше
        districts.splice(10);
        
        setParliamentForm({
          date: elections.parliament.date,
          parties: elections.parliament.parties,
          majoritarianDistricts: districts,
        });
      } else {
        // Якщо немає даних про парламентські вибори, ініціалізуємо порожні округи
        setParliamentForm({
          date: "",
          parties: [],
          majoritarianDistricts: Array.from({ length: 10 }, (_, i) => ({
            districtNumber: i + 1,
            candidateId: null,
            candidateName: "",
            partyId: null,
            partyName: "",
          })),
        });
      }
      if (elections.leader) {
        setLeaderForm({
          date: elections.leader.date,
          candidates: elections.leader.candidates,
        });
      } else {
        setLeaderForm({
          date: "",
          candidates: [],
        });
      }
    }
  }, [elections]);

  const fetchElections = async () => {
    try {
      const response = await fetch("/api/elections");
      const data = await response.json();
      setElections(data);
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await fetch("/api/parties");
      const data = await response.json();
      setParties(data);
    } catch (error) {
      console.error("Error fetching parties:", error);
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

  const handleParliamentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parliamentElection: ParliamentElection = {
      id: elections?.parliament?.id || 1,
      date: parliamentForm.date,
      parties: parliamentForm.parties,
      majoritarianDistricts: parliamentForm.majoritarianDistricts,
    };

    try {
      const response = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "parliament",
          election: parliamentElection,
        }),
      });

      if (response.ok) {
        await fetchElections();
        alert("Парламентські вибори оновлено");
      }
    } catch (error) {
      console.error("Error saving parliament election:", error);
      alert("Помилка при збереженні");
    }
  };

  const handleLeaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const leaderElection: LeaderElection = {
      id: elections?.leader?.id || 1,
      date: leaderForm.date,
      candidates: leaderForm.candidates,
    };

    try {
      const response = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "leader",
          election: leaderElection,
        }),
      });

      if (response.ok) {
        await fetchElections();
        alert("Вибори Провідника оновлено");
      }
    } catch (error) {
      console.error("Error saving leader election:", error);
      alert("Помилка при збереженні");
    }
  };

  const addParliamentParty = () => {
    setParliamentForm({
      ...parliamentForm,
      parties: [
        ...parliamentForm.parties,
        { partyId: 0, partyName: "", percentage: 0 },
      ],
    });
  };

  const removeParliamentParty = (index: number) => {
    setParliamentForm({
      ...parliamentForm,
      parties: parliamentForm.parties.filter((_, i) => i !== index),
    });
  };

  const updateParliamentParty = (index: number, field: string, value: any) => {
    const newParties = [...parliamentForm.parties];
    if (field === "partyId") {
      const party = parties.find((p) => p.id === parseInt(value));
      newParties[index] = {
        ...newParties[index],
        partyId: parseInt(value),
        partyName: party?.name || "",
      };
    } else {
      newParties[index] = { ...newParties[index], [field]: value };
    }
    setParliamentForm({ ...parliamentForm, parties: newParties });
  };

  const updateMajoritarianDistrict = (
    districtIndex: number,
    field: string,
    value: any
  ) => {
    const newDistricts = [...parliamentForm.majoritarianDistricts];
    if (field === "candidateId") {
      const politician = politicians.find((p) => p.id === parseInt(value));
      newDistricts[districtIndex] = {
        ...newDistricts[districtIndex],
        candidateId: value ? parseInt(value) : null,
        candidateName: politician?.name || "",
      };
    } else if (field === "partyId") {
      const party = parties.find((p) => p.id === parseInt(value));
      newDistricts[districtIndex] = {
        ...newDistricts[districtIndex],
        partyId: value ? parseInt(value) : null,
        partyName: party?.name || "",
      };
    } else {
      newDistricts[districtIndex] = { ...newDistricts[districtIndex], [field]: value };
    }
    setParliamentForm({ ...parliamentForm, majoritarianDistricts: newDistricts });
  };

  const addLeaderCandidate = () => {
    setLeaderForm({
      ...leaderForm,
      candidates: [
        ...leaderForm.candidates,
        { candidateId: null, candidateName: "", percentage: 0 },
      ],
    });
  };

  const removeLeaderCandidate = (index: number) => {
    setLeaderForm({
      ...leaderForm,
      candidates: leaderForm.candidates.filter((_, i) => i !== index),
    });
  };

  const updateLeaderCandidate = (index: number, field: string, value: any) => {
    const newCandidates = [...leaderForm.candidates];
    if (field === "candidateId") {
      const politician = politicians.find((p) => p.id === parseInt(value));
      newCandidates[index] = {
        ...newCandidates[index],
        candidateId: value ? parseInt(value) : null,
        candidateName: politician?.name || "",
      };
    } else {
      newCandidates[index] = { ...newCandidates[index], [field]: value };
    }
    setLeaderForm({ ...leaderForm, candidates: newCandidates });
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
              <div className="mb-8">
                <h1
                  className="text-3xl md:text-4xl font-semibold text-gray-900"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Вибори - Адмін панель
                </h1>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-300">
                <button
                  onClick={() => setActiveTab("parliament")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "parliament"
                      ? "text-[#23527c] border-b-2 border-[#23527c]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Парламентські вибори
                </button>
                <button
                  onClick={() => setActiveTab("leader")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "leader"
                      ? "text-[#23527c] border-b-2 border-[#23527c]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  Вибори Провідника
                </button>
              </div>

              {/* Parliament Election Form */}
              {activeTab === "parliament" && (
                <form onSubmit={handleParliamentSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      Дата виборів *
                    </label>
                    <input
                      type="date"
                      required
                      value={parliamentForm.date}
                      onChange={(e) =>
                        setParliamentForm({ ...parliamentForm, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                      style={{ fontFamily: "var(--font-proba)" }}
                    />
                  </div>

                  {/* Parties */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Партії та відсотки:
                      </label>
                      <button
                        type="button"
                        onClick={addParliamentParty}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        + Додати партію
                      </button>
                    </div>
                    <div className="space-y-3">
                      {parliamentForm.parties.map((party, index) => (
                        <div
                          key={index}
                          className="flex gap-3 items-center p-4 border border-gray-300 rounded-lg bg-white"
                        >
                          <select
                            required
                            value={party.partyId}
                            onChange={(e) =>
                              updateParliamentParty(index, "partyId", e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            <option value="0">Виберіть партію</option>
                            {parties.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            required
                            min="0"
                            max="100"
                            step="0.01"
                            value={party.percentage}
                            onChange={(e) =>
                              updateParliamentParty(
                                index,
                                "percentage",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                            placeholder="Відсоток"
                            style={{ fontFamily: "var(--font-proba)" }}
                          />
                          <span
                            className="text-gray-600"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            %
                          </span>
                          <button
                            type="button"
                            onClick={() => removeParliamentParty(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            Видалити
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Majoritarian Districts */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-4"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      Мажоритарні округи (10 округів):
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {parliamentForm.majoritarianDistricts.map((district, index) => (
                        <div
                          key={district.districtNumber}
                          className="p-4 border border-gray-300 rounded-lg bg-white"
                        >
                          <div
                            className="text-sm font-semibold text-[#23527c] mb-3"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            Округ №{district.districtNumber}
                          </div>
                          <div className="space-y-2">
                            <select
                              value={district.candidateId || ""}
                              onChange={(e) =>
                                updateMajoritarianDistrict(
                                  index,
                                  "candidateId",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent text-sm"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              <option value="">Виберіть кандидата</option>
                              {politicians.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                            <select
                              value={district.partyId || ""}
                              onChange={(e) =>
                                updateMajoritarianDistrict(
                                  index,
                                  "partyId",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent text-sm"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              <option value="">Виберіть партію</option>
                              {parties.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    Зберегти парламентські вибори
                  </button>
                </form>
              )}

              {/* Leader Election Form */}
              {activeTab === "leader" && (
                <form onSubmit={handleLeaderSubmit} className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      Дата виборів *
                    </label>
                    <input
                      type="date"
                      required
                      value={leaderForm.date}
                      onChange={(e) =>
                        setLeaderForm({ ...leaderForm, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                      style={{ fontFamily: "var(--font-proba)" }}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Кандидати та відсотки:
                      </label>
                      <button
                        type="button"
                        onClick={addLeaderCandidate}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        + Додати кандидата
                      </button>
                    </div>
                    <div className="space-y-3">
                      {leaderForm.candidates.map((candidate, index) => (
                        <div
                          key={index}
                          className="flex gap-3 items-center p-4 border border-gray-300 rounded-lg bg-white"
                        >
                          <select
                            required
                            value={candidate.candidateId || ""}
                            onChange={(e) =>
                              updateLeaderCandidate(index, "candidateId", e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            <option value="">Виберіть кандидата</option>
                            {politicians.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            required
                            min="0"
                            max="100"
                            step="0.01"
                            value={candidate.percentage}
                            onChange={(e) =>
                              updateLeaderCandidate(
                                index,
                                "percentage",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23527c] focus:border-transparent"
                            placeholder="Відсоток"
                            style={{ fontFamily: "var(--font-proba)" }}
                          />
                          <span
                            className="text-gray-600"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            %
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLeaderCandidate(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            Видалити
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#23527c] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    Зберегти вибори Провідника
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </AuthGuard>
  );
}

