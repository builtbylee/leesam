# leesam.pages.dev — Handover Context

Personal digital CV for Lee Sam. Live at **https://leesam.pages.dev**.

---

## The site

A single-file static site (`index.html`, ~2100 lines). All CSS and JavaScript is inline — no build step, no framework, no dependencies. The `assets/` folder holds images only.

Deploy from the repo root:
```bash
npx wrangler pages deploy . --project-name leesam --branch main --commit-dirty=true
```

---

## File structure

```
index.html          — entire site (HTML + inline CSS + inline JS)
assets/
  logos/            — company logos (PNG + SVG, used in Experience timeline)
  apps/             — app screenshots (used in AI Work carousel)
  outside-work/     — travel and Bucks photos (used in Outside Work carousel)
  awards/
    maple-leaf.png  — Maple Leaf Award image (used in Numbers section)
```

---

## Design system

| Token | Value | Notes |
|---|---|---|
| `--orange` | `#2563eb` | Stripe blue — named `--orange` for historical reasons, don't rename |
| `--ink` | `#0a2540` | Primary text |
| `--muted` | `#425466` | Secondary text |
| `--bg-2` | `#f6f9fc` | Light tinted background |
| `--line` | `#e6ebf1` | Borders |
| `--green` | `#00a884` | Used for YoY pill, live indicator |

**Typography:**
- `Instrument Sans` — headings, UI labels, role titles, stat values
- `Instrument Serif` italic — decorative use only (the word "talk." in the Contact section `<em>` tag)
- `JetBrains Mono` — eyebrows, metadata labels, section counters
- `Manrope` — body/paragraph text, bullet copy, descriptive text

The `section-title em` CSS rule is neutralised (`font-style: normal; color: inherit`) — section titles should be plain Instrument Sans throughout with no italic blue accent.

**Shell:** `min(1320px, calc(100% - 48px))` — 1320px max, centred, 24px gutters each side.

---

## Sections

| # | ID | Notes |
|---|---|---|
| 01 | `#hero` | 2-col grid. Portrait card right. Instrument Serif italic subhead. |
| 02 | `#experience` | Two-pane dossier (JS-driven). Header above dossier; dossier spans full shell width. |
| 03 | `#ai-work` | Carousel, 6 slides (Candidate Intelligence, Job Builder, Relay, Execue, Pinr, Ryval). |
| 04 | `#numbers` | Hero stat 3,329 + bar chart + 4 stat cards + Maple Leaf Award callout. |
| 05 | `#outside-work` | Photo carousel, 9 images. |
| — | `#contact` | "Let's talk." full-width close. |

---

## Experience timeline

The two-pane dossier is built entirely in JavaScript. The data lives in a `roleData` array near the bottom of `index.html` (search for `const roles = [`). Each entry has:

```js
{
  title, meta, summary,
  proofs: [{ value, label }, ...],   // up to 3 — shown in the EMEA/AI/Exec-style grid
  bullets: [...],                     // responsibilities list
  noteTitle, note,                    // right column (AI-era work, or similar)
  logo, logoClass, logoFallback
}
```

The HTML shell for the dossier is static (nav buttons + panel article). JS renders content into `data-role-*` attributes on click.

**Layout:** Left nav is `260px` fixed. Right panel gets the remainder of the 1320px shell. The dossier is placed in its own `<div class="shell">` below the section header — it does NOT sit inside the `.section-grid` layout, so it gets full shell width.

---

## Remaining work

### High priority
- [ ] **Timeline proof grid data**: verify the `proofs` values for each role are accurate. The current Cloudflare current role shows EMEA / AI / Exec as keyword themes — this is correct. Earlier roles (Head of Recruiting, etc.) show hire numbers (318 / 477 / 429) which need updating to match the Numbers section (318 / 477 / 599 for FY23/24/25).
- [ ] **Agentic coding workshop**: Lee co-hosted an agentic coding workshop at Cloudflare's London office in early 2026. Add this to: (a) the AI Work carousel as a new slide, and/or (b) as a bullet in the current Cloudflare role in the timeline. Needs a decision from Lee on placement.

### Medium priority
- [ ] **Timeline mobile UX**: at <980px the dossier stacks to single column (nav on top, panel below). Verify this works cleanly — the nav becomes a horizontal scroll row or stacked list, and the panel renders correctly beneath it.
- [ ] **AI Work carousel — Job Builder and Relay placeholders**: slides exist but content is marked as coming. Fill in when Lee provides copy.
- [ ] **Numbers section roleData**: the `roleData` JS array for the Head of Recruiting role (index 1) references `429` for FY25 hires. Update to `599` to match the Numbers section.

### Low priority
- [ ] **Logo quality**: existing logos at `assets/logos/` are 28px display circles with `object-fit: cover`. The Codex commit added `salesforce-clean.png` and `snap-clean.png`. Review all logos for quality and replace any that look poor at the 52px nav size.
- [ ] **Section transition consistency**: check all section padding/border-top treatments are consistent between `light` and `dark-section` classes.

---

## Visual testing

Playwright is available at `/tmp/node_modules/playwright` (Chromium installed). Write scripts to `/tmp/test-xyz.js` and run:
```bash
node /tmp/test-xyz.js
```

Example to screenshot the experience section:
```js
const { chromium } = require('/tmp/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('file:///path/to/production/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.getElementById('experience').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/screenshot.png' });
  await browser.close();
})();
```

Test at these 5 viewports before every deploy: `1920`, `1440`, `768`, `390`, `360`.

---

## Key technical notes

- **CSS variable `--orange` = Stripe blue `#2563eb`** — do not rename, it is referenced throughout
- **`section-title em`** is neutralised — `font-style: normal; color: inherit` — titles are plain Instrument Sans. Do not re-add italic blue to section titles.
- **Carousel overflow**: `.ai-carousel` and `.ai-carousel-viewport` have `min-width: 0` — required to prevent horizontal overflow on mobile. Do not remove.
- **Section grid vs full-width**: most sections use `<div class="shell section-grid">` (280px label column + content). The Experience section intentionally uses a separate full-width `<div class="shell">` for the dossier — this is deliberate so the two-pane layout isn't starved of width.
- **No build step**: edit `index.html` directly. There is no bundler, no npm install needed to edit the file.

---

## About Lee

Lee Sam is EMEA Leadership Recruiting & AI Innovation lead at Cloudflare (based in London). 18 years in recruiting across category-defining tech companies. This site is a creative digital CV — not a developer portfolio. Writing tone should reflect a senior recruiting leader, not an engineer.
