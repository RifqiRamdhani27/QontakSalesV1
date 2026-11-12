import { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Heading, HStack, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import {
  ArrowRight, CaretDown, Rocket, ShieldCheck, Sparkle,
  Check, Lock, CloudArrowUp, Users, Quotes, Bank, TreeStructure, Lightning, CertificateIcon
} from "@phosphor-icons/react";
import AnimatedContent from "./AnimatedContent";
import brandFooter from "@/assets/Ino-Finance-Footer.png";
import ctaBg from "@/assets/cta.jpg";
import brandLogoWhite from "@/assets/Ino-Finance-Footer.png";
import brandLogoBlack from "@/assets/Ino-Finance.png";
import AccordionGallery from "./AccordionGallery";
import galleryImg1 from "@/assets/Accounting-1.jpg";
import galleryImg2 from "@/assets/Accounting-2.jpg";
import galleryImg3 from "@/assets/Accounting-3.jpg";
import galleryImg4 from "@/assets/Accounting-4.jpg";
import galleryImg5 from "@/assets/Accounting-5.jpg";
import imgStartup from "@/assets/imgStartup.jpg";
import imgCorporate from "@/assets/imgCorporate.jpg";
import imgAkuntan from "@/assets/imgAkuntan.jpg";
import profilePic from "@/assets/profile-rizal.jpg";
import MagicRings from "./MagicRings";
import PixelCard from "./PixelCard";

const C = {
  ink: "#484848ff", navy: "#090D16", navy2: "#0B1120", line: "#E2E8F0", mute: "#475569", soft: "#94A3B8",
  sky: "#0284C7", skyHover: "#0e78acfa", sky500: "#0EA5E9", sky300: "#7DD3FC", sky400: "#38BDF8", bg: "#F8FAFC", green: "#34D399",
};
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const EASE = "cubic-bezier(0.25, 1, 0.8, 1)";
const CARD_TRANSITION =
  "transform 400ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 400ms cubic-bezier(0.25, 1, 0.5, 1), border-color 400ms cubic-bezier(0.25, 1, 0.5, 1)";

const DARK_IDS = ["home", "section-dark-testimonial", "section-dark-2", "section-dark-3"];
const NAV_MID = 35;

const navLinks = [
  { label: "Home", id: "home" }, { label: "Solusi", id: "solusi" },
  { label: "Fitur", id: "fitur" }, { label: "FAQ", id: "faq" },
];

const solutions = [
  {
    image: imgStartup,
    tag: "Startup & Agresif",
    title: "Startup & Skala Cepat",
    desc: "Pembukuan kas harian otomatis, pemantauan runway dan burn rate real-time, serta integrasi langsung payment gateway e-commerce."
  },
  {
    image: imgCorporate,
    tag: "Multi-Entitas",
    title: "Korporasi & Multi-Cabang",
    desc: "Buku besar multi-entitas, konsolidasi mata uang asing otomatis, alur persetujuan PO/Invoice berjenjang, dan tata kelola grup."
  },
  {
    image: imgAkuntan,
    tag: "KAP & Pajak",
    title: "Akuntan Publik & Konsultan Pajak",
    desc: "Laporan keuangan standar PSAK/IFRS, audit trail digital anti-manipulasi, serta integrasi e-Faktur dan pelaporan pajak langsung.",
    dark: true
  },
];

const galleryItems = [
  { image: galleryImg1, label: 'Penjualan' },
  { image: galleryImg2, label: 'Pembelian' },
  { image: galleryImg3, label: 'Jurnal Umum' },
  { image: galleryImg4, label: 'Laporan Laba Rugi' },
  { image: galleryImg5, label: 'Customer' }
];

const steps = [
  { title: "Hubungkan Akun Bank", desc: "Koneksikan rekening bank korporat dan payment gateway melalui integrasi API terenkripsi 256-bit berstandar perbankan.", badge: "API Terenkripsi 256-bit" },
  { title: "Kustomisasi Bagan Akun", desc: "Sesuaikan Chart of Accounts (COA), multi-mata uang, dan struktur cost center dengan template standar industri kamu.", badge: "Standar PSAK / Kustom" },
  { title: "Otomasi Jurnal Transaksi", desc: "Setiap transaksi masuk, keluar, dan faktur klien dijurnal secara otomatis ke debit/kredit tanpa entri manual.", badge: "Entri Ganda Otomatis" },
  { title: "Terbitkan Laporan Neraca", desc: "Hasilkan laporan neraca, laba rugi, dan arus kas komprehensif dalam satu klik, siap dibagikan ke dewan direksi.", badge: "Laporan Real-Time" },
];

const stepIcons = [Bank, TreeStructure, Lightning, CertificateIcon,];

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

const footerCols = [
  { h: "SOLUSI", items: ["Untuk Startup Finansial", "Korporasi & Multi-Cabang", "KAP & Konsultan Pajak", "Scaleup B2B SaaS"] },
  { h: "FITUR", items: ["Jurnal Umum & Buku Besar", "Rekonsiliasi Bank API", "e-Faktur & Pajak Otomatis", "Audit Trail Digital", "Konsolidasi Multi-Mata Uang"] },
  { h: "PERUSAHAAN", items: ["Tentang Jurnal ERP", "Kemitraan Perbankan", "Blog & Studi Kasus", "Karir Tim FinTech"] },
  { h: "KEPATUHAN & LEGALITAS", items: ["Keamanan ISO 27001", "Laporan SOC-2 Type II", "Standar PSAK & IFRS", "SLA & Ketentuan Layanan"] },
];

const plans = [
  {
    icon: Sparkle,
    name: "Starter",
    price: "Rp 0",
    tagline: "Untuk usaha rintisan",
    features: ["1 entitas & 3 pengguna", "Jurnal umum & buku besar", "Laporan laba rugi dasar"],
    cta: "Mulai Gratis",
    action: "register",
  },
  {
    icon: Rocket,
    name: "Bisnis",
    price: "Rp 349.000",
    tagline: "Untuk tim finance yang bertumbuh",
    features: ["Entitas & pengguna tanpa batas", "Rekonsiliasi Bank API & e-Faktur", "Laporan keuangan lanjutan"],
    cta: "Upgrade ke Bisnis",
    action: "register",
    popular: true,
  },
  {
    icon: Users,
    name: "Korporasi",
    price: "Rp 899.000",
    tagline: "Untuk grup perusahaan",
    features: ["Konsolidasi multi-cabang", "SSO & audit trail lanjutan", "Account manager khusus"],
    cta: "Hubungi Sales",
    action: "contact",
  },
];

const go = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

function useInView(rootMargin = "150px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* Deteksi apakah navbar sedang di atas section gelap, pake IntersectionObserver */
function useDarkNav() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const visible = new Set();
    let io;

    const build = () => {
      io?.disconnect();
      visible.clear();
      const bottom = Math.max(window.innerHeight - NAV_MID - 1, 0);
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
          setDark(visible.size > 0);
        },
        { rootMargin: `-${NAV_MID}px 0px -${bottom}px 0px`, threshold: 0 }
      );
      DARK_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    };

    build();
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(build, 200); };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
    };
  }, []);
  return dark;
}

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

