import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import XLSXStyle from "xlsx-js-style";
import {
  Box, Flex, Text, Button, Input, Select, Badge,
  HStack, VStack, Spinner, IconButton,
  Table, Dialog, Field, createListCollection,
} from "@chakra-ui/react";
import {
  MagnifyingGlass, Plus, PencilSimple, Trash, X, FloppyDisk, BookOpen, LockKey,
  List, FileXls, UploadSimple, User, CaretDown, Check,
} from "@phosphor-icons/react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/services/api";
import brandLogo from "@/assets/brand.png";


const LOGO_GOLD_FILTER =
  "brightness(0) saturate(100%) invert(78%) sepia(22%) saturate(1046%) hue-rotate(351deg) brightness(93%) contrast(91%)";
const KATEGORI_LIST = [
  "Cash & Bank",
  "Accounts Receivable (A/R)",
  "Inventory",
  "Other Current Assets",
  "Fixed Assets",
  "Depreciation & Amortization",
  "Other Assets",
  "Accounts Payable (A/P)",
  "Other Current Liabilities",
  "Long Term Liabilities",
  "Equity",
  "Income",
  "Cost of Sales",
  "Expenses",
  "Other Income",
  "Other Expense",
];

const KATEGORI_COLORS = {
  "Cash & Bank": { bg: "#DBEAFE", color: "#1D4ED8" },
  "Accounts Receivable (A/R)": { bg: "#D1FAE5", color: "#065F46" },
  "Inventory": { bg: "#FEF3C7", color: "#92400E" },
  "Other Current Assets": { bg: "#EDE9FE", color: "#5B21B6" },
  "Fixed Assets": { bg: "#FCE7F3", color: "#9D174D" },
  "Depreciation & Amortization": { bg: "#FEE2E2", color: "#991B1B" },
  "Other Assets": { bg: "#E0F2FE", color: "#0369A1" },
  "Accounts Payable (A/P)": { bg: "#FEF9C3", color: "#713F12" },
  "Other Current Liabilities": { bg: "#FFE4E6", color: "#9F1239" },
  "Long Term Liabilities": { bg: "#F1F5F9", color: "#334155" },
  "Equity": { bg: "#DCFCE7", color: "#166534" },
  "Income": { bg: "#CFFAFE", color: "#155E75" },
  "Cost of Sales": { bg: "#FFF7ED", color: "#9A3412" },
  "Expenses": { bg: "#F3E8FF", color: "#6B21A8" },
  "Other Income": { bg: "#D1FAE5", color: "#047857" },
  "Other Expense": { bg: "#FEE2E2", color: "#B91C1C" },
};

const ACCOUNT_ROUTES = {
  "1-10001": "kas",
  "1-10002": "rekening-bank",
  "1-10003": "giro",
  "1-10100": "piutang-usaha",
  "1-10101": "piutang-belum-ditagih",
  "1-10102": "cadangan-kerugian-piutang",
  "1-10200": "persediaan-barang",
  "1-10300": "piutang-lainnya",
  "1-10301": "piutang-karyawan",
  "1-10400": "dana-belum-disetor",
  "1-10401": "aset-lancar-lainnya",
  "1-10402": "biaya-dibayar-dimuka",
  "1-10403": "uang-muka",
  "1-10500": "ppn-masukan",
  "1-10501": "pph-22",
  "1-10502": "pph-23",
  "1-10503": "pph-25",
  "1-10700": "aset-tetap-tanah",
  "1-10701": "aset-tetap-bangunan",
  "1-10702": "aset-tetap-building-improvements",
  "1-10703": "aset-tetap-kendaraan",
  "1-10704": "aset-tetap-mesin-peralatan",
  "1-10705": "aset-tetap-perlengkapan-kantor",
  "1-10706": "aset-tetap-sewa-guna-usaha",
  "1-10707": "aset-tak-berwujud",
  "1-10751": "akumulasi-penyusutan-bangunan",
  "1-10752": "akumulasi-penyusutan-building-improvements",
  "1-10753": "akumulasi-penyusutan-kendaraan",
  "1-10754": "akumulasi-penyusutan-mesin-peralatan",
  "1-10755": "akumulasi-penyusutan-peralatan-kantor",
  "1-10756": "akumulasi-penyusutan-sewa-guna-usaha",
  "1-10757": "akumulasi-penyusutan-amortisasi",
  "1-10800": "investasi",
  "2-20100": "hutang-usaha",
  "2-20101": "hutang-belum-ditagih",
  "2-20200": "hutang-lain-lain",
  "2-20201": "hutang-gaji",
  "2-20202": "hutang-deviden",
  "2-20203": "pendapatan-diterima-dimuka",
  "2-20301": "sarana-kantor-terhutang",
  "2-20302": "bunga-terhutang",
  "2-20399": "biaya-terhutang-lainnya",
  "2-20400": "hutang-bank",
  "2-20500": "ppn-keluaran",
  "2-20501": "hutang-pajak-pph21",
  "2-20502": "hutang-pajak-pph22",
  "2-20503": "hutang-pajak-pph23",
  "2-20504": "hutang-pajak-pph29",
  "2-20599": "hutang-pajak-lainnya",
  "2-20600": "hutang-dari-pemegang-saham",
  "2-20601": "kewajiban-lancar-lainnya",
  "2-20700": "kewajiban-manfaat-karyawan",
  "3-30000": "modal-saham",
  "3-30001": "tambahan-modal-disetor",
  "3-30100": "laba-ditahan",
  "3-30200": "deviden",
  "3-30300": "pendapatan-komprehensif-lainnya",
  "3-30999": "equitas-saldo-awal",
  "4-40000": "pendapatan-jasa",
  "4-40100": "diskon-penjualan",
  "4-40200": "retur-penjualan",
  "4-40201": "pendapatan-belum-ditagih",
  "5-50000": "beban-pokok-pendapatan",
  "5-50100": "diskon-pembelian",
  "5-50200": "retur-pembelian",
  "5-50300": "pengiriman-pengangkutan",
  "5-50400": "biaya-impor",
  "5-50500": "biaya-produksi",
  "6-60000": "biaya-penjualan",
  "6-60001": "iklan-promosi",
  "6-60002": "komisi-fee",
  "6-60003": "bensin-tol-parkir-penjualan",
  "6-60004": "perjalanan-dinas-penjualan",
  "6-60005": "komunikasi-penjualan",
  "6-60006": "marketing-lainnya",
  "6-60100": "biaya-umum-administratif",
  "6-60101": "gaji",
  "6-60102": "upah",
  "6-60103": "makanan-transportasi",
  "6-60104": "lembur",
  "6-60105": "pengobatan",
  "6-60106": "thr-bonus",
  "6-60107": "jamsostek",
  "6-60108": "insentif",
  "6-60109": "pesangon",
  "6-60110": "manfaat-tunjangan-lain",
  "6-60200": "donasi",
  "6-60201": "hiburan",
  "6-60202": "bensin-tol-parkir-umum",
  "6-60203": "perbaikan-pemeliharaan",
  "6-60204": "perjalanan-dinas-umum",
  "6-60205": "makanan",
  "6-60206": "komunikasi-umum",
  "6-60207": "iuran-langganan",
  "6-60208": "asuransi",
  "6-60209": "legal-profesional",
  "6-60210": "beban-manfaat-karyawan",
  "6-60211": "sarana-kantor",
  "6-60212": "pelatihan-pengembangan",
  "6-60213": "beban-piutang-tak-tertagih",
  "6-60214": "pajak-perizinan",
  "6-60215": "denda",
  "6-60216": "pengeluaran-barang-rusak",
  "6-60300": "beban-kantor",
  "6-60301": "alat-tulis-kantor-printing",
  "6-60302": "bea-materai",
  "6-60303": "keamanan-kebersihan",
  "6-60304": "supplies-material",
  "6-60305": "pemborong",
  "6-60400": "biaya-sewa-bangunan",
  "6-60401": "biaya-sewa-kendaraan",
  "6-60402": "biaya-sewa-operasional",
  "6-60403": "biaya-sewa-lain-lain",
  "6-60500": "penyusutan-bangunan",
  "6-60501": "penyusutan-perbaikan-bangunan",
  "6-60502": "penyusutan-kendaraan",
  "6-60503": "penyusutan-mesin-peralatan",
  "6-60504": "penyusutan-peralatan-kantor",
  "6-60599": "penyusutan-aset-sewa-guna-usaha",
  "7-70000": "pendapatan-bunga-bank",
  "7-70001": "pendapatan-bunga-deposito",
  "7-70099": "pendapatan-lain-lain",
  "8-80000": "beban-bunga",
  "8-80001": "provisi",
  "8-80002": "laba-rugi-pelepasan-aset-tetap",
  "8-80100": "penyesuaian-persediaan",
  "8-80999": "beban-lain-lain",
  "9-90000": "beban-pajak-kini",
  "9-90001": "beban-pajak-tangguhan",
};

