import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const isAuth = useSelector((state: RootState) => state.authReducer.isAuth);
  const role = useSelector((state: RootState) => state.authReducer.role);
  return { isAuth, role };
};