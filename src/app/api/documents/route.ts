import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { DocumentSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const folderId = url.searchParams.get('folderId');
    const projectId = url.searchParams.get('projectId');

    const where: any = {
      userId: user.id,
      isArchived: false,
    };
    if (folderId) where.folderId = folderId;
    if (projectId) where.projectId = projectId;

    const documents = await prisma.document.findMany({
      where,
      select: {
        id: true,
        title: true,
        folderId: true,
        projectId: true,
        wordCount: true,
        characterCount: true,
        lastEditedAt: true,
        createdAt: true,
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { lastEditedAt: 'desc' },
    });

    const formattedDocs = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      folderId: doc.folderId || 'f_all',
      folderName: doc.folder?.name || 'Uncategorized',
      projectId: doc.projectId,
      wordCount: doc.wordCount,
      charCount: doc.characterCount,
      lastEdited: new Date(doc.lastEditedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      rawLastEdited: doc.lastEditedAt,
      progress: Math.min(100, Math.round((doc.wordCount / 2000) * 100)),
    }));

    return NextResponse.json({ documents: formattedDocs });
  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json({ error: 'Gagal mengambil daftar dokumen' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = DocumentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data dokumen tidak valid', details: parsed.error.format() }, { status: 400 });
    }

    const { title, content, folderId, projectId, wordCount, characterCount } = parsed.data;

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        title: title || 'Dokumen Baru Tanpa Judul',
        content: content || '<p></p>',
        folderId: folderId || null,
        projectId: projectId || null,
        wordCount: wordCount || 0,
        characterCount: characterCount || 0,
        lastEditedAt: new Date(),
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json({ error: 'Gagal membuat dokumen' }, { status: 500 });
  }
}

