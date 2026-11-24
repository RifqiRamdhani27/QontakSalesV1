import { useState, useEffect } from "react";
import { CaretDown, Gear } from "@phosphor-icons/react";

export default function CreatePurchaseExchangePage() {
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
  const [paymentTerm, setPaymentTerm] = useState("Net 30");
  const [invoice, setInvoice] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

  return (
    <div className={isDark ? "dash-dark pe-root" : "pe-root"}>
      <style>{`
        .dash-dark.pe-root {
          min-height: 100%;
          background-color: #121212 !important;
          color: #ffffff !important;
        }

        .pe-root:not(.dash-dark) {
          color: #000000;
        }

        .dash-dark.pe-root h1,
        .dash-dark.pe-root label,
        .dash-dark.pe-root span,
        .dash-dark.pe-root .text-\\[252a31\\],
        .dash-dark.pe-root .text-\\[292e34\\],
        .dash-dark.pe-root .text-\\[30343a\\],
        .dash-dark.pe-root .text-\\[30343b\\],
        .dash-dark.pe-root .text-\\[56606e\\] {
          color: #ffffff !important;
        }

        .dash-dark.pe-root .rounded-xl.border {
          background-color: #1e1e1e !important;
          border-color: #383838 !important;
          box-shadow: none !important;
        }

        .dash-dark.pe-root input,
        .dash-dark.pe-root select,
        .dash-dark.pe-root textarea {
          background-color: #292929 !important;
          color: #ffffff !important;
          border-color: #484848 !important;
        }

        .dash-dark.pe-root input::placeholder,
        .dash-dark.pe-root textarea::placeholder {
          color: #9ca3af !important;
        }

        .dash-dark.pe-root select option {
          background-color: #292929;
          color: #ffffff;
        }

        .dash-dark.pe-root .bg-\\[\\#EDFFFD\\] {
          background-color: #1e1e1e !important;
        }

        .dash-dark.pe-root .bg-\\[\\#EDFFFD\\] > div {
          color: #ffffff !important;
        }

        .dash-dark.pe-root .bg-\\[\\#EDFFFD\\] .text-sm {
          color: #ffffff !important;
        }

        .dash-dark.pe-root .border-b,
        .dash-dark.pe-root .border-t,
        .dash-dark.pe-root .border-y,
        .dash-dark.pe-root .border-r {
          border-color: #383838 !important;
        }

        .dash-dark.pe-root .text-\\[737b88\\],
        .dash-dark.pe-root .text-\\[7b848d\\],
        .dash-dark.pe-root .text-\\[98a0a8\\],
        .dash-dark.pe-root .text-\\[9aa2ab\\],
        .dash-dark.pe-root .text-\\[747c85\\] {
          color: #a1a1aa !important;
        }

        .dash-dark.pe-root .bg-white {
          background-color: #292929 !important;
        }

        .dash-dark.pe-root .bg-\\[\\#fafbfc\\] {
          background-color: #333333 !important;
        }

        .dash-dark.pe-root .text-\\[626a73\\] {
          color: #a1a1aa !important;
        }

        .dash-dark.pe-root .text-\\[5875c9\\] {
          color: #ffdb8d !important;
        }

        .dash-dark.pe-root .text-red-500 {
          color: #f87171 !important;
        }

        .dash-dark.pe-root .pe-file-label,
        .dash-dark.pe-root .pe-file-label span {
          color: #c9a15b !important;
        }

        .dash-dark.pe-root .pe-file-label:hover,
        .dash-dark.pe-root .pe-file-label:hover span {
          color: #dfbd7c !important;
        }
      `}</style>

      <div className="min-h-full bg-white text-[#30343b]">
        <div className="w-full px-6 pb-8 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <div
                className={`mb-1.5 text-sm font-semibold transition-colors ${
                  isDark
                    ? "text-[#c9a15b] hover:text-[#dfbd7c]"
                    : "text-[#7084d8] hover:text-[#536bc7]"
                }`}
              >
                Pembelian
              </div>

              <h1 className="mt-2 text-2xl font-semibold leading-tight text-[#252a31]">
                Tukar Faktur Pembelian
              </h1>
            </div>

            <div className="relative w-44">
              <select
                defaultValue="Tukar Faktur Pembelian"
                className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white px-3 pr-8 text-sm text-[#30343b] outline-none"
              >
                <option value="Tukar Faktur Pembelian">
                  Tukar Faktur Pembelian
                </option>
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
                  <label className="mb-2 block text-sm font-medium text-[#30343a]">
                    Supplier <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <select
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white px-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
                    >
                      <option value="">Pilih supplier</option>
                      <option value="Supplier A">Supplier A</option>
                      <option value="Supplier B">Supplier B</option>
                    </select>

                    <CaretDown
                      size={13}
                      weight="bold"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                    />
                  </div>
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
                    className="h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
                  />
                </div>

                <div className="flex items-center justify-end pb-1">
                  <div className="text-xl font-semibold text-[#292e34]">
                    <div className="mb-1 text-sm font-normal text-[#737b88]">
                      Total tukar faktur
                    </div>
                    Rp0,00
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#30343a]">
                    Alamat penagihan
                  </label>

                  <textarea
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="h-[110px] w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
                  />
                </div>

                <div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#30343a]">
                      Tgl. transaksi
                    </label>

                    <input
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      className="h-9 w-full min-w-0 rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-[#30343a]">
                      Tgl. jatuh tempo{" "}
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-9 w-full min-w-0 rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
                    />
                  </div>
                </div>

                <div>
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#30343a]">
                      No Transaksi
                      <Gear size={14} className="text-[#7b848d]" />
                    </label>

                    <input
                      type="text"
                      value={transactionNumber}
                      onChange={(e) => setTransactionNumber(e.target.value)}
                      placeholder="Join invoice - [AUTO]"
                      className="h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-[#30343a]">
                      Syarat pembayaran
                    </label>

                    <div className="relative">
                      <select
                        value={paymentTerm}
                        onChange={(e) => setPaymentTerm(e.target.value)}
                        className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white px-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
                      >
                        <option value="Net 30">Net 30</option>
                        <option value="Net 15">Net 15</option>
                        <option value="Net 7">Net 7</option>
                        <option value="COD">COD</option>
                      </select>

                      <CaretDown
                        size={13}
                        weight="bold"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-[1.13fr_1.13fr_0.88fr_0.8fr_1fr_1fr] border-b border-[#d3d8e0] bg-[#EDFFFD]">
                    <div className="px-3 py-3 text-sm font-semibold text-[#30343a]">
                      Faktur pembelian
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#30343a]">
                      Deskripsi
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#30343a]">
                      Tgl. jatuh tempo
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#30343a]">
                      Status
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#30343a]">
                      Jumlah tagihan
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#30343a]">
                      Sisa tagihan
                    </div>
                  </div>

                  <div className="grid min-h-[56px] grid-cols-[1.13fr_1.13fr_0.88fr_0.8fr_1fr_1fr] border-b border-[#d9dfe5]">
                    <div className="px-2 py-2">
                      <div className="relative w-full max-w-[250px]">
                        <select
                          value={invoice}
                          onChange={(e) => setInvoice(e.target.value)}
                          className="h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white px-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]"
                        >
                          <option value="">Cari atau pilih faktur</option>
                          <option value="INV-001">INV-001</option>
                          <option value="INV-002">INV-002</option>
                        </select>

                        <CaretDown
                          size={13}
                          weight="bold"
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                        />
                      </div>
                    </div>

                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
                <div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#30343a]">
                      Pesan
                    </label>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Pesan"
                      className="h-[90px] w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
                    />
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <div className="flex h-12 w-full max-w-[380px] items-center justify-between rounded-md border border-[#cfd6de] bg-white px-4">
                    <span className="text-sm font-semibold text-[#56606e]">
                      Total sisa tagihan
                    </span>

                    <span className="text-sm font-semibold text-[#30343b]">
                      Rp0,00
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#30343a]">
                    Memo
                  </label>

                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Memo"
                    className="h-[90px] w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]"
                  />
                </div>

                <div />
              </div>

              <div className="mt-5 border-t border-[#e1e5e9] pt-5">
                <label className="mb-2 block text-sm font-medium text-[#30343a]">
                  Lampiran
                </label>

                <div
                  className={`flex h-10 w-full max-w-[380px] items-center overflow-hidden rounded-md border bg-white ${
                    isDark ? "border-[#996515]" : "border-[#7084d8]"
                  }`}
                >
                  <label
                    className={`pe-file-label flex h-full cursor-pointer items-center border-r px-3 text-sm font-medium transition-colors ${
                      isDark
                        ? "border-[#996515] bg-[#333333]"
                        : "border-[#7084d8] bg-[#f5f7ff] text-[#7084d8] hover:text-[#536bc7]"
                    }`}
                  >
                    <input type="file" className="hidden" />
                    <span>Choose file</span>
                  </label>

                  <span className="truncate px-3 text-sm text-[#98a0a8]">
                    atau tarik & lepas file di sini
                  </span>
                </div>

                <div className="mt-2 text-xs leading-5 text-[#747c85]">
                  File dapat berupa Excel, Word, PDF, JPG, PNG, atau ZIP
                  (maksimum 5 file dan 10 MB per file).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
