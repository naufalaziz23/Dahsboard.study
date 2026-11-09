'use client';

import React, { useState } from 'react';
import {
  BarChart2,
  ListTree,
  FileEdit,
  ChevronDown,
  ChevronRight,
  Plus,
  Clock,
  Type,
  AlignLeft,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function WritingInsights() {
  const { documents, activeDocumentId } = useStore();
  const currentDoc = documents.find((d) => d.id === activeDocumentId) || documents[0];

  const [activeHeading, setActiveHeading] = useState('A. Latar Belakang Masalah');
  const [outlineOpen, setOutlineOpen] = useState(true);
  const [notes, setNotes] = useState([
    'Tambahkan data Indikator Politik Indonesia.',
    'Perkuat research gap.',
    'Sesuaikan dengan catatan sempro.',
  ]);

  const handleAddNote = () => {
    const note = window.prompt('Tambah Catatan Baru:');
    if (note) setNotes([...notes, note]);
  };

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
          <span className="text-[11px] text-[#77776F] cursor-pointer">
            This Document ⌵
          </span>
        </div>

        <div className="pt-3 flex items-center gap-4">
          {/* Donut chart 75% */}
          <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
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
                strokeDashoffset={2 * Math.PI * 26 * (1 - (currentDoc?.progress || 75) / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute font-mono text-[13px] font-bold text-[#202923]">
              {currentDoc?.progress || 75}%
            </span>
          </div>

          {/* Metrics */}
          <div className="space-y-1.5 text-[12px] text-[#55554E] font-medium">
            <div className="flex items-center gap-2">
              <AlignLeft className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span className="font-mono font-semibold text-[#202923]">
                {currentDoc?.wordCount || 1254}
              </span>
              <span>kata</span>
            </div>
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span className="font-mono font-semibold text-[#202923]">
                {currentDoc?.charCount || 7892}
              </span>
              <span>karakter</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#8DAA96]" />
              <span>32 menit menulis</span>
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
          <button
            onClick={() => alert('Tambahkan heading di editor')}
            className="p-1 rounded-md hover:bg-[#F0EEE8] text-[#77776F]"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 space-y-1 text-[12.5px]">
          {/* Bab I with expanded items */}
          <div className="rounded-xl overflow-hidden">
            <div
              onClick={() => setOutlineOpen(!outlineOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#E8EFE9] text-[#315D47] font-semibold cursor-pointer"
            >
              {outlineOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              <span>Bab I Pendahuluan</span>
            </div>

            {outlineOpen && (
              <div className="pl-6 pr-2 py-2 space-y-2 text-[12px] text-[#55554E]">
                {[
                  'A. Latar Belakang Masalah',
                  'B. Rumusan Masalah',
                  'C. Tujuan Penelitian',
                  'D. Manfaat Penelitian',
                ].map((item) => {
                  const isCur = activeHeading === item;
                  return (
                    <div
                      key={item}
                      onClick={() => setActiveHeading(item)}
                      className="flex items-center gap-2 cursor-pointer hover:text-[#315D47] transition-colors"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isCur ? 'bg-[#315D47]' : 'border border-[#77776F]/60'
                        }`}
                      />
                      <span className={isCur ? 'font-medium text-[#202923]' : ''}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bab II & Bab III collapsed */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-[#55554E] hover:bg-[#FAF8F5] rounded-lg cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5 text-[#77776F]" />
            <span>Bab II Kajian Teori</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-[#55554E] hover:bg-[#FAF8F5] rounded-lg cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5 text-[#77776F]" />
            <span>Bab III Metode Penelitian</span>
          </div>
        </div>
      </div>

      {/* 3. Notes (Sticky Note styling) */}
      <div className="relative rounded-2xl border border-[#E9E5DE] p-4 bg-[#FAF7F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Soft folded corner illusion */}
        <div className="absolute right-0 bottom-0 w-5 h-5 bg-[#EDE6DC] border-t border-l border-[#D8D4CC] rounded-tl-md" />

        <div className="flex items-center justify-between pb-2 border-b border-[#E9E5DE]/80">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-[#315D47]" />
            <h4 className="text-[13.5px] font-bold text-[#202923]">Notes</h4>
          </div>
          <button
            onClick={handleAddNote}
            className="p-1 rounded-md hover:bg-[#EDE6DC] text-[#77776F]"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <ul className="mt-3 space-y-2 text-[12px] text-[#44443E] pl-3 list-disc">
          {notes.map((n, i) => (
            <li key={i} className="leading-relaxed">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
