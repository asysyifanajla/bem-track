import { Program } from '@/types/program';
import { Document, VaultDocument } from '@/types/document';
import { FinanceTransaction } from '@/types/finance';
import { TimelineEvent } from '@/types/timeline';
import { User } from '@/types/auth';

export interface ActivityLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  module: 'Programs' | 'Verifications' | 'Archives' | 'Vault' | 'Finance' | 'Timeline' | 'Users' | 'Auth';
  timestamp: string;
  details?: string;
}

// ─── Demo Users ─────────────────────────────────────────────────────────────
export const DEMO_USERS: (User & { passwordHint: string })[] = [
  {
    id: 'user-gub',
    name: 'Ahmad Fauzi',
    email: 'gubernur@bem.ums.ac.id',
    role: 'GUBERNUR',
    departemen: 'Badan Pengurus Harian (BPH)',
    createdAt: '2026-01-10T08:00:00Z',
    passwordHint: 'demo123',
  },
  {
    id: 'user-sekum',
    name: 'Siti Rahayu',
    email: 'sekum@bem.ums.ac.id',
    role: 'SEKRETARIS_UMUM',
    departemen: 'Kesekretariatan',
    createdAt: '2026-01-10T08:00:00Z',
    passwordHint: 'demo123',
  },
  {
    id: 'user-bendum',
    name: 'Budi Santoso',
    email: 'bendum@bem.ums.ac.id',
    role: 'BENDAHARA_UMUM',
    departemen: 'Kebendaharaan',
    createdAt: '2026-01-10T08:00:00Z',
    passwordHint: 'demo123',
  },
  {
    id: 'user-dept1',
    name: 'Rina Dewi',
    email: 'dept.akademik@bem.ums.ac.id',
    role: 'DEPARTEMEN_1',
    departemen: 'Departemen Akademik & Profesi',
    createdAt: '2026-01-15T09:00:00Z',
    passwordHint: 'demo123',
  },
  {
    id: 'user-dept2',
    name: 'Hendra Wijaya',
    email: 'dept.kewirausahaan@bem.ums.ac.id',
    role: 'DEPARTEMEN_2',
    departemen: 'Departemen Kewirausahaan',
    createdAt: '2026-01-15T09:00:00Z',
    passwordHint: 'demo123',
  },
  {
    id: 'user-admin',
    name: 'Admin Sistem',
    email: 'admin@bem.ums.ac.id',
    role: 'ADMIN',
    departemen: 'Biro PTI',
    createdAt: '2026-01-01T00:00:00Z',
    passwordHint: 'demo123',
  },
];

