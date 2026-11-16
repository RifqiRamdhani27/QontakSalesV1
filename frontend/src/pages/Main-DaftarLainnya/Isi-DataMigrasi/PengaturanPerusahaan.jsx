import { useState, useRef, useEffect, createContext, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const DATA_MIGRASI_PATH = "/data-migrasi";
const DAFTAR_AKUN_PATH = "/master-data/akun";
const DATA_PRODUK_PATH = "/master-data/produk";
const DATA_KONTAK_PATH = "/master-data/kontak";
const DATA_PENJUALAN_PATH = "/transaksi/data-penjualan";
const DATA_PEMBELIAN_PATH = "/transaksi/data-pembelian";
const DATA_BIAYA_PATH = "/transaksi/biaya";

const BRAND = "#009ee2";
const BRAND_HOVER = "#008cd6";

const LIGHT_T = {
  bg: "#ffffff",
  text: "#26292c",
  headerBg: "#ffffff",
  headerBorder: "#e5e7eb",
  headerTitle: "#111827",
  sidebarBg: "#ffffff",
  sidebarBorder: "#e2e8f0",
  navText: "#374151",
  navActiveBg: BRAND,
  navActiveText: "#ffffff",
  navHover: "#f9fafb",
  navIcon: "#d1d5db",
  navLabel: "#1f2937",
  navChevron: "#6b7280",
  brand: BRAND,
  brandHover: BRAND_HOVER,
  badgeText: "#ffffff",
  pageTitle: "#1f2937",
  pageSub: "#6b7280",
  heroBg: BRAND,
  heroBorder: "none",
  heroIconFill: BRAND,
  ctaBg: "#ffffff",
  ctaBgHover: "#f9fafb",
  ctaText: BRAND,
  cardBg: "#ffffff",
  cardBorder: "#dce3ec",
  cardHeadBorder: "#eef2f6",
  cardTitle: "#1f2937",
  cardSub: "#6b7280",
  itemBorder: "#edf1f5",
  itemHover: "#fafbfc",
  itemLabel: "#1f2937",
  check: "#d1d5db",
  summaryIcon: "#9ca3af",
  summaryBtnBg: "#ffffff",
  summaryBtnBorder: "#d1d5db",
  summaryBtnText: "#9ca3af",
  summaryBtnBorderHover: "#9ca3af",
  summaryBtnTextHover: "#6b7280",
  inputLine: "#cfe0dc",
  dashBorder: "#cbd5e1",
  hintText: "#d1d5db",
  overlay: "rgba(0, 0, 0, 0.5)",
  saveBg: "#5cb85c",
  saveBgHover: "#4cae4c",
  saveBorder: "#4cae4c",
  saveText: "#ffffff",
  heroDeco: "#ffffff",
  heroDecoOpacity: 0.2,
  heroTitle: "#ffffff",
  heroText: "rgba(255,255,255,0.95)",
  dotActive: "#ffffff",
  dotIdle: "rgba(255,255,255,0.5)",
};

const DARK_T = {
  bg: "#121212",
  text: "#e2e8f0",
  headerBg: "#121212",
  headerBorder: "#3a3326",
  headerTitle: "#f8fafc",
  sidebarBg: "#121212",
  sidebarBorder: "#3a3326",
  navText: "#cbd5e1",
  navActiveBg: "#E5B85C",
  navActiveText: "#121212",
  navHover: "#262522",
  navIcon: "#4b5563",
  navLabel: "#e2e8f0",
  navChevron: "#94a3b8",
  brand: "#E5B85C",
  brandHover: "#f0c978",
  badgeText: "#121212",
  pageTitle: "#f8fafc",
  pageSub: "#94a3b8",
  heroBg: "linear-gradient(135deg, #3a2a0b 0%, #241a08 55%, #1a140a 100%)",
  heroBorder: "1px solid rgba(222,166,54,0.3)",
  heroIconFill: "#2a1d08",
  ctaBg: "#E5B85C",
  ctaBgHover: "#f0c978",
  ctaText: "#121212",
  cardBg: "#1a1a19",
  cardBorder: "#634f27",
  cardHeadBorder: "#3a3326",
  cardTitle: "#f8fafc",
  cardSub: "#94a3b8",
  itemBorder: "#3a3326",
  itemHover: "#262522",
  itemLabel: "#e2e8f0",
  check: "#4b5563",
  summaryIcon: "#94a3b8",
  summaryBtnBg: "#262626",
  summaryBtnBorder: "#634f27",
  summaryBtnText: "#94a3b8",
  summaryBtnBorderHover: "#E5B85C",
  summaryBtnTextHover: "#E5B85C",
  inputLine: "#634f27",
  dashBorder: "#634f27",
  hintText: "#4b5563",
  overlay: "rgba(0, 0, 0, 0.7)",
  saveBg: "#E5B85C",
  saveBgHover: "#f0c978",
  saveBorder: "#E5B85C",
  saveText: "#121212",
  heroDeco: "#E5B85C",
  heroDecoOpacity: 0.12,
  heroTitle: "#E5B85C",
  heroText: "#e2e8f0",
  dotActive: "#E5B85C",
  dotIdle: "rgba(229,184,92,0.35)",
};

const ThemeCtx = createContext(LIGHT_T);

function CheckCircleIcon({ size = 16 }) {
  const t = useContext(ThemeCtx);
  return (
    <svg style={{ width: `${size}px`, height: `${size}px`, color: t.navIcon, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  const t = useContext(ThemeCtx);
  return (
    <svg
      style={{ width: "14px", height: "14px", color: t.navChevron, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
    >
      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FormRow({ label, children, tall }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: tall ? "14px" : "12px" }}>
      <label style={{ width: "243px", flexShrink: 0, fontSize: "13px", fontWeight: 600, color: t.cardSub, paddingTop: "8px" }}>{label}</label>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default function PengaturanPerusahaan() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light"
  );

  useEffect(() => {
    const sync = () => setThemeMode(localStorage.getItem("app_theme") || "light");
    window.addEventListener("themeChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("themeChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isDark = themeMode === "dark";
  const t = isDark ? DARK_T : LIGHT_T;

  const lineInputStyle = {
    width: "100%", boxSizing: "border-box", fontSize: "13px", color: t.itemLabel, padding: "6px 12px 6px 12px",
    border: "none", borderBottom: `1px solid ${t.inputLine}`, borderRadius: 0, outline: "none",
    backgroundColor: "transparent", fontFamily: "inherit", display: "block",
  };

  const [masterOpen, setMasterOpen] = useState(false);
  const [transaksiOpen, setTransaksiOpen] = useState(false);

  const EMPTY_FORM = {
    logoPreview: "",
    tampilkanLogo: false,
    nama: "Bottom Group",
    alamat: "",
    alamatPengiriman: "",
    telepon: "+6283184710121",
    fax: "",
    npwp: "",
  };
  const [showModal, setShowModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(EMPTY_FORM);
  const [form, setForm] = useState(EMPTY_FORM);
  const fileInputRef = useRef(null);

  const openModal = () => {
    setForm(companyInfo);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleSave = () => {
    setCompanyInfo(form);
    setShowModal(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleChange("logoPreview", ev.target.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => { if (e.key === "Escape") setShowModal(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [helpHover, setHelpHover] = useState(false);
  const [playHover, setPlayHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [saveHover, setSaveHover] = useState(false);
  const [backHover, setBackHover] = useState(false);

  const childItemStyle = {
    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px 10px 28px", fontSize: "12.5px",
    color: t.navLabel, textDecoration: "none", cursor: "pointer", transition: "background-color 0.15s ease",
  };

  const hoverOn = (e) => { e.currentTarget.style.backgroundColor = t.navHover; };
  const hoverOff = (e) => { e.currentTarget.style.backgroundColor = "transparent"; };

  const renderChild = (label, path) => (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); navigate(path); }}
      style={childItemStyle}
      onMouseEnter={hoverOn}
      onMouseLeave={hoverOff}
    >
      <CheckCircleIcon />
      <span>{label}</span>
    </a>
  );

  const inactiveSectionStyle = {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px",
    background: "none", border: "none", color: t.navText, fontSize: "12.5px", cursor: "pointer", textAlign: "left",
  };

  return (
    <ThemeCtx.Provider value={t}>
      <div
        style={{
          margin: isFullscreen ? 0 : "-24px",
          width: isFullscreen ? "100%" : "calc(100% + 48px)",
          minHeight: "100vh",
          backgroundColor: t.bg,
          display: "flex",
          color: t.text,
          colorScheme: isDark ? "dark" : "normal",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <aside style={{ width: "200px", backgroundColor: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}`, flexShrink: 0, display: "flex", flexDirection: "column", paddingTop: "12px" }}>
          <nav style={{ width: "100%", fontSize: "12px" }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate(DATA_MIGRASI_PATH); }}
              style={{ display: "block", padding: "8px 16px", fontSize: "13px", lineHeight: 1.35, textDecoration: "none", backgroundColor: "transparent", color: t.navText, fontWeight: 400 }}
            >
              Beranda
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ display: "block", padding: "10px 16px 10px 36px", fontSize: "12.5px", lineHeight: 1.25, textDecoration: "none", backgroundColor: t.navActiveBg, color: t.navActiveText, fontWeight: 600 }}
            >
              Pengaturan<br />Perusahaan
            </a>

            <button
              type="button"
              onClick={() => setMasterOpen((prev) => !prev)}
              style={inactiveSectionStyle}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircleIcon />
                <span style={{ fontWeight: 400, color: t.navLabel }}>Master Data</span>
              </div>
              <ChevronIcon open={masterOpen} />
            </button>

            {masterOpen && (
              <div>
                {renderChild("Daftar Akun dan Saldo Awal", DAFTAR_AKUN_PATH)}
                {renderChild("Data Produk", DATA_PRODUK_PATH)}
                {renderChild("Data Kontak", DATA_KONTAK_PATH)}
              </div>
            )}

            <button
              type="button"
              onClick={() => setTransaksiOpen((prev) => !prev)}
              style={inactiveSectionStyle}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircleIcon />
                <span style={{ fontWeight: 400, color: t.navLabel }}>Transaksi</span>
              </div>
              <ChevronIcon open={transaksiOpen} />
            </button>

            {transaksiOpen && (
              <div>
                {renderChild("Data Penjualan", DATA_PENJUALAN_PATH)}
                {renderChild("Data Pembelian", DATA_PEMBELIAN_PATH)}
                {renderChild("Data Biaya", DATA_BIAYA_PATH)}
              </div>
            )}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: "24px 36px", boxSizing: "border-box", backgroundColor: t.bg, minWidth: 0 }}>
          <header style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: t.pageTitle, letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>
              Pengaturan Perusahaan
            </h1>
            <p style={{ fontSize: "13px", color: t.pageSub, margin: "4px 0 0 0" }}>
              Informasi perusahaan Anda akan ditampilkan pada faktur dan laporan Anda.
            </p>
          </header>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: t.cardTitle, margin: 0 }}>Cara Mengisi Informasi Perusahaan</h2>
            <button
              type="button"
              aria-label="Bantuan Informasi Perusahaan"
              onMouseEnter={() => setHelpHover(true)}
              onMouseLeave={() => setHelpHover(false)}
              style={{
                width: "26px", height: "26px", borderRadius: "4px", border: `1px solid ${t.brand}`, color: t.brand, cursor: "pointer",
                backgroundColor: helpHover ? t.navHover : t.cardBg, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background-color 0.15s ease", padding: 0,
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1, paddingBottom: "2px" }}>?</span>
            </button>
          </div>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px", marginBottom: "24px" }}>
            <div style={{ height: "210px", borderRadius: "6px", border: `1px solid ${t.cardBorder}`, overflow: "hidden", display: "flex" }}>
              <div style={{ width: "66%", background: t.heroBg, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", userSelect: "none", boxSizing: "border-box" }}>
                <div style={{ fontSize: "13px", fontWeight: 400, color: t.heroTitle }}>
                  <span style={{ fontWeight: 500 }}>Jurnal</span>  |  <span>Tutorial</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "24px", paddingRight: "4px" }}>
                  <div>
                    <div style={{ color: t.heroTitle, fontSize: "19px", fontWeight: 400, lineHeight: 1.25 }}>Settings:</div>
                    <div style={{ color: t.heroTitle, fontSize: "19px", fontWeight: 400, lineHeight: 1.25, marginTop: "2px" }}>Profil Perusahaan</div>
                  </div>
                  <button
                    type="button"
                    aria-label="Putar Video Tutorial"
                    onMouseEnter={() => setPlayHover(true)}
                    onMouseLeave={() => setPlayHover(false)}
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%", backgroundColor: t.ctaBg, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "8px", padding: 0,
                      boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.15)", transform: playHover ? "scale(1.05)" : "scale(1)", transition: "transform 0.15s ease",
                    }}
                  >
                    <svg style={{ width: "16px", height: "16px", color: t.ctaText, fill: "currentColor", transform: "translateX(2px)" }} viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                style={{
                  width: "34%", backgroundColor: t.cardBg, padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                  alignItems: "center", userSelect: "none", borderLeft: `1px solid ${t.cardHeadBorder}`, boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <svg style={{ width: "20px", height: "24px" }} fill="none" viewBox="0 0 24 28">
                    <path d="M12 2L2 7.7v12.6L12 26l10-5.7V7.7L12 2z" stroke="#00b4a7" strokeLinejoin="round" strokeWidth="3" />
                    <path d="M8 11.5v6a4 4 0 008 0v-6" stroke="#00b4a7" strokeLinecap="round" strokeWidth="2.5" />
                  </svg>
                  <span style={{ color: t.cardTitle, fontWeight: 700, letterSpacing: "0.05em", fontSize: "14px" }}>JURNAL</span>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <svg style={{ width: "68px", height: "68px", color: t.brand, fill: "currentColor" }} viewBox="0 0 24 24">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                </div>
              </div>
            </div>

            <div
              style={{
                height: "210px", borderRadius: "6px", background: t.heroBg, border: t.heroBorder, padding: "24px", display: "flex", flexDirection: "column",
                justifyContent: "space-between", position: "relative", overflow: "hidden", color: t.heroTitle, userSelect: "none", boxSizing: "border-box",
              }}
            >
              <div style={{ position: "absolute", right: "-24px", bottom: "-40px", opacity: t.heroDecoOpacity, pointerEvents: "none", transform: "rotate(-8deg)" }}>
                <svg style={{ width: "256px", height: "256px" }} fill="none" viewBox="0 0 24 24">
                  <rect height="20" rx="3" stroke={t.heroDeco} strokeWidth="1.5" width="18" x="3" y="3" />
                  <path d="M7 3v20" stroke={t.heroDeco} strokeWidth="1.5" />
                  <circle cx="14" cy="13" r="5" stroke={t.heroDeco} strokeWidth="1.5" />
                  <line stroke={t.heroDeco} strokeLinecap="round" strokeWidth="1.8" x1="14" x2="14" y1="12" y2="15.5" />
                  <circle cx="14" cy="10" fill={t.heroDeco} r="0.75" />
                </svg>
              </div>

              <div style={{ position: "relative", zIndex: 10, maxWidth: "80%" }}>
                <h3 style={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.35, letterSpacing: "-0.01em", margin: "0 0 12px 0", color: t.heroTitle }}>
                  Hal yang harus Anda ketahui!
                </h3>
                <p style={{ fontSize: "13px", color: t.heroText, lineHeight: 1.6, fontWeight: 400, margin: 0 }}>
                  Pastikan Anda mencentang fitur-fitur yang Anda butuhkan.
                </p>
              </div>

              <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", paddingBottom: "2px" }}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    style={{
                      width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer",
                      backgroundColor: activeSlide === i ? t.dotActive : t.dotIdle, transition: "background-color 0.15s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section
            style={{
              borderRadius: "6px", border: `1px solid ${t.cardBorder}`, backgroundColor: t.cardBg, padding: "24px", display: "flex",
              alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: "672px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: t.cardTitle, lineHeight: 1.35, margin: "0 0 4px 0" }}>
                Mulai mengisi pengaturan perusahaan
              </h4>
              <p style={{ fontSize: "13px", color: t.cardSub, lineHeight: 1.6, margin: 0 }}>
                Dengan mengatur informasi perusahaan, selanjutnya Anda dapat mengaktifkan fitur tambahan seperti multi mata uang, format mata uang dan tax inclusive apabila diperlukan.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <button
                type="button"
                onClick={openModal}
                onMouseEnter={() => setCtaHover(true)}
                onMouseLeave={() => setCtaHover(false)}
                style={{
                  backgroundColor: ctaHover ? t.brandHover : t.brand, color: t.badgeText, fontSize: "13px", fontWeight: 500, padding: "10px 20px",
                  border: "none", borderRadius: "4px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease",
                }}
              >
                Lengkapi Informasi
              </button>
            </div>
          </section>
        </main>

        {showModal && (
          <div
            onClick={closeModal}
            style={{
              position: "fixed", inset: 0, zIndex: 200, backgroundColor: t.overlay,
              display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "16px", boxSizing: "border-box", overflowY: "auto",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "758px", maxWidth: "100%", maxHeight: "calc(100vh - 32px)", backgroundColor: t.cardBg, borderRadius: "3px",
                border: isDark ? `1px solid ${t.cardBorder}` : "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px 25px 14px", borderBottom: `1px solid ${t.headerBorder}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "12.5px", color: t.cardSub, lineHeight: 1.3 }}>Pengaturan Perusahaan</div>
                  <h3 style={{ fontSize: "17px", fontWeight: 600, color: t.cardTitle, margin: "2px 0 0 0" }}>Informasi Perusahaan</h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Tutup"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", lineHeight: 1, color: t.cardSub, padding: "4px 6px", fontWeight: 700 }}
                >
                  ×
                </button>
              </div>

              <div style={{ padding: "14px 30px 10px", overflowY: "auto", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "14px" }}>
                  <label style={{ width: "243px", flexShrink: 0, fontSize: "13px", fontWeight: 600, color: t.cardSub, paddingTop: "2px" }}>Logo</label>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "72px" }}>
                    <div
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{
                        width: "110px", height: "110px", border: `1px dashed ${t.dashBorder}`, boxSizing: "border-box", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0,
                      }}
                    >
                      {form.logoPreview ? (
                        <img src={form.logoPreview} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      ) : (
                        <>
                          <span style={{ fontSize: "13px", color: t.brand }}>Pilih File</span>
                          <span style={{ fontSize: "12.5px", color: t.hintText, lineHeight: 1.35, marginTop: "2px" }}>rekomendasi<br />60x60 (px)</span>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: t.navText, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={form.tampilkanLogo}
                        onChange={(e) => handleChange("tampilkanLogo", e.target.checked)}
                        style={{ width: "13px", height: "13px", cursor: "pointer", margin: 0, accentColor: t.brand }}
                      />
                      Tampilkan Logo di Laporan
                    </label>
                  </div>
                </div>

                <FormRow label="Nama Perusahaan">
                  <input type="text" value={form.nama} onChange={(e) => handleChange("nama", e.target.value)} style={lineInputStyle} />
                </FormRow>
                <FormRow label="Alamat" tall>
                  <textarea rows={2} value={form.alamat} onChange={(e) => handleChange("alamat", e.target.value)} style={{ ...lineInputStyle, height: "44px", resize: "vertical" }} />
                </FormRow>
                <FormRow label="Alamat Pengiriman" tall>
                  <textarea rows={2} value={form.alamatPengiriman} onChange={(e) => handleChange("alamatPengiriman", e.target.value)} style={{ ...lineInputStyle, height: "44px", resize: "vertical" }} />
                </FormRow>
                <FormRow label="Telepon">
                  <input type="text" value={form.telepon} onChange={(e) => handleChange("telepon", e.target.value)} style={lineInputStyle} />
                </FormRow>
                <FormRow label="Fax">
                  <input type="text" value={form.fax} onChange={(e) => handleChange("fax", e.target.value)} style={lineInputStyle} />
                </FormRow>
                <FormRow label="NPWP">
                  <input type="text" value={form.npwp} onChange={(e) => handleChange("npwp", e.target.value)} style={lineInputStyle} />
                </FormRow>
              </div>

              <div style={{ padding: "14px 30px 20px", display: "flex", justifyContent: "flex-end", gap: "3px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  onMouseEnter={() => setBackHover(true)}
                  onMouseLeave={() => setBackHover(false)}
                  style={{
                    width: "103px", height: "30px", fontSize: "13px",
                    color: backHover ? t.summaryBtnTextHover : t.summaryBtnText,
                    backgroundColor: t.summaryBtnBg,
                    border: `1px solid ${backHover ? t.summaryBtnBorderHover : t.summaryBtnBorder}`,
                    borderRadius: "3px", cursor: "pointer", transition: "all 0.15s ease",
                  }}
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  onMouseEnter={() => setSaveHover(true)}
                  onMouseLeave={() => setSaveHover(false)}
                  style={{
                    width: "91px", height: "30px", fontSize: "13px", color: t.saveText,
                    backgroundColor: saveHover ? t.saveBgHover : t.saveBg, border: `1px solid ${t.saveBorder}`,
                    borderRadius: "3px", cursor: "pointer", fontWeight: isDark ? 600 : 400, transition: "background-color 0.15s ease",
                  }}
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeCtx.Provider>
  );
}