import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
await page.goto('http://localhost:8138/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(9000);
const info = await page.evaluate(() => ({
  canvases: document.querySelectorAll('canvas').length,
  globeText: (document.querySelector('#globemap')?.textContent ?? '').slice(0, 160),
}));
console.log('PAGE:', JSON.stringify(info));
console.log('ERRORS:', JSON.stringify(errors.slice(0, 12), null, 1));
await page.screenshot({ path: '/tmp/globe_check.png' });
await browser.close();
