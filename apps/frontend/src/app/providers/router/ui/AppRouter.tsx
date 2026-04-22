import { routeConfig } from "@/shared/config/routeConfig/routeConfig";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

export const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {Object.values(routeConfig).map(({ path, element }) => (
          <Route key={path} path={path} element={<>{element}</>} />
        ))}
      </Routes>
    </Suspense>
  );
};
