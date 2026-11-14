import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  Text,
  Avatar,
  Badge,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import {
  Bell,
  List,
  SignOut,
  Gear,
  ArrowsClockwise,
  ArrowUUpLeft,
  ArrowLeft,
  PaintBrush,
  CaretLeft,
  Check,
  Moon,
  Sun,
  UserCircle,
  DotsNine,
} from "@phosphor-icons/react";
import api from "@/services/api";
import AppsDrawer from "./AppsDrawer";
import ProfileModal from "@/components/profile/ProfileModal";

// Palet Warna Tema
const THEME = {
  light: {
    bg: "white",
    text: "#595d67ff",
    border: "border",
    shadow: "0 2px 2px rgba(0,0,0,0.04)",
    hoverBg: "muted",
    dropdownBg: "white",
    dropdownText: "#1A202C",
    activeColor: "primary",
    avatarBg: "gray.100",
  },
  dark: {
    bg: "#1A1A1A",
    text: "#eaeaeaff",
    border: "#333333",
    shadow: "0 4px 14px rgba(229, 184, 92, 0.15)",
    hoverBg: "none",
    dropdownBg: "#242424",
    dropdownText: "#F3F4F6",
    activeColor: "#E5B85C",
    avatarBg: "#333333",
  },
};

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();

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

  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSwitchSubmenu, setShowSwitchSubmenu] = useState(false);
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [switching, setSwitching] = useState(null);
  const [user, setUser] = useState(null);
  const [avatarKey, setAvatarKey] = useState(0);
  const [showApps, setShowApps] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const menuRef = useRef(null);
  const submenuRef = useRef(null);
  const lastFocusRef = useRef(0);

  const currentTheme = THEME[themeMode];

  const isImpersonating = localStorage.getItem("impersonating") === "true";
  const impersonatedName = localStorage.getItem("impersonated_name") || "";
  const impersonatedId = localStorage.getItem("impersonated_id") || "";
  const userRole = localStorage.getItem("user_role");
  const isManager = userRole === "MANAGER" && !isImpersonating;

  // Normalisasi URL avatar supaya perbandingan konsisten
  const normalizeAvatarUrl = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url, window.location.origin);
      return `${u.origin}${u.pathname}`;
    } catch {
      return url.split("?")[0].replace(/\/$/, "");
    }
  };

  const fetchUser = () => {
    api.get("/auth/profile/").then((r) => {
      setUser((prev) => {
        const prevUrl = normalizeAvatarUrl(prev?.avatar_url);
        const newUrl = normalizeAvatarUrl(r.data.avatar_url);
        // Bump avatarKey HANYA kalau URL benar-benar beda
        if (prevUrl !== newUrl) {
          setAvatarKey((k) => k + 1);
        }
        return r.data;
      });
    });
  };

  const fetchNotifications = () => {
    api
      .get("/notifications/")
      .then((r) => setNotifications(r.data.results || r.data));
  };

  const fetchTeam = () => {
    setLoadingTeam(true);
    api
      .get("/auth/team/")
      .then((r) => {
        setTeamMembers(r.data);
        setLoadingTeam(false);
      })
      .catch(() => setLoadingTeam(false));
  };

  useEffect(() => {
    fetchUser();
    fetchNotifications();
  }, []);

  // Fix: debounce focus + cleanup visibilitychange
  useEffect(() => {
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusRef.current < 800) return; // skip double fire
      lastFocusRef.current = now;
      fetchUser();
      fetchNotifications();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") handleFocus();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    await api.post(`/notifications/${id}/mark_read/`);
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSwitchBack = () => {
    const managerToken = localStorage.getItem("manager_token");
    const managerRefresh = localStorage.getItem("manager_refresh");
    const managerUser = JSON.parse(
      localStorage.getItem("manager_user") || "{}"
    );
    localStorage.setItem("access_token", managerToken);
    localStorage.setItem("refresh_token", managerRefresh);
    localStorage.setItem("user_role", managerUser.role);
    localStorage.setItem("user_name", managerUser.name);
    localStorage.removeItem("manager_token");
    localStorage.removeItem("manager_refresh");
    localStorage.removeItem("manager_user");
    localStorage.removeItem("impersonating");
    localStorage.removeItem("impersonated_name");
    localStorage.removeItem("impersonated_id");
    window.location.href = "/dashboard";
  };

  const handleSwitch = async (member) => {
    if (isImpersonating && String(member.id) === String(impersonatedId))
      return;
    setSwitching(member.id);
    try {
      const res = await api.post("/auth/switch-account/", {
        user_id: member.id,
      });
      const managerToken = localStorage.getItem("access_token");
      const managerRefresh = localStorage.getItem("refresh_token");
      const managerUser = {
        role: localStorage.getItem("user_role"),
        name: localStorage.getItem("user_name"),
      };
      localStorage.setItem("manager_token", managerToken);
      localStorage.setItem("manager_refresh", managerRefresh);
      localStorage.setItem("manager_user", JSON.stringify(managerUser));
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("user_role", res.data.user.role);
      localStorage.setItem(
        "user_name",
        `${res.data.user.first_name} ${res.data.user.last_name}`
      );
      localStorage.setItem("impersonating", "true");
      localStorage.setItem(
        "impersonated_name",
        `${res.data.user.first_name} ${res.data.user.last_name}`
      );
      localStorage.setItem("impersonated_id", String(res.data.user.id));
      window.location.href = "/dashboard";
    } catch {
      setSwitching(null);
    }
  };

  const openSwitchSubmenu = () => {
    setShowMenu(false);
    setShowSwitchSubmenu(true);
    fetchTeam();
  };

  const closeSwitchSubmenu = () => {
    setShowSwitchSubmenu(false);
    setShowMenu(true);
  };

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem("app_theme", mode);
    window.dispatchEvent(new Event("themeChanged"));
    setShowThemeSubmenu(false);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotif(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
        setShowThemeSubmenu(false);
      }
      if (submenuRef.current && !submenuRef.current.contains(e.target))
        setShowSwitchSubmenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const avatarUrl = user?.avatar_url || null;

  return (
    <>
      <style>{`
        .switch {
          --switch_width: 2em;
          --switch_height: 1em;
          --thumb_color: #e8e8e8;
          --track_color: #e8e8e8;
          --track_active_color: #b8660dff;
          --outline_color: #464646ff;
          font-size: 13.5px; 
          position: relative;
          display: inline-block;
          width: var(--switch_width);
          height: var(--switch_height);
          margin: 0 8px; 
        }

        /* Sembunyikan checkbox bawaan */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          box-sizing: border-box;
          border: 2px solid var(--outline_color);
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--track_color);
          transition: .15s;
          border-radius: var(--switch_height);
        }

        .slider:before {
          box-sizing: border-box;
          position: absolute;
          content: "";
          height: var(--switch_height);
          width: var(--switch_height);
          border: 2px solid var(--outline_color);
          border-radius: 100%;
          left: -2px;
          bottom: -2px;
          background-color: var(--thumb_color);
          transform: translateY(-0.2em);
          box-shadow: 0 0.2em 0 var(--outline_color);
          transition: .15s;
        }

        input:checked + .slider {
          background-color: var(--track_active_color);
        }

        input:focus-visible + .slider {
          box-shadow: 0 0 0 2px var(--track_active_color);
        }

        input:hover + .slider:before {
          transform: translateY(-0.3em);
          box-shadow: 0 0.3em 0 var(--outline_color);
        }

        input:checked + .slider:before {
          transform: translateX(calc(var(--switch_width) - var(--switch_height))) translateY(-0.2em);
        }

        input:hover:checked + .slider:before {
          transform: translateX(calc(var(--switch_width) - var(--switch_height))) translateY(-0.3em);
          box-shadow: 0 0.3em 0 var(--outline_color);
        }

        /* Penyesuaian Warna Switch untuk Dark Mode */
        .dark-mode-switch {
          --outline_color: #fdfdfdff; 
          --track_color: #e08d33;
          --thumb_color: #f19532ff;
        }
      `}</style>

      {isImpersonating && (
        <Box bg="blue.500" color="white" px={4} py={2}>
          <HStack justify="center" gap={3}>
            <Text fontSize="sm" fontWeight="medium">
              Viewing as: {impersonatedName}
            </Text>
            <Button
              size="xs"
              bg="white"
              color="blue.500"
              _hover={{ bg: "blue.50" }}
              leftIcon={<ArrowUUpLeft size={14} />}
              onClick={handleSwitchBack}
            >
              Switch Back to Manager
            </Button>
          </HStack>
        </Box>
      )}

      <HStack
        h="64px"
        px={{ base: 4, md: 6 }}
        bg={currentTheme.bg}
        borderBottom="1px solid"
        borderColor={currentTheme.border}
        boxShadow={currentTheme.shadow}
        transition="all 0.3s ease"
        position="relative"
        zIndex={10}
        justify="flex-end"
        gap={2}
      >
        <Box
          display={{ base: "block", md: "none" }}
          cursor="pointer"
          onClick={onMenuClick}
          p={2}
          borderRadius="md"
          color={currentTheme.text}
          _hover={{ bg: currentTheme.hoverBg }}
        >
          <List size={22} color="currentColor" />
        </Box>

        {/* ========================================== */}
        {/* SWITCH TOGGLE (DI SEBELAH KIRI SUPPORT)    */}
        {/* ========================================== */}
        <label className={`switch ${themeMode === "dark" ? "dark-mode-switch" : ""}`} title="Ganti Tema">
          <input 
            type="checkbox" 
            checked={themeMode === "dark"} 
            onChange={(e) => handleThemeChange(e.target.checked ? "dark" : "light")} 
          />
          <span className="slider"></span>
        </label>

        {/* Support */}
        <Box
          as="a"
          href="mailto:support@yourcompany.com"
          cursor="pointer"
          p={2}
          borderRadius="md"
          color={currentTheme.text}
          _hover={{
            bg: currentTheme.hoverBg,
            color: themeMode === "dark" ? "#E5B85C" : currentTheme.text,
          }}
          transition="all 0.2s ease"
          display="flex"
          alignItems="center"
          title="Support"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.01984 21C2.84326 21 1.00155 19.1495 1.00155 16.9626V11.2056C0.955037 8.47663 1.95961 5.90654 3.83854 3.98131C5.71746 2.06542 8.2382 1 10.9543 1C16.498 1 21 5.53271 21 11.0935V16.8505C21 19.0748 19.1955 20.8878 16.9817 20.8878C14.8051 20.8878 12.9634 19.0374 12.9634 16.8505V14.2243C12.9634 12.8692 14.0238 11.8037 15.3725 11.8037C16.7213 11.8037 17.7816 12.8692 17.7816 14.2243V17.0561C17.7816 17.4393 17.4654 17.757 17.084 17.757C16.7027 17.757 16.3864 17.4393 16.3864 17.0561V14.2243C16.3864 13.5888 15.8748 13.2056 15.3725 13.2056C14.74 13.2056 14.3587 13.7196 14.3587 14.2243V16.8505C14.3587 18.2804 15.5586 19.486 16.9817 19.486C18.4049 19.486 19.6048 18.2804 19.6048 16.8505V11.0935C19.6048 6.29907 15.726 2.40187 10.9543 2.40187C8.61956 2.40187 6.45229 3.30841 4.83381 4.96262C3.21533 6.61682 2.35028 8.83177 2.39679 11.1869V16.9626C2.39679 18.3925 3.59669 19.5981 5.01984 19.5981C6.44299 19.5981 7.64289 18.3925 7.64289 16.9626V14.3364C7.64289 13.7009 7.1313 13.3178 6.62902 13.3178C5.99651 13.3178 5.61514 13.8318 5.61514 14.3364V17.0654C5.61514 17.4486 5.29889 17.7664 4.91752 17.7664C4.53616 17.7664 4.2199 17.4486 4.2199 17.0654V14.3364C4.2199 12.9813 5.28028 11.9159 6.62902 11.9159C7.97775 11.9159 9.03813 12.9813 9.03813 14.3364V16.9626C9.03813 19.1495 7.19642 21 5.01984 21Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.3"
            />
            <path
              d="M20.22 18C20.6464 18 21 18.3053 21 18.6818C21 20.5 20.272 21.4818 19.44 22.0818C18.608 22.6818 17.4744 23 16.06 23H8.78C8.3536 23 8 22.6909 8 22.3182C8 21.9455 8.3536 21.6364 8.78 21.6364H16.06C18.3376 21.6364 19.44 20.6727 19.44 18.6818C19.44 18.3091 19.7936 18 20.22 18Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.1"
            />
          </svg>
        </Box>

        {/* Help */}
        <Box
          cursor="pointer"
          p={2}
          borderRadius="md"
          color={currentTheme.text}
          _hover={{
            bg: currentTheme.hoverBg,
            color: themeMode === "dark" ? "#E5B85C" : currentTheme.text,
          }}
          transition="all 0.2s ease"
          display="flex"
          alignItems="center"
          title="Help"
          onClick={() => navigate("/pusat-bantuan")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9946 16H12.0036M10 10.5V10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10V10.1213C14 10.6839 13.7765 11.2235 13.3787 11.6213L12 13M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        {/* Riwayat / Time */}
        <Box
          cursor="pointer"
          p={2}
          borderRadius="md"
          color={currentTheme.text}
          _hover={{
            bg: currentTheme.hoverBg,
            color: themeMode === "dark" ? "#E5B85C" : currentTheme.text,
          }}
          transition="all 0.2s ease"
          display="flex"
          alignItems="center"
          title="History"
          onClick={() => navigate("/history")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        {/* Notifications */}
        <Box ref={notifRef} position="relative">
          <HStack
            cursor="pointer"
            p={2}
            borderRadius="md"
            color={currentTheme.text}
            _hover={{
              bg: currentTheme.hoverBg,
              color: themeMode === "dark" ? "#E5B85C" : currentTheme.text,
            }}
            transition="all 0.2s ease"
            onClick={() => setShowNotif(!showNotif)}
            position="relative"
          >
            <Bell size={20} color="currentColor" />
            {unreadCount > 0 && (
              <Badge
                position="absolute"
                top={0}
                right={0}
                colorPalette="red"
                size="xs"
                borderRadius="full"
              >
                {unreadCount}
              </Badge>
            )}
          </HStack>
          {showNotif && (
            <Box
              position="absolute"
              top="100%"
              right={0}
              mt={2}
              w="360px"
              bg={currentTheme.dropdownBg}
              border="1px solid"
              borderColor={currentTheme.border}
              borderRadius="lg"
              shadow="lg"
              zIndex={50}
              maxH="400px"
              overflow="auto"
              color={currentTheme.dropdownText}
            >
              <HStack
                justify="space-between"
                p={3}
                borderBottom="1px solid"
                borderColor={currentTheme.border}
              >
                <Text fontWeight="semibold" fontSize="sm">
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <Button
                    size="xs"
                    variant="ghost"
                    color={currentTheme.text}
                    _hover={{ bg: currentTheme.hoverBg }}
                    onClick={async () => {
                      await api.post("/notifications/mark_all_read/");
                      setNotifications(
                        notifications.map((n) => ({ ...n, is_read: true }))
                      );
                    }}
                  >
                    Mark all read
                  </Button>
                )}
              </HStack>
              {notifications.length === 0 ? (
                <Box p={4}>
                  <Text fontSize="sm" opacity={0.5}>
                    No notifications
                  </Text>
                </Box>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <Box
                    key={n.id}
                    p={3}
                    borderBottom="1px solid"
                    borderColor={currentTheme.border}
                    cursor="pointer"
                    bg={
                      n.is_read
                        ? "transparent"
                        : themeMode === "dark"
                        ? "#333"
                        : "muted"
                    }
                    _hover={{ bg: currentTheme.hoverBg }}
                    onClick={() => {
                      markRead(n.id);
                      if (n.link) navigate(n.link);
                      setShowNotif(false);
                    }}
                  >
                    <Text
                      fontWeight={n.is_read ? "normal" : "semibold"}
                      fontSize="sm"
                    >
                      {n.title}
                    </Text>
                    <Text fontSize="xs" opacity={0.6}>
                      {n.message}
                    </Text>
                    <Text fontSize="xs" opacity={0.4} mt={1}>
                      {new Date(n.created_at).toLocaleString("id-ID")}
                    </Text>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>

        {/* Apps Launcher */}
        <Box
          cursor="pointer"
          p={2}
          borderRadius="md"
          color={currentTheme.text}
          _hover={{
            bg: currentTheme.hoverBg,
            color: themeMode === "dark" ? "#E5B85C" : currentTheme.text,
          }}
          transition="all 0.2s ease"
          display="flex"
          alignItems="center"
          title="Apps"
          onClick={() => setShowApps(true)}
        >
          <DotsNine size={22} color="currentColor" weight="bold" />
        </Box>
        <AppsDrawer
          open={showApps}
          onClose={() => setShowApps(false)}
          userName={user ? `${user.first_name} ${user.last_name}` : ""}
        />

        {/* User Menu Wrapper */}
        <Box ref={menuRef} position="relative">
          <Avatar.Root
            size="sm"
            cursor="pointer"
            bg={currentTheme.avatarBg}
            onClick={() => {
              setShowMenu(!showMenu);
              setShowSwitchSubmenu(false);
              setShowThemeSubmenu(false);
            }}
          >
            {avatarUrl ? (
              <Avatar.Image
                key={avatarKey}
                src={`${avatarUrl}?t=${avatarKey}`}
              />
            ) : (
              <Avatar.Fallback
                name={
                  user ? `${user.first_name} ${user.last_name}` : "User"
                }
                bg={currentTheme.avatarBg}
                color={themeMode === "dark" ? "#E5B85C" : "white"}
              />
            )}
          </Avatar.Root>

          {/* DROPDOWN MENU */}
          {showMenu && (
            <Box
              position="absolute"
              top="100%"
              right={0}
              mt={2}
              w="220px"
              bg={currentTheme.dropdownBg}
              border="1px solid"
              borderColor={currentTheme.border}
              borderRadius="lg"
              shadow="lg"
              zIndex={50}
              overflow="hidden"
              color={currentTheme.dropdownText}
            >
              {!showThemeSubmenu ? (
                <>
                  <Box
                    p={3}
                    borderBottom="1px solid"
                    borderColor={currentTheme.border}
                  >
                    <Text fontWeight="semibold" fontSize="sm">
                      {user?.first_name} {user?.last_name}
                    </Text>
                    <Text fontSize="xs" opacity={0.5}>
                      {user?.role}
                    </Text>
                    {user?.company_name && (
                      <Text fontSize="xs" opacity={0.4}>
                        {user.company_name}
                      </Text>
                    )}
                  </Box>
                  <VStack align="stretch" gap={0}>
                    {user && (
                      <HStack
                        p={3}
                        cursor="pointer"
                        _hover={{
                          bg: themeMode === "dark" ? "#333333" : "muted",
                          color: themeMode === "dark" ? "#E5B85C" : "inherit"
                        }}
                        onClick={() => {
                          setShowProfile(true);
                          setShowMenu(false);
                        }}
                      >
                        <UserCircle 
                          size={16} 
                          color={themeMode === "dark" ? "currentColor" : currentTheme.text} 
                        />
                        <Text fontSize="sm">Profil saya</Text>
                      </HStack>
                    )}
                    <HStack
                      p={3}
                      cursor="pointer"
                      _hover={{
                        bg: themeMode === "dark" ? "#333333" : "muted",
                        color: themeMode === "dark" ? "#E5B85C" : "inherit"
                      }}
                      onClick={() => {
                        navigate("/settings");
                        setShowMenu(false);
                      }}
                    >
                      <Gear 
                        size={16} 
                        color={themeMode === "dark" ? "currentColor" : currentTheme.text} 
                      />
                      <Text fontSize="sm">Settings</Text>
                    </HStack>

                    {(isManager || isImpersonating) && (
                      <HStack
                        p={3}
                        cursor="pointer"
                        _hover={{
                          bg: themeMode === "dark" ? "#333333" : "muted",
                          color: themeMode === "dark" ? "#E5B85C" : "inherit"
                        }}
                        onClick={
                          isImpersonating ? handleSwitchBack : openSwitchSubmenu
                        }
                      >
                        {isImpersonating ? (
                          <ArrowUUpLeft 
                            size={16} 
                            color={themeMode === "dark" ? "currentColor" : currentTheme.text} 
                          />
                        ) : (
                          <ArrowsClockwise
                            size={16}
                            color={themeMode === "dark" ? "currentColor" : currentTheme.text}
                          />
                        )}
                        <Text fontSize="sm">
                          {isImpersonating ? "Switch Back" : "Switch Account"}
                        </Text>
                      </HStack>
                    )}

                    <HStack
                      p={3}
                      cursor="pointer"
                      _hover={{
                        bg: themeMode === "dark" ? "#333333" : "muted",
                        color: themeMode === "dark" ? "#E5B85C" : "inherit"
                      }}
                      onClick={() => setShowThemeSubmenu(true)}
                    >
                      <PaintBrush 
                        size={16} 
                        color={themeMode === "dark" ? "currentColor" : currentTheme.text} 
                      />
                      <Text fontSize="sm">Change Themes</Text>
                    </HStack>

                    <HStack
                      p={3}
                      cursor="pointer"
                      _hover={{ 
                        bg: themeMode === "dark" ? "rgba(255, 8, 8, 0.15)" : "red.50" 
                      }}
                      color="destructive"
                      onClick={handleLogout}
                    >
                      <SignOut size={16} color="#ff0808ff" />
                      <Text
                        fontSize="sm"
                        color={
                          themeMode === "dark" ? "#ffffff" : "#ff0808ff"
                        }
                      >
                        Logout
                      </Text>
                    </HStack>
                  </VStack>
                </>
              ) : (
                <>
                  <HStack
                    p={3}
                    borderBottom="1px solid"
                    borderColor={currentTheme.border}
                    justify="space-between"
                  >
                    <HStack
                      gap={2}
                      cursor="pointer"
                      _hover={{ opacity: 0.7 }}
                      onClick={() => setShowThemeSubmenu(false)}
                    >
                      <CaretLeft size={16} color={currentTheme.text} />
                      <Text fontSize="sm" fontWeight="semibold">
                        Kembali
                      </Text>
                    </HStack>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={currentTheme.activeColor}
                    >
                      Pilih Tema
                    </Text>
                  </HStack>

                  <VStack align="stretch" gap={0} p={2}>
                    {/* Pilihan Light */}
                    <HStack
                      p={2.5}
                      cursor="pointer"
                      borderRadius="md"
                      _hover={{ bg: currentTheme.hoverBg }}
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun
                        size={18}
                        color={
                          themeMode === "light"
                            ? "#2563EB"
                            : currentTheme.text
                        }
                      />
                      <Text
                        fontSize="sm"
                        flex={1}
                        fontWeight={
                          themeMode === "light" ? "semibold" : "normal"
                        }
                      >
                        Light Mode
                      </Text>
                      {themeMode === "light" && (
                        <Check size={16} color="#2563EB" weight="bold" />
                      )}
                    </HStack>

                    {/* Pilihan Dark */}
                    <HStack
                      p={2.5}
                      cursor="pointer"
                      borderRadius="md"
                      _hover={{ bg: currentTheme.hoverBg }}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon
                        size={18}
                        color={
                          themeMode === "dark"
                            ? "#E5B85C"
                            : currentTheme.text
                        }
                      />
                      <Text
                        fontSize="sm"
                        flex={1}
                        fontWeight={
                          themeMode === "dark" ? "semibold" : "normal"
                        }
                      >
                        Dark Mode
                      </Text>
                      {themeMode === "dark" && (
                        <Check size={16} color="#E5B85C" weight="bold" />
                      )}
                    </HStack>
                  </VStack>
                </>
              )}
            </Box>
          )}

          {/* Switch Account Submenu */}
          {showSwitchSubmenu && (
            <Box
              ref={submenuRef}
              position="absolute"
              top="100%"
              right={0}
              mt={2}
              w="300px"
              bg={currentTheme.dropdownBg}
              border="1px solid"
              borderColor={currentTheme.border}
              borderRadius="lg"
              shadow="lg"
              zIndex={50}
              color={currentTheme.dropdownText}
            >
              <HStack
                p={3}
                borderBottom="1px solid"
                borderColor={currentTheme.border}
                justify="space-between"
              >
                <HStack
                  gap={2}
                  cursor="pointer"
                  _hover={{ opacity: 0.7 }}
                  onClick={closeSwitchSubmenu}
                >
                  <ArrowLeft size={16} color={currentTheme.text} />
                  <Text fontSize="sm" fontWeight="semibold">
                    Back
                  </Text>
                </HStack>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={currentTheme.activeColor}
                >
                  Switch Account
                </Text>
              </HStack>

              {loadingTeam ? (
                <Box display="flex" justifyContent="center" py={6}>
                  <Spinner
                    size="md"
                    color={themeMode === "dark" ? "#E5B85C" : "primary"}
                  />
                </Box>
              ) : (
                <VStack align="stretch" gap={0} maxH="320px" overflow="auto">
                  {teamMembers.map((member) => {
                    const isActive =
                      isImpersonating &&
                      String(member.id) === String(impersonatedId);
                    const isCurrentManager =
                      !isImpersonating &&
                      String(member.id) === String(user?.id);
                    const disabled = isActive || isCurrentManager;
                    return (
                      <HStack
                        key={member.id}
                        p={3}
                        cursor={disabled ? "not-allowed" : "pointer"}
                        bg={disabled ? currentTheme.hoverBg : "transparent"}
                        opacity={disabled ? 0.5 : 1}
                        _hover={disabled ? {} : { bg: currentTheme.hoverBg }}
                        borderBottom="1px solid"
                        borderColor={currentTheme.border}
                        transition="all 150ms ease"
                        onClick={() => !disabled && handleSwitch(member)}
                      >
                        <Avatar.Root size="sm" bg={currentTheme.avatarBg}>
                          {member.avatar_url ? (
                            <Avatar.Image src={member.avatar_url} />
                          ) : (
                            <Avatar.Fallback
                              name={`${member.first_name} ${member.last_name}`}
                              bg={currentTheme.avatarBg}
                              color={
                                themeMode === "dark" ? "#E5B85C" : "white"
                              }
                            />
                          )}
                        </Avatar.Root>
                        <VStack align="start" gap={0} flex={1}>
                          <Text fontWeight="semibold" fontSize="sm">
                            {member.first_name} {member.last_name}
                          </Text>
                          <Text fontSize="xs" opacity={0.5}>
                            {member.email}
                          </Text>
                        </VStack>
                        {isActive ? (
                          <Badge colorPalette="green" size="sm">
                            Active
                          </Badge>
                        ) : isCurrentManager ? (
                          <Badge colorPalette="blue" size="sm">
                            You
                          </Badge>
                        ) : (
                          <Badge
                            colorPalette={
                              member.role === "MANAGER" ? "blue" : "green"
                            }
                            size="sm"
                          >
                            {member.role}
                          </Badge>
                        )}
                        {switching === member.id && (
                          <Spinner
                            size="sm"
                            color={
                              themeMode === "dark" ? "#E5B85C" : "primary"
                            }
                          />
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              )}
            </Box>
          )}
        </Box>
      </HStack>
      {showProfile && user && (
        <ProfileModal
          user={user}
          isDark={themeMode === "dark"}
          onClose={() => setShowProfile(false)}
          onUpdated={() => fetchUser()}
        />
      )}
    </>
  );
}