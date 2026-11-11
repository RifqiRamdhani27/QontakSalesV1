import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function TingkatPemenuhanPesanan() {
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
      rowEven: "#1a1a1a", rowOdd: "#202020", rowText: "#cbd5e1", rowStrong: "#f1f5f9", rate: "#E5B85C",
      modalBg: "#1a1a1a", modalFooter: "#202020", codeBg: "#262626", codeBorder: "#634f27",
      badgeFullBg: "rgba(34,197,94,0.2)", badgeFullText: "#86efac",
      badgeNearBg: "rgba(229,184,92,0.2)", badgeNearText: "#E5B85C",
      badgePartBg: "rgba(245,158,11,0.2)", badgePartText: "#fcd34d",
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
      rowEven: "#ffffff", rowOdd: "#fafafa", rowText: "#334155", rowStrong: "#1e293b", rate: "#4361ee",
      modalBg: "#ffffff", modalFooter: "#f8fafc", codeBg: "#f8fafc", codeBorder: "#cbd5e1",
      badgeFullBg: "#dcfce7", badgeFullText: "#166534",
      badgeNearBg: "#e0e7ff", badgeNearText: "#3730a3",
      badgePartBg: "#fef3c7", badgePartText: "#92400e",
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

  // Tanggal State
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateStr, setDateStr] = useState("21/09/2026");

  // Periode Analisis Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodeAnalisis, setPeriodeAnalisis] = useState("Setiap 3 hari");
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
  const drawerDatePickerRef = useRef(null);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);
  const [drawerDate, setDrawerDate] = useState("21/09/2026");

  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const [drawerPencarianProduk, setDrawerPencarianProduk] = useState("nama");

  const drawerGudangRef = useRef(null);
  const [drawerGudang, setDrawerGudang] = useState("");
  const [showDrawerGudangDropdown, setShowDrawerGudangDropdown] = useState(false);

  const [drawerKolomUrut, setDrawerKolomUrut] = useState("penjualan");

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
  useEffect(() => { setDrawerDate(formatDateDDMMYYYY(drawerSelectedDate)); }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerDatePickerRef.current && !drawerDatePickerRef.current.contains(event.target)) setShowDrawerCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerGudangRef.current && !drawerGudangRef.current.contains(event.target)) setShowDrawerGudangDropdown(false);
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
      style={{ padding: "8px 12px", fontSize, color: t.ddText, cursor: "pointer", backgroundColor: selected ? t.ddSel : "transparent" }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = t.ddHover; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {label}
    </div>
  );

  const mainLabelStyle = { fontSize: "12px", fontWeight: 600, color: t.label, marginBottom: "6px" };
  const mainFieldStyle = {
    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "12px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    cursor: "pointer", boxSizing: "border-box",
  };
  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.drawerLabel };
  const drawerFieldStyle = {
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
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }

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
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontSize: "14px", fontWeight: 700, color: c.accent }}>
            {calendarViewMode === "days" && (
              <>
                <span onClick={() => setCalendarViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]}</span>{" "}
                <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
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

        {calendarViewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textTransform: "uppercase", fontSize: "11px", color: c.weekday, fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>
              <div>Ming</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((dateObj, idx) => {
                if (!dateObj) return <div key={`empty-${idx}`} />;
                const isSelected = selectedDate && dateObj.toDateString() === selectedDate.toDateString();
                const isToday = dateObj.toDateString() === new Date(2026, 8, 21).toDateString();
                return (
                  <button
                    key={dateObj.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(dateObj);
                      closeCalendar();
                    }}
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

        {calendarViewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(year, idx, 1));
                  setCalendarViewMode("days");
                }}
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

        {calendarViewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(yNum, month, 1));
                  setCalendarViewMode("months");
                }}
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

  const sampleReportData = [
    { code: "PRD-001", name: "Laptop ASUS Zenbook 14", ordered: 50, available: 48, rate: "96%", status: "Hampir Terpenuhi", value: "Rp 672.000.000" },
    { code: "PRD-002", name: "Monitor Dell UltraSharp 27", ordered: 30, available: 30, rate: "100%", status: "Terpenuhi", value: "Rp 195.000.000" },
    { code: "PRD-003", name: "Keyboard Keychron K2 Wireless", ordered: 40, available: 40, rate: "100%", status: "Terpenuhi", value: "Rp 58.000.000" },
    { code: "PRD-004", name: "Mouse Logitech MX Master 3S", ordered: 25, available: 15, rate: "60%", status: "Sebagian", value: "Rp 26.250.000" },
  ];

  const badgeStyle = (rate) => {
    if (rate === "100%") return { backgroundColor: t.badgeFullBg, color: t.badgeFullText };
    if (rate === "96%") return { backgroundColor: t.badgeNearBg, color: t.badgeNearText };
    return { backgroundColor: t.badgePartBg, color: t.badgePartText };
  };

  return (
    <div
      className={isDark ? "tpp-dark" : ""}
      style={{
        margin: "-24px", width: "calc(100% + 48px)", minHeight: "100vh", backgroundColor: t.pageBg,
        display: "flex", flexDirection: "column",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text, colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >

      {/* Header */}
      <header style={{ width: "100%", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.panelBorder}`, backgroundColor: t.pageBg, boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.01em" }}>
          Tingkat pemenuhan pesanan
        </h1>
        <div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 500,
              color: t.btnText, backgroundColor: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: "6px",
              textDecoration: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          >
            <svg style={{ width: "16px", height: "16px", color: t.btnText }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="8" x2="16" y1="6" y2="6" />
              <line x1="8" x2="14" y1="10" y2="10" />
            </svg>
            Artikel panduan
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>

        {/* Filter and Actions Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>

          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>

            {/* Tanggal Input Field */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="input-tanggal" style={mainLabelStyle}>
                Tanggal
              </label>
              <div style={{ position: "relative", width: "144px" }} ref={datePickerRef}>
                <input
                  id="input-tanggal"
                  type="text"
                  readOnly
                  value={dateStr}
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={mainFieldStyle}
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

            {/* Periode Analisis Dropdown */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={mainPeriodRef}>
              <label htmlFor="select-periode" style={mainLabelStyle}>
                Periode analisis
              </label>
              <div style={{ position: "relative", width: "176px" }}>
                <div
                  id="select-periode"
                  onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                  style={{ ...mainFieldStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>{periodeAnalisis}</span>
                  <svg style={{ width: "14px", height: "14px", color: t.btnText }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showMainPeriodDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "6px" }}>
                    {["Setiap 3 hari", "Setiap 7 hari", "Setiap 30 hari"].map((opt) =>
                      renderDdItem(opt, periodeAnalisis === opt, () => {
                        setPeriodeAnalisis(opt);
                        setShowMainPeriodDropdown(false);
                      })
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
                height: "36px", padding: "0 20px", backgroundColor: t.primary, color: t.accentText,
                fontSize: "12px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "background-color 0.15s ease"
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
                height: "36px", padding: "0 16px", backgroundColor: t.btnBg, color: t.btnText,
                fontSize: "12px", fontWeight: 500, border: `1px solid ${t.btnBorder}`, borderRadius: "6px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                transition: "background-color 0.15s ease"
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

            {/* Ekspor Dropdown Button */}
            <div style={{ position: "relative" }} ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "36px", padding: "0 16px", backgroundColor: t.btnBg, color: t.btnText,
                  fontSize: "12px", fontWeight: 500, border: `1px solid ${t.btnBorder}`, borderRadius: "6px",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
                  transition: "background-color 0.15s ease"
                }}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                <span>Ekspor</span>
                <svg style={{ width: "12px", height: "12px", fill: "currentColor" }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", borderRadius: "6px" }}>
                  {["CSV", "XLSX", "PDF"].map((fmt) =>
                    renderDdItem(fmt, false, () => {
                      setShowEksporDropdown(false);
                      alert(`Mengekspor laporan ke format ${fmt}...`);
                    })
                  )}
                </div>
              )}
            </div>

            {/* Lihat Contoh Link */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowTemplateModal(true);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: isDark ? t.btnText : "#2563eb", textDecoration: "none" }}
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
              
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: t.title, marginBottom: "6px", letterSpacing: "-0.01em" }}>
                Laporan akan muncul di sini
              </h2>
              <p style={{ fontSize: "12px", color: t.muted, lineHeight: 1.6, margin: 0 }}>
                Pilih tanggal dan periode analisis, lalu klik tombol <span style={{ fontWeight: 600, color: t.strong }}>Tampilkan</span>.
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
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Kuantitas Dipesan</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Kuantitas Tersedia</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Tingkat Pemenuhan (%)</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Nilai</th>
                </tr>
              </thead>
              <tbody>
                {sampleReportData.map((item, idx) => (
                  <tr key={item.code} style={{ borderBottom: `1px solid ${t.tableBorder}`, backgroundColor: idx % 2 === 0 ? t.rowEven : t.rowOdd }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: t.rowStrong }}>{item.code}</td>
                    <td style={{ padding: "12px 16px", color: t.rowText }}>{item.name}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: t.rowText }}>{item.ordered}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: t.rowText }}>{item.available}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: t.rate }}>{item.rate}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        ...badgeStyle(item.rate),
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: t.rowStrong }}>{item.value}</td>
                  </tr>
                ))}
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
              position: "fixed", inset: 0, backgroundColor: t.overlay,
              opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s ease-in-out",
            }}
          />

          <div
            style={{
              position: "relative", width: "400px", maxWidth: "95vw", height: "100%",
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
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Filter</h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ border: "none", background: "none", fontSize: "18px", color: t.iconMuted, cursor: "pointer", padding: "4px" }}
              >
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
                    style={{ ...drawerFieldStyle, paddingRight: "36px" }}
                  />
                  <svg
                    onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: t.icon, cursor: "pointer" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {showDrawerCalendar &&
                    renderCalendarPopup(
                      drawerSelectedDate,
                      setDrawerSelectedDate,
                      drawerCalendarViewDate,
                      setDrawerCalendarViewDate,
                      drawerCalendarViewMode,
                      setDrawerCalendarViewMode,
                      drawerYearRangeStart,
                      setDrawerYearRangeStart,
                      () => setShowDrawerCalendar(false)
                    )}
                </div>
              </div>

              {/* Periode analisis */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodRef}>
                <label style={drawerLabelStyle}>Periode analisis</label>
                <div style={{ position: "relative" }}>
                  <div onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)} style={drawerFieldStyle}>
                    <span>{drawerPeriod}</span>
                    <svg style={{ width: "16px", height: "16px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerPeriodDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {["Setiap 3 hari", "Setiap 7 hari", "Setiap 30 hari"].map((preset) =>
                        renderDdItem(preset, drawerPeriod === preset, () => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); }, "13px")
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tampilan tabel */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Tampilan tabel</label>
              </div>

              {/* Pencarian produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={drawerLabelStyle}>Pencarian produk</label>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  {renderRadio("pencarianProduk", drawerPencarianProduk === "nama", () => setDrawerPencarianProduk("nama"), "Berdasarkan nama")}
                  {renderRadio("pencarianProduk", drawerPencarianProduk === "kategori", () => setDrawerPencarianProduk("kategori"), "Berdasarkan kategori")}
                </div>
              </div>

              {/* Gudang */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerGudangRef}>
                <label style={drawerLabelStyle}>Gudang</label>
                <div style={{ position: "relative" }}>
                  <div onClick={() => setShowDrawerGudangDropdown(!showDrawerGudangDropdown)} style={drawerFieldStyle}>
                    <span>{drawerGudang}</span>
                    <svg style={{ width: "16px", height: "16px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerGudangDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {["Semua gudang", "Gudang Utama", "Gudang Cabang"].map((opt) =>
                        renderDdItem(opt, drawerGudang === opt, () => { setDrawerGudang(opt); setShowDrawerGudangDropdown(false); }, "13px")
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom untuk diurutkan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={drawerLabelStyle}>Kolom untuk diurutkan</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {renderRadio("kolomUrut", drawerKolomUrut === "penjualan", () => setDrawerKolomUrut("penjualan"), "Qty tersedia di pesanan penjualan")}
                  {renderRadio("kolomUrut", drawerKolomUrut === "pembelian", () => setDrawerKolomUrut("pembelian"), "Qty tersedia di pesanan pembelian")}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: t.drawerBg }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerPeriod("");
                  setDrawerPencarianProduk("nama");
                  setDrawerGudang("");
                  setDrawerKolomUrut("penjualan");
                }}
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
                  style={{
                    height: "38px", padding: "0 18px", backgroundColor: "transparent", color: t.ghostText,
                    fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer"
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
                    height: "38px", padding: "0 24px", backgroundColor: t.primary, color: t.accentText,
                    fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "background-color 0.15s ease"
                  }}
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Contoh Laporan Tingkat Pemenuhan Pesanan</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: t.iconMuted, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px", fontSize: "13px", color: t.rowText, lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 12px 0" }}>Berikut adalah pratinjau format standar laporan Tingkat Pemenuhan Pesanan yang siap diekspor ke PDF / Excel:</p>
              <div style={{ backgroundColor: t.codeBg, border: `1px solid ${t.codeBorder}`, borderRadius: "6px", padding: "12px", fontSize: "12px", fontFamily: "monospace", color: t.text }}>
                <div><strong>Judul:</strong> Laporan Tingkat Pemenuhan Pesanan</div>
                <div><strong>Periode:</strong> Per 21/09/2026 (Setiap 3 hari)</div>
                <hr style={{ border: "none", borderTop: `1px dashed ${t.codeBorder}`, margin: "8px 0" }} />
                <div>[Kode] | [Nama Produk] | [Dipesan] | [Tersedia] | [Pemenuhan]</div>
                <div>PRD-001 | Laptop ASUS | 50 | 48 | 96%</div>
                <div>PRD-002 | Monitor Dell | 30 | 30 | 100%</div>
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

      <style>{`
        .tpp-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}