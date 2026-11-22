import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CaretDown, Trash, Info, Envelope, FilePdf, WhatsappLogo } from "@phosphor-icons/react";
import {
  selectBase,
  inputBase,
  formLabel,
  textareaBase,
  btnModalCancel,
  btnModalSubmit,
  pageSpinner,
} from "@/components/ui/styles";

import { PdfPaper } from "@/components/pdf/PdfPapers";
import api from "@/services/settingsApi";
import { canAccessSettingsTemplate } from "@/services/settingsAccess";
import { DropdownPanel, useDropdown } from "@/components/ui/PopoverSelect";
import {
  canEditTemplates,
  templateErrorMessage,
  useTemplateSetting,
} from "@/services/useSetting";

const TabEmail = ["Sales Invoice", "Sales Quote", "Sales Order", "Purchase Order"];
const TabPDF = ["General Setting", "Customize PDF"];
const TabWA = ["Sales Template Message", "Order Template Message"];

const templateLabels = {
  "Sales Invoice": "Faktur Penjualan",
  "Sales Quote": "Penawaran Penjualan",
  "Sales Order": "Pesanan Penjualan",
  "Purchase Order": "Pesanan Pembelian",
  "Purchase Invoice": "Faktur Pembelian",
  "Sales Return": "Retur Penjualan",
  "Receive Payment": "Penerimaan Pembayaran",
  "Sales Order Payment": "Pembayaran Pesanan Penjualan",
  "Purchase Return": "Retur Pembelian",
  "Payment": "Pembayaran",
  "General Setting": "Pengaturan Umum",
  "Customize PDF": "Sesuaikan PDF",
  "Sales Template Message": "Templat Pesan Penjualan",
  "Order Template Message": "Templat Pesan Pemesanan",
  "Header": "Kepala Dokumen",
  "Content": "Isi Dokumen",
  "Left": "Kiri",
  "Center": "Tengah",
  "Right": "Kanan",
  "Large": "Besar",
  "Medium": "Sedang",
  "Small": "Kecil",
  "Balance due": "Sisa tagihan",
  "[User Name]": "Nama pengguna",
  "[Company Name]": "Nama perusahaan",
  "Custom (Type Manually)": "Kustom (Ketik Manual)",
  "28 Aug 2023": "28 Agu 2023",
  "28 August 2023": "28 Agustus 2023"
};

function templateLabel(value) {
  return Object.hasOwn(templateLabels, value) ? templateLabels[value] : value.replace(/^Template (?=\d+$)/, "Templat ");
}

const linkButton =
  "border-0 bg-transparent p-0 text-[13px] font-semibold text-brand enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed disabled:opacity-50";


/* ---------- Shared building blocks ---------- */

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      className="group Btn relative !w-[100px] !h-[40px] !text-[12px] overflow-hidden"
      onClick={onClick}
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
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <h2 className="m-0 text-[19px] font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="m-0 mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

function SubHeading({ title, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="m-0 text-[15px] font-bold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

function EditField({ label, children }) {
  return (
    <div>
      <label className={formLabel}>{label}</label>
      {children}
    </div>
  );
}

function CheckRow({ label, description, checked, disabled, onChange }) {
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
        {description && (
          <span className="mt-0.5 block text-[13px] text-slate-500">{description}</span>
        )}
      </span>
    </label>
  );
}

function LabelCheckRow({ label, checked, disabled, editing, value, maxLength = 30, onToggle, onValue }) {
  return (
    <div className="flex items-center gap-3">
      <CheckRow label={label} checked={checked} disabled={disabled} onChange={onToggle} />
      {editing && (
        <div className="w-[220px]">
          <input
            type="text"
            className={inputBase}
            placeholder={label}
            maxLength={maxLength}
            value={value}
            onChange={(event) => onValue(event.target.value)}
          />
        </div>
      )}
    </div>
  );
}

function RadioOption({ name, label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700">
      <input
        type="radio"
        name={name}
        className="h-4 w-4 cursor-pointer accent-brand"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="relative h-[22px] w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[18px]"></span>
    </label>
  );
}

function ToggleRow({ label, info, checked, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3.5">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <span className="flex items-center gap-2">
        <ToggleSwitch checked={checked} onChange={onChange} />
        {info && <Info size={16} className="text-slate-400" />}
      </span>
    </div>
  );
}

function InlineEditActions({ editing, onStart, onCancel, onSave }) {
  if (!editing) return <EditButton onClick={onStart} />;
  return (
    <span className="flex gap-2">
      <button type="button" className={btnModalCancel} onClick={onCancel}>
        Batal
      </button>
      <button type="button" className={btnModalSubmit} onClick={onSave}>
        Simpan
      </button>
    </span>
  );
}

function SavedNote({ saved }) {
  if (!saved) return null;
  return <p className="m-0 text-[13px] font-semibold text-green-600">Templat tersimpan.</p>;
}

function TemplateLoading() {
  return (
    <div className="flex items-center justify-center p-16">
      <span className={pageSpinner} />
    </div>
  );
}

function TemplateError({ error }) {
  if (!error) return null;
  return (
    <p className="m-0 whitespace-pre-line text-[13px] font-semibold text-red-600" role="alert">
      {error}
    </p>
  );
}

function TemplateActions({ error, saved, children }) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
      <TemplateError error={error} />
      <SavedNote saved={saved} />
      {children}
    </div>
  );
}


/* ---------- Tab navigation ---------- */
function TabSelectField({ icon: Icon, label, children }) {
  return (
    <div className="w-[220px] max-md:w-full">
      <div className="mb-[7px] flex items-center gap-2 text-slate-600">
        <Icon size={16} className="shrink-0" />
        <label className={`${formLabel} m-0 leading-none`}>{label}</label>
      </div>
      {children}
    </div>
  );
}

