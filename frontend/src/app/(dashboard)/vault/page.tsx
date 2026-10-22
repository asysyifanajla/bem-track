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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E8E0D7]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#352A28] tracking-tight">
              BEM Vault Organisasi
            </h2>
            <span className="text-[11px] font-semibold bg-[#F5EEF0] text-[#6E2639] px-2 py-0.5 rounded-sm">
              Arsip Induk Organisasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8A817B] mt-0.5">
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
      <div className="p-3.5 bg-white border border-[#E8E0D7] rounded-xl flex items-start sm:items-center justify-between gap-3 text-xs text-[#8A817B]">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-[#6E2639] shrink-0" />
          <span>
            {canManage
              ? 'Anda memiliki hak penuh sebagai Sekretaris Umum untuk menambah, memperbarui, dan mengelola BEM Vault.'
              : 'Anda memiliki hak akses baca dan unduh resmi dokumen organisasi BEM FKI UMS.'}
          </span>
        </div>
        <span className="font-semibold text-[#352A28] shrink-0 hidden sm:inline">
          {canManage ? 'Akses: Pengelola' : 'Akses: Lihat & Unduh'}
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E0D7] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A817B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari AD/ART, SK Kepengurusan, GBHK, atau Template..."
            className="w-full bg-[#FAF7F1]/60 border border-[#E8E0D7] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#352A28] placeholder-[#8A817B]/60 focus:bg-white focus:outline-hidden focus:border-[#6E2639] transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FAF7F1] border border-[#E8E0D7] text-xs text-[#352A28] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#6E2639]"
        >
          <option value="ALL">Semua Bidang Regulasi</option>
          <option value="AD_ART">AD / ART</option>
          <option value="PERATURAN">Surat Keputusan (SK)</option>
          <option value="PANDUAN">GBHK & Panduan</option>
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
        <div className="space-y-6">
          {categoriesPresent.map((catKey) => {
            const docsInCat = filtered.filter((d) => d.vaultCategory === catKey);
            return (
              <div key={catKey} className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-[#E8E0D7]">
                  <Layers className="w-4 h-4 text-[#6E2639]" />
                  <h3 className="text-xs font-bold text-[#352A28] uppercase tracking-wider">
                    {VAULT_CATEGORY_LABELS[catKey] || catKey}
                  </h3>
                  <span className="text-[10px] text-[#8A817B] font-mono">({docsInCat.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {docsInCat.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-[#E8E0D7] hover:border-[#6E2639]/40 rounded-xl p-4 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-[#FAF7F1] border border-[#E8E0D7] text-[#6E2639] shrink-0">
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                            <div>
                              <Link
                                href={`/vault/${doc.id}`}
                                className="text-sm font-semibold text-[#352A28] hover:text-[#6E2639] transition-colors leading-snug line-clamp-2"
                              >
                                {doc.title}
                              </Link>
                              <span className="text-[10px] text-[#8A817B] block mt-0.5">
                                {formatFileSize(doc.fileSize)} &bull; {formatDate(doc.uploadedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {doc.description && (
                          <p className="text-xs text-[#8A817B] line-clamp-2 leading-relaxed bg-[#FAF7F1]/50 p-2 rounded-md border border-[#E8E0D7]/60">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E8E0D7] text-xs">
                        <span className="text-[11px] text-[#8A817B]">
                          Diunduh: <strong className="text-[#352A28]">{doc.downloadCount} kali</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/vault/${doc.id}`}
                            className="p-1.5 text-[#8A817B] hover:text-[#6E2639] hover:bg-[#FAF7F1] rounded-md transition-colors"
                            title="Detail Dokumen"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => alert(`Mengunduh berkas vault: ${doc.title} (Simulasi Demo)`)}
                            className="p-1.5 text-[#8A817B] hover:text-[#2D7A4F] hover:bg-[#FAF7F1] rounded-md transition-colors cursor-pointer"
                            title="Unduh Berkas Resmi"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {canManage && (
                            <button
                              onClick={() => handleDelete(doc.id, doc.title)}
                              className="p-1.5 text-[#8A817B] hover:text-[#9B2335] hover:bg-[#FDF0F1] rounded-md transition-colors cursor-pointer"
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
