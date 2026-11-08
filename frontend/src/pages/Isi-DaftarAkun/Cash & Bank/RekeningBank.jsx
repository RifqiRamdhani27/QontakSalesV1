import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dompetBiru from "../../../assets/dompetbiru.png";

const KAS_BANK_PATH = "/kas-bank";

const LINK = "#4a5bd9";
const PRIMARY = "#4a5bd9";
const PRIMARY_HOVER = "#3d4cc4";

const TABS = [
  { label: "Transaksi Jurnal" },
  { label: "Rekening koran" },
  { label: "Rekonsiliasi", count: 0 },
  { label: "Pemetaan Kas" },
];

function ChevronFilledIcon({ color }) {
  return (
    <svg style={{ width: "16px", height: "16px", color, fill: "currentColor" }} viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      />
    </svg>
  );
}

function ChevronOutlineIcon() {
  return (
    <svg className="ks-icon" style={{ width: "16px", height: "16px", color: "#334155", marginLeft: "8px", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="ks-icon" style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeaderButton({ children, primary = false }) {
  const [hover, setHover] = useState(false);
  const bg = primary ? (hover ? PRIMARY_HOVER : PRIMARY) : hover ? "#f8fafc" : "#ffffff";
  return (
    <button
      className={primary ? "ks-btn-primary" : "ks-btn"}
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 500,
        color: primary ? "#ffffff" : LINK, backgroundColor: bg,
        border: primary ? "1px solid transparent" : "1px solid #d9dee7", borderRadius: "4px",
        cursor: "pointer", transition: "background-color 0.15s ease", fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function SearchInput({ placeholder }) {
  return (
    <div style={{ position: "relative", width: "288px" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, paddingLeft: "12px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
        <SearchIcon />
      </div>
      <input
        className="ks-input"
        type="text"
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box", height: "38px", padding: "0 12px 0 36px", fontSize: "13px", color: "#1e293b",
          backgroundColor: "#ffffff", border: "1px solid #d9dee7", borderRadius: "4px", outline: "none", fontFamily: "inherit",
        }}
      />
    </div>
  );
}

function FilterLink({ children }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      className="ks-link"
      href="#"
      onClick={(e) => e.preventDefault()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ fontSize: "13px", fontWeight: 400, color: LINK, textDecoration: hover ? "underline" : "none" }}
    >
      {children}
    </a>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#1e293b" }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          position: "relative", width: "28px", height: "16px", padding: 0, border: "none", borderRadius: "999px", cursor: "pointer",
          backgroundColor: checked ? PRIMARY : "#d1d5db", transition: "background-color 0.15s ease",
        }}
      >
        <span
          style={{
            position: "absolute", top: "2px", left: checked ? "14px" : "2px", width: "12px", height: "12px", borderRadius: "50%",
            backgroundColor: "#ffffff", transition: "left 0.15s ease",
          }}
        />
      </button>
      <span>{label}</span>
    </label>
  );
}

function EmptyState({ title, description }) {
  return (
    <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center" }}>
      <img
        className="ks-img"
        src={dompetBiru}
        alt={title}
        draggable={false}
        style={{ width: "260px", maxWidth: "100%", height: "auto", marginBottom: "16px", userSelect: "none", pointerEvents: "none" }}
      />
      <h2 className="ks-title" style={{ fontSize: "14.5px", fontWeight: 700, color: "#1e293b", margin: "0 0 4px 0" }}>{title}</h2>
      <p className="ks-text" style={{ fontSize: "13px", color: "#475569", margin: 0 }}>{description}</p>
    </section>
  );
}

/* ---------- Tab: Transaksi Jurnal ---------- */
function TransaksiJurnalTab() {
  return (
    <>
      <section style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "64px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "13px" }}>
            <span className="ks-muted" style={{ color: "#64748b" }}>Kategori akun</span>
            <span className="ks-title" style={{ fontWeight: 500, color: "#1e293b" }}>Kas &amp; bank</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              className="ks-select"
              type="button"
              style={{
                width: "208px", height: "38px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
                backgroundColor: "#ffffff", border: "1px solid #d9dee7", borderRadius: "4px", fontSize: "13px", textAlign: "left",
                color: "#1e293b", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <span>Semua status</span>
              <ChevronOutlineIcon />
            </button>
            <FilterLink>Semua filter</FilterLink>
          </div>
        </div>
        <SearchInput placeholder="Cari transaksi Jurnal" />
      </section>
      <EmptyState title="Belum ada transaksi" description="Daftar transaksi Anda akan ditampilkan di sini." />
    </>
  );
}

/* ---------- Tab: Rekening koran ---------- */
function RekeningKoranTab() {
  const [hideDeleted, setHideDeleted] = useState(false);
  return (
    <>
      <section style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <button
            className="ks-select"
            type="button"
            style={{
              width: "237px", height: "38px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
              backgroundColor: "#f1f3f6", border: "1px solid #d9dee7", borderRadius: "4px", fontSize: "13px", textAlign: "left",
              color: "#6b7280", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <span>Mutasi rekening</span>
            <ChevronOutlineIcon />
          </button>
          <FilterLink>Semua filter</FilterLink>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SearchInput placeholder="Cari mutasi" />
        </div>
      </section>
      <EmptyState title="Belum ada mutasi" description="Daftar mutasi Anda akan ditampilkan di sini." />
    </>
  );
}

/* ---------- Tab: belum dibuat ---------- */
function PlaceholderTab({ label }) {
  return <EmptyState title={`${label} belum tersedia`} description="Konten tab ini akan ditampilkan di sini." />;
}

export default function Kas() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [hoverTab, setHoverTab] = useState(null);
  const [crumbHover, setCrumbHover] = useState(false);

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

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <TransaksiJurnalTab />;
      case 1: return <RekeningKoranTab />;
      default: return <PlaceholderTab label={TABS[activeTab].label} />;
    }
  };

  return (
    <div
      className={isDark ? "ks-dark" : ""}
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff", color: "#1e293b",
        WebkitFontSmoothing: "antialiased",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#ffffffff", borderBottom: "1px solid #d9dee7", padding: "16px 28px 0" }}>
        <div style={{ maxWidth: "1780px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", paddingBottom: "22px" }}>
            <div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(KAS_BANK_PATH); }}
                onMouseEnter={() => setCrumbHover(true)}
                onMouseLeave={() => setCrumbHover(false)}
                style={{ display: "inline-block", fontSize: "13px", color: LINK, marginBottom: "2px", textDecoration: crumbHover ? "underline" : "none" }}
              >
                Kas &amp; bank
              </a>
              <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#1e293b", margin: 0, lineHeight: 1.2 }}>
                (1-10002) - Rekening Bank
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <HeaderButton>
                <span>Tindakan</span>
                <ChevronFilledIcon color={LINK} />
              </HeaderButton>
              <HeaderButton primary>
                <span>Buat transaksi</span>
                <ChevronFilledIcon color="#ffffff" />
              </HeaderButton>
            </div>
          </div>

          {/* Tabs */}
          <nav aria-label="Tabs" style={{ display: "flex", alignItems: "flex-end", gap: "28px", marginBottom: "-1px" }}>
            {TABS.map((tab, i) => {
              const active = activeTab === i;
              const hovered = hoverTab === i;
              return (
                <a
                  key={tab.label}
                  className={active ? "ks-tab ks-tab-active" : "ks-tab"}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveTab(i); }}
                  onMouseEnter={() => setHoverTab(i)}
                  onMouseLeave={() => setHoverTab(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px", padding: "10px 5px 12px", fontSize: "13px", whiteSpace: "nowrap", textDecoration: "none",
                    fontWeight: 400, color: active ? PRIMARY : hovered ? "#1e293b" : "#475569",
                    borderBottom: `2px solid ${active ? PRIMARY : "transparent"}`,
                    backgroundColor: "transparent", borderRadius: active ? "6px 6px 0 0" : 0,
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px",
                        fontSize: "12px", fontWeight: 600, color: "#ffffff", backgroundColor: "#4b5563", borderRadius: "999px",
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, width: "100%", boxSizing: "border-box", maxWidth: "1780px", margin: "0 auto", padding: "24px 28px", display: "flex", flexDirection: "column" }}>
        {renderTab()}
      </main>
      <style>{`
        .ks-dark { background-color: #121212 !important; color: #f1f5f9 !important; color-scheme: dark; }

        .ks-dark .ks-header { background-color: #1a1a1a !important; border-color: #634f27 !important; }
        .ks-dark .ks-title { color: #ffffff !important; }
        .ks-dark .ks-text { color: #cbd5e1 !important; }
        .ks-dark .ks-muted { color: #94a3b8 !important; }
        .ks-dark .ks-link { color: #E5B85C !important; }
        .ks-dark .ks-icon { color: #94a3b8 !important; }
        .ks-dark .ks-img { opacity: 0.9; }
        
        /* Header, breadcrumb, judul (tanpa perlu class) */
        .ks-dark header {
          background-color: #121212 !important;
          border-color: #634f27 !important;
        }
        .ks-dark header h1 { color: #ffffff !important; }
        .ks-dark header a:not(.ks-tab) { color: #E5B85C !important; }

        /* Tombol header */
        .ks-dark .ks-btn {
          background-color: #262626 !important;
          border-color: #634f27 !important;
          color: #E5B85C !important;
        }
        .ks-dark .ks-btn:hover { background-color: #2d2d2d !important; }
        .ks-dark .ks-btn svg { color: #E5B85C !important; }
        .ks-dark .ks-btn-primary { background-color: #E5B85C !important; color: #121212 !important; }
        .ks-dark .ks-btn-primary:hover { background-color: #f0c978 !important; }
        .ks-dark .ks-btn-primary svg { color: #121212 !important; }

        /* Tab */
        .ks-dark .ks-tab { color: #cbd5e1 !important; }
        .ks-dark .ks-tab:hover { color: #ffffff !important; }
        .ks-dark .ks-tab-active { color: #E5B85C !important; border-bottom-color: #E5B85C !important; }

        /* Input & select */
        .ks-dark .ks-input,
        .ks-dark .ks-select {
          background-color: #262626 !important;
          color: #f1f5f9 !important;
          border-color: #634f27 !important;
        }
        .ks-dark .ks-input:focus { border-color: #E5B85C !important; }
        .ks-dark ::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}