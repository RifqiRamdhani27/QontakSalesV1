import { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const LIGHT_MOTIF = {
  aurora: 1,
  ring: 0.1,
  ringGap: 56,
  ringRgb: "0,135,217",
  cyan: "0,168,253",
  indigo: "86,78,249",
  mint: "52,211,153",
};

const buildLightLayers = ({ aurora, ring, ringGap, ringRgb, cyan, indigo, mint }) => {
  const a = (v) => +(v * aurora).toFixed(3);
  return [
    { image: `radial-gradient(42% 48% at 100% 6%, rgba(${cyan},${a(0.17)}) 0%, rgba(${cyan},${a(0.07)}) 45%, rgba(${cyan},0) 75%)` },
    { image: `radial-gradient(34% 40% at 80% 0%, rgba(${indigo},${a(0.09)}) 0%, rgba(${indigo},0) 70%)` },
    { image: `radial-gradient(36% 42% at 100% 44%, rgba(${mint},${a(0.11)}) 0%, rgba(${mint},0) 70%)` },
    { image: "radial-gradient(ellipse 70% 82% at 100% 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, #ffffff 86%)" },
    {
      image: `repeating-radial-gradient(circle at 100% 0%, rgba(${ringRgb},0) 0px, rgba(${ringRgb},0) ${ringGap - 1}px, rgba(${ringRgb},${ring}) ${ringGap - 1}px, rgba(${ringRgb},${ring}) ${ringGap}px)`,
    },
  ];
};

const DARK_LAYERS = [
  { image: "radial-gradient(55% 60% at 100% 18%, rgba(222,166,54,0.10) 0%, rgba(222,166,54,0.04) 45%, rgba(222,166,54,0) 75%)" },
  { image: "radial-gradient(ellipse 62% 70% at 100% 22%, rgba(18,18,18,0) 0%, rgba(18,18,18,0.65) 45%, #121212 78%)" },
  { image: "radial-gradient(rgba(222,166,54,0.15) 1px, transparent 1.2px)", size: "22px 22px", repeat: "repeat" },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasBackdrop, setHasBackdrop] = useState(false);
  const location = useLocation();
  const isSettings = location.pathname.startsWith("/settings");

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setThemeMode(localStorage.getItem("app_theme") || "light");
    };
    window.addEventListener("themeChanged", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);
  const isDark = themeMode === "dark";
  const bgColor = isDark ? "#121212" : "white";
  const textColor = isDark ? "#F3F4F6" : "inherit";

  const scrollbarCss = {
    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
      width: "12px",
      height: "12px",
    },
    "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
      background: isDark ? "#121212" : "#ffffff",
    },
    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
      background: isDark ? "#644e24ff" : "#cbd5e1",
      borderRadius: "8px",
      border: `3px solid ${isDark ? "#121212" : "#ffffff"}`,
    },
    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
      background: isDark ? "#8f6c1fff" : "#94a3b8",
    },
  };

  const layers = isDark ? DARK_LAYERS : buildLightLayers(LIGHT_MOTIF);
  const showMotif = isDark && hasBackdrop && !isSettings;
  const motifCss = showMotif
    ? {
      backgroundColor: isDark ? "#121212" : "#ffffff",
      backgroundImage: layers.map((l) => l.image).join(", "),
      backgroundSize: layers.map((l) => l.size || "100% 100%").join(", "),
      backgroundRepeat: layers.map((l) => l.repeat || "no-repeat").join(", "),
      backgroundPosition: layers.map(() => "0 0").join(", "),
      backgroundOrigin: "border-box",
      backgroundClip: "border-box",
      "&&::-webkit-scrollbar-track": { background: "transparent" },
      "&&::-webkit-scrollbar-thumb": {
        border: "3px solid transparent",
        backgroundClip: "padding-box",
      },
      "&&::-webkit-scrollbar-thumb:hover": {
        backgroundClip: "padding-box",
      },
    }
    : undefined;

  return (
    <Flex
      h="100vh"
      bg={bgColor}
      color={textColor}
      overflow="hidden"
      transition="background 0.3s ease, color 0.3s ease"
      css={scrollbarCss}
    >
      {!isFullscreen && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <Flex flex={1} flexDirection="column" minW={0}>
        {!isFullscreen && (
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
        )}
        <Box
          flex={1}
          p={isFullscreen || isSettings ? 0 : { base: 4, md: 6 }}
          overflow={isSettings ? "hidden" : "auto"}
          css={motifCss}
        >
          <Outlet
            context={{
              isFullscreen,
              setIsFullscreen,
              toggleFullscreen,
              setHasBackdrop,
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}