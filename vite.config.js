import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const proxy = {
  "/api": {
    target: "https://yanethm-cromoverso-api.fly.dev",
    changeOrigin: true,
    cookieDomainRewrite: "", // la cookie queda en nuestro dominio
  },
};


export default defineConfig({
  plugins: [react(), svgr()],
  server: { proxy },
  preview: { proxy },
});