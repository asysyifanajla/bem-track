'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ROLE_LABELS, UserRole } from '@/types/auth';
import { DEPARTMENTS } from '@/lib/constants';
import { addMockActivityLog } from '@/lib/mockData';

export default function CreateUserPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<UserRole>('DEPARTEMEN_1');
  const [departemen, setDepartemen] = useState<string>(DEPARTMENTS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    await new Promise((r) => setTimeout(r, 450));

    addMockActivityLog({
      userName: 'Ahmad Fauzi',
      userRole: 'GUBERNUR',
      action: `Mendaftarkan Akun Fungsionaris Baru: ${name}`,
      module: 'Users',
      details: `Role: ${ROLE_LABELS[role]} &bull; Email: ${email}`,
    });

    setFeedback(`Akun pengurus "${name}" berhasil dibuat (Simulasi Demo).`);
    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/users');
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#756C69] hover:text-[#4E1724] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Manajemen Pengguna</span>
        </button>
        <span className="text-xs text-[#756C69]">Form Akun Baru</span>
      </div>

      {feedback && (
        <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0]/60 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#059669] shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-5">
          <h3 className="text-sm sm:text-base font-bold text-[#22161A] pb-3 border-b border-[#EFE8E2] tracking-tight">
            Data Akun Pengurus BEM
          </h3>

          <Input
            label="Nama Lengkap Fungsionaris"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Muhammad Ilham Pratama"
            required
          />

          <Input
            type="email"
            label="Alamat Email Organisasi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@bem.ums.ac.id"
            required
          />

          <Input
            type="password"
            label="Kata Sandi Awal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="Standar sandi awal sistem demo: demo123"
          />

          <Select
            label="Peran / Wewenang Birokrasi"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            required
          >
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>

          {role.startsWith('DEPARTEMEN') && (
            <Select
              label="Departemen Terkait"
              value={departemen}
              onChange={(e) => setDepartemen(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<UserPlus className="w-4 h-4" />}>
            Daftarkan Akun
          </Button>
        </div>
      </form>
    </div>
  );
}
