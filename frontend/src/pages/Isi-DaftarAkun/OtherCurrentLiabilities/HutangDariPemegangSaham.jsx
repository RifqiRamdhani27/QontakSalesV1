import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react";
import { CaretDown } from "@phosphor-icons/react";
import dompetBiru from "../../../assets/dompetbiru.png";

const AKUN = {
    kode: "2-20600",
    nama: "Hutang Dari Pemegang Saham",
    kategori: "Liabilitas Jangka Pendek",
};

const outlineBtn = {
    bg: "white",
    color: "#2563eb",
    border: "1px solid #d2d9e2",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    h: "34px",
    px: 4,
    boxShadow: "sm",
    _hover: { bg: "#f8fafc" },
};

const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/* ---------- Hook tema ---------- */
function useIsDark() {
    const [mode, setMode] = useState(
        () => localStorage.getItem("app_theme") || "light"
    );
    useEffect(() => {
        const sync = () => setMode(localStorage.getItem("app_theme") || "light");
        window.addEventListener("themeChanged", sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener("themeChanged", sync);
            window.removeEventListener("storage", sync);
        };
    }, []);
    return mode === "dark";
}

/* ---------- Helper tanggal (aman zona waktu) ---------- */
// "YYYY-MM-DD" -> Date lokal
function parseYMD(str) {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}

// Date lokal -> "YYYY-MM-DD"
function toYMD(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function formatDateDDMMYYYY(str) {
    const d = parseYMD(str);
    if (!d || isNaN(d)) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function getCalendarDays(year, month) {
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
}

// --- KOMPONEN KALENDER KUSTOM ---
function DatePicker({ value, onChange, placeholder }) {
    const isDark = useIsDark();
    const selectedDate = parseYMD(value);

    const [open, setOpen] = useState(false);
    const [calendarViewDate, setCalendarViewDate] = useState(() => selectedDate || new Date());
    const [calendarViewMode, setCalendarViewMode] = useState("days"); // "days" | "months" | "years"
    const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor((selectedDate || new Date()).getFullYear() / 12) * 12);
    const containerRef = useRef(null);

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
            shadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
            nav: "#334155", accent: "#2563eb", weekday: "#64748b",
            selBg: "#2563eb", selText: "#ffffff",
            dayText: "#1e293b", dayMuted: "#94a3b8",
            monthBg: "#f8fafc", hoverBg: "#f1f5f9", divider: "#f1f5f9",
        };

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOpen = () => {
        if (!open) {
            const base = selectedDate || new Date();
            setCalendarViewDate(base);
            setCalendarViewMode("days");
        }
        setOpen(!open);
    };

    const pickDate = (date) => {
        onChange(toYMD(date));
        setCalendarViewDate(date);
        setCalendarViewMode("days");
        setOpen(false);
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
                                        pickDate(new Date(d.year, d.month, d.day));
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
                        pickDate(new Date());
                    }}
                    style={{ background: "none", border: "none", fontSize: "13px", fontWeight: 600, color: c.accent, cursor: "pointer", padding: "4px 8px", borderRadius: "4px" }}
                >
                    Hari ini
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative" ref={containerRef} style={{ width: "176px", position: "relative" }}>
            <div
                onClick={toggleOpen}
                style={{
                    height: "38px", fontSize: "13px",
                    border: `1px solid ${isDark ? "#634f27" : "#cfd7e2"}`, borderRadius: "5px",
                    color: value ? (isDark ? "#f1f5f9" : "#1e293b") : "#94a3b8",
                    backgroundColor: isDark ? "#262626" : "white", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", width: "175px", padding: "10px 12px",
                }}
            >
                <span>{value ? formatDateDDMMYYYY(value) : placeholder}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#E5B85C" : "#94a3b8"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            </div>

            {open && renderCalendarPopover()}
        </div>
    );
}

