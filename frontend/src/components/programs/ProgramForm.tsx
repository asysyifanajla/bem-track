'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import AutoTagPreview from './AutoTagPreview';
import { DEPARTMENTS, PROGRAM_CATEGORIES } from '@/lib/constants';
import { Program, ProgramBudgetItem, ProgramCategory } from '@/types/program';
import { getMockPrograms, saveMockPrograms, addMockActivityLog } from '@/lib/mockData';

interface ProgramFormProps {
  initialData?: Program;
  isEdit?: boolean;
}

export default function ProgramForm({ initialData, isEdit = false }: ProgramFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(
    initialData?.title || 'Company Profile Production Training'
  );
  const [departemen, setDepartemen] = useState(
    initialData?.departemen || DEPARTMENTS[4] // Dept Kominfo
  );
  const [description, setDescription] = useState(
    initialData?.description ||
      'Pelatihan pembuatan dan penyuntingan video profil organisasi BEM untuk meningkatkan kemampuan anggota dalam bidang publikasi.'
  );
  const [background, setBackground] = useState(
    initialData?.background ||
      'Kebutuhan representasi digital organisasi BEM FKI UMS semakin meningkat di media sosial dan kanal resmi kampus.'
  );
  const [objectives, setObjectives] = useState(
    initialData?.objectives ||
      'Meningkatkan skill videografi, motion graphics, dan public relation bagi pengurus serta mahasiswa FKI.'
  );
  const [plannedDate, setPlannedDate] = useState(
    initialData?.plannedDate || '2026-11-15'
  );
  const [location, setLocation] = useState(
    initialData?.location || 'Lab Multimedia Lantai 3 Gedung J FKI UMS'
  );
  const [selectedCategories, setSelectedCategories] = useState<ProgramCategory[]>(
    initialData?.categories || ['PELATIHAN', 'TEKNOLOGI']
  );

  const [budgetItems, setBudgetItems] = useState<ProgramBudgetItem[]>(
    initialData?.budgetItems || [
      { id: '1', description: 'Honorarium Pemateri Videografi', quantity: 2, unitPrice: 750000, total: 1500000 },
      { id: '2', description: 'Konsumsi Peserta & Panitia (2 Hari)', quantity: 50, unitPrice: 25000, total: 1250000 },
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.total, 0);

  const handleAddBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
  };

  const handleBudgetItemChange = (
    id: string,
    field: 'description' | 'quantity' | 'unitPrice',
    val: string | number
  ) => {
    setBudgetItems(
      budgetItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const toggleCategory = (cat: ProgramCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (submitStatus: 'DRAFT' | 'SUBMITTED') => {
    setIsSubmitting(true);
    setFeedback(null);

    await new Promise((r) => setTimeout(r, 400));

    const existing = getMockPrograms();

    if (isEdit && initialData) {
      const updatedList = existing.map((p) => {
        if (p.id === initialData.id) {
          return {
            ...p,
            title,
            departemen,
            description,
            background,
            objectives,
            plannedDate,
            location,
            categories: selectedCategories,
            budgetItems,
            totalBudget,
            status: submitStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      saveMockPrograms(updatedList);
      addMockActivityLog({
        userName: 'Pengurus BEM',
        userRole: 'DEPARTEMEN',
        action: `Memperbarui Program Kerja: ${title}`,
        module: 'Programs',
        details: `Status diperbarui menjadi: ${submitStatus}`,
      });
    } else {
      const newProgram: Program = {
        id: `PRG-2026-${(existing.length + 1).toString().padStart(3, '0')}`,
        title,
        departemen,
        description,
        background,
        objectives,
        targetParticipants: 'Mahasiswa FKI UMS',
        plannedDate,
        location,
        status: submitStatus,
        categories: selectedCategories,
        indobertTags: selectedCategories.map((c) => ({
          label: c,
          category: c,
          confidence: 0.85,
        })),
        budgetItems,
        totalBudget,
        submittedBy: 'Pengurus Pengaju (Demo)',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalHistory: [],
      };
      saveMockPrograms([newProgram, ...existing]);
      addMockActivityLog({
        userName: 'Pengurus BEM',
        userRole: 'DEPARTEMEN',
        action: `Mengajukan Program Kerja: ${title}`,
        module: 'Programs',
        details: `ID: ${newProgram.id} dengan total anggaran Rp ${totalBudget.toLocaleString('id-ID')}`,
      });
    }

    setFeedback(
      submitStatus === 'SUBMITTED'
        ? 'Program kerja berhasil diajukan untuk verifikasi birokrasi (Tersimpan di state simulasi).'
        : 'Draft program kerja berhasil disimpan.'
    );
    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/programs');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D7]">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A817B] hover:text-[#352A28] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar</span>
        </button>
        <span className="text-xs text-[#8A817B]">
          {isEdit ? 'Mode Sunting Program' : 'Form Pengajuan Proposal'}
        </span>
      </div>

      {feedback && (
        <div className="p-3 bg-[#EDF7F1] border border-[#2D7A4F]/25 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2D7A4F]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Form Surfaces */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('SUBMITTED');
        }}
        className="space-y-6"
      >
        {/* Section 1: Informasi Dasar */}
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#352A28] pb-2 border-b border-[#E8E0D7]">
            1. Informasi Pokok Program
          </h3>

          <div className="space-y-4">
            <Input
              label="Judul Program Kerja"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Company Profile Production Training"
              required
            />

            <Select
              label="Departemen Pelaksana"
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

            <div>
              <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
                Deskripsi Program <span className="text-[#9B2335]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Jelaskan ringkasan materi, output, dan sasaran kegiatan..."
                className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg p-3 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15 transition-colors"
              />
            </div>

            {/* IndoBERT Preview Section */}
            <AutoTagPreview description={description} />

            {/* Manual Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
                Kategori Program (Multi-Pilihan)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PROGRAM_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.value as ProgramCategory);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value as ProgramCategory)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#6E2639] text-white border-[#6E2639]'
                          : 'bg-[#FAF7F1] text-[#352A28] border-[#E8E0D7] hover:bg-[#F3EBDD]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Waktu, Lokasi & Tujuan */}
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#352A28] pb-2 border-b border-[#E8E0D7]">
            2. Waktu, Tempat & Narasi Proposal
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Rencana Tanggal Pelaksanaan"
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              required
            />
            <Input
              label="Lokasi / Tempat Acara"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Lab Multimedia Lantai 3 Gedung J"
              required
            />
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
                Latar Belakang Kegiatan
              </label>
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                rows={2}
                placeholder="Alasan diadakannya program kerja..."
                className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg p-3 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#352A28] mb-1.5">
                Tujuan & Indikator Keberhasilan
              </label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                rows={2}
                placeholder="Tujuan spesifik yang ingin dicapai..."
                className="w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg p-3 focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Rencana Anggaran Biaya (RAB) */}
        <div className="bg-white border border-[#E8E0D7] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D7]">
            <div>
              <h3 className="text-sm font-bold text-[#352A28]">3. Rencana Anggaran Biaya (RAB)</h3>
              <p className="text-xs text-[#8A817B]">Rincian pengeluaran untuk verifikasi Bendahara Umum</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddBudgetItem}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Tambah Item
            </Button>
          </div>

          <div className="space-y-2">
            {budgetItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 items-center bg-[#FAF7F1]/60 p-2.5 rounded-lg border border-[#E8E0D7]"
              >
                <div className="col-span-12 sm:col-span-5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleBudgetItemChange(item.id, 'description', e.target.value)}
                    placeholder="Deskripsi kebutuhan / item"
                    className="w-full bg-white border border-[#E8E0D7] text-xs rounded-md p-1.5 focus:border-[#6E2639] focus:outline-hidden"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleBudgetItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)
                    }
                    placeholder="Qty"
                    className="w-full bg-white border border-[#E8E0D7] text-xs rounded-md p-1.5 focus:border-[#6E2639] focus:outline-hidden"
                  />
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleBudgetItemChange(item.id, 'unitPrice', parseInt(e.target.value) || 0)
                    }
                    placeholder="Harga Satuan (Rp)"
                    className="w-full bg-white border border-[#E8E0D7] text-xs rounded-md p-1.5 focus:border-[#6E2639] focus:outline-hidden"
                  />
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[#352A28]">
                    Rp {item.total.toLocaleString('id-ID')}
                  </span>
                  {budgetItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBudgetItem(item.id)}
                      className="text-[#8A817B] hover:text-[#9B2335] p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-[#F5EEF0] border border-[#6E2639]/20">
            <span className="text-xs font-bold text-[#6E2639] uppercase tracking-wider">
              Total Estimasi Anggaran:
            </span>
            <span className="text-base font-bold text-[#6E2639] font-mono">
              Rp {totalBudget.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit('DRAFT')}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Simpan Sebagai Draft
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Ajukan ke Verifikasi Sekretaris
          </Button>
        </div>
      </form>
    </div>
  );
}
