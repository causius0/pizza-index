import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { FX, FX_DATE } from './fx.js';
import { PRICED, OBSERVATIONS } from './prices.js';
import type { CountryIndex } from './types.js';

interface AvpnMember {
  number: string; name: string; memberUrl: string;
  city: string; province: string; region: string; nation: string;
}

// AVPN nations (Italian labels) -> ISO country
const NATION_TO_ISO: Record<string, string> = {
  Italia: 'IT', 'Regno Unito': 'GB', Francia: 'FR', Germania: 'DE', Spagna: 'ES',
  'Paesi Bassi (Olanda)': 'NL', Cina: 'CN', 'Emirati Arabi Uniti': 'AE', Qatar: 'QA',
  "Stati Uniti d'America - USA": 'US', Canada: 'CA', Brasile: 'BR', Argentina: 'AR',
  Cile: 'CL', Colombia: 'CO',
};

const COUNTRY_NAMES: Record<string, string> = {
  IT: 'Italy', GB: 'United Kingdom', FR: 'France', DE: 'Germany', ES: 'Spain',
  NL: 'Netherlands', CN: 'China', AE: 'UAE', QA: 'Qatar', US: 'USA',
  CA: 'Canada', BR: 'Brazil', AR: 'Argentina', CL: 'Chile', CO: 'Colombia',
};

const BASE_COUNTRY = 'IT';
const BASE_PRICE_EUR = 6.0;

const members: AvpnMember[] = JSON.parse(
  readFileSync(new URL('../data/avpn-members.json', import.meta.url), 'utf-8'),
);

const pricedById = new Map(PRICED.map((p) => [p.id, p]));

const census = new Map<string, AvpnMember[]>();
for (const m of members) {
  const iso = NATION_TO_ISO[m.nation];
  if (!iso) continue;
  if (!census.has(iso)) census.set(iso, []);
  census.get(iso)!.push(m);
}

const byCountry = new Map<string, number[]>();
const currByCountry = new Map<string, string>();
for (const o of OBSERVATIONS) {
  if (o.includeInAverage === false) continue;
  const p = pricedById.get(o.pizzeriaId);
  if (!p || p.certification.source !== 'AVPN') continue;
  if (!byCountry.has(p.country)) byCountry.set(p.country, []);
  byCountry.get(p.country)!.push(o.price);
  currByCountry.set(p.country, o.currency);
}

const rows: CountryIndex[] = [];
const countries = [...new Set([...census.keys(), ...byCountry.keys()])].sort();
for (const c of countries) {
  const prices = byCountry.get(c) ?? [];
  const curr = currByCountry.get(c) ?? (c === 'IT' ? 'EUR' : '');
  const avgLocal = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
  const fx = curr && FX[curr] ? FX[curr].perEur : null;
  const avgEur = avgLocal !== null && fx ? avgLocal / fx : null;
  const impliedPpp = avgLocal !== null ? avgLocal / BASE_PRICE_EUR : null;
  const overUnderPct = impliedPpp !== null && fx ? ((impliedPpp - fx) / fx) * 100 : null;
  rows.push({
    country: c, currency: curr,
    nCertified: census.get(c)?.length ?? 0, nPriced: prices.length,
    avgLocal, avgEur, impliedPpp, actualFx: fx, overUnderPct,
  });
}

const out = (p: string) => new URL(`../site/${p}`, import.meta.url);
mkdirSync(out(''), { recursive: true });
writeFileSync(out('index.json'), JSON.stringify({
  fxDate: FX_DATE, base: { country: BASE_COUNTRY, priceEur: BASE_PRICE_EUR },
  rows, pizzerias: PRICED, observations: OBSERVATIONS,
}, null, 1));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fmt = (v: number | null, d = 2) =>
  v === null ? '—' : v.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });

const rowHtml = rows.map((r) => {
  const pct = r.overUnderPct;
  const bar = pct === null ? '—' : `<div style="background:#0a7a0a;height:10px;width:${Math.min(100, Math.abs(pct) / 2)}%"></div>${pct.toFixed(0)}%`;
  return `<tr><td>${r.country} (${COUNTRY_NAMES[r.country] ?? ''})</td><td>${r.currency || '—'}</td><td>${r.nCertified}</td><td>${r.nPriced}</td><td>${fmt(r.avgLocal)}</td><td>${fmt(r.avgEur)}</td><td>${bar}</td></tr>`;
}).join('\n');

const pricedHtml = OBSERVATIONS.map((o) => {
  const p = pricedById.get(o.pizzeriaId)!;
  const excluded = o.includeInAverage === false ? ' <em>(listed, excluded from average)</em>' : '';
  return `<li><strong>${esc(p.name)}</strong> — ${esc(p.city)}, ${p.country}${excluded}<br><small>${o.price} ${o.currency} · ${o.confidence} · ${o.observedAt} · <a href="${o.source.split(' ')[0]}">menu source</a>${p.website ? ` · <a href="${p.website}">website</a>` : ''} · <a href="${p.certification.certUrl}">certification (${p.certification.source}${p.certification.memberNumber ? ' #' + p.certification.memberNumber : ''})</a>${o.note ? ` · ${esc(o.note)}` : ''}</small></li>`;
}).join('\n');

const censusHtml = [...census.entries()].map(([c, ms]) =>
  `<h3 id="c-${c}">${c} (${COUNTRY_NAMES[c] ?? ''}) — ${ms.length} AVPN-certified</h3>\n<ul>${ms.map((m) => `<li>${esc(m.name)} — ${esc(m.city)} <a href="${m.memberUrl.trim()}">AVPN #${m.number}</a></li>`).join('\n')}</ul>`).join('\n');

writeFileSync(out('index.html'), `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Margherita Pizza Index</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;max-width:1024px;margin:2rem auto;padding:0 1rem;line-height:1.5}table{border-collapse:collapse;width:100%;font-size:.92rem}th,td{border:1px solid #999;padding:6px 8px;text-align:left;vertical-align:top}th{background:#f0f0f0}small{color:#444}code{background:#f4f4f4;padding:1px 4px}</style>
</head><body>
<h1>🍕 Margherita Pizza Index</h1>
<p><strong>Method:</strong> <em>The Economist</em>'s Big Mac Index (1986) — one identical product, local price, market FX, PPP vs a base country. Uniformity here comes from <strong>Italian certification</strong>, not a chain: only certified pizzerias count (in NYC: AVPN-listed Ribalta counts; generic slice joints don't). Country figure = <strong>mean Margherita price across AVPN-certified pizzerias with verified observations</strong>.</p>
<p>Base: <strong>Italy (Naples) €${BASE_PRICE_EUR}</strong> · FX: ECB euro reference rates ${FX_DATE} (crosses flagged indicative in <code>index.json</code>) · <a href="index.json">raw data (JSON)</a></p>
<h2>The index</h2>
<table><tr><th>Country</th><th>Ccy</th><th># certified</th><th># priced</th><th>Avg local</th><th>Avg EUR</th><th>vs Naples</th></tr>
${rowHtml}</table>
<h2>Priced observations (website + certification + menu source)</h2>
<ul>${pricedHtml}</ul>
<h2>Certified census — AVPN directory, Sep 2026 (886 members)</h2>
${censusHtml}
</body></html>`);

console.log('countries:', rows.length);
for (const r of rows) {
  console.log(`${r.country} certified=${r.nCertified} priced=${r.nPriced} avg=${fmt(r.avgLocal)} ${r.currency} avgEur=${fmt(r.avgEur)} vsNaples=${r.overUnderPct === null ? '—' : r.overUnderPct.toFixed(0) + '%'}`);
}
