import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import brandLogoWhite from "@/assets/Ino-Finance-Footer.png";
import Navbar from "@/pages/Navbar";

const C = {
  ink: "#484848ff", navy: "#090D16", line: "#E2E8F0", mute: "#475569", soft: "#94A3B8",
  sky: "#0284C7", skyHover: "#0e78acfa", sky300: "#7DD3FC", sky400: "#38BDF8", bg: "#F8FAFC",
};
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const EASE = "cubic-bezier(0.25, 1, 0.8, 1)";


const sections = [
  {
    title: "Penerimaan Ketentuan",
    body: "Dengan mengakses atau menggunakan Jurnal ERP dari Inotal Finance, kamu menyatakan telah membaca, memahami, dan setuju terikat pada Syarat Penggunaan ini. Jika kamu tidak menyetujui ketentuan ini, mohon untuk tidak menggunakan platform kami.",
  },
  {
    title: "Layanan yang Kami Sediakan",
    body: "Jurnal ERP adalah platform akuntansi dan keuangan berbasis cloud yang mencakup pembukuan umum, rekonsiliasi bank, pengelolaan faktur, pelaporan keuangan, dan fitur pendukung kepatuhan pajak. Kami dapat menambah, mengubah, atau menghentikan fitur tertentu dari waktu ke waktu untuk meningkatkan kualitas layanan.",
  },
  {
    title: "Pendaftaran Akun",
    body: "Kamu wajib memberikan informasi yang akurat dan lengkap saat membuat akun. Kamu bertanggung jawab menjaga kerahasiaan kredensial akun serta seluruh aktivitas yang terjadi di bawah akunmu, termasuk aktivitas pengguna lain yang kamu beri hak akses (RBAC) di dalam organisasimu.",
  },
  {
    title: "Penggunaan yang Diperbolehkan",
    body: "Kamu setuju tidak menggunakan Jurnal ERP untuk tujuan yang melanggar hukum, termasuk pencatatan transaksi fiktif, penghindaran pajak, atau pencucian uang. Kamu juga tidak diperkenankan mengganggu integritas dan keamanan platform, melakukan rekayasa balik (reverse engineering), atau mengakses data milik pengguna lain tanpa izin.",
  },
  {
    title: "Data Keuangan & Tanggung Jawab Pengguna",
    body: "Seluruh data keuangan yang kamu masukkan atau sinkronkan ke dalam platform tetap menjadi milikmu. Kamu bertanggung jawab atas keakuratan data tersebut. Jurnal ERP merupakan alat bantu pembukuan dan tidak menggantikan nasihat akuntan, auditor, maupun konsultan pajak profesional.",
  },
  {
    title: "Pembayaran & Penagihan",
    body: "Paket Starter tersedia tanpa biaya. Paket berbayar ditagih di muka secara bulanan atau tahunan sesuai paket yang kamu pilih. Seluruh pembayaran tidak dapat dikembalikan, kecuali diwajibkan oleh peraturan perundang-undangan yang berlaku. Perubahan harga akan diberitahukan terlebih dahulu sebelum periode penagihan berikutnya.",
  },
  {
    title: "Keamanan & Perlindungan Data",
    body: "Kami menerapkan enkripsi AES-256 untuk data tersimpan, TLS 1.3 untuk data dalam pengiriman, kontrol akses berbasis peran, serta pencadangan otomatis harian. Cara kami mengumpulkan dan memproses data pribadi dijelaskan lebih lanjut dalam Kebijakan Privasi kami.",
  },
  {
    title: "Hak Kekayaan Intelektual",
    body: "Jurnal ERP beserta seluruh konten, fitur, tampilan, dan fungsinya dimiliki oleh Inotal Finance Indonesia dan dilindungi oleh hukum hak cipta, merek dagang, serta kekayaan intelektual lainnya. Kamu diberikan lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk menggunakan layanan selama akunmu aktif.",
  },
  {
    title: "Batasan Tanggung Jawab",
    body: "Sejauh diizinkan oleh hukum, Inotal Finance Indonesia tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, maupun punitif yang timbul dari penggunaan atau ketidakmampuan menggunakan platform, termasuk kerugian akibat keputusan bisnis yang diambil berdasarkan laporan yang dihasilkan sistem.",
  },
  {
    title: "Penghentian Layanan",
    body: "Kamu dapat menghentikan penggunaan layanan kapan saja. Kami dapat menangguhkan atau menghentikan akunmu apabila terjadi pelanggaran terhadap ketentuan ini atau tindakan yang merugikan pengguna lain, kami, maupun pihak ketiga. Setelah akun dihentikan, kamu dapat meminta ekspor data keuanganmu dalam jangka waktu yang wajar.",
  },
  {
    title: "Perubahan Ketentuan",
    body: "Kami dapat memperbarui Syarat Penggunaan ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau notifikasi di dalam aplikasi. Dengan terus menggunakan layanan setelah perubahan berlaku, kamu dianggap menyetujui ketentuan yang diperbarui.",
  },
  {
    title: "Kontak",
    body: "Untuk pertanyaan seputar Syarat Penggunaan ini, hubungi kami di legal@inotalfinance.id.",
  },
];

/* ───────────────────────── Halaman ───────────────────────── */

