import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const PENGATURAN_PERUSAHAAN_PATH = "/pengaturan-perusahaan";
const MASTER_DATA_PATH = "/master-data/akun";
const DATA_PENJUALAN_PATH = "/transaksi/data-penjualan";

const BRAND = "#009ee2";

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
};

const ThemeCtx = createContext(LIGHT_T);

function CheckCircle() {
  const t = useContext(ThemeCtx);
  return (
    <svg style={{ width: "24px", height: "24px", color: t.check, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepCard({ number, title, subtitle, children }) {
  const t = useContext(ThemeCtx);
  return (
    <article style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: "3px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", backgroundColor: t.cardBg, borderBottom: `1px solid ${t.cardHeadBorder}` }}>
        <span
          style={{
            backgroundColor: t.brand, color: t.badgeText, fontWeight: 700, fontSize: "12px", width: "24px", height: "24px",
            display: "flex", alignItems: "center", justifyContent: "center", borderBottomRightRadius: "2px", flexShrink: 0,
          }}
        >
          {number}
        </span>
        <div style={{ padding: "10px 12px" }}>
          <h4 style={{ fontWeight: 700, fontSize: "14px", color: t.cardTitle, lineHeight: 1.25, margin: 0 }}>{title}</h4>
          <p style={{ fontSize: "11.5px", color: t.cardSub, margin: "2px 0 0 0" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </article>
  );
}

function StepItem({ icon, label, withBorder, onClick }) {
  const t = useContext(ThemeCtx);
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", cursor: "pointer",
        borderTop: withBorder ? `1px solid ${t.itemBorder}` : "none", backgroundColor: hover ? t.itemHover : "transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <svg style={{ width: "24px", height: "24px", color: t.brand, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          {icon}
        </svg>
        <span style={{ fontSize: "13px", color: t.itemLabel, fontWeight: 400 }}>{label}</span>
      </div>
      <CheckCircle />
    </div>
  );
}

export default function DataMigrasi() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  const [ctaHover, setCtaHover] = useState(false);
  const [summaryHover, setSummaryHover] = useState(false);
  const [activeNav, setActiveNav] = useState("beranda");

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

  const icons = {
    company: (
      <>
        <rect height="18" rx="1.5" width="16" x="4" y="3" />
        <rect height="2.5" width="2.5" x="7" y="6" />
        <rect height="2.5" width="2.5" x="14.5" y="6" />
        <rect height="2.5" width="2.5" x="7" y="11" />
        <rect height="2.5" width="2.5" x="14.5" y="11" />
        <path d="M10 21v-4h4v4" />
      </>
    ),
    account: (
      <>
        <rect height="18" rx="2" width="16" x="4" y="3" />
        <line x1="8" x2="8" y1="3" y2="21" />
        <line x1="12" x2="16" y1="7" y2="7" />
        <circle cx="14" cy="13" r="1.5" />
      </>
    ),
    product: (
      <>
        <path d="M4 7l8-4 8 4-8 4-8-4z" />
        <path d="M4 7v10l8 4v-10" />
        <path d="M20 7v10l-8 4v-10" />
        <line x1="10" x2="14" y1="12" y2="14" />
      </>
    ),
    contact: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0111 0" />
        <path d="M16 7a2.5 2.5 0 010 5" />
        <path d="M16.5 15.5a4 4 0 014 3.5" />
      </>
    ),
    sales: (
      <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" x2="7.01" y1="7" y2="7" />
      </>
    ),
    purchase: (
      <>
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="17" cy="20" r="1.5" />
        <path d="M1 1h4l2.68 12.39a2 2 0 002 1.61h8.72a2 2 0 002-1.61L22 6H6" />
      </>
    ),
    expense: (
      <>
        <path d="M4 2v19l3-1.5 3 1.5 3-1.5 3 1.5 4-2V2H4z" />
        <line x1="8" x2="16" y1="7" y2="7" />
        <line x1="8" x2="16" y1="11" y2="11" />
        <line x1="8" x2="12" y1="15" y2="15" />
      </>
    ),
  };

  const navGroupStyle = {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px",
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
          flexDirection: "column",
          color: t.text,
          colorScheme: isDark ? "dark" : "normal",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <header style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, padding: "14px 24px", width: "100%", boxSizing: "border-box" }}>
          <h1 style={{ fontSize: "17px", fontWeight: 700, color: t.headerTitle, margin: 0, letterSpacing: "-0.01em" }}>Data Migrasi</h1>
        </header>

        <div style={{ display: "flex", flex: 1, width: "100%", minHeight: "calc(100vh - 53px)" }}>

          <aside style={{ width: "200px", backgroundColor: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}`, flexShrink: 0, display: "flex", flexDirection: "column", paddingTop: "12px" }}>
            <nav style={{ width: "100%", fontSize: "12px" }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveNav("beranda"); }}
                style={{
                  display: "block", padding: "8px 16px", fontSize: "13px", lineHeight: 1.35, textDecoration: "none",
                  backgroundColor: activeNav === "beranda" ? t.navActiveBg : "transparent",
                  color: activeNav === "beranda" ? t.navActiveText : t.navText,
                  fontWeight: activeNav === "beranda" ? 600 : 400,
                }}
              >
                Beranda
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(PENGATURAN_PERUSAHAAN_PATH); }}
                style={{
                  display: "block", padding: "10px 16px 10px 36px", fontSize: "12.5px", lineHeight: 1.25, textDecoration: "none",
                  color: activeNav === "pengaturan" ? t.brand : t.navText,
                }}
              >
                Pengaturan<br />Perusahaan
              </a>
              {["Master Data", "Transaksi"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "Master Data") {
                      navigate(MASTER_DATA_PATH);
                    } else {
                      navigate(DATA_PENJUALAN_PATH);
                    }
                  }}
                  style={navGroupStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.navHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg style={{ width: "16px", height: "16px", color: t.navIcon }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span style={{ fontWeight: 400, color: t.navLabel }}>{label}</span>
                  </div>
                  <svg style={{ width: "14px", height: "14px", color: t.navChevron }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </nav>
          </aside>

          <main style={{ flex: 1, padding: "24px 32px", overflowY: "auto", maxWidth: "1300px", boxSizing: "border-box", backgroundColor: t.bg }}>

            <header style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: t.pageTitle, lineHeight: 1.3, margin: 0 }}>Selamat Datang di Migration Center!</h2>
              <p style={{ fontSize: "13px", color: t.pageSub, margin: "2px 0 0 0" }}>Dapatkan Kemudahan dalam Pemindahan Data Anda</p>
            </header>

            <section
              style={{
                background: t.heroBg, border: t.heroBorder, borderRadius: "3px", padding: "20px", marginBottom: "20px", color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flexShrink: 0 }}>
                  <svg style={{ width: "48px", height: "48px" }} fill="none" viewBox="0 0 48 48">
                    <rect fill="none" height="24" rx="2" stroke="white" strokeWidth="2.5" width="30" x="4" y="6" />
                    <line stroke="white" strokeWidth="2.5" x1="14" x2="14" y1="30" y2="36" />
                    <line stroke="white" strokeLinecap="round" strokeWidth="2.5" x1="8" x2="26" y1="36" y2="36" />
                    <path d="M19 14v8M19 14l-3 3M19 14l3 3" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                    <rect fill={t.heroIconFill} height="23" rx="1.5" stroke="white" strokeWidth="2.5" width="17" x="25" y="14" />
                    <line stroke="white" strokeLinecap="round" strokeWidth="2" x1="29" x2="37" y1="19" y2="19" />
                    <line stroke="white" strokeLinecap="round" strokeWidth="2" x1="29" x2="38" y1="24" y2="24" />
                    <line stroke="white" strokeLinecap="round" strokeWidth="2" x1="29" x2="34" y1="29" y2="29" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "14.5px", lineHeight: 1.25, margin: 0 }}>Kenapa migrasi data Anda ke Jurnal?</h3>
                  <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.95)", margin: "4px 0 0 0", lineHeight: 1.6, maxWidth: "672px", fontWeight: 300 }}>
                    Supaya Anda lebih mudah dalam memantau status transaksi, membandingkan laporan dengan periode sebelumnya, dan mempermudah dalam melakukan pembukuan di Jurnal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/pengaturan-perusahaan")}
                onMouseEnter={() => setCtaHover(true)}
                onMouseLeave={() => setCtaHover(false)}
                style={{
                  flexShrink: 0, backgroundColor: ctaHover ? t.ctaBgHover : t.ctaBg, color: t.ctaText, fontSize: "13px", fontWeight: 600,
                  padding: "8px 24px", border: "none", borderRadius: "3px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
              >
                Mulai Sekarang
              </button>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "start" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <StepCard number="1" title="Pengaturan Perusahaan" subtitle="Mulai pemakaian Jurnal dengan mengisi Data Perusahaan">
                  <div style={{ padding: "16px 20px" }}>
                    <StepItem icon={icons.company} label="Lengkapi Data Perusahaan" onClick={() => navigate("/pengaturan-perusahaan")} />
                  </div>
                </StepCard>

                <StepCard number="2" title="Master Data" subtitle="Persiapkan Data Master Anda untuk operasional sehari - hari">
                  <div style={{ padding: "8px 20px" }}>
                    <StepItem
                      icon={icons.account}
                      label="Atur Daftar Akun dan Saldo Awal"
                      onClick={() => navigate("/master-data/akun")}
                    />
                    <StepItem
                      icon={icons.product}
                      label="Impor Produk"
                      withBorder
                      onClick={() => navigate("/master-data/produk")}
                    />
                    <StepItem
                      icon={icons.contact}
                      label="Impor Kontak"
                      withBorder
                      onClick={() => navigate("/master-data/kontak")}
                    />
                  </div>
                </StepCard>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <StepCard number="3" title="Transaksi" subtitle="Pastikan semua Data Transaksi Anda lengkap di Jurnal">
                  <div style={{ padding: "8px 20px" }}>
                    <StepItem
                      icon={icons.sales}
                      label="Import Penjualan"
                      onClick={() => navigate("/transaksi/data-penjualan")}
                    />
                    <StepItem
                      icon={icons.purchase}
                      label="Import Pembelian"
                      withBorder
                      onClick={() => navigate("/transaksi/data-pembelian")}
                    />
                    <StepItem
                      icon={icons.expense}
                      label="Impor Biaya"
                      withBorder
                      onClick={() => navigate("/transaksi/biaya")}
                    />
                  </div>
                </StepCard>

                <article style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: "3px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{ flexShrink: 0, color: t.summaryIcon }}>
                      <svg style={{ width: "40px", height: "40px", strokeWidth: 1.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
                        <rect height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" width="6" x="9" y="3" />
                        <line strokeLinecap="round" x1="9" x2="15" y1="11" y2="11" />
                        <line strokeLinecap="round" x1="9" x2="15" y1="14" y2="14" />
                        <line strokeLinecap="round" x1="9" x2="13" y1="17" y2="17" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 700, fontSize: "14px", color: t.cardTitle, lineHeight: 1.25, margin: 0 }}>Rangkuman data migrasi Anda!</h4>
                      <p style={{ fontSize: "11.5px", color: t.cardSub, margin: "2px 0 0 0" }}>Rangkuman Data yang telah Anda masukkan</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                    <button
                      type="button"
                      onMouseEnter={() => setSummaryHover(true)}
                      onMouseLeave={() => setSummaryHover(false)}
                      style={{
                        border: `1px solid ${summaryHover ? t.summaryBtnBorderHover : t.summaryBtnBorder}`,
                        color: summaryHover ? t.summaryBtnTextHover : t.summaryBtnText,
                        fontSize: "12.5px", fontWeight: 400, padding: "6px 24px",
                        borderRadius: "3px", backgroundColor: t.summaryBtnBg, cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      Lihat Rangkuman
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}