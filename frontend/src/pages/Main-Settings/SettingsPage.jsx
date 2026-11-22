import { lazy, Suspense, useEffect, useState } from "react";
import { Box, VStack, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  ArrowsLeftRight,
  BookmarkSimple,
  Buildings,
  Factory,
  Package,
  PaintBrush,
  Receipt,
  SealCheck,
  ShoppingCart,
  SquaresFour,
  Tag,
  Textbox,
  UserGear,
  UsersThree,
} from "@phosphor-icons/react";
import "./SettingsPage.css";
import api, { extractError } from "@/services/settingsApi";
import { setSettingsAccess } from "@/services/settingsAccess";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import PageLoader from "@/components/ui/PageLoader";

const CompanyPage = lazy(() => import("@/pages/Main-Settings/CompanyPage"));
const UserManagementPage = lazy(() => import("@/pages/Main-Settings/UserManagementPage"));
const SalesPage = lazy(() => import("@/pages/Main-Settings/SalesPage"));
const PurchasesSettingsPage = lazy(() => import("@/pages/Main-Settings/PurchasesSettingsPage"));
const ProductsSettingsPage = lazy(() => import("@/pages/Main-Settings/ProductsSettingsPage"));
const ProductionsSettingsPage = lazy(() => import("@/pages/Main-Settings/ProductionsSettingsPage"));
const TemplateSettingsPage = lazy(() => import("@/pages/Main-Settings/TemplateSettingsPage"));
const CustomFieldsPage = lazy(() => import("@/pages/Main-Settings/CustomFieldsPage"));
const AccountMappingPage = lazy(() => import("@/pages/Main-Settings/AccountMappingPage"));
const BillingsPage = lazy(() => import("@/pages/Main-Settings/BillingsPage"));
const ApprovalRulesPage = lazy(() => import("@/pages/Main-Settings/ApprovalRulesPage"));
const TaggingRulesPage = lazy(() => import("@/pages/Main-Settings/TaggingRulesPage"));
const AgentsPage = lazy(() => import("@/pages/Main-Settings/AgentsPage"));
const AppearancePage = lazy(() => import("@/pages/Main-Settings/AppearancePage"));

const SETTINGS_MENU = [
  { id: "company", label: "Perusahaan", path: "/settings/company", component: CompanyPage, Icon: Buildings },
  { id: "appearance", label: "Appearance", path: "/settings/appearance", component: AppearancePage, Icon: PaintBrush },
  { id: "agents", label: "Agen", path: "/settings/agents", component: AgentsPage, Icon: UsersThree },
  { id: "user-management", label: "Pengaturan pengguna", path: "/settings/user-management", component: UserManagementPage, Icon: UserGear },
  { id: "sales", label: "Penjualan", path: "/settings/sales", component: SalesPage, hasDropdown: true, Icon: Tag },
  { id: "purchases", label: "Pembelian", path: "/settings/purchases", component: PurchasesSettingsPage, Icon: ShoppingCart },
  { id: "products", label: "Produk", path: "/settings/products", component: ProductsSettingsPage, hasDropdown: true, Icon: Package },
  { id: "productions", label: "Produksi", path: "/settings/productions", component: ProductionsSettingsPage, Icon: Factory },
  { id: "template", label: "Templat", path: "/settings/template", component: TemplateSettingsPage, hasDropdown: true, Icon: Textbox },
  { id: "custom-fields", label: "Custom field", path: "/settings/custom-fields", component: CustomFieldsPage, Icon: SquaresFour },
  { id: "account-mapping", label: "Pemetaan Akun", path: "/settings/account-mapping", component: AccountMappingPage, Icon: ArrowsLeftRight },
  { id: "billings", label: "Tagihan", path: "/settings/billings", component: BillingsPage, Icon: Receipt },
  { id: "approval-rules", label: "Aturan approval", path: "/settings/approval-rules", component: ApprovalRulesPage, Icon: SealCheck },
  { id: "tagging-rules", label: "Aturan tagging", path: "/settings/tagging-rules", component: TaggingRulesPage, Icon: BookmarkSimple },
];

