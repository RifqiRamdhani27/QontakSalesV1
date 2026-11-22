import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  pageSpinner,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";
import { canEditSettings, useEditing, useSetting } from "@/services/useSetting";


const FORM_SETTINGS_URL = "/purchases/form-settings/";

const PURCHASE_TERM_OPTIONS = [
  { value: "net_15", label: "15 hari" },
  { value: "net_30", label: "30 hari" },
  { value: "net_60", label: "60 hari" },
  { value: "cod", label: "Bayar saat diterima" },
  { value: "custom", label: "Kustom" },
];

const FORM_TOGGLES = [
  ["enable_supplier_in_purchase_request", "Aktifkan pemasok pada permintaan pembelian"],
  ["use_purchase_shipping", "Pengiriman"],
  ["use_purchase_discount", "Diskon"],
  ["use_purchase_discount_per_line", "Diskon per baris"],
  ["use_purchase_deposit", "Uang muka"],
];

function CheckRow({ label, checked, disabled, onChange }) {
  return (
    <label className={`flex select-none items-start gap-2.5 ${disabled ? "" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span>
        <span className="block text-sm text-gray-700">{label}</span>
      </span>
    </label>
  );
}

function EditField({ label, full, children }) {
  return (
    <div className={full ? "col-span-full" : ""}>
      <label className={formLabel}>{label}</label>
      {children}
    </div>
  );
}

export default function PurchasesPage() {
  const { saved, loading, loadError, save } = useSetting(FORM_SETTINGS_URL);
  const form = useEditing(saved, save, "Gagal menyimpan pengaturan pembelian.");

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Pembelian</h2>
      </div>

      {!saved ? (
        loading ? (
          <div className="company-card mb-6 mt-4 flex items-center justify-center rounded-[10px] bg-white p-16">
            <span className={pageSpinner} />
          </div>
        ) : (
          <div className="company-card mb-6 mt-4 rounded-[10px] bg-white p-6 text-sm text-red-600">
            {loadError}
          </div>
        )
      ) : (
        <PurchaseForm saved={saved} form={form} />
      )}
    </div>
  );
}

function PurchaseForm({ saved, form }) {
  const values = form.draft ?? saved;
  const readOnly = !form.editing;

  return (
    <div className="company-card mb-6 mt-4 rounded-[10px] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="m-0 text-[19px] font-bold text-gray-900">Pengaturan Pembelian</h2>
        {!form.editing && canEditSettings("purchases") && (
          <button
            type="button"
            className="group Btn relative !w-[110px] !h-[40px] !text-[14px] overflow-hidden"
            onClick={form.start}
          >
            <span className="transition-opacity duration-100 delay-200 group-hover:delay-0 group-hover:opacity-0">
              Edit
            </span>

            <svg
              className="svg pointer-events-none absolute top-1/2 -translate-y-1/2
               !w-[14px] !m-0 !right-auto !left-[calc(100%-32px)]
               transition-all duration-300 group-hover:delay-75
               group-hover:!left-1/2 group-hover:!-translate-x-1/2"
              viewBox="0 0 512 512"
            >
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
        <EditField label="Termin pembayaran faktur">
          <select
            className={selectBase}
            value={values.preferred_purchase_term}
            disabled={readOnly}
            onChange={(e) => form.setField("preferred_purchase_term", e.target.value)}
          >
            {PURCHASE_TERM_OPTIONS.map((term) => (
              <option key={term.value} value={term.value}>
                {term.label}
              </option>
            ))}
          </select>
        </EditField>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-[18px] gap-y-3.5 max-md:grid-cols-1">
        {FORM_TOGGLES.map(([field, label]) => (
          <CheckRow
            key={field}
            label={label}
            checked={values[field]}
            disabled={readOnly}
            onChange={() => form.toggleField(field)}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-[18px]">
        <EditField label="Pesan pembelian bawaan" full>
          <textarea
            rows="3"
            className={textareaBase}
            placeholder="Pesan yang tampil secara bawaan pada formulir pembelian"
            value={values.default_purchase_order_message}
            disabled={readOnly}
            onChange={(e) => form.setField("default_purchase_order_message", e.target.value)}
          />
        </EditField>
      </div>

      {form.editing && (
        <div className="mt-6 border-t border-gray-200 pt-5">
          {form.error && (
            <p className="m-0 mb-3 whitespace-pre-line text-sm text-red-600">{form.error}</p>
          )}
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              className={btnModalCancel}
              onClick={form.cancel}
              disabled={form.saving}
            >
              Batal
            </button>
            <button
              type="button"
              className={btnModalSubmit}
              onClick={() => form.submit(form.draft)}
              disabled={form.saving}
            >
              {form.saving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}