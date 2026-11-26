import ctaBg from "@/assets/cta.webp";
import galleryImg1 from "@/assets/Accounting-1.webp";
import galleryImg2 from "@/assets/Accounting-2.webp";
import galleryImg3 from "@/assets/Accounting-3.webp";
import galleryImg4 from "@/assets/Accounting-4.webp";
import galleryImg5 from "@/assets/Accounting-5.webp";
import profileRizal from "@/assets/profile-rizal.webp";
import imgStartup from "@/assets/imgStartup.webp";
import imgCorporate from "@/assets/imgCorporate.webp";
import imgAkuntan from "@/assets/imgAkuntan.webp";
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
  testimonials: [
    {
      id: "testi-1",
      quote:
        "Sejak beralih ke Inotal Finance, waktu closing pembukuan akhir bulan kami berkurang dari 14 hari menjadi hanya 2 jam. Visibilitas arus kas real-time mengubah cara direksi mengambil keputusan finansial.",
      name: "Rizal Umaris",
      position: "CEO PT Telur Asin Sejahtera",
      image: profileRizal,
    },
  ],
  testimonial: {
    quote:
      "Sejak beralih ke Inotal Finance, waktu closing pembukuan akhir bulan kami berkurang dari 14 hari menjadi hanya 2 jam. Visibilitas arus kas real-time mengubah cara direksi mengambil keputusan finansial.",
    name: "Rizal Umaris",
    position: "CEO PT Telur Asin Sejahtera",
    image: profileRizal,
  },
  plans: [
    {
      id: "plan-1",
      name: "Starter",
      price: "Rp 0",
      tagline: "Untuk usaha rintisan",
      features: ["1 entitas & 3 pengguna", "Jurnal umum & buku besar", "Laporan laba rugi dasar"],
      cta: "Mulai Gratis",
      action: "register",
      popular: false,
    },
    {
      id: "plan-2",
      name: "Bisnis",
      price: "Rp 349.000",
      tagline: "Untuk tim finance yang bertumbuh",
      features: ["Entitas & pengguna tanpa batas", "Rekonsiliasi Bank API & e-Faktur", "Laporan keuangan lanjutan"],
      cta: "Upgrade ke Bisnis",
      action: "register",
      popular: true,
    },
    {
      id: "plan-3",
      name: "Korporasi",
      price: "Rp 899.000",
      tagline: "Untuk grup perusahaan",
      features: ["Konsolidasi multi-cabang", "SSO & audit trail lanjutan", "Account manager khusus"],
      cta: "Hubungi Sales",
      action: "contact",
      popular: false,
    },
  ],
  solutions: [
    {
      id: "sol-1",
      image: imgStartup,
      tag: "Startup & Agresif",
      title: "Startup & Skala Cepat",
      desc: "Pembukuan kas harian otomatis, pemantauan runway dan burn rate real-time, serta integrasi langsung payment gateway e-commerce.",
      dark: false,
    },
    {
      id: "sol-2",
      image: imgCorporate,
      tag: "Multi-Entitas",
      title: "Korporasi & Multi-Cabang",
      desc: "Buku besar multi-entitas, konsolidasi mata uang asing otomatis, alur persetujuan PO/Invoice berjenjang, dan tata kelola grup.",
      dark: false,
    },
    {
      id: "sol-3",
      image: imgAkuntan,
      tag: "KAP & Pajak",
      title: "Akuntan Publik & Konsultan Pajak",
      desc: "Laporan keuangan standar PSAK/IFRS, audit trail digital anti-manipulasi, serta integrasi e-Faktur dan pelaporan pajak langsung.",
      dark: true,
    },
  ],
  steps: [
    { id: "step-1", title: "Hubungkan Akun Bank", desc: "Koneksikan rekening bank korporat dan payment gateway melalui integrasi API terenkripsi 256-bit berstandar perbankan.", badge: "API Terenkripsi 256-bit" },
    { id: "step-2", title: "Kustomisasi Bagan Akun", desc: "Sesuaikan Chart of Accounts (COA), multi-mata uang, dan struktur cost center dengan template standar industri kamu.", badge: "Standar PSAK / Kustom" },
    { id: "step-3", title: "Otomasi Jurnal Transaksi", desc: "Setiap transaksi masuk, keluar, dan faktur klien dijurnal secara otomatis ke debit/kredit tanpa entri manual.", badge: "Entri Ganda Otomatis" },
    { id: "step-4", title: "Terbitkan Laporan Neraca", desc: "Hasilkan laporan neraca, laba rugi, dan arus kas komprehensif dalam satu klik, siap dibagikan ke dewan direksi.", badge: "Laporan Real-Time" },
  ],
  security: [
    { id: "sec-1", icon: "Lock", title: "Enkripsi Tingkat Perbankan (AES-256)", desc: "Seluruh data pembukuan dan kredensial bank dienkripsi saat transit (TLS 1.3) maupun saat istirahat dengan enkripsi AES-256." },
    { id: "sec-2", icon: "ShieldCheck", title: "Sertifikasi SOC-2 & ISO 27001", desc: "Infrastruktur cloud teraudit secara berkala untuk memenuhi standar kepatuhan tata kelola dan privasi informasi korporasi global." },
    { id: "sec-3", icon: "CloudArrowUp", title: "Cadangan Data Otomatis Harian", desc: "Snapshot data buku besar dicadangkan di multi-region redundan sehingga kontinuitas bisnis tetap terjamin 99,99% SLA." },
    { id: "sec-4", icon: "Users", title: "Hak Akses Berbasis Peran (RBAC) Ketat", desc: "Atur wewenang persetujuan transfer, akses viewing laporan, dan modifikasi jurnal berdasar jabatan staf finance secara granular." },
  ],
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
  testimonial: { items: 10, quote: 500, name: 80, position: 100 },
  gallery: { items: 5, label: 40 },
  newsletter: { title: 120, description: 300 },
  workspace: { greeting: 120, bannerTitle: 160, trainingTitle: 80, trainingDescription: 160 },
  plans: { items: 6, name: 40, price: 30, tagline: 100, featureItems: 10, feature: 100, cta: 30, action: 30 },
  solutions: { items: 6, tag: 40, title: 80, desc: 300 },
  steps: { items: 6, title: 80, desc: 300, badge: 50 },
  security: { items: 6, title: 80, desc: 300, icon: 40 },
};

