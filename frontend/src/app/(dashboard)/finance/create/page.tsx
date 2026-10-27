'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, CheckCircle2, FileUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  getMockTransactions,
  saveMockTransactions,
  getMockPrograms,
  addMockActivityLog,
} from '@/lib/mockData';
import { FinanceTransaction, TransactionType } from '@/types/finance';

const FINANCE_CATEGORIES = [
  'Dana Dekanat / Fakultas',
  'Iuran Pengurus BEM',
  'Sponsorship & Kerjasama',
  'Operasional Kegiatan Proker',
  'Konsumsi & Akomodasi',
  'Sewa Tempat & Perlengkapan',
  'ATK & Kesekretariatan',
  'Lain-Lain',
];

export default function CreateFinanceTransactionPage() {
  const router = useRouter();
  const programs = getMockPrograms();

  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(FINANCE_CATEGORIES[3]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [receiptFile, setReceiptFile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    await new Promise((r) => setTimeout(r, 450));

    const existing = getMockTransactions();
    const relatedProgram = programs.find((p) => p.id === selectedProgramId);
    const parsedAmount = parseInt(amount) || 0;

    const newTrx: FinanceTransaction = {
      id: `TRX-2026-${(existing.length + 1).toString().padStart(3, '0')}`,
      type,
      amount: parsedAmount,
      description,
      category,
      programId: relatedProgram?.id,
      programTitle: relatedProgram?.title,
      date,
      receiptUrl: `/mock/receipts/${receiptFile || 'kwitansi.pdf'}`,
      status: 'VERIFIED',
      recordedBy: 'Budi Santoso (Bendum)',
      createdAt: new Date().toISOString(),
    };

    saveMockTransactions([newTrx, ...existing]);
    addMockActivityLog({
      userName: 'Budi Santoso',
      userRole: 'BENDAHARA_UMUM',
      action: `Mencatat Transaksi Keuangan: ${type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}`,
      module: 'Finance',
      details: `${description} &bull; Rp ${parsedAmount.toLocaleString('id-ID')}`,
    });

    setFeedback('Transaksi kas berhasil dicatat dan diverifikasi oleh Bendahara Umum.');
    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/finance');
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
          <span>Kembali ke Kas Organisasi</span>
        </button>
        <span className="text-xs text-[#756C69]">Pencatatan Buku Kas</span>
      </div>

      {feedback && (
        <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0]/60 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#059669] shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-5">
          {/* Transaction Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
              Jenis Mutasi Kas <span className="text-[#DC2626]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`py-2.5 px-3.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                  type === 'INCOME'
                    ? 'bg-[#059669] text-white border-[#059669] shadow-xs'
                    : 'bg-[#FAF7F5] text-[#22161A] border-[#EFE8E2] hover:bg-[#ECFDF5]'
                }`}
              >
                + Pemasukan (Kas Masuk)
              </button>

              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`py-2.5 px-3.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                  type === 'EXPENSE'
                    ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-xs'
                    : 'bg-[#FAF7F5] text-[#22161A] border-[#EFE8E2] hover:bg-[#FEF2F2]'
                }`}
              >
                - Pengeluaran (Realisasi)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
              Nominal Transaksi (IDR) <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#756C69]">
                Rp
              </span>
              <input
                type="number"
                min="1000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                className="w-full bg-[#FAF7F5] border border-[#EFE8E2] text-sm font-mono font-bold text-[#22161A] rounded-2xl py-2.5 pl-10 pr-3.5 focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
              />
            </div>
          </div>

          <Input
            label="Keterangan / Uraian Transaksi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Pembayaran DP Sewa Sound System dan Panggung"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Pos Kategori Anggaran"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {FINANCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <Input
              type="date"
              label="Tanggal Transaksi"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Select
            label="Program Kerja Terkait (Opsional)"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
          >
            <option value="">-- Operasional Rutin BEM (Non-Program Kerja) --</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.departemen})
              </option>
            ))}
          </Select>

          {/* Receipt Upload Note */}
          <div>
            <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
              Bukti Nota / Kwitansi Digital
            </label>
            <div className="flex items-center gap-3 p-3.5 bg-[#FAF7F5] rounded-2xl border border-[#EFE8E2]">
              <FileUp className="w-5 h-5 text-[#4E1724] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#22161A] truncate">
                  {receiptFile ? receiptFile : 'Unggah foto nota, kuitansi, atau bukti transfer'}
                </p>
                <p className="text-[11px] text-[#756C69]">Format JPG, PNG, atau PDF</p>
              </div>
              <label className="shrink-0">
                <span className="px-3 py-1.5 bg-white border border-[#EFE8E2] text-xs font-semibold text-[#22161A] rounded-xl hover:bg-[#FAF7F5] cursor-pointer shadow-2xs transition-colors">
                  Pilih Bukti
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setReceiptFile(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<Wallet className="w-4 h-4" />}>
            Simpan Transaksi Kas
          </Button>
        </div>
      </form>
    </div>
  );
}
