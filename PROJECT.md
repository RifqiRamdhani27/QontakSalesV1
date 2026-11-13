# PRODUCT REQUIREMENT DOCUMENT (PRD)

| **Project Name** | **Enterprise ERP & Financial Accounting Platform** |
| :--- | :--- |
| **Project Lead** | **Rifqi** (Ketua Proyek) |
| **Team Members** | **Fathan**, **Freza** |
| **Tech Stack** | **Backend:** Django REST Framework (DRF), PostgreSQL <br>**Frontend:** React 19 (Vite), Chakra UI v3, Phosphor Icons, Chart.js |
| **Document Version**| 2.0 (Full ERP & Accounting Suite) |

---

## 1. Executive Summary & Objective

Platform ini adalah sistem **Enterprise Resource Planning (ERP) & Akuntansi Finansial Perusahaan** terpadu yang dirancang untuk mengotomatisasi seluruh siklus keuangan, operasional, dan manajerial bisnis dalam satu ekosistem modern.

Sistem ini mentransformasi pembukuan manual menjadi otomatis, mulai dari pencatatan transaksi harian, manajemen kas & bank, jurnal umum, buku besar, hingga rekonsiliasi akhir periode melalui fitur tutup buku otomatis dan penyusunan laporan keuangan berstandar akuntansi (Neraca, Laba Rugi, Arus Kas, dan Perubahan Modal).

---

## 2. Struktur Tim & Pembagian Peran

* **Ketua Proyek:** **Rifqi**  
  *Bertanggung jawab atas arsitektur sistem, integrasi modul keuangan (COA, Jurnal Umum, Tutup Buku, Laporan Keuangan), manajemen basis data, code review, dan deployment.*
* **Anggota Proyek:**
  * **Fathan** — *Pengembangan modul operasional & frontend (Produk, Produksi, Pemenuhan, Manajemen Kontak, Pengaturan, dan UI/UX interaktif).*
  * **Freza** — *Pengembangan modul transaksi & penganggaran (Penjualan, Pembelian, Biaya,  Kas & Bank, serta integrasi Database-nya).*

---

## 3. Matriks Pengguna & Hak Akses (Role Matrix)

1. **Manager / Director (Full Access):**
   - Memiliki wewenang penuh atas seluruh modul keuangan dan operasional.
   - Melakukan persetujuan anggaran, proses **Tutup Buku**, analisis laporan keuangan komprehensif, serta manajemen akun staf.
2. **Staff / Akuntan / Operator (Restricted Access):**
   - Menginput transaksi harian (penjualan, pembelian, biaya, jurnal umum, kas masuk/keluar).
   - Memperbarui status produksi dan persediaan barang sesuai wewenang tugasnya.

---

## 4. Modul Utama Sistem (Core Modules)

### 📊 1. Dashboard & Analitik Eksekutif
* **KPI Metrics:** Ringkasan real-time total kas & bank, pendapatan, pengeluaran, laba bersih, serta status operasional.
* **Tren Finansial & Grafik:** Visualisasi interaktif grafik arus kas bulanan, rasio profitabilitas produk, dan perputaran persediaan.

### 📑 2. Daftar Akun (Chart of Accounts - COA)
* **Struktur Hierarki Akun:** Klasifikasi standar akun Akuntansi: Aset, Liabilitas, Ekuitas, Pendapatan, dan Beban.
* **Jurnal Umum (General Journal):** Pencatatan *double-entry* debit-kredit terverifikasi otomatis seimbang (*balanced*).
* **Tutup Buku Otomatis:** Fitur kalkulasi laba/rugi periode berjalan, penyesuaian saldo akun riil & nominal, serta penguncian transaksi periode lampau.

### 🏦 3. Kas & Bank
* Monitoring seluruh rekening bank dan kas tunai perusahaan secara tersentralisasi.
* Pencatatan transaksi mutasi kas masuk (*cash-in*), kas keluar (*cash-out*), dan transfer antar-rekening.

