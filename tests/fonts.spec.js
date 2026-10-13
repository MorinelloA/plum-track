import { test, expect } from './support.js';
import { runProbe, issuesOf } from './layout/run-probe.js';

// Text uses real font files, not bold or italic the browser fakes: IBM Plex Mono 600/700
// (record marks, points) and Barlow italic (notes) are loaded. Anton has a single face, and
// its synthesised bold and italic are the site's look (kept, decision P1), so it's left out.
const notAnton = report => issuesOf({ issues: report.issues.filter(i => i.family !== 'Anton') }, ['faux-bold', 'faux-italic']);

test('text uses real font faces, not synthesised bold or italic', async ({ page }) => {
  for (const path of ['/records/boys-outdoor', '/results/season-archives/2013/points', '/results/wpial-placers', '/coachi']) {
    await page.goto(path);
    await expect(page.locator('main')).not.toContainText(/loading season archives/i);
    expect(notAnton(await runProbe(page)), path).toEqual([]);
  }
  // a progression timeline with a note (Barlow italic)
  await page.goto('/records/boys-outdoor');
  await page.locator('table.records-table tr', { has: page.locator('td.event-name', { hasText: /^110m High Hurdles$/ }) })
    .locator('button.progression-link').click();
  await expect(page.locator('.timeline-panel .node-note').first()).toBeVisible();
  expect(notAnton(await runProbe(page)), 'timeline').toEqual([]);
});
