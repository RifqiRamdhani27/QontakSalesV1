import { useEffect, useState } from "react";
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  pageSpinner,
  selectBase,
} from "@/components/ui/styles";
import api from "@/services/settingsApi";
import { canAccessSettings as can } from "@/services/settingsAccess";

const PRODUCTION_SETTINGS_URL = "/settings/production-settings/";

const initialProductionSettings = {
  planDatesField: "Required",
  allowBackdate: false,
  allowPartialProduction: false,
};

const planDateModeToLabel = {
  required: "Required",
  optional: "Optional",
  hidden: "Hide",
};

const labelToPlanDateMode = {
  Required: "required",
  Optional: "optional",
  Hide: "hidden",
};

const PLAN_DATE_OPTIONS = [
  { value: "Required", label: "Wajib" },
  { value: "Optional", label: "Opsional" },
  { value: "Hide", label: "Sembunyikan" },
];

const serverToClient = (data) => ({
  planDatesField: planDateModeToLabel[data.production_plan_date_mode] || "Required",
  allowBackdate: !!data.allow_backdated_plan_date,
  allowPartialProduction: !!data.allow_partial_production,
});

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

function SectionHeading({ title, subtitle, showEdit, onEdit }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 pt-7 first:pt-0">
      <div>
        <h2 className="m-0 text-[19px] font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="m-0 mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {showEdit && <EditButton onClick={onEdit} />}
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

function SaveActions({ saving, error, onCancel, onSave }) {
  return (
    <div className="mt-6 border-t border-gray-200 pt-5">
      {error && <p className="m-0 mb-3 whitespace-pre-line text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2.5">
        <button type="button" className={btnModalCancel} onClick={onCancel} disabled={saving}>
          Batal
        </button>
        <button type="button" className={btnModalSubmit} onClick={onSave} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan perubahan"}
        </button>
      </div>
    </div>
  );
}

function SettingStatus({ loading, error }) {
  if (loading) {
    return (
      <div className="company-card mb-6 mt-4 flex items-center justify-center rounded-[10px] bg-white p-16">
        <span className={pageSpinner} />
      </div>
    );
  }
  return (
    <div className="company-card mb-6 mt-4 rounded-[10px] bg-white p-6 text-sm text-red-600">{error}</div>
  );
}

export default function ProductionsPage() {
  const [savedSettings, setSavedSettings] = useState(initialProductionSettings);
  const [draft, setDraft] = useState(initialProductionSettings);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(PRODUCTION_SETTINGS_URL)
      .then((response) => {
        const settings = serverToClient(response.data);
        setSavedSettings(settings);
        setDraft(settings);
      })
      .catch((e) => {
        console.error(e);
        setLoadError("Gagal memuat pengaturan produksi.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const readOnly = !editing;
  const values = editing ? draft : savedSettings;

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleField = (field) => {
    setDraft((current) => ({ ...current, [field]: !current[field] }));
  };

  const startEdit = () => {
    setDraft(savedSettings);
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError("");
    setDraft(savedSettings);
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      setError("");
      const response = await api.put(PRODUCTION_SETTINGS_URL, {
        production_plan_date_mode: labelToPlanDateMode[draft.planDatesField],
        allow_backdated_plan_date: draft.allowBackdate,
        allow_partial_production: draft.allowPartialProduction,
      });
      const settings = serverToClient(response.data);
      setSavedSettings(settings);
      setDraft(settings);
      setEditing(false);
    } catch (e) {
      console.error(e);
      const detail = e.response?.data;
      setError(
        detail && typeof detail === "object"
          ? Object.entries(detail)
              .map(([field, errs]) => field + ": " + errs)
              .join("\n")
          : "Gagal menyimpan pengaturan produksi."
      );
    } finally {
      setSaving(false);
    }
  };

  const showEdit = !editing && can("productions", "edit");

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Produksi</h2>
      </div>

      {loading || loadError ? (
        <SettingStatus loading={loading} error={loadError} />
      ) : (
        <div className="company-card mb-6 mt-4 rounded-[10px] bg-white p-6">
          <SectionHeading
            title="Pengaturan perencanaan produksi"
            subtitle="Atur bidang tanggal rencana dan aturan tanggal pada perencanaan produksi."
            showEdit={showEdit}
            onEdit={startEdit}
          />

          <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
            <EditField label="Bidang tanggal rencana produksi">
              <select
                className={selectBase}
                value={values.planDatesField}
                disabled={readOnly}
                onChange={(e) => setField("planDatesField", e.target.value)}
              >
                {PLAN_DATE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </EditField>
          </div>

          <div className="mt-5">
            <CheckRow
              label="Izinkan tanggal mundur"
              checked={values.allowBackdate}
              disabled={readOnly}
              onChange={() => toggleField("allowBackdate")}
            />
          </div>

          <SectionHeading
            title="Kesiapan produksi"
            subtitle="Tentukan apakah produksi boleh dimulai meski bahan belum lengkap."
          />

          <div className="mt-5">
            <CheckRow
              label="Izinkan produksi sebagian"
              checked={values.allowPartialProduction}
              disabled={readOnly}
              onChange={() => toggleField("allowPartialProduction")}
            />
          </div>

          {editing && (
            <SaveActions saving={saving} error={error} onCancel={cancelEdit} onSave={saveEdit} />
          )}
        </div>
      )}
    </div>
  );
}