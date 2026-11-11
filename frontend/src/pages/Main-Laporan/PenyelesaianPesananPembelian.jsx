import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PenyelesaianPesananPembelian() {
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
      label: "#e2e8f0", value: "#f1f5f9", strong: "#ffffff",
      panel: "#1a1a1a", panelBorder: "#634f27", rowBorder: "#3a3326", headLine: "#634f27", totalLine: "#8a6d33",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9",
      icon: "#E5B85C", iconMuted: "#94a3b8", accent: "#E5B85C",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddSel: "rgba(229,184,92,0.2)", ddSelText: "#E5B85C", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326", overlay: "rgba(0, 0, 0, 0.7)",
      ghostText: "#cbd5e1", linkText: "#E5B85C", sep: "#94a3b8",
      badgeDoneBg: "rgba(34,197,94,0.18)", badgeDoneText: "#86efac",
      badgePartBg: "rgba(234,179,8,0.18)", badgePartText: "#fde047",
      btnShadow: "0 1px 2px rgba(0,0,0,0.3)",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#1e293b", muted: "#64748b",
      label: "#334155", value: "#1e293b", strong: "#334155",
      panel: "#ffffff", panelBorder: "#e2e8f0", rowBorder: "#e2e8f0", headLine: "#cbd5e1", totalLine: "#94a3b8",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#1e293b",
      icon: "#64748b", iconMuted: "#475569", accent: "#4361ee",
      primary: "#4361ee", primaryHover: "#3651d4", primaryText: "#ffffff",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#cbd5e1", btnText: "#4361ee",
      ddBg: "#ffffff", ddBorder: "#e2e8f0", ddText: "#334155", ddHover: "#f1f5f9",
      ddSel: "#f1f5f9", ddSelText: "#334155", ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      drawerBg: "#ffffff", drawerBorder: "#f1f5f9", overlay: "rgba(15, 23, 42, 0.4)",
      ghostText: "#475569", linkText: "#4361ee", sep: "#64748b",
      badgeDoneBg: "#dcfce7", badgeDoneText: "#166534",
      badgePartBg: "#fef9c3", badgePartText: "#854d0e",
      btnShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
      shadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
      nav: "#64748b", accent: "#0284c7", weekday: "#64748b",
      selBg: "#0284c7", selText: "#ffffff",
      dayText: "#334155", monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
    };

  // Tanggal awal State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("21/09/2026");

  // Tanggal akhir State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("21/09/2026");

  // Periode Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Action Dropdowns
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Show Report State
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("21/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("21/09/2026");

  const [drawerSupplier, setDrawerSupplier] = useState("");
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("all");
  const drawerMulaiDariRef = useRef(null);
  const [drawerMulaiDari, setDrawerMulaiDari] = useState("Pemesanan");
  const [showDrawerMulaiDariDropdown, setShowDrawerMulaiDariDropdown] = useState(false);
  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("No. Pesanan");
  const [drawerUrutanDirection, setDrawerUrutanDirection] = useState("asc");

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const PERIODE_OPTIONS = ["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"];

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
      if (drawerMulaiDariRef.current && !drawerMulaiDariRef.current.contains(event.target)) setShowDrawerMulaiDariDropdown(false);
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
    borderRadius: "6px",
    boxShadow: t.ddShadow,
    padding: "4px 0",
  };

  const renderOption = (label, selected, onClick, fontSize = "13px") => (
    <div
      key={label}
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
      {label}
    </div>
  );

  const mainLabelStyle = { fontSize: "13px", fontWeight: 500, color: t.label, marginBottom: "6px" };
  const mainFieldStyle = {
    width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13.5px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    cursor: "pointer", boxSizing: "border-box", outline: "none",
  };
  const mainIconWrap = (color) => ({
    position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center",
    paddingRight: "10px", pointerEvents: "none", color,
  });
  const outlineBtnStyle = {
    height: "38px", padding: "0 14px", backgroundColor: t.btnBg, border: `1px solid ${t.btnBorder}`,
    color: t.btnText, fontWeight: 500, fontSize: "13.5px", borderRadius: "6px", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "8px", boxShadow: t.btnShadow,
    transition: "background-color 0.15s ease",
  };

  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.label };
  const drawerFieldStyle = {
    width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
    border: `1px solid ${t.fieldBorder}`, borderRadius: "8px", backgroundColor: t.field, color: t.fieldText,
    boxSizing: "border-box", outline: "none",
  };

  const renderCalIcon = (size = 17, color = "currentColor") => (
    <svg style={{ width: `${size}px`, height: `${size}px` }} fill="none" stroke={color} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.75" />
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.75" />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.75" />
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.75" />
    </svg>
  );

  const renderChevron = (size = 16) => (
    <svg style={{ width: `${size}px`, height: `${size}px` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" strokeWidth="2" />
    </svg>
  );

  // Dropdown di drawer
  const renderDrawerSelect = ({ label, value, open, setOpen, options, onPick, refEl }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={refEl}>
      <label style={drawerLabelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{ ...drawerFieldStyle, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        >
          <span>{value}</span>
          <span style={{ color: t.icon, display: "flex" }}>{renderChevron(16)}</span>
        </div>
        {open && (
          <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
            {options.map((opt) => renderOption(opt, value === opt, () => onPick(opt)))}
          </div>
        )}
      </div>
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

    const navBtn = { padding: "4px 8px", border: "none", background: "none", cursor: "pointer", color: c.nav, borderRadius: "4px", display: "flex" };

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 1000,
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
                <span onClick={() => setCalendarViewMode("months")} style={{ cursor: "pointer" }}>
                  {MONTH_NAMES[month]}
                </span>{" "}
                <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>
                  {year}
                </span>
              </>
            )}
            {calendarViewMode === "months" && (
              <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
            )}
            {calendarViewMode === "years" && (
              <span>{yearRangeStart} - {yearRangeStart + 11}</span>
            )}
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

  const sampleOrdersData = [
    { no: "PO-2026/09/001", tgl: "15/09/2026", supplier: "PT Tech Indo", tglSelesai: "20/09/2026", status: "Selesai", qtyPesan: 50, qtyTerima: 50, qtyFaktur: 50, total: "Rp 125.000.000" },
    { no: "PO-2026/09/002", tgl: "18/09/2026", supplier: "CV Elektronik Utama", tglSelesai: "21/09/2026", status: "Selesai", qtyPesan: 30, qtyTerima: 30, qtyFaktur: 30, total: "Rp 78.500.000" },
    { no: "PO-2026/09/003", tgl: "19/09/2026", supplier: "PT Sumber Makmur", tglSelesai: "-", status: "Sebagian", qtyPesan: 100, qtyTerima: 60, qtyFaktur: 60, total: "Rp 45.000.000" },
  ];

  return (
    <div
      className={isDark ? "pp-dark" : ""}
      style={{
        margin: "-24px",
        backgroundColor: t.pageBg,
        minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <main style={{ width: "100%", backgroundColor: t.pageBg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Page Header */}
        <header style={{ padding: "20px 32px 16px 32px", borderBottom: `1px solid ${t.panelBorder}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: t.title, letterSpacing: "-0.01em", margin: 0 }}>
              Penyelesaian Pemesanan Pembelian
            </h1>
            <span style={{ fontSize: "13px", fontWeight: 400, color: t.muted }}>
              (dalam IDR)
            </span>
          </div>
        </header>

        {/* Filter and Action Toolbar */}
        <section style={{ padding: "20px 32px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>

          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>

            {/* Tanggal awal */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={startDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal awal</label>
              <div style={{ position: "relative", width: "155px" }}>
                <input
                  type="text"
                  readOnly
                  value={startDateStr}
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                  style={mainFieldStyle}
                />
                <div style={mainIconWrap(t.icon)}>{renderCalIcon()}</div>

                {showStartCalendar &&
                  renderCalendarPopup(
                    startSelectedDate,
                    setStartSelectedDate,
                    startCalendarViewDate,
                    setStartCalendarViewDate,
                    startCalendarViewMode,
                    setStartCalendarViewMode,
                    startYearRangeStart,
                    setStartYearRangeStart,
                    () => setShowStartCalendar(false)
                  )}
              </div>
            </div>

            {/* Tanggal akhir */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={endDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal akhir</label>
              <div style={{ position: "relative", width: "155px" }}>
                <input
                  type="text"
                  readOnly
                  value={endDateStr}
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                  style={mainFieldStyle}
                />
                <div style={mainIconWrap(t.icon)}>{renderCalIcon()}</div>

                {showEndCalendar &&
                  renderCalendarPopup(
                    endSelectedDate,
                    setEndSelectedDate,
                    endCalendarViewDate,
                    setEndCalendarViewDate,
                    endCalendarViewMode,
                    setEndCalendarViewMode,
                    endYearRangeStart,
                    setEndYearRangeStart,
                    () => setShowEndCalendar(false),
                    true
                  )}
              </div>
            </div>

            {/* Periode Dropdown */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={mainPeriodRef}>
              <label style={mainLabelStyle}>Periode</label>
              <div style={{ position: "relative", width: "155px" }}>
                <div
                  onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                  style={{ ...mainFieldStyle, display: "flex", alignItems: "center" }}
                >
                  {periodePreset}
                </div>
                <div style={mainIconWrap(t.iconMuted)}>{renderChevron(16)}</div>

                {showMainPeriodDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%" }}>
                    {PERIODE_OPTIONS.map((preset) =>
                      renderOption(preset, periodePreset === preset, () => {
                        setPeriodePreset(preset);
                        setShowMainPeriodDropdown(false);
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Submit Button */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowReport(true)}
                style={{
                  height: "38px",
                  padding: "0 20px",
                  backgroundColor: t.primary,
                  color: t.primaryText,
                  fontWeight: 500,
                  fontSize: "13.5px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: t.btnShadow,
                  transition: "background-color 0.15s ease",
                }}
                {...hoverBg(t.primary, t.primaryHover)}
              >
                Filter
              </button>
            </div>

            {/* Filter Lainnya Button */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button type="button" onClick={openFilterDrawer} style={outlineBtnStyle} {...hoverBg(t.btnBg, t.btnHover)}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke={t.accent} viewBox="0 0 24 24">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeWidth="1.8" />
                </svg>
                <span>Filter lainnya</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Template & Export */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Template Button */}
            <button type="button" onClick={() => setShowTemplateModal(true)} style={outlineBtnStyle} {...hoverBg(t.btnBg, t.btnHover)}>
              <svg style={{ width: "16px", height: "16px" }} fill="none" stroke={t.accent} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="1.8" />
              </svg>
              <span>Template</span>
            </button>

            {/* Ekspor Dropdown Button */}
            <div style={{ position: "relative" }} ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={outlineBtnStyle}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                <span>Ekspor</span>
                <svg style={{ width: "14px", height: "14px", fill: t.accent }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "160px" }}>
                  {["PDF", "Excel (XLSX)", "CSV"].map((fmt) =>
                    renderOption(`Ekspor ke ${fmt}`, false, () => setShowEksporDropdown(false))
                  )}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Main Content Area */}
        {!showReport ? (
          /* Empty State Section */
          <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "64px", paddingBottom: "80px", paddingLeft: "16px", paddingRight: "16px" }}>
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

            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "15.5px", fontWeight: 700, color: t.title, letterSpacing: "-0.01em", marginBottom: "4px" }}>
                Laporan akan muncul di sini
              </h2>
              <p style={{ fontSize: "13px", color: t.muted, margin: 0, fontWeight: 400 }}>
                Pilih tanggal atau periode, lalu klik tombol <span style={{ fontWeight: 700, color: t.strong }}>Filter</span>.
              </p>
            </div>
          </section>
        ) : (
          /* Table View */
          <section style={{ padding: "20px 32px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: t.text }}>
              <thead>
                <tr style={{ backgroundColor: t.panel, borderBottom: `2px solid ${t.headLine}`, textAlign: "left" }}>
                  <th style={{ padding: "12px", fontWeight: 600 }}>No. Pesanan Pembelian</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Tanggal Pesanan</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Supplier</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Tgl Penyelesaian</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Qty Pesanan</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Qty Diterima</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Qty Difaktur</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Total Pesanan (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {sampleOrdersData.map((ord, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${t.rowBorder}`, backgroundColor: t.pageBg }}>
                    <td style={{ padding: "12px", color: t.linkText, fontWeight: 500 }}>{ord.no}</td>
                    <td style={{ padding: "12px" }}>{ord.tgl}</td>
                    <td style={{ padding: "12px", fontWeight: 500 }}>{ord.supplier}</td>
                    <td style={{ padding: "12px" }}>{ord.tglSelesai}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                          backgroundColor: ord.status === "Selesai" ? t.badgeDoneBg : t.badgePartBg,
                          color: ord.status === "Selesai" ? t.badgeDoneText : t.badgePartText,
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{ord.qtyPesan}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{ord.qtyTerima}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{ord.qtyFaktur}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{ord.total}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: t.pageBg, borderTop: `2px solid ${t.totalLine}`, fontWeight: 700 }}>
                  <td colSpan={5} style={{ padding: "12px" }}>Total</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>180</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>140</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>140</td>
                  <td style={{ padding: "12px", textAlign: "right", color: t.linkText }}>Rp 248.500.000</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

      </main>

      {/* Drawer Sidebar Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: t.overlay,
              opacity: drawerOpen ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          <div
            style={{
              position: "relative",
              width: "400px",
              maxWidth: "95vw",
              height: "100%",
              backgroundColor: t.drawerBg,
              borderLeft: isDark ? `1px solid ${t.panelBorder}` : "none",
              boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out",
              zIndex: 101,
              colorScheme: isDark ? "dark" : "light",
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Filter laporan</h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ border: "none", background: "none", fontSize: "18px", color: t.icon, cursor: "pointer", padding: "4px" }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Tanggal awal & Tanggal akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ ...drawerLabelStyle, flex: 1 }}>Tanggal awal</span>
                  <span style={{ width: "8px" }}></span>
                  <span style={{ ...drawerLabelStyle, flex: 1 }}>Tanggal akhir</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ position: "relative", flex: 1 }} ref={drawerStartDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerStartDate}
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{ ...drawerFieldStyle, paddingRight: "36px", cursor: "pointer" }}
                    />
                    <span
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: t.icon, cursor: "pointer", display: "flex" }}
                    >
                      {renderCalIcon(18)}
                    </span>
                    {showDrawerStartCalendar &&
                      renderCalendarPopup(
                        drawerStartSelectedDate,
                        setDrawerStartSelectedDate,
                        drawerStartCalendarViewDate,
                        setDrawerStartCalendarViewDate,
                        drawerStartCalendarViewMode,
                        setDrawerStartCalendarViewMode,
                        drawerStartYearRangeStart,
                        setDrawerStartYearRangeStart,
                        () => setShowDrawerStartCalendar(false)
                      )}
                  </div>

                  <span style={{ color: t.sep, fontWeight: 500 }}>-</span>

                  <div style={{ position: "relative", flex: 1 }} ref={drawerEndDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDate}
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{ ...drawerFieldStyle, paddingRight: "36px", cursor: "pointer" }}
                    />
                    <span
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: t.icon, cursor: "pointer", display: "flex" }}
                    >
                      {renderCalIcon(18)}
                    </span>
                    {showDrawerEndCalendar &&
                      renderCalendarPopup(
                        drawerEndSelectedDate,
                        setDrawerEndSelectedDate,
                        drawerEndCalendarViewDate,
                        setDrawerEndCalendarViewDate,
                        drawerEndCalendarViewMode,
                        setDrawerEndCalendarViewMode,
                        drawerEndYearRangeStart,
                        setDrawerEndYearRangeStart,
                        () => setShowDrawerEndCalendar(false),
                        true
                      )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              {renderDrawerSelect({
                label: "Periode",
                value: drawerPeriod,
                open: showDrawerPeriodDropdown,
                setOpen: setShowDrawerPeriodDropdown,
                options: PERIODE_OPTIONS,
                onPick: (preset) => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); },
                refEl: drawerPeriodRef,
              })}

              {/* Mulai dari */}
              {renderDrawerSelect({
                label: "Mulai dari",
                value: drawerMulaiDari,
                open: showDrawerMulaiDariDropdown,
                setOpen: setShowDrawerMulaiDariDropdown,
                options: ["Pemesanan", "Pengiriman", "Faktur"],
                onPick: (opt) => { setDrawerMulaiDari(opt); setShowDrawerMulaiDariDropdown(false); },
                refEl: drawerMulaiDariRef,
              })}

              {/* Supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Supplier</label>
                <input
                  type="text"
                  placeholder="Pilih semua"
                  value={drawerSupplier}
                  onChange={(e) => setDrawerSupplier(e.target.value)}
                  style={{ ...drawerFieldStyle, paddingRight: "12px" }}
                />
              </div>

              {/* Grup dengan tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={drawerLabelStyle}>Grup dengan tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerTag}
                  onChange={(e) => setDrawerTag(e.target.value)}
                  style={{ ...drawerFieldStyle, paddingRight: "12px" }}
                />

                {/* Radio selection */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: t.label, fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="tagMatch"
                      checked={drawerTagMatch === "all"}
                      onChange={() => setDrawerTagMatch("all")}
                      style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Mencakup semua
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: t.label, fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="tagMatch"
                      checked={drawerTagMatch === "any"}
                      onChange={() => setDrawerTagMatch("any")}
                      style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Salah satu
                  </label>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: t.drawerBg }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerSupplier("");
                  setDrawerTag("");
                  setDrawerTagMatch("all");
                  setDrawerPeriod("Hari ini");
                  setDrawerMulaiDari("Pemesanan");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: t.accent,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: 0,
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
                  style={{
                    height: "38px",
                    padding: "0 18px",
                    backgroundColor: "transparent",
                    color: t.ghostText,
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
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
                    height: "38px",
                    padding: "0 24px",
                    backgroundColor: t.primary,
                    color: t.primaryText,
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: isDark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 2px rgba(67, 97, 238, 0.2)",
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

      <style>{`
        .pp-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}