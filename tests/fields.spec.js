import { test, expect } from './support.js';
import { runProbe, issuesOf } from './layout/run-probe.js';

// The contact form's fields: edges you can see (3:1 against the form), placeholders you can
// read (4.5:1), one height of at least 44px for the single-line fields, and 16px text on a
// touch screen, where iPhones and iPads zoom into anything smaller.
const FIELDS = ['contrast-field-edge', 'contrast-placeholder', 'field-heights-differ', 'input-under-16-coarse', 'field-text-below-kit'];

async function checkForm(page) {
  await page.goto('/contact');
  expect(issuesOf(await runProbe(page), FIELDS)).toEqual([]);
  const heights = await page.locator('.contact-form').locator('input:not([type="hidden"]), select')
    .evaluateAll(els => els.map(e => Math.round(e.getBoundingClientRect().height)));
  expect(heights.length).toBe(3);
  expect(new Set(heights).size, `heights ${heights}`).toBe(1);
  expect(heights[0]).toBeGreaterThanOrEqual(44);
}

test('contact form fields are easy to see, read and tap', async ({ page }) => {
  await checkForm(page);
});

// A tablet held sideways gets the desktop layout, but a finger and the on-screen keyboard.
test.describe('landscape tablet', () => {
  test.use({ viewport: { width: 1194, height: 834 }, isMobile: true, hasTouch: true });

  test('contact form fields use 16px text on a touch screen', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the same device in both projects: one run is enough');
    await checkForm(page);
  });
});
