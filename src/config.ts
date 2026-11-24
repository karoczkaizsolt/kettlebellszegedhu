// Central configuration. Nothing environment-specific is hardcoded elsewhere.

/** Final production domain (the only absolute URL in the source). */
export const PRODUCTION_URL = 'https://kettlebellszeged.hu';

export type SiteEnv = 'demo' | 'production';

/** Selected only by configuration (PUBLIC_ENV). Anything but "production" is treated as demo (noindex). */
export const siteEnv: SiteEnv = import.meta.env.PUBLIC_ENV === 'production' ? 'production' : 'demo';
export const isProduction = siteEnv === 'production';

/** Canonical base URL: the final domain in production, none on the demo. */
export const canonicalBase: string | undefined = isProduction ? PRODUCTION_URL : undefined;

/**
 * Base for absolute URLs of social preview assets (og:image). Production: always the production domain. Demo: the
 * optional PUBLIC_SITE_URL (not a canonical, never used for og:url, sitemap or JSON-LD url).
 */
const demoBase = (import.meta.env.PUBLIC_SITE_URL as string | undefined)?.replace(/\/+$/, '');
export const assetBase: string | undefined = isProduction ? PRODUCTION_URL : demoBase || undefined;

/**
 * Path the site is served from: PUBLIC_BASE_PATH at build time (for example a sub-folder on a test host), "/" when the
 * site lives at the domain root. Every root-relative URL in the source goes through `withBase`.
 */
const basePath = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
export const withBase = (path: string): string => `${basePath}${path.startsWith('/') ? path : `/${path}`}`;

/** Video location comes from configuration; local default for development. */
export const videoSrc: string = import.meta.env.PUBLIC_VIDEO_SRC || withBase('/video/intro.mp4');

/** Names of the shared page state (mirrors the Spline `kettlebellLifted` variable, wired up in milestone 03). */
export const PAGE_STATE_ATTRIBUTE = 'data-state';
export const PAGE_STATES = { default: 'default', active: 'active' } as const;

/** Promo bar: timing and animation values in one place. It is shown on every page load (reloads included), once per load. */
export const promoBar = {
  /** Delay after the page has loaded before the bar slides in. */
  firstDelayMs: 3000,
  /** How long the bar stays visible. */
  visibleMs: 6000,
  /** Slide-down + fade-in and fade-out + slide-up durations. */
  enterMs: 600,
  exitMs: 500,
} as const;

/**
 * Video modal: until `autoplayDelayMs` after the modal has opened (not after the video has loaded) the video area
 * stays plain black; then the video is revealed and playback starts. The caption below fades out `captionHideMs`
 * after the modal has opened. Both timers restart on every opening and stop when the modal closes.
 */
export const videoModal = {
  autoplayDelayMs: 800,
  captionHideMs: 10000,
} as const;

/**
 * The scene file is imported as a build asset (`?url`): the build emits it as `_astro/scene-v6-both.<hash>.splinecode`
 * with a content hash and the base path. The hash is generated, never typed: a new scene file gets a new URL
 * automatically, so the file can be cached for a long time without ever serving a stale scene.
 */
import sceneAssetUrl from '../assets/scene-v6-both.splinecode?url';
export const splineSceneUrl: string = sceneAssetUrl;

/**
 * Folder the Spline runtime loads its WebAssembly files from (the Draco decoder and the optional physics/boolean/bevel/
 * ui modules). Without it the runtime fetches them from third-party CDNs (www.gstatic.com, cdn.spline.design, unpkg.com).
 * The files are generated into `public/wasm/` by `scripts/sync-assets.mjs`.
 */
export const wasmPath = withBase('/wasm');

/**
 * The scene owns the lift/colour interaction; the page only mirrors its `kettlebellLifted` variable into the shared
 * page state (`data-state` on <html>). The runtime has no change event for variables, so it is read at `pollMs`
 * intervals (cheap, paused while the tab is hidden) and right after the scene's own hover/tap events.
 */
export const sceneState = {
  variableName: 'kettlebellLifted',
  pollMs: 80,
} as const;

/**
 * Phones (below `maxWidth`): the scene composition is shown smaller by moving the scene camera back at runtime
 * (the .splinecode file is untouched). The canvas stays full size, so the scene's own backdrop fills the viewport.
 * `dollyBack` is the distance (scene units) the camera is pulled back along its viewing direction; 365 makes the
 * kettlebell about 80 % of its normal size. Set it to 0 to switch the effect off.
 */
export const sceneMobile = {
  maxWidth: 767.98,
  dollyBack: 365,
  cameraName: 'Play_Camera',
} as const;

/** Contact details shown in the info banner (only what is in the approved design). */
export const contact = {
  phoneDisplay: '+36 30 98 33 750',
  phoneHref: '+36309833750',
  /** Public contact e-mail (provided by the design owner); PUBLIC_CONTACT_EMAIL overrides it. */
  email: (import.meta.env.PUBLIC_CONTACT_EMAIL as string | undefined) || 'kettlebellszeged@gmail.com',
} as const;
