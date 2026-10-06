// Answers byte-range requests for the videos in /videos/. Cloudflare serves the
// rest of dist/ without running this script: wrangler.jsonc runs it first only
// for /videos/*.
//
// Cloudflare's static file server ignores Range and always sends the whole file
// with a 200. Safari, and every browser on iOS, asks for bytes=0-1 first and won't
// play a video unless that comes back as 206 Partial Content. Each file is under
// Cloudflare's 25 MiB asset limit, so buffering one here is safe.
export default {
  async fetch(request, env) {
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range")?.trim() ?? "");
    if (request.method !== "GET" || !range) return acceptRanges(await env.ASSETS.fetch(request));

    // Fetch the whole file with a plain GET, free of the Range and conditional headers.
    const asset = await env.ASSETS.fetch(request.url);
    const ifRange = request.headers.get("If-Range");
    if (asset.status !== 200 || (ifRange && ifRange !== asset.headers.get("ETag"))) return acceptRanges(asset);

    const body = await asset.arrayBuffer();
    const size = body.byteLength;
    const [, first, last] = range;
    let start, end;
    if (first === "") {  // suffix range: the final N bytes
      start = Math.max(0, size - Number(last || 0));
      end = size - 1;
    } else {
      start = Number(first);
      end = Math.min(last ? Number(last) : size - 1, size - 1);
    }
    const headers = new Headers(asset.headers);
    headers.set("Accept-Ranges", "bytes");
    if (start >= size || start > end) {
      headers.set("Content-Range", `bytes */${size}`);
      headers.delete("Content-Length");
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(new Uint8Array(body, start, end - start + 1), { status: 206, headers });
  },
};

// Tells the browser it may ask for part of the file.
function acceptRanges(response) {
  if (response.status !== 200) return response;
  const out = new Response(response.body, response);
  out.headers.set("Accept-Ranges", "bytes");
  return out;
}
