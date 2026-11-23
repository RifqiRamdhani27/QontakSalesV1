import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, WarningCircle } from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";

const darkTheme = {
  "colorScheme": "dark",
  "--list-background": "#121212",
  "--list-surface": "#1a1a1a",
  "--list-subtle": "#262626",
  "--list-border": "#634f27",
  "--list-text": "#f1f5f9",
  "--list-muted": "#94a3b8",
  "--list-brand": "#E5B85C",
  "--list-link": "#E5B85C",
  "--list-hover": "#2d2d2d",
  "--list-selection": "rgba(229,184,92,.15)",
  "--list-selection-text": "#E5B85C",
  "--list-disabled": "#64748b",
  "--list-success-bg": "#17382d",
  "--list-success-text": "#86efac",
  "--list-warning-bg": "#422e16",
  "--list-warning-text": "#fcd34d",
  "--list-danger-bg": "#482126",
  "--list-danger-text": "#fca5a5",
  "--list-danger-border": "#7f1d1d",
  "--list-info-bg": "#2b2418",
  "--list-info-text": "#E5B85C",
  "--list-pixel-link": "#E5B85C",
  "--list-legacy-background": "#121212",
  "--list-legacy-head": "#2b2418",
  "--list-legacy-text": "#f3f4f6",
  "--list-legacy-muted": "#94a3b8",
  "--list-legacy-border": "#634f27",
  "--list-placeholder": "#94a3b8",
  "--list-brand-hover": "#f0c978",
  "--list-brand-text": "#121212",
  "--list-spinner-track": "rgba(18,18,18,.3)",
  "--list-disabled-bg": "#36312a",
  "--list-danger-button": "#b91c1c",
  "--list-success-button": "#15803d"
};

const MK = {
  text: "var(--list-text, #232933)",
  muted: "var(--list-muted, #626b79)",
  border: "var(--list-border, #d0d6dd)",
  brand: "var(--list-brand, #4b61dd)",
  head: "var(--list-subtle, #f8f9fb)",
  link: "var(--list-pixel-link, #1357ff)",
  legacyPage: "var(--list-legacy-background, #ecf0f1)",
  legacyHead: "var(--list-legacy-head, #3ac8f8)",
  legacyText: "var(--list-legacy-text, #404040)",
  legacyMuted: "var(--list-legacy-muted, #777777)",
  legacyPrimary: "var(--list-brand,#216a88)",
  legacyBorder: "var(--list-legacy-border, #cfd9db)"
};

const MK_FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const thStyle = {
  color: "var(--list-text, #404040)",
  fontSize: "13.33px",
  fontWeight: 400,
  padding: "8px 13.33px",
  textAlign: "left",
  height: 40,
  verticalAlign: "middle",
  borderBottom: "1px solid var(--list-border, #e2e8f0)"
};

const tdStyle = {
  color: "var(--list-text, #404040)",
  fontSize: "13.33px",
  padding: "5.33px 13.33px",
  height: 35,
  verticalAlign: "middle",
  borderBottom: "1px solid var(--list-border, #e2e8f0)"
};

function StatusBadge({ status }) {
  const map = {
    Selesai: { bg: "var(--list-success-bg, #e8f5eb)", color: "var(--list-success-text, #3c914d)" },
    "Diimpor sebagian": { bg: "var(--list-warning-bg, #fff4e5)", color: "var(--list-warning-text, #b26a00)" },
    "Dalam proses": { bg: "var(--list-info-bg, #e8f0fe)", color: "var(--list-info-text, #1a56db)" },
    "Dalam antrean": { bg: "var(--list-subtle, #f1f5f9)", color: "var(--list-muted, #626b79)" },
    "Menunggu dihapus": { bg: "var(--list-danger-bg, #fdecea)", color: "var(--list-danger-text, #c0392b)" },
    "Gagal mengimpor": { bg: "var(--list-danger-bg, #fdecea)", color: "var(--list-danger-text, #c0392b)" },
    "Gagal menghapus": { bg: "var(--list-danger-bg, #fdecea)", color: "var(--list-danger-text, #c0392b)" },
    "Menunggu hitung ulang": { bg: "var(--list-warning-bg, #fff4e5)", color: "var(--list-warning-text, #b26a00)" }
  };
  const tone = map[status] || { bg: "var(--list-subtle, #f1f5f9)", color: "var(--list-muted, #626b79)" };
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[13px] leading-5" style={{ background: tone.bg, color: tone.color }}>
      {status}
    </span>
  );
}

