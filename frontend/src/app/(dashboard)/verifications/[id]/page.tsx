'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Download,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  Wallet,
  ShieldCheck,
  FileCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Stepper, { Step } from '@/components/ui/Stepper';
import Modal from '@/components/ui/Modal';
import { getMockPrograms, saveMockPrograms, addMockActivityLog } from '@/lib/mockData';
import { STATUS_CONFIG, PROGRAM_CATEGORIES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { canVerifyAdmin, canVerifyBudget, canApproveExecutive } from '@/lib/permissions';
import { UserRole } from '@/types/auth';
import { ProgramStatus } from '@/types/program';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VerificationDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const programId = resolvedParams.id;

  const [programs, setPrograms] = useState(() => getMockPrograms());
  const program = programs.find((p) => p.id === programId) || programs[0];

  const currentUser = useCurrentUser();
  const userRole = (currentUser.role || 'GUBERNUR') as UserRole;

  // Document preview state
  const [showPreview, setShowPreview] = useState(true);
  const [previewZoom, setPreviewZoom] = useState(100);

  // Modal decision state
  const [modalAction, setModalAction] = useState<'APPROVE' | 'REVISION' | 'REJECT' | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Stepper calculations (Departemen -> Bendum [Tahap 1] -> Sekum [Tahap 2] -> Gubernur [Tahap 3])
  const isBendumDone = ['SEKUM_REVIEW', 'GUBERNUR_REVIEW', 'APPROVED'].includes(program.status);
  const isSekumDone = ['GUBERNUR_REVIEW', 'APPROVED'].includes(program.status);
  const isGubernurDone = program.status === 'APPROVED';

  const steps: Step[] = [
    {
      id: 'step-dept',
      label: 'Departemen Pelaksana',
      sublabel: 'Pengajuan Proposal & RAB',
      status: 'completed',
      timestamp: formatDate(program.submittedAt),
      actor: program.submittedBy,
    },
    {
      id: 'step-bendum',
      label: 'Bendahara Umum',
      sublabel: 'Tahap 1: Verifikasi Usulan & Anggaran (RAB)',
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
      sublabel: 'Tahap 3: Persetujuan Eksekutif Final (Approval)',
      status: isGubernurDone
        ? 'completed'
        : program.status === 'GUBERNUR_REVIEW'
          ? 'active'
          : 'pending',
      timestamp: isGubernurDone ? 'Disahkan (Approval)' : undefined,
      actor: 'Ahmad Fauzi',
    },
  ];

  // Authority check based on current program stage and user role
  const isAtBendumStage = program.status === 'BENDUM_REVIEW';
  const isAtSekumStage = program.status === 'SEKUM_REVIEW';
  const isAtGubernurStage = program.status === 'GUBERNUR_REVIEW';

  const canDecide =
    (isAtBendumStage && canVerifyBudget(userRole)) ||
    (isAtSekumStage && canVerifyAdmin(userRole)) ||
    (isAtGubernurStage && canApproveExecutive(userRole));

  const handleDownloadDocument = () => {
    // In production, downloads the actual stored document; in demo, simulates secure download
    alert(`Mengunduh dokumen: "${program.proposalFileName || 'Dokumen_Proposal_dan_RAB.pdf'}"`);
  };

  const handleConfirmDecision = async () => {
    if (!modalAction) return;

    // Require explanation note when requesting revision or rejecting
    if ((modalAction === 'REVISION' || modalAction === 'REJECT') && !decisionNote.trim()) {
      setModalError('Wajib mencantumkan catatan evaluasi/alasan agar pengusul dapat menindaklanjuti.');
      return;
    }

    setIsProcessing(true);
    setModalError(null);

    await new Promise((r) => setTimeout(r, 450));

    let nextStatus = program.status;
    let stageRole = 'PENGURUS';

    if (modalAction === 'APPROVE') {
      if (program.status === 'BENDUM_REVIEW') {
        nextStatus = 'SEKUM_REVIEW';
        stageRole = 'Bendahara Umum';
      } else if (program.status === 'SEKUM_REVIEW') {
        nextStatus = 'GUBERNUR_REVIEW';
        stageRole = 'Sekretaris Umum';
      } else if (program.status === 'GUBERNUR_REVIEW') {
        nextStatus = 'APPROVED';
        stageRole = 'Gubernur BEM';
      }
    } else if (modalAction === 'REVISION') {
      nextStatus = 'REVISION';
      stageRole =
        program.status === 'BENDUM_REVIEW'
          ? 'Bendahara Umum'
          : program.status === 'SEKUM_REVIEW'
            ? 'Sekretaris Umum'
            : 'Gubernur BEM';
    } else if (modalAction === 'REJECT') {
      nextStatus = 'REJECTED';
      stageRole =
        program.status === 'BENDUM_REVIEW'
          ? 'Bendahara Umum'
          : program.status === 'SEKUM_REVIEW'
            ? 'Sekretaris Umum'
            : 'Gubernur BEM';
    }

    const defaultNotes: Record<string, string> = {
      APPROVE:
        program.status === 'BENDUM_REVIEW'
          ? 'Rencana Anggaran Biaya (RAB) pada dokumen proposal telah diverifikasi dan disetujui untuk lanjut ke Sekretaris Umum.'
          : program.status === 'SEKUM_REVIEW'
            ? 'Kelengkapan administrasi dan naskah dinas proposal telah divalidasi lengkap.'
            : 'Usulan program kerja telah disetujui secara resmi oleh Gubernur BEM.',
      REVISION: 'Terdapat poin anggaran / usulan yang memerlukan perbaikan dari pengusul.',
      REJECT: 'Usulan program kerja tidak dapat disetujui.',
    };

    const newHistory = [
      ...(program.approvalHistory || []),
      {
        id: 'hist-' + Date.now(),
        stage:
          program.status === 'BENDUM_REVIEW'
            ? ('BENDUM' as const)
            : program.status === 'SEKUM_REVIEW'
              ? ('SEKUM' as const)
              : ('GUBERNUR' as const),
        action:
          modalAction === 'APPROVE'
            ? ('APPROVED' as const)
            : modalAction === 'REVISION'
              ? ('REVISION' as const)
              : ('REJECTED' as const),
        note: decisionNote || defaultNotes[modalAction],
        actorName: currentUser.name || 'Pengurus BEM',
        actorRole: stageRole,
        timestamp: new Date().toISOString(),
      },
    ];

    const updatedPrograms = programs.map((p) => {
      if (p.id === program.id) {
        return {
          ...p,
          status: nextStatus as ProgramStatus,
          approvalHistory: newHistory,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    saveMockPrograms(updatedPrograms);
    setPrograms(updatedPrograms);

    addMockActivityLog({
      userName: currentUser.name || 'Pengurus BEM',
      userRole: userRole,
      action: `Keputusan Verifikasi [${modalAction}] pada: ${program.title}`,
      module: 'Verifications',
      details: decisionNote || `Status diperbarui menjadi: ${nextStatus}`,
    });

    setIsProcessing(false);
    setModalAction(null);
    setDecisionNote('');
    setFeedback(`Keputusan verifikasi berhasil dicatat. Status program saat ini: ${STATUS_CONFIG[nextStatus as keyof typeof STATUS_CONFIG]?.label || nextStatus}.`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EFE8E2]">
        <button
          onClick={() => router.push('/verifications')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#756C69] hover:text-[#4E1724] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Antrean Verifikasi</span>
        </button>

        <span className="text-xs text-[#756C69]">
          ID Pengajuan: <strong className="font-mono text-[#22161A]">{program.id}</strong>
        </span>
      </div>

      {feedback && (
        <div className="p-3.5 bg-[#EDF7F1] border border-[#2D7A4F]/25 rounded-2xl flex items-center gap-2 text-xs font-semibold text-[#2D7A4F] shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-5 sm:p-7 space-y-4 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#4E1724] bg-[#FBF6F0] px-2.5 py-0.5 rounded-full border border-[#EFE8E2]">
                {program.id}
              </span>
              <span className="text-xs font-semibold bg-[#FAF7F5] text-[#22161A] border border-[#EFE8E2] px-2.5 py-0.5 rounded-full">
                Status: {STATUS_CONFIG[program.status as keyof typeof STATUS_CONFIG]?.label || program.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#22161A] tracking-tight">
              {program.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#756C69] pt-0.5">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#4E1724]" />
                <strong className="text-[#22161A]">{program.departemen}</strong>
              </span>
              <span>&bull;</span>
              <span>Diajukan: {formatDate(program.submittedAt)}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#4E1724]" />
                <span>Pelaksanaan: {formatDate(program.plannedDate)}</span>
              </span>
            </div>
          </div>

          {/* Current Stage Indicator Box */}
          <div className="bg-[#FAF7F5] border border-[#EFE8E2] p-3 rounded-2xl shrink-0 text-right sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#756C69]">
              Tahapan Peninjauan
            </p>
            <p className="text-xs font-bold text-[#4E1724] mt-0.5">
              {program.status === 'BENDUM_REVIEW'
                ? 'Tahap 1: Bendahara Umum (RAB)'
                : program.status === 'SEKUM_REVIEW'
                  ? 'Tahap 2: Sekretaris Umum (Berkas)'
                  : program.status === 'GUBERNUR_REVIEW'
                    ? 'Tahap 3: Gubernur BEM (Approval)'
                    : program.status === 'APPROVED'
                      ? 'Selesai: Telah Disetujui'
                      : 'Perbaikan / Revisi'}
            </p>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="pt-3 border-t border-[#EFE8E2] overflow-x-auto">
          <Stepper steps={steps} />
        </div>
      </div>

      {/* Main Grid: Left Column (Document & RAB Review), Right Column (Decisions & Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Document Preview & Proposal Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Document Access & Preview Card (Central Requirement B) */}
          <div className="bg-white border border-[#EFE8E2] rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EFE8E2]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FBF6F0] border border-[#EFE8E2] flex items-center justify-center text-[#4E1724] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#22161A]">
                    Dokumen Proposal &amp; Rencana Anggaran Biaya (RAB)
                  </h2>
                  <p className="text-xs text-[#756C69]">
                    Akses berkas resmi yang memuat usulan kegiatan terpadu beserta RAB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FAF7F5] border border-[#EFE8E2] text-xs font-semibold text-[#22161A] hover:bg-[#F3EBDD] transition-colors cursor-pointer"
                >
                  {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPreview ? 'Tutup Pratinjau' : 'Buka Pratinjau'}</span>
                </button>

                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleDownloadDocument}
                >
                  Unduh Dokumen
                </Button>
              </div>
            </div>

            {/* Explanatory Banner on Bendum Verification Rule */}
            <div className="p-3.5 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-[#22161A]">
              <Wallet className="w-4 h-4 text-[#4E1724] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#4E1724]">
                  Pedoman Verifikasi Anggaran Bendahara Umum (Bendum)
                </p>
                <p className="text-[11px] text-[#756C69] mt-0.5">
                  Bendahara Umum memeriksa kewajaran dan kelayakan Rencana Anggaran Biaya (RAB) yang <strong>tercantum langsung di dalam dokumen proposal terunggah</strong> di bawah ini. Tidak ada formulir anggaran manual terpisah.
                </p>
              </div>
            </div>

            {/* Document Metadata Bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F5]/60 border border-[#EFE8E2] text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                  PDF
                </span>
                <span className="font-semibold text-[#22161A] truncate">
                  {program.proposalFileName || 'Proposal_Kegiatan_dan_RAB_Terpadu.pdf'}
                </span>
              </div>
              <span className="text-[11px] text-[#756C69] shrink-0">
                {((program.proposalFileSize || 2450000) / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            {/* Interactive Document Preview Box */}
            {showPreview && (
              <div className="border border-[#EFE8E2] rounded-2xl overflow-hidden bg-[#525659]">
                {/* Viewer Toolbar */}
                <div className="bg-[#323639] text-[#FAF7F5] px-4 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[11px] text-[#FAF7F5]/80">
                      Halaman 1 dari 6
                    </span>
                    <span className="text-[#FAF7F5]/40">&bull;</span>
                    <span className="text-[11px] text-[#FAF7F5]/80">
                      Pratinjau Dokumen Naskah &amp; RAB
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(Math.max(80, previewZoom - 10))}
                      className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
                      title="Perkecil"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono px-1">{previewZoom}%</span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(Math.min(130, previewZoom + 10))}
                      className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
                      title="Perbesar"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated High-Fidelity Proposal & RAB Document Canvas */}
                <div className="p-4 sm:p-6 overflow-x-auto flex justify-center bg-[#424548]/90 min-h-[380px]">
                  <div
                    style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}
                    className="w-[520px] bg-white text-[#22161A] rounded-lg shadow-xl p-6 sm:p-8 space-y-4 text-xs transition-transform duration-150"
                  >
                    {/* Official Document Letterhead Header */}
                    <div className="border-b-2 border-[#22161A] pb-3 text-center space-y-0.5">
                      <p className="text-[10px] font-bold tracking-wider uppercase text-[#756C69]">
                        BADAN EKSEKUTIF MAHASISWA &bull; FAKULTAS KOMUNIKASI DAN INFORMATIKA
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#22161A]">
                        UNIVERSITAS MUHAMMADIYAH SURAKARTA
                      </p>
                      <p className="text-[9px] text-[#756C69]">
                        Jl. A. Yani, Pabelan, Kartasura, Surakarta 57162
                      </p>
                    </div>

                    <div className="text-center pt-1">
                      <h3 className="font-bold text-sm tracking-tight uppercase text-[#4E1724]">
                        PROPOSAL KEGIATAN &amp; RENCANA ANGGARAN BIAYA (RAB)
                      </h3>
                      <p className="font-semibold text-xs text-[#22161A] mt-0.5">
                        {program.title}
                      </p>
                      <p className="text-[10px] text-[#756C69]">
                        Departemen Pelaksana: {program.departemen}
                      </p>
                    </div>

                    {/* Section I: Deskripsi Program */}
                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] text-[#22161A] uppercase border-b border-[#EFE8E2] pb-0.5">
                        I. Deskripsi &amp; Latar Belakang
                      </h4>
                      <p className="text-[11px] leading-relaxed text-[#22161A]/90">
                        {program.description}
                      </p>
                    </div>

                    {/* Section II: Waktu & Tempat */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-[11px] text-[#22161A] uppercase border-b border-[#EFE8E2] pb-0.5">
                        II. Waktu &amp; Tempat Pelaksanaan
                      </h4>
                      <div className="grid grid-cols-2 text-[10px] text-[#22161A] gap-1">
                        <p><strong>Hari/Tanggal:</strong> {formatDate(program.plannedDate)}</p>
                        <p><strong>Tempat:</strong> {program.location || 'FKI UMS'}</p>
                      </div>
                    </div>

                    {/* Section III: Rencana Anggaran Biaya (RAB) in Document */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between border-b border-[#EFE8E2] pb-0.5">
                        <h4 className="font-bold text-[11px] text-[#22161A] uppercase">
                          III. Rencana Anggaran Biaya (RAB Terpadu)
                        </h4>
                        <span className="text-[9px] bg-[#FBF6F0] text-[#4E1724] font-bold px-1.5 py-0.2 rounded border border-[#EFE8E2]">
                          Verifikasi Bendum
                        </span>
                      </div>

                      <table className="w-full text-[10px] border-collapse border border-[#EFE8E2]">
                        <thead>
                          <tr className="bg-[#FAF7F5] text-[#22161A]">
                            <th className="border border-[#EFE8E2] p-1 text-left">Uraian Kebutuhan</th>
                            <th className="border border-[#EFE8E2] p-1 text-center w-12">Vol</th>
                            <th className="border border-[#EFE8E2] p-1 text-right w-20">Harga Satuan</th>
                            <th className="border border-[#EFE8E2] p-1 text-right w-24">Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {program.budgetItems && program.budgetItems.length > 0 ? (
                            program.budgetItems.map((item, idx) => (
                              <tr key={idx} className="border-b border-[#EFE8E2]/70">
                                <td className="border border-[#EFE8E2] p-1">{item.description}</td>
                                <td className="border border-[#EFE8E2] p-1 text-center">{item.quantity}</td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono">
                                  Rp {item.unitPrice.toLocaleString('id-ID')}
                                </td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono font-medium">
                                  Rp {item.total.toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <>
                              <tr>
                                <td className="border border-[#EFE8E2] p-1">Konsumsi Panitia &amp; Pemateri</td>
                                <td className="border border-[#EFE8E2] p-1 text-center">45 Pax</td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono">Rp 25.000</td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono">Rp 1.125.000</td>
                              </tr>
                              <tr>
                                <td className="border border-[#EFE8E2] p-1">Honorarium Narasumber Profesional</td>
                                <td className="border border-[#EFE8E2] p-1 text-center">2 Sesi</td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono">Rp 750.000</td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono">Rp 1.500.000</td>
                              </tr>
                              <tr>
                                <td className="border border-[#EFE8E2] p-1">Sertifikat &amp; Modul Digital</td>
                                <td className="border border-[#EFE8E2] p-1 text-center">45 Set</td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono">Rp 15.000</td>
                                <td className="border border-[#EFE8E2] p-1 text-right font-mono">Rp 675.000</td>
                              </tr>
                            </>
                          )}
                          <tr className="bg-[#FAF7F5] font-bold">
                            <td colSpan={3} className="border border-[#EFE8E2] p-1 text-right">
                              Total Anggaran Diajukan:
                            </td>
                            <td className="border border-[#EFE8E2] p-1 text-right font-mono text-[#4E1724]">
                              Rp {(program.totalBudget || 3300000).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Signatures */}
                    <div className="pt-4 grid grid-cols-2 text-center text-[10px]">
                      <div>
                        <p className="text-[#756C69]">Ketua Panitia Pelaksana</p>
                        <div className="h-10 flex items-center justify-center font-serif italic text-[#756C69]/60 text-[9px]">
                          (Tertanda Tangan)
                        </div>
                        <p className="font-bold text-[#22161A]">{program.submittedBy}</p>
                      </div>
                      <div>
                        <p className="text-[#756C69]">Mengetahui, Ketua Departemen</p>
                        <div className="h-10 flex items-center justify-center font-serif italic text-[#756C69]/60 text-[9px]">
                          (Tertanda Tangan)
                        </div>
                        <p className="font-bold text-[#22161A]">{program.departemen.split('—')[0].trim()} BEM FKI</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Program Information Card */}
          <div className="bg-white border border-[#EFE8E2] rounded-3xl p-5 sm:p-6 space-y-3 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
            <h3 className="text-sm font-bold text-[#22161A] pb-2 border-b border-[#EFE8E2]">
              Informasi Usulan &amp; Kategori IndoBERT
            </h3>
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-semibold text-[#756C69] block mb-1">
                  Deskripsi Lengkap Kegiatan:
                </span>
                <p className="text-[#22161A] bg-[#FAF7F5]/60 p-3 rounded-2xl border border-[#EFE8E2]">
                  {program.description}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#756C69] block mb-1">
                  Kategori Terdeteksi (Multi-Label IndoBERT):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {program.indobertTags && program.indobertTags.length > 0 ? (
                    program.indobertTags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A] px-2.5 py-1 rounded-xl text-xs font-medium"
                      >
                        <Sparkles className="w-3 h-3 text-[#4E1724]" />
                        <span>{t.label}</span>
                        <span className="text-[10px] text-[#4E1724] font-mono">
                          {(t.confidence * 100).toFixed(0)}%
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#756C69] italic">
                      Belum teranalisis (Layanan klasifikasi standby)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Actions, Authority, Review History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Box */}
          <div className="bg-white border border-[#EFE8E2] rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
            <div className="pb-2 border-b border-[#EFE8E2]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4E1724]" />
                <h3 className="text-sm font-bold text-[#22161A]">
                  Keputusan Verifikasi Birokrasi
                </h3>
              </div>
              <p className="text-xs text-[#756C69] mt-0.5">
                {canDecide
                  ? 'Anda memiliki wewenang sah untuk memutuskan verifikasi pada tahap ini.'
                  : 'Anda dalam mode pemantauan hasil verifikasi untuk tahap ini.'}
              </p>
            </div>

            {canDecide ? (
              <div className="space-y-2.5">
                <Button
                  className="w-full"
                  onClick={() => {
                    setModalError(null);
                    setModalAction('APPROVE');
                  }}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {program.status === 'BENDUM_REVIEW'
                    ? 'Setujui Anggaran & Teruskan ke Sekum'
                    : program.status === 'SEKUM_REVIEW'
                      ? 'Validasi Berkas & Teruskan ke Gubernur'
                      : 'Sahkan Usulan Program (Approval)'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setModalError(null);
                    setModalAction('REVISION');
                  }}
                  leftIcon={<AlertCircle className="w-4 h-4 text-[#92600C]" />}
                >
                  {program.status === 'BENDUM_REVIEW'
                    ? 'Minta Revisi Anggaran / Proposal'
                    : 'Minta Revisi Proposal'}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-[#9B2335] hover:bg-rose-50"
                  onClick={() => {
                    setModalError(null);
                    setModalAction('REJECT');
                  }}
                  leftIcon={<XCircle className="w-4 h-4 text-[#9B2335]" />}
                >
                  Tolak Usulan Program
                </Button>
              </div>
            ) : (
              <div className="p-3.5 bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl text-xs text-[#756C69] space-y-1">
                <p className="font-semibold text-[#22161A]">Wewenang Tahap Saat Ini:</p>
                <p>
                  {program.status === 'BENDUM_REVIEW'
                    ? 'Tahap ini merupakan kewenangan Bendahara Umum untuk memverifikasi RAB di dokumen proposal.'
                    : program.status === 'SEKUM_REVIEW'
                      ? 'Tahap ini merupakan kewenangan Sekretaris Umum untuk memvalidasi kelengkapan berkas.'
                      : program.status === 'GUBERNUR_REVIEW'
                        ? 'Tahap ini merupakan kewenangan Gubernur BEM untuk memberikan persetujuan eksekutif final.'
                        : 'Program ini telah selesai diverifikasi atau berstatus revisi.'}
                </p>
              </div>
            )}
          </div>

          {/* Verification Audit Trail & Review History (Central Requirement B) */}
          <div className="bg-white border border-[#EFE8E2] rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFE8E2]">
              <h3 className="text-xs font-bold text-[#22161A] uppercase tracking-wider">
                Riwayat &amp; Catatan Verifikasi
              </h3>
              <span className="text-[10px] font-bold bg-[#FAF7F5] border border-[#EFE8E2] px-2 py-0.5 rounded-full text-[#756C69]">
                {(program.approvalHistory?.length || 0) + 1} Catatan
              </span>
            </div>

            <div className="space-y-3">
              {/* Submission entry */}
              <div className="p-3.5 rounded-2xl border border-[#EFE8E2] bg-[#FAF7F5]/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#22161A]">Pengajuan Proposal Awal</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4E1724] text-white">
                    Diajukan
                  </span>
                </div>
                <p className="text-[11px] text-[#22161A]">
                  Proposal dan RAB terpadu diajukan oleh <strong>{program.submittedBy}</strong> ({program.departemen}).
                </p>
                <span className="text-[10px] text-[#756C69] block pt-0.5">
                  {formatDate(program.submittedAt)}
                </span>
              </div>

              {/* Review History Logs */}
              {program.approvalHistory && program.approvalHistory.length > 0 ? (
                program.approvalHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                      hist.action === 'APPROVED'
                        ? 'bg-[#EDF7F1]/60 border-[#2D7A4F]/25 text-[#2D7A4F]'
                        : hist.action === 'REVISION'
                          ? 'bg-[#FEF8ED]/70 border-[#92600C]/25 text-[#92600C]'
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#22161A]">
                        {hist.actorRole} ({hist.actorName})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          hist.action === 'APPROVED'
                            ? 'bg-[#2D7A4F] text-white'
                            : hist.action === 'REVISION'
                              ? 'bg-[#92600C] text-white'
                              : 'bg-[#9B2335] text-white'
                        }`}
                      >
                        {hist.action === 'APPROVED'
                          ? 'Disetujui'
                          : hist.action === 'REVISION'
                            ? 'Catatan Revisi'
                            : 'Ditolak'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#22161A] leading-relaxed">
                      {hist.note}
                    </p>
                    <span className="text-[10px] text-[#756C69] block pt-0.5">
                      {formatDate(hist.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#756C69] italic text-center py-2">
                  Belum ada catatan verifikasi lanjutan untuk usulan ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Decision & Review Notes */}
      <Modal
        isOpen={modalAction !== null}
        onClose={() => {
          setModalAction(null);
          setModalError(null);
        }}
        title={
          modalAction === 'APPROVE'
            ? program.status === 'BENDUM_REVIEW'
              ? 'Konfirmasi Persetujuan Anggaran (Bendum)'
              : 'Konfirmasi Persetujuan Tahap'
            : modalAction === 'REVISION'
              ? 'Konfirmasi Permintaan Revisi Anggaran / Proposal'
              : 'Konfirmasi Penolakan Usulan'
        }
        description={`Program Kerja: "${program.title}"`}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setModalAction(null);
                setModalError(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant={modalAction === 'REJECT' ? 'danger' : 'primary'}
              size="sm"
              isLoading={isProcessing}
              onClick={handleConfirmDecision}
            >
              {modalAction === 'APPROVE'
                ? 'Ya, Sahkan & Teruskan'
                : modalAction === 'REVISION'
                  ? 'Kirim Catatan Revisi'
                  : 'Tolak Program'}
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <p className="text-[#22161A] leading-relaxed">
            {modalAction === 'APPROVE'
              ? program.status === 'BENDUM_REVIEW'
                ? 'Pastikan kelayakan pos pengeluaran dan rincian RAB pada dokumen proposal terlampir telah sesuai dengan standar anggaran BEM FKI UMS sebelum disahkan ke tahap Sekretaris Umum.'
                : 'Pastikan seluruh dokumen dan kelayakan telah diperiksa secara menyeluruh sebelum melanjutkan ke tahapan berikutnya.'
              : 'Harap berikan catatan evaluasi yang jelas agar departemen pengaju dapat melakukan perbaikan naskah atau anggaran proposal secara tepat.'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
              Catatan Resmi Birokrasi {modalAction !== 'APPROVE' && <span className="text-[#9B2335]">*</span>}
            </label>
            <textarea
              value={decisionNote}
              onChange={(e) => {
                setDecisionNote(e.target.value);
                if (modalError) setModalError(null);
              }}
              rows={3}
              placeholder={
                modalAction === 'APPROVE'
                  ? 'Catatan opsional (misal: "RAB pada dokumen proposal telah diverifikasi dan disetujui")'
                  : 'Rincian catatan revisi anggaran / berkas yang harus diperbaiki pengusul...'
              }
              className="w-full bg-[#FAF7F5]/30 border border-[#EFE8E2] text-xs rounded-2xl p-3 focus:bg-white focus:outline-hidden focus:border-[#4E1724] focus:ring-2 focus:ring-[#4E1724]/15"
            />
            {modalError && (
              <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{modalError}</span>
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
