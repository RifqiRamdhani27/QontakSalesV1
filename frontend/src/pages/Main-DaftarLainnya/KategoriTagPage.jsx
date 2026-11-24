import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function loadTags() {
  return readStorage(TAG_STORAGE_KEY).map((tag) => ({
    ...tag,
    category: tag.category || tag.group || "Belum di-assign",
  }));
}

function loadCategories() {
  return readStorage(CATEGORY_STORAGE_KEY);
}

export default function KategoriTagPage() {
  const navigate = useNavigate();

  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("app_theme") || "light",
  );

  const isDark = themeMode === "dark";

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

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(loadTags);
  const [categories, setCategories] = useState(loadCategories);

  const [showTagForm, setShowTagForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [tagName, setTagName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  const defaultGroups = [
    { id: "Belum di-assign", title: "Belum di-assign" },
    { id: "Arsip", title: "Arsip" },
  ];

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

  const filteredTags = useMemo(
    () =>
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [tags, search],
  );

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [categories, search],
  );

  const visibleGroups = defaultGroups.filter((group) => {
    const matchesName = group.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesTag = filteredTags.some((tag) => tag.category === group.id);

    return search.trim() === "" || matchesName || matchesTag;
  });

  const createTag = (event, createAnother = false) => {
    event.preventDefault();

    const name = tagName.trim();
    if (!name) return;

    const newTag = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      category: "Belum di-assign",
    };

    setTags((previous) => [...previous, newTag]);
    setTagName("");
    setMessage("Tag berhasil ditambahkan ke Belum di-assign.");

    if (!createAnother) {
      setShowTagForm(false);
    }
  };

  const createCategory = (event) => {
    event.preventDefault();

    const name = categoryName.trim();

    if (name.length < 2) return;

    const duplicate = categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      setMessage("Nama kategori tersebut sudah ada.");
      return;
    }

    const newCategory = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
    };

    setCategories((previous) => [...previous, newCategory]);
    setCategoryName("");
    setShowCategoryForm(false);
    setMessage("Kategori berhasil ditambahkan.");
  };

  const closeTagForm = () => {
    setShowTagForm(false);
    setTagName("");
  };

  const openTagForm = () => {
    setMessage("");
    setTagName("");
    setShowTagForm(true);
  };

  const openCategoryForm = () => {
    setMessage("");
    setCategoryName("");
    setShowCategoryForm(true);
  };

  const cancelCategoryForm = () => {
    setCategoryName("");
    setShowCategoryForm(false);
  };

  const openCategoryDetail = (category) => {
    navigate(`/kategori-tag/custom/${category.id}`);
  };

  const handleViewAllTags = (groupId) => {
    if (groupId === "Belum di-assign") {
      navigate("/kategori-tag/ungrouped");
    } else if (groupId === "Arsip") {
      navigate("/kategori-tag/archived");
    }
  };

  return (
    <div
      className={`kategori-tag-root dlsk-page -m-4 min-h-screen md:-m-6 ${
        isDark ? "dash-dark dlsk-dark" : ""
      }`}
    >
      <style>{`
        .kategori-tag-root {
          background: #eef1f6;
          color: #243247;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .kategori-tag-root.dash-dark {
          background: #121212 !important;
          color: #e5e7eb !important;
        }

        .kategori-tag-root.dash-dark main,
        .kategori-tag-root.dash-dark article,
        .kategori-tag-root.dash-dark form {
          background-color: #1e1e1e !important;
          border-color: #3f3f46 !important;
          color: #e5e7eb !important;
        }

        .kategori-tag-root.dash-dark h1,
        .kategori-tag-root.dash-dark h2,
        .kategori-tag-root.dash-dark h3,
        .kategori-tag-root.dash-dark p,
        .kategori-tag-root.dash-dark label,
        .kategori-tag-root.dash-dark span {
          color: #e5e7eb;
        }

        .kategori-tag-root.dash-dark input,
        .kategori-tag-root.dash-dark select {
          background-color: #292929 !important;
          border-color: #52525b !important;
          color: #f1f5f9 !important;
        }

        .kategori-tag-root.dash-dark input::placeholder {
          color: #9ca3af !important;
        }

        .kategori-tag-root.dash-dark input:focus,
        .kategori-tag-root.dash-dark select:focus {
          border-color: #c9a15b !important;
        }

        .kategori-tag-root.dash-dark article span {
          background-color: #374151 !important;
          color: #e5e7eb !important;
        }

        .kategori-tag-root.dash-dark button[class*="bg-white"] {
          background-color: #252525 !important;
          border-color: #52525b !important;
          color: #c9a15b !important;
        }

        .kategori-tag-root.dash-dark button[class*="bg-white"]:hover {
          background-color: #333333 !important;
        }

        .kategori-tag-root.dash-dark button[class*="bg-[#006fc9]"],
        .kategori-tag-root.dash-dark button[class*="bg-[#006fc9]"]:disabled {
          background-color: #a98243 !important;
          border-color: #a98243 !important;
          color: #ffffff !important;
        }

        .kategori-tag-root.dash-dark button[class*="bg-[#006fc9]"]:hover:not(:disabled),
        .kategori-tag-root.dash-dark button[class*="hover:bg-[#005eab]"]:hover:not(:disabled),
        .kategori-tag-root.dash-dark button[class*="enabled:hover:bg-[#005eab]"]:hover:not(:disabled) {
          background-color: #8f6d36 !important;
          border-color: #8f6d36 !important;
          color: #ffffff !important;
        }

        .kategori-tag-root.dash-dark button[class*="text-[#006fc9]"] {
          color: #c9a15b !important;
        }

        .kategori-tag-root.dash-dark button[class*="border-[#8fc8f5]"] {
          background-color: #252525 !important;
          border-color: #a98243 !important;
          color: #c9a15b !important;
        }

        .kategori-tag-root.dash-dark button[class*="border-[#8fc8f5]"]:hover {
          background-color: #333333 !important;
        }

        .kategori-tag-root.dash-dark button[class*="text-[#64748b]"],
        .kategori-tag-root.dash-dark button[class*="text-[#344054]"] {
          color: #cbd5e1 !important;
        }

        .kategori-tag-root.dash-dark .tag-modal-overlay {
          background-color: rgba(0, 0, 0, 0.75) !important;
        }

        .kategori-tag-root.dash-dark .tag-modal-select {
          background-color: #292929 !important;
          border-color: #52525b !important;
          color: #e5e7eb !important;
        }

        .kategori-tag-root.dash-dark .tag-message {
          border-color: #3f3f46 !important;
          color: #cbd5e1 !important;
        }
      `}</style>

      <div className="px-[26px] pb-8 pt-[25px]">
        <header className="mb-[21px] flex items-center justify-between gap-4">
          <div>
            <p className="m-0 text-[11px] leading-[17px] text-[#64748b]">
              Daftar Lainnya
            </p>
            <h1 className="m-0 text-[20px] font-bold leading-[26px] text-[#202938]">
              Kategori Tag
            </h1>
          </div>

          <button
            type="button"
            onClick={openTagForm}
            className="flex h-[34px] shrink-0 items-center justify-center rounded-[2px] bg-[#006fc9] px-[15px] text-[11px] font-semibold text-white hover:bg-[#005eab]"
          >
            Buat tag
          </button>
        </header>

        <main className="min-h-[calc(100vh-205px)] border border-[#edf0f4] bg-white px-4 pb-8 pt-[11px]">
          <section>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="m-0 text-[11px] font-bold leading-[17px] text-[#263b53]">
                  Kategori default
                </h2>
                <p className="mb-0 mt-[7px] text-[10px] leading-[15px] text-[#64748b]">
                  Menampilkan kategori tag yang belum di-assign atau diarsipkan.
                </p>
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kategori atau tag..."
                aria-label="Cari kategori atau tag"
                className="h-[28px] w-full border border-[#d7dce2] bg-white px-[9px] text-[10px] outline-none focus:border-[#7eb8ed] sm:w-[210px]"
              />
            </div>

            <div className="mt-[22px] flex flex-wrap items-start gap-[17px]">
              {visibleGroups.map((group) => {
                const groupTags = tags.filter(
                  (tag) => tag.category === group.id,
                );

                return (
                  <article
                    key={group.id}
                    className="flex h-[126px] w-[196px] shrink-0 flex-col border border-[#dedede] bg-white px-[12px] pb-[11px] pt-[12px]"
                  >
                    <h3 className="m-0 text-[10px] font-semibold leading-[15px] text-[#27394e]">
                      {group.title}
                    </h3>

                    <p className="mb-0 mt-[3px] text-[10px] leading-[13px] text-[#9aa3ae]">
                      {groupTags.length} tags
                    </p>

                    {group.id === "Belum di-assign" && (
                      <div className="mt-[7px] flex flex-wrap gap-[3px] overflow-hidden">
                        {groupTags.map((tag) => (
                          <span
                            key={tag.id}
                            title={tag.name}
                            className="inline-flex h-[17px] max-w-full items-center rounded-[2px] bg-[#e5e7eb] px-[5px] text-[9px] font-medium text-[#374151]"
                          >
                            <span className="truncate">{tag.name}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleViewAllTags(group.id)}
                      className="mt-auto self-end text-[10px] leading-[14px] text-[#006fc9] hover:underline"
                    >
                      Lihat semua tag
                    </button>
                  </article>
                );
              })}

              {visibleGroups.length === 0 && (
                <p className="m-0 text-[11px] text-slate-400">
                  Kategori atau tag tidak ditemukan.
                </p>
              )}
            </div>
          </section>

          <section className="mt-[27px]">
            <h2 className="m-0 text-[11px] font-bold leading-[17px] text-[#263b53]">
              Kategori custom
            </h2>

            <p className="mb-0 mt-[7px] text-[10px] leading-[15px] text-[#64748b]">
              Menampilkan kategori yang Anda buat sesuai kebutuhan.
            </p>

            <div className="mt-[22px] flex flex-wrap items-start gap-[17px]">
              <button
                type="button"
                onClick={openCategoryForm}
                className="flex h-[120px] w-[187px] shrink-0 flex-col items-center justify-center border border-dotted border-[#8fc8f5] bg-white text-[#006fc9] hover:bg-[#f8fcff]"
              >
                <span className="mb-[2px] text-[19px] leading-[20px]">+</span>
                <span className="text-[10px] leading-[15px]">
                  Buat kategori
                </span>
              </button>

              {showCategoryForm && (
                <form
                  onSubmit={createCategory}
                  className="flex h-[120px] w-[187px] shrink-0 flex-col border border-[#1685dc] bg-white px-[11px] pb-[10px] pt-[10px]"
                >
                  <div className="flex justify-end text-[10px] leading-[12px] text-[#344054]">
                    {categoryName.length}/50
                  </div>

                  <input
                    autoFocus
                    required
                    type="text"
                    maxLength={50}
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    placeholder="Nama"
                    aria-label="Nama kategori"
                    className="mt-[5px] h-[24px] w-full border border-[#00b879] px-[7px] text-[10px] outline-none focus:border-[#00a86b]"
                  />

                  <p className="m-0 mt-[3px] text-[9px] leading-[12px] text-[#9aa3ae]">
                    Isi nama minimal 2 karakter
                  </p>

                  <div className="mt-auto flex items-center justify-end gap-[7px]">
                    <button
                      type="button"
                      onClick={cancelCategoryForm}
                      className="h-[27px] px-[7px] text-[10px] text-[#344054] hover:bg-[#f8fafc]"
                    >
                      Batalkan
                    </button>

                    <button
                      type="submit"
                      disabled={categoryName.trim().length < 2}
                      className="h-[27px] bg-[#006fc9] px-[11px] text-[10px] font-semibold text-white enabled:hover:bg-[#005eab] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              )}

              {filteredCategories.map((category) => {
                const count = tags.filter(
                  (tag) => tag.category === category.name,
                ).length;

                return (
                  <article
                    key={category.id}
                    className="flex h-[120px] w-[187px] shrink-0 flex-col border border-[#dedede] bg-white px-[12px] pb-[10px] pt-[12px]"
                  >
                    <h3 className="m-0 truncate text-[10px] font-semibold text-[#27394e]">
                      {category.name}
                    </h3>

                    <p className="mb-0 mt-[7px] text-[10px] text-[#9aa3ae]">
                      {count} tags
                    </p>

                    <button
                      type="button"
                      onClick={() => openCategoryDetail(category)}
                      className="mt-auto self-end text-[10px] text-[#006fc9] hover:underline"
                    >
                      Lihat semua tag
                    </button>
                  </article>
                );
              })}
            </div>

            {search &&
              filteredCategories.length === 0 &&
              categories.length > 0 && (
                <p className="mb-0 mt-3 text-[10px] text-slate-400">
                  Tidak ada kategori custom yang cocok dengan pencarian.
                </p>
              )}
          </section>

          {message && (
            <div
              role="status"
              className="tag-message mt-5 border-t border-[#e5e7eb] pt-3 text-[10px] text-[#526b80]"
            >
              {message}
            </div>
          )}
        </main>
      </div>

      {showTagForm && (
        <div
          className="tag-modal-overlay fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-4 pt-[64px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeTagForm();
          }}
        >
          <form
            onSubmit={(event) => createTag(event, false)}
            className="w-full max-w-[400px] border border-[#dedede] bg-white px-[17px] pb-[20px] pt-[8px] shadow-xl"
          >
            <div className="mb-[5px] flex items-center justify-between gap-3">
              <label
                htmlFor="category-tag-name"
                className="block text-[11px] font-semibold text-[#334155]"
              >
                Nama tag
              </label>
              <span className="text-[10px] text-[#94a3b8]">
                {tagName.length}/250
              </span>
            </div>

            <input
              id="category-tag-name"
              autoFocus
              required
              maxLength={250}
              value={tagName}
              onChange={(event) => setTagName(event.target.value)}
              placeholder="Nama"
              className="h-[26px] w-full border border-[#00b879] px-[9px] text-[11px] outline-none focus:border-[#00a86b]"
            />

            <label
              htmlFor="tag-group"
              className="mb-[5px] mt-[15px] block text-[11px] font-semibold text-[#334155]"
            >
              Masukkan ke kategori
            </label>

            <select
              id="tag-group"
              value="Belum di-assign"
              disabled
              className="tag-modal-select h-[26px] w-full border border-[#dedede] bg-[#f8f9fa] px-[9px] text-[10px] outline-none"
            >
              <option value="Belum di-assign">Belum di-assign</option>
            </select>

            <div className="mt-[26px] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={closeTagForm}
                className="h-[28px] px-[12px] text-[10px] text-[#64748b] hover:bg-[#f8fafc]"
              >
                Batalkan
              </button>

              <div className="flex gap-[9px]">
                <button
                  type="button"
                  onClick={(event) => createTag(event, true)}
                  disabled={!tagName.trim()}
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
    </div>
  );
}
