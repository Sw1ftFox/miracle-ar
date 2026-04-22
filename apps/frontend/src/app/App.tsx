import { useLocation } from "react-router-dom";
import { AppRouter } from "./providers/router";
import { ConfigProvider } from "antd";
import { ARLayout } from "./layouts/ARLayout";
import { BaseLayout } from "./layouts/BaseLayout";

function App() {
  const location = useLocation();
  const isARPage = location.pathname.startsWith("/models/");

  const Layout = isARPage ? ARLayout : BaseLayout;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#aa00ff",
        },
      }}
    >
      <Layout>
        <AppRouter />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