// ─── Initial Realistic Programs ──────────────────────────────────────────────
export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'PRG-2026-001',
    title: 'Company Profile Production Training',
    departemen: 'Departemen Komunikasi & Informasi',
    description: 'Pelatihan pembuatan dan penyuntingan video profil organisasi BEM untuk meningkatkan kemampuan anggota dalam bidang publikasi.',
    background: 'Kebutuhan representasi digital organisasi BEM FKI UMS semakin meningkat di media sosial dan kanal resmi kampus.',
    objectives: 'Meningkatkan skill videografi, motion graphics, dan public relation bagi pengurus serta mahasiswa FKI.',
    targetParticipants: '45 Anggota & Mahasiswa FKI UMS',
    plannedDate: '2026-11-15',
    endDate: '2026-11-16',
    location: 'Lab Multimedia Lantai 3 Gedung J FKI UMS',
    status: 'SEKUM_REVIEW',
    categories: ['PELATIHAN', 'TEKNOLOGI'],
    indobertTags: [
      { label: 'Pelatihan Media & Publikasi', category: 'PELATIHAN', confidence: 0.88 },
      { label: 'Teknologi Informasi & Kreatif', category: 'TEKNOLOGI', confidence: 0.84 },
    ],
    budgetItems: [
      { id: 'b-1', description: 'Honorarium Pemateri Videografi Profesional', quantity: 2, unitPrice: 750000, total: 1500000 },
      { id: 'b-2', description: 'Konsumsi Peserta & Panitia (2 Hari)', quantity: 50, unitPrice: 25000, total: 1250000 },
      { id: 'b-3', description: 'Sertifikat & Modul Praktikum Digital', quantity: 45, unitPrice: 15000, total: 675000 },
    ],
    totalBudget: 3425000,
    proposalFileUrl: '/mock/docs/Proposal_Company_Profile_Training.pdf',
    rabFileUrl: '/mock/docs/RAB_Company_Profile_Training.xlsx',
    submittedBy: 'Dian Pertiwi (Staff Kominfo)',
    submittedAt: '2026-10-18T10:30:00Z',
    updatedAt: '2026-10-19T14:00:00Z',
    approvalHistory: [
      {
        id: 'app-1',
        stage: 'SEKUM',
        action: 'APPROVED',
        note: 'Dokumen kelengkapan surat pengantar dan perizinan lab sudah valid.',
        actorName: 'Siti Rahayu',
        actorRole: 'Sekretaris Umum',
        timestamp: '2026-10-19T14:00:00Z',
      },
    ],
  },
  {
    id: 'PRG-2026-002',
    title: 'Workshop Kewirausahaan Digital & Inkubasi Bisnis Mahasiswa',
    departemen: 'Departemen Kewirausahaan',
    description: 'Program pendampingan startup mahasiswa dari tahap ideation, prototype bisnis, hingga presentasi pitch deck ke investor.',
    background: 'Potensi mahasiswa FKI dalam menghasilkan produk teknologi bernilai bisnis memerlukan wadah pembinaan terstruktur.',
    objectives: 'Melahirkan minimal 5 tim rintisan usaha teknologi mahasiswa yang siap berkompetisi di tingkat regional.',
    targetParticipants: '60 Mahasiswa FKI UMS',
    plannedDate: '2026-11-28',
    endDate: '2026-11-29',
    location: 'Auditorium Moh. Djazman Kampus 1 UMS',
    status: 'BENDUM_REVIEW',
    categories: ['PELATIHAN', 'PENDIDIKAN'],
    indobertTags: [
      { label: 'Kewirausahaan & Bisnis Mahasiswa', category: 'PELATIHAN', confidence: 0.91 },
      { label: 'Inovasi Teknologi Digital', category: 'TEKNOLOGI', confidence: 0.79 },
    ],
    budgetItems: [
      { id: 'b-4', description: 'Honorarium Mentor Bisnis Startup (2 Sesi)', quantity: 2, unitPrice: 1000000, total: 2000000 },
      { id: 'b-5', description: 'Konsumsi Peserta 2 Hari & Coffee Break', quantity: 70, unitPrice: 35000, total: 2450000 },
      { id: 'b-6', description: 'Dana Stimulus Inkubasi 3 Tim Terbaik', quantity: 3, unitPrice: 750000, total: 2250000 },
    ],
    totalBudget: 6700000,
    proposalFileUrl: '/mock/docs/Proposal_Workshop_Kewirausahaan.pdf',
    rabFileUrl: '/mock/docs/RAB_Workshop_Kewirausahaan.xlsx',
    submittedBy: 'Hendra Wijaya',
    submittedAt: '2026-10-14T09:15:00Z',
    updatedAt: '2026-10-16T11:20:00Z',
    approvalHistory: [
      {
        id: 'app-2',
        stage: 'SEKUM',
        action: 'APPROVED',
        note: 'Format proposal sesuai template BEM 2026.',
        actorName: 'Siti Rahayu',
        actorRole: 'Sekretaris Umum',
        timestamp: '2026-10-16T11:20:00Z',
      },
    ],
  },
  {
    id: 'PRG-2026-003',
    title: 'Seminar Nasional Cybersecurity & Cloud Defense 2026',
    departemen: 'Departemen Akademik & Profesi',
    description: 'Seminar edukasi keamanan informasi dan infrastruktur cloud dengan pemateri praktisi industri bersertifikasi internasional.',
    background: 'Tingginya insiden kebocoran data menuntut pemahaman mendalam tentang tata kelola keamanan siber di kalangan mahasiswa.',
    objectives: 'Memberikan wawasan industri mutakhir tentang secure coding, ethical hacking, dan cloud posture defense.',
    targetParticipants: '200 Peserta Umum & Mahasiswa UMS',
    plannedDate: '2026-12-05',
    location: 'Gedung Seminar Pascasarjana Kampus 2 UMS',
    status: 'GUBERNUR_REVIEW',
    categories: ['PENDIDIKAN', 'TEKNOLOGI'],
    indobertTags: [
      { label: 'Keamanan Siber & Cloud', category: 'TEKNOLOGI', confidence: 0.94 },
      { label: 'Edukasi Akademik & Profesi', category: 'PENDIDIKAN', confidence: 0.86 },
    ],
    budgetItems: [
      { id: 'b-7', description: 'Sewa Gedung & Sound System Profesional', quantity: 1, unitPrice: 2500000, total: 2500000 },
      { id: 'b-8', description: 'Honorarium Keynote Speaker (Praktisi Siber)', quantity: 1, unitPrice: 2000000, total: 2000000 },
      { id: 'b-9', description: 'Konsumsi & Snack Box Peserta (200 pax)', quantity: 200, unitPrice: 20000, total: 4000000 },
      { id: 'b-10', description: 'Goodie Bag, Sertifikat & Seminar Kit', quantity: 200, unitPrice: 15000, total: 3000000 },
    ],
    totalBudget: 11500000,
    proposalFileUrl: '/mock/docs/Proposal_Seminar_Cybersecurity.pdf',
    rabFileUrl: '/mock/docs/RAB_Seminar_Cybersecurity.xlsx',
    submittedBy: 'Rina Dewi',
    submittedAt: '2026-10-10T14:00:00Z',
    updatedAt: '2026-10-15T16:45:00Z',
    approvalHistory: [
      {
        id: 'app-3',
        stage: 'SEKUM',
        action: 'APPROVED',
        note: 'Dokumen administrasi dan perizinan tempat lengkap.',
        actorName: 'Siti Rahayu',
        actorRole: 'Sekretaris Umum',
        timestamp: '2026-10-12T10:00:00Z',
      },
      {
        id: 'app-4',
        stage: 'BENDUM',
        action: 'APPROVED',
        note: 'RAB telah disesuaikan dengan standar biaya masukan dekanat.',
        actorName: 'Budi Santoso',
        actorRole: 'Bendahara Umum',
        timestamp: '2026-10-15T16:45:00Z',
      },
    ],
  },
  {
    id: 'PRG-2026-004',
    title: 'Bakti Sosial & Literasi Digital di Desa Binaan Boyolali',
    departemen: 'Departemen Sosial & Kemasyarakatan',
    description: 'Pengabdian masyarakat berupa pembagian paket sembako, pelatihan dasar komputer untuk siswa SD, dan edukasi internet sehat.',
    background: 'Realisasi tridharma perguruan tinggi bidang pengabdian masyarakat di desa binaan BEM FKI UMS.',
    objectives: 'Meningkatkan literasi teknologi anak usia sekolah dan membantu meringankan beban warga kurang mampu.',
    targetParticipants: '120 Warga & 40 Siswa SD Desa Binaan',
    plannedDate: '2026-12-19',
    endDate: '2026-12-20',
    location: 'Balai Desa Pengkol, Karanggede, Boyolali',
    status: 'APPROVED',
    categories: ['SOSIAL', 'PENDIDIKAN'],
    indobertTags: [
      { label: 'Pengabdian & Bantuan Sosial', category: 'SOSIAL', confidence: 0.95 },
      { label: 'Edukasi Literasi Dasar', category: 'PENDIDIKAN', confidence: 0.81 },
    ],
    budgetItems: [
      { id: 'b-11', description: 'Paket Sembako Masyarakat (100 Paket)', quantity: 100, unitPrice: 75000, total: 7500000 },
      { id: 'b-12', description: 'Transportasi Panitia & Logistik (2 Elf)', quantity: 2, unitPrice: 1200000, total: 2400000 },
      { id: 'b-13', description: 'Donasi Alat Tulis & Buku Cerita Siswa SD', quantity: 40, unitPrice: 35000, total: 1400000 },
    ],
    totalBudget: 11300000,
    proposalFileUrl: '/mock/docs/Proposal_Baksos_Boyolali.pdf',
    rabFileUrl: '/mock/docs/RAB_Baksos_Boyolali.xlsx',
    submittedBy: 'Agus Pratama',
    submittedAt: '2026-09-25T08:00:00Z',
    updatedAt: '2026-10-02T13:30:00Z',
    approvalHistory: [
      {
        id: 'app-5',
        stage: 'SEKUM',
        action: 'APPROVED',
        note: 'Surat tugas dan izin kepala desa terlampir lengkap.',
        actorName: 'Siti Rahayu',
        actorRole: 'Sekretaris Umum',
        timestamp: '2026-09-27T09:00:00Z',
      },
      {
        id: 'app-6',
        stage: 'BENDUM',
        action: 'APPROVED',
        note: 'Anggaran disetujui bersumber dari Kas BEM & Open Donasi.',
        actorName: 'Budi Santoso',
        actorRole: 'Bendahara Umum',
        timestamp: '2026-09-29T11:00:00Z',
      },
      {
        id: 'app-7',
        stage: 'GUBERNUR',
        action: 'APPROVED',
        note: 'Program sangat baik, segera koordinasikan dengan pimpinan fakultas.',
        actorName: 'Ahmad Fauzi',
        actorRole: 'Gubernur BEM',
        timestamp: '2026-10-02T13:30:00Z',
      },
    ],
  },
  {
    id: 'PRG-2026-005',
    title: 'FKI Sport & E-Sport Championship 2026',
    departemen: 'Departemen Minat & Bakat',
    description: 'Kompetisi internal antarmahasiswa FKI di bidang futsal, basket 3x3, Mobile Legends, dan Valorant.',
    background: 'Memupuk sportivitas, solidaritas antarang주는, dan menyaring atlet potensial untuk ajang pekan olahraga mahasiswa.',
    objectives: 'Menjalin silaturahmi antarmahasiswa lintas prodi di FKI UMS.',
    targetParticipants: '350 Atlet & Mahasiswa FKI',
    plannedDate: '2026-12-12',
    endDate: '2026-12-14',
    location: 'GOR UMS & Student Center Kampus 2',
    status: 'REVISION',
    categories: ['OLAHRAGA'],
    indobertTags: [
      { label: 'Kompetisi Olahraga & E-Sport', category: 'OLAHRAGA', confidence: 0.96 },
    ],
    budgetItems: [
      { id: 'b-14', description: 'Sewa Lapangan Futsal & Basket (3 Hari)', quantity: 3, unitPrice: 1200000, total: 3600000 },
      { id: 'b-15', description: 'Trofi, Medali & Sertifikat Kejuaraan', quantity: 1, unitPrice: 1800000, total: 1800000 },
      { id: 'b-16', description: 'Honorarium Wasit Futsal Resmi PSSI', quantity: 4, unitPrice: 350000, total: 1400000 },
    ],
    totalBudget: 6800000,
    proposalFileUrl: '/mock/docs/Proposal_FKI_Championship.pdf',
    rabFileUrl: '/mock/docs/RAB_FKI_Championship.xlsx',
    submittedBy: 'Fajar Nugroho',
    submittedAt: '2026-10-05T13:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
    approvalHistory: [
      {
        id: 'app-8',
        stage: 'SEKUM',
        action: 'APPROVED',
        note: 'Dokumen awal disetujui.',
        actorName: 'Siti Rahayu',
        actorRole: 'Sekretaris Umum',
        timestamp: '2026-10-08T10:00:00Z',
      },
      {
        id: 'app-9',
        stage: 'BENDUM',
        action: 'REVISION',
        note: 'Biaya sewa sound system dan sewa server e-sport belum terinci dengan kuotasi vendor resmi. Harap revisi lampiran RAB.',
        actorName: 'Budi Santoso',
        actorRole: 'Bendahara Umum',
        timestamp: '2026-10-18T10:00:00Z',
      },
    ],
  },
  {
    id: 'PRG-2026-006',
    title: 'Upgrading Organisasi & Latihan Kepemimpinan Mahasiswa (LKMM)',
    departemen: 'Departemen Pengembangan Organisasi',
    description: 'Pelatihan kepemimpinan tingkat menengah bagi calon fungsionaris organisasi mahasiswa di lingkungan FKI UMS.',
    background: 'Regenerasi kepengurusan dan standarisasi kapasitas manajerial pengurus organisasi mahasiswa.',
    objectives: 'Menanamkan nilai kepemimpinan profetik, integritas birokrasi, dan manajemen konflik.',
    targetParticipants: '50 Mahasiswa FKI UMS',
    plannedDate: '2027-01-09',
    endDate: '2027-01-10',
    location: 'Pusdiklat Balai Diklat Karanganyar',
    status: 'SUBMITTED',
    categories: ['PENDIDIKAN', 'PELATIHAN'],
    indobertTags: [
      { label: 'Kepemimpinan & Organisasi', category: 'PENDIDIKAN', confidence: 0.90 },
      { label: 'Pelatihan Manajerial', category: 'PELATIHAN', confidence: 0.85 },
    ],
    budgetItems: [
      { id: 'b-17', description: 'Paket Akomodasi & Konsumsi Pusdiklat 2H1M', quantity: 50, unitPrice: 150000, total: 7500000 },
      { id: 'b-18', description: 'Honorarium Trainer Leadership & Outbound', quantity: 2, unitPrice: 1250000, total: 2500000 },
    ],
    totalBudget: 10000000,
    proposalFileUrl: '/mock/docs/Proposal_LKMM_2027.pdf',
    rabFileUrl: '/mock/docs/RAB_LKMM_2027.xlsx',
    submittedBy: 'Kurnia Ramadhan',
    submittedAt: '2026-10-21T15:20:00Z',
    updatedAt: '2026-10-21T15:20:00Z',
    approvalHistory: [],
  },
];

