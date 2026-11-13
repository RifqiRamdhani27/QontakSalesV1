import { useState, useEffect } from "react";
import { Box, VStack, Text, Link as ChakraLink, HStack } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  House, AddressBookIcon, PackageIcon, NoteIcon,
  Gear, MagnifyingGlass, BookOpen, Buildings, FileText, Wallet,
  Desktop, Tag, ShoppingCart, Bank, SidebarSimple, X, Factory, Truck
} from "@phosphor-icons/react";
import brandLogo from "@/assets/brand.png";
import brandLogoLight from "@/assets/Ino-Finance.png";
import brandLogoDark from "@/assets/Ino-Finance-SidebarDarkMode.png";

const allNavItems = [
  { label: "Beranda", icon: House, path: "/beranda" },
  { label: "Dashboard", icon: Desktop, path: "/dashboard" },
  { label: "Daftar Akun", icon: BookOpen, path: "/daftar-akun" },
  { label: "Kontak", icon: AddressBookIcon, path: "/contact" },
  { label: "Produk", icon: PackageIcon, path: "/main-product/products" },
  { label: "Produksi", icon: Factory, path: "/productionsmain" },
  { label: "Pemenuhan", icon: Truck, path: "/fulfillment" },
  { label: "Aset", icon: Buildings, path: "/aset" },
  { label: "Laporan", icon: FileText, path: "/laporan" },
  { label: "Anggaran", icon: Wallet, path: "/anggaran" },
  { label: "Penjualan", icon: Tag, path: "/penjualan" },
  { label: "Pembelian", icon: ShoppingCart, path: "/pembelian" },
  { label: "Biaya", icon: MagnifyingGlass, path: "/biaya" },
  { label: "Kas & Bank", icon: Bank, path: "/kas-bank" },
  { label: "Daftar Lainnya", icon: NoteIcon, path: "/daftar-lainnya" },
];

const FLOWER_WIDTH = 30;

