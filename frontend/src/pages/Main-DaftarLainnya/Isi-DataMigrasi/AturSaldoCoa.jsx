import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";

const ACCOUNTS_API_URL = "/api/coa/?page_size=10000";
const MASTER_DATA_PATH = "/master-data/akun"; 

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const TANGGAL_KONVERSI = new Date(2026, 0, 1);

const formatDateDDMMYYYY = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatRupiah = (value) => {
  const num = Number(value) || 0;
  return "Rp" + num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const GROUP_LABELS = {
  "1": "Aset",
  "2": "Liabilitas",
  "3": "Ekuitas",
  "4": "Pendapatan",
  "5": "Beban Pokok Penjualan",
  "6": "Beban",
  "7": "Pendapatan Lainnya",
  "8": "Beban Lainnya",
};

const InfoIcon = ({ title, isDark }) => (
  <svg
    style={{ width: "16px", height: "16px", color: isDark ? "#94a3b8" : "#64748b", cursor: "pointer", flexShrink: 0 }}
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <title>{title}</title>
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
);

export default function AturSaldoCoa() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("app_theme") || "light");
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

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoverRow, setHoverRow] = useState(null);
  const [masukanHover, setMasukanHover] = useState(false);
  
  const [isTindakanOpen, setIsTindakanOpen] = useState(false);
  const dropdownRef = useRef(null);

  const tanggalSaldoAwal = useMemo(() => {
    const d = new Date(TANGGAL_KONVERSI);
    d.setDate(d.getDate() - 1);
    return d;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadAccounts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(ACCOUNTS_API_URL, { credentials: "include", headers: getAuthHeaders() });
        if (!res.ok) throw new Error(`Gagal memuat data akun (${res.status})`);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTindakanOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groups = useMemo(() => {
    const sorted = [...accounts].sort((a, b) =>
      String(a.kode_akun || "").localeCompare(String(b.kode_akun || ""), undefined, { numeric: true })
    );
    const map = new Map();
    sorted.forEach((acc) => {
      const key = String(acc.kode_akun || "").charAt(0);
      const label = GROUP_LABELS[key] || "Lainnya";
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(acc);
    });
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [accounts]);

  const getDebit = () => 0;
  const getKredit = () => 0;
  const totalDebit = accounts.reduce((sum, acc) => sum + getDebit(acc), 0);
  const totalKredit = accounts.reduce((sum, acc) => sum + getKredit(acc), 0);

  // Tema Warna Dinamis
  const t = {
    text: isDark ? "#f1f5f9" : "#1f2937",
    textMuted: isDark ? "#94a3b8" : "#4b5563",
    textFaint: isDark ? "#64748b" : "#6b7280",
    bg: isDark ? "#121212" : "#ffffff",
    surface: isDark ? "#1a1a1a" : "#ffffff",
    border: isDark ? "#634f27" : "#e5e7eb",
    borderLight: isDark ? "#3a3326" : "#f1f5f9",
    inputBg: isDark ? "#262626" : "#f3f4f6",
    link: isDark ? "#E5B85C" : "#2563eb",
    btnPrimaryBg: isDark ? "#e08d33" : "#4f46e5",
    btnPrimaryHover: isDark ? "#e08c33df" : "#4338ca",
    btnOutlineBg: isDark ? "#1a1a1a" : "#ffffff",
    btnOutlineHover: isDark ? "#262626" : "#f9fafb",
  };

  const thStyle = { padding: "8px 13.33px", borderBottom: `1px solid ${t.border}`, fontSize: "13.33px", fontWeight: 400, color: t.text, textAlign: "left", height: 40, verticalAlign: "middle" };
  const tdStyle = { padding: "5.33px 13.33px", fontSize: "13.33px", color: t.text, borderBottom: `1px solid ${t.border}`, height: 35, verticalAlign: "middle" };

  return (
    <div
      className="-m-4 min-h-[calc(100%+2rem)] px-6 py-5 md:-m-6 md:min-h-[calc(100%+3rem)] md:px-10"
      style={{
        background: isDark ? "#121212" : "#ffffff",
        color: t.text,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
      data-list-theme={isDark ? "dark" : "light"}
    >
      {isDark && <style>{"[data-list-theme=\"dark\"] *:focus{outline:none!important}"}</style>}
      
      <div className="mx-auto w-full max-w-[1688px]">
        {/* Top Bar */}
        <header
          style={{
            width: "100%", boxSizing: "border-box", borderBottom: `1px solid ${t.border}`, padding: "16px 0", paddingBottom: "24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "transparent",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link
              to={MASTER_DATA_PATH}
              style={{ fontSize: "14px", color: t.link, textDecoration: "none", display: "inline-block", marginBottom: "4px" }}
              className="hover:underline"
            >
              Daftar akun
            </Link>
            <h2 style={{ fontSize: "23px", fontWeight: 700, color: t.text, letterSpacing: "-0.01em", lineHeight: 1.25, margin: 0 }}>
              Atur saldo awal
            </h2>
          </div>
          <div>
            <button
              type="button"
              onMouseEnter={() => setMasukanHover(true)}
              onMouseLeave={() => setMasukanHover(false)}
              style={{
                padding: "0 16px", height: 38, fontSize: "14px", fontWeight: 500, color: t.link, border: `1px solid ${t.border}`, borderRadius: "8px",
                backgroundColor: masukanHover ? t.btnOutlineHover : t.btnOutlineBg, cursor: "pointer", transition: "background-color 0.15s ease",
              }}
            >
              Beri masukan
            </button>
          </div>
        </header>

        {/* Main Content Box */}
        <div style={{
          background: t.surface,
          padding: 20,
          borderRadius: 12,
          overflow: "hidden",
          marginTop: 24,
          boxShadow: isDark
            ? "0 8px 30px rgba(201, 77, 0, 0.2), 0 0 0 1px rgba(229, 184, 92, 0.15)"
            : "0 4px 12px rgba(0, 0, 0, 0.22)",
          border: isDark ? "1px solid #634f27" : "1px solid transparent"
        }}>
          {/* Upper: tanggal konversi + notice */}
          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px", paddingBottom: "28px",
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            {/* Left: Tanggal konversi */}
            <div style={{ display: "flex", flexDirection: "column", paddingTop: "4px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: t.text, margin: "0 0 4px 0" }}>Tanggal konversi</h3>
              <p style={{ fontSize: "13px", color: t.textMuted, margin: "0 0 16px 0" }}>
                Silakan pilih tanggal konversi/tanggal mulai pencatatan di Jurnal
              </p>
              <div style={{ position: "relative", width: "100%", maxWidth: "384px", marginBottom: "8px" }}>
                <input
                  type="text"
                  readOnly
                  value={formatDateDDMMYYYY(TANGGAL_KONVERSI)}
                  style={{
                    width: "100%", height: "38px", boxSizing: "border-box", padding: "0 40px 0 14px", fontSize: "14px", color: t.text,
                    backgroundColor: t.inputBg, border: `1px solid ${t.border}`, borderRadius: "8px", outline: "none", cursor: "default",
                  }}
                />
                <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "12px", pointerEvents: "none", color: t.textFaint }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
              </div>
              <span style={{ fontSize: "12px", color: t.textFaint }}>
                Saldo awal Anda terhitung dari {formatDateDDMMYYYY(tanggalSaldoAwal)}
              </span>
            </div>

            {/* Right: Notice box */}
            <div>
              <div style={{ border: `1px solid ${t.border}`, borderRadius: "8px", padding: "16px", fontSize: "13px", color: t.text, backgroundColor: t.surface, lineHeight: 1.6 }}>
                <h3 style={{ fontWeight: 700, color: t.text, margin: "0 0 6px 0", fontSize: "14px" }}>Hal yang perlu diperhatikan:</h3>
                <ul style={{ listStyleType: "disc", paddingLeft: "20px", margin: 0, color: t.textMuted, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Pastikan daftar akun Anda lengkap.</li>
                  <li>Siapkan saldo akun yang akan Anda gunakan sebagai saldo awal untuk pencatatan di Jurnal. Jika belum lengkap, Anda bisa simpan dulu sebagai draf.</li>
                  <li>Anda bisa input transaksi sebelum tanggal konversi dengan batasan 300.000 akun transaksi. Transaksi yang diinput tidak akan memengaruhi saldo saat ini.</li>
                </ul>
                <p style={{ margin: "8px 0 0 0", color: t.textMuted }}>
                  Untuk informasi lebih lanjut,{" "}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: t.link, textDecoration: "none" }}
                    className="hover:underline"
                  >
                    baca artikel panduan
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Saldo awal header */}
          <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.text, margin: 0 }}>Saldo awal</h2>
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: 500,
                    backgroundColor: isDark ? "#262626" : "#52525b", color: isDark ? "#94a3b8" : "#ffffff", border: isDark ? `1px solid ${t.border}` : "none"
                  }}
                >
                  Draf
                </span>
              </div>
              <p style={{ fontSize: "13px", color: t.textMuted, margin: 0 }}>
                Silakan masukkan saldo awal per tanggal {formatDateDDMMYYYY(tanggalSaldoAwal)} di kolom yang disediakan.
              </p>
            </div>
            
            {/* DROPDOWN TINDAKAN */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setIsTindakanOpen((prev) => !prev)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "0 16px", height: 40,
                  backgroundColor: t.btnPrimaryBg, color: "#ffffff", fontSize: "14px", fontWeight: 600,
                  border: "none", borderRadius: "8px", boxShadow: isDark ? "0 4px 8px rgba(254,92,23,.49)" : "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer", transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.btnPrimaryHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = t.btnPrimaryBg; }}
              >
                <span>Tindakan</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ transform: isTindakanOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {isTindakanOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 50,
                    minWidth: "180px",
                    backgroundColor: t.surface,
                    border: `1px solid ${t.border}`,
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                    padding: "4px 0",
                  }}
                >
                  <button
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", fontSize: "14px", color: t.text, cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.borderLight)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    onClick={() => setIsTindakanOpen(false)}
                  >
                    Ubah saldo
                  </button>
                  <div style={{ height: "1px", backgroundColor: t.border, margin: "4px 0" }} />
                  <div style={{ padding: "8px 16px 4px 16px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: t.textFaint }}>
                    L A I N N Y A
                  </div>
                  <button
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", fontSize: "14px", color: t.text, cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.borderLight)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    onClick={() => setIsTindakanOpen(false)}
                  >
                    Atur akun
                  </button>
                </div>
              )}
            </div>
            {/* END DROPDOWN TINDAKAN */}
          </div>

          {/* Balance Table */}
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "50%", minWidth: "320px", borderTopLeftRadius: 8, backgroundColor: isDark ? "#e08c33b8" : "#ffffff" }}>Akun</th>
                  <th style={{ ...thStyle, width: "25%", minWidth: "180px", textAlign: "right", backgroundColor: isDark ? "#e08c33b8" : "#ffffff" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", fontWeight: 700 }}>
                      <span>Debit</span>
                      <InfoIcon title="Debit" isDark={isDark} />
                    </div>
                  </th>
                  <th style={{ ...thStyle, width: "25%", minWidth: "180px", textAlign: "right", borderTopRightRadius: 8, backgroundColor: isDark ? "#e08c33b8" : "#ffffff" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", fontWeight: 700 }}>
                      <span>Kredit</span>
                      <InfoIcon title="Kredit" isDark={isDark} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: t.textFaint, padding: "20px 0" }}>Memuat data akun...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: "#dc2626", padding: "20px 0" }}>{error}</td>
                  </tr>
                )}
                {!loading && !error && groups.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: t.textFaint, padding: "20px 0" }}>Belum ada data akun</td>
                  </tr>
                )}
                {!loading && !error && groups.map((group) => (
                  <GroupRows
                    key={group.label}
                    group={group}
                    hoverRow={hoverRow}
                    setHoverRow={setHoverRow}
                    tdStyle={tdStyle}
                    getDebit={getDebit}
                    getKredit={getKredit}
                    isDark={isDark}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ padding: "12px 13.33px", fontWeight: 700, color: t.text, borderBottom: `1px solid ${t.border}` }}>Total</td>
                  <td style={{ padding: "12px 13.33px", fontWeight: 700, color: t.text, textAlign: "right", borderBottom: `1px solid ${t.border}` }}>{formatRupiah(totalDebit)}</td>
                  <td style={{ padding: "12px 13.33px", fontWeight: 700, color: t.text, textAlign: "right", borderBottom: `1px solid ${t.border}` }}>{formatRupiah(totalKredit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupRows({ group, hoverRow, setHoverRow, tdStyle, getDebit, getKredit, isDark }) {
  return (
    <>
      <tr>
        <td colSpan={3} style={{ padding: "16px 13.33px 8px", fontWeight: 700, color: isDark ? "#E5B85C" : "#111827", fontSize: "13.33px", borderBottom: `1px solid ${isDark ? "#634f27" : "#e5e7eb"}` }}>
          {group.label}
        </td>
      </tr>
      {group.items.map((acc) => {
        const rowKey = acc.id ?? acc.kode_akun;
        return (
          <tr
            key={rowKey}
            onMouseEnter={() => setHoverRow(rowKey)}
            onMouseLeave={() => setHoverRow(null)}
            style={{ backgroundColor: hoverRow === rowKey ? (isDark ? "rgba(229,184,92,.05)" : "#fcfdfe") : "transparent" }}
          >
            <td style={tdStyle}>
              <span style={{ display: "inline-block", width: "80px" }}>{acc.kode_akun}</span>
              <span>{acc.nama_akun}</span>
            </td>
            <td style={{ ...tdStyle, textAlign: "right" }}>{formatRupiah(getDebit(acc))}</td>
            <td style={{ ...tdStyle, textAlign: "right" }}>{formatRupiah(getKredit(acc))}</td>
          </tr>
        );
      })}
    </>
  );
}