// ─── Initial Archives ────────────────────────────────────────────────────────
export const INITIAL_ARCHIVES: Document[] = [
  {
    id: 'DOC-2026-001',
    title: 'LPJ Terpadu Pelantikan & Rapat Kerja BEM FKI 2026',
    category: 'LPJ',
    programId: 'PRG-2026-000',
    programTitle: 'Pelantikan & Raker Pengurus 2026',
    fileUrl: '/mock/docs/LPJ_Pelantikan_Raker_2026.pdf',
    fileSize: 4820000,
    mimeType: 'application/pdf',
    status: 'ARCHIVED',
    uploadedBy: 'Siti Rahayu (Sekum)',
    uploadedAt: '2026-03-15T11:00:00Z',
    description: 'Laporan pertanggungjawaban lengkap kegiatan pelantikan beserta rekapitulasi dana dan bukti pengeluaran.',
    tags: ['LPJ', 'FINAL', 'DEKANAT_APPROVED'],
  },
  {
    id: 'DOC-2026-002',
    title: 'Proposal Disetujui Bakti Sosial & Literasi Digital Boyolali',
    category: 'PROPOSAL',
    programId: 'PRG-2026-004',
    programTitle: 'Bakti Sosial & Literasi Digital',
    fileUrl: '/mock/docs/Proposal_Baksos_Boyolali_Approved.pdf',
    fileSize: 2450000,
    mimeType: 'application/pdf',
    status: 'ARCHIVED',
    uploadedBy: 'Agus Pratama',
    uploadedAt: '2026-10-03T09:00:00Z',
    description: 'Proposal final bertandatangan Dekan dan Gubernur BEM untuk pencairan dana kegiatan kemasyarakatan.',
    tags: ['PROPOSAL', 'FINAL'],
  },
  {
    id: 'DOC-2026-003',
    title: 'Draft Laporan Antara Seminar Cybersecurity 2026',
    category: 'NOTULENSI',
    programId: 'PRG-2026-003',
    programTitle: 'Seminar Nasional Cybersecurity & Cloud Defense 2026',
    fileUrl: '/mock/docs/Draft_Notulensi_Cybersecurity.pdf',
    fileSize: 850000,
    mimeType: 'application/pdf',
    status: 'ACTIVE', // DRAFT / UNFINALIZED
    uploadedBy: 'Rina Dewi',
    uploadedAt: '2026-10-18T14:30:00Z',
    description: 'Catatan progres rapat persiapan dan draft perjanjian pembicara industri (Belum final).',
    tags: ['DRAFT', 'INTERNAL_PANITIA'],
  },
  {
    id: 'DOC-2026-004',
    title: 'RAB Final & Standar Biaya Masukan Proker Kemahasiswaan 2026',
    category: 'RAB',
    fileUrl: '/mock/docs/SBM_Kemahasiswaan_2026.xlsx',
    fileSize: 1200000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    status: 'ARCHIVED',
    uploadedBy: 'Budi Santoso (Bendum)',
    uploadedAt: '2026-02-01T10:00:00Z',
    description: 'Standar pagu anggaran operasional konsumsi, honorarium, dan akomodasi kegiatan BEM.',
    tags: ['RAB', 'FINAL', 'ACUAN_KEUANGAN'],
  },
];

