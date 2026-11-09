import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { TaskStatus, CalendarCategory } from '@prisma/client';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
    }

    const newStatus = body.status as TaskStatus | undefined;
    const isCompleted = newStatus === 'COMPLETED' || (body.completed === true);
    const resolvedStatus: TaskStatus | undefined =
      body.completed !== undefined
        ? (body.completed ? 'COMPLETED' : 'TODO')
        : newStatus;

    const completedAt =
      resolvedStatus === 'COMPLETED' ? new Date() : resolvedStatus ? null : undefined;

    const deadlineDate = body.deadline !== undefined
      ? (body.deadline ? new Date(body.deadline) : null)
      : undefined;

    // Use transaction to update task and synchronize corresponding calendar event
    const updated = await prisma.$transaction(async (tx) => {
      const task = await tx.task.update({
        where: { id },
        data: {
          title: body.title !== undefined ? body.title : undefined,
          description: body.description !== undefined ? body.description : undefined,
          status: resolvedStatus,
          priority: body.priority !== undefined ? body.priority : undefined,
          deadline: deadlineDate,
          timeSlot: body.timeSlot !== undefined ? body.timeSlot : undefined,
          completedAt,
          position: body.position !== undefined ? body.position : undefined,
        },
      });

      // Synchronize associated calendar event
      if (deadlineDate !== undefined || resolvedStatus !== undefined || body.title !== undefined) {
        const calEvent = await tx.calendarEvent.findFirst({
          where: { taskId: id },
        });

        const targetDeadline = deadlineDate !== undefined ? deadlineDate : task.deadline;
        const taskCompleted = resolvedStatus === 'COMPLETED';

        if (targetDeadline) {
          if (calEvent) {
            await tx.calendarEvent.update({
              where: { id: calEvent.id },
              data: {
                title: task.title,
                startAt: targetDeadline,
                completed: taskCompleted,
              },
            });
          } else {
            await tx.calendarEvent.create({
              data: {
                userId: user.id,
                projectId: task.projectId,
                taskId: task.id,
                title: task.title,
                category: CalendarCategory.DEADLINE,
                startAt: targetDeadline,
                completed: taskCompleted,
              },
            });
          }
        } else if (calEvent) {
          // Deadline removed, remove synchronized calendar event
          await tx.calendarEvent.delete({ where: { id: calEvent.id } });
        }
      }

      return task;
    });

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui tugas' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const existing = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
    }

    // Delete task and attached calendar events safely in transaction
    await prisma.$transaction([
      prisma.calendarEvent.deleteMany({ where: { taskId: id } }),
      prisma.task.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Gagal menghapus tugas' }, { status: 500 });
  }
}

