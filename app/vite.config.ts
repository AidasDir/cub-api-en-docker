import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Inline Vite dev middleware for cub.rip proxy
export default defineConfig({
  plugins: [react()],
  base: '/developer/',
  server: {
    // The proxy is handled by the plugin, no need for middlewareMode here
    // middlewareMode: false,
  },
});

