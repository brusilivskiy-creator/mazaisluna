import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    // Форматируем для совместимости с фронтендом
    const formatted = leadership.map((l) => ({
      id: l.id,
      politicianId: l.politicianId,
      position: l.position.name,
      name: l.politician.name,
      image: l.politician.image,
      party: l.politician.party?.name || null,
      partyLogo: l.politician.party?.logo || null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching leadership:", error);
    return NextResponse.json({ error: "Failed to fetch leadership" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { politicianId, position } = body;

    if (!position) {
      return NextResponse.json({ error: "Position is required" }, { status: 400 });
    }

    // Находим position по имени
    const positionRecord = await prisma.position.findFirst({
      where: { name: position },
    });

    if (!positionRecord) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    if (!politicianId) {
      return NextResponse.json({ error: "Politician ID is required" }, { status: 400 });
    }

    const newLeadership = await prisma.leadership.create({
      data: {
        politicianId: parseInt(String(politicianId)),
        positionId: positionRecord.id,
      },
      include: {
        politician: {
          include: {
            party: true,
          },
        },
        position: true,
      },
    });

    return NextResponse.json({
      id: newLeadership.id,
      politicianId: newLeadership.politicianId,
      position: newLeadership.position.name,
      name: newLeadership.politician.name,
      image: newLeadership.politician.image,
      party: newLeadership.politician.party?.name || null,
      partyLogo: newLeadership.politician.party?.logo || null,
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding leadership:", error);
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: "This politician is already assigned to this position" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add leadership" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, politicianId, position } = body;

    if (!id || !position) {
      return NextResponse.json({ error: "ID and position are required" }, { status: 400 });
    }

    // Находим position по имени
    const positionRecord = await prisma.position.findFirst({
      where: { name: position },
    });

    if (!positionRecord) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    const updated = await prisma.leadership.update({
      where: { id: parseInt(String(id)) },
      data: {
        politicianId: politicianId ? parseInt(String(politicianId)) : undefined,
        positionId: positionRecord.id,
      },
      include: {
        politician: {
          include: {
            party: true,
          },
        },
        position: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      politicianId: updated.politicianId,
      position: updated.position.name,
      name: updated.politician.name,
      image: updated.politician.image,
      party: updated.politician.party?.name || null,
      partyLogo: updated.politician.party?.logo || null,
    });
  } catch (error) {
    console.error("Error updating leadership:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "Leadership person not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update leadership" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.leadership.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting leadership:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "Leadership person not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete leadership" }, { status: 500 });
  }
}
