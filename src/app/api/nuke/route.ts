import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.note.deleteMany({});
    return NextResponse.json({ success: true, message: "All notes deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
