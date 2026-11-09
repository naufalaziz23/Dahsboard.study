'use client';

import React, { useState } from 'react';
import {
  BarChart2,
  ListTree,
  FileEdit,
  Plus,
  Clock,
  Type,
  AlignLeft,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function WritingInsights() {
  const { documents, activeDocumentId } = useStore();
  const currentDoc = documents.find((d) => d.id === activeDocumentId) || documents[0];

  const [notes, setNotes] = useState<string[]>([]);

  const handleAddNote = () => {
    const note = window.prompt('Tambah Catatan Baru:');
    if (note && note.trim()) setNotes([...notes, note.trim()]);
  };

  const docWords = currentDoc?.wordCount || 0;
  const docChars = currentDoc?.charCount || 0;
  const docProgress = currentDoc?.progress || (docWords > 0 ? Math.min(100, Math.round((docWords / 1000) * 100)) : 0);
  const readingTimeMin = Math.max(1, Math.ceil(docWords / 200));

  // Extract real outline dynamically from currentDoc HTML content
  const extractHeadings = (htmlContent: string) => {
    if (!htmlContent) return [];
    const regex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
    const headings: { level: number; text: string }[] = [];
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
      const level = parseInt(match[1], 10);
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        headings.push({ level, text });
      }
    }
    return headings;
  };

  const docHeadings = extractHeadings(currentDoc?.content || '');

  return (
    <div className="w-72 min-w-[17rem] flex flex-col gap-4">
      {/* 1. Writing Stats */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DE]">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#315D47]" />
            <h4 className="text-[13.5px] font-bold text-[#202923]">
              Writing Stats
            </h4>
          </div>
          <span className="text-[11px] text-[#77776F]">
            Dokumen Aktif
          </span>
        </div>

        <div className="pt-3 flex items-center gap-4">
          {/* Donut chart */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#E5E0D8"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#315D47"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - docProgress / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute font-mono text-[13px] font-bold text-[#202923]">
              {docProgress}%
            </span>
          </div>

          {/* Metrics */}
          <div className="space-y-1.5 text-[12px] text-[#55554E] font-medium">
            <div className="flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span className="font-mono font-semibold text-[#202923]">
                {docWords}
              </span>
              <span>kata</span>
            </div>
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span className="font-mono font-semibold text-[#202923]">
                {docChars}
              </span>
              <span>karakter</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span>~{readingTimeMin} mnt baca</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Document Outline */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DE]">
          <div className="flex items-center gap-2">
            <ListTree className="w-4 h-4 text-[#315D47]" />
            <h4 className="text-[13.5px] font-bold text-[#202923]">
              Document Outline
            </h4>
          </div>
          <span className="text-[10px] text-[#77776F] font-mono">
            {docHeadings.length} sub-bab
          </span>
        </div>

        <div className="mt-3 space-y-1 text-[12.5px]">
          {docHeadings.length > 0 ? (
            <div className="space-y-1">
              {docHeadings.map((h, i) => (
                <div
                  key={i}
                  style={{ paddingLeft: `${(h.level - 1) * 10}px` }}
                  className="flex items-center gap-2 py-1 text-[12px] text-[#202923] hover:text-[#315D47] transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#315D47] shrink-0" />
                  <span className="truncate">{h.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#77776F] py-3 text-center">
              Belum ada heading pada dokumen ini. Gunakan Heading 1, 2, atau 3 pada editor untuk melihat outline.
            </p>
          )}
        </div>
      </div>

      {/* 3. Notes (Sticky Note styling) */}
      <div className="relative rounded-2xl border border-[#E9E5DE] p-4 bg-[#FAF7F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="absolute right-0 bottom-0 w-5 h-5 bg-[#EDE6DC] border-t border-l border-[#D8D4CC] rounded-tl-md" />

        <div className="flex items-center justify-between pb-2 border-b border-[#E9E5DE]/80">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-[#315D47]" />
            <h4 className="text-[13.5px] font-bold text-[#202923]">Notes</h4>
          </div>
          <button
            type="button"
            onClick={handleAddNote}
            className="p-1 rounded-md hover:bg-[#EDE6DC] text-[#77776F] cursor-pointer"
            title="Tambah Catatan"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {notes.length > 0 ? (
          <ul className="mt-3 space-y-2 text-[12px] text-[#44443E] pl-3 list-disc">
            {notes.map((n, i) => (
              <li key={i} className="leading-relaxed">
                {n}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#77776F] py-3 text-center">
            Belum ada catatan riset. Klik + untuk membuat catatan tempel baru.
          </p>
        )}
      </div>
    </div>
  );
}
