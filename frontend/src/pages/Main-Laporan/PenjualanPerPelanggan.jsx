import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function PenjualanPerPelanggan() {
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
        pageBg: "#121212", text: "#f1f5f9", title: "#ffffff", muted: "#94a3b8", label: "#e2e8f0",
        card: "#1a1a1a", cardBorder: "#634f27", cardShadow: "0 1px 3px rgba(0,0,0,0.4)",
        field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9", fieldShadow: "none",
        icon: "#E5B85C", accent: "#E5B85C", accentText: "#121212",
        primary: "#E5B85C", primaryHover: "#f0c978",
        btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27",
        ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
        ddSel: "rgba(229,184,92,0.2)", ddSelText: "#E5B85C", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
        drawerBg: "#1a1a1a", drawerHead: "#242424", drawerBorder: "#3a3326",
        overlay: "rgba(0, 0, 0, 0.7)", infoBorder: "#634f27",
        hoverFilter: "rgba(229,184,92,0.12)",
      }
    : {
        pageBg: "#f4f6f8", text: "#1e293b", title: "#1e293b", muted: "#64748b", label: "#475569",
        card: "#ffffff", cardBorder: "#e2e8f0", cardShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        field: "#ffffff", fieldBorder: "#d0d5dd", fieldText: "#1e293b", fieldShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
        icon: "#64748b", accent: "#4f66ee", accentText: "#ffffff",
        primary: "#4f66ee", primaryHover: "#3b52b4",
        btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#d0d5dd",
        ddBg: "#ffffff", ddBorder: "#cbd5e1", ddText: "#334155", ddHover: "#f8fafc",
        ddSel: "#eff6ff", ddSelText: "#4f67c9", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
        drawerBg: "#ffffff", drawerHead: "#f8fafc", drawerBorder: "#eaecf0",
        overlay: "rgba(15, 23, 42, 0.3)", infoBorder: "#94a3b8",
        hoverFilter: "#f4f6ff",
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
        nav: "#334155", accent: "#4f67c9", weekday: "#64748b",
        selBg: "#4f67c9", selText: "#ffffff",
        dayText: "#1e293b", dayMuted: "#cbd5e1",
        monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
      };

  // Tanggal Awal State & Popover
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDate, setStartDate] = useState("16/09/2026");

  // Tanggal Akhir State & Popover
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDate, setEndDate] = useState("16/09/2026");

  // Periode Dropdown State
  const periodeDropdownRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Header & Action Dropdown States
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Drawer Filter States (Right Sidebar "Filter laporan")
  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("16/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("16/09/2026");

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);
  const drawerPeriodeRef = useRef(null);

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur penjualan");
  const [showDrawerTipeDropdown, setShowDrawerTipeDropdown] = useState(false);
  const drawerTipeRef = useRef(null);

  const [drawerTagInput, setDrawerTagInput] = useState("");
  const [drawerTagOption, setDrawerTagOption] = useState("all"); // "all" | "any"

  const [drawerPelanggan, setDrawerPelanggan] = useState("");
  const [showDrawerPelangganDropdown, setShowDrawerPelangganDropdown] = useState(false);
  const drawerPelangganRef = useRef(null);

  const [drawerKategori, setDrawerKategori] = useState("");
  const [showDrawerKategoriDropdown, setShowDrawerKategoriDropdown] = useState(false);
  const drawerKategoriRef = useRef(null);
  const [drawerKategoriOption, setDrawerKategoriOption] = useState("all"); // "all" | "any"

  const [drawerUrutkan, setDrawerUrutkan] = useState("Pelanggan");
  const [showDrawerUrutkanDropdown, setShowDrawerUrutkanDropdown] = useState(false);
  const drawerUrutkanRef = useRef(null);
  const [drawerUrutanOrder, setDrawerUrutanOrder] = useState("asc"); // "asc" | "desc"

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
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerTipeRef.current && !drawerTipeRef.current.contains(event.target)) setShowDrawerTipeDropdown(false);
      if (drawerPelangganRef.current && !drawerPelangganRef.current.contains(event.target)) setShowDrawerPelangganDropdown(false);
      if (drawerKategoriRef.current && !drawerKategoriRef.current.contains(event.target)) setShowDrawerKategoriDropdown(false);
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
    setTimeout(() => setShowFilterDrawer(false), 280);
  };

  const handleResetDrawer = () => {
    setDrawerStartSelectedDate(new Date(2026, 8, 16));
    setDrawerStartDate("16/09/2026");
    setDrawerEndSelectedDate(new Date(2026, 8, 16));
    setDrawerEndDate("16/09/2026");
    setDrawerPeriode("Hari ini");
    setDrawerTipeTransaksi("Faktur penjualan");
    setDrawerTagInput("");
    setDrawerTagOption("all");
    setDrawerPelanggan("");
    setDrawerKategori("");
    setDrawerKategoriOption("all");
    setDrawerUrutkan("Pelanggan");
    setDrawerUrutanOrder("asc");
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
  const renderCalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const renderChevron = (open, size = 12) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={t.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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

  const mainLabelStyle = { display: "block", fontSize: "12px", fontWeight: 500, color: t.label, marginBottom: "6px" };
  const mainFieldStyle = {
    height: "36px",
    backgroundColor: t.field,
    border: `1px solid ${t.fieldBorder}`,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    boxShadow: t.fieldShadow,
  };

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

  const renderInfoBadge = () => (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: "15px", height: "15px", borderRadius: "50%", border: `1px solid ${t.infoBorder}`,
      color: t.muted, fontSize: "11px", fontWeight: "600", marginLeft: "2px",
    }}>
      i
    </span>
  );

  const renderRadioGroup = (name, current, setCurrent, firstLabel, secondLabel, withInfo = false) => (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {[
        { value: firstValue(name), label: firstLabel },
        { value: secondValue(name), label: secondLabel },
      ].map((opt, i) => (
        <label key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.label, cursor: "pointer" }}>
          <input
            type="radio"
            name={name}
            checked={current === opt.value}
            onChange={() => setCurrent(opt.value)}
            style={{ accentColor: t.accent }}
          />
          {opt.label}
          {withInfo && i === 1 && renderInfoBadge()}
        </label>
      ))}
    </div>
  );
  // nilai radio per grup
  function firstValue(name) { return name === "drawerUrutanOrder" ? "asc" : "all"; }
  function secondValue(name) { return name === "drawerUrutanOrder" ? "desc" : "any"; }

  // Select di drawer (label + field + dropdown, opsional children di bawahnya)
  const renderDrawerSelect = ({ label, value, placeholder, open, setOpen, options, onPick, refEl, selectedValue, children }) => (
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
            {options.map((opt) => renderOption(opt, (selectedValue ?? value) === opt, () => onPick(opt)))}
          </div>
        )}
      </div>
      {children && <div style={{ marginTop: "10px" }}>{children}</div>}
    </div>
  );

  return (
    <div
      className={isDark ? "pc-dark" : ""}
      style={{
        margin: isFullscreen ? 0 : "-24px",
        minHeight: "100vh",
        backgroundColor: t.pageBg,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Top Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        backgroundColor: t.pageBg,
      }}>
        {/* Left Title */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: t.title, margin: 0 }}>
            Penjualan per pelanggan
          </h1>
          <span style={{ fontSize: "13px", color: t.muted, fontWeight: 400 }}>(dalam IDR)</span>
        </div>

        {/* Right Header Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Beri masukan Button */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              style={{
                height: "32px",
                padding: "0 12px",
                backgroundColor: t.btnBg,
                border: `1px solid ${t.btnBorder}`,
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: t.accent,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.btnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.btnBg)}
            >
              <span>Beri masukan</span>
              <svg width="8" height="6" viewBox="0 0 10 7" fill={t.accent}>
                <polygon points="0,0 10,0 5,7" />
              </svg>
            </button>
            {showFeedbackDropdown && (
              <div style={{ ...ddPanelStyle, position: "absolute", top: "38px", right: 0, zIndex: 50, width: "160px" }}>
                {renderOption("Kirim Saran", false, () => setShowFeedbackDropdown(false), "13px")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div style={{ padding: "0 24px 24px 24px" }}>
        <div style={{
          backgroundColor: t.card,
          borderRadius: "8px",
          border: `1px solid ${t.cardBorder}`,
          boxShadow: t.cardShadow,
          padding: "20px 24px 60px 24px",
          minHeight: "520px",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Toolbar inside Card */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "32px",
          }}>
            {/* Left Controls */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
              {/* Tanggal awal */}
              <div style={{ position: "relative" }} ref={startDatePickerRef}>
                <label style={mainLabelStyle}>Tanggal awal</label>
                <div
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                  style={{ ...mainFieldStyle, width: "140px", padding: "0 10px" }}
                >
                  <span style={{ fontSize: "13px", color: t.fieldText, fontWeight: 400 }}>{startDate}</span>
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

              {/* Tanggal akhir */}
              <div style={{ position: "relative" }} ref={endDatePickerRef}>
                <label style={mainLabelStyle}>Tanggal akhir</label>
                <div
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                  style={{ ...mainFieldStyle, width: "140px", padding: "0 10px" }}
                >
                  <span style={{ fontSize: "13px", color: t.fieldText, fontWeight: 400 }}>{endDate}</span>
                  {renderCalIcon()}
                </div>
                {showEndCalendar && renderCalendarPopover(
                  endCalendarViewDate, setEndCalendarViewDate,
                  endCalendarViewMode, setEndCalendarViewMode,
                  endYearRangeStart, setEndYearRangeStart,
                  endSelectedDate,
                  (date) => { setEndSelectedDate(date); setShowEndCalendar(false); }
                )}
              </div>

              {/* Periode */}
              <div style={{ position: "relative" }} ref={periodeDropdownRef}>
                <label style={mainLabelStyle}>Periode</label>
                <div
                  onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                  style={{ ...mainFieldStyle, width: "150px", padding: "0 12px" }}
                >
                  <span style={{ fontSize: "13px", color: t.fieldText }}>{filterPeriode}</span>
                  {renderChevron(showPeriodeDropdown)}
                </div>
                {showPeriodeDropdown && (
                  <div style={{
                    ...ddPanelStyle,
                    position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 1000,
                    width: "170px", maxHeight: "200px", overflowY: "auto",
                  }}>
                    {PERIODE_OPTIONS.map((opt) =>
                      renderOption(opt, filterPeriode === opt, () => { setFilterPeriode(opt); setShowPeriodeDropdown(false); }, "13px")
                    )}
                  </div>
                )}
              </div>

              {/* Tombol Tampilkan */}
              <button
                type="button"
                style={{
                  height: "36px",
                  padding: "0 20px",
                  backgroundColor: t.primary,
                  color: t.accentText,
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.primary)}
              >
                Tampilkan
              </button>

              {/* Tombol Filter */}
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  backgroundColor: "transparent",
                  color: t.accent,
                  fontSize: "13px",
                  fontWeight: 500,
                  border: `1px solid ${t.accent}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  justifyContent: "center",
                  boxShadow: t.fieldShadow,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.hoverFilter)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
              </button>
            </div>

            {/* Right Tools: Ekspor & Lihat contoh */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              {/* Ekspor Button */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                  style={{
                    height: "36px",
                    padding: "0 14px",
                    backgroundColor: t.btnBg,
                    border: `1px solid ${isDark ? t.btnBorder : "#cbd5e1"}`,
                    borderRadius: "6px",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: t.accent,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = t.btnHover;
                    e.currentTarget.style.borderColor = isDark ? t.accent : "#94a3b8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = t.btnBg;
                    e.currentTarget.style.borderColor = isDark ? t.btnBorder : "#cbd5e1";
                  }}
                >
                  <span>Ekspor</span>
                  <svg width="10" height="7" viewBox="0 0 10 7" fill={t.accent}>
                    <polygon points="0,0 10,0 5,7" />
                  </svg>
                </button>

                {showEksporDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "42px", right: 0, zIndex: 50, width: "140px", userSelect: "none" }}>
                    {renderOption("Ekspor PDF", false, () => setShowEksporDropdown(false), "13px")}
                    {renderOption("Ekspor Excel", false, () => setShowEksporDropdown(false), "13px")}
                  </div>
                )}
              </div>

              {/* Lihat contoh link with PDF icon */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  userSelect: "none",
                  paddingTop: "2px",
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
                    style={{ width: "16px", height: "16px", color: t.icon }}
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
                <span style={{ fontSize: "13px", color: t.accent, fontWeight: 400 }}>Lihat contoh</span>
              </div>
            </div>
          </div>

          {/* Empty State Body Content */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            textAlign: "center",
          }}>
            {/* 3D Graphic Illustration */}
            <div style={{
              position: "relative", width: "260px", height: "190px", marginBottom: "20px",
              display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none",
              filter: isDark ? "brightness(0.75)" : "none",
            }}>
              <svg style={{ width: "100%", height: "100%", overflow: "visible" }} fill="none" viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.95">
                  <ellipse cx="160" cy="192" fill="#cbd5e1" opacity="0.3" rx="90" ry="24" />
                  <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="#e2e8f0" />
                  <path d="M72 178 L160 208 L160 216 L72 186 Z" fill="#cbd5e1" />
                  <path d="M160 208 L248 178 L248 186 L160 216 Z" fill="#94a3b8" />
                  <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="url(#pedestal-gradient-penjualan-pelanggan)" />
                </g>
                <g transform="translate(68, 55)">
                  <ellipse cx="42" cy="65" fill="#fda4af" opacity="0.4" rx="38" ry="18" />
                  <path d="M8 44 C8 24 23 8 42 8 C61 8 76 24 76 44 L76 54 C76 74 61 90 42 90 C23 90 8 74 8 54 Z" fill="url(#pink-donut-depth-penjualan-pelanggan)" />
                  <ellipse cx="42" cy="44" fill="url(#pink-donut-face-penjualan-pelanggan)" rx="34" ry="34" />
                  <ellipse cx="42" cy="44" fill="#ffffff" rx="14" ry="14" />
                  <path d="M42 10 A34 34 0 0 1 76 44 L62 44 A20 20 0 0 0 42 24 Z" fill="#fb7185" />
                  <path d="M18 55 A34 34 0 0 1 42 10 L42 24 A20 20 0 0 0 28 50 Z" fill="#f43f5e" opacity="0.9" />
                </g>
                <g transform="translate(136, 118)">
                  <path d="M0 24 L14 19 L28 24 L28 65 L14 70 L0 65 Z" fill="#e2e8f0" />
                  <path d="M14 19 L28 24 L28 65 L14 70 Z" fill="#cbd5e1" />
                  <path d="M0 24 L14 19 L28 24 L14 29 Z" fill="#f8fafc" />
                </g>
                <g transform="translate(148, 90)">
                  <path d="M0 20 L16 14 L32 20 L32 75 L16 81 L0 75 Z" fill="#818cf8" />
                  <path d="M16 14 L32 20 L32 75 L16 81 Z" fill="#6366f1" />
                  <path d="M0 20 L16 14 L32 20 L16 26 Z" fill="#a5b4fc" />
                </g>
                <g transform="translate(164, 68)">
                  <path d="M0 24 L16 17 L32 24 L32 95 L16 102 L0 95 Z" fill="#cbd5e1" />
                  <path d="M16 17 L32 24 L32 95 L16 102 Z" fill="#94a3b8" />
                  <path d="M0 24 L16 17 L32 24 L16 31 Z" fill="#f1f5f9" />
                </g>
                <g transform="translate(148, 92)">
                  <path d="M-8 48 C6 44 14 36 28 20 C34 14 38 4 48 -6" fill="none" stroke="url(#trend-arrow-stroke-penjualan-pelanggan)" strokeLinecap="round" strokeWidth="9" />
                  <polygon fill="#db2777" points="46,-16 57,-4 42,0" />
                  <polygon fill="#f43f5e" points="46,-16 57,-4 52,-14" />
                </g>
                <g transform="translate(216, 92)">
                  <ellipse cx="30" cy="50" fill="#cbd5e1" opacity="0.3" rx="28" ry="14" />
                  <path d="M6 32 C6 18 17 6 30 6 C43 6 54 18 54 39 Z" fill="url(#pink-donut-depth-small-penjualan-pelanggan)" />
                  <ellipse cx="30" cy="32" fill="url(#pink-donut-face-penjualan-pelanggan)" rx="24" ry="24" />
                  <ellipse cx="30" cy="32" fill="#ffffff" rx="10" ry="10" />
                  <path d="M30 8 A24 24 0 0 1 54 32 L44 32 A14 14 0 0 0 30 18 Z" fill="#fb7185" />
                </g>
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="pedestal-gradient-penjualan-pelanggan" x1="72" x2="248" y1="148" y2="208">
                    <stop stopColor="#ffffff" />
                    <stop offset="0.5" stopColor="#f8fafc" />
                    <stop offset="1" stopColor="#e2e8f0" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-face-penjualan-pelanggan" x1="8" x2="76" y1="8" y2="76">
                    <stop stopColor="#fda4af" />
                    <stop offset="1" stopColor="#f43f5e" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-penjualan-pelanggan" x1="8" x2="76" y1="8" y2="90">
                    <stop stopColor="#f43f5e" />
                    <stop offset="1" stopColor="#be123c" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-small-penjualan-pelanggan" x1="6" x2="54" y1="6" y2="65">
                    <stop stopColor="#f43f5e" />
                    <stop offset="1" stopColor="#9f1239" />
                  </linearGradient>
                  <linearGradient gradientUnits="userSpaceOnUse" id="trend-arrow-stroke-penjualan-pelanggan" x1="-8" x2="48" y1="48" y2="-6">
                    <stop stopColor="#e11d48" />
                    <stop offset="0.6" stopColor="#db2777" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Primary Text */}
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: "0 0 8px 0" }}>
              Laporan akan muncul di sini
            </h2>

            {/* Subtext */}
            <p style={{ fontSize: "13.5px", color: t.muted, margin: 0, maxWidth: "360px", lineHeight: 1.5 }}>
              Pilih tanggal atau periode, lalu klik tombol{" "}
              <strong style={{ fontWeight: 700, color: t.title }}>Tampilkan</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Right Drawer Sidebar */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: t.overlay,
              transition: "opacity 280ms ease-in-out",
              opacity: drawerOpen ? 1 : 0,
            }}
          />
          <aside
            style={{
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              width: "380px", maxWidth: "90vw",
              backgroundColor: t.drawerBg,
              borderLeft: isDark ? `1px solid ${t.cardBorder}` : "none",
              boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
              display: "flex", flexDirection: "column",
              zIndex: 9999,
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
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
              {/* Tanggal awal & Tanggal akhir */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Tanggal awal */}
                <div style={{ flex: 1, position: "relative" }} ref={drawerStartDatePickerRef}>
                  <label style={drawerLabelStyle}>Tanggal awal</label>
                  <div onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={{ ...drawerFieldStyle, padding: "0 10px" }}>
                    <span style={{ fontSize: "13px", color: t.fieldText }}>{drawerStartDate}</span>
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

                <span style={{ color: t.muted, marginTop: "24px" }}>-</span>

                {/* Tanggal akhir */}
                <div style={{ flex: 1, position: "relative" }} ref={drawerEndDatePickerRef}>
                  <label style={drawerLabelStyle}>Tanggal akhir</label>
                  <div onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)} style={{ ...drawerFieldStyle, padding: "0 10px" }}>
                    <span style={{ fontSize: "13px", color: t.fieldText }}>{drawerEndDate}</span>
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
              </div>

              {/* Periode */}
              {renderDrawerSelect({
                label: "Periode",
                value: drawerPeriode,
                placeholder: "",
                open: showDrawerPeriodeDropdown,
                setOpen: setShowDrawerPeriodeDropdown,
                options: PERIODE_OPTIONS,
                onPick: (opt) => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); },
                refEl: drawerPeriodeRef,
              })}

              {/* Tipe transaksi */}
              {renderDrawerSelect({
                label: "Tipe transaksi",
                value: drawerTipeTransaksi,
                placeholder: "",
                open: showDrawerTipeDropdown,
                setOpen: setShowDrawerTipeDropdown,
                options: ["Faktur penjualan", "Penagihan penjualan", "Pemesanan penjualan", "Penawaran penjualan", "Retur penjualan"],
                onPick: (opt) => { setDrawerTipeTransaksi(opt); setShowDrawerTipeDropdown(false); },
                refEl: drawerTipeRef,
              })}

              {/* Tag */}
              <div>
                <label style={drawerLabelStyle}>Tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerTagInput}
                  onChange={(e) => setDrawerTagInput(e.target.value)}
                  style={{
                    width: "100%", height: "38px", backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
                    padding: "0 12px", fontSize: "13.5px", color: t.fieldText, outline: "none", boxSizing: "border-box",
                    marginBottom: "10px",
                  }}
                />
                {renderRadioGroup("drawerTagOption", drawerTagOption, setDrawerTagOption, "Mencakup semua", "Salah satu", true)}
              </div>

              {/* Pelanggan */}
              {renderDrawerSelect({
                label: "Pelanggan",
                value: drawerPelanggan,
                placeholder: "Pilih pelanggan",
                open: showDrawerPelangganDropdown,
                setOpen: setShowDrawerPelangganDropdown,
                options: ["Semua Pelanggan", "PT. Maju Bersama", "CV. Abadi Jaya", "Toko Sejahtera"],
                onPick: (opt) => { setDrawerPelanggan(opt); setShowDrawerPelangganDropdown(false); },
                refEl: drawerPelangganRef,
              })}

              {/* Kategori produk */}
              {renderDrawerSelect({
                label: "Kategori produk",
                value: drawerKategori,
                placeholder: "Pilih kategori produk",
                open: showDrawerKategoriDropdown,
                setOpen: setShowDrawerKategoriDropdown,
                options: ["Semua Kategori", "Elektronik", "Pakaian", "Makanan & Minuman", "Lainnya"],
                onPick: (opt) => { setDrawerKategori(opt); setShowDrawerKategoriDropdown(false); },
                refEl: drawerKategoriRef,
                children: renderRadioGroup("drawerKategoriOption", drawerKategoriOption, setDrawerKategoriOption, "Mencakup semua", "Salah satu", true),
              })}

              {/* Urutkan berdasarkan */}
              {renderDrawerSelect({
                label: "Urutkan berdasarkan",
                value: drawerUrutkan,
                placeholder: "",
                open: showDrawerUrutkanDropdown,
                setOpen: setShowDrawerUrutkanDropdown,
                options: ["Pelanggan", "Tanggal", "No. Transaksi", "Jumlah"],
                onPick: (opt) => { setDrawerUrutkan(opt); setShowDrawerUrutkanDropdown(false); },
                refEl: drawerUrutkanRef,
                children: renderRadioGroup("drawerUrutanOrder", drawerUrutanOrder, setDrawerUrutanOrder, "Urutan naik", "Urutan turun"),
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6" />
                  <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: t.accent, textDecoration: "underline" }}>
                  Reset filter
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{ background: "none", border: "none", fontSize: "13.5px", fontWeight: 600, color: isDark ? "#cbd5e1" : "#475569", cursor: "pointer" }}
                  onMouseEnter={(e) => { if (isDark) e.currentTarget.style.color = "#E5B85C"; }}
                  onMouseLeave={(e) => { if (isDark) e.currentTarget.style.color = "#cbd5e1"; }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    height: "38px", padding: "0 22px", backgroundColor: t.primary, border: "none",
                    borderRadius: "6px", fontSize: "13.5px", fontWeight: 600, color: t.accentText, cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.primaryHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = t.primary)}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        .pc-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}