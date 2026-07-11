import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AuthProvider from "./context/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <AuthProvider>
    <BrowserRouter>

        <App/>

    </BrowserRouter>
  </AuthProvider>
  </StrictMode>
);