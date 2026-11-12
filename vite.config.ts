import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";
import UnoCSS from "unocss/vite";

export default defineConfig({
  // Turnkey client mode: no index.html and no mount file — the plugin generates
  // the entries around src/App.tsx (wrapped in src/Document.tsx) and `vite build`
  // prerenders the shell into a purely static dist/client.
  plugins: [
    // UnoCSS must see the JSX before Solid compiles it into template strings;
    // the attributify extractor needs the original (quoted) attributes.
    UnoCSS(),
    solid({ start: true, diagnostics: true }), // add `ssr: true` for streaming SSR
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
  },
});
