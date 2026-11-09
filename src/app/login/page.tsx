'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { StudyFlowLogo, BotanicalBranch } from '@/components/shared/BotanicalAssets';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('intan.zahra@uny.ac.id');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Decorative Botanical Corner */}
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-20 w-80">
        <BotanicalBranch className="w-full h-full object-contain" />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#ECE7DF] shadow-lg relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-[#315D47] flex items-center justify-center text-[#FAF8F5] shadow-md mb-3.5">
            <StudyFlowLogo className="w-7 h-7 text-[#FAF8F5]" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#1E2B22]">
            StudyFlow
          </h1>
          <p className="text-xs text-[#6B726B] mt-1.5 max-w-xs">
            Masuk ke personal academic workspace skripsi & riset ilmiahmu.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E2B22] mb-1.5">
              Email Akademik
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#8A928B] absolute left-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E2DBD0] focus:border-[#315D47] focus:ring-1 focus:ring-[#315D47] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1E2B22] outline-none transition-all"
                placeholder="nama@uny.ac.id"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2B22] mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#8A928B] absolute left-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FAF8F5] border border-[#E2DBD0] focus:border-[#315D47] focus:ring-1 focus:ring-[#315D47] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1E2B22] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#E8EFE9] border border-[#8DAA96]/30 text-[11px] text-[#243B2E] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#315D47] shrink-0" />
            <span>Akun default: <strong>intan.zahra@uny.ac.id</strong> / <strong>password123</strong></span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E2B22] hover:bg-[#2C3F32] disabled:opacity-70 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all mt-2"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Workspace'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-center text-[11px] text-[#8A928B] mt-6">
          StudyFlow • Academic Thesis & Research Workspace
        </p>
      </div>
    </div>
  );
}

