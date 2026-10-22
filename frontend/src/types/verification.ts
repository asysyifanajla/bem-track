export type VerificationStage = 'SEKUM' | 'BENDUM' | 'GUBERNUR';
export type VerificationAction = 'APPROVED' | 'REVISION' | 'REJECTED';

export interface VerificationTask {
  id: string;
  programId: string;
  programTitle: string;
  departemen: string;
  submittedBy: string;
  submittedAt: string;
  stage: VerificationStage;
  totalBudget: number;
  proposalFileUrl?: string;
  rabFileUrl?: string;
  note?: string;
  daysWaiting: number;
}

export interface VerificationDecision {
  action: VerificationAction;
  note: string;
}
