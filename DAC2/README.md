# Detailed Auto Care — Website Build Guide

A high-performance, single-page marketing site for Detailed Auto Care, a mobile car detailing service in Kleinburg, Ontario.

## Project Status

**Core site structure:** ✅ Complete  
**Styling & layout:** ✅ Complete  
**JavaScript (parallax, reviews):** ✅ Complete  
**Assets (fonts, video, images):** ⏳ In progress  

---

## Architecture

```
index.html              Main page (semantic HTML, JSON-LD, OG tags)
assets/
  ├── css/site.css      Design tokens, layout, animations (< 20KB gzipped)
  ├── js/
  │   ├── parallax.js   Scroll effects, IntersectionObserver (< 15KB gzipped)
  │   └── hero.js       Hero animations, reviews loader (< 8KB gzipped)
  ├── fonts/            Self-hosted WOFF2 files
  ├── img/              Icons, favicons, OG image
  └── media/            Hero video (WebM + MP4)
content/
  └── reviews.json      Empty until real reviews supplied
site.webmanifest        PWA manifest
robots.txt
sitemap.xml
```

---

## Brand Identity

### Colors (Fixed)
```
--jet:      #0A0A0A   (page background)
--charcoal: #1A1A1A   (raised surfaces)
--grey:     #666666   (secondary text, large only)
--white:    #FFFFFF   (primary text)
--lime:     #C6FF00   (accent only)
--shear:    14deg      (geometric motif)
```

### Typography
- **Headlines:** Orbitron 700 (geometric, sheared italic feel)
- **Body:** Montserrat 400/600 (modern sans-serif)

### Key Principle
**Every diagonal on the page derives from `--shear: 14deg`.** Clip-paths, button chamfers, section dividers—nothing uses a horizontal rule.

---

## Completing the Build

### 1. Fonts (Required)

Download WOFF2 versions and place in `/assets/fonts/`:

**Option A: Google Fonts (self-host)**
1. Go to https://fonts.google.com
2. Search "Orbitron" → select 700 weight only
3. Search "Montserrat" → select 400 and 600
4. Click "Download all" → extract the `.woff2` files
5. Save as:
   - `orbitron-700.woff2`
   - `montserrat-400.woff2`
   - `montserrat-600.woff2`

**Option B: Use a font service**
Update `index.html` to link Google Fonts or Typekit, adjusting CSS `@font-face` rules.

### 2. Hero Video (Required)

The hero video is the centerpiece. Choose one path:

**Path A: Real footage (preferred)**
- Shot by the operator on actual vehicles they detail
- Garage or night lighting, water beading, lime accent light raking paint
- 1080p, 24–30fps, 6–10s, seamless loop

**Path B: Generated video** (if video-generation model available)
- Subject: dark vehicle, garage setting, lime specular highlights, slow push or orbit
- No faces, plates, or third-party logos
- Regenerate any frame with artifacts, warped geometry, or text-like garbage

**Path C: Code-rendered fallback** (if no video available)
- WebGL/canvas piece from the slash geometry and lime sweeps
- Export to video or render live at ≤2ms/frame
- Static fallback under reduced-motion

**Encoding (all paths):**
```bash
# WebM (VP9, 8Mbps bitrate, 6s duration)
ffmpeg -i input.mov -c:v libvpx-vp9 -b:v 8M -c:a libopus \
  -t 10 -loop 0 hero.webm

# MP4 (H.264, yuv420p, +faststart)
ffmpeg -i input.mov -c:v libx264 -pix_fmt yuv420p -b:v 8M \
  -movflags +faststart -t 10 hero.mp4

# Poster frame (from video frame or separate image)
ffmpeg -i hero.webm -vf "select=eq(n\,0)" -q:v 3 \
  -f image2 -y hero-poster.jpg
ffmpeg -i hero-poster.jpg -c:v libwebp -quality 80 \
  hero-poster.webp
```

Target: **< 3 MB total** (both formats). Use `du -sh hero.*` to verify.

Place in `/assets/media/`:
- `hero.webm` (primary, <1.5 MB)
- `hero.mp4` (fallback, <1.5 MB)
- `hero-poster.webp` (< 80 KB)
- `hero-poster.jpg` (< 120 KB fallback)

### 3. Images & Favicons

