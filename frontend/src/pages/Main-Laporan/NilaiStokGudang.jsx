import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function NilaiStokGudang() {
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
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8",
      headerBg: "#121212", headerBorder: "#634f27",
      label: "#e2e8f0", body: "#cbd5e1",
      inputBg: "#121212", inputText: "#f1f5f9", inputBorder: "#634f27", inputPlaceholder: "#94a3b8",
      icon: "#E5B85C", iconMuted: "#94a3b8",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212", primaryShadow: "0 1px 2px rgba(0,0,0,0.3)",
      outlineBg: "#262626", outlineHover: "#2d2d2d", outlineText: "#E5B85C", outlineBorder: "#634f27",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddSelected: "#2d2d2d", ddHover: "#2d2d2d",
      ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      divider: "#3a3326",
      link: "#E5B85C", accent: "#E5B85C",
      tableBorder: "#3a3326", tableHeadBg: "#1a1a1a", tableHeadText: "#e2e8f0", tableRowBorder: "#3a3326",
      tableTotalBorder: "#634f27", tableRowText: "#f1f5f9",
      note: "#94a3b8", noteIcon: "#94a3b8",
      pagerBorder: "#3a3326", pagerDisabledText: "#4b4b4b", pagerDisabledBg: "#121212",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326", drawerShadow: "-4px 0 25px rgba(0,0,0,0.6)",
      overlay: "rgba(0, 0, 0, 0.7)", closeBtn: "#94a3b8",
      cancelText: "#cbd5e1",
      modalOverlay: "rgba(0, 0, 0, 0.75)", modalBg: "#1a1a1a", modalBorder: "#634f27", modalFooterBg: "#121212",
      modalShadow: "0 20px 25px -5px rgba(0,0,0,0.6)",
      previewBg: "#121212", previewBorder: "#634f27", previewDash: "#634f27",
      pdfBadgeIcon: "#94a3b8",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#1e293b", muted: "#64748b",
      headerBg: "#ffffff", headerBorder: "#e2e8f0",
      label: "#334155", body: "#334155",
      inputBg: "#ffffff", inputText: "#1e293b", inputBorder: "#cbd5e1", inputPlaceholder: "#94a3b8",
      icon: "#64748b", iconMuted: "#64748b",
      primary: "#4361ee", primaryHover: "#3651d4", primaryText: "#ffffff", primaryShadow: "0 1px 2px rgba(67, 97, 238, 0.2)",
      outlineBg: "#ffffff", outlineHover: "#f9fafb", outlineText: "#4361ee", outlineBorder: "#cbd5e1",
      ddBg: "#ffffff", ddBorder: "#e2e8f0", ddText: "#334155", ddSelected: "#f1f5f9", ddHover: "#f8fafc",
      ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      divider: "#f1f5f9",
      link: "#2563eb", accent: "#4361ee",
      tableBorder: "#e2e8f0", tableHeadBg: "#f8fafc", tableHeadText: "#1e293b", tableRowBorder: "#f1f5f9",
      tableTotalBorder: "#e2e8f0", tableRowText: "#1e293b",
      note: "#64748b", noteIcon: "#94a3b8",
      pagerBorder: "#cbd5e1", pagerDisabledText: "#cbd5e1", pagerDisabledBg: "#ffffff",
      drawerBg: "#ffffff", drawerBorder: "#f1f5f9", drawerShadow: "-4px 0 25px rgba(0,0,0,0.15)",
      overlay: "rgba(15, 23, 42, 0.4)", closeBtn: "#64748b",
      cancelText: "#475569",
      modalOverlay: "rgba(15, 23, 42, 0.5)", modalBg: "#ffffff", modalBorder: "#e2e8f0", modalFooterBg: "#f8fafc",
      modalShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
      previewBg: "#f8fafc", previewBorder: "#cbd5e1", previewDash: "#cbd5e1",
      pdfBadgeIcon: "#64748b",
    };

  // Palet kalender
  const c = isDark
    ? {
      popBg: "#1a1a1a", popBorder: "#634f27",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      nav: "#f1f5f9", accent: "#E5B85C", weekday: "#94a3b8",
      selBg: "#E5B85C", selText: "#121212",
      todayBg: "#3a3326", todayText: "#E5B85C",
      dayText: "#f1f5f9", cellBg: "#262626", hoverBg: "#2d2d2d", divider: "#3a3326",
    }
    : {
      popBg: "#ffffff", popBorder: "#cbd5e1",
      shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      nav: "#64748b", accent: "#0284c7", weekday: "#94a3b8",
      selBg: "#0284c7", selText: "#ffffff",
      todayBg: "#e0f2fe", todayText: "#0284c7",
      dayText: "#334155", cellBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
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

  // Tanggal State
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 22));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateStr, setDateStr] = useState("22/09/2026");

  // Periode Dropdown State
  const periodeRef = useRef(null);
  const [periode, setPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Gudang Multi-select State
  const gudangRef = useRef(null);
  const [gudangSearch, setGudangSearch] = useState("");
  const [selectedGudang, setSelectedGudang] = useState(["All", "Unassigned"]);
  const [showGudangDropdown, setShowGudangDropdown] = useState(false);
  const gudangOptions = ["All", "Unassigned"];

  const toggleGudang = (name) => {
    setSelectedGudang((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    );
  };

  const clearAllGudang = () => setSelectedGudang([]);

  const gudangLabel =
    selectedGudang.length === 0
      ? "Tidak ada dipilih"
      : selectedGudang.length === gudangOptions.length
      ? "Semua dipilih"
      : `${selectedGudang.length} dipilih`;

  // Ekspor Dropdown State
  const eksporRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Modal Lihat Contoh
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Unassigned expand
  const [unassignedExpanded, setUnassignedExpanded] = useState(false);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsPerPageDropdown, setShowRowsPerPageDropdown] = useState(false);
  const rowsPerPageRef = useRef(null);

  // Drawer Filter State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerDatePickerRef = useRef(null);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 22));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);
  const [drawerDate, setDrawerDate] = useState("22/09/2026");

  const drawerPeriodeRef = useRef(null);
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const drawerGudangRef = useRef(null);
  const [drawerGudang, setDrawerGudang] = useState("Semua dipilih");
  const [showDrawerGudangDropdown, setShowDrawerGudangDropdown] = useState(false);

  const drawerKategoriRef = useRef(null);
  const [drawerKategori, setDrawerKategori] = useState("");
  const [showDrawerKategoriDropdown, setShowDrawerKategoriDropdown] = useState(false);

  const [drawerCakupKategori, setDrawerCakupKategori] = useState("mencakup");

  const drawerProdukRef = useRef(null);
  const [drawerProduk, setDrawerProduk] = useState("Semua produk");
  const [showDrawerProdukDropdown, setShowDrawerProdukDropdown] = useState(false);

  const drawerKondisiStokRef = useRef(null);
  const [drawerKondisiStok, setDrawerKondisiStok] = useState("Semua produk");
  const [showDrawerKondisiStokDropdown, setShowDrawerKondisiStokDropdown] = useState(false);

  const [drawerUrutanGudang, setDrawerUrutanGudang] = useState("az");

  useEffect(() => { setDateStr(formatDateDDMMYYYY(selectedDate)); }, [selectedDate]);
  useEffect(() => { setDrawerDate(formatDateDDMMYYYY(drawerSelectedDate)); }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (periodeRef.current && !periodeRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (gudangRef.current && !gudangRef.current.contains(event.target)) setShowGudangDropdown(false);
      if (eksporRef.current && !eksporRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (rowsPerPageRef.current && !rowsPerPageRef.current.contains(event.target)) setShowRowsPerPageDropdown(false);
      if (drawerDatePickerRef.current && !drawerDatePickerRef.current.contains(event.target)) setShowDrawerCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerGudangRef.current && !drawerGudangRef.current.contains(event.target)) setShowDrawerGudangDropdown(false);
      if (drawerKategoriRef.current && !drawerKategoriRef.current.contains(event.target)) setShowDrawerKategoriDropdown(false);
      if (drawerProdukRef.current && !drawerProdukRef.current.contains(event.target)) setShowDrawerProdukDropdown(false);
      if (drawerKondisiStokRef.current && !drawerKondisiStokRef.current.contains(event.target)) setShowDrawerKondisiStokDropdown(false);
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
    closeFilterDrawer();
  };

  const handleResetFilter = () => {
    setDrawerPeriode("Hari ini");
    setDrawerGudang("Semua dipilih");
    setDrawerKategori("");
    setDrawerCakupKategori("mencakup");
    setDrawerProduk("Semua produk");
    setDrawerKondisiStok("Semua produk");
    setDrawerUrutanGudang("az");
  };

  // ---------- Helper tampilan ----------
  const hoverBg = (normal, hover) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = hover),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = normal),
  });

  const fieldLabelStyle = { fontSize: "12px", fontWeight: 600, color: t.label, marginBottom: "6px" };
  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.label };

  const selectBoxStyle = (width, height, radius, hasValue = true) => ({
    width: width || "100%", height, paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
    color: hasValue ? t.inputText : t.inputPlaceholder, backgroundColor: t.inputBg,
    border: `1px solid ${t.inputBorder}`, borderRadius: radius,
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box",
  });

  const dropdownPanelStyle = (radius = "6px") => ({
    position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%",
    backgroundColor: t.ddBg, borderRadius: radius, boxShadow: t.ddShadow,
    border: `1px solid ${t.ddBorder}`, padding: "4px 0",
  });

  const dropdownItemStyle = (active) => ({
    padding: "8px 12px", fontSize: "13px", color: t.ddText, cursor: "pointer",
    backgroundColor: active ? t.ddSelected : "transparent",
    transition: "background-color 0.15s ease",
  });

  const dropdownItemHover = (active) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = t.ddHover),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = active ? t.ddSelected : "transparent"),
  });

  const chevronDown = (size = 14) => (
    <svg style={{ width: `${size}px`, height: `${size}px`, color: t.iconMuted, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const radioStyle = { accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" };
  const radioLabelStyle = { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: t.body, fontWeight: 500 };

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

    const navBtn = { border: "none", background: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", color: c.nav, display: "flex" };

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
                const isToday = dateObj.toDateString() === new Date(2026, 8, 22).toDateString();
                const normalBg = isSelected ? c.selBg : isToday ? c.todayBg : "transparent";
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
                      backgroundColor: normalBg,
                      color: isSelected ? c.selText : isToday ? c.todayText : c.dayText,
                      fontSize: "12px",
                      fontWeight: isSelected || isToday ? 600 : 400,
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = c.hoverBg; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = normalBg; }}
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
                  backgroundColor: month === idx ? c.selBg : c.cellBg,
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
                  backgroundColor: year === yNum ? c.selBg : c.cellBg,
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

  return (
    <div
      className={isDark ? "nsg-dark" : ""}
      style={{
        margin: "-24px", width: "calc(100% + 48px)", minHeight: "100vh",
        backgroundColor: t.pageBg, color: t.text,
        colorScheme: isDark ? "dark" : "light",
        display: "flex", flexDirection: "column",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >

      {/* Header */}
      <header style={{ width: "100%", padding: "20px 32px", borderBottom: `1px solid ${t.headerBorder}`, backgroundColor: t.headerBg }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.01em" }}>
          Nilai stok gudang{" "}
          <span style={{ fontSize: "14px", fontWeight: 400, color: t.muted }}>(dalam IDR)</span>
        </h1>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Filter and Actions Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>

          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>

            {/* Tanggal */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="input-tanggal" style={fieldLabelStyle}>
                Tanggal
              </label>
              <div style={{ position: "relative", width: "150px" }} ref={datePickerRef}>
                <input
                  id="input-tanggal"
                  type="text"
                  readOnly
                  value={dateStr}
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{
                    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
                    color: t.inputText, backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: "6px",
                    cursor: "pointer", boxSizing: "border-box", outline: "none"
                  }}
                />
                <span onClick={() => setShowCalendar(!showCalendar)} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: t.icon, display: "flex" }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </span>
                {showCalendar && renderCalendarPopup(selectedDate, setSelectedDate, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowCalendar(false))}
              </div>
            </div>

            {/* Periode Dropdown */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={periodeRef}>
              <label htmlFor="select-periode" style={fieldLabelStyle}>
                Periode
              </label>
              <div style={{ position: "relative", width: "150px" }}>
                <div
                  id="select-periode"
                  onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                  style={selectBoxStyle("100%", "36px", "6px")}
                >
                  <span>{periode}</span>
                  {chevronDown(14)}
                </div>
                {showPeriodeDropdown && (
                  <div style={dropdownPanelStyle("6px")}>
                    {["Hari ini", "7 hari terakhir", "30 hari terakhir"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setPeriode(opt); setShowPeriodeDropdown(false); }}
                        style={dropdownItemStyle(periode === opt)}
                        {...dropdownItemHover(periode === opt)}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Gudang Multi-select */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={gudangRef}>
              <label htmlFor="select-gudang" style={fieldLabelStyle}>
                Gudang
              </label>
              <div style={{ position: "relative", width: "170px" }}>
                <div
                  id="select-gudang"
                  onClick={() => setShowGudangDropdown(!showGudangDropdown)}
                  style={selectBoxStyle("100%", "36px", "6px")}
                >
                  <span>{gudangLabel}</span>
                  {chevronDown(14)}
                </div>
                {showGudangDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "260px", backgroundColor: t.ddBg, borderRadius: "8px", boxShadow: t.ddShadow, border: `1px solid ${t.ddBorder}`, padding: "10px" }}>
                    <input
                      type="text"
                      placeholder="Cari gudang"
                      value={gudangSearch}
                      onChange={(e) => setGudangSearch(e.target.value)}
                      style={{
                        width: "100%", height: "34px", paddingLeft: "12px", fontSize: "13px",
                        border: `1px solid ${t.inputBorder}`, borderRadius: "6px", marginBottom: "8px",
                        boxSizing: "border-box", color: t.inputText, backgroundColor: t.inputBg, outline: "none"
                      }}
                    />
                    {gudangOptions
                      .filter((opt) => opt.toLowerCase().includes(gudangSearch.toLowerCase()))
                      .map((opt) => (
                        <label
                          key={opt}
                          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 2px", fontSize: "13px", color: t.ddText, cursor: "pointer" }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedGudang.includes(opt)}
                            onChange={() => toggleGudang(opt)}
                            style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }}
                          />
                          {opt}
                        </label>
                      ))}
                    <div style={{ borderTop: `1px solid ${t.divider}`, marginTop: "6px", paddingTop: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={clearAllGudang}
                        style={{ background: "none", border: "none", color: t.accent, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                      >
                        Batalkan semua pilihan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Tampilkan */}
            <button
              type="button"
              onClick={() => {}}
              style={{
                height: "36px", padding: "0 20px", backgroundColor: t.primary, color: t.primaryText, fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer", boxShadow: t.primaryShadow,
                transition: "background-color 0.15s ease"
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
                height: "36px", padding: "0 16px", backgroundColor: t.outlineBg, color: t.outlineText, fontSize: "13px",
                fontWeight: 500, border: `1px solid ${t.outlineBorder}`, borderRadius: "6px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px", transition: "background-color 0.15s ease"
              }}
              {...hoverBg(t.outlineBg, t.outlineHover)}
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
                  height: "36px", padding: "0 16px", backgroundColor: t.outlineBg, color: t.outlineText, fontSize: "13px",
                  fontWeight: 500, border: `1px solid ${t.outlineBorder}`, borderRadius: "6px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "12px", transition: "background-color 0.15s ease"
                }}
                {...hoverBg(t.outlineBg, t.outlineHover)}
              >
                <span>Ekspor</span>
                <svg style={{ width: "12px", height: "12px", fill: "currentColor" }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", backgroundColor: t.ddBg, borderRadius: "6px", boxShadow: t.ddShadow, border: `1px solid ${t.ddBorder}`, padding: "4px 0" }}>
                  {["CSV", "XLSX", "PDF"].map((fmt) => (
                    <div
                      key={fmt}
                      onClick={() => { setShowEksporDropdown(false); alert(`Mengekspor laporan ke format ${fmt}...`); }}
                      style={{ padding: "8px 12px", fontSize: "12px", color: t.ddText, cursor: "pointer", transition: "background-color 0.15s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.ddHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {fmt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lihat Contoh */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowTemplateModal(true); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.link, textDecoration: "none" }}
            >
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                <svg style={{ width: "16px", height: "16px", color: t.pdfBadgeIcon }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Table */}
        <section style={{ border: `1px solid ${t.tableBorder}`, borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: t.tableHeadBg, borderBottom: `1px solid ${t.tableBorder}`, color: t.tableHeadText, fontWeight: 700 }}>
                <th style={{ padding: "12px 16px" }}>Kode produk / SKU</th>
                <th style={{ padding: "12px 16px" }}>Nama produk</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Stok di gudang</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Batas min.</th>
                <th style={{ padding: "12px 16px" }}>Unit</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Harga rata-rata</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Nilai stok</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${t.tableRowBorder}` }}>
                <td colSpan={7} style={{ padding: "12px 16px" }}>
                  <div
                    onClick={() => setUnassignedExpanded(!unassignedExpanded)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, color: t.tableRowText }}
                  >
                    <svg
                      style={{ width: "12px", height: "12px", transform: unassignedExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
                      fill="currentColor" viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" clipRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                    Unassigned
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `2px solid ${t.tableTotalBorder}` }}>
                <td colSpan={5}></td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: t.tableRowText }}>
                  Total nilai stok
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: t.link, fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                    Tampilkan total
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Pagination */}
        <section style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }} ref={rowsPerPageRef}>
              <span style={{ fontSize: "13px", color: t.body }}>Baris per halaman</span>
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setShowRowsPerPageDropdown(!showRowsPerPageDropdown)}
                  style={{
                    width: "60px", height: "32px", paddingLeft: "10px", paddingRight: "24px", fontSize: "13px",
                    color: t.inputText, fontWeight: 600, backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: "6px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box"
                  }}
                >
                  <span>{rowsPerPage}</span>
                  {chevronDown(12)}
                </div>
                {showRowsPerPageDropdown && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 4px)", left: 0, zIndex: 50, width: "60px", backgroundColor: t.ddBg, borderRadius: "6px", boxShadow: t.ddShadow, border: `1px solid ${t.ddBorder}`, padding: "4px 0" }}>
                    {[10, 25, 50, 100].map((n) => (
                      <div
                        key={n}
                        onClick={() => { setRowsPerPage(n); setShowRowsPerPageDropdown(false); }}
                        style={{ padding: "6px 10px", fontSize: "13px", color: t.ddText, cursor: "pointer", backgroundColor: rowsPerPage === n ? t.ddSelected : "transparent", transition: "background-color 0.15s ease" }}
                        {...dropdownItemHover(rowsPerPage === n)}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span style={{ fontSize: "13px", color: t.body }}>Menampilkan 1 - 1 dari 1</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "56px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.pagerBorder}`, borderRadius: "6px", fontSize: "13px", fontWeight: 600, color: t.accent }}>
              1 ▾
            </div>
            <span style={{ fontSize: "13px", color: t.body }}>dari 1 halaman</span>
            <button type="button" disabled style={{ width: "28px", height: "28px", border: `1px solid ${t.tableBorder}`, borderRadius: "6px", backgroundColor: t.pagerDisabledBg, color: t.pagerDisabledText, cursor: "not-allowed" }}>
              &lt;
            </button>
            <button type="button" disabled style={{ width: "28px", height: "28px", border: `1px solid ${t.tableBorder}`, borderRadius: "6px", backgroundColor: t.pagerDisabledBg, color: t.pagerDisabledText, cursor: "not-allowed" }}>
              &gt;
            </button>
          </div>
        </section>

        {/* Catatan */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
          <svg style={{ width: "15px", height: "15px", color: t.noteIcon, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span style={{ fontSize: "13px", color: t.note }}>
            Catatan: Akun persediaan barang dihitung berdasarkan metode harga rata-rata
          </span>
        </div>

      </main>

      {/* Drawer Filter */}
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
              backgroundColor: t.drawerBg, boxShadow: t.drawerShadow,
              borderLeft: isDark ? `1px solid ${t.headerBorder}` : "none",
              colorScheme: isDark ? "dark" : "light",
              display: "flex", flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out", zIndex: 101,
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Filter</h2>
              <button type="button" onClick={closeFilterDrawer} style={{ border: "none", background: "none", fontSize: "18px", color: t.closeBtn, cursor: "pointer", padding: "4px" }}>
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Tanggal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Tanggal</label>
                <div style={{ position: "relative" }} ref={drawerDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={drawerDate}
                    onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                    style={{
                      width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "36px", fontSize: "13px",
                      border: `1px solid ${t.inputBorder}`, borderRadius: "8px", backgroundColor: t.inputBg, color: t.inputText,
                      cursor: "pointer", boxSizing: "border-box", outline: "none"
                    }}
                  />
                  <svg
                    onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: t.icon, cursor: "pointer" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                  >
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  {showDrawerCalendar &&
                    renderCalendarPopup(
                      drawerSelectedDate, setDrawerSelectedDate,
                      drawerCalendarViewDate, setDrawerCalendarViewDate,
                      drawerCalendarViewMode, setDrawerCalendarViewMode,
                      drawerYearRangeStart, setDrawerYearRangeStart,
                      () => setShowDrawerCalendar(false)
                    )}
                </div>
              </div>

              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodeRef}>
                <label style={drawerLabelStyle}>Periode</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                    style={selectBoxStyle("100%", "40px", "8px")}
                  >
                    <span>{drawerPeriode}</span>
                    {chevronDown(16)}
                  </div>
                  {showDrawerPeriodeDropdown && (
                    <div style={dropdownPanelStyle("8px")}>
                      {["Hari ini", "7 hari terakhir", "30 hari terakhir"].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }}
                          style={dropdownItemStyle(drawerPeriode === opt)}
                          {...dropdownItemHover(drawerPeriode === opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gudang */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerGudangRef}>
                <label style={drawerLabelStyle}>Gudang</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerGudangDropdown(!showDrawerGudangDropdown)}
                    style={selectBoxStyle("100%", "40px", "8px")}
                  >
                    <span>{drawerGudang}</span>
                    {chevronDown(16)}
                  </div>
                  {showDrawerGudangDropdown && (
                    <div style={dropdownPanelStyle("8px")}>
                      {["Semua dipilih", "All", "Unassigned"].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setDrawerGudang(opt); setShowDrawerGudangDropdown(false); }}
                          style={dropdownItemStyle(drawerGudang === opt)}
                          {...dropdownItemHover(drawerGudang === opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kategori produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerKategoriRef}>
                <label style={drawerLabelStyle}>Kategori produk</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerKategoriDropdown(!showDrawerKategoriDropdown)}
                    style={selectBoxStyle("100%", "40px", "8px", !!drawerKategori)}
                  >
                    <span>{drawerKategori || "Pilih kategori produk"}</span>
                    {chevronDown(16)}
                  </div>
                  {showDrawerKategoriDropdown && (
                    <div style={dropdownPanelStyle("8px")}>
                      {["Elektronik", "Aksesoris"].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setDrawerKategori(opt); setShowDrawerKategoriDropdown(false); }}
                          style={dropdownItemStyle(drawerKategori === opt)}
                          {...dropdownItemHover(drawerKategori === opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mencakup semua / Salah satu */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <label style={radioLabelStyle}>
                  <input
                    type="radio"
                    name="cakupKategoriStokGudang"
                    checked={drawerCakupKategori === "mencakup"}
                    onChange={() => setDrawerCakupKategori("mencakup")}
                    style={radioStyle}
                  />
                  Mencakup semua
                </label>
                <label style={radioLabelStyle}>
                  <input
                    type="radio"
                    name="cakupKategoriStokGudang"
                    checked={drawerCakupKategori === "salahsatu"}
                    onChange={() => setDrawerCakupKategori("salahsatu")}
                    style={radioStyle}
                  />
                  Salah satu
                </label>
                <svg style={{ width: "15px", height: "15px", color: t.noteIcon }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>

              {/* Produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerProdukRef}>
                <label style={drawerLabelStyle}>Produk</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerProdukDropdown(!showDrawerProdukDropdown)}
                    style={selectBoxStyle("100%", "40px", "8px")}
                  >
                    <span>{drawerProduk}</span>
                    {chevronDown(16)}
                  </div>
                  {showDrawerProdukDropdown && (
                    <div style={dropdownPanelStyle("8px")}>
                      {["Semua produk", "Laptop ASUS Zenbook 14", "Monitor Dell UltraSharp 27"].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setDrawerProduk(opt); setShowDrawerProdukDropdown(false); }}
                          style={dropdownItemStyle(drawerProduk === opt)}
                          {...dropdownItemHover(drawerProduk === opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kondisi stok */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerKondisiStokRef}>
                <label style={drawerLabelStyle}>Kondisi stok</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerKondisiStokDropdown(!showDrawerKondisiStokDropdown)}
                    style={selectBoxStyle("100%", "40px", "8px")}
                  >
                    <span>{drawerKondisiStok}</span>
                    {chevronDown(16)}
                  </div>
                  {showDrawerKondisiStokDropdown && (
                    <div style={dropdownPanelStyle("8px")}>
                      {["Semua produk", "Stok tersedia", "Stok habis", "Di bawah batas minimum"].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setDrawerKondisiStok(opt); setShowDrawerKondisiStokDropdown(false); }}
                          style={dropdownItemStyle(drawerKondisiStok === opt)}
                          {...dropdownItemHover(drawerKondisiStok === opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Urutan nama gudang */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={drawerLabelStyle}>Urutan nama gudang</label>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <label style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="urutanNamaGudang"
                      checked={drawerUrutanGudang === "az"}
                      onChange={() => setDrawerUrutanGudang("az")}
                      style={radioStyle}
                    />
                    A-Z
                  </label>
                  <label style={radioLabelStyle}>
                    <input
                      type="radio"
                      name="urutanNamaGudang"
                      checked={drawerUrutanGudang === "za"}
                      onChange={() => setDrawerUrutanGudang("za")}
                      style={radioStyle}
                    />
                    Z-A
                  </label>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: t.drawerBg }}>
              <button
                type="button"
                onClick={handleResetFilter}
                style={{
                  background: "none", border: "none", color: t.accent, fontSize: "13px", fontWeight: 600,
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
                  style={{ height: "38px", padding: "0 18px", backgroundColor: "transparent", color: t.cancelText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer" }}
                  {...hoverBg("transparent", t.ddHover)}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  style={{ height: "38px", padding: "0 24px", backgroundColor: t.primary, color: t.primaryText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: t.primaryShadow, transition: "background-color 0.15s ease" }}
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
        <div style={{ position: "fixed", inset: 0, zIndex: 110, backgroundColor: t.modalOverlay, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: t.modalBg, borderRadius: "8px", width: "500px", maxWidth: "90vw", boxShadow: t.modalShadow, border: isDark ? `1px solid ${t.modalBorder}` : "none", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.modalBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Contoh Laporan Nilai Stok Gudang</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: t.closeBtn, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px", fontSize: "13px", color: t.body, lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 12px 0" }}>Berikut adalah pratinjau format standar laporan Nilai Stok Gudang yang siap diekspor ke PDF / Excel:</p>
              <div style={{ backgroundColor: t.previewBg, border: `1px solid ${t.previewBorder}`, borderRadius: "6px", padding: "12px", fontSize: "12px", fontFamily: "monospace", color: t.text }}>
                <div><strong>Judul:</strong> Nilai Stok Gudang (dalam IDR)</div>
                <div><strong>Per:</strong> {dateStr} ({periode})</div>
                <hr style={{ border: "none", borderTop: `1px dashed ${t.previewDash}`, margin: "8px 0" }} />
                <div>[Kode] | [Nama Produk] | [Stok] | [Batas min.] | [Unit] | [Harga rata-rata] | [Nilai stok]</div>
                <div>PRD-001 | Laptop ASUS | 48 | 5 | Unit | Rp 14.000.000 | Rp 672.000.000</div>
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${t.modalBorder}`, display: "flex", justifyContent: "flex-end", backgroundColor: t.modalFooterBg }}>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                style={{ padding: "6px 16px", backgroundColor: t.primary, color: t.primaryText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer", transition: "background-color 0.15s ease" }}
                {...hoverBg(t.primary, t.primaryHover)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nsg-dark input::placeholder { color: #94a3b8; }
      `}</style>

    </div>
  );
}