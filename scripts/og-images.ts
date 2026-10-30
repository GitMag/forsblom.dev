// Photographs each project's share card (the build-only page /og/<slug>/, src/pages/og/[slug].astro) into
// dist/og/<slug>.png at 1200×630, then deletes the card pages, so only the pictures are published. Runs at the end
// of `npm run build`, in headless Chromium; nothing opens on screen.
//
//   node scripts/og-images.ts
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { DIST, serveDist } from "./serve-dist.ts";

const OG = join(DIST, "og");
const entries = await readdir(OG, { withFileTypes: true });
const slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

const server = await serveDist();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: "light" });
  for (const slug of slugs) {
    await page.goto(`${server.base}/og/${slug}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".card").screenshot({ path: join(OG, `${slug}.png`) });
    await rm(join(OG, slug), { recursive: true });
  }
  console.log(`og-images: wrote ${slugs.length} share cards to dist/og/`);
} finally {
  await browser.close();
  server.close();
}
