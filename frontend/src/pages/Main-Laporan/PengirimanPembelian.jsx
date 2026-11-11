import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PengirimanPembelian() {
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
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", faint: "#64748b",
      label: "#e2e8f0", drawerLabel: "#e2e8f0", value: "#f1f5f9", sub: "#cbd5e1", strong: "#ffffff",
      panel: "#1a1a1a", panelBorder: "#634f27", rowBorder: "#3a3326",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9",
      line: "#634f27", icon: "#E5B85C", iconMuted: "#94a3b8",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", overlay: "rgba(0, 0, 0, 0.7)",
      chipBg: "#262626", chipBorder: "#634f27", chipText: "#f1f5f9", chipX: "#94a3b8",
      ghostBg: "#262626", ghostBorder: "#634f27", ghostText: "#cbd5e1",
      accent: "#E5B85C", helpText: "#121212",
      illusBase: "#262626", illusWhiteTop: "#d1d5db", illusWhiteSide: "#9ca3af", illusWhiteFront: "#cbd5e1",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#111827", muted: "#64748b", faint: "#94a3b8",
      label: "#1f2937", drawerLabel: "#52525b", value: "#000000", sub: "#27272a", strong: "#111827",
      panel: "#ffffff", panelBorder: "#e2e8f0", rowBorder: "#e2e8f0",
      field: "#ffffff", fieldBorder: "#d0d5dd", fieldText: "#1f2937",
      line: "#e4e4e7", icon: "#64748b", iconMuted: "#64748b",
      primary: "#3b66f5", primaryHover: "#2b56e5", primaryText: "#ffffff",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#d0d5dd", btnText: "#334155",
      ddBg: "#ffffff", ddBorder: "#d4d4d8", ddText: "#1e3a8a", ddHover: "#f1f5f9",
      ddShadow: "0 4px 16px rgba(0,0,0,0.12)",
      drawerBg: "#ffffff", overlay: "rgba(15, 23, 42, 0.4)",
      chipBg: "#ffffff", chipBorder: "#d4d4d8", chipText: "#3f3f46", chipX: "#71717a",
      ghostBg: "#ffffff", ghostBorder: "#d4d4d8", ghostText: "#71717a",
      accent: "#2563eb", helpText: "#ffffff",
      illusBase: "#F1F5F9", illusWhiteTop: "#FFFFFF", illusWhiteSide: "#E2E8F0", illusWhiteFront: "#F8FAFC",
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

  // Tanggal awal State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("20/09/2026");

  // Tanggal akhir State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("20/09/2026");

  // Periode Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Header & Ekspor Dropdown States
  const eksporDropdownRef = useRef(null);
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Show Report state (when Tampilkan clicked)
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("20/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("20/09/2026");

  const [drawerSupplier, setDrawerSupplier] = useState("Semua");
  const drawerSupplierRef = useRef(null);

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup Semua");

  const drawerUrutkanRef = useRef(null);
  const [drawerUrutkan, setDrawerUrutkan] = useState("Tanggal");
  const [showDrawerUrutkanDropdown, setShowDrawerUrutkanDropdown] = useState(false);
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc");

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
    const today = new Date(2026, 8, 20);
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

  const ddPanelStyle = {
    backgroundColor: t.ddBg,
    border: `1px solid ${t.ddBorder}`,
    borderRadius: "6px",
    boxShadow: t.ddShadow,
    padding: "4px 0",
  };

  const renderDdItem = (label, onClick, fontSize = "13.5px", asButton = false) => {
    const common = { padding: "8px 16px", fontSize, color: t.ddText, cursor: "pointer", transition: "background-color 0.15s ease" };
    if (asButton) {
      return (
        <button key={label} type="button" onClick={onClick}
          style={{ ...common, width: "100%", textAlign: "left", border: "none", backgroundColor: "transparent" }}
          {...hoverBg("transparent", t.ddHover)}>
          {label}
        </button>
      );
    }
    return (
      <div key={label} onClick={onClick} style={common} {...hoverBg("transparent", t.ddHover)}>
        {label}
      </div>
    );
  };

  const mainLabelStyle = { fontSize: "13px", fontWeight: 500, color: t.label };
  const mainInputStyle = {
    width: "100%", height: "38px", padding: "0 32px 0 12px", backgroundColor: t.field,
    border: `1px solid ${t.fieldBorder}`, borderRadius: "6px", fontSize: "13.5px", color: t.fieldText,
    outline: "none", cursor: "pointer", boxSizing: "border-box",
  };
  const calIconAbs = {
    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
    color: t.icon, pointerEvents: "none", display: "flex",
  };
  const outlineBtnStyle = {
    height: "38px", padding: "0 16px", backgroundColor: t.btnBg, border: `1px solid ${t.btnBorder}`,
    color: t.btnText, fontSize: "13.5px", fontWeight: 500, borderRadius: "6px", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "8px", transition: "background-color 0.15s ease",
  };

  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.drawerLabel };
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

  const renderCaret = (color = t.value) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill={color}><polygon points="12,16 6,8 18,8" /></svg>
  );

  const renderCalIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

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
                <button
                  key={mn}
                  type="button"
                  onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
                  style={{
                    fontSize: "12px", padding: "8px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                    backgroundColor: isSelected ? c.selBg : c.monthBg,
                    color: isSelected ? c.selText : c.dayText,
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
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
                <button
                  key={yr}
                  type="button"
                  onClick={() => { setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("months"); }}
                  style={{
                    fontSize: "12px", padding: "8px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                    backgroundColor: isSelected ? c.selBg : c.monthBg,
                    color: isSelected ? c.selText : c.dayText,
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
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
      style={{
        margin: "-24px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: t.pageBg,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px 16px 32px", backgroundColor: t.pageBg }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.01em" }}>Pengiriman pembelian</h1>
          <span style={{ fontSize: "14px", color: t.muted, fontWeight: 400 }}>(dalam IDR)</span>
        </div>

        {/* Right Header: Beri masukan */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
            style={{
              height: "36px", padding: "0 12px", backgroundColor: t.btnBg, border: `1px solid ${t.btnBorder}`,
              borderRadius: "6px", fontSize: "13px", fontWeight: 500, color: isDark ? t.accent : "#4f66ee",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <span>Beri masukan</span>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div style={{ padding: "0 32px 24px 32px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", backgroundColor: t.pageBg }}>
        {/* Left Filter Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
          {/* Tanggal awal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
            <label style={mainLabelStyle}>Tanggal awal</label>
            <div style={{ position: "relative", width: "160px" }}>
              <input readOnly type="text" value={startDateStr} onClick={() => setShowStartCalendar(!showStartCalendar)} style={mainInputStyle} />
              <span style={calIconAbs}>{renderCalIcon()}</span>
              {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
            </div>
          </div>

          {/* Tanggal akhir */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
            <label style={mainLabelStyle}>Tanggal akhir</label>
            <div style={{ position: "relative", width: "160px" }}>
              <input readOnly type="text" value={endDateStr} onClick={() => setShowEndCalendar(!showEndCalendar)} style={mainInputStyle} />
              <span style={calIconAbs}>{renderCalIcon()}</span>
              {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
            </div>
          </div>

          {/* Periode */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={mainPeriodRef}>
            <label style={mainLabelStyle}>Periode</label>
            <div style={{ position: "relative", width: "160px" }}>
              <button
                type="button"
                onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                style={{
                  width: "100%", height: "38px", padding: "0 12px", backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`,
                  borderRadius: "6px", fontSize: "13.5px", color: t.fieldText, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <span>{periodePreset || "Hari ini"}</span>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: t.icon }}>
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
              {showMainPeriodDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, width: "180px", maxHeight: "220px", overflowY: "auto", zIndex: 1000 }}>
                  {PERIODE_OPTIONS.map((item) =>
                    renderDdItem(item, () => { setPeriodePreset(item); handleQuickPeriodSelect(item); setShowMainPeriodDropdown(false); })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tampilkan button */}
          <button
            type="button"
            onClick={() => setShowReport(true)}
            style={{
              height: "38px", padding: "0 22px", backgroundColor: t.primary, color: t.primaryText,
              fontSize: "13.5px", fontWeight: 500, borderRadius: "6px", border: "none", cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            {...hoverBg(t.primary, t.primaryHover)}
          >
            Tampilkan
          </button>

          {/* Filter button */}
          <button type="button" onClick={openFilterDrawer} style={outlineBtnStyle} {...hoverBg(t.btnBg, t.btnHover)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Filter</span>
          </button>
        </div>

        {/* Ekspor button */}
        <div style={{ position: "relative" }} ref={eksporDropdownRef}>
          <button type="button" onClick={() => setShowEksporDropdown(!showEksporDropdown)} style={outlineBtnStyle} {...hoverBg(t.btnBg, t.btnHover)}>
            <span>Ekspor</span>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fillRule="evenodd" />
            </svg>
          </button>
          {showEksporDropdown && (
            <div style={{ ...ddPanelStyle, position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, width: "176px" }}>
              {renderDdItem("Export Excel (.xlsx)", () => setShowEksporDropdown(false), "13px", true)}
              {renderDdItem("Export PDF (.pdf)", () => setShowEksporDropdown(false), "13px", true)}
              {renderDdItem("Export CSV (.csv)", () => setShowEksporDropdown(false), "13px", true)}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: t.pageBg }}>
        {!showReport ? (
          /* Empty State */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 16px 128px 16px", textAlign: "center" }}>
            {/* 3D Chart Illustration */}
            <div style={{ width: "220px", height: "160px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "center", opacity: isDark ? 0.9 : 1 }}>
              <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Base shadow / platform */}
                <ellipse cx="110" cy="130" rx="85" ry="20" fill={t.illusBase} />

                {/* Left 3D Pie Slice */}
                <path d="M 55 50 C 40 65 40 90 60 105 C 75 115 95 110 105 95 Z" fill="#F472B6" />
                <path d="M 55 50 C 70 40 95 45 105 65 L 105 95 C 95 110 75 115 60 105 Z" fill="#FB7185" />
                <path d="M 55 50 L 105 65 L 105 95 Z" fill="#F43F5E" />

                {/* White Column */}
                <path d="M 95 75 L 115 65 L 115 120 L 95 125 Z" fill={t.illusWhiteSide} />
                <path d="M 95 75 L 115 65 L 100 58 L 80 68 Z" fill={t.illusWhiteTop} />
                <path d="M 80 68 L 95 75 L 95 125 L 80 118 Z" fill={t.illusWhiteFront} />

                {/* Purple Column */}
                <path d="M 120 55 L 140 45 L 140 115 L 120 120 Z" fill="#6366F1" />
                <path d="M 120 55 L 140 45 L 125 38 L 105 48 Z" fill="#A5B4FC" />
                <path d="M 105 48 L 120 55 L 120 120 L 105 113 Z" fill="#818CF8" />

                {/* Right 3D Donut Pie */}
                <ellipse cx="160" cy="70" rx="28" ry="18" fill="#FBBF24" />
                <ellipse cx="160" cy="66" rx="28" ry="18" fill="#F472B6" />
                <path d="M 132 66 C 132 76 145 84 160 84 C 175 84 188 76 188 66 L 188 76 C 188 86 175 94 160 94 C 145 94 132 86 132 76 Z" fill="#E11D48" />

                {/* Upward Pink/Red 3D Arrow */}
                <path d="M 80 110 C 95 90 110 100 135 60 L 122 60 L 145 42 L 150 68 L 138 64 C 115 100 98 90 80 110 Z" fill="#F43F5E" filter="drop-shadow(0px 4px 10px rgba(244, 63, 94, 0.4))" />
              </svg>
            </div>

            {/* Heading & Subtext */}
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.title, marginBottom: "8px", letterSpacing: "-0.01em" }}>
              Laporan akan muncul di sini
            </h2>
            <p style={{ fontSize: "14px", color: t.muted, margin: 0, lineHeight: 1.5 }}>
              Pilih tanggal atau periode, lalu klik tombol <strong style={{ color: t.strong, fontWeight: 700 }}>Tampilkan</strong>.
            </p>
          </div>
        ) : (
          /* Table Section when Tampilkan is clicked */
          <div style={{ width: "100%", padding: "24px 32px", backgroundColor: t.pageBg, boxSizing: "border-box" }}>
            <div style={{ width: "100%", borderTop: `1px solid ${t.rowBorder}` }}>
              <div
                style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 2fr 2fr 3fr 1fr", backgroundColor: t.panel,
                  borderBottom: `1px solid ${t.rowBorder}`, padding: "10px 16px", fontSize: "12px", fontWeight: 600,
                  color: t.faint, userSelect: "none",
                }}
              >
                <div>Tanggal</div>
                <div>Nomor</div>
                <div>Supplier</div>
                <div>Status</div>
                <div>Deskripsi</div>
                <div style={{ textAlign: "right" }}>Kuantitas</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px", textAlign: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: t.title, marginBottom: "16px" }}>
                  Tidak ada data untuk periode ini.
                </h3>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Drawer Sidebar: Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{ position: "fixed", inset: 0, backgroundColor: t.overlay, transition: "opacity 0.3s ease", opacity: drawerOpen ? 1 : 0 }}
          />

          <div
            style={{
              position: "relative", width: "360px", maxWidth: "100%", height: "100%",
              backgroundColor: t.drawerBg,
              borderLeft: isDark ? `1px solid ${t.panelBorder}` : "none",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
              display: "flex", flexDirection: "column", zIndex: 10000,
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
              {/* Filter sesuai periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerPeriodRef}>
                <label style={drawerLabelStyle}>Filter sesuai periode</label>
                <div style={drawerLineBox}>
                  <button type="button" onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)} style={drawerSelectBtn}>
                    <span>{drawerPeriod || "Hari ini"}</span>
                    {renderCaret()}
                  </button>
                  {showDrawerPeriodDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: "180px", overflowY: "auto", zIndex: 100, borderRadius: "4px" }}>
                      {PERIODE_OPTIONS.map((item) =>
                        renderDdItem(item, () => { setDrawerPeriod(item); setPeriodePreset(item); handleQuickPeriodSelect(item); setShowDrawerPeriodDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tanggal awal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerStartDatePickerRef}>
                <label style={drawerLabelStyle}>Tanggal awal</label>
                <div style={{ ...drawerLineBox, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerStartDate} onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={drawerValueStyle} />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="1.8" onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={{ cursor: "pointer", flexShrink: 0 }}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {showDrawerStartCalendar && renderCalendarPicker(drawerStartSelectedDate, (date) => { setDrawerStartSelectedDate(date); setDrawerStartDate(formatDateDDMMYYYY(date)); setStartSelectedDate(date); setStartDateStr(formatDateDDMMYYYY(date)); }, drawerStartCalendarViewDate, setDrawerStartCalendarViewDate, drawerStartCalendarViewMode, setDrawerStartCalendarViewMode, drawerStartYearRangeStart, setDrawerStartYearRangeStart, () => setShowDrawerStartCalendar(false))}
                </div>
              </div>

              {/* Tanggal akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerEndDatePickerRef}>
                <label style={drawerLabelStyle}>Tanggal akhir</label>
                <div style={{ ...drawerLineBox, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerEndDate} onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)} style={drawerValueStyle} />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="1.8" onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)} style={{ cursor: "pointer", flexShrink: 0 }}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {showDrawerEndCalendar && renderCalendarPicker(drawerEndSelectedDate, (date) => { setDrawerEndSelectedDate(date); setDrawerEndDate(formatDateDDMMYYYY(date)); setEndSelectedDate(date); setEndDateStr(formatDateDDMMYYYY(date)); }, drawerEndCalendarViewDate, setDrawerEndCalendarViewDate, drawerEndCalendarViewMode, setDrawerEndCalendarViewMode, drawerEndYearRangeStart, setDrawerEndYearRangeStart, () => setShowDrawerEndCalendar(false), true)}
                </div>
              </div>

              {/* Filter sesuai supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerSupplierRef}>
                <label style={drawerLabelStyle}>Filter sesuai supplier</label>
                <div style={{ borderBottom: `1px solid ${t.line}`, paddingBottom: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "2px 8px", backgroundColor: t.chipBg, border: `1px solid ${t.chipBorder}`, borderRadius: "4px", fontSize: "13px", color: t.chipText, fontWeight: 500 }}>
                    {drawerSupplier || "Semua"}
                    <span onClick={() => setDrawerSupplier("")} style={{ cursor: "pointer", color: t.chipX, fontSize: "12px", fontWeight: 700 }}>✕</span>
                  </span>
                </div>
              </div>

              {/* Grup dengan Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={drawerLabelStyle}>Grup dengan Tag</label>
                <div style={{ borderBottom: `1px solid ${t.line}`, paddingBottom: "4px" }}>
                  <input type="text" value={drawerTag} onChange={(e) => setDrawerTag(e.target.value)} style={{ ...drawerValueStyle, cursor: "text" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerTagMatchPengirimanPembelian", "Mencakup Semua", drawerTagMatch === "Mencakup Semua", () => setDrawerTagMatch("Mencakup Semua"), "Mencakup Semua")}
                  {renderRadio("drawerTagMatchPengirimanPembelian", "Salah Satu", drawerTagMatch === "Salah Satu", () => setDrawerTagMatch("Salah Satu"), "Salah Satu",
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "15px", height: "15px", borderRadius: "50%", backgroundColor: t.accent, color: t.helpText, fontSize: "10px", fontWeight: 700, marginLeft: "2px" }}>?</span>
                  )}
                </div>
              </div>

              {/* Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} ref={drawerUrutkanRef}>
                <label style={drawerLabelStyle}>Urutkan sesuai kolom</label>
                <div style={drawerLineBox}>
                  <button type="button" onClick={() => setShowDrawerUrutkanDropdown(!showDrawerUrutkanDropdown)} style={drawerSelectBtn}>
                    <span>{drawerUrutkan || "Tanggal"}</span>
                    {renderCaret()}
                  </button>
                  {showDrawerUrutkanDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100 }}>
                      {["Tanggal", "Nomor", "Supplier", "Status", "Kuantitas"].map((item) =>
                        renderDdItem(item, () => { setDrawerUrutkan(item); setShowDrawerUrutkanDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  {renderRadio("drawerSortOrderPengirimanPembelian", "asc", drawerSortOrder === "asc", () => setDrawerSortOrder("asc"), "Urutan Naik")}
                  {renderRadio("drawerSortOrderPengirimanPembelian", "desc", drawerSortOrder === "desc", () => setDrawerSortOrder("desc"), "Urutan Turun")}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 24px", fontSize: "13.5px", fontWeight: 500, color: t.ghostText,
                    backgroundColor: t.ghostBg, border: `1px solid ${t.ghostBorder}`, borderRadius: "4px",
                    cursor: "pointer", minWidth: "110px",
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={() => { closeFilterDrawer(); setShowReport(true); }}
                  style={{
                    padding: "8px 24px", fontSize: "13.5px", fontWeight: 500,
                    color: isDark ? t.primaryText : "#ffffff",
                    backgroundColor: isDark ? t.primary : "#4eaf54",
                    border: "none", borderRadius: "4px", cursor: "pointer", minWidth: "110px",
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