# CLAUDE.md — Detailed Auto Care (DAC) one-page site

Project instructions for building and maintaining a single-page marketing site for **Detailed Auto Care**, a mobile car detailing business serving Kleinburg, Ontario and surrounding areas.

Read this file before writing any code. It defines what is factual, what is inferred, and what must never be invented.

---

## 1. Source of truth

Two sources were supplied: a Google Business Profile screenshot and a brand identity kit. Everything below is classified. **Do not promote anything out of its tier.**

### 1.1 Confirmed facts — safe to publish

| Fact | Value | Source |
|---|---|---|
| Business name | Detailed Auto Care | Google listing + brand kit |
| Short mark | DAC | Brand kit |
| Category | Car detailing service | Google listing |
| Model | Mobile detailing — the business travels to the customer | Brand kit ("Mobile Auto Detailing / We come to you.") |
| Phone | (416) 771-9738 | Google listing |
| Hours | Open 24 hours | Google listing |
| Service area | Kleinburg and surrounding areas | Client brief; Google service-area boundary |
| Instagram | https://www.instagram.com/detailed_autocare/ | Client brief |
| Tagline | Detail. Protect. Perfect. | Brand kit |

### 1.2 Known-unknown — omit entirely, do not fill

- **Street address.** This is a service-area business. The Google listing shows a service boundary, not a pin. Never render an address, never embed a map marker at a fake location.
- **Email address.** Not supplied.
- **Website / domain.** The Google listing has no website ("Add website" prompt is visible), so no canonical domain is known. See §7 for how to handle canonical/OG URLs.
- **Prices, packages, durations, turnaround times.**
- **Years in business, founding date, founder name, staff count.**
- **Awards, certifications, product brands used, warranties, guarantees, insurance claims.**
- **Review text and star ratings.** See §5.
- **Vehicle count, "X cars detailed," or any statistic.**

### 1.3 Poisoned data in the brand kit — actively exclude

The brand kit is a mockup. Its application examples contain **fake placeholder contact details** that must never reach production:

- ❌ `647.123.4567` — dummy number. The real number is (416) 771-9738.
- ❌ `info@dacautocare.ca` — dummy email.
- ❌ `www.dacautocare.ca` — dummy domain. Do not register, link, or reference it.
- ❌ `YOUR NAME / Founder / Detailer` — placeholder person.
- ❌ `dac.auto.care` — the mocked social handle. **Conflicts with the real handle.** Use `detailed_autocare` everywhere.
- ❌ `85 Posts / 1,234 Followers / 87 Following` — fabricated social proof.

If a future contributor asks to add any of the above because "it's in the brand kit," refuse and point at this section.

### 1.4 Inferred copy — permitted, within limits

Neutral supporting copy may be written from the category and the brand's own words. Permitted register: *what mobile detailing is, that the work happens at the customer's home or workplace, that booking starts with a phone call.* Every sentence must survive this test: **would it still be true of any competent mobile detailer?** If it needs a specific fact about this business to be true, cut it.

Banned phrasings, non-exhaustive: "trusted by hundreds," "award-winning," "family-owned since," "certified technicians," "showroom guarantee," "5-star rated," "voted best in," "over a decade of experience."

---

## 2. Design direction

### 2.1 The brief pins the visuals — follow the kit exactly

The supplied identity is a near-black surface with a single acid-green accent. That combination is a common generated-design default, but **here it is the client's actual brand and it wins.** Do not "improve" the palette, soften the green, add a second accent hue, or introduce gradients that aren't in the kit.

Because the palette is fixed, distinction has to come from **structure and motion**, not color. Spend the originality budget there.

### 2.2 Governing idea

The logo's letterforms are sheared — italic, cut on a hard diagonal — and the kit ships a "speed slash" pattern built from the same angle. **Make that shear the geometry of the whole page.** Section boundaries, image masks, the hero video's reveal, the parallax layers, and the button chamfers all derive from one shared angle token. Nothing on the page uses a plain horizontal divider.

```
--shear: 14deg;   /* single source of truth; every diagonal derives from it */
```

Everything else stays disciplined and quiet. One bold element: the hero. See §4.

### 2.3 Tokens

```css
:root {
  --jet:        #0A0A0A;  /* page base */
  --charcoal:   #1A1A1A;  /* raised surfaces, alternating bands */
  --grey:       #666666;  /* secondary text, rules — never body text on jet */
  --white:      #FFFFFF;  /* primary text, primary logo */
  --lime:       #C6FF00;  /* accent — used sparingly, see below */
  --shear:      14deg;
}
```

