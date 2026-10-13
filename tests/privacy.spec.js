import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from './support.js';

// Source files are read from APP_ROOT (default: this checkout), so a test can be pointed at
// another copy of the site, such as the audit's "before" app.
const ROOT = process.env.APP_ROOT || process.cwd();
const desktopOnly = testInfo => test.skip(testInfo.project.name !== 'desktop', 'a file check: one project is enough');

// EXIF (including GPS position) sits in a JPEG's APP1 segment, which starts "Exif\0\0".
const hasExif = file => fs.readFileSync(file).subarray(0, 65536).includes(Buffer.from('Exif\0\0', 'latin1'));

test('public photos carry no EXIF metadata, so no GPS location', async ({}, testInfo) => {
  desktopOnly(testInfo);
  for (const p of ['photos/athletes/ashley-amato.jpg', 'photos/athletes/haley-pilston.JPG', 'photos/athletes/ana-benitez.JPG', 'photos/coachi/gate8.JPG']) {
    expect(hasExif(path.join(ROOT, 'public', p)), p).toBe(false);
  }
});

test('the re-encoded iPhone photos stay upright', async ({ page }, testInfo) => {
  // They were stored landscape with an EXIF "rotate 90°" flag. Stripping the metadata
  // without applying the rotation would have turned them sideways.
  desktopOnly(testInfo);
  await page.goto('/');
  for (const p of ['photos/athletes/ashley-amato.jpg', 'photos/athletes/haley-pilston.JPG']) {
    const [w, h] = await page.evaluate(async src => { const img = new Image(); img.src = '/' + src; await img.decode(); return [img.naturalWidth, img.naturalHeight]; }, p);
    expect(h, p).toBeGreaterThan(w);
  }
});

test('public/uploads is not deployed', async ({}, testInfo) => {
  desktopOnly(testInfo);
  const ignore = fs.readFileSync(path.join(ROOT, 'public', '.assetsignore'), 'utf8');
  expect(ignore).toMatch(/^\/?uploads\/?\**$/m);
});

test('the production build leaves out the Tweaks design panel', async ({}, testInfo) => {
  // It opened on a postMessage from any page that framed the site. Reads the last
  // `npm run build` (the gates build first).
  desktopOnly(testInfo);
  const assets = path.join(ROOT, 'dist', 'assets');
  expect(fs.existsSync(assets), 'run npm run build first').toBe(true);
  expect(fs.statSync(assets).mtimeMs, 'dist/ is older than src/App.jsx: run npm run build').toBeGreaterThan(fs.statSync(path.join(ROOT, 'src', 'App.jsx')).mtimeMs);
  const bundle = fs.readdirSync(assets).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(assets, f), 'utf8')).join('\n');
  expect(bundle.includes('__activate_edit_mode'), 'the production bundle includes the Tweaks panel listener').toBe(false);
});
