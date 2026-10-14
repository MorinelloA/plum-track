// Layout and regression tests (npm run test:layout).
// Starts the dev server on its own port unless BASE_URL points at a running copy
// (for example the audit's "before" app, to show a test fails on the old code).
import { defineConfig, devices } from '@playwright/test';

const PORT = 3110;
const baseURL = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  // One retry: on this machine, web-scanning security software sometimes holds local
  // responses for 10 seconds at a time. A test that passes on retry is reported as flaky.
  retries: 1,
  workers: 2,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: `npm run dev -- --config tests/vite.config.js --port ${PORT} --strictPort --host 127.0.0.1`,
    // Ready once the season archives module (3.7MB in dev) has compiled, so the first tests
    // don't wait on it.
    url: `${baseURL}/src/data/archives.js`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
