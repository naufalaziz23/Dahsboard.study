'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  Calendar,
  CheckSquare,
  Clock,
  Feather,
  ChevronDown,
  Folder,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Target,
  Check,
  Sparkles,
  Flame,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { CatOnBooksIllustration, PlantOnBooksIllustration } from '@/components/shared/BotanicalAssets';

export default function MyProgressPage() {
  const { projects, tasks, toggleTask } = useStore();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'semester'>('month');
  const [metricTab, setMetricTab] = useState<'words' | 'time' | 'tasks'>('words');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All Projects');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  // Dynamic analytics state loaded from MySQL
  const [analytics, setAnalytics] = useState<any>({
    metrics: {
      wordsWritten: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      productiveHours: 0,
      streak: 0,
      overallProgress: 0,
      projectCounts: { completed: 0, inProgress: 0, planning: 0 },
    },
    projectProgress: [],
    weeklyActivity: [
      { week: 'W1', sub: 'Minggu 1', words: 0 },
      { week: 'W2', sub: 'Minggu 2', words: 0 },
      { week: 'W3', sub: 'Minggu 3', words: 0 },
      { week: 'W4', sub: 'Minggu 4', words: 0 },
    ],
  });

  const fetchAnalytics = () => {
    fetch('/api/analytics')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAnalytics(data);
        }
      })
      .catch((err) => console.error('Error fetching analytics:', err));
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter, tasks.length]);

  const metrics = analytics.metrics || {};
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const liveOverallProgress =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : (metrics.overallProgress || 0);

  const wordsDisplay =
    metrics.wordsWritten >= 1000
      ? `${(metrics.wordsWritten / 1000).toFixed(1)}k`
      : `${metrics.wordsWritten || 0}`;

  // Reactive chart data so AreaChart always displays live trends
  const chartData = React.useMemo(() => {
    const hasData = analytics.weeklyActivity?.some((d: any) => (d[metricTab] || 0) > 0);
    if (hasData) {
      return analytics.weeklyActivity;
    }
    const totalWords = metrics.wordsWritten || 0;
    const completed = completedTasksCount;
    const totalHours = metrics.productiveHours || (completed > 0 ? Math.ceil(completed * 0.8) : 0);

    return [
      { week: 'W1', sub: 'Minggu 1', words: Math.round(totalWords * 0.15), time: Math.round(totalHours * 0.2), tasks: Math.round(completed * 0.2) },
      { week: 'W2', sub: 'Minggu 2', words: Math.round(totalWords * 0.25), time: Math.round(totalHours * 0.3), tasks: Math.round(completed * 0.3) },
      { week: 'W3', sub: 'Minggu 3', words: Math.round(totalWords * 0.25), time: Math.round(totalHours * 0.25), tasks: Math.round(completed * 0.25) },
      { week: 'W4', sub: 'Minggu 4', words: totalWords, time: totalHours, tasks: completed },
    ];
  }, [analytics.weeklyActivity, metricTab, metrics, completedTasksCount]);

  const goalsList = tasks.slice(0, 4);

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-12 text-[#202923]">
      {/* Decorative subtle wavy contour background */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[340px] opacity-35 overflow-hidden z-0">
        <svg
          viewBox="0 0 500 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M500 120C420 120 360 210 260 210C160 210 90 280 0 340H500V120Z"
            fill="url(#paint0_linear_progress)"
          />
          <path
            d="M500 180C410 180 340 240 240 250C140 260 60 300 0 340H500V180Z"
            fill="url(#paint1_linear_progress)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_progress"
              x1="250"
              y1="120"
              x2="500"
              y2="340"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9EBAA5" stopOpacity="0.4" />
              <stop stopColor="#8DAA96" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_progress"
              x1="250"
              y1="180"
              x2="500"
              y2="340"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6C8D75" stopOpacity="0.35" />
              <stop stopColor="#4A6E55" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        {/* 1. HEADER SECTION with Botanical Accent Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EDE6DC]/85 via-[#E8DFCE]/60 to-[#FAF8F5] border border-[#DDD5C5] px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Watermark leaf pattern */}
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

          <div className="relative z-10 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] border border-[#D0E5D8] flex items-center justify-center text-[#315D47] shadow-xs mt-0.5">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#1E2B22]">
                  Academic Progress
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-[#D5CDC0] text-[#315D47] shadow-2xs">
                  {liveOverallProgress}% Selesai
                </span>
              </div>
              <p className="font-serif italic text-xs md:text-sm text-[#77776F] mt-0.5">
                Pantau produktivitas penulisan naskah, pencapaian target, dan progres proyek riset Anda.
              </p>
            </div>
          </div>

          {/* Right Filter Pills & Project Dropdown */}
          <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
            <div className="inline-flex items-center bg-white/80 p-0.5 rounded-full border border-[#E2DBD0] shadow-2xs backdrop-blur-xs">
              {(['week', 'month', 'semester'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setTimeFilter(filterKey)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                    timeFilter === filterKey
                      ? 'bg-[#1E2B22] text-white shadow-xs'
                      : 'text-[#6B726B] hover:text-[#1E2B22]'
                  }`}
                >
                  {filterKey === 'week' ? 'Minggu Ini' : filterKey === 'month' ? 'Bulan Ini' : 'Semester'}
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="bg-white/90 border border-[#E2DBD0] hover:border-[#8DAA96] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1E2B22] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <span>{selectedProjectFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5B655D]" />
              </button>

              {showProjectDropdown && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E2DBD0] rounded-2xl shadow-lg py-1.5 z-30 text-xs">
                  <button
                    onClick={() => {
                      setSelectedProjectFilter('All Projects');
                      setShowProjectDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F2EFE9] font-bold text-[#1E2B22] cursor-pointer"
                  >
                    Semua Proyek
                  </button>
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectFilter(proj.title);
                        setShowProjectDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#F2EFE9] text-[#5B655D] truncate cursor-pointer"
                    >
                      {proj.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. 4 STATS METRIC CARDS ROW with Botanical Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Words Written */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#8DAA96] transition-all group ring-2 ring-[#D0E5D8]/60">
            <div className="h-1 bg-gradient-to-r from-[#315D47] to-[#8DAA96] w-full" />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] flex items-center justify-center text-[#315D47] shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Feather className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#77776F] block font-medium">Kata Ditulis</span>
                  <span className="font-serif text-[24px] font-bold text-[#1E2B22] leading-tight block">
                    {wordsDisplay}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8EFE9] text-[#315D47] border border-[#BCDAC8]">
                Draf Aktif
              </span>
            </div>
            {/* Sparkline mini bar */}
            <div className="px-4 pb-3 flex items-center gap-1">
              {[45, 65, 55, 80, 70, 95, 85].map((w, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-full bg-[#315D47] transition-all"
                  style={{ height: '4px', opacity: 0.12 + w / 300 }}
                />
              ))}
            </div>
          </div>

          {/* Card 2: Tasks Completed */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#F2BDB6] transition-all group ring-2 ring-[#F7CCC7]/60">
            <div className="h-1 bg-gradient-to-r from-[#E05A47] to-[#F2A99C] w-full" />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FBE8E5] flex items-center justify-center text-[#E05A47] shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <CheckSquare className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#77776F] block font-medium">Tugas Selesai</span>
                  <span className="font-serif text-[24px] font-bold text-[#1E2B22] leading-tight block">
                    {metrics.tasksCompleted || 0}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FBE8E5] text-[#E05A47] border border-[#F2BDB6]">
                Target Terpenuhi
              </span>
            </div>
            {/* Sparkline mini bar */}
            <div className="px-4 pb-3 flex items-center gap-1">
              {[30, 50, 40, 70, 60, 85, 75].map((w, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-full bg-[#E05A47] transition-all"
                  style={{ height: '4px', opacity: 0.12 + w / 300 }}
                />
              ))}
            </div>
          </div>

          {/* Card 3: Productive Time */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#BDD0C4] transition-all group ring-2 ring-[#D0DED4]/60">
            <div className="h-1 bg-gradient-to-r from-[#8DAA96] to-[#BDD0C4] w-full" />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#EEF0EE] flex items-center justify-center text-[#315D47] shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Clock className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#77776F] block font-medium">Waktu Fokus</span>
                  <span className="font-serif text-[24px] font-bold text-[#1E2B22] leading-tight block">
                    {metrics.productiveHours || 0} Jam
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF0EE] text-[#55554E] border border-[#D5CDC0]">
                Sesi Belajar
              </span>
            </div>
            {/* Sparkline mini bar */}
            <div className="px-4 pb-3 flex items-center gap-1">
              {[40, 55, 50, 65, 60, 75, 80].map((w, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-full bg-[#8DAA96] transition-all"
                  style={{ height: '4px', opacity: 0.12 + w / 300 }}
                />
              ))}
            </div>
          </div>

          {/* Card 4: Writing Streak */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#E8D5B5] transition-all group ring-2 ring-[#EBD9BC]/60">
            <div className="h-1 bg-gradient-to-r from-[#C8A27C] to-[#E8D5B5] w-full" />
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] flex items-center justify-center text-[#C8A27C] shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Flame className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#77776F] block font-medium">Konsistensi Hari</span>
                  <span className="font-serif text-[24px] font-bold text-[#1E2B22] leading-tight block">
                    {metrics.streak || 0} Hari
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#C8A27C] border border-[#EBD9BC]">
                Semangat! 🔥
              </span>
            </div>
            {/* Sparkline mini bar */}
            <div className="px-4 pb-3 flex items-center gap-1">
              {[50, 60, 70, 75, 80, 85, 95].map((w, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-full bg-[#C8A27C] transition-all"
                  style={{ height: '4px', opacity: 0.12 + w / 300 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. MIDDLE SECTION: 3 COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT: WRITING ACTIVITY (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#ECE7DF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#315D47] via-[#8DAA96] to-transparent w-full" />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-base font-bold text-[#1E2B22]">
                    Aktivitas Penulisan
                  </h2>
                </div>

                <div className="inline-flex items-center bg-[#F4F1EA] p-0.5 rounded-full text-xs">
                  {(['words', 'time', 'tasks'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMetricTab(tab)}
                      className={`px-3 py-1 rounded-full capitalize font-semibold transition-all cursor-pointer ${
                        metricTab === tab
                          ? 'bg-[#1E2B22] text-white shadow-xs'
                          : 'text-[#6B726B] hover:text-[#1E2B22]'
                      }`}
                    >
                      {tab === 'words' ? 'Kata' : tab === 'time' ? 'Waktu' : 'Tugas'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-60 w-full pt-4 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 18, right: 15, left: -20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#315D47" stopOpacity={0.45} />
                        <stop offset="90%" stopColor="#8DAA96" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <YAxis
                      stroke="#8A928B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      tickFormatter={(val) =>
                        metricTab === 'words'
                          ? val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`
                          : metricTab === 'time'
                          ? `${val}h`
                          : `${val}`
                      }
                    />
                    <XAxis
                      dataKey="week"
                      stroke="#8A928B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const val = payload[0].value;
                          const unit =
                            metricTab === 'words'
                              ? 'kata'
                              : metricTab === 'time'
                              ? 'jam fokus'
                              : 'tugas selesai';
                          return (
                            <div className="bg-[#1E2B22] text-[#FAF8F5] px-3 py-1.5 rounded-xl text-xs shadow-md">
                              <span className="font-bold">{val} {unit}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="natural"
                      dataKey={metricTab}
                      stroke="#315D47"
                      strokeWidth={2.6}
                      fillOpacity={1}
                      fill="url(#activityGradient)"
                      dot={{
                        r: 3.5,
                        fill: '#315D47',
                        strokeWidth: 2,
                        stroke: '#FFFFFF',
                      }}
                      activeDot={{ r: 5, fill: '#1E2B22' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#ECE7DF] bg-[#FAFAF9]/70 flex items-center justify-between text-xs text-[#6B726B]">
              <span>Grafik akumulasi ritme penulisan mingguan</span>
              <span className="font-mono text-[#315D47] font-semibold">Tersinkron ✓</span>
            </div>
          </div>

          {/* CENTER: PROJECT PROGRESS (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#ECE7DF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#C8A27C] via-[#E8D5B5] to-transparent w-full" />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF3E8] flex items-center justify-center text-[#C8A27C]">
                    <Folder className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-base font-bold text-[#1E2B22]">
                    Progres Tiap Proyek
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-semibold text-[#315D47] hover:underline flex items-center gap-1 group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {projects.length > 0 ? (
                <div className="space-y-3.5 pt-1 flex-1">
                  {projects.map((proj, idx) => {
                    const icons = [GraduationCap, BookOpen, Briefcase, Users];
                    const Icon = icons[idx % icons.length];
                    const colors = [
                      'from-[#315D47] to-[#8DAA96]',
                      'from-[#C8A27C] to-[#E8D5B5]',
                      'from-[#32617A] to-[#8AACC4]',
                      'from-[#E05A47] to-[#F2A99C]',
                    ];
                    const gradient = colors[idx % colors.length];

                    return (
                      <div
                        key={proj.id}
                        className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E9E5DE] space-y-2 hover:border-[#8DAA96] transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-white border border-[#E0D8CC] flex items-center justify-center text-[#315D47] shrink-0 shadow-2xs">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="truncate text-xs font-bold text-[#1E2B22]">
                              {proj.title}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#315D47] shrink-0">
                            {proj.progress || 0}%
                          </span>
                        </div>

                        <div className="w-full bg-[#E5DFD5] h-2 rounded-full overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${gradient} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${proj.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#77776F] flex-1 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-1">🌱</span>
                  <span>Belum ada proyek aktif.</span>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#ECE7DF] bg-[#FAFAF9]/70 flex items-center justify-between text-xs text-[#6B726B]">
              <span>{projects.length} Proyek terdaftar</span>
              <span className="font-serif italic text-[#8DAA96]">Focus & Achieve 🌿</span>
            </div>
          </div>

          {/* RIGHT: OVERALL PROGRESS & GOALS (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Top: Overall Progress Donut */}
            <div className="bg-white rounded-3xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8EFE9] flex items-center justify-center text-[#315D47]">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-sm font-bold text-[#1E2B22]">
                  Total Progres Akademik
                </h2>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#ECE7DF]"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#315D47]"
                      strokeDasharray={`${liveOverallProgress}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-mono text-base font-bold text-[#1E2B22]">
                    {liveOverallProgress}%
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#4A534C]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#315D47] shrink-0" />
                    <span>{metrics.projectCounts?.completed || 0} Selesai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C8A27C] shrink-0" />
                    <span>{metrics.projectCounts?.inProgress || 0} Berjalan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A0988E] shrink-0" />
                    <span>{metrics.projectCounts?.planning || 0} Rencana</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Goals This Month & Cat Encouragement */}
            <div className="bg-white rounded-3xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2.5 border-b border-[#ECE7DF] pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#315D47]" />
                    <h2 className="font-serif text-sm font-bold text-[#1E2B22]">
                      Target Bulan Ini
                    </h2>
                  </div>
                  <Link
                    href="/projects"
                    className="text-xs font-semibold text-[#315D47] hover:underline flex items-center gap-0.5"
                  >
                    <span>Semua</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {goalsList.length > 0 ? (
                  <div className="space-y-2 pt-0.5">
                    {goalsList.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleTask(g.id)}
                        className="w-full flex items-center gap-2.5 text-left p-1.5 rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        {g.completed ? (
                          <div className="w-4.5 h-4.5 rounded-md bg-[#315D47] flex items-center justify-center text-white shrink-0 shadow-2xs">
                            <Check className="w-2.5 h-2.5" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-md border-2 border-[#C4BDB2] group-hover:border-[#315D47] shrink-0 transition-colors" />
                        )}
                        <span
                          className={`text-xs truncate ${
                            g.completed
                              ? 'line-through text-[#8A928B]'
                              : 'text-[#1E2B22] font-medium group-hover:text-[#315D47]'
                          }`}
                        >
                          {g.title}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#77776F] py-3 text-center">
                    Belum ada target tugas bulan ini.
                  </p>
                )}
              </div>

              {/* Cat Motivation Mini-Widget */}
              <div className="pt-2 border-t border-[#ECE7DF] flex items-center gap-3">
                <CatOnBooksIllustration className="w-12 h-10 shrink-0" />
                <p className="font-serif italic text-[10.5px] text-[#77776F] leading-tight">
                  &ldquo;Langkah kecil yang konsisten mengalahkan niat besar tanpa aksi.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}