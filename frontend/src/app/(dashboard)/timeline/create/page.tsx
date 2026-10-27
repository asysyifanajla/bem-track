'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  getMockTimeline,
  saveMockTimeline,
  getMockPrograms,
  addMockActivityLog,
} from '@/lib/mockData';
import { DEPARTMENTS } from '@/lib/constants';
import { TimelineEvent } from '@/types/timeline';

export default function CreateTimelineEventPage() {
  const router = useRouter();
  const programs = getMockPrograms();

  const [title, setTitle] = useState('');
  const [departemen, setDepartemen] = useState<string>(DEPARTMENTS[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    await new Promise((r) => setTimeout(r, 450));

    const existing = getMockTimeline();
    const relatedProgram = programs.find((p) => p.id === selectedProgramId);

    const newEvent: TimelineEvent = {
      id: `EVT-${(existing.length + 1).toString().padStart(3, '0')}`,
      title,
      programId: relatedProgram?.id,
      programTitle: relatedProgram?.title,
      departemen,
      startDate: `${startDate}T08:30:00Z`,
      endDate: `${endDate}T16:00:00Z`,
      location: location || 'Kampus 2 FKI UMS',
      status: 'UPCOMING',
      description,
      createdBy: 'Pengurus BEM (Demo)',
      createdAt: new Date().toISOString(),
    };

    saveMockTimeline([newEvent, ...existing]);
    addMockActivityLog({
      userName: 'Pengurus BEM',
      userRole: 'DEPARTEMEN',
      action: `Menambahkan Agenda Baru: ${title}`,
      module: 'Timeline',
      details: `Tanggal: ${startDate} &bull; Tempat: ${location}`,
    });

    setFeedback('Agenda kegiatan berhasil ditambahkan ke kalender organisasi.');
    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/timeline');
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
          <span>Kembali ke Kalender Agenda</span>
        </button>
        <span className="text-xs text-[#756C69]">Form Agenda Baru</span>
      </div>

      {feedback && (
        <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0]/60 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#059669] shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] space-y-5">
          <h3 className="text-sm sm:text-base font-bold text-[#22161A] pb-3 border-b border-[#EFE8E2] tracking-tight">
            Rincian Agenda Kegiatan
          </h3>

          <Input
            label="Nama / Tajuk Kegiatan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Rapat Pleno Evaluasi Program Kerja Semester Ganjil"
            required
          />

          <Select
            label="Departemen Penyelenggara / PIC"
            value={departemen}
            onChange={(e) => setDepartemen(e.target.value)}
            required
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Tanggal Mulai"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />

            <Input
              type="date"
              label="Tanggal Selesai"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Lokasi / Tempat Acara"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Auditorium Moh. Djazman Kampus 1 UMS"
            required
          />

          <Select
            label="Terkait Program Kerja (Opsional)"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
          >
            <option value="">-- Kegiatan Rutin / Non-Program Kerja Khusus --</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.departemen})
              </option>
            ))}
          </Select>

          <div>
            <label className="block text-xs font-semibold text-[#22161A] mb-1.5">
              Deskripsi Singkat / Agenda Rapat
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan tujuan rapat, rundown singkat, atau pembagian tugas..."
              className="w-full bg-[#FAF7F5] border border-[#EFE8E2] text-[#22161A] placeholder-[#A39893] text-sm rounded-2xl p-3.5 focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<Calendar className="w-4 h-4" />}>
            Simpan ke Kalender
          </Button>
        </div>
      </form>
    </div>
  );
}
