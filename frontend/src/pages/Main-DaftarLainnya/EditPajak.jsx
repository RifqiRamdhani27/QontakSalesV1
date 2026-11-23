import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

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
    readOnlyText: "#1e293b",
    percent: "#1e293b",
    radioOnBorder: "rgba(59,130,246,0.3)",
    radioOnBg: "rgba(239,246,255,0.4)",
    radioOnText: "#1e3a8a",
    radioReadText: "#1e293b",
    radioInactive: "#94a3b8",
    radioOffBg: "#ffffff",
    accent: "#3b82f6",
    accentDisabled: "#cbd5e1",
    hint: "#64748b",
    infoDotBg: "#f1f5f9",
    infoDotText: "#475569",
    tooltipBg: "#1e293b",
    tooltipText: "#ffffff",
    tooltipBorder: "none",
    selectBg: "#ffffff",
    selectText: "#1e293b",
    selectIcon: "#94a3b8",
    chevron: "#64748b",
    link: "#1a73be",
    rose: "#e11d48",
    hapusBg: "#64748b",
    hapusBgHover: "#475569",
    kembaliBg: "#e11d48",
    kembaliBgHover: "#be123c",
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
    readOnlyText: "#f1f5f9",
    percent: "#f1f5f9",
    radioOnBorder: "rgba(229,184,92,0.5)",
    radioOnBg: "rgba(229,184,92,0.1)",
    radioOnText: "#E5B85C",
    radioReadText: "#f1f5f9",
    radioInactive: "#94a3b8",
    radioOffBg: "#262626",
    accent: "#E5B85C",
    accentDisabled: "#6b7280",
    hint: "#94a3b8",
    infoDotBg: "#262626",
    infoDotText: "#cbd5e1",
    tooltipBg: "#2b2a27",
    tooltipText: "#f1f5f9",
    tooltipBorder: "1px solid #634f27",
    selectBg: "#262626",
    selectText: "#f1f5f9",
    selectIcon: "#94a3b8",
    chevron: "#94a3b8",
    link: "#E5B85C",
    rose: "#f87171",
    hapusBg: "#4b5563",
    hapusBgHover: "#6b7280",
    kembaliBg: "#be123c",
    kembaliBgHover: "#e11d48",
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

const AccountSelect = ({ code, name, onClear, disabled }) => {
    const t = useContext(ThemeCtx);
    const [hover, setHover] = useState(false);

    if (disabled) {
        return (
            <div style={{ fontSize: "13px", color: t.link, display: "inline-block" }}>
                ({code}) {name}
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "512px",
                borderRadius: "12px",
                border: `1px solid ${hover ? t.borderHover : t.border}`,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: t.selectBg,
                fontSize: "13px",
                color: t.selectText,
                cursor: "pointer",
                boxShadow: t.inputShadow,
                transition: "border-color 150ms ease",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", paddingRight: "8px" }}>
                <span style={{ fontWeight: 500, flexShrink: 0 }}>{code} -</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {name}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: t.selectIcon, flexShrink: 0 }}>
                <button
                    type="button"
                    title="Clear"
                    onClick={onClear}
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
                <span style={{ color: t.chevron, display: "flex" }}>
                    <ChevronDownIcon />
                </span>
            </div>
        </div>
    );
};

