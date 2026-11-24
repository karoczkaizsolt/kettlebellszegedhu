# Milestone 04 – Optimization & QA

Status: **approved and closed by the design owner.** Decisions: JSON-LD name stays "Kettlebell Szeged"; no invented address/opening hours (only real data is published); eyebrow colour stays `#807369`; Spline renderer decision unchanged ("Both" with the existing fallback). Tested in headless Chrome (software WebGPU); Safari and real phones were not available.

## SEO and metadata
- **Title / description:** unchanged texts from the page (`src/pages/index.astro`); one `<h1>` (hero), `lang="hu"`, `<main>` landmark, all images have `alt`, all buttons/links have an accessible name (checked in the browser).
- **Open Graph / Twitter:** `og:type/locale/site_name/title/description/image(+size, alt)`, `twitter:card summary_large_image` + title/description/image/alt, all in `src/layouts/Base.astro`. Image: `assets/og-image.png` (1200×630, design owner's file, synced to `/img/og-image.png`). `og:url` and canonical only in production.
- **Icons:** `assets/favicon.svg` and `favicon.png` (200×200), `apple-touch-icon.png` is a 180×180 version derived from `favicon.png` (`assets/apple-touch-icon.png`, original untouched); the former `favicon.ico` 404 in the console is gone.
- **Structured data (JSON-LD):** `SportsActivityLocation` "Kettlebell Szeged" with description, image, telephone, e-mail, founding year 2008 ("2008 óta" on the page), area served Szeged, founder Varga Tamás (SFG instruktor). `url` only in production. No address, opening hours, prices or ratings (none verified/provided).
- **robots.txt / sitemap.xml** are generated per environment (`src/seo/*.ts`, routes injected in `astro.config.mjs`):
  - demo: `robots.txt` = `User-agent: *` / `Allow: /` (crawlable, no sitemap line), no `sitemap.xml`, `<meta name="robots" content="noindex, nofollow">`, no canonical, no `og:url`, JSON-LD without url, `og:image` relative unless `PUBLIC_SITE_URL` is set (new optional variable, `.env.example`).
  - production: no noindex, canonical + `og:url` + JSON-LD url `https://kettlebellszeged.hu/`, `robots.txt` with `Sitemap: https://kettlebellszeged.hu/sitemap.xml`, `sitemap.xml` with the one URL.
  - Verified by building both (`PUBLIC_ENV=demo|production`) and inspecting the output. The switch is configuration only.
- **X-Robots-Tag header** for the demo: depends on the hosting (not known); the meta tag is in place. Add `X-Robots-Tag: noindex, nofollow` in the host config if it supports custom headers.

## Performance
- **Video.js stylesheet (46 KB, render-blocking) and the video poster (54 KB)** were requested on every page load; both are now loaded only when the modal is first opened or warmed up (`VideoModal.astro`). The initial page now loads one stylesheet (28 KB), 3 preloaded fonts, the avatar and icons; no JS bundle larger than the page's own scripts before the first paint; the Spline runtime still loads after the first render; no video request before the modal opens (0 `.mp4` requests measured).
- Measured on the production-like preview (desktop 1280×834 and phone 393×852): CLS 0, DOM content loaded about 60–80 ms, no horizontal overflow, no console errors or warnings. (The headless first-paint/LCP value of about 3 s is dominated by the software-rendered scene and the test harness, not a reliable figure; a real-device Lighthouse run is recommended.)
- Fonts: self-hosted, `font-display: swap`, the three used files preloaded.

## Accessibility
- Landmarks/headings/names as above; visible focus styles exist (`:focus-visible`); modal: native `<dialog>`, focus return, ESC, scroll lock, keyboard-reachable volume slider (Phase 03); `prefers-reduced-motion` handled for the CSS transitions, label stagger, tab nudge and modal.
- Contrast: light-gray text on black 15.9:1, caption 14.9:1, grey logo/eyebrow/duration on black 5.4:1, panel text black on orange 5.6:1, promo text 10.6:1. In the active state the eyebrow (`#807369` Figma colour) measures about 3.9:1 against the scene's brown backdrop; it is a large bold heading, but below 4.5:1 – a design-owner decision (the colour is taken from Figma).

## Repository checks
- No video file in the Git history (`git log --all` searched for all video extensions: none); pre-commit and `check-no-video` guard in place.
- `astro check`: 0 errors, 0 warnings, 0 hints; production and demo builds succeed.

## Open items
- Safari and real touch devices (tap toggle, volume tap, WebGPU colours) not tested; Spline "Both"/WebGL re-export still outstanding (browsers without WebGPU get the static fallback).
- Business name in JSON-LD ("Kettlebell Szeged", taken from the domain and the video caption) and a postal address / opening hours need the owner's confirmation before they can be published.
- Demo URL and the separate video upload per environment (see `docs/01-audit-and-setup.md`).
