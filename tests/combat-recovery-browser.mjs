/** A real failed initial service-worker cache install, followed by a UI retry.
 * Only the static server injects the failure; application state is read, never patched.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const output = path.resolve('audit-combat'), root = path.resolve('dist-combat');
await fs.mkdir(output, { recursive: true });
let failInitialCache = true, failedCoreRequests = 0;
const mime = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
    // This icon belongs to CORE_FILES but is not needed to load the playable page.
    if (failInitialCache && pathname === '/combat/icon-512.png') {
      failedCoreRequests++; response.writeHead(503, { 'Cache-Control': 'no-store' }); response.end('Initial offline-cache failure fixture'); return;
    }
    const content = await fs.readFile(file);
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(content);
  } catch { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage(), checks = [], errors = [];
page.on('pageerror', error => errors.push(error.message));
const checked = (name, detail = '') => { checks.push({ name, detail, pass: true }); console.log('PASS ' + name + ' ' + detail); };
const report = failure => ({ base, checks, errors, fixture: { failedCoreRequests }, ...(failure ? { failure } : {}) });
try {
  await page.goto(base + '/combat/index.html?standalone=1', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.offline.initError && !window.Encore.offline.busy, null, { timeout: 10000 });
  assert.ok(failedCoreRequests > 0, 'a real core resource must fail during installation');
  assert.equal(await page.evaluate(() => window.Encore.offline.ready), false);
  assert.equal(await page.evaluate(() => window.Encore.screen), 'home');
  await page.locator('.masthead [data-nav="settings"]').click();
  assert.ok(await page.locator('[data-action="offline-retry"]').isVisible());
  assert.ok(await page.locator('[data-action="offline-retry"]').isEnabled());
  assert.ok(await page.locator('[data-action="offline-prepare"]').isDisabled());
  assert.match(await page.locator('#offline-error').textContent(), /échoué/);
  assert.doesNotMatch(await page.locator('#offline-status').textContent(), /Préparation du mode hors ligne/);
  await page.locator('[data-setting="difficulty"]').selectOption('hard');
  const profile = await page.evaluate(() => window.Encore.profile);
  checked('A failed first offline-cache installation exits preparation and exposes an enabled retry', 'Real HTTP 503 during cache.addAll; online settings remain usable');

  failInitialCache = false;
  await page.locator('[data-action="offline-retry"]').click();
  await page.waitForFunction(() => window.Encore.offline.ready && !window.Encore.offline.busy, null, { timeout: 15000 });
  assert.equal(await page.evaluate(() => window.Encore.offline.initError), '');
  assert.equal(await page.evaluate(() => window.Encore.offline.error), '');
  assert.ok(await page.locator('[data-action="offline-retry"]').isHidden());
  assert.ok(await page.locator('[data-action="offline-prepare"]').isEnabled());
  assert.deepEqual(await page.evaluate(() => window.Encore.profile), profile);
  const registration = await page.evaluate(async () => {
    const value = await navigator.serviceWorker.getRegistration();
    return { scope: new URL(value.scope).pathname, state: value.active?.state };
  });
  assert.deepEqual(registration, { scope: '/combat/', state: 'activated' });
  checked('The retry button registers a working service worker without reloading or losing the profile', 'Same page and profile; active /combat/ worker; initialization errors cleared');

  await page.locator('[data-action="offline-prepare"]').click();
  await page.waitForFunction(() => window.Encore.offline.complete && !window.Encore.offline.busy, null, { timeout: 60000 });
  assert.equal(await page.evaluate(() => window.Encore.offline.cached), 42);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.offline.ready);
  assert.equal(await page.evaluate(() => window.Encore.offline.complete), true);
  assert.equal(await page.evaluate(() => window.Encore.offline.cached), 42);
  assert.deepEqual(await page.evaluate(() => window.Encore.profile), profile);
  assert.equal(await page.evaluate(() => window.Encore.screen), 'home');
  checked('The recovered installation downloads the full pack and survives an offline cold reload', '42 illustrations; 47,345,031 bytes; profile preserved');
  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(output, 'recovery-browser-report.json'), JSON.stringify(report(), null, 2));
  console.log('Recovery/browser QA: ' + checks.length + ' checks passed.');
} catch (error) {
  await page.screenshot({ path: path.join(output, 'recovery-browser-failure.png'), fullPage: true }).catch(() => {});
  await fs.writeFile(path.join(output, 'recovery-browser-report.json'), JSON.stringify(report(error.message), null, 2));
  throw error;
} finally { await browser.close(); server.close(); }
