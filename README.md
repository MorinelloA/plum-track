# Plum Mustangs Track & Field

Source for plummustangs.net: a React single-page app built with Vite.

## Run locally

```
npm install
npm run dev
```

The dev server runs at `http://localhost:3000/`.

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
