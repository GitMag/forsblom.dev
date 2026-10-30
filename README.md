# forsblom.dev

The portfolio and CV of Magnus Forsblom: a static site built with [Astro](https://astro.build), hosted on
Cloudflare Pages.

**To change text or images, see [EDITING.md](EDITING.md).** Everything is in `src/content/`.

## Commands

Node 24 or newer.

| Command | What it does |
| --- | --- |
| `npm install` | Install, once |
| `npm run dev` | Preview on http://localhost:4321 while editing |
| `npm run build` | Build the site and the CV PDF into `dist/` |
| `npm run check` | Everything that must pass before publishing: types, content guard, build, links, no inline scripts or styles |

## Publishing

Every push to `main` runs `.github/workflows/deploy.yml`: `npm run check`, then `wrangler pages deploy` to the
Cloudflare Pages project `forsblom-dev`. It needs the repository secrets `CLOUDFLARE_API_TOKEN` and `CONTENT_GUARD`, and
the variable `CLOUDFLARE_ACCOUNT_ID`.

## Layout

- `src/content/`: all text and images (`site.yaml`, `cv.yaml`, `projects/<name>/`); the schema is `src/content.config.ts`.
- `src/pages/`, `src/layouts/`, `src/components/`, `src/styles/`: the design.
- **Lightbox** (reusable): put `<Lightbox />` (`src/components/Lightbox.astro`) once on a page, and wrap any image in
  `<Zoomable src alt group>` (`src/components/Zoomable.astro`), or pass `zoom="<group>"` to `<Figure>`. A click
  opens the image large; ← → (or a swipe) steps through its group, Esc or a click outside closes. The code is
  `src/scripts/lightbox.ts` and `src/styles/lightbox.css` (external files, so the CSP holds); without JavaScript the
  link opens the image itself. Project pages use it for the gallery and the cover shot (group `screenshots`).
- `scripts/guard.ts`: blocks private details (addresses, phone numbers, a private word list) from being published.
- `scripts/check-dist.ts`: internal links, and that nothing inline would be blocked by the CSP in `public/_headers`.
- `scripts/cv-pdf.ts`: prints the About page to `dist/magnus-forsblom-cv.pdf`.
