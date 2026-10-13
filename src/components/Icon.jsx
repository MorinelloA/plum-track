// === Icons ===
// The site's small icons as inline SVG, drawn to match the text glyphs they replace
// (☰ ✕ ▾ ‹ › ▶ → ← ↗ ★ ▢). Glyphs came from whatever font the device had, and iPhones
// could turn ▶ and ↗ into colour emoji; these look the same everywhere.
// Sized to the text (1em tall) and coloured by it (currentColor). Narrow shapes keep a
// narrow box, about the width of the glyph they replace, so text around them doesn't move.
// Decorative: a control that holds only an icon carries its own aria-label.
import React from 'react';

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 };

// name: [box width in a 16-unit-tall box, shape]
const SHAPES = {
  menu: [16, <path d="M2 4h12M2 8h12M2 12h12" {...STROKE} />],
  close: [16, <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" {...STROKE} />],
  caretDown: [10, <path d="M1 6h8l-4 5z" fill="currentColor" />],
  chevronLeft: [16, <path d="M10 3L5 8l5 5" {...STROKE} />],
  chevronRight: [16, <path d="M6 3l5 5-5 5" {...STROKE} />],
  play: [16, <path d="M3.5 2v12L14 8z" fill="currentColor" />],
  arrowRight: [12, <path d="M1 8h10M7.5 4.5L11 8 7.5 11.5" {...STROKE} />],
  arrowLeft: [12, <path d="M11 8H1M4.5 4.5L1 8l3.5 3.5" {...STROKE} />],
  external: [16, <path d="M4.5 11.5l7-7M6 4.5h5.5V10" {...STROKE} />],
  star: [16, <path d="M8 1.6l1.9 4.2 4.5.5-3.4 3.1 1 4.5L8 11.6l-4 2.3 1-4.5-3.4-3.1 4.5-.5z" fill="currentColor" />],
  photo: [16, <rect x="3" y="3" width="10" height="10" rx="1.5" {...STROKE} />],
};

export function Icon({ name, className }) {
  const [width, shape] = SHAPES[name];
  return (
    <svg className={"icon" + (className ? " " + className : "")} viewBox={`0 0 ${width} 16`}
      width={width / 16 + "em"} height="1em" aria-hidden="true" focusable="false">
      {shape}
    </svg>
  );
}
