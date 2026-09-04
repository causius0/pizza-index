// Mean (and where sourced, median) monthly wages, in the market's price currency.
// basis tells whether the figure is gross or net — hours math uses whichever is
// stated, so cross-country hour comparisons are indicative, not exact.
export interface Salary {
  iso: string; // country ISO; Italy rows share IT
  meanMonthly: number;
  currency: string;
  basis: 'gross' | 'net';
  source: string;
  medianMonthly?: number;
  medianSource?: string;
}

export const WORK_HOURS_PER_MONTH = 176; // 22 days x 8h

export const SALARIES: Salary[] = [
  { iso: 'US', meanMonthly: 6779, currency: 'USD', basis: 'gross', source: 'Wikipedia/List of American countries by average wage (gross)', medianMonthly: 3602, medianSource: 'SSA 2023 median net wage $43,222/yr' },
  { iso: 'GB', meanMonthly: 3734, currency: 'GBP', basis: 'gross', source: 'UNECE gross $4,772/mo 2024 → GBP @1.278' },
  { iso: 'DE', meanMonthly: 4187, currency: 'EUR', basis: 'gross', source: 'UNECE gross $4,531/mo 2024 → EUR @1.082' },
  { iso: 'FR', meanMonthly: 3742, currency: 'EUR', basis: 'gross', source: 'UNECE gross $4,049/mo 2024 → EUR @1.082' },
  { iso: 'IT', meanMonthly: 2762, currency: 'EUR', basis: 'gross', source: 'UNECE gross $2,988/mo 2024 → EUR @1.082' },
  { iso: 'ES', meanMonthly: 2753, currency: 'EUR', basis: 'gross', source: 'UNECE gross $2,979/mo 2024 → EUR @1.082' },
  { iso: 'NL', meanMonthly: 4853, currency: 'EUR', basis: 'gross', source: 'UNECE gross $5,251/mo 2024 → EUR @1.082' },
  { iso: 'CA', meanMonthly: 7005, currency: 'CAD', basis: 'gross', source: 'Wikipedia/List of American countries by average wage (gross CAD 7,005)' },
  { iso: 'CN', meanMonthly: 10787, currency: 'CNY', basis: 'gross', source: 'Wikipedia/List of Asian countries by average wage (urban non-private, 2025; private sector ¥5,966)' },
  { iso: 'AE', meanMonthly: 12745, currency: 'AED', basis: 'gross', source: 'Wikipedia/List of Asian countries by average wage (2023)' },
  { iso: 'QA', meanMonthly: 12416, currency: 'QAR', basis: 'gross', source: 'Wikipedia/List of Asian countries by average wage (2024)' },
  { iso: 'BR', meanMonthly: 2551, currency: 'BRL', basis: 'net', source: 'Wikipedia/List of American countries by average wage (net)' },
  { iso: 'AR', meanMonthly: 956283, currency: 'ARS', basis: 'net', source: 'Wikipedia/List of American countries by average wage (net; high inflation — verify)' },
  { iso: 'CL', meanMonthly: 897019, currency: 'CLP', basis: 'net', source: 'Wikipedia/List of American countries by average wage (net)' },
  { iso: 'CO', meanMonthly: 1390853, currency: 'COP', basis: 'net', source: 'Wikipedia/List of American countries by average wage (net)' },
];

export function hoursToBuy(priceLocal: number, s: Salary): number {
  return priceLocal / (s.meanMonthly / WORK_HOURS_PER_MONTH);
}
