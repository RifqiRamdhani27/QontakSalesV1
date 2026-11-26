import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
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

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const pageIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const cardIn = keyframes`from { opacity: 0; transform: translateY(36px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); }`;
const riseIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const slideIn = keyframes`from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); }`;

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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [search] = useSearchParams();
  const uid = params.uid || search.get("uid") || "";
  const token = params.token || search.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password/", {
        uid,
        token,
        password,
        password_confirm: confirm,
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.detail ||
        data?.error ||
        (Array.isArray(data?.password) ? data.password.join(" ") : data?.password) ||
        (Array.isArray(data?.token) ? data.token.join(" ") : data?.token) ||
        "Link reset tidak valid atau sudah kedaluwarsa.";
      setError(String(message));
      setLoading(false);
    }
  };

  const eyeToggle = (shown, toggle) => (
    <Box onClick={toggle} display="flex" alignItems="center">
      {shown ? <EyeClosed size={20} /> : <Eye size={20} />}
    </Box>
  );

  return (
    <Flex minH="100vh" align="center" justify="center" p={{ base: 3, md: 8 }} bgImage={`url(${bgImage})`} bgSize="cover" bgPos="center" bgRepeat="no-repeat" animation={enter(pageIn, 0, 600)}>
      <Flex w="100%" maxW="1780px" minH={{ base: "auto", md: "calc(100vh - 100px)" }} direction={{ base: "column", md: "row" }} borderRadius="4xl" overflow="hidden" boxShadow="0 25px 60px rgba(0,0,0,0.60)" color="white" animation={enter(cardIn, 100, 1000)}>
        <Flex display={{ base: "none", md: "flex" }} flex="1" direction="column" justify="center" p={14} position="relative">
          <Box position="absolute" top="0" right="0" bottom="0" left="0" bg="blackAlpha.500" pointerEvents="none" />
          <Heading as="h1" position="relative" fontSize="5xl" fontWeight="bold" lineHeight="1.1" mb={4} animation={enter(slideIn, 350, 900)}>Reset Password</Heading>
          <Text position="relative" fontSize="sm" fontWeight="medium" color="whiteAlpha.800" maxW="420px" animation={enter(slideIn, 500, 900)}>Create a new password for your account. Make sure it is strong and easy for you to remember.</Text>
        </Flex>

        <Flex flex="1" bg={PANEL_BG} p={{ base: 6, md: 12 }} align="center" justify="center" ml={{ base: 0, md: "-1px" }} bgImage="radial-gradient(circle at 100% 0%, rgba(125, 212, 252, 0.46) 0%, rgba(14, 164, 233, 0.2) 35%, transparent 65%)" position="relative" zIndex={1}>
          <Box w="100%" maxW="420px">
            <Heading as="h2" fontSize="2xl" mb={8} animation={enter(riseIn, 400)}>Password baru</Heading>

            <form onSubmit={handleSubmit} autoComplete="off">
              <Stack gap={5}>
                {error && <Box bg="red.900" color="red.100" p={3} borderRadius="md" fontSize="sm" textAlign="center">{error}</Box>}

                <Box animation={enter(riseIn, 500)}>
                  <FloatingInput
                    name="new_password"
                    secret
                    revealed={showPassword}
                    label="Password baru"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    trailing={eyeToggle(showPassword, () => setShowPassword(!showPassword))}
                  />
                </Box>

                <Box animation={enter(riseIn, 600)}>
                  <FloatingInput
                    name="confirm_password"
                    secret
                    revealed={showConfirm}
                    label="Ulangi password baru"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                    trailing={eyeToggle(showConfirm, () => setShowConfirm(!showConfirm))}
                  />
                </Box>

                <Button type="submit" mt={4} w="100%" h="54px" bg={BTN} color="white" borderRadius="1.5rem" fontSize="md" fontWeight="semibold" loading={loading} _hover={{ bg: ACCENT_HOVER }} transition="background 200ms ease" animation={enter(riseIn, 700)}>Simpan password</Button>

                <Text fontSize="xs" textAlign="center" fontWeight="medium" animation={enter(riseIn, 800)}>
                  Ingat password kamu?{" "}
                  <Button variant="link" color="#1bceffff" fontWeight="semibold" fontSize="inherit" h="auto" minH="0" minW="0" p={0} ml={2} verticalAlign="baseline" onClick={() => navigate("/")}>Kembali ke login</Button>
                </Text>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Flex>

      <LoadingPopup
        open={loading || isSuccess}
        message={isSuccess ? "Password berhasil diubah!" : "Menyimpan..."}
        isSuccess={isSuccess}
      />
    </Flex>
  );
}