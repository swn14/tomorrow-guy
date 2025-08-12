import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    VitePWA({
      outDir: "docs",
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Tomorrow Guy",
        short_name: "TomorrowGuy",
        description: "Feeling overwhelmed? Make it Tomorrow Guy's problem!",
        theme_color: "#667eea",
        background_color: "#ffffff",
        display: "standalone",
        scope: process.env.NODE_ENV === "production" ? "/tomorrow-guy/" : "/",
        start_url:
          process.env.NODE_ENV === "production" ? "/tomorrow-guy/" : "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
