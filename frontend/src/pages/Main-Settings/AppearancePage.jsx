import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AddressBook,
  ArrowCounterClockwise,
  ArrowSquareOut,
  CheckCircle,
  EnvelopeSimple,
  Eye,
  FloppyDisk,
  Images,
  Info,
  InstagramLogo,
  Megaphone,
  NewspaperClipping,
  Plus,
  Question,
  Quotes,
  Sparkle,
  SquaresFour,
  Trash,
  UploadSimple,
  WarningCircle,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { btnPrimary, btnSecondary, btnDangerOutline, btnModalCancel, btnModalSubmit, formLabel, inputBase, textareaBase } from "@/components/ui/styles";
import { extractError } from "@/services/settingsApi";
import { isSettingsAdmin } from "@/services/settingsAccess";
import { uploadImageToCloudinary } from "@/services/UploadGambar";
import {
  APPEARANCE_LIMITS,
  APPEARANCE_SECTIONS,
  cloneContent,
  getAppearanceSettings,
  getDefaultSection,
  getInstagramUrl,
  getWhatsappUrl,
  legacyInstagramUsername,
  publishAppearance,
  validateAppearance,
} from "@/services/appearanceSettings";

const SECTION_ICONS = {
  hero: Sparkle,
  closing: Megaphone,
  faqs: Question,
  testimonial: Quotes,
  gallery: Images,
  newsletter: NewspaperClipping,
  workspace: SquaresFour,
  contact: AddressBook,
};

function ContentField({ label, value, onChange, maxLength, multiline = false, required = false, type = "text", hint, placeholder, inputMode, onBlur, error }) {
  const id = useId();
  const empty = required && !value.trim();
  const atLimit = value.length >= maxLength;
  const invalid = Boolean(empty || error);
  const Field = multiline ? "textarea" : "input";
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className={`${formLabel} !mb-0`}>
          {label}
          {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
          {!required && <span className="ml-1 font-normal text-slate-400">(opsional)</span>}
        </label>
        <span className={`text-xs tabular-nums ${atLimit ? "text-amber-600" : "text-slate-400"}`}>
          {value.length} / {maxLength}
        </span>
      </div>
      <Field
        id={id}
        name={id}
        type={multiline ? undefined : type}
        inputMode={inputMode}
        rows={multiline ? 3 : undefined}
        maxLength={maxLength}
        placeholder={placeholder}
        className={multiline ? textareaBase : inputBase}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-slate-500">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
      {empty && <p className="mt-1.5 text-xs text-red-600">Wajib diisi.</p>}
    </div>
  );
}

