// The lightbox: shows a link's image large in a modal <dialog>, with previous/next through the other images of the
// same group. Any link can use it:
//
//   <a href="/big.webp" data-lightbox="gallery" data-caption="What it shows" data-alt="…" data-width="1920"
//      data-height="1080">…small picture…</a>
//
// Zoomable.astro writes such links; Lightbox.astro loads this file once per page. Without JavaScript the link just
// opens the image. Keys: ← → step, Esc closes; on a phone a sideways swipe steps. A click outside the image closes.
// No inline styles (the page's CSP): the look is in src/styles/lightbox.css.

interface Item {
  href: string;
  alt: string;
  caption: string;
  width?: string;
  height?: string;
}

const SELECTOR = "a[data-lightbox]";
const SWIPE_PX = 40;

let dialog: HTMLDialogElement | undefined;
let img: HTMLImageElement;
let count: HTMLElement;
let caption: HTMLElement;
let prev: HTMLButtonElement;
let next: HTMLButtonElement;
let items: Item[] = [];
let index = 0;

function build(): HTMLDialogElement {
  const d = document.createElement("dialog");
  d.className = "lightbox";
  d.setAttribute("aria-label", "Image viewer");
  d.innerHTML = `
    <div class="lb-stage"><img class="lb-img" alt="" decoding="async"></div>
    <div class="lb-bar">
      <p class="lb-text"><span class="lb-count"></span><span class="lb-caption"></span></p>
      <div class="lb-buttons">
        <button type="button" class="lb-prev" aria-label="Previous image">←</button>
        <button type="button" class="lb-next" aria-label="Next image">→</button>
        <button type="button" class="lb-close" aria-label="Close">✕</button>
      </div>
    </div>`;
  document.body.append(d);

  img = d.querySelector(".lb-img")!;
  count = d.querySelector(".lb-count")!;
  caption = d.querySelector(".lb-caption")!;
  prev = d.querySelector(".lb-prev")!;
  next = d.querySelector(".lb-next")!;
  const stage = d.querySelector<HTMLElement>(".lb-stage")!;

  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  d.querySelector(".lb-close")!.addEventListener("click", () => d.close());
  d.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  // A click on the dark area (not the image or the bar) closes; a swipe steps instead of closing.
  let startX: number | undefined;
  let swiped = false;
  stage.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    swiped = false;
  });
  stage.addEventListener("pointerup", (e) => {
    if (startX === undefined) return;
    const dx = e.clientX - startX;
    startX = undefined;
    if (Math.abs(dx) > SWIPE_PX && items.length > 1) {
      swiped = true;
      step(dx < 0 ? 1 : -1);
    }
  });
  d.addEventListener("click", (e) => {
    if (swiped) {
      swiped = false;
      return;
    }
    if (e.target === d || e.target === stage) d.close();
  });
  return d;
}

function itemOf(link: HTMLAnchorElement): Item {
  const { lightboxCaption, caption: text, alt, width, height } = link.dataset;
  return { href: link.href, alt: alt ?? "", caption: text ?? lightboxCaption ?? alt ?? "", width, height };
}

/** The group's images in page order; the same image twice (e.g. a cover shot and its gallery copy) counts once. */
function groupOf(link: HTMLAnchorElement): Item[] {
  const group = link.dataset.lightbox ?? "";
  const seen = new Set<string>();
  const list: Item[] = [];
  for (const a of document.querySelectorAll<HTMLAnchorElement>(SELECTOR)) {
    if (a.dataset.lightbox !== group || seen.has(a.href)) continue;
    seen.add(a.href);
    list.push(itemOf(a));
  }
  return list;
}

function show(i: number): void {
  index = (i + items.length) % items.length;
  const item = items[index];
  if (item.width && item.height) {
    img.width = Number(item.width);
    img.height = Number(item.height);
  } else {
    img.removeAttribute("width");
    img.removeAttribute("height");
  }
  img.src = item.href;
  img.alt = item.alt;
  caption.textContent = item.caption;
  const many = items.length > 1;
  count.textContent = many ? `${index + 1} / ${items.length}` : "";
  prev.hidden = !many;
  next.hidden = !many;
  // Load the neighbours, so stepping is instant.
  if (many) {
    for (const j of [index + 1, index - 1]) new Image().src = items[(j + items.length) % items.length].href;
  }
}

function step(by: number): void {
  if (items.length > 1) show(index + by);
}

function open(link: HTMLAnchorElement): void {
  dialog ??= build();
  items = groupOf(link);
  show(Math.max(0, items.findIndex((item) => item.href === link.href)));
  if (!dialog.open) dialog.showModal();
}

document.addEventListener("click", (e) => {
  // Ctrl/⌘/Shift/middle click keep the browser's own behaviour (open the image in a new tab).
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>(SELECTOR);
  if (!link) return;
  e.preventDefault();
  open(link);
});