export const APPEARANCE_SECTIONS = [
  { id: "hero", label: "Hero", hint: "Judul, deskripsi, tombol, dan gambar utama." },
  { id: "plans", label: "Daftar Paket", hint: "Paket harga langganan, checklist fitur, dan tombol aksi." },
  { id: "testimonial", label: "Testimoni", hint: "Daftar ulasan & testimoni pelanggan (slider multi-orang)." },
  { id: "solutions", label: "Solusi Industri", hint: "Kartu solusi segmen bisnis (Startup, Korporasi, KAP)." },
  { id: "steps", label: "Alur Kerja", hint: "Langkah-langkah alur pembukuan dan integrasi sistem." },
  { id: "security", label: "Keamanan", hint: "Poin-poin sertifikasi & keamanan tingkat perbankan." },
  { id: "gallery", label: "Galeri", hint: "Lima gambar galeri produk beserta labelnya." },
  { id: "faqs", label: "FAQ", hint: "Pertanyaan yang sering diajukan pengunjung." },
  { id: "closing", label: "Ajakan Penutup", hint: "Bagian ajakan terakhir sebelum footer." },
  { id: "newsletter", label: "Newsletter", hint: "Judul dan deskripsi formulir langganan berita." },
  { id: "workspace", label: "Beranda", hint: "Sapaan, banner add-on, dan pelatihan di dalam aplikasi." },
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
  if (Array.isArray(value?.plans)) {
    content.plans = value.plans
      .filter((p) => p && typeof p === "object")
      .map((p, index) => ({
        id: typeof p.id === "string" && p.id ? p.id : `plan-${index + 1}`,
        name: typeof p.name === "string" ? p.name : "",
        price: typeof p.price === "string" ? p.price : "",
        tagline: typeof p.tagline === "string" ? p.tagline : "",
        features: Array.isArray(p.features) ? p.features.map(String) : [],
        cta: typeof p.cta === "string" ? p.cta : "Mulai",
        action: typeof p.action === "string" ? p.action : "register",
        popular: Boolean(p.popular),
      }));
  }
  if (Array.isArray(value?.testimonials)) {
    content.testimonials = value.testimonials
      .filter((t) => t && typeof t === "object")
      .map((t, index) => ({
        id: typeof t.id === "string" && t.id ? t.id : `testi-${index + 1}`,
        quote: typeof t.quote === "string" ? t.quote : "",
        name: typeof t.name === "string" ? t.name : "",
        position: typeof t.position === "string" ? t.position : "",
        image: typeof t.image === "string" ? t.image : "",
      }));
    if (content.testimonials.length > 0) {
      content.testimonial = content.testimonials[0];
    }
  } else if (value?.testimonial && typeof value.testimonial === "object") {
    content.testimonials = [
      {
        id: "testi-1",
        quote: typeof value.testimonial.quote === "string" ? value.testimonial.quote : "",
        name: typeof value.testimonial.name === "string" ? value.testimonial.name : "",
        position: typeof value.testimonial.position === "string" ? value.testimonial.position : "",
        image: typeof value.testimonial.image === "string" ? value.testimonial.image : "",
      },
    ];
  }
  if (Array.isArray(value?.solutions)) {
    content.solutions = value.solutions
      .filter((s) => s && typeof s === "object")
      .map((s, index) => ({
        id: typeof s.id === "string" && s.id ? s.id : `sol-${index + 1}`,
        tag: typeof s.tag === "string" ? s.tag : "",
        title: typeof s.title === "string" ? s.title : "",
        desc: typeof s.desc === "string" ? s.desc : "",
        image: typeof s.image === "string" ? s.image : "",
        dark: Boolean(s.dark),
      }));
  }
  if (Array.isArray(value?.steps)) {
    content.steps = value.steps
      .filter((st) => st && typeof st === "object")
      .map((st, index) => ({
        id: typeof st.id === "string" && st.id ? st.id : `step-${index + 1}`,
        title: typeof st.title === "string" ? st.title : "",
        desc: typeof st.desc === "string" ? st.desc : "",
        badge: typeof st.badge === "string" ? st.badge : "",
      }));
  }
  if (Array.isArray(value?.security)) {
    content.security = value.security
      .filter((sec) => sec && typeof sec === "object")
      .map((sec, index) => ({
        id: typeof sec.id === "string" && sec.id ? sec.id : `sec-${index + 1}`,
        title: typeof sec.title === "string" ? sec.title : "",
        desc: typeof sec.desc === "string" ? sec.desc : "",
        icon: typeof sec.icon === "string" ? sec.icon : "ShieldCheck",
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
      errors.push(`${label}: gunakan unggahan PNG/JPEG/WebP, lokasi aset, atau URL gambar HTTP/HTTPS.`);
      return;
    }
    if (value) maximum(value, `${label}: URL gambar`, APPEARANCE_LIMITS.imageUrl);
  };

  required(content.hero.title, "Judul utama", APPEARANCE_LIMITS.hero.title);
  required(content.hero.description, "Deskripsi bagian utama", APPEARANCE_LIMITS.hero.description);
  required(content.hero.buttonText, "Teks tombol utama", APPEARANCE_LIMITS.hero.buttonText);
  image(content.hero.image, "Gambar utama");

  required(content.closing.title, "Judul ajakan penutup", APPEARANCE_LIMITS.closing.title);
  required(content.closing.description, "Deskripsi ajakan penutup", APPEARANCE_LIMITS.closing.description);
  required(content.closing.buttonText, "Teks tombol utama", APPEARANCE_LIMITS.closing.buttonText);
  required(content.closing.secondaryButtonText, "Teks tombol demo", APPEARANCE_LIMITS.closing.secondaryButtonText);

  if (content.faqs.length > APPEARANCE_LIMITS.faqs.items) {
    errors.push(`Jumlah pertanyaan maksimal ${APPEARANCE_LIMITS.faqs.items}.`);
  }
  content.faqs.forEach((item, index) => {
    required(item.q, `Pertanyaan ${index + 1}`, APPEARANCE_LIMITS.faqs.q);
    required(item.a, `Jawaban ${index + 1}`, APPEARANCE_LIMITS.faqs.a);
  });

  maximum(content.contact.whatsapp, "Nomor WhatsApp", APPEARANCE_LIMITS.contact.whatsapp);
  maximum(content.contact.instagram, "Instagram", APPEARANCE_LIMITS.contact.instagram);
  maximum(content.contact.email, "Email", APPEARANCE_LIMITS.contact.email);
  if (content.contact.whatsapp && !getWhatsappUrl(content.contact.whatsapp)) {
    errors.push("Nomor WhatsApp tidak valid. Gunakan nomor Indonesia (08… atau +62…) atau tautan wa.me.");
  }
  if (content.contact.instagram && !getInstagramUrl(content.contact.instagram)) {
    errors.push(
      "Instagram harus berupa tautan profil instagram.com, misalnya: https://www.instagram.com/namakamu/ — bukan hanya nama pengguna."
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

  required(content.newsletter.title, "Judul buletin", APPEARANCE_LIMITS.newsletter.title);
  maximum(content.newsletter.description, "Deskripsi buletin", APPEARANCE_LIMITS.newsletter.description);

  required(content.workspace.greeting, "Sapaan beranda", APPEARANCE_LIMITS.workspace.greeting);
  required(content.workspace.bannerTitle, "Judul promosi fitur tambahan", APPEARANCE_LIMITS.workspace.bannerTitle);
  required(content.workspace.trainingTitle, "Judul pelatihan", APPEARANCE_LIMITS.workspace.trainingTitle);
  maximum(content.workspace.trainingDescription, "Deskripsi pelatihan", APPEARANCE_LIMITS.workspace.trainingDescription);

  if (Array.isArray(content.plans)) {
    if (content.plans.length > APPEARANCE_LIMITS.plans.items) {
      errors.push(`Daftar paket maksimal ${APPEARANCE_LIMITS.plans.items} item.`);
    }
    content.plans.forEach((item, index) => {
      required(item.name || "", `Nama paket ${index + 1}`, APPEARANCE_LIMITS.plans.name);
      required(item.price || "", `Harga paket ${index + 1}`, APPEARANCE_LIMITS.plans.price);
      maximum(item.tagline || "", `Tagline paket ${index + 1}`, APPEARANCE_LIMITS.plans.tagline);
      required(item.cta || "", `Tombol CTA paket ${index + 1}`, APPEARANCE_LIMITS.plans.cta);
    });
  }

  if (Array.isArray(content.testimonials)) {
    if (content.testimonials.length > APPEARANCE_LIMITS.testimonial.items) {
      errors.push(`Testimoni maksimal ${APPEARANCE_LIMITS.testimonial.items} item.`);
    }
    content.testimonials.forEach((item, index) => {
      required(item.quote || "", `Kutipan testimoni ${index + 1}`, APPEARANCE_LIMITS.testimonial.quote);
      required(item.name || "", `Nama testimoni ${index + 1}`, APPEARANCE_LIMITS.testimonial.name);
      required(item.position || "", `Jabatan testimoni ${index + 1}`, APPEARANCE_LIMITS.testimonial.position);
      image(item.image, `Foto testimoni ${index + 1}`);
    });
  }

  if (Array.isArray(content.solutions)) {
    if (content.solutions.length > APPEARANCE_LIMITS.solutions.items) {
      errors.push(`Solusi industri maksimal ${APPEARANCE_LIMITS.solutions.items} item.`);
    }
    content.solutions.forEach((item, index) => {
      maximum(item.tag || "", `Tag solusi ${index + 1}`, APPEARANCE_LIMITS.solutions.tag);
      required(item.title || "", `Judul solusi ${index + 1}`, APPEARANCE_LIMITS.solutions.title);
      required(item.desc || "", `Deskripsi solusi ${index + 1}`, APPEARANCE_LIMITS.solutions.desc);
      image(item.image, `Gambar solusi ${index + 1}`);
    });
  }

  if (Array.isArray(content.steps)) {
    if (content.steps.length > APPEARANCE_LIMITS.steps.items) {
      errors.push(`Alur langkah maksimal ${APPEARANCE_LIMITS.steps.items} item.`);
    }
    content.steps.forEach((item, index) => {
      required(item.title || "", `Judul langkah ${index + 1}`, APPEARANCE_LIMITS.steps.title);
      required(item.desc || "", `Deskripsi langkah ${index + 1}`, APPEARANCE_LIMITS.steps.desc);
      maximum(item.badge || "", `Badge langkah ${index + 1}`, APPEARANCE_LIMITS.steps.badge);
    });
  }

  if (Array.isArray(content.security)) {
    if (content.security.length > APPEARANCE_LIMITS.security.items) {
      errors.push(`Poin keamanan maksimal ${APPEARANCE_LIMITS.security.items} item.`);
    }
    content.security.forEach((item, index) => {
      required(item.title || "", `Judul keamanan ${index + 1}`, APPEARANCE_LIMITS.security.title);
      required(item.desc || "", `Deskripsi keamanan ${index + 1}`, APPEARANCE_LIMITS.security.desc);
    });
  }

  return [...new Set(errors)];
}
