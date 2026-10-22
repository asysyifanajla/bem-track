'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  MapPin,
  Clock,
  Search,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { getMockTimeline } from '@/lib/mockData';
import { canManageTimeline } from '@/lib/permissions';
import { UserRole } from '@/types/auth';

export default function TimelinePage() {
  const [currentUser] = useState<{ role: string; name: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [events] = useState(() => getMockTimeline());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');

  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;
  const canManage = canManageTimeline(userRole);

  const filtered = events.filter((evt) => {
    const matchSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.departemen.toLowerCase().includes(search.toLowerCase()) ||
      evt.location.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || evt.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8E0D7]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
            Kalender & Agenda Kerja
          </h2>
          <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
            Jadwal kegiatan, rapat koordinasi, dan pelaksanaan program kerja BEM FKI UMS
          </p>
        </div>

        {canManage && (
          <Link href="/timeline/create">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Tambah Agenda Baru
            </Button>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E0D7] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A817B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kegiatan, lokasi, atau departemen..."
            className="w-full bg-[#FAF7F1]/60 border border-[#E8E0D7] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#352A28] placeholder-[#8A817B]/60 focus:bg-white focus:outline-hidden focus:border-[#6E2639] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#6E2639] text-white'
                : 'bg-[#FAF7F1] border border-[#E8E0D7] text-[#352A28] hover:bg-[#F3EBDD]'
            }`}
          >
            Semua ({events.length})
          </button>
          <button
            onClick={() => setStatusFilter('UPCOMING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              statusFilter === 'UPCOMING'
                ? 'bg-[#6E2639] text-white'
                : 'bg-[#FAF7F1] border border-[#E8E0D7] text-[#352A28] hover:bg-[#F3EBDD]'
            }`}
          >
            Mendatang
          </button>
        </div>
      </div>

      {/* Scannable Agenda List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak Ada Agenda Terjadwal"
          description="Tidak ditemukan jadwal kegiatan untuk kriteria pencarian ini."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((evt) => {
            const isUpcoming = evt.status === 'UPCOMING';
            const dateObj = new Date(evt.startDate);
            const dayNum = dateObj.getDate() || 15;
            const monthName = dateObj.toLocaleDateString('id-ID', { month: 'short' });

            return (
              <div
                key={evt.id}
                className="bg-white border border-[#E8E0D7] hover:border-[#6E2639]/40 rounded-xl p-4.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Visual Date Badge */}
                  <div className="w-12 h-13 rounded-lg bg-[#FAF7F1] border border-[#E8E0D7] flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-bold text-[#6E2639] leading-none">
                      {dayNum}
                    </span>
                    <span className="text-[10px] font-semibold text-[#8A817B] uppercase mt-0.5">
                      {monthName}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold bg-[#FAF7F1] text-[#6E2639] px-2 py-0.2 rounded-sm border border-[#E8E0D7]">
                        {evt.departemen}
                      </span>
                      {isUpcoming ? (
                        <Badge variant="info" dot>
                          Mendatang
                        </Badge>
                      ) : (
                        <Badge variant="success" dot>
                          Selesai
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[#352A28]">{evt.title}</h3>

                    {evt.description && (
                      <p className="text-xs text-[#8A817B] leading-relaxed line-clamp-1">
                        {evt.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#8A817B]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#6E2639]" />
                        <span>08.30 - 16.00 WIB</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#6E2639]" />
                        <span>{evt.location}</span>
                      </span>

                      {evt.programTitle && (
                        <span className="text-[#6E2639] font-medium hidden md:inline">
                          &bull; Terkait Proker: {evt.programTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E0D7]">
                  <span className="text-xs text-[#8A817B] block">PIC Kegiatan</span>
                  <span className="text-xs font-semibold text-[#352A28]">{evt.createdBy}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
