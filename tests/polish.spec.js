import { test, expect } from './support.js';

const settled = page => page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'));

test('hover lifts only happen on devices that can hover', async ({ page }, testInfo) => {
  // On touch screens a tapped card kept its hover lift until the next tap elsewhere.
  await page.goto('/learn');
  const card = page.locator('a.learn-card').first();
  await card.hover();
  await settled(page);
  const transform = await card.evaluate(el => getComputedStyle(el).transform);
  const canHover = await page.evaluate(() => matchMedia('(hover: hover)').matches);
  if (testInfo.project.name === 'phone') {
    expect(canHover).toBe(false);
    expect(transform).toBe('none');
  } else {
    expect(canHover).toBe(true);
    expect(transform).not.toBe('none');
  }
});

test('a drill library loads only the clips near the screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport is enough');
  const clips = new Set();
  page.on('request', r => { if (/\/videos\/ladderdrills\//.test(r.url())) clips.add(r.url()); });
  await page.goto('/learn/drills/ladders');
  await expect(page.locator('.ladder-tile').first()).toBeVisible();
  await page.waitForTimeout(2000);
  expect(await page.locator('.ladder-tile').count()).toBeGreaterThan(25);
  expect(clips.size).toBeLessThan(15);
  // ...and a tile scrolled into view loads its clip
  const last = page.locator('.ladder-tile video').last();
  await last.scrollIntoViewIfNeeded();
  await expect.poll(() => last.evaluate(v => !!v.currentSrc)).toBe(true);
});

test('the home hero horse icon (CC BY 3.0) is credited on the page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer').getByText(/Horse icon by Delapouite/i)).toBeVisible();
  await expect(page.locator('footer a[href="https://creativecommons.org/licenses/by/3.0/"]')).toHaveCount(1);
});
