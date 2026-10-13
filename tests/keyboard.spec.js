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

test('each page has its own title', async ({ page }) => {
  const site = 'Plum Mustangs Track & Field';
  const cases = [
    ['/', site],
    ['/records/boys-outdoor', 'Boys Outdoor Records · ' + site],
    ['/jrhigh/girls', 'Junior High Girls Records · ' + site],
    ['/results/wpial-placers', 'WPIAL Placers · ' + site],
    ['/results/season-archives/2016/dual-meets', '2016 Season Archives · ' + site],
    ['/gallery/2007', '2007 Photos & Videos · ' + site],
    ['/roster/2012', '2015 Roster · ' + site],
    ['/learn/drills/hurdles', 'Hurdle Drills · ' + site],
    ['/contact', 'Contact · ' + site],
  ];
  for (const [path, title] of cases) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
  }
  // and after an in-app navigation
  await page.goto('/records/boys-outdoor');
  await page.locator('.subnav-tab', { hasText: 'Girls Indoor' }).click();
  await expect(page).toHaveTitle('Girls Indoor Records · ' + site);
});

test('a skip link is the first stop and jumps to the main content', async ({ page }) => {
  await page.goto('/records/boys-outdoor');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('after an in-app navigation, focus moves to the new page heading', async ({ page }) => {
  await page.goto('/records/boys-outdoor');
  await page.locator('.subnav-tab', { hasText: 'Girls Indoor' }).click();
  await expect(page).toHaveURL(/girls-indoor/);
  await expect(page.locator('main h1')).toBeFocused();
});

test('season, section and record pickers are navigation with a current item, not fake tabs', async ({ page }, testInfo) => {
  for (const path of ['/results/season-archives/2016/dual-meets', '/gallery/2016', '/roster/2015', '/records/boys-outdoor', '/learn/drills/hurdles']) {
    await page.goto(path);
    await expect(page.locator('main [role="tab"], main [role="tablist"]')).toHaveCount(0);
  }
  await page.goto('/records/boys-outdoor');
  await expect(page.getByRole('navigation', { name: 'Record lists' }).locator('[aria-current="page"]')).toHaveText('Boys Outdoor');
  await page.goto('/results/season-archives/2016/dual-meets');
  await expect(page.getByRole('navigation', { name: 'Archive sections' }).locator('[aria-current="page"]')).toContainText('Dual');
  if (testInfo.project.name === 'desktop') {   // the year rails are desktop-only; phones get a select
    await expect(page.getByRole('navigation', { name: 'Season year' }).locator('[aria-current="page"]')).toHaveText('2016');
    await page.goto('/gallery/2007');
    await expect(page.getByRole('navigation', { name: 'Season year' }).locator('[aria-current="page"]')).toHaveText('2007');
  }
});
