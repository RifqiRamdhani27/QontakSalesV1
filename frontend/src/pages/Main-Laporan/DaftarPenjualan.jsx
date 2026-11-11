import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function DaftarPenjualan() {
  const outletContext = useOutletContext();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

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
  const illu = isDark
    ? {
      sheetBg: "linear-gradient(135deg, #2b2b2b 0%, #1f1f1f 50%, #161616 100%)",
      sheetShadow: "0 12px 32px -6px rgba(229,184,92,0.28), inset 0 0 0 1px rgba(229,184,92,0.25)",
      foldBg: "linear-gradient(225deg, rgba(229,184,92,0.35) 0%, transparent 100%)",
      ringBg: "linear-gradient(180deg, #4a4130 0%, #2a2418 50%, #17140d 100%)",
      ringShadow: "0 14px 34px -4px rgba(229,184,92,0.38), inset 0 0 0 1px rgba(229,184,92,0.5)",
      lensBg: "linear-gradient(180deg, rgba(229,184,92,0.18) 0%, rgba(229,184,92,0.05) 100%)",
      lensRing: "inset 0 0 0 1px rgba(229,184,92,0.25)",
      glare: "rgba(255,255,255,0.16)",
      handleBg: "linear-gradient(180deg, #f0c978 0%, #E5B85C 50%, #b8862b 100%)",
      handleShadow: "0 4px 12px rgba(229,184,92,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
      xShadow: "0 5px 18px rgba(244,63,94,0.55), inset 0 0 0 1px rgba(255,255,255,0.35)",
    }
    : {
      sheetBg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
      sheetShadow: "0 12px 28px -6px rgba(148, 163, 184, 0.45), inset 0 0 0 1px rgba(255,255,255,0.8)",
      foldBg: "linear-gradient(225deg, rgba(255, 255, 255, 0.9) 0%, transparent 100%)",
      ringBg: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      ringShadow: "0 14px 28px -4px rgba(99, 102, 241, 0.22), inset 0 0 0 1px #ffffff",
      lensBg: "linear-gradient(180deg, rgba(240, 244, 255, 0.8) 0%, rgba(219, 234, 254, 0.7) 100%)",
      lensRing: "inset 0 0 0 1px rgba(255,255,255,0.6)",
      glare: "rgba(255, 255, 255, 0.6)",
      handleBg: "linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)",
      handleShadow: "0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)",
      xShadow: "0 5px 12px rgba(244, 63, 94, 0.4), inset 0 0 0 1px rgba(255,255,255,0.5)",
    };

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

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Penagihan Penjualan");
  const drawerTipeRef = useRef(null);
  const [showDrawerTipeDropdown, setShowDrawerTipeDropdown] = useState(false);

  const [drawerTglBerdasarkan, setDrawerTglBerdasarkan] = useState("Tgl. transaksi");
  const drawerTglBerdasarkanRef = useRef(null);
  const [showDrawerTglBerdasarkanDropdown, setShowDrawerTglBerdasarkanDropdown] = useState(false);

  const [drawerPelangganType, setDrawerPelangganType] = useState("individual"); // "individual" | "group"
  const [drawerPelanggan, setDrawerPelanggan] = useState("");
  const [drawerStatus, setDrawerStatus] = useState("");
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
      if (drawerTipeRef.current && !drawerTipeRef.current.contains(event.target)) setShowDrawerTipeDropdown(false);
      if (drawerTglBerdasarkanRef.current && !drawerTglBerdasarkanRef.current.contains(event.target)) setShowDrawerTglBerdasarkanDropdown(false);
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
    setDrawerTipeTransaksi("Penagihan Penjualan");
    setDrawerTglBerdasarkan("Tgl. transaksi");
    setDrawerPelangganType("individual");
    setDrawerPelanggan("");
    setDrawerStatus("");
    setDrawerTag("");
    setDrawerTagOption("all");
  };

  // Fungsi Render Kalender Custom (Ditambah Tombol Today)
  const renderCalendarPopover = (
    viewDate, setViewDate, viewMode, setViewMode, selectedDate, onSelectDate, alignRight = false
  ) => (
    <div
      className="dp-pop"
      style={{
        position: "absolute", top: "calc(100% + 6px)",
        ...(alignRight ? { right: 0 } : { left: 0 }),
        zIndex: 1000, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
        padding: "14px 16px", width: "280px", userSelect: "none",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button
          type="button"
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

      {/* Days View */}
      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
              const isSelected = selectedDate && d.day === selectedDate.getDate() && d.month === selectedDate.getMonth() && d.year === selectedDate.getFullYear();
              return (
                <button
                  key={idx}
                  type="button"
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

      {/* Months View */}
      {viewMode === "months" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {MONTH_NAMES.map((mName, idx) => (
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

      {/* Tombol Today */}
      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
        <button
          type="button"
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
      className={isDark ? "dash-dark dp-root" : "dp-root"}
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
      <main style={{ width: "100%", backgroundColor: "#ffffff", paddingBottom: "64px" }}>
        {/* Header Section */}
        <header style={{ padding: "24px 32px 20px 32px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>
              Daftar Penjualan
            </h1>
            <span style={{ fontSize: "14px", fontWeight: 400, color: "#64748b" }}>(dalam IDR)</span>
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
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                Tanggal awal
              </label>
              <div style={{ position: "relative", width: "172px" }}>
                <div
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                Tanggal akhir
              </label>
              <div style={{ position: "relative", width: "172px" }}>
                <div
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                Periode
              </label>
              <div style={{ position: "relative", width: "172px" }}>
                <div
                  onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                  style={{
                    width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "32px",
                    fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex",
                    alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none", boxSizing: "border-box",
                  }}
                >
                  <span>{filterPeriode}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {showPeriodeDropdown && (
                  <div className="dp-dd" style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto",
                  }}>
                    {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini", "Custom"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setFilterPeriode(opt); setShowPeriodeDropdown(false); }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: filterPeriode === opt ? "#4361ee" : "#1e293b",
                          fontWeight: filterPeriode === opt ? 600 : 400,
                          backgroundColor: filterPeriode === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer", transition: "background-color 0.15s ease",
                        }}
                        onMouseEnter={(e) => { if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                        onMouseLeave={(e) => { if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
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
                className="dp-btn"
                style={{
                  height: "38px", padding: "0 20px", backgroundColor: "#4361ee", color: "#ffffff",
                  fontSize: "13.5px", fontWeight: 500, border: "none", borderRadius: "6px",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  transition: "background-color 0.15s ease", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3852cf")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4361ee")}
              >
                Filter
              </button>
            </div>

            {/* Tombol Filter Lainnya */}
            <div>
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  height: "38px", padding: "0 14px", backgroundColor: "#ffffff",
                  border: "1px solid #4361ee", color: "#4361ee", fontSize: "13.5px",
                  fontWeight: 500, borderRadius: "6px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
              style={{
                height: "38px", padding: "0 14px", backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1", color: "#4361ee", fontSize: "13.5px",
                fontWeight: 500, borderRadius: "6px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Template</span>
            </button>

            {/* Tombol Ekspor */}
            <div style={{ position: "relative" }} ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "38px", padding: "0 16px", backgroundColor: "#ffffff",
                  border: "1px solid #c9d2de", color: "#4361ee", fontSize: "14px",
                  fontWeight: 500, borderRadius: "6px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <span>Ekspor</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="#4361ee">
                  <path d="M2 4.5h8L6 9z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div className="dp-dd" style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 1000,
                  backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", width: "140px", padding: "4px 0",
                }}>
                  {["PDF", "Excel", "CSV"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setShowEksporDropdown(false)}
                      style={{
                        width: "100%", padding: "8px 14px", textAlign: "left", fontSize: "13px",
                        color: "#1e293b", backgroundColor: "transparent", border: "none", cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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


          <div style={{ position: "relative", width: "190px", height: "195px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", width: "122px", height: "142px",
              background: illu.sheetBg, borderRadius: "16px", boxShadow: illu.sheetShadow,
              transform: "rotate(-7deg) translateY(4px)",
            }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "24px", height: "24px", background: illu.foldBg, borderTopRightRadius: "16px" }} />
            </div>

            <div style={{ position: "relative", zIndex: 10, transform: "translateX(12px) translateY(-4px)" }}>
              <div style={{
                position: "relative", width: "86px", height: "86px", borderRadius: "50%",
                background: illu.ringBg, padding: "6px", boxShadow: illu.ringShadow,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  background: illu.lensBg, boxShadow: illu.lensRing,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: "-12px", left: "-12px", width: "40px", height: "40px", backgroundColor: illu.glare, borderRadius: "50%", filter: "blur(2px)", transform: "rotate(45deg)" }} />
                  <div style={{
                    position: "relative", zIndex: 10, width: "48px", height: "48px", borderRadius: "50%",
                    background: "linear-gradient(45deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: illu.xShadow,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}>
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                  </div>
                </div>
                <div style={{
                  position: "absolute", bottom: "-24px", right: "-20px", width: "14px", height: "34px",
                  background: illu.handleBg, borderRadius: "9999px", transform: "rotate(-45deg)", boxShadow: illu.handleShadow,
                }} />
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <h2 style={{ fontSize: "15.5px", fontWeight: 700, color: "#1e293b", margin: "0 0 4px 0" }}>
              Laporan akan muncul di sini
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Pilih tanggal atau periode, lalu klik tombol <strong style={{ fontWeight: 700, color: "#1e293b" }}>Filter</strong>.
            </p>
          </div>
        </section>
      </main>

      {/* Filter Lainnya Right Drawer */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "absolute", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.3)",
              transition: "opacity 280ms ease-in-out", opacity: drawerOpen ? 1 : 0,
            }}
          />
          <aside
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
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter laporan</h2>
              <button type="button" onClick={closeFilterDrawer} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex" }}>
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
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                      Tanggal awal
                    </label>
                    <div
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
                      <span style={{ fontSize: "13px", color: "#101828" }}>{formatDateDDMMYYYY(startSelectedDate)}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>

                    {showDrawerStartCal && renderCalendarPopover(
                      drawerStartCalView, setDrawerStartCalView, drawerStartViewMode, setDrawerStartViewMode,
                      startSelectedDate, (date) => { setStartSelectedDate(date); setShowDrawerStartCal(false); }
                    )}
                  </div>

                  <span style={{ fontSize: "14px", color: "#667085", marginTop: "24px" }}>-</span>

                  {/* Tanggal akhir */}
                  <div style={{ flex: 1, position: "relative" }} ref={drawerEndCalRef}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                      Tanggal akhir
                    </label>
                    <div
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
                      <span style={{ fontSize: "13px", color: "#101828" }}>{formatDateDDMMYYYY(endSelectedDate)}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Periode
                </label>
                <div
                  onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#101828" }}>{drawerPeriode}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerPeriodeDropdown && (
                  <div className="dp-dd" style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto"
                  }}>
                    {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini", "Custom"].map((opt) => (
                      <div
                        key={opt}
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

              {/* Tipe transaksi */}
              <div style={{ position: "relative" }} ref={drawerTipeRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Tipe transaksi
                </label>
                <div
                  onClick={() => setShowDrawerTipeDropdown(!showDrawerTipeDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#101828" }}>{drawerTipeTransaksi}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerTipeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerTipeDropdown && (
                  <div className="dp-dd" style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto"
                  }}>
                    {["Semua", "Penagihan Penjualan", "Faktur Penjualan", "Pemesanan Penjualan", "Penawaran Penjualan", "Pengiriman Penjualan", "Pelunasan Piutang", "Retur Penjualan"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setDrawerTipeTransaksi(opt); setShowDrawerTipeDropdown(false); }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerTipeTransaksi === opt ? "#4361ee" : "#1e293b",
                          fontWeight: drawerTipeTransaksi === opt ? 600 : 400,
                          backgroundColor: drawerTipeTransaksi === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tanggal berdasarkan */}
              <div style={{ position: "relative" }} ref={drawerTglBerdasarkanRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Tanggal berdasarkan
                </label>
                <div
                  onClick={() => setShowDrawerTglBerdasarkanDropdown(!showDrawerTglBerdasarkanDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#101828" }}>{drawerTglBerdasarkan}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerTglBerdasarkanDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerTglBerdasarkanDropdown && (
                  <div className="dp-dd" style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0"
                  }}>
                    {["Tgl. transaksi", "Tgl. jatuh tempo"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setDrawerTglBerdasarkan(opt); setShowDrawerTglBerdasarkanDropdown(false); }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerTglBerdasarkan === opt ? "#4361ee" : "#1e293b",
                          fontWeight: drawerTglBerdasarkan === opt ? 600 : 400,
                          backgroundColor: drawerTglBerdasarkan === opt ? "#f1f5f9" : "transparent",
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
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Pelanggan
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#344054", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerPelangganType"
                      checked={drawerPelangganType === "individual"}
                      onChange={() => setDrawerPelangganType("individual")}
                      style={{ accentColor: "#4361ee" }}
                    />
                    Individual
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#344054", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerPelangganType"
                      checked={drawerPelangganType === "group"}
                      onChange={() => setDrawerPelangganType("group")}
                      style={{ accentColor: "#4361ee" }}
                    />
                    Group
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Pilih semua"
                  value={drawerPelanggan}
                  onChange={(e) => setDrawerPelanggan(e.target.value)}
                  style={{
                    width: "100%", height: "38px", border: "1px solid #d0d5dd", borderRadius: "6px",
                    padding: "0 12px", fontSize: "13.5px", color: "#101828", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Status
                </label>
                <input
                  type="text"
                  placeholder="Pilih semua"
                  value={drawerStatus}
                  onChange={(e) => setDrawerStatus(e.target.value)}
                  style={{
                    width: "100%", height: "38px", border: "1px solid #d0d5dd", borderRadius: "6px",
                    padding: "0 12px", fontSize: "13.5px", color: "#101828", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Grup dengan tag */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Grup dengan tag
                </label>
                <input
                  type="text"
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
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#344054", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "all"}
                      onChange={() => setDrawerTagOption("all")}
                      style={{ accentColor: "#4361ee" }}
                    />
                    Mencakup semua
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#344054", cursor: "pointer" }}>
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
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                onClick={handleResetDrawer}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", userSelect: "none" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#4361ee", textDecoration: "underline" }}>
                  Reset filter
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    background: "none", border: "none", fontSize: "13.5px", fontWeight: 600, color: "#475569", cursor: "pointer", padding: "8px 12px"
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  className="dp-btn"
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
  .dash-dark.dp-root { background-color: #121212 !important; color: #f1f5f9 !important; color-scheme: dark; }
  .dash-dark h1, .dash-dark h2 { color: #ffffff !important; }
  .dash-dark label { color: #cbd5e1 !important; }
  .dash-dark input[type="radio"] { accent-color: #E5B85C !important; }
  .dash-dark input[type="text"] { background-color: #262626 !important; color: #f1f5f9 !important; border-color: #634f27 !important; }
  .dash-dark input[type="text"]:focus { border-color: #E5B85C !important; }
  .dash-dark input::placeholder { color: #94a3b8; }

  /* Permukaan */
  .dash-dark [style*="background-color: rgb(255, 255, 255)"] { background-color: #121212 !important; }
  .dash-dark [style*="background-color: rgb(248, 250, 252)"] { background-color: #1a1a1a !important; }
  .dash-dark [style*="background-color: rgb(241, 245, 249)"] { background-color: #2d2d2d !important; }

  /* Border */
  .dash-dark [style*="border: 1px solid"],
  .dash-dark [style*="border-bottom: 1px solid"],
  .dash-dark [style*="border-top: 1px solid"] { border-color: #634f27 !important; }
  .dash-dark [style*="border: 1px solid rgb(67, 97, 238)"] { border-color: #E5B85C !important; }

  /* Teks gelap -> terang */
  .dash-dark [style*="color: rgb(15, 23, 42)"],
  .dash-dark [style*="color: rgb(30, 41, 59)"],
  .dash-dark [style*="color: rgb(51, 65, 85)"],
  .dash-dark [style*="color: rgb(52, 64, 84)"],
  .dash-dark [style*="color: rgb(16, 24, 40)"] { color: #f1f5f9 !important; }
  .dash-dark [style*="color: rgb(71, 85, 105)"],
  .dash-dark [style*="color: rgb(100, 116, 139)"],
  .dash-dark [style*="color: rgb(102, 112, 133)"] { color: #cbd5e1 !important; }
  .dash-dark [style*="color: rgb(148, 163, 184)"] { color: #94a3b8 !important; }

  /* Biru -> emas */
  .dash-dark [style*="color: rgb(67, 97, 238)"],
  .dash-dark [style*="color: rgb(2, 132, 199)"] { color: #E5B85C !important; }
  .dash-dark svg[fill="#4361ee"] { fill: #E5B85C; }
  .dash-dark svg[stroke="#4361ee"] { stroke: #E5B85C; }
  .dash-dark svg[stroke="#64748b"],
  .dash-dark svg[stroke="#667085"] { stroke: #cbd5e1; }

  /* Tombol utama emas */
  .dash-dark .dp-btn { background-color: #E5B85C !important; color: #121212 !important; }
  .dash-dark .dp-btn:hover { background-color: #f0c978 !important; }

  /* Dropdown & kalender */
  .dash-dark .dp-dd, .dash-dark .dp-pop { background-color: #1e1e1e !important; border-color: #634f27 !important; }
  .dash-dark .dp-dd div, .dash-dark .dp-dd button { color: #f1f5f9 !important; }
  .dash-dark .dp-dd [style*="background-color: rgb(241, 245, 249)"] { background-color: rgba(229,184,92,0.2) !important; }
  .dash-dark .dp-dd [style*="background-color: rgb(248, 250, 252)"] { background-color: #2d2d2d !important; }
  .dash-dark .dp-pop button { color: #f1f5f9 !important; }
  .dash-dark .dp-pop span { color: #94a3b8 !important; }
  .dash-dark .dp-pop [style*="background-color: rgb(248, 250, 252)"] { background-color: #262626 !important; }
  .dash-dark .dp-pop [style*="background-color: rgb(2, 132, 199)"] { background-color: #E5B85C !important; color: #121212 !important; }
  .dash-dark .dp-pop [style*="color: rgb(2, 132, 199)"]:not([style*="background-color: rgb(2, 132, 199)"]) { color: #E5B85C !important; }

  /* Backdrop */
  .dash-dark [style*="rgba(15, 23, 42, 0.3)"] { background-color: rgba(0,0,0,0.7) !important; }
`}</style>
    </div>
  );
}