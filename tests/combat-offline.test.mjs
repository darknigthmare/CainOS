import test from 'node:test';
import assert from 'node:assert/strict';
import { OfflineGame } from '../combat/offline.mjs';

// A controllable browser boundary exercises actual init/request cleanup and races.
async function withBrowser(options, run) {
  const names = ['navigator', 'window', 'MessageChannel', 'setTimeout', 'clearTimeout', 'location'];
  const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  class Events {
    listeners = new Map();
    addEventListener(type, handler) { if (!this.listeners.has(type)) this.listeners.set(type, new Set()); this.listeners.get(type).add(handler); }
    removeEventListener(type, handler) { this.listeners.get(type)?.delete(handler); }
    emit(type) { for (const handler of [...(this.listeners.get(type) || [])]) if (this.listeners.get(type).has(handler)) handler(); }
    count(type) { return this.listeners.get(type)?.size || 0; }
  }
  const status = { cached: 0, total: 42, bytes: 47345031, complete: false };
  class Worker extends Events {
    constructor(state = 'activated') { super(); this.state = state; this.messages = []; this.respond = port => port.postMessage({ ok: true, result: status }); }
    change(state) { this.state = state; this.emit('statechange'); }
    postMessage(message, [port]) { this.messages.push(message.type); this.respond(port, message); }
  }
  class Registration extends Events {
    constructor(active = null, installing = null) { super(); this.active = active; this.installing = installing; this.waiting = null; }
  }
  const channels = [], timers = new Map(); let nextTimer = 0, clock = 0;
  class Channel {
    constructor() {
      const makePort = () => ({ closed: false, onmessage: null, close() { this.closed = true; } });
      this.port1 = makePort(); this.port2 = makePort();
      this.port2.postMessage = data => queueMicrotask(() => { if (!this.port1.closed) this.port1.onmessage?.({ data }); });
      channels.push(this);
    }
  }
  const service = new Events();
  service.registration = new Registration(new Worker()); service.calls = [];
  service.controller = service.registration.active; service.reloads = 0;
  service.register = (url, registrationOptions) => {
    service.calls.push({ url, options: registrationOptions });
    return service.registerImpl ? service.registerImpl() : Promise.resolve(service.registration);
  };
  Object.defineProperty(service, 'ready', { get() { throw new Error('Global ready must not be awaited'); } });
  const window = new Events(); window.isSecureContext = !options.insecure;
  const values = {
    navigator: options.unsupported ? {} : { serviceWorker: service }, window,
    location: { reload() { service.reloads++; } },
    MessageChannel: Channel,
    setTimeout: (handler, delay) => { const id = ++nextTimer; timers.set(id, { handler, due: clock + delay }); return id; },
    clearTimeout: id => timers.delete(id),
  };
  for (const [name, value] of Object.entries(values)) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
  const tick = async milliseconds => {
    const target = clock + milliseconds;
    for (;;) {
      const next = [...timers].filter(([, timer]) => timer.due <= target).sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) break;
      clock = next[1].due; timers.delete(next[0]); next[1].handler(); await flush();
    }
    clock = target; await flush();
  };
  const released = () => {
    assert.equal(timers.size, 0, 'all operation timers are cleared');
    assert.ok(channels.every(channel => channel.port1.closed && channel.port2.closed), 'all message ports are closed');
  };
  try { await run({ service, Worker, Registration, channels, timers, status, flush, tick, released }); }
  finally { for (const [name, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; } }
}

test('unsupported or insecure contexts do not start offline initialization', async () => {
  for (const options of [{ unsupported: true }, { insecure: true }]) await withBrowser(options, async ({ service, released }) => {
    const game = new OfflineGame(); await game.init();
    assert.equal(game.getState().supported, false); assert.equal(game.getState().busy, false);
    assert.equal(game.getState().initError, ''); assert.equal(service.calls.length, 0); released();
  });
});

