# Editing the site

All text and images are in `src/content/`. You never need to touch code to change what the site says.

| What you want to change | File |
| --- | --- |
| Home page intro, the "currently" lines, page title, footer links | `src/content/site.yaml` |
| Your photo | `src/content/photo.jpg` (a portrait, about 4:5); `photo:` and `photoAlt:` in `site.yaml` |
| The photo in the CV PDF | `src/content/photo-cv.jpg`; `cvPhoto:` in `site.yaml` (leave out to use the same photo) |
| About / CV page (and the CV PDF, which is made from it) | `src/content/cv.yaml` |
| A project's text, tags, links or screenshots | `src/content/projects/<name>/index.md` |

## Publishing a change

1. Edit the file. In the browser, open the file on GitHub, press the pencil icon, edit and **Commit changes** to `main`.
   This works on a phone too. Or edit locally and `git push`.
2. GitHub Actions checks and publishes the site. After about a minute, the change is live on forsblom.dev.
3. If a check fails, the live site stays as it was. The **Actions** tab on GitHub shows the red run, and its log names
   the file and line (see "When the build fails" below).

To see a change before publishing: `npm install` once, then `npm run dev` and open http://localhost:4321.

## Projects

Each project is a folder: `src/content/projects/<name>/` with `index.md` and its images. The folder name is the
address: `projects/sali/` → forsblom.dev/projects/sali/.

The top of `index.md`, between the `---` lines, holds the settings:

```yaml
title: Sali                     # the name
subtitle: Gym tracker           # a few words under the name
tagline: A gym tracker for …    # one sentence, shown on the cards
tags: [Web app, PWA]            # small labels
card: featured                  # featured = big card on the home page, small = smaller card
order: 3                        # position, smallest first
stack: [TypeScript, React]      # technologies; a CV skill with the same name links here
accent: "#0e8a7a"               # the app's own colour: markers, bands and screenshot panels
why: "I wanted …"               # why you built it, in your own voice; shown as a quote on the project page and
                                # instead of the tagline on the home and projects lists
backdrop: ./01-map.png          # optional: a picture for the project's colour field
diagram:                        # the block diagram: what goes in, what does the work, what comes out
  inputs: ["Phone", "Invite links"]
  core: ["Hono API", "SQLite"]
  outputs: ["Installable web app"]   # short labels (up to ~6 words) look best in the boxes
history:                        # revision history; write it oldest first, the page shows it newest first
  - { date: "2026-10-18", rev: "A", change: "First version." }
application: "Between sets: …"  # "Typical application": one sentence about the app in real use
specs:                          # the spec table on the project page, in this order
  - { label: Platform, value: "Installable web app (PWA)" }
  - { label: Status, value: "In use" }
links:                          # buttons, optional
  - label: Open Parkki
    url: https://parkki-tampere.pages.dev/
code: private                   # or the URL of the public code, e.g. https://github.com/GitMag/x
images:                         # optional; the first one is the card picture and the cover's product shot
  - src: ./01-train.png         # a file in the same folder
    alt: What the picture shows, in one sentence.
    frame: phone                # phone, tv, browser or none
video:                          # optional: a short muted clip, shown first on the page
  src: /media/clip.mp4          # the file goes in public/media/
  poster: ./00-poster.jpg       # a still shown until it plays
  caption: What the clip shows.
hidden: false                   # true = left off the site
```

Under the second `---` is the page text in Markdown: `## Heading`, paragraphs, `- ` for lists and `*italic*`.

- **Add a project:** copy a project folder, rename it, edit `index.md` and replace the images.
- **Swap a screenshot:** put the new file in the folder with the same name, or a new name and change `src:`.
  Phone screenshots look best at 720 × 1560 px (a 360 × 780 phone at 2×), TV ones at 1920 × 1080 or larger.
- **Reorder or feature projects:** change `order` and `card`.
- **Hide a project for a while:** `hidden: true`.
- On a project page every screenshot opens larger when clicked; nothing to set. The clip (`video`) plays in place.

## CV (`cv.yaml`)

The lists are newest first. A job without `to:` is shown as current. A point can be plain text or, to add a link:

```yaml
      - text: "Bachelor's thesis, grade 5: …"
        link:
          label: Read the thesis
          url: https://trepo.tuni.fi/handle/10024/232092
```

Never put a phone number or a private email here; the site's only email is magnus@forsblom.dev.

## The share image and icons

`public/og.png` (the picture shown when a link to the site is shared) and the PNG icons are made from `site.yaml` and
`public/favicon.svg`. After changing your name, the title or the favicon, run `node scripts/brand-images.ts` once
and commit the new files. A project page shares its first landscape screenshot instead, if it has one.

The role line under your name on the CV ("Software developer") is the part of `title` in `site.yaml` after the colon.

## When the build fails

The check prints `file:line` and what is wrong:

- **a schema message** (e.g. `projects → sali: tags: Required`): a setting is missing or misspelled in that file.
- **`ImageNotFound`**: an image's `src:` doesn't match a file in the folder.
- **`guard: … phone number` / `private guard list, entry N`**: the text contains something that must not be
  published. The private list lives in `private/content-guard.txt` on the Mac and in the `CONTENT_GUARD` repository
  secret on GitHub. Its entries are never printed, so the log only says the entry number.
- **`check-dist: broken link`**: a link inside the site points to a page that doesn't exist.

Fix the file and commit again.
