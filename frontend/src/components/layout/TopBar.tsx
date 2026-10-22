'use client';

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Cpu,
  ChevronDown,
  LogOut,
  CheckCircle2,
  AlertCircle,
  X,
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
  pageTitle?: string;
}

const MOCK_NOTIFICATIONS = [
  {
    id: 'n-1',
    title: 'Proposal Masuk: Company Profile Training',
    desc: 'Departemen Kominfo mengajukan proposal untuk review administrasi.',
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
  pageTitle,
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
    <header className="h-16 bg-white border-b border-[#E8E0D7] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-[#8A817B] hover:text-[#352A28] hover:bg-[#FAF7F1] lg:hidden cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#352A28] leading-tight">
            {pageTitle || 'BEM-Track'}
          </h1>
          <p className="text-[11px] text-[#8A817B] hidden sm:block">
            Sistem Informasi Birokrasi & Tracking Program Kerja
          </p>
        </div>
      </div>

      {/* Right side: AI Status, Notifications, Role, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* IndoBERT Honest Status Badge */}
        <button
          onClick={() => setShowAiModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#E8E0D7] bg-[#FAF7F1] hover:bg-[#F3EBDD]/50 transition-colors text-xs cursor-pointer group"
          title="Status IndoBERT Classifier"
        >
          <Cpu className="w-3.5 h-3.5 text-[#6E2639]" />
          <span className="font-semibold text-[#352A28] hidden md:inline">IndoBERT:</span>
          <span className="text-[#8A817B] text-[11px] font-medium hidden sm:inline">Standby</span>
          <span className="w-2 h-2 rounded-full bg-[#92600C] shrink-0" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#8A817B] hover:text-[#352A28] hover:bg-[#FAF7F1] transition-colors cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#9B2335]" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E8E0D7] rounded-xl shadow-md py-2 z-20 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#E8E0D7]">
                  <p className="text-xs font-bold text-[#352A28] uppercase tracking-wider">
                    Notifikasi Terkini
                  </p>
                  <span className="text-[10px] font-medium bg-[#F5EEF0] text-[#6E2639] px-2 py-0.5 rounded-full">
                    2 Baru
                  </span>
                </div>
                <div className="divide-y divide-[#E8E0D7]/60 max-h-72 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-2.5 hover:bg-[#FAF7F1] transition-colors cursor-pointer',
                        n.unread && 'bg-[#FAF7F1]/50'
                      )}
                    >
                      <p className="text-xs font-semibold text-[#352A28] leading-snug">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[#8A817B] mt-0.5 leading-snug">{n.desc}</p>
                      <span className="text-[10px] text-[#8A817B] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile & Demo Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-[#E8E0D7] hover:border-[#6E2639]/40 bg-white transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-[#6E2639] text-white flex items-center justify-center text-xs font-semibold">
              {getInitials(user.name)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-[#352A28] leading-tight truncate max-w-[120px]">
                {user.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-[#8A817B] leading-none">
                {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A817B] group-hover:text-[#352A28]" />
          </button>

          {showUserDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E8E0D7] rounded-xl shadow-lg p-2 z-20 animate-fade-in space-y-2">
                {/* User info card */}
                <div className="px-3 py-2 bg-[#FAF7F1] rounded-lg border border-[#E8E0D7]">
                  <p className="text-xs font-bold text-[#352A28]">{user.name}</p>
                  <p className="text-[11px] text-[#8A817B] truncate">{user.email}</p>
                  <span className="inline-block text-[10px] font-semibold bg-[#F5EEF0] text-[#6E2639] px-2 py-0.5 rounded-sm mt-1.5">
                    {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                  </span>
                </div>

                {/* Quick Role Switcher (Crucial for testing all 4 roles!) */}
                <div className="pt-1">
                  <p className="px-2 text-[10px] font-bold text-[#8A817B] uppercase tracking-wider mb-1.5">
                    Ganti Role (Mode Demo)
                  </p>
                  <div className="space-y-1">
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
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-colors cursor-pointer',
                            isCurrent
                              ? 'bg-[#F5EEF0] text-[#6E2639] font-semibold'
                              : 'text-[#352A28] hover:bg-[#FAF7F1]'
                          )}
                        >
                          <div>
                            <p className="text-xs">{demoUser.name}</p>
                            <p className="text-[10px] text-[#8A817B]">
                              {ROLE_LABELS[demoUser.role as UserRole]}
                            </p>
                          </div>
                          {isCurrent && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6E2639]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-[#E8E0D7] pt-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-[#9B2335] hover:bg-[#FDF0F1] transition-colors cursor-pointer"
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

      {/* IndoBERT Modal Information */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#352A28]/30 backdrop-blur-xs"
            onClick={() => setShowAiModal(false)}
          />
          <div className="relative w-full max-w-md bg-white border border-[#E8E0D7] rounded-xl shadow-xl p-5 z-10 animate-fade-in space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F1] border border-[#E8E0D7] text-[#6E2639] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#352A28]">
                    Status IndoBERT Multi-Label
                  </h3>
                  <p className="text-[11px] text-[#8A817B]">
                    Layanan Klasifikasi Otomatis Proposal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded-md text-[#8A817B] hover:text-[#352A28] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#FEF8ED] border border-[#92600C]/20 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#92600C]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Tahap Frontend & Mocking</span>
              </div>
              <p className="text-[#352A28] leading-relaxed">
                Sistem klasifikasi multi-label otomatis berbasis IndoBERT saat ini berstatus{' '}
                <strong>Standby / Belum Terhubung</strong>. Seluruh penanda kategori pada tahap ini
                ditampilkan secara transparan tanpa manipulasi akurasi buatan, dan siap dihubungkan
                ke endpoint Python FastAPI/Torch pada pengembangan backend.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#6E2639] text-white text-xs font-semibold hover:bg-[#4B1828] cursor-pointer"
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
