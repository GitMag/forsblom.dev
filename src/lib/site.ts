// Small helpers over site.yaml and the build.

/** "Magnus Forsblom: software developer" → "Software developer" (the part after the colon, capitalised). */
export function roleFrom(title: string): string {
  const after = title.split(/[:|–—]/)[1]?.trim();
  const role = after && after.length > 0 ? after : title;
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/** The site's revision, from the build date: "2026.10". Shown in the title blocks and the footer. */
export const revision = (() => {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
})();

/** "https://github.com/GitMag" → "github.com/GitMag", for links written out. */
export const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
