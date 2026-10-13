import { test, expect } from './support.js';
import { runProbe, issuesOf } from './layout/run-probe.js';

// Icons are SVG (src/components/Icon.jsx), not text glyphs (☰ ✕ ▾ ‹ › ▶ → ← ↗ ★ ▢) that
// fall back to the device's fonts or turn into colour emoji.
const GLYPHS = ['glyph-icon'];

test('pages draw icons as SVG, not text glyphs', async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of ['/', '/records/boys-outdoor', '/results/piaa-champions', '/results/wpial-champions', '/donate', '/coachi', '/learn', '/learn/drills/ladders', '/states']) {
    await page.goto(path);
    expect(issuesOf(await runProbe(page), GLYPHS), path).toEqual([]);
  }
});

test('dialogs draw icons as SVG, not text glyphs', async ({ page }) => {
  await page.goto('/records/boys-outdoor');
  await page.locator('table.records-table tr', { has: page.locator('td.event-name', { hasText: /^4×400 Meter Relay$/ }) })
    .locator('button.progression-link').click();
  await expect(page.locator('.timeline-panel')).toBeVisible();
  expect(issuesOf(await runProbe(page), GLYPHS), 'timeline').toEqual([]);
  await page.goto('/gallery/2016');
  await page.locator('.photo-grid button.photo-card').first().click();
  await expect(page.locator('.photo-lightbox')).toBeVisible();
  expect(issuesOf(await runProbe(page), GLYPHS), 'photo lightbox').toEqual([]);
});
