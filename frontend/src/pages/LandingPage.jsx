import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Heading, HStack, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import {
  ArrowRight, CaretDown, Rocket, Buildings, Scales, Plug, ShieldCheck, Sparkle, Receipt,
  ChartLineUp, Bank, Lock, CloudArrowUp, Users, Quotes, Fingerprint, Coins, Gauge,
} from "@phosphor-icons/react";
import AnimatedContent from "./AnimatedContent";
import brandFooter from "@/assets/Ino-Finance-Footer.png";
import dashboardHighlight from "@/assets/dashboard-highlight.png";
import ctaBg from "@/assets/cta.jpg";
import brandLogoWhite from "@/assets/Ino-Finance-Footer.png";
import brandLogoBlack from "@/assets/Ino-Finance.png";
import AccordionGallery from "./AccordionGallery";
import galleryImg1 from "@/assets/Accounting-1.jpg";
import galleryImg2 from "@/assets/Accounting-2.jpg";
import galleryImg3 from "@/assets/Accounting-3.jpg";
import galleryImg4 from "@/assets/Accounting-4.jpg";
import galleryImg5 from "@/assets/Accounting-5.jpg";

const C = {
  ink: "#484848ff", navy: "#090D16", navy2: "#0B1120", line: "#E2E8F0", mute: "#475569", soft: "#94A3B8",
  sky: "#0284C7", skyHover: "#0e78acfa", sky500: "#0EA5E9", sky300: "#7DD3FC", sky400: "#38BDF8", bg: "#F8FAFC", green: "#34D399",
};
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const MONO = "ui-monospace, 'Liberation Mono', monospace";
const EASE = "cubic-bezier(0.25, 1, 0.8, 1)";

const navLinks = [
  { label: "Home", id: "home" }, { label: "Solusi", id: "solusi" },
  { label: "Fitur", id: "fitur" }, { label: "FAQ", id: "faq" },
];

const Reveal = ({ children, ...p }) => (
  <AnimatedContent distance={60} duration={0.8} ease="power3.out" threshold={0.1} {...p}>
    {children}
  </AnimatedContent>
);

const NavLink = ({ children, onClick, scrolled, isDarkSection }) => (
  <Box
    as="button" className="group" position="relative" overflow="hidden"
    fontSize="sm" fontWeight="600" onClick={onClick}
    color={isDarkSection ? "white" : (scrolled ? C.mute : "white")}
    transition={`color 100ms ${EASE}`}
    _hover={{ color: isDarkSection ? C.sky300 : (scrolled ? C.sky : C.sky300) }}
  >
    <Text as="span" display="block" transition={`transform 500ms ${EASE}`} _groupHover={{ transform: "translateY(-100%)" }}>
      {children}
    </Text>
    <Text
      as="span" aria-hidden display="block" position="absolute" left={0} top={0}
      transform="translateY(100%)" transition={`transform 500ms ${EASE}`}
      _groupHover={{ transform: "translateY(0)" }}
    >
      {children}
    </Text>
  </Box>
);

const solutions = [
  { icon: Rocket, tag: "Startup & Agresif", title: "Startup & Skala Cepat", desc: "Pembukuan kas harian otomatis, pemantauan runway dan burn rate real-time, serta integrasi langsung payment gateway e-commerce." },
  { icon: Buildings, tag: "Multi-Entitas", title: "Korporasi & Multi-Cabang", desc: "Buku besar multi-entitas, konsolidasi mata uang asing otomatis, alur persetujuan PO/Invoice berjenjang, dan tata kelola grup." },
  { icon: Scales, tag: "KAP & Pajak", title: "Akuntan Publik & Konsultan Pajak", desc: "Laporan keuangan standar PSAK/IFRS, audit trail digital anti-manipulasi, serta integrasi e-Faktur dan pelaporan pajak langsung.", dark: true },
];

const cases = [
  { tag: "FINTECH SCALEUP JAKARTA", title: "Valuasi $50M", desc: "Rekonsiliasi 100k transaksi harian otomatis dengan tingkat akurasi 99,99% dan closing bulanan instan." },
  { tag: "GLOBAL COMMERCE INDONESIA", title: "Multi-Currency & Pajak", desc: "Multi-Currency Journaling real-time, sinkronisasi PPh 21/23 serta pembuatan e-Faktur otomatis terintegrasi DJP." },
  { tag: "LOGISTIK & DISTRIBUSI NASIONAL", title: "120 Cabang Terkonsolidasi", desc: "Pencatatan kas kecil, manajemen biaya armada, dan laporan konsolidasi grup dalam satu dasbor terpusat." },
  { tag: "KONSULTAN KEUANGAN & AUDIT", title: "Standardisasi PSAK", desc: "Penyusunan kertas kerja audit cepat dengan digital audit trail yang tak dapat dimanipulasi siapapun.", green: true },
];

const hubTools = ["Faktur & Invoice", "Bank API Sync", "Payroll & BPJS", "e-Faktur DJP"];
const galleryItems = [
  { image: galleryImg1, label: 'Penjualan', link: '#' },
  { image: galleryImg2, label: 'Pembelian', link: '#' },
  { image: galleryImg3, label: 'Jurnal Umum', link: '#' },
  { image: galleryImg4, label: 'Laporan Laba Rugi', link: '#' },
  { image: galleryImg5, label: 'Customer', link: '#' }
];

