import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { canAccessRoute } from "../lib/rbac";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, status } = useSelector((state) => state.auth);

  if (status === "loading") {
    return <div className="page loading-page">Завантаження...</div>;
  }

  if (!canAccessRoute(user?.role, location.pathname)) {
    return <Navigate to={user ? "/dashboard" : "/login"} replace state={{ from: location.pathname }} />;
  }

  return children;
}
