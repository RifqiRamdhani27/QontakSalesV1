import { useEffect, useRef, useState } from "react";
import { btn, btnModalCancel, btnModalSubmit as _btnModalSubmit, btnPrimary as _btnPrimary, btnSecondary, formGroup, formLabel, inputBase, modalFooter, modalHeader, modalOverlay, modalPanel, modalTitle, selectBase, tableBase, tableCard, tableWrapper, td, th, textareaBase, trHover } from "@/components/ui/styles";
import { ArrowsDownUp, BookOpen, CaretDown, DownloadSimple, Funnel, GitBranch, Info, MagnifyingGlass, MoneyWavy, Package, UploadSimple, X } from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";
import { bomCategoryOptions, bomCostingReferenceOptions, exportCategoryOptions, exportCostingMethodOptions, productionAccountOptions, productionCostCategoryOptions, productionCostRows, productionSubassemblyOptions, productionVariableAccountOptions, workOrderCategoryOptions, workOrderStatusOptions, workOrderTypeOptions } from "@/data/productionData";

const btnPrimary = `${_btnPrimary} dd-btn`;
const btnModalSubmit = `${_btnModalSubmit} dd-btn`;
const largeModalOverlay = "fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-900/55 p-6";
const modalPanelVisible = modalPanel.replace("overflow-hidden", "overflow-visible");
const inputError = inputBase.replace("border-gray-300", "border-red-500");
function formatRupiah(value) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value || 0)}`;
}
const standardCostCategoryOptions = [{
  value: "product",
  label: "Komponen produk"
}, {
  value: "cost",
  label: "Biaya produksi"
}];
function getAccountLabel(value) {
  return productionAccountOptions.find(option => option.value === value)?.label ?? value;
}
function getCostCategoryLabel(value) {
  return productionCostCategoryOptions.find(option => option.value === value)?.label ?? value;
}
function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
function Dropdown({
  trigger,
  children,
  align = "left"
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setOpen(false));
  return <div className="relative inline-block" ref={containerRef}>
    {trigger({
      open,
      toggle: () => setOpen(prev => !prev)
    })}
    {open && <div className={`absolute z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg ${align === "right" ? "right-0" : "left-0"}`}>
      {children({
        close: () => setOpen(false)
      })}
    </div>}
  </div>;
}
function SelectField({
  options = [],
  value,
  onChange,
  placeholder,
  emptyText = "Data tidak ditemukan",
  error = false,
  footerAction
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => {
    setOpen(false);
    setQuery("");
  });
  const selected = options.find(option => option.value === value);
  const filtered = options.filter(option => option.label.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="relative" ref={containerRef}>
    <input type="text" value={open ? query : selected ? selected.label : ""} placeholder={open && selected ? selected.label : placeholder} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={event => {
      setQuery(event.target.value);
      setOpen(true);
    }} className={`${error ? inputError : inputBase} cursor-pointer pr-9`} />
    <CaretDown size={14} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />

    {open && <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
      <div className="max-h-48 overflow-y-auto">
        {filtered.length === 0 ? <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div> : filtered.map(option => <button key={option.value} type="button" onClick={() => {
          onChange(option.value);
          setOpen(false);
          setQuery("");
        }} className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${option.value === value ? "bg-indigo-50 text-brand" : "text-slate-700"}`}>
          {option.label}
        </button>)}
      </div>
      {footerAction && <div className="mt-1 border-t border-gray-100">
        <button type="button" onClick={() => {
          setOpen(false);
          setQuery("");
          footerAction.onClick();
        }} className="block w-full cursor-pointer px-3 py-2 text-center text-sm font-medium text-brand hover:bg-slate-50">
          {footerAction.label}
        </button>
      </div>}
    </div>}
  </div>;
}
function RupiahInput({
  value,
  onChange,
  disabled = false,
  error = false
}) {
  const shown = new Intl.NumberFormat("id-ID").format(value || 0);
  return <div className={`flex overflow-hidden rounded-lg border ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-slate-100" : "bg-white focus-within:border-brand"}`}>
    <span className="flex items-center bg-slate-100 px-3 text-[13px] font-semibold text-slate-700">
      Rp
    </span>
    <input type="text" inputMode="numeric" disabled={disabled} value={shown} onChange={event => onChange?.(Number(event.target.value.replace(/\D/g, "")))} className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400" />
  </div>;
}
function LabelWithInfo({
  children,
  hint
}) {
  return <label className={formLabel}>
    <span className="inline-flex items-center gap-1">
      {children}
      <span title={hint} className="cursor-help text-slate-400">
        <Info size={14} weight="bold" />
      </span>
    </span>
  </label>;
}
function FieldError({
  children
}) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}
function CategoryRadio({
  name,
  value,
  onChange
}) {
  return <div className="flex items-center gap-5">
    {standardCostCategoryOptions.map(option => <label key={option.value} className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
      <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="h-4 w-4 cursor-pointer accent-brand" />
      {option.label}
    </label>)}
  </div>;
}
function ModalShell({
  title,
  onClose,
  footer,
  children
}) {
  return <div className={modalOverlay}>
    <div className={`${modalPanelVisible} max-w-[480px]`}>
      <div className={modalHeader}>
        <h2 className={modalTitle}>{title}</h2>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>
      <div className="px-[22px] py-5">{children}</div>
      <div className={modalFooter}>{footer}</div>
    </div>
  </div>;
}
function EmptyStateFolder({
  title = "Pemetaan akun biaya akan ditampilkan di sini",
  description
}) {
  return <div className="flex flex-col items-center justify-center py-16 text-center">
    <img src={emptyFolderImg} alt="" className="h-[128px] w-[128px] object-contain" />
    <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
    {description && <p className="mt-1 max-w-xl text-sm text-slate-500">{description}</p>}
  </div>;
}
function EmptyStateTable({
  title,
  description
}) {
  return <div className="flex flex-col items-center justify-center py-24 text-center">
    <img src={emptyFolderImg} alt="" className="h-[128px] w-[128px] object-contain" />
    <p className="mt-3 text-[15px] font-semibold text-slate-800">{title}</p>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>;
}
function AccountCostMenu({
  onSelectMapping,
  onSelectStandardCost
}) {
  return <Dropdown trigger={({
    toggle
  }) => <button type="button" onClick={toggle} className={`${btnSecondary} dd-btn-size`}>
      Atur akun dan biaya standar
      <CaretDown size={14} weight="bold" />
    </button>}>
    {({
      close
    }) => <>
        <button type="button" onClick={() => {
          onSelectMapping();
          close();
        }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
          Pemetaan akun produksi
        </button>
        <button type="button" onClick={() => {
          onSelectStandardCost();
          close();
        }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
          Biaya standar
        </button>
      </>}
  </Dropdown>;
}
function ActionsMenu({
  onCreateBom,
  onCreateWorkOrder
}) {
  return <Dropdown align="right" trigger={({
    toggle
  }) => <button type="button" onClick={toggle} className={`${btnPrimary} dd-btn-size`}>
      Tindakan
      <CaretDown size={14} weight="bold" />
    </button>}>
    {({
      close
    }) => <>
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Daftar kebutuhan bahan (BOM)
        </div>
        <button type="button" onClick={() => {
          onCreateBom();
          close();
        }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
          Buat daftar kebutuhan bahan (BOM)
        </button>
        <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Perintah kerja
        </div>
        <button type="button" onClick={() => {
          onCreateWorkOrder();
          close();
        }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
          Buat perintah kerja
        </button>
      </>}
  </Dropdown>;
}
function ProductionsHeader({
  activeTab,
  onTabChange,
  onSelectMapping,
  onSelectStandardCost,
  onCreateBom,
  onCreateWorkOrder
}) {
  const tabs = [{
    key: "bom",
    label: "Daftar kebutuhan bahan (BOM)"
  }, {
    key: "workOrder",
    label: "Daftar perintah kerja"
  }];
  return <div className="border-b border-gray-200 bg-white px-6 pt-5">
    <div className="flex items-center justify-between">
      <h1 className="text-[22px] font-bold text-slate-900">Produksi</h1>
      <div className="flex items-center gap-2.5">
        <AccountCostMenu onSelectMapping={onSelectMapping} onSelectStandardCost={onSelectStandardCost} />
        <ActionsMenu onCreateBom={onCreateBom} onCreateWorkOrder={onCreateWorkOrder} />
      </div>
    </div>
    <div className="mt-4 flex gap-6">
      {tabs.map(tab => <button key={tab.key} type="button" onClick={() => onTabChange(tab.key)} className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors ${activeTab === tab.key ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
        {tab.label}
      </button>)}
    </div>
  </div>;
}
const bomColumns = [{
  key: "bomName",
  label: "Nama BOM",
  sortable: true
}, {
  key: "bomCode",
  label: "Kode BOM",
  sortable: true
}, {
  key: "category",
  label: "Kategori"
}, {
  key: "costingReference",
  label: "Acuan perhitungan biaya"
}, {
  key: "product",
  label: "Produk"
}, {
  key: "description",
  label: "Deskripsi"
}];
function BomListTab({
  bomList = []
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState(null);
  return <div className="p-6">
    <div className="mb-3 flex items-center justify-between">
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <span role="switch" aria-checked={showArchived} onClick={() => setShowArchived(prev => !prev)} className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${showArchived ? "bg-brand" : "bg-slate-300"}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${showArchived ? "translate-x-4" : "translate-x-0.5"}`} />
        </span>
        Tampilkan BOM yang diarsipkan
      </label>
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={() => setPopup("import")} className="cursor-pointer text-slate-500 hover:text-slate-700">
          <UploadSimple size={16} weight="bold" />
        </button>
        <button type="button" onClick={() => setPopup("export")} className="cursor-pointer text-slate-500 hover:text-slate-700">
          <DownloadSimple size={16} weight="bold" />
        </button>
        <div className="relative">
          <MagnifyingGlass size={16} weight="bold" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari…" className={`${inputBase} w-56 pl-9`} />
        </div>
      </div>
    </div>

    <div className={tableCard}>
      <div className={tableWrapper}>
        <table className={tableBase}>
          <thead>
            <tr>
              {bomColumns.map(column => <th key={column.key} className={th}>
                <span className="inline-flex items-center gap-1">
                  {column.label}
                  {column.sortable && <ArrowsDownUp size={12} weight="bold" />}
                </span>
              </th>)}
            </tr>
          </thead>
          <tbody>
            {bomList.length === 0 && <tr>
              <td colSpan={bomColumns.length}>
                <EmptyStateTable title="Daftar kebutuhan bahan akan ditampilkan di sini" description={<>
                  Buat daftar kebutuhan bahan melalui{" "}
                  <span className="font-semibold text-slate-700">Tindakan</span> .
                </>} />
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
    </div>

    {popup === "import" && <ImportPopup title="Impor BOM" onClose={() => setPopup(null)} onImport={() => setPopup(null)} />}

    {popup === "export" && <ExportBomPopup onClose={() => setPopup(null)} onExport={() => setPopup(null)} />}
  </div>;
}
function WorkOrderListTab({
  workOrderList = []
}) {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState(null);
  const [filters, setFilters] = useState(null);
  return <div className="p-6">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-36 shrink-0">
          <select value={type} onChange={event => setType(event.target.value)} className={inputBase}>
            <option value="">Semua jenis</option>
            {workOrderTypeOptions.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
          </select>
        </div>
        <div className="w-44 shrink-0">
          <select value={status} onChange={event => setStatus(event.target.value)} className={inputBase}>
            <option value="">Semua status</option>
            {workOrderStatusOptions.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={() => setPopup("import")} className="cursor-pointer text-slate-500 hover:text-slate-700">
          <UploadSimple size={16} weight="bold" />
        </button>
        <button type="button" onClick={() => setPopup("filter")} className={btn}>
          <Funnel size={14} weight="bold" />
          Filter
          {filters && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
        </button>
        <div className="relative">
          <MagnifyingGlass size={16} weight="bold" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari…" className={`${inputBase} w-56 pl-9`} />
        </div>
      </div>
    </div>

    {workOrderList.length === 0 && <EmptyStateTable title="Daftar perintah kerja akan ditampilkan di sini" description={<>
      Buat perintah kerja melalui <span className="font-semibold text-slate-700">Tindakan</span> .
    </>} />}

    {popup === "import" && <ImportPopup title="Impor perintah kerja" onClose={() => setPopup(null)} onImport={() => setPopup(null)} />}

    {popup === "filter" && <FilterWorkOrderPopup filters={filters} onClose={() => setPopup(null)} onApply={next => {
      setFilters(next);
      setPopup(null);
    }} onReset={() => {
      setFilters(null);
      setPopup(null);
    }} />}
  </div>;
}
function AddAccountMappingMenu({
  onSelect
}) {
  return <Dropdown align="right" trigger={({
    toggle
  }) => <button type="button" onClick={toggle} className={btnPrimary}>
      Tambah pemetaan akun
      <CaretDown size={14} weight="bold" />
    </button>}>
    {({
      close
    }) => <>
        <button type="button" onClick={() => {
          onSelect("inventory");
          close();
        }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
          Persediaan dalam proses
        </button>
        <button type="button" onClick={() => {
          onSelect("cost");
          close();
        }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
          Biaya produksi
        </button>
      </>}
  </Dropdown>;
}
function AddAccountMappingModal({
  type,
  onClose,
  onSave
}) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isInventory = type === "inventory";
  const info = isInventory ? {
    title: "Pemetaan akun persediaan dalam proses",
    description: "Akun yang dipetakan untuk persediaan dalam proses tidak dapat dihapus atau diarsipkan dari daftar akun (COA)."
  } : {
    title: "Pemetaan akun biaya produksi",
    description: "Akun yang dipetakan untuk biaya produksi tidak dapat dihapus atau diarsipkan dari daftar akun (COA)."
  };
  const nameError = submitted && !name.trim();
  const accountError = submitted && !account;
  const categoryError = submitted && !isInventory && !category;
  function handleSave() {
    setSubmitted(true);
    if (!name.trim() || !account || !isInventory && !category) return;
    onSave({
      type,
      name: name.trim(),
      account,
      category
    });
  }
  return <ModalShell title="Tambah pemetaan akun" onClose={onClose} footer={<>
    <button type="button" onClick={onClose} className={btnModalCancel}>
      Batal
    </button>
    <button type="button" onClick={handleSave} className={btnModalSubmit}>
      Simpan
    </button>
  </>}>
    <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
      <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
      <div>
        <p className="text-sm font-semibold text-slate-800">{info.title}</p>
        <p className="mt-0.5 text-sm text-slate-600">{info.description}</p>
      </div>
    </div>

    <div className={formGroup}>
      <label className={formLabel}>Nama pemetaan akun</label>
      <input type="text" value={name} onChange={event => setName(event.target.value)} className={nameError ? inputError : inputBase} />
      {nameError && <FieldError>Nama pemetaan akun wajib diisi</FieldError>}
    </div>

    <div className={formGroup}>
      <label className={formLabel}>{isInventory ? "Akun persediaan" : "Akun"}</label>
      <SelectField options={productionAccountOptions} value={account} onChange={setAccount} placeholder={isInventory ? "Pilih akun persediaan" : "Pilih akun"} emptyText="Akun tidak ditemukan" error={accountError} />
      {accountError && <FieldError>Akun wajib dipilih</FieldError>}
    </div>

    {!isInventory && <div className={formGroup}>
      <label className={formLabel}>Kategori biaya produksi</label>
      <SelectField options={productionCostCategoryOptions} value={category} onChange={setCategory} placeholder="Pilih kategori biaya produksi" emptyText="Kategori tidak ditemukan" error={categoryError} />
      {categoryError && <FieldError>Kategori biaya produksi wajib dipilih</FieldError>}
    </div>}
  </ModalShell>;
}
const productionCostColumns = [{
  key: "accountMapping",
  label: "Pemetaan akun"
}, {
  key: "account",
  label: "Akun (COA)"
}, {
  key: "category",
  label: "Kategori biaya produksi"
}];
function ProductionAccountMappingPage({
  onBack,
  inventoryMappings,
  productionCostMappings,
  onCreateMapping
}) {
  const [modalType, setModalType] = useState(null);
  const [inventoryMappingValue, setInventoryMappingValue] = useState("");
  function handleSaveMapping(payload) {
    const created = onCreateMapping(payload);
    if (payload.type === "inventory") {
      setInventoryMappingValue(created.id);
    }
    setModalType(null);
  }
  return <div className="min-h-screen bg-white">
    <div className="border-b border-gray-200 bg-slate-50 px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <button type="button" onClick={onBack} className="cursor-pointer text-xs font-semibold text-brand hover:underline">
            Produksi
          </button>
          <h1 className="mt-0.5 text-[22px] font-bold text-slate-900">
            Pemetaan akun produksi
          </h1>
        </div>
        <AddAccountMappingMenu onSelect={setModalType} />
      </div>
    </div>

    <div className="p-6">
      <h2 className="mb-3 text-[15px] font-bold text-slate-900">Persediaan dalam proses</h2>

      <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
        <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
        <p className="text-sm text-slate-600">
          Akun persediaan dalam proses diperlukan untuk pemetaan akun produksi. Buat akun baru pada halaman daftar akun (COA) jika akun tersebut belum tersedia.
        </p>
      </div>

      <div className={formGroup}>
        <label className={formLabel}>Pemetaan akun persediaan dalam proses</label>
        <SelectField options={inventoryMappings.map(item => ({
          value: item.id,
          label: item.name
        }))} value={inventoryMappingValue} onChange={setInventoryMappingValue} placeholder="Pilih pemetaan akun persediaan dalam proses" emptyText="Pemetaan akun persediaan dalam proses tidak ditemukan" />
      </div>

      <h2 className="mb-3 mt-8 text-[15px] font-bold text-slate-900">Biaya produksi</h2>

      <div className={tableCard}>
        <div className={tableWrapper}>
          <table className={`${tableBase} text-sm`}>
            <thead>
              <tr>
                {productionCostColumns.map(column => <th key={column.key} className={th}>
                  {column.label}
                </th>)}
              </tr>
            </thead>
            <tbody>
              {productionCostMappings.length === 0 && <tr>
                <td colSpan={productionCostColumns.length}>
                  <EmptyStateFolder />
                </td>
              </tr>}
              {productionCostMappings.map(item => <tr key={item.id} className={trHover}>
                <td className={td}>{item.name}</td>
                <td className={td}>{getAccountLabel(item.account)}</td>
                <td className={td}>{getCostCategoryLabel(item.category)}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" className={btnPrimary}>
          Simpan perubahan
        </button>
      </div>
    </div>

    {modalType && <AddAccountMappingModal type={modalType} onClose={() => setModalType(null)} onSave={handleSaveMapping} />}
  </div>;
}
const standardCostColumns = [{
  key: "category",
  label: "Kategori"
}, {
  key: "name",
  label: "Produk / Akun"
}, {
  key: "unit",
  label: "Satuan"
}, {
  key: "currentCost",
  label: "Biaya saat ini"
}, {
  key: "standardCost",
  label: "Biaya standar"
}];
function StandardCostFilterModal({
  productOptions,
  productionCostMappings,
  filters,
  onClose,
  onApply,
  onReset
}) {
  const [category, setCategory] = useState(filters?.category ?? "product");
  const [refId, setRefId] = useState(filters?.refId ?? "");
  const isProduct = category === "product";
  function handleCategoryChange(next) {
    setCategory(next);
    setRefId("");
  }
  return <ModalShell title="Filter biaya standar" onClose={onClose} footer={<>
    <button type="button" onClick={onReset} className="cursor-pointer px-3 text-[13px] font-semibold text-slate-600 hover:text-slate-800">
      Atur ulang filter
    </button>
    <button type="button" onClick={() => onApply({
      category,
      refId
    })} className={btnModalSubmit}>
      Terapkan
    </button>
  </>}>
    <div className={formGroup}>
      <label className={formLabel}>Kategori</label>
      <CategoryRadio name="filter-standard-cost-category" value={category} onChange={handleCategoryChange} />
    </div>

    {isProduct ? <div className={formGroup}>
      <label className={formLabel}>Produk</label>
      <SelectField options={productOptions} value={refId} onChange={setRefId} placeholder="Pilih produk" emptyText="Produk tidak ditemukan" />
    </div> : <div className={formGroup}>
      <label className={formLabel}>Pemetaan akun biaya produksi</label>
      <SelectField options={productionCostMappings.map(item => ({
        value: item.id,
        label: item.name
      }))} value={refId} onChange={setRefId} placeholder="Pilih pemetaan akun biaya produksi" emptyText="Pemetaan akun biaya produksi tidak ditemukan" />
    </div>}
  </ModalShell>;
}
function AddStandardCostModal({
  productOptions,
  productionCostMappings,
  onClose,
  onSave,
  onCreateMapping
}) {
  const [category, setCategory] = useState("product");
  const [productId, setProductId] = useState("");
  const [mappingId, setMappingId] = useState("");
  const [standardCost, setStandardCost] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const isProduct = category === "product";
  const selectedProduct = productOptions.find(item => item.value === productId);
  const selectedMapping = productionCostMappings.find(item => item.id === mappingId);
  const currentCost = selectedProduct?.currentCost ?? 0;
  const unit = selectedProduct?.unit ?? "";
  const variance = standardCost - currentCost;
  const variancePercent = currentCost > 0 ? Math.round(variance / currentCost * 10000) / 100 : 0;
  const refMissing = isProduct ? !productId : !mappingId;
  const refError = submitted && refMissing;
  const costError = submitted && standardCost <= 0;
  function handleCategoryChange(next) {
    setCategory(next);
    setProductId("");
    setMappingId("");
    setStandardCost(0);
    setSubmitted(false);
  }
  function handleSave() {
    setSubmitted(true);
    if (refMissing || standardCost <= 0) return;
    onSave({
      id: `sc-${Date.now()}`,
      type: category,
      refId: isProduct ? productId : mappingId,
      name: isProduct ? selectedProduct.label : selectedMapping.name,
      unit: isProduct ? unit : "-",
      currentCost: isProduct ? currentCost : null,
      standardCost
    });
  }
  return <>
    <ModalShell title="Tambah biaya standar" onClose={onClose} footer={<>
      <button type="button" onClick={onClose} className={btnModalCancel}>
        Batal
      </button>
      <button type="button" onClick={handleSave} className={btnModalSubmit}>
        Simpan
      </button>
    </>}>
      <div className={formGroup}>
        <label className={formLabel}>Kategori</label>
        <CategoryRadio name="add-standard-cost-category" value={category} onChange={handleCategoryChange} />
      </div>

      {isProduct ? <>
        <div className="mb-4 grid grid-cols-[1fr_96px] gap-3">
          <div>
            <label className={formLabel}>Produk</label>
            <SelectField options={productOptions} value={productId} onChange={setProductId} placeholder="Pilih produk" emptyText="Produk tidak ditemukan" error={refError} />
            {refError && <FieldError>Produk wajib dipilih</FieldError>}
          </div>
          <div>
            <label className={formLabel}>Satuan</label>
            <input type="text" disabled value={unit} className={inputBase} />
          </div>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Biaya saat ini</label>
          <RupiahInput disabled value={currentCost} />
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Biaya standar</label>
          <RupiahInput value={standardCost} onChange={setStandardCost} error={costError} />
          {costError && <FieldError>Biaya standar harus lebih besar dari 0</FieldError>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <LabelWithInfo hint="Selisih antara biaya standar dan biaya saat ini.">
              Estimasi selisih biaya
            </LabelWithInfo>
            <RupiahInput disabled value={variance} />
          </div>
          <div>
            <LabelWithInfo hint="Estimasi selisih biaya dalam persentase terhadap biaya saat ini.">
              Estimasi selisih (%)
            </LabelWithInfo>
            <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-slate-100">
              <input type="text" disabled value={variancePercent} className="w-full bg-transparent px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:text-slate-400" />
              <span className="flex items-center bg-slate-100 px-3 text-[13px] font-semibold text-slate-700">
                %
              </span>
            </div>
          </div>
        </div>
      </> : <>
        <div className={formGroup}>
          <label className={formLabel}>Pemetaan akun biaya produksi</label>
          <SelectField options={productionCostMappings.map(item => ({
            value: item.id,
            label: item.name
          }))} value={mappingId} onChange={setMappingId} placeholder="Pilih pemetaan akun biaya produksi" emptyText="Pemetaan akun biaya produksi tidak ditemukan" error={refError} footerAction={{
            label: "Tambah pemetaan akun",
            onClick: () => setShowMappingModal(true)
          }} />
          {refError && <FieldError>Pemetaan akun biaya produksi wajib dipilih</FieldError>}
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Biaya standar</label>
          <RupiahInput value={standardCost} onChange={setStandardCost} error={costError} />
          {costError && <FieldError>Biaya standar harus lebih besar dari 0</FieldError>}
        </div>
      </>}
    </ModalShell>

    {showMappingModal && <AddAccountMappingModal type="cost" onClose={() => setShowMappingModal(false)} onSave={payload => {
      const created = onCreateMapping(payload);
      setMappingId(created.id);
      setShowMappingModal(false);
    }} />}
  </>;
}
function StandardCostPage({
  onBack,
  productOptions,
  productionCostMappings,
  standardCostList,
  onSaveStandardCost,
  onCreateMapping
}) {
  const [modal, setModal] = useState(null);
  const [filters, setFilters] = useState(null);
  const visibleList = standardCostList.filter(item => {
    if (!filters) return true;
    if (item.type !== filters.category) return false;
    return !filters.refId || item.refId === filters.refId;
  });
  function handleSave(item) {
    onSaveStandardCost(item);
    setModal(null);
  }
  return <div className="min-h-screen bg-white">
    <div className="border-b border-gray-200 bg-slate-50 px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <button type="button" onClick={onBack} className="cursor-pointer text-xs font-semibold text-brand hover:underline">
            Produksi
          </button>
          <h1 className="mt-0.5 text-[22px] font-bold text-slate-900">Biaya standar</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" className={`${btn} text-brand`}>
            <BookOpen size={14} weight="bold" />
            Artikel panduan
          </button>
          <button type="button" onClick={() => setModal("add")} className={btnPrimary}>
            Tambah biaya standar
          </button>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="mb-4 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
        <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-semibold text-slate-800">Ketentuan penerapan BOM dengan biaya standar</p>
          <p className="mt-0.5 text-sm text-slate-600">
            Sesuaikan biaya standar terlebih dahulu, lalu ubah acuan perhitungan biaya dari biaya aktual menjadi biaya standar pada BOM terkait.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <button type="button" onClick={() => setModal("filter")} className={`${btn} text-brand`}>
          <Funnel size={14} weight="bold" />
          Filter
          {filters && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
        </button>
      </div>

      <div className={tableCard}>
        <div className={tableWrapper}>
          <table className={`${tableBase} text-sm`}>
            <thead>
              <tr>
                {standardCostColumns.map(column => <th key={column.key} className={th}>
                  {column.label}
                </th>)}
              </tr>
            </thead>
            <tbody>
              {visibleList.length === 0 && <tr>
                <td colSpan={standardCostColumns.length}>
                  <EmptyStateFolder title="Daftar biaya standar akan ditampilkan di sini" description={<>
                    Biaya standar digunakan untuk memperkirakan biaya proses produksi barang. Tambahkan biaya standar melalui{" "}
                    <span className="font-semibold text-slate-700">Tambah biaya standar</span>{" "}
                    .
                  </>} />
                </td>
              </tr>}
              {visibleList.map(item => <tr key={item.id} className={trHover}>
                <td className={td}>
                  {item.type === "product" ? "Komponen produk" : "Biaya produksi"}
                </td>
                <td className={td}>{item.name}</td>
                <td className={td}>{item.unit}</td>
                <td className={td}>
                  {item.currentCost === null ? "-" : formatRupiah(item.currentCost)}
                </td>
                <td className={td}>{formatRupiah(item.standardCost)}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {modal === "filter" && <StandardCostFilterModal productOptions={productOptions} productionCostMappings={productionCostMappings} filters={filters} onClose={() => setModal(null)} onApply={next => {
      setFilters(next);
      setModal(null);
    }} onReset={() => {
      setFilters(null);
      setModal(null);
    }} />}

    {modal === "add" && <AddStandardCostModal productOptions={productOptions} productionCostMappings={productionCostMappings} onClose={() => setModal(null)} onSave={handleSave} onCreateMapping={onCreateMapping} />}
  </div>;
}
const componentColumns = [{
  key: "productName",
  label: "Nama produk"
}, {
  key: "productSku",
  label: "Kode produk / SKU"
}, {
  key: "qtyNeeded",
  label: "Kuantitas dibutuhkan"
}, {
  key: "unit",
  label: "Satuan"
}, {
  key: "unitBuyPrice",
  label: "Harga beli per satuan"
}, {
  key: "estimatedPrice",
  label: "Estimasi harga"
}];
const routingColumns = [{
  key: "process",
  label: "Proses"
}, {
  key: "description",
  label: "Deskripsi"
}, {
  key: "accountMapping",
  label: "Pemetaan akun"
}, {
  key: "routingCost",
  label: "Biaya alur produksi"
}];
const outputColumns = [{
  key: "productName",
  label: "Nama produk"
}, {
  key: "productSku",
  label: "Kode produk / SKU"
}, {
  key: "qty",
  label: "Kuantitas"
}, {
  key: "unit",
  label: "Satuan"
}, {
  key: "percentage",
  label: "Persentase"
}, {
  key: "amount",
  label: "Jumlah"
}];
const wasteColumns = [{
  key: "accountMapping",
  label: "Pemetaan akun"
}, {
  key: "allocationMethod",
  label: "Metode alokasi"
}, {
  key: "percentage",
  label: "Persentase"
}, {
  key: "amount",
  label: "Jumlah"
}];
function OptionPopover({
  options,
  value,
  onChange,
  onSearch,
  placeholder,
  emptyText,
  onCreateNew,
  createLabel,
  searchable
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find(option => option.value === value);
  const filtered = searchable && query ? options.filter(option => option.label.toLowerCase().includes(query.toLowerCase())) : options;
  if (searchable) {
    return <div className="relative">
      <input type="text" value={selected ? selected.label : query} onChange={event => {
        setQuery(event.target.value);
        onSearch?.(event.target.value);
        setOpen(true);
      }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder={placeholder} className={inputBase} />
      <CaretDown size={14} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />

      {open && <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[280px] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
        {filtered.length === 0 ? <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div> : filtered.map(option => <button key={option.value} type="button" onMouseDown={() => {
          onChange(option.value);
          setQuery("");
          setOpen(false);
        }} className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${option.value === value ? "bg-indigo-50 text-brand" : "text-slate-700"}`}>
          <span className="font-medium">{option.label}</span>
          {option.description && <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>}
        </button>)}
        {onCreateNew && <div className="sticky bottom-0 mt-1 border-t border-gray-100 bg-white">
          <button type="button" onMouseDown={() => {
            setOpen(false);
            onCreateNew();
          }} className="block w-full cursor-pointer px-3 py-2 text-center text-sm font-medium text-brand hover:bg-slate-50">
            {createLabel}
          </button>
        </div>}
      </div>}
    </div>;
  }
  return <div className="relative">
    <button type="button" onClick={() => setOpen(prev => !prev)} className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-gray-400 focus:border-brand focus:outline-none">
      <span className={selected ? "text-gray-900" : "text-gray-400"}>
        {selected ? selected.label : placeholder}
      </span>
      <CaretDown size={14} weight="bold" className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>

    {open && <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[280px] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
      {options.length === 0 ? <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div> : options.map(option => <button key={option.value} type="button" onClick={() => {
        onChange(option.value);
        setOpen(false);
      }} className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${option.value === value ? "bg-indigo-50 text-brand" : "text-slate-700"}`}>
        <span className="font-medium">{option.label}</span>
        {option.description && <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>}
      </button>)}
      {onCreateNew && <div className="sticky bottom-0 mt-1 border-t border-gray-100 bg-white">
        <button type="button" onClick={() => {
          setOpen(false);
          onCreateNew();
        }} className="block w-full cursor-pointer px-3 py-2 text-center text-sm font-medium text-brand hover:bg-slate-50">
          {createLabel}
        </button>
      </div>}
    </div>}
  </div>;
}
function SectionAccordion({
  title,
  children,
  defaultOpen = true,
  action
}) {
  const [open, setOpen] = useState(defaultOpen);
  return <div className="mb-5">
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      <button type="button" onClick={() => setOpen(prev => !prev)} className="flex cursor-pointer items-center gap-2 text-[15px] font-bold text-slate-900">
        <CaretDown size={16} weight="bold" className={`text-slate-500 transition-transform ${open ? "" : "-rotate-90"}`} />
        {title}
      </button>
      {action}
    </div>
    {open && <div className="pt-4">{children}</div>}
  </div>;
}
function DataTable({
  columns,
  rows,
  renderRow
}) {
  return <div className="overflow-hidden rounded-[10px] border border-gray-200">
    <div className={tableWrapper}>
      <table className={tableBase}>
        <thead>
          <tr>
            {columns.map(column => <th key={column.key} className={th}>
              {column.label}
            </th>)}
          </tr>
        </thead>
        <tbody>{rows.map((row, index) => renderRow(row, index))}</tbody>
      </table>
    </div>
  </div>;
}
function AddSubassemblyModal({
  onClose,
  onAdd
}) {
  const [productId, setProductId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const error = submitted && !productId;
  function handleSave() {
    setSubmitted(true);
    if (!productId) return;
    onAdd(productId);
  }
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
    <div className="w-full max-w-[520px] overflow-visible rounded-xl bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-[22px] py-4">
        <h2 className={modalTitle}>Tambahkan produk rakitan antara ke komponen produk</h2>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>

      <div className="px-[22px] py-5">
        <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
          <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
          <p className="text-sm text-slate-600">
            Untuk menambahkan produk rakitan antara, pastikan BOM rakitan antara dengan kategori standar telah dibuat.
          </p>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Produk rakitan antara</label>
          <OptionPopover options={productionSubassemblyOptions} value={productId} onChange={setProductId} placeholder="Pilih produk rakitan antara" emptyText="Tidak ada hasil yang ditemukan" />
          {error && <FieldError>Produk rakitan antara wajib dipilih</FieldError>}
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" onClick={onClose} className={btnModalCancel}>
          Batal
        </button>
        <button type="button" onClick={handleSave} className={btnModalSubmit}>
          Simpan
        </button>
      </div>
    </div>
  </div>;
}
function AddBomAccountMappingModal({
  onClose,
  onSave
}) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nameError = submitted && !name.trim();
  const accountError = submitted && !account;
  const categoryError = submitted && !category;
  function handleSave() {
    setSubmitted(true);
    if (!name.trim() || !account || !category) return;
    onSave({
      name: name.trim(),
      account,
      category
    });
  }
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
    <div className="w-full max-w-[480px] overflow-visible rounded-xl bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-[22px] py-4">
        <h2 className={modalTitle}>Tambah pemetaan akun</h2>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>

      <div className="px-[22px] py-5">
        <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
          <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
          <div>
            <p className="text-sm font-semibold text-slate-800">Pemetaan akun biaya produksi</p>
            <p className="mt-0.5 text-sm text-slate-600">
              Akun yang dipetakan untuk biaya produksi tidak dapat dihapus atau diarsipkan dari daftar akun (COA).
            </p>
          </div>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Nama pemetaan akun</label>
          <input type="text" value={name} onChange={event => setName(event.target.value)} className={nameError ? inputError : inputBase} />
          {nameError && <FieldError>Nama pemetaan akun wajib diisi</FieldError>}
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Akun</label>
          <OptionPopover searchable options={productionAccountOptions} value={account} onChange={setAccount} placeholder="Pilih akun" emptyText="Tidak ada hasil yang ditemukan" />
          {accountError && <FieldError>Akun wajib dipilih</FieldError>}
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Kategori biaya produksi</label>
          <OptionPopover options={productionCostCategoryOptions} value={category} onChange={setCategory} placeholder="Pilih kategori biaya produksi" />
          {categoryError && <FieldError>Kategori biaya produksi wajib dipilih</FieldError>}
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" onClick={onClose} className={btnModalCancel}>
          Batal
        </button>
        <button type="button" onClick={handleSave} className={btnModalSubmit}>
          Simpan
        </button>
      </div>
    </div>
  </div>;
}
function SaveSplitButton({
  onSave,
  onSaveDraft
}) {
  const [open, setOpen] = useState(false);
  return <div className="relative inline-block">
    <div className="flex">
      <button type="button" onClick={onSave} className={btnModalSubmit}>
        Simpan
      </button>
      <button type="button" onClick={() => setOpen(prev => !prev)} className={`${btnModalSubmit} -ml-px rounded-l-none border-l border-white/30`}>
        <CaretDown size={14} weight="bold" />
      </button>
    </div>
    {open && <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
      <button type="button" onClick={() => {
        setOpen(false);
        onSave();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
        Simpan dan buat lainnya
      </button>
      <button type="button" onClick={() => {
        setOpen(false);
        onSaveDraft();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
        Simpan sebagai draf
      </button>
    </div>}
  </div>;
}
function CreateBomModal({
  onClose,
  onSave,
  onSaveDraft
}) {
  const [bomName, setBomName] = useState("");
  const [bomCode, setBomCode] = useState("");
  const [category, setCategory] = useState("standard");
  const [costingReference, setCostingReference] = useState("");
  const [description, setDescription] = useState("");
  const [enableAdjustment, setEnableAdjustment] = useState(false);
  const [components, setComponents] = useState([{
    id: "c-1",
    productId: "",
    productName: "",
    productSku: "",
    qtyNeeded: 0,
    unit: "",
    unitBuyPrice: 0,
    estimatedPrice: 0
  }]);
  const [productionCosts, setProductionCosts] = useState({
    labor: {
      account: "",
      amount: 0
    },
    overhead: {
      account: "",
      amount: 0
    },
    other: {
      account: "",
      amount: 0
    }
  });
  const [routings, setRoutings] = useState([{
    id: "r-1",
    process: "",
    description: "",
    accountMapping: "",
    routingCost: 0
  }]);
  const [mainOutputs, setMainOutputs] = useState([{
    id: "mo-1",
    productId: "",
    productName: "",
    productSku: "",
    qty: 0,
    unit: "",
    percentage: 0,
    amount: 0
  }]);
  const [otherOutputs, setOtherOutputs] = useState([{
    id: "oo-1",
    productId: "",
    productName: "",
    productSku: "",
    qty: 0,
    unit: "",
    percentage: 0,
    amount: 0
  }]);
  const [wastes, setWastes] = useState([{
    id: "w-1",
    accountMapping: "",
    allocationMethod: "",
    percentage: 0,
    amount: 0
  }]);
  const [showSubassemblyModal, setShowSubassemblyModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isCustom = category === "custom";
  const nameError = submitted && !bomName.trim();
  const codeError = false;
  const categoryError = submitted && !category;
  const costingError = submitted && !costingReference;
  const subtotalProductionCost = productionCosts.labor.amount + productionCosts.overhead.amount + productionCosts.other.amount;
  const subtotalComponents = components.reduce((total, item) => total + (item.qtyNeeded || 0) * (item.unitBuyPrice || 0), 0);
  const subtotalRouting = routings.reduce((total, item) => total + (item.routingCost || 0), 0);
  const subtotalMainOutputs = mainOutputs.reduce((total, item) => total + (item.amount || 0), 0);
  const subtotalOtherOutputs = otherOutputs.reduce((total, item) => total + (item.amount || 0), 0);
  const subtotalWaste = wastes.reduce((total, item) => total + (item.amount || 0), 0);
  function addSubassemblyProduct(productId) {
    const selected = productionSubassemblyOptions.find(option => option.value === productId);
    if (!selected) return;
    setComponents(prev => [...prev, {
      id: `c-${Date.now()}`,
      productId,
      productName: selected.label,
      productSku: "",
      qtyNeeded: 1,
      unit: "",
      unitBuyPrice: 0,
      estimatedPrice: 0
    }]);
    setShowSubassemblyModal(false);
  }
  function updateComponent(id, field, value) {
    setComponents(prev => prev.map(item => {
      if (item.id !== id) return item;
      const next = {
        ...item,
        [field]: value
      };
      next.estimatedPrice = (next.qtyNeeded || 0) * (next.unitBuyPrice || 0);
      return next;
    }));
  }
  function updateProductionCost(key, field, value) {
    setProductionCosts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  }
  function updateRouting(id, field, value) {
    setRoutings(prev => prev.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  }
  function updateOutput(list, setter, id, field, value) {
    setter(prev => prev.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  }
  function updateWaste(id, field, value) {
    setWastes(prev => prev.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  }
  function handleSave() {
    setSubmitted(true);
    if (!bomName.trim() || !category || !costingReference) return;
    onSave({
      bomName: bomName.trim(),
      bomCode: bomCode.trim(),
      category,
      costingReference,
      description: description.trim(),
      enableAdjustment,
      components,
      productionCosts,
      routings,
      mainOutputs,
      otherOutputs,
      wastes
    });
  }
  return <div className={modalOverlay}>
    <div className="my-6 w-full max-w-[1100px] overflow-visible rounded-xl bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <p className="text-xs font-semibold text-brand">Daftar kebutuhan bahan (BOM)</p>
          <h2 className={`${modalTitle} mt-0.5`}>Buat daftar kebutuhan bahan (BOM)</h2>
        </div>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-5">
        <section className="mb-6">
          <h3 className="mb-4 text-[15px] font-bold text-slate-900">Informasi dasar</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup}>
              <label className={formLabel}>
                Nama BOM <span className="text-red-600">*</span>
              </label>
              <input type="text" value={bomName} onChange={event => setBomName(event.target.value)} className={nameError ? inputError : inputBase} />
              {nameError && <FieldError>Nama BOM wajib diisi</FieldError>}
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Kode BOM</label>
              <input type="text" value={bomCode} onChange={event => setBomCode(event.target.value)} placeholder="[Otomatis]" className={inputBase} />
            </div>

            <div className={formGroup}>
              <label className={formLabel}>
                Kategori <span className="text-red-600">*</span>
              </label>
              <OptionPopover options={bomCategoryOptions} value={category} onChange={setCategory} placeholder="Pilih kategori" />
              {categoryError && <FieldError>Kategori wajib dipilih</FieldError>}
            </div>

            <div className={formGroup}>
              <label className={formLabel}>
                Acuan perhitungan biaya <span className="text-red-600">*</span>
              </label>
              <OptionPopover options={bomCostingReferenceOptions} value={costingReference} onChange={setCostingReference} placeholder="Pilih acuan perhitungan biaya" />
              {costingError && <FieldError>Acuan perhitungan biaya wajib dipilih</FieldError>}
            </div>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Deskripsi</label>
            <textarea value={description} onChange={event => setDescription(event.target.value)} maxLength={255} rows={3} className={textareaBase} />
            <p className="mt-1 text-right text-xs text-slate-400">{description.length}/255</p>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Lampiran</label>
            <div className="flex items-center gap-3">
              <button type="button" className={btnSecondary}>
                Pilih berkas
              </button>
              <span className="text-sm text-slate-400">Belum ada berkas yang dipilih</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Berkas harus berformat PDF, dengan maksimal 3 lampiran dan ukuran 10 MB per berkas
            </p>
          </div>

          {!isCustom && <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
            <input type="checkbox" id="enable-bom-adjustment" checked={enableAdjustment} onChange={event => setEnableAdjustment(event.target.checked)} className="mt-0.5 h-4 w-4 cursor-pointer accent-brand" />
            <label htmlFor="enable-bom-adjustment" className="cursor-pointer text-sm text-slate-700">
              <span className="font-semibold">Aktifkan penyesuaian BOM</span>
              <span className="mt-0.5 block text-slate-500">
                Komponen untuk SKU yang sama dapat ditambahkan atau dikurangi saat membuat perintah kerja.
              </span>
            </label>
          </div>}
        </section>

        <SectionAccordion title="Komponen produk" action={<button type="button" onClick={() => setShowSubassemblyModal(true)} className={btnSecondary}>
          Tambah produk rakitan antara
        </button>}>
          <DataTable columns={componentColumns} rows={components} renderRow={item => <tr key={item.id} className={trHover}>
            <td className={td}>
              <input type="text" value={item.productName} onChange={event => updateComponent(item.id, "productName", event.target.value)} placeholder="Pilih atau cari produk" className={inputBase} />
            </td>
            <td className={td} colSpan={5}>
              <p className="text-sm text-slate-400"> </p>
            </td>
            <td className={td}>
              <div data-testid="component-estimated-price">
                <span className="min-w-[100px] text-sm text-slate-700">
                  {formatRupiah(item.estimatedPrice)}
                </span>
              </div>
            </td>
          </tr>} />
          <p className="mt-3 text-right text-sm font-semibold text-slate-800">
            Estimasi subtotal harga komponen produk: {formatRupiah(subtotalComponents)}
          </p>
        </SectionAccordion>

        <SectionAccordion title="Biaya produksi">
          <div className="space-y-5">
            {productionCostRows.map(row => <div key={row.key}>
              <div className="overflow-hidden rounded-[10px] border border-gray-200">
                <div className={tableWrapper}>
                  <table className={tableBase}>
                    <thead>
                      <tr>
                        <th className={th}>{row.label}</th>
                        <th className={th}>Pemicu biaya</th>
                        <th className={th}>Jumlah</th>
                        <th className={th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={trHover}>
                        <td className={td}>
                          <OptionPopover searchable options={productionVariableAccountOptions} value={productionCosts[row.key].account} onChange={value => updateProductionCost(row.key, "account", value)} placeholder="Pilih akun biaya variabel" emptyText="Akun biaya variabel tidak ditemukan" onCreateNew={() => setShowMappingModal(true)} createLabel="Tambah akun biaya variabel baru" />
                        </td>
                        <td className={td}>
                          <p className="text-sm text-slate-400"> </p>
                        </td>
                        <td className={td}>
                          <p className="text-sm text-slate-400"> </p>
                        </td>
                        <td className={td}>
                          <p className="text-sm text-slate-400"> </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>)}
          </div>
          <p className="mt-3 text-right text-sm font-semibold text-slate-800">
            Subtotal biaya produksi: {formatRupiah(subtotalProductionCost)}
          </p>
        </SectionAccordion>

        <SectionAccordion title="Alur produksi">
          <DataTable columns={routingColumns} rows={routings} renderRow={item => <tr key={item.id} className={trHover}>
            <td className={td}>
              <input type="text" value={item.process} onChange={event => updateRouting(item.id, "process", event.target.value)} placeholder="Pilih atau masukkan untuk menambahkan" className={inputBase} />
            </td>
            <td className={td}>
              <p className="text-sm text-slate-400"> </p>
            </td>
            <td className={td}>
              <p className="text-sm text-slate-400"> </p>
            </td>
            <td className={td}>
              <span data-testid="routing-cost" className="min-w-[100px] text-sm text-slate-700">
                {formatRupiah(item.routingCost)}
              </span>
            </td>
          </tr>} />
          <p className="mt-3 text-right text-sm font-semibold text-slate-800">
            Subtotal biaya alur produksi: {formatRupiah(subtotalRouting)}
          </p>
        </SectionAccordion>

        <div className="mb-6 rounded-lg border border-gray-200 bg-slate-50 p-4">
          <div className="grid grid-cols-3 gap-x-8 gap-y-1.5 text-sm">
            <div className="flex flex-col justify-between">
              <span className="text-slate-600">Estimasi subtotal harga komponen produk</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalComponents)}</span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-slate-600">Subtotal biaya produksi</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalProductionCost)}</span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-slate-600">Subtotal biaya alur produksi</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalRouting)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-[15px] font-bold text-slate-900">Estimasi total biaya proses produksi</span>
            <span className="text-[15px] font-bold text-slate-900">
              {formatRupiah(subtotalComponents + subtotalProductionCost + subtotalRouting)}
            </span>
          </div>
        </div>

        <SectionAccordion title="Hasil produksi">
          <div className="mb-6">
            <p className="mb-3 text-[13px] font-semibold text-slate-700">Hasil utama</p>
            {isCustom && <p className="mb-3 flex items-start gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <Info size={16} weight="bold" className="mt-0.5 shrink-0 text-slate-400" />
              Jika kategori BOM khusus dipilih, hanya produk yang belum digunakan pada BOM lain yang dapat dimasukkan.
            </p>}
            <DataTable columns={outputColumns} rows={mainOutputs} renderRow={item => <tr key={item.id} className={trHover}>
              <td className={td}>
                <input type="text" value={item.productName} onChange={event => updateOutput(mainOutputs, setMainOutputs, item.id, "productName", event.target.value)} placeholder="Pilih atau cari produk" className={inputBase} />
              </td>
              <td className={td} colSpan={4}>
                <p className="text-sm text-slate-400"> </p>
              </td>
              <td className={td}>
                <div data-testid="main-output-amount">
                  <span className="min-w-[100px] text-sm text-slate-700">
                    {formatRupiah(item.amount)}
                  </span>
                </div>
              </td>
            </tr>} />
            <p className="mt-3 text-right text-sm font-semibold text-slate-800">
              Estimasi subtotal harga hasil utama: {formatRupiah(subtotalMainOutputs)}
            </p>
          </div>

          <div>
            <p className="mb-3 text-[13px] font-semibold text-slate-700">Hasil lainnya</p>
            <DataTable columns={outputColumns} rows={otherOutputs} renderRow={item => <tr key={item.id} className={trHover}>
              <td className={td}>
                <input type="text" value={item.productName} onChange={event => updateOutput(otherOutputs, setOtherOutputs, item.id, "productName", event.target.value)} placeholder="Pilih atau cari produk" className={inputBase} />
              </td>
              <td className={td} colSpan={4}>
                <p className="text-sm text-slate-400"> </p>
              </td>
              <td className={td}>
                <div data-testid="other-output-amount">
                  <span className="min-w-[100px] text-sm text-slate-700">
                    {formatRupiah(item.amount)}
                  </span>
                </div>
              </td>
            </tr>} />
            <p className="mt-3 text-right text-sm font-semibold text-slate-800">
              Estimasi subtotal harga hasil lainnya: {formatRupiah(subtotalOtherOutputs)}
            </p>
          </div>
        </SectionAccordion>

        <section className="mb-2">
          <div className="flex items-center gap-2 border-b border-gray-200 py-3">
            <h3 className="text-[15px] font-bold text-slate-900">Susut produksi</h3>
            <span title="Susut produksi merupakan aktivitas atau faktor yang mengurangi nilai hasil produksi. Pada bagian ini, susut dapat dibebankan ke akun tertentu dengan memilih pemetaan akun dan metode alokasi sesuai kebutuhan.">
              <Info size={15} weight="bold" className="cursor-help text-slate-400" />
            </span>
          </div>

          <div className="pt-4">
            <DataTable columns={wasteColumns} rows={wastes} renderRow={item => <tr key={item.id} className={trHover}>
              <td className={td}>
                <input type="text" value={item.accountMapping} onChange={event => updateWaste(item.id, "accountMapping", event.target.value)} placeholder="Pilih pemetaan akun" className={inputBase} />
              </td>
              <td className={td}>
                <span className="text-sm text-slate-400">
                  {item.allocationMethod || " "}
                </span>
              </td>
              <td className={td}>
                <span data-testid="waste-percentage" className="text-sm text-slate-700">
                  {item.percentage || 0}%
                </span>
              </td>
              <td className={td}>
                <span data-testid="waste-amount" className="min-w-[100px] text-sm text-slate-700">
                  {formatRupiah(item.amount)}
                </span>
              </td>
            </tr>} />
            <p className="mt-3 text-right text-sm font-semibold text-slate-800">
              Estimasi subtotal susut produksi: {formatRupiah(subtotalWaste)}
            </p>
          </div>
        </section>

        <div className="mb-6 rounded-lg border border-gray-200 bg-slate-50 p-4">
          <div className="grid grid-cols-3 gap-x-8 gap-y-1.5 text-sm">
            <div className="flex flex-col justify-between">
              <span className="text-slate-600">Estimasi subtotal harga hasil utama</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalMainOutputs)}</span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-slate-600">Estimasi subtotal harga hasil lainnya</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalOtherOutputs)}</span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-slate-600">Estimasi subtotal susut produksi</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalWaste)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-[15px] font-bold text-slate-900">Estimasi total harga hasil produksi</span>
            <span className="text-[15px] font-bold text-slate-900">
              {formatRupiah(subtotalMainOutputs + subtotalOtherOutputs + subtotalWaste)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 border-t border-gray-200 bg-slate-50 px-6 py-4">
        <button type="button" onClick={onClose} className={btnModalCancel}>
          Batal
        </button>
        <SaveSplitButton onSave={handleSave} onSaveDraft={onSaveDraft} />
      </div>
    </div>

    {showSubassemblyModal && <AddSubassemblyModal onClose={() => setShowSubassemblyModal(false)} onAdd={addSubassemblyProduct} />}

    {showMappingModal && <AddAccountMappingModal onClose={() => setShowMappingModal(false)} onSave={() => setShowMappingModal(false)} />}
  </div>;
}
const defaultBomOptions = [];
const woComponentColumns = ["Nama produk", "Kode produk / SKU", "Harga beli per satuan", "Nama gudang", "Stok tersedia", "Kuantitas dibutuhkan", "Satuan", "Estimasi harga", ""];
const costColumns = ["Pemicu biaya", "Estimasi biaya per satuan", "Pengali", "Jumlah", ""];
const woRoutingColumns = ["Proses", "Deskripsi", "Pemetaan akun", "Tanggal rencana kerja", "Biaya alur produksi", ""];
const woOutputColumns = ["Nama produk", "Kode produk / SKU", "Nama gudang", "Kuantitas dihasilkan", "Satuan", "Persentase", "Estimasi harga", ""];
function BomTable({
  columns,
  emptyTitle,
  emptyDescription,
  emptyIcon: EmptyIcon = Package
}) {
  return <div className="overflow-hidden rounded-[10px] border border-gray-200">
    <div className={tableWrapper}>
      <table className={tableBase}>
        <thead>
          <tr>
            {columns.map((label, index) => <th key={index} className={th}>
              {label}
            </th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={td} colSpan={columns.length}>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <EmptyIcon size={32} weight="light" className="text-slate-400" />
                <p className="mt-3 text-[14px] font-semibold text-slate-800">{emptyTitle}</p>
                <p className="mt-1 text-sm text-slate-500">{emptyDescription}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
}
function CreateWorkOrderModal({
  onClose,
  onSave,
  bomOptions
}) {
  const [workOrderNo, setWorkOrderNo] = useState("");
  const [category, setCategory] = useState("");
  const [workOrderType, setWorkOrderType] = useState("assembly");
  const [trackRouting, setTrackRouting] = useState("use");
  const [bomName, setBomName] = useState("");
  const [productionPlanStart, setProductionPlanStart] = useState("");
  const [productionPlanEnd, setProductionPlanEnd] = useState("");
  const productionPlanDates = [productionPlanStart, productionPlanEnd].filter(Boolean).join(" - ");
  const [actualStartDate, setActualStartDate] = useState("");
  const [actualEndDate, setActualEndDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [source, setSource] = useState("");
  const [enableSubassembly, setEnableSubassembly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isDisassembly = workOrderType === "disassembly";
  const isOrder = category === "order";
  const availableBomOptions = bomOptions?.length ? bomOptions : defaultBomOptions;
  const selectedBom = availableBomOptions.find(option => option.value === bomName);
  const bomSelected = bomName !== "";
  const noError = submitted && !workOrderNo.trim();
  const categoryError = submitted && !category;
  const typeError = submitted && !workOrderType;
  const bomError = submitted && !bomName;
  const dateError = submitted && !productionPlanDates.trim();
  const canSave = workOrderNo.trim() !== "" && category !== "" && workOrderType !== "" && bomName !== "" && productionPlanDates.trim() !== "" && (!isDisassembly || actualStartDate.trim() !== "" && actualEndDate.trim() !== "");
  function handleSave() {
    setSubmitted(true);
    if (!canSave) return;
    onSave({
      workOrderNo: workOrderNo.trim(),
      category,
      workOrderType,
      trackRouting: isDisassembly ? "not_use" : trackRouting,
      bomName,
      productionPlanDates: productionPlanDates.trim(),
      source: source.trim(),
      actualStartDate: actualStartDate.trim(),
      actualEndDate: actualEndDate.trim(),
      orderDate: orderDate.trim(),
      deliveryDate: deliveryDate.trim(),
      enableSubassembly
    });
  }
  return <div className={modalOverlay}>
    <div className="my-6 w-full max-w-[1100px] overflow-visible rounded-xl bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <p className="text-xs font-semibold text-brand">Daftar perintah kerja</p>
          <h2 className={`${modalTitle} mt-0.5`}>Buat perintah kerja</h2>
        </div>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-5">
        <section className="mb-6">
          <h3 className="mb-4 text-[15px] font-bold text-slate-900">Informasi dasar</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup}>
              <label className={formLabel}>
                Nomor perintah kerja <span className="text-red-600">*</span>
              </label>
              <input type="text" value={workOrderNo} onChange={event => setWorkOrderNo(event.target.value)} placeholder="[Otomatis]" className={noError ? inputError : inputBase} />
              {noError && <FieldError>Nomor perintah kerja wajib diisi</FieldError>}
            </div>

            <div className={formGroup}>
              <label className={formLabel}>
                Kategori <span className="text-red-600">*</span>
              </label>
              <OptionPopover options={workOrderCategoryOptions} value={category} onChange={setCategory} placeholder="Pilih kategori" />
              {categoryError && <FieldError>Kategori wajib dipilih</FieldError>}
            </div>

            {isOrder && <>
              <div className={formGroup}>
                <label className={formLabel}>Tanggal pesanan</label>
                <input type="date" value={orderDate} onChange={event => setOrderDate(event.target.value)} placeholder="Pilih tanggal pesanan" className={inputBase} />
              </div>
              <div className={formGroup}>
                <label className={formLabel}>Tanggal pengiriman</label>
                <input type="date" value={deliveryDate} onChange={event => setDeliveryDate(event.target.value)} placeholder="Pilih tanggal pengiriman" className={inputBase} />
              </div>
            </>}

            <div className={formGroup}>
              <label className={formLabel}>
                Jenis perintah kerja <span className="text-red-600">*</span>
              </label>
              <OptionPopover options={workOrderTypeOptions} value={workOrderType} onChange={setWorkOrderType} placeholder="Pilih jenis perintah kerja" />
              {typeError && <FieldError>Jenis perintah kerja wajib dipilih</FieldError>}
            </div>

            {!isDisassembly && <div className={formGroup}>
              <label className={formLabel}>Lacak alur produksi</label>
              <div className="flex items-center gap-5 pt-2">
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
                  <input type="radio" name="track-routing" value="use" checked={trackRouting === "use"} onChange={() => setTrackRouting("use")} className="h-4 w-4 cursor-pointer accent-brand" />
                  Ya
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
                  <input type="radio" name="track-routing" value="not_use" checked={trackRouting === "not_use"} onChange={() => setTrackRouting("not_use")} className="h-4 w-4 cursor-pointer accent-brand" />
                  Nomor
                </label>
              </div>
            </div>}

            {isDisassembly && <div className={formGroup}>
              <label className={formLabel}>Sumber</label>
              <input type="text" value={source} onChange={event => setSource(event.target.value)} className={inputBase} />
            </div>}

            <div className={formGroup}>
              <label className={formLabel}>
                Nama BOM <span className="text-red-600">*</span>
              </label>
              <OptionPopover options={availableBomOptions} value={bomName} onChange={setBomName} placeholder="Pilih BOM" emptyText="Tidak ada hasil yang ditemukan" />
              {bomError && <FieldError>Nama BOM wajib diisi</FieldError>}
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Nomor BOM</label>
              <input type="text" value={selectedBom ? selectedBom.bomNo ?? selectedBom.value : ""} disabled placeholder="-" className={inputBase} />
            </div>

            <div className={formGroup}>
              <label className={formLabel}>
                Tanggal rencana produksi <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input type="date" value={productionPlanStart} onChange={event => setProductionPlanStart(event.target.value)} disabled={!bomSelected} className={`${dateError ? inputError : inputBase} flex-1`} />
                <span className="text-sm text-slate-400">-</span>
                <input type="date" value={productionPlanEnd} onChange={event => setProductionPlanEnd(event.target.value)} disabled={!bomSelected} className={`${dateError ? inputError : inputBase} flex-1`} />
              </div>
              {dateError && <FieldError>Tanggal rencana produksi wajib diisi</FieldError>}
            </div>

            {!isDisassembly && <div className={formGroup}>
              <label className={formLabel}>Kuantitas dihasilkan</label>
              <input type="text" value={0} disabled className={inputBase} />
              <p className="mt-1 text-xs text-slate-400">
                Kuantitas hasil produksi akan dihitung berdasarkan BOM yang dipilih.
              </p>
            </div>}

            {isDisassembly && <div className={formGroup}>
              <label className={formLabel}>
                Tanggal mulai aktual <span className="text-red-600">*</span>
              </label>
              <input type="date" value={actualStartDate} onChange={event => setActualStartDate(event.target.value)} className={inputBase} />
            </div>}

            {isDisassembly && <div className={formGroup}>
              <label className={formLabel}>
                Tanggal selesai aktual <span className="text-red-600">*</span>
              </label>
              <input type="date" value={actualEndDate} onChange={event => setActualEndDate(event.target.value)} className={inputBase} />
            </div>}
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Lampiran</label>
            <div className="flex items-center gap-3">
              <button type="button" className={btnSecondary}>
                Pilih berkas
              </button>
              <span className="text-sm text-slate-400">Belum ada berkas yang dipilih</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Hanya berkas PDF, maksimal 3 berkas dengan ukuran 10 MB per berkas
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
            <input type="checkbox" id="create-as-subassembly" checked={enableSubassembly} onChange={event => setEnableSubassembly(event.target.checked)} disabled={!bomSelected} className="mt-0.5 h-4 w-4 cursor-pointer accent-brand disabled:cursor-not-allowed disabled:opacity-60" />
            <label htmlFor="create-as-subassembly" className="cursor-pointer text-sm text-slate-700">
              <span className="font-semibold">Buat sebagai rakitan antara</span>
              <span className="mt-0.5 block text-slate-500">
                Buat hasil perintah kerja ini sebagai produk rakitan antara.
              </span>
            </label>
          </div>
        </section>

        <SectionAccordion title="Komponen produk">
          <BomTable columns={woComponentColumns} emptyTitle="Komponen produk akan ditampilkan di sini" emptyDescription="Pilih BOM terlebih dahulu." emptyIcon={Package} />
        </SectionAccordion>

        <SectionAccordion title="Biaya produksi">
          <div className="space-y-6">
            {productionCostRows.map(row => <div key={row.key}>
              <p className="mb-2 text-[13px] font-semibold text-slate-700">{row.label}</p>
              <BomTable columns={costColumns} emptyTitle="Biaya akan ditampilkan di sini" emptyDescription="Pilih BOM terlebih dahulu." emptyIcon={MoneyWavy} />
            </div>)}
          </div>
        </SectionAccordion>

        {trackRouting === "use" && !isDisassembly && <SectionAccordion title="Alur produksi">
          <BomTable columns={woRoutingColumns} emptyTitle="Alur produksi akan ditampilkan di sini." emptyDescription="Pilih BOM terlebih dahulu." emptyIcon={GitBranch} />
        </SectionAccordion>}

        <SectionAccordion title="Hasil produksi">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-[13px] font-semibold text-slate-700">Hasil utama</p>
            <span title="Produk utama yang dihasilkan oleh perintah kerja ini.">
              <Info size={15} weight="bold" className="cursor-help text-slate-400" />
            </span>
          </div>
          <BomTable columns={woOutputColumns} emptyTitle="Hasil produksi akan ditampilkan di sini" emptyDescription="Pilih BOM terlebih dahulu." emptyIcon={Package} />
        </SectionAccordion>
      </div>

      <div className="flex justify-end gap-2.5 border-t border-gray-200 bg-slate-50 px-6 py-4">
        <button type="button" onClick={onClose} className={btnModalCancel}>
          Batal
        </button>
        <button type="button" onClick={handleSave} disabled={!canSave} className={`${btnModalSubmit} disabled:cursor-not-allowed disabled:opacity-50`}>
          Simpan
        </button>
      </div>
    </div>
  </div>;
}
const steps = [{
  number: 1,
  title: "Unduh berkas templat",
  description: "Gunakan templat yang tersedia agar data dapat diimpor dengan benar. Berkas templat ini telah disesuaikan dengan persyaratan sistem Jurnal.",
  action: "Unduh"
}, {
  number: 2,
  title: "Isi data pada berkas templat sesuai dengan ketentuan pengisian",
  description: "Ketentuan pengisian tercantum di dalam templat."
}, {
  number: 3,
  title: "Unggah berkas templat",
  description: "Format berkas yang diterima adalah XLSX. Unggah hanya 1 berkas templat."
}];
function ImportPopup({
  title,
  onClose,
  onImport
}) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "");
  }
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
    <div className="w-full max-w-[640px] overflow-visible rounded-xl bg-white shadow-xl">
      <div className={modalHeader}>
        <h2 className={modalTitle}>{title}</h2>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>

      <div className="px-[22px] py-5">
        <p className="mb-6 text-sm text-slate-600">
          Ikuti langkah-langkah berikut sebelum mengimpor data ke Jurnal.
        </p>

        <div className="space-y-6">
          {steps.map(step => <div key={step.number} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {step.number}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{step.title}</p>
              <p className="mt-1 text-sm text-slate-500">{step.description}</p>
              {step.action && <button type="button" className={`${btnSecondary} mt-3`}>
                {step.action}
              </button>}
            </div>
          </div>)}
        </div>

        <div className="mt-6">
          <div onClick={() => inputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-brand hover:bg-indigo-50/40">
            <UploadSimple size={36} weight="bold" className="text-brand" />
            <p className="text-sm text-slate-600">
              Seret berkas ke sini atau{" "}
              <span className="font-semibold text-brand">Pilih berkas</span>
            </p>
            <p className="text-xs text-slate-400">Ukuran berkas maksimal 10 MB.</p>
            <input ref={inputRef} type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" />
          </div>
          {fileName && <p className="mt-3 text-sm font-medium text-slate-700">
            Berkas yang dipilih: {fileName}
          </p>}
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" onClick={onClose} className={btnModalCancel}>
          Batal
        </button>
        <button type="button" onClick={() => onImport?.(fileName)} disabled={!fileName} className={`${btnModalSubmit} disabled:cursor-not-allowed disabled:opacity-50`}>
          Impor
        </button>
      </div>
    </div>
  </div>;
}
function RadioRow({
  label,
  checked,
  onChange
}) {
  return <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700">
    <input type="radio" name="include-production-cost" checked={checked} onChange={onChange} className="h-4 w-4 cursor-pointer accent-brand" />
    {label}
  </label>;
}
function ExportBomPopup({
  onClose,
  onExport
}) {
  const [category, setCategory] = useState("all");
  const [costingMethod, setCostingMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeCost, setIncludeCost] = useState("yes");
  const [confirming, setConfirming] = useState(false);
  const filters = {
    category,
    costingMethod,
    startDate,
    endDate,
    includeCost
  };
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
    <div className="w-full max-w-[480px] overflow-visible rounded-xl bg-white shadow-xl">
      <div className={modalHeader}>
        <h2 className={modalTitle}>Ekspor BOM</h2>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>

      <div className="px-[22px] py-5">
        <div className={formGroup}>
          <label className={formLabel}>Kategori</label>
          <select value={category} onChange={event => setCategory(event.target.value)} className={inputBase}>
            {exportCategoryOptions.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
          </select>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Metode perhitungan biaya</label>
          <select value={costingMethod} onChange={event => setCostingMethod(event.target.value)} className={inputBase}>
            {exportCostingMethodOptions.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
          </select>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Tanggal dibuat</label>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} placeholder="Tanggal mulai" className={inputBase} />
            <input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} placeholder="Tanggal selesai" className={inputBase} />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Tanggal hanya dapat dipilih dalam rentang maksimal 1 tahun
          </p>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Sertakan biaya produksi dalam berkas</label>
          <div className="flex items-center gap-6 pt-1">
            <RadioRow label="Sertakan" checked={includeCost === "yes"} onChange={() => setIncludeCost("yes")} />
            <RadioRow label="Tidak disertakan" checked={includeCost === "no"} onChange={() => setIncludeCost("no")} />
          </div>
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" onClick={onClose} className={btnModalCancel}>
          Batal
        </button>
        <button type="button" onClick={() => setConfirming(true)} className={btnModalSubmit}>
          Ekspor
        </button>
      </div>

      {confirming && <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/55 p-6">
        <div className="w-full max-w-[400px] rounded-xl bg-white p-6 shadow-xl">
          <h3 className="text-[15px] font-bold text-slate-900">
            Konfirmasi ekspor BOM
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            <li>
              Pastikan filter ekspor BOM telah sesuai dengan kebutuhan Anda.
            </li>
            <li>
              Jika jumlah baris dalam berkas ekspor BOM melebihi 10.000, BOM akan diekspor ke beberapa berkas terpisah.
            </li>
          </ul>
          <div className="mt-5 flex justify-end gap-2.5">
            <button type="button" onClick={() => setConfirming(false)} className={btnModalCancel}>
              Batal
            </button>
            <button type="button" onClick={() => {
              setConfirming(false);
              onExport?.(filters);
            }} className={btnModalSubmit}>
              Konfirmasi
            </button>
          </div>
        </div>
      </div>}
    </div>
  </div>;
}
function FilterWorkOrderPopup({
  filters,
  onClose,
  onApply,
  onReset
}) {
  const [keyword, setKeyword] = useState(filters?.keyword ?? "");
  const [type, setType] = useState(filters?.type ?? "");
  const [status, setStatus] = useState(filters?.status ?? "");
  const [startDate, setStartDate] = useState(filters?.startDate ?? "");
  const [endDate, setEndDate] = useState(filters?.endDate ?? "");
  const active = Boolean(filters && (filters.keyword || filters.type || filters.status || filters.startDate || filters.endDate));
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
    <div className="w-full max-w-[480px] overflow-visible rounded-xl bg-white shadow-xl">
      <div className={modalHeader}>
        <h2 className={modalTitle}>Filter</h2>
        <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
          <X size={18} weight="bold" />
        </button>
      </div>

      <div className="px-[22px] py-5">
        <div className={formGroup}>
          <label className={formLabel}>Kata kunci</label>
          <input type="text" value={keyword} maxLength={60} onChange={event => setKeyword(event.target.value)} placeholder="Cari perintah kerja" className={inputBase} />
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Jenis perintah kerja</label>
          <select value={type} onChange={event => setType(event.target.value)} className={inputBase}>
            <option value="">Semua jenis</option>
            {workOrderTypeOptions.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
          </select>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Status perintah kerja</label>
          <select value={status} onChange={event => setStatus(event.target.value)} className={inputBase}>
            <option value="">Semua status</option>
            {workOrderStatusOptions.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
          </select>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Tanggal mulai</label>
          <input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} placeholder="Pilih tanggal" className={inputBase} />
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Tanggal selesai</label>
          <input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} placeholder="Pilih tanggal" className={inputBase} />
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" onClick={() => {
          setKeyword("");
          setType("");
          setStatus("");
          setStartDate("");
          setEndDate("");
          onReset?.();
        }} disabled={!active} className="cursor-pointer px-3 text-[13px] font-semibold text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
          Atur ulang filter
        </button>
        <button type="button" onClick={() => onApply?.({
          keyword,
          type,
          status,
          startDate,
          endDate
        })} className={btnModalSubmit}>
          Terapkan
        </button>
      </div>
    </div>
  </div>;
}
function ProductionsContent() {
  const [view, setView] = useState("list");
  const [activeTab, setActiveTab] = useState("bom");
  const [bomList, setBomList] = useState([]);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [createForm, setCreateForm] = useState(null);
  const [productOptions] = useState([]);
  const [inventoryMappings, setInventoryMappings] = useState([]);
  const [productionCostMappings, setProductionCostMappings] = useState([]);
  const [standardCostList, setStandardCostList] = useState([]);
  function handleSelectMapping() {
    setView("accountMapping");
  }
  function handleSelectStandardCost() {
    setView("standardCost");
  }
  function handleCreateBom() {
    setCreateForm("bom");
  }
  function handleCreateWorkOrder() {
    setCreateForm("workOrder");
  }
  function handleSaveBom(payload) {
    setBomList(prev => [...prev, payload]);
    setCreateForm(null);
  }
  function handleSaveWorkOrder(payload) {
    setWorkOrderList(prev => [...prev, payload]);
    setCreateForm(null);
  }
  function handleSaveBomDraft(payload) {
    setBomList(prev => [...prev, {
      ...payload,
      status: "draft"
    }]);
    setCreateForm(null);
  }
  function handleCreateMapping({
    type,
    name,
    account,
    category
  }) {
    const item = {
      id: `${type}-${Date.now()}`,
      type,
      name,
      account,
      category
    };
    if (type === "inventory") {
      setInventoryMappings(prev => [...prev, item]);
    } else {
      setProductionCostMappings(prev => [...prev, item]);
    }
    return item;
  }
  function handleSaveStandardCost(item) {
    setStandardCostList(prev => [...prev, item]);
  }
  if (view === "accountMapping") {
    return <ProductionAccountMappingPage onBack={() => setView("list")} inventoryMappings={inventoryMappings} productionCostMappings={productionCostMappings} onCreateMapping={handleCreateMapping} />;
  }
  if (view === "standardCost") {
    return <StandardCostPage onBack={() => setView("list")} productOptions={productOptions} productionCostMappings={productionCostMappings} standardCostList={standardCostList} onSaveStandardCost={handleSaveStandardCost} onCreateMapping={handleCreateMapping} />;
  }
  return <div className="min-h-screen bg-white">
    <ProductionsHeader activeTab={activeTab} onTabChange={setActiveTab} onSelectMapping={handleSelectMapping} onSelectStandardCost={handleSelectStandardCost} onCreateBom={handleCreateBom} onCreateWorkOrder={handleCreateWorkOrder} />
    {activeTab === "bom" ? <BomListTab bomList={bomList} /> : <WorkOrderListTab workOrderList={workOrderList} />}

    {createForm === "bom" && <CreateBomModal onClose={() => setCreateForm(null)} onSave={handleSaveBom} onSaveDraft={handleSaveBomDraft} accountOptions={productionAccountOptions} />}

    {createForm === "workOrder" && <CreateWorkOrderModal onClose={() => setCreateForm(null)} onSave={handleSaveWorkOrder} bomOptions={bomList.map(item => ({
      value: item.bomCode,
      label: item.bomName
    }))} />}
  </div>;
}

const DARK_CSS = `
.dash-dark { color-scheme: dark; }

/* Tombol aksi */
.dd-btn { background: #1d62a4 !important; color: #fff !important; border-color: #1d62a4 !important; }
.dd-btn:hover { background: #163859 !important; }
.dash-dark .dd-btn { 
  background: #df8b31ff !important; 
  color: #ffffffff !important; 
  box-shadow: 0 4px 8px rgba(254, 92, 23, 0.49) !important;
  transition: all 0.2s ease-in-out; 
}
.dash-dark .dd-btn:hover { 
  background: #e08c33df !important; 
}

.dd-btn-size {
  height: 38px !important;
  padding: 0 16px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  border-radius: 8px !important;
  white-space: nowrap !important;
}

/* Background */
.dash-dark .bg-white { background-color: #121212 !important; }
.dash-dark .bg-slate-50,
.dash-dark .bg-slate-100 { background-color: #1a1a1a !important; }
.dash-dark .bg-indigo-50,
.dash-dark .bg-indigo-50\\/40 { background-color: rgba(229,184,92,0.12) !important; }
.dash-dark .hover\\:bg-slate-50:hover,
.dash-dark .hover\\:bg-indigo-50\\/40:hover { background-color: #2d2d2d !important; }
.dash-dark .bg-slate-300 { background-color: #4b4b4b !important; }

/* Border */
.dash-dark .border-gray-100,
.dash-dark .border-gray-200,
.dash-dark .border-gray-300 { border-color: #634f27 !important; }
.dash-dark .hover\\:border-gray-400:hover { border-color: #E5B85C !important; }

/* Teks */
.dash-dark .text-slate-900,
.dash-dark .text-slate-800,
.dash-dark .text-slate-700,
.dash-dark .text-gray-900 { color: #f1f5f9 !important; }
.dash-dark .text-slate-600,
.dash-dark .text-slate-500 { color: #cbd5e1 !important; }
.dash-dark .text-slate-400,
.dash-dark .text-gray-400 { color: #94a3b8 !important; }
.dash-dark .hover\\:text-slate-700:hover,
.dash-dark .hover\\:text-slate-800:hover,
.dash-dark .hover\\:text-slate-600:hover { color: #E5B85C !important; }

/* Warna brand -> emas */
.dash-dark .text-brand { color: #E5B85C !important; }
.dash-dark .border-brand { border-color: #E5B85C !important; }
.dash-dark .bg-brand { background-color: #E5B85C; }
.dash-dark .bg-brand.text-white { color: #f1f1f1ff !important; }
.dash-dark .accent-brand { accent-color: #E5B85C; }
.dash-dark .focus-within\\:border-brand:focus-within,
.dash-dark .focus\\:border-brand:focus { border-color: #E5B85C !important; }

/* Input, select, textarea */
.dash-dark input,
.dash-dark select,
.dash-dark textarea {
  background-color: #262626 !important;
  color: #f1f5f9 !important;
  border-color: #634f27 !important;
}
.dash-dark input:disabled { background-color: #1a1a1a !important; color: #94a3b8 !important; }
.dash-dark input::placeholder,
.dash-dark textarea::placeholder { color: #94a3b8; }
.dash-dark input:focus,
.dash-dark select:focus,
.dash-dark textarea:focus { border-color: #E5B85C !important; }
.dash-dark select option { background: #262626; color: #f1f5f9; }
.dash-dark .bg-transparent { background-color: transparent !important; }

/* Tabel */
.dash-dark thead tr,
.dash-dark th { background-color: #d38e0d69 !important; color: #f1f5f9 !important; border-color: #634f27 !important; }
.dash-dark td { color: #e2e8f0 !important; border-color: #3a3326 !important; }
.dash-dark tbody tr:hover { background-color: none !important; }

/* Teks error tetap merah */
.dash-dark .text-red-600 { color: #f87171 !important; }
.dash-dark .border-red-500 { border-color: #ef4444 !important; }
`;

export default function ProductionsMainPage() {
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
      <ProductionsContent />
      <style>{DARK_CSS}</style>
    </div>
  );
}