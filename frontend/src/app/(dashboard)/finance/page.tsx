'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  Eye,
  Lock,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { getMockTransactions } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { canManageFinance } from '@/lib/permissions';
import { UserRole } from '@/types/auth';

export default function FinancePage() {
  const [currentUser] = useState<{ role: string; name: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [transactions] = useState(() => getMockTransactions());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;
  const isBendumOrAdmin = canManageFinance(userRole);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // If user does not have transaction management rights:
  if (!isBendumOrAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 py-8 animate-fade-in text-center">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F1] border border-[#E8E0D7] text-[#6E2639] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#352A28]">
            Akses Pengelolaan Kas Dibatasi
          </h2>
          <p className="text-xs text-[#8A817B] max-w-md mx-auto">
            Halaman pencatatan dan pengelolaan transaksi kas detail dikhususkan untuk{' '}
            <strong className="text-[#352A28]">Bendahara Umum</strong>. Anda dapat memantau ringkasan
            keuangan organisasi melalui Dashboard.
          </p>
        </div>

        {/* Informative Summary */}
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 text-left space-y-3">
          <p className="text-xs font-bold text-[#8A817B] uppercase tracking-wider">
            Ringkasan Keuangan Organisasi (Publik BPH)
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#FAF7F1] rounded-lg border border-[#E8E0D7]">
              <span className="text-[10px] text-[#8A817B] block">Total Kas Masuk</span>
              <span className="text-sm font-bold text-[#2D7A4F] font-mono">
                {formatCurrency(totalIncome)}
              </span>
            </div>
            <div className="p-3 bg-[#FAF7F1] rounded-lg border border-[#E8E0D7]">
              <span className="text-[10px] text-[#8A817B] block">Realisasi Pengeluaran</span>
              <span className="text-sm font-bold text-[#9B2335] font-mono">
                {formatCurrency(totalExpense)}
              </span>
            </div>
            <div className="p-3 bg-[#F5EEF0] rounded-lg border border-[#6E2639]/20">
              <span className="text-[10px] text-[#6E2639] block">Saldo Kas Saat Ini</span>
              <span className="text-sm font-bold text-[#6E2639] font-mono">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>

        <Link href="/dashboard" className="inline-block pt-2">
          <Button variant="secondary" size="sm">
            Kembali ke Dashboard Utama
          </Button>
        </Link>
      </div>
    );
  }

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.programTitle && t.programTitle.toLowerCase().includes(search.toLowerCase()));

    const matchType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8E0D7]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
            Pengelolaan Kas & Transaksi Keuangan
          </h2>
          <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
            Modul pembukuan kas masuk, pengeluaran realisasi, dan transparansi anggaran BEM FKI
          </p>
        </div>

        <Link href="/finance/create">
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Catat Transaksi Baru
          </Button>
        </Link>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8A817B] uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="w-7 h-7 rounded-md bg-[#EDF7F1] text-[#2D7A4F] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2D7A4F] font-mono">
            {formatCurrency(totalIncome)}
          </p>
          <span className="text-[11px] text-[#8A817B] mt-1 block">Dekanat, Iuran & Sponsor</span>
        </div>

        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8A817B] uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="w-7 h-7 rounded-md bg-[#FDF0F1] text-[#9B2335] flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#9B2335] font-mono">
            {formatCurrency(totalExpense)}
          </p>
          <span className="text-[11px] text-[#8A817B] mt-1 block">Realisasi operasional kegiatan</span>
        </div>

        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8A817B] uppercase tracking-wider">
              Saldo Bersih Kas
            </span>
            <div className="w-7 h-7 rounded-md bg-[#FAF7F1] text-[#6E2639] border border-[#E8E0D7] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#6E2639] font-mono">
            {formatCurrency(balance)}
          </p>
          <span className="text-[11px] text-[#8A817B] mt-1 block">Kas aktif terverifikasi</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E0D7] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A817B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari transaksi, nomor kwitansi, atau keterangan..."
            className="w-full bg-[#FAF7F1]/60 border border-[#E8E0D7] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#352A28] placeholder-[#8A817B]/60 focus:bg-white focus:outline-hidden focus:border-[#6E2639] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-[#6E2639] text-white'
                : 'bg-[#FAF7F1] border border-[#E8E0D7] text-[#352A28] hover:bg-[#F3EBDD]'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('INCOME')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              typeFilter === 'INCOME'
                ? 'bg-[#2D7A4F] text-white'
                : 'bg-[#FAF7F1] border border-[#E8E0D7] text-[#2D7A4F] hover:bg-[#EDF7F1]'
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setTypeFilter('EXPENSE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              typeFilter === 'EXPENSE'
                ? 'bg-[#9B2335] text-white'
                : 'bg-[#FAF7F1] border border-[#E8E0D7] text-[#9B2335] hover:bg-[#FDF0F1]'
            }`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak Ada Catatan Transaksi"
          description="Tidak ditemukan riwayat mutasi kas yang sesuai dengan filter pencarian."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keterangan Transaksi</TableHead>
              <TableHead>Kategori / Program</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis Mutasi</TableHead>
              <TableHead className="text-right">Nominal (IDR)</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((trx) => {
              const isIncome = trx.type === 'INCOME';
              return (
                <TableRow key={trx.id}>
                  <TableCell>
                    <Link
                      href={`/finance/${trx.id}`}
                      className="font-semibold text-[#352A28] hover:text-[#6E2639] block"
                    >
                      {trx.description}
                    </Link>
                    <span className="text-[11px] text-[#8A817B]">
                      {trx.id} &bull; Dicatat oleh {trx.recordedBy}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-medium text-[#352A28] block">{trx.category}</span>
                    {trx.programTitle && (
                      <span className="text-[10px] text-[#6E2639] truncate block">
                        {trx.programTitle}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-[#8A817B]">
                    {formatDate(trx.date)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {isIncome ? (
                      <Badge variant="success" dot>
                        Kas Masuk
                      </Badge>
                    ) : (
                      <Badge variant="danger" dot>
                        Kas Keluar
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap font-mono font-bold">
                    <span className={isIncome ? 'text-[#2D7A4F]' : 'text-[#9B2335]'}>
                      {isIncome ? '+' : '-'} {formatCurrency(trx.amount)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <Link
                      href={`/finance/${trx.id}`}
                      className="p-1.5 text-[#8A817B] hover:text-[#6E2639] hover:bg-[#FAF7F1] rounded-md transition-colors inline-block"
                      title="Lihat Detail Transaksi"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
