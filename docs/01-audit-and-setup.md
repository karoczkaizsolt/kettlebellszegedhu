# 01 – Audit & Setup

Status: audit complete; milestone 02 has been implemented (see `docs/02-layout-and-design.md`). Updated in milestone 02 with the WebGPU finding.

## Repository state

- `/Users/zsoltkaroczkai/ADAT/Work/VT kbell/KB-coding` is **not** a Git repository (no `.git`).
- Contents: `assets/`, `preview/` (Figma exports), `CLAUDE.md`, `.gitignore` and this `docs/` folder.
- No `package.json`, no source code, no build system, no SEO configuration exist yet.
- Remote: `https://github.com/karoczkaizsolt/kettlebellszegedhu.git`. `git ls-remote` returned no refs, so it appears to be empty (the GitHub CLI is not authenticated, so contents could not be listed).
- Approved baseline stack: Astro + TypeScript, static output (see `CLAUDE.md` section 3).
- Tools on this machine: Node 25.2.1, npm 11.6.2, ffmpeg/ffprobe, cwebp.

## Asset list

| Asset | Status | Details / action |
|---|---|---|
| `assets/scene.splinecode` | Available | 184 KB Spline export, used as is. |
| `assets/video.mp4` | Available, **never in Git** | 1920×1080, H.264 High, 23.976 fps, ~190 s, ~68 MB, AAC audio, ~3 Mbps. Keep original untouched; create optimized web version (milestone 02) and a poster. Excluded by `.gitignore`. |
| `assets/BasementGrotesque-Black.otf` | Available, sufficient | ~40 KB, Black (weight 800). It is the only Basement Grotesque weight the Figma design uses, so no further weights are needed. woff2 conversion needs a tool that is not installed (see open items); the OTF itself is a valid fallback. |
| `assets/strongfirst-logo.svg` | Available | Exported from the original Figma element (node `2154:627`, 101×20), pure vector, 12 paths, 5.3 KB, valid XML, no scripts/images. The Figma "export" variant was rejected (it contained the Figma page background); the vector layer was used. Colours per state: see "Logo colour". |
| Portrait (Varga Tamás) | Available outside the project | `../Confident Corporate Portrait Man.png`, 1.8 MB PNG. Copy into `assets/`; generate optimized AVIF/WebP with correct dimensions. |
| Sometype Mono | To download in milestone 02 | Google Fonts serves woff2 directly (verified: Regular 400, Medium 500, SemiBold 600, Italic 400 are available, each in `latin` and `latin-ext`), so no conversion is needed. Needed set: those 4 styles × 2 subsets = 8 files, self-hosted. `latin-ext` contains the Hungarian ő/ű. |
| Headline texture image | To export in milestone 02 | The first headline line uses an image fill (Figma `statement`), with a 30% `#805318` overlay in the active state. Original image to be exported from Figma. |
| Avatar in info banner | Compare in milestone 02 | 88×88 avatar in Figma (bottom-aligned crop). Compare with the portrait file and use the exact/best match. |
| Background images | Not needed | Placeholders in Figma only; the background is CSS. |
| `preview/*.png` | Reference | Figma exports (desktop/mobile states, modals, components). Not shipped. |

## Spline scene findings

The scene is a self-contained interactive scene with embedded code and its own state machine:

- Objects: `Kettlebell_24kg` (`KB_Group`), `Hitbox`, `HoverFlag`, `Studio_Cyc`, lights (key spot, floor glow), hotspot ring and dot, FX (dust, contact shadow), `Play_Camera`.
- Interaction: the `Hitbox` object's `MouseHover` event drives the lift state on desktop (fine pointer with hover). On touch devices (`(hover: none), (pointer: coarse)`) the `MouseDown` event on the Hitbox toggles the state (1st tap lift, 2nd tap fall, with a 350 ms debounce). The state is mirrored into the scene variable `kettlebellLifted`.
- Colour change: the kettlebell colour (grey ↔ orange), lift/spin and effects are all done by the scene. The page must not reimplement them.
- **Renderer: the scene is exported for WebGPU only.** The Spline runtime logs "This scene was exported for WebGPU only and this browser does not provide a WebGPU adapter. Re-export with renderer 'Both' or 'WebGL 2'" in browsers without a WebGPU adapter (found in milestone 02). Browsers without WebGPU get the static fallback. Recommendation: re-export with renderer "Both" (design-owner decision).
- Settings present: `preventScroll`, `preventTouchScroll`, `showBackground`, `withBackground`, `backgroundColor`, `mouseEventTarget`.

