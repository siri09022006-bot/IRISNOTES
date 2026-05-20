import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.dueDate) body.dueDate = new Date(body.dueDate);

    const task = await prisma.task.update({
      where: { id },
      data: body,
    });

    let noteCompleted = false;

    // Check if we need to complete the parent note
    if (task.noteId && body.completed !== undefined) {
      const allTasks = await prisma.task.findMany({ where: { noteId: task.noteId } });
      const allDone = allTasks.length > 0 && allTasks.every(t => t.completed);
      if (allDone) {
        await prisma.note.update({
          where: { id: task.noteId },
          data: { section: "completed" },
        });
        noteCompleted = true;
      } else if (body.completed === false) {
        // If a task is un-ticked, maybe move it back to active? Let's assume active by default
        await prisma.note.update({
          where: { id: task.noteId },
          data: { section: "active" },
        });
      }
    }

    return NextResponse.json({ task, noteCompleted });
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
