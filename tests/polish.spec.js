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
