import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function UsiaUtang() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
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
      toolbarBg: "#121212", toolbarBorder: "#634f27",
      label: "#e2e8f0", drawerLabel: "#e2e8f0",
      inputText: "#f1f5f9", inputBorder: "#634f27", icon: "#E5B85C", iconMuted: "#94a3b8",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212",
      outlineText: "#E5B85C", outlineBorder: "#634f27", outlineBg: "#262626", outlineHover: "#2d2d2d",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      cardBg: "#121212", cardShadow: "0 1px 3px rgba(0,0,0,0.4)", tableShadow: "0 2px 15px -6px rgba(241, 133, 10, 0.86)",
      tableBorder: "#3a3326", tableHeadText: "#94a3b8", emptyTitle: "#f1f5f9", emptyMuted: "#94a3b8", linkText: "#94a3b8", linkHover: "#E5B85C",
      drawerBg: "#1a1a1a", drawerLine: "#3a3326", drawerText: "#f1f5f9",
      overlay: "rgba(0, 0, 0, 0.7)",
      radioText: "#cbd5e1", accent: "#E5B85C", helpBg: "#E5B85C", helpText: "#121212",
      cancelText: "#cbd5e1", cancelBorder: "#634f27", cancelBg: "transparent", cancelHover: "#2d2d2d",
      applyBg: "#E5B85C", applyHover: "#f0c978", applyText: "#121212",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#111827", muted: "#6b7280",
      headerBg: "#ffffff", headerBorder: "#e5e7eb",
      toolbarBg: "#ffffff", toolbarBorder: "#e5e7eb",
      label: "#6b7280", drawerLabel: "#52525b",
      inputText: "#1f2937", inputBorder: "#cbd5e1", icon: "#4b5563", iconMuted: "#6b7280",
      primary: "#20667d", primaryHover: "#195265", primaryText: "#ffffff",
      outlineText: "#20667d", outlineBorder: "#20667d", outlineBg: "#ffffff", outlineHover: "#f9fafb",
      ddBg: "#ffffff", ddBorder: "#d4d4d8", ddText: "#1e3a8a", ddHover: "#f1f5f9",
      ddShadow: "0 4px 16px rgba(0,0,0,0.12)",
      cardBg: "#ffffff", cardShadow: "0 1px 3px rgba(0,0,0,0.05)",
      tableBorder: "#e2e8f0", tableHeadText: "#cbd5e1", tableShadow: "0 2px 15px -6px rgba(58, 58, 58, 0.86)",
      emptyTitle: "#1f2937", emptyMuted: "#9ca3af", linkText: "#6b7280", linkHover: "#1f2937",
      drawerBg: "#ffffff", drawerLine: "#e4e4e7", drawerText: "#000000",
      overlay: "rgba(15, 23, 42, 0.4)",
      radioText: "#27272a", accent: "#2563eb", helpBg: "#2563eb", helpText: "#ffffff",
      cancelText: "#71717a", cancelBorder: "#d4d4d8", cancelBg: "#ffffff", cancelHover: "#f8fafc",
      applyBg: "#4eaf54", applyHover: "#439648", applyText: "#ffffff",
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

  // Date Picker State (Per Date)
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateStr, setDateStr] = useState("20/09/2026");

  // Filter sesuai periode
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Ekspor Dropdown
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerDatePickerRef = useRef(null);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);
  const [drawerDateStr, setDrawerDateStr] = useState("20/09/2026");

  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerFilterMenurutRef = useRef(null);
  const [drawerFilterMenurut, setDrawerFilterMenurut] = useState("Tanggal Transaksi");
  const [showDrawerFilterMenurutDropdown, setShowDrawerFilterMenurutDropdown] = useState(false);

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup Semua");

  const drawerUrutkanRef = useRef(null);
  const [drawerUrutkan, setDrawerUrutkan] = useState("Vendor");
  const [showDrawerUrutkanDropdown, setShowDrawerUrutkanDropdown] = useState(false);
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc");

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

  useEffect(() => { setDateStr(formatDateDDMMYYYY(selectedDate)); }, [selectedDate]);
  useEffect(() => { setDrawerDateStr(formatDateDDMMYYYY(drawerSelectedDate)); }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerDatePickerRef.current && !drawerDatePickerRef.current.contains(event.target)) setShowDrawerCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerFilterMenurutRef.current && !drawerFilterMenurutRef.current.contains(event.target)) setShowDrawerFilterMenurutDropdown(false);
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
    const today = new Date(2026, 8, 20);
    let s = new Date(today);
    if (periodType === "Hari ini") s = new Date(today);
    else if (periodType === "Minggu ini") s = new Date(today);
    else if (periodType === "Bulan ini") s = new Date(today.getFullYear(), today.getMonth(), 1);
    else if (periodType === "Tahun ini") s = new Date(today.getFullYear(), 0, 1);
    else if (periodType === "Bulan lalu") s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    else if (periodType === "Tahun lalu") s = new Date(today.getFullYear() - 1, 0, 1);
    setSelectedDate(s);
    setCalendarViewDate(new Date(s));
  };

  // ---------- Helper tampilan ----------
  const hoverBg = (normal, hover) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = hover),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = normal),
  });

  const ddPanelStyle = {
    backgroundColor: t.ddBg,
    border: `1px solid ${t.ddBorder}`,
    borderRadius: "4px",
    boxShadow: t.ddShadow,
    padding: "4px 0",
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

  const mainLabelStyle = { fontSize: "13px", color: t.label, fontWeight: 400, marginBottom: "4px" };
  const mainUnderline = { display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.inputBorder}`, width: "144px", paddingBottom: "4px", cursor: "pointer" };
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

  const primaryBtnStyle = {
    backgroundColor: t.primary, color: t.primaryText, fontSize: "13px", fontWeight: 500, borderRadius: "4px",
    border: "none", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease",
  };

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
      className={isDark ? "uu-dark" : ""}
      style={{
        margin: "-24px", display: "flex", flexDirection: "column", minHeight: "100vh",
        backgroundColor: t.pageBg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Header */}
      <header style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBorder}` }}>
        <div style={{ padding: "20px 32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.025em", color: t.title, margin: 0, display: "inline-block" }}>
            Hutang <span style={{ fontSize: "16px", fontWeight: 400, color: t.muted, marginLeft: "6px" }}>(dalam IDR)</span>
          </h1>
        </div>
      </header>

      {/* Filter Toolbar */}
      <section style={{ backgroundColor: t.toolbarBg, borderBottom: `1px solid ${t.toolbarBorder}`, padding: "16px 32px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          {/* Left Filter Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "24px" }}>
            {/* Field 1: Per Date Input */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }} ref={datePickerRef}>
              <label style={mainLabelStyle}>Per</label>
              <div style={mainUnderline}>
                <input readOnly type="text" value={dateStr} onClick={() => setShowCalendar(!showCalendar)}
                  style={{ border: "none", outline: "none", fontSize: "13px", fontWeight: 700, color: t.inputText, backgroundColor: "transparent", width: "100%", cursor: "pointer", padding: 0 }} />
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" onClick={() => setShowCalendar(!showCalendar)} style={{ color: t.icon, flexShrink: 0, marginLeft: "8px" }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                </svg>
                {showCalendar && renderCalendarPicker(selectedDate, setSelectedDate, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowCalendar(false))}
              </div>
            </div>

            {/* Field 2: Period Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }} ref={mainPeriodRef}>
              <label style={mainLabelStyle}>Filter sesuai periode</label>
              <div style={mainUnderline}>
                <span onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)} style={{ fontSize: "13px", fontWeight: 700, color: t.inputText, width: "100%", userSelect: "none" }}>
                  {periodePreset || "Hari ini"}
                </span>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)} style={{ color: t.iconMuted, flexShrink: 0, marginLeft: "8px" }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
                {showMainPeriodDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, width: "180px", maxHeight: "220px", overflowY: "auto", zIndex: 1000 }}>
                    {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) =>
                      renderDropdownItem(item, () => { setPeriodePreset(item); handleQuickPeriodSelect(item); setShowMainPeriodDropdown(false); })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button type="button"
                style={{ ...primaryBtnStyle, padding: "8px 24px" }}
                {...hoverBg(t.primary, t.primaryHover)}>
                Filter
              </button>
              <button type="button" onClick={openFilterDrawer}
                style={{ backgroundColor: t.outlineBg, border: `1px solid ${t.outlineBorder}`, color: t.outlineText, fontSize: "13px", fontWeight: 500, padding: "8px 16px", borderRadius: "4px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease" }}
                {...hoverBg(t.outlineBg, t.outlineHover)}>
                Filter lebih lanjut
              </button>
            </div>
          </div>

          {/* Right Export Button */}
          <div style={{ display: "flex", alignItems: "center", position: "relative" }} ref={eksporDropdownRef}>
            <button type="button" onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{ ...primaryBtnStyle, display: "inline-flex", alignItems: "center", padding: "8px 14px", gap: "8px" }}
              {...hoverBg(t.primary, t.primaryHover)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Ekspor</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
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
      </section>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "24px 32px" }}>
        <div style={{ backgroundColor: t.cardBg, borderRadius: "2px 2px 0 0", boxShadow: t.tableShadow, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "520px", position: "relative", border: `1px solid ${t.tableBorder}` }}>
          {/* Table Header Bar */}
          <div style={{ backgroundColor: t.cardBg, borderBottom: `1px solid ${t.tableBorder}`, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", padding: "12px 32px", fontSize: "13px", fontWeight: 400, color: t.tableHeadText }}>
            <div style={{ textAlign: "left", fontWeight: 600 }}>Vendor</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>Total</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>1 - 30 Hari</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>31 - 60 Hari</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>61 - 90 Hari</div>
            <div style={{ textAlign: "right", fontWeight: 600 }}>&gt; 90 Hari</div>
          </div>

          {/* Empty State Body */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 16px", textAlign: "center" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.emptyTitle, marginBottom: "24px" }}>
              Anda belum memiliki transaksi pembelian.
            </h2>
            <button type="button"
              style={{ ...primaryBtnStyle, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 16px", gap: "6px", marginBottom: "20px" }}
              {...hoverBg(t.primary, t.primaryHover)}>
              <span style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>+</span>
              <span>Buat Pembelian</span>
            </button>
            <span style={{ fontSize: "13px", color: t.emptyMuted, marginBottom: "16px", userSelect: "none" }}>atau</span>
            <button type="button" style={{ fontSize: "13px", color: t.linkText, border: "none", backgroundColor: "transparent", cursor: "pointer", textDecoration: "underline" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.linkText)}>
              Lihat Sample
            </button>
          </div>

          {/* Bottom Accent Banner */}
          <div style={{ height: "80px", backgroundColor: t.cardBg, width: "100%", marginTop: "auto" }} />
        </div>
      </main>

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
            <div style={{ padding: "12px 24px 24px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* 1. Per */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerDatePickerRef}>
                <label style={drawerLabelStyle}>Per</label>
                <div style={{ ...drawerUnderline, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerDateStr} onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                    style={{ ...drawerInputStyle, cursor: "pointer" }} />
                  <span onClick={() => setShowDrawerCalendar(!showDrawerCalendar)} style={{ cursor: "pointer", flexShrink: 0, display: "flex", color: t.icon }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {showDrawerCalendar && renderCalendarPicker(drawerSelectedDate, (date) => { setDrawerSelectedDate(date); setDrawerDateStr(formatDateDDMMYYYY(date)); setSelectedDate(date); setDateStr(formatDateDDMMYYYY(date)); }, drawerCalendarViewDate, setDrawerCalendarViewDate, drawerCalendarViewMode, setDrawerCalendarViewMode, drawerYearRangeStart, setDrawerYearRangeStart, () => setShowDrawerCalendar(false))}
                </div>
              </div>

              {/* 2. Filter sesuai periode */}
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

              {/* 3. Filter menurut */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerFilterMenurutRef}>
                <label style={drawerLabelStyle}>Filter menurut</label>
                <div style={drawerUnderline}>
                  <button type="button" onClick={() => setShowDrawerFilterMenurutDropdown(!showDrawerFilterMenurutDropdown)} style={drawerSelectBtnStyle}>
                    <span>{drawerFilterMenurut || "Tanggal Transaksi"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={t.drawerText}><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerFilterMenurutDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: "180px", overflowY: "auto", zIndex: 100 }}>
                      {["Tanggal Transaksi", "Tanggal Jatuh Tempo"].map((item) =>
                        renderDropdownItem(item, () => { setDrawerFilterMenurut(item); setShowDrawerFilterMenurutDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Grup dengan Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={drawerLabelStyle}>Grup dengan Tag</label>
                <div style={{ borderBottom: `1px solid ${t.drawerLine}`, paddingBottom: "4px" }}>
                  <input type="text" value={drawerTag} onChange={(e) => setDrawerTag(e.target.value)} style={drawerInputStyle} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerTagMatchUsiaUtang", "Mencakup Semua", drawerTagMatch === "Mencakup Semua", () => setDrawerTagMatch("Mencakup Semua"), "Mencakup Semua")}
                  {renderRadio("drawerTagMatchUsiaUtang", "Salah Satu", drawerTagMatch === "Salah Satu", () => setDrawerTagMatch("Salah Satu"), "Salah Satu", true)}
                </div>
              </div>

              {/* 5. Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} ref={drawerUrutkanRef}>
                <label style={drawerLabelStyle}>Urutkan sesuai kolom</label>
                <div style={drawerUnderline}>
                  <button type="button" onClick={() => setShowDrawerUrutkanDropdown(!showDrawerUrutkanDropdown)} style={drawerSelectBtnStyle}>
                    <span>{drawerUrutkan || "Vendor"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={t.drawerText}><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerUrutkanDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100 }}>
                      {["Vendor", "Total", "1 - 30 Hari", "31 - 60 Hari", "61 - 90 Hari", "> 90 Hari"].map((item) =>
                        renderDropdownItem(item, () => { setDrawerUrutkan(item); setShowDrawerUrutkanDropdown(false); }, "13.5px", "8px 12px")
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerSortOrderUsiaUtang", "asc", drawerSortOrder === "asc", () => setDrawerSortOrder("asc"), "Urutan Naik")}
                  {renderRadio("drawerSortOrderUsiaUtang", "desc", drawerSortOrder === "desc", () => setDrawerSortOrder("desc"), "Urutan Turun")}
                </div>
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
        .uu-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}