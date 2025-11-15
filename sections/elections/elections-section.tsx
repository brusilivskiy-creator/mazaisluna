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
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 text-left pb-3 border-b border-gray-300"
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

  return (
    <section className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <h2
          className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 text-left pb-3 border-b border-gray-300"
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
          <div className="space-y-6">
            <div className="mb-4">
              <p
                className="text-sm md:text-base text-gray-600"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Дата: {new Date(elections.parliament.date).toLocaleDateString("uk-UA")}
              </p>
            </div>

            {/* Результати по партіях */}
            <div className="mb-6">
              <h3
                className="text-base md:text-lg font-semibold text-gray-900 mb-3"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                За партійними списками:
              </h3>
              <div className="space-y-2">
                {elections.parliament.parties
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((partyResult) => {
                    const partyLogo = getPartyLogo(partyResult.partyId);
                    return (
                      <div
                        key={partyResult.partyId}
                        className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                      >
                        <div className="flex items-center gap-3">
                          {partyLogo && (
                            <div className="relative w-8 h-8 flex-shrink-0">
                              <Image
                                src={partyLogo}
                                alt={partyResult.partyName}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <span
                            className="text-sm md:text-base font-medium text-gray-900"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            {partyResult.partyName}
                          </span>
                        </div>
                        <span
                          className="text-sm md:text-base font-bold text-[#23527c]"
                          style={{ fontFamily: "var(--font-proba)" }}
                        >
                          {partyResult.percentage.toFixed(2)}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Мажоритарні округи */}
            <div>
              <h3
                className="text-base md:text-lg font-semibold text-gray-900 mb-3"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Мажоритарні округи:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {elections.parliament.majoritarianDistricts.map((district) => {
                  const candidateName = district.candidateName || getCandidateName(district.candidateId);
                  const candidate = district.candidateId ? politicians.find((p) => p.id === district.candidateId) : null;
                  const candidateImage = candidate?.image || null;
                  const candidateParty = candidate?.party || null;
                  const candidatePartyLogo = candidate?.partyLogo || null;
                  
                  return (
                    <div
                      key={district.districtNumber}
                      className="p-4 border border-gray-300 rounded-lg bg-white"
                    >
                      <div
                        className="text-xs md:text-sm font-semibold text-[#23527c] mb-3"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        Округ №{district.districtNumber}
                      </div>
                      {candidateName ? (
                        <div className="flex items-center gap-3">
                          {candidateImage && (
                            <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={candidateImage}
                                alt={candidateName}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm md:text-base font-medium text-gray-900 mb-1"
                              style={{ fontFamily: "var(--font-proba)" }}
                            >
                              {candidateName}
                            </div>
                            {candidateParty && (
                              <div className="flex items-center gap-2">
                                {candidatePartyLogo && (
                                  <div className="relative w-5 h-5 md:w-6 md:h-6 flex-shrink-0 rounded overflow-hidden bg-white border border-gray-200">
                                    <Image
                                      src={candidatePartyLogo}
                                      alt={candidateParty}
                                      width={24}
                                      height={24}
                                      className="w-full h-full object-contain p-0.5"
                                    />
                                  </div>
                                )}
                                <span
                                  className="text-xs md:text-sm text-gray-600"
                                  style={{ fontFamily: "var(--font-proba)" }}
                                >
                                  {candidateParty}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span
                          className="text-xs md:text-sm text-gray-500 italic"
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
          <div className="space-y-6">
            <div className="mb-4">
              <p
                className="text-sm md:text-base text-gray-600"
                style={{ fontFamily: "var(--font-proba)" }}
              >
                Дата: {new Date(elections.leader.date).toLocaleDateString("uk-UA")}
              </p>
            </div>
            <div className="space-y-3">
              {elections.leader.candidates
                .sort((a, b) => b.percentage - a.percentage)
                .map((candidate, index) => {
                  const politician = candidate.candidateId ? politicians.find((p) => p.id === candidate.candidateId) : null;
                  const candidateImage = politician?.image || null;
                  const candidateParty = politician?.party || null;
                  const candidatePartyLogo = politician?.partyLogo || null;
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {candidateImage && (
                          <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={candidateImage}
                              alt={candidate.candidateName}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm md:text-base font-medium text-gray-900 mb-1"
                            style={{ fontFamily: "var(--font-proba)" }}
                          >
                            {candidate.candidateName}
                          </div>
                          {candidateParty && (
                            <div className="flex items-center gap-2">
                              {candidatePartyLogo && (
                                <div className="relative w-5 h-5 md:w-6 md:h-6 flex-shrink-0 rounded overflow-hidden bg-white border border-gray-200">
                                  <Image
                                    src={candidatePartyLogo}
                                    alt={candidateParty}
                                    width={24}
                                    height={24}
                                    className="w-full h-full object-contain p-0.5"
                                  />
                                </div>
                              )}
                              <span
                                className="text-xs md:text-sm text-gray-600"
                                style={{ fontFamily: "var(--font-proba)" }}
                              >
                                {candidateParty}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className="text-sm md:text-base font-bold text-[#23527c] whitespace-nowrap"
                        style={{ fontFamily: "var(--font-proba)" }}
                      >
                        {candidate.percentage.toFixed(2)}%
                      </span>
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

