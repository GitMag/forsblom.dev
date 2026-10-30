// /accents.css: one rule per project with its own colour from the front matter (`accent`), so a project's
// entries, table rows and page can carry it without inline styles (the CSP forbids style="" attributes).
// global.css derives the readable text, line and panel tones from --accent.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const projects = await getCollection("projects");
  const css = projects.map((p) => `[data-project="${p.id}"] { --accent: ${p.data.accent}; }`).join("\n");
  return new Response(`${css}\n`, { headers: { "Content-Type": "text/css; charset=utf-8" } });
};
