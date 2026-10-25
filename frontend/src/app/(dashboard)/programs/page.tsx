'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit3 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { STATUS_CONFIG, PROGRAM_CATEGORIES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { getMockPrograms } from '@/lib/mockData';
import { canCreateProgram } from '@/lib/permissions';
import { ProgramCategory } from '@/types/program';

export default function ProgramsPage() {
  const [currentUser] = useState<{ role: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const allPrograms = getMockPrograms();

  const filteredPrograms = allPrograms.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.departemen.toLowerCase().includes(search.toLowerCase()) ||
      p.submittedBy.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchCategory =
      categoryFilter === 'ALL' || p.categories.includes(categoryFilter as ProgramCategory);

    return matchSearch && matchStatus && matchCategory;
  });

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

  const calculateProgress = (status: string) => {
    switch (status) {
      case 'DRAFT': return 10;
      case 'SUBMITTED': return 25;
      case 'BENDUM_REVIEW': return 45; // Tahap 1: Bendum (Pending Sekum)
      case 'SEKUM_REVIEW': return 70;  // Tahap 2: Sekum (Pending Approval)
      case 'GUBERNUR_REVIEW': return 90; // Tahap 3: Gubernur (Pending Approval)
      case 'APPROVED': return 100; // Selesai: Approval
      case 'REVISION': return 40;
      case 'REJECTED': return 100;
      default: return 20;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-[#EFE8E2]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
              BEM-TRACK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight">
            Program Kerja
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
            Daftar seluruh program kerja dan progres tahapan verifikasi birokrasi
          </p>
        </div>

        {canCreateProgram(currentUser?.role) && (
          <Link href="/programs/create">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Ajukan Program Baru
            </Button>
          </Link>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EFE8E2] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C69]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama proker, pengaju, atau departemen..."
            className="w-full bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl pl-10 pr-3.5 py-2 text-xs text-[#22161A] placeholder-[#A39893] focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF7F5] border border-[#EFE8E2] text-xs font-medium text-[#22161A] rounded-2xl px-3 py-2 focus:outline-hidden focus:border-[#4E1724]"
          >
            <option value="ALL">Semua Status</option>
            <option value="BENDUM_REVIEW">Pending Sekum</option>
            <option value="SEKUM_REVIEW">Pending Approval (Sekum)</option>
            <option value="GUBERNUR_REVIEW">Pending Approval (Gubernur)</option>
            <option value="APPROVED">Approval</option>
            <option value="REVISION">Perlu Revisi</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF7F5] border border-[#EFE8E2] text-xs font-medium text-[#22161A] rounded-2xl px-3 py-2 focus:outline-hidden focus:border-[#4E1724]"
          >
            <option value="ALL">Semua Kategori</option>
            {PROGRAM_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Program Table */}
      {filteredPrograms.length === 0 ? (
        <EmptyState
          title="Tidak Ada Program Ditemukan"
          description="Tidak ada program kerja yang cocok dengan filter pencarian saat ini."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
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
              <TableHead>Nama Program Kerja</TableHead>
              <TableHead>Departemen / Pengaju</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progres</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrograms.map((prog) => {
              const pct = calculateProgress(prog.status);
              return (
                <TableRow key={prog.id}>
                  <TableCell>
                    <Link
                      href={`/programs/${prog.id}`}
                      className="font-bold text-[#22161A] hover:text-[#4E1724] transition-colors block"
                    >
                      {prog.title}
                    </Link>
                    <span className="text-[11px] text-[#756C69]">
                      {formatDate(prog.plannedDate)} &bull; {prog.location || 'FKI UMS'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs font-semibold text-[#22161A]">{prog.departemen}</p>
                    <span className="text-[11px] text-[#756C69]">{prog.submittedBy}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {prog.categories.map((c) => {
                        const found = (PROGRAM_CATEGORIES as readonly { value: string; label: string; shortLabel?: string }[]).find(
                          (cat) => cat.value === c
                        );
                        const labelText = found ? (found.shortLabel || found.label) : c;
                        return (
                          <span
                            key={c}
                            className="text-[10px] font-medium bg-[#FAF7F5] text-[#22161A] border border-[#EFE8E2] px-2 py-0.5 rounded-full"
                            title={found?.label || c}
                          >
                            {labelText}
                          </span>
                        );
                      })}
                    </div>
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(prog.status as keyof typeof STATUS_CONFIG)}
                  </TableCell>

                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] text-[#756C69] mb-1 font-medium">
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-[#EFE8E2] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#4E1724] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/programs/${prog.id}`}
                        className="p-1.5 text-[#756C69] hover:text-[#4E1724] hover:bg-[#FAF7F5] rounded-xl transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/programs/${prog.id}/edit`}
                        className="p-1.5 text-[#8A817B] hover:text-[#352A28] hover:bg-[#FAF7F1] rounded-md transition-colors"
                        title="Sunting Program"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </div>
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
