'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, FileText, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function ContinueWritingCard() {
  const { documents, setActiveDocumentId } = useStore();
  const currentDoc = documents[0];

  return (
    <div className="relative overflow-hidden bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:shadow-md transition-shadow min-h-[175px]">
      {/* Decorative organic background wave */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 350 200" fill="none" preserveAspectRatio="none">
          <path
            d="M-20 160 C 80 120, 150 180, 240 140 C 300 110, 360 160, 400 130 L 400 220 L -20 220 Z"
            fill="#DCE7DC"
          />
        </svg>
      </div>

      {/* Card Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <Link
          href="/writing"
          className="flex items-center gap-1.5 text-[15px] font-semibold text-[#202923] hover:text-[#315D47] transition-colors"
        >
          <span>Continue Writing</span>
          <ChevronRight className="w-4 h-4 text-[#77776F]" />
        </Link>
      </div>

      {currentDoc ? (
        /* Document Content Item */
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-20 rounded-xl bg-[#FAF8F5] border border-[#E9E5DE] p-2 flex flex-col justify-between shadow-xs flex-shrink-0">
            <FileText className="w-5 h-5 text-[#8DAA96]" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-[#E9E5DE] rounded-full" />
              <div className="w-3/4 h-1 bg-[#E9E5DE] rounded-full" />
              <div className="w-1/2 h-1 bg-[#E9E5DE] rounded-full" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h4 className="text-[14.5px] font-bold text-[#202923] leading-snug">
                {currentDoc.title}
              </h4>
              <p className="text-[11.5px] text-[#77776F] mt-0.5">
                {currentDoc.lastEdited || 'Baru saja'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-[#E9E5DE] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#315D47] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, currentDoc.progress || 10)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#77776F] block text-right">
                {currentDoc.progress || 10}%
              </span>
            </div>

            <Link
              href="/writing"
              onClick={() => setActiveDocumentId(currentDoc.id)}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#202923] text-[#FAF8F5] text-xs font-medium rounded-full hover:bg-[#315D47] transition-colors shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="relative z-10 py-3 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#8DAA96] mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#77776F]">Belum ada dokumen aktif.</p>
          <Link
            href="/writing"
            className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#202923] text-white text-xs font-medium rounded-full hover:bg-[#315D47] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mulai Tulis Dokumen</span>
          </Link>
        </div>
      )}
    </div>
  );
}