### 📈 4. Laporan Keuangan Berstandar Akuntansi
Modul laporan terintegrasi langsung dari buku besar:
* **Neraca (Balance Sheet):** Posisi aset, kewajiban, dan modal perusahaan.
* **Laba Rugi (Income Statement):** Analisis pendapatan vs beban operasional.
* **Arus Kas (Cash Flow Statement):** Arus kas metode langsung/tidak langsung dari aktivitas operasi, investasi, dan pendanaan.
* **Laporan Perubahan Modal:** Pergerakan ekuitas awal, laba/rugi bersih, dividen/prive, hingga ekuitas akhir.
* **Buku Besar & Neraca Saldo:** Penelusuran riwayat per akun secara rinci.
* **Laporan Penjualan & Pembelian:** Analisis performa per pelanggan, supplier, dan komoditas produk.

### 💰 5. Anggaran & Biaya (Budgeting & Expenses)
* **Manajemen Anggaran:** Penyusunan target alokasi anggaran per departemen/kategori biaya.
* **Rincian Anggaran vs Realisasi:** Tracking real-time persentase penyerapan anggaran dengan indikator visual.
* **Pencatatan Biaya:** Dokumentasi pengeluaran operasional perusahaan secara transparan.

### 🏷️ 6. Penjualan & Piutang (Sales & Receivables)
* Pengelolaan Faktur Proforma, Tagihan Penjualan, dan Tukar Faktur.
* **Monitoring Piutang Pelanggan:** Pengelompokan usia piutang (*Aging Receivables*) untuk mengantisipasi risiko kredit macet.

### 🛒 7. Pembelian & Utang (Purchasing & Payables)
* Pencatatan pesanan pembelian (*Purchase Order*) dan faktur supplier.
* **Monitoring Utang Usaha:** Pelacakan jatuh tempo pembayaran kepada pihak supplier (*Aging Payables*).

### 📦 8. Produk & Manajemen Aset (Assets & Inventory)
* **Katalog Produk:** Manajemen harga beli, harga jual, dan stok barang.
* **Pencatatan Aset Tetap:** Dokumentasi nilai perolehan, masa manfaat, dan akumulasi penyusutan aset perusahaan.

### 🏭 9. Produksi & Pemenuhan (Manufacturing & Fulfillment)
* Alur manufaktur barang dari bahan baku hingga barang jadi.
* Pemenuhan pesanan (*Order Fulfillment*) dan tracking pengiriman ke konsumen.

---

## 5. Arsitektur Teknis

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React 19 + Vite)               │
│                UI: Chakra UI v3 + Phosphor Icons            │
│                      http://localhost:5173                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (JSON / Axios)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 Backend (Django REST Framework)              │
│                      http://localhost:8000                   │
│                                                             │
│  ┌───────────────┐ ┌────────────────┐ ┌───────────────────┐ │
│  │    Accounts   │ │   Accounting   │ │  Cash & Banking   │ │
│  │  (Auth, JWT)  │ │ (COA, Journal) │ │  (Transactions)   │ │
│  └───────────────┘ └────────────────┘ └───────────────────┘ │
│  ┌───────────────┐ ┌────────────────┐ ┌───────────────────┐ │
│  │ Sales/Purchas.│ │ Assets/Inventory││ Financial Reports │ │
│  └───────────────┘ └────────────────┘ └───────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ PostgreSQL Connection
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│         ACID-compliant relational financial schemas         │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Standar Kualitas & Keamanan Data
* **Data Integrity:** Validasi *double-entry bookkeeping* pada backend; debit dan kredit harus selalu imbang sebelum commit ke basis data.
* **Audit Trail:** Setiap aktivitas mutasi keuangan mencatat stempel waktu (*timestamp*) dan identitas pengguna pembuat transaksi.
* **Dark Mode & Responsive UI:** Antarmuka ergonomis dengan dukungan mode gelap (*Dark Mode*) untuk kenyamanan penggunaan intensif oleh staf akuntansi dan manajemen.
