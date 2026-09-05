import type { Market } from '../data/markets.ts';
import { fmtNum, fmtSignedPct } from '../lib/format.ts';
import { USD_PER_EUR } from '../data/fx.ts';

export type DisplayCcy = 'EUR' | 'USD';
export type SortKey = 'overUnderPct' | 'avgEur' | 'nCertified' | 'label';

export function marketTable(rows: Market[], ccy: DisplayCcy, selected: string | null, sort: SortKey): string {
  const sym = ccy === 'EUR' ? '€' : '$';
  const conv = (eur: number | null) =>
    eur === null ? null : ccy === 'EUR' ? eur : eur * USD_PER_EUR;
  const th = (key: SortKey | null, label: string) =>
    key ? `<th data-sort="${key}" aria-sort="${sort === key ? 'descending' : 'none'}" class="${sort === key ? 'sorted' : ''}" tabindex="0" title="Sort by ${label}">${label}</th>` : `<th>${label}</th>`;
  return `<table><thead><tr>
    ${th('label', 'Market')}${th('avgEur', `Avg (${ccy})`)}${th('overUnderPct', 'vs Naples')}${th('nCertified', 'Certified')}${th(null, 'Priced')}
  </tr></thead><tbody>${rows.length ? rows.map((x) => {
    const v = conv(x.avgEur);
    return `<tr data-key="${x.key}" tabindex="0" class="${selected === x.key ? 'sel' : ''}">
      <td><strong>${x.label}</strong>${x.kind === 'city' ? ' <span class="kind">IT city</span>' : ''}</td>
      <td class="num">${v !== null ? sym + fmtNum(v) : '<em>pending</em>'}</td>
      <td>${x.overUnderPct !== null ? `<span class="pill ${x.overUnderPct >= 0 ? 'over' : 'under'}">${fmtSignedPct(x.overUnderPct)}</span>` : '—'}</td>
      <td class="num">${x.nCertified}</td><td class="num">${x.nPriced}</td></tr>`;
  }).join('') : '<tr><td colspan="5"><em>No markets match. Clear the search.</em></td></tr>'}</tbody></table>`;
}
