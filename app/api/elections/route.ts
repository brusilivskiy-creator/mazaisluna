import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch parliament election
    const parliament = await prisma.parliament.findFirst({
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
    });

    // Fetch leader election
    const leaderElection = await prisma.leaderElection.findFirst({
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
    });

    // Format parliament data
    const parliamentData = parliament ? {
      id: parliament.id,
      date: parliament.date.toISOString().split('T')[0],
      parties: parliament.results.map((r) => ({
        partyId: r.partyId,
        partyName: r.party.name,
        percentage: r.percentage,
      })),
      majoritarianDistricts: parliament.districts.map((d) => ({
        districtNumber: d.districtNumber,
        candidateId: d.candidateId,
        candidateName: d.candidate.name,
        partyId: d.partyId,
        partyName: d.party.name,
      })),
    } : null;

    // Format leader election data
    const leaderData = leaderElection ? {
      id: leaderElection.id,
      date: leaderElection.date.toISOString().split('T')[0],
      candidates: leaderElection.results.map((r) => ({
        candidateId: r.candidateId,
        candidateName: r.candidate.name,
        percentage: r.percentage,
      })),
    } : null;

    return NextResponse.json({
      parliament: parliamentData,
      leader: leaderData,
    });
  } catch (error) {
    console.error("Error fetching elections:", error);
    return NextResponse.json({ error: "Failed to fetch elections" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, election } = body;

    if (type === "parliament") {
      const { id, date, parties, majoritarianDistricts } = election;

      // Update or create parliament
      let parliament;
      if (id) {
        // Update existing
        parliament = await prisma.parliament.update({
          where: { id },
          data: {
            date: new Date(date),
          },
        });

        // Delete old results and districts
        await prisma.parliamentResult.deleteMany({
          where: { parliamentId: id },
        });
        await prisma.majoritarianDistrict.deleteMany({
          where: { parliamentId: id },
        });
      } else {
        // Create new
        parliament = await prisma.parliament.create({
          data: {
            date: new Date(date),
          },
        });
      }

      // Create new results
      for (const partyResult of parties) {
        await prisma.parliamentResult.create({
          data: {
            parliamentId: parliament.id,
            partyId: partyResult.partyId,
            percentage: partyResult.percentage,
          },
        });
      }

      // Create new districts
      for (const district of majoritarianDistricts) {
        await prisma.majoritarianDistrict.create({
          data: {
            parliamentId: parliament.id,
            districtNumber: district.districtNumber,
            candidateId: district.candidateId,
            partyId: district.partyId,
          },
        });
      }

      return NextResponse.json({ success: true });
    } else if (type === "leader") {
      const { id, date, candidates } = election;

      // Update or create leader election
      let leaderElection;
      if (id) {
        leaderElection = await prisma.leaderElection.update({
          where: { id },
          data: {
            date: new Date(date),
          },
        });

        // Delete old results
        await prisma.leaderElectionResult.deleteMany({
          where: { leaderElectionId: id },
        });
      } else {
        leaderElection = await prisma.leaderElection.create({
          data: {
            date: new Date(date),
          },
        });
      }

      // Create new results
      for (const candidate of candidates) {
        // Find party for candidate
        const politician = await prisma.politician.findUnique({
          where: { id: candidate.candidateId },
          include: { party: true },
        });

        await prisma.leaderElectionResult.create({
          data: {
            leaderElectionId: leaderElection.id,
            candidateId: candidate.candidateId,
            partyId: politician?.partyId || null,
            percentage: candidate.percentage,
          },
        });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid election type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating elections:", error);
    return NextResponse.json({ error: "Failed to update elections" }, { status: 500 });
  }
}
