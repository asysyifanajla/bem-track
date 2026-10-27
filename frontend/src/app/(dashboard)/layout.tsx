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
  '/verifications': 'Verifikasi Proposal',
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
    <div className="min-h-screen bg-[#FAF7F5] flex text-[#22161A] relative overflow-x-hidden">
      {/* Ambient Decorative Organic Graphics for all pages */}
      <div className="fixed top-0 right-0 w-[450px] h-[320px] pointer-events-none select-none z-0 overflow-hidden">
        <svg viewBox="0 0 450 320" fill="none" className="w-full h-full opacity-90">
          {/* Organic wine blob top right */}
          <path
            d="M450,0 L320,0 C310,40 330,80 370,100 C410,120 440,160 450,210 Z"
            fill="#4E1724"
          />
          <path
            d="M450,70 C410,80 380,120 395,160 C410,200 435,230 450,260 Z"
            fill="#682033"
            opacity="0.75"
          />
          <path
            d="M330,0 C340,30 360,50 380,60 C360,40 345,20 340,0 Z"
            fill="#8B263E"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="fixed bottom-0 right-0 w-[380px] h-[280px] pointer-events-none select-none z-0 overflow-hidden">
        <svg viewBox="0 0 380 280" fill="none" className="w-full h-full opacity-60">
          {/* Subtle flowing warm sand curve at bottom right */}
          <path
            d="M120,280 C180,240 240,250 290,210 C340,170 360,130 380,100 L380,280 Z"
            fill="#EFE4D6"
          />
          <path
            d="M200,280 C250,260 290,265 330,235 C360,210 375,180 380,160 L380,280 Z"
            fill="#E6DACB"
            opacity="0.8"
          />
        </svg>
      </div>

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
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 relative z-10">
        <TopBar
          user={user}
          onLogout={handleLogout}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSwitchRole={handleSwitchRole}
          onOpenRoleModal={() => setRoleModalOpen(true)}
          pageTitle={pageTitle}
        />

        {/* Page Content */}
        <main className="flex-1 px-6 sm:px-8 lg:px-10 pb-12 pt-2 max-w-7xl w-full mx-auto relative z-10">
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
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#4E1724] bg-[#FAF0F3] shadow-xs'
                    : 'border-[#EFE8E2] bg-white hover:bg-[#FAF7F5]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#22161A]">{demoUser.name}</p>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-[#4E1724] text-white px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#756C69]">{demoUser.email}</p>
                  <p className="text-[11px] text-[#4E1724] font-medium mt-0.5">
                    {ROLE_LABELS[demoUser.role as UserRole]} &bull; {demoUser.departemen}
                  </p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-[#4E1724] shrink-0" />}
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
