import Image from "next/image";
import { getAllLeadership } from "@/lib/leadership";
import { getAllPositions } from "@/lib/positions";
import { getPoliticianById } from "@/lib/politicians";

interface Leader {
  id: number;
  position: string;
  name: string | null;
  image: string | null;
  party: string | null;
  partyLogo: string | null;
  positionOrder?: number;
}

export function LeadershipSection() {
  // Fetch data on the server - no delay!
  const leadership = getAllLeadership();
  const positions = getAllPositions();

  // Enrich leadership data with politician information
  const enrichedLeadership: Leader[] = leadership.map((person) => {
    const politician = person.politicianId ? getPoliticianById(person.politicianId) : null;
    const positionData = positions.find((p) => p.name === person.position);

    return {
      id: person.id,
      position: person.position,
      name: politician?.name || null,
      image: politician?.image || null,
      party: politician?.party || null,
      partyLogo: politician?.partyLogo || null,
      positionOrder: positionData?.order || 9999,
    };
  });

  // Sort by position order
  enrichedLeadership.sort((a, b) => (a.positionOrder || 9999) - (b.positionOrder || 9999));

  // Limit to first 6 most important positions for homepage
  const leaders = enrichedLeadership.slice(0, 6);

  return (
    <section className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <h2
          className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300 flex-shrink-0"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Керівництво держави
        </h2>

        <div className="grid grid-cols-1 gap-fluid-md justify-items-start md:grid-cols-2 md:justify-items-stretch flex-1 min-h-0">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="w-full h-full p-fluid-md rounded-lg hover:shadow-md transition-shadow bg-white flex flex-row items-start justify-start text-left md:flex-col md:items-center md:text-center"
            >
              {leader.image && (
                <div className="relative w-24 h-24 mb-0 mr-fluid-md flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 md:mb-fluid-md md:mr-0 md:w-24 md:h-24 md:flex-shrink-0">
                  <Image
                    src={leader.image}
                    alt={leader.name || "Політик"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col items-start justify-start w-full text-left md:flex-1 md:items-center md:text-center md:w-full">
                <h3
                  className="text-fluid-lg font-bold text-gray-900 mb-fluid-xs text-left w-full md:text-center"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.name || "Не вказано"}
                </h3>
                <p
                  className="text-fluid-sm font-semibold text-[#23527c] mb-fluid-sm text-left w-full md:text-center"
                  style={{ fontFamily: "var(--font-proba)" }}
                >
                  {leader.position}
                </p>
                {leader.party && leader.partyLogo && (
                  <div className="flex items-center justify-start gap-2 mt-auto pt-fluid-sm border-t border-gray-200 w-full md:justify-center">
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
