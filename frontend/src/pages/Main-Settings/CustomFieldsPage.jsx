import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  MagnifyingGlass,
  X,
  Table,
  Minus,
  CaretDown,
  PencilSimple,
  Trash,
  Image as ImageIcon,
} from "@phosphor-icons/react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  selectBase,
  inputBase,
  formLabel,
  btn,
  btnDangerOutline,
  btnModalCancel,
  btnModalSubmit,
  tableBase,
  tableWrapper,
  td,
  th,
  trHover,
  pageSpinner,
} from "@/components/ui/styles";
import { extractError } from "@/services/settingsApi";
import { DropdownPanel } from "@/components/ui/PopoverSelect";
import {
  canManageCustomFields,
  fetchCustomFieldScope,
  useCustomFields,
} from "@/services/useSetting";

const fieldLabels = {
  Sales: "Penjualan",
  Purchases: "Pembelian",
  Products: "Produk",
  Expenses: "Biaya",
  Expense: "Biaya",
  Text: "Teks",
  Number: "Angka",
  Date: "Tanggal",
  Dropdown: "Daftar pilihan",
  Purchase: "Pembelian",
  Product: "Produk",
  Active: "Aktif",
  Inactive: "Nonaktif",
  Deleted: "Dihapus",
  "Sales Order": "Pesanan Penjualan",
  "Sales Invoice": "Faktur Penjualan",
  "Sales Quotation": "Penawaran Penjualan",
  "Sales Delivery": "Pengiriman Penjualan",
  "Sales Return": "Retur Penjualan",
  "Down payment receipt": "Penerimaan Uang Muka",
  "Proforma invoice": "Faktur Proforma",
  "Proforma order": "Pesanan Proforma",
  "Purchase Order": "Pesanan Pembelian",
  "Purchase Invoice": "Faktur Pembelian",
  "Purchase Quotation": "Penawaran Pembelian",
  "Purchase Request": "Permintaan Pembelian",
  "Purchase Return": "Retur Pembelian",
  "Purchase Quote": "Penawaran Pembelian",
  "Purchase Delivery": "Pengiriman Pembelian",
};

function fieldLabel(value) {
  return Object.hasOwn(fieldLabels, value) ? fieldLabels[value] : value;
}

const pageOptions = ["Sales", "Purchases", "Products", "Expenses"];

const typeOptions = [
  {
    label: "Text",
    desc: "Dapat memasukkan informasi berupa huruf, angka, dan simbol",
  },
  {
    label: "Number",
    desc: "Dapat memasukkan bilangan bulat atau pecahan (desimal)",
  },
  {
    label: "Date",
    desc: "Dapat memilih tanggal dari kalender yang tersedia",
  },
  {
    label: "Dropdown",
    desc: "Dapat menampilkan beberapa opsi untuk dipilih",
  },
];

const salesSubPages = [
  "Sales Order",
  "Sales Invoice",
  "Sales Quotation",
  "Sales Delivery",
  "Sales Return",
  "Down payment receipt",
  "Proforma invoice",
  "Proforma order",
];

const purchaseSubPages = [
  "Purchase Order",
  "Purchase Invoice",
  "Purchase Quotation",
  "Purchase Request",
  "Purchase Return",
  "Purchase Quote",
  "Purchase Delivery",
];

const expenseSubPages = ["Expense"];

const subPagesByPage = {
  Sales: salesSubPages,
  Purchases: purchaseSubPages,
  Expenses: expenseSubPages,
};

const salesPreviewRows = [
  ["Pelanggan", "Email"],
  ["Alamat Penagihan", "Tgl transaksi", "No transaksi", "Penanda"],
  ["Tgl jatuh tempo", "No referensi pelanggan"],
  ["Syarat pembayaran", "Gudang"],
];

const salesBottomRows = [
  "Pesan",
  "Memo",
  "Lampiran",
  "Subtotal",
  "Total",
  "Sisa tagihan",
];

const purchasePreviewRows = [
  ["Pemasok", "Email"],
  ["Alamat Penagihan", "Tgl transaksi", "No transaksi", "Penanda"],
  ["Tgl jatuh tempo", "No. referensi pemasok"],
  ["Syarat pembayaran", "Gudang"],
];