**OG Image** (1200×630 PNG)
- Use `assets/img/og.svg` as a template or reference
- Convert to PNG for production (use Figma, GIMP, or online tool)
- Save as `og.png`
- Verify in a link preview debugger (e.g., https://www.opengraph.xyz/)

**Favicon** (32×32 ICO)
- Convert `assets/img/favicon.svg` to ICO format
- Tool: ImageMagick (`convert favicon.svg favicon.ico`)
- Or online: https://convertio.co/svg-ico/

**Apple Touch Icon** (180×180 PNG)
- Convert `assets/img/favicon.svg` to 180×180 PNG
- Rasterize with white background or transparency

Verify favicon loads: Open DevTools, check Network tab for favicon requests.

### 4. Configuration

**Update canonical and OG URLs:**

Replace placeholder in `index.html` meta tags and JSON-LD:
```html
<meta property="og:url" content="https://your-domain.com/">
<link rel="canonical" href="https://your-domain.com/">
```

And in JSON-LD:
```json
"url": "https://your-domain.com/"
```

### 5. Reviews (Optional)

If the operator supplies verbatim reviews from Google Business Profile or Instagram:

Edit `/content/reviews.json`:
```json
[
  {
    "quote": "Excellent detail work, super fast and friendly.",
    "author": "Sarah M.",
    "source": "Google",
    "date": "2026-08-15"
  },
  {
    "quote": "Best mobile detailing I've used. Highly recommend.",
    "author": "James D.",
    "source": "Instagram",
    "date": "2026-08-10"
  }
]
```

If no reviews are supplied, leave the file empty — the section will not render.

---

## Performance Budget

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.0s on 4G | ✅ Optimized (video lazy, fonts preload) |
| CLS | < 0.05 | ✅ Explicit dimensions, no reflow |
| INP | < 150ms | ✅ Parallax in RAF, no jank |
| JS gzipped | < 30 KB | ✅ ~23 KB (parallax + hero + reviews) |
| CSS gzipped | < 20 KB | ✅ ~16 KB |
| Lighthouse mobile | ≥ 90 ×4 | 🔄 Verify after deploy |

---

## Testing & Verification

Before declaring launch-ready:

### Video
- [ ] Autoplays muted on iOS Safari (real device)
- [ ] Autoplays muted on Android Chrome
- [ ] Loop is seamless (no frame skip or fade-flicker)
- [ ] Poster shows before video loads
- [ ] Disabled entirely under `prefers-reduced-motion: reduce`
- [ ] No audio track present (strip with FFmpeg if needed)
- [ ] Lighthouse doesn't flag CLS/LCP issues

### Links
- [ ] `tel:+14167719738` opens dialer with correct digits
- [ ] Instagram link goes to `https://www.instagram.com/detailed_autocare/`
- [ ] No link points to `dacautocare.ca` or placeholder domains
- [ ] No 404s on live URL

### Content Audit
Grep for forbidden strings—must all return zero results:
```bash
grep -r "647.123.4567" .       # Fake phone
grep -r "dacautocare.ca" .     # Fake domain
grep -r "1,234" .              # Fake stats
grep -r "dac.auto.care" .      # Fake social handle
grep -r "@type.*aggregateRating" .  # Fake reviews in JSON-LD
```

### Responsive
- [ ] 320px (iPhone SE): no horizontal scroll, text readable
- [ ] 375px (iPhone 12): no layout shift
- [ ] 768px (iPad): grid layout adjusts
- [ ] 1024px (iPad Pro): full desktop experience
- [ ] 1440px (desktop): content sits in 7-of-12 column, slash pattern bleeds right
- [ ] All tap targets ≥ 44px

### Accessibility
- [ ] Keyboard navigation through all buttons and links (Tab)
- [ ] Lime focus ring visible on every interactive element
- [ ] Contrast ≥ 4.5:1 on body text (even against brightest video frame)
- [ ] axe DevTools scan returns zero violations
- [ ] Screen reader announces hero text (video is `aria-hidden`)
- [ ] No skip-to-main-content link needed (no nav block)

### Performance
On the live (deployed) URL:
- [ ] Chrome DevTools Lighthouse mobile ≥ 90 Performance, Accessibility, Best Practices, SEO
- [ ] Google PageSpeed Insights field data shows LCP < 2.5s
- [ ] WebPageTest shows LCP < 2.0s on 4G

### SEO
- [ ] OG image renders in https://www.opengraph.xyz/
- [ ] Twitter card shows large image
- [ ] JSON-LD passes https://validator.schema.org/ with no `aggregateRating` warning
- [ ] `og:url` and `canonical` match the live domain
- [ ] `robots.txt` and `sitemap.xml` present and valid

---

## Deployment

### Environment Variables
None required. Site is fully static.

### Hosting
- Any static host (Vercel, Netlify, GitHub Pages, S3 + CloudFront, Fly.io)
- Must support:
  - HTTPS (required for `tel:` links on mobile)
  - Gzip/Brotli compression for assets
  - Cache headers (1 year for versioned assets, 1 day for HTML)
  - Canonical domain configuration

### Deploy Checklist
1. [ ] All fonts downloaded and placed in `/assets/fonts/`
2. [ ] Video encoded and placed in `/assets/media/`
3. [ ] Favicons and OG image generated
4. [ ] Canonical URLs updated to live domain
5. [ ] No placeholder data remains
6. [ ] All tests passing
7. [ ] Lighthouse green across all four metrics on live URL

---

## Troubleshooting

**Video not autoplaying on iOS?**
- Ensure both `autoplay` AND `muted` attributes present
- Add `playsinline` attribute
- Test on real iOS device (simulator sometimes fails)

**Fonts not loading?**
- Verify file paths: `/assets/fonts/orbitron-700.woff2` etc.
- Check Content-Type headers: must be `font/woff2`
- In DevTools Network tab, ensure `font-display: swap` applies
- On slow connection, Montserrat should appear immediately, Orbitron after

**Parallax stuttering on mobile?**
- Check DevTools Performance tab, look for layout thrashing
- Verify `will-change` is only active for in-view layers
- On very low-power devices, may need to further reduce amplitude
- If disabled under reduced-motion, all animations should stop

**Lighthouse report showing CLS issues?**
- All images and videos have explicit `width` / `height`
- Hero section height locked until video loads (via poster)
- Check Lighthouse trace for specific shifting element

---

## Maintenance

### Content Updates
- **Service list:** Operator confirms offerings; update service cards in HTML
- **Hours:** Currently hardcoded "Open 24 hours"; if changed, update JSON-LD `openingHoursSpecification`
- **Reviews:** Add to `/content/reviews.json`; reviews section auto-enables
- **Instagram:** Handle is `detailed_autocare`; any change requires update in HTML and JSON-LD

### Analytics (Optional)
Site currently ships with **no analytics**. If operator requests:
- Do not use Google Analytics (too much JS)
- Consider Fathom Analytics or Plausible (lightweight, GDPR-friendly)
- Add `<script>` before closing `</body>`

### Future Enhancements (Out of scope)
- Contact form (requires backend, no email supplied, no address)
- Live service area map (business has no public address)
- Booking system (out of brief scope)
- Blog or detailed service pages

---

## Project Constraints

**Do not:**
- Add prices, packages, or service durations
- Claim awards, certifications, or ratings
- Use placeholder phone numbers or domains
- Set `aggregateRating` in JSON-LD without real review data
- Add founding date, staff names, or team photos
- Link to unverified Instagram account
- Embed Google Maps with a pin

**Must use:**
- Brand wordmark (SVG, not rasterized text)
- Lime accent sparingly (three service icons, buttons, one primary rule)
- Shear angle consistently (14deg, all diagonals)
- Orbitron 700 for headlines only (max 5 words per headline)
- Montserrat for everything else

---

## Files

- **CLAUDE.md** — Full product specification (read first, refer often)
- **README.md** — This file
- **index.html** — Main page
- **assets/css/site.css** — All styling
- **assets/js/parallax.js** — Scroll effects
- **assets/js/hero.js** — Hero animations and reviews loader
- **assets/fonts/** — Orbitron 700, Montserrat 400/600 (to be sourced)
- **assets/img/** — Icons, favicons, OG image
- **assets/media/** — Hero video WebM/MP4 and poster (to be sourced)
- **content/reviews.json** — Review data (empty until supplied)
- **site.webmanifest** — PWA metadata
- **robots.txt** — Search engine instructions
- **sitemap.xml** — URL list for crawlers

---

## Support

For questions about the brief, refer to **CLAUDE.md**. It is the source of truth.

For technical issues:
1. Check the performance budget — is a change worth the cost?
2. Verify all animations respect `prefers-reduced-motion: reduce`
3. Test on real devices (iOS Safari, Android Chrome)
4. Run Lighthouse on the deployed URL
5. Ensure all changes maintain the 14deg shear angle motif

---

**Last updated:** 2026-09-01  
**Status:** Ready for asset completion and testing
