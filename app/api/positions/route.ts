import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, order, action, id, direction } = body;

    // Якщо це запит на переміщення
    if (action === "move" && id && direction) {
      const current = await prisma.position.findUnique({
        where: { id: parseInt(String(id)) },
      });

      if (!current) {
        return NextResponse.json({ error: "Position not found" }, { status: 404 });
      }

      const allPositions = await prisma.position.findMany({
        orderBy: { order: 'asc' },
      });

      const currentIndex = allPositions.findIndex((p) => p.id === current.id);
      if (currentIndex === -1) {
        return NextResponse.json({ error: "Position not found in list" }, { status: 404 });
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= allPositions.length) {
        return NextResponse.json({ error: "Cannot move position" }, { status: 400 });
      }

      const target = allPositions[newIndex];

      // Міняємо порядок
      await prisma.position.update({
        where: { id: current.id },
        data: { order: target.order },
      });

      await prisma.position.update({
        where: { id: target.id },
        data: { order: current.order },
      });

      const positions = await prisma.position.findMany({
        orderBy: { order: 'asc' },
      });

      return NextResponse.json(positions);
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Визначаємо порядок
    let positionOrder = order;
    if (positionOrder === undefined || positionOrder === null) {
      const maxOrder = await prisma.position.aggregate({
        _max: { order: true },
      });
      positionOrder = (maxOrder._max.order || 0) + 1;
    }

    const newPosition = await prisma.position.create({
      data: {
        name,
        category: category || null,
        order: parseInt(String(positionOrder)),
      },
    });

    return NextResponse.json(newPosition, { status: 201 });
  } catch (error) {
    console.error("Error adding position:", error);
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

    const currentPosition = await prisma.position.findUnique({
      where: { id: parseInt(String(id)) },
    });

    if (!currentPosition) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    const updated = await prisma.position.update({
      where: { id: parseInt(String(id)) },
      data: {
        name,
        category: category || null,
        order: order !== undefined && order !== null ? parseInt(String(order)) : currentPosition.order,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating position:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }
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

    await prisma.position.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting position:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete position" }, { status: 500 });
  }
}
