import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import purchaseFolder from "../../assets/dompetbiru.png";

export default function ProfitabilitasProduk() {
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
      pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", label: "#e2e8f0", radioText: "#cbd5e1",
      panel: "#1a1a1a", panelBorder: "#634f27",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9",
      icon: "#E5B85C", accent: "#E5B85C", accentText: "#121212",
      primary: "#E5B85C", primaryHover: "#f0c978",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddSel: "rgba(229,184,92,0.2)", ddSelText: "#E5B85C", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", drawerHead: "#242424", drawerBorder: "#3a3326",
      overlay: "rgba(0, 0, 0, 0.7)", ghostText: "#cbd5e1",
    }
    : {
      pageBg: "#ffffff", text: "#0f172a", title: "#0f172a", muted: "#64748b", label: "#344054", radioText: "#64748b",
      panel: "#ffffff", panelBorder: "#e2e8f0",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#1e293b",
      icon: "#64748b", accent: "#3557e8", accentText: "#ffffff",
      primary: "#3557e8", primaryHover: "#2b4bbf",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#cbd5e1",
      ddBg: "#ffffff", ddBorder: "#cbd5e1", ddText: "#1e293b", ddHover: "#f8fafc",
      ddSel: "#f1f5f9", ddSelText: "#4f66ee", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
      drawerBg: "#ffffff", drawerHead: "#f8fafc", drawerBorder: "#eaecf0",
      overlay: "rgba(15, 23, 42, 0.3)", ghostText: "#475569",
    };

  // Palet kalender
  const c = isDark
    ? {
      popBg: "#1a1a1a", popBorder: "#634f27",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      nav: "#f1f5f9", accent: "#E5B85C", weekday: "#94a3b8",
      selBg: "#E5B85C", selText: "#121212",
      dayText: "#f1f5f9", dayMuted: "#4b5563",
      monthBg: "#262626", hoverBg: "#2d2d2d", divider: "#3a3326",
    }
    : {
      popBg: "#ffffff", popBorder: "#cbd5e1",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      nav: "#334155", accent: "#0284c7", weekday: "#64748b",
      selBg: "#0284c7", selText: "#ffffff",
      dayText: "#1e293b", dayMuted: "#cbd5e1",
      monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
    };

  // Tanggal Awal State & Popover
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDate, setStartDate] = useState("18/09/2026");

  // Tanggal Akhir State & Popover
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

  // Drawer Filter States (Right Sidebar "Filter laporan")
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

  const [drawerPeriod, setDrawerPeriod] = useState("");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);
  const drawerPeriodRef = useRef(null);

  const [drawerProduk, setDrawerProduk] = useState("");

  const [drawerUrutkanKolom, setDrawerUrutkanKolom] = useState("");
  const [showDrawerUrutkanKolomDropdown, setShowDrawerUrutkanKolomDropdown] = useState(false);
  const drawerUrutkanKolomRef = useRef(null);
  const [drawerUrutanOrder, setDrawerUrutanOrder] = useState("");

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
    setTimeout(() => setShowFilterDrawer(false), 280);
  };

  const handleResetDrawer = () => {
    setDrawerStartSelectedDate(new Date(2026, 8, 18));
    setDrawerStartDate("18/09/2026");
    setDrawerEndSelectedDate(new Date(2026, 8, 18));
    setDrawerEndDate("18/09/2026");
    setDrawerPeriod("");
    setDrawerProduk("");
    setDrawerUrutkanKolom("");
    setDrawerUrutanOrder("");
  };

  const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, month: month - 1, year: month === 0 ? year - 1 : year, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year: month === 11 ? year + 1 : year, isCurrentMonth: false });
    }
    return days;
  };

  // Calendar (gaya baru, mendukung hari / bulan / tahun)
  const renderCalendarPopover = (
    viewDate, setViewDate, viewMode, setViewMode, yearRangeStart, setYearRangeStart, selectedDate, onSelectDate, alignRight = false
  ) => (
    <div
      style={{
        position: "absolute", top: "calc(100% + 6px)",
        ...(alignRight ? { right: 0 } : { left: 0 }),
        zIndex: 1000, backgroundColor: c.popBg, border: `1px solid ${c.popBorder}`,
        borderRadius: "8px", boxShadow: c.shadow,
        padding: "14px 16px", width: "280px", userSelect: "none",
      }}
    >
      {/* Header navigasi */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: c.nav, padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
            else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
            else setYearRangeStart((p) => p - 12);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          «
        </button>

        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: c.accent, cursor: "pointer", padding: "4px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "5px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewMode("months");
            else if (viewMode === "months") {
              setYearRangeStart(Math.floor(viewDate.getFullYear() / 12) * 12);
              setViewMode("years");
            } else setViewMode("days");
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          title="Klik untuk memilih bulan / tahun"
        >
          <span>
            {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
            {viewMode === "months" && `${viewDate.getFullYear()}`}
            {viewMode === "years" && `${yearRangeStart} - ${yearRangeStart + 11}`}
          </span>
          <span style={{ fontSize: "10px" }}>▼</span>
        </button>

        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: c.nav, padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
            else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
            else setYearRangeStart((p) => p + 12);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          »
        </button>
      </div>

      {/* View: Hari */}
      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: c.weekday, marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
              const isSelected =
                !!selectedDate &&
                d.day === selectedDate.getDate() &&
                d.month === selectedDate.getMonth() &&
                d.year === selectedDate.getFullYear();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newDate = new Date(d.year, d.month, d.day);
                    setViewDate(newDate);
                    setViewMode("days");
                    onSelectDate(newDate);
                  }}
                  style={{
                    padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer",
                    backgroundColor: isSelected ? c.selBg : "transparent",
                    color: isSelected ? c.selText : d.isCurrentMonth ? c.dayText : c.dayMuted,
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = c.hoverBg; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* View: Bulan */}
      {viewMode === "months" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {MONTH_NAMES.map((mName, idx) => {
            const sel = viewDate.getMonth() === idx;
            return (
              <button
                key={mName}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                  setViewMode("days");
                }}
                style={{
                  padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                  backgroundColor: sel ? c.selBg : c.monthBg,
                  color: sel ? c.selText : c.dayText,
                  fontWeight: sel ? "bold" : "normal",
                }}
                onMouseEnter={(e) => { if (!sel) e.currentTarget.style.backgroundColor = c.hoverBg; }}
                onMouseLeave={(e) => { if (!sel) e.currentTarget.style.backgroundColor = c.monthBg; }}
              >
                {mName.substring(0, 3)}
              </button>
            );
          })}
        </div>
      )}

      {/* View: Tahun */}
      {viewMode === "years" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => {
            const sel = viewDate.getFullYear() === yr;
            return (
              <button
                key={yr}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDate(new Date(yr, viewDate.getMonth(), 1));
                  setViewMode("months");
                }}
                style={{
                  padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                  backgroundColor: sel ? c.selBg : c.monthBg,
                  color: sel ? c.selText : c.dayText,
                  fontWeight: sel ? "bold" : "normal",
                }}
                onMouseEnter={(e) => { if (!sel) e.currentTarget.style.backgroundColor = c.hoverBg; }}
                onMouseLeave={(e) => { if (!sel) e.currentTarget.style.backgroundColor = c.monthBg; }}
              >
                {yr}
              </button>
            );
          })}
        </div>
      )}

      {/* Tombol hari ini */}
      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${c.divider}`, textAlign: "center" }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const today = new Date();
            setViewDate(today);
            setViewMode("days");
            onSelectDate(today);
          }}
          style={{ background: "none", border: "none", fontSize: "13px", fontWeight: 600, color: c.accent, cursor: "pointer", padding: "4px 8px", borderRadius: "4px" }}
        >
          Hari ini
        </button>
      </div>
    </div>
  );

  const PERIODE_OPTIONS = [
    "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini",
    "Kemarin", "Pekan Lalu", "Bulan Lalu", "Tahun Lalu", "Custom",
  ];

  // ---------- Helper tampilan ----------
  const renderCalIcon = (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const renderChevron = (open) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
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
        padding: "8px 14px", fontSize,
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

  const drawerLabelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: t.label, marginBottom: "6px" };
  const drawerFieldStyle = {
    height: "38px",
    backgroundColor: t.field,
    border: `1px solid ${t.fieldBorder}`,
    borderRadius: "6px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    userSelect: "none",
  };

  const mainLabelStyle = { fontSize: "12.5px", fontWeight: 400, color: t.title };
  const mainFieldStyle = {
    width: "100%",
    height: "36px",
    padding: "0 32px 0 12px",
    fontSize: "13px",
    color: t.fieldText,
    backgroundColor: t.field,
    border: `1px solid ${t.fieldBorder}`,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    boxSizing: "border-box",
  };

  // Select di drawer (label + field + dropdown, opsional children di bawahnya)
  const renderDrawerSelect = ({ label, value, placeholder, open, setOpen, options, onPick, refEl, children }) => (
    <div ref={refEl}>
      <div style={{ position: "relative" }}>
        <label style={drawerLabelStyle}>{label}</label>
        <div onClick={() => setOpen(!open)} style={drawerFieldStyle}>
          <span style={{ fontSize: "13.5px", color: value ? t.fieldText : t.muted }}>
            {value || placeholder}
          </span>
          {renderChevron(open)}
        </div>
        {open && (
          <div style={{
            ...ddPanelStyle,
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
            maxHeight: "200px", overflowY: "auto",
          }}>
            {options.map((opt) => renderOption(opt, value === opt, () => onPick(opt)))}
          </div>
        )}
      </div>
      {children && <div style={{ marginTop: "12px" }}>{children}</div>}
    </div>
  );

  return (
    <div
      className={isDark ? "pf-dark" : ""}
      style={{
        margin: isFullscreen ? 0 : "-24px",
        minHeight: "100vh",
        backgroundColor: t.pageBg,
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Header Section */}
      <header style={{
        padding: "20px 24px 16px 24px",
        borderBottom: `1px solid ${t.panelBorder}`,
        backgroundColor: t.panel,
      }}>
        <div style={{ maxWidth: "1780px", margin: "0 auto" }}>
          {/* Breadcrumb Link */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/laporan");
            }}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: isDark ? t.accent : "#4466f2",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "4px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Laporan
          </a>
          {/* Page Title */}
          <h1 style={{
            fontSize: "23px",
            fontWeight: 700,
            color: t.title,
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}>
            Profitabilitas Produk
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "0 24px 32px 24px",
        maxWidth: "1780px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {/* Action Bar (Filters & Export) */}
        <section
          aria-label="Filter dan Ekspor"
          style={{
            padding: "16px 0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Left Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
            {/* Tanggal Awal */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal awal</label>
              <div style={{ position: "relative", width: "185px" }}>
                <div
                  onClick={() => {
                    setShowStartCalendar(!showStartCalendar);
                    setShowEndCalendar(false);
                  }}
                  style={mainFieldStyle}
                >
                  {startDate}
                </div>
                <div style={{
                  position: "absolute", top: 0, right: 0, bottom: 0,
                  display: "flex", alignItems: "center", paddingRight: "10px",
                  pointerEvents: "none",
                }}>
                  {renderCalIcon()}
                </div>
                {showStartCalendar && renderCalendarPopover(
                  startCalendarViewDate, setStartCalendarViewDate,
                  startCalendarViewMode, setStartCalendarViewMode,
                  startYearRangeStart, setStartYearRangeStart,
                  startSelectedDate,
                  (date) => { setStartSelectedDate(date); setShowStartCalendar(false); }
                )}
              </div>
            </div>

            {/* Tanggal Akhir */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal akhir</label>
              <div style={{ position: "relative", width: "185px" }}>
                <div
                  onClick={() => {
                    setShowEndCalendar(!showEndCalendar);
                    setShowStartCalendar(false);
                  }}
                  style={mainFieldStyle}
                >
                  {endDate}
                </div>
                <div style={{
                  position: "absolute", top: 0, right: 0, bottom: 0,
                  display: "flex", alignItems: "center", paddingRight: "10px",
                  pointerEvents: "none",
                }}>
                  {renderCalIcon()}
                </div>
                {showEndCalendar && renderCalendarPopover(
                  endCalendarViewDate, setEndCalendarViewDate,
                  endCalendarViewMode, setEndCalendarViewMode,
                  endYearRangeStart, setEndYearRangeStart,
                  endSelectedDate,
                  (date) => { setEndSelectedDate(date); setShowEndCalendar(false); },
                  true
                )}
              </div>
            </div>

            {/* Tampilkan Button */}
            <button
              type="button"
              style={{
                height: "36px",
                padding: "0 16px",
                backgroundColor: t.primary,
                color: t.accentText,
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.primary)}
            >
              Tampilkan
            </button>

            {/* Filter Outline Button */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px",
                padding: "0 14px",
                backgroundColor: t.btnBg,
                border: `1px solid ${t.btnBorder}`,
                borderRadius: "6px",
                color: t.accent,
                fontSize: "13px",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.btnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.btnBg)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter</span>
            </button>
          </div>

          {/* Right Action: Ekspor Dropdown Button */}
          <div style={{ position: "relative" }} ref={eksporDropdownRef}>
            <button
              type="button"
              onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{
                height: "36px",
                padding: "0 14px",
                backgroundColor: t.btnBg,
                border: `1px solid ${t.btnBorder}`,
                borderRadius: "6px",
                color: isDark ? t.accent : "#2b4bbf",
                fontSize: "13px",
                fontWeight: 400,
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.btnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.btnBg)}
            >
              <span>Ekspor</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill={isDark ? t.accent : "#2b4bbf"}>
                <path d="M0 0.5L5 5.5L10 0.5H0Z" />
              </svg>
            </button>
            {showEksporDropdown && (
              <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 100, width: "160px" }}>
                {renderOption("PDF", false, () => setShowEksporDropdown(false), "13px")}
                {renderOption("Excel", false, () => setShowEksporDropdown(false), "13px")}
                {renderOption("CSV", false, () => setShowEksporDropdown(false), "13px")}
              </div>
            )}
          </div>
        </section>

        {/* Empty State Container */}
        <section
          aria-label="Status Kosong"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 16px",
            marginTop: "-20px",
          }}
        >
          {/* 3D Illustration */}
          <div style={{
            width: "200px",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            position: "relative",
          }}>
            <img
              src={purchaseFolder}
              alt="Tidak ada data yang ditampilkan"
              style={{
                maxWidth: "280px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                opacity: isDark ? 0.85 : 1,
                filter: isDark ? "brightness(0.8)" : "none",
              }}
            />
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: "20px",
            marginTop: "20px",
            fontWeight: 700,
            color: t.title,
            marginBottom: "8px",
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}>
            Tidak ada data yang ditampilkan
          </h2>

          {/* Description */}
          <p style={{
            fontSize: "15px",
            color: t.muted,
            textAlign: "center",
            maxWidth: "550px",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Anda perlu membuat penjualan atau mengatur ulang tanggal untuk melihat profit tiap produk
          </p>
        </section>
      </main>

      {/* Filter Sidebar Drawer */}
      {showFilterDrawer && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9998, backgroundColor: t.overlay,
          }}
          onClick={closeFilterDrawer}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              width: "380px", maxWidth: "90vw",
              backgroundColor: t.drawerBg,
              borderLeft: isDark ? `1px solid ${t.panelBorder}` : "none",
              boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
              display: "flex", flexDirection: "column",
              zIndex: 9999,
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              fontFamily: "Inter, system-ui, -apple-system, sans-serif",
              colorScheme: isDark ? "dark" : "light",
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: "16px 24px",
              backgroundColor: t.drawerHead,
              borderBottom: `1px solid ${t.drawerBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>
                Filter laporan
              </h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ background: "none", border: "none", color: t.icon, cursor: "pointer", padding: "4px", display: "flex" }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal awal */}
              <div style={{ position: "relative" }} ref={drawerStartDatePickerRef}>
                <label style={drawerLabelStyle}>Tanggal awal</label>
                <div onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={drawerFieldStyle}>
                  <span style={{ fontSize: "13.5px", color: t.fieldText }}>{drawerStartDate}</span>
                  {renderCalIcon()}
                </div>
                {showDrawerStartCalendar && renderCalendarPopover(
                  drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                  drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                  drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                  drawerStartSelectedDate,
                  (date) => { setDrawerStartSelectedDate(date); setShowDrawerStartCalendar(false); }
                )}
              </div>

              {/* Tanggal akhir */}
              <div style={{ position: "relative" }} ref={drawerEndDatePickerRef}>
                <label style={drawerLabelStyle}>Tanggal akhir</label>
                <div onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)} style={drawerFieldStyle}>
                  <span style={{ fontSize: "13.5px", color: t.fieldText }}>{drawerEndDate}</span>
                  {renderCalIcon()}
                </div>
                {showDrawerEndCalendar && renderCalendarPopover(
                  drawerEndCalendarViewDate, setDrawerEndCalendarViewDate,
                  drawerEndCalendarViewMode, setDrawerEndCalendarViewMode,
                  drawerEndYearRangeStart, setDrawerEndYearRangeStart,
                  drawerEndSelectedDate,
                  (date) => { setDrawerEndSelectedDate(date); setShowDrawerEndCalendar(false); },
                  true
                )}
              </div>

              {/* Period */}
              {renderDrawerSelect({
                label: "Period",
                value: drawerPeriod,
                placeholder: "Select period",
                open: showDrawerPeriodDropdown,
                setOpen: setShowDrawerPeriodDropdown,
                options: PERIODE_OPTIONS,
                onPick: (opt) => { setDrawerPeriod(opt); setShowDrawerPeriodDropdown(false); },
                refEl: drawerPeriodRef,
              })}

              {/* Produk */}
              <div>
                <label style={drawerLabelStyle}>Produk</label>
                <input
                  type="text"
                  placeholder="Pilih produk"
                  value={drawerProduk}
                  onChange={(e) => setDrawerProduk(e.target.value)}
                  style={{
                    width: "100%", height: "38px", backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
                    padding: "0 12px", fontSize: "13.5px", color: t.fieldText, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Urutkan sesuai kolom */}
              {renderDrawerSelect({
                label: "Urutkan sesuai kolom",
                value: drawerUrutkanKolom,
                placeholder: "Pilih kolom",
                open: showDrawerUrutkanKolomDropdown,
                setOpen: setShowDrawerUrutkanKolomDropdown,
                options: ["Nama produk", "Kuantitas", "Penjualan bersih", "Total profit"],
                onPick: (opt) => { setDrawerUrutkanKolom(opt); setShowDrawerUrutkanKolomDropdown(false); },
                refEl: drawerUrutkanKolomRef,
                children: (
                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    {[["asc", "Urutan naik"], ["desc", "Urutan turun"]].map(([val, label]) => (
                      <label key={val} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.radioText, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="drawerUrutanOrder"
                          checked={drawerUrutanOrder === val}
                          onChange={() => setDrawerUrutanOrder(val)}
                          style={{ accentColor: t.accent }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                ),
              })}
            </div>

            {/* Drawer Footer */}
            <div style={{
              padding: "16px 24px",
              borderTop: `1px solid ${t.drawerBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div
                onClick={handleResetDrawer}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", userSelect: "none" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isDark ? t.accent : "#4f66ee"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6" />
                  <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: isDark ? t.accent : "#4f66ee", textDecoration: "underline" }}>
                  Reset filter
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{ background: "none", border: "none", fontSize: "13.5px", fontWeight: 600, color: t.ghostText, cursor: "pointer" }}
                  onMouseEnter={(e) => { if (isDark) e.currentTarget.style.color = "#E5B85C"; }}
                  onMouseLeave={(e) => { if (isDark) e.currentTarget.style.color = "#cbd5e1"; }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    height: "38px", padding: "0 22px",
                    backgroundColor: isDark ? t.primary : "#4f66ee", border: "none",
                    borderRadius: "6px", fontSize: "13.5px", fontWeight: 600, color: t.accentText, cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? t.primaryHover : "#3b52b4")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? t.primary : "#4f66ee")}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .pf-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}