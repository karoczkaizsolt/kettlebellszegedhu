// Copies runtime assets from the untouched source folder `assets/` into `public/`.
// The sources in `assets/` are never modified. The copies in `public/` are generated
// (git-ignored) and recreated before every dev/build run.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = (p) => join(root, 'assets', p);
const dst = (p) => join(root, 'public', p);

const copies = [
  ['scene-v4.splinecode', 'spline/scene-v4.splinecode'],
  ['strongfirst-logo.svg', 'img/strongfirst-logo.svg'],
  ['BasementGrotesque-Black.otf', 'fonts/BasementGrotesque-Black.otf'],
];
for (const file of readdirSync(src('fonts'))) {
  if (file.endsWith('.woff2')) copies.push([`fonts/${file}`, `fonts/${file}`]);
}

for (const [from, to] of copies) {
  if (!existsSync(src(from))) {
    console.error(`sync-assets: missing source assets/${from}`);
    process.exit(1);
  }
  mkdirSync(dirname(dst(to)), { recursive: true });
  cpSync(src(from), dst(to));
}
console.log(`sync-assets: ${copies.length} files copied to public/`);

// The video is intentionally NOT copied here (it never goes through Git).
// Create the web version with scripts/encode-video.sh and upload it separately.
if (!existsSync(dst('video/intro.mp4'))) {
  console.warn('sync-assets: public/video/intro.mp4 not found (run scripts/encode-video.sh for local development).');
}
