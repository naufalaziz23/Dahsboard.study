import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { AutosaveDocumentSchema } from '@/lib/validations';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const document = await prisma.document.findFirst({
      where: { id, userId: user.id },
      include: {
        folder: true,
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Get document detail error:', error);
    return NextResponse.json({ error: 'Gagal mengambil isi dokumen' }, { status: 500 });
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

    const existing = await prisma.document.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    const parsed = AutosaveDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Data autosave tidak valid', details: parsed.error.format() }, { status: 400 });
    }

    const { title, content, wordCount, characterCount, folderId, projectId } = parsed.data;

    // Concurrency control: if updated with newer content
    const updated = await prisma.document.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        content: content !== undefined ? content : existing.content,
        wordCount: wordCount !== undefined ? wordCount : existing.wordCount,
        characterCount: characterCount !== undefined ? characterCount : existing.characterCount,
        folderId: folderId !== undefined ? folderId : existing.folderId,
        projectId: projectId !== undefined ? projectId : existing.projectId,
        lastEditedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      lastSaved: updated.lastEditedAt,
      document: updated,
    });
  } catch (error) {
    console.error('Update/Autosave document error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan dokumen' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const existing = await prisma.document.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    const url = new URL(req.url);
    const permanent = url.searchParams.get('permanent') === 'true';

    if (permanent) {
      await prisma.document.delete({ where: { id } });
    } else {
      // Soft-archive document
      await prisma.$transaction([
        prisma.document.update({
          where: { id },
          data: { isArchived: true },
        }),
        prisma.archivedItem.create({
          data: {
            userId: user.id,
            itemType: 'DOCUMENT',
            originalId: id,
            title: existing.title,
            metadata: {
              category: 'Writing',
              fileType: 'DOCX',
              dateLabel: `Archived • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`,
            },
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: 'Gagal menghapus dokumen' }, { status: 500 });
  }
}

