import { useEffect, useState } from "react";
import { CaretDown, CaretRight, Info, MagnifyingGlass, X } from "@phosphor-icons/react";
import Pagination from "@/components/ui/Pagination";
import emptyRoleImg from "@/assets/empty-role.svg";
import {
  tableWrapper,
  tableBase,
  tableCard,
  th,
  td,
  trHover,
  selectBase,
  inputBase,
  textareaBase,
  formLabel,
  btnPrimary,
  btnSecondary,
  btnModalCancel,
  btnModalSubmit,
  btnModalDelete,
  modalOverlay,
  modalPanel,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalFooter,
} from "@/components/ui/styles";
import {
  statusLabels,
  statusBadgeClass,
  typeLabels,
} from "@/data/dummy";
import {
  customRoleFeatures,
  customRoleFeatureLabel,
  customRoleSubFeatureLabel,
  inviteRoles,
  roleLabel as permissionLabel,
} from "@/components/data/ruleData";
import api, { extractError } from "@/services/settingsApi";
import { canAccessSettingsFeature, isSettingsOwner } from "@/services/settingsAccess";
import { DropdownPanel, useDropdown } from "@/components/ui/PopoverSelect";

const PAGE_SIZE = 10;

const authorityColumns = [
  { key: "View", label: "Lihat" },
  { key: "Create/Add", label: "Buat/Tambah" },
  { key: "Edit", label: "Ubah" },
  { key: "Delete", label: "Hapus" },
];
const authorityColumnKeys = authorityColumns.map((column) => column.key);
const authorityColumnLabel = (key) =>
  authorityColumns.find((column) => column.key === key)?.label || permissionLabel(key);
const columnToApi = { View: "see", "Create/Add": "create", Edit: "edit", Delete: "can_delete" };

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00");

const DAY_OPTIONS = [
  { key: "Monday", label: "Senin" },
  { key: "Tuesday", label: "Selasa" },
  { key: "Wednesday", label: "Rabu" },
  { key: "Thursday", label: "Kamis" },
  { key: "Friday", label: "Jumat" },
  { key: "Saturday", label: "Sabtu" },
  { key: "Sunday", label: "Minggu" },
];

function accessLimitLabel(value) {
  return value.replace(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/g, (day) => DAY_OPTIONS.find((option) => option.key === day).label);
}

const cellKey = (featureName, subName, column) => `${featureName}.${subName}.${column}`;
const hasAuthority = (a) => a.see || a.create || a.edit || a.can_delete;
const grantedAuthorities = (role) => (role.authorities || []).filter(hasAuthority);

const tabClass = (active) =>
  "cursor-pointer border-0 border-b bg-transparent p-2 " +
  (active
    ? "border-brand text-brand hover:bg-gray-50"
    : "border-transparent text-gray-400 hover:border-gray-500 hover:bg-gray-50 hover:text-black");

function parseAccessLimit(value) {
  const base = {
    enabled: false,
    dayType: "Senin - Jumat",
    start: "08:00",
    end: "17:00",
    days: {},
    hours: {},
  };
  if (!value) return base;
  const simple = value.match(/^(Senin - Jumat|Senin - Sabtu) (\d{2}:\d{2})-(\d{2}:\d{2})$/);
  if (simple) {
    return { ...base, enabled: true, dayType: simple[1], start: simple[2], end: simple[3] };
  }
  const days = {};
  const hours = {};
  value.split(", ").forEach((part) => {
    const m = part.match(/^(\w+) (\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (m) {
      days[m[1]] = true;
      hours[m[1]] = { start: m[2], end: m[3] };
    }
  });
  return { ...base, enabled: true, dayType: "Custom", days, hours };
}


function SideDrawer({ title, onClose, footer, children }) {
  return (
    <div className="fixed inset-0 z-[1100] flex justify-end bg-slate-900/55">
      <div className="flex h-full w-full max-w-[860px] flex-col bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>{title}</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
        {footer && <div className={`${modalFooter} shrink-0`}>{footer}</div>}
      </div>
    </div>
  );
}

function ActionMenu({ items }) {
  const dropdown = useDropdown();

  return (
    <>
      <button type="button" ref={dropdown.triggerRef} className={btnSecondary} onClick={dropdown.toggle}>
        Tindakan <CaretDown size={12} />
      </button>
      {dropdown.isOpen && (
        <DropdownPanel
          rect={dropdown.rect}
          triggerRef={dropdown.triggerRef}
          onClose={dropdown.close}
          variant="settings"
          width={170}
          align="right"
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={
                "block w-full cursor-pointer border-0 bg-transparent px-4 py-2 text-left text-[13px] hover:bg-slate-50 " +
                (item.danger ? "text-red-600" : "text-gray-700")
              }
              onClick={() => {
                dropdown.close();
                item.onClick();
              }}
            >
              {permissionLabel(item.label)}
            </button>
          ))}
        </DropdownPanel>
      )}
    </>
  );
}
function ConfirmDeleteModal({ title, message, loading, onClose, onConfirm }) {
  return (
    <div className={`${modalOverlay} z-[1200]`}>
      <div className={`${modalPanel} max-w-[440px]`}>
        <div className={modalHeader}>
          <h3 className={`${modalTitle} font-bold`}>{title}</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="px-[22px] py-5 text-sm leading-relaxed text-slate-500">{message}</div>
        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm} disabled={loading}>
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}


