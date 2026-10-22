import { FIGHTERS, STAGES, VARIANTS, ARCHIVE, MOVE_SLOTS, SLOT_LABELS, SOURCES, getFighter, getStage } from './data.mjs';
import { CombatEngine, FIXED_DT } from './engine.mjs';
import { CombatRenderer, drawPortrait } from './render.mjs';
import { InputController, KEY_LABELS } from './input.mjs';
import { GAME_VERSION, SAVE_KEY, REPLAY_KEY, MODES, CHALLENGES, readProfile, saveProfile, validateProfile, cleanSettings, appendReplayFrame, validateReplay, replayInputs, makeRun, createMatchStats, collectMatchStats, challengeProgress } from './session.mjs';

const $ = selector => document.querySelector(selector);
const main = $('#main'), modal = $('#modal');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => Math.round(Number(value) || 0).toLocaleString('fr-FR');
const embedded = new URLSearchParams(location.search).get('embedded') === '1' && window.parent !== window;
let storage;
try { storage = localStorage; } catch { storage = { getItem: () => null, setItem: () => { throw new Error('Stockage indisponible'); } }; }
let profile = readProfile(storage);
let profileDirty = false;
let screen = 'home', active = null, selection = { mode:'versus', fighters:['pomni','jax'], side:0, stage:STAGES[0].id, variants:['',''], challenge:CHALLENGES[0].id };
let codexId = 'pomni', archiveQuery = '', archivePage = 0, archiveFilter = 'all', previousTime = 0, accumulator = 0, toastTimer;
let currentObserver, audioContext;
document.body.classList.toggle('embedded', embedded);
if (embedded) $('#session-label').textContent = 'SESSION CAINOS';
if (new URLSearchParams(location.search).get('standalone') === '1') $('#os-link').hidden = true;
const controls = new InputController({ enabled: () => !!active && screen === 'fight' && !modal.open && !active.finished, onPause: () => pauseGame(), onHelp: () => showControls() });
const labels = { light:'J',heavy:'K',low:'↓ + J',throw:'U',special:'I',specialDown:'↓ + I',specialForward:'Avant + I',specialBack:'Arrière + I',super:'O',utility:'L' };

function toast(message) {
  const element = $('#toast'); element.textContent = message; element.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { element.hidden = true; }, 5000);
}
function persist() {
  profileDirty = !saveProfile(storage, profile);
  if (profileDirty) toast('Stockage local indisponible. Exporte ta sauvegarde pour la conserver.');
}
function refreshStoredProfile() {
  // Keep unsaved results in memory when storage is denied, full or inaccessible.
  if (profileDirty) return;
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return;
    const latest = validateProfile(JSON.parse(raw));
    latest.settings = profile.settings;
    profile = latest;
  } catch { /* The current session remains playable and exportable. */ }
}
function applySettings() {
  document.body.classList.toggle('reduced-motion', profile.settings.reducedMotion);
  if (active) active.showHitboxes = profile.settings.hitboxes;
}
function sound(kind) {
  if (!profile.settings.sound || !profile.settings.volume) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const osc = audioContext.createOscillator(), gain = audioContext.createGain(), now = audioContext.currentTime;
    const base = kind === 'damage' ? 130 : kind === 'block' ? 260 : kind === 'win' ? 660 : 420;
    osc.type = kind === 'damage' ? 'triangle' : 'sine'; osc.frequency.setValueAtTime(base, now); osc.frequency.exponentialRampToValueAtTime(base * .6, now + .11);
    gain.gain.setValueAtTime(profile.settings.volume * .12, now); gain.gain.exponentialRampToValueAtTime(.001, now + .15);
    osc.connect(gain); gain.connect(audioContext.destination); osc.start(now); osc.stop(now + .17);
  } catch { /* Audio is optional; restricted browsers remain playable. */ }
}
function setScreen(next) {
  screen = next; currentObserver?.disconnect();
  main.classList.toggle('combat-main', next === 'fight');
  document.querySelectorAll('.masthead [data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === next || b.dataset.nav === 'home' && ['select','fight','challenges'].includes(next)));
  if (next !== 'fight') main.scrollIntoView({ block:'start' });
}
function showDialog(content) { $('#modal-content').innerHTML = content; if (!modal.open) modal.showModal(); }
function closeDialog() { modal.close(); }
function title(eyebrow, heading, description='') { return `<div class="page-title"><span class="ticket-label">${escapeHTML(eyebrow)}</span><h1>${escapeHTML(heading)}</h1>${description ? `<p>${escapeHTML(description)}</p>` : ''}</div>`; }
function portraits() {
  const nodes = main.querySelectorAll('canvas[data-portrait]');
  const load = canvas => {
    const item = ARCHIVE.find(f => f.id === canvas.dataset.portrait) || getFighter(canvas.dataset.portrait);
    // Full combat definitions provide the high quality animated idle portrait.
    const fighter = FIGHTERS.find(f => f.id === item.id) || item;
    drawPortrait(canvas, fighter).catch(() => { canvas.setAttribute('aria-label', `${fighter.name} — illustration indisponible`); });
  };
  if ('IntersectionObserver' in window) {
    currentObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { load(entry.target); currentObserver.unobserve(entry.target); } }), { rootMargin:'160px' });
    nodes.forEach(node => currentObserver.observe(node));
  } else nodes.forEach(load);
}
function portraitMarkup(id, className='', width=200, height=230) { return `<canvas class="${className}" width="${width}" height="${height}" data-portrait="${escapeHTML(id)}" role="img" aria-label="${escapeHTML(FIGHTERS.find(f=>f.id===id)?.name || ARCHIVE.find(f=>f.id===id)?.name || id)}"></canvas>`; }

