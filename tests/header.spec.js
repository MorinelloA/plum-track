import { test, expect } from './support.js';

// The header scrolls away with the page; it is never pinned. `.site-header` declares
// `position: sticky`, but `html, body { overflow-x: hidden }` keeps that inert. Changing
// either to `overflow-x: clip` would pin the header, and this test would fail.
test('the header scrolls away with the page', async ({ page }) => {
  await page.goto('/records/boys-outdoor');
  await page.evaluate(() => window.scrollTo(0, 1500));
  const bottom = await page.locator('header.site-header').evaluate(el => el.getBoundingClientRect().bottom);
  expect(bottom).toBeLessThan(0);
});
