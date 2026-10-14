import { test, expect } from './support.js';

// The browser's Back button (Android's Back, a mouse's back button) closes the open dialog and
// stays on the page, instead of leaving the page with the dialog. Each dialog adds a history
// entry while it's open and takes it away again when it closes some other way.
const records = '/records/boys-outdoor';
const progression = page => page.locator('table.records-table tr', { has: page.locator('td.event-name', { hasText: /^4×400 Meter Relay$/ }) })
  .locator('button.progression-link');
const historyIdle = page => expect.poll(() => page.evaluate(() => history.state && history.state.plumDialog)).toBeFalsy();

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.goto(records);
});

test('Back closes the progression timeline and keeps the page and its scroll position', async ({ page }) => {
  await progression(page).scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => window.scrollY);
  expect(y).toBeGreaterThan(0);
  await progression(page).click();
  await expect(page.locator('.timeline-panel')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.timeline-panel')).toBeHidden();
  expect(new URL(page.url()).pathname).toBe(records);
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(Math.round(y));
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test('closing a dialog with its button leaves no extra Back step', async ({ page }) => {
  await progression(page).click();
  await page.locator('.timeline-close').click();
  await expect(page.locator('.timeline-panel')).toBeHidden();
  await historyIdle(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test('Back closes a photo opened over the timeline, then the timeline', async ({ page }) => {
  await progression(page).click();
  await page.locator('.timeline-panel button.athlete-link[title^="View photo of"]').first().click();
  await expect(page.locator('.media-overlay')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.media-overlay')).toBeHidden();
  await expect(page.locator('.timeline-panel')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.timeline-panel')).toBeHidden();
  expect(new URL(page.url()).pathname).toBe(records);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test('Back closes the gallery photo', async ({ page }) => {
  await page.goto('/gallery/2016');
  await page.locator('.photo-grid button.photo-card').first().click();
  await expect(page.locator('.photo-lightbox')).toBeVisible();
  await page.goBack();
  await expect(page.locator('.photo-lightbox')).toBeHidden();
  expect(new URL(page.url()).pathname).toBe('/gallery/2016');
});

test('Back closes the phone menu, and a menu link leaves no extra Back step', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'the menu button is the phone layout');
  await page.locator('button.mobile-menu-toggle').click();
  await expect(page.locator('#mobile-site-menu')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#mobile-site-menu')).toBeHidden();
  expect(new URL(page.url()).pathname).toBe(records);

  await page.locator('button.mobile-menu-toggle').click();
  await page.locator('#mobile-site-menu a', { hasText: 'Schedule' }).click();
  await expect(page).toHaveURL(/\/schedule$/);
  await expect(page.locator('#mobile-site-menu')).toBeHidden();
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(records + '$'));
});
