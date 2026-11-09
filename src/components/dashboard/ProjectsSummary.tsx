'use client';

import React from 'react';
import Link from 'next/link';
import { Folder, ArrowRight, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function ProjectsSummary() {
  const { projects, setSelectedProjectId, addProject } = useStore();

  const handleNewProject = () => {
    const title = window.prompt('Judul Proyek Baru:');
    if (title) {
      addProject({
        title,
        description: 'Proyek akademik baru',
        status: 'In Progress',
        deadline: '2027',
        category: 'Skripsi',
        milestones: [],
        upcomingMilestones: [],
        references: [],
        notes: [],
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-[#DCE7DC] text-[#315D47]';
      case 'On Hold':
        return 'bg-[#FBE8E5] text-[#D05A3F]';
      case 'Completed':
        return 'bg-[#E8EFE9] text-[#202923] font-semibold';
      default:
        return 'bg-[#EDE6DC] text-[#77776F]';
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-[#315D47]" />
          <h3 className="text-[15px] font-bold text-[#202923]">
            My Projects
          </h3>
        </div>
        <Link
          href="/projects"
          className="text-[12px] text-[#77776F] hover:text-[#315D47] flex items-center gap-1 font-medium group transition-colors"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Project Cards Grid or Empty State */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((p) => {
            const isComplete = p.progress === 100;

            return (
              <Link
                key={p.id}
                href="/projects"
                onClick={() => setSelectedProjectId(p.id)}
                className="relative overflow-hidden rounded-2xl bg-[#FAF8F5] border border-[#E9E5DE] p-4 flex flex-col justify-between hover:border-[#8DAA96] hover:shadow-xs transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-11 h-11 transform -rotate-90">
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          stroke="#E9E5DE"
                          strokeWidth="3.5"
                          fill="none"
                        />
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          stroke="#315D47"
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={
                            2 * Math.PI * 18 * (1 - (p.progress || 0) / 100)
                          }
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <span className="absolute font-mono text-[10.5px] font-bold text-[#202923]">
                        {p.progress}%
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-[14.5px] font-bold text-[#202923] group-hover:text-[#315D47] transition-colors leading-snug truncate max-w-[120px]">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-[#77776F] mt-0.5 truncate max-w-[120px]">
                        {p.subtitle || p.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusBadge(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11px] text-[#77776F]">
                  <span>{p.totalTasks - p.completedTasks} tasks left</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#77776F] group-hover:translate-x-1 group-hover:text-[#315D47] transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-[#ECE7DF]">
          <p className="text-xs text-[#77776F]">Belum ada proyek dibuat.</p>
          <button
            onClick={handleNewProject}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1E2B22] text-white text-xs font-medium rounded-full hover:bg-[#315D47] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Buat Proyek Skripsi / Tugas</span>
          </button>
        </div>
      )}
    </div>
  );
}