const THEME = {
  light: {
    bg: "white",
    text: "foreground",
    border: "border",
    shadow: "0 2px 6px rgba(0,0,0,0.06)",
    hoverBg: "#efefefff",
    hoverColor: "#111827",
    activeBg: "#0adae1ff",
    activeColor: "#ffffffff",
    activeHoverBg: "#0bdfe6ff",
    toggleBg: "white",
    toggleBorder: "border",
    toggleColor: "gray.500",
    logoFilter: "none",
    titleFilter: "none",
  },
  dark: {
    bg: "#1A1A1A",
    text: "#F3F4F6",
    border: "#333333",
    shadow: "0 4px 14px rgba(229, 184, 92, 0.2)",
    hoverBg: "rgba(236, 230, 220, 0.15)",
    hoverColor: "rgba(212, 142, 36, 0.92)",
    activeBg: "rgba(180, 118, 25, 0.92)",
    activeColor: "#ffffff",
    activeHoverBg: "rgba(212, 142, 36, 0.92)",
    toggleBg: "#242424",
    toggleBorder: "#444",
    toggleColor: "#E5B85C",
    logoFilter: "brightness(0) saturate(100%) invert(78%) sepia(22%) saturate(1046%) hue-rotate(351deg) brightness(93%) contrast(91%)", titleFilter: "brightness(0) invert(1)",
  }
};

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const userRole = localStorage.getItem("user_role");
  const isManager = userRole === "MANAGER";
  const navItems = allNavItems.filter((item) => !item.managerOnly || isManager);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? "76px" : "260px";

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

  const currentTheme = THEME[themeMode];
  const isDark = themeMode === "dark";
  const logoSrc = isDark ? brandLogoDark : brandLogoLight;

  return (
    <>
      {open && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex={40}
          onClick={onClose}
        />
      )}

      <Box
        position="relative"
        w={sidebarWidth}
        h="100vh"
        zIndex={50}
        transform={{ base: open ? "translateX(0)" : "translateX(-100%)", md: "translateX(0)" }}
        transition="width 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms ease"
      >
        <Box
          as="button"
          onClick={() => setIsCollapsed((v) => !v)}
          display={{ base: "none", md: "flex" }}
          position="absolute"
          top="20px"
          right="-14px"
          w="28px"
          h="28px"
          alignItems="center"
          justifyContent="center"
          borderRadius="full"
          bg={currentTheme.toggleBg}
          border="1px solid"
          borderColor={currentTheme.toggleBorder}
          color={isDark ? "#FFFFFF" : currentTheme.toggleColor}
          boxShadow={currentTheme.shadow}
          _hover={{
            bg: themeMode === 'dark' ? '#333' : 'gray.50',
            color: isDark ? '#E5B85C' : 'gray.800',
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
          }}
          transition="all 150ms ease"
          zIndex={60}
        >
          <SidebarSimple
            size={16}
            weight="bold"
            style={{
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Box>

        <Box
          w="100%"
          h="100%"
          bg={currentTheme.bg}
          borderRight="1px solid"
          borderColor={currentTheme.border}
          boxShadow={currentTheme.shadow}
          transition="background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <Box
            w="260px"
            h="100%"
            display="flex"
            flexDirection="column"
          >
            <HStack
              justify="space-between"
              px={3}
              minH="78px"
              flexShrink={0}
            >
              {/* --- LOGO DISEMBUNYIKAN SAAT COLLAPSED --- */}
              {!isCollapsed && (
                <Box
                  as="img"
                  src={logoSrc}
                  h="72px"
                  alt="Ino Finance"
                  flexShrink={0}
                  style={{
                    transition: "filter 0.3s ease",
                  }}
                />
              )}

              <Box
                display={{ base: "block", md: "none" }}
                cursor="pointer"
                onClick={onClose}
                color={currentTheme.text}
              >
                <X size={20} />
              </Box>
            </HStack>

            <VStack flex={1} align="stretch" px={3} gap={1} overflowY="auto">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/aset" && location.pathname.startsWith("/aset"));
                const Icon = item.icon;
                return (
                  <ChakraLink
                    key={item.path}
                    as={RouterLink}
                    to={item.path}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    px={4}
                    py={3}
                    borderRadius="md"
                    fontWeight={isActive ? "semibold" : "normal"}
                    bg={isActive ? currentTheme.activeBg : "transparent"}
                    color={isActive ? currentTheme.activeColor : currentTheme.text}
                    _hover={{
                      bg: isActive ? currentTheme.activeHoverBg : currentTheme.hoverBg,
                      color: isActive ? currentTheme.activeColor : currentTheme.hoverColor,
                      textDecoration: "none",
                    }}
                    transition="all 150ms ease"
                    onClick={onClose}
                    minH="44px"
                  >
                    <Icon size={22} style={{ flexShrink: 0 }} />
                    <Text
                      fontSize="sm"
                      whiteSpace="nowrap"
                      display={isCollapsed ? "none" : "block"}
                    >
                      {item.label}
                    </Text>
                  </ChakraLink>
                );
              })}
            </VStack>

            <Box p={3} flexShrink={0}>
              <ChakraLink
                as={RouterLink}
                to="/settings"
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="md"
                color={location.pathname.startsWith("/settings") ? currentTheme.activeColor : currentTheme.text}
                bg={location.pathname.startsWith("/settings") ? currentTheme.activeBg : "transparent"}
                _hover={{
                  bg: location.pathname.startsWith("/settings") ? currentTheme.activeHoverBg : currentTheme.hoverBg,
                  color: location.pathname.startsWith("/settings") ? currentTheme.activeColor : currentTheme.hoverColor,
                  textDecoration: "none"
                }}
                transition="all 150ms ease"
                onClick={onClose}
                minH="44px"
              >
                <Gear size={22} style={{ flexShrink: 0 }} />
                <Text
                  fontSize="sm"
                  whiteSpace="nowrap"
                  display={isCollapsed ? "none" : "block"}
                >
                  Settings
                </Text>
              </ChakraLink>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}