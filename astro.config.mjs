// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";

// The sitemap's last-modified date for each project page: the newest date in its revision history.
const projectDates = Object.fromEntries(
  readdirSync("src/content/projects").map((slug) => {
    const front = readFileSync(`src/content/projects/${slug}/index.md`, "utf8").split(/^---$/m)[1] ?? "";
    /** @type {{ date: string }[]} */
    const history = parse(front)?.history ?? [];
    const dates = history.map((h) => h.date).sort();
    return [slug, dates.at(-1)];
  }),
);

export default defineConfig({
  site: "https://forsblom.dev",
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      // The share-card pages are only build steps (scripts/og-images.ts deletes them); the 404 page isn't a page.
      filter: (page) => !page.includes("/og/") && !page.includes("/404"),
      serialize(item) {
        const slug = item.url.match(/\/projects\/([^/]+)\/$/)?.[1];
        const date = slug ? projectDates[slug] : undefined;
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      },
    }),
  ],
  build: {
    // Stylesheets and scripts go out as files, never inline, so the strict CSP in public/_headers holds.
    inlineStylesheets: "never",
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
