import { chromium } from 'playwright-core';

const URL = 'http://localhost:8138/';
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
});
const R = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message.slice(0, 200)));
const t0 = Date.now();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(9000);
R.push(['load_ms', Date.now() - t0]);
R.push(['console_errors', errs]);

const q = (sel) => page.evaluate((s) => document.querySelectorAll(s).length, sel);

// 1. sections + nav anchors
for (const id of ['#world', '#globemap', '#detail', '#wages', '#data', '#method']) {
  R.push(['section_' + id, await q(id)]);
}
const navHrefs = await page.evaluate(() => Array.from(document.querySelectorAll('header nav a')).map((a) => a.getAttribute('href')));
R.push(['nav_hrefs', navHrefs]);
for (const h of navHrefs) R.push(['anchor_' + h, await q(h)]);
R.push(['globe_canvas_initial', await q('#globemap canvas')]);
R.push(['table_rows_initial', await q('#data tbody tr')]);
R.push(['hero_text', (await page.evaluate(() => document.querySelector('.hero .sub')?.textContent ?? '')).slice(0, 160)]);

// 2. sort correctness for each option
const sortCheck = await page.evaluate(() => {
  const out = {};
  const sel = document.querySelector('#sort');
  const labels = {};
  for (const opt of sel.options) {
    sel.value = opt.value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    const rows = Array.from(document.querySelectorAll('#data tbody tr')).map((tr) => tr.cells[0].textContent.trim());
    out[opt.value] = rows.slice(0, 4);
  }
  return out;
});
R.push(['sort_orders', sortCheck]);
R.push(['globe_canvas_after_sorts', await q('#globemap canvas')]);

// 3. currency toggle math
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(9000);
const ccy = await page.evaluate(() => {
  const first = () => document.querySelector('#data tbody tr td.num')?.textContent;
  const eur = first();
  document.querySelector('button[data-ccy="USD"]').click();
  const usd = first();
  document.querySelector('button[data-ccy="EUR"]').click();
  const back = first();
  return { eur, usd, back };
});
R.push(['ccy_toggle', ccy]);
R.push(['globe_canvas_after_ccy', await q('#globemap canvas')]);

// 4. search
await page.fill('#q', 'milan');
await page.waitForTimeout(500);
R.push(['search_milan_rows', await page.evaluate(() => Array.from(document.querySelectorAll('#data tbody tr')).map((tr) => tr.cells[0].textContent.trim()))]);
R.push(['globe_canvas_after_search', await q('#globemap canvas')]);
await page.fill('#q', '');
await page.waitForTimeout(300);

// 5. row click -> detail; close; unpriced market (UAE)
await page.evaluate(() => {
  const tr = Array.from(document.querySelectorAll('#data tbody tr')).find((t) => t.cells[0].textContent.includes('Moscow'));
  tr.click();
});
await page.waitForTimeout(400);
R.push(['detail_after_moscow_click', (await page.evaluate(() => document.querySelector('#detail h2')?.textContent ?? 'NONE')).slice(0, 60)]);
R.push(['detail_moscow_stats', (await page.evaluate(() => document.querySelector('#detail .statgrid')?.innerText ?? '')).replace(/\n/g, ' ').slice(0, 200)]);
await page.click('#dclose');
await page.waitForTimeout(300);
R.push(['detail_after_close', (await page.evaluate(() => document.querySelector('#detail')?.textContent ?? '')).slice(0, 80)]);
await page.evaluate(() => {
  const tr = Array.from(document.querySelectorAll('#data tbody tr')).find((t) => t.cells[0].textContent.includes('UAE'));
  tr.click();
});
await page.waitForTimeout(400);
R.push(['detail_uae', (await page.evaluate(() => document.querySelector('#detail')?.innerText ?? '')).replace(/\n/g, ' ').slice(0, 260)]);

// 6. wages math spot check (US row)
const wages = await page.evaluate(() => {
  const rows = Array.from(document.querySelectorAll('#wages tbody tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim()));
  return { count: rows.length, us: rows.find((r) => r[0].includes('United States')) };
});
R.push(['wages', wages]);

// 7. mobile overflow
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await mob.waitForTimeout(9000);
R.push(['mobile_scrollW_vs_inner', await mob.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])]);
R.push(['mobile_globe_canvas', await mob.evaluate(() => document.querySelectorAll('#globemap canvas').length)]);
R.push(['mobile_table_cols', await mob.evaluate(() => document.querySelectorAll('#data thead th').length)]);

for (const [k, v] of R) console.log('AUDIT', k, '=', JSON.stringify(v));
await browser.close();
