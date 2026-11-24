import type { APIRoute } from 'astro';
import { isProduction, PRODUCTION_URL } from '../config';

// Per environment. Crawling is allowed everywhere (the demo has to be fetchable so the crawler can read its
// `noindex` tag); only the production file references the sitemap.
export const GET: APIRoute = () => {
  const lines = ['User-agent: *', 'Allow: /'];
  if (isProduction) lines.push('', `Sitemap: ${new URL('/sitemap.xml', PRODUCTION_URL).href}`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