function RoleDetailsDrawer({ role, onClose }) {
  const groups = new Map();
  (role.authorities || []).filter(hasAuthority).forEach((authority) => {
    if (!groups.has(authority.feature)) groups.set(authority.feature, []);
    groups.get(authority.feature).push(authority);
  });

  const featureOrder = new Map(
    customRoleFeatures.map((feature, index) => [feature.name, index])
  );
  const rows = [...groups.entries()]
    .sort(([featureA], [featureB]) => {
      const orderA = featureOrder.get(featureA) ?? Number.MAX_SAFE_INTEGER;
      const orderB = featureOrder.get(featureB) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || featureA.localeCompare(featureB);
    })
    .flatMap(([featureName, authorities]) =>
      authorities
        .slice()
        .sort((authorityA, authorityB) =>
          authorityA.sub_feature.localeCompare(authorityB.sub_feature)
        )
        .map((authority, index) => ({
          key: `${featureName}.${authority.sub_feature}`,
          feature: index === 0 ? customRoleFeatureLabel(featureName) : "",
          sub: customRoleSubFeatureLabel(featureName, authority.sub_feature),
          badges: [
            authority.see && "View",
            authority.create && "Create/Add",
            authority.edit && "Edit",
            authority.can_delete && "Delete",
          ].filter(Boolean),
        }))
    );

  return (
    <SideDrawer
      title="Rincian peran"
      onClose={onClose}
      footer={
        <button type="button" className={btnModalCancel} onClick={onClose}>
          Tutup
        </button>
      }
    >
      <h3 className="m-0 text-[17px] font-bold text-gray-900">{role.name}</h3>
      <p className="m-0 mb-5 mt-1 text-[13px] text-slate-500">{role.description || "-"}</p>

      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className={`${th} w-[28%] !py-2.5 text-xs`}>Fitur</th>
            <th className={`${th} w-[34%] !py-2.5 text-xs`}>Subfitur</th>
            <th className={`${th} !py-2.5 text-xs`}>Wewenang</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className={`${td} text-center text-slate-400`}>
                Peran ini belum memiliki wewenang.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.key}>
                <td className={`${td} !py-2.5`}>{row.feature}</td>
                <td className={`${td} !py-2.5`}>{row.sub}</td>
                <td className={`${td} !py-2.5`}>
                  <div className="flex flex-wrap gap-1.5">
                    {row.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                      >
                        {authorityColumnLabel(badge)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SideDrawer>
  );
}


function CustomRoleDrawer({ role, onClose, onSaved }) {
  const isEdit = !!role;
  const [roleName, setRoleName] = useState(role?.name || "");
  const [roleDescription, setRoleDescription] = useState(role?.description || "");
  const [activeName, setActiveName] = useState(customRoleFeatures[0].name);
  const [saving, setSaving] = useState(false);
  const [authorityCells, setAuthorityCells] = useState(() => {
    const cells = {};
    (role?.authorities || []).forEach((a) => {
      authorityColumnKeys.forEach((column) => {
        cells[cellKey(a.feature, a.sub_feature, column)] = !!a[columnToApi[column]];
      });
    });
    return cells;
  });

  const active =
    customRoleFeatures.find((feature) => feature.name === activeName) || customRoleFeatures[0];

  const rowColumns = (row) => row.columns || [];
  const isCellChecked = (feature, row, column) =>
    !!authorityCells[cellKey(feature.name, row.key, column)];
  const isRowChecked = (feature, row) =>
    !row.disabled &&
    rowColumns(row).some((column) => isCellChecked(feature, row, column));
  const checkedRowCount = (feature) =>
    feature.rows.filter((row) => isRowChecked(feature, row)).length;
  const selectedFeatureCount = customRoleFeatures.filter(
    (feature) => checkedRowCount(feature) > 0
  ).length;

  const setCells = (feature, rows, columns, value) =>
    setAuthorityCells((prev) => {
      const next = { ...prev };
      rows.forEach((row) => {
        rowColumns(row)
          .filter((column) => columns.includes(column))
          .forEach((column) => {
            next[cellKey(feature.name, row.key, column)] = value;
          });
      });
      return next;
    });

  const setFeature = (feature, value) =>
    setCells(feature, feature.rows, authorityColumnKeys, value);

  const activeRowsWithColumn = (column) =>
    active.rows.filter(
      (row) => !row.disabled && rowColumns(row).includes(column)
    );

  const isColumnAllChecked = (column) => {
    const rows = activeRowsWithColumn(column);
    return rows.length > 0 && rows.every((row) => isCellChecked(active, row, column));
  };

  const setColumn = (column, value) =>
    setCells(active, activeRowsWithColumn(column), [column], value);

  const buildAuthorities = () =>
    customRoleFeatures
      .flatMap((feature) =>
        feature.rows
          .filter((row) => !row.disabled)
          .map((row) => {
            const entry = {
              feature: feature.name,
              sub_feature: row.key,
              see: false,
              create: false,
              edit: false,
              can_delete: false,
            };
            rowColumns(row).forEach((column) => {
              entry[columnToApi[column]] = isCellChecked(feature, row, column);
            });
            return entry;
          })
      )
      .filter(hasAuthority);

  const knownKeys = new Set(
    customRoleFeatures.flatMap((feature) =>
      feature.rows.map((row) => `${feature.name}.${row.key}`)
    )
  );
  const preservedAuthorities = (role?.authorities || [])
    .filter(
      (authority) =>
        hasAuthority(authority) &&
        !knownKeys.has(`${authority.feature}.${authority.sub_feature}`)
    )
    .map((authority) => ({
      feature: authority.feature,
      sub_feature: authority.sub_feature,
      see: !!authority.see,
      create: !!authority.create,
      edit: !!authority.edit,
      can_delete: !!authority.can_delete,
    }));

  const authorities = [...buildAuthorities(), ...preservedAuthorities];
  const canSave = roleName.trim() !== "" && authorities.length > 0 && !saving;

  const handleSave = async () => {
    const payload = {
      name: roleName.trim(),
      description: roleDescription,
      authorities,
    };
    try {
      setSaving(true);
      if (isEdit) {
        await api.patch(`/settings/roles/${role.id}/`, payload);
      } else {
        await api.post("/settings/roles/", {
          code: payload.name.toLowerCase().replace(/\s+/g, "_"),
          ...payload,
        });
      }
      onSaved();
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal menyimpan peran."));
    } finally {
      setSaving(false);
    }
  };

  const colGrid = "grid grid-cols-[1fr_88px_100px_84px_84px] items-center";

  return (
    <SideDrawer
      title={isEdit ? "Ubah peran kustom" : "Tambah peran kustom"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Batal
          </button>
          <button type="button" className={btnModalSubmit} disabled={!canSave} onClick={handleSave}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </>
      }
    >
      <h3 className="m-0 mb-4 text-xl font-bold text-gray-900">Informasi peran</h3>

      <div className="mb-4 max-w-[420px]">
        <label className={formLabel}>
          Nama peran <span className="text-red-600">*</span>
        </label>
        <input
          name="roleName"
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className={inputBase}
        />
      </div>

      <div className="mb-6 max-w-[420px]">
        <label className={formLabel}>Deskripsi</label>
        <textarea
          name="roleDescription"
          rows={3}
          maxLength={400}
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          className={textareaBase}
        />
        <p className="m-0 mt-1 text-xs text-slate-400">Maksimal 400 karakter</p>
      </div>

      <h3 className="m-0 mb-2 text-xl font-bold text-gray-900">
        Wewenang <span className="text-red-600">*</span>
      </h3>
      <div className="mb-3 rounded-lg bg-slate-50 px-4 py-3 text-[13px] leading-relaxed text-slate-500">
        Pilih fitur terkait untuk melihat rincian laporan.
        <br />
        Contoh: jika pengguna memiliki akses laporan daftar penjualan, pilih juga
        subfitur rincian penjualan untuk memberikan akses yang lebih terperinci.
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <div className="min-w-[740px]">
          <div className="flex bg-slate-50 text-[13px] font-semibold text-slate-700">
            <div className="w-[232px] shrink-0 border-r border-slate-200 px-4 py-3">
              Fitur ({selectedFeatureCount})
            </div>
            <div className={`${colGrid} flex-1 px-4 py-3`}>
              <div>Subfitur/fungsi tambahan</div>
              {authorityColumns.map((column) => (
                <label
                  key={column.key}
                  className="flex cursor-pointer items-center justify-center gap-1.5"
                  title={column.label}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand"
                    checked={isColumnAllChecked(column.key)}
                    disabled={activeRowsWithColumn(column.key).length === 0}
                    onChange={(e) => setColumn(column.key, e.target.checked)}
                  />
                  <span className="text-[11px]">{column.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="w-[232px] shrink-0 border-r border-slate-200">
              {customRoleFeatures.map((feature) => {
                const count = checkedRowCount(feature);
                const isActive = feature.name === activeName;
                return (
                  <div
                    key={feature.name}
                    onClick={() => setActiveName(feature.name)}
                    className={
                      "flex cursor-pointer items-center gap-2.5 border-b border-slate-100 px-4 py-2.5 " +
                      (isActive
                        ? "border-l-[3px] border-l-brand bg-indigo-50 pl-[13px] font-semibold"
                        : "hover:bg-slate-50")
                    }
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 shrink-0 cursor-pointer accent-brand"
                      checked={count > 0}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => setFeature(feature, count === 0)}
                    />
                    <span className="flex-1 text-[11px] font-semibold uppercase leading-tight tracking-[0.03em] text-slate-700">
                      {feature.label}
                    </span>
                    {count > 0 && (
                      <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-brand/10 px-1.5 text-xs font-bold text-brand">
                        {count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex-1 bg-indigo-50/60">
              {active.rows.map((row) => {
                const allowedColumns = rowColumns(row);
                const disabled = !!row.disabled;
                return (
                  <div
                    key={row.key}
                    className={`${colGrid} border-b border-slate-200/70 px-4 py-2.5 text-[13px] ${
                      disabled ? "bg-slate-100/70 text-slate-400" : "text-slate-700"
                    }`}
                  >
                    <label
                      className={
                        "flex items-center gap-2.5 " +
                        (disabled ? "cursor-not-allowed" : "cursor-pointer")
                      }
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-brand disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={disabled}
                        checked={isRowChecked(active, row)}
                        onChange={(e) => setCells(active, [row], allowedColumns, e.target.checked)}
                      />
                      <span className={`flex-1 ${disabled ? "text-slate-400" : ""}`}>
                        {row.label}
                      </span>
                      {disabled && (
                        <span className="shrink-0 whitespace-nowrap rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Nonaktif
                        </span>
                      )}
                    </label>
                    {authorityColumns.map((column) => {
                      const allowed = allowedColumns.includes(column.key);
                      return (
                        <div key={column.key} className="flex justify-center">
                          <span className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-brand disabled:cursor-not-allowed disabled:opacity-30"
                              disabled={disabled || !allowed}
                              checked={allowed && isCellChecked(active, row, column.key)}
                              onChange={(e) =>
                                setCells(active, [row], [column.key], e.target.checked)
                              }
                            />
                            {allowed && column.key === "View" && row.info && (
                              <span
                                role="img"
                                tabIndex={0}
                                aria-label="Izin Lihat mencakup akses ke informasi detail fitur ini"
                                title="Izin Lihat mencakup akses ke informasi detail fitur ini"
                                className="inline-flex shrink-0 cursor-help text-slate-500 hover:text-slate-700"
                              >
                                <Info size={15} weight="fill" />
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}


function TransferOwnershipModal({ members, onClose, onTransfer }) {
  const [newOwner, setNewOwner] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const enabled = newOwner !== "" && confirmText === "TRANSFER" && !loading;

  const submit = async () => {
    setLoading(true);
    await onTransfer(newOwner);
    setLoading(false);
  };

  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} max-w-[480px]`}>
        <div className={modalHeader}>
          <h3 className={`${modalTitle} font-bold`}>Pengalihan Kepemilikan Akun Perusahaan</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <p className="m-0 mb-5 text-sm leading-relaxed text-slate-500">
            Setelah kepemilikan dialihkan, peran Anda di akun perusahaan ini akan berubah. Silakan pilih pemilik baru yang berstatus aktif.
          </p>

          <div className="mb-4">
            <label className={formLabel}>Pemilik baru</label>
            <select
              name="newOwner"
              className={selectBase}
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            >
              {members.length === 0 ? (
                <option value="">Tidak ada yang ditemukan</option>
              ) : (
                <>
                  <option value="">Pilih pengguna</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.username}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className={formLabel}>
              Ketik TRANSFER sebagai konfirmasi untuk menyetujui pengalihan kepemilikan
            </label>
            <input
              name="confirmTransfer"
              type="text"
              className={inputBase}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </div>

        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Batal
          </button>
          <button type="button" className={btnModalSubmit} disabled={!enabled} onClick={submit}>
            {loading ? "Memproses..." : "Alihkan kepemilikan"}
          </button>
        </div>
      </div>
    </div>
  );
}


function HourSelect({ name, value, onChange, className }) {
  return (
    <select name={name} value={value} onChange={onChange} className={className || selectBase}>
      {HOUR_OPTIONS.map((hour) => (
        <option key={hour} value={hour}>
          {hour}
        </option>
      ))}
    </select>
  );
}

function InviteUserModal({ user, onClose, onAddCustomRole, onViewRole, onSubmit }) {
  const isEdit = !!user;
  const savedRoleConfig = user?.roleConfig || {};
  const listToCheckedMap = (list) => Object.fromEntries((list || []).map((k) => [k, true]));
  const [initialAccess] = useState(() => parseAccessLimit(user?.accessLimit));

  const [userName, setUserName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [accessTimeLimits, setAccessTimeLimits] = useState(initialAccess.enabled);
  const [accessDayType, setAccessDayType] = useState(initialAccess.dayType);
  const [accessStartHour, setAccessStartHour] = useState(initialAccess.start);
  const [accessEndHour, setAccessEndHour] = useState(initialAccess.end);
  const [accessTimeError, setAccessTimeError] = useState("");
  const [customDays, setCustomDays] = useState(initialAccess.days);
  const [customHours, setCustomHours] = useState(initialAccess.hours);
  const [roleTab, setRoleTab] = useState(
    isEdit && !(savedRoleConfig.existing || []).length ? "custom" : "existing"
  );
  const [expandedRoles, setExpandedRoles] = useState([]);
  const [collapsedCustom, setCollapsedCustom] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState(() => listToCheckedMap(savedRoleConfig.existing));
  const [checkedCustomRoles, setCheckedCustomRoles] = useState(user?.customRoleIds || []);
  const [customRoles, setCustomRoles] = useState([]);
  const [authorityCells, setAuthorityCells] = useState(() => listToCheckedMap(savedRoleConfig.authority));
  const [restrictionCells, setRestrictionCells] = useState(() => listToCheckedMap(savedRoleConfig.restriction));
  const [listManager, setListManager] = useState(!!savedRoleConfig.list_manager);

  useEffect(() => {
    api
      .get("/settings/roles/")
      .then((response) => setCustomRoles(response.data))
      .catch(() => {});
  }, []);

  const ultimateSelected = !!checkedRoles.ultimate;
  const ultimateWithListManager = ultimateSelected && listManager;

  useEffect(() => {
    if (ultimateWithListManager) {
      setAccessTimeLimits(false);
      setAccessTimeError("");
    }
  }, [ultimateWithListManager]);

  const validateAccessTime = (dayType, start, end, days, hours) => {
    if (dayType === "Custom") {
      const selected = DAY_OPTIONS.filter((d) => days[d.key]);
      if (selected.length === 0) return "Pilih minimal satu hari";
      const bad = selected.some(
        (d) => (hours[d.key]?.start ?? "08:00") >= (hours[d.key]?.end ?? "17:00")
      );
      return bad ? "Jam selesai harus setelah jam mulai" : "";
    }
    return start >= end ? "Jam selesai harus setelah jam mulai" : "";
  };

  const buildAccessTimeLimit = () => {
    if (!accessTimeLimits) return "";
    if (accessDayType === "Custom") {
      return DAY_OPTIONS.filter((d) => customDays[d.key])
        .map(
          (d) =>
            d.key +
            " " +
            (customHours[d.key]?.start ?? "08:00") +
            "-" +
            (customHours[d.key]?.end ?? "17:00")
        )
        .join(", ");
    }
    return accessDayType + " " + accessStartHour + "-" + accessEndHour;
  };

  const handleSubmit = () => {
    if (!userName.trim() || !email.trim()) {
      window.alert("Nama pengguna dan email wajib diisi.");
      return;
    }
    if (accessTimeLimits) {
      const error = validateAccessTime(
        accessDayType,
        accessStartHour,
        accessEndHour,
        customDays,
        customHours
      );
      if (error) {
        setAccessTimeError(error);
        return;
      }
    }
    const checkedKeys = (cells) => Object.keys(cells).filter((k) => cells[k]);
    onSubmit({
      username: userName.trim(),
      email: email.trim(),
      type: "member",
      access_time_limit: buildAccessTimeLimit(),
      roles: ultimateSelected ? [] : checkedCustomRoles,
      role_config: {
        existing: checkedKeys(checkedRoles),
        authority: checkedKeys(authorityCells),
        restriction: checkedKeys(restrictionCells),
        list_manager: listManager,
      },
    });
  };

  const revalidate = (dayType, start, end, days, hours) =>
    setAccessTimeError(validateAccessTime(dayType, start, end, days, hours));

  const toggleIn = (setter, value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const selectedRoleNames = inviteRoles.filter((r) => checkedRoles[r.key]).map((r) => r.name);
  const selectedCustomRoleNames = customRoles
    .filter((r) => checkedCustomRoles.includes(r.id))
    .map((r) => r.name);

  const termsBox = (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <div className="mb-1.5 text-[13px] font-bold text-gray-900">Ketentuan pemilihan peran</div>
      <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-500">
        <li>Wewenang peran kustom menjadi acuan utama dalam pengelolaan peran.</li>
        <li>Jika Anda memilih lebih dari satu peran kustom, wewenang dari masing-masing peran akan digabungkan.</li>
      </ul>
    </div>
  );

  const roleTabClass = (active) =>
    "flex cursor-pointer items-center gap-2 border-0 border-b-2 bg-transparent px-4 py-2 text-[13px] font-semibold " +
    (active ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-slate-800");

  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} flex max-w-[860px] flex-col`}>
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>{isEdit ? "Ubah pengguna" : "Undang pengguna"}</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-[22px] py-5">
          <div className="mb-4 text-[13px] font-bold text-gray-900">Informasi pengguna</div>

          <div className="mb-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div>
              <label className={formLabel}>
                Nama pengguna <span className="text-red-600">*</span>
              </label>
              <input
                name="inviteUserName"
                type="text"
                value={userName}
                disabled={isEdit}
                onChange={(e) => setUserName(e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className={formLabel}>
                Email <span className="text-red-600">*</span>
              </label>
              <input
                name="inviteEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          <label
            className={
              "mb-1 flex items-center gap-2.5 text-[13px] font-semibold " +
              (ultimateWithListManager ? "cursor-not-allowed text-slate-300" : "cursor-pointer text-gray-700")
            }
          >
            <input
              type="checkbox"
              name="applyAccessTimeLimits"
              className="h-4 w-4 accent-brand"
              checked={accessTimeLimits}
              disabled={ultimateWithListManager}
              onChange={(e) => setAccessTimeLimits(e.target.checked)}
            />
            Terapkan batas waktu akses
          </label>
          <p className="m-0 mb-5 text-xs leading-relaxed text-slate-400">
            Dapat diterapkan pada semua peran kecuali Pemilik dan Akses Penuh dengan wewenang Pengelola Daftar yang dipilih.
          </p>

          {accessTimeLimits && (
            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                <div>
                  <label className={formLabel}>Hari</label>
                  <select
                    name="accessDayType"
                    value={accessDayType}
                    onChange={(e) => {
                      setAccessDayType(e.target.value);
                      setAccessTimeError("");
                    }}
                    className={selectBase}
                  >
                    <option value="Senin - Jumat">Senin - Jumat</option>
                    <option value="Senin - Sabtu">Senin - Sabtu</option>
                    <option value="Custom">Kustom</option>
                  </select>
                </div>
                {accessDayType !== "Custom" && (
                  <>
                    <div>
                      <label className={formLabel}>Jam mulai</label>
                      <HourSelect
                        name="accessStartHour"
                        value={accessStartHour}
                        onChange={(e) => {
                          setAccessStartHour(e.target.value);
                          revalidate(accessDayType, e.target.value, accessEndHour, customDays, customHours);
                        }}
                      />
                    </div>
                    <div>
                      <label className={formLabel}>Jam selesai</label>
                      <HourSelect
                        name="accessEndHour"
                        value={accessEndHour}
                        onChange={(e) => {
                          setAccessEndHour(e.target.value);
                          revalidate(accessDayType, accessStartHour, e.target.value, customDays, customHours);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {accessDayType !== "Custom" && (
                <p className="m-0 mt-2 text-xs text-slate-400">Waktu dalam GMT+7</p>
              )}

              {accessDayType === "Custom" && (
                <div className="mt-4">
                  {DAY_OPTIONS.map((day) => (
                    <div
                      key={day.key}
                      className="grid grid-cols-[140px_1fr_1fr] items-center gap-4 border-t border-slate-200 py-2.5 first:border-t-0 max-md:grid-cols-1"
                    >
                      <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          name={`custom-day-${day.key}`}
                          className="h-4 w-4 accent-brand"
                          checked={!!customDays[day.key]}
                          onChange={(e) =>
                            setCustomDays((prev) => ({ ...prev, [day.key]: e.target.checked }))
                          }
                        />
                        {day.label}
                      </label>
                      <HourSelect
                        name={`startHour-${day.key}`}
                        value={customHours[day.key]?.start ?? "08:00"}
                        onChange={(e) =>
                          setCustomHours((prev) => ({
                            ...prev,
                            [day.key]: { start: e.target.value, end: prev[day.key]?.end ?? "17:00" },
                          }))
                        }
                      />
                      <HourSelect
                        name={`endHour-${day.key}`}
                        value={customHours[day.key]?.end ?? "17:00"}
                        onChange={(e) => {
                          const value = e.target.value;
                          const next = {
                            ...customHours,
                            [day.key]: { start: customHours[day.key]?.start ?? "08:00", end: value },
                          };
                          setCustomHours(next);
                          revalidate(accessDayType, accessStartHour, accessEndHour, customDays, next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {accessTimeError && (
                <p className="m-0 mt-2 text-xs font-semibold text-red-600">{accessTimeError}</p>
              )}
            </div>
          )}

          <div className="mb-2 text-[13px] font-bold text-gray-900">
            Peran <span className="text-red-600">*</span>
          </div>

          <div className="mb-1 flex border-b border-slate-200">
            <button type="button" className={roleTabClass(roleTab === "existing")} onClick={() => setRoleTab("existing")}>
              Peran bawaan
            </button>
            <button type="button" className={roleTabClass(roleTab === "custom")} onClick={() => setRoleTab("custom")}>
              Kustom
              <span className="rounded-full bg-red-600 px-[7px] py-[1px] text-[10px] font-bold text-white">Baru</span>
            </button>
          </div>

          {roleTab === "custom" ? (
            <div>
              <div className="mb-5 mt-2 border-b border-slate-200">
                {ultimateSelected && (
                  <p className="m-0 py-2 text-xs leading-relaxed text-slate-400">
                    Peran kustom tidak dapat dipilih bersama peran Akses Penuh. Pilih salah satunya untuk menghindari konflik peran.
                  </p>
                )}
                {customRoles.map((role) => {
                  const collapsed = collapsedCustom.includes(role.id);
                  return (
                    <div key={role.id} className="border-t border-slate-100 py-3 first:border-t-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="cursor-pointer rounded border-0 bg-transparent p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          onClick={() => toggleIn(setCollapsedCustom, role.id)}
                        >
                          {collapsed ? <CaretRight size={16} /> : <CaretDown size={16} />}
                        </button>
                        <label
                          className={
                            "flex flex-1 items-center gap-2.5 " +
                            (ultimateSelected ? "cursor-not-allowed" : "cursor-pointer")
                          }
                        >
                          <input
                            type="checkbox"
                            name={`custom-role-${role.id}`}
                            className="h-4 w-4 accent-brand"
                            checked={checkedCustomRoles.includes(role.id)}
                            disabled={ultimateSelected}
                            onChange={() => toggleIn(setCheckedCustomRoles, role.id)}
                          />
                          <span
                            className={
                              "text-sm font-bold " + (ultimateSelected ? "text-slate-300" : "text-slate-900")
                            }
                          >
                            {role.name}
                          </span>
                        </label>
                      </div>
                      {!collapsed && (
                        <div className="ml-[34px] mt-1">
                          {role.description && (
                            <p className="m-0 mb-1 text-xs text-slate-500">{role.description}</p>
                          )}
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
                            onClick={() => onViewRole(role)}
                          >
                            Lihat rincian peran
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {customRoles.length === 0 && (
                  <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <img src={emptyRoleImg} alt="" className="h-[140px] w-[140px] object-contain" />
                      <p className="mt-3 text-sm font-semibold text-slate-800">Daftar peran akan tampil di sini</p>
                      <p className="mt-1 max-w-xl text-sm text-slate-500">Tambahkan peran kustom melalui tombol Tambah peran kustom.</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-center py-4">
                  <button type="button" className={btnSecondary} onClick={onAddCustomRole} disabled={!canAccessSettingsFeature("User management: Custom role", "create")}>
                    + Tambah peran kustom
                  </button>
                </div>
              </div>
              {termsBox}
            </div>
          ) : (
            <div className="grid grid-cols-[1fr_260px] gap-6 max-lg:grid-cols-1">
              <div>
                <div className="border-b border-slate-200">
                  {inviteRoles.map((role) => (
                    <div key={role.key} className="border-t border-slate-100 py-2.5 first:border-t-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="cursor-pointer rounded border-0 bg-transparent p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          onClick={() => toggleIn(setExpandedRoles, role.key)}
                        >
                          {expandedRoles.includes(role.key) ? <CaretDown size={16} /> : <CaretRight size={16} />}
                        </button>
                        <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                          <input
                            type="checkbox"
                            name={`role-${role.key}`}
                            className="h-4 w-4 accent-brand"
                            checked={!!checkedRoles[role.key]}
                            onChange={(e) =>
                              setCheckedRoles((prev) => ({ ...prev, [role.key]: e.target.checked }))
                            }
                          />
                          <span className="text-sm font-bold text-slate-900">{permissionLabel(role.name)}</span>
                        </label>
                      </div>

                      {expandedRoles.includes(role.key) && (
                        <div className="ml-[34px] mt-2 pb-1">
                          <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-500">
                            {role.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                          {role.authority && (
                            <div className="mt-3">
                              <div className="mb-1.5 text-[13px] font-bold text-gray-900">{role.authority}</div>
                              {role.authorityOptions.map((option) => (
                                <label
                                  key={option}
                                  className="mt-1.5 flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700"
                                >
                                  <input
                                    type="checkbox"
                                    name={`${role.key}-authority-${option}`}
                                    className="h-4 w-4 accent-brand"
                                    checked={!!authorityCells[`${role.key}.${option}`]}
                                    onChange={(e) =>
                                      setAuthorityCells((prev) => ({
                                        ...prev,
                                        [`${role.key}.${option}`]: e.target.checked,
                                      }))
                                    }
                                  />
                                  {permissionLabel(option)}
                                </label>
                              ))}
                            </div>
                          )}
                          {role.restriction && (
                            <div className="mt-3">
                              <div className="mb-1.5 text-[13px] font-bold text-gray-900">Pembatasan akses</div>
                              <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-slate-700">
                                <input
                                  type="checkbox"
                                  name={`${role.key}-restriction`}
                                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                                  checked={!!restrictionCells[role.key]}
                                  onChange={(e) =>
                                    setRestrictionCells((prev) => ({ ...prev, [role.key]: e.target.checked }))
                                  }
                                />
                                {role.restriction}
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-2 mt-5 text-[13px] font-bold text-gray-900">Wewenang tambahan</div>
                <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="listManager"
                    className="h-4 w-4 accent-brand"
                    checked={listManager}
                    onChange={(e) => setListManager(e.target.checked)}
                  />
                  Pengelola Daftar (dapat mengubah dan menghapus data)
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-3 text-[13px] font-bold text-gray-900">Peran yang dipilih</div>
                  <div className="mb-1.5 text-[13px] font-semibold text-slate-600">Peran bawaan</div>
                  {selectedRoleNames.length > 0 ? (
                    <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-slate-700">
                      {selectedRoleNames.map((n) => (
                        <li key={n}>{permissionLabel(n)}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[13px] text-slate-400">-</div>
                  )}
                  <div className="mb-1.5 mt-4 text-[13px] font-semibold text-slate-600">Kustom</div>
                  {selectedCustomRoleNames.length > 0 ? (
                    <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-slate-700">
                      {selectedCustomRoleNames.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[13px] text-slate-400">-</div>
                  )}
                </div>
                {termsBox}
              </div>
            </div>
          )}
        </div>

        <div className={`${modalFooter} shrink-0`}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className={btnModalSubmit}
            disabled={
              userName.trim() === "" ||
              email.trim() === "" ||
              (selectedRoleNames.length === 0 && checkedCustomRoles.length === 0)
            }
            onClick={handleSubmit}
          >
            {isEdit ? "Simpan" : "Undang"}
          </button>
        </div>
      </div>
    </div>
  );
}


function UserTable({ users, roles, onTransfer, onEdit, onDelete, onResend }) {
  const roleLabel = (user) => {
    if (user.isOwner) return "Pemilik";
    const existing = inviteRoles
      .filter((r) => (user.roleConfig?.existing || []).includes(r.key))
      .map((r) => permissionLabel(r.name));
    const custom = roles.filter((r) => user.customRoleIds.includes(r.id)).map((r) => r.name);
    const all = [...existing, ...custom];
    return all.length > 0 ? all.join(", ") : "-";
  };

  return (
    <div className={tableWrapper}>
      <table className={`${tableBase} min-w-[900px]`}>
        <thead>
          <tr>
            <th className={th}>Nama pengguna</th>
            <th className={th}>Peran</th>
            <th className={th}>Batas waktu akses</th>
            <th className={th}>Status</th>
            <th className={th}>Jenis</th>
            <th className={th}>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const menuItems = [
              onEdit && { label: "Ubah", onClick: () => onEdit(user) },
              onDelete && { label: "Hapus", danger: true, onClick: () => onDelete(user) },
            ].filter(Boolean);
            if (user.status === "invited" && onResend) {
              menuItems.push({ label: "Kirim ulang undangan", onClick: () => onResend(user) });
            }
            return (
              <tr key={user.id} className={trHover}>
                <td className={`${td} font-bold text-slate-900`}>{user.username}</td>
                <td className={td}>{roleLabel(user)}</td>
                <td className={td}>{user.accessLimit ? accessLimitLabel(user.accessLimit) : "-"}</td>
                <td className={td}>
                  <span
                    className={`inline-flex rounded-full px-[9px] py-[5px] text-xs font-bold ${statusBadgeClass[user.status]}`}
                  >
                    {permissionLabel(statusLabels[user.status])}
                  </span>
                </td>
                <td className={td}>{permissionLabel(typeLabels[user.type])}</td>
                <td className={td}>
                  {user.isOwner ? (
                    onTransfer ? (
                      <button type="button" className={btnSecondary} onClick={() => onTransfer(user)}>
                        Alihkan kepemilikan
                      </button>
                    ) : "-"
                  ) : (
                    menuItems.length > 0 ? <ActionMenu items={menuItems} /> : "-"
                  )}
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className={`${td} text-center text-slate-400`}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <img src={emptyRoleImg} alt="" className="h-[140px] w-[140px] object-contain" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">Belum ada pengguna</p>
                  <p className="mt-1 max-w-xl text-sm text-slate-500">Pengguna yang ditetapkan pada peran ini akan tampil di sini.</p>
                </div>

              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function UserFilter({ typeFilter, statusFilter, search, onTypeChange, onStatusChange, onSearchChange }) {
  return (
    <div className="flex flex-wrap items-end gap-5 max-md:flex-col max-md:items-stretch">
      <div className="flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Tipe</label>
        <select name="type" value={typeFilter} onChange={onTypeChange} className={`${selectBase} !w-auto`}>
          <option value="all">Semua jenis</option>
          <option value="member">Anggota</option>
          <option value="partner">Mitra</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Status</label>
        <select name="status" value={statusFilter} onChange={onStatusChange} className={`${selectBase} !w-auto`}>
          <option value="all">Semua status</option>
          <option value="invited">Diundang</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      <div className="flex w-[280px] items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
        <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
        <input
          value={search}
          onChange={onSearchChange}
          placeholder="Cari pengguna..."
          className="w-full border-0 outline-none"
        />
      </div>
    </div>
  );
}


export default function UserManagementPage() {
  const canViewUsers = canAccessSettingsFeature("User management: User list", "view");
  const canViewRoles = canAccessSettingsFeature("User management: Custom role", "view");
  const canCreateUsers = canAccessSettingsFeature("User management: User list", "create");
  const canEditUsers = canAccessSettingsFeature("User management: User list", "edit");
  const canDeleteUsers = canAccessSettingsFeature("User management: User list", "delete");
  const canCreateRoles = canAccessSettingsFeature("User management: Custom role", "create");
  const canEditRoles = canAccessSettingsFeature("User management: Custom role", "edit");
  const canDeleteRoles = canAccessSettingsFeature("User management: Custom role", "delete");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [roleSearch, setRoleSearch] = useState("");
  const [rolePage, setRolePage] = useState(1);
  const [rolePageSize, setRolePageSize] = useState(PAGE_SIZE);
  const [activeTab, setActiveTab] = useState(canViewUsers ? "users" : "roles");

  const [inviteModal, setInviteModal] = useState(null);
  const [roleDrawer, setRoleDrawer] = useState(null);
  const [viewRole, setViewRole] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const loadRoles = async () => {
    if (!canViewRoles && !canCreateUsers && !canEditUsers) return;
    try {
      const response = await api.get("/settings/roles/");
      setRoles(response.data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data peran.");
    }
  };

  const loadUsers = async () => {
    if (!canViewUsers) return;
    try {
      const response = await api.get("/settings/members/");
      setUsers(
        response.data.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email || "",
          accessLimit: user.access_time_limit || "",
          status: user.status,
          type: user.type,
          isOwner: user.role === "MANAGER",
          customRoleIds: user.roles || [],
          roleConfig: user.role_config || {},
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data pengguna.");
    }
  };

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    setRolePage(1);
  }, [roleSearch]);


  const handleSubmitUser = async (payload) => {
    const editingUser = inviteModal?.user;
    try {
      setInviteLink("");
      if (editingUser) {
        await api.patch(`/settings/members/${editingUser.id}/`, {
          email: payload.email,
          access_time_limit: payload.access_time_limit,
          roles: payload.roles,
          role_config: payload.role_config,
        });
      } else {
        const response = await api.post("/settings/members/", payload);
        setInviteLink(response.data?.invitation_url || "");
        if (response.data?.email_sent === false) {
          alert(
            "Pengguna berhasil dibuat, tetapi email undangan gagal dikirim. Coba kirim ulang undangan."
          );
        }
      }
      await loadUsers();
      setInviteModal(null);
    } catch (error) {
      console.error(error);
      alert(extractError(error, editingUser ? "Gagal menyimpan pengguna." : "Gagal mengundang pengguna."));
    }
  };

  const handleResend = async (user) => {
    try {
      const response = await api.post(`/settings/members/${user.id}/resend-invitation/`);
      if (response.data?.invitation_url) {
        setInviteLink(response.data.invitation_url);
      } else {
        alert("Undangan berhasil dikirim ulang ke " + (user.email || user.username));
      }
      if (response.data?.email_sent === false) {
        alert("Email undangan gagal dikirim. Coba lagi.");
      }
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal mengirim ulang undangan."));
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Link undangan disalin.");
    } catch {
      window.prompt("Salin tautan undangan:", inviteLink);
    }
  };

  const handleTransfer = async (newOwnerId) => {
    try {
      await api.post(`/settings/members/${newOwnerId}/transfer-ownership/`, { confirm: "TRANSFER" });
      alert("Kepemilikan berhasil dialihkan.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal mengalihkan kepemilikan."));
    }
  };

  const handleConfirmDelete = async () => {
    const { type, item } = deleteTarget;
    try {
      setDeleting(true);
      await api.delete(type === "user" ? `/settings/members/${item.id}/` : `/settings/roles/${item.id}/`);
      if (type === "user") await loadUsers();
      else await Promise.all([loadRoles(), loadUsers()]);
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal menghapus data."));
    } finally {
      setDeleting(false);
    }
  };


  const filteredUsers = users.filter((user) => {
    const matchesType = typeFilter === "all" || user.type === typeFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const keyword = search.toLowerCase();
    const matchesSearch =
      !keyword ||
      user.username.toLowerCase().includes(keyword) ||
      (user.accessLimit || "").toLowerCase().includes(keyword);
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);

  const transferCandidates = users.filter((u) => !u.isOwner && u.status === "active");


  const filteredRoles = roles.filter((role) => {
    const keyword = roleSearch.toLowerCase();
    return (
      !keyword ||
      role.name.toLowerCase().includes(keyword) ||
      (role.description || "").toLowerCase().includes(keyword)
    );
  });

  const roleTotalPages = Math.max(1, Math.ceil(filteredRoles.length / rolePageSize));
  const safeRolePage = Math.min(rolePage, roleTotalPages);
  const pagedRoles = filteredRoles.slice((safeRolePage - 1) * rolePageSize, safeRolePage * rolePageSize);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="m-0 text-[28px] font-bold text-gray-900">Manajemen Pengguna</h2>
          <p className="m-0 mt-1.5 text-slate-500">Kelola informasi pengguna</p>
        </div>

        <div className="flex gap-3">
          {canCreateRoles && <button className={btnSecondary} onClick={() => setRoleDrawer({ role: null })}>
            Tambah peran kustom
          </button>}
          {canCreateUsers && <button className={btnPrimary} onClick={() => setInviteModal({ user: null })}>
            Undang pengguna
          </button>}
        </div>
      </div>

      {inviteLink && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-brand/30 bg-brand/[0.06] px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-gray-900">
              Link undangan (mode development)
            </div>
            <div className="truncate text-xs text-slate-500">{inviteLink}</div>
          </div>
          <button type="button" className={btnSecondary} onClick={handleCopyInviteLink}>
            Salin tautan
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center border-0 bg-transparent p-1 text-slate-400 hover:text-slate-700"
            onClick={() => setInviteLink("")}
            aria-label="Tutup link undangan"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mb-6 flex gap-3">
        {canViewUsers && <button className={tabClass(activeTab === "users")} onClick={() => setActiveTab("users")}>
          Daftar pengguna
        </button>}
        {canViewRoles && <button className={tabClass(activeTab === "roles")} onClick={() => setActiveTab("roles")}>
          Peran kustom
        </button>}
      </div>

      {activeTab === "users" ? (
        <div className={`${tableCard} p-6`}>
          <div className="mb-8">
            <UserFilter
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              search={search}
              onTypeChange={(e) => setTypeFilter(e.target.value)}
              onStatusChange={(e) => setStatusFilter(e.target.value)}
              onSearchChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <UserTable
            users={pagedUsers}
            roles={roles}
            onTransfer={isSettingsOwner() ? () => setTransferOpen(true) : undefined}
            onEdit={canEditUsers ? (user) => setInviteModal({ user }) : undefined}
            onDelete={canDeleteUsers ? (user) => setDeleteTarget({ type: "user", item: user }) : undefined}
            onResend={canCreateUsers ? handleResend : undefined}
          />

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      ) : (
        <div className="mb-6">
          <div className="mb-5 flex w-[280px] items-center gap-2 rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
            <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
            <input
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              placeholder="Cari peran..."
              className="w-full border-0 outline-none"
            />
          </div>

          {roles.length > 0 ? (
            <div className={`${tableCard} p-6`}>
              <div className={tableWrapper}>
                <table className={tableBase}>
                  <thead>
                    <tr>
                      <th className={`${th} w-[280px]`}>Nama peran</th>
                      <th className={th}>Deskripsi</th>
                      <th className={`${th} w-[140px]`}>Wewenang</th>
                      <th className={`${th} w-[120px]`}>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRoles.map((role) => (
                      <tr key={role.id} className={trHover}>
                        <td className={td}>
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-brand hover:underline"
                            onClick={() => setViewRole(role)}
                          >
                            {role.name}
                          </button>
                        </td>
                        <td className={td}>{role.description || "-"}</td>
                        <td className={td}>
                          {grantedAuthorities(role).length > 0
                            ? grantedAuthorities(role).length + " wewenang"
                            : "-"}
                        </td>
                        <td className={td}>
                          {role.is_default || (!canEditRoles && !canDeleteRoles) ? (
                            "-"
                          ) : (
                            <ActionMenu
                              items={[
                                canEditRoles && { label: "Ubah", onClick: () => setRoleDrawer({ role }) },
                                canDeleteRoles && {
                                  label: "Hapus",
                                  danger: true,
                                  onClick: () => setDeleteTarget({ type: "role", item: role }),
                                },
                              ].filter(Boolean)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                    {pagedRoles.length === 0 && (
                      <tr>
                        <td colSpan={4} className={`${td} text-center text-slate-400`}>
                          Peran tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={safeRolePage}
                totalPages={roleTotalPages}
                totalItems={filteredRoles.length}
                pageSize={rolePageSize}
                onPageChange={setRolePage}
                onPageSizeChange={(size) => {
                  setRolePageSize(size);
                  setRolePage(1);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                  <img src={emptyRoleImg} alt="" className="h-[180px] w-[180px] object-contain" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">Daftar peran akan tampil di sini</p>
                  <p className="mt-1 max-w-xl text-sm text-slate-500">Tambahkan peran kustom melalui tombol Tambah peran kustom.</p>
            </div>
          )}
        </div>
      )}

      {transferOpen && (
        <TransferOwnershipModal
          members={transferCandidates}
          onClose={() => setTransferOpen(false)}
          onTransfer={handleTransfer}
        />
      )}

      {inviteModal && (
        <InviteUserModal
          user={inviteModal.user}
          onClose={() => setInviteModal(null)}
          onAddCustomRole={() => {
            setInviteModal(null);
            setRoleDrawer({ role: null });
          }}
          onViewRole={setViewRole}
          onSubmit={handleSubmitUser}
        />
      )}

      {roleDrawer && (
        <CustomRoleDrawer
          role={roleDrawer.role}
          onClose={() => setRoleDrawer(null)}
          onSaved={() => {
            setRoleDrawer(null);
            loadRoles();
          }}
        />
      )}

      {viewRole && <RoleDetailsDrawer role={viewRole} onClose={() => setViewRole(null)} />}

      {deleteTarget && (
        <ConfirmDeleteModal
          title={deleteTarget.type === "user" ? "Hapus pengguna" : "Hapus peran kustom"}
          message={
            deleteTarget.type === "user"
              ? `Yakin ingin menghapus pengguna "${deleteTarget.item.username}"? Tindakan ini tidak bisa dibatalkan.`
              : `Yakin ingin menghapus peran "${deleteTarget.item.name}"? Pengguna yang memakai peran ini akan kehilangan wewenangnya.`
          }
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
