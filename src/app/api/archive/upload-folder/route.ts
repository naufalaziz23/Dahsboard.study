import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const formData = await req.formData();
    const folderNameParam = (formData.get('folderName') as string) || '';
    const category = (formData.get('category') as string) || 'Writing';
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Tidak ada file dalam folder yang dipilih' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Determine folder title from param or from the first file path
    let folderTitle = folderNameParam.trim();
    if (!folderTitle) {
      const firstPath = (files[0] as any).webkitRelativePath || files[0].name;
      folderTitle = firstPath.includes('/') ? firstPath.split('/')[0] : 'Folder Arsip Baru';
    }

    const savedFilesInfo: Array<{
      id: string;
      originalName: string;
      fileSize: number;
      mimeType: string;
    }> = [];

    // Save each file and record attachment in MySQL
    for (const file of files) {
      // Skip empty directory pointers if any
      if (file.size === 0 && file.name.startsWith('.')) continue;

      const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, safeFileName);

      const bytes = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));

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

      savedFilesInfo.push({
        id: attachment.id,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
    }

    const fileCount = savedFilesInfo.length;
    const dateFormatted = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const dateLabel = `${fileCount} files • Updated ${dateFormatted}`;

    // Create the ArchivedItem with itemType 'FOLDER'
    const archivedFolder = await prisma.archivedItem.create({
      data: {
        userId: user.id,
        title: folderTitle,
        itemType: 'FOLDER',
        metadata: {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          isFolder: true,
          fileCount,
          files: savedFilesInfo,
          dateLabel,
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        id: archivedFolder.id,
        title: archivedFolder.title,
        fileType: 'FOLDER',
        category: category.charAt(0).toUpperCase() + category.slice(1),
        dateLabel,
        fileCount,
        files: savedFilesInfo,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Upload archive folder error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah folder ke arsip' }, { status: 500 });
  }
}
