import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const latest = searchParams.get("latest");

    if (latest === "true") {
      const limitNum = limit ? parseInt(limit) : 6;
      const news = await prisma.news.findMany({
        include: {
          category: true,
          navigationCategory: true,
        },
        orderBy: {
          date: 'desc',
        },
        take: limitNum,
      });

      const formatted = news.map((n) => ({
        id: n.id,
        title: n.title,
        image: n.image,
        date: n.date.toISOString(),
        text: n.text,
        category: n.category?.name || null,
        navigationCategory: n.navigationCategory?.name || null,
      }));

      return NextResponse.json(formatted);
    }

    const news = await prisma.news.findMany({
      include: {
        category: true,
        navigationCategory: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const formatted = news.map((n) => ({
      id: n.id,
      title: n.title,
      image: n.image,
      date: n.date.toISOString(),
      text: n.text,
      category: n.category?.name || null,
      navigationCategory: n.navigationCategory?.name || null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image, date, text, category, navigationCategory } = body;

    if (!title || !date || !text) {
      return NextResponse.json(
        { error: "Title, date and text are required" },
        { status: 400 }
      );
    }

    // Находим ID категорий по имени
    let categoryId = null;
    let navigationCategoryId = null;

    if (category) {
      const cat = await prisma.category.findFirst({
        where: { name: category, type: 'news_category' },
      });
      categoryId = cat?.id || null;
    }

    if (navigationCategory) {
      const navCat = await prisma.category.findFirst({
        where: { name: navigationCategory, type: 'news_navigation' },
      });
      navigationCategoryId = navCat?.id || null;
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        image: image || null,
        date: new Date(date),
        text,
        categoryId,
        navigationCategoryId,
      },
      include: {
        category: true,
        navigationCategory: true,
      },
    });

    return NextResponse.json({
      id: newNews.id,
      title: newNews.title,
      image: newNews.image,
      date: newNews.date.toISOString(),
      text: newNews.text,
      category: newNews.category?.name || null,
      navigationCategory: newNews.navigationCategory?.name || null,
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding news:", error);
    return NextResponse.json({ error: "Failed to add news" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, image, date, text, category, navigationCategory } = body;

    if (!id || !title || !date || !text) {
      return NextResponse.json(
        { error: "ID, title, date and text are required" },
        { status: 400 }
      );
    }

    // Находим ID категорий по имени
    let categoryId = null;
    let navigationCategoryId = null;

    if (category) {
      const cat = await prisma.category.findFirst({
        where: { name: category, type: 'news_category' },
      });
      categoryId = cat?.id || null;
    }

    if (navigationCategory) {
      const navCat = await prisma.category.findFirst({
        where: { name: navigationCategory, type: 'news_navigation' },
      });
      navigationCategoryId = navCat?.id || null;
    }

    const updated = await prisma.news.update({
      where: { id: parseInt(String(id)) },
      data: {
        title,
        image: image || null,
        date: new Date(date),
        text,
        categoryId,
        navigationCategoryId,
      },
      include: {
        category: true,
        navigationCategory: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      image: updated.image,
      date: updated.date.toISOString(),
      text: updated.text,
      category: updated.category?.name || null,
      navigationCategory: updated.navigationCategory?.name || null,
    });
  } catch (error) {
    console.error("Error updating news:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }
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

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