export default function TermsPage() {
  const navigate = useNavigate();

  // Font (sama seperti LandingPage; aman dipanggil dua kali karena dicek via id)
  useEffect(() => {
    if (document.getElementById("jerp-font")) return;
    const link = document.createElement("link");
    link.id = "jerp-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <Box bg={C.bg} minH="100vh" fontFamily={FONT} color={C.ink}>
      <Navbar />

      {/* Hero gelap: membuat navbar tampil persis seperti di landing page */}
      <Box
        id="terms-hero" position="relative" overflow="hidden" color="white" bg={C.navy}
        pt={{ base: 32, md: 40 }} pb={{ base: 14, md: 20 }}
      >
        <Box
          aria-hidden position="absolute" top="-220px" left="50%" transform="translateX(-50%)"
          w="900px" h="560px" pointerEvents="none"
          bg="radial-gradient(closest-side, rgba(14,165,233,.28), rgba(14,165,233,0))"
        />
        <Box
          aria-hidden position="absolute" bottom={0} left={0} right={0} h="1px"
          bg="linear-gradient(90deg, transparent, rgba(56,189,248,.5), transparent)"
        />
        <Container maxW="4xl" position="relative" zIndex={1}>
          <VStack align="start" gap={4}>
            <HStack
              as="button" gap={1.5} fontSize="sm" fontWeight="600" color={C.soft}
              transition={`color 300ms ${EASE}`} _hover={{ color: C.sky300 }}
              onClick={() => navigate("/")} marginTop="-75px"
            >
              <ArrowLeft size={16} weight="bold" />
              <Text>Kembali ke Beranda</Text>
            </HStack>
            <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={C.sky400}>
              Legal
            </Text>
            <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1.05" fontWeight="700">
              Syarat <Text as="span" color={C.sky300}>Penggunaan</Text>
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="#CBD5E1" maxW="2xl" lineHeight="1.5">
              Ketentuan yang berlaku saat kamu menggunakan Jurnal ERP Inotal Finance. Mohon dibaca dengan saksama.
            </Text>
            <Text fontSize="sm" color={C.soft}>Terakhir diperbarui: 11 November 2026</Text>
          </VStack>
        </Container>
      </Box>

      {/* Isi */}
      <Container maxW="4xl" py={{ base: 12, md: 16 }}>
        <VStack align="stretch" gap={5}>
          {sections.map((s, i) => (
            <HStack
              key={s.title}
              align="start"
              gap={{ base: 4, md: 6 }}
              p={{ base: 5, md: 7 }}
              bg="white"
              borderRadius="2xl"
              border="1px solid"
              borderColor={C.line}
              transition="all 900ms cubic-bezier(0.25, 1, 0.5, 1)"
              boxShadow="0 10px 24px -18px rgba(2,132,199,.25), 0 2px 6px rgba(15,23,42,.03)"
              _hover={{
                boxShadow: "inset 0 3px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9), 10px 30px 70px -15px rgba(14, 164, 233, 0.21)",
                borderColor: "rgba(200, 210, 220, 0.8)",
                bg: "rgba(250, 250, 250, 1)"
              }}
            >
              <Box
                flexShrink={0} w="44px" h="44px" borderRadius="xl"
                display="flex" alignItems="center" justifyContent="center"
                bg="#F0F9FF" border="1px solid #BAE6FD" color={C.sky}
                fontWeight="800" fontSize="md"
              >
                {String(i + 1).padStart(2, "0")}
              </Box>
              <VStack align="start" gap={2}>
                <Heading as="h2" fontSize="lg" fontWeight="700" color="#0F172A">{s.title}</Heading>
                <Text fontSize="sm" color={C.mute} lineHeight="1.8">{s.body}</Text>
              </VStack>
            </HStack>
          ))}

          {/* Ajakan kontak */}
          <Stack
            direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }}
            gap={4} p={{ base: 6, md: 8 }} mt={4} borderRadius="3xl"
            bg={C.navy} border="1px solid #1E293B"
          >
            <VStack align="start" gap={1}>
              <Heading as="h3" fontSize="xl" color="white">Masih ada pertanyaan?</Heading>
              <Text fontSize="sm" color={C.soft}>Tim kami siap membantu menjelaskan setiap ketentuan di atas.</Text>
            </VStack>
            <Button
              borderRadius="full" px={7} h="48px" fontWeight="700" bg={C.sky} color="white"
              shadow="0 8px 18px rgba(14, 164, 233, 0.43)"
              _hover={{ bg: C.skyHover, transform: "scale(1.02)" }}
              _active={{ transform: "scale(0.98)" }}
              transition={`all 300ms ${EASE}`}
              onClick={() => navigate("/contact")}
            >
              Hubungi Kami <ArrowRight size={16} weight="bold" />
            </Button>
          </Stack>
        </VStack>
      </Container>

      {/* Footer ringkas */}
      <Box id="terms-footer" bg={C.navy} borderTop="1px solid #1E293B" py={8}>
        <Container maxW="4xl">
          <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={4}>
            <HStack gap={3}>
              <Box as="img" src={brandLogoWhite} h="36px" alt="Jurnal ERP" decoding="async" />
              <Text fontSize="xs" color={C.soft}>© 2026 Inotal Finance Indonesia. Hak cipta dilindungi undang-undang.</Text>
            </HStack>
            <HStack gap={6}>
              <Text as="button" fontSize="xs" color="white" onClick={() => navigate("/terms")}>Syarat Penggunaan</Text>
              <Text as="button" fontSize="xs" color={C.soft} _hover={{ color: "white" }} onClick={() => navigate("/privacy")}>Kebijakan Privasi</Text>
              <Text as="button" fontSize="xs" color={C.soft} _hover={{ color: "white" }} onClick={() => navigate("/contact")}>Keamanan Data</Text>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}