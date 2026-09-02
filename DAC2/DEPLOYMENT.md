# DEPLOYMENT GUIDE

## Current Status

✅ **Complete:**
- HTML structure with semantic markup, JSON-LD, meta tags
- CSS styling system with design tokens and responsive layout
- JavaScript (parallax, hero animations, reviews loader)
- SVG icons and wordmark
- Supporting files (robots.txt, sitemap.xml, site.webmanifest, reviews.json)
- Font loading (Google Fonts CDN)

⏳ **Still Required:**
- Hero video files (WebM + MP4)
- Hero poster frame (WebP + JPEG)
- OG image conversion (SVG → PNG)
- Favicon generation (SVG → ICO + 180px PNG)
- Domain configuration
- Production deployment

---

## Pre-Deployment Checklist

### 1. Video Assets

#### Hero Video Production
- [ ] Video content obtained (real footage or generated)
- [ ] Video meets specifications:
  - ✓ 1080p or higher
  - ✓ 24–30 fps
  - ✓ 6–10 seconds duration
  - ✓ Seamless loop (first and last frames match)
  - ✓ No audio track
  - ✓ Subject: Dark vehicle, night/garage lighting, water beading, lime accent light

#### Video Encoding
```bash
# WebM (VP9, targeted for < 1.5 MB)
ffmpeg -i input.mov -c:v libvpx-vp9 -b:v 6M -tile-columns 2 \
  -threads 4 -an -t 10 hero.webm

# MP4 (H.264 for Safari compatibility)
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 \
  -pix_fmt yuv420p -movflags +faststart -an -t 10 hero.mp4

# Verify sizes
ls -lh hero.webm hero.mp4  # Should be < 3 MB total
```

#### Hero Poster Frame
```bash
# Extract first frame as WebP (< 80 KB)
ffmpeg -i hero.webm -vf "select=eq(n\,0)" -q:v 3 \
  -f image2 hero-poster.webp

# Create JPEG fallback (< 120 KB)
ffmpeg -i hero-poster.webp -q:v 7 hero-poster.jpg
```

Files to place in `/assets/media/`:
- `hero.webm`
- `hero.mp4`
- `hero-poster.webp`
- `hero-poster.jpg`

**Checklist:**
- [ ] `hero.webm` exists and is < 1.5 MB
- [ ] `hero.mp4` exists and is < 1.5 MB
- [ ] `hero-poster.webp` exists and is < 80 KB
- [ ] `hero-poster.jpg` exists and is < 120 KB
- [ ] Video autoplays muted on iOS Safari (test on real device)
- [ ] Video autoplays muted on Android Chrome
- [ ] Poster shows on reduced-motion or slow connection
- [ ] No visible loop seam

### 2. Image Assets

#### OG Image (1200×630 PNG)
Convert `assets/img/og.svg` to PNG using one of:
- Figma: Export as PNG
- Sketch: Export as PNG
- Online: https://convertio.co/svg-png/
- CLI: `inkscape og.svg -w 1200 -h 630 -o og.png`
- Or use GIMP, Photoshop, etc.

**Checklist:**
- [ ] `assets/img/og.png` exists (1200×630)
- [ ] File size < 150 KB
- [ ] Preview shows in https://www.opengraph.xyz/
- [ ] Wordmark and tagline are readable

#### Favicon (32×32 ICO)
Convert `assets/img/favicon.svg` to ICO:
- Online: https://convertio.co/svg-ico/
- Or use ImageMagick: `convert favicon.svg -define icon:auto-resize=32 favicon.ico`

**Checklist:**
- [ ] `assets/img/favicon.ico` exists (32×32)
- [ ] File size < 5 KB
- [ ] Shows in browser tab when deployed

#### Apple Touch Icon (180×180 PNG)
Convert `assets/img/favicon.svg` to 180×180 PNG:
- Online tool or CLI: `ffmpeg -i favicon.svg -vf scale=180:180 apple-touch-icon.png`

**Checklist:**
- [ ] `assets/img/apple-touch-icon.png` exists (180×180)
- [ ] File size < 20 KB
- [ ] Shows on iOS home screen (test on real device)

### 3. Configuration

