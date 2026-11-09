'use client';

import React, { useState } from 'react';
import {
  Folder,
  LayoutGrid,
  List,
  Plus,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Check,
  Calendar,
  MoreHorizontal,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProjectDetailView from '@/components/projects/ProjectDetailView';
import { ProjectStatus } from '@/types';

export default function MyProjectsPage() {
  const { projects, selectedProjectId, setSelectedProjectId, addProject } = useStore();
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed'>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new project
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Skripsi');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'In Progress') return p.status === 'In Progress' || p.status === 'On Going';
    if (filter === 'Completed') return p.status === 'Completed';
    return true;
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleNewProject = handleOpenModal;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Keep deadline as ISO string for the API schema (expects datetime)
    const rawDeadline = deadline ? new Date(deadline + 'T12:00:00.000Z').toISOString() : null;

    const catLower = (category || '').toLowerCase();
    const firstMilestone =
      catLower.includes('web') || catLower.includes('dev') || catLower.includes('erp')
        ? 'Requirements & System Design'
        : catLower.includes('skripsi')
        ? 'Draf Proposal Bab I-III'
        : catLower.includes('tugas')
        ? 'Outline Makalah & Literatur'
        : 'Inisiasi & Rencana Awal';

    addProject({
      title: title.trim(),
      description: description.trim() || 'Proyek akademik',
      status: 'In Progress',
      deadline: rawDeadline || '2027',
      category: category.trim() || 'Umum',
      milestones: [],
      upcomingMilestones: [{ title: firstMilestone, date: deadline || '2027' }],
      references: [],
      notes: [],
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setDeadline('');
    setCategory('Skripsi');
  };

  const getProjectIcon = (category: string) => {
    switch (category) {
      case 'Skripsi':
        return GraduationCap;
      case 'Tugas Kuliah':
        return BookOpen;
      case 'Laporan PK':
        return Briefcase;
      default:
        return Users;
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'In Progress':
        return 'bg-[#DCE7DC] text-[#315D47] border border-[#BCDAC8]';
      case 'On Going':
        return 'bg-[#D7E2EA] text-[#32617A] border border-[#A8C4D5]';
      case 'Completed':
        return 'bg-[#E8EFE9] text-[#202923] border border-[#C8DACD] font-semibold';
      case 'Planning':
        return 'bg-[#EDE6DC] text-[#77776F] border border-[#DFD7CC]';
      default:
        return 'bg-[#EDE6DC] text-[#77776F] border border-[#DFD7CC]';
    }
  };

  const getStatusDot = (status: ProjectStatus) => {
    switch (status) {
      case 'In Progress': return 'bg-[#315D47]';
      case 'On Going':    return 'bg-[#32617A]';
      case 'Completed':   return 'bg-[#4B7B5E]';
      default:            return 'bg-[#C8A27C]';
    }
  };

  const getAccentColor = (category: string) => {
    const map: Record<string, string> = {
      'Skripsi':     'from-[#315D47] to-[#8DAA96]',
      'Tugas Kuliah':'from-[#C8A27C] to-[#E8D5B5]',
      'ERP':         'from-[#32617A] to-[#8AACC4]',
      'Laporan PK':  'from-[#5A4A6A] to-[#9E8DB4]',
      'Penelitian':  'from-[#7A4A32] to-[#C49A7A]',
    };
    return map[category] || 'from-[#8DAA96] to-[#BDD0C4]';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header with botanical accent */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EDE6DC]/70 via-[#E8DFCE]/50 to-transparent border border-[#DDD5C5] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Botanical background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <svg className="absolute right-0 top-0 h-full w-48 opacity-10" viewBox="0 0 200 120" fill="none">
            <path d="M200 0 C 140 60, 160 100, 80 120 C 160 100, 210 50, 200 0 Z" fill="#315D47" />
          </svg>
          <svg className="absolute left-4 bottom-1 opacity-10 w-20 h-10" viewBox="0 0 80 40">
            {[0,1,2,3,4].map(i => [0,1,2,3].map(j => (
              <circle key={`${i}-${j}`} cx={i*18+4} cy={j*12+4} r="2" fill="#315D47" />
            )))}
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFE9] border border-[#D0E5D8] flex items-center justify-center shadow-xs">
              <Folder className="w-4.5 h-4.5 text-[#315D47]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#202923]">My Projects</h1>
              <p className="font-serif italic text-[13px] text-[#77776F] mt-0.5">
                Manage all your academic projects in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Cards / List View Toggle */}
          <div className="bg-[#FFFFFF] p-1 rounded-full border border-[#E9E5DE] flex items-center shadow-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-[#315D47] text-[#FFFFFF] shadow-xs'
                  : 'text-[#77776F] hover:text-[#202923]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-[#315D47] text-[#FFFFFF] shadow-xs'
                  : 'text-[#77776F] hover:text-[#202923]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* New Project Button */}
          <button
            onClick={handleNewProject}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#202923] text-[#FAF8F5] text-[13px] font-medium hover:bg-[#315D47] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#8DAA96]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left List (35%) + Right Detail (65%) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Projects Selector Column */}
        <div className="w-full lg:w-[360px] flex-shrink-0 space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'All', label: 'All Projects', count: projects.length },
              {
                id: 'In Progress',
                label: 'In Progress',
                count: projects.filter((p) => p.status === 'In Progress' || p.status === 'On Going').length,
              },
              {
                id: 'Completed',
                label: 'Completed',
                count: projects.filter((p) => p.status === 'Completed').length,
              },
            ].map((f) => {
              const isSelected = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#202923] text-[#FAF8F5]'
                      : 'bg-[#FFFFFF] border border-[#E9E5DE] text-[#77776F] hover:text-[#202923]'
                  }`}
                >
                  {f.label} <span className="opacity-75">{f.count}</span>
                </button>
              );
            })}
          </div>

          {/* Projects Cards Column or Empty State */}
          <div className="space-y-3">
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#ECE7DF] p-8 text-center">
                <Folder className="w-8 h-8 text-[#8DAA96] mx-auto mb-2" />
                <p className="text-xs text-[#77776F]">Belum ada proyek.</p>
                <button
                  onClick={handleNewProject}
                  className="mt-2.5 px-3.5 py-1.5 rounded-full bg-[#1E2B22] text-white text-xs font-medium hover:bg-[#2C3F32] transition-colors"
                >
                  + Buat Proyek Pertama
                </button>
              </div>
            ) : (
              filteredProjects.map((p) => {
              const isSelected = selectedProjectId === p.id;
              const Icon = getProjectIcon(p.category);
              const accent = getAccentColor(p.category);
              const dot = getStatusDot(p.status);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#315D47] shadow-[0_4px_16px_rgba(49,93,71,0.12)] ring-1 ring-[#315D47]'
                      : 'bg-[#FFFFFF] border-[#E9E5DE] hover:border-[#8DAA96] hover:shadow-md shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
                  }`}
                >
                  {/* Gradient top accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${accent} w-full transition-opacity ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}`} />

                  {/* Background botanical wave */}
                  <div className="absolute bottom-0 right-0 w-24 h-16 pointer-events-none opacity-5">
                    <svg viewBox="0 0 100 60" fill="#315D47" className="w-full h-full">
                      <path d="M100 60 C 60 40, 70 10, 30 0 C 70 10, 90 40, 100 60 Z" />
                    </svg>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[14px] text-[#202923] truncate group-hover:text-[#315D47] transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-[11px] text-[#77776F] line-clamp-1 mt-0.5 leading-snug">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0 ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </div>

                    {/* Progress bar with gradient */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="w-full h-2 rounded-full bg-[#EDE6DC] overflow-hidden shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${accent} rounded-full transition-all duration-500`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="flex items-center gap-1 text-[#77776F]">
                          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                          <span>{p.status}</span>
                        </span>
                        <span className="font-mono font-bold text-[#202923]">{p.progress}%</span>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-2.5 pt-2.5 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[10.5px] text-[#77776F]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#8DAA96]" />
                        <span className="truncate max-w-[130px]">Deadline: {p.deadline}</span>
                      </span>
                      <span className="font-mono flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-[#315D47]" />
                        {p.completedTasks} / {p.totalTasks}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right Detail Panel */}
        <ProjectDetailView />
      </div>

      {/* NEW PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DBD0] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E2B22]">
                    Buat Proyek Akademik Baru
                  </h3>
                  <p className="text-xs text-[#77776F]">
                    Kelola skripsi, makalah, atau tugas riset terstruktur
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-[#8A928B] hover:bg-[#F2EFE9] hover:text-[#1E2B22] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Judul Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Skripsi: Analisis Sentimen Kebijakan..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs focus:outline-hidden focus:border-[#315D47] focus:ring-1 focus:ring-[#315D47] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                    Kategori <span className="text-[11px] font-normal text-[#77776F]">(Bebas ketik apa saja)</span>
                  </label>
                  <input
                    type="text"
                    list="project-category-suggestions"
                    placeholder="Ketik kategori bebas (misal: ERP, Tugas Akhir, Riset...)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs bg-white focus:outline-hidden focus:border-[#315D47] focus:ring-1 focus:ring-[#315D47] transition-all"
                  />
                  <datalist id="project-category-suggestions">
                    <option value="Skripsi" />
                    <option value="Tugas Kuliah" />
                    <option value="ERP" />
                    <option value="Laporan PK" />
                    <option value="Penelitian" />
                    <option value="PLK UNY Mengabdi" />
                    <option value="Proyek Mandiri" />
                  </datalist>

                  {/* Pilihan Cepat */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                    {['Skripsi', 'Tugas Kuliah', 'ERP', 'Laporan PK', 'Riset'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                          category === cat
                            ? 'bg-[#1E2B22] text-white border-[#1E2B22] font-semibold shadow-xs'
                            : 'bg-[#FAF8F5] text-[#55554E] border-[#E2DBD0] hover:border-[#8DAA96]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs bg-white focus:outline-hidden focus:border-[#315D47] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan ringkas mengenai tujuan proyek..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs focus:outline-hidden focus:border-[#315D47] focus:ring-1 focus:ring-[#315D47] transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#DCD5CA] text-[#77776F] hover:bg-[#F2EFE9] text-xs font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1E2B22] hover:bg-[#315D47] text-white text-xs font-medium transition-colors shadow-xs"
                >
                  Buat Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
