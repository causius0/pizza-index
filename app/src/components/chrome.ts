import { FX_DATE } from '../data/fx.ts';
import { BASE_EUR } from '../data/markets.ts';

// Static editorial chrome: header, hero, method, footer.
export function header(): string {
  return `<header class="top"><div class="wrap top-in">
    <div class="brand"><span class="brand-mark">◉</span> <strong>Margherita Index</strong></div>
    <nav><a href="#world">Globe</a><a href="#wages">Wages</a><a href="#data">Data</a><a href="#method">Method</a></nav>
    <span class="fxdate">FX ${FX_DATE}</span>
  </div></header>`;
}

export function hero(marketCount: number, pricedCount: number, topLabel: string): string {
  return `<section class="hero"><div class="wrap hero-in">
    <div class="hero-main">
      <p class="kicker">Nº 01 — Big Mac methodology, Italian certification</p>
      <h1>How much is a real Margherita<br>around the world?</h1>
      <p class="sub">One identical pizza — a Margherita at AVPN-certified pizzerias — priced across
      ${marketCount} markets against Naples (€${BASE_EUR.toFixed(2)}). ${topLabel}</p>
    </div>
    <dl class="hero-facts">
      <div><dt>Base</dt><dd>Naples €${BASE_EUR.toFixed(2)}</dd></div>
      <div><dt>Priced</dt><dd>${pricedCount} markets</dd></div>
      <div><dt>Uniformity</dt><dd>AVPN whitelist, not a chain</dd></div>
      <div><dt>Figure</dt><dd>Mean per market</dd></div>
    </dl>
  </div></section>`;
}

export function method(): string {
  return `<section class="card" id="method"><div class="method-in">
    <h2>Method</h2>
    <dl class="method-list">
      <div><dt>Identical basket</dt><dd>Margherita — tomato, fior-di-latte, basil, extra-virgin olive oil — at a certified pizzeria. The Big Mac's “same sandwich everywhere”, without the chain.</dd></div>
      <div><dt>Whitelist</dt><dd>AVPN directory (886 members, primary) plus Eccellenze Italiane and Ospitalità Italiana. Only directory-listed venues enter the averages — no exceptions.</dd></div>
      <div><dt>Average, not single</dt><dd>Each market figure is the mean across all certified observations in that market. Italy is split into Naples, Rome and Milan.</dd></div>
      <div><dt>Wages</dt><dd>Mean (and median where sourced) monthly pay per country; hours-to-Margherita assumes a 176-hour month. Gross and net figures are never mixed without a label.</dd></div>
      <div><dt>Limits</dt><dd>Single product, no GDP adjustment, rents and wages distort, thin coverage where certification is absent. Stale or proxy figures carry LOW/MED badges, never HIGH.</dd></div>
    </dl>
  </div></section>`;
}

export function footer(): string {
  return `<footer><div class="wrap foot-in">
    <div><strong>Margherita Index</strong><br><small>Base Naples €${BASE_EUR.toFixed(2)} · FX ${FX_DATE} (ECB; crosses indicative) · menu prices observed Sep 2026 · wages: UNECE/OECD + national sources, see table</small></div>
    <div><small>Certification: <a href="https://www.pizzanapoletana.org/en/associati">pizzanapoletana.org</a><br>Built with TypeScript + Vite · no backend</small></div>
  </div></footer>`;
}