function TabNav({
  tab,
  setTab,
  emailTemplate,
  setEmailTemplate,
  pdfTemplate,
  setPdfTemplate,
  whatsappTemplate,
  setWhatsappTemplate,
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <TabSelectField icon={Envelope} label="Templat Email">
        <select
          className={selectBase}
          value={tab === "email" ? emailTemplate : ""}
          disabled={!TabEmail.some((item) => canAccessSettingsTemplate(emailTemplates[item].key))}
          onChange={(event) => {
            setEmailTemplate(event.target.value);
            setTab("email");
          }}
        >
          <option value="" disabled>
            Pilih templat
          </option>
          {TabEmail.filter((item) => canAccessSettingsTemplate(emailTemplates[item].key)).map((item) => (
            <option key={item} value={item}>
              {templateLabel(item)}
            </option>
          ))}
        </select>
      </TabSelectField>

      <TabSelectField icon={FilePdf} label="Templat PDF">
        <select
          className={selectBase}
          value={tab === "pdf" ? pdfTemplate : ""}
          disabled={!canAccessSettingsTemplate("pdf_general")}
          onChange={(event) => {
            setPdfTemplate(event.target.value);
            setTab("pdf");
          }}
        >
          <option value="" disabled>
            Pilih templat
          </option>
          {TabPDF.filter(() => canAccessSettingsTemplate("pdf_general")).map((item) => (
            <option key={item} value={item}>
              {templateLabel(item)}
            </option>
          ))}
        </select>
      </TabSelectField>

      <TabSelectField icon={WhatsappLogo} label="Templat WhatsApp">
        <select
          className={selectBase}
          value={tab === "whatsapp" ? whatsappTemplate : ""}
          disabled={!TabWA.some((item) => canAccessSettingsTemplate(whatsappTemplates[item].key))}
          onChange={(event) => {
            setWhatsappTemplate(event.target.value);
            setTab("whatsapp");
          }}
        >
          <option value="" disabled>
            Pilih templat
          </option>
          {TabWA.filter((item) => canAccessSettingsTemplate(whatsappTemplates[item].key)).map((item) => (
            <option key={item} value={item}>
              {templateLabel(item)}
            </option>
          ))}
        </select>
      </TabSelectField>
    </div>
  );
}


/* ---------- Email ---------- */

