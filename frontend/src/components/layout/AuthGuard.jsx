import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthStorage } from "@/services/authStorage";

export default function AuthGuard() {
  const authStorage = getAuthStorage();
  const token = authStorage.getItem("access_token");
  const userRole = authStorage.getItem("user_role");
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  if (userRole === "AGENT" && location.pathname === "/agents") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
