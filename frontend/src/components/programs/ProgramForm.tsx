'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle2,
  FileText,
  UploadCloud,
  FileUp,
  X,
  AlertCircle,
  Clock,
  Calendar,
  Building2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import AutoTagPreview from './AutoTagPreview';
import { DEPARTMENTS, PROGRAM_CATEGORIES, MAX_FILE_SIZE_MB } from '@/lib/constants';
import { Program, ProgramCategory, ProgramStatus } from '@/types/program';
import { getMockPrograms, saveMockPrograms, addMockActivityLog } from '@/lib/mockData';

interface ProgramFormProps {
  initialData?: Program;
  isEdit?: boolean;
}

export default function ProgramForm({ initialData, isEdit = false }: ProgramFormProps) {
  const router = useRouter();

  // 1. Program title
  const [title, setTitle] = useState(
    initialData?.title || 'Company Profile Production Training'
  );

  // 2. Executing department (Strictly one of 4 canonical departments)
  const [departemen, setDepartemen] = useState(
    initialData?.departemen && (DEPARTMENTS as readonly string[]).includes(initialData.departemen)
      ? initialData.departemen
      : DEPARTMENTS[0]
  );

  // 3. Program description
  const [description, setDescription] = useState(
    initialData?.description ||
      'Pelatihan pembuatan dan penyuntingan video profil organisasi BEM untuk meningkatkan kemampuan anggota dalam bidang publikasi.'
  );

  // 4. Program implementation date or schedule
  const [plannedDate, setPlannedDate] = useState(
    initialData?.plannedDate || '2026-11-15'
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate || '2026-11-16'
  );
  const [location, setLocation] = useState(
    initialData?.location || 'Lab Multimedia Lantai 3 Gedung J FKI UMS'
  );

  // Categories (5 thesis categories)
  const [selectedCategories, setSelectedCategories] = useState<ProgramCategory[]>(
    initialData?.categories && initialData.categories.length > 0
      ? initialData.categories
      : ['MEDIA_INFORMATION_PUBLICATION', 'EDUCATION_TRAINING_CAREER']
  );

  // 5. Proposal document upload (Contains activity proposal & integrated RAB)
  const [proposalFileName, setProposalFileName] = useState<string>(
    initialData?.proposalFileName ||
      (initialData?.proposalFileUrl ? 'Proposal_Kegiatan_Lengkap_dan_RAB.pdf' : 'Proposal_Company_Profile_Training.pdf')
  );
  const [proposalFileSize, setProposalFileSize] = useState<number>(
    initialData?.proposalFileSize || 2450000
  );
  const [proposalFileUrl, setProposalFileUrl] = useState<string>(
    initialData?.proposalFileUrl || '/mock/docs/Proposal_Company_Profile_Training.pdf'
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleCategory = (cat: ProgramCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) return; // Keep at least one
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(`Ukuran file melebihi batas maksimal ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Validate permitted formats: PDF, DOC, DOCX
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileNameLower = file.name.toLowerCase();
    const isValidFormat = validExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!isValidFormat) {
      setFileError('Format file tidak didukung. Harap unggah dokumen berekstensi .pdf, .doc, atau .docx.');
      return;
    }

    setProposalFileName(file.name);
    setProposalFileSize(file.size);
    // Create object URL for local preview
    const url = URL.createObjectURL(file);
    setProposalFileUrl(url);
  };

  const removeUploadedFile = () => {
    setProposalFileName('');
    setProposalFileSize(0);
    setProposalFileUrl('');
  };

  const handleSubmit = async (submitStatus: 'DRAFT' | 'SUBMITTED') => {
    setFormError(null);
    setFeedback(null);

    // Validate required fields
    if (!title.trim()) {
      setFormError('Judul program kerja wajib diisi.');
      return;
    }
    if (!description.trim()) {
      setFormError('Deskripsi program kerja wajib diisi.');
      return;
    }
    if (!plannedDate) {
      setFormError('Rencana tanggal pelaksanaan wajib ditentukan.');
      return;
    }

    // If submitting for verification, proposal document is mandatory
    if (submitStatus === 'SUBMITTED' && !proposalFileName) {
      setFormError('Dokumen proposal kegiatan (memuat usulan dan RAB) wajib diunggah sebelum mengajukan.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));

    const existing = getMockPrograms();

    if (isEdit && initialData) {
      const updatedList = existing.map((p) => {
        if (p.id === initialData.id) {
          return {
            ...p,
            title,
            departemen,
            description,
            plannedDate,
            endDate,
            location,
            categories: selectedCategories,
            proposalFileUrl: proposalFileUrl || p.proposalFileUrl,
            proposalFileName: proposalFileName || p.proposalFileName,
            proposalFileSize: proposalFileSize || p.proposalFileSize,
            status: (submitStatus === 'SUBMITTED' ? 'BENDUM_REVIEW' : 'DRAFT') as ProgramStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      saveMockPrograms(updatedList);
      addMockActivityLog({
        userName: 'Pengurus BEM',
        userRole: 'DEPARTEMEN_1',
        action: `Memperbarui Usulan Program Kerja: ${title}`,
        module: 'Programs',
        details: `Status diperbarui menjadi: ${submitStatus === 'SUBMITTED' ? 'BENDUM_REVIEW (Tahap 1: Bendum)' : 'DRAFT'}`,
      });
    } else {
      const targetStatus: ProgramStatus = submitStatus === 'SUBMITTED' ? 'BENDUM_REVIEW' : 'DRAFT';
      const newProgram: Program = {
        id: `PRG-2026-${(existing.length + 1).toString().padStart(3, '0')}`,
        title,
        departemen,
        description,
        background: 'Program kerja kepengurusan BEM FKI UMS.',
        objectives: 'Meningkatkan kapabilitas dan transparansi tata kelola birokrasi.',
        targetParticipants: 'Mahasiswa FKI UMS',
        plannedDate,
        endDate,
        location,
        status: targetStatus,
        categories: selectedCategories,
        indobertTags: selectedCategories.map((c) => ({
          label: PROGRAM_CATEGORIES.find((cat) => cat.value === c)?.label || c,
          category: c,
          confidence: 0.88,
        })),
        proposalFileUrl: proposalFileUrl || '/mock/docs/Proposal_Contoh.pdf',
        proposalFileName: proposalFileName || 'Dokumen_Proposal_dan_RAB.pdf',
        proposalFileSize: proposalFileSize || 2048000,
        proposalMimeType: 'application/pdf',
        submittedBy: `${departemen.split('—')[0].trim()} BEM FKI`,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalHistory: [],
      };
      saveMockPrograms([newProgram, ...existing]);
      addMockActivityLog({
        userName: 'Pengurus BEM',
        userRole: 'DEPARTEMEN_1',
        action: `Mengajukan Usulan Program Kerja: ${title}`,
        module: 'Programs',
        details: `ID: ${newProgram.id} diajukan ke Bendahara Umum untuk verifikasi anggaran & usulan (Tahap 1: Pending Sekum)`,
      });
    }

    setFeedback(
      submitStatus === 'SUBMITTED'
        ? 'Usulan program kerja dan dokumen proposal berhasil diajukan ke Bendahara Umum (Tahap 1: Verifikasi RAB).'
        : 'Draft usulan program kerja berhasil disimpan.'
    );
    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/programs');
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8DFD3] text-xs font-semibold text-[#8A817B] hover:text-[#352A28] hover:bg-[#FAF7F1] shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Program</span>
        </Link>
        <span className="text-[11px] font-semibold text-[#8A817B] bg-white border border-[#E8DFD3] px-3 py-1 rounded-full shadow-2xs">
          {isEdit ? 'Mode Sunting Program' : 'Formulir Usulan Terpadu'}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white border border-[#E8DFD3] rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6E2639]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#8A817B]">
                Birokrasi BEM FKI UMS &bull; {isEdit ? 'Pembaruan Data' : 'Pengajuan Proposal Baru'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
              {isEdit ? `Sunting Usulan: ${title}` : 'Pengajuan Usulan Program Kerja'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8A817B] max-w-2xl leading-relaxed">
              Formulir usulan terpadu: lengkapi judul, deskripsi, jadwal kegiatan, dan unggah dokumen proposal yang memuat usulan kegiatan beserta Rencana Anggaran Biaya (RAB).
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F1] border border-[#E8DFD3] flex items-center justify-center text-[#6E2639] shrink-0 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* 3-Step Structure Summary */}
        <div className="pt-3 border-t border-[#E8DFD3]/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#F5EEF0] border border-[#6E2639]/20 text-[#6E2639]">
            <span className="w-5 h-5 rounded-full bg-[#6E2639] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
              1
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-xs truncate">Informasi &amp; IndoBERT</p>
              <p className="text-[10px] text-[#8A4658] truncate">Judul, deskripsi &amp; multi-label</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FAF7F1] border border-[#E8DFD3] text-[#352A28]">
            <span className="w-5 h-5 rounded-full bg-[#E8DFD3] text-[#352A28] flex items-center justify-center text-[11px] font-bold shrink-0">
              2
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-xs truncate">Jadwal &amp; Departemen</p>
              <p className="text-[10px] text-[#8A817B] truncate">4 Departemen pelaksana resmi</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FAF7F1] border border-[#E8DFD3] text-[#352A28]">
            <span className="w-5 h-5 rounded-full bg-[#E8DFD3] text-[#352A28] flex items-center justify-center text-[11px] font-bold shrink-0">
              3
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-xs truncate">Unggah Dokumen Proposal</p>
              <p className="text-[10px] text-[#8A817B] truncate">Memuat proposal &amp; RAB terpadu</p>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-[#EDF7F1] border border-[#2D7A4F]/25 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#2D7A4F] shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {formError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-rose-700 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Surfaces */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('SUBMITTED');
        }}
        className="space-y-6"
      >
        {/* Section 1: Informasi Pokok & IndoBERT Multi-Label */}
        <div className="bg-white border border-[#E8DFD3] rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E8DFD3] flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#352A28] tracking-tight">
                1. Informasi Pokok &amp; Klasifikasi Otomatis IndoBERT
              </h2>
              <p className="text-xs text-[#8A817B] mt-0.5">
                Judul dan deskripsi akan dianalisis model IndoBERT ke dalam 5 kategori multi-label resmi
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#6E2639] bg-[#F5EEF0] px-2.5 py-0.5 rounded-full">
              Wajib Diisi
            </span>
          </div>

          <div className="space-y-4">
            <Input
              label="Judul Program Kerja"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Company Profile Production Training"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
                Deskripsi Program Kerja <span className="text-[#9B2335]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Jelaskan ringkasan materi, sasaran peserta, dan urgensi program..."
                className="w-full bg-[#FAF7F1]/30 border border-[#E8DFD3] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-2xl p-3.5 focus:bg-white focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15 transition-all"
              />
            </div>

            {/* IndoBERT Multi-Label Recommendation Preview */}
            <AutoTagPreview
              title={title}
              description={description}
              onApplyTags={(tags) => setSelectedCategories(tags)}
            />

            {/* Manual Category Selection (5 Thesis Categories) */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
                Pilihan Kategori Multi-Label (5 Kategori Resmi):
              </label>
              <div className="flex flex-wrap gap-2">
                {PROGRAM_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.value as ProgramCategory);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value as ProgramCategory)}
                      className={`text-xs px-3.5 py-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#6E2639] text-white border-[#6E2639] shadow-xs font-medium'
                          : 'bg-[#FAF7F1] text-[#352A28] border-[#E8DFD3] hover:bg-[#F3EBDD]'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Departemen Pelaksana & Jadwal Kegiatan */}
        <div className="bg-white border border-[#E8DFD3] rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E8DFD3]">
            <h2 className="text-sm sm:text-base font-bold text-[#352A28] tracking-tight">
              2. Departemen Pelaksana &amp; Jadwal Pelaksanaan
            </h2>
            <p className="text-xs text-[#8A817B] mt-0.5">
              Pilih satu dari 4 departemen pelaksana resmi dan tentukan jadwal pelaksanaan
            </p>
          </div>

          <div className="space-y-4">
            <Select
              label="Departemen Pelaksana (4 Departemen Resmi)"
              value={departemen}
              onChange={(e) => setDepartemen(e.target.value)}
              required
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Tanggal Mulai Pelaksanaan"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                required
              />
              <Input
                type="date"
                label="Tanggal Selesai (Opsional)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <Input
              label="Tempat / Lokasi Acara"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Auditorium Moh. Djazman Kampus 1 UMS"
              required
            />
          </div>
        </div>

        {/* Section 3: Unggah Dokumen Proposal (Memuat Usulan & RAB Terpadu) */}
        <div className="bg-white border border-[#E8DFD3] rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E8DFD3] flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#352A28] tracking-tight">
                3. Unggah Dokumen Proposal (Memuat Proposal &amp; RAB)
              </h2>
              <p className="text-xs text-[#8A817B] mt-0.5">
                Dokumen proposal resmi berisikan naskah kegiatan lengkap dan Rencana Anggaran Biaya (RAB)
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#6E2639] bg-[#F5EEF0] px-2.5 py-0.5 rounded-full">
              Wajib Unggah
            </span>
          </div>

          {/* Informative Alert explaining simplified proposal & RAB */}
          <div className="p-3.5 bg-[#FAF7F1] border border-[#E8DFD3] rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-[#352A28]">
            <Building2 className="w-4 h-4 text-[#6E2639] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#6E2639]">
                Penyederhanaan Formulir (BEM-Track Revision Rule)
              </p>
              <p className="text-[11px] text-[#8A817B] mt-0.5">
                Sesuai aturan birokrasi BEM-Track, pengusul <strong>tidak perlu menginput rincian item anggaran satu per satu</strong> pada formulir manual. Bendahara Umum akan meninjau dan memverifikasi kelayakan anggaran (RAB) langsung dari dokumen proposal resmi yang Anda unggah di sini.
              </p>
            </div>
          </div>

          {/* File Upload Drop Area */}
          <div className="space-y-3">
            {!proposalFileName ? (
              <label className="border-2 border-dashed border-[#E8DFD3] hover:border-[#6E2639]/60 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FAF7F1]/30 hover:bg-[#FAF7F1]/70">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#6E2639] shadow-2xs mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#352A28]">
                  Klik untuk memilih atau seret dokumen proposal ke sini
                </p>
                <p className="text-[11px] text-[#8A817B] mt-1">
                  Format didukung: <strong>PDF, DOC, DOCX</strong> &bull; Ukuran maksimal <strong>{MAX_FILE_SIZE_MB} MB</strong>
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-[#FAF7F1] border border-[#E8DFD3] rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#6E2639] shrink-0 shadow-2xs">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[#352A28] truncate">
                      {proposalFileName}
                    </p>
                    <p className="text-[11px] text-[#8A817B]">
                      {(proposalFileSize / (1024 * 1024)).toFixed(2)} MB &bull; Dokumen Proposal &amp; RAB Siap Diajukan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DFD3] text-xs font-semibold text-[#352A28] hover:bg-[#FAF7F1] cursor-pointer transition-colors shadow-2xs">
                    Ganti
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={removeUploadedFile}
                    className="p-1.5 rounded-xl text-[#9B2335] hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {fileError && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fileError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit('DRAFT')}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Simpan Sebagai Draft
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Ajukan ke Bendahara Umum (Tahap 1)
          </Button>
        </div>
      </form>
    </div>
  );
}
