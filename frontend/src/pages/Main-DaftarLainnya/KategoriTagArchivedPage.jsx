import { useEffect, useMemo, useState } from "react";
import "./daftarLainnya.shared.css";

const TAG_STORAGE_KEY = "qontaksales_kategori_tags";

function getStoredTheme() {
  try {
    return localStorage.getItem("app_theme") || "light";
  } catch {
    return "light";
  }
}

function loadStoredTags() {
  try {
    const stored = localStorage.getItem(TAG_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((tag) => ({
      ...tag,
      category: tag.category || tag.group || "Belum di-assign",
    }));
  } catch {
    return [];
  }
}

function EmptyTagIllustration() {
  return (
    <svg
      viewBox="0 0 250 180"
      className="tag-archive-empty-illustration"
      role="img"
      aria-label="Ilustrasi belum ada tag"
    >
      <rect
        x="65"
        y="10"
        width="130"
        height="115"
        rx="6"
        fill="#fff"
        stroke="#234d86"
        strokeWidth="2"
        transform="rotate(-5 130 67)"
      />
      <path d="M58 26 L194 26" stroke="#234d86" strokeWidth="2" />
      <circle cx="67" cy="18" r="2.5" fill="#ef6262" />
      <circle cx="75" cy="18" r="2.5" fill="#ffc44d" />
      <circle cx="83" cy="18" r="2.5" fill="#43b7a1" />
      <path
        d="M110 53 L137 53 L146 68 L119 68 Z"
        fill="#fff"
        stroke="#aaa"
        strokeDasharray="4 3"
      />
      <path
        d="M158 48 L186 48 L192 69 L164 69 Z"
        fill="#f4e9ff"
        stroke="#9c72dc"
      />
      <path d="M165 55 L182 55 M166 61 L184 61" stroke="#9c72dc" />
      <path
        d="M75 100 L103 100 M80 108 L108 108"
        stroke="#8ca6bd"
        strokeDasharray="4 3"
      />
      <path
        d="M92 111 L69 162 M103 111 L119 162 M92 111 L93 162"
        stroke="#3a648f"
        strokeWidth="2"
      />
      <path
        d="M72 132 L107 132 M78 120 L102 120 M74 143 L111 143"
        stroke="#3a648f"
        strokeWidth="2"
      />
      <circle cx="111" cy="75" r="8" fill="#e4b18e" />
      <path d="M103 72 Q109 60 118 70 L118 75 Z" fill="#303b60" />
      <path d="M103 84 L116 84 L124 111 L98 111 Z" fill="#bd8be0" />
      <path
        d="M105 89 L91 104 L96 108 M115 89 L130 99 L135 96"
        stroke="#e4b18e"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M102 110 L99 137 L90 151 M115 110 L121 135 L131 149"
        stroke="#244b7b"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="205" cy="82" r="8" fill="#e4b18e" />
      <path d="M198 78 Q204 66 213 78" fill="#30466a" />
      <path d="M198 91 L213 91 L222 119 L192 119 Z" fill="#36a89d" />
      <path
        d="M200 95 L185 83 L178 84 M211 95 L224 108"
        stroke="#e4b18e"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M197 119 L195 143 L184 153 M213 119 L220 143 L229 153"
        stroke="#264b79"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M145 159 Q174 153 205 159"
        stroke="#c7c7c7"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function KategoriTagArchivedPage({
  title = "Arsip",
  showCreateButton = false,
}) {
  const isArchivePage = title.toLowerCase() === "arsip";

  const [themeMode, setThemeMode] = useState(getStoredTheme);
  const isDark = themeMode === "dark";

  const [tags, setTags] = useState(loadStoredTags);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);

  const [showTagForm, setShowTagForm] = useState(false);
  const [tagName, setTagName] = useState("");
  const [category, setCategory] = useState("Belum di-assign");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [movingTagId, setMovingTagId] = useState(null);
  const [moveCategory, setMoveCategory] = useState("Belum di-assign");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentCategory = isArchivePage ? "Arsip" : title;

  useEffect(() => {
    const updateTheme = (event) => {
      const nextTheme =
        typeof event?.detail === "string" ? event.detail : getStoredTheme();

      setThemeMode(nextTheme);
    };

    window.addEventListener("themeChanged", updateTheme);
    window.addEventListener("storage", updateTheme);

    return () => {
      window.removeEventListener("themeChanged", updateTheme);
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
    } catch {
      // Penyimpanan browser tidak tersedia.
    }
  }, [tags]);

  const categoryTags = useMemo(() => {
    return tags.filter((tag) => tag.category === currentCategory);
  }, [tags, currentCategory]);

  const filteredTags = useMemo(() => {
    return categoryTags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categoryTags, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTags.length / Number(pageSize)),
  );

  const visibleTags = filteredTags.slice(
    (currentPage - 1) * Number(pageSize),
    currentPage * Number(pageSize),
  );

  const visibleTagIds = visibleTags.map((tag) => tag.id);

  const allVisibleSelected =
    visibleTagIds.length > 0 &&
    visibleTagIds.every((id) => selectedTags.includes(id));

  const saveTag = (createAnother = false) => {
    const name = tagName.trim();

    if (!name) return;

    const newTag = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      category,
    };

    setTags((previous) => [...previous, newTag]);
    setCurrentPage(1);
    setSearch("");
    setSelectedTags([]);

    if (createAnother) {
      setTagName("");
      setCategory("Belum di-assign");
    } else {
      setTagName("");
      setCategory("Belum di-assign");
      setShowTagForm(false);
    }
  };

  const handleCreateTag = (event) => {
    event.preventDefault();
    saveTag(false);
  };

  const handleCreateAndNew = () => {
    saveTag(true);
  };

  const closeTagForm = () => {
    setShowTagForm(false);
    setTagName("");
    setCategory("Belum di-assign");
  };

  const toggleAll = (checked) => {
    if (checked) {
      setSelectedTags((previous) => [
        ...new Set([...previous, ...visibleTagIds]),
      ]);
    } else {
      setSelectedTags((previous) =>
        previous.filter((id) => !visibleTagIds.includes(id)),
      );
    }
  };

  const toggleTag = (id, checked) => {
    setSelectedTags((previous) =>
      checked
        ? [...new Set([...previous, id])]
        : previous.filter((item) => item !== id),
    );
  };

  const deleteSelectedTags = () => {
    if (selectedTags.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const cancelDeleteTags = () => {
    setShowDeleteConfirm(false);
  };

  const confirmDeleteTags = () => {
    if (selectedTags.length === 0) {
      setShowDeleteConfirm(false);
      return;
    }

    const idsToDelete = new Set(selectedTags);

    setTags((previous) => previous.filter((tag) => !idsToDelete.has(tag.id)));

    setSelectedTags([]);
    setCurrentPage(1);
    setOpenMenuId(null);
    setShowDeleteConfirm(false);
  };

  const archiveTag = (id) => {
    setTags((previous) =>
      previous.map((tag) =>
        tag.id === id ? { ...tag, category: "Arsip" } : tag,
      ),
    );

    setSelectedTags((previous) => previous.filter((item) => item !== id));
    setCurrentPage(1);
    setOpenMenuId(null);
  };

  const openMoveModal = (tag) => {
    setMovingTagId(tag.id);
    setMoveCategory(tag.category);
    setOpenMenuId(null);
  };

  const closeMoveModal = () => {
    setMovingTagId(null);
    setMoveCategory("Belum di-assign");
  };

  const moveTag = (event) => {
    event.preventDefault();

    if (movingTagId === null || !moveCategory) return;

    setTags((previous) =>
      previous.map((tag) =>
        tag.id === movingTagId ? { ...tag, category: moveCategory } : tag,
      ),
    );

    setSelectedTags((previous) => previous.filter((id) => id !== movingTagId));

    setCurrentPage(1);
    closeMoveModal();
  };

  const restoreTag = (id) => {
    setTags((previous) =>
      previous.map((tag) =>
        tag.id === id ? { ...tag, category: "Belum di-assign" } : tag,
      ),
    );

    setSelectedTags((previous) => previous.filter((item) => item !== id));
    setCurrentPage(1);
    setOpenMenuId(null);
  };

  return (
    <div
      className={`tag-archive-page dlsk-page ${
        isDark ? "tag-archive-dark dlsk-dark" : ""
      }`}
    >
      <style>{`
        .tag-archive-page {
          min-height: calc(100vh - 166px);
          width: 100%;
          background: #f0f2f5;
          color: #263238;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
          transition: background-color 0.2s, color 0.2s;
        }

        .tag-archive-heading {
          min-height: 73px;
          padding: 13px 25px 15px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: #fff;
          box-sizing: border-box;
        }

        .tag-archive-breadcrumb {
          margin-bottom: 5px;
          color: #66717c;
          font-size: 10px;
        }

        .tag-archive-breadcrumb span {
          margin: 0 5px;
          color: #9ba3aa;
        }

        .tag-archive-title {
          margin: 0;
          color: #161b22;
          font-size: 21px;
          line-height: 25px;
          font-weight: 600;
        }

        .tag-archive-create {
          height: 38px;
          min-width: 82px;
          padding: 0 17px;
          border: 1px solid #1767a9;
          border-radius: 5px;
          background: #1767a9;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }

        .tag-archive-create:hover {
          background: #11558f;
        }

        .tag-archive-content {
          margin: 12px 16px 0 11px;
          min-height: 212px;
          padding: 14px 12px 17px;
          background: #fff;
          box-sizing: border-box;
        }

        .tag-archive-search-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 18px;
        }

        .tag-archive-search {
          display: flex;
          width: 270px;
          height: 35px;
          border: 1px solid #d8dce1;
          border-radius: 3px;
          background: #fff;
          overflow: hidden;
          box-sizing: border-box;
        }

        .tag-archive-search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          flex-shrink: 0;
          color: #718096;
          font-size: 22px;
        }

        .tag-archive-search input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          padding: 0 8px 0 0;
          color: #263238;
          font-size: 12px;
        }

        .tag-archive-search input::placeholder {
          color: #a0a8b0;
        }

        .tag-archive-table-wrap {
          width: 100%;
          overflow: visible;
          border: 1px solid #d9dde2;
          border-radius: 3px;
        }

        .tag-archive-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          background: #fff;
        }

        .tag-archive-table thead {
          background: #fbfbfb;
        }

        .tag-archive-table th {
          height: 39px;
          padding: 0 12px;
          border-bottom: 1px solid #d9dde2;
          color: #202830;
          text-align: left;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 600;
        }

        .tag-archive-table th:first-child {
          width: 31px;
          padding: 0;
          text-align: center;
        }

        .tag-archive-table th:nth-child(2) {
          width: 29%;
        }

        .tag-archive-table th:nth-child(3),
        .tag-archive-table th:nth-child(4),
        .tag-archive-table th:nth-child(5),
        .tag-archive-table th:nth-child(6) {
          width: 14%;
        }

        .tag-archive-table th:last-child {
          width: 38px;
        }

        .tag-archive-sort {
          margin-left: 4px;
          color: #555f68;
          font-size: 10px;
          letter-spacing: -3px;
        }

        .tag-archive-table td {
          height: 38px;
          padding: 0 12px;
          border-bottom: 1px solid #e1e4e8;
          color: #343b42;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .tag-archive-table td:first-child {
          padding: 0;
          text-align: center;
        }

        .tag-archive-table tbody tr:last-child td {
          border-bottom: none;
        }

        .tag-archive-check {
          width: 14px;
          height: 14px;
          margin: 0;
          vertical-align: middle;
          accent-color: #0875d1;
          cursor: pointer;
        }

        .tag-archive-name {
          color: #1557a3 !important;
          font-weight: 500;
        }

        .tag-archive-dash {
          color: #95a0aa !important;
        }

        .tag-archive-menu-cell {
          position: relative;
          text-align: center;
        }

        .tag-archive-menu-button {
          height: 30px;
          width: 26px;
          border: none;
          background: transparent;
          color: #697783;
          font-size: 19px;
          cursor: pointer;
        }

        .tag-archive-menu-button:hover {
          color: #1767a9;
        }

        .tag-archive-menu {
          position: absolute;
          top: 32px;
          right: 5px;
          z-index: 20;
          min-width: 122px;
          padding: 5px 0;
          border: 1px solid #d9dde2;
          border-radius: 3px;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.13);
          text-align: left;
        }

        .tag-archive-menu button {
          display: block;
          width: 100%;
          padding: 9px 12px;
          border: 0;
          background: #fff;
          color: #344252;
          text-align: left;
          font-size: 12px;
          white-space: nowrap;
          cursor: pointer;
        }

        .tag-archive-menu button:hover {
          background: #f1f5f9;
        }

        .tag-archive-selection-row th {
          height: 39px;
          padding: 0 12px;
          background: #fbfbfb;
          border-bottom: 1px solid #d9dde2;
        }

        .tag-archive-selection-toolbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          height: 39px;
          font-weight: 400;
        }

        .tag-archive-delete-selected {
          padding: 3px 9px;
          border: 1px solid #d9dde2;
          border-radius: 3px;
          background: #fff;
          color: #58616b;
          font-size: 12px;
          cursor: pointer;
        }

        .tag-archive-delete-selected:hover {
          background: #f0f2f5;
        }

        .tag-archive-empty-header th:first-child {
          width: 29%;
          padding: 0 12px;
        }

        .tag-archive-empty-header th:nth-child(n + 2) {
          width: 17.75%;
          padding: 0 12px;
        }

        .tag-archive-empty-state-row td {
          height: 298px;
          padding: 0 20px;
          background: #fff;
          border-bottom: none;
        }

        .tag-archive-empty-state {
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 42px;
        }

        .tag-archive-empty-illustration {
          display: block;
          width: 250px;
          max-width: 38%;
          height: 180px;
          flex-shrink: 0;
        }

        .tag-archive-empty-copy {
          text-align: left;
          color: #222;
          line-height: 1.6;
        }

        .tag-archive-empty-copy strong {
          display: block;
          margin-bottom: 2px;
          font-size: 12px;
          font-weight: 600;
        }

        .tag-archive-empty-copy p {
          margin: 0;
          color: #718096;
          font-size: 12px;
        }

        .tag-archive-no-results {
          text-align: center;
          color: #9ba3aa;
          padding: 70px 10px;
        }

        .tag-archive-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          padding-top: 8px;
          color: #7b8794;
          font-size: 12px;
        }

        .tag-archive-page-size,
        .tag-archive-page-number {
          height: 34px;
          padding: 0 9px;
          border: 1px solid #d9dde2;
          border-radius: 3px;
          background: #fff;
          color: #343b42;
          font-size: 12px;
        }

        .tag-archive-page-size {
          width: 68px;
          margin: 0 7px;
        }

        .tag-archive-pagination {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tag-archive-page-button {
          min-width: 20px;
          height: 29px;
          border: 0;
          background: transparent;
          color: #53728b;
          font-size: 17px;
          cursor: pointer;
        }

        .tag-archive-page-button:disabled {
          color: #c5cbd1;
          cursor: default;
        }

        .tag-archive-page-number {
          width: 45px;
          text-align: center;
        }

        .tag-archive-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 86px 16px 24px;
          overflow-y: auto;
          background: rgba(21, 32, 43, 0.48);
          box-sizing: border-box;
        }

        .tag-archive-modal {
          width: 100%;
          max-width: 540px;
          background: #fff;
          border-radius: 2px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
          color: #333;
        }

        .tag-archive-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 22px;
        }

        .tag-archive-modal-close {
          width: 22px;
          height: 28px;
          border: none;
          background: transparent;
          color: #858585;
          font-size: 20px;
          cursor: pointer;
        }

        .tag-archive-modal-form {
          padding: 7px 22px 18px;
        }

        .tag-archive-name-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
        }

        .tag-archive-form-label {
          display: block;
          color: #343434;
          font-size: 12px;
          font-weight: 600;
        }

        .tag-archive-character-count {
          margin-bottom: 5px;
          color: #a7a7a7;
          font-size: 12px;
        }

        .tag-archive-name-input {
          display: block;
          width: 100%;
          height: 35px;
          box-sizing: border-box;
          padding: 0 11px;
          border: 1px solid #00b87a;
          border-radius: 3px;
          outline: none;
          background: #fff;
          color: #333;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
        }

        .tag-archive-name-input:focus {
          border-color: #00b87a;
        }

        .tag-archive-name-input::placeholder {
          color: #a3a3a3;
        }

        .tag-archive-category-field {
          margin-top: 20px;
        }

        .tag-archive-category-field .tag-archive-form-label {
          margin-bottom: 7px;
        }

        .tag-archive-category-select {
          width: 100%;
          height: 35px;
          padding: 0 11px;
          border: 1px solid #ebedf0;
          border-radius: 3px;
          background: #f7f8fa;
          color: #7c8187;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
          outline: none;
        }

        .tag-archive-modal-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 36px;
        }

        .tag-archive-modal-actions-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tag-archive-cancel {
          padding: 8px 15px;
          border: none;
          background: transparent;
          color: #777;
          font-size: 12px;
          cursor: pointer;
        }

        .tag-archive-create-another {
          height: 34px;
          padding: 0 14px;
          border: 1px solid #dedede;
          border-radius: 3px;
          background: #fff;
          color: #777;
          font-size: 12px;
          cursor: pointer;
        }

        .tag-archive-create-another:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tag-archive-submit {
          height: 34px;
          min-width: 56px;
          padding: 0 15px;
          border: 1px solid #005bbb;
          border-radius: 3px;
          background: #005fc5;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }

        .tag-archive-submit:hover {
          background: #004fa7;
        }

        .tag-move-modal {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 3px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .tag-move-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 18px;
          border-bottom: 1px solid #e1e5e9;
        }

        .tag-move-modal-header h2 {
          margin: 0;
          color: #25313c;
          font-size: 15px;
          font-weight: 600;
        }

        .tag-move-form {
          padding: 18px;
        }

        .tag-move-form label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .tag-move-form select {
          width: 100%;
          height: 36px;
          padding: 0 10px;
          border: 1px solid #cfd6dd;
          border-radius: 3px;
          background: #fff;
          font-size: 12px;
          box-sizing: border-box;
        }

        .tag-move-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 22px;
        }

        .tag-delete-confirm-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.53);
          box-sizing: border-box;
        }

        .tag-delete-confirm-modal {
          width: 100%;
          max-width: 354px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          color: #333;
        }

        .tag-delete-confirm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 51px;
          padding: 0 21px;
          border-bottom: 1px solid #dedede;
        }

        .tag-delete-confirm-header h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .tag-delete-confirm-close {
          padding: 3px;
          border: 0;
          background: transparent;
          color: #777;
          font-size: 19px;
          cursor: pointer;
        }

        .tag-delete-confirm-body {
          padding: 16px 21px;
          font-size: 12px;
          line-height: 18px;
        }

        .tag-delete-confirm-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 0 21px 28px;
        }

        .tag-delete-confirm-cancel {
          height: 35px;
          padding: 0 8px;
          border: 0;
          background: transparent;
          color: #777;
          font-size: 12px;
          cursor: pointer;
        }

        .tag-delete-confirm-submit {
          height: 35px;
          padding: 0 15px;
          border: 1px solid #df3e24;
          border-radius: 3px;
          background: #df3e24;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .tag-delete-confirm-submit:hover {
          background: #c9321b;
        }

        .tag-archive-dark {
          background: #121212;
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-heading,
        .tag-archive-dark .tag-archive-content {
          background: #1e1e1e;
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-breadcrumb {
          color: #a1a1aa;
        }

        .tag-archive-dark .tag-archive-breadcrumb span {
          color: #71717a;
        }

        .tag-archive-dark .tag-archive-title {
          color: #f4f4f5;
        }

        .tag-archive-dark .tag-archive-create {
          background: #a98243;
          border-color: #a98243;
          color: #fff;
        }

        .tag-archive-dark .tag-archive-create:hover {
          background: #8f6d36;
        }

        .tag-archive-dark .tag-archive-search {
          background: #292929;
          border-color: #52525b;
        }

        .tag-archive-dark .tag-archive-search-icon {
          color: #c9a15b;
        }

        .tag-archive-dark .tag-archive-search input {
          background: #292929;
          color: #f4f4f5;
        }

        .tag-archive-dark .tag-archive-search input::placeholder {
          color: #85858d;
        }

        .tag-archive-dark .tag-archive-table-wrap {
          border-color: #3f3f46;
        }

        .tag-archive-dark .tag-archive-table {
          background: #1e1e1e;
        }

        .tag-archive-dark .tag-archive-table thead,
        .tag-archive-dark .tag-archive-selection-row th {
          background: #292929;
        }

        .tag-archive-dark .tag-archive-table th {
          background: #292929;
          border-bottom-color: #3f3f46;
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-sort {
          color: #c9a15b;
        }

        .tag-archive-dark .tag-archive-table td {
          background: #1e1e1e;
          border-bottom-color: #353535;
          color: #d4d4d8;
        }

        .tag-archive-dark .tag-archive-name {
          color: #c9a15b !important;
        }

        .tag-archive-dark .tag-archive-dash {
          color: #85858d !important;
        }

        .tag-archive-dark .tag-archive-check {
          accent-color: #c9a15b;
        }

        .tag-archive-dark .tag-archive-menu-button {
          color: #c9a15b;
        }

        .tag-archive-dark .tag-archive-menu-button:hover {
          color: #e3bd79;
        }

        .tag-archive-dark .tag-archive-menu {
          background: #252525;
          border-color: #52525b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .tag-archive-dark .tag-archive-menu button {
          background: #252525;
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-menu button:hover {
          background: #383838;
          color: #d6b477;
        }

        .tag-archive-dark .tag-archive-delete-selected {
          background: #292929;
          border-color: #52525b;
          color: #d4d4d8;
        }

        .tag-archive-dark .tag-archive-delete-selected:hover {
          background: #383838;
        }

        .tag-archive-dark .tag-archive-empty-state-row td {
          background: #1e1e1e;
        }

        .tag-archive-dark .tag-archive-empty-copy {
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-empty-copy p {
          color: #a1a1aa;
        }

        .tag-archive-dark .tag-archive-no-results {
          color: #a1a1aa;
        }

        .tag-archive-dark .tag-archive-footer {
          color: #a1a1aa;
        }

        .tag-archive-dark .tag-archive-page-size,
        .tag-archive-dark .tag-archive-page-number {
          background: #292929;
          border-color: #52525b;
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-page-button {
          color: #c9a15b;
        }

        .tag-archive-dark .tag-archive-page-button:disabled {
          color: #55555d;
        }

        .tag-archive-dark .tag-archive-modal,
        .tag-archive-dark .tag-move-modal,
        .tag-archive-dark .tag-delete-confirm-modal {
          background: #1e1e1e;
          border-color: #3f3f46;
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-modal-close,
        .tag-archive-dark .tag-delete-confirm-close {
          color: #a1a1aa;
        }

        .tag-archive-dark .tag-archive-form-label,
        .tag-archive-dark .tag-move-modal-header h2,
        .tag-archive-dark .tag-delete-confirm-header h2 {
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-character-count {
          color: #a1a1aa;
        }

        .tag-archive-dark .tag-archive-name-input {
          background: #292929;
          border-color: #a98243;
          color: #f4f4f5;
        }

        .tag-archive-dark .tag-archive-name-input::placeholder {
          color: #85858d;
        }

        .tag-archive-dark .tag-archive-category-select,
        .tag-archive-dark .tag-move-form select {
          background: #292929;
          border-color: #52525b;
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-archive-cancel {
          color: #c9a15b;
        }

        .tag-archive-dark .tag-archive-create-another {
          background: #292929;
          border-color: #52525b;
          color: #d4d4d8;
        }

        .tag-archive-dark .tag-archive-submit {
          background: #a98243;
          border-color: #a98243;
          color: #fff;
        }

        .tag-archive-dark .tag-archive-submit:hover {
          background: #8f6d36;
        }

        .tag-archive-dark .tag-move-modal-header {
          border-bottom-color: #3f3f46;
        }

        .tag-archive-dark .tag-move-form label {
          color: #e5e7eb;
        }

        .tag-archive-dark .tag-delete-confirm-header {
          border-bottom-color: #3f3f46;
        }

        .tag-archive-dark .tag-delete-confirm-body {
          color: #d4d4d8;
        }

        .tag-archive-dark .tag-delete-confirm-cancel {
          color: #c9a15b;
        }

        @media (max-width: 700px) {
          .tag-archive-heading {
            padding: 12px;
          }

          .tag-archive-title {
            font-size: 18px;
          }

          .tag-archive-content {
            margin: 10px;
            padding: 10px;
          }

          .tag-archive-search {
            width: 100%;
            max-width: 270px;
          }

          .tag-archive-table-wrap {
            overflow-x: auto;
          }

          .tag-archive-table {
            min-width: 720px;
          }

          .tag-archive-footer {
            align-items: flex-start;
          }

          .tag-archive-modal-backdrop {
            padding: 86px 12px 20px;
          }

          .tag-archive-modal-actions-right {
            gap: 6px;
          }

          .tag-archive-create-another {
            padding: 0 9px;
          }

          .tag-archive-empty-state {
            flex-direction: column;
            gap: 10px;
            padding: 25px 0;
          }

          .tag-archive-empty-illustration {
            max-width: 100%;
            width: 190px;
          }

          .tag-archive-empty-copy {
            text-align: center;
          }
        }
      `}</style>

      <header className="tag-archive-heading">
        <div>
          <div className="tag-archive-breadcrumb">
            Daftar Lainnya <span>/</span> Kategori Tag
          </div>

          <h1 className="tag-archive-title">{title}</h1>
        </div>

        {showCreateButton && (
          <button
            type="button"
            className="tag-archive-create"
            onClick={() => setShowTagForm(true)}
          >
            Buat tag
          </button>
        )}
      </header>

      <main className="tag-archive-content">
        <div className="tag-archive-search-row">
          <div className="tag-archive-search">
            <span className="tag-archive-search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              type="search"
              placeholder="Cari tag..."
              aria-label="Cari tag"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="tag-archive-table-wrap">
          <table className="tag-archive-table">
            <thead>
              {selectedTags.length > 0 ? (
                <tr className="tag-archive-selection-row">
                  <th colSpan={7}>
                    <div className="tag-archive-selection-toolbar">
                      <input
                        className="tag-archive-check"
                        type="checkbox"
                        aria-label="Pilih semua tag"
                        checked={allVisibleSelected}
                        onChange={(event) => toggleAll(event.target.checked)}
                      />

                      <span>{selectedTags.length} tag dipilih</span>

                      <button
                        type="button"
                        className="tag-archive-delete-selected"
                        onClick={deleteSelectedTags}
                      >
                        Hapus
                      </button>
                    </div>
                  </th>
                </tr>
              ) : categoryTags.length === 0 && !search ? (
                <tr className="tag-archive-empty-header">
                  <th>
                    Nama tag <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Penjualan <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Pembelian <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Biaya <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Lainnya <span className="tag-archive-sort">▲▼</span>
                  </th>
                </tr>
              ) : (
                <tr>
                  <th>
                    <input
                      className="tag-archive-check"
                      type="checkbox"
                      aria-label="Pilih semua tag"
                      checked={allVisibleSelected}
                      onChange={(event) => toggleAll(event.target.checked)}
                    />
                  </th>

                  <th>
                    Nama tag <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Penjualan <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Pembelian <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Biaya <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th>
                    Lainnya <span className="tag-archive-sort">▲▼</span>
                  </th>
                  <th></th>
                </tr>
              )}
            </thead>

            <tbody>
              {visibleTags.length > 0 ? (
                visibleTags.map((tag) => (
                  <tr key={tag.id}>
                    <td>
                      <input
                        className="tag-archive-check"
                        type="checkbox"
                        aria-label={`Pilih tag ${tag.name}`}
                        checked={selectedTags.includes(tag.id)}
                        onChange={(event) =>
                          toggleTag(tag.id, event.target.checked)
                        }
                      />
                    </td>

                    <td className="tag-archive-name">{tag.name}</td>
                    <td className="tag-archive-dash">-</td>
                    <td className="tag-archive-dash">-</td>
                    <td className="tag-archive-dash">-</td>
                    <td className="tag-archive-dash">-</td>

                    <td className="tag-archive-menu-cell">
                      <button
                        type="button"
                        className="tag-archive-menu-button"
                        aria-label={`Menu tag ${tag.name}`}
                        aria-expanded={openMenuId === tag.id}
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === tag.id ? null : tag.id,
                          )
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === tag.id && (
                        <div className="tag-archive-menu">
                          <button
                            type="button"
                            onClick={() => openMoveModal(tag)}
                          >
                            Pindahkan tag
                          </button>

                          {isArchivePage ? (
                            <button
                              type="button"
                              onClick={() => restoreTag(tag.id)}
                            >
                              Kembalikan tag
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => archiveTag(tag.id)}
                            >
                              Arsipkan tag
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="tag-archive-empty-state-row">
                  <td colSpan={categoryTags.length === 0 && !search ? 5 : 7}>
                    {search ? (
                      <div className="tag-archive-no-results">
                        Tag tidak ditemukan
                      </div>
                    ) : (
                      <div className="tag-archive-empty-state">
                        <EmptyTagIllustration />

                        <div className="tag-archive-empty-copy">
                          <strong>Belum ada tag di kategori ini</strong>
                          <p>Untuk menambahkan tag, klik tombol "Buat tag".</p>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {categoryTags.length > 0 && (
          <footer className="tag-archive-footer">
            <div>
              Tampilkan
              <select
                className="tag-archive-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Jumlah baris per halaman"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              dari {filteredTags.length} baris
            </div>

            <div className="tag-archive-pagination">
              <button
                type="button"
                className="tag-archive-page-button"
                aria-label="Halaman pertama"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                |‹
              </button>

              <button
                type="button"
                className="tag-archive-page-button"
                aria-label="Halaman sebelumnya"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                ‹
              </button>

              <input
                className="tag-archive-page-number"
                aria-label="Halaman saat ini"
                value={Math.min(currentPage, totalPages)}
                readOnly
              />

              <span>dari {totalPages}</span>

              <button
                type="button"
                className="tag-archive-page-button"
                aria-label="Halaman berikutnya"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                ›
              </button>

              <button
                type="button"
                className="tag-archive-page-button"
                aria-label="Halaman terakhir"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                ›|
              </button>
            </div>
          </footer>
        )}
      </main>

      {showTagForm && showCreateButton && (
        <div
          className="tag-archive-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeTagForm();
          }}
        >
          <section
            className="tag-archive-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Buat tag"
          >
            <header className="tag-archive-modal-header">
              <span></span>

              <button
                type="button"
                className="tag-archive-modal-close"
                aria-label="Tutup"
                onClick={closeTagForm}
              >
                ×
              </button>
            </header>

            <form className="tag-archive-modal-form" onSubmit={handleCreateTag}>
              <div className="tag-archive-name-label-row">
                <label
                  className="tag-archive-form-label"
                  htmlFor="tag-name-input"
                >
                  Nama tag
                </label>

                <span className="tag-archive-character-count">
                  {tagName.length}/250
                </span>
              </div>

              <input
                id="tag-name-input"
                className="tag-archive-name-input"
                type="text"
                placeholder="Nama"
                maxLength={250}
                value={tagName}
                onChange={(event) => setTagName(event.target.value)}
                autoFocus
                required
              />

              <div className="tag-archive-category-field">
                <label
                  className="tag-archive-form-label"
                  htmlFor="tag-category-select"
                >
                  Masukkan ke kategori
                </label>

                <select
                  id="tag-category-select"
                  className="tag-archive-category-select"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="Belum di-assign">Belum di-assign</option>
                  <option value="Arsip">Arsip</option>
                </select>
              </div>

              <div className="tag-archive-modal-actions">
                <button
                  type="button"
                  className="tag-archive-cancel"
                  onClick={closeTagForm}
                >
                  Batalkan
                </button>

                <div className="tag-archive-modal-actions-right">
                  <button
                    type="button"
                    className="tag-archive-create-another"
                    onClick={handleCreateAndNew}
                    disabled={!tagName.trim()}
                  >
                    Buat dan baru
                  </button>

                  <button type="submit" className="tag-archive-submit">
                    Buat
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {movingTagId !== null && (
        <div
          className="tag-archive-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMoveModal();
          }}
        >
          <section
            className="tag-move-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tag-move-title"
          >
            <header className="tag-move-modal-header">
              <h2 id="tag-move-title">Pindahkan tag</h2>

              <button
                type="button"
                className="tag-archive-modal-close"
                aria-label="Tutup"
                onClick={closeMoveModal}
              >
                ×
              </button>
            </header>

            <form className="tag-move-form" onSubmit={moveTag}>
              <label htmlFor="move-tag-category">Masukkan ke kategori</label>

              <select
                id="move-tag-category"
                value={moveCategory}
                onChange={(event) => setMoveCategory(event.target.value)}
              >
                <option value="Belum di-assign">Belum di-assign</option>
                <option value="Arsip">Arsip</option>
              </select>

              <div className="tag-move-actions">
                <button
                  type="button"
                  className="tag-archive-cancel"
                  onClick={closeMoveModal}
                >
                  Batalkan
                </button>

                <button type="submit" className="tag-archive-submit">
                  Pindahkan
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="tag-delete-confirm-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelDeleteTags();
            }
          }}
        >
          <section
            className="tag-delete-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tag-delete-confirm-title"
          >
            <header className="tag-delete-confirm-header">
              <h2 id="tag-delete-confirm-title">
                Hapus {selectedTags.length} tag?
              </h2>

              <button
                type="button"
                className="tag-delete-confirm-close"
                aria-label="Tutup"
                onClick={cancelDeleteTags}
              >
                ×
              </button>
            </header>

            <div className="tag-delete-confirm-body">
              Tag yang sudah dihapus tidak bisa dikembalikan
            </div>

            <footer className="tag-delete-confirm-actions">
              <button
                type="button"
                className="tag-delete-confirm-cancel"
                onClick={cancelDeleteTags}
              >
                Tidak
              </button>

              <button
                type="button"
                className="tag-delete-confirm-submit"
                onClick={confirmDeleteTags}
              >
                Ya, hapus
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
