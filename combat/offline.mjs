/** Optional offline support. Failure never blocks an online match or a profile export. */
const INIT_TIMEOUT_MS = 20000;
const installError = () => new Error('L’installation hors ligne a échoué. Vérifie la connexion et l’espace disponible, puis réessaie.');

// Registration cannot be cancelled, but a late result must not revive a failed attempt.
function abortable(promise, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => finish(signal.reason);
    const finish = (error, value) => {
      signal.removeEventListener('abort', abort);
      error ? reject(error) : resolve(value);
    };
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(value => finish(null, value), error => finish(error));
    if (signal.aborted) abort();
  });
}

export class OfflineGame {
  constructor(onChange = () => {}) {
    this.onChange = onChange;
    this.registration = null;
    this.installPrompt = null;
    this.initializing = null;
    this.stopWatching = null;
    this.state = { supported: 'serviceWorker' in navigator && window.isSecureContext, ready: false, busy: false, cached: 0, total: 0, bytes: 0, complete: false, update: false, installable: false, error: '', initError: '' };
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault(); this.installPrompt = event; this.update({ installable: true });
    });
    window.addEventListener('appinstalled', () => { this.installPrompt = null; this.update({ installable: false }); });
  }
  getState() { return { ...this.state }; }
  update(patch) { Object.assign(this.state, patch); this.onChange(this.getState()); }
  init() {
    if (this.initializing) return this.initializing;
    if (!this.state.supported || this.state.ready) return Promise.resolve(this.getState());
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error('La préparation hors ligne prend trop de temps. Vérifie la connexion, puis réessaie.')), INIT_TIMEOUT_MS);
    this.initializing = Promise.resolve().then(async () => {
      try {
        const registration = await abortable(navigator.serviceWorker.register(new URL('./sw.js', import.meta.url), { scope: './', type: 'module', updateViaCache: 'none' }), controller.signal);
        this.registration = registration;
        this.watchRegistration(registration);
        // An existing active worker remains usable while its replacement installs.
        await this.waitForActive(registration, controller.signal);
        await this.refresh(controller.signal);
      } catch (error) {
        this.stopWatching?.(); this.stopWatching = null;
        const message = error?.message || installError().message;
        this.update({ error: message, initError: message, ready: false });
      } finally {
        clearTimeout(timer); this.initializing = null; this.update({ busy: false });
      }
      return this.getState();
    });
    this.update({ busy: true, error: '', initError: '' });
    return this.initializing;
  }
  watchRegistration(registration) {
    this.stopWatching?.();
    const workers = new Set();
    const inspect = () => {
      for (const worker of [registration.installing, registration.waiting]) {
        if (worker && !workers.has(worker) && worker.state !== 'redundant' && worker.state !== 'activated') {
          workers.add(worker); worker.addEventListener('statechange', inspect);
        }
      }
      for (const worker of workers) {
        if (worker.state === 'redundant' || worker.state === 'activated') {
          worker.removeEventListener('statechange', inspect); workers.delete(worker);
        }
      }
      this.update({ update: !!registration.waiting });
    };
    registration.addEventListener('updatefound', inspect);
    this.stopWatching = () => {
      registration.removeEventListener('updatefound', inspect);
      for (const worker of workers) worker.removeEventListener('statechange', inspect);
      workers.clear();
    };
    inspect();
  }
  waitForActive(registration, signal) {
    return new Promise((resolve, reject) => {
      const workers = new Set(); let settled = false;
      const finish = (error, worker) => {
        if (settled) return;
        settled = true;
        registration.removeEventListener('updatefound', inspect);
        for (const observed of workers) observed.removeEventListener('statechange', inspect);
        signal.removeEventListener('abort', abort);
        error ? reject(error) : resolve(worker);
      };
      const inspect = () => {
        const candidates = [registration.active, registration.installing, registration.waiting].filter(Boolean);
        for (const worker of candidates) {
          if (!workers.has(worker)) { workers.add(worker); worker.addEventListener('statechange', inspect); }
        }
        if (registration.active?.state === 'activated') finish(null, registration.active);
        else if ([...workers].some(worker => worker.state === 'redundant') && !candidates.some(worker => worker.state !== 'redundant')) finish(installError());
      };
      const abort = () => finish(signal.reason);
      registration.addEventListener('updatefound', inspect);
      signal.addEventListener('abort', abort, { once: true });
      signal.aborted ? abort() : inspect();
    });
  }
  request(type, progress, worker = this.registration?.active, signal) {
    if (!worker) return Promise.reject(new Error('Le mode hors ligne est encore en préparation.'));
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      let timer, settled = false;
      const abort = () => end(signal.reason);
      const end = (error, result) => {
        if (settled) return;
        settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
        channel.port1.onmessage = null; channel.port1.close(); channel.port2.close();
        error ? reject(error) : resolve(result);
      };
      const arm = () => { clearTimeout(timer); timer = setTimeout(() => end(new Error('Le téléchargement ne répond plus. Réessaie ; les fichiers déjà reçus sont conservés.')), 60000); };
      if (signal?.aborted) { abort(); return; }
      signal?.addEventListener('abort', abort, { once: true });
      arm();
      channel.port1.onmessage = event => {
        if (event.data.progress) { arm(); progress?.(event.data); return; }
        event.data.ok ? end(null, event.data.result) : end(new Error(event.data.error));
      };
      try { worker.postMessage({ type }, [channel.port2]); } catch (error) { end(error); }
    });
  }
  async refresh(signal) {
    const status = await this.request('STATUS', null, undefined, signal);
    this.update({ ...status, ready: true, error: '', initError: '' });
    return status;
  }
  async prepare() {
    if (this.state.busy) return;
    this.update({ busy: true, error: '' });
    try {
      const result = await this.request('PREPARE', progress => this.update({ cached: progress.cached, total: progress.total }));
      this.update(result);
      return result;
    } catch (error) { this.update({ error: error.message }); throw error; }
    finally { this.update({ busy: false }); }
  }
  async clearAssets() {
    const result = await this.request('CLEAR_ART');
    this.update({ ...result, error: '' });
  }
  async applyUpdate() {
    if (!this.registration?.waiting) return;
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
    await this.request('ACTIVATE', null, this.registration.waiting);
  }
  async install() {
    if (!this.installPrompt) return false;
    const prompt = this.installPrompt;
    this.installPrompt = null;
    this.update({ installable: false });
    await prompt.prompt();
    return (await prompt.userChoice).outcome === 'accepted';
  }
}
