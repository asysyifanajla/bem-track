'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { DEMO_USERS } from '@/lib/mockData';
import { ROLE_LABELS, UserRole } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('gubernur@bem.ums.ac.id');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise((r) => setTimeout(r, 450));

    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && password === 'demo123'
    );

    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bem_track_token', 'demo_token_' + user.role);
        localStorage.setItem(
          'bem_track_user',
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            departemen: user.departemen,
            createdAt: user.createdAt,
          })
        );
      }
      router.push('/dashboard');
    } else {
      setError('Email atau password tidak sesuai. Silakan gunakan akun demo di bawah.');
      setIsLoading(false);
    }
  };

  const loginAs = (demoUser: (typeof DEMO_USERS)[0]) => {
    setEmail(demoUser.email);
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col justify-center items-center p-4 sm:p-6 text-[#352A28]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand identity */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#6E2639] text-white shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#352A28]">BEM-Track</h1>
          <p className="text-xs text-[#8A817B] max-w-xs mx-auto">
            Sistem Informasi Tracking & Transparansi Birokrasi BEM FKI UMS
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-semibold text-[#352A28]">Masuk ke Akun</h2>
            <p className="text-xs text-[#8A817B] mt-0.5">
              Gunakan kredensial akun pengurus internal BEM FKI UMS
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#FDF0F1] border border-[#9B2335]/25 rounded-lg text-xs text-[#9B2335] font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#352A28] mb-1.5"
              >
                Email Organisasi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@bem.ums.ac.id"
                required
                className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg py-2.5 px-3.5 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#352A28] mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg py-2.5 pl-3.5 pr-10 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A817B] hover:text-[#352A28] cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6E2639] hover:bg-[#4B1828] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts Selector */}
          <div className="pt-4 border-t border-[#E8E0D7] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8A817B] uppercase tracking-wider">
                Akses Cepat Pengurus (Demo)
              </span>
              <span className="text-[10px] text-[#6E2639] font-medium bg-[#F5EEF0] px-1.5 py-0.5 rounded-sm">
                4 Peran Utama
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DEMO_USERS.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => loginAs(u)}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    email === u.email
                      ? 'border-[#6E2639] bg-[#F5EEF0]'
                      : 'border-[#E8E0D7] bg-[#FAF7F1]/60 hover:bg-[#FAF7F1]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#352A28] truncate">{u.name}</p>
                  <p className="text-[10px] text-[#8A817B] truncate">
                    {ROLE_LABELS[u.role as UserRole]}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#8A817B] text-center pt-1">
              Kata sandi semua akun demo: <code className="font-mono text-[#352A28] font-bold">demo123</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#8A817B] space-y-1">
          <p>BEM Fakultas Komunikasi dan Informatika &bull; Universitas Muhammadiyah Surakarta</p>
          <p className="text-[11px] text-[#8A817B]/80">
            Prototipe Frontend Skripsi &bull; Berbasis Multi-Label Classification
          </p>
        </div>
      </div>
    </div>
  );
}
