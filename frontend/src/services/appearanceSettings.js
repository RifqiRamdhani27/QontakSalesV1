import ctaBg from "@/assets/cta.webp";
import galleryImg1 from "@/assets/Accounting-1.webp";
import galleryImg2 from "@/assets/Accounting-2.webp";
import galleryImg3 from "@/assets/Accounting-3.webp";
import galleryImg4 from "@/assets/Accounting-4.webp";
import galleryImg5 from "@/assets/Accounting-5.webp";
import profileRizal from "@/assets/profile-rizal.webp";
import api from "./api";
import { publicApi } from "./settingsApi";

export const APPEARANCE_EVENT = "qontak:appearance-updated";
export const APPEARANCE_CACHE_KEY = "qontak:landing:appearance:cache:v3";
const LEGACY_STORAGE_KEY = "qontak:landing:appearance:v2";
const LEGACY_STORAGE_KEY_V1 = "qontak:landing:appearance:v1";

export const PUBLIC_APPEARANCE_URL = "/landing/appearance/";
export const ADMIN_APPEARANCE_URL = "/settings/appearance/";

export const defaultLandingContent = {
  hero: {
    title: "Jurnal ERP Keuangan Modern. Dibangun untuk Pertumbuhan Bisnis Kamu.",
    description:
      "Kelola pembukuan umum, rekonsiliasi bank instan, pengelolaan produk, dan kepatuhan pajak dalam satu ekosistem terpadu — cepat, akurat, dan berstandar audit global.",
    buttonText: "Mulai Sekarang",
    image: ctaBg,
  },
  closing: {
    title: "Sederhanakan Pembukuan Bisnis Kamu Sekarang.",
    description:
      "Tingkatkan akurasi pembukuan dan percepat pertumbuhan perusahaan dengan Jurnal ERP. Siap pakai dalam hitungan menit tanpa ribet.",
    buttonText: "Mulai Sekarang Gratis",
    secondaryButtonText: "Jadwalkan Demo Korporat",
  },
  faqs: [
    {
      q: "Apakah Jurnal ERP ini sesuai dengan standar akuntansi Indonesia (PSAK)?",
      a: "Ya. Laporan keuangan disusun mengikuti PSAK dan IFRS, termasuk PSAK 71 dan 73, lengkap dengan audit trail digital.",
    },
    {
      q: "Bagaimana keamanan data finansial dan riwayat transaksi perusahaan kami?",
      a: "Data dienkripsi AES-256 saat disimpan dan TLS 1.3 saat dikirim, dilindungi RBAC ketat, serta dicadangkan otomatis setiap hari di multi-region.",
    },
    {
      q: "Berapa lama proses migrasi data dari software akuntansi lama (seperti Excel/SAP/QuickBooks)?",
      a: "Untuk bisnis kecil sampai menengah, migrasi umumnya selesai dalam hitungan hari. Tim kami membantu memetakan COA dan saldo awal.",
    },
    {
      q: "Apakah mendukung multi-cabang dan multi-entitas perusahaan?",
      a: "Ya. Setiap entitas punya buku besar sendiri, dan laporan dapat dikonsolidasikan otomatis termasuk konversi mata uang asing.",
    },
  ].map((faq, index) => ({ ...faq, id: `default-faq-${index + 1}` })),

  contact: {
    whatsapp: "",
    instagram: "",
    email: "",
  },
  testimonial: {
    quote:
      "Sejak beralih ke Inotal Finance, waktu closing pembukuan akhir bulan kami berkurang dari 14 hari menjadi hanya 2 jam. Visibilitas arus kas real-time mengubah cara direksi mengambil keputusan finansial.",
    name: "Rizal Umaris",
    position: "CEO PT Telur Asin Sejahtera",
    image: profileRizal,
  },
  gallery: [
    { image: galleryImg1, label: "Penjualan" },
    { image: galleryImg2, label: "Pembelian" },
    { image: galleryImg3, label: "Jurnal Umum" },
    { image: galleryImg4, label: "Laporan Laba Rugi" },
    { image: galleryImg5, label: "Customer" },
  ],
  newsletter: {
    title: "Dapatkan Insight Finansial & Regulasi Akuntansi Mingguan",
    description:
      "Insight bulanan seputar pembukuan, arus kas, dan regulasi pajak — langsung dari tim finance Jurnal ERP.",
  },
  workspace: {
    greeting: "Aktivitas apa yang ingin Anda lakukan?",
    bannerTitle: "Tingkatkan produktivitas bisnis Anda dengan fitur tambahan Jurnal",
    trainingTitle: "Pelatihan Jurnal gratis",
    trainingDescription: "Pilih pelatihan sesuai kebutuhan Anda.",
  },
};

