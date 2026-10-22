export type DocumentCategory = 'PROPOSAL' | 'RAB' | 'LPJ' | 'SURAT_UNDANGAN' | 'NOTULENSI' | 'DOKUMENTASI' | 'LAINNYA';
export type ArchiveStatus = 'ACTIVE' | 'ARCHIVED';

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  programId?: string;
  programTitle?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: ArchiveStatus;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
}

export interface VaultDocument extends Document {
  vaultCategory: 'PERATURAN' | 'AD_ART' | 'TEMPLATE' | 'PANDUAN' | 'LAINNYA';
  isPublic: boolean;
  downloadCount: number;
}
