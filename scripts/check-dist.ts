// Checks over the built site:
// - every internal href/src/srcset in dist/**/*.html points at a file that exists (external links are not fetched);
// - no inline <script>, <style> or style="" attribute, which the Content-Security-Policy in public/_headers blocks.
//   JSON-LD (<script type="application/ld+json">) is data, not code, and is allowed.
//
//   node scripts/check-dist.ts
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";

function* htmlFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith(".html")) yield path;
  }
}

function resolves(url: string): boolean {
  const path = decodeURI(url.split(/[?#]/)[0]);
  if (path === "/" || path === "") return existsSync(join(DIST, "index.html"));
  const base = join(DIST, path);
  return (
    (existsSync(base) && statSync(base).isFile()) ||
    existsSync(join(base, "index.html")) ||
    existsSync(`${base.replace(/\/$/, "")}.html`)
  );
}

if (!existsSync(DIST)) {
  console.error("check-dist: no dist/ folder; run npm run build first");
  process.exit(2);
}

let broken = 0;
let checked = 0;
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, "utf8");
  const urls = new Set<string>();
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const part of m[1].split(",")) urls.add(part.trim().split(/\s+/)[0]);
  }
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    if (!/\ssrc=/.test(m[1]) && !/type="application\/ld\+json"/.test(m[1])) {
      console.error(`${relative(DIST, file)}: inline <script> (blocked by the CSP; use a <script src> file)`);
      broken++;
    }
  }
  if (/<style\b/.test(html)) {
    console.error(`${relative(DIST, file)}: inline <style> (blocked by the CSP)`);
    broken++;
  }
  if (/<[a-z][^>]*\sstyle="/i.test(html)) {
    console.error(`${relative(DIST, file)}: style="" attribute (blocked by the CSP)`);
    broken++;
  }
  for (const url of urls) {
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    checked++;
    if (!resolves(url)) {
      console.error(`${relative(DIST, file)}: broken link ${url}`);
      broken++;
    }
  }
}

if (broken > 0) {
  console.error(`check-dist: ${broken} problem(s)`);
  process.exit(1);
}
console.log(`check-dist: ${checked} internal links OK, no inline scripts or styles`);
