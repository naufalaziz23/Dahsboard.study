'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Check, ArrowRight, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TodaysFocusCard() {
  const { tasks, toggleTask } = useStore();
  const focusTasks = tasks.slice(0, 4);

  const completedCount = focusTasks.filter((t) => t.completed).length;

  return (
    <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow min-h-[175px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FBE8E5] flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-[#E05A47]" />
            </div>
            <h3 className="text-[14.5px] font-bold text-[#202923]">
              Today&apos;s Focus
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

        {/* Task List or Empty State */}
        {focusTasks.length > 0 ? (
          <div className="space-y-2.5">
            {focusTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="flex items-center gap-3 group cursor-pointer select-none"
              >
                <button
                  type="button"
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    t.completed
                      ? 'bg-[#315D47] text-[#FFFFFF]'
                      : 'border-2 border-[#D8D4CC] hover:border-[#8DAA96] bg-transparent'
                  }`}
                >
                  {t.completed && <Check className="w-3 h-3" strokeWidth={3} />}
                </button>
                <span
                  className={`text-[13px] transition-colors leading-snug ${
                    t.completed
                      ? 'line-through text-[#77776F]/80'
                      : 'text-[#202923] group-hover:text-[#315D47]'
                  }`}
                >
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs text-[#77776F]">Belum ada tugas hari ini.</p>
            <Link
              href="/projects"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#315D47] font-semibold hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah tugas di proyek</span>
            </Link>
          </div>
        )}
      </div>

      {focusTasks.length > 0 && (
        <div className="pt-3 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11.5px] text-[#77776F] mt-2">
          <span>
            {completedCount} dari {focusTasks.length} selesai
          </span>
          <span className="font-serif italic text-[#8DAA96]">
            {completedCount === focusTasks.length ? 'Semua selesai! 🎉' : 'Keep it up! ✨'}
          </span>
        </div>
      )}
    </div>
  );
}