function ImageField({ label, value, onChange, optional = false }) {
  const id = useId();
  const fileRef = useRef(null);
  const [error, setError] = useState("");
  const [failedSource, setFailedSource] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState("");
  const legacy = value.startsWith("data:image/");
  const preview = localPreview || value;

  const change = useCallback((next) => {
    setError("");
    setFailedSource("");
    onChange(next);
  }, [onChange]);

  const send = async (file) => {
    setUploading(true);
    setError("");
    try {
      const url = await uploadImageToCloudinary(file, { maxBytes: APPEARANCE_LIMITS.imageBytes });
      change(url);
    } catch (err) {
      setError(err?.message || "Gagal mengunggah gambar ke server gambar. Periksa koneksi lalu coba lagi.");
    } finally {
      setUploading(false);
      setLocalPreview("");
    }
  };

  const upload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Gunakan gambar PNG, JPEG, atau WebP.");
      return;
    }
    if (file.size > APPEARANCE_LIMITS.imageBytes) {
      setError(`Ukuran gambar maksimal ${formatBytes(APPEARANCE_LIMITS.imageBytes)}.`);
      return;
    }
    setLocalPreview(URL.createObjectURL(file));
    send(file);
  };


  useEffect(() => {
    if (!legacy) return;
    let cancelled = false;
    const migrate = async () => {
      setUploading(true);
      setError("");
      try {
        const blob = await fetch(value).then((response) => response.blob());
        if (cancelled) return;
        const url = await uploadImageToCloudinary(
          new File([blob], "hero-image", { type: blob.type || "image/png" }),
          { maxBytes: APPEARANCE_LIMITS.imageBytes }
        );
        if (!cancelled) change(url);
      } catch {
        if (!cancelled) setError("Gambar lama perlu diunggah ulang. Pilih file gambarnya lagi.");
      } finally {
        if (!cancelled) setUploading(false);
      }
    };
    migrate();
    return () => {
      cancelled = true;
    };
  }, [change, legacy, value]);

  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  return (
    <fieldset className="min-w-0">
      <legend className={formLabel}>
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(opsional)</span>}
      </legend>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-slate-50 sm:w-48">
          {preview && failedSource !== preview ? (
            <img
              src={preview}
              alt={`Pratinjau ${label.toLowerCase()}`}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setFailedSource(preview)}
            />
          ) : (
            <span className="px-3 text-center text-xs text-slate-400">
              {failedSource === preview ? "Gambar gagal dimuat" : "Belum ada gambar"}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              id={`${id}-file`}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label={`Unggah ${label.toLowerCase()}`}
              onChange={upload}
              className="hidden"
            />
            <button
              type="button"
              className={btnSecondary}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <UploadSimple size={16} aria-hidden="true" />
              {uploading ? "Mengunggah…" : "Unggah gambar"}
            </button>
            {optional && value && !uploading && (
              <button type="button" className={btnDangerOutline} onClick={() => change("")}>
                <Trash size={15} aria-hidden="true" />Hapus
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            PNG, JPEG, atau WebP · maksimal {formatBytes(APPEARANCE_LIMITS.imageBytes)} ·
            otomatis diunggah ke penyimpanan gambar, bukan ditanam di konten.
          </p>
          <details>
            <summary className="w-fit cursor-pointer rounded text-xs font-medium text-slate-600 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Atau pakai URL gambar
            </summary>
            <div className="mt-2">
              <label htmlFor={`${id}-url`} className="sr-only">URL gambar</label>
              <input
                id={`${id}-url`}
                type="url"
                maxLength={APPEARANCE_LIMITS.imageUrl}
                className={inputBase}
                value={legacy ? "" : value}
                onChange={(event) => change(event.target.value)}
                placeholder="https://contoh.com/gambar.jpg"
                spellCheck={false}
                disabled={uploading}
              />
            </div>
          </details>
          {value && !legacy && (
            <p className="break-all text-xs text-slate-400">{value}</p>
          )}
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}

const HERO_HIGHLIGHT = "Dibangun untuk Pertumbuhan";

const formatBytes = (bytes) => {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${Number(mb.toFixed(2))} MB` : `${Math.round(bytes / 1024)} KB`;
};

function HeroText({ text }) {
  const at = text.indexOf(HERO_HIGHLIGHT);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-sky-300">{HERO_HIGHLIGHT}</span>
      {text.slice(at + HERO_HIGHLIGHT.length)}
    </>
  );
}

function HeroPreview({ hero }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-slate-900">
      {hero.image && (
        <img src={hero.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 to-slate-950/90" />
      <div className="relative space-y-3 p-5 sm:p-6">
        <p className="max-w-xl text-lg font-bold leading-tight text-white sm:text-2xl">
          <HeroText text={hero.title || "Judul hero akan tampil di sini"} />
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-slate-300">
          {hero.description || "Deskripsi singkat hero akan tampil di sini."}
        </p>
        <span className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white">
          {hero.buttonText || "Teks tombol"}
        </span>
      </div>
    </div>
  );
}

function ClosingPreview({ closing }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-slate-900">
      <div className="space-y-3 px-5 py-8 text-center sm:px-8">
        <p className="text-xl font-bold leading-tight text-white sm:text-2xl">
          {closing.title || "Judul ajakan penutup akan tampil di sini"}
        </p>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-300">
          {closing.description || "Deskripsi ajakan penutup akan tampil di sini."}
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          <span className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white">
            {closing.buttonText || "Tombol utama"}
          </span>
          <span className="inline-flex rounded-full border border-slate-500 px-4 py-2 text-xs font-bold text-slate-200">
            {closing.secondaryButtonText || "Tombol demo"}
          </span>
        </div>
      </div>
    </div>
  );
}

function FaqsPreview({ faqs }) {
  const items = faqs.filter((item) => item.q.trim() || item.a.trim()).slice(0, 4);
  return (
    <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
      {items.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-400">Belum ada FAQ untuk dipratinjau.</p>
      )}
      {items.map((item, index) => (
        <div key={item.id || index} className="rounded-lg border border-gray-200">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="min-w-0 text-sm font-semibold text-gray-900">
              {item.q || `Pertanyaan ${index + 1}`}
            </p>
            <span className="shrink-0 text-slate-400" aria-hidden="true">+</span>
          </div>
          {index === 0 && item.a && (
            <p className="border-t border-gray-100 px-4 py-3 text-xs leading-relaxed text-slate-600">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function TestimonialPreview({ testimonial }) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-slate-900 px-5 py-8 text-center">
      <p className="text-base font-semibold leading-snug text-white sm:text-xl">
        “{testimonial.quote || "Kutipan testimoni akan tampil di sini."}”
      </p>
      <div className="flex flex-col items-center gap-2">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt=""
            aria-hidden="true"
            className="h-12 w-12 rounded-full border-2 border-sky-500 object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-800 text-slate-500">
            <Quotes size={20} weight="fill" aria-hidden="true" />
          </span>
        )}
        <p className="text-sm font-bold text-white">{testimonial.name || "Nama pelanggan"}</p>
        <p className="text-xs text-slate-400">{testimonial.position || "Jabatan & perusahaan"}</p>
      </div>
    </div>
  );
}

function GalleryPreview({ gallery }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {gallery.map((item, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-gray-200 bg-slate-100">
          <div className="relative aspect-[4/3]">
            {item.image ? (
              <img src={item.image} alt="" aria-hidden="true" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                Gambar {index + 1}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-2 py-1.5 text-[11px] font-semibold text-white">
              {item.label || `Label ${index + 1}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsletterPreview({ newsletter }) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-slate-900 px-5 py-6">
      <p className="text-lg font-bold leading-tight text-white">
        {newsletter.title || "Judul newsletter akan tampil di sini"}
      </p>
      <p className="text-sm leading-relaxed text-slate-300">
        {newsletter.description || "Deskripsi langganan akan tampil di sini."}
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="flex min-w-0 flex-1 items-center rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-xs text-slate-400">
          Alamat email perusahaan
        </span>
        <span className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white">Langganan</span>
      </div>
    </div>
  );
}

function WorkspacePreview({ workspace }) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-slate-50 p-4">
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Beranda</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">
          {workspace.greeting || "Sapaan beranda akan tampil di sini"}
        </p>
      </div>
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600">Banner add-on</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">
          {workspace.bannerTitle || "Judul banner akan tampil di sini"}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pelatihan</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">
          {workspace.trainingTitle || "Judul pelatihan akan tampil di sini"}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          {workspace.trainingDescription || "Deskripsi pelatihan akan tampil di sini."}
        </p>
      </div>
    </div>
  );
}

