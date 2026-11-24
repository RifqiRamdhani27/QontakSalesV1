import { useRef, useState } from "react";
import { CaretDown, PencilSimple, Trash, X } from "@phosphor-icons/react";
import Pagination from "@/components/ui/Pagination";
import PopoverSelect from "@/components/ui/PopoverSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import { DropdownPanel } from "@/components/ui/PopoverSelect";
import {
  tableWrapper,
  tableBase,
  th,
  td,
  trHover,
  formLabel,
  btn,
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
  taggingTransactionTypes,
  taggingTypeOptions,
  customTagOptions,
  ruleLabel,
} from "@/data/ruleData";
import { useTaggingRules } from "@/services/useSetting";

const PAGE_SIZE = 5;

const menuItem =
  "flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50";
const menuItemDanger =
  "flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50";

const taggingTypeLabel = (value) =>
  taggingTypeOptions.find((option) => option.value === value)?.label || "-";

function ModalShell({
  title,
  onClose,
  maxWidth = "max-w-[560px]",
  footer,
  children,
}) {
  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} flex ${maxWidth} flex-col`}>
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>{title}</h3>
          <button
            type="button"
            className={modalCloseButton}
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
        <div className={`${modalFooter} shrink-0`}>{footer}</div>
      </div>
    </div>
  );
}

function RadioOption({ name, value, label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-700">
      <input
        type="radio"
        name={name}
        value={value}
        className="h-4 w-4 cursor-pointer accent-brand"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function UserChips({ selected, users, onToggle }) {
  return (
    <MultiSelect
      floating
      selected={selected}
      emptyText="Belum ada pengguna"
      removeLabel="Hapus"
      onToggle={onToggle}
      options={users.map((user) => user.username)}
      placeholder="Pilih pengguna (maks. 250 orang)"
    />
  );
}

function TaggingRuleForm({ initialRule, users, onSubmit, onClose }) {
  const [ruleName, setRuleName] = useState(initialRule?.ruleName || "");
  const [transactionType, setTransactionType] = useState(
    initialRule?.transactionType || "Sales Invoice"
  );
  const [taggingType, setTaggingType] = useState(
    initialRule ? initialRule.taggingType : 1
  );
  const [customTags, setCustomTags] = useState(initialRule?.customTags || []);
  const [transactionMakers, setTransactionMakers] = useState(
    initialRule?.transactionMakers || []
  );

  const toggleCustomTag = (tag) =>
    setCustomTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );

  const toggleMaker = (user) =>
    setTransactionMakers((current) =>
      current.includes(user)
        ? current.filter((item) => item !== user)
        : [...current, user]
    );

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ruleName,
      transactionType,
      taggingType,
      customTags,
      transactionMakers,
    });
  };

  return (
    <form className={`${modalPanel} flex max-w-[560px] flex-col`} onSubmit={submit}>
      <div className={`${modalHeader} shrink-0`}>
        <h3 className={`${modalTitle} font-bold`}>
          {initialRule ? initialRule.ruleName : "Buat aturan"}
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

      <div className="flex-1 overflow-y-auto px-[22px] py-5">
        <div className={formGroup}>
          <label className={formLabel} htmlFor="tagging_rule_name">
            Nama aturan
          </label>
          <input
            id="tagging_rule_name"
            name="ruleName"
            type="text"
            className={inputBase}
            value={ruleName}
            onChange={(event) => setRuleName(event.target.value)}
          />
        </div>

        <div className={formGroup}>
          <span className={formLabel}>Jenis Transaksi</span>
          <PopoverSelect
            floating
            value={transactionType}
            getOptionLabel={ruleLabel}
            emptyText="Tidak ada pilihan"
            placeholder="Pilih opsi"
            groups={[
              {
                label: "",
                options: taggingTransactionTypes,
              },
            ]}
            onSelect={setTransactionType}
          />
        </div>

        <div className={formGroup}>
          <span className={formLabel}>Jenis penanda yang tampil pada transaksi</span>
          <div className="flex flex-col gap-2.5">
            {taggingTypeOptions.map((option) => (
              <RadioOption
                key={option.value}
                name="select_tagging_type"
                value={option.value}
                label={option.label}
                checked={taggingType === option.value}
                onChange={(event) => setTaggingType(Number(event.target.value))}
              />
            ))}
          </div>
          {taggingType === 3 && (
            <div className="mt-3">
              <span className={formLabel}>Penanda khusus</span>
              <MultiSelect
                floating
                selected={customTags}
                emptyText="Belum ada penanda"
                removeLabel="Hapus"
                onToggle={toggleCustomTag}
                options={customTagOptions}
                placeholder="Ketik dan tekan Enter untuk membuat penanda"
              />
            </div>
          )}
        </div>

        <div>
          <span className={formLabel}>Pembuat transaksi</span>
          <UserChips
            selected={transactionMakers}
            users={users}
            onToggle={toggleMaker}
          />
        </div>
      </div>

      <div className={`${modalFooter} shrink-0`}>
        <button type="button" className={btnModalCancel} onClick={onClose}>
          Batal
        </button>
        <button type="submit" className={btnModalSubmit}>
          {initialRule ? "Simpan perubahan" : "Buat aturan"}
        </button>
      </div>
    </form>
  );
}

function DeleteTaggingModal({ ruleName, onConfirm, onClose }) {
  return (
    <ModalShell
      title={ruleName}
      maxWidth="max-w-[420px]"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Batal
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm}>
            Ya, hapus
          </button>
        </>
      }
    >
      <p className="m-0 text-sm leading-relaxed text-slate-500">
        Aturan yang dihapus tidak dapat dipulihkan.
      </p>
    </ModalShell>
  );
}

export default function TaggingRulesPage() {
  const { rules, options, loading, error, create, update, remove } =
    useTaggingRules();
  const [filterType, setFilterType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const actionRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filtered = rules.filter((rule) =>
    filterType ? rule.transactionType === filterType : true
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const handleSubmit = async (values) => {
    try {
      if (editingRule) {
        await update(editingRule.id, values);
        setEditingRule(null);
      } else {
        await create(values);
      }
      setShowForm(false);
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menyimpan aturan penandaan.");
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deletingRule.id);
      setDeletingRule(null);
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menghapus aturan penandaan.");
    }
  };

  const taggingDisplay = (rule) => {
    if (rule.taggingType === 3) {
      return rule.customTags.length > 0
        ? rule.customTags.join(", ")
        : "Kustom";
    }
    return taggingTypeLabel(rule.taggingType);
  };

  return (
    <div lang="id" className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="m-0 text-[28px] font-bold text-gray-900">Aturan penandaan</h2>
          <p className="m-0 mt-1.5 text-sm text-slate-500">
            Atur penanda yang tampil otomatis pada transaksi Anda.
          </p>
        </div>
        <button
          type="button"
          className={btnModalSubmit}
          onClick={() => {
            setEditingRule(null);
            setShowForm(true);
          }}
        >
          Buat aturan penandaan baru
        </button>
      </div>

      {(error || loading) && (
        <p className="m-0 mb-4 text-sm text-slate-500">
          {loading ? "Memuat aturan penandaan..." : error}
        </p>
      )}

      <div className="company-card mb-6 mt-4 rounded-[10px] bg-white p-6">
        <div className="flex items-center justify-end gap-3">
          <div className="w-[240px] max-md:w-full">
            <PopoverSelect
              floating
              value={filterType}
              getOptionLabel={ruleLabel}
              emptyText="Tidak ada pilihan"
              placeholder="Semua jenis transaksi"
              includeAll
              groups={[
                {
                  label: "",
                  options: taggingTransactionTypes,
                },
              ]}
              onSelect={(value) => {
                setFilterType(
                  value === "All transaction types" ? "" : value
                );
                setCurrentPage(1);
              }}
              closeAfterSelect={false}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="m-0 text-[15px] font-bold text-gray-900">
              Belum ada aturan penandaan
            </p>
            <p className="m-0 text-sm text-slate-500">
              Aturan penandaan akan tampil di sini.
            </p>
          </div>
        ) : (
          <div className={`${tableWrapper} mt-5`}>
            <table className={tableBase}>
              <thead>
                <tr>
                  <th className={th}>Nama aturan</th>
                  <th className={th}>Jenis transaksi</th>
                  <th className={th}>Jenis penanda</th>
                  <th className={`${th} text-right`}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((rule) => (
                  <tr key={rule.id} className={trHover}>
                    <td className={`${td} font-semibold text-gray-900`}>
                      {rule.ruleName}
                    </td>
                    <td className={td}>{ruleLabel(rule.transactionType)}</td>
                    <td className={td}>{taggingDisplay(rule)}</td>
                    <td className={`${td} text-right`}>
                      <div className="relative inline-block">
                        <button
                          type="button"
                          className={`${btn} inline-flex items-center gap-1`}
                          onClick={(event) => {
                            actionRef.current = event.currentTarget;
                            setOpenActionId(
                              openActionId === rule.id ? null : rule.id
                            );
                          }}
                        >
                          Tindakan <CaretDown size={12} />
                        </button>
                        {openActionId === rule.id && (
                          <DropdownPanel
                            rect={actionRef.current?.getBoundingClientRect()}
                            triggerRef={actionRef}
                            onClose={() => setOpenActionId(null)}
                            variant="settings"
                            width={176}
                            align="right"
                            className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                          >
                            <button
                              type="button"
                              className={menuItem}
                              onClick={() => {
                                setOpenActionId(null);
                                setEditingRule(rule);
                                setShowForm(true);
                              }}
                            >
                              <PencilSimple size={14} /> Ubah aturan
                            </button>
                            <button
                              type="button"
                              className={menuItemDanger}
                              onClick={() => {
                                setOpenActionId(null);
                                setDeletingRule(rule);
                              }}
                            >
                              <Trash size={14} /> Hapus aturan
                            </button>
                          </DropdownPanel>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5">
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
      </div>

      {showForm && (
        <div className={modalOverlay}>
          <TaggingRuleForm
            initialRule={editingRule}
            users={options.users}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingRule(null);
            }}
          />
        </div>
      )}

      {deletingRule && (
        <DeleteTaggingModal
          ruleName={deletingRule.ruleName}
          onConfirm={handleDelete}
          onClose={() => setDeletingRule(null)}
        />
      )}
    </div>
  );
}