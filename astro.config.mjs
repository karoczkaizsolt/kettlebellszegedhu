import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Environment is selected by configuration only (see .env.example and src/config.ts).
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const isProduction = (process.env.PUBLIC_ENV ?? env.PUBLIC_ENV) === 'production';

// Sub-path the site is served from (build-time configuration only, e.g. PUBLIC_BASE_PATH=/some/folder); default: root.
const rawBase = process.env.PUBLIC_BASE_PATH ?? env.PUBLIC_BASE_PATH ?? '';
const base = rawBase.trim() ? `/${rawBase.trim().replace(/^\/+|\/+$/g, '')}` : '/';

// robots.txt for every environment; sitemap.xml only for the production build (the demo has none).
const seoFiles = {
  name: 'seo-files',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({ pattern: '/robots.txt', entrypoint: './src/seo/robots.txt.ts' });
      if (isProduction) injectRoute({ pattern: '/sitemap.xml', entrypoint: './src/seo/sitemap.xml.ts' });
    },
  },
};

export default defineConfig({
  integrations: [seoFiles],
  output: 'static',
  base,
  // The production site URL is only set for the production build (used for canonical, sitemap, etc.).
  site: isProduction ? 'https://kettlebellszeged.hu' : undefined,
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
