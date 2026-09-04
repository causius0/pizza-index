import type { PriceObservation, Pizzeria } from './types.js';

// Pizzerias with a price observation. `certification.certUrl` always points at the
// AVPN member page (or the directory when the member page is unknown).
// Kestè (NYC) is NOT in the current AVPN directory — kept as an Eccellenze-style
// anchor, excluded from the certified average until its certification URL is confirmed.
export const PRICED: Pizzeria[] = [
  {
    id: 'keste-nyc', name: 'Kestè Pizza & Vino', city: 'New York City', country: 'US',
    website: 'https://kestepizzeria.com/',
    certification: { source: 'Unverified', certUrl: 'https://www.pizzanapoletana.org/en/associati' },
  },
  {
    id: 'ribalta-nyc', name: 'Ribalta', city: 'New York City', country: 'US',
    website: 'https://www.ribaltapizzanapoli.com/',
    certification: { source: 'AVPN', memberNumber: '459', certUrl: 'https://www.pizzanapoletana.org/en/associati/405-ribalta' },
  },
  {
    id: 'libretto-ossington', name: 'Pizzeria Libretto (Ossington)', city: 'Toronto', country: 'CA',
    website: 'https://pizzerialibretto.com/',
    certification: { source: 'AVPN', memberNumber: '291', certUrl: 'https://www.pizzanapoletana.org/en/associati' },
  },
  {
    id: 'damichele-london', name: "L'Antica Pizzeria da Michele", city: 'London', country: 'GB',
    website: 'https://www.damichele.co.uk/',
    certification: { source: 'AVPN', certUrl: 'https://www.pizzanapoletana.org/en/associati' },
  },
  {
    id: 'kalò-london', name: '50 Kalò di Ciro Salvo London', city: 'London', country: 'GB',
    certification: { source: 'AVPN', memberNumber: '750', certUrl: 'https://www.pizzanapoletana.org/en/associati/755-50_kalo_di_ciro_salvo_london' },
  },
  {
    id: 'leggera-sp', name: 'Leggera Pizza Napoletana', city: 'São Paulo', country: 'BR',
    website: 'https://www.pizzerialeggera.com.br/',
    certification: { source: 'AVPN', memberNumber: '472', certUrl: 'https://www.pizzanapoletana.org/en/associati' },
  },
  {
    id: 'michele-ba', name: 'Michele Pizza e Amore', city: 'Berazategui', country: 'AR',
    certification: { source: 'AVPN', memberNumber: '1085', certUrl: 'https://www.pizzanapoletana.org/en/associati/1105-michele_pizza_e_amore' },
  },
  {
    id: 'siamo-nel-forno', name: 'Siamo nel Forno', city: 'Buenos Aires', country: 'AR',
    certification: { source: 'AVPN', memberNumber: '425', certUrl: 'https://www.pizzanapoletana.org/es/associati/370-siamo_nel_forno' },
  },
  {
    id: 'pizzardi-bogota', name: 'Pizzardi Artigianale', city: 'Bogotá', country: 'CO',
    certification: { source: 'AVPN', memberNumber: '1067', certUrl: 'https://www.pizzanapoletana.org/en/associati' },
  },
  {
    id: 'brunapoli-santiago', name: 'Brunapoli', city: 'Santiago', country: 'CL',
    website: 'https://www.brunapoli.cl/',
    certification: { source: 'AVPN', memberNumber: '637', certUrl: 'https://www.pizzanapoletana.org/en/associati' },
  },
  {
    id: 'bianco-doha', name: 'Bianco Ristorante', city: 'Doha', country: 'QA',
    website: 'https://eatbianco.com/',
    certification: { source: 'AVPN', memberNumber: '1113', certUrl: 'https://www.pizzanapoletana.org/en/associati/1175-bianco_ristorante' },
  },
  {
    id: 'naples-base', name: 'Naples neighbourhood pizzeria (representative)', city: 'Napoli', country: 'IT',
    certification: { source: 'AVPN', certUrl: 'https://www.pizzanapoletana.org/en/' },
  },
];

export const OBSERVATIONS: PriceObservation[] = [
  { pizzeriaId: 'naples-base', price: 6.0, currency: 'EUR', source: 'OpenPizzaMap Naples 2026 guide + pizzadixit.com (€5–6 neighbourhood, €6–7 historic)', observedAt: '2026-09-04', confidence: 'HIGH', note: 'Index base' },
  { pizzeriaId: 'damichele-london', price: 14.99, currency: 'GBP', source: 'https://eateasy.co.uk/.../Lantica-Pizzeria-Da-Michele-W1D-4TY-menu.php', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'keste-nyc', price: 19.2, currency: 'USD', source: 'https://kestepizzeria.com/menu/', observedAt: '2026-09-04', confidence: 'HIGH', note: 'NOT in AVPN directory — excluded from certified average', includeInAverage: false },
  { pizzeriaId: 'libretto-ossington', price: 19.0, currency: 'CAD', source: 'https://pizzerialibretto.com/menus', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'leggera-sp', price: 74.0, currency: 'BRL', source: 'https://www.pizzerialeggera.com.br/cardapio/cardapio.pdf', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'michele-ba', price: 21800, currency: 'ARS', source: 'Facebook promo (half-price ARS 10,900 → regular ≈ 21,800)', observedAt: '2026-09-04', confidence: 'MED', note: 'Proxy: Siamo nel Forno (#425) price unlisted; high inflation' },
  { pizzeriaId: 'pizzardi-bogota', price: 44900, currency: 'COP', source: 'Rappi Colombia', observedAt: '2026-09-04', confidence: 'HIGH', note: 'Margherita Bufala; only AVPN-certified group in Colombia' },
  { pizzeriaId: 'brunapoli-santiago', price: 8900, currency: 'CLP', source: 'https://www.brunapoli.cl/.../MenuFinalBrunapoliWsp.pdf', observedAt: '2021-10-01', confidence: 'LOW', note: '2021 menu — stale, needs refresh' },
];
