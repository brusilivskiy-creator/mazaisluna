import { NextRequest, NextResponse } from "next/server";
import {
  getElections,
  updateParliamentElection,
  updateLeaderElection,
  type ParliamentElection,
  type LeaderElection,
} from "@/lib/elections";

export async function GET() {
  try {
    const elections = getElections();
    return NextResponse.json(elections);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch elections" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, election } = body;

    if (type === "parliament") {
      updateParliamentElection(election as ParliamentElection);
      return NextResponse.json({ success: true });
    } else if (type === "leader") {
      updateLeaderElection(election as LeaderElection);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid election type" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update elections" }, { status: 500 });
  }
}

