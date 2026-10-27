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
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EFE8E2] text-xs font-semibold text-[#756C69] hover:text-[#4E1724] hover:bg-[#FAF7F5] shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Program</span>
        </Link>
        <span className="text-[11px] font-semibold text-[#756C69] bg-white border border-[#EFE8E2] px-3 py-1 rounded-full shadow-2xs">
          {isEdit ? 'Mode Sunting Program' : 'Formulir Usulan Terpadu'}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#756C69]">
                Birokrasi BEM FKI UMS &bull; {isEdit ? 'Pembaruan Data' : 'Pengajuan Proposal Baru'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#22161A] tracking-tight">
              {isEdit ? `Sunting Usulan: ${title}` : 'Pengajuan Usulan Program Kerja'}
            </h1>
            <p className="text-xs sm:text-sm text-[#756C69] max-w-2xl leading-relaxed">
              Formulir usulan terpadu: lengkapi judul, deskripsi, jadwal kegiatan, dan unggah dokumen proposal yang memuat usulan kegiatan beserta Rencana Anggaran Biaya (RAB).
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] flex items-center justify-center text-[#8B263E] shrink-0 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* 3-Step Structure Summary */}
        <div className="pt-3 border-t border-[#EFE8E2] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF0F3] border border-[#4E1724]/20 text-[#4E1724]">
            <span className="w-5 h-5 rounded-full bg-[#4E1724] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
              1
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-xs truncate">Informasi &amp; IndoBERT</p>
              <p className="text-[10px] text-[#8B263E] truncate">Judul, deskripsi &amp; multi-label</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A]">
            <span className="w-5 h-5 rounded-full bg-[#EFE8E2] text-[#22161A] flex items-center justify-center text-[11px] font-bold shrink-0">
              2
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-xs truncate">Jadwal &amp; Departemen</p>
              <p className="text-[10px] text-[#756C69] truncate">4 Departemen pelaksana resmi</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A]">
            <span className="w-5 h-5 rounded-full bg-[#EFE8E2] text-[#22161A] flex items-center justify-center text-[11px] font-bold shrink-0">
              3
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-xs truncate">Unggah Dokumen Proposal</p>
              <p className="text-[10px] text-[#756C69] truncate">Memuat proposal &amp; RAB terpadu</p>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0]/60 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#059669] shadow-2xs">
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
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
          <div className="pb-3 border-b border-[#EFE8E2] flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#22161A] tracking-tight">
                1. Informasi Pokok &amp; Klasifikasi Otomatis IndoBERT
              </h2>
              <p className="text-xs text-[#756C69] mt-0.5">
                Judul dan deskripsi akan dianalisis model IndoBERT ke dalam 5 kategori multi-label resmi
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#4E1724] bg-[#FAF0F3] border border-[#4E1724]/20 px-2.5 py-0.5 rounded-full">
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
              <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
                Deskripsi Program Kerja <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Jelaskan ringkasan materi, sasaran peserta, dan urgensi program..."
                className="w-full bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A] placeholder-[#A39893] text-sm rounded-2xl p-3.5 focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-all"
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
              <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
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
                          ? 'bg-[#4E1724] text-white border-[#4E1724] shadow-xs font-medium'
                          : 'bg-[#FAF7F5] text-[#22161A] border-[#EFE8E2] hover:bg-[#F2ECE4]'
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
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
          <div className="pb-3 border-b border-[#EFE8E2]">
            <h2 className="text-sm sm:text-base font-bold text-[#22161A] tracking-tight">
              2. Departemen Pelaksana &amp; Jadwal Pelaksanaan
            </h2>
            <p className="text-xs text-[#756C69] mt-0.5">
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
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-4">
          <div className="pb-3 border-b border-[#EFE8E2] flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#22161A] tracking-tight">
                3. Unggah Dokumen Proposal (Memuat Proposal &amp; RAB)
              </h2>
              <p className="text-xs text-[#756C69] mt-0.5">
                Dokumen proposal resmi berisikan naskah kegiatan lengkap dan Rencana Anggaran Biaya (RAB)
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#4E1724] bg-[#FAF0F3] border border-[#4E1724]/20 px-2.5 py-0.5 rounded-full">
              Wajib Unggah
            </span>
          </div>

          {/* Informative Alert explaining simplified proposal & RAB */}
          <div className="p-4 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-[#22161A]">
            <Building2 className="w-4 h-4 text-[#4E1724] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#4E1724]">
                Penyederhanaan Formulir (BEM-Track Revision Rule)
              </p>
              <p className="text-[11px] text-[#756C69] mt-0.5">
                Sesuai aturan birokrasi BEM-Track, pengusul <strong>tidak perlu menginput rincian item anggaran satu per satu</strong> pada formulir manual. Bendahara Umum akan meninjau dan memverifikasi kelayakan anggaran (RAB) langsung dari dokumen proposal resmi yang Anda unggah di sini.
              </p>
            </div>
          </div>

          {/* File Upload Drop Area */}
          <div className="space-y-3">
            {!proposalFileName ? (
              <label className="border-2 border-dashed border-[#EFE8E2] hover:border-[#4E1724]/60 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FAF7F5]/50 hover:bg-[#FAF7F5]">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#EFE8E2] flex items-center justify-center text-[#4E1724] shadow-2xs mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#22161A]">
                  Klik untuk memilih atau seret dokumen proposal ke sini
                </p>
                <p className="text-[11px] text-[#756C69] mt-1">
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
              <div className="flex items-center justify-between p-4 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EFE8E2] flex items-center justify-center text-[#4E1724] shrink-0 shadow-2xs">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[#22161A] truncate">
                      {proposalFileName}
                    </p>
                    <p className="text-[11px] text-[#756C69]">
                      {(proposalFileSize / (1024 * 1024)).toFixed(2)} MB &bull; Dokumen Proposal &amp; RAB Siap Diajukan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="px-3 py-1.5 rounded-xl bg-white border border-[#EFE8E2] text-xs font-semibold text-[#22161A] hover:bg-[#FAF7F5] cursor-pointer transition-colors shadow-2xs">
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
                    className="p-1.5 rounded-xl text-[#DC2626] hover:bg-rose-50 transition-colors cursor-pointer"
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
