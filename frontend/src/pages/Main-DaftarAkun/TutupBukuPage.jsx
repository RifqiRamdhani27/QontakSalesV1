import { useState, useEffect } from "react";
import {
  Box, Flex, Text, Button, HStack, VStack, SimpleGrid, Input,
} from "@chakra-ui/react";
import {
  CalendarBlank, Receipt, Calculator, TrendUp, X, Check, LockKey, BookOpen,
} from "@phosphor-icons/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import illustrationImg from "@/assets/tutup_buku_illustration.png";

export default function TutupBukuPage() {
  const navigate = useNavigate();
  const outlet = useOutletContext();
  const setHasBackdrop = outlet?.setHasBackdrop;
  const hasLayoutBackdrop = !!setHasBackdrop;
  const [modalType, setModalType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2026-12");
  const [isSuccess, setIsSuccess] = useState(false);

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

  useEffect(() => {
    if (!setHasBackdrop || !isDark) return undefined;
    setHasBackdrop(true);
    return () => setHasBackdrop(false);
  }, [setHasBackdrop, isDark]);

  const handleProcess = () => {
    setIsSuccess(true);
  };

  const closeModal = () => {
    setModalType(null);
    setIsSuccess(false);
  };

  return (
    <Box
      className={`tb-root ${isDark ? "tb-dark" : ""}`}
      bg={isDark ? (hasLayoutBackdrop ? "transparent" : "#121212") : "white"}
      p={{ base: 6, md: 10 }}
      fontFamily="Segoe UI, -apple-system, sans-serif"
    >
      <Flex direction={{ base: "column", lg: "row" }} justify="space-between" align="flex-start" gap={8} mb={12}>
        <Box flex={1} maxW="720px">
          <Text className="tb-title tb-hero-title" fontSize={{ base: "22px", md: "26px" }} fontWeight="700" color="#0F172A" mb={4} lineHeight="1.2">
            Fitur kunci periode dan tutup buku
          </Text>

          <Text className="tb-text" fontSize="14px" color="#334155" mb={3} lineHeight="1.6">
            Kunci periode memastikan transaksi yang berada dalam periode yang sudah dikunci tidak berubah.
          </Text>

          <Text className="tb-text" fontSize="14px" color="#334155" mb={6} lineHeight="1.6">
            Tutup buku meliputi penguncian periode dan peralihan keuntungan bersih/rugi periode sebelumnya menjadi modal awal periode berikutnya melalui jurnal penutup.
          </Text>

          <Text className="tb-title" fontSize="14px" fontWeight="700" color="#0F172A" mb={2}>
            Waktu untuk melakukan
          </Text>

          <VStack align="stretch" gap={1.5} mb={6} fontSize="14px" color="#334155">
            <HStack align="flex-start" gap={2}>
              <Text className="tb-title2" color="#475569" fontWeight="bold">•</Text>
              <Text className="tb-text">Kunci periode dapat dilakukan saat transaksi dalam laporan sudah ditinjau dan tidak ingin diubah.</Text>
            </HStack>
            <HStack align="flex-start" gap={2}>
              <Text className="tb-title2" color="#475569" fontWeight="bold">•</Text>
              <Text className="tb-text">Tutup buku umumnya dilakukan pada akhir tahun, akhir periode akuntansi, atau keduanya.</Text>
            </HStack>
          </VStack>

          <HStack gap={3} flexWrap="wrap">
            <Button
              className="tb-btn-outline tb-btn-main"
              variant="outline"
              borderColor="#cececeff"
              color="#2563EB"
              _hover={{ bg: "#EFF6FF" }}
              size="sm"
              borderRadius="lg"
              fontWeight="600"
              fontSize="14px"
              px={5}
              h="38px"
              onClick={() => { setModalType("kunci"); setIsSuccess(false); }}
            >
              Mulai kunci periode
            </Button>
            <Button
              className="tb-btn-outline"
              variant="outline"
              borderColor="#cececeff"
              color="#2563EB"
              _hover={{ bg: "#EFF6FF" }}
              size="sm"
              borderRadius="lg"
              fontWeight="600"
              fontSize="14px"
              px={5}
              h="38px"
              onClick={() => { setModalType("tutup"); setIsSuccess(false); }}
            >
              Mulai tutup buku
            </Button>
          </HStack>
        </Box>

        <Box className="tb-illus" display="flex" justify="center" align="center" minW={{ md: "320px" }} maxW="380px" w="full">
          <Box
            as="img"
            className="tb-img"
            src={illustrationImg}
            alt="Fitur Kunci Periode dan Tutup Buku"
            w="full"
            maxH="300px"
            objectFit="contain"
          />
        </Box>
      </Flex>

      <Box textAlign="center" my={10}>
        <Text className="tb-title tb-section" fontSize="18px" fontWeight="550" color="#0F172A">
          Langkah-langkah kunci periode dan tutup buku
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={8} mb={16}>
        <VStack className="tb-step" align="flex-start" gap={3}>
          <Box bg="#2563EB" className="tb-icon" p={2.5} borderRadius="xl" color="white" display="inline-flex">
            <CalendarBlank size={24} weight="bold" />
          </Box>
          <Text className="tb-step-title" fontWeight="600" fontSize="15px" color="#0F172A">
            1. Pilih periode
          </Text>
          <Text className="tb-step-desc" fontSize="13px" color="#64748B" lineHeight="1.5">
            Pilih periode yang akan Anda kunci atau tutup, lalu konfirmasi.
          </Text>
        </VStack>

        <VStack className="tb-step" align="flex-start" gap={3}>
          <Box bg="#2563EB" className="tb-icon" p={2.5} borderRadius="xl" color="white" display="inline-flex">
            <Receipt size={24} weight="bold" />
          </Box>
          <Text className="tb-step-title" fontWeight="600" fontSize="15px" color="#0F172A">
            2. Cek rekonsiliasi
          </Text>
          <Text className="tb-step-desc" fontSize="13px" color="#64748B" lineHeight="1.5">
            Periksa dan rekonsiliasi transaksi untuk memastikan semua data sesuai dan akurat.
          </Text>
        </VStack>

        <VStack className="tb-step" align="flex-start" gap={3}>
          <Box bg="#2563EB" className="tb-icon" p={2.5} borderRadius="xl" color="white" display="inline-flex">
            <Calculator size={24} weight="bold" />
          </Box>
          <Text className="tb-step-title" fontWeight="600" fontSize="15px" color="#0F172A">
            3. Periksa kertas kerja
          </Text>
          <Text className="tb-step-desc" fontSize="13px" color="#64748B" lineHeight="1.5">
            Gunakan kertas kerja untuk memastikan semua detail entri sudah benar.
          </Text>
        </VStack>

        <VStack className="tb-step" align="flex-start" gap={3}>
          <Box bg="#2563EB" className="tb-icon" p={2.5} borderRadius="xl" color="white" display="inline-flex">
            <TrendUp size={24} weight="bold" />
          </Box>
          <Text className="tb-step-title" fontWeight="600" fontSize="15px" color="#0F172A">
            4. Tinjau laporan keuangan
          </Text>
          <Text className="tb-step-desc" fontSize="13px" color="#64748B" lineHeight="1.5">
            Tinjau laporan keuangan yang telah dibuat di periode tersebut, seperti trial balance, laba rugi, neraca, dan arus kas.
          </Text>
        </VStack>
      </SimpleGrid>

      <Box className="tb-divider" borderBottom="1px solid #E2E8F0" mb={8} />

      <Box textAlign="center" pb={8}>
        <Text className="tb-muted" fontSize="13px" color="#64748B">
          Pelajari lebih lanjut tentang{" "}
          <span className="tb-link" style={{ color: "#2563EB", cursor: "pointer", textDecoration: "none" }} onClick={() => setModalType("kunci")}>
            kunci periode
          </span>{" "}
          dan{" "}
          <span className="tb-link" style={{ color: "#2563EB", cursor: "pointer", textDecoration: "none" }} onClick={() => setModalType("tutup")}>
            tutup buku
          </span>
        </Text>
      </Box>

      {modalType && (
        <Box
          className="tb-overlay"
          position="fixed" inset={0} bg="blackAlpha.600" zIndex={100}
          display="flex" alignItems="center" justifyContent="center" p={4}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <Box bg="white" borderRadius="2xl" className="tb-modal" shadow="2xl" w="full" maxW="460px" p={6}>
            <Flex align="center" justify="space-between" mb={4}>
              <HStack gap={2}>
                {modalType === "kunci" ? <LockKey size={22} color="#2563EB" className="tb-icon-key"/> : <BookOpen size={22} color="#2563EB" className="tb-icon-key"/>}
                <Text className="tb-title" fontWeight="bold" fontSize="lg" color="#0F172A">
                  {modalType === "kunci" ? "Kunci Periode Transaksi" : "Proses Tutup Buku Total"}
                </Text>
              </HStack>
              <Button className="tb-close" size="xs" variant="ghost" onClick={closeModal}>
                <X size={18} />
              </Button>
            </Flex>

            {isSuccess ? (
              <VStack gap={4} py={4} align="center">
                <Box className="tb-success-icon" bg="#ECFDF5" p={3} borderRadius="full" color="#10B981">
                  <Check size={32} weight="bold" />
                </Box>
                <Text className="tb-success-title" fontWeight="bold" fontSize="md" color="#065F46" textAlign="center">
                  {modalType === "kunci" ? "Periode Berhasil Dikunci!" : "Proses Tutup Buku Berhasil Diselesaikan!"}
                </Text>
                <Text className="tb-modal-text" fontSize="xs" color="#475569" textAlign="center">
                  Seluruh transaksi periode {selectedMonth} telah dikunci. Data laporan keuangan aman dari perubahan.
                </Text>
                <Button
                  className="tb-btn"
                  w="full" bg="#2563EB" color="white" _hover={{ bg: "#1D4ED8" }}
                  size="sm" borderRadius="lg" mt={2} onClick={closeModal}
                >
                  Selesai
                </Button>
              </VStack>
            ) : (
              <VStack gap={4} align="stretch">
                <Text className="tb-modal-text" fontSize="xs" color="#475569">
                  {modalType === "kunci"
                    ? "Pilih periode bulan dan tahun yang ingin dikunci. Setelah dikunci, transaksi dalam periode ini tidak dapat diubah."
                    : "Proses tutup buku akan mengunci transaksi periode dan mengalihkan saldo laba bersih ke jurnal penutup modal awal."}
                </Text>

                <Box>
                  <Text className="tb-modal-label" fontSize="xs" fontWeight="semibold" color="#475569" mb={1}>
                    Periode (Bulan & Tahun)
                  </Text>
                  <Input
                    className="tb-input"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    borderRadius="lg"
                    borderColor="#CBD5E1"
                    fontSize="sm"
                  />
                </Box>

                <Flex gap={3} pt={2}>
                  <Button className="tb-btn-outline tb-btn-ghost" flex={1} variant="outline" borderColor="#CBD5E1" onClick={closeModal} borderRadius="lg">
                    Batal
                  </Button>
                  <Button
                    className="tb-btn"
                    flex={1} bg="#2563EB" color="white" _hover={{ bg: "#1D4ED8" }}
                    onClick={handleProcess} borderRadius="lg" fontWeight="semibold"
                  >
                    Konfirmasi {modalType === "kunci" ? "Kunci" : "Tutup Buku"}
                  </Button>
                </Flex>
              </VStack>
            )}
          </Box>
        </Box>
      )}
      <style>{`
        html, body, .tb-root, .tb-root * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        .tb-root::-webkit-scrollbar,
        .tb-root *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .tb-dark { color-scheme: dark; }
        .tb-dark .tb-title { color: #f8fafc !important; }
        .tb-dark .tb-title2 { color: #E5B85C !important; }
        .tb-dark .tb-text { color: #cbd5e1 !important; }
        .tb-dark .tb-muted { color: #94a3b8 !important; }
        .tb-dark .tb-divider { border-color: rgba(222, 166, 54, 0.2) !important; }
        .tb-dark .tb-link { color: #E5B85C !important; transition: opacity 0.15s ease; }
        .tb-dark .tb-link:hover { text-decoration: underline !important; opacity: 0.9; }
        .tb-dark .tb-icon-key { fill: #E5B85C !important; }

        .tb-dark .tb-hero-title::after {
          content: "";
          display: block;
          width: 48px;
          height: 3px;
          border-radius: 2px;
          margin-top: 12px;
          background: linear-gradient(90deg, #E5B85C, rgba(229, 184, 92, 0));
        }

        .tb-dark .tb-illus {
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(222, 166, 54, 0.2);
          background:
            radial-gradient(120% 120% at 100% 0%, rgba(222, 166, 54, 0.14) 0%, rgba(222, 166, 54, 0) 60%),
            #1a1a19;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        }
        .tb-dark .tb-img {
          border-radius: 12px;
          filter: brightness(0.92) contrast(1.02);
        }

        .tb-dark .tb-section {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 560px;
          margin: 0 auto;
        }
        .tb-dark .tb-section::before,
        .tb-dark .tb-section::after {
          content: "";
          flex: 1;
          height: 1px;
        }
        .tb-dark .tb-section::before {
          background: linear-gradient(90deg, rgba(222, 166, 54, 0), rgba(222, 166, 54, 0.4));
        }
        .tb-dark .tb-section::after {
          background: linear-gradient(90deg, rgba(222, 166, 54, 0.4), rgba(222, 166, 54, 0));
        }

        .tb-dark .tb-step {
          padding: 22px;
          border: 1px solid rgba(222, 166, 54, 0.16);
          border-radius: 16px;
          background:
            linear-gradient(180deg, rgba(222, 166, 54, 0.06) 0%, rgba(222, 166, 54, 0) 45%),
            #181817;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tb-dark .tb-step:hover {
          border-color: rgba(222, 166, 54, 0.45);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }
        .tb-dark .tb-step-title { color: #f8fafc !important; }
        .tb-dark .tb-step-desc { color: #94a3b8 !important; }
        .tb-dark .tb-icon {
          background: rgba(229, 184, 92, 0.12) !important;
          color: #E5B85C !important;
          border: 1px solid rgba(229, 184, 92, 0.28);
        }

        .tb-dark .tb-btn-outline {
          background-color: transparent !important;
          border-color: rgba(229, 184, 92, 0.4) !important;
          color: #eca75dff !important;
          transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .tb-dark .tb-btn-outline:hover {
          background-color: rgba(229, 184, 92, 0.1) !important;
          border-color: #E5B85C !important;
        }
        .tb-dark .tb-btn-main {
          background-color: #e08d33 !important;
          border-color: #E5B85C !important;
          color: #ffffffff !important;
        }
        .tb-dark .tb-btn-main:hover {
          background-color: #e08c33df !important;
        }
        .tb-dark .tb-btn-ghost {
          background-color: transparent !important;
          border-color: #3a3326 !important;
          color: #cbd5e1 !important;
        }
        .tb-dark .tb-btn-ghost:hover {
          background-color: #232220 !important;
          border-color: rgba(229, 184, 92, 0.4) !important;
        }
        .tb-dark .tb-btn { background-color: #E5B85C !important; color: #121212 !important; }
        .tb-dark .tb-btn:hover { background-color: #f0c978 !important; }

        .tb-dark .tb-overlay {
          background: rgba(0, 0, 0, 0.72) !important;
          backdrop-filter: blur(4px);
          animation: tb-fade 0.18s ease;
        }
        .tb-dark .tb-modal {
          background-color: #1a1a19 !important;
          border: 1px solid rgba(222, 166, 54, 0.3);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6) !important;
          animation: tb-pop 0.2s ease;
        }
        .tb-dark .tb-modal-text { color: #cbd5e1 !important; }
        .tb-dark .tb-modal-label { color: #e2e8f0 !important; }
        .tb-dark .tb-success-title { color: #4ade80 !important; }
        .tb-dark .tb-success-icon {
          background: rgba(74, 222, 128, 0.12) !important;
          color: #4ade80 !important;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }
        .tb-dark .tb-close { color: #94a3b8 !important; }
        .tb-dark .tb-close:hover { background-color: #2a2926 !important; color: #f8fafc !important; }
        .tb-dark .tb-input {
          background-color: #262626 !important;
          color: #f1f5f9 !important;
          border-color: #3a3326 !important;
        }
        .tb-dark .tb-input:focus {
          border-color: #E5B85C !important;
          box-shadow: 0 0 0 2px rgba(229, 184, 92, 0.25) !important;
        }
        .tb-dark .tb-input::-webkit-calendar-picker-indicator {
          filter: invert(0.85) sepia(0.4) saturate(2) hue-rotate(5deg);
          cursor: pointer;
        }

        @keyframes tb-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes tb-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </Box>
  );
}