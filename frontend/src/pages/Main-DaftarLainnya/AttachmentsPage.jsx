import { useMemo, useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import { CaretDown, MagnifyingGlass, X, Check } from "@phosphor-icons/react";
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
function LegacyModal({
  title,
  onClose,
  children,
  footer,
  width = 600
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
  return createPortal(<div data-list-theme={theme?.colorScheme} style={{
    ...theme,
    color: MK.text,
    fontFamily: MK_FONT
  }}>
      <div className="fixed inset-0 z-[9990]" style={{
      background: "#000",
      opacity: 0.5
    }} onClick={onClose} />
      <div className="fixed inset-0 z-[9995] flex items-start justify-center overflow-y-auto py-10">
        <div className="w-full rounded bg-[color:var(--list-surface,#fff)]" role="dialog" aria-modal="true" aria-label={title} style={{
        maxWidth: width,
        border: "1px solid rgba(0,0,0,.2)",
        boxShadow: "0 5px 15px rgba(0,0,0,.5)"
      }}>
          <div className="flex items-center justify-between px-4 py-3" style={{
          borderBottom: "1px solid var(--list-border, var(--list-border,#e5e5e5))"
        }}>
            <h4 className="m-0 text-[16.8px] font-medium" style={{
            color: "var(--list-text, #333)"
          }}>
              {title}
            </h4>
            <button type="button" onClick={onClose} aria-label="Tutup" className="cursor-pointer border-0 bg-transparent text-[21px] leading-none" style={{
            color: "var(--list-muted, #626b79)"
          }}>
              ×
            </button>
          </div>
          <div className="px-4 py-4">{children}</div>
          {footer ? <div className="flex items-center justify-end gap-2 px-4 py-3" style={{
          borderTop: "1px solid var(--list-border, var(--list-border,#e5e5e5))"
        }}>
              {footer}
            </div> : null}
        </div>
      </div>
    </div>, document.body);
}
const attachmentRows = [];
const newTransactionTypeOptions = ["Jual", "Beli", "Biaya", "Kirim uang", "Terima uang", "Transfer bank", "Kredit memo pelanggan", "Kredit memo supplier", "Jurnal umum", "Transfer gudang"];
const transactionTypeOptions = ["Faktur Penjualan", "Pesanan Penjualan", "Penawaran Penjualan", "Terima Bayaran", "Pembayaran Pesanan Penjualan", "Retur Penjualan", "Faktur Pembelian", "Pesanan Pembelian", "Penawaran Pembelian", "Pembayaran Pembelian", "Pembayaran Pesanan Pembelian", "Retur Pembelian", "Biaya", "Setoran Bank", "Transfer Bank", "Tarikan Bank", "Kredit Memo", "Pembayaran Kredit Memo", "Refund Credit Memo", "Jurnal Umum", "Transfer Gudang"];
const PAGE_SIZE = 10;
const ACTION_MENU = ["Download", "Hubungkan ke Transaksi", "Buat Transaksi Baru", "Ubah Tipe Transaksi"];
const LINK_TRANSACTIONS = ["SI/2026/10/014", "RB/2026/10/007", "PO/2026/10/003", "EXP/2026/10/021", "SO/2026/10/002", "JU/2026/10/009"];
const legacyInput = {
  height: 34,
  width: "100%",
  border: "1px solid var(--list-border,#cfd9db)",
  borderRadius: 4,
  padding: "0 12px",
  fontSize: 14,
  outline: "none",
  color: "var(--list-text,#333)",
  background: "var(--list-surface,#fff)"
};
const legacyLabel = {
  fontSize: "14.7px",
  color: "var(--list-text,#333)",
  fontWeight: 400
};
const btnPrimaryLegacy = {
  height: 34,
  padding: "6px 25px",
  background: MK.legacyPrimary,
  color: "var(--list-brand-text,#fff)",
  border: "1px solid " + MK.legacyPrimary,
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer"
};
const btnDangerLegacy = {
  height: 34,
  padding: "6px 20px",
  background: "var(--list-danger-button,#e74c3c)",
  color: "#fff",
  border: "1px solid var(--list-border,#e74c3c)",
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer"
};
const btnSuccess = disabled => ({
  height: 34,
  padding: "6px 16px",
  background: disabled ? "var(--list-subtle,#eee)" : "var(--list-success-button,#5cb85c)",
  color: disabled ? "var(--list-muted,#a9a9a9)" : "#fff",
  border: "1px solid " + (disabled ? "var(--list-border,#eee)" : "var(--list-border,#5cb85c)"),
  borderRadius: 3,
  fontSize: 14,
  cursor: disabled ? "not-allowed" : "pointer"
});
const btnSecondary = {
  height: 34,
  padding: "6px 16px",
  background: "transparent",
  color: "var(--list-text,#333)",
  border: "1px solid transparent",
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer"
};
const btnDanger = {
  height: 34,
  padding: "6px 18px",
  background: "var(--list-danger-button,#e74c3c)",
  color: "#fff",
  border: "1px solid var(--list-border,#e74c3c)",
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer"
};
function LegacySelect({
  value,
  onChange,
  options,
  placeholder,
  searchable
}) {
  const dropdown = useDropdown();
  const [keyword, setKeyword] = useState("");
  const term = keyword.trim().toLowerCase();
  const visible = term ? options.filter(option => option.toLowerCase().includes(term)) : options;
  return <>
      <button type="button" ref={dropdown.triggerRef} data-dropdown-trigger onClick={() => {
      setKeyword("");
      dropdown.toggle();
    }} className="flex cursor-pointer items-center justify-between gap-2 text-left" style={{
      height: 36,
      width: "100%",
      border: "1px solid var(--list-border,#ccc)",
      borderRadius: 4,
      padding: "0 10px",
      background: "var(--list-surface,#fff)",
      fontSize: 14,
      color: value ? "var(--list-text,#333)" : "var(--list-muted,#aaa)"
    }}>
        <span className="truncate">{value || placeholder}</span>
        <CaretDown size={12} style={{
        color: "var(--list-muted,#666)"
      }} />
      </button>

      <DropdownPanel rect={dropdown.rect} onClose={dropdown.close} minWidth={dropdown.rect?.width || 240} variant="legacy" maxHeight={280}>
        {searchable ? <div style={{
        padding: "6px 8px"
      }}>
            <input autoFocus value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Cari..." style={{
          ...legacyInput,
          height: 30,
          fontSize: 13
        }} />
          </div> : null}

        {visible.length === 0 ? <p style={{
        margin: 0,
        padding: "8px 15px",
        fontSize: 13,
        color: "var(--list-muted,#999)"
      }}>
            Tidak ada data
          </p> : visible.map(option => <MenuItem key={option} selected={option === value} onClick={() => {
        onChange(option);
        dropdown.close();
      }}>
              {option}
            </MenuItem>)}
      </DropdownPanel>
    </>;
}
function AddAttachmentModal({
  onClose,
  onSubmit
}) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const canSubmit = Boolean(file && transactionType);
  return <LegacyModal title="Tambah Berkas" onClose={onClose} width={600} footer={<>
          <button type="button" style={btnSecondary} onClick={onClose}>
            Batal
          </button>
          <button type="button" style={btnSuccess(!canSubmit)} disabled={!canSubmit} onClick={() => {
      if (!canSubmit) return;
      onSubmit({
        nama: file.name,
        tipeTransaksi: transactionType
      });
    }}>
            Simpan
          </button>
        </>}>
      <div className="flex items-start gap-3 py-2">
        <label style={{
        ...legacyLabel,
        width: "33.33%",
        paddingTop: 8
      }}>
          Upload File
        </label>
        <div style={{
        flex: 1
      }}>
          <input ref={fileRef} type="file" className="hidden placeholder:text-[color:var(--list-placeholder)]" onChange={event => setFile(event.target.files?.[0] || null)} />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" style={{
            ...btnPrimaryLegacy,
            height: 30,
            padding: "4px 12px",
            fontSize: 12
          }} onClick={() => fileRef.current?.click()}>
              + Tambah Berkas
            </button>
            {file ? <span className="flex items-center gap-2" style={{
            fontSize: 13,
            color: "var(--list-text,#333)"
          }}>
                <span className="max-w-[220px] truncate">{file.name}</span>
                <button type="button" aria-label="Hapus file" className="cursor-pointer border-0 bg-transparent p-0" style={{
              color: "var(--list-muted,#999)"
            }} onClick={() => {
              setFile(null);
              if (fileRef.current) fileRef.current.value = "";
            }}>
                  <X size={14} />
                </button>
              </span> : null}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 py-2">
        <label style={{
        ...legacyLabel,
        width: "33.33%",
        paddingTop: 8
      }}>
          Transaction Type
        </label>
        <div style={{
        flex: 1
      }}>
          <LegacySelect value={transactionType} onChange={setTransactionType} options={transactionTypeOptions} placeholder="Pilih tipe transaksi" searchable />
        </div>
      </div>
    </LegacyModal>;
}
function SimpleChoiceModal({
  title,
  label,
  placeholder,
  options,
  submitLabel,
  onClose,
  onSubmit
}) {
  const [value, setValue] = useState("");
  return <LegacyModal title={title} onClose={onClose} width={520} footer={<>
          <button type="button" style={btnSecondary} onClick={onClose}>
            Batal
          </button>
          <button type="button" style={btnSuccess(!value)} disabled={!value} onClick={() => value && onSubmit(value)}>
            {submitLabel || "Simpan"}
          </button>
        </>}>
      <div className="flex items-start gap-3 py-2">
        <label style={{
        ...legacyLabel,
        width: "40%",
        paddingTop: 8
      }}>
          {label}
        </label>
        <div style={{
        flex: 1
      }}>
          <LegacySelect value={value} onChange={setValue} options={options} placeholder={placeholder} searchable />
        </div>
      </div>
    </LegacyModal>;
}
function DeleteAttachmentModal({
  onClose,
  onConfirm
}) {
  return <LegacyModal title="Hapus Lampiran" onClose={onClose} width={460} footer={<>
          <button type="button" style={btnSecondary} onClick={onClose}>
            Tidak
          </button>
          <button type="button" style={btnDanger} onClick={onConfirm}>
            Ya
          </button>
        </>}>
      <p style={{
      margin: 0,
      fontSize: 14,
      color: "var(--list-text,#333)"
    }}>
        Apakah anda yakin ingin menghapus?
      </p>
    </LegacyModal>;
}
export default function AttachmentsPage() {
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
  const [rows, setRows] = useState(attachmentRows);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingIds, setDeletingIds] = useState(null);
  const [typeModalRow, setTypeModalRow] = useState(null);
  const [linkModalRow, setLinkModalRow] = useState(null);
  const [createModalRow, setCreateModalRow] = useState(null);
  const actionMenu = useDropdown();
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return rows.filter(row => {
      const matchKeyword = !keyword || row.nama.toLowerCase().includes(keyword) || row.transaksi.toLowerCase().includes(keyword) || row.tipeTransaksi.toLowerCase().includes(keyword);
      const matchType = !typeFilter || row.tipeTransaksi === typeFilter;
      return matchKeyword && matchType;
    });
  }, [rows, search, typeFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageIds = pageItems.map(row => row.id);
  const allSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id));
  const toggleRow = id => setSelectedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const toggleAll = () => setSelectedIds(current => allSelected ? current.filter(id => !pageIds.includes(id)) : [...new Set([...current, ...pageIds])]);
  const deleteRows = ids => {
    setRows(current => current.filter(row => !ids.includes(row.id)));
    setSelectedIds(current => current.filter(id => !ids.includes(id)));
    setDeletingIds(null);
  };
  const now = new Date();
  const stamp = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const addRow = payload => {
    const nextId = rows.length ? Math.max(...rows.map(row => row.id)) + 1 : 1;
    setRows(current => [{
      id: nextId,
      nama: payload.nama,
      ukuran: "-",
      transaksi: "-",
      tipeTransaksi: payload.tipeTransaksi,
      waktu: stamp
    }, ...current]);
    setShowAddModal(false);
    setPage(1);
  };
  const thStyle = {
    background: MK.legacyHead,
    color: "#fff",
    fontSize: "13.33px",
    fontWeight: 400,
    padding: "8px 13.33px",
    textAlign: "left",
    height: 40,
    verticalAlign: "middle"
  };
  const tdStyle = {
    fontSize: "13.33px",
    color: MK.legacyText,
    padding: "5.33px 13.33px",
    height: 35,
    verticalAlign: "middle"
  };
  return <div className="-m-4 min-h-[calc(100%+2rem)] p-[15px] md:-m-6 md:min-h-[calc(100%+3rem)]" style={{
    ...pageTheme,
    background: MK.legacyPage,
    fontFamily: MK_FONT
  }} data-list-theme={pageTheme.colorScheme}>{isDark && <style>{"[data-list-theme=\"dark\"] h1,[data-list-theme=\"dark\"] h2{color:#fff!important}\n[data-list-theme=\"dark\"] table{background-color:#1a1a1a;color:#fff}\n[data-list-theme=\"dark\"] thead,[data-list-theme=\"dark\"] th{background-color:#2b2418!important;color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] td{color:#fff!important;border-color:#634f27!important}\n[data-list-theme=\"dark\"] th :is(a,span,div,p,strong,small,button),[data-list-theme=\"dark\"] td :is(a,span,div,p,strong,small):not(button *){color:#fff!important}\n[data-list-theme=\"dark\"] tbody tr:hover{background-color:rgba(229,184,92,.12)!important}\n[data-list-theme=\"dark\"][data-list-dropdown] button:hover,[data-list-theme=\"dark\"] [role=\"option\"]:hover{background-color:rgba(229,184,92,.15)!important;color:#E5B85C!important}\n[data-list-theme=\"dark\"] input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"file\"]),[data-list-theme=\"dark\"] select,[data-list-theme=\"dark\"] textarea{background-color:#1a1a1a;color:#f1f5f9;border-color:#634f27;caret-color:#E5B85C}\n[data-list-theme=\"dark\"] input::placeholder,[data-list-theme=\"dark\"] textarea::placeholder{color:#94a3b8}\n[data-list-theme=\"dark\"] input:focus,[data-list-theme=\"dark\"] select:focus,[data-list-theme=\"dark\"] textarea:focus{border-color:#E5B85C!important;box-shadow:0 0 0 3px rgba(229,184,92,.15)}\n[data-list-theme=\"dark\"] input[type=\"checkbox\"],[data-list-theme=\"dark\"] input[type=\"radio\"]{accent-color:#E5B85C}\n[data-list-theme=\"dark\"] button:disabled{background-color:#36312a!important;color:#94a3b8!important;border-color:#634f27}\n[data-list-theme=\"dark\"] ::selection{background-color:#E5B85C;color:#121212}"}</style>}
      <div className="mx-auto w-full max-w-[1688px]">
        <LegacyHeader title="Berkas Unggahan" titleColor="var(--list-text,#000)" subtitleColor="var(--list-muted,rgba(51,51,51,.5))" breadcrumbTo="/daftar-lainnya" action={<button type="button" style={btnPrimaryLegacy} onClick={() => setShowAddModal(true)}>
             + Tambah Berkas
            </button>} />

        <div style={{
        background: "var(--list-surface,#fff)",
        padding: 14
      }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 ? <>
                  <span style={{
                fontSize: 13,
                color: MK.legacyText
              }}>
                    {selectedIds.length} lampiran dipilih
                  </span>
                  <button type="button" onClick={() => setDeletingIds(selectedIds)} className="border-0" style={btnDangerLegacy}>
                    Hapus
                  </button>
                  <button type="button" onClick={() => setCreateModalRow({
                bulk: true
              })} className="border-0" style={btnPrimaryLegacy}>
                    Buat Transaksi Baru
                  </button>
                </> : null}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <MagnifyingGlass size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" style={{
                color: "var(--list-muted,#999)"
              }} />
                <input type="text" placeholder="Pencarian..." value={search} onChange={event => {
                setSearch(event.target.value);
                setPage(1);
              }} style={{
                ...legacyInput,
                width: 202,
                paddingLeft: 26
              }} />
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th style={{
                ...thStyle,
                width: 40
              }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Pilih semua" style={{
                  cursor: "pointer"
                }} />
                </th>
                <th style={{
                ...thStyle,
                width: "34%"
              }}>Nama</th>
                <th style={{
                ...thStyle,
                width: "10%"
              }}>Transaksi</th>
                <th style={{
                ...thStyle,
                width: "15.5%"
              }}>Tipe Transaksi</th>
                <th style={{
                ...thStyle,
                width: "16%"
              }}>Waktu Pembuatan</th>
                <th style={{
                ...thStyle,
                width: "22%"
              }}>Tindakan</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? <tr>
                  <td colSpan={6} style={{
                ...tdStyle,
                textAlign: "center",
                height: 309
              }}>
                    <img src={emptyFolderImg} alt="" className="mx-auto h-[128px] w-[128px] object-contain" />
                    <p className="m-0 mt-3 text-[16px] font-semibold" style={{
                  color: "var(--list-text,#232933)"
                }}>
                      Belum ada berkas
                    </p>
                    <p className="m-0 mt-1 text-[14px]" style={{
                  color: "var(--list-muted,#626b79)"
                }}>
                      Berkas yang Anda unggah akan muncul di sini.
                    </p>
                  </td>
                </tr> : pageItems.map((row, index) => <tr key={row.id} style={{
              background: index % 2 === 0 ? "var(--list-subtle,#f9f9f9)" : "var(--list-surface,#fff)"
            }}>
                    <td style={tdStyle}>
                      <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleRow(row.id)} aria-label={`Pilih ${row.nama}`} style={{
                  cursor: "pointer"
                }} />
                    </td>
                    <td style={{
                ...tdStyle,
                color: "var(--list-text,#000)"
              }}>{row.nama}</td>
                    <td style={tdStyle}>{row.transaksi}</td>
                    <td style={tdStyle}>{row.tipeTransaksi}</td>
                    <td style={tdStyle}>{row.waktu}</td>
                    <td style={tdStyle}>
                      <button type="button" data-dropdown-trigger onClick={event => {
                  if (openActionId === row.id) {
                    setOpenActionId(null);
                    actionMenu.close();
                    return;
                  }
                  setOpenActionId(row.id);
                  actionMenu.openAt(event.currentTarget.getBoundingClientRect());
                }} className="flex cursor-pointer items-center justify-between gap-2" style={{
                  width: 170,
                  height: 24,
                  border: "1px solid var(--list-border,#ccc)",
                  borderRadius: 2,
                  background: "var(--list-surface,#fff)",
                  fontSize: "13.33px",
                  color: "var(--list-text,#333)",
                  padding: "0 10px"
                }}>
                        Pilih Tindakan
                        <CaretDown size={9} />
                      </button>

                      {openActionId === row.id ? <DropdownPanel rect={actionMenu.rect} onClose={() => {
                  setOpenActionId(null);
                  actionMenu.close();
                }} minWidth={170} variant="legacy" maxHeight={260}>
                          {ACTION_MENU.map(item => <MenuItem key={item} onClick={() => {
                    setOpenActionId(null);
                    actionMenu.close();
                    if (item === "Ubah Tipe Transaksi") setTypeModalRow(row);
                    if (item === "Hubungkan ke Transaksi") setLinkModalRow(row);
                    if (item === "Buat Transaksi Baru") setCreateModalRow(row);
                  }}>
                              {item}
                            </MenuItem>)}
                        </DropdownPanel> : null}
                    </td>
                  </tr>)}
            </tbody>
          </table>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p style={{
            margin: 0,
            fontSize: 12,
            color: "var(--list-text,#000)"
          }}>
              Menampilkan {pageItems.length} dari {filtered.length} lampiran
            </p>

            {totalPages > 1 ? <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1} style={{
              height: 28,
              minWidth: 28,
              border: "1px solid var(--list-border,#ddd)",
              background: "var(--list-surface,#fff)",
              borderRadius: 3,
              fontSize: 12,
              cursor: safePage <= 1 ? "not-allowed" : "pointer",
              color: "var(--list-muted,#777)"
            }}>
                  &lt;
                </button>
                {Array.from({
              length: totalPages
            }, (_, i) => i + 1).map(item => <button key={item} type="button" onClick={() => setPage(item)} style={{
              height: 28,
              minWidth: 28,
              border: "1px solid var(--list-border,#ddd)",
              background: item === safePage ? MK.legacyPrimary : "var(--list-surface,#fff)",
              color: item === safePage ? "var(--list-brand-text,#fff)" : "var(--list-muted,#777)",
              borderRadius: 3,
              fontSize: 12,
              cursor: "pointer"
            }}>
                      {item}
                    </button>)}
                <button type="button" onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages} style={{
              height: 28,
              minWidth: 28,
              border: "1px solid var(--list-border,#ddd)",
              background: "var(--list-surface,#fff)",
              borderRadius: 3,
              fontSize: 12,
              cursor: safePage >= totalPages ? "not-allowed" : "pointer",
              color: "var(--list-muted,#777)"
            }}>
                  &gt;
                </button>
              </div> : null}
          </div>
        </div>
      </div>

      {showAddModal ? <AddAttachmentModal onClose={() => setShowAddModal(false)} onSubmit={addRow} /> : null}

      {deletingIds ? <DeleteAttachmentModal onClose={() => setDeletingIds(null)} onConfirm={() => deleteRows(deletingIds)} /> : null}

      {typeModalRow ? <SimpleChoiceModal title="Ubah Tipe Transaksi" label="Transaction Type" placeholder="Pilih tipe transaksi" options={transactionTypeOptions} onClose={() => setTypeModalRow(null)} onSubmit={value => {
      setRows(current => current.map(row => row.id === typeModalRow.id ? {
        ...row,
        tipeTransaksi: value
      } : row));
      setTypeModalRow(null);
    }} /> : null}

      {linkModalRow ? <SimpleChoiceModal title="Hubungkan ke Transaksi" label="Transaksi" placeholder="Pilih transaksi..." options={LINK_TRANSACTIONS} onClose={() => setLinkModalRow(null)} onSubmit={value => {
      setRows(current => current.map(row => row.id === linkModalRow.id ? {
        ...row,
        transaksi: value
      } : row));
      setLinkModalRow(null);
    }} /> : null}

      {createModalRow ? <SimpleChoiceModal title="Buat Transaksi Baru" label="Transaksi apa yang ingin Anda buat?" placeholder="Pilih tipe transaksi..." options={newTransactionTypeOptions} submitLabel="Tambahkan" onClose={() => setCreateModalRow(null)} onSubmit={() => setCreateModalRow(null)} /> : null}
    </div>;
}
