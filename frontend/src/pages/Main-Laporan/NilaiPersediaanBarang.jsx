import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function NilaiPersediaanBarang() {
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
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", label: "#e2e8f0", drawerLabel: "#e2e8f0",
      strong: "#ffffff", radioText: "#cbd5e1",
      panel: "#1a1a1a", panelBorder: "#634f27", divider: "#3a3326",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9",
      icon: "#E5B85C", iconMuted: "#94a3b8",
      accent: "#E5B85C", accentText: "#121212", primary: "#E5B85C", primaryHover: "#f0c978",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddSel: "rgba(229,184,92,0.2)", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326", overlay: "rgba(0, 0, 0, 0.7)", ghostText: "#cbd5e1",
      tableHeadBg: "#262626", tableHeadText: "#e2e8f0", tableBorder: "#3a3326",
      rowEven: "#1a1a1a", rowOdd: "#202020", rowText: "#cbd5e1", rowStrong: "#f1f5f9",
      modalBg: "#1a1a1a", modalFooter: "#202020", codeBg: "#262626", codeBorder: "#634f27",
      pdfIcon: "#cbd5e1", illuBright: "brightness(0.85) saturate(0.9)",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#1e293b", muted: "#64748b", label: "#334155", drawerLabel: "#334155",
      strong: "#475569", radioText: "#334155",
      panel: "#ffffff", panelBorder: "#e2e8f0", divider: "#f1f5f9",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#1e293b",
      icon: "#64748b", iconMuted: "#64748b",
      accent: "#4361ee", accentText: "#ffffff", primary: "#4361ee", primaryHover: "#3451d1",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#cbd5e1", btnText: "#4361ee",
      ddBg: "#ffffff", ddBorder: "#e2e8f0", ddText: "#334155", ddHover: "#f1f5f9",
      ddSel: "#f1f5f9", ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      drawerBg: "#ffffff", drawerBorder: "#f1f5f9", overlay: "rgba(15, 23, 42, 0.4)", ghostText: "#475569",
      tableHeadBg: "#f8fafc", tableHeadText: "#475569", tableBorder: "#f1f5f9",
      rowEven: "#ffffff", rowOdd: "#fafafa", rowText: "#334155", rowStrong: "#1e293b",
      modalBg: "#ffffff", modalFooter: "#f8fafc", codeBg: "#f8fafc", codeBorder: "#cbd5e1",
      pdfIcon: "#64748b", illuBright: "none",
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
      nav: "#64748b", accent: "#0284c7", weekday: "#94a3b8",
      selBg: "#0284c7", selText: "#ffffff", todayBg: "#e0f2fe", todayText: "#0284c7",
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

  // Tanggal Awal State
  const startDatePickerRef = useRef(null);
  const [startDate, setStartDate] = useState(() => new Date(2026, 8, 22));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("22/09/2026");

  // Tanggal Akhir State
  const endDatePickerRef = useRef(null);
  const [endDate, setEndDate] = useState(() => new Date(2026, 8, 22));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("22/09/2026");

  // Periode Dropdown State
  const periodeRef = useRef(null);
  const [periode, setPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor Dropdown State
  const eksporRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Modal Lihat Contoh
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Show Report State
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartDate, setDrawerStartDate] = useState(() => new Date(2026, 8, 22));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDateStr, setDrawerStartDateStr] = useState("22/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndDate, setDrawerEndDate] = useState(() => new Date(2026, 8, 22));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDateStr, setDrawerEndDateStr] = useState("22/09/2026");

  const drawerPeriodeRef = useRef(null);
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const drawerKategoriRef = useRef(null);
  const [drawerKategori, setDrawerKategori] = useState("Semua kategori produk");
  const [showDrawerKategoriDropdown, setShowDrawerKategoriDropdown] = useState(false);

  const [drawerCakupKategori, setDrawerCakupKategori] = useState("mencakup");

  const drawerProdukRef = useRef(null);
  const [drawerProduk, setDrawerProduk] = useState("Semua produk");
  const [showDrawerProdukDropdown, setShowDrawerProdukDropdown] = useState(false);

  useEffect(() => { setStartDateStr(formatDateDDMMYYYY(startDate)); }, [startDate]);
  useEffect(() => { setEndDateStr(formatDateDDMMYYYY(endDate)); }, [endDate]);
  useEffect(() => { setDrawerStartDateStr(formatDateDDMMYYYY(drawerStartDate)); }, [drawerStartDate]);
  useEffect(() => { setDrawerEndDateStr(formatDateDDMMYYYY(drawerEndDate)); }, [drawerEndDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (periodeRef.current && !periodeRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (eksporRef.current && !eksporRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerKategoriRef.current && !drawerKategoriRef.current.contains(event.target)) setShowDrawerKategoriDropdown(false);
      if (drawerProdukRef.current && !drawerProdukRef.current.contains(event.target)) setShowDrawerProdukDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 300);
  };

  const handleApplyFilter = () => {
    setShowReport(true);
    closeFilterDrawer();
  };

  const handleResetFilter = () => {
    setDrawerPeriode("Hari ini");
    setDrawerKategori("Semua kategori produk");
    setDrawerCakupKategori("mencakup");
    setDrawerProduk("Semua produk");
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

  const mainLabelStyle = { fontSize: "12px", fontWeight: 600, color: t.label, marginBottom: "6px" };
  const mainFieldStyle = {
    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    cursor: "pointer", boxSizing: "border-box",
  };
  const mainSelectStyle = {
    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box",
  };
  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.drawerLabel };
  const drawerFieldStyle = {
    width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "36px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "8px",
    cursor: "pointer", boxSizing: "border-box",
  };
  const drawerSelectStyle = {
    width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box",
  };

  const renderRadio = (name, checked, onChange, label) => (
    <label key={label} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: t.radioText, fontWeight: 500 }}>
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }} />
      {label}
    </label>
  );

  const chevron = (size = "16px") => (
    <svg style={{ width: size, height: size, color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
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

  const sampleReportData = [
    { code: "PRD-001", name: "Laptop ASUS Zenbook 14", qty: 48, value: "Rp 672.000.000" },
    { code: "PRD-002", name: "Monitor Dell UltraSharp 27", qty: 30, value: "Rp 195.000.000" },
    { code: "PRD-003", name: "Keyboard Keychron K2 Wireless", qty: 40, value: "Rp 58.000.000" },
    { code: "PRD-004", name: "Mouse Logitech MX Master 3S", qty: 15, value: "Rp 26.250.000" },
  ];

  const periodeOptions = ["Hari ini", "7 hari terakhir", "30 hari terakhir"];

  const calendarIcon = (size, onClick, extraStyle) => (
    <svg
      onClick={onClick}
      style={{ width: size, height: size, color: t.icon, cursor: "pointer", ...extraStyle }}
      fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
    >
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );

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
          Nilai persediaan barang{" "}
          <span style={{ fontSize: "14px", fontWeight: 400, color: t.muted }}>(dalam IDR)</span>
        </h1>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>

        {/* Filter and Actions Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>

          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>

            {/* Tanggal Awal */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="input-tanggal-awal" style={mainLabelStyle}>
                Tanggal awal
              </label>
              <div style={{ position: "relative", width: "150px" }} ref={startDatePickerRef}>
                <input
                  id="input-tanggal-awal"
                  type="text"
                  readOnly
                  value={startDateStr}
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                  style={mainFieldStyle}
                />
                <span onClick={() => setShowStartCalendar(!showStartCalendar)} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: t.icon, display: "flex" }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </span>
                {showStartCalendar && renderCalendarPopup(startDate, setStartDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
              </div>
            </div>

            {/* Tanggal Akhir */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="input-tanggal-akhir" style={mainLabelStyle}>
                Tanggal akhir
              </label>
              <div style={{ position: "relative", width: "150px" }} ref={endDatePickerRef}>
                <input
                  id="input-tanggal-akhir"
                  type="text"
                  readOnly
                  value={endDateStr}
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                  style={mainFieldStyle}
                />
                <span onClick={() => setShowEndCalendar(!showEndCalendar)} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: t.icon, display: "flex" }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </span>
                {showEndCalendar && renderCalendarPopup(endDate, setEndDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false))}
              </div>
            </div>

            {/* Periode Dropdown */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={periodeRef}>
              <label htmlFor="select-periode" style={mainLabelStyle}>
                Periode
              </label>
              <div style={{ position: "relative", width: "150px" }}>
                <div
                  id="select-periode"
                  onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                  style={mainSelectStyle}
                >
                  <span>{periode}</span>
                  {chevron("14px")}
                </div>
                {showPeriodeDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "6px" }}>
                    {periodeOptions.map((opt) =>
                      renderDdItem(opt, periode === opt, () => { setPeriode(opt); setShowPeriodeDropdown(false); })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Tampilkan */}
            <button
              type="button"
              onClick={() => setShowReport(true)}
              style={{
                height: "36px", padding: "0 20px", backgroundColor: t.primary, color: t.accentText, fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                transition: "background-color 0.15s ease",
              }}
              {...hoverBg(t.primary, t.primaryHover)}
            >
              Tampilkan
            </button>

            {/* Tombol Filter */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px", padding: "0 16px", backgroundColor: t.btnBg, color: t.btnText, fontSize: "13px",
                fontWeight: 500, border: `1px solid ${t.btnBorder}`, borderRadius: "6px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px", transition: "background-color 0.15s ease",
              }}
              {...hoverBg(t.btnBg, t.btnHover)}
            >
              <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </button>
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>

            {/* Ekspor Dropdown */}
            <div style={{ position: "relative" }} ref={eksporRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "36px", padding: "0 16px", backgroundColor: t.btnBg, color: isDark ? t.btnText : "#334155", fontSize: "13px",
                  fontWeight: 500, border: `1px solid ${t.btnBorder}`, borderRadius: "6px", cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                Ekspor
              </button>

              {showEksporDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", borderRadius: "6px" }}>
                  {["CSV", "XLSX", "PDF"].map((fmt) =>
                    renderDdItem(fmt, false, () => { setShowEksporDropdown(false); alert(`Mengekspor laporan ke format ${fmt}...`); }, "12px")
                  )}
                </div>
              )}
            </div>

            {/* Lihat Contoh */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowTemplateModal(true); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: isDark ? t.btnText : "#2563eb", textDecoration: "none" }}
            >
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                <svg style={{ width: "16px", height: "16px", color: t.pdfIcon }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <span style={{ position: "absolute", left: "-4px", bottom: "2px", backgroundColor: "#ef4444", fontSize: "8px", fontWeight: 700, color: "#ffffff", padding: "0 2px", borderRadius: "2px", lineHeight: 1, transform: "scale(0.75)", transformOrigin: "bottom left", pointerEvents: "none" }}>
                  PDF
                </span>
              </span>
              <span>Lihat contoh</span>
            </a>
          </div>
        </section>

        {/* Content Section: Empty State or Report View */}
        {!showReport ? (
          <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "32px", paddingBottom: "64px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "440px" }}>
              {/* 3D Graphic Composition */}
              <div
                style={{
                  width: "224px",
                  height: "192px",
                  position: "relative",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "100%", height: "100%" }}
                  fill="none"
                  viewBox="0 0 240 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="platGrad" x1="50" y1="130" x2="190" y2="175" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#edf4fc" />
                      <stop offset="100%" stopColor="#dce9f8" />
                    </linearGradient>
                    <linearGradient id="donut1Grad" x1="20" y1="40" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f687b3" />
                      <stop offset="60%" stopColor="#e25d97" />
                      <stop offset="100%" stopColor="#cc3e7f" />
                    </linearGradient>
                    <linearGradient id="donut2Grad" x1="160" y1="60" x2="220" y2="130" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f687b3" />
                      <stop offset="100%" stopColor="#db5792" />
                    </linearGradient>
                    <linearGradient id="barBlue" x1="95" y1="70" x2="125" y2="140" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#9aaee8" />
                      <stop offset="100%" stopColor="#708be0" />
                    </linearGradient>
                    <linearGradient id="barTall" x1="120" y1="50" x2="145" y2="135" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#e9f0fc" />
                      <stop offset="100%" stopColor="#ccd8f1" />
                    </linearGradient>
                    <linearGradient id="arrowGrad" x1="110" y1="130" x2="170" y2="70" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ed5895" />
                      <stop offset="100%" stopColor="#f673a9" />
                    </linearGradient>
                    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
                      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#a4b7d3" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Shadow base beneath the platform */}
                  <ellipse cx="120" cy="165" rx="72" ry="18" fill="#d0dcf0" opacity="0.6" filter="url(#softShadow)" />

                  {/* Isometric Platform Top Base */}
                  <path d="M120 132 L185 152 L120 172 L55 152 Z" fill="url(#platGrad)" />
                  <path d="M55 152 L120 172 L120 177 L55 157 Z" fill="#c3d5ee" />
                  <path d="M120 172 L185 152 L185 157 L120 177 Z" fill="#b1c6e4" />

                  {/* Floating Pink Donut/Pie Chart - Left */}
                  <g transform="translate(18, 25)">
                    <ellipse cx="60" cy="60" rx="26" ry="34" fill="#be2e6f" transform="rotate(-25 60 60)" />
                    <ellipse cx="60" cy="56" rx="25" ry="33" fill="url(#donut1Grad)" transform="rotate(-25 60 56)" />
                    <ellipse cx="60" cy="56" rx="10" ry="15" fill="#fdf2f8" transform="rotate(-25 60 56)" />
                  </g>

                  {/* 3D Bar 1 - Front/Left Light White Column */}
                  <path d="M85 125 L98 120 L98 142 L85 147 Z" fill="#e2ebf7" />
                  <path d="M98 120 L108 124 L108 146 L98 142 Z" fill="#cbd7ec" />
                  <path d="M85 125 L98 120 L108 124 L95 129 Z" fill="#f4f8fe" />

                  {/* 3D Bar 2 - Blue Column (Medium) */}
                  <path d="M100 95 L116 88 L116 138 L100 144 Z" fill="url(#barBlue)" />
                  <path d="M116 88 L126 92 L126 142 L116 138 Z" fill="#5874cb" />
                  <path d="M100 95 L116 88 L126 92 L110 99 Z" fill="#b1c2f2" />

                  {/* 3D Bar 3 - Tallest Light Column */}
                  <path d="M118 70 L134 64 L134 135 L118 140 Z" fill="url(#barTall)" />
                  <path d="M134 64 L144 68 L144 138 L134 135 Z" fill="#b9cbed" />
                  <path d="M118 70 L134 64 L144 68 L128 74 Z" fill="#ffffff" />

                  {/* Upward Trending 3D Curved Arrow (Magenta/Pink) */}
                  <path
                    d="M102 140 C 114 132, 126 122, 140 102 C 146 92, 153 76, 160 68"
                    fill="none"
                    stroke="url(#arrowGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path d="M152 64 L168 62 L164 78 Z" fill="#ec4899" />
                  <path
                    d="M105 137 C 116 130, 126 120, 138 103 C 143 95, 148 83, 155 74"
                    fill="none"
                    stroke="#ff85bb"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />

                  {/* Floating Pink Donut/Pie Chart - Right */}
                  <g transform="translate(130, 48)">
                    <ellipse cx="48" cy="50" rx="19" ry="24" fill="#a8235f" transform="rotate(18 48 50)" />
                    <ellipse cx="48" cy="47" rx="18" ry="23" fill="url(#donut2Grad)" transform="rotate(18 48 47)" />
                    <ellipse cx="48" cy="47" rx="7" ry="10" fill="#fdf2f8" transform="rotate(18 48 47)" />
                  </g>
                </svg>
              </div>
              <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.6, margin: 0 }}>
                Pilih tanggal atau periode, lalu klik tombol <span style={{ fontWeight: 600, color: t.strong }}>Tampilkan</span>.
              </p>
            </div>
          </section>
        ) : (
          <section style={{ flex: 1, backgroundColor: t.panel, borderRadius: "8px", border: `1px solid ${t.panelBorder}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: t.tableHeadBg, borderBottom: `1px solid ${t.panelBorder}`, color: t.tableHeadText, fontWeight: 600 }}>
                  <th style={{ padding: "12px 16px" }}>Kode Produk</th>
                  <th style={{ padding: "12px 16px" }}>Nama Produk</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Kuantitas</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Nilai</th>
                </tr>
              </thead>
              <tbody>
                {sampleReportData.map((item, idx) => (
                  <tr key={item.code} style={{ borderBottom: idx === sampleReportData.length - 1 ? "none" : `1px solid ${t.tableBorder}`, backgroundColor: idx % 2 === 0 ? t.rowEven : t.rowOdd }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: t.rowStrong }}>{item.code}</td>
                    <td style={{ padding: "12px 16px", color: t.rowText }}>{item.name}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: t.rowText }}>{item.qty}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: t.rowStrong }}>{item.value}</td>
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
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Filter laporan</h2>
              <button type="button" onClick={closeFilterDrawer} style={{ border: "none", background: "none", fontSize: "18px", color: t.iconMuted, cursor: "pointer", padding: "4px" }}>
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Tanggal awal - akhir */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={drawerLabelStyle}>Tanggal awal</label>
                  <div style={{ position: "relative" }} ref={drawerStartDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerStartDateStr}
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={drawerFieldStyle}
                    />
                    {calendarIcon("18px", () => setShowDrawerStartCalendar(!showDrawerStartCalendar), { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" })}
                    {showDrawerStartCalendar &&
                      renderCalendarPopup(
                        drawerStartDate, setDrawerStartDate,
                        drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                        drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                        drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                        () => setShowDrawerStartCalendar(false)
                      )}
                  </div>
                </div>

                <span style={{ paddingBottom: "10px", color: t.iconMuted, fontSize: "13px" }}>-</span>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={drawerLabelStyle}>Tanggal akhir</label>
                  <div style={{ position: "relative" }} ref={drawerEndDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDateStr}
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={drawerFieldStyle}
                    />
                    {calendarIcon("18px", () => setShowDrawerEndCalendar(!showDrawerEndCalendar), { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" })}
                    {showDrawerEndCalendar &&
                      renderCalendarPopup(
                        drawerEndDate, setDrawerEndDate,
                        drawerEndCalendarViewDate, setDrawerEndCalendarViewDate,
                        drawerEndCalendarViewMode, setDrawerEndCalendarViewMode,
                        drawerEndYearRangeStart, setDrawerEndYearRangeStart,
                        () => setShowDrawerEndCalendar(false), true
                      )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodeRef}>
                <label style={drawerLabelStyle}>Periode</label>
                <div style={{ position: "relative" }}>
                  <div onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)} style={drawerSelectStyle}>
                    <span>{drawerPeriode}</span>
                    {chevron()}
                  </div>
                  {showDrawerPeriodeDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {periodeOptions.map((opt) =>
                        renderDdItem(opt, drawerPeriode === opt, () => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Kategori produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerKategoriRef}>
                <label style={drawerLabelStyle}>Kategori produk</label>
                <div style={{ position: "relative" }}>
                  <div onClick={() => setShowDrawerKategoriDropdown(!showDrawerKategoriDropdown)} style={drawerSelectStyle}>
                    <span>{drawerKategori}</span>
                    {chevron()}
                  </div>
                  {showDrawerKategoriDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {["Semua kategori produk", "Elektronik", "Aksesoris"].map((opt) =>
                        renderDdItem(opt, drawerKategori === opt, () => { setDrawerKategori(opt); setShowDrawerKategoriDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mencakup semua / Salah satu */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                {renderRadio("cakupKategoriNilai", drawerCakupKategori === "mencakup", () => setDrawerCakupKategori("mencakup"), "Mencakup semua")}
                {renderRadio("cakupKategoriNilai", drawerCakupKategori === "salahsatu", () => setDrawerCakupKategori("salahsatu"), "Salah satu")}
                <svg style={{ width: "15px", height: "15px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>

              {/* Produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerProdukRef}>
                <label style={drawerLabelStyle}>Produk</label>
                <div style={{ position: "relative" }}>
                  <div onClick={() => setShowDrawerProdukDropdown(!showDrawerProdukDropdown)} style={drawerSelectStyle}>
                    <span>{drawerProduk}</span>
                    {chevron()}
                  </div>
                  {showDrawerProdukDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {["Semua produk", "Laptop ASUS Zenbook 14", "Monitor Dell UltraSharp 27"].map((opt) =>
                        renderDdItem(opt, drawerProduk === opt, () => { setDrawerProduk(opt); setShowDrawerProdukDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: t.drawerBg }}>
              <button
                type="button"
                onClick={handleResetFilter}
                style={{
                  background: "none", border: "none", color: t.btnText, fontSize: "13px", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: 0
                }}
              >
                <svg style={{ width: "15px", height: "15px", strokeWidth: 2.2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset filter
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{ height: "38px", padding: "0 18px", backgroundColor: "transparent", color: t.ghostText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer" }}
                  onMouseEnter={(e) => { if (isDark) e.currentTarget.style.color = "#E5B85C"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t.ghostText; }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  style={{ height: "38px", padding: "0 24px", backgroundColor: t.primary, color: t.accentText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "background-color 0.15s ease" }}
                  {...hoverBg(t.primary, t.primaryHover)}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lihat Contoh */}
      {showTemplateModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, backgroundColor: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{
            backgroundColor: t.modalBg, borderRadius: "8px", width: "500px", maxWidth: "90vw",
            border: isDark ? `1px solid ${t.panelBorder}` : "none",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", overflow: "hidden", display: "flex", flexDirection: "column"
          }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.panelBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Contoh Laporan Nilai Persediaan Barang</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: t.iconMuted, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px", fontSize: "13px", color: t.rowText, lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 12px 0" }}>Berikut adalah pratinjau format standar laporan Nilai Persediaan Barang yang siap diekspor ke PDF / Excel:</p>
              <div style={{ backgroundColor: t.codeBg, border: `1px solid ${t.codeBorder}`, borderRadius: "6px", padding: "12px", fontSize: "12px", fontFamily: "monospace", color: t.text }}>
                <div><strong>Judul:</strong> Nilai Persediaan Barang (dalam IDR)</div>
                <div><strong>Periode:</strong> {startDateStr} - {endDateStr} ({periode})</div>
                <hr style={{ border: "none", borderTop: `1px dashed ${t.codeBorder}`, margin: "8px 0" }} />
                <div>[Kode] | [Nama Produk] | [Kuantitas] | [Total Nilai]</div>
                <div>PRD-001 | Laptop ASUS | 48 | Rp 672.000.000</div>
                <div>PRD-002 | Monitor Dell | 30 | Rp 195.000.000</div>
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${t.panelBorder}`, display: "flex", justifyContent: "flex-end", backgroundColor: t.modalFooter }}>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                style={{ padding: "6px 16px", backgroundColor: t.primary, color: t.accentText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer", transition: "background-color 0.15s ease" }}
                {...hoverBg(t.primary, t.primaryHover)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}