const purchaseBottomRows = [
  "Pesan",
  "Memo",
  "Lampiran",
  "Subtotal",
  "Total",
  "Sisa tagihan",
];

const previewRowsByPage = {
  Sales: salesPreviewRows,
  Purchases: purchasePreviewRows,
  Expenses: purchasePreviewRows,
};

const bottomRowsByPage = {
  Sales: salesBottomRows,
  Purchases: purchaseBottomRows,
  Products: [],
  Expenses: purchaseBottomRows,
};

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
  { value: "deleted", label: "Dihapus" },
];

const statusStyles = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-slate-100 text-slate-600",
  deleted: "bg-red-50 text-red-600",
};

const emptyForm = {
  name: "",
  page: "",
  subPages: [],
  fieldType: "",
  useMaxChar: false,
  maxChars: 0,
  useDecimal: false,
  additionalText: "none",
  prefixText: "",
  suffixText: "",
  dateSelection: "none",
  multiSelect: false,
  options: [""],
  mainOption: -1,
  mustFilled: false,
  showInPrint: false,
};

const typeResetValues = {
  useMaxChar: false,
  maxChars: 0,
  useDecimal: false,
  additionalText: "none",
  prefixText: "",
  suffixText: "",
  dateSelection: "none",
  multiSelect: false,
  options: [""],
  mainOption: -1,
};

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildForm(field) {
  if (!field) return emptyForm;

  const options = field.options.length > 0 ? field.options : [""];

  return {
    name: field.name,
    page: capitalize(field.page),
    subPages: field.sub_pages,
    fieldType: capitalize(field.field_type),
    useMaxChar: field.max_chars !== null,
    maxChars: field.max_chars ?? 0,
    useDecimal: field.use_decimal,
    additionalText: field.affix_type,
    prefixText: field.affix_type === "prefix" ? field.affix_text : "",
    suffixText: field.affix_type === "suffix" ? field.affix_text : "",
    dateSelection: field.date_default,
    multiSelect: field.allow_multiple,
    options,
    mainOption: field.default_value ? options.indexOf(field.default_value) : -1,
    mustFilled: field.is_required,
    showInPrint: field.show_in_print,
  };
}

function buildPayload(form) {
  const fieldType = form.fieldType.toLowerCase();
  const options = form.options.map((item) => item.trim());
  const isNumber = fieldType === "number";
  const isDropdown = fieldType === "dropdown";
  let affixText = "";

  if (isNumber && form.additionalText === "prefix") {
    affixText = form.prefixText.trim();
  }

  if (isNumber && form.additionalText === "suffix") {
    affixText = form.suffixText.trim();
  }

  return {
    name: form.name.trim(),
    page: form.page.toLowerCase(),
    sub_pages: form.subPages,
    field_type: fieldType,
    is_required: form.mustFilled,
    show_in_print: form.showInPrint,
    max_chars:
      fieldType === "text" && form.useMaxChar ? Number(form.maxChars) : null,
    use_decimal: isNumber && form.useDecimal,
    affix_type: isNumber ? form.additionalText : "none",
    affix_text: affixText,
    date_default: fieldType === "date" ? form.dateSelection : "none",
    allow_multiple: isDropdown && form.multiSelect,
    options: isDropdown ? options : [],
    default_value:
      isDropdown && form.mainOption >= 0 ? options[form.mainOption] : null,
  };
}