// ─── Initial Vault Documents ────────────────────────────────────────────────
export const INITIAL_VAULT: VaultDocument[] = [
  {
    id: 'VLT-001',
    title: 'Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) BEM FKI UMS',
    category: 'LAINNYA',
    vaultCategory: 'AD_ART',
    fileUrl: '/mock/vault/AD_ART_BEM_FKI_UMS_2026.pdf',
    fileSize: 3200000,
    mimeType: 'application/pdf',
    status: 'ARCHIVED',
    uploadedBy: 'Siti Rahayu (Sekum)',
    uploadedAt: '2026-01-15T08:00:00Z',
    description: 'Konstitusi dasar organisasi mahasiswa BEM FKI UMS hasil ketetapan Musyawarah Mahasiswa (MUSMA).',
    isPublic: true,
    downloadCount: 142,
    tags: ['AD_ART', 'KONSTITUSI', 'PEDOMAN_ORGANISASI'],
  },
  {
    id: 'VLT-002',
    title: 'Surat Keputusan (SK) Dekan FKI UMS ttg Pengesahan Pengurus BEM 2026/2027',
    category: 'LAINNYA',
    vaultCategory: 'PERATURAN',
    fileUrl: '/mock/vault/SK_Dekan_Pengurus_BEM_2026.pdf',
    fileSize: 1850000,
    mimeType: 'application/pdf',
    status: 'ARCHIVED',
    uploadedBy: 'Siti Rahayu (Sekum)',
    uploadedAt: '2026-01-18T10:30:00Z',
    description: 'Surat keputusan dekanat tentang susunan fungsionaris resmi BEM FKI UMS periode berjalan.',
    isPublic: true,
    downloadCount: 98,
    tags: ['SK_DEKAN', 'LEGALITAS', 'SUSUNAN_PENGURUS'],
  },
  {
    id: 'VLT-003',
    title: 'Garis-Garis Besar Haluan Kerja (GBHK) BEM FKI UMS Periode 2026/2027',
    category: 'LAINNYA',
    vaultCategory: 'PANDUAN',
    fileUrl: '/mock/vault/GBHK_BEM_FKI_2026.pdf',
    fileSize: 2100000,
    mimeType: 'application/pdf',
    status: 'ARCHIVED',
    uploadedBy: 'Siti Rahayu (Sekum)',
    uploadedAt: '2026-01-20T14:00:00Z',
    description: 'Arahan strategis program kerja dan pembidangan seluruh departemen selama satu periode kepengurusan.',
    isPublic: true,
    downloadCount: 65,
    tags: ['GBHK', 'ARAH_KERJA', 'STRATEGI'],
  },
  {
    id: 'VLT-004',
    title: 'Template Resmi Proposal & Lembar Pengesahan BEM FKI UMS (Word/Docx)',
    category: 'PROPOSAL',
    vaultCategory: 'TEMPLATE',
    fileUrl: '/mock/vault/Template_Proposal_BEM_2026.docx',
    fileSize: 650000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'ACTIVE',
    uploadedBy: 'Siti Rahayu (Sekum)',
    uploadedAt: '2026-02-05T09:00:00Z',
    description: 'Format baku tata naskah dinas, kop surat, font, margin, dan urutan bab proposal program kerja.',
    isPublic: true,
    downloadCount: 230,
    tags: ['TEMPLATE', 'PROPOSAL', 'KESEKRETARIATAN'],
  },
];

