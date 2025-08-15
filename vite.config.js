import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/njflash88/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true, // Helpful for debugging
  },
});
