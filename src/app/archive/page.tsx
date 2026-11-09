'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Archive as ArchiveIcon,
  FileText,
  PenLine,
  Folder,
  FolderOpen,
  CheckCircle2,
  LayoutGrid,
  List,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Calendar,
  Download,
  Trash2,
  RefreshCw,
  RotateCcw,
  UploadCloud,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

type FilterCategory = 'all' | 'writing' | 'projects' | 'completed';

interface FolderFileInfo {
  id: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
}

interface ArchiveCardItem {
  id: string;
  title: string;
  fileType: 'PDF' | 'DOCX' | 'FOLDER';
  category: 'Writing' | 'Projects' | 'Completed';
  dateLabel: string;
  originalId?: string;
  attachmentId?: string | null;
  fileSize?: number;
  fileCount?: number;
  files?: FolderFileInfo[];
}

function FileThumbnail({ type }: { type: 'PDF' | 'DOCX' | 'FOLDER' }) {
  if (type === 'FOLDER') {
    return (
      <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 44 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 drop-shadow-xs"
        >
          <path
            d="M4 8C4 5.79086 5.79086 4 8 4H17.5C19.1 4 20.5 4.9 21.2 6.3L22.5 9H36C38.2 9 40 10.8 40 13V32C40 34.2 38.2 36 36 36H8C5.8 36 4 34.2 4 32V8Z"
            fill="#E2B158"
          />
          <path
            d="M4 14C4 12.3431 5.34315 11 7 11H37C38.6569 11 40 12.3431 40 14V32C40 34.2091 38.2091 36 36 36H8C5.79086 36 4 34.2091 4 32V14Z"
            fill="#EDC16D"
          />
        </svg>
      </div>
    );
  }

  const isPDF = type === 'PDF';

  return (
    <div className="relative w-10 h-12 shrink-0">
      <div className="w-9 h-11.5 bg-white rounded-md border border-[#DCD5CA] shadow-2xs relative overflow-hidden flex flex-col pt-1.5 px-1.5">
        <div className="w-full h-0.5 bg-[#D9D3C7] rounded-full mb-1" />
        <div className="w-4/5 h-0.5 bg-[#E8E2D7] rounded-full mb-1" />
        <div className="w-full h-0.5 bg-[#E8E2D7] rounded-full mb-1" />
        <div className="w-3/5 h-0.5 bg-[#E8E2D7] rounded-full mb-1" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#EFECE6] border-b border-l border-[#DCD5CA] rounded-bl-xs" />
      </div>

      <div
        className={`absolute -bottom-1 -left-1 px-1 py-0.5 rounded-[3px] text-[8.5px] font-bold tracking-tight text-white shadow-2xs ${
          isPDF ? 'bg-[#DC3545]' : 'bg-[#2563EB]'
        }`}
      >
        {type}
      </div>
    </div>
  );
}

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<FilterCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('Newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [items, setItems] = useState<ArchiveCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedFolderModal, setSelectedFolderModal] = useState<ArchiveCardItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const fetchArchiveItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/archive?category=${activeTab}&sort=${sortOption.toLowerCase()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Error fetching archive items from MySQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchiveItems();
  }, [activeTab, sortOption]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'category',
        activeTab === 'projects' ? 'Projects' : activeTab === 'completed' ? 'Completed' : 'Writing'
      );

      const res = await fetch('/api/archive/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal mengunggah file.');
      }

      setUploadSuccess(`Berhasil mengunggah "${file.name}" ke arsip!`);
      setTimeout(() => setUploadSuccess(null), 3500);

      await fetchArchiveItems();
    } catch (err: any) {
      console.error('Error uploading file to archive:', err);
      setUploadError(err.message || 'Gagal mengunggah berkas.');
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const firstFile = fileList[0];
      const relPath = (firstFile as any).webkitRelativePath || firstFile.name;
      const folderName = relPath.includes('/') ? relPath.split('/')[0] : 'Folder Arsip Baru';

      const formData = new FormData();
      formData.append('folderName', folderName);
      formData.append(
        'category',
        activeTab === 'projects' ? 'Projects' : activeTab === 'completed' ? 'Completed' : 'Writing'
      );

      for (let i = 0; i < fileList.length; i++) {
        formData.append('files', fileList[i]);
      }

      const res = await fetch('/api/archive/upload-folder', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal mengunggah folder.');
      }

      setUploadSuccess(`Folder "${folderName}" (${fileList.length} berkas) berhasil diunggah ke arsip!`);
      setTimeout(() => setUploadSuccess(null), 4000);

      await fetchArchiveItems();
    } catch (err: any) {
      console.error('Error uploading folder to archive:', err);
      setUploadError(err.message || 'Gagal mengunggah folder.');
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setIsUploading(false);
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
      }
    }
  };

  const handleDownloadItem = (attachmentId: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `/api/attachments/${attachmentId}`;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMenuOpenId(null);
  };

  const handleAddNewFolder = async () => {
    const title = window.prompt('Nama Folder Arsip Baru:', 'Folder Arsip');
    if (!title) return;

    try {
      const res = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          fileType: 'FOLDER',
          category: activeTab === 'projects' ? 'Projects' : 'Writing',
        }),
      });
      if (res.ok) {
        fetchArchiveItems();
      }
    } catch (err) {
      console.error('Error creating archive folder:', err);
    }
    setShowAddMenu(false);
  };

  const handleRestoreItem = async (id: string) => {
    try {
      const res = await fetch(`/api/archive/${id}`, { method: 'POST' });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        alert('Item berhasil dipulihkan!');
      }
    } catch (err) {
      console.error('Error restoring archive item:', err);
    }
    setMenuOpenId(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus item ini secara permanen dari MySQL?')) return;
    try {
      const res = await fetch(`/api/archive/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      }
    } catch (err) {
      console.error('Error deleting archive item:', err);
    }
    setMenuOpenId(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-16 text-[#202923]">
      <div className="pointer-events-none absolute bottom-0 right-0 w-[580px] h-[380px] opacity-45 overflow-hidden z-0">
        <svg
          viewBox="0 0 580 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M580 140C480 140 400 240 290 240C180 240 100 310 0 380H580V140Z"
            fill="url(#paint0_linear_archive)"
          />
          <path
            d="M580 200C470 200 380 270 270 280C160 290 70 330 0 380H580V200Z"
            fill="url(#paint1_linear_archive)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_archive"
              x1="290"
              y1="140"
              x2="580"
              y2="380"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9EBAA5" stopOpacity="0.4" />
              <stop stopColor="#8DAA96" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_archive"
              x1="290"
              y1="200"
              x2="580"
              y2="380"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6C8D75" stopOpacity="0.35" />
              <stop stopColor="#4A6E55" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        {/* HEADER SECTION */}
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1E2B22] mt-0.5">
            <ArchiveIcon className="w-7 h-7 text-[#1E2B22]" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-serif text-3xl md:text-[34px] font-normal tracking-tight text-[#1E2B22] leading-none">
              Archive
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-[#5B655D] italic">
              Your academic documents, past projects, and completed works.
            </p>
          </div>
        </div>

        {/* CONTROLS BAR: CATEGORIES & ACTIONS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-[#1E2B22] text-white shadow-sm'
                  : 'bg-white text-[#4A534C] border border-[#E5E0D8] hover:border-[#1E2B22]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>All ({items.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('writing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'writing'
                  ? 'bg-[#1E2B22] text-white shadow-sm'
                  : 'bg-white text-[#4A534C] border border-[#E5E0D8] hover:border-[#1E2B22]'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Writing</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#1E2B22] text-white shadow-sm'
                  : 'bg-white text-[#4A534C] border border-[#E5E0D8] hover:border-[#1E2B22]'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === 'completed'
                  ? 'bg-[#1E2B22] text-white shadow-sm'
                  : 'bg-white text-[#4A534C] border border-[#E5E0D8] hover:border-[#1E2B22]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <div className="inline-flex items-center bg-[#ECE7DF]/60 p-1 rounded-xl border border-[#E2DBD0]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1E2B22] text-white shadow-2xs'
                    : 'text-[#6B726B] hover:text-[#1E2B22]'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#1E2B22] text-white shadow-2xs'
                    : 'text-[#6B726B] hover:text-[#1E2B22]'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="bg-white border border-[#E2DBD0] hover:border-[#8DAA96] px-3.5 py-2 rounded-full text-xs font-medium text-[#1E2B22] flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <span>{sortOption}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5B655D]" />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-[#E2DBD0] rounded-2xl shadow-lg py-1.5 z-30 text-xs">
                  {['Newest', 'Oldest'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortOption(opt);
                        setShowSortDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-[#F2EFE9] transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hidden Native File Input for Single/Multi File Selection */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.zip,.rar"
            />

            {/* Hidden Native Folder Input for Complete Directory Selection */}
            <input
              ref={folderInputRef}
              type="file"
              className="hidden"
              onChange={handleFolderUpload}
              {...({ webkitdirectory: '', directory: '', multiple: true } as any)}
            />

            <div className="relative flex items-center">
              {/* Primary Button: Direct click opens File Dialog immediately */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Pilih dan unggah berkas dari komputermu"
                className="bg-[#1E2B22] hover:bg-[#2C3F32] text-white pl-4 pr-3 py-2 rounded-l-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                {isUploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8DAA96]" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{isUploading ? 'Mengunggah...' : 'Upload / Add'}</span>
              </button>

              {/* Secondary Button: Dropdown for Folder or Manual Option */}
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="bg-[#1E2B22] hover:bg-[#2C3F32] text-white border-l border-white/20 px-2 py-2 rounded-r-full text-xs transition-all cursor-pointer"
                title="Pilihan upload lainnya (Folder / Berkas)"
              >
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#E2DBD0] rounded-2xl shadow-lg py-1.5 z-30 text-xs">
                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F2EFE9] text-[#1E2B22] font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-[#315D47]" />
                    <span>Unggah Berkas (File)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      folderInputRef.current?.click();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F2EFE9] text-[#1E2B22] font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Folder className="w-4 h-4 text-[#E2B158]" />
                    <span>Unggah Folder Lengkap</span>
                  </button>
                  <button
                    onClick={handleAddNewFolder}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F2EFE9] text-[#1E2B22] flex items-center gap-2 cursor-pointer border-t border-[#ECE7DF]/60 mt-1"
                  >
                    <FolderOpen className="w-4 h-4 text-[#8DAA96]" />
                    <span>Buat Folder Arsip Baru</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Status Banners */}
        {uploadSuccess && (
          <div className="bg-[#E8EFE9] border border-[#8DAA96] text-[#1E2B22] text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs transition-all">
            <CheckCircle2 className="w-4 h-4 text-[#315D47] shrink-0" />
            <span className="font-medium">{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs transition-all">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* ARCHIVE ITEMS GRID */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-[#ECE7DF] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] flex items-center justify-center text-[#8DAA96] mb-3">
              <ArchiveIcon className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#1E2B22]">
              Belum ada berkas diarsipkan
            </h3>
            <p className="text-xs text-[#7A827B] mt-1 max-w-sm">
              Dokumen, berkas tugas, atau satu folder riset penuh dapat disimpan di sini agar ruang kerja utamamu tetap rapi.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 rounded-full bg-[#1E2B22] text-white text-xs font-medium hover:bg-[#2C3F32] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>+ Unggah Berkas</span>
              </button>
              <button
                onClick={() => folderInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 rounded-full bg-white text-[#1E2B22] border border-[#DCD5CA] text-xs font-medium hover:bg-[#F4F1EA] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Folder className="w-3.5 h-3.5 text-[#E2B158]" />
                <span>+ Unggah Folder</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => {
              const isFolder = item.fileType === 'FOLDER';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:border-[#8DAA96] hover:shadow-md transition-all relative flex flex-col justify-between h-[126px] group"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div
                      onClick={() => {
                        if (isFolder) {
                          setSelectedFolderModal(item);
                        } else if (item.attachmentId) {
                          handleDownloadItem(item.attachmentId, item.title);
                        }
                      }}
                      className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                      title={
                        isFolder
                          ? 'Klik untuk melihat isi folder'
                          : item.attachmentId
                          ? 'Klik untuk mengunduh / membuka'
                          : undefined
                      }
                    >
                      <FileThumbnail type={item.fileType} />
                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="font-semibold text-[13px] text-[#1E2B22] leading-snug line-clamp-2 group-hover:text-[#315D47] transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="relative shrink-0">
                      <button
                        onClick={() =>
                          setMenuOpenId(menuOpenId === item.id ? null : item.id)
                        }
                        className="p-1 rounded-lg text-[#8A928B] hover:text-[#1E2B22] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {menuOpenId === item.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-[#E2DBD0] rounded-xl shadow-lg py-1 z-30 text-xs">
                          {isFolder ? (
                            <button
                              onClick={() => {
                                setSelectedFolderModal(item);
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#F2EFE9] flex items-center gap-2 text-[#1E2B22] cursor-pointer"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-[#E2B158]" />
                              <span>Buka Folder</span>
                            </button>
                          ) : item.attachmentId ? (
                            <button
                              onClick={() => handleDownloadItem(item.attachmentId!, item.title)}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#F2EFE9] flex items-center gap-2 text-[#1E2B22] cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-[#315D47]" />
                              <span>Unduh Berkas</span>
                            </button>
                          ) : null}

                          <button
                            onClick={() => handleRestoreItem(item.id)}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F2EFE9] flex items-center gap-2 text-[#1E2B22] cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#315D47]" />
                            <span>Pulihkan</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#7A827B] pl-0.5">
                    {isFolder ? (
                      <Folder className="w-3.5 h-3.5 text-[#E2B158] shrink-0" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5 text-[#8A928B] shrink-0" />
                    )}
                    <span className="truncate">{item.dateLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#ECE7DF] shadow-[0_2px_6px_rgba(0,0,0,0.02)] divide-y divide-[#ECE7DF]">
            {items.map((item) => {
              const isFolder = item.fileType === 'FOLDER';

              return (
                <div
                  key={item.id}
                  className="p-3.5 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
                >
                  <div
                    onClick={() => {
                      if (isFolder) {
                        setSelectedFolderModal(item);
                      } else if (item.attachmentId) {
                        handleDownloadItem(item.attachmentId, item.title);
                      }
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                    title={
                      isFolder
                        ? 'Klik untuk melihat isi folder'
                        : item.attachmentId
                        ? 'Klik untuk mengunduh / membuka'
                        : undefined
                    }
                  >
                    <FileThumbnail type={item.fileType} />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-[#1E2B22] truncate group-hover:text-[#315D47] transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#7A827B] mt-0.5">
                        {isFolder ? (
                          <Folder className="w-3 h-3 text-[#E2B158]" />
                        ) : (
                          <Calendar className="w-3 h-3 text-[#8A928B]" />
                        )}
                        <span>{item.dateLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isFolder ? (
                      <button
                        onClick={() => setSelectedFolderModal(item)}
                        className="p-1.5 text-[#E2B158] hover:bg-[#FAF3E8] rounded-lg transition-colors cursor-pointer"
                        title="Buka Folder"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                    ) : item.attachmentId ? (
                      <button
                        onClick={() => handleDownloadItem(item.attachmentId!, item.title)}
                        className="p-1.5 text-[#315D47] hover:bg-[#E8EFE9] rounded-lg transition-colors cursor-pointer"
                        title="Unduh Berkas"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleRestoreItem(item.id)}
                      className="p-1.5 text-[#315D47] hover:bg-[#E8EFE9] rounded-lg transition-colors cursor-pointer"
                      title="Pulihkan"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-[#8A928B] hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FOLDER CONTENT MODAL */}
        {selectedFolderModal && (
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DBD0] space-y-5 animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] border border-[#F0E4D2] flex items-center justify-center">
                    <Folder className="w-6 h-6 text-[#E2B158]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1E2B22]">
                      {selectedFolderModal.title}
                    </h2>
                    <p className="text-xs text-[#7A827B]">
                      {selectedFolderModal.files?.length || selectedFolderModal.fileCount || 0} berkas dalam folder ini
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFolderModal(null)}
                  className="p-1.5 rounded-full text-[#8A928B] hover:bg-[#F2EFE9] hover:text-[#1E2B22] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Files List Inside Folder */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-[#ECE7DF]/70">
                {selectedFolderModal.files && selectedFolderModal.files.length > 0 ? (
                  selectedFolderModal.files.map((file) => (
                    <div
                      key={file.id}
                      className="pt-2 pb-1 flex items-center justify-between gap-3 text-xs hover:bg-[#FAF8F5] p-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-[#315D47] shrink-0" />
                        <span className="font-medium text-[#1E2B22] truncate">
                          {file.originalName}
                        </span>
                        <span className="text-[10px] text-[#8A928B] shrink-0">
                          ({Math.round(file.fileSize / 1024)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadItem(file.id, file.originalName)}
                        className="px-2.5 py-1 rounded-lg bg-[#E8EFE9] hover:bg-[#DCE7DC] text-[#315D47] font-semibold text-[11px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-[#7A827B]">
                    Folder ini belum memiliki daftar berkas rincian.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-[#ECE7DF] flex items-center justify-between">
                <span className="text-xs text-[#7A827B]">
                  {selectedFolderModal.dateLabel}
                </span>
                <button
                  onClick={() => setSelectedFolderModal(null)}
                  className="px-4 py-2 rounded-full bg-[#1E2B22] text-white text-xs font-medium hover:bg-[#2C3F32] transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
