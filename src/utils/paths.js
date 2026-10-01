export function rootAsset(path) {
  if (!path || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(path)) return path;
  return "/" + path.replace(/^\.?\//, "");
}

export function routeHref(path) {
  if (!path || path === "/") return "/";
  if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(path)) return path;
  return path.startsWith("/") ? path : "/" + path;
}
