import './style.css';
import { FX_DATE } from './data/fx.ts';
import { BASE_EUR, BASE_KEY, computeMarkets, type Market } from './data/markets.ts';
import { header, hero, method, footer } from './components/chrome.ts';
import { marketTable, type DisplayCcy, type SortKey } from './components/table.ts';
import { detailPanel } from './components/detail.ts';
import { wageSection } from './components/wages.ts';
import { mountGlobe } from './components/globe.ts';
import { fmtSignedPct } from './lib/format.ts';

interface State {
  query: string;
  sort: SortKey;
  ccy: DisplayCcy;
  selected: string | null;
}

const params = new URLSearchParams(location.search);
const initialSelected = params.get('market');

const state: State = { query: '', sort: 'overUnderPct', ccy: 'EUR', selected: initialSelected ?? 'US' };
const markets = computeMarkets();
if (initialSelected && !markets.some((m) => m.key === initialSelected)) state.selected = 'US';
let globeNode: HTMLElement | null = null;

function visible(): Market[] {
  const q = state.query.trim().toLowerCase();
  const rows = markets.filter(
    (m) => !q || m.label.toLowerCase().includes(q) || m.key.toLowerCase() === q,
  );
  return [...rows].sort((a, b) => {
    if (state.sort === 'label') return a.label.localeCompare(b.label);
    if (state.sort === 'nCertified') return b.nCertified - a.nCertified;
    const av = state.sort === 'avgEur' ? a.avgEur : a.overUnderPct;
    const bv = state.sort === 'avgEur' ? b.avgEur : b.overUnderPct;
    return (bv ?? -Infinity) - (av ?? -Infinity);
  });
}

function topLine(): string {
  const priced = markets.filter((m) => m.overUnderPct !== null && m.key !== BASE_KEY);
  if (!priced.length) return '';
  const top = [...priced].sort((a, b) => (b.overUnderPct ?? 0) - (a.overUnderPct ?? 0))[0];
  return `Dearest is <strong>${top.label} (${fmtSignedPct(top.overUnderPct)})</strong>.`;
}

function render(): void {
  const rows = visible();
  const sel = markets.find((m) => m.key === state.selected);
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${header()}
  ${hero(markets.length, topLine())}
  <main class="wrap">
    <div class="controls">
      <input id="q" type="search" placeholder="Search markets…" aria-label="Search markets" value="${state.query.replace(/"/g, '&quot;')}">
      <select id="sort" aria-label="Sort">
        <option value="overUnderPct"${state.sort === 'overUnderPct' ? ' selected' : ''}>Sort: vs Naples</option>
        <option value="avgEur"${state.sort === 'avgEur' ? ' selected' : ''}>Sort: price</option>
        <option value="nCertified"${state.sort === 'nCertified' ? ' selected' : ''}>Sort: certified count</option>
        <option value="label"${state.sort === 'label' ? ' selected' : ''}>Sort: name</option>
      </select>
      <div class="seg" role="group" aria-label="Display currency">
        <button data-ccy="EUR" class="${state.ccy === 'EUR' ? 'on' : ''}">€ EUR</button>
        <button data-ccy="USD" class="${state.ccy === 'USD' ? 'on' : ''}">$ USD</button>
      </div>
    </div>
    <div class="split" id="world">
      <div class="card globe-card">
        <h2>The world, priced</h2>
        <div id="globemap" aria-label="Globe color-coded by valuation vs Naples"></div>
        <div class="globe-legend">
          <span><i class="swatch" style="background:#c9a227"></i>Naples base</span>
          <span><i class="swatch" style="background:#b5341f"></i>pricier than Naples</span>
          <span><i class="swatch dot"></i>priced pizzeria — hover for name, click for market</span>
          <span><i class="swatch" style="background:#d8d2c4"></i>no data yet</span>
        </div>
      </div>
      <aside class="card detail" id="detail">${detailPanel(sel)}</aside>
    </div>
    ${wageSection(markets)}
    <div class="card" id="data"><h2>All markets</h2>
      <p class="lede">Means across certified observations. Italy enters as three cities — Naples (€${BASE_EUR.toFixed(2)}, the base), Rome and Milan. FX ${FX_DATE}.${rows.length !== markets.length ? ` Showing ${rows.length} of ${markets.length}.` : ''}</p>
      ${marketTable(rows, state.ccy, state.selected, state.sort)}</div>
    ${method()}
  </main>
  ${footer()}`;

  const q = document.querySelector<HTMLInputElement>('#q')!;
  q.addEventListener('input', () => {
    state.query = q.value;
    const pos = q.selectionStart;
    render();
    const nq = document.querySelector<HTMLInputElement>('#q')!;
    nq.focus();
    nq.setSelectionRange(pos, pos);
  });
  document.querySelector('#sort')!.addEventListener('change', (e) => {
    state.sort = (e.target as HTMLSelectElement).value as SortKey;
    render();
  });
  document.querySelectorAll('.seg button').forEach((b) =>
    b.addEventListener('click', () => {
      state.ccy = (b as HTMLElement).dataset.ccy as DisplayCcy;
      render();
    }));
  const pick = (key: string): void => {
    state.selected = key;
    const url = new URL(location.href);
    url.searchParams.set('market', key);
    history.replaceState(null, '', url);
    render();
    document.querySelector('#detail')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  document.querySelectorAll('tbody tr[data-key]').forEach((tr) => {
    const key = (tr as HTMLTableRowElement).dataset.key!;
    tr.addEventListener('click', () => pick(key));
    tr.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        pick(key);
      }
    });
  });
  const sortBy = (key: string): void => {
    state.sort = key as SortKey;
    render();
  };
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    const key = (th as HTMLElement).dataset.sort!;
    th.addEventListener('click', () => sortBy(key));
    th.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        sortBy(key);
      }
    });
  });
  document.querySelector('#dclose')?.addEventListener('click', () => {
    state.selected = null;
    render();
  });

  if (!globeNode) {
    const el = document.querySelector<HTMLElement>('#globemap');
    if (el) {
      globeNode = el;
      el.innerHTML = '<p class="globe-loading">Loading map…</p>';
      // Mount only when scrolled near: the 3D chunk + map tiles are heavy.
      const io = new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        void mountGlobe(el, markets, pick)
          .then(() => el.querySelector('.globe-loading')?.remove())
          .catch(() => {
            globeNode = null; // retry on next render
            el.innerHTML = '<p class="globe-fallback">Map tiles failed to load — check your connection. Every figure is in the table below.</p>';
          });
      }, { rootMargin: '300px' });
      io.observe(el);
    }
  } else {
    // Re-attach the live globe (with its WebGL context) instead of remounting.
    document.querySelector('#globemap')?.replaceWith(globeNode);
  }
}

render();
