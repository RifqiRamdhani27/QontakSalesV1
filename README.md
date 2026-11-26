<div align="center">

# Enterprise ERP & Financial Accounting Platform
**Solusi Terpadu Manajemen Keuangan, Pembukuan Akuntansi, dan Operasional Bisnis Perusahaan**
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.1-092E20?style=flat&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-v3-319795?style=flat&logo=chakraui&logoColor=white)](https://chakra-ui.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
</div>


## Panduan Instalasi & Setup Cepat
Ikuti langkah-langkah berikut secara berurutan setelah melakukan clone dari GitHub:
1.  **Buka folder proyek di IDE (Antigravity / VS Code).**
2.  **Jika sudah Masuk ke folder proyek, buka terminal, lalu ketik tahapan tahapan dibawah:**
    cd QontakSales
3.  **Masuk ke folder backend:**
    cd backend
4.  **Salin file konfigurasi environment:**
    copy .env.example .env
5.  **Sesuaikan nama DB & Password PostgreSQL** di dalam file `.env` yang baru dibuat.
6.  **Buat dan aktifkan virtual environment (digabung bersama):**
    python -m venv venv && .\venv\Scripts\activate
7.  **Install dependensi & requests:**
    pip install -r requirements.txt
    pip install requests
8.  **Install Pillow:**
    pip install Pillow
9.  **Migrasi database, seeder data, dan jalankan server backend:**
    python manage.py makemigrations
    python manage.py migrate
    python seed_all.py
    python manage.py runserver 8000
    *Backend aktif di: `http://localhost:8000`*
11. **Buka terminal baru (split atau tab baru):**
    cd frontend
12. **Salin file environment frontend:**
    copy .env.example .env
13. **Install paket dependensi frontend:**
    npm install
14. **Jalankan development server frontend:**
    npm run dev
    *Frontend aktif di: `http://localhost:5173`*


> [!IMPORTANT]
> **Aturan Branching Git (Wajib Dibaca Sebelum Mulai Ngoding):**
> **Jangan pernah langsung ngoding atau commit di branch `main`!**
> 1. Buat branch baru dengan nama panggilan sendiri sebelum mulai ngoding
> 2. Lakukan semua pengerjaan koding, commit, dan push di branch pribadi tersebut
>    git add .
>    git commit -m "Deskripsi perubahan yang dikerjakan"
>    git push origin <nama-panggilan-kamu>
> 3. Setelah fitur selesai dan dipastikan aman/tidak error, baru lakukan **merge ke branch `main`** dengan update-an dari branch kamu (atau via Pull Request).


## Tim Pengembang
Platform ini dikembangkan secara kolaboratif oleh:
*  **Ketua Proyek:** **Rifqi**  
  *Lead Architecture, Financial Engine (COA, Jurnal Umum, Tutup Buku, Laporan Keuangan), Database Management & Fullstack Integration.*
*  **Anggota Tim:**
 **Fathan** — *Modul Operasional & Frontend UI/UX (Produk, Produksi, Pemenuhan, Manajemen Kontak,   pengaturan, User & Company).*
 **Freza** — *Modul Transaksi & Anggaran (Penjualan, Pembelian, Kas & Bank, Biaya, Anggaran).*


## Dokumentasi & Spesifikasi Lengkap
Untuk penjelasan detail mengenai **Modul Bisnis, Fitur ERP, Arsitektur Sistem, Tech Stack, dan Struktur Direktori Folder**, silakan buka:
👉 **[PROJECT.md](PROJECT.md)** *(Product Requirement Document & Architecture Guide)*  
👉 **[ROADMAP_V2.md](ROADMAP_V2.md)** *(Peta Jalan & Panduan Prioritas Pengerjaan V2)*


### Prasyarat Sistem
- **Node.js:** Versi 18+ (disarankan Node 20+)
- **Python:** Versi 3.11 - 3.13
- **PostgreSQL:** Versi 15+


## Panduan Lanjutan & Konfigurasi
### 1. Menjadikan User Admin (Status `is_admin`)

Ada dua role di aplikasi ini: `MANAGER` (pemilik perusahaan) dan `AGENT`.
- **`MANAGER`** — akses penuh ke seluruh pengaturan **kecuali** Appearance.
- **`AGENT`** — akses sesuai peran kustom yang diberikan; Appearance selalu tertutup.

Di atas role itu ada status tambahan **admin** (`is_admin`), bukan role ketiga. Status admin bersifat **tambahan, bukan pengganti**: saat user dijadikan admin, role dan peran kustomnya tidak berubah sama sekali. Semua menu Settings yang tadinya bisa dibuka tetap bisa dibuka, lalu ditambah **Settings → Appearance**. Yang dikunci untuk admin hanya pengelolaan user biasa (undang/ubah/hapus) — itu tetap wewenang `MANAGER`.

Status admin **tidak bisa diberikan dari dalam aplikasi untuk pertama kali**. User harus sudah terdaftar lebih dulu (diundang lewat Pengaturan pengguna atau daftar sendiri), lalu kolom `is_admin` diubah manual lewat PostgreSQL. Setelah punya satu admin, admin itu bisa menjadikan user lain admin lewat **Settings → Pengaturan pengguna**.


#### Langkah lewat `psql`
```bash
# Masuk ke database (sesuaikan user, nama database, dan host dengan backend/.env)
psql -U qontak -d qontak_sales_v1 -h localhost
```
```sql
-- Lihat user yang ada beserta status adminnya
SELECT id, email, username, role, is_admin, status FROM accounts_customuser ORDER BY id;
-- Jadikan admin (ganti email dengan user yang dituju)
UPDATE accounts_customuser
SET is_admin = true
WHERE email = 'orang@perusahaan.com';
-- Cabut status admin
UPDATE accounts_customuser
SET is_admin = false
WHERE email = 'orang@perusahaan.com';
```
Atau satu baris tanpa masuk ke shell `psql`:
```bash
psql -U qontak -d qontak_sales_v1 -c \
  "UPDATE accounts_customuser SET is_admin = true WHERE email='orang@perusahaan.com';"


Verifikasi hasilnya:
```bash
psql -U qontak -d qontak_sales_v1 -c \
  "SELECT id, email, role, is_admin FROM accounts_customuser WHERE is_admin = true;"
```


Alternatif tanpa `psql` — lewat Django shell di folder `backend`:
```bash
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='orang@perusahaan.com')
user.is_admin = True
user.save(update_fields=['is_admin'])
print(user.email, user.role, user.is_admin)
"
```


#### Syarat agar admin benar-benar bisa masuk ke Appearance
1. Migrasi sudah dijalankan: `python manage.py migrate accounts` (migrasi `0009_customuser_is_admin`).
2. Kolom `is_admin` bernilai `true` — dicek dengan query di atas.
3. User punya `company_id` yang terisi, `status = 'active'`, dan `is_active = true`. Akun tanpa perusahaan atau nonaktif tetap ditolak walau `is_admin`-nya true.
4. User **login ulang**. JWT dan `localStorage.user_role` di browser masih menyimpan data lama; hak akses baru dibaca dari `GET /api/settings/access/` saat halaman Settings dibuka.

Setelah login ulang, menu **Appearance** muncul di sidebar Settings, dan tombol **Jadikan admin / Cabut admin** tersedia di kolom Tindakan pada daftar pengguna.


#### Aturan yang dijaga backend
- Hanya user dengan `is_admin = true` yang boleh membuka Appearance dan memanggil `POST /api/settings/members/<id>/set-admin/`.
- `MANAGER` tidak bisa menjadikan siapa pun admin, dan user `MANAGER` tidak bisa diubah status adminnya lewat endpoint itu.
- Admin tidak bisa mencabut status admin miliknya sendiri.
- User dengan `is_admin = true` dan user `MANAGER` tidak bisa dihapus dari daftar pengguna.
- Admin tetap memakai izin Settings lamanya (dari `role_config`/peran kustom) ditambah Appearance; admin tidak bisa mengundang, mengubah, atau menghapus user biasa.
- Perubahan status admin hanya berlaku pada company yang sama; user company lain menghasilkan `404`.


### Seed Data Wilayah
Seeder mengisi data provinsi, kabupaten/kota, kecamatan, kelurahan/desa, dan kode pos untuk dropdown alamat pada Settings → Perusahaan. Dataset sudah disertakan di `backend/qontak_sales/apps/regions/data/wilayah.json`; tidak perlu mengunduh data atau menyediakan folder proyek lain.
Pastikan dependensi backend sudah terpasang dan konfigurasi `DB_*` di `backend/.env` menunjuk database yang benar. Cadangkan database penting sebelum menjalankan seed. Dari root repository, jalankan:
```bash
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py seed_wilayah --dry-run
python manage.py seed_wilayah
```

Di Windows, ganti perintah aktivasi dengan `venv\Scripts\activate`. Jika terminal sudah berada di folder `backend` dengan virtual environment aktif, mulai dari `python manage.py migrate`.
- Migrasi mengisi data dasar provinsi dan kabupaten/kota. Jalankan `seed_wilayah` untuk melengkapi kecamatan, kelurahan/desa, dan kode pos.
- `--dry-run` memvalidasi kode, relasi, serta rencana perubahan tanpa menulis data. Periksa nama database dan rencana yang dicetak sebelum menjalankan seed sebenarnya.
- Seed menambah kode wilayah yang belum ada dan mengisi kode pos yang kosong. ID, nama, relasi, dan kode pos existing yang sudah terisi tidak ditimpa. Relasi yang bertentangan ditolak.
- Penulisan menggunakan satu transaksi; jika gagal, perubahan dalam seed dibatalkan. Command aman dijalankan ulang tanpa membuat duplikat dan tidak mengubah data perusahaan atau pengguna.
- Frontend membaca tabel database melalui `/api/regions/provinces/`, `/api/regions/cities/`, dan `/api/regions/postal-codes/?city_code=...`, bukan membaca file JSON secara langsung.
Untuk menambahkan mapping kode pos yang sudah diverifikasi, jalankan dari folder `backend`:
```bash
python manage.py seed_wilayah --kodepos /path/to/kodepos.json --dry-run
python manage.py seed_wilayah --kodepos /path/to/kodepos.json
```
File tambahan berupa object JSON dengan kode kelurahan sebagai key dan kode pos lima digit sebagai string. Kode kelurahan harus ada dalam snapshot. Format tidak valid ditolak, bukan diperbaiki otomatis; nilai database yang sudah terisi tetap dipertahankan.


#### Isi dan sumber dataset wilayah
| Jenis | Jumlah |
|-------|--------|
| Provinsi | 38 |
| Kabupaten/kota | 514 |
| Kecamatan | 7.277 |
| Kelurahan/desa | 83.762 |
| Kelurahan dengan kode pos | 83.021 |
| Kelurahan tanpa kode pos dalam sumber | 741 |
Kode pos yang tidak tersedia dibiarkan kosong. Snapshot belum menyediakan kode pos untuk Tambrauw (`96.09`) dan Maybrat (`96.10`); API mengembalikan daftar kosong dan form menampilkan bahwa pilihan belum tersedia, tanpa memakai kode pos wilayah lain sebagai pengganti.


Sumber langsung snapshot:
- Provinsi dan kabupaten/kota: katalog existing `frontend/src/data/provinsi.json` dan `frontend/src/data/kabupaten_kota.json` pada QontakSalesV1, identik dengan katalog QontakSalesVersion2 saat snapshot dibuat.
- Kecamatan dan kelurahan: dataset existing QontakSales, `frontend/public/data/kecamatan.json` dan `frontend/public/data/kelurahan/*.json`.
- Kode pos: dataset existing QontakSalesVersion2, `backend/qontak_sales/apps/regions/management/commands/kodepos.json`.
Semua sumber langsung tersebut sudah digabungkan ke `wilayah.json`. Tidak ada download GitHub atau API luar saat seed/runtime. Identitas kelurahan dicocokkan secara persis; tidak ada lokasi dummy, penggantian kode wilayah, atau kode pos hasil tebakan.
Checksum SHA-256 dataset: `8343aa8119a13ffc9855f1c6e9a0776c1411d6c23a8a7c154118ec3e901f7995`.
Asal upstream dan lisensi dataset warisan belum tercatat secara terverifikasi di repository sumber. Dataset ini tidak diklaim sebagai data resmi terkini atau otomatis berlisensi MIT; konfirmasi hak redistribusi sebelum menerbitkan snapshot secara publik.


## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi **MIT License** — Anda bebas menggunakan, memodifikasi, dan mendistribusikan perangkat lunak ini untuk keperluan pengembangan internal maupun komersial.
