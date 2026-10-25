// Application-wide constants for BEM-Track

export const APP_NAME = 'BEM-Track';
export const APP_DESCRIPTION = 'Sistem Informasi Tracking dan Transparansi BEM FKI UMS';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
export const INDOBERT_API_URL = process.env.NEXT_PUBLIC_INDOBERT_API_URL || 'http://localhost:8000';

export const DEPARTMENTS = [
  'IPO — Internal dan Pengembangan Organisasi',
  'KONEKS — Koneksi Eksternal',
  'ADVO — Advokasi dan Kesejahteraan Mahasiswa',
  'VISINFO — Visual Informasi dan Branding',
] as const;

export const EXECUTING_DEPARTMENTS = [
  {
    code: 'IPO',
    name: 'Internal dan Pengembangan Organisasi',
    fullName: 'IPO — Internal dan Pengembangan Organisasi',
    shortName: 'IPO',
  },
  {
    code: 'KONEKS',
    name: 'Koneksi Eksternal',
    fullName: 'KONEKS — Koneksi Eksternal',
    shortName: 'KONEKS',
  },
  {
    code: 'ADVO',
    name: 'Advokasi dan Kesejahteraan Mahasiswa',
    fullName: 'ADVO — Advokasi dan Kesejahteraan Mahasiswa',
    shortName: 'ADVO',
  },
  {
    code: 'VISINFO',
    name: 'Visual Informasi dan Branding',
    fullName: 'VISINFO — Visual Informasi dan Branding',
    shortName: 'VISINFO',
  },
] as const;

// Five IndoBERT Multi-Label Classification Categories from Thesis Proposal
export const PROGRAM_CATEGORIES = [
  {
    value: 'ORGANIZATIONAL_DEVELOPMENT',
    label: 'Organizational Development & Cadreization',
    shortLabel: 'Pengembangan Organisasi & Kaderisasi',
    color: 'amber',
  },
  {
    value: 'EDUCATION_TRAINING_CAREER',
    label: 'Education, Training & Career',
    shortLabel: 'Pendidikan, Pelatihan & Karir',
    color: 'indigo',
  },
  {
    value: 'COMMUNITY_SERVICE_RELATIONS',
    label: 'Social, Community Service & External Relations',
    shortLabel: 'Sosial & Relasi Eksternal',
    color: 'emerald',
  },
  {
    value: 'MEDIA_INFORMATION_PUBLICATION',
    label: 'Media, Information & Publication',
    shortLabel: 'Media, Informasi & Publikasi',
    color: 'rose',
  },
  {
    value: 'ADMINISTRATION_FINANCE',
    label: 'Strategic Administration & Finance',
    shortLabel: 'Administrasi Strategis & Keuangan',
    color: 'blue',
  },
] as const;

export const STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-200',
    dotClass: 'bg-slate-400',
  },
  SUBMITTED: {
    label: 'Diajukan',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    dotClass: 'bg-blue-500',
  },
  BENDUM_REVIEW: {
    label: 'Pending Sekum',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-200',
    dotClass: 'bg-orange-500',
  },
  SEKUM_REVIEW: {
    label: 'Pending Approval',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    dotClass: 'bg-amber-500',
  },
  GUBERNUR_REVIEW: {
    label: 'Pending Approval',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-200',
    dotClass: 'bg-purple-500',
  },
  APPROVED: {
    label: 'Approval',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  REVISION: {
    label: 'Perlu Revisi',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-700',
    borderClass: 'border-yellow-200',
    dotClass: 'bg-yellow-500',
  },
  REJECTED: {
    label: 'Ditolak',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-200',
    dotClass: 'bg-rose-500',
  },
} as const;

export const APPROVAL_STAGES = [
  {
    id: 'DEPARTEMEN',
    label: 'Departemen Pelaksana',
    sublabel: 'Pengajuan Proposal & RAB',
    icon: 'Building2',
  },
  {
    id: 'BENDUM',
    label: 'Bendahara Umum',
    sublabel: 'Tahap 1: Verifikasi Usulan & Anggaran (RAB)',
    icon: 'Wallet',
  },
  {
    id: 'SEKUM',
    label: 'Sekretaris Umum',
    sublabel: 'Tahap 2: Validasi Administrasi & Berkas',
    icon: 'FileCheck',
  },
  {
    id: 'GUBERNUR',
    label: 'Gubernur BEM',
    sublabel: 'Tahap 3: Persetujuan Eksekutif Final (Approval)',
    icon: 'ShieldCheck',
  },
];

export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