export const APPEARANCE_LIMITS = {
  imageUrl: 2048,
  imageBytes: 1024 * 1024,
  hero: { title: 120, description: 300, buttonText: 30 },
  closing: { title: 120, description: 300, buttonText: 30, secondaryButtonText: 30 },
  faqs: { items: 8, q: 160, a: 600 },
  contact: { whatsapp: 40, instagram: 100, email: 254 },
  testimonial: { quote: 500, name: 80, position: 100 },
  gallery: { items: 5, label: 40 },
  newsletter: { title: 120, description: 300 },
  workspace: { greeting: 120, bannerTitle: 160, trainingTitle: 80, trainingDescription: 160 },
};

export const APPEARANCE_SECTIONS = [
  { id: "hero", label: "Hero", hint: "Judul, deskripsi, tombol, dan gambar utama." },
  { id: "closing", label: "Ajakan Penutup", hint: "Bagian terakhir sebelum footer." },
  { id: "faqs", label: "FAQ", hint: "Pertanyaan yang sering diajukan pengunjung." },
  { id: "testimonial", label: "Testimoni", hint: "Kutipan, nama, jabatan, dan foto pelanggan." },
  { id: "gallery", label: "Galeri", hint: "Lima gambar galeri beserta labelnya." },
  { id: "newsletter", label: "Newsletter", hint: "Judul dan deskripsi langganan di footer." },
  { id: "workspace", label: "Beranda", hint: "Sapaan, banner add-on, dan judul pelatihan di dalam aplikasi." },
  { id: "contact", label: "Kontak", hint: "WhatsApp, Instagram, dan email di footer." },
];

export function cloneContent(content = defaultLandingContent) {
  return JSON.parse(JSON.stringify(content));
}

function mergeContent(value, defaults) {
  if (Array.isArray(defaults)) {
    return defaults.map((item, index) => mergeContent(Array.isArray(value) ? value[index] : undefined, item));
  }
  if (defaults && typeof defaults === "object") {
    return Object.fromEntries(
      Object.entries(defaults).map(([key, item]) => [key, mergeContent(value?.[key], item)])
    );
  }
  return typeof value === typeof defaults ? value : defaults;
}

function normalizeContent(value) {
  const content = mergeContent(value, defaultLandingContent);
  if (Array.isArray(value?.faqs)) {
    content.faqs = value.faqs
      .filter((faq) => faq && typeof faq === "object")
      .map((faq, index) => ({
        id: typeof faq.id === "string" && faq.id ? faq.id : `faq-${index + 1}`,
        q: typeof faq.q === "string" ? faq.q : "",
        a: typeof faq.a === "string" ? faq.a : "",
      }));
  }
  if (content.contact && typeof content.contact === "object") {
    const username = legacyInstagramUsername(content.contact.instagram);
    content.contact = {
      ...content.contact,
      instagram: username ? `https://www.instagram.com/${username}/` : content.contact.instagram,
    };
  }
  return content;
}

