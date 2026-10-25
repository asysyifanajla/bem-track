'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Info, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import { classifyWithIndoBERT, checkIndoBERTStatus } from '@/lib/indobert';
import { PROGRAM_CATEGORIES } from '@/lib/constants';
import { ProgramCategory } from '@/types/program';

interface AutoTagPreviewProps {
  title?: string;
  description: string;
  onApplyTags?: (categories: ProgramCategory[]) => void;
}

export default function AutoTagPreview({
  title = '',
  description,
  onApplyTags,
}: AutoTagPreviewProps) {
  const hasContent = description.trim().length > 15 || title.trim().length > 5;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [predictedTags, setPredictedTags] = useState<
    Array<{ label: string; confidence: number; category?: string }>
  >([]);

  // Check IndoBERT health on mount
  useEffect(() => {
    let isMounted = true;
    checkIndoBERTStatus().then((res) => {
      if (isMounted) {
        setServiceStatus(res.status === 'online' ? 'online' : 'offline');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced IndoBERT classify request
  useEffect(() => {
    if (!hasContent) {
      setPredictedTags([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      const res = await classifyWithIndoBERT({ title, description });
      setIsAnalyzing(false);

      if (res && res.categories && res.categories.length > 0) {
        setServiceStatus('online');
        setPredictedTags(res.categories);
      } else {
        setServiceStatus('offline');
        setPredictedTags([]);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [title, description, hasContent]);

  return (
    <div className="bg-[#FAF7F1] border border-[#E8DFD3] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#6E2639] shadow-2xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#352A28]">
              Rekomendasi Kategori IndoBERT (Multi-Label)
            </h4>
            <p className="text-[11px] text-[#8A817B]">
              Klasifikasi otomatis judul &amp; deskripsi proposal berbasis Transformer IndoBERT
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
            serviceStatus === 'online'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {serviceStatus === 'online' ? 'Layanan Online' : 'Layanan Standby'}
        </span>
      </div>

      {/* State: No content entered */}
      {!hasContent ? (
        <div className="flex items-center gap-2 text-xs text-[#8A817B] p-3 bg-white/70 rounded-xl border border-[#E8DFD3]/60">
          <Info className="w-4 h-4 shrink-0 text-[#8A817B]" />
          <span>
            Ketikkan <strong>Judul</strong> dan <strong>Deskripsi Program</strong> di atas untuk memicu inferensi model IndoBERT.
          </span>
        </div>
      ) : isAnalyzing ? (
        <div className="flex items-center gap-2.5 text-xs text-[#6E2639] p-3 bg-white rounded-xl border border-[#6E2639]/20 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6E2639] animate-ping" />
          <span className="font-semibold">
            Mengirim teks ke microservice IndoBERT (POST /predict)...
          </span>
        </div>
      ) : predictedTags.length > 0 ? (
        // State: Online prediction result
        <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Prediksi Kategori Terdeteksi:</span>
            </div>
            {onApplyTags && (
              <button
                type="button"
                onClick={() => {
                  const mapped = predictedTags
                    .map((t) => (t.category || t.label) as ProgramCategory)
                    .filter(Boolean);
                  onApplyTags(mapped);
                }}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 cursor-pointer"
              >
                Gunakan Rekomendasi Ini
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {predictedTags.map((tag, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs px-2.5 py-1 rounded-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{tag.label}</span>
                <span className="text-[10px] text-emerald-700 font-mono">
                  {(tag.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // State: Offline / Standby (No fabricated prediction, transparent thesis requirement)
        <div className="p-3 bg-white rounded-xl border border-[#E8DFD3] space-y-2 text-xs leading-relaxed text-[#756C69]">
          <div className="flex items-start gap-2 text-amber-800 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-[#352A28]">
                Layanan IndoBERT Standby (FastAPI Microservice Belum Aktif)
              </p>
              <p className="text-[11px] text-[#756C69] mt-0.5">
                Sesuai prinsip transparansi skripsi, sistem <strong>tidak memanipulasi prediksi palsu</strong> saat endpoint inferensi (<code className="font-mono text-[10px] bg-[#FAF7F1] px-1 py-0.5 rounded">http://localhost:8000/predict</code>) belum berjalan. Anda dapat memilih 1 atau lebih kategori resmi di bawah secara langsung.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scope Info: 5 Official Thesis Categories Reference */}
      <div className="pt-2 border-t border-[#E8DFD3]/80">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A817B] mb-1.5">
          5 Kategori Multi-Label Resmi (Proposal Skripsi):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PROGRAM_CATEGORIES.map((cat) => (
            <span
              key={cat.value}
              className="text-[10px] bg-white border border-[#E8DFD3] text-[#352A28] px-2 py-0.5 rounded-md font-medium"
              title={cat.label}
            >
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
