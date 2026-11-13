import { useMemo, useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { DownloadSimple, CaretDown, ChatCircleDots, Funnel, X, CaretLeft, CaretRight, Check, MagnifyingGlass } from "@phosphor-icons/react";
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
const btnOutline = "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[color:var(--list-border,#d0d6dd)] bg-[color:var(--list-surface,#fff)] px-4 text-[14px] font-semibold text-[color:var(--list-link,#4b61dd)] transition-colors hover:bg-[color:var(--list-subtle,#f8f9fb)]";
const btnGhost = "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-transparent px-4 text-[14px] font-semibold text-[color:var(--list-muted,#626b79)] transition-colors hover:bg-[color:var(--list-hover,#f1f5f9)]";
const iconBtn = "inline-flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[color:var(--list-muted,#626b79)] transition-colors hover:bg-[color:var(--list-hover,#f1f5f9)] hover:text-[color:var(--list-text,#232933)]";
const inputBase = "h-[38px] w-full rounded-md border border-[color:var(--list-border,#d0d6dd)] bg-[color:var(--list-surface,#fff)] px-3 text-[14px] outline-none transition-colors placeholder:text-[color:var(--list-placeholder,#8f96a3)] focus:border-[color:var(--list-brand,#4b61dd)]";
const thBase = "bg-[color:var(--list-subtle,#f8f9fb)] px-2 py-4 text-left text-[14px] font-semibold leading-5 align-middle";
const tdBase = "bg-[color:var(--list-surface,#fff)] px-2 py-3.5 text-[14px] leading-5 align-middle";
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
function Drawer({
  title,
  onClose,
  children,
  footer,
  width = 414
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
  return createPortal(<div data-list-theme={theme?.colorScheme} style={{
    ...theme,
    color: MK.text,
    fontFamily: MK_FONT
  }}>
      <div className="fixed inset-0 z-[9999]" style={{
      background: "rgba(35,41,51,.35)"
    }} onClick={onClose} />

      <aside role="dialog" aria-modal="true" className="fixed right-0 top-0 z-[10000] flex h-full flex-col bg-[color:var(--list-surface,#fff)]" aria-label={title} style={{
      width,
      boxShadow: "-4px 0 16px rgba(0,0,0,.12)",
      maxWidth: "100vw"
    }}>
        <header className="flex h-[45px] shrink-0 items-center justify-between border-b px-4" style={{
        borderColor: MK.border
      }}>
          <p className="m-0 text-[14px] font-semibold" style={{
          color: MK.text
        }}>
            {title}
          </p>
          <button type="button" onClick={onClose} aria-label="Tutup" className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-[color:var(--list-hover,#f1f5f9)]" style={{
          color: MK.muted
        }}>
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {footer ? <div className="flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3" style={{
        borderColor: MK.border
      }}>
            {footer}
          </div> : null}
      </aside>
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
const exportFeatureOptions = ["Semua fitur", "Jurnal", "Laporan piutang pelanggan", "Daftar pengeluaran", "Laporan hutang supplier", "Daftar penjualan", "Daftar pembelian", "Ringkasan pergerakan stok barang gudang", "Buku besar", "Ringkasan bisnis", "Detail aset tetap", "Ekspor produk", "Ekspor kontak", "Ekspor bom (termasuk biaya produksi)", "Ekspor bom", "Penjualan per pelanggan", "Nilai stok gudang", "Penjualan/pelepasan asset", "Laporan keuntungan produk", "Daftar proforma invoice", "Daftar tukar faktur", "Neraca", "Stok opname", "Ekspor produk bundle", "Konversi produk", "Tingkat pemenuhan pesanan", "Perputaran persediaan barang", "Kuantitas produk dengan nomor seri", "Gudang berisi produk bernomor seri"];
const exportRows = [];
const exportStatusOptions = ["Semua status", "Dalam antrian", "Working", "Selesai", "Gagal mengekspor"];
const importFeatureOptions = ["Semua fitur", "Akun", "Aset", "Biaya", "Bill of material", "Buat produk", "Faktur pembelian", "Gudang", "Hellobill", "Jurnal umum", "Kontak", "Kredit memo pelanggan", "Kredit memo supplier", "Pelanggan", "Pembayaran pembelian", "Penagihan penjualan", "Penawaran pembelian", "Penawaran penjualan", "Perintah kerja", "Pesanan pembelian", "Pesanan penjualan", "Produk bundle", "Rekening koran", "Stok opname", "Supplier", "Terima pembayaran", "Transfer gudang", "Update pajak produk", "Update produk", "Update produk bundle"];
const importRows = [];
const importStatusOptions = ["Semua status", "Selesai", "Menunggu dihapus", "Dalam antrian", "Dalam proses", "Gagal mengimpor", "Gagal menghapus", "Diimpor sebagian"];
const TABS = [{
  id: "impor",
  label: "Impor"
}, {
  id: "ekspor",
  label: "Ekspor"
}];
const emptyFilter = {
  startDate: "",
  endDate: ""
};
const toComparable = value => {
  const date = value.split(",")[0];
  const [day, month, year] = date.split("/");
  return `${year}${month}${day}`;
};
function FilterSelect({
  value,
  options,
  onChange,
  placeholder,
  full
}) {
  const dropdown = useDropdown();
  return <>
      <button type="button" ref={dropdown.triggerRef} data-dropdown-trigger onClick={dropdown.toggle} className={`flex h-[38px] cursor-pointer items-center justify-between gap-2 rounded-md border bg-[color:var(--list-surface,#fff)] px-3 text-left text-[14px] ${full ? "w-full" : "w-[237px]"}`} style={{
      borderColor: MK.border,
      color: value ? MK.text : "var(--list-muted,#8f96a3)"
    }}>
        <span className="truncate">{value || placeholder}</span>
        <CaretDown size={14} style={{
        color: MK.muted
      }} />
      </button>

      <DropdownPanel rect={dropdown.rect} onClose={dropdown.close} minWidth={full ? 0 : 237} maxHeight={360}>
        {options.map(option => <MenuItem key={option} selected={option === value} onClick={() => {
        onChange(option);
        dropdown.close();
      }}>
            {option}
          </MenuItem>)}
      </DropdownPanel>
    </>;
}
function FilterModal({
  initial,
  featureOptions,
  statusOptions,
  onApply,
  onReset,
  onClose
}) {
  const [draft, setDraft] = useState(initial);
  const update = (field, value) => setDraft(current => ({
    ...current,
    [field]: value
  }));
  return <Drawer title="Filter" onClose={onClose} footer={<>
          <button type="button" className="mr-auto cursor-pointer border-0 bg-transparent text-[14px] font-semibold" style={{
      color: MK.muted
    }} onClick={() => {
      setDraft({
        startDate: "",
        endDate: "",
        status: "",
        fitur: ""
      });
      onReset();
    }}>
            Reset filter
          </button>

          <button type="button" className={btnGhost} onClick={onClose}>
            Batalkan
          </button>

          <button type="button" className={btnPrimary} onClick={() => onApply(draft)}>
            Terapkan
          </button>
        </>}>
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-[13px]" style={{
          color: MK.muted
        }} htmlFor="filter_start">
            Tanggal awal
          </label>

          <input id="filter_start" type="date" value={draft.startDate} onChange={event => update("startDate", event.target.value)} className="h-[38px] w-full rounded-md border px-3 text-[14px] outline-none placeholder:text-[color:var(--list-placeholder)]" style={{
          borderColor: MK.border,
          color: MK.text
        }} />
        </div>

        <div>
          <label className="mb-1 block text-[13px]" style={{
          color: MK.muted
        }} htmlFor="filter_end">
            Tanggal akhir
          </label>

          <input id="filter_end" type="date" value={draft.endDate} onChange={event => update("endDate", event.target.value)} className="h-[38px] w-full rounded-md border px-3 text-[14px] outline-none placeholder:text-[color:var(--list-placeholder)]" style={{
          borderColor: MK.border,
          color: MK.text
        }} />
        </div>

        <div>
          <span className="mb-1 block text-[13px]" style={{
          color: MK.muted
        }}>
            Status
          </span>

          <FilterSelect value={draft.status} options={statusOptions} onChange={value => update("status", value === "Semua status" ? "" : value)} placeholder="Semua status" full />
        </div>

        <div>
          <span className="mb-1 block text-[13px]" style={{
          color: MK.muted
        }}>
            Fitur
          </span>

          <FilterSelect value={draft.fitur} options={featureOptions} onChange={value => update("fitur", value === "Semua fitur" ? "" : value)} placeholder="Semua fitur" full />
        </div>
      </div>
    </Drawer>;
}
function ImportInfo({
  onClose,
  onReload
}) {
  return <div className="relative mb-4 rounded-md px-4 py-4" style={{
    background: "var(--list-subtle,#eaecfb)"
  }}>
      <p className="m-0 text-[14px] font-semibold" style={{
      color: MK.text
    }}>
        Info status impor
      </p>

      <p className="m-0 mt-1 text-[14px] leading-[24px]" style={{
      color: MK.text
    }}>
        <span className="font-semibold">Dalam antrean:</span> Silakan tunggu
        hingga diproses.
        <br />
        <span className="font-semibold">Dalam proses:</span> Bisa memakan waktu
        hingga 1×24 jam. Cek berkala dengan muat ulang halaman atau hubungi tim
        support jika lebih dari 24 jam.
      </p>

      <div className="mt-1 flex items-center gap-4">
        <button type="button" onClick={onReload} className="cursor-pointer border-0 bg-transparent p-0 text-[14px]" style={{
        color: "var(--list-link,#4b61dd)"
      }}>
          Muat ulang halaman
        </button>

        <span className="text-[14px]" style={{
        color: "var(--list-link,#4b61dd)",
        cursor: "default"
      }} aria-disabled="true">
          Hubungi tim support
        </span>
      </div>

      <button type="button" onClick={onClose} aria-label="Tutup info" className="absolute right-3 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-[color:var(--list-hover,#ffffff99)]" style={{
      color: MK.text
    }}>
        <X size={16} />
      </button>
    </div>;
}
export default function ImportExportPage() {
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
  const [tab, setTab] = useState("impor");
  const [search, setSearch] = useState("");
  const [feature, setFeature] = useState("");
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState(emptyFilter);
  const [showInfo, setShowInfo] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const source = tab === "impor" ? importRows : exportRows;
  const featureOptions = tab === "impor" ? importFeatureOptions : exportFeatureOptions;
  const statusOptions = tab === "impor" ? importStatusOptions : exportStatusOptions;
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return source.filter(row => {
      const matchKeyword = !keyword || row.fitur.toLowerCase().includes(keyword) || row.status.toLowerCase().includes(keyword) || row.waktu.toLowerCase().includes(keyword);
      const matchFeature = !feature || row.fitur === feature;
      const matchStatus = !status || row.status === status;
      const comparable = toComparable(row.waktu);
      const matchStart = !filter.startDate || comparable >= filter.startDate.replace(/-/g, "");
      const matchEnd = !filter.endDate || comparable <= filter.endDate.replace(/-/g, "");
      return matchKeyword && matchFeature && matchStatus && matchStart && matchEnd;
    });
  }, [source, search, feature, status, filter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);
  const switchTab = next => {
    setTab(next);
    setPage(1);
    setSearch("");
    setFeature("");
    setStatus("");
    setFilter(emptyFilter);
  };
  return <div className="-m-4 min-h-[calc(100%+2rem)] md:-m-6 md:min-h-[calc(100%+3rem)]" style={{
    ...pageTheme,
    background: "var(--list-subtle,#f1f5f9)",
    fontFamily: MK_FONT
  }} data-list-theme={pageTheme.colorScheme}>{isDark && <style>{"[data-list-theme=\"dark\"] h1,[data-list-theme=\"dark\"] h2{color:#fff!important}\n[data-list-theme=\"dark\"] table{background-color:#1a1a1a;color:#fff}\n[data-list-theme=\"dark\"] thead,[data-list-theme=\"dark\"] th{background-color:#2b2418!important;color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] td{color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] th :is(a,span,div,p,strong,small,button),[data-list-theme=\"dark\"] td :is(a,span,div,p,strong,small):not(button *){color:#fff!important}\n[data-list-theme=\"dark\"] tbody tr:hover{background-color:rgba(229,184,92,.12)!important}\n[data-list-theme=\"dark\"][data-list-dropdown] button:hover,[data-list-theme=\"dark\"] [role=\"option\"]:hover{background-color:rgba(229,184,92,.15)!important;color:#E5B85C!important}\n[data-list-theme=\"dark\"] input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]),[data-list-theme=\"dark\"] select,[data-list-theme=\"dark\"] textarea{background-color:#1a1a1a;color:#f1f5f9;border-color:#634f27;caret-color:#E5B85C}\n[data-list-theme=\"dark\"] input::placeholder,[data-list-theme=\"dark\"] textarea::placeholder{color:#94a3b8}\n[data-list-theme=\"dark\"] input:focus,[data-list-theme=\"dark\"] select:focus,[data-list-theme=\"dark\"] textarea:focus{border-color:#E5B85C!important;box-shadow:0 0 0 3px rgba(229,184,92,.15)}\n[data-list-theme=\"dark\"] input[type=\"checkbox\"],[data-list-theme=\"dark\"] input[type=\"radio\"]{accent-color:#E5B85C}\n[data-list-theme=\"dark\"] button:disabled{background-color:#36312a!important;color:#94a3b8!important;border-color:#634f27}\n[data-list-theme=\"dark\"] ::selection{background-color:#E5B85C;color:#121212}"}</style>}
      <div className="px-6 pb-2 pt-[18px]">
        <PixelHeader title="Daftar Impor & Ekspor" breadcrumbTo="/daftar-lainnya" action={<button type="button" className={btnOutline}>
              <ChatCircleDots size={16} />
              Beri masukan
            </button>} />
      </div>

      <div className="flex items-center gap-6 px-6">
        {TABS.map(item => {
        const active = tab === item.id;
        return <button key={item.id} type="button" onClick={() => switchTab(item.id)} className="relative flex h-[48px] cursor-pointer items-center border-0 bg-transparent text-[14px]" style={{
          color: active ? MK.brand : MK.muted
        }}>
              {item.label}

              <span className="absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2" style={{
            background: active ? MK.brand : "transparent",
            width: 37
          }} />
            </button>;
      })}
      </div>

      <section className="rounded-md bg-[color:var(--list-surface,#fff)] p-6" style={{
      border: `1px solid ${MK.border}`
    }}>
        {tab === "impor" && showInfo ? <ImportInfo onClose={() => setShowInfo(false)} onReload={() => {
        setSearch("");
        setFeature("");
        setStatus("");
        setFilter(emptyFilter);
        setPage(1);
      }} /> : null}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <FilterSelect value={feature} options={featureOptions} onChange={value => {
            setFeature(value === "Semua fitur" ? "" : value);
            setPage(1);
          }} placeholder="Semua fitur" />

            <FilterSelect value={status} options={statusOptions} onChange={value => {
            setStatus(value === "Semua status" ? "" : value);
            setPage(1);
          }} placeholder="Semua status" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {tab === "impor" ? <>
                <SearchInput value={search} onChange={value => {
              setSearch(value);
              setPage(1);
            }} placeholder="Cari file" className="w-[240px]" />

                <button type="button" onClick={() => setShowFilter(true)} className="inline-flex h-[38px] cursor-pointer items-center gap-1.5 rounded-md border px-4 text-[14px] font-semibold" style={{
              borderColor: MK.border,
              color: "var(--list-link,#4b61dd)",
              background: filter.startDate || filter.endDate || filter.status || filter.fitur ? "var(--list-subtle,#f2f5ff)" : "var(--list-surface,#fff)"
            }}>
                  <Funnel size={15} />
                  Filter
                </button>
              </> : null}
          </div>
        </div>

        {tab === "impor" && <>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thBase} style={{
                color: MK.text,
                width: "30%"
              }}>
                    Tanggal &amp; waktu
                  </th>
                  <th className={thBase} style={{
                color: MK.text,
                width: "18%"
              }}>
                    Status
                  </th>
                  <th className={thBase} style={{
                color: MK.text,
                width: "25%"
              }}>
                    Fitur
                  </th>
                  <th className={thBase} style={{
                color: MK.text,
                width: "16%"
              }}>
                    Periode
                  </th>
                  <th className={thBase} style={{
                width: 188
              }} />
                </tr>
              </thead>

              <tbody>
                {pageItems.length === 0 ? <tr>
                    <td colSpan={5} className="bg-[color:var(--list-surface,#fff)] p-0">
                      <EmptyState image={emptyFolderImg} title="Belum ada file" description="Daftar file Anda akan muncul di sini." />
                    </td>
                  </tr> : pageItems.map(row => <tr key={row.id} className="hover:bg-[color:var(--list-hover,#fafbff)]">
                      <td className={`${tdBase} py-5`} style={{
                color: MK.text
              }}>
                        {row.waktu}
                      </td>

                      <td className={`${tdBase} py-5`}>
                        <StatusBadge status={row.status} />
                      </td>

                      <td className={`${tdBase} py-5`} style={{
                color: MK.text
              }}>
                        {row.fitur}
                      </td>

                      <td className={`${tdBase} py-5`} style={{
                color: MK.text
              }}>
                        {row.periode}
                      </td>

                      <td className={`${tdBase} py-5`}>
                        <div className="flex justify-end">
                          <button type="button" className={iconBtn} title={row.status === "Selesai" ? "Unduh file" : "File belum bisa diunduh"} aria-label={`Unduh ${row.fitur}`} disabled={row.status !== "Selesai"} style={row.status !== "Selesai" ? {
                    color: "var(--list-muted,#c3c9d4)",
                    cursor: "not-allowed"
                  } : undefined}>
                            <DownloadSimple size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>)}
              </tbody>
            </table>

            <TableFooter pageSize={pageSize} onPageSize={value => {
          setPageSize(value);
          setPage(1);
        }} from={from} to={to} total={filtered.length} page={safePage} totalPages={totalPages} onPage={setPage} />
          </>}

        {tab === "ekspor" && <EmptyState image={emptyFolderImg} title="Belum ada file" description="Daftar file Anda akan muncul di sini." />}
      </section>

      {showFilter ? <FilterModal initial={{
      startDate: filter.startDate,
      endDate: filter.endDate,
      status,
      fitur: feature
    }} featureOptions={featureOptions} statusOptions={statusOptions} onClose={() => setShowFilter(false)} onApply={draft => {
      setFilter({
        startDate: draft.startDate,
        endDate: draft.endDate
      });
      setFeature(draft.fitur || "");
      setStatus(draft.status || "");
      setPage(1);
      setShowFilter(false);
    }} onReset={() => {
      setFilter(emptyFilter);
      setFeature("");
      setStatus("");
      setPage(1);
    }} /> : null}
    </div>;
}
