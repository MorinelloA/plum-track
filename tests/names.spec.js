import { test, expect } from './support.js';
import { runProbe, issuesOf } from './layout/run-probe.js';

// Athlete names wrap onto another line instead of being cut off with "…".
// Today's names fit, so the test gives the points board a name longer than its column.
test('points-board names wrap instead of being cut off', async ({ page }) => {
  await page.goto('/results/season-archives/2013/points');
  await expect(page.locator('.pb-leader-name').first()).toBeVisible();
  await page.evaluate(() => {
    const long = 'Alexandria Konstantinopoulou Featherstonehaugh-Whitfield';
    document.querySelector('.pb-leader-name').textContent = long;
    document.querySelector('.pb-row .pb-ath').textContent = long;
  });
  const report = await runProbe(page);
  expect(issuesOf(report, ['text-ellipsis', 'text-cut', 'page-overflow', 'word-broken'])).toEqual([]);
});
