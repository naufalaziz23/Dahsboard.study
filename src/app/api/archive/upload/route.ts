import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'Writing';

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang dipilih' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Ukuran file melebihi batas 50MB' }, { status: 400 });
    }

    // Determine uploads directory statically scoped to avoid Next.js tracing warning
    const uploadDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let itemType: 'PDF' | 'DOCX' | 'FOLDER' | 'XLSX' | 'PPTX' = 'DOCX';
    if (ext === 'pdf') {
      itemType = 'PDF';
    } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      itemType = 'XLSX';
    } else if (ext === 'pptx' || ext === 'ppt') {
      itemType = 'PPTX';
    } else if (ext === 'zip' || ext === 'rar' || ext === 'tar') {
      itemType = 'FOLDER';
    } else {
      itemType = 'DOCX';
    }

    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Create attachment record in MySQL
    const attachment = await prisma.attachment.create({
      data: {
        userId: user.id,
        fileName: safeFileName,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
        storagePath: filePath,
      },
    });

    // Format human-readable date
    const dateFormatted = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Create archived_item record in MySQL
    const archivedItem = await prisma.archivedItem.create({
      data: {
        userId: user.id,
        title: file.name,
        itemType,
        originalId: attachment.id,
        metadata: {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          attachmentId: attachment.id,
          fileSize: file.size,
          mimeType: file.type,
          originalName: file.name,
          dateLabel: `Archived • ${dateFormatted}`,
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        id: archivedItem.id,
        title: archivedItem.title,
        fileType: itemType,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        dateLabel: `Archived • ${dateFormatted}`,
        originalId: attachment.id,
        attachmentId: attachment.id,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Upload archive file error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah berkas ke arsip' }, { status: 500 });
  }
}

