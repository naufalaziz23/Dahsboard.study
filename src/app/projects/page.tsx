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
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProjectDetailView from '@/components/projects/ProjectDetailView';
import { ProjectStatus } from '@/types';

export default function MyProjectsPage() {
  const { projects, selectedProjectId, setSelectedProjectId, addProject } = useStore();
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed'>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'In Progress') return p.status === 'In Progress' || p.status === 'On Going';
    if (filter === 'Completed') return p.status === 'Completed';
    return true;
  });

  const handleNewProject = () => {
    const title = window.prompt('Judul Proyek Akademik Baru:');
    if (title) {
      const desc = window.prompt('Deskripsi Proyek:', 'Proyek penelitian / tugas');
      const deadline = window.prompt('Deadline (contoh: 20 Feb 2027):', '20 Feb 2027');
      addProject({
        title,
        description: desc || '',
        status: 'In Progress',
        deadline: deadline || '2027',
        category: 'Akademik',
        milestones: [
          { id: 'm1', title: 'Perencanaan', status: 'Dalam proses' },
          { id: 'm2', title: 'Eksekusi', status: 'Belum dimulai' },
          { id: 'm3', title: 'Laporan Akhir', status: 'Belum dimulai' },
        ],
        upcomingMilestones: [{ title: 'Draf Proposal', date: '30 Nov' }],
        references: [],
        notes: [],
      });
    }
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
        return 'bg-[#DCE7DC] text-[#315D47]';
      case 'On Going':
        return 'bg-[#D7E2EA] text-[#32617A]';
      case 'Completed':
        return 'bg-[#E8EFE9] text-[#202923] font-semibold';
      case 'Planning':
        return 'bg-[#EDE6DC] text-[#77776F]';
      default:
        return 'bg-[#EDE6DC] text-[#77776F]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold text-[#202923]">
              My Projects
            </h1>
            <Folder className="w-6 h-6 text-[#77776F]" />
          </div>
          <p className="font-serif italic text-[14px] text-[#77776F] mt-0.5">
            Manage all your academic projects in one place.
          </p>
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

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#315D47] shadow-md ring-1 ring-[#315D47]'
                      : 'bg-[#FFFFFF] border-[#E9E5DE] hover:border-[#8DAA96] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] flex items-center justify-center text-[#315D47] flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[14px] text-[#202923]">
                          {p.title}
                        </h3>
                        <p className="text-[11.5px] text-[#77776F] line-clamp-2 mt-0.5 leading-snug">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3.5 space-y-1">
                    <div className="w-full h-1.5 rounded-full bg-[#E8EFE9] overflow-hidden">
                      <div
                        className="h-full bg-[#315D47] rounded-full transition-all duration-300"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <span className="font-mono text-[11px] font-bold text-[#202923]">
                        {p.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-2 pt-2 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11px] text-[#77776F]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8DAA96]" />
                      Deadline: {p.deadline}
                    </span>
                    <span className="font-mono">
                      ✓ {p.completedTasks} / {p.totalTasks} tasks
                    </span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right Detail Panel */}
        <ProjectDetailView />
      </div>
    </div>
  );
}
