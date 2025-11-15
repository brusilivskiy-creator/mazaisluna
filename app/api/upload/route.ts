import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "party" або "person"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!type || (type !== "party" && type !== "person")) {
      return NextResponse.json({ error: "Invalid type. Must be 'party' or 'person'" }, { status: 400 });
    }

    // Визначаємо папку для зберігання
    const uploadDir = type === "party" 
      ? path.join(process.cwd(), "public", "images", "political-parties")
      : path.join(process.cwd(), "public", "images", "people");

    // Створюємо папку, якщо вона не існує
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Генеруємо унікальне ім'я файлу
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    // Конвертуємо File в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Зберігаємо файл
    await writeFile(filePath, buffer);

    // Повертаємо шлях відносно public
    const relativePath = type === "party"
      ? `/images/political-parties/${fileName}`
      : `/images/people/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      path: relativePath,
      fileName: fileName 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

