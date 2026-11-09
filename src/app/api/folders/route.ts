import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { FolderSchema } from '@/lib/validations';

export async function GET() {
  try {
    const user = await requireUser();
    const folders = await prisma.folder.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            documents: {
              where: { isArchived: false },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedFolders = folders.map((f) => ({
      id: f.id,
      name: f.name,
      parentId: f.parentId,
      count: f._count.documents,
    }));

    return NextResponse.json({ folders: formattedFolders });
  } catch (error) {
    console.error('Fetch folders error:', error);
    return NextResponse.json({ error: 'Gagal mengambil folder' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = FolderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data folder tidak valid', details: parsed.error.format() }, { status: 400 });
    }

    const { name, parentId } = parsed.data;
    const folder = await prisma.folder.create({
      data: {
        userId: user.id,
        name,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error('Create folder error:', error);
    return NextResponse.json({ error: 'Gagal membuat folder' }, { status: 500 });
  }
}

