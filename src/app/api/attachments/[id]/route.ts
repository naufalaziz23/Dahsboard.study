import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { readFile, unlink } from 'fs/promises';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const attachment = await prisma.attachment.findFirst({
      where: { id, userId: user.id },
    });

    if (!attachment) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
    }

    const fileBuffer = await readFile(attachment.storagePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': attachment.mimeType,
        'Content-Disposition': `inline; filename="${attachment.originalName}"`,
        'Content-Length': attachment.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error('Download attachment error:', error);
    return NextResponse.json({ error: 'Gagal mengunduh file' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const attachment = await prisma.attachment.findFirst({
      where: { id, userId: user.id },
    });

    if (!attachment) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
    }

    try {
      await unlink(attachment.storagePath);
    } catch {
      // file might already be removed
    }

    await prisma.attachment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete attachment error:', error);
    return NextResponse.json({ error: 'Gagal menghapus file' }, { status: 500 });
  }
}

