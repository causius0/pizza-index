// Interactive 3D globe (globe.gl): countries color-coded by valuation vs Naples.
// Heavy deps load lazily so first paint stays fast. Polygons come from world-atlas
// 110m via CDN at runtime; offline, the section shows a fallback note.
import { globeValueByIso, type Market } from '../data/markets.ts';

const NUMERIC_TO_ISO: Record<string, string> = {
  '840': 'US', '826': 'GB', '250': 'FR', '276': 'DE', '724': 'ES',
  '528': 'NL', '156': 'CN', '784': 'AE', '634': 'QA', '124': 'CA',
  '076': 'BR', '032': 'AR', '152': 'CL', '170': 'CO', '380': 'IT', '643': 'RU',
};

function colorFor(v: number | undefined): string {
  if (v === undefined) return '#ddd5c3'; // no data
  if (Math.abs(v) < 1) return '#c9a227'; // base gold (Naples)
  const t = Math.min(1, Math.abs(v) / 220);
  if (v > 0) {
    // cream -> tomato
    const r = 181 + Math.round((214 - 181) * (1 - t));
    return `rgb(${r},${Math.round(60 + 40 * (1 - t))},${Math.round(40 + 20 * (1 - t))})`;
  }
  const g = 120 + Math.round(60 * (1 - t));
  return `rgb(40,${g},70)`;
}

export async function mountGlobe(
  el: HTMLElement,
  markets: Market[],
  onPick: (marketKey: string) => void,
): Promise<void> {
  let Globe: unknown;
  let topo: unknown;
  try {
    [{ default: Globe }, topo] = await Promise.all([
      import('globe.gl'),
      import('topojson-client'),
    ]);
  } catch {
    el.innerHTML = '<p class="empty">Globe needs network access for its map tiles.</p>';
    return;
  }
  const values = globeValueByIso(markets);
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
  const world = await res.json();
  const feats = (topo as { feature: (t: unknown, o: unknown) => GeoJSON.FeatureCollection })
    .feature(world, world.objects.countries).features;

  const isoOf = (f: GeoJSON.Feature): string | null => {
    const id = String((f.id ?? '')).padStart(3, '0');
    return NUMERIC_TO_ISO[id] ?? null;
  };
  const keyFor = (iso: string): string | null => {
    if (iso === 'IT') return 'IT-NAP';
    return markets.some((m) => m.key === iso) ? iso : null;
  };

  const g = new (Globe as new (o: object) => {
    (e: HTMLElement): unknown;
    polygonsData(d: unknown): unknown;
    polygonCapColor(f: (x: unknown) => string): unknown;
    polygonSideColor(): unknown;
    polygonStrokeColor(f: () => string): unknown;
    polygonLabel(f: (x: unknown) => string): unknown;
    onPolygonClick(f: (x: unknown) => void): unknown;
    onPolygonHover(f: (x: unknown | null) => void): unknown;
    autoRotateSpeed(v: number): unknown;
  })({ animateIn: false });
  (g as unknown as (e: HTMLElement) => void)(el);
  const chain = g as unknown as Record<string, (...a: never[]) => unknown>;
  void (chain['polygonsData'] as (d: unknown) => unknown)(feats);
  void (chain['polygonCapColor'] as (f: (x: unknown) => string) => unknown)((x: unknown) => {
    const iso = isoOf(x as GeoJSON.Feature);
    return colorFor(iso ? values.get(iso) : undefined);
  });
  void (chain['polygonSideColor'] as () => unknown)();
  void (chain['polygonStrokeColor'] as (f: () => string) => unknown)(() => '#8a8474');
  void (chain['polygonLabel'] as (f: (x: unknown) => string) => unknown)((x: unknown) => {
    const f = x as GeoJSON.Feature;
    const iso = isoOf(f);
    const name = (f.properties as Record<string, string> | null)?.['name'] ?? iso ?? '';
    const v = iso ? values.get(iso) : undefined;
    return `<b>${name}</b>${v !== undefined ? `<br/>${v >= 0 ? '+' : ''}${v.toFixed(0)}% vs Naples` : '<br/>no data'}`;
  });
  void (chain['onPolygonClick'] as (f: (x: unknown) => void) => unknown)((x: unknown) => {
    const iso = isoOf(x as GeoJSON.Feature);
    const key = iso ? keyFor(iso) : null;
    if (key) onPick(key);
  });
  void (chain['onPolygonHover'] as (f: (x: unknown | null) => void) => unknown)(() => undefined);
  void (chain['autoRotateSpeed'] as (v: number) => unknown)(0.6);
  void (chain['autoRotate'] as (v: boolean) => unknown)(true);
}
