import { NextRequest, NextResponse } from "next/server";
import {
  getAllPoliticians,
  addPolitician,
  updatePolitician,
  deletePolitician,
  type Politician,
} from "@/lib/politicians";

export async function GET() {
  try {
    const politicians = getAllPoliticians();
    return NextResponse.json(politicians);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch politicians" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image, party, partyLogo } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newPolitician = addPolitician({
      name,
      image: image || null,
      party: party || null,
      partyLogo: partyLogo || null,
    });

    return NextResponse.json(newPolitician, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add politician" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, image, party, partyLogo } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }

    const updated = updatePolitician(id, {
      name,
      image: image || null,
      party: party || null,
      partyLogo: partyLogo || null,
    });

    if (!updated) {
      return NextResponse.json({ error: "Politician not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update politician" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = deletePolitician(id);
    if (!deleted) {
      return NextResponse.json({ error: "Politician not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete politician" }, { status: 500 });
  }
}

