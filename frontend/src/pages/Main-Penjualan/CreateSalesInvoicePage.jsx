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
  Trash,
} from "@phosphor-icons/react";
import api from "../../services/api";
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

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

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
  isDark = false,
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
          isDark
            ? "border-[#444] bg-[#292929] text-[#f1f5f9] disabled:bg-[#252525]"
            : "border-[#cfd6de] bg-white text-[#30343a] disabled:bg-[#f4f6f8]"
        } ${open ? "border-[#2563eb] shadow-[0_0_0_3px_rgba(37,99,235,0.12)]" : ""} ${buttonClassName}`}
      >
        <span className={`truncate ${selected ? "" : "text-[#9aa2ab]"}`}>
          {selected ? selected.label : placeholder}
        </span>

        <CaretDown
          size={13}
          weight="bold"
          className={`shrink-0 ${isDark ? "text-[#cbd5e1]" : "text-[#626a73]"}`}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            className={`inv-pop max-h-[260px] overflow-y-auto rounded-xl border p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.16)] ${
              isDark
                ? "inv-pop-dark border-[#444] bg-[#1e1e1e]"
                : "border-[#e2e8f0] bg-white"
            }`}
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              zIndex: 1000,
            }}
          >
            {options.length === 0 && (
              <div className="px-3 py-2 text-sm text-[#9aa2ab]">No options</div>
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
                      ? isDark
                        ? "bg-[#263b55] font-semibold text-[#93c5fd]"
                        : "bg-[#eff6ff] font-semibold text-[#1d4ed8]"
                      : isDark
                        ? "text-[#e5e7eb] hover:bg-[#333]"
                        : "text-[#334155] hover:bg-[#f1f5f9]"
                  }`}
                >
                  <span className="truncate">{o.label}</span>
                  {active && <Check size={14} weight="bold" />}
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
  isDark = false,
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
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-left text-sm ${
          isDark
            ? "border-[#444] bg-[#292929] text-[#f1f5f9]"
            : "border-[#cfd6de] bg-white text-[#30343a]"
        }`}
      >
        <span className={value ? "" : "text-[#9aa2ab]"}>
          {value ? displayDate(value) : placeholder}
        </span>
        <CalendarBlank
          size={16}
          className={isDark ? "text-[#cbd5e1]" : "text-[#626a73]"}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            className={`inv-pop rounded-xl border p-3 shadow-[0_12px_32px_rgba(15,23,42,0.16)] ${
              isDark
                ? "inv-pop-dark border-[#444] bg-[#1e1e1e]"
                : "border-[#e2e8f0] bg-white"
            }`}
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              zIndex: 1000,
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isDark
                    ? "text-[#cbd5e1] hover:bg-[#333]"
                    : "text-[#475569] hover:bg-[#f1f5f9]"
                }`}
              >
                <CaretLeft size={14} weight="bold" />
              </button>

              <span
                className={`text-sm font-semibold ${
                  isDark ? "text-[#f1f5f9]" : "text-[#1e293b]"
                }`}
              >
                {MONTHS[view.m]} {view.y}
              </span>

              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isDark
                    ? "text-[#cbd5e1] hover:bg-[#333]"
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
                  className="py-1 text-[11px] font-semibold uppercase text-[#94a3b8]"
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
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] ${
                      isSelected
                        ? "bg-[#2563eb] font-semibold text-white"
                        : isToday
                          ? isDark
                            ? "border border-[#60a5fa] font-semibold text-[#93c5fd]"
                            : "border border-[#2563eb] font-semibold text-[#2563eb]"
                          : isDark
                            ? "text-[#e5e7eb] hover:bg-[#333]"
                            : "text-[#334155] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-2 flex justify-end border-t pt-2 ${
                isDark ? "border-[#444]" : "border-[#f1f5f9]"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(todayISO);
                  setOpen(false);
                }}
                className={`rounded-md px-3 py-1 text-xs font-semibold ${
                  isDark ? "text-[#93c5fd]" : "text-[#2563eb]"
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

const TERM_OPTIONS = ["Net 15", "Net 30", "Net 45", "Net 60"].map((t) => ({
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

const INVOICE_TYPE_OPTIONS = [
  { value: "Sales Invoice", label: "Sales Invoice" },
];

const createEmptyItem = () => ({
  product: "",
  description: "",
  qty: 1,
  units: "",
  unitPrice: 0,
  discount: 0,
  tax: 0,
});

export default function CreateSalesInvoicePage() {
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
  const accentColor = isDark ? "#C5A15E" : "#5875C9";
  const accentHover = isDark ? "#D8B878" : "#3F57B8";

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invoiceType, setInvoiceType] = useState("Sales Invoice");
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
  const [items, setItems] = useState([createEmptyItem()]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const response = await api.get("/customers/");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setCustomers(data);
    } catch (error) {
      console.error("Gagal mengambil customer:", error);
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerChange = (selectedId) => {
    setCustomer(selectedId);

    const selectedCustomer = customers.find(
      (item) => String(item.id) === String(selectedId),
    );

    if (selectedCustomer) {
      setEmail(selectedCustomer.email || "");
      setBillingAddress(selectedCustomer.address || "");
    } else {
      setEmail("");
      setBillingAddress("");
    }
  };

  const customerOptions = customers.map((item) => ({
    value: item.id,
    label: item.name || item.company_name || `Customer ${item.id}`,
  }));

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    setItems((current) => [...current, createEmptyItem()]);
  };

  const removeItem = (index) => {
    setItems((current) => {
      if (current.length === 1) return [createEmptyItem()];
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
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

  const total = Math.max(
    0,
    subtotal - discountPerLines - additionalDiscount + tax,
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatDateForApi = (value) => {
    if (!value) return "";
    if (value.includes("-")) return value;

    const parts = value.split("/");
    if (parts.length !== 3) return value;

    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles.slice(0, 5));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    if (!customer) {
      alert("Customer wajib dipilih.");
      return;
    }

    const hasInvalidItem = items.some(
      (item) =>
        !item.product ||
        Number(item.qty || 0) <= 0 ||
        Number(item.unitPrice || 0) < 0,
    );

    if (hasInvalidItem) {
      alert("Produk, Qty, dan Unit price harus diisi dengan benar.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        transaction_no: transactionNo === "[Auto]" ? "" : transactionNo,
        customer: Number(customer),
        email: email.trim(),
        billing_address: billingAddress.trim(),
        transaction_date: formatDateForApi(transactionDate),
        due_date: formatDateForApi(dueDate),
        customer_reference_no: customerReferenceNo.trim(),
        term,
        warehouse: warehouse.trim(),
        tag: tag.trim(),
        price_includes_tax: priceIncludesTax,
        message: message.trim(),
        memo: memo.trim(),
        discount_type: discountType,
        discount: Number(discount || 0),
        withholding,
        subtotal,
        discount_per_lines: discountPerLines,
        tax,
        total,
        items: items.map((item) => ({
          product: item.product,
          description: item.description,
          qty: Number(item.qty || 0),
          units: item.units,
          unit_price: Number(item.unitPrice || 0),
          discount: Number(item.discount || 0),
          tax: Number(item.tax || 0),
          amount: lineAmount(item) + lineTax(item),
        })),
      };

      console.log("Invoice payload:", payload);
      await api.post("/sales/invoices/", payload);

      alert("Sales Invoice berhasil dibuat.");
      window.location.href = "/penjualan";
    } catch (error) {
      console.error("Gagal menyimpan invoice:", error);
      console.error("Response:", error.response?.data);

      const responseData = error.response?.data;
      let messageText = "Transaksi gagal disimpan.";

      if (responseData?.detail) {
        messageText = responseData.detail;
      } else if (responseData && typeof responseData === "object") {
        const firstError = Object.values(responseData)[0];

        if (Array.isArray(firstError)) {
          messageText = firstError[0];
        } else if (typeof firstError === "string") {
          messageText = firstError;
        }
      }

      alert(String(messageText));
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `h-9 w-full rounded-md border px-2 text-sm outline-none transition-colors ${
    isDark
      ? "border-[#444] bg-[#292929] text-[#f1f5f9] placeholder:text-[#858585] focus:border-[#60a5fa]"
      : "border-[#cfd6de] bg-white text-[#30343a] placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
  }`;

  const actionButtonStyle = {
    backgroundColor: accentColor,
    boxShadow: isDark
      ? "0 4px 6px -1px rgba(197, 161, 94, 0.25)"
      : "0 4px 6px -1px rgba(23, 140, 204, 0.4)",
  };

  return (
    <div
      className={`sales-invoice-root min-h-full ${
        isDark
          ? "dash-dark bg-[#121212] text-[#f1f5f9]"
          : "bg-white text-[#30343b]"
      }`}
    >
      <style>{`
        .sales-invoice-root.dash-dark {
          background: #121212 !important;
          color: #f1f5f9 !important;
        }

        .sales-invoice-root.dash-dark .invoice-card {
          background: #1e1e1e !important;
          border-color: #444 !important;
        }

        .sales-invoice-root.dash-dark input:not([type="checkbox"]):not([type="file"]),
        .sales-invoice-root.dash-dark textarea {
          background: #292929 !important;
          color: #f1f5f9 !important;
          border-color: #444 !important;
        }

        .sales-invoice-root.dash-dark input::placeholder,
        .sales-invoice-root.dash-dark textarea::placeholder {
          color: #858585 !important;
        }

        .sales-invoice-root.dash-dark label,
        .sales-invoice-root.dash-dark h1,
        .sales-invoice-root.dash-dark th,
        .sales-invoice-root.dash-dark td,
        .sales-invoice-root.dash-dark p {
          color: #e5e7eb;
        }

        .sales-invoice-root.dash-dark .invoice-table th {
          background: #263b3b !important;
          color: #e5e7eb !important;
          border-color: #444 !important;
        }

        .sales-invoice-root.dash-dark .invoice-table td {
          background: #1e1e1e !important;
          border-color: #444 !important;
        }

        .sales-invoice-root.dash-dark .invoice-table input,
        .sales-invoice-root.dash-dark .invoice-table textarea {
          background: #292929 !important;
          color: #f1f5f9 !important;
          border-color: #444 !important;
        }

        .sales-invoice-root.dash-dark .invoice-table input:focus,
        .sales-invoice-root.dash-dark .invoice-table textarea:focus {
          border-color: #60a5fa !important;
        }

        .sales-invoice-root.dash-dark .invoice-table .amount-cell {
          color: #f1f5f9 !important;
        }

        .sales-invoice-root.dash-dark .invoice-border {
          border-color: #444 !important;
        }

        .sales-invoice-root.dash-dark .invoice-muted {
          color: #9ca3af !important;
        }

        .sales-invoice-root.dash-dark .invoice-upload {
          border-color: #444 !important;
          background: #292929 !important;
        }

        .sales-invoice-root.dash-dark .invoice-upload span {
          color: #cbd5e1 !important;
        }

        .inv-pop {
          animation: invPopIn 0.16s ease-out;
        }

        .inv-pop-dark {
          background: #1e1e1e !important;
          border-color: #444 !important;
          color: #e5e7eb !important;
        }

        .inv-pop-dark span,
        .inv-pop-dark div {
          color: #e5e7eb;
        }

        @keyframes invPopIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .sales-invoice-root input[type="checkbox"] {
          accent-color: #2563eb;
        }

        .sales-invoice-root.dash-dark input[type="checkbox"] {
          accent-color: #C5A15E;
        }
      `}</style>

      <div className="w-full px-6 pb-8 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-1.5 flex items-center gap-1 text-sm font-semibold transition-colors"
              style={{ color: accentColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = accentColor;
              }}
            >
              Sales
            </button>

            <h1 className="mt-2 text-2xl font-semibold leading-tight">
              Create Sales Invoice
            </h1>
          </div>

          <Select
            className="w-44"
            value={invoiceType}
            onChange={setInvoiceType}
            options={INVOICE_TYPE_OPTIONS}
            isDark={isDark}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="invoice-card mt-5 rounded-xl border border-[#d4dbe2] bg-white">
            <div className="invoice-border border-b border-dashed border-[#e2e6ea] px-5 py-5">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Customer <span className="text-red-500">*</span>
                  </label>

                  <Select
                    value={customer}
                    onChange={handleCustomerChange}
                    options={customerOptions}
                    disabled={loadingCustomers}
                    placeholder={
                      loadingCustomers
                        ? "Loading customer..."
                        : "Choose customer"
                    }
                    isDark={isDark}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className={inputClass}
                  />
                </div>

                <div className="flex items-end justify-end">
                  <div className="text-xl font-semibold">
                    Total Rp{formatCurrency(total)}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Billing address
                  </label>

                  <textarea
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="e.g. Jalan Indonesia Blok C No. 22"
                    className={`h-28 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none ${
                      isDark
                        ? "border-[#444] bg-[#292929] text-[#f1f5f9]"
                        : "border-[#cfd6de] bg-white text-[#30343a]"
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Transaction date
                  </label>

                  <DatePicker
                    value={transactionDate}
                    onChange={setTransactionDate}
                    isDark={isDark}
                  />

                  <label className="mb-2 mt-4 block text-sm font-medium">
                    Due date
                  </label>

                  <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    isDark={isDark}
                  />

                  <label className="mb-2 mt-4 block text-sm font-medium">
                    Term
                  </label>

                  <Select
                    value={term}
                    onChange={setTerm}
                    options={TERM_OPTIONS}
                    isDark={isDark}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                    Transaction no.
                    <Gear size={14} className="invoice-muted" />
                  </label>

                  <input
                    value={transactionNo}
                    onChange={(e) => setTransactionNo(e.target.value)}
                    className={inputClass}
                  />

                  <label className="mb-2 mt-4 block text-sm font-medium">
                    Customer reference no.
                  </label>

                  <input
                    value={customerReferenceNo}
                    onChange={(e) => setCustomerReferenceNo(e.target.value)}
                    className={inputClass}
                  />

                  <label className="mb-2 mt-4 block text-sm font-medium">
                    Warehouse
                  </label>

                  <Select
                    value={warehouse}
                    onChange={setWarehouse}
                    options={WAREHOUSE_OPTIONS}
                    placeholder="Select warehouse"
                    isDark={isDark}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Tag</label>

                  <input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Choose tag"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={priceIncludesTax}
                    onChange={(e) => setPriceIncludesTax(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  Price includes tax
                </label>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="invoice-table w-full min-w-[1250px] border-collapse">
                  <thead>
                    <tr className="h-11 bg-[#EDFFFD]">
                      <th className="w-[210px] border-y border-[#d9dfe5] px-2 text-left text-sm font-semibold">
                        Product
                      </th>
                      <th className="w-[190px] border-y border-[#d9dfe5] px-2 text-left text-sm font-semibold">
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
                        Discount %
                      </th>
                      <th className="w-[100px] border-y border-[#d9dfe5] px-2 text-right text-sm font-semibold">
                        Tax %
                      </th>
                      <th className="w-[150px] border-y border-[#d9dfe5] px-2 text-right text-sm font-semibold">
                        Amount
                      </th>
                      <th className="w-[45px] border-y border-[#d9dfe5]" />
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="h-14">
                        <td className="border-b border-[#d9dfe5] px-2 py-2">
                          <Select
                            value={item.product}
                            onChange={(value) =>
                              updateItem(index, "product", value)
                            }
                            options={PRODUCT_OPTIONS}
                            placeholder="Select product"
                            isDark={isDark}
                          />
                        </td>

                        <td className="border-b border-[#d9dfe5] px-2 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            placeholder="Description"
                            className={inputClass}
                          />
                        </td>

                        <td className="border-b border-[#d9dfe5] px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(index, "qty", e.target.value)
                            }
                            className={`${inputClass} text-center`}
                          />
                        </td>

                        <td className="border-b border-[#d9dfe5] px-2 py-2">
                          <input
                            type="text"
                            value={item.units}
                            onChange={(e) =>
                              updateItem(index, "units", e.target.value)
                            }
                            placeholder="Units"
                            className={inputClass}
                          />
                        </td>

                        <td className="border-b border-[#d9dfe5] px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(index, "unitPrice", e.target.value)
                            }
                            className={`${inputClass} text-right`}
                          />
                        </td>

                        <td className="border-b border-[#d9dfe5] px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="any"
                            value={item.discount}
                            onChange={(e) =>
                              updateItem(index, "discount", e.target.value)
                            }
                            className={`${inputClass} text-right`}
                          />
                        </td>

                        <td className="border-b border-[#d9dfe5] px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.tax}
                            onChange={(e) =>
                              updateItem(index, "tax", e.target.value)
                            }
                            className={`${inputClass} text-right`}
                          />
                        </td>

                        <td className="amount-cell border-b border-[#d9dfe5] px-2 py-2 text-right text-sm font-medium">
                          Rp{formatCurrency(lineAmount(item) + lineTax(item))}
                        </td>

                        <td className="border-b border-[#d9dfe5] px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            title="Hapus baris"
                            className={`rounded-md p-2 ${
                              isDark
                                ? "text-[#f87171] hover:bg-[#3b2424]"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                style={{ color: accentColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(197, 161, 94, 0.12)"
                    : "#eff6ff";
                  e.currentTarget.style.color = accentHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = accentColor;
                }}
              >
                <Plus size={16} weight="bold" />
                Add a line
              </button>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Message
                  </label>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                    className={`h-20 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none ${
                      isDark
                        ? "border-[#444] bg-[#292929] text-[#f1f5f9]"
                        : "border-[#cfd6de] bg-white text-[#30343a]"
                    }`}
                  />

                  <label className="mb-2 mt-4 block text-sm font-medium">
                    Memo
                  </label>

                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Memo"
                    className={`h-20 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none ${
                      isDark
                        ? "border-[#444] bg-[#292929] text-[#f1f5f9]"
                        : "border-[#cfd6de] bg-white text-[#30343a]"
                    }`}
                  />

                  <label className="mb-2 mt-4 block text-sm font-medium">
                    Attachments
                  </label>

                  <div className="invoice-upload flex h-10 items-center overflow-hidden rounded-md border border-[#cfd6de]">
                    <label
                      className="cursor-pointer border-r border-[#cfd6de] px-3 text-sm font-medium transition-colors"
                      style={{ color: accentColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = accentHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = accentColor;
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
                      or drag and drop file here
                    </span>
                  </div>

                  <p className="invoice-muted mt-1.5 text-xs text-[#747c85]">
                    Files can be Excel, Word, PDF, JPG, PNG, or ZIP (maximum 5
                    files and 10 MB per file).
                  </p>

                  {files.length > 0 && (
                    <div className="invoice-muted mt-2 space-y-1 text-xs">
                      {files.map((file) => (
                        <div key={`${file.name}-${file.size}`}>{file.name}</div>
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
                        isDark={isDark}
                      />

                      <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className={`${inputClass} h-8 w-28 text-right`}
                      />
                    </div>
                  </div>

                  <div className="invoice-border flex items-center justify-between border-b border-dashed border-[#dfe4e8] py-1.5 text-sm">
                    <span>Tax</span>
                    <span>Rp{formatCurrency(tax)}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-base font-semibold">
                    <span>Total</span>
                    <span>Rp{formatCurrency(total)}</span>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={withholding}
                      onChange={(e) => setWithholding(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    Withholding
                  </label>

                  <div className="invoice-border mt-4 border-t border-dashed border-[#dfe4e8] pt-3">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Balance due</span>
                      <span>Rp{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="invoice-border mt-6 flex justify-end gap-2.5 border-t border-[#e1e5e9] pt-4">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/penjualan")}
                  className={`${btnModalCancel} focus:outline-none`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={`${btnModalSubmit} border-none text-white disabled:opacity-70`}
                  style={actionButtonStyle}
                >
                  {saving ? "Saving..." : "Create"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSubmit}
                  className={`${btnModalSubmit} border-none text-white disabled:opacity-70`}
                  style={actionButtonStyle}
                >
                  {saving ? "Saving..." : "Create and share"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
