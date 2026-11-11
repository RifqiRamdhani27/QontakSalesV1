import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function DaftarFakturProforma() {
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
        shadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
        nav: "#334155", accent: "#0284c7", weekday: "#64748b",
        selBg: "#0284c7", selText: "#ffffff",
        dayText: "#1e293b", dayMuted: "#cbd5e1",
        monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
      };

  // Date Pickers State
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

  const [drawerPelanggan, setDrawerPelanggan] = useState("");
  const [showDrawerPelangganDropdown, setShowDrawerPelangganDropdown] = useState(false);
  const drawerPelangganRef = useRef(null);

  const [drawerStatus, setDrawerStatus] = useState("Semua Status");
  const [showDrawerStatusDropdown, setShowDrawerStatusDropdown] = useState(false);
  const drawerStatusRef = useRef(null);

  const [drawerUrutkanKolom, setDrawerUrutkanKolom] = useState("Tgl. transaksi");
  const [showDrawerUrutkanKolomDropdown, setShowDrawerUrutkanKolomDropdown] = useState(false);
  const drawerUrutkanKolomRef = useRef(null);

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
      if (drawerPelangganRef.current && !drawerPelangganRef.current.contains(event.target)) setShowDrawerPelangganDropdown(false);
      if (drawerStatusRef.current && !drawerStatusRef.current.contains(event.target)) setShowDrawerStatusDropdown(false);
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
    setTimeout(() => setShowFilterDrawer(false), 300);
  };

  const handleQuickPeriodSelect = (periodType, setStartSel, setStartView, setEndSel, setEndView, setShowPeriod) => {
    const type = (periodType || "").toLowerCase();
    const today = new Date(2026, 8, 18);
    let s = new Date(today);
    let e = new Date(today);

    if (type === "hari ini") {
      s = new Date(today);
      e = new Date(today);
    } else if (type === "minggu ini") {
      const day = today.getDay();
      const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
      s = new Date(today.getFullYear(), today.getMonth(), diffToMon);
      e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
    } else if (type === "bulan ini") {
      s = new Date(today.getFullYear(), today.getMonth(), 1);
      e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (type === "tahun ini") {
      s = new Date(today.getFullYear(), 0, 1);
      e = new Date(today.getFullYear(), 11, 31);
    } else {
      if (setShowPeriod) setShowPeriod(false);
      return;
    }

    setStartSel(s);
    setStartView(new Date(s));
    setEndSel(e);
    setEndView(new Date(e));
    if (setShowPeriod) setShowPeriod(false);
  };

  // Calendar (gaya baru, mendukung hari / bulan / tahun)
  const renderCalendarPicker = (
    selectedDate, setSelectedDate,
    viewDate, setViewDate,
    viewMode, setViewMode,
    yearRangeStart, setYearRangeStart,
    closePicker,
    alignRight = false
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
            else setYearRangeStart((prev) => prev - 12);
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
            else setYearRangeStart((prev) => prev + 12);
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
                    setSelectedDate(newDate);
                    setViewDate(newDate);
                    setViewMode("days");
                    closePicker();
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
          {Array.from({ length: 12 }).map((_, idx) => {
            const yearVal = yearRangeStart + idx;
            const sel = viewDate.getFullYear() === yearVal;
            return (
              <button
                key={yearVal}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDate(new Date(yearVal, viewDate.getMonth(), 1));
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
                {yearVal}
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
            setSelectedDate(today);
            setViewDate(today);
            setViewMode("days");
            closePicker();
          }}
          style={{ background: "none", border: "none", fontSize: "13px", fontWeight: 600, color: c.accent, cursor: "pointer", padding: "4px 8px", borderRadius: "4px" }}
        >
          Hari ini
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={isDark ? "fp-dark" : ""}
      style={{
        backgroundColor: isDark ? "#121212" : "#ffffff",
        minHeight: "100vh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: isDark ? "#f1f5f9" : "#1f2937",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Main Content */}
      <main className="w-full px-6 py-5 flex-1">
        {/* Breadcrumb & Title */}
        <header className="mb-5">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-[13px] mb-1.5">
            <button type="button" onClick={() => navigate("/laporan")} className="fp-crumb text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none p-0 cursor-pointer">
              Laporan
            </button>
            <span className="fp-sep text-gray-400">/</span>
            <span className="fp-crumb text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
              Penjualan
            </span>
          </nav>
          <h1 className="fp-title text-[24px] font-bold text-gray-900 tracking-tight">
            Proforma Invoice List
          </h1>
        </header>

        {/* Report Card */}
        <section className="fp-card bg-white border border-gray-200/90 rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Filter Bar */}
          <div className="p-6 pb-7 border-b border-transparent flex flex-wrap items-end justify-between gap-4">
            {/* Left Filter Controls */}
            <div className="flex flex-wrap items-end gap-3.5">
              {/* Start Date */}
              <div className="flex flex-col" ref={startDatePickerRef}>
                <label className="fp-label text-[13px] text-gray-800 mb-1.5 font-normal" htmlFor="start-date">
                  Tanggal awal
                </label>
                <div className="relative flex items-center">
                  <input
                    id="start-date"
                    type="text"
                    readOnly
                    value={startDate}
                    onClick={() => { setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false); }}
                    className="fp-input w-[172px] h-[36px] px-3 pr-8 text-[13.5px] text-gray-700 bg-white border border-gray-300 rounded-[3px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                  />
                  <span className="fp-icon absolute right-2.5 pointer-events-none text-gray-400 flex items-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col" ref={endDatePickerRef}>
                <label className="fp-label text-[13px] text-gray-800 mb-1.5 font-normal" htmlFor="end-date">
                  Tanggal akhir
                </label>
                <div className="relative flex items-center">
                  <input
                    id="end-date"
                    type="text"
                    readOnly
                    value={endDate}
                    onClick={() => { setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false); }}
                    className="fp-input w-[172px] h-[36px] px-3 pr-8 text-[13.5px] text-gray-700 bg-white border border-gray-300 rounded-[3px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                  />
                  <span className="fp-icon absolute right-2.5 pointer-events-none text-gray-400 flex items-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
                </div>
              </div>

              {/* Primary Filter Button */}
              <button
                type="button"
                className="fp-btn-primary h-[36px] px-5 bg-[#0066cc] hover:bg-[#0055b3] text-white text-[13px] font-normal rounded-[3px] transition-colors inline-flex items-center justify-center shadow-sm cursor-pointer border-none"
              >
                Filter
              </button>

              {/* Filter lainnya Button */}
              <button
                type="button"
                onClick={openFilterDrawer}
                className="fp-btn-outline h-[36px] px-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-[13px] font-normal rounded-[3px] transition-colors inline-flex items-center justify-center cursor-pointer"
              >
                Filter lainnya
              </button>
            </div>

            {/* Export Dropdown Button */}
            <div className="flex items-center self-end relative" ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                className="fp-btn-outline h-[36px] px-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-[13px] font-normal rounded-[3px] transition-colors inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Export</span>
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div className="fp-dd absolute right-0 top-[calc(100%+4px)] z-50 w-44 bg-white border border-gray-200 rounded-[3px] shadow-lg py-1 text-[13px] text-gray-700">
                  <button type="button" onClick={() => setShowEksporDropdown(false)} className="fp-dd-item w-full text-left px-4 py-2 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
                    Export Excel (.xlsx)
                  </button>
                  <button type="button" onClick={() => setShowEksporDropdown(false)} className="fp-dd-item w-full text-left px-4 py-2 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
                    Export PDF (.pdf)
                  </button>
                  <button type="button" onClick={() => setShowEksporDropdown(false)} className="fp-dd-item w-full text-left px-4 py-2 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
                    Export CSV (.csv)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="px-6 pb-6">
            <div className="fp-tablebox border border-gray-200 rounded-[2px] overflow-hidden">
              <div className="fp-tablewrap border-b border-gray-200 bg-white overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="fp-thead text-[13px] font-semibold text-gray-800 bg-gray-50/50">
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[13%]">Tgl. transaksi</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[16%]">Nomor transaksi</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[15%]">Tgl. jatuh tempo</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[16%]">Pelanggan</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[12%]">Status</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[10%]">Total</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[10%]">Sisa tagihan</th>
                      <th scope="col" className="py-3 px-4 font-semibold text-gray-800 tracking-tight w-[8%]">Mata uang</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Table Empty State */}
              <div className="fp-empty min-h-[300px] flex flex-col items-center justify-center py-20 px-4 bg-white">
                <p className="fp-empty-title text-[13.5px] font-semibold text-gray-800 mb-1">Anda belum memiliki data.</p>
                <p className="fp-empty-text text-[13px] text-gray-500">Data transaksi anda akan muncul di sini</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Drawer Sidebar: Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          {/* Overlay */}
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(15, 23, 42, 0.4)",
              transition: "opacity 0.3s ease",
              opacity: drawerOpen ? 1 : 0,
            }}
          />

          {/* Drawer Container */}
          <div
            className="fp-drawer"
            style={{
              position: "relative",
              width: "360px",
              maxWidth: "100%",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              zIndex: 10000,
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            {/* Drawer Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal Awal & Tanggal Akhir Input Row */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1, position: "relative" }} ref={drawerStartDatePickerRef}>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={drawerStartDate}
                      onClick={() => { setShowDrawerStartCalendar(!showDrawerStartCalendar); setShowDrawerEndCalendar(false); }}
                      className="fp-field"
                      style={{ width: "100%", height: "38px", padding: "0 32px 0 12px", fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", boxSizing: "border-box" }}
                    />
                    <span className="fp-icon absolute right-2.5 pointer-events-none text-gray-400 flex items-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  {showDrawerStartCalendar && renderCalendarPicker(drawerStartSelectedDate, setDrawerStartSelectedDate, drawerStartCalendarViewDate, setDrawerStartCalendarViewDate, drawerStartCalendarViewMode, setDrawerStartCalendarViewMode, drawerStartYearRangeStart, setDrawerStartYearRangeStart, () => setShowDrawerStartCalendar(false))}
                </div>

                <div style={{ flex: 1, position: "relative" }} ref={drawerEndDatePickerRef}>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDate}
                      onClick={() => { setShowDrawerEndCalendar(!showDrawerEndCalendar); setShowDrawerStartCalendar(false); }}
                      className="fp-field"
                      style={{ width: "100%", height: "38px", padding: "0 32px 0 12px", fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", boxSizing: "border-box" }}
                    />
                    <span className="fp-icon absolute right-2.5 pointer-events-none text-gray-400 flex items-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  {showDrawerEndCalendar && renderCalendarPicker(drawerEndSelectedDate, setDrawerEndSelectedDate, drawerEndCalendarViewDate, setDrawerEndCalendarViewDate, drawerEndCalendarViewMode, setDrawerEndCalendarViewMode, drawerEndYearRangeStart, setDrawerEndYearRangeStart, () => setShowDrawerEndCalendar(false), true)}
                </div>
              </div>

              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodRef}>
                <label className="fp-label" style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>Periode</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="fp-field"
                    onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      fontSize: "13.5px",
                      color: "#1e293b",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <span>{drawerPeriod || "Hari ini"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerPeriodDropdown && (
                    <div className="fp-dd" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Custom"].map((item) => (
                        <div
                          key={item}
                          className="fp-opt"
                          onClick={() => {
                            setDrawerPeriod(item);
                            handleQuickPeriodSelect(item, setDrawerStartSelectedDate, setDrawerStartCalendarViewDate, setDrawerEndSelectedDate, setDrawerEndCalendarViewDate, setShowDrawerPeriodDropdown);
                          }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pelanggan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPelangganRef}>
                <label className="fp-label" style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>Pelanggan</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="fp-field"
                    onClick={() => setShowDrawerPelangganDropdown(!showDrawerPelangganDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      fontSize: "13.5px",
                      color: drawerPelanggan ? "#1e293b" : "#94a3b8",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <span>{drawerPelanggan || "Pilih kontak"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerPelangganDropdown && (
                    <div className="fp-dd" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Semua Pelanggan", "PT Maju Bersama", "CV Sejahtera", "PT Global Utama"].map((p) => (
                        <div
                          key={p}
                          className="fp-opt"
                          onClick={() => {
                            setDrawerPelanggan(p === "Semua Pelanggan" ? "" : p);
                            setShowDrawerPelangganDropdown(false);
                          }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerStatusRef}>
                <label className="fp-label" style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>Status</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="fp-field"
                    onClick={() => setShowDrawerStatusDropdown(!showDrawerStatusDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      fontSize: "13.5px",
                      color: "#1e293b",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <span>{drawerStatus || "Semua Status"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerStatusDropdown && (
                    <div className="fp-dd" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Semua Status", "Draft", "Disetujui", "Ditolak", "Dibatalkan"].map((st) => (
                        <div
                          key={st}
                          className="fp-opt"
                          onClick={() => { setDrawerStatus(st); setShowDrawerStatusDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {st}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerUrutkanKolomRef}>
                <label className="fp-label" style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>Urutkan sesuai kolom</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="fp-field"
                    onClick={() => setShowDrawerUrutkanKolomDropdown(!showDrawerUrutkanKolomDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      fontSize: "13.5px",
                      color: "#1e293b",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <span>{drawerUrutkanKolom || "Tgl. transaksi"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerUrutkanKolomDropdown && (
                    <div className="fp-dd" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Tgl. transaksi", "Nomor transaksi", "Tgl. jatuh tempo", "Pelanggan", "Total", "Sisa tagihan"].map((col) => (
                        <div
                          key={col}
                          className="fp-opt"
                          onClick={() => { setDrawerUrutkanKolom(col); setShowDrawerUrutkanKolomDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {col}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Radio options: Urutan naik / Urutan turun */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "-4px" }}>
                <label className="fp-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13.5px", color: "#1e293b" }}>
                  <input
                    type="radio"
                    name="drawerUrutanOrder"
                    value="asc"
                    checked={drawerUrutanOrder === "asc"}
                    onChange={() => setDrawerUrutanOrder("asc")}
                    style={{ accentColor: "#0066cc", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <span>Urutan naik</span>
                </label>
                <label className="fp-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13.5px", color: "#1e293b" }}>
                  <input
                    type="radio"
                    name="drawerUrutanOrder"
                    value="desc"
                    checked={drawerUrutanOrder === "desc"}
                    onChange={() => setDrawerUrutanOrder("desc")}
                    style={{ accentColor: "#0066cc", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <span>Urutan turun</span>
                </label>
              </div>
            </div>

            {/* Drawer Footer Buttons */}
            <div style={{ padding: "20px 24px", borderTop: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                type="button"
                className="fp-link"
                onClick={() => {
                  setDrawerPeriod("Hari ini");
                  setDrawerPelanggan("");
                  setDrawerStatus("Semua Status");
                  setDrawerUrutkanKolom("Tgl. transaksi");
                  setDrawerUrutanOrder("asc");
                  const today = new Date(2026, 8, 18);
                  setDrawerStartSelectedDate(today);
                  setDrawerEndSelectedDate(today);
                }}
                style={{ fontSize: "13.5px", fontWeight: 500, color: "#0066cc", backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0 }}
              >
                Hapus filter
              </button>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  className="fp-ghost"
                  onClick={closeFilterDrawer}
                  style={{ padding: "8px 16px", fontSize: "13.5px", fontWeight: 500, color: "#64748b", backgroundColor: "transparent", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="fp-btn-primary"
                  onClick={() => {
                    setStartSelectedDate(drawerStartSelectedDate);
                    setStartCalendarViewDate(drawerStartSelectedDate);
                    setEndSelectedDate(drawerEndSelectedDate);
                    setEndCalendarViewDate(drawerEndSelectedDate);
                    closeFilterDrawer();
                  }}
                  style={{ padding: "8px 24px", fontSize: "13.5px", fontWeight: 500, color: "#ffffff", backgroundColor: "#0066cc", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fp-dark { color-scheme: dark; }

        /* Header halaman */
        .fp-dark .fp-crumb { color: #E5B85C !important; }
        .fp-dark .fp-crumb:hover { color: #f0c978 !important; }
        .fp-dark .fp-sep { color: #94a3b8 !important; }
        .fp-dark .fp-title { color: #ffffff !important; }

        /* Kartu laporan */
        .fp-dark .fp-card { background-color: #1a1a1a !important; border-color: #634f27 !important; }
        .fp-dark .fp-label { color: #e2e8f0 !important; }

        /* Input tanggal & field drawer */
        .fp-dark .fp-input,
        .fp-dark .fp-field {
          background-color: #262626 !important;
          color: #f1f5f9 !important;
          border-color: #634f27 !important;
        }
        .fp-dark .fp-input:focus,
        .fp-dark .fp-field:focus {
          border-color: #E5B85C !important;
          box-shadow: 0 0 0 1px #E5B85C !important;
        }
        .fp-dark .fp-field svg { stroke: #E5B85C !important; }
        .fp-dark .fp-icon { color: #E5B85C !important; }

        /* Tombol utama -> emas */
        .fp-dark .fp-btn-primary { background-color: #E5B85C !important; color: #121212 !important; }
        .fp-dark .fp-btn-primary:hover { background-color: #f0c978 !important; }

        /* Tombol outline */
        .fp-dark .fp-btn-outline {
          background-color: #262626 !important;
          border-color: #634f27 !important;
          color: #E5B85C !important;
        }
        .fp-dark .fp-btn-outline:hover { background-color: #2d2d2d !important; }
        .fp-dark .fp-btn-outline svg { color: #E5B85C !important; }

        /* Dropdown */
        .fp-dark .fp-dd { background-color: #1e1e1e !important; border-color: #634f27 !important; }
        .fp-dark .fp-dd-item { color: #f1f5f9 !important; }
        .fp-dark .fp-dd-item:hover { background-color: #2d2d2d !important; }
        .fp-dark .fp-opt { color: #f1f5f9 !important; }
        .fp-dark .fp-opt:hover { background-color: #2d2d2d !important; }

        /* Tabel */
        .fp-dark .fp-tablebox { border-color: #634f27 !important; }
        .fp-dark .fp-tablewrap { background-color: #121212 !important; border-color: #634f27 !important; }
        .fp-dark .fp-thead { background-color: #d38e0d69 !important; }
        .fp-dark .fp-thead th { color: #f1f5f9 !important; }
        .fp-dark .fp-empty { background-color: #121212 !important; }
        .fp-dark .fp-empty-title { color: #f1f5f9 !important; }
        .fp-dark .fp-empty-text { color: #94a3b8 !important; }

        /* Drawer */
        .fp-dark .fp-drawer { background-color: #1a1a1a !important; border-left: 1px solid #634f27; }
        .fp-dark .fp-drawer input[type="radio"] { accent-color: #E5B85C !important; }
        .fp-dark .fp-link { color: #E5B85C !important; }
        .fp-dark .fp-ghost { color: #cbd5e1 !important; }
        .fp-dark .fp-ghost:hover { color: #E5B85C !important; }
      `}</style>
    </div>
  );
}