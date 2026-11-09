'use client';

import React from 'react';
import { Sparkles, Quote, Leaf } from 'lucide-react';

export default function MotivationalQuoteBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EDE6DC] via-[#E5DACB] to-[#DDD0BE] border border-[#D5CBBE] shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between group hover:shadow-md transition-all">

      {/* === Rich Layered Botanical Background === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {/* Mountain silhouette */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-full opacity-15" viewBox="0 0 800 160" fill="none" preserveAspectRatio="none">
          <path d="M0 160 L150 60 L280 110 L420 30 L580 90 L720 40 L800 160 Z" fill="#202923" />
        </svg>
        {/* Top right large leaf */}
        <svg className="absolute top-0 right-0 w-40 h-40 opacity-12" viewBox="0 0 160 160" fill="#315D47">
          <path d="M160 0 C 100 50, 110 130, 50 160 C 120 130, 170 60, 160 0 Z" />
        </svg>
        {/* Bottom left mini leaf cluster */}
        <svg className="absolute bottom-4 left-6 w-16 h-16 opacity-15" viewBox="0 0 60 60" fill="#8DAA96">
          <path d="M10 50 C0 30, 20 5, 40 10 C45 25, 25 45, 10 50Z" />
          <path d="M25 55 C15 40, 30 10, 50 15 C55 30, 38 50, 25 55Z" opacity="0.6" />
        </svg>
        {/* Dot grid right center */}
        <svg className="absolute right-8 top-1/2 -translate-y-1/2 opacity-15" width="40" height="50">
          {[0,1,2,3].map(r => [0,1,2].map(c => (
            <circle key={`${r}-${c}`} cx={c * 12 + 4} cy={r * 12 + 4} r="2" fill="#315D47" />
          )))}
        </svg>
      </div>

      {/* Top badge */}
      <div className="relative z-10 p-5 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 border border-[#C8BBA8] text-[10.5px] font-semibold text-[#315D47] shadow-xs backdrop-blur-xs">
            <Leaf className="w-3 h-3 text-[#315D47]" />
            <span>Daily Academic Thought</span>
          </div>
          <Sparkles className="w-4 h-4 text-[#8DAA96]" />
        </div>

        {/* Quote */}
        <div className="flex items-start gap-3 my-2">
          <Quote className="w-7 h-7 text-[#315D47]/30 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-serif italic text-[15px] sm:text-[16px] text-[#202923] leading-relaxed">
              &ldquo;A better you starts with a focused mind. One paragraph, one idea, one page at a time.&rdquo;
            </p>
            <span className="font-serif text-[11.5px] text-[#77776F] mt-1.5 block">
              — StudyFlow Academic Wisdom
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-5 py-3 border-t border-[#CBBFA8]/50 mt-2 flex items-center justify-between text-[11px] text-[#77776F]">
        <span>Konsistensi adalah kunci</span>
        <span className="font-serif italic text-[#315D47] font-medium">Keep blooming 🌸</span>
      </div>
    </div>
  );
}