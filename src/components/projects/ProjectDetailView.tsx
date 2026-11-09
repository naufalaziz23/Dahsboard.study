'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Check,
  CalendarDays,
  FileText,
  Trash2,
  Edit3,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Tag,
  Flag,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PlantOnBooksIllustration, CatOnBooksIllustration } from '@/components/shared/BotanicalAssets';
import { useRouter } from 'next/navigation';

export default function ProjectDetailView() {
  const router = useRouter();
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    tasks,
    toggleTask,
    addTask,
    deleteTask,
    documents,
    addDocument,
    deleteDocument,
    setActiveDocumentId,
    updateProject,
    deleteProject,
  } = useStore();

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [activeTab, setActiveTab] = useState<'tasks' | 'documents'>('tasks');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editStatus, setEditStatus] = useState<'In Progress' | 'Planning' | 'Completed' | 'On Hold'>('In Progress');

  // Task creation modal
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Document creation modal
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');

  const projectTasks = tasks.filter((t) => t.projectId === currentProject?.id);
  const projectDocuments = documents.filter(
    (d) => d.projectId === currentProject?.id || (!d.projectId && currentProject?.id === projects[0]?.id)
  );

  const completedTasksCount = projectTasks.filter((t) => t.completed).length;
  const totalTasksCount = projectTasks.length;
  const currentProgress =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const handleOpenEditModal = () => {
    if (!currentProject) return;
    setEditTitle(currentProject.title);
    setEditCategory(currentProject.category || 'Skripsi');
    setEditDescription(currentProject.description || '');
    let initialDeadline = '';
    if (currentProject.deadline) {
      try {
        const d = new Date(currentProject.deadline);
        if (!isNaN(d.getTime())) {
          initialDeadline = d.toISOString().split('T')[0];
        }
      } catch {}
    }
    setEditDeadline(initialDeadline);
    setEditStatus((currentProject.status as any) || 'In Progress');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !editTitle.trim()) return;

    await updateProject(currentProject.id, {
      title: editTitle.trim(),
      category: editCategory.trim() || 'Umum',
      description: editDescription.trim(),
      deadline: editDeadline ? new Date(editDeadline + 'T12:00:00.000Z').toISOString() : undefined,
      status: editStatus as any,
    });

    setIsEditModalOpen(false);
  };

  const handleDeleteCurrentProject = async () => {
    if (!currentProject) return;
    await deleteProject(currentProject.id);
    setIsConfirmDeleteOpen(false);
    if (projects.length > 1) {
      const remaining = projects.filter((p) => p.id !== currentProject.id);
      setSelectedProjectId(remaining[0]?.id || '');
    }
  };

  const handleCreateNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentProject) return;

    await addTask({
      projectId: currentProject.id,
      projectTitle: currentProject.title,
      title: newTaskTitle.trim(),
      completed: false,
      dueDate: newTaskDeadline || undefined,
      priority: newTaskPriority,
    });

    setNewTaskTitle('');
    setNewTaskDeadline('');
    setNewTaskPriority('Medium');
    setIsAddTaskModalOpen(false);
  };

  const handleCreateNewDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !currentProject) return;

    await addDocument({
      title: newDocTitle.trim(),
      content: `<p>Dokumen untuk proyek <strong>${currentProject.title}</strong>.</p>`,
      projectId: currentProject.id,
      folderId: 'f1',
      progress: 0,
    });

    setNewDocTitle('');
    setIsAddDocModalOpen(false);
  };

  const handleOpenDocInEditor = (docId: string) => {
    setActiveDocumentId(docId);
    router.push('/writing');
  };

  if (!currentProject) {
    return (
      <div className="flex-1 bg-white rounded-3xl border border-dashed border-[#E9E5DE] p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
        <div className="w-14 h-14 rounded-2xl bg-[#E8EFE9] border border-[#BCDAC8] flex items-center justify-center text-[#315D47] mb-3 shadow-xs">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#202923]">
          Belum Ada Proyek Terpilih
        </h3>
        <p className="text-xs text-[#77776F] mt-1.5 max-w-sm">
          Pilih proyek di daftar sebelah kiri atau buat proyek baru untuk mengelola tugas dan naskah riset Anda.
        </p>
      </div>
    );
  }

  const upcomingDeadlines = projectTasks
    .filter((t) => !t.completed && t.dueDate)
    .slice(0, 3);

  return (
    <div className="flex-1 bg-[#FFFFFF] rounded-3xl border border-[#E9E5DE] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden space-y-6">
      {/* 1. Project Header with Gradient & Botanical Accents */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EDE6DC]/90 via-[#E5DACB]/60 to-[#FAF8F5] border-b border-[#E0D8CB] p-6 pb-5">
        {/* Botanical leaf watermarks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute top-0 right-0 w-44 h-44 opacity-10" viewBox="0 0 160 160" fill="#315D47">
            <path d="M160 0 C 100 50, 110 130, 50 160 C 120 130, 170 60, 160 0 Z" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-32 h-12 opacity-15" viewBox="0 0 128 50" fill="none">
            <path d="M0 50 C 40 20, 80 40, 128 15 L 128 50 Z" fill="#8DAA96" />
          </svg>
        </div>

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#315D47] to-[#8DAA96] flex items-center justify-center text-white shrink-0 shadow-md ring-2 ring-white/60">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-2xl lg:text-[26px] font-bold text-[#202923] truncate">
                  {currentProject.title}
                </h2>
                <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 text-[#315D47] border border-[#B7D7BC] shadow-2xs backdrop-blur-xs">
                  {currentProject.category || 'Akademik'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DCE7DC] text-[#315D47] border border-[#BCDAC8]">
                  {currentProject.status || 'In Progress'}
                </span>
              </div>
              <p className="text-[13px] text-[#77776F] mt-1.5 max-w-2xl leading-relaxed">
                {currentProject.description || 'Proyek akademik terstruktur.'}
              </p>
            </div>
          </div>

          {/* Action Buttons: Edit & Delete */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 border border-[#D5CBBE] text-xs font-semibold text-[#1E2B22] hover:bg-white hover:border-[#315D47] transition-all backdrop-blur-xs shadow-2xs cursor-pointer hover:shadow-xs"
              title="Edit Proyek"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#315D47]" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="p-1.5 rounded-xl bg-white/80 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all shadow-2xs cursor-pointer"
              title="Hapus Proyek"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* 2. Project Progress Banner with Plant Illustration */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-[#F4EFEA] to-[#EFEAE2] border border-[#E5DFD5] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Donut Chart */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#E2DDD5"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#315D47"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - currentProgress / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute font-mono text-[17px] font-bold text-[#202923]">
                {currentProgress}%
              </span>
            </div>

            {/* Stats summary chips */}
            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center gap-2 text-[#315D47] font-semibold">
                <div className="w-5 h-5 rounded-md bg-[#E8EFE9] flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#315D47]" />
                </div>
                <span>{completedTasksCount} tugas selesai</span>
              </div>
              <div className="flex items-center gap-2 text-[#77776F]">
                <div className="w-5 h-5 rounded-md bg-white border border-[#E0D8CC] flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-[#8DAA96]" />
                </div>
                <span>{Math.max(0, totalTasksCount - completedTasksCount)} tugas tersisa</span>
              </div>
              <div className="flex items-center gap-2 text-[#55554E]">
                <div className="w-5 h-5 rounded-md bg-white border border-[#E0D8CC] flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-[#C8A27C]" />
                </div>
                <span>Tenggat: <strong className="font-medium text-[#202923]">{currentProject.deadline || 'Tanpa deadline'}</strong></span>
              </div>
            </div>
          </div>

          {/* Plant on Books Graphic with soft aura */}
          <div className="hidden sm:block relative">
            <div className="absolute inset-0 bg-[#8DAA96]/15 rounded-full blur-xl pointer-events-none" />
            <PlantOnBooksIllustration className="w-44 h-28 relative z-10" />
          </div>
        </div>

        {/* 3. Tabs Navigation & Actions */}
        <div className="flex items-center justify-between border-b border-[#E9E5DE] pb-2 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'tasks', label: 'Tugas Proyek', count: projectTasks.length, icon: CheckCircle2 },
              { id: 'documents', label: 'Dokumen Terkait', count: projectDocuments.length, icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#315D47] text-[#FFFFFF] shadow-xs'
                      : 'text-[#77776F] hover:text-[#202923] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/25 text-white' : 'bg-[#FAF8F5] text-[#77776F] border border-[#E9E5DE]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTab === 'tasks' ? (
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E2B22] text-white text-xs font-semibold hover:bg-[#315D47] transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span>+ Tambah Tugas</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddDocModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E2B22] text-white text-xs font-semibold hover:bg-[#315D47] transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span>+ Buat Dokumen Baru</span>
            </button>
          )}
        </div>

        {/* 4. Tab Contents & Side Roadmap Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Real Task or Document List */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'tasks' ? (
              <div>
                <div className="flex items-center justify-between mb-3 text-[13px]">
                  <h4 className="font-bold text-[#202923] flex items-center gap-2">
                    <span>Daftar Tugas Proyek</span>
                    <span className="text-[11px] font-normal text-[#77776F]">
                      ({completedTasksCount}/{totalTasksCount} selesai)
                    </span>
                  </h4>
                </div>

                {projectTasks.length > 0 ? (
                  <div className="space-y-2.5">
                    {projectTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all group ${
                          task.completed
                            ? 'bg-[#FAF8F5] border-[#E9E5DE]'
                            : 'bg-[#FFFFFF] border-[#E5DFD5] hover:border-[#8DAA96] hover:shadow-xs'
                        }`}
                      >
                        <div
                          onClick={() => toggleTask(task.id)}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none"
                        >
                          <button
                            type="button"
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                              task.completed
                                ? 'bg-[#315D47] text-[#FFFFFF]'
                                : 'border-2 border-[#D8D4CC] group-hover:border-[#315D47]'
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <div className="min-w-0">
                            <span
                              className={`text-[13px] block truncate ${
                                task.completed
                                  ? 'line-through text-[#77776F]'
                                  : 'text-[#202923] font-medium group-hover:text-[#315D47] transition-colors'
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.dueDate && (
                              <span className="text-[11px] text-[#77776F] flex items-center gap-1 mt-0.5">
                                <CalendarDays className="w-3 h-3 text-[#8DAA96]" />
                                <span>Tenggat: {task.dueDate}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {task.priority && (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                task.priority === 'High'
                                  ? 'bg-[#FBE8E5] text-[#E05A47] border-[#F2BDB6]'
                                  : task.priority === 'Low'
                                  ? 'bg-[#E8EFE9] text-[#315D47] border-[#BCDAC8]'
                                  : 'bg-[#FAF3E8] text-[#C8A27C] border-[#EBD9BC]'
                              }`}
                            >
                              {task.priority}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="p-1 rounded-lg text-[#A0988C] hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Hapus Tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 px-6 rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#F5F1E8] border border-dashed border-[#DCD5CA] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2DBD0] shadow-2xs flex items-center justify-center text-[#315D47] mb-2.5">
                      <span className="text-xl">🌱</span>
                    </div>
                    <h5 className="font-serif text-[15px] font-bold text-[#202923]">
                      Belum Ada Tugas untuk Proyek Ini
                    </h5>
                    <p className="text-xs text-[#77776F] mt-1 max-w-sm">
                      Pecah pengerjaan proyek menjadi langkah-langkah kecil terukur agar lebih mudah diselesaikan.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddTaskModalOpen(true)}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E2B22] text-white text-xs font-semibold hover:bg-[#315D47] transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8DAA96]" />
                      <span>+ Tambah Tugas Pertama</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Documents Tab */
              <div>
                <div className="flex items-center justify-between mb-3 text-[13px]">
                  <h4 className="font-bold text-[#202923] flex items-center gap-2">
                    <span>Dokumen &amp; Bab Terkait</span>
                    <span className="text-[11px] font-normal text-[#77776F]">
                      ({projectDocuments.length} berkas)
                    </span>
                  </h4>
                </div>

                {projectDocuments.length > 0 ? (
                  <div className="space-y-2.5">
                    {projectDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5DFD5] bg-white hover:border-[#8DAA96] hover:shadow-xs transition-all group"
                      >
                        <div
                          onClick={() => handleOpenDocInEditor(doc.id)}
                          className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] flex items-center justify-center text-[#315D47] shrink-0 group-hover:scale-105 transition-transform">
                            <FileText className="w-5 h-5 text-[#8DAA96]" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-[13.5px] font-bold text-[#202923] truncate group-hover:text-[#315D47] transition-colors">
                              {doc.title || 'Dokumen Tanpa Judul'}
                            </h5>
                            <p className="text-[11px] text-[#77776F] mt-0.5 truncate">
                              {doc.lastEdited || 'Baru saja'} • {doc.wordCount || 0} kata
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <button
                            type="button"
                            onClick={() => handleOpenDocInEditor(doc.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E9E5DE] text-xs font-semibold text-[#202923] hover:bg-[#315D47] hover:text-white hover:border-[#315D47] transition-all cursor-pointer"
                          >
                            <span>Buka Editor</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDocument(doc.id)}
                            className="p-1 rounded-lg text-[#A0988C] hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 px-6 rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#F5F1E8] border border-dashed border-[#DCD5CA] flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2DBD0] shadow-2xs flex items-center justify-center text-[#315D47] mb-2.5">
                      <FileText className="w-6 h-6 text-[#8DAA96]" />
                    </div>
                    <h5 className="font-serif text-[15px] font-bold text-[#202923]">
                      Belum Ada Dokumen untuk Proyek Ini
                    </h5>
                    <p className="text-xs text-[#77776F] mt-1 max-w-sm">
                      Mulai tulis draf bab pertama atau catatan bimbingan yang terhubung langsung dengan proyek ini.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddDocModalOpen(true)}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E2B22] text-white text-xs font-semibold hover:bg-[#315D47] transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8DAA96]" />
                      <span>+ Tulis Dokumen Pertama</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right 1 Col: Dynamic Roadmap Timeline & Upcoming Milestones */}
          <div className="space-y-4">
            {/* Dynamic Project Timeline tailored directly to Project Tasks */}
            <div className="p-4.5 rounded-2xl border border-[#E9E5DE] bg-gradient-to-b from-white to-[#FAF8F5] shadow-xs">
              <div className="flex items-center justify-between mb-3.5 border-b border-[#ECE7DF] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-[#202923]">Tahapan Proyek</h5>
                    <span className="text-[10px] text-[#77776F] font-mono block -mt-0.5">
                      {projectTasks.length > 0
                        ? `${completedTasksCount} dari ${totalTasksCount} selesai`
                        : 'Belum ada tahapan'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8EFE9] text-[#315D47] border border-[#BCDAC8]">
                  {projectTasks.length > 0 ? `${currentProgress}% Selesai` : 'Tugas Proyek'}
                </span>
              </div>

              {projectTasks.length > 0 ? (
                <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-[#E9E5DE]">
                  {projectTasks.map((task, idx) => {
                    const isDone = task.completed;

                    return (
                      <div key={task.id} className="flex items-start gap-3 relative z-10 group">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all cursor-pointer ${
                            isDone
                              ? 'bg-[#315D47] text-white shadow-2xs hover:bg-[#274B39]'
                              : 'bg-white border-2 border-[#D8D4CC] text-[#77776F] group-hover:border-[#315D47] hover:bg-[#E8EFE9]'
                          }`}
                          title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
                        >
                          {isDone ? '✓' : idx + 1}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              onClick={() => toggleTask(task.id)}
                              className={`text-[12px] font-bold leading-snug truncate cursor-pointer transition-colors ${
                                isDone
                                  ? 'line-through text-[#77776F]'
                                  : 'text-[#202923] group-hover:text-[#315D47]'
                              }`}
                            >
                              {task.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleTask(task.id)}
                              className={`text-[9px] px-1.5 py-0.2 rounded-md font-semibold cursor-pointer transition-colors shrink-0 ml-1 ${
                                isDone
                                  ? 'bg-[#E8EFE9] text-[#315D47] border border-[#BCDAC8]'
                                  : 'bg-[#FAF3E8] text-[#C8A27C] border border-[#EBD9BC] hover:bg-[#F5EAD8]'
                              }`}
                              title="Klik untuk mengubah status"
                            >
                              {isDone ? 'Selesai' : 'Belum selesai'}
                            </button>
                          </div>

                          {(task.dueDate || task.priority) && (
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#77776F]">
                              {task.dueDate && (
                                <span className="flex items-center gap-1 font-mono">
                                  <CalendarDays className="w-3 h-3 text-[#8DAA96]" />
                                  <span>{task.dueDate}</span>
                                </span>
                              )}
                              {task.priority && (
                                <span
                                  className={`font-semibold ${
                                    task.priority === 'High'
                                      ? 'text-[#E05A47]'
                                      : task.priority === 'Low'
                                      ? 'text-[#315D47]'
                                      : 'text-[#C8A27C]'
                                  }`}
                                >
                                  • {task.priority}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-1 pl-8">
                    <button
                      type="button"
                      onClick={() => setIsAddTaskModalOpen(true)}
                      className="text-[11px] font-semibold text-[#315D47] hover:text-[#274B39] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>+ Tambah Tahapan</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 px-3 text-center rounded-xl bg-white/70 border border-dashed border-[#DCD6CA]">
                  <div className="w-8 h-8 rounded-full bg-[#E8EFE9] text-[#315D47] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-[12px] font-semibold text-[#202923]">Belum ada tahapan proyek</p>
                  <p className="text-[10.5px] text-[#77776F] mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Tahapan proyek otomatis tersinkron dengan daftar tugas proyek.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#315D47] text-white hover:bg-[#274B39] transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>+ Tambah Tugas / Tahap Pertama</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming Milestones */}
            <div className="p-4.5 rounded-2xl border border-[#E9E5DE] bg-gradient-to-br from-[#FAF8F5] to-[#F2EDE4] shadow-xs">
              <h5 className="text-[13px] font-bold text-[#202923] mb-2.5 flex items-center gap-2">
                <Flag className="w-3.5 h-3.5 text-[#E05A47]" />
                <span>Target Mendekat</span>
              </h5>

              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-2 text-[12px]">
                  {upcomingDeadlines.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-xl bg-white/90 border border-[#E5DFD5] flex items-center justify-between gap-2"
                    >
                      <span className="font-medium text-[#202923] truncate">{t.title}</span>
                      <span className="font-mono text-[10.5px] px-2 py-0.5 rounded-full bg-[#FBE8E5] text-[#E05A47] font-semibold flex-shrink-0">
                        {t.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center rounded-xl bg-white/60 border border-[#E9E5DE]">
                  <p className="text-[11.5px] text-[#77776F]">
                    {currentProject.deadline
                      ? `Target utama: ${currentProject.deadline}`
                      : 'Belum ada tenggat terdekat.'}
                  </p>
                </div>
              )}
            </div>

            {/* Cozy Cat Productivity Encouragement */}
            <div className="p-4 rounded-2xl border border-[#E9E5DE] bg-white flex items-center gap-3.5 shadow-2xs">
              <div className="shrink-0 -ml-1">
                <CatOnBooksIllustration className="w-14 h-12" />
              </div>
              <div className="min-w-0">
                <p className="font-serif italic text-[11.5px] text-[#202923] leading-snug">
                  &ldquo;Fokus selesaikan satu tugas kecil hari ini.&rdquo;
                </p>
                <span className="text-[10px] text-[#8DAA96] font-semibold mt-0.5 block">
                  StudyFlow Academic 🌿
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROJECT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DBD0] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E2B22]">
                    Edit Informasi Proyek
                  </h3>
                  <p className="text-xs text-[#77776F]">
                    Sesuaikan judul, kategori, dan tenggat waktu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full text-[#8A928B] hover:bg-[#F2EFE9] hover:text-[#1E2B22] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Judul Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs focus:outline-none focus:border-[#315D47] focus:ring-1 focus:ring-[#315D47] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs bg-white focus:outline-none focus:border-[#315D47] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs bg-white focus:outline-none focus:border-[#315D47] transition-all"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs bg-white focus:outline-none focus:border-[#315D47] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Deskripsi Proyek
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs focus:outline-none focus:border-[#315D47] transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#DCD5CA] text-[#77776F] hover:bg-[#F2EFE9] text-xs font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1E2B22] hover:bg-[#315D47] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2DBD0] space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E2B22]">
                Hapus Proyek Ini?
              </h3>
              <p className="text-xs text-[#77776F] mt-1">
                Apakah Anda yakin ingin menghapus <strong>&ldquo;{currentProject.title}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 rounded-full border border-[#DCD5CA] text-[#77776F] hover:bg-[#F2EFE9] text-xs font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteCurrentProject}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Hapus Proyek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2DBD0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#202923]">
                  Tambah Tugas Baru
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTaskModalOpen(false)}
                className="p-1.5 rounded-full text-[#8A928B] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Judul Tugas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Studi literatur Bab II, Revisi metodologi..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CA] text-xs focus:outline-none focus:border-[#315D47] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                    Prioritas
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD5CA] text-xs bg-white focus:outline-none focus:border-[#315D47]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                    Tenggat (Opsional)
                  </label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD5CA] text-xs bg-white focus:outline-none focus:border-[#315D47]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#DCD5CA] text-[#77776F] hover:bg-[#F2EFE9] text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1E2B22] hover:bg-[#315D47] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DOC MODAL */}
      {isAddDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2DBD0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                  <FileText className="w-4 h-4 text-[#315D47]" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#202923]">
                  Tulis Dokumen Baru
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDocModalOpen(false)}
                className="p-1.5 rounded-full text-[#8A928B] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDoc} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Judul Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bab I - Pendahuluan, Catatan Diskusi..."
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CA] text-xs focus:outline-none focus:border-[#315D47] transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDocModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#DCD5CA] text-[#77776F] hover:bg-[#F2EFE9] text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1E2B22] hover:bg-[#315D47] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Buat Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}