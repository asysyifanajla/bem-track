'use client';

import React from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Wallet,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Plus,
} from 'lucide-react';
import {
  getMockPrograms,
  getMockTransactions,
  getMockTimeline,
} from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function DashboardPage() {
  const currentUser = useCurrentUser();

  const programs = getMockPrograms();
  const transactions = getMockTransactions();
  const timeline = getMockTimeline();

  const userName = currentUser?.name || 'Pengurus BEM';

  // 1. Summary: Only Total Program Kerja & Total Saldo Kas (aggregate only)
  const totalPrograms = programs.length;

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  // 2. Nearest upcoming agendas (3 items)
  const upcomingAgendas = timeline.slice(0, 3);

  // 3. Latest 4 status updates & activities (Clean list layout, NOT a table)
  const recentUpdates = programs.slice(0, 4);

  // Format short date for calendar badge
  const formatCalendarBadge = (dateString: string) => {
    try {
      const d = new Date(dateString);
      const day = d.getDate().toString().padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = monthNames[d.getMonth()] || 'Nov';
      return { day, month };
    } catch {
      return { day: '08', month: 'Nov' };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* ======================================================== */}
      {/* WELCOME HEADER (Identical for all roles)                 */}
      {/* ======================================================== */}
      <div className="bg-white border border-[#E8DFD3] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6E2639]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#8A817B]">
                Sistem Informasi BEM FKI UMS &bull; Periode 2026/2027
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#352A28] tracking-tight mt-1.5">
              Selamat datang, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-[#8A817B] mt-1 max-w-2xl leading-relaxed">
              Pantau progres program kerja, alur disposisi dokumen, dan transparansi birokrasi organisasi secara terpadu.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5">
            <Link
              href="/programs/create"
              className="inline-flex items-center gap-2 bg-[#6E2639] hover:bg-[#4B1828] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajukan Proker</span>
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-1.5 bg-[#FAF7F1] hover:bg-[#F3EBDD] text-[#352A28] border border-[#E8DFD3] text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
            >
              <span>Semua Proker</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6E2639]" />
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SUMMARY SECTION (Only 2 compact cards as required)     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Total Program Kerja */}
        <div className="bg-white border border-[#E8DFD3] rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A817B]">
              Total Program Kerja
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#352A28] tracking-tight">
                {totalPrograms}
              </span>
              <span className="text-xs font-medium text-[#8A817B]">
                Program Terdaftar
              </span>
            </div>
            <p className="text-xs text-[#8A817B] mt-2">
              Periode aktif kepengurusan tahun 2026
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F1] border border-[#E8DFD3] flex items-center justify-center text-[#6E2639] shrink-0 shadow-2xs">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Saldo Kas (Aggregate balance only) */}
        <div className="bg-white border border-[#E8DFD3] rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A817B]">
              Total Saldo Kas Organisasi
            </span>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#352A28] tracking-tight">
                {formatCurrency(totalBalance)}
              </span>
            </div>
            <p className="text-xs text-[#8A817B] mt-2">
              Saldo kas aktif perbendaharaan BEM FKI UMS
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F1] border border-[#E8DFD3] flex items-center justify-center text-[#6E2639] shrink-0 shadow-2xs">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2 & 3. MAIN CONTENT: RECENT UPDATES & UPCOMING AGENDAS   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ====================================================== */}
        {/* 3. PEMBARUAN STATUS & AKTIVITAS TERKINI (List Layout)  */}
        {/* ====================================================== */}
        <div className="lg:col-span-7 bg-white border border-[#E8DFD3] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DFD3]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#352A28] tracking-tight">
                  Pembaruan Status &amp; Aktivitas Terkini
                </h2>
              </div>
              <Link
                href="/programs"
                className="text-xs font-semibold text-[#6E2639] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Semua Proker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Clean List Items (NOT a complicated table) */}
            <div className="divide-y divide-[#E8DFD3]/70 mt-1">
              {recentUpdates.map((item) => {
                const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DRAFT;
                
                // Subtle status indicator colors matching palette
                const isApproved = item.status === 'APPROVED';
                const isRevision = item.status === 'REVISION';
                const statusBg = isApproved
                  ? 'bg-[#EDF7F1] text-[#2D7A4F] border-[#2D7A4F]/20'
                  : isRevision
                  ? 'bg-[#FDF0F1] text-[#9B2335] border-[#9B2335]/20'
                  : 'bg-[#FAF7F1] text-[#8A4658] border-[#8A4658]/25';

                return (
                  <Link
                    key={item.id}
                    href={`/programs/${item.id}`}
                    className="py-3.5 px-2 -mx-2 rounded-xl flex items-start justify-between gap-3 hover:bg-[#FAF7F1]/70 transition-colors group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-[#352A28] group-hover:text-[#6E2639] transition-colors line-clamp-1">
                          {item.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBg} whitespace-nowrap`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8A817B] flex items-center gap-2">
                        <span>{item.departemen}</span>
                        <span>&bull;</span>
                        <span>Oleh {item.submittedBy}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0 pt-0.5">
                      <span className="text-[11px] text-[#8A817B] block whitespace-nowrap">
                        {formatDate(item.updatedAt || item.submittedAt)}
                      </span>
                      <span className="text-[10px] font-semibold text-[#6E2639] group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
                        Detail &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-[#E8DFD3]/70 flex items-center justify-between text-[11px] text-[#8A817B]">
            <span>Menampilkan 4 aktivitas birokrasi terbaru</span>
            {currentUser?.role === 'GUBERNUR' && (
              <Link href="/activity-logs" className="text-[#6E2639] font-medium hover:underline">
                Buka Riwayat Log &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* ====================================================== */}
        {/* 2. KALENDER & AGENDA MENDATANG (Compact Section)       */}
        {/* ====================================================== */}
        <div className="lg:col-span-5 bg-white border border-[#E8DFD3] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DFD3]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F1] border border-[#E8DFD3] flex items-center justify-center text-[#6E2639]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#352A28] tracking-tight">
                    Kalender &amp; Agenda
                  </h2>
                  <p className="text-xs text-[#8A817B]">
                    Kegiatan terdekat BEM FKI UMS
                  </p>
                </div>
              </div>
              <Link
                href="/timeline"
                className="text-xs font-semibold text-[#6E2639] hover:underline shrink-0"
              >
                Lihat Semua
              </Link>
            </div>

            {/* Upcoming Agenda Items */}
            <div className="space-y-3 mt-4">
              {upcomingAgendas.map((agenda) => {
                const { day, month } = formatCalendarBadge(agenda.startDate);

                return (
                  <div
                    key={agenda.id}
                    className="p-3 rounded-xl bg-[#FAF7F1]/60 border border-[#E8DFD3] flex items-start gap-3 hover:bg-[#FAF7F1] transition-colors"
                  >
                    {/* Compact Date Box */}
                    <div className="w-11 h-12 rounded-xl bg-white border border-[#E8DFD3] text-center flex flex-col items-center justify-center shrink-0 shadow-2xs">
                      <span className="text-xs font-bold text-[#6E2639] leading-none">
                        {day}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-[#8A817B] mt-0.5 leading-none">
                        {month}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#352A28] leading-snug line-clamp-1">
                        {agenda.title}
                      </h3>
                      <p className="text-[11px] text-[#8A817B] mt-0.5 line-clamp-1">
                        {agenda.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#8A817B] mt-1.5">
                        <span className="flex items-center gap-1 text-[#352A28] font-medium">
                          <Clock className="w-3 h-3 text-[#6E2639]" />
                          09:00 WIB
                        </span>
                        <span>&bull;</span>
                        <span className="truncate">{agenda.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E8DFD3]/70 flex items-center justify-between text-[11px] text-[#8A817B]">
            <span>{timeline.length} agenda terjadwal semester ini</span>
            <Link href="/timeline" className="text-[#6E2639] font-medium hover:underline">
              Jadwal Lengkap &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SUBTLE TRANSPARENCY & DEMO FOOTNOTE                      */}
      {/* ======================================================== */}
      <div className="p-4 bg-white border border-[#E8DFD3] rounded-2xl flex items-center justify-between text-xs text-[#8A817B] shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#6E2639] shrink-0" />
          <span>
            BEM-Track Frontend Simulation Mode &bull; Seluruh data ringkasan disajikan berbasis mock data terstruktur untuk demonstrasi antarmuka.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#352A28] hidden md:inline">
          BEM FKI UMS 2026
        </span>
      </div>

    </div>
  );
}
