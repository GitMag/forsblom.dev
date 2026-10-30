// Content guard: fails when a text file contains something that must never be published, such as a home network
// address, a phone number or a word from the private guard list.
//
//   node scripts/guard.ts src/content dist
//
// The private list holds one word or phrase per line (case-insensitive, # starts a comment). It is read from
// private/content-guard.txt locally and from the CONTENT_GUARD environment variable in CI (a repository secret).
// The repo and its CI logs are public, so a hit names the file, the line and the rule number, never the word itself.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const TEXT_EXTENSIONS = new Set([".md", ".mdx", ".yaml", ".yml", ".html", ".xml", ".txt", ".json", ".js", ".css", ".svg", ".astro", ".ts"]);

const builtIn: { name: string; re: RegExp }[] = [
  { name: "home network address", re: /\b192\.168\.\d{1,3}\.\d{1,3}\b/ },
  { name: "Tailscale address", re: /\b100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}\b/ },
  { name: "tailnet host name", re: /\.ts\.net\b/i },
  { name: "phone number", re: /\+358[\s\d-]{7,}/ },
  { name: "Finnish mobile number", re: /\b0(4\d|50)[\s-]?\d{3}[\s-]?\d{3,4}\b/ },
  { name: "personal email", re: /@gmail\.com\b/i },
  { name: "banned wording", re: /reverse[\s-]?engineer|unofficial\s+api/i },
];

function privateList(): string[] {
  const source = process.env.CONTENT_GUARD ?? (existsSync("private/content-guard.txt") ? readFileSync("private/content-guard.txt", "utf8") : "");
  return source
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, "").trim().toLowerCase())
    .filter(Boolean);
}

function* files(path: string): Generator<string> {
  if (!existsSync(path)) return;
  if (statSync(path).isFile()) {
    yield path;
    return;
  }
  for (const name of readdirSync(path)) yield* files(join(path, name));
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("usage: node scripts/guard.ts <file or folder>...");
  process.exit(2);
}

const words = privateList();
if (words.length === 0) {
  console.warn("guard: no private list (private/content-guard.txt or CONTENT_GUARD); checking the built-in rules only");
}

let hits = 0;
let checked = 0;
for (const target of targets) {
  for (const file of files(target)) {
    if (!TEXT_EXTENSIONS.has(extname(file))) continue;
    checked++;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const lower = line.toLowerCase();
      for (const rule of builtIn) {
        if (rule.re.test(line)) {
          console.error(`${relative(".", file)}:${i + 1}: ${rule.name}`);
          hits++;
        }
      }
      words.forEach((word, n) => {
        if (lower.includes(word)) {
          console.error(`${relative(".", file)}:${i + 1}: private guard list, entry ${n + 1}`);
          hits++;
        }
      });
    });
  }
}

if (hits > 0) {
  console.error(`guard: ${hits} problem(s). Remove them from the text; nothing was published.`);
  process.exit(1);
}
console.log(`guard: ${checked} files clean (${targets.join(", ")})`);
