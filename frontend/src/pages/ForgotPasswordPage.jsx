import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import api from "@/services/api";
import bgImage from "@/assets/meeting.jpg";

const BTN = "#0089c8ff";
const ACCENT_HOVER = "rgba(20, 118, 176, 1)";
const PANEL_BG = "#0B1120";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password/", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.status === 429
          ? "Terlalu sering mencoba. Coba lagi dalam 1 jam."
          : "Gagal mengirim email. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      p={4}
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPos="center"
    >
      <Box w="100%" maxW="460px" bg={PANEL_BG} color="white" borderRadius="3xl" p={{ base: 6, md: 10 }} boxShadow="0 25px 60px rgba(0,0,0,0.60)">
        <Heading as="h2" fontSize="2xl" mb={2}>Forgot password</Heading>

        {sent ? (
          <Stack gap={5}>
            <Text fontSize="sm" color="whiteAlpha.800">
              Jika email <b>{email}</b> terdaftar, kami sudah mengirim link untuk membuat password baru.
              Cek inbox dan folder Spam. Link berlaku 1 jam.
            </Text>
            <Button h="54px" bg={BTN} color="white" borderRadius="1.5rem" _hover={{ bg: ACCENT_HOVER }} onClick={() => navigate("/login")}>
              Kembali ke login
            </Button>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack gap={5}>
              <Text fontSize="sm" color="whiteAlpha.800">
                Masukkan email akun kamu. Kami kirim link untuk membuat password baru.
              </Text>
              {error && (
                <Box bg="red.900" color="red.100" p={3} borderRadius="md" fontSize="sm" textAlign="center">{error}</Box>
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                h="56px"
                px={4}
                bg="transparent"
                color="gray.100"
                borderColor="#9e9e9e"
                borderRadius="1.5rem"
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "#7DD3FC", boxShadow: "none" }}
              />
              <Button type="submit" h="54px" bg={BTN} color="white" borderRadius="1.5rem" fontWeight="semibold" loading={loading} _hover={{ bg: ACCENT_HOVER }}>
                Kirim link reset
              </Button>
              <Button type="button" variant="link" color="#1bceffff" fontSize="xs" onClick={() => navigate("/login")}>
                Kembali ke login
              </Button>
            </Stack>
          </form>
        )}
      </Box>
    </Flex>
  );
}