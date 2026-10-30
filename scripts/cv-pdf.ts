// Prints the About page to dist/magnus-forsblom-cv.pdf, so the PDF always matches the page.
// Runs at the end of `npm run build`: serves dist/ on a free local port, opens /about/ in headless Chromium
// (Playwright; `npx playwright install chromium-headless-shell` once) and prints it as A4 with the page's print CSS.
// Nothing opens on screen.
//
//   node scripts/cv-pdf.ts
import { join } from "node:path";
import { chromium } from "playwright";
import { DIST, serveDist } from "./serve-dist.ts";

const PAGE = "/about/";
const OUT = join(DIST, "magnus-forsblom-cv.pdf");

const server = await serveDist();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ colorScheme: "light" });
  await page.goto(`${server.base}${PAGE}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: OUT, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log(`cv-pdf: wrote ${OUT}`);
} finally {
  await browser.close();
  server.close();
}
