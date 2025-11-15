import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка при виході" },
      { status: 500 }
    );
  }
}

