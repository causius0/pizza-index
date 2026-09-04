import './style.css';
import {
  BASE_EUR, FX_DATE, FX,
  computeIndex, censusByCountry, observationsFor,
  type CountryRow,
} from './data.ts';

type SortKey = 'overUnderPct' | 'avgEur' | 'nCertified' | 'name';
let sortKey: SortKey = 'overUnderPct';
let query = '';
let displayCcy: 'EUR' | 'USD' = 'EUR';
let selected: string | null = 'US';

const rows = computeIndex();
const census = censusByCountry();
const USD_PER_EUR = FX['USD'].perEur;

const fmtN = (v: number | null, d = 2) =>
  v === null ? '—' : v.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });

function inDisplay(eur: number | null): number | null {
  if (eur === null) return null;
  return displayCcy === 'EUR' ? eur : eur * USD_PER_EUR;
}

function filtered(): CountryRow[] {
  const q = query.trim().toLowerCase();
  let r = rows.filter((x) => !q || x.name.toLowerCase().includes(q) || x.iso.toLowerCase() === q);
  r = [...r].sort((a, b) => {
    if (sortKey === 'name') return a.name.localeCompare(b.name);
    if (sortKey === 'nCertified') return b.nCertified - a.nCertified;
    const av = sortKey === 'avgEur' ? a.avgEur : a.overUnderPct;
    const bv = sortKey === 'avgEur' ? b.avgEur : b.overUnderPct;
    return (bv ?? -Infinity) - (av ?? -Infinity);
  });
  return r;
}

