// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://forsblom.dev",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  build: {
    // Stylesheets and scripts go out as files, never inline, so the strict CSP in public/_headers holds.
    inlineStylesheets: "never",
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
