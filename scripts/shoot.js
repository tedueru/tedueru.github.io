// Screenshot local HTML files for visual QA.
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const files = process.argv.slice(2);
  const browser = await chromium.launch();
  for (const f of files) {
    const abs = path.resolve(f);
    const url = 'file:///' + abs.replace(/\\/g, '/');
    // desktop
    let page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.addStyleTag({ content: '.reveal,.stagger>*{opacity:1!important;transform:none!important}' });
    await page.waitForTimeout(900);
    const base = path.basename(f, '.html');
    await page.screenshot({ path: `data/erumag/shot-${base}-desktop.png`, fullPage: true });
    await page.close();
    // mobile
    page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(900);
    await page.screenshot({ path: `data/erumag/shot-${base}-mobile.png`, fullPage: true });
    await page.close();
    console.log('shot', base);
  }
  await browser.close();
})();
