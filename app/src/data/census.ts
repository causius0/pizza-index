import membersJson from '../data-members.json';

export interface AvpnMember {
  number: string;
  name: string;
  memberUrl: string;
  city: string;
  nation: string;
}

const NATION_TO_ISO: Record<string, string> = {
  Italia: 'IT', 'Regno Unito': 'GB', Francia: 'FR', Germania: 'DE', Spagna: 'ES',
  'Paesi Bassi (Olanda)': 'NL', Cina: 'CN', 'Emirati Arabi Uniti': 'AE', Qatar: 'QA',
  "Stati Uniti d'America - USA": 'US', Canada: 'CA', Brasile: 'BR', Argentina: 'AR',
  Cile: 'CL', Colombia: 'CO', Russia: 'RU',
};

export const MEMBERS = membersJson as AvpnMember[];

export function isoOf(m: AvpnMember): string | null {
  return NATION_TO_ISO[m.nation] ?? null;
}

export function censusByCountry(): Map<string, AvpnMember[]> {
  const m = new Map<string, AvpnMember[]>();
  for (const x of MEMBERS) {
    const iso = isoOf(x);
    if (!iso) continue;
    if (!m.has(iso)) m.set(iso, []);
    m.get(iso)!.push(x);
  }
  return m;
}

/** AVPN members whose listed city matches (case-insensitive substring). */
export function censusByCity(needle: string): AvpnMember[] {
  const n = needle.toLowerCase();
  return MEMBERS.filter((x) => x.city.toLowerCase().includes(n));
}
