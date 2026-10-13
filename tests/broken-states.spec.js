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

test('a failed archive load offers Try again instead of loading forever', async ({ page }) => {
  let fail = true;
  await page.route(/\/(src\/data\/archives\.js|assets\/archives-[^/]+\.js)/, route => (fail ? route.abort('failed') : route.continue()));
  await page.goto('/results/season-archives/2016/dual-meets');
  const retry = page.getByRole('button', { name: 'Try again' });
  await expect(retry).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('alert')).toContainText(/couldn't load the season archives/i);
  fail = false;
  await retry.click();
  await archivesReady(page);
  await expect(page.locator('.archive-sectabs')).toBeVisible();
});
