import type { APIRoute } from 'astro';
import { PRODUCTION_URL } from '../config';

// Only injected for the production build (see astro.config.mjs): the demo has no sitemap.
export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL('/', PRODUCTION_URL).href}</loc>
  </url>
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
