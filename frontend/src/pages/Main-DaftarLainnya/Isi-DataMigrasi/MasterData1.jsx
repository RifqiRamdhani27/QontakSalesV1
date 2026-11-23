import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const ACCOUNTS_API_URL = "/api/coa/?page_size=10000";
const DATA_MIGRASI_PATH = "/data-migrasi";
const PENGATURAN_PERUSAHAAN_PATH = "/pengaturan-perusahaan";
const DATA_PRODUK_PATH = "/master-data/produk";
const DATA_KONTAK_PATH = "/master-data/kontak";
const DATA_PENJUALAN_PATH = "/transaksi/data-penjualan";
const DATA_PEMBELIAN_PATH = "/transaksi/data-pembelian";
const DATA_BIAYA_PATH = "/transaksi/biaya";

const BRAND = "#009ee2";
const BRAND_HOVER = "#008cc9";

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
  pageTitle: "#2d3748",
  pageSub: "#6b7280",
  heroBg: BRAND,
  heroBorder: "none",
  heroIconFill: BRAND,
  ctaBg: "#ffffff",
  ctaBgHover: "#f9fafb",
  ctaText: BRAND,
  cardBg: "#ffffff",
  cardBorder: "#d1d5db",
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
  activeChildIcon: "#8fd0f0",
  tableHeadBg: "#f0f0f0",
  tableHeadText: "#2c3e50",
  tableText: "#4b5563",
  tableName: "#374151",
  tableRowBorder: "#f3f4f6",
  tableRowHover: "#f8fafc",
  tableMuted: "#6b7280",
  errorText: "#dc2626",
  helpHoverBg: "#eff6ff",
  heroDeco: "#ffffff",
  heroDecoOpacity: 0.18,
  heroTitle: "#ffffff",
  heroText: "rgba(255,255,255,0.95)",
  dotActive: "#ffffff",
  dotIdle: "rgba(255,255,255,0.5)",
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
  tableHeadBg: "#262522",
  tableHeadText: "#f8fafc",
  tableText: "#94a3b8",
  tableName: "#e2e8f0",
  tableRowBorder: "#3a3326",
  tableRowHover: "#262522",
  tableMuted: "#94a3b8",
  errorText: "#f87171",
  helpHoverBg: "#262522",
  heroDeco: "#E5B85C",
  heroDecoOpacity: 0.12,
  heroTitle: "#E5B85C",
  heroText: "#e2e8f0",
  dotActive: "#E5B85C",
  dotIdle: "rgba(229,184,92,0.35)",
  logoText: "#f8fafc",
};

const ThemeCtx = createContext(LIGHT_T);

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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

