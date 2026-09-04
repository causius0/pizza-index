import membersJson from './data-members.json';

// ---------- Types ----------
export type CertSource = 'AVPN' | 'EccellenzeItaliane' | 'OspitalitaItaliana' | 'Unverified';

export interface Certification {
  source: CertSource;
  memberNumber?: string;
  certUrl: string;
}

export interface Pizzeria {
  id: string;
  name: string;
  city: string;
  country: string; // ISO alpha-2
  website?: string;
  certification: Certification;
}

export interface Observation {
  pizzeriaId: string;
  price: number;
  currency: string;
  source: string;
  sourceUrl?: string;
  observedAt: string;
  confidence: 'HIGH' | 'MED' | 'LOW';
  note?: string;
  includeInAverage?: boolean;
}

export interface AvpnMember {
  number: string;
  name: string;
  memberUrl: string;
  city: string;
  nation: string;
}

export interface CountryRow {
  iso: string;
  name: string;
  currency: string;
  nCertified: number;
  nPriced: number;
  avgLocal: number | null;
  avgEur: number | null;
  overUnderPct: number | null;
}

// ---------- Constants ----------
export const FX_DATE = '2026-09-03';
export const BASE_EUR = 6.0;

export const COUNTRY_NAMES: Record<string, string> = {
  IT: 'Italy', GB: 'United Kingdom', FR: 'France', DE: 'Germany', ES: 'Spain',
  NL: 'Netherlands', CN: 'China', AE: 'UAE', QA: 'Qatar', US: 'United States',
  CA: 'Canada', BR: 'Brazil', AR: 'Argentina', CL: 'Chile', CO: 'Colombia',
};

const NATION_TO_ISO: Record<string, string> = {
  Italia: 'IT', 'Regno Unito': 'GB', Francia: 'FR', Germania: 'DE', Spagna: 'ES',
  'Paesi Bassi (Olanda)': 'NL', Cina: 'CN', 'Emirati Arabi Uniti': 'AE', Qatar: 'QA',
  "Stati Uniti d'America - USA": 'US', Canada: 'CA', Brasile: 'BR', Argentina: 'AR',
  Cile: 'CL', Colombia: 'CO',
};

/** Foreign currency per 1 EUR. ECB 2026-09-03 where stated, else indicative. */
export const FX: Record<string, { perEur: number; src: string }> = {
  EUR: { perEur: 1, src: 'base' },
  GBP: { perEur: 0.86055, src: 'ECB 2026-09-03' },
  USD: { perEur: 1.1615, src: 'ECB 2026-09-03' },
  CAD: { perEur: 1.6, src: 'indicative' },
  BRL: { perEur: 6.3, src: 'indicative' },
  COP: { perEur: 4590, src: 'indicative' },
  CLP: { perEur: 1103, src: 'indicative' },
  ARS: { perEur: 1568, src: 'indicative' },
  CNY: { perEur: 7.85, src: 'indicative' },
  AED: { perEur: 4.266, src: 'indicative' },
  QAR: { perEur: 4.228, src: 'indicative' },
};

