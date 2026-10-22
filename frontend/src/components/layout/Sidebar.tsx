'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  FolderArchive,
  Wallet,
  CalendarDays,
  BookOpen,
  ActivitySquare,
  Users,
  ShieldCheck,
  CheckCircle,
  LogOut,
  X,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROLE_LABELS, UserRole } from '@/types/auth';
import { hasPermission } from '@/lib/permissions';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: Parameters<typeof hasPermission>[1];
  badge?: number;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    departemen?: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
  onLogout: () => void;
  onOpenRoleModal?: () => void;
  pendingCount?: number;
}

export default function Sidebar({
  user,
  isOpen = true,
  onClose,
  onLogout,
  onOpenRoleModal,
  pendingCount = 2,
}: SidebarProps) {
  const pathname = usePathname();

  const NAV_GROUPS: NavGroup[] = [
    {
      groupName: 'Utama',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      groupName: 'Birokrasi & Program',
      items: [
        { label: 'Program Kerja', href: '/programs', icon: <ClipboardList className="w-4 h-4" />, permission: 'programs:view' },
        {
          label: 'Verifikasi',
          href: '/verifications',
          icon: <CheckCircle className="w-4 h-4" />,
          permission: 'verifications:view',
          badge: pendingCount > 0 ? pendingCount : undefined,
        },
        { label: 'Kalender Agenda', href: '/timeline', icon: <CalendarDays className="w-4 h-4" />, permission: 'timeline:view' },
      ],
    },
    {
      groupName: 'Dokumen & Regulasi',
      items: [
        { label: 'Arsip Dokumen', href: '/archives', icon: <FolderArchive className="w-4 h-4" />, permission: 'archives:view_final' },
        { label: 'BEM Vault', href: '/vault', icon: <BookOpen className="w-4 h-4" />, permission: 'vault:view' },
      ],
    },
    {
      groupName: 'Pengelolaan',
      items: [
        { label: 'Kas Organisasi', href: '/finance', icon: <Wallet className="w-4 h-4" />, permission: 'finance:manage_transactions' },
        { label: 'Log Aktivitas', href: '/activity-logs', icon: <ActivitySquare className="w-4 h-4" />, permission: 'activity_logs:view' },
        { label: 'Manajemen User', href: '/users', icon: <Users className="w-4 h-4" />, permission: 'users:view' },
      ],
    },
  ];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#352A28]/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-white border-r border-[#E8E0D7] flex flex-col z-40 transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#E8E0D7] flex items-center justify-between bg-white">
          <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-lg bg-[#6E2639] flex items-center justify-center text-white shadow-xs group-hover:bg-[#4B1828] transition-colors">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#352A28] text-base tracking-tight leading-none">
                  BEM-Track
                </span>
                <span className="text-[10px] font-semibold bg-[#F5EEF0] text-[#6E2639] px-1.5 py-0.5 rounded-sm">
                  DEMO
                </span>
              </div>
              <p className="text-[#8A817B] text-[11px] leading-tight mt-1">BEM FKI UMS</p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8A817B] hover:text-[#352A28] lg:hidden"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_GROUPS.map((group) => {
            // Filter items based on permissions
            const visibleItems = group.items.filter((item) => {
              if (!item.permission) return true;
              return hasPermission(user.role as UserRole, item.permission);
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.groupName} className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-[#8A817B] uppercase tracking-wider mb-1.5">
                  {group.groupName}
                </p>
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-[#F5EEF0] text-[#6E2639] font-semibold'
                          : 'text-[#8A817B] hover:bg-[#FAF7F1] hover:text-[#352A28]'
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#6E2639] rounded-r-md" />
                      )}
                      <span
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-[#6E2639]' : 'text-[#8A817B] group-hover:text-[#352A28]'
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-[10px] font-bold bg-[#9B2335] text-white rounded-full px-1.5 py-0.2 leading-none">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Footer Profile & Role Switcher */}
        <div className="p-3 border-t border-[#E8E0D7] bg-[#FAF7F1]/80 space-y-2">
          {onOpenRoleModal && (
            <button
              onClick={onOpenRoleModal}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white border border-[#E8E0D7] hover:border-[#6E2639]/40 text-left transition-colors cursor-pointer group"
              title="Ganti role untuk demo"
            >
              <div className="flex items-center gap-1.5 text-xs text-[#352A28]">
                <UserCheck className="w-3.5 h-3.5 text-[#6E2639]" />
                <span className="font-medium text-[11px]">Ganti Role Demo</span>
              </div>
              <span className="text-[10px] text-[#8A817B] group-hover:text-[#6E2639]">Ubah &rarr;</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 px-1 pt-1">
            <div className="w-8 h-8 rounded-full bg-[#6E2639] text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#352A28] truncate">{user.name}</p>
              <p className="text-[11px] text-[#8A817B] truncate">
                {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-md text-[#8A817B] hover:text-[#9B2335] hover:bg-[#FDF0F1] transition-colors cursor-pointer shrink-0"
              title="Keluar"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
