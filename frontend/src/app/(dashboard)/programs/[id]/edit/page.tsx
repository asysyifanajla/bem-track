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
    <div className="animate-fade-in">
      <ProgramForm initialData={program} isEdit />
    </div>
  );
}