// --- HALAMAN UTAMA ---
export default function DetailAkunPiutangPage() {
    const navigate = useNavigate();
    const isDark = useIsDark();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [transactions, setTransactions] = useState([]);

    const handleTampilkan = () => {
        setTransactions([]);
    };

    return (
        <Flex
            className={isDark ? "da-dark" : ""}
            direction="column"
            minH="100vh"
            bg={isDark ? "#121212" : "#ffffffff"}
        >
            {/* Header */}
            <Flex
                px={6} pt={5} pb={4}
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                direction={{ base: "column", sm: "row" }}
                gap={3}
            >
                <Box>
                    <Text
                        as="button"
                        className="da-link"
                        fontSize="13px"
                        color="#2563eb"
                        mb={1}
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => navigate("/daftar-akun")}
                    >
                        Daftar akun
                    </Text>
                    <Text className="da-title" fontSize="23px" fontWeight="bold" color="#1e293b" letterSpacing="-0.01em">
                        ({AKUN.kode}) - {AKUN.nama}
                    </Text>
                </Box>

                <HStack gap={2.5}>
                    <Button className="da-btn" {...outlineBtn}>Beri masukan</Button>
                    <Button className="da-btn" {...outlineBtn} display="inline-flex" alignItems="center" gap={2}>
                        <span>Tindakan</span>
                        <CaretDown size={14} weight="bold" color={isDark ? "#E5B85C" : "#2563eb"} />
                    </Button>
                </HStack>
            </Flex>

            {/* Main card */}
            <Box flex={1} px={4} display="flex" flexDirection="column">
                <Flex
                    className="da-card"
                    flex={1}
                    direction="column"
                    bg="white"
                    borderTop="1px solid #dde3ea"
                    borderX="1px solid #dde3ea"
                    borderTopRadius="10px"
                    boxShadow="sm"
                >
                    {/* Toolbar */}
                    <Flex
                        className="da-toolbar"
                        px={6} py={4}
                        borderBottom="1px solid #f1f5f9"
                        align="center"
                        justify="space-between"
                        wrap="wrap"
                        gap={4}
                    >
                        <HStack gap={6} fontSize="13px">
                            <Text className="da-muted" color="#64748b">Kategori akun</Text>
                            <Text className="da-title" color="#1e293b">{AKUN.kategori}</Text>
                        </HStack>

                        <Flex wrap="wrap" align="center" gap={3}>
                            <DatePicker
                                value={startDate}
                                onChange={setStartDate}
                                placeholder="Tanggal awal"
                            />

                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                placeholder="Tanggal akhir"
                            />

                            <Button
                                className="da-btn-primary"
                                h="36px"
                                px={6}
                                fontSize="13px"
                                fontWeight="500"
                                color="white"
                                bg="#365cb9"
                                borderRadius="5px"
                                boxShadow="sm"
                                _hover={{ bg: "#2b4c9e" }}
                                onClick={handleTampilkan}
                            >
                                Tampilkan
                            </Button>
                        </Flex>
                    </Flex>

                    {/* Empty state */}
                    {transactions.length === 0 && (
                        <Flex
                            flex={1}
                            direction="column"
                            align="center"
                            justify="center"
                            py={24}
                            px={4}
                            userSelect="none"
                        >
                            <Box
                                as="img"
                                className="da-img"
                                src={dompetBiru}
                                alt="Belum ada transaksi"
                                w="240px"
                                maxW="100%"
                                mb={5}
                                style={{ objectFit: "contain" }}
                            />
                            <Text className="da-title" fontSize="16px" fontWeight="600" color="#1e293b" mb={1}>
                                Belum ada transaksi
                            </Text>
                            <Text className="da-muted" fontSize="13px" color="#64748b">
                                Daftar transaksi Anda akan ditampilkan di sini.
                            </Text>
                        </Flex>
                    )}
                </Flex>
            </Box>

            <style>{`
        .da-dark { color-scheme: dark; }
        .da-dark .da-link { color: #E5B85C !important; }
        .da-dark .da-title { color: #ffffff !important; }
        .da-dark .da-muted { color: #94a3b8 !important; }
        .da-dark .da-img { opacity: 0.9; }

        .da-dark .da-btn {
          background-color: #262626 !important;
          border-color: #634f27 !important;
          color: #E5B85C !important;
        }
        .da-dark .da-btn:hover { background-color: #2d2d2d !important; }
        .da-dark .da-btn svg { color: #E5B85C !important; }

        .da-dark .da-btn-primary { background-color: #E5B85C !important; color: #121212 !important; }
        .da-dark .da-btn-primary:hover { background-color: #f0c978 !important; }

        .da-dark .da-card {
          background-color: #1a1a1a !important;
          border-color: #634f27 !important;
        }
        .da-dark .da-toolbar { border-color: #3a3326 !important; }
      `}</style>
        </Flex>
    );
}