function validateForm(form) {
  if (form.name.trim() === "") {
    return "Nama bidang kustom wajib diisi.";
  }

  if (form.page === "") {
    return "Halaman wajib dipilih.";
  }

  const subPages = subPagesByPage[form.page] || [];

  if (subPages.length > 0 && form.subPages.length === 0) {
    return "Pilih setidaknya satu halaman.";
  }

  if (form.fieldType === "") {
    return "Jenis bidang kustom wajib dipilih.";
  }

  if (
    form.fieldType === "Text" &&
    form.useMaxChar &&
    !(Number(form.maxChars) >= 1)
  ) {
    return "Maximum character must be at least 1.";
  }

  if (
    form.fieldType === "Number" &&
    form.additionalText === "prefix" &&
    form.prefixText.trim() === ""
  ) {
    return "Teks awalan wajib diisi.";
  }

  if (
    form.fieldType === "Number" &&
    form.additionalText === "suffix" &&
    form.suffixText.trim() === ""
  ) {
    return "Teks akhiran wajib diisi.";
  }

  if (form.fieldType === "Dropdown") {
    const options = form.options.map((item) => item.trim());

    if (options.some((item) => item === "")) {
      return "Pilihan pada daftar pilihan tidak boleh kosong.";
    }

    const unique = new Set(options.map((item) => item.toLowerCase()));

    if (unique.size !== options.length) {
      return "Setiap pilihan pada daftar pilihan harus berbeda.";
    }
  }

  return "";
}

function PreviewField({ label }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[13px] font-medium text-slate-500">{label}</p>

      <div className="h-[10px] w-full rounded-sm bg-slate-200" />
    </div>
  );
}

function PreviewCustomField({ name, type, mustFilled, mainOptionLabel }) {
  if (name === "") {
    return null;
  }

  return (
    <div className="rounded-md border border-dashed border-blue-400 bg-white p-4">
      <p className="text-[13px] font-medium text-slate-600">
        {name}
        {mustFilled && <span className="ml-1 text-red-600">*</span>}
      </p>

      {type === "" ? (
        <div className="mt-1.5 h-[10px] w-full rounded-sm bg-slate-200" />
      ) : type === "Dropdown" ? (
        <div className="mt-1.5 flex w-full max-w-[240px] items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2">
          <span className="truncate text-xs text-slate-500">
            {mainOptionLabel}
          </span>

          <CaretDown size={14} className="shrink-0 text-slate-400" />
        </div>
      ) : (
        <div className="mt-1.5 h-9 w-full max-w-[240px] rounded-md border border-slate-300 bg-white" />
      )}
    </div>
  );
}

