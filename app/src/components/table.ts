import type { Market } from '../data/markets.ts';
import { fmtNum, fmtSignedPct } from '../lib/format.ts';
import { USD_PER_EUR } from '../data/fx.ts';

export type DisplayCcy = 'EUR' | 'USD';

export function marketTable(rows: Market[], ccy: DisplayCcy, selected: string | null): string {
  const sym = ccy === 'EUR' ? '€' : '$';
  const conv = (eur: number | null) =>
    eur === null ? null : ccy === 'EUR' ? eur : eur * USD_PER_EUR;
  return `<table><thead><tr>
    <th>Market</th><th>Avg (${ccy})</th><th>vs Naples</th><th>Certified</th><th>Priced</th>
  </tr></thead><tbody>${rows.map((x) => {
    const v = conv(x.avgEur);
    return `<tr data-key="${x.key}" class="${selected === x.key ? 'sel' : ''}">
      <td><strong>${x.label}</strong>${x.kind === 'city' ? ' <span class="kind">IT city</span>' : ''}</td>
      <td class="num">${v !== null ? sym + fmtNum(v) : '<em>pending</em>'}</td>
      <td>${x.overUnderPct !== null ? `<span class="pill ${x.overUnderPct >= 0 ? 'over' : 'under'}">${fmtSignedPct(x.overUnderPct)}</span>` : '—'}</td>
      <td class="num">${x.nCertified}</td><td class="num">${x.nPriced}</td></tr>`;
  }).join('')}</tbody></table>`;
}
