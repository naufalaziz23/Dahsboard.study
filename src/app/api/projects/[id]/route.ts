import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { ProjectSchema } from '@/lib/validations';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      include: {
        tasks: { orderBy: { position: 'asc' } },
        notes: { orderBy: { updatedAt: 'desc' } },
        references: { orderBy: { createdAt: 'desc' } },
        documents: {
          select: {
            id: true,
            title: true,
            wordCount: true,
            lastEditedAt: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({
      project: {
        ...project,
        progress,
        totalTasks,
        completedTasks,
      },
    });
  } catch (error) {
    console.error('Get project detail error:', error);
    return NextResponse.json({ error: 'Gagal mengambil detail proyek' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.project.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        subtitle: body.subtitle !== undefined ? body.subtitle : undefined,
        description: body.description !== undefined ? body.description : undefined,
        status: body.status !== undefined ? body.status : undefined,
        priority: body.priority !== undefined ? body.priority : undefined,
        category: body.category !== undefined ? body.category : undefined,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        isArchived: body.isArchived !== undefined ? body.isArchived : undefined,
      },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui proyek' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const existing = await prisma.project.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    // Soft delete or archive by default, or delete if explicit query param ?permanent=true
    const url = new URL(req.url);
    const permanent = url.searchParams.get('permanent') === 'true';

    if (permanent) {
      await prisma.project.delete({ where: { id } });
    } else {
      // Soft-archive and record in archived_items
      await prisma.$transaction([
        prisma.project.update({
          where: { id },
          data: { isArchived: true },
        }),
        prisma.archivedItem.create({
          data: {
            userId: user.id,
            itemType: 'PROJECT',
            originalId: id,
            title: existing.title,
            metadata: {
              category: existing.category,
              dateLabel: `Archived • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
            },
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Gagal menghapus proyek' }, { status: 500 });
  }
}

