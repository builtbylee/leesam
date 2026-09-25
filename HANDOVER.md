# talentbylee.com — Handover Context

Personal digital CV for Lee Sam. Live at **https://talentbylee.com** (also `www.talentbylee.com` and `leesam.pages.dev`).

---

## The site

A single-file static site (`index.html`). All CSS and JavaScript is inline — no build step, no framework, no runtime dependencies. The `assets/` folder holds images only. `tools/gen-maps.mjs` regenerates the two dot-matrix map paths (see Night maps).

**Deploy:** the Cloudflare Pages project `leesam` is connected to GitHub (`builtbylee/leesam`). Pushing to `main` triggers a production build — no manual upload needed. Check progress with:
```bash
npx wrangler pages deployment list --project-name leesam
```

---

## File structure

```
index.html          — entire site (HTML + inline CSS + inline JS, incl. the two map paths)
tools/gen-maps.mjs  — generates the EMEA and world dot-matrix paths and city positions
assets/
  lee-sam-hero.jpeg — hero portrait
  logos/            — company logos (PNG + SVG, used in Experience timeline)
  apps/             — app screenshots (used in AI Work carousel)
  outside-work/     — travel and Bucks photos (used in Outside Work carousel)
  awards/
    maple-leaf.png  — Maple Leaf Award image (used in Numbers section)
```

---

## Design: "Star search" (September 2026)

