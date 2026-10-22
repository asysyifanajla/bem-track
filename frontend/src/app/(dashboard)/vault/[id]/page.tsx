'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  FileCheck2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { getMockVault } from '@/lib/mockData';
import { formatFileSize, formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VaultDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const docId = resolvedParams.id;

  const vaultDocs = getMockVault();
  const doc = vaultDocs.find((v) => v.id === docId) || vaultDocs[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
        <button
          onClick={() => router.push('/vault')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke BEM Vault</span>
        </button>

        <span className="text-xs text-[#8A817B]">
          ID Regulasi: <strong className="font-mono text-[#352A28]">{doc.id}</strong>
        </span>
      </div>

      <div className="bg-white border border-[#E8E0D7] rounded-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg bg-[#FAF7F1] border border-[#E8E0D7] text-[#6E2639] shrink-0 mt-1">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold bg-[#F5EEF0] text-[#6E2639] px-2 py-0.5 rounded-sm">
                {doc.vaultCategory}
              </span>
              <h1 className="text-xl font-bold text-[#352A28] leading-snug">{doc.title}</h1>
              <p className="text-xs text-[#8A817B]">
                Dokumen Resmi Ketetapan Fungsionaris BEM FKI UMS
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => alert(`Mengunduh dokumen regulasi: ${doc.title} (Simulasi Demo)`)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Unduh Berkas Resmi
          </Button>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF7F1]/60 rounded-lg border border-[#E8E0D7] text-xs">
          <div>
            <span className="text-[#8A817B] block text-[10px]">Ukuran Berkas</span>
            <span className="font-semibold text-[#352A28]">{formatFileSize(doc.fileSize)}</span>
          </div>

          <div>
            <span className="text-[#8A817B] block text-[10px]">Tanggal Pengesahan</span>
            <span className="font-semibold text-[#352A28]">{formatDate(doc.uploadedAt)}</span>
          </div>

          <div>
            <span className="text-[#8A817B] block text-[10px]">Total Pengunduhan</span>
            <span className="font-semibold text-[#352A28]">{doc.downloadCount} kali</span>
          </div>
        </div>

        {/* Scope and description */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-[#352A28] uppercase tracking-wider block">
            Ketetapan & Ruang Lingkup Dokumen:
          </span>
          <p className="p-3.5 bg-white border border-[#E8E0D7] rounded-lg text-[#352A28] leading-relaxed">
            {doc.description ||
              'Ketetapan tertulis disahkan oleh Dekanat FKI dan BPH BEM FKI UMS sebagai landasan konstitusi dan panduan operasional organisasi.'}
          </p>
        </div>

        {/* Tags */}
        {doc.tags && (
          <div className="flex items-center gap-1.5 pt-2">
            <span className="text-xs text-[#8A817B]">Kata Kunci:</span>
            {doc.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-[#FAF7F1] border border-[#E8E0D7] text-[#352A28] px-2 py-0.5 rounded-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
