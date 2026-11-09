import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const ProjectSchema = z.object({
  title: z.string().min(1, 'Judul proyek wajib diisi').max(255),
  subtitle: z.string().max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED']).default('IN_PROGRESS'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  category: z.string().default('Skripsi'),
  startDate: z.string().datetime().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
});

export const TaskSchema = z.object({
  projectId: z.string().optional().nullable(),
  title: z.string().min(1, 'Judul tugas wajib diisi').max(255),
  description: z.string().optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  deadline: z.string().optional().nullable(),
  timeSlot: z.string().max(100).optional().nullable(),
  position: z.number().int().default(0),
});

export const DocumentSchema = z.object({
  projectId: z.string().optional().nullable(),
  folderId: z.string().optional().nullable(),
  title: z.string().min(1, 'Judul dokumen wajib diisi').max(255),
  content: z.string().default(''),
  contentFormat: z.string().default('html_tiptap'),
  wordCount: z.number().int().default(0),
  characterCount: z.number().int().default(0),
});

export const AutosaveDocumentSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string(),
  wordCount: z.number().int().default(0),
  characterCount: z.number().int().default(0),
  projectId: z.string().optional().nullable(),
  folderId: z.string().optional().nullable(),
});

export const FolderSchema = z.object({
  name: z.string().min(1, 'Nama folder wajib diisi').max(100),
  parentId: z.string().optional().nullable(),
});

export const CalendarEventSchema = z.object({
  projectId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
  title: z.string().min(1, 'Judul event wajib diisi').max(255),
  description: z.string().optional().nullable(),
  category: z.enum(['WRITING', 'DEADLINE', 'CONSULTATION', 'ACADEMIC', 'DATA_COLLECTION', 'OTHER']).default('WRITING'),
  startAt: z.string(),
  endAt: z.string().optional().nullable(),
  allDay: z.boolean().default(false),
  completed: z.boolean().default(false),
  color: z.string().optional().nullable(),
});

export const NoteSchema = z.object({
  projectId: z.string().optional().nullable(),
  documentId: z.string().optional().nullable(),
  title: z.string().min(1, 'Judul catatan wajib diisi').max(255),
  content: z.string().min(1, 'Isi catatan tidak boleh kosong'),
});

export const ReferenceSchema = z.object({
  projectId: z.string().optional().nullable(),
  title: z.string().min(1, 'Judul referensi wajib diisi').max(255),
  author: z.string().min(1, 'Penulis wajib diisi').max(255),
  publicationYear: z.string().min(1, 'Tahun terbit wajib diisi').max(20),
  url: z.string().url('Format URL tidak valid').optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable(),
  citation: z.string().optional().nullable(),
});

export const WritingSessionSchema = z.object({
  documentId: z.string().optional().nullable(),
  startedAt: z.string(),
  endedAt: z.string(),
  durationMinutes: z.number().int().min(1),
  wordsAdded: z.number().int().default(0),
});

