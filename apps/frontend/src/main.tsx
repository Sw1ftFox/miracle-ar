import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@app/App";
import { Provider } from "react-redux";
import { store } from "@app/store";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
