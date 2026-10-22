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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Arsip Dokumen</span>
        </button>
        <span className="text-xs text-[#8A817B]">Form Unggah Arsip</span>
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
              <option value="ACTIVE">Draft / Belum Final (Akses terbatas Dep & Sekum)</option>
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
            <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
              Keterangan / Ringkasan Isi Dokumen
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Informasi nomor surat, tanggal pengesahan, atau rincian laporan..."
              className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg p-3 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15"
            />
          </div>
        </div>

        {/* File Dropzone Area */}
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#352A28]">Unggah Berkas Digital</h3>

          <div className="border-2 border-dashed border-[#E8E0D7] hover:border-[#6E2639]/50 rounded-xl p-6 text-center bg-[#FAF7F1]/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E8E0D7] flex items-center justify-center text-[#6E2639] mx-auto mb-2">
              <FileUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#352A28]">
              {fileName ? fileName : 'Pilih berkas dokumen PDF, Excel (.xlsx), atau Word (.docx)'}
            </p>
            <p className="text-[11px] text-[#8A817B] mt-1">
              Batas ukuran maksimal 15 MB per dokumen
            </p>

            <label className="mt-3 inline-block">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E0D7] text-xs font-semibold text-[#352A28] hover:bg-[#FAF7F1] cursor-pointer">
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
