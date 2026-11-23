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

---

# Refinements (round 3)

- **Logo +10 %:** `--logo-scale: 1.1` (tokens.css); the logo is 111.1 × 22 px (was 101 × 20), same ratio, same centre (measured x-centre = viewport centre at 320, 375, 393, 768, 960, 1280, 1440).
- **Labels, active state only:** desktop 20/28 px (was 14/22), fluid down to 16 px at 1024 px (`clamp(16px, 1.5625vw, 20px)`) so the right column keeps at least 19 px clear of the 127 px video tab (measured at 960, 1000, 1024, 1100, 1280, 1440, 1920); 960-1099 px: columns 16 px closer to the kettlebell (the labels are hidden in the default state, so the default look is unchanged). Rows keep the 66 px pitch (34 px rows, 32 px gap). Phones/tablets (marquee): 16/24 px (was 14/22), rows 30 px tall, block 70 px high (top `max(262px, 39vh - 76px)`), durations 39 s and 27 s (same speed as before); groups still cover the viewport and the loop stays seamless. The phone labels (16 px) are smaller than the active desktop labels (16-20 px).
- **Autoplay:** playback starts 2 s after the modal has opened (`videoModal.autoplayDelayMs` in `src/config.ts`), the timer restarts on every opening and is cancelled by closing. Measured on three consecutive openings: not playing at 1.2 s, playing at 2.9 s, exactly one `play` event per opening.
- **Close/reopen:** closing pauses at once; after the close the position is reset to 0 and the poster/big play button return (`hasStarted(false)`), so every opening starts from the beginning (measured `currentTime` 0 after each close).
- **Phone modal:** the video fills the full viewport width (x 0, width 393 / 320), border radius 0 (tablet/desktop keep 8 px), no horizontal overflow (scrollWidth − innerWidth = 0).
- **Time display:** current time (white) and total length (grey `#80818b`) on both sides of the progress bar ("1:16 ▬▬▬ 3:10"); the length comes from the video's own metadata (the metadata is requested when the modal opens; measured 190 s = 3:10), not a fixed value; same mono typography as the tooltips.

---

# Refinements (round 4)

- **Label size jump (cause):** the large size (20/28 px) was set only under `[data-state='active']`, so on hover the labels were first rendered at the base 14 px and grew, and on leaving they shrank while fading out. Fix: on desktop the large size is now the base size of `.tag` (the labels are invisible by default, so the default look is unchanged). Measured frame by frame: font size constant (20 px desktop, 16 px mobile) during fade-in and fade-out; positions unchanged.
- **Staggered fade-in:** opacity only (no scale, no movement). Each label has `--i` (order) and fades in 0.8 s with 90 ms offsets (desktop: left/right alternating top to bottom; mobile: row 1, then row 2). Fade-out: all together, 0.4 s. The containers only toggle `visibility`. `prefers-reduced-motion`: no stagger (measured: all labels at opacity 1 within the first frames).
- **Modal idle phase:** the video area is plain black (`data-phase="idle"`, children `visibility: hidden`) until the 2 s delay has passed; loading (metadata) and playing are separate. The video is revealed when the `playing` event fires (fallback 1.5 s), with a 0.35 s fade. Measured: at 0.3 s and 1.0 s the video area is pure black (min = max = 0); revealed at about 2.0-2.4 s.
- **Caption:** fades out 10 s after the opening (`videoModal.captionHideMs`), then its height and the gap collapse (no space left). The timer restarts on every opening and is stopped and reset on close. Measured over three consecutive openings: caption visible at 3 s, gone at about 9-11 s, restored after closing; an open/close at 1.5 s leaves no stray timer.

---

# Refinements (round 5)

- **Labels:** "+" replaced by "és" in the desktop labels ("mobilitás és hajlékonyság", "kardió és állóképesség"); the mobile rows already used "és". Typography and animation unchanged.
- **Video tab nudge:** cycle 21 s with three nudges at uneven spacing (about 5 s, 7 s and 9 s apart; first after 3 s) instead of one per 9 s. Same slide and colour; hover and active colours untouched.
- **Modal:** dark wait 0.8 s (`videoModal.autoplayDelayMs`); the video area is pure black until then (measured max pixel 0 at 0.35 s), playback then starts and the video is revealed (phase `shown` at about 1.7-1.9 s measured, i.e. 0.8 s plus the player starting).
- **Caption:** only its opacity changes after 10 s; the reserved space stays (height 22 px before and after). Measured over two openings: video rect (240, 138, 800 x 450) and close button y identical before and after the fade.

---

# Refinements (round 6)

- **Phone label block centred vertically** (`TagsMarquee.astro` script, phones < 768 px only): top = hero bottom (headline + logo) + (card top − hero bottom − block height) / 2, recomputed on resize / font load / card size change; offsetTop based, so identical in default and active state. Row spacing, animation and typography unchanged; tablet/desktop keep the CSS position (768 px measured unchanged). Measured gap above / below: 86/86 px at 320×568, 375×667, 360×740, 390×844, 393×852 (stage min-height 872 px); 116/116 at 430×932; 147/146 at 700×900.

---

# Refinements (round 7)

- **Desktop cursor:** while the scene reports the active state (pointer inside its hitbox) the canvas gets `cursor: pointer` (mouse devices only: `@media (hover: hover) and (pointer: fine)`); it returns to default when the state goes back. Touch devices unchanged.
- **Cause of the missing cursor:** the Spline runtime places an empty transparent "HTML content" iframe (no content, no controls) over the canvas; the browser takes the cursor from the iframe. It is now click-through (`pointer-events: none !important`, same media query). Hover detection remains the scene's own (3 hover/leave cycles with and without the change gave identical state results).
- **Measured** (1280×834): pointer at bell centre, upper part, left and right edge → pointer; outside → default; video tab keeps its own pointer.
