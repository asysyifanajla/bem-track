'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Calendar,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { getMockPrograms } from '@/lib/mockData';
import { STATUS_CONFIG } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { UserRole, ROLE_LABELS } from '@/types/auth';
import { canVerifyAdmin, canVerifyBudget, canApproveExecutive } from '@/lib/permissions';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function VerificationsPage() {
  const currentUser = useCurrentUser();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED'>('ALL');

  const programs = getMockPrograms();
  const userRole = currentUser?.role as UserRole;

  // Map programs to verification items
  const queue = programs
    .map((p) => {
      let stage: 'SEKUM' | 'BENDUM' | 'GUBERNUR' | null = null;
      let stageName = '';
      let stageOrder = 1;

      if (p.status === 'BENDUM_REVIEW') {
        stage = 'BENDUM';
        stageName = '1. Review Bendahara Umum (Pending Sekum)';
        stageOrder = 1;
      } else if (p.status === 'SEKUM_REVIEW') {
        stage = 'SEKUM';
        stageName = '2. Review Sekretaris Umum (Pending Approval)';
        stageOrder = 2;
      } else if (p.status === 'GUBERNUR_REVIEW') {
        stage = 'GUBERNUR';
        stageName = '3. Review Gubernur BEM (Pending Approval)';
        stageOrder = 3;
      } else if (p.status === 'APPROVED') {
        stage = 'GUBERNUR';
        stageName = 'Selesai: Telah Disetujui Lengkap (Approval)';
        stageOrder = 4;
      } else if (p.status === 'REVISION') {
        stage = 'BENDUM';
        stageName = 'Catatan Revisi: Perbaikan Pengurus';
        stageOrder = 1;
      }

      return {
        id: p.id,
        programId: p.id,
        programTitle: p.title,
        departemen: p.departemen,
        description: p.description,
        submittedBy: p.submittedBy,
        submittedAt: p.submittedAt,
        plannedDate: p.plannedDate,
        status: p.status,
        categories: p.categories,
        stage,
        stageName,
        stageOrder,
      };
    })
    .filter((item) => item.stage !== null);

  const canActOn = (itemStage: string | null, status: string) => {
    if (status === 'APPROVED') return false;
    if (itemStage === 'SEKUM') return canVerifyAdmin(userRole);
    if (itemStage === 'BENDUM') return canVerifyBudget(userRole);
    if (itemStage === 'GUBERNUR') return canApproveExecutive(userRole);
    return false;
  };

  const filteredQueue = queue.filter((item) => {
    const isActable = canActOn(item.stage, item.status);
    if (activeTab === 'PENDING') return isActable;
    if (activeTab === 'IN_PROGRESS') return item.status !== 'APPROVED';
    if (activeTab === 'APPROVED') return item.status === 'APPROVED';
    return true;
  });

  const myPendingCount = queue.filter((item) => canActOn(item.stage, item.status)).length;

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
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Hero Card */}
      <div className="bg-white border border-[#E8DFD3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6E2639]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#8A817B]">
                Birokrasi BEM FKI UMS &bull; Pusat Verifikasi Berjenjang
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
              Verifikasi Usulan Proposal
            </h1>
            <p className="text-xs sm:text-sm text-[#8A817B] max-w-2xl leading-relaxed">
              Alur disposisi proposal kegiatan: diverifikasi berjenjang oleh <strong>Bendahara Umum</strong> (kesiapan usulan &amp; anggaran), <strong>Sekretaris Umum</strong> (validasi administrasi &amp; berkas), dan <strong>Gubernur BEM</strong> (pengesahan final / approval).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF7F1] border border-[#E8DFD3] px-3.5 py-2 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#6E2639]" />
            <div>
              <p className="text-[10px] text-[#8A817B] font-medium leading-none">Akses Pejabat Peninjau</p>
              <p className="text-xs font-bold text-[#352A28] mt-0.5">
                {ROLE_LABELS[userRole] || currentUser?.role || 'Pejabat BEM'}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Stage Visual Pipeline Guide */}
        <div className="pt-3 border-t border-[#E8DFD3]/80 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#FAF7F1] border border-[#E8DFD3] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-white border border-[#E8DFD3] text-[#6E2639] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              1
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[#352A28] truncate">Tahap 1: Bendum</p>
              <p className="text-[10px] text-[#8A817B] truncate">Kesiapan alokasi, anggaran &amp; usulan</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF7F1] border border-[#E8DFD3] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-white border border-[#E8DFD3] text-[#6E2639] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              2
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[#352A28] truncate">Tahap 2: Sekum</p>
              <p className="text-[10px] text-[#8A817B] truncate">Kelengkapan berkas &amp; naskah dinas</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF7F1] border border-[#E8DFD3] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-white border border-[#E8DFD3] text-[#6E2639] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              3
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[#352A28] truncate">Tahap 3: Gubernur</p>
              <p className="text-[10px] text-[#8A817B] truncate">Persetujuan &amp; pengesahan eksekutif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-[#6E2639] text-white shadow-xs'
              : 'bg-white border border-[#E8DFD3] text-[#352A28] hover:bg-[#FAF7F1]'
          }`}
        >
          Semua Proposal ({queue.length})
        </button>

        {myPendingCount > 0 && (
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-[#6E2639] text-white shadow-xs'
                : 'bg-[#F5EEF0] border border-[#6E2639]/30 text-[#6E2639] hover:bg-[#F5EEF0]/80'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#6E2639] animate-pulse" />
            <span>Perlu Tindakan Saya ({myPendingCount})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-[#6E2639] text-white shadow-xs'
              : 'bg-white border border-[#E8DFD3] text-[#352A28] hover:bg-[#FAF7F1]'
          }`}
        >
          Sedang Ditinjau
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'APPROVED'
              ? 'bg-[#6E2639] text-white shadow-xs'
              : 'bg-white border border-[#E8DFD3] text-[#352A28] hover:bg-[#FAF7F1]'
          }`}
        >
          Telah Disetujui
        </button>
      </div>

      {/* Clean Cards Pipeline List */}
      {filteredQueue.length === 0 ? (
        <EmptyState
          title="Tidak Ada Usulan dalam Antrean"
          description="Semua proposal kegiatan pada filter ini telah selesai ditinjau."
          action={
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('ALL')}>
              Lihat Semua Proposal
            </Button>
          }
        />
      ) : (
        <div className="space-y-3.5">
          {filteredQueue.map((item) => {
            const userCanAct = canActOn(item.stage, item.status);

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3.5 ${
                  userCanAct
                    ? 'border-[#6E2639]/40 ring-1 ring-[#6E2639]/15'
                    : 'border-[#E8DFD3] hover:border-[#E8DFD3]'
                }`}
              >
                {/* Card Top: ID, Status, and Priority Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#6E2639] bg-[#F5EEF0] px-2 py-0.5 rounded-sm">
                      {item.id}
                    </span>
                    <span className="text-[11px] text-[#8A817B]">
                      Diajukan {formatDate(item.submittedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {userCanAct && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#FEF8ED] border border-[#92600C]/25 text-[#92600C] px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>Menunggu Keputusan Anda</span>
                      </span>
                    )}
                    {getStatusBadge(item.status as keyof typeof STATUS_CONFIG)}
                  </div>
                </div>

                {/* Card Body: Title, Description & Metadata */}
                <div>
                  <Link
                    href={`/verifications/${item.id}`}
                    className="text-base sm:text-lg font-bold text-[#352A28] hover:text-[#6E2639] transition-colors block"
                  >
                    {item.programTitle}
                  </Link>
                  <p className="text-xs text-[#8A817B] mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer Info & Direct Action */}
                <div className="pt-3 border-t border-[#E8DFD3]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#8A817B]">
                    <span className="flex items-center gap-1.5 text-[#352A28] font-medium">
                      <User className="w-3.5 h-3.5 text-[#6E2639]" />
                      <span>{item.departemen} &bull; {item.submittedBy}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8A817B]" />
                      <span>Pelaksanaan: {formatDate(item.plannedDate)}</span>
                    </span>
                  </div>

                  <div>
                    {userCanAct ? (
                      <Link href={`/verifications/${item.id}`}>
                        <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Tinjau &amp; Putuskan
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/verifications/${item.id}`}>
                        <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Lihat Alur
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
