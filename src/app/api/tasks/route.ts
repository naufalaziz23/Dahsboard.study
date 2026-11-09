import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { TaskSchema } from '@/lib/validations';
import { CalendarCategory, TaskStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    const status = url.searchParams.get('status');

    const where: any = { userId: user.id };
    if (projectId) where.projectId = projectId;
    if (status) where.status = status as TaskStatus;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data tugas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = TaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data tugas tidak valid', details: parsed.error.format() }, { status: 400 });
    }

    const { projectId, title, description, status, priority, deadline, timeSlot, position } = parsed.data;

    const deadlineDate = deadline ? new Date(deadline) : null;

    // Use transaction for task and synchronized calendar event
    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          userId: user.id,
          projectId: projectId || null,
          title,
          description,
          status,
          priority,
          deadline: deadlineDate,
          timeSlot,
          position,
        },
      });

      // Synchronize to calendar if deadline exists
      if (deadlineDate) {
        await tx.calendarEvent.create({
          data: {
            userId: user.id,
            projectId: projectId || null,
            taskId: task.id,
            title,
            category: CalendarCategory.DEADLINE,
            startAt: deadlineDate,
            completed: status === 'COMPLETED',
          },
        });
      }

      return task;
    });

    return NextResponse.json({ task: result }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Gagal membuat tugas' }, { status: 500 });
  }
}

