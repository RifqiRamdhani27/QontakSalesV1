import React, { useState, useEffect } from "react";
import Navbar from "@/pages/Navbar";
import ctaBg from "@/assets/cta.jpg";

const TABS = [
  { id: "artikel", label: "Artikel" },
  { id: "video", label: "Video tutorial" },
  { id: "terbaru", label: "Terbaru" },
];

const POPULAR = ["Laporan", "Penjualan", "Produk", "Kas & Bank", "Pengaturan"];

const TOPICS = [
  { id: "faq", title: "FAQ", count: 9, icon: "01KA8HDY5X7A0MVPQ1KRA1F0VG" },
  { id: "memulai", title: "Memulai dengan Jurnal", count: 20, icon: "01KA8HE47YJT8PP7KDQNT5VSYP" },
  { id: "beranda", title: "Beranda", count: 16, icon: "01KA8HDV395EYNJFW5CFFA4Z8Y" },
  { id: "laporan", title: "Laporan", count: 57, icon: "01KA8ZDX8T4EJE52THXKDPB1C7" },
  { id: "kas-bank", title: "Kas & Bank", count: 15, icon: "01KA8ZDHJ1W502Q8J61WXW8M60" },
  { id: "penjualan", title: "Penjualan", count: 53, icon: "01KA8ZDY7GEW1MV19B9H1N1ACB" },
  { id: "pembelian", title: "Pembelian", count: 34, icon: "01KA8HE7EGQNVJ7FN27EDGK84J" },
  { id: "biaya", title: "Biaya", count: 5, icon: "01KA8HE0KV939F25WNRAP4V2E5" },
  { id: "kontak", title: "Kontak", count: 19, icon: "01KA8ZDNJ5NNVA2JCK6B9VERZJ" },
  { id: "produk", title: "Produk", count: 40, icon: "01KA8ZDJJM0D82REHB4VMQJTDK" },
  { id: "produksi", title: "Produksi", count: 10, icon: "01KA8ZDKKR95GZCAH363A8WZ1V" },
  { id: "pemenuhan", title: "Pemenuhan", count: 2, icon: "01KA8ZDR0H5TFYNGESKEH5HSJ5" },
  { id: "aset", title: "Aset", count: 11, icon: "01KA8ZDGN3FS3PN99XHXYH747A" },
  { id: "daftar-akun", title: "Daftar Akun", count: 30, icon: "01KA8HDXEF075X4FRJ6BXR2N0Q" },
  { id: "daftar-lainnya", title: "Daftar Lainnya", count: 31, icon: "01KA8HDTD3RAR2MGKGJPCGTNDZ" },
  { id: "integrasi", title: "Integrasi", count: 30, icon: "01KA8HDPP2818SVPE74JKW95YH" },
  { id: "qris", title: "QRIS Pay", count: 18, icon: "01KA8ZDT3A9M3D7W04J2YR43P7" },
  { id: "pengaturan", title: "Pengaturan", count: 23, icon: "01KA8HE507FR0CTQWBXH6P5EN3" },
  { id: "studi-kasus", title: "Studi Kasus", count: 28, icon: "01KA8HE6JJB01AJA4D37DYYWQ5" },
  { id: "jurnal-apps", title: "Jurnal Apps", count: 9, icon: "01KA8HDZ1WEPTH13WW0YJJ2HRG" },
];

/* ------------------------------------------------------------------ */
/* Search box: statis, light / sky-blue                                */
/* ------------------------------------------------------------------ */
const SEARCH_CSS = `
.sq-poda {
  position: relative;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}

.sq-main {
  position: relative;
  width: 100%;
  border-radius: 16px;
  box-shadow:
    0 0 0 2px rgba(186, 230, 253, 0.6),
    0 12px 32px rgba(56, 189, 248, 0.35);
  transition: box-shadow 0.25s ease;
}
.sq-main:hover,
.sq-main:focus-within {
  box-shadow:
    0 0 0 2px rgba(125, 211, 252, 0.85),
    0 14px 16px rgba(56, 189, 248, 0.5);
}

.sq-input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: #ffffff;
  color: #0f172a;
  font-family: inherit;
  font-size: 15px;
  padding: 0 112px 0 54px;
  outline: none;
  box-shadow: none;
  appearance: none;
  -webkit-appearance: none;
}
.sq-input::placeholder { color: #94a3b8; }
.sq-input:focus { outline: none; box-shadow: none; }

.sq-search-icon {
  position: absolute;
  left: 18px;
  top: 16px;
  pointer-events: none;
}

.sq-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 2;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  cursor: pointer;
  color: #ffffff;
  background: linear-gradient(135deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%);
  box-shadow: 0 6px 14px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.sq-btn:hover {
  transform: translateY(-1px) scale(1.04);
  filter: brightness(1.05);
  box-shadow: 0 8px 18px rgba(14, 165, 233, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.sq-btn:active { transform: scale(0.97); }

.sq-clear {
  position: absolute;
  top: 14px;
  right: 58px;
  z-index: 2;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.sq-clear:hover { background: #e2e8f0; }
`;

