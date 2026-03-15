import {
  AuthPage,
  Error404Page,
  ModelsPage,
  // ARViewerPage,
} from "@/pages";
import { Route, Routes, useLocation } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import ARLayout from "./layouts/ARLayout";
import { ModelsPageAsync } from "@/pages/modelsPage/ModelsPage.async";
import { AdminPageAsync } from "@/pages/adminPage/AdminPage.async";
import { ARViewerPageHTMLAsync } from "@/pages/ARViewerPageHTML/ARViewerPageHTML.async";
import { ModelViewerPageAsync } from "@/pages/ModelViewerPage/ModelViewerPage.async";

function App() {
  const location = useLocation();
  const isARPage = location.pathname.startsWith("/models/");

  const Layout = isARPage ? ARLayout : BaseLayout;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ModelsPageAsync />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPageAsync />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="*" element={<Error404Page />} />
        <Route path="/models/:modelName" element={<ARViewerPageHTMLAsync />} />
        <Route
          path="/models/preview/:modelName"
          element={<ModelViewerPageAsync />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
