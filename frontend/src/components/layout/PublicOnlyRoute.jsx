import { Navigate, Outlet } from "react-router-dom";

function PublicOnlyRoute() {
  const token = localStorage.getItem("access_token");

  return token ? <Navigate to="/beranda" replace /> : <Outlet />;
}

export default PublicOnlyRoute;
