# Dataset wilayah untuk seeder

`wilayah.json` adalah snapshot data referensi yang dibawa bersama repository. File ini hanya dibaca oleh `python manage.py seed_wilayah`; frontend Company mengambil pilihan melalui `/api/regions/provinces/`, `/api/regions/cities/`, dan `/api/regions/postal-codes/?city_code=...` dari tabel database.

## Sumber langsung

- Provinsi dan kabupaten/kota: katalog existing `frontend/src/data/provinsi.json` dan `frontend/src/data/kabupaten_kota.json` pada QontakSalesV1, identik dengan katalog QontakSalesVersion2 saat snapshot dibuat.
- Kecamatan dan kelurahan: dataset existing QontakSales, `frontend/public/data/kecamatan.json` dan `frontend/public/data/kelurahan/*.json`.
- Kode pos per kelurahan: dataset existing QontakSalesVersion2, `backend/qontak_sales/apps/regions/management/commands/kodepos.json`.

Data dari sumber langsung tersebut sudah disalin ke `wilayah.json`. Tim tidak membutuhkan folder QontakSales atau QontakSalesVersion2 untuk menjalankan seeder. Tidak ada download GitHub atau API luar saat seed/runtime. Identitas kelurahan dicocokkan secara persis; tidak ada lokasi dummy, pergantian kode wilayah, atau kode pos hasil tebakan.

Checksum dataset SHA-256: `8343aa8119a13ffc9855f1c6e9a0776c1411d6c23a8a7c154118ec3e901f7995`.

Asal upstream dan lisensi dataset warisan belum dicatat secara terverifikasi di repository sumber. Dokumentasi ini tidak mengklaim data resmi terkini atau lisensi MIT; konfirmasi hak redistribusi sebelum menerbitkan snapshot ini secara publik.

## Isi snapshot

| Jenis | Jumlah |
| --- | ---: |
| Provinsi | 38 |
| Kabupaten/kota | 514 |
| Kecamatan | 7.277 |
| Kelurahan/desa | 83.762 |
| Kelurahan dengan kode pos | 83.021 |
| Kelurahan tanpa kode pos dalam sumber | 741 |

Nilai kode pos yang tidak tersedia dibiarkan kosong. Khusus Tambrauw (`96.09`) dan Maybrat (`96.10`), snapshot sumber belum menyediakan kode pos; API mengembalikan daftar kosong dan form menampilkan bahwa pilihan belum tersedia. Kode pos wilayah lain tidak digunakan sebagai pengganti.

## Menyiapkan database

Dari folder `backend`, aktifkan virtual environment dan isi konfigurasi database sendiri di `.env`, lalu jalankan:

```bash
python manage.py migrate
python manage.py seed_wilayah --dry-run
python manage.py seed_wilayah
```

`--dry-run` memvalidasi kode, relasi, dan rencana penambahan tanpa menulis data. Seed menggunakan satu transaksi, menambah kode wilayah yang belum ada, dan tidak menghapus atau menimpa ID, nama, relasi, maupun kode pos existing yang sudah terisi. Jika terjadi kegagalan penulisan, seluruh perubahan dalam seed dibatalkan. Menjalankan ulang aman dan tidak membuat duplikat.

Untuk memasukkan mapping kode pos tambahan yang sudah diverifikasi:

```bash
python manage.py seed_wilayah --kodepos /path/to/kodepos.json
```

Format mapping adalah object JSON, misalnya kode kelurahan sebagai key dan kode pos lima digit sebagai string. Kode kelurahan harus ada dalam snapshot. Format yang tidak valid ditolak, bukan diperbaiki diam-diam. Tambahan tersebut hanya mengisi nilai database yang kosong; nilai existing tetap dipertahankan.

Seed tidak membuat tabel baru, tidak mengganti data perusahaan/user, dan tidak melakukan commit atau push Git.
