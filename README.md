# ASMA DAILY

Premium Islamic daily wallpaper web app — one of the **99 Names of Allah** each day, with an iPhone Lock Screen PNG endpoint for Apple Shortcuts.

## Features

- Mobile-first dashboard matching the gold / navy circular visualization design
- Deterministic daily rotation in **Asia/Tashkent**
- `GET /api/wallpaper` → real `image/png` (1179×2556)
- One-tap **iPhone'ga o'rnatish** (iCloud Shortcut link via env)
- Netlify-ready Next.js App Router deployment
- No authentication required

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Sharp · Vitest · Netlify

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
|----------|---------|
| `DAILY_ANCHOR_DATE` | Day 1 of the cycle (`YYYY-MM-DD`, default `2025-01-01`) |
| `NEXT_PUBLIC_SITE_URL` | Public origin for `/setup` copyable API URL |
| `NEXT_PUBLIC_SHORTCUT_INSTALL_URL` | iCloud Shortcuts share link for one-tap install |

## API

| Endpoint | Response |
|----------|----------|
| `GET /api/daily` | Today's name JSON |
| `GET /api/daily?date=YYYY-MM-DD` | Name for date |
| `GET /api/wallpaper` | Today's PNG |
| `GET /api/wallpaper?date=YYYY-MM-DD` | PNG for date |
| `GET /api/names` | All 99 names |
| `GET /api/names/[id]` | Single name (`1`–`99`) |

Verify PNG locally:

```bash
curl -sI http://localhost:3000/api/wallpaper
curl -s http://localhost:3000/api/wallpaper -o /tmp/asma.png
file /tmp/asma.png
```

## Tests

```bash
npm test
```

Covers first/second/99th/100th day, leap years, and Tashkent midnight boundaries.

## iPhone Shortcuts

1. Set `NEXT_PUBLIC_SHORTCUT_INSTALL_URL` to your shared Shortcut, **or** follow `/setup`.
2. Shortcut should `GET` `{SITE}/api/wallpaper` and set / save Lock Screen wallpaper.
3. Add a Personal Automation (Time of Day) to run daily.

The website cannot change the Lock Screen by itself — Shortcuts must.

## Netlify deploy

1. Connect the repo to Netlify.
2. Build command: `npm run build` (see `netlify.toml`).
3. Set env vars in the Netlify UI.
4. Confirm: `curl -sI https://YOUR_SITE/api/wallpaper` returns `image/png`.

## Pages

- `/` — daily dashboard
- `/names` — all 99
- `/names/[slug]` — detail
- `/wallpaper` — PNG preview + download
- `/setup` — Shortcuts guide + install CTA
- `/about` — project info

## Content note

Arabic spellings follow the classical Asma ul-Husna sequence. Uzbek meanings are concise conventional glosses for daily reflection — not fatwa or exhaustive tafsir.