test('concurrent init calls share one attempt and use the active worker directly', async () => withBrowser({}, async ({ service, released }) => {
  const game = new OfflineGame(), first = game.init(), second = game.init();
  assert.equal(first, second); assert.equal(game.getState().busy, true);
  const result = await first;
  assert.equal(result.ready, true); assert.equal(result.busy, false); assert.equal(result.initError, '');
  assert.equal(service.calls.length, 1); assert.deepEqual(service.registration.active.messages, ['STATUS']);
  assert.deepEqual(service.calls[0].options, { scope: './', type: 'module', updateViaCache: 'none' });
  await game.init(); assert.equal(service.calls.length, 1);
  assert.equal(service.registration.count('updatefound'), 1); released();
}));

test('a first installation becomes ready only after its worker is activated', async () => withBrowser({}, async ({ service, Worker, Registration, flush, released }) => {
  const worker = new Worker('installing'), registration = new Registration(null, worker); service.registration = registration;
  const game = new OfflineGame(), attempt = game.init(); await flush();
  worker.change('installed'); await flush();
  assert.equal(game.getState().ready, false); assert.equal(game.getState().busy, true); assert.deepEqual(worker.messages, []);
  registration.installing = null; registration.active = worker; worker.change('activating'); await flush();
  assert.equal(game.getState().ready, false);
  worker.change('activated'); await attempt;
  assert.equal(game.getState().ready, true); assert.equal(game.getState().busy, false);
  assert.equal(worker.count('statechange'), 0); released();
}));

test('an abandoned first installation reports a retryable error and removes its listeners', async () => withBrowser({}, async ({ service, Worker, Registration, flush, released }) => {
  const worker = new Worker('installing'), registration = new Registration(null, worker); service.registration = registration;
  const game = new OfflineGame(), attempt = game.init(); await flush();
  registration.installing = null; worker.change('redundant'); await attempt;
  const failure = game.getState();
  assert.equal(failure.ready, false); assert.equal(failure.busy, false); assert.match(failure.initError, /échoué/);
  assert.equal(failure.error, failure.initError); assert.equal(worker.count('statechange'), 0); assert.equal(registration.count('updatefound'), 0); released();
  service.registration = new Registration(new Worker());
  const retry = game.init(); assert.equal(game.getState().initError, ''); assert.equal(game.getState().busy, true);
  await retry; assert.equal(game.getState().ready, true); assert.equal(game.getState().error, '');
  assert.equal(service.calls.length, 2); released();
}));

test('a registration with a redundant worker already present fails without waiting', async () => withBrowser({}, async ({ service, Worker, Registration, released }) => {
  service.registration = new Registration(null, new Worker('redundant'));
  const game = new OfflineGame(); await game.init();
  assert.equal(game.getState().busy, false); assert.match(game.getState().initError, /échoué/);
  assert.equal(service.registration.count('updatefound'), 0); released();
}));

test('an initially empty registration waits for updatefound and can activate normally', async () => withBrowser({}, async ({ service, Worker, Registration, flush, released }) => {
  const registration = new Registration(); service.registration = registration;
  const game = new OfflineGame(), attempt = game.init(); await flush();
  assert.equal(game.getState().busy, true); assert.equal(game.getState().initError, '');
  const worker = new Worker('installing'); registration.installing = worker; registration.emit('updatefound');
  registration.installing = null; registration.active = worker; worker.change('activated'); await attempt;
  assert.equal(game.getState().ready, true); assert.equal(worker.count('statechange'), 0); released();
}));

test('both synchronous registration denial and promise rejection can be retried', async () => {
  for (const synchronous of [true, false]) await withBrowser({}, async ({ service, released }) => {
    service.registerImpl = () => { const error = new Error('Registration denied'); if (synchronous) throw error; return Promise.reject(error); };
    const game = new OfflineGame(); await game.init();
    assert.equal(game.getState().initError, 'Registration denied'); assert.equal(game.getState().busy, false); released();
    service.registerImpl = null; await game.init();
    assert.equal(game.getState().ready, true); assert.equal(game.getState().initError, ''); released();
  });
});

