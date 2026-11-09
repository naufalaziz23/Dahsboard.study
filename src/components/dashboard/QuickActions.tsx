'use client';

import React from 'react';
import Link from 'next/link';
import { PenLine, CalendarPlus, FolderOpen, TrendingUp, Zap } from 'lucide-react';
import { CatOnBooksIllustration } from '@/components/shared/BotanicalAssets';

export default function QuickActions() {
  const actions = [
    { label: 'New Doc', href: '/writing', icon: PenLine, color: 'text-[#315D47] bg-[#E8EFE9]' },
    { label: 'Add Task', href: '/projects', icon: CalendarPlus, color: 'text-[#8DAA96] bg-[#EDE6DC]' },
    { label: 'Open Files', href: '/archive', icon: FolderOpen, color: 'text-[#C8A27C] bg-[#FAF3E8]' },
    { label: 'Check Progress', href: '/progress', icon: TrendingUp, color: 'text-[#4B7B5E] bg-[#E8EFE9]' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E9E5DE] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      <div>
        {/* Header with Title and Cute Cat */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E2B22]">
            <div className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200/60 flex items-center justify-center">
              <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
            </div>
            <span>Quick Actions</span>
          </div>
          <div className="-mt-1 -mr-1">
            <CatOnBooksIllustration className="w-10 h-8" />
          </div>
        </div>

        {/* 2x2 Grid: Spacious, Uncluttered & Well-Aligned */}
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.label}
                href={act.href}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] hover:border-[#8DAA96] hover:bg-[#F2EFE9] transition-all group"
              >
                <div
                  className={`w-7 h-7 rounded-lg ${act.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                </div>
                <span className="text-[11.5px] font-semibold text-[#1E2B22] truncate">
                  {act.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-[#E9E5DE]/60 mt-3 text-[11px] text-[#77776F] flex items-center justify-between">
        <span>Akses cepat pintasan</span>
        <span className="text-[#315D47] font-medium">StudyFlow ⚡</span>
      </div>
    </div>
  );
}