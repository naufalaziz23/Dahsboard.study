'use client';

import React from 'react';
import Link from 'next/link';
import { Folder, ArrowRight, Plus, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'In Progress': { bg: 'bg-[#DCE7DC]', text: 'text-[#315D47]', border: 'border-[#BCDAC8]', dot: 'bg-[#315D47]' },
  'On Hold':     { bg: 'bg-[#FBE8E5]', text: 'text-[#D05A3F]', border: 'border-[#F2BDB6]', dot: 'bg-[#E05A47]' },
  'Completed':   { bg: 'bg-[#E8EFE9]', text: 'text-[#202923]', border: 'border-[#C8DACD]', dot: 'bg-[#4B7B5E]' },
  'default':     { bg: 'bg-[#EDE6DC]', text: 'text-[#77776F]', border: 'border-[#DFD7CC]', dot: 'bg-[#C8A27C]' },
};

function getStatusCfg(status: string) {
  return statusConfig[status] ?? statusConfig['default'];
}

export default function ProjectsSummary() {
  const { projects, setSelectedProjectId } = useStore();

  return (
    <div className="relative overflow-hidden bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#8DAA96] transition-all h-full flex flex-col group">

      {/* Decorative accent top bar */}
      <div className="h-1 bg-gradient-to-r from-[#315D47] via-[#8DAA96] to-[#C8A27C] w-full" />

      {/* Background botanical */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <svg className="absolute bottom-0 right-0 w-40 h-40 opacity-5" viewBox="0 0 160 160" fill="#315D47">
          <path d="M160 160 C 90 110, 100 30, 40 0 C 110 30, 130 110, 160 160 Z" />
        </svg>
      </div>

      <div className="relative z-10 p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8EFE9] flex items-center justify-center ring-2 ring-[#D0E5D8]">
              <Folder className="w-3.5 h-3.5 text-[#315D47]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#202923]">My Projects</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E8EFE9] text-[#315D47] border border-[#D0E5D8]">
              {projects.length}
            </span>
          </div>
          <Link
            href="/projects"
            className="text-[11.5px] text-[#77776F] hover:text-[#315D47] flex items-center gap-1 font-medium group transition-colors px-2 py-0.5 rounded-full hover:bg-[#E8EFE9]/50"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Project Cards */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
            {projects.slice(0, 3).map((p) => {
              const progressVal = p.progress ?? 0;
              const cfg = getStatusCfg(p.status);
              const tasksLeft = Math.max(0, (p.totalTasks || 0) - (p.completedTasks || 0));

              return (
                <Link
                  key={p.id}
                  href="/projects"
                  onClick={() => setSelectedProjectId(p.id)}
                  className="group/card relative overflow-hidden rounded-xl bg-gradient-to-b from-[#FAFAF9] to-[#F5F2ED] border border-[#E5E0D8] p-4 flex flex-col justify-between hover:border-[#8DAA96] hover:shadow-md transition-all"
                >
                  {/* Card top bar matching status color */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${cfg.bg} opacity-80`} />

                  <div>
                    {/* Status badge + category */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
                        <span className="text-[9.5px] font-semibold uppercase tracking-wider text-[#77776F] truncate max-w-[80px]">
                          {p.category || 'Akademik'}
                        </span>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {p.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-serif text-[14.5px] font-bold text-[#202923] group-hover/card:text-[#315D47] transition-colors leading-snug line-clamp-1 mb-3">
                      {p.title}
                    </h4>

                    {/* Circular progress */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <svg className="w-10 h-10 -rotate-90">
                          <circle cx="20" cy="20" r="16" stroke="#E9E5DE" strokeWidth="3" fill="none" />
                          <circle
                            cx="20" cy="20" r="16"
                            stroke="#315D47" strokeWidth="3"
                            strokeDasharray={2 * Math.PI * 16}
                            strokeDashoffset={2 * Math.PI * 16 * (1 - progressVal / 100)}
                            strokeLinecap="round" fill="none"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-[#202923]">
                          {progressVal}%
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="w-full bg-[#E9E5DE] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#315D47] to-[#8DAA96] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressVal}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#77776F] mt-0.5 block">Progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-2.5 border-t border-[#E5E0D8]/70 flex items-center justify-between text-[10.5px] text-[#77776F]">
                    <span className="flex items-center gap-1">
                      {p.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 text-[#315D47] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />{tasksLeft} tugas tersisa
                        </span>
                      )}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-0.5 group-hover/card:text-[#315D47] transition-all" />
                  </div>
                </Link>
              );
            })}

            {/* Add new project placeholder card */}
            {projects.length < 3 && (
              <Link
                href="/projects"
                className="rounded-xl border-2 border-dashed border-[#D5CDC0] bg-[#FAF8F5]/50 hover:bg-[#F5F0E8] hover:border-[#8DAA96] p-4 flex flex-col items-center justify-center text-center transition-all group/add"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-[#E9E5DE] flex items-center justify-center group-hover/add:border-[#8DAA96] group-hover/add:text-[#315D47] transition-all mb-2 shadow-xs">
                  <Plus className="w-4 h-4 text-[#77776F] group-hover/add:text-[#315D47]" />
                </div>
                <span className="text-xs font-bold text-[#202923] group-hover/add:text-[#315D47]">+ Proyek Baru</span>
                <span className="text-[10px] text-[#77776F] mt-0.5">Kelola target terstruktur</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex-1 py-8 px-6 rounded-xl bg-[#FAF8F5] border border-dashed border-[#DCD5CA] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E9E5DE] shadow-xs flex items-center justify-center mb-3">
              <Folder className="w-5 h-5 text-[#315D47]" />
            </div>
            <h4 className="font-serif text-[14.5px] font-bold text-[#202923]">Belum Ada Proyek</h4>
            <p className="text-[11.5px] text-[#77776F] mt-1 max-w-sm">
              Mulai kelola skripsi, tugas riset, atau laporan akademik.
            </p>
            <Link href="/projects" className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E2B22] text-white text-xs font-semibold hover:bg-[#315D47] transition-all shadow-xs">
              <Plus className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span>Buat Proyek Pertama</span>
            </Link>
          </div>
        )}
      </div>

      <div className="relative z-10 px-5 py-3 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11px] text-[#77776F] bg-[#FAFAF9]/70">
        <span>Tersinkron dengan ruang kerja</span>
        <span className="font-serif italic text-[#8DAA96]">Focus &amp; Achieve 🌿</span>
      </div>
    </div>
  );
}