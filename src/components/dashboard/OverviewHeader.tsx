'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function OverviewHeader() {
  const { user } = useStore();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#EDE6DC]/60 border border-[#E9E5DE] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {/* Botanical Organic Background Curves */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 900 240" fill="none" preserveAspectRatio="none">
          <path
            d="M0 180 C 300 240, 550 100, 900 160 L 900 240 L 0 240 Z"
            fill="#DCE7DC"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Left Text and CTA */}
      <div className="relative z-10 flex-1 space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] tracking-tight text-[#202923] leading-none">
          Good Morning,
          <br />
          <span className="inline-flex items-center gap-2">
            {user.name.split(' ')[0]}! <span className="font-sans font-light text-2xl text-[#315D47]">♡</span>
          </span>
        </h1>
        <p className="font-serif italic text-[15px] sm:text-base text-[#77776F]">
          Small progress is still progress.
        </p>

        <div className="pt-2">
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#202923] text-[#FAF8F5] text-[13.5px] font-medium shadow-sm hover:bg-[#315D47] transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#8DAA96]" strokeWidth={2.5} />
            <span>New Document</span>
          </Link>
        </div>
      </div>

      {/* Right Aesthetic Desk & Plants Graphic */}
      <div className="relative z-10 w-full md:w-auto flex justify-center items-center">
        <div className="relative w-72 sm:w-80 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-inner bg-gradient-to-tr from-[#DDD6CC] via-[#EDE6DC] to-[#FAF8F5] border border-[#FAF8F5]/60 flex items-center justify-between p-4">
          {/* Framed Quote Artwork */}
          <div className="w-20 h-24 bg-[#FAF8F5] rounded-md shadow-xs border border-[#E9E5DE] p-2 flex flex-col justify-center text-center">
            <span className="font-serif italic text-[10px] text-[#202923] leading-tight">
              Dream
              <br />
              Plan
              <br />
              Write
              <br />
              Achieve ♡
            </span>
          </div>

          {/* Plant & Books Desk Setup Graphic */}
          <div className="relative flex flex-col items-center">
            {/* Ceramic Pot with Foliage */}
            <div className="relative">
              <svg className="w-24 h-24 drop-shadow-sm" viewBox="0 0 100 100" fill="none">
                {/* Leaves */}
                <path d="M50 45 Q30 20 15 28 Q35 40 48 48" fill="#4B7B5E" />
                <path d="M50 45 Q50 10 58 12 Q58 35 52 48" fill="#6A977B" />
                <path d="M50 45 Q75 18 85 30 Q65 42 54 48" fill="#3D684E" />
                <path d="M48 48 Q25 45 20 60 Q38 58 48 52" fill="#5A8868" />
                <path d="M52 48 Q78 45 82 58 Q65 58 52 52" fill="#7FA98C" />
                {/* White Pot */}
                <path d="M38 52 L40 76 Q50 79 60 76 L62 52 Z" fill="#FFFFFF" stroke="#E2DED5" strokeWidth="1" />
                <ellipse cx="50" cy="52" rx="12" ry="2.5" fill="#3E342B" />
              </svg>
            </div>
            {/* Stacked Books underneath */}
            <div className="w-28 h-2.5 bg-[#8DAA96] rounded-xs shadow-xs -mt-2" />
            <div className="w-32 h-3.5 bg-[#FFFFFF] rounded-xs border border-[#E9E5DE] shadow-xs" />
          </div>

          {/* Background Monstera Leaf accent */}
          <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none opacity-25 flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="#315D47" className="w-full h-full">
              <path d="M30 90 C10 60, 40 10, 80 10 C90 40, 70 85, 30 90 Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
