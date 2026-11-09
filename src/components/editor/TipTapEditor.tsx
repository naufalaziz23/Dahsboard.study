'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  CloudCheck,
  Maximize2,
  Minimize2,
  RotateCcw,
  MoreHorizontal,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TipTapEditor({
  focusMode,
  setFocusMode,
}: {
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;
}) {
  const { documents, activeDocumentId, updateDocument } = useStore();
  const currentDoc = documents.find((d) => d.id === activeDocumentId) || documents[0];

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [docTitle, setDocTitle] = useState(currentDoc ? currentDoc.title : 'Bab I – Pendahuluan');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef<boolean>(false);

  // Perform debounced save to MySQL
  const triggerAutosave = (content: string, titleText: string, words: number, chars: number) => {
    if (!currentDoc?.id) return;

    setSaveStatus('saving');

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      try {
        const res = await fetch(`/api/documents/${currentDoc.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: titleText,
            content,
            wordCount: words,
            characterCount: chars,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setSaveStatus('saved');
          setLastSavedTime(
            new Date(data.lastSaved).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })
          );
          updateDocument(currentDoc.id, {
            title: titleText,
            content,
            wordCount: words,
            charCount: chars,
          });
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      } finally {
        isSavingRef.current = false;
      }
    }, 700);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Mulai menulis tugas akademik atau skripsi Anda di sini...',
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: currentDoc?.content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;

      triggerAutosave(html, docTitle, words, chars);
    },
  });

  // Load document content whenever active document changes from database
  useEffect(() => {
    if (currentDoc) {
      setDocTitle(currentDoc.title);
      // Fetch full content from MySQL if not yet loaded or on switch
      fetch(`/api/documents/${currentDoc.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.document && editor) {
            if (editor.getHTML() !== data.document.content) {
              editor.commands.setContent(data.document.content);
            }
            setDocTitle(data.document.title);
          }
        })
        .catch(() => {
          if (editor && currentDoc.content) {
            editor.commands.setContent(currentDoc.content);
          }
        });
    }
  }, [activeDocumentId, currentDoc?.id, editor]);

  if (!editor) {
    return (
      <div className="flex-1 bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] p-8 min-h-[500px] flex items-center justify-center">
        <span className="text-[#8DAA96] animate-pulse">Memuat Editor StudyFlow...</span>
      </div>
    );
  }

  const wordCount = currentDoc?.wordCount || 0;
  const charCount = currentDoc?.charCount || 0;

  return (
    <div
      className={`flex-1 flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#E9E5DE] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300 ${
        focusMode ? 'fixed inset-4 z-50 shadow-2xl' : ''
      }`}
    >
      {/* Document Top Bar */}
      <div className="px-6 py-3.5 border-b border-[#E9E5DE] flex items-center justify-between gap-4 bg-[#FAF8F5]/60">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={docTitle}
            onChange={(e) => {
              const val = e.target.value;
              setDocTitle(val);
              if (editor) {
                triggerAutosave(editor.getHTML(), val, wordCount, charCount);
              }
            }}
            className="font-serif text-lg sm:text-xl font-bold text-[#202923] bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
            placeholder="Judul Dokumen..."
          />
          <div className="flex items-center gap-2 text-[11px] text-[#77776F] mt-0.5">
            <span>{currentDoc?.folderName || 'Skripsi'}</span>
            <span>•</span>
            <span>Tersimpan {lastSavedTime}</span>
            <span>•</span>
            <span
              className={`flex items-center gap-1 font-medium ${
                saveStatus === 'saved'
                  ? 'text-[#315D47]'
                  : saveStatus === 'saving'
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Menyimpan ke MySQL...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-3 h-3 text-[#315D47]" />
                  <span>Tersimpan di MySQL</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span>Gagal menyimpan</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-1 text-[#77776F]">
          <button
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg hover:bg-[#EAE6DE] hover:text-[#202923] transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            onClick={() => setFocusMode(!focusMode)}
            className="p-1.5 rounded-lg hover:bg-[#EAE6DE] hover:text-[#202923] transition-colors"
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            title="Options"
            className="p-1.5 rounded-lg hover:bg-[#EAE6DE] hover:text-[#202923] transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formatting Ribbon / Toolbar */}
      <div className="px-6 py-2 border-b border-[#E9E5DE] flex items-center justify-between gap-4 bg-[#FFFFFF] flex-wrap text-xs select-none">
        {/* Formatting groups */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {/* Headings */}
          <div className="flex items-center border-r border-[#E9E5DE] pr-2 mr-1 gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 py-1 rounded text-xs font-serif font-bold transition-colors ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded text-xs font-serif font-bold transition-colors ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 rounded text-xs font-serif font-bold transition-colors ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
            >
              H3
            </button>
          </div>

          {/* Basic Inline styles */}
          <div className="flex items-center border-r border-[#E9E5DE] pr-2 mr-1 gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('bold')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('italic')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('underline')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('strike')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center border-r border-[#E9E5DE] pr-2 mr-1 gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('bulletList')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Bullet list"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('orderedList')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Numbered list"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('blockquote')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Quote / Sitasi"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded transition-colors ${
                editor.isActive('codeBlock')
                  ? 'bg-[#315D47] text-[#FAF8F5]'
                  : 'text-[#555] hover:bg-[#F2EFE9]'
              }`}
              title="Code / Rumus"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2 text-[#77776F]">
          <span className="text-[11px]">Zoom</span>
          <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E9E5DE] rounded-lg px-2 py-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="text-[#202923] hover:font-bold px-1"
            >
              -
            </button>
            <span className="text-[11px] font-medium text-[#202923]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="text-[#202923] hover:font-bold px-1"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Editor Main Canvas / Sheet */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F7F6F2]/60 flex justify-center">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-3xl min-h-[750px] bg-[#FFFFFF] shadow-sm rounded-xl p-8 sm:p-14 border border-[#ECE7DF] focus-within:border-[#8DAA96] transition-all"
        >
          <EditorContent editor={editor} className="tiptap-content outline-none" />
        </div>
      </div>

      {/* Document Bottom Footer Status */}
      <div className="px-6 py-2.5 border-t border-[#E9E5DE] flex items-center justify-between text-xs text-[#77776F] bg-[#FAF8F5]/80">
        <div className="flex items-center gap-4">
          <span>
            <strong className="text-[#202923] font-semibold">{wordCount}</strong> kata
          </span>
          <span>•</span>
          <span>
            <strong className="text-[#202923] font-semibold">{charCount}</strong> karakter
          </span>
          <span>•</span>
          <span>
            ~{Math.max(1, Math.ceil(wordCount / 200))} mnt waktu baca
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Target Harian: 500 kata</span>
            <div className="w-16 h-1.5 bg-[#E9E5DE] rounded-full overflow-hidden">
              <div
                className="bg-[#315D47] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (wordCount / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
