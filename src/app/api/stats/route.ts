import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalTasks, completedTasks, totalNotes, todayTasks, todayCompleted] =
      await Promise.all([
        prisma.task.count(),
        prisma.task.count({ where: { completed: true } }),
        prisma.note.count({ where: { isArchived: false } }),
        prisma.task.count({
          where: { createdAt: { gte: today, lt: tomorrow } },
        }),
        prisma.task.count({
          where: {
            completed: true,
            updatedAt: { gte: today, lt: tomorrow },
          },
        }),
      ]);

    return NextResponse.json({
      totalTasks,
      completedTasks,
      totalNotes,
      todayTasks,
      todayCompleted,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
