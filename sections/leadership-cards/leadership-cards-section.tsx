"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Leader {
  id: number;
  position: string;
  name: string | null;
  image: string | null;
  party: string | null;
  partyLogo: string | null;
}

export function LeadershipCardsSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leadership")
      .then((res) => res.json())
      .then((data) => {
        setLeaders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leadership:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="content-wrapper">
          <p style={{ fontFamily: "var(--font-proba)" }}>Завантаження...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="content-wrapper">
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-8 md:mb-12 text-left pb-4 border-b border-gray-300"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Керівництво держави
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="p-6 border border-gray-300 rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col"
            >
              {leader.image && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mb-4">
                  <Image
                    src={leader.image}
                    alt={leader.name || "Політик"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3
                  className="text-lg md:text-xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.name || "Не вказано"}
                </h3>
                <p
                  className="text-sm md:text-base font-semibold text-[#23527c] mb-4"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.position}
                </p>
              </div>
              {leader.party && leader.partyLogo && (
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-200">
                  <div className="relative w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-white border border-gray-200">
                    <Image
                      src={leader.partyLogo}
                      alt={leader.party}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <p
                    className="text-xs md:text-sm text-gray-600"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {leader.party}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