function chartSvg(r: CountryRow[]): string {
  const priced = r.filter((x) => x.overUnderPct !== null);
  const max = Math.max(100, ...priced.map((x) => Math.abs(x.overUnderPct!)));
  const W = 720, rowH = 34, padL = 150, padR = 70;
  const midX = padL + (W - padL - padR) / 2;
  const half = (W - padL - padR) / 2;
  const H = priced.length * rowH + 8;
  const bars = priced.map((x, i) => {
    const y = 4 + i * rowH;
    const v = x.overUnderPct!;
    const len = (Math.abs(v) / max) * half;
    const bx = v >= 0 ? midX : midX - len;
    const col = x.iso === 'IT' ? '#64748b' : v >= 0 ? '#dc2626' : '#16a34a';
    const sel = selected === x.iso ? ' stroke="#0f172a" stroke-width="2"' : '';
    return `<g data-iso="${x.iso}" class="bar" style="cursor:pointer">
      <text x="${padL - 8}" y="${y + 19}" text-anchor="end" font-size="12" fill="#0f172a">${x.name}</text>
      <rect x="${bx}" y="${y + 4}" width="${Math.max(2, len)}" height="18" rx="3" fill="${col}"${sel}/>
      <text x="${v >= 0 ? bx + len + 6 : bx - 6}" y="${y + 19}" text-anchor="${v >= 0 ? 'start' : 'end'}" font-size="12" fill="#334155">${v >= 0 ? '+' : ''}${v.toFixed(0)}%</text>
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Valuation vs Naples">
    <line x1="${midX}" y1="0" x2="${midX}" y2="${H}" stroke="#94a3b8" stroke-dasharray="4 3"/>
    ${bars}</svg>`;
}

function detailHtml(iso: string): string {
  const r = rows.find((x) => x.iso === iso);
  if (!r) return '';
  const obs = observationsFor(iso);
  const members = census.get(iso) ?? [];
  const shown = members.slice(0, 24);
  return `<div class="detail-head">
      <h2>${r.name} <span class="flag">${iso}</span></h2>
      <button id="dclose" aria-label="Close">×</button>
    </div>
    <div class="statgrid">
      <div><span>Certified pizzerias</span><strong>${r.nCertified}</strong></div>
      <div><span>With prices</span><strong>${r.nPriced}</strong></div>
      <div><span>Average Margherita</span><strong>${r.avgLocal !== null ? `${fmtN(r.avgLocal)} ${r.currency}` : '—'}</strong></div>
      <div><span>In euros</span><strong>${r.avgEur !== null ? '€' + fmtN(r.avgEur) : '—'}</strong></div>
      <div><span>vs Naples</span><strong>${r.overUnderPct !== null ? (r.overUnderPct >= 0 ? '+' : '') + r.overUnderPct.toFixed(0) + '%' : '—'}</strong></div>
    </div>
    <h3>Observations</h3>
    ${obs.length ? `<ul class="obs">${obs.map(({ p, o }) => `<li>
      <strong>${p.name}</strong> <span class="conf ${o.confidence}">${o.confidence}</span>${o.includeInAverage === false ? ' <em>excluded from average</em>' : ''}<br>
      <small>${o.price.toLocaleString()} ${o.currency} · ${o.observedAt} · ${o.note ?? ''}<br>
      ${o.sourceUrl ? `<a href="${o.sourceUrl}" target="_blank" rel="noreferrer">menu source</a> · ` : ''}${p.website ? `<a href="${p.website}" target="_blank" rel="noreferrer">website</a> · ` : ''}<a href="${p.certification.certUrl}" target="_blank" rel="noreferrer">certification (${p.certification.source}${p.certification.memberNumber ? ' #' + p.certification.memberNumber : ''})</a></small>
    </li>`).join('')}</ul>` : '<p>No menu prices yet — census only.</p>'}
    <h3>Certified census (${members.length})</h3>
    <ul class="census">${shown.map((m) => `<li>${m.name} — ${m.city} <a href="${m.memberUrl.trim()}" target="_blank" rel="noreferrer">AVPN #${m.number}</a></li>`).join('')}${members.length > shown.length ? `<li><em>…and ${members.length - shown.length} more (see raw JSON)</em></li>` : ''}</ul>`;
}

function tableHtml(r: CountryRow[]): string {
  return `<table><thead><tr>
    <th>Country</th><th>Avg (${displayCcy})</th><th>vs Naples</th><th>Certified</th><th>Priced</th>
  </tr></thead><tbody>${r.map((x) => {
    const v = inDisplay(x.avgEur);
    const pct = x.overUnderPct;
    return `<tr data-iso="${x.iso}" class="${selected === x.iso ? 'sel' : ''}">
      <td><strong>${x.name}</strong></td>
      <td>${v !== null ? (displayCcy === 'EUR' ? '€' : '$') + fmtN(v) : '<em>pending</em>'}</td>
      <td>${pct !== null ? `<span class="pill ${pct >= 0 ? 'over' : 'under'}">${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%</span>` : '—'}</td>
      <td>${x.nCertified}</td><td>${x.nPriced}</td></tr>`;
  }).join('')}</tbody></table>`;
}

function render() {
  const r = filtered();
  const priced = rows.filter((x) => x.overUnderPct !== null && x.iso !== 'IT');
  const top = [...priced].sort((a, b) => (b.overUnderPct ?? 0) - (a.overUnderPct ?? 0))[0];
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = `
  <header class="top"><div class="wrap top-in">
    <div class="brand">🍕 <strong>Margherita Index</strong></div>
    <nav><a href="#index">Index</a><a href="#data">Data</a><a href="#method">Method</a></nav>
    <span class="fxdate">FX ${FX_DATE}</span>
  </div></header>
  <section class="hero"><div class="wrap">
    <p class="kicker">Big Mac methodology · Italian certification · country averages</p>
    <h1>How much is a real Margherita around the world?</h1>
    <p class="sub">One identical pizza — Margherita at AVPN-certified pizzerias — priced in ${rows.length} markets against a Naples base of €${BASE_EUR.toFixed(2)}.
    ${top ? `Most expensive right now: <strong>${top.name} (${(top.overUnderPct ?? 0) >= 0 ? '+' : ''}${(top.overUnderPct ?? 0).toFixed(0)}%)</strong>.` : ''}</p>
  </div></section>
  <main class="wrap" id="index">
    <div class="controls">
      <input id="q" type="search" placeholder="Search countries…" value="${query.replace(/"/g, '&quot;')}">
      <select id="sort">
        <option value="overUnderPct"${sortKey === 'overUnderPct' ? ' selected' : ''}>Sort: vs Naples</option>
        <option value="avgEur"${sortKey === 'avgEur' ? ' selected' : ''}>Sort: price</option>
        <option value="nCertified"${sortKey === 'nCertified' ? ' selected' : ''}>Sort: certified count</option>
        <option value="name"${sortKey === 'name' ? ' selected' : ''}>Sort: name</option>
      </select>
      <div class="seg">
        <button data-ccy="EUR" class="${displayCcy === 'EUR' ? 'on' : ''}">€ EUR</button>
        <button data-ccy="USD" class="${displayCcy === 'USD' ? 'on' : ''}">$ USD</button>
      </div>
    </div>
    <div class="grid">
      <div class="card chart"><h2>Valuation vs Naples</h2>${chartSvg(r)}</div>
      <aside class="card detail" id="detail">${selected ? detailHtml(selected) : '<p>Select a country.</p>'}</aside>
    </div>
    <div class="card" id="data"><h2>All markets</h2>${tableHtml(r)}</div>
    <div class="card" id="method"><h2>Method</h2>
      <ol>
        <li><strong>Identical basket:</strong> Margherita (tomato, fior-di-latte, basil, EVOO) at a certified pizzeria — the Big Mac's "same sandwich everywhere".</li>
        <li><strong>Whitelist:</strong> AVPN directory (886 members, primary) + Eccellenze Italiane / Ospitalità Italiana. Kestè NYC is listed but excluded from the US average — absent from AVPN.</li>
        <li><strong>Average:</strong> country figure = mean across certified observations. Implied PPP = avg ÷ €${BASE_EUR.toFixed(2)}; signal = (implied − market FX) ÷ market FX.</li>
        <li><strong>Limits:</strong> single product, no GDP adjustment, rents and wages distort, thin coverage where certification is absent.</li>
      </ol></div>
  </main>
  <footer><div class="wrap"><small>Margherita Index · base Naples €${BASE_EUR.toFixed(2)} · FX ${FX_DATE} (ECB; crosses indicative) · certification: pizzanapoletana.org · <a href="./index.json">raw JSON</a> (generated at build from the same data module)</small></div></footer>`;

  document.querySelector('#q')!.addEventListener('input', (e) => {
    query = (e.target as HTMLInputElement).value; render();
    (document.querySelector('#q') as HTMLInputElement).focus();
  });
  document.querySelector('#sort')!.addEventListener('change', (e) => {
    sortKey = (e.target as HTMLSelectElement).value as SortKey; render();
  });
  document.querySelectorAll('.seg button').forEach((b) =>
    b.addEventListener('click', () => { displayCcy = (b as HTMLElement).dataset.ccy as 'EUR' | 'USD'; render(); }));
  const pick = (iso: string) => { selected = iso; render(); };
  document.querySelectorAll('.bar').forEach((g) =>
    g.addEventListener('click', () => pick((g as SVGGElement).dataset.iso!)));
  document.querySelectorAll('tbody tr[data-iso]').forEach((tr) =>
    tr.addEventListener('click', () => pick((tr as HTMLTableRowElement).dataset.iso!)));
  document.querySelector('#dclose')?.addEventListener('click', () => { selected = null; render(); });
}

render();
