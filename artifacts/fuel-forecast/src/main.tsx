import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

if (import.meta.env.DEV) {
  // Local dev: relative /api (proxied via Vite dev server if needed)
  setBaseUrl("/api");
} else {
  // Production: use VITE_API_URL env var from Netlify
  setBaseUrl(import.meta.env.VITE_API_URL || "/api");
}

createRoot(document.getElementById("root")!).render(<App />);

