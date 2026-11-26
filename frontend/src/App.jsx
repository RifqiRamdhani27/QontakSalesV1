import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthGuard from "./components/layout/AuthGuard";
import PublicOnlyRoute from "./components/layout/PublicOnlyRoute";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import PageLoader from "./components/ui/PageLoader";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/ResetPasswordPage";


const Beranda = lazy(() => import("./pages/Main-Beranda/Beranda"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AcceptInvitationPage = lazy(() => import("./pages/Main-Settings/AcceptInvitationPage"));
const BiayaPage = lazy(() => import("./pages/Main-Biaya/BiayaPage"));
const CreateBiayaPage = lazy(() => import("./pages/Main-Biaya/CreateBiayaPage"));
const ProductsMain = lazy(() => import("./pages/Main-Product/ProductsMain"));
const ProductionMain = lazy(() => import("./pages/Main-Productions/ProductionsMainPage"));
const Fulfillment = lazy(() => import("./pages/Main-Fulfillment/Fulfillment"));
const DashboardPage = lazy(() => import("./pages/Main-Dashboard/DashboardPage"));
const SettingsPage = lazy(() => import("./pages/Main-Settings/SettingsPage"));
const DaftarAkunPage = lazy(() => import("./pages/Main-DaftarAkun/DaftarAkunPage"));
const TutupBukuPage = lazy(() => import("./pages/Main-DaftarAkun/TutupBukuPage"));
const JurnalUmumPage = lazy(() => import("./pages/Main-DaftarAkun/JurnalUmumPage"));
const AsetPage = lazy(() => import("./pages/Main-Aset/AsetPage"));
const SimpanAsetPage = lazy(() => import("./pages/Main-Aset/SimpanAsetPage"));
const Laporan = lazy(() => import("./pages/Main-Laporan/Laporan"));
const Neraca = lazy(() => import("./pages/Main-Laporan/Neraca"));
const KasBankPage = lazy(() => import("./pages/Main-KasBank/KasBankPage"));
const Anggaran = lazy(() => import("./pages/Main-Anggaran/Anggaran"));
const LabaRugi = lazy(() => import("./pages/Main-Laporan/LabaRugi"));
const ArusKas = lazy(() => import("./pages/Main-Laporan/ArusKas"));
const PerubahanModal = lazy(() => import("./pages/Main-Laporan/PerubahanModal"));
const BukuBesar = lazy(() => import("./pages/Main-Laporan/BukuBesar"));
const Jurnal = lazy(() => import("./pages/Main-Laporan/Jurnal"));
const NeracaSaldo = lazy(() => import("./pages/Main-Laporan/NeracaSaldo"));
const RincianAnggaran = lazy(() => import("./pages/Main-Anggaran/RincianAnggaran"));
const RingkasanBisnis = lazy(() => import("./pages/Main-Laporan/RingkasanBisnis"));
const DaftarPenjualan = lazy(() => import("./pages/Main-Laporan/DaftarPenjualan"));
const PiutangPelanggan = lazy(() => import("./pages/Main-Laporan/PiutangPelanggan"));
const PengirimanPenjualan = lazy(() => import("./pages/Main-Laporan/PengirimanPenjualan"));
const PenjualanPerPelanggan = lazy(() => import("./pages/Main-Laporan/PenjualanPerPelanggan"));
const PenjualanPerProduk = lazy(() => import("./pages/Main-Laporan/PenjualanPerProduk"));
const PenyelesaianPesananPenjualan = lazy(() => import("./pages/Main-Laporan/PenyelesaianPesananPenjualan"));
const ProfitabilitasProduk = lazy(() => import("./pages/Main-Laporan/ProfitabilitasProduk"));
const UsiaPiutang = lazy(() => import("./pages/Main-Laporan/UsiaPiutang"));
const DaftarLainnya = lazy(() => import("./pages/Main-DaftarLainnya/DaftarLainnya"));
const KategoriTagPage = lazy(() => import("./pages/Main-DaftarLainnya/KategoriTagPage"));
const KategoriTagCustomDetailPage = lazy(() => import("./pages/Main-DaftarLainnya/KategoriTagCustomDetailPage"));
const KategoriTagArchivedPage = lazy(() => import("./pages/Main-DaftarLainnya/KategoriTagArchivedPage"));
const JadwalBerulangPage = lazy(() => import("./pages/Main-DaftarLainnya/JadwalBerulangPage"));
const DaftarTransaksiPage = lazy(() => import("./pages/Main-DaftarLainnya/DaftarTransaksiPage"));
const KategoriProdukPage = lazy(() => import("./pages/Main-DaftarLainnya/KategoriProdukPage"));
const UnitsPage = lazy(() => import("./pages/Main-DaftarLainnya/UnitsPage"));
const AuditsPage = lazy(() => import("./pages/Main-DaftarLainnya/AuditsPage"));
const InventoryRecalculationPage = lazy(() => import("./pages/Main-DaftarLainnya/InventoryRecalculationPage"));
const AttachmentsPage = lazy(() => import("./pages/Main-DaftarLainnya/AttachmentsPage"));
const ImportExportPage = lazy(() => import("./pages/Main-DaftarLainnya/ImportExportPage"));
const DaftarFakturProforma = lazy(() => import("./pages/Main-Laporan/DaftarFakturProforma"));
const DaftarTukarFaktur = lazy(() => import("./pages/Main-Laporan/DaftarTukarFaktur"));
const DaftarPembelian = lazy(() => import("./pages/Main-Laporan/DaftarPembelian"));
const PembelianPerSupplier = lazy(() => import("./pages/Main-Laporan/PembelianPerSupplier"));
const UtangSupplier = lazy(() => import("./pages/Main-Laporan/UtangSupplier"));
const DaftarPengeluaran = lazy(() => import("./pages/Main-Laporan/DaftarPengeluaran"));
const DetailPengeluaran = lazy(() => import("./pages/Main-Laporan/DetailPengeluaran"));
const UsiaUtang = lazy(() => import("./pages/Main-Laporan/UsiaUtang"));
const PengirimanPembelian = lazy(() => import("./pages/Main-Laporan/PengirimanPembelian"));
const PembelianPerProduk = lazy(() => import("./pages/Main-Laporan/PembelianPerProduk"));
const PenyelesaianPesananPembelian = lazy(() => import("./pages/Main-Laporan/PenyelesaianPesananPembelian"));
const TingkatPemenuhanPesanan = lazy(() => import("./pages/Main-Laporan/TingkatPemenuhanPesanan"));
const PerputaranPersediaanBarang = lazy(() => import("./pages/Main-Laporan/PerputaranPersediaanBarang"));
const RingkasanPersediaanBarang = lazy(() => import("./pages/Main-Laporan/RingkasanPersediaanBarang"));
const KuantitasStokGudang = lazy(() => import("./pages/Main-Laporan/KuantitasStokGudang"));
const NilaiPersediaanBarang = lazy(() => import("./pages/Main-Laporan/NilaiPersediaanBarang"));
const NilaiStokGudang = lazy(() => import("./pages/Main-Laporan/NilaiStokGudang"));
const DetailPersediaanBarang = lazy(() => import("./pages/Main-Laporan/DetailPersediaanBarang"));
const PergerakanBarangGudang = lazy(() => import("./pages/Main-Laporan/PergerakanBarangGudang"));
const KuantitasProdukNomorSeri = lazy(() => import("./pages/Main-Laporan/KuantitasProdukNomorSeri"));
const GudangProdukBernomorSeri = lazy(() => import("./pages/Main-Laporan/GudangProdukBernomorSeri"));
const RingkasanAsetTetap = lazy(() => import("./pages/Main-Laporan/RingkasanAsetTetap"));
const DetailAsetTetap = lazy(() => import("./pages/Main-Laporan/DetailAsetTetap"));
const LaporanPenjualanPelepasanAset = lazy(() => import("./pages/Main-Laporan/LaporanPenjualanPelepasanAset"));
const RingkasanRekonsiliasi = lazy(() => import("./pages/Main-Laporan/RingkasanRekonsiliasi"));
const MutasiRekeningKoran = lazy(() => import("./pages/Main-Laporan/MutasiRekeningKoran"));
const LaporanPajakPemotongan = lazy(() => import("./pages/Main-Laporan/LaporanPajakPemotongan"));
const LaporanPajakPenjualan = lazy(() => import("./pages/Main-Laporan/LaporanPajakPenjualan"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ContactPage = lazy(() => import("./pages/Main-Contact/ContactPage"));
const MainLayout = lazy(() => import("./components/layout/MainLayout"));
const PusatBantuan = lazy(() => import("./pages/PusatBantuan"));
const Pajak = lazy(() => import("./pages/Main-DaftarLainnya/Pajak"));
const CaraPembayaran = lazy(() => import("./pages/Main-DaftarLainnya/CaraPembayaran"));
const BuatPajakBaru = lazy(() => import("./pages/Main-DaftarLainnya/BuatPajakBaru"));
const EditPajak = lazy(() => import("./pages/Main-DaftarLainnya/EditPajak"));
const SyaratPembayaran = lazy(() => import("./pages/Main-DaftarLainnya/SyaratPembayaran"));
/* Data Migrasi */
const DataMigrasi = lazy(() => import("./pages/Main-DaftarLainnya/DataMigrasi"));
const PengaturanPerusahaan = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/PengaturanPerusahaan"));
const MasterData1 = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/MasterData1"));
const MasterData2 = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/MasterData2"));
const MasterData3 = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/MasterData3"));
const Transaksi1 = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/Transaksi1"));
const Transaksi2 = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/Transaksi2"));
const Transaksi3 = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/Transaksi3"));
const AturSaldoCoa = lazy(() => import("./pages/Main-DaftarLainnya/Isi-DataMigrasi/AturSaldoCoa"));
/* Isi Daftar Akun */
const PpnMasukan = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/PpnMasukan"));
const Kas = lazy(() => import("./pages/Isi-DaftarAkun/Cash & Bank/Kas"));
const RekeningBank = lazy(() => import("./pages/Isi-DaftarAkun/Cash & Bank/RekeningBank"));
const Giro = lazy(() => import("./pages/Isi-DaftarAkun/Cash & Bank/Giro"));
const PiutangBelumDitagih = lazy(() => import("./pages/Isi-DaftarAkun/AccountsReceivable/PiutangBelumDitagih"));
const PiutangUsaha = lazy(() => import("./pages/Isi-DaftarAkun/AccountsReceivable/PiutangUsaha"));

const CadanganKerugianPiutang = lazy(() => import("./pages/Isi-DaftarAkun/AccountsReceivable/CadanganKerugianPiutang"));

const PersediaanBarang = lazy(() => import("./pages/Isi-DaftarAkun/Inventory/PersediaanBarang"));
const PiutangLainnya = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/PiutangLainnya"));
const PiutangKaryawan = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/PiutangKaryawan"));
const DanaBelumDisetor = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/DanaBelumDisetor"));
const AsetLancarLainnya = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/AsetLancarLainnya"));
const BiayaDibayarDimuka = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/BiayaDibayarDimuka"));
const UangMuka = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/UangMuka"));
const PPh22 = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/PPh22"));
const PPh23 = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/PPh23"));
const PPh25 = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentAssets/PPh25"));
const AsetTetapTanah = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTetapTanah"));
const AsetTetapBangunan = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTetapBangunan"));
const AsetTetapBuildingImprovements = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTetapBuildingImprovements"));
const AsetTetapKendaraan = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTetapKendaraan"));
const AsetTetapMesinPeralatan = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTetapMesin&Peralatan"));
const AsetTetapPerlengkapanKantor = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTetapPerlengkapanKantor"));
const AsetTetapSewaGunaUsaha = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTetapSewaGunaUsaha"));
const AsetTakBerwujud = lazy(() => import("./pages/Isi-DaftarAkun/FixedAssets/AsetTakBerwujud"));
const AkumulasiPenyusutanBangunan = lazy(() => import("./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Bangunan"));
const AkumulasiPenyusutanBuilding = lazy(() => import("./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Building"));
const AkumulasiPenyusutanKendaraan = lazy(() => import("./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Kendaraan"));
const AkumulasiPenyusutanMesinPeralatan = lazy(() => import("./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Mesin&Peralatan"));
const AkumulasiPenyusutanPeralatanKantor = lazy(() => import("./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-PeralatanKantor"));
const AkumulasiPenyusutanSewaGunaUsaha = lazy(() => import("./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-SewaGunaUsaha"));
const AkumulasiPenyusutanAmortisasi = lazy(() => import("./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Amortisasi"));
const Investasi = lazy(() => import("./pages/Isi-DaftarAkun/OtherAssets/Investasi"));
const HutangUsaha = lazy(() => import("./pages/Isi-DaftarAkun/AccountsPayable/HutangUsaha"));
const HutangBelumDitagih = lazy(() => import("./pages/Isi-DaftarAkun/AccountsPayable/HutangBelumDitagih"));
const HutangLainLain = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangLainLain"));
const HutangGaji = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangGaji"));
const HutangDeviden = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangDeviden"));
const PendapatanDiterimaDimuka = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/PendapatanDiterimaDimuka"));
const SaranaKantorTerhutang = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/SaranaKantorTerhutang"));
const BungaTerhutang = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/BungaTerhutang"));
const BiayaTerhutangLainnya = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/BiayaTerhutangLainnya"));
const HutangBank = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangBank"));
const PPNKeluaran = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/PPNKeluaran"));
const HutangPajakPPH21 = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh21"));
const HutangPajakPPH22 = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh22"));
const HutangPajakPPH23 = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh23"));
const HutangPajakPPH29 = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh29"));
const HutangPajakLainnya = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajakLainnya"));
const HutangDariPemegangSaham = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangDariPemegangSaham"));
const KewajibanLancarLainnya = lazy(() => import("./pages/Isi-DaftarAkun/OtherCurrentLiabilities/KewajibanLancarLainnya"));
const KewajibanManfaatKaryawan = lazy(() => import("./pages/Isi-DaftarAkun/LongTermLiabilities/KewajibanManfaatKaryawan"));
const ModalSaham = lazy(() => import("./pages/Isi-DaftarAkun/Equity/ModalSaham"));
const TambahanModalDisetor = lazy(() => import("./pages/Isi-DaftarAkun/Equity/TambahanModalDisetor"));
const Deviden = lazy(() => import("./pages/Isi-DaftarAkun/Equity/Deviden"));
const EquitasSaldoAwal = lazy(() => import("./pages/Isi-DaftarAkun/Equity/EquitasSaldoAwal"));
const LabaDitahan = lazy(() => import("./pages/Isi-DaftarAkun/Equity/LabaDitahan"));
const PendapatanKomprehensifLainnya = lazy(() => import("./pages/Isi-DaftarAkun/Equity/PendapatanKomprehensifLainnya"));
const DiskonPenjualan = lazy(() => import("./pages/Isi-DaftarAkun/Income/DiskonPenjualan"));
const PendapatanBelumDitagih = lazy(() => import("./pages/Isi-DaftarAkun/Income/PendapatanBelumDitagih"));
const PendapatanJasa = lazy(() => import("./pages/Isi-DaftarAkun/Income/PendapatanJasa"));
const ReturPenjualan = lazy(() => import("./pages/Isi-DaftarAkun/Income/ReturPenjualan"));
const BebanPokokPendapatan = lazy(() => import("./pages/Isi-DaftarAkun/CostOfSales/BebanPokokPendapatan"));
const BiayaImpor = lazy(() => import("./pages/Isi-DaftarAkun/CostOfSales/BiayaImpor"));
const DiskonPembelian = lazy(() => import("./pages/Isi-DaftarAkun/CostOfSales/DiskonPembelian"));
const ReturPembelian = lazy(() => import("./pages/Isi-DaftarAkun/CostOfSales/ReturPembelian"));
const BiayaProduksi = lazy(() => import("./pages/Isi-DaftarAkun/CostOfSales/BiayaProduksi"));
const PengirimanPengangkutan = lazy(() => import("./pages/Isi-DaftarAkun/CostOfSales/Pengiriman&Pengangkutan"));
const BiayaPenjualan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BiayaPenjualan"));
const IklanPromosi = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/IklanPromosi"));
const KomisiFee = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/KomisiFee"));
const BensinTolParkirPenjualan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BensinTolParkirPenjualan"));
const PerjalananDinasPenjualan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PerjalananDinasPenjualan"));
const KomunikasiPenjualan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/KomunikasiPenjualan"));
const MarketingLainnya = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/MarketingLainnya"));
const BiayaUmumAdministratif = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BiayaUmumAdministratif"));
const Gaji = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Gaji"));
const Upah = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Upah"));
const MakananTransportasi = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Makanan&Transportasi"));
const Lembur = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Lembur"));
const Pengobatan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Pengobatan"));
const ThrBonus = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Thr&Bonus"));
const Jamsostek = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Jamsostek"));
const Insentif = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Insentif"));
const Pesangon = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Pesangon"));
const ManfaatTunjanganLain = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Manfaat&TunjanganLain"));
const Donasi = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Donasi"));
const Hiburan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Hiburan"));
const BensinTolParkirUmum = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BensinTolParkirUmum"));
const PerbaikanPemeliharaan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Perbaikan&Pemeliharaan"));
const PerjalananDinasUmum = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PerjalananDinasUmum"));
const Makanan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Makanan"));
const KomunikasiUmum = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/KomunikasiUmum"));
const IuranLangganan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Iuran&Langganan"));
const Asuransi = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Asuransi"));
const LegalProfesional = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Legal&Profesional"));
const BebanManfaatKaryawan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BebanManfaatKaryawan"));
const SaranaKantor = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/SaranaKantor"));
const PelatihanPengembangan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Pelatihan&Pengembangan"));
const BebanPiutangTakTertagih = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BebanPiutangTakTertagih"));
const PajakPerizinan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Pajak&Perizinan"));
const Denda = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Denda"));
const PengeluaranBarangRusak = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PengeluaranBarangRusak"));
const BebanKantor = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BebanKantor"));
const AlatTulisKantorPrinting = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/AlatTulisKantor&Printing"));
const BeaMaterai = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BeaMaterai"));
const KeamananKebersihan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Keamanan&Kebersihan"));
const SuppliesMaterial = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Supplies&Material"));
const Pemborong = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/Pemborong"));
const BiayaSewaBangunan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BiayaSewaBangunan"));
const BiayaSewaKendaraan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BiayaSewaKendaraan"));
const BiayaSewaOperasional = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BiayaSewaOperasional"));
const BiayaSewaLainLain = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/BiayaSewaLainLain"));
const PenyusutanBangunan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PenyusutanBangunan"));
const PenyusutanPerbaikanBangunan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PenyusutanPerbaikanBangunan"));
const PenyusutanKendaraan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PenyusutanKendaraan"));
const PenyusutanMesinPeralatan = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PenyusutanMesin&Peralatan"));
const PenyusutanPeralatanKantor = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PenyusutanPeralatanKantor"));
const PenyusutanAsetSewaGunaUsaha = lazy(() => import("./pages/Isi-DaftarAkun/Expenses/PenyusutanAsetSewaGunaUsaha"));
const PendapatanBungaBank = lazy(() => import("./pages/Isi-DaftarAkun/OtherIncome/PendapatanBungaBank"));
const PendapatanBungaDeposito = lazy(() => import("./pages/Isi-DaftarAkun/OtherIncome/PendapatanBungaDeposito"));
const PendapatanLainLain = lazy(() => import("./pages/Isi-DaftarAkun/OtherIncome/PendapatanLainLain"));
const BebanBunga = lazy(() => import("./pages/Isi-DaftarAkun/OtherExpense/BebanBunga"));
const BebanLainLain = lazy(() => import("./pages/Isi-DaftarAkun/OtherExpense/BebanLainLain"));
const BebanPajakKini = lazy(() => import("./pages/Isi-DaftarAkun/OtherExpense/BebanPajakKini"));
const BebanPajakTangguhan = lazy(() => import("./pages/Isi-DaftarAkun/OtherExpense/BebanPajakTangguhan"));
const LabaRugiPelepasanAsetTetap = lazy(() => import("./pages/Isi-DaftarAkun/OtherExpense/LabaRugiPelepasanAsetTetap"));
const PenyesuaianPersediaan = lazy(() => import("./pages/Isi-DaftarAkun/OtherExpense/PenyesuaianPersediaan"));
const Provisi = lazy(() => import("./pages/Isi-DaftarAkun/OtherExpense/Provisi"));
/* Kontak */
const ProfilKontak = lazy(() => import("./pages/Main-Contact/ProfilKontak"));
const BuatKontak = lazy(() => import("./pages/Main-Contact/BuatKontak"));
const UbahKontak = lazy(() => import("./pages/Main-Contact/UbahKontak"));
/* Produk */
const BuatProduk = lazy(() => import("./pages/Main-Product/BuatProduk"));
const TambahGudang = lazy(() => import("./pages/Main-Product/TambahGudang"));
const PenyesuaianStok = lazy(() => import("./pages/Main-Product/PenyesuaianStok"));
const TransferGudang = lazy(() => import("./pages/Main-Product/TransferGudang"));
const AturanHarga = lazy(() => import("./pages/Main-Product/AturanHarga"));
const ProfilProduk = lazy(() => import("./pages/Main-Product/ProfilProduk"));
const UbahProduk = lazy(() => import("./pages/Main-Product/UbahProduk"));
/* Penjualan */
const PenjualanPage = lazy(() => import("./pages/Main-Penjualan/PenjualanPage"));
const CreateInvoice = lazy(() => import("./pages/Main-Penjualan/CreateSalesInvoicePage"));
const CreateSalesOrderPage = lazy(() => import("./pages/Main-Penjualan/CreateSalesOrderPage"));
const CreateSalesQuotePage = lazy(() => import("./pages/Main-Penjualan/CreateSalesQuotePage"));
/* Pembelian */
const PembelianPage = lazy(() => import("./pages/Main-Pembelian/PembelianPage"));
const CreatePurchaseInvoice = lazy(() => import("./pages/Main-Pembelian/CreatePurchaseInvoice"));
const CreatePurchaseExchange = lazy(() => import("./pages/Main-Pembelian/CreatePurchaseExchange"));
const CreatePurchaseOrderPage = lazy(() => import("./pages/Main-Pembelian/CreatePurchaseOrderPage"));
const CreatePurchaseQuotePage = lazy(() => import("./pages/Main-Pembelian/CreatePurchaseQuotePage"));
const CreatePurchaseRequestPage = lazy(() => import("./pages/Main-Pembelian/CreatePurchaseRequestPage"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/pusat-bantuan" element={<PusatBantuan />} />
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            /* Isi Daftar Akun */
            <Route path="/isi-daftar-akun/ppn-masukan" element={<PpnMasukan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PpnMasukan />} />
            <Route path="/isi-daftar-akun/kas" element={<Kas />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<Kas />} />
            <Route path="/isi-daftar-akun/rekening-bank" element={<RekeningBank />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<RekeningBank />} />
            <Route path="/isi-daftar-akun/giro" element={<Giro />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<Giro />} />
            <Route path="/isi-daftar-akun/piutang-belum-ditagih" element={<PiutangBelumDitagih />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangBelumDitagih />} />
            <Route path="/isi-daftar-akun/piutang-usaha" element={<PiutangUsaha />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangUsaha />} />
            <Route path="/isi-daftar-akun/cadangan-kerugian-piutang" element={<CadanganKerugianPiutang />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<CadanganKerugianPiutang />} />
            <Route path="/isi-daftar-akun/persediaan-barang" element={<PersediaanBarang />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PersediaanBarang />} />
            <Route path="/isi-daftar-akun/piutang-lainnya" element={<PiutangLainnya />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangLainnya />} />
            <Route path="/isi-daftar-akun/piutang-karyawan" element={<PiutangKaryawan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangKaryawan />} />
            <Route path="/isi-daftar-akun/dana-belum-disetor" element={<DanaBelumDisetor />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<DanaBelumDisetor />} />
            <Route path="/isi-daftar-akun/aset-lancar-lainnya" element={<AsetLancarLainnya />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetLancarLainnya />} />
            <Route path="/isi-daftar-akun/biaya-dibayar-dimuka" element={<BiayaDibayarDimuka />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaDibayarDimuka />} />
            <Route path="/isi-daftar-akun/uang-muka" element={<UangMuka />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<UangMuka />} />
            <Route path="/isi-daftar-akun/pph-23" element={<PPh23 />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PPh23 />} />
            <Route path="/isi-daftar-akun/pph-22" element={<PPh22 />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PPh22 />} />
            <Route path="/isi-daftar-akun/pph-25" element={<PPh25 />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PPh25 />} />
            <Route path="/isi-daftar-akun/aset-tetap-tanah" element={<AsetTetapTanah />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapTanah />} />
            <Route path="/isi-daftar-akun/aset-tetap-bangunan" element={<AsetTetapBangunan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapBangunan />} />
            <Route path="/isi-daftar-akun/aset-tetap-building-improvements" element={<AsetTetapBuildingImprovements />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapBuildingImprovements />} />
            <Route path="/isi-daftar-akun/aset-tetap-kendaraan" element={<AsetTetapKendaraan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapKendaraan />} />
            <Route path="/isi-daftar-akun/aset-tetap-mesin-peralatan" element={<AsetTetapMesinPeralatan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapMesinPeralatan />} />
            <Route path="/isi-daftar-akun/aset-tetap-perlengkapan-kantor" element={<AsetTetapPerlengkapanKantor />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapPerlengkapanKantor />} />
            <Route path="/isi-daftar-akun/aset-tetap-sewa-guna-usaha" element={<AsetTetapSewaGunaUsaha />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapSewaGunaUsaha />} />
            <Route path="/isi-daftar-akun/aset-tak-berwujud" element={<AsetTakBerwujud />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTakBerwujud />} />
            <Route path="/isi-daftar-akun/akumulasi-penyusutan-bangunan" element={<AkumulasiPenyusutanBangunan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanBangunan />} />
            <Route path="/isi-daftar-akun/akumulasi-penyusutan-building-improvements" element={<AkumulasiPenyusutanBuilding />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanBuilding />} />
            <Route path="/isi-daftar-akun/akumulasi-penyusutan-kendaraan" element={<AkumulasiPenyusutanKendaraan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanKendaraan />} />
            <Route path="/isi-daftar-akun/akumulasi-penyusutan-mesin-peralatan" element={<AkumulasiPenyusutanMesinPeralatan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanMesinPeralatan />} />
            <Route path="/isi-daftar-akun/akumulasi-penyusutan-peralatan-kantor" element={<AkumulasiPenyusutanPeralatanKantor />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanPeralatanKantor />} />
            <Route path="/isi-daftar-akun/akumulasi-penyusutan-sewa-guna-usaha" element={<AkumulasiPenyusutanSewaGunaUsaha />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanSewaGunaUsaha />} />
            <Route path="/isi-daftar-akun/akumulasi-penyusutan-amortisasi" element={<AkumulasiPenyusutanAmortisasi />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanAmortisasi />} />
            <Route path="/isi-daftar-akun/investasi" element={<Investasi />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<Investasi />} />
            <Route path="/isi-daftar-akun/hutang-usaha" element={<HutangUsaha />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangUsaha />} />
            <Route path="/isi-daftar-akun/hutang-belum-ditagih" element={<HutangBelumDitagih />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangBelumDitagih />} />
            <Route path="/isi-daftar-akun/hutang-lain-lain" element={<HutangLainLain />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangLainLain />} />
            <Route path="/isi-daftar-akun/hutang-gaji" element={<HutangGaji />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangGaji />} />
            <Route path="/isi-daftar-akun/hutang-deviden" element={<HutangDeviden />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangDeviden />} />
            <Route path="/isi-daftar-akun/pendapatan-diterima-dimuka" element={<PendapatanDiterimaDimuka />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanDiterimaDimuka />} />
            <Route path="/isi-daftar-akun/sarana-kantor-terhutang" element={<SaranaKantorTerhutang />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<SaranaKantorTerhutang />} />
            <Route path="/isi-daftar-akun/bunga-terhutang" element={<BungaTerhutang />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<BungaTerhutang />} />
            <Route path="/isi-daftar-akun/biaya-terhutang-lainnya" element={<BiayaTerhutangLainnya />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaTerhutangLainnya />} />
            <Route path="/isi-daftar-akun/hutang-bank" element={<HutangBank />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangBank />} />
            <Route path="/isi-daftar-akun/ppn-keluaran" element={<PPNKeluaran />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PPNKeluaran />} />
            <Route path="/isi-daftar-akun/hutang-pajak-pph21" element={<HutangPajakPPH21 />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH21 />} />
            <Route path="/isi-daftar-akun/hutang-pajak-pph22" element={<HutangPajakPPH22 />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH22 />} />
            <Route path="/isi-daftar-akun/hutang-pajak-pph23" element={<HutangPajakPPH23 />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH23 />} />
            <Route path="/isi-daftar-akun/hutang-pajak-pph29" element={<HutangPajakPPH29 />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH29 />} />
            <Route path="/isi-daftar-akun/hutang-pajak-lainnya" element={<HutangPajakLainnya />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakLainnya />} />
            <Route path="/isi-daftar-akun/hutang-dari-pemegang-saham" element={<HutangDariPemegangSaham />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<HutangDariPemegangSaham />} />
            <Route path="/isi-daftar-akun/kewajiban-lancar-lainnya" element={<KewajibanLancarLainnya />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<KewajibanLancarLainnya />} />
            <Route path="/isi-daftar-akun/kewajiban-manfaat-karyawan" element={<KewajibanManfaatKaryawan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<KewajibanManfaatKaryawan />} />
            <Route path="/isi-daftar-akun/modal-saham" element={<ModalSaham />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<ModalSaham />} />
            <Route path="/isi-daftar-akun/tambahan-modal-disetor" element={<TambahanModalDisetor />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<TambahanModalDisetor />} />
            <Route path="/isi-daftar-akun/laba-ditahan" element={<LabaDitahan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<LabaDitahan />} />
            <Route path="/isi-daftar-akun/deviden" element={<Deviden />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<Deviden />} />
            <Route path="/isi-daftar-akun/pendapatan-komprehensif-lainnya" element={<PendapatanKomprehensifLainnya />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanKomprehensifLainnya />} />
            <Route path="/isi-daftar-akun/equitas-saldo-awal" element={<EquitasSaldoAwal />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<EquitasSaldoAwal />} />
            <Route path="/isi-daftar-akun/diskon-penjualan" element={<DiskonPenjualan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<DiskonPenjualan />} />
            <Route path="/isi-daftar-akun/pendapatan-belum-ditagih" element={<PendapatanBelumDitagih />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanBelumDitagih />} />
            <Route path="/isi-daftar-akun/pendapatan-jasa" element={<PendapatanJasa />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanJasa />} />
            <Route path="/isi-daftar-akun/retur-penjualan" element={<ReturPenjualan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<ReturPenjualan />} />
            <Route path="/isi-daftar-akun/pengiriman-pengangkutan" element={<PengirimanPengangkutan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<PengirimanPengangkutan />} />
            <Route path="/isi-daftar-akun/biaya-produksi" element={<BiayaProduksi />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaProduksi />} />
            <Route path="/isi-daftar-akun/diskon-pembelian" element={<DiskonPembelian />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<DiskonPembelian />} />
            <Route path="/isi-daftar-akun/retur-pembelian" element={<ReturPembelian />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<ReturPembelian />} />
            <Route path="/isi-daftar-akun/beban-pokok-pendapatan" element={<BebanPokokPendapatan />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<BebanPokokPendapatan />} />
            <Route path="/isi-daftar-akun/biaya-impor" element={<BiayaImpor />} />
            <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaImpor />} />
            <Route path="/isi-daftar-akun/biaya-penjualan" element={<BiayaPenjualan />} />
            <Route path="/isi-daftar-akun/iklan-promosi" element={<IklanPromosi />} />
            <Route path="/isi-daftar-akun/komisi-fee" element={<KomisiFee />} />
            <Route path="/isi-daftar-akun/bensin-tol-parkir-penjualan" element={<BensinTolParkirPenjualan />} />
            <Route path="/isi-daftar-akun/perjalanan-dinas-penjualan" element={<PerjalananDinasPenjualan />} />
            <Route path="/isi-daftar-akun/komunikasi-penjualan" element={<KomunikasiPenjualan />} />
            <Route path="/isi-daftar-akun/marketing-lainnya" element={<MarketingLainnya />} />
            <Route path="/isi-daftar-akun/biaya-umum-administratif" element={<BiayaUmumAdministratif />} />
            <Route path="/isi-daftar-akun/gaji" element={<Gaji />} />
            <Route path="/isi-daftar-akun/upah" element={<Upah />} />
            <Route path="/isi-daftar-akun/makanan-transportasi" element={<MakananTransportasi />} />
            <Route path="/isi-daftar-akun/lembur" element={<Lembur />} />
            <Route path="/isi-daftar-akun/pengobatan" element={<Pengobatan />} />
            <Route path="/isi-daftar-akun/thr-bonus" element={<ThrBonus />} />
            <Route path="/isi-daftar-akun/jamsostek" element={<Jamsostek />} />
            <Route path="/isi-daftar-akun/insentif" element={<Insentif />} />
            <Route path="/isi-daftar-akun/pesangon" element={<Pesangon />} />
            <Route path="/isi-daftar-akun/manfaat-tunjangan-lain" element={<ManfaatTunjanganLain />} />
            <Route path="/isi-daftar-akun/donasi" element={<Donasi />} />
            <Route path="/isi-daftar-akun/hiburan" element={<Hiburan />} />
            <Route path="/isi-daftar-akun/bensin-tol-parkir-umum" element={<BensinTolParkirUmum />} />
            <Route path="/isi-daftar-akun/perbaikan-pemeliharaan" element={<PerbaikanPemeliharaan />} />
            <Route path="/isi-daftar-akun/perjalanan-dinas-umum" element={<PerjalananDinasUmum />} />
            <Route path="/isi-daftar-akun/makanan" element={<Makanan />} />
            <Route path="/isi-daftar-akun/komunikasi-umum" element={<KomunikasiUmum />} />
            <Route path="/isi-daftar-akun/iuran-langganan" element={<IuranLangganan />} />
            <Route path="/isi-daftar-akun/asuransi" element={<Asuransi />} />
            <Route path="/isi-daftar-akun/legal-profesional" element={<LegalProfesional />} />
            <Route path="/isi-daftar-akun/beban-manfaat-karyawan" element={<BebanManfaatKaryawan />} />
            <Route path="/isi-daftar-akun/sarana-kantor" element={<SaranaKantor />} />
            <Route path="/isi-daftar-akun/pelatihan-pengembangan" element={<PelatihanPengembangan />} />
            <Route path="/isi-daftar-akun/beban-piutang-tak-tertagih" element={<BebanPiutangTakTertagih />} />
            <Route path="/isi-daftar-akun/pajak-perizinan" element={<PajakPerizinan />} />
            <Route path="/isi-daftar-akun/denda" element={<Denda />} />
            <Route path="/isi-daftar-akun/pengeluaran-barang-rusak" element={<PengeluaranBarangRusak />} />
            <Route path="/isi-daftar-akun/beban-kantor" element={<BebanKantor />} />
            <Route path="/isi-daftar-akun/alat-tulis-kantor-printing" element={<AlatTulisKantorPrinting />} />
            <Route path="/isi-daftar-akun/bea-materai" element={<BeaMaterai />} />
            <Route path="/isi-daftar-akun/keamanan-kebersihan" element={<KeamananKebersihan />} />
            <Route path="/isi-daftar-akun/supplies-material" element={<SuppliesMaterial />} />
            <Route path="/isi-daftar-akun/pemborong" element={<Pemborong />} />
            <Route path="/isi-daftar-akun/biaya-sewa-bangunan" element={<BiayaSewaBangunan />} />
            <Route path="/isi-daftar-akun/biaya-sewa-kendaraan" element={<BiayaSewaKendaraan />} />
            <Route path="/isi-daftar-akun/biaya-sewa-operasional" element={<BiayaSewaOperasional />} />
            <Route path="/isi-daftar-akun/biaya-sewa-lain-lain" element={<BiayaSewaLainLain />} />
            <Route path="/isi-daftar-akun/penyusutan-bangunan" element={<PenyusutanBangunan />} />
            <Route path="/isi-daftar-akun/penyusutan-perbaikan-bangunan" element={<PenyusutanPerbaikanBangunan />} />
            <Route path="/isi-daftar-akun/penyusutan-kendaraan" element={<PenyusutanKendaraan />} />
            <Route path="/isi-daftar-akun/penyusutan-mesin-peralatan" element={<PenyusutanMesinPeralatan />} />
            <Route path="/isi-daftar-akun/penyusutan-peralatan-kantor" element={<PenyusutanPeralatanKantor />} />
            <Route path="/isi-daftar-akun/penyusutan-aset-sewa-guna-usaha" element={<PenyusutanAsetSewaGunaUsaha />} />
            <Route path="/isi-daftar-akun/pendapatan-bunga-bank" element={<PendapatanBungaBank />} />
            <Route path="/isi-daftar-akun/pendapatan-bunga-deposito" element={<PendapatanBungaDeposito />} />
            <Route path="/isi-daftar-akun/pendapatan-lain-lain" element={<PendapatanLainLain />} />
            <Route path="/isi-daftar-akun/beban-bunga" element={<BebanBunga />} />
            <Route path="/isi-daftar-akun/beban-lain-lain" element={<BebanLainLain />} />
            <Route path="/isi-daftar-akun/beban-pajak-kini" element={<BebanPajakKini />} />
            <Route path="/isi-daftar-akun/beban-pajak-tangguhan" element={<BebanPajakTangguhan />} />
            <Route path="/isi-daftar-akun/laba-rugi-pelepasan-aset-tetap" element={<LabaRugiPelepasanAsetTetap />} />
            <Route path="/isi-daftar-akun/penyesuaian-persediaan" element={<PenyesuaianPersediaan />} />
            <Route path="/isi-daftar-akun/provisi" element={<Provisi />} />
            /* Kontak */
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/main-contact/profil-kontak/:id" element={<ProfilKontak />} />
            <Route path="/main-contact/profil-kontak" element={<ProfilKontak />} />
            <Route path="/main-contact/buat-kontak" element={<BuatKontak />} />
            <Route path="/main-contact/ubah-kontak" element={<UbahKontak />} />
            /* Produk */
            <Route path="/main-product/products" element={<ProductsMain />} />
            <Route path="/main-product/buat-produk" element={<BuatProduk />} />
            <Route path="/main-product/tambah-gudang" element={<TambahGudang />} />
            <Route path="/main-product/penyesuaian-stok" element={<PenyesuaianStok />} />
            <Route path="/main-product/transfer-gudang" element={<TransferGudang />} />
            <Route path="/main-product/aturan-harga" element={<AturanHarga />} />
            <Route path="/main-product/profil-produk/:id" element={<ProfilProduk />} />
            <Route path="/main-product/profil-produk" element={<ProfilProduk />} />
            <Route path="/main-product/ubah-produk" element={<UbahProduk />} />
            /* Penjualan */
            <Route path="/penjualan" element={<PenjualanPage />} />
            <Route path="/penjualan/create" element={<CreateInvoice />} />
            <Route path="/penjualan/create-sales-order" element={<CreateSalesOrderPage />} />
            <Route path="/penjualan/create-sales-quote" element={<CreateSalesQuotePage />} />
            /* Pembelian */
            <Route path="/pembelian" element={<PembelianPage />} />
            <Route path="/pembelian/faktur/create" element={<CreatePurchaseInvoice />} />
            <Route path="/pembelian/tukar-faktur/create" element={<CreatePurchaseExchange />} />
            <Route path="/pembelian/pesanan/create" element={<CreatePurchaseOrderPage />} />
            <Route path="/pembelian/penawaran/create" element={<CreatePurchaseQuotePage />} />
            <Route path="/pembelian/permintaan/create" element={<CreatePurchaseRequestPage />} />
            /* Produksi */
            <Route path="/productionsmain" element={<ProductionMain />} />
            /* Pemenuhan */
            <Route path="/fulfillment" element={<Fulfillment />} />
            /* Beranda */
            <Route path="/kas-bank" element={<KasBankPage />} />
            <Route path="/biaya" element={<BiayaPage />} />
            <Route path="/biaya/create" element={<CreateBiayaPage />} />
            <Route path="/daftar-lainnya" element={<DaftarLainnya />} />
            <Route path="/daftar-lainnya/create" element={<KategoriTagPage />} />
            <Route path="/kategori-tag/custom/:id" element={<KategoriTagCustomDetailPage />} />
            <Route path="/kategori-tag/archived" element={<KategoriTagArchivedPage title="Arsip" />} />
            <Route path="/kategori-tag/ungrouped" element={<KategoriTagArchivedPage title="Belum di-assign" showCreateButton />} />
            <Route path="/daftar-lainnya/jadwal-berulang" element={<JadwalBerulangPage />} />
            <Route path="/daftar-lainnya/daftar-transaksi" element={<DaftarTransaksiPage />} />
            <Route path="/daftar-lainnya/kategori-produk" element={<KategoriProdukPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/audits" element={<AuditsPage />} />
            <Route path="/inventory-recalculation" element={<InventoryRecalculationPage />} />
            <Route path="/attachments" element={<AttachmentsPage />} />
            <Route path="/importexport" element={<ImportExportPage />} />
            <Route path="/pajak" element={<Pajak />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cara-pembayaran" element={<CaraPembayaran />} />
            <Route path="/syarat-pembayaran" element={<SyaratPembayaran />} />
            <Route path="/buat-pajak-baru" element={<BuatPajakBaru />} />
            <Route path="/edit-pajak" element={<EditPajak />} />
            <Route path="/data-migrasi" element={<DataMigrasi />} />
            <Route path="/pengaturan-perusahaan" element={<PengaturanPerusahaan />} />
            <Route path="/master-data/akun" element={<MasterData1 />} />
            <Route path="/master-data/produk" element={<MasterData2 />} />
            <Route path="/master-data/kontak" element={<MasterData3 />} />
            <Route path="/transaksi/data-penjualan" element={<Transaksi1 />} />
            <Route path="/transaksi/data-pembelian" element={<Transaksi2 />} />
            <Route path="/transaksi/biaya" element={<Transaksi3 />} />
            <Route path="/atur-saldo-coa" element={<AturSaldoCoa />} />
            <Route path="/beranda" element={<Beranda />} />
            <Route path="/settings/*" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
            <Route path="/daftar-akun" element={<DaftarAkunPage />} />
            <Route path="/tutup-buku" element={<TutupBukuPage />} />
            <Route path="/jurnal-umum" element={<JurnalUmumPage />} />
            <Route path="/aset" element={<AsetPage />} />
            <Route path="/aset/simpan" element={<SimpanAsetPage />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/anggaran" element={<Anggaran />} />
            <Route path="/anggaran/rincian-anggaran" element={<RincianAnggaran />} />
            <Route path="/laporan/neraca" element={<Neraca />} />
            <Route path="/laporan/laba-rugi" element={<LabaRugi />} />
            <Route path="/laporan/arus-kas" element={<ArusKas />} />
            <Route path="/laporan/perubahan-modal" element={<PerubahanModal />} />
            <Route path="/laporan/buku-besar" element={<BukuBesar />} />
            <Route path="/laporan/jurnal" element={<Jurnal />} />
            <Route path="/laporan/neraca-saldo" element={<NeracaSaldo />} />
            <Route path="/laporan/ringkasan-bisnis" element={<RingkasanBisnis />} />
            <Route path="/laporan/manajemen-anggaran" element={<Anggaran />} />
            <Route path="/laporan/daftar-penjualan" element={<DaftarPenjualan />} />
            <Route path="/laporan/piutang-pelanggan" element={<PiutangPelanggan />} />
            <Route path="/laporan/pengiriman-penjualan" element={<PengirimanPenjualan />} />
            <Route path="/laporan/penjualan-per-pelanggan" element={<PenjualanPerPelanggan />} />
            <Route path="/laporan/penjualan-per-produk" element={<PenjualanPerProduk />} />
            <Route path="/laporan/penyelesaian-pesanan-penjualan" element={<PenyelesaianPesananPenjualan />} />
            <Route path="/laporan/profitabilitas-produk" element={<ProfitabilitasProduk />} />
            <Route path="/laporan/usia-piutang" element={<UsiaPiutang />} />
            <Route path="/laporan/daftar-faktur-proforma" element={<DaftarFakturProforma />} />
            <Route path="/laporan/daftar-tukar-faktur" element={<DaftarTukarFaktur />} />
            <Route path="/laporan/daftar-pembelian" element={<DaftarPembelian />} />
            <Route path="/laporan/pembelian-per-supplier" element={<PembelianPerSupplier />} />
            <Route path="/laporan/utang-supplier" element={<UtangSupplier />} />
            <Route path="/laporan/daftar-pengeluaran" element={<DaftarPengeluaran />} />
            <Route path="/laporan/detail-pengeluaran" element={<DetailPengeluaran />} />
            <Route path="/laporan/usia-utang" element={<UsiaUtang />} />
            <Route path="/laporan/pengiriman-pembelian" element={<PengirimanPembelian />} />
            <Route path="/laporan/pembelian-per-produk" element={<PembelianPerProduk />} />
            <Route path="/laporan/penyelesaian-pesanan-pembelian" element={<PenyelesaianPesananPembelian />} />
            <Route path="/laporan/tingkat-pemenuhan-pesanan" element={<TingkatPemenuhanPesanan />} />
            <Route path="/laporan/perputaran-persediaan-barang" element={<PerputaranPersediaanBarang />} />
            <Route path="/laporan/ringkasan-persediaan-barang" element={<RingkasanPersediaanBarang />} />
            <Route path="/laporan/kuantitas-stok-gudang" element={<KuantitasStokGudang />} />
            <Route path="/laporan/nilai-persediaan-barang" element={<NilaiPersediaanBarang />} />
            <Route path="/laporan/nilai-stok-gudang" element={<NilaiStokGudang />} />
            <Route path="/laporan/detail-persediaan-barang" element={<DetailPersediaanBarang />} />
            <Route path="/laporan/pergerakan-barang-gudang" element={<PergerakanBarangGudang />} />
            <Route path="/laporan/kuantitas-produk-no-seri" element={<KuantitasProdukNomorSeri />} />
            <Route path="/laporan/gudang-produk-bernomor-seri" element={<GudangProdukBernomorSeri />} />
            <Route path="/laporan/ringkasan-aset-tetap" element={<RingkasanAsetTetap />} />
            <Route path="/laporan/detail-aset-tetap" element={<DetailAsetTetap />} />
            <Route path="/laporan/penjualan-pelepasan-aset" element={<LaporanPenjualanPelepasanAset />} />
            <Route path="/laporan/ringkasan-rekonsiliasi-bank" element={<RingkasanRekonsiliasi />} />
            <Route path="/laporan/mutasi-rekening-koran" element={<MutasiRekeningKoran />} />
            <Route path="/laporan/pajak-pemotongan" element={<LaporanPajakPemotongan />} />
            <Route path="/laporan/pajak-penjualan" element={<LaporanPajakPenjualan />} />
            <Route path="/laporan/:reportId" element={<PembelianPerProduk />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;