'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, FileUp, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getMockVault, saveMockVault, addMockActivityLog } from '@/lib/mockData';
import { VaultDocument } from '@/types/document';

const VAULT_CATEGORIES = [
  { value: 'AD_ART', label: 'AD / ART & Konstitusi Organisasi' },
  { value: 'PERATURAN', label: 'Surat Keputusan (SK) & Peraturan Dekanat' },
  { value: 'PANDUAN', label: 'GBHK & Pedoman Teknis Pengurus' },
  { value: 'TEMPLATE', label: 'Template Dokumen & Lembar Pengesahan' },
  { value: 'LAINNYA', label: 'Dokumen Regulasi Lainnya' },
];

export default function VaultUploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [vaultCategory, setVaultCategory] = useState<VaultDocument['vaultCategory']>('AD_ART');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    await new Promise((r) => setTimeout(r, 450));

    const existing = getMockVault();

    const newDoc: VaultDocument = {
      id: `VLT-${(existing.length + 1).toString().padStart(3, '0')}`,
      title,
      category: 'LAINNYA',
      vaultCategory,
      fileUrl: `/mock/vault/${fileName || 'dokumen_vault.pdf'}`,
      fileSize: 3100000,
      mimeType: 'application/pdf',
      status: 'ARCHIVED',
      uploadedBy: 'Siti Rahayu (Sekum)',
      uploadedAt: new Date().toISOString(),
      description,
      isPublic: true,
      downloadCount: 0,
      tags: [vaultCategory, 'RESMI', 'BEM_FKI'],
    };

    saveMockVault([newDoc, ...existing]);
    addMockActivityLog({
      userName: 'Siti Rahayu',
      userRole: 'SEKRETARIS_UMUM',
      action: `Mengunggah Regulasi ke Vault: ${title}`,
      module: 'Vault',
      details: `Kategori: ${vaultCategory}`,
    });

    setFeedback('Dokumen regulasi berhasil diarsipkan ke BEM Vault.');
    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/vault');
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
          <span>Kembali ke BEM Vault</span>
        </button>
        <span className="text-xs text-[#756C69]">Form Pengunggahan Dokumen Resmi</span>
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
            Instrumen Dokumen Regulasi
          </h3>

          <Input
            label="Nama / Judul Dokumen Resmi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Surat Keputusan Dekan FKI ttg Pengurus 2026/2027"
            required
          />

          <Select
            label="Bidang Regulasi"
            value={vaultCategory}
            onChange={(e) => setVaultCategory(e.target.value as VaultDocument['vaultCategory'])}
            required
          >
            {VAULT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>

          <div>
            <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
              Deskripsi Ketetapan / Ruang Lingkup
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan dasar hukum ketetapan, nomor surat keputusan, atau pedoman..."
              className="w-full bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A] placeholder-[#A39893] text-sm rounded-2xl p-3.5 focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-all"
            />
          </div>
        </div>

        {/* File Dropzone */}
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-3.5">
          <h3 className="text-sm sm:text-base font-bold text-[#22161A] tracking-tight">Berkas Digital Master</h3>

          <div className="border-2 border-dashed border-[#EFE8E2] hover:border-[#4E1724]/60 rounded-2xl p-6 text-center bg-[#FAF7F5]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EFE8E2] flex items-center justify-center text-[#4E1724] mx-auto mb-2 shadow-2xs">
              <FileUp className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-[#22161A]">
              {fileName ? fileName : 'Pilih berkas PDF Surat Keputusan atau Regulasi'}
            </p>
            <p className="text-[11px] text-[#756C69] mt-1">Format PDF bertandatangan resmi &amp; cap basah</p>

            <label className="mt-3 inline-block">
              <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EFE8E2] text-xs font-semibold text-[#22161A] hover:bg-[#FAF7F5] cursor-pointer shadow-2xs transition-colors">
                Pilih Berkas Lokal
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFileName(e.target.files[0].name);
                    if (!title) {
                      setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                    }
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<BookOpen className="w-4 h-4" />}>
            Arsipkan ke BEM Vault
          </Button>
        </div>
      </form>
    </div>
  );
}