const TOPIC_CSS = `
.topic-card {
  --topic-fill: #16afb1ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  isolation: isolate;
  transform: translateZ(0);
  backface-visibility: hidden;
  padding: 14px 16px;
  cursor: pointer;
  color: #090909;
  border-radius: 0.75em;
  background: #fcfcfcff;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
  transition: color 0.8s ease-in, border-color 0.2s ease-in, box-shadow 0.2s ease-in;
}

.topic-card:active {
  box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
}

.topic-card:before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%) scaleY(1) scaleX(1.25);
  top: 100%;
  width: 140%;
  height: 180%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: block;
  transition: top 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1), transform 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
  z-index: -1;
  pointer-events: none;
  will-change: top, transform;
  backface-visibility: hidden;
}

.topic-card:after {
  content: "";
  position: absolute;
  left: 55%;
  transform: translateX(-50%) scaleY(1) scaleX(1.45);
  top: 180%;
  width: 160%;
  height: 190%;
  background: var(--topic-fill);
  border-radius: 50%;
  display: block;
  transition: top 0.6s 0.1s cubic-bezier(0.55, 0, 0.1, 1), transform 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
  z-index: -1;
  pointer-events: none;
  will-change: top, transform;
  backface-visibility: hidden;
}

.topic-card:hover {
  color: #ffffff;
  border: 1px solid var(--topic-border);
}

.topic-card:hover:before {
  top: -35%;
  background: var(--topic-fill);
  transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

.topic-card:hover:after {
  top: -45%;
  background: var(--topic-fill);
  transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

/* Teks di dalam kartu ikut berubah warna saat hover */
.topic-title {
  font-size: 14px;
  font-weight: 700;
  color: #090909;
  transition: color 0.25s ease 0.15s;
}
.topic-count {
  font-size: 12px;
  margin-top: 2px;
  color: #64748b;
  transition: color 0.25s ease 0.15s;
}
.topic-info {
  color: #94a3b8;
  transition: color 0.25s ease 0.15s;
}
.topic-card:hover .topic-title { color: #ffffff; }
.topic-card:hover .topic-count { color: rgba(255, 255, 255, 0.85); }
.topic-card:hover .topic-info  { color: #ffffff; }
`;

