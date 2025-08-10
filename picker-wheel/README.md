# Picker Wheel (Next.js + TypeScript)

A modern, SEO-optimized Picker Wheel web app. Add options, spin a visual wheel, and get a random winner. Mobile-first, accessible, and PWA-ready.

## Tech Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Jest + Testing Library
- next-sitemap for sitemap/robots
- LocalStorage for persistence

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start production server:
```bash
npm start
```

5. Run tests:
```bash
npm test
```

## Environment Variables
- `SITE_URL`: The canonical site URL (used for metadata and sitemap)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: If set, Plausible analytics is injected
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: If set (and Plausible not set), GA4 is injected

## SEO
- Server components (App Router) with Metadata API
- `next-sitemap` generates `sitemap.xml` and `robots.txt` after build

## PWA
- Minimal `manifest.webmanifest` and app icon
- Add a service worker later if needed using `next-pwa` or custom SW

## Monetization
- `AdSlot` component is a placeholder for ad networks (e.g., Google AdSense)

## Project Structure
- `src/app` – App Router pages and layout
- `src/components` – UI components
- `src/lib` – Framework-agnostic logic (wheel math, colors)
- `src/hooks` – Reusable hooks (localStorage)

## Deploy
- One-click deploy to Vercel. Ensure `SITE_URL` is configured in project settings.