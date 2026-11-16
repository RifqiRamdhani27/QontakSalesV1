import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TAX_ITEMS = [
    {
        id: "ppn",
        name: "PPN",
        path: "/edit-pajak",
        rate: "11.0",
        salesAccount: "(2-20500) PPN Keluaran",
        purchaseAccount: "(1-10500) PPN Masukan",
    },
];

const LIGHT_T = {
    bg: "#ffffff",
    text: "#334155",
    headerBg: "#ffffff",
    headerBorder: "rgba(226,232,240,0.8)",
    crumb: "#64748b",
    title: "#0e3152",
    btnBg: "#24637d",
    btnBgHover: "#1c4f64",
    btnText: "#ffffff",
    Shadow: "0 1px 2px rgba(0,0,0,0.06)",
    inputBg: "#ffffff",
    inputText: "#334155",
    searchBorder: "#cbd5e1",
    focusBorder: "#24637d",
    focusShadow: "0 0 0 1px #24637d",
    searchBtnBg: "#f1f5f9",
    searchBtnBorder: "#cbd5e1",
    searchBtnIcon: "#475569",
    theadBg: "#e2f0f8",
    theadBorder: "#cce3ef",
    th: "#1e293b",
    rowBg: "#ffffff",
    rowBorder: "#f1f5f9",
    td: "#334155",
    link: "#1a73be",
    footerBg: "#dff3fc",
    footerText: "#334155",
    footerBorder: "none",
};

