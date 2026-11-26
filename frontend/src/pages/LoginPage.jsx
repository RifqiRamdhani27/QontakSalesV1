import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import api from "@/services/api";
import bgImage from "@/assets/meeting.jpg";
import LoadingPopup from "@/components/ui/LoadingPopup";

const ACCENT = "#7DD3FC";
const BTN = "#0089c8ff";
const ACCENT_HOVER = "rgba(20, 118, 176, 1)";
const ACCENT_LIGHT = "#21c6f3ff";
const PANEL_BG = "#0B1120";

const GoogleLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const socials = [
  { label: "Google", icon: GoogleLogo },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const pageIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const cardIn = keyframes`from { opacity: 0; transform: translateY(36px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); }`;
const riseIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const slideIn = keyframes`from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); }`;
const popIn = keyframes`from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); }`;
const growIn = keyframes`from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); }`;

const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const enter = (name, delay = 0, duration = 800) => reduceMotion ? "none" : `${name} ${duration}ms ${EASE} ${delay}ms backwards`;

function FloatingInput({ name, label, type = "text", secret = false, revealed = false, trailing = null, value, onChange }) {
  const id = `login-${name}`;
  const inputRef = useRef(null);
  const labelRef = useRef(null);
  const [locked, setLocked] = useState(true);
  const [focused, setFocused] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);

  const floated = focused || value.length > 0;
  const notchWidth = Math.ceil(labelWidth * 0.8 + 10);

  useLayoutEffect(() => {
    if (labelRef.current) setLabelWidth(labelRef.current.offsetWidth);
  }, [label]);

  const unlockAndFocus = () => {
    if (!locked) return;
    setLocked(false);
    requestAnimationFrame(() => {
      if (inputRef.current) inputRef.current.focus();
    });
  };

  const handleFocus = () => {
    if (locked) setLocked(false);
    setFocused(true);
  };

  const hideText = secret && !revealed;

  return (
    <Box
      position="relative"
      onMouseDown={unlockAndFocus}
      onTouchStart={unlockAndFocus}
      css={{ "& input:-webkit-autofill": { WebkitBoxShadow: "0 0 0 1000px transparent inset", transition: "background-color 99999s ease-in-out 0s", WebkitTextFillColor: "#f3f4f6", caretColor: "#f3f4f6" } }}
    >
      <Input
        ref={inputRef}
        id={id}
        name={`login_${name}`}
        type={secret ? "text" : type === "email" ? "text" : type}
        inputMode={type === "email" ? "email" : undefined}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        autoComplete="new-password"
        readOnly={locked}
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        data-form-type="other"
        style={hideText ? { WebkitTextSecurity: "disc" } : undefined}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        required
        position="relative"
        zIndex={1}
        h="56px"
        px={4}
        pr={trailing ? 12 : 4}
        bg="transparent"
        color="gray.100"
        fontSize="md"
        border="none"
        borderRadius="1.5rem"
        _focus={{ outline: "none", boxShadow: "none" }}
        _focusVisible={{ outline: "none", boxShadow: "none" }}
      />

      <Box as="fieldset" aria-hidden="true" position="absolute" top="-5px" bottom="0" left="0" right="0" m={0} py={0} px="8px" minW={0} border="1.8px solid" borderColor={focused ? ACCENT : "#9e9e9e"} borderRadius="1.5rem" pointerEvents="none" overflow="hidden" transition="border-color 250ms cubic-bezier(0.4,0,0.2,1)">
        <Box as="legend" display="block" p={0} h="11px" fontSize="0.7rem" whiteSpace="nowrap" visibility="hidden" overflow="hidden" style={{ maxWidth: floated ? `${notchWidth}px` : "0.01px", transition: "max-width 250ms cubic-bezier(0.4,0,0.2,1)" }}>
          <Box as="span" display="inline-block" px="5px">{label}</Box>
        </Box>
      </Box>

      <Box ref={labelRef} as="label" htmlFor={id} position="absolute" zIndex={2} left="15px" top={floated ? "0" : "50%"} transform={floated ? "translateY(-50%) scale(0.8)" : "translateY(-50%)"} transformOrigin="left center" color={floated ? ACCENT_LIGHT : "gray.200"} fontSize="sm" lineHeight="1" whiteSpace="nowrap" pointerEvents="none" transition="top 250ms cubic-bezier(0.4,0,0.2,1), transform 250ms cubic-bezier(0.4,0,0.2,1), color 250ms cubic-bezier(0.4,0,0.2,1)">
        {label}
      </Box>

      {trailing && (
        <Box position="absolute" zIndex={3} right="16px" top="50%" transform="translateY(-50%)" display="flex" alignItems="center" color="whiteAlpha.700" cursor="pointer" _hover={{ color: "white" }} transition="color 200ms ease" onMouseDown={(e) => e.preventDefault()}>
          {trailing}
        </Box>
      )}
    </Box>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resent, setResent] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");


  if (localStorage.getItem("access_token") && !loading && !isSuccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUnverified(false);
    setResent(false);
    setWrongPassword(false);
    setResetSent(false);
    setResetError("");
    setIsSuccess(false);

    try {
      const response = await api.post("/token/", { email, password });

      // 1. Simpan token
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // 2. Ubah UI jadi Centang Biru (Loading tetap true biar ga ilang)
      setIsSuccess(true);

      // 3. Ambil profile secara background (abaikan jika error)
      api.get("/auth/profile/")
        .then((profile) => {
          localStorage.setItem("user_role", profile.data.role);
          localStorage.setItem("user_name", `${profile.data.first_name} ${profile.data.last_name}`);
        })
        .catch(() => { });

      // 4. Tunggu 2 detik, baru pindah halaman
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);

    } catch (err) {
      const data = err.response?.data;
      const status = err.response?.status;
      const isUnverified = data?.code === "email_not_verified";
      setUnverified(isUnverified);
      setWrongPassword(!isUnverified && !!status && status < 500);
      setError(data?.detail || data?.error || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-verification/", { email });
      setResent(true);
    } catch {
    }
  };

  const handleForgotPassword = () => {
    if (resetSending || resetSent) return;
    if (!email.trim()) {
      setResetError("Isi kolom email terlebih dahulu.");
      return;
    }
    setResetError("");
    setResetSent(true); 

    api
      .post("/auth/forgot-password/", { email: email.trim() })
      .catch(() => {
        setResetSent(false); 
        setResetError("Gagal mengirim link reset. Coba lagi.");
      });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" p={{ base: 3, md: 8 }} bgImage={`url(${bgImage})`} bgSize="cover" bgPos="center" bgRepeat="no-repeat" animation={enter(pageIn, 0, 600)}>
      <Flex w="100%" maxW="1780px" minH={{ base: "auto", md: "calc(100vh - 100px)" }} direction={{ base: "column", md: "row" }} borderRadius="4xl" overflow="hidden" boxShadow="0 25px 60px rgba(0,0,0,0.60)" color="white" animation={enter(cardIn, 100, 1000)}>
        <Flex display={{ base: "none", md: "flex" }} flex="1" direction="column" justify="center" p={14} position="relative">
          <Box position="absolute" top="0" right="0" bottom="0" left="0" bg="blackAlpha.500" pointerEvents="none" />
          <Heading as="h1" position="relative" fontSize="5xl" fontWeight="bold" lineHeight="1.1" mb={4} animation={enter(slideIn, 350, 900)}>Welcome Back</Heading>
          <Text position="relative" fontSize="sm" fontWeight="medium" color="whiteAlpha.800" maxW="420px" animation={enter(slideIn, 500, 900)}>Sign in to your account to continue. Monitor your business performance and close your products faster.</Text>
        </Flex>

        <Flex flex="1" bg={PANEL_BG} p={{ base: 6, md: 12 }} align="center" justify="center" ml={{ base: 0, md: "-1px" }} bgImage="radial-gradient(circle at 100% 0%, rgba(125, 212, 252, 0.46) 0%, rgba(14, 164, 233, 0.2) 35%, transparent 65%)" position="relative" zIndex={1}>
          <Flex w="100%" maxW="560px" gap={{ base: 6, md: 8 }} direction={{ base: "column", md: "row" }}>
            <Box flex="1">
              <Heading as="h2" fontSize="2xl" mb={8} animation={enter(riseIn, 400)}>Sign in</Heading>

              <form onSubmit={handleSubmit} autoComplete="off">
                <Stack gap={5}>
                  {error && <Box bg="red.900" color="red.100" p={3} borderRadius="md" fontSize="sm" textAlign="center">{error}</Box>}
                  {unverified && (
                    <Button variant="link" color="#1bceffff" fontSize="sm" onClick={handleResend} disabled={resent}>
                      {resent ? "Email terkirim, cek inbox kamu" : "Kirim ulang email verifikasi"}
                    </Button>
                  )}
                  <Box animation={enter(riseIn, 500)}>
                    <FloatingInput name="email" type="email" label="Email" value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setResetSent(false);
                        setResetError("");
                      }}
                    />
                  </Box>

                  {wrongPassword && (
                    <Flex direction="column" align="flex-end" gap={1} mt={-2} animation={enter(riseIn, 0, 400)}>
                      <Button
                        type="button"
                        variant="link"
                        color={resetSent ? "green.300" : "white"}
                        fontSize="xs"
                        h="auto"
                        minH="0"
                        minW="0"
                        p={0}
                        loading={resetSending}
                        disabled={resetSent}
                        onClick={handleForgotPassword}
                      >
                        {resetSent ? "Link reset terkirim, cek inbox email kamu" : "Forgot password?"}
                      </Button>
                      {resetError && (
                        <Text fontSize="xs" color="red.300">{resetError}</Text>
                      )}
                    </Flex>
                  )}

                  <Box animation={enter(riseIn, 600)}>
                    <FloatingInput
                      name="password"
                      secret
                      revealed={showPassword}
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      trailing={
                        <Box onClick={() => setShowPassword(!showPassword)} display="flex" alignItems="center">
                          {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                        </Box>
                      }
                    />
                  </Box>

                  <Button type="submit" mt={4} w="100%" h="54px" bg={BTN} color="white" borderRadius="1.5rem" fontSize="md" fontWeight="semibold" loading={loading} _hover={{ bg: ACCENT_HOVER }} transition="background 200ms ease" animation={enter(riseIn, 700)}>Sign In</Button>
                  <Text fontSize="xs" textAlign="center" fontWeight="medium" animation={enter(riseIn, 800)}>
                    Don't have an account?{" "}
                    <Button variant="link" color="#1bceffff" fontWeight="semibold" fontSize="inherit" h="auto" minH="0" minW="0" p={0} ml={2} verticalAlign="baseline" onClick={() => navigate("/register")}>Sign up for free</Button>
                  </Text>
                </Stack>
              </form>
            </Box>

            <Flex display={{ base: "none", md: "flex" }} direction="column" align="center" justify="center" gap={3}>
              <Box w="1px" flex="1" bg="whiteAlpha.500" transformOrigin="bottom" animation={enter(growIn, 600, 900)} />
              <Text fontSize="sm" fontWeight="semibold" color="whiteAlpha.800" animation={enter(riseIn, 800)}>OR</Text>
              <Box w="1px" flex="1" bg="whiteAlpha.500" transformOrigin="top" animation={enter(growIn, 600, 900)} />
            </Flex>

            <VStack display={{ base: "none", md: "flex" }} justify="center" gap={4}>
              {socials.map(({ label, icon: Icon }, i) => (
                <IconButton key={label} type="button" aria-label={`Sign in with ${label}`} rounded="full" bg="white" color="black" size="md" _hover={{ bg: "gray.200" }} animation={enter(popIn, 800 + i * 100, 700)}>
                  <Icon size={18} />
                </IconButton>
              ))}
            </VStack>
          </Flex>
        </Flex>
      </Flex>

      <LoadingPopup
        open={loading || isSuccess}
        message={isSuccess ? "Login berhasil!" : "Signing in..."}
        isSuccess={isSuccess}
      />
    </Flex>
  );
}