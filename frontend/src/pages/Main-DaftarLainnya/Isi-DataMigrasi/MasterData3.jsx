import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const DATA_MIGRASI_PATH = "/data-migrasi";
const PENGATURAN_PERUSAHAAN_PATH = "/pengaturan-perusahaan";
const DAFTAR_AKUN_PATH = "/master-data/akun";
const DATA_PRODUK_PATH = "/master-data/produk";
const DATA_PENJUALAN_PATH = "/transaksi/data-penjualan";
const DATA_PEMBELIAN_PATH = "/transaksi/data-pembelian";
const DATA_BIAYA_PATH = "/transaksi/biaya";
const IMPOR_PRODUK_PATH = "/master-data/produk/impor";

const BRAND = "#009ee2";
const BRAND_HOVER = "#028fcb";

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
  pageTitle: "#0f172a",
  pageSub: "#475569",
  sectionTitle: "#334155",
  heroBg: BRAND,
  heroBorder: "none",
  heroIconFill: BRAND,
  ctaBg: "#ffffff",
  ctaBgHover: "#f9fafb",
  ctaText: BRAND,
  cardBg: "#ffffff",
  cardBorder: "#e2e8f0",
  cardHeadBorder: "#eef2f6",
  cardTitle: "#1e293b",
  cardSub: "#64748b",
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
  activeChildIcon: "#8fd0f0",
  iconBtnHoverBg: "#f0f9ff",
  heroDeco: "#ffffff",
  heroDecoOpacity: 0.2,
  heroTitle: "#ffffff",
  heroText: "rgba(255,255,255,0.95)",
  dotActive: "#ffffff",
  dotIdle: "rgba(255,255,255,0.6)",
  logoText: "#1e293b",
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
  sectionTitle: "#e2e8f0",
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
  activeChildIcon: "#8a6f33",
  iconBtnHoverBg: "#262522",
  heroDeco: "#E5B85C",
  heroDecoOpacity: 0.12,
  heroTitle: "#E5B85C",
  heroText: "#e2e8f0",
  dotActive: "#E5B85C",
  dotIdle: "rgba(229,184,92,0.35)",
  logoText: "#f8fafc",
};

const ThemeCtx = createContext(LIGHT_T);

