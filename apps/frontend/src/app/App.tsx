import {
  AdminPage,
  AuthPage,
  Error404Page,
  ModelsPage,
  ARViewerPage,
  ARViewerPagePC,
} from "@/pages";
import { Route, Routes, useLocation } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import ARLayout from "./layouts/ARLayout";

function App() {
  const location = useLocation();
  const isARPage = location.pathname.startsWith("/models/");

  const Layout = isARPage ? ARLayout : BaseLayout;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ModelsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="*" element={<Error404Page />} />
        <Route path="/models/:modelId" element={<ARViewerPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
