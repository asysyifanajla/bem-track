'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { getMockPrograms } from '@/lib/mockData';
import { STATUS_CONFIG } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { UserRole } from '@/types/auth';
import { canVerifyAdmin, canVerifyBudget, canApproveExecutive } from '@/lib/permissions';

export default function VerificationsPage() {
  const [currentUser] = useState<{ role: string; name: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [stageFilter, setStageFilter] = useState<'ALL' | 'SEKUM' | 'BENDUM' | 'GUBERNUR'>('ALL');

  const programs = getMockPrograms();

  // Map programs to verification items
  const queue = programs
    .map((p) => {
      let stage: 'SEKUM' | 'BENDUM' | 'GUBERNUR' | null = null;
      let stageName = '';
      if (p.status === 'SEKUM_REVIEW') {
        stage = 'SEKUM';
        stageName = 'Administrasi & Naskah Dinas';
      } else if (p.status === 'BENDUM_REVIEW') {
        stage = 'BENDUM';
        stageName = 'Verifikasi Anggaran (RAB)';
      } else if (p.status === 'GUBERNUR_REVIEW') {
        stage = 'GUBERNUR';
        stageName = 'Persetujuan Eksekutif Final';
      } else if (p.status === 'APPROVED') {
        stage = 'GUBERNUR';
        stageName = 'Disetujui Lengkap';
      } else if (p.status === 'REVISION') {
        stage = 'BENDUM';
        stageName = 'Dalam Perbaikan Departemen';
      }

      return {
        id: p.id,
        programId: p.id,
        programTitle: p.title,
        departemen: p.departemen,
        submittedBy: p.submittedBy,
        submittedAt: p.submittedAt,
        status: p.status,
        totalBudget: p.totalBudget,
        stage,
        stageName,
      };
    })
    .filter((item) => item.stage !== null);

  const filteredQueue = queue.filter((item) => {
    if (stageFilter === 'ALL') return true;
    return item.stage === stageFilter;
  });

  const userRole = currentUser?.role as UserRole;

  const canActOn = (itemStage: string | null, status: string) => {
    if (status === 'APPROVED') return false;
    if (itemStage === 'SEKUM') return canVerifyAdmin(userRole);
    if (itemStage === 'BENDUM') return canVerifyBudget(userRole);
    if (itemStage === 'GUBERNUR') return canApproveExecutive(userRole);
    return false;
  };

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8E0D7]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
            Verifikasi Birokrasi & Persetujuan
          </h2>
          <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
            Pusat validasi bertingkat proposal kegiatan oleh Sekretaris, Bendahara, dan Gubernur BEM
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8E0D7] rounded-lg">
          <span className="text-xs text-[#8A817B] px-2 font-medium">Peran Anda:</span>
          <span className="text-xs font-semibold bg-[#F5EEF0] text-[#6E2639] px-2.5 py-1 rounded-md">
            {currentUser?.role || 'PENGURUS'}
          </span>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E0D7] pb-3">
        <button
          onClick={() => setStageFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            stageFilter === 'ALL'
              ? 'bg-[#6E2639] text-white'
              : 'bg-white border border-[#E8E0D7] text-[#352A28] hover:bg-[#FAF7F1]'
          }`}
        >
          Semua Tahap ({queue.length})
        </button>

        <button
          onClick={() => setStageFilter('SEKUM')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            stageFilter === 'SEKUM'
              ? 'bg-[#6E2639] text-white'
              : 'bg-white border border-[#E8E0D7] text-[#352A28] hover:bg-[#FAF7F1]'
          }`}
        >
          1. Administrasi (Sekum)
        </button>

        <button
          onClick={() => setStageFilter('BENDUM')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            stageFilter === 'BENDUM'
              ? 'bg-[#6E2639] text-white'
              : 'bg-white border border-[#E8E0D7] text-[#352A28] hover:bg-[#FAF7F1]'
          }`}
        >
          2. Anggaran (Bendum)
        </button>

        <button
          onClick={() => setStageFilter('GUBERNUR')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            stageFilter === 'GUBERNUR'
              ? 'bg-[#6E2639] text-white'
              : 'bg-white border border-[#E8E0D7] text-[#352A28] hover:bg-[#FAF7F1]'
          }`}
        >
          3. Eksekutif (Gubernur)
        </button>
      </div>

      {/* Queue Table */}
      {filteredQueue.length === 0 ? (
        <EmptyState
          title="Tidak Ada Usulan dalam Antrean"
          description="Semua proposal pada tahap verifikasi ini telah selesai diproses."
          action={
            <Button variant="secondary" size="sm" onClick={() => setStageFilter('ALL')}>
              Lihat Semua Tahap
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Program Kerja</TableHead>
              <TableHead>Departemen / Pengaju</TableHead>
              <TableHead>Tahap Verifikasi</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQueue.map((item) => {
              const userCanAct = canActOn(item.stage, item.status);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link
                      href={`/verifications/${item.id}`}
                      className="font-semibold text-[#352A28] hover:text-[#6E2639] block"
                    >
                      {item.programTitle}
                    </Link>
                    <span className="text-[11px] text-[#8A817B]">
                      {item.id} &bull; {formatCurrency(item.totalBudget)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs font-medium text-[#352A28]">{item.departemen}</p>
                    <span className="text-[11px] text-[#8A817B]">{item.submittedBy}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-semibold text-[#352A28] block">
                      {item.stageName}
                    </span>
                    <span className="text-[10px] text-[#8A817B]">
                      Wewenang: {item.stage === 'SEKUM' ? 'Sekum' : item.stage === 'BENDUM' ? 'Bendum' : 'Gubernur'}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-[#8A817B]">
                    {formatDate(item.submittedAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {getStatusBadge(item.status as keyof typeof STATUS_CONFIG)}
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    {userCanAct ? (
                      <Link href={`/verifications/${item.id}`}>
                        <Button size="sm" variant="primary">
                          Tinjau & Putuskan
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/verifications/${item.id}`}>
                        <Button size="sm" variant="secondary" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                          Pantau Hasil
                        </Button>
                      </Link>
                    )}
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
