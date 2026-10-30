// The shape of every content file. A file that doesn't match fails the build with a message naming the file and
// the field, so a typo can never reach the live site. EDITING.md explains each field in plain words.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const link = z.object({
  label: z.string(),
  url: z.url(),
});

/** One project: src/content/projects/<slug>/index.md, with its images in the same folder. */
const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/projects", generateId: ({ entry }) => entry.split("/")[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      tagline: z.string(),
      tags: z.array(z.string()).min(1),
      /** featured = a large card on the home page; small = a smaller card under them. */
      card: z.enum(["featured", "small"]),
      /** Order on the home page and the projects page, smallest first. */
      order: z.number(),
      stack: z.array(z.string()).min(1),
      /** The app's own colour (#rrggbb), used for this project's markers, bands and screenshot panels. */
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "a colour like #2a78d6"),
      /** "Typical application": one sentence about the app in real use. */
      application: z.string().optional(),
      /** The spec table on the project page: label and value, in this order. */
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      links: z.array(link).default([]),
      /** "private" or the URL of the public code. */
      code: z.union([z.literal("private"), z.url()]),
      /** Screenshots and photos, shown on the project page in this order; the first is the card image. */
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            frame: z.enum(["phone", "tv", "browser", "none"]).default("none"),
          }),
        )
        .default([]),
      /** A short muted clip, shown first on the project page: the file in public/media/, a poster image, a caption. */
      video: z
        .object({
          src: z.string().regex(/^\/media\/[\w.-]+\.mp4$/, "a file in public/media/, e.g. /media/clip.mp4"),
          poster: image(),
          caption: z.string(),
        })
        .optional(),
      /** true = left out of the site (for a page that isn't ready). */
      hidden: z.boolean().default(false),
    }),
});

const site = defineCollection({
  loader: glob({ pattern: "site.yaml", base: "./src/content" }),
  schema: ({ image }) => z.object({
    name: z.string(),
    /** A portrait next to the name (src/content/photo.jpg); leave out for none. */
    photo: image().optional(),
    photoAlt: z.string().default(""),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    hero: z.string(),
    currently: z.array(z.string()),
    email: z.email(),
    links: z.array(link),
    footerNote: z.string(),
    sourceUrl: z.url(),
  }),
});

const cvPoint = z.union([
  z.string(),
  z.object({
    text: z.string(),
    link: link.optional(),
  }),
]);

const cv = defineCollection({
  loader: glob({ pattern: "cv.yaml", base: "./src/content" }),
  schema: z.object({
    intro: z.string(),
    work: z.array(
      z.object({
        org: z.string(),
        role: z.string(),
        /** Shown as written, e.g. "3/2026". */
        from: z.string(),
        /** Leave out for a job that still goes on. */
        to: z.string().optional(),
        place: z.string().optional(),
        points: z.array(cvPoint).default([]),
      }),
    ),
    earlier: z.string().optional(),
    education: z.array(
      z.object({
        org: z.string(),
        field: z.string(),
        from: z.string().optional(),
        to: z.string().optional(),
        points: z.array(cvPoint).default([]),
      }),
    ),
    skills: z.array(
      z.object({
        group: z.string(),
        items: z.array(z.string()),
      }),
    ),
    languages: z.array(z.object({ name: z.string(), level: z.string() })),
    interests: z.array(
      z.object({
        name: z.string(),
        /** The slug of a project this interest links to, e.g. sali. */
        project: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { projects, site, cv };
