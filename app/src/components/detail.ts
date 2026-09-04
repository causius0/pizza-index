import type { Market } from '../data/markets.ts';
import { observationsFor, membersFor } from '../data/markets.ts';
import { FX } from '../data/fx.ts';
import { fmtNum, fmtSignedPct, esc } from '../lib/format.ts';

export function detailPanel(m: Market | undefined): string {
  if (!m) return '<p class="empty">Select a market on the globe or table.</p>';
  const obs = observationsFor(m.key);
  const members = membersFor(m);
  const shown = members.slice(0, 20);
  const fx = m.currency && FX[m.currency] ? FX[m.currency] : null;
  return `<div class="detail-head">
      <h2>${esc(m.label)} <span class="flag">${m.key}</span></h2>
      <button id="dclose" aria-label="Close">×</button>
    </div>
    <div class="statgrid">
      <div><span>Certified</span><strong>${m.nCertified}</strong></div>
      <div><span>Priced</span><strong>${m.nPriced}</strong></div>
      <div><span>Average</span><strong>${m.avgLocal !== null ? `${fmtNum(m.avgLocal)} ${m.currency}` : '—'}</strong></div>
      <div><span>In euros</span><strong>${m.avgEur !== null ? '€' + fmtNum(m.avgEur) : '—'}</strong></div>
      <div><span>vs Naples</span><strong>${fmtSignedPct(m.overUnderPct)}</strong></div>
    </div>
    ${fx && m.currency !== 'EUR' ? `<p class="fxline">€1 = ${fmtNum(fx.perEur)} ${m.currency} · ${esc(fx.src)}</p>` : ''}
    <h3>Observations</h3>
    ${obs.length ? `<ul class="obs">${obs.map(({ p, o }) => `<li>
      <strong>${esc(p.name)}</strong> <span class="conf ${o.confidence}">${o.confidence}</span>${o.includeInAverage === false ? ' <em>excluded from average</em>' : ''}<br>
      <small>${o.price.toLocaleString()} ${o.currency} · ${o.observedAt}${o.note ? ` · ${esc(o.note)}` : ''}<br>
      ${o.sourceUrl ? `<a href="${o.sourceUrl}" target="_blank" rel="noreferrer">menu source</a> · ` : `<span>${esc(o.source)}</span> · `}${p.website ? `<a href="${p.website}" target="_blank" rel="noreferrer">website</a> · ` : ''}<a href="${p.certification.certUrl}" target="_blank" rel="noreferrer">cert (${p.certification.source}${p.certification.memberNumber ? ' #' + p.certification.memberNumber : ''})</a></small>
    </li>`).join('')}</ul>` : '<p>No menu prices yet — census only.</p>'}
    <h3>Certified census (${members.length})</h3>
    <ul class="census">${shown.map((x) => `<li>${esc(x.name)} — ${esc(x.city)} <a href="${x.url}" target="_blank" rel="noreferrer">AVPN #${x.number}</a></li>`).join('')}${members.length > shown.length ? `<li><em>…and ${members.length - shown.length} more</em></li>` : ''}</ul>`;
}
