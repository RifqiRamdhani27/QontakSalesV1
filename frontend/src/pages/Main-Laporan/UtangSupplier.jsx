import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function UtangSupplier() {
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
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", faint: "#94a3b8",
      label: "#e2e8f0", value: "#f1f5f9", sub: "#cbd5e1", link: "#cbd5e1", linkHover: "#E5B85C",
      panel: "#1a1a1a", panelBorder: "#634f27", rowBorder: "#3a3326",
      line: "#634f27", icon: "#E5B85C",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212",
      outlineBg: "#1a1a1a", outlineHover: "#262626", outlineBorder: "#E5B85C", outlineText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", overlay: "rgba(0, 0, 0, 0.7)",
      chipBg: "#262626", chipBorder: "#634f27", chipText: "#f1f5f9", chipX: "#94a3b8",
      ghostBg: "#262626", ghostBorder: "#634f27", ghostText: "#cbd5e1",
      accent: "#E5B85C", helpText: "#121212",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#0f172a", muted: "#64748b", faint: "#94a3b8",
      label: "#475569", value: "#1e293b", sub: "#27272a", link: "#64748b", linkHover: "#334155",
      panel: "#ffffff", panelBorder: "#e2e8f0", rowBorder: "#f1f5f9",
      line: "#cbd5e1", icon: "#475569",
      primary: "#20667d", primaryHover: "#195265", primaryText: "#ffffff",
      outlineBg: "#ffffff", outlineHover: "#f8fafc", outlineBorder: "#20667d", outlineText: "#20667d",
      ddBg: "#ffffff", ddBorder: "#d4d4d8", ddText: "#1e3a8a", ddHover: "#f1f5f9",
      ddShadow: "0 4px 16px rgba(0,0,0,0.12)",
      drawerBg: "#ffffff", overlay: "rgba(15, 23, 42, 0.4)",
      chipBg: "#ffffff", chipBorder: "#d4d4d8", chipText: "#3f3f46", chipX: "#71717a",
      ghostBg: "#ffffff", ghostBorder: "#d4d4d8", ghostText: "#71717a",
      accent: "#2563eb", helpText: "#ffffff",
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
      dayText: "#334155", monthBg: "#f1f5f9", hoverBg: "#f1f5f9", divider: "#f1f5f9",
    };

  // Date Picker State (Main Toolbar "Per")
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [perDateStr, setPerDateStr] = useState("18/09/2026");

  // Periode Preset State
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);
  const mainPeriodRef = useRef(null);

  // Action Dropdowns
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const eksporDropdownRef = useRef(null);

  // Drawer Filter States
  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("18/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("18/09/2026");

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);
  const drawerPeriodRef = useRef(null);

  const drawerJatuhTempoDatePickerRef = useRef(null);
  const [drawerJatuhTempoSelectedDate, setDrawerJatuhTempoSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerJatuhTempoCalendarViewDate, setDrawerJatuhTempoCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerJatuhTempoCalendarViewMode, setDrawerJatuhTempoCalendarViewMode] = useState("days");
  const [drawerJatuhTempoYearRangeStart, setDrawerJatuhTempoYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerJatuhTempoCalendar, setShowDrawerJatuhTempoCalendar] = useState(false);
  const [drawerJatuhTempoDate, setDrawerJatuhTempoDate] = useState("");

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup Semua");

  const [drawerSupplier, setDrawerSupplier] = useState("Semua");
  const [showDrawerSupplierDropdown, setShowDrawerSupplierDropdown] = useState(false);
  const drawerSupplierRef = useRef(null);

  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("Supplier");
  const [showDrawerUrutkanBerdasarkanDropdown, setShowDrawerUrutkanBerdasarkanDropdown] = useState(false);
  const drawerUrutkanBerdasarkanRef = useRef(null);
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc");

  const [drawerShowDetail, setDrawerShowDetail] = useState(false);

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const PERIODE_OPTIONS = ["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"];

  const formatDateDDMMYYYY = (date) => {
    if (!date) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => { setPerDateStr(formatDateDDMMYYYY(selectedDate)); }, [selectedDate]);
  useEffect(() => { setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate)); }, [drawerStartSelectedDate]);
  useEffect(() => { setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate)); }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerJatuhTempoDatePickerRef.current && !drawerJatuhTempoDatePickerRef.current.contains(event.target)) setShowDrawerJatuhTempoCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerSupplierRef.current && !drawerSupplierRef.current.contains(event.target)) setShowDrawerSupplierDropdown(false);
      if (drawerUrutkanBerdasarkanRef.current && !drawerUrutkanBerdasarkanRef.current.contains(event.target)) setShowDrawerUrutkanBerdasarkanDropdown(false);
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

  const handleResetFilter = () => {
    const today = new Date(2026, 8, 18);
    setPerDateStr(formatDateDDMMYYYY(today));
    setDrawerPeriod("Hari ini");
    setDrawerJatuhTempoDate("");
    setDrawerSupplier("Semua");
    setDrawerTag("");
    setDrawerTagMatch("Mencakup Semua");
    setDrawerUrutkanBerdasarkan("Supplier");
    setDrawerSortOrder("asc");
    setDrawerShowDetail(false);
  };

  const handleQuickPeriodSelect = (periodType) => {
    const today = new Date(2026, 8, 18);
    let s = new Date(today);

    if (periodType === "Hari ini") s = new Date(today);
    else if (periodType === "Minggu ini") s = new Date(today);
    else if (periodType === "Bulan ini") s = new Date(today.getFullYear(), today.getMonth(), 1);
    else if (periodType === "Tahun ini") s = new Date(today.getFullYear(), 0, 1);

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

  const renderOption = (opt, onClick, fontSize = "13.5px") => (
    <div
      key={opt}
      onClick={onClick}
      style={{ padding: "8px 16px", fontSize, color: t.ddText, cursor: "pointer", transition: "background-color 0.15s ease" }}
      {...hoverBg("transparent", t.ddHover)}
    >
      {opt}
    </div>
  );

  const renderCalendarIcon = (size = 16, color = t.icon) => (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <circle cx="8" cy="14" fill={color} r="0.75" />
      <circle cx="12" cy="14" fill={color} r="0.75" />
      <circle cx="16" cy="14" fill={color} r="0.75" />
      <circle cx="8" cy="18" fill={color} r="0.75" />
      <circle cx="12" cy="18" fill={color} r="0.75" />
    </svg>
  );

  const renderCaret = (color = t.icon) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill={color}>
      <polygon points="12,16 6,8 18,8" />
    </svg>
  );

  const mainLabelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: t.label, marginBottom: "4px" };
  const mainLineBox = { position: "relative", display: "flex", alignItems: "center", borderBottom: `1px solid ${t.line}`, paddingBottom: "2px" };
  const mainValueStyle = {
    width: "100%", fontSize: "14px", fontWeight: 600, color: t.value,
    border: "none", outline: "none", padding: 0, cursor: "pointer", backgroundColor: "transparent",
  };

  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.label };
  const drawerLineBox = { position: "relative", borderBottom: `1px solid ${t.line}`, paddingBottom: "4px" };
  const drawerValueStyle = {
    border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: t.value,
    backgroundColor: "transparent", width: "100%", cursor: "pointer",
  };
  const drawerSelectBtn = {
    border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: t.value,
    backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer",
    display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0,
  };

  const renderRadio = (name, value, checked, onChange, label, extra) => (
    <label key={value} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: t.sub }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }}
      />
      <span>{label}</span>
      {extra}
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
                    onClick={() => {
                      setSelDate(new Date(year, month, dayNum));
                      closePicker();
                    }}
                    style={{
                      padding: "6px 0", fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer",
                      backgroundColor: isSelected ? c.selBg : "transparent",
                      color: isSelected ? c.selText : c.dayText,
                      fontWeight: isSelected ? 600 : 400,
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
                style={{
                  padding: "8px 4px", fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer",
                  backgroundColor: idx === month ? c.selBg : c.monthBg,
                  color: idx === month ? c.selText : c.dayText,
                }}
              >
                {mName.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const yNum = yrRangeStart + idx;
              return (
                <button
                  key={yNum}
                  type="button"
                  onClick={() => { setViewDate(new Date(yNum, month, 1)); setViewMode("months"); }}
                  style={{
                    padding: "8px 4px", fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer",
                    backgroundColor: yNum === year ? c.selBg : c.monthBg,
                    color: yNum === year ? c.selText : c.dayText,
                  }}
                >
                  {yNum}
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

  const primaryBtn = {
    backgroundColor: t.primary, color: t.primaryText, fontSize: "14px", fontWeight: 500,
    border: "none", borderRadius: "4px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transition: "background-color 0.15s ease",
  };

  return (
    <div
      style={{
        margin: "-24px",
        backgroundColor: t.pageBg,
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Header Section */}
        <header style={{ backgroundColor: t.panel, padding: "24px 32px 28px 32px", borderBottom: `1px solid ${t.panelBorder}` }}>
          <div style={{ maxWidth: "1760px", margin: "0 auto" }}>
            {/* Main Title */}
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: t.title, letterSpacing: "-0.01em", margin: 0, display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span>Laporan Hutang Supplier</span>
              <span style={{ fontSize: "17px", fontWeight: 400, color: t.muted }}>(dalam IDR)</span>
            </h1>

            {/* Filter & Actions Bar */}
            <div style={{ marginTop: "28px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
              {/* Left Controls */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "20px" }}>
                {/* 'Per' Date Input Field */}
                <div style={{ width: "144px" }} ref={datePickerRef}>
                  <label style={mainLabelStyle} htmlFor="date-per">Per</label>
                  <div style={mainLineBox}>
                    <input
                      id="date-per"
                      style={mainValueStyle}
                      readOnly
                      type="text"
                      value={perDateStr}
                      onClick={() => setShowCalendar(!showCalendar)}
                    />
                    <button
                      aria-label="Pilih Tanggal"
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      style={{ background: "none", border: "none", padding: 0, marginLeft: "4px", cursor: "pointer", display: "flex" }}
                    >
                      {renderCalendarIcon(16)}
                    </button>
                    {showCalendar && renderCalendarPicker(selectedDate, setSelectedDate, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowCalendar(false))}
                  </div>
                </div>

                {/* 'Filter sesuai periode' Dropdown Field */}
                <div style={{ width: "144px" }} ref={mainPeriodRef}>
                  <label style={{ ...mainLabelStyle, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Filter sesuai periode
                  </label>
                  <div style={{ position: "relative", borderBottom: `1px solid ${t.line}`, paddingBottom: "2px" }}>
                    <button
                      type="button"
                      onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                      style={{
                        width: "100%", fontSize: "14px", fontWeight: 500, color: t.value, border: "none", padding: 0,
                        cursor: "pointer", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <span>{periodePreset || "Hari ini"}</span>
                      {renderCaret()}
                    </button>

                    {showMainPeriodDropdown && (
                      <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, width: "160px", maxHeight: "180px", overflowY: "auto", zIndex: 1000 }}>
                        {PERIODE_OPTIONS.map((item) =>
                          renderOption(item, () => {
                            setPeriodePreset(item);
                            handleQuickPeriodSelect(item);
                            setShowMainPeriodDropdown(false);
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons: Filter & Filter lebih lanjut */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "8px", paddingBottom: "2px" }}>
                  <button
                    type="button"
                    style={{ ...primaryBtn, padding: "7px 28px" }}
                    {...hoverBg(t.primary, t.primaryHover)}
                  >
                    Filter
                  </button>
                  <button
                    type="button"
                    onClick={openFilterDrawer}
                    style={{
                      backgroundColor: t.outlineBg, color: t.outlineText, border: `1px solid ${t.outlineBorder}`,
                      fontSize: "14px", fontWeight: 500, padding: "6px 16px", borderRadius: "4px", cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease",
                    }}
                    {...hoverBg(t.outlineBg, t.outlineHover)}
                  >
                    Filter lebih lanjut
                  </button>
                </div>
              </div>

              {/* Right Action: Ekspor Dropdown */}
              <div style={{ paddingBottom: "2px", position: "relative" }} ref={eksporDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                  style={{ ...primaryBtn, padding: "7px 14px", display: "flex", alignItems: "center", gap: "8px" }}
                  {...hoverBg(t.primary, t.primaryHover)}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Ekspor</span>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{ marginLeft: "4px" }}>
                    <path clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fillRule="evenodd" />
                  </svg>
                </button>

                {showEksporDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, width: "176px" }}>
                    {renderOption("Export Excel (.xlsx)", () => setShowEksporDropdown(false), "13px")}
                    {renderOption("Export PDF (.pdf)", () => setShowEksporDropdown(false), "13px")}
                    {renderOption("Export CSV (.csv)", () => setShowEksporDropdown(false), "13px")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Table Area */}
        <main style={{ flex: 1, padding: "24px 32px" }}>
          <div
            style={{
              maxWidth: "1760px", margin: "0 auto", backgroundColor: t.panel,
              border: `1px solid ${t.panelBorder}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "460px",
            }}
          >
            {/* Table Header Bar */}
            <div style={{ backgroundColor: t.panel, borderBottom: `1px solid ${t.rowBorder}`, padding: "14px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "16px", fontSize: "13px", fontWeight: 500, color: t.faint }}>
                <div style={{ gridColumn: "span 3", textAlign: "left" }}>Supplier / Tanggal</div>
                <div style={{ gridColumn: "span 2", textAlign: "left" }}>Transaksi</div>
                <div style={{ gridColumn: "span 1", textAlign: "left" }}>No.</div>
                <div style={{ gridColumn: "span 2", textAlign: "left" }}>Jatuh Tempo</div>
                <div style={{ gridColumn: "span 2", textAlign: "left" }}>Keterangan</div>
                <div style={{ gridColumn: "span 1", textAlign: "right" }}>Jumlah</div>
                <div style={{ gridColumn: "span 1", textAlign: "right" }}>Saldo</div>
              </div>
            </div>

            {/* Empty State Container */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 16px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 600, color: t.title, textAlign: "center", margin: "0 0 20px 0", letterSpacing: "-0.01em" }}>
                Anda belum memiliki transaksi pembelian.
              </h2>
              <button
                type="button"
                style={{ ...primaryBtn, display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px" }}
                {...hoverBg(t.primary, t.primaryHover)}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Buat Pembelian</span>
              </button>
              <p style={{ color: t.faint, fontSize: "13px", margin: "16px 0 8px 0" }}>atau</p>
              <a
                href="#"
                style={{ color: t.link, fontSize: "14px", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = t.linkHover; e.currentTarget.style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = t.link; e.currentTarget.style.textDecoration = "none"; }}
              >
                Lihat Sample
              </a>
            </div>
          </div>
        </main>

        {/* Bottom Notice Banner */}
        <div style={{ width: "100%", height: "64px", backgroundColor: t.panel, flexShrink: 0, borderTop: `1px solid ${t.panelBorder}` }} />
      </div>

      {/* Drawer Sidebar: Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: t.overlay,
              transition: "opacity 0.3s ease",
              opacity: drawerOpen ? 1 : 0,
            }}
          />

          <div
            style={{
              position: "relative",
              width: "360px",
              maxWidth: "100%",
              height: "100%",
              backgroundColor: t.drawerBg,
              borderLeft: isDark ? `1px solid ${t.panelBorder}` : "none",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              zIndex: 10000,
              colorScheme: isDark ? "dark" : "light",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "20px 24px 12px 24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.title, margin: 0 }}>Filter Laporan</h2>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "12px 24px 24px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Field 1: Per */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={drawerLabelStyle}>Per</label>
                <div style={{ ...drawerLineBox, display: "flex", alignItems: "center", justifyContent: "space-between" }} ref={drawerStartDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={perDateStr}
                    onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                    style={drawerValueStyle}
                  />
                  <span onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={{ cursor: "pointer", display: "flex" }}>
                    {renderCalendarIcon(18)}
                  </span>
                  {showDrawerStartCalendar && renderCalendarPicker(selectedDate, (date) => { setSelectedDate(date); setPerDateStr(formatDateDDMMYYYY(date)); }, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowDrawerStartCalendar(false))}
                </div>
              </div>

              {/* Field 2: Filter sesuai periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerPeriodRef}>
                <label style={drawerLabelStyle}>Filter sesuai periode</label>
                <div style={drawerLineBox}>
                  <button type="button" onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)} style={drawerSelectBtn}>
                    <span>{drawerPeriod || "Hari ini"}</span>
                    {renderCaret()}
                  </button>

                  {showDrawerPeriodDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: "180px", overflowY: "auto", zIndex: 100 }}>
                      {PERIODE_OPTIONS.map((item) =>
                        renderOption(item, () => {
                          setDrawerPeriod(item);
                          setPeriodePreset(item);
                          setShowDrawerPeriodDropdown(false);
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Field 3: Tanggal Jatuh Tempo Hingga */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerJatuhTempoDatePickerRef}>
                <label style={drawerLabelStyle}>Tanggal Jatuh Tempo Hingga</label>
                <div style={{ ...drawerLineBox, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input
                    type="text"
                    readOnly
                    placeholder=""
                    value={drawerJatuhTempoDate}
                    onClick={() => setShowDrawerJatuhTempoCalendar(!showDrawerJatuhTempoCalendar)}
                    style={drawerValueStyle}
                  />
                  <span onClick={() => setShowDrawerJatuhTempoCalendar(!showDrawerJatuhTempoCalendar)} style={{ cursor: "pointer", display: "flex" }}>
                    {renderCalendarIcon(18)}
                  </span>
                  {showDrawerJatuhTempoCalendar && renderCalendarPicker(drawerJatuhTempoSelectedDate, (date) => { setDrawerJatuhTempoSelectedDate(date); setDrawerJatuhTempoDate(formatDateDDMMYYYY(date)); }, drawerJatuhTempoCalendarViewDate, setDrawerJatuhTempoCalendarViewDate, drawerJatuhTempoCalendarViewMode, setDrawerJatuhTempoCalendarViewMode, drawerJatuhTempoYearRangeStart, setDrawerJatuhTempoYearRangeStart, () => setShowDrawerJatuhTempoCalendar(false), true)}
                </div>
              </div>

              {/* Field 4: Filter sesuai supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerSupplierRef}>
                <label style={drawerLabelStyle}>Filter sesuai supplier</label>
                <div style={{ borderBottom: `1px solid ${t.line}`, paddingBottom: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", position: "relative" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "2px 8px", backgroundColor: t.chipBg, border: `1px solid ${t.chipBorder}`, borderRadius: "4px", fontSize: "13px", color: t.chipText, fontWeight: 500 }}>
                    {drawerSupplier || "Semua"}
                    <span
                      onClick={() => setDrawerSupplier("")}
                      style={{ cursor: "pointer", color: t.chipX, fontSize: "12px", fontWeight: 700 }}
                    >
                      ✕
                    </span>
                  </span>
                </div>
              </div>

              {/* Field 5: Grup dengan Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={drawerLabelStyle}>Grup dengan Tag</label>
                <div style={{ borderBottom: `1px solid ${t.line}`, paddingBottom: "4px" }}>
                  <input
                    type="text"
                    value={drawerTag}
                    onChange={(e) => setDrawerTag(e.target.value)}
                    style={{ ...drawerValueStyle, cursor: "text" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerTagMatch", "Mencakup Semua", drawerTagMatch === "Mencakup Semua", () => setDrawerTagMatch("Mencakup Semua"), "Mencakup Semua")}
                  {renderRadio("drawerTagMatch", "Salah Satu", drawerTagMatch === "Salah Satu", () => setDrawerTagMatch("Salah Satu"), "Salah Satu",
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "15px", height: "15px", borderRadius: "50%", backgroundColor: t.accent, color: t.helpText, fontSize: "10px", fontWeight: 700, marginLeft: "2px" }}>?</span>
                  )}
                </div>
              </div>

              {/* Field 6: Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} ref={drawerUrutkanBerdasarkanRef}>
                <label style={drawerLabelStyle}>Urutkan sesuai kolom</label>
                <div style={drawerLineBox}>
                  <button type="button" onClick={() => setShowDrawerUrutkanBerdasarkanDropdown(!showDrawerUrutkanBerdasarkanDropdown)} style={drawerSelectBtn}>
                    <span>{drawerUrutkanBerdasarkan || "Supplier"}</span>
                    {renderCaret()}
                  </button>

                  {showDrawerUrutkanBerdasarkanDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, borderRadius: "6px" }}>
                      {["Supplier", "Tgl. transaksi", "Total kuantitas", "Total sisa utang"].map((item) =>
                        renderOption(item, () => { setDrawerUrutkanBerdasarkan(item); setShowDrawerUrutkanBerdasarkanDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerSortOrder", "asc", drawerSortOrder === "asc", () => setDrawerSortOrder("asc"), "Urutan Naik")}
                  {renderRadio("drawerSortOrder", "desc", drawerSortOrder === "desc", () => setDrawerSortOrder("desc"), "Urutan Turun")}
                </div>
              </div>

              {/* Field 7: Checkbox Perlihatkan Lebih Detail */}
              <div style={{ marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={drawerShowDetail}
                    onChange={(e) => setDrawerShowDetail(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: t.accent,
                      borderRadius: "3px",
                      cursor: "pointer",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  />
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: t.value }}>Perlihatkan Lebih Detail</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 24px",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: t.ghostText,
                    backgroundColor: t.ghostBg,
                    border: `1px solid ${t.ghostBorder}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    minWidth: "110px",
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 24px",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: isDark ? t.primaryText : "#ffffff",
                    backgroundColor: isDark ? t.primary : "#4eaf54",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    minWidth: "110px",
                    transition: "background-color 0.15s ease",
                  }}
                  {...hoverBg(isDark ? t.primary : "#4eaf54", isDark ? t.primaryHover : "#43994a")}
                >
                  Filter
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}