const Eyebrow = ({ children, color = C.sky }) => (
  <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={color} textAlign="center">{children}</Text>
);
const Title = ({ children, dark, size = "4xl" }) => (
  <Heading as="h2" fontSize={{ base: "2xl", md: size === "4xl" ? "4xl" : "3xl" }} lineHeight="1.1" fontWeight="700" color={dark ? "white" : C.ink} textAlign="center" fontFamily={FONT}>{children}</Heading>
);
const Pill = ({ children, color = C.sky300, border = "rgba(56,189,248,.25)" }) => (
  <Box px={3} py={1} borderRadius="full" bg="rgba(2,6,23,.8)" border="1px solid" borderColor={border} fontSize="11px" fontWeight="600" color={color}>{children}</Box>
);

const CtaBtn = ({ children, onClick, size = "lg", outline, ...rest }) => (
  <Button
    size={size} borderRadius="full" px={8} fontWeight="700" onClick={onClick}
    bg={outline ? "transparent" : C.sky} color={outline ? "#E2E8F0" : "white"}
    border={outline ? "1px solid #334155" : "1px solid transparent"}
    shadow={outline ? "none" : "0 8px 18px rgba(14, 164, 233, 0.43)"}
    _hover={
      outline
        ? { bg: "whiteAlpha.100" }
        : {
          bg: C.skyHover,
          transform: "scale(1.02)",
          borderColor: "rgba(0, 208, 255, 0.7)",
          shadow: "0 8px 18px rgba(14, 164, 233, 0.9)"
        }
    }
    _active={outline ? {} : { transform: "scale(0.98)" }}
    transition="all 300ms cubic-bezier(0.25, 1, 0.5, 1)"
    {...rest}
  >
    {children} {!outline && <ArrowRight size={16} weight="bold" />}
  </Button>
);

