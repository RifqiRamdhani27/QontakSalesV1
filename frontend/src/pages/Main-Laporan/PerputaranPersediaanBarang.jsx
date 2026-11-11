import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PerputaranPersediaanBarang() {
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
      chipBg: "#262626", chipText: "#f1f5f9",
      pdfIcon: "#cbd5e1", illuBright: "brightness(0.85) saturate(0.9)",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#1e293b", muted: "#64748b", label: "#334155", drawerLabel: "#334155",
      strong: "#475569", radioText: "#334155",
      panel: "#ffffff", panelBorder: "#e2e8f0", divider: "#f1f5f9",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#334155",
      icon: "#94a3b8", iconMuted: "#64748b",
      accent: "#4361ee", accentText: "#ffffff", primary: "#4361ee", primaryHover: "#3451d1",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#cbd5e1", btnText: "#4361ee",
      ddBg: "#ffffff", ddBorder: "#e2e8f0", ddText: "#334155", ddHover: "#f1f5f9",
      ddSel: "#f1f5f9", ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      drawerBg: "#ffffff", drawerBorder: "#f1f5f9", overlay: "rgba(15, 23, 42, 0.4)", ghostText: "#475569",
      tableHeadBg: "#f8fafc", tableHeadText: "#475569", tableBorder: "#f1f5f9",
      rowEven: "#ffffff", rowOdd: "#ffffff", rowText: "#1e293b", rowStrong: "#1e293b", rate: "#3e52d5",
      modalBg: "#ffffff", modalFooter: "#f8fafc", codeBg: "#f8fafc", codeBorder: "#cbd5e1",
      chipBg: "#f1f5f9", chipText: "#475569",
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
      popBg: "#ffffff", popBorder: "#e2e8f0",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
      nav: "#64748b", accent: "#0284c7", weekday: "#64748b",
      selBg: "#4361ee", selText: "#ffffff", todayBg: "#e0ebff", todayText: "#4361ee",
      dayText: "#1e293b", monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#e2e8f0",
    };

  // Tanggal awal State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 0, 1));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 0, 1));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("01/01/2026");

  // Tanggal akhir State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 11, 31));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 11, 31));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("31/12/2026");

  // Periode Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("1 tahun");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Action Dropdowns
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Show Report state
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 0, 1));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 0, 1));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("01/01/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 11, 31));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 11, 31));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("31/12/2026");

  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("1 tahun");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerBandingkanRef = useRef(null);
  const [drawerBandingkan, setDrawerBandingkan] = useState("Tanpa perbandigan");
  const [showDrawerBandingkanDropdown, setShowDrawerBandingkanDropdown] = useState(false);

  const [drawerPencarianType, setDrawerPencarianType] = useState("nama");

  const drawerProdukRef = useRef(null);
  const [drawerProduk, setDrawerProduk] = useState("Semua produk");
  const [showDrawerProdukDropdown, setShowDrawerProdukDropdown] = useState(false);

  const drawerGudangRef = useRef(null);
  const [drawerGudang, setDrawerGudang] = useState("Semua gudang");
  const [showDrawerGudangDropdown, setShowDrawerGudangDropdown] = useState(false);

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
      if (drawerBandingkanRef.current && !drawerBandingkanRef.current.contains(event.target)) setShowDrawerBandingkanDropdown(false);
      if (drawerProdukRef.current && !drawerProdukRef.current.contains(event.target)) setShowDrawerProdukDropdown(false);
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

  const renderDdItem = (label, selected, onClick, fontSize = "13px") => (
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

  const mainLabelStyle = { fontSize: "13px", fontWeight: 500, color: t.label };
  const mainFieldStyle = {
    width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "36px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    cursor: "pointer", boxSizing: "border-box",
  };
  const mainSelectStyle = {
    width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box",
  };
  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.drawerLabel };
  const drawerFieldStyle = {
    width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "36px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "8px",
    cursor: "pointer", boxSizing: "border-box",
  };
  const drawerSelectStyle = {
    width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box",
  };
  const drawerChipSelectStyle = {
    width: "100%", minHeight: "40px", paddingLeft: "8px", paddingRight: "32px", fontSize: "13px",
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box",
  };
  const chipStyle = { backgroundColor: t.chipBg, color: t.chipText, padding: "4px 10px", borderRadius: "6px", fontSize: "12.5px", fontWeight: 500 };

  const renderRadio = (name, checked, onChange, label) => (
    <label key={label} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: t.radioText, fontWeight: 500 }}>
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }} />
      {label}
    </label>
  );

  // Calendar Helper Components (// Calendar)
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
      if (calendarViewMode === "days") {
        setCalendarViewDate(new Date(year, month - 1, 1));
      } else if (calendarViewMode === "months") {
        setCalendarViewDate(new Date(year - 1, month, 1));
      } else if (calendarViewMode === "years") {
        setYearRangeStart(yearRangeStart - 12);
      }
    };

    const handleNext = () => {
      if (calendarViewMode === "days") {
        setCalendarViewDate(new Date(year, month + 1, 1));
      } else if (calendarViewMode === "months") {
        setCalendarViewDate(new Date(year + 1, month, 1));
      } else if (calendarViewMode === "years") {
        setYearRangeStart(yearRangeStart + 12);
      }
    };

    const handleToday = () => {
      const today = new Date();
      setSelectedDate(today);
      setCalendarViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setCalendarViewMode("days");
      closeCalendar();
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
          zIndex: 100,
          width: "280px",
          backgroundColor: c.popBg,
          borderRadius: "8px",
          boxShadow: c.shadow,
          border: `1px solid ${c.popBorder}`,
          padding: "12px",
          userSelect: "none"
        }}
      >
        {/* Calendar Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button
            type="button"
            onClick={handlePrev}
            style={navBtn}
            {...hoverBg("transparent", c.hoverBg)}
          >
            ‹
          </button>
          <div style={{ display: "flex", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
            <span
              onClick={() => setCalendarViewMode("months")}
              style={{ cursor: "pointer", padding: "2px 6px", borderRadius: "4px", color: c.accent }}
            >
              {MONTH_NAMES[month]}
            </span>
            <span
              onClick={() => setCalendarViewMode("years")}
              style={{ cursor: "pointer", padding: "2px 6px", borderRadius: "4px", color: c.accent }}
            >
              {year}
            </span>
          </div>
          <button
            type="button"
            onClick={handleNext}
            style={navBtn}
            {...hoverBg("transparent", c.hoverBg)}
          >
            ›
          </button>
        </div>

        {/* Calendar Body */}
        {calendarViewMode === "days" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "11px", fontWeight: 600, color: c.weekday, marginBottom: "6px" }}>
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((d, index) => {
                if (!d) return <div key={`empty-${index}`} />;
                const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={d.getDate()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      closeCalendar();
                    }}
                    style={{
                      height: "32px",
                      width: "32px",
                      margin: "0 auto",
                      borderRadius: "50%",
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
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {calendarViewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {MONTH_NAMES.map((mName, mIdx) => (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(year, mIdx, 1));
                  setCalendarViewMode("days");
                }}
                style={{
                  padding: "8px 4px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: month === mIdx ? c.selBg : c.monthBg,
                  color: month === mIdx ? c.selText : c.dayText,
                  cursor: "pointer",
                  fontWeight: month === mIdx ? 600 : 400
                }}
              >
                {mName.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {calendarViewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(yNum, month, 1));
                  setCalendarViewMode("months");
                }}
                style={{
                  padding: "8px 4px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: year === yNum ? c.selBg : c.monthBg,
                  color: year === yNum ? c.selText : c.dayText,
                  cursor: "pointer",
                  fontWeight: year === yNum ? 600 : 400
                }}
              >
                {yNum}
              </button>
            ))}
          </div>
        )}

        {/* Footer "Hari ini" */}
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${c.divider}`, display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={handleToday}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              color: c.accent,
              padding: "4px 8px",
              borderRadius: "4px"
            }}
          >
            Hari ini
          </button>
        </div>
      </div>
    );
  };

  // Mock Report Data
  const mockTurnoverData = [
    { code: "PRD-001", name: "Laptop Asus ROG", initialStock: 120, totalIn: 80, totalOut: 150, finalStock: 50, hpp: 1500000000, avgInv: 850000000, ratio: 1.76 },
    { code: "PRD-002", name: "Monitor Dell 27 Inch", initialStock: 90, totalIn: 110, totalOut: 140, finalStock: 60, hpp: 420000000, avgInv: 225000000, ratio: 1.87 },
    { code: "PRD-003", name: "Keyboard Mechanical Wireless", initialStock: 300, totalIn: 250, totalOut: 400, finalStock: 150, hpp: 240000000, avgInv: 135000000, ratio: 1.78 },
    { code: "PRD-004", name: "Mouse Ergonomis Bluetooth", initialStock: 200, totalIn: 300, totalOut: 420, finalStock: 80, hpp: 126000000, avgInv: 70000000, ratio: 1.80 },
  ];

  const periodeOptions = ["1 tahun", "Bulan ini", "Tahun ini", "Kustom"];

  return (
    <div
      className={isDark ? "ppb-dark" : ""}
      style={{
        margin: "-24px", backgroundColor: t.pageBg, minHeight: "100vh", padding: "24px 24px 48px 24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text, colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Top Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.02em" }}>
          Perputaran persediaan barang
        </h1>

        {/* Artikel panduan button */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            backgroundColor: t.btnBg,
            border: `1px solid ${t.btnBorder}`,
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 500,
            color: t.btnText,
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        >
          <svg style={{ width: "16px", height: "16px", color: t.btnText }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8" />
          </svg>
          <span>Artikel panduan</span>
        </a>
      </header>

      {/* Main Content Card Container */}
      <main style={{ backgroundColor: t.panel, borderRadius: "6px", border: `1px solid ${t.panelBorder}`, minHeight: "780px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

        {/* Top Filters Bar */}
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>

            {/* Left Filter Inputs */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>

              {/* Tanggal awal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={mainLabelStyle}>Tanggal awal</label>
                <div style={{ position: "relative", width: "190px" }} ref={startDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={startDateStr}
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    style={mainFieldStyle}
                  />
                  <svg
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: t.icon, cursor: "pointer" }}
                    fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
                  >
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={mainLabelStyle}>Tanggal akhir</label>
                <div style={{ position: "relative", width: "190px" }} ref={endDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={endDateStr}
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    style={mainFieldStyle}
                  />
                  <svg
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: t.icon, cursor: "pointer" }}
                    fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
                  >
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
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
                      () => setShowEndCalendar(false)
                    )}
                </div>
              </div>

              {/* Periode Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={mainPeriodRef}>
                <label style={mainLabelStyle}>Periode</label>
                <div style={{ position: "relative", width: "190px" }}>
                  <div
                    onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                    style={mainSelectStyle}
                  >
                    <span>{periodePreset}</span>
                    <svg style={{ width: "16px", height: "16px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showMainPeriodDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "6px" }}>
                      {periodeOptions.map((preset) =>
                        renderDdItem(preset, periodePreset === preset, () => { setPeriodePreset(preset); setShowMainPeriodDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tampilkan Button */}
              <button
                type="button"
                onClick={() => setShowReport(true)}
                style={{
                  height: "38px",
                  padding: "0 20px",
                  backgroundColor: t.primary,
                  color: t.accentText,
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  transition: "background-color 0.15s ease"
                }}
                {...hoverBg(t.primary, t.primaryHover)}
              >
                Tampilkan
              </button>

              {/* Filter Button */}
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  height: "38px",
                  padding: "0 16px",
                  backgroundColor: t.btnBg,
                  color: t.btnText,
                  fontSize: "13px",
                  fontWeight: 500,
                  border: `1px solid ${t.btnBorder}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "background-color 0.15s ease"
                }}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                <svg style={{ width: "16px", height: "16px", color: t.btnText }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
              </button>
            </div>

            {/* Right Action Controls */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>

              {/* Ekspor Dropdown Button */}
              <div style={{ position: "relative" }} ref={eksporDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                  style={{
                    height: "38px",
                    padding: "0 14px",
                    backgroundColor: t.btnBg,
                    color: t.btnText,
                    fontSize: "13px",
                    fontWeight: 500,
                    border: `1px solid ${t.btnBorder}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "background-color 0.15s ease"
                  }}
                  {...hoverBg(t.btnBg, t.btnHover)}
                >
                  <span>Ekspor</span>
                  <svg style={{ width: "14px", height: "14px", color: t.btnText }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showEksporDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "160px", borderRadius: "6px" }}>
                    {["PDF", "Excel (XLSX)", "CSV"].map((fmt) =>
                      renderDdItem(`Ekspor ke ${fmt}`, false, () => setShowEksporDropdown(false))
                    )}
                  </div>
                )}
              </div>

              {/* Lihat Contoh Link with PDF icon matching Neraca.jsx */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTemplateModal(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: isDark ? t.btnText : "#2563eb",
                  textDecoration: "none"
                }}
              >
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "16px",
                    height: "16px",
                  }}
                >
                  <svg
                    style={{ width: "16px", height: "16px", color: t.pdfIcon }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <span
                    style={{
                      position: "absolute",
                      left: "-4px",
                      bottom: "2px",
                      backgroundColor: "#ef4444",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#ffffff",
                      padding: "0 2px",
                      borderRadius: "2px",
                      lineHeight: 1,
                      transform: "scale(0.75)",
                      transformOrigin: "bottom left",
                      pointerEvents: "none",
                    }}
                  >
                    PDF
                  </span>
                </span>
                <span>Lihat contoh</span>
              </a>
            </div>

          </div>
        </div>

        {/* Content View: Empty State or Report Table */}
        {!showReport ? (
          <section aria-label="Status Laporan" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "16px", paddingBottom: "80px", paddingLeft: "16px", paddingRight: "16px" }}>
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
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, textAlign: "center", margin: "0 0 6px 0" }}>
              Laporan akan muncul di sini
            </h2>
            <p style={{ fontSize: "13px", color: t.muted, textAlign: "center", margin: 0 }}>
              Pilih tanggal atau periode, lalu klik tombol <span style={{ color: t.strong, fontWeight: 500 }}>Tampilkan</span>.
            </p>
          </section>
        ) : (
          <section style={{ flex: 1, padding: "0 20px 24px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: t.title, margin: 0 }}>
                Laporan Perputaran Persediaan Barang ({startDateStr} - {endDateStr})
              </h3>
            </div>
            <div style={{ overflowX: "auto", border: `1px solid ${t.panelBorder}`, borderRadius: "6px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: t.tableHeadBg, borderBottom: `1px solid ${t.panelBorder}`, color: t.tableHeadText, fontWeight: 600 }}>
                    <th style={{ padding: "12px 16px" }}>Kode Produk</th>
                    <th style={{ padding: "12px 16px" }}>Nama Produk</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Stok Awal</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Masuk</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Keluar</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Stok Akhir</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>HPP (IDR)</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Rata-rata Persediaan (IDR)</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Rasio Perputaran (Kali)</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTurnoverData.map((row, idx) => (
                    <tr
                      key={row.code}
                      style={{
                        borderBottom: idx === mockTurnoverData.length - 1 ? "none" : `1px solid ${t.tableBorder}`,
                        color: t.rowText,
                        backgroundColor: idx % 2 === 0 ? t.rowEven : t.rowOdd,
                      }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: t.rowStrong }}>{row.code}</td>
                      <td style={{ padding: "12px 16px" }}>{row.name}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{row.initialStock}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{row.totalIn}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{row.totalOut}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: t.rowStrong }}>{row.finalStock}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>Rp {row.hpp.toLocaleString("id-ID")}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>Rp {row.avgInv.toLocaleString("id-ID")}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: t.rate }}>{row.ratio}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div style={{ height: "24px" }} />
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
              colorScheme: isDark ? "dark" : "light",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out",
              zIndex: 101,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
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
                      style={drawerFieldStyle}
                    />
                    <svg
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: t.icon, cursor: "pointer" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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

                  <span style={{ color: t.iconMuted, fontWeight: 500 }}>-</span>

                  <div style={{ position: "relative", flex: 1 }} ref={drawerEndDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDate}
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={drawerFieldStyle}
                    />
                    <svg
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: t.icon, cursor: "pointer" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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
                        () => setShowDrawerEndCalendar(false), true
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
                    style={drawerSelectStyle}
                  >
                    <span>{drawerPeriod}</span>
                    <svg style={{ width: "16px", height: "16px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerPeriodDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {periodeOptions.map((preset) =>
                        renderDdItem(preset, drawerPeriod === preset, () => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bandingkan dengan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerBandingkanRef}>
                <label style={drawerLabelStyle}>Bandingkan dengan</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerBandingkanDropdown(!showDrawerBandingkanDropdown)}
                    style={drawerSelectStyle}
                  >
                    <span>{drawerBandingkan}</span>
                    <svg style={{ width: "16px", height: "16px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerBandingkanDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {["Tanpa perbandigan", "Periode sebelumnya", "Tahun sebelumnya"].map((opt) =>
                        renderDdItem(opt, drawerBandingkan === opt, () => { setDrawerBandingkan(opt); setShowDrawerBandingkanDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pencarian product */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={drawerLabelStyle}>Pencarian product</label>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  {renderRadio("pencarianType", drawerPencarianType === "nama", () => setDrawerPencarianType("nama"), "Berdasarkan nama")}
                  {renderRadio("pencarianType", drawerPencarianType === "kategori", () => setDrawerPencarianType("kategori"), "Berdasarkan kategori")}
                </div>

                <div style={{ position: "relative" }} ref={drawerProdukRef}>
                  <div
                    onClick={() => setShowDrawerProdukDropdown(!showDrawerProdukDropdown)}
                    style={drawerChipSelectStyle}
                  >
                    <span style={chipStyle}>
                      {drawerProduk}
                    </span>
                    <svg style={{ width: "16px", height: "16px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerProdukDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {["Semua produk", "Laptop Asus ROG", "Monitor Dell 27 Inch"].map((opt) =>
                        renderDdItem(opt, drawerProduk === opt, () => { setDrawerProduk(opt); setShowDrawerProdukDropdown(false); })
                      )}
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
                    style={drawerChipSelectStyle}
                  >
                    <span style={chipStyle}>
                      {drawerGudang}
                    </span>
                    <svg style={{ width: "16px", height: "16px", color: t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerGudangDropdown && (
                    <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", borderRadius: "8px" }}>
                      {["Semua gudang", "Gudang Utama", "Gudang Cabang"].map((opt) =>
                        renderDdItem(opt, drawerGudang === opt, () => { setDrawerGudang(opt); setShowDrawerGudangDropdown(false); })
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: t.drawerBg }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerPeriod("1 tahun");
                  setDrawerBandingkan("Tanpa perbandigan");
                  setDrawerPencarianType("nama");
                  setDrawerProduk("Semua produk");
                  setDrawerGudang("Semua gudang");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: t.btnText,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: 0
                }}
              >
                <svg style={{ width: "16px", height: "16px", strokeWidth: 2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    cursor: "pointer"
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
                    color: t.accentText,
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    transition: "background-color 0.15s ease"
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Contoh Laporan Perputaran Persediaan Barang</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: t.iconMuted, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px", fontSize: "13px", color: t.rowText, lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 12px 0" }}>Berikut adalah pratinjau format standar laporan Perputaran Persediaan Barang yang siap diekspor ke PDF / Excel:</p>
              <div style={{ backgroundColor: t.codeBg, border: `1px solid ${t.codeBorder}`, borderRadius: "6px", padding: "12px", fontSize: "12px", fontFamily: "monospace", color: t.text }}>
                <div><strong>Judul:</strong> Laporan Perputaran Persediaan Barang</div>
                <div><strong>Periode:</strong> 01/01/2026 - 31/12/2026</div>
                <hr style={{ border: "none", borderTop: `1px dashed ${t.codeBorder}`, margin: "8px 0" }} />
                <div>[Kode] | [Nama Produk] | [Awal] | [Masuk] | [Keluar] | [Akhir] | [Rasio]</div>
                <div>PRD-001 | Laptop Asus ROG | 120 | 80 | 150 | 50 | 1.76x</div>
                <div>PRD-002 | Monitor Dell 27 Inch | 90 | 110 | 140 | 60 | 1.87x</div>
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
        .ppb-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}