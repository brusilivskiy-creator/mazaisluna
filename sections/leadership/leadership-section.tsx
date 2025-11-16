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
        // Обмежуємо до перших 4 найважливіших посад для головної сторінки
        setLeaders(data.slice(0, 4));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leadership:", error);
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
          Керівництво держави
        </h2>

        <div className="auto-grid flex-1 content-start gap-fluid-md" style={{'--min-column-width': '240px'}}>
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="p-fluid-md rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col items-center text-center"
            >
              {leader.image && (
                <div className="relative w-24 h-24 mb-fluid-md flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                  <Image
                    src={leader.image}
                    alt={leader.name || "Політик"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col items-center w-full">
                <h3
                  className="text-fluid-lg font-bold text-gray-900 mb-fluid-xs"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.name || "Не вказано"}
                </h3>
                <p
                  className="text-fluid-sm font-semibold text-[#23527c] mb-fluid-sm"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.position}
                </p>
                {leader.party && leader.partyLogo && (
                  <div className="flex items-center justify-center gap-2 mt-auto pt-fluid-sm border-t border-gray-200 w-full">
                    <div className="relative flex-shrink-0 flex items-center justify-center rounded overflow-hidden bg-white border border-gray-200" style={{ width: 'clamp(1.5rem, 3vw, 1.75rem)', height: 'clamp(1.5rem, 3vw, 1.75rem)' }}>
                      <Image
                        src={leader.partyLogo}
                        alt={leader.party}
                        width={28}
                        height={28}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <span
                      className="text-fluid-xs text-gray-600 leading-none"
                      style={{ fontFamily: "var(--font-proba)" }}
                    >
                      {leader.party}
                    </span>
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


