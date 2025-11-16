import { NextRequest, NextResponse } from "next/server";
import { getParliamentConfig, saveParliamentConfig } from "@/lib/parliament";

export async function GET() {
  try {
    const config = getParliamentConfig();
    return NextResponse.json(config);
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

    const config = { diagram: diagram || null };
    saveParliamentConfig(config);

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error saving parliament config:", error);
    return NextResponse.json(
      { error: "Failed to save parliament config" },
      { status: 500 }
    );
  }
}

