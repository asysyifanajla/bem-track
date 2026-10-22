'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { getMockActivityLogs } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import { ROLE_LABELS, UserRole } from '@/types/auth';

export default function ActivityLogsPage() {
  const [logs] = useState(() => getMockActivityLogs());
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase()));

    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchSearch && matchModule;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8E0D7]">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
            Log Riwayat Aktivitas
          </h2>
          <span className="text-[10px] font-semibold bg-[#FAF7F1] border border-[#E8E0D7] text-[#8A817B] px-2 py-0.5 rounded-sm">
            Audit Trail Read-Only
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
          Rekam jejak tindakan fungsionaris, persetujuan birokrasi, mutasi kas, dan mutasi arsip
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E0D7] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A817B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pengguna, tindakan, atau rincian..."
            className="w-full bg-[#FAF7F1]/60 border border-[#E8E0D7] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#352A28] placeholder-[#8A817B]/60 focus:bg-white focus:outline-hidden focus:border-[#6E2639] transition-colors"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-[#FAF7F1] border border-[#E8E0D7] text-xs text-[#352A28] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#6E2639]"
        >
          <option value="ALL">Semua Modul</option>
          <option value="Programs">Program Kerja</option>
          <option value="Verifications">Verifikasi</option>
          <option value="Finance">Kas & Keuangan</option>
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
                  <p className="text-xs font-semibold text-[#352A28] leading-tight">
                    {log.userName}
                  </p>
                  <span className="text-[11px] text-[#8A817B]">
                    {ROLE_LABELS[log.userRole as UserRole] || log.userRole}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-xs text-[#352A28]">{log.action}</span>
                </TableCell>

                <TableCell>
                  <span className="text-[11px] font-semibold bg-[#FAF7F1] text-[#352A28] border border-[#E8E0D7] px-2 py-0.5 rounded-sm whitespace-nowrap">
                    {log.module}
                  </span>
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs text-[#8A817B]">
                  {formatDateTime(log.timestamp)}
                </TableCell>

                <TableCell>
                  <span className="text-xs text-[#8A817B] line-clamp-2">
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
