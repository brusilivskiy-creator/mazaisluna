import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const parliament = await prisma.parliament.findFirst({
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({
      diagram: parliament?.diagram || null,
    });
  } catch (error) {
    console.error("Error fetching parliament config:", error);
    return NextResponse.json(
      { error: "Failed to fetch parliament config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { diagram } = body;

    // Get or create parliament
    let parliament = await prisma.parliament.findFirst({
      orderBy: {
        date: 'desc',
      },
    });

    if (parliament) {
      // Update existing
      parliament = await prisma.parliament.update({
        where: { id: parliament.id },
        data: { diagram: diagram || null },
      });
    } else {
      // Create new with current date
      parliament = await prisma.parliament.create({
        data: {
          date: new Date(),
          diagram: diagram || null,
        },
      });
    }

    return NextResponse.json({ diagram: parliament.diagram });
  } catch (error) {
    console.error("Error saving parliament config:", error);
    return NextResponse.json(
      { error: "Failed to save parliament config" },
      { status: 500 }
    );
  }
}
