import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PembelianPerProduk() {
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
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", label: "#e2e8f0", strong: "#ffffff",
      panel: "#1a1a1a", panelBorder: "#634f27", divider: "#3a3326",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9", placeholder: "#94a3b8",
      icon: "#E5B85C", iconMuted: "#94a3b8",
      accent: "#E5B85C", accentText: "#121212", accentHover: "#f0c978",
      link: "#E5B85C",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d", ddSel: "rgba(229,184,92,0.2)",
      ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      tableHeadBorder: "#634f27", tableRowBorder: "#3a3326", tableTotalBorder: "#E5B85C",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326", overlay: "rgba(0, 0, 0, 0.7)",
      radioText: "#cbd5e1", ghostText: "#cbd5e1", subText: "#94a3b8", infoIcon: "#94a3b8",
      pdfIcon: "#cbd5e1", illuBright: "brightness(0.85) saturate(0.9)",
    }
    : {
      pageBg: "#ffffff", text: "#1f2937", title: "#1e293b", muted: "#64748b", label: "#1e293b", strong: "#475569",
      panel: "#ffffff", panelBorder: "#d1d5db", divider: "#e2e8f0",
      field: "#ffffff", fieldBorder: "#cfd7df", fieldText: "#374151", placeholder: "#9ca3af",
      icon: "#9ca3af", iconMuted: "#6b7280",
      accent: "#3b5998", accentText: "#ffffff", accentHover: "#2f4779",
      link: "#2563eb",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#cfd7df", btnText: "#3b5998",
      ddBg: "#ffffff", ddBorder: "#e2e8f0", ddText: "#334155", ddHover: "#f1f5f9", ddSel: "#f1f5f9",
      ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      tableHeadBorder: "#cbd5e1", tableRowBorder: "#e2e8f0", tableTotalBorder: "#94a3b8",
      drawerBg: "#ffffff", drawerBorder: "#e2e8f0", overlay: "rgba(15, 23, 42, 0.4)",
      radioText: "#334155", ghostText: "#475569", subText: "#64748b", infoIcon: "#9ca3af",
      pdfIcon: "#64748b", illuBright: "none",
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
      shadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
      nav: "#64748b", accent: "#0284c7", weekday: "#64748b",
      selBg: "#0284c7", selText: "#ffffff",
      dayText: "#334155", monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
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

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur pembelian");
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("all");
  const [drawerSupplier, setDrawerSupplier] = useState("");
  const [drawerKategoriProduk, setDrawerKategoriProduk] = useState("");
  const [drawerKategoriMatch, setDrawerKategoriMatch] = useState("all");
  const [drawerProduk, setDrawerProduk] = useState("");
  const [drawerDetailVersion, setDrawerDetailVersion] = useState(false);
  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("Nama produk");
  const [drawerUrutanDirection, setDrawerUrutanDirection] = useState("asc");

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

  const renderDdItem = (label, selected, onClick, fontSize = "12px") => (
    <div
      key={label}
      onClick={onClick}
      style={{
        padding: "8px 12px", fontSize, color: t.ddText, cursor: "pointer",
        backgroundColor: selected ? t.ddSel : "transparent",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = t.ddHover; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {label}
    </div>
  );

  const renderCalIcon = () => (
    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.8" />
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
    </svg>
  );

  const renderChevron = () => (
    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const iconWrap = (color) => ({
    position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center",
    paddingRight: "10px", pointerEvents: "none", color,
  });

  const mainLabelStyle = { fontSize: "12px", fontWeight: 600, color: t.label };
  const mainFieldStyle = {
    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "12px",
    border: `1px solid ${t.fieldBorder}`, borderRadius: "4px", backgroundColor: t.field, color: t.fieldText,
    cursor: "pointer", boxSizing: "border-box",
  };
  const outlineBtn = {
    height: "36px", backgroundColor: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}`,
    borderRadius: "4px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transition: "background-color 0.15s ease",
  };

  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.label };
  const drawerFieldStyle = {
    width: "100%", height: "38px", paddingLeft: "12px", fontSize: "13px",
    border: `1px solid ${t.fieldBorder}`, borderRadius: "6px", backgroundColor: t.field, color: t.fieldText,
    boxSizing: "border-box",
  };

  const renderRadio = (name, checked, onChange, label) => (
    <label key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.radioText, cursor: "pointer" }}>
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ accentColor: t.accent, width: "16px", height: "16px" }} />
      <span>{label}</span>
    </label>
  );

  const renderDrawerSelect = (value, onChange, placeholder, options, hasPlaceholder = true) => (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...drawerFieldStyle, paddingRight: "32px", appearance: "none", cursor: "pointer",
          color: value ? t.fieldText : t.placeholder,
        }}
      >
        {hasPlaceholder && <option value="" disabled hidden>{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <div style={iconWrap(t.iconMuted)}>{renderChevron()}</div>
    </div>
  );

  // Calendar
  const renderCalendarPopup = (
    selectedDate,
    setSelectedDate,
    calendarViewDate,
    setCalendarViewDate,
    calendarViewMode,
    setCalendarViewMode,
    yearRangeStart,
    setYearRangeStart,
    closeCalendar,
    alignRight = false
  ) => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const handlePrev = () => {
      if (calendarViewMode === "days") setCalendarViewDate(new Date(year, month - 1, 1));
      else if (calendarViewMode === "months") setCalendarViewDate(new Date(year - 1, month, 1));
      else if (calendarViewMode === "years") setYearRangeStart(yearRangeStart - 12);
    };

    const handleNext = () => {
      if (calendarViewMode === "days") setCalendarViewDate(new Date(year, month + 1, 1));
      else if (calendarViewMode === "months") setCalendarViewDate(new Date(year + 1, month, 1));
      else if (calendarViewMode === "years") setYearRangeStart(yearRangeStart + 12);
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const navBtn = { padding: "4px 8px", border: "none", background: "none", cursor: "pointer", color: c.nav, borderRadius: "4px" };

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 50,
          width: "280px",
          backgroundColor: c.popBg,
          borderRadius: "8px",
          boxShadow: c.shadow,
          border: `1px solid ${c.popBorder}`,
          padding: "14px 16px",
          userSelect: "none",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontWeight: 700, fontSize: "14px", color: c.accent }}>
            {calendarViewMode === "days" && (
              <>
                <span onClick={() => setCalendarViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]}</span>{" "}
                <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
              </>
            )}
            {calendarViewMode === "months" && <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>}
            {calendarViewMode === "years" && <span>{yearRangeStart} - {yearRangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Days View */}
        {calendarViewMode === "days" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: c.weekday, marginBottom: "6px" }}>
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected =
                  selectedDate.getDate() === dayNum &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      setSelectedDate(new Date(year, month, dayNum));
                      closeCalendar();
                    }}
                    style={{
                      height: "32px",
                      border: "none",
                      borderRadius: "4px",
                      backgroundColor: isSelected ? c.selBg : "transparent",
                      color: isSelected ? c.selText : c.dayText,
                      cursor: "pointer",
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
          </div>
        )}

        {/* Months View */}
        {calendarViewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, mIdx) => (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(year, mIdx, 1));
                  setCalendarViewMode("days");
                }}
                style={{
                  padding: "10px 4px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: month === mIdx ? c.selBg : c.monthBg,
                  color: month === mIdx ? c.selText : c.dayText,
                  cursor: "pointer",
                  fontWeight: month === mIdx ? 600 : 400,
                }}
              >
                {mName.substring(0, 3)}
              </button>
            ))}
          </div>
        )}

        {/* Years View */}
        {calendarViewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const yNum = yearRangeStart + i;
              return (
                <button
                  key={yNum}
                  type="button"
                  onClick={() => {
                    setCalendarViewDate(new Date(yNum, month, 1));
                    setCalendarViewMode("months");
                  }}
                  style={{
                    padding: "10px 4px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: year === yNum ? c.selBg : c.monthBg,
                    color: year === yNum ? c.selText : c.dayText,
                    cursor: "pointer",
                    fontWeight: year === yNum ? 600 : 400,
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
              setCalendarViewDate(today);
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

  const sampleProductsData = [
    { kode: "PRD-001", nama: "Laptop ASUS ZenBook 14", dibeli: 15, retur: 0, bersih: 15, avgPrice: "Rp 14.500.000", total: "Rp 217.500.000" },
    { kode: "PRD-002", nama: "Monitor Dell UltraSharp 27", dibeli: 25, retur: 1, bersih: 24, avgPrice: "Rp 6.200.000", total: "Rp 148.800.000" },
    { kode: "PRD-003", nama: "Keyboard Mechanical Keychron K2", dibeli: 50, retur: 2, bersih: 48, avgPrice: "Rp 1.450.000", total: "Rp 69.600.000" },
    { kode: "PRD-004", nama: "Mouse Wireless Logitech MX Master 3S", dibeli: 40, retur: 0, bersih: 40, avgPrice: "Rp 1.650.000", total: "Rp 66.000.000" },
  ];

  return (
    <div
      className={isDark ? "pp-dark" : ""}
      style={{
        margin: "-24px", backgroundColor: t.pageBg, minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text, colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "1920px", margin: "0 auto", padding: "16px 24px" }}>

        {/* Header Section */}
        <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: t.title, margin: 0 }}>
              Pembelian per produk
            </h1>
            <span style={{ fontSize: "15px", fontWeight: 400, color: t.muted }}>
              (dalam IDR)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              style={{
                ...outlineBtn,
                display: "inline-flex", alignItems: "center", padding: "0 14px", fontSize: "13px", fontWeight: 500,
              }}
              {...hoverBg(t.btnBg, t.btnHover)}
            >
              <span>Beri masukan</span>
              <span style={{ marginLeft: "10px", paddingLeft: "10px", borderLeft: `1px solid ${t.btnBorder}`, display: "inline-flex", alignItems: "center" }}>
                <svg style={{ width: "12px", height: "12px", fill: t.btnText }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </span>
            </button>
          </div>
        </header>

        {/* Main Card */}
        <main style={{ backgroundColor: t.panel, border: `1px solid ${t.panelBorder}`, borderRadius: "8px 8px 0 0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>

          {/* Filter Toolbar */}
          <section style={{ padding: "20px", borderBottom: `1px solid ${t.divider}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>

              {/* Filter Controls */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>

                {/* Tanggal awal */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
                  <label style={mainLabelStyle}>Tanggal awal</label>
                  <div style={{ position: "relative", width: "145px" }}>
                    <input type="text" readOnly value={startDateStr} onClick={() => setShowStartCalendar(!showStartCalendar)} style={mainFieldStyle} />
                    <div style={iconWrap(t.icon)}>{renderCalIcon()}</div>
                    {showStartCalendar &&
                      renderCalendarPopup(
                        startSelectedDate, setStartSelectedDate,
                        startCalendarViewDate, setStartCalendarViewDate,
                        startCalendarViewMode, setStartCalendarViewMode,
                        startYearRangeStart, setStartYearRangeStart,
                        () => setShowStartCalendar(false)
                      )}
                  </div>
                </div>

                {/* Tanggal akhir */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
                  <label style={mainLabelStyle}>Tanggal akhir</label>
                  <div style={{ position: "relative", width: "145px" }}>
                    <input type="text" readOnly value={endDateStr} onClick={() => setShowEndCalendar(!showEndCalendar)} style={mainFieldStyle} />
                    <div style={iconWrap(t.icon)}>{renderCalIcon()}</div>
                    {showEndCalendar &&
                      renderCalendarPopup(
                        endSelectedDate, setEndSelectedDate,
                        endCalendarViewDate, setEndCalendarViewDate,
                        endCalendarViewMode, setEndCalendarViewMode,
                        endYearRangeStart, setEndYearRangeStart,
                        () => setShowEndCalendar(false),
                        true
                      )}
                  </div>
                </div>

                {/* Periode Select */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={mainPeriodRef}>
                  <label style={mainLabelStyle}>Periode</label>
                  <div style={{ position: "relative", width: "150px" }}>
                    <div
                      onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                      style={{ ...mainFieldStyle, display: "flex", alignItems: "center" }}
                    >
                      {periodePreset}
                    </div>
                    <div style={iconWrap(t.iconMuted)}>{renderChevron()}</div>

                    {showMainPeriodDropdown && (
                      <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "4px" }}>
                        {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini"].map((preset) =>
                          renderDdItem(preset, periodePreset === preset, () => {
                            setPeriodePreset(preset);
                            setShowMainPeriodDropdown(false);
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tampilkan & Filter Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setShowReport(true)}
                    style={{
                      height: "36px", padding: "0 20px", backgroundColor: t.accent, color: t.accentText,
                      fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "4px", cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease",
                    }}
                    {...hoverBg(t.accent, t.accentHover)}
                  >
                    Tampilkan
                  </button>

                  <button
                    type="button"
                    onClick={openFilterDrawer}
                    style={{
                      ...outlineBtn, padding: "0 14px", fontSize: "12px", fontWeight: 600,
                      display: "inline-flex", alignItems: "center", gap: "6px",
                    }}
                    {...hoverBg(t.btnBg, t.btnHover)}
                  >
                    <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Ekspor & Lihat contoh */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                <div style={{ position: "relative" }} ref={eksporDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                    style={{
                      ...outlineBtn, padding: "0 14px", fontSize: "12px", fontWeight: 500,
                      display: "inline-flex", alignItems: "center", gap: "8px",
                    }}
                    {...hoverBg(t.btnBg, t.btnHover)}
                  >
                    <span>Ekspor</span>
                    <svg style={{ width: "12px", height: "12px", fill: t.btnText }} viewBox="0 0 20 20">
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>

                  {showEksporDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "160px", borderRadius: "4px" }}>
                      {["PDF", "Excel (XLSX)", "CSV"].map((fmt) =>
                        renderDdItem(`Ekspor ke ${fmt}`, false, () => setShowEksporDropdown(false))
                      )}
                    </div>
                  )}
                </div>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.link, textDecoration: "none" }}
                >
                  <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                    <svg
                      style={{ width: "16px", height: "16px", color: t.pdfIcon }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    <span
                      style={{
                        position: "absolute", left: "-4px", bottom: "2px", backgroundColor: "#ef4444",
                        fontSize: "8px", fontWeight: 700, color: "#ffffff", padding: "0 2px", borderRadius: "2px",
                        lineHeight: 1, transform: "scale(0.75)", transformOrigin: "bottom left", pointerEvents: "none",
                      }}
                    >
                      PDF
                    </span>
                  </span>
                  <span>Lihat contoh</span>
                </a>
              </div>
            </div>
          </section>

          {/* Content View */}
          {!showReport ? (
            /* Empty State */
            <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "440px", textAlign: "center" }}>
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
                
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, marginBottom: "6px" }}>
                  Laporan akan muncul di sini
                </h2>
                <p style={{ fontSize: "12px", color: t.muted, margin: 0 }}>
                  Pilih tanggal atau periode, lalu klik tombol <span style={{ fontWeight: 600, color: t.strong }}>Tampilkan</span>.
                </p>
              </div>
            </section>
          ) : (
            /* Table Data View */
            <section style={{ padding: "20px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: t.text }}>
                <thead>
                  <tr style={{ backgroundColor: t.panel, borderBottom: `2px solid ${t.tableHeadBorder}`, textAlign: "left" }}>
                    <th style={{ padding: "12px", fontWeight: 600 }}>Kode Produk</th>
                    <th style={{ padding: "12px", fontWeight: 600 }}>Nama Produk</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Kuantitas Dibeli</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Kuantitas Retur</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Pembelian Bersih</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Rata-rata Harga (IDR)</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Subtotal (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProductsData.map((prod, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${t.tableRowBorder}`, backgroundColor: t.panel }}>
                      <td style={{ padding: "12px", color: t.link, fontWeight: 500 }}>{prod.kode}</td>
                      <td style={{ padding: "12px", fontWeight: 500 }}>{prod.nama}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{prod.dibeli}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{prod.retur}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{prod.bersih}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{prod.avgPrice}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{prod.total}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: t.panel, borderTop: `2px solid ${t.tableTotalBorder}`, fontWeight: 700 }}>
                    <td colSpan={2} style={{ padding: "12px" }}>Total</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>130</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>3</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>127</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>-</td>
                    <td style={{ padding: "12px", textAlign: "right", color: t.link }}>Rp 501.900.000</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

        </main>
      </div>

      {/* Drawer Sidebar Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          {/* Backdrop */}
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed", inset: 0, backgroundColor: t.overlay,
              opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s ease-in-out",
            }}
          />

          {/* Drawer Panel */}
          <div
            style={{
              position: "relative", width: "420px", maxWidth: "95vw", height: "100%",
              backgroundColor: t.drawerBg,
              borderLeft: isDark ? `1px solid ${t.panelBorder}` : "none",
              boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
              display: "flex", flexDirection: "column",
              colorScheme: isDark ? "dark" : "light",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out", zIndex: 101,
            }}
          >
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Filter laporan</h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ border: "none", background: "none", fontSize: "18px", color: t.iconMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Tanggal awal & Tanggal akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ ...drawerLabelStyle, flex: 1 }}>Tanggal awal</span>
                  <span style={{ ...drawerLabelStyle, flex: 1, paddingLeft: "12px" }}>Tanggal akhir</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* Tanggal awal */}
                  <div style={{ position: "relative", flex: 1 }} ref={drawerStartDatePickerRef}>
                    <input
                      type="text" readOnly value={drawerStartDate}
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{ ...drawerFieldStyle, paddingRight: "32px", cursor: "pointer" }}
                    />
                    <div style={iconWrap(t.icon)}>{renderCalIcon()}</div>
                    {showDrawerStartCalendar &&
                      renderCalendarPopup(
                        drawerStartSelectedDate, setDrawerStartSelectedDate,
                        drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                        drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                        drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                        () => setShowDrawerStartCalendar(false)
                      )}
                  </div>

                  <span style={{ color: t.muted, fontWeight: 500 }}>-</span>

                  {/* Tanggal akhir */}
                  <div style={{ position: "relative", flex: 1 }} ref={drawerEndDatePickerRef}>
                    <input
                      type="text" readOnly value={drawerEndDate}
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{ ...drawerFieldStyle, paddingRight: "32px", cursor: "pointer" }}
                    />
                    <div style={iconWrap(t.icon)}>{renderCalIcon()}</div>
                    {showDrawerEndCalendar &&
                      renderCalendarPopup(
                        drawerEndSelectedDate, setDrawerEndSelectedDate,
                        drawerEndCalendarViewDate, setDrawerEndCalendarViewDate,
                        drawerEndCalendarViewMode, setDrawerEndCalendarViewMode,
                        drawerEndYearRangeStart, setDrawerEndYearRangeStart,
                        () => setShowDrawerEndCalendar(false),
                        true
                      )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodRef}>
                <label style={drawerLabelStyle}>Periode</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                    style={{ ...drawerFieldStyle, paddingRight: "32px", display: "flex", alignItems: "center", cursor: "pointer" }}
                  >
                    {drawerPeriod}
                  </div>
                  <div style={iconWrap(t.iconMuted)}>{renderChevron()}</div>
                  {showDrawerPeriodDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "6px" }}>
                      {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini"].map((preset) =>
                        renderDdItem(preset, drawerPeriod === preset, () => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); }, "13px")
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tipe transaksi */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Tipe transaksi</label>
                {renderDrawerSelect(drawerTipeTransaksi, setDrawerTipeTransaksi, "", ["Faktur pembelian", "Pesanan pembelian", "Pengiriman pembelian", "Semua tipe"], false)}
              </div>

              {/* Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerTag}
                  onChange={(e) => setDrawerTag(e.target.value)}
                  style={{ ...drawerFieldStyle, paddingRight: "12px" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
                  {renderRadio("tagMatch", drawerTagMatch === "all", () => setDrawerTagMatch("all"), "Mencakup semua")}
                  {renderRadio("tagMatch", drawerTagMatch === "one", () => setDrawerTagMatch("one"), "Salah satu")}
                  <span style={{ color: t.infoIcon, cursor: "pointer", fontSize: "14px" }} title="Informasi tag">ⓘ</span>
                </div>
              </div>

              {/* Supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Supplier</label>
                {renderDrawerSelect(drawerSupplier, setDrawerSupplier, "Pilih supplier", ["Semua supplier", "PT Global Jaya", "CV Maju Bersama"])}
              </div>

              {/* Kategori produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Kategori produk</label>
                {renderDrawerSelect(drawerKategoriProduk, setDrawerKategoriProduk, "Pilih Kategori produk", ["Semua kategori", "Elektronik", "Aksesoris"])}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
                  {renderRadio("kategoriMatch", drawerKategoriMatch === "all", () => setDrawerKategoriMatch("all"), "Mencakup semua")}
                  {renderRadio("kategoriMatch", drawerKategoriMatch === "one", () => setDrawerKategoriMatch("one"), "Salah satu")}
                  <span style={{ color: t.infoIcon, cursor: "pointer", fontSize: "14px" }} title="Informasi kategori">ⓘ</span>
                </div>
              </div>

              {/* Produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Produk</label>
                {renderDrawerSelect(drawerProduk, setDrawerProduk, "Pilih produk", ["Semua produk", "Laptop ASUS ZenBook 14", "Monitor Dell UltraSharp 27"])}
              </div>

              {/* Checkbox detail */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="detailVersion"
                  checked={drawerDetailVersion}
                  onChange={(e) => setDrawerDetailVersion(e.target.checked)}
                  style={{
                    accentColor: t.accent, width: "16px", height: "16px", marginTop: "3px",
                    borderRadius: "4px", cursor: "pointer", outline: "none", boxShadow: "none",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="detailVersion" style={{ ...drawerLabelStyle, cursor: "pointer" }}>
                    Lihat versi lebih detail
                  </label>
                  <span style={{ fontSize: "12px", color: t.subText, marginTop: "2px", lineHeight: 1.4 }}>
                    Menampilkan info nomor transaksi dan diskon dengan pengelompokan berdasarkan tipe produk.
                  </span>
                </div>
              </div>

              {/* Urutkan berdasarkan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Urutkan berdasarkan</label>
                {renderDrawerSelect(drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan, "", ["Nama produk", "Kode produk", "Kuantitas dibeli", "Subtotal"], false)}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
                  {renderRadio("sortDirection", drawerUrutanDirection === "asc", () => setDrawerUrutanDirection("asc"), "Urutkan naik")}
                  {renderRadio("sortDirection", drawerUrutanDirection === "desc", () => setDrawerUrutanDirection("desc"), "Urutkan turun")}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: "14px 20px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: t.drawerBg }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerTipeTransaksi("Faktur pembelian");
                  setDrawerTag("");
                  setDrawerTagMatch("all");
                  setDrawerSupplier("");
                  setDrawerKategoriProduk("");
                  setDrawerKategoriMatch("all");
                  setDrawerProduk("");
                  setDrawerDetailVersion(false);
                  setDrawerUrutkanBerdasarkan("Nama produk");
                  setDrawerUrutanDirection("asc");
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px", background: "none", border: "none",
                  color: t.link, fontSize: "13px", fontWeight: 500, cursor: "pointer",
                }}
              >
                <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Reset filter</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    height: "36px", padding: "0 16px", backgroundColor: "transparent", color: t.ghostText,
                    fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { if (isDark) e.currentTarget.style.color = "#E5B85C"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t.ghostText; }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  style={{
                    height: "36px", padding: "0 20px", backgroundColor: isDark ? t.accent : "#3b52d4",
                    color: t.accentText, fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px",
                    cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "background-color 0.15s ease",
                  }}
                  {...hoverBg(isDark ? t.accent : "#3b52d4", isDark ? t.accentHover : "#2f43b0")}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pp-dark input::placeholder { color: #94a3b8; }
        .pp-dark select option { background-color: #1e1e1e; color: #f1f5f9; }
      `}</style>
    </div>
  );
}