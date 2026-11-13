import { useMemo, useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { PencilSimple, Plus, Trash, X, CaretDown, CaretLeft, CaretRight, Check, MagnifyingGlass } from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";
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
function MenuItem({
  children,
  onClick,
  selected,
  icon,
  danger
}) {
  return <button type="button" onClick={onClick} className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-[15px] py-[6px] text-left text-[13px] transition-colors hover:bg-[color:var(--list-hover,#f2f5ff)]" style={{
    color: danger ? "var(--list-danger-text, #e74c3c)" : "var(--list-text, #000)"
  }}>
      {selected ? <Check size={13} style={{
      color: "var(--list-link,#4b61dd)"
    }} /> : null}
      {icon}
      <span className="truncate">{children}</span>
    </button>;
}
function PixelHeader({
  title,
  action,
  breadcrumb = "Daftar lainnya",
  breadcrumbClass,
  breadcrumbTo
}) {
  const crumbClass = breadcrumbClass || "m-0 text-[14px] leading-[20px]";
  return <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
      <div className="min-w-0 w-full md:w-auto">
        {breadcrumbTo ? <Link to={breadcrumbTo} className={`${crumbClass} inline-block cursor-pointer no-underline hover:underline`} style={{
        color: MK.link
      }}>
            {breadcrumb}
          </Link> : <p className={crumbClass} style={{
        color: breadcrumbClass ? undefined : MK.brand
      }}>
            {breadcrumb}
          </p>}
        <h1 className="m-0 mt-0.5 text-[24px] font-semibold leading-[32px]" style={{
        color: MK.text
      }}>
          {title}
        </h1>
      </div>
      {action ? <div className="shrink-0 pt-1">{action}</div> : null}
    </div>;
}
const btnPrimary = "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-[color:var(--list-brand,#4b61dd)] px-4 text-[14px] font-semibold text-[color:var(--list-brand-text,#fff)] transition-colors hover:bg-[color:var(--list-brand-hover,#3f52c9)] disabled:cursor-not-allowed disabled:bg-[color:var(--list-disabled-bg,#a9a9a9)]";
const btnGhost = "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-transparent px-4 text-[14px] font-semibold text-[color:var(--list-muted,#626b79)] transition-colors hover:bg-[color:var(--list-hover,#f1f5f9)]";
const iconBtn = "inline-flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[color:var(--list-muted,#626b79)] transition-colors hover:bg-[color:var(--list-hover,#f1f5f9)] hover:text-[color:var(--list-text,#232933)]";
const inputBase = "h-[38px] w-full rounded-md border border-[color:var(--list-border,#d0d6dd)] bg-[color:var(--list-surface,#fff)] px-3 text-[14px] outline-none transition-colors placeholder:text-[color:var(--list-placeholder,#8f96a3)] focus:border-[color:var(--list-brand,#4b61dd)]";
const thBase = "bg-[color:var(--list-subtle,#f8f9fb)] px-2 py-4 text-left text-[14px] font-semibold leading-5 align-middle";
const tdBase = "bg-[color:var(--list-surface,#fff)] px-2 py-3.5 text-[14px] leading-5 align-middle";
const tdAction = "bg-[color:var(--list-surface,#fff)] px-2 py-[9px] text-[14px] leading-5 align-middle";
function SearchInput({
  value,
  onChange,
  placeholder,
  className = ""
}) {
  return <div className={`relative ${className}`}>
      <MagnifyingGlass size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{
      color: MK.muted
    }} />
      <input type="text" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className={`${inputBase} pl-9`} />
      {value ? <button type="button" onClick={() => onChange("")} aria-label="Bersihkan pencarian" className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded border-0 bg-transparent" style={{
      color: MK.muted
    }}>
          <X size={13} />
        </button> : null}
    </div>;
}
function TableFooter({
  pageSize,
  onPageSize,
  from,
  to,
  total,
  page,
  totalPages,
  onPage,
  pageSizeOptions = [5, 10, 25, 50, 100]
}) {
  const size = useDropdown();
  const [jump, setJump] = useState(String(page));
  useEffect(() => setJump(String(page)), [page]);
  const commitJump = () => {
    const next = Number(jump);
    if (!Number.isFinite(next) || next < 1) return setJump(String(page));
    onPage(Math.min(Math.max(1, Math.trunc(next)), totalPages));
  };
  return <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-4">
        <p className="m-0 text-[14px]" style={{
        color: MK.muted
      }}>
          Baris per halaman
        </p>
        <button type="button" ref={size.triggerRef} data-dropdown-trigger onClick={size.toggle} className="flex h-7 cursor-pointer items-center gap-1 rounded border-0 bg-transparent px-1.5 text-[14px] font-semibold" style={{
        color: MK.text
      }}>
          {pageSize}
          <CaretDown size={12} />
        </button>
        <DropdownPanel rect={size.rect} onClose={size.close} minWidth={72}>
          {pageSizeOptions.map(option => <MenuItem key={option} selected={option === pageSize} onClick={() => {
          onPageSize(option);
          size.close();
        }}>
              {option}
            </MenuItem>)}
        </DropdownPanel>

        <p className="m-0 text-[14px]" style={{
        color: MK.muted
      }}>
          Menampilkan <span>{from}</span> - <span>{to}</span> dari{" "}
          <span>{total}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input value={jump} onChange={event => setJump(event.target.value.replace(/[^\d]/g, ""))} onBlur={commitJump} onKeyDown={event => {
        if (event.key === "Enter") commitJump();
      }} className="h-[30px] w-[88px] rounded-md border bg-[color:var(--list-surface,#fff)] px-2 text-center text-[14px] outline-none placeholder:text-[color:var(--list-placeholder)]" style={{
        borderColor: MK.border,
        color: MK.text
      }} aria-label="Lompat ke halaman" />
        <p className="m-0 text-[14px]" style={{
        color: MK.muted
      }}>
          dari <span>{totalPages}</span> halaman
        </p>
        <button type="button" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1} aria-label="Halaman sebelumnya" className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border bg-[color:var(--list-surface,#fff)] disabled:cursor-not-allowed" style={{
        borderColor: MK.border,
        color: page <= 1 ? "var(--list-muted,#c3c9d4)" : MK.muted
      }}>
          <CaretLeft size={14} />
        </button>
        <button type="button" onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} aria-label="Halaman berikutnya" className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border bg-[color:var(--list-surface,#fff)] disabled:cursor-not-allowed" style={{
        borderColor: MK.border,
        color: page >= totalPages ? "var(--list-muted,#c3c9d4)" : MK.muted
      }}>
          <CaretRight size={14} />
        </button>
      </div>
    </div>;
}
function Modal({
  title,
  onClose,
  children,
  footer,
  width = 448
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
  useEffect(() => {
    const onKey = event => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(<div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" data-list-theme={theme?.colorScheme} style={{
    ...theme,
    color: MK.text,
    background: "rgba(35,41,51,.45)",
    fontFamily: MK_FONT
  }} onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
      <div role="dialog" aria-modal="true" className="w-full overflow-visible rounded-md bg-[color:var(--list-surface,#fff)]" aria-label={title} style={{
      maxWidth: width,
      border: "1px solid var(--list-border, var(--list-border,#8b95a5))",
      boxShadow: "0 10px 15px rgba(0,0,0,.1)"
    }}>
        <header className="flex h-[45px] items-center justify-between rounded-t-md px-4" style={{
        background: "var(--list-subtle, #f1f5f9)"
      }}>
          <p className="m-0 text-[14px] font-semibold" style={{
          color: "var(--list-text, #212121)"
        }}>
            {title}
          </p>
          <button type="button" onClick={onClose} aria-label="Tutup" className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-[color:var(--list-hover,#ffffffb3)]" style={{
          color: MK.muted
        }}>
            <X size={16} />
          </button>
        </header>

        <div className="px-4 py-3">{children}</div>

        {footer ? <div className="flex items-center justify-end gap-2 px-4 pb-4 pt-1">
            {footer}
          </div> : null}
      </div>
    </div>, document.body);
}
function EmptyState({
  image,
  title,
  description
}) {
  return <div className="flex flex-col items-center justify-center gap-1 px-6 py-[120px] text-center">
      {image ? <img src={image} alt="" className="h-[128px] w-[128px] object-contain" /> : null}
      <p className="m-0 text-[16px] font-semibold" style={{
      color: MK.text,
      marginTop: image ? 12 : 0
    }}>
        {title}
      </p>
      <p className="m-0 text-[14px]" style={{
      color: MK.muted
    }}>
        {description}
      </p>
    </div>;
}
const unitRows = [];
function can(module, action = "see") {
  if (localStorage.getItem("user_role") === "MANAGER") return true;
  try {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
    return Boolean(permissions?.[module]?.[action]);
  } catch {
    return false;
  }
}
const MAX_LENGTH = 100;
function UnitFormModal({
  initialValue,
  existingNames,
  onClose,
  onSubmit
}) {
  const [name, setName] = useState(initialValue || "");
  const [error, setError] = useState("");
  const isEdit = Boolean(initialValue);
  const trimmed = name.trim();
  const submit = event => {
    event.preventDefault();
    if (!trimmed) return setError("Unit wajib diisi");
    if (existingNames.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
      return setError("Unit sudah terdaftar");
    }
    onSubmit(trimmed);
  };
  return <Modal title={isEdit ? "Ubah unit" : "Tambah unit"} onClose={onClose} width={448} footer={<>
          <button type="button" className={btnGhost} onClick={onClose}>
            Batalkan
          </button>
          <button type="button" className={btnPrimary} onClick={submit} disabled={!trimmed} style={!trimmed ? {
      background: "var(--list-disabled-bg,#a9a9a9)",
      cursor: "not-allowed"
    } : undefined}>
            Simpan
          </button>
        </>}>
      <form onSubmit={submit}>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="unit_name" className="text-[14px] font-semibold" style={{
          color: MK.text
        }}>
            Unit
          </label>
          <span className="text-[12px]" style={{
          color: MK.muted
        }}>
            {name.length} / {MAX_LENGTH}
          </span>
        </div>

        <div className="relative">
          <input id="unit_name" type="text" maxLength={MAX_LENGTH} autoFocus value={name} placeholder="Contoh: Pcs" onChange={event => {
          setName(event.target.value);
          setError("");
        }} className="h-[38px] w-full rounded-md border bg-[color:var(--list-surface,#fff)] px-3 pr-9 text-[14px] outline-none focus:border-[color:var(--list-brand,#4b61dd)] placeholder:text-[color:var(--list-placeholder)]" style={{
          borderColor: MK.border,
          color: MK.text
        }} />
          {name ? <button type="button" onClick={() => setName("")} aria-label="Bersihkan" className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded border-0 bg-transparent" style={{
          color: MK.muted
        }}>
              <X size={13} />
            </button> : null}
        </div>

        {error ? <p className="m-0 mt-1.5 text-[12px]" style={{
        color: "var(--list-danger-text,#d64545)"
      }}>
            {error}
          </p> : null}
      </form>
    </Modal>;
}
function DeleteUnitModal({
  count,
  onClose,
  onConfirm
}) {
  return <Modal title="Hapus unit?" onClose={onClose} width={448} footer={<>
          <button type="button" className={btnGhost} onClick={onClose}>
            Batalkan
          </button>
          <button type="button" onClick={onConfirm} className="inline-flex h-[38px] cursor-pointer items-center justify-center rounded-md border-0 px-4 text-[14px] font-semibold text-white" style={{
      background: "var(--list-danger-button,#e74c3c)"
    }}>
            Hapus
          </button>
        </>}>
      <p className="m-0 text-[14px]" style={{
      color: MK.text
    }}>
        {count > 1 ? `${count} unit yang dihapus tidak dapat dikembalikan.` : "Unit yang dihapus tidak dapat dikembalikan."}
      </p>
    </Modal>;
}
export default function UnitsPage() {
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
  const [rows, setRows] = useState(unitRows);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingIds, setDeletingIds] = useState(null);
  const keyword = search.trim().toLowerCase();
  const filtered = useMemo(() => rows.filter(row => row.nama.toLowerCase().includes(keyword)), [rows, keyword]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageIds = pageItems.map(row => row.id);
  const allSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id));
  const toggleRow = id => setSelectedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const toggleAll = () => setSelectedIds(current => allSelected ? current.filter(id => !pageIds.includes(id)) : [...new Set([...current, ...pageIds])]);
  const existingNames = rows.filter(row => !editingRow || row.id !== editingRow.id).map(row => row.nama);
  const submitForm = name => {
    if (editingRow) {
      setRows(current => current.map(row => row.id === editingRow.id ? {
        ...row,
        nama: name
      } : row));
    } else {
      const nextId = rows.length ? Math.max(...rows.map(row => row.id)) + 1 : 1;
      setRows(current => [...current, {
        id: nextId,
        nama: name
      }]);
    }
    setShowForm(false);
    setEditingRow(null);
  };
  const confirmDelete = () => {
    setRows(current => current.filter(row => !deletingIds.includes(row.id)));
    setSelectedIds(current => current.filter(id => !deletingIds.includes(id)));
    setDeletingIds(null);
  };
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);
  return <div className="-m-4 min-h-[calc(100%+2rem)] md:-m-6 md:min-h-[calc(100%+3rem)]" style={{
    ...pageTheme,
    background: "var(--list-subtle,#f1f5f9)",
    fontFamily: MK_FONT
  }} data-list-theme={pageTheme.colorScheme}>{isDark && <style>{"[data-list-theme=\"dark\"] h1,[data-list-theme=\"dark\"] h2{color:#fff!important}\n[data-list-theme=\"dark\"] table{background-color:#1a1a1a;color:#fff}\n[data-list-theme=\"dark\"] thead,[data-list-theme=\"dark\"] th{background-color:#2b2418!important;color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] td{color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] th :is(a,span,div,p,strong,small,button),[data-list-theme=\"dark\"] td :is(a,span,div,p,strong,small):not(button *){color:#fff!important}\n[data-list-theme=\"dark\"] tbody tr:hover{background-color:rgba(229,184,92,.12)!important}\n[data-list-theme=\"dark\"][data-list-dropdown] button:hover,[data-list-theme=\"dark\"] [role=\"option\"]:hover{background-color:rgba(229,184,92,.15)!important;color:#E5B85C!important}\n[data-list-theme=\"dark\"] input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]),[data-list-theme=\"dark\"] select,[data-list-theme=\"dark\"] textarea{background-color:#1a1a1a;color:#f1f5f9;border-color:#634f27;caret-color:#E5B85C}\n[data-list-theme=\"dark\"] input::placeholder,[data-list-theme=\"dark\"] textarea::placeholder{color:#94a3b8}\n[data-list-theme=\"dark\"] input:focus,[data-list-theme=\"dark\"] select:focus,[data-list-theme=\"dark\"] textarea:focus{border-color:#E5B85C!important;box-shadow:0 0 0 3px rgba(229,184,92,.15)}\n[data-list-theme=\"dark\"] input[type=\"checkbox\"],[data-list-theme=\"dark\"] input[type=\"radio\"]{accent-color:#E5B85C}\n[data-list-theme=\"dark\"] button:disabled{background-color:#36312a!important;color:#94a3b8!important;border-color:#634f27}\n[data-list-theme=\"dark\"] ::selection{background-color:#E5B85C;color:#121212}"}</style>}
      <div className="px-6 py-[18px]">
        <PixelHeader title="Unit" breadcrumbTo="/daftar-lainnya" action={can("products", "create") ? <button type="button" className={btnPrimary} onClick={() => {
        setEditingRow(null);
        setShowForm(true);
      }}>
                <Plus size={16} weight="bold" />
                Unit Baru
              </button> : null} />
      </div>

      <div>
        <section className="rounded-md bg-[color:var(--list-surface,#fff)] p-6" style={{
        border: `1px solid ${MK.border}`
      }}>
          <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
            {selectedIds.length > 0 ? <div className="mr-auto flex items-center gap-3 rounded-md border border-[color:var(--list-border,#d6dfff)] bg-[color:var(--list-selection,#f2f5ff)] px-3 py-1.5">
                <span className="text-[13px] font-semibold" style={{
              color: "var(--list-link,#4b61dd)"
            }}>
                  {selectedIds.length} unit dipilih
                </span>
                {can("products", "delete") && <button type="button" className="cursor-pointer border-0 bg-transparent text-[13px] font-semibold" style={{
              color: "var(--list-danger-text,#d64545)"
            }} onClick={() => setDeletingIds(selectedIds)}>
                    Hapus
                  </button>}
                <button type="button" className="cursor-pointer border-0 bg-transparent text-[13px] font-semibold" style={{
              color: MK.muted
            }} onClick={() => setSelectedIds([])}>
                  Batalkan
                </button>
              </div> : null}

            <SearchInput value={search} onChange={value => {
            setSearch(value);
            setPage(1);
          }} placeholder="Cari unit" className="w-[240px]" />
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${thBase} w-6`} style={{
                color: MK.text
              }}>
                  <div className="flex h-5 items-center">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Pilih semua" className="h-4 w-4 cursor-pointer accent-[#4b61dd] placeholder:text-[color:var(--list-placeholder)]" />
                  </div>
                </th>
                <th className={thBase} style={{
                color: MK.text
              }}>
                  Unit
                </th>
                <th className={`${thBase} w-[104px]`} style={{
                color: MK.text
              }}>
                  <span className="sr-only">Tindakan</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? <tr>
                  <td colSpan={3} className="bg-[color:var(--list-surface,#fff)] p-0">
                    <EmptyState image={keyword ? undefined : emptyFolderImg} title={keyword ? "Unit tidak ditemukan" : "Belum ada unit"} description={keyword ? "Coba kata kunci lain untuk mencari unit." : "Daftar satuan produk akan muncul di sini."} />
                  </td>
                </tr> : pageItems.map(row => <tr key={row.id} className="hover:bg-[color:var(--list-hover,#fafbff)]">
                    <td className={tdBase} style={{
                color: MK.text
              }}>
                      <div className="flex h-5 items-center">
                        <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleRow(row.id)} aria-label={`Pilih ${row.nama}`} className="h-4 w-4 cursor-pointer accent-[#4b61dd] placeholder:text-[color:var(--list-placeholder)]" />
                      </div>
                    </td>
                    <td className={tdBase} style={{
                color: MK.text
              }}>
                      {row.nama}
                    </td>
                    <td className={tdAction}>
                      <div className="flex items-center justify-end gap-1">
                        {can("products", "edit") && <button type="button" className={iconBtn} onClick={() => {
                    setEditingRow(row);
                    setShowForm(true);
                  }} aria-label={`Ubah ${row.nama}`} title="Ubah">
                            <PencilSimple size={17} />
                          </button>}
                        {can("products", "delete") && <button type="button" className={iconBtn} onClick={() => setDeletingIds([row.id])} aria-label={`Hapus ${row.nama}`} title="Hapus">
                            <Trash size={17} />
                          </button>}
                      </div>
                    </td>
                  </tr>)}
            </tbody>
          </table>

          <TableFooter pageSize={pageSize} onPageSize={value => {
          setPageSize(value);
          setPage(1);
        }} from={from} to={to} total={filtered.length} page={safePage} totalPages={totalPages} onPage={setPage} />
        </section>
      </div>

      {showForm ? <UnitFormModal initialValue={editingRow?.nama} existingNames={existingNames} onClose={() => {
      setShowForm(false);
      setEditingRow(null);
    }} onSubmit={submitForm} /> : null}

      {deletingIds ? <DeleteUnitModal count={deletingIds.length} onClose={() => setDeletingIds(null)} onConfirm={confirmDelete} /> : null}
    </div>;
}