const InfoIcon = () => (
  <svg className="topic-info" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9.25" />
    <path d="M12 11v5.5" strokeLinecap="round" />
    <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export default function PusatBantuan() {
  const [activeTab, setActiveTab] = useState("artikel");
  const [query, setQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTopics = () => {
    const el = document.getElementById("semua-topik");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredTopics = TOPICS.filter((t) =>
    t.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', sans-serif, system-ui",
        color: "#0F172A",
      }}
    >
      <style>{SEARCH_CSS + TOPIC_CSS}</style>

      <Navbar />

      {/* HERO (mulai dari top 0 agar navbar menyatu dengan cta.jpg) */}
      <div
        id="help-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#0F172A",
          backgroundImage: `url(${ctaBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay agar teks tetap terbaca */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.55) 55%, rgba(15,23,42,0.8) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "190px 40px 96px 40px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "2.5rem",
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              textShadow: "0 2px 16px rgba(0,0,0,0.25)",
            }}
          >
            Panduan pengguna{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #BAE6FD 0%, #7DD3FC 50%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Sales Qontak
            </span>
          </h1>

          <p
            style={{
              margin: "0 auto 36px auto",
              maxWidth: "520px",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(226,232,240,0.9)",
            }}
          >
            Cari jawaban, pelajari fitur, dan selesaikan kendala Anda dengan cepat.
          </p>

          {/* SEARCH */}
          <div style={{ maxWidth: "620px", margin: "0 auto" }}>
            <div className="sq-poda">
              <div className="sq-main">
                <input
                  className="sq-input"
                  type="text"
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") scrollToTopics();
                  }}
                  placeholder="Cari topik bantuan..."
                  aria-label="Cari topik bantuan"
                  autoComplete="off"
                />

                {/* Icon search kiri (gradient biru langit) */}
                <div className="sq-search-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    <defs>
                      <linearGradient id="sq-grad-circle" gradientTransform="rotate(50)">
                        <stop stopColor="#0EA5E9" offset="0%" />
                        <stop stopColor="#7DD3FC" offset="100%" />
                      </linearGradient>
                      <linearGradient id="sq-grad-line">
                        <stop stopColor="#7DD3FC" offset="0%" />
                        <stop stopColor="#0284C7" offset="100%" />
                      </linearGradient>
                    </defs>
                    <circle stroke="url(#sq-grad-circle)" r="8" cy="11" cx="11" />
                    <line stroke="url(#sq-grad-line)" y2="16.65" y1="22" x2="16.65" x1="22" />
                  </svg>
                </div>

                {query && (
                  <button
                    type="button"
                    className="sq-clear"
                    onClick={() => setQuery("")}
                    aria-label="Hapus pencarian"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                )}

                {/* Tombol cari kanan */}
                <button
                  type="button"
                  className="sq-btn"
                  onClick={scrollToTopics}
                  aria-label="Cari"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Popular chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "26px",
              }}
            >
              <span style={{ fontSize: "12.5px", color: "rgba(226,232,240,0.8)", marginRight: "2px" }}>
                Populer:
              </span>
              {POPULAR.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    scrollToTopics();
                  }}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    color: "#ffffff",
                    fontSize: "12.5px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background-color 0.15s ease, border-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(125,211,252,0.28)";
                    e.currentTarget.style.borderColor = "rgba(186,230,253,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "44px 40px 80px 40px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "#f1f5f9",
              borderRadius: "999px",
              padding: "4px",
              gap: "4px",
            }}
          >
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    height: "32px",
                    padding: "0 18px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: isActive ? "#0F172A" : "transparent",
                    color: isActive ? "#ffffff" : "#475569",
                    transition: "background-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "22px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            Pilih topik sesuai kebutuhan Anda
          </h2>
          <p
            style={{
              margin: "0 auto",
              maxWidth: "520px",
              fontSize: "13.5px",
              color: "#4B5563",
              lineHeight: 1.6,
            }}
          >
            Temukan solusi lebih cepat dengan memilih topik yang paling sesuai dengan
            pertanyaan atau masalah yang Anda alami di Sales Qontak.
          </p>
        </div>

        <div id="semua-topik" style={{ marginBottom: "16px", scrollMarginTop: "130px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
            Semua topik
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>
            Cari dan temukan topik yang sesuai dengan kebutuhan Anda.
          </p>
        </div>

        {filteredTopics.length === 0 ? (
          <div
            style={{
              padding: "48px 16px",
              textAlign: "center",
              border: "1px dashed #CBD5E1",
              borderRadius: "12px",
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Topik "{query}" tidak ditemukan. Coba kata kunci lain.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              padding: "6px",
            }}
          >
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="topic-card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      className="icon-img"
                      src={`https://help-center.jurnal.id/hc/theming_assets/${topic.icon}`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ width: "20px", height: "20px", objectFit: "contain" }}
                    />
                  </div>
                  <div>
                    <div className="topic-title">{topic.title}</div>
                    <div className="topic-count">{topic.count} artikel</div>
                  </div>
                </div>

                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <InfoIcon />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          style={{
            position: "fixed",
            right: "38px",
            bottom: "38px",
            width: "44px",
            height: "44px",
            borderRadius: "999px",
            backgroundColor: "#4F46E5",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px rgba(79, 70, 229, 0.35)",
            zIndex: 999,
            transition: "background-color 0.25s ease, transform 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#4338CA";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4F46E5";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}