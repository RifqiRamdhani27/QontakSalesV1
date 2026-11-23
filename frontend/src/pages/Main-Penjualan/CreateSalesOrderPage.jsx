import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CalendarBlank,
  Check,
  Gear,
  Plus,
} from "@phosphor-icons/react";
import { btnModalCancel, btnModalSubmit } from "@/components/ui/styles";

function useFloating(
  open,
  setOpen,
  triggerRef,
  panelRef,
  minWidth = 0,
  estHeight = 280,
) {
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }

    const update = () => {
      const el = triggerRef.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const width = Math.max(r.width, minWidth);
      const below = window.innerHeight - r.bottom;
      const openUp = below < estHeight && r.top > below;

      setPos({
        left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)),
        width,
        top: openUp ? undefined : r.bottom + 6,
        bottom: openUp ? window.innerHeight - r.top + 6 : undefined,
      });
    };

    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };

    const onKey = (e) => e.key === "Escape" && setOpen(false);

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return pos;
}

function Select({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
  minPanelWidth = 0,
  className = "",
  buttonClassName = "",
  dark = false,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const pos = useFloating(
    open,
    setOpen,
    triggerRef,
    panelRef,
    minPanelWidth,
    260,
  );
  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-left text-sm outline-none transition-all disabled:cursor-not-allowed ${
          dark
            ? "border-[#484848] bg-[#292929] disabled:bg-[#303030]"
            : "border-[#cfd6de] bg-white disabled:bg-[#f4f6f8]"
        } ${
          open
            ? dark
              ? "border-[#b08b48] shadow-[0_0_0_3px_rgba(176,139,72,0.15)]"
              : "border-[#2563eb] shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
            : dark
              ? "hover:border-[#777]"
              : "hover:border-[#b6c0cb]"
        } ${buttonClassName}`}
      >
        <span
          className={`truncate ${
            selected
              ? dark
                ? "text-[#f1f1f1]"
                : "text-[#30343a]"
              : dark
                ? "text-[#929292]"
                : "text-[#9aa2ab]"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>

        <CaretDown
          size={13}
          weight="bold"
          className={`shrink-0 transition-transform duration-200 ${
            dark ? "text-[#bcbcbc]" : "text-[#626a73]"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            className={`inv-pop max-h-[260px] overflow-y-auto rounded-xl border p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.25)] ${
              dark
                ? "border-[#484848] bg-[#292929]"
                : "border-[#e2e8f0] bg-white"
            }`}
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              zIndex: 1000,
              transformOrigin: pos.top !== undefined ? "top" : "bottom",
            }}
          >
            {options.length === 0 && (
              <div
                className={`px-3 py-2 text-sm ${dark ? "text-[#929292]" : "text-[#9aa2ab]"}`}
              >
                No options
              </div>
            )}

            {options.map((o) => {
              const active = String(o.value) === String(value);

              return (
                <div
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? dark
                        ? "bg-[#493b22] font-semibold text-[#e2bd75]"
                        : "bg-[#eff6ff] font-semibold text-[#1d4ed8]"
                      : dark
                        ? "text-[#e5e5e5] hover:bg-[#383838]"
                        : "text-[#334155] hover:bg-[#f1f5f9]"
                  }`}
                >
                  <span className="truncate">{o.label}</span>
                  {active && (
                    <Check
                      size={14}
                      weight="bold"
                      className={`shrink-0 ${dark ? "text-[#e2bd75]" : "text-[#1d4ed8]"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n) => String(n).padStart(2, "0");
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

const parseISO = (v) => {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m: m - 1, d };
};

const displayDate = (v) => {
  const p = parseISO(v);
  return p ? `${pad(p.d)}/${pad(p.m + 1)}/${p.y}` : "";
};

function DatePicker({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  dark = false,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const pos = useFloating(open, setOpen, triggerRef, panelRef, 288, 340);
  const parsed = parseISO(value);
  const now = new Date();

  const [view, setView] = useState({
    y: parsed ? parsed.y : now.getFullYear(),
    m: parsed ? parsed.m : now.getMonth(),
  });

  useEffect(() => {
    if (open) {
      const p = parseISO(value);
      const n = new Date();
      setView({
        y: p ? p.y : n.getFullYear(),
        m: p ? p.m : n.getMonth(),
      });
    }
  }, [open]);

  const shiftMonth = (delta) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-left text-sm outline-none transition-all ${
          dark ? "border-[#484848] bg-[#292929]" : "border-[#cfd6de] bg-white"
        } ${
          open
            ? dark
              ? "border-[#b08b48] shadow-[0_0_0_3px_rgba(176,139,72,0.15)]"
              : "border-[#2563eb] shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
            : dark
              ? "hover:border-[#777]"
              : "hover:border-[#b6c0cb]"
        }`}
      >
        <span
          className={
            value
              ? dark
                ? "text-[#f1f1f1]"
                : "text-[#30343a]"
              : dark
                ? "text-[#929292]"
                : "text-[#9aa2ab]"
          }
        >
          {value ? displayDate(value) : placeholder}
        </span>

        <CalendarBlank
          size={16}
          className={`shrink-0 ${dark ? "text-[#bcbcbc]" : "text-[#626a73]"}`}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            className={`inv-pop rounded-xl border p-3 shadow-[0_12px_32px_rgba(15,23,42,0.25)] ${
              dark
                ? "border-[#484848] bg-[#292929]"
                : "border-[#e2e8f0] bg-white"
            }`}
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              zIndex: 1000,
              transformOrigin: pos.top !== undefined ? "top" : "bottom",
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  dark
                    ? "text-[#d1d1d1] hover:bg-[#383838]"
                    : "text-[#475569] hover:bg-[#f1f5f9]"
                }`}
              >
                <CaretLeft size={14} weight="bold" />
              </button>

              <span
                className={`text-sm font-semibold ${dark ? "text-[#f1f1f1]" : "text-[#1e293b]"}`}
              >
                {MONTHS[view.m]} {view.y}
              </span>

              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  dark
                    ? "text-[#d1d1d1] hover:bg-[#383838]"
                    : "text-[#475569] hover:bg-[#f1f5f9]"
                }`}
              >
                <CaretRight size={14} weight="bold" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center">
              {WEEKDAYS.map((w) => (
                <div
                  key={w}
                  className={`py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    dark ? "text-[#929292]" : "text-[#94a3b8]"
                  }`}
                >
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5 text-center">
              {cells.map((d, i) => {
                if (d === null) return <div key={`e${i}`} />;

                const iso = toISO(view.y, view.m, d);
                const isSelected = iso === value;
                const isToday = iso === todayISO;

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => {
                      onChange(iso);
                      setOpen(false);
                    }}
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-colors ${
                      isSelected
                        ? dark
                          ? "bg-[#9b783b] font-semibold text-white"
                          : "bg-[#2563eb] font-semibold text-white"
                        : isToday
                          ? dark
                            ? "border border-[#b08b48] font-semibold text-[#e2bd75] hover:bg-[#383838]"
                            : "border border-[#2563eb] font-semibold text-[#2563eb] hover:bg-[#eff6ff]"
                          : dark
                            ? "text-[#e5e5e5] hover:bg-[#383838]"
                            : "text-[#334155] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-2 flex justify-end border-t pt-2 ${dark ? "border-[#484848]" : "border-[#f1f5f9]"}`}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(todayISO);
                  setOpen(false);
                }}
                className={`rounded-md px-3 py-1 text-xs font-semibold ${
                  dark
                    ? "text-[#e2bd75] hover:bg-[#383838]"
                    : "text-[#2563eb] hover:bg-[#eff6ff]"
                }`}
              >
                Today
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

const ORDER_TYPE_OPTIONS = [{ value: "Sales Order", label: "Sales Order" }];

const CUSTOMER_OPTIONS = [
  { value: "Customer A", label: "Customer A" },
  { value: "Customer B", label: "Customer B" },
];

const TERM_OPTIONS = ["Net 30", "Net 15", "Net 45", "Net 60"].map((t) => ({
  value: t,
  label: t,
}));

const WAREHOUSE_OPTIONS = [
  { value: "Warehouse 1", label: "Warehouse 1" },
  { value: "Warehouse 2", label: "Warehouse 2" },
];

const PRODUCT_OPTIONS = [
  { value: "Product A", label: "Product A" },
  { value: "Product B", label: "Product B" },
];

const DISCOUNT_TYPE_OPTIONS = [
  { value: "%", label: "%" },
  { value: "Rp", label: "Rp" },
];

const EMPTY_ITEM = {
  product: "",
  description: "",
  qty: 1,
  units: "",
  unitPrice: 0,
  discount: 0,
  tax: 0,
};

const PRIMARY_BG = "var(--sales-primary-bg, rgba(23, 140, 204, 1))";
const PRIMARY_BG_HOVER = "var(--sales-primary-hover, rgba(15, 100, 148, 1))";
const PRIMARY_SHADOW =
  "var(--sales-primary-shadow, 0 4px 6px -1px rgba(23, 140, 204, 0.4), 0 2px 4px -1px rgba(23, 140, 204, 0.2))";
const PRIMARY_SHADOW_HOVER =
  "var(--sales-primary-shadow-hover, 0 10px 15px -3px rgba(23, 140, 204, 0.5), 0 4px 6px -2px rgba(23, 140, 204, 0.3))";

const primaryBtnProps = {
  style: {
    backgroundColor: PRIMARY_BG,
    boxShadow: PRIMARY_SHADOW,
  },
  onMouseEnter: (e) => {
    e.currentTarget.style.backgroundColor = PRIMARY_BG_HOVER;
    e.currentTarget.style.boxShadow = PRIMARY_SHADOW_HOVER;
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.backgroundColor = PRIMARY_BG;
    e.currentTarget.style.boxShadow = PRIMARY_SHADOW;
    e.currentTarget.style.transform = "translateY(0)";
  },
  onMouseDown: (e) => {
    e.currentTarget.style.transform = "translateY(1px)";
  },
  onMouseUp: (e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = PRIMARY_SHADOW_HOVER;
  },
};

export default function CreateSalesOrderPage() {
  const navigate = useNavigate();

  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light",
  );

  useEffect(() => {
    const syncTheme = () => {
      setThemeMode(localStorage.getItem("app_theme") || "light");
    };

    window.addEventListener("themeChanged", syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      window.removeEventListener("themeChanged", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  const isDark = themeMode === "dark";

  const [orderType, setOrderType] = useState("Sales Order");
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-09-30");
  const [dueDate, setDueDate] = useState("2026-10-30");
  const [transactionNo, setTransactionNo] = useState("[Auto]");
  const [customerReferenceNo, setCustomerReferenceNo] = useState("");
  const [term, setTerm] = useState("Net 30");
  const [warehouse, setWarehouse] = useState("");
  const [tag, setTag] = useState("");
  const [priceIncludesTax, setPriceIncludesTax] = useState(false);
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");
  const [discountType, setDiscountType] = useState("%");
  const [discount, setDiscount] = useState("");
  const [withholding, setWithholding] = useState(false);
  const [files, setFiles] = useState([]);
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    setItems((current) => [...current, { ...EMPTY_ITEM }]);
  };

  const lineSubtotal = (item) =>
    Number(item.qty || 0) * Number(item.unitPrice || 0);

  const lineDiscount = (item) =>
    lineSubtotal(item) * (Number(item.discount || 0) / 100);

  const lineAmount = (item) => lineSubtotal(item) - lineDiscount(item);

  const lineTax = (item) => lineAmount(item) * (Number(item.tax || 0) / 100);

  const subtotal = items.reduce((sum, item) => sum + lineSubtotal(item), 0);

  const discountPerLines = items.reduce(
    (sum, item) => sum + lineDiscount(item),
    0,
  );

  const tax = items.reduce((sum, item) => sum + lineTax(item), 0);

  const additionalDiscount =
    discountType === "%"
      ? subtotal * (Number(discount || 0) / 100)
      : Number(discount || 0);

  const total = subtotal - discountPerLines - additionalDiscount + tax;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles.slice(0, 5));
  };

  return (
    <div
      className={`sales-order-root min-h-full ${isDark ? "dash-dark" : "sales-order-light"}`}
    >
      <style>{`
        .sales-order-root {
          --sales-primary-bg: rgba(23, 140, 204, 1);
          --sales-primary-hover: rgba(15, 100, 148, 1);
          --sales-primary-shadow: 0 4px 6px -1px rgba(23, 140, 204, 0.4), 0 2px 4px -1px rgba(23, 140, 204, 0.2);
          --sales-primary-shadow-hover: 0 10px 15px -3px rgba(23, 140, 204, 0.5), 0 4px 6px -2px rgba(23, 140, 204, 0.3);
          background: #ffffff;
          color: #30343b;
          transition: background-color .2s ease, color .2s ease;
        }

        .sales-order-root.dash-dark {
          --sales-primary-bg: #9b783b;
          --sales-primary-hover: #80622f;
          --sales-primary-shadow: 0 4px 8px rgba(155, 120, 59, 0.25);
          --sales-primary-shadow-hover: 0 8px 14px rgba(155, 120, 59, 0.35);
          background: #252525;
          color: #eeeeee;
        }

        .sales-order-root input[type="checkbox"] {
          accent-color: #2563eb;
          outline: none;
          box-shadow: none;
        }

        .sales-order-root.dash-dark input[type="checkbox"] {
          accent-color: #b08b48;
        }

        .sales-order-root input[type="checkbox"]:focus,
        .sales-order-root input[type="checkbox"]:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }

        .sales-order-root input[type="checkbox"]:focus-visible {
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.35) !important;
        }

        @keyframes invPopIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .inv-pop {
          animation: invPopIn 0.16s ease-out;
        }

        .sales-order-root.dash-dark .bg-white {
          background-color: #2d2d2d !important;
        }

        .sales-order-root.dash-dark .border,
        .sales-order-root.dash-dark .border-b,
        .sales-order-root.dash-dark .border-t,
        .sales-order-root.dash-dark .border-y {
          border-color: #484848 !important;
        }

        .sales-order-root.dash-dark label,
        .sales-order-root.dash-dark h1,
        .sales-order-root.dash-dark th,
        .sales-order-root.dash-dark td,
        .sales-order-root.dash-dark .text-sm,
        .sales-order-root.dash-dark .text-base,
        .sales-order-root.dash-dark .text-lg,
        .sales-order-root.dash-dark .text-xl,
        .sales-order-root.dash-dark .text-2xl {
          color: #e5e5e5;
        }

        .sales-order-root.dash-dark input:not([type="checkbox"]):not([type="file"]),
        .sales-order-root.dash-dark textarea {
          background-color: #303030 !important;
          color: #f1f1f1 !important;
          border-color: #484848 !important;
          color-scheme: dark;
        }

        .sales-order-root.dash-dark input::placeholder,
        .sales-order-root.dash-dark textarea::placeholder {
          color: #929292 !important;
        }

        .sales-order-root.dash-dark input:focus,
        .sales-order-root.dash-dark textarea:focus {
          border-color: #b08b48 !important;
        }

        .sales-order-root.dash-dark .sales-items-table,
        .sales-order-root.dash-dark .sales-items-table thead,
        .sales-order-root.dash-dark .sales-items-table tbody,
        .sales-order-root.dash-dark .sales-items-table tr,
        .sales-order-root.dash-dark .sales-items-table th,
        .sales-order-root.dash-dark .sales-items-table td {
          background-color: #252525 !important;
        }

        .sales-order-root.dash-dark .sales-items-table th,
        .sales-order-root.dash-dark .sales-items-table td {
          border-color: #484848 !important;
        }

        .sales-order-root.dash-dark .sales-items-table th {
          color: #eeeeee !important;
        }

        .sales-order-root .sales-table-heading th {
          color: #111111 !important;
        }

        .sales-order-root.dash-dark .text-red-500 {
          color: #f87171 !important;
        }

        .sales-order-root.dash-dark .sales-create-button {
          color: #ffffff !important;
        }
      `}</style>

      <div className="w-full px-6 pb-8 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                color: isDark ? "#c5a15e" : "#5875c9",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isDark ? "#e2bd75" : "#3f57b8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? "#c5a15e" : "#5875c9";
              }}
              className="mb-1.5 flex cursor-pointer items-center gap-1 text-sm font-semibold focus:outline-none"
            >
              Sales
            </button>

            <h1 className="mt-2 text-2xl font-semibold leading-tight text-[#252a31]">
              Create Sales Order
            </h1>
          </div>

          <Select
            className="w-44 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
            value={orderType}
            onChange={setOrderType}
            options={ORDER_TYPE_OPTIONS}
            dark={isDark}
          />
        </div>

        <div
          className="mt-5 rounded-xl border border-[#d4dbe2] bg-white"
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div className="border-b border-dashed border-[#e2e6ea] px-5 py-5">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#30343a]">
                  Customer <span className="text-red-500">*</span>
                </label>

                <Select
                  value={customer}
                  onChange={setCustomer}
                  options={CUSTOMER_OPTIONS}
                  placeholder="Choose customer"
                  dark={isDark}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#30343a]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="h-9 w-full rounded-md border border-[#cfd6de] px-3 text-sm outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
                />
              </div>

              <div className="flex items-end justify-end">
                <div className="text-xl font-semibold text-[#292e34]">
                  Total Rp{formatCurrency(total)}
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#30343a]">
                  Billing address
                </label>

                <textarea
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="e.g. Jalan Indonesia Blok C No. 22"
                  className="h-28 w-full resize-none rounded-md border border-[#cfd6de] px-3 py-2 text-sm outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#30343a]">
                  Transaction date
                </label>

                <DatePicker
                  value={transactionDate}
                  onChange={setTransactionDate}
                  dark={isDark}
                />

                <label className="mb-2 mt-4 block text-sm font-medium text-[#30343a]">
                  Due date
                </label>

                <DatePicker
                  value={dueDate}
                  onChange={setDueDate}
                  dark={isDark}
                />

                <label className="mb-2 mt-4 block text-sm font-medium text-[#30343a]">
                  Term
                </label>

                <Select
                  value={term}
                  onChange={setTerm}
                  options={TERM_OPTIONS}
                  dark={isDark}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#30343a]">
                  Transaction no.
                  <Gear size={14} className="text-[#7b848d]" />
                </label>

                <input
                  value={transactionNo}
                  onChange={(e) => setTransactionNo(e.target.value)}
                  className="h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm outline-none focus:border-[#4B61DD]"
                />

                <label className="mb-2 mt-4 block text-sm font-medium text-[#30343a]">
                  Customer reference no.
                </label>

                <input
                  value={customerReferenceNo}
                  onChange={(e) => setCustomerReferenceNo(e.target.value)}
                  className="h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm outline-none focus:border-[#4B61DD]"
                />

                <label className="mb-2 mt-4 block text-sm font-medium text-[#30343a]">
                  Warehouse
                </label>

                <Select
                  value={warehouse}
                  onChange={setWarehouse}
                  options={WAREHOUSE_OPTIONS}
                  placeholder="Select warehouse"
                  dark={isDark}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#30343a]">
                  Tag
                </label>

                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Choose tag"
                  className="h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <label className="flex items-center gap-2 text-sm text-[#464c53]">
                <input
                  type="checkbox"
                  checked={priceIncludesTax}
                  onChange={(e) => setPriceIncludesTax(e.target.checked)}
                  className="h-4 w-4 rounded border-[#cfd6de]"
                />
                Price includes tax
              </label>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="sales-items-table w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="sales-table-heading h-11 bg-[#EDFFFD]">
                    <th className="w-[250px] border-y border-[#d9dfe5] px-2 text-left text-sm font-semibold">
                      Product
                    </th>
                    <th className="w-[185px] border-y border-[#d9dfe5] px-2 text-left text-sm font-semibold">
                      Description
                    </th>
                    <th className="w-[80px] border-y border-[#d9dfe5] px-2 text-center text-sm font-semibold">
                      Qty
                    </th>
                    <th className="w-[100px] border-y border-[#d9dfe5] px-2 text-left text-sm font-semibold">
                      Units
                    </th>
                    <th className="w-[130px] border-y border-[#d9dfe5] px-2 text-right text-sm font-semibold">
                      Unit price
                    </th>
                    <th className="w-[120px] border-y border-[#d9dfe5] px-2 text-right text-sm font-semibold">
                      Discount
                    </th>
                    <th className="w-[100px] border-y border-[#d9dfe5] px-2 text-right text-sm font-semibold">
                      Tax
                    </th>
                    <th className="w-[150px] border-y border-[#d9dfe5] px-2 text-right text-sm font-semibold">
                      Amount
                    </th>
                    <th className="w-[40px] border-y border-[#d9dfe5]" />
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="h-14">
                      <td className="border-b border-[#d9dfe5] px-2">
                        <Select
                          value={item.product}
                          onChange={(v) => updateItem(index, "product", v)}
                          options={PRODUCT_OPTIONS}
                          placeholder="Select product"
                          dark={isDark}
                        />
                      </td>
                      <td className="border-b border-[#d9dfe5]" />
                      <td className="border-b border-[#d9dfe5]" />
                      <td className="border-b border-[#d9dfe5]" />
                      <td className="border-b border-[#d9dfe5]" />
                      <td className="border-b border-[#d9dfe5]" />
                      <td className="border-b border-[#d9dfe5]" />
                      <td className="border-b border-[#d9dfe5]" />
                      <td className="border-b border-[#d9dfe5]" />
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={addItem}
                style={{
                  color: isDark ? "#c5a15e" : "#5875c9",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? "#e2bd75" : "#3f57b8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? "#c5a15e" : "#5875c9";
                }}
                className="mt-2 flex items-center gap-1.5 text-sm font-medium focus:outline-none"
              >
                <Plus size={14} />
                Add product
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  className="h-20 w-full resize-none rounded-md border border-[#cfd6de] px-3 py-2 text-sm outline-none placeholder:text-[#99a1aa] focus:border-[#4B61DD]"
                />

                <label className="mb-2 mt-4 block text-sm font-medium">
                  Memo
                </label>

                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Memo"
                  className="h-20 w-full resize-none rounded-md border border-[#cfd6de] px-3 py-2 text-sm outline-none placeholder:text-[#99a1aa] focus:border-[#4B61DD]"
                />

                <label className="mb-2 mt-4 block text-sm font-medium">
                  Attachments
                </label>

                <div className="flex h-10 items-center overflow-hidden rounded-md border border-[#cfd6de]">
                  <label
                    className="cursor-pointer border-r border-[#cfd6de] px-3 text-sm font-medium"
                    style={{
                      color: isDark ? "#c5a15e" : "#5875c9",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isDark
                        ? "#e2bd75"
                        : "#3f57b8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDark
                        ? "#c5a15e"
                        : "#5875c9";
                    }}
                  >
                    Choose file
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <span className="px-3 text-xs text-[#98a0a8]">
                    or drag or drop file here
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-[#747c85]">
                  Files can be Excel, Word, PDF, JPG, PNG, or ZIP (maximum 5
                  files and 10 MB per file).
                </p>

                {files.length > 0 && (
                  <div className="mt-2 space-y-0.5 text-xs text-[#555b63]">
                    {files.map((file) => (
                      <div key={file.name}>{file.name}</div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between py-1.5 text-sm">
                  <span>Subtotal</span>
                  <span>Rp{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 text-sm">
                  <span>Discount per lines</span>
                  <span>Rp{formatCurrency(discountPerLines)}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 text-sm">
                  <span>Discount</span>

                  <div className="flex items-center gap-2">
                    <Select
                      className="w-[84px]"
                      value={discountType}
                      onChange={setDiscountType}
                      options={DISCOUNT_TYPE_OPTIONS}
                      minPanelWidth={84}
                      buttonClassName="!h-8"
                      dark={isDark}
                    />

                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="h-8 w-28 rounded-md border border-[#cfd6de] px-2 text-right text-sm outline-none focus:border-[#4B61DD]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-dashed border-[#dfe4e8] py-1.5 text-sm">
                  <span>Tax</span>
                  <span>Rp{formatCurrency(tax)}</span>
                </div>

                <div className="flex items-center justify-between py-2 text-base font-semibold">
                  <span>Total</span>
                  <span>Rp{formatCurrency(total)}</span>
                </div>

                <label className="flex items-center gap-2 text-sm text-[#59616a]">
                  <input
                    type="checkbox"
                    checked={withholding}
                    onChange={(e) => setWithholding(e.target.checked)}
                    className="h-4 w-4 rounded border-[#cfd6de]"
                  />
                  Withholding
                </label>

                <div className="mt-4 border-t border-dashed border-[#dfe4e8] pt-3">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Balance due</span>
                    <span>Rp{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 border-t border-[#e1e5e9] pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`${btnModalCancel} focus:outline-none`}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`${btnModalSubmit} sales-create-button group relative flex items-center justify-center gap-2 border-none text-white transition-all duration-200 focus:outline-none`}
                {...primaryBtnProps}
              >
                Create
                <CaretDown size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
