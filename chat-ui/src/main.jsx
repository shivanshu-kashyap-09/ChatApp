import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
// import AppRoutes from "./config/routes.jsx";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-center" />
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
);