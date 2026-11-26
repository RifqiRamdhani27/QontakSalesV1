# ROADMAP PENGEMBANGAN V2
**Enterprise ERP & Financial Accounting Platform**
Dokumen ini adalah **peta jalan (roadmap)** panduan kerja untuk tim pengembang dan anak magang **Versi 2 (V2)**. Di sini dijelaskan gambaran umum status proyek saat ini, apa yang sudah siap, apa yang masih perlu dibuat, dan **urutan prioritas pengerjaan dari awal sampai akhir**.

>**Catatan Penting untuk Tim V2:**  
> 1. **UI/UX Frontend (100% Selesai):** Seluruh tampilan form, tabel, modal, dan kalkulasi visual sudah siap di V1. Tugas V2 adalah **menghidupkan fitur (Backend, CRUD Database, dan Integrasi API)**.
> 2. **Standar API Frontend:** Selalu gunakan instance Axios dari `@/services/api` (`import api from "@/services/api"`). Jangan gunakan axios polos atau fetch biasa, karena `api` sudah otomatis menyisipkan token autentikasi JWT pada setiap request.
> 3. **Auto-Numbering Transaksi:** Input bertuliskan `[Auto]` di form frontend menandakan nomor transaksi harus di-generate otomatis oleh backend secara berurutan dan unik saat disimpan (contoh: `JV-2026/11/0001`, `EXP-2026/11/0001`, `INV-2026/11/0001`).

---

## 1. Status Saat Ini (Hasil Pencapaian V1)
| Bagian | Status | Keterangan |
| :--- | :---: | :--- |
| **Frontend UI/UX** | ✅ **Selesai (100%)** | Seluruh halaman, form input, tabel, modal, datepicker, kalkulasi baris UI, dan Dark Mode sudah selesai dibuat menggunakan React 19 + Chakra UI v3. |
| **Master Data (Backend)** | ✅ **Selesai** | Model database, serializer, dan data seeder untuk **Kontak, Produk, dan COA** sudah dibuat di Django 5.1. |
| **Logika Transaksi (Backend)** | ⏳ **Belum (Tugas V2)** | Penjualan, Pembelian, Biaya, dan Jurnal Umum belum memiliki tabel transaksi dan endpoint API di backend. |
| **Jurnal Otomatis (*Ledger*)** | ⏳ **Belum (Tugas V2)** | Mekanisme pencatatan otomatis debit-kredit ke COA saat transaksi disimpan belum dibuat. |

---

## 2. Modul yang SUDAH Siap & Bisa CRUD (Master Data)
Fondasi terpenting ERP adalah **Master Data**. Di proyek ini, master data sudah dibuatkan struktur backend dan data awalnya (*seeder*):

  ### 1. Autentikasi & Pengguna (`accounts`)
  * **Route Halaman Frontend:** `/login`, `/register`, `/settings`
  * **Folder Backend:** `backend/qontak_sales/apps/accounts/`
  * **Status:** Registrasi, login (JWT), hak akses (Manager, Agent, Admin) sudah siap.

  ### 2. Daftar Akun / COA (`coa` & `accounts_coa`)
  * **Route Halaman Frontend:** `/daftar-akun` (`DaftarAkunPage.jsx`)
  * **Folder Backend:** `backend/qontak_sales/apps/coa/` & `accounts_coa/`
  * **Status:** Struktur hierarki akun (Aset, Kewajiban, Modal, Pendapatan, Beban) sudah dibuat.

  ### 3. Kontak Pelanggan & Vendor (`contacts` & `customers`)
  * **Route Halaman Frontend:** `/contact` (`ContactPage.jsx`), `/main-contact/buat-kontak`
  * **Folder Backend:** `backend/qontak_sales/apps/contacts/` & `customers/`
  * **Status:** Database untuk menyimpan data Pelanggan (*Customer*) dan Pemasok (*Vendor/Supplier*) sudah siap.

  ### 4. Produk & Stok Barang (`products` & `inventory`)
  * **Route Halaman Frontend:** `/main-product/products` (`ProductsMain.jsx`), `/main-product/buat-produk`
  * **Folder Backend:** `backend/qontak_sales/apps/products/` & `inventory/`
  * **Status:** Database katalog barang, harga jual/beli, dan gudang sudah siap.


