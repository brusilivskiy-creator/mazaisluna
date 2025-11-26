import Image from "next/image";
import { prisma } from "@/lib/prisma";

interface Leader {
  id: number;
  position: string;
  name: string | null;
  image: string | null;
  party: string | null;
  partyLogo: string | null;
}

export async function LeadershipCardsSection() {
  try {
    // Fetch data directly from database using Prisma (server component)
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

    // Format data for display
    const leaders: Leader[] = leadership.map((l) => ({
      id: l.id,
      position: l.position.name,
      name: l.politician.name,
      image: l.politician.image,
      party: l.politician.party?.name || null,
      partyLogo: l.politician.party?.logo || null,
    }));

    return (
      <section className="py-fluid-lg">
        <div className="content-wrapper">
          <h1
            className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Керівництво держави
          </h1>

          <div className="grid grid-cols-1 gap-fluid-md justify-items-start md:grid-cols-3 md:justify-items-stretch">
            {leaders.map((leader) => (
              <div
                key={leader.id}
                className="w-full p-fluid-md rounded-lg hover:shadow-md transition-shadow bg-white flex flex-row items-start justify-start text-left md:flex-col md:items-center md:text-center"
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
  } catch (error) {
    console.error("Error loading leadership:", error);
    return (
      <section className="py-fluid-lg">
        <div className="content-wrapper">
          <h1
            className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Керівництво держави
          </h1>
          <p style={{ fontFamily: "var(--font-proba)" }} className="text-gray-600">
            Помилка завантаження даних
          </p>
        </div>
      </section>
    );
  }
}

