import { useState, useEffect } from "react";
import { CaretDown, Gear } from "@phosphor-icons/react";

export default function CreatePurchaseOrderPage() {
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
  const [transactionNumber, setTransactionNumber] = useState("");
  const [tag, setTag] = useState("");
  const [supplierReference, setSupplierReference] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

  const inputClass =
    "h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]";

  const selectClass =
    "h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white pl-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]";

  const labelClass = "mb-1.5 block text-sm font-medium text-[#30343a]";

  return (
    <div
      className={
        isDark
          ? "dash-dark po-root min-h-full"
          : "po-root min-h-full bg-white text-[#30343b]"
      }
    >
      <style>{`
        .dash-dark.po-root {
          background-color: #121212 !important;
          color: #f1f5f9 !important;
        }

        .dash-dark.po-root .bg-white {
          background-color: #1e1e1e !important;
        }

        .dash-dark.po-root h1,
        .dash-dark.po-root .text-\\[\\#273142\\],
        .dash-dark.po-root .text-\\[\\#303846\\],
        .dash-dark.po-root .text-\\[\\#384151\\] {
          color: #f1f5f9 !important;
        }

        .dash-dark.po-root label,
        .dash-dark.po-root .text-\\[\\#30343a\\],
        .dash-dark.po-root .text-\\[\\#30343b\\],
        .dash-dark.po-root .text-\\[\\#56606e\\],
        .dash-dark.po-root .text-\\[\\#5f6876\\],
        .dash-dark.po-root .text-\\[\\#606977\\],
        .dash-dark.po-root .text-\\[\\#667080\\],
        .dash-dark.po-root .text-\\[\\#4f5866\\] {
          color: #d1d5db !important;
        }

        .dash-dark.po-root input:not([type="checkbox"]):not([type="file"]),
        .dash-dark.po-root select,
        .dash-dark.po-root textarea {
          background-color: #292929 !important;
          color: #f1f5f9 !important;
          border-color: #444 !important;
        }

        .dash-dark.po-root input::placeholder,
        .dash-dark.po-root textarea::placeholder {
          color: #858585 !important;
        }

        .dash-dark.po-root input[type="checkbox"] {
          accent-color: #c9a15b;
        }

        .dash-dark.po-root .border,
        .dash-dark.po-root .border-t,
        .dash-dark.po-root .border-b,
        .dash-dark.po-root .border-r {
          border-color: #3d3d3d !important;
        }

        .dash-dark.po-root .border-dashed {
          border-color: #444 !important;
        }

        .dash-dark.po-root .bg-\\[\\#EDFFFD\\] {
          background-color: #1e1e1e !important;
        }

        .dash-dark.po-root .bg-\\[\\#fafbfc\\],
        .dash-dark.po-root .hover\\:bg-\\[\\#f7f8fa\\]:hover {
          background-color: #292929 !important;
        }

        .dash-dark.po-root button.bg-white {
          background-color: #292929 !important;
          color: #bebebe !important;
        }

        .dash-dark.po-root .shadow-\\[0_1px_3px_rgba\\(0\\,0\\,0\\,0\\.04\\)\\] {
          box-shadow: none !important;
        }

        .dash-dark.po-root .purchase-create-button {
          background-color: #292929 !important;
          color: #c9a15b !important;
          border-color: #444 !important;
        }

        .dash-dark.po-root .purchase-file-button {
          background-color: #292929 !important;
          color: #c9a15b !important;
          border-color: #444 !important;
        }
      `}</style>

      <div className="w-full px-6 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div
              className={`text-sm font-medium ${
                isDark ? "text-[#c9a15b]" : "text-[#7084d8]"
              }`}
            >
              Pembelian
            </div>

            <h1 className="mt-1 text-2xl font-semibold text-[#273142]">
              Buat Pesanan Pembelian
            </h1>
          </div>

          <div className="relative">
            <select
              defaultValue="Pesanan Pembelian"
              className="h-9 w-44 appearance-none rounded-md border border-[#cfd6de] bg-white pl-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
            >
              <option value="Pesanan Pembelian">Pesanan Pembelian</option>
            </select>

            <CaretDown
              size={14}
              weight="bold"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
            />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#d4dbe2] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-[1.05fr_1.05fr_0.95fr] gap-5 px-5 py-5">
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

            <div className="flex flex-col items-end justify-center">
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
                <label className={labelClass}>Tgl. jatuh tempo</label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Syarat pembayaran</label>

                <div className="relative">
                  <select defaultValue="Net 30" className={selectClass}>
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

              <div className="mt-4">
                <label className={labelClass}>Gudang</label>

                <div className="relative">
                  <select
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Pilih gudang</option>
                    <option value="Gudang Utama">Gudang Utama</option>
                    <option value="Gudang Cabang">Gudang Cabang</option>
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
                <label className={labelClass}>Tag</label>

                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Pilih tag"
                  className={inputClass}
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={taxIncluded}
                  onChange={(e) => setTaxIncluded(e.target.checked)}
                  className="h-4 w-4"
                />

                <span className="text-sm text-[#6b7280]">
                  Harga termasuk pajak
                </span>
              </div>
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
              <label className="purchase-file-button flex h-full cursor-pointer items-center border-r border-[#cfd6de] bg-[#fafbfc] px-3 text-sm text-[#667080]">
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
              className="h-9 rounded-md bg-white px-4 text-sm font-medium text-[#606977] hover:bg-[#f7f8fa]"
            >
              Batalkan
            </button>

            <div className="relative">
              <button
                type="button"
                className={`purchase-create-button flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium ${
                  isDark
                    ? "bg-[#292929] text-[#c9a15b]"
                    : "bg-[#e9edf2] text-[#9ba3af]"
                }`}
              >
                Buat
                <CaretDown size={14} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
