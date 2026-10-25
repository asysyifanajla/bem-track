'use client';

import { Suspense, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Modal from '@/components/ui/Modal';
import { DEMO_USERS, getMockPrograms } from '@/lib/mockData';
import { ROLE_LABELS, UserRole } from '@/types/auth';
import { CheckCircle2 } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/programs': 'Program Kerja',
  '/programs/create': 'Pengajuan Program Kerja',
  '/verifications': 'Verifikasi Birokrasi',
  '/archives': 'Arsip Dokumen',
  '/archives/upload': 'Unggah Dokumen Arsip',
  '/vault': 'BEM Vault Organisasi',
  '/vault/upload': 'Unggah ke BEM Vault',
  '/finance': 'Pengelolaan Kas Organisasi',
  '/finance/create': 'Pencatatan Transaksi Kas',
  '/timeline': 'Kalender & Agenda Kerja',
  '/timeline/create': 'Tambah Agenda Baru',
  '/activity-logs': 'Log Riwayat Aktivitas',
  '/users': 'Manajemen Pengguna',
  '/users/create': 'Tambah Akun Pengurus',
};

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bem_track_token');
      localStorage.removeItem('bem_track_user');
    }
    router.push('/login');
  };

  const handleSwitchRole = (role: string) => {
    const target = DEMO_USERS.find((u) => u.role === role);
    if (target && typeof window !== 'undefined') {
      localStorage.setItem('bem_track_token', 'demo_token_' + target.role);
      localStorage.setItem('bem_track_user', JSON.stringify(target));
      window.dispatchEvent(new CustomEvent('bem_track_user_changed', { detail: target }));
      setRoleModalOpen(false);
      router.refresh();
    }
  };

  const pageTitle =
    PAGE_TITLES[pathname] ||
    Object.entries(PAGE_TITLES).find(
      ([key]) => pathname.startsWith(key + '/') && key !== '/'
    )?.[1] ||
    'BEM-Track';

  // Count pending items for current role
  const mockProgs = getMockPrograms();
  const pendingCount = mockProgs.filter((p) => {
    if (!user) return false;
    if (user.role === 'SEKRETARIS_UMUM' && p.status === 'SEKUM_REVIEW') return true;
    if (user.role === 'BENDAHARA_UMUM' && p.status === 'BENDUM_REVIEW') return true;
    if (user.role === 'GUBERNUR' && p.status === 'GUBERNUR_REVIEW') return true;
    return false;
  }).length;


  return (
    <div className="min-h-screen bg-[#FAF7F1] flex text-[#352A28]">
      {/* Sidebar navigation */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onOpenRoleModal={() => setRoleModalOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <TopBar
          user={user}
          onLogout={handleLogout}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSwitchRole={handleSwitchRole}
          onOpenRoleModal={() => setRoleModalOpen(true)}
          pageTitle={pageTitle}
        />

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 pt-2 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Role Selection Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title="Ganti Peran Pengguna (Mode Demo)"
        description="Pilih akun pengurus untuk menguji perbedaan hak akses, menu, dan aksi birokrasi."
      >
        <div className="space-y-2">
          {DEMO_USERS.map((demoUser) => {
            const isSelected = demoUser.role === user.role;
            return (
              <button
                key={demoUser.id}
                onClick={() => handleSwitchRole(demoUser.role)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#6E2639] bg-[#F5EEF0]'
                    : 'border-[#E8E0D7] bg-white hover:bg-[#FAF7F1]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#352A28]">{demoUser.name}</p>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-[#6E2639] text-white px-1.5 py-0.2 rounded-sm">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8A817B]">{demoUser.email}</p>
                  <p className="text-[11px] text-[#6E2639] font-medium mt-0.5">
                    {ROLE_LABELS[demoUser.role as UserRole]} &bull; {demoUser.departemen}
                  </p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-[#6E2639] shrink-0" />}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F1]" />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
