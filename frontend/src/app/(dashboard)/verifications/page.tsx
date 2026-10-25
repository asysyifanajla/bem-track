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
        stageName = '1. Verifikasi Bendahara Umum (RAB Dokumen Proposal)';
        stageOrder = 1;
      } else if (p.status === 'SEKUM_REVIEW') {
        stage = 'SEKUM';
        stageName = '2. Validasi Sekretaris Umum (Administrasi & Naskah)';
        stageOrder = 2;
      } else if (p.status === 'GUBERNUR_REVIEW') {
        stage = 'GUBERNUR';
        stageName = '3. Persetujuan Gubernur BEM (Approval Final)';
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
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Hero Card */}
      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
                BEM-TRACK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight">
              Verifikasi Usulan Proposal
            </h1>
            <p className="text-xs sm:text-sm text-[#756C69] max-w-2xl leading-relaxed">
              Alur disposisi proposal kegiatan: diverifikasi berjenjang oleh <strong>Bendahara Umum</strong> (kesiapan usulan &amp; anggaran), <strong>Sekretaris Umum</strong> (validasi administrasi &amp; berkas), dan <strong>Gubernur BEM</strong> (pengesahan final / approval).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FAF7F5] border border-[#EFE8E2] px-4 py-2.5 rounded-2xl shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#4E1724]" />
            <div>
              <p className="text-[10px] text-[#756C69] font-medium leading-none">Akses Pejabat Peninjau</p>
              <p className="text-xs font-bold text-[#22161A] mt-1">
                {ROLE_LABELS[userRole] || currentUser?.role || 'Pejabat BEM'}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Stage Visual Pipeline Guide */}
        <div className="pt-4 border-t border-[#EFE8E2]/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-white border border-[#EFE8E2] text-[#4E1724] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              1
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[#22161A] truncate">Tahap 1: Bendum</p>
              <p className="text-[11px] text-[#756C69] truncate">Kesiapan alokasi, anggaran &amp; usulan</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-white border border-[#EFE8E2] text-[#4E1724] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              2
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[#22161A] truncate">Tahap 2: Sekum</p>
              <p className="text-[11px] text-[#756C69] truncate">Kelengkapan berkas &amp; naskah dinas</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-white border border-[#EFE8E2] text-[#4E1724] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              3
            </span>
            <div className="min-w-0">
              <p className="font-bold text-[#22161A] truncate">Tahap 3: Gubernur</p>
              <p className="text-[11px] text-[#756C69] truncate">Persetujuan &amp; pengesahan eksekutif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-[#4E1724] text-white shadow-xs'
              : 'bg-white border border-[#EFE8E2] text-[#22161A] hover:bg-[#FAF7F5]'
          }`}
        >
          Semua Proposal ({queue.length})
        </button>

        {myPendingCount > 0 && (
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-[#4E1724] text-white shadow-xs'
                : 'bg-[#FAF0F3] border border-[#4E1724]/20 text-[#4E1724] hover:bg-[#FAF0F3]/80'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4E1724] animate-pulse" />
            <span>Perlu Tindakan Saya ({myPendingCount})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-[#4E1724] text-white shadow-xs'
              : 'bg-white border border-[#EFE8E2] text-[#22161A] hover:bg-[#FAF7F5]'
          }`}
        >
          Sedang Ditinjau
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'APPROVED'
              ? 'bg-[#4E1724] text-white shadow-xs'
              : 'bg-white border border-[#EFE8E2] text-[#22161A] hover:bg-[#FAF7F5]'
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
        <div className="space-y-4">
          {filteredQueue.map((item) => {
            const userCanAct = canActOn(item.stage, item.status);

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] transition-all space-y-4 ${
                  userCanAct
                    ? 'border-[#4E1724]/40 ring-2 ring-[#4E1724]/10'
                    : 'border-[#EFE8E2]'
                }`}
              >
                {/* Card Top: ID, Status, and Priority Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#4E1724] bg-[#FAF0F3] px-2.5 py-0.5 rounded-full border border-[#4E1724]/10">
                      {item.id}
                    </span>
                    <span className="text-[11px] text-[#756C69]">
                      Diajukan {formatDate(item.submittedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {userCanAct && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FEF7EC] border border-[#FDE68A]/60 text-[#B45309] px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
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
                    className="text-base sm:text-lg font-bold text-[#22161A] hover:text-[#4E1724] transition-colors block"
                  >
                    {item.programTitle}
                  </Link>
                  <p className="text-xs text-[#756C69] mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer Info & Direct Action */}
                <div className="pt-3.5 border-t border-[#EFE8E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#756C69]">
                    <span className="flex items-center gap-1.5 text-[#22161A] font-semibold">
                      <User className="w-3.5 h-3.5 text-[#4E1724]" />
                      <span>{item.departemen} &bull; {item.submittedBy}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#756C69]" />
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
