'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Check, ArrowRight, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

const priorityColor: Record<string, string> = {
  High: 'bg-[#FBE8E5] text-[#E05A47] border-[#F2BDB6]',
  Medium: 'bg-[#EDE6DC] text-[#C8A27C] border-[#E0D3BC]',
  Low: 'bg-[#E8EFE9] text-[#315D47] border-[#BCDAC8]',
};

export default function TodaysFocusCard() {
  const { tasks, toggleTask, addTask } = useStore();
  const [quickTitle, setQuickTitle] = useState('');
  const focusTasks = tasks.slice(0, 3);
  const completedCount = focusTasks.filter((t) => t.completed).length;
  const progressPct = focusTasks.length > 0 ? Math.round((completedCount / focusTasks.length) * 100) : 0;

  const handleQuickAdd = (titleText: string) => {
    if (!titleText.trim()) return;
    addTask({ title: titleText.trim(), completed: false, priority: 'Medium', dueDate: 'Hari ini' });
    setQuickTitle('');
  };

  return (
    <div className="relative overflow-hidden bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-lg hover:border-[#F2BDB6] transition-all h-full min-h-[220px] group">

      {/* === Visual Accents === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {/* Soft warm bottom wave */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-20" viewBox="0 0 400 80" preserveAspectRatio="none" fill="none">
          <path d="M0 50 C 120 20, 260 70, 400 35 L 400 80 L 0 80 Z" fill="#FBE8E5" opacity="0.4" />
        </svg>
        {/* Top right dot cluster */}
        <svg className="absolute top-3 right-3 opacity-15" width="30" height="30">
          {[0,1,2].map(r => [0,1,2].map(c => (
            <circle key={`${r}-${c}`} cx={c * 10 + 4} cy={r * 10 + 4} r="2" fill="#E05A47" />
          )))}
        </svg>
      </div>

      {/* Red/coral top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#E05A47] via-[#F2A99C] to-transparent w-full" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FBE8E5] flex items-center justify-center ring-2 ring-[#F7CCC7]">
              <Target className="w-3.5 h-3.5 text-[#E05A47]" />
            </div>
            <h3 className="text-[14.5px] font-bold text-[#202923]">
              Today&apos;s Focus
            </h3>
          </div>
          <Link
            href="/projects"
            className="text-[11.5px] text-[#77776F] hover:text-[#E05A47] flex items-center gap-1 font-medium group transition-colors px-2 py-0.5 rounded-full hover:bg-[#FBE8E5]/50"
          >
            <span>Semua</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Progress mini bar */}
        {focusTasks.length > 0 && (
          <div className="relative z-10 mb-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#F2BDB6]/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E05A47] to-[#F2A99C] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#E05A47]">{progressPct}%</span>
          </div>
        )}

        {/* Task List */}
        <div className="relative z-10 flex-1">
          {focusTasks.length > 0 ? (
            <div className="space-y-2">
              {focusTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all border ${
                    t.completed
                      ? 'bg-[#F7F5F3] border-[#E9E5DE]'
                      : 'bg-[#FAF8F5] border-[#ECE7DF] hover:border-[#F2BDB6] hover:bg-[#FDF8F7]'
                  }`}
                >
                  <button
                    type="button"
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 border-2 ${
                      t.completed
                        ? 'bg-[#315D47] border-[#315D47] text-white'
                        : 'border-[#D8D4CC] hover:border-[#E05A47]'
                    }`}
                  >
                    {t.completed && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                  </button>
                  <span className={`text-[12.5px] leading-snug flex-1 truncate ${
                    t.completed ? 'line-through text-[#77776F]/70' : 'text-[#202923] font-medium'
                  }`}>
                    {t.title}
                  </span>
                  {t.priority && (
                    <span className={`text-[9.5px] px-1.5 py-0.5 rounded-full border font-semibold flex-shrink-0 ${
                      priorityColor[t.priority] || priorityColor['Medium']
                    }`}>
                      {t.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 py-1">
              <form
                onSubmit={(e) => { e.preventDefault(); handleQuickAdd(quickTitle); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="+ Tulis fokus tugas hari ini..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] focus:outline-none focus:border-[#E05A47] text-[#202923]"
                />
                <button
                  type="submit"
                  disabled={!quickTitle.trim()}
                  className="px-3 py-1.5 rounded-xl bg-[#E05A47] text-white text-xs font-semibold hover:bg-[#C94A38] transition-colors disabled:opacity-40"
                >
                  Tambah
                </button>
              </form>
              <p className="text-[11px] text-[#77776F] pl-1">Belum ada target. Tuliskan satu fokus kecil di atas.</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 px-5 py-3 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11px] text-[#77776F] bg-[#FAFAF9]/70">
        <span>{completedCount} dari {focusTasks.length} selesai</span>
        <span className="font-serif italic text-[#E05A47]">
          {focusTasks.length === 0 ? 'Mulai target hari ini 🌿' : completedCount === focusTasks.length ? 'Semua selesai! 🎉' : 'Keep it up! ✨'}
        </span>
      </div>
    </div>
  );
}