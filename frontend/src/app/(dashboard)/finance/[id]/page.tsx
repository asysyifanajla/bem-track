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
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
        <button
          onClick={() => router.push('/finance')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#756C69] hover:text-[#4E1724] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kas Organisasi</span>
        </button>

        <span className="text-xs text-[#756C69]">
          ID Mutasi: <strong className="font-mono text-[#22161A]">{trx.id}</strong>
        </span>
      </div>

      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
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
              <span className="text-xs text-[#756C69] bg-[#FAF7F5] border border-[#EFE8E2] px-2.5 py-0.5 rounded-full font-medium">
                {trx.category}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#22161A] leading-snug">{trx.description}</h1>
            {trx.programTitle && (
              <p className="text-xs text-[#4E1724] font-semibold">
                Program Terkait: {trx.programTitle}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right shrink-0 bg-[#FAF7F5] sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-[#EFE8E2] sm:border-0">
            <span className="text-[10px] text-[#756C69] uppercase font-bold tracking-wider block">
              Nominal Transaksi
            </span>
            <span
              className={`text-2xl font-bold font-mono tracking-tight ${
                isIncome ? 'text-[#2D7A4F]' : 'text-[#9B2335]'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(trx.amount)}
            </span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF7F5]/70 rounded-2xl border border-[#EFE8E2] text-xs">
          <div>
            <span className="text-[#756C69] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Tanggal Transaksi</span>
            <span className="font-semibold text-[#22161A]">{formatDate(trx.date)}</span>
          </div>

          <div>
            <span className="text-[#756C69] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Dicatat Oleh</span>
            <span className="font-semibold text-[#22161A]">{trx.recordedBy}</span>
          </div>

          <div>
            <span className="text-[#756C69] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Status Verifikasi</span>
            <span className="font-semibold text-[#2D7A4F] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terverifikasi Bendahara</span>
            </span>
          </div>
        </div>

        {/* Bukti Transaksi */}
        <div className="p-4 bg-white border border-[#EFE8E2] rounded-2xl space-y-3 text-xs">
          <span className="font-bold text-[#22161A] uppercase tracking-wider block text-xs">
            Lampiran Kwitansi / Bukti Mutasi Bank
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FAF7F5] rounded-2xl border border-[#EFE8E2]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FBF6F0] border border-[#EFE8E2] flex items-center justify-center text-[#4E1724] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#22161A]">Kwitansi_Resmi_{trx.id}.pdf</p>
                <p className="text-[10px] text-[#756C69]">Dokumen bukti transfer &amp; tanda terima sah</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert(`Mengunduh bukti kwitansi ${trx.id} (Simulasi Demo)`)}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="shrink-0 rounded-2xl"
            >
              Unduh Kwitansi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
