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
      <div className="max-w-2xl mx-auto space-y-6 py-10 animate-fade-in text-center font-sans">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF0F3] border border-[#F2ECE4] text-[#4E1724] flex items-center justify-center mx-auto shadow-2xs">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#22161A] tracking-tight">
            Akses Pengelolaan Kas Dibatasi
          </h2>
          <p className="text-xs sm:text-sm text-[#756C69] max-w-md mx-auto leading-relaxed">
            Halaman pencatatan dan pengelolaan transaksi kas detail dikhususkan untuk{' '}
            <strong className="text-[#22161A]">Bendahara Umum</strong>. Anda dapat memantau ringkasan
            keuangan organisasi melalui Dashboard.
          </p>
        </div>

        {/* Informative Summary */}
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 text-left space-y-4 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          <p className="text-xs font-bold text-[#756C69] uppercase tracking-wider">
            Ringkasan Keuangan Organisasi (Publik BPH)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-[#FAF7F5] rounded-2xl border border-[#EFE8E2]">
              <span className="text-[10px] font-semibold text-[#756C69] uppercase tracking-wider block">Total Kas Masuk</span>
              <span className="text-base font-bold text-[#059669] font-mono mt-0.5 block">
                {formatCurrency(totalIncome)}
              </span>
            </div>
            <div className="p-4 bg-[#FAF7F5] rounded-2xl border border-[#EFE8E2]">
              <span className="text-[10px] font-semibold text-[#756C69] uppercase tracking-wider block">Realisasi Pengeluaran</span>
              <span className="text-base font-bold text-[#DC2626] font-mono mt-0.5 block">
                {formatCurrency(totalExpense)}
              </span>
            </div>
            <div className="p-4 bg-[#FAF0F3] rounded-2xl border border-[#4E1724]/20">
              <span className="text-[10px] font-semibold text-[#4E1724] uppercase tracking-wider block">Saldo Kas Saat Ini</span>
              <span className="text-base font-bold text-[#4E1724] font-mono mt-0.5 block">
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
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-[#EFE8E2]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
              BEM-TRACK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight">
            Pengelolaan Kas &amp; Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#756C69] uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/60 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#059669] font-mono tracking-tight">
              {formatCurrency(totalIncome)}
            </p>
            <span className="text-xs text-[#756C69] mt-1.5 block">Dekanat, Iuran &amp; Sponsor</span>
          </div>
        </div>

        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#756C69] uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]/60 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#DC2626] font-mono tracking-tight">
              {formatCurrency(totalExpense)}
            </p>
            <span className="text-xs text-[#756C69] mt-1.5 block">Realisasi operasional kegiatan</span>
          </div>
        </div>

        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#756C69] uppercase tracking-wider">
              Saldo Bersih Kas
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FBF6F0] text-[#8B263E] border border-[#F2ECE4] flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#4E1724] font-mono tracking-tight">
              {formatCurrency(balance)}
            </p>
            <span className="text-xs text-[#756C69] mt-1.5 block">Kas aktif terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#EFE8E2] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C69]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari transaksi, nomor kwitansi, atau keterangan..."
            className="w-full bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl pl-10 pr-3.5 py-2 text-xs text-[#22161A] placeholder-[#A39893] focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-[#4E1724] text-white shadow-2xs'
                : 'bg-[#FAF7F5] border border-[#EFE8E2] text-[#756C69] hover:text-[#22161A] hover:bg-[#F2ECE4]'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('INCOME')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === 'INCOME'
                ? 'bg-[#059669] text-white shadow-2xs'
                : 'bg-[#FAF7F5] border border-[#EFE8E2] text-[#059669] hover:bg-[#ECFDF5]'
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setTypeFilter('EXPENSE')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === 'EXPENSE'
                ? 'bg-[#DC2626] text-white shadow-2xs'
                : 'bg-[#FAF7F5] border border-[#EFE8E2] text-[#DC2626] hover:bg-[#FEF2F2]'
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
                      className="font-bold text-[#22161A] hover:text-[#4E1724] transition-colors block"
                    >
                      {trx.description}
                    </Link>
                    <span className="text-[11px] text-[#756C69]">
                      {trx.id} &bull; Dicatat oleh {trx.recordedBy}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-semibold text-[#22161A] block">{trx.category}</span>
                    {trx.programTitle && (
                      <span className="text-[11px] text-[#756C69] truncate block max-w-xs">
                        {trx.programTitle}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-[#756C69]">
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
                    <span className={isIncome ? 'text-[#059669]' : 'text-[#DC2626]'}>
                      {isIncome ? '+' : '-'} {formatCurrency(trx.amount)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <Link
                      href={`/finance/${trx.id}`}
                      className="p-1.5 text-[#756C69] hover:text-[#4E1724] hover:bg-[#FAF7F5] rounded-xl transition-colors inline-block"
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
