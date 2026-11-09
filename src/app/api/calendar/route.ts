import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { CalendarEventSchema } from '@/lib/validations';
import { CalendarCategory } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const category = url.searchParams.get('category');

    const where: any = { userId: user.id };
    if (start && end) {
      where.startAt = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }
    if (category && category !== 'all') {
      where.category = category.toUpperCase() as CalendarCategory;
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        project: { select: { id: true, title: true } },
        task: { select: { id: true, status: true, priority: true } },
      },
      orderBy: { startAt: 'asc' },
    });

    const formattedEvents = events.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category.toLowerCase(),
      date: new Date(e.startAt).toISOString().split('T')[0],
      rawDate: e.startAt,
      time: e.startAt
        ? new Date(e.startAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : undefined,
      completed: e.completed,
      projectId: e.projectId,
      projectTitle: e.project?.title,
      taskId: e.taskId,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Fetch calendar events error:', error);
    return NextResponse.json({ error: 'Gagal mengambil agenda kalender' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = CalendarEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data event kalender tidak valid', details: parsed.error.format() }, { status: 400 });
    }

    const { projectId, taskId, title, description, category, startAt, endAt, allDay, color } = parsed.data;

    const event = await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        projectId: projectId || null,
        taskId: taskId || null,
        title,
        description,
        category,
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
        allDay,
        color,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Create calendar event error:', error);
    return NextResponse.json({ error: 'Gagal membuat agenda kalender' }, { status: 500 });
  }
}

