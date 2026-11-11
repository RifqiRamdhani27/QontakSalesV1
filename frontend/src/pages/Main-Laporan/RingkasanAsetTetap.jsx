import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function RingkasanAsetTetap() {
  const outletContext = useOutletContext();
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Dark Mode
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

  // Palet halaman
  const t = isDark
    ? {
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", label: "#e2e8f0",
      strong: "#ffffff", radioText: "#cbd5e1", placeholder: "#94a3b8",
      panel: "#1a1a1a", panelBorder: "#634f27", divider: "#3a3326",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9", underline: "#634f27",
      icon: "#E5B85C", iconMuted: "#94a3b8",
      accent: "#E5B85C", accentText: "#121212", primary: "#E5B85C", primaryHover: "#f0c978",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddSel: "rgba(229,184,92,0.2)", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326", overlay: "rgba(0, 0, 0, 0.7)", ghostText: "#cbd5e1",
      tableHeadBg: "#262626", tableHeadText: "#e2e8f0", tableBorder: "#3a3326",
      rowEven: "#1a1a1a", rowOdd: "#202020", rowText: "#cbd5e1", rowStrong: "#f1f5f9",
      chipBg: "#262626", chipBorder: "#634f27", chipText: "#f1f5f9",
      applyBg: "#E5B85C", applyText: "#121212", helpBg: "#E5B85C", helpText: "#121212",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#1e293b", muted: "#64748b", label: "#64748b",
      strong: "#475569", radioText: "#334155", placeholder: "#94a3b8",
      panel: "#ffffff", panelBorder: "#e2e8f0", divider: "#f1f5f9",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#1e293b", underline: "#cbd5e1",
      icon: "#64748b", iconMuted: "#64748b",
      accent: "#2f6f80", accentText: "#ffffff", primary: "#2f6f80", primaryHover: "#265a68",
      btnBg: "#ffffff", btnHover: "#f1f7f9", btnBorder: "#2f6f80", btnText: "#2f6f80",
      ddBg: "#ffffff", ddBorder: "#e2e8f0", ddText: "#334155", ddHover: "#f1f5f9",
      ddSel: "#f1f5f9", ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      drawerBg: "#ffffff", drawerBorder: "#f1f5f9", overlay: "rgba(15, 23, 42, 0.4)", ghostText: "#94a3b8",
      tableHeadBg: "#f8fafc", tableHeadText: "#475569", tableBorder: "#f1f5f9",
      rowEven: "#ffffff", rowOdd: "#fafafa", rowText: "#334155", rowStrong: "#1e293b",
      chipBg: "#ffffff", chipBorder: "#cbd5e1", chipText: "#334155",
      applyBg: "#4caf50", applyText: "#ffffff", helpBg: "#2563eb", helpText: "#ffffff",
    };

  // Palet kalender
  const c = isDark
    ? {
      popBg: "#1a1a1a", popBorder: "#634f27",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      nav: "#f1f5f9", accent: "#E5B85C", weekday: "#94a3b8",
      selBg: "#E5B85C", selText: "#121212", todayBg: "rgba(229,184,92,0.2)", todayText: "#E5B85C",
      dayText: "#f1f5f9", monthBg: "#262626", hoverBg: "#2d2d2d", divider: "#3a3326",
    }
    : {
      popBg: "#ffffff", popBorder: "#cbd5e1",
      shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      nav: "#64748b", accent: "#2f6f80", weekday: "#94a3b8",
      selBg: "#2f6f80", selText: "#ffffff", todayBg: "#e0eef2", todayText: "#2f6f80",
      dayText: "#334155", monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
    };

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatDateDDMMYYYY = (date) => {
    if (!date) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Per (tanggal) - bar atas
  const perDatePickerRef = useRef(null);
  const [perDate, setPerDate] = useState(() => new Date(2026, 8, 22));
  const [perCalendarViewDate, setPerCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [perCalendarViewMode, setPerCalendarViewMode] = useState("days");
  const [perYearRangeStart, setPerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showPerCalendar, setShowPerCalendar] = useState(false);
  const [perDateStr, setPerDateStr] = useState("22/09/2026");

  // Filter sesuai periode - bar atas
  const periodeRef = useRef(null);
  const [periode, setPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor Dropdown
  const eksporRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Show Report
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter Lanjutan
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerPerDatePickerRef = useRef(null);
  const [drawerPerDate, setDrawerPerDate] = useState(() => new Date(2026, 8, 22));
  const [drawerPerCalendarViewDate, setDrawerPerCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [drawerPerCalendarViewMode, setDrawerPerCalendarViewMode] = useState("days");
  const [drawerPerYearRangeStart, setDrawerPerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerPerCalendar, setShowDrawerPerCalendar] = useState(false);
  const [drawerPerDateStr, setDrawerPerDateStr] = useState("22/09/2026");

  const drawerPeriodeRef = useRef(null);
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const akunOptions = ["Semua", "Aset Tetap - Kendaraan", "Aset Tetap - Peralatan Kantor", "Aset Tetap - Bangunan"];
  const drawerAkunRef = useRef(null);
  const [drawerAkun, setDrawerAkun] = useState(["Semua"]);
  const [showDrawerAkunDropdown, setShowDrawerAkunDropdown] = useState(false);

  const asetOptions = ["Semua", "Kendaraan Operasional", "Laptop & Komputer", "Mesin Produksi"];
  const drawerAsetRef = useRef(null);
  const [drawerAset, setDrawerAset] = useState(["Semua"]);
  const [showDrawerAsetDropdown, setShowDrawerAsetDropdown] = useState(false);

  const tagOptions = ["Prioritas", "Cabang Jakarta", "Cabang Surabaya", "Disusutkan"];
  const drawerTagRef = useRef(null);
  const [drawerTag, setDrawerTag] = useState([]);
  const [showDrawerTagDropdown, setShowDrawerTagDropdown] = useState(false);

  const [drawerCakupAkun, setDrawerCakupAkun] = useState("mencakup");

  useEffect(() => { setPerDateStr(formatDateDDMMYYYY(perDate)); }, [perDate]);
  useEffect(() => { setDrawerPerDateStr(formatDateDDMMYYYY(drawerPerDate)); }, [drawerPerDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (perDatePickerRef.current && !perDatePickerRef.current.contains(event.target)) setShowPerCalendar(false);
      if (periodeRef.current && !periodeRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (eksporRef.current && !eksporRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerPerDatePickerRef.current && !drawerPerDatePickerRef.current.contains(event.target)) setShowDrawerPerCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerAkunRef.current && !drawerAkunRef.current.contains(event.target)) setShowDrawerAkunDropdown(false);
      if (drawerAsetRef.current && !drawerAsetRef.current.contains(event.target)) setShowDrawerAsetDropdown(false);
      if (drawerTagRef.current && !drawerTagRef.current.contains(event.target)) setShowDrawerTagDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFilterDrawer = () => {
    setDrawerPerDate(perDate);
    setDrawerPeriode(periode);
    setShowFilterDrawer(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 300);
  };

  const handleApplyFilter = () => {
    setPerDate(drawerPerDate);
    setPeriode(drawerPeriode);
    setShowReport(true);
    closeFilterDrawer();
  };

  const addChip = (value, list, setList) => {
    if (!list.includes(value)) setList([...list, value]);
  };

  const removeChip = (value, list, setList) => {
    setList(list.filter((v) => v !== value));
  };

  // ---------- Helper tampilan ----------
  const hoverBg = (normal, hover) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = hover),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = normal),
  });

  const ddPanelStyle = {
    backgroundColor: t.ddBg,
    border: `1px solid ${t.ddBorder}`,
    boxShadow: t.ddShadow,
    padding: "4px 0",
  };

  const renderDdItem = (label, selected, onClick, fontSize = "13px") => (
    <div
      key={label}
      onClick={onClick}
      style={{ padding: "8px 12px", fontSize, color: t.ddText, cursor: "pointer", backgroundColor: selected ? t.ddSel : "transparent" }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = t.ddHover; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {label}
    </div>
  );

  // // Calendar
  const renderCalendarPopup = (
    selDate,
    setSelDate,
    viewDate,
    setViewDate,
    viewMode,
    setViewMode,
    rangeStart,
    setRangeStart,
    closeCalendar,
    alignRight = false
  ) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const handlePrev = () => {
      if (viewMode === "days") setViewDate(new Date(year, month - 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year - 1, month, 1));
      else setRangeStart(rangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else setRangeStart(rangeStart + 12);
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

    const navBtn = { border: "none", background: "none", cursor: "pointer", padding: "4px", color: c.nav, borderRadius: "4px" };

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 99,
          width: "280px",
          backgroundColor: c.popBg,
          borderRadius: "8px",
          boxShadow: c.shadow,
          border: `1px solid ${c.popBorder}`,
          padding: "14px 16px",
          userSelect: "none",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontSize: "14px", fontWeight: 700, color: c.accent }}>
            {viewMode === "days" && (
              <span onClick={() => setViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]} {year}</span>
            )}
            {viewMode === "months" && (
              <span onClick={() => setViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
            )}
            {viewMode === "years" && <span>{rangeStart} - {rangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textTransform: "uppercase", fontSize: "11px", color: c.weekday, fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>
              <div>Ming</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((dateObj, idx) => {
                if (!dateObj) return <div key={`empty-${idx}`} />;
                const isSelected = selDate && dateObj.toDateString() === selDate.toDateString();
                const isToday = dateObj.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={dateObj.toISOString()}
                    type="button"
                    onClick={() => { setSelDate(dateObj); closeCalendar(); }}
                    style={{
                      height: "32px",
                      width: "100%",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: isSelected ? c.selBg : isToday ? c.todayBg : "transparent",
                      color: isSelected ? c.selText : isToday ? c.todayText : c.dayText,
                      fontSize: "12px",
                      fontWeight: isSelected || isToday ? 600 : 400,
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => { if (!isSelected && !isToday) e.currentTarget.style.backgroundColor = c.hoverBg; }}
                    onMouseLeave={(e) => { if (!isSelected && !isToday) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {dateObj.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
                style={{
                  padding: "10px 4px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: month === idx ? c.selBg : c.monthBg,
                  color: month === idx ? c.selText : c.dayText,
                  fontSize: "12px",
                  fontWeight: month === idx ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                {mName.substring(0, 3)}
              </button>
            ))}
          </div>
        )}

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }, (_, i) => rangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => { setViewDate(new Date(yNum, month, 1)); setViewMode("months"); }}
                style={{
                  padding: "10px 4px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: year === yNum ? c.selBg : c.monthBg,
                  color: year === yNum ? c.selText : c.dayText,
                  fontSize: "12px",
                  fontWeight: year === yNum ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                {yNum}
              </button>
            ))}
          </div>
        )}

        {/* Tombol Today */}
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${c.divider}`, textAlign: "center" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const today = new Date();
              setSelDate(today);
              setViewDate(today);
              closeCalendar();
            }}
            style={{
              background: "none", border: "none", fontSize: "13px", fontWeight: 600,
              color: c.accent, cursor: "pointer", padding: "4px 8px", borderRadius: "4px",
            }}
          >
            Hari ini
          </button>
        </div>
      </div>
    );
  };

  // Field minimalis (label + value + border bawah) dipakai untuk "Per" dan "Filter sesuai periode"
  const renderUnderlineField = (label, valueNode, onClick, refObj, width = "170px") => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={refObj}>
      <label style={{ fontSize: "12px", color: t.label, fontWeight: 500 }}>{label}</label>
      <div
        onClick={onClick}
        style={{
          position: "relative", width, display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${t.underline}`, paddingBottom: "6px", cursor: "pointer"
        }}
      >
        {valueNode}
      </div>
    </div>
  );

  const renderChipBox = (label, list, setList, options, refObj, showDropdown, setShowDropdown) => {
    const remaining = options.filter((opt) => !list.includes(opt));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={refObj}>
        <label style={{ fontSize: "12px", color: t.label, fontWeight: 500 }}>{label}</label>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center",
              borderBottom: `1px solid ${t.underline}`, paddingBottom: "8px", minHeight: "20px", cursor: "pointer"
            }}
          >
            {list.length === 0 && <span style={{ fontSize: "13px", color: t.placeholder }}>Pilih {label.toLowerCase()}</span>}
            {list.map((item) => (
              <span
                key={item}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 8px",
                  border: `1px solid ${t.chipBorder}`, borderRadius: "4px", fontSize: "13px", color: t.chipText, backgroundColor: t.chipBg
                }}
              >
                {item}
                <span
                  onClick={(e) => { e.stopPropagation(); removeChip(item, list, setList); }}
                  style={{ cursor: "pointer", color: t.iconMuted, fontWeight: 700, lineHeight: 1 }}
                >
                  ✕
                </span>
              </span>
            ))}
          </div>
          {showDropdown && (
            <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "6px" }}>
              {remaining.map((opt) =>
                renderDdItem(opt, false, () => { addChip(opt, list, setList); setShowDropdown(false); })
              )}
              {remaining.length === 0 && (
                <div style={{ padding: "8px 12px", fontSize: "12px", color: t.placeholder }}>Semua opsi sudah dipilih</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const calendarIcon = () => (
    <svg style={{ width: "16px", height: "16px", color: t.icon }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );

  const chevronIcon = (color) => (
    <svg style={{ width: "14px", height: "14px", color: color || t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const renderRadio = (name, checked, onChange, label) => (
    <label key={label} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: t.radioText, fontWeight: 500 }}>
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ accentColor: isDark ? t.accent : "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
      {label}
    </label>
  );

  const periodeOptions = ["Hari ini", "7 hari terakhir", "30 hari terakhir"];

  const sampleReportData = [
    { code: "AT-001", name: "Kendaraan Operasional Avanza", category: "Kendaraan", acquisition: "Rp 250.000.000", depreciation: "Rp 62.500.000", bookValue: "Rp 187.500.000" },
    { code: "AT-002", name: "Gedung Kantor Pusat", category: "Bangunan", acquisition: "Rp 3.200.000.000", depreciation: "Rp 480.000.000", bookValue: "Rp 2.720.000.000" },
    { code: "AT-003", name: "Mesin Produksi CNC-200", category: "Mesin", acquisition: "Rp 890.000.000", depreciation: "Rp 178.000.000", bookValue: "Rp 712.000.000" },
    { code: "AT-004", name: "Laptop & Komputer Kantor", category: "Peralatan Kantor", acquisition: "Rp 145.000.000", depreciation: "Rp 58.000.000", bookValue: "Rp 87.000.000" },
  ];

  return (
    <div
      style={{
        margin: "-24px",
        width: "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: t.pageBg,
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >

      {/* Header */}
      <header style={{ width: "100%", padding: "20px 32px", borderBottom: `1px solid ${t.panelBorder}`, backgroundColor: t.panel, boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.01em" }}>
          Ringkasan Aset Tetap{" "}
          <span style={{ fontSize: "14px", fontWeight: 400, color: t.muted }}>(dalam IDR)</span>
        </h1>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column", backgroundColor: t.pageBg, boxSizing: "border-box" }}>

        {/* Filter and Actions Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>

          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "24px" }}>

            {/* Per (tanggal) */}
            <div style={{ position: "relative" }} ref={perDatePickerRef}>
              {renderUnderlineField(
                "Per",
                <>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: t.fieldText }}>{perDateStr}</span>
                  {calendarIcon()}
                </>,
                () => setShowPerCalendar(!showPerCalendar),
                null,
                "150px"
              )}
              {showPerCalendar && renderCalendarPopup(perDate, setPerDate, perCalendarViewDate, setPerCalendarViewDate, perCalendarViewMode, setPerCalendarViewMode, perYearRangeStart, setPerYearRangeStart, () => setShowPerCalendar(false))}
            </div>

            {/* Filter sesuai periode */}
            <div style={{ position: "relative" }} ref={periodeRef}>
              {renderUnderlineField(
                "Filter sesuai periode",
                <>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: t.fieldText }}>{periode}</span>
                  {chevronIcon()}
                </>,
                () => setShowPeriodeDropdown(!showPeriodeDropdown),
                null,
                "170px"
              )}
              {showPeriodeDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "170px", borderRadius: "6px" }}>
                  {periodeOptions.map((opt) =>
                    renderDdItem(opt, periode === opt, () => { setPeriode(opt); setShowPeriodeDropdown(false); })
                  )}
                </div>
              )}
            </div>

            {/* Tombol Filter */}
            <button
              type="button"
              onClick={() => setShowReport(true)}
              style={{
                height: "36px", padding: "0 24px", backgroundColor: t.primary, color: t.accentText, fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "4px", cursor: "pointer",
                transition: "background-color 0.15s ease"
              }}
              {...hoverBg(t.primary, t.primaryHover)}
            >
              Filter
            </button>

            {/* Tombol Filter lebih lanjut */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px", padding: "0 20px", backgroundColor: t.btnBg, color: t.btnText, fontSize: "13px",
                fontWeight: 500, border: `1px solid ${t.btnBorder}`, borderRadius: "4px", cursor: "pointer",
                transition: "background-color 0.15s ease"
              }}
              {...hoverBg(t.btnBg, t.btnHover)}
            >
              Filter lebih lanjut
            </button>
          </div>

          {/* Right Controls */}
          <div style={{ position: "relative" }} ref={eksporRef}>
            <button
              type="button"
              onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{
                height: "36px", padding: "0 16px", backgroundColor: t.primary, color: t.accentText, fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "4px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "background-color 0.15s ease"
              }}
              {...hoverBg(t.primary, t.primaryHover)}
            >
              <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Ekspor
              {chevronIcon("currentColor")}
            </button>

            {showEksporDropdown && (
              <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", borderRadius: "6px" }}>
                {["CSV", "XLSX", "PDF"].map((fmt) =>
                  renderDdItem(fmt, false, () => { setShowEksporDropdown(false); alert(`Mengekspor laporan ke format ${fmt}...`); }, "12px")
                )}
              </div>
            )}
          </div>
        </section>

        {/* Content Section: Empty State or Report View */}
        {!showReport ? (
          <section style={{ border: `1px solid ${t.panelBorder}`, borderRadius: "4px", padding: "64px 24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: t.panel }}>
            <p style={{ fontSize: "15px", fontWeight: 700, color: t.title, margin: 0, textAlign: "center" }}>
              Gunakan filter yang ada diatas untuk melihat laporan
            </p>
          </section>
        ) : (
          <section style={{ flex: 1, backgroundColor: t.panel, borderRadius: "4px", border: `1px solid ${t.panelBorder}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: t.tableHeadBg, borderBottom: `1px solid ${t.panelBorder}`, color: t.tableHeadText, fontWeight: 600 }}>
                  <th style={{ padding: "12px 16px" }}>Kode Aset</th>
                  <th style={{ padding: "12px 16px" }}>Nama Aset</th>
                  <th style={{ padding: "12px 16px" }}>Kategori</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Nilai Perolehan</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Akumulasi Penyusutan</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Nilai Buku</th>
                </tr>
              </thead>
              <tbody>
                {sampleReportData.map((item, idx) => (
                  <tr key={item.code} style={{ borderBottom: idx === sampleReportData.length - 1 ? "none" : `1px solid ${t.tableBorder}`, backgroundColor: idx % 2 === 0 ? t.rowEven : t.rowOdd }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: t.rowStrong }}>{item.code}</td>
                    <td style={{ padding: "12px 16px", color: t.rowText }}>{item.name}</td>
                    <td style={{ padding: "12px 16px", color: t.rowText }}>{item.category}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: t.rowText }}>{item.acquisition}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: t.rowText }}>{item.depreciation}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: t.rowStrong }}>{item.bookValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </main>

      {/* Drawer Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed", inset: 0, backgroundColor: t.overlay,
              opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s ease-in-out",
            }}
          />

          <div
            style={{
              position: "relative", width: "384px", maxWidth: "95vw", height: "100%",
              backgroundColor: t.drawerBg,
              borderLeft: isDark ? `1px solid ${t.panelBorder}` : "none",
              boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
              display: "flex", flexDirection: "column",
              colorScheme: isDark ? "dark" : "light",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out", zIndex: 101,
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.drawerBorder}` }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Filter Laporan</h2>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Per (tanggal) */}
              <div style={{ position: "relative" }} ref={drawerPerDatePickerRef}>
                {renderUnderlineField(
                  "Per",
                  <>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: t.fieldText }}>{drawerPerDateStr}</span>
                    {calendarIcon()}
                  </>,
                  () => setShowDrawerPerCalendar(!showDrawerPerCalendar),
                  null,
                  "100%"
                )}
                {showDrawerPerCalendar &&
                  renderCalendarPopup(
                    drawerPerDate, setDrawerPerDate,
                    drawerPerCalendarViewDate, setDrawerPerCalendarViewDate,
                    drawerPerCalendarViewMode, setDrawerPerCalendarViewMode,
                    drawerPerYearRangeStart, setDrawerPerYearRangeStart,
                    () => setShowDrawerPerCalendar(false)
                  )}
              </div>

              {/* Filter sesuai periode */}
              <div style={{ position: "relative" }} ref={drawerPeriodeRef}>
                {renderUnderlineField(
                  "Filter sesuai periode",
                  <>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: t.fieldText }}>{drawerPeriode}</span>
                    {chevronIcon()}
                  </>,
                  () => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown),
                  null,
                  "100%"
                )}
                {showDrawerPeriodeDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "6px" }}>
                    {periodeOptions.map((opt) =>
                      renderDdItem(opt, drawerPeriode === opt, () => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); })
                    )}
                  </div>
                )}
              </div>

              {/* Filter sesuai akun */}
              {renderChipBox("Filter sesuai akun", drawerAkun, setDrawerAkun, akunOptions, drawerAkunRef, showDrawerAkunDropdown, setShowDrawerAkunDropdown)}

              {/* Aset */}
              {renderChipBox("Aset", drawerAset, setDrawerAset, asetOptions, drawerAsetRef, showDrawerAsetDropdown, setShowDrawerAsetDropdown)}

              {/* Grup dengan Tag */}
              {renderChipBox("Grup dengan Tag", drawerTag, setDrawerTag, tagOptions, drawerTagRef, showDrawerTagDropdown, setShowDrawerTagDropdown)}

              {/* Mencakup Semua / Salah Satu */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {renderRadio("cakupAkunAset", drawerCakupAkun === "mencakup", () => setDrawerCakupAkun("mencakup"), "Mencakup Semua")}
                {renderRadio("cakupAkunAset", drawerCakupAkun === "salahsatu", () => setDrawerCakupAkun("salahsatu"), "Salah Satu")}
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: t.helpBg, color: t.helpText, fontSize: "10px", fontWeight: 700 }}>
                  ?
                </span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", gap: "10px", backgroundColor: t.drawerBg }}>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ flex: 1, height: "38px", backgroundColor: t.btnBg, color: isDark ? t.ghostText : "#94a3b8", fontSize: "13px", fontWeight: 600, border: `1px solid ${isDark ? t.btnBorder : "#cbd5e1"}`, borderRadius: "4px", cursor: "pointer", transition: "background-color 0.15s ease" }}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleApplyFilter}
                style={{ flex: 1, height: "38px", backgroundColor: t.applyBg, color: t.applyText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.15s ease" }}
                {...(isDark ? hoverBg(t.applyBg, t.primaryHover) : {})}
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}