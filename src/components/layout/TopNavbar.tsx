'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Calendar, Check, X, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function TopNavbar() {
  const router = useRouter();
  const {
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearNotifications,
    documents,
    projects,
    tasks,
    setActiveDocumentId,
    setSelectedProjectId,
  } = useStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [headerDateText, setHeaderDateText] = useState('Hari ini');
  const [headerDateInput, setHeaderDateInput] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    setHeaderDateText(
      now.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setHeaderDateInput(`${yyyy}-${mm}-${dd}`);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter search results
  const searchResults = searchQuery.trim()
    ? {
        documents: documents.filter((d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        projects: projects.filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        tasks: tasks.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : null;

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-[#F7F6F2]/85 backdrop-blur-md px-8 py-3.5 flex items-center justify-between border-b border-[#E9E5DE]/80 transition-colors">
      {/* Search Input Bar */}
      <div ref={searchRef} className="relative w-full max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#77776F] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search your tasks, documents..."
            className="w-full bg-[#FFFFFF] text-[13.5px] text-[#202923] placeholder-[#77776F]/70 pl-11 pr-9 py-2.5 rounded-full border border-[#E9E5DE] shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#8DAA96]/40 focus:border-[#8DAA96] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 text-[#77776F] hover:text-[#202923]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchDropdown && searchResults && (
          <div className="absolute top-full left-0 mt-2 w-full bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-xl p-3 z-50 max-h-[380px] overflow-y-auto">
            {searchResults.documents.length === 0 &&
            searchResults.projects.length === 0 &&
            searchResults.tasks.length === 0 ? (
              <p className="text-center text-[13px] text-[#77776F] py-4">
                Tidak ada hasil untuk &quot;{searchQuery}&quot;
              </p>
            ) : (
              <div className="space-y-3">
                {searchResults.documents.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-[#8DAA96] uppercase tracking-wider px-2">
                      Dokumen
                    </span>
                    <div className="mt-1 space-y-1">
                      {searchResults.documents.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            setActiveDocumentId(d.id);
                            router.push('/writing');
                            setShowSearchDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F6F2] flex items-center justify-between text-[13px] text-[#202923] group transition-colors"
                        >
                          <span className="font-medium group-hover:text-[#315D47]">
                            {d.title}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#77776F] group-hover:text-[#315D47]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.projects.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-[#8DAA96] uppercase tracking-wider px-2">
                      Proyek
                    </span>
                    <div className="mt-1 space-y-1">
                      {searchResults.projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            router.push('/projects');
                            setShowSearchDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F6F2] flex items-center justify-between text-[13px] text-[#202923] group transition-colors"
                        >
                          <div>
                            <p className="font-medium group-hover:text-[#315D47]">
                              {p.title}
                            </p>
                            <p className="text-[11px] text-[#77776F] truncate max-w-xs">
                              {p.description}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#77776F] group-hover:text-[#315D47]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.tasks.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-[#8DAA96] uppercase tracking-wider px-2">
                      Tugas
                    </span>
                    <div className="mt-1 space-y-1">
                      {searchResults.tasks.map((t) => (
                        <div
                          key={t.id}
                          className="px-3 py-1.5 text-[12.5px] text-[#202923] flex items-center gap-2"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              t.completed ? 'bg-[#315D47]' : 'bg-[#E8B86D]'
                            }`}
                          />
                          <span className={t.completed ? 'line-through text-[#77776F]' : ''}>
                            {t.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Date Selector Badge & Popover */}
        <div ref={datePickerRef} className="relative hidden md:block">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 bg-[#FFFFFF] px-3.5 py-1.5 rounded-full border border-[#E9E5DE] text-[13px] text-[#202923] hover:border-[#8DAA96] transition-colors shadow-xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#315D47]" />
            <span className="font-medium">{headerDateText}</span>
            <span className="text-[10px] text-[#77776F]">▼</span>
          </button>

          {/* Date Picker Popover */}
          {showDatePicker && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E9E5DE] shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECE7DF]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#315D47]" />
                  <span className="text-xs font-bold text-[#1E2B22]">Pilih Tanggal</span>
                </div>
                <span className="text-[10px] text-[#77776F] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#ECE7DF]">
                  Hari Ini
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-[#77776F] mb-1 font-medium">
                  Cari atau lompat ke tanggal:
                </label>
                <input
                  type="date"
                  value={headerDateInput}
                  onChange={(e) => {
                    setHeaderDateInput(e.target.value);
                    if (e.target.value) {
                      setShowDatePicker(false);
                      router.push('/calendar');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] font-mono text-[#202923] focus:outline-hidden focus:border-[#315D47]"
                />
              </div>

              <div className="pt-2 border-t border-[#ECE7DF] flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowDatePicker(false);
                    router.push('/calendar');
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-[#1E2B22] hover:bg-[#315D47] text-white text-xs font-medium text-center transition-colors"
                >
                  Buka Kalender Akademik →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E9E5DE] flex items-center justify-center text-[#202923] hover:bg-[#F0EEE8] transition-colors relative shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#202923]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E05A47] ring-2 ring-[#FFFFFF]" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DE]">
                <h4 className="text-[14px] font-semibold text-[#202923]">
                  Notifikasi
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-[#315D47] hover:underline font-medium"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5 max-h-[280px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-[#77776F]">
                    <Bell className="w-6 h-6 mx-auto mb-1.5 opacity-30 text-[#202923]" />
                    <p className="text-xs font-medium">Belum ada notifikasi baru.</p>
                    <p className="text-[11px] opacity-75 mt-0.5">Semua agenda & tugas Anda sudah tercatat.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                        n.read
                          ? 'bg-[#F7F6F2]/50 hover:bg-[#F7F6F2]'
                          : 'bg-[#DCE7DC]/40 hover:bg-[#DCE7DC]/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[12.5px] font-semibold text-[#202923]">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#77776F] whitespace-nowrap">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#55554E] mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E9E5DE] flex items-center justify-center text-[#202923] hover:bg-[#F0EEE8] transition-colors shadow-xs"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-[#E8B86D]" />
          ) : (
            <Moon className="w-4 h-4 text-[#202923]" />
          )}
        </button>
      </div>
    </header>
  );
}
