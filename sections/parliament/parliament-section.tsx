import Image from "next/image";
import { Party } from "@/lib/parties";
import { Politician } from "@/lib/politicians";
import { getAllParties } from "@/lib/parties";
import { getAllPoliticians } from "@/lib/politicians";
import { getParliamentConfig } from "@/lib/parliament";

export function ParliamentSection() {
  try {
    // Fetch data on the server - no delay!
    const partiesData = getAllParties();
    const politiciansData = getAllPoliticians();
    const parliamentData = getParliamentConfig();

    // Filter only parties with seats > 0 for parliament display
    const parties = partiesData.filter((party: Party) => party.seats > 0);
    const politicians = politiciansData;
    const parliamentDiagram = parliamentData.diagram;

  return (
    <section className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <h2
          className="font-semibold text-gray-900 mb-fluid-md text-left pb-fluid-sm border-b border-gray-300 flex-shrink-0"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Склад парламенту
        </h2>

        {/* Діаграма парламенту */}
        {parliamentDiagram && (
          <div className="mb-fluid-md flex-shrink-0">
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
        <div className="auto-grid flex-1 min-h-0 content-start gap-fluid-sm" style={{'--min-column-width': '280px'} as React.CSSProperties}>
          {(() => {
            const totalSeats = parties.reduce((sum, p) => sum + p.seats, 0);
            return parties.map((party) => {
              const percentage = totalSeats > 0 ? (party.seats / totalSeats) * 100 : 0;
              const partyColor = party.color || "#23527c";
            
            return (
              <div
                key={party.id}
                className="flex items-center gap-fluid-sm p-fluid-sm rounded-lg border border-gray-300 hover:shadow-md transition-shadow bg-white"
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
                    className="text-fluid-sm font-bold text-[#23527c] mb-fluid-xs"
                    style={{ fontFamily: "var(--font-proba)" }}
                  >
                    {party.seats} мандатів
                  </p>
                  {/* Діаграма по кількості мандатів */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-fluid-xs">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: partyColor,
                      }}
                    />
                  </div>
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
            );
          });
          })()}
        </div>
      </div>
    </section>
  );
  } catch (error) {
    console.error("Error rendering ParliamentSection:", error);
    return (
      <section className="h-full flex flex-col">
        <div className="flex-1 flex flex-col min-h-0">
          <h2
            className="font-semibold text-gray-900 mb-fluid-md text-left pb-fluid-sm border-b border-gray-300 flex-shrink-0"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Склад парламенту
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "var(--font-proba)" }}>
            Помилка завантаження даних парламенту
          </p>
        </div>
      </section>
    );
  }
}
