import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./daftarLainnya.shared.css";

const STORAGE_KEY = "qontaksales_product_categories";

function loadCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function EmptyProductCategories() {
  return (
    <div className="product-category-empty">
      <svg
        viewBox="0 0 230 170"
        className="product-category-folder"
        role="img"
        aria-label="Folder kategori produk kosong"
      >
        <defs>
          <linearGradient id="productFolderBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39b0fa" />
            <stop offset="100%" stopColor="#087ed1" />
          </linearGradient>

          <linearGradient id="productFolderFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#31a9f3" />
            <stop offset="100%" stopColor="#0874c4" />
          </linearGradient>

          <linearGradient id="productFolderPaper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e9edf2" />
          </linearGradient>

          <filter
            id="productFolderShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="150%"
          >
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodColor="#1f5c83"
              floodOpacity="0.2"
            />
          </filter>
        </defs>

        <ellipse
          cx="116"
          cy="145"
          rx="72"
          ry="7"
          fill="#b9cbd8"
          opacity="0.22"
        />

        <g filter="url(#productFolderShadow)">
          <path
            d="M42 31 Q42 26 48 26 L95 26 Q100 26 103 31 L111 39 L170 39 Q176 39 176 45 L176 115 Q176 120 170 120 L48 120 Q42 120 42 114 Z"
            fill="url(#productFolderBack)"
          />

          <path
            d="M52 44 Q52 39 59 39 L158 39 Q166 39 166 47 L166 106 L52 106 Z"
            fill="url(#productFolderPaper)"
          />

          <path
            d="M35 57 Q35 51 42 51 L92 51 Q97 51 101 56 L108 63 L178 63 Q185 63 184 70 L177 130 Q176 136 169 136 L43 136 Q37 136 36 130 Z"
            fill="url(#productFolderFront)"
          />

          <path
            d="M36 67 Q36 59 44 59 L91 59 Q96 59 101 64 L108 70 L176 70 Q182 70 183 76"
            fill="none"
            stroke="#72caff"
            strokeWidth="2"
            opacity="0.75"
          />
        </g>
      </svg>

      <div className="product-category-empty-title">
        Daftar kategori produk akan muncul di sini
      </div>

      <div className="product-category-empty-description">
        Tambah kategori produk melalui tombol Tambah kategori.
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M5.5 7l1 13h11l1-13M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KategoriProdukPage() {
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

  const [categories, setCategories] = useState(loadCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [pageSize, setPageSize] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch {
      setMessage("Kategori gagal disimpan di browser.");
    }
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categories, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / Number(pageSize)),
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleCategories = filteredCategories.slice(
    (safePage - 1) * Number(pageSize),
    safePage * Number(pageSize),
  );

  const visibleIds = visibleCategories.map((category) => category.id);

  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) =>
      selectedIds.some((selectedId) => String(selectedId) === String(id)),
    );

  const openForm = () => {
    setEditingId(null);
    setCategoryName("");
    setFormError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setFormError("");
    setMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setCategoryName("");
    setFormError("");
  };

  const saveCategory = (event) => {
    event.preventDefault();

    const name = categoryName.trim();

    if (name.length < 2) {
      setFormError("Nama kategori minimal 2 karakter.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        String(category.id) !== String(editingId),
    );

    if (duplicate) {
      setFormError("Kategori tersebut sudah ada.");
      return;
    }

    let successMessage = "";

    if (editingId !== null) {
      setCategories((previous) =>
        previous.map((category) =>
          String(category.id) === String(editingId)
            ? { ...category, name }
            : category,
        ),
      );

      successMessage = "Kategori produk berhasil diperbarui.";
    } else {
      const newCategory = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
      };

      setCategories((previous) => [...previous, newCategory]);
      successMessage = "Kategori produk berhasil disimpan.";
    }

    setSearch("");
    setCurrentPage(1);
    setSelectedIds([]);
    setShowForm(false);
    setEditingId(null);
    setCategoryName("");
    setFormError("");
    setMessage(successMessage);
  };

  const deleteCategory = (category) => {
    const confirmed = window.confirm(
      `Hapus kategori produk "${category.name}"?`,
    );

    if (!confirmed) return;

    setCategories((previous) =>
      previous.filter((item) => String(item.id) !== String(category.id)),
    );

    setSelectedIds((previous) =>
      previous.filter((id) => String(id) !== String(category.id)),
    );

    setMessage("Kategori produk berhasil dihapus.");
  };

  const toggleAll = (checked) => {
    if (checked) {
      setSelectedIds((previous) => [...new Set([...previous, ...visibleIds])]);
    } else {
      setSelectedIds((previous) =>
        previous.filter(
          (id) =>
            !visibleIds.some((visibleId) => String(visibleId) === String(id)),
        ),
      );
    }
  };

  const toggleCategory = (id, checked) => {
    setSelectedIds((previous) =>
      checked
        ? [...new Set([...previous, id])]
        : previous.filter((item) => String(item) !== String(id)),
    );
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Hapus ${selectedIds.length} kategori yang dipilih?`,
    );

    if (!confirmed) return;

    setCategories((previous) =>
      previous.filter(
        (category) =>
          !selectedIds.some(
            (selectedId) => String(selectedId) === String(category.id),
          ),
      ),
    );

    setSelectedIds([]);
    setCurrentPage(1);
    setMessage("Kategori terpilih berhasil dihapus.");
  };

  return (
    <div
      className={`product-category-page dlsk-page ${
        isDark ? "product-category-dark dlsk-dark" : ""
      }`}
    >
      <style>{`
        .product-category-page {
          width: 100%;
          min-height: calc(100vh - 143px);
          background: #fff;
          color: #252b35;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
          box-sizing: border-box;
        }

        .product-category-page *,
        .product-category-page *::before,
        .product-category-page *::after {
          box-sizing: border-box;
        }

        .product-category-header {
          min-height: 54px;
          padding: 9px 15px 10px 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid #e1e5e8;
          background: #fff;
        }

        .product-category-breadcrumb {
          margin-bottom: 3px;
          color: #64748b;
          font-size: 9px;
          line-height: 12px;
        }

        .product-category-breadcrumb button {
          padding: 0;
          border: 0;
          background: transparent;
          color: #64748b;
          font: inherit;
          cursor: pointer;
        }

        .product-category-breadcrumb button:hover {
          text-decoration: underline;
        }

        .product-category-title {
          margin: 0;
          color: #202938;
          font-size: 14px;
          line-height: 18px;
          font-weight: 700;
        }

        .product-category-add-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 84px;
          height: 23px;
          padding: 0 11px;
          border: 1px solid #5263df;
          border-radius: 2px;
          background: #5263e9;
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
        }

        .product-category-add-button:hover {
          background: #4052d4;
        }

        .product-category-content {
          min-height: calc(100vh - 197px);
          padding: 0 13px;
          background: #fff;
        }

        .product-category-empty {
          min-height: calc(100vh - 198px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px 52px;
          text-align: center;
        }

        .product-category-folder {
          display: block;
          width: 230px;
          height: 170px;
          margin: 0 0 3px;
          flex-shrink: 0;
        }

        .product-category-empty-title {
          margin-top: 0;
          color: #222b35;
          font-size: 10px;
          line-height: 15px;
          font-weight: 700;
        }

        .product-category-empty-description {
          margin-top: 2px;
          color: #64748b;
          font-size: 9px;
          line-height: 14px;
        }

        .product-category-search-row {
          display: flex;
          justify-content: flex-end;
          padding: 12px 0 14px;
        }

        .product-category-search {
          width: 144px;
          height: 23px;
          padding: 0 8px;
          border: 1px solid #d9dde2;
          border-radius: 2px;
          color: #334155;
          font-size: 9px;
          outline: none;
        }

        .product-category-search:focus {
          border-color: #8abce8;
        }

        .product-category-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .product-category-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          background: #fff;
        }

        .product-category-table thead {
          background: #f7f8fa;
        }

        .product-category-table th {
          height: 33px;
          padding: 0 9px;
          border-bottom: 2px solid #d2dbe3;
          color: #303944;
          text-align: left;
          font-size: 9px;
          font-weight: 500;
        }

        .product-category-table th:first-child,
        .product-category-table td:first-child {
          width: 25px;
          padding-left: 6px;
          padding-right: 3px;
          text-align: center;
        }

        .product-category-table th:last-child,
        .product-category-table td:last-child {
          width: 60px;
          padding-right: 12px;
          text-align: right;
        }

        .product-category-table td {
          height: 28px;
          padding: 4px 9px;
          border-bottom: 1px solid #d5dce3;
          color: #344054;
          font-size: 9px;
          overflow-wrap: anywhere;
        }

        .product-category-table tbody tr:hover {
          background: #fbfcfe;
        }

        .product-category-checkbox {
          width: 11px;
          height: 11px;
          margin: 0;
          vertical-align: middle;
          accent-color: #5263e9;
          cursor: pointer;
        }

        .product-category-row-actions {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 11px;
        }

        .product-category-row-action {
          width: 16px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          background: transparent;
          color: #85909d;
          cursor: pointer;
        }

        .product-category-row-action:hover {
          color: #1769aa;
        }

        .product-category-row-action.delete:hover {
          color: #d92d20;
        }

        .product-category-no-results {
          padding: 48px 12px;
          color: #8a96a3;
          text-align: center;
          font-size: 10px;
        }

        .product-category-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          padding: 9px 5px;
          color: #64748b;
          font-size: 9px;
        }

        .product-category-footer-left,
        .product-category-pagination {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .product-category-page-size,
        .product-category-page-input {
          height: 21px;
          border: 1px solid #d9dde2;
          border-radius: 2px;
          background: #fff;
          color: #334155;
          font-size: 9px;
        }

        .product-category-page-size {
          padding: 0 5px;
        }

        .product-category-page-input {
          width: 35px;
          padding: 0 5px;
          text-align: center;
        }

        .product-category-page-button {
          border: 0;
          background: transparent;
          color: #52718d;
          cursor: pointer;
          padding: 2px;
          font-size: 12px;
        }

        .product-category-page-button:disabled {
          color: #c2cbd4;
          cursor: default;
        }

        .product-category-toast {
          position: fixed;
          top: 109px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1200;
          display: flex;
          align-items: center;
          gap: 6px;
          min-height: 31px;
          padding: 0 11px;
          border: 1px solid #269b52;
          border-radius: 2px;
          background: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
          color: #334155;
          font-size: 9px;
          white-space: nowrap;
        }

        .product-category-toast-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 13px;
          height: 13px;
          border: 1px solid #46a766;
          border-radius: 50%;
          color: #269b52;
          font-size: 8px;
          font-weight: 700;
        }

        .product-category-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 121px 16px 24px;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.72);
        }

        .product-category-modal {
          width: 100%;
          max-width: 267px;
          border: 1px solid #d6dce2;
          border-radius: 2px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .product-category-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 31px;
          padding: 0 9px;
          border-bottom: 1px solid #e5e7eb;
        }

        .product-category-modal-header h2 {
          margin: 0;
          color: #252b35;
          font-size: 9px;
          font-weight: 600;
        }

        .product-category-modal-close {
          width: 18px;
          height: 24px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
        }

        .product-category-form {
          padding: 9px;
        }

        .product-category-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .product-category-form label {
          display: block;
          margin-bottom: 0;
          color: #344054;
          font-size: 9px;
          font-weight: 600;
        }

        .product-category-form input {
          width: 100%;
          height: 24px;
          padding: 0 7px;
          border: 1px solid #5263e9;
          border-radius: 2px;
          outline: none;
          color: #344054;
          font-family: inherit;
          font-size: 10px;
        }

        .product-category-form input:focus {
          border-color: #4052d4;
        }

        .product-category-character-count {
          color: #64748b;
          font-size: 8px;
        }

        .product-category-form-error {
          margin: 6px 0 0;
          color: #b42318;
          font-size: 9px;
        }

        .product-category-modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 14px;
        }

        .product-category-cancel {
          height: 24px;
          padding: 0 7px;
          border: none;
          background: #fff;
          color: #64748b;
          font-size: 9px;
          cursor: pointer;
        }

        .product-category-cancel:hover {
          background: #f8fafc;
        }

        .product-category-save {
          height: 24px;
          padding: 0 11px;
          border: 1px solid #5263df;
          border-radius: 2px;
          background: #5263e9;
          color: #fff;
          font-size: 9px;
          cursor: pointer;
        }

        .product-category-save:hover {
          background: #4052d4;
        }

        .product-category-save:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .product-category-dark {
          background: #121212;
          color: #e4e4e7;
        }

        .product-category-dark .product-category-header,
        .product-category-dark .product-category-content {
          background: #1e1e1e;
          border-color: #3f3f46;
        }

        .product-category-dark .product-category-breadcrumb,
        .product-category-dark .product-category-breadcrumb button {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-title {
          color: #d6b16e;
        }

        .product-category-dark .product-category-add-button,
        .product-category-dark .product-category-save {
          background: #a98243;
          border-color: #a98243;
          color: #fff;
        }

        .product-category-dark .product-category-add-button:hover,
        .product-category-dark .product-category-save:hover {
          background: #8f6d36;
        }

        .product-category-dark .product-category-empty-title {
          color: #e4e4e7;
        }

        .product-category-dark .product-category-empty-description {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-search,
        .product-category-dark .product-category-page-size,
        .product-category-dark .product-category-page-input {
          background: #292929;
          border-color: #52525b;
          color: #e4e4e7;
        }

        .product-category-dark .product-category-search::placeholder {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-search:focus {
          border-color: #c9a15b;
        }

        .product-category-dark .product-category-table {
          background: #1e1e1e;
        }

        .product-category-dark .product-category-table thead {
          background: #252525;
        }

        .product-category-dark .product-category-table th {
          background: #252525;
          border-bottom-color: #52525b;
          color: #e4e4e7;
        }

        .product-category-dark .product-category-table td {
          background: #1e1e1e;
          border-bottom-color: #3f3f46;
          color: #d4d4d8;
        }

        .product-category-dark .product-category-table tbody tr:hover,
        .product-category-dark .product-category-table tbody tr:hover td {
          background: #292929;
        }

        .product-category-dark .product-category-checkbox {
          accent-color: #c9a15b;
        }

        .product-category-dark .product-category-row-action {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-row-action:hover {
          color: #d6b16e;
        }

        .product-category-dark .product-category-row-action.delete:hover {
          color: #f87171;
        }

        .product-category-dark .product-category-no-results {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-footer {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-page-button {
          color: #d6b16e;
        }

        .product-category-dark .product-category-page-button:disabled {
          color: #52525b;
        }

        .product-category-dark .product-category-toast {
          background: #252525;
          border-color: #398a55;
          color: #e4e4e7;
        }

        .product-category-dark .product-category-modal {
          background: #1e1e1e;
          border-color: #3f3f46;
        }

        .product-category-dark .product-category-modal-header {
          border-bottom-color: #3f3f46;
        }

        .product-category-dark .product-category-modal-header h2,
        .product-category-dark .product-category-form label {
          color: #e4e4e7;
        }

        .product-category-dark .product-category-modal-close {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-form input {
          background: #292929;
          border-color: #a98243;
          color: #f4f4f5;
        }

        .product-category-dark .product-category-form input:focus {
          border-color: #d6b16e;
        }

        .product-category-dark .product-category-character-count {
          color: #a1a1aa;
        }

        .product-category-dark .product-category-cancel {
          background: transparent;
          color: #d4d4d8;
        }

        .product-category-dark .product-category-cancel:hover {
          background: #363636;
        }

        @media (max-width: 600px) {
          .product-category-header {
            padding-right: 10px;
            padding-left: 10px;
          }

          .product-category-content {
            padding: 0 10px;
          }

          .product-category-empty {
            min-height: 65vh;
            padding-right: 8px;
            padding-left: 8px;
          }

          .product-category-folder {
            width: 200px;
            height: 150px;
          }

          .product-category-empty-title {
            max-width: 280px;
          }

          .product-category-empty-description {
            max-width: 290px;
          }

          .product-category-modal-backdrop {
            padding-top: 100px;
          }

          .product-category-footer {
            align-items: flex-start;
          }
        }
      `}</style>

      <header className="product-category-header">
        <div>
          <div className="product-category-breadcrumb">
            <button type="button" onClick={() => navigate("/daftar-lainnya")}>
              Daftar lainnya
            </button>
          </div>

          <h1 className="product-category-title">Kategori produk</h1>
        </div>

        <button
          type="button"
          className="product-category-add-button"
          onClick={openForm}
        >
          Tambah kategori
        </button>
      </header>

      <main className="product-category-content">
        {categories.length === 0 ? (
          <EmptyProductCategories />
        ) : (
          <>
            <div className="product-category-search-row">
              <input
                type="search"
                className="product-category-search"
                placeholder="Cari kategori produk"
                aria-label="Cari kategori produk"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
              />
            </div>

            {visibleCategories.length > 0 ? (
              <>
                <div className="product-category-table-wrap">
                  <table className="product-category-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            className="product-category-checkbox"
                            aria-label="Pilih semua kategori"
                            checked={allVisibleSelected}
                            onChange={(event) =>
                              toggleAll(event.target.checked)
                            }
                          />
                        </th>

                        <th>Kategori produk</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleCategories.map((category) => (
                        <tr key={category.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="product-category-checkbox"
                              aria-label={`Pilih ${category.name}`}
                              checked={selectedIds.some(
                                (id) => String(id) === String(category.id),
                              )}
                              onChange={(event) =>
                                toggleCategory(
                                  category.id,
                                  event.target.checked,
                                )
                              }
                            />
                          </td>

                          <td>{category.name}</td>

                          <td>
                            <div className="product-category-row-actions">
                              <button
                                type="button"
                                className="product-category-row-action"
                                aria-label={`Edit ${category.name}`}
                                title="Edit kategori"
                                onClick={() => openEditForm(category)}
                              >
                                <EditIcon />
                              </button>

                              <button
                                type="button"
                                className="product-category-row-action delete"
                                aria-label={`Hapus ${category.name}`}
                                title="Hapus kategori"
                                onClick={() => deleteCategory(category)}
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <footer className="product-category-footer">
                  <div className="product-category-footer-left">
                    <span>Baris per halaman</span>

                    <select
                      className="product-category-page-size"
                      value={pageSize}
                      aria-label="Baris per halaman"
                      onChange={(event) => {
                        setPageSize(event.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>

                    <span>
                      Menampilkan {(safePage - 1) * Number(pageSize) + 1} -{" "}
                      {Math.min(
                        safePage * Number(pageSize),
                        filteredCategories.length,
                      )}{" "}
                      dari {filteredCategories.length}
                    </span>

                    {selectedIds.length > 0 && (
                      <button
                        type="button"
                        className="product-category-cancel"
                        onClick={deleteSelected}
                      >
                        Hapus pilihan ({selectedIds.length})
                      </button>
                    )}
                  </div>

                  <div className="product-category-pagination">
                    <input
                      className="product-category-page-input"
                      aria-label="Halaman saat ini"
                      value={safePage}
                      readOnly
                    />

                    <span>dari {totalPages} halaman</span>

                    <button
                      type="button"
                      className="product-category-page-button"
                      aria-label="Halaman sebelumnya"
                      disabled={safePage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      className="product-category-page-button"
                      aria-label="Halaman berikutnya"
                      disabled={safePage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                    >
                      ›
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="product-category-no-results">
                Kategori tidak ditemukan.
              </div>
            )}
          </>
        )}
      </main>

      {message && (
        <div className="product-category-toast" role="status">
          <span className="product-category-toast-icon">✓</span>
          {message}
        </div>
      )}

      {showForm && (
        <div
          className="product-category-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="product-category-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-category-modal-title"
          >
            <header className="product-category-modal-header">
              <h2 id="product-category-modal-title">
                {editingId !== null
                  ? "Ubah kategori produk"
                  : "Tambah kategori produk"}
              </h2>

              <button
                type="button"
                className="product-category-modal-close"
                aria-label="Tutup"
                onClick={closeForm}
              >
                ×
              </button>
            </header>

            <form className="product-category-form" onSubmit={saveCategory}>
              <div className="product-category-label-row">
                <label htmlFor="product-category-name">Kategori produk</label>

                <span className="product-category-character-count">
                  {categoryName.length}/100
                </span>
              </div>

              <input
                id="product-category-name"
                type="text"
                value={categoryName}
                onChange={(event) => {
                  setCategoryName(event.target.value);
                  setFormError("");
                }}
                maxLength={100}
                autoFocus
                required
              />

              {formError && (
                <p className="product-category-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="product-category-modal-actions">
                <button
                  type="button"
                  className="product-category-cancel"
                  onClick={closeForm}
                >
                  Batalkan
                </button>

                <button
                  type="submit"
                  className="product-category-save"
                  disabled={categoryName.trim().length < 2}
                >
                  Simpan
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
