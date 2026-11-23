import { useState, useMemo, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";

const LIGHT_T = {
  bg: "#ffffff",
  text: "#334155",
  headerBg: "#ffffff",
  headerBorder: "#e5e7eb",
  crumb: "#6b7280",
  title: "#0c2340",
  btnBg: "#0060b9",
  btnBgHover: "#00529e",
  btnText: "#ffffff",
  Shadow: "0 1px 2px rgba(0,0,0,0.05)",
  mainBg: "#ffffff",
  cardBg: "#ffffff",
  cardBorder: "#dce2ea",
  cardShadow: "0 1px 3px rgba(0,0,0,0.02)",
  searchIcon: "#9ca3af",
  inputBg: "#ffffff",
  inputText: "#374151",
  modalInputText: "#1e293b",
  searchBorder: "#d1d5db",
  modalInputBorder: "#cbd5e1",
  focusBorder: "#3b82f6",
  focusShadow: "0 0 0 1px #3b82f6",
  tableBorder: "#e2e8f0",
  theadBg: "#ffffff",
  th: "#1e293b",
  checkBorder: "#cbd5e1",
  checkOn: "#059669",
  checkOff: "#ffffff",
  rowBorder: "#e2e8f0",
  rowHover: "rgba(249,250,251,0.6)",
  td: "#1f2937",
  icon: "#9ca3af",
  danger: "#ef4444",
  muted: "#6b7280",
  pager: "#64748b",
  pagerArrow: "#94a3b8",
  selectBorder: "#cbd5e1",
  selectBg: "#ffffff",
  selectText: "#334155",
  selectArrow: "#64748b",
  pageInputText: "#000000",
  overlay: "rgba(0, 0, 0, 0.4)",
  modalBg: "#ffffff",
  modalBorder: "none",
  modalShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
  label: "#334155",
  addonBg: "#f8fafc",
  addonBorder: "#cbd5e1",
  addonText: "#475569",
  cancel: "#64748b",
  cancelHover: "#334155",
  submitOnBg: "#0060b9",
  submitOnText: "#ffffff",
  submitOnHover: "#00529e",
  submitOffBg: "#f1f5f9",
  submitOffText: "#94a3b8",
};

const DARK_T = {
  bg: "#121212",
  text: "#e2e8f0",
  headerBg: "#121212",
  headerBorder: "#3a3326",
  crumb: "#94a3b8",
  title: "#f8fafc",
  btnBg: "#e08d33",
  btnBgHover: "#ea9a45",
  btnText: "#ffffff",
  Shadow: "0 4px 8px rgba(254, 92, 23, 0.49)",
  mainBg: "#121212",
  cardBg: "#1a1a19",
  cardBorder: "#634f27",
  cardShadow: "0 2px 12px rgba(0,0,0,0.3)",
  searchIcon: "#94a3b8",
  inputBg: "#262626",
  inputText: "#f1f5f9",
  modalInputText: "#f1f5f9",
  searchBorder: "#634f27",
  modalInputBorder: "#634f27",
  focusBorder: "#E5B85C",
  focusShadow: "0 0 0 2px rgba(229,184,92,0.25)",
  tableBorder: "#634f27",
  theadBg: "rgba(229,184,92,0.12)",
  th: "#f1f5f9",
  checkBorder: "#634f27",
  checkOn: "#E5B85C",
  checkOff: "#262626",
  rowBorder: "#3a3326",
  rowHover: "#262522",
  td: "#e2e8f0",
  icon: "#94a3b8",
  danger: "#f87171",
  muted: "#94a3b8",
  pager: "#94a3b8",
  pagerArrow: "#6b7280",
  selectBorder: "#634f27",
  selectBg: "#262626",
  selectText: "#f1f5f9",
  selectArrow: "#94a3b8",
  pageInputText: "#f1f5f9",
  overlay: "rgba(0, 0, 0, 0.68)",
  modalBg: "#1a1a19",
  modalBorder: "1px solid #634f27",
  modalShadow: "0 24px 60px rgba(0,0,0,0.6)",
  label: "#e2e8f0",
  addonBg: "#262626",
  addonBorder: "#634f27",
  addonText: "#cbd5e1",
  cancel: "#94a3b8",
  cancelHover: "#f1f5f9",
  submitOnBg: "#E5B85C",
  submitOnText: "#121212",
  submitOnHover: "#f0c978",
  submitOffBg: "#262626",
  submitOffText: "#6b7280",
};

export default function SyaratPembayaran() {
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

  const [rows, setRows] = useState([
    { id: 1, nama: "Net 30", jangkaWaktu: 30 },
    { id: 2, nama: "Cash on Delivery", jangkaWaktu: 0 },
    { id: 3, nama: "Net 15", jangkaWaktu: 15 },
    { id: 4, nama: "Net 60", jangkaWaktu: 60 },
    { id: 5, nama: "Custom", jangkaWaktu: 0 },
  ]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNama, setNewNama] = useState("");
  const [newJangkaWaktu, setNewJangkaWaktu] = useState("");

  const filteredRows = useMemo(
    () => rows.filter((r) => r.nama.toLowerCase().includes(search.trim().toLowerCase())),
    [rows, search]
  );

  const allSelected = filteredRows.length > 0 && filteredRows.every((r) => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredRows.some((r) => r.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredRows.map((r) => r.id)])));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleOpenCreateModal = () => {
    setNewNama("");
    setNewJangkaWaktu("");
    setIsModalOpen(true);
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (newNama.trim()) {
      setRows((prev) => [
        ...prev,
        {
          id: Date.now(),
          nama: newNama.trim(),
          jangkaWaktu: parseInt(newJangkaWaktu) || 0,
        },
      ]);
      setIsModalOpen(false);
    }
  };

  const checkboxStyle = { width: "15px", height: "15px", cursor: "pointer", accentColor: "#0060b9" };
  const iconBtnStyle = { background: "none", border: "none", padding: 0, cursor: "pointer", color: t.icon, display: "flex", alignItems: "center" };

  const checkboxFor = (checked) => ({
    ...checkboxStyle,
    appearance: "none",
    WebkitAppearance: "none",
    width: "18px",
    height: "18px",
    border: `1px solid ${t.checkBorder}`,
    borderRadius: "7px",
    cursor: "pointer",
    display: "inline-block",
    verticalAlign: "middle",
    outline: "none",
    boxShadow: "none",
    backgroundColor: checked ? t.checkOn : t.checkOff,
    position: "relative",
  });

  const focusOn = (e) => {
    e.currentTarget.style.borderColor = t.focusBorder;
    e.currentTarget.style.boxShadow = t.focusShadow;
  };
  const focusOff = (border) => (e) => {
    e.currentTarget.style.borderColor = border;
    e.currentTarget.style.boxShadow = "none";
  };

  const modalInputBase = {
    padding: "10px 12px",
    fontSize: "14px",
    border: `1px solid ${t.modalInputBorder}`,
    outline: "none",
    boxSizing: "border-box",
    color: t.modalInputText,
    backgroundColor: t.inputBg,
  };

  const labelStyle = { display: "block", fontSize: "14px", fontWeight: 600, color: t.label, marginBottom: "8px" };

  const submitEnabled = !!newNama.trim();

  return (
    <div
      className={isDark ? "sp-dark" : ""}
      style={{
        margin: isFullscreen ? 0 : "-24px",
        width: isFullscreen ? "100%" : "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: t.bg,
        display: "flex",
        flexDirection: "column",
        color: t.text,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <header style={{ backgroundColor: t.headerBg, padding: "20px 32px 16px", borderBottom: `1px solid ${t.headerBorder}` }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <Link
              to="/daftar-lainnya"
              style={{
                display: "inline-block",
                fontSize: "14px",
                color: t.crumb,
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: "4px",
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 0.2s ease"
              }}
            >
              Daftar Lainnya
            </Link>
            <h1 style={{ fontSize: "23px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.01em" }}>
              Syarat Pembayaran
            </h1>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: t.btnBg, color: t.btnText,
              fontSize: "13px", fontWeight: isDark ? 600 : 500, padding: "8px 16px", border: "none", borderRadius: "4px",
              boxShadow: t.Shadow, cursor: "pointer", transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.btnBgHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = t.btnBg; }}
          >
            <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Buat Syarat Pembayaran Baru</span>
          </button>
        </div>
      </header>

      <main style={{ width: "100%", padding: "24px 32px", boxSizing: "border-box", backgroundColor: t.mainBg }}>
        <div style={{
          backgroundColor: t.cardBg,
          padding: 20,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: isDark
            ? "0 8px 30px rgba(201, 77, 0, 0.2), 0 0 0 1px rgba(229, 184, 92, 0.15)"
            : "0 4px 12px rgba(0, 0, 0, 0.22)",
          border: isDark ? "1px solid #634f27" : "1px solid transparent"
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <div style={{ position: "relative", width: "230px" }}>
              <span style={{ position: "absolute", top: 0, bottom: 0, left: "10px", display: "flex", alignItems: "center", pointerEvents: "none", color: t.searchIcon }}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Ketik untuk mencari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box", padding: "6px 12px 6px 32px", fontSize: "13px", color: t.inputText,
                  border: `1px solid ${t.searchBorder}`, borderRadius: "8px", outline: "none", backgroundColor: t.inputBg,
                }}
                onFocus={focusOn}
                onBlur={focusOff(t.searchBorder)}
              />
            </div>
          </div>

          <div style={{ border: `1px solid ${t.tableBorder}`, borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.tableBorder}`, backgroundColor: t.theadBg }}>
                  <th style={{ width: "48px", padding: "12px 16px", textAlign: "center", verticalAlign: "middle" }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      style={checkboxFor(allSelected)}
                    />
                  </th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: t.th }}>Nama</th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: t.th }}>Jangka Waktu</th>
                  <th style={{ width: "192px", padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: t.th, textAlign: "right" }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: `1px solid ${t.rowBorder}`, transition: "background-color 0.15s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.rowHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <td style={{ padding: "12px 16px", textAlign: "center", verticalAlign: "middle" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                        style={checkboxFor(selectedIds.includes(row.id))}
                      />
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: t.td }}>{row.nama}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: t.td }}>{row.jangkaWaktu} hari</td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
                        <button
                          type="button"
                          title="Hapus"
                          onClick={() => handleDelete(row.id)}
                          style={iconBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = t.danger; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = t.icon; }}
                        >
                          <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px 16px", textAlign: "center", fontSize: "13px", color: t.muted }}>
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: t.pager, paddingTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Tampilkan</span>

              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <select
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundImage: "none",
                    padding: "4px 28px 4px 10px",
                    fontSize: "13px",
                    border: `1px solid ${t.selectBorder}`,
                    borderRadius: "6px",
                    backgroundColor: t.selectBg,
                    color: t.selectText,
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    lineHeight: "1.5",
                  }}
                  onFocus={focusOn}
                  onBlur={focusOff(t.selectBorder)}
                >
                  <option value="100">100</option>
                  <option value="50">50</option>
                  <option value="25">25</option>
                </select>
                <svg
                  style={{ position: "absolute", right: "8px", pointerEvents: "none", color: t.selectArrow }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <span>dari {filteredRows.length} baris</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ cursor: "pointer", color: t.pagerArrow, userSelect: "none" }}>|&lt;</span>
              <span style={{ cursor: "pointer", color: t.pagerArrow, userSelect: "none" }}>&lt;</span>
              <input
                type="text"
                value="1"
                readOnly
                style={{
                  width: "32px",
                  textAlign: "center",
                  border: `1px solid ${t.selectBorder}`,
                  borderRadius: "4px",
                  padding: "4px",
                  fontSize: "13px",
                  outline: "none",
                  color: t.pageInputText,
                  backgroundColor: t.inputBg,
                }}
              />
              <span>dari 1</span>
              <span style={{ cursor: "pointer", color: t.pagerArrow, userSelect: "none" }}>&gt;</span>
              <span style={{ cursor: "pointer", color: t.pagerArrow, userSelect: "none" }}>&gt;|</span>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: t.overlay,
            backdropFilter: isDark ? "blur(4px)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: t.modalBg,
              border: t.modalBorder,
              borderRadius: "8px",
              width: "100%",
              maxWidth: "450px",
              padding: "24px",
              boxShadow: t.modalShadow,
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmitCreate}>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Nama</label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  autoFocus
                  style={{ ...modalInputBase, width: "100%", borderRadius: "6px" }}
                  onFocus={focusOn}
                  onBlur={focusOff(t.modalInputBorder)}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Jangka Waktu</label>
                <div style={{ display: "flex" }}>
                  <input
                    type="number"
                    value={newJangkaWaktu}
                    onChange={(e) => setNewJangkaWaktu(e.target.value)}
                    style={{ ...modalInputBase, flex: 1, borderRight: "none", borderRadius: "6px 0 0 6px" }}
                    onFocus={focusOn}
                    onBlur={focusOff(t.modalInputBorder)}
                  />
                  <div
                    style={{
                      padding: "10px 16px",
                      backgroundColor: t.addonBg,
                      border: `1px solid ${t.addonBorder}`,
                      borderRadius: "0 6px 6px 0",
                      fontSize: "14px",
                      color: t.addonText,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    hari
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: t.cancel,
                    cursor: "pointer",
                    padding: "8px 12px",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = t.cancelHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t.cancel; }}
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={!submitEnabled}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: submitEnabled ? t.submitOnText : t.submitOffText,
                    backgroundColor: submitEnabled ? t.submitOnBg : t.submitOffBg,
                    border: "none",
                    borderRadius: "6px",
                    cursor: submitEnabled ? "pointer" : "not-allowed",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (submitEnabled) e.currentTarget.style.backgroundColor = t.submitOnHover; }}
                  onMouseLeave={(e) => { if (submitEnabled) e.currentTarget.style.backgroundColor = t.submitOnBg; }}
                >
                  Buat Syarat Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .sp-dark { color-scheme: dark; }
        .sp-dark input::placeholder { color: #94a3b8; }
        .sp-dark select option { background: #262626; color: #f1f5f9; }
        .sp-dark input[type="checkbox"]:checked {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%23121212' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='2.5 6 5 8.5 9.5 3.5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 12px 12px;
        }
        .sp-dark input[type="checkbox"]:hover { border-color: #E5B85C !important; }
      `}</style>
    </div>
  );
}