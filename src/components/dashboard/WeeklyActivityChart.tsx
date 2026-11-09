'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function WeeklyActivityChart() {
  const { tasks, documents } = useStore();

  // Determine current day of week (0=Mon, 6=Sun)
  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // Monday = 0
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayLabelsFull = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const [activeDay, setActiveDay] = useState<string>(dayNames[currentDayIndex]);

  // Dynamic calculations based on active tasks and documents in store
  const { weeklyData, totalHours } = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed);
    const totalWords = documents.reduce((sum, d) => sum + (d.wordCount || 0), 0);

    // Realistic focus estimation: completed tasks (~0.8h) + writing output (~words / 250)
    const activeFocusHours = completedTasks.length > 0 || totalWords > 0
      ? Math.max(0.5, Math.round((completedTasks.length * 0.8 + Math.min(totalWords / 250, 3)) * 10) / 10)
      : 0;

    const data = dayNames.map((day, idx) => {
      let hours = 0;
      let taskCount = 0;

      if (idx === currentDayIndex) {
        // Active today
        hours = activeFocusHours;
        taskCount = completedTasks.length;
      }

      return {
        day,
        fullDay: dayLabelsFull[idx],
        hours,
        taskCount,
        label: `${hours}h`,
        isToday: idx === currentDayIndex,
      };
    });

    const total = Math.round(data.reduce((s, d) => s + d.hours, 0) * 10) / 10;
    return { weeklyData: data, totalHours: total };
  }, [tasks, documents, currentDayIndex]);

  const maxHours = Math.max(3, Math.max(...weeklyData.map((d) => d.hours)) * 1.3);
  const activeItem = weeklyData.find((d) => d.day === activeDay) || weeklyData[currentDayIndex];

  return (
    <div className="relative overflow-hidden bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-lg hover:border-[#8DAA96] transition-all h-full min-h-[220px] group">

      {/* === Visual Accents === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {/* subtle diagonal stripe top right */}
        <svg className="absolute top-0 right-0 w-32 h-32 opacity-5" viewBox="0 0 128 128">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1={i * 20} y1="0" x2={128} y2={128 - i * 20} stroke="#315D47" strokeWidth="1.5" />
          ))}
        </svg>
        {/* soft green bottom wave */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-16" viewBox="0 0 400 65" preserveAspectRatio="none" fill="none">
          <path d="M0 40 C 100 15, 300 55, 400 25 L 400 65 L 0 65 Z" fill="#E8EFE9" opacity="0.5" />
        </svg>
      </div>

      {/* Green top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#315D47] via-[#8DAA96] to-transparent w-full" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8EFE9] flex items-center justify-center ring-2 ring-[#D0E5D8]">
              <BarChart3 className="w-3.5 h-3.5 text-[#315D47]" />
            </div>
            <h3 className="text-[14.5px] font-bold text-[#202923]">Weekly Activity</h3>
          </div>
          <Link
            href="/progress"
            className="text-[11.5px] text-[#77776F] hover:text-[#315D47] flex items-center gap-1 font-medium transition-colors px-2 py-0.5 rounded-full hover:bg-[#E8EFE9]/50 group"
          >
            <span>Detail</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Total summary pill */}
        <div className="relative z-10 mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8EFE9] text-[10.5px] font-semibold text-[#315D47] border border-[#D0E5D8]">
            <span>Minggu ini:</span>
            <span className="font-mono">{totalHours}h</span>
          </span>
          <span className="text-[10.5px] text-[#77776F] font-serif italic">target: 20h/minggu</span>
        </div>

        {/* Chart Bars */}
        <div className="relative z-10 flex-1">
          <div className="flex items-end justify-between gap-1.5 h-24 px-1">
            {weeklyData.map((item) => {
              const heightPercent = item.hours > 0 ? Math.min(100, Math.max(16, (item.hours / maxHours) * 100)) : 8;
              const isSelected = activeDay === item.day;

              return (
                <div
                  key={item.day}
                  onClick={() => setActiveDay(item.day)}
                  className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer group/bar"
                  title={`${item.fullDay}: ${item.hours}h`}
                >
                  {/* Value bubble on selected or hover */}
                  <div
                    className={`text-[9px] font-mono font-bold transition-opacity mb-0.5 ${
                      isSelected
                        ? 'opacity-100 text-[#315D47]'
                        : item.hours > 0
                        ? 'opacity-70 text-[#8DAA96] group-hover/bar:opacity-100'
                        : 'opacity-0 group-hover/bar:opacity-40 text-[#77776F]'
                    }`}
                  >
                    {item.label}
                  </div>

                  <div className="w-full max-w-[26px] h-full flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        item.hours > 0
                          ? isSelected
                            ? 'bg-gradient-to-t from-[#1E2B22] via-[#2D5640] to-[#315D47] shadow-sm'
                            : 'bg-gradient-to-t from-[#8DAA96] to-[#A8C4B0] group-hover/bar:from-[#315D47] group-hover/bar:to-[#5A8868]'
                          : isSelected
                          ? 'bg-gradient-to-t from-[#8DAA96]/60 to-[#8DAA96]/30'
                          : 'bg-[#EAE5DC] group-hover/bar:bg-[#D5CDC0]'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`text-[10px] font-mono transition-colors ${
                        isSelected
                          ? 'font-bold text-[#202923]'
                          : item.isToday
                          ? 'font-semibold text-[#315D47]'
                          : 'text-[#77776F]'
                      }`}
                    >
                      {item.day}
                    </span>
                    {item.isToday && (
                      <span className="w-1 h-1 rounded-full bg-[#315D47]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer bar with active day info */}
      <div className="relative z-10 px-5 py-2.5 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11px] text-[#77776F] bg-[#FAFAF9]/70">
        <span>
          <strong className="text-[#202923]">{activeItem?.fullDay}:</strong>{' '}
          {activeItem?.hours && activeItem.hours > 0
            ? `${activeItem.hours} jam (${activeItem.taskCount || 0} tugas selesai)`
            : 'Belum ada sesi fokus'}
        </span>
        <span className="font-serif italic text-[#8DAA96]">
          {totalHours > 0 ? 'Fokus aktif! 🌿' : 'Mulai hari ini 🌿'}
        </span>
      </div>
    </div>
  );
}