function AddPopUp({ showQuotaPopup, setShowQuotaPopup }) {
  return (
    <>
      {showQuotaPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[500px] rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                Tambah kuota bidang kustom
              </h2>

              <hr className="border-slate-300"></hr>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-bold text-gray-800">
                199.000 per bidang kustom per tahun
              </p>

              <p className="text-sm leading-6 text-slate-500">
                Hubungi tim Jurnal melalui tombol berikut atau kirim email ke haloqontak@qontak.com untuk menambah kuota Anda.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowQuotaPopup(false)}
                className={btnModalCancel}
              >
                OK, Mengerti
              </button>

              <button className={btnModalSubmit}>
                Hubungi Tim Qontak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReorderPopUp({ onClose, onReorder }) {
  const [page, setPage] = useState("");
  const [subPage, setSubPage] = useState("");
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const subPages = subPagesByPage[page] || [];
  const needsSubPage = page === "Sales" || page === "Purchases";

  async function loadItems(nextPage, nextSubPage) {
    setLoading(true);
    setError("");
    setDirty(false);

    try {
      setItems(await fetchCustomFieldScope(nextPage, nextSubPage));
    } catch (requestError) {
      setItems(null);
      setError(extractError(requestError, "Gagal memuat bidang kustom."));
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(event) {
    const nextPage = event.target.value;

    setPage(nextPage);
    setSubPage("");
    setItems(null);
    setError("");
    setDirty(false);

    if (nextPage === "Products" || nextPage === "Expenses") {
      loadItems(nextPage, "");
    }
  }

  function handleSubPageChange(event) {
    const nextSubPage = event.target.value;

    setSubPage(nextSubPage);
    loadItems(page, nextSubPage);
  }

  function moveItem(index, direction) {
    const target = index + direction;

    if (target < 0 || target >= items.length) {
      return;
    }

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      await onReorder(items.map((item) => item.id));
      onClose();
    } catch (requestError) {
      setError(extractError(requestError, "Gagal menyimpan urutan."));
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[550px] rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-800">
            Ubah urutan bidang kustom
          </h2>

          <hr className="border-slate-300"></hr>
        </div>

        <div className="flex flex-col gap-4">
          <select
            className={selectBase}
            value={page}
            onChange={handlePageChange}
          >
            <option value="" disabled>
              Pilih Halaman
            </option>

            {pageOptions.map((item) => (
              <option key={item} value={item}>
                {fieldLabel(item)}
              </option>
            ))}
          </select>

          {needsSubPage && (
            <select
              className={selectBase}
              value={subPage}
              onChange={handleSubPageChange}
            >
              <option value="" disabled>
                Pilih subhalaman
              </option>

              {subPages.map((item) => (
                <option key={item} value={item}>
                  {fieldLabel(item)}
                </option>
              ))}
            </select>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <div className={`${pageSpinner} h-7 w-7`} />
            </div>
          )}

          {!loading && items !== null && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="font-bold text-gray-800">
                Halaman ini belum memiliki bidang kustom
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Silakan tambahkan bidang kustom.
              </p>
            </div>
          )}

          {!loading && items !== null && items.length > 0 && (
            <ul className="m-0 flex max-h-[300px] list-none flex-col gap-2 overflow-y-auto p-0">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>

                    <p className="m-0 text-xs text-slate-500">
                      {fieldLabel(capitalize(item.field_type))} · {fieldLabel(capitalize(item.status))}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || saving}
                      aria-label="Pindahkan ke atas"
                      className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ArrowUp size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1 || saving}
                      aria-label="Pindahkan ke bawah"
                      className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {error !== "" && (
            <p className="m-0 whitespace-pre-line text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className={btnModalCancel}
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={btnModalSubmit}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomFieldFormPopUp({ field, onClose, onSubmit }) {
  const subPageRef = useRef(null);
  const [initialForm] = useState(() => buildForm(field));
  const [form, setForm] = useState(initialForm);
  const [showSubPageList, setShowSubPageList] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(field);
  const subPages = subPagesByPage[form.page] || [];
  const previewRows = previewRowsByPage[form.page] || [];
  const bottomRows = bottomRowsByPage[form.page] || [];
  const selectedSubPageCount = form.subPages.length;
  const subPagePlaceholder =
    form.page === "Sales"
      ? "Pilih halaman penjualan"
      : form.page === "Purchases"
        ? "Pilih halaman pembelian"
        : "Pilih halaman";
  const tableHeaders = [
    "Produk",
    "Deskripsi",
    "Kuantitas",
    "Satuan",
    "Harga satuan",
    "Jumlah",
  ];
  const allChecked =
    subPages.length > 0 && subPages.every((item) => form.subPages.includes(item));
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);
  const mainOptionLabel =
    form.mainOption >= 0 ? form.options[form.mainOption] : "";

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }));
    setError("");
  }

  function handlePageChange(event) {
    update({ page: event.target.value, subPages: [] });
  }

  function handleTypeChange(event) {
    update({ fieldType: event.target.value, ...typeResetValues });
  }

  function toggleSubPage(item) {
    update({
      subPages: form.subPages.includes(item)
        ? form.subPages.filter((value) => value !== item)
        : [...form.subPages, item],
    });
  }

  function toggleSelectAll() {
    update({ subPages: allChecked ? [] : [...subPages] });
  }

  function handleAddOption() {
    update({ options: [...form.options, ""] });
  }

  function handleDeleteOption(index) {
    if (form.options.length <= 1) {
      return;
    }

    let nextMain = form.mainOption;

    if (nextMain === index) nextMain = -1;
    else if (nextMain > index) nextMain -= 1;

    update({
      options: form.options.filter((item, i) => i !== index),
      mainOption: nextMain,
    });
  }

  function handleOptionChange(index, value) {
    update({
      options: form.options.map((item, i) => (i === index ? value : item)),
    });
  }

  function handleClose() {
    if (isDirty) {
      setShowConfirmLeave(true);
    } else {
      onClose();
    }
  }

  async function handleSubmit() {
    const message = validateForm(form);

    if (message !== "") {
      setError(message);
      return;
    }

    setSaving(true);

    try {
      await onSubmit(buildPayload(form));
    } catch (requestError) {
      setError(extractError(requestError, "Gagal menyimpan bidang kustom."));
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? "Ubah bidang kustom" : "Tambah bidang kustom"}
          </h2>

          <button
            onClick={handleClose}
            className="cursor-pointer rounded-md border-0 bg-transparent p-1 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5 md:flex-row">
          <div className="flex w-full flex-col gap-5 md:w-[340px] md:shrink-0">
            <div>
              <label className={formLabel}>
                Nama bidang kustom <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                maxLength={25}
                value={form.name}
                onChange={(event) => update({ name: event.target.value })}
                className={inputBase}
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {form.name.length} / 25
              </p>
            </div>

            <div>
              <label className={formLabel}>
                Halaman <span className="text-red-600">*</span>
              </label>

              <select
                value={form.page}
                onChange={handlePageChange}
                className={`${selectBase} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  Pilih halaman
                </option>

                {pageOptions.map((item) => (
                  <option key={item} value={item}>
                    {fieldLabel(item)}
                  </option>
                ))}
              </select>

              {subPages.length > 0 && (
                <div className="relative mt-3">
                  <button
                    type="button"
                    ref={subPageRef}
                    onClick={() => setShowSubPageList((prev) => !prev)}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-[9px] text-left"
                  >
                    <span className="text-sm text-slate-500">
                      {selectedSubPageCount === 0
                        ? subPagePlaceholder
                        : `${selectedSubPageCount} halaman dipilih`}
                    </span>

                    <CaretDown
                      size={16}
                      className={`shrink-0 text-slate-400 transition-transform ${showSubPageList ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showSubPageList && (
                    <DropdownPanel
                      rect={subPageRef.current?.getBoundingClientRect()}
                      triggerRef={subPageRef}
                      onClose={() => setShowSubPageList(false)}
                      maxHeight={200}
                      variant="settings"
                      className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                    >
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 accent-brand"
                        />

                        Pilih semua
                      </label>

                      {subPages.map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={form.subPages.includes(item)}
                            onChange={() => toggleSubPage(item)}
                            className="h-4 w-4 accent-brand"
                          />

                          {fieldLabel(item)}
                        </label>
                      ))}
                    </DropdownPanel>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={formLabel}>
                Jenis bidang kustom <span className="text-red-600">*</span>
              </label>

              <select
                value={form.fieldType}
                onChange={handleTypeChange}
                className={`${selectBase} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  Pilih jenis bidang kustom
                </option>

                {typeOptions.map((item) => (
                  <option key={item.label} value={item.label}>
                    {fieldLabel(item.label)} — {item.desc}
                  </option>
                ))}
              </select>
            </div>

            {form.fieldType === "Text" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.useMaxChar}
                    onChange={(event) =>
                      update({ useMaxChar: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Memiliki batas maksimal karakter sebanyak
                </label>

                {form.useMaxChar && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={form.maxChars}
                      onChange={(event) =>
                        update({ maxChars: Number(event.target.value) })
                      }
                      className={`${inputBase} w-28`}
                    />

                    <span className="text-sm text-slate-500">Karakter</span>
                  </div>
                )}
              </div>
            )}

            {form.fieldType === "Number" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.useDecimal}
                    onChange={(event) =>
                      update({ useDecimal: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Use fractions (decimals)
                </label>

                <p className="text-sm font-semibold text-gray-800">
                  Teks tambahan
                </p>

                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="additionalText"
                    checked={form.additionalText === "none"}
                    onChange={() => update({ additionalText: "none" })}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />

                  <span>
                    Without addition
                  </span>
                </label>

                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="additionalText"
                      checked={form.additionalText === "prefix"}
                      onChange={() => update({ additionalText: "prefix" })}
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />

                    <span>
                      Awalan
                      <span className="block text-xs text-slate-500">
                        Teks ditambahkan sebelum angka.
                      </span>
                      <span className="block text-xs text-slate-500">
                        Contoh: Simbol mata uang (Rp50.000)
                      </span>
                    </span>
                  </label>

                  {form.additionalText === "prefix" && (
                    <input
                      type="text"
                      maxLength={30}
                      value={form.prefixText}
                      onChange={(event) =>
                        update({ prefixText: event.target.value })
                      }
                      className={inputBase}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="additionalText"
                      checked={form.additionalText === "suffix"}
                      onChange={() => update({ additionalText: "suffix" })}
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />

                    <span>
                      Akhiran
                      <span className="block text-xs text-slate-500">
                        Teks ditambahkan setelah angka.
                      </span>
                      <span className="block text-xs text-slate-500">
                        Contoh: Panjang produk (5 cm)
                      </span>
                    </span>
                  </label>

                  {form.additionalText === "suffix" && (
                    <input
                      type="text"
                      maxLength={30}
                      value={form.suffixText}
                      onChange={(event) =>
                        update({ suffixText: event.target.value })
                      }
                      className={inputBase}
                    />
                  )}
                </div>
              </div>
            )}

            {form.fieldType === "Date" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-800">
                  Pemilihan tanggal pada bidang kustom
                </p>

                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="dateSelection"
                    checked={form.dateSelection === "none"}
                    onChange={() => update({ dateSelection: "none" })}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />

                  <span>
                    Kosong
                    <span className="block text-xs text-slate-500">
                      Tanggal harus dipilih secara manual
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="dateSelection"
                    checked={form.dateSelection === "today"}
                    onChange={() => update({ dateSelection: "today" })}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />

                  <span>
                    Tanggal hari ini
                    <span className="block text-xs text-slate-500">
                      Dipilih otomatis saat membuat atau menambah transaksi, produk, dan kontak
                    </span>
                  </span>
                </label>
              </div>
            )}

            {form.fieldType === "Dropdown" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.multiSelect}
                    onChange={(event) =>
                      update({ multiSelect: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Dapat memilih lebih dari satu pilihan
                </label>

                <p className="text-sm font-semibold text-gray-800">
                  Pilihan ({form.options.length})
                </p>

                {form.options.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={100}
                      value={item}
                      onChange={(event) =>
                        handleOptionChange(index, event.target.value)
                      }
                      className={inputBase}
                    />

                    <label className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={form.mainOption === index}
                        onChange={() =>
                          update({
                            mainOption: form.mainOption === index ? -1 : index,
                          })
                        }
                        className="h-4 w-4 accent-brand"
                      />

                      Jadikan pilihan utama
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteOption(index)}
                      disabled={form.options.length <= 1}
                      className="shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={form.options.length >= 50}
                  className="cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Tambah opsi
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
              <p className="text-sm font-semibold text-gray-800">
                Pengaturan tambahan
              </p>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.mustFilled}
                  onChange={(event) =>
                    update({ mustFilled: event.target.checked })
                  }
                  className="h-4 w-4 accent-brand"
                />

                Bidang kustom wajib diisi
              </label>

              {form.page !== "" && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.showInPrint}
                    onChange={(event) =>
                      update({ showInPrint: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Tampilkan bidang kustom saat dicetak
                </label>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-full">
            <p className="text-sm font-semibold text-gray-800">Pratinjau</p>

            {form.page === "" ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 p-4 text-center">
                <Table size={28} className="text-brand" />

                <p className="text-sm font-medium text-gray-800">
                  Pratinjau bidang kustom akan tampil di sini
                </p>

                <p className="text-xs text-slate-500">
                  Pilih halaman terlebih dahulu.
                </p>
              </div>
            ) : form.page === "Products" ? (
              <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
                <div className="flex gap-6">
                  <div className="flex flex-1 flex-col gap-2.5">
                    <PreviewField label="Nama Produk" />

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Kode Produk/SKU" />
                      <PreviewField label="Barcode" />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Satuan" />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Kategori Produk" />
                    </div>

                    <PreviewField label="Deskripsi" />

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Tipe Produk" />
                    </div>
                  </div>

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-slate-200">
                    <ImageIcon size={26} className="text-slate-400" />
                  </div>
                </div>

                <PreviewCustomField
                  name={form.name}
                  type={form.fieldType}
                  mustFilled={form.mustFilled}
                  mainOptionLabel={mainOptionLabel}
                />

                <div className="flex gap-6 border-b border-slate-200">
                  <p className="-mb-px border-b-2 border-blue-500 pb-2 text-[13px] font-medium text-blue-500">
                    Harga &amp; persediaan
                  </p>

                  <p className="pb-2 text-[13px] font-medium text-slate-500">
                    Pengaturan bundle
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-x-6">
                    <PreviewField label="Saya beli produk ini" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-6">
                    <PreviewField label="Saya jual produk ini" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-6">
                    <PreviewField label="Monitor persediaan barang" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
                {previewRows.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="grid grid-cols-2 gap-x-6 gap-y-2.5"
                  >
                    {row.map((label) => (
                      <PreviewField key={label} label={label} />
                    ))}
                  </div>
                ))}

                <PreviewCustomField
                  name={form.name}
                  type={form.fieldType}
                  mustFilled={form.mustFilled}
                  mainOptionLabel={mainOptionLabel}
                />

                <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
                  <div className="grid grid-cols-6 gap-x-4">
                    {tableHeaders.map((header) => (
                      <p
                        key={header}
                        className="text-[11px] font-semibold text-slate-600"
                      >
                        {header}
                      </p>
                    ))}
                  </div>

                  <div className="h-[10px] w-full rounded-sm bg-slate-200" />
                </div>

                {bottomRows.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-slate-200 pt-3">
                    {bottomRows.map((label) => (
                      <PreviewField key={label} label={label} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          {error !== "" && (
            <p className="m-0 mr-auto whitespace-pre-line text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleClose}
            disabled={saving}
            className={btnModalCancel}
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={btnModalSubmit}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>

          {showConfirmLeave && (
            <div className="absolute bottom-[70px] right-6 z-10 w-[270px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <p className="text-sm font-bold text-gray-800">
                Keluar dari proses ini?
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Data yang telah Anda isi tidak akan disimpan.
              </p>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmLeave(false)}
                  className={btnModalCancel}
                >
                  Lanjutkan {isEdit ? "editing" : "addition"}
                </button>

                <button onClick={onClose} className={btnModalSubmit}>
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomFieldsPage() {
  const canManage = canManageCustomFields();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showQuotaPopup, setShowQuotaPopup] = useState(false);
  const [showReorderPopup, setShowReorderPopup] = useState(false);
  const [formTarget, setFormTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const { fields, quota, loading, error, create, update, remove, reorder } =
    useCustomFields({ status: statusFilter, search });

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const remainingQuota = Math.max(quota.quota - quota.used, 0);
  const quotaReached = quota.quota > 0 && quota.used >= quota.quota;
  const isFiltering = statusFilter !== "" || search !== "";

  function handleAdd() {
    if (quotaReached) {
      setShowQuotaPopup(true);
      return;
    }

    setFormTarget({ field: null });
  }

  async function handleFormSubmit(payload) {
    if (formTarget.field) {
      await update(formTarget.field.id, payload);
    } else {
      await create(payload);
    }

    setFormTarget(null);
  }

  async function handleToggleStatus(field) {
    setBusyId(field.id);

    try {
      await update(field.id, {
        status: field.status === "active" ? "inactive" : "active",
      });
    } catch (requestError) {
      alert(extractError(requestError, "Gagal mengubah status bidang kustom."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(field) {
    setBusyId(field.id);

    try {
      await remove(field.id);
    } catch (requestError) {
      alert(extractError(requestError, "Gagal menghapus bidang kustom."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[28px] font-bold text-gray-900 max-md:text-2xl">
            Bidang Kustom
          </h1>
          <p className="m-0 mt-1.5 text-slate-500">
            Kelola bidang kustom untuk transaksi dan produk Anda.
          </p>
        </div>

        {canManage && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowReorderPopup(true)}
              className={btnModalCancel}
            >
              Ubah urutan bidang kustom
            </button>

            <button onClick={handleAdd} className={btnModalSubmit}>
              Tambah bidang kustom
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-md font-bold text-gray-800">
            Kuota Bidang Kustom : {remainingQuota}
          </p>

          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">
              Atur bidang kustom sesuai kebutuhan bisnis Anda. Perlu lebih banyak bidang kustom?
            </p>

            <button
              onClick={() => setShowQuotaPopup(true)}
              className="text-sm text-blue-500 hover:cursor-pointer"
            >
              Tambah Kuota Bidang Kustom
            </button>
          </div>

          <hr className="mt-6 border-gray-300" />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-[200px]">
              <select
                className={`${selectBase} w-[150px]`}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex w-[280px] items-center gap-2 rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
              <MagnifyingGlass
                size={19}
                className="shrink-0 text-slate-500"
              />

              <input
                type="text"
                placeholder="Cari bidang kustom"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {error !== "" ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-base font-bold text-gray-800">
              Gagal memuat bidang kustom
            </h2>

            <p className="mt-1 whitespace-pre-line text-sm text-red-600">
              {error}
            </p>
          </div>
        ) : loading && fields.length === 0 ? (
          <div className="flex justify-center p-20">
            <div className={`${pageSpinner} h-8 w-8`} />
          </div>
        ) : fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-base font-bold text-gray-800">
              {isFiltering
                ? "Bidang kustom tidak ditemukan"
                : "Daftar bidang kustom akan tampil di sini"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isFiltering
                ? "Coba ubah filter status atau kata kunci pencarian."
                : "Tambahkan bidang kustom melalui tombol Tambah bidang kustom"}
            </p>
          </div>
        ) : (
          <div className={`${tableWrapper} mt-6`}>
            <table className={tableBase}>
              <thead>
                <tr>
                  <th className={th}>Nama</th>
                  <th className={th}>Halaman</th>
                  <th className={th}>Jenis</th>
                  <th className={th}>Wajib diisi</th>
                  <th className={th}>Status</th>
                  {canManage && <th className={th}>Tindakan</th>}
                </tr>
              </thead>

              <tbody>
                {fields.map((field) => (
                  <tr key={field.id} className={trHover}>
                    <td className={`${td} font-semibold text-gray-800`}>
                      {field.name}
                    </td>

                    <td className={td}>
                      <p className="m-0">{fieldLabel(capitalize(field.page))}</p>

                      {field.sub_pages.length > 0 && (
                        <p className="m-0 mt-0.5 text-xs text-slate-500">
                          {field.sub_pages.map(fieldLabel).join(", ")}
                        </p>
                      )}
                    </td>

                    <td className={td}>{fieldLabel(capitalize(field.field_type))}</td>

                    <td className={td}>{field.is_required ? "Ya" : "Tidak"}</td>

                    <td className={td}>
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[field.status]}`}
                      >
                        {fieldLabel(capitalize(field.status))}
                      </span>
                    </td>

                    {canManage && (
                      <td className={td}>
                        {field.status !== "deleted" && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setFormTarget({ field })}
                              disabled={busyId === field.id}
                              className={btn}
                            >
                              <PencilSimple size={14} />
                              Ubah
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(field)}
                              disabled={busyId === field.id}
                              className={btn}
                            >
                              {field.status === "active"
                                ? "Nonaktifkan"
                                : "Aktifkan"}
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(field)}
                              disabled={busyId === field.id}
                              className={btnDangerOutline}
                            >
                              <Trash size={14} />
                              Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddPopUp
        showQuotaPopup={showQuotaPopup}
        setShowQuotaPopup={setShowQuotaPopup}
      />

      {formTarget && (
        <CustomFieldFormPopUp
          key={formTarget.field ? formTarget.field.id : "new"}
          field={formTarget.field}
          onClose={() => setFormTarget(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {showReorderPopup && (
        <ReorderPopUp
          onClose={() => setShowReorderPopup(false)}
          onReorder={reorder}
        />
      )}

      <ConfirmDialog
        confirmText="Hapus"
        cancelText="Batal"
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Hapus bidang kustom?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" akan dihapus dari formulir Anda.`
            : ""
        }
        action="delete"
      />
    </div>
  );
}
