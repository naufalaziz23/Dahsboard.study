import { create } from 'zustand';
import {
  User,
  Project,
  Task,
  DocumentItem,
  FolderItem,
  CalendarEvent,
  ArchiveItem,
  NotificationItem,
} from '@/types';

interface StoreState {
  user: User;
  setUser: (user: User) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;

  // Search & Global state
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Fetch all data from MySQL
  fetchFromDatabase: () => Promise<void>;

  // Projects
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'progress' | 'completedTasks' | 'totalTasks'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;

  // Documents & Folders
  folders: FolderItem[];
  documents: DocumentItem[];
  activeDocumentId: string;
  setActiveDocumentId: (id: string) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'lastEdited' | 'wordCount' | 'charCount'>) => Promise<void>;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  addFolder: (name: string) => Promise<void>;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  toggleCalendarEvent: (id: string) => Promise<void>;
  deleteCalendarEvent: (id: string) => Promise<void>;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  selectedCalendarDate: string;
  setSelectedCalendarDate: (date: string) => void;

  // Archive
  archiveItems: ArchiveItem[];
  addArchiveItem: (item: Omit<ArchiveItem, 'id'>) => Promise<void>;
  restoreArchiveItem: (id: string) => Promise<void>;
  deleteArchiveItem: (id: string) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Dynamic calculations
  recalculateProjectProgress: (projectId: string) => void;
}

