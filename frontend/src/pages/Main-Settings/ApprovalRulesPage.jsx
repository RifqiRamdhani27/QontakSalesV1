import { useRef, useState } from "react";
import {
  CaretDown,
  Check,
  Clock,
  Plus,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import Pagination from "@/components/ui/Pagination";
import PopoverSelect, { useOutsideClose } from "@/components/ui/PopoverSelect";
import { DropdownPanel } from "@/components/ui/PopoverSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import {
  tableWrapper,
  tableBase,
  tableCard,
  th,
  td,
  trHover,
  selectBase,
  formLabel,
  btnPrimary,
  modalOverlay,
  modalPanel,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalFooter,
  formGroup,
  inputBase,
  btnModalCancel,
  btnModalSubmit,
  btnModalDelete,
} from "@/components/ui/styles";
import {
  approvalTransactionTypes,
  approvalApproverTypes,
  approvalCriteriaOptions,
  ruleLabel,
} from "@/data/ruleData";
import { useApprovalRules } from "@/services/useSetting";

const PAGE_SIZE = 5;
const MAX_APPROVAL_STEPS = 4;
const RULE_NAME_MAX = 60;
const DESCRIPTION_MAX = 200;


const formatAmount = (value) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getRuleAmount = (rule) =>
  Number(rule?.amountValue ?? rule?.amount ?? 0) || 0;

const parseAmount = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

const titleCase = (value) =>
  value
    ? value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

const displayName = (username) =>
  username ? titleCase(String(username).replace(/\./g, " ")) : "";

function productScopeLabel(type) {
  if (type === "Product conversion") return "Konversi produk di";
  if (type === "Warehouse transfer") return "Transfer gudang dari";
  if (type === "Stock adjustment") return "Kategori penyesuaian";
  return "Gudang";
}

function productScopeAllLabel(type) {
  if (type === "Stock adjustment") return "Semua kategori penyesuaian";
  return "Semua gudang";
}

function productScopeSomeLabel(type) {
  if (type === "Stock adjustment") return "Kategori penyesuaian tertentu";
  return "Gudang tertentu";
}

function TransactionTypeSelect({
  group,
  type,
  onGroupChange,
  onTypeChange,
}) {
  const groupOptions = approvalTransactionTypes.map((item) => item.label);
  const subOptions =
    approvalTransactionTypes.find((item) => item.label === group)?.options || [];

  return (
    <div className="flex flex-col gap-2.5">
      <PopoverSelect
        floating
        value={group}
        getOptionLabel={ruleLabel}
        emptyText="Tidak ada pilihan"
        placeholder="Pilih jenis transaksi"
        groups={[{ label: "", options: groupOptions }]}
        onSelect={onGroupChange}
      />
      {group && subOptions.length > 0 && (
        <PopoverSelect
          floating
          value={type}
          getOptionLabel={ruleLabel}
          emptyText="Tidak ada pilihan"
          placeholder="Pilih jenis transaksi"
          groups={[{ label: ruleLabel(group), options: subOptions }]}
          onSelect={onTypeChange}
        />
      )}
    </div>
  );
}

