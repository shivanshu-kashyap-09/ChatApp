import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./Context/ChatContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

// Replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "786027011222-gogma868tlefrpvll6sfsqogjojnrqpn.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
