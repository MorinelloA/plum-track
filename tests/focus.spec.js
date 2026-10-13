import { test, expect } from './support.js';
import { loadProbe, settled } from './layout/run-probe.js';

// Every keyboard stop shows a focus ring at 3:1 or better against what's around it
// (WCAG 2.4.7 and 1.4.11): plum on light surfaces, gold on dark ones.
async function tabThrough(page, label, stops) {
  for (let i = 0; i < stops; i++) {
    await page.keyboard.press('Tab');
    await settled(page);
    const f = await page.evaluate(() => window.__plumFocusCheck());
    if (!f || f.tag === 'iframe') continue;   // a third-party frame draws its own focus
    const what = `${label}: ${f.tag}.${String(f.cls || '').split(' ')[0]} "${f.text}"`;
    expect(f.visible, `${what} has no focus ring`).toBe(true);
    expect(f.ratio, `${what}: ring ${f.ring} on ${f.bg}`).toBeGreaterThanOrEqual(3);
  }
}

test('focus rings are visible at 3:1 on light and dark surfaces', async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of ['/', '/records/boys-outdoor', '/contact', '/donate', '/gallery/2016']) {
    await page.goto(path);
    await loadProbe(page);
    await tabThrough(page, path, 30);
  }
});

test('focus rings show inside the photo lightbox', async ({ page }) => {
  await page.goto('/gallery/2016');
  await page.locator('.photo-grid button.photo-card').first().click();
  await expect(page.locator('.photo-lightbox')).toBeVisible();
  await loadProbe(page);
  await tabThrough(page, 'photo lightbox', 4);
});
