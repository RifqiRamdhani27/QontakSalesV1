import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LEFT_ITEMS = [
    {
        id: "kategori-tag",
        title: "Kategori Tag",
        description: "Menampilkan kategori yang berisi tag.",
    },
    {
        id: "daftar-transaksi",
        title: "Daftar Transaksi",
        description: "Daftar dari semua transaksi",
    },
    {
        id: "kategori-produk",
        title: "Kategori produk",
        description: "Berisi daftar kategori produk Anda.",
    },
    {
        id: "cara-pembayaran",
        title: "Cara Pembayaran",
        path: "/cara-pembayaran",
        description: "Menampilkan cara pembayaran yang Anda pakai atau dipakai oleh Supplier Anda.",
    },
    {
        id: "unit",
        title: "Unit",
        description: "Berisi daftar satuan (unit) produk Anda.",
    },
    {
        id: "daftar-audit",
        title: "Daftar Audit",
        description: "Daftar perubahan yang telah dilakukan",
    },
    {
        id: "penghitungan-ulang-nilai-persediaan",
        title: "Penghitungan ulang nilai persediaan",
        badge: "Baru",
        description:
            "Menampilkan status dan log penghitungan nilai persediaan yang disebabkan oleh perubahan data transaksi.",
    },
];

const RIGHT_ITEMS = [
    {
        id: "daftar-jadwal-berulang",
        title: "Daftar Jadwal Berulang",
        description: "Daftar pengaturan jadwal untuk transaksi berulang",
    },
    {
        id: "daftar-kunci-periode-tutup-buku",
        title: "Daftar Kunci Periode & Tutup Buku",
        badge: "Baru",
        description:
            "Menampilkan daftar periode yang dikunci dan buku yang sudah ditutup dalam satu tabel.",
    },
    {
        id: "daftar-lampiran",
        title: "Daftar Lampiran",
        description: "Daftar semua lampiran pada transaksi",
    },
    {
        id: "pajak",
        title: "Pajak",
        path: "/pajak",
        description:
            "Menampilkan tipe-tipe pajak yang Anda pakai untuk penjualan kepada pelanggan atau pembelian dari supplier.",
    },
    {
        id: "syarat-pembayaran",
        title: "Syarat Pembayaran",
        path: "/syarat-pembayaran",
        description:
            "Menampilkan daftar syarat pembayaran yang menentukan tanggal jatuh tempo untuk pelanggan atau dari supplier. Dari sini Anda dapat membuat syarat pembayaran baru, dan mengubah atau menghapusnya.",
    },
    {
        id: "daftar-impor-ekspor",
        title: "Daftar Impor & Ekspor",
        description:
            "Menampilkan daftar riwayat impor dan ekspor di Jurnal. Anda dapat melihat status dan data dari masing-masing impor & ekspor, serta menghapus data per impor.",
    },
    {
        id: "data-migrasi",
        title: "Data Migrasi",
        path: "/data-migrasi",
        description: "Dapatkan Kemudahan dalam Pemindahan Data Anda",
    },
];

const Badge = () => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            marginLeft: "8px",
            padding: "2px 10px",
            borderRadius: "999px",
            backgroundColor: "#E12D39",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 700,
            verticalAlign: "middle",
        }}
    >
        Baru
    </span>
);

const ListItem = ({ item }) => {
    const navigate = useNavigate();
    return (
        <div style={{ marginBottom: "28px" }}>
            <h3
                className="dl-item-title"
                onClick={() => item.path && navigate(item.path)}
                style={{
                    margin: 0,
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "rgb(0, 96, 191)",
                    cursor: "pointer",
                }}
            >
                {item.title}
                {item.badge && <Badge />}
            </h3>
            <p
                className="dl-item-desc"
                style={{
                    margin: "6px 0 0 0",
                    fontSize: "14px",
                    color: "#334155",
                    lineHeight: 1.6,
                    maxWidth: "620px",
                }}
            >
                {item.description}
            </p>
        </div>
    );
};

export default function DaftarLainnya() {
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

    return (
        <div
            className={isDark ? "dl-dark" : ""}
            style={{
                margin: "-24px",
                minHeight: "100vh",
                backgroundColor: isDark ? "#121212" : "#ffffffff",
                fontFamily: "'Inter', sans-serif, system-ui",
                transition: "background-color 0.3s ease",
            }}
        >
            <div style={{ padding: "32px 32px 48px 32px" }}>
                {/* Breadcrumb + title */}
                <div style={{ marginBottom: "20px" }}>
                    <p className="dl-crumb" style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>Pengaturan</p>
                    <h1
                        className="dl-title"
                        style={{
                            margin: "-5px 0 0 0",
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#0F172A",
                        }}
                    >
                        Daftar Lainnya
                    </h1>
                </div>

                {/* Card */}
                <div
                    className="dl-card"
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d7d7d7ff",
                        borderRadius: "16px",
                        padding: "40px 48px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            columnGap: "64px",
                        }}
                    >
                        <div>
                            {LEFT_ITEMS.map((item) => (
                                <ListItem key={item.id} item={item} />
                            ))}
                        </div>
                        <div>
                            {RIGHT_ITEMS.map((item) => (
                                <ListItem key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .dl-dark .dl-crumb { color: #94a3b8 !important; }
                .dl-dark .dl-title { color: #ffffff !important; }
                .dl-dark .dl-card {
                    background-color: #1a1a1a !important;
                    border-color: #634f27 !important;
                    box-shadow: 0 4px 14px rgba(229, 184, 92, 0.25) !important;
                }
                .dl-dark .dl-item-title { color: #E5B85C !important; }
                .dl-dark .dl-item-title:hover { color: #f0c978 !important; }
                .dl-dark .dl-item-desc { color: #cbd5e1 !important; }
            `}</style>
        </div>
    );
}