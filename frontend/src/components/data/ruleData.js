const roleLabels = {
  Owner: "Pemilik",
  Ultimate: "Akses Penuh",
  Administrator: "Administrator",
  Accountant: "Akuntan",
  "Report Reader": "Pembaca Laporan",
  Banker: "Petugas Bank",
  Sales: "Penjualan",
  Purchasing: "Pembelian",
  Expenses: "Biaya",
  Stockist: "Pengelola Stok",
  Productions: "Produksi",
  View: "Lihat",
  "Create/Add": "Buat/Tambah",
  Edit: "Ubah",
  Delete: "Hapus",
  Active: "Aktif",
  Inactive: "Nonaktif",
  Invited: "Diundang",
  Member: "Anggota",
  Partner: "Mitra",
  Custom: "Kustom",
  "Invoice and return": "Faktur dan retur",
  "Order and quote": "Pesanan dan penawaran",
  Payment: "Pembayaran",
  Request: "Permintaan",
  "Cash & Bank": "Kas dan Bank",
  "Bank transfer": "Transfer bank",
  "Bank deposit": "Setoran bank",
  "Bank withdrawal": "Penarikan bank",
  "Pay Bills": "Bayar Tagihan",
  Product: "Produk",
  "Stock adjustment": "Penyesuaian stok",
  "Product conversion": "Konversi produk",
  "Warehouse Transfer": "Transfer Gudang",
  Purchase: "Pembelian",
  "Purchase quote": "Penawaran pembelian",
  "Purchase order": "Pesanan pembelian",
  "Purchase delivery": "Pengiriman pembelian",
  "Purchase invoice": "Faktur pembelian",
  "Purchase return": "Retur pembelian",
  "Purchase request": "Permintaan pembelian",
  "Purchase invoice financing": "Pembiayaan faktur pembelian",
  "Business overview report": "Laporan ringkasan bisnis",
  "Balance sheet": "Neraca",
  "General ledger": "Buku besar",
  "Profit loss": "Laba rugi",
  Journal: "Jurnal",
  "Cash flow": "Arus kas",
  "Trial balance": "Neraca saldo",
  "Statement of changes in equity": "Laporan perubahan ekuitas",
  "Executive summary": "Ringkasan eksekutif",
  "Profit & loss budgeting": "Anggaran laba rugi",
  "Budget management": "Pengelolaan anggaran",
  "Sales report": "Laporan penjualan",
  "Sales list": "Daftar penjualan",
  "Sales by customer": "Penjualan per pelanggan",
  "Customer balance": "Saldo pelanggan",
  "Aged receivable": "Umur piutang",
  "Sales delivery": "Pengiriman penjualan",
  "Sales by product": "Penjualan per produk",
  "Sales order completion": "Penyelesaian pesanan penjualan",
  "Product profitability": "Profitabilitas produk",
  "Proforma invoice list": "Daftar faktur proforma",
  "Join invoice list": "Daftar faktur gabungan",
  "Purchases report": "Laporan pembelian",
  "Purchase list": "Daftar pembelian",
  "Purchase by vendor": "Pembelian per pemasok",
  "Vendor balance": "Saldo pemasok",
  "Expense list": "Daftar biaya",
  "Expense details": "Rincian biaya",
  "Aged payable": "Umur utang",
  "Purchase by product": "Pembelian per produk",
  "Purchase order completion": "Penyelesaian pesanan pembelian",
  "Product report": "Laporan produk",
  "Inventory summary": "Ringkasan persediaan",
  "Warehouse stock quantity": "Jumlah stok gudang",
  "Inventory valuation": "Nilai persediaan",
  "Warehouse stock valuation": "Nilai stok gudang",
  "Inventory details": "Rincian persediaan",
  "Warehouse item movement": "Pergerakan barang gudang",
  "Assets report": "Laporan aset",
  "Fixed asset summary": "Ringkasan aset tetap",
  "Fixed asset details": "Rincian aset tetap",
  "Sold or disposed asset": "Aset dijual atau dilepas",
  "Foreign exchange report": "Laporan valuta asing",
  "Bank summary": "Ringkasan bank",
  "Foreign exchange gain loss": "Laba rugi valuta asing",
  "Realised currency gain loss": "Laba rugi kurs terealisasi",
  "Unrealised currency gain loss": "Laba rugi kurs belum terealisasi",
  "Bank report": "Laporan bank",
  "Bank reconciliation summary": "Ringkasan rekonsiliasi bank",
  "Bank statement": "Rekening koran",
  "Tax report": "Laporan pajak",
  "Withholding tax": "Pemotongan pajak",
  "Sales tax": "Pajak penjualan",
  "Sales quote": "Penawaran penjualan",
  "Sales order": "Pesanan penjualan",
  "Sales invoice": "Faktur penjualan",
  "Sales return": "Retur penjualan",
  "Sales invoice financing": "Pembiayaan faktur penjualan",
  "Other lists": "Daftar lainnya",
  "Chart of Accounts": "Daftar Akun",
  Customer: "Pelanggan",
  "Product: Unit": "Produk: Satuan",
  Setting: "Pengaturan",
  "Company setting": "Pengaturan perusahaan",
  Agents: "Agen",
  "User management: User list": "Manajemen pengguna: Daftar pengguna",
  "User management: Custom role": "Manajemen pengguna: Peran kustom",
  "Sales: Form settings": "Penjualan: Pengaturan formulir",
  "Sales: Invoice reminder": "Penjualan: Pengingat faktur",
  "Product: Good & Services": "Produk: Barang dan jasa",
  "Product: Warehouse": "Produk: Gudang",
  Production: "Produksi",
  "Custom fields": "Custom field",
  Billings: "Tagihan",
  "Email Template: Sales Invoice": "Templat email: Faktur penjualan",
  "Email Template: Sales Quote": "Templat email: Penawaran penjualan",
  "Email Template: Sales Order": "Templat email: Pesanan penjualan",
  "Email Template: Purchase Order": "Templat email: Pesanan pembelian",
  "PDF Template: Customize PDF": "Templat PDF: Penyesuaian PDF",
  "Whatsapp Template: Sales Invoice": "Templat WhatsApp: Faktur penjualan",
  "Whatsapp Template: Sales Order": "Templat WhatsApp: Pesanan penjualan",
  "Account Mapping": "Pemetaan Akun",
  "Approval Rules": "Aturan approval",
  "Tagging Rules": "Aturan tagging",
  "CRM access": "Akses CRM",
  "CRM settings access": "Akses Pengaturan CRM",
};

