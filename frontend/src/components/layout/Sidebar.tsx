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

/**
 * Determine if a sidebar nav item should be highlighted based on pathname.
 * Explicit route matching rules:
 * 1. Dashboard: highlight Dashboard only (/dashboard)
 * 2. Program Kerja list: highlight Program Kerja only (/programs)
 * 3. Ajukan Proker (/programs/create): do NOT highlight any sidebar menu
 * 4. Program detail page: do NOT highlight any sidebar menu (/programs/[id])
 * 5. Program edit page: do NOT highlight any sidebar menu (/programs/[id]/edit)
 * 6. Verifikasi: highlight on main page and detail pages (/verifications, /verifications/*)
 * 7. Other modules: highlight on corresponding module pages
 */
function isNavItemActive(href: string, pathname: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  if (href === '/programs') {
    // Only highlight for the main program list page (/programs)
    // /programs/create, /programs/[id], /programs/[id]/edit are NOT highlighted
    return pathname === '/programs';
  }

  if (href === '/verifications') {
    return pathname === '/verifications' || pathname.startsWith('/verifications/');
  }

  if (href === '/timeline') {
    return pathname === '/timeline' || pathname.startsWith('/timeline/');
  }

  if (href === '/archives') {
    return pathname === '/archives' || pathname.startsWith('/archives/');
  }

  if (href === '/vault') {
    return pathname === '/vault' || pathname.startsWith('/vault/');
  }

  if (href === '/activity-logs') {
    return pathname === '/activity-logs' || pathname.startsWith('/activity-logs/');
  }

  if (href === '/finance') {
    return pathname === '/finance' || pathname.startsWith('/finance/');
  }

  if (href === '/users') {
    return pathname === '/users' || pathname.startsWith('/users/');
  }

  return pathname === href;
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
        { label: 'Log Aktivitas', href: '/activity-logs', icon: <ActivitySquare className="w-4 h-4" />, permission: 'activity_logs:view' },
      ],
    },
    {
      groupName: 'Pengelolaan',
      items: [
        { label: 'Kas Organisasi', href: '/finance', icon: <Wallet className="w-4 h-4" />, permission: 'finance:manage_transactions' },
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
          className="fixed inset-0 bg-[#36111C]/60 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-[#4B1828] border-r border-[#6E2639]/40 flex flex-col z-40 transition-transform duration-200 ease-in-out lg:translate-x-0 text-[#FAF7F1] shadow-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between bg-[#4B1828]">
          <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-[#6E2639] border border-white/15 flex items-center justify-center text-white shadow-xs group-hover:bg-[#8A4658] transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#FAF7F1]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight leading-none">
                  BEM-Track
                </span>
                <span className="text-[10px] font-semibold bg-white/15 text-[#FAF7F1] px-1.5 py-0.5 rounded-sm">
                  v1.0
                </span>
              </div>
              <p className="text-[#FAF7F1]/60 text-[11px] leading-tight mt-1">BEM FKI UMS</p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#FAF7F1]/70 hover:text-white lg:hidden cursor-pointer"
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
                <p className="px-3 text-[10px] font-bold text-[#FAF7F1]/45 uppercase tracking-wider mb-1.5">
                  {group.groupName}
                </p>
                {visibleItems.map((item) => {
                  const isActive = isNavItemActive(item.href, pathname);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative',
                        isActive
                          ? 'bg-[#6E2639] text-white font-semibold shadow-xs border border-white/10'
                          : 'text-[#FAF7F1]/75 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-1 top-2 bottom-2 w-1 bg-[#F3EBDD] rounded-full" />
                      )}
                      <span
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-white' : 'text-[#FAF7F1]/70 group-hover:text-white'
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-[10px] font-bold bg-[#F3EBDD] text-[#4B1828] rounded-full px-2 py-0.5 leading-none shadow-xs">
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
        <div className="p-3 border-t border-white/10 bg-[#3D1421] space-y-2">
          {onOpenRoleModal && (
            <button
              onClick={onOpenRoleModal}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-colors cursor-pointer group"
              title="Ganti role untuk demo"
            >
              <div className="flex items-center gap-1.5 text-xs text-[#FAF7F1]">
                <UserCheck className="w-3.5 h-3.5 text-[#F3EBDD]" />
                <span className="font-medium text-[11px]">Ganti Role Demo</span>
              </div>
              <span className="text-[10px] text-[#FAF7F1]/60 group-hover:text-white">Ubah &rarr;</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 px-1 pt-1">
            <div className="w-8 h-8 rounded-full bg-[#6E2639] border border-white/20 text-[#FAF7F1] flex items-center justify-center text-xs font-semibold shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-[#FAF7F1]/65 truncate">
                {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#FAF7F1]/60 hover:text-red-200 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
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
