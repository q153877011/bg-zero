![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

# BG-Zero

**AI-powered background removal tool that runs entirely in your browser.**

Three AI engines, 100% local processing, no image upload, no watermark. Your images never leave your device.

## Features

- **Three AI Engines**: imgly (IS-Net), Transformers.js (RMBG-1.4), rembg-web (7+ models)
- **100% Local Processing**: All AI inference runs in-browser via WebAssembly/WebGPU
- **Privacy First**: Images never leave your device - zero server upload
- **Auto + Manual Modes**: One-click AI removal or precise color-pick with Flood Fill
- **Free & Open Source**: AGPL-3.0 licensed, no watermarks, no limits

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Auth**: better-auth + Google OAuth
- **Database**: PostgreSQL
- **Email**: Resend
- **i18n**: next-intl (English + Chinese)
- **Styling**: Tailwind CSS 4

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `RESEND_KEY` | Resend API key for emails |
| `RESEND_FROM` | Sender email address |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SUPER_ADMIN_EMAILS` | Comma-separated admin emails |
| `NEXT_PUBLIC_MODEL_CDN_URL` | (Optional) CDN for AI model files |

## License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

This means:
- You can freely use, modify, and distribute this software
- If you run a modified version as a network service, you must make your source code available
- All derivative works must also be AGPL-3.0 licensed

See [LICENSE](./LICENSE) for the full text.

### Third-Party Licenses

This project uses dependencies with various open source licenses. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for details.

> **Note:** The Transformers.js engine uses the RMBG-1.4 model which is licensed under CC BY-NC 4.0 (non-commercial use only).

## Security

To report a security vulnerability, please email security@bg-zero.tech. See [SECURITY.md](./SECURITY.md) for our full security policy.

## Contributing

Contributions are welcome! Please ensure any contributions are compatible with the AGPL-3.0 license.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Made with care. Local first, privacy always.
