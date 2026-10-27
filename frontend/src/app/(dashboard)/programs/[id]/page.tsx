'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  User,
  FileText,
  Download,
  Edit3,
  Cpu,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Stepper, { Step } from '@/components/ui/Stepper';
import { getMockPrograms } from '@/lib/mockData';
import { STATUS_CONFIG } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProgramDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const programId = resolvedParams.id;

  const programs = getMockPrograms();
  const program = programs.find((p) => p.id === programId) || programs[0];

  const currentUser = useCurrentUser();

  // Build verification stepper steps based on current status & history (Bendum -> Sekum -> Gubernur)
  const isBendumDone = ['SEKUM_REVIEW', 'GUBERNUR_REVIEW', 'APPROVED'].includes(program.status);
  const isSekumDone = ['GUBERNUR_REVIEW', 'APPROVED'].includes(program.status);
  const isGubernurDone = program.status === 'APPROVED';

  const steps: Step[] = [
    {
      id: 'step-dept',
      label: 'Departemen',
      sublabel: 'Pengajuan Proposal / LPJ',
      status: 'completed',
      timestamp: formatDate(program.submittedAt),
      actor: program.submittedBy,
    },
    {
      id: 'step-bendum',
      label: 'Bendahara Umum',
      sublabel: 'Tahap 1: Verifikasi Usulan & Anggaran',
      status: isBendumDone
        ? 'completed'
        : program.status === 'BENDUM_REVIEW'
        ? 'active'
        : program.status === 'REVISION'
        ? 'rejected'
        : 'pending',
      timestamp: isBendumDone ? 'Diverifikasi' : undefined,
      actor: 'Budi Santoso',
    },
    {
      id: 'step-sekum',
      label: 'Sekretaris Umum',
      sublabel: 'Tahap 2: Validasi Administrasi & Berkas',
      status: isSekumDone
        ? 'completed'
        : program.status === 'SEKUM_REVIEW'
        ? 'active'
        : 'pending',
      timestamp: isSekumDone ? 'Diverifikasi' : undefined,
      actor: 'Siti Rahayu',
    },
    {
      id: 'step-gub',
      label: 'Gubernur BEM',
      sublabel: 'Tahap 3: Persetujuan Eksekutif Final',
      status: isGubernurDone
        ? 'completed'
        : program.status === 'GUBERNUR_REVIEW'
        ? 'active'
        : 'pending',
      timestamp: isGubernurDone ? 'Disahkan (Approval)' : undefined,
      actor: 'Ahmad Fauzi',
    },
  ];

  const getStatusBadge = (status: keyof typeof STATUS_CONFIG) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
    const variantMap: Record<string, 'default' | 'maroon' | 'cream' | 'success' | 'warning' | 'danger' | 'info'> = {
      DRAFT: 'default',
      SUBMITTED: 'info',
      SEKUM_REVIEW: 'warning',
      BENDUM_REVIEW: 'warning',
      GUBERNUR_REVIEW: 'maroon',
      APPROVED: 'success',
      REVISION: 'warning',
      REJECTED: 'danger',
    };
    return (
      <Badge variant={variantMap[status] || 'default'} dot>
        {cfg.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto font-sans">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E8E0D7]">
        <button
          onClick={() => router.push('/programs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Program</span>
        </button>

        <div className="flex items-center gap-2">
          <Link href={`/programs/${program.id}/edit`}>
            <Button variant="secondary" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
              Sunting Program
            </Button>
          </Link>
          <Link href="/verifications">
            <Button size="sm">Buka Halaman Verifikasi</Button>
          </Link>
        </div>
      </div>

      {/* Program Core Hero Card */}
      <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#6E2639] bg-[#F5EEF0] px-2 py-0.5 rounded-sm">
                {program.id}
              </span>
              {getStatusBadge(program.status as keyof typeof STATUS_CONFIG)}
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-[#352A28] tracking-tight">
              {program.title}
            </h1>
            <p className="text-xs text-[#8A817B] leading-relaxed max-w-3xl">
              {program.description}
            </p>
          </div>
        </div>

        {/* Metadata items row (Bounded, non-overlapping) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3.5 border-t border-[#E8E0D7] text-xs">
          <div className="flex items-start gap-2.5 min-w-0 p-2.5 rounded-lg bg-[#FAF7F1]/60 border border-[#E8E0D7]/60">
            <Building2 className="w-4 h-4 text-[#6E2639] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[#8A817B] leading-none mb-1">Departemen</p>
              <p className="font-semibold text-[#352A28] truncate text-xs" title={program.departemen}>
                {program.departemen}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 min-w-0 p-2.5 rounded-lg bg-[#FAF7F1]/60 border border-[#E8E0D7]/60">
            <User className="w-4 h-4 text-[#6E2639] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[#8A817B] leading-none mb-1">Pengaju</p>
              <p className="font-semibold text-[#352A28] truncate text-xs" title={program.submittedBy}>
                {program.submittedBy}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 min-w-0 p-2.5 rounded-lg bg-[#FAF7F1]/60 border border-[#E8E0D7]/60">
            <Calendar className="w-4 h-4 text-[#6E2639] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[#8A817B] leading-none mb-1">Pelaksanaan</p>
              <p className="font-semibold text-[#352A28] truncate text-xs">
                {formatDate(program.plannedDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 min-w-0 p-2.5 rounded-lg bg-[#FAF7F1]/60 border border-[#E8E0D7]/60">
            <MapPin className="w-4 h-4 text-[#6E2639] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[#8A817B] leading-none mb-1">Lokasi</p>
              <p className="font-semibold text-[#352A28] truncate text-xs" title={program.location}>
                {program.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Progres Verifikasi Birokrasi (Tahapan Persetujuan) */}
      <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
          <div>
            <h3 className="text-sm font-bold text-[#352A28]">Tahapan Verifikasi Birokrasi</h3>
            <p className="text-xs text-[#8A817B]">
              Alur persetujuan bertingkat Departemen &rarr; Sekum &rarr; Bendum &rarr; Gubernur
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#6E2639] bg-[#F5EEF0] px-2 py-0.5 rounded-sm">
            Birokrasi BEM FKI
          </span>
        </div>

        <div className="py-2 overflow-x-auto">
          <Stepper steps={steps} />
        </div>
      </div>

      {/* Main Content (2-Column Balanced Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Card Detail Program Kerja */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="pb-3 border-b border-[#E8E0D7]">
              <h3 className="text-sm font-bold text-[#352A28]">Detail Program Kerja</h3>
              <p className="text-xs text-[#8A817B]">
                Latar belakang serta tujuan dan sasaran kegiatan
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#352A28] leading-relaxed">
              {/* Latar Belakang */}
              <div>
                <p className="font-semibold text-[#6E2639] text-xs mb-1.5">Latar Belakang:</p>
                <p className="text-[#352A28] leading-relaxed">
                  {program.background || program.description}
                </p>
              </div>

              <div className="border-t border-[#E8E0D7]/60" />

              {/* Tujuan & Sasaran */}
              <div>
                <p className="font-semibold text-[#6E2639] text-xs mb-1.5">Tujuan &amp; Sasaran:</p>
                <p className="text-[#352A28] leading-relaxed">
                  {program.objectives || 'Meningkatkan kapasitas mahasiswa dan sinergi organisasi BEM FKI UMS.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Dokumen Proposal & RAB + Klasifikasi IndoBERT (Ringkas) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Dokumen Proposal & RAB (Ringkas, tanpa penjelasan berulang) */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D7]">
              <h3 className="text-xs font-bold text-[#352A28] uppercase tracking-wider">
                Dokumen Proposal &amp; RAB
              </h3>
              <span className="text-[11px] text-[#8A817B]">Lampiran Berkas</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E0D7] bg-[#FAF7F1]/60 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-[#6E2639] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-[#352A28] truncate text-xs" title={program.proposalFileName}>
                    {program.proposalFileName || 'Proposal_dan_RAB.pdf'}
                  </p>
                  <p className="text-[10px] text-[#8A817B]">
                    {((program.proposalFileSize || 2450000) / (1024 * 1024)).toFixed(2)} MB &bull; PDF Terpadu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Mengunduh berkas: ${program.proposalFileName || 'Proposal.pdf'}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6E2639] bg-white hover:bg-[#F5EEF0] rounded-md border border-[#E8E0D7] cursor-pointer shadow-2xs shrink-0 transition-colors"
                title="Unduh Berkas"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </button>
            </div>
          </div>

          {/* Klasifikasi IndoBERT (Ringkas sebagai informasi pendukung) */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D7]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#6E2639]" />
                <h3 className="text-xs font-bold text-[#352A28] uppercase tracking-wider">
                  Klasifikasi IndoBERT
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#6E2639] bg-[#F5EEF0] px-2 py-0.5 rounded-sm">
                AI Classifier
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[11px] text-[#8A817B]">
                Kategori terdeteksi dari naskah proposal:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {program.indobertTags && program.indobertTags.length > 0 ? (
                  program.indobertTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs bg-[#FAF7F1] border border-[#E8E0D7] text-[#352A28] px-2.5 py-1 rounded-md font-medium"
                    >
                      <span className="truncate max-w-[200px]">{tag.label}</span>
                      <span className="text-[10px] text-[#6E2639] font-mono font-bold">
                        {(tag.confidence * 100).toFixed(0)}%
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#8A817B] italic">
                    Belum dianalisis (Layanan klasifikasi standby)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
