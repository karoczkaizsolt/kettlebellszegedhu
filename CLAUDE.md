# VT Kettlebell – Project Instructions

## 1. Project Overview

Build a fast, responsive, SEO-optimized single-page website for VT Kettlebell.

The website promotes kettlebell personal training and group training in Szeged, Hungary.

The visual design is provided in Figma. Treat the Figma design as the primary source of truth.

**Primary goal:** Faithfully implement the approved design, including its interactive states, animations, responsive layouts and video experience.

Do not redesign, reinterpret or simplify the approved visual direction without explicit approval.

## 2. Project Resources

### Figma

Main design:
https://www.figma.com/design/FMm8M3VGmIyzVpmJUXe9Oi/DRAFT-%E2%80%94-VT-kettlebell---masszazs?node-id=2103-290

Important Figma frames:

- Main design: `2103:290`
- Desktop default state: `2119:184`
- Desktop active state: `2119:167`
- Mobile default state: `2119:162`
- Mobile active state: `2119:148`
- Desktop video modal: `2148:396`
- Mobile video modal: `2154:576`
- Promo bar: `2154:625`
- StrongFirst logo: `2154:627` (exported to `assets/strongfirst-logo.svg`)

Always inspect the relevant Figma frames before implementing a component.

Figma background images ("sample bg 1/2") were visual placeholders only. Do not look for or export them (see section 8).

### Local project

Project root:

`/Users/zsoltkaroczkai/ADAT/Work/VT kbell/KB-coding`

Assets directory:

`/Users/zsoltkaroczkai/ADAT/Work/VT kbell/KB-coding/assets`

Git repository:

https://github.com/karoczkaizsolt/kettlebellszegedhu.git

The project directory is the only permitted working directory.

Do not modify files outside the project root. Files outside the project root may be read, and copied into the project when needed (for example the portrait, see section 3), but never changed or moved.

### Assets

Source files live in `assets/`. They are the originals: never edit, overwrite or delete them. Processed or optimized versions are generated into the build's public/source folders.

| Asset | Status | Notes |
|---|---|---|
| `assets/scene-v7-both.splinecode` | Available, **in use** | Seventh export, renderer "Both": same scene as v6 plus fog "Use Background Color" with the background set to the former fog colour `#0a0705` (look unchanged). The scene background is set at runtime per breakpoint (`sceneBackground` in `src/config.ts`), which tints only the distant, upper backdrop through the fog. See `docs/03-interactions.md` (Scene v7-both). Used as is, not modified. |
| `assets/scene-v6-both.splinecode` | Kept, not used | Sixth export, renderer "Both" (WebGPU + WebGL 2; verified, see `docs/03-interactions.md`). Used as is, not modified. The build imports it as a content-hashed asset (`src/config.ts`, `?url` → `_astro/scene-v6-both.<hash>.splinecode`), so it can be cached for a long time (`public/.htaccess`) and a new scene file gets a new URL automatically; everything said about v4 below (runtime camera pull-back on phones, state mirroring, the WebGPU check and static fallback in the page) applies unchanged. |
| `assets/scene-v5.splinecode` | Kept, not used | Fifth export, WebGPU-only. |
| `assets/scene-v4.splinecode` | Kept, not used | Fourth export: smaller kettlebell (about 12% by the neck-highlight spacing), bottom edge in place, lift not higher than before. Previously used; still reports WebGPU-only (see section 8). |
| `assets/scene-v3.splinecode`, `assets/scene-v2.splinecode`, `assets/scene.splinecode`, `assets/scene.webgpu-only.original.splinecode` | Kept, not used | Original scene and its backup copy. Never delete or overwrite. |
| `assets/video.mp4` | Available, **never committed to Git** | Local intro video (1920×1080, H.264, ~190 s, ~68 MB). Source of the video. Never edit or delete the original; ship an optimized web version. See section 4 (Video and Git) and the hosting plan in `docs/01-audit-and-setup.md`. |
| `assets/BasementGrotesque-Black.otf` | Available, sufficient | Black (weight 800) is the **only** Basement Grotesque weight used anywhere in the Figma design (H0, H1, headline, subtitle; verified on desktop/mobile default and active frames). No other weights are needed. Self-host; convert to woff2 if a conversion tool is approved, otherwise use the OTF as is (about 40 KB). |
| `assets/strongfirst-logo.svg` | Available | Exported as SVG from the original Figma element (node `2154:627`, 101×20). Use this one file in both states; do not redraw or substitute it. Colour: default `#80818B`, active `#807369` (see section 8, Logo colour). |
| Portrait (Varga Tamás) | Available outside the project | `/Users/zsoltkaroczkai/ADAT/Work/VT kbell/Confident Corporate Portrait Man.png`. Copy into `assets/` when needed; do not modify or move the original. |
| Sometype Mono (woff2) | Done (milestone 02) | Downloaded from Google Fonts into `assets/fonts/` and served locally: one variable file for Regular 400 / Medium 500 / SemiBold 600 and one for Italic 400, each in `latin` and `latin-ext` (4 files). No other weights. |
| Headline texture image | Done (milestone 02) | Original Figma image fills exported to `src/assets/figma/headline-texture-desktop.png` (543×48) and `headline-texture-mobile.png` (288×68). Used as an image fill, with the 30% `#805318` overlay in the active state. |
| Avatar (Varga Tamás) | Done (milestone 02) | The Figma 88×88 avatar was exported (`src/assets/figma/avatar.png`) and is used in the info panel, as decided by the design owner. The portrait file in the parent folder is not used. |
| Background imagery | Not needed | The page background is pure CSS. |

