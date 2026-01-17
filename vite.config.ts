import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Проксируем /api на бэкенд
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify("1.0")
  }
});
