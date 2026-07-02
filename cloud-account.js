(function () {
  const APP_KEY = 'cainos';
  const APP_LABEL = 'CainOS';
  const PREFIXES = ['cainos_', 'tadc_'];
  const KEYS = ['was_shutdown_by_calibration'];
  const SESSION_KEY = `${APP_KEY}_supabase_session_v1`;
  const SUPABASE_URL = 'https://hykklcvvwjwhcvukbzts.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_hAcM5bQMkl9a0wn7tgzupg_DeSgYQZC';
  const TABLE = 'app_cloud_saves';
  let session = readSession();
  let open = false;

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  }
  function writeSession(next) {
    session = next;
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
    render();
  }
  async function supabaseFetch(path, options = {}, token = null) {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}`, ...(options.headers || {}) }
    });
    if (!res.ok) {
      let msg = `Supabase ${res.status}`;
      try { const data = await res.json(); msg = data.error_description || data.message || msg; } catch { msg = await res.text(); }
      throw new Error(msg);
    }
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }
  function normalizeSession(data) {
    const source = data.session || data;
    return { access_token: source?.access_token, refresh_token: source?.refresh_token, expires_at: source?.expires_at, user: data.user || source?.user };
  }
  function shouldCaptureKey(key) {
    return KEYS.includes(key) || PREFIXES.some((prefix) => key.startsWith(prefix));
  }
  function captureSnapshot() {
    const entries = {};
    Object.keys(localStorage).forEach((key) => {
      if (key !== SESSION_KEY && shouldCaptureKey(key)) entries[key] = localStorage.getItem(key);
    });
    return { appKey: APP_KEY, capturedAt: new Date().toISOString(), entries };
  }
  function restoreSnapshot(payload) {
    if (!payload?.entries || typeof payload.entries !== 'object') throw new Error('Sauvegarde cloud invalide.');
    Object.entries(payload.entries).forEach(([key, value]) => {
      if (shouldCaptureKey(key) && typeof value === 'string') localStorage.setItem(key, value);
    });
  }
  async function signUp(email, password) {
    const data = await supabaseFetch('/auth/v1/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    writeSession(normalizeSession(data));
  }
  async function signIn(email, password) {
    const data = await supabaseFetch('/auth/v1/token?grant_type=password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    writeSession(normalizeSession(data));
  }
  async function saveCloud() {
    if (!session?.user?.id || !session?.access_token) throw new Error('Compte non connecte.');
    await supabaseFetch(`/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: session.user.id, app_key: APP_KEY, payload: captureSnapshot() })
    }, session.access_token);
  }
  async function loadCloud() {
    if (!session?.user?.id || !session?.access_token) throw new Error('Compte non connecte.');
    const rows = await supabaseFetch(`/rest/v1/${TABLE}?select=payload,updated_at&user_id=eq.${encodeURIComponent(session.user.id)}&app_key=eq.${encodeURIComponent(APP_KEY)}&limit=1`, {}, session.access_token);
    if (!rows?.[0]?.payload) throw new Error('Aucune sauvegarde cloud pour cette appli.');
    restoreSnapshot(rows[0].payload);
    window.location.reload();
  }
  function setStatus(message, tone = '') {
    const el = document.querySelector('[data-cloud-status]');
    if (el) { el.textContent = message; el.dataset.tone = tone; }
  }
  async function run(action) {
    try { setStatus('Operation cloud en cours...'); await action(); setStatus('Cloud synchronise.', 'ok'); } catch (e) { setStatus(e.message || 'Erreur cloud.', 'bad'); }
  }
  function render() {
    let root = document.getElementById('cloudAccountWidget');
    if (!root) { root = document.createElement('div'); root.id = 'cloudAccountWidget'; document.body.appendChild(root); }
    const connected = Boolean(session?.user?.email);
    root.innerHTML = `
      <style>
        #cloudAccountWidget{position:fixed;right:14px;top:14px;z-index:99999;font-family:Arial,sans-serif;color:#dff}
        .cloud-account-toggle,.cloud-account-panel button{border:1px solid #00f5ff;background:#02070a;color:#dff;padding:8px 10px;border-radius:3px;font-weight:800;cursor:pointer;box-shadow:0 0 14px rgba(0,245,255,.25)}
        .cloud-account-panel{display:${open ? 'grid' : 'none'};gap:8px;width:280px;margin-top:8px;padding:12px;background:rgba(0,8,12,.96);border:1px solid #00f5ff;border-radius:4px;box-shadow:0 18px 40px rgba(0,0,0,.55)}
        .cloud-account-panel h3{margin:0;color:#00f5ff;font-size:14px}.cloud-account-panel p{margin:0;color:#b8d7d7;font-size:12px;line-height:1.35}
        .cloud-account-panel input{width:100%;box-sizing:border-box;border:1px solid #17636a;background:#000;color:#dff;border-radius:3px;padding:8px}
        .cloud-account-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}.cloud-account-status{min-height:16px;color:#b8d7d7;font-size:11px}.cloud-account-status[data-tone=ok]{color:#77ffbb}.cloud-account-status[data-tone=bad]{color:#ff8c8c}
      </style>
      <button class="cloud-account-toggle">${connected ? 'COMPTE: CLOUD' : 'COMPTE: LOCAL'}</button>
      <div class="cloud-account-panel">
        <h3>${APP_LABEL}</h3><p>${connected ? session.user.email : 'Connecte un compte pour garder ta progression.'}</p>
        <input data-cloud-email type="email" placeholder="email" value="${session?.user?.email || ''}">
        <input data-cloud-password type="password" placeholder="mot de passe">
        <div class="cloud-account-row"><button data-cloud-signin>Connexion</button><button data-cloud-signup>Creer</button></div>
        <div class="cloud-account-row"><button data-cloud-save>Sync cloud</button><button data-cloud-load>Charger</button></div>
        <button data-cloud-logout>${connected ? 'Deconnexion' : 'Rester local'}</button>
        <div class="cloud-account-status" data-cloud-status></div>
      </div>`;
    root.querySelector('.cloud-account-toggle').addEventListener('click', () => { open = !open; render(); });
    root.querySelector('[data-cloud-signin]').addEventListener('click', () => run(() => signIn(root.querySelector('[data-cloud-email]').value, root.querySelector('[data-cloud-password]').value)));
    root.querySelector('[data-cloud-signup]').addEventListener('click', () => run(() => signUp(root.querySelector('[data-cloud-email]').value, root.querySelector('[data-cloud-password]').value)));
    root.querySelector('[data-cloud-save]').addEventListener('click', () => run(saveCloud));
    root.querySelector('[data-cloud-load]').addEventListener('click', () => run(loadCloud));
    root.querySelector('[data-cloud-logout]').addEventListener('click', () => writeSession(null));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
