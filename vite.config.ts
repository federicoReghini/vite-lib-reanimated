import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ include: ["lib"] })],
  assetsInclude: ["**/*.json"],
  build: {
    copyPublicDir: false,
    rollupOptions: {
      external: [
        "react",
        "react-native",
        "react-native-web",
        "react-native-reanimated",
        "react-native-svg",
        "react/jsx-runtime",
        "react-native-gesture-handler",
        "react-native-safe-area-context",
      ],
      input: Object.fromEntries(
        glob.sync("lib/**/*.{ts,tsx}").map((file) => [
          // The name of the entry point
          relative("lib", file.slice(0, file.length - extname(file).length)),
          // The absolute path to the entry file
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
  },
});