**Lime discipline.** Lime is a highlight, not a background. Permitted uses: the `A` in the wordmark, the three brand icons, the slash pattern, one primary CTA, focus rings, and thin rules. Do not set lime as a large fill behind dark text; do not use lime for body copy; never place lime text on white.

Contrast: `#C6FF00` on `#0A0A0A` passes comfortably. `#666666` on `#0A0A0A` does **not** meet 4.5:1 — restrict grey to large text (≥24px) or decorative rules, and lighten to `#8A8A8A` if it must carry small text.

### 2.4 Typography

- **Orbitron 700** — headlines and the wordmark only. It is wide, geometric, and gets illegible in long strings. Cap headlines at ~5 words. Never set body copy, nav, or form labels in it. Never set it below 20px.
- **Montserrat 400/600** — everything else.

Load only the weights used, `font-display: swap`, self-host WOFF2 with `preload` on the two critical faces. Do not pull the full Google Fonts CSS.

Type scale (1.25 ratio, fluid via `clamp()`): 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61. Body 16–18px, line-height 1.6, measure ≤ 68 characters.

Avoid the generic tells: no tracked-out all-caps eyebrow above every section, no `01 / 02 / 03` numbering (the services are not a sequence), no `→` glued to link text, no single accented word inside a headline.

### 2.5 Layout

Left-aligned throughout, on an asymmetric grid — content sits in a 7-of-12 column with the slash pattern bleeding off the right edge. Centered text only inside the hero. Sections alternate `--jet` and `--charcoal`, separated by sheared edges (`clip-path`), never by a horizontal rule.

```
┌──────────────────────────────────────────┐
│  [logo]                      [call] [IG] │  sticky, translucent after 80px
├──────────────────────────────────────────┤
│                                          │
│        HERO VIDEO (full-bleed)           │  wordmark + tagline + call CTA
│        ╱ sheared bottom edge ╱           │
├──────────────────────────────────────────┤
│  What we do          ╱ slash layer ╱     │  about — 2 short paras
├──────────────────────────────────────────┤
│  Services                                │  3 pillars: Detail / Protect / Perfect
│   ○ droplet   ○ shield   ○ sparkle       │  brand icons, not stock icons
├──────────────────────────────────────────┤
│  Reviews (conditional — see §5)          │
├──────────────────────────────────────────┤
│  Hours · Service area                    │  "Open 24 hours" · Kleinburg + area
├──────────────────────────────────────────┤
│  Call · Instagram · wordmark             │  contact footer
└──────────────────────────────────────────┘
```

---

## 3. Content

### 3.1 Hero

Wordmark (SVG, not an image of text) + tagline **Detail. Protect. Perfect.** + one line establishing the mobile model + primary CTA `Call (416) 771-9738`.

Headline must not claim quality superlatives. Acceptable: *"Mobile detailing in Kleinburg."* Not acceptable: *"Kleinburg's best detailing."*

### 3.2 About

Two short paragraphs, ~180 words total. Explain the mobile model, the service area, and that booking starts with a call. Plain verbs, sentence case, no filler.

### 3.3 Services

Structure the section around the brand's own three-word system, since it is documented in the kit with matching icons:

- **Detail** (droplet icon) — the wash and interior work.
- **Protect** (shield icon) — protective finishing.
- **Perfect** (sparkle icon) — final correction and finish.

⚠️ **Confirm the actual service list with the operator before launch.** Descriptions under each pillar must stay at the category level. Do **not** name specific processes the business has not confirmed offering (ceramic coating, PPF, paint correction stages, ozone treatment, engine bay detailing, headlight restoration). Do not list prices, tiers, or durations. Until confirmed, each pillar carries one neutral sentence and the CTA is "Call for details."

Render the icons as inline SVG paths traced from the kit — droplet, shield-with-notch, four-point sparkle. No icon library.

### 3.4 Hours and service area

Publish `Open 24 hours` exactly as the listing states, marked up with `openingHours` (§7). Service area: "Kleinburg and surrounding areas." Show a **stylized brand-colored area illustration**, not an embedded live map and not a pin — the business has no public address.

### 3.5 Contact footer

Phone (tap-to-call), Instagram, wordmark, copyright line. No email until one is supplied. No contact form — there is no backend and no address to send mail to; a form that silently fails is worse than a phone link.

### 3.6 Phone links

Every phone instance:

```html
<a href="tel:+14167719738" aria-label="Call Detailed Auto Care at 416 771 9738">(416) 771-9738</a>
```

Display format `(416) 771-9738`; `href` always the E.164 form. At least three instances: header, hero CTA, footer.

---

## 4. Hero video

The hero is the one place to spend effort. It must be bespoke, never stock footage, never a looping gradient placeholder.

