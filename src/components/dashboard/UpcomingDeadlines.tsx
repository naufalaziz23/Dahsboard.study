'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function UpcomingDeadlines() {
  const { tasks } = useStore();

  const deadlineTasks = tasks
    .filter((t) => !t.completed && t.dueDate)
    .slice(0, 4);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow min-h-[175px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#315D47]" />
          <h3 className="text-[14.5px] font-bold text-[#202923]">
            Upcoming Deadlines
          </h3>
        </div>
        <Link
          href="/calendar"
          className="text-[12px] text-[#77776F] hover:text-[#315D47] flex items-center gap-1 font-medium group transition-colors"
        >
          <span>Lihat Kalender</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Deadlines Timeline List or Empty State */}
      {deadlineTasks.length > 0 ? (
        <div className="space-y-3.5">
          {deadlineTasks.map((item, idx) => (
            <div key={item.id} className="flex items-start justify-between gap-3 group">
              <div className="flex items-start gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    idx === 0
                      ? 'bg-[#4B7B5E]'
                      : idx === 1
                      ? 'bg-[#8DAA96]'
                      : 'bg-[#C8A27C]'
                  } mt-1 flex-shrink-0`}
                />
                <div>
                  <span className="text-[11.5px] font-bold text-[#202923] block leading-tight">
                    {item.dueDate}
                  </span>
                  <span className="text-[13px] text-[#55554E] block mt-0.5 leading-snug group-hover:text-[#315D47] transition-colors">
                    {item.title}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#77776F] border border-[#E9E5DE] flex-shrink-0">
                {item.dueDate}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-xs text-[#77776F]">Tidak ada tenggat waktu dalam waktu dekat.</p>
          <Link
            href="/calendar"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#315D47] font-semibold hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah deadline ke kalender</span>
          </Link>
        </div>
      )}

      <div className="pt-3 border-t border-[#E9E5DE]/60 mt-3 text-[11.5px] text-[#77776F]">
        Semua tenggat waktu otomatis disinkronkan ke kalender
      </div>
    </div>
  );
}
