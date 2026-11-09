import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.calendarEvent.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 });
    }

    const targetStart = body.startAt || body.date;
    const targetEnd = body.endAt;

    const updated = await prisma.calendarEvent.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        description: body.description !== undefined ? body.description : undefined,
        category: body.category !== undefined ? (body.category.toUpperCase() as any) : undefined,
        startAt: targetStart ? new Date(targetStart) : undefined,
        endAt: targetEnd ? new Date(targetEnd) : undefined,
        completed: body.completed !== undefined ? body.completed : undefined,
      },
    });

    return NextResponse.json({ event: updated });
  } catch (error) {
    console.error('Update calendar event error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui event kalender' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const existing = await prisma.calendarEvent.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 });
    }

    await prisma.calendarEvent.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete calendar event error:', error);
    return NextResponse.json({ error: 'Gagal menghapus event' }, { status: 500 });
  }
}

