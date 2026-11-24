import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CaretDown,
  Gear,
  Paperclip,
  Minus,
  Plus,
  SlidersHorizontal,
} from "@phosphor-icons/react";

const payFromOptions = [
  {
    value: "1-10001",
    label: "(1-10001) - Kas (Cash & Bank)",
  },
  {
    value: "1-10002",
    label: "(1-10002) - Rekening Bank (Cash & Bank)",
  },
];

const expenseAccounts = [
  "Beban Administrasi",
  "Beban Transportasi",
  "Beban Perlengkapan",
];

function formatRupiah(value) {
  return `Rp. ${Number(value || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function parseAmount(value) {
  const amount = Number(String(value || "").replace(/[^\d]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export default function CreateBiayaPage() {
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

  const [payFrom, setPayFrom] = useState("1-10001");
  const [payLater, setPayLater] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-10-01");
  const [paymentMethod, setPaymentMethod] = useState("Cek & Giro");
  const [expenseNumber, setExpenseNumber] = useState("[Auto]");
  const [tag, setTag] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [memo, setMemo] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discount, setDiscount] = useState("");
  const [notice, setNotice] = useState("");

  const [rows, setRows] = useState([
    { id: 1, account: "", description: "", tax: "", amount: "" },
    { id: 2, account: "", description: "", tax: "", amount: "" },
  ]);

  const subtotal = rows.reduce((sum, row) => sum + parseAmount(row.amount), 0);
  const total = Math.max(subtotal - parseAmount(discount), 0);

  const updateRow = (id, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    );
  };

  const addRow = () => {
    const nextId = Math.max(0, ...rows.map((row) => row.id)) + 1;

    setRows((currentRows) => [
      ...currentRows,
      {
        id: nextId,
        account: "",
        description: "",
        tax: "",
        amount: "",
      },
    ]);
  };

  const removeRow = (id) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
  };

  const handleSave = (event) => {
    event.preventDefault();

    setNotice(
      "Formulir sudah siap. Penyimpanan transaksi ke database belum dihubungkan.",
    );
  };

  const inputClass =
    "h-9 w-full rounded-md border border-[#cfd6de] bg-white px-3 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]";

  const selectClass =
    "h-9 w-full appearance-none rounded-md border border-[#cfd6de] bg-white px-3 pr-9 text-sm text-[#30343b] outline-none focus:border-[#4B61DD]";

  const labelClass = "mb-2 block text-sm font-medium text-[#30343a]";

  const textareaClass =
    "w-full resize-none rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#30343b] outline-none placeholder:text-[#9aa2ab] focus:border-[#4B61DD]";

  return (
    <div
      className={
        isDark
          ? "dash-dark cb-root min-h-full"
          : "cb-root min-h-full bg-white text-[#30343b]"
      }
    >
      <style>{`
        .cb-root {
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .cb-root.dash-dark {
          background-color: #121212;
          color: #f1f5f9;
        }

        .dash-dark.cb-root h1,
        .dash-dark.cb-root label,
        .dash-dark.cb-root .text-\\[\\#252a31\\],
        .dash-dark.cb-root .text-\\[\\#292e34\\],
        .dash-dark.cb-root .text-\\[\\#30343b\\],
        .dash-dark.cb-root .text-\\[\\#30343a\\],
        .dash-dark.cb-root .text-\\[\\#384151\\],
        .dash-dark.cb-root .text-\\[\\#464c53\\],
        .dash-dark.cb-root .text-\\[\\#4f5866\\],
        .dash-dark.cb-root .text-\\[\\#56606e\\],
        .dash-dark.cb-root .text-\\[\\#606a74\\] {
          color: #e5e7eb !important;
        }

        .dash-dark.cb-root .bg-white {
          background-color: #1e1e1e !important;
        }

        .dash-dark.cb-root section.bg-\\[\\#dff5fc\\] {
          background-color: #252525 !important;
        }

        .dash-dark.cb-root .bg-\\[\\#EDFFFD\\] {
          background-color: #252525 !important;
        }

        .dash-dark.cb-root .min-w-\\[850px\\] > div {
          background-color: #252525 !important;
          color: #ffffff !important;
          border-color: #414141 !important;
        }

        .dash-dark.cb-root .min-w-\\[850px\\] > div > div {
          color: #ffffff !important;
        }

        .dash-dark.cb-root .min-w-\\[850px\\] input,
        .dash-dark.cb-root .min-w-\\[850px\\] select {
          background-color: #303030 !important;
          color: #ffffff !important;
          border-color: #484848 !important;
        }

        .dash-dark.cb-root .min-w-\\[850px\\] input::placeholder {
          color: #a1a1aa !important;
        }

        .dash-dark.cb-root input:not([type="checkbox"]):not([type="file"]),
        .dash-dark.cb-root select,
        .dash-dark.cb-root textarea {
          background-color: #292929 !important;
          color: #f1f5f9 !important;
          border-color: #444 !important;
          color-scheme: dark;
        }

        .dash-dark.cb-root input::placeholder,
        .dash-dark.cb-root textarea::placeholder {
          color: #9299a3 !important;
        }

        .dash-dark.cb-root select option {
          background-color: #292929;
          color: #f1f5f9;
        }

        .dash-dark.cb-root input[type="checkbox"] {
          background-color: #292929;
          border-color: #666;
        }

        .dash-dark.cb-root .border,
        .dash-dark.cb-root .border-t,
        .dash-dark.cb-root .border-b,
        .dash-dark.cb-root .border-y,
        .dash-dark.cb-root .border-l {
          border-color: #414141 !important;
        }

        .dash-dark.cb-root .border-dashed {
          border-color: #414141 !important;
        }

        .dash-dark.cb-root .text-\\[\\#7b8691\\],
        .dash-dark.cb-root .text-\\[\\#7b848d\\],
        .dash-dark.cb-root .text-\\[\\#7e8994\\],
        .dash-dark.cb-root .text-\\[\\#89939e\\],
        .dash-dark.cb-root .text-\\[\\#626a73\\] {
          color: #a1a1aa !important;
        }

        .dash-dark.cb-root button.border {
          background-color: #292929 !important;
          color: #e5e7eb !important;
        }

        .dash-dark.cb-root button.border:hover {
          background-color: #383838 !important;
        }

        .dash-dark.cb-root .hover\\:bg-\\[\\#f4f6f8\\]:hover,
        .dash-dark.cb-root .hover\\:bg-\\[\\#f8fafc\\]:hover {
          background-color: #383838 !important;
        }

        .dash-dark.cb-root .hover\\:bg-red-50:hover {
          background-color: #452626 !important;
        }

        .dash-dark.cb-root .text-\\[\\#5875c9\\] {
          color: #91a7ff !important;
        }

        .dash-dark.cb-root .text-\\[\\#3786ad\\] {
          color: #67c5ed !important;
        }

        .dash-dark.cb-root .bg-amber-50 {
          background-color: #422f12 !important;
        }

        .dash-dark.cb-root .border-amber-200 {
          border-color: #85651f !important;
        }

        .dash-dark.cb-root .text-amber-800 {
          color: #fcd34d !important;
        }

        .dash-dark.cb-root .text-white {
          color: #fff !important;
        }

        .dash-dark.cb-root .bg-\\[\\#178ccc\\] {
          background-color: #1479a8 !important;
        }

        .dash-dark.cb-root .hover\\:bg-\\[\\#1681bf\\]:hover {
          background-color: #126a94 !important;
        }

        .dash-dark.cb-root [style*="box-shadow"] {
          box-shadow: 0 1px 3px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.25) !important;
        }

        .cb-root .cb-breadcrumb,
        .cb-root .cb-action {
          color: #5875c9;
        }

        .cb-root .cb-action:hover {
          color: #3f57b8;
        }

        .cb-root .cb-create {
          background-color: #178ccc;
        }

        .cb-root .cb-create:hover {
          background-color: #1681bf;
        }

        .dash-dark.cb-root .cb-breadcrumb,
        .dash-dark.cb-root .cb-action {
          color: #c9a45c !important;
        }

        .dash-dark.cb-root .cb-action:hover {
          color: #e2bd75 !important;
        }

        .dash-dark.cb-root .cb-create {
          background-color: #9b783b !important;
          color: #ffffff !important;
        }

        .dash-dark.cb-root .cb-create:hover {
          background-color: #80622f !important;
        }
      `}</style>

      <div className="w-full px-4 pb-8 pt-6 text-sm md:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="cb-breadcrumb mb-1.5 text-sm font-semibold text-[#5875c9]">
              Biaya
            </div>

            <h1 className="mt-2 text-2xl font-semibold leading-tight text-[#252a31]">
              Buat Biaya
            </h1>
          </div>

          <button
            type="button"
            className="flex h-9 w-fit items-center gap-2 rounded-md border border-[#cfd6de] bg-white px-3 text-sm font-medium text-[#606a74] transition-colors hover:bg-[#f4f6f8]"
          >
            <SlidersHorizontal size={15} />
            Lihat panduan
          </button>
        </div>

        <div
          className="mt-5 overflow-hidden rounded-xl border border-[#d4dbe2] bg-white"
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <form onSubmit={handleSave}>
            <section className="border-b border-dashed border-[#e2e6ea] bg-[#dff5fc] px-5 py-5">
              <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(180px,auto)]">
                <div>
                  <label className={labelClass}>Bayar Dari</label>

                  <div className="relative">
                    <select
                      value={payFrom}
                      onChange={(event) => setPayFrom(event.target.value)}
                      className={selectClass}
                    >
                      {payFromOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <CaretDown
                      size={13}
                      weight="bold"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm text-[#464c53]">
                  <input
                    type="checkbox"
                    checked={payLater}
                    onChange={(event) => setPayLater(event.target.checked)}
                    className="h-4 w-4 rounded border-[#cfd6de] accent-blue-600"
                  />
                  Bayar Nanti
                </label>

                <div className="text-left md:text-right">
                  <div className="text-xl font-semibold text-[#292e34]">
                    Total{" "}
                    <span className="text-[#3786ad]">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-5 py-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1fr_0.9fr]">
                <div>
                  <label className={labelClass}>Penerima</label>

                  <div className="relative">
                    <select
                      value={recipient}
                      onChange={(event) => setRecipient(event.target.value)}
                      className={selectClass}
                    >
                      <option value="">Pilih kontak</option>
                      <option value="PT Maju Jaya">PT Maju Jaya</option>
                      <option value="CV Sinar Abadi">CV Sinar Abadi</option>
                    </select>

                    <CaretDown
                      size={13}
                      weight="bold"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                    />
                  </div>

                  <div className="mt-5">
                    <label className={labelClass}>Alamat Penagihan</label>

                    <textarea
                      value={billingAddress}
                      onChange={(event) =>
                        setBillingAddress(event.target.value)
                      }
                      className={textareaClass}
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Tgl Transaksi</label>

                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(event) => setTransactionDate(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Cara Pembayaran</label>

                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className={selectClass}
                    >
                      <option value="Cek & Giro">Cek & Giro</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                    </select>

                    <CaretDown
                      size={13}
                      weight="bold"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                    />
                  </div>
                </div>

                <div>
                  <label className={`${labelClass} flex items-center gap-2`}>
                    No Biaya
                    <Gear size={15} className="text-[#7b848d]" />
                  </label>

                  <input
                    type="text"
                    value={expenseNumber}
                    onChange={(event) => setExpenseNumber(event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="xl:col-start-4">
                  <label className={labelClass}>Tag</label>

                  <input
                    type="text"
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#464c53]">
                  <input
                    type="checkbox"
                    checked={taxIncluded}
                    onChange={(event) => setTaxIncluded(event.target.checked)}
                    className="h-4 w-4 rounded border-[#cfd6de] accent-blue-600"
                  />
                  Harga termasuk pajak
                </label>
              </div>

              <div className="mt-5 overflow-x-auto">
                <div className="min-w-[850px]">
                  <div className="grid grid-cols-[minmax(175px,0.9fr)_minmax(220px,1.3fr)_minmax(160px,0.9fr)_minmax(180px,1fr)_40px] border-y border-[#d9dfe5] bg-[#EDFFFD]">
                    <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                      Akun Biaya
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                      Deskripsi
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                      Pajak
                    </div>

                    <div className="px-3 py-3 text-sm font-semibold text-[#4f5866]">
                      Jumlah
                    </div>

                    <div />
                  </div>

                  {rows.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[minmax(175px,0.9fr)_minmax(220px,1.3fr)_minmax(160px,0.9fr)_minmax(180px,1fr)_40px] items-center border-b border-dashed border-[#e2e5ea]"
                    >
                      <div className="px-2 py-2">
                        <div className="relative">
                          <select
                            value={row.account}
                            onChange={(event) =>
                              updateRow(row.id, "account", event.target.value)
                            }
                            className={selectClass}
                          >
                            <option value="">Pilih akun biaya</option>

                            {expenseAccounts.map((account) => (
                              <option key={account} value={account}>
                                {account}
                              </option>
                            ))}
                          </select>

                          <CaretDown
                            size={13}
                            weight="bold"
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                          />
                        </div>
                      </div>

                      <div className="px-2 py-2">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(event) =>
                            updateRow(row.id, "description", event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="px-2 py-2">
                        <div className="relative">
                          <select
                            value={row.tax}
                            onChange={(event) =>
                              updateRow(row.id, "tax", event.target.value)
                            }
                            className={selectClass}
                          >
                            <option value="">Pilih pajak</option>
                            <option value="PPN 11%">PPN 11%</option>
                          </select>

                          <CaretDown
                            size={13}
                            weight="bold"
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#626a73]"
                          />
                        </div>
                      </div>

                      <div className="px-2 py-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={row.amount}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              "amount",
                              event.target.value.replace(/[^\d]/g, ""),
                            )
                          }
                          placeholder="Rp. 0,00"
                          className={inputClass}
                        />
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          aria-label="Hapus baris biaya"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-[#3286ab] transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Minus size={15} weight="bold" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addRow}
                className="cb-action mt-3 flex items-center gap-1.5 text-sm font-medium"
              >
                <Plus size={14} weight="bold" />
                Tambah Data
              </button>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
                <div>
                  <label className={labelClass}>Memo</label>

                  <textarea
                    value={memo}
                    onChange={(event) => setMemo(event.target.value)}
                    className={textareaClass}
                    rows={3}
                  />

                  <div className="mt-5">
                    <label className={`${labelClass} flex items-center gap-2`}>
                      <Paperclip size={15} />
                      Lampiran
                    </label>

                    <label className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-[#cfd6de] bg-white px-3 py-2 text-sm text-[#7e8994] transition-colors hover:bg-[#f8fafc]">
                      {attachment
                        ? attachment.name
                        : "Tarik file ke sini, atau pilih file"}

                      <input
                        type="file"
                        className="hidden"
                        onChange={(event) =>
                          setAttachment(event.target.files?.[0] || null)
                        }
                      />
                    </label>

                    <p className="mt-2 text-xs text-[#89939e]">
                      Ukuran maksimal 10 MB per file.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="ml-auto w-full max-w-[460px]">
                    <div className="flex items-center justify-between border-b border-dashed border-[#dfe4e8] py-3 text-sm">
                      <span className="font-medium text-[#56606e]">
                        SubTotal
                      </span>

                      <span className="font-medium text-[#56606e]">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#dfe4e8] py-3 text-sm">
                      <span className="font-medium text-[#56606e]">Total</span>

                      <span className="font-medium text-[#56606e]">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-3">
                      <button
                        type="button"
                        onClick={() => setShowDiscount((value) => !value)}
                        className="cb-action justify-self-start text-sm font-medium"
                      >
                        Masukan Jumlah Pemotongan
                      </button>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-[#384151]">
                          Total
                        </div>

                        <div className="text-sm font-semibold text-[#384151]">
                          {formatRupiah(total)}
                        </div>
                      </div>
                    </div>

                    {showDiscount && (
                      <div className="mt-2">
                        <label className={labelClass}>Jumlah Pemotongan</label>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={discount}
                          onChange={(event) =>
                            setDiscount(
                              event.target.value.replace(/[^\d]/g, ""),
                            )
                          }
                          placeholder="Rp. 0,00"
                          className={inputClass}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {notice && (
                <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {notice}
                </p>
              )}
            </section>

            <footer className="flex flex-col-reverse items-stretch justify-end gap-2 border-t border-[#e1e5e9] px-5 py-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/biaya")}
                className="h-9 rounded-md border border-[#cfd6de] bg-white px-5 text-sm font-medium text-[#606a74] transition-colors hover:bg-[#f4f6f8]"
              >
                Batal
              </button>

              <div className="flex">
                <button
                  type="submit"
                  className="cb-create h-9 rounded-l-md px-5 text-sm font-medium text-white transition-colors"
                >
                  Buat Biaya Baru
                </button>

                <button
                  type="button"
                  aria-label="Pilihan buat biaya"
                  onClick={() =>
                    setNotice(
                      "Penyimpanan transaksi belum dihubungkan ke backend.",
                    )
                  }
                  className="cb-create flex h-9 items-center rounded-r-md border-l border-white/30 px-3 text-white transition-colors"
                >
                  <CaretDown size={13} weight="bold" />
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}
