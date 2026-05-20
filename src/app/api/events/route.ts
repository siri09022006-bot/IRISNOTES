import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: { note: true },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await prisma.event.create({
      data: {
        title: body.title || "",
        description: body.description || "",
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        color: body.color || "#E8D5F5",
        isRecurring: body.isRecurring || false,
        recurType: body.recurType || null,
        noteId: body.noteId || null,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