export default function EditPajak() {
    const navigate = useNavigate();

    const [isEdit, setIsEdit] = useState(false);

    const [pajakType, setPajakType] = useState("satu");
    const [nama, setNama] = useState("PPN");
    const [persentase, setPersentase] = useState("11.0");
    const [pengali, setPengali] = useState(false);
    const [pemotongan, setPemotongan] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [infoHover, setInfoHover] = useState(false);

    const [hapusHover, setHapusHover] = useState(false);
    const [kembaliHover, setKembaliHover] = useState(false);
    const [ubahHover, setUbahHover] = useState(false);

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
        boxSizing: "border-box",
    });

    const readOnlyTextStyle = {
        width: "100%",
        maxWidth: "512px",
        padding: "4px 0",
        fontSize: "13px",
        color: t.readOnlyText,
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        boxSizing: "border-box",
    };

    const radioStyle = (active) => ({
        display: "flex",
        alignItems: "center",
        gap: isEdit ? "10px" : "6px",
        padding: isEdit ? "10px 16px" : "0",
        borderRadius: "12px",
        border: `1px solid ${isEdit ? (active ? t.radioOnBorder : t.border) : "transparent"}`,
        backgroundColor: isEdit ? (active ? t.radioOnBg : t.radioOffBg) : "transparent",
        color: active ? (isEdit ? t.radioOnText : t.radioReadText) : t.radioInactive,
        cursor: isEdit ? "pointer" : "default",
        fontSize: "13px",
        fontWeight: 500,
        transition: "all 150ms ease",
    });

    const accentFor = isEdit ? t.accent : t.accentDisabled;

    return (
        <ThemeCtx.Provider value={t}>
            <div
                className={isDark ? "ep-dark" : ""}
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
                        Pajak
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
                                                disabled={!isEdit}
                                                style={{ width: "16px", height: "16px", accentColor: accentFor }}
                                            />
                                            Satu
                                        </label>
                                        <label style={radioStyle(pajakType === "grup")}>
                                            <input
                                                type="radio"
                                                name="pajak_type"
                                                checked={pajakType === "grup"}
                                                onChange={() => setPajakType("grup")}
                                                disabled={!isEdit}
                                                style={{ width: "16px", height: "16px", accentColor: accentFor }}
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
                                        disabled={!isEdit}
                                        style={isEdit ? inputStyle("nama") : readOnlyTextStyle}
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
                                            disabled={!isEdit}
                                            style={
                                                isEdit
                                                    ? { ...inputStyle("persentase"), paddingRight: "36px", maxWidth: "none" }
                                                    : { ...readOnlyTextStyle, width: "auto" }
                                            }
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                right: isEdit ? "14px" : "auto",
                                                left: isEdit ? "auto" : `${persentase.length * 7.5 + 4}px`,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                color: t.percent,
                                                fontSize: "13px",
                                                fontWeight: isEdit ? 600 : 400,
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
                                    <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: isEdit ? "pointer" : "default" }}>
                                        <input
                                            type="checkbox"
                                            checked={pengali}
                                            onChange={(e) => setPengali(e.target.checked)}
                                            disabled={!isEdit}
                                            style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: accentFor, cursor: isEdit ? "pointer" : "default" }}
                                        />
                                        {isEdit && (
                                            <span style={{ fontSize: "12px", color: t.hint }}>
                                                Aktifkan penyesuaian dasar pengenaan pajak
                                            </span>
                                        )}
                                    </label>
                                </FieldRow>

                                <FieldRow label="Pemotongan">
                                    <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: isEdit ? "pointer" : "default" }}>
                                        <input
                                            type="checkbox"
                                            checked={pemotongan}
                                            onChange={(e) => setPemotongan(e.target.checked)}
                                            disabled={!isEdit}
                                            style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: accentFor, cursor: isEdit ? "pointer" : "default" }}
                                        />
                                        {isEdit && (
                                            <span style={{ fontSize: "12px", color: t.hint }}>
                                                Tandai sebagai pajak pemotongan (withholding tax)
                                            </span>
                                        )}
                                    </label>
                                </FieldRow>

                                <FieldRow label="Akun Pajak Penjualan">
                                    <AccountSelect
                                        code="2-20500"
                                        name="PPN Keluaran (Kewajiban Lancar Lainnya)"
                                        disabled={!isEdit}
                                    />
                                </FieldRow>

                                <FieldRow label="Akun Pajak Pembelian">
                                    <AccountSelect
                                        code="1-10500"
                                        name="PPN Masukan (Aktiva Lancar Lainnya)"
                                        disabled={!isEdit}
                                    />
                                </FieldRow>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingTop: "24px",
                                        borderTop: `1px solid ${t.divider}`,
                                    }}
                                >
                                    <div>
                                        <button
                                            type="button"
                                            onMouseEnter={() => setHapusHover(true)}
                                            onMouseLeave={() => setHapusHover(false)}
                                            style={{
                                                padding: "10px 20px",
                                                borderRadius: "12px",
                                                border: "none",
                                                backgroundColor: hapusHover ? t.hapusBgHover : t.hapusBg,
                                                color: "#ffffff",
                                                fontSize: "13px",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                transition: "all 150ms ease",
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/pajak")}
                                            onMouseEnter={() => setKembaliHover(true)}
                                            onMouseLeave={() => setKembaliHover(false)}
                                            style={{
                                                padding: "10px 20px",
                                                borderRadius: "12px",
                                                border: "none",
                                                backgroundColor: kembaliHover ? t.kembaliBgHover : t.kembaliBg,
                                                color: "#ffffff",
                                                fontSize: "13px",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                transition: "all 150ms ease",
                                            }}
                                        >
                                            Kembali
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEdit(!isEdit)}
                                            onMouseEnter={() => setUbahHover(true)}
                                            onMouseLeave={() => setUbahHover(false)}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "10px 24px",
                                                borderRadius: "12px",
                                                border: "none",
                                                backgroundColor: ubahHover ? t.submitBgHover : t.submitBg,
                                                color: t.submitText,
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                boxShadow: ubahHover ? t.submitShadowHover : t.submitShadow,
                                                transition: "all 150ms ease",
                                            }}
                                        >
                                            <CheckIcon />
                                            {isEdit ? "Simpan" : "Ubah"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                <style>{`
                    .ep-dark { color-scheme: dark; }
                    .ep-dark input::placeholder { color: #94a3b8; }
                    .ep-dark input:disabled { -webkit-text-fill-color: #f1f5f9; opacity: 1; }
                `}</style>
            </div>
        </ThemeCtx.Provider>
    );
}