export default function MasterData1() {
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

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSlide, setActiveSlide] = useState(0);
  const [helpHover, setHelpHover] = useState(false);
  const [playHover, setPlayHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [hoverRow, setHoverRow] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadAccounts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(ACCOUNTS_API_URL, {
          credentials: "include",
          headers: getAuthHeaders()
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized: Sesi Anda telah berakhir atau token tidak valid.");
          throw new Error(`Gagal memuat data akun (${res.status})`);
        }

        const json = await res.json();
        const list = Array.isArray(json) ? json : json.results || json.data || [];
        if (!cancelled) setAccounts(list);
      } catch (err) {
        if (!cancelled) setError(err.message || "Gagal memuat data akun");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAccounts();
    return () => { cancelled = true; };
  }, []);

  const sortedAccounts = useMemo(
    () => [...accounts].sort((a, b) => String(a.kode_akun || "").localeCompare(String(b.kode_akun || ""), undefined, { numeric: true })),
    [accounts]
  );

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

  const thStyle = {
    padding: "10px 16px", fontWeight: 700, fontSize: "13px", color: t.tableHeadText, letterSpacing: "-0.01em",
    textAlign: "left", position: "sticky", top: 0, backgroundColor: t.tableHeadBg, zIndex: 1,
  };
  const tdStyle = { padding: "12px 16px", fontSize: "13.5px", color: t.tableText, borderTop: `1px solid ${t.tableRowBorder}` };

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
                {renderChild("Daftar Akun dan Saldo Awal", null, true)}
                {renderChild("Data Produk", DATA_PRODUK_PATH)}
                {renderChild("Data Kontak", DATA_KONTAK_PATH)}
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
          <div style={{ maxWidth: "1240px", margin: "0 auto" }}>

            <header style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "23px", fontWeight: 700, color: t.pageTitle, letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>
                Pengaturan Daftar Akun &amp; Saldo Awal
              </h1>
              <p style={{ fontSize: "14px", color: t.pageSub, margin: "4px 0 0 0", lineHeight: 1.5 }}>
                Atur Daftar Akun Anda, lalu semua akan lebih cepat dan mudah. Jurnal juga menyediakan Akun yang dapat Anda gunakan.
              </p>
            </header>

            <section style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px" }}>
                <h2 style={{ fontSize: "14.5px", fontWeight: 500, color: t.navText, margin: 0 }}>Daftar Akun yang tersedia di Jurnal</h2>
                <button
                  type="button"
                  aria-label="Bantuan Daftar Akun"
                  onMouseEnter={() => setHelpHover(true)}
                  onMouseLeave={() => setHelpHover(false)}
                  style={{
                    width: "26px", height: "26px", border: `1px solid ${t.brand}`, borderRadius: "4px", color: t.brand, cursor: "pointer", padding: 0,
                    backgroundColor: helpHover ? t.helpHoverBg : t.cardBg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s ease",
                  }}
                >
                  <svg style={{ width: "14px", height: "14px", fill: "currentColor" }} viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                  </svg>
                </button>
              </div>

              <div style={{ border: `1px solid ${t.cardBorder}`, borderRadius: "4px", overflow: "hidden", backgroundColor: t.cardBg }}>
                <div style={{ maxHeight: "190px", overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed" }}>
                    <thead>
                      <tr style={{ backgroundColor: t.tableHeadBg, borderBottom: `1px solid ${t.cardBorder}` }}>
                        <th style={{ ...thStyle, width: "28%" }}>Kode Akun</th>
                        <th style={{ ...thStyle, width: "36%" }}>Nama Akun</th>
                        <th style={{ ...thStyle, width: "36%" }}>Kategori Akun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: t.tableMuted }}>Memuat data akun...</td>
                        </tr>
                      )}
                      {!loading && error && (
                        <tr>
                          <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: t.errorText }}>{error}</td>
                        </tr>
                      )}
                      {!loading && !error && sortedAccounts.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: t.tableMuted }}>Belum ada data akun</td>
                        </tr>
                      )}
                      {!loading && !error && sortedAccounts.map((acc) => (
                        <tr
                          key={acc.id ?? acc.kode_akun}
                          onMouseEnter={() => setHoverRow(acc.id ?? acc.kode_akun)}
                          onMouseLeave={() => setHoverRow(null)}
                          style={{ backgroundColor: hoverRow === (acc.id ?? acc.kode_akun) ? t.tableRowHover : "transparent", transition: "background-color 0.15s ease" }}
                        >
                          <td style={tdStyle}>{acc.kode_akun}</td>
                          <td style={{ ...tdStyle, color: t.tableName }}>{acc.nama_akun}</td>
                          <td style={tdStyle}>{acc.kategori_akun}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "14.5px", fontWeight: 500, color: t.navText, margin: "0 0 12px 0" }}>Cara mengatur Saldo Awal</h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px", alignItems: "stretch" }}>

                <article style={{ border: `1px solid ${t.cardBorder}`, borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "row", height: "225px", backgroundColor: t.cardBg }}>
                  <div style={{ width: "60%", background: t.heroBg, padding: "20px", color: t.heroTitle, display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
                    <p style={{ fontSize: "12.5px", fontWeight: 500, margin: 0, opacity: 0.95 }}>
                      Jurnal | <span style={{ fontWeight: 700 }}>Tutorial</span>
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "8px", marginBottom: "8px" }}>
                      <div>
                        <h3 style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.01em", margin: 0 }}>Getting Started:</h3>
                        <p style={{ fontSize: "19px", fontWeight: 300, lineHeight: 1.25, margin: 0 }}>Import Data Akun</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Putar Video Tutorial"
                        onMouseEnter={() => setPlayHover(true)}
                        onMouseLeave={() => setPlayHover(false)}
                        style={{
                          width: "40px", height: "40px", borderRadius: "50%", backgroundColor: t.ctaBg, border: "none", cursor: "pointer", padding: 0,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transform: playHover ? "scale(1.05)" : "scale(1)", transition: "transform 0.15s ease",
                        }}
                      >
                        <svg style={{ width: "16px", height: "16px", color: t.ctaText, fill: "currentColor", transform: "translateX(2px)" }} viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ height: "8px" }} />
                  </div>

                  <div style={{ width: "40%", backgroundColor: t.cardBg, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                      <svg style={{ width: "24px", height: "24px" }} fill="none" viewBox="0 0 32 32">
                        <path d="M16 2L4 7v9c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V7L16 2z" fill="none" stroke={t.brand} strokeWidth="2.5" />
                        <path d="M12 14v4a4 4 0 008 0v-4" stroke="#48bb78" strokeLinecap="round" strokeWidth="2.5" />
                      </svg>
                      <span style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "0.05em", color: t.logoText }}>JURNAL</span>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <svg style={{ width: "64px", height: "96px" }} fill="none" viewBox="0 0 64 96">
                        <path d="M32 4 C22 20 18 36 18 54 L46 54 C46 36 42 20 32 4 Z" fill={t.brand} />
                        <circle cx="32" cy="32" fill={t.cardBg} r="5" />
                        <path d="M18 46 L8 58 L18 56 Z" fill={t.brand} />
                        <path d="M46 46 L56 58 L46 56 Z" fill={t.brand} />
                        <path d="M26 60 C26 66 22 72 26 76 C28 78 30 76 32 80 C34 76 36 78 38 76 C42 72 38 66 38 60 Z" fill={t.brand} />
                      </svg>
                    </div>
                  </div>
                </article>

                <article
                  style={{
                    background: t.heroBg, border: t.heroBorder, borderRadius: "4px", overflow: "hidden", padding: "24px", color: t.heroTitle, display: "flex",
                    flexDirection: "column", justifyContent: "space-between", position: "relative", height: "225px", boxSizing: "border-box",
                  }}
                >
                  <svg
                    style={{ pointerEvents: "none", opacity: t.heroDecoOpacity, position: "absolute", right: "-24px", bottom: "-32px", width: "250px", height: "250px" }}
                    fill="none" stroke={t.heroDeco} strokeWidth="2.5" viewBox="0 0 100 100"
                  >
                    <rect height="80" rx="8" width="70" x="20" y="10" />
                    <line strokeWidth="2" x1="28" x2="28" y1="10" y2="90" />
                    <line strokeLinecap="round" x1="24" x2="24" y1="18" y2="22" />
                    <line strokeLinecap="round" x1="24" x2="24" y1="30" y2="34" />
                    <line strokeLinecap="round" x1="24" x2="24" y1="42" y2="46" />
                    <circle cx="60" cy="50" r="18" strokeWidth="2.5" />
                    <circle cx="60" cy="42" fill={t.heroDeco} r="2" stroke="none" />
                    <line strokeLinecap="round" strokeWidth="3" x1="60" x2="60" y1="47" y2="59" />
                  </svg>

                  <div style={{ position: "relative", zIndex: 10, paddingRight: "48px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 12px 0", letterSpacing: "-0.01em", color: t.heroTitle }}>Hal yang harus Anda ketahui!</h3>
                    <p style={{ fontSize: "12.5px", lineHeight: 1.6, margin: 0, maxWidth: "430px", color: t.heroText }}>
                      Sesuaikan tanggal konversi dengan data transaksi Anda. Atau Anda dapat memilih tanggal konversi pada awal bulan ini (auto tanggal awal bulan ini) atau (auto tanggal hari ini) yang disediakan dari sistem Jurnal.
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", position: "relative", zIndex: 10, paddingTop: "8px" }}>
                    {[0, 1, 2].map((i) => (
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
                </article>
              </div>
            </section>

            <section
              style={{
                border: `1px solid ${t.cardBorder}`, borderRadius: "6px", padding: "24px", backgroundColor: t.cardBg, display: "flex",
                alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
              }}
            >
              <div>
                <h3 style={{ fontSize: "15.5px", fontWeight: 700, color: t.pageTitle, margin: 0 }}>Mulai Atur Saldo Awal Anda</h3>
                <p style={{ fontSize: "13.5px", color: t.cardSub, margin: "4px 0 0 0", lineHeight: 1.5 }}>
                  Setelah atur tanggal konversi, kemudian Anda dapat mengubah dan menambahkan Akun yang sesuai dengan kebutuhan perusahaan Anda.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => navigate("/atur-saldo-coa")}
                  onMouseEnter={() => setCtaHover(true)}
                  onMouseLeave={() => setCtaHover(false)}
                  style={{
                    backgroundColor: ctaHover ? t.brandHover : t.brand, color: t.badgeText, fontSize: "13.5px", fontWeight: 500, padding: "10px 24px",
                    border: "none", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.15s ease",
                  }}
                >
                  Atur Saldo Awal
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}