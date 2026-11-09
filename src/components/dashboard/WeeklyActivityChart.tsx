'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowRight } from 'lucide-react';

const emptyWeeklyData = [
  { day: 'Mon', hours: 0, label: '0h' },
  { day: 'Tue', hours: 0, label: '0h' },
  { day: 'Wed', hours: 0, label: '0h' },
  { day: 'Thu', hours: 0, label: '0h' },
  { day: 'Fri', hours: 0, label: '0h' },
  { day: 'Sat', hours: 0, label: '0h' },
  { day: 'Sun', hours: 0, label: '0h' },
];

export default function WeeklyActivityChart() {
  const [activeDay, setActiveDay] = useState<string>('Mon');
  const maxHours = 5;

  return (
    <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#E8EFE9] flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-[#315D47]" />
          </div>
          <h3 className="text-[14.5px] font-bold text-[#202923]">
            Weekly Activity
          </h3>
        </div>
        <Link
          href="/progress"
          className="text-[12px] text-[#77776F] hover:text-[#315D47] flex items-center gap-1 font-medium group transition-colors"
        >
          <span>Lihat Detail</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Chart Bars */}
      <div className="relative pt-6 pb-2">
        <div className="flex items-end justify-between gap-2 h-36 px-2">
          {emptyWeeklyData.map((item) => {
            const heightPercent = item.hours > 0 ? (item.hours / maxHours) * 100 : 8;
            const isSelected = activeDay === item.day;

            return (
              <div
                key={item.day}
                onClick={() => setActiveDay(item.day)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
              >
                {/* Bar */}
                <div className="w-full max-w-[28px] h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-300 ${
                      item.hours > 0
                        ? isSelected
                          ? 'bg-[#1E2B22]'
                          : 'bg-[#8DAA96] group-hover:bg-[#315D47]'
                        : 'bg-[#EAE5DC] group-hover:bg-[#D5CDC0]'
                    }`}
                  />
                </div>

                {/* Day label */}
                <div className="text-center">
                  <span
                    className={`text-[11.5px] font-mono block ${
                      isSelected ? 'font-bold text-[#202923]' : 'text-[#77776F]'
                    }`}
                  >
                    {item.day}
                  </span>
                  <span className="text-[10px] font-mono text-[#77776F]/80 block">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11.5px] text-[#77776F]">
        <span>Total Waktu: 0 jam</span>
        <span className="font-serif italic text-[#8DAA96]">Mulai fokus hari ini 🌿</span>
      </div>
    </div>
  );
}
