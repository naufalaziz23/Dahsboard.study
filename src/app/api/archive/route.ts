import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || 'all';
    const search = url.searchParams.get('search') || '';
    const sort = url.searchParams.get('sort') || 'newest';

    const where: any = { userId: user.id };
    if (search.trim()) {
      where.title = { contains: search.trim() };
    }

    const items = await prisma.archivedItem.findMany({
      where,
      orderBy: { archivedAt: sort === 'oldest' ? 'asc' : 'desc' },
    });

    const formatted = items.map((it) => {
      const meta = (it.metadata as any) || {};
      return {
        id: it.id,
        title: it.title,
        fileType: it.itemType as 'PDF' | 'DOCX' | 'FOLDER',
        category: meta.category || (it.itemType === 'PROJECT' ? 'Projects' : 'Writing'),
        dateLabel: meta.dateLabel || `Archived • ${new Date(it.archivedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        originalId: it.originalId,
        attachmentId: meta.attachmentId || (it.itemType === 'FILE' || it.itemType === 'PDF' || it.itemType === 'DOCX' ? it.originalId : null),
        fileSize: meta.fileSize,
        fileCount: meta.fileCount || (meta.files ? meta.files.length : 0),
        files: meta.files || [],
      };
    });

    const filtered = formatted.filter((item) => {
      if (category === 'all') return true;
      if (category === 'writing') return item.category.toLowerCase() === 'writing';
      if (category === 'projects') return item.category.toLowerCase() === 'projects';
      if (category === 'completed') return item.category.toLowerCase() === 'completed';
      return true;
    });

    return NextResponse.json({ items: filtered });
  } catch (error) {
    console.error('Fetch archive error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data arsip' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const item = await prisma.archivedItem.create({
      data: {
        userId: user.id,
        title: body.title || 'Dokumen Arsip',
        itemType: body.fileType || 'DOCX',
        originalId: body.originalId || null,
        metadata: {
          category: body.category || 'Writing',
          dateLabel: `Archived • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        },
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Create archive error:', error);
    return NextResponse.json({ error: 'Gagal membuat arsip' }, { status: 500 });
  }
}

