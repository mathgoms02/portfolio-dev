import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this project from /portfolio-dev/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/portfolio-dev-v2/" : "/",
  plugins: [react()],
  build: {
    target: "es2022",
    cssTarget: "chrome110",
    assetsInlineLimit: 2048,
  },
}));
