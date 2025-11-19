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
    const { id, name, logo, seats, note, leaderId, color } = body;

    if (!id || !name || seats === undefined) {
      return NextResponse.json({ error: "ID, name and seats are required" }, { status: 400 });
    }

    const updated = await prisma.party.update({
      where: { id: parseInt(String(id)) },
      data: {
        name,
        logo: logo || "/images/political-parties/alt.png",
        seats: typeof seats === "number" ? seats : parseInt(String(seats)) || 0,
        note: note || null,
        leaderId: leaderId ? parseInt(String(leaderId)) : null,
        color: color || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating party:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update party" }, { status: 500 });
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
