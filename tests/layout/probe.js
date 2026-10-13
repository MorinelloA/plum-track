/* Plum Track layout probe: in-page layout, touch, text and colour measures.
 *
 * Load it into a page (page.addScriptTag({ path }) or page.evaluate(source)); it defines
 *   window.__plumProbe(options)  -> { issues, counts, stats, ... }
 *   window.__plumFocusCheck()    -> focus-ring facts for document.activeElement
 *
 * Visible elements only. When a modal dialog is open, only what's inside it is measured.
 * The harness copy (../Plum-Track-ui-audit/harness/probe.js) and the repo copy
 * (tests/layout/probe.js) must stay identical.
 */
(function () {
  if (window.__plumProbe) return;

  // Glyphs used as icons: ‹ › and the arrows, technical symbols, geometric shapes,
  // miscellaneous symbols, dingbats, and miscellaneous symbols and arrows blocks.
  const ICON_CLASS = '\u{2039}\u{203A}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}';
  const ICON_RE = new RegExp('[' + ICON_CLASS + ']', 'gu');
  const ICON_ONLY_RE = new RegExp('^[\\s' + ICON_CLASS + ']+$', 'u');
  const CONTROL_SEL = [
    'a[href]', 'button', 'input:not([type="hidden"])', 'select', 'textarea', 'summary',
    '[role="button"]', '[role="link"]', '[role="tab"]', '[role="checkbox"]', '[role="radio"]',
    '[role="switch"]', '[role="menuitem"]', 'video[controls]', '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  const FIELD_SEL = 'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="range"]):not([type="color"]):not([type="file"]),select,textarea';
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'HEAD', 'META', 'LINK', 'TITLE', 'BR', 'WBR']);
  const CAP = 150;

  function run(opts) {
    opts = opts || {};
    const t0 = performance.now();
    const styleCache = new Map();
    const cs = el => { let s = styleCache.get(el); if (!s) { s = getComputedStyle(el); styleCache.set(el, s); } return s; };
    const issues = [];
    const counts = {};
    const stats = { elements: 0, textElements: 0, controls: 0, words: 0, wordsCapped: false };

    const docEl = document.documentElement;
    const docW = docEl.clientWidth;
    const vw = window.innerWidth, vh = window.innerHeight;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const touchMin = coarse ? (opts.touchCoarse || 44) : (opts.touchFine || 24);

    // ---------- helpers ----------
    function sel(el) {
      const parts = [];
      for (let n = el, i = 0; n && n.nodeType === 1 && n !== document.body && i < 4; n = n.parentElement, i++) {
        let s = n.tagName.toLowerCase();
        if (n.id) { parts.unshift(s + '#' + n.id); break; }
        const cls = [...n.classList].slice(0, 2).join('.');
        if (cls) s += '.' + cls;
        const p = n.parentElement;
        if (p) {
          const same = [...p.children].filter(c => c.tagName === n.tagName);
          if (same.length > 1) s += ':nth-of-type(' + (same.indexOf(n) + 1) + ')';
        }
        parts.unshift(s);
      }
      return parts.join(' > ');
    }
    // Geometry key: the chain of classes (tag where there are none), without sibling positions,
    // so an inserted element or a div that becomes a nav doesn't rename everything after it.
    // The caller adds the element's text and its occurrence number to make it unique.
    function fullPath(el) {
      const parts = [];
      for (let n = el; n && n.nodeType === 1 && n !== document.body && n !== document.documentElement; n = n.parentElement) {
        parts.unshift(n.classList.length ? '.' + [...n.classList].filter(c => c !== 'active').join('.') : n.tagName.toLowerCase());
      }
      return parts.join('>');
    }
    const snippet = el => (el.innerText || el.textContent || el.value || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    const R = r => ({ x: Math.round(r.left * 10) / 10, y: Math.round(r.top * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 });
    function add(kind, el, detail, severity) {
      counts[kind] = (counts[kind] || 0) + 1;
      if (counts[kind] > CAP) return;
      issues.push({ kind, severity: severity || 'fail', selector: el ? sel(el) : null, text: el ? snippet(el) : null, rect: el ? R(el.getBoundingClientRect()) : null, ...(detail || {}) });
    }

    function parseColor(s) {
      if (!s) return null;
      if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
      const m = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/);
      if (!m) return null;
      const a = m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
      return { r: +m[1], g: +m[2], b: +m[3], a };
    }
    const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase() + (c.a < 1 ? '@' + Math.round(c.a * 100) / 100 : '');

    const vhCache = new Map();
    function visuallyHidden(el) {
      for (let n = el; n && n !== document.body && n !== docEl; n = n.parentElement) {
        let v = vhCache.get(n);
        if (v === undefined) {
          const s = cs(n);
          v = false;
          if (s.clip === 'rect(0px, 0px, 0px, 0px)' || /inset\(50%\)/.test(s.clipPath)) v = true;
          else if (s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowX === 'clip') {
            const r = n.getBoundingClientRect();
            if (r.width <= 1.5 && r.height <= 1.5) v = true;
          }
          vhCache.set(n, v);
        }
        if (v) return true;
      }
      return false;
    }
    const shownCache = new Map();
    function shown(el) {
      let v = shownCache.get(el);
      if (v !== undefined) return v;
      v = true;
      if (el.checkVisibility && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) v = false;
      else {
        const r = el.getBoundingClientRect();
        if (r.width < 0.5 || r.height < 0.5) v = false;
        else if (visuallyHidden(el)) v = false;
      }
      shownCache.set(el, v);
      return v;
    }
    const disabled = el => !!el.closest(':disabled, [aria-disabled="true"], fieldset[disabled]');

    const isClipX = s => s.overflowX === 'hidden' || s.overflowX === 'clip';
    const isClipY = s => s.overflowY === 'hidden' || s.overflowY === 'clip';
    const isScrollX = s => s.overflowX === 'auto' || s.overflowX === 'scroll';
    const isScrollY = s => s.overflowY === 'auto' || s.overflowY === 'scroll';
    function padBox(a) {
      const r = a.getBoundingClientRect();
      const l = r.left + a.clientLeft, t = r.top + a.clientTop;
      return { l, t, r: l + a.clientWidth, b: t + a.clientHeight };
    }
    const INF = { l: -Infinity, t: -Infinity, r: Infinity, b: Infinity };
    const meet = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
    // Visible region after clipping by ancestors whose overflow is hidden/clip. Scroll containers
    // don't clip (their content scrolls), and html/body are skipped: their overflow-x: hidden only
    // hides page overflow, which is measured on its own.
    function clipOf(el) {
      let rect = INF;
      const pos = cs(el).position;
      if (pos === 'fixed') return rect;
      let needPositioned = pos === 'absolute';
      for (let a = el.parentElement; a && a !== document.body && a !== docEl; a = a.parentElement) {
        const s = cs(a);
        if (needPositioned) {
          if (s.position === 'static' && s.transform === 'none') continue;
          needPositioned = false;
        }
        const cx = isClipX(s), cy = isClipY(s);
        if (cx || cy) {
          const p = padBox(a);
          rect = meet(rect, { l: cx ? p.l : -Infinity, r: cx ? p.r : Infinity, t: cy ? p.t : -Infinity, b: cy ? p.b : Infinity });
        }
        if (s.position === 'fixed') break;
        if (s.position === 'absolute') needPositioned = true;
      }
      return rect;
    }
    function inScrollerX(el) {
      for (let a = el.parentElement; a && a !== document.body && a !== docEl; a = a.parentElement) if (isScrollX(cs(a))) return true;
      return false;
    }
    function textNodes(el) {
      const out = [];
      for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) out.push(n);
      return out;
    }
    // Union of the text's line boxes. Vertically it uses each line's em box (font-size tall,
    // centred in the content area): a display face like Anton has a much taller ascent and
    // descent than its glyphs, which would otherwise read as "cut" under a tight line-height.
    function textBox(nodes, fontPx) {
      const range = document.createRange();
      let box = null;
      for (const n of nodes) {
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) {
          if (r.width <= 0 || r.height <= 0) continue;
          const inset = fontPx ? Math.max(0, (r.height - fontPx) / 2) : 0;
          const t = r.top + inset, b = r.bottom - inset;
          box = box ? { l: Math.min(box.l, r.left), t: Math.min(box.t, t), r: Math.max(box.r, r.right), b: Math.max(box.b, b) } : { l: r.left, t, r: r.right, b };
        }
      }
      return box;
    }

    // Background candidates behind an element: composites translucent layers, takes every stop
    // of a gradient, and flags images (which need checking by eye).
    function backgroundOf(el) {
      const layers = [];
      let base = null;
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const s = cs(n);
        const bi = s.backgroundImage;
        if (bi && bi !== 'none') {
          if (/url\(/.test(bi)) { base = { image: true }; break; }
          if (/gradient\(/.test(bi)) {
            const stops = (bi.match(/rgba?\([^)]*\)/g) || []).map(parseColor).filter(Boolean);
            if (stops.length) {
              if (stops.every(c => c.a >= 0.999)) { base = { stops }; break; }
              layers.push({ stops });
            }
          }
        }
        const c = parseColor(s.backgroundColor);
        if (c && c.a > 0) {
          if (c.a >= 0.999) { base = { stops: [c] }; break; }
          layers.push({ stops: [c] });
        }
      }
      if (!base) base = { stops: [{ r: 255, g: 255, b: 255, a: 1 }] };
      if (base.image) return { image: true };
      let cands = base.stops;
      for (let i = layers.length - 1; i >= 0; i--) {
        const next = [];
        for (const b of cands) for (const top of layers[i].stops) next.push(blend(top, b));
        cands = next.slice(0, 24);
      }
      return { colors: cands, gradient: base.stops.length > 1 || layers.some(l => l.stops.length > 1) };
    }
    function opacityOf(el) {
      let o = 1;
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(cs(n).opacity);
      return o;
    }

    // ---------- scope ----------
    const modals = [...document.querySelectorAll('[aria-modal="true"]')].filter(shown);
    const modal = modals.length ? (modals.find(m => m.contains(document.activeElement)) || modals[modals.length - 1]) : null;
    const scope = modal || document.body;
    const all = [scope, ...scope.querySelectorAll('*')].filter(el => !SKIP_TAGS.has(el.tagName) && !(el instanceof SVGElement && el.tagName.toLowerCase() !== 'svg'));
    const vis = all.filter(shown);
    stats.elements = vis.length;

    // ---------- token palette (from :root custom properties) ----------
    const palette = new Set();
    {
      const names = new Set();
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch (e) { continue; }
        for (const r of rules) {
          if (r.selectorText && /(^|,)\s*(:root|html)\s*(,|$)/.test(r.selectorText)) for (const p of r.style) if (p.startsWith('--')) names.add(p);
        }
      }
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;visibility:hidden;color:rgb(1, 2, 3)';
      const t = document.createElement('span');
      // A reduced-motion rule like `* { transition-duration: .01ms !important }` would otherwise
      // animate each colour change, and getComputedStyle would return the previous colour.
      for (const e of [host, t]) e.style.setProperty('transition', 'none', 'important');
      host.appendChild(t);
      document.body.appendChild(host);
      const rootStyle = getComputedStyle(docEl);
      for (const n of names) {
        // Channel tokens ("255, 255, 255") feed rgba(var(--x-rgb), a) tints.
        const ch = rootStyle.getPropertyValue(n).trim().match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);
        if (ch) { palette.add(ch[1] + ',' + ch[2] + ',' + ch[3]); continue; }
        t.style.color = 'var(' + n + ')';
        const c = parseColor(getComputedStyle(t).color);
        if (c && !(c.r === 1 && c.g === 2 && c.b === 3)) palette.add(c.r + ',' + c.g + ',' + c.b);
      }
      host.remove();
    }

    // ---------- fonts ----------
    const faces = [];
    document.fonts.forEach(f => { if (f.status !== 'error') faces.push({ family: f.family.replace(/^['"]|['"]$/g, ''), weight: String(f.weight), style: f.style }); });
    const wRange = w => { const p = w.split(/\s+/).map(Number); return [p[0], p.length > 1 ? p[1] : p[0]]; };
    function fauxKinds(s) {
      const fam = s.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      const famFaces = faces.filter(f => f.family === fam);
      if (!famFaces.length) return null;
      const synth = s.fontSynthesis || 'weight style';
      const w = parseInt(s.fontWeight, 10);
      const italic = s.fontStyle !== 'normal';
      const styleFaces = famFaces.filter(f => italic ? f.style !== 'normal' : f.style === 'normal');
      const kinds = [];
      if (italic && !styleFaces.length && /style/.test(synth)) kinds.push('faux-italic');
      const pool = styleFaces.length ? styleFaces : famFaces;
      const maxW = Math.max(...pool.map(f => wRange(f.weight)[1]));
      if (w >= 600 && maxW < 600 && /weight/.test(synth)) kinds.push('faux-bold');
      return { fam, w, italic, kinds };
    }

    // ---------- page overflow ----------
    if (!modal) {
      for (const el of vis) {
        if (el === document.body) continue;
        const r = el.getBoundingClientRect();
        if (r.right <= docW + 1 && r.left >= -1) continue;
        if (r.right <= 0) { add('offscreen-left', el, null, 'info'); continue; }
        if (inScrollerX(el)) continue;
        const c = clipOf(el);
        if (c.r <= docW + 1 && c.l >= -1) continue;   // clipped inside the page
        const p = el.parentElement;
        if (p && p !== document.body) {
          const pr = p.getBoundingClientRect();
          if ((pr.right > docW + 1 || pr.left < -1) && shown(p) && !inScrollerX(p)) {
            const pc = clipOf(p);
            if (!(pc.r <= docW + 1 && pc.l >= -1)) continue;   // the parent sticks out too: blame it
          }
        }
        add('page-overflow', el, { by: Math.round(Math.max(r.right - docW, -r.left)) });
      }
    }

    // ---------- text: cut, ellipsis, size, contrast, faux faces, glyph icons, broken words ----------
    const range = document.createRange();
    const wordCap = opts.wordCap || 40000;
    for (const el of vis) {
      const nodes = textNodes(el);
      if (!nodes.length) continue;
      stats.textElements++;
      const s = cs(el);
      const text = nodes.map(n => n.textContent).join(' ').replace(/\s+/g, ' ').trim();

      // cut off / ellipsis
      const ell = s.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1;
      if (ell) {
        const holder = el.closest('[title],[aria-label]');
        const full = holder && ((holder.getAttribute('title') || '') + ' ' + (holder.getAttribute('aria-label') || '')).includes(text.replace(/…$/, ''));
        add(full ? 'text-ellipsis-full-text' : 'text-ellipsis', el, null, full ? 'info' : 'fail');
      } else {
        const box = textBox(nodes, parseFloat(s.fontSize));
        if (box) {
          let region = clipOf(el);
          if (isClipX(s) || isClipY(s)) {
            const p = padBox(el);
            region = meet(region, { l: isClipX(s) ? p.l : -Infinity, r: isClipX(s) ? p.r : Infinity, t: isClipY(s) ? p.t : -Infinity, b: isClipY(s) ? p.b : Infinity });
          }
          const cut = Math.max(box.r - region.r, region.l - box.l, box.b - region.b, region.t - box.t);
          if (cut > 1.5) add('text-cut', el, { by: Math.round(cut) });
        }
      }
      if (s.webkitLineClamp && s.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1) add('text-clamped', el);

      // size
      const fs = parseFloat(s.fontSize);
      if (fs < 9.99) add('text-under-10', el, { px: fs });

      // contrast (text hidden from assistive tech and outside any control is decoration,
      // which WCAG 1.4.3 exempts: reported as info)
      const decor = !!el.closest('[aria-hidden="true"]') && !el.closest(CONTROL_SEL);
      if (decor) add('decorative-text', el, null, 'info');
      else if (!disabled(el)) {
        // Text painted by its own background (background-clip: text): the gradient is the ink,
        // and what's behind is the parent's background.
        const clipText = s.backgroundClip === 'text' || s.webkitBackgroundClip === 'text';
        const inks = clipText ? (s.backgroundImage.match(/rgba?\([^)]*\)/g) || []).map(parseColor).filter(Boolean) : null;
        const fg = clipText ? (inks.length ? inks[0] : null) : parseColor(s.color);
        if (fg) {
          const op = opacityOf(el);
          const bgInfo = clipText ? (el.parentElement ? backgroundOf(el.parentElement) : { colors: [{ r: 255, g: 255, b: 255, a: 1 }] }) : backgroundOf(el);
          if (bgInfo.image) add('text-on-image', el, null, 'info');
          else {
            const w = parseInt(s.fontWeight, 10);
            const large = fs >= 24 || (fs >= 18.66 && w >= 700);
            // A glyph standing in for an icon is non-text content: 3:1 (WCAG 1.4.11).
            const iconOnly = ICON_ONLY_RE.test(text);
            const need = large || iconOnly ? 3 : 4.5;
            let worst = Infinity, worstBg = null;
            for (const bg of bgInfo.colors) {
              for (const ink of inks && inks.length ? inks : [fg]) {
                const f = blend({ ...ink, a: ink.a * op }, bg);
                const q = ratio(f, bg);
                if (q < worst) { worst = q; worstBg = bg; }
              }
            }
            if (worst < need - 0.005) {
              add(bgInfo.gradient ? 'contrast-on-gradient' : 'contrast-text', el, { ratio: Math.round(worst * 100) / 100, need, fg: hex({ ...fg, a: fg.a * op }), bg: hex(worstBg), px: fs, large });
            }
          }
        }
      }

      // synthesised faces
      const fx = fauxKinds(s);
      if (fx) for (const k of fx.kinds) add(k, el, { family: fx.fam, weight: fx.w, italic: fx.italic });

      // glyphs used as icons
      const glyphs = text.match(ICON_RE);
      if (glyphs) add('glyph-icon', el, { chars: [...new Set(glyphs)].join(' '), ariaHidden: !!el.closest('[aria-hidden="true"]') });

      // words broken across lines
      if (stats.words < wordCap) {
        for (const n of nodes) {
          const str = n.textContent;
          const re = /\S+/g;
          let m;
          while ((m = re.exec(str))) {
            if (++stats.words > wordCap) { stats.wordsCapped = true; break; }
            if (m[0].length < 3) continue;
            range.setStart(n, m.index);
            range.setEnd(n, m.index + m[0].length);
            const rects = [...range.getClientRects()].filter(r => r.width > 0);
            if (rects.length < 2 || Math.abs(rects[rects.length - 1].top - rects[0].top) < 2) continue;
            const w = m[0];
            if (/@|:\/\/|www\.|\.(com|net|org|edu)\b/i.test(w)) add('word-broken-url', el, { word: w }, 'info');
            else if (/[-‐‑–—/]/.test(w)) add('word-wrap-at-hyphen', el, { word: w }, 'info');
            else add('word-broken', el, { word: w });
          }
        }
      }
    }

    // pseudo-element text that carries meaning ([data-label]::before on the card tables)
    for (const el of vis) {
      if (!el.hasAttribute || !el.hasAttribute('data-label')) continue;
      const ps = getComputedStyle(el, '::before');
      if (!ps.content || ps.content === 'none' || ps.content === 'normal' || ps.content === '""') continue;
      if (ps.display === 'none') continue;
      const fs = parseFloat(ps.fontSize);
      if (fs < 9.99) add('text-under-10', el, { px: fs, pseudo: '::before' });
      const fg = parseColor(ps.color);
      const bgInfo = backgroundOf(el);
      if (fg && !bgInfo.image) {
        const large = fs >= 24 || (fs >= 18.66 && parseInt(ps.fontWeight, 10) >= 700);
        const need = large ? 3 : 4.5;
        const worst = Math.min(...bgInfo.colors.map(bg => ratio(blend(fg, bg), bg)));
        if (worst < need - 0.005) add('contrast-text', el, { ratio: Math.round(worst * 100) / 100, need, fg: hex(fg), pseudo: '::before', px: fs });
      }
    }

    // ---------- fields ----------
    const canvas = document.createElement('canvas').getContext('2d');
    const fields = [...scope.querySelectorAll(FIELD_SEL)].filter(shown);
    for (const f of fields) {
      const s = cs(f);
      const fs = parseFloat(s.fontSize);
      if (coarse && fs < 15.99) add('input-under-16-coarse', f, { px: fs });
      if (!coarse && fs < (opts.fieldMin || 14) - 0.01) add('field-text-below-kit', f, { px: fs });
      if (f.tagName !== 'TEXTAREA') {
        canvas.font = s.fontStyle + ' ' + s.fontWeight + ' ' + s.fontSize + ' ' + s.fontFamily;
        const text = f.tagName === 'SELECT' ? (f.selectedOptions[0] ? f.selectedOptions[0].text : '') : (f.value || f.placeholder || '');
        const ls = parseFloat(s.letterSpacing) || 0;
        const tw = canvas.measureText(text).width + ls * text.length;
        const avail = f.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) - (f.tagName === 'SELECT' ? 20 : 0);
        if (text && tw > avail + 1) add('input-truncates', f, { text: text.slice(0, 60), need: Math.round(tw), avail: Math.round(avail) });
      }
      if (f.placeholder && !f.value) {
        const ph = parseColor(getComputedStyle(f, '::placeholder').color);
        const bg = backgroundOf(f);
        if (ph && !bg.image) {
          const worst = Math.min(...bg.colors.map(b => ratio(blend(ph, b), b)));
          if (worst < 4.495) add('contrast-placeholder', f, { ratio: Math.round(worst * 100) / 100, fg: hex(ph) });
        }
      }
      // the field's edge against what's around it (WCAG 1.4.11): border or fill, whichever shows more
      const outer = f.parentElement ? backgroundOf(f.parentElement) : null;
      const own = parseColor(s.backgroundColor);
      const bw = parseFloat(s.borderTopWidth) + parseFloat(s.borderBottomWidth) + parseFloat(s.borderLeftWidth) + parseFloat(s.borderRightWidth);
      const border = parseColor(s.borderTopColor);
      if (outer && !outer.image) {
        let best = 1;
        for (const bg of outer.colors) {
          if (bw > 0 && border && border.a > 0) best = Math.max(best, ratio(blend(border, bg), bg));
          if (own && own.a > 0) best = Math.max(best, ratio(blend(own, bg), bg));
        }
        if (best < 2.995) add('contrast-field-edge', f, { ratio: Math.round(best * 100) / 100, border: border ? hex(border) : null });
      }
    }
    // rows of fields inside each form
    const forms = new Set(fields.map(f => f.closest('form, .contact-form, [role="form"]')).filter(Boolean));
    for (const form of forms) {
      const fs = fields.filter(f => form.contains(f)).map(f => ({ f, r: f.getBoundingClientRect() }));
      if (fs.length < 2) continue;
      const rows = [];
      for (const x of fs.sort((a, b) => a.r.top - b.r.top)) {
        const row = rows.find(rw => Math.abs(rw[0].r.top - x.r.top) <= 3);
        if (row) row.push(x); else rows.push([x]);
      }
      for (const row of rows) {
        if (row.length > 2) add('field-row-crowded', row[0].f, { n: row.length });
        if (row.length === 2 && Math.abs(row[0].r.width - row[1].r.width) > 2) add('field-pair-unequal', row[0].f, { widths: row.map(x => Math.round(x.r.width)) });
        const tops = row.map(x => x.r.top);
        if (Math.max(...tops) - Math.min(...tops) > 1) add('field-tops-misaligned', row[0].f);
      }
      const single = fs.filter(x => x.f.tagName !== 'TEXTAREA').map(x => x.r.height);
      if (single.length > 1 && Math.max(...single) - Math.min(...single) > 1) add('field-heights-differ', form, { heights: single.map(h => Math.round(h)) });
      const stacked = rows.filter(r => r.length === 1).map(r => r[0].r);
      if (stacked.length > 1) {
        const ls = stacked.map(r => r.left), rs = stacked.map(r => r.right);
        if (Math.max(...ls) - Math.min(...ls) > 1 || Math.max(...rs) - Math.min(...rs) > 1) add('field-edge-drift', form, { lefts: ls.map(Math.round), rights: rs.map(Math.round) });
      }
    }

    // ---------- tables and grids ----------
    for (const el of vis) {
      if (el.tagName === 'TABLE') {
        const p = el.parentElement;
        if (p && !isScrollX(cs(p)) && el.getBoundingClientRect().width > p.clientWidth + 1) add('table-overflow', el, { table: Math.round(el.getBoundingClientRect().width), card: p.clientWidth });
      }
      const s = cs(el);
      if (s.display !== 'grid' && s.display !== 'inline-grid') continue;
      const tracks = s.gridTemplateColumns.split(/\s+/).map(parseFloat).filter(v => !isNaN(v));
      if (tracks.length < 2) continue;
      const kids = [...el.children].filter(shown).map(c => c.getBoundingClientRect());
      if (!kids.length) continue;
      const r = el.getBoundingClientRect();
      let x = r.left + el.clientLeft + parseFloat(s.paddingLeft);
      const gap = parseFloat(s.columnGap) || 0;
      const empty = [];
      tracks.forEach((w, i) => {
        if (w > 0.5 && !kids.some(k => k.left < x + w - 1 && k.right > x + 1)) empty.push(i + 1);
        x += w + gap;
      });
      if (empty.length) {
        // One of many repeated rows (a list styled as a table): the empty track is a missing
        // value in that row, not an empty layout column.
        const first = el.classList[0];
        const twins = first && el.parentElement ? [...el.parentElement.children].filter(x => x.classList[0] === first).length : 0;
        if (twins >= 3) add('grid-empty-cell-in-row', el, { tracks: tracks.length, empty }, 'info');
        else add('grid-empty-column', el, { tracks: tracks.length, empty });
      }
    }

    // ---------- floating pieces and the tablet column ----------
    for (const el of vis) {
      if (cs(el).position !== 'fixed') continue;
      const r = el.getBoundingClientRect();
      if (r.left < -1 || r.top < -1 || r.right > docW + 1 || r.bottom > vh + 1) {
        if (r.width >= docW - 1 && r.height >= vh - 1) continue;   // full-screen overlays
        add('floating-outside', el, null);
      }
    }
    if (opts.tablet && !modal) {
      const gutter = docW <= 1024 ? 16 : 28;
      for (const p of document.querySelectorAll('.page')) {
        if (!shown(p)) continue;
        const r = p.getBoundingClientRect();
        const s = cs(p);
        const l = r.left + parseFloat(s.paddingLeft), rr = r.right - parseFloat(s.paddingRight);
        if (l < gutter - 1 || docW - rr < gutter - 1) add('tablet-column', p, { left: Math.round(l), right: Math.round(docW - rr), gutter });
      }
    }

    // ---------- colours that aren't tokens ----------
    if (palette.size) {
      const props = [['color', null], ['backgroundColor', null], ['borderTopColor', 'borderTopWidth'], ['borderRightColor', 'borderRightWidth'], ['borderBottomColor', 'borderBottomWidth'], ['borderLeftColor', 'borderLeftWidth'], ['outlineColor', 'outlineWidth']];
      for (const el of vis) {
        if (/^(IMG|VIDEO|IFRAME|CANVAS|PICTURE|SOURCE)$/.test(el.tagName)) continue;
        const s = cs(el);
        const hasText = textNodes(el).length > 0;
        for (const [p, wprop] of props) {
          // `color` only shows where the element draws text itself (or a field's value).
          if (p === 'color' && !hasText && !el.matches(FIELD_SEL)) continue;
          if (wprop && (parseFloat(s[wprop]) === 0 || (p === 'outlineColor' ? s.outlineStyle === 'none' : s[wprop.replace('Width', 'Style')] === 'none'))) continue;
          const c = parseColor(s[p]);
          if (!c || c.a === 0) continue;
          const key = c.r + ',' + c.g + ',' + c.b;
          if (!palette.has(key)) add('colour-off-token', el, { prop: p, value: hex(c) });
        }
      }
    }

    // ---------- touch targets ----------
    const savedScroll = [window.scrollX, window.scrollY];
    const scrolled = [...scope.querySelectorAll('*')].filter(e => e.scrollTop || e.scrollLeft).map(e => [e, e.scrollTop, e.scrollLeft]);
    if (modal) scrolled.push([modal, modal.scrollTop, modal.scrollLeft]);
    function deepHit(x, y) {
      let t = document.elementFromPoint(x, y);
      while (t && t.shadowRoot) { const inner = t.shadowRoot.elementFromPoint(x, y); if (!inner || inner === t) break; t = inner; }
      return t;
    }
    function inlineInText(el) {
      if (!/^inline/.test(cs(el).display) || cs(el).display === 'inline-flex' || cs(el).display === 'inline-grid') return false;
      let block = el.parentElement;
      while (block && /^inline/.test(cs(block).display)) block = block.parentElement;
      if (!block) return false;
      const own = (el.textContent || '').trim();
      const rest = (block.textContent || '').replace(own, '').trim();
      return /[A-Za-z]{2,}/.test(rest) && block.tagName !== 'LI' && block.tagName !== 'TD' && block.tagName !== 'TH' && block.tagName !== 'NAV';
    }
    const controls = [];
    for (const el of scope.querySelectorAll(CONTROL_SEL)) {
      if (!shown(el) || disabled(el)) continue;
      if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) { controls.push(el.closest('label')); continue; }
      controls.push(el);
    }
    const ctlRects = controls.map(c => c.getBoundingClientRect());
    stats.controls = controls.length;
    // controls clipped by an ancestor (part of the control hidden, not all of it)
    controls.forEach((el, i) => {
      const r = ctlRects[i];
      const c = meet(clipOf(el), { l: r.left, t: r.top, r: r.right, b: r.bottom });
      const area = r.width * r.height;
      const seen = Math.max(0, c.r - c.l) * Math.max(0, c.b - c.t);
      if (area > 0 && seen > 0 && seen / area < 0.98) add('clipped-control', el, { shown: Math.round(seen / area * 100) + '%' });
    });
    const isChrome = n => { for (let a = n; a && a !== document.body; a = a.parentElement) { const p = cs(a).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };
    controls.forEach((el, idx) => {
      if (inlineInText(el)) return;
      const hits = (x, y) => { const t = deepHit(x, y); return !!t && (t === el || el.contains(t) || (t.tagName === 'LABEL' && t.control === el)); };
      let r = null, cx = 0, cy = 0, ok = false;
      for (const block of ['center', 'start', 'end']) {
        el.scrollIntoView({ block, inline: 'nearest' });
        const rects = el.getClientRects();
        r = rects.length ? rects[0] : el.getBoundingClientRect();
        cx = r.left + r.width / 2; cy = r.top + r.height / 2;
        if (cx < 0 || cy < 0 || cx > vw || cy > vh) continue;
        if (hits(cx, cy)) { ok = true; break; }
        const t = deepHit(cx, cy);
        if (!t || !isChrome(t)) break;   // covered by something other than fixed/sticky chrome
      }
      if (!ok) {
        if (cx < 0 || cy < 0 || cx > vw || cy > vh) { add('touch-untestable', el, null, 'info'); return; }
        const t = deepHit(cx, cy);
        add('touch-covered', el, { by: t ? sel(t) : null });
        return;
      }
      const half = Math.ceil(touchMin / 2) + 1;
      const ext = (dx, dy) => { let d = 0; for (let k = 1; k <= half; k++) { if (!hits(cx + dx * k, cy + dy * k)) break; d = k; } return d; };
      const w = ext(-1, 0) + ext(1, 0) + 1, h = ext(0, -1) + ext(0, 1) + 1;
      if (w >= touchMin - 1 && h >= touchMin - 1) return;
      const detail = { hitW: w, hitH: h, min: touchMin, drawnW: Math.round(r.width), drawnH: Math.round(r.height), pointer: coarse ? 'coarse' : 'fine' };
      if (!coarse) {
        // WCAG 2.5.8 spacing exception: a 24px circle on the target's centre touches no other target
        // and no other undersized target's circle.
        const b = ctlRects[idx];
        const c0 = { x: b.left + b.width / 2, y: b.top + b.height / 2 };
        const clear = ctlRects.every((o, j) => {
          if (j === idx || controls[j].contains(el) || el.contains(controls[j])) return true;
          const nx = Math.max(o.left, Math.min(c0.x, o.right)), ny = Math.max(o.top, Math.min(c0.y, o.bottom));
          if (Math.hypot(nx - c0.x, ny - c0.y) < 12) return false;
          const oc = { x: o.left + o.width / 2, y: o.top + o.height / 2 };
          return Math.hypot(oc.x - c0.x, oc.y - c0.y) >= 24 || (o.width >= 24 && o.height >= 24);
        });
        if (clear) { add('touch-ok-by-spacing', el, detail, 'info'); return; }
      }
      add('touch-small', el, detail);
    });
    for (const [e, t, l] of scrolled) { e.scrollTop = t; e.scrollLeft = l; }
    window.scrollTo(savedScroll[0], savedScroll[1]);

    // ---------- geometry for refactor diffs ----------
    let geometry;
    if (opts.geometry) {
      geometry = [];
      const sx = window.scrollX, sy = window.scrollY;
      const seen = new Map();
      for (const el of vis) {
        if (!textNodes(el).length && !el.matches(CONTROL_SEL)) continue;
        const r = el.getBoundingClientRect();
        const sig = fullPath(el) + '|' + snippet(el).slice(0, 30);
        const nth = (seen.get(sig) || 0) + 1;
        seen.set(sig, nth);
        geometry.push([sig + '#' + nth, Math.round((r.left + sx) * 10) / 10, Math.round((r.top + sy) * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]);
      }
    }

    // ---------- computed styles, for proving a CSS cleanup changes nothing ----------
    let styles;
    if (opts.styles) {
      const PROPS = ['display', 'position', 'float', 'width', 'height', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
        'borderTopStyle', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderRadius', 'fontFamily', 'fontSize', 'fontWeight',
        'fontStyle', 'letterSpacing', 'lineHeight', 'textTransform', 'textAlign', 'whiteSpace', 'color', 'backgroundColor', 'backgroundImage', 'opacity',
        'transform', 'visibility', 'overflowX', 'overflowY', 'gridTemplateColumns', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems',
        'columnGap', 'rowGap', 'zIndex', 'boxShadow', 'textDecorationLine', 'outlineStyle'];
      styles = {};
      const seen = new Map();
      for (const el of vis) {
        const sig = fullPath(el) + '|' + snippet(el).slice(0, 30);
        const nth = (seen.get(sig) || 0) + 1;
        seen.set(sig, nth);
        const s = cs(el);
        styles[sig + '#' + nth] = PROPS.map(p => s[p]);
      }
      styles.__props = PROPS;
    }

    return {
      url: location.pathname + location.search,
      docW, vw, vh, dpr: window.devicePixelRatio, coarse, touchMin,
      modal: modal ? sel(modal) : null,
      palette: [...palette],
      fonts: { anton: document.fonts.check('16px Anton'), barlow: document.fonts.check('16px Barlow'), plex: document.fonts.check('16px "IBM Plex Mono"') },
      counts, issues, stats: { ...stats, ms: Math.round(performance.now() - t0) },
      ...(geometry ? { geometry } : {}),
      ...(styles ? { styles } : {}),
    };
  }

  // Focus ring of document.activeElement against the background around it (WCAG 1.4.11 / 2.4.7).
  function focusCheck() {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    const parse = str => { const m = (str || '').match(/rgba?\([^)]*\)/); if (!m) return null; const p = m[0].match(/[\d.]+/g).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    let bg = null;
    for (let n = el.parentElement; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0.99) { bg = c; break; } }
    bg = bg || { r: 255, g: 255, b: 255, a: 1 };
    const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 1 ? parse(s.outlineColor) : null;
    const shadow = s.boxShadow !== 'none' ? parse(s.boxShadow) : null;
    const ring = outline || shadow;
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(), cls: el.className && String(el.className).slice(0, 60), text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40),
      rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
      visible: !!ring, kind: outline ? 'outline' : shadow ? 'box-shadow' : 'none',
      ratio: ring ? Math.round(ratio(ring, bg) * 100) / 100 : 0,
      ring: ring ? `rgb(${ring.r},${ring.g},${ring.b})` : null, bg: `rgb(${bg.r},${bg.g},${bg.b})`,
    };
  }

  window.__plumProbe = run;
  window.__plumFocusCheck = focusCheck;
})();
