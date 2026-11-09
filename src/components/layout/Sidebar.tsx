'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PenLine,
  FolderKanban,
  CalendarDays,
  BarChart2,
  Archive,
  Settings,
  Sparkles,
} from 'lucide-react';
import { StudyFlowLogo, CatOnBooksIllustration, BotanicalBranch } from '@/components/shared/BotanicalAssets';
import { useStore } from '@/store/useStore';

const navItems = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'My Writing', href: '/writing', icon: PenLine },
  { name: 'My Projects', href: '/projects', icon: FolderKanban },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  { name: 'My Progress', href: '/progress', icon: BarChart2 },
  { name: 'Archive', href: '/archive', icon: Archive },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useStore();

  const getMotivationalMessage = () => {
    if (pathname.startsWith('/projects')) {
      return {
        quote: 'Progress on each project brings you closer to your goal. ✨',
        showCat: false,
      };
    }
    if (pathname.startsWith('/calendar')) {
      return {
        quote: 'Plan,\nwrite,\nfinish,\nrepeat. ✨',
        showCat: false,
      };
    }
    if (pathname.startsWith('/progress')) {
      return {
        quote: 'Consistency is the key\nto finishing your thesis. ✨',
        showCat: false,
      };
    }
    if (pathname.startsWith('/archive')) {
      return {
        quote: 'Every archived page is a milestone achieved. 🌿',
        showCat: false,
      };
    }
    return {
      quote: "Keep going!\nYou're doing great ✨",
      showCat: true,
    };
  };

  const motivation = getMotivationalMessage();

  return (
    <aside className="w-64 min-w-[16rem] bg-[#1E2B22] text-[#F7F6F2] flex flex-col justify-between h-screen sticky top-0 z-30 select-none border-r border-[#2C3D32]/50 shadow-md">
      {/* Top Logo and Navigation */}
      <div className="flex flex-col pt-6 px-4">
        {/* Brand Header */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 mb-8 group transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-[#315D47] flex items-center justify-center text-[#E8EFE9] shadow-sm">
            <StudyFlowLogo className="w-5 h-5 text-[#FAF8F5]" />
          </div>
          <span className="font-serif text-2xl tracking-wide text-[#FAF8F5]">
            StudyFlow
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#315D47]/65 text-[#FFFFFF] shadow-sm border border-[#8DAA96]/30'
                    : 'text-[#DCE7DC]/70 hover:text-[#FAF8F5] hover:bg-[#2B3B30]/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#DCE7DC]' : 'text-[#8DAA96]/80'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8DAA96]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Profile & Motivational Card */}
      <div className="p-4 flex flex-col gap-3">
        {/* User Card */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#26372B]/75 border border-[#8DAA96]/15 hover:border-[#8DAA96]/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#8DAA96]/40 bg-[#315D47] flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback avatar
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-[#FAF8F5]">
                {user.name}
              </span>
              <span className="text-[11px] text-[#8DAA96]">
                {user.role} • {user.university}
              </span>
            </div>
          </div>
          <button
            title="Settings"
            className="text-[#8DAA96]/80 hover:text-[#FAF8F5] p-1.5 rounded-lg hover:bg-[#315D47]/40 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Motivational Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#243529] to-[#1A261E] border border-[#8DAA96]/20 p-4 min-h-[140px] flex flex-col justify-between">
          {/* Subtle botanical backdrop */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-20">
            <BotanicalBranch className="w-24 h-36 text-[#8DAA96]" />
          </div>

          <div className="relative z-10">
            <p className="font-serif italic text-[13px] leading-snug text-[#E8EFE9]/90 whitespace-pre-line">
              {motivation.quote}
            </p>
          </div>

          {/* Interactive illustration */}
          <div className="relative z-10 mt-2 flex justify-center items-end">
            {motivation.showCat ? (
              <CatOnBooksIllustration className="w-28 h-20" />
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-[#8DAA96] mt-4 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-[#E8B86D]" />
                <span>One step at a time</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