export function roleLabel(value) {
  return Object.hasOwn(roleLabels, value) ? roleLabels[value] : value;
}

const ALL_COLUMNS = ["View", "Create/Add", "Edit", "Delete"];
const VIEW_COLUMN = ["View"];
const VIEW_EDIT_COLUMNS = ["View", "Edit"];
const VIEW_CREATE_COLUMNS = ["View", "Create/Add"];
const VIEW_CREATE_DELETE_COLUMNS = ["View", "Create/Add", "Delete"];

export const customRoleFeatures = [
  {
    name: "Sekilas bisnis",
    label: "SEKILAS BISNIS",
    rows: [
      { key: "Balance sheet", label: "Neraca", columns: VIEW_COLUMN },
      { key: "General ledger", label: "Buku besar", columns: VIEW_COLUMN },
      { key: "Profit loss", label: "Laba rugi", columns: VIEW_COLUMN },
      { key: "Trial balance", label: "Neraca saldo", columns: VIEW_COLUMN },
    ],
  },
  {
    name: "Cash & Bank",
    label: "KAS & BANK",
    rows: [
      { key: "Bank transfer", label: "Transfer uang", columns: ALL_COLUMNS },
      { key: "Bank deposit", label: "Terima uang", columns: ALL_COLUMNS },
      { key: "Bank withdrawal", label: "Kirim uang", columns: ALL_COLUMNS },
    ],
  },
  {
    name: "CRM",
    label: "CRM",
    rows: [
      { key: "CRM access", label: "Akses CRM", columns: ALL_COLUMNS },
      {
        key: "CRM settings access",
        label: "Akses Pengaturan CRM",
        columns: ALL_COLUMNS,
        info: true,
      },
    ],
  },
  {
    name: "Expenses",
    label: "BIAYA",
    rows: [
      { key: "Expenses", label: "Biaya", columns: ALL_COLUMNS },
      {
        key: "Pay Bills",
        label: "Bayar Tagihan",
        columns: VIEW_CREATE_COLUMNS,
        info: true,
      },
    ],
  },
  {
    name: "Product",
    label: "PRODUK",
    rows: [
      {
        key: "Stock adjustment",
        label: "Penyesuaian stok",
        columns: ALL_COLUMNS,
      },
      {
        key: "Product conversion",
        label: "Konversi produk",
        columns: VIEW_CREATE_DELETE_COLUMNS,
      },
      {
        key: "Warehouse Transfer",
        label: "Transfer gudang",
        columns: ALL_COLUMNS,
      },
    ],
  },
  {
    name: "Purchase",
    label: "PEMBELIAN",
    rows: [
      {
        key: "Purchase quote",
        label: "Penawaran pembelian",
        columns: ALL_COLUMNS,
      },
      {
        key: "Purchase order",
        label: "Pesanan pembelian",
        columns: ALL_COLUMNS,
      },
      {
        key: "Purchase delivery",
        label: "Pengiriman pembelian",
        columns: ALL_COLUMNS,
        info: true,
      },
      {
        key: "Purchase invoice",
        label: "Penagihan pembelian",
        columns: ALL_COLUMNS,
      },
      {
        key: "Purchase return",
        label: "Retur pembelian",
        columns: ALL_COLUMNS,
        info: true,
      },
      {
        key: "Purchase request",
        label: "Permintaan pembelian",
        columns: ALL_COLUMNS,
      },
      {
        key: "Purchase invoice financing",
        label: "Pembiayaan faktur pembelian",
        columns: VIEW_COLUMN,
        info: true,
      },
    ],
  },
  {
    name: "Business overview report",
    label: "LAPORAN SEKILAS BISNIS",
    rows: [
      { key: "Balance sheet", label: "Neraca", columns: VIEW_COLUMN },
      { key: "General ledger", label: "Buku besar", columns: VIEW_COLUMN },
      { key: "Profit loss", label: "Laba rugi", columns: VIEW_COLUMN },
      { key: "Journal", label: "Jurnal", columns: VIEW_COLUMN },
      { key: "Cash flow", label: "Arus kas", columns: VIEW_COLUMN },
      { key: "Trial balance", label: "Neraca saldo", columns: VIEW_COLUMN },
      {
        key: "Statement of changes in equity",
        label: "Perubahan modal",
        columns: VIEW_COLUMN,
      },
      {
        key: "Executive summary",
        label: "Ringkasan bisnis",
        columns: VIEW_COLUMN,
      },
      {
        key: "Profit & loss budgeting",
        label: "Anggaran laba rugi",
        columns: VIEW_COLUMN,
      },
      {
        key: "Budget management",
        label: "Manajemen anggaran",
        columns: VIEW_COLUMN,
      },
    ],
  },
  {
    name: "Sales report",
    label: "LAPORAN PENJUALAN",
    rows: [
      { key: "Sales list", label: "Daftar penjualan", columns: VIEW_COLUMN },
      {
        key: "Sales by customer",
        label: "Penjualan per pelanggan",
        columns: VIEW_COLUMN,
      },
      {
        key: "Customer balance",
        label: "Piutang pelanggan",
        columns: VIEW_COLUMN,
      },
      { key: "Aged receivable", label: "Usia piutang", columns: VIEW_COLUMN },
      {
        key: "Sales delivery",
        label: "Pengiriman penjualan",
        columns: VIEW_COLUMN,
      },
      {
        key: "Sales by product",
        label: "Penjualan per produk",
        columns: VIEW_COLUMN,
      },
      {
        key: "Sales order completion",
        label: "Penyelesaian pesanan penjualan",
        columns: VIEW_COLUMN,
      },
      {
        key: "Product profitability",
        label: "Profitabilitas produk",
        columns: VIEW_COLUMN,
      },
      {
        key: "Proforma invoice list",
        label: "Daftar faktur proforma",
        columns: VIEW_COLUMN,
      },
      { key: "Join invoice list", label: "Daftar tukar", columns: VIEW_COLUMN },
    ],
  },
  {
    name: "Purchases report",
    label: "LAPORAN PEMBELIAN",
    rows: [
      { key: "Purchase list", label: "Daftar pembelian", columns: VIEW_COLUMN },
      {
        key: "Purchase by vendor",
        label: "Pembelian per supplier",
        columns: VIEW_COLUMN,
      },
      {
        key: "Vendor balance",
        label: "Utang supplier",
        columns: VIEW_COLUMN,
      },
      {
        key: "Expense list",
        label: "Daftar pengeluaran",
        columns: VIEW_COLUMN,
      },
      {
        key: "Expense details",
        label: "Detail pengeluaran",
        columns: VIEW_COLUMN,
      },
      { key: "Aged payable", label: "Usia utang", columns: VIEW_COLUMN },
      {
        key: "Purchase delivery",
        label: "Pengiriman pembelian",
        columns: VIEW_COLUMN,
      },
      {
        key: "Purchase by product",
        label: "Pembelian per produk",
        columns: VIEW_COLUMN,
      },
      {
        key: "Purchase order completion",
        label: "Penyelesaian pesanan pembelian",
        columns: VIEW_COLUMN,
      },
    ],
  },
  {
    name: "Product report",
    label: "LAPORAN PRODUK",
    rows: [
      {
        key: "Inventory summary",
        label: "Ringkasan persediaan barang",
        columns: VIEW_COLUMN,
      },
      {
        key: "Warehouse stock quantity",
        label: "Kuantitas stok gudang",
        columns: VIEW_COLUMN,
      },
      {
        key: "Inventory valuation",
        label: "Nilai persediaan barang",
        columns: VIEW_COLUMN,
      },
      {
        key: "Warehouse stock valuation",
        label: "Nilai stok gudang",
        columns: VIEW_COLUMN,
      },
      {
        key: "Inventory details",
        label: "Detail persediaan barang",
        columns: VIEW_COLUMN,
      },
      {
        key: "Warehouse item movement",
        label: "Pergerakan barang gudang",
        columns: VIEW_COLUMN,
      },
    ],
  },
  {
    name: "Assets report",
    label: "LAPORAN ASET",
    rows: [
      {
        key: "Fixed asset summary",
        label: "Ringkasan aset tetap",
        columns: VIEW_COLUMN,
      },
      {
        key: "Fixed asset details",
        label: "Detail aset tetap",
        columns: VIEW_COLUMN,
      },
      {
        key: "Sold or disposed asset",
        label: "Penjualan atau pelepasan aset",
        columns: VIEW_COLUMN,
      },
    ],
  },
  {
    name: "Foreign exchange report",
    label: "LAPORAN PERTUKARAN KURS",
    rows: [
      { key: "Bank summary", label: "Ringkasan bank", columns: VIEW_COLUMN },
      {
        key: "Foreign exchange gain loss",
        label: "Devisa laba atau rugi",
        columns: VIEW_COLUMN,
      },
      {
        key: "Realised currency gain loss",
        label: "Laba atau rugi mata uang terealisasi",
        columns: VIEW_COLUMN,
      },
      {
        key: "Unrealised currency gain loss",
        label: "Laba atau rugi mata uang belum terealisasi",
        columns: VIEW_COLUMN,
      },
    ],
  },
  {
    name: "Bank report",
    label: "LAPORAN BANK",
    rows: [
      {
        key: "Bank reconciliation summary",
        label: "Ringkasan rekonsiliasi bank",
        columns: VIEW_COLUMN,
      },
      {
        key: "Bank statement",
        label: "Mutasi rekening koran",
        columns: VIEW_COLUMN,
      },
    ],
  },
  {
    name: "Tax report",
    label: "LAPORAN PAJAK",
    rows: [
      { key: "Withholding tax", label: "Pajak pemotongan", columns: VIEW_COLUMN },
      { key: "Sales tax", label: "Pajak penjualan", columns: VIEW_COLUMN },
    ],
  },
  {
    name: "Sales",
    label: "PENJUALAN",
    rows: [
      {
        key: "Sales quote",
        label: "Penawaran penjualan",
        columns: ALL_COLUMNS,
      },
      { key: "Sales order", label: "Pesanan penjualan", columns: ALL_COLUMNS },
      {
        key: "Sales delivery",
        label: "Pengiriman penjualan",
        columns: ALL_COLUMNS,
        info: true,
      },
      {
        key: "Sales invoice",
        label: "Penagihan penjualan",
        columns: ALL_COLUMNS,
      },
      {
        key: "Sales return",
        label: "Retur penjualan",
        columns: ALL_COLUMNS,
        info: true,
      },
      {
        key: "Sales invoice financing",
        label: "Pembiayaan faktur penjualan",
        columns: VIEW_COLUMN,
        info: true,
      },
    ],
  },
  {
    name: "Setting",
    label: "PENGATURAN",
    rows: [
      {
        key: "Company setting",
        label: "Pengaturan perusahaan",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "User management: User list",
        label: "Pengaturan pengguna: Daftar pengguna",
        columns: ALL_COLUMNS,
      },
      {
        key: "User management: Custom role",
        label: "Pengaturan pengguna: Custom role",
        columns: ALL_COLUMNS,
      },
      {
        key: "Sales: Form settings",
        label: "Penjualan: Pengaturan form",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Sales: Invoice reminder",
        label: "Penjualan: Pengingat faktur",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Purchase",
        label: "Pembelian",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Product: Good & Services",
        label: "Produk: Barang & Jasa",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Product: Warehouse",
        label: "Produk: Gudang",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Email Template: Sales Invoice",
        label: "Email Template: Faktur Penjualan",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Email Template: Sales Quote",
        label: "Email Template: Penawaran Penjualan",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Email Template: Sales Order",
        label: "Email Template: Pemesanan Penjualan",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Email Template: Purchase Order",
        label: "Email Template: Pemesanan Pembelian",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "PDF Template: Customize PDF",
        label: "PDF Template: Customize PDF",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Whatsapp Template: Sales Invoice",
        label: "Whatsapp Template: Faktur Penjualan",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Whatsapp Template: Sales Order",
        label: "Whatsapp Template: Pemesanan Penjualan",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Whatsapp Template: Purchase Invoice",
        label: "Whatsapp Template: Faktur Pembelian",
        columns: ALL_COLUMNS,
      },
      {
        key: "Whatsapp Template: Purchase Order",
        label: "Whatsapp Template: Pemesanan Pembelian",
        columns: ALL_COLUMNS,
      },
      {
        key: "Account Mapping",
        label: "Pemetaan Akun",
        columns: VIEW_EDIT_COLUMNS,
      },
      {
        key: "Approval Rules",
        label: "Aturan Approval",
        columns: ALL_COLUMNS,
      },
      {
        key: "Tagging Rules",
        label: "Aturan Tagging",
        columns: ALL_COLUMNS,
      },
    ],
  },
];