const initialUser: User = {
  id: 'usr_1',
  name: 'Intan Zahra',
  role: 'Student',
  university: 'UNY',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const useStore = create<StoreState>((set, get) => ({
  user: initialUser,
  setUser: (user) => set({ user }),
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  isLoading: false,

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchFromDatabase: async () => {
    set({ isLoading: true });
    try {
      const [
        userRes,
        projectsRes,
        tasksRes,
        docsRes,
        foldersRes,
        eventsRes,
        archiveRes,
      ] = await Promise.all([
        fetch('/api/auth/me').then((r) => r.ok ? r.json() : null),
        fetch('/api/projects').then((r) => r.ok ? r.json() : null),
        fetch('/api/tasks').then((r) => r.ok ? r.json() : null),
        fetch('/api/documents').then((r) => r.ok ? r.json() : null),
        fetch('/api/folders').then((r) => r.ok ? r.json() : null),
        fetch('/api/calendar').then((r) => r.ok ? r.json() : null),
        fetch('/api/archive').then((r) => r.ok ? r.json() : null),
      ]);

      const stateUpdates: Partial<StoreState> = {};

      if (userRes?.user) {
        stateUpdates.user = {
          id: userRes.user.id,
          name: userRes.user.name,
          role: userRes.user.role,
          university: userRes.user.university,
          avatar: userRes.user.avatar || initialUser.avatar,
        };
      }

      if (projectsRes?.projects) {
        stateUpdates.projects = projectsRes.projects.map((p: any) => ({
          ...p,
          milestones: [],
          upcomingMilestones: [],
          references: [],
          notes: [],
        }));
      }

      if (tasksRes?.tasks) {
        stateUpdates.tasks = tasksRes.tasks.map((t: any) => ({
          id: t.id,
          projectId: t.projectId,
          projectTitle: t.project?.title,
          title: t.title,
          completed: t.status === 'COMPLETED',
          dueDate: t.deadline
            ? new Date(t.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            : undefined,
          priority: t.priority === 'HIGH' ? 'High' : t.priority === 'LOW' ? 'Low' : 'Medium',
          timeSlot: t.timeSlot,
        }));
      }

      if (docsRes?.documents) {
        stateUpdates.documents = docsRes.documents;
        if (!get().activeDocumentId && docsRes.documents.length > 0) {
          stateUpdates.activeDocumentId = docsRes.documents[0].id;
        }
      }

      if (foldersRes?.folders) {
        stateUpdates.folders = foldersRes.folders;
      }

      if (eventsRes?.events) {
        stateUpdates.calendarEvents = eventsRes.events;
      }

      if (archiveRes?.items) {
        stateUpdates.archiveItems = archiveRes.items;
      }

      // Generate REAL notifications from database events and tasks (no dummy data)
      const realNotifications: NotificationItem[] = [];
      if (eventsRes?.events) {
        eventsRes.events
          .filter((ev: any) => !ev.completed)
          .slice(0, 3)
          .forEach((ev: any) => {
            realNotifications.push({
              id: `notif_ev_${ev.id}`,
              title: `Agenda: ${ev.title}`,
              message: `Jadwal agenda pada ${ev.date}${ev.time ? ' pukul ' + ev.time : ''}.`,
              time: 'Mendatang',
              read: false,
              type: 'reminder',
            });
          });
      }
      if (tasksRes?.tasks) {
        tasksRes.tasks
          .filter((t: any) => t.status !== 'COMPLETED' && t.deadline)
          .slice(0, 3)
          .forEach((t: any) => {
            realNotifications.push({
              id: `notif_task_${t.id}`,
              title: `Tenggat Waktu: ${t.title}`,
              message: `Batas pengumpulan: ${new Date(t.deadline).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })}.`,
              time: 'Tenggat',
              read: false,
              type: 'deadline',
            });
          });
      }
      stateUpdates.notifications = realNotifications;

      set({ ...stateUpdates, isLoading: false });
    } catch (err) {
      console.error('Error syncing store with MySQL:', err);
      set({ isLoading: false });
    }
  },

  projects: [],
  selectedProjectId: 'proj_skripsi',
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),

  addProject: async (newProject) => {
    try {
      const statusMap: Record<string, string> = {
        'in progress': 'IN_PROGRESS',
        'on going': 'IN_PROGRESS',
        'planning': 'PLANNING',
        'completed': 'COMPLETED',
        'on hold': 'ON_HOLD',
      };
      const cleanStatus = statusMap[(newProject.status || '').toLowerCase()] || 'IN_PROGRESS';
      let cleanDeadline = null;
      if (newProject.deadline) {
        try {
          const d = new Date(newProject.deadline);
          if (!isNaN(d.getTime())) {
            cleanDeadline = d.toISOString();
          }
        } catch {}
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProject.title,
          subtitle: newProject.subtitle || null,
          description: newProject.description || '',
          status: cleanStatus,
          priority: 'MEDIUM',
          category: newProject.category || 'Skripsi',
          deadline: cleanDeadline,
        }),
      });
      if (res.ok) {
        await get().fetchFromDatabase();
      } else {
        const err = await res.json().catch(() => ({}));
        console.error('Error adding project:', err);
      }
    } catch (err) {
      console.error('Error adding project:', err);
    }
  },

  updateProject: async (id, updates) => {
    try {
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error updating project:', err);
    }
  },

  deleteProject: async (id) => {
    try {
      set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  },

  tasks: [],
  addTask: async (newTask) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          projectId: newTask.projectId,
          priority: (newTask.priority?.toUpperCase() as any) || 'MEDIUM',
          deadline: newTask.dueDate,
          timeSlot: newTask.timeSlot,
        }),
      });
      if (res.ok) {
        await get().fetchFromDatabase();
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  },

  toggleTask: async (id) => {
    try {
      const target = get().tasks.find((t) => t.id === id);
      if (!target) return;
      const nextState = !target.completed;

      // Optimistic update
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: nextState } : t)),
      }));

      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextState }),
      });

      // Recalculate project progress if linked
      if (target.projectId) {
        get().recalculateProjectProgress(target.projectId);
      }
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  },

  deleteTask: async (id) => {
    try {
      const target = get().tasks.find((t) => t.id === id);
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (target?.projectId) {
        get().recalculateProjectProgress(target.projectId);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  },

  updateTask: async (id, updates) => {
    try {
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  },

  folders: [],
  documents: [],
  activeDocumentId: '',
  setActiveDocumentId: (activeDocumentId) => set({ activeDocumentId }),

  addDocument: async (newDoc) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDoc.title,
          content: newDoc.content,
          folderId: newDoc.folderId,
          projectId: newDoc.projectId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        await get().fetchFromDatabase();
        if (data.document?.id) {
          set({ activeDocumentId: data.document.id });
        }
      }
    } catch (err) {
      console.error('Error adding document:', err);
    }
  },

  updateDocument: async (id, updates) => {
    try {
      set((s) => ({
        documents: s.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      }));
      await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error updating document:', err);
    }
  },

  deleteDocument: async (id) => {
    try {
      set((s) => {
        const remaining = s.documents.filter((d) => d.id !== id);
        return {
          documents: remaining,
          activeDocumentId: remaining[0]?.id || '',
        };
      });
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  },

  addFolder: async (name) => {
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await get().fetchFromDatabase();
      }
    } catch (err) {
      console.error('Error adding folder:', err);
    }
  },

  calendarEvents: [],
  selectedCalendarDate: '2027-01-14',
  setSelectedCalendarDate: (selectedCalendarDate) => set({ selectedCalendarDate }),

  addCalendarEvent: async (event) => {
    try {
      // Map friendly category names to DB enum values
      const categoryMap: Record<string, string> = {
        bimbingan: 'CONSULTATION',
        consultation: 'CONSULTATION',
        deadline: 'DEADLINE',
        penulisan: 'WRITING',
        writing: 'WRITING',
        pengolahan: 'DATA_COLLECTION',
        data_collection: 'DATA_COLLECTION',
        kegiatan: 'ACADEMIC',
        academic: 'ACADEMIC',
        lainnya: 'OTHER',
        other: 'OTHER',
      };
      const rawCat = (event.category || '').toLowerCase();
      const dbCategory = categoryMap[rawCat] || rawCat.toUpperCase() || 'WRITING';

      // Ensure startAt is noon UTC so timezone shifts never cross a day boundary
      const startAt = event.date
        ? new Date(event.date + 'T12:00:00.000Z').toISOString()
        : new Date().toISOString();

      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          startAt,
          category: dbCategory,
          projectId: event.projectId || null,
          allDay: true,
          completed: event.completed ?? false,
        }),
      });
      if (res.ok) {
        await get().fetchFromDatabase();
      } else {
        const err = await res.json().catch(() => ({}));
        console.error('Error adding calendar event:', err);
      }
    } catch (err) {
      console.error('Error adding calendar event:', err);
    }
  },

  toggleCalendarEvent: async (id) => {
    try {
      const target = get().calendarEvents.find((e) => e.id === id);
      if (!target) return;
      const nextState = !target.completed;
      set((s) => ({
        calendarEvents: s.calendarEvents.map((e) =>
          e.id === id ? { ...e, completed: nextState } : e
        ),
      }));
      await fetch(`/api/calendar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextState }),
      });
    } catch (err) {
      console.error('Error toggling calendar event:', err);
    }
  },

  deleteCalendarEvent: async (id) => {
    try {
      set((s) => ({
        calendarEvents: s.calendarEvents.filter((e) => e.id !== id),
      }));
      await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
      await get().fetchFromDatabase();
    } catch (err) {
      console.error('Error deleting calendar event:', err);
    }
  },

  updateCalendarEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      set((s) => ({
        calendarEvents: s.calendarEvents.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      }));

      const categoryMap: Record<string, string> = {
        bimbingan: 'CONSULTATION',
        consultation: 'CONSULTATION',
        deadline: 'DEADLINE',
        penulisan: 'WRITING',
        writing: 'WRITING',
        pengolahan: 'DATA_COLLECTION',
        data_collection: 'DATA_COLLECTION',
        kegiatan: 'ACADEMIC',
        academic: 'ACADEMIC',
        lainnya: 'OTHER',
        other: 'OTHER',
      };

      const payload: Record<string, any> = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.completed !== undefined) payload.completed = updates.completed;
      if (updates.date) {
        payload.startAt = new Date(updates.date + 'T12:00:00.000Z').toISOString();
      }
      if (updates.category) {
        const rawCat = updates.category.toLowerCase();
        payload.category = categoryMap[rawCat] || rawCat.toUpperCase();
      }

      await fetch(`/api/calendar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await get().fetchFromDatabase();
    } catch (err) {
      console.error('Error updating calendar event:', err);
    }
  },

  archiveItems: [],
  addArchiveItem: async (item) => {
    try {
      const res = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await get().fetchFromDatabase();
      }
    } catch (err) {
      console.error('Error adding archive item:', err);
    }
  },

  restoreArchiveItem: async (id) => {
    try {
      set((s) => ({
        archiveItems: s.archiveItems.filter((it) => it.id !== id),
      }));
      await fetch(`/api/archive/${id}`, { method: 'POST' });
      await get().fetchFromDatabase();
    } catch (err) {
      console.error('Error restoring archive item:', err);
    }
  },

  deleteArchiveItem: async (id) => {
    try {
      set((s) => ({
        archiveItems: s.archiveItems.filter((it) => it.id !== id),
      }));
      await fetch(`/api/archive/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting archive item:', err);
    }
  },

  notifications: [],

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearNotifications: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  recalculateProjectProgress: (projectId) => {
    set((s) => {
      const projectTasks = s.tasks.filter((t) => t.projectId === projectId);
      const total = projectTasks.length;
      const completed = projectTasks.filter((t) => t.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        projects: s.projects.map((p) =>
          p.id === projectId
            ? { ...p, totalTasks: total, completedTasks: completed, progress }
            : p
        ),
      };
    });
  },
}));
