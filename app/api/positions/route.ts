import { NextRequest, NextResponse } from "next/server";
import {
  getAllPositions,
  addPosition,
  updatePosition,
  deletePosition,
  movePosition,
  type Position,
} from "@/lib/positions";

export async function GET() {
  try {
    const positions = getAllPositions();
    // Повертаємо вже відсортовані по order
    return NextResponse.json(positions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, order, action } = body;

    // Якщо це запит на переміщення
    if (action === "move" && body.id && body.direction) {
      const moved = movePosition(body.id, body.direction);
      if (!moved) {
        return NextResponse.json({ error: "Failed to move position" }, { status: 400 });
      }
      const positions = getAllPositions();
      return NextResponse.json(positions);
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newPosition = addPosition({
      name,
      category: category || null,
      ...(order !== undefined && order !== null && { order: parseInt(String(order)) }),
    });

    return NextResponse.json(newPosition, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add position" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, order } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }

    const currentPosition = getAllPositions().find((p) => p.id === id);
    if (!currentPosition) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    const updated = updatePosition(id, {
      name,
      category: category || null,
      order: order !== undefined && order !== null ? parseInt(String(order)) : (currentPosition.order || 0),
    });

    if (!updated) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update position" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = deletePosition(id);
    if (!deleted) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete position" }, { status: 500 });
  }
}

