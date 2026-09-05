# Margherita Index — the Big Mac Index for real pizza

One identical product — a Margherita at an AVPN-certified pizzeria — priced across
37 world markets against Naples (€6.00). Big Mac methodology (implied PPP +
over/under valuation vs market FX), Italian certification as the uniformity
guarantee instead of a chain.

**Live:** production deploys from `main` via Vercel (git-connected).
**Repo:** `https://github.com/causius0/pizza-index`

## What's in the app (`app/`, TypeScript + Vite, no backend)

- 3D globe (globe.gl, lazy-loaded) color-coded vs Naples: gold base, cream→pomodoro
  for pricier, grey for no-data. Countries clickable; **city dots** mark every priced
  pizzeria — hover names it, click opens its market.
- Sortable market table (€/$ toggle, search, keyboard-operable) with certified vs
  priced counts per market.
- Per-market detail: observations with website + certification URL + menu source +
  confidence, FX line with source, full certified census.
- Wage section: mean (+ median where sourced: US, UK, France, Sweden, Finland) monthly pay with
  labeled gross/net basis, and hours-to-buy one Margherita on a 176-hour month.
- Method section, editorial broadsheet design, mobile-safe.

## Data rules (no fabrication)

- Only AVPN-directory venues enter averages — no exceptions. Missing prices stay
  `pending`, thin figures carry MED/LOW badges, never HIGH.
- `app/src/data/observations.ts` — pizzerias (with coordinates) + one observation
  each: website, certification URL, menu source URL, date, confidence.
- `data/avpn-members.json` — 886 AVPN members scraped from
  `pizzanapoletana.org/en/associati` (Sep 2026), bundled into the app.
- FX: ECB euro reference rates 2026-09-03; indicative crosses labeled as such;
  RUB via Central Bank of Russia (ECB suspended it).
- Italy enters as three cities: Naples (base), Rome, Milan.

## Dev

```bash
cd app
npm install
npm run dev      # local dev server with HMR
npm run build    # production bundle into app/dist/
node audit.mjs         # headless-Chrome component audit (needs local Chrome)
node verify-globe.mjs  # globe mount/paint check
```

## Deploy

Vercel project `pizza-index` is git-connected: push to `main` → production.
Manual: `npx vercel --prod` from repo root (`vercel.json` builds `app/`, serves
`app/dist/`). Static fallback: upload `app/dist/` anywhere.
