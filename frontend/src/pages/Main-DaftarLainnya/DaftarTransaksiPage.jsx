import { useEffect, useState } from "react";
import "./daftarLainnya.shared.css";

const today = "2026-10-21";

const transactionTypes = [
  "Semua",
  "Faktur penjualan",
  "penerima pembayaran",
  "pemesanan penjualan",
  "Biaya",
  "Terima uang",
  "Transfer bank",
  "Kirim uang",
  "Jurnal umum",
  "Faktur Pembelian",
  "Pembayaran  Pemblian",
  "Pembayaran Pemesanan",
  "pengembalian",
  "penawaran pembelian",
  "Penawaran penjualan",
  "Transfer gundang",
  "Saldo awal",
  "Debit memo",
  "Biaya kedatangan",
];

const statuses = [
  "Semua",
  "Draft",
  "Belum Dibayar",
  "Dibayar Sebagian",
  "Lunas",
  "Jatuh Tempo",
  "Void",
];

export default function DaftarTransaksiPage() {
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

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [transactionType, setTransactionType] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [search, setSearch] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: today,
    endDate: today,
    transactionType: "Semua",
    status: "Semua",
  });

  const applyFilters = () => {
    setAppliedFilters({
      startDate,
      endDate,
      transactionType,
      status,
    });
    setShowAdvancedFilter(false);
  };

  const cancelFilters = () => {
    setStartDate(appliedFilters.startDate);
    setEndDate(appliedFilters.endDate);
    setTransactionType(appliedFilters.transactionType);
    setStatus(appliedFilters.status);
    setShowAdvancedFilter(false);
  };

  const formatDate = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className={`transaction-page dlsk-page ${
        isDark ? "transaction-dark dlsk-dark" : ""
      }`}
    >
      <style>{`
        .transaction-page {
          min-height: calc(100vh - 90px);
          margin: -24px;
          background: #edf0f1;
          color: #222;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          position: relative;
        }

        .transaction-heading {
          height: 67px;
          padding: 12px 20px;
          box-sizing: border-box;
          background: #fff;
          border-bottom: 1px solid #e0e4e7;
        }

        .transaction-breadcrumb {
          margin-bottom: 2px;
          color: #555;
          font-size: 11px;
        }

        .transaction-title {
          margin: 0;
          color: #07519c;
          font-size: 16px;
          font-weight: 700;
          line-height: 20px;
        }

        .transaction-content {
          padding: 12px 10px 0;
          background: #edf0f1;
        }

        .transaction-toolbar {
          min-height: 69px;
          padding: 18px 20px 15px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          background: #fff;
          border-bottom: 1px solid #e0e5e8;
        }

        .transaction-date-field {
          width: 108px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .transaction-date-field label,
        .transaction-type-field label {
          color: #555;
          font-size: 9px;
          font-weight: 700;
        }

        .transaction-date-input {
          width: 100%;
          height: 25px;
          padding: 0;
          box-sizing: border-box;
          border: 0;
          border-bottom: 1px solid #d4d9dd;
          background: #fff;
          color: #222;
          font-size: 10px;
          font-weight: 600;
          outline: none;
        }

        .transaction-type-field {
          width: 104px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .transaction-select {
          width: 100%;
          height: 25px;
          padding: 0 7px;
          border: 0;
          border-bottom: 1px solid #d4d9dd;
          background: #fff;
          color: #222;
          font-size: 10px;
          font-weight: 600;
          outline: none;
        }

        .transaction-filter-button {
          height: 26px;
          min-width: 70px;
          padding: 0 12px;
          border: 1px solid #176789;
          border-radius: 1px;
          background: #176789;
          color: #fff;
          font-size: 10px;
          cursor: pointer;
        }

        .transaction-filter-button:hover {
          background: #125673;
        }

        .transaction-advanced-button {
          height: 26px;
          padding: 0 9px;
          border: 1px solid #2785b9;
          border-radius: 1px;
          background: #fff;
          color: #0873b9;
          font-size: 10px;
          cursor: pointer;
          white-space: nowrap;
        }

        .transaction-advanced-button:hover {
          background: #edf8ff;
        }

        .transaction-search {
          display: flex;
          height: 25px;
          margin-left: auto;
        }

        .transaction-search input {
          width: 135px;
          height: 25px;
          padding: 0 9px;
          box-sizing: border-box;
          border: 1px solid #cbd2d7;
          border-right: 0;
          background: #fff;
          font-size: 10px;
          outline: none;
        }

        .transaction-search input::placeholder {
          color: #a0aab2;
        }

        .transaction-search button {
          width: 28px;
          height: 25px;
          border: 1px solid #cbd2d7;
          background: #f2f3f4;
          color: #333;
          font-size: 13px;
          cursor: pointer;
        }

        .transaction-table-wrap {
          overflow-x: auto;
          background: #edf0f1;
        }

        .transaction-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
          table-layout: fixed;
          background: #fff;
        }

        .transaction-table thead {
          background: #dff5fc;
        }

        .transaction-table th {
          height: 27px;
          padding: 0 10px;
          border-top: 1px solid #b8e5f4;
          color: #0873b9;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .transaction-table th:nth-child(1) {
          width: 9%;
        }

        .transaction-table th:nth-child(2) {
          width: 8%;
        }

        .transaction-table th:nth-child(3) {
          width: 8%;
        }

        .transaction-table th:nth-child(4) {
          width: 8%;
        }

        .transaction-table th:nth-child(5) {
          width: 15%;
        }

        .transaction-table th:nth-child(6) {
          width: 17%;
        }

        .transaction-table th:nth-child(7) {
          width: 18%;
        }

        .transaction-table th:nth-child(8) {
          width: 10%;
        }

        .transaction-table th:nth-child(9) {
          width: 7%;
        }

        .transaction-empty-row td {
          height: 39px;
          padding: 0;
          border: 0;
          background: #dff5fc;
        }

        .transaction-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.56);
        }

        .transaction-drawer {
          position: absolute;
          top: 0;
          right: 0;
          width: 280px;
          max-width: 88vw;
          height: 100%;
          overflow-y: auto;
          box-sizing: border-box;
          background: #fff;
          box-shadow: -2px 0 7px rgba(0, 0, 0, 0.08);
        }

        .transaction-drawer-title {
          height: 42px;
          padding: 15px 11px 8px;
          box-sizing: border-box;
          color: #222;
          font-size: 12px;
          font-weight: 400;
        }

        .transaction-drawer-content {
          padding: 14px 11px 20px;
        }

        .transaction-drawer-dates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 21px;
        }

        .transaction-drawer-field {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 20px;
        }

        .transaction-drawer-field label {
          color: #777;
          font-size: 9px;
          font-weight: 700;
        }

        .transaction-drawer-input,
        .transaction-drawer-select {
          width: 100%;
          min-width: 0;
          height: 25px;
          padding: 0 2px;
          box-sizing: border-box;
          border: 0;
          border-bottom: 1px solid #cfd3d6;
          border-radius: 0;
          background: #fff;
          color: #222;
          font-size: 10px;
          font-weight: 600;
          outline: none;
        }

        .transaction-drawer-input:focus,
        .transaction-drawer-select:focus {
          border-bottom-color: #2987b8;
        }

        .transaction-drawer-actions {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 33px;
        }

        .transaction-cancel {
          width: 69px;
          height: 25px;
          border: 1px solid #aaa;
          border-radius: 1px;
          background: #fff;
          color: #777;
          font-size: 9px;
          cursor: pointer;
        }

        .transaction-apply {
          width: 68px;
          height: 25px;
          border: 1px solid #59b65d;
          border-radius: 1px;
          background: #59b65d;
          color: #fff;
          font-size: 10px;
          cursor: pointer;
        }

        .transaction-apply:hover {
          background: #47a74b;
        }

        .transaction-page.transaction-dark {
          background: #121212;
          color: #e4e4e7;
        }

        .transaction-dark .transaction-heading,
        .transaction-dark .transaction-toolbar,
        .transaction-dark .transaction-drawer {
          background: #1e1e1e;
          border-color: #3f3f46;
        }

        .transaction-dark .transaction-breadcrumb {
          color: #a1a1aa;
        }

        .transaction-dark .transaction-title {
          color: #d6b16e;
        }

        .transaction-dark .transaction-content,
        .transaction-dark .transaction-table-wrap {
          background: #121212;
        }

        .transaction-dark .transaction-toolbar {
          border-bottom-color: #3f3f46;
        }

        .transaction-dark .transaction-date-field label,
        .transaction-dark .transaction-type-field label,
        .transaction-dark .transaction-drawer-field label {
          color: #b5b5bd;
        }

        .transaction-dark .transaction-date-input,
        .transaction-dark .transaction-select,
        .transaction-dark .transaction-drawer-input,
        .transaction-dark .transaction-drawer-select {
          background: #292929;
          border-bottom-color: #52525b;
          color: #f4f4f5;
          color-scheme: dark;
        }

        .transaction-dark .transaction-date-input:focus,
        .transaction-dark .transaction-select:focus,
        .transaction-dark .transaction-drawer-input:focus,
        .transaction-dark .transaction-drawer-select:focus {
          border-bottom-color: #c9a15b;
        }

        .transaction-dark .transaction-filter-button {
          border-color: #a98243;
          background: #a98243;
          color: #fff;
        }

        .transaction-dark .transaction-filter-button:hover {
          background: #8f6d36;
        }

        .transaction-dark .transaction-advanced-button {
          border-color: #a98243;
          background: #292929;
          color: #d6b16e;
        }

        .transaction-dark .transaction-advanced-button:hover {
          background: #383126;
        }

        .transaction-dark .transaction-search input {
          border-color: #52525b;
          background: #292929;
          color: #f4f4f5;
        }

        .transaction-dark .transaction-search input::placeholder {
          color: #a1a1aa;
        }

        .transaction-dark .transaction-search button {
          border-color: #52525b;
          background: #383838;
          color: #d6b16e;
        }

        .transaction-dark .transaction-table {
          background: #1e1e1e;
        }

        .transaction-dark .transaction-table thead,
        .transaction-dark .transaction-empty-row td {
          background: #29251e;
        }

        .transaction-dark .transaction-table th {
          border-top-color: #6b5737;
          color: #d6b16e;
        }

        .transaction-dark .transaction-empty-row td {
          border-color: #3f3f46;
        }

        .transaction-dark .transaction-drawer-title {
          color: #e4e4e7;
        }

        .transaction-dark .transaction-drawer-field label {
          color: #a1a1aa;
        }

        .transaction-dark .transaction-cancel {
          border-color: #52525b;
          background: #292929;
          color: #d4d4d8;
        }

        .transaction-dark .transaction-cancel:hover {
          background: #383838;
        }

        .transaction-dark .transaction-apply {
          border-color: #a98243;
          background: #a98243;
          color: #fff;
        }

        .transaction-dark .transaction-apply:hover {
          background: #8f6d36;
        }

        @media (max-width: 900px) {
          .transaction-toolbar {
            gap: 12px;
          }

          .transaction-search {
            margin-left: 0;
          }
        }

        @media (max-width: 600px) {
          .transaction-heading {
            padding-left: 14px;
          }

          .transaction-content {
            padding-right: 5px;
            padding-left: 5px;
          }

          .transaction-toolbar {
            padding: 12px;
          }

          .transaction-date-field {
            width: calc(50% - 8px);
          }

          .transaction-type-field {
            width: calc(50% - 8px);
          }

          .transaction-search {
            margin-left: auto;
          }
        }
      `}</style>

      <header className="transaction-heading">
        <div className="transaction-breadcrumb">Daftar Lainnya</div>
        <h1 className="transaction-title">Daftar Transaksi</h1>
      </header>

      <main className="transaction-content">
        <section className="transaction-toolbar">
          <div className="transaction-date-field">
            <label htmlFor="transaction-start-date">Tanggal Mulai</label>
            <input
              id="transaction-start-date"
              className="transaction-date-input"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="transaction-date-field">
            <label htmlFor="transaction-end-date">Tanggal Selesai</label>
            <input
              id="transaction-end-date"
              className="transaction-date-input"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>

          <div className="transaction-type-field">
            <label htmlFor="transaction-type">Tipe Transaksi</label>
            <select
              id="transaction-type"
              className="transaction-select"
              value={transactionType}
              onChange={(event) => setTransactionType(event.target.value)}
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="transaction-filter-button"
            onClick={applyFilters}
          >
            Filter
          </button>

          <button
            type="button"
            className="transaction-advanced-button"
            onClick={() => setShowAdvancedFilter(true)}
          >
            Filter lebih lanjut
          </button>

          <div className="transaction-search">
            <input
              type="text"
              placeholder="Pencarian"
              aria-label="Pencarian transaksi"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              type="button"
              aria-label="Cari transaksi"
              onClick={() => setSearch(search.trim())}
            >
              ⌕
            </button>
          </div>
        </section>

        <div className="transaction-table-wrap">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nomor</th>
                <th>Memo</th>
                <th>Kontak</th>
                <th>Tgl Jatuh Tempo</th>
                <th>Status</th>
                <th>Sisa Tagihan (dalam IDR)</th>
                <th>Total (dalam IDR)</th>
                <th>Tags</th>
              </tr>
            </thead>

            <tbody>
              <tr className="transaction-empty-row">
                <td colSpan={9}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {showAdvancedFilter && (
        <div
          className="transaction-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelFilters();
            }
          }}
        >
          <aside
            className="transaction-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-drawer-heading"
          >
            <div
              className="transaction-drawer-title"
              id="transaction-drawer-heading"
            >
              Transaction Filter
            </div>

            <div className="transaction-drawer-content">
              <div className="transaction-drawer-dates">
                <div className="transaction-drawer-field">
                  <label htmlFor="advanced-start-date">Tanggal Mulai</label>
                  <input
                    id="advanced-start-date"
                    className="transaction-drawer-input"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>

                <div className="transaction-drawer-field">
                  <label htmlFor="advanced-end-date">Tanggal Selesai</label>
                  <input
                    id="advanced-end-date"
                    className="transaction-drawer-input"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </div>
              </div>

              <div className="transaction-drawer-field">
                <label htmlFor="advanced-transaction-type">
                  Tipe Transaksi
                </label>
                <select
                  id="advanced-transaction-type"
                  className="transaction-drawer-select"
                  value={transactionType}
                  onChange={(event) => setTransactionType(event.target.value)}
                >
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="transaction-drawer-field">
                <label htmlFor="advanced-transaction-status">
                  Filter sesuai status
                </label>
                <select
                  id="advanced-transaction-status"
                  className="transaction-drawer-select"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="transaction-drawer-actions">
                <button
                  type="button"
                  className="transaction-cancel"
                  onClick={cancelFilters}
                >
                  Batalkan
                </button>

                <button
                  type="button"
                  className="transaction-apply"
                  onClick={applyFilters}
                >
                  Filter
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
