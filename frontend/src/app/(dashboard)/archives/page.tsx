'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  Eye,
  Trash2,
  Lock,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { getMockArchives, saveMockArchives, addMockActivityLog } from '@/lib/mockData';
import { formatFileSize, formatDate } from '@/lib/utils';
import { canUploadArchive } from '@/lib/permissions';
import { UserRole } from '@/types/auth';

export default function ArchivesPage() {
  const [currentUser] = useState<{ role: string; name: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('bem_track_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [archives, setArchives] = useState(() => getMockArchives());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const userRole = (currentUser?.role || 'GUBERNUR') as UserRole;
  const isPrivileged = userRole === 'SEKRETARIS_UMUM' || userRole.startsWith('DEPARTEMEN');

  // Role visibility: Bendum & Gub only see final (ARCHIVED) documents!
  const visibleArchives = archives.filter((doc) => {
    if (!isPrivileged && doc.status !== 'ARCHIVED') {
      return false; // draft hidden from unprivileged roles
    }
    return true;
  });

  const filtered = visibleArchives.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.programTitle && doc.programTitle.toLowerCase().includes(search.toLowerCase())) ||
      doc.uploadedBy.toLowerCase().includes(search.toLowerCase());

    const matchCat = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || doc.status === statusFilter;

    return matchSearch && matchCat && matchStatus;
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus dokumen arsip "${title}"?`)) return;
    const updated = archives.filter((a) => a.id !== id);
    saveMockArchives(updated);
    setArchives(updated);
    addMockActivityLog({
      userName: currentUser?.name || 'Pengurus',
      userRole,
      action: `Menghapus Dokumen Arsip: ${title}`,
      module: 'Archives',
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
            Arsip Dokumen Birokrasi
          </h1>
          <p className="text-xs sm:text-sm text-[#756C69]">
            Document management system untuk proposal, RAB, LPJ, dan notulensi resmi kegiatan BEM FKI
          </p>
        </div>

        {canUploadArchive(userRole) && (
          <Link href="/archives/upload">
            <Button size="sm" leftIcon={<Upload className="w-4 h-4" />}>
              Unggah Dokumen Arsip
            </Button>
          </Link>
        )}
      </div>

      {/* Access info banner if non-privileged */}
      {!isPrivileged && (
        <div className="p-4 bg-white border border-[#EFE8E2] rounded-3xl flex items-center gap-3 text-xs text-[#756C69] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)]">
          <div className="w-8 h-8 rounded-xl bg-[#FAF0F3] text-[#4E1724] flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <span>
            Berdasarkan matriks hak akses, peran Anda hanya dapat mengakses dokumen dengan status{' '}
            <strong className="text-[#22161A]">Final / Disetujui</strong>. Dokumen draft hanya dapat
            dikelola oleh Sekretaris Umum dan Departemen pengunggah.
          </span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EFE8E2] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C69]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama dokumen, program terkait, atau pengunggah..."
            className="w-full bg-[#FAF7F5] border border-[#EFE8E2] rounded-2xl pl-10 pr-3.5 py-2 text-xs text-[#22161A] placeholder-[#A39893] focus:bg-white focus:outline-hidden focus:border-[#4E1724] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF7F5] border border-[#EFE8E2] text-xs font-medium text-[#22161A] rounded-2xl px-3.5 py-2 focus:outline-hidden focus:border-[#4E1724]"
          >
            <option value="ALL">Semua Jenis Dokumen</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="LPJ">LPJ</option>
            <option value="RAB">RAB</option>
            <option value="NOTULENSI">Notulensi</option>
            <option value="SURAT_UNDANGAN">Surat Dinas</option>
          </select>

          {isPrivileged && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF7F5] border border-[#EFE8E2] text-xs font-medium text-[#22161A] rounded-2xl px-3.5 py-2 focus:outline-hidden focus:border-[#4E1724]"
            >
              <option value="ALL">Semua Status</option>
              <option value="ARCHIVED">Final / Terarsip</option>
              <option value="ACTIVE">Draft / Belum Final</option>
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Tidak Ada Dokumen Ditemukan"
          description="Tidak ada berkas yang sesuai dengan kriteria filter saat ini."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              Reset Filter
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Dokumen</TableHead>
              <TableHead>Program Kerja Terkait</TableHead>
              <TableHead>Jenis Berkas</TableHead>
              <TableHead>Tanggal Unggah</TableHead>
              <TableHead>Status Dokumen</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doc) => {
              const isFinal = doc.status === 'ARCHIVED';
              const isExcel = doc.mimeType.includes('spreadsheet') || doc.mimeType.includes('excel');
              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FBF6F0] border border-[#F2ECE4] text-[#8B263E] flex items-center justify-center shrink-0 mt-0.5">
                        {isExcel ? (
                          <FileSpreadsheet className="w-5 h-5 text-[#059669]" />
                        ) : (
                          <FileText className="w-5 h-5 text-[#8B263E]" />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/archives/${doc.id}`}
                          className="font-bold text-[#22161A] hover:text-[#4E1724] transition-colors block"
                        >
                          {doc.title}
                        </Link>
                        <span className="text-[11px] text-[#756C69]">
                          {formatFileSize(doc.fileSize)} &bull; Diunggah oleh {doc.uploadedBy}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-[#22161A] font-semibold">
                      {doc.programTitle || 'Umum Organisasi'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-[11px] font-medium bg-[#FAF7F5] text-[#22161A] border border-[#EFE8E2] px-2.5 py-0.5 rounded-full">
                      {doc.category}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-[#756C69]">
                    {formatDate(doc.uploadedAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {isFinal ? (
                      <Badge variant="success" dot>
                        Dokumen Final
                      </Badge>
                    ) : (
                      <Badge variant="warning" dot>
                        Draft / Belum Final
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/archives/${doc.id}`}
                        className="p-1.5 text-[#756C69] hover:text-[#4E1724] hover:bg-[#FAF7F5] rounded-xl transition-colors"
                        title="Lihat Detail Metadata"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => alert(`Mengunduh berkas: ${doc.title} (Simulasi demo)`)}
                        className="p-1.5 text-[#756C69] hover:text-[#059669] hover:bg-[#FAF7F5] rounded-xl transition-colors cursor-pointer"
                        title="Unduh Berkas"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {isPrivileged && (
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-1.5 text-[#756C69] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-colors cursor-pointer"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
