import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Funnel, MagnifyingGlass } from "@phosphor-icons/react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
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
function useDropdown() {
  const triggerRef = useRef(null);
  const [rect, setRect] = useState(null);
  const open = useCallback(() => {
    const node = triggerRef.current;
    if (!node) return;
    setRect(node.getBoundingClientRect());
  }, []);
  const openAt = useCallback(nextRect => setRect(nextRect), []);
  const close = useCallback(() => setRect(null), []);
  const toggle = useCallback(() => {
    if (rect) {
      setRect(null);
      return;
    }
    open();
  }, [rect, open]);
  return {
    triggerRef,
    rect,
    isOpen: Boolean(rect),
    open,
    openAt,
    close,
    toggle
  };
}
function DropdownPanel({
  rect,
  onClose,
  children,
  minWidth,
  maxWidth,
  maxHeight = 320,
  align = "left",
  variant = "pixel",
  triggerRef,
  contentRef,
  className,
  width
}) {
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
  const theme = isDark ? darkTheme : {
    colorScheme: "light"
  };
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);
  useLayoutEffect(() => {
    if (!rect || triggerRef) return;
    const panel = panelRef.current;
    const h = panel ? panel.offsetHeight : maxHeight;
    const w = panel ? panel.offsetWidth : minWidth || rect.width;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const spaceBelow = vh - rect.bottom;
    const openUp = spaceBelow < Math.min(h, maxHeight) + 16 && rect.top > spaceBelow;
    const top = openUp ? Math.max(8, rect.top - Math.min(h, maxHeight) - 4) : rect.bottom + 4;
    let left = align === "right" ? rect.right - w : rect.left;
    left = Math.max(8, Math.min(left, vw - w - 8));
    setPos({
      top,
      left,
      maxHeight: Math.max(160, Math.min(maxHeight, openUp ? rect.top - 16 : spaceBelow - 16))
    });
  }, [rect, align, maxHeight, minWidth, triggerRef]);
  useLayoutEffect(() => {
    if (!rect || !triggerRef) return;
    let frame;
    const updatePosition = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      const anchor = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      if (anchor.bottom <= 0 || anchor.top >= viewportHeight || anchor.right <= 0 || anchor.left >= viewportWidth) {
        onClose();
        return;
      }
      const panelWidth = Math.min(width ?? minWidth ?? anchor.width, Math.max(0, viewportWidth - 16));
      const below = Math.max(0, viewportHeight - anchor.bottom - 12);
      const above = Math.max(0, anchor.top - 12);
      const desiredHeight = Math.min(panel.scrollHeight, maxHeight);
      const openUp = below < desiredHeight && above > below;
      const availableHeight = Math.min(maxHeight, openUp ? above : below);
      const panelHeight = Math.min(panel.scrollHeight, availableHeight);
      const next = {
        top: openUp ? anchor.top - panelHeight - 4 : anchor.bottom + 4,
        left: Math.max(8, Math.min(align === "right" ? anchor.right - panelWidth : anchor.left, viewportWidth - panelWidth - 8)),
        width: panelWidth,
        maxHeight: availableHeight
      };
      setPos(current => current && Object.keys(next).every(key => current[key] === next[key]) ? current : next);
    };
    const schedulePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(schedulePosition) : null;
    if (triggerRef.current) observer?.observe(triggerRef.current);
    if (panelRef.current) observer?.observe(panelRef.current);
    window.addEventListener("scroll", schedulePosition, true);
    window.addEventListener("resize", schedulePosition);
    window.visualViewport?.addEventListener("resize", schedulePosition);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedulePosition, true);
      window.removeEventListener("resize", schedulePosition);
      window.visualViewport?.removeEventListener("resize", schedulePosition);
    };
  }, [rect, triggerRef, align, maxHeight, minWidth, width, onClose]);
  useEffect(() => {
    if (!rect) return;
    const onDocDown = event => {
      if (panelRef.current?.contains(event.target)) return;
      if (triggerRef?.current?.contains(event.target)) return;
      if (!triggerRef && event.target?.closest?.("[data-dropdown-trigger]")) return;
      onClose();
    };
    const onKey = event => {
      if (event.key === "Escape") {
        onClose();
        if (triggerRef) {
          event.preventDefault();
          triggerRef.current?.focus({
            preventScroll: true
          });
        }
        return;
      }
      if (!triggerRef || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const panel = panelRef.current;
      const active = document.activeElement;
      if (!panel?.contains(active) && !triggerRef.current?.contains(active)) return;
      if (active?.matches("input:not([type='checkbox']), textarea") && ["Home", "End"].includes(event.key)) return;
      const items = [...panel.querySelectorAll("button:not(:disabled), input[type='checkbox']:not(:disabled), [role='option'][tabindex]")];
      if (items.length === 0) return;
      const index = items.indexOf(active);
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowUp" ? index <= 0 ? items.length - 1 : index - 1 : (index + 1) % items.length;
      event.preventDefault();
      items[next].focus({
        preventScroll: true
      });
      items[next].scrollIntoView({
        block: "nearest"
      });
    };
    const onFocus = event => {
      if (panelRef.current?.contains(event.target)) return;
      if (triggerRef?.current?.contains(event.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    if (triggerRef) document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
      if (triggerRef) document.removeEventListener("focusin", onFocus);
    };
  }, [rect, onClose, triggerRef]);
  if (!rect) return null;
  const isLegacy = variant === "legacy";
  const isSettings = variant === "settings";
  return createPortal(<div ref={node => {
    panelRef.current = node;
    if (contentRef) contentRef.current = node;
  }} className={className} data-settings-dropdown={isSettings ? "" : undefined} data-list-theme={theme?.colorScheme} style={{
    ...theme,
    color: MK.text,
    position: "fixed",
    top: pos?.top ?? rect.bottom + 4,
    left: pos?.left ?? rect.left,
    width: triggerRef ? pos?.width : width,
    minWidth: triggerRef ? undefined : minWidth ?? rect.width,
    maxWidth: triggerRef ? "calc(100vw - 16px)" : maxWidth ?? "none",
    maxHeight: pos?.maxHeight ?? maxHeight,
    zIndex: 10050,
    overflowY: "auto",
    overflowX: "hidden",
    ...(isSettings ? {} : {
      fontFamily: MK_FONT,
      background: "var(--list-surface, #fff)",
      border: isLegacy ? "1px solid rgba(0,0,0,.15)" : `1px solid ${MK.border}`,
      borderRadius: isLegacy ? 4 : 6,
      boxShadow: isLegacy ? "0 6px 12px rgba(0,0,0,.175)" : "0 8px 24px rgba(16,24,40,.12)",
      padding: isLegacy ? "5px 0" : 4
    }),
    visibility: pos ? "visible" : "hidden"
  }} data-list-dropdown="">
      {children}
    </div>, document.body);
}
function LegacyHeader({
  title,
  subtitle,
  titleColor = "var(--list-text, #000)",
  subtitleColor = "var(--list-muted, rgba(51,51,51,.5))",
  action,
  breadcrumbTo
}) {
  const crumbText = subtitle || "Daftar Lainnya";
  return <div className="flex flex-col items-start justify-between gap-4 pb-3 md:flex-row md:items-end">
      <div className="min-w-0 w-full md:w-auto">
        {breadcrumbTo ? <Link to={breadcrumbTo} className="inline-block cursor-pointer text-[14px] leading-[20px] no-underline hover:underline" style={{
        color: MK.link
      }}>
            {crumbText}
          </Link> : <div className="text-[15.72px] leading-[16px]" style={{
        color: subtitleColor
      }}>
            {crumbText}
          </div>}
        <h2 className="m-0 py-[12.1px] text-[24.19px] font-medium leading-[1.1]" style={{
        color: titleColor
      }}>
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0 pb-3">{action}</div> : null}
    </div>;
}
function LegacyPagination({
  page,
  totalPages,
  onPage
}) {
  const pages = Array.from({
    length: Math.max(1, totalPages)
  }, (_, i) => i + 1);
  const cell = "flex h-[35px] min-w-[34px] cursor-pointer items-center justify-center border border-[color:var(--list-legacy-border,#ddd)] bg-[color:var(--list-surface,#fff)] px-2 text-[14px] no-underline";
  return <div className="flex items-center justify-end gap-0 px-[15px] py-5 bg-[color:var(--list-info-bg,#cffafe)]">
      <button type="button" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1} className={`${cell} rounded-l`} style={{
      color: page <= 1 ? "#bbb" : MK.legacyMuted
    }}>
        &lt;
      </button>
      {pages.map(item => <button key={item} type="button" onClick={() => onPage(item)} className={cell} style={{
      color: item === page ? "var(--list-brand-text,#fff)" : MK.legacyMuted,
      background: item === page ? MK.legacyPrimary : "var(--list-surface, #fff)"
    }}>
          {item}
        </button>)}
      <button type="button" onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className={`${cell} rounded-r`} style={{
      color: page >= totalPages ? "#bbb" : MK.legacyMuted
    }}>
        &gt;
      </button>
    </div>;
}
const auditActionOptions = ["Semua", "Create", "Update", "Send Email", "Send Reminder", "Delete", "Login"];
const auditRows = [];
const auditUsers = ["Hilmi", "Sari Dewi", "Bagus Prasetyo"];
const PAGE_SIZE = 10;
const filterIcon = active => <Funnel size={11} weight={active ? "fill" : "regular"} style={{
  color: active ? "var(--list-link,#216a88)" : "#2980b9"
}} />;
const thStyle = {
  color: MK.legacyText,
  fontSize: "13.33px",
  fontWeight: 700,
  padding: "8px 13.33px",
  textAlign: "left",
  verticalAlign: "middle"
};
const tdStyle = {
  color: MK.legacyText,
  fontSize: "13.33px",
  padding: "5.33px 13.33px",
  verticalAlign: "middle"
};
function DateFilter({
  startDate,
  endDate,
  onChange
}) {
  const dropdown = useDropdown();
  return <span className="relative inline-flex">
      <button type="button" ref={dropdown.triggerRef} data-dropdown-trigger onClick={dropdown.toggle} aria-label="Filter tanggal" className="ml-1 cursor-pointer border-0 bg-transparent p-0.5">
        {filterIcon(Boolean(startDate || endDate))}
      </button>

      <DropdownPanel rect={dropdown.rect} onClose={dropdown.close} minWidth={276} maxWidth={300} variant="legacy" align="right">
        <div style={{
        padding: "10px 12px",
        fontFamily: MK_FONT
      }}>
          <label className="mb-1 block" style={{
          fontSize: 12,
          color: "var(--list-text,#333)"
        }}>
            Tanggal Mulai
          </label>
          <input type="text" placeholder="DD/MM/YYYY" value={startDate} onChange={event => onChange("startDate", event.target.value)} style={{
          width: "100%",
          height: 32,
          border: "1px solid var(--list-border,#cfd9db)",
          borderRadius: 4,
          padding: "0 8px",
          fontSize: 13,
          outline: "none"
        }} />

          <label className="mb-1 mt-2 block" style={{
          fontSize: 12,
          color: "var(--list-text,#333)"
        }}>
            Tanggal Selesai
          </label>
          <input type="text" placeholder="DD/MM/YYYY" value={endDate} onChange={event => onChange("endDate", event.target.value)} style={{
          width: "100%",
          height: 32,
          border: "1px solid var(--list-border,#cfd9db)",
          borderRadius: 4,
          padding: "0 8px",
          fontSize: 13,
          outline: "none"
        }} />

          <p className="m-0 mt-2" style={{
          fontSize: 11,
          color: "var(--list-muted,#777)"
        }}>
            * maksimum periode 1 bulan
          </p>
        </div>
      </DropdownPanel>
    </span>;
}
function ActionFilter({
  selected,
  onChange
}) {
  const dropdown = useDropdown();
  const toggle = option => {
    if (option === "Semua") return onChange(["Semua"]);
    const next = selected.includes(option) ? selected.filter(item => item !== option) : [...selected.filter(item => item !== "Semua"), option];
    onChange(next.length ? next : ["Semua"]);
  };
  return <span className="relative inline-flex">
      <button type="button" ref={dropdown.triggerRef} data-dropdown-trigger onClick={dropdown.toggle} aria-label="Filter tindakan" className="ml-1 cursor-pointer border-0 bg-transparent p-0.5">
        {filterIcon(!selected.includes("Semua"))}
      </button>

      <DropdownPanel rect={dropdown.rect} onClose={dropdown.close} minWidth={239} maxWidth={260} variant="legacy" align="right" maxHeight={260}>
        <div style={{
        padding: "4px 10px",
        fontFamily: MK_FONT
      }}>
          {auditActionOptions.map(option => <label key={option} className="flex cursor-pointer items-center justify-between py-1.5" style={{
          fontSize: 13,
          color: "var(--list-text,#333)"
        }}>
              {option}
              <input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} style={{
            margin: 0,
            cursor: "pointer"
          }} />
            </label>)}
        </div>
      </DropdownPanel>
    </span>;
}
function UserFilter({
  selected,
  onChange
}) {
  const dropdown = useDropdown();
  const [keyword, setKeyword] = useState("");
  const term = keyword.trim().toLowerCase();
  const visible = auditUsers.filter(user => user.toLowerCase().includes(term));
  const toggle = user => {
    if (user === "Semua") return onChange(["Semua"]);
    const next = selected.includes(user) ? selected.filter(item => item !== user) : [...selected.filter(item => item !== "Semua"), user];
    onChange(next.length ? next : ["Semua"]);
  };
  return <span className="relative inline-flex">
      <button type="button" ref={dropdown.triggerRef} data-dropdown-trigger onClick={() => {
      setKeyword("");
      dropdown.toggle();
    }} aria-label="Filter pengguna" className="ml-1 cursor-pointer border-0 bg-transparent p-0.5">
        {filterIcon(!selected.includes("Semua"))}
      </button>

      <DropdownPanel rect={dropdown.rect} onClose={dropdown.close} minWidth={239} maxWidth={280} variant="legacy" align="right" maxHeight={300}>
        <div style={{
        padding: "8px 10px",
        fontFamily: MK_FONT
      }}>
          <div className="relative mb-2">
            <MagnifyingGlass size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" style={{
            color: "var(--list-muted,#999)"
          }} />
            <input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Cari pengguna" style={{
            width: "100%",
            height: 30,
            border: "1px solid var(--list-border,#cfd9db)",
            borderRadius: 4,
            padding: "0 8px 0 24px",
            fontSize: 13,
            outline: "none"
          }} />
          </div>

          {["Semua", ...visible].map(user => <label key={user} className="flex cursor-pointer items-center justify-between py-1.5" style={{
          fontSize: 13,
          color: "var(--list-text,#333)"
        }}>
              {user}
              <input type="checkbox" checked={selected.includes(user)} onChange={() => toggle(user)} style={{
            margin: 0,
            cursor: "pointer"
          }} />
            </label>)}
        </div>
      </DropdownPanel>
    </span>;
}
export default function AuditsPage() {
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
  const [rows] = useState(auditRows);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actions, setActions] = useState(["Semua"]);
  const [users, setUsers] = useState(["Semua"]);
  const [page, setPage] = useState(1);
  const parseDate = value => {
    const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    return Number(`${match[3]}${match[2]}${match[1]}`);
  };
  const toComparable = value => {
    const [date, time] = value.split(" ");
    const [day, month, year] = date.split("/");
    return Number(`${year}${month}${day}${(time || "00:00").replace(":", "")}`);
  };
  const filtered = rows.filter(row => {
    const rowDate = toComparable(row.tanggal);
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (start && rowDate < start * 10000) return false;
    if (end && rowDate > end * 10000 + 2359) return false;
    if (!actions.includes("Semua") && !actions.includes(row.tindakan)) return false;
    if (!users.includes("Semua") && !users.includes(row.pengguna)) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  return <div className="-m-4 min-h-[calc(100%+2rem)] p-[15px] md:-m-6 md:min-h-[calc(100%+3rem)]" style={{
    ...pageTheme,
    background: "var(--list-subtle,#f2f4f7)",
    fontFamily: MK_FONT
  }} data-list-theme={pageTheme.colorScheme}>{isDark && <style>{"[data-list-theme=\"dark\"] h1,[data-list-theme=\"dark\"] h2{color:#fff!important}\n[data-list-theme=\"dark\"] table{background-color:#1a1a1a;color:#fff}\n[data-list-theme=\"dark\"] thead,[data-list-theme=\"dark\"] th{background-color:#2b2418!important;color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] td{color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] th :is(a,span,div,p,strong,small,button),[data-list-theme=\"dark\"] td :is(a,span,div,p,strong,small):not(button *){color:#fff!important}\n[data-list-theme=\"dark\"] tbody tr:hover{background-color:rgba(229,184,92,.12)!important}\n[data-list-theme=\"dark\"][data-list-dropdown] button:hover,[data-list-theme=\"dark\"] [role=\"option\"]:hover{background-color:rgba(229,184,92,.15)!important;color:#E5B85C!important}\n[data-list-theme=\"dark\"] input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]),[data-list-theme=\"dark\"] select,[data-list-theme=\"dark\"] textarea{background-color:#1a1a1a;color:#f1f5f9;border-color:#634f27;caret-color:#E5B85C}\n[data-list-theme=\"dark\"] input::placeholder,[data-list-theme=\"dark\"] textarea::placeholder{color:#94a3b8}\n[data-list-theme=\"dark\"] input:focus,[data-list-theme=\"dark\"] select:focus,[data-list-theme=\"dark\"] textarea:focus{border-color:#E5B85C!important;box-shadow:0 0 0 3px rgba(229,184,92,.15)}\n[data-list-theme=\"dark\"] input[type=\"checkbox\"],[data-list-theme=\"dark\"] input[type=\"radio\"]{accent-color:#E5B85C}\n[data-list-theme=\"dark\"] button:disabled{background-color:#36312a!important;color:#94a3b8!important;border-color:#634f27}\n[data-list-theme=\"dark\"] ::selection{background-color:#E5B85C;color:#121212}"}</style>}
      <div className="mx-auto w-full max-w-[1688px]">
        <LegacyHeader title="Audit" titleColor="var(--list-link,#093d7c)" subtitleColor="var(--list-muted,#777777)" breadcrumbTo="/daftar-lainnya" />

        <div style={{
        background: "var(--list-surface,#fff)",
        padding: 14
      }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-[color:var(--list-info-bg,#cffafe)]" style={{
                ...thStyle,
                width: "13em "
              }}>
                  <span className="inline-flex items-center gap-1">
                    Tanggal
                    <DateFilter startDate={startDate} endDate={endDate} onChange={(field, value) => {
                    if (field === "startDate") setStartDate(value);else setEndDate(value);
                    setPage(1);
                  }} />
                  </span>
                </th>

                <th className="bg-[color:var(--list-info-bg,#cffafe)]" style={{
                ...thStyle,
                width: "10em"
              }}>
                  <span className="inline-flex items-center gap-1">
                    Tindakan
                    <ActionFilter selected={actions} onChange={value => {
                    setActions(value);
                    setPage(1);
                  }} />
                  </span>
                </th>

                <th className="bg-[color:var(--list-info-bg,#cffafe)]" style={thStyle}>Tipe</th>
                <th className="bg-[color:var(--list-info-bg,#cffafe)]" style={thStyle}>Nomor</th>

                <th className="bg-[color:var(--list-info-bg,#cffafe)]" style={thStyle}>
                  <span className="inline-flex items-center gap-1">
                    Pengguna
                    <UserFilter selected={users} onChange={value => {
                    setUsers(value);
                    setPage(1);
                  }} />
                  </span>
                </th>

                <th className="bg-[color:var(--list-info-bg,#cffafe)]" style={{
                ...thStyle,
                width: "40%"
              }}>Detil</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? <tr>
                  <td colSpan={6} style={{
                ...tdStyle,
                textAlign: "center",
                height: 309
              }}>
                    <p className="m-0 text-[14px]" style={{
                  color: "var(--list-text,#404040)"
                }}>
                      Tidak ada data untuk ditampilkan
                    </p>
                  </td>
                </tr> : pageItems.map(row => <tr key={row.id} style={{
              background: "var(--list-surface,#fff)"
            }}>
                    <td style={{
                ...tdStyle,
                whiteSpace: "nowrap"
              }}>
                      {row.tanggal}
                    </td>
                    <td style={tdStyle}>{row.tindakan}</td>
                    <td style={tdStyle}>{row.tipe}</td>
                    <td style={tdStyle}>{row.nomor}</td>
                    <td style={tdStyle}>{row.pengguna}</td>
                    <td style={tdStyle}>{row.detil}</td>
                  </tr>)}
            </tbody>
          </table>
        </div>

        <LegacyPagination page={safePage} totalPages={totalPages} onPage={setPage} />

        <p className="m-0 py-2 text-[14px]" style={{
        background: "var(--list-surface,#fff)",
        color: MK.legacyText
      }}>
          Waktu dalam GMT +7
        </p>
      </div>
    </div>;
}