// ─── Initial Finance Transactions ───────────────────────────────────────────
export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'TRX-2026-001',
    type: 'INCOME',
    amount: 25000000,
    description: 'Pencairan Dana Alokasi Anggaran Kemahasiswaan Termin 1 dari Dekanat FKI',
    category: 'Dana Dekanat',
    date: '2026-02-10',
    receiptUrl: '/mock/receipts/Bukti_Transfer_Termin1.pdf',
    status: 'VERIFIED',
    recordedBy: 'Budi Santoso',
    verifiedBy: 'Ahmad Fauzi',
    createdAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'TRX-2026-002',
    type: 'INCOME',
    amount: 5400000,
    description: 'Iuran Wajib Pengurus BEM FKI Periode 2026/2027 (Kolektif 6 Departemen)',
    category: 'Iuran Pengurus',
    date: '2026-03-01',
    receiptUrl: '/mock/receipts/Kwitansi_Iuran_Kas.pdf',
    status: 'VERIFIED',
    recordedBy: 'Budi Santoso',
    createdAt: '2026-03-01T15:30:00Z',
  },
  {
    id: 'TRX-2026-003',
    type: 'EXPENSE',
    amount: 4500000,
    description: 'Biaya Konsumsi, Sewa Sound, dan Perlengkapan Pelantikan & Raker Pengurus',
    category: 'Operasional Acara',
    programId: 'PRG-2026-000',
    programTitle: 'Pelantikan & Raker Pengurus 2026',
    date: '2026-03-12',
    receiptUrl: '/mock/receipts/Nota_Konsumsi_Raker.pdf',
    status: 'VERIFIED',
    recordedBy: 'Budi Santoso',
    verifiedBy: 'Ahmad Fauzi',
    createdAt: '2026-03-12T17:00:00Z',
  },
  {
    id: 'TRX-2026-004',
    type: 'EXPENSE',
    amount: 1500000,
    description: 'Pengadaan Kertas, Tinta Printer, Stempel Dinas, dan ATK Kesekretariatan',
    category: 'ATK & Kesekretariatan',
    date: '2026-04-05',
    receiptUrl: '/mock/receipts/Nota_ATK_April.pdf',
    status: 'VERIFIED',
    recordedBy: 'Budi Santoso',
    createdAt: '2026-04-05T10:15:00Z',
  },
  {
    id: 'TRX-2026-005',
    type: 'INCOME',
    amount: 8000000,
    description: 'Sponsorship Utama Tech Media Partner untuk Rangkaian Acara Semester Ganjil',
    category: 'Sponsorship',
    date: '2026-09-18',
    receiptUrl: '/mock/receipts/MoU_Sponsor_TechMedia.pdf',
    status: 'VERIFIED',
    recordedBy: 'Budi Santoso',
    createdAt: '2026-09-18T13:40:00Z',
  },
  {
    id: 'TRX-2026-006',
    type: 'EXPENSE',
    amount: 2400000,
    description: 'Uang Muka (DP) Transportasi Elf Bakti Sosial di Desa Pengkol Boyolali',
    category: 'Transportasi Program',
    programId: 'PRG-2026-004',
    programTitle: 'Bakti Sosial & Literasi Digital',
    date: '2026-10-15',
    receiptUrl: '/mock/receipts/Kwitansi_DP_Elf.pdf',
    status: 'VERIFIED',
    recordedBy: 'Budi Santoso',
    createdAt: '2026-10-15T14:20:00Z',
  },
];