## 3. Technology Decisions

Approved stack:

- Astro with TypeScript.
- Static HTML generation (no server rendering).
- Minimal external dependencies. The only expected runtime dependency is the Spline runtime needed to play `scene.splinecode`. Any other dependency needs justification and approval.
- Video.js 8 (design-owner decision, milestone 03) as the video player in the modal; it is loaded only when the modal is first opened (dynamic import), the video itself only when playback starts. No other player library.
- CSS-based animations and transitions for the surrounding UI.
- Optimized, self-hosted fonts (woff2, `font-display: swap`, preload only the critical ones).

Because the project directory is not yet a Git repository and no package manifest exists, milestone 02 starts by creating the Astro project in the project root and connecting it to the remote above. Existing files (`assets/`, `preview/`, `CLAUDE.md`) must be preserved. Installing packages requires the design owner's approval at that point.

The video is optimized for web use (smaller bitrate/resolution, `+faststart`, poster image). The original `assets/video.mp4` is always preserved.

## 4. Video and Git

**No video file may ever be committed to the Git repository** (original or optimized).

- `.gitignore` excludes `assets/video.mp4`, all common video extensions (`*.mp4`, `*.webm`, `*.mov`, `*.m4v`, `*.mkv`, `*.avi`) and the generated video output folders. Do not remove or weaken these rules.
- The original stays on disk in `assets/` for local development. Never delete, move or modify it.
- Do not use `git add -f` (or any forced add) for video files. Stage files by explicit path, and run `git status` / `git diff --cached --name-only` before every commit to confirm no video is staged.
- Milestone 02 adds an automatic safeguard (a pre-commit hook and/or a CI check) that fails when any tracked or staged file is a video. A forced add bypasses `.gitignore`, so the rules alone are not sufficient protection.
- The site reads the video location from configuration (for example `PUBLIC_VIDEO_SRC`, `PUBLIC_VIDEO_POSTER`), not from a hardcoded host. The local development default points to the locally generated file.
- The video must be available in both the demo and the production environment even though it is not in Git. It is provided by a **separate upload** to each environment, and the site reads its URL from configuration. **No external video service is introduced for now** (and no paid service without explicit approval). Details: `docs/01-audit-and-setup.md` ("Video hosting and deployment").

## 5. Environments, Domain and Deployment

Final production domain: **`https://kettlebellszeged.hu`**

The first published version goes to a **demo URL**. The demo URL is not defined in this repository.

Requirements:

