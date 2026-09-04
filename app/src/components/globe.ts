import type { GlobeInstance } from 'globe.gl';
import type { Market } from '../data/markets.js';
import { PIZZERIAS, OBSERVATIONS } from '../data/observations.js';
import { fmtNum } from '../lib/format.js';

const NUMERIC_TO_ISO: Record<string, string> = {
  '840': 'US', '826': 'GB', '250': 'FR', '276': 'DE', '724': 'ES',
  '528': 'NL', '156': 'CN', '784': 'AE', '634': 'QA', '124': 'CA',
  '076': 'BR', '032': 'AR', '152': 'CL', '170': 'CO', '380': 'IT', '643': 'RU',
  '040': 'AT', '056': 'BE', '191': 'HR', '208': 'DK', '246': 'FI', '300': 'GR',
  '372': 'IE', '428': 'LV', '440': 'LT', '470': 'MT', '616': 'PL', '620': 'PT',
  '203': 'CZ', '642': 'RO', '705': 'SI', '752': 'SE', '348': 'HU', '036': 'AU',
  '554': 'NZ', '682': 'SA', '818': 'EG', '414': 'KW', '434': 'LY',
};

function colorFor(v: number | undefined): string {
  if (v === undefined) return '#d8d2c4'; // no data: stone grey
  if (Math.abs(v) < 0.5) return '#c9a227'; // base: gold
  const t = Math.min(1, Math.abs(v) / 120); // cream -> pomodoro
  const c0 = [246, 241, 232];
  const c1 = [181, 52, 31];
  const c = c0.map((a, i) => Math.round(a + (c1[i] - a) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

interface LandFeature {
  id: string;
  properties: { name: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

export async function mountGlobe(
  el: HTMLElement,
  markets: Market[],
  onPick: (key: string) => void,
): Promise<void> {
  const [{ default: Globe }, topojson, worldRes] = await Promise.all([
    import('globe.gl'),
    import('topojson-client'),
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'),
  ]);
  if (!worldRes.ok) throw new Error(`world-atlas ${worldRes.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topo = (topojson as any);
  const land = topo.feature(await worldRes.json(), 'countries') as unknown as {
    features: LandFeature[];
  };
  const byIso = new Map<string, number>();
  for (const m of markets) {
    if (m.kind === 'country' && m.overUnderPct !== null) byIso.set(m.iso, m.overUnderPct);
  }
  const itVals = markets.filter((x) => x.iso === 'IT' && x.overUnderPct !== null);
  if (itVals.length) {
    byIso.set('IT', itVals.reduce((a, b) => a + (b.overUnderPct ?? 0), 0) / itVals.length);
  }
  const keyByIso = new Map(markets.filter((m) => m.kind === 'country').map((m) => [m.iso, m.key]));

  // City dots: one per priced pizzeria. Hover names it, click opens its market.
  const obsByPiz = new Map(OBSERVATIONS.filter((o) => o.includeInAverage !== false).map((o) => [o.pizzeriaId, o]));
  const dots = PIZZERIAS.filter((p) => obsByPiz.has(p.id)).map((p) => {
    const o = obsByPiz.get(p.id)!;
    return { ...p, price: o.price, currency: o.currency };
  });

  const w = Math.max(320, el.clientWidth || 640);
  const globe: GlobeInstance = new Globe(el, { animateIn: false });
  // Open on Europe, where most priced cities cluster; auto-rotate takes over.
  globe.pointOfView({ lat: 34, lng: 12, altitude: 2.1 });
  const mat = globe.globeMaterial() as unknown as {
    color: { set: (c: string) => void };
  };
  mat.color.set('#efe7d6'); // parchment oceans to match the page
  globe
    .width(w)
    .height(420)
    .backgroundColor('rgba(0,0,0,0)')
    .showAtmosphere(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .polygonsData(land.features as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .polygonCapColor((d: any) => colorFor(byIso.get(NUMERIC_TO_ISO[String(d.id).padStart(3, '0')])))
    .polygonSideColor(() => 'rgba(0,0,0,0)')
    .polygonStrokeColor(() => '#1c1714')
    .polygonsTransitionDuration(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .onPolygonClick((d: any) => {
      const iso = NUMERIC_TO_ISO[String(d.id).padStart(3, '0')];
      const key = iso ? keyByIso.get(iso) : undefined;
      if (key) onPick(key);
    })
    .onPolygonHover(() => undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .pointsData(dots as any)
    .pointAltitude(0.015)
    .pointRadius(0.55)
    .pointColor(() => '#b5341f')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .pointLabel((d: any) => `${d.name} · ${d.city} — ${fmtNum(d.price)} ${d.currency}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .onPointClick((d: any) => {
      if (d && d.market) onPick(d.market);
    });
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.6;
  (window as unknown as { __globe?: GlobeInstance }).__globe = globe;
}
