import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      include: {
        leader: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const formatted = parties.map((p) => ({
      id: p.id,
      name: p.name,
      logo: p.logo,
      seats: p.seats,
      note: p.note,
      leaderId: p.leaderId,
      color: p.color,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching parties:", error);
    return NextResponse.json({ error: "Failed to fetch parties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logo, seats, note, leaderId, color } = body;

    if (!name || seats === undefined) {
      return NextResponse.json({ error: "Name and seats are required" }, { status: 400 });
    }

    const newParty = await prisma.party.create({
      data: {
        name,
        logo: logo || "/images/political-parties/alt.png",
        seats: typeof seats === "number" ? seats : parseInt(String(seats)) || 0,
        note: note || null,
        leaderId: leaderId ? parseInt(String(leaderId)) : null,
        color: color || null,
      },
    });

    return NextResponse.json(newParty, { status: 201 });
  } catch (error) {
    console.error("Error adding party:", error);
    return NextResponse.json({ error: "Failed to add party" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("PUT /api/parties - Request body:", body);
    
    const { id, name, logo, seats, note, leaderId, color } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (seats === undefined || seats === null) {
      return NextResponse.json({ error: "Seats are required" }, { status: 400 });
    }

    // Подготовка данных для обновления
    const updateData: any = {
      name,
      seats: typeof seats === "number" ? seats : parseInt(String(seats)) || 0,
    };

    // Добавляем поля только если они переданы
    if (logo !== undefined) {
      updateData.logo = logo || "/images/political-parties/alt.png";
    }
    if (note !== undefined) {
      updateData.note = note || null;
    }
    if (leaderId !== undefined) {
      updateData.leaderId = leaderId ? parseInt(String(leaderId)) : null;
    }
    if (color !== undefined) {
      updateData.color = color || null;
    }

    console.log("PUT /api/parties - Update data:", updateData);

    const updated = await prisma.party.update({
      where: { id: parseInt(String(id)) },
      data: updateData,
      include: {
        leader: true,
      },
    });

    console.log("PUT /api/parties - Updated party:", updated);

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      logo: updated.logo,
      seats: updated.seats,
      note: updated.note,
      leaderId: updated.leaderId,
      color: updated.color,
    });
  } catch (error: any) {
    console.error("Error updating party:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta,
    });
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: "Failed to update party",
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

    await prisma.party.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting party:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete party" }, { status: 500 });
  }
}