const steps = [
  { title: "Hubungkan Akun Bank", desc: "Koneksikan rekening bank korporat dan payment gateway melalui integrasi API terenkripsi 256-bit berstandar perbankan.", badge: "API Terenkripsi 256-bit" },
  { title: "Kustomisasi Bagan Akun", desc: "Sesuaikan Chart of Accounts (COA), multi-mata uang, dan struktur cost center dengan template standar industri kamu.", badge: "Standar PSAK / Kustom" },
  { title: "Otomasi Jurnal Transaksi", desc: "Setiap transaksi masuk, keluar, dan faktur klien dijurnal secara otomatis ke debit/kredit tanpa entri manual.", badge: "Entri Ganda Otomatis" },
  { title: "Terbitkan Laporan Neraca", desc: "Hasilkan laporan neraca, laba rugi, dan arus kas komprehensif dalam satu klik, siap dibagikan ke dewan direksi.", badge: "Laporan Real-Time" },
];

const features = [
  { icon: Fingerprint, title: "Audit Trail 100% Terverifikasi (Log Aktivitas Tak Terhapus)", desc: "Setiap perubahan jurnal, pembatalan invoice, dan persetujuan pengeluaran dicatat dengan timestamp kriptografis yang tidak dapat diedit atau dihapus oleh siapapun.", span: 2, extra: "audit" },
  { icon: Sparkle, title: "Dukungan AI Forecasting & Deteksi Anomali", desc: "Model cerdas siap ChatGPT & Gemini untuk memproyeksikan arus kas dan menandai transaksi janggal secara instan.", extra: "ai" },
  { icon: Receipt, title: "Multi-Currency & Pajak Otomatis", desc: "Kalkulasi otomatis PPh 21, PPh 23, PPh Final, dan integrasi ekspor e-Faktur PPN yang patuh regulasi perpajakan Indonesia.", extra: "tax" },
  { icon: ChartLineUp, title: "Dashboard Arus Kas Real-Time", desc: "Pantau saldo kas operasional, tagihan jatuh tempo, dan Aging Accounts Receivable (AR/AP) dalam grafik dinamis." },
  { icon: Bank, title: "Integrasi API Bank & Payment Gateway", desc: "Koneksi instan Bank Mandiri, BCA, BRI, BNI, Stripe, Xendit, dan Midtrans untuk rekonsiliasi mutasi tanpa unggah CSV manual.", extra: "bank" },
];

const security = [
  { icon: Lock, title: "Enkripsi Tingkat Perbankan (AES-256)", desc: "Seluruh data pembukuan dan kredensial bank dienkripsi saat transit (TLS 1.3) maupun saat istirahat dengan enkripsi AES-256." },
  { icon: ShieldCheck, title: "Sertifikasi SOC-2 & ISO 27001", desc: "Infrastruktur cloud teraudit secara berkala untuk memenuhi standar kepatuhan tata kelola dan privasi informasi korporasi global." },
  { icon: CloudArrowUp, title: "Cadangan Data Otomatis Harian", desc: "Snapshot data buku besar dicadangkan di multi-region redundan sehingga kontinuitas bisnis tetap terjamin 99,99% SLA." },
  { icon: Users, title: "Hak Akses Berbasis Peran (RBAC) Ketat", desc: "Atur wewenang persetujuan transfer, akses viewing laporan, dan modifikasi jurnal berdasar jabatan staf finance secara granular." },
];

const faqs = [
  { q: "Apakah Jurnal ERP ini sesuai dengan standar akuntansi Indonesia (PSAK)?", a: "Ya. Laporan keuangan disusun mengikuti PSAK dan IFRS, termasuk PSAK 71 dan 73, lengkap dengan audit trail digital." },
  { q: "Bagaimana keamanan data finansial dan riwayat transaksi perusahaan kami?", a: "Data dienkripsi AES-256 saat disimpan dan TLS 1.3 saat dikirim, dilindungi RBAC ketat, serta dicadangkan otomatis setiap hari di multi-region." },
  { q: "Berapa lama proses migrasi data dari software akuntansi lama (seperti Excel/SAP/QuickBooks)?", a: "Untuk bisnis kecil sampai menengah, migrasi umumnya selesai dalam hitungan hari. Tim kami membantu memetakan COA dan saldo awal." },
  { q: "Apakah mendukung multi-cabang dan multi-entitas perusahaan?", a: "Ya. Setiap entitas punya buku besar sendiri, dan laporan dapat dikonsolidasikan otomatis termasuk konversi mata uang asing." },
];

const articles = [
  { meta: "Manajemen Keuangan · 8 menit baca", title: "Strategi Optimasi Modal Kerja & Arus Kas untuk Perusahaan B2B", desc: "Langkah taktis mempercepat perputaran piutang (DSO) dan menjaga likuiditas operasional dalam iklim ekonomi dinamis." },
  { meta: "Perpajakan Digital · 7 menit baca", title: "Panduan Kepatuhan Pajak Digital & Penerapan e-Faktur Terkini", desc: "Menghindari sanksi administrasi dengan sinkronisasi langsung antara modul penjualan ERP dan sistem perpajakan DJP." },
  { meta: "Teknologi Finansial · 10 menit baca", title: "Masa Depan AI dalam Rekonsiliasi Akuntansi Finansial Otomatis", desc: "Bagaimana algoritma machine learning menggantikan pekerjaan manual berulang dan meningkatkan ketelitian closing akhir tahun." },
];

