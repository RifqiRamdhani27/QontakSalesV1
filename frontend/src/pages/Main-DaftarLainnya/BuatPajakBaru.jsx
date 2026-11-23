import React, { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ACCOUNTS_API_URL = "/api/coa/?page_size=10000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const LIGHT_T = {
    pageBg: "#ebf0f5",
    text: "#1e293b",
    headerBg: "#ffffff",
    headerBorder: "#e2e8f0",
    crumb: "#64748b",
    title: "#0b325b",
    cardBg: "#ffffff",
    cardBorder: "#f1f5f9",
    cardShadow: "0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.02)",
    divider: "#f1f5f9",
    heading: "#1e293b",
    subtext: "#64748b",
    badgeBg: "#f8fafc",
    badgeBorder: "#f1f5f9",
    badgeText: "#94a3b8",
    label: "#334155",
    border: "#e2e8f0",
    borderHover: "#cbd5e1",
    focus: "#3b82f6",
    focusRing: "0 0 0 4px rgba(59,130,246,0.1)",
    inputShadow: "0 1px 2px rgba(0,0,0,0.03)",
    inputBg: "#ffffff",
    inputText: "#1e293b",
    unit: "#94a3b8",
    radioOnBorder: "rgba(59,130,246,0.3)",
    radioOnBg: "rgba(239,246,255,0.4)",
    radioOnText: "#1e3a8a",
    radioOffBg: "#ffffff",
    radioOffText: "#334155",
    accent: "#3b82f6",
    hint: "#64748b",
    infoDotBg: "#f1f5f9",
    infoDotText: "#475569",
    tooltipBg: "#1e293b",
    tooltipText: "#ffffff",
    tooltipBorder: "none",
    selectBg: "#ffffff",
    selectLoadingBg: "#f8fafc",
    selectText: "#1e293b",
    selectPlaceholder: "#94a3b8",
    selectIcon: "#94a3b8",
    chevron: "#64748b",
    dropdownBg: "#ffffff",
    dropdownBorder: "#e2e8f0",
    dropdownShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
    dropSearchBorder: "#f1f5f9",
    optionBorder: "#f8fafc",
    optionSelectedBg: "#eff6ff",
    optionHoverBg: "#f8fafc",
    optionText: "#1e293b",
    optionMuted: "#64748b",
    emptyText: "#94a3b8",
    rose: "#e11d48",
    cancelBg: "#ffffff",
    cancelText: "#475569",
    cancelBorder: "#e2e8f0",
    cancelHoverBg: "#fff1f2",
    cancelHoverBorder: "#fecdd3",
    cancelHoverText: "#e11d48",
    submitBg: "#059669",
    submitBgHover: "#047857",
    submitText: "#ffffff",
    submitShadow: "0 1px 2px rgba(0,0,0,0.05)",
    submitShadowHover: "0 4px 6px -1px rgba(5,150,105,0.2)",
};

const DARK_T = {
    pageBg: "#121212",
    text: "#e2e8f0",
    headerBg: "#121212",
    headerBorder: "#3a3326",
    crumb: "#94a3b8",
    title: "#f8fafc",
    cardBg: "#1a1a19",
    cardBorder: "#634f27",
    cardShadow: "0 12px 32px rgba(0,0,0,0.4)",
    divider: "#3a3326",
    heading: "#f8fafc",
    subtext: "#94a3b8",
    badgeBg: "#262626",
    badgeBorder: "#3a3326",
    badgeText: "#94a3b8",
    label: "#e2e8f0",
    border: "#634f27",
    borderHover: "#8f6c1f",
    focus: "#E5B85C",
    focusRing: "0 0 0 3px rgba(229,184,92,0.2)",
    inputShadow: "none",
    inputBg: "#262626",
    inputText: "#f1f5f9",
    unit: "#94a3b8",
    radioOnBorder: "rgba(229,184,92,0.5)",
    radioOnBg: "rgba(229,184,92,0.1)",
    radioOnText: "#E5B85C",
    radioOffBg: "#262626",
    radioOffText: "#cbd5e1",
    accent: "#E5B85C",
    hint: "#94a3b8",
    infoDotBg: "#262626",
    infoDotText: "#cbd5e1",
    tooltipBg: "#2b2a27",
    tooltipText: "#f1f5f9",
    tooltipBorder: "1px solid #634f27",
    selectBg: "#262626",
    selectLoadingBg: "#1f1f1f",
    selectText: "#f1f5f9",
    selectPlaceholder: "#94a3b8",
    selectIcon: "#94a3b8",
    chevron: "#94a3b8",
    dropdownBg: "#1a1a19",
    dropdownBorder: "#634f27",
    dropdownShadow: "0 16px 40px rgba(0,0,0,0.6)",
    dropSearchBorder: "#3a3326",
    optionBorder: "#2a2722",
    optionSelectedBg: "rgba(229,184,92,0.15)",
    optionHoverBg: "#2d2d2d",
    optionText: "#f1f5f9",
    optionMuted: "#94a3b8",
    emptyText: "#94a3b8",
    rose: "#f87171",
    cancelBg: "#262626",
    cancelText: "#cbd5e1",
    cancelBorder: "#634f27",
    cancelHoverBg: "rgba(239,68,68,0.15)",
    cancelHoverBorder: "#7f1d1d",
    cancelHoverText: "#f87171",
    submitBg: "#e08d33",
    submitBgHover: "#ea9a45",
    submitText: "#ffffff",
    submitShadow: "0 4px 8px rgba(254, 92, 23, 0.49)",
    submitShadowHover: "0 6px 14px rgba(254, 92, 23, 0.55)",
};

