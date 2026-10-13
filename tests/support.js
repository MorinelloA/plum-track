// Shared test setup: no test reaches a real third-party service.
// Local pages and Google Fonts load; Formspree, Zeffy and YouTube are answered locally;
// everything else is blocked.
import { test as base, expect } from '@playwright/test';

const LOCAL = new Set(['127.0.0.1', 'localhost']);
const FONTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.clock.setFixedTime(new Date('2026-10-14T16:00:00Z'));
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (LOCAL.has(url.hostname) || FONTS.has(url.hostname) || url.protocol === 'data:') return route.continue();
      if (url.hostname === 'formspree.io') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
      if (/zeffy\.com$/.test(url.hostname) || /youtube\.com$/.test(url.hostname)) return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
      return route.abort('blockedbyclient');
    });
    await use(page);
  },
});

export { expect };

// Desktop-only and phone-only tests: the site switches to its mobile layer at 1024px.
export const desktopOnly = testInfo => testInfo.project.name !== 'desktop';
export const phoneOnly = testInfo => testInfo.project.name !== 'phone';
