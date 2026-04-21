![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Privacy: Local First](https://img.shields.io/badge/Privacy-Local%20First-10b981)

# BG-Zero

**Remove image backgrounds instantly — right inside your browser.**

BG-Zero is a free, open source, privacy-first background removal tool. Your images never leave your device: all AI inference happens locally via WebAssembly and WebGPU. No upload. No watermark. No signup required.

[🌐 Live site](https://www.bg-zero.online) · [💻 Source code](https://github.com/) · [📄 License: AGPL-3.0](./LICENSE)

---

## Why BG-Zero?

| | BG-Zero | Typical online background removers |
|---|---|---|
| Where your image is processed | **Your browser** | Remote servers |
| Image upload required | **No** | Yes |
| Watermark | **No** | Often yes |
| Image size / count limit | **No** | Usually yes |
| Price | **Free forever** | Freemium / paid |
| Works offline (after first load) | **Yes** | No |
| Open source | **Yes (AGPL-3.0)** | Rarely |

---

## What it does

### Auto Mode — one-click AI removal

Upload an image, pick an engine, and get a transparent PNG back in seconds. Three AI engines are bundled so you can choose the best fit for your image:

- **imgly** — IS-Net model, well-balanced quality and speed. Recommended default.
- **Transformers.js** — RMBG-1.4 model running via Hugging Face Transformers. Great for portraits and complex edges. WebGPU-accelerated when available.
- **rembg-web** — 7+ specialized models to pick from:
  - `u2netp` (4.7 MB, ~1s) — ultra-fast preview
  - `silueta` — background-optimized
  - `u2net_human_seg` — portrait specialist
  - `isnet-general-use` — high-precision general
  - `isnet-anime` — anime & illustration
  - `u2net` — full-precision general model

All models download on-demand and are cached by the browser for repeat visits.

### Manual Mode — pixel-level precision

For tricky images where AI struggles (logos, line art, uniform backgrounds), switch to manual mode:

- **Color picker** — click any background pixel to sample its color
- **Flood Fill** — smart color-based removal with adjustable tolerance
- **Mask Brush** — paint a protected region to preserve details the algorithm might eat
- **Eraser** — remove parts of the mask
- **Undo / Redo** — full history, no destructive edits
- **Toggle mask visibility** — see exactly what will be kept vs. removed

### Workflow

1. **Upload** — drag & drop, click to browse, or paste with `Ctrl+V` (or `Cmd+V`). Supports JPG, PNG, WebP, GIF, BMP, TIFF up to 25 MB / 16 megapixels.
2. **Process** — pick auto or manual mode, tweak settings if needed.
3. **Download** — transparent PNG, full original resolution, no watermark.

---

## Privacy & security

- **Zero server upload.** Images stay in your browser's memory from start to finish.
- **WebAssembly + WebGPU** for native-speed inference without sending data anywhere.
- **COOP/COEP headers** enabled for `SharedArrayBuffer` multi-threading.
- **Strict CSP** on every route.
- Only anonymous usage metrics (no image content) are collected to improve the tool.

Read the full [Privacy Policy](https://www.bg-zero.online/privacy) and [Terms of Service](https://www.bg-zero.online/terms).

---

## Language support

Interface available in **English** and **简体中文**, auto-detected from browser preferences.

---

## Built with

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · better-auth · PostgreSQL · next-intl · @imgly/background-removal · @huggingface/transformers · @bunnio/rembg-web

---

## License

Released under the [GNU Affero General Public License v3.0](./LICENSE). If you run a modified version as a network service, you must make your source code available under the same license. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for dependency licenses.

> The Transformers.js engine uses the RMBG-1.4 model, which is licensed under CC BY-NC 4.0 (non-commercial use only).

## Security

Found a vulnerability? Please email **security@bg-zero.online**. See [SECURITY.md](./SECURITY.md).

## Report abuse

Report misuse of the service to **abuse@bg-zero.online**.

---

Made with care. Local first, privacy always.
