import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../lib/api";

function ProtectedRoute() {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
