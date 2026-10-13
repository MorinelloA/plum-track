// Runs the shared layout probe (tests/layout/probe.js) in a page and returns its report.
// probe.js is a copy of the UI audit harness's probe; keep the two identical.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROBE = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'probe.js'), 'utf8');

// Waits for fonts and for transitions to finish (the reduced-motion rule turns every style
// change into a short transition), then measures.
export async function runProbe(page, options = {}) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.getAnimations()
    .every(a => a.playState !== 'running' || (a.effect && a.effect.getTiming().iterations === Infinity)));
  await page.evaluate(PROBE);
  return page.evaluate(opts => window.__plumProbe(opts), options);
}

// Loads the probe without running it, for window.__plumFocusCheck().
export async function loadProbe(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(PROBE);
}

// Waits until no (finite) transition or animation is running.
export function settled(page) {
  return page.waitForFunction(() => document.getAnimations()
    .every(a => a.playState !== 'running' || (a.effect && a.effect.getTiming().iterations === Infinity)));
}

// The issues of the given kinds, as short readable lines for a failure message.
export function issuesOf(report, kinds) {
  return report.issues
    .filter(i => kinds.includes(i.kind))
    .map(i => `${i.kind}: ${i.selector} "${(i.text || '').slice(0, 30)}"${i.ratio ? ` ${i.fg} on ${i.bg} = ${i.ratio}` : ''}`);
}