**The idea.** Great people are "star talent", and the work is finding the one in a sky full of them. Drawn as a star chart on paper (light theme — Lee prefers light; a dark night-sky version was tried and rejected on 2026-09-25): navy ink stars on a cool white ground, blue for what is current, and gold only for "the one" (the found star, the selected role's dot, the FY25 record year, home on the maps, the primary email button). Token names (`--night`, `--deep`) are historical; they now hold the light grounds.

| Token | Value | Use |
|---|---|---|
| `--night` | `#f6f8fc` | Page ground |
| `--deep` | `#edf1f8` | Alternate section ground (Experience, Numbers) |
| `--panel` | `#ffffff` | Cards, panels |
| `--ink` | `#0b1b33` | Text |
| `--muted` | `#4c5b72` | Secondary text |
| `--faint` | `#a3aec0` | Marks only, never text |
| `--star` | `#1e3a66` | Stars, galaxy points |
| `--blue` / `--blue-2` | `#2458e6` / `#1d4ed8` | Current / selected, routes; `--blue-2` for text on `--blue-soft` |
| `--gold` | `#f0a81c` | "The one" as a mark, fill or glow — never small text |
| `--gold-ink` | `#9a5f00` | Gold as small text (≥ 4.5:1) |
| `--gold-display` | `#c27a06` | Gold as large text only ("AI era.", "talk.", ≥ 3:1) |
| `--land` | `#c7d3e8` | Map land dots |

Canvas colours are set in the scripts (`STAR`, `GOLD`, `BLUE` in `Sky`; the galaxy's `fillStyle`s) and must be changed there too if the palette moves.

**Type:** `Schibsted Grotesk` (400–800) for headings and text; `Newsreader` italic for Lee's own voice (lede, Outside Work copy, timeline notes, "talk."); `Martian Mono` at 87.5% width for labels, dates, coordinates and data.

**Motion system:**
- Easing: `--out` `cubic-bezier(.16,1,.3,1)` for anything that moves; `--spring` `(.34,1.56,.64,1)` only for things that land (nodes, buttons, dots).
- Tiers: micro 160–240ms (hover, press) · move 460–700ms (timeline, carousel, panel) · moment 900–1700ms (letters, lock-on, galaxy, routes, count-up) · ambient loops (sky, galaxy spin, route lights, lock-tag pip).
- Once vs loop: load sequence, reveals, galaxy assembly, route draw-in and count-up play once. Only the sky, galaxy rotation, route lights and flow dots loop, and each pauses when off screen or the tab is hidden.
- Reduced motion: every canvas renders one composed still frame; reveals, letters and the portrait appear at rest; auto-advance stops. Every control still works.

---

## Sections

| # | ID | Notes |
|---|---|---|
| — | `.topbar` | Star mark + name; nav links get a gold dot when current; Contact pill. Under 860px the links collapse into a Menu button (`#navToggle` / `#mobileNav`). |
| 01 | `#top` | **The sky** (`canvas[data-sky="hero"]`). Letters of the name rise in; lede, thesis and facts follow; the gold lock frame snaps onto the portrait, which comes into focus; a London coordinates tag appears. A search frame then roams the sky, locks onto a star, turns it gold and grows a 3-line constellation. Pointer parallax on fine pointers. |
| 02 | `#experience` | Grouped vertical timeline + detail panel (see below). |
| 03 | `#ai-work` | Carousel, 7 slides. Arriving slide's copy slides in from the direction of travel. Screen steps with a 6s progress line; Candidate Intelligence flow. |
| 04 | `#numbers` | **Galaxy** headline card (3,329 points, one per hire; 599 FY25 hires in gold) beside the count-up and FY bars · 4 stat cards · **EMEA markets map** · women-in-management chart · representation switcher · How note · Maple Leaf Award. |
| 05 | `#outside-work` | Serif copy, **travel map** synced to the photo carousel (stops are real buttons over the map). |
| — | `#contact` | The sky again (`data-sky="contact"`) with shooting stars. "Let's *talk.*", email (gold), Copy email, Back to top, coordinates sign-off. |

Sections carry `data-reveal`: they arrive by coming into focus (blur → sharp, rise 26px), staggered by `--i`.

---

## Canvases and maps

- **`Sky(canvas, opts)`** — star count = area / `opts.area`; seeded, so the sky is identical every visit. `hunt: true` runs the search frame (avoids `opts.avoid` elements, i.e. the hero copy and portrait); `shooting: true` adds shooting stars every 4–10s.
- **Galaxy** (`canvas[data-galaxy]`) — `data-total` points and `data-gold` gold points, both read from attributes. Points wait scattered and gather into a three-arm spiral when the card is 25% on screen; inner arms turn faster. If the hire figures change, change the attributes, the figcaption and the `aria-label` together.
- **Night maps** (`RouteMap(svg, cfg)`) — land is one `<path class="land">` of zero-length segments drawn with round caps (dot matrix). Routes are quadratic curves from `cfg.home`, bowed north, drawn in once; lights travel them while visible. EMEA: Mercator 600×516, `land-50m`, 8px grid; nodes sit at each market's capital, labelled by country. World: Natural Earth 720×321, `land-110m`, 7px grid, Antarctica trimmed. To add a place or market, run `tools/gen-maps.mjs` (needs `npm i d3-geo topojson-client world-atlas`) for its projected x/y, add it to the node list in the script block, and (travel) add `data-place` to its photo.

---

## Experience timeline

**Left list (static HTML):** roles are grouped by company in `.tl-company` blocks. Each block has a `.tl-company-head` (28px greyscale logo, company name, years) followed by one `button.timeline-role` per role, newest first. The selected role's company logo gets a gold ring.

Buttons keep their `data-role-index`, which must match the order of the `roles` array. Each button carries a `.sr-only` suffix with company (and years) for screen readers, because the company heads are `aria-hidden`.

**Right panel (JS-rendered):** data lives in `const roles = [`:

```js
{
  meta, title, summary,
  logo, logoClass, logoAlt, fallback,
  proofs: [['EMEA', 'VP+ leadership searches'], ...],  // 3 value/label pairs
  bullets: [...],                                      // responsibilities
  noteTitle, note                                      // right column (set in serif italic)
}
```

**Desktop motion:** `.tl-indicator` glides to the selected row (sub-pixel positions) and `.tl-progress`, a lit gold→blue line, grows down the spine from the present to it. `slidePanel()` eases the panel height and slides its three parts in from the direction of travel (down the list = from below) with a blur-to-sharp, staggered 55ms; the company disc springs in. **Mobile (≤980px):** accordion per role, one open at a time, content comes into focus on open.

When adding or renaming a role, update both the list HTML and the `roles` entry.

---

## Interactions

- **Representation switcher** (`[data-rep]`): four `.rep-row`s with `data-value`, `data-delta`, `data-label` and chart positions `--a` / `--b` (/ `--m`) on a 0–40% axis (position = percentage × 2.5). If a figure changes, update the row's data attributes, `--a`/`--b` and its `.rep-vals` text.
- **Market chips** (`[data-market]`): hover/focus previews a route; click pins it (click again to unpin).
- **Travel stops** (`.stop`, generated): click shows that place's first photo; the carousel auto-advances every 5s while visible and not hovered or focused.
- **Screen steps** (`[data-steps]`): `.web-step` buttons map by order to `.web-stage img`; 6s auto-advance while visible, paused on hover/focus.
- **Candidate Intelligence flow** (`.ci-flow`): one gold dot per arrow on a 4.8s loop, in sequence; runs only while 60% on screen.
- **Copy email** (`[data-copy-email]`): reads the address from the contact `mailto:` link (Cloudflare obfuscation decodes it on load), falls back to `execCommand('copy')`, announces the result in `[data-copy-status]`.

---

## Remaining work

- [ ] **Logo quality:** review logos at 28px (timeline) and 68px (panel).
- [ ] **Agency figure:** the card says 2.2%, but 76 ÷ 3,329 = 2.28%, which rounds to 2.3%. Confirm which is right with Lee.

---

## Visual testing

Test at 1440, 430, 390 and 360 widths before every push: no horizontal overflow, no console errors, every `[data-reveal]` reaches `.in` when scrolled through, canvases draw (non-empty pixels), timeline click/arrow keys, mobile accordion, market chips, travel stops + auto-advance, representation switcher, screen steps, Copy email, Menu button, carousel controls, and a reduced-motion pass. Any local Playwright install works; load `file:///…/index.html`, wait for `document.fonts.ready`, and use `scrollTo({ behavior: 'instant' })` when measuring (the page uses smooth scrolling).

---

## Key technical notes

- **Carousel overflow:** `.ai-carousel` and `.ai-carousel-viewport` have `min-width: 0` — required to prevent horizontal overflow on mobile.
- **Sticky header offset:** `section[id] { scroll-margin-top: 76px }` keeps anchored sections clear of the 64px top bar.
- **`html.js`:** set by an inline script in `<head>`; all load and reveal hiding is scoped to it, so the page is fully visible without JavaScript.
- **No build step:** edit `index.html` directly.

---

## About Lee

Lee Sam is a London-based recruiting leader with twenty years across category-defining tech companies. Most recently at Cloudflare (2018 — July 2026): Recruiter to Manager, Head of Recruiting EMEA, then Executive Recruiting. This site is a creative digital CV — not a developer portfolio. Writing tone should reflect a senior recruiting leader, not an engineer.
