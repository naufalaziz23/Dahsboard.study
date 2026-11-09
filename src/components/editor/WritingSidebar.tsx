'use client';

import React, { useState } from 'react';
import {
  Folder,
  ChevronDown,
  ChevronRight,
  FileText,
  Plus,
  FolderPlus,
  Search,
  MoreVertical,
  Target,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function WritingSidebar() {
  const {
    folders,
    documents,
    activeDocumentId,
    setActiveDocumentId,
    addDocument,
    addFolder,
  } = useStore();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [filterQuery, setFilterQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const rawTotalWords = documents.reduce((sum, d) => sum + (d.wordCount || 0), 0);
  const targetWords = 5000;
  const progressPercent = Math.min(100, Math.round((rawTotalWords / targetWords) * 100));

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateDocument = (folderId?: string) => {
    const title = window.prompt('Judul Dokumen Baru:', 'Draft Dokumen');
    if (title) {
      addDocument({
        folderId: folderId || '',
        title,
        content: `<h2>${title}</h2><p>Mulai tulis di sini...</p>`,
        progress: 10,
      });
    }
  };

  const handleCreateFolder = () => {
    const name = window.prompt('Nama Folder Baru:');
    if (name && name.trim()) {
      addFolder(name.trim());
    }
  };

  return (
    <div className="w-64 min-w-[16rem] flex flex-col gap-4">
      {/* Document Library Box */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DE]">
          <h3 className="text-[14px] font-bold text-[#202923]">
            My Documents
          </h3>
          <div className="flex items-center gap-1 text-[#77776F]">
            <button
              onClick={handleCreateFolder}
              className="p-1 rounded-md hover:bg-[#F0EEE8] hover:text-[#202923] transition-colors cursor-pointer"
              title="Buat Folder Baru"
            >
              <FolderPlus className="w-4 h-4 text-[#315D47]" />
            </button>
            <button
              onClick={() => handleCreateDocument()}
              className="p-1 rounded-md hover:bg-[#F0EEE8] hover:text-[#202923] transition-colors cursor-pointer"
              title="Buat Dokumen Baru"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-1 rounded-md hover:bg-[#F0EEE8] hover:text-[#202923] transition-colors cursor-pointer"
              title="Cari file"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search input if toggled */}
        {showSearch && (
          <div className="pt-2">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Cari file..."
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#E9E5DE] focus:outline-none focus:ring-1 focus:ring-[#8DAA96]"
            />
          </div>
        )}

        {/* Folders List & Unfiled Documents */}
        <div className="mt-3 space-y-1 overflow-y-auto max-h-[380px]">
          {folders.length === 0 && documents.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-[#77776F]">Belum ada dokumen atau folder.</p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleCreateFolder}
                  className="text-xs text-[#315D47] font-semibold hover:underline cursor-pointer"
                >
                  + Buat Folder
                </button>
                <span className="text-[#A0988E]">•</span>
                <button
                  onClick={() => handleCreateDocument()}
                  className="text-xs text-[#315D47] font-semibold hover:underline cursor-pointer"
                >
                  + Buat Dokumen
                </button>
              </div>
            </div>
          ) : (
            <>
              {folders.map((folder) => {
                const isExpanded = !!expandedFolders[folder.id];
                const folderDocs = documents.filter(
                  (d) =>
                    d.folderId === folder.id &&
                    (filterQuery ? d.title.toLowerCase().includes(filterQuery.toLowerCase()) : true)
                );

                return (
                  <div key={folder.id} className="space-y-0.5">
                    {/* Folder Header Row */}
                    <div
                      onClick={() => toggleFolder(folder.id)}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#FAF8F5] cursor-pointer group text-[13px] text-[#202923] font-medium"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#77776F]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#77776F]" />
                        )}
                        <Folder className="w-4 h-4 text-[#315D47] flex-shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#77776F]">
                        <span className="font-mono">{folderDocs.length}</span>
                      </div>
                    </div>

                    {/* Sub-documents if expanded */}
                    {isExpanded && (
                      <div className="pl-6 space-y-1 py-1">
                        {folderDocs.map((doc) => {
                          const isActive = activeDocumentId === doc.id;
                          return (
                            <div
                              key={doc.id}
                              onClick={() => setActiveDocumentId(doc.id)}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12.5px] cursor-pointer transition-all ${
                                isActive
                                  ? 'bg-[#E8EFE9] text-[#315D47] font-semibold shadow-xs'
                                  : 'text-[#55554E] hover:bg-[#FAF8F5] hover:text-[#202923]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-[#315D47]' : 'text-[#8DAA96]'}`} />
                                <span className="truncate">{doc.title}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Unfiled documents */}
              {documents
                .filter((d) => !folders.some((f) => f.id === d.folderId))
                .map((doc) => {
                  const isActive = activeDocumentId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setActiveDocumentId(doc.id)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12.5px] cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#E8EFE9] text-[#315D47] font-semibold shadow-xs'
                          : 'text-[#55554E] hover:bg-[#FAF8F5] hover:text-[#202923]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-[#315D47]' : 'text-[#8DAA96]'}`} />
                        <span className="truncate">{doc.title}</span>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>

      {/* Writing Goals Card */}
      <div className="relative overflow-hidden bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Subtle Wave Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" viewBox="0 0 200 100" fill="none" preserveAspectRatio="none">
            <path d="M0 60 Q 60 90, 120 70 T 200 80 L 200 120 L 0 120 Z" fill="#8DAA96" />
          </svg>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#315D47]" />
              <span className="text-[13px] font-bold text-[#202923]">
                Writing Goals
              </span>
            </div>
            <span className="text-[11px] text-[#77776F]">This Week ⌵</span>
          </div>

          <div>
            <div className="flex justify-between items-center text-[12px] mb-1">
              <span className="text-[#77776F]">Target <strong className="text-[#202923]">5.000 kata</strong></span>
              <span className="font-mono font-bold text-[#315D47]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E8EFE9] overflow-hidden">
              <div
                className="h-full bg-[#315D47] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10.5px] font-mono text-[#77776F] mt-1.5">
              {rawTotalWords} / 5.000 kata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