const customRoleFeatureMap = new Map(
  customRoleFeatures.map((feature) => [feature.name, feature])
);

export function customRoleFeatureLabel(featureName) {
  return customRoleFeatureMap.get(featureName)?.label || roleLabel(featureName);
}

export function customRoleSubFeatureLabel(featureName, subFeature) {
  const feature = customRoleFeatureMap.get(featureName);
  const row = feature?.rows.find((item) => item.key === subFeature);
  return row?.label || roleLabel(subFeature);
}

export const inviteRoles = [
  {
    key: "ultimate",
    name: "Ultimate",
    bullets: [
      "Undang pengguna baru.",
      "Lihat dan tambah semua data transaksi.",
      "Lihat semua halaman di Jurnal, kecuali halaman tagihan.",
      "Ubah dan hapus data jika Pengelola Daftar diaktifkan.",
    ],
  },
  {
    key: "administrator",
    name: "Administrator",
    bullets: ["Lihat halaman pengaturan, kecuali halaman tagihan."],
  },
  {
    key: "accountant",
    name: "Accountant",
    bullets: [
      "Lihat semua laporan.",
      "Buat akun baru dan jurnal umum dari halaman daftar akun.",
      "Lihat semua data penjualan, pembelian, biaya, dan penyesuaian stok.",
      "Lihat halaman kas dan bank, kontak pelanggan dan pemasok, produk, daftar akun, serta daftar lainnya.",
      "Ubah dan hapus data daftar akun dan daftar lainnya jika Pengelola Daftar diaktifkan.",
    ],
  },
  {
    key: "reportReader",
    name: "Report Reader",
    bullets: ["Lihat semua laporan."],
  },
  {
    key: "banker",
    name: "Banker",
    bullets: [
      "Lakukan rekonsiliasi bank dan lihat laporannya.",
      "Lihat dan tambah akun beserta transaksi pada halaman kas dan bank.",
      "Ubah dan hapus data kas dan bank jika Pengelola Daftar diaktifkan.",
    ],
    restriction:
      "Batasi pengguna ini agar tidak dapat melihat transaksi kas dan bank yang dibuat oleh pengguna lain",
  },
  {
    key: "sales",
    name: "Sales",
    bullets: [
      "Lihat dan buat semua transaksi penjualan.",
      "Lihat semua laporan penjualan.",
      "Tambah produk baru.",
      "Lihat harga jual produk dan daftar produk.",
      "Lihat halaman kontak pelanggan, produk, daftar lainnya, dan pengaturan penjualan.",
      "Ubah dan hapus data transaksi penjualan, produk, dan pelanggan jika Pengelola Daftar diaktifkan.",
    ],
    authority: "Wewenang penjualan bawaan",
    authorityOptions: ["Invoice and return", "Order and quote", "Payment"],
    restriction:
      "Batasi pengguna ini agar tidak dapat melihat transaksi penjualan yang dibuat oleh pengguna lain",
  },
  {
    key: "purchasing",
    name: "Purchasing",
    bullets: [
      "Lihat dan tambah semua transaksi pembelian.",
      "Lihat semua laporan pembelian.",
      "Tambah produk baru.",
      "Lihat harga beli produk dan daftar produk.",
      "Lihat halaman kontak pemasok, produk, daftar lainnya, dan pengaturan pembelian.",
      "Ubah dan hapus data transaksi pembelian, produk, dan pemasok jika Pengelola Daftar diaktifkan.",
    ],
    authority: "Wewenang pembelian bawaan",
    authorityOptions: [
      "Invoice and return",
      "Order and quote",
      "Payment",
      "Request",
    ],
    restriction:
      "Batasi pengguna ini agar tidak dapat melihat transaksi pembelian yang dibuat oleh pengguna lain",
  },
  {
    key: "expenses",
    name: "Expenses",
    bullets: [
      "Lihat dan buat semua transaksi biaya.",
      "Lihat semua laporan biaya.",
      "Lihat halaman kontak pemasok dan daftar lainnya.",
      "Ubah dan hapus data biaya dan pemasok jika Pengelola Daftar diaktifkan.",
    ],
    restriction:
      "Batasi pengguna ini agar tidak dapat melihat transaksi biaya yang dibuat oleh pengguna lain",
  },
  {
    key: "stockist",
    name: "Stockist",
    bullets: [
      "Tambah produk baru",
      "Lihat daftar produk dan jumlahnya.",
      "Lihat dan sesuaikan stok produk melalui penghitungan stok fisik.",
      "Lihat semua laporan produk.",
      "Lihat halaman daftar lainnya dan pengaturan produk.",
      "Ubah dan hapus data produk jika Pengelola Daftar diaktifkan.",
    ],
  },
  {
    key: "productions",
    name: "Productions",
    bullets: [
      "Lihat semua halaman produksi.",
      "Lihat dan lakukan semua tindakan daftar kebutuhan bahan (BOM).",
      "Lihat dan lakukan semua tindakan perintah kerja.",
    ],
    restriction:
      "Batasi pengguna ini agar tidak dapat melihat informasi nominal produksi, mengakses biaya standar, membuat daftar kebutuhan bahan, atau menambah pemetaan akun produksi",
  },
];
