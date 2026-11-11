import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";

export default function DaftarPengeluaran() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = location.pathname.includes("detail-pengeluaran") ? "Detail Pengeluaran" : "Daftar Pengeluaran";
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
      headerBg: "#121212", headerBorder: "#634f27", headerShadow: "0 1px 2px rgba(0,0,0,0.4)",
      label: "#e2e8f0", labelAlt: "#e2e8f0", drawerLabel: "#e2e8f0",
      inputText: "#f1f5f9", inputBorder: "#634f27", icon: "#E5B85C", iconMuted: "#94a3b8",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212",
      outlineText: "#E5B85C", outlineBorder: "#634f27", outlineBg: "#262626", outlineHover: "#2d2d2d",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)", tableShadow: "0 2px 15px -6px rgba(241, 133, 10, 0.86)",
      tableHeadText: "#94a3b8", tableBorder: "#3a3326",
      linkText: "#94a3b8", linkHover: "#E5B85C",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326", drawerLine: "#3a3326", drawerText: "#f1f5f9",
      overlay: "rgba(0, 0, 0, 0.7)",
      chipBg: "#262626", chipBorder: "#634f27", chipText: "#f1f5f9", chipClose: "#94a3b8",
      radioText: "#cbd5e1", accent: "#E5B85C", helpBg: "#E5B85C", helpText: "#121212",
      cancelText: "#cbd5e1", cancelBorder: "#634f27", cancelBg: "transparent", cancelHover: "#2d2d2d",
      applyBg: "#E5B85C", applyHover: "#f0c978", applyText: "#121212",
      checkText: "#f1f5f9",
    }
    : {
      pageBg: "#ffffff", tableShadow: "0 2px 15px -6px rgba(58, 58, 58, 0.86)", text: "#1e293b", title: "#0f172a", muted: "#94a3b8",
      headerBg: "#ffffff", headerBorder: "#e2e8f0", headerShadow: "0 1px 2px rgba(0,0,0,0.03)",
      label: "#475569", labelAlt: "#6b7280", drawerLabel: "#52525b",
      inputText: "#0f172a", inputBorder: "#cbd5e1", icon: "#64748b", iconMuted: "#64748b",
      primary: "#20667d", primaryHover: "#195265", primaryText: "#ffffff",
      outlineText: "#20667d", outlineBorder: "#20667d", outlineBg: "#ffffff", outlineHover: "#f8fafc",
      ddBg: "#ffffff", ddBorder: "#d4d4d8", ddText: "#1e3a8a", ddHover: "#f1f5f9",
      ddShadow: "0 4px 16px rgba(0,0,0,0.12)",
      tableHeadText: "#94a3b8", tableBorder: "#e2e8f0",
      linkText: "#64748b", linkHover: "#20667d",
      drawerBg: "#ffffff", drawerBorder: "#e4e4e7", drawerLine: "#e4e4e7", drawerText: "#000000",
      overlay: "rgba(15, 23, 42, 0.4)",
      chipBg: "#ffffff", chipBorder: "#d4d4d8", chipText: "#3f3f46", chipClose: "#71717a",
      radioText: "#27272a", accent: "#2563eb", helpBg: "#2563eb", helpText: "#ffffff",
      cancelText: "#71717a", cancelBorder: "#d4d4d8", cancelBg: "#ffffff", cancelHover: "#f8fafc",
      applyBg: "#4eaf54", applyHover: "#439648", applyText: "#ffffff",
      checkText: "#000000",
    };

  // Palet kalender
  const c = isDark
    ? {
      popBg: "#1a1a1a", popBorder: "#634f27",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      nav: "#f1f5f9", accent: "#E5B85C", weekday: "#94a3b8",
      selBg: "#E5B85C", selText: "#121212",
      dayText: "#f1f5f9", monthBg: "#262626", hoverBg: "#2d2d2d", divider: "#3a3326",
    }
    : {
      popBg: "#ffffff", popBorder: "#cbd5e1",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
      nav: "#64748b", accent: "#0284c7", weekday: "#94a3b8",
      selBg: "#0284c7", selText: "#ffffff",
      dayText: "#1e293b", monthBg: "#f1f5f9", hoverBg: "#f1f5f9", divider: "#f1f5f9",
    };

  // Start Date Picker State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("18/09/2026");

  // End Date Picker State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("18/09/2026");

  // Filter sesuai periode (main toolbar)
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Ekspor Dropdown
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer: Filter sesuai periode
  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  // Drawer: Tanggal Mulai
  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("18/09/2026");

  // Drawer: Tanggal Selesai
  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("18/09/2026");

  // Drawer: Kategori
  const [drawerKategori, setDrawerKategori] = useState("Semua");
  const drawerKategoriRef = useRef(null);

  // Drawer: Supplier
  const [drawerSupplier, setDrawerSupplier] = useState("Semua");
  const drawerSupplierRef = useRef(null);

  // Drawer: Tag
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup Semua");

  // Drawer: Urutkan sesuai kolom
  const drawerUrutkanRef = useRef(null);
  const [drawerUrutkan, setDrawerUrutkan] = useState("Tanggal");
  const [showDrawerUrutkanDropdown, setShowDrawerUrutkanDropdown] = useState(false);
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc");

  // Drawer: Perlihatkan Lebih Detail
  const [drawerShowDetail, setDrawerShowDetail] = useState(false);

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

  useEffect(() => { setStartDateStr(formatDateDDMMYYYY(startSelectedDate)); }, [startSelectedDate]);
  useEffect(() => { setEndDateStr(formatDateDDMMYYYY(endSelectedDate)); }, [endSelectedDate]);
  useEffect(() => { setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate)); }, [drawerStartSelectedDate]);
  useEffect(() => { setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate)); }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerUrutkanRef.current && !drawerUrutkanRef.current.contains(event.target)) setShowDrawerUrutkanDropdown(false);
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

  const handleQuickPeriodSelect = (periodType) => {
    const today = new Date(2026, 8, 18);
    let s = new Date(today);
    if (periodType === "Hari ini") s = new Date(today);
    else if (periodType === "Minggu ini") s = new Date(today);
    else if (periodType === "Bulan ini") s = new Date(today.getFullYear(), today.getMonth(), 1);
    else if (periodType === "Tahun ini") s = new Date(today.getFullYear(), 0, 1);
    else if (periodType === "Bulan lalu") s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    else if (periodType === "Tahun lalu") s = new Date(today.getFullYear() - 1, 0, 1);
    setStartSelectedDate(s);
    setEndSelectedDate(today);
    setStartCalendarViewDate(new Date(s));
  };

  // ---------- Helper tampilan ----------
  const hoverBg = (normal, hover) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = hover),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = normal),
  });

  const primaryBtnStyle = {
    backgroundColor: t.primary, color: t.primaryText, border: "none", borderRadius: "4px", cursor: "pointer",
    fontWeight: 500, boxShadow: "0 1px 2px rgba(0,0,0,0.08)", transition: "background-color 0.15s ease",
  };

  const ddPanelStyle = {
    backgroundColor: t.ddBg,
    border: `1px solid ${t.ddBorder}`,
    borderRadius: "4px",
    boxShadow: t.ddShadow,
    padding: "4px 0",
  };

  const calIcon = (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 15h.01M12 15h.01M8 15h.01M16 18h.01M12 18h.01M8 18h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const mainLabelStyle = { fontSize: "12px", fontWeight: 600, color: t.label, marginBottom: "4px" };
  const mainInputStyle = {
    border: "none", outline: "none", fontSize: "14px", fontWeight: 600, color: t.inputText,
    backgroundColor: "transparent", width: "100%", cursor: "pointer", paddingLeft: "2px", paddingRight: "24px",
  };
  const mainIconStyle = { position: "absolute", right: "4px", color: t.icon, pointerEvents: "none", display: "flex", alignItems: "center" };

  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.drawerLabel };
  const drawerUnderline = { position: "relative", borderBottom: `1px solid ${t.drawerLine}`, paddingBottom: "4px" };
  const drawerInputStyle = {
    border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: t.drawerText,
    backgroundColor: "transparent", width: "100%",
  };
  const drawerSelectBtnStyle = {
    ...drawerInputStyle, textAlign: "left", cursor: "pointer", display: "flex",
    justifyContent: "space-between", alignItems: "center", padding: 0,
  };
  const chipStyle = {
    display: "inline-flex", alignItems: "center", gap: "6px", padding: "2px 8px", backgroundColor: t.chipBg,
    border: `1px solid ${t.chipBorder}`, borderRadius: "4px", fontSize: "13px", color: t.chipText, fontWeight: 500,
  };

  const renderDropdownItem = (item, onClick, fontSize = "13.5px", padding = "8px 16px") => (
    <div
      key={item}
      onClick={onClick}
      style={{ padding, fontSize, color: t.ddText, cursor: "pointer", transition: "background-color 0.15s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.ddHover)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {item}
    </div>
  );

  const renderRadio = (name, value, checked, onChange, label, withHelp = false) => (
    <label key={value} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: t.radioText }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }} />
      <span>{label}</span>
      {withHelp && (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "15px", height: "15px", borderRadius: "50%", backgroundColor: t.helpBg, color: t.helpText, fontSize: "10px", fontWeight: 700, marginLeft: "2px" }}>?</span>
      )}
    </label>
  );

  // Calendar
  const renderCalendarPicker = (
    selDate, setSelDate,
    viewDate, setViewDate,
    viewMode, setViewMode,
    yrRangeStart, setYrRangeStart,
    closePicker,
    alignRight = false
  ) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const handlePrev = () => {
      if (viewMode === "days") setViewDate(new Date(year, month - 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year - 1, month, 1));
      else if (viewMode === "years") setYrRangeStart(yrRangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else if (viewMode === "years") setYrRangeStart(yrRangeStart + 12);
    };

    const navBtn = { border: "none", background: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", color: c.nav, display: "flex" };

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 1000,
          backgroundColor: c.popBg,
          border: `1px solid ${c.popBorder}`,
          borderRadius: "8px",
          boxShadow: c.shadow,
          padding: "14px 16px",
          width: "280px",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ display: "flex", gap: "6px", fontSize: "14px", fontWeight: 700 }}>
            {viewMode === "days" && (
              <>
                <span onClick={() => setViewMode("months")} style={{ cursor: "pointer", color: c.accent }}>{MONTH_NAMES[month]}</span>
                <span onClick={() => setViewMode("years")} style={{ cursor: "pointer", color: c.accent }}>{year}</span>
              </>
            )}
            {viewMode === "months" && <span onClick={() => setViewMode("years")} style={{ cursor: "pointer", color: c.accent }}>{year}</span>}
            {viewMode === "years" && <span style={{ color: c.accent }}>{yrRangeStart} - {yrRangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "11px", fontWeight: 600, color: c.weekday, marginBottom: "6px" }}>
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selDate && selDate.getDate() === dayNum && selDate.getMonth() === month && selDate.getFullYear() === year;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => { setSelDate(new Date(year, month, dayNum)); closePicker(); }}
                    style={{
                      fontSize: "12.5px", padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer",
                      backgroundColor: isSelected ? c.selBg : "transparent",
                      color: isSelected ? c.selText : c.dayText,
                      fontWeight: isSelected ? 700 : 400,
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = c.hoverBg; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0", textAlign: "center" }}>
            {MONTH_NAMES.map((mn, idx) => {
              const isSelected = selDate && selDate.getMonth() === idx && selDate.getFullYear() === year;
              return (
                <button key={mn} type="button" onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
                  style={{ fontSize: "12px", padding: "8px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? c.selBg : c.monthBg, color: isSelected ? c.selText : c.dayText, fontWeight: isSelected ? 700 : 400 }}>
                  {mn.slice(0, 3)}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0", textAlign: "center" }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const yr = yrRangeStart + i;
              const isSelected = selDate && selDate.getFullYear() === yr;
              return (
                <button key={yr} type="button" onClick={() => { setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("months"); }}
                  style={{ fontSize: "12px", padding: "8px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? c.selBg : c.monthBg, color: isSelected ? c.selText : c.dayText, fontWeight: isSelected ? 700 : 400 }}>
                  {yr}
                </button>
              );
            })}
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
              closePicker();
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
      className={isDark ? "dp-dark" : ""}
      style={{
        margin: "-24px", display: "flex", flexDirection: "column", minHeight: "100vh",
        backgroundColor: t.pageBg,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Header */}
      <header style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, padding: "24px 32px 20px 32px", boxShadow: t.headerShadow }}>
        {/* Title Row */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.02em" }}>{pageTitle}</h1>
          <span style={{ fontSize: "16px", color: t.muted, fontWeight: 400, marginLeft: "8px" }}>(dalam IDR)</span>
        </div>

        {/* Filters & Action Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          {/* Left Filter Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "20px" }}>

            {/* Tanggal Mulai */}
            <div style={{ display: "flex", flexDirection: "column", width: "144px", position: "relative" }} ref={startDatePickerRef}>
              <label style={mainLabelStyle} htmlFor="start-date">Tanggal Mulai</label>
              <div style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${t.inputBorder}`, paddingBottom: "2px", position: "relative" }}>
                <input id="start-date" readOnly type="text" value={startDateStr} onClick={() => setShowStartCalendar(!showStartCalendar)} style={mainInputStyle} />
                <span style={mainIconStyle}>{calIcon}</span>
                {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
              </div>
            </div>

            {/* Tanggal Selesai */}
            <div style={{ display: "flex", flexDirection: "column", width: "144px", position: "relative" }} ref={endDatePickerRef}>
              <label style={mainLabelStyle} htmlFor="end-date">Tanggal Selesai</label>
              <div style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${t.inputBorder}`, paddingBottom: "2px", position: "relative" }}>
                <input id="end-date" readOnly type="text" value={endDateStr} onClick={() => setShowEndCalendar(!showEndCalendar)} style={mainInputStyle} />
                <span style={mainIconStyle}>{calIcon}</span>
                {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
              </div>
            </div>

            {/* Filter sesuai periode */}
            <div style={{ display: "flex", flexDirection: "column", width: "192px" }} ref={mainPeriodRef}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: t.labelAlt, marginBottom: "6px", lineHeight: 1 }}>Filter sesuai periode</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center", borderBottom: `1px solid ${t.inputBorder}`, paddingBottom: "2px" }}>
                <button type="button" onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                  style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 500, color: t.inputText, backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0 }}>
                  <span>{periodePreset || "Hari ini"}</span>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: t.iconMuted, flexShrink: 0 }}>
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {showMainPeriodDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, width: "180px", maxHeight: "220px", overflowY: "auto", zIndex: 1000 }}>
                    {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) =>
                      renderDropdownItem(item, () => { setPeriodePreset(item); handleQuickPeriodSelect(item); setShowMainPeriodDropdown(false); })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "2px" }}>
              <button type="button"
                style={{ ...primaryBtnStyle, height: "34px", padding: "0 28px", fontSize: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                {...hoverBg(t.primary, t.primaryHover)}>
                Filter
              </button>
              <button type="button" onClick={openFilterDrawer}
                style={{ height: "34px", padding: "0 16px", backgroundColor: t.outlineBg, color: t.outlineText, fontSize: "14px", fontWeight: 500, borderRadius: "4px", border: `1px solid ${t.outlineBorder}`, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s ease" }}
                {...hoverBg(t.outlineBg, t.outlineHover)}>
                Filter lebih lanjut
              </button>
            </div>
          </div>

          {/* Right Action: Ekspor */}
          <div style={{ paddingBottom: "2px", position: "relative" }} ref={eksporDropdownRef}>
            <button type="button" onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{ ...primaryBtnStyle, height: "34px", padding: "0 14px", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px" }}
              {...hoverBg(t.primary, t.primaryHover)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Ekspor</span>
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fillRule="evenodd" />
              </svg>
            </button>
            {showEksporDropdown && (
              <div style={{ ...ddPanelStyle, position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, width: "176px" }}>
                {["Export Excel (.xlsx)", "Export PDF (.pdf)", "Export CSV (.csv)"].map((item) =>
                  renderDropdownItem(item, () => setShowEksporDropdown(false), "13px")
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content: Table */}
      <section style={{ flex: 1, padding: "32px 32px 64px 32px", backgroundColor: t.pageBg }}>
        <div style={{ width: "100%", backgroundColor: t.pageBg, borderTop: `1px solid ${t.tableBorder}`, border: `1px solid ${t.tableBorder}`, boxShadow: t.tableShadow }}>
          {/* Table Header Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 3fr 2fr 1fr", backgroundColor: t.pageBg, borderBottom: `1px solid ${t.tableBorder}`, padding: "10px 16px", fontSize: "12px", fontWeight: 600, color: t.tableHeadText, userSelect: "none" }}>
            <div>Tanggal</div>
            <div>Nomor</div>
            <div>Kategori</div>
            <div>Deskripsi</div>
            <div>Supplier</div>
            <div style={{ textAlign: "right" }}>Jumlah</div>
          </div>

          {/* Empty State */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "96px", paddingBottom: "128px", textAlign: "center" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.title, marginBottom: "24px" }}>
              Anda belum memiliki transaksi biaya.
            </h2>
            <button type="button"
              style={{ ...primaryBtnStyle, height: "40px", padding: "0 20px", fontSize: "14px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
              {...hoverBg(t.primary, t.primaryHover)}>
              <span style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>+</span>
              <span>Buat Biaya</span>
            </button>
            <span style={{ fontSize: "14px", color: t.muted, margin: "16px 0 8px 0" }}>atau</span>
            <a href="#sample" style={{ fontSize: "14px", color: t.linkText, textDecoration: "none", transition: "color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.linkText)}>
              Lihat Sample
            </a>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div style={{ width: "100%", height: "64px", backgroundColor: t.pageBg, borderTop: `1px solid ${t.tableBorder}`, flexShrink: 0 }} />

      {/* Drawer Sidebar: Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={closeFilterDrawer}
            style={{ position: "fixed", inset: 0, backgroundColor: t.overlay, transition: "opacity 0.3s ease", opacity: drawerOpen ? 1 : 0 }} />

          <div style={{
            position: "relative", width: "360px", maxWidth: "100%", height: "100%", backgroundColor: t.drawerBg,
            borderLeft: isDark ? `1px solid ${t.headerBorder}` : "none",
            boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)", display: "flex", flexDirection: "column", zIndex: 10000,
            colorScheme: isDark ? "dark" : "light",
            transform: drawerOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s ease",
          }}>
            {/* Drawer Header */}
            <div style={{ padding: "20px 24px 12px 24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.title, margin: 0 }}>Filter Laporan</h2>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "12px 24px 24px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Filter sesuai periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerPeriodRef}>
                <label style={drawerLabelStyle}>Filter sesuai periode</label>
                <div style={drawerUnderline}>
                  <button type="button" onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)} style={drawerSelectBtnStyle}>
                    <span>{drawerPeriod || "Hari ini"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={t.drawerText}><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerPeriodDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: "180px", overflowY: "auto", zIndex: 100 }}>
                      {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) =>
                        renderDropdownItem(item, () => { setDrawerPeriod(item); setPeriodePreset(item); handleQuickPeriodSelect(item); setShowDrawerPeriodDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tanggal Mulai */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerStartDatePickerRef}>
                <label style={drawerLabelStyle}>Tanggal Mulai</label>
                <div style={{ ...drawerUnderline, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerStartDate} onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                    style={{ ...drawerInputStyle, cursor: "pointer" }} />
                  <span onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={{ cursor: "pointer", flexShrink: 0, display: "flex", color: t.icon }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {showDrawerStartCalendar && renderCalendarPicker(drawerStartSelectedDate, (date) => { setDrawerStartSelectedDate(date); setDrawerStartDate(formatDateDDMMYYYY(date)); setStartSelectedDate(date); setStartDateStr(formatDateDDMMYYYY(date)); }, drawerStartCalendarViewDate, setDrawerStartCalendarViewDate, drawerStartCalendarViewMode, setDrawerStartCalendarViewMode, drawerStartYearRangeStart, setDrawerStartYearRangeStart, () => setShowDrawerStartCalendar(false))}
                </div>
              </div>

              {/* Tanggal Selesai */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerEndDatePickerRef}>
                <label style={drawerLabelStyle}>Tanggal Selesai</label>
                <div style={{ ...drawerUnderline, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerEndDate} onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                    style={{ ...drawerInputStyle, cursor: "pointer" }} />
                  <span onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)} style={{ cursor: "pointer", flexShrink: 0, display: "flex", color: t.icon }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {showDrawerEndCalendar && renderCalendarPicker(drawerEndSelectedDate, (date) => { setDrawerEndSelectedDate(date); setDrawerEndDate(formatDateDDMMYYYY(date)); setEndSelectedDate(date); setEndDateStr(formatDateDDMMYYYY(date)); }, drawerEndCalendarViewDate, setDrawerEndCalendarViewDate, drawerEndCalendarViewMode, setDrawerEndCalendarViewMode, drawerEndYearRangeStart, setDrawerEndYearRangeStart, () => setShowDrawerEndCalendar(false), true)}
                </div>
              </div>

              {/* Filter sesuai kategori */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerKategoriRef}>
                <label style={drawerLabelStyle}>Filter sesuai kategori</label>
                <div style={{ borderBottom: `1px solid ${t.drawerLine}`, paddingBottom: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={chipStyle}>
                    {drawerKategori || "Semua"}
                    <span onClick={() => setDrawerKategori("")} style={{ cursor: "pointer", color: t.chipClose, fontSize: "12px", fontWeight: 700 }}>✕</span>
                  </span>
                </div>
              </div>

              {/* Filter sesuai supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerSupplierRef}>
                <label style={drawerLabelStyle}>Filter sesuai supplier</label>
                <div style={{ borderBottom: `1px solid ${t.drawerLine}`, paddingBottom: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={chipStyle}>
                    {drawerSupplier || "Semua"}
                    <span onClick={() => setDrawerSupplier("")} style={{ cursor: "pointer", color: t.chipClose, fontSize: "12px", fontWeight: 700 }}>✕</span>
                  </span>
                </div>
              </div>

              {/* Grup dengan Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={drawerLabelStyle}>Grup dengan Tag</label>
                <div style={{ borderBottom: `1px solid ${t.drawerLine}`, paddingBottom: "4px" }}>
                  <input type="text" value={drawerTag} onChange={(e) => setDrawerTag(e.target.value)} style={drawerInputStyle} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerTagMatchPengeluaran", "Mencakup Semua", drawerTagMatch === "Mencakup Semua", () => setDrawerTagMatch("Mencakup Semua"), "Mencakup Semua")}
                  {renderRadio("drawerTagMatchPengeluaran", "Salah Satu", drawerTagMatch === "Salah Satu", () => setDrawerTagMatch("Salah Satu"), "Salah Satu", true)}
                </div>
              </div>

              {/* Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} ref={drawerUrutkanRef}>
                <label style={drawerLabelStyle}>Urutkan sesuai kolom</label>
                <div style={drawerUnderline}>
                  <button type="button" onClick={() => setShowDrawerUrutkanDropdown(!showDrawerUrutkanDropdown)} style={drawerSelectBtnStyle}>
                    <span>{drawerUrutkan || "Tanggal"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={t.drawerText}><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerUrutkanDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100 }}>
                      {["Tanggal", "Nomor", "Kategori", "Supplier", "Jumlah"].map((item) =>
                        renderDropdownItem(item, () => { setDrawerUrutkan(item); setShowDrawerUrutkanDropdown(false); }, "13.5px", "8px 12px")
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerSortOrderPengeluaran", "asc", drawerSortOrder === "asc", () => setDrawerSortOrder("asc"), "Urutan Naik")}
                  {renderRadio("drawerSortOrderPengeluaran", "desc", drawerSortOrder === "desc", () => setDrawerSortOrder("desc"), "Urutan Turun")}
                </div>
              </div>

              {/* Perlihatkan Lebih Detail */}
              <div style={{ marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="checkbox" checked={drawerShowDetail} onChange={(e) => setDrawerShowDetail(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: t.accent, borderRadius: "4px", cursor: "pointer", outline: "none", boxShadow: "none" }} />
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: t.checkText }}>Perlihatkan Lebih Detail</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", marginTop: "16px" }}>
                <button type="button" onClick={closeFilterDrawer}
                  style={{ padding: "8px 24px", fontSize: "13.5px", fontWeight: 500, color: t.cancelText, backgroundColor: t.cancelBg, border: `1px solid ${t.cancelBorder}`, borderRadius: "4px", cursor: "pointer", minWidth: "110px", transition: "background-color 0.15s ease" }}
                  {...hoverBg(t.cancelBg, t.cancelHover)}>
                  Batalkan
                </button>
                <button type="button" onClick={closeFilterDrawer}
                  style={{ padding: "8px 24px", fontSize: "13.5px", fontWeight: 500, color: t.applyText, backgroundColor: t.applyBg, border: "none", borderRadius: "4px", cursor: "pointer", minWidth: "110px", transition: "background-color 0.15s ease" }}
                  {...hoverBg(t.applyBg, t.applyHover)}>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dp-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}