const ThemeCtx = createContext(LIGHT_T);

const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 118 0v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const InfoDot = ({ hover, setHover }) => {
    const t = useContext(ThemeCtx);
    return (
        <span
            style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "16px",
                    height: "16px",
                    borderRadius: "999px",
                    backgroundColor: t.infoDotBg,
                    color: t.infoDotText,
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "help",
                }}
            >
                i
            </span>
            {hover && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        bottom: "100%",
                        transform: "translateX(-50%)",
                        marginBottom: "8px",
                        width: "192px",
                        padding: "8px",
                        backgroundColor: t.tooltipBg,
                        color: t.tooltipText,
                        border: t.tooltipBorder,
                        boxSizing: "border-box",
                        fontSize: "11px",
                        fontWeight: 400,
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)",
                        zIndex: 20,
                        textAlign: "center",
                    }}
                >
                    Informasi pengali nilai DPP sesuai regulasi
                </div>
            )}
        </span>
    );
};

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Required = () => {
    const t = useContext(ThemeCtx);
    return <span style={{ color: t.rose }}>*</span>;
};

const FieldRow = ({ label, required, children }) => {
    const t = useContext(ThemeCtx);
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "4fr 8fr",
                gap: "24px",
                alignItems: "center",
            }}
        >
            <label style={{ fontSize: "13px", fontWeight: 600, color: t.label, display: "flex", alignItems: "center", gap: "4px" }}>
                {label}
                {required && <Required />}
            </label>
            <div>{children}</div>
        </div>
    );
};

