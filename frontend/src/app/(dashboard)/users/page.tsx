'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  KeyRound,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import { DEMO_USERS } from '@/lib/mockData';
import { ROLE_LABELS, UserRole } from '@/types/auth';
import { canManageUsers } from '@/lib/permissions';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departemen?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export default function UsersPage() {
  const [currentUser] = useState<{ role: string; name: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<AppUser[]>(() =>
    DEMO_USERS.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as UserRole,
      departemen: u.departemen,
      status: 'ACTIVE',
      createdAt: u.createdAt,
    }))
  );

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [modalType, setModalType] = useState<'RESET_PASSWORD' | 'TOGGLE_STATUS' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;
  const canManage = canManageUsers(userRole);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      ROLE_LABELS[u.role]?.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmAction = async () => {
    if (!selectedUser || !modalType) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 450));

    if (modalType === 'TOGGLE_STATUS') {
      const newStatus = selectedUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u))
      );
      setFeedback(`Status akun "${selectedUser.name}" diubah menjadi ${newStatus}.`);
    } else if (modalType === 'RESET_PASSWORD') {
      setFeedback(`Kata sandi akun "${selectedUser.name}" berhasil direset ke standar demo.`);
    }

    setIsProcessing(false);
    setModalType(null);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8E0D7]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
            Manajemen Pengguna & Fungsionaris
          </h2>
          <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
            Daftar akun pengurus, penetapan peran organisasi, dan kendali kredensial sistem
          </p>
        </div>

        {canManage && (
          <Link href="/users/create">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Tambah Akun Pengurus
            </Button>
          </Link>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-[#EDF7F1] border border-[#2D7A4F]/25 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2D7A4F]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Authority Notice */}
      {!canManage && (
        <div className="p-3 bg-white border border-[#E8E0D7] rounded-lg flex items-center gap-2.5 text-xs text-[#8A817B]">
          <Lock className="w-4 h-4 text-[#8A817B] shrink-0" />
          <span>
            Pengelolaan pengguna dibatasi untuk Administrator dan Pimpinan Organisasi sesuai
            kewenangan. Tampilan akun bersifat pemantauan.
          </span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E0D7] flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A817B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pengurus, email, atau peran..."
            className="w-full bg-[#FAF7F1]/60 border border-[#E8E0D7] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#352A28] placeholder-[#8A817B]/60 focus:bg-white focus:outline-hidden focus:border-[#6E2639] transition-colors"
          />
        </div>

        <span className="text-xs text-[#8A817B] font-medium hidden sm:inline">
          {filtered.length} Akun Terdaftar
        </span>
      </div>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pengguna</TableHead>
            <TableHead>Email Organisasi</TableHead>
            <TableHead>Peran / Jabatan</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead>Status Akun</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6E2639] text-white flex items-center justify-center text-xs font-semibold">
                    {user.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                  </div>
                  <span className="font-semibold text-xs text-[#352A28]">{user.name}</span>
                </div>
              </TableCell>

              <TableCell className="text-xs text-[#8A817B] font-mono">{user.email}</TableCell>

              <TableCell>
                <span className="text-[11px] font-semibold bg-[#F5EEF0] text-[#6E2639] px-2 py-0.5 rounded-sm">
                  {ROLE_LABELS[user.role]}
                </span>
              </TableCell>

              <TableCell className="text-xs text-[#352A28]">
                {user.departemen || 'Badan Pengurus Harian (BPH)'}
              </TableCell>

              <TableCell>
                {user.status === 'ACTIVE' ? (
                  <Badge variant="success" dot>
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="danger" dot>
                    Nonaktif
                  </Badge>
                )}
              </TableCell>

              <TableCell className="text-right whitespace-nowrap">
                {canManage ? (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType('RESET_PASSWORD');
                      }}
                      className="p-1.5 text-[#8A817B] hover:text-[#6E2639] hover:bg-[#FAF7F1] rounded-md transition-colors cursor-pointer"
                      title="Reset Kata Sandi"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType('TOGGLE_STATUS');
                      }}
                      className="p-1.5 text-[#8A817B] hover:text-[#9B2335] hover:bg-[#FDF0F1] rounded-md transition-colors cursor-pointer"
                      title="Ubah Status Akun"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#8A817B] italic">Hanya Pantau</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalType !== null}
        onClose={() => {
          setModalType(null);
          setSelectedUser(null);
        }}
        title={
          modalType === 'RESET_PASSWORD'
            ? 'Konfirmasi Reset Kata Sandi'
            : 'Konfirmasi Perubahan Status Akun'
        }
        description={`Akun Pengurus: ${selectedUser?.name} (${selectedUser?.email})`}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setModalType(null);
                setSelectedUser(null);
              }}
            >
              Batal
            </Button>
            <Button size="sm" isLoading={isProcessing} onClick={handleConfirmAction}>
              Konfirmasi Perubahan
            </Button>
          </>
        }
      >
        <div className="space-y-2 text-xs text-[#352A28]">
          {modalType === 'RESET_PASSWORD' ? (
            <p>
              Kata sandi pengurus akan dikembalikan ke kata sandi bawaan demo:{' '}
              <code className="font-mono font-bold text-[#6E2639]">demo123</code>. Pengurus dapat
              langsung masuk kembali.
            </p>
          ) : (
            <p>
              Apakah Anda yakin ingin mengubah status aktif akun fungsionaris ini? Akun nonaktif
              tidak dapat digunakan untuk verifikasi atau pengajuan proposal.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
