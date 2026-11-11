import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function DaftarTukarFaktur() {
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
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", label: "#e2e8f0",
      link: "#E5B85C", linkHover: "#f0c978", sep: "#64748b",
      panel: "#1a1a1a", panelBorder: "#634f27",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9",
      icon: "#E5B85C", accent: "#E5B85C", accentText: "#121212",
      primary: "#E5B85C", primaryHover: "#f0c978",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddSel: "rgba(229,184,92,0.2)", ddSelText: "#E5B85C", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326",
      overlay: "rgba(0, 0, 0, 0.7)", ghostText: "#cbd5e1",
      tableHead: "#242424", tableBorder: "#3a3326",
    }
    : {
      pageBg: "#ffffff", text: "#1f2937", title: "#111827", muted: "#6b7280", label: "#1e293b",
      link: "#2563eb", linkHover: "#1d4ed8", sep: "#9ca3af",
      panel: "#ffffff", panelBorder: "#e5e7eb",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#334155",
      icon: "#9ca3af", accent: "#0066cc", accentText: "#ffffff",
      primary: "#0066cc", primaryHover: "#0055b3",
      btnBg: "#ffffff", btnHover: "#f9fafb", btnBorder: "#d1d5db", btnText: "#4b5563",
      ddBg: "#ffffff", ddBorder: "#cbd5e1", ddText: "#334155", ddHover: "#f3f4f6",
      ddSel: "#f1f5f9", ddSelText: "#0066cc", ddShadow: "0 4px 12px rgba(0,0,0,0.1)",
      drawerBg: "#ffffff", drawerBorder: "#eaecf0",
      overlay: "rgba(15, 23, 42, 0.4)", ghostText: "#64748b",
      tableHead: "#f9fafb", tableBorder: "#e5e7eb",
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

  // Date Pickers State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDate, setStartDate] = useState("18/09/2026");

  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDate, setEndDate] = useState("18/09/2026");

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

  const [drawerPelanggan, setDrawerPelanggan] = useState("");
  const [showDrawerPelangganDropdown, setShowDrawerPelangganDropdown] = useState(false);
  const drawerPelangganRef = useRef(null);

  const [drawerStatus, setDrawerStatus] = useState("Semua Status");
  const [showDrawerStatusDropdown, setShowDrawerStatusDropdown] = useState(false);
  const drawerStatusRef = useRef(null);

  const [drawerUrutkanKolom, setDrawerUrutkanKolom] = useState("Tgl. transaksi");
  const [showDrawerUrutkanKolomDropdown, setShowDrawerUrutkanKolomDropdown] = useState(false);
  const drawerUrutkanKolomRef = useRef(null);

  const [drawerUrutanOrder, setDrawerUrutanOrder] = useState("asc");

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

  useEffect(() => { setStartDate(formatDateDDMMYYYY(startSelectedDate)); }, [startSelectedDate]);
  useEffect(() => { setEndDate(formatDateDDMMYYYY(endSelectedDate)); }, [endSelectedDate]);
  useEffect(() => { setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate)); }, [drawerStartSelectedDate]);
  useEffect(() => { setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate)); }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerPelangganRef.current && !drawerPelangganRef.current.contains(event.target)) setShowDrawerPelangganDropdown(false);
      if (drawerStatusRef.current && !drawerStatusRef.current.contains(event.target)) setShowDrawerStatusDropdown(false);
      if (drawerUrutkanKolomRef.current && !drawerUrutkanKolomRef.current.contains(event.target)) setShowDrawerUrutkanKolomDropdown(false);
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

  const handleQuickPeriodSelect = (periodType, setStartSel, setStartView, setEndSel, setEndView, setShowPeriod) => {
    const today = new Date(2026, 8, 18);
    let s = new Date(today);
    let e = new Date(today);

    if (periodType === "Hari ini") {
      s = new Date(today);
      e = new Date(today);
    } else if (periodType === "Minggu ini") {
      const day = today.getDay();
      const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
      s = new Date(today.getFullYear(), today.getMonth(), diffToMon);
      e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
    } else if (periodType === "Bulan ini") {
      s = new Date(today.getFullYear(), today.getMonth(), 1);
      e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (periodType === "Tahun ini") {
      s = new Date(today.getFullYear(), 0, 1);
      e = new Date(today.getFullYear(), 11, 31);
    }

    setStartSel(s);
    setStartView(new Date(s));
    setEndSel(e);
    setEndView(new Date(e));
    if (setShowPeriod) setShowPeriod(false);
  };

  // ---------- Helper tampilan ----------
  const hoverBg = (normal, hover) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = hover),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = normal),
  });

  const renderCalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const renderChevron = (size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const ddPanelStyle = {
    backgroundColor: t.ddBg,
    border: `1px solid ${t.ddBorder}`,
    borderRadius: "6px",
    boxShadow: t.ddShadow,
    padding: "4px 0",
  };

  const renderOption = (opt, selected, onClick, fontSize = "13.5px") => (
    <div
      key={opt}
      onClick={onClick}
      style={{
        padding: "8px 12px", fontSize,
        color: selected ? t.ddSelText : t.ddText,
        fontWeight: selected ? 600 : 400,
        backgroundColor: selected ? t.ddSel : "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = t.ddHover; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {opt}
    </div>
  );

  const mainLabelStyle = { fontSize: "13px", fontWeight: 400, color: t.title, marginBottom: "6px" };
  const mainInputStyle = {
    width: "172px",
    height: "36px",
    padding: "0 32px 0 12px",
    fontSize: "13.5px",
    color: t.fieldText,
    backgroundColor: t.field,
    border: `1px solid ${t.fieldBorder}`,
    borderRadius: "3px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  };
  const drawerInputStyle = {
    width: "100%",
    height: "38px",
    padding: "0 32px 0 12px",
    fontSize: "13.5px",
    color: t.fieldText,
    backgroundColor: t.field,
    border: `1px solid ${t.fieldBorder}`,
    borderRadius: "6px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  };
  const drawerLabelStyle = { fontSize: "13.5px", fontWeight: 700, color: t.label };
  const calIconWrap = {
    position: "absolute", top: 0, right: 0, bottom: 0,
    display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none",
  };
  const outlineBtnStyle = {
    height: "36px",
    padding: "0 14px",
    backgroundColor: t.btnBg,
    border: `1px solid ${t.btnBorder}`,
    borderRadius: "3px",
    color: t.btnText,
    fontSize: "13px",
    fontWeight: 400,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  };

  // Dropdown di drawer (label + field + panel)
  const renderDrawerSelect = ({ label, value, placeholder, open, setOpen, options, onPick, refEl }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={refEl}>
      <label style={drawerLabelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            width: "100%", height: "40px", padding: "0 12px", fontSize: "13.5px",
            color: value ? t.fieldText : t.muted,
            backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
            textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
          }}
        >
          <span>{value || placeholder}</span>
          {renderChevron()}
        </button>
        {open && (
          <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, maxHeight: "220px", overflowY: "auto" }}>
            {options.map((opt) => renderOption(opt, value === opt, () => onPick(opt)))}
          </div>
        )}
      </div>
    </div>
  );

  // Calendar
  const renderCalendarPicker = (
    selectedDate, setSelectedDate,
    viewDate, setViewDate,
    viewMode, setViewMode,
    yearRangeStart, setYearRangeStart,
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
      else if (viewMode === "years") setYearRangeStart(yearRangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else if (viewMode === "years") setYearRangeStart(yearRangeStart + 12);
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
        {/* Calendar Header */}
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
            {viewMode === "years" && <span style={{ color: c.accent }}>{yearRangeStart} - {yearRangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Days View */}
        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "11px", fontWeight: 600, color: c.weekday, marginBottom: "6px" }}>
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selectedDate && selectedDate.getDate() === dayNum && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      setSelectedDate(new Date(year, month, dayNum));
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

        {/* Months View */}
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

        {/* Years View */}
        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const yNum = yearRangeStart + idx;
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
              setSelectedDate(today);
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

  const thStyle = { padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: t.label, letterSpacing: "-0.01em", textAlign: "left" };

  return (
    <div
      style={{
        backgroundColor: t.pageBg,
        minHeight: "100vh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Main Content */}
      <main style={{ width: "100%", padding: "20px 24px", flex: 1, boxSizing: "border-box" }}>
        {/* Breadcrumb & Title */}
        <header style={{ marginBottom: "20px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", marginBottom: "6px" }}>
            <button
              type="button"
              onClick={() => navigate("/laporan")}
              style={{ color: t.link, background: "transparent", border: "none", padding: 0, cursor: "pointer", fontSize: "13px" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.link)}
            >
              Laporan
            </button>
            <span style={{ color: t.sep }}>/</span>
            <span style={{ color: t.link, cursor: "pointer" }}>Penjualan</span>
          </nav>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.01em" }}>
            Daftar Tukar Faktur
          </h1>
        </header>

        {/* Report Card */}
        <section
          style={{
            backgroundColor: t.panel,
            border: `1px solid ${t.panelBorder}`,
            borderRadius: "3px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          {/* Filter Bar */}
          <div style={{ padding: "24px 24px 28px 24px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
            {/* Left Filter Controls */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
              {/* Start Date */}
              <div style={{ display: "flex", flexDirection: "column" }} ref={startDatePickerRef}>
                <label style={mainLabelStyle} htmlFor="start-date">Tanggal awal</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    id="start-date"
                    type="text"
                    readOnly
                    value={startDate}
                    onClick={() => { setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false); }}
                    style={mainInputStyle}
                  />
                  <span style={calIconWrap}>{renderCalIcon()}</span>
                  {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
                </div>
              </div>

              {/* End Date */}
              <div style={{ display: "flex", flexDirection: "column" }} ref={endDatePickerRef}>
                <label style={mainLabelStyle} htmlFor="end-date">Tanggal akhir</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    id="end-date"
                    type="text"
                    readOnly
                    value={endDate}
                    onClick={() => { setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false); }}
                    style={mainInputStyle}
                  />
                  <span style={calIconWrap}>{renderCalIcon()}</span>
                  {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
                </div>
              </div>

              {/* Primary Filter Button */}
              <button
                type="button"
                style={{
                  height: "36px", padding: "0 20px",
                  backgroundColor: t.primary, color: t.accentText,
                  fontSize: "13px", fontWeight: 500, border: "none", borderRadius: "3px",
                  cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "background-color 0.15s ease",
                }}
                {...hoverBg(t.primary, t.primaryHover)}
              >
                Filter
              </button>

              {/* Filter lainnya Button */}
              <button
                type="button"
                onClick={openFilterDrawer}
                style={outlineBtnStyle}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                Filter lainnya
              </button>
            </div>

            {/* Export Dropdown Button */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", alignSelf: "flex-end" }} ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={outlineBtnStyle}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                <span>Export</span>
                {renderChevron(14)}
              </button>

              {showEksporDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, width: "176px" }}>
                  {renderOption("Export Excel (.xlsx)", false, () => setShowEksporDropdown(false), "13px")}
                  {renderOption("Export PDF (.pdf)", false, () => setShowEksporDropdown(false), "13px")}
                  {renderOption("Export CSV (.csv)", false, () => setShowEksporDropdown(false), "13px")}
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div style={{ padding: "0 24px 24px 24px" }}>
            <div style={{ border: `1px solid ${t.tableBorder}`, borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ borderBottom: `1px solid ${t.tableBorder}`, backgroundColor: t.panel, overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "700px", textAlign: "left", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: t.tableHead }}>
                      <th scope="col" style={{ ...thStyle, width: "13%" }}>Tgl. transaksi</th>
                      <th scope="col" style={{ ...thStyle, width: "16%" }}>No. transaksi</th>
                      <th scope="col" style={{ ...thStyle, width: "16%" }}>Pelanggan</th>
                      <th scope="col" style={{ ...thStyle, width: "15%" }}>Tgl. jatuh tempo</th>
                      <th scope="col" style={{ ...thStyle, width: "12%" }}>Status</th>
                      <th scope="col" style={{ ...thStyle, width: "10%" }}>Total</th>
                      <th scope="col" style={{ ...thStyle, width: "10%" }}>Sisa tagihan</th>
                      <th scope="col" style={{ ...thStyle, width: "8%" }}>Mata uang</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Table Empty State */}
              <div style={{
                minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "80px 16px", backgroundColor: t.panel,
              }}>
                <p style={{ fontSize: "13.5px", fontWeight: 600, color: t.label, margin: "0 0 4px 0" }}>Belum ada laporan tukar faktur</p>
                <p style={{ fontSize: "13px", color: t.muted, margin: "0 0 16px 0" }}>Anda dapat membuat tukar faktur di sini</p>
                <button
                  type="button"
                  style={{
                    height: "36px", padding: "0 16px",
                    backgroundColor: t.btnBg, border: `1px solid ${t.btnBorder}`,
                    color: isDark ? t.accent : "#374151",
                    fontSize: "13px", fontWeight: 500, borderRadius: "4px",
                    display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                  {...hoverBg(t.btnBg, t.btnHover)}
                >
                  <span style={{ fontSize: "15px", fontWeight: 700, color: isDark ? t.accent : "#6b7280", lineHeight: 1 }}>+</span>
                  <span>Buat tukar faktur</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Drawer Sidebar: Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          {/* Overlay */}
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: t.overlay,
              transition: "opacity 0.3s ease",
              opacity: drawerOpen ? 1 : 0,
            }}
          />

          {/* Drawer Container */}
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
            {/* Drawer Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal Awal & Tanggal Akhir */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1, position: "relative" }} ref={drawerStartDatePickerRef}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      readOnly
                      value={drawerStartDate}
                      onClick={() => { setShowDrawerStartCalendar(!showDrawerStartCalendar); setShowDrawerEndCalendar(false); }}
                      style={drawerInputStyle}
                    />
                    <span style={calIconWrap}>{renderCalIcon()}</span>
                  </div>
                  {showDrawerStartCalendar && renderCalendarPicker(drawerStartSelectedDate, setDrawerStartSelectedDate, drawerStartCalendarViewDate, setDrawerStartCalendarViewDate, drawerStartCalendarViewMode, setDrawerStartCalendarViewMode, drawerStartYearRangeStart, setDrawerStartYearRangeStart, () => setShowDrawerStartCalendar(false))}
                </div>

                <div style={{ flex: 1, position: "relative" }} ref={drawerEndDatePickerRef}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDate}
                      onClick={() => { setShowDrawerEndCalendar(!showDrawerEndCalendar); setShowDrawerStartCalendar(false); }}
                      style={drawerInputStyle}
                    />
                    <span style={calIconWrap}>{renderCalIcon()}</span>
                  </div>
                  {showDrawerEndCalendar && renderCalendarPicker(drawerEndSelectedDate, setDrawerEndSelectedDate, drawerEndCalendarViewDate, setDrawerEndCalendarViewDate, drawerEndCalendarViewMode, setDrawerEndCalendarViewMode, drawerEndYearRangeStart, setDrawerEndYearRangeStart, () => setShowDrawerEndCalendar(false), true)}
                </div>
              </div>

              {/* Periode */}
              {renderDrawerSelect({
                label: "Periode",
                value: drawerPeriod,
                placeholder: "Hari ini",
                open: showDrawerPeriodDropdown,
                setOpen: setShowDrawerPeriodDropdown,
                options: ["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Custom"],
                onPick: (item) => {
                  setDrawerPeriod(item);
                  handleQuickPeriodSelect(item, setDrawerStartSelectedDate, setDrawerStartCalendarViewDate, setDrawerEndSelectedDate, setDrawerEndCalendarViewDate, setShowDrawerPeriodDropdown);
                },
                refEl: drawerPeriodRef,
              })}

              {/* Pelanggan */}
              {renderDrawerSelect({
                label: "Pelanggan",
                value: drawerPelanggan,
                placeholder: "Pilih kontak",
                open: showDrawerPelangganDropdown,
                setOpen: setShowDrawerPelangganDropdown,
                options: ["Semua Pelanggan", "PT Maju Bersama", "CV Sejahtera", "PT Global Utama"],
                onPick: (p) => {
                  setDrawerPelanggan(p === "Semua Pelanggan" ? "" : p);
                  setShowDrawerPelangganDropdown(false);
                },
                refEl: drawerPelangganRef,
              })}

              {/* Status */}
              {renderDrawerSelect({
                label: "Status",
                value: drawerStatus,
                placeholder: "Semua Status",
                open: showDrawerStatusDropdown,
                setOpen: setShowDrawerStatusDropdown,
                options: ["Semua Status", "Draft", "Disetujui", "Ditolak", "Dibatalkan"],
                onPick: (st) => { setDrawerStatus(st); setShowDrawerStatusDropdown(false); },
                refEl: drawerStatusRef,
              })}

              {/* Urutkan sesuai kolom */}
              {renderDrawerSelect({
                label: "Urutkan sesuai kolom",
                value: drawerUrutkanKolom,
                placeholder: "Tgl. transaksi",
                open: showDrawerUrutkanKolomDropdown,
                setOpen: setShowDrawerUrutkanKolomDropdown,
                options: ["Tgl. transaksi", "No. transaksi", "Pelanggan", "Tgl. jatuh tempo", "Total", "Sisa tagihan"],
                onPick: (col) => { setDrawerUrutkanKolom(col); setShowDrawerUrutkanKolomDropdown(false); },
                refEl: drawerUrutkanKolomRef,
              })}

              {/* Radio: Urutan naik / turun */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "-4px" }}>
                {[["asc", "Urutan naik"], ["desc", "Urutan turun"]].map(([val, label]) => (
                  <label key={val} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13.5px", color: t.label }}>
                    <input
                      type="radio"
                      name="drawerUrutanOrder"
                      value={val}
                      checked={drawerUrutanOrder === val}
                      onChange={() => setDrawerUrutanOrder(val)}
                      style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Drawer Footer Buttons */}
            <div style={{ padding: "20px 24px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerPeriod("Hari ini");
                  setDrawerPelanggan("");
                  setDrawerStatus("Semua Status");
                  setDrawerUrutkanKolom("Tgl. transaksi");
                  setDrawerUrutanOrder("asc");
                  const today = new Date(2026, 8, 18);
                  setDrawerStartSelectedDate(today);
                  setDrawerEndSelectedDate(today);
                }}
                style={{ fontSize: "13.5px", fontWeight: 500, color: t.accent, backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0 }}
              >
                Hapus filter
              </button>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{ padding: "8px 16px", fontSize: "13.5px", fontWeight: 500, color: t.ghostText, backgroundColor: "transparent", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  onMouseEnter={(e) => { if (isDark) e.currentTarget.style.color = "#E5B85C"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t.ghostText; }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate(drawerStartDate);
                    setEndDate(drawerEndDate);
                    closeFilterDrawer();
                  }}
                  style={{
                    padding: "8px 24px", fontSize: "13.5px", fontWeight: 500,
                    color: t.accentText, backgroundColor: t.primary,
                    border: "none", borderRadius: "6px", cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                  {...hoverBg(t.primary, t.primaryHover)}
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