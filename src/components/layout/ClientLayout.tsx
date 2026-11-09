'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';
import { useStore } from '@/store/useStore';
import { Menu, X } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { darkMode, fetchFromDatabase } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFromDatabase();
  }, [fetchFromDatabase]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-[#F7F6F2]">
        <div className="hidden lg:block w-64 bg-[#1E2B22]" />
        <div className="flex-1 p-8" />
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-[#151A17] text-[#EDE6DC]' : 'bg-[#F7F6F2] text-[#202923]'}`}>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw]">
            <Sidebar />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 z-20 p-2 text-white bg-black/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top trigger */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#1E2B22] text-white">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 rounded-lg hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-xl">StudyFlow</span>
          <div className="w-6" />
        </div>

        <TopNavbar />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
