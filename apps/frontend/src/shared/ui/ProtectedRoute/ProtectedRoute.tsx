import type { RootState } from "@/app/store";
import { StorageService } from "@/shared/utils/StorageService";
import type { FC, JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const tokenFromRedux = useSelector<RootState>(
    (state) => state.authReducer.token,
  );
  const role = useSelector<RootState>((state) => state.authReducer.role);

  const location = useLocation();

  const hasToken = !!tokenFromRedux || !!StorageService.getItem("authToken");

  const isAllowed =
    hasToken && (role === "ROLE_ADMIN" || role === "ROLE_MODERATOR");

  if (!isAllowed) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
