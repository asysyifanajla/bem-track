'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Clock,
  FolderArchive,
  Wallet,
  ArrowRight,
  Calendar,
  AlertCircle,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  getMockPrograms,
  getMockTransactions,
  getMockTimeline,
  getMockArchives,
} from '@/lib/mockData';
import { STATUS_CONFIG } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ROLE_LABELS, UserRole } from '@/types/auth';
import { canCreateProgram } from '@/lib/permissions';

export default function DashboardPage() {
  const [currentUser] = useState<{ name: string; role: string; departemen?: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const programs = getMockPrograms();
  const transactions = getMockTransactions();
  const timeline = getMockTimeline();
  const archives = getMockArchives();

  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;
  const userName = currentUser?.name || 'Pengurus BEM';

  // Metrics
  const totalPrograms = programs.length;
  const pendingReview = programs.filter(
    (p) => p.status === 'SEKUM_REVIEW' || p.status === 'BENDUM_REVIEW' || p.status === 'GUBERNUR_REVIEW'
  ).length;
  const totalArchives = archives.filter((a) => a.status === 'ARCHIVED').length;

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Filter programs needing attention
  const attentionPrograms = programs.slice(0, 4);
  const upcomingAgendas = timeline.slice(0, 3);

  const getStatusBadge = (status: keyof typeof STATUS_CONFIG) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
    const variantMap: Record<string, 'default' | 'maroon' | 'cream' | 'success' | 'warning' | 'danger' | 'info'> = {
      DRAFT: 'default',
      SUBMITTED: 'info',
      SEKUM_REVIEW: 'warning',
      BENDUM_REVIEW: 'warning',
      GUBERNUR_REVIEW: 'maroon',
      APPROVED: 'success',
      REVISION: 'warning',
      REJECTED: 'danger',
    };
    return (
      <Badge variant={variantMap[status] || 'default'} dot>
        {cfg.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header & Quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
              Selamat datang, {userName}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
            {ROLE_LABELS[userRole]} &bull; {currentUser?.departemen || 'BEM FKI UMS Periode 2026/2027'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCreateProgram(userRole) && (
            <Link href="/programs/create">
              <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Ajukan Program Baru
              </Button>
            </Link>
          )}
          <Link href="/verifications">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Verifikasi
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Total Program Kerja"
          value={totalPrograms}
          description="Periode berjalan 2026"
          icon={<ClipboardList className="w-4 h-4 text-[#6E2639]" />}
        />
        <StatCard
          title="Perlu Verifikasi"
          value={pendingReview}
          description="Tahap review birokrasi"
          icon={<Clock className="w-4 h-4 text-[#92600C]" />}
        />
        <StatCard
          title="Dokumen Arsip Final"
          value={totalArchives}
          description="Proposal & LPJ resmi"
          icon={<FolderArchive className="w-4 h-4 text-[#2D7A4F]" />}
        />
        <StatCard
          title="Saldo Kas Kas Organisasi"
          value={formatCurrency(balance)}
          description="Pemasukan vs Pengeluaran"
          icon={<Wallet className="w-4 h-4 text-[#6E2639]" />}
        />
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Programs Needing Attention Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#E8E0D7] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8E0D7] flex items-center justify-between bg-white">
              <div>
                <h3 className="text-sm font-bold text-[#352A28]">
                  Program Kerja Membutuhkan Perhatian
                </h3>
                <p className="text-xs text-[#8A817B] mt-0.5">
                  Proker dalam tahap review dan konfirmasi birokrasi
                </p>
              </div>
              <Link
                href="/programs"
                className="text-xs font-semibold text-[#6E2639] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF7F1] border-b border-[#E8E0D7] text-[#8A817B] uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Nama Program</th>
                    <th className="py-2.5 px-4">Pengaju</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D7]">
                  {attentionPrograms.map((prog) => (
                    <tr key={prog.id} className="hover:bg-[#FAF7F1]/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/programs/${prog.id}`}
                          className="font-semibold text-[#352A28] hover:text-[#6E2639] line-clamp-1"
                        >
                          {prog.title}
                        </Link>
                        <span className="text-[11px] text-[#8A817B] block mt-0.5">
                          {prog.departemen} &bull; {formatCurrency(prog.totalBudget)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#352A28] font-medium whitespace-nowrap">
                        {prog.submittedBy}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(prog.status as keyof typeof STATUS_CONFIG)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/programs/${prog.id}`}
                          className="text-[#6E2639] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Notice Banner on IndoBERT Multi-Label */}
          <div className="p-4 bg-white border border-[#E8E0D7] rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#FAF7F1] border border-[#E8E0D7] text-[#6E2639] shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#352A28]">
                Catatan Transparansi Klasifikasi Multi-Label IndoBERT
              </p>
              <p className="text-[#8A817B] mt-0.5 leading-relaxed">
                Klasifikasi kategori proposal proker menggunakan model NLP IndoBERT disiapkan untuk
                otomasi multi-tagging. Pada tahap demo frontend, sistem berstatus standby tanpa data
                akurasi buatan sebelum model weights diintegrasikan pada backend.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Finance Summary & Upcoming Agenda */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ringkasan Keuangan Kas (Authorized View) */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
              <div>
                <h3 className="text-xs font-bold text-[#8A817B] uppercase tracking-wider">
                  Ringkasan Kas BEM
                </h3>
                <p className="text-base font-bold text-[#352A28] mt-0.5">
                  {formatCurrency(balance)}
                </p>
              </div>
              <Link href="/finance" className="text-xs font-semibold text-[#6E2639] hover:underline">
                Kelola &rarr;
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#EDF7F1]/50 border border-[#2D7A4F]/15">
                <div className="flex items-center gap-2 text-[#2D7A4F]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Pemasukan Terverifikasi</span>
                </div>
                <span className="font-semibold text-[#2D7A4F]">{formatCurrency(totalIncome)}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#FDF0F1]/50 border border-[#9B2335]/15">
                <div className="flex items-center gap-2 text-[#9B2335]">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Pengeluaran Realisasi</span>
                </div>
                <span className="font-semibold text-[#9B2335]">{formatCurrency(totalExpense)}</span>
              </div>
            </div>
          </div>

          {/* Agenda Terdekat */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D7]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6E2639]" />
                <h3 className="text-xs font-bold text-[#8A817B] uppercase tracking-wider">
                  Agenda Terdekat
                </h3>
              </div>
              <Link href="/timeline" className="text-xs font-semibold text-[#6E2639] hover:underline">
                Semua
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingAgendas.map((evt) => (
                <div key={evt.id} className="text-xs border-l-2 border-[#6E2639] pl-3 py-0.5">
                  <p className="font-semibold text-[#352A28] leading-snug">{evt.title}</p>
                  <p className="text-[11px] text-[#8A817B] mt-0.5">
                    {formatDate(evt.startDate)} &bull; {evt.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
