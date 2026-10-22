'use client';

import React from 'react';
import { Cpu, Info } from 'lucide-react';

interface AutoTagPreviewProps {
  description: string;
  isAnalyzing?: boolean;
}

export default function AutoTagPreview({ description, isAnalyzing = false }: AutoTagPreviewProps) {
  const hasContent = description.trim().length > 20;

  return (
    <div className="bg-[#FAF7F1] border border-[#E8E0D7] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white border border-[#E8E0D7] flex items-center justify-center text-[#6E2639]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#352A28]">
              Klasifikasi Otomatis IndoBERT (Multi-Label)
            </h4>
            <p className="text-[11px] text-[#8A817B]">
              Deteksi kategori berbasis pemrosesan teks proposal
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-white border border-[#E8E0D7] text-[#8A817B] px-2 py-0.5 rounded-full">
          Placeholder Demo
        </span>
      </div>

      {/* Honest status display */}
      {!hasContent ? (
        <div className="flex items-center gap-2 text-xs text-[#8A817B] py-2">
          <Info className="w-4 h-4 shrink-0 text-[#8A817B]" />
          <span>Masukkan deskripsi program kerja untuk mengaktifkan analisis teks.</span>
        </div>
      ) : isAnalyzing ? (
        <div className="flex items-center gap-2 text-xs text-[#6E2639] py-2">
          <span className="w-2 h-2 rounded-full bg-[#6E2639] animate-pulse" />
          <span>Menganalisis konten deskripsi proposal...</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2.5 bg-white border border-[#E8E0D7] rounded-md text-xs text-[#8A817B]">
            <Info className="w-4 h-4 shrink-0 text-[#92600C] mt-0.5" />
            <div>
              <p className="text-[#352A28] font-medium">Status: Layanan klasifikasi standby</p>
              <p className="text-[11px] text-[#8A817B] mt-0.5">
                Model klasifikasi multi-label IndoBERT akan dihubungkan melalui inference API backend.
                Kategori manual dapat dipilih pada formulir di bawah.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
