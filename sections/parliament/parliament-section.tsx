"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Party } from "@/lib/parties";

export function ParliamentSection() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => {
        // Фільтруємо тільки партії з мандатами > 0 для відображення в парламенті
        const partiesWithSeats = data.filter((party: Party) => party.seats > 0);
        setParties(partiesWithSeats);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parties:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <p style={{ fontFamily: "var(--font-proba)" }}>Завантаження...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <h2
          className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 md:mb-6 text-left pb-3 border-b border-gray-300"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Склад парламенту
        </h2>

        {/* Список партий */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 flex-1 content-start">
          {parties.map((party) => (
            <div
              key={party.id}
              className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
                <Image
                  src={party.logo}
                  alt={party.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-sm md:text-base font-semibold text-gray-900 mb-0.5"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {party.name}
                </h3>
                <p
                  className="text-xs md:text-sm font-bold text-[#23527c]"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {party.seats} мандатів
                </p>
                {party.note && (
                  <p
                    className="text-xs text-gray-600 italic mt-0.5"
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

