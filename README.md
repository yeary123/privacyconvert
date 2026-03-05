# PrivacyConvert

Privacy-first file converter that runs **100% in the browser**. Your files never leave your device — no upload to any server. Supports images (AVIF, WebP, PNG, JPEG), audio (WAV, MP3, OGG), video (MP4, WebM, GIF), and documents (PDF, DOCX, HTML). Free for single-file conversion; optional Pro for batch and history.

**Tech:** Next.js 16, React 19, FFmpeg.wasm, Canvas API, Supabase (auth), PayPal (payments).

---

## Getting started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Run locally

```bash
# Clone and install
git clone https://github.com/yeary123/privacyconvert.git
cd privacyconvert
npm install

# Copy env template and add your keys (see below)
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works without any env vars for basic conversion; set variables in `.env.local` to enable login, PayPal, newsletter, and analytics.

### Environment variables

See **[docs/ENV_KEYS.md](docs/ENV_KEYS.md)** for the full list. Summary:

| Purpose        | Variables |
|----------------|-----------|
| Site URL       | `NEXT_PUBLIC_SITE_URL` |
| Auth / users   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Payments       | `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, etc. |
| Newsletter     | `BREVO_API_KEY` or ConvertKit / Buttondown |
| Analytics      | `NEXT_PUBLIC_GA_ID` (optional) |
| Contact email  | `NEXT_PUBLIC_CONTACT_DOMAIN` (optional, for forks) |

Never commit `.env.local` or real keys. Use `.env.example` as a template only.

---

## Project structure

- **`app/`** — Next.js App Router (pages, API routes, sitemaps).
- **`components/`** — React UI and converter components.
- **`lib/`** — Conversion logic (FFmpeg, Canvas, PDF, docs), Supabase, schema.
- **`store/`** — Client state (Zustand): auth, Pro.
- **`docs/`** — Architecture, env keys, adding converters, Supabase/email setup.

For architecture and how to add a new converter, see **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** and **[docs/ADD_CONVERTER.md](docs/ADD_CONVERTER.md)**.

---

## Scripts

| Command       | Description        |
|---------------|--------------------|
| `npm run dev` | Start dev server   |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint         |

---

## Contributing

Issues and pull requests are welcome. Please read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ADD_CONVERTER.md](docs/ADD_CONVERTER.md) if you plan to add or change conversion tools.

---

## License

MIT. See [LICENSE](LICENSE).
