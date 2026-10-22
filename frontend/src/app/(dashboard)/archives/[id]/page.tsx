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
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
        <button
          onClick={() => router.push('/archives')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Arsip Dokumen</span>
        </button>

        <span className="text-xs text-[#8A817B]">
          ID Dokumen: <strong className="font-mono text-[#352A28]">{doc.id}</strong>
        </span>
      </div>

      <div className="bg-white border border-[#E8E0D7] rounded-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg bg-[#FAF7F1] border border-[#E8E0D7] text-[#6E2639] shrink-0 mt-1">
              {isExcel ? (
                <FileSpreadsheet className="w-6 h-6 text-[#2D7A4F]" />
              ) : (
                <FileText className="w-6 h-6 text-[#9B2335]" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-[#FAF7F1] text-[#352A28] border border-[#E8E0D7] px-2 py-0.5 rounded-sm">
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
              <h1 className="text-xl font-bold text-[#352A28] leading-snug">{doc.title}</h1>
              {doc.programTitle && (
                <p className="text-xs text-[#6E2639] font-medium">
                  Terkait: {doc.programTitle}
                </p>
              )}
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => alert(`Mengunduh dokumen: ${doc.title} (Simulasi Demo)`)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Unduh Berkas
          </Button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#FAF7F1]/60 rounded-lg border border-[#E8E0D7] text-xs">
          <div>
            <span className="text-[#8A817B] block text-[10px]">Ukuran Berkas</span>
            <span className="font-semibold text-[#352A28]">{formatFileSize(doc.fileSize)}</span>
          </div>

          <div>
            <span className="text-[#8A817B] block text-[10px]">Tanggal Unggah</span>
            <span className="font-semibold text-[#352A28]">{formatDate(doc.uploadedAt)}</span>
          </div>

          <div>
            <span className="text-[#8A817B] block text-[10px]">Pengunggah</span>
            <span className="font-semibold text-[#352A28]">{doc.uploadedBy}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-[#352A28] uppercase tracking-wider block">
            Keterangan & Catatan Berkas:
          </span>
          <p className="p-3.5 bg-white border border-[#E8E0D7] rounded-lg text-[#352A28] leading-relaxed">
            {doc.description ||
              'Berkas resmi tersimpan dalam sistem arsip digital BEM FKI UMS dengan verifikasi tanda tangan pengurus.'}
          </p>
        </div>

        {/* Tags */}
        {doc.tags && (
          <div className="flex items-center gap-1.5 pt-2">
            <span className="text-xs text-[#8A817B]">Label:</span>
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