// ─── Initial Timeline Events ─────────────────────────────────────────────────
export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'EVT-001',
    title: 'Rapat Koordinasi Evaluasi Tengah Periode (Mid-Term Evaluation)',
    departemen: 'Badan Pengurus Harian (BPH)',
    startDate: '2026-11-08T09:00:00Z',
    endDate: '2026-11-08T12:00:00Z',
    location: 'Ruang Rapat FKI Lantai 2',
    status: 'UPCOMING',
    description: 'Penyampaian capaian program kerja bulan Oktober - November dan restrukturisasi kepanitiaan.',
    createdBy: 'Siti Rahayu',
    createdAt: '2026-10-15T08:00:00Z',
  },
  {
    id: 'EVT-002',
    title: 'Pelaksanaan: Company Profile Production Training',
    programId: 'PRG-2026-001',
    programTitle: 'Company Profile Production Training',
    departemen: 'Departemen Komunikasi & Informasi',
    startDate: '2026-11-15T08:30:00Z',
    endDate: '2026-11-16T16:00:00Z',
    location: 'Lab Multimedia Lantai 3 Gedung J FKI UMS',
    status: 'UPCOMING',
    description: 'Pelatihan editing dan videografi dua hari bersama narasumber industri.',
    createdBy: 'Dian Pertiwi',
    createdAt: '2026-10-18T11:00:00Z',
  },
  {
    id: 'EVT-003',
    title: 'Pelaksanaan: Workshop Kewirausahaan Digital',
    programId: 'PRG-2026-002',
    programTitle: 'Workshop Kewirausahaan Digital & Inkubasi Bisnis',
    departemen: 'Departemen Kewirausahaan',
    startDate: '2026-11-28T08:00:00Z',
    endDate: '2026-11-29T16:30:00Z',
    location: 'Auditorium Moh. Djazman Kampus 1 UMS',
    status: 'UPCOMING',
    description: 'Pemaparan materi dan kurasi proposal bisnis mahasiswa.',
    createdBy: 'Hendra Wijaya',
    createdAt: '2026-10-16T12:00:00Z',
  },
  {
    id: 'EVT-004',
    title: 'Pelaksanaan: Seminar Nasional Cybersecurity & Cloud Defense 2026',
    programId: 'PRG-2026-003',
    programTitle: 'Seminar Nasional Cybersecurity 2026',
    departemen: 'Departemen Akademik & Profesi',
    startDate: '2026-12-05T08:00:00Z',
    endDate: '2026-12-05T15:00:00Z',
    location: 'Gedung Seminar Pascasarjana Kampus 2 UMS',
    status: 'UPCOMING',
    description: 'Seminar akbar tahunan kemahasiswaan bidang keamanan siber.',
    createdBy: 'Rina Dewi',
    createdAt: '2026-10-12T10:00:00Z',
  },
  {
    id: 'EVT-005',
    title: 'Pelaksanaan: Bakti Sosial & Literasi Digital Boyolali',
    programId: 'PRG-2026-004',
    programTitle: 'Bakti Sosial & Literasi Digital di Desa Binaan',
    departemen: 'Departemen Sosial & Kemasyarakatan',
    startDate: '2026-12-19T07:00:00Z',
    endDate: '2026-12-20T17:00:00Z',
    location: 'Desa Pengkol, Karanggede, Boyolali',
    status: 'UPCOMING',
    description: 'Pemberangkatan rombongan relawan BEM dan pembagian paket sembako.',
    createdBy: 'Agus Pratama',
    createdAt: '2026-10-02T14:00:00Z',
  },
];

