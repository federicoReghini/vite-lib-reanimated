import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
/*import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";*/

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ include: ["lib"] })],
  assetsInclude: ["**/*.json"],
  build: {
    copyPublicDir: false,
    rollupOptions: {
      external: [
        "react-native",
        "react-native-web",
        "react-native-reanimated",
        "react-native-svg",
        "react/jsx-runtime",
        "react-native-gesture-handler",
      ],
    },
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      fileName: "main",
      formats: ["es"],
    },
  },
});
