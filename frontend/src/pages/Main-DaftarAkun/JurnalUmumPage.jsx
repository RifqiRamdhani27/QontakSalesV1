import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function JurnalUmumPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
  const c = isDark
    ? {
      popBg: "#1a1a1a",
      popBorder: "#634f27",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      nav: "#f1f5f9",
      accent: "#E5B85C",
      weekday: "#94a3b8",
      selBg: "#E5B85C",
      selText: "#121212",
      dayText: "#f1f5f9",
      dayMuted: "#4b5563",
      monthBg: "#262626",
      hoverBg: "#2d2d2d",
      divider: "#3a3326",
    }
    : {
      popBg: "#ffffff",
      popBorder: "#d5dcde",
      shadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
      nav: "#334155",
      accent: "#0284c7",
      weekday: "#334155",
      selBg: "#0284c7",
      selText: "#ffffff",
      dayText: "#1e293b",
      dayMuted: "#cbd5e1",
      monthBg: "#f8fafc",
      hoverBg: "#f1f5f9",
      divider: "#f1f5f9",
    };

  const datePickerRef = useRef(null);
  const [accounts, setAccounts] = useState([]);
  const [noTransaksi, setNoTransaksi] = useState("[Auto]");
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 10));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 10));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tglTransaksi, setTglTransaksi] = useState("10/09/2026");
  const [tag, setTag] = useState("");
  const [memo, setMemo] = useState("");
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([
    { id: 1, akun_id: "", deskripsi: "", debit: "", kredit: "" },
    { id: 2, akun_id: "", deskripsi: "", debit: "", kredit: "" },
  ]);

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const formatDateDDMMYYYY = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    setTglTransaksi(formatDateDDMMYYYY(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCalendarDays = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }
    return days;
  };

  const renderCalendarPopover = () => (
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
            if (calendarViewMode === "days") setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1));
            else if (calendarViewMode === "months") setCalendarViewDate(new Date(calendarViewDate.getFullYear() - 1, calendarViewDate.getMonth(), 1));
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
            if (calendarViewMode === "days") setCalendarViewMode("months");
            else if (calendarViewMode === "months") {
              setYearRangeStart(Math.floor(calendarViewDate.getFullYear() / 12) * 12);
              setCalendarViewMode("years");
            } else setCalendarViewMode("days");
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          title="Klik untuk memilih bulan / tahun"
        >
          <span>
            {calendarViewMode === "days" && `${MONTH_NAMES[calendarViewDate.getMonth()]} ${calendarViewDate.getFullYear()}`}
            {calendarViewMode === "months" && `${calendarViewDate.getFullYear()}`}
            {calendarViewMode === "years" && `${yearRangeStart} - ${yearRangeStart + 11}`}
          </span>
          <span style={{ fontSize: "10px" }}>▼</span>
        </button>

        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: c.nav, padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (calendarViewMode === "days") setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1));
            else if (calendarViewMode === "months") setCalendarViewDate(new Date(calendarViewDate.getFullYear() + 1, calendarViewDate.getMonth(), 1));
            else setYearRangeStart((prev) => prev + 12);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          »
        </button>
      </div>

      {/* View: Hari */}
      {calendarViewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: c.weekday, marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(calendarViewDate.getFullYear(), calendarViewDate.getMonth()).map((d, idx) => {
              const isSelected =
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
                    setCalendarViewDate(newDate);
                    setShowCalendar(false);
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
      {calendarViewMode === "months" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {MONTH_NAMES.map((mName, idx) => {
            const sel = calendarViewDate.getMonth() === idx;
            return (
              <button
                key={mName}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCalendarViewDate(new Date(calendarViewDate.getFullYear(), idx, 1));
                  setCalendarViewMode("days");
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
      {calendarViewMode === "years" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {Array.from({ length: 12 }).map((_, idx) => {
            const yearVal = yearRangeStart + idx;
            const sel = calendarViewDate.getFullYear() === yearVal;
            return (
              <button
                key={yearVal}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCalendarViewDate(new Date(yearVal, calendarViewDate.getMonth(), 1));
                  setCalendarViewMode("months");
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
            setCalendarViewDate(today);
            setCalendarViewMode("days");
            setShowCalendar(false);
          }}
          style={{ background: "none", border: "none", fontSize: "13px", fontWeight: 600, color: c.accent, cursor: "pointer", padding: "4px 8px", borderRadius: "4px" }}
        >
          Hari ini
        </button>
      </div>
    </div>
  );

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;
    const newFiles = selectedFiles.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
      raw: f,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFiles = Array.from(e.dataTransfer.files);
      const newFiles = selectedFiles.map((f, i) => ({
        id: `${Date.now()}-${i}`,
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
        raw: f,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get("/coa/", { params: { page_size: 1000 } });
        const list = res.data.results ?? res.data;
        if (Array.isArray(list) && list.length > 0) {
          setAccounts(list);
        }
      } catch (err) {
        console.error("Failed to fetch COA accounts", err);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { id: Date.now(), akun_id: "", deskripsi: "", debit: "", kredit: "" },
    ]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const parseNum = (val) => {
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9.-]/g, "");
    return parseFloat(clean) || 0;
  };

  const totalDebit = rows.reduce((sum, r) => sum + parseNum(r.debit), 0);
  const totalKredit = rows.reduce((sum, r) => sum + parseNum(r.kredit), 0);

  const formatIDR = (num) => {
    return "Rp. " + num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={isDark ? "dash-dark jn-root" : "jn-root"}
      style={{ margin: "-24px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#ffffff", fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <style>{`
        .control-label {
          font-family: 'Gotham-Medium', Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .form-erp-input {
          border: 1px solid #d5dcde;
          border-radius: 4px;
          font-size: 13px;
          color: #334155;
          background-color: #ffffff;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .form-erp-input:focus {
          border-color: #5da0c9ff;
          outline: none;
          box-shadow: 0 0 0 2px rgba(93, 160, 201, 0.2);
        }
        .erp-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748b'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
          background-position: right 0.65rem center;
          background-repeat: no-repeat;
          background-size: 1.15em 1.15em;
          padding-right: 2rem;
        }
        .form-erp-textarea {
          resize: vertical;
          min-height: 38px;
        }

        /* Dark Mode */
        .dash-dark.jn-root { background-color: #121212 !important; color-scheme: dark; }
        .dash-dark h1 { color: #ffffff !important; }
        .dash-dark label, .dash-dark label span, .dash-dark strong { color: #f1f5f9 !important; }
        .dash-dark main div[style*="font-size: 13px"] { color: #cbd5e1; }

        /* Permukaan */
        .dash-dark .jn-banner { background-color: #1a1a1a !important; border-color: #634f27 !important; }
        .dash-dark .jn-head { background-color: #e08c33c1 !important; border-color: #634f27 !important; color: #f1f5f9 !important; }
        .dash-dark .jn-body { background-color: #121212 !important; border-color: #634f27 !important; }
        .dash-dark .jn-body > div { border-color: #3a3326 !important; }
        .dash-dark .jn-card { background-color: #1e1e1e !important; border-color: #634f27 !important; }
        .dash-dark .jn-card div, .dash-dark .jn-card span { color: #cbd5e1; }
        .dash-dark .jn-addon { background-color: #262626 !important; border-color: #634f27 !important; color: #E5B85C !important; }
        .dash-dark .jn-addon svg { color: #E5B85C !important; }

        /* Input */
        .dash-dark .form-erp-input {
          background-color: #262626 !important;
          color: #f1f5f9 !important;
          border-color: #634f27 !important;
        }
        .dash-dark .form-erp-input:focus {
          border-color: #E5B85C !important;
          box-shadow: 0 0 0 2px rgba(229,184,92,0.25) !important;
        }
        .dash-dark select option { background: #262626; color: #f1f5f9 !important; }
        .dash-dark ::placeholder { color: #94a3b8; }

        /* Tombol utama -> emas */
        .dash-dark .jn-btn { background-color: #e08d33 !important; color: #ffffffff !important; box-shadow: 0 3px 0 #755613ff !important; }
        .dash-dark .jn-btn:hover { background-color: #e08c33df !important; }

        /* Tombol hapus baris */
        .dash-dark .jn-body button { color: #E5B85C !important; }
        .dash-dark .jn-body button rect { fill: #E5B85C; }

        
        
        /* Teks kecil "Transaksi" */
        .dash-dark .jn-crumb { color: #f8fafc !important; }

        /* Total debit/kredit putih cerah */
        .dash-dark .jn-total div { color: #ffffff !important; }

        /* Ikon lampiran emas */
        .dash-dark .jn-clip { color: #E5B85C !important; stroke: #E5B85C !important; }      
      `}</style>

      {/* BEGIN: MainContentContainer */}
      <main style={{ width: "100%", paddingBottom: "40px" }}>
        {/* BEGIN: TopHeader */}
        <div style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
          <div className="jn-crumb" style={{ fontSize: "13px", color: "#384f6eff", fontWeight: "400", lineHeight: "1", marginBottom: "6px" }}>Transaksi</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#003764", letterSpacing: "-0.025em" }}>Jurnal Umum</h1>
        </div>
        {/* END: TopHeader */}

        {/* BEGIN: TopFormBanner (Sejajar Horisontal) */}
        <div className="jn-banner"
          style={{ backgroundColor: "#d9eff4ff", borderBottom: "1px solid #e1eff4", borderTop: "2px solid #b2eaffff", paddingLeft: "24px", paddingRight: "24px", paddingTop: "20px", paddingBottom: "20px" }}>
          <div style={{ maxWidth: "1720px", display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Field 1: No Transaksi */}
            <div style={{ flex: "0 0 280px", minWidth: "220px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }} htmlFor="no-transaksi">No Transaksi</label>
                <button style={{ color: "#3182ce", background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", marginLeft: "2px" }} title="Pengaturan nomor" type="button">
                  <svg style={{ width: "26px", height: "20px" }} viewBox="0 0 28 22" fill="#3182ce">
                    {/* Main Left Gear */}
                    <path transform="translate(0, 4) scale(0.72)" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
                    {/* Top Right Smaller Gear */}
                    <path transform="translate(14.5, -0.5) scale(0.52)" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
                  </svg>
                </button>
              </div>
              <input
                className="form-erp-input"
                style={{ width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "12px", color: "#64748b", backgroundColor: "#ffffff" }}
                id="no-transaksi"
                placeholder="[Auto]"
                type="text"
                value={noTransaksi}
                onChange={(e) => setNoTransaksi(e.target.value)}
              />
            </div>

            {/* Field 2: Tgl Transaksi */}
            <div style={{ flex: "0 0 280px", minWidth: "220px", position: "relative" }} ref={datePickerRef}>
              <label className="control-label" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px", fontFamily: "'Gotham-Medium', 'Montserrat', sans-serif" }} htmlFor="tgl-transaksi">Tgl Transaksi</label>
              <div style={{ display: "flex", cursor: "pointer" }} onClick={() => setShowCalendar((prev) => !prev)}>
                <span className="jn-addon" style={{ display: "inline-flex", alignItems: "center", paddingLeft: "12px", paddingRight: "12px", backgroundColor: "#e9ecef", border: "1px solid #d5dcde", borderRight: "0", borderRadius: "4px 0 0 4px", color: "#475569", cursor: "pointer" }}>
                  <svg style={{ width: "16px", height: "16px", color: "#475569" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                  </svg>
                </span>
                <input
                  className="form-erp-input"
                  style={{ borderRadius: "0 4px 4px 0", width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "12px", color: "#334155", backgroundColor: "#ffffff", cursor: "pointer" }}
                  id="tgl-transaksi"
                  type="text"
                  readOnly
                  value={tglTransaksi}
                />
              </div>

              {/* Calendar Popover */}
              {showCalendar && renderCalendarPopover()}
            </div>

            {/* Field 3: Tag */}
            <div style={{ flex: "0 0 360px", minWidth: "220px", marginLeft: "auto" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }} htmlFor="tag-transaksi">Tag</label>
              <input
                className="form-erp-input"
                style={{ width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "12px", backgroundColor: "#ffffff" }}
                id="tag-transaksi"
                placeholder=""
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* END: TopFormBanner */}

        {/* BEGIN: JournalTableSection */}
        <div style={{ paddingLeft: "24px", paddingRight: "24px", marginTop: "24px" }}>
          {/* Table Headers */}
          <div className="jn-head"
            style={{ display: "grid", gridTemplateColumns: "4fr 3fr 2fr 2fr 1fr", gap: "12px", backgroundColor: "#d9eff4ff", borderTop: "2.8px solid #b2eaffff", borderBottom: "1.5px solid #a3a3a3ff", paddingLeft: "16px", paddingRight: "16px", paddingTop: "10px", paddingBottom: "10px", borderRadius: "4px 4px 0 0", fontSize: "13px", fontWeight: "700", color: "#1e293b", alignItems: "center", border: "1px solid #d2e8f1" }}>
            <div>Akun</div>
            <div>Deskripsi</div>
            <div>Debit</div>
            <div>Kredit</div>
            <div style={{ textAlign: "center" }}></div>
          </div>

          {/* Table Body / Rows Container */}
          <div className="jn-body"
            style={{ border: "1px solid #e2e8f0", borderTop: "0", backgroundColor: "#ffffff", borderRadius: "0 0 4px 4px", marginBottom: "16px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
            {rows.map((row, idx) => (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "4fr 3fr 2fr 2fr 1fr",
                  gap: "12px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  alignItems: "center",
                  borderTop: idx > 0 ? "1px solid #f1f5f9" : "none",
                }}
              >
                {/* Akun Selection Dropdown */}
                <div>
                  <select
                    className="form-erp-input erp-select"
                    style={{ width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "32px", color: row.akun_id ? "#334155" : "#94a3b8", backgroundColor: "#ffffff", appearance: "none", cursor: "pointer" }}
                    value={row.akun_id}
                    onChange={(e) => handleRowChange(row.id, "akun_id", e.target.value)}
                  >
                    <option value="" disabled>Pilih akun</option>
                    {accounts.length > 0 ? (
                      accounts.map((acct) => (
                        <option key={acct.id} value={acct.id} style={{ color: "#334155" }}>
                          {acct.kode_akun} - {acct.nama_akun}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">1000 - Kas</option>
                        <option value="2">1100 - Bank</option>
                        <option value="3">1200 - Piutang Usaha</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Deskripsi Textarea */}
                <div>
                  <textarea
                    className="form-erp-input form-erp-textarea"
                    style={{ width: "100%", paddingLeft: "12px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px", color: "#334155", backgroundColor: "#ffffff", lineHeight: "1.25" }}
                    rows={1}
                    value={row.deskripsi}
                    onChange={(e) => handleRowChange(row.id, "deskripsi", e.target.value)}
                  />
                </div>

                {/* Debit Input */}
                <div>
                  <input
                    className="form-erp-input"
                    style={{ width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "12px", textAlign: "right", color: "#334155", backgroundColor: "#ffffff" }}
                    type="text"
                    value={row.debit}
                    onChange={(e) => handleRowChange(row.id, "debit", e.target.value)}
                  />
                </div>

                {/* Kredit Input */}
                <div>
                  <input
                    className="form-erp-input"
                    style={{ width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "12px", textAlign: "right", color: "#334155", backgroundColor: "#ffffff" }}
                    type="text"
                    value={row.kredit}
                    onChange={(e) => handleRowChange(row.id, "kredit", e.target.value)}
                  />
                </div>

                {/* Remove Action Button */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    aria-label="Hapus baris"
                    style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#176582", backgroundColor: "transparent", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    type="button"
                    onClick={() => handleRemoveRow(row.id)}
                  >
                    <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 24 24">
                      <rect fill="#1b647f" height="2.5" rx="0.5" width="16" x="4" y="11"></rect>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Row Action Button */}
          <div style={{ marginTop: "16px", marginBottom: "32px" }}>
            <button
              className="jn-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "9px",
                paddingBottom: "9px",
                backgroundColor: "#1c607a",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 3px 0 #10394a",
                transition: "all 0.15s ease",
              }}
              type="button"
              onClick={handleAddRow}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a5d75ff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1c607a")}
            >
              + Tambah Data
            </button>
          </div>
        </div>
        {/* END: JournalTableSection */}

        {/* BEGIN: LowerFormAndSummary */}
        <div style={{ paddingLeft: "24px", paddingRight: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "32px", flexWrap: "wrap" }}>
          {/* Left Column: Memo & File Upload */}
          <div style={{ flex: "1", minWidth: "300px", maxWidth: "600px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Memo Field */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }} htmlFor="memo-input">Memo</label>
                <textarea
                  className="form-erp-input"
                  style={{ width: "100%", padding: "12px", fontSize: "13px", color: "#334155" }}
                  id="memo-input"
                  rows={4}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>

              {/* Lampiran Field */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                  <svg className="jn-clip" style={{ width: "16px", height: "16px", color: "#475569", transform: "rotate(45deg)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span>Lampiran</span>
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  onChange={handleFileSelect}
                />

                {/* Uploaded File Cards List */}
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="jn-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#ffffff",
                      border: "1px solid #d5dcde",
                      borderRadius: "3px",
                      maxWidth: "460px",
                      marginBottom: "10px",
                      position: "relative",
                      overflow: "hidden",
                      height: "64px",
                    }}
                  >
                    {/* Left Icon Container */}
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        borderRight: "1px solid #e2e8f0",
                      }}
                    >
                      {/* Cyan Blue Square Image Icon */}
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          backgroundColor: "#38bdf8",
                          borderRadius: "3px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                        }}
                      >
                        <svg style={{ width: "24px", height: "24px" }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                        </svg>
                      </div>
                    </div>

                    {/* Right File Info */}
                    <div style={{ paddingLeft: "14px", paddingRight: "32px", display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#0284c7",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                        title={file.name}
                      >
                        {file.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        <strong style={{ color: "#1e293b", fontWeight: "700" }}>{file.size.split(" ")[0]}</strong> {file.size.split(" ")[1]}
                      </div>
                    </div>

                    {/* Close / Remove Button (x) */}
                    <button
                      type="button"
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "10px",
                        background: "none",
                        border: "none",
                        color: "#cbd5e1",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        lineHeight: "1",
                        padding: "2px",
                      }}
                      onClick={() => handleRemoveFile(file.id)}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#64748b")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
                      title="Hapus file"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Drag and Drop Zone */}
                <div
                  className="jn-card"
                  style={{
                    border: "1px dashed #c5d3dc",
                    borderRadius: "4px",
                    backgroundColor: "#ffffff",
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    maxWidth: "460px",
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b" }}>
                    <svg style={{ width: "16px", height: "16px", color: "#94a3b8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span>Tarik file ke sini, atau</span>
                    <span
                      style={{ color: "#0284c7", fontWeight: "500", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                    >
                      pilih file
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>ukuran maksimal 10 MB/file</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Balance Summary Labels */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", paddingRight: "48px", paddingTop: "8px" }}>
            <div className="jn-total" style={{ display: "flex", gap: "64px", textAlign: "left" }}>
              {/* Total Debit */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", lineHeight: "1.25" }}>Total Debit</div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#1e293b", marginTop: "4px" }}>{formatIDR(totalDebit)}</div>
              </div>
              {/* Total Kredit */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#334155", lineHeight: "1.25" }}>Total Kredit</div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#1e293b", marginTop: "4px" }}>{formatIDR(totalKredit)}</div>
              </div>
            </div>
          </div>
        </div>
        {/* END: LowerFormAndSummary */}

        {/* BEGIN: ActionButtonsBar */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", marginTop: "40px", paddingLeft: "24px", paddingRight: "24px" }}>
          {/* Batal Button */}
          <button
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#db4437", color: "#ffffff", fontSize: "13px", fontWeight: "500", paddingTop: "8px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px", borderRadius: "4px", border: "none", cursor: "pointer", boxShadow: "0 3px 0 #9a2f26ff", transition: "background-color 0.15s ease" }}
            type="button"
            onClick={() => navigate("/daftar-akun")}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c8382c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#db4437")}
          >
            <svg style={{ width: "14px", height: "14px", fontWeight: "900" }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
            <span>Batal</span>
          </button>

          {/* Buat Jurnal Umum Split Action Button */}
          <div style={{ display: "inline-flex", borderRadius: "4px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
            <button
              className="jn-btn"
              style={{ backgroundColor: "#43a047", color: "#ffffff", fontSize: "13px", fontWeight: "500", paddingTop: "8px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px", borderRadius: "4px 0 0 4px", border: "none", cursor: "pointer", boxShadow: "0 3px 0 #357d39ff", transition: "background-color 0.15s ease" }}
              type="button"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#388e3c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#43a047")}
            >
              Buat Jurnal Umum
            </button>
            <button
              aria-label="Opsi lainnya"
              className="jn-btn"
              style={{ backgroundColor: "#43a047", borderLeft: "1px solid #388e3c", borderTop: "none", borderRight: "none", borderBottom: "none", color: "#ffffff", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "0 4px 4px 0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 3px 0 #357d39ff", transition: "background-color 0.15s ease" }}
              type="button"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#388e3c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#43a047")}
            >
              <svg style={{ width: "14px", height: "14px" }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
              </svg>
            </button>
          </div>
        </div>
        {/* END: ActionButtonsBar */}
      </main>
    </div>
  );
}