// ─── Initial Activity Logs ──────────────────────────────────────────────────
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'LOG-001',
    userName: 'Kurnia Ramadhan',
    userRole: 'DEPARTEMEN_1',
    action: 'Mengajukan Proposal Program Kerja Baru',
    module: 'Programs',
    timestamp: '2026-10-21T15:20:00Z',
    details: 'Program: Upgrading Organisasi & Latihan Kepemimpinan Mahasiswa (LKMM)',
  },
  {
    id: 'LOG-002',
    userName: 'Budi Santoso',
    userRole: 'BENDAHARA_UMUM',
    action: 'Memberikan Catatan Revisi Verifikasi Anggaran',
    module: 'Verifications',
    timestamp: '2026-10-18T10:00:00Z',
    details: 'Program: FKI Sport & E-Sport Championship 2026 (Catatan: Rincian biaya sound system & server)',
  },
  {
    id: 'LOG-003',
    userName: 'Budi Santoso',
    userRole: 'BENDAHARA_UMUM',
    action: 'Mencatat Pengeluaran Kas Baru',
    module: 'Finance',
    timestamp: '2026-10-15T14:20:00Z',
    details: 'Nominal Rp 2.400.000 untuk DP Transportasi Elf Bakti Sosial',
  },
  {
    id: 'LOG-004',
    userName: 'Siti Rahayu',
    userRole: 'SEKRETARIS_UMUM',
    action: 'Menyetujui Verifikasi Administrasi',
    module: 'Verifications',
    timestamp: '2026-10-12T10:00:00Z',
    details: 'Program: Seminar Nasional Cybersecurity & Cloud Defense 2026',
  },
  {
    id: 'LOG-005',
    userName: 'Ahmad Fauzi',
    userRole: 'GUBERNUR',
    action: 'Memberikan Persetujuan Eksekutif Final',
    module: 'Verifications',
    timestamp: '2026-10-02T13:30:00Z',
    details: 'Program: Bakti Sosial & Literasi Digital di Desa Binaan Boyolali',
  },
  {
    id: 'LOG-006',
    userName: 'Siti Rahayu',
    userRole: 'SEKRETARIS_UMUM',
    action: 'Mengunggah Dokumen Resmi ke BEM Vault',
    module: 'Vault',
    timestamp: '2026-02-05T09:00:00Z',
    details: 'Dokumen: Template Resmi Proposal & Lembar Pengesahan BEM FKI UMS',
  },
];

