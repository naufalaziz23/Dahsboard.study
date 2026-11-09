'use client';

import React from 'react';
import { FileText, Edit3, Clock, Flame } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function StatsRow() {
  const { documents, tasks } = useStore();

  const totalDocsCount = documents.length;
  const rawTotalWords = documents.reduce((sum, d) => sum + (d.wordCount || 0), 0);
  const totalWords =
    rawTotalWords >= 1000
      ? `${(rawTotalWords / 1000).toFixed(1)}k`
      : `${rawTotalWords}`;

  const productiveTime = '0h';
  const streak = '0 days';

  const stats = [
    {
      title: 'Total Documents',
      value: totalDocsCount.toString(),
      icon: FileText,
      iconBg: 'bg-[#E8EFE9]',
      iconColor: 'text-[#315D47]',
    },
    {
      title: 'Words Written',
      value: totalWords,
      icon: Edit3,
      iconBg: 'bg-[#EDE6DC]',
      iconColor: 'text-[#8DAA96]',
    },
    {
      title: 'Productive Time',
      value: productiveTime,
      icon: Clock,
      iconBg: 'bg-[#EFECE6]',
      iconColor: 'text-[#77776F]',
    },
    {
      title: 'Writing Streak',
      value: streak,
      icon: Flame,
      iconBg: 'bg-[#FBE8E5]',
      iconColor: 'text-[#E05A47]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E9E5DE] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div
              className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
            >
              <Icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={1.9} />
            </div>
            <div>
              <span className="text-xs text-[#77776F] block font-medium">
                {stat.title}
              </span>
              <span className="font-serif text-2xl font-bold text-[#202923] block leading-tight">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