- The environment is selected by configuration (environment variables), for example `PUBLIC_SITE_URL` and `PUBLIC_ENV` (`demo` | `production`), read in one central config module.
- Do not hardcode the demo URL (or any other host) anywhere in the source code.
- Production build: canonical URL, `og:url`, sitemap and JSON-LD URLs always use `https://kettlebellszeged.hu`.
- Demo build: must not be indexed by search engines.
  - `<meta name="robots" content="noindex, nofollow">` on every page.
  - `X-Robots-Tag: noindex, nofollow` header too, if the hosting supports custom headers.
  - `robots.txt` must **not** block crawlers (no `Disallow: /`): crawlers have to be able to fetch the page to read the `noindex` tag. The demo `robots.txt` allows crawling and does not reference a sitemap.
  - No canonical link pointing to the production domain, and no canonical or `og:url` at all on the demo build.
  - No sitemap on the demo, and the demo is never listed in the production sitemap.
- `robots.txt` and `sitemap.xml` are generated per environment, not hand-maintained for one of them.
- Switching from demo to production must require changing configuration only, not code: the production build automatically uses `https://kettlebellszeged.hu` for canonical, `og:url`, sitemap, `robots.txt` sitemap reference and JSON-LD, and drops the `noindex` tags.

## 6. Development Principles

1. Work in clearly defined milestones (section 15).
2. Inspect the existing project before changing anything.
3. Preserve existing working functionality.
4. Do not introduce unnecessary dependencies.
5. Keep components modular and maintainable.
6. Prioritize performance and accessibility.
7. Follow the Figma design accurately.
8. Do not invent content or visual elements.
9. Do not start the next milestone without reporting the current milestone's results.
10. Ask for approval when a technical decision could significantly affect the design or architecture.

Do not perform a complete rewrite of the project unless explicitly requested.

## 7. Technical Audit (milestone 01)

The audit inspects:

- Repository structure and Git state (preserve uncommitted changes).
- Framework and build system, package.json and dependencies.
- Routing and rendering strategy.
- All assets: image, font, video and Spline file formats.
- Existing SEO and metadata configuration.

Result of the audit: see `docs/01-audit-and-setup.md`. The current project directory contains no code, no package manifest and no Git metadata, so the stack in section 3 is the baseline. Do not replace it without a justified technical reason and explicit approval.

## 8. Main Interaction – Spline Kettlebell

The Spline scene is the central interactive element and the **only source of truth for the kettlebell's animation and colour change**.

### What the Spline scene owns (do not reimplement)

The existing scene already contains the complete kettlebell behaviour:

- Default state: grey kettlebell with its default idle animation.
- Hover / active state: orange kettlebell, lift animation and related effects.
- The scene's own interaction logic: the `Hitbox` object with the `MouseHover` event for hover on desktop, the `MouseDown` event for tap toggling on touch devices, and the scene variable `kettlebellLifted` that mirrors the lifted state.

Do **not** recreate, override or duplicate the kettlebell animation or its colour change with CSS or JavaScript. Do not modify `scene.splinecode`. Do not add a second hover/tap detector on top of the scene's own one: this would cause the page and the scene to go out of sync.

### What the page (CSS) owns

CSS only controls the elements around the scene, switched by one shared state attribute on the page (for example `data-active="true"`) that mirrors the scene's `kettlebellLifted` state:

- Page background colour (dark ↔ orange, per Figma).
- Headline colour.
- Visibility of the secondary text labels.
- Bottom information panel: colour and slight upward movement.
- Video tab colour.
- StrongFirst logo colour (see Logo colour below).

The page observes the scene's state; it does not decide it. The exact mechanism for reading the state from the scene (scene variable or events through the Spline runtime) is verified in milestone 03.

### Logo colour

The StrongFirst logo is the single exported SVG (`assets/strongfirst-logo.svg`). Its colour is taken from the Figma frames and must be exactly reproducible in both states:

- Default state: `#80818B` (Figma variable `colors/gray`).
- Active state: `#807369`. In Figma this is `#80818B` with a 30% `#805318` overlay, flattened to one opaque colour; it is the same colour as the active-state subtitle.

Implementation rule: render the original SVG as a CSS mask (shape) and set the colour with a CSS variable that changes with the shared page state and transitions together with the other elements. Do not redraw, edit or duplicate the logo. Provide an accessible name (for example `role="img"` and `aria-label="StrongFirst"`). In milestone 02 verify visually against the Figma frames that the exported shape is identical in both states.

### Desktop behaviour

