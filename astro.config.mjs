import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Environment is selected by configuration only (see .env.example and src/config.ts).
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const isProduction = (process.env.PUBLIC_ENV ?? env.PUBLIC_ENV) === 'production';

export default defineConfig({
  output: 'static',
  // The production site URL is only set for the production build (used for canonical, sitemap, etc.).
  site: isProduction ? 'https://kettlebellszeged.hu' : undefined,
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