function ContactPreview({ contact }) {
  const whatsapp = getWhatsappUrl(contact.whatsapp);
  const instagram = getInstagramUrl(contact.instagram);
  const cards = [
    whatsapp && { key: "whatsapp", label: "WhatsApp", value: contact.whatsapp, Icon: WhatsappLogo },
    instagram && { key: "instagram", label: "Instagram", value: instagram, Icon: InstagramLogo },
    contact.email && { key: "email", label: "Email", value: contact.email, Icon: EnvelopeSimple },
  ].filter(Boolean);

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Belum ada kontak. Isi minimal satu kolom untuk menampilkan kartunya.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl border border-gray-200 bg-slate-900 p-4 sm:grid-cols-3">
      {cards.map(({ key, label, value, Icon }) => (
        <div key={key} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-sky-300">
            <Icon size={18} weight="fill" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
            <span className="block truncate text-sm text-white">{value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionPreview({ sectionId, draft }) {
  const map = {
    hero: <HeroPreview hero={draft.hero} />,
    closing: <ClosingPreview closing={draft.closing} />,
    faqs: <FaqsPreview faqs={draft.faqs} />,
    testimonial: <TestimonialPreview testimonial={draft.testimonial} />,
    gallery: <GalleryPreview gallery={draft.gallery} />,
    newsletter: <NewsletterPreview newsletter={draft.newsletter} />,
    workspace: <WorkspacePreview workspace={draft.workspace} />,
    contact: <ContactPreview contact={draft.contact} />,
  };
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <Eye size={13} aria-hidden="true" />Pratinjau
      </p>
      {map[sectionId]}
    </div>
  );
}

function SectionCard({ section, dirty, onReset, disabled = false, preview = null, children }) {
  return (
    <section
      id={`appearance-${section.id}`}
      role="tabpanel"
      aria-labelledby={`appearance-tab-${section.id}`}
      className="rounded-xl border border-gray-200 bg-white"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">{section.label}</h2>
            {dirty && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">Belum disimpan</span>}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{section.hint}</p>
        </div>
        <button type="button" className={btnSecondary} onClick={onReset} disabled={disabled}>
          <ArrowCounterClockwise size={15} aria-hidden="true" />Kembalikan bawaan
        </button>
      </header>
      <div className="space-y-5 p-5">
        {preview}
        <fieldset disabled={disabled} className="m-0 min-w-0 space-y-5 border-0 p-0 disabled:opacity-70">
          {children}
        </fieldset>
      </div>
    </section>
  );
}

export default function AppearancePage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [saved, setSaved] = useState(() => ({ content: cloneContent(), publishedAt: null, canEdit: false, configured: false }));
  const [draft, setDraft] = useState(() => cloneContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [confirmation, setConfirmation] = useState(null);
  const dialogRef = useRef(null);
  const noticeRef = useRef(null);

  const baseline = saved.content;
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline);
  const sectionDirty = (id) => JSON.stringify(draft[id]) !== JSON.stringify(saved.content[id]);
  const readOnly = !isSettingsAdmin() || saved.canEdit !== true;

  const applySettings = (settings) => {
    setSaved(settings);
    setDraft(cloneContent(settings.content));
  };

  const load = useCallback(async () => {
    if (!isSettingsAdmin()) {
      setLoadError("Hanya admin yang dapat mengakses pengaturan tampilan.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      applySettings(await getAppearanceSettings());
    } catch (error) {
      setLoadError(extractError(error, "Konten tampilan gagal dimuat dari server."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateHero = (key, value) => setDraft((previous) => ({ ...previous, hero: { ...previous.hero, [key]: value } }));
  const updateClosing = (key, value) => setDraft((previous) => ({ ...previous, closing: { ...previous.closing, [key]: value } }));
  const updateContact = (key, value) => setDraft((previous) => ({ ...previous, contact: { ...previous.contact, [key]: value } }));
  const updateTestimonial = (key, value) =>
    setDraft((previous) => ({ ...previous, testimonial: { ...previous.testimonial, [key]: value } }));
  const updateGallery = (index, key, value) =>
    setDraft((previous) => ({
      ...previous,
      gallery: previous.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  const updateNewsletter = (key, value) =>
    setDraft((previous) => ({ ...previous, newsletter: { ...previous.newsletter, [key]: value } }));
  const updateWorkspace = (key, value) =>
    setDraft((previous) => ({ ...previous, workspace: { ...previous.workspace, [key]: value } }));
  const normalizeContactInstagram = () =>
    setDraft((previous) => {
      const value = previous.contact.instagram;
      if (!value.trim()) return previous;
      const username = legacyInstagramUsername(value);
      if (!username) return previous;
      const url = `https://www.instagram.com/${username}/`;
      if (value === url) return previous;
      return { ...previous, contact: { ...previous.contact, instagram: url } };
    });
  const updateFaq = (index, key, value) =>
    setDraft((previous) => ({
      ...previous,
      faqs: previous.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));

  useEffect(() => {
    const warn = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (confirmation && dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, [confirmation]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    if (type === "error") requestAnimationFrame(() => noticeRef.current?.focus());
  };

  const saveChanges = async () => {
    if (readOnly) {
      showMessage("error", "Akun ini tidak punya izin mengubah tampilan.");
      return;
    }
    const instagramUsername = legacyInstagramUsername(draft.contact.instagram);
    const next =
      instagramUsername && draft.contact.instagram !== `https://www.instagram.com/${instagramUsername}/`
        ? { ...draft, contact: { ...draft.contact, instagram: `https://www.instagram.com/${instagramUsername}/` } }
        : draft;
    if (next !== draft) setDraft(next);
    const errors = validateAppearance(next);
    if (errors.length) {
      showMessage("error", errors.join(" "));
      return;
    }
    setSaving(true);
    try {
      const settings = await publishAppearance(next);
      setSaved((previous) => ({ ...previous, content: settings.content, publishedAt: settings.publishedAt, configured: true }));
      setDraft(cloneContent(settings.content));
      setMessage({ type: "success", text: "Perubahan tersimpan di server dan langsung tampil untuk semua pengunjung." });
    } catch (error) {
      showMessage("error", extractError(error, error.message || "Perubahan gagal disimpan."));
    } finally {
      setSaving(false);
    }
  };

  const confirmAction = async () => {
    const action = confirmation;
    setConfirmation(null);
    if (action.type === "reset") {
      setDraft((previous) => ({ ...previous, [action.section]: getDefaultSection(action.section) }));
      showMessage("success", `${action.title} dikembalikan ke bawaan. Simpan perubahan untuk menerapkannya.`);
    } else if (action.type === "discard") {
      setDraft(cloneContent(baseline));
      setMessage({ type: "", text: "" });
    } else if (action.type === "reload") {
      await load();
      showMessage("success", "Konten terbaru dimuat dari server.");
    } else if (action.type === "delete-faq") {
      setDraft((previous) => ({ ...previous, faqs: previous.faqs.filter((faq) => faq.id !== action.id) }));
    }
  };

  const active = APPEARANCE_SECTIONS.find((section) => section.id === activeSection) || APPEARANCE_SECTIONS[0];
  const faqFull = draft.faqs.length >= APPEARANCE_LIMITS.faqs.items;
  const alertStyle = {
    error: "border-red-200 bg-red-50 text-red-700",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    success: "border-green-200 bg-green-50 text-green-800",
  }[message.type] || "";

  return (
    <div className="min-w-0 p-5 md:p-7">
      <div className="w-full space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900">Appearance</h1>
            {saved.publishedAt && (
              <p className="mt-1 text-xs text-slate-400">
                Terakhir dipublikasikan: {new Date(saved.publishedAt).toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <a href="/" target="_blank" rel="noreferrer" className={btnSecondary}>
            <ArrowSquareOut size={16} aria-hidden="true" />Lihat halaman publik
          </a>
        </header>

        {readOnly && (
          <div role="status" className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm leading-relaxed text-amber-800">
            <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>Akun ini hanya bisa melihat konten. Minta akses edit Appearance ke admin.</span>
          </div>
        )}

        {loadError && (
          <div role="alert" className="flex flex-wrap items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm leading-relaxed text-red-700">
            <WarningCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1">{loadError}</span>
            <button type="button" className={btnSecondary} onClick={load}>
              Coba lagi
            </button>
          </div>
        )}

        {loading && (
          <div role="status" aria-live="polite" className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-slate-500">
            Memuat konten dari server…
          </div>
        )}

        {message.text && (
          <div
            ref={noticeRef}
            tabIndex={-1}
            role={message.type === "error" ? "alert" : "status"}
            className={`flex flex-wrap items-start gap-2.5 rounded-lg border p-3.5 text-sm leading-relaxed outline-none ${alertStyle}`}
          >
            {message.type === "error" ? (
              <WarningCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            ) : message.type === "success" ? (
              <CheckCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <span className="min-w-0 flex-1">{message.text}</span>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-1.5">
          <div role="tablist" aria-label="Bagian tampilan" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
            {APPEARANCE_SECTIONS.map((section) => {
              const Icon = SECTION_ICONS[section.id];
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  id={`appearance-tab-${section.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`appearance-${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="truncate">{section.label}</span>
                  {sectionDirty(section.id) && <span aria-label="belum disimpan" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        <SectionCard
          section={active}
          dirty={sectionDirty(active.id)}
          onReset={() => setConfirmation({ type: "reset", section: active.id, title: active.label })}
          disabled={readOnly || loading}
          preview={<SectionPreview sectionId={active.id} draft={draft} />}
        >
          {active.id === "hero" && (
            <>
              <ContentField
                label="Judul utama"
                value={draft.hero.title}
                maxLength={APPEARANCE_LIMITS.hero.title}
                onChange={(value) => updateHero("title", value)}
                required
                multiline
                hint="Frasa “Dibangun untuk Pertumbuhan” otomatis diberi warna aksen."
              />
              <ContentField
                label="Deskripsi"
                value={draft.hero.description}
                maxLength={APPEARANCE_LIMITS.hero.description}
                onChange={(value) => updateHero("description", value)}
                required
                multiline
              />
              <ContentField
                label="Teks tombol"
                value={draft.hero.buttonText}
                maxLength={APPEARANCE_LIMITS.hero.buttonText}
                onChange={(value) => updateHero("buttonText", value)}
                required
              />
              <ImageField label="Gambar latar hero" value={draft.hero.image} onChange={(value) => updateHero("image", value)} optional />
            </>
          )}

          {active.id === "closing" && (
            <>
              <ContentField
                label="Judul"
                value={draft.closing.title}
                maxLength={APPEARANCE_LIMITS.closing.title}
                onChange={(value) => updateClosing("title", value)}
                required
                multiline
              />
              <ContentField
                label="Deskripsi"
                value={draft.closing.description}
                maxLength={APPEARANCE_LIMITS.closing.description}
                onChange={(value) => updateClosing("description", value)}
                required
                multiline
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ContentField
                  label="Tombol utama"
                  value={draft.closing.buttonText}
                  maxLength={APPEARANCE_LIMITS.closing.buttonText}
                  onChange={(value) => updateClosing("buttonText", value)}
                  required
                />
                <ContentField
                  label="Tombol demo"
                  value={draft.closing.secondaryButtonText}
                  maxLength={APPEARANCE_LIMITS.closing.secondaryButtonText}
                  onChange={(value) => updateClosing("secondaryButtonText", value)}
                  required
                />
              </div>
            </>
          )}

          {active.id === "faqs" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-500">
                  {draft.faqs.length} dari maksimal {APPEARANCE_LIMITS.faqs.items} pertanyaan.
                </p>
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={faqFull}
                  onClick={() =>
                    setDraft((previous) =>
                      previous.faqs.length >= APPEARANCE_LIMITS.faqs.items
                        ? previous
                        : { ...previous, faqs: [...previous.faqs, { id: crypto.randomUUID(), q: "", a: "" }] }
                    )
                  }
                >
                  <Plus size={15} aria-hidden="true" />Tambah FAQ
                </button>
              </div>
              {!draft.faqs.length && (
                <p className="rounded-lg border border-dashed border-gray-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                  Belum ada FAQ. Tambahkan pertanyaan atau kembalikan ke bawaan.
                </p>
              )}
              <div className="space-y-4">
                {draft.faqs.map((item, index) => (
                  <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{index + 1}</span>
                        <h3 className="text-sm font-semibold text-gray-900">FAQ {index + 1}</h3>
                      </div>
                      <button
                        type="button"
                        className={btnDangerOutline}
                        onClick={() => setConfirmation({ type: "delete-faq", id: item.id })}
                        aria-label={`Hapus FAQ ${index + 1}`}
                      >
                        <Trash size={15} aria-hidden="true" />Hapus
                      </button>
                    </div>
                    <div className="space-y-4">
                      <ContentField
                        label="Pertanyaan"
                        value={item.q}
                        maxLength={APPEARANCE_LIMITS.faqs.q}
                        onChange={(value) => updateFaq(index, "q", value)}
                        required
                      />
                      <ContentField
                        label="Jawaban"
                        value={item.a}
                        maxLength={APPEARANCE_LIMITS.faqs.a}
                        onChange={(value) => updateFaq(index, "a", value)}
                        required
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {active.id === "testimonial" && (
            <>
              <p className="rounded-lg bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600">
                Testimoni tampil sebagai satu kutipan besar di halaman publik. Foto berbentuk bulat, jadi gunakan potret persegi.
              </p>
              <ContentField
                label="Kutipan"
                value={draft.testimonial.quote}
                maxLength={APPEARANCE_LIMITS.testimonial.quote}
                onChange={(value) => updateTestimonial("quote", value)}
                required
                multiline
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ContentField
                  label="Nama"
                  value={draft.testimonial.name}
                  maxLength={APPEARANCE_LIMITS.testimonial.name}
                  onChange={(value) => updateTestimonial("name", value)}
                  required
                />
                <ContentField
                  label="Jabatan & perusahaan"
                  value={draft.testimonial.position}
                  maxLength={APPEARANCE_LIMITS.testimonial.position}
                  onChange={(value) => updateTestimonial("position", value)}
                  required
                />
              </div>
              <ImageField
                label="Foto"
                value={draft.testimonial.image}
                onChange={(value) => updateTestimonial("image", value)}
                optional
              />
            </>
          )}

          {active.id === "gallery" && (
            <>
              <p className="rounded-lg bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600">
                Lima gambar galeri di bagian “Pilar Utama”. Rasio paling rapi 4:3 atau 16:10 karena kartu galeri dipotong otomatis.
              </p>
              <div className="space-y-5">
                {draft.gallery.map((item, index) => (
                  <div key={index} className="min-w-0 rounded-lg border border-gray-200 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Gambar {index + 1}</p>
                    <div className="space-y-4">
                      <ContentField
                        label="Label"
                        value={item.label}
                        maxLength={APPEARANCE_LIMITS.gallery.label}
                        onChange={(value) => updateGallery(index, "label", value)}
                        required
                      />
                      <ImageField
                        label={`Gambar ${index + 1}`}
                        value={item.image}
                        onChange={(value) => updateGallery(index, "image", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {active.id === "newsletter" && (
            <>
              <p className="rounded-lg bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600">
                Blok langganan di atas footer halaman publik. Formulir emailnya sendiri tidak diubah dari sini.
              </p>
              <ContentField
                label="Judul"
                value={draft.newsletter.title}
                maxLength={APPEARANCE_LIMITS.newsletter.title}
                onChange={(value) => updateNewsletter("title", value)}
                required
                multiline
              />
              <ContentField
                label="Deskripsi"
                value={draft.newsletter.description}
                maxLength={APPEARANCE_LIMITS.newsletter.description}
                onChange={(value) => updateNewsletter("description", value)}
                multiline
              />
            </>
          )}

          {active.id === "workspace" && (
            <>
              <p className="rounded-lg bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600">
                Teks ini tampil di halaman Beranda setelah pengguna login — bukan di halaman publik.
              </p>
              <ContentField
                label="Sapaan beranda"
                value={draft.workspace.greeting}
                maxLength={APPEARANCE_LIMITS.workspace.greeting}
                onChange={(value) => updateWorkspace("greeting", value)}
                required
                hint="Nama pengguna tetap ditampilkan di baris atas secara otomatis."
              />
              <ContentField
                label="Judul banner add-on"
                value={draft.workspace.bannerTitle}
                maxLength={APPEARANCE_LIMITS.workspace.bannerTitle}
                onChange={(value) => updateWorkspace("bannerTitle", value)}
                required
                multiline
              />
              <ContentField
                label="Judul pelatihan"
                value={draft.workspace.trainingTitle}
                maxLength={APPEARANCE_LIMITS.workspace.trainingTitle}
                onChange={(value) => updateWorkspace("trainingTitle", value)}
                required
              />
              <ContentField
                label="Deskripsi pelatihan"
                value={draft.workspace.trainingDescription}
                maxLength={APPEARANCE_LIMITS.workspace.trainingDescription}
                onChange={(value) => updateWorkspace("trainingDescription", value)}
              />
            </>
          )}

          {active.id === "contact" && (
            <>
              <p className="rounded-lg bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600">
                Kontak ini tampil sebagai kartu berikon di footer halaman publik. Kosongkan salah satu kolom untuk menyembunyikan kartunya.
              </p>
              <ContentField
                label="Nomor WhatsApp"
                value={draft.contact.whatsapp}
                maxLength={APPEARANCE_LIMITS.contact.whatsapp}
                onChange={(value) => updateContact("whatsapp", value)}
                type="tel"
                inputMode="tel"
                placeholder="+62 812-3456-7890"
                hint="Boleh 08…, +62…, atau tautan wa.me."
              />
              <ContentField
                label="Instagram"
                value={draft.contact.instagram}
                maxLength={APPEARANCE_LIMITS.contact.instagram}
                onChange={(value) => updateContact("instagram", value)}
                onBlur={normalizeContactInstagram}
                placeholder="https://www.instagram.com/inotalfinance/"
                hint="Tempel link profil utuh, contoh: https://www.instagram.com/inotalfinance/ — bukan username polos."
                error={
                  draft.contact.instagram.trim() && !getInstagramUrl(draft.contact.instagram)
                    ? "Link profil Instagram belum valid. Format wajib https://www.instagram.com/username/"
                    : ""
                }
              />
              <ContentField
                label="Email"
                value={draft.contact.email}
                maxLength={APPEARANCE_LIMITS.contact.email}
                onChange={(value) => updateContact("email", value)}
                type="email"
                inputMode="email"
                placeholder="halo@inotalfinance.id"
              />
              {(getWhatsappUrl(draft.contact.whatsapp) || getInstagramUrl(draft.contact.instagram) || draft.contact.email) && (
                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                  {getWhatsappUrl(draft.contact.whatsapp) && (
                    <a href={getWhatsappUrl(draft.contact.whatsapp)} target="_blank" rel="noreferrer" className={btnSecondary}>
                      Uji tautan WhatsApp
                    </a>
                  )}
                  {getInstagramUrl(draft.contact.instagram) && (
                    <a href={getInstagramUrl(draft.contact.instagram)} target="_blank" rel="noreferrer" className={btnSecondary}>
                      Uji tautan Instagram
                    </a>
                  )}
                  {draft.contact.email && (
                    <a href={`mailto:${draft.contact.email}`} className={btnSecondary}>
                      Uji tautan email
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </SectionCard>

        <div className="sticky bottom-0 z-10 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`h-2 w-2 rounded-full ${dirty ? "bg-amber-500" : "bg-green-500"}`} aria-hidden="true" />
              {dirty ? "Ada perubahan yang belum disimpan." : "Semua perubahan sudah tersimpan."}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btnSecondary} disabled={!dirty || saving} onClick={() => setConfirmation({ type: "discard" })}>
                Batalkan
              </button>
              <button
                type="button"
                className={btnPrimary}
                disabled={!dirty || saving || readOnly || loading}
                onClick={saveChanges}
              >
                <FloppyDisk size={16} aria-hidden="true" />
                {saving ? "Menyimpan…" : "Simpan perubahan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmation && (
        <dialog
          ref={dialogRef}
          className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-xl border border-gray-200 bg-white p-0 text-gray-900 shadow-xl backdrop:bg-slate-900/55"
          aria-labelledby="appearance-confirm-title"
          aria-describedby="appearance-confirm-description"
          onCancel={() => setConfirmation(null)}
        >
          <div className="space-y-3 p-6">
            <h2 id="appearance-confirm-title" className="text-lg font-semibold">
              {confirmation.type === "reset"
                ? `Kembalikan ${confirmation.title} ke bawaan?`
                : confirmation.type === "discard"
                  ? "Batalkan perubahan?"
                  : confirmation.type === "delete-faq"
                    ? "Hapus FAQ ini?"
                    : "Muat ulang konten?"}
            </h2>
            <p id="appearance-confirm-description" className="text-sm leading-relaxed text-slate-600">
              {confirmation.type === "reset"
                ? "Isi bagian ini akan dikembalikan ke teks bawaan. Perubahan belum diterapkan sebelum kamu menyimpan."
                : confirmation.type === "discard"
                  ? "Semua perubahan yang belum disimpan akan dibuang."
                  : confirmation.type === "delete-faq"
                    ? "Pertanyaan dan jawaban ini akan dihapus dari daftar. Perubahan belum diterapkan sebelum kamu menyimpan."
                    : "Muat konten terbaru dan buang perubahan yang belum disimpan?"}
            </p>
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
            <button type="button" className={btnModalCancel} autoFocus onClick={() => setConfirmation(null)}>
              Tidak, kembali
            </button>
            <button type="button" className={btnModalSubmit} onClick={confirmAction}>
              {confirmation.type === "reset" ? "Kembalikan" : confirmation.type === "discard" ? "Ya, batalkan" : confirmation.type === "delete-faq" ? "Hapus FAQ" : "Muat ulang"}
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