Default state:
- Dark page appearance.
- Kettlebell shows its default Spline animation (grey).
- Secondary text labels are hidden.
- Headline in default colour.
- Bottom information panel in default appearance.
- Video tab in default appearance.

Hover state (hover over the Spline interaction area, driven by the scene):
- Page background changes to the orange appearance shown in Figma.
- Kettlebell turns orange (handled by Spline).
- Labels appear around the kettlebell.
- Headline changes colour.
- Bottom information panel changes colour and moves slightly upwards.
- Video tab changes colour.

When the pointer leaves the interaction area, everything returns to the default state.

### Mobile behaviour

- Do not rely on hover.
- A tap on the kettlebell toggles the highlighted state; a second tap returns to default. This toggle is implemented by the Spline scene; the page only mirrors it.
- The scene retains its default animation when inactive.
- Labels appear above the kettlebell, following the mobile Figma layout.
- The other elements change appearance consistently with desktop.

### Background and scene transparency

The page background is implemented in CSS and follows the dark and orange states from Figma.

**Decision (design owner):** do **not** modify the Spline scene's background or the `Studio_Cyc` object. The fog and the lights are part of the scene's visual design.

**Update (design owner, scene v7):** the scene's background colour is now controlled from the page: the fog uses the background colour ("Use Background Color"), and the page sets it with the runtime's public `setBackgroundColor()` (`sceneBackground` in `src/config.ts`: desktop `#0a0705` = the original look, phones `#2a1c12` = a lighter upper backdrop). The canvas stays opaque; `Studio_Cyc`, the lights and the fog distances are unchanged.

**Result of the milestone 02 investigation:** the canvas is opaque (the scene paints its own studio backdrop: near-black by default, warm gold when lifted), so the CSS page background shows only where the canvas does not cover the page: the top strip (the canvas is shifted down to match the Figma framing, and its top edge fades into the CSS background with a CSS mask), the very bottom on mobile, and everywhere when the scene is unavailable (fallback). The CSS background therefore uses the same two looks (dark; dark-brown to orange) so the transition is seamless. No change to the scene was necessary.

**Update (scene v3):** the camera of `scene-v3.splinecode` already frames the composition like the Figma frames, so the canvas is simply full-bleed (`.scene { inset: 0 }`) with no shift and no mask, and the scene's own backdrop fills the whole stage on desktop and mobile. The scene scales with the canvas height (ring at about 37.8% of the height, kettlebell body about 0.255 × the height), so very tall or large viewports show a proportionally larger kettlebell. The CSS page background only shows when the scene is unavailable (fallback).

**Phones (below 768 px):** the kettlebell composition is shown smaller (about 80 %) by pulling the scene camera back at runtime after the scene has loaded (`sceneMobile` in `src/config.ts`, applied in `SplineScene.astro`; the `.splinecode` file is not modified). The canvas stays full size; no CSS scale, mask, vignette or background trick is used, so the scene's own backdrop fills the viewport in both states. `dollyBack: 0` switches it off.

### Technical requirements

