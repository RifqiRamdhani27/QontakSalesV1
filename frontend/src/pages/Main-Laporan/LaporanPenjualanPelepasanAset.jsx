import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function LaporanPenjualanPelepasanAset() {
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
      panel: "#1a1a1a", panelBorder: "#634f27",
      field: "#262626", fieldBorder: "#634f27", fieldText: "#f1f5f9",
      icon: "#E5B85C", iconMuted: "#94a3b8",
      primary: "#E5B85C", primaryHover: "#f0c978", primaryText: "#121212",
      btnBg: "#262626", btnHover: "#2d2d2d", btnBorder: "#634f27", btnText: "#E5B85C",
      ddBg: "#1e1e1e", ddBorder: "#634f27", ddText: "#f1f5f9", ddHover: "#2d2d2d",
      ddSel: "rgba(229,184,92,0.2)", ddShadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      tableHeadBg: "#262626", tableHeadText: "#E5B85C", emptyText: "#cbd5e1",
    }
    : {
      pageBg: "#ffffff", text: "#1e293b", title: "#1e293b", muted: "#64748b", label: "#1e293b",
      panel: "#ffffff", panelBorder: "#e2e8f0",
      field: "#ffffff", fieldBorder: "#cbd5e1", fieldText: "#334155",
      icon: "#94a3b8", iconMuted: "#64748b",
      primary: "#2563eb", primaryHover: "#1d4fd8", primaryText: "#ffffff",
      btnBg: "#ffffff", btnHover: "#f8fafc", btnBorder: "#cbd5e1", btnText: "#334155",
      ddBg: "#ffffff", ddBorder: "#e2e8f0", ddText: "#334155", ddHover: "#f1f5f9",
      ddSel: "#f1f5f9", ddShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      tableHeadBg: "#5bc4e0", tableHeadText: "#ffffff", emptyText: "#334155",
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
      nav: "#64748b", accent: "#2563eb", weekday: "#94a3b8",
      selBg: "#2563eb", selText: "#ffffff", todayBg: "#e0e7ff", todayText: "#2563eb",
      dayText: "#334155", monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
    };

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

  // Tanggal Awal
  const startDatePickerRef = useRef(null);
  const [startDate, setStartDate] = useState(() => new Date(2026, 8, 22));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("22/09/2026");

  // Tanggal Akhir
  const endDatePickerRef = useRef(null);
  const [endDate, setEndDate] = useState(() => new Date(2026, 8, 22));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("22/09/2026");

  // Export Dropdown
  const eksporRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  useEffect(() => { setStartDateStr(formatDateDDMMYYYY(startDate)); }, [startDate]);
  useEffect(() => { setEndDateStr(formatDateDDMMYYYY(endDate)); }, [endDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (eksporRef.current && !eksporRef.current.contains(event.target)) setShowEksporDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // // Calendar
  const renderCalendarPopup = (
    selDate,
    setSelDate,
    viewDate,
    setViewDate,
    viewMode,
    setViewMode,
    rangeStart,
    setRangeStart,
    closeCalendar,
    alignRight = false
  ) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const handlePrev = () => {
      if (viewMode === "days") setViewDate(new Date(year, month - 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year - 1, month, 1));
      else setRangeStart(rangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else setRangeStart(rangeStart + 12);
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontSize: "14px", fontWeight: 700, color: c.accent }}>
            {viewMode === "days" && (
              <span onClick={() => setViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]} {year}</span>
            )}
            {viewMode === "months" && (
              <span onClick={() => setViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
            )}
            {viewMode === "years" && <span>{rangeStart} - {rangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={navBtn} {...hoverBg("transparent", c.hoverBg)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textTransform: "uppercase", fontSize: "11px", color: c.weekday, fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>
              <div>Ming</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((dateObj, idx) => {
                if (!dateObj) return <div key={`empty-${idx}`} />;
                const isSelected = selDate && dateObj.toDateString() === selDate.toDateString();
                const isToday = dateObj.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={dateObj.toISOString()}
                    type="button"
                    onClick={() => { setSelDate(dateObj); closeCalendar(); }}
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

        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
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

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }, (_, i) => rangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => { setViewDate(new Date(yNum, month, 1)); setViewMode("months"); }}
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
              setSelDate(today);
              setViewDate(today);
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

  const calendarIcon = () => (
    <svg style={{ width: "16px", height: "16px", color: t.icon }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );

  const chevronIcon = () => (
    <svg style={{ width: "14px", height: "14px", color: isDark ? t.btnText : t.iconMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const tableColumns = ["Aset", "Tanggal Akuisisi", "Tanggal Pelepasan", "Biaya Awal", "Ak.Penyusutan", "Nilai Buku", "Harga Jual", "Untung/(Rugi)"];

  const renderDateInput = (label, dateStr, onClick) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", color: t.label, fontWeight: 500 }}>{label}</label>
      <div
        onClick={onClick}
        style={{
          position: "relative", width: "220px", height: "38px", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 12px", border: `1px solid ${t.fieldBorder}`, borderRadius: "6px",
          cursor: "pointer", backgroundColor: t.field, boxSizing: "border-box"
        }}
      >
        <span style={{ fontSize: "13px", color: t.fieldText }}>{dateStr}</span>
        {calendarIcon()}
      </div>
    </div>
  );

  return (
    <div
      style={{
        margin: "-24px",
        width: "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: t.pageBg,
        color: t.text,
        colorScheme: isDark ? "dark" : "light",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >

      {/* Header */}
      <header style={{ width: "100%", padding: "20px 32px", borderBottom: `1px solid ${t.panelBorder}`, backgroundColor: t.panel, boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 700, color: t.title, margin: 0, letterSpacing: "-0.01em" }}>
          Laporan Penjualan/Pelepasan Aset{" "}
          <span style={{ fontSize: "13px", fontWeight: 400, color: t.muted }}>(dalam IDR)</span>
        </h1>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column", backgroundColor: t.pageBg, boxSizing: "border-box" }}>

        {/* Filter Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
            <div style={{ position: "relative" }} ref={startDatePickerRef}>
              {renderDateInput("Tanggal awal", startDateStr, () => setShowStartCalendar(!showStartCalendar))}
              {showStartCalendar && renderCalendarPopup(startDate, setStartDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
            </div>

            <div style={{ position: "relative" }} ref={endDatePickerRef}>
              {renderDateInput("Tanggal akhir", endDateStr, () => setShowEndCalendar(!showEndCalendar))}
              {showEndCalendar && renderCalendarPopup(endDate, setEndDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false))}
            </div>

            <button
              type="button"
              onClick={() => {}}
              style={{
                height: "38px", padding: "0 24px", backgroundColor: t.primary, color: t.primaryText, fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer",
                transition: "background-color 0.15s ease"
              }}
              {...hoverBg(t.primary, t.primaryHover)}
            >
              Filter
            </button>
          </div>

          {/* Export Dropdown */}
          <div style={{ position: "relative" }} ref={eksporRef}>
            <button
              type="button"
              onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{
                height: "38px", padding: "0 16px", backgroundColor: t.btnBg, color: t.btnText, fontSize: "13px",
                fontWeight: 500, border: `1px solid ${t.btnBorder}`, borderRadius: "6px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "background-color 0.15s ease"
              }}
              {...hoverBg(t.btnBg, t.btnHover)}
            >
              Export
              {chevronIcon()}
            </button>

            {showEksporDropdown && (
              <div style={{ ...ddPanelStyle, position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", borderRadius: "6px" }}>
                {["CSV", "XLSX", "PDF"].map((fmt) =>
                  renderDdItem(fmt, false, () => { setShowEksporDropdown(false); alert(`Mengekspor laporan ke format ${fmt}...`); }, "12px")
                )}
              </div>
            )}
          </div>
        </section>

        {/* Table */}
        <section style={{ backgroundColor: t.panel, borderRadius: "6px", border: `1px solid ${t.panelBorder}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: t.tableHeadBg }}>
                  {tableColumns.map((col, idx) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: t.tableHeadText,
                        whiteSpace: "nowrap",
                        textAlign: idx === 0 || idx === 1 || idx === 2 ? "left" : "right"
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={tableColumns.length} style={{ padding: "40px 16px", textAlign: "center", fontSize: "13px", color: t.emptyText }}>
                    No Data
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}