import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function UsiaPiutang() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
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
        pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", label: "#cbd5e1",
        panel: "#1a1a1a", panelBorder: "#634f27", shadow: "0 1px 2px rgba(0,0,0,0.4)",
        field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9", underline: "#634f27",
        icon: "#E5B85C", accent: "#E5B85C", accentText: "#121212",
        primary: "#E5B85C", primaryHover: "#f0c978",
        btnBg: "transparent", btnHover: "rgba(229,184,92,0.12)", btnBorder: "#E5B85C",
        ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
        ddSel: "rgba(229,184,92,0.2)", ddSelText: "#E5B85C", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
        thead: "#d38e0d69", theadText: "#f1f5f9", footer: "#1a1a1a", footerBorder: "#634f27",
        overlay: "rgba(0, 0, 0, 0.7)", divider: "#3a3326",
        ghostText: "#cbd5e1", ghostBorder: "#634f27", ghostHover: "#2d2d2d",
        linkText: "#94a3b8", linkHover: "#E5B85C",
      }
    : {
        pageBg: "#f0f4f8", text: "#2c3e50", title: "#111827", muted: "#6b7280", label: "#4b5563",
        panel: "#ffffff", panelBorder: "#e5e7eb", shadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        field: "#ffffff", fieldBorder: "#d1d5db", fieldText: "#111827", underline: "#d1d5db",
        icon: "#6b7280", accent: "#1e637e", accentText: "#ffffff",
        primary: "#1e637e", primaryHover: "#185268",
        btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#1e637e",
        ddBg: "#ffffff", ddBorder: "#cbd5e1", ddText: "#334155", ddHover: "#f8fafc",
        ddSel: "#f0f9ff", ddSelText: "#1e637e", ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        thead: "#f8f9fb", theadText: "#9ca3af", footer: "#eaf6fc", footerBorder: "#e0f2fe",
        overlay: "rgba(15, 23, 42, 0.4)", divider: "#e5e7eb",
        ghostText: "#374151", ghostBorder: "#d1d5db", ghostHover: "#f9fafb",
        linkText: "#9ca3af", linkHover: "#1e637e",
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
        nav: "#334155", accent: "#1e637e", weekday: "#64748b",
        selBg: "#1e637e", selText: "#ffffff",
        dayText: "#1e293b", dayMuted: "#cbd5e1",
        monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
      };

  // State Tanggal "Per"
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [perDateText, setPerDateText] = useState("16/09/2026");

  // State Periode Dropdown
  const periodeDropdownRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor Dropdown
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const eksporDropdownRef = useRef(null);

  // Drawer Filter States (Right Sidebar "Filter Laporan")
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerDatePickerRef = useRef(null);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);
  const [drawerPerDateText, setDrawerPerDateText] = useState("16/09/2026");

  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);
  const drawerPeriodeRef = useRef(null);

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur penjualan");
  const [showDrawerTipeDropdown, setShowDrawerTipeDropdown] = useState(false);
  const drawerTipeRef = useRef(null);

  const [drawerTagOption, setDrawerTagOption] = useState("all");

  const [drawerUrutkan, setDrawerUrutkan] = useState("Pelanggan");
  const [showDrawerUrutkanDropdown, setShowDrawerUrutkanDropdown] = useState(false);
  const drawerUrutkanRef = useRef(null);
  const [drawerUrutanOrder, setDrawerUrutanOrder] = useState("asc");

  const MONTH_NAMES = [
    "Janu", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatDateDDMMYYYY = (date) => {
    if (!date) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => { setPerDateText(formatDateDDMMYYYY(selectedDate)); }, [selectedDate]);
  useEffect(() => { setDrawerPerDateText(formatDateDDMMYYYY(drawerSelectedDate)); }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (drawerDatePickerRef.current && !drawerDatePickerRef.current.contains(event.target)) setShowDrawerCalendar(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerTipeRef.current && !drawerTipeRef.current.contains(event.target)) setShowDrawerTipeDropdown(false);
      if (drawerUrutkanRef.current && !drawerUrutkanRef.current.contains(event.target)) setShowDrawerUrutkanDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    setTimeout(() => setDrawerOpen(true), 10);
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 300);
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
    viewDate, setViewDate, viewMode, setViewMode, yearRangeStartVal, setYearRangeStartVal, selectedDateVal, onSelectDate
  ) => (
    <div
      style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0,
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
            else setYearRangeStartVal((p) => p - 12);
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
              setYearRangeStartVal(Math.floor(viewDate.getFullYear() / 12) * 12);
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
            {viewMode === "years" && `${yearRangeStartVal} - ${yearRangeStartVal + 11}`}
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
            else setYearRangeStartVal((p) => p + 12);
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
                !!selectedDateVal &&
                d.day === selectedDateVal.getDate() &&
                d.month === selectedDateVal.getMonth() &&
                d.year === selectedDateVal.getFullYear();
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
          {Array.from({ length: 12 }, (_, i) => yearRangeStartVal + i).map((yr) => {
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

  // ---------- Helper tampilan ----------
  const renderCalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const renderChevron = (open) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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

  const renderOption = (opt, selected, onClick, padding = "8px 14px") => (
    <div
      key={opt}
      onClick={onClick}
      style={{
        padding, fontSize: "13px",
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

  const toolbarLabel = { fontSize: "11px", fontWeight: 500, color: t.label, marginBottom: "4px" };
  const drawerLabel = { display: "block", fontSize: "11px", fontWeight: 500, color: t.muted, marginBottom: "4px" };

  const renderDrawerSelect = ({ label, value, open, setOpen, options, onPick, refEl, marginBottom = "20px", bold = false }) => (
    <div style={{ position: "relative", marginBottom }} ref={refEl}>
      <label style={drawerLabel}>{label}</label>
      <div
        onClick={() => setOpen(!open)}
        style={{
          height: "38px",
          backgroundColor: "transparent",
          borderBottom: `1px solid ${t.underline}`,
          padding: "0 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span style={{ fontSize: "13px", color: t.fieldText, fontWeight: bold ? 600 : 500 }}>{value}</span>
        {renderChevron(open)}
      </div>
      {open && (
        <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 1000 }}>
          {options.map((opt) => renderOption(opt, value === opt, () => onPick(opt), "8px 12px"))}
        </div>
      )}
    </div>
  );

  const renderRadio = (name, checked, onChange, label) => (
    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.label, cursor: "pointer" }}>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        style={{ accentColor: t.accent, width: "15px", height: "15px" }}
      />
      <span style={{ fontWeight: checked ? 500 : 400 }}>{label}</span>
    </label>
  );

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        minHeight: "100vh",
        backgroundColor: t.pageBg,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Top Navigation Header */}
      <header style={{
        backgroundColor: t.panel,
        borderBottom: `1px solid ${t.panelBorder}`,
        padding: "18px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: t.title, letterSpacing: "-0.02em", margin: 0, lineHeight: 1 }}>
            Piutang
          </h1>
          <span style={{ fontSize: "14px", color: t.muted, fontWeight: 400, lineHeight: 1 }}>
            (dalam IDR)
          </span>
        </div>
      </header>

      {/* Filter & Action Toolbar */}
      <section style={{
        backgroundColor: t.panel,
        borderBottom: `1px solid ${t.panelBorder}`,
        padding: "14px 32px",
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          {/* Left Filter Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
            {/* Date Picker: Per */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }} ref={datePickerRef}>
              <label style={toolbarLabel}>Per</label>
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "128px",
                  height: "34px",
                  borderBottom: `1px solid ${t.underline}`,
                  cursor: "pointer",
                  padding: "4px 0",
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={perDateText}
                  style={{
                    width: "100%",
                    height: "100%",
                    fontSize: "13px",
                    color: t.fieldText,
                    fontWeight: 500,
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    paddingRight: "24px",
                  }}
                />
                <span style={{ position: "absolute", right: 0, display: "flex", alignItems: "center", pointerEvents: "none" }}>
                  {renderCalIcon()}
                </span>
              </div>

              {showCalendar && renderCalendarPopover(
                calendarViewDate, setCalendarViewDate,
                calendarViewMode, setCalendarViewMode,
                yearRangeStart, setYearRangeStart,
                selectedDate,
                (date) => { setSelectedDate(date); setShowCalendar(false); }
              )}
            </div>

            {/* Period Select: Filter sesuai periode */}
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "12px", position: "relative" }} ref={periodeDropdownRef}>
              <label style={toolbarLabel}>Filter sesuai periode</label>
              <div
                onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "144px",
                  height: "34px",
                  borderBottom: `1px solid ${t.underline}`,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span style={{ fontSize: "13px", color: t.fieldText, fontWeight: 500 }}>{filterPeriode}</span>
                {renderChevron(showPeriodeDropdown)}
              </div>

              {showPeriodeDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 1000, width: "160px", userSelect: "none" }}>
                  {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"].map((opt) =>
                    renderOption(opt, filterPeriode === opt, () => { setFilterPeriode(opt); setShowPeriodeDropdown(false); })
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div style={{ marginLeft: "40px" }}>
              <button
                type="button"
                style={{
                  height: "34px",
                  padding: "0 24px",
                  backgroundColor: t.primary,
                  color: t.accentText,
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.primary)}
              >
                Filter
              </button>
            </div>

            {/* Advanced Filter Button */}
            <div>
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  height: "34px",
                  padding: "0 16px",
                  backgroundColor: t.btnBg,
                  border: `1px solid ${t.btnBorder}`,
                  color: t.accent,
                  fontSize: "13px",
                  fontWeight: 500,
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.btnHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.btnBg)}
              >
                Filter lebih lanjut
              </button>
            </div>
          </div>

          {/* Right Action Controls: Export */}
          <div style={{ display: "flex", alignItems: "center" }} ref={eksporDropdownRef}>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "34px",
                  padding: "0 14px",
                  backgroundColor: t.primary,
                  color: t.accentText,
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.primary)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Ekspor</span>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", top: "38px", right: 0, zIndex: 50, width: "140px" }}>
                  {renderOption("Ekspor PDF", false, () => setShowEksporDropdown(false))}
                  {renderOption("Ekspor Excel", false, () => setShowEksporDropdown(false))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Report Table Section */}
      <main style={{ flex: 1, padding: "24px 32px" }}>
        <div style={{
          backgroundColor: t.panel,
          border: `1px solid ${t.panelBorder}`,
          borderRadius: "4px",
          boxShadow: t.shadow,
          minHeight: "460px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Table Header Bar */}
          <div style={{
            width: "100%",
            backgroundColor: t.thead,
            borderBottom: `1px solid ${t.panelBorder}`,
            padding: "12px 24px",
            boxSizing: "border-box",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              fontSize: "12px",
              fontWeight: 500,
              color: t.theadText,
            }}>
              <div style={{ gridColumn: "span 3" }}>Customer</div>
              <div style={{ gridColumn: "span 2" }}>Total</div>
              <div style={{ gridColumn: "span 1" }}>1-30 Hari</div>
              <div style={{ gridColumn: "span 2" }}>31-60 Hari</div>
              <div style={{ gridColumn: "span 2" }}>61-90 Hari</div>
              <div style={{ gridColumn: "span 2", textAlign: "right" }}>&gt; 90 Hari</div>
            </div>
          </div>

          {/* Empty State Content Container */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            textAlign: "center",
          }}>
            <h2 style={{
              fontSize: "17px",
              fontWeight: 600,
              color: t.title,
              marginBottom: "24px",
              marginTop: 0,
            }}>
              Anda belum memiliki transaksi penjualan.
            </h2>

            <button
              type="button"
              onClick={() => navigate("/laporan")}
              style={{
                height: "36px",
                padding: "0 20px",
                backgroundColor: t.primary,
                color: t.accentText,
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.primary)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="4" y1="12" x2="20" y2="12" />
              </svg>
              <span>Buat Penjualan</span>
            </button>

            <span style={{ fontSize: "13px", color: t.linkText, margin: "12px 0", fontWeight: 400 }}>
              atau
            </span>

            <a
              href="#sample"
              onClick={(e) => e.preventDefault()}
              style={{
                fontSize: "13px",
                color: t.linkText,
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.linkText)}
            >
              Lihat Sample
            </a>
          </div>
        </div>
      </main>

      {/* Bottom Decorative Accent */}
      <footer style={{
        height: "64px",
        backgroundColor: t.footer,
        borderTop: `1px solid ${t.footerBorder}`,
        marginTop: "auto",
        width: "100%",
      }} />

      {/* Right Drawer "Filter laporan" */}
      {showFilterDrawer && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: drawerOpen ? t.overlay : "rgba(0, 0, 0, 0)",
            transition: "background-color 0.3s ease-in-out",
          }}
          onClick={closeFilterDrawer}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px",
              maxWidth: "90vw",
              height: "100%",
              backgroundColor: t.panel,
              borderLeft: isDark ? `1px solid ${t.panelBorder}` : "none",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              colorScheme: isDark ? "dark" : "light",
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.panelBorder}` }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: t.title, margin: 0 }}>
                Filter Laporan
              </h2>
            </div>

            {/* Drawer Body */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "0px",
            }}>
              {/* Per Tanggal */}
              <div style={{ position: "relative", marginBottom: "20px" }} ref={drawerDatePickerRef}>
                <label style={drawerLabel}>Per</label>
                <div
                  onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                  style={{
                    height: "38px",
                    backgroundColor: t.field,
                    border: `1px solid ${t.fieldBorder}`,
                    borderRadius: "4px",
                    padding: "0 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13px", color: t.fieldText, fontWeight: 500 }}>{drawerPerDateText}</span>
                  {renderCalIcon()}
                </div>
                {showDrawerCalendar && renderCalendarPopover(
                  drawerCalendarViewDate, setDrawerCalendarViewDate,
                  drawerCalendarViewMode, setDrawerCalendarViewMode,
                  drawerYearRangeStart, setDrawerYearRangeStart,
                  drawerSelectedDate,
                  (date) => { setDrawerSelectedDate(date); setShowDrawerCalendar(false); }
                )}
              </div>

              {/* Filter sesuai periode */}
              {renderDrawerSelect({
                label: "Filter sesuai periode",
                value: drawerPeriode,
                open: showDrawerPeriodeDropdown,
                setOpen: setShowDrawerPeriodeDropdown,
                options: ["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"],
                onPick: (opt) => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); },
                refEl: drawerPeriodeRef,
              })}

              {/* Filter menurut */}
              {renderDrawerSelect({
                label: "Filter menurut",
                value: drawerTipeTransaksi,
                open: showDrawerTipeDropdown,
                setOpen: setShowDrawerTipeDropdown,
                options: ["Tanggal Transaksi", "Tanggal Jatuh Tempo", "Nama Customer"],
                onPick: (opt) => { setDrawerTipeTransaksi(opt); setShowDrawerTipeDropdown(false); },
                refEl: drawerTipeRef,
                bold: true,
              })}

              {/* Grup dengan Tag */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ ...drawerLabel, marginBottom: "10px" }}>Grup dengan Tag</label>
                <div style={{ height: "1px", backgroundColor: t.divider, marginBottom: "12px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  {renderRadio("drawerTagOption", drawerTagOption === "all", () => setDrawerTagOption("all"), "Mencakup Semua")}
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.label, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "any"}
                      onChange={() => setDrawerTagOption("any")}
                      style={{ accentColor: t.accent, width: "15px", height: "15px" }}
                    />
                    <span style={{ fontWeight: drawerTagOption === "any" ? 500 : 400 }}>Salah Satu</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "16px", height: "16px", borderRadius: "50%",
                      border: `1px solid ${t.muted}`, color: t.muted,
                      fontSize: "10px", fontWeight: 700, cursor: "help",
                    }}>?</span>
                  </label>
                </div>
              </div>

              {/* Urutkan sesuai kolom */}
              {renderDrawerSelect({
                label: "Urutkan sesuai kolom",
                value: drawerUrutkan,
                open: showDrawerUrutkanDropdown,
                setOpen: setShowDrawerUrutkanDropdown,
                options: ["Customer", "Tanggal Transaksi", "Total Piutang"],
                onPick: (opt) => { setDrawerUrutkan(opt); setShowDrawerUrutkanDropdown(false); },
                refEl: drawerUrutkanRef,
                marginBottom: "12px",
                bold: true,
              })}

              {/* Urutan Order Radio */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "20px" }}>
                {renderRadio("drawerUrutanOrder", drawerUrutanOrder === "asc", () => setDrawerUrutanOrder("asc"), "Urutan Naik")}
                {renderRadio("drawerUrutanOrder", drawerUrutanOrder === "desc", () => setDrawerUrutanOrder("desc"), "Urutan Turun")}
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{
              padding: "16px 20px",
              borderTop: `1px solid ${t.panelBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              backgroundColor: t.panel,
            }}>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  height: "36px",
                  padding: "0 24px",
                  backgroundColor: "transparent",
                  border: `1px solid ${t.ghostBorder}`,
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: t.ghostText,
                  cursor: "pointer",
                  flex: 1,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.ghostHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  height: "36px",
                  padding: "0 24px",
                  backgroundColor: isDark ? t.primary : "#3d9c40",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: isDark ? t.accentText : "#ffffff",
                  cursor: "pointer",
                  flex: 1,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? t.primaryHover : "#2d8130")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? t.primary : "#3d9c40")}
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}