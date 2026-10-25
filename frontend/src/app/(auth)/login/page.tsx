'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { DEMO_USERS } from '@/lib/mockData';
import { ROLE_LABELS, UserRole } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('gubernur@bem.ums.ac.id');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('GUBERNUR');

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
      setError('Email atau password tidak sesuai. Silakan pilih akun demo.');
      setIsLoading(false);
    }
  };

  const loginAs = (demoUser: (typeof DEMO_USERS)[0]) => {
    setEmail(demoUser.email);
    setPassword('demo123');
    setSelectedRole(demoUser.role);
    setError('');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'GUBERNUR':
        return 'Gubernur';
      case 'SEKRETARIS_UMUM':
        return 'Sekum';
      case 'BENDAHARA_UMUM':
        return 'Bendum';
      case 'DEPARTEMEN_1':
        return 'Dept. IPO';
      case 'DEPARTEMEN_2':
        return 'Dept. KONEKS';
      case 'DEPARTEMEN_3':
        return 'Dept. ADVO';
      case 'DEPARTEMEN_4':
        return 'Dept. VISINFO';
      default:
        return 'Pengurus';
    }
  };

  return (
    <div className="min-h-screen bg-[#36111C] flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Ambient background glowing circles inspired by reference */}
      <div className="absolute -top-36 -left-36 w-[420px] h-[420px] rounded-full bg-[#6E2639]/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -right-36 w-[450px] h-[450px] rounded-full bg-[#4B1828]/60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-12 w-72 h-72 rounded-full bg-[#8A4658]/25 blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-[#FAF7F1]/5 blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative w-full max-w-[1080px] min-h-[620px] bg-[#4B1828] rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden border border-white/10 flex flex-col lg:flex-row">

        {/* ======================================================== */}
        {/* DESKTOP ORGANIC CURVED DIVIDER (SVG BACKGROUND LAYER)    */}
        {/* ======================================================== */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
          viewBox="0 0 1000 660"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Main Cream Left Panel with S-curve divider (strictly bounded to leave generous room for form) */}
          <path
            d="M 0,0 L 390,0 C 435,60 475,145 465,250 C 455,355 355,395 350,480 C 345,550 410,610 460,660 L 0,660 Z"
            fill="#FAF7F1"
          />
        </svg>

        {/* ======================================================== */}
        {/* LEFT PANEL: CREAM WITH ILLUSTRATION & BRANDING           */}
        {/* ======================================================== */}
        <div className="relative z-10 w-full lg:w-[44%] xl:w-[43%] bg-[#FAF7F1] lg:bg-transparent p-6 sm:p-8 lg:p-10 flex flex-col justify-between">

          {/* Top Brand / University Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#6E2639] text-[#FAF7F1] flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#FAF7F1]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold tracking-wider text-[#352A28] uppercase leading-tight">
                BADAN EKSEKUTIF MAHASISWA
              </p>
              <p className="text-[10px] text-[#8A817B] font-medium tracking-wide">
                Fakultas Komunikasi &amp; Informatika &bull; BEM
              </p>
            </div>
          </div>

          {/* Central Illustration: Student Organization, Documents & Governance */}
          <div className="relative my-4 lg:my-0 flex items-center justify-center">
            {/* Decorative Floating Circles (inspired by reference) */}
            <div className="absolute top-2 left-6 w-9 h-9 rounded-full bg-[#EFE6D8] opacity-75 pointer-events-none" />
            <div className="absolute top-8 right-10 w-12 h-12 rounded-full bg-[#E5D9C8] opacity-60 pointer-events-none" />
            <div className="absolute bottom-6 left-8 w-11 h-11 rounded-full bg-[#F3EBDD] opacity-90 pointer-events-none" />
            <div className="absolute bottom-10 right-8 w-7 h-7 rounded-full bg-[#E5D9C8] opacity-70 pointer-events-none" />
            <div className="absolute top-1/2 left-2 w-5 h-5 rounded-full bg-[#EFE6D8] opacity-80 pointer-events-none" />

            {/* Custom SVG Illustration */}
            <svg
              className="w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[350px] h-auto drop-shadow-sm select-none"
              viewBox="0 0 410 330"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Organic Backdrop Blobs */}
              <path
                d="M 50,150 C 40,70 130,30 220,38 C 310,48 360,105 355,180 C 350,260 290,300 190,295 C 90,290 60,240 50,150 Z"
                fill="#F3EBDD"
              />
              <path
                d="M 80,160 C 75,95 145,65 220,75 C 295,85 335,130 330,190 C 325,255 275,275 195,270 C 115,265 85,230 80,160 Z"
                fill="#ECE2D2"
                opacity="0.65"
              />

              {/* Central Bureaucracy Tracking Board / Window */}
              <g transform="translate(115, 68)">
                {/* Board Frame */}
                <rect x="0" y="0" width="180" height="160" rx="14" fill="#FFFFFF" stroke="#E8DFD3" strokeWidth="2" />
                {/* Board Header */}
                <rect x="0" y="0" width="180" height="34" rx="14" fill="#6E2639" />
                <rect x="0" y="24" width="180" height="10" fill="#6E2639" />
                {/* Header Window Dots */}
                <circle cx="16" cy="17" r="3" fill="#FAF7F1" opacity="0.8" />
                <circle cx="26" cy="17" r="3" fill="#FAF7F1" opacity="0.5" />
                <circle cx="36" cy="17" r="3" fill="#FAF7F1" opacity="0.3" />
                {/* Header Title */}
                <text x="50" y="21" fill="#FAF7F1" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  BEM-Track Monitor
                </text>

                {/* Tracking Item 1: Proposal Terverifikasi */}
                <g transform="translate(10, 45)">
                  <rect x="0" y="0" width="160" height="27" rx="6" fill="#FAF7F1" stroke="#E8E0D7" strokeWidth="1" />
                  <circle cx="14" cy="13.5" r="6" fill="#6E2639" />
                  <path d="M 11,13.5 L 13,15.5 L 17,11.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="26" y="12" fill="#352A28" fontSize="8" fontWeight="600" fontFamily="sans-serif">
                    Proposal Kegiatan
                  </text>
                  <text x="26" y="21" fill="#8A817B" fontSize="6.5" fontFamily="sans-serif">
                    Verifikasi Sekum &bull; Sah
                  </text>
                  <rect x="114" y="8" width="38" height="11" rx="4" fill="#6E2639" opacity="0.12" />
                  <text x="118" y="16" fill="#6E2639" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                    Disetujui
                  </text>
                </g>

                {/* Tracking Item 2: Verifikasi Anggaran LPJ */}
                <g transform="translate(10, 78)">
                  <rect x="0" y="0" width="160" height="27" rx="6" fill="#FAF7F1" stroke="#E8E0D7" strokeWidth="1" />
                  <circle cx="14" cy="13.5" r="6" fill="#8A4658" />
                  <path d="M 11,13.5 L 13,15.5 L 17,11.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="26" y="12" fill="#352A28" fontSize="8" fontWeight="600" fontFamily="sans-serif">
                    Laporan Anggaran
                  </text>
                  <text x="26" y="21" fill="#8A817B" fontSize="6.5" fontFamily="sans-serif">
                    Bendum &bull; Saldo Sesuai
                  </text>
                  <rect x="116" y="8" width="36" height="11" rx="4" fill="#8A4658" opacity="0.15" />
                  <text x="122" y="16" fill="#8A4658" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                    Review
                  </text>
                </g>

                {/* Tracking Item 3: Klasifikasi IndoBERT */}
                <g transform="translate(10, 111)">
                  <rect x="0" y="0" width="160" height="27" rx="6" fill="#FAF7F1" stroke="#E8E0D7" strokeWidth="1" />
                  <circle cx="14" cy="13.5" r="6" fill="#4B1828" />
                  <circle cx="14" cy="13.5" r="2.5" fill="#FAF7F1" />
                  <text x="26" y="12" fill="#352A28" fontSize="8" fontWeight="600" fontFamily="sans-serif">
                    Klasifikasi AI
                  </text>
                  <text x="26" y="21" fill="#8A817B" fontSize="6.5" fontFamily="sans-serif">
                    Multi-label: Akademik
                  </text>
                  <rect x="112" y="8" width="40" height="11" rx="4" fill="#4B1828" opacity="0.12" />
                  <text x="115" y="16" fill="#4B1828" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                    IndoBERT
                  </text>
                </g>
              </g>

              {/* Student Leader 1 (Left): Maroon Almamater Blazer */}
              <g transform="translate(54, 140)">
                <path d="M 28,62 C 28,48 42,42 54,42 C 66,42 80,48 80,62 L 76,120 L 32,120 Z" fill="#6E2639" />
                <path d="M 47,42 L 54,58 L 61,42 Z" fill="#FAF7F1" />
                <ellipse cx="54" cy="26" rx="14" ry="16" fill="#E8B89E" />
                <path d="M 38,22 C 38,10 50,8 56,8 C 66,8 70,14 70,22 C 64,18 58,18 50,18 C 44,18 40,20 38,22 Z" fill="#352A28" />
                {/* Arm & Clipboard */}
                <path d="M 34,60 L 20,86 L 34,94 L 46,72 Z" fill="#4B1828" />
                <rect x="12" y="78" width="28" height="34" rx="4" fill="#FFFFFF" stroke="#6E2639" strokeWidth="1.5" />
                <rect x="16" y="84" width="18" height="3" rx="1.5" fill="#352A28" />
                <rect x="16" y="90" width="20" height="3" rx="1.5" fill="#8A817B" />
                <rect x="16" y="96" width="14" height="3" rx="1.5" fill="#8A817B" />
                <circle cx="30" cy="101" r="5" fill="#6E2639" />
                <path d="M 28,101 L 29.5,102.5 L 32.5,99.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Student Officer 2 (Right): Team Member with Laptop */}
              <g transform="translate(276, 155)">
                <path d="M 24,54 C 24,42 36,36 46,36 C 56,36 68,42 68,54 L 64,110 L 28,110 Z" fill="#8A4658" />
                <path d="M 32,18 C 32,8 42,6 48,6 C 58,6 62,12 62,22 C 62,34 58,38 48,38 C 38,38 32,30 32,18 Z" fill="#F3EBDD" />
                <path d="M 34,26 C 36,38 42,42 48,42 C 54,42 58,38 58,26 Z" fill="#F3EBDD" />
                <ellipse cx="47" cy="24" rx="7" ry="8" fill="#E2AC92" />
                {/* Desk Surface */}
                <rect x="-8" y="88" width="66" height="5" rx="2.5" fill="#E5D9C8" />
                {/* Laptop */}
                <polygon points="4,88 14,68 38,68 46,88" fill="#FFFFFF" stroke="#D8C7B5" strokeWidth="1.5" />
                <rect x="1" y="87" width="48" height="3" rx="1.5" fill="#352A28" />
                <polyline points="18,80 24,74 30,77 34,71" fill="none" stroke="#6E2639" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Foliage / Plant */}
              <g transform="translate(52, 226)">
                <path d="M 12,50 C 4,32 10,18 24,10 C 26,24 20,40 12,50 Z" fill="#8A4658" opacity="0.6" />
                <path d="M 22,50 C 18,34 26,20 40,16 C 38,30 32,44 22,50 Z" fill="#6E2639" opacity="0.7" />
                <path d="M 8,50 C 14,38 18,34 26,50 Z" fill="#4B1828" opacity="0.5" />
                <ellipse cx="18" cy="52" rx="10" ry="3" fill="#D8C7B5" />
              </g>

              {/* Verified Digital Star Badge */}
              <g transform="translate(196, 42)">
                <circle cx="16" cy="16" r="16" fill="#6E2639" />
                <circle cx="16" cy="16" r="13" fill="#8A4658" />
                <path d="M 16,8 L 18.5,13 L 24,13.8 L 20,17.6 L 21,23 L 16,20.4 L 11,23 L 12,17.6 L 8,13.8 L 13.5,13 Z" fill="#FAF7F1" />
              </g>
            </svg>
          </div>

          {/* Bottom Left Note (matching reference style) */}
          <div className="text-[11px] text-[#8A817B] space-y-0.5">
            <p className="font-medium text-[#352A28]">
              &copy; BEM FKI UMS &bull; BEM-Track System
            </p>
            <p className="text-[10px] text-[#8A817B]/80">
              Sistem Informasi Birokrasi &amp; Tracking IndoBERT
            </p>
          </div>

          {/* Mobile Bottom Wave Divider */}
          <div className="lg:hidden absolute -bottom-5 left-0 right-0 h-6 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-full">
              <path d="M 0,0 C 150,50 350,0 500,40 L 500,50 L 0,50 Z" fill="#4B1828" />
            </svg>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: DEEP MAROON WITH LOGIN FORM                 */}
        {/* ======================================================== */}
        <div className="relative z-10 w-full lg:w-[56%] xl:w-[57%] p-6 sm:p-10 lg:py-10 lg:pl-16 lg:pr-12 flex flex-col justify-between text-[#FAF7F1]">

          {/* Top Wordmark & Minimal Subtitle */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#F3EBDD]" />
                  BEM-Track
                </span>
                <span className="text-[11px] text-[#FAF7F1]/60 font-medium">v1.0 FKI UMS</span>
              </div>
              <span className="text-[11px] text-[#FAF7F1]/60 hidden sm:inline-block">
                Portal Pengurus
              </span>
            </div>

            {/* Heading */}
            <div className="mt-6 sm:mt-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Login
              </h1>
              <p className="text-xs sm:text-sm text-[#FAF7F1]/75 mt-1.5 font-normal">
                Masuk untuk mengakses tracking progres dan disposisi surat
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="my-6 space-y-4 max-w-md w-full">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-400/30 rounded-2xl text-xs text-red-200 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-[#FAF7F1]/90 pl-1"
                >
                  Username atau Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@bem.ums.ac.id"
                    required
                    className="w-full bg-[#36111C]/85 border border-white/15 text-white placeholder-[#FAF7F1]/40 text-sm rounded-full py-3 px-5 focus:outline-hidden focus:border-[#FAF7F1]/60 focus:ring-2 focus:ring-[#8A4658]/60 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-1">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-[#FAF7F1]/90"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Untuk reset password akun BEM, silakan hubungi Sekum atau Administrator NOC BEM FKI UMS.');
                    }}
                    className="text-[11px] text-[#FAF7F1]/60 hover:text-white transition-colors"
                  >
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                    className="w-full bg-[#36111C]/85 border border-white/15 text-white placeholder-[#FAF7F1]/40 text-sm rounded-full py-3 pl-5 pr-12 focus:outline-hidden focus:border-[#FAF7F1]/60 focus:ring-2 focus:ring-[#8A4658]/60 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FAF7F1]/60 hover:text-white cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Login Button (pill button inspired by reference) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#8A4658] hover:bg-[#6E2639] active:scale-[0.99] text-[#FAF7F1] font-semibold py-3 px-6 rounded-full text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl border border-white/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke BEM-Track</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access (Pill Switchers for smooth role demo) */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#FAF7F1]/70">
                  Pilih Akun Demo (1-Klik):
                </span>
                <span className="text-[10px] text-[#FAF7F1]/50">
                  Password: <code className="font-mono text-white">demo123</code>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {DEMO_USERS.map((u) => {
                  const isSelected = selectedRole === u.role || email === u.email;
                  const label = getRoleDisplayName(u.role);

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => loginAs(u)}
                      className={`py-1.5 px-2 rounded-full text-[11px] font-medium transition-all cursor-pointer border text-center truncate flex items-center justify-center gap-1 ${isSelected
                        ? 'bg-[#FAF7F1] text-[#4B1828] border-white shadow-sm font-semibold'
                        : 'bg-black/25 hover:bg-black/40 text-[#FAF7F1]/85 border-white/10'
                        }`}
                      title={`${u.name} (${ROLE_LABELS[u.role as UserRole]})`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#4B1828] shrink-0" />}
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Supporting Links (matching reference) */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF7F1]/60 gap-2">
            <div className="flex items-center gap-4">
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Ketentuan Layanan: Sistem ini digunakan khusus untuk sivitas internal BEM FKI UMS.');
                }}
                className="hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                Ketentuan Layanan
              </a>
              <span>&bull;</span>
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Kebijakan Privasi: Data birokrasi dan disposisi surat dilindungi secara terenkripsi.');
                }}
                className="hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                Privasi
              </a>
            </div>
            <div>
              <span>Kendala sistem? </span>
              <a
                href="mailto:noc@bem.ums.ac.id"
                className="text-[#FAF7F1]/90 hover:text-white underline-offset-2 hover:underline font-medium"
              >
                noc@bem.ums.ac.id
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
