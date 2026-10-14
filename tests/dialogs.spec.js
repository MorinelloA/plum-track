import { test, expect } from './support.js';

// Every dialog closes with the same button: 44px square, with an 18px close icon.
// Its shape and colours follow the surface (square in a toolbar, round over a photo).
async function closeButton(page, selector) {
  const button = page.locator(selector);
  await expect(button).toBeVisible();
  const box = await button.boundingBox();
  const svg = button.locator('svg.icon');
  const icon = (await svg.count()) ? await svg.first().boundingBox() : null;
  return { selector, width: Math.round(box.width), height: Math.round(box.height), icon: icon && Math.round(icon.height) };
}

test('every dialog has the same close button', async ({ page }, testInfo) => {
  const found = [];
  await page.goto('/records/boys-outdoor');
  await page.locator('table.records-table tr', { has: page.locator('td.event-name', { hasText: /^4×400 Meter Relay$/ }) })
    .locator('button.progression-link').click();
  found.push(await closeButton(page, '.timeline-close'));
  await page.keyboard.press('Escape');

  await page.locator('table.records-table button.athlete-link[title^="View photo of"]').first().click();
  found.push(await closeButton(page, '.media-close'));
  await page.keyboard.press('Escape');

  await page.goto('/gallery/2016');
  await page.locator('.photo-grid button.photo-card').first().click();
  found.push(await closeButton(page, '.photo-lightbox-close'));
  await page.keyboard.press('Escape');

  if (testInfo.project.name === 'phone') {
    await page.locator('button.mobile-menu-toggle').click();
    found.push(await closeButton(page, '.mobile-menu-toolbar button'));
  }
  expect(found).toEqual(found.map(b => ({ selector: b.selector, width: 44, height: 44, icon: 18 })));
});
