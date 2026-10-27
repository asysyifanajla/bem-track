'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Filter,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  FileText,
  Users,
  Megaphone,
  Eye,
  Landmark,
  Building2,
  CheckCircle2,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { getMockPrograms } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { UserRole, ROLE_LABELS } from '@/types/auth';
import { canVerifyAdmin, canVerifyBudget, canApproveExecutive } from '@/lib/permissions';
import { useCurrentUser } from '@/hooks/useCurrentUser';

type TabKey = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED';
type StageKey = 'ALL' | 'BENDUM' | 'SEKUM' | 'GUBERNUR' | 'APPROVED' | 'REVISION';

interface StageOption {
  value: StageKey;
  label: string;
}

const STAGE_OPTIONS: StageOption[] = [
  { value: 'ALL', label: 'Semua tahap' },
  { value: 'BENDUM', label: 'Tahap 1: Bendum' },
  { value: 'SEKUM', label: 'Tahap 2: Sekum' },
  { value: 'GUBERNUR', label: 'Tahap 3: Gubernur' },
  { value: 'APPROVED', label: 'Disetujui' },
  { value: 'REVISION', label: 'Perlu Revisi' },
];

export default function VerificationsPage() {
  const currentUser = useCurrentUser();
  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;

  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageKey>('ALL');
  const [stageDropdownOpen, setStageDropdownOpen] = useState(false);

  const programs = getMockPrograms();

  // Map programs to verification items
  const queue = useMemo(() => {
    return programs
      .map((p) => {
        let stage: 'BENDUM' | 'SEKUM' | 'GUBERNUR' | 'APPROVED' | 'REVISION' | null = null;
        let stageName = '';

        if (p.status === 'BENDUM_REVIEW' || p.status === 'SUBMITTED') {
          stage = 'BENDUM';
          stageName = 'Tahap 1: Bendum (RAB Dokumen Proposal)';
        } else if (p.status === 'SEKUM_REVIEW') {
          stage = 'SEKUM';
          stageName = 'Tahap 2: Sekum (Administrasi & Berkas)';
        } else if (p.status === 'GUBERNUR_REVIEW') {
          stage = 'GUBERNUR';
          stageName = 'Tahap 3: Gubernur (Approval Final)';
        } else if (p.status === 'APPROVED') {
          stage = 'APPROVED';
          stageName = 'Selesai: Telah Disetujui';
        } else if (p.status === 'REVISION') {
          stage = 'REVISION';
          stageName = 'Catatan Revisi: Perbaikan Pengurus';
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
        };
      })
      .filter((item) => item.stage !== null);
  }, [programs]);

  // Check if current authenticated user has action rights on this item
  const canActOn = (itemStage: string | null, status: string) => {
    if (status === 'APPROVED' || status === 'REJECTED') return false;
    if (itemStage === 'SEKUM') return canVerifyAdmin(userRole);
    if (itemStage === 'BENDUM') return canVerifyBudget(userRole);
    if (itemStage === 'GUBERNUR') return canApproveExecutive(userRole);
    return false;
  };

  // Counts for tabs
  const allCount = queue.length;
  const pendingCount = queue.filter((item) => canActOn(item.stage, item.status)).length;

  // Filtered queue based on active tab, search, and stage filter
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      // 1. Status tab filter
      if (activeTab === 'PENDING') {
        if (!canActOn(item.stage, item.status)) return false;
      } else if (activeTab === 'IN_PROGRESS') {
        if (item.status === 'APPROVED' || item.status === 'REJECTED') return false;
      } else if (activeTab === 'APPROVED') {
        if (item.status !== 'APPROVED') return false;
      }

      // 2. Stage filter
      if (stageFilter !== 'ALL') {
        if (stageFilter === 'APPROVED' && item.status !== 'APPROVED') return false;
        if (stageFilter === 'REVISION' && item.status !== 'REVISION') return false;
        if (['BENDUM', 'SEKUM', 'GUBERNUR'].includes(stageFilter) && item.stage !== stageFilter) {
          return false;
        }
      }

      // 3. Search query filter (matches title and proposal code)
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchTitle = item.programTitle.toLowerCase().includes(q);
        const matchCode = item.id.toLowerCase().includes(q);
        const matchDept = item.departemen.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchDept) return false;
      }

      return true;
    });
  }, [queue, activeTab, stageFilter, search, userRole]);

  // Status configuration matching the reference mockup
  const getStatusBadgeConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Disetujui',
          dotClass: 'bg-[#12B76A]',
          badgeClass: 'bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647]',
        };
      case 'SEKUM_REVIEW':
        return {
          label: 'Sedang Ditinjau',
          dotClass: 'bg-[#7F56D9]',
          badgeClass: 'bg-[#F4F3FF] border border-[#D9D6FE] text-[#5925DC]',
        };
      case 'GUBERNUR_REVIEW':
      case 'BENDUM_REVIEW':
        return {
          label: 'Menunggu Persetujuan',
          dotClass: 'bg-[#F79009]',
          badgeClass: 'bg-[#FEF6EE] border border-[#FEE4C8] text-[#B54708]',
        };
      case 'REVISION':
        return {
          label: 'Perlu Revisi',
          dotClass: 'bg-[#F04438]',
          badgeClass: 'bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318]',
        };
      case 'REJECTED':
        return {
          label: 'Ditolak',
          dotClass: 'bg-[#D92D20]',
          badgeClass: 'bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318]',
        };
      case 'SUBMITTED':
        return {
          label: 'Diajukan',
          dotClass: 'bg-[#0BA5EC]',
          badgeClass: 'bg-[#F0F9FF] border border-[#B9E6FE] text-[#026AA2]',
        };
      default:
        return {
          label: status,
          dotClass: 'bg-gray-400',
          badgeClass: 'bg-gray-50 border border-gray-200 text-gray-700',
        };
    }
  };

  // Department code and icon extraction
  const getDeptDisplay = (dept: string) => {
    if (!dept) return { code: 'BEM', icon: Building2 };
    const shortCode = dept.split(' — ')[0].trim().split(' ')[0].trim();

    switch (shortCode) {
      case 'IPO':
        return { code: 'IPO', icon: Landmark };
      case 'KONEKS':
        return { code: 'KONEKS', icon: Users };
      case 'ADVO':
        return { code: 'ADVO', icon: Megaphone };
      case 'VISINFO':
        return { code: 'VISINFO', icon: Eye };
      default:
        return { code: shortCode || 'BEM', icon: Building2 };
    }
  };

  // Left square container icon selection
  const getProposalIcon = (item: { categories?: string[]; departemen?: string; programTitle?: string }) => {
    const dept = item.departemen?.split(' ')[0] || '';
    const cats = item.categories || [];

    if (dept === 'KONEKS' || cats.includes('COMMUNITY_SERVICE_RELATIONS')) {
      return <Users className="w-5 h-5 text-[#4E1724]" />;
    }
    if (dept === 'ADVO') {
      return <Megaphone className="w-5 h-5 text-[#4E1724]" />;
    }
    return <FileText className="w-5 h-5 text-[#4E1724]" />;
  };

  // User role display label
  const roleDisplayName = ROLE_LABELS[userRole] || currentUser?.role || 'Gubernur BEM';

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header (Compact, without stage tracker) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
              BEM-TRACK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight">
            Verifikasi Proposal
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
            Tinjau dan proses pengajuan program kerja.
          </p>
        </div>

        {/* Subtle Role Indicator */}
        <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-xs border border-[#EFE8E2] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shrink-0 shadow-2xs self-start">
          <ShieldCheck className="w-4 h-4 text-[#4E1724]" />
          <span className="text-xs text-[#756C69]">
            Peran: <strong className="font-bold text-[#4E1724]">{roleDisplayName}</strong>
          </span>
        </div>
      </div>

      {/* 2. Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Tab: Semua */}
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'ALL'
              ? 'bg-[#4E1724] text-white shadow-xs'
              : 'bg-white border border-[#EFE8E2] text-[#4D3F43] hover:bg-[#FAF7F5]'
          }`}
        >
          <span>Semua</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'ALL'
                ? 'bg-white text-[#4E1724]'
                : 'bg-[#F2ECE7] text-[#4E1724]'
            }`}
          >
            {allCount}
          </span>
        </button>

        {/* Tab: Perlu Tindakan Saya */}
        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'bg-[#4E1724] text-white shadow-xs'
              : 'bg-white border border-[#EFE8E2] text-[#4D3F43] hover:bg-[#FAF7F5]'
          }`}
        >
          <span>Perlu Tindakan Saya</span>
          {pendingCount > 0 && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'PENDING'
                  ? 'bg-white text-[#4E1724]'
                  : 'bg-[#FAF0F3] text-[#4E1724] border border-[#4E1724]/20'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        {/* Tab: Sedang Ditinjau */}
        <button
          type="button"
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-[#4E1724] text-white shadow-xs'
              : 'bg-white border border-[#EFE8E2] text-[#4D3F43] hover:bg-[#FAF7F5]'
          }`}
        >
          <span>Sedang Ditinjau</span>
        </button>

        {/* Tab: Disetujui */}
        <button
          type="button"
          onClick={() => setActiveTab('APPROVED')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'APPROVED'
              ? 'bg-[#4E1724] text-white shadow-xs'
              : 'bg-white border border-[#EFE8E2] text-[#4D3F43] hover:bg-[#FAF7F5]'
          }`}
        >
          <span>Disetujui</span>
        </button>
      </div>

      {/* 3. Search and Stage Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89F91]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama program atau kode..."
            className="w-full bg-white border border-[#EFE8E2] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#22161A] placeholder:text-[#A89F91] focus:outline-none focus:border-[#4E1724] focus:ring-2 focus:ring-[#4E1724]/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-[#22161A] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stage Filter Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setStageDropdownOpen(!stageDropdownOpen)}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3 bg-white border border-[#EFE8E2] px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-[#22161A] hover:bg-[#FAF7F5] focus:outline-none focus:border-[#4E1724] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#756C69]" />
              <span>{STAGE_OPTIONS.find((opt) => opt.value === stageFilter)?.label || 'Semua tahap'}</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#756C69] transition-transform ${
                stageDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {stageDropdownOpen && (
            <>
              {/* Click outside backdrop */}
              <div
                className="fixed inset-0 z-20"
                onClick={() => setStageDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-60 sm:w-64 bg-white border border-[#EFE8E2] rounded-2xl shadow-lg py-1.5 z-30 animate-fade-in text-xs font-medium text-[#22161A]">
                {STAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStageFilter(opt.value);
                      setStageDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-[#FAF7F5] transition-colors flex items-center justify-between cursor-pointer ${
                      stageFilter === opt.value
                        ? 'bg-[#FAF0F3] text-[#4E1724] font-semibold'
                        : 'text-[#4D3F43]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {stageFilter === opt.value && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4E1724]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Proposal Horizontal Row Cards List */}
      {filteredQueue.length === 0 ? (
        <EmptyState
          title="Tidak Ada Proposal Ditemukan"
          description="Tidak ada usulan proposal kegiatan yang sesuai dengan kriteria filter saat ini."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setActiveTab('ALL');
                setSearch('');
                setStageFilter('ALL');
              }}
            >
              Reset Semua Filter
            </Button>
          }
        />
      ) : (
        <div className="space-y-3 sm:space-y-3.5">
          {filteredQueue.map((item) => {
            const statusInfo = getStatusBadgeConfig(item.status);
            const deptInfo = getDeptDisplay(item.departemen);
            const DeptIcon = deptInfo.icon;

            return (
              <div
                key={item.id}
                className="bg-white border border-[#EFE8E2] rounded-2xl sm:rounded-3xl p-4 sm:px-6 sm:py-4.5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_18px_-4px_rgba(78,23,36,0.06)] hover:border-[#4E1724]/25 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left Section: Icon + Identity (Code & Title) */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 lg:w-[42%] xl:w-[45%]">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF0F3] border border-[#F5D5DE]/60 flex items-center justify-center shrink-0 text-[#4E1724] shadow-2xs">
                    {getProposalIcon(item)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[11px] font-bold font-mono tracking-wider text-[#7A2238] bg-[#FAF0F3] px-2.5 py-0.5 rounded-full inline-block border border-[#F5D5DE]/60">
                      {item.id}
                    </span>
                    <Link
                      href={`/verifications/${item.id}`}
                      className="text-sm sm:text-base font-bold text-[#22161A] hover:text-[#4E1724] transition-colors leading-snug line-clamp-1 block"
                      title={item.programTitle}
                    >
                      {item.programTitle}
                    </Link>
                  </div>
                </div>

                {/* Middle Section: Meta Details (Dept, Date, Status) */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-5 lg:flex-1 lg:justify-between">
                  {/* Department */}
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0F3] border border-[#F5D5DE]/60 text-xs font-bold text-[#7A2238]">
                      <DeptIcon className="w-3.5 h-3.5 text-[#7A2238]" />
                      <span>{deptInfo.code}</span>
                    </span>
                  </div>

                  {/* Implementation Date */}
                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#756C69]">
                    <Calendar className="w-3.5 h-3.5 text-[#756C69]" />
                    <span>
                      {formatDate(item.plannedDate, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Verification Status */}
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>
                </div>

                {/* Right Section: Action Button */}
                <div className="shrink-0 flex items-center justify-end pt-2 lg:pt-0 border-t border-[#EFE8E2]/60 lg:border-t-0">
                  <Link href={`/verifications/${item.id}`} className="w-full sm:w-auto">
                    <button
                      type="button"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-[#4E1724] bg-white text-[#4E1724] hover:bg-[#FAF0F3] active:scale-[0.98] transition-all text-xs font-semibold shrink-0 cursor-pointer shadow-2xs group"
                    >
                      <span>Tinjau</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
