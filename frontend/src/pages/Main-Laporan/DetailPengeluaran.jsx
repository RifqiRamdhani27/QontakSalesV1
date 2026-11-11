import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function DetailPengeluaran() {
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
      label: "#e2e8f0", value: "#f1f5f9", link: "#94a3b8", linkHover: "#E5B85C",
      panel: "#1a1a1a", panelBorder: "#634f27", headBorder: "#3a3326",
      line: "#634f27", icon: "#E5B85C", iconMuted: "#94a3b8",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)", tableShadow: "0 2px 15px -6px rgba(241, 133, 10, 0.86)",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#111827", muted: "#6b7280", faint: "#cbd5e1",
      label: "#334155", value: "#0f172a", link: "#64748b", linkHover: "#1e293b",
      panel: "#ffffff", panelBorder: "#e2e8f0", headBorder: "rgba(226,232,240,0.9)",
      line: "#cbd5e1", icon: "#475569", iconMuted: "#94a3b8",
      primary: "#20667d", primaryHover: "#1a5568", primaryText: "#ffffff",
      ddBg: "#ffffff", ddBorder: "#d4d4d8", ddText: "#1e3a8a", ddHover: "#f1f5f9",
      ddShadow: "0 4px 16px rgba(0,0,0,0.12)", tableShadow: "0 2px 15px -6px rgba(58, 58, 58, 0.86)",
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

  // Start Date Picker State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("20/09/2026");

  // End Date Picker State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("20/09/2026");

  // Filter sesuai periode
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Ekspor Dropdown
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    borderRadius: "4px",
    boxShadow: t.ddShadow,
    padding: "4px 0",
  };

  const mainLabelStyle = { fontSize: "12px", fontWeight: 600, color: t.label, marginBottom: "4px" };
  const lineBox = { display: "flex", alignItems: "center", borderBottom: `1px solid ${t.line}`, paddingBottom: "2px", position: "relative" };
  const dateInputStyle = {
    border: "none", outline: "none", fontSize: "12px", fontWeight: 700, color: t.value,
    backgroundColor: "transparent", width: "100%", cursor: "pointer", padding: 0,
  };
  const iconBtnStyle = { border: "none", background: "none", color: t.icon, cursor: "pointer", padding: 0, marginLeft: "4px", display: "flex", alignItems: "center" };

  const primaryBtn = {
    height: "36px", backgroundColor: t.primary, color: t.primaryText, fontSize: "12px", fontWeight: 500,
    borderRadius: "4px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease",
  };

  const renderDdItem = (label, onClick, fontSize = "13.5px", asButton = false) => {
    const common = {
      padding: "8px 16px", fontSize, color: t.ddText, cursor: "pointer", transition: "background-color 0.15s ease",
    };
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

  const renderCalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
    </svg>
  );

  return (
    <div
      style={{
        margin: "-24px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: t.pageBg,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Top Header */}
      <header style={{ backgroundColor: t.panel, borderBottom: `1px solid ${t.panelBorder}` }}>
        {/* Page Title */}
        <div style={{ padding: "20px 32px 20px 32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.025em", color: t.title, margin: 0 }}>
            Rincian Biaya <span style={{ fontWeight: 400, color: t.muted, fontSize: "18px", marginLeft: "2px" }}>(dalam IDR)</span>
          </h1>
        </div>

        {/* Filter Toolbar */}
        <div style={{ padding: "4px 32px 20px 32px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          {/* Left Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "20px" }}>
            {/* Tanggal Mulai */}
            <div style={{ display: "flex", flexDirection: "column", width: "160px", position: "relative" }} ref={startDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal Mulai</label>
              <div style={lineBox}>
                <input readOnly type="text" value={startDateStr} onClick={() => setShowStartCalendar(!showStartCalendar)} style={dateInputStyle} />
                <button type="button" onClick={() => setShowStartCalendar(!showStartCalendar)} aria-label="Pilih Tanggal Mulai" style={iconBtnStyle}>
                  {renderCalIcon()}
                </button>
                {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
              </div>
            </div>

            {/* Tanggal Selesai */}
            <div style={{ display: "flex", flexDirection: "column", width: "160px", position: "relative" }} ref={endDatePickerRef}>
              <label style={mainLabelStyle}>Tanggal Selesai</label>
              <div style={lineBox}>
                <input readOnly type="text" value={endDateStr} onClick={() => setShowEndCalendar(!showEndCalendar)} style={dateInputStyle} />
                <button type="button" onClick={() => setShowEndCalendar(!showEndCalendar)} aria-label="Pilih Tanggal Selesai" style={iconBtnStyle}>
                  {renderCalIcon()}
                </button>
                {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
              </div>
            </div>

            {/* Filter sesuai periode */}
            <div style={{ display: "flex", flexDirection: "column", width: "160px" }} ref={mainPeriodRef}>
              <label style={mainLabelStyle}>Filter sesuai periode</label>
              <div style={lineBox}>
                <span
                  onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                  style={{ fontSize: "12px", fontWeight: 700, color: t.value, width: "100%", cursor: "pointer", userSelect: "none" }}
                >
                  {periodePreset || "Hari ini"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                  aria-label="Buka Opsi Periode"
                  style={{ ...iconBtnStyle, color: t.iconMuted }}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {showMainPeriodDropdown && (
                  <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", left: 0, width: "180px", maxHeight: "220px", overflowY: "auto", zIndex: 1000 }}>
                    {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) =>
                      renderDdItem(item, () => { setPeriodePreset(item); handleQuickPeriodSelect(item); setShowMainPeriodDropdown(false); })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Button */}
            <div style={{ display: "flex", alignItems: "flex-end", paddingLeft: "8px" }}>
              <button type="button" style={{ ...primaryBtn, padding: "0 24px", justifyContent: "center" }} {...hoverBg(t.primary, t.primaryHover)}>
                Filter
              </button>
            </div>
          </div>

          {/* Right Export Button */}
          <div style={{ display: "flex", alignItems: "flex-end", position: "relative" }} ref={eksporDropdownRef}>
            <button
              type="button"
              onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{ ...primaryBtn, padding: "0 14px", gap: "6px" }}
              {...hoverBg(t.primary, t.primaryHover)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-3.5 3.5M12 4l3.5 3.5" />
              </svg>
              <span>Ekspor</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
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
      </header>

      {/* Main Content */}
      <main style={{ padding: "24px 32px", flex: 1 }}>
        <div
          style={{
            backgroundColor: t.panel,
            borderRadius: 0,
            border: `1px solid ${t.panelBorder}`,
            minHeight: "460px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: t.tableShadow,
          }}
        >
          {/* Table Header Bar */}
          <div style={{ backgroundColor: t.panel, borderBottom: `1px solid ${t.headBorder}`, padding: "12px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", fontSize: "12px", letterSpacing: "0.05em", color: t.faint, fontWeight: 500,  }}>
              <div style={{ gridColumn: "span 3" }}>Kategori / Tanggal</div>
              <div style={{ gridColumn: "span 3" }}>Transaksi</div>
              <div style={{ gridColumn: "span 2" }}>Nomor</div>
              <div style={{ gridColumn: "span 2" }}>Keterangan</div>
              <div style={{ gridColumn: "span 2", textAlign: "right" }}>Jumlah</div>
            </div>
          </div>

          {/* Empty State Body */}
          <section
            aria-label="Pemberitahuan Transaksi Kosong"
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 16px", textAlign: "center" }}
          >
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: t.title, marginBottom: "24px" }}>
              Anda belum memiliki transaksi biaya.
            </h2>
            <button
              type="button"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 16px",
                backgroundColor: t.primary, color: t.primaryText, fontSize: "12px", fontWeight: 600,
                borderRadius: "4px", border: "none", cursor: "pointer", transition: "background-color 0.15s ease",
                marginBottom: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
              {...hoverBg(t.primary, t.primaryHover)}
            >
              <span style={{ marginRight: "6px", fontWeight: 700, fontSize: "14px", lineHeight: 1 }}>+</span> Buat Biaya
            </button>
            <p style={{ fontSize: "12px", color: t.link, margin: "0 0 16px 0" }}>
              atau
            </p>
            <a
              href="#sample"
              style={{ fontSize: "12px", color: t.link, textDecoration: "none", transition: "color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.linkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.link)}
            >
              Lihat Sample
            </a>
          </section>

          {/* Bottom Spacer */}
          <div style={{ height: "24px" }} />
        </div>
      </main>
    </div>
  );
}