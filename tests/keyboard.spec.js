import { test, expect } from './support.js';

test('the desktop menu closes on Escape and returns focus to its button', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the dropdown nav is desktop-only');
  await page.goto('/');
  const records = page.locator('button.nav-link', { hasText: 'Records' });
  const dropdown = page.locator('.nav-dropdown');
  await records.click();
  await expect(dropdown).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dropdown).toBeHidden();
  await expect(records).toBeFocused();
});

test('the desktop menu closes on a tap outside it', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the dropdown nav is desktop-only');
  await page.goto('/');
  await page.locator('button.nav-link', { hasText: 'Records' }).click();
  await expect(page.locator('.nav-dropdown')).toBeVisible();
  // A touch tap elsewhere: no mouse leaves the nav, so only the outside-tap rule can close it.
  await page.locator('main').dispatchEvent('pointerdown');
  await expect(page.locator('.nav-dropdown')).toBeHidden();
});
