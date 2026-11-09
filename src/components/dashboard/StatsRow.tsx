'use client';

import React from 'react';
import { FileText, Edit3, Clock, Flame } from 'lucide-react';
import { useStore } from '@/store/useStore';

const statConfig = [
  {
    key: 'docs',
    title: 'Total Dokumen',
    icon: FileText,
    iconBg: 'bg-[#E8EFE9]',
    iconColor: 'text-[#315D47]',
    accentFrom: '#315D47',
    accentTo: '#8DAA96',
    barColor: 'bg-[#315D47]',
    dotColor: 'bg-[#8DAA96]',
    ring: 'ring-[#D0E5D8]',
  },
  {
    key: 'words',
    title: 'Total Kata',
    icon: Edit3,
    iconBg: 'bg-[#EDE6DC]',
    iconColor: 'text-[#C8A27C]',
    accentFrom: '#C8A27C',
    accentTo: '#E8D5B5',
    barColor: 'bg-[#C8A27C]',
    dotColor: 'bg-[#E8D5B5]',
    ring: 'ring-[#EBD9BC]',
  },
  {
    key: 'time',
    title: 'Waktu Produktif',
    icon: Clock,
    iconBg: 'bg-[#EEF0EE]',
    iconColor: 'text-[#77776F]',
    accentFrom: '#8DAA96',
    accentTo: '#BDD0C4',
    barColor: 'bg-[#8DAA96]',
    dotColor: 'bg-[#BDD0C4]',
    ring: 'ring-[#D0DED4]',
  },
  {
    key: 'tasks',
    title: 'Tugas Selesai',
    icon: Flame,
    iconBg: 'bg-[#FBE8E5]',
    iconColor: 'text-[#E05A47]',
    accentFrom: '#E05A47',
    accentTo: '#F2A99C',
    barColor: 'bg-[#E05A47]',
    dotColor: 'bg-[#F2BDB6]',
    ring: 'ring-[#F7CCC7]',
  },
];

export default function StatsRow() {
  const { documents, tasks } = useStore();

  const totalDocsCount = documents.length;
  const rawTotalWords = documents.reduce((sum, d) => sum + (d.wordCount || 0), 0);
  const totalWords =
    rawTotalWords >= 1000
      ? `${(rawTotalWords / 1000).toFixed(1)}k`
      : `${rawTotalWords}`;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const calculatedHours =
    completedTasksCount > 0 || rawTotalWords > 0
      ? Math.max(0.5, Math.round((completedTasksCount * 0.8 + Math.min(rawTotalWords / 250, 3)) * 10) / 10)
      : 0;

  const statValues = [
    {
      value: totalDocsCount.toString(),
      subLabel: totalDocsCount > 0 ? `${totalDocsCount} aktif` : 'Belum ada',
    },
    {
      value: totalWords || '0',
      subLabel: rawTotalWords > 0 ? 'Terus bertambah ✍️' : 'Target: 1.000 kata',
    },
    {
      value: `${calculatedHours}h`,
      subLabel: calculatedHours > 0 ? `${calculatedHours}h minggu ini` : 'Mulai sesi hari ini',
    },
    {
      value: completedTasksCount.toString(),
      subLabel: completedTasksCount > 0 ? `${completedTasksCount} selesai 🔥` : 'Yuk mulai!',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((cfg, i) => {
        const Icon = cfg.icon;
        const { value, subLabel } = statValues[i];

        return (
          <div
            key={cfg.key}
            className={`relative overflow-hidden bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#C8D8C8] transition-all group ring-2 ${cfg.ring} ring-offset-0`}
          >
            {/* Colored accent top bar */}
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(to right, ${cfg.accentFrom}, ${cfg.accentTo})` }}
            />

            {/* Decorative dot cluster (top-right) */}
            <div className="absolute top-3 right-3 opacity-20 pointer-events-none">
              <svg width="28" height="28">
                {[0, 1, 2].map(r =>
                  [0, 1, 2].map(c => (
                    <circle
                      key={`${r}-${c}`}
                      cx={c * 9 + 4}
                      cy={r * 9 + 4}
                      r="2"
                      fill={cfg.accentFrom}
                    />
                  ))
                )}
              </svg>
            </div>

            {/* Content */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs ring-2 ${cfg.ring}`}
                >
                  <Icon className={`w-5 h-5 ${cfg.iconColor}`} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10.5px] text-[#77776F] block font-medium truncate leading-none mb-0.5">
                    {cfg.title}
                  </span>
                  <span className="font-serif text-[22px] font-bold text-[#202923] block leading-tight">
                    {value}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block flex-shrink-0 text-right ml-2">
                <span className="text-[9.5px] font-medium px-2 py-0.5 rounded-full border text-[#77776F] inline-block leading-tight whitespace-nowrap"
                  style={{
                    borderColor: cfg.accentTo,
                    backgroundColor: `${cfg.accentTo}22`,
                    color: cfg.accentFrom,
                  }}>
                  {subLabel}
                </span>
              </div>
            </div>

            {/* Bottom mini sparkline / decorative bar */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-1">
                {[40, 60, 45, 75, 55, 80, 65].map((w, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-300 ${cfg.barColor} opacity-10 group-hover:opacity-25`}
                    style={{ height: '4px', opacity: `${0.08 + w / 400}` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}