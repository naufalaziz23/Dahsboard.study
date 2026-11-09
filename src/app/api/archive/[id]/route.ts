import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { unlink } from 'fs/promises';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const existing = await prisma.archivedItem.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Item arsip tidak ditemukan' }, { status: 404 });
    }

    // If linked to an attachment, delete physical file and attachment record
    if (existing.originalId) {
      const attachment = await prisma.attachment.findFirst({
        where: { id: existing.originalId, userId: user.id },
      });
      if (attachment) {
        try {
          await unlink(attachment.storagePath);
        } catch {}
        await prisma.attachment.delete({ where: { id: attachment.id } });
      }
    }

    await prisma.archivedItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete archive error:', error);
    return NextResponse.json({ error: 'Gagal menghapus item arsip' }, { status: 500 });
  }
}

// Restore action
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const existing = await prisma.archivedItem.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Item arsip tidak ditemukan' }, { status: 404 });
    }

    // If linked to an original project or document, restore it
    await prisma.$transaction(async (tx) => {
      if (existing.originalId) {
        if (existing.itemType === 'PROJECT') {
          await tx.project.updateMany({
            where: { id: existing.originalId, userId: user.id },
            data: { isArchived: false },
          });
        } else if (existing.itemType === 'DOCUMENT') {
          await tx.document.updateMany({
            where: { id: existing.originalId, userId: user.id },
            data: { isArchived: false },
          });
        }
      }
      await tx.archivedItem.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Restore archive error:', error);
    return NextResponse.json({ error: 'Gagal memulihkan item arsip' }, { status: 500 });
  }
}

