// Application-wide constants for BEM-Track

export const APP_NAME = 'BEM-Track';
export const APP_DESCRIPTION = 'Sistem Informasi Tracking dan Transparansi BEM FKI UMS';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
export const INDOBERT_API_URL = process.env.NEXT_PUBLIC_INDOBERT_API_URL || 'http://localhost:8000';

export const DEPARTMENTS = [
  'Departemen Akademik & Profesi',
  'Departemen Kewirausahaan',
  'Departemen Sosial & Kemasyarakatan',
  'Departemen Minat & Bakat',
  'Departemen Komunikasi & Informasi',
  'Departemen Pengembangan Organisasi',
];

export const PROGRAM_CATEGORIES = [
  { value: 'PENDIDIKAN', label: 'Pendidikan', color: 'indigo' },
  { value: 'PELATIHAN', label: 'Pelatihan', color: 'violet' },
  { value: 'SOSIAL', label: 'Sosial', color: 'emerald' },
  { value: 'BUDAYA', label: 'Budaya', color: 'amber' },
  { value: 'OLAHRAGA', label: 'Olahraga', color: 'sky' },
  { value: 'KESEHATAN', label: 'Kesehatan', color: 'rose' },
  { value: 'LINGKUNGAN', label: 'Lingkungan', color: 'green' },
  { value: 'TEKNOLOGI', label: 'Teknologi', color: 'blue' },
  { value: 'SENI', label: 'Seni', color: 'pink' },
  { value: 'LAINNYA', label: 'Lainnya', color: 'slate' },
];

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
    label: 'Departemen',
    sublabel: 'Pengajuan Proker',
    icon: 'Building2',
  },
  {
    id: 'SEKUM',
    label: 'Sekretaris Umum',
    sublabel: 'Validasi Surat',
    icon: 'FileCheck',
  },
  {
    id: 'BENDUM',
    label: 'Bendahara Umum',
    sublabel: 'Verifikasi RAB',
    icon: 'Wallet',
  },
  {
    id: 'GUBERNUR',
    label: 'Gubernur BEM',
    sublabel: 'Persetujuan Final',
    icon: 'ShieldCheck',
  },
];

export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
