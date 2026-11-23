// Central configuration. Nothing environment-specific is hardcoded elsewhere.

/** Final production domain (the only absolute URL in the source). */
export const PRODUCTION_URL = 'https://kettlebellszeged.hu';

export type SiteEnv = 'demo' | 'production';

/** Selected only by configuration (PUBLIC_ENV). Anything but "production" is treated as demo (noindex). */
export const siteEnv: SiteEnv = import.meta.env.PUBLIC_ENV === 'production' ? 'production' : 'demo';
export const isProduction = siteEnv === 'production';

/** Canonical base URL: the final domain in production, none on the demo. */
export const canonicalBase: string | undefined = isProduction ? PRODUCTION_URL : undefined;

/** Video location comes from configuration; local default for development. */
export const videoSrc: string = import.meta.env.PUBLIC_VIDEO_SRC || '/video/intro.mp4';

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

export const splineSceneUrl = '/spline/scene-v4.splinecode';

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
