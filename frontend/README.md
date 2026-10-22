# BEM-Track Frontend

Frontend website **BEM-Track** &mdash; Sistem Informasi Tracking Progres Program Kerja dan Transparansi Birokrasi BEM Fakultas Komunikasi dan Informatika (FKI) Universitas Muhammadiyah Surakarta (UMS).

> **Judul Skripsi:**  
> *"Development of BEM-Track: An Information System for Tracking Progress and Ensuring Transparency in BEM Bureaucracy Based on IndoBERT's Multi-Label Automatic Classification."*

---

## 1. Identitas Visual & Desain

Desain BEM-Track dikembangkan secara spesifik untuk lingkungan organisasi mahasiswa formal namun hangat, profesional, dan efisien:

- **Primary Maroon (`#6E2639`)**: Warna identitas utama BEM, digunakan pada emblem logo, active navigation, tombol aksi utama, dan aksen penting.
- **Dark Maroon (`#4B1828`)**: Hover state dan penekanan kontras.
- **Soft Maroon (`#8A4658` / `#F5EEF0`)**: Latar badge aktif dan aksen pendukung.
- **Cream Background (`#F3EBDD` / `#FAF7F1`)**: Latar belakang lembut yang nyaman dibaca dan tidak silau.
- **Surface White (`#FFFFFF`)**: Bidang formulir, tabel administratif, dan card ringkasan.
- **Primary Text (`#352A28`)**: Teks utama dengan kontras tinggi yang nyaman dibaca.
- **Secondary Text (`#8A817B`)**: Teks keterangan, metadata, dan tanggal.
- **Border (`#E8E0D7`)**: Pemisah struktur antarmuka yang rapi dan konsisten tanpa bayangan berlebihan.

---

## 2. Fitur & Modul Halaman

| Modul | Rute | Deskripsi |
|---|---|---|
| **Login** | `/login` | Autentikasi pengurus dengan pemilih role demo instan (4 role utama + Admin). |
| **Dashboard** | `/dashboard` | Ringkasan 4 metrik utama, daftar proker perlu perhatian, mutasi kas, dan agenda terdekat. |
| **Program Kerja** | `/programs`<br>`/programs/create`<br>`/programs/[id]`<br>`/programs/[id]/edit` | Daftar proker berbasis tabel, formulir usulan proker, instrumen RAB, dan stepper verifikasi birokrasi. |
| **Verifikasi** | `/verifications`<br>`/verifications/[id]` | Antrean verifikasi bertingkat: Administrasi (Sekum), Anggaran (Bendum), dan Eksekutif (Gubernur). |
| **Arsip Dokumen** | `/archives`<br>`/archives/upload`<br>`/archives/[id]` | Document Management System untuk proposal, LPJ, RAB, dan notulensi (pemisahan status Final vs Draft). |
| **BEM Vault** | `/vault`<br>`/vault/upload`<br>`/vault/[id]` | Repositori master AD/ART, SK Kepengurusan, GBHK, dan template resmi naskah dinas. |
| **Kas Organisasi** | `/finance`<br>`/finance/create`<br>`/finance/[id]` | Pembukuan kas masuk/keluar, saldo kas real-time dalam format Rupiah (akses wewenang Bendahara). |
| **Kalender Agenda** | `/timeline`<br>`/timeline/create` | Daftar agenda kegiatan organisasi yang mudah dipindai dengan badge tanggal dan lokasi. |
| **Log Aktivitas** | `/activity-logs` | Rekam jejak audit trail seluruh aktivitas fungsionaris secara read-only. |
| **Manajemen User** | `/users`<br>`/users/create` | Daftar fungsionaris, penetapan wewenang birokrasi, dan modal konfirmasi reset kredensial. |

---

## 3. Matriks Hak Akses (Role-Based Bureaucracy)

Hak akses dikendalikan secara terpusat pada file [`src/lib/permissions.ts`](src/lib/permissions.ts):

| Menu | Departemen Pelaksana | Bendahara Umum | Sekretaris Umum | Gubernur / Wagub |
|---|---|---|---|---|
| **Dashboard** | Lihat | Lihat | Lihat | Lihat |
| **Programs** | Ajukan & Revisi | Ajukan & Revisi | Ajukan & Revisi | Pantau Semua |
| **Verifikasi Administrasi** | Pantau Hasil | Pantau Hasil | **Verifikasi & Sahkan** | Pantau Hasil |
| **Verifikasi Anggaran** | Pantau Hasil | **Verifikasi & Sahkan** | Pantau Hasil | Pantau Hasil |
| **Verifikasi Eksekutif** | Pantau Hasil | Pantau Hasil | Pantau Hasil | **Setujui Final** |
| **Arsip Dokumen** | Upload & Kelola | Lihat Final | Upload & Kelola | Lihat Final |
| **BEM Vault** | Lihat & Unduh | Lihat & Unduh | **Kelola & Upload** | Lihat & Unduh |
| **Kas Organisasi** | Ringkasan Dashboard | **Kelola Transaksi** | Ringkasan Dashboard | Ringkasan Dashboard |
| **Kalender Agenda** | Kelola Agenda Terkait | Kelola Agenda Terkait | Kelola Agenda Terkait | Lihat Agenda |
| **Log Aktivitas** | Sesuai Izin | Sesuai Izin | Sesuai Izin | Lihat Lengkap |
| **Manajemen User** | Dibatasi | Dibatasi | Dibatasi | Sesuai Kewenangan |

---

## 4. Akun Demo untuk Pengujian Antarmuka

Seluruh akun demo menggunakan kata sandi: `demo123`

1. **Gubernur BEM**: `gubernur@bem.ums.ac.id` (Ahmad Fauzi)
2. **Sekretaris Umum**: `sekum@bem.ums.ac.id` (Siti Rahayu)
3. **Bendahara Umum**: `bendum@bem.ums.ac.id` (Budi Santoso)
4. **Departemen Pelaksana I**: `dept.akademik@bem.ums.ac.id` (Rina Dewi)
5. **Departemen Pelaksana II**: `dept.kewirausahaan@bem.ums.ac.id` (Hendra Wijaya)
6. **Administrator Sistem**: `admin@bem.ums.ac.id` (Admin Sistem)

> **Fitur Ganti Role Cepat:**  
> Selama sesi demo, Anda dapat berpindah peran secara instan melalui tombol **"Ganti Peran"** pada banner atas atau menu profil di topbar tanpa harus logout ulang.

---

## 5. Status Klasifikasi Otomatis IndoBERT (Multi-Label)

Pada tahap frontend ini, layanan NLP IndoBERT berstatus **Standby / Belum Terhubung**.  
Seluruh penanda kategori ditampilkan secara transparan dan jujur ("Layanan klasifikasi belum tersedia" / "Standby"), tanpa membuat data akurasi atau prediksi palsu. Modul ini telah dipersiapkan dengan kontrak tipe data TypeScript (`IndoBERTTag`, `ProgramCategory`) yang siap dihubungkan ke endpoint backend Python (FastAPI/PyTorch) pada tahap integrasi berikutnya.

---

## 6. Cara Menjalankan Frontend

### Prasyarat
- Node.js versi 18 ke atas (direkomendasikan Node.js 20+)
- npm atau pnpm

### Langkah Instalasi & Menjalankan

1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka peramban di:
   ```
   http://localhost:3000
   ```

5. Untuk memeriksa kualitas kode (linting):
   ```bash
   npm run lint
   ```

6. Untuk membangun bundel produksi:
   ```bash
   npm run build
   ```
