import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PembelianPerSupplier() {
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
      panel: "#1a1a1a", panelBorder: "#634f27",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9",
      icon: "#E5B85C", iconMuted: "#94a3b8",
      accent: "#E5B85C", accentText: "#121212",
      primary: "#E5B85C", primaryHover: "#f0c978",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddSel: "rgba(229,184,92,0.2)", ddSelText: "#E5B85C", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      drawerBg: "#1a1a1a", drawerBorder: "#3a3326", overlay: "rgba(0, 0, 0, 0.7)", ghostText: "#cbd5e1",
      infoBorder: "#64748b", infoText: "#94a3b8", pdfIcon: "#cbd5e1",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#0f172a", muted: "#64748b", label: "#334155", drawerLabel: "#344054",
      strong: "#334155", radioText: "#334155",
      panel: "#ffffff", panelBorder: "#e2e8f0",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#1e293b",
      icon: "#94a3b8", iconMuted: "#64748b",
      accent: "#4661E6", accentText: "#ffffff",
      primary: "#4661E6", primaryHover: "#1d4ed8",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#cbd5e1", btnText: "#4661E6",
      ddBg: "#ffffff", ddBorder: "#cbd5e1", ddText: "#334155", ddHover: "#f1f5f9",
      ddSel: "#f1f5f9", ddSelText: "#4661E6", ddShadow: "0 4px 12px rgba(0,0,0,0.1)",
      drawerBg: "#ffffff", drawerBorder: "#f1f5f9", overlay: "rgba(15, 23, 42, 0.4)", ghostText: "#64748b",
      infoBorder: "#94a3b8", infoText: "#64748b", pdfIcon: "#475569",
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

  // Date Pickers State (Main Toolbar)
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

  // Periode Preset State
  const [periodePreset, setPeriodePreset] = useState("Hari ini");

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

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur pembelian");
  const [showDrawerTipeTransaksiDropdown, setShowDrawerTipeTransaksiDropdown] = useState(false);
  const drawerTipeTransaksiRef = useRef(null);

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup semua");

  const [drawerSupplier, setDrawerSupplier] = useState("");
  const [showDrawerSupplierDropdown, setShowDrawerSupplierDropdown] = useState(false);
  const drawerSupplierRef = useRef(null);

  const [drawerKategoriProduk, setDrawerKategoriProduk] = useState("");
  const [showDrawerKategoriProdukDropdown, setShowDrawerKategoriProdukDropdown] = useState(false);
  const drawerKategoriProdukRef = useRef(null);
  const [drawerKategoriProdukMatch, setDrawerKategoriProdukMatch] = useState("Mencakup semua");

  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("Supplier");
  const [showDrawerUrutkanBerdasarkanDropdown, setShowDrawerUrutkanBerdasarkanDropdown] = useState(false);
  const drawerUrutkanBerdasarkanRef = useRef(null);
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
      if (drawerTipeTransaksiRef.current && !drawerTipeTransaksiRef.current.contains(event.target)) setShowDrawerTipeTransaksiDropdown(false);
      if (drawerSupplierRef.current && !drawerSupplierRef.current.contains(event.target)) setShowDrawerSupplierDropdown(false);
      if (drawerKategoriProdukRef.current && !drawerKategoriProdukRef.current.contains(event.target)) setShowDrawerKategoriProdukDropdown(false);
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
    setDrawerStartSelectedDate(today);
    setDrawerEndSelectedDate(today);
    setDrawerPeriod("Hari ini");
    setDrawerTipeTransaksi("Faktur pembelian");
    setDrawerTag("");
    setDrawerTagMatch("Mencakup semua");
    setDrawerSupplier("");
    setDrawerKategoriProduk("");
    setDrawerKategoriProdukMatch("Mencakup semua");
    setDrawerUrutkanBerdasarkan("Supplier");
    setDrawerUrutanOrder("asc");
  };

  const handleQuickPeriodSelect = (periodType, setStartSel, setStartView, setEndSel, setEndView, setShowPeriod) => {
    const today = new Date(2026, 8, 18);
    let s = new Date(today);
    let e = new Date(today);

    if (periodType === "Hari ini") {
      s = new Date(today);
      e = new Date(today);
    } else if (periodType === "Kemarin") {
      s = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      e = new Date(s);
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

  const renderCalIcon = (size = 16) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );

  const renderChevron = (size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={t.iconMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const mainLabelStyle = { fontSize: "12px", fontWeight: 400, color: t.label };
  const mainFieldStyle = {
    width: "100%", height: "38px", padding: "0 32px 0 12px", fontSize: "12px", fontWeight: 400,
    color: t.fieldText, backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    cursor: "pointer", outline: "none", boxSizing: "border-box",
  };
  const iconWrap = (color) => ({
    position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center",
    paddingRight: "10px", pointerEvents: "none", color,
  });
  const outlineBtnStyle = {
    height: "38px", padding: "0 14px", backgroundColor: t.btnBg, border: `1px solid ${t.btnBorder}`,
    color: t.btnText, fontSize: "12px", fontWeight: 500, borderRadius: "6px", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "8px", transition: "background-color 0.15s ease",
  };

  const drawerLabelStyle = { fontSize: "13px", fontWeight: 600, color: t.drawerLabel };
  const drawerFieldStyle = {
    width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px",
    backgroundColor: t.field, border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
    boxSizing: "border-box",
  };

  const renderRadio = (name, value, checked, onChange, label, withInfo = false) => (
    <label key={value} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: t.radioText }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ accentColor: t.accent, width: "16px", height: "16px", cursor: "pointer" }}
      />
      <span>{label}</span>
      {withInfo && (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${t.infoBorder}`, fontSize: "10px", color: t.infoText, fontWeight: 600, marginLeft: "2px" }}>i</span>
      )}
    </label>
  );

  // Dropdown di drawer (label + field + panel + opsional children)
  const renderDrawerSelect = ({ label, value, placeholder, open, setOpen, options, onPick, refEl, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={refEl}>
      <label style={drawerLabelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            ...drawerFieldStyle, color: value ? t.fieldText : t.muted,
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
      {children}
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

  return (
    <div
      className={isDark ? "ps-dark" : ""}
      style={{
        backgroundColor: t.pageBg,
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Header Section */}
      <header style={{ width: "100%", padding: "20px 24px 12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: t.title, letterSpacing: "-0.01em", margin: 0 }}>Pembelian per supplier</h1>
          <span style={{ fontSize: "14px", fontWeight: 400, color: t.muted }}>(dalam IDR)</span>
        </div>
        <div style={{ display: "inline-flex", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", border: `1px solid ${t.btnBorder}`, overflow: "hidden", backgroundColor: t.btnBg }}>
          <button
            type="button"
            style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 600, color: t.btnText, background: "transparent", border: "none", cursor: "pointer", transition: "background-color 0.15s ease" }}
            {...hoverBg("transparent", t.btnHover)}
          >
            Beri masukan
          </button>
          <div style={{ width: "1px", backgroundColor: t.btnBorder }} />
          <button
            type="button"
            style={{ padding: "6px 8px", color: t.btnText, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s ease" }}
            {...hoverBg("transparent", t.btnHover)}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Filter Toolbar */}
      <section style={{ width: "100%", padding: "12px 24px 16px 24px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
            {/* Field 1: Tanggal awal */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal awal</label>
              <div style={{ position: "relative", width: "150px" }}>
                <input
                  type="text"
                  readOnly
                  value={startDate}
                  onClick={() => { setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false); }}
                  style={mainFieldStyle}
                />
                <div style={iconWrap(t.icon)}>{renderCalIcon(16)}</div>
                {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
              </div>
            </div>

            {/* Field 2: Tanggal akhir */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal akhir</label>
              <div style={{ position: "relative", width: "150px" }}>
                <input
                  type="text"
                  readOnly
                  value={endDate}
                  onClick={() => { setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false); }}
                  style={mainFieldStyle}
                />
                <div style={iconWrap(t.icon)}>{renderCalIcon(16)}</div>
                {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
              </div>
            </div>

            {/* Field 3: Periode */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={mainLabelStyle}>Periode</label>
              <div style={{ position: "relative", width: "140px" }}>
                <select
                  value={periodePreset}
                  onChange={(e) => {
                    setPeriodePreset(e.target.value);
                    handleQuickPeriodSelect(e.target.value, setStartSelectedDate, setStartCalendarViewDate, setEndSelectedDate, setEndCalendarViewDate);
                  }}
                  style={{ ...mainFieldStyle, appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option value="Hari ini">Hari ini</option>
                  <option value="Minggu ini">Minggu ini</option>
                  <option value="Bulan ini">Bulan ini</option>
                  <option value="Tahun ini">Tahun ini</option>
                </select>
                <div style={iconWrap(t.iconMuted)}>{renderChevron(16)}</div>
              </div>
            </div>

            {/* Action: Tampilkan Button */}
            <button
              type="button"
              style={{
                height: "38px", padding: "0 20px", fontSize: "12px", fontWeight: 500,
                color: t.accentText, backgroundColor: t.primary, borderRadius: "6px", border: "none",
                cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s ease",
              }}
              {...hoverBg(t.primary, t.primaryHover)}
            >
              Tampilkan
            </button>

            {/* Action: Filter Outline Button */}
            <button type="button" onClick={openFilterDrawer} style={outlineBtnStyle} {...hoverBg(t.btnBg, t.btnHover)}>
              <svg width="14" height="14" fill="none" stroke={t.btnText} strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Filter
            </button>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
            <div style={{ position: "relative" }} ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
                  padding: "6px 12px", minWidth: "96px", backgroundColor: t.btnBg, border: `1px solid ${t.btnBorder}`,
                  borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                {...hoverBg(t.btnBg, t.btnHover)}
              >
                <span style={{ fontSize: "12px", fontWeight: 600, color: t.btnText }}>Ekspor</span>
                <svg width="10" height="10" viewBox="0 0 10 6" style={{ fill: t.btnText }}>
                  <path d="M0 0l5 5 5-5z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div style={{ ...ddPanelStyle, position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, width: "176px" }}>
                  {renderOption("Export Excel (.xlsx)", false, () => setShowEksporDropdown(false), "13px")}
                  {renderOption("Export PDF (.pdf)", false, () => setShowEksporDropdown(false), "13px")}
                  {renderOption("Export CSV (.csv)", false, () => setShowEksporDropdown(false), "13px")}
                </div>
              )}
            </div>

            <a
              href="#"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 400, color: t.btnText, textDecoration: "none", marginTop: "4px" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: "16px", height: "16px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.pdfIcon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span
                  style={{
                    position: "absolute", left: "-4px", top: "6px", display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: "#dc2626", color: "#ffffff", borderRadius: "2px", fontWeight: 700, fontSize: "8px",
                    lineHeight: 1, padding: "0.5px 1.5px", boxShadow: "0 1px 2px rgba(0,0,0,0.2)", transform: "scale(0.8)",
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

      {/* Main Empty State Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", marginTop: "-40px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "448px" }}>
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
              marginTop: "-100px",
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

          <h2 style={{ fontSize: "14px", fontWeight: 600, color: t.title, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
            Laporan akan muncul di sini
          </h2>
          <p style={{ fontSize: "12px", color: t.muted, margin: 0 }}>
            Pilih tanggal atau periode, lalu klik tombol <span style={{ fontWeight: 600, color: t.strong }}>Tampilkan</span>.
          </p>
        </div>
      </main>

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
              width: "380px",
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
            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, margin: 0 }}>Filter laporan</h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ background: "none", border: "none", color: t.iconMuted, cursor: "pointer", padding: "4px", display: "flex" }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                  <label style={{ ...drawerLabelStyle, flex: 1 }}>Tanggal awal</label>
                  <label style={{ ...drawerLabelStyle, flex: 1 }}>Tanggal akhir</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, position: "relative" }} ref={drawerStartDatePickerRef}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        readOnly
                        value={drawerStartDate}
                        onClick={() => { setShowDrawerStartCalendar(!showDrawerStartCalendar); setShowDrawerEndCalendar(false); }}
                        style={{ ...drawerFieldStyle, padding: "0 30px 0 12px", color: t.fieldText, cursor: "pointer", outline: "none" }}
                      />
                      <span style={iconWrap(t.icon)}>{renderCalIcon(16)}</span>
                    </div>
                    {showDrawerStartCalendar && renderCalendarPicker(drawerStartSelectedDate, setDrawerStartSelectedDate, drawerStartCalendarViewDate, setDrawerStartCalendarViewDate, drawerStartCalendarViewMode, setDrawerStartCalendarViewMode, drawerStartYearRangeStart, setDrawerStartYearRangeStart, () => setShowDrawerStartCalendar(false))}
                  </div>

                  <span style={{ color: t.muted, fontWeight: 500 }}>-</span>

                  <div style={{ flex: 1, position: "relative" }} ref={drawerEndDatePickerRef}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        readOnly
                        value={drawerEndDate}
                        onClick={() => { setShowDrawerEndCalendar(!showDrawerEndCalendar); setShowDrawerStartCalendar(false); }}
                        style={{ ...drawerFieldStyle, padding: "0 30px 0 12px", color: t.fieldText, cursor: "pointer", outline: "none" }}
                      />
                      <span style={iconWrap(t.icon)}>{renderCalIcon(16)}</span>
                    </div>
                    {showDrawerEndCalendar && renderCalendarPicker(drawerEndSelectedDate, setDrawerEndSelectedDate, drawerEndCalendarViewDate, setDrawerEndCalendarViewDate, drawerEndCalendarViewMode, setDrawerEndCalendarViewMode, drawerEndYearRangeStart, setDrawerEndYearRangeStart, () => setShowDrawerEndCalendar(false), true)}
                  </div>
                </div>
              </div>

              {/* Periode */}
              {renderDrawerSelect({
                label: "Periode",
                value: drawerPeriod,
                placeholder: "Hari ini",
                open: showDrawerPeriodDropdown,
                setOpen: setShowDrawerPeriodDropdown,
                options: ["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini"],
                onPick: (item) => {
                  setDrawerPeriod(item);
                  handleQuickPeriodSelect(item, setDrawerStartSelectedDate, setDrawerStartCalendarViewDate, setDrawerEndSelectedDate, setDrawerEndCalendarViewDate, setShowDrawerPeriodDropdown);
                },
                refEl: drawerPeriodRef,
              })}

              {/* Tipe transaksi */}
              {renderDrawerSelect({
                label: "Tipe transaksi",
                value: drawerTipeTransaksi,
                placeholder: "Faktur pembelian",
                open: showDrawerTipeTransaksiDropdown,
                setOpen: setShowDrawerTipeTransaksiDropdown,
                options: ["Faktur pembelian", "Pesanan pembelian", "Pengiriman pembelian", "Retur pembelian"],
                onPick: (item) => { setDrawerTipeTransaksi(item); setShowDrawerTipeTransaksiDropdown(false); },
                refEl: drawerTipeTransaksiRef,
              })}

              {/* Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={drawerLabelStyle}>Tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerTag}
                  onChange={(e) => setDrawerTag(e.target.value)}
                  style={{ ...drawerFieldStyle, color: t.fieldText, outline: "none" }}
                />
                <div style={{ display: "flex", gap: "20px", marginTop: "4px", alignItems: "center" }}>
                  {renderRadio("drawerTagMatch", "Mencakup semua", drawerTagMatch === "Mencakup semua", () => setDrawerTagMatch("Mencakup semua"), "Mencakup semua")}
                  {renderRadio("drawerTagMatch", "Salah satu", drawerTagMatch === "Salah satu", () => setDrawerTagMatch("Salah satu"), "Salah satu", true)}
                </div>
              </div>

              {/* Supplier */}
              {renderDrawerSelect({
                label: "Supplier",
                value: drawerSupplier,
                placeholder: "Pilih supplier",
                open: showDrawerSupplierDropdown,
                setOpen: setShowDrawerSupplierDropdown,
                options: ["Semua Supplier", "PT Supplier Utama", "CV Bahan Baku", "PT Distribusi Abadi"],
                onPick: (item) => { setDrawerSupplier(item === "Semua Supplier" ? "" : item); setShowDrawerSupplierDropdown(false); },
                refEl: drawerSupplierRef,
              })}

              {/* Kategori produk */}
              {renderDrawerSelect({
                label: "Kategori produk",
                value: drawerKategoriProduk,
                placeholder: "Pilih kategori produk",
                open: showDrawerKategoriProdukDropdown,
                setOpen: setShowDrawerKategoriProdukDropdown,
                options: ["Semua Kategori", "Elektronik", "Bahan Kimia", "Suku Cadang", "Peralatan"],
                onPick: (item) => { setDrawerKategoriProduk(item === "Semua Kategori" ? "" : item); setShowDrawerKategoriProdukDropdown(false); },
                refEl: drawerKategoriProdukRef,
                children: (
                  <div style={{ display: "flex", gap: "20px", marginTop: "4px", alignItems: "center" }}>
                    {renderRadio("drawerKategoriProdukMatch", "Mencakup semua", drawerKategoriProdukMatch === "Mencakup semua", () => setDrawerKategoriProdukMatch("Mencakup semua"), "Mencakup semua")}
                    {renderRadio("drawerKategoriProdukMatch", "Salah satu", drawerKategoriProdukMatch === "Salah satu", () => setDrawerKategoriProdukMatch("Salah satu"), "Salah satu", true)}
                  </div>
                ),
              })}

              {/* Urutkan berdasarkan */}
              {renderDrawerSelect({
                label: "Urutkan berdasarkan",
                value: drawerUrutkanBerdasarkan,
                placeholder: "Supplier",
                open: showDrawerUrutkanBerdasarkanDropdown,
                setOpen: setShowDrawerUrutkanBerdasarkanDropdown,
                options: ["Supplier", "Tgl. transaksi", "Total kuantitas", "Total pembelian"],
                onPick: (item) => { setDrawerUrutkanBerdasarkan(item); setShowDrawerUrutkanBerdasarkanDropdown(false); },
                refEl: drawerUrutkanBerdasarkanRef,
                children: (
                  <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
                    {renderRadio("drawerUrutanOrder", "asc", drawerUrutanOrder === "asc", () => setDrawerUrutanOrder("asc"), "Urutan naik")}
                    {renderRadio("drawerUrutanOrder", "desc", drawerUrutanOrder === "desc", () => setDrawerUrutanOrder("desc"), "Urutan turun")}
                  </div>
                ),
              })}
            </div>

            {/* Drawer Footer Buttons */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${t.drawerBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={handleResetFilter}
                style={{ fontSize: "13.5px", fontWeight: 500, color: t.accent, backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Reset filter</span>
              </button>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{ padding: "8px 16px", fontSize: "13.5px", fontWeight: 600, color: t.ghostText, backgroundColor: "transparent", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  onMouseEnter={(e) => { if (isDark) e.currentTarget.style.color = "#E5B85C"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t.ghostText; }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate(drawerStartDate);
                    setEndDate(drawerEndDate);
                    closeFilterDrawer();
                  }}
                  style={{
                    padding: "8px 24px", fontSize: "13.5px", fontWeight: 600,
                    color: t.accentText, backgroundColor: t.primary,
                    border: "none", borderRadius: "6px", cursor: "pointer",
                    transition: "background-color 0.15s ease",
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

      <style>{`
        .ps-dark input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}