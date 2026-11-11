import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function PenyelesaianPesananPenjualan() {
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

  // Tanggal Awal State & Popover
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [showStartCalendar, setShowStartCalendar] = useState(false);

  // Tanggal Akhir State & Popover
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // Periode State & Dropdown
  const periodeDropdownRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor & Template & Filter Drawer States
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer Form States
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const drawerPeriodeRef = useRef(null);
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const [drawerMulaiDari, setDrawerMulaiDari] = useState("Pemesanan");
  const drawerMulaiDariRef = useRef(null);
  const [showDrawerMulaiDariDropdown, setShowDrawerMulaiDariDropdown] = useState(false);

  const [drawerPelanggan, setDrawerPelanggan] = useState("");
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagOption, setDrawerTagOption] = useState("all"); // "all" | "any"

  // Drawer Date Picker States
  const drawerStartCalRef = useRef(null);
  const drawerEndCalRef = useRef(null);
  const [showDrawerStartCal, setShowDrawerStartCal] = useState(false);
  const [showDrawerEndCal, setShowDrawerEndCal] = useState(false);
  const [drawerStartCalView, setDrawerStartCalView] = useState(() => new Date(2026, 8, 16));
  const [drawerEndCalView, setDrawerEndCalView] = useState(() => new Date(2026, 8, 16));
  const [drawerStartViewMode, setDrawerStartViewMode] = useState("days");
  const [drawerEndViewMode, setDrawerEndViewMode] = useState("days");

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerMulaiDariRef.current && !drawerMulaiDariRef.current.contains(event.target)) setShowDrawerMulaiDariDropdown(false);
      if (drawerStartCalRef.current && !drawerStartCalRef.current.contains(event.target)) setShowDrawerStartCal(false);
      if (drawerEndCalRef.current && !drawerEndCalRef.current.contains(event.target)) setShowDrawerEndCal(false);
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
    setStartSelectedDate(new Date(2026, 8, 16));
    setEndSelectedDate(new Date(2026, 8, 16));
    setFilterPeriode("Hari ini");
    setDrawerPeriode("Hari ini");
    setDrawerMulaiDari("Pemesanan");
    setDrawerPelanggan("");
    setDrawerTag("");
    setDrawerTagOption("all");
  };

  // // Calendar
  const renderCalendarPopover = (
    viewDate, setViewDate, viewMode, setViewMode, selectedDate, onSelectDate, alignRight = false
  ) => (
    <div
      className="pg-pop"
      style={{
        position: "absolute", top: "calc(100% + 6px)",
        ...(alignRight ? { right: 0 } : { left: 0 }),
        zIndex: 10000, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
        padding: "14px 16px", width: "280px", userSelect: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button
          type="button"
          className="pg-nav"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
            else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
          }}
        >
          «
        </button>

        <button
          type="button"
          className="pg-nav"
          style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#0284c7", cursor: "pointer", padding: "4px 8px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewMode("months");
            else if (viewMode === "months") setViewMode("days");
          }}
        >
          {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          {viewMode === "months" && `${viewDate.getFullYear()}`}
        </button>

        <button
          type="button"
          className="pg-nav"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
            else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
          }}
        >
          »
        </button>
      </div>

      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
            <span className="pg-weekday">Min</span><span className="pg-weekday">Sen</span><span className="pg-weekday">Sel</span><span className="pg-weekday">Rab</span><span className="pg-weekday">Kam</span><span className="pg-weekday">Jum</span><span className="pg-weekday">Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
              const isSelected = selectedDate && d.day === selectedDate.getDate() && d.month === selectedDate.getMonth() && d.year === selectedDate.getFullYear();
              return (
                <button
                  key={idx}
                  type="button"
                  className={`pg-cell ${isSelected ? "pg-selected" : ""} ${d.isCurrentMonth ? "" : "pg-outside"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDate(new Date(d.year, d.month, d.day));
                  }}
                  style={{
                    padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer",
                    backgroundColor: isSelected ? "#0284c7" : "transparent",
                    color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </>
      )}

      {viewMode === "months" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {MONTH_NAMES.map((mName, idx) => (
            <button
              key={mName}
              type="button"
              className={`pg-cell ${viewDate.getMonth() === idx ? "pg-selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                setViewMode("days");
              }}
              style={{
                padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                backgroundColor: viewDate.getMonth() === idx ? "#0284c7" : "#f8fafc",
                color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b",
                fontWeight: viewDate.getMonth() === idx ? "bold" : "normal",
              }}
            >
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}

      <div className="pg-divider" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
        <button
          type="button"
          className="pg-nav"
          onClick={(e) => {
            e.stopPropagation();
            const today = new Date();
            onSelectDate(today);
            setViewDate(today);
          }}
          style={{
            background: "none", border: "none", fontSize: "13px", fontWeight: 600,
            color: "#0284c7", cursor: "pointer", padding: "4px 8px", borderRadius: "4px",
          }}
        >
          Hari ini
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`pg-root ${isDark ? "pg-dark" : ""}`}
      style={{
        margin: isFullscreen ? 0 : "-24px",
        width: isFullscreen ? "100%" : "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#0f172a",
        boxSizing: "border-box",
      }}
    >
      <main className="pg-main" style={{ width: "100%", backgroundColor: "#ffffff", paddingBottom: "64px" }}>
        {/* Header Section */}
        <header style={{ padding: "24px 32px 20px 32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <h1 className="pg-title" style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>
              Penyelesaian Pemesanan Penjualan
            </h1>
            <span className="pg-muted" style={{ fontSize: "14px", fontWeight: 400, color: "#64748b" }}>
              (dalam IDR)
            </span>
          </div>
        </header>

        {/* Filter and Actions Bar */}
        <section
          aria-label="Filter dan Operasi Laporan"
          style={{
            padding: "0 32px 32px 32px", display: "flex", flexWrap: "wrap",
            alignItems: "flex-end", justifyContent: "space-between", gap: "16px",
          }}
        >
          {/* Left Controls: Date Filters & Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>

            {/* Tanggal Awal Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
              <label className="pg-label" style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                Tanggal awal
              </label>
              <div style={{ position: "relative", width: "172px" }}>
                <div
                  className="pg-field"
                  onClick={() => {
                    setShowStartCalendar(!showStartCalendar);
                    setShowEndCalendar(false);
                    setShowPeriodeDropdown(false);
                  }}
                  style={{
                    width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "36px",
                    fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex",
                    alignItems: "center", cursor: "pointer", userSelect: "none", boxSizing: "border-box",
                  }}
                >
                  {formatDateDDMMYYYY(startSelectedDate)}
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#64748b" }}>
                  <svg className="pg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>

                {showStartCalendar && renderCalendarPopover(
                  startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode,
                  startSelectedDate, (date) => { setStartSelectedDate(date); setShowStartCalendar(false); }
                )}
              </div>
            </div>

            {/* Tanggal Akhir Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
              <label className="pg-label" style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                Tanggal akhir
              </label>
              <div style={{ position: "relative", width: "172px" }}>
                <div
                  className="pg-field"
                  onClick={() => {
                    setShowEndCalendar(!showEndCalendar);
                    setShowStartCalendar(false);
                    setShowPeriodeDropdown(false);
                  }}
                  style={{
                    width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "36px",
                    fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex",
                    alignItems: "center", cursor: "pointer", userSelect: "none", boxSizing: "border-box",
                  }}
                >
                  {formatDateDDMMYYYY(endSelectedDate)}
                </div>
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#64748b" }}>
                  <svg className="pg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>

                {showEndCalendar && renderCalendarPopover(
                  endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode,
                  endSelectedDate, (date) => { setEndSelectedDate(date); setShowEndCalendar(false); }, true
                )}
              </div>
            </div>

            {/* Periode Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={periodeDropdownRef}>
              <label className="pg-label" style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                Periode
              </label>
              <div style={{ position: "relative", width: "172px" }}>
                <div
                  className="pg-field"
                  onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                  style={{
                    width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "32px",
                    fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex",
                    alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none", boxSizing: "border-box",
                  }}
                >
                  <span className="pg-field-text">{filterPeriode}</span>
                  <svg className="pg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {showPeriodeDropdown && (
                  <div className="pg-dd" style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto",
                  }}>
                    {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini", "Custom"].map((opt) => (
                      <div
                        key={opt}
                        className={`pg-dd-item ${filterPeriode === opt ? "pg-active" : ""}`}
                        onClick={() => { setFilterPeriode(opt); setShowPeriodeDropdown(false); }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: filterPeriode === opt ? "#4361ee" : "#1e293b",
                          fontWeight: filterPeriode === opt ? 600 : 400,
                          backgroundColor: filterPeriode === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer", transition: "background-color 0.15s ease",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Filter */}
            <div>
              <button
                type="button"
                className="pg-btn-primary"
                style={{
                  height: "38px", padding: "0 20px", backgroundColor: "#4361ee", color: "#ffffff",
                  fontSize: "13.5px", fontWeight: 500, border: "none", borderRadius: "6px",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  transition: "background-color 0.15s ease", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                Filter
              </button>
            </div>

            {/* Tombol Filter Lainnya */}
            <div>
              <button
                type="button"
                className="pg-btn-outline"
                onClick={openFilterDrawer}
                style={{
                  height: "38px", padding: "0 14px", backgroundColor: "#ffffff",
                  border: "1px solid #4361ee", color: "#4361ee", fontSize: "13.5px",
                  fontWeight: 500, borderRadius: "6px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.15s ease",
                }}
              >
                <svg className="pg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter lainnya</span>
              </button>
            </div>
          </div>

          {/* Right Utility Controls: Template & Ekspor */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Tombol Template */}
            <button
              type="button"
              className="pg-btn-outline pg-btn-neutral"
              style={{
                height: "38px", padding: "0 14px", backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1", color: "#4361ee", fontSize: "13.5px",
                fontWeight: 500, borderRadius: "6px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.15s ease",
              }}
            >
              <svg className="pg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Template</span>
            </button>

            {/* Tombol Ekspor */}
            <div style={{ position: "relative" }} ref={eksporDropdownRef}>
              <button
                type="button"
                className="pg-btn-outline pg-btn-neutral"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "38px", padding: "0 16px", backgroundColor: "#ffffff",
                  border: "1px solid #c9d2de", color: "#4361ee", fontSize: "14px",
                  fontWeight: 500, borderRadius: "6px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>Ekspor</span>
                <svg className="pg-icon-fill" width="12" height="12" viewBox="0 0 12 12" fill="#4361ee">
                  <path d="M2 4.5h8L6 9z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div className="pg-dd" style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 1000,
                  backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", width: "140px", padding: "4px 0",
                }}>
                  {["PDF", "Excel", "CSV"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="pg-dd-item"
                      onClick={() => setShowEksporDropdown(false)}
                      style={{
                        width: "100%", padding: "8px 14px", textAlign: "left", fontSize: "13px",
                        color: "#1e293b", backgroundColor: "transparent", border: "none", cursor: "pointer",
                      }}
                    >
                      Ekspor {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Empty State Section */}
        <section
          aria-label="Status Kosong Laporan"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            paddingTop: "32px", paddingBottom: "64px",
          }}
        >
          <div className="pg-illu" style={{ position: "relative", width: "260px", height: "190px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
            <svg style={{ width: "100%", height: "100%", overflow: "visible" }} fill="none" viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg">
              {/* Isometric Base / Pedestal */}
              <g opacity="0.95">
                <ellipse cx="160" cy="192" fill="#cbd5e1" opacity="0.3" rx="90" ry="24" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="#e2e8f0" />
                <path d="M72 178 L160 208 L160 216 L72 186 Z" fill="#cbd5e1" />
                <path d="M160 208 L248 178 L248 186 L160 216 Z" fill="#94a3b8" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="url(#pedestal-gradient-pengiriman)" />
              </g>

              {/* Left Donut Chart Ring */}
              <g transform="translate(68, 55)">
                <ellipse cx="42" cy="65" fill="#fda4af" opacity="0.4" rx="38" ry="18" />
                <path d="M8 44 C8 24 23 8 42 8 C61 8 76 24 76 44 L76 54 C76 74 61 90 42 90 C23 90 8 74 8 54 Z" fill="url(#pink-donut-depth-pengiriman)" />
                <ellipse cx="42" cy="44" fill="url(#pink-donut-face-pengiriman)" rx="34" ry="34" />
                <ellipse cx="42" cy="44" fill="#ffffff" rx="14" ry="14" />
                <path d="M42 10 A34 34 0 0 1 76 44 L62 44 A20 20 0 0 0 42 24 Z" fill="#fb7185" />
                <path d="M18 55 A34 34 0 0 1 42 10 L42 24 A20 20 0 0 0 28 50 Z" fill="#f43f5e" opacity="0.9" />
              </g>

              {/* Bar Charts Group */}
              <g transform="translate(136, 118)">
                <path d="M0 24 L14 19 L28 24 L28 65 L14 70 L0 65 Z" fill="#e2e8f0" />
                <path d="M14 19 L28 24 L28 65 L14 70 Z" fill="#cbd5e1" />
                <path d="M0 24 L14 19 L28 24 L14 29 Z" fill="#f8fafc" />
              </g>

              {/* Bar 2: Purple Column */}
              <g transform="translate(148, 90)">
                <path d="M0 20 L16 14 L32 20 L32 75 L16 81 L0 75 Z" fill="#818cf8" />
                <path d="M16 14 L32 20 L32 75 L16 81 Z" fill="#6366f1" />
                <path d="M0 20 L16 14 L32 20 L16 26 Z" fill="#a5b4fc" />
              </g>

              {/* Bar 3: Tall Slate Column Behind */}
              <g transform="translate(164, 68)">
                <path d="M0 24 L16 17 L32 24 L32 95 L16 102 L0 95 Z" fill="#cbd5e1" />
                <path d="M16 17 L32 24 L32 95 L16 102 Z" fill="#94a3b8" />
                <path d="M0 24 L16 17 L32 24 L16 31 Z" fill="#f1f5f9" />
              </g>

              {/* Ascending 3D Growth Trend Arrow */}
              <g transform="translate(148, 92)">
                <path d="M-8 48 C6 44 14 36 28 20 C34 14 38 4 48 -6" fill="none" stroke="url(#trend-arrow-stroke-pengiriman)" strokeLinecap="round" strokeWidth="9" />
                <polygon fill="#db2777" points="46,-16 57,-4 42,0" />
                <polygon fill="#f43f5e" points="46,-16 57,-4 52,-14" />
              </g>

              {/* Right Donut Chart Ring */}
              <g transform="translate(216, 92)">
                <ellipse cx="30" cy="50" fill="#cbd5e1" opacity="0.3" rx="28" ry="14" />
                <path d="M6 32 C6 18 17 6 30 6 C43 6 54 18 54 39 Z" fill="url(#pink-donut-depth-small-pengiriman)" />
                <ellipse cx="30" cy="32" fill="url(#pink-donut-face-pengiriman)" rx="24" ry="24" />
                <ellipse cx="30" cy="32" fill="#ffffff" rx="10" ry="10" />
                <path d="M30 8 A24 24 0 0 1 54 32 L44 32 A14 14 0 0 0 30 18 Z" fill="#fb7185" />
              </g>

              {/* Gradients Definitions */}
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="pedestal-gradient-pengiriman" x1="72" x2="248" y1="148" y2="208">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#f8fafc" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-face-pengiriman" x1="8" x2="76" y1="8" y2="76">
                  <stop stopColor="#fda4af" />
                  <stop offset="1" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-pengiriman" x1="8" x2="76" y1="8" y2="90">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#be123c" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-small-pengiriman" x1="6" x2="54" y1="6" y2="65">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#9f1239" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="trend-arrow-stroke-pengiriman" x1="-8" x2="48" y1="48" y2="-6">
                  <stop stopColor="#e11d48" />
                  <stop offset="0.6" stopColor="#db2777" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <h2 className="pg-title" style={{ fontSize: "15.5px", fontWeight: 700, color: "#1e293b", margin: "0 0 4px 0" }}>
              Laporan akan muncul di sini
            </h2>
            <p className="pg-muted" style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Pilih tanggal atau periode, lalu klik tombol <strong className="pg-title" style={{ fontWeight: 700, color: "#1e293b" }}>Filter</strong>.
            </p>
          </div>
        </section>
      </main>

      {/* Filter Lainnya Right Drawer */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
          <div
            className="pg-overlay"
            onClick={closeFilterDrawer}
            style={{
              position: "absolute", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.3)",
              transition: "opacity 280ms ease-in-out", opacity: drawerOpen ? 1 : 0,
            }}
          />
          <aside
            className="pg-drawer"
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "380px", maxWidth: "90vw",
              backgroundColor: "#ffffff", boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
              display: "flex", flexDirection: "column", zIndex: 9999,
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {/* Drawer Header */}
            <div className="pg-drawer-bar" style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 className="pg-title" style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter laporan</h2>
              <button type="button" className="pg-btn-ghost" onClick={closeFilterDrawer} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal Awal & Akhir */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                  {/* Tanggal awal */}
                  <div style={{ flex: 1, position: "relative" }} ref={drawerStartCalRef}>
                    <label className="pg-label" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                      Tanggal awal
                    </label>
                    <div
                      className="pg-field"
                      onClick={() => {
                        setShowDrawerStartCal(!showDrawerStartCal);
                        setShowDrawerEndCal(false);
                      }}
                      style={{
                        height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                        borderRadius: "6px", padding: "0 10px", display: "flex", alignItems: "center",
                        justifyContent: "space-between", cursor: "pointer", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                      }}
                    >
                      <span className="pg-field-text" style={{ fontSize: "13px", color: "#101828" }}>{formatDateDDMMYYYY(startSelectedDate)}</span>
                      <svg className="pg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>

                    {showDrawerStartCal && renderCalendarPopover(
                      drawerStartCalView, setDrawerStartCalView, drawerStartViewMode, setDrawerStartViewMode,
                      startSelectedDate, (date) => { setStartSelectedDate(date); setShowDrawerStartCal(false); }
                    )}
                  </div>

                  <span className="pg-muted" style={{ fontSize: "14px", color: "#667085", marginTop: "24px" }}>-</span>

                  {/* Tanggal akhir */}
                  <div style={{ flex: 1, position: "relative" }} ref={drawerEndCalRef}>
                    <label className="pg-label" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                      Tanggal akhir
                    </label>
                    <div
                      className="pg-field"
                      onClick={() => {
                        setShowDrawerEndCal(!showDrawerEndCal);
                        setShowDrawerStartCal(false);
                      }}
                      style={{
                        height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                        borderRadius: "6px", padding: "0 10px", display: "flex", alignItems: "center",
                        justifyContent: "space-between", cursor: "pointer", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                      }}
                    >
                      <span className="pg-field-text" style={{ fontSize: "13px", color: "#101828" }}>{formatDateDDMMYYYY(endSelectedDate)}</span>
                      <svg className="pg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>

                    {showDrawerEndCal && renderCalendarPopover(
                      drawerEndCalView, setDrawerEndCalView, drawerEndViewMode, setDrawerEndViewMode,
                      endSelectedDate, (date) => { setEndSelectedDate(date); setShowDrawerEndCal(false); }, true
                    )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div style={{ position: "relative" }} ref={drawerPeriodeRef}>
                <label className="pg-label" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Periode
                </label>
                <div
                  className="pg-field"
                  onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span className="pg-field-text" style={{ fontSize: "13.5px", color: "#101828" }}>{drawerPeriode}</span>
                  <svg className="pg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerPeriodeDropdown && (
                  <div className="pg-dd" style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto"
                  }}>
                    {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini", "Custom"].map((opt) => (
                      <div
                        key={opt}
                        className={`pg-dd-item ${drawerPeriode === opt ? "pg-active" : ""}`}
                        onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerPeriode === opt ? "#4361ee" : "#1e293b",
                          fontWeight: drawerPeriode === opt ? 600 : 400,
                          backgroundColor: drawerPeriode === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mulai dari */}
              <div style={{ position: "relative" }} ref={drawerMulaiDariRef}>
                <label className="pg-label" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Mulai dari
                </label>
                <div
                  className="pg-field"
                  onClick={() => setShowDrawerMulaiDariDropdown(!showDrawerMulaiDariDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span className="pg-field-text" style={{ fontSize: "13.5px", color: "#101828" }}>{drawerMulaiDari}</span>
                  <svg className="pg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerMulaiDariDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerMulaiDariDropdown && (
                  <div className="pg-dd" style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto"
                  }}>
                    {["Pemesanan", "Penawaran", "Faktur"].map((opt) => (
                      <div
                        key={opt}
                        className={`pg-dd-item ${drawerMulaiDari === opt ? "pg-active" : ""}`}
                        onClick={() => { setDrawerMulaiDari(opt); setShowDrawerMulaiDariDropdown(false); }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerMulaiDari === opt ? "#4361ee" : "#1e293b",
                          fontWeight: drawerMulaiDari === opt ? 600 : 400,
                          backgroundColor: drawerMulaiDari === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pelanggan */}
              <div>
                <label className="pg-label" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Pelanggan
                </label>
                <input
                  type="text"
                  className="pg-input"
                  placeholder="Pilih semua"
                  value={drawerPelanggan}
                  onChange={(e) => setDrawerPelanggan(e.target.value)}
                  style={{
                    width: "100%", height: "38px", border: "1px solid #d0d5dd", borderRadius: "6px",
                    padding: "0 12px", fontSize: "13.5px", color: "#101828", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Grup dengan tag */}
              <div>
                <label className="pg-label" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Grup dengan tag
                </label>
                <input
                  type="text"
                  className="pg-input"
                  placeholder="Pilih tag"
                  value={drawerTag}
                  onChange={(e) => setDrawerTag(e.target.value)}
                  style={{
                    width: "100%", height: "38px", border: "1px solid #d0d5dd", borderRadius: "6px",
                    padding: "0 12px", fontSize: "13.5px", color: "#101828", outline: "none", boxSizing: "border-box",
                    marginBottom: "10px"
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <label className="pg-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#344054", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "all"}
                      onChange={() => setDrawerTagOption("all")}
                      style={{ accentColor: "#4361ee" }}
                    />
                    Mencakup semua
                  </label>
                  <label className="pg-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#344054", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "any"}
                      onChange={() => setDrawerTagOption("any")}
                      style={{ accentColor: "#4361ee" }}
                    />
                    Salah satu
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pg-drawer-bar" style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                className="pg-link"
                onClick={handleResetDrawer}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", userSelect: "none" }}
              >
                <svg className="pg-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span className="pg-link" style={{ fontSize: "13.5px", fontWeight: 600, color: "#4361ee", textDecoration: "underline" }}>
                  Reset filter
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  className="pg-btn-ghost"
                  onClick={closeFilterDrawer}
                  style={{
                    background: "none", border: "none", fontSize: "13.5px", fontWeight: 600, color: "#475569", cursor: "pointer", padding: "8px 12px"
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  className="pg-btn-primary"
                  onClick={closeFilterDrawer}
                  style={{
                    height: "38px", padding: "0 22px", backgroundColor: "#4361ee", border: "none",
                    borderRadius: "6px", fontSize: "13.5px", fontWeight: 600, color: "#ffffff", cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  Filter
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style>{`
  /* ===== LIGHT: hanya hover (warna dasar tetap dari inline) ===== */
  .pg-btn-primary { transition: background-color .15s ease; }
  .pg-btn-primary:hover { background-color: #3852cf !important; }
  .pg-btn-outline { transition: background-color .15s ease, border-color .15s ease; }
  .pg-btn-outline:hover { background-color: #f8fafc !important; }
  .pg-dd-item:hover { background-color: #f8fafc !important; }
  .pg-cell:not(.pg-selected):hover { background-color: #f1f5f9 !important; }

  /* ===== DARK ===== */
  .pg-dark.pg-root { background-color: #121212 !important; color: #f1f5f9 !important; color-scheme: dark; }
  .pg-dark .pg-main { background-color: #121212 !important; }
  .pg-dark .pg-title { color: #ffffff !important; }
  .pg-dark .pg-muted { color: #94a3b8 !important; }
  .pg-dark .pg-label { color: #cbd5e1 !important; }
  .pg-dark input[type="radio"] { accent-color: #E5B85C !important; }

  /* Field (kotak tanggal / dropdown) */
  .pg-dark .pg-field { background-color: #262626 !important; border-color: #634f27 !important; }
  .pg-dark .pg-field-text { color: #f1f5f9 !important; }
  .pg-dark .pg-field { color: #f1f5f9 !important; }
  .pg-dark .pg-icon { stroke: #cbd5e1 !important; }
  .pg-dark .pg-icon-fill { fill: #E5B85C !important; }

  /* Input */
  .pg-dark .pg-input { background-color: #262626 !important; color: #f1f5f9 !important; border-color: #634f27 !important; }
  .pg-dark .pg-input::placeholder { color: #94a3b8; }
  .pg-dark .pg-input:focus { border-color: #E5B85C !important; }

  /* Tombol: background + teks + border satu paket */
  .pg-dark .pg-btn-primary { background-color: #E5B85C !important; color: #121212 !important; border-color: #E5B85C !important; }
  .pg-dark .pg-btn-primary:hover { background-color: #f0c978 !important; color: #121212 !important; }
  .pg-dark .pg-btn-outline { background-color: transparent !important; color: #E5B85C !important; border-color: #E5B85C !important; }
  .pg-dark .pg-btn-outline:hover { background-color: rgba(229,184,92,.15) !important; color: #E5B85C !important; border-color: #E5B85C !important; }
  .pg-dark .pg-btn-outline .pg-icon { stroke: #E5B85C !important; }
  .pg-dark .pg-btn-ghost { color: #cbd5e1 !important; }
  .pg-dark .pg-link { color: #E5B85C !important; }
  .pg-dark .pg-link .pg-icon { stroke: #E5B85C !important; }

  /* Dropdown */
  .pg-dark .pg-dd { background-color: #1e1e1e !important; border-color: #634f27 !important; }
  .pg-dark .pg-dd-item { background-color: transparent !important; color: #f1f5f9 !important; }
  .pg-dark .pg-dd-item:hover { background-color: #2d2d2d !important; }
  .pg-dark .pg-dd-item.pg-active { background-color: rgba(229,184,92,.2) !important; color: #E5B85C !important; }

  /* Kalender */
  .pg-dark .pg-pop { background-color: #1e1e1e !important; border-color: #634f27 !important; }
  .pg-dark .pg-weekday { color: #94a3b8 !important; }
  .pg-dark .pg-nav { background-color: transparent !important; color: #E5B85C !important; }
  .pg-dark .pg-cell { background-color: transparent !important; color: #f1f5f9 !important; }
  .pg-dark .pg-cell.pg-outside { color: #64748b !important; }
  .pg-dark .pg-cell:not(.pg-selected):hover { background-color: #2d2d2d !important; }
  .pg-dark .pg-cell.pg-selected { background-color: #E5B85C !important; color: #121212 !important; }
  .pg-dark .pg-divider { border-color: #634f27 !important; }

  /* Drawer */
  .pg-dark .pg-drawer { background-color: #1a1a1a !important; }
  .pg-dark .pg-drawer-bar { background-color: #242424 !important; border-color: #634f27 !important; }
  .pg-dark .pg-overlay { background-color: rgba(0,0,0,.7) !important; }

  /* Ilustrasi: redupkan supaya tidak terlalu silau */
  .pg-dark .pg-illu { filter: brightness(.8) saturate(.9); }
`}</style>
    </div>
  );
}