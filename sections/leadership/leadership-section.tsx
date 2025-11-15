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

export function LeadershipSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leadership")
      .then((res) => res.json())
      .then((data) => {
        // Обмежуємо до перших 3 найважливіших посад
        setLeaders(data.slice(0, 3));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leadership:", error);
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
          Керівництво держави
        </h2>

        <div className="space-y-6 flex-1">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="p-6 border border-gray-300 rounded-lg hover:shadow-md transition-shadow flex gap-4"
            >
              {leader.image && (
                <div className="flex-shrink-0">
                  <Image
                    src={leader.image}
                    alt={leader.name || "Політик"}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover w-20 h-20 md:w-24 md:h-24"
                  />
                </div>
              )}
              <div className="flex-1">
                <p
                  className="text-sm md:text-base font-semibold text-[#23527c] mb-2"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.position}
                </p>
                <p
                  className="text-lg md:text-xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.name || "Не вказано"}
                </p>
                {leader.party && leader.partyLogo && (
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded overflow-hidden bg-white border border-gray-200">
                      <Image
                        src={leader.partyLogo}
                        alt={leader.party}
                        width={28}
                        height={28}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


