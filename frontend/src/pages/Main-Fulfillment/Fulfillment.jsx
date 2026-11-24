import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotsThreeOutline, MagnifyingGlass, ArrowsClockwise, CaretDown, X, MinusCircle, PlusCircle } from "@phosphor-icons/react";
import {
  btnDangerOutline,
  btnModalCancel,
  btnModalDelete,
  btnModalSubmit as _btnModalSubmit,
  btnSecondary,
  inputBase,
  modalFooter,
  modalHeader,
  modalOverlay,
  modalPanel,
  modalTitle,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";
import {
  courierOptions,
  inboundActions,
  inboundKanbanColumns,
  inboundOrders,
  inboundStatusMeta,
  nextNumbers,
  outboundActions,
  outboundKanbanColumns,
  outboundOrders,
  outboundStatusMeta,
  periodOptions,
  warehouseOptionsSales,
  warehouseOptionsPurchase,
} from "@/data/fulfillmentData";

const btnModalSubmit = `${_btnModalSubmit} dd-btn`;

function MainTab({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "sales", label: "Penjualan" },
    { key: "purchase", label: "Pembelian" },
  ];

  return (
    <div className="flex gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={
            activeTab === tab.key
              ? "border-b border-brand bg-white p-2 text-brand"
              : "p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
          }
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function GroupingButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className={btnSecondary}
        onClick={() => setOpen((current) => !current)}
      >
        <DotsThreeOutline size={14} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+8px)] z-[61] w-56 rounded-lg border border-gray-200 bg-white py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Berikan masukan
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Panduan
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Tutorial
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function KanbanCard({ order, statusKey, actions, onAction, onOpenDetail }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = statusKey === "canceled" ? null : null;
  const statusMeta =
    order.status === "partially_completed"
      ? outboundStatusMeta.partially_completed
      : order.status === "completed_partially_and_canceled"
      ? outboundStatusMeta.completed_partially_and_canceled
      : null;

  const dateLabel = (() => {
    if (order.status === "canceled") return order.close_date;
    if (order.status === "delivered") return order.order_date;
    return order.order_date;
  })();

  return (
    <div className="rounded-md border border-gray-100 bg-white p-2.5 shadow-sm">
      <div className="mb-1 font-semibold text-gray-900">{order.order_number}</div>
      <div className="break-words text-sm text-gray-600">{order.person_name}</div>
      {order.status === "partially_completed" && (
        <span className="mt-1 inline-block rounded bg-green-100 px-1.5 py-0.5 text-[11px] font-medium text-green-700">
          Selesai sebagian
        </span>
      )}
      <div className="mt-1.5 space-y-1 text-[13px] text-gray-600">
        <div>{dateLabel}</div>
        {order.courier && <div>{order.courier}</div>}
        {order.status !== "canceled" && order.status !== "completed" && order.remaining_days != null && (
          <div className={order.remaining_days < 0 ? "text-red-600" : "text-gray-600"}>
            {order.remaining_days < 0
              ? "Pemenuhan terlambat"
              : `Harus dipenuhi dalam ${order.remaining_days} hari`}
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-end border-t border-gray-50 pt-1.5">
        <div className="relative">
          <button
            type="button"
            className="rounded p-1 text-gray-500 hover:bg-slate-100"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <DotsThreeOutline size={16} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-[calc(100%+4px)] z-[61] w-52 rounded-lg border border-gray-200 bg-white py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                {actions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    className="flex w-full items-center px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
                    onClick={() => {
                      setMenuOpen(false);
                      if (action.key === "view") onOpenDetail(order);
                      else onAction(order, action.key);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const columnToneByKey = {
  new_order: "bg-[#e8eaf9]",
  on_process: "bg-[#fcefdb]",
  picked: "bg-[#fcefdb]",
  delivered: "bg-[#e5f6f6]",
  on_delivery: "bg-[#e5f6f6]",
  completed: "bg-[#e5f4e8]",
  partially_completed: "bg-[#e5f4e8]",
  canceled: "bg-[#eceff1]",
};

const columnToneFallback = [
  "bg-[#e8eaf9]",
  "bg-[#fcefdb]",
  "bg-[#e5f6f6]",
  "bg-[#e5f4e8]",
  "bg-[#eceff1]",
];

function columnTone(column, index) {
  return columnToneByKey[column.key] || columnToneFallback[index % columnToneFallback.length];
}

function KanbanBoard({ orders, columns, statusMeta, actions, onAction, onOpenDetail }) {
  return (
    <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {columns.map((column, index) => {
        const items = orders.filter((order) => column.statuses.includes(order.status));
        return (
          <div key={column.key} className="flex flex-col">
            <div
              className={`flex items-center justify-center gap-2 rounded-t-sm px-3 py-2 ${columnTone(
                column,
                index
              )}`}
            >
              <span className="text-[12px] font-bold text-slate-900">{column.label}</span>
              <span className="rounded-full bg-slate-600 px-1.5 py-px text-[10px] font-semibold leading-none text-white">
                {items.length}
              </span>
            </div>
            <div className="flex min-h-[400px] flex-col gap-2.5 bg-gray-50 p-2">
              {items.map((order) => (
                <KanbanCard
                  key={order.id}
                  order={order}
                  statusKey={column.key}
                  actions={actions[column.key] || []}
                  onAction={onAction}
                  onOpenDetail={onOpenDetail}
                />
              ))}
              {items.length === 0 && (
                <div className="rounded-md border border-dashed border-gray-200 px-3 py-6 text-center text-xs text-gray-400">
                  Belum ada pesanan
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


function DrawerLayout({ title, tooltip, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div
        className="absolute inset-0 bg-slate-900/55"
        onClick={onClose}
      />
      <div className="relative ml-auto flex h-full w-full max-w-[640px] flex-col bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="m-0 text-[19px] font-bold text-gray-900">{title}</h2>
            {tooltip && <p className="m-0 mt-1 text-xs text-gray-500">{tooltip}</p>}
          </div>
          <button
            type="button"
            className="rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2.5 border-t border-gray-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function DrawerInfoBlock({ label, children }) {
  return (
    <div className="mb-3">
      <div className="mb-0.5 text-[13px] text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{children}</div>
    </div>
  );
}

function DrawerTable({ head, children }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            {head.map((item, index) => (
              <th
                key={index}
                className="px-3.5 py-3 text-left font-semibold text-slate-600"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}


function ProcessOrderDrawer({ order, onClose, onSubmit }) {
  const [quantities, setQuantities] = useState(() =>
    order.lines.map((line) => ({ id: line.id, qty: 0 }))
  );

  const getQty = (lineId) => {
    const found = quantities.find((q) => q.id === lineId);
    return found ? found.qty : 0;
  };

  const setQty = (lineId, value) => {
    setQuantities((current) =>
      current.map((q) => (q.id === lineId ? { ...q, qty: value } : q))
    );
  };

  const decreaseQty = (line) => {
    const current = getQty(line.id);
    if (current > 0) setQty(line.id, current - 1);
  };

  const increaseQty = (line) => {
    const current = getQty(line.id);
    if (current < line.quantity) setQty(line.id, current + 1);
  };

  const totalQty = quantities.reduce((sum, q) => sum + q.qty, 0);
  const hasError = order.lines.some((line) => getQty(line.id) > line.quantity);

  const handleSubmit = () => {
    if (totalQty === 0) return;
    onSubmit(
      order,
      quantities.map((q) => ({ fulfillment_order_line_id: q.id, quantity: q.qty }))
    );
  };

  return (
    <DrawerLayout
      title="Proses pesanan"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnModalSubmit} onClick={handleSubmit} disabled={totalQty === 0 || hasError}>
            Proses pesanan
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Pelanggan">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Tanggal pesanan">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor pesanan penjualan">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor referensi pelanggan">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Gudang">{order.warehouse_name}</DrawerInfoBlock>
      </div>

      <DrawerTable head={["Produk", "Kuantitas dipesan", "Kuantitas diproses", "Satuan"]}>
        {order.lines.map((line) => {
          const qty = getQty(line.id);
          const exceed = qty > line.quantity;
          return (
            <tr key={line.id} className="border-b border-slate-100 align-top">
                <td className="px-3.5 py-3">
                  <div className="flex gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                      <span className="text-[10px] text-gray-400">Foto</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{line.product_code}</div>
                      <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                      {line.product_description && (
                        <div className="text-xs text-gray-500">{line.product_description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-gray-400 disabled:opacity-40"
                      onClick={() => decreaseQty(line)}
                      disabled={qty === 0}
                    >
                      <MinusCircle size={18} />
                    </button>
                    <input
                      className="w-[56px] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm outline-none focus:border-brand"
                      value={qty}
                      onChange={(event) => setQty(line.id, Number(event.target.value) || 0)}
                    />
                    <button
                      type="button"
                      className="text-gray-400 disabled:opacity-40"
                      onClick={() => increaseQty(line)}
                      disabled={qty >= line.quantity}
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                  {exceed && (
                    <div className="mt-1 text-xs text-red-500">
                      Kuantitas yang diproses melebihi kuantitas pesanan
                    </div>
                  )}
                  {order.status === "partially_completed" && (
                    <div className="mt-1 text-xs text-gray-500">
                      Telah diproses: {line.quantity_on_process}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    Stok tersedia: {line.stock} {line.unit_name}
                  </div>
                  {line.has_batch && qty > 0 && (
                    <button
                      type="button"
                      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                    >
                      Atur nomor lot
                    </button>
                  )}
                  {line.use_serial_number && qty > 0 && (
                    <button
                      type="button"
                      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                    >
                      Atur Nomor Seri
                    </button>
                  )}
                </td>
                <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
              </tr>
            );
          })}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total kuantitas</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{totalQty}</td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>

      {totalQty === 0 && (
        <div className="mt-4 text-sm text-red-500">
          Pesanan tidak dapat diproses karena kuantitas seluruh produk adalah 0
        </div>
      )}
    </DrawerLayout>
  );
}


function CreatePickingListDrawer({ order, number, onClose, onSubmit }) {
  const [memo, setMemo] = useState("");

  const handleSubmit = () => {
    onSubmit(order, number);
  };

  return (
    <DrawerLayout
      title="Buat daftar pengambilan barang"
      tooltip="Daftar pengambilan barang adalah dokumen untuk mengambil barang yang tersedia di gudang. Barang yang diambil kemudian diserahkan untuk memenuhi pesanan pelanggan."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Cetak daftar pengambilan barang
          </button>
          <button type="button" className={btnModalSubmit} onClick={handleSubmit}>
            Buat daftar pengambilan barang
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Pelanggan">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Tanggal pesanan">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor pesanan penjualan">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor referensi pelanggan">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Gudang">{order.warehouse_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor daftar pengambilan barang">{number}</DrawerInfoBlock>
      </div>

      <DrawerTable head={["Produk", "Kuantitas diambil", "Satuan"]}>
        {order.lines.map((line) => (
          <tr key={line.id} className="border-b border-slate-100 align-top">
            <td className="px-3.5 py-3">
              <div className="flex gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400">Foto</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{line.product_code}</div>
                  <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                  {line.product_description && (
                    <div className="text-xs text-gray-500">{line.product_description}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity_on_process}</td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
          </tr>
        ))}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total kuantitas</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity_on_process, 0)}
          </td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>

      <div className="mt-5">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Memo</label>
        <textarea
          className={textareaBase}
          rows={3}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="Untuk catatan internal, misalnya lokasi barang yang akan diambil."
        />
      </div>
    </DrawerLayout>
  );
}


function CreateDeliveryNoteDrawer({ order, number, onClose, onSubmit }) {
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [pickingList, setPickingList] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

  const pickingOptions = (order.current_fulfillments?.picked || []).map((p) => p.number);

  const handleSubmit = () => {
    onSubmit(order, {
      number,
      courier,
      tracking_number: trackingNumber,
      delivery_date: deliveryDate,
      fulfillment_lines: order.lines.map((line) => ({
        fulfillment_order_line_id: line.id,
        quantity: line.quantity_on_picked || line.quantity_on_process,
      })),
    });
  };

  return (
    <DrawerLayout
      title="Buat surat jalan"
      tooltip="Surat jalan adalah dokumen wajib yang memuat informasi penting tentang pengiriman barang. Dokumen ini digunakan oleh perusahaan, pelaku usaha, dan lembaga lain dalam kegiatan pengiriman."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Cetak surat jalan
          </button>
          <button type="button" className={btnModalSubmit} onClick={handleSubmit}>
            Buat surat jalan
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Pelanggan">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Tanggal pesanan">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor pesanan penjualan">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor referensi pelanggan">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Gudang">{order.warehouse_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Alamat pengiriman">{order.person_address || "-"}</DrawerInfoBlock>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Nomor surat jalan</label>
          <input className={inputBase} value={number} readOnly />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Kurir</label>
          <select
            className={selectBase}
            value={courier}
            onChange={(event) => setCourier(event.target.value)}
          >
            <option value="">Pilih kurir</option>
            {courierOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Nomor pelacakan</label>
          <input
            className={inputBase}
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Masukkan nomor pelacakan"
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tanggal pengiriman</label>
          <input
            type="date"
            className={inputBase}
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Daftar pengambilan barang</label>
          <select
            className={selectBase}
            value={pickingList}
            onChange={(event) => setPickingList(event.target.value)}
          >
            <option value="">Pilih daftar pengambilan barang</option>
            {pickingOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Pesan</label>
          <textarea
            className={textareaBase}
            rows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Memo</label>
          <textarea
            className={textareaBase}
            rows={2}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="Untuk catatan internal."
          />
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Lampiran</label>
          <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
            Berkas dapat berupa dokumen, gambar, atau ZIP. Maksimal 5 berkas dengan ukuran 10 MB per berkas.
          </div>
        </div>
      </div>

      <DrawerTable head={["Produk", "Kuantitas dipesan", "Kuantitas dikirim", "Satuan"]}>
        {order.lines.map((line) => (
          <tr key={line.id} className="border-b border-slate-100 align-top">
            <td className="px-3.5 py-3">
              <div className="flex gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400">Foto</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{line.product_code}</div>
                  <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                  {line.product_description && (
                    <div className="text-xs text-gray-500">{line.product_description}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
            <td className="px-3.5 py-3 text-sm text-gray-900">
              {line.quantity_on_picked || line.quantity_on_process}
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
          </tr>
        ))}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total kuantitas</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + (line.quantity_on_picked || line.quantity_on_process), 0)}
          </td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>
    </DrawerLayout>
  );
}


function CreateReceiptDrawer({ order, number, onClose, onSubmit }) {
  const [receiveDate, setReceiveDate] = useState("");
  const [receiver, setReceiver] = useState("");
  const [errorDate, setErrorDate] = useState("");

  const deliveryDate =
    order.current_fulfillments?.delivered?.[0]?.date || order.order_date;

  const handleSubmit = () => {
    if (!receiveDate) {
      setErrorDate("Pilih tanggal terlebih dahulu");
      return;
    }
    if (receiveDate < deliveryDate) {
      setErrorDate("Tanggal penerimaan harus setelah tanggal pengiriman");
      return;
    }
    if (!receiver.trim()) return;
    onSubmit(order);
  };

  return (
    <DrawerLayout
      title="Buat tanda terima"
      tooltip="Tanda terima adalah dokumen bukti bahwa suatu pihak telah menyerahkan dokumen, barang, atau jasa kepada pihak lain."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Cetak tanda terima
          </button>
          <button
            type="button"
            className={btnModalSubmit}
            onClick={handleSubmit}
            disabled={!receiver.trim()}
          >
            Buat tanda terima
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Pelanggan">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Tanggal pesanan">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor pesanan penjualan">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor surat jalan">
          {order.current_fulfillments?.delivered?.[0]?.number || "-"}
        </DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor referensi pelanggan">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Tanggal pengiriman">{deliveryDate}</DrawerInfoBlock>
        <DrawerInfoBlock label="Gudang">{order.warehouse_name}</DrawerInfoBlock>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Nomor tanda terima</label>
          <input className={inputBase} value={number} readOnly />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tanggal penerimaan</label>
          <input
            type="date"
            className={inputBase}
            value={receiveDate}
            onChange={(event) => {
              setReceiveDate(event.target.value);
              setErrorDate("");
            }}
          />
          {errorDate && <div className="mt-1 text-xs text-red-500">{errorDate}</div>}
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Nama penerima</label>
          <input
            className={inputBase}
            value={receiver}
            onChange={(event) => setReceiver(event.target.value)}
            placeholder="Masukkan nama penerima"
          />
          {!receiver.trim() && receiver.length > 0 && (
            <div className="mt-1 text-xs text-red-500">Nama penerima wajib diisi</div>
          )}
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Lampiran</label>
          <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
            Berkas dapat berupa dokumen, gambar, atau ZIP. Maksimal 5 berkas dengan ukuran 10 MB per berkas.
          </div>
        </div>
      </div>

      <DrawerTable head={["Produk", "Kuantitas dipesan", "Kuantitas dikirim", "Satuan"]}>
        {order.lines.map((line) => (
          <tr key={line.id} className="border-b border-slate-100 align-top">
            <td className="px-3.5 py-3">
              <div className="flex gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400">Foto</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{line.product_code}</div>
                  <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                  {line.product_description && (
                    <div className="text-xs text-gray-500">{line.product_description}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
            <td className="px-3.5 py-3 text-sm text-gray-900">
              {line.quantity_on_picked || line.quantity_on_process}
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
          </tr>
        ))}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total kuantitas</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + (line.quantity_on_picked || line.quantity_on_process), 0)}
          </td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>
    </DrawerLayout>
  );
}


function CreateGoodsReceiptDrawer({ order, number, onClose, onSubmit }) {
  const [quantities, setQuantities] = useState(() =>
    order.lines.map((line) => ({ id: line.id, qty: 0 }))
  );
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [receiveDate, setReceiveDate] = useState("");
  const [receiver, setReceiver] = useState("");
  const [memo, setMemo] = useState("");
  const [errorDate, setErrorDate] = useState("");

  const getQty = (lineId) => quantities.find((q) => q.id === lineId)?.qty || 0;

  const setQty = (lineId, value) => {
    setQuantities((current) =>
      current.map((q) => (q.id === lineId ? { ...q, qty: value } : q))
    );
  };

  const totalQty = quantities.reduce((sum, q) => sum + q.qty, 0);
  const hasError = order.lines.some((line) => getQty(line.id) > line.quantity);

  const handleSubmit = () => {
    if (!receiveDate) {
      setErrorDate("Tanggal penerimaan barang wajib dipilih");
      return;
    }
    if (deliveryDate && receiveDate < deliveryDate) {
      setErrorDate("Tanggal penerimaan harus setelah tanggal pengiriman");
      return;
    }
    if (!receiver.trim()) return;
    if (totalQty === 0) return;
    onSubmit(
      order,
      quantities.map((q) => ({ fulfillment_order_line_id: q.id, quantity: q.qty }))
    );
  };

  return (
    <DrawerLayout
      title="Buat penerimaan barang"
      tooltip="Penerimaan barang adalah dokumen lanjutan dari pesanan pembelian. Setelah pemasok mengirim barang, dokumen ini digunakan untuk mencatat jumlah barang yang diterima secara fisik di gudang."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Cetak tanda terima
          </button>
          <button
            type="button"
            className={btnModalSubmit}
            onClick={handleSubmit}
            disabled={totalQty === 0 || hasError || !receiver.trim()}
          >
            Buat penerimaan barang
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Pemasok">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Tanggal pesanan">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor pesanan pembelian">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Nomor referensi pemasok">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Gudang">{order.warehouse_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Alamat pengiriman">{order.person_address || "-"}</DrawerInfoBlock>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Nomor tanda terima</label>
          <input className={inputBase} value={number} readOnly />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Kurir</label>
          <select
            className={selectBase}
            value={courier}
            onChange={(event) => setCourier(event.target.value)}
          >
            <option value="">Pilih kurir</option>
            {courierOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Nomor pelacakan</label>
          <input
            className={inputBase}
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Masukkan nomor pelacakan"
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
            Tanggal pengiriman
          </label>
          <input
            type="date"
            className={inputBase}
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
            Tanggal penerimaan barang
          </label>
          <input
            type="date"
            className={inputBase}
            value={receiveDate}
            onChange={(event) => {
              setReceiveDate(event.target.value);
              setErrorDate("");
            }}
          />
          {errorDate && <div className="mt-1 text-xs text-red-500">{errorDate}</div>}
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Nama penerima</label>
          <input
            className={inputBase}
            value={receiver}
            onChange={(event) => setReceiver(event.target.value)}
            placeholder="Masukkan nama penerima"
          />
          {!receiver.trim() && receiver.length > 0 && (
            <div className="mt-1 text-xs text-red-500">Nama penerima wajib diisi</div>
          )}
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Memo</label>
          <textarea
            className={textareaBase}
            rows={2}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="Untuk catatan internal"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Lampiran</label>
          <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
            Berkas dapat berupa dokumen, gambar, atau ZIP. Maksimal 5 berkas dengan ukuran 10 MB per berkas
          </div>
        </div>
      </div>

      <DrawerTable head={["Produk", "Kuantitas dipesan", "Kuantitas diterima", "Satuan"]}>
        {order.lines.map((line) => {
          const qty = getQty(line.id);
          const exceed = qty > line.quantity;
          return (
            <tr key={line.id} className="border-b border-slate-100 align-top">
              <td className="px-3.5 py-3">
                <div className="flex gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                    <span className="text-[10px] text-gray-400">Foto</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{line.product_code}</div>
                    <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                    {line.product_description && (
                      <div className="text-xs text-gray-500">{line.product_description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
              <td className="px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 disabled:opacity-40"
                    onClick={() => setQty(line.id, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                  >
                    <MinusCircle size={18} />
                  </button>
                  <input
                    className="w-[56px] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm outline-none focus:border-brand"
                    value={qty}
                    onChange={(event) => setQty(line.id, Number(event.target.value) || 0)}
                  />
                  <button
                    type="button"
                    className="text-gray-400 disabled:opacity-40"
                    onClick={() => setQty(line.id, Math.min(line.quantity, qty + 1))}
                    disabled={qty >= line.quantity}
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
                {exceed && (
                  <div className="mt-1 text-xs text-red-500">
                    Kuantitas yang diterima melebihi kuantitas pesanan
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  Telah diterima sebelumnya: {line.quantity_on_received || 0}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Stok tersedia: {line.stock} {line.unit_name}
                </div>
                {line.has_batch && qty > 0 && (
                  <button
                    type="button"
                    className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                  >
                    Atur nomor lot
                  </button>
                )}
                {line.use_serial_number && qty > 0 && (
                  <button
                    type="button"
                    className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                  >
                    Atur nomor seri
                  </button>
                )}
              </td>
              <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
            </tr>
          );
        })}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total kuantitas</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{totalQty}</td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>
    </DrawerLayout>
  );
}


function CancelOrderModal({ order, type, onClose, onConfirm }) {
  const isProcess = type === "process";

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalHeader}>
          <h2 className={modalTitle}>
            {isProcess
              ? `Batalkan proses pesanan penjualan #${order.order_number}`
              : "Batalkan pemenuhan pesanan"}
          </h2>
        </div>
        <div className="px-[22px] py-5">
          <p className="m-0 text-sm text-gray-600">
            {isProcess
              ? "Proses pesanan yang dibatalkan tidak dapat dipulihkan. Status pesanan akan kembali menjadi pesanan baru."
              : "Pemenuhan pesanan yang dibatalkan tidak dapat dipulihkan."}
          </p>
          {isProcess && (
            <div className="mt-4 overflow-hidden rounded-[10px] border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Produk</th>
                    <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kuantitas diproses</th>
                    <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines
                    .filter((line) => line.quantity_on_process > 0)
                    .map((line) => (
                      <tr key={line.id} className="border-b border-slate-100">
                        <td className="px-3.5 py-3 text-sm text-gray-900">{line.product_name}</td>
                        <td className="px-3.5 py-3 text-sm text-gray-900">
                          {line.quantity_on_process}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
                      </tr>
                    ))}
                  <tr>
                    <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">
                      Total kuantitas
                    </td>
                    <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
                      {order.lines.reduce((sum, line) => sum + (line.quantity_on_process || 0), 0)}
                    </td>
                    <td className="px-3.5 py-3" />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Batal
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm}>
            {isProcess ? "Batalkan pesanan yang diproses" : "Batalkan pemenuhan pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}


function OutboundDetail({
  order,
  onClose,
  onProcess,
  onPick,
  onDeliver,
  onComplete,
  onCancelOrder,
  onCancelProcess,
  onUpdated,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const statusMeta = outboundStatusMeta[order.status] || outboundStatusMeta.new_order;
  const currentFulfillments = order.current_fulfillments || { on_process: [], picked: [], delivered: [] };
  const fulfillments = order.fulfillments || { picked: [], delivered: [] };

  const actionType =
    currentFulfillments.delivered.length > 0
      ? "complete"
      : currentFulfillments.picked.length > 0
      ? "deliver"
      : currentFulfillments.on_process.length > 0
      ? "pick"
      : "process";

  const actionText = {
    process: "Proses pesanan",
    pick: "Buat daftar pengambilan barang",
    deliver: "Buat surat jalan",
    complete: "Buat tanda terima",
  }[actionType];

  const handleFooterAction = () => {
    if (actionType === "process") onProcess(order);
    else if (actionType === "pick") onPick(order);
    else if (actionType === "deliver") onDeliver(order);
    else if (actionType === "complete") onComplete(order);
  };

  const handleCancel = () => {
    if (order.status === "new_order") onCancelOrder(order);
    else onCancelProcess(order);
  };

  const qtyOrderedTotal = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const qtyProcessedTotal = order.lines.reduce(
    (sum, line) => sum + (line.quantity_on_process || 0),
    0
  );
  const qtyDeliveredTotal = order.lines.reduce(
    (sum, line) => sum + (line.quantity_on_delivery || 0),
    0
  );

  const latestUpdated = order.logs
    ? `Terakhir diperbarui oleh ${order.logs.updated_by} pada ${order.logs.updated_at.replace("T", " ")}`
    : null;

  const pickingListTabAction =
    currentFulfillments.on_process.length > 0 && fulfillments.picked.length > 0 && actionType !== "pick"
      ? { text: "Buat daftar pengambilan barang", onClick: () => onPick(order) }
      : null;

  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div className="absolute inset-0 bg-slate-900/55" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-full max-w-[1024px] flex-col overflow-y-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <button
              type="button"
              className="text-[13px] font-medium text-brand"
              onClick={onClose}
            >
              Pemenuhan pesanan penjualan
            </button>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="m-0 text-[22px] font-bold text-gray-900">
                Pesanan penjualan #{order.order_number}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}
              >
                {statusMeta.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="border-b border-gray-100 pb-5">
            <div className="text-[13px] text-gray-500">Pelanggan</div>
            <div className="text-sm font-medium text-brand">{order.person_name}</div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-b border-gray-100 py-5">
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Tanggal pesanan</div>
                <div className="text-sm text-gray-900">{order.order_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Tanggal jatuh tempo</div>
                <div className="text-sm text-gray-900">{order.due_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Nomor pesanan penjualan</div>
                <div className="text-sm font-medium text-brand">{order.order_number}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Nomor referensi pelanggan</div>
                <div className="text-sm text-gray-900">{order.reference_no || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Gudang</div>
                <div className="text-sm text-gray-900">{order.warehouse_name}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Memo</div>
                <div className="text-sm text-gray-900">{order.memo || "-"}</div>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-gray-500">Alamat pengiriman</div>
              <div className="text-sm text-gray-900">{order.person_address || "-"}</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Tanggal pembatalan</div>
                <div className="text-sm text-gray-900">{order.close_date || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Alasan pembatalan</div>
                <div className="text-sm text-gray-900">{order.close_reason || "-"}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[10px] border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Produk</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kuantitas dipesan</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kuantitas diproses</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kuantitas dikirim</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Satuan</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id} className="border-b border-slate-100 align-top">
                    <td className="px-3.5 py-3">
                      <div className="flex gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                          <span className="text-[10px] text-gray-400">Foto</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand">{line.product_name}</div>
                          {line.product_description && (
                            <div className="text-xs text-gray-500">{line.product_description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity_on_process}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity_on_delivery}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">
                    Total kuantitas
                  </td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{qtyOrderedTotal}</td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{qtyProcessedTotal}</td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{qtyDeliveredTotal}</td>
                  <td className="px-3.5 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          {latestUpdated && (
            <button
              type="button"
              className="mb-4 text-[13px] font-medium text-brand"
              onClick={() => showToast && showToast(latestUpdated)}
            >
              {latestUpdated}
            </button>
          )}

          <div className="flex gap-6 border-b border-gray-200">
            {[
              { label: "Daftar pengambilan barang", total: fulfillments.picked.length },
              { label: "Pengiriman", total: fulfillments.delivered.length },
            ].map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                className={
                  activeTab === index
                    ? "-mb-px border-b-2 border-brand pb-2.5 text-sm font-semibold text-brand"
                    : "pb-2.5 text-sm font-medium text-gray-500 hover:text-gray-900"
                }
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
                {tab.total > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                    {tab.total}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="mt-4">
              {pickingListTabAction && (
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={pickingListTabAction.onClick}
                  >
                    {pickingListTabAction.text}
                  </button>
                </div>
              )}
              {fulfillments.picked.length > 0 ? (
                <div className="overflow-hidden rounded-[10px] border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Nomor</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Tanggal dibuat
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fulfillments.picked.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="px-3.5 py-3 text-sm font-medium text-brand">
                            {item.number}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-3.5 py-3">
                            <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
                              Telah diambil
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 py-8 text-center">
                  <h3 className="m-0 text-base font-semibold text-gray-900">
                    Belum ada daftar pengambilan barang
                  </h3>
                  <p className="m-0 text-sm text-gray-500">
                    Daftar pengambilan barang akan ditampilkan di sini
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 1 && (
            <div className="mt-4">
              {currentFulfillments.picked.length > 0 &&
                fulfillments.delivered.length > 0 &&
                actionType !== "deliver" && (
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => onDeliver(order)}
                    >
                      Buat surat jalan
                    </button>
                  </div>
                )}
              {fulfillments.delivered.length > 0 ? (
                <div className="overflow-hidden rounded-[10px] border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Nomor</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Tanggal dibuat
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kurir</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Nomor pelacakan</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Status</th>
                        <th className="px-3.5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {fulfillments.delivered.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="px-3.5 py-3 text-sm font-medium text-brand">
                            {item.sales_delivery_number || item.number}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.courier || "-"}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.tracking_number || "-"}
                          </td>
                          <td className="px-3.5 py-3">
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-medium ${
                                item.latest
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-teal-100 text-teal-700"
                              }`}
                            >
                              {item.latest ? "Dalam pengiriman" : "Selesai"}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-right">
                            {!item.latest && item.completed_id && (
                              <span className="text-[13px] font-medium text-brand">
                                Lihat tanda terima
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 py-8 text-center">
                  <h3 className="m-0 text-base font-semibold text-gray-900">
                    Belum ada pengiriman
                  </h3>
                  <p className="m-0 text-sm text-gray-500">
                    Pengiriman akan ditampilkan di sini
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-6">
          {order.status !== "canceled" && order.status !== "completed" ? (
            <button
              type="button"
              className="text-[13px] font-medium text-gray-600 underline-offset-2 hover:underline"
              onClick={handleCancel}
            >
              {currentFulfillments.on_process.length === 1
                ? "Batalkan pemenuhan pesanan yang diproses"
                : "Batalkan pemenuhan pesanan"}
            </button>
          ) : (
            <div />
          )}
          {order.status !== "canceled" && order.status !== "completed" && (
            <button
              type="button"
              className={btnSecondary}
              onClick={handleFooterAction}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function InboundDetail({
  order,
  onClose,
  onReceive,
  onCancelOrder,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const statusMeta = inboundStatusMeta[order.status] || inboundStatusMeta.new_order;
  const fulfillments = order.fulfillments || { received: [] };
  const isFinished = order.status === "completed" || order.status === "canceled";

  const qtyOrderedTotal = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const qtyReceivedTotal = order.lines.reduce(
    (sum, line) => sum + (line.quantity_on_received || 0),
    0
  );

  const latestUpdated = order.logs
    ? `Terakhir diperbarui oleh ${order.logs.updated_by} pada ${order.logs.updated_at.replace("T", " ")}`
    : null;

  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div className="absolute inset-0 bg-slate-900/55" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-full max-w-[1024px] flex-col overflow-y-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <button
              type="button"
              className="text-[13px] font-medium text-brand"
              onClick={onClose}
            >
              Pemenuhan pesanan pembelian
            </button>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="m-0 text-[22px] font-bold text-gray-900">
                Pesanan pembelian #{order.order_number}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}
              >
                {statusMeta.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="border-b border-gray-100 pb-5">
            <div className="text-[13px] text-gray-500">Pemasok</div>
            <div className="text-sm font-medium text-brand">{order.person_name}</div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-b border-gray-100 py-5">
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Tanggal pesanan</div>
                <div className="text-sm text-gray-900">{order.order_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Tanggal jatuh tempo</div>
                <div className="text-sm text-gray-900">{order.due_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Nomor pesanan pembelian</div>
                <div className="text-sm font-medium text-brand">{order.order_number}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Nomor referensi pemasok</div>
                <div className="text-sm text-gray-900">{order.reference_no || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Gudang</div>
                <div className="text-sm text-gray-900">{order.warehouse_name}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Memo</div>
                <div className="text-sm text-gray-900">{order.memo || "-"}</div>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-gray-500">Alamat pengiriman</div>
              <div className="text-sm text-gray-900">{order.person_address || "-"}</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Tanggal pembatalan</div>
                <div className="text-sm text-gray-900">{order.close_date || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Alasan pembatalan</div>
                <div className="text-sm text-gray-900">{order.close_reason || "-"}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[10px] border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Produk</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kuantitas dipesan</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kuantitas diterima</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Satuan</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id} className="border-b border-slate-100 align-top">
                    <td className="px-3.5 py-3">
                      <div className="flex gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                          <span className="text-[10px] text-gray-400">Foto</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand">{line.product_name}</div>
                          {line.product_description && (
                            <div className="text-xs text-gray-500">{line.product_description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">
                      {line.quantity_on_received}
                    </td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">
                    Total kuantitas
                  </td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
                    {qtyOrderedTotal}
                  </td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
                    {qtyReceivedTotal}
                  </td>
                  <td className="px-3.5 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          {latestUpdated && (
            <button
              type="button"
              className="mb-4 text-[13px] font-medium text-brand"
              onClick={() => showToast && showToast(latestUpdated)}
            >
              {latestUpdated}
            </button>
          )}

          <div className="flex gap-6 border-b border-gray-200">
            {[
              { label: "Penerimaan barang", total: fulfillments.received.length },
            ].map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                className={
                  activeTab === index
                    ? "-mb-px border-b-2 border-brand pb-2.5 text-sm font-semibold text-brand"
                    : "pb-2.5 text-sm font-medium text-gray-500 hover:text-gray-900"
                }
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
                {tab.total > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                    {tab.total}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="mt-4">
              {fulfillments.received.length > 0 ? (
                <div className="overflow-hidden rounded-[10px] border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Nomor</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Tanggal penerimaan
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Tanggal pengiriman
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Kurir</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fulfillments.received.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="px-3.5 py-3 text-sm font-medium text-brand">
                            {item.number}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.delivery_date || "-"}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.courier || "-"}
                          </td>
                          <td className="px-3.5 py-3">
                            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                              Diterima
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 py-8 text-center">
                  <h3 className="m-0 text-base font-semibold text-gray-900">
                    Belum ada penerimaan barang
                  </h3>
                  <p className="m-0 text-sm text-gray-500">
                    Penerimaan barang akan ditampilkan di sini
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-6">
          {!isFinished ? (
            <button
              type="button"
              className="text-[13px] font-medium text-gray-600 underline-offset-2 hover:underline"
              onClick={() => onCancelOrder(order)}
            >
              Batalkan pemenuhan pesanan
            </button>
          ) : (
            <div />
          )}
          {!isFinished && (
            <button type="button" className={btnSecondary} onClick={() => onReceive(order)}>
              Buat penerimaan barang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FulfillmentContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");
  const [warehouseId, setWarehouseId] = useState(0);
  const [periodSlug, setPeriodSlug] = useState("week");
  const [search, setSearch] = useState("");

  const [outbounds, setOutbounds] = useState(outboundOrders);
  const [inbounds, setInbounds] = useState(inboundOrders);

  const [detailOrder, setDetailOrder] = useState(null);
  const [detailType, setDetailType] = useState("sales");

  const [processOrder, setProcessOrder] = useState(null);
  const [pickingOrder, setPickingOrder] = useState(null);
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [goodsReceiptOrder, setGoodsReceiptOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);

  const [toast, setToast] = useState(null);

  const isSales = activeTab === "sales";

  const filteredOrders = useMemo(() => {
    const source = isSales ? outbounds : inbounds;
    return source.filter((order) => {
      const matchWarehouse = warehouseId === 0 || order.warehouse_id === warehouseId;
      const matchSearch =
        !search ||
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.person_name.toLowerCase().includes(search.toLowerCase());
      return matchWarehouse && matchSearch;
    });
  }, [isSales, outbounds, inbounds, warehouseId, search]);

  const columns = isSales ? outboundKanbanColumns : inboundKanbanColumns;
  const statusMeta = isSales ? outboundStatusMeta : inboundStatusMeta;
  const actions = isSales ? outboundActions : inboundActions;
  const warehouseOptions = isSales ? warehouseOptionsSales : warehouseOptionsPurchase;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const openDetail = (order) => {
    setDetailType(isSales ? "sales" : "purchase");
    setDetailOrder(order);
  };

  const closeDetail = () => {
    setDetailOrder(null);
    setDetailType("sales");
  };

  const moveOrder = (orderId, status, extra) => {
    if (isSales) {
      setOutbounds((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status, ...(extra || {}) } : order
        )
      );
    } else {
      setInbounds((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status, ...(extra || {}) } : order
        )
      );
    }
  };

  const handleAction = (order, actionKey) => {
    if (actionKey === "process") setProcessOrder(order);
    else if (actionKey === "pick") setPickingOrder(order);
    else if (actionKey === "deliver") setDeliveryOrder(order);
    else if (actionKey === "complete") setReceiptOrder(order);
    else if (actionKey === "receive") setGoodsReceiptOrder(order);
    else if (actionKey === "cancel") setCancelOrder({ order, type: "order" });
    else if (actionKey === "cancelProcess") setCancelOrder({ order, type: "process" });
    else if (actionKey === "cancelPick") {
      moveOrder(order.id, "on_process");
      showToast("Daftar pengambilan barang berhasil dibatalkan");
    }
  };

  const handleProcessed = (order, lines) => {
    const updatedLines = order.lines.map((line) => {
      const found = lines.find((l) => l.fulfillment_order_line_id === line.id);
      return found ? { ...line, quantity_on_process: line.quantity_on_process + Number(found.quantity) } : line;
    });
    moveOrder(order.id, "on_process", { lines: updatedLines });
    setProcessOrder(null);
    showToast("Pesanan berhasil diproses");
  };

  const handlePickingCreated = (order, number) => {
    const date = new Date().toISOString().slice(0, 10);
    const onProcess = order.current_fulfillments.on_process[0];
    const pickedItem = onProcess
      ? { id: onProcess.id, number, date, status: "picked" }
      : { id: Date.now(), number, date, status: "picked" };
    moveOrder(order.id, "picked", {
      current_fulfillments: {
        ...order.current_fulfillments,
        on_process: [],
        picked: [pickedItem],
      },
      fulfillments: {
        ...order.fulfillments,
        picked: [...(order.fulfillments.picked || []), pickedItem],
      },
    });
    setPickingOrder(null);
    showToast("Daftar pengambilan barang berhasil dibuat");
  };

  const handleDeliveryCreated = (order, payload) => {
    const updatedLines = order.lines.map((line) => {
      const found = (payload.fulfillment_lines || []).find((l) => l.fulfillment_order_line_id === line.id);
      return found ? { ...line, quantity_on_delivery: line.quantity_on_delivery + Number(found.quantity) } : line;
    });
    const date = payload.delivery_date || new Date().toISOString().slice(0, 10);
    const deliveryNumberValue = payload.number || "DO-2026-00X";
    const deliveredItem = {
      id: Date.now(),
      number: deliveryNumberValue,
      sales_delivery_number: deliveryNumberValue,
      date,
      courier: payload.courier || "",
      tracking_number: payload.tracking_number || "",
      latest: true,
      completed_id: null,
    };
    const prevDelivered = (order.fulfillments.delivered || []).map((item) => ({
      ...item,
      latest: false,
    }));
    moveOrder(order.id, "delivered", {
      lines: updatedLines,
      courier: payload.courier,
      tracking_number: payload.tracking_number,
      current_fulfillments: {
        ...order.current_fulfillments,
        picked: [],
        delivered: [deliveredItem],
      },
      fulfillments: {
        ...order.fulfillments,
        delivered: [...prevDelivered, deliveredItem],
      },
    });
    setDeliveryOrder(null);
    showToast("Surat jalan berhasil dibuat");
  };

  const handleReceiptCreated = (order) => {
    const delivered = order.current_fulfillments.delivered?.[0];
    if (delivered) {
      moveOrder(order.id, "completed", {
        current_fulfillments: {
          ...order.current_fulfillments,
          delivered: [],
        },
        fulfillments: {
          ...order.fulfillments,
          delivered: (order.fulfillments.delivered || []).map((item) =>
            item.id === delivered.id
              ? { ...item, latest: false, completed_id: Date.now() }
              : item
          ),
        },
      });
    } else {
      moveOrder(order.id, "completed");
    }
    setReceiptOrder(null);
    showToast("Tanda terima berhasil dibuat");
  };

  const handleGoodsReceiptCreated = (order, lines) => {
    const updatedLines = order.lines.map((line) => {
      const found = lines.find((l) => l.fulfillment_order_line_id === line.id);
      return found ? { ...line, quantity_on_received: line.quantity_on_received + Number(found.quantity) } : line;
    });
    const allComplete = updatedLines.every((line) => line.quantity_on_received >= line.quantity);
    moveOrder(order.id, allComplete ? "completed" : "partially_completed", { lines: updatedLines });
    setGoodsReceiptOrder(null);
    showToast("Penerimaan barang berhasil disimpan");
  };

  const handleCancelConfirm = () => {
    if (!cancelOrder) return;
    const { order, type } = cancelOrder;
    if (type === "process") {
      const resetLines = order.lines.map((line) => ({ ...line, quantity_on_process: 0 }));
      moveOrder(order.id, "new_order", { lines: resetLines });
      showToast("Proses pesanan berhasil dibatalkan");
    } else {
      moveOrder(order.id, "canceled", { close_date: "2026-09-30", close_reason: "Dibatalkan oleh pengguna" });
      showToast("Pemenuhan pesanan berhasil dibatalkan");
    }
    setCancelOrder(null);
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">
          Pemenuhan pesanan
        </h2>
        <GroupingButton />
      </div>

      <MainTab activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4 rounded-[10px] border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Gudang</label>
              <select
                className={`${selectBase} w-full`}
                value={warehouseId}
                onChange={(event) => setWarehouseId(Number(event.target.value))}
              >
                {warehouseOptions.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Periode</label>
              <select
                className={`${selectBase} w-full`}
                value={periodSlug}
                onChange={(event) => setPeriodSlug(event.target.value)}
              >
                {periodOptions.map((period) => (
                  <option key={period.slug} value={period.slug}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-start gap-4 md:justify-end">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => showToast("Data berhasil dimuat ulang")}
            >
              <ArrowsClockwise size={14} />
              <span>Muat ulang</span>
            </button>
            <div className="relative">
              <MagnifyingGlass
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className={`${inputBase} w-[238px] pl-9`}
                placeholder={isSales ? "Cari transaksi" : "Cari…"}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>

        <KanbanBoard
          orders={filteredOrders}
          columns={columns}
          statusMeta={statusMeta}
          actions={actions}
          onAction={handleAction}
          onOpenDetail={openDetail}
        />
      </div>

      {detailOrder && detailType === "sales" && (
        <OutboundDetail
          order={detailOrder}
          onClose={closeDetail}
          onProcess={(order) => setProcessOrder(order)}
          onPick={(order) => setPickingOrder(order)}
          onDeliver={(order) => setDeliveryOrder(order)}
          onComplete={(order) => setReceiptOrder(order)}
          onCancelOrder={(order) => setCancelOrder({ order, type: "order" })}
          onCancelProcess={(order) => setCancelOrder({ order, type: "process" })}
          onUpdated={moveOrder}
          showToast={showToast}
        />
      )}

      {detailOrder && detailType === "purchase" && (
        <InboundDetail
          order={detailOrder}
          onClose={closeDetail}
          onReceive={(order) => setGoodsReceiptOrder(order)}
          onCancelOrder={(order) => setCancelOrder({ order, type: "order" })}
          showToast={showToast}
        />
      )}

      {processOrder && (
        <ProcessOrderDrawer
          order={processOrder}
          onClose={() => setProcessOrder(null)}
          onSubmit={handleProcessed}
        />
      )}

      {pickingOrder && (
        <CreatePickingListDrawer
          order={pickingOrder}
          number={nextNumbers.picklist}
          onClose={() => setPickingOrder(null)}
          onSubmit={handlePickingCreated}
        />
      )}

      {deliveryOrder && (
        <CreateDeliveryNoteDrawer
          order={deliveryOrder}
          number={nextNumbers.delivery}
          onClose={() => setDeliveryOrder(null)}
          onSubmit={handleDeliveryCreated}
        />
      )}

      {receiptOrder && (
        <CreateReceiptDrawer
          order={receiptOrder}
          number={nextNumbers.receipt}
          onClose={() => setReceiptOrder(null)}
          onSubmit={handleReceiptCreated}
        />
      )}

      {goodsReceiptOrder && (
        <CreateGoodsReceiptDrawer
          order={goodsReceiptOrder}
          number={nextNumbers.goodsReceipt}
          onClose={() => setGoodsReceiptOrder(null)}
          onSubmit={handleGoodsReceiptCreated}
        />
      )}

      {cancelOrder && (
        <CancelOrderModal
          order={cancelOrder.order}
          type={cancelOrder.type}
          onClose={() => setCancelOrder(null)}
          onConfirm={handleCancelConfirm}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[2000] rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          {toast}
        </div>
      )}
    </div>
  );
}

const DARK_CSS = `
.dash-dark { color-scheme: dark; }

/* Tombol aksi */
.dd-btn { background: #1d62a4 !important; color: #fff !important; border-color: #1d62a4 !important; }
.dd-btn:hover { background: #163859 !important; }
.dd-btn:disabled { opacity: 0.5; }
.dash-dark .dd-btn { background: #E5B85C !important; color: #121212 !important; border-color: #E5B85C !important; }
.dash-dark .dd-btn:hover { background: #f0c978 !important; }

/* Tombol sekunder (Reload, Print, dll.) -> outline emas */
.dash-dark button[class*="border-gray-300"]:not(.dd-btn) {
  background-color: transparent !important;
  color: #E5B85C !important;
  border-color: #E5B85C !important;
}
.dash-dark button[class*="border-gray-300"]:not(.dd-btn):hover { background-color: rgba(229,184,92,0.12) !important; }

/* Background */
.dash-dark .bg-white { background-color: #121212 !important; }
.dash-dark .bg-slate-50 { background-color: #1a1a1a !important; }
.dash-dark .bg-gray-50 { background-color: #1a1a1a !important; }
.dash-dark .hover\\:bg-slate-50:hover,
.dash-dark .hover\\:bg-slate-100:hover,
.dash-dark .hover\\:bg-gray-50:hover { background-color: #2d2d2d !important; }

/* Header kolom kanban (bg-[#xxxxxx]) */
.dash-dark [class*="bg-[#"] { background-color: rgba(211,142,13,0.35) !important; }

/* Border */
.dash-dark .border-gray-100,
.dash-dark .border-gray-200,
.dash-dark .border-gray-300,
.dash-dark .border-gray-50,
.dash-dark .border-slate-100 { border-color: #634f27 !important; }
.dash-dark .hover\\:border-gray-500:hover { border-color: #E5B85C !important; }

/* Teks */
.dash-dark .text-gray-900,
.dash-dark .text-gray-700,
.dash-dark .text-slate-900,
.dash-dark .text-black,
.dash-dark .hover\\:text-black:hover,
.dash-dark .hover\\:text-gray-900:hover { color: #f1f5f9 !important; }
.dash-dark .text-gray-600,
.dash-dark .text-gray-500,
.dash-dark .text-slate-600,
.dash-dark .text-slate-500 { color: #cbd5e1 !important; }
.dash-dark .text-gray-400 { color: #94a3b8 !important; }

/* Brand -> emas */
.dash-dark .text-brand { color: #E5B85C !important; }
.dash-dark .border-brand { border-color: #E5B85C !important; }
.dash-dark .focus\\:border-brand:focus { border-color: #E5B85C !important; }

/* Input, select, textarea */
.dash-dark input,
.dash-dark select,
.dash-dark textarea {
  background-color: #262626 !important;
  color: #f1f5f9 !important;
  border-color: #634f27 !important;
}
.dash-dark input::placeholder,
.dash-dark textarea::placeholder { color: #94a3b8; }
.dash-dark input:focus,
.dash-dark select:focus,
.dash-dark textarea:focus { border-color: #E5B85C !important; }
.dash-dark select option { background: #262626; color: #f1f5f9; }

/* Tabel */
.dash-dark thead tr,
.dash-dark th { background-color: #d38e0d69 !important; color: #f1f5f9 !important; }
.dash-dark td { color: #e2e8f0 !important; }

/* Badge status (pastel -> transparan) */
.dash-dark .bg-green-100,
.dash-dark .bg-cyan-100,
.dash-dark .bg-sky-100,
.dash-dark .bg-teal-100,
.dash-dark .bg-red-100 { background-color: rgba(255,255,255,0.12) !important; }
.dash-dark .text-green-700,
.dash-dark .text-cyan-700,
.dash-dark .text-sky-700,
.dash-dark .text-teal-700 { color: #f1f5f9 !important; }

/* Pesan error tetap merah */
.dash-dark .text-red-500,
.dash-dark .text-red-600 { color: #f87171 !important; }
`;

export default function FulfillmentPage() {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light"
  );

  useEffect(() => {
    const sync = () => setThemeMode(localStorage.getItem("app_theme") || "light");
    window.addEventListener("themeChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("themeChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isDark = themeMode === "dark";

  return (
    <div lang="id" className={isDark ? "dash-dark" : ""}>
      <FulfillmentContent />
      <style>{DARK_CSS}</style>
    </div>
  );
}