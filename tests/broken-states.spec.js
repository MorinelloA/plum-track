import { test, expect } from './support.js';

const archivesReady = page => expect(page.locator('main')).not.toContainText(/loading season archives/i);

test('picking 2020 in the season archives goes to a real URL', async ({ page }, testInfo) => {
  await page.goto('/results/season-archives/2016/dual-meets');
  await archivesReady(page);
  if (testInfo.project.name === 'desktop') await page.locator('.archive-yearrail').getByText('2020', { exact: true }).click();
  else await page.locator('.mobile-year-picker select').selectOption('2020');
  await page.waitForURL(/season-archives\/2020/);
  expect(page.url()).not.toContain('undefined');
  await expect(page.locator('main')).toContainText('No data on file');
});
