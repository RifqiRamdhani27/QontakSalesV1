import { useEffect, useRef, useState } from "react";
import { Camera, Trash, X } from "@phosphor-icons/react";
import api, { extractError } from "@/services/settingsApi";
const btnModalCancel = "inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border border-[color:var(--profile-border,#d1d5db)] bg-[color:var(--profile-surface,#fff)] px-[15px] py-[9px] text-[13px] font-semibold text-[color:var(--profile-text,#374151)] transition-colors hover:bg-[color:var(--profile-hover,#f8fafc)] disabled:cursor-not-allowed disabled:opacity-60";
const btnModalSubmit = "inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-[color:var(--profile-brand,#2563eb)] px-[15px] py-[9px] text-[13px] font-semibold text-[color:var(--profile-brand-text,#fff)] transition-colors hover:bg-[color:var(--profile-brand-hover,#1d4ed8)] disabled:cursor-not-allowed disabled:opacity-60";
const buttonSpinner = "h-[15px] w-[15px] animate-spin rounded-full border-2 border-[color:var(--profile-spinner-track,rgba(255,255,255,.5))] border-t-current";
const formLabel = "mb-[7px] block text-[13px] font-semibold text-[color:var(--profile-text,#374151)]";
const inputBase = "w-full rounded-lg border border-[color:var(--profile-border,#d1d5db)] bg-[color:var(--profile-surface,#fff)] px-3 py-2.5 text-sm text-[color:var(--profile-text,#111827)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--profile-placeholder,#94a3b8)] focus:border-[color:var(--profile-brand,#2563eb)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] disabled:cursor-not-allowed disabled:bg-[color:var(--profile-subtle,#f1f5f9)]";
const modalCloseButton = "cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-[color:var(--profile-muted,#64748b)] transition-colors hover:bg-[color:var(--profile-hover,#f1f5f9)]";
const modalFooter = "flex justify-end gap-2.5 border-t border-[color:var(--profile-border,#e5e7eb)] px-[22px] py-4";
const modalHeader = "flex items-center justify-between border-b border-[color:var(--profile-border,#e5e7eb)] px-[22px] py-[18px]";
const modalOverlay = "fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5";
const modalPanel = "max-h-[90vh] w-full overflow-hidden rounded-xl bg-[color:var(--profile-surface,#fff)] shadow-[0_20px_50px_rgba(0,0,0,0.2)]";
const modalTitle = "m-0 text-[19px] text-[color:var(--profile-text,#111827)]";
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const roleLabels = {
  MANAGER: "Sales Manager",
  AGENT: "Sales Agent"
};
const initialOf = value => (value || "?").trim().charAt(0).toUpperCase();
const profileErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (data && typeof data === "object") {
    for (const field of ["email", "avatar", "first_name", "last_name", "phone"]) {
      const message = data[field];
      if (!message) continue;
      return Array.isArray(message) ? message.join(" ") : String(message);
    }
  }
  return extractError(error, fallback);
};
function AccountInfo({
  label,
  value
}) {
  return <div className="min-w-0">
      <div className="text-xs text-[color:var(--profile-muted,#64748b)]">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium text-[color:var(--profile-text,#111827)]">
        {value || "-"}
      </div>
    </div>;
}
export default function ProfileModal({
  user,
  onClose,
  onUpdated,
  isDark = false
}) {
  const profileTheme = isDark ? {
    "colorScheme": "dark",
    "--profile-surface": "#1a1a1a",
    "--profile-subtle": "#262626",
    "--profile-border": "#634f27",
    "--profile-text": "#f1f5f9",
    "--profile-muted": "#94a3b8",
    "--profile-placeholder": "#94a3b8",
    "--profile-hover": "#2d2d2d",
    "--profile-info-bg": "#2b2418",
    "--profile-info-text": "#E5B85C",
    "--profile-danger-bg": "#482126",
    "--profile-danger-text": "#fca5a5",
    "--profile-danger-border": "#7f1d1d",
    "--profile-brand": "#E5B85C",
    "--profile-brand-hover": "#f0c978",
    "--profile-brand-text": "#121212",
    "--profile-spinner-track": "rgba(18,18,18,.3)",
    "--profile-link": "#E5B85C",
    "--profile-selection": "rgba(229,184,92,.15)",
    "--profile-selection-text": "#E5B85C",
    "--profile-disabled-bg": "#36312a",
    "--profile-danger-button": "#b91c1c",
    "--profile-success-button": "#15803d"
  } : {
    colorScheme: "light"
  };
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url || null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const firstFieldRef = useRef(null);
  const modalRef = useRef(null);
  const objectUrlRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const savingRef = useRef(false);
  onCloseRef.current = onClose;
  savingRef.current = saving;
  const fullName = `${form.first_name} ${form.last_name}`.trim() || user.username || "User";
  const isDirty = Boolean(avatarFile) || removeAvatar || form.first_name !== (user.first_name || "") || form.last_name !== (user.last_name || "") || form.email !== (user.email || "") || form.phone !== (user.phone || "");
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTarget = window.matchMedia("(min-width: 640px)").matches ? firstFieldRef.current : modalRef.current;
    focusTarget?.focus();
    const handleKeyDown = event => {
      if (event.key === "Escape") {
        if (!savingRef.current) onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex=\"-1\"])")).filter(element => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);
  const setField = (field, value) => {
    setForm(current => ({
      ...current,
      [field]: value
    }));
    setError("");
  };
  const clearObjectUrl = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };
  const onAvatarPick = event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih harus berupa gambar.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setError("Ukuran foto maksimal 5 MB.");
      return;
    }
    clearObjectUrl();
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setRemoveAvatar(false);
    setError("");
  };
  const onAvatarRemove = () => {
    clearObjectUrl();
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
    setError("");
  };
  const handleSubmit = async event => {
    event.preventDefault();
    if (saving) return;
    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = new FormData();
      payload.append("first_name", form.first_name.trim());
      payload.append("last_name", form.last_name.trim());
      payload.append("email", form.email.trim());
      payload.append("phone", form.phone.trim());
      if (avatarFile) payload.append("avatar", avatarFile);
      if (removeAvatar) payload.append("remove_avatar", "true");
      const response = await api.put("/settings/profile/", payload);
      onUpdated(response.data);
      onClose();
    } catch (requestError) {
      setError(profileErrorMessage(requestError, "Gagal menyimpan profil."));
    } finally {
      setSaving(false);
    }
  };
  return <div data-qontak-profile="" className={`${modalOverlay} z-[1300]`} onMouseDown={event => {
    if (event.target === event.currentTarget && !saving) onClose();
  }} style={profileTheme} data-profile-theme={isDark ? "dark" : "light"}>{isDark && <style>{"[data-profile-theme=\"dark\"] input{caret-color:#E5B85C}\n[data-profile-theme=\"dark\"] input:focus{border-color:#E5B85C!important;box-shadow:0 0 0 3px rgba(229,184,92,.15)}\n[data-profile-theme=\"dark\"] button:disabled{background-color:#36312a!important;color:#94a3b8!important;border-color:#634f27}\n[data-profile-theme=\"dark\"] ::selection{background-color:#E5B85C;color:#121212}"}</style>}
      <div ref={modalRef} className={`${modalPanel} flex max-w-[620px] flex-col`} role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" aria-describedby="profile-modal-description" tabIndex={-1}>
        <div className={`${modalHeader} shrink-0`}>
          <div>
            <h2 id="profile-modal-title" className={`${modalTitle} font-bold`}>
              Profil Saya
            </h2>
            <p id="profile-modal-description" className="m-0 mt-1 text-[13px] text-[color:var(--profile-muted,#64748b)]">
              Perbarui foto dan informasi akun Anda
            </p>
          </div>
          <button type="button" className={modalCloseButton} onClick={onClose} disabled={saving} aria-label="Tutup profil">
            <X size={20} />
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[22px] py-5">
            <div className="flex items-center gap-5 max-[520px]:flex-col max-[520px]:items-start">
              <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--profile-info-bg,#dbeafe)] text-[30px] font-bold text-[color:var(--profile-info-text,#1d4ed8)]">
                {avatarPreview ? <img src={avatarPreview} alt={fullName} width={88} height={88} className="h-full w-full object-cover" /> : <span>{initialOf(fullName)}</span>}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-[color:var(--profile-text,#111827)]">
                  Foto profil
                </div>
                <p className="m-0 mt-1 text-[13px] text-[color:var(--profile-muted,#64748b)]">
                  JPG, PNG, atau WebP. Maksimal 5 MB.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button type="button" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[color:var(--profile-border,#d1d5db)] bg-[color:var(--profile-surface,#fff)] px-3 py-2 text-[13px] font-semibold text-[color:var(--profile-text,#374151)] transition-colors hover:bg-[color:var(--profile-hover,#f8fafc)] disabled:cursor-not-allowed disabled:opacity-60" onClick={() => fileInputRef.current?.click()} disabled={saving}>
                    <Camera size={16} />
                    Ganti foto
                  </button>

                  {avatarPreview && <button type="button" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-[color:var(--profile-danger-text,#dc2626)] transition-colors hover:bg-[color:var(--profile-danger-bg,#fef2f2)] disabled:cursor-not-allowed disabled:opacity-60" onClick={onAvatarRemove} disabled={saving}>
                      <Trash size={16} />
                      Hapus
                    </button>}

                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onAvatarPick} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-[18px] max-[520px]:grid-cols-1">
              <div>
                <label htmlFor="profile-first-name" className={formLabel}>
                  Nama depan
                </label>
                <input id="profile-first-name" name="first_name" ref={firstFieldRef} className={inputBase} value={form.first_name} autoComplete="given-name" onChange={event => setField("first_name", event.target.value)} />
              </div>

              <div>
                <label htmlFor="profile-last-name" className={formLabel}>
                  Nama belakang
                </label>
                <input id="profile-last-name" name="last_name" className={inputBase} value={form.last_name} autoComplete="family-name" onChange={event => setField("last_name", event.target.value)} />
              </div>

              <div className="col-span-full">
                <label htmlFor="profile-email" className={formLabel}>
                  Email
                </label>
                <input id="profile-email" name="email" type="email" className={inputBase} value={form.email} autoComplete="email" spellCheck={false} required onChange={event => setField("email", event.target.value)} />
              </div>

              <div className="col-span-full">
                <label htmlFor="profile-phone" className={formLabel}>
                  Nomor telepon
                </label>
                <input id="profile-phone" name="phone" type="tel" className={inputBase} value={form.phone} autoComplete="tel" placeholder="0812-3456-7890" onChange={event => setField("phone", event.target.value)} />
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[color:var(--profile-subtle,#f8fafc)] p-4">
              <div className="text-[13px] font-semibold text-[color:var(--profile-text,#374151)]">
                Informasi akun
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 max-[520px]:grid-cols-1">
                <AccountInfo label="Username" value={`@${user.username}`} />
                <AccountInfo label="Role" value={roleLabels[user.role] || user.role} />
                <AccountInfo label="Perusahaan" value={user.company_name || "-"} />
              </div>
            </div>

          </div>

          {error && <div className="mx-[22px] mt-4 shrink-0 whitespace-pre-line rounded-lg border border-[color:var(--profile-danger-border,#fecaca)] bg-[color:var(--profile-danger-bg,#fef2f2)] px-3 py-2.5 text-[13px] text-[color:var(--profile-danger-text,#b91c1c)]" role="alert">
              {error}
            </div>}

          <div className={`${modalFooter} shrink-0`}>
            <button type="button" className={btnModalCancel} onClick={onClose} disabled={saving}>
              Batal
            </button>
            <button type="submit" className={btnModalSubmit} disabled={saving || !isDirty}>
              {saving && <span className={buttonSpinner} />}
              {saving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>;
}
