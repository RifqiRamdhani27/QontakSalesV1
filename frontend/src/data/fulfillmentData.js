export const warehouseOptionsSales = [
  { id: 0, name: "Semua" },
  { id: 1, name: "Belum ditetapkan" },
];

export const warehouseOptionsPurchase = [
  { id: 0, name: "Semua gudang" },
  { id: 1, name: "Belum ditetapkan" },
];

export const periodOptions = [
  { name: "7 hari terakhir", slug: "week" },
  { name: "14 hari terakhir", slug: "bi-week" },
  { name: "30 hari terakhir", slug: "month" },
  { name: "Semua", slug: "all" },
];

export const courierOptions = [
  "JNE",
  "J&T",
  "SiCepat",
  "AnterAja",
  "POS Indonesia",
  "TIKI",
  "Wahana",
  "Lion Parcel",
  "Ninja Xpress",
  "ID Express",
  "Jasa Kirim Lainnya",
];

export const outboundStatusMeta = {
  new_order: { label: "Pesanan baru", color: "bg-violet-100 text-violet-700" },
  on_process: { label: "Dalam proses", color: "bg-amber-100 text-amber-700" },
  picked: { label: "Telah diambil", color: "bg-cyan-100 text-cyan-700" },
  delivered: { label: "Dalam pengiriman", color: "bg-sky-100 text-sky-700" },
  completed: { label: "Selesai", color: "bg-teal-100 text-teal-700" },
  canceled: { label: "Dibatalkan", color: "bg-stone-100 text-stone-600" },
  partially_completed: { label: "Selesai sebagian", color: "bg-green-100 text-green-700" },
  completed_partially_and_canceled: {
    label: "Dibatalkan dan selesai sebagian",
    color: "bg-green-100 text-green-700",
  },
};

export const inboundStatusMeta = {
  new_order: { label: "Pesanan baru", color: "bg-violet-100 text-violet-700" },
  completed: { label: "Selesai", color: "bg-teal-100 text-teal-700" },
  canceled: { label: "Dibatalkan", color: "bg-stone-100 text-stone-600" },
  partially_completed: { label: "Selesai sebagian", color: "bg-green-100 text-green-700" },
  completed_partially_and_canceled: {
    label: "Dibatalkan dan selesai sebagian",
    color: "bg-green-100 text-green-700",
  },
};

export const outboundKanbanColumns = [
  { key: "new_order", label: "Pesanan baru", statuses: ["new_order"] },
  { key: "on_process", label: "Dalam proses", statuses: ["on_process", "picked"] },
  { key: "delivered", label: "Dalam pengiriman", statuses: ["delivered"] },
  { key: "completed", label: "Selesai", statuses: ["completed", "partially_completed", "completed_partially_and_canceled"] },
  { key: "canceled", label: "Dibatalkan", statuses: ["canceled"] },
];

export const inboundKanbanColumns = [
  { key: "new_order", label: "Pesanan baru", statuses: ["new_order"] },
  { key: "completed", label: "Selesai", statuses: ["completed", "partially_completed", "completed_partially_and_canceled"] },
  { key: "canceled", label: "Dibatalkan", statuses: ["canceled"] },
];

export const outboundActions = {
  new_order: [
    { key: "process", label: "Proses pesanan" },
    { key: "view", label: "Lihat detail" },
    { key: "cancel", label: "Batalkan pemenuhan pesanan" },
  ],
  on_process: [
    { key: "pick", label: "Buat daftar pengambilan barang" },
    { key: "view", label: "Lihat detail" },
    { key: "cancelProcess", label: "Batalkan pemenuhan pesanan yang diproses" },
  ],
  picked: [
    { key: "view", label: "Lihat detail" },
    { key: "cancelPick", label: "Batalkan daftar pengambilan barang" },
  ],
  delivered: [
    { key: "complete", label: "Buat tanda terima" },
    { key: "view", label: "Lihat detail" },
  ],
  completed: [{ key: "view", label: "Lihat detail" }],
  canceled: [{ key: "view", label: "Lihat detail" }],
  partially_completed: [
    { key: "process", label: "Tambah pesanan yang diproses" },
    { key: "view", label: "Lihat detail" },
  ],
};

export const inboundActions = {
  new_order: [
    { key: "receive", label: "Buat tanda terima" },
    { key: "view", label: "Lihat detail" },
    { key: "cancel", label: "Batalkan pemenuhan pesanan" },
  ],
  partially_completed: [
    { key: "receive", label: "Buat tanda terima" },
    { key: "view", label: "Lihat detail" },
  ],
  completed: [{ key: "view", label: "Lihat detail" }],
  canceled: [{ key: "view", label: "Lihat detail" }],
};

export const outboundOrders = [];

export const inboundOrders = [];

export const nextNumbers = {
  picklist: "PL-2026-001",
  delivery: "DO-2026-001",
  receipt: "RRN-2026-001",
  goodsReceipt: "GRN-2026-001",
};
