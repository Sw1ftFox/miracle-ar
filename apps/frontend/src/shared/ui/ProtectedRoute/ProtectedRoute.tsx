import { selectAuth } from "@/features/auth/authSlice";
import { StorageService } from "@/shared/utils/StorageService";
import type { FC, JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useSelector(selectAuth);
  const location = useLocation();

  const checkAuth = () => {
    const localIsAuth = StorageService.getItem("isAuth");

    return localIsAuth && isAuth;
  };

  if (!checkAuth()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