#### Domain Setup
- [ ] Domain name registered and DNS configured
- [ ] SSL certificate installed (HTTPS required)
- [ ] Update canonical URLs in `index.html`:
  ```html
  <link rel="canonical" href="https://your-domain.com/">
  <meta property="og:url" content="https://your-domain.com/">
  ```
- [ ] Update JSON-LD `url` field to match domain

#### Environment Verification
- [ ] No placeholder text in HTML (search for "YOUR NAME", "dac.auto.care", "dacautocare.ca")
- [ ] No fake phone numbers (647.123.4567 should not appear)
- [ ] Correct phone number (416) 771-9738 in all places
- [ ] Instagram handle is `detailed_autocare` (not `dac.auto.care`)
- [ ] No review text in source (stays in `/content/reviews.json` only)

### 4. Content Verification

**Search and verify zero results for:**
```bash
grep -r "647.123.4567" .          # Fake phone
grep -r "dacautocare\.ca" .       # Fake domain
grep -r "dac\.auto\.care" .       # Fake handle
grep -r "1,234" .                 # Fake stats
grep -r "award" -i .              # No awards
grep -r "best" -i .               # No superlatives
grep -r "certified" -i .          # No certifications
grep -r "founder" -i .            # No founder name
grep -r "aggregateRating" .       # No fake ratings
```

### 5. Responsive & Accessibility Testing

Test on real devices:

| Device | Width | Tested | Notes |
|--------|-------|--------|-------|
| iPhone SE | 375px | [ ] | Text readable, no scroll |
| iPhone 12 | 390px | [ ] | Parallax smooth |
| iPad | 768px | [ ] | Grid adjusts |
| iPad Pro | 1024px | [ ] | Desktop experience |
| Desktop | 1440px | [ ] | Full layout |
| Large Monitor | 1920px | [ ] | Accent pattern visible |

**Accessibility Checklist:**
- [ ] Keyboard Tab navigation works through all links
- [ ] Lime focus ring visible on all interactive elements
- [ ] No horizontal scroll at any width
- [ ] Tap targets ≥ 44px
- [ ] Screen reader announces hero text (video `aria-hidden`)
- [ ] Contrast ≥ 4.5:1 against brightest video frame
- [ ] `prefers-reduced-motion: reduce` → video hidden, all animations off
- [ ] `navigator.connection.saveData` → video not loaded

### 6. Performance Testing

On the live (deployed) URL:

```bash
# Lighthouse CLI
npm install -g @lhci/cli@latest
lhci autorun --config lhci.config.json

# Or test in Chrome DevTools:
# F12 → Lighthouse → Analyze page load (mobile)
```

**Targets:**
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90
- [ ] LCP < 2.0s (Largest Contentful Paint)
- [ ] CLS < 0.05 (Cumulative Layout Shift)
- [ ] INP < 150ms (Interaction to Next Paint)

**Common Issues:**
- If LCP > 2s: hero video loading slow → use WebP poster, lazy-load video
- If CLS > 0.05: check hero section height, video poster dimensions
- If Performance < 90: check JS bundle size, CSS size, image optimization

### 7. SEO Verification

- [ ] Title tag: "Detailed Auto Care — Mobile Car Detailing in Kleinburg" (≤ 60 chars)
- [ ] Meta description: "Mobile car detailing..." (≤ 155 chars)
- [ ] OG image renders in https://www.opengraph.xyz/
- [ ] OG title, description, image all present
- [ ] Twitter card shows large image
- [ ] JSON-LD passes https://validator.schema.org/ (no warnings)
- [ ] No `aggregateRating` in JSON-LD (unless real reviews supplied)
- [ ] `robots.txt` present and valid
- [ ] `sitemap.xml` present and references correct domain
- [ ] Canonical URL matches live domain

### 8. Video Playback Testing

**Desktop:**
- [ ] Chrome: muted autoplay works
- [ ] Firefox: muted autoplay works
- [ ] Safari: muted autoplay works
- [ ] Edge: muted autoplay works

**Mobile:**
- [ ] iOS Safari: muted autoplay works (test on real iPhone)
- [ ] Android Chrome: muted autoplay works (test on real Android)
- [ ] Poster shows before video loads
- [ ] Under 4G, video doesn't block page load (uses `preload="metadata"`)

