'use client';

import React, { useState } from 'react';
import WritingSidebar from '@/components/editor/WritingSidebar';
import TipTapEditor from '@/components/editor/TipTapEditor';
import WritingInsights from '@/components/editor/WritingInsights';
import { Feather, BookOpen, LayoutGrid, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function MyWritingPage() {
  const { addDocument } = useStore();
  const [activeTab, setActiveTab] = useState<'editor' | 'library'>('editor');
  const [focusMode, setFocusMode] = useState(false);

  const handleNewDocument = () => {
    const title = window.prompt('Judul Dokumen Baru:', 'Dokumen Baru');
    if (title && title.trim()) {
      addDocument({
        folderId: '',
        title: title.trim(),
        content: `<h2>${title.trim()}</h2><p>Mulai menulis draf Anda di sini...</p>`,
        progress: 0,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      {!focusMode && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-3xl font-bold text-[#202923]">
                My Writing
              </h1>
              {/* Botanical Leaf SVG */}
              <svg className="w-5 h-5 text-[#8DAA96]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5 19 5 19C5 19 14 16 16 7C17 2 17 2 17 8Z" />
              </svg>
            </div>
            <p className="font-serif italic text-[14px] text-[#77776F] mt-0.5">
              All your writing in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-[#FFFFFF] p-1 rounded-full border border-[#E9E5DE] flex items-center shadow-xs">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${
                  activeTab === 'editor'
                    ? 'bg-[#315D47] text-[#FFFFFF] shadow-xs'
                    : 'text-[#77776F] hover:text-[#202923]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${
                  activeTab === 'library'
                    ? 'bg-[#315D47] text-[#FFFFFF] shadow-xs'
                    : 'text-[#77776F] hover:text-[#202923]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Library</span>
              </button>
            </div>

            {/* New Document Button */}
            <button
              onClick={handleNewDocument}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#202923] text-[#FAF8F5] text-[13px] font-medium hover:bg-[#315D47] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#8DAA96]" />
              <span>New Document</span>
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Library */}
        {!focusMode && <WritingSidebar />}

        {/* Center TipTap Editor */}
        <TipTapEditor focusMode={focusMode} setFocusMode={setFocusMode} />

        {/* Right Insights */}
        {!focusMode && <WritingInsights />}
      </div>
    </div>
  );
}
