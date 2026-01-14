import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './', // ✅ Required for correct asset paths in production
  server: {
    host: "::",
    port: 5173, // Dev server port
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
      "/customer": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
      "/order": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
      "/api/admin": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
      "/api/cart": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
      "/api/wishlist": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      },
      "/api/contact": {
        target: "http://localhost:5050",
        changeOrigin: true,
        secure: false,
      }
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
