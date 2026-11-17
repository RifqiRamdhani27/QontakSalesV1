import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, Gear } from "@phosphor-icons/react";

export default function CreatePurchaseRequestPage() {
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

  const [approver, setApprover] = useState("");
  const [approverEmail, setApproverEmail] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-10-01");
  const [dueDate, setDueDate] = useState("");
  const [urgency, setUrgency] = useState("Sedang");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [budgetYear, setBudgetYear] = useState("");
  const [tag, setTag] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

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
          ? "dash-dark pr-root min-h-full"
          : "pr-root min-h-full bg-white text-[#30343b]"
      }
    >
      <style>{`
        .dash-dark.pr-root {
          background-color: #121212 !important;
          color: #f1f5f9 !important;
        }

        .dash-dark.pr-root .bg-white {
          background-color: #1e1e1e !important;
        }

        .dash-dark.pr-root h1,
        .dash-dark.pr-root .text-\\[\\#273142\\] {
          color: #f1f5f9 !important;
        }

        .dash-dark.pr-root label,
        .dash-dark.pr-root .text-\\[\\#30343a\\],
        .dash-dark.pr-root .text-\\[\\#30343b\\],
        .dash-dark.pr-root .text-\\[\\#4b5563\\],
        .dash-dark.pr-root .text-\\[\\#4f5866\\],
        .dash-dark.pr-root .text-\\[\\#56606e\\],
        .dash-dark.pr-root .text-\\[\\#606977\\],
        .dash-dark.pr-root .text-\\[\\#667080\\] {
          color: #d1d5db !important;
        }

        .dash-dark.pr-root input:not([type="checkbox"]):not([type="file"]),
        .dash-dark.pr-root select,
        .dash-dark.pr-root textarea {
          background-color: #292929 !important;
          color: #f1f5f9 !important;
          border-color: #444 !important;
        }

        .dash-dark.pr-root input::placeholder,
        .dash-dark.pr-root textarea::placeholder {
          color: #858585 !important;
        }

        .dash-dark.pr-root input[type="checkbox"] {
          accent-color: #c9a15b;
        }

        .dash-dark.pr-root .border,
        .dash-dark.pr-root .border-t,
        .dash-dark.pr-root .border-b,
        .dash-dark.pr-root .border-r {
          border-color: #3d3d3d !important;
        }

        .dash-dark.pr-root .border-dashed {
          border-color: #444 !important;
        }

        .dash-dark.pr-root .bg-\\[\\#EDFFFD\\] {
          background-color: #292929 !important;
        }

        .dash-dark.pr-root .pr-product-header {
          background-color: #181818 !important;
          border-color: #3d3d3d !important;
        }

        .dash-dark.pr-root .pr-product-header > div {
          color: #ffffff !important;
        }

        .dash-dark.pr-root .bg-\\[\\#edf0f3\\] {
          background-color: #292929 !important;
        }

        .dash-dark.pr-root .bg-\\[\\#fafbfc\\],
        .dash-dark.pr-root .hover\\:bg-\\[\\#f7f8fa\\]:hover {
          background-color: #292929 !important;
        }

        .dash-dark.pr-root button.bg-white {
          background-color: #292929 !important;
          color: #d1d5db !important;
        }

        .dash-dark.pr-root .shadow-\\[0_1px_3px_rgba\\(0\\,0\\,0\\,0\\.04\\)\\] {
          box-shadow: none !important;
        }

        .dash-dark.pr-root .pr-file-label,
        .dash-dark.pr-root .pr-file-label span {
          color: #c9a15b !important;
        }

        .dash-dark.pr-root .pr-file-label:hover,
        .dash-dark.pr-root .pr-file-label:hover span {
          color: #dfbd7c !important;
        }

        .dash-dark.pr-root .pr-create-button {
          background-color: #c9a15b !important;
          color: #1e1e1e !important;
          border-color: #c9a15b !important;
        }

        .dash-dark.pr-root .pr-create-button:hover {
          background-color: #dfbd7c !important;
          border-color: #dfbd7c !important;
        }
      `}</style>

      <div className="w-full px-6 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div
              className={`text-sm font-medium transition-colors ${
                isDark
                  ? "text-[#c9a15b] hover:text-[#dfbd7c]"
                  : "text-[#7084d8] hover:text-[#536bc7]"
              }`}
            >
              Pembelian
            </div>

            <h1 className="mt-1 text-2xl font-semibold text-[#273142]">
              Buat Permintaan Pembelian
            </h1>
          </div>

          <div className="relative">
            <select
              defaultValue="Permintaan Pembelian"
              className="h-9 w-52 appearance-none rounded-md border border-[#cfd6de] bg-white pl-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
            >
              <option value="Faktur Pembelian">Faktur Pembelian</option>
              <option value="Tukar Faktur Pembelian">
                Tukar Faktur Pembelian
              </option>
              <option value="Pesanan Pembelian">Pesanan Pembelian</option>
              <option value="Penawaran Pembelian">Penawaran Pembelian</option>
              <option value="Permintaan Pembelian">Permintaan Pembelian</option>
            </select>

            <CaretDown
              size={14}
              weight="bold"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
            />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#d4dbe2] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-3 gap-5 px-5 py-5">
            <div>
              <label className={labelClass}>
                Staf penyetuju <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Pilih staf</option>
                  <option value="Staf A">Staf A</option>
                  <option value="Staf B">Staf B</option>
                  <option value="Staf C">Staf C</option>
                </select>

                <CaretDown
                  size={14}
                  weight="bold"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697386]"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Email penyetuju <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={approverEmail}
                onChange={(e) => setApproverEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className={inputClass}
              />
            </div>

            <div />
          </div>

          <div className="mx-5 border-t border-dashed border-[#e2e6ea]" />

          <div className="grid grid-cols-3 gap-5 px-5 py-5">
            <div>
              <label className={labelClass}>Nama supplier</label>

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

              <div className="mt-4">
                <label className={labelClass}>Email supplier</label>

                <div className="relative">
                  <select
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-[#edf0f3] pl-3 pr-9 text-sm text-[#9aa2ad] outline-none"
                  >
                    <option value="">e.g. john@example.com</option>
                    <option value="supplier@example.com">
                      supplier@example.com
                    </option>
                  </select>

                  <CaretDown
                    size={14}
                    weight="bold"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8f98a5]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Alamat supplier</label>

              <textarea
                value={supplierAddress}
                onChange={(e) => setSupplierAddress(e.target.value)}
                className="h-[110px] w-full resize-none rounded-md border border-[#cfd6de] bg-[#edf0f3] px-3 py-2 text-sm text-[#6b7280] outline-none"
              />

              <div className="mt-4">
                <label className={labelClass}>
                  Tanggal transaksi <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Tanggal jatuh tempo</label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Urgensi <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white pl-9 pr-9 text-sm text-[#4b5563] outline-none focus:border-[#4B61DD]"
                >
                  <option value="Rendah">Rendah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tinggi">Tinggi</option>
                </select>

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#e7b62d]">
                  ⌃
                </span>

                <CaretDown
                  size={14}
                  weight="bold"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697386]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 px-5 pb-5">
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

            <div>
              <label className={labelClass}>Tahun anggaran terkait</label>

              <input
                type="text"
                value={budgetYear}
                onChange={(e) => setBudgetYear(e.target.value)}
                className={inputClass}
              />
            </div>

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
          </div>

          <div className="mx-5 border-t border-dashed border-[#e2e6ea]" />

          <div className="px-5 py-5">
            <div className="pr-product-header grid grid-cols-[1.5fr_2fr_0.6fr_0.7fr] border-b border-[#d3d8e0] bg-[#EDFFFD]">
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
            </div>

            <div className="grid min-h-[58px] grid-cols-[1.5fr_2fr_0.6fr_0.7fr] border-b border-dashed border-[#e2e6ea]">
              <div className="px-2 py-2">
                <div className="relative">
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className={selectClass}
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
              <div className="flex h-10 items-center justify-between rounded-md border border-[#cfd6de] bg-white px-3">
                <span className="text-sm font-medium text-[#56606e]">
                  Total barang
                </span>

                <span className="text-sm font-medium text-[#56606e]">
                  0 Barang
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

            <div
              className={`flex h-10 w-[360px] max-w-full items-center rounded-md border ${
                isDark ? "border-[#996515]" : "border-[#7084d8]"
              } bg-white`}
            >
              <label
                className={`pr-file-label flex h-full cursor-pointer items-center border-r px-3 text-sm font-medium transition-colors ${
                  isDark
                    ? "border-[#996515] bg-[#333333] text-[#c9a15b] hover:text-[#dfbd7c]"
                    : "border-[#7084d8] bg-[#f5f7ff] text-[#7084d8] hover:text-[#536bc7]"
                }`}
              >
                <input type="file" className="hidden" />
                <span>Choose file</span>
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
              className={`pr-create-button h-9 rounded-md border px-4 text-sm font-medium transition-colors ${
                isDark
                  ? "border-[#c9a15b] bg-[#c9a15b] text-[#1e1e1e] hover:bg-[#dfbd7c]"
                  : "border-[#7084d8] bg-[#7084d8] text-white hover:bg-[#536bc7]"
              }`}
            >
              Buat permintaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
