import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const politicians = await prisma.politician.findMany({
      include: {
        party: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    // Форматируем для совместимости с фронтендом
    const formatted = politicians.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      party: p.party?.name || null,
      partyLogo: p.party?.logo || null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching politicians:", error);
    return NextResponse.json({ error: "Failed to fetch politicians" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image, partyId } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newPolitician = await prisma.politician.create({
      data: {
        name,
        image: image || null,
        partyId: partyId ? parseInt(String(partyId)) : null,
      },
      include: {
        party: true,
      },
    });

    return NextResponse.json({
      id: newPolitician.id,
      name: newPolitician.name,
      image: newPolitician.image,
      party: newPolitician.party?.name || null,
      partyLogo: newPolitician.party?.logo || null,
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding politician:", error);
    return NextResponse.json({ error: "Failed to add politician" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("PUT /api/politicians - Request body:", body);
    
    const { id, name, image, party, partyLogo, partyId } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Если передано имя партии, находим её ID
    let finalPartyId: number | null = null;
    if (partyId) {
      finalPartyId = parseInt(String(partyId));
    } else if (party) {
      const partyRecord = await prisma.party.findFirst({
        where: { name: party },
      });
      finalPartyId = partyRecord?.id || null;
    }

    const updateData: any = {
      name,
    };

    if (image !== undefined) {
      updateData.image = image || null;
    }

    if (finalPartyId !== undefined) {
      updateData.partyId = finalPartyId;
    }

    console.log("PUT /api/politicians - Update data:", updateData);

    const updated = await prisma.politician.update({
      where: { id: parseInt(String(id)) },
      data: updateData,
      include: {
        party: true,
      },
    });

    console.log("PUT /api/politicians - Updated politician:", updated);

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      image: updated.image,
      party: updated.party?.name || null,
      partyLogo: updated.party?.logo || null,
    });
  } catch (error: any) {
    console.error("Error updating politician:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta,
    });
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Politician not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: "Failed to update politician",
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.politician.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting politician:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "Politician not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete politician" }, { status: 500 });
  }
}
