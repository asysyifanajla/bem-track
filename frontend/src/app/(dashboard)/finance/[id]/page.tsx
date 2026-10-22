'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getMockTransactions } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FinanceDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const trxId = resolvedParams.id;

  const transactions = getMockTransactions();
  const trx = transactions.find((t) => t.id === trxId) || transactions[0];

  const isIncome = trx.type === 'INCOME';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
        <button
          onClick={() => router.push('/finance')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kas Organisasi</span>
        </button>

        <span className="text-xs text-[#8A817B]">
          ID Mutasi: <strong className="font-mono text-[#352A28]">{trx.id}</strong>
        </span>
      </div>

      <div className="bg-white border border-[#E8E0D7] rounded-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isIncome ? (
                <Badge variant="success" dot>
                  Kas Masuk (Pemasukan)
                </Badge>
              ) : (
                <Badge variant="danger" dot>
                  Kas Keluar (Realisasi)
                </Badge>
              )}
              <span className="text-xs text-[#8A817B] bg-[#FAF7F1] border border-[#E8E0D7] px-2 py-0.5 rounded-sm">
                {trx.category}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#352A28] leading-snug">{trx.description}</h1>
            {trx.programTitle && (
              <p className="text-xs text-[#6E2639] font-medium">
                Program Terkait: {trx.programTitle}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#8A817B] uppercase tracking-wider block">
              Nominal Transaksi
            </span>
            <span
              className={`text-2xl font-bold font-mono ${
                isIncome ? 'text-[#2D7A4F]' : 'text-[#9B2335]'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(trx.amount)}
            </span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF7F1]/60 rounded-lg border border-[#E8E0D7] text-xs">
          <div>
            <span className="text-[#8A817B] block text-[10px]">Tanggal Transaksi</span>
            <span className="font-semibold text-[#352A28]">{formatDate(trx.date)}</span>
          </div>

          <div>
            <span className="text-[#8A817B] block text-[10px]">Dicatat Oleh</span>
            <span className="font-semibold text-[#352A28]">{trx.recordedBy}</span>
          </div>

          <div>
            <span className="text-[#8A817B] block text-[10px]">Status Verifikasi</span>
            <span className="font-semibold text-[#2D7A4F] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terverifikasi Bendahara</span>
            </span>
          </div>
        </div>

        {/* Bukti Transaksi */}
        <div className="p-4 bg-white border border-[#E8E0D7] rounded-lg space-y-2 text-xs">
          <span className="font-bold text-[#352A28] uppercase tracking-wider block">
            Lampiran Kwitansi / Bukti Mutasi Bank
          </span>
          <div className="flex items-center justify-between p-3 bg-[#FAF7F1] rounded-md border border-[#E8E0D7]">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#6E2639]" />
              <div>
                <p className="font-semibold text-[#352A28]">Kwitansi_Resmi_{trx.id}.pdf</p>
                <p className="text-[10px] text-[#8A817B]">Dokumen bukti transfer & tanda terima</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert(`Mengunduh bukti kwitansi ${trx.id} (Simulasi Demo)`)}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Unduh Kwitansi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
