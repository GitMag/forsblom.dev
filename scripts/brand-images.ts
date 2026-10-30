// Makes the share image and the PNG icons, once, into public/:
//   public/og.png              1200×630, the name and the description from src/content/site.yaml, in the site's fonts
//   public/favicon-32.png      the favicon for browsers without SVG icons
//   public/apple-touch-icon.png 180×180
// Run it again after changing site.yaml's name or description, or public/favicon.svg:
//
//   node scripts/brand-images.ts
//
// The share image is rendered with headless Chromium (Playwright), the icons with sharp. Nothing opens on screen.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "yaml";
import sharp from "sharp";
import { chromium } from "playwright";

const site = parse(await readFile("src/content/site.yaml", "utf8")) as { name: string; description: string; photo?: string; photoAlt?: string };
const host = "forsblom.dev";

const font = async (path: string) => `url(data:font/woff2;base64,${(await readFile(path)).toString("base64")}) format("woff2")`;
const fraunces = await font("node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2");
const schibsted = await font("node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2");
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// The photo (site.yaml: photo, relative to src/content) goes on the right, when there is one.
const photo = site.photo
  ? `<img class="photo" alt="${escape(site.photoAlt ?? "")}" src="data:image/jpeg;base64,${(await readFile(`src/content/${site.photo.replace(/^\.\//, "")}`)).toString("base64")}">`
  : "";

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Fraunces; font-weight: 100 900; src: ${fraunces}; }
  @font-face { font-family: Schibsted; font-weight: 400 900; src: ${schibsted}; }
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; background: #faf8f4; color: #1a1815; display: flex; align-items: center;
         gap: 80px; padding: 0 96px; box-sizing: border-box; font-family: Schibsted, sans-serif; }
  .text { flex: 1; min-width: 0; }
  .bar { width: 72px; height: 8px; border-radius: 4px; background: #d2461c; margin-bottom: 40px; }
  h1 { font: 500 72px/1 Fraunces, serif; letter-spacing: -0.025em; margin: 0 0 24px; white-space: nowrap; }
  p { font-size: 30px; line-height: 1.35; margin: 0; max-width: 19em; color: #3d3a35; }
  .host { position: absolute; left: 96px; bottom: 64px; font: 500 24px ui-monospace, Menlo, monospace; color: #d2461c; letter-spacing: 0.04em; }
  .photo { width: 320px; height: 400px; object-fit: cover; border-radius: 28px; border: 1px solid #e3ded5;
           box-shadow: 0 24px 48px -24px rgba(30, 20, 10, 0.35); }
</style></head><body>
  <div class="text">
    <div class="bar"></div>
    <h1>${escape(site.name)}</h1>
    <p>${escape(site.description)}</p>
  </div>
  ${photo}
  <div class="host">${host}</div>
</body></html>`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/og.png", type: "png" });
  console.log("brand-images: wrote public/og.png");
} finally {
  await browser.close();
}

const svg = await readFile("public/favicon.svg");
await writeFile("public/favicon-32.png", await sharp(svg, { density: 384 }).resize(32, 32).png().toBuffer());
await writeFile("public/apple-touch-icon.png", await sharp(svg, { density: 384 }).resize(180, 180).png().toBuffer());
console.log("brand-images: wrote public/favicon-32.png and public/apple-touch-icon.png");