// ─── LocalStorage State Helpers (Demo Mode) ──────────────────────────────────
const STORAGE_KEYS = {
  PROGRAMS: 'bem_track_mock_programs',
  ARCHIVES: 'bem_track_mock_archives',
  VAULT: 'bem_track_mock_vault',
  FINANCE: 'bem_track_mock_finance',
  TIMELINE: 'bem_track_mock_timeline',
  LOGS: 'bem_track_mock_logs',
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getMockPrograms(): Program[] {
  return safeGet(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
}

export function saveMockPrograms(programs: Program[]): void {
  safeSet(STORAGE_KEYS.PROGRAMS, programs);
}

export function getMockArchives(): Document[] {
  return safeGet(STORAGE_KEYS.ARCHIVES, INITIAL_ARCHIVES);
}

export function saveMockArchives(docs: Document[]): void {
  safeSet(STORAGE_KEYS.ARCHIVES, docs);
}

export function getMockVault(): VaultDocument[] {
  return safeGet(STORAGE_KEYS.VAULT, INITIAL_VAULT);
}

export function saveMockVault(docs: VaultDocument[]): void {
  safeSet(STORAGE_KEYS.VAULT, docs);
}

export function getMockTransactions(): FinanceTransaction[] {
  return safeGet(STORAGE_KEYS.FINANCE, INITIAL_TRANSACTIONS);
}

export function saveMockTransactions(txs: FinanceTransaction[]): void {
  safeSet(STORAGE_KEYS.FINANCE, txs);
}

export function getMockTimeline(): TimelineEvent[] {
  return safeGet(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
}

export function saveMockTimeline(events: TimelineEvent[]): void {
  safeSet(STORAGE_KEYS.TIMELINE, events);
}

export function getMockActivityLogs(): ActivityLog[] {
  return safeGet(STORAGE_KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
}

export function addMockActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
  const current = getMockActivityLogs();
  const newLog: ActivityLog = {
    ...log,
    id: 'LOG-' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
  };
  safeSet(STORAGE_KEYS.LOGS, [newLog, ...current]);
}

export function resetMockData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_PROGRAMS));
  localStorage.setItem(STORAGE_KEYS.ARCHIVES, JSON.stringify(INITIAL_ARCHIVES));
  localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(INITIAL_VAULT));
  localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(INITIAL_TIMELINE));
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
}