const TextLink = ({ children, onClick }) => (
  <HStack gap={1.5} color={C.sky} fontSize="sm" fontWeight="600" cursor="pointer" onClick={onClick}>
    <Text>{children}</Text><ArrowRight size={14} weight="bold" />
  </HStack>
);

function LazyMount({ children, rootMargin = "100px" }) {
  const [ref, inView] = useInView(rootMargin);
  return (
    <Box ref={ref} position="absolute" inset={0} zIndex={0}>
      {inView && children}
    </Box>
  );
}

const Navbar = memo(function Navbar() {
  const navigate = useNavigate();
  const scrolled = useScrolled();
  const isDarkSection = useDarkNav();
  const showDarkBg = scrolled && isDarkSection;
  const showLightBg = scrolled && !isDarkSection;

  return (
    <Box
      as="header"
      position="fixed" top={0} left={0} right={0} zIndex={20}
      w="full"
      color={isDarkSection ? "white" : C.ink}
      transition={`color 100ms ${EASE}`}
    >
      <Box
        aria-hidden position="absolute" inset={0} zIndex={-1} pointerEvents="none"
        bg="rgba(9, 13, 22, 0.88)"
        backdropFilter="blur(8px)"
        borderBottom="1px solid rgba(255,255,255,0.15)"
        boxShadow="0 10px 30px -18px rgba(0, 132, 255, 1)"
        opacity={showDarkBg ? 1 : 0}
        transition={`opacity 400ms ${EASE}`}
      />
      <Box
        aria-hidden position="absolute" inset={0} zIndex={-1} pointerEvents="none"
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(8px)"
        borderBottom="1px solid rgba(226,232,240,0.5)"
        boxShadow="0 4px 20px -3px rgba(0, 0, 0, 0.25)"
        opacity={showLightBg ? 1 : 0}
        transition={`opacity 400ms ${EASE}`}
      />

      <Box as="nav" position="relative" mx="auto" w="full" px={{ base: 4, md: 8, lg: 10 }} py={4}>
        <HStack justify="space-between" align="center" w="full" h="full">
          <Box position="relative" h="70px" cursor="pointer" onClick={() => go("home")}>
            <Box
              as="img" src={brandLogoWhite} alt="Jurnal ERP" h="70px" display="block"
              decoding="async"
              opacity={isDarkSection || !scrolled ? 1 : 0}
              transition={`opacity 500ms ${EASE}`}
            />
            <Box
              as="img" src={brandLogoBlack} alt="" aria-hidden h="70px"
              decoding="async"
              position="absolute" top={0} left={0} pointerEvents="none"
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
              variant="ghost" size="sm" fontWeight="600" mb={0.8}
              color={isDarkSection ? "white" : C.ink}
              _hover={{ color: C.sky, bg: "transparent" }}
              transition="color 900ms cubic-bezier(0.25, 1, 0.5, 1)"
              onClick={() => navigate("/login")}
            >
              Masuk
            </Button>

            <Button
              size="sm" fontWeight="600" fontSize="sm" borderRadius="full" px={6}
              bg={C.sky} color="white" height="40px"
              border="1px solid transparent"
              shadow="0 8px 18px rgba(14, 164, 233, 0.43)"
              _hover={{
                bg: C.skyHover,
                transform: "scale(1.02)",
                borderColor: "rgba(0, 255, 255, 0.21)",
                shadow: "0 8px 18px rgba(14, 164, 233, 0.58)"
              }}
              _active={{ transform: "scale(0.98)" }}
              transition={`all 300ms ${EASE}`}
              onClick={() => navigate("/register")}
            >
              Mulai Sekarang
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
});


{/* Faq */ }
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      w="full" bg="white" borderRadius="2xl" border="1px solid" borderColor={C.line} overflow="hidden"
      transition="box-shadow 400ms cubic-bezier(0.25, 1, 0.5, 1), border-color 400ms cubic-bezier(0.25, 1, 0.5, 1), background-color 400ms cubic-bezier(0.25, 1, 0.5, 1)"
      _hover={{
        boxShadow: "inset 0 3px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 4px 12px rgba(0, 0, 0, 0.03)",
        borderColor: "rgba(200, 210, 220, 0.8)",
        bg: "rgba(250, 250, 250, 1)"
      }}
    >
      <HStack
        as="button" w="full" justify="space-between" px={6} py={5} textAlign="left"
        aria-expanded={open} onClick={() => setOpen(!open)} _focus={{ outline: "none" }}
      >
        <Text fontWeight="700" color="#0F172A">{q}</Text>
        <Box
          color={open ? C.sky : C.soft}
          transform={open ? "rotate(180deg)" : "none"}
          transition="transform 400ms cubic-bezier(0.25, 1, 0.5, 1), color 400ms ease"
          flexShrink={0}
        >
          <CaretDown size={20} />
        </Box>
      </HStack>

      <Box
        display="grid"
        gridTemplateRows={open ? "1fr" : "0fr"}
        transition="grid-template-rows 400ms cubic-bezier(0.25, 1, 0.5, 1)"
      >
        <Box overflow="hidden">
          <Text px={6} pb={5} fontSize="sm" color={C.mute} lineHeight="1.7">{a}</Text>
        </Box>
      </Box>
    </Box>
  );
}


