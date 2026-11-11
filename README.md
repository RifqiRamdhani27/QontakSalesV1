<div align="center">

# Enterprise ERP & Financial Accounting Platform

**Solusi Terpadu Manajemen Keuangan, Pembukuan Akuntansi, dan Operasional Bisnis Perusahaan**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.1-092E20?style=flat&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-v3-319795?style=flat&logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## Tim Pengembang

Platform ini dikembangkan secara kolaboratif oleh:

*  **Ketua Proyek:** **Rifqi**  
  *Lead Architecture, Financial Engine (COA, Jurnal Umum, Tutup Buku, Laporan Keuangan), Database Management & Fullstack Integration.*
*  **Anggota Tim:**
  * **Fathan** — *Modul Operasional & Frontend UI/UX (Produk, Produksi, Pemenuhan, Manajemen Kontak).*
  * **Freza** — *Modul Transaksi & Anggaran (Penjualan, Pembelian, Kas & Bank, Biaya, Anggaran).*

---

## Fitur Utama Sistem

Platform ini menyediakan rangkaian modul lengkap untuk memenuhi kebutuhan siklus akuntansi dan operasional perusahaan:

| Modul | Deskripsi Fitur |
|---|---|
| ** Dashboard & Beranda** | Ringkasan analitik real-time posisi kas/bank, pendapatan, beban operasional, dan laba bersih perusahaan. |
| ** Daftar Akun (COA)** | Pengelolaan Chart of Accounts hierarkis (Aset, Liabilitas, Ekuitas, Pendapatan, dan Beban). |
| ** Tutup Buku Otomatis** | Proses rekonsiliasi akhir periode, kalkulasi laba/rugi berjalan, dan penguncian transaksi historis. |
| ** Jurnal Umum** | Pencatatan transaksi akuntansi debit-kredit dengan validasi keseimbangan (*balanced balance*). |
| ** Kas & Bank** | Manajemen rekening bank dan kas fisik, mutasi kas masuk/keluar, serta transfer antar-kas. |
| ** Laporan Keuangan** | Laporan Neraca (*Balance Sheet*), Laba Rugi (*Income Statement*), Arus Kas (*Cash Flow*), Laporan Perubahan Modal, Buku Besar, dan Neraca Saldo. |
| ** Anggaran & Biaya** | Perencanaan alokasi anggaran departemen, rincian realisasi pengeluaran, dan pencatatan biaya operasional. |
| ** Penjualan & Piutang** | Faktur penjualan, proforma invoice, tukar faktur, dan pemantauan penuaan piutang pelanggan (*Aging Receivables*). |
| ** Pembelian & Utang** | Pemesanan pembelian (PO), pencatatan faktur vendor/supplier, dan tracking jatuh tempo utang usaha. |
| ** Manajemen Aset Tetap** | Registrasi aset, monitoring nilai perolehan, masa manfaat, dan kalkulasi akumulasi penyusutan. |
| ** Produksi & Pemenuhan** | Manajemen alur produksi barang dari bahan baku hingga pemenuhan pesanan (*Fulfillment*) pelanggan. |
| ** Dark Mode & Responsif** | Dukungan tampilan tema gelap (*Dark Mode*) |

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite 6
- **UI Library:** Chakra UI v3
- **Icons:** Phosphor Icons
- **Charts:** Chart.js & react-chartjs-2
- **State & Routing:** React Router DOM v7
- **HTTP Client:** Axios (dengan JWT token interceptor)

### Backend
- **Framework:** Django 5.1 + Django REST Framework (DRF)
- **Database:** PostgreSQL 16
- **Authentication:** JSON Web Tokens (SimpleJWT)
- **Architecture:** Modul-modul terisolasi (*Accounts, COA, Inventory, Products, Contacts, Reports*)

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React 19 + Vite)               │
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
│         Relational Financial Data with ACID Compliance      │
└─────────────────────────────────────────────────────────────┘
```

---

## Struktur Proyek

```
QontakSales/
├── backend/                        # Django REST API
│   ├── qontak_sales/
│   │   ├── apps/
│   │   │   ├── accounts/           # User Auth, Role & Perusahaan
│   │   │   ├── coa/                # Chart of Accounts, Jurnal & Buku Besar
│   │   │   ├── accounts_coa/       # Pemetaan relasi akun
│   │   │   ├── contacts/           # Data vendor & pelanggan
│   │   │   ├── products/           # Manajemen katalog produk
│   │   │   ├── inventory/          # Manajemen persediaan & stok
│   │   │   └── pricerules/         # Aturan harga jual/beli
│   │   ├── settings.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/                       # React Single Page Application (SPA)
│   ├── src/
│   │   ├── pages/                  # Halaman aplikasi
│   │   │   ├── Main-Beranda/       # Halaman Beranda
│   │   │   ├── Main-Dashboard/     # Dashboard Analitik Finansial
│   │   │   ├── Main-DaftarAkun/    # COA, Jurnal Umum, Tutup Buku
│   │   │   ├── Main-KasBank/       # Kas & Bank
│   │   │   ├── Main-Laporan/       # Neraca, Laba Rugi, Arus Kas, Perubahan Modal
│   │   │   ├── Main-Anggaran/      # Rencana Anggaran & Realisasi
│   │   │   ├── Main-Biaya/         # Pencatatan Biaya
│   │   │   ├── Main-Aset/          # Manajemen Aset Tetap
│   │   │   ├── Main-Product/       # Produk & Katalog
│   │   │   ├── Main-Productions/   # Alur Produksi
│   │   │   ├── Main-Fulfillment/   # Pemenuhan Pesanan
│   │   │   ├── LoginPage.jsx       # Autentikasi Masuk
│   │   │   └── RegisterPage.jsx    # Registrasi Pengguna
│   │   ├── components/layout/      # Sidebar, TopBar, MainLayout
│   │   ├── services/api.js         # Axios instance & interceptors
│   │   └── assets/                 # Aset grafis & logo
│   ├── package.json
│   └── vite.config.js
├── PROJECT.md                      # Product Requirements Document (PRD)
└── README.md                       # Dokumentasi Utama Proyek
```

---

## Panduan Menjalankan Proyek

### Prasyarat Sistem
- **Node.js:** Versi 18+ (disarankan Node 20+)
- **Python:** Versi 3.11 - 3.13
- **PostgreSQL:** Versi 15+

### 1. Menjalankan Backend (Django)

```bash
cd backend

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependensi
pip install -r requirements.txt

# Jalankan migrasi basis data
python manage.py migrate

# Buat akun Superuser / Admin
python manage.py createsuperuser

# Jalankan server API
python manage.py runserver 8000
```
Backend akan aktif di: `http://localhost:8000`

### 2. Menjalankan Frontend (React + Vite)

Buka terminal baru:

```bash
cd frontend

# Install dependensi paket
npm install
# atau
pnpm install

# Jalankan server development
npm run dev
# atau
pnpm run dev
```
Frontend akan aktif di: `http://localhost:5173`

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT License** — Anda bebas menggunakan, memodifikasi, dan mendistribusikan perangkat lunak ini untuk keperluan pengembangan internal maupun komersial.
