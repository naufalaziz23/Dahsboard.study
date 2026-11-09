'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Calendar,
  MoreHorizontal,
  Plus,
  Check,
  CalendarDays,
  FileText,
  Bookmark,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PlantOnBooksIllustration } from '@/components/shared/BotanicalAssets';

export default function ProjectDetailView() {
  const {
    projects,
    selectedProjectId,
    tasks,
    toggleTask,
    addTask,
    updateProject,
  } = useStore();

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [activeTab, setActiveTab] = useState<'tasks' | 'documents' | 'notes' | 'references'>('tasks');
  const projectTasks = tasks.filter((t) => t.projectId === currentProject?.id);

  const handleAddTask = () => {
    const title = window.prompt('Judul Tugas Baru:');
    if (title && currentProject) {
      const date = window.prompt('Target Deadline (contoh: 20 Nov):', '20 Nov');
      addTask({
        projectId: currentProject.id,
        projectTitle: currentProject.title,
        title,
        completed: false,
        dueDate: date || undefined,
        priority: 'Medium',
      });
    }
  };

  if (!currentProject) {
    return (
      <div className="flex-1 bg-white rounded-2xl border border-dashed border-[#E9E5DE] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#8DAA96] mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-medium text-[#1E2B22]">
          Detail Proyek
        </h3>
        <p className="text-xs text-[#77776F] mt-1 max-w-sm">
          Pilih proyek di panel kiri atau buat proyek baru untuk mengelola tugas, catatan bimbingan, dan referensi sitasi.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
      {/* 1. Project Header & Info */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E9E5DE]/80">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] flex items-center justify-center text-[#315D47] flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#202923]">
              {currentProject.title}
            </h2>
            <p className="text-[13px] text-[#77776F] mt-0.5 max-w-xl leading-relaxed">
              {currentProject.description}
            </p>
          </div>
        </div>

        <button
          title="Project Options"
          className="p-1.5 rounded-lg hover:bg-[#F0EEE8] text-[#77776F]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Project Progress Banner with Plant Illustration */}
      <div className="relative overflow-hidden rounded-2xl bg-[#FAF8F5] border border-[#E9E5DE] p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="#E5E0D8"
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
                strokeDashoffset={
                  2 * Math.PI * 32 * (1 - (currentProject.progress || 0) / 100)
                }
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute font-mono text-base font-bold text-[#202923]">
              {currentProject.progress}%
            </span>
          </div>

          {/* Stats summary */}
          <div className="space-y-1.5 text-[13px]">
            <div className="flex items-center gap-2 text-[#315D47] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentProject.completedTasks} tasks completed</span>
            </div>
            <div className="flex items-center gap-2 text-[#77776F]">
              <Clock className="w-4 h-4 text-[#8DAA96]" />
              <span>
                {currentProject.totalTasks - currentProject.completedTasks} tasks remaining
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#55554E] pt-1">
              <Calendar className="w-4 h-4 text-[#8DAA96]" />
              <span>Deadline: {currentProject.deadline}</span>
              {currentProject.daysLeft && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EDE6DC] text-[#77776F]">
                  {currentProject.daysLeft} days left
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Plant on Books Graphic */}
        <div className="hidden sm:block">
          <PlantOnBooksIllustration className="w-44 h-28" />
        </div>
      </div>

      {/* 3. Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-[#E9E5DE] pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'notes', label: 'Notes', icon: BookOpen },
            { id: 'references', label: 'References', icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#315D47] text-[#FFFFFF] shadow-xs'
                    : 'text-[#77776F] hover:text-[#202923] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'tasks' && (
          <button
            onClick={handleAddTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] text-[12px] font-medium text-[#202923] hover:border-[#8DAA96] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#315D47]" />
            <span>Tambah Tugas</span>
          </button>
        )}
      </div>

      {/* 4. Tab Contents & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tab Content */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-[13px]">
                <h4 className="font-bold text-[#202923]">Task Breakdown</h4>
                <span className="text-[#77776F] font-mono">
                  {currentProject.completedTasks} / {currentProject.totalTasks} completed
                </span>
              </div>

              <div className="space-y-2">
                {projectTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#E9E5DE] bg-[#FFFFFF] hover:bg-[#FAF8F5] cursor-pointer transition-colors group select-none"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-[#315D47] text-[#FFFFFF]'
                            : 'border-2 border-[#D8D4CC] group-hover:border-[#8DAA96]'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <span
                        className={`text-[13px] ${
                          task.completed
                            ? 'line-through text-[#77776F]'
                            : 'text-[#202923] font-medium'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      {task.completed ? (
                        <span className="text-[#315D47] flex items-center gap-1 font-sans">
                          ✓ {task.completedDate || 'Selesai'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#77776F] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E9E5DE]">
                          <CalendarDays className="w-3 h-3 text-[#8DAA96]" />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#202923] text-[13.5px]">Dokumen Terkait</h4>
              {[
                { title: 'Bab I – Pendahuluan', wordCount: 1254, updated: '2 jam lalu' },
                { title: 'Bab II – Kajian Teori', wordCount: 3420, updated: '3 hari lalu' },
                { title: 'Bab III – Metode Penelitian', wordCount: 2150, updated: '1 minggu lalu' },
                { title: 'Catatan Bimbingan Pembimbing', wordCount: 450, updated: 'Kemarin' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-[#E9E5DE] bg-[#FAF8F5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#315D47]" />
                    <span className="text-[13px] font-medium text-[#202923]">{doc.title}</span>
                  </div>
                  <span className="text-[11px] text-[#77776F] font-mono">{doc.wordCount} kata • {doc.updated}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#202923] text-[13.5px]">Catatan Riset</h4>
              {currentProject.notes?.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl border border-[#E9E5DE] bg-[#FAF7F0]">
                  <h5 className="font-semibold text-[13px] text-[#202923]">{n.title}</h5>
                  <p className="text-[12px] text-[#55554E] mt-1">{n.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#202923] text-[13.5px]">Daftar Pustaka & Sitasi</h4>
              {currentProject.references?.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl border border-[#E9E5DE] bg-[#FFFFFF] flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold text-[13px] text-[#202923]">{r.title}</h5>
                    <p className="text-[11.5px] text-[#77776F] mt-0.5">{r.authors} ({r.year})</p>
                  </div>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-[#315D47] hover:underline flex items-center gap-1 text-[11px]">
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Project Timeline & Upcoming Milestones */}
        <div className="space-y-4">
          {/* Project Timeline */}
          <div className="p-4 rounded-xl border border-[#E9E5DE] bg-[#FFFFFF]">
            <h5 className="text-[13px] font-bold text-[#202923] mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#315D47]" />
              <span>Project Timeline</span>
            </h5>
            <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E9E5DE]">
              {currentProject.milestones?.map((m) => {
                const isDone = m.status === 'Selesai';
                const isCurrent = m.status === 'Dalam proses';
                return (
                  <div key={m.id} className="flex items-start gap-3 relative z-10">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                        isDone
                          ? 'bg-[#315D47] text-white'
                          : isCurrent
                          ? 'bg-white border-2 border-[#315D47] text-[#315D47]'
                          : 'bg-white border-2 border-[#D8D4CC]'
                      }`}
                    >
                      {isDone && '✓'}
                      {isCurrent && '●'}
                    </span>
                    <div>
                      <span className="text-[12px] font-medium text-[#202923] block leading-snug">
                        {m.title}
                      </span>
                      <span className="text-[10.5px] text-[#77776F]">
                        {m.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Milestone */}
          <div className="p-4 rounded-xl border border-[#E9E5DE] bg-[#DCE7DC]/40">
            <h5 className="text-[13px] font-bold text-[#202923] mb-2.5 flex items-center gap-2">
              <span className="text-[#315D47]">🚩</span>
              <span>Upcoming Milestone</span>
            </h5>
            <div className="space-y-2 text-[12px]">
              {currentProject.upcomingMilestones?.map((milestone, i) => (
                <div key={i} className="flex items-center justify-between text-[#33332D]">
                  <span>• {milestone.title}</span>
                  <span className="font-mono text-[#77776F]">{milestone.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