function renderHome() {
  active = null; controls.clear(); setScreen('home');
  main.innerHTML = `<section class="hero"><div class="hero-copy"><span class="ticket-label">CAINOS PRÉSENTE · ENTRÉE LIBRE</span><h1>LE SPECTACLE<em>RECOMMENCE.</em></h1><p>Les mêmes visages. De nouvelles rivalités.<br>Entre dans l’arène et invente ton prochain grand numéro.</p><div class="hero-bottom"><button class="primary" data-mode="versus">ENTRER EN SCÈNE &nbsp; ↗</button><div class="hero-stats"><span><b>${FIGHTERS.length}</b>ARTISTES</span><span><b>${STAGES.length}</b>ARÈNES</span><span><b>${MODES.length}</b>MODES</span></div></div></div><div class="hero-poster" aria-label="Pomni contre Jax"><span class="poster-title">THE AMAZING DIGITAL CIRCUS</span><span class="poster-star a" aria-hidden="true">✧</span><span class="poster-star b" aria-hidden="true">✦</span>${portraitMarkup('pomni','poster-art first',300,350)}${portraitMarkup('jax','poster-art second',300,350)}<span class="poster-vs">VS</span><span class="poster-badge">LE GRAND DUEL</span></div></section>
    <section aria-labelledby="modes-title"><div class="section-heading"><h2 id="modes-title">Choisis ton numéro</h2><span>LE RIDEAU NE TOMBE JAMAIS</span></div><div class="modes-grid">${MODES.map(m=>`<button class="mode-card" data-mode="${m.id}"><span class="eyebrow">${m.eyebrow}</span><span class="mode-icon" aria-hidden="true">${m.icon}</span><h3>${m.name}</h3><p>${m.description}</p><span class="card-label">${m.label}</span><span class="mode-arrow" aria-hidden="true">↗</span></button>`).join('')}<div class="mode-card replay-card"><span class="eyebrow">LES ARCHIVES DU SPECTACLE</span><span class="mode-icon" aria-hidden="true">▷</span><h3>Revoir la dernière scène</h3><p>Ton dernier duel enregistré, image par image.</p><div class="replay-actions"><button data-action="last-replay">Revoir</button><button data-action="import-replay">Importer</button><button data-action="export-replay">Exporter</button></div></div></div></section>`;
  portraits();
}
function chooseMode(mode) {
  if (!MODES.some(m=>m.id===mode)) return;
  selection.mode = mode; selection.side = 0;
  if (mode === 'challenge') renderChallenges(); else renderSelect();
}
function renderChallenges() {
  setScreen('challenges');
  main.innerHTML = `${title('LES DÉFIS DE CAINE','Une petite démonstration ?','Chaque défi est un exercice indépendant de 60 secondes. Toutes les techniques restent disponibles dès le départ.')}<div class="challenge-list">${CHALLENGES.map((c,i)=>`<button class="challenge-card" data-challenge="${c.id}"><span class="eyebrow">EXERCICE 0${i+1}</span><h3>${c.name}</h3><p>${c.text}</p><span class="badge ${profile.challenges.includes(c.id)?'success':''}">${profile.challenges.includes(c.id)?'✦ RÉUSSI':'ENTRER EN PISTE ↗'}</span></button>`).join('')}</div>`;
}
function renderSelect() {
  setScreen('select');
  const mode = MODES.find(m=>m.id===selection.mode), selected = selection.fighters.map(getFighter);
  const single = ['arcade','boss','survival','challenge'].includes(selection.mode);
  const challenge = CHALLENGES.find(c=>c.id===selection.challenge);
  main.innerHTML = `${title(mode.eyebrow,selection.mode==='challenge'?challenge.name:'Qui entre en scène ?',selection.mode==='challenge'?challenge.text:mode.description)}
    <div class="pick-header"><h2>Les artistes</h2><div class="pick-side"><button data-side="0" class="${selection.side===0?'active':''}">JOUEUR 1</button>${single?'':`<button data-side="1" class="${selection.side===1?'active':''}">${selection.mode==='local'?'JOUEUR 2':'ADVERSAIRE'}</button>`}</div></div>
    <div class="roster">${FIGHTERS.map(f=>`<button class="fighter-card ${selection.fighters[0]===f.id?'selected':''} ${!single&&selection.fighters[1]===f.id?'rival':''}" data-fighter="${f.id}" aria-label="Choisir ${escapeHTML(f.name)}" aria-pressed="${selection.fighters[selection.side]===f.id}">${portraitMarkup(f.id)}<strong>${escapeHTML(f.name)}</strong><small>${escapeHTML(f.role)}</small>${selection.fighters[0]===f.id?'<span class="fighter-chip">J1</span>':!single&&selection.fighters[1]===f.id?'<span class="fighter-chip p2">J2</span>':''}</button>`).join('')}</div>
    <div class="selection-summary"><div><h3>${escapeHTML(selected[0].name)}</h3><p>${escapeHTML(selected[0].title)}<br>${escapeHTML(selected[0].role)} · 10 techniques</p></div><div>VS</div><div><h3>${single?selection.mode==='arcade'?'Les six actes':selection.mode==='boss'?'Les anomalies':selection.mode==='survival'?'Dix vagues':'Le mannequin':escapeHTML(selected[1].name)}</h3><p>${single?'Une succession de défis préparée par Caine.':escapeHTML(selected[1].title)}</p></div></div>
    <div class="selection-controls"><label class="field"><span>APPARENCE JOUEUR 1</span><select id="variant-0">${variantOptions(0)}</select></label>${single?'':`<label class="field"><span>APPARENCE ${selection.mode==='local'?'JOUEUR 2':'ADVERSAIRE'}</span><select id="variant-1">${variantOptions(1)}</select></label>`}<label class="field"><span>DIFFICULTÉ CPU</span><select id="select-difficulty">${[['easy','Détente'],['normal','Équilibrée'],['hard','Exigeante']].map(([id,name])=>`<option value="${id}" ${profile.settings.difficulty===id?'selected':''}>${name}</option>`).join('')}</select></label><button class="primary" data-action="start">LEVER LE RIDEAU ↗</button></div>
    <div class="section-heading"><h2>Le décor</h2><span>ARÈNES SANS DANGER ALÉATOIRE</span></div><div class="stages">${STAGES.map((stage,i)=>`<button class="stage-card ${selection.stage===stage.id?'selected':''}" data-stage="${stage.id}" aria-pressed="${selection.stage===stage.id}" style="--stage-color:${stage.palette.accent}"><b>${escapeHTML(stage.name)}</b><span>SCÈNE ${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div><p class="small-note">Les apparences proviennent des archives de CainOS. Les capacités et leurs valeurs sont des adaptations pour le combat. Les anciens membres et formes abstraites sont des adversaires simulés dans ce mode libre.</p>`;
  portraits();
}
function variantOptions(side) {
  return `<option value="">Apparence originale</option>` + VARIANTS.filter(v=>v.fighterId===selection.fighters[side]).map(v=>`<option value="${v.id}" ${selection.variants[side]===v.id?'selected':''}>${escapeHTML(v.name)} · archive</option>`).join('');
}
function costume(fighter, id) {
  const variant = VARIANTS.find(v=>v.id===id && v.fighterId===fighter.id);
  return variant ? { ...fighter, sprite:variant.sprite, animation:null, costume:id } : fighter;
}
function moveTable(fighter) {
  return `<div class="scroll-table"><table class="move-table"><thead><tr><th>COMMANDE J1</th><th>TECHNIQUE / EFFET</th><th>DÉBUT · ACTIVE · FIN</th><th>DÉGÂTS</th></tr></thead><tbody>${MOVE_SLOTS.map(slot=>{const m=fighter.moves[slot];return `<tr><td><kbd>${labels[slot]}</kbd><small>${SLOT_LABELS[slot]}</small></td><td><strong>${escapeHTML(m.name)}</strong><small>${escapeHTML(m.description)}${m.cost?` · Stabilité : ${m.cost}`:''}${m.meter?` · Finale : ${m.meter}%`:''}</small></td><td>${m.startup} · ${m.active} · ${m.recovery}<small>images à 60 Hz</small></td><td>${number(m.damage)}</td></tr>`;}).join('')}</tbody></table></div>`;
}
function renderCodex() {
  setScreen('codex'); const fighter=getFighter(codexId);
  main.innerHTML=`${title('LE PROGRAMME','Les artistes et leurs techniques','Chaque combattant possède ses dix techniques, une ressource de stabilité et un grand final. Les dégâts ci-dessous précèdent les modificateurs de puissance, de combo et de garde.')}<div class="codex-layout"><aside class="codex-list" aria-label="Liste des combattants">${FIGHTERS.map(f=>`<button data-codex="${f.id}" class="${f.id===codexId?'active':''}">${portraitMarkup(f.id,'',100,120)}<span><strong>${escapeHTML(f.name)}</strong><small>${escapeHTML(f.role)}</small></span></button>`).join('')}</aside><section><div class="codex-head">${portraitMarkup(fighter.id)}<div><span class="eyebrow">${escapeHTML(fighter.role)}</span><h2>${escapeHTML(fighter.name)}</h2><p>${escapeHTML(fighter.title)}<br>Vie : 10 000 · Puissance ×${fighter.power} · Vitesse ×${fighter.speed}</p><button class="secondary" data-practice="${fighter.id}">Répéter avec ${escapeHTML(fighter.name)}</button></div></div>${moveTable(fighter)}<p class="small-note">Enchaînements sur touche confirmée : léger → fort ; bas → spécial ; fort → spécial avant. Les projectiles, boucliers, parades et déplacements varient selon l’artiste. Le labo permet de voir les zones de contact.</p><p class="small-note">Référence visuelle : <a href="${escapeHTML(SOURCES.find(s=>s.id===fighter.loreSource)?.url || SOURCES[0].url)}" target="_blank" rel="noopener">${escapeHTML(SOURCES.find(s=>s.id===fighter.loreSource)?.title || 'Archives CainOS')}</a>. Les techniques sont des créations pour le jeu.</p></section></div>`;
  portraits();
}
function renderArchives() {
  setScreen('archives');
  const matching = ARCHIVE.filter(item=>(`${item.name} ${item.id}`.toLocaleLowerCase('fr').includes(archiveQuery.toLocaleLowerCase('fr'))) && (archiveFilter==='all'||archiveFilter==='playable'&&FIGHTERS.some(f=>f.id===item.id)||archiveFilter==='variant'&&VARIANTS.some(v=>v.id===item.id)||archiveFilter==='archive'&&!FIGHTERS.some(f=>f.id===item.id)&&!VARIANTS.some(v=>v.id===item.id)));
  const pages=Math.max(1,Math.ceil(matching.length/24)); archivePage=Math.min(archivePage,pages-1);
  main.innerHTML=`${title('LA MÉMOIRE DU CIRQUE','Les archives de CainOS',`${ARCHIVE.length} apparences inventoriées, dont ${FIGHTERS.length} combattants et ${VARIANTS.length} variantes d’apparence. Les fiches d’archive ne deviennent pas automatiquement des combattants.`)}<div class="toolbar"><input type="search" id="archive-search" value="${escapeHTML(archiveQuery)}" placeholder="Chercher un personnage ou une variante…" aria-label="Rechercher dans les archives"><select id="archive-filter" aria-label="Filtrer les archives">${[['all','Toutes les apparences'],['playable','Combattants jouables'],['variant','Costumes de combattants'],['archive','Archives à adapter']].map(([id,name])=>`<option value="${id}" ${archiveFilter===id?'selected':''}>${name}</option>`).join('')}</select><span class="small-note">${matching.length} résultats</span></div><div class="archive-grid">${matching.slice(archivePage*24,archivePage*24+24).map(item=>`<article class="archive-card">${portraitMarkup(item.id)}<h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.provenance)}</p><span class="badge ${FIGHTERS.some(f=>f.id===item.id)?'success':''}">${FIGHTERS.some(f=>f.id===item.id)?'COMBATTANT':VARIANTS.some(v=>v.id===item.id)?'APPARENCE':'ARCHIVE'}</span></article>`).join('')||'<p class="empty-state">Aucune apparition ne correspond à cette recherche.</p>'}</div><div class="toolbar"><button class="secondary" data-page="-1" ${archivePage===0?'disabled':''}>← Précédent</button><span class="small-note">Page ${archivePage+1} / ${pages}</span><button class="secondary" data-page="1" ${archivePage===pages-1?'disabled':''}>Suivant →</button></div>`;
  portraits();
}
function renderSettings() {
  setScreen('settings'); const s=profile.settings;
  const select=(key,values)=>`<select data-setting="${key}">${values.map(([v,label])=>`<option value="${v}" ${String(s[key])===String(v)?'selected':''}>${label}</option>`).join('')}</select>`;
  const check=key=>`<input type="checkbox" data-setting="${key}" ${s[key]?'checked':''}>`;
  main.innerHTML=`${title('EN COULISSES','Les règles de ton spectacle','Les réglages et les résultats sont conservés dans ce navigateur. L’application CainOS et le jeu autonome partagent le profil lorsqu’ils sont ouverts sur le même site.')}<div class="settings-grid"><section class="settings-block"><h2>Combat et commandes</h2><label class="settings-row">Disposition clavier ${select('layout',[['azerty','AZERTY'],['qwerty','QWERTY']])}</label><label class="settings-row">Difficulté CPU ${select('difficulty',[['easy','Détente'],['normal','Équilibrée'],['hard','Exigeante']])}</label><label class="settings-row">Durée d’une manche ${select('seconds',[[60,'60 secondes'],[90,'90 secondes'],[120,'120 secondes']])}</label><label class="settings-row">Manches gagnantes ${select('rounds',[[1,'1 manche'],[2,'2 manches'],[3,'3 manches']])}</label><label class="settings-row">Commandes tactiles ${select('touch',[['auto','Automatiques'],['on','Toujours visibles'],['off','Masquées']])}</label><button class="text-button" data-action="controls">Afficher toutes les commandes ↗</button><p class="small-note">Deux manettes standard sont prises en charge pendant les combats. Les touches de déplacement occupent la même position physique en AZERTY et en QWERTY.</p></section><section class="settings-block"><h2>Confort du spectacle</h2><label class="settings-row">Effets sonores ${check('sound')}</label><label class="settings-row">Volume <input type="range" min="0" max="1" step="0.05" value="${s.volume}" data-setting="volume" aria-label="Volume"></label><label class="settings-row">Réduire les mouvements ${check('reducedMotion')}</label><label class="settings-row">Afficher les zones de contact ${check('hitboxes')}</label><p class="small-note">La réduction des mouvements retire les tremblements et les oscillations décoratives. Elle conserve la lisibilité des déplacements et des impacts.</p><button class="secondary" data-mode="training">Ouvrir les répétitions</button></section><section class="settings-block"><h2>Ton palmarès · joueur 1</h2>${[['matches','Duels terminés'],['wins','Victoires'],['losses','Défaites'],['bestSurvival','Meilleure série de survie'],['damage','Dégâts cumulés']].map(([key,label])=>`<div class="stats-row">${label}<b>${number(profile.stats[key])}</b></div>`).join('')}<div class="stats-row">Défis accomplis <b>${profile.challenges.length}/${CHALLENGES.length}</b></div></section><section class="settings-block"><h2>Profil et replays</h2><p class="small-note">Exporte ton profil pour changer de navigateur ou de site. L’import vérifie le format avant de remplacer ce profil. Les sauvegardes des autres applications CainOS restent séparées.</p><div class="modal-actions"><button class="secondary" data-action="export-profile">Exporter le profil</button><button class="secondary" data-action="import-profile">Importer un profil</button></div><div class="modal-actions"><button class="secondary" data-action="export-replay">Exporter le dernier duel</button><button class="secondary" data-action="import-replay">Lire un replay</button></div><p class="small-note">Les replays enregistrent les entrées locales et une graine déterministe. Ils sont compatibles avec Encore ${GAME_VERSION}.</p></section></div>`;
}

function renderFight() {
  setScreen('fight');
  const f=active.fighters, mode=active.replay?'REPLAY LOCAL':MODES.find(m=>m.id===active.mode)?.name;
  const touch=profile.settings.touch==='on'||profile.settings.touch==='auto'&&matchMedia('(pointer:coarse)').matches;
  main.innerHTML=`<div class="fight-toolbar"><span class="fight-caption">${escapeHTML(mode)} · ${escapeHTML(active.stage.name)}${active.run?` · ${active.run.index+1}/${active.run.opponents.length}`:''}</span><button class="secondary" data-action="pause">Ⅱ Pause</button><button class="secondary" data-action="movelist">Techniques</button><button class="secondary" data-action="controls">Commandes</button><button class="secondary" data-action="fullscreen">⛶ Plein écran</button></div>${active.mode==='challenge'?`<div class="challenge-progress"><span>${escapeHTML(active.challenge.text)}</span><progress id="challenge-bar" max="${active.challenge.goal}" value="0"></progress><b id="challenge-value">0/${active.challenge.goal}</b><span id="challenge-time">60 s</span></div>`:''}<section class="arena-wrap" aria-label="Arène de combat"><canvas id="arena" width="1280" height="720" tabindex="0" aria-label="Combat. Les commandes sont disponibles au-dessus de l’arène."></canvas><div class="hud">${hudPlayer(f[0],0)}<div class="hud-timer"><span id="round-time">90</span><small id="round-label">MANCHE 1</small></div>${hudPlayer(f[1],1)}</div><div id="announcement" class="fight-announcement" aria-live="polite"></div><div class="fight-bottom"><span id="feedback-0" class="fight-feedback"></span><span id="feedback-1" class="fight-feedback second"></span></div></section>${active.mode==='training'?`<div class="training-panel"><label>Mannequin <select id="training-dummy"><option value="idle">Immobile</option><option value="block">Garde haute</option><option value="crouch">Garde basse</option><option value="jump">Sauts</option><option value="after">Garde après impact</option><option value="cpu">CPU</option></select></label><label><input type="checkbox" id="training-meter" checked> Finale libre</label><label><input type="checkbox" id="training-heal" checked> Soin automatique</label><label><input type="checkbox" id="training-boxes" ${active.showHitboxes?'checked':''}> Zones de contact</label><button class="secondary" data-action="reset-training">Replacer</button><span id="training-data" class="training-data">Approche le mannequin pour essayer les techniques.</span></div>`:''}<div class="control-strip"><span><kbd>${KEY_LABELS[profile.settings.layout][0]}</kbd> Déplacer · <kbd>J</kbd> Léger · <kbd>K</kbd> Fort · <kbd>I</kbd> Spécial · <kbd>U</kbd> Saisie · <kbd>O</kbd> Finale · <kbd>L</kbd> Ressource</span><span><kbd>Maj</kbd> Garde · <kbd>E</kbd> Dash · <kbd>Échap</kbd> Pause</span></div>${touch?touchMarkup():''}`;
  active.renderer=new CombatRenderer($('#arena')); controls.bindTouch(main);
  $('#arena').focus({preventScroll:true}); updateHUD();
}
function hudPlayer(f,index) { return `<div class="hud-player ${index?'second':''}"><div class="hud-name"><span>${escapeHTML(f.name)}</span><span>${index?active.mode==='local'?'J2':'CPU':'J1'}</span></div><div class="health-track"><div id="health-${index}" class="health-fill"></div></div><div class="guard-track"><div id="guard-${index}" class="guard-fill"></div></div><div class="meter-track"><div id="meter-${index}" class="meter-fill"></div></div><div class="hud-bars-meta"><span id="hp-${index}">10 000</span><span id="resource-${index}">STABILITÉ 100</span><span id="super-${index}">FINALE 0%</span></div><div class="round-pips" id="wins-${index}">○ ○</div></div>`; }
function touchMarkup() {
  const button=(action,label,style='')=>`<button data-control="${action}" class="${style}" aria-label="${escapeHTML(action)}">${label}</button>`;
  return `<div class="touch-controls" aria-label="Commandes tactiles joueur 1"><div class="touch-move"><span></span>${button('jump','↑')}<span></span>${button('left','←')}${button('down','↓')}${button('right','→')}${button('guard','Garde','guard')}${button('dash','Dash')}<span></span></div><div class="touch-buttons">${button('light','Léger')}${button('heavy','Fort')}${button('special','Spéc.','accent')}${button('throw','Saisie')}${button('low','Bas')}${button('utility','Repos')}${button('super','Finale','accent')}${button('tech','Déchope')}</div></div><div class="touch-extra">${button('specialDown','Spécial ↓')}${button('specialForward','Spécial avant')}${button('specialBack','Spécial arrière')}</div>`;
}
async function startMatch(options={}) {
  closeDialog(); controls.clear();
  const mode=options.mode||selection.mode, run=options.run||(['arcade','boss','survival'].includes(mode)?makeRun(mode,selection.fighters[0],FIGHTERS,STAGES):null);
  if(run && run.index===0)run.stages[0]=selection.stage;
  const config=options.replay?.config;
  const fighterIds=config?.fighters || [selection.fighters[0],run?run.opponents[run.index]:selection.fighters[1]];
  const variants=config?['','']:selection.variants;
  const fighters=fighterIds.map((id,i)=>costume(getFighter(id),variants[i]));
  const stage=getStage(config?.stage || run?.stages[run.index] || selection.stage);
  const challenge=mode==='challenge'?CHALLENGES.find(c=>c.id===selection.challenge):null;
  const matchConfig={fighters,stage,mode:mode==='training'||mode==='challenge'?'training':mode==='local'?'local':'versus',cpu:config?.cpu||[false,!['local','training','challenge'].includes(mode)],difficulty:config?.difficulty||profile.settings.difficulty,seed:config?.seed??crypto.getRandomValues(new Uint32Array(1))[0],roundTime:config?.roundTime||profile.settings.seconds,roundsToWin:config?.roundsToWin||(run?1:profile.settings.rounds)};
  const engine=new CombatEngine(matchConfig);
  const initialHealth=config?.initialHealth || [mode==='survival'&&run?run.health:10000,10000];
  engine.state.fighters.forEach((f,i)=>{f.life=initialHealth[i];});
  if(challenge)engine.setTraining({dummy:challenge.dummy,freeMeter:true,freeResource:true,autoheal:true});
  active={engine,fighters,stage,mode,run,challenge,replay:!!options.replay,replaySource:options.replay,replayIterator:options.replay?replayInputs(options.replay):null,replayFrame:0,replayTotal:options.replay?.frames,record:{format:'circus-encore-replay',version:GAME_VERSION,config:{fighters:fighterIds,stage:stage.id,cpu:matchConfig.cpu,difficulty:matchConfig.difficulty,seed:matchConfig.seed,roundTime:matchConfig.roundTime,roundsToWin:matchConfig.roundsToWin,initialHealth},runs:[]},recordFrames:0,stats:createMatchStats(),elapsed:0,showHitboxes:profile.settings.hitboxes,finished:false,ready:false,announcement:'',roundDelay:0};
  renderFight(); const match=active;
  $('#announcement').innerHTML='<strong>LE RIDEAU SE LÈVE</strong><span>Préparation des artistes…</span>';
  const load=await active.renderer.preload(fighters,[stage]);
  if(active!==match)return;
  active.ready=true; active.announcement=null; accumulator=0; previousTime=performance.now();
  if(load?.errors?.length)toast('Certaines illustrations sont indisponibles. Le combat reste accessible avec un repère visuel.');
  sound('start');
}
function updateHUD() {
  if(!active || screen!=='fight')return;
  const s=active.engine.state;
  s.fighters.forEach((p,i)=>{
    $(`#health-${i}`).style.width=`${Math.max(0,p.life/p.max*100)}%`;
    $(`#guard-${i}`).style.width=`${p.guard}%`; $(`#meter-${i}`).style.width=`${p.meter}%`;
    $(`#hp-${i}`).textContent=number(p.life); $(`#resource-${i}`).textContent=`STAB. ${Math.round(p.r)}`; $(`#super-${i}`).textContent=`FINALE ${Math.round(p.meter)}%`;
    $(`#wins-${i}`).textContent=Array.from({length:s.roundsToWin},(_,n)=>n<s.wins[i]?'●':'○').join(' ');
    $(`#feedback-${i}`).textContent=p.feedbackT>0?p.feedback:active.stats[i].combo>=2?`${active.stats[i].combo} IMPACTS` : '';
  });
  $('#round-time').textContent=Number.isFinite(s.timer)?String(Math.max(0,Math.ceil(s.timer))).padStart(2,'0'):'∞';
  $('#round-label').textContent=active.replay?'REPLAY':`MANCHE ${s.round}`;
  let announcement='';
  if(s.phase==='intro')announcement=`<strong>ACTE ${s.round}</strong><span>${s.introRemaining>.6?'EN PLACE…':'EN SCÈNE !'}</span>`;
  if(s.phase==='roundOver'){
    const draw=!Number.isInteger(s.roundWinner)||s.roundWinner<0;
    announcement=`<strong>${draw?'ÉGALITÉ':escapeHTML(active.fighters[s.roundWinner].name).toUpperCase()}</strong><span>${draw?'ON REJOUE CET ACTE':'REMPORTE LA MANCHE'}</span>`;
  }
  if(announcement!==active.announcement && active.ready){$('#announcement').innerHTML=announcement;active.announcement=announcement;}
  if(active.mode==='training'){
    const p=s.a,m=p.attack?.def;
    $('#training-data').textContent=m?`${m.name} · ${p.attack.t}/${m.startup+m.active+m.recovery} images · dégâts cumulés ${number(active.stats[0].damage)}`:`Dégâts ${number(active.stats[0].damage)} · Impacts ${active.stats[0].hits} · Garde CPU ${active.stats[1].blocked}`;
  }
  if(active.challenge){const value=challengeValue();$('#challenge-bar').value=value;$('#challenge-value').textContent=`${Math.min(value,active.challenge.goal)}/${active.challenge.goal}`;$('#challenge-time').textContent=`${Math.ceil(Math.max(0,60-active.elapsed/60))} s`;}
}
function challengeValue() {return challengeProgress(active.challenge,active.stats[0]);}
function collectEvents(events) {
  const effect=collectMatchStats(active.stats,events,active.engine.state);
  if(effect)sound(effect);
}
function loop(now) {
  requestAnimationFrame(loop);
  const dt=Math.min(.1,Math.max(0,(now-previousTime)/1000)); previousTime=now;
  if(!active||screen!=='fight'||!active.ready)return;
  if(!active.finished&&!active.engine.paused&&!modal.open){
    if(active.engine.state.phase==='roundOver'){
      active.roundDelay+=dt;
      if(active.roundDelay>1.8){active.engine.nextRound();active.roundDelay=0;accumulator=0;controls.clear();}
    }else{
      accumulator+=dt;
      while(accumulator>=FIXED_DT&&!active.finished&&!active.engine.paused&&!modal.open){
        accumulator-=FIXED_DT;
        let inputs;
        if(active.replay){const next=active.replayIterator.next();if(next.done){finishReplay();break;}inputs=next.value;active.replayFrame++;}
        else inputs=controls.poll(active.engine.state.fighters,active.mode==='local');
        if(active.engine.paused||modal.open)break;
        if(!active.replay&&active.mode!=='training'&&active.mode!=='challenge'&&active.recordFrames<72000){appendReplayFrame(active.record.runs,inputs);active.recordFrames++;}
        active.engine.step(FIXED_DT,inputs); collectEvents(active.engine.drainEvents());
        if(active.challenge&&active.engine.state.phase==='fight'){
          active.elapsed++;
          if(challengeValue()>=active.challenge.goal){finishChallenge(true);break;}
          if(active.elapsed>=3600){finishChallenge(false);break;}
        }
        if(active.engine.state.phase==='matchOver'){if(active.replay)finishReplay();else finishMatch();break;}
        if(active.engine.state.phase==='roundOver'){accumulator=0;break;}
      }
    }
  }
  if(!active)return;
  active.renderer.render(active.engine.state,{stage:active.stage,hitboxes:active.showHitboxes,reducedMotion:profile.settings.reducedMotion});updateHUD();
}
function storeReplay() {
  if(!active.recordFrames||active.recordFrames>=72000)return false;
  try{storage.setItem(REPLAY_KEY,JSON.stringify(active.record));return true;}catch{toast('Le replay ne peut pas être conservé dans ce navigateur.');return false;}
}
function finishMatch() {
  if(active.finished)return; active.finished=true;active.engine.pause();controls.clear();const replaySaved=storeReplay();
  const won=active.engine.state.winner===0, stats=active.stats[0];
  // Read the latest profile to preserve results added by another open session.
  refreshStoredProfile();
  profile.stats.matches++;profile.stats[won?'wins':'losses']++;profile.stats.damage+=stats.damage;
  if(active.run&&won){
    if(active.mode==='survival'){active.run.health=Math.max(1,Math.min(10000,active.engine.state.a.life+1200));profile.stats.bestSurvival=Math.max(profile.stats.bestSurvival,active.run.index+1);}
    if(active.run.index===active.run.opponents.length-1)profile.medals=[...new Set([...profile.medals,active.mode])];
  }
  profile.history.unshift({fighter:active.fighters[0].id,opponent:active.fighters[1].id,mode:active.mode,won,at:new Date().toISOString()});profile.history=profile.history.slice(0,12);persist();sound(won?'win':'block');
  const next=won&&active.run&&active.run.index<active.run.opponents.length-1;
  const titleText=active.mode==='local'?`${active.fighters[active.engine.state.winner].name} remporte le duel`:won?'Le public en redemande.':'Un autre numéro t’attend.';
  showDialog(`<span class="ticket-label">${won?'RAPPEL !':'FIN DE L’ACTE'}</span><h2 id="modal-title">${escapeHTML(titleText)}</h2><p class="result-copy">${active.run?`${active.run.index+1}/${active.run.opponents.length} rencontres${active.mode==='survival'&&won?` · Santé au prochain duel : ${number(active.run.health)}`:''}. `:''}${next?'La prochaine scène est prête.':won&&active.run?'Le programme est terminé. Une médaille a été ajoutée au profil.':replaySaved?'Le duel a été enregistré dans les replays locaux.':'Le duel est terminé. Son replay n’a pas pu être conservé.'}</p>${resultStats(stats)}<div class="modal-actions">${next?'<button class="primary" data-action="next-fight">SCÈNE SUIVANTE ↗</button>':'<button class="primary" data-action="rematch">REJOUER</button>'}<button class="secondary" data-action="select-again">Changer d’affiche</button><button class="secondary" data-action="home">Accueil</button></div>`);
}
function resultStats(stat){return `<div class="result-stats"><div><b>${number(stat.damage)}</b>DÉGÂTS</div><div><b>${stat.hits}</b>IMPACTS</div><div><b>${stat.combo}</b>MEILLEUR COMBO</div></div>`;}
function finishChallenge(success){
  active.finished=true;active.engine.pause();controls.clear();
  if(success){refreshStoredProfile();profile.challenges=[...new Set([...profile.challenges,active.challenge.id])];persist();sound('win');}
  showDialog(`<span class="ticket-label">${success?'DÉFI RÉUSSI':'FIN DE LA RÉPÉTITION'}</span><h2 id="modal-title">${escapeHTML(active.challenge.name)}</h2><p class="result-copy">${success?'Objectif atteint. Caine a pris note de ta performance.':'Le temps est écoulé. Consulte les techniques et essaie une nouvelle approche.'}</p>${resultStats(active.stats[0])}<div class="modal-actions"><button class="primary" data-action="rematch">Réessayer</button><button class="secondary" data-action="challenges">Autres défis</button><button class="secondary" data-action="home">Accueil</button></div>`);
}
function finishReplay(){active.finished=true;active.engine.pause();showDialog(`<span class="ticket-label">ARCHIVES DU SPECTACLE</span><h2 id="modal-title">Fin du replay</h2><p class="result-copy">${number(active.replayFrame)} images rejouées avec la graine et les commandes du duel. Cette lecture n’ajoute aucun résultat au profil.</p><div class="modal-actions"><button class="primary" data-action="repeat-replay">Revoir</button><button class="secondary" data-action="home">Accueil</button></div>`);}
function pauseGame(reason=''){
  if(!active||active.finished||screen!=='fight')return;
  active.engine.pause();controls.clear();accumulator=0;
  showDialog(`<span class="ticket-label">ENTRACTE</span><h2 id="modal-title">Le spectacle attend.</h2><p class="result-copy">${escapeHTML(reason||'Prends ton temps. Le combat est en pause.')}</p><div class="modal-actions"><button class="primary" data-action="resume">Reprendre</button><button class="secondary" data-action="movelist">Techniques</button><button class="secondary" data-action="select-again">Changer d’affiche</button><button class="secondary" data-action="home">Accueil</button></div>`);
}
function resumeGame(){if(!active||active.finished)return;closeDialog();active.engine.pause(false);accumulator=0;previousTime=performance.now();controls.clear();$('#arena')?.focus({preventScroll:true});}
function showMoveList(){
  if(active&&!active.finished)active.engine.pause();controls.clear();
  const fighter=active?.fighters[0]||getFighter(codexId);
  showDialog(`<span class="ticket-label">${escapeHTML(fighter.name)}</span><h2 id="modal-title">Le répertoire</h2>${moveTable(fighter)}<p class="small-note">Le spécial dépend de la direction au moment de la pression. Avant et arrière sont relatifs au rival. La garde haute ne protège pas des coups bas ; une saisie traverse la garde.</p><div class="modal-actions"><button class="primary" data-action="${active&&!active.finished?'resume':'close-modal'}">${active&&!active.finished?'Reprendre':'Fermer'}</button><button class="secondary" data-action="controls">Commandes complètes</button></div>`);
}
function showControls(){
  if(active&&!active.finished)active.engine.pause();controls.clear();
  const p2Keys=profile.settings.layout==='azerty'?[',',';',':']:['M',',','.'];
  showDialog(`<span class="ticket-label">LE CARNET DES RÉPÉTITIONS</span><h2 id="modal-title">Les commandes</h2><div class="keys-grid"><section><h3>Joueur 1</h3><p><kbd>${KEY_LABELS[profile.settings.layout][0]}</kbd> Déplacement / saut / accroupi<br><kbd>J</kbd> Léger · <kbd>K</kbd> Fort · <kbd>↓ J</kbd> Bas<br><kbd>U</kbd> Saisie / déchope<br><kbd>I</kbd> Spécial · <kbd>↓ I</kbd> Spécial bas<br><kbd>Avant I</kbd> Spécial avant<br><kbd>Arrière I</kbd> Spécial arrière<br><kbd>O</kbd> Finale · <kbd>L</kbd> Ressource<br><kbd>Maj gauche</kbd> Garde · <kbd>E</kbd> Dash</p></section><section><h3>Joueur 2 · duel local</h3><p><kbd>↑ ← ↓ →</kbd> Déplacement<br><kbd>B</kbd> ou <kbd>Pavé 1</kbd> Léger<br><kbd>N</kbd> ou <kbd>Pavé 2</kbd> Fort<br><kbd>V</kbd> ou <kbd>Pavé 4</kbd> Saisie<br><kbd>${p2Keys[0]}</kbd> ou <kbd>Pavé 5</kbd> Spécial<br><kbd>${p2Keys[1]}</kbd> ou <kbd>Pavé 6</kbd> Finale<br><kbd>${p2Keys[2]}</kbd> ou <kbd>Pavé 3</kbd> Ressource<br><kbd>Maj droite</kbd> Garde<br><kbd>Ctrl droite</kbd> Dash</p></section><section><h3>Manette standard</h3><p>Stick / croix : déplacement<br>A / × : saut · X / □ : léger<br>Y / △ : fort · B / ○ : spécial<br>LB / L1 : garde · RB / R1 : saisie<br>RT / R2 : dash · L3 : finale · R3 : ressource<br>Start / Options : pause</p></section><section><h3>Pour bien commencer</h3><p>Approche avant de frapper. Un coup qui touche permet certains enchaînements ; une attaque bloquée laisse une ouverture. La finale consomme la jauge indiquée dans les techniques. <kbd>Échap</kbd> met en pause. Les commandes tactiles sont proposées sur les écrans compatibles.</p></section></div><div class="modal-actions"><button class="primary" data-action="${active&&!active.finished?'resume':'close-modal'}">${active&&!active.finished?'Reprendre':'Fermer'}</button></div>`);
}

