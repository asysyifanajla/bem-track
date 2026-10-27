'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Wallet,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  FileText,
  Zap,
  Info,
} from 'lucide-react';
import {
  getMockPrograms,
  getMockTransactions,
} from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function DashboardPage() {
  const currentUser = useCurrentUser();
  const userName = currentUser?.name || 'Ahmad Fauzi';

  const [selectedDay, setSelectedDay] = useState(24);

  const programs = getMockPrograms();
  const transactions = getMockTransactions();

  // Aggregate numbers
  const totalPrograms = programs.length || 6;
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense > 0 ? totalIncome - totalExpense : 30000000;

  // Weekly calendar strip dates
  const weekDays = [
    { name: 'Sen', day: 20, hasEvent: true },
    { name: 'Sel', day: 21, hasEvent: true },
    { name: 'Rab', day: 22, hasEvent: false },
    { name: 'Kam', day: 23, hasEvent: false },
    { name: 'Jum', day: 24, hasEvent: true },
    { name: 'Sab', day: 25, hasEvent: true },
    { name: 'Min', day: 26, hasEvent: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans animate-fade-in">
      {/* ======================================================== */}
      {/* 1. GREETING & PAGE HERO HEADER                           */}
      {/* ======================================================== */}
      <div className="relative pt-2 pb-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            {/* Small BEM-TRACK dot indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
                BEM-TRACK
              </span>
            </div>

            {/* Bold Welcome Headline */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#22161A] tracking-tight">
              Selamat datang, {userName}
            </h1>

            {/* Clean Subtitle */}
            <p className="text-xs sm:text-sm text-[#756C69]">
              Pantau progres dan agenda BEM dalam satu tempat.
            </p>
          </div>

          {/* Decorative Divider with Organic Maroon Leaf Element on Right */}
          <div className="hidden md:flex items-center flex-1 max-w-md ml-6 mb-2">
            <div className="h-px bg-gradient-to-r from-[#EFE8E2] to-[#E5D7CB] flex-1" />
            <svg
              className="w-16 h-8 text-[#4E1724] opacity-80 shrink-0 ml-2"
              viewBox="0 0 64 32"
              fill="currentColor"
            >
              <path d="M0,16 C20,16 35,0 64,0 C50,20 30,32 0,16 Z" />
              <path
                d="M25,20 C40,22 55,10 64,4 C52,18 38,26 25,20 Z"
                fill="#682033"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP SUMMARY CARDS (Total Proker & Saldo Kas)         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Total Program Kerja */}
        <Link
          href="/programs"
          className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-[#E5D7CB] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-5">
            {/* Soft Warm Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] flex items-center justify-center text-[#8B263E] shrink-0 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#756C69]">Total Program Kerja</p>
              <p className="text-4xl font-extrabold text-[#22161A] tracking-tight mt-1 leading-none">
                {totalPrograms}
              </p>
              <p className="text-xs text-[#756C69] mt-2">Seluruh program kerja aktif</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular Donut Gauge SVG */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-[#F2ECE4]"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Active Arc (approx 75%) */}
                <path
                  className="text-[#4E1724]"
                  strokeDasharray="75, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center text-[#756C69]">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#C4B9B4] group-hover:text-[#22161A] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </Link>

        {/* Card 2: Saldo Kas Organisasi */}
        <Link
          href="/finance"
          className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-[#E5D7CB] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-5">
            {/* Soft Warm Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] flex items-center justify-center text-[#8B263E] shrink-0 group-hover:scale-105 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#756C69]">Saldo Kas Organisasi</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight mt-1 leading-none">
                {formatCurrency(totalBalance)}
              </p>
              <p className="text-xs text-[#756C69] mt-2">Saldo kas aktif bendahara BEM FIK UMS</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sparkline Graph SVG */}
            <div className="w-24 sm:w-28 h-12 shrink-0">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 120 40">
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B263E" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B263E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Gradient area */}
                <path
                  d="M0,32 Q25,35 45,22 T85,18 T115,8 L115,40 L0,40 Z"
                  fill="url(#sparklineGrad)"
                />
                {/* Line curve */}
                <path
                  d="M0,32 Q25,35 45,22 T85,18 T115,8"
                  fill="none"
                  stroke="#8B263E"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Highlight dot at peak */}
                <circle cx="115" cy="8" r="3" fill="#8B263E" />
              </svg>
            </div>

            <ChevronRight className="w-5 h-5 text-[#C4B9B4] group-hover:text-[#22161A] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </Link>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM SECTION: RECENT UPDATES & CALENDAR/AGENDA     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Card 3 (Left, 7 Cols): Pembaruan Status & Aktivitas Terkini */}
        <div className="lg:col-span-7 bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-6">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE8E2]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#4E1724] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#22161A] tracking-tight">
                  Pembaruan Status &amp; Aktivitas Terkini
                </h2>
                <p className="text-xs text-[#756C69] mt-0.5">
                  Daftar program kerja yang baru saja mengalami pergerakan birokrasi.
                </p>
              </div>
            </div>

            <Link
              href="/programs"
              className="text-xs font-semibold text-[#756C69] hover:text-[#4E1724] flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* List Aktivitas Terkini */}
          <div className="divide-y divide-[#EFE8E2]/60">
            {/* Item 1: Pending Sekum */}
            <div className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1 group">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] flex items-center justify-center text-[#8B263E] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <Link
                    href="/programs/PRG-2026-002"
                    className="font-bold text-xs sm:text-[13px] text-[#22161A] group-hover:text-[#4E1724] transition-colors line-clamp-1 block"
                  >
                    Workshop Kewirausahaan Digital &amp; Inkubasi Bisnis Mahasiswa
                  </Link>
                  <p className="text-[11px] sm:text-xs text-[#A39893] mt-0.5">
                    18 Oktober 2026
                  </p>
                </div>
              </div>

              {/* Status Pill Badge */}
              <div className="shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FEF7EC] text-[#B45309] border border-[#FDE68A]/60">
                  Pending Sekum
                </span>
              </div>
            </div>

            {/* Item 2: Pending Approval */}
            <div className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1 group">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] flex items-center justify-center text-[#8B263E] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <Link
                    href="/programs/PRG-2026-003"
                    className="font-bold text-xs sm:text-[13px] text-[#22161A] group-hover:text-[#4E1724] transition-colors line-clamp-1 block"
                  >
                    Seminar Nasional Cybersecurity &amp; Cloud Defense 2026
                  </Link>
                  <p className="text-[11px] sm:text-xs text-[#A39893] mt-0.5">
                    15 Oktober 2026
                  </p>
                </div>
              </div>

              {/* Status Pill Badge */}
              <div className="shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]/60">
                  Pending Approval
                </span>
              </div>
            </div>

            {/* Item 3: Terverifikasi */}
            <div className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1 group">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] flex items-center justify-center text-[#8B263E] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <Link
                    href="/programs/PRG-2026-004"
                    className="font-bold text-xs sm:text-[13px] text-[#22161A] group-hover:text-[#4E1724] transition-colors line-clamp-1 block"
                  >
                    Bakti Sosial &amp; Literasi Digital di Desa Binaan Boyolali
                  </Link>
                  <p className="text-[11px] sm:text-xs text-[#A39893] mt-0.5">
                    12 Oktober 2026
                  </p>
                </div>
              </div>

              {/* Status Pill Badge */}
              <div className="shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/60">
                  Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 (Right, 5 Cols): Kalender & Agenda */}
        <div className="lg:col-span-5 bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-6">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE8E2]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] text-[#8B263E] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#22161A] tracking-tight">
                  Kalender &amp; Agenda
                </h2>
                <p className="text-xs text-[#756C69] mt-0.5">
                  Kegiatan terdekat yang perlu diperhatikan.
                </p>
              </div>
            </div>

            <Link
              href="/timeline"
              className="text-xs font-semibold text-[#756C69] hover:text-[#4E1724] flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mini Calendar Month & Days Strip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <button
                className="p-1 rounded-lg hover:bg-[#FAF7F5] text-[#756C69] transition-colors cursor-pointer"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#22161A]">Oktober 2026</span>
              <button
                className="p-1 rounded-lg hover:bg-[#FAF7F5] text-[#756C69] transition-colors cursor-pointer"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Week Days Strip */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((wd) => {
                const isSelected = selectedDay === wd.day;
                return (
                  <button
                    key={wd.day}
                    onClick={() => setSelectedDay(wd.day)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#4E1724] text-white shadow-xs'
                        : 'hover:bg-[#FAF7F5] text-[#756C69]'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-medium leading-none ${
                        isSelected ? 'text-white/80' : 'text-[#A39893]'
                      }`}
                    >
                      {wd.name}
                    </span>
                    <span
                      className={`text-xs font-bold mt-1 leading-none ${
                        isSelected ? 'text-white font-extrabold' : 'text-[#22161A]'
                      }`}
                    >
                      {wd.day}
                    </span>
                    {/* Event dot indicator */}
                    <span
                      className={`w-1 h-1 rounded-full mt-1.5 ${
                        isSelected
                          ? 'bg-white'
                          : wd.hasEvent
                          ? 'bg-[#E68A2E]'
                          : 'bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Agenda Items List */}
          <div className="space-y-3 pt-2">
            {/* Agenda Item 1 */}
            <Link
              href="/timeline"
              className="p-3 rounded-2xl hover:bg-[#FAF7F5] border border-transparent hover:border-[#EFE8E2] flex items-center justify-between gap-3 group transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Clean Date Box */}
                <div className="w-11 h-12 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-center flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#22161A] leading-none">24</span>
                  <span className="text-[10px] font-semibold text-[#756C69] mt-0.5 leading-none">
                    Okt
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#22161A] group-hover:text-[#4E1724] transition-colors truncate">
                    Rapat Koordinasi Evaluasi Tengah Periode
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#756C69] mt-0.5 truncate">
                    <Clock className="w-3 h-3 text-[#756C69] shrink-0" />
                    <span>09.00 WIB</span>
                    <span>&bull;</span>
                    <span className="truncate">Ruang Rapat BEM FIK UMS</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#C4B9B4] group-hover:text-[#22161A] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>

            {/* Agenda Item 2 */}
            <Link
              href="/timeline"
              className="p-3 rounded-2xl hover:bg-[#FAF7F5] border border-transparent hover:border-[#EFE8E2] flex items-center justify-between gap-3 group transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Clean Date Box */}
                <div className="w-11 h-12 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-center flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#22161A] leading-none">27</span>
                  <span className="text-[10px] font-semibold text-[#756C69] mt-0.5 leading-none">
                    Okt
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#22161A] group-hover:text-[#4E1724] transition-colors truncate">
                    Pelaksanaan: Company Profile Production Training
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#756C69] mt-0.5 truncate">
                    <Clock className="w-3 h-3 text-[#756C69] shrink-0" />
                    <span>08.00 WIB</span>
                    <span>&bull;</span>
                    <span className="truncate">Lab Multimedia Lantai 3 Gedung FIK UMS</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#C4B9B4] group-hover:text-[#22161A] group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FOOTER DISCLAIMER                                     */}
      {/* ======================================================== */}
      <div className="pt-2 flex items-center gap-2 text-xs text-[#A39893]">
        <Info className="w-4 h-4 shrink-0" />
        <p>
          Data pada dashboard ini merupakan data contoh untuk keperluan pengembangan sistem.
        </p>
      </div>
    </div>
  );
}
