'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Stepper, { Step } from '@/components/ui/Stepper';
import Modal from '@/components/ui/Modal';
import { getMockPrograms, saveMockPrograms, addMockActivityLog } from '@/lib/mockData';
import { STATUS_CONFIG } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { canVerifyAdmin, canVerifyBudget, canApproveExecutive } from '@/lib/permissions';
import { UserRole } from '@/types/auth';
import { ProgramStatus } from '@/types/program';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VerificationDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const programId = resolvedParams.id;

  const [programs, setPrograms] = useState(() => getMockPrograms());
  const program = programs.find((p) => p.id === programId) || programs[0];

  const currentUser = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('bem_track_user') || '{}')
    : {};
  const userRole = (currentUser.role || 'GUBERNUR') as UserRole;

  // Modal decision state
  const [modalAction, setModalAction] = useState<'APPROVE' | 'REVISION' | 'REJECT' | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Stepper calculations
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
      timestamp: isSekumDone ? 'Disetujui' : undefined,
      actor: 'Siti Rahayu',
    },
    {
      id: 'step-bendum',
      label: 'Bendahara Umum',
      sublabel: 'Verifikasi Anggaran RAB',
      status: isBendumDone
        ? 'completed'
        : program.status === 'BENDUM_REVIEW'
        ? 'active'
        : 'pending',
      timestamp: isBendumDone ? 'Disetujui' : undefined,
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

  // Authority check
  const canDecide =
    (program.status === 'SEKUM_REVIEW' && canVerifyAdmin(userRole)) ||
    (program.status === 'BENDUM_REVIEW' && canVerifyBudget(userRole)) ||
    (program.status === 'GUBERNUR_REVIEW' && canApproveExecutive(userRole));

  const handleConfirmDecision = async () => {
    if (!modalAction) return;
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 450));

    let nextStatus = program.status;
    let stageRole = 'PENGURUS';

    if (modalAction === 'APPROVE') {
      if (program.status === 'SEKUM_REVIEW') {
        nextStatus = 'BENDUM_REVIEW';
        stageRole = 'Sekretaris Umum';
      } else if (program.status === 'BENDUM_REVIEW') {
        nextStatus = 'GUBERNUR_REVIEW';
        stageRole = 'Bendahara Umum';
      } else if (program.status === 'GUBERNUR_REVIEW') {
        nextStatus = 'APPROVED';
        stageRole = 'Gubernur BEM';
      }
    } else if (modalAction === 'REVISION') {
      nextStatus = 'REVISION';
    } else if (modalAction === 'REJECT') {
      nextStatus = 'REJECTED';
    }

    const newHistory = [
      ...(program.approvalHistory || []),
      {
        id: 'hist-' + Date.now(),
        stage:
          program.status === 'SEKUM_REVIEW'
            ? ('SEKUM' as const)
            : program.status === 'BENDUM_REVIEW'
            ? ('BENDUM' as const)
            : ('GUBERNUR' as const),
        action:
          modalAction === 'APPROVE'
            ? ('APPROVED' as const)
            : modalAction === 'REVISION'
            ? ('REVISION' as const)
            : ('REJECTED' as const),
        note: decisionNote || 'Pemeriksaan tahapan birokrasi telah diselesaikan.',
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
      details: decisionNote || `Status bergeser menjadi: ${nextStatus}`,
    });

    setIsProcessing(false);
    setModalAction(null);
    setFeedback(`Keputusan berhasil dicatat (Status program saat ini: ${nextStatus}).`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E8E0D7]">
        <button
          onClick={() => router.push('/verifications')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Antrean Verifikasi</span>
        </button>

        <span className="text-xs text-[#8A817B]">
          ID Pengajuan: <strong className="font-mono text-[#352A28]">{program.id}</strong>
        </span>
      </div>

      {feedback && (
        <div className="p-3 bg-[#EDF7F1] border border-[#2D7A4F]/25 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2D7A4F]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Hero Overview */}
      <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold bg-[#F5EEF0] text-[#6E2639] px-2 py-0.5 rounded-sm">
              Status: {STATUS_CONFIG[program.status as keyof typeof STATUS_CONFIG]?.label || program.status}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
              {program.title}
            </h1>
            <p className="text-xs text-[#8A817B]">
              Diajukan oleh: <strong className="text-[#352A28]">{program.submittedBy}</strong> &bull;{' '}
              {program.departemen} &bull; Tanggal: {formatDate(program.submittedAt)}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-[#8A817B] block">Usulan Anggaran:</span>
            <span className="text-xl font-bold text-[#6E2639] font-mono">
              {formatCurrency(program.totalBudget)}
            </span>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="pt-3 border-t border-[#E8E0D7] overflow-x-auto">
          <Stepper steps={steps} />
        </div>
      </div>

      {/* Split Review Details & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Deskripsi & RAB */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#352A28] pb-2 border-b border-[#E8E0D7]">
              Ringkasan Proposal
            </h3>
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-semibold text-[#8A817B] block mb-0.5">Deskripsi Singkat:</span>
                <p className="text-[#352A28] bg-[#FAF7F1]/60 p-3 rounded-lg border border-[#E8E0D7]">
                  {program.description}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#8A817B] block mb-0.5">Latar Belakang:</span>
                <p className="text-[#352A28] bg-[#FAF7F1]/60 p-3 rounded-lg border border-[#E8E0D7]">
                  {program.background}
                </p>
              </div>
            </div>
          </div>

          {/* Rincian Anggaran */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#352A28] pb-2 border-b border-[#E8E0D7]">
              Rincian Usulan Biaya (RAB)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F1] text-[#8A817B] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">Item Pengeluaran</th>
                    <th className="py-2 px-3 text-center">Vol</th>
                    <th className="py-2 px-3 text-right">Harga</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D7]">
                  {program.budgetItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3 font-medium text-[#352A28]">{item.description}</td>
                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-[#352A28]">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Documents & Decision Action Card */}
        <div className="lg:col-span-5 space-y-5">
          {/* Action Box */}
          <div className="bg-white border-2 border-[#E8E0D7] rounded-xl p-5 space-y-4">
            <div className="pb-2 border-b border-[#E8E0D7]">
              <h3 className="text-sm font-bold text-[#352A28]">Tindakan Birokrasi</h3>
              <p className="text-xs text-[#8A817B]">
                {canDecide
                  ? 'Anda memiliki hak wewenang untuk menentukan persetujuan pada tahap ini.'
                  : 'Anda dalam mode pemantauan hasil verifikasi untuk tahap ini.'}
              </p>
            </div>

            {canDecide ? (
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => setModalAction('APPROVE')}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Setujui & Lanjutkan Tahap
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setModalAction('REVISION')}
                  leftIcon={<AlertCircle className="w-4 h-4 text-[#92600C]" />}
                >
                  Minta Revisi Proposal
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-[#9B2335] hover:bg-[#FDF0F1]"
                  onClick={() => setModalAction('REJECT')}
                  leftIcon={<XCircle className="w-4 h-4 text-[#9B2335]" />}
                >
                  Tolak Usulan Program
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-[#FAF7F1] border border-[#E8E0D7] rounded-lg text-xs text-[#8A817B] space-y-1">
                <p className="font-semibold text-[#352A28]">Wewenang Verifikasi:</p>
                <p>
                  Tahap ini diverifikasi oleh pejabat terkait (Sekretaris Umum / Bendahara Umum /
                  Gubernur BEM).
                </p>
              </div>
            )}
          </div>

          {/* Dokumen Lampiran */}
          <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#352A28] uppercase tracking-wider pb-2 border-b border-[#E8E0D7]">
              Dokumen Terlampir
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E8E0D7] bg-[#FAF7F1]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#9B2335]" />
                  <div>
                    <p className="font-semibold text-[#352A28]">Proposal Lengkap</p>
                    <p className="text-[10px] text-[#8A817B]">PDF &bull; 2.4 MB</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Mengunduh dokumen proposal demo')}
                  className="p-1.5 text-[#6E2639] hover:bg-white rounded-md border border-[#E8E0D7] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#E8E0D7] bg-[#FAF7F1]">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#2D7A4F]" />
                  <div>
                    <p className="font-semibold text-[#352A28]">RAB Format Excel</p>
                    <p className="text-[10px] text-[#8A817B]">XLSX &bull; 850 KB</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Mengunduh file RAB demo')}
                  className="p-1.5 text-[#6E2639] hover:bg-white rounded-md border border-[#E8E0D7] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalAction !== null}
        onClose={() => setModalAction(null)}
        title={
          modalAction === 'APPROVE'
            ? 'Konfirmasi Persetujuan Tahap'
            : modalAction === 'REVISION'
            ? 'Konfirmasi Permintaan Revisi'
            : 'Konfirmasi Penolakan Usulan'
        }
        description={`Program Kerja: "${program.title}"`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalAction(null)}>
              Batal
            </Button>
            <Button
              variant={modalAction === 'REJECT' ? 'danger' : 'primary'}
              size="sm"
              isLoading={isProcessing}
              onClick={handleConfirmDecision}
            >
              {modalAction === 'APPROVE'
                ? 'Ya, Sahkan & Lanjutkan'
                : modalAction === 'REVISION'
                ? 'Kirim Catatan Revisi'
                : 'Tolak Program'}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-[#352A28]">
            {modalAction === 'APPROVE'
              ? 'Pastikan instrumen proposal, format administrasi, dan rincian anggaran telah memenuhi standar organisasi BEM FKI UMS sebelum melanjutkan.'
              : 'Silakan cantumkan catatan penjelasan spesifik agar departemen pengaju dapat melakukan perbaikan secara tepat.'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#352A28] mb-1">
              Catatan Resmi Birokrasi {modalAction !== 'APPROVE' && <span className="text-[#9B2335]">*</span>}
            </label>
            <textarea
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              rows={3}
              placeholder={
                modalAction === 'APPROVE'
                  ? 'Catatan opsional (misal: "Dokumen telah lengkap dan terverifikasi")'
                  : 'Rincian hal yang perlu direvisi atau alasan penolakan...'
              }
              className="w-full bg-white border border-[#E8E0D7] text-xs rounded-lg p-2.5 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