const recalculationLogs = [];

function InfoRow({ label, children }) {
  return (
    <div className="grid items-center gap-2" style={{ gridTemplateColumns: "240px 1fr" }}>
      <p className="m-0 text-[14px]" style={{ color: MK.muted }}>{label}</p>
      <p className="m-0 text-[14px]" style={{ color: MK.text }}>{children}</p>
    </div>
  );
}

export default function InventoryRecalculationPage() {
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
  const pageTheme = isDark ? darkTheme : { colorScheme: "light" };

  const [logs] = useState(recalculationLogs);
  const [scheduleActive, setScheduleActive] = useState(true);
  const pendingLog = logs.find(log => log.status === "Menunggu hitung ulang");

  return (
    <div 
      className="-m-4 min-h-[calc(100%+2rem)] px-6 py-5 md:-m-6 md:min-h-[calc(100%+3rem)] md:px-10" 
      style={{
        ...pageTheme,
        background: isDark ? "#121212" : "#ffffff",
        fontFamily: MK_FONT
      }} 
      data-list-theme={pageTheme.colorScheme}
    >
      {isDark && <style>{"[data-list-theme=\"dark\"] h1,[data-list-theme=\"dark\"] h2{color:#fff!important}\n[data-list-theme=\"dark\"] table{background-color:#1a1a1a;color:#fff}\n[data-list-theme=\"dark\"] thead,[data-list-theme=\"dark\"] th{background-color:#e08c33b8!important;color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] td{color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] th :is(a,span,div,p,strong,small,button),[data-list-theme=\"dark\"] td :is(a,span,div,p,strong,small):not(button *){color:#fff!important}\n[data-list-theme=\"dark\"] tbody tr:hover{background-color:transparent!important}\n[data-list-theme=\"dark\"][data-list-dropdown] button:hover,[data-list-theme=\"dark\"] [role=\"option\"]:hover{background-color:rgba(229,184,92,.15)!important;color:#E5B85C!important}\n[data-list-theme=\"dark\"] input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]),[data-list-theme=\"dark\"] select,[data-list-theme=\"dark\"] textarea{background-color:#1a1a1a;color:#f1f5f9;border-color:#634f27;caret-color:#E5B85C}\n[data-list-theme=\"dark\"] input::placeholder,[data-list-theme=\"dark\"] textarea::placeholder{color:#94a3b8}\n[data-list-theme=\"dark\"] input:focus,[data-list-theme=\"dark\"] select:focus,[data-list-theme=\"dark\"] textarea:focus{border-color:#E5B85C!important;box-shadow:0 0 0 3px rgba(229,184,92,.15)}\n[data-list-theme=\"dark\"] input[type=\"checkbox\"],[data-list-theme=\"dark\"] input[type=\"radio\"]{accent-color:#E5B85C}\n[data-list-theme=\"dark\"] button:disabled{background-color:#36312a!important;color:#94a3b8!important;border-color:#634f27}\n[data-list-theme=\"dark\"] ::selection{background-color:#E5B85C;color:#121212}"}</style>}

      <div className="mx-auto w-full max-w-[1688px]">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div className="min-w-0 w-full md:w-auto">
            <Link to="/daftar-lainnya" className="inline-block cursor-pointer text-[14px] leading-[20px] no-underline hover:underline" style={{ color: MK.link }}>
              Daftar Lainnya
            </Link>
            <h2 style={{ fontSize: "23px", fontWeight: 700, color: MK.text, margin: 0, marginTop: "2px", letterSpacing: "-0.01em" }}>
              Penghitungan ulang transaksi berjalan
            </h2>
          </div>
        </div>

        <div style={{
          background: "var(--list-surface,#fff)",
          padding: 20,
          borderRadius: 12,
          overflow: "hidden",
          marginTop: 24,
          boxShadow: isDark
            ? "0 8px 30px rgba(201, 77, 0, 0.2), 0 0 0 1px rgba(229, 184, 92, 0.15)"
            : "0 4px 12px rgba(0, 0, 0, 0.22)",
          border: isDark ? "1px solid #634f27" : "1px solid transparent"
        }}>
          
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-[576px]">
              <p className="m-0 text-[20px] font-semibold leading-[32px]" style={{ color: MK.text }}>
                Tindakan
              </p>
              <p className="m-0 mt-1 text-[14px] leading-[20px]" style={{ color: MK.muted }}>
                Status <span className="font-semibold">menunggu hitung ulang</span> menandakan adanya data terkait nilai persediaan yang perlu diperbarui. Sebaliknya, status <span className="font-semibold">selesai</span> berarti semua data sudah aktual. <span style={{ color: "var(--list-link,#4b61dd)", cursor: "default" }}>Pelajari lebih lanjut</span>
              </p>
            </div>

            <div className="min-w-[198px] p-4 rounded-lg" style={{ border: `1px solid ${MK.border}` }}>
              <div className="flex items-center gap-3">
                <CalendarCheck size={25} color={MK.brand} />
                <p className="m-0 text-[14px] font-semibold" style={{ color: MK.text }}>
                  Jadwal hitung ulang otomatis
                </p>
                <button 
                  type="button" 
                  role="switch" 
                  aria-checked={scheduleActive} 
                  aria-label="Jadwal hitung ulang otomatis" 
                  onClick={() => setScheduleActive(value => !value)} 
                  className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors" 
                  style={{ background: scheduleActive ? MK.brand : "#c4cad2" }}
                >
                  <span className="absolute top-0.5 block h-4 w-4 rounded-full bg-[color:var(--list-surface,#fff)] transition-all" style={{ left: scheduleActive ? 18 : 2 }} />
                </button>
              </div>
              <p className="m-0 mt-1 text-[14px]" style={{ color: MK.muted }}>
                {scheduleActive ? "Every day at 01:00" : "Nonaktif"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <InfoRow label="Status">
              {pendingLog ? <StatusBadge status={pendingLog.status} /> : <span style={{ color: MK.text }}>-</span>}
            </InfoRow>
            <InfoRow label="Transaksi pemicu">
              {pendingLog ? pendingLog.transaksi : "-"}
            </InfoRow>
            <InfoRow label="Tanggal transaksi pemicu">
              {pendingLog ? pendingLog.tanggalTransaksi : "-"}
            </InfoRow>
          </div>

          <h2 className="mb-3 mt-12 text-[20px] font-semibold leading-[32px]" style={{ color: MK.text }}>
            Log
          </h2>

          <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, borderTopLeftRadius: 8 }}>Tanggal penghitungan</th>
                <th style={thStyle}>Diperbarui oleh</th>
                <th style={thStyle}>Transaksi pemicu</th>
                <th style={thStyle}>Tanggal transaksi pemicu</th>
                <th style={{ ...thStyle, borderTopRightRadius: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...tdStyle, textAlign: "center", height: 309 }}>
                    <img src={emptyFolderImg} alt="" className="mx-auto mb-3 h-[128px] w-[128px] object-contain" />
                    <p className="m-0 text-[16px] font-semibold" style={{ color: MK.text }}>Belum ada log</p>
                    <p className="m-0 mt-1 text-[14px]" style={{ color: MK.muted }}>Log penghitungan ulang nilai persediaan akan muncul di sini.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log.id} style={{ background: index % 2 === 0 ? "var(--list-subtle,#f9f9f9)" : "var(--list-surface,#fff)" }}>
                    <td style={tdStyle}>{log.tanggal}</td>
                    <td style={tdStyle}>{log.pengguna}</td>
                    <td style={tdStyle}>{log.transaksi}</td>
                    <td style={tdStyle}>{log.tanggalTransaksi}</td>
                    <td style={tdStyle}><StatusBadge status={log.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}