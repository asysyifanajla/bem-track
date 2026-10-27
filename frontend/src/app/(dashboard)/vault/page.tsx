'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  FileCheck2,
  Layers,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { getMockVault, saveMockVault, addMockActivityLog } from '@/lib/mockData';
import { formatFileSize, formatDate } from '@/lib/utils';
import { canManageVault } from '@/lib/permissions';
import { UserRole } from '@/types/auth';

const VAULT_CATEGORY_LABELS: Record<string, string> = {
  AD_ART: 'AD / ART & Konstitusi',
  PERATURAN: 'Surat Keputusan (SK) & Peraturan',
  PANDUAN: 'GBHK & Pedoman Tata Kelola',
  TEMPLATE: 'Template Format Resmi Naskah Dinas',
  LAINNYA: 'Dokumen Organisasi Lainnya',
};

export default function VaultPage() {
  const [currentUser] = useState<{ role: string; name: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [vaultDocs, setVaultDocs] = useState(() => getMockVault());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;
  const canManage = canManageVault(userRole);

  const filtered = vaultDocs.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(search.toLowerCase()));

    const matchCategory =
      categoryFilter === 'ALL' || doc.vaultCategory === categoryFilter;

    return matchSearch && matchCategory;
  });

  // Group by category for an organized institutional view
  const categoriesPresent = Array.from(new Set(filtered.map((d) => d.vaultCategory)));

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus dokumen vault "${title}"?`)) return;
    const updated = vaultDocs.filter((d) => d.id !== id);
    saveMockVault(updated);
    setVaultDocs(updated);
    addMockActivityLog({
      userName: currentUser?.name || 'Sekretaris Umum',
      userRole,
      action: `Menghapus Dokumen Vault: ${title}`,
      module: 'Vault',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-[#EFE8E2]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E1724]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#756C69]">
              BEM-TRACK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#22161A] tracking-tight">
            BEM Vault Organisasi
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
            Pusat penyimpanan permanen konstitusi organisasi, SK Dekanat, GBHK, dan tata naskah dinas resmi
          </p>
        </div>

        {canManage && (
          <Link href="/vault/upload">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Unggah ke BEM Vault
            </Button>
          </Link>
        )}
      </div>

      {/* Authority notice */}
      <div className="p-4 sm:p-5 bg-white border border-[#EFE8E2] rounded-3xl flex items-start sm:items-center justify-between gap-3 text-xs text-[#756C69] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#FAF0F3] text-[#4E1724] flex items-center justify-center shrink-0">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <span>
            {canManage
              ? 'Anda memiliki hak penuh sebagai Sekretaris Umum untuk menambah, memperbarui, dan mengelola BEM Vault.'
              : 'Anda memiliki hak akses baca dan unduh resmi dokumen organisasi BEM FKI UMS.'}
          </span>
        </div>
        <span className="font-bold text-[#4E1724] bg-[#FAF0F3] border border-[#4E1724]/20 px-3 py-1 rounded-full shrink-0 hidden sm:inline">
          {canManage ? 'Akses: Pengelola' : 'Akses: Lihat & Unduh'}
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EFE8E2] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C69]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari AD/ART, SK Kepengurusan, GBHK, atau Template..."
            className="w-full bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl pl-10 pr-3.5 py-2 text-xs text-[#22161A] placeholder-[#A39893] focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FAF7F5] border border-[#EFE8E2] text-xs font-medium text-[#22161A] rounded-2xl px-3.5 py-2 focus:outline-hidden focus:border-[#4E1724]"
        >
          <option value="ALL">Semua Bidang Regulasi</option>
          <option value="AD_ART">AD / ART</option>
          <option value="PERATURAN">Surat Keputusan (SK)</option>
          <option value="PANDUAN">GBHK &amp; Panduan</option>
          <option value="TEMPLATE">Template Naskah</option>
        </select>
      </div>

      {/* Grouped by Category View */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Dokumen Vault Tidak Ditemukan"
          description="Tidak ada berkas regulasi yang cocok dengan kata kunci pencarian Anda."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('');
                setCategoryFilter('ALL');
              }}
            >
              Reset Pencarian
            </Button>
          }
        />
      ) : (
        <div className="space-y-7">
          {categoriesPresent.map((catKey) => {
            const docsInCat = filtered.filter((d) => d.vaultCategory === catKey);
            return (
              <div key={catKey} className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-[#EFE8E2]">
                  <Layers className="w-4 h-4 text-[#4E1724]" />
                  <h2 className="text-xs sm:text-sm font-bold text-[#22161A] uppercase tracking-wider">
                    {VAULT_CATEGORY_LABELS[catKey] || catKey}
                  </h2>
                  <span className="text-[11px] text-[#756C69] font-mono font-medium">({docsInCat.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docsInCat.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-[#EFE8E2] hover:border-[#4E1724]/30 rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] text-[#8B263E] flex items-center justify-center shrink-0">
                              <FileCheck2 className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/vault/${doc.id}`}
                                className="text-sm font-bold text-[#22161A] hover:text-[#4E1724] transition-colors leading-snug line-clamp-2 block"
                              >
                                {doc.title}
                              </Link>
                              <span className="text-[11px] text-[#756C69] block mt-1">
                                {formatFileSize(doc.fileSize)} &bull; {formatDate(doc.uploadedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {doc.description && (
                          <p className="text-xs text-[#756C69] line-clamp-2 leading-relaxed bg-[#FAF7F5] p-3 rounded-2xl border border-[#EFE8E2]">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-[#EFE8E2] text-xs">
                        <span className="text-[11px] text-[#756C69]">
                          Diunduh: <strong className="text-[#22161A]">{doc.downloadCount} kali</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/vault/${doc.id}`}
                            className="p-1.5 text-[#756C69] hover:text-[#4E1724] hover:bg-[#FAF7F5] rounded-xl transition-colors"
                            title="Detail Dokumen"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => alert(`Mengunduh berkas vault: ${doc.title} (Simulasi Demo)`)}
                            className="p-1.5 text-[#756C69] hover:text-[#059669] hover:bg-[#FAF7F5] rounded-xl transition-colors cursor-pointer"
                            title="Unduh Berkas Resmi"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {canManage && (
                            <button
                              onClick={() => handleDelete(doc.id, doc.title)}
                              className="p-1.5 text-[#756C69] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-colors cursor-pointer"
                              title="Hapus dari Vault"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
