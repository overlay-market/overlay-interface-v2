import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.{png,jpg,jpeg,gif,webp}"],
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    reportCompressedSize: false,
    assetsInlineLimit: 4096, // 4kb - files smaller than this will be inlined
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "radix-vendor": ["@radix-ui/themes"],
          utils: [
            "./src/utils/formatDecimal.ts",
            "./src/utils/formatPriceByCurrency.ts",
            "./src/utils/formatPriceWithCurrency.ts",
          ],
          components: [
            "./src/components/Button",
            "./src/components/Modal",
            "./src/components/NavBar",
            "./src/components/Table",
          ],
        },
        assetFileNames: (assetInfo: { name?: string }) => {
          const name = assetInfo.name || "";
          if (name.endsWith(".css")) {
            return "assets/css/[name]-[hash][extname]";
          }
          // Handle images - they will be optimized by Vite's built-in optimizer
          if (/\.(png|jpe?g|gif|webp)$/i.test(name)) {
            return "assets/images/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@radix-ui/themes",
    ],
    exclude: ["@radix-ui/themes/styles.css"],
  },
  server: {
    open: true,
    allowedHosts: [
      "99137595334e.ngrok-free.app",
    ],
    hmr: {
      overlay: true,
    },
  },
  preview: {
    open: true,
  },
});
