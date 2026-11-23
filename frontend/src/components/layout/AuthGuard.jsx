import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthGuard() {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");
  const location = useLocation();

  // Cegah halaman dashboard muncul dari cache browser setelah logout
  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted && !localStorage.getItem("access_token")) {
        window.location.replace("/login");
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  if (!token) return <Navigate to="/login" replace />;

  if (userRole === "AGENT" && location.pathname === "/agents") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}