function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function readSavedReplay(){const raw=storage.getItem(REPLAY_KEY);if(!raw)throw new Error('Termine un duel pour disposer d’un replay.');return validateReplay(JSON.parse(raw),FIGHTERS.map(f=>f.id),STAGES.map(s=>s.id));}
async function replayLast(){try{const replay=readSavedReplay();await startMatch({mode:'versus',replay});}catch(error){toast(error.message);}}
function navigate(next){
  if(active&&!active.finished&&screen==='fight'){
    active.engine.pause();controls.clear();showDialog(`<span class="ticket-label">ENTRACTE</span><h2 id="modal-title">Quitter cette rencontre ?</h2><p class="result-copy">Le duel en cours ne sera pas ajouté au palmarès.</p><div class="modal-actions"><button class="primary" data-action="resume">Reprendre</button><button class="secondary" data-leave="${next}">Quitter le duel</button></div>`);return;
  }
  completeNavigation(next);
}
function completeNavigation(next){closeDialog();active=null;controls.clear();if(next==='codex')renderCodex();else if(next==='archives')renderArchives();else if(next==='settings')renderSettings();else renderHome();}
async function handleClick(event){
  const button=event.target.closest('button');if(!button||button.disabled)return;
  try{
    if(button.dataset.nav){navigate(button.dataset.nav);return;}
    if(button.dataset.leave){completeNavigation(button.dataset.leave);return;}
    if(button.dataset.mode){chooseMode(button.dataset.mode);return;}
    if(button.dataset.challenge){selection.challenge=button.dataset.challenge;selection.mode='challenge';selection.side=0;renderSelect();return;}
    if(button.dataset.side){selection.side=Number(button.dataset.side);renderSelect();return;}
    if(button.dataset.fighter){selection.fighters[selection.side]=button.dataset.fighter;selection.variants[selection.side]='';renderSelect();return;}
    if(button.dataset.stage){selection.stage=button.dataset.stage;renderSelect();return;}
    if(button.dataset.codex){codexId=button.dataset.codex;renderCodex();return;}
    if(button.dataset.practice){selection.fighters[0]=button.dataset.practice;selection.variants[0]='';chooseMode('training');return;}
    if(button.dataset.page){archivePage+=Number(button.dataset.page);renderArchives();return;}
    switch(button.dataset.action){
      case 'start':button.disabled=true;await startMatch();break;
      case 'pause':pauseGame();break;
      case 'resume':resumeGame();break;
      case 'movelist':showMoveList();break;
      case 'controls':showControls();break;
      case 'close-modal':closeDialog();break;
      case 'home':closeDialog();renderHome();break;
      case 'select-again':closeDialog();active=null;renderSelect();break;
      case 'challenges':closeDialog();active=null;renderChallenges();break;
      case 'rematch':await startMatch({mode:active.mode,run:active.mode==='survival'?null:active.run});break;
      case 'next-fight':{const run=active.run;run.index++;await startMatch({mode:active.mode,run});break;}
      case 'reset-training':active.engine.reset();active.engine.setTraining({dummy:$('#training-dummy').value,freeMeter:$('#training-meter').checked,autoheal:$('#training-heal').checked});active.stats=createMatchStats();controls.clear();break;
      case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else await main.requestFullscreen();}catch{toast('Le plein écran n’est pas disponible dans ce navigateur.');}break;
      case 'export-profile':download('Digital_Circus_Encore_Profil.json',profile);break;
      case 'import-profile':$('#import-profile').click();break;
      case 'last-replay':await replayLast();break;
      case 'repeat-replay':await startMatch({mode:'versus',replay:active.replaySource});break;
      case 'export-replay':download('Digital_Circus_Encore_Replay.json',readSavedReplay());break;
      case 'import-replay':$('#import-replay').click();break;
    }
  }catch(error){console.error(error);toast(`Impossible de terminer l’action : ${error.message}`);if(active&&!active.finished)pauseGame('Le jeu a été mis en pause après une erreur.');}
}
document.addEventListener('click',handleClick);
document.addEventListener('change',event=>{
  const target=event.target;
  if(target.dataset.setting){const key=target.dataset.setting;const value=target.type==='checkbox'?target.checked:['seconds','rounds','volume'].includes(key)?Number(target.value):target.value;profile.settings=cleanSettings({...profile.settings,[key]:value});persist();applySettings();return;}
  if(target.id.startsWith('variant-'))selection.variants[Number(target.id.at(-1))]=target.value;
  if(target.id==='select-difficulty'){profile.settings.difficulty=target.value;persist();}
  if(target.id==='archive-filter'){archiveFilter=target.value;archivePage=0;renderArchives();}
  if(target.id.startsWith('training-')&&active){active.engine.setTraining({dummy:$('#training-dummy').value,freeMeter:$('#training-meter').checked,autoheal:$('#training-heal').checked});active.showHitboxes=$('#training-boxes').checked;}
});
let searchTimer;
document.addEventListener('input',event=>{if(event.target.id==='archive-search'){archiveQuery=event.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{archivePage=0;renderArchives();const input=$('#archive-search');input.focus();input.setSelectionRange(input.value.length,input.value.length);},200);}});
modal.addEventListener('cancel',event=>{
  event.preventDefault();
  if(active&&screen==='fight'){
    // Results contain the only continuation controls for a campaign or replay.
    if(!active.finished)resumeGame();
  }else closeDialog();
});
window.addEventListener('blur',()=>{if(active&&screen==='fight'&&!active.finished&&!modal.open)pauseGame('La fenêtre a perdu le focus. Reprends lorsque tu es prêt.');});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active&&!active.finished)pauseGame('Le jeu a été masqué. La rencontre est suspendue.');});
window.addEventListener('message',event=>{if(!embedded||event.source!==window.parent||event.origin!==location.origin)return;if(event.data?.type==='cainos:combat:visibility'&&event.data.active===false){controls.clear();if(active&&!active.finished)pauseGame('La fenêtre de combat a été masquée dans CainOS.');}});
window.addEventListener('storage',event=>{if(event.key===SAVE_KEY&&!profileDirty){profile=readProfile(storage);applySettings();if(screen==='settings')renderSettings();}});
$('#import-profile').addEventListener('change',async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  try{if(file.size>2_000_000)throw new Error('Ce fichier de profil est trop volumineux.');const imported=validateProfile(JSON.parse(await file.text()));showDialog('<span class="ticket-label">PROFIL IMPORTÉ</span><h2 id="modal-title">Remplacer ce profil local ?</h2><p class="result-copy">Les réglages et le palmarès de ce navigateur seront remplacés par ceux du fichier choisi.</p><div class="modal-actions"><button class="primary" id="confirm-import">Importer ce profil</button><button class="secondary" data-action="close-modal">Annuler</button></div>');$('#confirm-import').addEventListener('click',()=>{profile=imported;persist();applySettings();closeDialog();renderSettings();toast('Profil importé.');},{once:true});}catch(error){toast(error.message);}
});
$('#import-replay').addEventListener('change',async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  try{if(file.size>2_000_000)throw new Error('Ce replay est trop volumineux.');const replay=validateReplay(JSON.parse(await file.text()),FIGHTERS.map(f=>f.id),STAGES.map(s=>s.id));await startMatch({mode:'versus',replay});}catch(error){toast(error.message);}
});
// A read-only view enables QA without injecting commands into game logic.
window.Encore=Object.freeze({version:GAME_VERSION,get screen(){return screen;},get ready(){return active?.ready||false;},get paused(){return active?.engine.paused||false;},get snapshot(){return active?.engine.getSnapshot()||null;},get stats(){return active?JSON.parse(JSON.stringify(active.stats.map(s=>({...s,unique:[...s.unique]})))):null;},get profile(){return JSON.parse(JSON.stringify(profile));}});
applySettings();renderHome();requestAnimationFrame(loop);
