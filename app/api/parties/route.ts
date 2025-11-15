import { NextRequest, NextResponse } from "next/server";
import {
  getAllParties,
  addParty,
  updateParty,
  deleteParty,
  type Party,
} from "@/lib/parties";

export async function GET() {
  try {
    const parties = getAllParties();
    return NextResponse.json(parties);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch parties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logo, seats, note } = body;

    if (!name || seats === undefined) {
      return NextResponse.json({ error: "Name and seats are required" }, { status: 400 });
    }

    const newParty = addParty({
      name,
      logo: logo || "/images/political-parties/alt.png",
      seats: parseInt(seats) || 0,
      note: note || null,
    });

    return NextResponse.json(newParty, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add party" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, logo, seats, note } = body;

    if (!id || !name || seats === undefined) {
      return NextResponse.json({ error: "ID, name and seats are required" }, { status: 400 });
    }

    const updated = updateParty(id, {
      name,
      logo: logo || "/images/political-parties/alt.png",
      seats: parseInt(seats) || 0,
      note: note || null,
    });

    if (!updated) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
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

    const deleted = deleteParty(id);
    if (!deleted) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete party" }, { status: 500 });
  }
}

