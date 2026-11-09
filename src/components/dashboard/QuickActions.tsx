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
    <div className="bg-white rounded-2xl border border-[#ECE7DF] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Header with Title and Cute Cat in Top-Right */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E2B22]">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Quick Actions</span>
        </div>
        <div className="-mt-1 -mr-1">
          <CatOnBooksIllustration className="w-12 h-9" />
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
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] hover:border-[#8DAA96] hover:bg-[#F2EFE9] transition-all group"
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
  );
}
