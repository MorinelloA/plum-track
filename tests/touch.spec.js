import { test, expect } from './support.js';
import { runProbe, issuesOf } from './layout/run-probe.js';

// Every control can be hit over at least 44px square with a touch screen and 24px with a
// mouse (WCAG 2.5.8's spacing and inline-text exceptions apply), and nothing covers it.
// Small controls get an invisible hit area (styles.css, "Touch targets") rather than a
// bigger look, so the probe measures where a tap lands, not the drawn box.
const TOUCH = ['touch-small', 'touch-covered'];
const PAGES = [
  '/', '/records/boys-indoor', '/results/piaa-placers', '/results/season-archives/2016/honor-roll',
  '/learn/drills/hurdles', '/learn/inspiration/records', '/contact', '/donate',
];

async function checkPages(page) {
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator('main')).not.toContainText(/loading season archives/i);
    expect(issuesOf(await runProbe(page), TOUCH), path).toEqual([]);
  }
  await page.goto('/records/boys-outdoor');
  await page.locator('table.records-table tr', { has: page.locator('td.event-name', { hasText: /^4×400 Meter Relay$/ }) })
    .locator('button.progression-link').click();
  await expect(page.locator('.timeline-panel')).toBeVisible();
  expect(issuesOf(await runProbe(page), TOUCH), 'progression timeline').toEqual([]);
}

test('controls are big enough to hit', async ({ page }) => {
  test.setTimeout(180_000);
  await checkPages(page);
});

// A tablet held sideways is wider than 1024px, so it gets the desktop layout with a finger
// for a pointer: the case the 1024px layer's larger controls never reach.
test.describe('landscape tablet', () => {
  test.use({ viewport: { width: 1194, height: 834 }, isMobile: true, hasTouch: true });

  test('controls are big enough to hit with a finger', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the same device in both projects: one run is enough');
    test.setTimeout(180_000);
    await page.goto('/');
    expect(await page.evaluate(() => [innerWidth, matchMedia('(pointer: coarse)').matches])).toEqual([1194, true]);
    await checkPages(page);
    await page.goto('/');
    await page.locator('button.nav-link', { hasText: 'Records' }).first().click();
    await expect(page.locator('.nav-dropdown').first()).toBeVisible();
    expect(issuesOf(await runProbe(page), TOUCH), 'Records menu').toEqual([]);
  });
});
