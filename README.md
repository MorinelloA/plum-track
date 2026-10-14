# Plum Mustangs Track & Field

Source for plummustangs.net: a React single-page app built with Vite.

## Run locally

```
npm install
npm run dev
```

The dev server runs at `http://localhost:3000/`.

## Tests

```
npm run test:layout
```

This runs the Playwright tests in `tests/` against a dev server of their own on port 3110, as a 1280px desktop with a mouse and a 390px phone with a touch screen, and a few tests also as a tablet held sideways. They check the layout rules below and the fixes from the October 2026 UI audit. No test reaches a real outside service: Formspree, Zeffy and YouTube are answered locally, Google Fonts come from a cache in `node_modules/.cache` (filled the first time), and everything else is blocked.

- **Another copy of the site.** `BASE_URL=http://127.0.0.1:3101 npm run test:layout` runs the tests against a server that's already running, without starting one. Add `APP_ROOT=<folder>` for the tests that read source files.
- **Retries.** Each test gets one retry, and a test that only passes on retry is reported as flaky. Security software that scans web traffic can hold local responses for seconds at a time; the retry absorbs that.
- **The probe.** `tests/layout/probe.js` measures the page: overflow, clipped controls, cut-off text, tap-target sizes, contrast, field alignment and more. It's shared with the audit's capture harness, so keep the two copies identical.

## Layout and brand rules

The site follows its own small design kit, written down in the October 2026 UI audit. When rules conflict, accessibility (WCAG 2.2 AA) wins, then this kit. The PBSD brand guide is a reference, not a rulebook.

- **Colours.** Every colour is a token in `:root` at the top of `src/styles.css`; nothing else in the stylesheet or the pages uses a raw colour value (a test checks). Gold text on a light surface uses `--gold-ink`, and small gold text on plum uses `--gold-on-plum`; plain `--gold` and `--gold-deep` are too light for text there. The browser toolbar colour (`theme-color` in `index.html`) is `--ink`, like the band at the top of every page.
- **Type.** Anton for display text, with one weight that the browser thickens for headings (that heavier look is intended); Barlow 400, 600, 700 and italic for body text; IBM Plex Mono 400, 600 and 700 for labels and marks. Sizes up to 36px come from the scale 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32 and 36px, and nothing is under 10px. Tests check both.
- **Layout.** One fluid column up to 1280px. At 1024px and below the site switches to its phone layout: the menu button, tables as cards, and 44px controls. A tablet held sideways gets the desktop layout.
- **Touch.** Every control can be hit over at least 44px with a touch screen and 24px with a mouse. Small controls get an invisible hit area (`--hit-min`; "Touch targets" in `styles.css`) instead of a bigger look. Where neighbours sit too close for that, a touch screen draws the control 44px tall.
- **Focus.** A 3px ring, plum on light surfaces and gold on dark ones (`--focus-ring`). Never remove it with `outline: none`.
- **Icons.** `src/components/Icon.jsx` draws them as SVG in the text's colour. Don't use text glyphs such as ▶, ✕ or → as icons: they come from whatever font the device has, and iPhones turn some into emoji.
- **Fields.** 44px tall, with `--field-edge` borders and `--ink` text. Text is 16px on touch screens, because iPhones and iPads zoom into smaller fields.
- **Pieces.** Sibling buttons share one box (border, padding, height); only the fill sets the primary apart. The Boys/Girls and Men's/Women's toggles share one rule set. Every dialog close button is 44px with an 18px icon.
- **Dialogs.** Build a new dialog on `useModalDialog` (`src/utils/useModalDialog.js`). It traps focus, closes on Escape, locks the page's scroll, returns focus to the button that opened it, and gives the dialog a history entry so the Back button closes it instead of leaving the page.
- **Grids.** Tile and card grids keep a partial last row, so every tile stays one size; a lone section tab or record card spans its row.
- **Names.** Long names wrap between words (`overflow-wrap: break-word`). Only emails and social handles use `anywhere`.

## Hosting

Cloudflare hosts the site as a Worker named `plum-track`, configured in `wrangler.jsonc`, at plummustangs.net and www.plummustangs.net. To build and publish, run this from the repo root. Wrangler asks you to log in to Cloudflare the first time.

```
npm run deploy
```

Wrangler uploads only files that changed since the last deploy, so a code-only update finishes in seconds even though the photos and videos come to several hundred megabytes.

- **Routing.** Clean paths like `/records/boys-outdoor` fall back to `index.html` through `not_found_handling` in `wrangler.jsonc`. `public/web.config` did this on the old IIS server, and `public/.assetsignore` keeps it out of the upload.
- **Videos.** Cloudflare's static file server ignores byte-range requests, and Safari won't play a video without them. So `worker.js` runs first for `/videos/*` and answers them with `206 Partial Content`. Those runs count toward the Cloudflare account's free 100,000 Worker requests a day, which off-ramp and tonyt908 also draw on.
- **File size limit.** Cloudflare rejects any single file over 25 MiB, and a deploy containing one fails. Re-encode a new video before adding it under `public/videos/`. Full-size originals of re-encoded videos are kept in `media-originals/`, which is git-ignored and never deployed.

  This is how the clips under `public/videos/records/` were re-encoded. Set `-maxrate` to about `184500 ÷ seconds − 128` (in kbps) so the file lands near 22 MiB, capped at 8000 for short clips:

  ```
  ffmpeg -i original.mp4 -c:v libx264 -preset slow -crf 21 -maxrate 6000k -bufsize 12000k -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/videos/records/name.mp4
  ```

  iPhone HDR footage (10-bit HLG, which `ffprobe` reports as `yuv420p10le` and `arib-std-b67`) also needs tone mapping to ordinary 8-bit color, or most browsers won't play it. The boys 4x400 was done with this filter, at 720p and a two-pass `-b:v 780k` because of its length:

  ```
  -vf "fps=30,scale=-2:720,zscale=tin=arib-std-b67:min=bt2020nc:pin=bt2020:rin=tv:t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"
  ```
- **www.** www.plummustangs.net is sent to plummustangs.net by a Redirect Rule on the Cloudflare zone, not by the Worker.

To preview through Cloudflare's runtime, run `npx vite build`, then `npx wrangler dev`, and open `http://127.0.0.1:8787/`.
