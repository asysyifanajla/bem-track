import { UserRole } from '@/types/auth';

/**
 * BEM-Track Permission Matrix
 * Source of truth for role-based capabilities according to BEM FKI UMS bureaucracy:
 * - Dep (DEPARTEMEN_1..4): Ajukan & revisi proker, pantau verifikasi, upload arsip, kelola timeline sendiri, lihat vault & ringkasan keuangan di dashboard
 * - Bendum (BENDAHARA_UMUM): Kelola kas/transaksi, verifikasi anggaran, pantau proker, lihat arsip final & vault, kelola agenda
 * - Sekum (SEKRETARIS_UMUM): Verifikasi administrasi, kelola vault organisasi, upload & kelola arsip, kelola proker & agenda
 * - Gub/Wagub (GUBERNUR): Setujui eksekutif (final), pantau semua proker & log aktivitas, lihat arsip final, vault, agenda & ringkasan keuangan
 * - Admin (ADMIN): Full administrative privileges for system maintenance
 */

export type AppPermission =
  // Programs
  | 'programs:view'
  | 'programs:create'
  | 'programs:edit'
  | 'programs:delete'
  // Verifications
  | 'verifications:view'
  | 'verifications:verify_admin'    // Sekum
  | 'verifications:verify_budget'   // Bendum
  | 'verifications:approve_final'   // Gubernur
  // Archives
  | 'archives:view_all'             // Can see drafts and unfinalized
  | 'archives:view_final'           // Can see only final documents
  | 'archives:upload'
  | 'archives:delete'
  // Vault
  | 'vault:view'
  | 'vault:manage'                  // Sekum only
  // Finance
  | 'finance:view_summary'          // All roles on dashboard
  | 'finance:manage_transactions'   // Bendum only
  // Timeline
  | 'timeline:view'
  | 'timeline:manage'               // Dep, Sekum, Bendum
  // Activity Logs
  | 'activity_logs:view'            // Gub, Admin, Sekum
  // Users
  | 'users:view'
  | 'users:manage';

const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  ADMIN: [
    'programs:view', 'programs:create', 'programs:edit', 'programs:delete',
    'verifications:view', 'verifications:verify_admin', 'verifications:verify_budget', 'verifications:approve_final',
    'archives:view_all', 'archives:view_final', 'archives:upload', 'archives:delete',
    'vault:view', 'vault:manage',
    'finance:view_summary', 'finance:manage_transactions',
    'timeline:view', 'timeline:manage',
    'activity_logs:view',
    'users:view', 'users:manage',
  ],
  GUBERNUR: [
    'programs:view',
    'verifications:view', 'verifications:approve_final',
    'archives:view_final',
    'vault:view',
    'finance:view_summary',
    'timeline:view',
    'activity_logs:view',
    'users:view',
  ],
  SEKRETARIS_UMUM: [
    'programs:view', 'programs:create', 'programs:edit',
    'verifications:view', 'verifications:verify_admin',
    'archives:view_all', 'archives:view_final', 'archives:upload', 'archives:delete',
    'vault:view', 'vault:manage',
    'finance:view_summary',
    'timeline:view', 'timeline:manage',
    'activity_logs:view',
  ],
  BENDAHARA_UMUM: [
    'programs:view', 'programs:create', 'programs:edit',
    'verifications:view', 'verifications:verify_budget',
    'archives:view_final',
    'vault:view',
    'finance:view_summary', 'finance:manage_transactions',
    'timeline:view', 'timeline:manage',
  ],
  DEPARTEMEN_1: [
    'programs:view', 'programs:create', 'programs:edit',
    'verifications:view',
    'archives:view_all', 'archives:view_final', 'archives:upload',
    'vault:view',
    'finance:view_summary',
    'timeline:view', 'timeline:manage',
  ],
  DEPARTEMEN_2: [
    'programs:view', 'programs:create', 'programs:edit',
    'verifications:view',
    'archives:view_all', 'archives:view_final', 'archives:upload',
    'vault:view',
    'finance:view_summary',
    'timeline:view', 'timeline:manage',
  ],
  DEPARTEMEN_3: [
    'programs:view', 'programs:create', 'programs:edit',
    'verifications:view',
    'archives:view_all', 'archives:view_final', 'archives:upload',
    'vault:view',
    'finance:view_summary',
    'timeline:view', 'timeline:manage',
  ],
  DEPARTEMEN_4: [
    'programs:view', 'programs:create', 'programs:edit',
    'verifications:view',
    'archives:view_all', 'archives:view_final', 'archives:upload',
    'vault:view',
    'finance:view_summary',
    'timeline:view', 'timeline:manage',
  ],
};

export function hasPermission(role: UserRole | string | undefined, permission: AppPermission): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function canCreateProgram(role?: string): boolean {
  return hasPermission(role, 'programs:create');
}

export function canVerifyAdmin(role?: string): boolean {
  return hasPermission(role, 'verifications:verify_admin');
}

export function canVerifyBudget(role?: string): boolean {
  return hasPermission(role, 'verifications:verify_budget');
}

export function canApproveExecutive(role?: string): boolean {
  return hasPermission(role, 'verifications:approve_final');
}

export function canUploadArchive(role?: string): boolean {
  return hasPermission(role, 'archives:upload');
}

export function canManageVault(role?: string): boolean {
  return hasPermission(role, 'vault:manage');
}

export function canManageFinance(role?: string): boolean {
  return hasPermission(role, 'finance:manage_transactions');
}

export function canManageTimeline(role?: string): boolean {
  return hasPermission(role, 'timeline:manage');
}

export function canViewActivityLogs(role?: string): boolean {
  return hasPermission(role, 'activity_logs:view');
}

export function canManageUsers(role?: string): boolean {
  return hasPermission(role, 'users:manage');
}

export function isDepartemen(role?: string): boolean {
  return typeof role === 'string' && role.startsWith('DEPARTEMEN');
}
