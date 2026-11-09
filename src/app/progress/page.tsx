'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  Calendar,
  CheckSquare,
  Clock,
  Feather,
  ChevronDown,
  ArrowUp,
  Folder,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Target,
  Check,
  ArrowRight,
  Plus,
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
  }, [timeFilter]);

  const metrics = analytics.metrics || {};
  const wordsDisplay =
    metrics.wordsWritten >= 1000
      ? `${(metrics.wordsWritten / 1000).toFixed(1)}k`
      : `${metrics.wordsWritten || 0}`;

  const goalsList = tasks.slice(0, 4);

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-12 text-[#202923]">
      {/* Decorative subtle wavy contour background in bottom-right */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[340px] opacity-45 overflow-hidden z-0">
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
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1E2B22] mt-0.5">
              <BarChart2 className="w-7 h-7 text-[#1E2B22]" strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-[34px] font-normal tracking-tight text-[#1E2B22] leading-none">
                My Progress
              </h1>
              <p className="mt-1.5 text-xs md:text-sm text-[#5B655D] italic">
                Track your writing, tasks, and academic goals in one place.
              </p>
            </div>
          </div>

          {/* Right Filter Pills & Project Dropdown */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="inline-flex items-center bg-[#ECE7DF]/50 p-1 rounded-full border border-[#E4DDD2]">
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  timeFilter === 'week'
                    ? 'bg-[#1E2B22] text-white shadow-sm'
                    : 'text-[#4A534C] hover:text-[#1E2B22]'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  timeFilter === 'month'
                    ? 'bg-[#1E2B22] text-white shadow-sm'
                    : 'text-[#4A534C] hover:text-[#1E2B22]'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeFilter('semester')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  timeFilter === 'semester'
                    ? 'bg-[#1E2B22] text-white shadow-sm'
                    : 'text-[#4A534C] hover:text-[#1E2B22]'
                }`}
              >
                This Semester
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="bg-white border border-[#E2DBD0] hover:border-[#8DAA96] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1E2B22] flex items-center gap-1.5 shadow-xs transition-all"
              >
                <span>{selectedProjectFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5B655D]" />
              </button>

              {showProjectDropdown && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E2DBD0] rounded-2xl shadow-lg py-1.5 z-30 text-xs">
                  <button
                    onClick={() => {
                      setSelectedProjectFilter('All Projects');
                      setShowProjectDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F2EFE9] font-semibold text-[#1E2B22]"
                  >
                    All Projects
                  </button>
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectFilter(proj.title);
                        setShowProjectDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#F2EFE9] text-[#5B655D]"
                    >
                      {proj.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 STATS METRIC CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Words Written */}
          <div className="bg-white rounded-2xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1E2B22]">
              <Feather className="w-5 h-5 text-[#1E2B22]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-serif text-[26px] font-bold text-[#1E2B22] leading-tight">
                {wordsDisplay}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#6B726B]">Words Written</span>
              </div>
            </div>
          </div>

          {/* Card 2: Tasks Completed */}
          <div className="bg-white rounded-2xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1E2B22]">
              <CheckSquare className="w-5 h-5 text-[#1E2B22]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-serif text-[26px] font-bold text-[#1E2B22] leading-tight">
                {metrics.tasksCompleted || 0}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#6B726B]">Tasks Completed</span>
              </div>
            </div>
          </div>

          {/* Card 3: Productive Time */}
          <div className="bg-white rounded-2xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1E2B22]">
              <Clock className="w-5 h-5 text-[#1E2B22]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-serif text-[26px] font-bold text-[#1E2B22] leading-tight">
                {metrics.productiveHours || 0}h
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#6B726B]">Productive Time</span>
              </div>
            </div>
          </div>

          {/* Card 4: Writing Streak */}
          <div className="bg-white rounded-2xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1E2B22]">
              <Calendar className="w-5 h-5 text-[#1E2B22]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-serif text-[26px] font-bold text-[#1E2B22] leading-tight">
                {metrics.streak || 0} Days
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#6B726B]">Writing Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: 3 COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT: WRITING ACTIVITY (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#1E2B22]" />
                <h2 className="font-serif text-base font-semibold text-[#1E2B22]">
                  Writing Activity
                </h2>
              </div>

              <div className="inline-flex items-center bg-[#F4F1EA] p-0.5 rounded-full text-xs">
                {(['words', 'time', 'tasks'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMetricTab(tab)}
                    className={`px-3 py-1 rounded-full capitalize font-medium transition-all ${
                      metricTab === tab
                        ? 'bg-[#1E2B22] text-white shadow-xs'
                        : 'text-[#6B726B] hover:text-[#1E2B22]'
                    }`}
                  >
                    {tab === 'words' ? 'Words' : tab === 'time' ? 'Time' : 'Tasks'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-56 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.weeklyActivity}
                  margin={{ top: 18, right: 15, left: -25, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7DA289" stopOpacity={0.45} />
                      <stop offset="90%" stopColor="#8DAA96" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <YAxis
                    ticks={[0, 500, 1000, 2000]}
                    tickFormatter={(val) => (val === 0 ? '0' : `${val}`)}
                    stroke="#8A928B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
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
                        return (
                          <div className="bg-[#1E2B22] text-[#FAF8F5] px-2.5 py-1.5 rounded-xl text-[11px] shadow-md">
                            <span className="font-semibold">{payload[0].value} kata</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="words"
                    stroke="#2D4A3E"
                    strokeWidth={2.4}
                    fillOpacity={1}
                    fill="url(#activityGradient)"
                    dot={{
                      r: 3,
                      fill: '#2D4A3E',
                      strokeWidth: 2,
                      stroke: '#FFFFFF',
                    }}
                    activeDot={{ r: 5, fill: '#1E2B22' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CENTER: PROJECT PROGRESS (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-[#1E2B22]" />
                  <h2 className="font-serif text-base font-semibold text-[#1E2B22]">
                    Project Progress
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-medium text-[#1E2B22] hover:text-[#315D47] flex items-center gap-1 group"
                >
                  <span>See All</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>

              {projects.length > 0 ? (
                <div className="space-y-4 pt-1">
                  {projects.map((proj, idx) => {
                    const icons = [GraduationCap, BookOpen, Briefcase, Users];
                    const Icon = icons[idx % icons.length];
                    return (
                      <div key={proj.id} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1E2B22] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="w-32 truncate text-xs font-semibold text-[#1E2B22]">
                          {proj.title}
                        </div>
                        <div className="flex-1 bg-[#ECE7DF] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#2B4436] h-full rounded-full transition-all duration-500"
                            style={{ width: `${proj.progress || 0}%` }}
                          />
                        </div>
                        <div className="text-xs font-semibold text-[#1E2B22] w-8 text-right">
                          {proj.progress || 0}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#77776F]">
                  Belum ada proyek aktif.
                </div>
              )}
            </div>

            <div className="h-2" />
          </div>

          {/* RIGHT: 2 STACKED CARDS (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Top: Overall Progress */}
            <div className="bg-white rounded-2xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[#1E2B22]" />
                <h2 className="font-serif text-sm font-semibold text-[#1E2B22]">
                  Overall Progress
                </h2>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#ECE7DF]"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#2B4436]"
                      strokeDasharray={`${metrics.overallProgress || 0}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-serif text-base font-bold text-[#1E2B22]">
                    {metrics.overallProgress || 0}%
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#4A534C]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2B4436] shrink-0" />
                    <span>{metrics.projectCounts?.completed || 0} Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4A359] shrink-0" />
                    <span>{metrics.projectCounts?.inProgress || 0} In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C2BDB5] shrink-0" />
                    <span>{metrics.projectCounts?.planning || 0} Planning</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Goals This Month */}
            <div className="bg-white rounded-2xl p-4.5 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#1E2B22]" />
                    <h2 className="font-serif text-sm font-semibold text-[#1E2B22]">
                      Goals This Month
                    </h2>
                  </div>
                  <Link
                    href="/projects"
                    className="text-xs font-medium text-[#1E2B22] hover:text-[#315D47] flex items-center gap-0.5"
                  >
                    <span>See All</span>
                    <span>→</span>
                  </Link>
                </div>

                {goalsList.length > 0 ? (
                  <div className="space-y-2.5 pt-0.5">
                    {goalsList.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => toggleTask(g.id)}
                        className="w-full flex items-center gap-2.5 text-left group"
                      >
                        {g.completed ? (
                          <div className="w-4 h-4 rounded-full bg-[#2B4436] flex items-center justify-center text-white shrink-0">
                            <Check className="w-2.5 h-2.5" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-1.5 border-[#C4BDB2] group-hover:border-[#2B4436] shrink-0 transition-colors" />
                        )}
                        <span
                          className={`text-xs ${
                            g.completed
                              ? 'text-[#1E2B22] font-medium'
                              : 'text-[#6B726B] group-hover:text-[#1E2B22]'
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
