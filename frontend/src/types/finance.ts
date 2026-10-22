export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  programId?: string;
  programTitle?: string;
  date: string;
  receiptUrl?: string;
  status: TransactionStatus;
  recordedBy: string;
  verifiedBy?: string;
  note?: string;
  createdAt: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  budgetRealization: number; // percentage
  byDepartemen: DepartemenBudget[];
}

export interface DepartemenBudget {
  departemen: string;
  allocated: number;
  realized: number;
  percentage: number;
}
