'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Clock,
  Search,
  User,
  ExternalLink,
  CalendarDays,
  Tag,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getMockTimeline } from '@/lib/mockData';
import { canManageTimeline } from '@/lib/permissions';
import { UserRole } from '@/types/auth';
import { TimelineEvent } from '@/types/timeline';

// Days of week header labels (Sunday to Saturday as in reference mockup)
const DAYS_OF_WEEK = [
  { key: 'min', label: 'Min' },
  { key: 'sen', label: 'Sen' },
  { key: 'sel', label: 'Sel' },
  { key: 'rab', label: 'Rab' },
  { key: 'kam', label: 'Kam' },
  { key: 'jum', label: 'Jum' },
  { key: 'sab', label: 'Sab' },
];

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

  const [events] = useState<TimelineEvent[]>(() => getMockTimeline());
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'SELECTED_DATE' | 'ALL_AGENDAS' | 'UPCOMING'>('SELECTED_DATE');

  // Default displayed month: November 2026 (matching mock data and user reference)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November (0-indexed)

  // Default selected date: 15 November 2026 (matching reference mockup with day 15 selected)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2026, 10, 15));

  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;
  const canManage = canManageTimeline(userRole);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Month label in Indonesian
  const monthTitle = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1);
    const monthName = d.toLocaleDateString('id-ID', { month: 'long' });
    return `${monthName} ${currentYear}`;
  }, [currentYear, currentMonth]);

  // Calendar matrix calculation
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Leading empty slots
    const leadingSlots: (number | null)[] = Array.from({ length: firstDayIndex }, () => null);

    // Days in current month
    const monthDays: (number | null)[] = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

    // Trailing slots to complete grid (multiples of 7)
    const totalSlots = leadingSlots.length + monthDays.length;
    const trailingCount = (7 - (totalSlots % 7)) % 7;
    const trailingSlots: (number | null)[] = Array.from({ length: trailingCount }, () => null);

    return [...leadingSlots, ...monthDays, ...trailingSlots];
  }, [currentYear, currentMonth]);

  // Check if an event occurs on a specific day
  const hasEventOnDate = (day: number) => {
    const targetStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some((evt) => {
      const startStr = evt.startDate.split('T')[0];
      const endStr = (evt.endDate || evt.startDate).split('T')[0];
      return targetStr >= startStr && targetStr <= endStr;
    });
  };

  // Check if cell is the currently selected date
  const isCellSelected = (day: number) => {
    return (
      selectedDate.getFullYear() === currentYear &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getDate() === day
    );
  };

  // Format short department name (e.g. "VISINFO" from "VISINFO — Visual Informasi...")
  const getDeptShort = (deptFullName: string) => {
    if (!deptFullName) return 'BEM';
    if (deptFullName.includes('—')) {
      return deptFullName.split('—')[0].trim();
    }
    return deptFullName;
  };

  // Format event time display e.g. "08.30–16.00 WIB"
  const formatTimeRange = (startDateStr: string, endDateStr?: string) => {
    try {
      const s = new Date(startDateStr);
      const startHour = String(s.getUTCHours()).padStart(2, '0') + '.' + String(s.getUTCMinutes()).padStart(2, '0');
      if (!endDateStr) return `${startHour} WIB`;
      const e = new Date(endDateStr);
      const endHour = String(e.getUTCHours()).padStart(2, '0') + '.' + String(e.getUTCMinutes()).padStart(2, '0');
      return `${startHour}–${endHour} WIB`;
    } catch {
      return '08.30–16.00 WIB';
    }
  };

  // Filter agendas according to selected date / filter mode and search query
  const displayedEvents = useMemo(() => {
    const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    return events.filter((evt) => {
      const startStr = evt.startDate.split('T')[0];
      const endStr = (evt.endDate || evt.startDate).split('T')[0];

      // Scope filter logic
      let matchScope = true;
      if (activeFilter === 'SELECTED_DATE') {
        matchScope = selectedDateStr >= startStr && selectedDateStr <= endStr;
      } else if (activeFilter === 'ALL_AGENDAS') {
        // All events in the current displayed month
        matchScope = startStr.startsWith(currentMonthPrefix) || endStr.startsWith(currentMonthPrefix);
      } else if (activeFilter === 'UPCOMING') {
        matchScope = evt.status === 'UPCOMING';
      }

      // Search filter logic
      const matchSearch =
        search.trim() === '' ||
        evt.title.toLowerCase().includes(search.toLowerCase()) ||
        evt.departemen.toLowerCase().includes(search.toLowerCase()) ||
        evt.location.toLowerCase().includes(search.toLowerCase()) ||
        (evt.programTitle && evt.programTitle.toLowerCase().includes(search.toLowerCase())) ||
        evt.createdBy.toLowerCase().includes(search.toLowerCase());

      return matchScope && matchSearch;
    });
  }, [events, selectedDate, currentYear, currentMonth, activeFilter, search]);

  // Selected date formatted in Indonesian (e.g. "Agenda 15 November")
  const agendaSectionTitle = useMemo(() => {
    if (activeFilter === 'SELECTED_DATE') {
      const day = selectedDate.getDate();
      const month = selectedDate.toLocaleDateString('id-ID', { month: 'long' });
      return `Agenda ${day} ${month}`;
    }
    if (activeFilter === 'ALL_AGENDAS') {
      return `Semua Agenda ${monthTitle}`;
    }
    return 'Agenda Mendatang BEM FKI';
  }, [activeFilter, selectedDate, monthTitle]);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* ======================================================== */}
      {/* 1. PAGE HEADER                                           */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-[#EFE8E2]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
              BEM-TRACK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight">
            Kalender &amp; Agenda Kerja
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
            Jadwal kegiatan dan agenda kerja organisasi BEM FKI UMS
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canManage && (
            <Link href="/timeline/create">
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Tambah Agenda Baru
              </Button>
            </Link>
          )}

          <div
            className="w-10 h-10 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] flex items-center justify-center text-[#8B263E] shadow-2xs"
            title="Kalender BEM FKI UMS"
          >
            <CalendarIcon className="w-5 h-5 text-[#8B263E]" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. COMPACT MONTHLY CALENDAR CARD (Matching Wireframe)     */}
      {/* ======================================================== */}
      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-5 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
        {/* Month Title & Navigation Arrows */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#22161A]">
            {monthTitle}
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl text-[#756C69] hover:text-[#22161A] hover:bg-[#FAF7F5] border border-transparent hover:border-[#EFE8E2] transition-colors cursor-pointer"
              aria-label="Bulan sebelumnya"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl text-[#756C69] hover:text-[#22161A] hover:bg-[#FAF7F5] border border-transparent hover:border-[#EFE8E2] transition-colors cursor-pointer"
              aria-label="Bulan berikutnya"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inner Calendar Container with Grid */}
        <div className="border border-[#EFE8E2] rounded-2xl p-3 sm:p-5 bg-white space-y-2.5">
          {/* Weekday Header Row */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#756C69] pb-0.5">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d.key} className="py-1">
                {d.label}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                // Empty placeholder slot (rounded rectangle matching wireframe)
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-10 sm:h-12 rounded-xl bg-[#F4F1EC]/60"
                    aria-hidden="true"
                  />
                );
              }

              const hasEvent = hasEventOnDate(day);
              const isSelected = isCellSelected(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => {
                    setSelectedDate(new Date(currentYear, currentMonth, day));
                    setActiveFilter('SELECTED_DATE');
                  }}
                  className={`relative h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-xs sm:text-sm select-none ${
                    isSelected
                      ? 'bg-[#4E1724] text-white font-bold shadow-xs'
                      : hasEvent
                        ? 'bg-[#FBF6F0] text-[#22161A] font-bold hover:bg-[#F5EDE1] border border-[#F2ECE4]'
                        : 'bg-[#FAF7F5] text-[#22161A] hover:bg-[#EFE9DF]'
                  }`}
                  aria-label={`Tanggal ${day} ${monthTitle}`}
                  title={hasEvent ? `Ada agenda kegiatan pada ${day} ${monthTitle}` : undefined}
                >
                  <span className="leading-none">{day}</span>

                  {/* Dot Indicator beneath date */}
                  {hasEvent && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                        isSelected ? 'bg-white' : 'bg-[#4E1724]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footnote Caption (Matching Wireframe) */}
        <p className="text-[11px] sm:text-xs text-[#756C69]">
          Contoh visual kalender. Titik menandakan tanggal yang memiliki agenda; tanggal{' '}
          <strong className="text-[#22161A]">{selectedDate.getDate()}</strong> dipilih.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 3. SEARCH & FILTER BAR                                   */}
      {/* ======================================================== */}
      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-4 sm:p-5 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C69]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kegiatan, PIC, lokasi, atau departemen..."
            className="w-full bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl pl-10 pr-3.5 py-2 text-xs text-[#22161A] placeholder-[#A39893] focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('SELECTED_DATE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'SELECTED_DATE'
                ? 'bg-[#4E1724] text-white shadow-2xs'
                : 'bg-[#FAF7F5] border border-[#EFE8E2] text-[#756C69] hover:text-[#22161A] hover:bg-[#F2ECE4]'
            }`}
          >
            Tanggal Terpilih ({selectedDate.getDate()} {selectedDate.toLocaleDateString('id-ID', { month: 'short' })})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('ALL_AGENDAS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'ALL_AGENDAS'
                ? 'bg-[#4E1724] text-white shadow-2xs'
                : 'bg-[#FAF7F5] border border-[#EFE8E2] text-[#756C69] hover:text-[#22161A] hover:bg-[#F2ECE4]'
            }`}
          >
            Semua Agenda
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('UPCOMING')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'UPCOMING'
                ? 'bg-[#4E1724] text-white shadow-2xs'
                : 'bg-[#FAF7F5] border border-[#EFE8E2] text-[#756C69] hover:text-[#22161A] hover:bg-[#F2ECE4]'
            }`}
          >
            Agenda Mendatang
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. AGENDA LIST SECTION                                   */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-bold text-[#22161A]">
            {agendaSectionTitle}
          </h2>

          <span className="text-xs text-[#756C69]">
            {displayedEvents.length} agenda kegiatan
          </span>
        </div>

        {displayedEvents.length === 0 ? (
          // Concise Empty State for Selected Date / Filter
          <div className="bg-white border border-[#EFE8E2] rounded-3xl p-8 sm:p-10 text-center space-y-3 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] flex items-center justify-center text-[#756C69] mx-auto">
              <CalendarDays className="w-6 h-6 text-[#756C69]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#22161A]">
                Tidak Ada Kegiatan pada Tanggal Ini
              </h3>
              <p className="text-xs text-[#756C69] max-w-sm mx-auto">
                Belum ada agenda kegiatan yang dijadwalkan pada{' '}
                <strong>
                  {selectedDate.getDate()}{' '}
                  {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </strong>
                . Silakan pilih tanggal lain yang memiliki penanda titik pada kalender.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveFilter('ALL_AGENDAS')}
              >
                Lihat Semua Agenda Bulan Ini
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedEvents.map((evt) => {
              const dateObj = new Date(evt.startDate);
              const dayNum = dateObj.getDate();
              const monthNameShort = dateObj
                .toLocaleDateString('id-ID', { month: 'short' })
                .toUpperCase();
              const deptShort = getDeptShort(evt.departemen);
              const timeRange = formatTimeRange(evt.startDate, evt.endDate);

              return (
                <div
                  key={evt.id}
                  className="bg-white border border-[#EFE8E2] hover:border-[#4E1724]/30 rounded-3xl p-5 sm:p-6 transition-all shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Visual Date Badge (Left column: 15 / NOV) */}
                    <div className="w-12 sm:w-14 shrink-0 flex flex-col items-center pt-0.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#4E1724] leading-none">
                        {dayNum}
                      </span>
                      <span className="text-[11px] font-bold text-[#756C69] uppercase mt-1 tracking-wider">
                        {monthNameShort}
                      </span>
                    </div>

                    {/* Main Agenda Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-[#22161A] leading-snug">
                        {evt.title}
                      </h3>

                      {/* Department and Time (e.g. VISINFO · 08.30–16.00 WIB) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#756C69]">
                        <span className="font-semibold text-[#4E1724]">
                          {deptShort}
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#756C69]" />
                          <span>{timeRange}</span>
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-[#756C69]">
                        <MapPin className="w-3.5 h-3.5 text-[#756C69] shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>

                      {/* Tags & Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {evt.programTitle && (
                          <Link
                            href={evt.programId ? `/programs/${evt.programId}` : '#'}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#FAF7F5] text-[#6E2639] border border-[#E8DFD3] hover:border-[#6E2639]/40 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                          >
                            <Tag className="w-3 h-3 text-[#6E2639]" />
                            <span>Terkait program kerja: {evt.programTitle}</span>
                            <ExternalLink className="w-3 h-3 text-[#6E2639]" />
                          </Link>
                        )}

                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#FAF7F5] text-[#352A28] border border-[#E8DFD3] px-2.5 py-0.5 rounded-full">
                          <User className="w-3 h-3 text-[#6E2639]" />
                          <span>PIC: {evt.createdBy}</span>
                        </span>

                        {evt.status === 'UPCOMING' ? (
                          <Badge variant="info" dot>
                            Mendatang
                          </Badge>
                        ) : (
                          <Badge variant="success" dot>
                            Selesai
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