const footerCols = [
  { h: "SOLUSI", items: ["Untuk Startup Finansial", "Korporasi & Multi-Cabang", "KAP & Konsultan Pajak", "Scaleup B2B SaaS"] },
  { h: "FITUR", items: ["Jurnal Umum & Buku Besar", "Rekonsiliasi Bank API", "e-Faktur & Pajak Otomatis", "Audit Trail Digital", "Konsolidasi Multi-Mata Uang"] },
  { h: "PERUSAHAAN", items: ["Tentang Jurnal ERP", "Kemitraan Perbankan", "Blog & Studi Kasus", "Karir Tim FinTech"] },
  { h: "KEPATUHAN & LEGALITAS", items: ["Keamanan ISO 27001", "Laporan SOC-2 Type II", "Standar PSAK & IFRS", "SLA & Ketentuan Layanan"] },
];

const Eyebrow = ({ children, color = C.sky }) => (
  <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={color} textAlign="center">{children}</Text>
);
const Title = ({ children, dark, size = "4xl" }) => (
  <Heading as="h2" fontSize={{ base: "2xl", md: size === "4xl" ? "4xl" : "3xl" }} lineHeight="1.1" fontWeight="700" color={dark ? "white" : C.ink} textAlign="center" fontFamily={FONT}>{children}</Heading>
);
const Pill = ({ children, color = C.sky300, border = "rgba(56,189,248,.25)" }) => (
  <Box px={3} py={1} borderRadius="full" bg="rgba(2,6,23,.8)" border="1px solid" borderColor={border} backdropFilter="blur(12px)" fontSize="11px" fontWeight="600" color={color}>{children}</Box>
);
const CtaBtn = ({ children, onClick, size = "lg", outline, ...rest }) => (
  <Button
    size={size} borderRadius="full" px={8} fontWeight="700" onClick={onClick}
    bg={outline ? "transparent" : C.sky500} color={outline ? "#E2E8F0" : "white"}
    border={outline ? "1px solid #334155" : "none"}
    shadow={outline ? "none" : "0 20px 25px -5px rgba(14,165,233,.3)"}
    _hover={{ bg: outline ? "whiteAlpha.100" : C.sky }} {...rest}
  >
    {children} {!outline && <ArrowRight size={16} weight="bold" />}
  </Button>
);
const TextLink = ({ children, onClick }) => (
  <HStack gap={1.5} color={C.sky} fontSize="sm" fontWeight="600" cursor="pointer" onClick={onClick}>
    <Text>{children}</Text><ArrowRight size={14} weight="bold" />
  </HStack>
);

function Marquee() {
  const [paused, setPaused] = useState(false);
  return (
    <Box overflow="hidden" w="full" pt={8} pb={4} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <style>{`@keyframes jerp-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.jerp-track{animation:none!important}}`}</style>
      <HStack className="jerp-track" gap={6} align="stretch" w="max-content" style={{ animation: "jerp-scroll 40s linear infinite", animationPlayState: paused ? "paused" : "running" }}>
        {[...cases, ...cases].map((c, i) => (
          <VStack key={i} align="start" gap={1.5} w="380px" p={6} borderRadius="2xl" bg="rgba(11,17,32,.8)" border="1px solid #1E293B" flexShrink={0}>
            <Text fontFamily={MONO} fontSize="xs" color={c.green ? C.green : C.sky400}>{c.tag}</Text>
            <Text fontWeight="700" color="white">{c.title}</Text>
            <Text fontSize="xs" color={C.soft} lineHeight="1.6">{c.desc}</Text>
          </VStack>
        ))}
      </HStack>
    </Box>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <Box w="full" bg="white" borderRadius="2xl" border="1px solid" borderColor={C.line} overflow="hidden">
      <HStack as="button" w="full" justify="space-between" px={6} py={5} textAlign="left" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Text fontWeight="700" color="#0F172A">{q}</Text>
        <Box color={C.soft} transform={open ? "rotate(180deg)" : "none"} transition="transform 200ms" flexShrink={0}><CaretDown size={20} /></Box>
      </HStack>
      {open && <Text px={6} pb={5} fontSize="sm" color={C.mute} lineHeight="1.7">{a}</Text>}
    </Box>
  );
}

