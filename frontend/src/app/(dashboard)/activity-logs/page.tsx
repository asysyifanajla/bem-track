'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { getMockActivityLogs } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import { ROLE_LABELS, UserRole } from '@/types/auth';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function ActivityLogsPage() {
  const currentUser = useCurrentUser();
  const [logs] = useState(() => getMockActivityLogs());
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const isGubernur = currentUser.role === 'GUBERNUR';

  // Role Access Guard: Exclusively accessible to GUBERNUR
  if (!isGubernur) {
    return (
      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-8 max-w-xl mx-auto text-center space-y-4 my-12 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] animate-fade-in font-sans">
        <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] border border-[#DC2626]/20 text-[#DC2626] flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-[#22161A] tracking-tight">
            Akses Dibatasi Khusus Gubernur BEM
          </h2>
          <p className="text-xs sm:text-sm text-[#756C69] leading-relaxed max-w-md mx-auto">
            Log Riwayat Aktivitas dan audit trail organisasi bersifat konfidensial dan hanya dapat diakses serta dikelola langsung oleh <strong>Gubernur BEM</strong>.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/dashboard">
            <Button size="sm" variant="secondary" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase()));

    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchSearch && matchModule;
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
            Log Riwayat Aktivitas
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
            Rekam jejak tindakan fungsionaris, persetujuan birokrasi, mutasi kas, dan mutasi arsip
          </p>
        </div>

        <span className="text-[11px] font-bold bg-[#FAF0F3] text-[#4E1724] border border-[#4E1724]/20 px-3 py-1 rounded-full shrink-0">
          Audit Trail Read-Only
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EFE8E2] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C69]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pengguna, tindakan, atau rincian..."
            className="w-full bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl pl-10 pr-3.5 py-2 text-xs text-[#22161A] placeholder-[#A39893] focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-[#FAF7F5] border border-[#EFE8E2] text-xs font-medium text-[#22161A] rounded-2xl px-3.5 py-2 focus:outline-hidden focus:border-[#4E1724]"
        >
          <option value="ALL">Semua Modul</option>
          <option value="Programs">Program Kerja</option>
          <option value="Verifications">Verifikasi</option>
          <option value="Finance">Kas &amp; Keuangan</option>
          <option value="Archives">Arsip Dokumen</option>
          <option value="Vault">BEM Vault</option>
          <option value="Timeline">Kalender Agenda</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak Ada Riwayat Aktivitas"
          description="Tidak ditemukan log aktivitas yang sesuai dengan filter pencarian."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('');
                setModuleFilter('ALL');
              }}
            >
              Reset Filter
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Aktivitas Birokrasi</TableHead>
              <TableHead>Modul</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Keterangan Singkat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <p className="text-xs font-bold text-[#22161A] leading-tight">
                    {log.userName}
                  </p>
                  <span className="text-[11px] text-[#756C69]">
                    {ROLE_LABELS[log.userRole as UserRole] || log.userRole}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-semibold text-xs text-[#22161A]">{log.action}</span>
                </TableCell>

                <TableCell>
                  <span className="text-[11px] font-medium bg-[#FAF7F5] text-[#22161A] border border-[#EFE8E2] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {log.module}
                  </span>
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs text-[#756C69]">
                  {formatDateTime(log.timestamp)}
                </TableCell>

                <TableCell>
                  <span className="text-xs text-[#756C69] line-clamp-2">
                    {log.details || '-'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
