'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Bell,
  ChevronDown,
  LogOut,
  Cpu,
  CheckCircle2,
  AlertCircle,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS, UserRole } from '@/types/auth';
import { DEMO_USERS } from '@/lib/mockData';

interface TopBarProps {
  user: {
    name: string;
    role: string;
    email: string;
    departemen?: string;
  };
  onLogout: () => void;
  onMenuToggle: () => void;
  onSwitchRole: (role: string) => void;
  onOpenRoleModal?: () => void;
  pageTitle?: string;
}

const MOCK_NOTIFICATIONS = [
  {
    id: 'n-1',
    title: 'Proposal Masuk: Company Profile Training',
    desc: 'Departemen VISINFO mengajukan proposal untuk review anggaran.',
    time: '2 jam yang lalu',
    unread: true,
  },
  {
    id: 'n-2',
    title: 'Catatan Revisi: FKI Championship',
    desc: 'Bendahara Umum meminta revisi rincian sewa sound system & server.',
    time: '5 jam yang lalu',
    unread: true,
  },
  {
    id: 'n-3',
    title: 'Persetujuan Final: Bakti Sosial Boyolali',
    desc: 'Gubernur BEM telah menyetujui program kerja.',
    time: '1 hari yang lalu',
    unread: false,
  },
];

export default function TopBar({
  user,
  onLogout,
  onMenuToggle,
  onSwitchRole,
  onOpenRoleModal,
  pageTitle = 'Dashboard',
}: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-2 flex items-center justify-between shrink-0">
      {/* Left side: Breadcrumb (Home icon + amber dot + Page Title) */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-[#756C69] hover:text-[#22161A] bg-white border border-[#EFE8E2] lg:hidden cursor-pointer shadow-xs"
          aria-label="Buka navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2.5 text-xs font-medium text-[#22161A]">
          <Link
            href="/dashboard"
            className="flex items-center text-[#756C69] hover:text-[#22161A] transition-colors"
            title="Ke Dashboard"
          >
            <Home className="w-4 h-4" />
          </Link>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E68A2E] shrink-0" />
          <span className="text-sm font-semibold tracking-tight text-[#22161A]">
            {pageTitle}
          </span>
        </nav>
      </div>

      {/* Right side: Notification Bell & User profile trigger */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#756C69] hover:text-[#22161A] transition-colors cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E02424] ring-2 ring-[#FAF7F5]" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#EFE8E2] rounded-2xl shadow-xl py-2 z-20 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#EFE8E2]">
                  <p className="text-xs font-bold text-[#22161A] uppercase tracking-wider">
                    Notifikasi Terkini
                  </p>
                  <span className="text-[10px] font-semibold bg-[#FAF0F3] text-[#4E1724] px-2 py-0.5 rounded-full">
                    2 Baru
                  </span>
                </div>
                <div className="divide-y divide-[#EFE8E2]/60 max-h-72 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 hover:bg-[#FAF7F5] transition-colors cursor-pointer',
                        n.unread && 'bg-[#FAF7F5]/60'
                      )}
                    >
                      <p className="text-xs font-semibold text-[#22161A] leading-snug">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[#756C69] mt-0.5 leading-relaxed">{n.desc}</p>
                      <span className="text-[10px] text-[#A39893] mt-1.5 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Pill Button: Avatar circle + Name + Chevron */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer select-none py-1 pl-1 pr-1.5"
            aria-label="Menu pengguna"
          >
            <div className="w-8 h-8 rounded-full bg-[#4E1724] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              {getInitials(user.name)}
            </div>
            <span className="text-sm font-semibold text-[#22161A] hidden sm:inline">
              {user.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#756C69]" />
          </button>

          {showUserDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#EFE8E2] rounded-2xl shadow-xl p-2.5 z-20 animate-fade-in space-y-2">
                {/* User Info Header */}
                <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#EFE8E2]">
                  <p className="text-xs font-bold text-[#22161A]">{user.name}</p>
                  <p className="text-[11px] text-[#756C69] truncate mt-0.5">{user.email}</p>
                  <span className="inline-block text-[10px] font-semibold bg-[#FAF0F3] text-[#4E1724] px-2 py-0.5 rounded-full mt-2">
                    {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                  </span>
                </div>

                {/* AI / IndoBERT Status Shortcut */}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    setShowAiModal(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-[#FAF7F5] text-[#22161A] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-[#4E1724]" />
                    <span className="font-medium text-[11px]">IndoBERT Classifier</span>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded-sm">
                    Standby
                  </span>
                </button>

                {/* Quick Role Switcher for Demo */}
                <div className="pt-1 border-t border-[#EFE8E2]">
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-[10px] font-bold text-[#A39893] uppercase tracking-wider">
                      Ganti Role (Mode Demo)
                    </p>
                    {onOpenRoleModal && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenRoleModal();
                        }}
                        className="text-[10px] text-[#4E1724] font-semibold hover:underline"
                      >
                        Semua &rarr;
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {DEMO_USERS.map((demoUser) => {
                      const isCurrent = demoUser.role === user.role;
                      return (
                        <button
                          key={demoUser.id}
                          onClick={() => {
                            onSwitchRole(demoUser.role);
                            setShowUserDropdown(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer',
                            isCurrent
                              ? 'bg-[#FAF0F3] text-[#4E1724] font-semibold'
                              : 'text-[#22161A] hover:bg-[#FAF7F5]'
                          )}
                        >
                          <div>
                            <p className="text-xs">{demoUser.name}</p>
                            <p className="text-[10px] text-[#756C69]">
                              {ROLE_LABELS[demoUser.role as UserRole]}
                            </p>
                          </div>
                          {isCurrent && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4E1724]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logout Button */}
                <div className="border-t border-[#EFE8E2] pt-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar dari Demo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* IndoBERT Classifier Status Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#240610]/40 backdrop-blur-xs"
            onClick={() => setShowAiModal(false)}
          />
          <div className="relative w-full max-w-md bg-white border border-[#EFE8E2] rounded-3xl shadow-2xl p-6 z-10 animate-fade-in space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0F3] border border-[#EFE8E2] text-[#4E1724] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#22161A]">
                    Status IndoBERT Multi-Label
                  </h3>
                  <p className="text-xs text-[#756C69]">
                    Layanan Klasifikasi Otomatis Proposal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded-lg text-[#756C69] hover:text-[#22161A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#FEF7EC] border border-[#FDE68A] rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#B45309]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Tahap Frontend &amp; Mocking</span>
              </div>
              <p className="text-[#22161A] leading-relaxed">
                Sistem klasifikasi multi-label otomatis berbasis IndoBERT saat ini berstatus{' '}
                <strong>Standby / Belum Terhubung</strong>. Seluruh penanda kategori pada tahap ini
                ditampilkan secara transparan tanpa manipulasi akurasi buatan, dan siap dihubungkan
                ke endpoint Python FastAPI/Torch pada pengembangan backend.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-5 py-2 rounded-xl bg-[#4E1724] text-white text-xs font-semibold hover:bg-[#380C1B] cursor-pointer transition-colors shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
