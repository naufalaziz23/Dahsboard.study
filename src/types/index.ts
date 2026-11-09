export type ProjectStatus = 'In Progress' | 'On Going' | 'On Hold' | 'Completed' | 'Planning';

export interface User {
  id: string;
  name: string;
  role: string;
  university: string;
  avatar: string;
}

export interface Task {
  id: string;
  projectId?: string;
  projectTitle?: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  completedDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
  category?: string;
  timeSlot?: string;
}

export interface ProjectTimelineMilestone {
  id: string;
  title: string;
  status: 'Selesai' | 'Dalam proses' | 'Belum dimulai';
  targetDate?: string;
}

export interface ProjectReference {
  id: string;
  title: string;
  authors: string;
  year: string;
  url?: string;
  notes?: string;
}

export interface ProjectNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  status: ProjectStatus;
  deadline: string;
  daysLeft?: number;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  category: string;
  milestones: ProjectTimelineMilestone[];
  upcomingMilestones: { title: string; date: string }[];
  references: ProjectReference[];
  notes: ProjectNote[];
  documentCount?: number;
}

export interface DocumentItem {
  id: string;
  folderId: string;
  projectId?: string;
  title: string;
  content: string;
  wordCount: number;
  charCount: number;
  lastEdited: string;
  progress: number; // e.g. 75%
  isArchived?: boolean;
  folderName?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  count: number;
}

export type CalendarEventCategory =
  | 'bimbingan'
  | 'deadline'
  | 'penulisan'
  | 'pengolahan'
  | 'kegiatan'
  | 'lainnya';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category: CalendarEventCategory;
  completed?: boolean;
  projectId?: string;
  taskId?: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  fileType: 'PDF' | 'DOCX' | 'FOLDER';
  category: 'Writing' | 'Projects' | 'Completed';
  dateLabel: string; // e.g., "Completed • 15 Des 2026" or "Archived • 12 Okt 2026"
  fileSize?: string;
  filesCount?: number;
  rawDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'deadline' | 'achievement' | 'reminder';
}
