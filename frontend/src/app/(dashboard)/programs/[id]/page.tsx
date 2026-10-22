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
  FileSpreadsheet,
  Download,
  Edit3,
  Cpu,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Stepper, { Step } from '@/components/ui/Stepper';
import { getMockPrograms } from '@/lib/mockData';
import { STATUS_CONFIG } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProgramDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const programId = resolvedParams.id;

  const programs = getMockPrograms();
  const program = programs.find((p) => p.id === programId) || programs[0];

  // Build verification stepper steps based on current status & history
  const isSekumDone = ['BENDUM_REVIEW', 'GUBERNUR_REVIEW', 'APPROVED'].includes(program.status);
  const isBendumDone = ['GUBERNUR_REVIEW', 'APPROVED'].includes(program.status);
  const isGubernurDone = program.status === 'APPROVED';

  const steps: Step[] = [
    {
      id: 'step-dept',
      label: 'Departemen',
      sublabel: 'Pengajuan Proposal',
      status: 'completed',
      timestamp: formatDate(program.submittedAt),
      actor: program.submittedBy,
    },
    {
      id: 'step-sekum',
      label: 'Sekretaris Umum',
      sublabel: 'Validasi Administrasi',
      status: isSekumDone
        ? 'completed'
        : program.status === 'SEKUM_REVIEW'
        ? 'active'
        : program.status === 'REVISION'
        ? 'rejected'
        : 'pending',
      timestamp: isSekumDone ? 'Terverifikasi' : undefined,
      actor: 'Siti Rahayu',
    },
    {
      id: 'step-bendum',
      label: 'Bendahara Umum',
      sublabel: 'Verifikasi RAB & Anggaran',
      status: isBendumDone
        ? 'completed'
        : program.status === 'BENDUM_REVIEW'
        ? 'active'
        : 'pending',
      timestamp: isBendumDone ? 'Terverifikasi' : undefined,
      actor: 'Budi Santoso',
    },
    {
      id: 'step-gub',
      label: 'Gubernur BEM',
      sublabel: 'Persetujuan Eksekutif Final',
      status: isGubernurDone
        ? 'completed'
        : program.status === 'GUBERNUR_REVIEW'
        ? 'active'
        : 'pending',
      timestamp: isGubernurDone ? 'Disahkan' : undefined,
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
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
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
      <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
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

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-[#8A817B] uppercase tracking-wider block">
              Total Anggaran
            </span>
            <span className="text-xl font-bold text-[#6E2639] font-mono">
              {formatCurrency(program.totalBudget)}
            </span>
          </div>
        </div>

        {/* Metadata items row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E8E0D7] text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8A817B] shrink-0" />
            <div>
              <p className="text-[10px] text-[#8A817B]">Departemen</p>
              <p className="font-semibold text-[#352A28] truncate">{program.departemen}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#8A817B] shrink-0" />
            <div>
              <p className="text-[10px] text-[#8A817B]">Pengaju</p>
              <p className="font-semibold text-[#352A28] truncate">{program.submittedBy}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8A817B] shrink-0" />
            <div>
              <p className="text-[10px] text-[#8A817B]">Pelaksanaan</p>
              <p className="font-semibold text-[#352A28]">{formatDate(program.plannedDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#8A817B] shrink-0" />
            <div>
              <p className="text-[10px] text-[#8A817B]">Lokasi</p>
              <p className="font-semibold text-[#352A28] truncate">{program.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Progres Verifikasi Birokrasi */}
      <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
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

      {/* Split Details: Left (Description & RAB), Right (IndoBERT Tags, Docs, Revision Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Proposal Narratives & Budget Details */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#352A28] pb-2 border-b border-[#E8E0D7]">
              Latar Belakang & Tujuan
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-[#352A28]">
              <div>
                <span className="font-semibold text-[#8A817B] block mb-0.5">Latar Belakang:</span>
                <p className="bg-[#FAF7F1]/60 p-3 rounded-lg border border-[#E8E0D7]">
                  {program.background}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#8A817B] block mb-0.5">Tujuan & Sasaran:</span>
                <p className="bg-[#FAF7F1]/60 p-3 rounded-lg border border-[#E8E0D7]">
                  {program.objectives}
                </p>
              </div>
            </div>
          </div>

          {/* Rincian Anggaran Biaya (RAB) Table */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D7]">
              <h3 className="text-sm font-bold text-[#352A28]">Rincian Anggaran Biaya (RAB)</h3>
              <span className="text-xs font-mono font-bold text-[#6E2639]">
                {formatCurrency(program.totalBudget)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F1] text-[#8A817B] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">Item Pengeluaran</th>
                    <th className="py-2 px-3 text-center">Vol</th>
                    <th className="py-2 px-3 text-right">Harga Satuan</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D7]">
                  {program.budgetItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 font-medium text-[#352A28]">{item.description}</td>
                      <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#352A28]">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): AI Tags, Support Docs, Revision Notes */}
        <div className="lg:col-span-5 space-y-5">
          {/* IndoBERT Multi-label Tags Card */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E0D7]">
              <Cpu className="w-4 h-4 text-[#6E2639]" />
              <h3 className="text-xs font-bold text-[#352A28] uppercase tracking-wider">
                Klasifikasi IndoBERT
              </h3>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-[#8A817B]">
                Kategori terdeteksi dari pemrosesan teks proposal (Multi-Label Classifier):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {program.indobertTags && program.indobertTags.length > 0 ? (
                  program.indobertTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs bg-[#FAF7F1] border border-[#E8E0D7] text-[#352A28] px-2.5 py-1 rounded-md font-medium"
                    >
                      <span>{tag.label}</span>
                      <span className="text-[10px] text-[#6E2639] font-mono">
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

          {/* Dokumen Pendukung */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#352A28] uppercase tracking-wider pb-2 border-b border-[#E8E0D7]">
              Dokumen Pendukung
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E8E0D7] bg-[#FAF7F1]/60">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#9B2335]" />
                  <div>
                    <p className="font-semibold text-[#352A28]">Dokumen Proposal Resmi</p>
                    <p className="text-[10px] text-[#8A817B]">Format PDF bertandatangan</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Mengunduh draft proposal (Simulasi demo)')}
                  className="p-1.5 text-[#6E2639] hover:bg-white rounded-md border border-[#E8E0D7] cursor-pointer"
                  title="Unduh"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E8E0D7] bg-[#FAF7F1]/60">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#2D7A4F]" />
                  <div>
                    <p className="font-semibold text-[#352A28]">Lampiran Detail RAB (Excel)</p>
                    <p className="text-[10px] text-[#8A817B]">Rincian formula anggaran</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Mengunduh file RAB (Simulasi demo)')}
                  className="p-1.5 text-[#6E2639] hover:bg-white rounded-md border border-[#E8E0D7] cursor-pointer"
                  title="Unduh"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Catatan Verifikasi & Riwayat Persetujuan */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#352A28] uppercase tracking-wider pb-2 border-b border-[#E8E0D7]">
              Catatan Revisi & Verifikasi
            </h3>

            {program.approvalHistory && program.approvalHistory.length > 0 ? (
              <div className="space-y-2.5">
                {program.approvalHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      hist.action === 'APPROVED'
                        ? 'bg-[#EDF7F1]/50 border-[#2D7A4F]/20'
                        : 'bg-[#FEF8ED]/50 border-[#92600C]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#352A28]">
                        {hist.actorRole} ({hist.actorName})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                          hist.action === 'APPROVED'
                            ? 'bg-[#2D7A4F] text-white'
                            : 'bg-[#92600C] text-white'
                        }`}
                      >
                        {hist.action === 'APPROVED' ? 'Disetujui' : 'Catatan Revisi'}
                      </span>
                    </div>
                    <p className="text-[#352A28]">{hist.note}</p>
                    <span className="text-[10px] text-[#8A817B] block">
                      {formatDate(hist.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A817B] italic">
                Belum ada catatan verifikasi khusus pada program ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
