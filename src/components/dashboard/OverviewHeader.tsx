'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 15) return 'Good Afternoon';
  if (hour < 18) return 'Good Evening';
  return 'Good Night';
}

function getEmoji() {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️';
  if (hour < 15) return '🌤️';
  if (hour < 18) return '🌿';
  return '🌙';
}

export default function OverviewHeader() {
  const { user } = useStore();
  const greeting = useMemo(() => getGreeting(), []);
  const emoji = useMemo(() => getEmoji(), []);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Scholar';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EDE6DC] via-[#E8DFCE] to-[#F7F3EC] border border-[#DDD5C5] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">

      {/* === Layered Botanical Background Decorations === */}
      {/* Large bottom wave */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 900 120" fill="none" preserveAspectRatio="none">
          <path d="M0 80 C 200 120, 450 40, 700 90 C 820 110, 870 70, 900 80 L 900 120 L 0 120 Z" fill="#DCE7DC" opacity="0.5" />
        </svg>
        {/* Top right corner leaf */}
        <svg className="absolute top-0 right-0 w-56 h-56 opacity-10" viewBox="0 0 200 200" fill="#315D47">
          <path d="M200 0 C 140 60, 160 160, 80 200 C 160 180, 220 100, 200 0 Z" />
          <path d="M200 0 C 170 80, 200 150, 140 200 C 190 160, 210 80, 200 0 Z" opacity="0.5" />
        </svg>
        {/* Dot grid pattern — left center */}
        <svg className="absolute left-6 bottom-6 opacity-15" width="80" height="60">
          {[0,1,2,3].map(row =>
            [0,1,2,3,4].map(col => (
              <circle key={`${row}-${col}`} cx={col * 16 + 4} cy={row * 14 + 4} r="2" fill="#315D47" />
            ))
          )}
        </svg>
        {/* Small leaf mid-right */}
        <svg className="absolute right-72 bottom-4 w-14 h-14 opacity-20" viewBox="0 0 60 60" fill="#8DAA96">
          <path d="M30 55 C10 40, 5 15, 30 5 C55 15, 50 40, 30 55Z" />
        </svg>
      </div>

      {/* Left: Greeting + CTA Buttons */}
      <div className="relative z-10 flex-1 space-y-4">
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#CBBFA8] text-[11px] font-semibold text-[#315D47] shadow-sm backdrop-blur-xs">
          <span>🌿</span>
          <span>Ruang Belajar &amp; Penulisan Pribadi</span>
          <Sparkles className="w-3 h-3 text-[#8DAA96]" />
        </div>

        {/* Greeting Headline */}
        <div>
          <h1 className="font-serif text-[30px] sm:text-[38px] lg:text-[44px] tracking-tight text-[#202923] leading-tight">
            {greeting}, {emoji}
          </h1>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="font-serif text-[30px] sm:text-[38px] lg:text-[44px] tracking-tight text-[#315D47] leading-tight">
              {firstName}!
            </h1>
            <span className="font-serif italic text-[18px] text-[#8DAA96] font-light">♡</span>
          </div>
        </div>

        <p className="font-serif italic text-[14.5px] text-[#77776F]">
          Small progress is still progress. Keep going! ✨
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#202923] text-[#FAF8F5] text-[13px] font-semibold shadow-md hover:bg-[#315D47] transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5 text-[#8DAA96]" strokeWidth={2.5} />
            <span>+ New Document</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 border border-[#CBBFA8] text-[#202923] text-[12.5px] font-semibold hover:border-[#315D47] hover:bg-white transition-all backdrop-blur-xs shadow-sm"
          >
            <span>+ Proyek Baru</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Right: Aesthetic Desk & Plants Graphic */}
      <div className="relative z-10 w-full md:w-auto flex justify-center items-center flex-shrink-0">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8DAA96]/20 to-transparent blur-xl pointer-events-none" />
        <div className="relative w-72 sm:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#DDD6CC] via-[#EDE6DC] to-[#F5F0E8] border border-[#D5CBBE] shadow-[inset_0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between p-5">

          {/* Inner top-right soft gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FAF8F5]/60 to-transparent pointer-events-none" />

          {/* Framed Quote Artwork */}
          <div className="relative w-20 h-28 bg-[#FAF8F5] rounded-lg shadow-sm border border-[#E0D8CC] p-2 flex flex-col justify-center text-center z-10">
            {/* Tiny decorative border lines inside */}
            <div className="absolute inset-1 border border-[#E9E5DE] rounded-md opacity-50 pointer-events-none" />
            <span className="font-serif italic text-[9.5px] text-[#202923] leading-tight z-10 relative">
              Dream<br />Plan<br />Write<br />Achieve ♡
            </span>
          </div>

          {/* Plant & Books Graphic */}
          <div className="relative flex flex-col items-center z-10">
            <svg className="w-28 h-28 drop-shadow-sm" viewBox="0 0 100 100" fill="none">
              {/* Back leaves */}
              <path d="M50 45 Q30 20 15 28 Q35 40 48 48" fill="#4B7B5E" />
              <path d="M50 45 Q50 10 58 12 Q58 35 52 48" fill="#6A977B" />
              <path d="M50 45 Q75 18 85 30 Q65 42 54 48" fill="#3D684E" />
              {/* Front leaves */}
              <path d="M48 48 Q25 45 20 60 Q38 58 48 52" fill="#5A8868" />
              <path d="M52 48 Q78 45 82 58 Q65 58 52 52" fill="#7FA98C" />
              {/* White Ceramic Pot */}
              <path d="M38 52 L40 76 Q50 80 60 76 L62 52 Z" fill="#FFFFFF" stroke="#E0D8CC" strokeWidth="1" />
              {/* Pot rim shadow */}
              <ellipse cx="50" cy="52" rx="12" ry="2.5" fill="#3E342B" opacity="0.6" />
              {/* Pot highlight */}
              <path d="M42 55 L43 68" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
            {/* Stacked Books */}
            <div className="w-28 h-3 bg-[#8DAA96] rounded-sm shadow-sm -mt-2" />
            <div className="w-32 h-4 bg-[#FFFFFF] rounded-sm border border-[#E0D8CC] shadow-sm" />
            <div className="w-28 h-2.5 bg-[#DDD6CC] rounded-sm -mt-0.5 border border-[#D0C8BB]" />
          </div>

          {/* Background Monstera Leaf */}
          <div className="absolute right-2 top-0 bottom-0 w-20 pointer-events-none opacity-15 flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="#315D47" className="w-full h-full">
              <path d="M30 90 C10 60, 40 10, 80 10 C90 40, 70 85, 30 90 Z" />
              <path d="M50 85 C40 60, 60 25, 80 15" stroke="#8DAA96" strokeWidth="1.5" fill="none" opacity="0.4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}