const DARK_T = {
    bg: "#121212",
    text: "#e2e8f0",
    headerBg: "#121212",
    headerBorder: "#3a3326",
    crumb: "#94a3b8",
    title: "#f8fafc",
    btnBg: "#e08d33",
    btnBgHover: "#e08c33df",
    btnText: "#ffffff",
    Shadow: "0 4px 8px rgba(254, 92, 23, 0.49)",
    inputBg: "#262626",
    inputText: "#f1f5f9",
    searchBorder: "#634f27",
    focusBorder: "#E5B85C",
    focusShadow: "0 0 0 2px rgba(229,184,92,0.25)",
    searchBtnBg: "#262626",
    searchBtnBorder: "#634f27",
    searchBtnIcon: "#cbd5e1",
    theadBg: "rgba(229,184,92,0.12)",
    theadBorder: "#634f27",
    th: "#f1f5f9",
    rowBorder: "#3a3326",
    td: "#e2e8f0",
    link: "#E5B85C",
    footerBg: "rgba(229,184,92,0.1)",
    footerText: "#cbd5e1",
    footerBorder: "1px solid #3a3326",
};

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Pajak() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [buttonHover, setButtonHover] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

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

    const filteredItems = TAX_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase())
    );

    const linkStyle = {
        color: t.link,
        textDecoration: "underline dotted",
        textUnderlineOffset: "3px",
    };

    return (
        <div
            className={isDark ? "pj-dark" : ""}
            style={{
                margin: "-24px",
                minHeight: "100vh",
                backgroundColor: t.bg,
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                color: t.text,
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
        >
            <div style={{ width: "100%" }}>
                <header
                    style={{
                        width: "100%",
                        padding: "20px 24px 16px 24px",
                        borderBottom: `1px solid ${t.headerBorder}`,
                        backgroundColor: t.headerBg,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "14px",
                                    color: t.crumb,
                                    fontWeight: 400,
                                    lineHeight: 1.2,
                                    marginBottom: "4px",
                                }}
                            >
                                Daftar Lainnya
                            </span>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: t.title,
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.1,
                                }}
                            >
                                Pajak
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/buat-pajak-baru")}
                            onMouseEnter={() => setButtonHover(true)}
                            onMouseLeave={() => setButtonHover(false)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                backgroundColor: buttonHover ? t.btnBgHover : t.btnBg,
                                color: t.btnText,
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "7px 14px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: t.Shadow,
                                transition: "background-color 150ms ease",
                            }}
                        >
                            <PlusIcon />
                            <span>Buat Pajak Baru</span>
                        </button>
                    </div>
                </header>

                <section style={{ width: "100%", padding: "40px 24px 16px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ display: "inline-flex", alignItems: "stretch", borderRadius: "6px" }}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Pencarian..."
                                style={{
                                    width: "224px",
                                    fontSize: "14px",
                                    padding: "6px 12px",
                                    border: `1px solid ${searchFocused ? t.focusBorder : t.searchBorder}`,
                                    borderRight: "none",
                                    borderRadius: "6px 0 0 6px",
                                    outline: "none",
                                    fontStyle: "italic",
                                    color: t.inputText,
                                    backgroundColor: t.inputBg,
                                    boxShadow: searchFocused ? t.focusShadow : "none",
                                }}
                            />
                            <button
                                type="button"
                                aria-label="Cari"
                                style={{
                                    padding: "0 12px",
                                    backgroundColor: t.searchBtnBg,
                                    border: `1px solid ${t.searchBtnBorder}`,
                                    borderLeft: "none",
                                    borderRadius: "0 6px 6px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: t.searchBtnIcon,
                                    cursor: "pointer",
                                }}
                            >
                                <SearchIcon />
                            </button>
                        </div>
                    </div>
                </section>

                <main style={{ width: "100%" }}>
                    <div style={{ width: "100%", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: t.theadBg,
                                        color: t.th,
                                        borderTop: `1px solid ${t.theadBorder}`,
                                        borderBottom: `1px solid ${t.theadBorder}`,
                                    }}
                                >
                                    <th style={{ padding: "10px 24px", fontWeight: 700, fontSize: "12px", width: "25%" }}>
                                        Nama
                                    </th>
                                    <th
                                        style={{
                                            padding: "10px 24px",
                                            fontWeight: 700,
                                            fontSize: "12px",
                                            textAlign: "right",
                                            width: "16.6%",
                                        }}
                                    >
                                        Persentase Efektif
                                    </th>
                                    <th style={{ padding: "10px 24px", fontWeight: 700, fontSize: "12px", width: "33%" }}>
                                        Akun Pajak Penjualan
                                    </th>
                                    <th style={{ padding: "10px 24px", fontWeight: 700, fontSize: "12px", width: "25%" }}>
                                        Akun Pajak Pembelian
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        style={{
                                            borderTop: index === 0 ? "none" : `1px solid ${t.rowBorder}`,
                                            backgroundColor: t.rowBg,
                                        }}
                                    >
                                        <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                                            <a
                                                href={item.path}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(item.path);
                                                }}
                                                style={{ ...linkStyle, fontWeight: 500 }}
                                            >
                                                {item.name}
                                            </a>
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px 24px",
                                                textAlign: "right",
                                                whiteSpace: "nowrap",
                                                color: t.td,
                                                fontWeight: 400,
                                            }}
                                        >
                                            {item.rate}
                                        </td>
                                        <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                                            <a
                                                href="/isi-daftar-akun/ppn-keluaran"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate("/isi-daftar-akun/ppn-keluaran");
                                                }}
                                                style={linkStyle}
                                            >
                                                {item.salesAccount}
                                            </a>
                                        </td>
                                        <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                                            <a
                                                href="/isi-daftar-akun/ppn-masukan"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate("/isi-daftar-akun/ppn-masukan");
                                                }}
                                                style={linkStyle}
                                            >
                                                {item.purchaseAccount}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            <footer
                style={{
                    width: "100%",
                    backgroundColor: t.footerBg,
                    borderTop: t.footerBorder,
                    padding: "16px 24px",
                    marginTop: "12px",
                }}
            >
                <p style={{ margin: 0, fontSize: "12px", color: t.footerText, fontWeight: 400 }}>
                    Menampilkan 1 .. {filteredItems.length} dari {filteredItems.length} Baris
                </p>
            </footer>

            <style>{`
                .pj-dark { color-scheme: dark; }
                .pj-dark input::placeholder { color: #94a3b8; }
                .pj-dark tbody tr { transition: background-color 0.15s ease; }
                .pj-dark tbody tr:hover { background-color: #262522 !important; }
                .pj-dark a:hover { opacity: 0.85; }
                .pj-dark button[aria-label="Cari"]:hover { background-color: #2d2d2d !important; }
            `}</style>
        </div>
    );
}