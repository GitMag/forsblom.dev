// Structured data (schema.org JSON-LD) for search engines, built from the content files. Pages put the result in
// <script type="application/ld+json"> (data, not code, so the CSP allows it). The person is one node with a fixed
// @id, so every page refers to the same Magnus Forsblom.
import type { CollectionEntry } from "astro:content";
import type { Project } from "./projects";
import { projectUrl } from "./projects";

type Site = CollectionEntry<"site">["data"];
type Cv = CollectionEntry<"cv">["data"];
type Node = Record<string, unknown>;

export const personId = (base: URL) => new URL("/#person", base).href;
const websiteId = (base: URL) => new URL("/#website", base).href;

/** The person: name, role, photo, place, studies, current employers, skills and languages, profiles. */
export function personNode(site: Site, cv: Cv, base: URL, photoUrl?: string): Node {
  const current = cv.work.filter((job) => !job.to);
  return {
    "@type": "Person",
    "@id": personId(base),
    name: site.name,
    url: base.href,
    ...(photoUrl ? { image: new URL(photoUrl, base).href } : {}),
    jobTitle: roleOf(site.title),
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: site.location.split(",")[0].trim(), addressCountry: "FI" },
    alumniOf: cv.education.map((school) => ({ "@type": "EducationalOrganization", name: school.org })),
    worksFor: current.map((job) => ({ "@type": "Organization", name: job.org })),
    knowsAbout: cv.skills.flatMap((group) => group.items),
    knowsLanguage: cv.languages.map((language) => language.name),
    sameAs: site.links.map((link) => link.url),
  };
}

export function websiteNode(site: Site, base: URL): Node {
  return {
    "@type": "WebSite",
    "@id": websiteId(base),
    url: base.href,
    name: site.name,
    description: site.seo.homeDescription,
    inLanguage: "en",
    author: { "@id": personId(base) },
  };
}

/** Breadcrumbs: [name, path] pairs from the home page down. */
export function breadcrumbNode(base: URL, trail: [string, string][]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: new URL(path, base).href,
    })),
  };
}

/** A project as a piece of software: what it is, its screenshots, when it was made and changed, who made it. */
export function softwareNode(project: Project, base: URL, description: string, image: string, screenshots: string[]): Node {
  const { title, subtitle, stack, specs, links, history, tags } = project.data;
  const platform = specs.find((s) => s.label.toLowerCase() === "platform")?.value ?? "";
  const kodi = /kodi/i.test(platform) || tags.some((t) => /kodi/i.test(t));
  const dates = history.map((h) => h.date).sort();
  return {
    "@type": "SoftwareApplication",
    "@id": new URL(`${projectUrl(project)}#software`, base).href,
    name: title,
    alternateName: subtitle,
    description,
    url: links[0]?.url ?? new URL(projectUrl(project), base).href,
    mainEntityOfPage: new URL(projectUrl(project), base).href,
    applicationCategory: kodi ? "MultimediaApplication" : "WebApplication",
    operatingSystem: kodi ? "Linux (Kodi)" : "Any (web browser)",
    image: new URL(image, base).href,
    screenshot: screenshots.map((src) => new URL(src, base).href),
    keywords: stack.join(", "),
    ...(dates.length ? { dateCreated: dates[0], dateModified: dates[dates.length - 1] } : {}),
    author: { "@id": personId(base) },
  };
}

/** One JSON-LD document holding several nodes. */
export function graph(...nodes: Node[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}

/** The search description of a project: its own, or the tagline plus the first stack items. */
export function projectDescription(project: Project): string {
  const { description, tagline, stack } = project.data;
  if (description) return description;
  const tools = stack.slice(0, 3);
  const built = tools.length > 1 ? `${tools.slice(0, -1).join(", ")} and ${tools[tools.length - 1]}` : tools[0];
  return `${tagline} Built with ${built}.`;
}

function roleOf(title: string): string {
  const after = title.split(/[:|–—]/)[1]?.trim();
  return after ? after.charAt(0).toUpperCase() + after.slice(1) : title;
}
