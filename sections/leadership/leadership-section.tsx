import { ImageDisplay } from "@/components/ui/image-display";
import { prisma } from "@/lib/prisma";

interface Leader {
  id: number;
  position: string;
  name: string | null;
  image: string | null;
  party: string | null;
  partyLogo: string | null;
  positionOrder?: number;
}

export async function LeadershipSection() {
  try {
    // Fetch data from database using Prisma
    const leadership = await prisma.leadership.findMany({
      include: {
        politician: {
          include: {
            party: true,
          },
        },
        position: true,
      },
      orderBy: {
        position: {
          order: 'asc',
        },
      },
    });

    // Enrich leadership data
    const enrichedLeadership: Leader[] = leadership.map((person) => ({
      id: person.id,
      position: person.position.name,
      name: person.politician.name,
      image: person.politician.image,
      party: person.politician.party?.name || null,
      partyLogo: person.politician.party?.logo || null,
      positionOrder: person.position.order,
    }));

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
                    <ImageDisplay
                      src={leader.image}
                      alt={leader.name || "Політик"}
                      fill
                      objectFit="cover"
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
                        <ImageDisplay
                          src={leader.partyLogo}
                          alt={leader.party}
                          width={28}
                          height={28}
                          objectFit="contain"
                          className="p-1"
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
  } catch (error) {
    console.error("Error rendering LeadershipSection:", error);
    return (
      <section className="h-full flex flex-col">
        <div className="flex-1 flex flex-col min-h-0">
          <h2
            className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300 flex-shrink-0"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Керівництво держави
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "var(--font-proba)" }}>
            Помилка завантаження даних керівництва
          </p>
        </div>
      </section>
    );
  }
}
