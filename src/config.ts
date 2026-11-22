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

/** Promo bar timing (milestone 03), in one place. */
export const promoBar = {
  firstDelayMs: 5000,
  visibleMs: 6000,
  repeatMs: 45000,
} as const;

export const splineSceneUrl = '/spline/scene-v3.splinecode';

/** Contact details shown in the info banner (only what is in the approved design). */
export const contact = {
  phoneDisplay: '+36 30 98 33 750',
  phoneHref: '+36309833750',
  /** Public contact e-mail (provided by the design owner); PUBLIC_CONTACT_EMAIL overrides it. */
  email: (import.meta.env.PUBLIC_CONTACT_EMAIL as string | undefined) || 'kettlebellszeged@gmail.com',
} as const;