Findings relevant to the CSS background (to be resolved in milestone 02):

- The area behind the kettlebell is currently produced inside the scene (`Studio_Cyc` backdrop, fog and spot lights; dark ↔ deep gold on hover). **Decision:** do not modify the scene background or `Studio_Cyc`; the fog and lights are part of the scene's visual design. In milestone 02 only investigate how the scene background behaves together with the CSS page background, and change something only if justified and approved.
- The mechanism for the page to read the lifted state (scene variable vs. events) is to be verified in milestone 03. The scene's own code comments warn that a separate `mouseHover` listener also fires on leave, so the page should mirror the scene variable instead of adding its own hover logic.
- `preventTouchScroll` must be tested on mobile so the canvas does not block page scrolling.

## Figma (node `2103:290`)

- Desktop frames 1280×834, mobile frames 393×872 (`mobile view` section is the current one; the hidden `v1` section is an older 852-high variant).
- Components: buttons (primary/secondary, default/hover), tag, promo bar, hero title (desktop/mobile, default/active), info banner, video tab, close button, info icon.
- Text styles (verified on the desktop/mobile default and active frames): Basement Grotesque **Black** only (H0 40/48, H1 14/17). Sometype Mono: **Regular 400** (Body 10/16), **Medium 500** (Caption 9/12; video tab, footer line), **SemiBold 600** (H2 14, Button 11/13, promo bar 11/13) and **Italic 400** 12/14 (tags). Letter spacing about -2%. The footer line's "©" is set in Roboto Mono Bold in Figma (a font fallback); verify that Sometype Mono has the glyph in milestone 02 and do not add Roboto Mono just for it.
- Colours (Figma variables): `black`, `dark-gray` #18191b, `mid-gray` #28292c (secondary button), `gray` #80818b, `light-gray` #e0e0e0, `brown` #bf7017, alpha `black-20` rgba(24,25,27,.2), `light-gray-20` rgba(224,224,224,.2). Active subtitle/logo colour #807369. (The first audit wrongly said Figma variables are not used.)
- Footer line: "2026 © Varga Tamás • KZS Design". Contact: +36 30 98 33 750.

## Logo colour

- Default state: `#80818B` (matches the exported SVG).
- Active state: the Figma active instance paints the same shape with `#80818B` plus a `#805318` overlay at 30% opacity. Flattened, that is `#807369` (R 128, G 115, B 105), identical to the active-state subtitle colour.
- Plan: one SVG, used as a CSS mask, with the colour set by a CSS variable that follows the shared page state (see `CLAUDE.md` section 8, Logo colour). Verify visually in milestone 02 that the shape is the same in both states.

## Video optimization plan

- Keep `assets/video.mp4` unchanged.
- Generate a web version: H.264 MP4, `+faststart`, reduced bitrate (target roughly 1.5–2 Mbps at 720p–1080p), poster image. Check quality visually before approval; optionally add a WebM/VP9 variant. Final file size determines which hosting options below are possible (some free hosts cap single files at about 25 MB; check current limits when choosing).
- Load only when the modal is opened (`preload="none"`), with the poster shown first.
- The generated web video is also excluded from Git.

## Video and Git

- `.gitignore` (project root) excludes `assets/video.mp4`, `*.mp4`, `*.m4v`, `*.mov`, `*.webm`, `*.mkv`, `*.avi`, and the generated video folders (`public/video/`, `public/videos/`, `src/assets/video/`, `dist/video/`).
- Verification (performed in a throwaway scratch repository, because the project directory is not a Git repository yet and was not initialized): `git check-ignore` matched all test video paths, `git add -A` staged only the 13 non-video files, a plain `git add assets/video.mp4` was refused, and `git ls-files` listed no video. The project's own `assets/video.mp4` was not touched (71,466,238 bytes, same file as before).
- Limit of this protection: `git add -f` bypasses `.gitignore`. Milestone 02 adds a pre-commit hook and/or CI check that fails on any staged or tracked video file, and the commit routine checks `git diff --cached --name-only` before every commit. Milestone 04 confirms there is no video anywhere in the history.
- Current status: not a Git repository, so there are no tracked files and the video cannot be registered as tracked.

## Video hosting and deployment

**Decision (design owner):** the video stays outside Git. For the demo and the production environment it is made available by a **separate upload**, and the video URL is managed from configuration (`PUBLIC_VIDEO_SRC`, `PUBLIC_VIDEO_POSTER`, with a local default for development). **No external video service is introduced for now**, and nothing paid is adopted without approval.