test('a stalled installation times out and a late activation cannot change the failed state', async () => withBrowser({}, async ({ service, Worker, Registration, flush, tick, released }) => {
  const worker = new Worker('installing'), registration = new Registration(null, worker); service.registration = registration;
  const game = new OfflineGame(), attempt = game.init(); await flush(); await tick(20000); await attempt;
  const failure = game.getState(); assert.match(failure.initError, /trop de temps/); assert.equal(failure.busy, false);
  assert.equal(worker.count('statechange'), 0); assert.equal(registration.count('updatefound'), 0); released();
  registration.active = worker; registration.installing = null; worker.change('activated'); await flush();
  assert.deepEqual(game.getState(), failure);
  await game.init(); assert.equal(game.getState().ready, true); released();
}));

test('a late register result after timeout cannot overwrite a successful retry', async () => withBrowser({}, async ({ service, Worker, Registration, flush, tick, released }) => {
  let finishRegistration;
  service.registerImpl = () => new Promise(resolve => { finishRegistration = resolve; });
  const game = new OfflineGame(), attempt = game.init(); await flush(); await tick(20000); await attempt;
  assert.equal(game.getState().ready, false); assert.equal(game.getState().busy, false); released();
  service.registerImpl = null; await game.init(); const successful = game.registration;
  const stale = new Registration(new Worker()); finishRegistration(stale); await flush();
  assert.equal(game.registration, successful); assert.equal(stale.count('updatefound'), 0);
  assert.equal(game.getState().ready, true); assert.equal(service.calls.length, 2); released();
}));

test('the initialization deadline also closes a silent status message channel', async () => withBrowser({}, async ({ service, flush, tick, channels, released }) => {
  service.registration.active.respond = () => {};
  const game = new OfflineGame(), attempt = game.init(); await flush();
  assert.equal(channels.length, 1); await tick(20000); await attempt;
  assert.equal(game.getState().ready, false); assert.equal(game.getState().busy, false);
  assert.match(game.getState().initError, /trop de temps/); assert.equal(service.registration.count('updatefound'), 0); released();
}));

test('status failures close ports and clear busy before an explicit retry', async () => {
  for (const synchronous of [true, false]) await withBrowser({}, async ({ service, status, released }) => {
    service.registration.active.respond = port => { if (synchronous) throw new Error('Worker lost'); port.postMessage({ ok: false, error: 'Storage denied' }); };
    const game = new OfflineGame(); await game.init();
    assert.match(game.getState().initError, synchronous ? /Worker lost/ : /Storage denied/);
    assert.equal(game.getState().busy, false); released();
    service.registration.active.respond = port => port.postMessage({ ok: true, result: status });
    await game.init(); assert.equal(game.getState().ready, true); assert.equal(game.getState().initError, ''); released();
  });
});

test('a failed replacement worker leaves the existing active worker ready', async () => withBrowser({}, async ({ service, Worker, Registration, flush, released }) => {
  const active = new Worker(), replacement = new Worker('installing');
  const registration = new Registration(active, replacement); service.registration = registration;
  const game = new OfflineGame(); await game.init();
  assert.equal(game.getState().ready, true); assert.deepEqual(active.messages, ['STATUS']); assert.deepEqual(replacement.messages, []);
  registration.installing = null; replacement.change('redundant'); await flush();
  assert.equal(game.getState().ready, true); assert.equal(game.getState().initError, ''); assert.equal(game.getState().update, false);
  assert.equal(replacement.count('statechange'), 0); assert.equal(registration.active, active); released();
}));

