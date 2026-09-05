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
  lat: number;
  lng: number;
  /** Market key: ISO for countries, IT-NAP/IT-ROM/IT-MIL for Italian cities */
  market: string;
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

export const PIZZERIAS: Pizzeria[] = [
  { id: 'naples-base', name: 'Naples neighbourhood pizzeria (representative)', city: 'Napoli', lat: 40.852, lng: 14.268, market: 'IT-NAP', certification: { source: 'AVPN', certUrl: 'https://www.pizzanapoletana.org/en/' } },
  { id: 'kalo-roma', name: '50 Kalò di Ciro Salvo Roma', city: 'Roma', lat: 41.903, lng: 12.496, market: 'IT-ROM', certification: { source: 'AVPN', memberNumber: '1000', certUrl: 'https://www.pizzanapoletana.org/en/associati/971-50_kalo_di_ciro_salvo' } },
  { id: 'starita-milano', name: 'Starita a Milano', city: 'Milano', lat: 45.464, lng: 9.19, market: 'IT-MIL', certification: { source: 'AVPN', memberNumber: '600', certUrl: 'https://www.pizzanapoletana.org/en/associati/584-starita_a_milano' } },
  { id: 'damichele-london', name: "L'Antica Pizzeria da Michele", city: 'London', lat: 51.507, lng: -0.128, market: 'GB', website: 'https://www.damichele.co.uk/', certification: { source: 'AVPN', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'kalo-london', name: '50 Kalò di Ciro Salvo London', city: 'London', lat: 51.507, lng: -0.128, market: 'GB', certification: { source: 'AVPN', memberNumber: '750', certUrl: 'https://www.pizzanapoletana.org/en/associati/755-50_kalo_di_ciro_salvo_london' } },
  { id: 'ribalta-nyc', name: 'Ribalta', city: 'New York City', lat: 40.713, lng: -74.006, market: 'US', website: 'https://www.ribaltapizzanapoli.com/', certification: { source: 'AVPN', memberNumber: '459', certUrl: 'https://www.pizzanapoletana.org/en/associati/405-ribalta' } },
  { id: 'libretto-ossington', name: 'Pizzeria Libretto (Ossington)', city: 'Toronto', lat: 43.653, lng: -79.383, market: 'CA', website: 'https://pizzerialibretto.com/', certification: { source: 'AVPN', memberNumber: '291', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'bottega-shanghai', name: 'Bottega', city: 'Shanghai', lat: 31.23, lng: 121.473, market: 'CN', certification: { source: 'AVPN', memberNumber: '1040', certUrl: 'https://www.pizzanapoletana.org/en/associati/1019-bottega' } },
  { id: 'leggera-sp', name: 'Leggera Pizza Napoletana', city: 'São Paulo', lat: -23.555, lng: -46.633, market: 'BR', website: 'https://www.pizzerialeggera.com.br/', certification: { source: 'AVPN', memberNumber: '472', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'siamo-nel-forno', name: 'Siamo nel Forno', city: 'Buenos Aires', lat: -34.604, lng: -58.382, market: 'AR', certification: { source: 'AVPN', memberNumber: '425', certUrl: 'https://www.pizzanapoletana.org/es/associati/370-siamo_nel_forno' } },
  { id: 'michele-ba', name: 'Michele Pizza e Amore', city: 'Berazategui', lat: -34.763, lng: -58.211, market: 'AR', certification: { source: 'AVPN', memberNumber: '1085', certUrl: 'https://www.pizzanapoletana.org/en/associati/1105-michele_pizza_e_amore' } },
  { id: 'pizzardi-bogota', name: 'Pizzardi Artigianale', city: 'Bogotá', lat: 4.711, lng: -74.072, market: 'CO', certification: { source: 'AVPN', memberNumber: '1067', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'brunapoli-santiago', name: 'Brunapoli', city: 'Santiago', lat: -33.448, lng: -70.669, market: 'CL', website: 'https://www.brunapoli.cl/', certification: { source: 'AVPN', memberNumber: '637', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'bianco-doha', name: 'Bianco Ristorante', city: 'Doha', lat: 25.286, lng: 51.533, market: 'QA', website: 'https://eatbianco.com/', certification: { source: 'AVPN', memberNumber: '1113', certUrl: 'https://www.pizzanapoletana.org/en/associati/1175-bianco_ristorante' } },
  { id: 'grasso-paris', name: 'Guillaume Grasso — La Vera Pizza Napoletana', city: 'Paris', lat: 48.857, lng: 2.352, market: 'FR', website: 'https://www.guillaume-grasso.com/', certification: { source: 'AVPN', memberNumber: '718', certUrl: 'https://www.pizzanapoletana.org/en/associati/675-guillaume_grassola_vera_pizza_napoletana' } },
  { id: 'nap-frankfurt', name: 'NAP — Neapolitan Authentic Pizza', city: 'Frankfurt am Main', lat: 50.111, lng: 8.684, market: 'DE', website: 'https://napofficial.de/', certification: { source: 'AVPN', memberNumber: '1224', certUrl: 'https://www.pizzanapoletana.org/en/associati/1591-nap__neapolitan_authentic_pizza' } },
  { id: 'nap-mar-barcelona', name: 'NAP Mar', city: 'Barcelona', lat: 41.388, lng: 2.159, market: 'ES', website: 'https://napofficial.com/', certification: { source: 'AVPN', memberNumber: '869', certUrl: 'https://www.pizzanapoletana.org/en/associati/836-nap_mar' } },
  { id: 'beppe-amsterdam', name: 'Pizza Beppe 4', city: 'Amsterdam', lat: 52.368, lng: 4.904, market: 'NL', website: 'https://www.pizzabeppe.nl/', certification: { source: 'AVPN', memberNumber: '632', certUrl: 'https://www.pizzanapoletana.org/en/associati/586-pizza_beppe_4' } },
  { id: 'luigia-dubai', name: 'Luigia Dubai', city: 'Dubai', lat: 25.204, lng: 55.271, market: 'AE', website: 'https://www.luigia.ae/', certification: { source: 'AVPN', memberNumber: '700', certUrl: 'https://www.pizzanapoletana.org/en/associati/688-luigia_dubai' } },
  { id: 'pizza22-moscow', name: 'Pizza 22 cm', city: 'Moscow (Solyanka)', lat: 55.756, lng: 37.615, market: 'RU', website: 'https://pizza22cm.ru/', certification: { source: 'AVPN', memberNumber: '911', certUrl: 'https://www.pizzanapoletana.org/en/associati/879-pizza_22_cm' } },
  { id: 'bananas-stockholm', name: 'Bananas', city: 'Stockholm', lat: 59.314, lng: 18.077, market: 'SE', website: 'https://bistrobananas.se/', certification: { source: 'AVPN', memberNumber: '695', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'tribunali-helsinki', name: 'Pizzeria Via Tribunali', city: 'Helsinki', lat: 60.169, lng: 24.938, market: 'FI', website: 'https://viatribunali.fi/', certification: { source: 'AVPN', memberNumber: '675', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'gradi-brunswick', name: '400 Gradi (Brunswick)', city: 'Melbourne', lat: -37.767, lng: 144.962, market: 'AU', website: 'https://400gradi.com.au/', certification: { source: 'AVPN', memberNumber: '322', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
  { id: 'muti-porto', name: 'Muti Pizzeria Napoletana', city: 'Porto', lat: 41.157, lng: -8.629, market: 'PT', website: 'https://www.muti.pt/', certification: { source: 'AVPN', memberNumber: '794', certUrl: 'https://www.pizzanapoletana.org/en/associati' } },
];

export const OBSERVATIONS: Observation[] = [
  { pizzeriaId: 'naples-base', price: 6.0, currency: 'EUR', source: 'OpenPizzaMap Naples 2026 + pizzadixit.com (€5–6 neighbourhood)', observedAt: '2026-09-04', confidence: 'HIGH', note: 'Index base' },
  { pizzeriaId: 'kalo-roma', price: 9.0, currency: 'EUR', source: 'Italy guides 2024–26 (Rome Margherita €8–12)', observedAt: '2026-09-04', confidence: 'MED', note: 'City representative; venue price tbc' },
  { pizzeriaId: 'starita-milano', price: 10.0, currency: 'EUR', source: 'Italy guides 2024–26 (Milan Margherita €8–12, gourmet to €18)', observedAt: '2026-09-04', confidence: 'MED', note: 'City representative; venue price tbc' },
  { pizzeriaId: 'damichele-london', price: 14.99, currency: 'GBP', source: 'eateasy.co.uk menu', sourceUrl: 'https://eateasy.co.uk/', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'kalo-london', price: 10.95, currency: 'GBP', source: 'MyLondon menu report', observedAt: '2026-09-04', confidence: 'MED' },
  { pizzeriaId: 'ribalta-nyc', price: 22.0, currency: 'USD', source: 'PRIX Restaurant Week (“normally $22”)', observedAt: '2026-09-04', confidence: 'MED', note: 'AVPN #459' },
  { pizzeriaId: 'libretto-ossington', price: 19.0, currency: 'CAD', source: 'pizzerialibretto.com/menus', sourceUrl: 'https://pizzerialibretto.com/menus', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'bottega-shanghai', price: 89.0, currency: 'CNY', source: 'sophieservesup (Margherita RMB89)', observedAt: '2026-09-04', confidence: 'MED', note: 'First AVPN-certified pizzeria in China' },
  { pizzeriaId: 'leggera-sp', price: 74.0, currency: 'BRL', source: 'pizzerialeggera.com.br menu PDF', sourceUrl: 'https://www.pizzerialeggera.com.br/cardapio/cardapio.pdf', observedAt: '2026-09-04', confidence: 'HIGH' },
  { pizzeriaId: 'michele-ba', price: 21800, currency: 'ARS', source: 'Facebook promo (≈ regular from half-price)', observedAt: '2026-09-04', confidence: 'MED', note: 'Proxy; Siamo nel Forno (#425) unlisted; high inflation' },
  { pizzeriaId: 'pizzardi-bogota', price: 44900, currency: 'COP', source: 'Rappi Colombia (Margherita Bufala)', observedAt: '2026-09-04', confidence: 'HIGH', note: 'Only AVPN-certified group in Colombia' },
  { pizzeriaId: 'brunapoli-santiago', price: 8900, currency: 'CLP', source: 'brunapoli.cl menu PDF', observedAt: '2021-10-01', confidence: 'LOW', note: '2021 menu — stale, needs refresh' },
  { pizzeriaId: 'grasso-paris', price: 11.0, currency: 'EUR', source: 'lacarte.menu aggregator (Margherita Provola)', sourceUrl: 'https://lacarte.menu/restaurants/paris-1/la-vera-pizza-napoletana-2/menu', observedAt: '2026-09-04', confidence: 'MED', note: 'Bufala version €12' },
  { pizzeriaId: 'nap-frankfurt', price: 13.0, currency: 'EUR', source: 'Official menu PDF via napofficial.de', sourceUrl: 'https://weur-cdn.speisekarte.menu/storage/media/companies_menu_pdf/108492904/nap-neapolitan-authentic-pizza-frankfurt-am-main-speisekarte.pdf', observedAt: '2026-09-04', confidence: 'MED' },
  { pizzeriaId: 'nap-mar-barcelona', price: 8.9, currency: 'EUR', source: 'Uber Eats official store menu (JSON-LD)', sourceUrl: 'https://www.ubereats.com/es-en/store/nap-mar-barceloneta/ipvkxpO9RJq1hBnkJcfstw', observedAt: '2026-09-04', confidence: 'MED' },
  { pizzeriaId: 'beppe-amsterdam', price: 10.95, currency: 'EUR', source: 'TheFork official menu mirror', sourceUrl: 'https://thefork.com/restaurant/pizza-beppe-middenweg-r461671', observedAt: '2026-09-04', confidence: 'MED', note: 'First NL restaurant accepted by AVPN' },
  { pizzeriaId: 'pizza22-moscow', price: 550, currency: 'RUB', source: 'Official chain menu PDF Jun 2026 (Margherita 22)', sourceUrl: 'https://pizza22cm.ru/wp-content/uploads/2026/06/menu_pizza22_pizza_bk-2.pdf', observedAt: '2026-09-04', confidence: 'MED', note: 'Chain-wide menu; Moscow branch (Solyanka) AVPN #879' },
  { pizzeriaId: 'bananas-stockholm', price: 185, currency: 'SEK', source: 'Official menu bistrobananas.se/meny (Margarita)', sourceUrl: 'https://bistrobananas.se/meny', observedAt: '2026-09-04', confidence: 'HIGH', note: 'AVPN #695; ekologisk tomat, fior di latte' },
  { pizzeriaId: 'tribunali-helsinki', price: 16.9, currency: 'EUR', source: 'Official menu viatribunali.fi/en/menu (Margherita)', sourceUrl: 'https://viatribunali.fi/en/menu/', observedAt: '2026-09-04', confidence: 'HIGH', note: 'AVPN #675; bufala +€5' },
  { pizzeriaId: 'gradi-brunswick', price: 18, currency: 'AUD', source: 'Official site 400gradi.com.au (Margherita $18 promo)', sourceUrl: 'https://400gradi.com.au/', observedAt: '2026-09-04', confidence: 'MED', note: 'AVPN #322; Brunswick/Eastland/Mornington' },
  { pizzeriaId: 'muti-porto', price: 12, currency: 'EUR', source: 'Official menu muti.pt/menu (Margherita)', sourceUrl: 'https://www.muti.pt/menu/', observedAt: '2026-09-04', confidence: 'HIGH', note: 'AVPN #794; San Marzano DOP, fior di latte' },
];
