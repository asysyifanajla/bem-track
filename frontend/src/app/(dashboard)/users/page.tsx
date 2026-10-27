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
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-[#EFE8E2]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
              BEM-TRACK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight">
            Manajemen Pengguna &amp; Fungsionaris
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
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
        <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0]/60 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#059669] shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Authority Notice */}
      {!canManage && (
        <div className="p-4 bg-white border border-[#EFE8E2] rounded-3xl flex items-center gap-3 text-xs text-[#756C69] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          <div className="w-8 h-8 rounded-xl bg-[#FAF0F3] text-[#4E1724] flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <span>
            Pengelolaan pengguna dibatasi untuk Administrator dan Pimpinan Organisasi sesuai
            kewenangan. Tampilan akun bersifat pemantauan.
          </span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#EFE8E2] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C69]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pengurus, email, atau peran..."
            className="w-full bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl pl-10 pr-3.5 py-2 text-xs text-[#22161A] placeholder-[#A39893] focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
          />
        </div>

        <span className="text-xs text-[#756C69] font-medium hidden sm:inline">
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4E1724] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                    {user.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#22161A]">{user.name}</span>
                </div>
              </TableCell>

              <TableCell className="text-xs text-[#756C69] font-mono">{user.email}</TableCell>

              <TableCell>
                <span className="text-[11px] font-semibold bg-[#FAF0F3] text-[#4E1724] border border-[#4E1724]/20 px-2.5 py-0.5 rounded-full">
                  {ROLE_LABELS[user.role]}
                </span>
              </TableCell>

              <TableCell className="text-xs text-[#22161A]">
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
                      className="p-1.5 text-[#756C69] hover:text-[#4E1724] hover:bg-[#FAF7F5] rounded-xl transition-colors cursor-pointer"
                      title="Reset Kata Sandi"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType('TOGGLE_STATUS');
                      }}
                      className="p-1.5 text-[#756C69] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-colors cursor-pointer"
                      title="Ubah Status Akun"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#756C69] italic">Hanya Pantau</span>
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
