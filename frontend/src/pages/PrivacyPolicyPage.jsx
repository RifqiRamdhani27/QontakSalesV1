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
    title: "Informasi yang Kami Kumpulkan",
    body: "Kami mengumpulkan informasi yang kamu berikan langsung saat mendaftar, seperti nama, alamat email, nama perusahaan, nomor telepon, dan data penagihan. Saat kamu menggunakan Jurnal ERP, kami juga memproses data keuangan yang kamu masukkan atau sinkronkan, termasuk jurnal, faktur, mutasi rekening, dan laporan, serta data teknis seperti alamat IP, jenis perangkat, dan log aktivitas.",
  },
  {
    title: "Cara Kami Menggunakan Informasi",
    body: "Informasi digunakan untuk menyediakan, memelihara, dan meningkatkan layanan; memproses transaksi dan penagihan; mengirim pemberitahuan teknis dan dukungan; menjaga keamanan akun; serta memenuhi kewajiban hukum. Kami hanya mengirim informasi produk atau promosi apabila kamu telah menyetujuinya, dan kamu dapat berhenti berlangganan kapan saja.",
  },
  {
    title: "Data Keuangan Perusahaanmu",
    body: "Data pembukuan dan transaksi yang kamu simpan di Jurnal ERP tetap menjadi milikmu. Kami memprosesnya semata-mata untuk menjalankan layanan sesuai instruksimu. Kami tidak menggunakan data keuangan perusahaanmu untuk iklan, dan tidak membagikannya ke pihak lain di luar yang dijelaskan dalam kebijakan ini.",
  },
  {
    title: "Keamanan Data",
    body: "Kami menerapkan langkah teknis dan organisasi yang layak untuk melindungi data dari akses, perubahan, pengungkapan, atau perusakan tanpa izin. Data dienkripsi dengan AES-256 saat disimpan dan TLS 1.3 saat dikirim, akses diatur melalui kontrol berbasis peran (RBAC), seluruh perubahan jurnal dicatat dalam audit trail, dan data dicadangkan otomatis setiap hari. Tidak ada sistem yang sepenuhnya kebal, namun kami terus meninjau dan memperkuat perlindungan ini.",
  },
  {
    title: "Berbagi Data dengan Pihak Ketiga",
    body: "Kami tidak menjual atau menyewakan data pribadimu. Kami dapat membagikan data kepada penyedia layanan tepercaya yang membantu operasional platform, seperti infrastruktur cloud, payment gateway, dan integrasi bank yang kamu aktifkan sendiri, dengan kewajiban kerahasiaan yang mengikat. Kami juga dapat mengungkapkan data jika diwajibkan oleh hukum atau permintaan resmi dari otoritas yang berwenang.",
  },
  {
    title: "Penyimpanan & Retensi Data",
    body: "Data disimpan selama akunmu aktif dan selama diperlukan untuk memenuhi tujuan yang dijelaskan di sini, termasuk kewajiban penyimpanan dokumen keuangan dan perpajakan yang berlaku. Setelah akun dihentikan, kamu dapat meminta ekspor data, dan data akan dihapus atau dianonimkan dalam jangka waktu yang wajar, kecuali hukum mewajibkan penyimpanan lebih lama.",
  },
  {
    title: "Cookie & Teknologi Serupa",
    body: "Kami menggunakan cookie dan teknologi serupa untuk menjaga sesi login, mengingat preferensi, serta memahami cara layanan digunakan agar dapat diperbaiki. Kamu dapat mengatur atau menonaktifkan cookie melalui peramban, namun beberapa fitur mungkin tidak berfungsi dengan baik.",
  },
  {
    title: "Hak-Hakmu atas Data Pribadi",
    body: "Sesuai peraturan pelindungan data pribadi yang berlaku di Indonesia, kamu berhak mengakses, memperbaiki, memperbarui, dan meminta penghapusan data pribadimu, menarik persetujuan pemrosesan, serta meminta salinan data. Kamu juga dapat mengekspor data melalui pengaturan platform kapan saja. Hubungi kami untuk menggunakan hak-hak ini.",
  },
  {
    title: "Perubahan Kebijakan Privasi",
    body: "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau notifikasi di dalam aplikasi sebelum berlaku. Tanggal pembaruan terakhir selalu tercantum di bagian atas halaman ini.",
  },
  {
    title: "Kontak",
    body: "Untuk pertanyaan seputar Kebijakan Privasi ini atau untuk menggunakan hakmu atas data pribadi, hubungi kami di privacy@inotalfinance.id.",
  },
];

export default function PrivacyPage() {
  const navigate = useNavigate();

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

      {/* Hero gelap */}
      <Box
        id="privacy-hero" position="relative" overflow="hidden" color="white" bg={C.navy}
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
              as="button"
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              fontSize="sm"
              fontWeight="600"
              color={C.soft}
              transition={`color 300ms ${EASE}`}
              role="group"
              _hover={{
                color: C.sky300,
                _child: { color: C.sky300 }
              }}
              py={2}
              px={2}
              ml={-2}
              my={-2}
              onClick={() => navigate("/")}
              marginTop="-75px"
              cursor="pointer"
            >
              <ArrowLeft size={16} weight="bold" />
              <Text m={0}>Kembali ke Beranda</Text>
            </HStack>
            <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={C.sky400}>
              Legal
            </Text>
            <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1.05" fontWeight="700">
              Kebijakan <Text as="span" color={C.sky300}>Privasi</Text>
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="#CBD5E1" maxW="2xl" lineHeight="1.5">
              Cara Jurnal ERP Inotal Finance mengumpulkan, menggunakan, dan melindungi data kamu.
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
              <Heading as="h3" fontSize="xl" color="white">Ingin menggunakan hak atas datamu?</Heading>
              <Text fontSize="sm" color={C.soft}>Tim kami siap membantu permintaan akses, koreksi, ekspor, atau penghapusan data.</Text>
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
      <Box id="privacy-footer" bg={C.navy} borderTop="1px solid #1E293B" py={8}>
        <Container maxW="4xl">
          <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={4}>
            <HStack gap={3}>
              <Box as="img" src={brandLogoWhite} h="36px" alt="Jurnal ERP" decoding="async" />
              <Text fontSize="xs" color={C.soft}>© 2026 Inotal Finance Indonesia. Hak cipta dilindungi undang-undang.</Text>
            </HStack>
            <HStack gap={6}>
              <Text as="button" fontSize="xs" color={C.soft} _hover={{ color: "white" }} onClick={() => navigate("/terms")}>Syarat Penggunaan</Text>
              <Text as="button" fontSize="xs" color="white" onClick={() => navigate("/privacy")}>Kebijakan Privasi</Text>
              <Text as="button" fontSize="xs" color={C.soft} _hover={{ color: "white" }} onClick={() => navigate("/contact")}>Keamanan Data</Text>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}