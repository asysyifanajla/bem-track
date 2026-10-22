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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke BEM Vault</span>
        </button>
        <span className="text-xs text-[#8A817B]">Form Pengunggahan Dokumen Resmi</span>
      </div>

      {feedback && (
        <div className="p-3 bg-[#EDF7F1] border border-[#2D7A4F]/25 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2D7A4F]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#352A28] pb-2 border-b border-[#E8E0D7]">
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
            <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
              Deskripsi Ketetapan / Ruang Lingkup
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan dasar hukum ketetapan, nomor surat keputusan, atau pedoman..."
              className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg p-3 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15"
            />
          </div>
        </div>

        {/* File Dropzone */}
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#352A28]">Berkas Digital Master</h3>

          <div className="border-2 border-dashed border-[#E8E0D7] hover:border-[#6E2639]/50 rounded-xl p-6 text-center bg-[#FAF7F1]/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E8E0D7] flex items-center justify-center text-[#6E2639] mx-auto mb-2">
              <FileUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#352A28]">
              {fileName ? fileName : 'Pilih berkas PDF Surat Keputusan atau Regulasi'}
            </p>
            <p className="text-[11px] text-[#8A817B] mt-1">Format PDF bertandatangan resmi & cap basah</p>

            <label className="mt-3 inline-block">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E0D7] text-xs font-semibold text-[#352A28] hover:bg-[#FAF7F1] cursor-pointer">
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
