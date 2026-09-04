# 🍕 Margherita Pizza Index

Big Mac Index methodology (PPP via one identical product) applied to the Margherita,
with **Italian certification as the uniformity guarantee**: only certified pizzerias count.

- **Certification census**: `data/avpn-members.json` — 886 AVPN members scraped from
  `pizzanapoletana.org/en/associati` (Sep 2026). Covers all target markets:
  US 100, Canada 47, UK 38, Brazil 34, Netherlands 22, France 19, Spain 13,
  Germany 9, Chile 7, China 5, UAE 4, Colombia 3, Argentina 2, Qatar 1, Italy 250.
- **Prices**: `src/prices.ts` — one Margherita observation per pizzeria, each with
  website + certification URL + source + confidence. Country figure = **mean**
  across certified observations (non-AVPN anchors like Kestè NYC are listed but
  excluded from the average).
- **Index**: `npm run generate` → `dist/index.json` + `dist/index.html`.
  `implied PPP = avgLocal / €6.00 (Naples base)`; valuation vs market FX on ECB 2026-09-03.

## Run

```bash
npm install
npm run generate
```
