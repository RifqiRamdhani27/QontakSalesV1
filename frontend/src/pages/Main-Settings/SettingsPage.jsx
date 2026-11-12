import { useEffect, useState } from "react";
import { Box, VStack, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import "./SettingsPage.css";
import api, { extractError } from "@/services/settingsApi";
import { setSettingsAccess } from "@/services/settingsAccess";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

import CompanyPage from "@/pages/Main-Settings/CompanyPage";
import UserManagementPage from "@/pages/Main-Settings/UserManagementPage";
import SalesPage from "@/pages/Main-Settings/SalesPage";
import PurchasesSettingsPage from "@/pages/Main-Settings/PurchasesSettingsPage";
import ProductsSettingsPage from "@/pages/Main-Settings/ProductsSettingsPage";
import ProductionsSettingsPage from "@/pages/Main-Settings/ProductionsSettingsPage";
import TemplateSettingsPage from "@/pages/Main-Settings/TemplateSettingsPage";
import CustomFieldsPage from "@/pages/Main-Settings/CustomFieldsPage";
import AccountMappingPage from "@/pages/Main-Settings/AccountMappingPage";
import BillingsPage from "@/pages/Main-Settings/BillingsPage";
import ApprovalRulesPage from "@/pages/Main-Settings/ApprovalRulesPage";
import TaggingRulesPage from "@/pages/Main-Settings/TaggingRulesPage";
import AgentsPage from "@/pages/Main-Settings/AgentsPage";

const SETTINGS_MENU = [
  { id: "company", label: "Perusahaan", path: "/settings/company", component: CompanyPage },
  { id: "agents", label: "Agen", path: "/settings/agents", component: AgentsPage },
  { id: "user-management", label: "Pengaturan pengguna", path: "/settings/user-management", component: UserManagementPage },
  { id: "sales", label: "Penjualan", path: "/settings/sales", component: SalesPage, hasDropdown: true },
  { id: "purchases", label: "Pembelian", path: "/settings/purchases", component: PurchasesSettingsPage },
  { id: "products", label: "Produk", path: "/settings/products", component: ProductsSettingsPage, hasDropdown: true },
  { id: "productions", label: "Produksi", path: "/settings/productions", component: ProductionsSettingsPage },
  { id: "template", label: "Templat", path: "/settings/template", component: TemplateSettingsPage, hasDropdown: true },
  { id: "custom-fields", label: "Custom field", path: "/settings/custom-fields", component: CustomFieldsPage },
  { id: "account-mapping", label: "Pemetaan Akun", path: "/settings/account-mapping", component: AccountMappingPage },
  { id: "billings", label: "Tagihan", path: "/settings/billings", component: BillingsPage },
  { id: "approval-rules", label: "Aturan approval", path: "/settings/approval-rules", component: ApprovalRulesPage },
  { id: "tagging-rules", label: "Aturan tagging", path: "/settings/tagging-rules", component: TaggingRulesPage },
];

export default function Pengaturan() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [access, setAccess] = useState(null);
  const [accessError, setAccessError] = useState("");

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

  const availableItems = SETTINGS_MENU.filter((item) => access?.modules?.[item.id]?.view === true);
  const activeItem =
    SETTINGS_MENU.find((item) => location.pathname === item.path || location.pathname.startsWith(item.path + "/")) || availableItems[0];
  const ActiveComponent = activeItem && access?.modules?.[activeItem.id]?.view === true ? activeItem.component : null;

  return (
    <HStack data-qontak-settings="" align="stretch" gap={0} minW={0} style={{ height: "calc(100vh - 60px)", overflow: "hidden" }} bg="#F5F7FA">
      <Box
        w={collapsed ? "0px" : "230px"}
        minW={collapsed ? "0px" : "230px"}
        bg="white"
        borderRight="1px solid"
        borderColor="border"
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
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#CBD5E1", borderRadius: "3px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          }}
        >
          {availableItems.map((item) => {
          const isActive = item.id === activeItem?.id;
          const isOpen = openDropdown === item.id;
          return (
            <Box key={item.id}>
              <ChakraLink
                as={RouterLink}
                to={item.path}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={3}
                py={2.5}
                borderRadius="md"
                fontSize="sm"
                fontWeight={isActive ? "semibold" : "normal"}
                bg={isActive ? "#EEF0FE" : "transparent"}
                color={isActive ? "primary" : "foreground"}
                _hover={{ bg: isActive ? "#EEF0FE" : "muted", textDecoration: "none" }}
                transition="all 150ms ease"
                onClick={() => {
                  if (item.hasDropdown) {
                    setOpenDropdown(isOpen ? null : item.id);
                  }
                }}
              >
                <Text>{item.label}</Text>
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
          bg="white"
          borderRight="1px solid"
          borderColor="border"
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
          <Box p={7}><Text color="gray.600">Memuat hak akses pengaturan...</Text></Box>
        ) : ActiveComponent ? (
          <ErrorBoundary key={activeItem.id}>
            <ActiveComponent />
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