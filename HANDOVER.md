# talentbylee.com — Handover Context

Personal digital CV for Lee Sam. Live at **https://talentbylee.com** (also `www.talentbylee.com` and `leesam.pages.dev`).

---

## The site

A single-file static site (`index.html`). All CSS and JavaScript is inline — no build step, no framework, no dependencies. The `assets/` folder holds images only.

**Deploy:** the Cloudflare Pages project `leesam` is connected to GitHub (`builtbylee/leesam`). Pushing to `main` triggers a production build — no manual upload needed. Check progress with:
```bash
npx wrangler pages deployment list --project-name leesam
```

---

## File structure

```
index.html          — entire site (HTML + inline CSS + inline JS)
assets/
  lee-sam-hero.jpeg — hero portrait
  logos/            — company logos (PNG + SVG, used in Experience timeline)
  apps/             — app screenshots (used in AI Work carousel)
  outside-work/     — travel and Bucks photos (used in Outside Work carousel)
  awards/
    maple-leaf.png  — Maple Leaf Award image (used in Numbers section)
```

---

## Design system

September 2026 redesign, aligned with verda.talentbylee.com: navy and blue only, hairline dividers, one soft shadow reserved for the object that matters in each section.

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0a2540` | Headings, brand mark, Contact band |
| `--ink` | `#0f2540` | Body text |
| `--muted` | `#4a5a6d` | Secondary text |
| `--blue` | `#2563eb` | Accent: section numbers, active nav, selected role, peak bars |
| `--blue-soft` | `#e8efff` | Selected-role background, mobile nav active |
| `--bar` | `#b9cdf7` | Non-peak chart bars |
| `--line` | `#e3e8ef` | Borders and dividers |
| `--paper` | `#f5f8fb` | Alternate section background |
| `--shadow` | soft navy drop | Portrait, timeline panel, carousels, numbers cards only |

**Typography (two families only):**
- `Instrument Sans` — everything: headings, body, labels, stats
- `Instrument Serif` — hero lede, Outside Work copy, italic "talk." in Contact

No monospace, no uppercase eyebrows. Labels are sentence case.

**Shell:** `min(1180px, calc(100% - 48px))` (24px gutters); 16px gutters under 640px.

**Section heads:** `.head` = small blue number beside an `h2` (30–44px) with optional intro paragraph.

---

## Sections

| # | ID | Background | Notes |
|---|---|---|---|
| — | `.topbar` | white, sticky | LS mark + name + "Recruiting leadership"; section links highlight on scroll; Contact button. Under 860px the links collapse into a Menu button (`#navToggle` / `#mobileNav`). |
| 01 | `#top` | white | Name, serif lede, two thesis paragraphs, Focus / Based / Most recently at strip, portrait. |
| 02 | `#experience` | paper | Grouped vertical timeline (left) + detail panel (right). See below. |
| 03 | `#ai-work` | white | Carousel, 7 slides (Candidate Intelligence, Job Builder, Relay, Coding Workshop, Execue, Pinr, Ryval). Counter total is computed from the slide count. The three tool slides have numbered screen steps; Candidate Intelligence also has a flow diagram. See Interactions. |
| 04 | `#numbers` | paper | Two headline cards (3,329 hires; 29.4% women in management) with bar charts, a 5-stat hairline row, the representation switcher (`[data-rep]`), "How" note, Maple Leaf Award. Count-up and bar growth run once on scroll (skipped under reduced motion). |
| 05 | `#outside-work` | white | Serif copy + 9-photo cross-fade carousel. |
| — | `#contact` | navy | "Let's talk." left-aligned: email link, Copy email button, back to top. |

The old fixed bottom ticker was removed in the redesign.

---

## Experience timeline

**Left list (static HTML):** roles are grouped by company in `.tl-company` blocks. Each block has a `.tl-company-head` (28px greyscale logo, company name, years) followed by one `button.timeline-role` per role, newest first. A 1px spine (`.timeline-nav::before`) runs through the logos; each role has a dot (`.timeline-role::before`) on it. The selected role gets `aria-selected="true"` → pale blue background, blue left rule, blue title, filled dot. `syncCompanies()` adds `.is-active` to the company block of the selected role so its logo shows in colour. The list is sticky (`top: 92px`) on desktops at least 820px tall.

Buttons keep their `data-role-index`, which must match the order of the `roles` array. Multi-role companies show years on each role row; single-role companies show years only on the company head. Each button carries a `.sr-only` suffix with company (and years) for screen readers, because the company heads are `aria-hidden`.

**Right panel (JS-rendered):** data lives in `const roles = [` near the bottom of `index.html`:

```js
{
  meta, title, summary,
  logo, logoClass, logoAlt, fallback,
  proofs: [['EMEA', 'VP+ leadership searches'], ...],  // 3 value/label pairs
  bullets: [...],                                      // responsibilities
  noteTitle, note                                      // right column
}
```

**Mobile (≤980px):** the panel is hidden; each role button expands an accordion inserted after it (one open at a time, first opened on load).

When adding or renaming a role, update both the list HTML and the `roles` entry.

---

## Interactions

- **Representation switcher** (`[data-rep]`, Numbers): four `.rep-row`s, each carrying `data-value`, `data-delta`, `data-label` and chart positions `--a` / `--b` (/ `--m`) on a 0–40% axis, where position = percentage × 2.5. Buttons with `data-rep-view` highlight a row and update the readout. If a figure changes, update the row's data attributes, its `--a`/`--b`, and its `.rep-vals` text.
- **Screen steps** (`[data-steps]`, AI Work): `.web-step` buttons map by order to `.web-stage img`; the visible image has `.on`. Auto-advances every 6s only while visible and not hovered/focused; no auto-advance under reduced motion.
- **Candidate Intelligence flow** (`.ci-flow`): CSS dot animation, switched on by adding `.run` while the diagram is at least 60% on screen.
- **Copy email** (`[data-copy-email]`): reads the address from the contact `mailto:` link (Cloudflare email obfuscation decodes it on load), falls back to `execCommand('copy')`, and announces the result in `[data-copy-status]`.

---

## Remaining work

- [ ] **Logo quality:** review logos at 28px (timeline) and 64px (panel); replace any that read poorly.

---

## Visual testing

Test at 1440, 768, 390 and 360 widths before every push: no horizontal overflow, no console errors, timeline click/arrow keys, mobile accordion, representation switcher, screen steps, Copy email, Menu button, carousel controls. Any local Playwright install works; load `file:///…/index.html`, wait for `document.fonts.ready`, and use `scrollTo({ behavior: 'instant' })` when measuring positions (the page uses smooth scrolling).

---

## Key technical notes

- **Carousel overflow:** `.ai-carousel` and `.ai-carousel-viewport` have `min-width: 0` — required to prevent horizontal overflow on mobile.
- **Sticky header offset:** `section[id] { scroll-margin-top: 84px }` keeps anchored sections clear of the 68px top bar.
- **Reduced motion:** photo and phone cross-fades show only the first image; screen steps don't auto-advance; the flow dots, line redraws, count-up and bar growth are skipped. Every control still works.
- **No build step:** edit `index.html` directly.

---

## About Lee

Lee Sam is a London-based recruiting leader with twenty years across category-defining tech companies. Most recently at Cloudflare (2018 — July 2026): Recruiter to Manager, Head of Recruiting EMEA, then Executive Recruiting. This site is a creative digital CV — not a developer portfolio. Writing tone should reflect a senior recruiting leader, not an engineer.
