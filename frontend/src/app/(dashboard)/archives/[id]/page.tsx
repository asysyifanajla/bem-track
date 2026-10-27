'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getMockArchives } from '@/lib/mockData';
import { formatFileSize, formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArchiveDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const docId = resolvedParams.id;

  const archives = getMockArchives();
  const doc = archives.find((a) => a.id === docId) || archives[0];

  const isFinal = doc.status === 'ARCHIVED';
  const isExcel = doc.mimeType.includes('spreadsheet') || doc.mimeType.includes('excel');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-[#EFE8E2]">
        <button
          onClick={() => router.push('/archives')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#756C69] hover:text-[#4E1724] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Arsip Dokumen</span>
        </button>

        <span className="text-xs text-[#756C69]">
          ID Dokumen: <strong className="font-mono text-[#22161A]">{doc.id}</strong>
        </span>
      </div>

      <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF6F0] border border-[#EFE8E2] flex items-center justify-center text-[#4E1724] shrink-0 mt-0.5">
              {isExcel ? (
                <FileSpreadsheet className="w-6 h-6 text-[#2D7A4F]" />
              ) : (
                <FileText className="w-6 h-6 text-[#4E1724]" />
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-[#FAF7F5] text-[#22161A] border border-[#EFE8E2] px-2.5 py-0.5 rounded-full">
                  {doc.category}
                </span>
                {isFinal ? (
                  <Badge variant="success" dot>
                    Dokumen Final
                  </Badge>
                ) : (
                  <Badge variant="warning" dot>
                    Draft Belum Final
                  </Badge>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#22161A] leading-snug">{doc.title}</h1>
              {doc.programTitle && (
                <p className="text-xs text-[#4E1724] font-semibold">
                  Terkait: {doc.programTitle}
                </p>
              )}
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => alert(`Mengunduh dokumen: ${doc.title} (Simulasi Demo)`)}
            leftIcon={<Download className="w-4 h-4" />}
            className="shrink-0 rounded-2xl"
          >
            Unduh Berkas
          </Button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF7F5]/70 rounded-2xl border border-[#EFE8E2] text-xs">
          <div>
            <span className="text-[#756C69] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Ukuran Berkas</span>
            <span className="font-semibold text-[#22161A]">{formatFileSize(doc.fileSize)}</span>
          </div>

          <div>
            <span className="text-[#756C69] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Tanggal Unggah</span>
            <span className="font-semibold text-[#22161A]">{formatDate(doc.uploadedAt)}</span>
          </div>

          <div>
            <span className="text-[#756C69] block text-[10px] font-bold uppercase tracking-wider mb-0.5">Pengunggah</span>
            <span className="font-semibold text-[#22161A]">{doc.uploadedBy}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-[#22161A] uppercase tracking-wider block">
            Keterangan &amp; Catatan Berkas:
          </span>
          <p className="p-4 bg-[#FAF7F5]/50 border border-[#EFE8E2] rounded-2xl text-[#22161A] leading-relaxed">
            {doc.description ||
              'Berkas resmi tersimpan dalam sistem arsip digital BEM FKI UMS dengan verifikasi tanda tangan pengurus.'}
          </p>
        </div>

        {/* Tags */}
        {doc.tags && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-xs text-[#756C69] font-medium">Label:</span>
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A] px-2.5 py-0.5 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
