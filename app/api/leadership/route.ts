import { NextRequest, NextResponse } from "next/server";
import {
  getAllLeadership,
  addLeadership,
  updateLeadership,
  deleteLeadership,
  type LeadershipPerson,
} from "@/lib/leadership";
import { getPoliticianById } from "@/lib/politicians";
import { getAllPositions } from "@/lib/positions";

export async function GET() {
  try {
    const leadership = getAllLeadership();
    const positions = getAllPositions();
    
    // Розширюємо дані з інформацією про політиків
    const enrichedLeadership = leadership.map((person) => {
      const politician = person.politicianId ? getPoliticianById(person.politicianId) : null;
      const positionData = positions.find((p) => p.name === person.position);
      
      return {
        ...person,
        name: politician?.name || null,
        image: politician?.image || null,
        party: politician?.party || null,
        partyLogo: politician?.partyLogo || null,
        positionOrder: positionData?.order || 9999, // Якщо посади немає в списку, ставимо в кінець
      };
    });
    
    // Сортуємо за порядком посад
    enrichedLeadership.sort((a, b) => a.positionOrder - b.positionOrder);
    
    // Видаляємо тимчасове поле positionOrder
    const result = enrichedLeadership.map(({ positionOrder, ...rest }) => rest);
    
    return NextResponse.json(result);
  } catch (error) {
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

    const newPerson = addLeadership({
      politicianId: politicianId ? (typeof politicianId === "number" ? politicianId : parseInt(String(politicianId))) : null,
      position,
    });

    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
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

    const updated = updateLeadership(id, {
      politicianId: politicianId ? (typeof politicianId === "number" ? politicianId : parseInt(String(politicianId))) : null,
      position,
    });

    if (!updated) {
      return NextResponse.json({ error: "Leadership person not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
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

    const deleted = deleteLeadership(id);
    if (!deleted) {
      return NextResponse.json({ error: "Leadership person not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete leadership" }, { status: 500 });
  }
}

