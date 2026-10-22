'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit3 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { STATUS_CONFIG, PROGRAM_CATEGORIES } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
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
      case 'SEKUM_REVIEW': return 50;
      case 'BENDUM_REVIEW': return 75;
      case 'GUBERNUR_REVIEW': return 90;
      case 'APPROVED': return 100;
      case 'REVISION': return 40;
      case 'REJECTED': return 100;
      default: return 20;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8E0D7]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
            Program Kerja Organisasi
          </h2>
          <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
            Daftar seluruh program kerja, instrumen proposal, dan progres tahapan verifikasi birokrasi
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
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E0D7] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A817B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama proker, pengaju, atau departemen..."
            className="w-full bg-[#FAF7F1]/60 border border-[#E8E0D7] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#352A28] placeholder-[#8A817B]/60 focus:bg-white focus:outline-hidden focus:border-[#6E2639] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF7F1] border border-[#E8E0D7] text-xs text-[#352A28] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#6E2639]"
          >
            <option value="ALL">Semua Status</option>
            <option value="SUBMITTED">Diajukan</option>
            <option value="SEKUM_REVIEW">Review Sekretaris</option>
            <option value="BENDUM_REVIEW">Review Bendahara</option>
            <option value="GUBERNUR_REVIEW">Review Gubernur</option>
            <option value="APPROVED">Disetujui</option>
            <option value="REVISION">Perlu Revisi</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF7F1] border border-[#E8E0D7] text-xs text-[#352A28] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#6E2639]"
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
                      className="font-semibold text-[#352A28] hover:text-[#6E2639] transition-colors block"
                    >
                      {prog.title}
                    </Link>
                    <span className="text-[11px] text-[#8A817B]">
                      {formatCurrency(prog.totalBudget)} &bull; {formatDate(prog.plannedDate)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs font-medium text-[#352A28]">{prog.departemen}</p>
                    <span className="text-[11px] text-[#8A817B]">{prog.submittedBy}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {prog.categories.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-medium bg-[#FAF7F1] text-[#352A28] border border-[#E8E0D7] px-1.5 py-0.2 rounded-sm"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(prog.status as keyof typeof STATUS_CONFIG)}
                  </TableCell>

                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] text-[#8A817B] mb-0.5">
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-[#E8E0D7] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#6E2639] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/programs/${prog.id}`}
                        className="p-1.5 text-[#8A817B] hover:text-[#6E2639] hover:bg-[#FAF7F1] rounded-md transition-colors"
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
