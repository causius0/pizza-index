import type { Market } from '../data/markets.ts';
import { SALARIES, hoursToBuy, type Salary } from '../data/salaries.ts';
import { fmtNum, esc } from '../lib/format.ts';

function salaryFor(m: Market): Salary | undefined {
  return SALARIES.find((s) => s.iso === (m.kind === 'city' ? 'IT' : m.iso));
}

/** Hours of average pay needed for one Margherita, per priced market. */
export function wageSection(markets: Market[]): string {
  const rows = markets
    .filter((m) => m.avgLocal !== null)
    .map((m) => ({ m, s: salaryFor(m)! }))
    .filter((x) => x.s && x.m.currency === x.s.currency)
    .map(({ m, s }) => ({ m, s, hours: hoursToBuy(m.avgLocal!, s) }))
    .sort((a, b) => a.hours - b.hours);
  return `<section class="card" id="wages"><div class="wage-in">
    <div>
      <h2>How long do you work for a Margherita?</h2>
      <p class="lede">Average pay ÷ 176-hour month, against the market's average certified Margherita.
      Gross and net are never mixed without a label — the <em>basis</em> column says which.</p>
      <table class="wagetable"><thead><tr>
        <th>Market</th><th>Margherita</th><th>Mean pay/mo</th><th>Basis</th><th>Median/mo</th><th>Hours</th>
      </tr></thead><tbody>${rows.map(({ m, s, hours }) => `<tr>
        <td><strong>${m.label}</strong></td>
        <td class="num">${fmtNum(m.avgLocal)} ${m.currency}</td>
        <td class="num">${fmtNum(s.meanMonthly, 0)} ${s.currency}</td>
        <td>${s.basis}${s.medianBasis && s.medianBasis !== s.basis ? ` · med ${s.medianBasis}` : ''}</td>
        <td class="num">${s.medianMonthly !== undefined ? fmtNum(s.medianMonthly, 0) + ' ' + s.currency : '—'}</td>
        <td class="num"><strong>${hours < 1 ? Math.round(hours * 60) + ' min' : hours.toFixed(1) + ' h'}</strong></td>
      </tr>`).join('')}</tbody></table>
      <p><small>Sources: ${[...new Set(rows.flatMap((r) => r.s.medianSource ? [r.s.source, r.s.medianSource] : [r.s.source]))].map((s) => esc(s)).join(' · ')}</small></p>
    </div>
  </div></section>`;
}
