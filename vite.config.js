import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Vite defaults to lightningcss for minification, which incorrectly
    // collapses `backdrop-filter` + `-webkit-backdrop-filter` pairs down to
    // only the -webkit- prefixed property, breaking blur in non-Safari
    // browsers. esbuild's minifier keeps both declarations intact.
    cssMinify: "esbuild",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