function ApprovalRuleForm({ initialRule, users, customers, onSubmit, onClose }) {
  const [ruleName, setRuleName] = useState(initialRule?.ruleName || "");
  const [description, setDescription] = useState(initialRule?.description || "");
  const [transactionGroup, setTransactionGroup] = useState(
    initialRule?.transactionGroup || "Sales"
  );
  const [transactionType, setTransactionType] = useState(
    initialRule?.transactionType || ""
  );
  const [createdFor, setCreatedFor] = useState(initialRule?.createdFor || "all");
  const [createdBy, setCreatedBy] = useState(initialRule?.createdBy || "all");
  const [createdByUsers, setCreatedByUsers] = useState(
    initialRule?.createdByUsers || []
  );
  const [createdForCustomers, setCreatedForCustomers] = useState(
    initialRule?.createdForCustomers || []
  );
  const [productScope, setProductScope] = useState(
    initialRule?.productScope || "all"
  );
  const [applyToDraft, setApplyToDraft] = useState(
    initialRule ? initialRule.applyToDraft : true
  );
  const [criteria, setCriteria] = useState(initialRule?.criteria || []);
  const [overdueDays, setOverdueDays] = useState(initialRule?.overdueDays || 0);
  const [amountValue, setAmountValue] = useState(
    initialRule?.amountValue ?? initialRule?.amount ?? 0
  );
  const [steps, setSteps] = useState(
    initialRule?.levels || [{ approverType: "All must approve", approvers: [] }]
  );
  const {
    ref: criteriaRef,
    menuRef: criteriaMenuRef,
    open: showCriteriaPopover,
    setOpen: setShowCriteriaPopover,
  } = useOutsideClose();
  const criteriaButtonRef = useRef(null);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ruleName,
      description,
      transactionGroup,
      transactionType,
      createdBy,
      createdByUsers,
      createdFor,
      createdForCustomers,
      productScope,
      applyToDraft,
      criteria,
      overdueDays,
      amountValue,
      levels: steps,
    });
  };

  const addStep = () =>
    setSteps((current) => [
      ...current,
      { approverType: "Either must approve", approvers: [] },
    ]);

  const removeStep = (index) =>
    setSteps((current) => current.filter((_, idx) => idx !== index));

  const setStepField = (index, field, value) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx === index ? { ...step, [field]: value } : step
      )
    );


  const addApproverToStep = (index) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx === index
          ? { ...step, approvers: [...step.approvers, ""] }
          : step
      )
    );

  const setStepApprover = (index, position, value) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx !== index
          ? step
          : {
              ...step,
              approvers: step.approvers.map((item, pos) =>
                pos === position ? value : item
              ),
            }
      )
    );

  const removeStepApprover = (index, position) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx !== index
          ? step
          : {
              ...step,
              approvers: step.approvers.filter((_, pos) => pos !== position),
            }
      )
    );

  const toggleCreatedByUser = (user) =>
    setCreatedByUsers((current) =>
      current.includes(user)
        ? current.filter((item) => item !== user)
        : [...current, user]
    );

  const toggleCreatedForCustomer = (customer) =>
    setCreatedForCustomers((current) =>
      current.includes(customer)
        ? current.filter((item) => item !== customer)
        : [...current, customer]
    );

  const addCriteria = (value) => {
    if (value === "specificValue" && createdFor !== "all") return;
    setCriteria((current) =>
      current.includes(value) ? current : [...current, value]
    );
    setShowCriteriaPopover(false);
  };

  const removeCriteria = (value) =>
    setCriteria((current) => current.filter((item) => item !== value));

  return (
    <form className={modalPanel} onSubmit={submit}>
      <div className={modalHeader}>
        <h3 className={modalTitle}>
          {initialRule ? "Ubah aturan persetujuan" : "Buat aturan persetujuan"}
        </h3>
        <button
          type="button"
          className={modalCloseButton}
          onClick={onClose}
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-[22px] py-5">
        <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-3.5">
          <p className="m-0 mb-1.5 text-[13px] font-semibold text-blue-900">
            Kriteria persetujuan baru telah diaktifkan. Perlu informasi lebih lanjut?
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[12px] font-medium text-brand hover:underline"
              onClick={() => addCriteria("maxReceivable")}
            >
              Pelajari batas maksimal piutang
            </button>
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[12px] font-medium text-brand hover:underline"
              onClick={() => addCriteria("overdue")}
            >
              Pelajari keterlambatan pembayaran
            </button>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Informasi aturan
          </h4>
          <div className={formGroup}>
            <label className={formLabel} htmlFor="approval_rule_name">
              Nama aturan <span className="text-red-600">*</span>
            </label>
            <input
              id="approval_rule_name"
              name="ruleName"
              type="text"
              maxLength={RULE_NAME_MAX}
              className={inputBase}
              value={ruleName}
              onChange={(event) => setRuleName(event.target.value)}
            />
            <p className="m-0 mt-1 text-right text-[12px] text-slate-400">
              {ruleName.length} / {RULE_NAME_MAX}
            </p>
          </div>
          <div className={formGroup}>
            <label className={formLabel} htmlFor="approval_description">
              Deskripsi
            </label>
            <textarea
              id="approval_description"
              name="description"
              maxLength={DESCRIPTION_MAX}
              className={`${inputBase} resize-y`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <p className="m-0 mt-1 text-right text-[12px] text-slate-400">
              {description.length} / {DESCRIPTION_MAX}
            </p>
          </div>
          <div className={formGroup}>
            <label className={formLabel} htmlFor="approval_transaction_type">
              Jenis transaksi <span className="text-red-600">*</span>
            </label>
            <TransactionTypeSelect
              group={transactionGroup}
              type={transactionType}
              onGroupChange={(value) => {
                setTransactionGroup(value);
                setTransactionType("");
                if (value === "Products") setCriteria([]);
              }}
              onTypeChange={setTransactionType}
            />
          </div>

          {transactionGroup === "Products" && transactionType && (
            <div className="mb-4">
              <span className={formLabel}>
                {productScopeLabel(transactionType)}{" "}
                <span className="text-red-600">*</span>
              </span>
              <div className="flex flex-col gap-2.5">
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="productScope"
                    value="all"
                    className="accent-brand"
                    checked={productScope === "all"}
                    onChange={(event) => setProductScope(event.target.value)}
                  />
                  {productScopeAllLabel(transactionType)}
                </label>
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="productScope"
                    value="some"
                    className="accent-brand"
                    checked={productScope === "some"}
                    onChange={(event) => setProductScope(event.target.value)}
                  />
                  {productScopeSomeLabel(transactionType)}
                </label>
              </div>
            </div>
          )}
          <div className="mb-4">
            <span className={formLabel}>
              Transaksi dibuat oleh <span className="text-red-600">*</span>
            </span>
            <div className="flex flex-col gap-2.5">
              <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                <input
                  type="radio"
                  name="createdBy"
                  value="all"
                  className="accent-brand"
                  checked={createdBy === "all"}
                  onChange={(event) => setCreatedBy(event.target.value)}
                />
                Semua pengguna
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                <input
                  type="radio"
                  name="createdBy"
                  value="some"
                  className="accent-brand"
                  checked={createdBy === "some"}
                  onChange={(event) => setCreatedBy(event.target.value)}
                />
                Pengguna tertentu
              </label>
            </div>
            {createdBy === "some" && (
              <div className="mt-3">
                <span className={formLabel}>Pilih pengguna</span>
                <MultiSelect
                  floating
                  selected={createdByUsers}
                  emptyText="Belum ada pengguna"
                  removeLabel="Hapus"
                  onToggle={toggleCreatedByUser}
                  options={users.map((user) => user.username)}
                  placeholder="Pilih pengguna"
                />
              </div>
            )}
          </div>
          {transactionGroup === "Sales" && (
            <div>
              <span className={formLabel}>
                Transaksi dibuat untuk <span className="text-red-600">*</span>
              </span>
              <div className="flex flex-col gap-2.5">
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="createdFor"
                    value="all"
                    className="accent-brand"
                    checked={createdFor === "all"}
                    onChange={(event) => setCreatedFor(event.target.value)}
                  />
                  Semua pelanggan
                </label>
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="createdFor"
                    value="some"
                    className="accent-brand"
                    checked={createdFor === "some"}
                    onChange={(event) => setCreatedFor(event.target.value)}
                  />
                  Pelanggan tertentu
                </label>
              </div>
              {createdFor === "some" && (
                <div className="mt-3">
                  <span className={formLabel}>Pilih pelanggan</span>
                  <MultiSelect
                    floating
                    selected={createdForCustomers}
                    emptyText="Belum ada pelanggan"
                    removeLabel="Hapus"
                    onToggle={toggleCreatedForCustomer}
                    options={customers.map((customer) => customer.name)}
                    placeholder="Pilih pelanggan"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {transactionGroup !== "Products" && (
          <div className="mb-5 border-t border-gray-200 pt-5">
            <h4 className="m-0 mb-1 text-[15px] font-bold text-gray-900">
              Kriteria persetujuan
            </h4>
            <p className="m-0 mb-4 text-[13px] text-slate-500">
              Tentukan kondisi transaksi yang memerlukan persetujuan.
            </p>

            {criteria.map((value, index) => {
              const option = approvalCriteriaOptions.find(
                (item) => item.value === value
              );
              if (!option) return null;
              return (
                <div key={value} className="mt-3">
                  {index > 0 && (
                    <p className="m-0 mb-2 text-center text-[13px] font-medium text-slate-500">
                      atau
                    </p>
                  )}
                  <div className="rounded-lg border border-gray-200 bg-slate-50/60 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[13px] font-bold text-gray-900">
                        {option.label}
                      </span>
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-red-600 hover:text-red-700"
                        onClick={() => removeCriteria(value)}
                      >
                        <Trash size={13} /> Hapus
                      </button>
                    </div>
                    {value === "specificValue" ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-slate-600">
                            Lebih dari
                          </span>
                          <span className="text-red-600">*</span>
                          <span className="text-[13px] font-medium text-gray-900">
                            Rp
                          </span>
                          <input
                            type="text"
                            className={inputBase}
                            value={amountValue}
                            onChange={(event) =>
                              setAmountValue(parseAmount(event.target.value))
                            }
                          />
                        </div>
                        <p className="m-0 text-[12px] text-slate-500">
                          Tips: Masukkan nilai terkecil jika Anda ingin membuat lebih dari satu aturan untuk jenis transaksi yang sama.
                        </p>
                        <p className="m-0 cursor-pointer text-[12px] font-medium text-brand hover:underline">
                          Lihat contoh
                        </p>
                      </div>
                    ) : (
                      <p className="m-0 text-[13px] text-slate-600">
                        {option.description}
                        {value === "overdue" && (
                          <>
                            {" "}
                            <span className="whitespace-nowrap">
                              Lebih dari <span className="text-red-600">*</span>
                            </span>
                            <input
                              type="text"
                              className={inputBase}
                              value={overdueDays}
                              onChange={(event) =>
                                setOverdueDays(parseAmount(event.target.value))
                              }
                            />
                            hari
                          </>
                        )}
                        {value === "maxReceivable" && (
                          <button
                            type="button"
                            className="ml-1.5 cursor-pointer border-0 bg-transparent p-0 font-medium text-brand hover:underline"
                          >
                            Lihat cara memasukkan piutang
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="relative mt-4" ref={criteriaRef}>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                ref={criteriaButtonRef}
                onClick={() => setShowCriteriaPopover((current) => !current)}
              >
                <Plus size={14} /> Tambah kriteria
              </button>
              {showCriteriaPopover && (
                <DropdownPanel
                  rect={criteriaButtonRef.current?.getBoundingClientRect()}
                  triggerRef={criteriaButtonRef}
                  contentRef={criteriaMenuRef}
                  onClose={() => setShowCriteriaPopover(false)}
                  width={340}
                  variant="settings"
                  className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                >
                  {approvalCriteriaOptions
                    .filter((option) => !criteria.includes(option.value))
                    .map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="block w-full cursor-pointer px-4 py-2.5 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                        onClick={() => addCriteria(option.value)}
                      >
                        {option.label}
                        <span className="mt-0.5 block text-[11px] text-slate-400">
                          {option.note}
                        </span>
                      </button>
                    ))}
                  {approvalCriteriaOptions.every((option) =>
                    criteria.includes(option.value)
                  ) && (
                    <p className="m-0 px-4 py-2.5 text-[12px] text-slate-400">
                      Semua kriteria telah ditambahkan.
                    </p>
                  )}
                </DropdownPanel>
              )}
            </div>
          </div>
        )}

        <div className="mb-5 border-t border-gray-200 pt-5">
          <h4 className="m-0 mb-1 text-[15px] font-bold text-gray-900">
            Tahapan persetujuan
          </h4>
          <p className="m-0 mb-1 text-[13px] text-slate-500">
            Tentukan penyetuju dan cara persetujuan diberikan.
          </p>
          <p className="m-0 mb-4 text-[12px] text-slate-500">
            Pengguna dengan peran pemilik dapat langsung menyetujui transaksi tanpa melalui tahapan persetujuan.
          </p>

          {steps.map((step, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg border border-gray-200 bg-slate-50/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-900">
                  Tahap persetujuan {index + 1}
                </span>
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-red-600 hover:text-red-700"
                    onClick={() => removeStep(index)}
                  >
                    <Trash size={13} /> Hapus
                  </button>
                )}
              </div>
              <div className={formGroup}>
                <label className={formLabel} htmlFor={`approval_type_${index}`}>
                  Jenis persetujuan <span className="text-red-600">*</span>
                </label>
                <select
                  id={`approval_type_${index}`}
                  name="approverType"
                  className={selectBase}
                  value={step.approverType}
                  onChange={(event) =>
                    setStepField(index, "approverType", event.target.value)
                  }
                >
                  {approvalApproverTypes.map((option) => (
                    <option key={option} value={option}>
                      {ruleLabel(option)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className={formLabel}>
                  Penyetuju <span className="text-red-600">*</span>
                </span>
                <div className="flex flex-col gap-2">
                  {step.approvers.length === 0 && (
                    <span className="text-[12px] text-slate-400">
                      Belum ada penyetuju dipilih
                    </span>
                  )}
                  {step.approvers.map((user, position) => (
                    <div
                      key={position}
                      className="flex items-center gap-2"
                    >
                      <div className="flex-1">
                        <PopoverSelect
                          floating
                          value={user}
                          emptyText="Belum ada pengguna"
                          placeholder="Pilih penyetuju"
                          groups={[
                            { label: "", options: users.map((item) => item.username) },
                          ]}
                          onSelect={(value) =>
                            setStepApprover(index, position, value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="cursor-pointer rounded-sm p-1 text-gray-400 hover:bg-slate-100 hover:text-gray-700"
                        onClick={() => removeStepApprover(index, position)}
                        aria-label={`Hapus penyetuju ${position + 1}`}
                      >
                        <X size={13} weight="bold" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                    onClick={() => addApproverToStep(index)}
                  >
                    <Plus size={13} /> Tambah penyetuju
                  </button>
                </div>
              </div>
            </div>
          ))}

          {steps.length < MAX_APPROVAL_STEPS && (
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
              onClick={addStep}
            >
              <Plus size={14} /> Tambah tahap persetujuan
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 pt-5">
          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Penerapan aturan
          </h4>
          <label className="flex cursor-pointer select-none items-start gap-2.5 text-sm text-gray-900">
            <input
              type="checkbox"
              name="applyToDraft"
              className="mt-0.5 accent-brand"
              checked={applyToDraft}
              onChange={(event) => setApplyToDraft(event.target.checked)}
            />
            <span>
              Terapkan aturan ini pada draf transaksi yang menunggu persetujuan
              <span className="mt-1 block text-[12px] text-slate-500">
                Jika kriteria aturan baru ini (jenis transaksi, pembuat, dan pelanggan) sama dengan aturan yang sedang berlaku, aturan baru akan menggantikannya secara otomatis saat diaktifkan.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" className={btnModalCancel} onClick={onClose}>
          Batal
        </button>
        <button type="submit" className={btnModalSubmit}>
          Simpan
        </button>
      </div>

    </form>
  );
}

function DeleteApprovalModal({ onConfirm, onClose }) {
  return (
    <div className={modalOverlay}>
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-[22px] py-4">
          <h3 className="m-0 text-base font-semibold text-gray-900">
            Hapus aturan ini?
          </h3>
          <button
            type="button"
            className={modalCloseButton}
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-[22px] py-5">
          <p className="m-0 text-sm leading-relaxed text-slate-600">
            Aturan persetujuan yang dihapus tidak dapat dipulihkan.
          </p>
        </div>
        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Batal
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangelogModal({ rule, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const logs = rule.changelog || [];
  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageLogs = logs.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return (
    <div className={modalOverlay}>
      <div className="w-full max-w-[640px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h3 className={modalTitle}>Riwayat perubahan</h3>
          <button
            type="button"
            className={modalCloseButton}
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-[22px] py-5">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className={tableWrapper}>
              <table className={tableBase}>
                <thead>
                  <tr>
                    <th className={th}>Waktu perubahan</th>
                    <th className={th}>Pengguna</th>
                    <th className={th}>Tindakan</th>
                    <th className={th}>Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {pageLogs.map((log, index) => (
                    <tr key={index} className={trHover}>
                      <td className={td}>{log.changeTime}</td>
                      <td className={td}>{log.user}</td>
                      <td className={td}>{ruleLabel(log.action)}</td>
                      <td className={td}>{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={logs.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleDetailModal({ rule, users, onEdit, onDelete, onClose }) {
  const { ref, menuRef, open, setOpen } = useOutsideClose();
  const actionTriggerRef = useRef(null);
  const {
    ref: allUsersRef,
    menuRef: allUsersMenuRef,
    open: showAllUsers,
    setOpen: setShowAllUsers,
  } = useOutsideClose();
  const allUsersButtonRef = useRef(null);

  const criteriaRows = [
    ...(rule.criteria || []).includes("specificValue")
      ? [
          {
            label: "Transaksi melebihi nilai tertentu",
            value: `Lebih dari Rp${formatAmount(getRuleAmount(rule))}`,
          },
        ]
      : [],
    ...(rule.criteria || [])
      .filter((value) => value !== "specificValue")
      .map((value) => {
        const option = approvalCriteriaOptions.find(
          (item) => item.value === value
        );

        return {
          label: option?.label || value,
          value:
            value === "overdue"
              ? `${option?.description || "Terlambat dibayar selama"} ${rule.overdueDays || 0} hari`
              : option?.description || value,
        };
      }),
  ];

  return (
    <div className={modalOverlay}>
      <div className="w-full max-w-[640px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h3 className={modalTitle}>{rule.ruleName}</h3>
          <div className="flex items-center gap-2">
            <div className="relative" ref={ref}>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                ref={actionTriggerRef}
                onClick={() => setOpen((current) => !current)}
              >
                Tindakan <CaretDown size={12} />
              </button>
              {open && (
                <DropdownPanel
                  rect={actionTriggerRef.current?.getBoundingClientRect()}
                  triggerRef={actionTriggerRef}
                  contentRef={menuRef}
                  onClose={() => setOpen(false)}
                  width={160}
                  align="right"
                  variant="settings"
                  className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                >
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                    onClick={() => {
                      setOpen(false);
                      onEdit(rule);
                    }}
                  >
                    <PencilSimple size={14} /> Ubah
                  </button>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setOpen(false);
                      onDelete(rule);
                    }}
                  >
                    <Trash size={14} /> Hapus
                  </button>
                </DropdownPanel>
              )}
            </div>
            <button
              type="button"
              className={modalCloseButton}
              onClick={onClose}
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-[22px] py-5">
          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Informasi aturan
          </h4>
          <div className="mb-5 overflow-hidden rounded-lg border border-gray-200">
            <div className={tableWrapper}>
              <table className={tableBase}>
                <tbody>
                  <tr>
                    <td className="w-[180px] bg-slate-50/60 font-medium text-gray-700">
                      Nama aturan
                    </td>
                    <td className={td}>{rule.ruleName}</td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Deskripsi
                    </td>
                    <td className={td}>{rule.description}</td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Jenis transaksi
                    </td>
                    <td className={td}>{titleCase(ruleLabel(rule.transactionType))}</td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Transaksi dibuat oleh
                    </td>
                    <td className={td}>
                      <div className="flex flex-wrap items-center gap-2">
                        {rule.createdBy === "all" ? (
                          <span>Semua pengguna.</span>
                        ) : (
                          (rule.createdByUsers || []).map((user) => (
                            <span
                              key={user}
                              className="rounded-full border border-gray-200 bg-slate-50 px-2.5 py-0.5 text-[12px] text-gray-700"
                            >
                              {displayName(user)}
                            </span>
                          ))
                        )}
                        <div className="relative" ref={allUsersRef}>
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-brand hover:underline"
                            ref={allUsersButtonRef}
                            onClick={() => setShowAllUsers((current) => !current)}
                          >
                            Lihat semua
                          </button>
                          {showAllUsers && (
                            <DropdownPanel
                              rect={allUsersButtonRef.current?.getBoundingClientRect()}
                              triggerRef={allUsersButtonRef}
                              contentRef={allUsersMenuRef}
                              onClose={() => setShowAllUsers(false)}
                              width={220}
                              variant="settings"
                              className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                            >
                              {users.map((user) => (
                                <p
                                  key={user.id}
                                  className="m-0 cursor-pointer px-4 py-2 text-[13px] text-gray-700 hover:bg-slate-50"
                                >
                                  {displayName(user.username)}
                                </p>
                              ))}
                            </DropdownPanel>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Transaksi dibuat untuk
                    </td>
                    <td className={td}>
                      {rule.createdFor === "all" ? (
                        "Semua pelanggan."
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {(rule.createdForCustomers || []).map((customer) => (
                            <span
                              key={customer}
                              className="rounded-full border border-gray-200 bg-slate-50 px-2.5 py-0.5 text-[12px] text-gray-700"
                            >
                              {customer}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Kriteria persetujuan
          </h4>
          <p className="m-0 mb-3 text-[13px] text-slate-500">
            Kondisi transaksi yang memerlukan persetujuan.
          </p>
          {criteriaRows.length > 0 && (
            <>
              <p className="m-0 mb-2 text-[13px] font-medium text-slate-600">
                Rincian
              </p>
              <div className="mb-5 overflow-hidden rounded-lg border border-gray-200">
                <div className={tableWrapper}>
                  <table className={tableBase}>
                    <tbody>
                      {criteriaRows.map((row, index) => (
                        <tr key={index}>
                          <td className="w-[180px] bg-slate-50/60 font-medium text-gray-700">
                            {row.label}
                          </td>
                          <td className={td}>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Tahapan persetujuan
          </h4>
          <p className="m-0 mb-3 text-[13px] text-slate-500">
            Kondisi transaksi yang memerlukan persetujuan.
          </p>
          <p className="m-0 mb-3 text-[12px] text-slate-500">
            Pengguna dengan peran Pemilik dapat langsung menyetujui transaksi tanpa melalui tahapan persetujuan.
          </p>
          <div className="space-y-3">
            {(rule.levels || []).map((step, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-slate-50/60 p-4"
              >
                <span className="mb-2 block text-[13px] font-bold text-gray-900">
                  Tahap {index + 1}
                </span>
                <p className="m-0 text-[13px] text-slate-600">
                  {step.approvers.map(displayName).join(", ")}
                </p>
                <p className="m-0 mt-1 text-[12px] text-slate-500">
                  {step.approverType === "All must approve"
                    ? "Semua penyetuju yang disebutkan harus menyetujui."
                    : "Salah satu penyetuju yang disebutkan harus menyetujui."}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-[22px] py-3.5">
          <p className="m-0 text-[12px] text-slate-500">
            Terakhir diubah oleh {rule.lastEditedBy} pada {rule.lastEdited} (GMT+7)
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionsMenu({
  rule,
  openActionId,
  setOpenActionId,
  onEdit,
  onDelete,
  onChangelog,
}) {
  const triggerRef = useRef(null);
  const isOpen = openActionId === rule.id;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-slate-50"
        ref={triggerRef}
        onClick={() => setOpenActionId(isOpen ? null : rule.id)}
      >
        Tindakan <CaretDown size={12} />
      </button>
      {isOpen && (
        <DropdownPanel
          rect={triggerRef.current?.getBoundingClientRect()}
          triggerRef={triggerRef}
          onClose={() => setOpenActionId(null)}
          width={176}
          align="right"
          variant="settings"
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
            onClick={() => {
              setOpenActionId(null);
              onEdit(rule);
            }}
          >
            <PencilSimple size={14} /> Ubah
          </button>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
            onClick={() => {
              setOpenActionId(null);
              onDelete(rule);
            }}
          >
            <Trash size={14} /> Hapus
          </button>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
            onClick={() => {
              setOpenActionId(null);
              onChangelog(rule);
            }}
          >
            <Clock size={14} /> Lihat riwayat perubahan
          </button>
        </DropdownPanel>
      )}
    </div>
  );
}

export default function ApprovalRulesPage() {
  const { rules, options, loading, error, create, update, remove } =
    useApprovalRules();
  const [filterType, setFilterType] = useState("");
  const [searchName, setSearchName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const [viewingChangelog, setViewingChangelog] = useState(null);
  const [detailRule, setDetailRule] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filtered = rules.filter((rule) => {
    const matchType = filterType ? rule.transactionType === filterType : true;
    const matchName = searchName
      ? rule.ruleName.toLowerCase().includes(searchName.toLowerCase())
      : true;
    return matchType && matchName;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const stamp = () =>
    new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSubmit = async (values) => {
    const change = {
      changeTime: stamp(),
      user: "Anda",
      action: editingRule ? "Edit" : "Buat",
      description: editingRule ? "Aturan persetujuan diperbarui" : "Aturan persetujuan dibuat",
    };
    const payload = {
      ...values,
      lastEdited: change.changeTime,
      lastEditedBy: change.user,
      changelog: [...(editingRule?.changelog || []), change],
    };
    try {
      if (editingRule) {
        await update(editingRule.id, payload);
      } else {
        await create(payload);
      }
      setEditingRule(null);
      setShowForm(false);
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menyimpan aturan persetujuan.");
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deletingRule.id);
      setDeletingRule(null);
      setCurrentPage((page) => Math.max(1, page));
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menghapus aturan persetujuan.");
    }
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">
          Aturan persetujuan
        </h2>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => {
            setEditingRule(null);
            setShowForm(true);
          }}
        >
          Buat aturan persetujuan
        </button>
      </div>

      {(error || loading) && (
        <p className="m-0 mb-4 text-sm text-slate-500">
          {loading ? "Memuat aturan persetujuan..." : error}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-[240px]">
          <PopoverSelect
            floating
            value={filterType}
            getOptionLabel={ruleLabel}
            emptyText="Tidak ada pilihan"
            placeholder="Jenis transaksi"
            groups={approvalTransactionTypes}
            onSelect={(value) => {
              setFilterType(value === "All transaction types" ? "" : value);
              setCurrentPage(1);
            }}
            includeAll
          />
        </div>
        <div className="w-full max-w-[240px]">
          <input
            type="text"
            placeholder="Cari nama aturan"
            className={inputBase}
            value={searchName}
            onChange={(event) => {
              setSearchName(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={tableCard}>
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="m-0 text-[15px] font-semibold text-gray-900">
              Belum ada aturan persetujuan
            </p>
            <p className="m-0 text-sm text-slate-500">
              Aturan persetujuan akan tampil di sini.
            </p>
          </div>
        </div>
      ) : (
        <div className={tableCard}>
          <div className={tableWrapper}>
            <table className={tableBase}>
              <thead>
                <tr>
                  <th className={th}>Nama aturan</th>
                  <th className={th}>Jenis transaksi</th>
                  <th className={th}>Melebihi nilai tertentu</th>
                  <th className={th}>Melebihi batas maksimal piutang</th>
                  <th className={th}>Terlambat dibayar</th>
                  <th className={th}>Terakhir diubah</th>
                  <th className="bg-slate-50 px-[18px] py-3.5 text-right">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((rule) => (
                  <tr key={rule.id} className={trHover}>
                    <td className={td}>
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-brand hover:underline"
                        onClick={() => setDetailRule(rule)}
                      >
                        {rule.ruleName}
                      </button>
                      {rule.description && (
                        <span className="mt-0.5 block text-[12px] text-slate-500">
                          {rule.description}
                        </span>
                      )}
                    </td>
                    <td className={td}>{ruleLabel(rule.transactionType)}</td>
                    <td className={td}>
                      {(rule.criteria || []).includes("specificValue") &&
                      getRuleAmount(rule) > 0
                        ? `Rp ${formatAmount(getRuleAmount(rule))}`
                        : "-"}
                    </td>
                    <td className={td}>
                      {(rule.criteria || []).includes("maxReceivable")
                        ? "Aktif"
                        : "-"}
                    </td>
                    <td className={td}>
                      {(rule.criteria || []).includes("overdue")
                        ? `${rule.overdueDays || 0} hari`
                        : "-"}
                    </td>
                    <td className={td}>
                      {rule.lastEdited}
                      {rule.lastEditedBy && (
                        <span className="block text-[12px] text-slate-500">
                          Oleh {rule.lastEditedBy}
                        </span>
                      )}
                    </td>
                    <td className="border-b border-slate-100 px-[18px] py-[15px] text-right">
                      <ActionsMenu
                        rule={rule}
                        openActionId={openActionId}
                        setOpenActionId={setOpenActionId}
                        onEdit={(ruleToEdit) => {
                          setEditingRule(ruleToEdit);
                          setShowForm(true);
                        }}
                        onDelete={(ruleToDelete) =>
                          setDeletingRule(ruleToDelete)
                        }
                        onChangelog={(ruleToView) =>
                          setViewingChangelog(ruleToView)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {detailRule && (
        <RuleDetailModal
          rule={detailRule}
          users={options.users}
          onEdit={(rule) => {
            setDetailRule(null);
            setEditingRule(rule);
            setShowForm(true);
          }}
          onDelete={(rule) => {
            setDetailRule(null);
            setDeletingRule(rule);
          }}
          onClose={() => setDetailRule(null)}
        />
      )}

      {showForm && (
        <div className={modalOverlay}>
          <ApprovalRuleForm
            initialRule={editingRule}
            users={options.users}
            customers={options.customers}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingRule(null);
            }}
          />
        </div>
      )}

      {deletingRule && (
        <DeleteApprovalModal
          onConfirm={handleDelete}
          onClose={() => setDeletingRule(null)}
        />
      )}

      {viewingChangelog && (
        <ChangelogModal
          rule={viewingChangelog}
          onClose={() => setViewingChangelog(null)}
        />
      )}
    </div>
  );
}
