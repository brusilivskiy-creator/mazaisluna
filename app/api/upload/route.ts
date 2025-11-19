import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/upload - Starting file upload");
    
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    console.log("POST /api/upload - File:", file?.name, "Type:", type);

    if (!file) {
      console.error("POST /api/upload - No file provided");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!type || (type !== "party" && type !== "person" && type !== "news" && type !== "parliament")) {
      console.error("POST /api/upload - Invalid type:", type);
      return NextResponse.json({ error: "Invalid type. Must be 'party', 'person', 'news' or 'parliament'" }, { status: 400 });
    }

    // Визначаємо папку для зберігання
    const uploadDir = type === "party" 
      ? path.join(process.cwd(), "public", "images", "political-parties")
      : type === "person"
      ? path.join(process.cwd(), "public", "images", "people")
      : type === "parliament"
      ? path.join(process.cwd(), "public", "images", "parliament")
      : path.join(process.cwd(), "public", "images", "news");

    console.log("POST /api/upload - Upload directory:", uploadDir);

    // Створюємо папку, якщо вона не існує
    if (!existsSync(uploadDir)) {
      console.log("POST /api/upload - Creating directory:", uploadDir);
      await mkdir(uploadDir, { recursive: true });
    }

    // Генеруємо унікальне ім'я файлу
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    console.log("POST /api/upload - File path:", filePath);

    // Конвертуємо File в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("POST /api/upload - File size:", buffer.length, "bytes");

    // Зберігаємо файл
    await writeFile(filePath, buffer);

    console.log("POST /api/upload - File saved successfully");

    // Повертаємо шлях відносно public
    const relativePath = type === "party"
      ? `/images/political-parties/${fileName}`
      : type === "person"
      ? `/images/people/${fileName}`
      : type === "parliament"
      ? `/images/parliament/${fileName}`
      : `/images/news/${fileName}`;

    console.log("POST /api/upload - Returning path:", relativePath);

    return NextResponse.json({ 
      success: true, 
      path: relativePath,
      fileName: fileName 
    });
  } catch (error: any) {
    console.error("POST /api/upload - Error uploading file:", error);
    console.error("POST /api/upload - Error details:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ 
      error: "Failed to upload file",
      details: error.message 
    }, { status: 500 });
  }
}

