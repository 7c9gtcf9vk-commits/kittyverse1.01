# KittyVerse

A dreamy digital space inspired by Hello Kitty & Friends. Explore characters, create projects, and journal your thoughts in a pastel macaron world.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn UI (Base UI) |
| Animation | Framer Motion |
| Carousel | Swiper 14 |
| State | Zustand 5 |
| i18n | react-i18next + i18next |
| Forms | React Hook Form + Zod |

## Features

- **Hero Banner** — multimedia carousel with image/video/mixed types, autoplay video support
- **Floating Stickers** — animated SVG stickers with fade effects
- **Character Gallery** — Sanrio character showcase in 2x4 grid
- **Featured Cards** — glassmorphism content cards
- **Admin Panel** — full CRUD for banners, media, stickers, and theme settings
- **i18n** — Chinese (zh-CN) and English (en-US) with automatic language detection
- **Design System** — macaron color palette (blue/pink/yellow/green/purple/orange), Apple-style typography

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
kittyverse/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin panel routes
│   │   │   ├── hero/           # Hero banner management
│   │   │   ├── media/          # Media resource management
│   │   │   ├── stickers/       # Sticker management
│   │   │   └── theme/          # Theme settings
│   │   ├── layout.tsx          # Root layout + SEO metadata
│   │   └── page.tsx            # Home page
│   ├── features/               # Feature-first modules
│   │   ├── home/               # Home page components
│   │   └── hero/               # Hero banner components
│   ├── stores/                 # Zustand state stores
│   ├── locales/                # i18n translation files
│   │   ├── zh-CN/
│   │   └── en-US/
│   ├── components/             # Shared components
│   └── lib/                    # Utility functions
├── public/                     # Static assets
│   ├── robots.txt
│   └── sitemap.xml
├── docs/                       # Project documentation
├── scripts/                    # Utility scripts
├── wrangler.toml               # Cloudflare Pages config
└── .github/workflows/ci.yml    # GitHub Actions CI
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO metadata | `https://kittyverse.app` |

## Deployment

### Cloudflare Pages

Framework preset: **Next.js (Static HTML Export)**

```bash
npm run build
# Output directory: out/
```

Cloudflare Pages 配置（`wrangler.toml`）：
- Build command: `npm run build`
- Output directory: `out`
- Node version: 20+

### Vercel / Other

Standard Next.js build:

```bash
npm run build
npm start
```

## Development

### Lint

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## Git Setup (Manual)

```bash
cd E:\kittyverse
git init
git add .
git commit -m "Initial commit: KittyVerse MVP with i18n, multimedia banner, admin panel"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## License

[MIT](LICENSE)

## Author

KittyVerse Team
