import { useState, useEffect, useLayoutEffect, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import brandLogoWhite from "@/assets/Ino-Finance-Footer.png";
import brandLogoBlack from "@/assets/Ino-Finance.png";

const C = {
  ink: "#484848ff", mute: "#475569",
  sky: "#0284C7", skyHover: "#0e78acfa", sky300: "#7DD3FC",
};
const EASE = "cubic-bezier(0.25, 1, 0.8, 1)";
const NAV_MID = 35;

const DARK_IDS = [
  "home", "section-dark-testimonial", "section-dark-2", "section-dark-3",
  "terms-hero", "terms-footer",
  "privacy-hero", "privacy-footer",
];

const getDarkSections = () => {
  const found = new Set();
  DARK_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) found.add(el);
  });
  document.querySelectorAll("[data-nav-dark]").forEach((el) => found.add(el));
  return Array.from(found);
};

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

function useDarkNav(pathname) {
  const [dark, setDark] = useState(false);

  useLayoutEffect(() => {
    let io;
    let retry;
    let resizeTimer;
    const visible = new Set();

    const build = () => {
      io?.disconnect();
      visible.clear();

      const sections = getDarkSections();
      if (sections.length === 0) {
        setDark(false);
        return;
      }

      const bottom = Math.max(window.innerHeight - NAV_MID - 1, 0);
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) visible.add(e.target);
            else visible.delete(e.target);
          });
          setDark(visible.size > 0);
        },
        { rootMargin: `-${NAV_MID}px 0px -${bottom}px 0px`, threshold: 0 }
      );
      sections.forEach((el) => io.observe(el));
    };

    build();
    retry = setTimeout(build, 300);

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(retry);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
    };
  }, [pathname]);

  return dark;
}

const NavLink = ({ children, onClick, isDarkSection }) => (
  <Box
    as="button" className="group" position="relative" overflow="hidden"
    fontSize="sm" fontWeight="600" onClick={onClick}
    color={isDarkSection ? "white" : C.mute}
    transition={`color 100ms ${EASE}`}
    _hover={{ color: isDarkSection ? C.sky300 : C.sky }}
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

const Navbar = memo(function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const onLanding = location.pathname === "/";

  const scrolled = useScrolled();
  const isDarkSection = useDarkNav(location.pathname);
  const showDarkBg = scrolled && isDarkSection;
  const showLightBg = scrolled && !isDarkSection;

  const go = (id) => {
    if (onLanding) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  useEffect(() => {
    if (!onLanding) return;
    const id = location.state?.scrollTo;
    if (!id) return;

    let tries = 0;
    let timer;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        navigate("/", { replace: true, state: null });
        return;
      }
      tries += 1;
      if (tries < 15) timer = setTimeout(attempt, 100);
      else navigate("/", { replace: true, state: null });
    };
    timer = setTimeout(attempt, 150);

    return () => clearTimeout(timer);
  }, [onLanding, location.state, navigate]);

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
              opacity={isDarkSection ? 1 : 0}
              transition={`opacity 500ms ${EASE}`}
            />
            <Box
              as="img" src={brandLogoBlack} alt="" aria-hidden h="70px"
              decoding="async"
              position="absolute" top={0} left={0} pointerEvents="none"
              opacity={isDarkSection ? 0 : 1}
              transition={`opacity 500ms ${EASE}`}
            />
          </Box>

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

export default Navbar;