test('future updates are observed once and are never activated automatically', async () => withBrowser({}, async ({ service, Worker, flush, released }) => {
  const game = new OfflineGame(); await game.init(); await game.init();
  const registration = service.registration, active = registration.active, replacement = new Worker('installing');
  registration.installing = replacement; registration.emit('updatefound');
  assert.equal(replacement.count('statechange'), 1);
  registration.installing = null; registration.waiting = replacement; replacement.change('installed'); await flush();
  assert.equal(game.getState().update, true); assert.equal(game.getState().ready, true); assert.equal(registration.active, active);
  assert.deepEqual(replacement.messages, []); assert.equal(registration.count('updatefound'), 1);
  registration.waiting = null; registration.active = replacement; replacement.change('activated'); await flush();
  assert.equal(game.getState().update, false); assert.equal(replacement.count('statechange'), 0); released();
}));

test('init during an art download does not clear its busy state or launch another registration', async () => withBrowser({}, async ({ service, status, flush, released }) => {
  const game = new OfflineGame(); await game.init(); let finishDownload;
  service.registration.active.respond = (port, message) => {
    assert.equal(message.type, 'PREPARE'); finishDownload = () => port.postMessage({ ok: true, result: { ...status, cached: 42, complete: true } });
  };
  const download = game.prepare(); await flush(); await game.init();
  assert.equal(game.getState().busy, true); assert.equal(service.calls.length, 1);
  finishDownload(); await download;
  assert.equal(game.getState().complete, true); assert.equal(game.getState().busy, false); released();
}));


test('a rejected activation removes its reload listener and can be explicitly retried', async () => {
  for (const synchronous of [true, false]) await withBrowser({}, async ({ service, Worker, flush, released }) => {
    const game = new OfflineGame(); await game.init();
    const worker = new Worker('installed'); service.registration.waiting = worker;
    worker.respond = port => { if (synchronous) throw new Error('Worker lost'); port.postMessage({ ok: false, error: 'Activation refused' }); };
    await assert.rejects(game.applyUpdate(), synchronous ? /Worker lost/ : /Activation refused/);
    assert.equal(service.count('controllerchange'), 0);
    assert.equal(game.getState().busy, false); assert.equal(game.getState().applyingUpdate, false);
    assert.match(game.getState().error, synchronous ? /Worker lost/ : /Activation refused/);
    service.emit('controllerchange'); assert.equal(service.reloads, 0); released();
    worker.respond = port => port.postMessage({ ok: true, result: { activated: true } });
    const retry = game.applyUpdate(); await flush();
    assert.equal(game.getState().error, ''); assert.equal(game.getState().applyingUpdate, true);
    service.controller = worker; service.emit('controllerchange'); await retry;
    assert.equal(service.reloads, 1); assert.equal(service.count('controllerchange'), 0);
    assert.equal(game.getState().busy, false); assert.equal(game.getState().applyingUpdate, false); released();
  });
});

test('a silent activation or missing controller handover times out without arming a late reload', async () => {
  for (const acknowledged of [false, true]) await withBrowser({}, async ({ service, Worker, flush, tick, released }) => {
    const game = new OfflineGame(); await game.init();
    const worker = new Worker('installed'); service.registration.waiting = worker;
    worker.respond = port => { if (acknowledged) port.postMessage({ ok: true, result: { activated: true } }); };
    const attempt = game.applyUpdate(), rejection = assert.rejects(attempt, /trop de temps/);
    await flush(); await tick(20000); await rejection;
    assert.equal(game.getState().busy, false); assert.equal(game.getState().applyingUpdate, false);
    assert.match(game.getState().error, /trop de temps/);
    assert.equal(service.count('controllerchange'), 0); released();
    service.controller = worker; service.emit('controllerchange'); await flush();
    assert.equal(service.reloads, 0);
  });
});

