// Shared test setup: no test reaches a real third-party service.
// Local pages load; Google Fonts come from a local cache (filled from the network the first
// time); Formspree, Zeffy and YouTube are answered locally; everything else is blocked.
import { test as base, expect } from '@playwright/test';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const LOCAL = new Set(['127.0.0.1', 'localhost']);
const FONTS = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);
const FONT_CACHE = path.join(process.cwd(), 'node_modules', '.cache', 'plum-track-fonts');

// A slow or stalled font download would hold up the page's load event and fail tests that
// have nothing to do with fonts, so each file is fetched once and then served from disk.
async function serveFont(route) {
  const url = route.request().url();
  const file = path.join(FONT_CACHE, crypto.createHash('sha1').update(url).digest('hex'));
  if (fs.existsSync(file + '.bin') && fs.existsSync(file + '.json')) {
    const { headers } = JSON.parse(fs.readFileSync(file + '.json', 'utf8'));
    return route.fulfill({ status: 200, headers, body: fs.readFileSync(file + '.bin') });
  }
  const response = await route.fetch({ timeout: 20_000 });
  const body = await response.body();
  const headers = { 'content-type': response.headers()['content-type'] || '', 'access-control-allow-origin': '*' };
  if (response.ok()) {
    // Written aside and renamed into place, so the other worker never reads half a file.
    fs.mkdirSync(FONT_CACHE, { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, body);
    fs.renameSync(tmp, file + '.bin');
    fs.writeFileSync(tmp, JSON.stringify({ url, headers }));
    fs.renameSync(tmp, file + '.json');
  }
  return route.fulfill({ status: response.status(), headers, body });
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.clock.setFixedTime(new Date('2026-10-14T16:00:00Z'));
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (LOCAL.has(url.hostname) || url.protocol === 'data:') return route.continue();
      if (FONTS.has(url.hostname)) return serveFont(route).catch(() => route.abort('failed').catch(() => {}));
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