const AccountSelect = ({ value, onChange, options = [], loading = false, placeholder = "Pilih akun..." }) => {
    const t = useContext(ThemeCtx);
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openUpward, setOpenUpward] = useState(false);
    const wrapRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpward(spaceBelow < 260);
        }
    }, [open]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return options;
        return options.filter(
            (o) =>
                String(o.kode_akun || "").toLowerCase().includes(q) ||
                String(o.nama_akun || "").toLowerCase().includes(q)
        );
    }, [options, search]);

    const selected = value || null;

    return (
        <div ref={wrapRef} style={{ position: "relative", width: "100%", maxWidth: "512px" }}>
            <div
                ref={triggerRef}
                onClick={() => !loading && setOpen((v) => !v)}
                style={{
                    width: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${hover || open ? t.borderHover : t.border}`,
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: loading ? t.selectLoadingBg : t.selectBg,
                    fontSize: "13px",
                    color: selected ? t.selectText : t.selectPlaceholder,
                    cursor: loading ? "wait" : "pointer",
                    boxShadow: t.inputShadow,
                    transition: "border-color 150ms ease",
                    boxSizing: "border-box",
                    minHeight: "38px",
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", paddingRight: "8px" }}>
                    {loading ? (
                        <span style={{ fontWeight: 500 }}>Memuat akun...</span>
                    ) : selected ? (
                        <>
                            <span style={{ fontWeight: 500, flexShrink: 0 }}>{selected.kode_akun} -</span>
                            <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {selected.nama_akun}
                            </span>
                        </>
                    ) : (
                        <span style={{ fontWeight: 500 }}>{placeholder}</span>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: t.selectIcon, flexShrink: 0 }}>
                    {selected && !loading && (
                        <>
                            <button
                                type="button"
                                title="Clear"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange && onChange(null);
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "inherit",
                                    display: "flex",
                                    padding: "4px",
                                    borderRadius: "6px",
                                }}
                            >
                                <CloseIcon />
                            </button>
                            <div style={{ width: "1px", height: "16px", backgroundColor: t.border }} />
                        </>
                    )}
                    <span
                        style={{
                            color: t.chevron,
                            display: "flex",
                            transform: open ? "rotate(180deg)" : "none",
                            transition: "transform 150ms ease",
                        }}
                    >
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>

            {open && !loading && (
                <div
                    style={{
                        position: "absolute",
                        ...(openUpward
                            ? { bottom: "calc(100% + 6px)" }
                            : { top: "calc(100% + 6px)" }),
                        left: 0,
                        right: 0,
                        backgroundColor: t.dropdownBg,
                        border: `1px solid ${t.dropdownBorder}`,
                        borderRadius: "10px",
                        boxShadow: t.dropdownShadow,
                        zIndex: 30,
                        overflow: "hidden",
                    }}
                >
                    <div style={{ padding: "6px", borderBottom: `1px solid ${t.dropSearchBorder}` }}>
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari..."
                            style={{
                                width: "100%",
                                border: "none",
                                borderRadius: "8px",
                                outline: "none",
                                fontSize: "11px",
                                padding: "4px 6px",
                                boxSizing: "border-box",
                                color: t.optionText,
                                backgroundColor: t.inputBg,
                            }}
                        />
                    </div>
                    <div style={{ maxHeight: "220px", overflowY: "auto", overflowX: "hidden" }}>
                        {filtered.length === 0 ? (
                            <div style={{ padding: "10px", fontSize: "11px", color: t.emptyText, textAlign: "center" }}>
                                Tidak ada akun yang cocok
                            </div>
                        ) : (
                            filtered.map((acc) => {
                                const isSelected = selected && selected.id === acc.id;
                                return (
                                    <div
                                        key={acc.id}
                                        onClick={() => {
                                            onChange && onChange(acc);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        style={{
                                            padding: "6px 10px",
                                            fontSize: "11px",
                                            lineHeight: "1.3",
                                            cursor: "pointer",
                                            backgroundColor: isSelected ? t.optionSelectedBg : "transparent",
                                            borderBottom: `1px solid ${t.optionBorder}`,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            color: t.optionText,
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.optionHoverBg)}
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor = isSelected ? t.optionSelectedBg : "transparent")
                                        }
                                    >
                                        <span style={{ fontWeight: 600 }}>{acc.kode_akun}</span>
                                        <span style={{ color: t.optionMuted }}> - {acc.nama_akun}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const SALES_TAX_PREFIXES = ["2", "4", "6", "8", "9"];
const SALES_TAX_KEYWORDS = ["ppn", "pajak", "vat", "tax", "keluaran", "output"];

const isSalesTaxAccount = (acc) => {
    const kode = String(acc.kode_akun || "").trim();
    if (!kode) return false;
    if (!SALES_TAX_PREFIXES.includes(kode.charAt(0))) return false;
    const nama = String(acc.nama_akun || "").toLowerCase();
    return SALES_TAX_KEYWORDS.some((kw) => nama.includes(kw));
};

export default function BuatPajakBaru() {
    const [pajakType, setPajakType] = useState("satu");
    const navigate = useNavigate();
    const [nama, setNama] = useState("");
    const [persentase, setPersentase] = useState("");
    const [pengali, setPengali] = useState(false);
    const [pemotongan, setPemotongan] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [batalHover, setBatalHover] = useState(false);
    const [buatHover, setBuatHover] = useState(false);
    const [infoHover, setInfoHover] = useState(false);

    const [themeMode, setThemeMode] = useState(
        () => localStorage.getItem("app_theme") || "light"
    );

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
    const t = isDark ? DARK_T : LIGHT_T;

    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState(null);

    const [akunPajakPenjualan, setAkunPajakPenjualan] = useState(null);
    const [akunPajakPembelian, setAkunPajakPembelian] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const fetchAccounts = async () => {
            setAccountsLoading(true);
            setAccountsError(null);
            try {
                const res = await fetch(ACCOUNTS_API_URL, { headers: getAuthHeaders() });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const list = Array.isArray(json) ? json : json.results || json.data || [];
                if (!cancelled) setAccounts(list);
            } catch (err) {
                if (!cancelled) setAccountsError(err.message || "Gagal memuat akun");
            } finally {
                if (!cancelled) setAccountsLoading(false);
            }
        };
        fetchAccounts();
        return () => {
            cancelled = true;
        };
    }, []);

    const akunPajakPenjualanOptions = useMemo(
        () => accounts.filter(isSalesTaxAccount),
        [accounts]
    );

    const akunPajakPembelianOptions = useMemo(
        () =>
            accounts.filter((a) => {
                const kode = String(a.kode_akun || "").trim();
                const namaAkun = String(a.nama_akun || "").toLowerCase();
                return kode.charAt(0) === "1" && (namaAkun.includes("ppn masukan") || namaAkun.includes("vat input"));
            }),
        [accounts]
    );

    useEffect(() => {
        if (!akunPajakPenjualan && akunPajakPenjualanOptions.length > 0) {
            const match = akunPajakPenjualanOptions.find(
                (a) => String(a.kode_akun).replace(/\s/g, "") === "2-20500"
            );
            if (match) setAkunPajakPenjualan(match);
        }
    }, [akunPajakPenjualanOptions, akunPajakPenjualan]);

    useEffect(() => {
        if (!akunPajakPembelian && akunPajakPembelianOptions.length > 0) {
            const match = akunPajakPembelianOptions.find(
                (a) => String(a.kode_akun).replace(/\s/g, "") === "1-10500"
            );
            if (match) setAkunPajakPembelian(match);
        }
    }, [akunPajakPembelianOptions, akunPajakPembelian]);

    const inputStyle = (field) => ({
        width: "100%",
        maxWidth: "512px",
        borderRadius: "12px",
        border: `1px solid ${focusedField === field ? t.focus : t.border}`,
        boxShadow: focusedField === field ? t.focusRing : t.inputShadow,
        padding: "10px 14px",
        fontSize: "13px",
        color: t.inputText,
        backgroundColor: t.inputBg,
        outline: "none",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
    });

    const radioStyle = (active) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        borderRadius: "12px",
        border: `1px solid ${active ? t.radioOnBorder : t.border}`,
        backgroundColor: active ? t.radioOnBg : t.radioOffBg,
        color: active ? t.radioOnText : t.radioOffText,
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        transition: "all 150ms ease",
    });

    return (
        <ThemeCtx.Provider value={t}>
            <div
                className={isDark ? "bp-dark" : ""}
                style={{
                    margin: "-24px",
                    height: "calc(100vh - 64px)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    backgroundColor: t.pageBg,
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    color: t.text,
                    transition: "background-color 0.3s ease, color 0.3s ease",
                }}
            >
                <header style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`, padding: "16px 32px" }}>
                    <span style={{ display: "block", fontSize: "12px", color: t.crumb, fontWeight: 400, letterSpacing: "0.02em" }}>
                        Pajak
                    </span>
                    <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: t.title, letterSpacing: "-0.01em" }}>
                        Buat Pajak Baru
                    </h1>
                </header>

                <main style={{ padding: "24px 16px 48px 16px" }}>
                    <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
                        <div
                            style={{
                                backgroundColor: t.cardBg,
                                borderRadius: "16px",
                                border: `1px solid ${t.cardBorder}`,
                                boxShadow: t.cardShadow,
                                padding: "40px",
                            }}
                        >
                            <div
                                style={{
                                    marginBottom: "32px",
                                    paddingBottom: "20px",
                                    borderBottom: `1px solid ${t.divider}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                }}
                            >
                                <div>
                                    <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: t.heading }}>
                                        Informasi Pengaturan Pajak
                                    </h2>
                                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: t.subtext }}>
                                        Lengkapi formulir di bawah ini untuk menambahkan tarif dan akun pajak baru.
                                    </p>
                                </div>
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        fontSize: "11px",
                                        fontWeight: 500,
                                        color: t.badgeText,
                                        backgroundColor: t.badgeBg,
                                        padding: "4px 10px",
                                        borderRadius: "999px",
                                        border: `1px solid ${t.badgeBorder}`,
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}
                                >
                                    <LockIcon /> Konfigurasi Pajak
                                </span>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <FieldRow label="Pajak" required>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <label style={radioStyle(pajakType === "satu")}>
                                            <input
                                                type="radio"
                                                name="pajak_type"
                                                checked={pajakType === "satu"}
                                                onChange={() => setPajakType("satu")}
                                                style={{ width: "16px", height: "16px", accentColor: t.accent }}
                                            />
                                            Satu
                                        </label>
                                        <label style={radioStyle(pajakType === "grup")}>
                                            <input
                                                type="radio"
                                                name="pajak_type"
                                                checked={pajakType === "grup"}
                                                onChange={() => setPajakType("grup")}
                                                style={{ width: "16px", height: "16px", accentColor: t.accent }}
                                            />
                                            Grup
                                        </label>
                                    </div>
                                </FieldRow>

                                <FieldRow label="Nama" required>
                                    <input
                                        type="text"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        onFocus={() => setFocusedField("nama")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Contoh: PPN 11%"
                                        style={inputStyle("nama")}
                                    />
                                </FieldRow>

                                <FieldRow label="Persentase Efektif" required>
                                    <div style={{ position: "relative", maxWidth: "512px" }}>
                                        <input
                                            type="text"
                                            value={persentase}
                                            onChange={(e) => setPersentase(e.target.value)}
                                            onFocus={() => setFocusedField("persentase")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="0"
                                            style={{ ...inputStyle("persentase"), paddingRight: "36px", maxWidth: "none" }}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                right: "14px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                color: t.unit,
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                userSelect: "none",
                                            }}
                                        >
                                            %
                                        </span>
                                    </div>
                                </FieldRow>

                                <FieldRow
                                    label={
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                            Pengali 11/12 untuk DPP
                                            <InfoDot hover={infoHover} setHover={setInfoHover} />
                                        </span>
                                    }
                                >
                                    <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={pengali}
                                            onChange={(e) => setPengali(e.target.checked)}
                                            style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: t.accent, cursor: "pointer" }}
                                        />
                                        <span style={{ fontSize: "12px", color: t.hint }}>
                                            Aktifkan penyesuaian dasar pengenaan pajak
                                        </span>
                                    </label>
                                </FieldRow>

                                <FieldRow label="Pemotongan">
                                    <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={pemotongan}
                                            onChange={(e) => setPemotongan(e.target.checked)}
                                            style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: t.accent, cursor: "pointer" }}
                                        />
                                        <span style={{ fontSize: "12px", color: t.hint }}>
                                            Tandai sebagai pajak pemotongan (withholding tax)
                                        </span>
                                    </label>
                                </FieldRow>

                                <FieldRow label="Akun Pajak Penjualan">
                                    <AccountSelect
                                        value={akunPajakPenjualan}
                                        onChange={setAkunPajakPenjualan}
                                        options={akunPajakPenjualanOptions}
                                        loading={accountsLoading}
                                        placeholder={
                                            accountsError
                                                ? `Gagal memuat akun: ${accountsError}`
                                                : "Pilih akun pajak penjualan..."
                                        }
                                    />
                                </FieldRow>

                                <FieldRow label="Akun Pajak Pembelian">
                                    <AccountSelect
                                        value={akunPajakPembelian}
                                        onChange={setAkunPajakPembelian}
                                        options={akunPajakPembelianOptions}
                                        loading={accountsLoading}
                                        placeholder={
                                            accountsError
                                                ? `Gagal memuat akun: ${accountsError}`
                                                : "Pilih akun pajak pembelian..."
                                        }
                                    />
                                </FieldRow>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "4fr 8fr",
                                        gap: "16px",
                                        alignItems: "center",
                                        paddingTop: "24px",
                                        borderTop: `1px solid ${t.divider}`,
                                    }}
                                >
                                    <div />
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/pajak")}
                                            onMouseEnter={() => setBatalHover(true)}
                                            onMouseLeave={() => setBatalHover(false)}
                                            style={{
                                                padding: "10px 20px",
                                                borderRadius: "12px",
                                                border: `1px solid ${batalHover ? t.cancelHoverBorder : t.cancelBorder}`,
                                                backgroundColor: batalHover ? t.cancelHoverBg : t.cancelBg,
                                                color: batalHover ? t.cancelHoverText : t.cancelText,
                                                fontSize: "13px",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                transition: "all 150ms ease",
                                            }}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            onMouseEnter={() => setBuatHover(true)}
                                            onMouseLeave={() => setBuatHover(false)}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "10px 24px",
                                                borderRadius: "12px",
                                                border: "none",
                                                backgroundColor: buatHover ? t.submitBgHover : t.submitBg,
                                                color: t.submitText,
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                boxShadow: buatHover ? t.submitShadowHover : t.submitShadow,
                                                transition: "all 150ms ease",
                                            }}
                                        >
                                            <CheckIcon />
                                            Buat Pajak
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                <style>{`
                    .bp-dark { color-scheme: dark; }
                    .bp-dark input::placeholder { color: #94a3b8; }
                `}</style>
            </div>
        </ThemeCtx.Provider>
    );
}