Requirements for the upload location (to be chosen together with the demo hosting): HTTP range requests (seeking), `Content-Type: video/mp4`, long cache headers, the same file reachable from both the demo and the production domain, and a file size within the host's single-file limit (some free hosts cap files at about 25 MB; check when the host is chosen).

The build/deploy checks (milestone 04) verify that the configured video URL responds in each environment and that the modal degrades gracefully (message, no broken layout) when it does not.

## SEO and performance requirements (summary)

- One H1, semantic landmarks, Hungarian title and meta description, Open Graph/Twitter metadata, favicon set, JSON-LD (type to be evaluated; only verified data: name, phone, Szeged).
- Production canonical: `https://kettlebellszeged.hu`; production build derives canonical, `og:url`, sitemap, robots sitemap reference and JSON-LD URLs from configuration automatically.
- Demo build: `<meta name="robots" content="noindex, nofollow">` (plus `X-Robots-Tag` where the host allows), **`robots.txt` does not block crawlers** (otherwise the noindex tag could not be read), no canonical pointing to the production domain (no canonical/`og:url` at all), no sitemap, never listed in the production sitemap, no hardcoded demo URL. The environment is selected by configuration (`CLAUDE.md` section 5).
- Core Web Vitals: Spline and video are non-critical (lazy, reserved space), self-hosted woff2 fonts, optimized images with dimensions, `prefers-reduced-motion` support.

## Final technical plan

**Stack:** Astro + TypeScript, static output, native HTML5 video, CSS transitions, local fonts. Only expected runtime dependency: the Spline runtime. Environment (`PUBLIC_ENV`, `PUBLIC_SITE_URL`, `PUBLIC_VIDEO_SRC`, `PUBLIC_VIDEO_POSTER`) is read in one config module.

**Page state:** one shared state attribute on the page root mirrors the scene's `kettlebellLifted`; CSS variables for background, headline, labels, info panel, video tab and logo colour change with transitions. The scene alone owns the kettlebell animation and colour.

**02 – Layout & Design:** Astro project, Git init and remote connection (check `.gitignore` first, add the no-video hook/CI check); tokens from the Figma variables (colours above); fonts (Basement Black; Sometype Mono 400/500/600/italic 400 in latin + latin-ext); static desktop and mobile layout; components (hero title with texture headline, tags, info banner, buttons, video tab, close button, promo bar, modal layout, logo mask); CSS background; Spline embedding with fallback and the investigation of the scene background (no scene changes); web video encoding and poster (not committed).

**03 – Interactions:** read the scene state and drive the shared state attribute (desktop hover, mobile tap toggle as implemented by the scene); labels, panel, video tab and logo transitions; video modal behaviour (focus, ESC, scroll lock, stop on close); promo bar timing from a single config.

**04 – Optimization & QA:** Core Web Vitals, SEO and JSON-LD (verified data only), demo noindex with crawlable robots.txt and production canonical/sitemap, video availability on demo and production, no video in Git history, accessibility (WCAG 2.2 AA), device/browser tests, Figma comparison.

## Decisions and open items

### Resolved (design owner decisions)

- Spline background / `Studio_Cyc`: not modified for now; milestone 02 only investigates how it combines with the CSS background.
- Video: stays out of Git; separate upload for demo and production; URL from configuration; no external video service.
- Fonts: Basement Grotesque Black is the only Basement weight used, so nothing more is needed. Sometype Mono is downloaded from Google Fonts as woff2 and used locally, only the weights used in Figma (400, 500, 600, italic 400).
- StrongFirst logo: the existing SVG is used; the active colour comes from the Figma active frame (`#807369`), default `#80818B`.
- Demo SEO: noindex, crawlable `robots.txt`, no production canonical, never in the production sitemap.
- Earlier: logo exported from Figma, video ignored in Git, domain `https://kettlebellszeged.hu`, stack Astro + TypeScript.

### Still open (small, none blocks the start of milestone 02)

1. **woff2 conversion of Basement Grotesque Black:** no conversion tool is installed (`woff2_compress`, `fonttools`). Either approve installing one (a dev-only tool) or keep the 40 KB OTF.
2. **Demo hosting and its URL, and where the video is uploaded:** provided via configuration, not committed.
3. **Headline texture and avatar:** export the texture image from Figma; compare the Figma avatar with the portrait file (see asset list).