// ---------- Data ----------
export const PIZZERIAS: Pizzeria[] = [
  { id: 'naples-base', name: 'Naples neighbourhood pizzeria (representative)', city: 'Napoli', country: 'IT', certification: { source: 'AVPN', certUrl: 'https://www.pizzanapoletana.org/en/' } },
  { id: 'damichele-london', name: "L'Antica Pizzeria da Michele", city: 'London', country: 'GB', website: 'https://www.damichele.co.uk/', certification: { source: 'AVPN', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'kalo-london', name: '50 Kalò di Ciro Salvo London', city: 'London', country: 'GB', certification: { source: 'AVPN', memberNumber: '750', certUrl: 'https://www.pizzanapoletana.org/en/associati/755-50_kalo_di_ciro_salvo_london' } },
  { id: 'keste-nyc', name: 'Kestè Pizza & Vino', city: 'New York City', country: 'US', website: 'https://kestepizzeria.com/', certification: { source: 'Unverified', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'ribalta-nyc', name: 'Ribalta', city: 'New York City', country: 'US', website: 'https://www.ribaltapizzanapoli.com/', certification: { source: 'AVPN', memberNumber: '459', certUrl: 'https://www.pizzanapoletana.org/en/associati/405-ribalta' } },
  { id: 'libretto-ossington', name: 'Pizzeria Libretto (Ossington)', city: 'Toronto', country: 'CA', website: 'https://pizzerialibretto.com/', certification: { source: 'AVPN', memberNumber: '291', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'bottega-shanghai', name: 'Bottega', city: 'Shanghai', country: 'CN', certification: { source: 'AVPN', memberNumber: '1040', certUrl: 'https://www.pizzanapoletana.org/en/associati/1019-bottega' } },
  { id: 'leggera-sp', name: 'Leggera Pizza Napoletana', city: 'São Paulo', country: 'BR', website: 'https://www.pizzerialeggera.com.br/', certification: { source: 'AVPN', memberNumber: '472', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'siamo-nel-forno', name: 'Siamo nel Forno', city: 'Buenos Aires', country: 'AR', certification: { source: 'AVPN', memberNumber: '425', certUrl: 'https://www.pizzanapoletana.org/es/associati/370-siamo_nel_forno' } },
  { id: 'michele-ba', name: 'Michele Pizza e Amore', city: 'Berazategui', country: 'AR', certification: { source: 'AVPN', memberNumber: '1085', certUrl: 'https://www.pizzanapoletana.org/en/associati/1105-michele_pizza_e_amore' } },
  { id: 'pizzardi-bogota', name: 'Pizzardi Artigianale', city: 'Bogotá', country: 'CO', certification: { source: 'AVPN', memberNumber: '1067', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'brunapoli-santiago', name: 'Brunapoli', city: 'Santiago', country: 'CL', website: 'https://www.brunapoli.cl/', certification: { source: 'AVPN', memberNumber: '637', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'bianco-doha', name: 'Bianco Ristorante', city: 'Doha', country: 'QA', website: 'https://eatbianco.com/', certification: { source: 'AVPN', memberNumber: '1113', certUrl: 'https://www.pizzanapoletana.org/en/associati/1175-bianco_ristorante' } },
];

export const OBSERVATIONS: Observation[] = [
  { pizzeriaId: 'naples-base', price: 6.0, currency: 'EUR', source: 'OpenPizzaMap Naples 2026 + pizzadixit.com (€5–6 neighbourhood)', observedAt: '2026-09-04', confidence: 'HIGH', note: 'Index base' },
  { pizzeriaId: 'damichele-london', price: 14.99, currency: 'GBP', source: 'eateasy.co.uk menu', sourceUrl: 'https://eateasy.co.uk/', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'kalo-london', price: 10.95, currency: 'GBP', source: 'MyLondon menu report', observedAt: '2026-09-04', confidence: 'MED' },
  { pizzeriaId: 'keste-nyc', price: 19.2, currency: 'USD', source: 'kestepizzeria.com/menu', sourceUrl: 'https://kestepizzeria.com/menu/', observedAt: '2026-09-04', confidence: 'HIGH', note: 'Absent from AVPN directory — excluded from US average', includeInAverage: false },
  { pizzeriaId: 'ribalta-nyc', price: 22.0, currency: 'USD', source: 'PRIX Restaurant Week (“normally $22”)', observedAt: '2026-09-04', confidence: 'MED', note: 'AVPN #459' },
  { pizzeriaId: 'libretto-ossington', price: 19.0, currency: 'CAD', source: 'pizzerialibretto.com/menus', sourceUrl: 'https://pizzerialibretto.com/menus', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'bottega-shanghai', price: 89.0, currency: 'CNY', source: 'sophieservesup (Margherita RMB89)', observedAt: '2026-09-04', confidence: 'MED', note: 'First AVPN-certified pizzeria in China' },
  { pizzeriaId: 'leggera-sp', price: 74.0, currency: 'BRL', source: 'pizzerialeggera.com.br menu PDF', sourceUrl: 'https://www.pizzerialeggera.com.br/cardapio/cardapio.pdf', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'michele-ba', price: 21800, currency: 'ARS', source: 'Facebook promo (≈ regular from half-price)', observedAt: '2026-09-04', confidence: 'MED', note: 'Proxy; Siamo nel Forno (#425) unlisted; high inflation' },
  { pizzeriaId: 'pizzardi-bogota', price: 44900, currency: 'COP', source: 'Rappi Colombia (Margherita Bufala)', observedAt: '2026-09-04', confidence: 'HIGH', note: 'Only AVPN-certified group in Colombia' },
  { pizzeriaId: 'brunapoli-santiago', price: 8900, currency: 'CLP', source: 'brunapoli.cl menu PDF', observedAt: '2021-10-01', confidence: 'LOW', note: '2021 menu — stale, needs refresh' },
];

// ---------- Compute ----------
const MEMBERS = membersJson as AvpnMember[];

export function censusByCountry(): Map<string, AvpnMember[]> {
  const m = new Map<string, AvpnMember[]>();
  for (const x of MEMBERS) {
    const iso = NATION_TO_ISO[x.nation];
    if (!iso) continue;
    if (!m.has(iso)) m.set(iso, []);
    m.get(iso)!.push(x);
  }
  return m;
}

export function computeIndex(): CountryRow[] {
  const census = censusByCountry();
  const byId = new Map(PIZZERIAS.map((p) => [p.id, p]));
  const prices = new Map<string, number[]>();
  const curr = new Map<string, string>();
  for (const o of OBSERVATIONS) {
    if (o.includeInAverage === false) continue;
    const p = byId.get(o.pizzeriaId);
    if (!p || p.certification.source !== 'AVPN') continue;
    if (!prices.has(p.country)) prices.set(p.country, []);
    prices.get(p.country)!.push(o.price);
    curr.set(p.country, o.currency);
  }
  const isos = [...new Set([...census.keys(), ...prices.keys()])].sort();
  return isos.map((iso) => {
    const arr = prices.get(iso) ?? [];
    const c = curr.get(iso) ?? (iso === 'IT' ? 'EUR' : '');
    const avgLocal = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    const fx = c && FX[c] ? FX[c].perEur : null;
    const avgEur = avgLocal !== null && fx ? avgLocal / fx : null;
    const implied = avgLocal !== null ? avgLocal / BASE_EUR : null;
    const overUnderPct = implied !== null && fx ? ((implied - fx) / fx) * 100 : null;
    return {
      iso, name: COUNTRY_NAMES[iso] ?? iso, currency: c,
      nCertified: census.get(iso)?.length ?? 0, nPriced: arr.length,
      avgLocal, avgEur, overUnderPct,
    };
  });
}

export function observationsFor(iso: string): { p: Pizzeria; o: Observation }[] {
  const byId = new Map(PIZZERIAS.map((p) => [p.id, p]));
  return OBSERVATIONS.filter((o) => byId.get(o.pizzeriaId)?.country === iso)
    .map((o) => ({ p: byId.get(o.pizzeriaId)!, o }));
}
