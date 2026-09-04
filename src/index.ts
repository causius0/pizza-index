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

const BASE_COUNTRY = 'IT';
const BASE_PRICE_EUR = 6.0;

const members: AvpnMember[] = JSON.parse(
  readFileSync(new URL('../data/avpn-members.json', import.meta.url), 'utf-8'),
);

const pricedById = new Map(PRICED.map((p) => [p.id, p]));
const obsByPizzeria = new Map<string, typeof OBSERVATIONS[number]>();
for (const o of OBSERVATIONS) obsByPizzeria.set(o.pizzeriaId, o);

// Certified census per country (AVPN directory + priced extras)
const census = new Map<string, { n: number; names: string[] }>();
for (const m of members) {
  const iso = NATION_TO_ISO[m.nation];
  if (!iso) continue;
  const e = census.get(iso) ?? { n: 0, names: [] };
  e.n += 1;
  if (e.names.length < 60) e.names.push(`${m.name} (${m.city}) [#${m.number}]`);
  census.set(iso, e);
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
  const overUnderPct =
    impliedPpp !== null && fx ? ((impliedPpp - fx) / fx) * 100 : null;
  rows.push({
    country: c, currency: curr,
    nCertified: census.get(c)?.n ?? 0, nPriced: prices.length,
    avgLocal, avgEur, impliedPpp, actualFx: fx, overUnderPct,
  });
}

mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/index.json', import.meta.url), JSON.stringify({
  fxDate: FX_DATE, base: { country: BASE_COUNTRY, priceEur: BASE_PRICE_EUR },
  rows,
  pizzerias: PRICED, observations: OBSERVATIONS,
}, null, 1));

const fmt = (v: number | null, d = 2) =>
  v === null ? '—' : v.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
const rowHtml = rows.map((r) => `<tr><td>${r.country}</td><td>${r.currency}</td><td>${r.nCertified}</td><td>${r.nPriced}</td><td>${fmt(r.avgLocal)}</td><td>${fmt(r.avgEur)}</td><td>${r.overUnderPct === null ? '—' : r.overUnderPct.toFixed(0) + '%'}</td></tr>`).join('\n');
const listHtml = [...census.entries()].map(([c, e]) =>
  `<h3>${c} — ${e.n} AVPN-certified</h3><p><small>${e.names.join(' · ')}</small></p>`).join('\n');

writeFileSync(new URL('../dist/index.html', import.meta.url), `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Margherita Pizza Index (generated)</title>
<style>body{font-family:system-ui,sans-serif;max-width:1000px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px 8px;text-align:left}th{background:#f0f0f0}</style>
</head><body>
<h1>🍕 Margherita Pizza Index (generated ${FX_DATE})</h1>
<p>Base: Italy (Naples) €${BASE_PRICE_EUR}. Country figure = <strong>mean Margherita price across AVPN-certified pizzerias with verified observations</strong>. Kestè NYC is listed but excluded from the US average (not in AVPN directory).</p>
<table><tr><th>Country</th><th>Ccy</th><th># certified</th><th># priced</th><th>Avg local</th><th>Avg EUR</th><th>vs Naples</th></tr>
${rowHtml}</table>
<h2>Certified census (AVPN directory, Sep 2026)</h2>
${listHtml}
<h2>Priced pizzerias (website + certification)</h2>
<ul>${PRICED.map((p) => `<li><strong>${p.name}</strong> (${p.city}, ${p.country}) — ${p.website ? `<a href="${p.website}">website</a> · ` : ''}<a href="${p.certification.certUrl}">certification (${p.certification.source}${p.certification.memberNumber ? ' #' + p.certification.memberNumber : ''})</a></li>`).join('\n')}</ul>
</body></html>`);

console.log('countries:', rows.length);
for (const r of rows) {
  console.log(`${r.country} certified=${r.nCertified} priced=${r.nPriced} avg=${fmt(r.avgLocal)} ${r.currency} avgEur=${fmt(r.avgEur)} vsNaples=${r.overUnderPct === null ? '—' : r.overUnderPct.toFixed(0) + '%'}`);
}
