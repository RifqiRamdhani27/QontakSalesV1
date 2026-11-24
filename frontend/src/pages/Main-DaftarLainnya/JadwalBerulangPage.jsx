import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./daftarLainnya.shared.css";

export default function JadwalBerulangPage() {
  const navigate = useNavigate();

  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem("app_theme") || "light";
    } catch {
      return "light";
    }
  });

  const isDark = themeMode === "dark";

  useEffect(() => {
    const syncTheme = (event) => {
      let nextTheme = event?.detail;

      if (typeof nextTheme !== "string") {
        try {
          nextTheme = localStorage.getItem("app_theme") || "light";
        } catch {
          nextTheme = "light";
        }
      }

      setThemeMode(nextTheme);
    };

    window.addEventListener("themeChanged", syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      window.removeEventListener("themeChanged", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState("Semua");
  const [appliedType, setAppliedType] = useState("Semua");
  const [showEnded, setShowEnded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [setupTransactionType, setSetupTransactionType] =
    useState("Sales Invoice");

  const [schedules, setSchedules] = useState([]);

  const [form, setForm] = useState({
    name: "",
    interval: "Bulanan",
    nextDate: "",
    endDate: "",
  });

  const filteredSchedules = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return schedules.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType = appliedType === "Semua" || item.type === appliedType;

      const hasEnded =
        item.endDate && new Date(`${item.endDate}T00:00:00`) < today;

      const matchesEnded = showEnded || !hasEnded;

      return matchesSearch && matchesType && matchesEnded;
    });
  }, [schedules, search, appliedType, showEnded]);

  const openForm = () => {
    setIsProcessing(false);
    setFormStep(1);
    setSetupTransactionType("Sales Invoice");

    setForm({
      name: "",
      interval: "Bulanan",
      nextDate: "",
      endDate: "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormStep(1);
    setIsProcessing(false);
  };

  const handleNext = () => {
    if (setupTransactionType === "Purchase Invoice") {
      closeForm();
      navigate("/pembelian/faktur/create");
      return;
    }

    if (setupTransactionType === "Sales Invoice") {
      closeForm();
      navigate("/penjualan/invoice/create");
      return;
    }

    setFormStep(2);
  };

  const saveSchedule = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.nextDate) {
      return;
    }

    setSchedules((current) => [
      ...current,
      {
        id: Date.now(),
        name: form.name.trim(),
        type: setupTransactionType,
        interval: form.interval,
        nextDate: form.nextDate,
        endDate: form.endDate,
      },
    ]);

    setShowForm(false);
    setFormStep(1);
    setIsProcessing(false);
  };

  return (
    <div
      className={`recurring-page dlsk-page ${
        isDark ? "recurring-dark dlsk-dark" : ""
      }`}
    >
      <style>{`
        .recurring-page {
          width: 100%;
          min-height: calc(100vh - 163px);
          background: #edf0f1;
          color: #222;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
        }

        .recurring-heading {
          min-height: 68px;
          padding: 12px 29px 15px 19px;
          background: #fff;
          border-bottom: 1px solid #e2e5e8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .recurring-breadcrumb {
          color: #555;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .recurring-title {
          margin: 0;
          color: #07519c;
          font-size: 16px;
          line-height: 19px;
          font-weight: 700;
        }

        .recurring-primary {
          border: 1px solid #16648a;
          border-radius: 1px;
          background: #176789;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          height: 28px;
          padding: 0 11px;
          white-space: nowrap;
          cursor: pointer;
        }

        .recurring-primary:hover {
          background: #125673;
        }

        .recurring-toolbar {
          min-height: 74px;
          padding: 11px 11px 8px 14px;
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .recurring-filter-area {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
        }

        .recurring-filter-row {
          display: flex;
          align-items: center;
          gap: 7px;
          min-height: 25px;
        }

        .recurring-filter-label {
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .recurring-select {
          height: 25px;
          min-width: 152px;
          padding: 0 8px;
          border: 1px solid #cbd2d7;
          border-radius: 1px;
          background-color: #fff;
          color: #333;
          font-size: 10px;
          outline: none;
        }

        .recurring-apply {
          height: 25px;
          padding: 0 12px;
          border: 1px solid #176789;
          border-radius: 1px;
          color: #fff;
          background: #176789;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .recurring-apply:hover {
          background: #125673;
        }

        .recurring-checkbox {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 9px;
          line-height: 12px;
          cursor: pointer;
          white-space: nowrap;
        }

        .recurring-checkbox input {
          width: 10px;
          height: 10px;
          margin: 0;
          cursor: pointer;
        }

        .recurring-search {
          display: flex;
          align-items: center;
          height: 24px;
          margin-top: 1px;
        }

        .recurring-search input {
          width: 136px;
          height: 24px;
          border: 1px solid #cbd2d7;
          border-right: 0;
          border-radius: 1px 0 0 1px;
          padding: 0 9px;
          font-size: 10px;
          outline: none;
        }

        .recurring-search input:focus {
          border-color: #8bbbd1;
        }

        .recurring-search button {
          width: 28px;
          height: 24px;
          border: 1px solid #cbd2d7;
          border-radius: 0 1px 1px 0;
          background: #f3f4f5;
          color: #333;
          font-size: 13px;
          cursor: pointer;
        }

        .recurring-table-wrap {
          min-height: 390px;
          padding: 0 10px;
          background: #edf0f1;
        }

        .recurring-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          background: #edf0f1;
        }

        .recurring-table thead {
          background: #dff5fc;
        }

        .recurring-table th {
          height: 27px;
          padding: 0 10px;
          border-top: 1px solid #b8e5f4;
          color: #222;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .recurring-table th:nth-child(1) {
          width: 18.5%;
        }

        .recurring-table th:nth-child(2) {
          width: 18.5%;
        }

        .recurring-table th:nth-child(3) {
          width: 9%;
        }

        .recurring-table th:nth-child(4) {
          width: 18.5%;
          color: #0873b9;
        }

        .recurring-table th:nth-child(5) {
          width: 35.5%;
        }

        .recurring-table td {
          height: 37px;
          padding: 7px 10px;
          border-bottom: 1px solid #e0e5e8;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .recurring-table tbody tr {
          background: #fff;
        }

        .recurring-empty-row td {
          height: 39px;
          border: 0;
          background: #dff5fc;
        }

        .recurring-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 18px 16px 24px;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.53);
        }

        .recurring-modal {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border: 1px solid #d7dce0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }

        .recurring-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 13px 17px 8px;
          margin: 0 8px;
          border-bottom: 1px solid #d9d9d9;
        }

        .recurring-modal-breadcrumb {
          margin-bottom: 3px;
          color: #555;
          font-size: 10px;
        }

        .recurring-modal-header h2 {
          margin: 0;
          color: #333;
          font-size: 14px;
          font-weight: 600;
        }

        .recurring-close {
          border: 0;
          background: transparent;
          color: #777;
          font-size: 15px;
          cursor: pointer;
        }

        .recurring-step-one {
          padding: 9px 20px 11px;
        }

        .recurring-step-row {
          display: grid;
          grid-template-columns: 155px 1fr;
          align-items: center;
          gap: 12px;
        }

        .recurring-step-row label {
          color: #333;
          font-size: 10px;
          font-weight: 600;
        }

        .recurring-step-row select {
          width: 100%;
          height: 24px;
          padding: 0 8px;
          border: 1px solid #cbd2d7;
          border-radius: 1px;
          background: #fff;
          color: #444;
          font-size: 11px;
        }

        .recurring-step-actions {
          display: flex;
          justify-content: center;
          padding-top: 34px;
        }

        .recurring-next {
          min-width: 41px;
          height: 28px;
          padding: 0 12px;
          border: 0;
          border-radius: 1px;
          background: #4caf50;
          color: #fff;
          font-size: 11px;
          cursor: pointer;
        }

        .recurring-next:hover {
          background: #429a46;
        }

        .recurring-form {
          display: flex;
          flex-direction: column;
          gap: 13px;
          padding: 18px;
        }

        .recurring-form label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .recurring-form input,
        .recurring-form select {
          width: 100%;
          height: 34px;
          padding: 0 9px;
          border: 1px solid #cbd2d7;
          border-radius: 2px;
          color: #333;
          background: #fff;
          font-size: 11px;
          font-weight: 400;
          box-sizing: border-box;
        }

        .recurring-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 5px;
        }

        .recurring-secondary {
          height: 30px;
          border: 1px solid #cbd2d7;
          border-radius: 2px;
          background: #fff;
          padding: 0 13px;
          cursor: pointer;
          font-size: 11px;
        }

        .recurring-dark {
          background: #121212;
          color: #e4e4e7;
        }

        .recurring-dark .recurring-heading,
        .recurring-dark .recurring-toolbar {
          background: #1e1e1e;
          border-color: #3f3f46;
        }

        .recurring-dark .recurring-breadcrumb,
        .recurring-dark .recurring-modal-breadcrumb {
          color: #a1a1aa;
        }

        .recurring-dark .recurring-title {
          color: #d6b16e;
        }

        .recurring-dark .recurring-primary,
        .recurring-dark .recurring-apply {
          border-color: #a98243;
          background: #a98243;
          color: #fff;
        }

        .recurring-dark .recurring-primary:hover,
        .recurring-dark .recurring-apply:hover {
          background: #8f6d36;
        }

        .recurring-dark .recurring-select,
        .recurring-dark .recurring-search input,
        .recurring-dark .recurring-search button,
        .recurring-dark .recurring-step-row select,
        .recurring-dark .recurring-form input,
        .recurring-dark .recurring-form select,
        .recurring-dark .recurring-secondary {
          background: #292929;
          border-color: #52525b;
          color: #e4e4e7;
        }

        .recurring-dark .recurring-search input::placeholder,
        .recurring-dark .recurring-form input::placeholder {
          color: #a1a1aa;
        }

        .recurring-dark .recurring-search input:focus {
          border-color: #c9a15b;
        }

        .recurring-dark .recurring-checkbox {
          color: #d4d4d8;
        }

        .recurring-dark .recurring-checkbox input {
          accent-color: #c9a15b;
        }

        .recurring-dark .recurring-table-wrap,
        .recurring-dark .recurring-table {
          background: #121212;
        }

        .recurring-dark .recurring-table thead,
        .recurring-dark .recurring-empty-row td {
          background: #292929;
        }

        .recurring-dark .recurring-table th {
          background: #252525;
          border-top-color: #52525b;
          color: #e4e4e7;
        }

        .recurring-dark .recurring-table th:nth-child(4) {
          color: #d6b16e;
        }

        .recurring-dark .recurring-table tbody tr {
          background: #1e1e1e;
        }

        .recurring-dark .recurring-table td {
          color: #d4d4d8;
          border-bottom-color: #3f3f46;
        }

        .recurring-dark .recurring-empty-row td {
          border: 0;
        }

        .recurring-dark .recurring-modal {
          background: #1e1e1e;
          border-color: #3f3f46;
          color: #e4e4e7;
        }

        .recurring-dark .recurring-modal-header {
          border-bottom-color: #3f3f46;
        }

        .recurring-dark .recurring-modal-header h2,
        .recurring-dark .recurring-step-row label,
        .recurring-dark .recurring-form label {
          color: #e4e4e7;
        }

        .recurring-dark .recurring-close {
          color: #a1a1aa;
        }

        .recurring-dark .recurring-secondary:hover {
          background: #363636;
        }

        @media (max-width: 700px) {
          .recurring-heading {
            padding-right: 12px;
          }

          .recurring-toolbar {
            flex-wrap: wrap;
          }

          .recurring-search {
            margin-left: auto;
          }

          .recurring-table-wrap {
            overflow-x: auto;
          }

          .recurring-table {
            min-width: 760px;
          }

          .recurring-step-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>

      <header className="recurring-heading">
        <div>
          <div className="recurring-breadcrumb">Daftar lainnya</div>
          <h1 className="recurring-title">Daftar Jadwal Berulang</h1>
        </div>

        <button type="button" className="recurring-primary" onClick={openForm}>
          {isProcessing ? "Sedang Diproses..." : "+ Buat baru"}
        </button>
      </header>

      <section className="recurring-toolbar">
        <div className="recurring-filter-area">
          <div className="recurring-filter-row">
            <label className="recurring-filter-label" htmlFor="recurring-type">
              Jenis Transaksi
            </label>

            <select
              id="recurring-type"
              className="recurring-select"
              value={transactionType}
              onChange={(event) => setTransactionType(event.target.value)}
            >
              <option value="Semua">Semua</option>
              <option value="Sales Invoice">Sales Invoice</option>
              <option value="Purchase Invoice">Purchase Invoice</option>
              <option value="Sales Order">Sales Order</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Expense">Expense</option>
              <option value="Journal Entry">Journal Entry</option>
              <option value="Bank Deposit">Bank Deposit</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Bank Withdrawal">Bank Withdrawal</option>
              <option value="Receive Payment">Receive Payment</option>
              <option value="Purchase Payment">Purchase Payment</option>
            </select>

            <button
              type="button"
              className="recurring-apply"
              onClick={() => setAppliedType(transactionType)}
            >
              Terapkan
            </button>
          </div>

          <label className="recurring-checkbox">
            <input
              type="checkbox"
              checked={showEnded}
              onChange={(event) => setShowEnded(event.target.checked)}
            />
            <span>Tampilkan jadwal yang sudah berakhir</span>
          </label>
        </div>

        <div className="recurring-search">
          <input
            type="text"
            placeholder="Cari"
            aria-label="Cari jadwal"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button
            type="button"
            aria-label="Cari"
            onClick={() => setSearch(search.trim())}
          >
            ⌕
          </button>
        </div>
      </section>

      <section className="recurring-table-wrap">
        <table className="recurring-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis Transaksi</th>
              <th>Diulang Setiap</th>
              <th>Tanggal Transaksi Berikutnya</th>
              <th>Berakhir</th>
            </tr>
          </thead>

          <tbody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td>{item.interval}</td>
                  <td>{item.nextDate}</td>
                  <td>{item.endDate || "-"}</td>
                </tr>
              ))
            ) : (
              <tr className="recurring-empty-row">
                <td colSpan={5}></td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {showForm && (
        <div
          className="recurring-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            className="recurring-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recurring-form-title"
          >
            <div className="recurring-modal-header">
              <div>
                <div className="recurring-modal-breadcrumb">Daftar lainnya</div>
                <h2 id="recurring-form-title">Atur Berulang</h2>
              </div>

              <button
                type="button"
                className="recurring-close"
                onClick={closeForm}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            {formStep === 1 ? (
              <div className="recurring-step-one">
                <div className="recurring-step-row">
                  <label htmlFor="setup-transaction-type">
                    Jenis Transaksi
                  </label>

                  <select
                    id="setup-transaction-type"
                    value={setupTransactionType}
                    onChange={(event) =>
                      setSetupTransactionType(event.target.value)
                    }
                  >
                    <option value="Sales Invoice">Sales Invoice</option>
                    <option value="Purchase Invoice">Purchase Invoice</option>
                    <option value="Sales Order">Sales Order</option>
                    <option value="Purchase Order">Purchase Order</option>
                    <option value="Expense">Expense</option>
                    <option value="Journal Entry">Journal Entry</option>
                    <option value="Bank Deposit">Bank Deposit</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Bank Withdrawal">Bank Withdrawal</option>
                    <option value="Receive Payment">Receive Payment</option>
                    <option value="Purchase Payment">Purchase Payment</option>
                  </select>
                </div>

                <div className="recurring-step-actions">
                  <button
                    type="button"
                    className="recurring-next"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <form className="recurring-form" onSubmit={saveSchedule}>
                <label>
                  Nama
                  <input
                    type="text"
                    placeholder="Masukkan nama jadwal"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Diulang Setiap
                  <select
                    value={form.interval}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        interval: event.target.value,
                      })
                    }
                  >
                    <option value="Harian">Harian</option>
                    <option value="Mingguan">Mingguan</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Tahunan">Tahunan</option>
                  </select>
                </label>

                <label>
                  Tanggal Transaksi Berikutnya
                  <input
                    type="date"
                    value={form.nextDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        nextDate: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Berakhir
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        endDate: event.target.value,
                      })
                    }
                  />
                </label>

                <div className="recurring-form-actions">
                  <button
                    type="button"
                    className="recurring-secondary"
                    onClick={() => setFormStep(1)}
                  >
                    Kembali
                  </button>

                  <button type="submit" className="recurring-primary">
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
