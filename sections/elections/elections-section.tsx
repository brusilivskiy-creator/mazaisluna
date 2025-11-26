import { prisma } from "@/lib/prisma";
import { ElectionsSectionClient } from "./elections-section-client";

export async function ElectionsSection() {
  try {
    // Parallel data fetching for better performance (server component)
    const [parliamentElection, leaderElection, partiesData, politiciansData] = await Promise.all([
      prisma.parliament.findFirst({
        orderBy: {
          date: 'desc',
        },
        include: {
          results: {
            include: {
              party: true,
            },
          },
          districts: {
            include: {
              candidate: {
                include: {
                  party: true,
                },
              },
              party: true,
            },
          },
        },
      }),
      prisma.leaderElection.findFirst({
        orderBy: {
          date: 'desc',
        },
        include: {
          results: {
            include: {
              candidate: {
                include: {
                  party: true,
                },
              },
              party: true,
            },
          },
        },
      }),
      prisma.party.findMany({
        include: {
          leader: true,
        },
        orderBy: {
          id: 'asc',
        },
      }),
      prisma.politician.findMany({
        include: {
          party: true,
        },
        orderBy: {
          id: 'asc',
        },
      }),
    ]);

    // Format elections data
    const parliamentData = parliamentElection ? {
      id: parliamentElection.id,
      date: parliamentElection.date.toISOString().split('T')[0],
      parties: parliamentElection.results.map((r) => ({
        partyId: r.partyId,
        partyName: r.party.name,
        percentage: r.percentage,
      })),
      majoritarianDistricts: parliamentElection.districts.map((d) => ({
        districtNumber: d.districtNumber,
        candidateId: d.candidateId,
        candidateName: d.candidate.name,
        partyId: d.partyId,
        partyName: d.party.name,
      })),
    } : null;

    const leaderData = leaderElection ? {
      id: leaderElection.id,
      date: leaderElection.date.toISOString().split('T')[0],
      candidates: leaderElection.results.map((r) => ({
        candidateId: r.candidateId,
        candidateName: r.candidate.name,
        percentage: r.percentage,
      })),
    } : null;

    const elections = {
      parliament: parliamentData,
      leader: leaderData,
    };

    // Format parties data
    const parties = partiesData.map((p) => ({
      id: p.id,
      name: p.name,
      logo: p.logo,
      color: p.color,
    }));

    // Format politicians data
    const politicians = politiciansData.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      party: p.party?.name || null,
      partyLogo: p.party?.logo || null,
    }));

    return (
      <ElectionsSectionClient
        elections={elections}
        parties={parties}
        politicians={politicians}
      />
    );
  } catch (error) {
    console.error("Error loading elections:", error);
    return (
      <section className="h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <h2
            className="font-semibold text-gray-900 mb-fluid-lg text-left pb-fluid-sm border-b border-gray-300"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Вибори
          </h2>
          <p
            className="text-gray-600"
            style={{ fontFamily: "var(--font-proba)" }}
          >
            Помилка завантаження даних
          </p>
        </div>
      </section>
    );
  }
}

