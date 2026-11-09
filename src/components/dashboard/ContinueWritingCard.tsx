'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, FileText, Plus, PenLine } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function ContinueWritingCard() {
  const { documents, setActiveDocumentId } = useStore();
  const currentDoc = documents[0];

  return (
    <div className="relative overflow-hidden bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:shadow-lg hover:border-[#8DAA96] transition-all h-full min-h-[220px]">

      {/* === Botanical Visual Accents === */}
      {/* Gradient bottom-right wave */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <svg className="absolute bottom-0 left-0 right-0 w-full h-24" viewBox="0 0 400 100" preserveAspectRatio="none" fill="none">
          <path d="M0 70 C 100 40, 220 90, 400 50 L 400 100 L 0 100 Z" fill="#DCE7DC" opacity="0.35" />
        </svg>
        {/* Top-right mini leaf */}
        <svg className="absolute top-0 right-0 w-24 h-24 opacity-8" viewBox="0 0 100 100" fill="#315D47">
          <path d="M100 0 C 70 50, 80 90, 40 100 C 80 90, 110 50, 100 0 Z" opacity="0.07" />
        </svg>
        {/* Dot cluster bottom-left */}
        <svg className="absolute bottom-6 left-4 opacity-10" width="40" height="30">
          {[0,1].map(r => [0,1,2].map(c => (
            <circle key={`${r}-${c}`} cx={c * 12 + 4} cy={r * 12 + 4} r="2.5" fill="#315D47" />
          )))}
        </svg>
      </div>

      {/* Green top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#315D47] via-[#8DAA96] to-transparent w-full" />

      <div className="p-5 flex flex-col flex-1">
        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <Link
            href="/writing"
            className="flex items-center gap-2 text-[14.5px] font-bold text-[#202923] hover:text-[#315D47] transition-colors group/hdr"
          >
            <div className="w-7 h-7 rounded-lg bg-[#E8EFE9] flex items-center justify-center ring-2 ring-[#D0E5D8]">
              <PenLine className="w-3.5 h-3.5 text-[#315D47]" />
            </div>
            <span>Continue Writing</span>
            <ChevronRight className="w-4 h-4 text-[#77776F] group-hover/hdr:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/writing"
            className="text-[11.5px] text-[#77776F] hover:text-[#315D47] flex items-center gap-1 font-medium group transition-colors px-2 py-0.5 rounded-full hover:bg-[#F0F7F2]"
          >
            <span>Semua</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {currentDoc ? (
          <div className="relative z-10 flex items-start gap-3.5 flex-1">
            {/* Document thumbnail with shadow */}
            <div className="w-14 h-20 rounded-xl bg-gradient-to-b from-[#FAF8F5] to-[#F0EDE6] border border-[#E0D8CC] p-2 flex flex-col justify-between shadow-md flex-shrink-0 group-hover:shadow-lg transition-shadow">
              <FileText className="w-4 h-4 text-[#8DAA96]" />
              <div className="space-y-1">
                <div className="w-full h-1 bg-[#DDD8D0] rounded-full" />
                <div className="w-3/4 h-1 bg-[#DDD8D0] rounded-full" />
                <div className="w-1/2 h-1 bg-[#DDD8D0] rounded-full" />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2.5">
              <div>
                <h4 className="text-[14px] font-bold text-[#202923] leading-snug truncate">
                  {currentDoc.title || 'Dokumen Akademik'}
                </h4>
                <p className="text-[11px] text-[#77776F] mt-0.5 truncate">
                  {currentDoc.lastEdited || 'Baru saja'} · {currentDoc.wordCount || 0} kata
                </p>
              </div>

              {/* Progress with colored fill */}
              <div className="space-y-1">
                <div className="w-full bg-[#E9E5DE] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#315D47] to-[#8DAA96] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, currentDoc.progress || 10)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-[#77776F]">
                  <span>Progress</span>
                  <span className="font-mono font-semibold text-[#315D47]">{currentDoc.progress || 10}%</span>
                </div>
              </div>

              <Link
                href="/writing"
                onClick={() => setActiveDocumentId(currentDoc.id)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#202923] to-[#315D47] text-[#FAF8F5] text-xs font-semibold rounded-full hover:from-[#315D47] hover:to-[#4B7B5E] transition-all shadow-sm hover:shadow"
              >
                <span>Lanjutkan Menulis</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8EFE9] to-[#D0E5D8] border border-[#BCDBCA] flex items-center justify-center mb-3 shadow-sm">
              <FileText className="w-5 h-5 text-[#315D47]" />
            </div>
            <h4 className="text-[13.5px] font-bold text-[#202923]">Belum Ada Dokumen</h4>
            <p className="text-[11px] text-[#77776F] mt-1 max-w-[200px]">
              Mulai buat draf bab pertama atau catatan bimbingan.
            </p>
            <Link
              href="/writing"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#202923] text-white text-xs font-semibold rounded-full hover:bg-[#315D47] transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span>+ Mulai Menulis</span>
            </Link>
          </div>
        )}
      </div>

      <div className="relative z-10 px-5 py-3 border-t border-[#E9E5DE]/60 flex items-center justify-between text-[11px] text-[#77776F] bg-[#FAFAF9]/70">
        <span>{currentDoc ? `${currentDoc.wordCount || 0} kata tersimpan` : 'Draf siap ditulis'}</span>
        <span className="font-serif italic text-[#8DAA96]">Tulis perlahan ✍️</span>
      </div>
    </div>
  );
}