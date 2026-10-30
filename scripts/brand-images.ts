// Makes the share image and the PNG icons, once, into public/:
//   public/og.png               1200×630, a title block with the name, the description and the photo from
//                               src/content/site.yaml, in the site's fonts
//   public/favicon-32.png       the favicon for browsers without SVG icons
//   public/apple-touch-icon.png 180×180
// Run it again after changing site.yaml's name, description or photo, or public/favicon.svg:
//
//   node scripts/brand-images.ts
//
// The share image is rendered with headless Chromium (Playwright), the icons with sharp. Nothing opens on screen.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "yaml";
import sharp from "sharp";
import { chromium } from "playwright";

const site = parse(await readFile("src/content/site.yaml", "utf8")) as {
  name: string;
  title: string;
  description: string;
  location: string;
  email: string;
  photo?: string;
  photoAlt?: string;
};
const host = "forsblom.dev";
const now = new Date();
const revision = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
const role = (site.title.split(/[:|–—]/)[1] ?? site.title).trim().replace(/^./, (c) => c.toUpperCase());

const font = async (path: string) => `url(data:font/woff2;base64,${(await readFile(path)).toString("base64")}) format("woff2")`;
const sans = await font("node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2");
const mono = await font("node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2");
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// The photo (site.yaml: photo, relative to src/content) fills the right-hand cell, when there is one.
const photo = site.photo
  ? `<img class="photo" alt="${escape(site.photoAlt ?? "")}" src="data:image/jpeg;base64,${(await readFile(`src/content/${site.photo.replace(/^\.\//, "")}`)).toString("base64")}">`
  : "";

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Plex; font-weight: 100 700; src: ${sans}; }
  @font-face { font-family: PlexMono; font-weight: 500; src: ${mono}; }
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; background: #fbfaf8; color: #1b1a18; padding: 64px; box-sizing: border-box;
         font-family: Plex, sans-serif; }
  .tb { display: grid; grid-template-columns: 1fr auto; height: 100%; border: 2px solid #1b1b1b; }
  .main { padding: 56px 56px 40px; display: flex; flex-direction: column; justify-content: flex-end; gap: 20px; }
  h1 { font-size: 78px; font-weight: 600; line-height: 1; letter-spacing: -0.025em; margin: 0; white-space: nowrap; }
  .sub { font-size: 30px; color: #4a4a4a; margin: 0; }
  p { font-size: 26px; line-height: 1.4; margin: 0; max-width: 22em; }
  .photo { grid-column: 2; grid-row: 1 / span 2; width: 330px; height: 100%; object-fit: cover; object-position: 50% 15%;
           border-left: 2px solid #1b1b1b; display: block; }
  .fields { grid-column: 1; display: grid; grid-template-columns: 1fr 1fr 1fr; border-top: 2px solid #1b1b1b; }
  .fields div { padding: 18px 56px; border-left: 1px solid #c8c8c8; }
  .fields div:first-child { border-left: 0; }
  dt { font: 500 14px PlexMono, monospace; letter-spacing: 0.1em; text-transform: uppercase; color: #6a6a6a; margin-bottom: 4px; }
  dd { margin: 0; font-size: 22px; }
  .signal { color: #2f5fe0; }
</style></head><body>
  <div class="tb">
    <div class="main">
      <h1>${escape(site.name)}</h1>
      <p class="sub">${escape(role)} · ${escape(site.location)}</p>
      <p>${escape(site.description)}</p>
    </div>
    ${photo}
    <dl class="fields">
      <div><dt>Document</dt><dd>${host}</dd></div>
      <div><dt>Revision</dt><dd>${revision}</dd></div>
      <div><dt>Contact</dt><dd class="signal">${escape(site.email)}</dd></div>
    </dl>
  </div>
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
await writeFile("public/apple-touch-icon.png", await sharp(svg, { density: 384 }).resize(180, 180).flatten({ background: "#ffffff" }).png().toBuffer());
console.log("brand-images: wrote public/favicon-32.png and public/apple-touch-icon.png");