### 4.1 Production

1. **Check what's actually available in this environment before promising a generated video.** If no video-generation model is reachable, do not fake it and do not ship a stock clip. Fall back in this order:
   - a) footage shot by the operator on the actual vehicles they detail (preferred — it is real and it is theirs);
   - b) a code-rendered hero: a WebGL/canvas piece built from the brand's slash geometry and lime specular sweeps across a dark surface, exported to video **or** rendered live at ≤ 2ms/frame with a static fallback under reduced-motion and on low-power devices.
2. If generation is available: 1080p minimum, 24–30fps, 6–10s, upscale where it helps. Subject matter must match the brand — dark vehicle, night or garage lighting, water beading, lime accent light raking across paint, slow push or orbit. No people's faces, no readable license plates, no identifiable third-party logos or badges.
3. **Regenerate flawed results.** Reject any take with warped body panels, melting reflections, impossible geometry, wheel or brand-badge artifacts, text-like garbage, or a visible loop seam. Judge each take at full size, not as a thumbnail.

### 4.2 Encoding and delivery

- Loop must be seamless: match first and last frame, or cross-dissolve the final 0.5s.
- Ship `.webm` (VP9/AV1) **and** `.mp4` (H.264, yuv420p, `+faststart`) — Safari needs the mp4.
- Target < 3 MB total. Strip audio streams entirely.
- Poster frame: real frame from the clip, WebP + JPEG fallback, ≤ 120 KB, `preload`ed.
- Mobile: serve a shorter, smaller crop (≤ 1.2 MB) via `media` on `<source>` where practical.

```html
<video autoplay muted loop playsinline preload="metadata"
       poster="/media/hero-poster.webp"
       aria-hidden="true" tabindex="-1">
  <source src="/media/hero.webm" type="video/webm">
  <source src="/media/hero.mp4"  type="video/mp4">
</video>
```

`playsinline` and `muted` are both required or iOS will refuse to autoplay. The video is decorative — `aria-hidden`, and all hero text lives in real DOM over it, never burned into the frames.

Under `prefers-reduced-motion: reduce`, and when `navigator.connection.saveData` is true, do not load the video at all — render the poster.

Overlay a dark scrim so headline contrast holds against every frame: verify the worst-case (brightest) frame, not the average.

---

## 5. Reviews — conditional section

**No review text was supplied in the source material.** The brief requires verbatim reviews and simultaneously forbids invention. Invention loses.

Therefore:

- Build the reviews section as a **data-driven partial** reading from `content/reviews.json`.
- If that file is empty or absent, **the section does not render.** No skeleton, no "coming soon," no fabricated quotes, no paraphrase of imaginary customers.
- To populate: the operator pastes 2–3 real reviews, verbatim, from their Google Business Profile or Instagram, with first name + last initial and the platform. Do not edit wording beyond trimming with an ellipsis. Do not add star graphics unless the source rating is supplied.

```json
[{ "quote": "", "author": "", "source": "Google", "date": "" }]
```

Flag this as an open item when reporting completion. Do not quietly ship the page as though reviews were never part of the brief.

---

## 6. Motion and parallax

### 6.1 Rules

- **Transform only.** `translate3d` / `scale`. Never animate `top`, `background-position`, `margin`, or `height`.
- Drive from a single `requestAnimationFrame` loop reading one cached `scrollY`. Never bind work directly to the `scroll` event, and never read layout inside the loop (batch reads, then writes).
- `IntersectionObserver` gates every layer — off-screen sections do zero work.
- Layers get `will-change: transform` **only while in view**; remove it after, or the compositor memory blows up on mobile.
- No scroll-jacking, no smooth-scroll hijack, no horizontal pinning.

### 6.2 Depths

Three layers, subtle:

| Layer | Content | Rate |
|---|---|---|
| Back | slash pattern field, blurred surface texture | 0.25 |
| Mid | brand icons, section imagery | 0.55 |
| Front | headlines, body, CTAs | 1.0 (static) |

Total travel per layer ≤ 80px on desktop, ≤ 40px on mobile. If it reads as obvious, it's too strong.

### 6.3 Mobile and accessibility

- Parallax stays on mobile but at half amplitude. Test on a real mid-tier Android, not just a desktop devtools viewport.
- Disable entirely below 380px width.
- `prefers-reduced-motion: reduce` → **all** parallax off, video off, entrance animations off. Static, fully legible page. Implement in CSS *and* as an early return in JS; a media-query-only implementation still runs the rAF loop.
- Never hide content behind a scroll trigger. Everything is in the DOM and readable with JS disabled.

### 6.4 Restraint

