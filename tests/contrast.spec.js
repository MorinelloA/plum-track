import { test, expect } from './support.js';
import { runProbe, issuesOf } from './layout/run-probe.js';

// Text meets WCAG 2.2 AA: 4.5:1, or 3:1 for large text and for glyphs standing in for icons.
// Decorative text (aria-hidden, outside any control) is exempt.
const TEXT = ['contrast-text', 'contrast-on-gradient'];
const PAGES = [
  '/', '/records/boys-outdoor', '/results/wpial-champions', '/results/wpial-placers',
  '/results/season-archives/2013/points', '/results/season-archives/2017/performance-lists',
  '/roster/2015', '/learn/drills/ladders', '/learn/inspiration/records', '/schedule', '/contact',
  '/coachi', '/donate', '/states',
];

test('text meets WCAG AA contrast on the main pages', async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator('main')).not.toContainText(/loading season archives/i);
    expect(issuesOf(await runProbe(page), TEXT), path).toEqual([]);
  }
});

test('text meets WCAG AA contrast in the progression timeline and the menu', async ({ page }, testInfo) => {
  for (const [path, event] of [['/records/boys-outdoor', '4×400 Meter Relay'], ['/records/girls-outdoor', '100 Meter Dash']]) {
    await page.goto(path);
    await page.locator('table.records-table tr', { has: page.locator('td.event-name', { hasText: new RegExp('^' + event + '$') }) })
      .locator('button.progression-link').click();
    await expect(page.locator('.timeline-panel')).toBeVisible();
    expect(issuesOf(await runProbe(page), TEXT), event).toEqual([]);
  }
  if (testInfo.project.name === 'phone') {
    await page.goto('/records/boys-outdoor');
    await page.locator('button.mobile-menu-toggle').click();
    await expect(page.locator('#mobile-site-menu')).toBeVisible();
    expect(issuesOf(await runProbe(page), TEXT), 'menu').toEqual([]);
  }
});