function FeatureExtra({ type }) {
  const box = { w: "full", p: 4, bg: "white", borderRadius: "2xl", border: "1px solid", borderColor: C.line };
  if (type === "audit")
    return (
      <Box w="full" p={4} bg={C.navy} borderRadius="2xl" fontFamily={MONO} fontSize="11px" overflowX="auto">
        <HStack justify="space-between" gap={4} pb={2} borderBottom="1px solid #1E293B" color={C.soft} minW="560px">
          <Text>TIMESTAMP</Text><Text>PENGGUNA</Text><Text>AKSI JURNAL</Text><Text>STATUS</Text>
        </HStack>
        <HStack justify="space-between" gap={4} pt={2} minW="560px">
          <Text color={C.green}>2026-03-30 09:14:02</Text><Text color="white">finance_lead@corp.id</Text>
          <Text color={C.green}>POSTING: JRN-88219 (IDR 2.45B)</Text>
          <Box px={2} bg="#022C22" borderRadius="sm" border="1px solid rgba(16,185,129,.4)" color={C.green}>VERIFIED</Box>
        </HStack>
        <HStack justify="space-between" gap={4} pt={2} minW="560px">
          <Text color={C.sky300}>2026-03-30 09:11:45</Text><Text color="white">api_bank_mandiri</Text>
          <Text color={C.sky300}>AUTO-MATCH: INV-99021 (SETTLED)</Text>
          <Box px={2} borderRadius="sm" border="1px solid rgba(14,165,233,.4)" color={C.sky300}>RECONCILED</Box>
        </HStack>
      </Box>
    );
  if (type === "ai")
    return (
      <Box {...box}>
        <HStack color={C.sky} gap={1.5} mb={2}><Sparkle size={14} weight="fill" /><Text fontSize="xs" fontWeight="700">AI Financial Intelligence</Text></HStack>
        <Text fontSize="11px" color="#64748B">“Peringatan: Pola pengeluaran vendor server naik 18% di atas proyeksi kuartal.”</Text>
      </Box>
    );
  if (type === "tax")
    return (
      <HStack {...box} justify="space-between">
        <Box><Text fontSize="xs" color="#64748B">Kalkulasi e-Faktur PPN 11%</Text><Text fontWeight="700" color="#0F172A">IDR 247.500.000</Text></Box>
        <Box px={3} py={1} borderRadius="full" bg="#F0F9FF" border="1px solid #BAE6FD" color="#0369A1" fontSize="xs" fontWeight="700">Siap Ekspor</Box>
      </HStack>
    );
  if (type === "bank")
    return (
      <Box {...box} p={3} fontFamily={MONO} fontSize="xs" color="#334155">BCA API · Mandiri Corporate · Stripe Sync</Box>
    );
  return null;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const register = () => navigate("/register");

  const [scrolled, setScrolled] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);

    const onScroll = () => {
      const isScrolled = window.scrollY > 24;
      setScrolled(isScrolled);

      const darkSections = ["home", "section-dark-1", "section-dark-2", "section-dark-3"];
      const navHeight = 70;

      const isOnDark = darkSections.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= navHeight && rect.bottom >= 0;
      });

      setIsDarkSection(isOnDark);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box bg="white" fontFamily={FONT} color={C.ink}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <Box
        as="header"
        position="fixed" top={0} left={0} right={0} zIndex={20}
        w="full"
        color={isDarkSection ? "white" : C.ink}
        transition={`color 100ms ${EASE}`}
      >
        <Box
          aria-hidden
          position="absolute" top={0} left={0} w="full" h="full" zIndex={-1}
          pointerEvents="none"
          bg={
            !scrolled
              ? "transparent"
              : isDarkSection
                ? "rgba(9, 13, 22, 0.7)"
                : "rgba(255, 255, 255, 0.6)"
          }
          backdropFilter={scrolled ? "blur(20px)" : "none"}
          borderBottom={
            !scrolled
              ? "1px solid transparent"
              : isDarkSection
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(226,232,240,0.5)"
          }
          boxShadow={
            scrolled
              ? (isDarkSection
                ? "0 10px 30px -18px rgba(0, 132, 255, 1)"
                : "0 4px 20px -3px rgba(0, 0, 0, 0.4)"
              )
              : "none"
          }
          transition={`opacity 500ms ${EASE}, box-shadow 500ms ${EASE}, background-color 500ms ${EASE}`}
        />

        <Box as="nav" position="relative" mx="auto" w="full" px={{ base: 4, md: 8, lg: 10 }} py={4}>
          <HStack justify="space-between" align="center" w="full" h="full">
            <Box
              position="relative"
              h="70px"
              cursor="pointer"
              onClick={() => go("home")}
            >
              <Box
                as="img"
                src={brandLogoWhite}
                alt="Jurnal ERP"
                h="70px"
                display="block"
                opacity={isDarkSection || !scrolled ? 1 : 0}
                transition={`opacity 500ms ${EASE}`}
              />
              <Box
                as="img"
                src={brandLogoBlack}
                alt=""
                aria-hidden
                h="70px"
                position="absolute" top={0} left={0}
                pointerEvents="none"
                opacity={!isDarkSection && scrolled ? 1 : 0}
                transition={`opacity 500ms ${EASE}`}
              />
            </Box>

            <HStack gap={8} display={{ base: "none", md: "flex" }}>
              {navLinks.map((l) => (
                <NavLink key={l.id} onClick={() => go(l.id)} scrolled={scrolled} isDarkSection={isDarkSection}>
                  {l.label}
                </NavLink>
              ))}
            </HStack>

            <HStack gap={6}>
              <Button
                variant="ghost" size="sm" fontWeight="500"
                color={isDarkSection ? "white" : C.ink}
                _hover={{
                  color: C.sky,
                  bg: "transparent"
                }}
                transition={`background 400ms ${EASE}`}
                onClick={() => navigate("/login")}
              >
                Masuk
              </Button>
              <Button
                size="sm"
                fontWeight="600"
                borderRadius="full"
                px={6}
                bg={C.sky}
                color="white"
                height="40px"
                shadow="0 8px 18px rgba(14, 164, 233, 0.43)"
                _hover={{ bg: C.skyHover }}
                transition={`all 300ms ${EASE}`}
                onClick={register}
              >
                Mulai Sekarang
              </Button>
            </HStack>
          </HStack>
        </Box>
      </Box>

      <Box id="home" position="relative" overflow="hidden" color="white" pt={{ base: 36, md: 44 }} pb={{ base: 20, md: 32 }}>
        <Box as="img" src={ctaBg} alt="" position="absolute" inset={0} w="full" h="full" objectFit="cover" />
        <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(2,6,23,.7), rgba(2,6,23,.86))" />
        <Box position="absolute" top="-160px" left="22%" w="700px" h="500px" borderRadius="full" bg="rgba(14,165,233,.2)" filter="blur(130px)" />
        <Box position="absolute" top="312px" right="8%" w="384px" h="384px" borderRadius="full" bg="rgba(56,189,248,.1)" filter="blur(100px)" />
        <Container maxW="5xl" position="relative" zIndex={1}>
          <Reveal
            trigger="mount" stagger={0.12} distance={40}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center" }}
          >
            <Heading as="h1" fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }} lineHeight="1" fontWeight="700" maxW="896px">
              Jurnal ERP Keuangan Modern. <Text as="span" color={C.sky300}>Dibangun untuk Pertumbuhan</Text> Bisnis Kamu.
            </Heading>
            <Text fontSize={{ base: "md", md: "xl" }} color="#CBD5E1" maxW="768px" lineHeight="1.4">
              Kelola pembukuan umum, rekonsiliasi bank instan, pengelolaan produk, dan kepatuhan pajak dalam satu ekosistem terpadu — cepat, akurat, dan berstandar audit global.
            </Text>
            <Stack direction={{ base: "column", sm: "row" }} gap={4} align="center" pt={2}>
              <CtaBtn onClick={register}>Mulai Sekarang</CtaBtn>
              <Text fontSize="sm" fontWeight="600" color={C.soft}>Eksplorasi modul lengkap secara gratis.
                Siap pakai kapan pun & dimana pun.</Text>
            </Stack>
          </Reveal>
        </Container>
      </Box>

      <Box py={{ base: 16, md: 28 }}>
        <Reveal>
          <Container maxW="3xl">
            <VStack gap={4} textAlign="center">
              <Eyebrow>Pilar Utama Akuntansi Modern</Eyebrow>
              <Title>Ketepatan pembukuan dimulai dari sistem ERP yang terintegrasi.</Title>
              <Text color={C.mute} fontSize="lg" maxW="2xl" pb={6}>
                Otomasi jurnal entri ganda, pencatatan transaksi real-time, dan konsolidasi laporan laba rugi antar anak perusahaan tanpa rekonsiliasi manual yang melelahkan.
              </Text>
              <Box w="full" pt={2}>
                <AccordionGallery
                  items={galleryItems}
                  defaultIndex={2}
                  expandRatio={0.52}
                  trigger="hover"
                  accentColor="#ffffff"
                  overlayColor="#060010"
                  textColor="#ffffff"
                  grayscale
                  showLabels
                  duration={0.6}
                  ease="power3.out"
                  parallax={0.5}
                  tilt={8}
                  stagger={0.06}
                  height={460}
                  gap={10}
                  radius={16}
                  orientation="horizontal"
                />
              </Box>
            </VStack>
          </Container>
        </Reveal>
      </Box>

      <Box id="solusi" scrollMarginTop="50px" py={24} bg={C.bg} borderTop="1px solid" borderColor="rgba(226,232,240,.8)">
        <Container maxW="6xl">
          <VStack gap={14}>
            <Reveal>
              <VStack gap={2}><Eyebrow>Dirancang untuk Setiap Kebutuhan Finansial</Eyebrow><Title size="3xl">Solusi yang Tumbuh Bersama Skala Bisnis Kamu.</Title></VStack>
            </Reveal>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="full">
              {solutions.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.12} style={{ height: "100%" }}>
                  <VStack h="full" align="stretch" gap={0} bg="white" borderRadius="3xl" border="1px solid" borderColor={C.line} overflow="hidden" shadow="xs">
                    <Box h="256px" position="relative" bg={s.dark ? "#0F172A" : "linear-gradient(135deg,#E0F2FE,#F0F9FF)"} display="flex" alignItems="center" justifyContent="center" color={s.dark ? C.sky400 : C.sky}>
                      <s.icon size={72} weight="duotone" />
                      <Box position="absolute" top={4} left={4}><Pill color={s.dark ? "#6EE7B7" : C.sky300} border={s.dark ? "rgba(52,211,153,.2)" : undefined}>{s.tag}</Pill></Box>
                    </Box>
                    <VStack align="start" gap={3} p={8} flex={1}>
                      <Heading as="h3" fontSize="xl" fontWeight="700">{s.title}</Heading>
                      <Text fontSize="sm" color={C.mute} lineHeight="1.7" flex={1}>{s.desc}</Text>
                      <TextLink onClick={register}>Mulai Sekarang</TextLink>
                    </VStack>
                  </VStack>
                </Reveal>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box id="section-dark-1" py={24} bg={C.navy} overflow="hidden">
        <Container maxW="6xl">
          <VStack gap={12} align="stretch">
            <Reveal>
              <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ md: "flex-end" }} gap={4}>
                <VStack align="start" gap={2}>
                  <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={C.sky400}>Arsitektur Keuangan Terpadu</Text>
                  <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} color="white" maxW="560px">Arsitektur Keuangan yang Ditenagai Jurnal ERP.</Heading>
                </VStack>
                <Text fontSize="xs" color={C.soft}>Kapasitas jutaan transaksi dengan latensi sub-detik</Text>
              </Stack>
            </Reveal>
            <Reveal delay={0.15} distance={80}>
              <Box position="relative" borderRadius="3xl" overflow="hidden" border="1px solid #1E293B" bg={C.navy2} shadow="2xl">
                <Box as="img" src={dashboardHighlight} alt="Dashboard Jurnal ERP" w="full" h={{ base: "320px", md: "520px" }} objectFit="cover" objectPosition="top" />
                <Box position="absolute" inset={0} bg="linear-gradient(0deg,#090D16 0%,rgba(9,13,22,.4) 50%,rgba(9,13,22,0) 100%)" p={{ base: 5, md: 10 }} display="flex" alignItems="flex-end" justifyContent="space-between" gap={4}>
                  <VStack align="start" gap={1} maxW="560px">
                    <Box px={3} py="3px" borderRadius="full" bg="rgba(14,165,233,.2)" border="1px solid rgba(56,189,248,.3)" fontFamily={MONO} fontSize="xs" color={C.sky300}>Pusat Kendali Keuangan Enterprise</Box>
                    <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="700" color="white">Konsolidasi Neraca & Kepatuhan Pajak Multi-Mata Uang</Text>
                    <Text fontSize="sm" color="#CBD5E1" display={{ base: "none", md: "block" }}>Pemantauan ledger transaksi antar negara dengan konversi kurs tengah BI otomatis.</Text>
                  </VStack>
                  <HStack gap={2} flexShrink={0}><Box w="10px" h="10px" borderRadius="full" bg={C.green} /><Text fontFamily={MONO} fontSize="xs" color="#6EE7B7">Live Sync Aktif</Text></HStack>
                </Box>
              </Box>
            </Reveal>
          </VStack>
        </Container>
        <Reveal delay={0.2}>
          <Marquee />
        </Reveal>
      </Box>

      <Box py={24} bg={C.bg} borderBottom="1px solid" borderColor={C.line}>
        <Reveal>
          <Container maxW="4xl">
            <VStack gap={6} textAlign="center">
              <Box w="48px" h="48px" borderRadius="full" bg="#E0F2FE" color={C.sky} display="flex" alignItems="center" justifyContent="center"><Quotes size={24} weight="fill" /></Box>
              <Heading as="blockquote" fontSize={{ base: "xl", md: "4xl" }} lineHeight="1.15" fontWeight="600" color="#0F172A">
                “Sejak beralih ke Jurnal ERP, waktu closing pembukuan akhir bulan kami berkurang dari 14 hari menjadi hanya 2 jam. Visibilitas arus kas real-time mengubah cara direksi mengambil keputusan finansial.”
              </Heading>
              <VStack gap={0}>
                <Box w="56px" h="56px" borderRadius="full" bg={C.line} border="2px solid" borderColor={C.sky500} display="flex" alignItems="center" justifyContent="center" fontWeight="700" color="#334155" mb={3}>HW</Box>
                <Text fontWeight="700">Hendra Wijaya</Text>
                <Text fontSize="xs" color="#64748B">CFO & Partner Finansial</Text>
              </VStack>
            </VStack>
          </Container>
        </Reveal>
      </Box>

      <Box py={24}>
        <Reveal>
          <Container maxW="6xl">
            <Stack direction={{ base: "column", lg: "row" }} gap={16} align="center">
              <VStack align="start" gap={4} flex={1}>
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={C.sky}>Efisiensi Tanpa Friksi</Text>
                <Heading as="h2" fontSize={{ base: "3xl", md: "5xl" }} lineHeight="1" fontWeight="700">
                  Sistem Keuangan Tersebar? <Text as="span" color={C.sky}>Satukan dalam Satu Buku Besar.</Text>
                </Heading>
                <Text fontSize="lg" color={C.mute} lineHeight="1.6" pt={2}>Spreadsheet manual untuk kas harian. Aplikasi terpisah untuk penagihan invoice. Portal bank yang membingungkan untuk mutasi rekening. Data kamu berserakan, memicu selisih pembukuan dan membuang waktu tim finance setiap akhir bulan.</Text>
                <Text fontSize="lg" fontWeight="600" color="#0F172A" pb={3}>Satu pusat kendali untuk Invoice, Payroll, Rekonsiliasi Bank API, Manajemen Aset, dan Laporan Pajak.</Text>
                <CtaBtn size="md" bg={C.sky} onClick={register}>Konsolidasi Akun Keuangan Kamu</CtaBtn>
              </VStack>
              <Box flex={1} w="full" p={8} bg={C.bg} borderRadius="3xl" border="1px solid" borderColor={C.line} shadow="xl">
                <Box bg={C.navy} borderRadius="2xl" p={6}>
                  <SimpleGrid columns={2} gap={4}>
                    {hubTools.map((t) => (
                      <HStack key={t} bg="white" borderRadius="2xl" p={3.5} gap={2}><Plug size={18} color={C.sky} /><Text fontSize="xs" fontWeight="700" color="#1E293B">{t}</Text></HStack>
                    ))}
                  </SimpleGrid>
                  <VStack mt={4} mx="auto" maxW="210px" p={6} borderRadius="3xl" bg="rgba(255,255,255,.95)" gap={1}>
                    <Box w="48px" h="48px" borderRadius="2xl" bg={C.sky} color="white" display="flex" alignItems="center" justifyContent="center"><Gauge size={24} /></Box>
                    <Text pt={1.5} fontSize="xs" fontWeight="700">Jurnal ERP Central</Text>
                    <Text fontFamily={MONO} fontSize="11px" color={C.sky}>Single Source of Truth</Text>
                  </VStack>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Reveal>
      </Box>

      <Box py={24} bg={C.bg} borderY="1px solid" borderColor={C.line}>
        <Container maxW="6xl">
          <VStack gap={16}>
            <Reveal>
              <VStack gap={2}><Eyebrow>Alur Implementasi Cepat</Eyebrow><Title>Dari Onboarding hingga Laporan Finansial Siap Terbit.</Title></VStack>
            </Reveal>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} w="full">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.1} style={{ height: "100%" }}>
                  <VStack h="full" align="stretch" justify="space-between" p={8} bg="white" borderRadius="3xl" border="1px solid" borderColor={C.line} gap={8}>
                    <VStack align="start" gap={2}>
                      <Text fontSize="4xl" fontWeight="800" color="#BAE6FD" lineHeight="1">0{i + 1}</Text>
                      <Heading as="h3" fontSize="lg" pt={2}>{s.title}</Heading>
                      <Text fontSize="sm" color={C.mute} lineHeight="1.7">{s.desc}</Text>
                    </VStack>
                    <Text pt={4} borderTop="1px solid #F1F5F9" fontSize="xs" fontWeight="600" color="#0369A1">{s.badge}</Text>
                  </VStack>
                </Reveal>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box id="fitur" scrollMarginTop="50px" py={24}>
        <Container maxW="6xl">
          <VStack gap={16}>
            <Reveal>
              <VStack gap={2}><Eyebrow>Teknologi Mutakhir Enterprise</Eyebrow><Title>Kelola Keuangan. <Text as="span" color={C.sky}>Raih Kepastian Bisnis.</Text></Title></VStack>
            </Reveal>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
              {features.map((f, i) => (
                <Box key={f.title} gridColumn={{ md: f.span ? "span 2" : "auto" }}>
                  <Reveal delay={(i % 2) * 0.12} style={{ height: "100%" }}>
                    <VStack h="full" align="stretch" justify="space-between" gap={6} p={8} bg={C.bg} borderRadius="3xl" border="1px solid" borderColor={C.line}>
                      <VStack align="start" gap={3}>
                        <Box p={2.5} bg="#E0F2FE" borderRadius="xl" color="#0369A1"><f.icon size={20} /></Box>
                        <Heading as="h3" fontSize="xl" maxW="520px">{f.title}</Heading>
                        <Text fontSize="sm" color={C.mute} lineHeight="1.7" maxW="520px">{f.desc}</Text>
                      </VStack>
                      <FeatureExtra type={f.extra} />
                    </VStack>
                  </Reveal>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box id="section-dark-2" py={24} bg={C.navy}>
        <Container maxW="6xl">
          <VStack gap={16}>
            <Reveal>
              <VStack gap={2}>
                <Eyebrow color={C.sky400}>Keamanan & Integritas Data Finansial</Eyebrow>
                <Title dark>Perlindungan Standar Perbankan, <Text as="span" color={C.sky400}>Terjamin Sejak Awal.</Text></Title>
              </VStack>
            </Reveal>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} w="full">
              {security.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.1} style={{ height: "100%" }}>
                  <VStack h="full" align="start" gap={2} p={6} borderRadius="2xl" bg="rgba(11,17,32,.6)" border="1px solid #1E293B">
                    <Box color={C.sky400}><s.icon size={32} /></Box>
                    <Text pt={2} fontWeight="700" color="white">{s.title}</Text>
                    <Text fontSize="sm" color={C.soft} lineHeight="1.6">{s.desc}</Text>
                  </VStack>
                </Reveal>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box id="faq" scrollMarginTop="70px" py={24} bg={C.bg}>
        <Container maxW="3xl">
          <VStack gap={14}>
            <Reveal>
              <VStack gap={2}><Eyebrow>Pertanyaan Umum</Eyebrow><Title size="3xl">Kerap Ditanyakan Mengenai Jurnal ERP.</Title></VStack>
            </Reveal>
            <VStack gap={4} w="full">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.08} style={{ width: "100%" }}>
                  <FaqItem q={f.q} a={f.a} />
                </Reveal>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      <Box py={24} borderTop="1px solid" borderColor={C.line}>
        <Container maxW="6xl">
          <VStack gap={14} align="stretch">
            <Reveal>
              <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ md: "flex-end" }} gap={4}>
                <VStack align="start" gap={2}>
                  <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={C.sky}>Insight Keuangan & Regulasi</Text>
                  <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} maxW="560px">Wawasan Strategis untuk Pemimpin Finansial.</Heading>
                </VStack>
                <TextLink>Baca semua artikel</TextLink>
              </Stack>
            </Reveal>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
              {articles.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.12} style={{ height: "100%" }}>
                  <VStack h="full" align="start" justify="space-between" gap={5} p={6} bg={C.bg} borderRadius="3xl" border="1px solid" borderColor={C.line}>
                    <VStack align="start" gap={2}>
                      <Text fontSize="xs" fontWeight="600" color={C.sky}>{a.meta}</Text>
                      <Heading as="h3" fontSize="lg" lineHeight="1.4">{a.title}</Heading>
                      <Text fontSize="sm" color={C.mute} lineHeight="1.6">{a.desc}</Text>
                    </VStack>
                    <TextLink>Baca selengkapnya</TextLink>
                  </VStack>
                </Reveal>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box id="section-dark-3" py={24} bg={C.navy} position="relative" overflow="hidden">
        <Box position="absolute" top={0} left="50%" transform="translateX(-50%)" w="600px" h="350px" borderRadius="full" bg="rgba(14,165,233,.2)" filter="blur(120px)" />
        <Container maxW="4xl" position="relative" zIndex={1}>
          <Reveal>
            <VStack gap={6} textAlign="center">
              <Heading as="h2" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1" color="white">Sederhanakan Pembukuan Bisnis Kamu Sekarang.</Heading>
              <Text fontSize="xl" color="#CBD5E1" maxW="xl">Tingkatkan akurasi pembukuan dan percepat pertumbuhan perusahaan dengan Jurnal ERP. Siap pakai dalam hitungan menit tanpa ribet.</Text>
              <Stack direction={{ base: "column", sm: "row" }} gap={4} pt={4}>
                <CtaBtn onClick={register}>Mulai Sekarang Gratis</CtaBtn>
                <CtaBtn outline onClick={() => navigate("/contact")}>Jadwalkan Demo Korporat</CtaBtn>
              </Stack>
            </VStack>
          </Reveal>
        </Container>
      </Box>

      <Box bg={C.navy} borderTop="1px solid #1E293B" pt={20} pb={12}>
        <Container maxW="7xl">
          <VStack gap={16} align="stretch">
            <VStack align="start" gap={3} pb={16} borderBottom="1px solid #1E293B" maxW="672px">
              <Heading as="h3" fontSize="2xl" color="white">Dapatkan Insight Finansial & Regulasi Akuntansi Mingguan</Heading>
              <Text fontSize="sm" color={C.soft}>Kiat perpajakan e-Faktur, template rasio likuiditas CFO, dan rilis fitur ERP mutakhir langsung di inbox email kamu.</Text>
              <HStack as="form" w="full" maxW="448px" gap={3} pt={3} onSubmit={(e) => e.preventDefault()}>
                <Box as="input" type="email" aria-label="Email perusahaan" placeholder="Alamat email perusahaan" flex={1} minW={0} px={5} py={3} borderRadius="full" bg={C.navy2} border="1px solid #334155" color="white" fontSize="sm" outline="none" />
                <Button type="submit" borderRadius="full" px={5} height={"50px"} bg={C.sky500} color="white" _hover={{ bg: C.sky }}>Langganan</Button>
              </HStack>
              <Text fontSize="11px" color="#64748B">Dengan berlangganan, Anda menyetujui Kebijakan Privasi dan Perlindungan Data Finansial kami.</Text>
            </VStack>

            <SimpleGrid columns={{ base: 2, md: 4 }} gap={8}>
              {footerCols.map((col) => (
                <VStack key={col.h} align="start" gap={4}>
                  <Text fontSize="xs" fontWeight="700" letterSpacing="0.05em" color="white">{col.h}</Text>
                  {col.items.map((it) => <Text key={it} fontSize="sm" color={C.soft}>{it}</Text>)}
                </VStack>
              ))}
            </SimpleGrid>

            <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" pt={8} borderTop="1px solid #1E293B" gap={4}>
              <HStack gap={3}>
                <Box as="img" src={brandFooter} h="36px" alt="Jurnal ERP" />
                <Text fontSize="xs" color={C.soft}>© 2026 Inotal Finance Indonesia. Hak cipta dilindungi undang-undang.</Text>
              </HStack>
              <HStack gap={6}>
                <Text as="button" fontSize="xs" color={C.soft} _hover={{ color: "white" }} onClick={() => navigate("/terms")}>Syarat Penggunaan</Text>
                <Text as="button" fontSize="xs" color={C.soft} _hover={{ color: "white" }} onClick={() => navigate("/privacy")}>Kebijakan Privasi</Text>
                <Text as="button" fontSize="xs" color={C.soft} _hover={{ color: "white" }} onClick={() => navigate("/contact")}>Keamanan Data</Text>
              </HStack>
            </Stack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}