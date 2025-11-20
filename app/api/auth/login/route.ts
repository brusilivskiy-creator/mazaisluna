import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Хардкоджений логін і пароль (можна винести в змінні оточення)
const ADMIN_USERNAME = "administrator";
const ADMIN_PASSWORD = "MazaisSecure2024!";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Створюємо токен (простий, для продакшну краще використовувати JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
      
      // Зберігаємо в cookie
      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 днів
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Невірний логін або пароль" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка при вході" },
      { status: 500 }
    );
  }
}

