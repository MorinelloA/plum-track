import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from './support.js';

// Source rules that stand in for lint rules. Each one was added in the commit that removed
// its last offender, so it guards the cleanup from creeping back.
// Files are read from APP_ROOT (default: this checkout).
const ROOT = process.env.APP_ROOT || process.cwd();
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const walk = d => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })
  .flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const sourceCheck = testInfo => test.skip(testInfo.project.name !== 'desktop', 'a source check: one project is enough');

// The Tweaks panel is a dev-only design tool with its own palette; it isn't site UI.
const pageFiles = () => walk('src').filter(f => /\.jsx$/.test(f) && !/TweaksPanel/.test(f));

test('colours come from tokens: no raw colour literals outside :root', async ({}, testInfo) => {
  sourceCheck(testInfo);
  const css = read('src/styles.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const afterRoot = css.slice(css.indexOf('}', css.indexOf(':root {')) + 1);
  // rgba(var(--white-rgb), 0.85) is a token tint, not a literal
  const literals = afterRoot.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\((?![^)]*var\()[^)]*\)/g) || [];
  expect(literals, 'raw colours in src/styles.css').toEqual([]);
  for (const f of pageFiles()) {
    const found = read(f).match(/["'`](#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?)\([^)]*\))["'`]/g) || [];
    expect(found, f).toEqual([]);
  }
});
