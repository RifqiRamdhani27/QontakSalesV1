import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, GearSix, Plus } from "@phosphor-icons/react";

const supplierOptions = [
  {
    name: "PT Sumber Makmur",
    email: "supplier@sumbermakmur.com",
    address: "Jl. Indonesia Blok C No. 22",
  },
  {
    name: "CV Maju Bersama",
    email: "admin@majubersama.com",
    address: "Jl. Merdeka No. 15",
  },
  {
    name: "PT Nusantara Jaya",
    email: "info@nusantarajaya.com",
    address: "Jl. Asia Afrika No. 10",
  },
];

const productOptions = ["Laptop", "Monitor", "Keyboard", "Mouse"];

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function FieldLabel({ children, required = false, icon = null }) {
  return (
    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#30343a]">
      <span>
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {icon}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD] ${className}`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options = [],
  placeholder = "",
  disabled = false,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white px-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD] disabled:bg-[#f4f6f8]"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <CaretDown
        size={13}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
      />
    </div>
  );
}

function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="h-9 w-full min-w-0 rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
    />
  );
}

function TextArea({ value, onChange, placeholder = "", rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
    />
  );
}

export default function CreatePurchaseInvoicePage() {
  const navigate = useNavigate();

  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("app_theme") || "light",
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

  const [supplier, setSupplier] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-10-01");
  const [dueDate, setDueDate] = useState("2026-10-31");
  const [transactionNumber, setTransactionNumber] = useState("[Auto]");
  const [supplierReference, setSupplierReference] = useState("");
  const [tag, setTag] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("Net 30");
  const [warehouse, setWarehouse] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [products, setProducts] = useState([{ product: "" }]);
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const total = 0;

  const handleSupplierChange = (event) => {
    const value = event.target.value;
    setSupplier(value);

    const selectedSupplier = supplierOptions.find(
      (item) => item.name === value,
    );

    if (!selectedSupplier) {
      setEmail("");
      setBillingAddress("");
      return;
    }

    setEmail(selectedSupplier.email);
    setBillingAddress(selectedSupplier.address);
  };

  const handleProductChange = (index, event) => {
    const value = event.target.value;

    setProducts((previous) => {
      const updated = [...previous];
      updated[index] = {
        ...updated[index],
        product: value,
      };
      return updated;
    });
  };

  const addProductRow = () => {
    setProducts((previous) => [...previous, { product: "" }]);
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setAttachment(file);
    }
  };

  const handleCancel = () => {
    navigate("/pembelian");
  };

  const handleCreate = () => {
    alert(
      "Form faktur pembelian masih berupa tampilan dan belum tersimpan ke database.",
    );
  };

  return (
    <div className={isDark ? "dash-dark pi-root" : "pi-root"}>
      <style>{`
        input[type="checkbox"] {
          accent-color: #611be2;
        }

        .dash-dark.pi-root {
          background-color: #121212 !important;
          color: #ffffff !important;
          min-height: 100%;
        }

        .dash-dark.pi-root h1,
        .dash-dark.pi-root .text-\\[252a31\\],
        .dash-dark.pi-root .text-\\[292e34\\],
        .dash-dark.pi-root .text-\\[30343b\\],
        .dash-dark.pi-root .text-\\[30343a\\],
        .dash-dark.pi-root .text-\\[464c53\\],
        .dash-dark.pi-root .text-\\[515a63\\],
        .dash-dark.pi-root .text-\\[59616a\\] {
          color: #ffffff !important;
        }

        .dash-dark.pi-root .rounded-xl.border {
          background-color: #1e1e1e !important;
          border-color: #383838 !important;
          box-shadow: none !important;
        }

        .dash-dark.pi-root input:not([type="checkbox"]):not([type="file"]),
        .dash-dark.pi-root select,
        .dash-dark.pi-root textarea {
          background-color: #292929 !important;
          color: #ffffff !important;
          border-color: #484848 !important;
        }

        .dash-dark.pi-root input::placeholder,
        .dash-dark.pi-root textarea::placeholder {
          color: #9ca3af !important;
        }

        .dash-dark.pi-root select option {
          background-color: #292929;
          color: #ffffff;
        }

        .dash-dark.pi-root input:disabled,
        .dash-dark.pi-root select:disabled {
          background-color: #333333 !important;
          color: #a1a1aa !important;
        }

        .dash-dark.pi-root table {
          background-color: #1e1e1e !important;
        }

        .dash-dark.pi-root table thead,
        .dash-dark.pi-root table thead tr,
        .dash-dark.pi-root table th {
          background-color: #1e1e1e !important;
          color: #ffffff !important;
        }

        .dash-dark.pi-root table tbody,
        .dash-dark.pi-root table tbody tr,
        .dash-dark.pi-root table td {
          background-color: #1e1e1e !important;
          color: #ffffff !important;
        }

        .dash-dark.pi-root table th,
        .dash-dark.pi-root table td {
          border-color: #404040 !important;
        }

        .dash-dark.pi-root .border-b,
        .dash-dark.pi-root .border-t,
        .dash-dark.pi-root .border-r,
        .dash-dark.pi-root .border-y {
          border-color: #383838 !important;
        }

        .dash-dark.pi-root button.border,
        .dash-dark.pi-root label.border {
          border-color: #484848 !important;
        }

        .dash-dark.pi-root button.bg-white,
        .dash-dark.pi-root .bg-white {
          background-color: #292929 !important;
          color: #ffffff !important;
        }

        .dash-dark.pi-root .hover\\:bg-\\[\\#f4f6f8\\]:hover,
        .dash-dark.pi-root .hover\\:bg-\\[\\#f5f7f9\\]:hover {
          background-color: #383838 !important;
        }

        .dash-dark.pi-root .text-\\[747c85\\],
        .dash-dark.pi-root .text-\\[7b848d\\],
        .dash-dark.pi-root .text-\\[9199a2\\],
        .dash-dark.pi-root .text-\\[98a0a8\\],
        .dash-dark.pi-root .text-\\[9aa2ab\\] {
          color: #a1a1aa !important;
        }

        .dash-dark.pi-root .bg-\\[\\#eef1f5\\] {
          background-color: #333333 !important;
        }

        .dash-dark.pi-root .text-\\[aeb5bd\\] {
          color: #777777 !important;
        }

        .dash-dark.pi-root .shadow-lg {
          background-color: #292929 !important;
          border-color: #484848 !important;
        }

        .pi-root:not(.dash-dark) h1,
        .pi-root:not(.dash-dark) label,
        .pi-root:not(.dash-dark) th,
        .pi-root:not(.dash-dark) td,
        .pi-root:not(.dash-dark) p,
        .pi-root:not(.dash-dark) .text-\\[252a31\\],
        .pi-root:not(.dash-dark) .text-\\[292e34\\],
        .pi-root:not(.dash-dark) .text-\\[30343a\\],
        .pi-root:not(.dash-dark) .text-\\[30343b\\],
        .pi-root:not(.dash-dark) .text-\\[464c53\\],
        .pi-root:not(.dash-dark) .text-\\[515a63\\],
        .pi-root:not(.dash-dark) .text-\\[59616a\\] {
          color: #000000 !important;
        }

        .dash-dark.pi-root h1,
        .dash-dark.pi-root label,
        .dash-dark.pi-root th,
        .dash-dark.pi-root td,
        .dash-dark.pi-root p,
        .dash-dark.pi-root .text-\\[252a31\\],
        .dash-dark.pi-root .text-\\[292e34\\],
        .dash-dark.pi-root .text-\\[30343a\\],
        .dash-dark.pi-root .text-\\[30343b\\],
        .dash-dark.pi-root .text-\\[464c53\\],
        .dash-dark.pi-root .text-\\[515a63\\],
        .dash-dark.pi-root .text-\\[59616a\\] {
          color: #ffffff !important;
        }

        .pi-root:not(.dash-dark) .text-\\[7084d8\\] {
          color: #7084d8 !important;
        }

        .pi-root:not(.dash-dark) .text-\\[536bc7\\] {
          color: #536bc7 !important;
        }

        .dash-dark.pi-root .text-red-500 {
          color: #f87171 !important;
        }

        .dash-dark.pi-root .text-\\[c9a15b\\] {
          color: #c9a15b !important;
        }

        .dash-dark.pi-root .text-\\[dfbd7c\\] {
          color: #dfbd7c !important;
        }

        .dash-dark.pi-root .pi-attachment-label {
          border-right-color: #996515 !important;
          background-color: #333333 !important;
          color: #c9a15b !important;
        }

        .dash-dark.pi-root .pi-attachment-label:hover {
          color: #dfbd7c !important;
        }

        .pi-root:not(.dash-dark) .pi-attachment-label {
          border-right-color: #7084d8 !important;
          background-color: #f5f7ff !important;
          color: #7084d8 !important;
        }

        .pi-root:not(.dash-dark) .pi-attachment-label:hover {
          color: #536bc7 !important;
        }
      `}</style>

      <div className="min-h-full bg-white text-[#30343b]">
        <div className="w-full px-6 pb-8 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`mb-1.5 flex items-center gap-1 text-sm font-semibold transition-colors ${
                  isDark
                    ? "text-[#c9a15b] hover:text-[#dfbd7c]"
                    : "text-[#7084d8] hover:text-[#536bc7]"
                }`}
              >
                Pembelian
              </button>

              <h1 className="mt-2 text-2xl font-semibold leading-tight text-[#252a31]">
                Buat Faktur Pembelian
              </h1>
            </div>

            <div className="relative w-44">
              <select
                value="Faktur Pembelian"
                disabled
                className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white px-3 pr-8 text-sm text-[#30343b]"
              >
                <option>Faktur Pembelian</option>
              </select>

              <CaretDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
              />
            </div>
          </div>

          <div
            className="mt-5 rounded-xl border border-[#d4dbe2] bg-white"
            style={{
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div className="border-b border-dashed border-[#e2e6ea] px-5 py-5">
              <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <div>
                  <FieldLabel required>Supplier</FieldLabel>

                  <SelectInput
                    value={supplier}
                    onChange={handleSupplierChange}
                    options={supplierOptions.map((item) => item.name)}
                    placeholder="Pilih supplier"
                  />
                </div>

                <div>
                  <FieldLabel>Email</FieldLabel>

                  <TextInput
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="e.g. supplier@example.com"
                  />
                </div>

                <div className="flex items-center justify-end pb-1">
                  <div className="whitespace-nowrap text-xl font-semibold text-[#292e34]">
                    Total Rp{formatCurrency(total)}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <FieldLabel>Alamat penagihan</FieldLabel>

                  <TextArea
                    value={billingAddress}
                    onChange={(event) => setBillingAddress(event.target.value)}
                    placeholder="e.g. Jalan Indonesia Blok C No. 22"
                    rows={4}
                  />
                </div>

                <div>
                  <FieldLabel>Tgl. transaksi</FieldLabel>

                  <DateInput
                    value={transactionDate}
                    onChange={(event) => setTransactionDate(event.target.value)}
                  />

                  <div className="mt-4">
                    <FieldLabel>Tgl. jatuh tempo</FieldLabel>

                    <DateInput
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <FieldLabel>Syarat pembayaran</FieldLabel>

                    <SelectInput
                      value={paymentTerm}
                      onChange={(event) => setPaymentTerm(event.target.value)}
                      options={["Net 30", "Net 15", "Net 45", "COD"]}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel
                    icon={<GearSix size={14} className="text-[#7b848d]" />}
                  >
                    No. transaksi
                  </FieldLabel>

                  <div className="relative">
                    <TextInput
                      value={transactionNumber}
                      onChange={(event) =>
                        setTransactionNumber(event.target.value)
                      }
                    />

                    <GearSix
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9199a2]"
                    />
                  </div>

                  <div className="mt-4">
                    <FieldLabel>Nomor referensi supplier</FieldLabel>

                    <TextInput
                      value={supplierReference}
                      onChange={(event) =>
                        setSupplierReference(event.target.value)
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <FieldLabel>Gudang</FieldLabel>

                    <SelectInput
                      value={warehouse}
                      onChange={(event) => setWarehouse(event.target.value)}
                      options={[
                        "Gudang Utama",
                        "Gudang Bandung",
                        "Gudang Jakarta",
                      ]}
                      placeholder="Pilih gudang"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Tag</FieldLabel>

                  <SelectInput
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    options={["Operasional", "Inventori", "Pembelian"]}
                    placeholder="Pilih tag"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <label className="flex items-center gap-2 text-sm text-[#464c53]">
                  <input
                    type="checkbox"
                    checked={taxIncluded}
                    onChange={(event) => setTaxIncluded(event.target.checked)}
                    className="h-4 w-4 rounded border-[#cfd6de]"
                  />
                  Harga termasuk pajak
                </label>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse">
                  <thead>
                    <tr className="h-11 bg-[#EDFFFD]">
                      <th className="border-y border-[#d9dfe5] px-2 text-left text-sm font-semibold">
                        Produk
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((item, index) => (
                      <tr key={index} className="h-14">
                        <td className="border-b border-[#d9dfe5] px-2">
                          <SelectInput
                            value={item.product}
                            onChange={(event) =>
                              handleProductChange(index, event)
                            }
                            options={productOptions}
                            placeholder="Pilih produk"
                            className="w-[250px]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={addProductRow}
                className={`mt-3 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "text-[#c9a15b] hover:text-[#dfbd7c]"
                    : "text-[#7084d8] hover:text-[#536bc7]"
                }`}
              >
                <Plus size={14} weight="bold" />
                Tambah baris
              </button>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
                <div>
                  <FieldLabel>Pesan</FieldLabel>

                  <TextArea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Pesan"
                    rows={3}
                  />

                  <div className="mt-4">
                    <FieldLabel>Memo</FieldLabel>

                    <TextArea
                      value={memo}
                      onChange={(event) => setMemo(event.target.value)}
                      placeholder="Memo"
                      rows={3}
                    />
                  </div>

                  <div className="mt-4">
                    <FieldLabel>Lampiran</FieldLabel>

                    <div
                      className={`flex h-10 items-center overflow-hidden rounded-md border ${
                        isDark ? "border-[#996515]" : "border-[#7084d8]"
                      }`}
                    >
                      <label
                        className={`pi-attachment-label flex h-full cursor-pointer items-center border-r px-3 text-sm font-medium transition-colors ${
                          isDark
                            ? "border-[#996515] bg-[#333333] text-[#c9a15b] hover:text-[#dfbd7c]"
                            : "border-[#7084d8] bg-[#f5f7ff] text-[#7084d8] hover:text-[#536bc7]"
                        }`}
                      >
                        Pilih file
                        <input
                          type="file"
                          onChange={handleAttachment}
                          className="hidden"
                        />
                      </label>

                      <span className="truncate px-3 text-xs text-[#98a0a8]">
                        {attachment
                          ? attachment.name
                          : "atau tarik & lepas file di sini"}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-[#747c85]">
                      File dapat berupa Excel, Word, PDF, JPG, PNG, atau ZIP
                      (maksimum 5 file dan 10 MB per file).
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#dfe4e8] py-2 text-sm">
                    <span className="text-[#515a63]">Subtotal</span>
                    <span>Rp{formatCurrency(0)}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-dashed border-[#dfe4e8] py-2 text-sm font-semibold">
                    <span className="text-[#515a63]">Total</span>
                    <span>Rp{formatCurrency(0)}</span>
                  </div>

                  <div className="flex items-center gap-2 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#cfd6de]"
                    />

                    <span className="text-sm text-[#59616a]">Pemotongan</span>
                  </div>

                  <div className="mt-4 border-t border-dashed border-[#dfe4e8] pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Sisa tagihan</span>
                      <span>Rp{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#e1e5e9] px-5 py-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-[#cfd6de] bg-white px-4 py-2 text-sm font-medium text-[#606a74] transition-colors hover:bg-[#f4f6f8]"
              >
                Batalkan
              </button>

              <div className="relative flex">
                <button
                  type="button"
                  onClick={handleCreate}
                  className={`rounded-l-md px-5 py-2 text-sm font-medium text-white transition-colors ${
                    isDark
                      ? "bg-[#996515] hover:bg-[#7A5010]"
                      : "bg-[#7084d8] hover:bg-[#536bc7]"
                  }`}
                >
                  Buat
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateMenu((previous) => !previous)}
                  className={`flex items-center rounded-r-md border-l border-white/30 px-3 text-white transition-colors ${
                    isDark
                      ? "bg-[#996515] hover:bg-[#7A5010]"
                      : "bg-[#7084d8] hover:bg-[#536bc7]"
                  }`}
                >
                  <CaretDown size={13} weight="bold" />
                </button>

                {showCreateMenu && (
                  <div className="absolute bottom-12 right-0 z-30 w-40 overflow-hidden rounded-lg border border-[#d4dbe3] bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateMenu(false);
                        handleCreate();
                      }}
                      className="block w-full px-3 py-2.5 text-left text-sm text-[#4e5862] hover:bg-[#f5f7f9]"
                    >
                      Buat & kirim
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateMenu(false);
                        handleCreate();
                      }}
                      className="block w-full px-3 py-2.5 text-left text-sm text-[#4e5862] hover:bg-[#f5f7f9]"
                    >
                      Buat & cetak
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled
                className="rounded-md bg-[#eef1f5] px-4 py-2 text-sm font-medium text-[#aeb5bd]"
              >
                Simpan & bayar dengan Mekari Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
