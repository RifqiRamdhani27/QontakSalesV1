import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, Gear } from "@phosphor-icons/react";

export default function CreatePurchaseQuotePage() {
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
  const [expiryDate, setExpiryDate] = useState("2026-10-31");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [supplierReference, setSupplierReference] = useState("");
  const [tag, setTag] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("Net 30");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);

  const handleCancel = () => {
    navigate("/pembelian");
  };

  const inputClass =
    "h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]";

  const selectClass =
    "h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white pl-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]";

  const labelClass = "mb-1.5 block text-sm font-medium text-[#30343a]";

  return (
    <div
      className={
        isDark
          ? "dash-dark pq-root min-h-full"
          : "pq-root min-h-full bg-white text-[#30343b]"
      }
    >
      <style>{`
        .dash-dark.pq-root {
          background-color: #121212 !important;
          color: #f1f5f9 !important;
        }

        .dash-dark.pq-root .bg-white {
          background-color: #1e1e1e !important;
        }

        .dash-dark.pq-root h1,
        .dash-dark.pq-root .text-\\[\\#273142\\],
        .dash-dark.pq-root .text-\\[\\#303846\\],
        .dash-dark.pq-root .text-\\[\\#384151\\] {
          color: #f1f5f9 !important;
        }

        .dash-dark.pq-root label,
        .dash-dark.pq-root .text-\\[\\#30343a\\],
        .dash-dark.pq-root .text-\\[\\#30343b\\],
        .dash-dark.pq-root .text-\\[\\#56606e\\],
        .dash-dark.pq-root .text-\\[\\#5f6876\\],
        .dash-dark.pq-root .text-\\[\\#606977\\],
        .dash-dark.pq-root .text-\\[\\#667080\\],
        .dash-dark.pq-root .text-\\[\\#4f5866\\] {
          color: #d1d5db !important;
        }

        .dash-dark.pq-root input:not([type="checkbox"]):not([type="file"]),
        .dash-dark.pq-root select,
        .dash-dark.pq-root textarea {
          background-color: #292929 !important;
          color: #f1f5f9 !important;
          border-color: #444 !important;
        }

        .dash-dark.pq-root input::placeholder,
        .dash-dark.pq-root textarea::placeholder {
          color: #858585 !important;
        }

        .dash-dark.pq-root input[type="checkbox"] {
          accent-color: #c9a15b;
        }

        .dash-dark.pq-root .border,
        .dash-dark.pq-root .border-t,
        .dash-dark.pq-root .border-b,
        .dash-dark.pq-root .border-r {
          border-color: #3d3d3d !important;
        }

        .dash-dark.pq-root .border-dashed {
          border-color: #444 !important;
        }

        .dash-dark.pq-root .bg-\\[\\#EDFFFD\\] {
          background-color: #263b3b !important;
        }

        .dash-dark.pq-root .bg-\\[\\#fafbfc\\],
        .dash-dark.pq-root .hover\\:bg-\\[\\#f7f8fa\\]:hover {
          background-color: #292929 !important;
        }

        .dash-dark.pq-root button.bg-white {
          background-color: #292929 !important;
          color: #d1d5db !important;
        }

        .dash-dark.pq-root .shadow-\\[0_1px_3px_rgba\\(0\\,0\\,0\\,0\\.04\\)\\] {
          box-shadow: none !important;
        }

        .dash-dark.pq-root .pq-breadcrumb {
          color: #c9a15b !important;
        }

        .dash-dark.pq-root .pq-create-button {
          background-color: #c9a15b !important;
          color: #121212 !important;
          border-color: #c9a15b !important;
        }

        .dash-dark.pq-root .pq-create-button:hover {
          background-color: #dfbd7c !important;
        }

        .dash-dark.pq-root .pq-file-button {
          background-color: #333333 !important;
          color: #c9a15b !important;
          border-color: #996515 !important;
        }

        .dash-dark.pq-root .pq-file-button:hover {
          color: #dfbd7c !important;
          background-color: #3b3b3b !important;
        }
      `}</style>

      <div className="w-full px-6 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div
              className={`pq-breadcrumb text-sm font-medium ${
                isDark ? "text-[#c9a15b]" : "text-[#7084d8]"
              }`}
            >
              Pembelian
            </div>

            <h1 className="mt-1 text-2xl font-semibold text-[#273142]">
              Buat Penawaran Pembelian
            </h1>
          </div>

          <div className="relative">
            <select
              defaultValue="Penawaran Pembelian"
              className="h-9 w-44 appearance-none rounded-md border border-[#cfd6de] bg-white pl-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
            >
              <option value="Penawaran Pembelian">Penawaran Pembelian</option>
            </select>

            <CaretDown
              size={14}
              weight="bold"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
            />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#d4dbe2] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[1.05fr_1.05fr_1fr] gap-5 px-5 py-5">
            <div>
              <label className={labelClass}>
                Supplier <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih supplier</option>
                  <option value="Supplier A">Supplier A</option>
                  <option value="Supplier B">Supplier B</option>
                  <option value="Supplier C">Supplier C</option>
                </select>

                <CaretDown
                  size={14}
                  weight="bold"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697386]"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-end">
              <div className="text-xl font-semibold text-[#303846]">
                Total Rp0,00
              </div>
            </div>
          </div>

          <div className="mx-5 border-t border-dashed border-[#e2e6ea]" />

          <div className="grid grid-cols-[1.05fr_0.95fr_0.95fr_0.95fr] gap-5 px-5 py-5">
            <div>
              <label className={labelClass}>Alamat penagihan</label>

              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="e.g. Jalan Indonesia Blok C No. 22"
                className="h-[110px] w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none placeholder:text-[#98a0ad] focus:border-[#4B61DD]"
              />
            </div>

            <div>
              <div>
                <label className={labelClass}>Tgl. transaksi</label>

                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Tgl. kedaluwarsa</label>

                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Syarat pembayaran</label>

                <div className="relative">
                  <select
                    value={paymentTerm}
                    onChange={(e) => setPaymentTerm(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 7">Net 7</option>
                    <option value="COD">COD</option>
                  </select>

                  <CaretDown
                    size={14}
                    weight="bold"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697386]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div>
                <label className={`${labelClass} flex items-center gap-2`}>
                  No Transaksi
                  <Gear size={15} className="text-[#929aa7]" />
                </label>

                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  placeholder="[Auto]"
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Nomor referensi supplier</label>

                <input
                  type="text"
                  value={supplierReference}
                  onChange={(e) => setSupplierReference(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div>
                <label className={labelClass}>Tag</label>

                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Pilih tag"
                  className={inputClass}
                />
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm text-[#6b7280]">
                <input
                  type="checkbox"
                  checked={taxIncluded}
                  onChange={(e) => setTaxIncluded(e.target.checked)}
                  className="h-4 w-4"
                />
                Harga termasuk pajak
              </label>
            </div>
          </div>

          <div className="mx-5 border-t border-dashed border-[#e2e6ea]" />

          <div className="px-5 py-5">
            <div className="grid grid-cols-[1.15fr_1.1fr_0.75fr_0.75fr_1fr_0.7fr_1fr] border-b border-[#d3d8e0] bg-[#EDFFFD]">
              <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                Produk
              </div>

              <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                Deskripsi
              </div>

              <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                Kuantitas
              </div>

              <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                Unit
              </div>

              <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                Harga satuan
              </div>

              <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                Pajak
              </div>

              <div className="px-3 py-3 text-right text-sm font-semibold text-[#4f5866]">
                Jumlah
              </div>
            </div>

            <div className="grid min-h-[58px] grid-cols-[1.15fr_1.1fr_0.75fr_0.75fr_1fr_0.7fr_1fr] border-b border-dashed border-[#e2e6ea]">
              <div className="px-2 py-2">
                <div className="relative">
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white pl-3 pr-8 text-sm text-[#8b94a2] outline-none focus:border-[#4B61DD]"
                  >
                    <option value="">Pilih produk</option>
                    <option value="Produk A">Produk A</option>
                    <option value="Produk B">Produk B</option>
                    <option value="Produk C">Produk C</option>
                  </select>

                  <CaretDown
                    size={14}
                    weight="bold"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697386]"
                  />
                </div>
              </div>

              <div />
              <div />
              <div />
              <div />
              <div />

              <div className="flex items-center justify-end px-3 text-sm font-medium text-[#5f6876]">
                Rp0,00
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1.05fr_1.05fr_1fr] gap-5 px-5 pt-2">
            <div>
              <label className={labelClass}>Pesan</label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pesan"
                className="h-[110px] w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none placeholder:text-[#98a0ad] focus:border-[#4B61DD]"
              />
            </div>

            <div />

            <div className="pt-1">
              <div className="flex items-center justify-between border-b border-dashed border-[#dfe3ea] px-1 py-3">
                <span className="text-sm font-medium text-[#56606e]">
                  Subtotal
                </span>

                <span className="text-sm font-medium text-[#56606e]">
                  Rp0,00
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-dashed border-[#dfe3ea] px-1 py-3">
                <span className="text-sm font-medium text-[#56606e]">
                  Total
                </span>

                <span className="text-sm font-medium text-[#56606e]">
                  Rp0,00
                </span>
              </div>

              <div className="flex items-center justify-between px-1 py-3">
                <span className="text-base font-semibold text-[#384151]">
                  Sisa tagihan
                </span>

                <span className="text-base font-semibold text-[#384151]">
                  Rp0,00
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 pt-5">
            <div className="w-[360px] max-w-full">
              <label className={labelClass}>Memo</label>

              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Memo"
                className="h-[110px] w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none placeholder:text-[#98a0ad] focus:border-[#4B61DD]"
              />
            </div>
          </div>

          <div className="px-5 pb-6 pt-5">
            <label className={labelClass}>Lampiran</label>

            <div className="flex h-10 w-[360px] max-w-full items-center rounded-md border border-[#cfd6de] bg-white">
              <label
                className={`pq-file-button flex h-full cursor-pointer items-center border-r px-3 text-sm font-medium ${
                  isDark
                    ? "border-[#996515] bg-[#333333] text-[#c9a15b]"
                    : "border-[#7084d8] bg-[#f5f7ff] text-[#7084d8] hover:text-[#536bc7]"
                }`}
              >
                <input type="file" className="hidden" />
                Choose file
              </label>

              <span className="px-3 text-sm text-[#a2a9b4]">
                atau tarik & lepas file di sini
              </span>
            </div>

            <div className="mt-2 text-xs leading-5 text-[#9aa2ad]">
              File dapat berupa Excel, Word, PDF, JPG, PNG, atau ZIP (maksimum 5
              file dan 10 MB per file).
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#e1e4e9] px-5 py-4">
            <button
              type="button"
              onClick={handleCancel}
              className="h-9 rounded-md bg-white px-4 text-sm font-medium text-[#606977] hover:bg-[#f7f8fa]"
            >
              Batalkan
            </button>

            <button
              type="button"
              disabled
              className={`pq-create-button flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors ${
                isDark
                  ? "bg-[#c9a15b] text-[#121212] hover:bg-[#dfbd7c]"
                  : "bg-[#7084d8] text-white hover:bg-[#536bc7]"
              }`}
            >
              Buat
              <CaretDown size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