> **Cara Menyiapkan Database Master:**  
> Cukup jalankan migrasi dan seeder di folder `backend`:  
> ```bash
> python manage.py migrate
> python seed_all.py
> ```

---

## 3. Modul yang BELUM Ada Backend & CRUD-nya (Tugas V2)
Halaman-halaman berikut **tampilannya sudah ada**, tetapi tombol simpan dan tabelnya belum terhubung ke database:

| Modul | Halaman Frontend | Komponen File | Apa yang Kurang di Backend? |
| :--- | :--- | :--- | :--- |
| **Jurnal Umum** | `/jurnal-umum` | `JurnalUmumPage.jsx` | Tabel `JournalEntry` (Header) & `JournalItem` (Detail Debit/Kredit) + validasi balance. |
| **Biaya (Expenses)** | `/biaya/create` | `CreateBiayaPage.jsx` | Tabel `Expense` + pemotongan Kas/Bank & pembuatan jurnal beban otomatis. |
| **Kas & Bank** | `/kas-bank` | `KasBankPage.jsx` | Pencatatan mutasi kas masuk, kas keluar, dan transfer antar-rekening bank. |
| **Penjualan (Sales)** | `/penjualan/create` | `CreateSalesInvoicePage.jsx` | Tabel Faktur Penjualan, pengurangan stok produk, pencatatan piutang pelanggan, dan jurnal otomatis. |
| **Pembelian (Purchasing)** | `/pembelian/faktur/create` | `CreatePurchaseInvoice.jsx` | Tabel Faktur Pembelian, penambahan stok produk, pencatatan utang supplier, dan jurnal otomatis. |
| **Laporan Keuangan** | `/laporan/*` | `Neraca.jsx`, `LabaRugi.jsx`, `BukuBesar.jsx` | Query agregasi dinamis untuk membaca data buku besar dari tabel jurnal yang sudah terisi. |
| **Tutup Buku** | `/tutup-buku` | `TutupBukuPage.jsx` | Engine kalkulasi laba/rugi periode berjalan dan penguncian tanggal transaksi. |

---

## 4. Urutan Prioritas Pengerjaan V2 (Langkah demi Langkah)
Agar pengerjaan terarah dan tidak membingungkan, tim V2 **wajib mengikuti urutan prioritas** berikut dari nomor 1 sampai 5:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Fase 1: Jurnal Umum & Jurnal Otomatis (Jantung Transaksi Keuangan)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Fase 2: Transaksi Biaya (Expenses) & Mutasi Kas/Bank                   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Fase 3: Modul Penjualan & Piutang (Sales Invoice + Pengurangan Stok)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Fase 4: Modul Pembelian & Utang (Purchase Invoice + Penambahan Stok)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Fase 5: Laporan Keuangan Otomatis (Buku Besar, Laba Rugi, Neraca)      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Fase 1: Jurnal Umum (Paling Pertama Dikerjakan)
* **Alasan:** Tabel Jurnal Umum adalah **muara akhir** dari semua transaksi ERP. Sebelum kamu membuat Penjualan atau Pembelian, backend harus sudah punya "mesin" untuk mencatat Debit dan Kredit ke COA.
* **Target Backend:**
  1. Buat model `JournalEntry` (no transaksi, tanggal, memo, status) dan `JournalItem` (akun, debit, credit).
  2. Buat API `POST /api/journals/` dengan validasi: `Total Debit WAJIB == Total Kredit` (tolak jika ada selisih).
  3. Buat API `GET /api/journals/:id/` untuk mengambil data detail satu transaksi jurnal.
