import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;
    const documentId = formData.get('documentId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Ukuran file melebihi batas 15MB' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipe file tidak didukung (hanya PDF, DOCX, TXT, Gambar)' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const attachment = await prisma.attachment.create({
      data: {
        userId: user.id,
        projectId: projectId || null,
        documentId: documentId || null,
        fileName: safeFileName,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        storagePath: filePath,
      },
    });

    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    console.error('Upload attachment error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah file' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    const documentId = url.searchParams.get('documentId');

    const where: any = { userId: user.id };
    if (projectId) where.projectId = projectId;
    if (documentId) where.documentId = documentId;

    const attachments = await prisma.attachment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ attachments });
  } catch (error) {
    console.error('Fetch attachments error:', error);
    return NextResponse.json({ error: 'Gagal mengambil lampiran' }, { status: 500 });
  }
}

