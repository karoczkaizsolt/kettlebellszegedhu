# Milestone 03 – Interactions (QA report)

## Audit (before the work)
- Done earlier (milestone 02): all visual states in CSS, driven by `data-state` on `<html>` (default / active), transitions, tags, info panel (moves 40 px up on desktop), headline, logo, video tab colours; static modal markup; promo bar timing.
- Missing: nothing wrote `data-state` (the state was never active), no video-tab animation/hover, no modal behaviour, no player.

## 1. Spline ↔ page state
- `SplineScene.astro` mirrors the scene's own `kettlebellLifted` variable into `data-state` (`sceneState` in `src/config.ts`: variable name and `pollMs` = 80). The runtime has no variable change event, so the variable is read at 80 ms intervals (paused while the tab is hidden) and right after the scene's own `mouseHover`/`mouseDown`/`mouseUp` events. No hover/tap detection of our own; the scene file, camera logic and animations are unchanged; the scene is loaded once (1 `.splinecode` request measured across hover in/out).
- All visual changes (card lift, colours, headline, logo, tags, tab) come from the existing CSS tokens.
- Tested (headless Chrome, software WebGPU): desktop 1280 – real hover: state default → active → default after leaving; active values: banner top 679 → 639 px, tags opacity 0 → 1, tab background orange, logo `#807369`, headline accent `#bf7017`. Phone layout (393 px) with a real pointer: same state flip, tags visible, panel/tab orange.
- **Not verifiable here: touch tap.** Emulated touch/click events do not toggle the scene in headless Chrome (also not before this change), so the tap toggle (scene's `MouseDown`) must be checked on a real phone. The page mirrors whatever state the scene reports.

## 2. Video tab
- Periodic nudge (`translate` property, never touches the positioning `transform`): 9 s cycle, first after 5 s, the tab moves 10 px in from the right edge on desktop and 5 px up from the bottom edge on phones (the phone tab sits at the bottom) and returns; verified by seeking the animation (0 → −10 px → 0). Reduced motion: no animation. Stopped while hovered/pressed/focused and while the modal is open.
- Hover / focus / press: light (default) or dark (active) tint, plus the move further in; `:hover` only on devices with hover (no sticky hover on phones; `:active` gives the touch feedback).
- Click opens the modal. Fix needed for phones: the wide INFO container (`.credit`) covered the left part of the phone video tab and swallowed pointer events; it is now `pointer-events: none` (icon and text keep theirs).

## 3. Video modal
- Video.js 8.24 (new dependency, requested by the design owner) loaded lazily on the first open (own chunk + CSS + Hungarian language file); the video is requested only when playing starts (`preload="none"`, poster shown).
- Controls (minimal dark skin): play/pause, progress (orange), volume, fullscreen; keyboard hotkeys of Video.js (space, arrows, m, f). Vignette: a separate layer inside the player above the picture and below the controls (picture only).
- Open/close: `dialog.showModal()` (background inert), ESC (native), close button, click on the dimmed area; scroll lock via `is-modal-open` on `<html>`; playback paused on every close; focus returns to the opener.
- Tested desktop 1280 and phone 393: opens, player created with controls `play, progress, volume, fullscreen`, playback runs (3 s measured), ESC closes, paused, focus back on the video tab, scroll lock set and removed, no horizontal overflow.

## Known issues / notes
- Tap toggle on touch devices and real-device WebGPU colours: check on a real phone.
- Autoplay on open is not enabled (not in the spec).
- The Spline runtime's chunk warning in the build is the runtime itself (lazy-loaded after load).
- `assets/favicon.*` and `og-image.png` appeared in the project (Phase 04).

## Screenshots
`docs/screenshots/phase03-*.png`

---

# Refinements (round 2)

## 1. Active state transition
- Cause of the abruptness: the panel lift was a change of `bottom` (not animatable), the headline overlay switched between two `background-image` values, the page fallback gradient switched, and all state colours used a 0.4 s transition.
- Now: shared tokens `--t-state` (0.9 s) and `--ease-state` (`cubic-bezier(.4,0,.2,1)`) for all state colours/fades; the lift is `transform: translateY(-40px)` with `--t-lift` 1.1 s and `--ease-lift` (`cubic-bezier(.22,.61,.36,1)`, ease-out, no overshoot, no bounce); the headline overlay colour is a registered `@property` (`--headline-overlay`) so it fades; the fallback stage gradient is a layer whose opacity fades.
- Measured frame by frame (scene disabled to keep the frame rate steady): lift 0 → −33 px at 0.57 s → −40 px at 1.1 s monotonic; headline `#e0e0e0` → `#bf7017`, tags opacity 0 → 1 through intermediate values; same curve in reverse. (With the WebGPU scene running in software rendering the page frame rate is too low to judge timing here.) Spline's own animations/events are untouched.

## 2. Video tab
- Hover now sets a real background (`--tab-bg-hover`: light tint in default, 10 % darker orange in active) and the strip that the slide-in uncovers (`.video-tab::after`, inherits the tab's animated background) is filled with the same colour, so the colour covers the whole extended surface (desktop: to the viewport edge on the right; phone: below the bottom edge).
- The periodic slide-in animates `translate` and `background-color` together (colour fades in with the movement and back out); hover/focus/press use the same two properties, so removing the animation transitions from its current value instead of jumping. Verified at the animation peak in default and active, desktop and phone.

## 3. Video modal
- Slides in from the bottom (0.4 s, ease-out, with a backdrop fade) and out again in the opposite direction (0.3 s, ease-in); phone/tablet: the whole sheet; desktop: the content over the blurred backdrop. ESC (keydown, `cancel` as fallback), the close button and the backdrop all use the animated close; reduced motion: fade only.
- Caption: Body 1 (Sometype Mono Regular 14/22, −2 %). Video: 800 px wide (responsive maximum `min(800px, 100% - 64px)`) from 768 px up, aspect 803:452 (note: it was already 803 px wide at 1280 px; the Figma value is kept as the ratio); phones: full width minus 16 px side spacing.

## 4. Video.js controls (measured, not just restyled)
- Stock problems found by measuring: the hover time tooltip is shrunk to 0.6em (7 px) by the stock CSS while the volume tooltip is 1em; the stock volume line is 3.6 px at 4 px above the bar's centre line (progress line: 3 px on the centre line); the stock handles are font glyphs whose vertical position depends on glyph metrics.
- Now: every control is centred on the bar's centre line (y = 22 px, measured 566.1 px for the bar, buttons, progress line, volume line); buttons 44×44 with the same 22 px icon; progress and volume lines 3 px, same colours rule (progress orange `#bf7017`, volume light grey); both handles are exact 10 px circles centred on their lines (measured centre offset 1.5 px of a 3 px line); one tooltip typography (Sometype Mono 12/16) for time, hover time and volume; volume expands to a 100 px line; empty tooltip boxes are hidden.

## 5. Autoplay
- Video.js is warmed up on hover/focus/touch of the tab; on click, `play()` runs inside the click (Safari requirement) or as soon as the player is ready. Once per opening (guard flag; measured 1 `play` event), `NotAllowedError` → retried muted → otherwise it stays paused with the play button; the volume is restored on the next opening; playback is paused at once when closing.

## 6. Mobile tags
- New component `TagsMarquee.astro` (Figma mobile rows 1 and 2, texts as in the mobile frame, which use "és"; the desktop grid keeps its own texts): below 960 px two rows move in opposite directions (34 s left, 24 s right), CSS only, only while the labels are visible (active state); each row is a group repeated 3 or 4 times, moved by exactly one group, so the joint is invisible (verified: the row at the start of the cycle and one full cycle later is pixel-identical at 320, 375, 393, 430 and 768 px; the repeated groups cover the viewport width). Placement: just above the lifted kettlebell's handle (top `max(262px, 39vh − 71px)`); `prefers-reduced-motion`: no movement, labels wrap centred. Desktop unchanged (`Tags` grid; the marquee is hidden from 960 px).

## Known issues / open
- Safari was not tested (only Chrome/Chromium is available for automation here); the code uses nothing Chrome-specific except `@property` (Safari 16.4+) and `translate` (Safari 14.1+); the Video.js play-in-click path is meant for Safari's autoplay rules and needs a check on a real device.
- Tap toggle on touch devices still has to be checked on a real phone.
- On very short phones (height below about 700 px) the two label rows overlap the top of the lifted bell, because the hero occupies the space above.
