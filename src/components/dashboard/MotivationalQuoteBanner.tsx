'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MotivationalQuoteBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EDE6DC] via-[#E2DACF] to-[#DDD4C5] border border-[#E9E5DE] p-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] min-h-[100px]">
      {/* Mountain Landscape Background silhouette */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg viewBox="0 0 800 120" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 120 L150 40 L280 90 L420 20 L580 80 L720 30 L800 120 Z" fill="#202923" />
        </svg>
      </div>

      {/* Quote Content */}
      <div className="relative z-10 flex items-center gap-4">
        <span className="font-serif text-4xl text-[#315D47]/40 leading-none select-none">
          “
        </span>
        <p className="font-serif italic text-base sm:text-lg text-[#202923] tracking-wide">
          A better you starts with a focused mind.
        </p>
      </div>

      {/* Sparkle icon on right */}
      <div className="relative z-10 text-[#8DAA96]">
        <Sparkles className="w-5 h-5 text-[#8DAA96]" />
      </div>
    </div>
  );
}