function CheckCircleIcon({ color, size = 16 }) {
  const t = useContext(ThemeCtx);
  return (
    <svg style={{ width: `${size}px`, height: `${size}px`, color: color || t.navIcon, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      />
    </svg>
  );
}

function ChevronIcon({ open, color }) {
  const t = useContext(ThemeCtx);
  return (
    <svg
      style={{ width: "14px", height: "14px", color: color || t.navChevron, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
    >
      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MasterData3() {
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

  const [masterOpen, setMasterOpen] = useState(true);
  const [transaksiOpen, setTransaksiOpen] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);
  const [tableBtnHover, setTableBtnHover] = useState(false);
  const [helpBtnHover, setHelpBtnHover] = useState(false);
  const [playHover, setPlayHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  const navLinkBase = {
    display: "block", textDecoration: "none", fontSize: "13px", lineHeight: 1.35, color: t.navText,
    backgroundColor: "transparent", fontWeight: 400,
  };

  const childItemStyle = {
    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px 10px 28px", fontSize: "12.5px",
    color: t.navLabel, textDecoration: "none", cursor: "pointer", transition: "background-color 0.15s ease",
  };

  const hoverOn = (e) => { e.currentTarget.style.backgroundColor = t.navHover; };
  const hoverOff = (e) => { e.currentTarget.style.backgroundColor = "transparent"; };

  const renderChild = (label, path, active = false) =>
    active ? (
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ ...childItemStyle, fontWeight: 700, color: t.brand }}
      >
        <CheckCircleIcon color={t.activeChildIcon} />
        <span>{label}</span>
      </a>
    ) : (
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

  const iconBtnStyle = (hover) => ({
    width: "32px", height: "32px", borderRadius: "4px", border: `1px solid ${t.brand}`, color: t.brand, cursor: "pointer", padding: 0,
    backgroundColor: hover ? t.iconBtnHoverBg : t.cardBg, display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background-color 0.15s ease",
  });

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
              style={{ ...navLinkBase, padding: "8px 16px" }}
            >
              Beranda
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate(PENGATURAN_PERUSAHAAN_PATH); }}
              style={{ ...navLinkBase, padding: "10px 16px 10px 36px", fontSize: "12.5px", lineHeight: 1.25 }}
            >
              Pengaturan<br />Perusahaan
            </a>

            <button
              type="button"
              onClick={() => setMasterOpen((prev) => !prev)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px",
                backgroundColor: t.navActiveBg, border: "none", color: t.navActiveText, fontSize: "12.5px", fontWeight: 700, cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircleIcon color={t.navActiveText} />
                <span>Master Data</span>
              </div>
              <ChevronIcon open={masterOpen} color={t.navActiveText} />
            </button>

            {masterOpen && (
              <div>
                {renderChild("Daftar Akun dan Saldo Awal", DAFTAR_AKUN_PATH)}
                {renderChild("Data Produk", DATA_PRODUK_PATH)}
                {renderChild("Data Kontak", null, true)}
              </div>
            )}

            <button
              type="button"
              onClick={() => setTransaksiOpen((prev) => !prev)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "none", border: "none", color: t.navText, fontSize: "12.5px", cursor: "pointer", textAlign: "left" }}
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

        <main style={{ flex: 1, minWidth: 0, padding: "32px 24px", boxSizing: "border-box", backgroundColor: t.bg }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>

            <header style={{ marginBottom: "20px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: t.pageTitle, letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>
                Pengaturan Data Kontak
              </h1>
              <p style={{ fontSize: "13.5px", color: t.pageSub, margin: "4px 0 0 0", lineHeight: 1.5 }}>
                Simpan data kontak Anda untuk mempermudah pencatatan biaya-biaya, transaksi dan monitor status transaksi (open, overdue, paid atau partialy paid).
              </p>
            </header>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "14.5px", fontWeight: 500, color: t.sectionTitle, margin: 0 }}>Cara memindahkan Data Kontak</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  aria-label="Lihat Panduan Tabel"
                  title="Lihat Panduan Tabel"
                  onMouseEnter={() => setTableBtnHover(true)}
                  onMouseLeave={() => setTableBtnHover(false)}
                  style={iconBtnStyle(tableBtnHover)}
                >
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="3" x2="21" y1="15" y2="15" />
                    <line x1="9" x2="9" y1="3" y2="21" />
                    <line x1="15" x2="15" y1="3" y2="21" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Pusat Bantuan"
                  title="Pusat Bantuan"
                  onMouseEnter={() => setHelpBtnHover(true)}
                  onMouseLeave={() => setHelpBtnHover(false)}
                  style={iconBtnStyle(helpBtnHover)}
                >
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "stretch" }}>

              <article style={{ border: `1px solid ${t.cardBorder}`, borderRadius: "6px", overflow: "hidden", display: "flex", flexDirection: "row", height: "230px", backgroundColor: t.cardBg }}>
                <div style={{ width: "62%", background: t.heroBg, padding: "20px", color: t.heroTitle, display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
                  <p style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.02em", margin: 0, opacity: 0.95 }}>
                    Jurnal &nbsp;|&nbsp; <span style={{ fontWeight: 700 }}>Tutorial</span>
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "8px", paddingBottom: "8px" }}>
                    <div>
                      <h3 style={{ fontSize: "23px", fontWeight: 700, lineHeight: 1.25, margin: 0 }}>Getting Started:</h3>
                      <p style={{ fontSize: "19px", fontWeight: 400, lineHeight: 1.35, margin: "2px 0 0 0", opacity: 0.95 }}>
                        Import Data<br />Pelanggan
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Putar Tutorial"
                      onMouseEnter={() => setPlayHover(true)}
                      onMouseLeave={() => setPlayHover(false)}
                      style={{
                        width: "40px", height: "40px", borderRadius: "50%", backgroundColor: t.ctaBg, border: "none", cursor: "pointer", padding: 0,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transform: playHover ? "scale(1.05)" : "scale(1)", transition: "transform 0.15s ease",
                      }}
                    >
                      <svg style={{ width: "20px", height: "20px", color: t.ctaText, fill: "currentColor", transform: "translateX(2px)" }} viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ width: "38%", backgroundColor: t.cardBg, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                    <svg style={{ width: "24px", height: "24px" }} fill="none" viewBox="0 0 40 44">
                      <path d="M20 2L36 11V31L20 40L4 31V11L20 2Z" stroke="#00a0dc" strokeLinejoin="round" strokeWidth="4" />
                      <path d="M20 12L28 17V27L20 32L12 27V17L20 12Z" stroke="#78be20" strokeLinejoin="round" strokeWidth="3" />
                    </svg>
                    <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", color: t.logoText }}>JURNAL</span>
                  </div>
                  <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <svg style={{ width: "64px", height: "96px", color: t.brand }} fill="currentColor" viewBox="0 0 80 110">
                      <path d="M40 5 C28 20, 20 45, 20 75 L60 75 C60 45, 52 20, 40 5 Z" />
                      <circle cx="40" cy="40" fill={t.cardBg} r="7" />
                      <path d="M20 60 C12 60, 6 78, 8 92 C14 90, 20 84, 20 80 Z" />
                      <path d="M60 60 C68 60, 74 78, 72 92 C66 90, 60 84, 60 80 Z" />
                      <path d="M33 80 C33 94, 26 100, 31 106 C36 100, 36 96, 40 102 C44 96, 44 100, 49 106 C54 100, 47 94, 47 80 Z" fill={t.brand} />
                    </svg>
                  </div>
                </div>
              </article>

              <article
                style={{
                  background: t.heroBg, border: t.heroBorder, borderRadius: "6px", overflow: "hidden", padding: "28px", color: t.heroTitle, display: "flex",
                  flexDirection: "column", justifyContent: "space-between", position: "relative", height: "230px", boxSizing: "border-box",
                }}
              >
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "55%", pointerEvents: "none", opacity: t.heroDecoOpacity, display: "flex", alignItems: "center", justifyContent: "flex-end", overflow: "hidden" }}>
                  <svg style={{ width: "288px", height: "288px", transform: "translate(48px, 8px)", color: t.heroDeco }} fill="none" stroke="currentColor" strokeWidth="10" viewBox="0 0 200 200">
                    <rect height="170" rx="20" strokeWidth="12" width="140" x="40" y="20" />
                    <line strokeWidth="8" x1="56" x2="56" y1="20" y2="190" />
                    <circle cx="115" cy="105" r="32" strokeWidth="10" />
                    <circle cx="115" cy="90" fill="currentColor" r="5" />
                    <line strokeLinecap="round" strokeWidth="10" x1="115" x2="115" y1="102" y2="124" />
                  </svg>
                </div>

                <div style={{ position: "relative", zIndex: 10, maxWidth: "340px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 12px 0", color: t.heroTitle }}>Hal yang harus Anda ketahui!</h3>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, margin: 0, color: t.heroText }}>
                    Isi informasi kontak selengkap mungkin
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", position: "relative", zIndex: 10, marginTop: "8px" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      style={{
                        width: activeSlide === i ? "10px" : "6px", height: "6px", borderRadius: "999px", cursor: "pointer",
                        backgroundColor: activeSlide === i ? t.dotActive : t.dotIdle, transition: "all 0.15s ease",
                      }}
                    />
                  ))}
                </div>
              </article>
            </div>

            <section
              style={{
                border: `1px solid ${t.cardBorder}`, borderRadius: "6px", padding: "24px", marginTop: "24px", backgroundColor: t.cardBg, display: "flex",
                alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
              }}
            >
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: t.cardTitle, margin: 0 }}>Mulai memindahkan data Kontak</h4>
                <p style={{ fontSize: "13px", color: t.cardSub, margin: "4px 0 0 0", lineHeight: 1.5 }}>
                  Informasi mengenai pelanggan yang akan ditampilkan pada Invoice perusahaan
                </p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => navigate("/contact", { state: { openImportOption: "Data pelanggan" } })}
                  onMouseEnter={() => setCtaHover(true)}
                  onMouseLeave={() => setCtaHover(false)}
                  style={{
                    backgroundColor: ctaHover ? t.brandHover : t.brand, color: t.badgeText, fontSize: "13.5px", fontWeight: 500, padding: "8px 24px",
                    border: "none", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.15s ease",
                  }}
                >
                  Impor Kontak
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}