/* Only Encore documents are controlled. CainOS and its other apps stay outside this scope. */
import { OFFLINE_VERSION, ART_VERSION, CORE_FILES, ART_FILES, ART_BYTES } from './offline-manifest.mjs';

const prefix = 'cainos-encore-';
const coreName = prefix + 'core-' + OFFLINE_VERSION;
// A code-only update preserves the complete, unchanged illustration pack.
const artName = prefix + 'art-' + ART_VERSION;
const absolute = file => new URL(file, self.registration.scope).href;
const coreURLs = new Set(CORE_FILES.map(absolute));
const artURLs = new Set(ART_FILES.map(absolute));
let preparing = null;
const subscribers = new Set();

self.addEventListener('install', event => {
  // addAll is atomic: an incomplete new shell never replaces the current game.
  event.waitUntil(caches.open(coreName).then(cache => cache.addAll([...coreURLs])));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(prefix) && name !== coreName && name !== artName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  url.search = ''; url.hash = '';
  let key = url.href;
  if (request.mode === 'navigate' && key === self.registration.scope) key = absolute('index.html');
  const core = coreURLs.has(key), art = artURLs.has(key);
  if (!core && !art) return;
  event.respondWith((async () => {
    let cache;
    try {
      cache = await caches.open(core ? coreName : artName);
      const cached = await cache.match(key);
      if (cached) return cached;
    } catch { /* CacheStorage can become unavailable; the network still works. */ }
    const response = await fetch(request);
    if (cache && response.ok && response.type !== 'opaque') {
      // Quota failures must never hide an otherwise usable network response.
      try { await cache.put(key, response.clone()); } catch { /* Explicit pack download reports storage errors. */ }
    }
    return response;
  })());
});

async function status() {
  const cache = await caches.open(artName);
  const keys = new Set((await cache.keys()).map(request => request.url));
  const cached = [...artURLs].filter(url => keys.has(url)).length;
  return { version: OFFLINE_VERSION, cached, total: artURLs.size, bytes: ART_BYTES, complete: cached === artURLs.size };
}
async function prepare() {
  const cache = await caches.open(artName);
  const existing = new Set((await cache.keys()).map(request => request.url));
  const missing = [...artURLs].filter(url => !existing.has(url));
  let index = 0, done = artURLs.size - missing.length;
  const progress = () => {
    for (const port of subscribers) port.postMessage({ progress: true, cached: done, total: artURLs.size });
  };
  progress();
  // Bounded parallelism avoids loading all large sprite sheets into memory at once.
  const workers = await Promise.allSettled(Array.from({ length: Math.min(4, missing.length) }, async () => {
    while (index < missing.length) {
      const url = missing[index++];
      const response = await fetch(url, { cache: 'reload' });
      if (!response.ok || response.type === 'opaque') throw new Error('Une illustration n’a pas pu être téléchargée. Réessaie en ligne.');
      await cache.put(url, response);
      done++; progress();
    }
  }));
  const failed = workers.find(result => result.status === 'rejected');
  if (failed) throw failed.reason;
  return status();
}
self.addEventListener('message', event => {
  const port = event.ports[0];
  if (!port || !['STATUS','PREPARE','CLEAR_ART','ACTIVATE'].includes(event.data?.type)) return;
  event.waitUntil((async () => {
    try {
      let result;
      if (event.data.type === 'ACTIVATE') { await self.skipWaiting(); result = { activated: true }; }
      else if (event.data.type === 'PREPARE') {
        subscribers.add(port);
        preparing ||= prepare().finally(() => { preparing = null; });
        result = await preparing;
      } else if (event.data.type === 'CLEAR_ART') {
        if (preparing) throw new Error('Attends la fin du téléchargement avant de libérer les illustrations.');
        await caches.delete(artName); result = await status();
      } else result = await status();
      port.postMessage({ ok: true, result });
    } catch (error) { port.postMessage({ ok: false, error: error.message || 'Stockage hors ligne indisponible.' }); }
    finally { subscribers.delete(port); port.close(); }
  })());
});
