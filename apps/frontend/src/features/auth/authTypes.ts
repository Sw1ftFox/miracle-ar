export type AuthType = {
  isAuth: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  token?: string | null;
  role?: string | null;
}