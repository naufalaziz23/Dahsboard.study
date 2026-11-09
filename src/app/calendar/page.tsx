'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Clock,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PlantOnBooksIllustration } from '@/components/shared/BotanicalAssets';

export default function CalendarPage() {
  const {
    calendarEvents,
    addCalendarEvent,
    toggleCalendarEvent,
    selectedCalendarDate,
    setSelectedCalendarDate,
    tasks,
    toggleTask,
  } = useStore();

  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedMonth, setSelectedMonth] = useState('January 2027');

  // Generate 35 calendar cells dynamically
  const daysGrid = Array.from({ length: 35 }, (_, i) => {
    // Offset for Dec 28 to Jan 31
    if (i < 4) {
      const day = 28 + i;
      const dateStr = `2026-12-${day}`;
      const events = calendarEvents.filter((e) => e.date === dateStr);
      return { day, isCurrentMonth: false, dateStr, events };
    } else {
      const day = i - 3;
      const dateStr = `2027-01-${day < 10 ? '0' + day : day}`;
      const events = calendarEvents.filter((e) => e.date === dateStr);
      return {
        day,
        isCurrentMonth: true,
        isToday: day === 14,
        dateStr,
        events,
      };
    }
  });

  const handleAddEvent = () => {
    const title = window.prompt('Judul Agenda / Deadline:');
    if (title) {
      const date = window.prompt('Tanggal (YYYY-MM-DD):', selectedCalendarDate || '2027-01-14');
      const cat = window.prompt(
        'Kategori (bimbingan / deadline / penulisan / pengolahan / kegiatan / lainnya):',
        'deadline'
      );
      addCalendarEvent({
        title,
        date: date || '2027-01-14',
        category: (cat as any) || 'deadline',
        completed: false,
      });
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'bimbingan':
      case 'consultation':
        return 'bg-[#E3EFE4] text-[#2F6144] border-[#B7D7BC]';
      case 'deadline':
        return 'bg-[#FBE8E5] text-[#C24D39] border-[#F2BCB4]';
      case 'penulisan':
      case 'writing':
        return 'bg-[#EDE4F5] text-[#694382] border-[#D3C1E5]';
      case 'pengolahan':
      case 'data_collection':
        return 'bg-[#FDF3E1] text-[#9A6B1A] border-[#EED7A6]';
      case 'kegiatan':
      case 'academic':
        return 'bg-[#E3F2FD] text-[#1E6091] border-[#B8DAF7]';
      default:
        return 'bg-[#EFECE6] text-[#55554E] border-[#DCD7CD]';
    }
  };

  const todayTasksList = tasks.slice(0, 3);
  const upcomingDeadlinesList = tasks.filter((t) => !t.completed && t.dueDate).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-10 text-[#202923]">
      {/* 2-Column Balanced Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: Calendar Card (8 cols out of 12) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white rounded-3xl border border-[#ECE7DF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div>
            {/* Calendar Integrated Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3 border-b border-[#ECE7DF] gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMonth('December 2026')}
                  className="p-1 rounded-lg border border-[#E2DBD0] hover:bg-[#FAF8F5] text-[#555]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMonth('February 2027')}
                  className="p-1 rounded-lg border border-[#E2DBD0] hover:bg-[#FAF8F5] text-[#555]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <h2 className="font-serif text-lg font-bold text-[#1E2B22] ml-1">
                  {selectedMonth}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#FAF8F5] p-0.5 rounded-full border border-[#E2DBD0] flex items-center text-xs">
                  {['Month', 'Week', 'Day'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setCurrentView(v.toLowerCase() as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        currentView === v.toLowerCase()
                          ? 'bg-[#1E2B22] text-white shadow-xs'
                          : 'text-[#6B726B] hover:text-[#1E2B22]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddEvent}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1E2B22] text-white text-xs font-medium hover:bg-[#2C3F32] shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event</span>
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center font-medium text-xs text-[#7A827B] pb-2 border-b border-[#ECE7DF]/70">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="py-0.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Compact Calendar Days Grid */}
            <div className="grid grid-cols-7 border-l border-t border-[#ECE7DF]">
              {daysGrid.map((item, idx) => {
                const isSelected = selectedCalendarDate === item.dateStr;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCalendarDate(item.dateStr)}
                    className={`h-[68px] sm:h-[74px] p-1.5 border-r border-b border-[#ECE7DF] flex flex-col justify-between transition-colors cursor-pointer ${
                      !item.isCurrentMonth
                        ? 'bg-[#FAF8F5]/40 text-[#A0988E]'
                        : isSelected
                        ? 'bg-[#E8EFE9]/40'
                        : 'bg-white hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[11px] font-mono rounded-full w-5 h-5 flex items-center justify-center ${
                          item.isToday
                            ? 'bg-[#2B4436] text-white font-bold'
                            : item.isCurrentMonth
                            ? 'text-[#1E2B22] font-medium'
                            : 'text-[#A0988E]'
                        }`}
                      >
                        {item.day}
                      </span>
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      {item.events?.map((ev, eIdx) => {
                        const style = getCategoryStyles(ev.category);
                        return (
                          <div
                            key={eIdx}
                            className={`text-[9.5px] px-1.5 py-0.5 rounded-sm border truncate font-medium flex items-center gap-1 ${style}`}
                          >
                            <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                            <span className="truncate">{ev.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Bottom Integrated Legend */}
          <div className="pt-3.5 mt-3 border-t border-[#ECE7DF] flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#6B726B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2F6144]" />
              <span>Bimbingan / Konsultasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C24D39]" />
              <span>Deadline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#694382]" />
              <span>Penulisan / Revisi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9A6B1A]" />
              <span>Pengolahan Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E6091]" />
              <span>Kegiatan Akademik</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3 Clean Compact Cards (4 cols out of 12) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {/* Card 1: Today's Tasks */}
          <div className="bg-white rounded-3xl border border-[#ECE7DF] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECE7DF] pb-2.5">
              <div>
                <span className="text-[11px] text-[#7A827B]">Today,</span>
                <h3 className="font-serif text-base font-bold text-[#1E2B22]">
                  14 January 2027
                </h3>
              </div>
              <PlantOnBooksIllustration className="w-12 h-10 -mr-1" />
            </div>

            {todayTasksList.length > 0 ? (
              <div className="space-y-2">
                {todayTasksList.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      t.completed
                        ? 'bg-[#FAF8F5] border-[#ECE7DF] text-[#7A827B]'
                        : 'bg-white border-[#ECE7DF] text-[#1E2B22] hover:border-[#8DAA96]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                          t.completed
                            ? 'bg-[#2B4436] text-white'
                            : 'border-1.5 border-[#C4BDB2]'
                        }`}
                      >
                        {t.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <span
                        className={`text-xs truncate ${
                          t.completed ? 'line-through text-[#7A827B]' : 'font-medium text-[#1E2B22]'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-[#7A827B] shrink-0 ml-2">
                      {t.timeSlot || 'Hari ini'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A827B] py-3 text-center">
                Belum ada agenda hari ini.
              </p>
            )}
          </div>

          {/* Card 2: This Month Progress */}
          <div className="bg-white rounded-3xl border border-[#ECE7DF] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#C24D39]" />
                <h4 className="font-serif text-sm font-semibold text-[#1E2B22]">
                  This Month Progress
                </h4>
              </div>
              <span className="font-serif text-sm font-bold text-[#1E2B22]">
                {tasks.length > 0
                  ? `${Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}%`
                  : '0%'}
              </span>
            </div>

            <p className="text-xs text-[#7A827B] mb-2.5">
              {tasks.filter((t) => t.completed).length} of {tasks.length} planned tasks completed
            </p>

            <div className="w-full bg-[#ECE7DF] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2B4436] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    tasks.length > 0
                      ? (tasks.filter((t) => t.completed).length / tasks.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Card 3: Upcoming Deadlines */}
          <div className="bg-white rounded-3xl border border-[#ECE7DF] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#ECE7DF] pb-2">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#1E2B22]" />
                  <h4 className="font-serif text-sm font-semibold text-[#1E2B22]">
                    Upcoming Deadlines
                  </h4>
                </div>
                <button className="text-xs font-medium text-[#1E2B22] hover:text-[#315D47] flex items-center gap-0.5">
                  <span>See All</span>
                  <span>→</span>
                </button>
              </div>

              {upcomingDeadlinesList.length > 0 ? (
                <div className="space-y-2.5">
                  {upcomingDeadlinesList.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-[#C24D39] shrink-0" />
                        <span className="truncate text-[#1E2B22] font-medium">{d.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#7A827B] shrink-0 ml-2">
                        {d.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#7A827B] py-3 text-center">
                  Belum ada tenggat waktu mendatang.
                </p>
              )}
            </div>

            <div className="pt-2 text-[11px] text-[#7A827B] border-t border-[#ECE7DF] mt-3">
              Tenggat waktu disinkronkan dari database MySQL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
