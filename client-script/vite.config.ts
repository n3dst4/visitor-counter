import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: resolve(__dirname, "src/client-script.ts"),
      name: "visitor-counter-client-script",
      // the proper extensions will be added
      fileName: "visitor-counter-client-script",
    },
    minify: false,
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      enableBuild: true,
      overlay: true,
      terminal: true,
      // eslint: {
      //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // for example, lint .ts & .tsx
      // },
    }),
  ],
});
