import { NextRequest, NextResponse } from "next/server";
import {
  getAllNews,
  addNews,
  updateNews,
  deleteNews,
  getLatestNews,
  type News,
} from "@/lib/news";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const latest = searchParams.get("latest");

    if (latest === "true") {
      const limitNum = limit ? parseInt(limit) : 6;
      const news = getLatestNews(limitNum);
      return NextResponse.json(news);
    }

    const news = getAllNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image, date, text, category } = body;

    if (!title || !date || !text) {
      return NextResponse.json(
        { error: "Title, date and text are required" },
        { status: 400 }
      );
    }

    const newNews = addNews({
      title,
      image: image || null,
      date,
      text,
      category: category || null,
    });

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add news" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, image, date, text, category } = body;

    if (!id || !title || !date || !text) {
      return NextResponse.json(
        { error: "ID, title, date and text are required" },
        { status: 400 }
      );
    }

    const updated = updateNews(id, {
      title,
      image: image || null,
      date,
      text,
      category: category || null,
    });

    if (!updated) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = deleteNews(id);
    if (!deleted) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}