* **Target Frontend:**
  1. Sambungkan tombol *"Buat Jurnal Umum"* di `JurnalUmumPage.jsx` ke API `POST`.
  2. **Buat Halaman Baru: `DetailJurnalUmumPage.jsx` (Route: `/jurnal-umum/:id`)**:
     * Setelah user klik *"Buat Jurnal Umum"* dan API sukses menyimpan data, langsung redirect ke halaman detail ini: `navigate(`/jurnal-umum/${response.data.id}`)`.
     * **Fitur di Halaman Detail Jurnal Umum:**
       * **Header:** Nomor Jurnal (misal `#JV-2026/09/0001`), Tanggal Transaksi, dan Badge Status (`Tercatat / Posted`).
       * **Tombol Aksi Kanan Atas:**
         *  **Cetak / Unduh PDF** (Voucher Jurnal Umum resmi untuk arsip akunting).
         *  **Ubah (Edit)** (masuk kembali ke form edit untuk koreksi).
         *  **Tindakan Lainnya** (Dropdown: *Duplikasi Jurnal*, *Hapus / Void Jurnal*).
       * **Info Transaksi:** Tag, Memo keterangan, Nama pembuat transaksi, dan File Lampiran bukti.
       * **Tabel Rincian Akun:** Nomor & Nama Akun, Deskripsi, Kolom Debit, Kolom Kredit, serta baris Total Debit = Total Kredit di bawahnya.
       * **Navigasi:** Tombol kembali ke Daftar Akun (`/daftar-akun`) atau Laporan Jurnal (`/laporan/jurnal`).

### Fase 2: Biaya (Expenses) & Kas/Bank
* **Alasan:** Ini transaksi paling sederhana untuk pemanasan sebelum masuk ke Penjualan.
* **Target:**
  1. Buat API `POST /api/expenses/`.
  2. Saat biaya disimpan, backend **otomatis memanggil fungsi Jurnal**:
     * *Debit:* Akun Beban yang dipilih (misal: 6-60001 Beban Operasional).
     * *Kredit:* Akun Kas/Bank pembayar (misal: 1-10001 Kas Tunai).
  3. Sambungkan form `CreateBiayaPage.jsx`.

### Fase 3: Penjualan & Piutang (Sales)
* **Alasan:** Melibatkan relasi antar-tabel (Kontak Pelanggan + Katalog Produk + Manajemen Stok).
* **Target:**
  1. Buat API Faktur Penjualan (`POST /api/sales/invoices/`).
  2. Mengurangi stok produk di tabel `inventory` secara otomatis.
  3. Otomatis catat Jurnal:
     * *Debit:* Piutang Usaha (1-10100) atau Kas/Bank (jika langsung lunas).
     * *Kredit:* Pendapatan Penjualan (4-40100).
     * *Kredit:* Utang PPN Keluaran (jika faktur menggunakan pajak).
  4. Sambungkan form `CreateSalesInvoicePage.jsx`.

### Fase 4: Pembelian & Utang (Purchasing)
* **Target:**
  1. Buat API Faktur Pembelian (`POST /api/purchases/invoices/`).
  2. Menambah stok produk di tabel `inventory` secara otomatis.
  3. Otomatis catat Jurnal:
     * *Debit:* Persediaan Barang (1-10200) atau Akun Beban Terkait.
     * *Debit:* PPN Masukan (jika ada pajak pembelian).
     * *Kredit:* Utang Usaha (2-20100) atau Kas/Bank.
  4. Sambungkan form `CreatePurchaseInvoice.jsx`.

### Fase 5: Laporan Keuangan & Tutup Buku (Paling Terakhir)
* **Alasan:** Laporan keuangan tidak bisa dibuat kalau transaksi di Fase 1–4 belum ada datanya.
* **Target:**
  1. API **Buku Besar (`/laporan/buku-besar`)**: Menampilkan histori mutasi debit-kredit per akun COA.
  2. API **Laba Rugi (`/laporan/laba-rugi`)**: Menjumlahkan total Pendapatan dikurangi total Beban.
  3. API **Neraca (`/laporan/neraca`)**: Menghitung Aset = Kewajiban + Ekuitas.
  4. Sambungkan data API ke halaman laporan yang sudah ada di frontend.

---

## 5. Langkah Selanjutnya
1. **Baca Blueprint Modul:**  
   Sebelum mulai ngoding suatu modul, buka dokumen cetak birunya (misal: `BLUEPRINT_JURNAL.md`, `BLUEPRINT_SALES.md`) untuk melihat struktur field database dan contoh request/response JSON-nya.
2. **Patuhi Aturan Git:**  
   Selalu buat branch baru dengan nama panggilan sendiri:  
   ```bash
   git checkout -b <nama-kamu>
   ```  
   **Jangan pernah langsung push ke branch `main`!**
