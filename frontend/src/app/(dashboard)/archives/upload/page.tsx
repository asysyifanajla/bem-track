'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileUp, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getMockArchives, saveMockArchives, getMockPrograms, addMockActivityLog } from '@/lib/mockData';
import { Document, DocumentCategory, ArchiveStatus } from '@/types/document';

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: 'LPJ', label: 'Laporan Pertanggungjawaban (LPJ)' },
  { value: 'PROPOSAL', label: 'Proposal Kegiatan Final' },
  { value: 'RAB', label: 'Rencana Anggaran Biaya (RAB)' },
  { value: 'SURAT_UNDANGAN', label: 'Surat Keputusan / Surat Dinas' },
  { value: 'NOTULENSI', label: 'Notulensi Rapat & Berita Acara' },
  { value: 'DOKUMENTASI', label: 'Dokumentasi & Publikasi' },
  { value: 'LAINNYA', label: 'Dokumen Lainnya' },
];

export default function ArchiveUploadPage() {
  const router = useRouter();
  const programs = getMockPrograms();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('LPJ');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [status, setStatus] = useState<ArchiveStatus>('ARCHIVED');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    await new Promise((r) => setTimeout(r, 450));

    const existing = getMockArchives();
    const relatedProgram = programs.find((p) => p.id === selectedProgramId);

    const newDoc: Document = {
      id: `DOC-2026-${(existing.length + 1).toString().padStart(3, '0')}`,
      title,
      category,
      programId: relatedProgram?.id,
      programTitle: relatedProgram?.title,
      fileUrl: `/mock/docs/${fileName || 'dokumen_arsip.pdf'}`,
      fileSize: 2400000,
      mimeType: fileName.endsWith('.xlsx')
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf',
      status,
      uploadedBy: 'Siti Rahayu (Sekum)',
      uploadedAt: new Date().toISOString(),
      description,
      tags: [category, status === 'ARCHIVED' ? 'FINAL' : 'DRAFT'],
    };

    saveMockArchives([newDoc, ...existing]);
    addMockActivityLog({
      userName: 'Siti Rahayu',
      userRole: 'SEKRETARIS_UMUM',
      action: `Mengunggah Berkas Arsip: ${title}`,
      module: 'Archives',
      details: `Kategori: ${category} &bull; Status: ${status}`,
    });

    setFeedback('Dokumen berhasil diunggah ke repositori arsip.');
    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/archives');
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
          <span>Kembali ke Arsip Dokumen</span>
        </button>
        <span className="text-xs text-[#756C69]">Form Unggah Arsip</span>
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
            Metadata Dokumen
          </h3>

          <Input
            label="Nama / Judul Dokumen"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: LPJ Terpadu Pelantikan & Raker Pengurus 2026"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Jenis / Klasifikasi Dokumen"
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>

            <Select
              label="Status Kelengkapan"
              value={status}
              onChange={(e) => setStatus(e.target.value as ArchiveStatus)}
              required
            >
              <option value="ARCHIVED">Dokumen Final (Dapat diakses publik/BPH)</option>
              <option value="ACTIVE">Draft / Belum Final (Akses terbatas Dep &amp; Sekum)</option>
            </Select>
          </div>

          <Select
            label="Program Kerja Terkait (Opsional)"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
          >
            <option value="">-- Tidak Terikat Program Tertentu (Dokumen Umum) --</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.departemen})
              </option>
            ))}
          </Select>

          <div>
            <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
              Keterangan / Ringkasan Isi Dokumen
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Informasi nomor surat, tanggal pengesahan, atau rincian laporan..."
              className="w-full bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A] placeholder-[#A39893] text-sm rounded-2xl p-3.5 focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-all"
            />
          </div>
        </div>

        {/* File Dropzone Area */}
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-3.5">
          <h3 className="text-sm sm:text-base font-bold text-[#22161A] tracking-tight">Unggah Berkas Digital</h3>

          <div className="border-2 border-dashed border-[#EFE8E2] hover:border-[#4E1724]/60 rounded-2xl p-6 text-center bg-[#FAF7F5]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EFE8E2] flex items-center justify-center text-[#4E1724] mx-auto mb-2 shadow-2xs">
              <FileUp className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-[#22161A]">
              {fileName ? fileName : 'Pilih berkas dokumen PDF, Excel (.xlsx), atau Word (.docx)'}
            </p>
            <p className="text-[11px] text-[#756C69] mt-1">
              Batas ukuran maksimal 15 MB per dokumen
            </p>

            <label className="mt-3 inline-block">
              <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EFE8E2] text-xs font-semibold text-[#22161A] hover:bg-[#FAF7F5] cursor-pointer shadow-2xs transition-colors">
                Pilih Berkas Lokal
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.xlsx,.xls,.docx,.doc"
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
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Simpan Dokumen Arsip
          </Button>
        </div>
      </form>
    </div>
  );
}