**Reduced Motion:**
- [ ] `prefers-reduced-motion: reduce` → video hidden
- [ ] Browser inspector: `navigator.connection.saveData` → video hidden
- [ ] Poster image shows instead

### 9. Link Verification

Test each link:
- [ ] `tel:+14167719738` → opens dialer with correct number
- [ ] Instagram link → https://www.instagram.com/detailed_autocare/
- [ ] Header logo → home page
- [ ] Hero button → dialer
- [ ] Service "Call for details" links → dialer
- [ ] Footer phone → dialer
- [ ] Footer Instagram → Instagram profile
- [ ] No 404 errors in Network tab

### 10. Final Review

**Core Brand:**
- [ ] Every diagonal on page is 14deg (clip-paths, button chamfers, section dividers)
- [ ] Lime (#C6FF00) used only for: service icons, call-to-action button, accent rules, focus rings
- [ ] No lime used as large background or body text
- [ ] Orbitron 700 used only for headlines (never body or nav)
- [ ] No "award-winning," "trusted," "certified," "5-star," or similar claims
- [ ] No fabricated statistics or fake social proof

**Content Accuracy:**
- [ ] Business name: "Detailed Auto Care" (not abbreviated)
- [ ] Service area: "Kleinburg and surrounding areas"
- [ ] Hours: "Open 24 hours"
- [ ] Phone: (416) 771-9738 (formatted with parens and space)
- [ ] Instagram: @detailed_autocare
- [ ] No street address (mobile service)
- [ ] No email (not supplied)
- [ ] No prices, turnaround times, or package tiers

**File Sizes (Production):**
- [ ] CSS gzipped < 20 KB
- [ ] JS gzipped < 30 KB
- [ ] Hero video total < 3 MB
- [ ] OG image < 150 KB
- [ ] All images optimized (WebP with fallback)

---

## Deployment Steps

1. **Build & Test Locally**
   - All checklist items passing
   - Lighthouse green on `localhost`

2. **Prepare Assets**
   - Video encoded and optimized
   - Images converted and optimized
   - All files ready in `/assets/`

3. **Deploy to Staging**
   - Push to staging URL
   - Run Lighthouse on staging URL
   - Manual testing on staging domain

4. **Final Verification**
   - Run Lighthouse on production URL
   - Test on real iOS device (iPhone)
   - Test on real Android device
   - Verify all links and social handles
   - Verify no placeholder data in source

5. **Go Live**
   - Update DNS if needed
   - Verify canonical URLs
   - Monitor Lighthouse trends (Google Console)
   - Collect real reviews and add to `/content/reviews.json`

---

## Hosting Providers (Tested)

### Zero-Config (Recommended)
- **Vercel** (Next.js, but works with static)
- **Netlify** (drag-and-drop, automatic optimizations)
- **Fly.io** (global CDN, auto HTTPS)

### Manual Setup
- **GitHub Pages** (free, custom domain)
- **AWS S3 + CloudFront** (enterprise, pay-per-use)
- **DigitalOcean App Platform** (simple VPS)
- **Heroku** (simple, limited free tier)

All support:
- HTTPS (required for `tel:` links)
- Gzip compression
- Cache headers
- Custom domains

---

## Support & Troubleshooting

**Video not autoplaying?**
→ Ensure `autoplay`, `muted`, and `playsinline` all present
→ Test on real device (simulator sometimes fails)
→ Check browser autoplay policy (Chrome requires muted)

**Fonts not loading?**
→ Google Fonts CDN requires internet connection
→ For offline: download fonts and self-host (see README.md)
→ Check DevTools Network tab for CORS or 404 errors

**Parallax stuttering?**
→ Check DevTools Performance for layout thrashing
→ Verify `will-change` only applied to in-view layers
→ On slow devices, reduce amplitude or disable

**Lighthouse issues?**
→ LCP: Ensure video preload, poster size < 120 KB
→ CLS: Check hero section height lock, explicit dimensions
→ INP: Verify no scroll event handlers, only RAF loop

---

**Deployment Ready:** Check all items above, then proceed to hosting platform.  
**Status:** Core site complete. Awaiting video, images, and domain configuration.  
**Estimated Completion:** After video production and image asset creation.
