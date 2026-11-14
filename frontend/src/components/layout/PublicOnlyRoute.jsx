import { Navigate, Outlet } from "react-router-dom";

export default function PublicOnlyRoute() {
  if (localStorage.getItem("access_token")) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}