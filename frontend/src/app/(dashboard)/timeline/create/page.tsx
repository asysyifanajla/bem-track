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
  const [departemen, setDepartemen] = useState(DEPARTMENTS[0]);
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
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kalender Agenda</span>
        </button>
        <span className="text-xs text-[#8A817B]">Form Agenda Baru</span>
      </div>

      {feedback && (
        <div className="p-3 bg-[#EDF7F1] border border-[#2D7A4F]/25 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2D7A4F]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#352A28] pb-2 border-b border-[#E8E0D7]">
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
            <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
              Deskripsi Singkat / Agenda Rapat
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan tujuan rapat, rundown singkat, atau pembagian tugas..."
              className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg p-3 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15"
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
