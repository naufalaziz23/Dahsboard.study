'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Plus, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function UpcomingDeadlines() {
  const { tasks } = useStore();

  // Combine uncompleted tasks with due date and upcoming calendar events
  const deadlineTasks = tasks
    .filter((t) => !t.completed && t.dueDate)
    .slice(0, 3);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FAF3E8] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-[#C8A27C]" />
            </div>
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

        {/* Deadlines Timeline List */}
        {deadlineTasks.length > 0 ? (
          <div className="space-y-3">
            {deadlineTasks.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] group hover:border-[#8DAA96] transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      idx === 0
                        ? 'bg-[#E05A47]'
                        : idx === 1
                        ? 'bg-[#8DAA96]'
                        : 'bg-[#C8A27C]'
                    } flex-shrink-0`}
                  />
                  <div className="min-w-0">
                    <span className="text-[12.5px] font-medium text-[#202923] block truncate group-hover:text-[#315D47] transition-colors leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#77776F] block mt-0.5 leading-none">
                      Tenggat: {item.dueDate}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#77776F] border border-[#E9E5DE] flex-shrink-0">
                  {item.priority || 'Normal'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 text-center rounded-xl bg-[#FAF8F5] border border-dashed border-[#ECE7DF] flex flex-col items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E9E5DE] flex items-center justify-center text-[#8DAA96] mb-2 shadow-2xs">
              <Calendar className="w-4 h-4 text-[#315D47]" />
            </div>
            <p className="text-xs font-semibold text-[#202923]">Tidak ada tenggat mendesak</p>
            <p className="text-[11px] text-[#77776F] mt-0.5 max-w-[200px]">
              Semua target aman terkendali.
            </p>
            <Link
              href="/calendar"
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCD5CA] text-xs font-medium text-[#315D47] hover:border-[#315D47] hover:bg-[#FAF8F5] transition-all shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>+ Jadwal Baru</span>
            </Link>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#E9E5DE]/60 mt-4 text-[11.5px] text-[#77776F] flex items-center justify-between">
        <span>Sinkronisasi kalender</span>
        <span className="font-mono text-[10.5px] text-[#8DAA96]">Terkoneksi ✓</span>
      </div>
    </div>
  );
}