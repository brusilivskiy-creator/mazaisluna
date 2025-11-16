"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ElectionsData } from "@/lib/elections";
import { Party } from "@/lib/parties";
import { Politician } from "@/lib/politicians";

export function ElectionsSection() {
  const [elections, setElections] = useState<ElectionsData | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"parliament" | "leader">("parliament");

  useEffect(() => {
    fetchElections();
    fetchParties();
    fetchPoliticians();
  }, []);

  // Встановлюємо активний таб залежно від наявності даних
  useEffect(() => {
    if (elections) {
      if (activeTab === "parliament" && !elections.parliament && elections.leader) {
        setActiveTab("leader");
      } else if (activeTab === "leader" && !elections.leader && elections.parliament) {
        setActiveTab("parliament");
      }
    }
  }, [elections, activeTab]);

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

  if (loading) {
    return (
      <section className="h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <p style={{ fontFamily: "var(--font-proba)" }}>Завантаження...</p>
        </div>
      </section>
    );
  }

  if (!elections || (!elections.parliament && !elections.leader)) {
    return (
      <section className="h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <h2
            className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Вибори
          </h2>
          <p
            className="text-gray-600"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Інформація про вибори відсутня
          </p>
        </div>
      </section>
    );
  }

  const getPartyLogo = (partyId: number | null): string | null => {
    if (!partyId) return null;
    const party = parties.find((p) => p.id === partyId);
    return party?.logo || null;
  };

  const getCandidateName = (candidateId: number | null): string | null => {
    if (!candidateId) return null;
    const politician = politicians.find((p) => p.id === candidateId);
    return politician?.name || null;
  };

  // Функция для получения цвета диаграммы на основе рейтинга и позиции
  const getChartColor = (percentage: number, index: number): string => {
    const colors = [
      "#23527c", // 1 место - основной синий
      "#059669", // 2 место - зеленый
      "#dc2626", // 3 место - красный
      "#ea580c", // 4 место - оранжевый
      "#7c3aed", // 5 место - фиолетовый
      "#0891b2", // 6 место - голубой
      "#ca8a04", // 7 место - желтый
      "#be185d", // 8 место - розовый
    ];
    return colors[index] || "#6b7280"; // серый для остальных
  };

  return (
    <section className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <h2
          className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Вибори
        </h2>

        {/* Tabs */}
        {(elections.parliament || elections.leader) && (
          <div className="flex gap-4 mb-6 border-b border-gray-300">
            {elections.parliament && (
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
            )}
            {elections.leader && (
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
            )}
          </div>
        )}

        {/* Parliament Election Content */}
        {activeTab === "parliament" && elections.parliament && (
          <div className="space-y-fluid-lg">
            <div className="mb-fluid-md">
              <p
                className="text-gray-600"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Дата: {new Date(elections.parliament.date).toLocaleDateString("uk-UA")}
              </p>
            </div>

            {/* Результати по партіях */}
            <div className="mb-fluid-lg">
              <h3
                className="font-semibold text-gray-900 mb-fluid-md"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                За партійними списками:
              </h3>
              <div className="space-y-fluid-sm">
                {elections.parliament.parties
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((partyResult, index) => {
                    const partyLogo = getPartyLogo(partyResult.partyId);
                    const maxPercentage = elections.parliament ? Math.max(...elections.parliament.parties.map(p => p.percentage)) : 0;
                    const chartColor = getChartColor(partyResult.percentage, index);
                    return (
                      <div
                        key={partyResult.partyId}
                        className="p-fluid-md border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-fluid-sm mb-fluid-xs">
                          {partyLogo && (
                            <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 'clamp(2.5rem, 5vw, 3rem)', height: 'clamp(2.5rem, 5vw, 3rem)' }}>
                              <Image
                                src={partyLogo}
                                alt={partyResult.partyName}
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 flex items-center justify-between gap-fluid-sm">
                            <h4
                              className="font-semibold text-gray-900"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {partyResult.partyName}
                            </h4>
                            <p
                              className="font-bold text-[#23527c] whitespace-nowrap"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {partyResult.percentage.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${(partyResult.percentage / maxPercentage) * 100}%`,
                              backgroundColor: chartColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Мажоритарні округи */}
            <div>
              <h3
                className="font-semibold text-gray-900 mb-fluid-md"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Мажоритарні округи:
              </h3>
              <div className="auto-grid gap-fluid-sm" style={{'--min-column-width': '280px'} as React.CSSProperties}>
                {elections.parliament.majoritarianDistricts.map((district) => {
                  const candidateName = district.candidateName || getCandidateName(district.candidateId);
                  const candidate = district.candidateId ? politicians.find((p) => p.id === district.candidateId) : null;
                  const candidateImage = candidate?.image || null;
                  const candidateParty = candidate?.party || null;
                  const candidatePartyLogo = candidate?.partyLogo || null;
                  
                  return (
                    <div
                      key={district.districtNumber}
                      className="p-fluid-md border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div
                        className="font-semibold text-[#23527c] mb-fluid-sm"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Округ №{district.districtNumber}
                      </div>
                      {candidateName ? (
                        <div className="flex flex-col items-start text-left gap-fluid-sm">
                          {/* Имя кандидата - всегда сверху */}
                          <h4
                            className="font-semibold text-gray-900 w-full mb-0"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            {candidateName}
                          </h4>
                          
                          {/* Фото кандидата */}
                          {candidateImage && (
                            <div className="relative flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100" style={{ width: 'clamp(2.5rem, 6vw, 3rem)', height: 'clamp(2.5rem, 6vw, 3rem)' }}>
                              <Image
                                src={candidateImage}
                                alt={candidateName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Партия с логотипом - под фото */}
                          {candidateParty && (
                            <div className="flex items-center justify-start gap-2 w-full mt-0">
                              {candidatePartyLogo && (
                                <div className="relative flex-shrink-0 flex items-center justify-center rounded overflow-hidden bg-white border border-gray-200" style={{ width: 'clamp(1.5rem, 3vw, 1.75rem)', height: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                                  <Image
                                    src={candidatePartyLogo}
                                    alt={candidateParty}
                                    width={28}
                                    height={28}
                                    className="w-full h-full object-contain p-1"
                                  />
                                </div>
                              )}
                              <span
                                className="text-gray-600 leading-none"
                                style={{ fontFamily: "var(--font-proba)" }}
                              >
                                {candidateParty}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span
                          className="text-gray-500 italic"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          Не вказано
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Leader Election Content */}
        {activeTab === "leader" && elections.leader && (
          <div className="space-y-fluid-lg">
            <div className="mb-fluid-md">
              <p
                className="text-gray-600"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Дата: {new Date(elections.leader.date).toLocaleDateString("uk-UA")}
              </p>
            </div>
            <div className="space-y-fluid-sm">
              {elections.leader.candidates
                .sort((a, b) => b.percentage - a.percentage)
                .map((candidate, index) => {
                  const politician = candidate.candidateId ? politicians.find((p) => p.id === candidate.candidateId) : null;
                  const candidateImage = politician?.image || null;
                  const candidateParty = politician?.party || null;
                  const candidatePartyLogo = politician?.partyLogo || null;
                  const maxPercentage = elections.leader ? Math.max(...elections.leader.candidates.map(c => c.percentage)) : 0;
                  const chartColor = getChartColor(candidate.percentage, index);
                  
                  return (
                    <div
                      key={index}
                      className="p-fluid-md border border-gray-300 rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-fluid-sm mb-fluid-xs">
                        {candidateImage && (
                          <div className="relative flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100" style={{ width: 'clamp(3rem, 7vw, 3.5rem)', height: 'clamp(3rem, 7vw, 3.5rem)' }}>
                            <Image
                              src={candidateImage}
                              alt={candidate.candidateName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-fluid-sm">
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-semibold text-gray-900 mb-fluid-xs"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {candidate.candidateName}
                            </h4>
                            {candidateParty && (
                              <div className="flex items-center gap-2">
                                {candidatePartyLogo && (
                                  <div className="relative flex-shrink-0 flex items-center justify-center rounded overflow-hidden bg-white border border-gray-200" style={{ width: 'clamp(1.5rem, 3vw, 1.75rem)', height: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                                    <Image
                                      src={candidatePartyLogo}
                                      alt={candidateParty}
                                      width={28}
                                      height={28}
                                      className="w-full h-full object-contain p-1"
                                    />
                                  </div>
                                )}
                                <span
                                  className="text-gray-600 leading-none"
                                  style={{ fontFamily: "var(--font-proba)" }}
                                >
                                  {candidateParty}
                                </span>
                              </div>
                            )}
                          </div>
                          <p
                            className="font-bold text-[#23527c] whitespace-nowrap"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            {candidate.percentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${(candidate.percentage / maxPercentage) * 100}%`,
                            backgroundColor: chartColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