{/* Price */ }
function PlanContent({ p, onClick, selected }) {
  const Icon = p.icon;
  return (
    <VStack align="stretch" justify="space-between" gap={8} p={8} h="full" w="full" textAlign="left">
      <VStack align="stretch" gap={6}>
        <HStack justify="space-between">
          <HStack gap={3}>
            <Box
              w="44px" h="44px" borderRadius="xl" bg="#F0F9FF" border="1px solid #BAE6FD" color={C.sky}
              display="flex" alignItems="center" justifyContent="center"
              shadow="0 2px 6px rgba(14,165,233,.12)"
            >
              <Icon size={22} />
            </Box>
            <Heading as="h3" fontSize="xl" fontWeight="700" color="#0F172A">{p.name}</Heading>
          </HStack>
          {p.popular && <Text fontSize="sm" fontWeight="600" color={C.sky}>Populer</Text>}
        </HStack>

        <Box>
          <HStack align="baseline" gap={2}>
            <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" color="#0F172A" lineHeight="1">{p.price}</Text>
            <Text fontSize="md" color={C.soft}>/bulan</Text>
          </HStack>
          <Text mt={3} color={C.mute}>{p.tagline}</Text>
        </Box>

        <VStack align="stretch" gap={4} pt={2}>
          {p.features.map((f) => (
            <HStack key={f} gap={3}>
              <Box color={C.sky300} flexShrink={0}><Check size={18} weight="bold" /></Box>
              <Text color="#1E293B" fontWeight="500">{f}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>

      <Button
        w="full" h="52px" borderRadius="xl" fontWeight="700" onClick={onClick}
        bg={selected ? C.sky : "linear-gradient(180deg, #F0F9FF, #E0F2FE)"}
        color={selected ? "white" : "#0369A1"}
        border="1px solid" borderColor={selected ? "transparent" : "#BAE6FD"}
        shadow={selected ? "0 8px 18px rgba(14,165,233,.43)" : "none"}
        _hover={{ bg: selected ? C.skyHover : "#E0F2FE", transform: "scale(1.02)" }}
        _active={{ transform: "scale(0.98)" }}
        transition={`all 300ms ${EASE}`}
      >
        {p.cta}
      </Button>
    </VStack>
  );
}


function PlanCard({ p, selected, onSelect, onClick }) {
  const [ref, inView] = useInView("150px");

  const shellStyle = {
    width: "100%",
    height: "100%",
    minHeight: "520px",
    cursor: "pointer",
    border: `1px solid ${selected ? C.sky : C.line}`,
    boxShadow: selected
      ? `0 0 0 1px ${C.sky}, 0 24px 48px -24px rgba(2,132,199,.45)`
      : "0 24px 48px -28px rgba(2,132,199,.18), 0 8px 18px -12px rgba(15,23,42,.10)",
    transition: "border-color 300ms, box-shadow 300ms",
  };

  return (
    <Box
      ref={ref}
      h="full" minH="520px"
      onClick={onSelect}
      transition={`transform 400ms ${EASE}`}
      _hover={{ transform: "translateY(-8px)" }}
    >
      {inView ? (
        <PixelCard
          theme="light"
          trigger="hover"
          colors={["#3d96f0", "#07dcff", "#07dcff"]}
          glowColor="#0ea5e9"
          shape="square"
          origin="center"
          gap={5}
          pixelSize={2}
          speed={35}
          revealDuration={600}
          spotlight={0.5}
          glow={0.5}
          opacity={0.5}
          fade={0.7}
          radius={24}
          clickPulse
          intro={!!p.popular}
          introDelay={300}
          style={{ ...shellStyle, placeItems: "stretch" }}
        >
          <PlanContent p={p} onClick={onClick} selected={selected} />
        </PixelCard>
      ) : (
        <Box style={{ ...shellStyle, borderRadius: "24px", background: "white" }}>
          <PlanContent p={p} onClick={onClick} selected={selected} />
        </Box>
      )}
    </Box>
  );
}

function PricingSection({ onRegister, onContact }) {
  const [selected, setSelected] = useState(1);

  return (
    <Box id="harga" scrollMarginTop="70px" py={24} bg="white">
      <Container maxW="6xl">
        <VStack gap={14}>
          <Reveal>
            <VStack gap={3}>
              <Eyebrow>Harga & Langganan</Eyebrow>
              <Title>Pilih Paket yang Tumbuh Bersama Bisnis Kamu.</Title>
            </VStack>
          </Reveal>

          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} w="full" alignItems="stretch">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.12} style={{ height: "100%" }}>
                <PlanCard
                  p={p}
                  selected={selected === i}
                  onSelect={() => setSelected(i)}
                  onClick={p.action === "contact" ? onContact : onRegister}
                />
              </Reveal>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}

{/* Halaman */ }
export default function LandingPage() {
  const navigate = useNavigate();
  const register = () => navigate("/register");
  useEffect(() => {
    if (document.getElementById("jerp-font")) return;
    const pre = document.createElement("link");
    pre.rel = "preconnect";
    pre.href = "https://fonts.gstatic.com";
    pre.crossOrigin = "";
    document.head.appendChild(pre);
    const link = document.createElement("link");
    link.id = "jerp-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    if (window.location.hash) window.history.replaceState(null, null, window.location.pathname);
    const t = setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box bg="white" fontFamily={FONT} color={C.ink}>
      <Navbar />

      {/* Home */}
      <Box id="home" position="relative" overflow="hidden" color="white" pt={{ base: 36, md: 44 }} pb={{ base: 20, md: 32 }}>
        <Box as="img" src={ctaBg} alt="" decoding="async" position="absolute" inset={0} w="full" h="full" objectFit="cover" />
        <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(2,6,23,.7), rgba(2,6,23,.86))" />
        <Box
          aria-hidden position="absolute" top="-200px" left="14%" w="900px" h="650px" pointerEvents="none"
          bg="radial-gradient(closest-side, rgba(14,165,233,.28), rgba(14,165,233,0))"
        />
        <Box
          aria-hidden position="absolute" top="240px" right="0%" w="560px" h="560px" pointerEvents="none"
          bg="radial-gradient(closest-side, rgba(56,189,248,.15), rgba(56,189,248,0))"
        />
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
              <Text fontSize="sm" fontWeight="600" color={C.soft}>
                Eksplorasi modul lengkap secara gratis & Siap pakai.
              </Text>
            </Stack>
          </Reveal>
        </Container>
      </Box>

      {/* Fitur / Pilar utama */}
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
                  parallax={1}
                  tilt={4}
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

      {/* Solusi */}
      <Box id="solusi" scrollMarginTop="50px" py={24} bg={C.bg} borderTop="1px solid" borderColor="rgba(226,232,240,.8)">
        <Container maxW="6xl">
          <VStack gap={14}>
            <Reveal>
              <VStack gap={2}><Eyebrow>Dirancang untuk Setiap Kebutuhan Finansial</Eyebrow><Title size="3xl">Solusi yang Tumbuh Bersama Skala Bisnis Kamu.</Title></VStack>
            </Reveal>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="full">
              {solutions.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.22} style={{ height: "100%" }}>
                  <VStack
                    h="full" align="stretch" gap={0} bg="white" borderRadius="3xl"
                    border="2px solid" borderColor={C.line} overflow="hidden"
                    transition={CARD_TRANSITION}
                    _hover={{
                      transform: "translateY(-8px)",
                      borderColor: C.sky300,
                      boxShadow: "0 20px 40px -10px rgba(14, 165, 233, 0.25)"
                    }}
                  >
                    <Box h="256px" position="relative" overflow="hidden">
                      <Box
                        as="img" src={s.image} alt={s.title} loading="lazy" decoding="async"
                        w="full" h="full" objectFit="cover"
                      />
                      <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)" />
                      <Box position="absolute" top={4} left={4}>
                        <Pill color={s.dark ? "#13dcebff" : C.sky300} border={s.dark ? "rgba(52,211,153,.2)" : undefined}>
                          {s.tag}
                        </Pill>
                      </Box>
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

      {/* Testimoni */}
      <Box
        id="section-dark-testimonial"
        position="relative" overflow="hidden"
        py={{ base: 20, md: 28 }}
        bg={C.navy} borderBottom="1px solid" borderColor="#1E293B"
      >
        <LazyMount>
          <MagicRings
            color="#38BDF8"
            colorTwo="#0284C7"
            motion="pulse"
            ringCount={6}
            speed={0.6}
            lineThickness={2}
            glow={1}
            hoverScale={1.2}
            clickBurst
            baseRadius={0.35}
            radiusStep={0.1}
            expansion={0.1}
            taper={1.5}
            rotation={0}
            spin={0}
            tilt={0}
            dispersion={0}
            grain={0}
            opacity={1}
            followMouse={false}
            mouseInfluence={0.2}
            hoverIntensity={1}
            parallax={0.05}
            intro
          />
        </LazyMount>

        <Reveal>
          <Container maxW="4xl" position="relative" zIndex={1}>
            <VStack gap={6} textAlign="center" userSelect="none">
              <Box w="48px" h="48px" borderRadius="full" bg="rgba(14,165,233,.15)" border="1px solid rgba(56,189,248,.3)" color={C.sky400} display="flex" alignItems="center" justifyContent="center">
                <Quotes size={24} weight="fill" />
              </Box>
              <Heading as="blockquote" fontSize={{ base: "xl", md: "4xl" }} lineHeight="1.15" fontWeight="600" color="white">
                “Sejak beralih ke Inotal Finance, waktu closing pembukuan akhir bulan kami berkurang dari 14 hari menjadi hanya 2 jam. Visibilitas arus kas real-time mengubah cara direksi mengambil keputusan finansial.”
              </Heading>
              <VStack gap={0}>
                <Box
                  as="img" src={profilePic} alt="Rizal Umaris" loading="lazy" decoding="async"
                  w="56px" h="56px" borderRadius="full" border="2px solid" borderColor={C.sky500}
                  objectFit="cover" mb={3}
                />
                <Text fontWeight="700" color="white">Rizal Umaris</Text>
                <Text fontSize="xs" color={C.soft}>CEO PT Telur Asin Sejahtera</Text>
              </VStack>
            </VStack>
          </Container>
        </Reveal>
      </Box>

      {/* Alur implementasi */}
      <Box
        id="fitur" scrollMarginTop="80px" py={24} bg={C.bg}
        borderY="1px solid" borderColor={C.line}
        position="relative" overflow="hidden"
      >
        <Box
          aria-hidden position="absolute" inset={0} pointerEvents="none" opacity={0.55}
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 25%, #000 75%, transparent 100%)",
            maskImage: "linear-gradient(180deg, transparent 0%, #000 25%, #000 75%, transparent 100%)",
          }}
        />
        <Box
          aria-hidden position="absolute" top="-120px" left="50%" transform="translateX(-50%)"
          w="900px" h="420px" pointerEvents="none"
          bg="radial-gradient(closest-side, rgba(14,165,233,.14), rgba(14,165,233,0))"
        />

        <Container maxW="6xl" position="relative" zIndex={1}>
          <VStack gap={16}>
            <Reveal>
              <VStack gap={2}>
                <Eyebrow>Alur Implementasi Cepat</Eyebrow>
                <Title>Dari Onboarding hingga Laporan Finansial Siap Terbit.</Title>
              </VStack>
            </Reveal>

            <Box position="relative" w="full">
              <Box
                aria-hidden display={{ base: "none", lg: "block" }}
                position="absolute" left="6%" right="6%" top="56px" zIndex={0}
                borderTop="2px dashed #7DD3FC" opacity={0.7}
              />

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8} w="full" position="relative" zIndex={1}>
                {steps.map((s, i) => {
                  const StepIcon = stepIcons[i];
                  return (
                    <Reveal key={s.title} delay={i * 0.1} style={{ height: "100%" }}>
                      <VStack
                        className="group"
                        position="relative" overflow="hidden"
                        h="full" align="stretch" justify="space-between" p={8} gap={8}
                        borderRadius="3xl" border="2px solid" borderColor="#ffffffdd"
                        bg="linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 42%)"
                        boxShadow="0 12px 28px -18px rgba(2,132,199,.28), 0 2px 6px rgba(15,23,42,.04)"
                        transition={CARD_TRANSITION}
                        _hover={{
                          transform: "translateY(-7px)",
                          borderColor: C.sky300,
                          boxShadow: "0 30px 60px -15px rgba(14, 165, 233, 0.3)",
                        }}
                      >
                        <VStack align="start" gap={3}>
                          <HStack w="full" justify="space-between" align="center">
                            <Box
                              w="48px" h="48px" borderRadius="2xl"
                              display="flex" alignItems="center" justifyContent="center"
                              bg="white" color={C.sky}
                              border="1px solid #BAE6FD"
                              boxShadow="0 6px 14px -6px rgba(14,165,233,.35)"
                              transition="background-color 300ms ease, color 300ms ease, border-color 300ms ease"
                              _groupHover={{ borderColor: C.sky }}
                              sx={{
                                "& svg path:first-of-type": {
                                  opacity: 0.1
                                }
                              }}
                            >
                              <StepIcon size={24} weight="duotone" />
                            </Box>
                            <Text
                              fontSize="5xl" fontWeight="800" lineHeight="1"
                              style={{
                                background: "linear-gradient(180deg, #7DD3FC 0%, #E0F2FE 100%)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              0{i + 1}
                            </Text>
                          </HStack>

                          <Heading as="h3" fontSize="xl"         
                            fontWeight="500" pt={2}>{s.title}</Heading>
                          <Text fontSize="sm" color={C.mute} lineHeight="1.7">{s.desc}</Text>
                        </VStack>

                        <HStack
                          gap={2} pt={4} borderTop="1px dashed #BAE6FD"
                          fontSize="xs" fontWeight="600" color="#0369A1"
                        >
                          <Box
                            w="18px" h="18px" borderRadius="full" flexShrink={0}
                            display="flex" alignItems="center" justifyContent="center"
                            bg="#E0F2FE" color={C.sky}
                          >
                            <Check size={11} weight="bold" />
                          </Box>
                          <Text>{s.badge}</Text>
                        </HStack>
                      </VStack>
                    </Reveal>
                  );
                })}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Harga */}
      <Box mb={20}>
        <PricingSection onRegister={register} onContact={() => navigate("/nantidlu")} />
      </Box>

      {/* Keamanan */}
      <Box id="section-dark-2" py={24} bg={C.navy}>
        <Container maxW="6xl">
          <VStack gap={16}>
            <Reveal>
              <VStack gap={2}>
                <Eyebrow color={C.sky400}>Keamanan & Integritas Data Finansial</Eyebrow>
                <Title dark>Perlindungan Standar Perbankan, <Text as="span" color={C.sky400}>Terjamin Sejak Awal.</Text></Title>
              </VStack>
            </Reveal>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={10} w="full">
              {security.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.1} style={{ height: "100%" }}>
                  <VStack
                    h="full" align="start" gap={2} p={6} borderRadius="3xl"
                    bg="rgba(11,17,32,.6)"
                    border="2px solid #00e1ffd8"
                    boxShadow="8px 8px 14px rgba(0, 255, 234, 0.2)"
                    transition={CARD_TRANSITION}
                    _hover={{
                      transform: "translateY(-7px)",
                      borderColor: C.sky300,
                      boxShadow: "0 30px 60px -15px rgba(14, 164, 233, 0.55)"
                    }}
                  >
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

      {/* FAQ */}
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

      {/* CTA akhir */}
      <Box id="section-dark-3" py={24} bg={C.navy} position="relative" overflow="hidden">
        <Box
          aria-hidden position="absolute" top="-120px" left="50%" transform="translateX(-50%)"
          w="900px" h="520px" pointerEvents="none"
          bg="radial-gradient(closest-side, rgba(14,165,233,.28), rgba(14,165,233,0))"
        />
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

      {/* Footer */}
      <Box bg={C.navy} borderTop="1px solid #1E293B" pt={20} pb={12}>
        <Container maxW="7xl">
          <VStack gap={16} align="stretch">
            <VStack align="start" gap={3} pb={16} borderBottom="1px solid #1E293B" maxW="672px">
              <Heading as="h3" fontSize="2xl" color="white">Dapatkan Insight Finansial & Regulasi Akuntansi Mingguan</Heading>
              <Text fontSize="sm" color={C.soft}>Kiat perpajakan e-Faktur, template rasio likuiditas CFO, dan rilis fitur ERP mutakhir langsung di inbox email kamu.</Text>
              <HStack as="form" w="full" maxW="448px" gap={3} pt={3} onSubmit={(e) => e.preventDefault()}>
                <Box
                  as="input"
                  type="email"
                  aria-label="Email perusahaan"
                  placeholder="Alamat email perusahaan"
                  autoComplete="off"
                  flex={1}
                  minW={0}
                  px={5}
                  py={3}
                  appearance="none"
                  WebkitAppearance="none"
                  outline="none !important"
                  borderRadius="full"
                  bg={C.navy2}
                  border="1px solid"
                  borderColor="#334155"
                  color="white"
                  fontSize="sm"
                  transition="border-color 300ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 300ms cubic-bezier(0.25, 1, 0.5, 1), background-color 300ms cubic-bezier(0.25, 1, 0.5, 1)"
                  _hover={{
                    borderColor: "rgba(56, 189, 248, 0.5)",
                    boxShadow: "0 0 0 1px rgba(56, 189, 248, 0.2)"
                  }}
                  _focus={{
                    boxShadow: "0 0 0 2px rgba(56, 189, 248, 0.3)",
                    bg: "rgba(11, 17, 32, 0.8)",
                    outline: "none !important"
                  }}
                />
                <Button type="submit" borderRadius="full" px={5} height="50px" bg={C.sky500} color="white" _hover={{ bg: C.sky }}>Langganan</Button>
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
                <Box as="img" src={brandFooter} h="36px" alt="Jurnal ERP" loading="lazy" decoding="async" />
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