const emailTemplates = {
  "Sales Invoice": {
    key: "email_sales_invoice",
    defaults: {
      subject: "Faktur Penjualan #[NomorTransaksi]",
      message:
        "Yth. [NamaCustomer],\nTerima kasih atas bisnis Anda.\n\nBerikut adalah Faktur #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaCustomer] [PerusahaanCustomer] [NomorTransaksi] [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan] [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
  "Sales Quote": {
    key: "email_sales_quote",
    defaults: {
      subject: "Penawaran Penjualan #[NomorTransaksi]",
      message:
        "Yth. [NamaCustomer],\nTerima kasih atas permintaan penawaran Anda.\n\nBerikut adalah penawaran #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaCustomer] [PerusahaanCustomer] [NomorTransaksi] [TanggalTransaksi] [TanggalExpiry] [NamaPerusahaan] [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
  "Sales Order": {
    key: "email_sales_order",
    defaults: {
      subject: "Pemesanan Penjualan #[NomorTransaksi]",
      message:
        "Yth. [NamaCustomer],\nTerima kasih atas bisnis Anda.\n\nBerikut adalah Pemesanan Penjualan #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaCustomer] [PerusahaanCustomer] [NomorTransaksi] [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan] [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
  "Purchase Order": {
    key: "email_purchase_order",
    defaults: {
      subject: "Pemesanan Pembelian #[NomorTransaksi]",
      message:
        "Yth. [NamaVendor],\nBerikut adalah Pemesanan Pembelian #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaVendor] [PerusahaanVendor] [NomorTransaksi] [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan] [EmailPerusahaan] [AlamatPengirimianPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
};

function EmailTemplateForm({ name }) {
  const template = emailTemplates[name];
  const {
    values,
    setField,
    loading,
    saving,
    saved,
    error,
    save,
    reset,
    isDirty,
  } = useTemplateSetting(template.key, template.defaults);
  const canEdit = canEditTemplates(template.key);

  if (loading) return <TemplateLoading />;

  return (
    <div>
      <SectionTitle
        title={`Templat Email ${templateLabel(name)}`}
        subtitle="Atur subjek dan isi pesan email yang dikirim untuk dokumen ini."
      />

      <div className="mt-5 flex flex-col gap-[18px]">
        <EditField label="Subjek">
          <input
            type="text"
            className={inputBase}
            value={values.subject}
            onChange={(event) => setField("subject", event.target.value)}
          />
        </EditField>

        <EditField label="Pesan">
          <textarea
            rows="10"
            className={textareaBase}
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
          />
        </EditField>

        <EditField label="Variabel">
          <p className="m-0 break-words text-[13px] leading-relaxed text-slate-500">
            {template.variables}
          </p>
        </EditField>
      </div>

      <TemplateActions error={error} saved={saved}>
        <button className={btnModalCancel} disabled={!isDirty} onClick={reset}>
          Atur Ulang
        </button>
        <button className={btnModalSubmit} disabled={saving || !canEdit} onClick={() => save()}>
          {saving ? "Menyimpan..." : "Perbarui Templat"}
        </button>
      </TemplateActions>
    </div>
  );
}


/* ---------- PDF: general settings ---------- */

function SignatureForSelect({ selected, setSelected, setSaved }) {
  const dropdown = useDropdown();
  const [search, setSearch] = useState("");
  const options = [
    "Sales Invoice",
    "Sales Order",
    "Sales Quote",
    "Sales Return",
    "Receive Payment",
    "Sales Order Payment",
    "Purchase Invoice",
    "Purchase Order",
    "Purchase Return",
    "Payment",
  ];
  const visible = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()) ||
    templateLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        ref={dropdown.triggerRef}
        className="flex min-h-[42px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2 py-1.5"
        onClick={dropdown.toggle}
        role="button"
        tabIndex={0}
        aria-expanded={dropdown.isOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            dropdown.toggle();
          }
        }}
      >
        {selected.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[13px] font-semibold text-brand"
          >
            {templateLabel(item)}
            <span
              className="cursor-pointer font-bold text-blue-400"
              onClick={(event) => {
                event.stopPropagation();
                setSelected(selected.filter((value) => value !== item));
                setSaved(false);
              }}
            >
              ×
            </span>
          </span>
        ))}
        {selected.length === 0 && (
          <span className="px-1 text-sm text-slate-400">Pilih dokumen</span>
        )}
        <CaretDown size={16} className="ml-auto text-slate-400" />
      </div>

      {dropdown.isOpen && (
        <DropdownPanel
          rect={dropdown.rect}
          triggerRef={dropdown.triggerRef}
          onClose={dropdown.close}
          variant="settings"
          className="rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <input
            type="text"
            className="m-2 w-[calc(100%-16px)] rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-brand"
            placeholder="Cari"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between border-y border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-600"
            onClick={() => {
              setSelected(selected.length === options.length ? [] : options);
              setSaved(false);
            }}
          >
            Semua
            {selected.length === options.length && <span className="text-brand">✓</span>}
          </button>
          <div className="max-h-[220px] overflow-y-auto">
            {visible.map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  if (selected.includes(item)) {
                    setSelected(selected.filter((value) => value !== item));
                  } else {
                    setSelected([...selected, item]);
                  }
                  setSaved(false);
                }}
              >
                {templateLabel(item)}
                {selected.includes(item) && <span className="text-brand">✓</span>}
              </button>
            ))}
            {visible.length === 0 && (
              <p className="px-3 py-2 text-sm text-slate-400">Tidak ada hasil yang cocok</p>
            )}
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

const MAX_SIGNATURE_SIZE = 2 * 1024 * 1024;

const generalDefaults = {
  use_footer: true,
  use_signature: false,
  use_draft_watermark: false,
  use_qr_code: false,
  signature_types: [],
  signature_rows: [
    { option: "", text: "" },
    { option: "", text: "" },
    { option: "", text: "" },
  ],
};

function pdfGeneralFromApi(data) {
  const values = { ...generalDefaults, ...(data || {}) };
  return {
    useFooter: Boolean(values.use_footer),
    useSignature: Boolean(values.use_signature),
    useDraftWatermark: Boolean(values.use_draft_watermark),
    useQrCode: Boolean(values.use_qr_code),
    signatureTypes: values.signature_types || [],
    signatureRows: values.signature_rows || [],
    signatureImageUrl: values.signature_image_url || "",
  };
}

function GeneralSetting() {
  const { values, setField, loading, saving, saved, setSaved, error, save } =
    useTemplateSetting("pdf_general", generalDefaults);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [removeSignature, setRemoveSignature] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileError, setFileError] = useState("");
  const [identity, setIdentity] = useState({ userName: "", companyName: "" });
  const objectUrlRef = useRef(null);
  const canEdit = canEditTemplates("pdf_general");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/auth/profile/").catch(() => null),
      api.get("/company/").catch(() => null),
    ]).then(([profileResponse, companyResponse]) => {
      if (cancelled) return;
      const profile = profileResponse?.data;
      setIdentity({
        userName: profile
          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
            profile.username
          : "",
        companyName: companyResponse?.data?.name || "",
      });
    });
    return () => {
      cancelled = true;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const clearObjectUrl = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  const imageUrl = removeSignature
    ? ""
    : signaturePreview || values.signature_image_url || "";

  const signatureRows = values.signature_rows;

  const updateRow = (index, patch) => {
    setField(
      "signature_rows",
      signatureRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row
      )
    );
  };

  const resolveRow = (row) => {
    if (row.option === "[User Name]") return identity.userName;
    if (row.option === "[Company Name]") return identity.companyName;
    return row.text;
  };

  const onSignaturePick = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("File yang dipilih harus berupa gambar.");
      return;
    }
    if (file.size > MAX_SIGNATURE_SIZE) {
      setFileError("Ukuran gambar maksimal 2 MB.");
      return;
    }
    clearObjectUrl();
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setSignatureFile(file);
    setSignaturePreview(url);
    setRemoveSignature(false);
    setFileError("");
    setSaved(false);
  };

  const clearSignature = () => {
    clearObjectUrl();
    setSignatureFile(null);
    setSignaturePreview(null);
    setRemoveSignature(true);
    setFileError("");
    setField("signature_types", []);
    setField(
      "signature_rows",
      generalDefaults.signature_rows.map((row) => ({ ...row }))
    );
  };

  const handleSave = async () => {
    const result = await save({
      signature_image: signatureFile,
      remove_signature_image: removeSignature && !signatureFile,
    });
    if (!result) return;
    clearObjectUrl();
    setSignatureFile(null);
    setSignaturePreview(null);
    setRemoveSignature(false);
  };

  if (loading) return <TemplateLoading />;

  return (
    <div>
      <SectionTitle
        title="Pengaturan PDF"
        subtitle="Atur elemen umum yang tampil pada semua dokumen PDF."
      />

      <div className="mt-2">
        <ToggleRow
          label="Gunakan Kaki Halaman"
          info
          checked={values.use_footer}
          onChange={() => setField("use_footer", !values.use_footer)}
        />
        <ToggleRow
          label="Gunakan Tanda Tangan"
          checked={values.use_signature}
          onChange={() => setField("use_signature", !values.use_signature)}
        />
        <ToggleRow
          label="Gunakan Tanda Air Draf"
          info
          checked={values.use_draft_watermark}
          onChange={() => setField("use_draft_watermark", !values.use_draft_watermark)}
        />
        <ToggleRow
          label="Gunakan Kode QR Mekaripay"
          info
          checked={values.use_qr_code}
          onChange={() => setField("use_qr_code", !values.use_qr_code)}
        />
      </div>

      {values.use_signature && (
        <div className="mt-5">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[13px] font-semibold text-red-600 hover:underline"
              onClick={clearSignature}
            >
              <Trash size={15} />
              Hapus
            </button>
          </div>

          <div className="mt-3">
            <EditField label="Gunakan tanda tangan ini untuk">
              <SignatureForSelect
                selected={values.signature_types}
                setSelected={(next) => setField("signature_types", next)}
                setSaved={setSaved}
              />
            </EditField>
          </div>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-6">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Tanda tangan"
                  className="mb-2 h-16 w-16 object-contain"
                />
              )}
              <label className="cursor-pointer text-sm font-semibold text-brand hover:underline">
                Pilih Berkas
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={onSignaturePick}
                />
              </label>
              {signatureFile && (
                <span className="mt-1 text-[13px] text-slate-600">{signatureFile.name}</span>
              )}
              {fileError && (
                <span className="mt-1 text-[13px] text-red-600">{fileError}</span>
              )}
              <p className="m-0 mt-2 text-[13px] text-slate-500">
                ukuran yang disarankan:
                <br />
                100x100 (px)
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              {signatureRows.map((row, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-[190px] shrink-0">
                    <select
                      className={selectBase}
                      value={row.option}
                      onChange={(event) => updateRow(index, { option: event.target.value })}
                    >
                      <option value="">Kustom (Ketik Manual)</option>
                      <option value="[User Name]">Nama pengguna</option>
                      <option value="[Company Name]">Nama perusahaan</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className={inputBase}
                      value={row.option === "" ? row.text : resolveRow(row)}
                      disabled={row.option !== ""}
                      onChange={(event) => updateRow(index, { text: event.target.value })}
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className={linkButton}
                  onClick={() =>
                    setField("signature_rows", [...signatureRows, { option: "", text: "" }])
                  }
                >
                  + Tambah tanda tangan lain
                </button>
                <button
                  type="button"
                  className={linkButton}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  Pratinjau
                </button>
              </div>

              {showPreview && (
                <div className="self-end rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Tanda tangan"
                      className="mb-2 h-[100px] w-[100px] object-contain"
                    />
                  ) : (
                    <div className="mb-10" />
                  )}
                  <div className="mb-2 w-52 border-b border-slate-400" />
                  {signatureRows
                    .map(resolveRow)
                    .filter(Boolean)
                    .map((line, index) => (
                      <p
                        key={index}
                        className={index === 0 ? "m-0 font-semibold text-slate-900" : "m-0"}
                      >
                        {line}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <hr className="mt-5 border-slate-200" />
      <p className="m-0 mt-4 text-[13px] text-slate-500">
        Catatan: Kami tidak menjamin bahwa tanda tangan digital yang dicetak melalui fitur ini telah memenuhi peraturan perundang-undangan atau tersertifikasi secara hukum. Untuk informasi lebih lanjut, kunjungi{" "}
        <span className="cursor-pointer text-brand hover:underline">di sini</span>.
      </p>

      <TemplateActions error={error} saved={saved}>
        <button className={btnModalSubmit} disabled={saving || !canEdit} onClick={handleSave}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </TemplateActions>
    </div>
  );
}


/* ---------- PDF: customize ---------- */

const PdfDateFormats = [
  "28-08-2023",
  "28 Aug 2023",
  "28 August 2023",
  "08/28/2023",
  "08-28-2023",
];

const LOGO_POSITIONS = [
  ["Left", "Kiri"],
  ["Center", "Tengah"],
  ["Right", "Kanan"],
];

// [label, showField, labelField?, maxLength?]
const COMPANY_ROWS = [
  ["Nama Perusahaan", "showCompanyName"],
  ["Alamat", "showCompanyAddress"],
  ["Email", "showCompanyEmail", "labelCompanyEmail"],
  ["Telepon", "showCompanyPhone", "labelCompanyPhone"],
  ["Situs Web", "showCompanyWeb"],
  ["Faks", "showCompanyFax"],
  ["NPWP", "showCompanyTax"],
];

const RECIPIENT_ROWS = [
  ["Nama", "showRecipientName", "labelRecipientName"],
  ["Nama Perusahaan", "showRecipientCompany", "labelRecipientCompany"],
  ["Nama Lengkap", "showRecipientFullName", "labelRecipientFullName"],
  ["Alamat", "showRecipientAddress", "labelRecipientAddress"],
  ["Telepon", "showRecipientTelephone", "labelRecipientTelephone"],
  ["Email", "showRecipientEmail", "labelRecipientEmail"],
];

const TRANSACTION_ROWS = [
  ["Referensi pelanggan", "showCustomerRef", "labelCustomerRef", 30],
  ["DPP Nilai Lain", "showOtherDpp"],
  ["Penanda", "showTags"],
  ["Gudang", "showWarehouse"],
];

const TABLE_ROWS = [
  ["Kode Produk", "showTableProduct"],
  ["Deskripsi", "showTableDescription"],
  ["Jumlah dan satuan", "showTableQty", "labelTableQty", 20],
  ["Harga per satuan", "showTablePrice", "labelTablePrice", 20],
  ["Diskon", "showTableDiscount", "labelTableDiscount", 20],
  ["Pajak", "showTableTax", "labelTableTax", 20],
];

const MESSAGE_ROWS = [
  ["Pesan", "showMessage"],
  ["Memo", "showMemo"],
];

function defaultPdfHeader() {
  return {
    showLogo: true,
    logoPosition: "Left",
    titleId: "",
    titleEn: "",
    applyForBoth: false,
    showCompanyName: true,
    showCompanyAddress: true,
    showCompanyEmail: true,
    labelCompanyEmail: "",
    showCompanyPhone: true,
    labelCompanyPhone: "",
    showCompanyWeb: true,
    showCompanyFax: true,
    showCompanyTax: true,
    showRecipientName: true,
    labelRecipientName: "",
    showRecipientCompany: true,
    labelRecipientCompany: "",
    showRecipientFullName: true,
    labelRecipientFullName: "",
    showRecipientAddress: true,
    labelRecipientAddress: "",
    showRecipientTelephone: true,
    labelRecipientTelephone: "",
    showRecipientEmail: true,
    labelRecipientEmail: "",
    showCustomFields: false,
    contentSize: "Large",
  };
}

function defaultPdfContent() {
  return {
    dateFormat: "28-08-2023",
    showCustomerRef: true,
    labelCustomerRef: "",
    showOtherDpp: false,
    showTags: true,
    showWarehouse: true,
    showTableProduct: true,
    showTableDescription: true,
    showTableQty: true,
    labelTableQty: "",
    showTablePrice: true,
    labelTablePrice: "",
    showTableDiscount: true,
    labelTableDiscount: "",
    showTableTax: true,
    labelTableTax: "",
    showMessage: true,
    showMemo: false,
    showPaymentInfo: true,
    showAmountInWords: true,
    amountNominal: "Total",
    showSignature: true,
    showFooter: true,
    showFootnote: true,
    footnoteText: "",
  };
}

function defaultPdfSettings() {
  return {
    "Sales Invoice": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
    "Sales Order": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
    "Purchase Invoice": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
  };
}

const signerRoleLabels = {
  MANAGER: "Manajer Penjualan",
  AGENT: "Agen Penjualan",
};

function pdfCompanyFromApi(data) {
  const cityLine = [data.city, data.province, data.postal_code]
    .filter(Boolean)
    .join(", ");
  return {
    name: data.name || "",
    address: [data.address, cityLine].filter(Boolean).join(", "),
    phone: data.phone || "",
    email: data.company_email || data.email || "",
    website: data.website || "",
    fax: data.fax || "",
    tax: data.tin || "",
    logoUrl: data.logo_url || "",
    showLogoInReport: Boolean(data.show_logo_in_report),
    bankName: data.bank_name || "",
    bankSwift: data.swift_code || "",
    bankBranch: data.branch_office || data.branch_address || "",
    bankAccountNumber: data.account_number || "",
    bankAccountName: data.account_holder || data.name || "",
  };
}

const pdfDocumentKeys = {
  "Sales Invoice": "pdf_sales_invoice",
  "Sales Order": "pdf_sales_order",
  "Purchase Invoice": "pdf_purchase_invoice",
};

function pdfSettingsFromApi(stored, showLogoInReport) {
  return Object.fromEntries(
    Object.entries(pdfDocumentKeys).map(([documentType, key]) => {
      const record = stored[key];
      const header = { ...defaultPdfHeader(), ...(record?.header || {}) };
      const content = { ...defaultPdfContent(), ...(record?.content || {}) };
      if (!record?.header && !showLogoInReport) header.showLogo = false;
      return [documentType, { header, content }];
    })
  );
}

function pdfTemplateOptions(documentType) {
  return documentType === "Sales Invoice"
    ? ["Template 1", "Template 6", "Template 7", "Template 10", "Template 12"]
    : ["Template 1", "Template 6", "Template 7", "Template 10"];
}

function validPdfTemplate(documentType, template) {
  const options = pdfTemplateOptions(documentType);
  return options.includes(template) ? template : "Template 1";
}

function DocumentTypeSelect({ value, onChange }) {
  return (
    <select className={selectBase} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="" disabled>
        Pilih dokumen
      </option>
      <optgroup label="PENJUALAN">
        <option value="Sales Invoice">Faktur Penjualan</option>
        <option value="Sales Order">Pesanan Penjualan</option>
      </optgroup>
      <optgroup label="PEMBELIAN">
        <option value="Purchase Invoice">Faktur Pembelian</option>
      </optgroup>
    </select>
  );
}

function CustomizePdf() {
  const [documentType, setDocumentType] = useState("");
  const [contentTab, setContentTab] = useState("Header");
  const [previewTemplate, setPreviewTemplate] = useState("Template 1");
  const [draft, setDraft] = useState(defaultPdfSettings);
  const [savedSettings, setSavedSettings] = useState(defaultPdfSettings);
  const [editingCompanyInfo, setEditingCompanyInfo] = useState(false);
  const [companyInfoSnapshot, setCompanyInfoSnapshot] = useState(null);
  const [editingTransactionInfo, setEditingTransactionInfo] = useState(false);
  const [transactionInfoSnapshot, setTransactionInfoSnapshot] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [general, setGeneral] = useState(null);
  const canEdit = canEditTemplates("pdf_customize");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/company/"),
      api.get("/auth/profile/").catch(() => null),
      api.get("/template-settings/").catch(() => null),
    ])
      .then(([companyResponse, profileResponse, settingsResponse]) => {
        if (cancelled) return;
        const profile = profileResponse?.data;
        const stored = settingsResponse?.data || {};
        const companyInfo = pdfCompanyFromApi(companyResponse.data);
        const signerName = profile
          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
            profile.username
          : "";
        const initial = pdfSettingsFromApi(stored, companyInfo.showLogoInReport);
        const uiState = stored.pdf_customize || {};
        const initialDocumentType =
          uiState.document_type && pdfDocumentKeys[uiState.document_type]
            ? uiState.document_type
            : "";
        setCompany({
          ...companyInfo,
          signerName,
          signerRole: signerRoleLabels[profile?.role] || "",
        });
        setGeneral(pdfGeneralFromApi(stored.pdf_general));
        setDraft(initial);
        setSavedSettings(initial);
        setDocumentType(initialDocumentType);
        setPreviewTemplate(validPdfTemplate(initialDocumentType, uiState.template));
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(templateErrorMessage(requestError, "Gagal memuat templat PDF."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSaved(false);
    setError("");
  }, [documentType]);

  const draftHeader =
    documentType === "" ? defaultPdfHeader() : draft[documentType].header;
  const draftContent =
    documentType === "" ? defaultPdfContent() : draft[documentType].content;
  const isDirty =
    documentType !== "" &&
    JSON.stringify(draft[documentType]) !==
      JSON.stringify(savedSettings[documentType]);

  const templateOptions = pdfTemplateOptions(documentType);

  function persistPdfUiState(nextDocumentType, nextTemplate) {
    api
      .put("/template-settings/pdf_customize/", {
        document_type: nextDocumentType,
        template: nextTemplate,
      })
      .catch(() => {});
  }

  function handleDocumentTypeChange(nextDocumentType) {
    setDocumentType(nextDocumentType);
    setContentTab("Header");
    setEditingCompanyInfo(false);
    setEditingTransactionInfo(false);
    setPreviewTemplate("Template 1");
    persistPdfUiState(nextDocumentType, "Template 1");
  }

  function updateHeader(field, value) {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        header: { ...current[documentType].header, [field]: value },
      },
    }));
    setSaved(false);
  }

  function updateContent(field, value) {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        content: { ...current[documentType].content, [field]: value },
      },
    }));
    setSaved(false);
  }

  function startEditCompanyInfo() {
    setCompanyInfoSnapshot(JSON.stringify(draftHeader));
    setEditingCompanyInfo(true);
  }

  function cancelEditCompanyInfo() {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        header: JSON.parse(companyInfoSnapshot),
      },
    }));
    setEditingCompanyInfo(false);
  }

  function saveEditCompanyInfo() {
    setEditingCompanyInfo(false);
  }

  function startEditTransactionInfo() {
    setTransactionInfoSnapshot(JSON.stringify(draftContent));
    setEditingTransactionInfo(true);
  }

  function cancelEditTransactionInfo() {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        content: JSON.parse(transactionInfoSnapshot),
      },
    }));
    setEditingTransactionInfo(false);
  }

  function saveEditTransactionInfo() {
    setEditingTransactionInfo(false);
  }

  function resetDraft() {
    setDraft((current) => ({
      ...current,
      [documentType]: savedSettings[documentType],
    }));
    setSaved(false);
    setError("");
  }

  async function saveDraft() {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await api.put(
        `/template-settings/${pdfDocumentKeys[documentType]}/`,
        draft[documentType]
      );
      setSavedSettings((current) => ({
        ...current,
        [documentType]: draft[documentType],
      }));
      setSaved(true);
    } catch (requestError) {
      setError(templateErrorMessage(requestError, "Gagal menyimpan templat PDF."));
    } finally {
      setSaving(false);
    }
  }

  const renderHeaderRows = (rows) =>
    rows.map(([label, field, labelField]) => (
      <LabelCheckRow
        key={field}
        label={label}
        checked={draftHeader[field]}
        disabled={editingCompanyInfo}
        editing={editingCompanyInfo && Boolean(labelField)}
        value={labelField ? draftHeader[labelField] : ""}
        onToggle={() => updateHeader(field, !draftHeader[field])}
        onValue={(value) => updateHeader(labelField, value)}
      />
    ));

  const renderContentRows = (rows) =>
    rows.map(([label, field, labelField, maxLength]) => (
      <LabelCheckRow
        key={field}
        label={label}
        checked={draftContent[field]}
        disabled={editingTransactionInfo}
        editing={editingTransactionInfo && Boolean(labelField)}
        value={labelField ? draftContent[labelField] : ""}
        maxLength={maxLength}
        onToggle={() => updateContent(field, !draftContent[field])}
        onValue={(value) => updateContent(labelField, value)}
      />
    ));

  const contentCheck = (label, field, description) => (
    <CheckRow
      label={label}
      description={description}
      checked={draftContent[field]}
      onChange={() => updateContent(field, !draftContent[field])}
    />
  );

  if (loading) return <TemplateLoading />;

  const documentTypeField = (
    <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
      <EditField label="Jenis dokumen">
        <DocumentTypeSelect value={documentType} onChange={handleDocumentTypeChange} />
      </EditField>
    </div>
  );

  if (documentType === "") {
    return (
      <div>
        <SectionTitle
          title="Sesuaikan PDF"
          subtitle="Sesuaikan kepala dan isi dokumen PDF, lalu lihat pratinjaunya."
        />
        {documentTypeField}
        <div className="mt-5 flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-slate-300">
          <p className="m-0 text-sm text-slate-500">
            Templat PDF akan tampil di sini. Pilih jenis dokumen untuk mengatur templat PDF.
          </p>
        </div>
      </div>
    );
  }

  const tabClass = (active) =>
    active
      ? "flex-1 cursor-pointer rounded-md border-0 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm"
      : "flex-1 cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-sm font-semibold text-slate-500 hover:text-black";

  return (
    <div>
      <SectionTitle
        title="Sesuaikan PDF"
        subtitle="Sesuaikan kepala dan isi dokumen PDF, lalu lihat pratinjaunya."
      />
      {documentTypeField}

      <div className="mt-5 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              className={tabClass(contentTab === "Header")}
              onClick={() => setContentTab("Header")}
            >
              Kepala Dokumen
            </button>
            <button
              type="button"
              className={tabClass(contentTab === "Content")}
              onClick={() => setContentTab("Content")}
            >
              Isi Dokumen
            </button>
          </div>

          {contentTab === "Header" && (
            <div className="mt-5 flex flex-col gap-4">
              <ToggleRow
                label="Tampilkan logo perusahaan pada PDF"
                checked={draftHeader.showLogo}
                onChange={() => updateHeader("showLogo", !draftHeader.showLogo)}
              />
              {company && !company.logoUrl && (
                <p className="m-0 text-[13px] text-slate-500">
                  Belum ada logo. Unggah logo di halaman{" "}
                  <Link to="/settings/company" className="font-semibold text-brand hover:underline">
                    Perusahaan
                  </Link>
                  .
                </p>
              )}
              {company?.logoUrl && !company.showLogoInReport && (
                <p className="m-0 text-[13px] text-slate-500">
                  Logo tidak tampil secara bawaan karena “Tampilkan logo pada laporan” di halaman{" "}
                  <Link to="/settings/company" className="font-semibold text-brand hover:underline">
                    Perusahaan
                  </Link>{" "}
                  nonaktif. Aktifkan sakelar di atas untuk menampilkannya.
                </p>
              )}
              {draftHeader.showLogo && (
                <EditField label="Posisi logo">
                  <div className="flex gap-6">
                    {LOGO_POSITIONS.map(([value, label]) => (
                      <RadioOption
                        key={value}
                        name="logo_position"
                        label={label}
                        checked={draftHeader.logoPosition === value}
                        onChange={() => updateHeader("logoPosition", value)}
                      />
                    ))}
                  </div>
                </EditField>
              )}

              <EditField label="Judul dokumen">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="Indonesia"
                      value={draftHeader.titleId}
                      onChange={(event) => updateHeader("titleId", event.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="Inggris"
                      value={draftHeader.titleEn}
                      onChange={(event) => updateHeader("titleEn", event.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <CheckRow
                    label="Terapkan untuk keduanya"
                    checked={draftHeader.applyForBoth}
                    onChange={() => updateHeader("applyForBoth", !draftHeader.applyForBoth)}
                  />
                </div>
              </EditField>

              <hr className="m-0 border-slate-200" />

              <SubHeading title="Informasi perusahaan">
                <InlineEditActions
                  editing={editingCompanyInfo}
                  onStart={startEditCompanyInfo}
                  onCancel={cancelEditCompanyInfo}
                  onSave={saveEditCompanyInfo}
                />
              </SubHeading>
              {editingCompanyInfo && (
                <p className="m-0 text-[13px] text-slate-500">
                  Informasi perusahaan dan penerima yang diubah hanya tersedia dalam satu versi bahasa.
                </p>
              )}
              {renderHeaderRows(COMPANY_ROWS)}

              <SubHeading title="Informasi penerima" />
              {renderHeaderRows(RECIPIENT_ROWS)}

              <CheckRow
                label="Bidang kustom"
                description="Semua bidang kustom yang aktif akan tampil pada laporan."
                checked={draftHeader.showCustomFields}
                onChange={() => updateHeader("showCustomFields", !draftHeader.showCustomFields)}
              />

              <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
                <EditField label="Ukuran isi">
                  <select
                    className={selectBase}
                    value={draftHeader.contentSize}
                    onChange={(event) => updateHeader("contentSize", event.target.value)}
                  >
                    <option value="Large">Besar</option>
                    <option value="Medium">Sedang</option>
                    <option value="Small">Kecil</option>
                  </select>
                </EditField>
              </div>
            </div>
          )}

          {contentTab === "Content" && (
            <div className="mt-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
                <EditField label="Format tanggal">
                  <select
                    className={selectBase}
                    value={draftContent.dateFormat}
                    onChange={(event) => updateContent("dateFormat", event.target.value)}
                  >
                    {PdfDateFormats.map((item) => (
                      <option key={item} value={item}>
                        {templateLabel(item)}
                      </option>
                    ))}
                  </select>
                </EditField>
              </div>

              <hr className="m-0 border-slate-200" />

              <SubHeading title="Informasi transaksi">
                <InlineEditActions
                  editing={editingTransactionInfo}
                  onStart={startEditTransactionInfo}
                  onCancel={cancelEditTransactionInfo}
                  onSave={saveEditTransactionInfo}
                />
              </SubHeading>
              {renderContentRows(TRANSACTION_ROWS)}

              <SubHeading title="Tabel" />
              {renderContentRows(TABLE_ROWS)}

              <SubHeading title="Pesan dan memo" />
              {renderContentRows(MESSAGE_ROWS)}

              <hr className="m-0 border-slate-200" />

              {contentCheck("Informasi pembayaran", "showPaymentInfo")}

              <div className="flex flex-col gap-3">
                {contentCheck(
                  "Terbilang",
                  "showAmountInWords",
                  "Pilih nominal yang akan ditampilkan pada dokumen."
                )}
                <div className="flex gap-6 pl-[26px]">
                  <RadioOption
                    name="amount_nominal"
                    label="Total"
                    checked={draftContent.amountNominal === "Total"}
                    onChange={() => updateContent("amountNominal", "Total")}
                  />
                  <RadioOption
                    name="amount_nominal"
                    label="Sisa tagihan"
                    checked={draftContent.amountNominal === "Balance due"}
                    onChange={() => updateContent("amountNominal", "Balance due")}
                  />
                </div>
              </div>

              {contentCheck(
                "Tanda tangan",
                "showSignature",
                "Anda dapat mengunggah tanda tangan di pengaturan PDF."
              )}
              {contentCheck(
                "Kaki halaman",
                "showFooter",
                "Menampilkan nomor transaksi dan nomor halaman."
              )}

              <div className="flex flex-col gap-2">
                {contentCheck(
                  "Catatan kaki",
                  "showFootnote",
                  "Catatan tambahan di bagian bawah dokumen."
                )}
                <div className="pl-[26px]">
                  <textarea
                    rows="2"
                    className={`${textareaBase} disabled:bg-slate-100 disabled:text-slate-500`}
                    placeholder="Masukkan catatan kaki"
                    maxLength={30}
                    value={draftContent.footnoteText}
                    disabled={!draftContent.showFootnote}
                    onChange={(event) => updateContent("footnoteText", event.target.value)}
                  />
                  <p className="m-0 mt-1 text-[13px] text-slate-400">
                    {draftContent.footnoteText.length} / 30
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className={`${formLabel} m-0 whitespace-nowrap`}>Pratinjau templat</label>
              <div className="w-[180px]">
                <select
                  className={selectBase}
                  value={previewTemplate}
                  onChange={(event) => {
                    const nextTemplate = event.target.value;
                    setPreviewTemplate(nextTemplate);
                    persistPdfUiState(documentType, nextTemplate);
                  }}
                >
                  {templateOptions.map((item) => (
                    <option key={item} value={item}>
                      {templateLabel(item)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                className={btnModalCancel}
                disabled={!isDirty}
                onClick={resetDraft}
              >
                Atur Ulang Templat
              </button>
              <button
                type="button"
                className={btnModalSubmit}
                disabled={saving || !canEdit}
                onClick={saveDraft}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>

          {(saved || error) && (
            <div className="mt-3 flex justify-end gap-3">
              <TemplateError error={error} />
              <SavedNote saved={saved} />
            </div>
          )}

          <p className="m-0 mt-3 text-[13px] text-slate-500">
            Pratinjau diperbarui otomatis. Perubahan berlaku untuk semua templat pada jenis dokumen yang dipilih.
          </p>
          <div className="mt-5 overflow-x-auto pb-1">
            <div className="pdf-sheet mx-auto flex min-h-[900px] w-full min-w-[560px] max-w-[794px] flex-col px-8 py-8 text-slate-800 sm:px-10">
              <PdfPaper
                template={previewTemplate}
                documentType={documentType}
                header={draft[documentType].header}
                content={draft[documentType].content}
                company={company}
                general={general}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------- WhatsApp ---------- */

const whatsappTemplates = {
  "Sales Template Message": {
    key: "whatsapp_sales",
    defaults: {
      message:
        "Halo [CustomerName], terima kasih atas kepercayaan Anda telah bertransaksi dengan perusahaan kami. Berikut adalah faktur [TransactionNo] sebesar [RemainingAmount]. Silakan lihat detail faktur di sini [InvoiceLink]",
      show_footer: true,
      footer: "Didukung oleh Sales Qontak [LinkJurnal]",
    },
    variables:
      "[CustomerName] [CustomerCompany] [TransactionNo] [TransactionDate] [DueDate] [CompanyEmail] [RemainingAmount] [CompanyName] [InvoiceLink]",
  },
  "Order Template Message": {
    key: "whatsapp_order",
    defaults: {
      message:
        "Halo [CustomerName], terima kasih atas kepercayaan Anda telah bertransaksi dengan perusahaan kami. Berikut adalah faktur [TransactionNo] sebesar [RemainingAmount]. Silakan lihat detail faktur di sini [OrderLink]",
      show_footer: true,
      footer: "Didukung oleh Sales Qontak [LinkJurnal]",
    },
    variables:
      "[CustomerName] [CustomerCompany] [TransactionNo] [TransactionDate] [DueDate] [CompanyEmail] [RemainingAmount] [CompanyName] [OrderLink]",
  },
};

function allTemplateDefaults() {
  const entries = {};
  Object.values(emailTemplates).forEach((template) => {
    entries[template.key] = template.defaults;
  });
  Object.values(whatsappTemplates).forEach((template) => {
    entries[template.key] = template.defaults;
  });
  Object.entries(pdfDocumentKeys).forEach(([, key]) => {
    entries[key] = {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    };
  });
  entries.pdf_general = generalDefaults;
  return entries;
}

async function seedMissingTemplateSettings(stored) {
  for (const [key, defaults] of Object.entries(allTemplateDefaults())) {
    if (stored[key] || !canEditTemplates(key)) continue;
    try {
      await api.put(`/template-settings/${key}/`, defaults);
    } catch {
      continue;
    }
  }
}

function WhatsappTemplateForm({ name }) {
  const template = whatsappTemplates[name];
  const {
    values,
    setField,
    loading,
    saving,
    saved,
    error,
    save,
    reset,
    isDirty,
  } = useTemplateSetting(template.key, template.defaults);
  const canEdit = canEditTemplates(template.key);

  if (loading) return <TemplateLoading />;

  return (
    <div>
      <SectionTitle
        title={templateLabel(name)}
        subtitle="Atur isi pesan WhatsApp yang dikirim ke pelanggan."
      />

      <div className="mt-5 flex flex-col gap-[18px]">
        <EditField label="Pesan">
          <textarea
            rows="4"
            className={textareaBase}
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
          />
        </EditField>

        <div className="flex flex-col gap-2.5">
          <CheckRow
            label="Pesan kaki halaman"
            checked={values.show_footer}
            onChange={() => setField("show_footer", !values.show_footer)}
          />
          <textarea
            rows="2"
            className={`${textareaBase} disabled:bg-slate-100 disabled:text-slate-500`}
            value={values.footer}
            disabled={!values.show_footer}
            onChange={(event) => setField("footer", event.target.value)}
          />
        </div>

        <EditField label="Variabel yang tersedia">
          <p className="m-0 break-words text-[13px] leading-relaxed text-slate-500">
            {template.variables}
          </p>
        </EditField>
      </div>

      <TemplateActions error={error} saved={saved}>
        <button className={btnModalCancel} disabled={!isDirty} onClick={reset}>
          Atur Ulang
        </button>
        <button className={btnModalSubmit} disabled={saving || !canEdit} onClick={() => save()}>
          {saving ? "Menyimpan..." : "Simpan Templat"}
        </button>
      </TemplateActions>
    </div>
  );
}


/* ---------- Page ---------- */

export default function TemplatePage() {
  const [tab, setTab] = useState(TabEmail.some((name) => canAccessSettingsTemplate(emailTemplates[name].key)) ? "email" : canAccessSettingsTemplate("pdf_general") ? "pdf" : "whatsapp");
  const [emailTemplate, setEmailTemplate] = useState(TabEmail.find((name) => canAccessSettingsTemplate(emailTemplates[name].key)) || "Sales Invoice");
  const [pdfTemplate, setPdfTemplate] = useState("General Setting");
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    TabWA.find((name) => canAccessSettingsTemplate(whatsappTemplates[name].key)) || "Sales Template Message"
  );

  useEffect(() => {
    let cancelled = false;
    api
      .get("/template-settings/")
      .then((response) => {
        if (!cancelled) seedMissingTemplateSettings(response.data || {});
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Templat</h2>
      </div>

      <TabNav
        tab={tab}
        setTab={setTab}
        emailTemplate={emailTemplate}
        setEmailTemplate={setEmailTemplate}
        pdfTemplate={pdfTemplate}
        setPdfTemplate={setPdfTemplate}
        whatsappTemplate={whatsappTemplate}
        setWhatsappTemplate={setWhatsappTemplate}
      />

      <div className="company-card mb-6 mt-4 rounded-[10px] bg-white p-6">
        {tab === "email" && (
          <EmailTemplateForm key={emailTemplate} name={emailTemplate} />
        )}

        {tab === "pdf" &&
          (pdfTemplate === "General Setting" ? <GeneralSetting /> : <CustomizePdf />)}

        {tab === "whatsapp" && (
          <WhatsappTemplateForm key={whatsappTemplate} name={whatsappTemplate} />
        )}
      </div>
    </div>
  );
}