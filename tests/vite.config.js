// The site's Vite config with a cache of its own for the test server. Two dev servers
// sharing node_modules/.vite (the tests' and one you have running) re-bundle React into the
// same folder, and pages stall waiting for files the other server just replaced.
import site from '../vite.config.js';

export default { ...site, cacheDir: 'node_modules/.vite-tests' };
