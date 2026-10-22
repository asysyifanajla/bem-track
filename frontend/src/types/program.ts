export type ProgramStatus = 'DRAFT' | 'SUBMITTED' | 'SEKUM_REVIEW' | 'BENDUM_REVIEW' | 'GUBERNUR_REVIEW' | 'APPROVED' | 'REVISION' | 'REJECTED';
export type ProgramCategory = 'PENDIDIKAN' | 'PELATIHAN' | 'SOSIAL' | 'BUDAYA' | 'OLAHRAGA' | 'KESEHATAN' | 'LINGKUNGAN' | 'TEKNOLOGI' | 'SENI' | 'LAINNYA';

export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Diajukan',
  SEKUM_REVIEW: 'Review Sekretaris',
  BENDUM_REVIEW: 'Review Bendahara',
  GUBERNUR_REVIEW: 'Review Gubernur',
  APPROVED: 'Disetujui',
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
  background: string;
  objectives: string;
  targetParticipants: string;
  plannedDate: string;
  endDate?: string;
  location: string;
  status: ProgramStatus;
  categories: ProgramCategory[];
  indobertTags: IndoBERTTag[];
  budgetItems: ProgramBudgetItem[];
  totalBudget: number;
  proposalFileUrl?: string;
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
