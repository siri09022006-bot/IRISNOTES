import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const archived = searchParams.get("archived");

    const where: Record<string, unknown> = {};
    if (section) where.section = section;
    if (archived === "true") {
      where.isArchived = true;
    } else {
      where.isArchived = false;
    }

    const notes = await prisma.note.findMany({
      where,
      include: { tasks: true },
      orderBy: { updatedAt: "desc" },
    });

    const parsed = notes.map((n) => ({
      ...n,
      tags: JSON.parse(n.tags || "[]"),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const note = await prisma.note.create({
      data: {
        title: body.title || "",
        content: body.content || "",
        type: body.type || "pastel",
        color: body.color || "#FFF5F5",
        tags: JSON.stringify(body.tags || []),
        emoji: body.emoji || null,
        isPinned: body.isPinned || false,
        isFavorite: body.isFavorite || false,
        posX: body.posX ?? Math.random() * 400 + 50,
        posY: body.posY ?? Math.random() * 300 + 50,
        width: body.width || 240,
        height: body.height || 200,
        zIndex: body.zIndex || 0,
        section: body.section || "active",
        tasks: body.tasks && body.tasks.length > 0 ? {
          create: body.tasks.map((text: string) => ({ text }))
        } : undefined,
      },
      include: { tasks: true }
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
