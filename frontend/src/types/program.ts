export type ProgramStatus = 'DRAFT' | 'SUBMITTED' | 'SEKUM_REVIEW' | 'BENDUM_REVIEW' | 'GUBERNUR_REVIEW' | 'APPROVED' | 'REVISION' | 'REJECTED';
export type ProgramCategory =
  | 'ORGANIZATIONAL_DEVELOPMENT'
  | 'EDUCATION_TRAINING_CAREER'
  | 'COMMUNITY_SERVICE_RELATIONS'
  | 'MEDIA_INFORMATION_PUBLICATION'
  | 'ADMINISTRATION_FINANCE'
  // Backward compatibility aliases
  | 'PENDIDIKAN'
  | 'PELATIHAN'
  | 'SOSIAL'
  | 'BUDAYA'
  | 'OLAHRAGA'
  | 'KESEHATAN'
  | 'LINGKUNGAN'
  | 'TEKNOLOGI'
  | 'SENI'
  | 'LAINNYA';

export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Diajukan',
  BENDUM_REVIEW: 'Pending Sekum',
  SEKUM_REVIEW: 'Pending Approval',
  GUBERNUR_REVIEW: 'Pending Approval',
  APPROVED: 'Approval',
  REVISION: 'Perlu Revisi',
  REJECTED: 'Ditolak',
};

export interface IndoBERTTag {
  label: string;
  category: ProgramCategory;
  confidence: number;
}

export interface ProgramBudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Program {
  id: string;
  title: string;
  departemen: string;
  description: string;
  background?: string;
  objectives?: string;
  targetParticipants?: string;
  plannedDate: string;
  endDate?: string;
  location?: string;
  status: ProgramStatus;
  categories: ProgramCategory[];
  indobertTags: IndoBERTTag[];
  // RAB is integrated in the uploaded proposal document; budgetItems kept for legacy display if present
  budgetItems?: ProgramBudgetItem[];
  totalBudget?: number;
  // Uploaded proposal document (contains detailed activity proposal and integrated RAB)
  proposalFileUrl?: string;
  proposalFileName?: string;
  proposalFileSize?: number;
  proposalMimeType?: string;
  // Legacy / optional direct RAB url
  rabFileUrl?: string;
  submittedBy: string;
  submittedAt: string;
  updatedAt: string;
  approvalHistory?: ApprovalStep[];
}

export interface ApprovalStep {
  id: string;
  stage: 'SEKUM' | 'BENDUM' | 'GUBERNUR';
  action: 'APPROVED' | 'REVISION' | 'REJECTED';
  note: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
}