test('concurrent activation requests share one operation and only the requested controller reloads once', async () => withBrowser({}, async ({ service, Worker, flush, released }) => {
  const game = new OfflineGame(); await game.init();
  const worker = new Worker('installed'); service.registration.waiting = worker;
  let delayedReply;
  worker.respond = port => { delayedReply = () => port.postMessage({ ok: true, result: { activated: true } }); };
  const first = game.applyUpdate(), second = game.applyUpdate();
  assert.equal(first, second); assert.equal(game.getState().busy, true); assert.equal(game.getState().applyingUpdate, true);
  await flush(); assert.deepEqual(worker.messages, ['ACTIVATE']); assert.equal(service.count('controllerchange'), 1);
  service.controller = new Worker(); service.emit('controllerchange'); await flush();
  assert.equal(service.reloads, 0); assert.equal(game.getState().busy, true);
  // Browser controller handover is authoritative even before the message reply.
  service.controller = worker; service.emit('controllerchange'); await first;
  assert.equal(service.reloads, 1); assert.equal(service.count('controllerchange'), 0); released();
  delayedReply(); service.emit('controllerchange'); await flush();
  assert.equal(service.reloads, 1); assert.equal(game.getState().busy, false); released();
}));

test('an update without a waiting worker or during pack preparation starts no activation', async () => withBrowser({}, async ({ service, Worker, status, flush, released }) => {
  const game = new OfflineGame(); await game.init(); await game.applyUpdate();
  assert.equal(service.count('controllerchange'), 0); assert.equal(game.getState().applyingUpdate, false); released();
  let finishDownload;
  service.registration.active.respond = port => { finishDownload = () => port.postMessage({ ok: true, result: status }); };
  const download = game.prepare(); await flush();
  const worker = new Worker('installed'); service.registration.waiting = worker;
  await game.applyUpdate();
  assert.deepEqual(worker.messages, []); assert.equal(service.count('controllerchange'), 0);
  assert.equal(game.getState().busy, true); assert.equal(game.getState().applyingUpdate, false);
  finishDownload(); await download; released();
}));

test('an incomplete preparation invalidates an evicted complete pack and retry restores its actual status', async () => withBrowser({}, async ({ service, status, flush, released }) => {
  service.registration.active.respond = port => port.postMessage({ ok: true, result: { ...status, cached: 42, complete: true } });
  const game = new OfflineGame(); await game.init(); assert.equal(game.getState().complete, true);
  service.registration.active.respond = port => {
    port.postMessage({ progress: true, cached: 3, total: 42 });
    port.postMessage({ ok: false, error: 'Art request failed' });
  };
  await assert.rejects(game.prepare(), /Art request failed/);
  assert.equal(game.getState().cached, 3); assert.equal(game.getState().complete, false);
  assert.equal(game.getState().busy, false); assert.equal(game.getState().error, 'Art request failed'); released();
  let finishDownload;
  service.registration.active.respond = port => {
    port.postMessage({ progress: true, cached: 4, total: 42 });
    finishDownload = () => { port.postMessage({ progress: true, cached: 42, total: 42 }); port.postMessage({ ok: true, result: { ...status, cached: 42, complete: true } }); };
  };
  const retry = game.prepare(); await flush();
  assert.equal(game.getState().error, ''); assert.equal(game.getState().cached, 4); assert.equal(game.getState().complete, false);
  finishDownload(); await retry;
  assert.equal(game.getState().cached, 42); assert.equal(game.getState().complete, true); assert.equal(game.getState().busy, false); released();
}));

test('a preparation failure before fresh progress cannot claim the old pack is still complete', async () => withBrowser({}, async ({ service, status, released }) => {
  service.registration.active.respond = port => port.postMessage({ ok: true, result: { ...status, cached: 42, complete: true } });
  const game = new OfflineGame(); await game.init();
  service.registration.active.respond = () => { throw new Error('Worker unavailable'); };
  await assert.rejects(game.prepare(), /Worker unavailable/);
  assert.equal(game.getState().complete, false); assert.equal(game.getState().busy, false);
  assert.equal(game.getState().error, 'Worker unavailable'); released();
}));
