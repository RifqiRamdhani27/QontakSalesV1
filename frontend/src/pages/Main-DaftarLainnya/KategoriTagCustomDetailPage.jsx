import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import "./daftarLainnya.shared.css";

const TAG_STORAGE_KEY = "qontaksales_kategori_tags";
const CATEGORY_STORAGE_KEY = "qontaksales_kategori_custom";

function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function EmptyTagIllustration() {
  return (
    <svg
      viewBox="0 0 250 180"
      className="h-[160px] w-[220px]"
      role="img"
      aria-label="Belum ada tag"
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
        d="M92 111 L69 162 M103 111 L119 162 M92 111 L93 162"
        stroke="#3a648f"
        strokeWidth="2"
      />
      <circle cx="111" cy="75" r="8" fill="#e4b18e" />
      <path d="M103 72 Q109 60 118 70 L118 75 Z" fill="#303b60" />
      <path d="M103 84 L116 84 L124 111 L98 111 Z" fill="#bd8be0" />
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

export default function KategoriTagCustomDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const categoryId = id;

  const [categories, setCategories] = useState(() =>
    readStorage(CATEGORY_STORAGE_KEY),
  );

  const [tags, setTags] = useState(() =>
    readStorage(TAG_STORAGE_KEY).map((tag) => ({
      ...tag,
      category: tag.category || tag.group || "Belum di-assign",
    })),
  );

  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light",
  );

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("25");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);

  const [showTagForm, setShowTagForm] = useState(false);
  const [tagName, setTagName] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [movingTagId, setMovingTagId] = useState(null);
  const [moveCategory, setMoveCategory] = useState("Belum di-assign");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState("");

  const isDark = themeMode === "dark";

  const category = categories.find(
    (item) => String(item.id) === String(categoryId),
  );

  useEffect(() => {
    const updateTheme = () => {
      setThemeMode(localStorage.getItem("app_theme") || "light");
    };

    window.addEventListener("themeChanged", updateTheme);
    window.addEventListener("storage", updateTheme);

    updateTheme();

    return () => {
      window.removeEventListener("themeChanged", updateTheme);
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
    } catch {
      setMessage("Tag gagal disimpan di browser.");
    }
  }, [tags]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
    } catch {
      setMessage("Kategori gagal disimpan di browser.");
    }
  }, [categories]);

  const categoryTags = useMemo(() => {
    if (!category) return [];

    return tags.filter((tag) => tag.category === category.name);
  }, [tags, category]);

  const filteredTags = useMemo(
    () =>
      categoryTags.filter((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [categoryTags, search],
  );

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

  const moveOptions = useMemo(
    () => [
      "Belum di-assign",
      ...categories
        .filter((item) => String(item.id) !== String(categoryId))
        .map((item) => item.name),
    ],
    [categories, categoryId],
  );

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

  const createTag = (event, createAnother = false) => {
    event.preventDefault();

    const name = tagName.trim();

    if (!name || !category) return;

    const newTag = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      category: category.name,
    };

    setTags((previous) => [...previous, newTag]);
    setTagName("");
    setSearch("");
    setCurrentPage(1);
    setMessage("Tag berhasil ditambahkan.");

    if (!createAnother) {
      setShowTagForm(false);
    }
  };

  const openTagMenu = (event, tag) => {
    event.stopPropagation();

    if (openMenu?.id === tag.id) {
      setOpenMenu(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 165;

    setOpenMenu({
      id: tag.id,
      top: rect.bottom + 4,
      left: Math.max(
        8,
        Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
      ),
    });
  };

  const archiveTag = (id) => {
    setTags((previous) =>
      previous.map((tag) =>
        tag.id === id ? { ...tag, category: "Arsip" } : tag,
      ),
    );

    setSelectedTags((previous) => previous.filter((item) => item !== id));
    setOpenMenu(null);
    setMessage("Tag berhasil diarsipkan.");
  };

  const openMoveModal = (tag) => {
    setMovingTagId(tag.id);
    setMoveCategory("Belum di-assign");
    setOpenMenu(null);
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

    closeMoveModal();
    setMessage("Tag berhasil dipindahkan.");
  };

  const deleteSelectedTags = () => {
    if (selectedTags.length === 0) return;

    setTags((previous) =>
      previous.filter((tag) => !selectedTags.includes(tag.id)),
    );

    setSelectedTags([]);
    setMessage("Tag terpilih berhasil dihapus.");
  };

  const deleteCategory = () => {
    if (!category) return;

    setCategories((previous) =>
      previous.filter((item) => String(item.id) !== String(categoryId)),
    );

    setTags((previous) =>
      previous.map((tag) =>
        tag.category === category.name
          ? { ...tag, category: "Belum di-assign" }
          : tag,
      ),
    );

    setShowDeleteConfirm(false);
    navigate("/daftar-lainnya/create");
  };

  if (!category) {
    return (
      <div
        className={`kategori-tag-detail-root dlsk-page -m-4 min-h-full p-6 md:-m-6 ${
          isDark ? "dash-dark dlsk-dark" : ""
        }`}
      >
        <style>{`
          .kategori-tag-detail-root.dash-dark {
            background: #121212 !important;
            color: #e5e7eb !important;
            min-height: 100%;
          }
          .kategori-tag-detail-root.dash-dark p {
            color: #d1d5db !important;
          }
          .kategori-tag-detail-root.dash-dark button {
            color: #c9a15b !important;
          }
        `}</style>

        <p className="text-sm text-slate-600">Kategori tidak ditemukan.</p>

        <button
          type="button"
          onClick={() => navigate("/daftar-lainnya/create")}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          Kembali ke Kategori Tag
        </button>
      </div>
    );
  }

  const currentMenuTag = openMenu
    ? visibleTags.find((tag) => tag.id === openMenu.id)
    : null;

  return (
    <div
      className={`kategori-tag-detail-root dlsk-page -m-4 min-h-full bg-[#eef1f6] text-[#243247] md:-m-6 ${
        isDark ? "dash-dark dlsk-dark" : ""
      }`}
      onClick={() => {
        if (openMenu) setOpenMenu(null);
      }}
    >
      <style>{`
        .kategori-tag-detail-root.dash-dark {
          background: #121212 !important;
          color: #e5e7eb !important;
        }

        .kategori-tag-detail-root.dash-dark header,
        .kategori-tag-detail-root.dash-dark main {
          background: #1e1e1e !important;
          color: #e5e7eb !important;
        }

        .kategori-tag-detail-root.dash-dark h1,
        .kategori-tag-detail-root.dash-dark h2,
        .kategori-tag-detail-root.dash-dark strong,
        .kategori-tag-detail-root.dash-dark label {
          color: #e5e7eb !important;
        }

        .kategori-tag-detail-root.dash-dark p,
        .kategori-tag-detail-root.dash-dark span {
          color: #cbd5e1;
        }

        .kategori-tag-detail-root.dash-dark button {
          color: #c9a15b;
        }

        .kategori-tag-detail-root.dash-dark button:hover {
          background-color: #333333 !important;
        }

        .kategori-tag-detail-root.dash-dark button:disabled {
          opacity: 0.4;
        }

        .kategori-tag-detail-root.dash-dark input,
        .kategori-tag-detail-root.dash-dark select {
          background-color: #292929 !important;
          color: #e5e7eb !important;
          border-color: #52525b !important;
        }

        .kategori-tag-detail-root.dash-dark input::placeholder {
          color: #9ca3af !important;
        }

        .kategori-tag-detail-root.dash-dark table {
          background-color: #1e1e1e !important;
          color: #e5e7eb !important;
        }

        .kategori-tag-detail-root.dash-dark thead {
          background-color: #292929 !important;
        }

        .kategori-tag-detail-root.dash-dark th,
        .kategori-tag-detail-root.dash-dark td {
          border-color: #3f3f46 !important;
        }

        .kategori-tag-detail-root.dash-dark td.text-\\[\\#1557a3\\] {
          color: #c9a15b !important;
        }

        .kategori-tag-detail-root.dash-dark .text-\\[\\#006fc9\\] {
          color: #c9a15b !important;
        }

        .kategori-tag-detail-root.dash-dark .bg-\\[\\#006fc9\\] {
          background-color: #a98243 !important;
          color: #ffffff !important;
        }

        .kategori-tag-detail-root.dash-dark .bg-\\[\\#006fc9\\]:hover {
          background-color: #8f6d36 !important;
        }

        .kategori-tag-detail-root.dash-dark .bg-white {
          background-color: #1e1e1e !important;
        }

        .kategori-tag-detail-root.dash-dark .border-\\[\\#dedede\\],
        .kategori-tag-detail-root.dash-dark .border-\\[\\#d9dde2\\],
        .kategori-tag-detail-root.dash-dark .border-\\[\\#d7dce2\\] {
          border-color: #52525b !important;
        }

        .kategori-tag-detail-root.dash-dark .bg-\\[\\#fbfbfb\\],
        .kategori-tag-detail-root.dash-dark .bg-\\[\\#f8f9fa\\],
        .kategori-tag-detail-root.dash-dark .bg-\\[\\#f7fbff\\] {
          background-color: #292929 !important;
        }

        .kategori-tag-detail-root.dash-dark .text-\\[\\#64748b\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#718096\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#526b80\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#334155\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#263238\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#202938\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#344252\\] {
          color: #d1d5db !important;
        }

        .kategori-tag-detail-root.dash-dark .text-\\[\\#95a0aa\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#9ba3aa\\],
        .kategori-tag-detail-root.dash-dark .text-\\[\\#94a3b8\\] {
          color: #9ca3af !important;
        }

        .kategori-tag-detail-root.dash-dark .accent-blue-600 {
          accent-color: #c9a15b !important;
        }

        .kategori-tag-detail-root.dash-dark .text-\\[\\#c0392b\\] {
          color: #f87171 !important;
        }

        .kategori-tag-detail-root.dash-dark .bg-\\[\\#df3e24\\] {
          background-color: #b83220 !important;
          color: #ffffff !important;
        }

        .tag-detail-portal-dark {
          background-color: #252525 !important;
          border-color: #52525b !important;
          color: #e5e7eb !important;
        }

        .tag-detail-portal-dark button {
          color: #e5e7eb !important;
        }

        .tag-detail-portal-dark button:hover {
          background-color: #383838 !important;
        }

        .tag-detail-modal-dark {
          background-color: #1e1e1e !important;
          border-color: #52525b !important;
          color: #e5e7eb !important;
        }

        .tag-detail-modal-dark h2,
        .tag-detail-modal-dark label {
          color: #e5e7eb !important;
        }

        .tag-detail-modal-dark p,
        .tag-detail-modal-dark span {
          color: #cbd5e1 !important;
        }

        .tag-detail-modal-dark input,
        .tag-detail-modal-dark select {
          background-color: #292929 !important;
          color: #e5e7eb !important;
          border-color: #52525b !important;
        }

        .tag-detail-modal-dark button {
          color: #c9a15b;
        }

        .tag-detail-modal-dark button.bg-\\[\\#006fc9\\] {
          background-color: #a98243 !important;
          color: #ffffff !important;
        }
      `}</style>

      <header className="flex items-center justify-between gap-4 bg-white px-[16px] py-[12px]">
        <div>
          <div className="mb-1 text-[10px] text-[#64748b]">
            <button
              type="button"
              onClick={() => navigate("/daftar-lainnya/create")}
              className="hover:underline"
            >
              Daftar Lainnya
            </button>

            <span className="mx-1">/</span>

            <button
              type="button"
              onClick={() => navigate("/daftar-lainnya/create")}
              className="hover:underline"
            >
              Kategori Tag
            </button>
          </div>

          <h1 className="m-0 text-[20px] font-semibold text-[#202938]">
            {category.name}
          </h1>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-[34px] border border-[#dedede] bg-white px-[12px] text-[10px] text-[#64748b] hover:bg-[#f8fafc]"
          >
            Hapus kategori
          </button>

          <button
            type="button"
            onClick={() => {
              setTagName("");
              setMessage("");
              setShowTagForm(true);
            }}
            className="h-[34px] rounded-[2px] bg-[#006fc9] px-[15px] text-[11px] font-semibold text-white hover:bg-[#005eab]"
          >
            Buat tag
          </button>
        </div>
      </header>

      <main
        className="mx-[8px] mt-[10px] bg-white p-[9px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-[13px] flex justify-end">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
              setOpenMenu(null);
            }}
            placeholder="Cari tag..."
            aria-label="Cari tag"
            className="h-[26px] w-full border border-[#d7dce2] px-[9px] text-[10px] outline-none focus:border-[#7eb8ed] sm:w-[200px]"
          />
        </div>

        {selectedTags.length > 0 && (
          <div className="mb-2 flex items-center gap-3 border border-[#dce5ef] bg-[#f7fbff] px-3 py-2 text-[11px]">
            <span>{selectedTags.length} tag dipilih</span>

            <button
              type="button"
              onClick={deleteSelectedTags}
              className="border border-[#dedede] bg-white px-3 py-1 text-[#c0392b] hover:bg-[#fff5f4]"
            >
              Hapus
            </button>

            <button
              type="button"
              onClick={() => setSelectedTags([])}
              className="text-[#64748b] hover:underline"
            >
              Batalkan pilihan
            </button>
          </div>
        )}

        <div className="overflow-x-auto border border-[#dedede]">
          <table className="w-full min-w-[720px] border-collapse text-left text-[10px]">
            <thead className="bg-[#fbfbfb]">
              <tr>
                <th className="w-[32px] border-b border-[#dedede] px-2 py-[9px]">
                  <input
                    type="checkbox"
                    aria-label="Pilih semua tag"
                    checked={allVisibleSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                    className="accent-blue-600"
                  />
                </th>

                <th className="border-b border-[#dedede] px-3 py-[9px] font-semibold">
                  Nama tag <span className="text-[#68737d]">↕</span>
                </th>

                <th className="border-b border-[#dedede] px-3 py-[9px] font-semibold">
                  Penjualan <span className="text-[#68737d]">↕</span>
                </th>

                <th className="border-b border-[#dedede] px-3 py-[9px] font-semibold">
                  Pembelian <span className="text-[#68737d]">↕</span>
                </th>

                <th className="border-b border-[#dedede] px-3 py-[9px] font-semibold">
                  Biaya <span className="text-[#68737d]">↕</span>
                </th>

                <th className="border-b border-[#dedede] px-3 py-[9px] font-semibold">
                  Lainnya <span className="text-[#68737d]">↕</span>
                </th>

                <th className="w-[38px] border-b border-[#dedede] px-2 py-[9px]" />
              </tr>
            </thead>

            <tbody>
              {visibleTags.length > 0 ? (
                visibleTags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="border-b border-[#e1e4e8] px-2 py-[9px]">
                      <input
                        type="checkbox"
                        aria-label={`Pilih tag ${tag.name}`}
                        checked={selectedTags.includes(tag.id)}
                        onChange={(event) =>
                          toggleTag(tag.id, event.target.checked)
                        }
                        className="accent-blue-600"
                      />
                    </td>

                    <td className="border-b border-[#e1e4e8] px-3 py-[9px] text-[#1557a3]">
                      {tag.name}
                    </td>

                    <td className="border-b border-[#e1e4e8] px-3 py-[9px] text-[#95a0aa]">
                      -
                    </td>

                    <td className="border-b border-[#e1e4e8] px-3 py-[9px] text-[#95a0aa]">
                      -
                    </td>

                    <td className="border-b border-[#e1e4e8] px-3 py-[9px] text-[#95a0aa]">
                      -
                    </td>

                    <td className="border-b border-[#e1e4e8] px-3 py-[9px] text-[#95a0aa]">
                      -
                    </td>

                    <td className="px-1 py-[4px] text-center">
                      <button
                        type="button"
                        aria-label={`Menu tag ${tag.name}`}
                        aria-expanded={openMenu?.id === tag.id}
                        onClick={(event) => openTagMenu(event, tag)}
                        className="h-[28px] w-[25px] text-[18px] leading-none text-[#64748b] hover:bg-[#f1f5f9]"
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="h-[290px]">
                    {search ? (
                      <div className="py-16 text-center text-[11px] text-[#9ba3aa]">
                        Tag tidak ditemukan
                      </div>
                    ) : (
                      <div className="flex min-h-[280px] flex-wrap items-center justify-center gap-8 px-4 py-6">
                        <EmptyTagIllustration />

                        <div className="text-center sm:text-left">
                          <strong className="block text-[10px] text-[#263238]">
                            Belum ada tag di kategori ini
                          </strong>

                          <p className="mb-0 mt-1 text-[10px] text-[#718096]">
                            Untuk menambahkan tag, klik tombol "Buat tag".
                          </p>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredTags.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 py-2 text-[10px] text-[#718096]">
            <span>
              Tampilkan{" "}
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(event.target.value);
                  setCurrentPage(1);
                }}
                className="mx-1 h-[25px] border border-[#d9dde2] bg-white px-2"
                aria-label="Jumlah baris"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              dari {filteredTags.length} baris
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-1 disabled:opacity-40"
              >
                |‹
              </button>

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="px-1 disabled:opacity-40"
              >
                ‹
              </button>

              <span className="border border-[#d9dde2] px-3 py-1">
                {currentPage}
              </span>

              <span>dari {totalPages}</span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="px-1 disabled:opacity-40"
              >
                ›
              </button>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-1 disabled:opacity-40"
              >
                ›|
              </button>
            </div>
          </div>
        )}

        {message && (
          <p role="status" className="mt-2 text-[10px] text-[#526b80]">
            {message}
          </p>
        )}
      </main>

      {openMenu &&
        currentMenuTag &&
        createPortal(
          <div
            className={`tag-detail-portal fixed z-[9999] min-w-[165px] rounded-[3px] border border-[#d9dde2] bg-white py-1 text-left shadow-xl ${
              isDark ? "tag-detail-portal-dark" : ""
            }`}
            style={{
              top: openMenu.top,
              left: openMenu.left,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => openMoveModal(currentMenuTag)}
              className="block w-full px-3 py-[10px] text-left text-[11px] text-[#344252] hover:bg-[#f1f5f9]"
            >
              Pindahkan tag
            </button>

            <button
              type="button"
              onClick={() => archiveTag(currentMenuTag.id)}
              className="block w-full px-3 py-[10px] text-left text-[11px] text-[#344252] hover:bg-[#f1f5f9]"
            >
              Arsipkan tag
            </button>
          </div>,
          document.body,
        )}

      {showTagForm && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-4 pt-[64px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowTagForm(false);
              setTagName("");
            }
          }}
        >
          <form
            onSubmit={(event) => createTag(event, false)}
            className={`tag-detail-modal w-full max-w-[400px] border border-[#dedede] bg-white px-[17px] pb-[20px] pt-[8px] shadow-xl ${
              isDark ? "tag-detail-modal-dark" : ""
            }`}
          >
            <div className="mb-[5px] flex items-center justify-between gap-3">
              <label
                htmlFor="custom-tag-name"
                className="text-[11px] font-semibold text-[#334155]"
              >
                Nama tag
              </label>

              <span className="text-[10px] text-[#94a3b8]">
                {tagName.length}/250
              </span>
            </div>

            <input
              id="custom-tag-name"
              autoFocus
              required
              maxLength={250}
              value={tagName}
              onChange={(event) => setTagName(event.target.value)}
              placeholder="Nama"
              className="h-[26px] w-full border border-[#00b879] px-[9px] text-[11px] outline-none focus:border-[#00a86b]"
            />

            <label
              htmlFor="custom-tag-category"
              className="mb-[5px] mt-[15px] block text-[11px] font-semibold text-[#334155]"
            >
              Masukkan ke kategori
            </label>

            <select
              id="custom-tag-category"
              value={category.name}
              disabled
              className="h-[26px] w-full border border-[#dedede] bg-[#f8f9fa] px-[9px] text-[10px]"
            >
              <option value={category.name}>{category.name}</option>
            </select>

            <div className="mt-[26px] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowTagForm(false);
                  setTagName("");
                }}
                className="h-[28px] px-[12px] text-[10px] text-[#64748b] hover:bg-[#f8fafc]"
              >
                Batalkan
              </button>

              <div className="flex gap-[9px]">
                <button
                  type="button"
                  disabled={!tagName.trim()}
                  onClick={(event) => createTag(event, true)}
                  className="h-[28px] border border-[#dedede] bg-white px-[12px] text-[10px] text-[#555] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buat dan baru
                </button>

                <button
                  type="submit"
                  className="h-[28px] rounded-[2px] bg-[#006fc9] px-[14px] text-[10px] font-semibold text-white hover:bg-[#005eab]"
                >
                  Buat
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {movingTagId !== null && (
        <div
          className="fixed inset-0 z-[1010] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-4 pt-[90px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMoveModal();
          }}
        >
          <form
            onSubmit={moveTag}
            className={`tag-detail-modal w-full max-w-[400px] border border-[#dedede] bg-white p-[18px] shadow-xl ${
              isDark ? "tag-detail-modal-dark" : ""
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="m-0 text-[14px] font-semibold text-[#263238]">
                Pindahkan tag
              </h2>

              <button
                type="button"
                onClick={closeMoveModal}
                className="text-[21px] text-[#64748b]"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <label
              htmlFor="move-tag-category"
              className="mb-2 block text-[11px] font-semibold text-[#334155]"
            >
              Masukkan ke kategori
            </label>

            <select
              id="move-tag-category"
              value={moveCategory}
              onChange={(event) => setMoveCategory(event.target.value)}
              className="h-[34px] w-full border border-[#d9dde2] bg-white px-2 text-[11px] outline-none focus:border-[#7eb8ed]"
            >
              {moveOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeMoveModal}
                className="h-[32px] border border-[#dedede] px-3 text-[11px] text-[#64748b]"
              >
                Batalkan
              </button>

              <button
                type="submit"
                className="h-[32px] bg-[#006fc9] px-4 text-[11px] font-semibold text-white hover:bg-[#005eab]"
              >
                Pindahkan
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDeleteConfirm(false);
            }
          }}
        >
          <div
            className={`tag-detail-modal w-full max-w-[350px] border border-[#dedede] bg-white p-5 shadow-xl ${
              isDark ? "tag-detail-modal-dark" : ""
            }`}
          >
            <h2 className="m-0 text-[14px] font-semibold text-[#263238]">
              Hapus kategori?
            </h2>

            <p className="mt-3 text-[11px] text-[#64748b]">
              Kategori "{category.name}" akan dihapus. Tag di kategori ini akan
              dipindahkan ke Belum di-assign.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-[#dedede] px-3 py-2 text-[11px]"
              >
                Batalkan
              </button>

              <button
                type="button"
                onClick={deleteCategory}
                className="bg-[#df3e24] px-3 py-2 text-[11px] text-white"
              >
                Hapus kategori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