function readCache() {
  try {
    const raw = localStorage.getItem(APPEARANCE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(content) {
  if (!content) return;
  try {
    localStorage.setItem(APPEARANCE_CACHE_KEY, JSON.stringify(content));
  } catch {}
}

export function dropLegacyLocalStorage() {
  for (const key of [LEGACY_STORAGE_KEY, LEGACY_STORAGE_KEY_V1]) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
}

function extractContent(payload) {
  if (!payload || typeof payload !== "object") return null;
  const raw = "content" in payload ? payload.content : payload;
  return raw && typeof raw === "object" ? normalizeContent(raw) : null;
}

export function getPublishedContent() {
  const cached = readCache();
  return cached ? normalizeContent(cached) : cloneContent();
}

export async function refreshPublishedContent() {
  const response = await publicApi.get(PUBLIC_APPEARANCE_URL);
  const content = extractContent(response.data);
  if (!content) {
    try {
      localStorage.removeItem(APPEARANCE_CACHE_KEY);
    } catch {}
    return cloneContent();
  }
  writeCache(content);
  return content;
}

export async function getAppearanceSettings() {
  const response = await api.get(ADMIN_APPEARANCE_URL);
  const stored = extractContent(response.data);
  if (stored) writeCache(stored);
  return {
    content: stored || cloneContent(),
    publishedAt: response.data?.published_at || null,
    canEdit: response.data?.can_edit === true,
    configured: Boolean(stored),
  };
}

export function getDefaultSection(sectionId) {
  return cloneContent(defaultLandingContent[sectionId]);
}

export async function publishAppearance(content) {
  const errors = validateAppearance(content);
  if (errors.length) throw new Error(errors.join(" "));

  const payload = cloneContent(content);
  const response = await api.put(ADMIN_APPEARANCE_URL, { content: payload });
  const stored = extractContent(response.data) || payload;

  writeCache(stored);
  window.dispatchEvent(new Event(APPEARANCE_EVENT));
  return { content: stored, publishedAt: response.data?.published_at || null };
}

export function isSafeImage(value) {
  if (!value) return true;

  if (value.startsWith("data:image/")) return false;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

const INSTAGRAM_HOSTS = ["instagram.com", "www.instagram.com"];
const INSTAGRAM_RESERVED_PATHS = new Set([
  "p", "reel", "reels", "tv", "stories", "explore", "accounts", "direct", "about",
  "legal", "developer", "api", "graphql", "challenge", "emails", "session", "web",
  "privacy", "terms", "help", "directory", "topics", "locations",
]);

function instagramUsernameFromUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  let candidate = raw;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    if (!/^(www\.)?instagram\.com(\/|$)/i.test(candidate)) return "";
    candidate = `https://${candidate}`;
  }
  let url;
  try {
    url = new URL(candidate);
  } catch {
    return "";
  }
  if (!["https:", "http:"].includes(url.protocol)) return "";
  if (!INSTAGRAM_HOSTS.includes(url.hostname.toLowerCase())) return "";
  if (url.username || url.password) return "";
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return "";
  const username = segments[0];
  if (!/^[A-Za-z0-9_.]{1,30}$/.test(username)) return "";
  if (INSTAGRAM_RESERVED_PATHS.has(username.toLowerCase())) return "";
  return username;
}

export function getInstagramUsername(value) {
  return instagramUsernameFromUrl(value);
}

export function getInstagramUrl(value) {
  const username = getInstagramUsername(value);
  return username ? `https://www.instagram.com/${username}/` : "";
}

export function legacyInstagramUsername(value) {
  const direct = instagramUsernameFromUrl(value);
  if (direct) return direct;
  const username = String(value ?? "").trim().replace(/^@/, "");
  return /^[A-Za-z0-9_.]{1,30}$/.test(username) ? username : "";
}

function whatsappDigits(value) {
  if (!value) return "";
  let digits = value.trim();
  const match = digits.match(/^https?:\/\/(?:www\.)?wa\.me\/(\d+)/i);
  if (match) return match[1];
  if (/^https?:/i.test(digits)) return "";
  digits = digits.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  return digits;
}

export function getWhatsappUrl(value) {
  const digits = whatsappDigits(value);
  if (!digits || digits.length < 8 || digits.length > 15) return "";
  return `https://wa.me/${digits}`;
}

export function getWhatsappDisplay(value) {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^https?:/i.test(trimmed)) {
    const digits = whatsappDigits(trimmed);
    return digits ? `+${digits}` : trimmed;
  }
  return trimmed;
}

export function validateAppearance(content) {
  const errors = [];
  const maximum = (value, label, maxLength) => {
    if (value.length > maxLength) errors.push(`${label} maksimal ${maxLength} karakter.`);
  };
  const required = (value, label, maxLength) => {
    if (!value.trim()) errors.push(`${label} wajib diisi.`);
    if (maxLength) maximum(value, label, maxLength);
  };
  const image = (value, label) => {
    if (!isSafeImage(value)) {
      if (value.startsWith("data:image/")) {
        errors.push(`${label}: unggah ulang gambarnya supaya tersimpan sebagai URL, bukan data gambar mentah.`);
        return;
      }
      errors.push(`${label}: gunakan unggahan PNG/JPEG/WebP, path aset, atau URL gambar HTTP/HTTPS.`);
      return;
    }
    if (value) maximum(value, `${label}: URL gambar`, APPEARANCE_LIMITS.imageUrl);
  };

  required(content.hero.title, "Judul hero", APPEARANCE_LIMITS.hero.title);
  required(content.hero.description, "Deskripsi hero", APPEARANCE_LIMITS.hero.description);
  required(content.hero.buttonText, "Teks tombol hero", APPEARANCE_LIMITS.hero.buttonText);
  image(content.hero.image, "Gambar hero");

  required(content.closing.title, "Judul ajakan penutup", APPEARANCE_LIMITS.closing.title);
  required(content.closing.description, "Deskripsi ajakan penutup", APPEARANCE_LIMITS.closing.description);
  required(content.closing.buttonText, "Teks tombol utama", APPEARANCE_LIMITS.closing.buttonText);
  required(content.closing.secondaryButtonText, "Teks tombol demo", APPEARANCE_LIMITS.closing.secondaryButtonText);

  if (content.faqs.length > APPEARANCE_LIMITS.faqs.items) {
    errors.push(`FAQ maksimal ${APPEARANCE_LIMITS.faqs.items} item.`);
  }
  content.faqs.forEach((item, index) => {
    required(item.q, `Pertanyaan FAQ ${index + 1}`, APPEARANCE_LIMITS.faqs.q);
    required(item.a, `Jawaban FAQ ${index + 1}`, APPEARANCE_LIMITS.faqs.a);
  });

  maximum(content.contact.whatsapp, "Nomor WhatsApp", APPEARANCE_LIMITS.contact.whatsapp);
  maximum(content.contact.instagram, "Instagram", APPEARANCE_LIMITS.contact.instagram);
  maximum(content.contact.email, "Email", APPEARANCE_LIMITS.contact.email);
  if (content.contact.whatsapp && !getWhatsappUrl(content.contact.whatsapp)) {
    errors.push("Nomor WhatsApp belum valid. Gunakan nomor Indonesia (08… atau +62…) atau link wa.me.");
  }
  if (content.contact.instagram && !getInstagramUrl(content.contact.instagram)) {
    errors.push(
      "Instagram harus berupa link profil instagram.com, contoh: https://www.instagram.com/namakamu/ — username polos tidak diterima."
    );
  }
  if (content.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.contact.email)) {
    errors.push("Alamat email kontak belum valid.");
  }

  required(content.testimonial.quote, "Kutipan testimoni", APPEARANCE_LIMITS.testimonial.quote);
  required(content.testimonial.name, "Nama testimoni", APPEARANCE_LIMITS.testimonial.name);
  required(content.testimonial.position, "Jabatan testimoni", APPEARANCE_LIMITS.testimonial.position);
  image(content.testimonial.image, "Foto testimoni");

  if (content.gallery.length !== APPEARANCE_LIMITS.gallery.items) {
    errors.push(`Galeri harus berisi tepat ${APPEARANCE_LIMITS.gallery.items} gambar.`);
  }
  content.gallery.forEach((item, index) => {
    required(item.label, `Label galeri ${index + 1}`, APPEARANCE_LIMITS.gallery.label);
    required(item.image, `Gambar galeri ${index + 1}`);
    image(item.image, `Gambar galeri ${index + 1}`);
  });

  required(content.newsletter.title, "Judul newsletter", APPEARANCE_LIMITS.newsletter.title);
  maximum(content.newsletter.description, "Deskripsi newsletter", APPEARANCE_LIMITS.newsletter.description);

  required(content.workspace.greeting, "Sapaan beranda", APPEARANCE_LIMITS.workspace.greeting);
  required(content.workspace.bannerTitle, "Judul banner add-on", APPEARANCE_LIMITS.workspace.bannerTitle);
  required(content.workspace.trainingTitle, "Judul pelatihan", APPEARANCE_LIMITS.workspace.trainingTitle);
  maximum(content.workspace.trainingDescription, "Deskripsi pelatihan", APPEARANCE_LIMITS.workspace.trainingDescription);

  return [...new Set(errors)];
}
