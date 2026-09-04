# 🍕 Margherita Index

The Big Mac Index methodology (PPP via one identical product) applied to the Margherita,
with **Italian certification as the uniformity guarantee**: only certified pizzerias count.

Production app: **TypeScript + Vite** in `app/` — interactive valuation chart, search/sort,
EUR/USD toggle, per-country detail (observations with website + certification + menu source,
full AVPN census), methodology section. No backend, no keys.

- **Certification census**: `data/avpn-members.json` — 886 AVPN members scraped from
  `pizzanapoletana.org/en/associati` (Sep 2026), bundled into the app.
  US 100, Canada 47, UK 38, Brazil 34, Netherlands 22, France 19, Spain 13,
  Germany 9, Chile 7, China 5, UAE 4, Colombia 3, Argentina 2, Qatar 1, Italy 250.
- **Prices**: `app/src/data.ts` — one Margherita observation per pizzeria, each with
  website + certification URL + source + confidence. Country figure = **mean**
  across certified observations (non-AVPN anchors like Kestè NYC are listed but
  excluded from the average).
- `implied PPP = avgLocal / €6.00 (Naples base)`; valuation vs market FX on ECB 2026-09-03.

## Dev

```bash
cd app
npm install
npm run dev      # local dev server with HMR
npm run build    # typecheck + production bundle into app/dist/
```

## Deploy (all wired — pick one)

- **GitHub Pages**: push to `main` → Actions builds `app/` and publishes `app/dist/`
  (Settings → Pages → Source: GitHub Actions).
- **Netlify**: connect repo (`netlify.toml`: base `app/`, build `npm run build`, publish `dist/`).
- **Vercel**: `vercel` from repo root (`vercel.json`: builds `app/`, serves `app/dist`).
- **Anywhere else**: upload `app/dist/` as static files.
