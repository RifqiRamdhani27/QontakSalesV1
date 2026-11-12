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
const MK_FONT = "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif";
const thBase = "bg-[color:var(--list-subtle,#f8f9fb)] px-2 py-4 text-left text-[14px] font-semibold leading-5 align-middle";
const tdBase = "bg-[color:var(--list-surface,#fff)] px-2 py-3.5 text-[14px] leading-5 align-middle";
function StatusBadge({
  status
}) {
  const map = {
    Selesai: {
      bg: "var(--list-success-bg, #e8f5eb)",
      color: "var(--list-success-text, #3c914d)"
    },
    "Diimpor sebagian": {
      bg: "var(--list-warning-bg, #fff4e5)",
      color: "var(--list-warning-text, #b26a00)"
    },
    "Dalam proses": {
      bg: "var(--list-info-bg, #e8f0fe)",
      color: "var(--list-info-text, #1a56db)"
    },
    "Dalam antrean": {
      bg: "var(--list-subtle, #f1f5f9)",
      color: "var(--list-muted, #626b79)"
    },
    "Menunggu dihapus": {
      bg: "var(--list-danger-bg, #fdecea)",
      color: "var(--list-danger-text, #c0392b)"
    },
    "Gagal mengimpor": {
      bg: "var(--list-danger-bg, #fdecea)",
      color: "var(--list-danger-text, #c0392b)"
    },
    "Gagal menghapus": {
      bg: "var(--list-danger-bg, #fdecea)",
      color: "var(--list-danger-text, #c0392b)"
    },
    "Menunggu hitung ulang": {
      bg: "var(--list-warning-bg, #fff4e5)",
      color: "var(--list-warning-text, #b26a00)"
    }
  };
  const tone = map[status] || {
    bg: "var(--list-subtle, #f1f5f9)",
    color: "var(--list-muted, #626b79)"
  };
  return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[14px] leading-5" style={{
    background: tone.bg,
    color: tone.color
  }}>
      {status}
    </span>;
}
const recalculationLogs = [];
function InfoRow({
  label,
  children
}) {
  return <div className="grid items-center gap-2" style={{
    gridTemplateColumns: "240px 1fr"
  }}>
      <p className="m-0 text-[14px]" style={{
      color: MK.muted
    }}>
        {label}
      </p>
      <p className="m-0 text-[14px]" style={{
      color: MK.text
    }}>
        {children}
      </p>
    </div>;
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
  const pageTheme = isDark ? darkTheme : {
    colorScheme: "light"
  };
  const [logs] = useState(recalculationLogs);
  const [scheduleActive, setScheduleActive] = useState(true);
  const pendingLog = logs.find(log => log.status === "Menunggu hitung ulang");
  return <div className="-m-4 min-h-[calc(100%+2rem)] md:-m-6 md:min-h-[calc(100%+3rem)]" style={{
    ...pageTheme,
    background: "var(--list-subtle,#f1f5f9)",
    fontFamily: MK_FONT
  }} data-list-theme={pageTheme.colorScheme}>{isDark && <style>{"[data-list-theme=\"dark\"] h1,[data-list-theme=\"dark\"] h2{color:#fff!important}\n[data-list-theme=\"dark\"] table{background-color:#1a1a1a;color:#fff}\n[data-list-theme=\"dark\"] thead,[data-list-theme=\"dark\"] th{background-color:#2b2418!important;color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] td{color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] th :is(a,span,div,p,strong,small,button),[data-list-theme=\"dark\"] td :is(a,span,div,p,strong,small):not(button *){color:#fff!important}\n[data-list-theme=\"dark\"] tbody tr:hover{background-color:rgba(229,184,92,.12)!important}\n[data-list-theme=\"dark\"][data-list-dropdown] button:hover,[data-list-theme=\"dark\"] [role=\"option\"]:hover{background-color:rgba(229,184,92,.15)!important;color:#E5B85C!important}\n[data-list-theme=\"dark\"] input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]),[data-list-theme=\"dark\"] select,[data-list-theme=\"dark\"] textarea{background-color:#1a1a1a;color:#f1f5f9;border-color:#634f27;caret-color:#E5B85C}\n[data-list-theme=\"dark\"] input::placeholder,[data-list-theme=\"dark\"] textarea::placeholder{color:#94a3b8}\n[data-list-theme=\"dark\"] input:focus,[data-list-theme=\"dark\"] select:focus,[data-list-theme=\"dark\"] textarea:focus{border-color:#E5B85C!important;box-shadow:0 0 0 3px rgba(229,184,92,.15)}\n[data-list-theme=\"dark\"] input[type=\"checkbox\"],[data-list-theme=\"dark\"] input[type=\"radio\"]{accent-color:#E5B85C}\n[data-list-theme=\"dark\"] button:disabled{background-color:#36312a!important;color:#94a3b8!important;border-color:#634f27}\n[data-list-theme=\"dark\"] ::selection{background-color:#E5B85C;color:#121212}"}</style>}
      <div className="px-6 py-3">
        <Link to="/daftar-lainnya" className="inline-block cursor-pointer text-[14px] leading-[20px] no-underline hover:underline" style={{
        color: MK.link
      }}>
          Daftar lainnya
        </Link>
        <h1 className="m-0 mt-1 text-[24px] font-semibold leading-[32px]" style={{
        color: MK.text
      }}>
          Penghitungan ulang transaksi berjalan
        </h1>
      </div>

      <section className="rounded-md bg-[color:var(--list-surface,#fff)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-[576px]">
            <p className="m-0 text-[20px] font-semibold leading-[32px]" style={{
            color: MK.text
          }}>
              Tindakan
            </p>

            <p className="m-0 mt-1 text-[14px] leading-[20px]" style={{
            color: MK.muted
          }}>
              Status{" "}
              <span className="font-semibold">menunggu hitung ulang</span>{" "}
              menandakan adanya data terkait nilai persediaan yang perlu
              diperbarui. Sebaliknya, status{" "}
              <span className="font-semibold">selesai</span> berarti semua data
              sudah aktual.{" "}
              <span style={{
              color: "var(--list-link,#4b61dd)",
              cursor: "default"
            }}>
                Pelajari lebih lanjut
              </span>
            </p>
          </div>

          <div className="min-w-[198px] p-3 border border-3 border rounded  border-[color:var(--list-border,#e5e7eb)] ">
            <div className="flex items-center gap-3">
              <CalendarCheck size={25} color="blue" />
              <p className="m-0 text-[14px] font-semibold" style={{
              color: MK.text
            }}>
                Jadwal hitung ulang otomatis
              </p>
              <button type="button" role="switch" aria-checked={scheduleActive} aria-label="Jadwal hitung ulang otomatis" onClick={() => setScheduleActive(value => !value)} className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors" style={{
              background: scheduleActive ? MK.brand : "#c4cad2"
            }}>
                <span className="absolute top-0.5 block h-4 w-4 rounded-full bg-[color:var(--list-surface,#fff)] transition-all" style={{
                left: scheduleActive ? 18 : 2
              }} />
              </button>
            </div>
            <p className="m-0 mt-1 text-[14px]" style={{
            color: MK.muted
          }}>
              {scheduleActive ? "Every day at 01:00" : "Nonaktif"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1">
          <InfoRow label="Status">
            {pendingLog ? <StatusBadge status={pendingLog.status} /> : <span style={{
            color: MK.text
          }}>-</span>}
          </InfoRow>
          <div className="flex" />
          <InfoRow label="Transaksi pemicu">
            {pendingLog ? pendingLog.transaksi : "-"}
          </InfoRow>

          <InfoRow label="Tanggal transaksi pemicu">
            {pendingLog ? pendingLog.tanggalTransaksi : "-"}
          </InfoRow>

        </div>

        <h2 className="mb-3 mt-12 text-[20px] font-semibold leading-[32px]" style={{
        color: MK.text
      }}>
          Log
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thBase} style={{
              color: MK.text
            }}>
                Tanggal penghitungan
              </th>
              <th className={thBase} style={{
              color: MK.text
            }}>
                Diperbarui oleh
              </th>
              <th className={thBase} style={{
              color: MK.text
            }}>
                Transaksi pemicu
              </th>
              <th className={thBase} style={{
              color: MK.text
            }}>
                Tanggal transaksi pemicu
              </th>
              <th className={thBase} style={{
              color: MK.text
            }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? <tr>
                <td colSpan={5} className="bg-[color:var(--list-surface,#fff)] px-4 text-center" style={{
              height: 309
            }}>
                  <img src={emptyFolderImg} alt="" className="mx-auto mb-3 h-[128px] w-[128px] object-contain" />
                  <p className="m-0 text-[16px] font-semibold" style={{
                color: MK.text
              }}>
                    Belum ada log
                  </p>
                  <p className="m-0 mt-1 text-[14px]" style={{
                color: MK.muted
              }}>
                    Log penghitungan ulang nilai persediaan akan muncul di sini.
                  </p>
                </td>
              </tr> : logs.map(log => <tr key={log.id} className="hover:bg-[color:var(--list-hover,#fafbff)]">
                  <td className={tdBase} style={{
              color: MK.text
            }}>
                    {log.tanggal}
                  </td>
                  <td className={tdBase} style={{
              color: MK.text
            }}>
                    {log.pengguna}
                  </td>
                  <td className={tdBase} style={{
              color: MK.text
            }}>
                    {log.transaksi}
                  </td>
                  <td className={tdBase} style={{
              color: MK.text
            }}>
                    {log.tanggalTransaksi}
                  </td>
                  <td className={tdBase}>
                    <StatusBadge status={log.status} />
                  </td>
                </tr>)}
          </tbody>
        </table>
      </section>
    </div>;
}