- Keep the Spline scene independent from the surrounding UI.
- Avoid unnecessary scene reloads when switching states.
- Use CSS transitions for surrounding UI changes.
- Keep the interaction state synchronized across all affected elements.
- Prevent accidental state changes during normal page scrolling (check the scene's touch-scroll settings on mobile).
- Provide a usable fallback if Spline cannot load (static layout, labels reachable, no broken UI).
- **The scene was exported for WebGPU only** (the Spline runtime reports: "exported for WebGPU only ... Re-export with renderer 'Both' or 'WebGL 2'"). Browsers without a WebGPU adapter cannot render it. The page detects WebGPU before loading the runtime and falls back to the static layout (`data-scene-state="unsupported"`). Re-exporting the scene with renderer "Both" is recommended and is a design-owner decision; do not change the scene file without approval.
- Respect `prefers-reduced-motion` for the surrounding CSS transitions.
- Labels on phones/tablets (< 960 px) are two horizontally moving rows (`TagsMarquee.astro`, Figma mobile rows 1/2); desktop keeps the static grid.
- State changes use shared timings (`--t-state`, `--ease-state`, `--t-lift`, `--ease-lift`): smooth interpolation, no bounce.

The Spline scene must not compromise initial page rendering: load it after the first render, and reserve its space to avoid layout shift.

## 9. Video Tab and Modal

The video tab is fixed to the right edge of the viewport.

It is available on desktop and mobile.

Clicking it opens a fullscreen modal based on the Figma frames `2148:396` (desktop) and `2154:576` (mobile).

### Video player

Use Video.js 8 (self-hosted npm package, loaded on first modal open) on top of a native `<video>` with the optimized web version of `assets/video.mp4`. The video is not stored in Git (section 4); its URL comes from configuration.

Requirements:
- Free implementation.
- Minimal visual appearance.
- No paid video services and no third-party embeds.
- No player library other than Video.js; minimal control set (play/pause, progress, volume, fullscreen), orange progress bar.
- Provide play/pause and volume controls.
- Support fullscreen playback.
- Preserve responsive aspect ratio.
- Use an appropriate video poster if available.
- Do not load the video until the modal is opened (`preload="none"` or equivalent).

### Visual effect

Add a subtle CSS radial gradient around the video.

The effect should resemble a dark vignette:
- Slightly darker towards the edges.
- Softer and lighter around the video.
- No visible hard boundaries.
- Must not reduce video visibility.

Implement this as a separate CSS layer with `pointer-events: none`.

### Modal behaviour

- Fullscreen overlay on desktop and mobile.
- Close button.
- ESC key support.
- Lock background scrolling.
- Stop video playback when closing.
- Restore focus to the element that opened the modal.
- Support keyboard navigation.
- Prevent background interaction while open.

## 10. Promo Bar

Figma reference: `2154:625`.

The promo bar is a narrow orange announcement bar positioned at the top of the viewport.

Text:

"Rendszeresen induló kiscsoportos kezdő kurzusok. Érdeklődj a részletekért!"

### Behaviour

Design owner's update (two independent triggers, one show routine):
- **Automatic:** 4 seconds after the page has loaded (`promoBar.autoDelayMs`), once per page load.
- **Modal-linked:** 60 seconds (`promoBar.afterModalMs`) after the video modal is opened for the **first** time. Later openings do not restart the timer and closing the modal does not cancel it.
- Both triggers call the same routine: a trigger that fires while the bar is showing (or still animating out) is ignored, so there is never a second bar or a second animation; a trigger that fires after the bar has gone shows it again. The bar stays visible for 6 seconds (slide-down + fade-in, then fade-out + slide-up). No `sessionStorage`.
- If the modal is open at that moment the bar appears **above the modal and its backdrop**: the bar is a `popover="manual"` element (top layer; a native `<dialog>` is in the top layer too, so z-index alone cannot do this). It keeps `pointer-events: none`, so it never blocks closing the modal or the video controls.
- Timing and enter/exit durations are configured in one place: `promoBar` in `src/config.ts`. The modal announces its opening with the `vt:modal-open` document event.

### Visual requirements

- Design-owner update: one flat background colour (`--promo-bg`) on every screen size, no gradient and no animation other than the slide; the icon is hidden below 768 px.
- Fixed overlay at the top of the viewport.
- Must not push or shift the underlying content.
- Must not cause layout shifts (CLS).
- Match Figma dimensions, typography and colors (current Figma: horizontal gradient background (transparent white at 15.215 %, white at 51.442 %, transparent at 85.226 %; on mobile the white plateau is widened), no border, 24px orange bell icon `assets` `src/assets/figma/icon-notifications-active.svg`, 16px gap, 8px/16px padding, Sometype Mono black (14px by design-owner decision; Figma 12px), letter-spacing -0.02em, first sentence SemiBold, second Regular; 40 px high on desktop; on narrow screens the text wraps to two lines).
- Work on desktop and mobile.
- Use subtle slide-down and fade-in animation.
- Use fade-out and slide-up when disappearing.
- Respect `prefers-reduced-motion`.

Avoid unnecessary JavaScript timers or complicated animation libraries.

## 11. SEO Requirements

SEO is a priority from the beginning.

The website is a single-page landing page. Do not create unnecessary subpages or artificial content sections.

### Technical SEO

Implement:

- Semantic HTML5 structure.
- Correct heading hierarchy.
- One meaningful H1.
- Unique page title.
- Meta description in Hungarian.
- Canonical URL: `https://kettlebellszeged.hu` in the production build (see section 5).
- Open Graph metadata.
- Twitter/X card metadata where appropriate.
- XML sitemap (production only).
- robots.txt (per environment, see section 5).
- Favicon and appropriate icons.
- Structured data in JSON-LD.

### Content SEO

Primary search intent:

- kettlebell edzés Szeged
- kettlebell személyi edzés Szeged
- kettlebell csoportos edzés Szeged

Use keywords naturally.

Do not use keyword stuffing.

Preserve the actual Hungarian content and its meaning.

Do not invent business claims, qualifications, prices, addresses or opening hours.

### Structured data

Evaluate the appropriate Schema.org type for the actual business and service.

Potential types include LocalBusiness and SportsActivityLocation.

Only publish verified business information.

### Performance SEO

Prioritize:

- Good Core Web Vitals.
- Fast initial rendering.
- Optimized image assets.
- Modern image formats where appropriate.
- Lazy loading for non-critical media.
- Proper font loading.
- Minimal JavaScript.
- Efficient Spline loading.
- Correct image dimensions to prevent CLS.

Do not lazy-load the main above-the-fold content unnecessarily.

## 12. Accessibility

Follow WCAG 2.2 AA where applicable.

Requirements:

- Semantic elements.
- Keyboard accessibility.
- Visible focus states.
- Accessible buttons and controls.
- Meaningful alternative text.
- Sufficient color contrast.
- Reduced-motion support.
- Proper modal focus management.
- Do not communicate interaction states through color alone.

## 13. Responsive Design

Both desktop and mobile designs are available in Figma.

Implement both intentionally.

Do not simply scale down the desktop layout.

Check:
- Mobile typography.
- Kettlebell positioning.
- Label positioning.
- Information panel dimensions.
- Video tab position.
- Promo bar layout.
- Modal dimensions.
- Touch interaction.

Avoid horizontal overflow.

Use the actual Figma dimensions as reference points, but implement fluid responsive behaviour between them.

## 14. Code Quality

- Use reusable components.
- Keep styling organized.
- Use CSS variables or the existing token system.
- Avoid duplicated styles.
- Avoid unnecessary dependencies.
- Keep animation logic maintainable.
- Use descriptive naming.
- Keep configuration values centralized (site URL and environment, promo bar timing, interaction state names).

Do not add features that are not part of the approved scope.

## 15. Development Milestones and Workflow

There are four milestones. Do not automatically continue to the next one.

**01 – Audit & Setup**
Repository, Git state, assets, Figma and technical requirements audit. Output: `docs/01-audit-and-setup.md` and updated project instructions. No application code.

**02 – Layout & Design** (implemented; see `docs/02-layout-and-design.md`, awaiting design-owner approval)
Astro project setup and Git connection (verify `.gitignore` before the first commit; add the no-video safeguard), design tokens, fonts, static layout for desktop and mobile, all components and their visual states from Figma (hero title, info banner, tags/labels, StrongFirst logo, video tab, close button, promo bar, modal layout), CSS page background, Spline embedding with transparency investigation and fallback, web video encoding (output not committed).

**03 – Interactions**
Synchronizing the page with the Spline scene state (`kettlebellLifted`), hover and tap behaviour, label/panel/video tab transitions, video modal behaviour (focus, ESC, scroll lock, playback), promo bar timing.

**04 – Optimization & QA** (approved and closed; see `docs/04-optimization-and-qa.md`)
Performance tuning (Core Web Vitals), SEO metadata and structured data verification, environment configuration check (demo noindex with crawlable robots.txt, production canonical, sitemap, robots), video availability check in demo and production, confirm no video file in Git history, accessibility audit, cross-browser and device testing, final Figma comparison.

### Testing and validation

At the end of every milestone:

1. Run the appropriate build and checks.
2. Inspect browser console errors.
3. Check responsive layouts.
4. Compare the implementation with Figma.
5. Check interaction states.
6. Report known issues.
7. Report files changed.

Do not claim that something works without testing it.

### Milestone report

At the end of each milestone, provide:

- Summary of completed work.
- Files created or modified.
- Technical decisions.
- Tests performed.
- Known issues.
- Questions requiring approval.

Wait for explicit approval before continuing.

The design owner has final approval over visual and interaction decisions.