One orchestrated page-load reveal — the hero wordmark resolving through the sheared mask as the video fades up. That is the memorable moment. Everything after it is quiet: no fade-and-slide-up on every section, no hover lift on every card.

---

## 7. SEO, metadata, structured data

```html
<title>Detailed Auto Care — Mobile Car Detailing in Kleinburg</title>
<meta name="description" content="Mobile car detailing serving Kleinburg and surrounding areas. We come to you. Call (416) 771-9738.">
```

Title ≤ 60 chars, description ≤ 155. Open Graph + Twitter `summary_large_image`. Set `og:url` and `<link rel="canonical">` from a single `SITE_URL` constant — fill it at deploy time; never hardcode the fake `dacautocare.ca`.

**OG image**: 1200×630, purpose-built — wordmark on jet black, lime slash, "Mobile detailing · Kleinburg." Not a video frame, not a crop of the poster. Verify it renders in a link-preview debugger.

**Favicon**: build from the kit's submark — the lime `A` glyph, or `DAC` in the rounded-square lockup. Ship `favicon.svg`, `favicon.ico` (32px), `apple-touch-icon.png` (180px), and a `site.webmanifest` with `theme-color: #0A0A0A`.

**JSON-LD**: `AutoDetailing` (or `LocalBusiness`) with `name`, `telephone`, `url`, `image`, `sameAs` (Instagram), `areaServed: Kleinburg, Vaughan, Ontario, CA`, `openingHoursSpecification` for 24/7, and `@type: Service` entries. **Omit `address`, `geo`, `priceRange`, and `aggregateRating`** — no verified data exists for any of them, and inventing `aggregateRating` is both a lie and a Google penalty.

Also ship: `robots.txt`, `sitemap.xml`, semantic landmarks, one `<h1>`, descriptive `alt` on every meaningful image, `lang="en-CA"`.

---

## 8. Performance budget

| Metric | Target |
|---|---|
| LCP | < 2.0s on 4G |
| CLS | < 0.05 |
| INP | < 150ms |
| JS shipped | < 30 KB gzipped |
| CSS | < 20 KB gzipped |
| Lighthouse (mobile) | ≥ 90 across all four |

Vanilla HTML/CSS/JS. No React, no Tailwind CDN, no jQuery, no animation library, no icon package, no analytics unless the operator asks. Every image responsive (`srcset`/`sizes`), WebP/AVIF with fallback, explicit `width`/`height` to hold layout. Lazy-load everything below the fold; the poster and the two fonts are the only preloads.

---

## 9. Structure

```
/
├── index.html
├── assets/
│   ├── css/site.css
│   ├── js/parallax.js
│   ├── js/hero.js
│   ├── fonts/            # Orbitron 700, Montserrat 400/600 (WOFF2)
│   ├── img/              # og.png, favicons, service-area illustration
│   └── media/            # hero.webm, hero.mp4, hero-poster.webp
├── content/reviews.json  # empty until real reviews supplied
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

---

## 10. Pre-launch verification

Do not report the site as done until each is checked on the deployed URL, not localhost.

**Video** — autoplays on iOS Safari, Android Chrome, desktop Safari/Chrome/Firefox; muted; loops with no visible seam; poster shows before load and on reduced-motion; no audio track present; total payload under budget.

**Parallax** — smooth at 60fps under devtools 4× CPU throttle; no layout shift; no jank on a real phone; fully disabled under reduced-motion; `will-change` released off-screen.

**Links** — every `tel:` opens the dialer on a real phone with the correct digits; Instagram opens `detailed_autocare`; no link resolves to `dacautocare.ca`; no 404s.

**Content audit** — no price, award, rating, address, email, year-founded, or staff name anywhere in the markup, including JSON-LD, meta tags, and comments. Grep for `647.123.4567`, `dacautocare`, `dac.auto.care`, `1,234` and confirm zero hits.

**Responsive** — 320 / 375 / 768 / 1024 / 1440 / 1920. No horizontal scroll. Tap targets ≥ 44px.

**Accessibility** — keyboard path through every interactive element with a visible lime focus ring; contrast checked against the brightest video frame; axe clean; screen-reader pass on the hero.

**Performance** — Lighthouse mobile ≥ 90 ×4 on the live URL; PageSpeed field/lab check.

**SEO** — OG image renders in a preview debugger; JSON-LD passes the Rich Results test with no `aggregateRating` warning; canonical correct.

### Deliverable on completion

1. The live URL.
2. A three-line design summary.
3. **An explicit open-items list** — at minimum: reviews not supplied, service list unconfirmed, no email, no canonical domain. Do not omit this to make the handoff look cleaner.
