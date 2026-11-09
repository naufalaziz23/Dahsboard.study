import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { ProjectSchema } from '@/lib/validations';

export async function GET() {
  try {
    const user = await requireUser();
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
        isArchived: false,
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            deadline: true,
          },
        },
        _count: {
          select: {
            documents: true,
            notes: true,
            references: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProjects = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calculate days left
      let daysLeft = 0;
      if (p.deadline) {
        const diff = new Date(p.deadline).getTime() - Date.now();
        daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }

      return {
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description || '',
        status: p.status === 'IN_PROGRESS' ? 'In Progress' : p.status === 'PLANNING' ? 'Planning' : p.status === 'COMPLETED' ? 'Completed' : 'On Hold',
        rawStatus: p.status,
        priority: p.priority,
        category: p.category,
        deadline: p.deadline
          ? new Date(p.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'Tanpa deadline',
        rawDeadline: p.deadline,
        daysLeft,
        progress,
        totalTasks,
        completedTasks,
        documentCount: p._count.documents,
        noteCount: p._count.notes,
        refCount: p._count.references,
      };
    });

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data proyek' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = ProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data proyek tidak valid', details: parsed.error.format() }, { status: 400 });
    }

    const { title, subtitle, description, status, priority, category, deadline } = parsed.data;

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title,
        subtitle,
        description,
        status,
        priority,
        category,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Gagal membuat proyek baru' }, { status: 500 });
  }
}

