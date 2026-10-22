'use client';

import React, { use } from 'react';
import ProgramForm from '@/components/programs/ProgramForm';
import { getMockPrograms } from '@/lib/mockData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProgramPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const programId = resolvedParams.id;

  const programs = getMockPrograms();
  const program = programs.find((p) => p.id === programId) || programs[0];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[#352A28] tracking-tight">
          Sunting Program Kerja: {program.title}
        </h2>
        <p className="text-xs text-[#8A817B] mt-0.5">
          Perbarui rincian proposal atau revisi catatan sesuai arahan Sekretaris / Bendahara
        </p>
      </div>

      <ProgramForm initialData={program} isEdit />
    </div>
  );
}
