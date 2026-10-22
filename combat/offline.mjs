/** Optional offline support. Failure never blocks an online match or a profile export. */
export class OfflineGame {
  constructor(onChange = () => {}) {
    this.onChange = onChange;
    this.registration = null;
    this.installPrompt = null;
    this.state = { supported: 'serviceWorker' in navigator && window.isSecureContext, ready: false, busy: false, cached: 0, total: 0, bytes: 0, complete: false, update: false, installable: false, error: '' };
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault(); this.installPrompt = event; this.update({ installable: true });
    });
    window.addEventListener('appinstalled', () => { this.installPrompt = null; this.update({ installable: false }); });
  }
  getState() { return { ...this.state }; }
  update(patch) { Object.assign(this.state, patch); this.onChange(this.getState()); }
  async init() {
    if (!this.state.supported) return;
    try {
      this.registration = await navigator.serviceWorker.register(new URL('./sw.js', import.meta.url), { scope: './', type: 'module', updateViaCache: 'none' });
      const inspect = () => this.update({ update: !!this.registration.waiting });
      this.registration.addEventListener('updatefound', () => this.registration.installing?.addEventListener('statechange', inspect));
      inspect();
      await navigator.serviceWorker.ready;
      await this.refresh();
    } catch (error) { this.update({ error: error.message, ready: false }); }
  }
  request(type, progress, worker = this.registration?.active) {
    if (!worker) return Promise.reject(new Error('Le mode hors ligne est encore en préparation.'));
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      let timer;
      const end = (error, result) => { clearTimeout(timer); channel.port1.close(); error ? reject(error) : resolve(result); };
      const arm = () => { clearTimeout(timer); timer = setTimeout(() => end(new Error('Le téléchargement ne répond plus. Réessaie ; les fichiers déjà reçus sont conservés.')), 60000); };
      arm();
      channel.port1.onmessage = event => {
        if (event.data.progress) { arm(); progress?.(event.data); return; }
        event.data.ok ? end(null, event.data.result) : end(new Error(event.data.error));
      };
      worker.postMessage({ type }, [channel.port2]);
    });
  }
  async refresh() {
    const status = await this.request('STATUS');
    this.update({ ...status, ready: true });
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
