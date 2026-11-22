import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash,
  UserPlus,
  Camera,
  X,
} from "@phosphor-icons/react";
import api from "@/services/settingsApi";
import { canAccessSettings } from "@/services/settingsAccess";
import {
  btnPrimary,
  btnSecondary,
  btnDangerOutline,
  btnModalCancel,
  btnModalSubmit,
  btnModalDelete,
  statCard,
  statLabel,
  tableCard,
  tableWrapper,
  tableBase,
  th,
  td,
  trHover,
  modalOverlay,
  modalPanel,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalFooter,
  formGroup,
  formLabel,
  formRequiredMark,
  inputBase,
  pageSpinner,
  buttonSpinner,
} from "@/components/ui/styles";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
};

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAgent, setEditAgent] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fileInputRef = useRef(null);

  // =========================
  // GET AGENTS
  // =========================
  const fetchAgents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/settings/agents/");

      const data = response.data;

      // Support response array maupun pagination
      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        setAgents(data?.results || []);
      }
    } catch (error) {
      console.error("Fetch agents error:", error);
      alert(
        error.response?.data?.detail ||
        "Gagal mengambil data agen."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // OPEN CREATE
  // =========================
  const openCreate = () => {
    setEditAgent(null);
    setForm(emptyForm);
    setAvatarFile(null);
    setAvatarPreview(null);
    setDialogOpen(true);
  };

  // =========================
  // OPEN EDIT
  // =========================
  const openEdit = (agent) => {
    setEditAgent(agent);

    setForm({
      username: agent.username || "",
      email: agent.email || "",
      password: "",
      first_name: agent.first_name || "",
      last_name: agent.last_name || "",
      phone: agent.phone || "",
    });

    setAvatarFile(null);
    setAvatarPreview(agent.avatar_url || null);
    setDialogOpen(true);
  };

  // =========================
  // AVATAR
  // =========================
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // =========================
  // SUBMIT CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLoading) return;

    // Validasi create
    if (!editAgent && form.password.length < 8) {
      alert("Kata sandi minimal 8 karakter.");
      return;
    }

    if (!form.username.trim()) {
      alert("Nama pengguna wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      alert("Email wajib diisi.");
      return;
    }

    try {
      setSubmitLoading(true);

      const formData = new FormData();

      formData.append("username", form.username.trim());
      formData.append("email", form.email.trim());
      formData.append("first_name", form.first_name.trim());
      formData.append("last_name", form.last_name.trim());
      formData.append("phone", form.phone.trim());

      if (!editAgent) {
        formData.append("password", form.password);
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      let response;

      if (editAgent) {
        response = await api.put(
          `/settings/agents/${editAgent.id}/`,
          formData
        );

        alert("Agen berhasil diperbarui.");
      } else {
        response = await api.post(
          "/settings/agents/",
          formData
        );

        alert("Agen berhasil dibuat.");
      }

      console.log("Agent response:", response.data);

      setDialogOpen(false);
      setForm(emptyForm);
      setEditAgent(null);
      setAvatarFile(null);
      setAvatarPreview(null);

      await fetchAgents();
    } catch (error) {
      console.error("Agent submit error:", error);
      console.error(
        "Server response:",
        error.response?.data
      );

      const data = error.response?.data;

      let message = "Gagal menyimpan data agen.";

      if (data?.detail) {
        message = data.detail;
      } else if (
        data &&
        typeof data === "object"
      ) {
        const firstError = Object.values(data)[0];

        if (Array.isArray(firstError)) {
          message = firstError[0];
        } else if (typeof firstError === "string") {
          message = firstError;
        }
      }

      alert(String(message));
    } finally {
      setSubmitLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async () => {
    if (!deleteId || deleteLoading) return;

    try {
      setDeleteLoading(true);

      await api.delete(`/settings/agents/${deleteId}/`);

      alert("Agen berhasil dihapus.");

      setDeleteId(null);

      await fetchAgents();
    } catch (error) {
      console.error("Delete agent error:", error);

      alert(
        error.response?.data?.detail ||
        "Gagal menghapus agen."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================
  // AVATAR FALLBACK
  // =========================
  const getInitial = (agent) => {
    const name =
      `${agent.first_name || ""} ${agent.last_name || ""
        }`.trim();

    return (
      name.charAt(0) ||
      agent.username?.charAt(0) ||
      "A"
    ).toUpperCase();
  };

  // RENDER
  return (
    <div className="mx-auto max-w-[1400px] p-6 max-md:p-4">

      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 max-md:items-stretch">
        <div className="flex items-center gap-3.5">
          <div>
            <h1 className="m-0 text-[28px] font-bold text-gray-900 max-md:text-2xl">
              Agen
            </h1>
            <p className="m-0 text-sm text-slate-500">
              Kelola data agen anda.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="ang-btn max-md:w-full max-md:justify-center"
          onClick={openCreate}
          disabled={!canAccessSettings("agents", "create")}
        >
          <Plus size={18} />
          Tambah Agen
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-3 gap-4 max-md:grid-cols-1">

        <div className={`${statCard} company-card`}>
          <span className={statLabel}>Total Agen</span>
          <strong className="text-[28px] text-gray-900">{agents.length}</strong>
        </div>

        <div className={`${statCard} company-card`}>
          <span className={statLabel}>Manajer</span>
          <strong className="text-[28px] text-gray-900">
            {
              agents.filter(
                (agent) =>
                  agent.role === "MANAGER"
              ).length
            }
          </strong>
        </div>

        <div className={`${statCard} company-card`}>
          <span className={statLabel}>Agen</span>
          <strong className="text-[28px] text-gray-900">
            {
              agents.filter(
                (agent) =>
                  agent.role === "AGENT"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* TABLE CARD */}
      <div className={`${tableCard} company-card`}>
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2.5 p-10 text-slate-500">
            <div className={`${pageSpinner} h-[22px] w-[22px]`} />
            <p className="m-0">Memuat agen...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2.5 p-10 text-slate-500">
            <UserPlus size={40} />

            <h2 className="m-0 text-xl text-gray-900">
              Belum ada agen
            </h2>

            <p className="m-0 mb-2">
              Klik Tambah Agen untuk menambahkan agen.
            </p>

            <button
              type="button"
              className="ang-btn"
              onClick={openCreate}
              disabled={!canAccessSettings("agents", "create")}
            >
              <Plus size={18} />
              Tambah Agen
            </button>
          </div>
        ) : (
          <div className={tableWrapper}>
            <table className={`${tableBase} min-w-[760px]`}>
              <thead>
                <tr>
                  <th className={`${th} text-center`}>Agen</th>
                  <th className={`${th} text-center`}>Email</th>
                  <th className={`${th} text-center`}>Telepon</th>
                  <th className={`${th} text-center`}>Peran</th>
                  <th className={`${th} text-center`}>Tindakan</th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id} className={trHover}>

                    {/* AGENT */}
                    <td className={td}>
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700">
                          {agent.avatar_url ? (
                            <img
                              src={agent.avatar_url}
                              alt={
                                agent.username ||
                                "Agen"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>
                              {getInitial(agent)}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold text-gray-900">
                            {agent.first_name || ""}{" "}
                            {agent.last_name || ""}
                          </div>

                          <div className="mt-[3px] text-xs text-slate-400">
                            @{agent.username}
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className={`${td} text-center`}>{agent.email}</td>

                    {/* PHONE */}
                    <td className={`${td} text-center`}>{agent.phone || "-"}</td>

                    {/* ROLE */}
                    <td className={`${td} text-center`}>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-[5px] text-xs font-semibold ${agent.role === "MANAGER"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {agent.role}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className={`${td} text-center`}>
                      <div className="flex items-center gap-3.5 max-md:flex-col max-md:items-stretch">

                        <button
                          type="button"
                          className="Btn"
                          disabled={!canAccessSettings("agents", "edit")}
                          onClick={() => openEdit(agent)}
                        >
                          Edit
                          <svg className="svg" viewBox="0 0 512 512">
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="BtnDanger"
                          disabled={!canAccessSettings("agents", "delete")}
                          onClick={() => setDeleteId(agent.id)}
                        >
                          Hapus
                          <svg className="svg" viewBox="0 0 448 512">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      {dialogOpen && (
        <div
          className={modalOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              if (!submitLoading) {
                setDialogOpen(false);
              }
            }
          }}
        >
          <div className={`${modalPanel} max-w-[520px]`}>

            <div className={modalHeader}>
              <h2 className={modalTitle}>
                {editAgent
                  ? "Ubah Agen"
                  : "Tambah Agen"}
              </h2>

              <button
                type="button"
                className={modalCloseButton}
                onClick={() => {
                  if (!submitLoading) {
                    setDialogOpen(false);
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="max-h-[65vh] overflow-y-auto p-[22px] max-md:max-h-[60vh]">

                {/* AVATAR */}
                <div className="mb-[22px] flex flex-col items-center gap-3">

                  <div className="flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[30px] font-semibold text-slate-500 ring-4 ring-white dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-800">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Pratinjau foto profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>
                        {getInitial({
                          first_name:
                            form.first_name,
                          last_name:
                            form.last_name,
                          username:
                            form.username,
                        })}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-[7px] rounded-[7px] border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-700 transition-colors hover:bg-slate-50"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <Camera size={16} />
                    Unggah Foto Profil
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />

                </div>

                {/* USERNAME */}
                <div className={formGroup}>
                  <label className={formLabel}>
                    Nama pengguna
                    <span className={formRequiredMark}>*</span>
                  </label>

                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Masukkan nama pengguna"
                    disabled={!!editAgent}
                    className={inputBase}
                  />
                </div>

                {/* EMAIL */}
                <div className={formGroup}>
                  <label className={formLabel}>
                    Email
                    <span className={formRequiredMark}>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="agen@contoh.com"
                    className={inputBase}
                  />
                </div>

                {/* PASSWORD */}
                {!editAgent && (
                  <div className={formGroup}>
                    <label className={formLabel}>
                      Kata sandi
                      <span className={formRequiredMark}>*</span>
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimal 8 karakter"
                      className={inputBase}
                    />

                    <small className="mt-[5px] block text-xs text-slate-500">
                      Kata sandi minimal 8 karakter.
                    </small>
                  </div>
                )}

                {/* FIRST NAME */}
                <div className={formGroup}>
                  <label className={formLabel}>Nama Depan</label>

                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="Nama depan"
                    className={inputBase}
                  />
                </div>

                {/* LAST NAME */}
                <div className={formGroup}>
                  <label className={formLabel}>Nama Belakang</label>

                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Nama belakang"
                    className={inputBase}
                  />
                </div>

                {/* PHONE */}
                <div className={formGroup}>
                  <label className={formLabel}>Telepon</label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className={inputBase}
                  />
                </div>

              </div>

              <div className={modalFooter}>

                <button
                  type="button"
                  className={btnModalCancel}
                  onClick={() => {
                    if (!submitLoading) {
                      setDialogOpen(false);
                    }
                  }}
                  disabled={submitLoading}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <span className={buttonSpinner} />
                      Menyimpan...
                    </>
                  ) : (
                    editAgent
                      ? "Perbarui"
                      : "Buat"
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}
      {deleteId && (
        <div className={modalOverlay}>
          <div className={`${modalPanel} max-w-[420px]`}>

            <div className={modalHeader}>
              <h2 className={modalTitle}>Hapus Agen?</h2>
            </div>

            <div className="p-[22px]">
              <p className="m-0 text-slate-600">
                Apakah Anda yakin ingin menghapus agen ini?
              </p>
            </div>

            <div className={modalFooter}>

              <button
                type="button"
                className={btnModalCancel}
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleteLoading}
              >
                Batal
              </button>

              <button
                type="button"
                className={btnModalDelete}
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className={buttonSpinner} />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash size={16} />
                    Hapus
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}