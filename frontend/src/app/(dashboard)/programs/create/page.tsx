import React from 'react';
import ProgramForm from '@/components/programs/ProgramForm';

export default function CreateProgramPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[#352A28] tracking-tight">
          Pengajuan Usulan Program Kerja
        </h2>
        <p className="text-xs text-[#8A817B] mt-0.5">
          Lengkapi instrumen proposal dan RAB untuk memulai tahapan verifikasi birokrasi
        </p>
      </div>

      <ProgramForm />
    </div>
  );
}
