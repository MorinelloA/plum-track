import { test, expect } from './support.js';
import { runProbe, issuesOf } from './layout/run-probe.js';

// The layout rules from the UI audit, on the main screens at phone, tablet and desktop sizes
// and at 200% zoom: nothing pushes the page sideways, no control or text is cut off, words
// don't break mid-word, tables fit, grids leave no empty columns, fields line up at one
// height with text big enough not to zoom on iPhone, and no text is under 10px.
// (Touch sizes, contrast, fonts and icons have their own specs.)
const LAYOUT = [
  'page-overflow', 'clipped-control', 'text-cut', 'text-ellipsis', 'text-clamped', 'word-broken', 'input-truncates',
  'table-overflow', 'grid-empty-column', 'floating-outside', 'tablet-column', 'text-under-10',
  'field-row-crowded', 'field-pair-unequal', 'field-tops-misaligned', 'field-heights-differ', 'field-edge-drift',
  'field-text-below-kit', 'input-under-16-coarse',
];
// Tile and card grids keep a partial last row so every tile stays one size, like a photo
// gallery: drill families, the Learn index, roster class groups (decided at checkpoint 2).
const PARTIAL_ROWS_KEPT = /\b(ladder-grid|subtopic-list|roster-grid)\b/;
const layoutIssues = report => issuesOf({
  issues: report.issues.filter(i => !(i.kind === 'grid-empty-column' && PARTIAL_ROWS_KEPT.test(i.selector))),
}, LAYOUT);

const PAGES = [
  '/', '/records/boys-outdoor', '/records/boys-indoor', '/results/piaa-champions', '/results/piaa-placers',
  '/results/season-archives/2024/invitationals', '/results/season-archives/2016/dual-meets',
  '/results/season-archives/2013/points', '/gallery/2016', '/roster/2015', '/schedule',
  '/learn', '/learn/drills/hurdles', '/contact', '/states', '/coachi', '/donate',
];

// The phone project brings a touch screen, the desktop project a mouse.
const SIZES = [
  { name: 'phone 320', project: 'phone', use: { viewport: { width: 320, height: 568 } } },
  { name: 'phone 390', project: 'phone', use: { viewport: { width: 390, height: 844 } } },
  { name: 'tablet 834', project: 'phone', use: { viewport: { width: 834, height: 1194 } } },
  { name: 'landscape tablet 1194', project: 'phone', use: { viewport: { width: 1194, height: 834 } } },
  { name: 'desktop 1280 at 200% zoom', project: 'desktop', use: { viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 } },
];

for (const size of SIZES) {
  test.describe(size.name, () => {
    test.use(size.use);

    test('main screens lay out cleanly', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== size.project, `runs in the ${size.project} project`);
      test.setTimeout(240_000);
      for (const path of PAGES) {
        await page.goto(path);
        await expect(page.locator('main h1').first()).toBeVisible();
        await expect(page.locator('main')).not.toContainText(/loading season archives/i);
        expect(layoutIssues(await runProbe(page)), path).toEqual([]);
      }
      await page.goto('/records/boys-outdoor');
      await page.locator('table.records-table tr', { has: page.locator('td.event-name', { hasText: /^4×400 Meter Relay$/ }) })
        .locator('button.progression-link').click();
      await expect(page.locator('.timeline-panel')).toBeVisible();
      expect(layoutIssues(await runProbe(page)), 'progression timeline').toEqual([]);
    });
  });
}