const getAccountPath = (kode) =>
  ACCOUNT_ROUTES[kode] ? `/isi-daftar-akun/${ACCOUNT_ROUTES[kode]}` : null;

const formatIDR = (value) => {
  const num = parseFloat(value) || 0;
  const absNum = Math.abs(num);
  const formatted = absNum.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return num < 0 ? `(${formatted})` : formatted;
};

function RoundCheckbox({ checked, onChange, title, isDark }) {
  const activeColor = isDark ? "#E5B85C" : "#0077CC";
  const activeBg = isDark ? "#E5B85C" : "#0077CC";
  const checkColor = isDark ? "#121212" : "#FFFFFF";
  const inactiveBorder = isDark ? "#634f27" : "#94A3B8";

  return (
    <div
      className={`dd-rc ${checked ? "on" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        if (onChange) onChange(e);
      }}
      title={title}
      style={{
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        border: checked ? `1.5px solid ${activeColor}` : `1.5px solid ${inactiveBorder}`,
        backgroundColor: checked ? activeBg : (isDark ? "#262626" : "#FFFFFF"),
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s ease-in-out",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg
          width="9" height="9" viewBox="0 0 12 12"
          fill="none" stroke={checkColor} strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="2.5 6 5 8.5 9.5 3.5" />
        </svg>
      )}
    </div>
  );
}

const EMPTY_FORM = {
  kode_akun: "",
  nama_akun: "",
  kategori_akun: "",
  pengguna: "all",
  pajak: "",
  deskripsi_pajak: "",
  saldo: "0",
};

export default function DaftarAkunPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [allAccounts, setAllAccounts] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [tindakanOpen, setTindakanOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [penggunaOption, setPenggunaOption] = useState("all");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light"
  );

  useEffect(() => {
    const sync = () => setThemeMode(localStorage.getItem("app_theme") || "light");
    window.addEventListener("themeChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("themeChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isDark = themeMode === "dark";

  const accounts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allAccounts.filter((a) => {
      const matchSearch =
        !q ||
        (a.kode_akun || "").toLowerCase().includes(q) ||
        (a.nama_akun || "").toLowerCase().includes(q);
      const matchKategori = !filterKategori || a.kategori_akun === filterKategori;
      return matchSearch && matchKategori;
    });
  }, [allAccounts, search, filterKategori]);

  const totalCount = accounts.length;
  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => accounts.some((a) => a.id === id)));
  }, [accounts]);

  const isAllSelected = accounts.length > 0 && accounts.every((a) => selectedIds.includes(a.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(accounts.map((a) => a.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await api.delete(`/coa/${id}/`);
      }
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      fetchAccounts();
    } catch {
      setBulkDeleteOpen(false);
    }
  };

  const exportCOAToXLSX = async () => {
    try {
      const res = await api.get("/coa/", { params: { page_size: 1000 } });
      const allData = res.data.results ?? res.data;

      const wb = XLSXStyle.utils.book_new();
      const wsData = [];

      // Row 1 (empty for spacing)
      wsData.push([{ v: "", s: {} }]);

      // Row 2: Main Title
      const titleStyle = {
        font: { bold: true, sz: 16, color: { rgb: "FFFFFF" }, name: "Calibri" },
        fill: { fgColor: { rgb: "1A3A5C" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "FFFFFF" } },
          bottom: { style: "thin", color: { rgb: "FFFFFF" } },
        },
      };
      wsData.push([
        { v: "DAFTAR AKUN (CHART OF ACCOUNTS)", s: titleStyle },
        { v: "", s: titleStyle },
        { v: "", s: titleStyle },
        { v: "", s: titleStyle },
        { v: "", s: titleStyle },
        { v: "", s: titleStyle },
      ]);

      // Row 3: Sub-title (company name)
      const subTitleStyle = {
        font: { italic: true, sz: 11, color: { rgb: "FFFFFF" }, name: "Calibri" },
        fill: { fgColor: { rgb: "1A3A5C" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
      wsData.push([
        { v: "QontakSales", s: subTitleStyle },
        { v: "", s: subTitleStyle },
        { v: "", s: subTitleStyle },
        { v: "", s: subTitleStyle },
        { v: "", s: subTitleStyle },
        { v: "", s: subTitleStyle },
      ]);

      // Row 4: Empty spacer
      wsData.push([{ v: "", s: {} }, { v: "", s: {} }, { v: "", s: {} }, { v: "", s: {} }, { v: "", s: {} }, { v: "", s: {} }]);

      // Row 5: Column headers
      const headerStyle = {
        font: { bold: true, sz: 11, color: { rgb: "FFFFFF" }, name: "Calibri" },
        fill: { fgColor: { rgb: "2563EB" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "FFFFFF" } },
          bottom: { style: "medium", color: { rgb: "1A3A5C" } },
          left: { style: "thin", color: { rgb: "FFFFFF" } },
          right: { style: "thin", color: { rgb: "FFFFFF" } },
        },
      };
      wsData.push([
        { v: "Kode Akun", s: headerStyle },
        { v: "Nama Akun", s: headerStyle },
        { v: "Kategori Akun", s: headerStyle },
        { v: "Pengguna", s: headerStyle },
        { v: "Pajak", s: headerStyle },
        { v: "Saldo (IDR)", s: headerStyle },
      ]);

      // Data rows
      allData.forEach((a, idx) => {
        const isEven = idx % 2 === 0;
        const rowBg = isEven ? "FFFFFF" : "DBEAFE";
        const cellStyle = {
          font: { sz: 10, color: { rgb: "1E3A5F" }, name: "Calibri" },
          fill: { fgColor: { rgb: rowBg } },
          alignment: { vertical: "center", wrapText: false },
          border: {
            top: { style: "hair", color: { rgb: "BFD7F5" } },
            bottom: { style: "hair", color: { rgb: "BFD7F5" } },
            left: { style: "thin", color: { rgb: "BFD7F5" } },
            right: { style: "thin", color: { rgb: "BFD7F5" } },
          },
        };
        const centerStyle = { ...cellStyle, alignment: { ...cellStyle.alignment, horizontal: "center" } };
        const rightStyle = { ...cellStyle, alignment: { ...cellStyle.alignment, horizontal: "right" } };
        wsData.push([
          { v: a.kode_akun, s: centerStyle },
          { v: a.nama_akun, s: cellStyle },
          { v: a.kategori_akun, s: centerStyle },
          { v: a.pengguna || "all", s: centerStyle },
          { v: a.pajak || "-", s: centerStyle },
          { v: parseFloat(a.saldo).toLocaleString("id-ID"), s: rightStyle },
        ]);
      });

      const ws = XLSXStyle.utils.aoa_to_sheet(wsData);

      // Merge cells for title rows (A1:F1 spacer, A2:F2 title, A3:F3 subtitle)
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // row 1 spacer
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // row 2 title
        { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }, // row 3 subtitle
        { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } }, // row 4 spacer
      ];

      // Column widths
      ws["!cols"] = [
        { wch: 14 }, // Kode Akun
        { wch: 40 }, // Nama Akun
        { wch: 28 }, // Kategori Akun
        { wch: 18 }, // Pengguna
        { wch: 12 }, // Pajak
        { wch: 18 }, // Saldo
      ];

      // Row heights
      ws["!rows"] = [
        { hpt: 8 },   // row 1 spacer
        { hpt: 30 },  // row 2 title
        { hpt: 20 },  // row 3 subtitle
        { hpt: 8 },   // row 4 spacer
        { hpt: 22 },  // row 5 headers
        ...allData.map(() => ({ hpt: 18 })),
      ];

      XLSXStyle.utils.book_append_sheet(wb, ws, "Daftar Akun");
      XLSXStyle.writeFile(wb, `Daftar_Akun_COA_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Failed to export COA:", err);
    }
  };

  const fetchAccounts = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      let pageNum = 1;
      let all = [];
      while (true) {
        const res = await api.get("/coa/", { params: { page_size: 1000, page: pageNum } });
        const data = res.data.results ?? res.data;
        all = all.concat(data);
        if (!Array.isArray(res.data.results) || !res.data.next) break;
        pageNum += 1;
      }
      setAllAccounts(all);
    } catch {
      setAllAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts(true);
  }, [fetchAccounts]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setPenggunaOption("all");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (acct) => {
    setEditTarget(acct);
    const pVal = acct.pengguna || "all";
    let option = "all";
    if (pVal === "Rifqi Ramdhani") option = "sebagian";
    else if (pVal === "Sales Manager" || pVal === "Sales Agent") option = "peran";
    setPenggunaOption(option);
    setForm({
      kode_akun: acct.kode_akun,
      nama_akun: acct.nama_akun,
      kategori_akun: acct.kategori_akun,
      pengguna: pVal,
      pajak: acct.pajak || "",
      deskripsi_pajak: acct.deskripsi_pajak || "",
      saldo: String(acct.saldo),
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.kode_akun.trim() || !form.nama_akun.trim() || !form.kategori_akun) {
      setFormError("Kode Akun, Nama Akun, dan Kategori wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, saldo: parseFloat(form.saldo) || 0 };
      if (editTarget) {
        await api.put(`/coa/${editTarget.id}/`, payload);
      } else {
        await api.post("/coa/", payload);
      }
      setModalOpen(false);
      fetchAccounts();
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.status, err.response?.data);
      const data = err.response?.data;
      if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstVal = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setFormError(`${firstKey}: ${firstVal}`);
      } else {
        setFormError("Gagal menyimpan. Periksa kembali data Anda.");
      }
    }
  };

  const confirmDelete = (acct) => {
    setDeleteTarget(acct);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/coa/${deleteTarget.id}/`);
      setDeleteOpen(false);
      fetchAccounts();
    } catch {
      setDeleteOpen(false);
    }
  };

  return (
    <Box
      className={isDark ? "dash-dark" : ""}
      p={{ base: 4, md: 6 }}
      bg={isDark ? "#121212" : "white"}
      minH="100vh"
    >
      {/* Header */}
      <Flex align="center" justify="space-between" mb={6} flexWrap="wrap" gap={3}>
        <HStack gap={3}>
          <Box w="36px" h="36px" overflow="hidden" display="flex" alignItems="center" justifyContent="flex-start">
            <Box
              as="img"
              src={brandLogo}
              h="36px"
              style={{
                objectFit: "cover",
                objectPosition: "left center",
                maxWidth: "none",
                filter: isDark ? LOGO_GOLD_FILTER : "none",
                transition: "filter 0.3s ease",
              }}
              alt="Daftar Akun"
            />
          </Box>
          <Box>
            <Text fontWeight="bold" fontSize="xl" color="foreground" lineHeight="1.2">
              Daftar Akun
            </Text>
            <Text fontSize="sm" color="gray.500">
              Chart of Accounts (COA)
            </Text>
          </Box>
        </HStack>
        {/* Action Buttons Group */}
        <HStack gap={3}>
          {/* Buat Jurnal Umum Button */}
          <Button
            className="dd-btn"
            bg="#1d62a4ff"
            color="white"
            _hover={{ bg: "#163859" }}
            _active={{ bg: "#091D30" }}
            size="sm"
            borderRadius="md"
            fontWeight="600"
            fontSize="14px"
            px={4}
            h="38px"
            boxShadow="0 4px 14px rgba(0, 0, 0, 0.3)"
            display="flex"
            alignItems="center"
            gap={2}
            onClick={() => navigate("/jurnal-umum")}
          >
            <Plus size={16} weight="bold" />
            Buat Jurnal Umum
          </Button>

          {/* Single Navy Blue Tindakan Button */}
          <Box position="relative">
            <Button
              className="dd-btn"
              onClick={() => setTindakanOpen(!tindakanOpen)}
              bg="#1d62a4ff"
              color="white"
              _hover={{ bg: "#163859" }}
              _active={{ bg: "#091D30" }}
              size="sm"
              borderRadius="md"
              fontWeight="600"
              fontSize="14px"
              px={0}
              h="38px"
              boxShadow="0 4px 14px rgba(0, 0, 0, 0.3)"
              display="flex"
              alignItems="center"
              overflow="hidden"
            >
              <Box px={4} py={2}>Tindakan</Box>
              <Box px={3} py={2} borderLeft="1px solid rgba(255,255,255,0.2)" display="flex" alignItems="center">
                <List size={18} weight="bold" />
              </Box>
            </Button>

            {/* Dropdown Menu */}
            {tindakanOpen && (
              <>
                <Box position="fixed" inset={0} zIndex={90} onClick={() => setTindakanOpen(false)} />

                <Box
                  className="dd-card"
                  position="absolute"
                  right={0}
                  top="44px"
                  w="250px"
                  bg="white"
                  borderRadius="xl"
                  shadow="2xl"
                  border="1px solid #E2E8F0"
                  py={2}
                  zIndex={100}
                  fontFamily="Segoe UI, -apple-system, sans-serif"
                >
                  {/* Item 1: Buat Akun Baru */}
                  <Flex
                    className="dd-item"
                    align="center" gap={3} px={4} py={2.5} cursor="pointer"
                    fontSize="13px" color="#1E293B" fontWeight="500"
                    _hover={{ bg: "#F1F5F9" }}
                    onClick={() => { setTindakanOpen(false); openCreate(); }}

                  >
                    <Plus size={16} className="dd-item-tindakan" />
                    <Text>Buat Akun Baru</Text>
                  </Flex>

                  {/* Item 2: Hapus Semua / Hapus Terpilih */}
                  {selectedIds.length > 0 && (
                    <Flex
                      align="center" gap={3} px={4} py={2.5} cursor="pointer"
                      fontSize="13px" color="#DC2626" fontWeight="600"
                      _hover={{ bg: "#FEF2F2" }}
                      onClick={() => { setTindakanOpen(false); setBulkDeleteOpen(true); }}
                      className="dd-item dd-danger"
                    >
                      <Trash size={16} color="#DC2626" />
                      <Text>{isAllSelected ? "Hapus Semua Akun" : `Hapus ${selectedIds.length} Akun Terpilih`}</Text>
                    </Flex>
                  )}

                  {/* Item 3: Tutup buku & kunci periode */}
                  <Flex
                    align="center" gap={3} px={4} py={2.5} cursor="pointer"
                    fontSize="13px" color="#1E293B" fontWeight="500"
                    _hover={{ bg: "#F1F5F9" }}
                    onClick={() => { setTindakanOpen(false); navigate("/tutup-buku"); }}
                    className="dd-item"
                  >
                    <BookOpen size={16} className="dd-item-tindakan" />
                    <Text>Tutup buku & kunci periode</Text>
                  </Flex>

                  <Box borderBottom="1px solid #E2E8F0" my={1.5} />


                  {/* Item 5: Ekspor Akun */}
                  <Flex
                    align="center" gap={3} px={4} py={2.5} cursor="pointer"
                    fontSize="13px" color="#1E293B" fontWeight="500"
                    _hover={{ bg: "#f1f5f91a" }}
                    onClick={() => { setTindakanOpen(false); exportCOAToXLSX(); }}
                  >
                    <FileXls size={16} className="dd-item-tindakan" />
                    <Text>Ekspor Akun (.xlsx)</Text>
                  </Flex>
                </Box>
              </>
            )}
          </Box>
        </HStack>
      </Flex>

      {/* Filters */}
      <Box bg="white" borderRadius="xl" border="1px solid" borderColor="border"
        boxShadow="0 2px 6px rgba(0,0,0,0.06)" p={4} mb={4} className="dd-card">
        <Flex gap={3} flexWrap="wrap">
          <Box position="relative" flex={1} minW="220px">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1}>
              <MagnifyingGlass size={16} />
            </Box>
            <Input
              pl={9}
              placeholder="Cari kode atau nama akun..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderRadius="lg"
              borderColor="border"
              _focus={{ borderColor: "primary", boxShadow: "0 0 0 2px rgba(37,99,235,0.08)" }}
              fontSize="sm"
            />
          </Box>
          <Box minW="220px">
            <CategoryDropdown
              value={filterKategori}
              onChange={setFilterKategori}
              options={KATEGORI_LIST}
              placeholder="Pilih Kategori"
            />
          </Box>
        </Flex>
      </Box>

      {/* Table */}
      <Box
        bg="white" borderRadius="lg" border="1px solid" borderColor="#E2E8F0"
        boxShadow="0 2px 6px rgba(0,0,0,0.06)"
        overflow="hidden"
        className="dd-card"
      >
        {loading ? (
          <Flex justify="center" align="center" py={16}>
            <Spinner color="primary" size="lg" />
          </Flex>
        ) : accounts.length === 0 ? (
          <Flex justify="center" align="center" py={16} direction="column" gap={2}>
            <Box w="40px" h="40px" overflow="hidden" display="flex" alignItems="center" justifyContent="flex-start" opacity={0.5}>
              <Box
                as="img"
                src={brandLogo}
                h="40px"
                style={{
                  objectFit: "cover",
                  objectPosition: "left center",
                  maxWidth: "none",
                  filter: isDark ? LOGO_GOLD_FILTER : "none",
                  transition: "filter 0.3s ease",
                }}
                alt="Icon"
              />
            </Box>
            <Text color="gray.400" fontSize="sm">Tidak ada akun ditemukan</Text>
          </Flex>
        ) : (
          <Box overflowX="auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Segoe UI, -apple-system, sans-serif" }}>
              <thead>
                <tr style={{ background: "#E0F2FE", borderBottom: "1px solid #BAE6FD" }}>
                  <th style={{ padding: "8px 12px", width: "36px", textAlign: "center" }}>
                    <Flex justify="center" align="center">
                      <RoundCheckbox
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        title="Pilih Semua"
                      />
                    </Flex>
                  </th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Kunci</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Kode Akun</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Nama Akun</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Kategori Akun</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Pengguna</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Pajak</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Saldo (dalam IDR)</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "#0F172A", whiteSpace: "nowrap" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acct, idx) => {
                  const isLocked = acct.is_system || acct.is_locked ||
                    acct.kode_akun.startsWith("1-10001") ||
                    acct.kode_akun.startsWith("1-10002") ||
                    acct.kode_akun.startsWith("1-10003") ||
                    acct.kode_akun.startsWith("1-10100") ||
                    acct.kode_akun.startsWith("1-10101") ||
                    acct.kode_akun.startsWith("1-10102") ||
                    acct.kode_akun.startsWith("1-10200") ||
                    acct.kode_akun.startsWith("1-10402") ||
                    acct.kode_akun.startsWith("1-10500") ||
                    acct.kode_akun.startsWith("2-20100") ||
                    acct.kode_akun.startsWith("2-20200") ||
                    acct.kode_akun.startsWith("3-30000");
                  const hasPlus = acct.kode_akun.startsWith("1-10100") || acct.kode_akun.startsWith("1-10101") || acct.kode_akun.startsWith("1-10200") || acct.kode_akun.startsWith("1-10402") || acct.kode_akun.startsWith("1-10500");
                  const isSelected = selectedIds.includes(acct.id);

                  return (
                    <tr
                      key={acct.id}
                      className={isSelected ? "dd-row dd-row-sel" : "dd-row"}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        background: isSelected ? "#F0F9FF" : "white",
                        fontSize: "13px",
                        fontWeight: "400",
                        color: "#334155",
                        height: "36px",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = isSelected ? "#E0F2FE" : "#F8FAFC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = isSelected ? "#F0F9FF" : "white"}
                    >
                      <td style={{ padding: "6px 12px", textAlign: "center" }}>
                        <Flex justify="center" align="center">
                          <RoundCheckbox
                            checked={isSelected}
                            onChange={() => toggleSelectRow(acct.id)}
                          />
                        </Flex>
                      </td>
                      <td style={{ padding: "6px 12px", color: "#475569", whiteSpace: "nowrap" }}>
                        {isLocked ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", color: "#000000", fontSize: "12px", fontWeight: "600" }}>
                            <LockKey size={13} color="#000000" weight="bold" />
                            {hasPlus ? " +" : ""}
                          </span>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#94A3B8" }}>–</span>
                        )}
                      </td>
                      <td style={{ padding: "6px 12px", whiteSpace: "nowrap", color: "#334155" }}>
                        {acct.kode_akun}
                      </td>
                      <td style={{ padding: "6px 12px" }}>
                        {getAccountPath(acct.kode_akun) ? (
                          <Link
                            to={getAccountPath(acct.kode_akun)}
                            style={{ color: "#0077CC", textDecoration: "none" }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                          >
                            {acct.nama_akun}
                          </Link>
                        ) : (
                          <span style={{ color: "#334155" }}>{acct.nama_akun}</span>
                        )}
                      </td>
                      <td style={{ padding: "6px 12px", whiteSpace: "nowrap" }}>
                        <span
                          style={{ color: "#0077CC", cursor: "pointer" }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                          {acct.kategori_akun}
                        </span>
                      </td>
                      <td style={{ padding: "6px 12px", color: "#475569" }}>
                        {acct.pengguna || "all"}
                      </td>
                      <td style={{ padding: "6px 12px", color: "#475569" }}>
                        {acct.pajak || ""}
                      </td>
                      <td style={{ padding: "6px 12px", textAlign: "right", whiteSpace: "nowrap", color: "#1E293B", fontFamily: "Segoe UI, sans-serif" }}>
                        {formatIDR(acct.saldo)}
                      </td>
                      <td style={{ padding: "6px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <HStack gap={1} justify="flex-end">
                          <IconButton
                            size="xs"
                            variant="ghost"
                            color="#0077CC"
                            _hover={{ bg: "#F0F9FF" }}
                            onClick={() => openEdit(acct)}
                            aria-label="Edit"
                            borderRadius="md"
                            title="Edit Akun"
                          >
                            <PencilSimple size={14} />
                          </IconButton>
                        </HStack>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        )}

        {/* Total */}
        {!loading && totalCount > 0 && (
          <Flex
            justify="flex-start" align="center"
            px={4} py={2.5} borderTop="1px solid" borderColor="#E2E8F0"
            bg="#F8FAFC"
            className="dd-foot"
          >
            <Text fontSize="12px" color="#64748B">
              Total {totalCount} akun
            </Text>
          </Flex>
        )}
      </Box>

      {/* Modal Tambah/Edit */}
      {modalOpen && (
        <Box
          className="dd-overlay"
          position="fixed" inset={0} bg="blackAlpha.600" zIndex={100}
          display="flex" alignItems="center" justifyContent="center" p={4}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <Box
            bg="white" borderRadius="2xl" shadow="2xl"
            w="full" maxW="500px"
            maxH="90vh" display="flex" flexDirection="column" overflow="hidden"
          >
            {/* Modal Header */}
            <Flex align="center" justify="space-between" px={6} py={4} borderBottom="1px solid" borderColor="border" flexShrink={0}>
              <HStack gap={2}>
                <Box w="24px" h="24px" overflow="hidden" display="flex" alignItems="center" justifyContent="flex-start">
                  <Box
                    as="img"
                    src={brandLogo}
                    h="24px"
                    style={{
                      objectFit: "cover",
                      objectPosition: "left center",
                      maxWidth: "none",
                      filter: isDark ? LOGO_GOLD_FILTER : "none",
                      transition: "filter 0.3s ease",
                    }}
                    alt="Icon"
                  />
                </Box>
                <Text fontWeight="bold" fontSize="lg" color="foreground">
                  {editTarget ? "Edit Akun" : "Tambah Akun Baru"}
                </Text>
              </HStack>
              <IconButton
                size="sm" variant="ghost" onClick={() => setModalOpen(false)}
                borderRadius="lg" color="gray.500"
              >
                <X size={18} />
              </IconButton>
            </Flex>

            {/* Modal Body (Scrollable) */}
            <VStack
              gap={4} p={6} flex={1} overflowY="auto"
              css={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": { background: "#CBD5E1", borderRadius: "10px" },
                "&::-webkit-scrollbar-thumb:hover": { background: "#94A3B8" },
              }}
            >
              {formError && (
                <Box w="full" className="dd-error" bg="red.50" border="1px solid" borderColor="red.200" borderRadius="lg" px={4} py={3}>
                  <Text fontSize="sm" color="red.600">{formError}</Text>
                </Box>
              )}

              <Box w="full">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1.5}>
                  Kode Akun <span style={{ color: "red" }}>*</span>
                </Text>
                <Input
                  value={form.kode_akun}
                  onChange={(e) => setForm({ ...form, kode_akun: e.target.value })}
                  placeholder="Contoh: 1-10001"
                  fontFamily="mono"
                  borderRadius="lg"
                  borderColor="border"
                  _focus={{ borderColor: "primary", boxShadow: "0 0 0 2px rgba(37,99,235,0.15)" }}
                />
              </Box>

              <Box w="full">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1.5}>
                  Nama Akun <span style={{ color: "red" }}>*</span>
                </Text>
                <Input
                  value={form.nama_akun}
                  onChange={(e) => setForm({ ...form, nama_akun: e.target.value })}
                  placeholder="Contoh: Kas"
                  borderRadius="lg"
                  borderColor="border"
                  _focus={{ borderColor: "primary", boxShadow: "0 0 0 2px rgba(37,99,235,0.15)" }}
                />
              </Box>

              <Box w="full">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1.5}>
                  Kategori Akun <span style={{ color: "red" }}>*</span>
                </Text>
                <select
                  value={form.kategori_akun}
                  onChange={(e) => setForm({ ...form, kategori_akun: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: "1px solid #E4ECFC",
                    fontSize: "14px",
                    background: "white",
                    outline: "none",
                    color: form.kategori_akun ? "#0F172A" : "#94A3B8",
                  }}
                >
                  <option value="">Pilih kategori...</option>
                  {KATEGORI_LIST.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </Box>

              {/* Pajak */}
              <Box w="full">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1.5}>Pajak</Text>
                <Input
                  value={form.pajak}
                  onChange={(e) => setForm({ ...form, pajak: e.target.value })}
                  placeholder="Contoh: PPN"
                  borderRadius="lg"
                  borderColor="border"
                  _focus={{ borderColor: "primary", boxShadow: "0 0 0 2px rgba(37,99,235,0.15)" }}
                />
              </Box>

              {/* Deskripsi pajak */}
              <Box w="full">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={1.5}>Deskripsi pajak</Text>
                <Input
                  value={form.deskripsi_pajak}
                  onChange={(e) => setForm({ ...form, deskripsi_pajak: e.target.value })}
                  placeholder="Deskripsi pajak..."
                  borderRadius="lg"
                  borderColor="border"
                  _focus={{ borderColor: "primary", boxShadow: "0 0 0 2px rgba(37,99,235,0.15)" }}
                />
              </Box>

              {/* Akses akun */}
              <Box w="full" pt={2}>
                <Flex align="center" gap={2.5} mb={3}>
                  <User size={26} color={isDark ? "#E5B85C" : "#3B82F6"} weight="regular" />
                  <Text fontSize="20px" fontWeight="700" color="#0F2B48" letterSpacing="-0.01em">
                    Akses akun
                  </Text>
                </Flex>

                <Text fontSize="14px" fontWeight="600" color="#1E293B" mb={3}>
                  Pengguna yang dapat mengakses
                </Text>

                <Flex align="center" gap={6} flexWrap="wrap">
                  {/* Option 1: Semua pengguna */}
                  <Flex
                    align="center"
                    gap={2.5}
                    cursor="pointer"
                    onClick={() => {
                      setPenggunaOption("all");
                      setForm({ ...form, pengguna: "all" });
                    }}
                    userSelect="none"
                  >
                    <Box
                      w="18px"
                      h="18px"
                      borderRadius="50%"
                      border={penggunaOption === "all" ? "2px solid #3B82F6" : "1.5px solid #CBD5E1"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={isDark ? "#1e1e1e" : "white"}
                      flexShrink={0}
                    >
                      {penggunaOption === "all" && <Box w="10px" h="10px" borderRadius="50%" bg="#3B82F6" />}
                    </Box>
                    <Text fontSize="14px" fontWeight="400" color="#1E293B">
                      Semua pengguna
                    </Text>
                  </Flex>

                  {/* Option 2: Sebagian pengguna */}
                  <Flex
                    align="center"
                    gap={2.5}
                    cursor="pointer"
                    onClick={() => {
                      setPenggunaOption("sebagian");
                      setForm({ ...form, pengguna: "Rifqi Ramdhani" });
                    }}
                    userSelect="none"
                  >
                    <Box
                      w="18px"
                      h="18px"
                      borderRadius="50%"
                      border={penggunaOption === "sebagian" ? "2px solid #3B82F6" : "1.5px solid #CBD5E1"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={isDark ? "#1e1e1e" : "white"}
                      flexShrink={0}
                    >
                      {penggunaOption === "sebagian" && <Box w="10px" h="10px" borderRadius="50%" bg="#3B82F6" />}
                    </Box>
                    <Text fontSize="14px" fontWeight="400" color="#1E293B">
                      Sebagian pengguna
                    </Text>
                  </Flex>

                  {/* Option 3: Peran tertentu */}
                  <Flex
                    align="center"
                    gap={2.5}
                    cursor="pointer"
                    onClick={() => {
                      setPenggunaOption("peran");
                      setForm({ ...form, pengguna: "Sales Manager" });
                    }}
                    userSelect="none"
                  >
                    <Box
                      w="18px"
                      h="18px"
                      borderRadius="50%"
                      border={penggunaOption === "peran" ? "2px solid #e4ad08ff" : "1.5px solid #CBD5E1"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={isDark ? "#1e1e1e" : "white"}
                      flexShrink={0}
                    >
                      {penggunaOption === "peran" && <Box w="10px" h="10px" borderRadius="50%" bg="#3B82F6" />}
                    </Box>
                    <Text fontSize="14px" fontWeight="400" color="#1E293B">
                      Peran tertentu
                    </Text>
                  </Flex>
                </Flex>

                {/* Sub-box for Sebagian Pengguna */}
                {penggunaOption === "sebagian" && (
                  <Box mt={3} p={3} className="dd-card" bg="#F8FAFC" border="1px solid #E2E8F0" borderRadius="lg">
                    <Text fontSize="12px" fontWeight="600" color="#94A3B8" mb={2} textTransform="uppercase" letterSpacing="0.05em">
                      Pilih Pengguna
                    </Text>
                    <VStack align="stretch" gap={1.5}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155" }}>
                        <RoundCheckbox
                          checked={form.pengguna === "Rifqi Ramdhani"}
                          onChange={() => setForm({ ...form, pengguna: form.pengguna === "Rifqi Ramdhani" ? "all" : "Rifqi Ramdhani" })}
                        />
                        Nama Akun: Rifqi Ramdhani
                      </label>
                    </VStack>
                  </Box>
                )}

                {/* Sub-box for Peran Tertentu */}
                {penggunaOption === "peran" && (
                  <Box mt={3} p={3} className="dd-card" bg="#F8FAFC" border="1px solid #E2E8F0" borderRadius="lg">
                    <Text fontSize="12px" fontWeight="600" color="#94A3B8" mb={2} textTransform="uppercase" letterSpacing="0.05em">
                      Pilih Peran
                    </Text>
                    <VStack align="stretch" gap={1.5}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155" }}>
                        <input
                          type="radio"
                          name="peranChoice"
                          checked={form.pengguna === "Sales Manager"}
                          onChange={() => setForm({ ...form, pengguna: "Sales Manager" })}
                          style={{ accentColor: "#3B82F6" }}
                        />
                        Sales Manager
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155" }}>
                        <input
                          type="radio"
                          name="peranChoice"
                          checked={form.pengguna === "Sales Agent"}
                          onChange={() => setForm({ ...form, pengguna: "Sales Agent" })}
                          style={{ accentColor: "#3B82F6" }}
                        />
                        Sales Agent
                      </label>
                    </VStack>
                  </Box>
                )}
              </Box>

            </VStack>

            {/* Modal Footer */}
            <Flex gap={3} px={6} py={4} borderTop="1px solid" borderColor="#F1F5F9" flexShrink={0} bg="white">
              <Button
                flex={1}
                variant="outline"
                borderColor="border"
                onClick={() => setModalOpen(false)}
                borderRadius="lg"
                fontWeight="semibold"
              >
                Batal
              </Button>
              <Button
                flex={1}
                className="dd-btn"
                bg="primary" color="white"
                _hover={{ bg: "#1D4ED8" }}
                onClick={handleSave}
                loading={saving}
                borderRadius="lg"
                fontWeight="semibold"
              >
                <FloppyDisk size={16} style={{ marginRight: 6 }} />
                {editTarget ? "Simpan Perubahan" : "Tambah Akun"}
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteOpen && (
        <Box
          className="dd-overlay"
          position="fixed" inset={0} bg="blackAlpha.600" zIndex={100}
          display="flex" alignItems="center" justifyContent="center" p={4}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteOpen(false); }}
        >
          <Box bg="white" borderRadius="2xl" shadow="2xl" w="full" maxW="380px" p={6}>
            <VStack gap={4} align="start">
              <Box>
                <Text fontWeight="bold" fontSize="lg" color="foreground">Hapus Akun?</Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Akun <strong>{deleteTarget?.kode_akun} — {deleteTarget?.nama_akun}</strong> akan dihapus permanen dan tidak bisa dikembalikan.
                </Text>
              </Box>
              <Flex gap={3} w="full">
                <Button
                  flex={1} variant="outline" borderColor="border"
                  onClick={() => setDeleteOpen(false)}
                  borderRadius="lg"
                >
                  Batal
                </Button>
                <Button
                  flex={1} bg="red.500" color="white"
                  _hover={{ bg: "red.600" }}
                  onClick={handleDelete}
                  borderRadius="lg"
                  fontWeight="semibold"
                >
                  Hapus
                </Button>
              </Flex>
            </VStack>
          </Box>
        </Box>
      )}

      {/* Modal Konfirmasi Hapus Masal */}
      {bulkDeleteOpen && (
        <Box
          className="dd-overlay"
          position="fixed" inset={0} bg="blackAlpha.600" zIndex={100}
          display="flex" alignItems="center" justifyContent="center" p={4}
          onClick={(e) => { if (e.target === e.currentTarget) setBulkDeleteOpen(false); }}
        >
          <Box bg="white" className="dd-card" borderRadius="2xl" shadow="2xl" w="full" maxW="400px" p={6}>
            <VStack gap={4} align="start">
              <Box>
                <Text fontWeight="bold" fontSize="lg" color="foreground">
                  Hapus {selectedIds.length} Akun Terpilih?
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Semua akun yang Anda pilih ({selectedIds.length} akun) akan dihapus permanen dari database.
                </Text>
              </Box>
              <Flex gap={3} w="full">
                <Button
                  flex={1} variant="outline" borderColor="border"
                  onClick={() => setBulkDeleteOpen(false)}
                  borderRadius="lg"
                  fontSize="sm"
                >
                  Batal
                </Button>
                <Button
                  flex={1} bg="red.500" color="white"
                  _hover={{ bg: "red.600" }}
                  onClick={handleBulkDelete}
                  borderRadius="lg"
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  Hapus Semua Terpilih
                </Button>
              </Flex>
            </VStack>
          </Box>
        </Box>
      )}
      <style>{`
      .dash-dark { color-scheme: dark; }

      /* Teks Chakra */
      .dash-dark p { color: #f1f5f9; }
      .dash-dark .dd-danger p { color: #f87171; }
      .dash-dark .dd-error p { color: #f87171; }
      .dash-dark .dd-error { background: rgba(239,68,68,0.15); border-color: #7f1d1d; }

      /* Kartu / panel */
      .dash-dark .dd-card { background: #121212; border-color: #634f27; }
      .dash-dark .dd-foot { background: #1a1a1a; border-color: #634f27; }
      .dash-dark .dd-item:hover { background: #2d2d2dff; }
      .dash-dark .dd-item-tindakan { color: #db9d00ff; }
      .dash-dark .dd-danger:hover { background: rgba(239,68,68,0.15); }

      /* Tombol utama -> emas */
      .dash-dark .dd-btn { background: #E5B85C !important; color: #121212 !important; }
      .dash-dark .dd-btn:hover { background: #f0c978 !important; }

      /* Input, select, textarea */
      .dash-dark input, .dash-dark select, .dash-dark textarea {
        background: #262626 !important;
        color: #f1f5f9 !important;
        border-color: #634f27 !important;
      }
      .dash-dark input:focus, .dash-dark select:focus {
        border-color: #E5B85C !important;
        box-shadow: 0 0 0 2px rgba(229,184,92,0.25) !important;
      }
      .dash-dark ::placeholder { color: #94a3b8; }
      .dash-dark input[type="radio"] { accent-color: #E5B85C; }

      /* Tabel */
      .dash-dark thead tr { background: #d38e0d69 !important; border-color: #634f27 !important; }
      .dash-dark th { color: #f1f5f9 !important; }
      .dash-dark .dd-row { background: #121212 !important; border-color: #3a3326 !important; }
      .dash-dark .dd-row:hover { background: #2d2d2d !important; }
      .dash-dark .dd-row-sel { background: rgba(229,184,92,0.15) !important; }
      .dash-dark td { color: #e2e8f0 !important; }
      .dash-dark td span[style*="cursor: pointer"] { color: #E5B85C !important; }
      .dash-dark td a { color: #E5B85C !important; }
      .dash-dark td span[style*="inline-flex"] { color: #f1f5f9 !important; }
      .dash-dark td svg { fill: #f1f5f9; }
      .dash-dark td button { color: #E5B85C !important; }
      .dash-dark td button svg { fill: #E5B85C; }
      .dash-dark td button:hover { background: #2d2d2d !important; }

      /* Checkbox bulat */
      .dash-dark .dd-rc { background: #262626 !important; border-color: #634f27 !important; }
      .dash-dark .dd-rc.on { background: #E5B85C !important; border-color: #E5B85C !important; }
      .dash-dark .dd-rc.on svg { stroke: #121212; }

      /* Dropdown kategori */
      .dash-dark .dd-cat-btn {
        background: #262626 !important;
        border-color: #634f27 !important;
        color: #f1f5f9 !important;
      }
      .dash-dark .dd-cat-panel { background: #121212 !important; border-color: #634f27 !important; }
      .dash-dark .dd-cat-item { color: #f1f5f9 !important; background: transparent !important; }
      .dash-dark .dd-cat-item:hover { background: #2d2d2d !important; }
      .dash-dark .dd-cat-item svg { fill: #E5B85C; 
      }

      .dash-dark .dd-overlay { background: rgba(0,0,0,0.7) !important; }
      .dash-dark .dd-overlay > div,
      .dash-dark .dd-overlay > div > div {
        background-color: #121212 !important;
        border-color: #634f27 !important;
      }
      .dash-dark .dd-overlay p,
      .dash-dark .dd-overlay label,
      .dash-dark .dd-overlay span { color: #f1f5f9 !important; }
      .dash-dark .dd-overlay .dd-error p { color: #f87171 !important; }
      .dash-dark .dd-overlay select option { background: #262626; color: #f1f5f9; 
      }
    `}</style>
    </Box>
  );
}

function CategoryDropdown({ value, onChange, options, placeholder = "Pilih Kategori" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const pick = (v) => {
    onChange(v);
    setOpen(false);
  };

  const itemBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "9px 12px",
    fontSize: "13px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.12s ease, color 0.12s ease",
  };

  return (
    <div ref={ref} className="dd-cat" style={{ position: "relative", width: "100%" }}>
      {/* Trigger */}
      <button
        type="button"
        className="dd-cat-btn"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "10px",
          border: open ? "1px solid #2563EB" : "1px solid #E4ECFC",
          boxShadow: open ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
          background: "white",
          fontSize: "14px",
          color: value ? "#0F172A" : "#94A3B8",
          cursor: "pointer",
          outline: "none",
          transition: "all 0.15s ease",
          textAlign: "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <CaretDown
          size={14}
          weight="bold"
          color="#64748B"
          style={{
            flexShrink: 0,
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Panel  */}
      <div
        className="dd-cat-panel"
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          zIndex: 60,
          background: "white",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          boxShadow: "0 12px 32px rgba(15,23,42,0.14)",
          padding: "6px",
          maxHeight: "300px",
          overflowY: "auto",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.98)",
          transformOrigin: "top",
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.15s ease, transform 0.18s ease, visibility 0.18s",
        }}
      >
        {/* Opsi: semua kategori */}
        <div
          className="dd-cat-item"
          onClick={() => pick("")}
          style={{
            ...itemBase,
            color: !value ? "#1D62A4" : "#64748B",
            background: !value ? "#EFF6FF" : "transparent",
            fontWeight: !value ? 600 : 400,
          }}
          onMouseEnter={(e) => { if (value) e.currentTarget.style.background = "#F1F5F9"; }}
          onMouseLeave={(e) => { if (value) e.currentTarget.style.background = "transparent"; }}
        >
          <span>Semua Kategori</span>
          {!value && <Check size={14} weight="bold" color="#1D62A4" />}
        </div>

        <div style={{ height: "1px", background: "#F1F5F9", margin: "4px 6px" }} />

        {options.map((k) => {
          const selected = value === k;
          return (
            <div
              key={k}
              className="dd-cat-item"
              onClick={() => pick(k)}
              style={{
                ...itemBase,
                color: selected ? "#1D62A4" : "#334155",
                background: selected ? "#EFF6FF" : "transparent",
                fontWeight: selected ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#F1F5F9"; }}
              onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
            >
              <span>{k}</span>
              {selected && <Check size={14} weight="bold" color="#1D62A4" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}