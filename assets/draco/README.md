# Draco decoder (self-hosted)

The Spline runtime (`@splinetool/runtime` 2.0.211) decodes Draco-compressed geometry and, by default, loads the
decoder from `https://www.gstatic.com/draco/versioned/decoders/1.5.2/`. These two files are unmodified copies of the
same version, downloaded from that URL on 2026-11-24, so the page no longer makes any request to `www.gstatic.com`.
Draco is Apache-2.0 licensed (https://github.com/google/draco).

| File | Bytes | SHA-256 |
|---|---|---|
| `draco_wasm_wrapper.js` | 59 024 | `3c88a5f378f7895334756a9191c74e7785404224dad74c23293a9644d0963685` |
| `draco_decoder.wasm` | 280 793 | `2626c058d5cb8badfa673ac9c917823eea3f465a282183c898eb7d054581c324` |

`draco_decoder.js` (the non-WebAssembly fallback) is not included: every browser that can run the WebGPU scene supports
WebAssembly.

`scripts/sync-assets.mjs` copies both files to `public/wasm/`, which is the `wasmPath` given to the Spline runtime
(`src/config.ts`). When `@splinetool/runtime` is upgraded, check which Draco version its `setDecoderPath` default points to
(search the runtime for `draco/versioned/decoders`) and replace these files accordingly.
