// Prints the About page to dist/magnus-forsblom-cv.pdf, so the PDF always matches the page.
// Runs at the end of `npm run build`: serves dist/ on a free local port, opens /about/ in headless Chromium
// (Playwright; `npx playwright install chromium-headless-shell` once) and prints it as A4 with the page's print CSS.
// Nothing opens on screen.
//
//   node scripts/cv-pdf.ts
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import type { AddressInfo } from "node:net";
import { chromium } from "playwright";

const DIST = resolve("dist");
const PAGE = "/about/";
const OUT = join(DIST, "magnus-forsblom-cv.pdf");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

// A tiny static server over dist/, enough for one page and its assets.
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  let file = resolve(DIST, `.${path}`);
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise<void>((ready) => server.listen(0, "127.0.0.1", ready));
const { port } = server.address() as AddressInfo;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ colorScheme: "light" });
  await page.goto(`http://127.0.0.1:${port}${PAGE}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: OUT, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log(`cv-pdf: wrote ${OUT}`);
} finally {
  await browser.close();
  server.close();
}
