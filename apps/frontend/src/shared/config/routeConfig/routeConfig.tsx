/* eslint-disable react-refresh/only-export-components */
import ErrorBoundary from "@/app/providers/ErrorBoundary/ErrorBoundary";
import { AdminPageAsync } from "@/pages/AdminPage";
import { ARViewerPageHTMLAsync } from "@/pages/ARViewerPageHTML";
import { AuthPage } from "@/pages/AuthPage";
import { ModelsPageAsync } from "@/pages/ModelsPage";
import { ModelViewerPageAsync } from "@/pages/ModelViewerPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import ProtectedRoute from "@/shared/ui/ProtectedRoute/ProtectedRoute";
import type { RouteProps } from "react-router-dom";

export const AppRoutes = {
  ROOT: "root",
  AUTH: "auth",
  ADMIN: "admin",
  MODELS: "models",
  MODELS_MODELNAME: "models_modelName",
  MODELS_PREVIEW_MODELNAME: "models_preview_modelName",
  NOT_FOUND: "not_found",
} as const;

export type AppRoutesValues = (typeof AppRoutes)[keyof typeof AppRoutes];

export const RoutePath: Record<AppRoutesValues, string> = {
  [AppRoutes.ROOT]: "/",
  [AppRoutes.AUTH]: "/auth",
  [AppRoutes.ADMIN]: "/admin",
  [AppRoutes.MODELS]: "/models",
  [AppRoutes.MODELS_MODELNAME]: "/models/:modelName",
  [AppRoutes.MODELS_PREVIEW_MODELNAME]: "/models/preview/:modelName",
  [AppRoutes.NOT_FOUND]: "*",
};

export const routeConfig: Record<AppRoutesValues, RouteProps> = {
  [AppRoutes.ROOT]: {
    path: RoutePath.root,
    element: (
      <ErrorBoundary>
        <ModelsPageAsync />
      </ErrorBoundary>
    ),
  },
  [AppRoutes.AUTH]: {
    path: RoutePath.auth,
    element: <AuthPage />,
  },
  [AppRoutes.ADMIN]: {
    path: RoutePath.admin,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <AdminPageAsync />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  [AppRoutes.MODELS]: {
    path: RoutePath.models,
    element: (
      <ErrorBoundary>
        <ModelsPageAsync />
      </ErrorBoundary>
    ),
  },
  [AppRoutes.MODELS_MODELNAME]: {
    path: RoutePath.models_modelName,
    element: (
      <ErrorBoundary>
        <ARViewerPageHTMLAsync />
      </ErrorBoundary>
    ),
  },
  [AppRoutes.MODELS_PREVIEW_MODELNAME]: {
    path: RoutePath.models_preview_modelName,
    element: (
      <ErrorBoundary>
        <ModelViewerPageAsync />
      </ErrorBoundary>
    ),
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.not_found,
    element: <NotFoundPage />,
  },
};