export default function Pengaturan() {
  const location = useLocation();
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light"
  );
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [access, setAccess] = useState(null);
  const [accessError, setAccessError] = useState("");

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
    let active = true;
    setSettingsAccess(null);
    api.get("/settings/access/")
      .then((response) => {
        if (!active) return;
        setSettingsAccess(response.data);
        setAccess(response.data);
      })
      .catch((error) => {
        if (!active) return;
        setSettingsAccess(null);
        setAccessError(extractError(error, "Gagal memuat hak akses pengaturan."));
      });
    return () => {
      active = false;
    };
  }, []);

  const canViewItem = (item) =>
    access?.modules?.[item.id]?.view === true &&
    (item.id !== "appearance" || access?.is_admin === true);
  const availableItems = SETTINGS_MENU.filter(canViewItem);
  const activeItem =
    SETTINGS_MENU.find((item) => location.pathname === item.path || location.pathname.startsWith(item.path + "/")) || availableItems[0];
  const ActiveComponent = activeItem && canViewItem(activeItem) ? activeItem.component : null;

  return (
    <HStack data-qontak-settings="" className={isDark ? "settings-dark" : ""} align="stretch" gap={0} minW={0} style={{ height: "calc(100vh - 60px)", overflow: "hidden" }} bg={isDark ? "#121212" : "#F5F7FA"}>
      <Box
        w={collapsed ? "0px" : "230px"}
        minW={collapsed ? "0px" : "230px"}
        bg={isDark ? "#1A1A1A" : "white"}
        borderRight="1px solid"
        borderColor={isDark ? "#333333" : "border"}
        display="flex"
        flexDirection="column"
        overflow="hidden"
        transition="width 150ms ease, min-width 150ms ease"
        position="relative"
      >
        <Box px={5} pt={6} pb={3} minW="230px">
          <Text
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="0.06em"
            color="primary"
          >
            PENGATURAN
          </Text>
        </Box>

        <VStack
          align="stretch"
          gap="2px"
          px={2}
          flex={1}
          overflowY="auto"
          minW="230px"
          css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: isDark ? "#4A4A4A" : "#CBD5E1", borderRadius: "3px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          }}
        >
          {availableItems.map((item) => {
            const isActive = item.id === activeItem?.id;
            const isOpen = openDropdown === item.id;
            const ItemIcon = item.Icon;
            return (
              <Box key={item.id}>
                <ChakraLink
                  as={RouterLink}
                  to={item.path}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  px={3}
                  py={2.5}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight={isActive ? "semibold" : "normal"}
                  bg={isActive ? (isDark ? "rgba(229,184,92,0.15)" : "#EEF0FE") : "transparent"}
                  color={isActive ? "primary" : "foreground"}
                  _hover={{ bg: isActive ? (isDark ? "rgba(229,184,92,0.15)" : "#EEF0FE") : (isDark ? "#2D2D2D" : "muted"), textDecoration: "none" }}
                  transition="all 150ms ease"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    if (item.hasDropdown) {
                      setOpenDropdown(isOpen ? null : item.id);
                    }
                  }}
                >
                  <HStack gap={2.5} minW={0} flex={1}>
                    {ItemIcon && (
                      <Box as="span" display="flex" flexShrink={0} opacity={isActive ? 1 : 0.7} aria-hidden="true">
                        <ItemIcon size={17} weight={isActive ? "fill" : "regular"} />
                      </Box>
                    )}
                    <Text truncate>{item.label}</Text>
                  </HStack>
                  {item.hasDropdown && (
                    <CaretDown
                      size={14}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 150ms ease",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </ChakraLink>
              </Box>
            );
          })}
        </VStack>

        <Box
          as="button"
          type="button"
          aria-label="Ciutkan navigasi pengaturan"
          aria-expanded={!collapsed}
          position="absolute"
          bottom={3}
          right={3}
          cursor="pointer"
          color="foreground"
          opacity={0.5}
          onClick={() => setCollapsed(true)}
        >
          <CaretLeft size={16} />
        </Box>
      </Box>

      {collapsed && (
        <Box
          as="button"
          type="button"
          aria-label="Perluas navigasi pengaturan"
          aria-expanded={!collapsed}
          w="18px"
          bg={isDark ? "#1A1A1A" : "white"}
          borderRight="1px solid"
          borderColor={isDark ? "#333333" : "border"}
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          pb={3}
          cursor="pointer"
          onClick={() => setCollapsed(false)}
        >
          <CaretRight size={14} />
        </Box>
      )}

      <Box flex={1} minW={0} overflowY="auto">
        {accessError ? (
          <Box p={7}><Text color="red.600">{accessError}</Text></Box>
        ) : !access ? (
          <PageLoader label="Memuat hak akses pengaturan…" />
        ) : ActiveComponent ? (
          <ErrorBoundary key={activeItem.id}>
            <Suspense fallback={<PageLoader label="Memuat halaman pengaturan…" />}>
              <ActiveComponent />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <Box p={7} role="alert">
            <Text fontWeight="semibold">Akses pengaturan tidak diizinkan.</Text>
            <Text mt={2} color="gray.600">Peran akun ini tidak memiliki izin untuk membuka halaman tersebut.</Text>
          </Box>
        )}
      </Box>
    </HStack>
  );
}