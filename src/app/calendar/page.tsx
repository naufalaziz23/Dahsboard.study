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
  X,
  CalendarDays,
  Sparkles,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PlantOnBooksIllustration, CatOnBooksIllustration } from '@/components/shared/BotanicalAssets';
import { CalendarEvent } from '@/types';

const getCategoryStyle = (category?: string) => {
  switch (category) {
    case 'bimbingan':
      return { bg: 'bg-[#E8EFE9]', text: 'text-[#315D47]', border: 'border-[#BCD7C3]', dot: 'bg-[#315D47]' };
    case 'deadline':
      return { bg: 'bg-[#FBE8E5]', text: 'text-[#E05A47]', border: 'border-[#F2C2BA]', dot: 'bg-[#E05A47]' };
    case 'penulisan':
      return { bg: 'bg-[#EDE6DC]', text: 'text-[#8DAA96]', border: 'border-[#DDD4C5]', dot: 'bg-[#8DAA96]' };
    case 'kegiatan':
      return { bg: 'bg-[#FAF3E8]', text: 'text-[#C8A27C]', border: 'border-[#EBD9BC]', dot: 'bg-[#C8A27C]' };
    default:
      return { bg: 'bg-[#F4F1EA]', text: 'text-[#55554E]', border: 'border-[#E2DDD5]', dot: 'bg-[#315D47]' };
  }
};

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export default function CalendarPage() {
  const {
    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    toggleCalendarEvent,
    selectedCalendarDate,
    setSelectedCalendarDate,
  } = useStore();

  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');

  // Fully dynamic Year and Month (default to current date or Jan 2027)
  const initialDate = new Date();
  const [viewYear, setViewYear] = useState(2027);
  const [viewMonth, setViewMonth] = useState(0); // 0 = Januari, 11 = Desember

  // Modal states for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showDatePickerPopup, setShowDatePickerPopup] = useState(false);
  const [modalPickerYear, setModalPickerYear] = useState(2027);
  const [modalPickerMonth, setModalPickerMonth] = useState(0);

  // Form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2027-01-14');
  const [eventTimeSlot, setEventTimeSlot] = useState('09:00 - 11:30');

  // Month navigation: Unlimited across ANY year and month
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setSelectedCalendarDate(`${yyyy}-${mm}-${dd}`);
  };

  // Generate dynamic calendar cells for (viewYear, viewMonth)
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const startOffset = (firstDayOfWeek + 6) % 7; // Monday = 0, Sunday = 6
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const totalCells = startOffset + daysInCurrentMonth > 35 ? 42 : 35;

  const daysGrid = Array.from({ length: totalCells }, (_, i) => {
    let dayNum: number;
    let isCurrentMonth: boolean;
    let cellYear = viewYear;
    let cellMonth = viewMonth;

    if (i < startOffset) {
      // Prev month
      dayNum = daysInPrevMonth - startOffset + i + 1;
      isCurrentMonth = false;
      if (viewMonth === 0) {
        cellYear = viewYear - 1;
        cellMonth = 11;
      } else {
        cellMonth = viewMonth - 1;
      }
    } else if (i < startOffset + daysInCurrentMonth) {
      // Current month
      dayNum = i - startOffset + 1;
      isCurrentMonth = true;
    } else {
      // Next month
      dayNum = i - startOffset - daysInCurrentMonth + 1;
      isCurrentMonth = false;
      if (viewMonth === 11) {
        cellYear = viewYear + 1;
        cellMonth = 0;
      } else {
        cellMonth = viewMonth + 1;
      }
    }

    const mm = String(cellMonth + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    const dateStr = `${cellYear}-${mm}-${dd}`;
    const events = calendarEvents.filter((e) => e.date === dateStr);

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const isToday = dateStr === todayStr || dateStr === '2027-01-14';

    return {
      day: dayNum,
      isCurrentMonth,
      isToday,
      dateStr,
      events,
    };
  });

  // Open modal in Add mode
  const handleOpenAddModal = (datePrefill?: string) => {
    setEditingEvent(null);
    setEventTitle('');
    setEventTimeSlot('09:00 - 11:30');
    const targetDate = datePrefill || selectedCalendarDate || '2027-01-14';
    setEventDate(targetDate);

    // Sync modal mini-calendar month/year
    const parts = targetDate.split('-');
    if (parts.length === 3) {
      setModalPickerYear(parseInt(parts[0], 10) || viewYear);
      setModalPickerMonth((parseInt(parts[1], 10) || 1) - 1);
    }

    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEditModal = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setEventTitle(ev.title);
    const targetDate = ev.date || '2027-01-14';
    setEventDate(targetDate);
    setEventTimeSlot(ev.time || '09:00 - 11:30');

    const parts = targetDate.split('-');
    if (parts.length === 3) {
      setModalPickerYear(parseInt(parts[0], 10) || viewYear);
      setModalPickerMonth((parseInt(parts[1], 10) || 1) - 1);
    }

    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (editingEvent) {
      await updateCalendarEvent(editingEvent.id, {
        title: eventTitle.trim(),
        date: eventDate,
        time: eventTimeSlot,
      });
    } else {
      await addCalendarEvent({
        title: eventTitle.trim(),
        date: eventDate,
        category: 'penulisan',
        completed: false,
        time: eventTimeSlot,
      });
    }

    setIsModalOpen(false);
    setEditingEvent(null);
    setEventTitle('');
  };

  // Direct Delete
  const handleDeleteEvent = async (id: string) => {
    await deleteCalendarEvent(id);
    if (editingEvent?.id === id) {
      setIsModalOpen(false);
      setEditingEvent(null);
    }
  };

  // Events for selected date in right panel
  const activeDate = selectedCalendarDate || '2027-01-14';
  const selectedDateEvents = calendarEvents.filter((e) => e.date === activeDate);
  const isTodayActive = activeDate === '2027-01-14';

  const formatDisplayDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${day} ${MONTH_NAMES[monthIdx] || 'Januari'} ${parts[0]}`;
    }
    return dateStr;
  };

  const completedEventsCount = calendarEvents.filter((e) => e.completed).length;
  const totalEventsCount = calendarEvents.length;
  const progressPercent =
    totalEventsCount > 0 ? Math.round((completedEventsCount / totalEventsCount) * 100) : 0;

  // Events on the currently selected date in the modal
  const modalDateEvents = calendarEvents.filter((e) => e.date === eventDate);

  // Dynamic Mini-calendar inside modal
  const modalFirstDay = new Date(modalPickerYear, modalPickerMonth, 1).getDay();
  const modalStartOffset = (modalFirstDay + 6) % 7;
  const modalDaysInMonth = new Date(modalPickerYear, modalPickerMonth + 1, 0).getDate();
  const modalDaysInPrevMonth = new Date(modalPickerYear, modalPickerMonth, 0).getDate();

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-10 text-[#202923]">
      {/* 1. Page Header with Botanical Accent Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EDE6DC]/80 via-[#E8DFCE]/60 to-[#FAF8F5] border border-[#DDD5C5] px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Botanical watermark background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <svg className="absolute right-0 top-0 h-full w-56 opacity-10" viewBox="0 0 200 120" fill="none">
            <path d="M200 0 C 140 60, 160 100, 80 120 C 160 100, 210 50, 200 0 Z" fill="#315D47" />
          </svg>
          <svg className="absolute left-6 bottom-1 opacity-10 w-24 h-10" viewBox="0 0 80 40">
            {[0, 1, 2, 3, 4].map((i) =>
              [0, 1, 2].map((j) => (
                <circle key={`${i}-${j}`} cx={i * 18 + 4} cy={j * 14 + 4} r="2" fill="#315D47" />
              ))
            )}
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFE9] border border-[#D0E5D8] flex items-center justify-center shadow-xs text-[#315D47]">
              <CalendarIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202923]">
                  Academic Calendar
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-[#D5CDC0] text-[#315D47] shadow-2xs">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
              </div>
              <p className="font-serif italic text-[13px] text-[#77776F] mt-0.5">
                Kelola jadwal bimbingan, target penulisan draf, dan tenggat tugas terstruktur.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="relative z-10 flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-[#E0D8CC] text-xs font-medium text-[#202923] shadow-2xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#315D47]" />
            <span>{totalEventsCount} Agenda</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-[#E0D8CC] text-xs font-medium text-[#315D47] shadow-2xs backdrop-blur-xs">
            <Check className="w-3.5 h-3.5" />
            <span>{completedEventsCount} Selesai ({progressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* 2. 2-Column Balanced Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: Calendar Card (8 cols out of 12) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white rounded-3xl border border-[#ECE7DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Tricolor top accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#315D47] via-[#8DAA96] to-[#C8A27C] w-full" />

          <div className="p-5 flex flex-col flex-1">
            {/* Calendar Integrated Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3 border-b border-[#ECE7DF] gap-3">
              {/* Unlimited Month & Year Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-[#FAF8F5] p-0.5 rounded-xl border border-[#E2DBD0]">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg hover:bg-white text-[#555] transition-all cursor-pointer"
                    title="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg hover:bg-white text-[#555] transition-all cursor-pointer"
                    title="Bulan berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Month Dropdown */}
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                  className="bg-[#FAF8F5] border border-[#E2DBD0] text-[#1E2B22] font-serif font-bold text-sm sm:text-base px-2.5 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#315D47] hover:border-[#8DAA96] transition-colors"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={idx} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                  className="bg-[#FAF8F5] border border-[#E2DBD0] text-[#1E2B22] font-serif font-bold text-sm sm:text-base px-2.5 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#315D47] hover:border-[#8DAA96] transition-colors"
                >
                  {Array.from({ length: 15 }, (_, i) => 2020 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="text-[11px] font-semibold text-[#2F6144] bg-[#E8EFE9]/60 hover:bg-[#E8EFE9] px-2.5 py-1.5 rounded-xl border border-[#B7D7BC] transition-all cursor-pointer shadow-2xs"
                  title="Lompat ke tanggal hari ini"
                >
                  Hari Ini 📍
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#FAF8F5] p-0.5 rounded-full border border-[#E2DBD0] flex items-center text-xs">
                  {['Month', 'Week', 'Day'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCurrentView(v.toLowerCase() as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
                  type="button"
                  onClick={() => handleOpenAddModal(activeDate)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E2B22] text-white text-xs font-semibold hover:bg-[#315D47] shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8DAA96]" />
                  <span>+ Add Event</span>
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center font-semibold text-[11.5px] text-[#6B726B] py-1.5 bg-[#FAF8F5] rounded-xl mb-1 border border-[#ECE7DF]/70">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="py-0.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Dynamic Calendar Days Grid */}
            <div className="grid grid-cols-7 border-l border-t border-[#ECE7DF] rounded-xl overflow-hidden flex-1">
              {daysGrid.map((item, idx) => {
                const isSelected = selectedCalendarDate === item.dateStr;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCalendarDate(item.dateStr)}
                    onDoubleClick={() => handleOpenAddModal(item.dateStr)}
                    className={`min-h-[82px] p-1.5 border-r border-b border-[#ECE7DF] flex flex-col justify-between transition-colors cursor-pointer group ${
                      !item.isCurrentMonth
                        ? 'bg-[#FAF8F5]/40 text-[#A0988E]'
                        : isSelected
                        ? 'bg-[#E8EFE9]/60 ring-2 ring-inset ring-[#315D47]'
                        : 'bg-white hover:bg-[#FAF8F5]'
                    }`}
                    title="Klik untuk melihat agenda, klik 2x untuk menambah agenda"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[11px] font-mono rounded-full w-5 h-5 flex items-center justify-center ${
                          item.isToday
                            ? 'bg-[#315D47] text-white font-bold shadow-2xs'
                            : item.isCurrentMonth
                            ? 'text-[#1E2B22] font-semibold'
                            : 'text-[#A0988E]'
                        }`}
                      >
                        {item.day}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAddModal(item.dateStr);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#77776F] hover:text-[#1E2B22] hover:bg-[#EAE5DC] transition-all cursor-pointer"
                        title="Tambah agenda pada tanggal ini"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1 overflow-hidden mt-1 flex-1">
                      {item.events?.map((ev) => {
                        const style = getCategoryStyle(ev.category);
                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(ev);
                            }}
                            className={`text-[10px] px-1.5 py-0.5 rounded-md border truncate font-medium flex items-center justify-between group/pill ${style.bg} ${style.border} hover:shadow-xs transition-all cursor-pointer`}
                            title={`Klik untuk edit/hapus: ${ev.title} (${ev.time || 'Tanpa jam'})`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                              <span
                                className={`truncate ${
                                  ev.completed ? 'line-through text-[#7A827B]' : style.text
                                }`}
                              >
                                {ev.title}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(ev.id);
                              }}
                              title="Hapus agenda ini"
                              className="opacity-0 group-hover/pill:opacity-100 hover:text-red-700 transition-opacity p-0.5 shrink-0 ml-1 cursor-pointer"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Bottom Info */}
          <div className="px-5 py-3 border-t border-[#ECE7DF] bg-[#FAFAF9]/70 flex items-center justify-between text-xs text-[#6B726B]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span>Klik tanggal untuk melihat rincian agenda, klik 2x untuk menambah jadwal baru.</span>
            </span>
            <span className="font-mono font-semibold text-[#315D47]">{calendarEvents.length} total agenda</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Agenda Cards */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {/* Card 1: Selected Date Agenda / Today's Events */}
          <div className="bg-white rounded-3xl border border-[#ECE7DF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 relative overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#315D47] via-[#8DAA96] to-transparent absolute top-0 left-0 right-0" />

            <div className="flex items-center justify-between border-b border-[#ECE7DF] pb-2.5 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-[#8DAA96] uppercase tracking-wider">
                  {isTodayActive ? 'Hari Ini,' : 'Agenda Tanggal:'}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1E2B22]">
                  {formatDisplayDate(activeDate)}
                </h3>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[#8DAA96]/15 rounded-full blur-md pointer-events-none" />
                <PlantOnBooksIllustration className="w-14 h-11 relative z-10" />
              </div>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.map((ev) => {
                  const style = getCategoryStyle(ev.category);
                  return (
                    <div
                      key={ev.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        ev.completed
                          ? 'bg-[#FAF8F5] border-[#ECE7DF] text-[#7A827B]'
                          : 'bg-white border-[#ECE7DF] text-[#1E2B22] hover:border-[#8DAA96] hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleCalendarEvent(ev.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                            ev.completed
                              ? 'bg-[#315D47] text-white'
                              : 'border-2 border-[#C4BDB2] hover:border-[#315D47]'
                          }`}
                          title={ev.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
                        >
                          {ev.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        {/* Title & Time */}
                        <div className="min-w-0">
                          <p
                            className={`text-xs truncate ${
                              ev.completed
                                ? 'line-through text-[#7A827B]'
                                : 'font-semibold text-[#1E2B22]'
                            }`}
                          >
                            {ev.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {ev.time && (
                              <span className="text-[10px] text-[#7A827B] flex items-center gap-1 font-mono">
                                <Clock className="w-2.5 h-2.5" />
                                {ev.time}
                              </span>
                            )}
                            {ev.category && (
                              <span className={`text-[9.5px] px-1.5 py-0.2 rounded-md font-semibold ${style.bg} ${style.text}`}>
                                {ev.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions: Edit & Delete */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(ev)}
                          className="p-1 rounded-lg text-[#77776F] hover:text-[#1E2B22] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          title="Edit agenda"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1 rounded-lg text-[#A0988C] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-5 text-center space-y-2.5 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#E2DBD0] p-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E9E5DE] flex items-center justify-center text-lg mx-auto shadow-2xs">
                  🌱
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#202923]">
                    Belum Ada Agenda
                  </p>
                  <p className="text-[11px] text-[#7A827B] mt-0.5">
                    Tanggal {formatDisplayDate(activeDate)} masih kosong.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(activeDate)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DCD5CA] text-xs font-semibold text-[#315D47] hover:bg-[#FAF8F5] hover:border-[#315D47] transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Tambah Agenda</span>
                </button>
              </div>
            )}

            {selectedDateEvents.length > 0 && (
              <div className="pt-2 border-t border-[#ECE7DF] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(activeDate)}
                  className="text-xs font-semibold text-[#315D47] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah agenda pada tanggal ini</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 2: This Month Progress */}
          <div className="bg-white rounded-3xl border border-[#ECE7DF] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FBE8E5] flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-[#E05A47]" />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1E2B22]">
                  This Month Progress
                </h4>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#E8EFE9] text-[#315D47] border border-[#BCDAC8]">
                {progressPercent}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A827B]">
              <span>Progres Agenda Bulanan</span>
              <span className="font-semibold text-[#202923]">
                {completedEventsCount} dari {totalEventsCount} selesai
              </span>
            </div>

            <div className="w-full bg-[#ECE7DF] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#315D47] to-[#8DAA96] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Card 3: Upcoming Agenda / Deadlines */}
          <div className="bg-white rounded-3xl border border-[#ECE7DF] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECE7DF] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FAF3E8] flex items-center justify-center">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#C8A27C]" />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1E2B22]">
                  Upcoming Agendas
                </h4>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddModal()}
                className="text-xs font-semibold text-[#315D47] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>+ Baru</span>
              </button>
            </div>

            {calendarEvents.length > 0 ? (
              <div className="space-y-2">
                {calendarEvents.slice(0, 3).map((d) => {
                  const style = getCategoryStyle(d.category);
                  return (
                    <div
                      key={d.id}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF8F5] border border-[#E9E5DE]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
                        <span className="truncate text-[#1E2B22] font-semibold">{d.title}</span>
                      </div>
                      <span className="text-[10.5px] font-mono text-[#7A827B] shrink-0 ml-2">
                        {d.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#7A827B] py-3 text-center">
                Belum ada tenggat waktu mendatang.
              </p>
            )}
          </div>

          {/* Card 4: Cozy Cat Daily Focus Widget */}
          <div className="p-4 rounded-3xl border border-[#ECE7DF] bg-gradient-to-r from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] flex items-center gap-3.5 shadow-2xs">
            <div className="shrink-0 -ml-1">
              <CatOnBooksIllustration className="w-13 h-11" />
            </div>
            <div className="min-w-0">
              <p className="font-serif italic text-[11.5px] text-[#202923] leading-snug">
                &ldquo;Atur ritme harianmu dengan tenang. Konsistensi langkah kecil membawa pencapaian besar.&rdquo;
              </p>
              <span className="text-[10px] text-[#315D47] font-semibold mt-1 block">
                StudyFlow Calendar 🌿
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP PEMILIHAN TANGGAL & ADD/EDIT AGENDA MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DBD0] space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E2B22]">
                    {editingEvent ? 'Edit Agenda Kalender' : 'Pemilihan Tanggal & Agenda'}
                  </h3>
                  <p className="text-xs text-[#77776F]">
                    {editingEvent
                      ? 'Perbarui detail agenda atau hapus agenda ini'
                      : 'Tentukan tanggal dan judul kegiatan akademik Anda'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEvent(null);
                }}
                className="p-1.5 rounded-full text-[#8A928B] hover:bg-[#F2EFE9] hover:text-[#1E2B22] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Events on this date with instant DELETE BUTTON right in modal */}
            {modalDateEvents.length > 0 && !editingEvent && (
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE5DC] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1E2B22]">
                  <span>Agenda yang sudah ada pada tanggal ini ({modalDateEvents.length}):</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {modalDateEvents.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#ECE7DF] text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-[#2F6144] shrink-0" />
                        <span
                          className={`truncate font-medium ${
                            item.completed ? 'line-through text-[#7A827B]' : 'text-[#1E2B22]'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 rounded-md text-[#77776F] hover:text-[#1E2B22] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(item.id)}
                          className="p-1 px-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          title="Hapus agenda ini"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Interactive Calendar Date Picker Section */}
              <div className="space-y-2 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE5DC]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E2B22] flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#315D47]" />
                    <span>Pilih Tanggal Kegiatan:</span>
                    <span className="font-mono text-[#315D47] font-bold">
                      {formatDisplayDate(eventDate)}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDatePickerPopup(!showDatePickerPopup)}
                    className="text-[11px] font-medium text-[#2F6144] hover:underline cursor-pointer"
                  >
                    {showDatePickerPopup ? 'Sembunyikan Kalender' : '📅 Buka Kalender Mini'}
                  </button>
                </div>

                {/* Fully Dynamic Mini Calendar Inside Modal */}
                {showDatePickerPopup && (
                  <div className="bg-white p-2.5 rounded-xl border border-[#ECE7DF] shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1E2B22] px-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (modalPickerMonth === 0) {
                              setModalPickerMonth(11);
                              setModalPickerYear((y) => y - 1);
                            } else {
                              setModalPickerMonth((m) => m - 1);
                            }
                          }}
                          className="p-1 rounded hover:bg-[#FAF8F5] text-[#555]"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span>
                          {MONTH_NAMES[modalPickerMonth]} {modalPickerYear}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (modalPickerMonth === 11) {
                              setModalPickerMonth(0);
                              setModalPickerYear((y) => y + 1);
                            } else {
                              setModalPickerMonth((m) => m + 1);
                            }
                          }}
                          className="p-1 rounded hover:bg-[#FAF8F5] text-[#555]"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-[#7A827B]">
                        Klik tanggal untuk memilih
                      </span>
                    </div>

                    <div className="grid grid-cols-7 text-center text-[10px] font-medium text-[#7A827B] border-b border-[#ECE7DF] pb-1">
                      {['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'].map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {/* Trailing days of previous month */}
                      {Array.from({ length: modalStartOffset }, (_, i) => {
                        const day = modalDaysInPrevMonth - modalStartOffset + i + 1;
                        let prevM = modalPickerMonth - 1;
                        let prevY = modalPickerYear;
                        if (prevM < 0) {
                          prevM = 11;
                          prevY--;
                        }
                        const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(
                          day
                        ).padStart(2, '0')}`;
                        const isPicked = eventDate === dateStr;

                        return (
                          <button
                            key={`prev-${day}`}
                            type="button"
                            onClick={() => setEventDate(dateStr)}
                            className={`h-7 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer ${
                              isPicked
                                ? 'bg-[#1E2B22] text-white font-bold shadow-xs'
                                : 'text-[#A0988E] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}

                      {/* Current month days */}
                      {Array.from({ length: modalDaysInMonth }, (_, i) => {
                        const d = i + 1;
                        const dateStr = `${modalPickerYear}-${String(
                          modalPickerMonth + 1
                        ).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const isPicked = eventDate === dateStr;

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => setEventDate(dateStr)}
                            className={`h-7 rounded-lg text-[11px] font-mono transition-all flex items-center justify-center cursor-pointer ${
                              isPicked
                                ? 'bg-[#1E2B22] text-white font-bold ring-2 ring-[#315D47] shadow-xs'
                                : 'text-[#1E2B22] hover:bg-[#FAF8F5] border border-transparent'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Direct Native Date Input & Quick Chips */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => {
                      setEventDate(e.target.value);
                      const parts = e.target.value.split('-');
                      if (parts.length === 3) {
                        setModalPickerYear(parseInt(parts[0], 10));
                        setModalPickerMonth(parseInt(parts[1], 10) - 1);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#DCD5CA] text-xs font-mono bg-white focus:outline-hidden focus:border-[#315D47]"
                  />
                </div>
              </div>

              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Judul Agenda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bimbingan Bab I atau Revisi Metodologi..."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs focus:outline-hidden focus:border-[#315D47] focus:ring-1 focus:ring-[#315D47] transition-all"
                />
              </div>

              {/* Waktu / Jam */}
              <div>
                <label className="block text-xs font-semibold text-[#1E2B22] mb-1">
                  Waktu Pelaksanaan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 09:00 - 11:30 atau Sepanjang Hari"
                  value={eventTimeSlot}
                  onChange={(e) => setEventTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CA] text-xs focus:outline-hidden focus:border-[#315D47] transition-all"
                />
              </div>

              {/* Actions: Save, Cancel, and DELETE BUTTON */}
              <div className="pt-3 flex items-center justify-between gap-2.5 border-t border-[#ECE7DF]">
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    className="px-4 py-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Hapus agenda ini sekarang"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Agenda</span>
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingEvent(null);
                    }}
                    className="px-4 py-2 rounded-full border border-[#DCD5CA] text-[#77776F] hover:bg-[#F2EFE9] text-xs font-medium transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#1E2B22] hover:bg-[#315D47] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {editingEvent ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Simpan ke Kalender</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
