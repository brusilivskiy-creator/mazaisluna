"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Party } from "@/lib/parties";

export function ParliamentSection() {
  const [parties, setParties] = useState<Party[]>([]);
  const [parliamentDiagram, setParliamentDiagram] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/parties").then((res) => res.json()),
      fetch("/api/parliament").then((res) => res.json()),
    ])
      .then(([partiesData, parliamentData]) => {
        // Фільтруємо тільки партії з мандатами > 0 для відображення в парламенті
        const partiesWithSeats = partiesData.filter((party: Party) => party.seats > 0);
        setParties(partiesWithSeats);
        setParliamentDiagram(parliamentData.diagram);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <p style={{ fontFamily: "var(--font-proba)" }}>Завантаження...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <h2
          className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Склад парламенту
        </h2>

        {/* Діаграма парламенту */}
        {parliamentDiagram && (
          <div className="mb-fluid-lg">
            <Image
              src={parliamentDiagram}
              alt="Діаграма складу парламенту"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Список партий */}
        <div className="auto-grid flex-1 content-start gap-fluid-sm" style={{'--min-column-width': '280px'} as React.CSSProperties}>
          {parties.map((party) => (
          <div
            key={party.id}
            className="flex items-center gap-fluid-sm p-fluid-sm rounded-lg hover:shadow-md transition-shadow bg-white"
          >
              <div className="relative flex-shrink-0 flex items-center justify-center self-center" style={{ width: 'clamp(3rem, 6vw, 3.5rem)', height: 'clamp(3rem, 6vw, 3.5rem)' }}>
                <Image
                  src={party.logo}
                  alt={party.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center self-center">
                <h3
                  className="text-fluid-base font-semibold text-gray-900 mb-fluid-xs"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {party.name}
                </h3>
                <p
                  className="text-fluid-sm font-bold text-[#23527c]"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {party.seats} мандатів
                </p>
                {party.note && (
                  <p
                    className="text-fluid-xs text-gray-600 italic mt-fluid-xs"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {party.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

