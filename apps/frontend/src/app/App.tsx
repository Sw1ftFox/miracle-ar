import {
  AdminPage,
  AuthPage,
  Error404Page,
  ModelsPage,
  ARViewerPage,
  ModelViewerPage,
} from "@/pages";
import { Route, Routes, useLocation } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import ARLayout from "./layouts/ARLayout";
// import ARViewerPageHTML from "@/pages/ARViewerPage/ARViewerPageHTML";

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
        <Route path="/models/:modelName" element={<ARViewerPage />} />
        <Route path="/models/preview/:modelName" element={<ModelViewerPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
