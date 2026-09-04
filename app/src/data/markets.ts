import { FX } from './fx.ts';
import { PIZZERIAS, OBSERVATIONS, type Pizzeria, type Observation } from './observations.ts';
import { censusByCountry, censusByCity } from './census.ts';

export interface Market {
  key: string; // ISO, or IT-NAP / IT-ROM / IT-MIL
  label: string;
  iso: string; // globe polygon ISO
  kind: 'country' | 'city';
  currency: string;
  nCertified: number;
  nPriced: number;
  avgLocal: number | null;
  avgEur: number | null;
  overUnderPct: number | null; // vs Naples base
}

export const BASE_KEY = 'IT-NAP';
export const BASE_EUR = 6.0;

const IT_CITIES = [
  { key: 'IT-NAP', label: 'Naples', needle: 'napoli' },
  { key: 'IT-ROM', label: 'Rome', needle: 'roma' },
  { key: 'IT-MIL', label: 'Milan', needle: 'milano' },
] as const;

const COUNTRY_LABELS: Record<string, string> = {
  GB: 'United Kingdom', FR: 'France', DE: 'Germany', ES: 'Spain',
  NL: 'Netherlands', CN: 'China', AE: 'UAE', QA: 'Qatar', US: 'United States',
  CA: 'Canada', BR: 'Brazil', AR: 'Argentina', CL: 'Chile', CO: 'Colombia',
};

const byId = new Map<string, Pizzeria>(PIZZERIAS.map((p) => [p.id, p]));

function avgFor(market: string): { prices: number[]; currency: string } {
  const prices: number[] = [];
  let currency = '';
  for (const o of OBSERVATIONS) {
    if (o.includeInAverage === false) continue;
    const p = byId.get(o.pizzeriaId);
    if (!p || p.market !== market || p.certification.source !== 'AVPN') continue;
    prices.push(o.price);
    currency = o.currency;
  }
  return { prices, currency };
}

function toRow(key: string, label: string, iso: string, kind: Market['kind'], nCertified: number): Market {
  const { prices, currency } = avgFor(key);
  const avgLocal = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
  const fx = currency && FX[currency] ? FX[currency].perEur : null;
  const avgEur = avgLocal !== null && fx ? avgLocal / fx : null;
  const implied = avgLocal !== null ? avgLocal / BASE_EUR : null;
  const overUnderPct = implied !== null && fx ? ((implied - fx) / fx) * 100 : null;
  return { key, label, iso, kind, currency, nCertified, nPriced: prices.length, avgLocal, avgEur, overUnderPct };
}

export function computeMarkets(): Market[] {
  const census = censusByCountry();
  const out: Market[] = IT_CITIES.map((c) =>
    toRow(c.key, c.label, 'IT', 'city', censusByCity(c.needle).length));
  const isos = [...census.keys()].filter((i) => i !== 'IT').sort();
  for (const iso of isos) {
    out.push(toRow(iso, COUNTRY_LABELS[iso] ?? iso, iso, 'country', census.get(iso)!.length));
  }
  return out;
}

/** Globe polygon value per ISO (Italy = mean of its three cities). */
export function globeValueByIso(markets: Market[]): Map<string, number> {
  const m = new Map<string, number>();
  const itVals = markets.filter((x) => x.iso === 'IT' && x.overUnderPct !== null);
  if (itVals.length) {
    m.set('IT', itVals.reduce((a, b) => a + (b.overUnderPct ?? 0), 0) / itVals.length);
  }
  for (const x of markets) {
    if (x.kind === 'country' && x.overUnderPct !== null) m.set(x.iso, x.overUnderPct);
  }
  return m;
}

export function observationsFor(market: string): { p: Pizzeria; o: Observation }[] {
  return OBSERVATIONS.filter((o) => byId.get(o.pizzeriaId)?.market === market)
    .map((o) => ({ p: byId.get(o.pizzeriaId)!, o }));
}

export function membersFor(market: Market): { name: string; city: string; number: string; url: string }[] {
  if (market.kind === 'city') {
    const needle = market.key === 'IT-NAP' ? 'napoli' : market.key === 'IT-ROM' ? 'roma' : 'milano';
    return censusByCity(needle).map((x) => ({ name: x.name, city: x.city, number: x.number, url: x.memberUrl.trim() }));
  }
  const census = censusByCountry();
  return (census.get(market.iso) ?? []).map((x) => ({ name: x.name, city: x.city, number: x.number, url: x.memberUrl.trim() }));
}
