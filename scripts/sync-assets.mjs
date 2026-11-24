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
  // (the Spline scene is imported by src/config.ts as a hashed build asset, it is not copied here)
  ['strongfirst-logo.svg', 'img/strongfirst-logo.svg'],
  ['favicon.svg', 'img/favicon.svg'],
  ['favicon.png', 'img/favicon.png'],
  ['apple-touch-icon.png', 'img/apple-touch-icon.png'], // 180x180, derived from favicon.png
  ['og-image.png', 'img/og-image.png'],
  ['BasementGrotesque-Black.otf', 'fonts/BasementGrotesque-Black.otf'],
  // Draco decoder for the Spline runtime (self-hosted instead of www.gstatic.com, see assets/draco/README.md)
  ['draco/draco_wasm_wrapper.js', 'wasm/draco_wasm_wrapper.js'],
  ['draco/draco_decoder.wasm', 'wasm/draco_decoder.wasm'],
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

// The Spline runtime loads its other WebAssembly modules (physics, boolean, bevel, hana-ui, navmesh, process) from
// `wasmPath` too, and from a CDN when none is set. The scene does not need them today; they are taken from the installed
// runtime package (always the matching version, nothing downloaded) so that a future scene that does need one never hits
// a missing file. They are only requested by the runtime when the scene uses them.
const runtimeBuild = join(root, 'node_modules', '@splinetool', 'runtime', 'build');
const wasmFiles = existsSync(runtimeBuild) ? readdirSync(runtimeBuild).filter((f) => f.endsWith('.wasm')) : [];
if (wasmFiles.length === 0) {
  console.error('sync-assets: no .wasm files found in node_modules/@splinetool/runtime/build (run npm install)');
  process.exit(1);
}
mkdirSync(dst('wasm'), { recursive: true });
for (const file of wasmFiles) cpSync(join(runtimeBuild, file), dst(`wasm/${file}`));
console.log(`sync-assets: ${wasmFiles.length} runtime .wasm files copied to public/wasm/`);

// The video is intentionally NOT copied here (it never goes through Git).
// Create the web version with scripts/encode-video.sh and upload it separately.
if (!existsSync(dst('video/intro.mp4'))) {
  console.warn('sync-assets: public/video/intro.mp4 not found (run scripts/encode-video.sh for local development).');
}
