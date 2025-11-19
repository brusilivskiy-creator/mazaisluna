import { NextRequest, NextResponse } from "next/server";

// На Netlify файловая система доступна только для чтения
// Сохраняем изображения как base64 в базе данных или возвращаем base64 для сохранения на клиенте

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/upload - Starting file upload");
    
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    console.log("POST /api/upload - File:", file?.name, "Type:", type, "Size:", file?.size);

    if (!file) {
      console.error("POST /api/upload - No file provided");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!type || (type !== "party" && type !== "person" && type !== "news" && type !== "parliament")) {
      console.error("POST /api/upload - Invalid type:", type);
      return NextResponse.json({ error: "Invalid type. Must be 'party', 'person', 'news' or 'parliament'" }, { status: 400 });
    }

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      console.error("POST /api/upload - Invalid file type:", file.type);
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Проверка размера (макс 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error("POST /api/upload - File too large:", file.size);
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    // Конвертируем файл в base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log("POST /api/upload - File converted to base64, size:", base64.length, "chars");

    // Генерируем уникальное имя файла для отображения
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;

    // Определяем путь для отображения (для совместимости с существующим кодом)
    const relativePath = type === "party"
      ? `/images/political-parties/${fileName}`
      : type === "person"
      ? `/images/people/${fileName}`
      : type === "parliament"
      ? `/images/parliament/${fileName}`
      : `/images/news/${fileName}`;

    console.log("POST /api/upload - Returning base64 data URL");

    // Возвращаем base64 data URL, который можно сохранить в базе данных
    return NextResponse.json({ 
      success: true, 
      path: relativePath,
      fileName: fileName,
      dataUrl: dataUrl, // base64 data URL для сохранения в БД
      base64: base64, // только base64 без префикса
      mimeType: file.type
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
