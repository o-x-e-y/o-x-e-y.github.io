import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [wasm(), solidPlugin(), tailwindcss()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
