import { FIGHTERS, STAGES, VARIANTS, ARCHIVE, MOVE_SLOTS, SLOT_LABELS, getFighter, getReplayFighter, getStage } from './data.mjs';
import { getFidelitySources } from './fidelity.mjs';
import { CombatEngine, FIXED_DT } from './engine.mjs';
import { CombatRenderer, drawPortrait } from './render.mjs';
import { InputController } from './input.mjs';
import { BINDING_ACTIONS, DEFAULT_BINDINGS, rebindAction, formatBinding, keyLabel } from './bindings.mjs';
import { createProgram, programEncounter, recordProgramResult, retryProgram } from './progression.mjs';
import { STORY_NOTICE, getStoryRoute, getStoryEnding } from './stories.mjs';
import { createStoryPresentation, stepStoryPresentation, skipStoryPresentation, storyPresentationMarkup, paintStoryPresentation } from './story-presentation.mjs';
import { CombatAudio } from './audio.mjs';
import { FINISHER_CATALOG, FINISHER_NOTICE } from './finisher-catalog.mjs';
import { selectMatchFinisher } from './finishers.mjs';
import { FinisherGallery } from './finisher-gallery.mjs';
import { TrainingLab } from './training.mjs';
import { OfflineGame } from './offline.mjs';
import { GAME_VERSION, REPLAY_VERSIONS, replayRulesVersion, SAVE_KEY, REPLAY_KEY, MODES, CHALLENGES, readProfile, saveProfile, validateProfile, cleanSettings, appendReplayFrame, validateReplay, replayInputs, createMatchStats, collectMatchStats, challengeProgress } from './session.mjs';

const $ = selector => document.querySelector(selector);
const main = $('#main'), modal = $('#modal');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => Math.round(Number(value) || 0).toLocaleString('fr-FR');
const embedded = new URLSearchParams(location.search).get('embedded') === '1' && window.parent !== window;
const reducedMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let storage;
try { storage = localStorage; } catch { storage = { getItem: () => null, setItem: () => { throw new Error('Stockage indisponible'); } }; }
let profile = readProfile(storage);
let profileDirty = false;
let screen = 'home', active = null, selection = { mode:'versus', fighters:['pomni','jax'], side:0, stage:STAGES[0].id, variants:['',''], challenge:CHALLENGES[0].id };
let codexId = 'pomni', archiveQuery = '', archivePage = 0, archiveFilter = 'all', previousTime = 0, accumulator = 0, toastTimer;
let currentObserver, bindingCapture = null, osVisible = true, storyReader = null, finisherGallery = null;
const PROGRAM_MODES = ['arcade', 'boss', 'survival', 'story', 'tournament'];
const audio = new CombatAudio({ getSettings: () => profile.settings });
const offline = new OfflineGame(() => updateOfflinePanel());
document.body.classList.toggle('embedded', embedded);
if (embedded) $('#session-label').textContent = 'SESSION CAINOS';
if (new URLSearchParams(location.search).get('standalone') === '1') $('#os-link').hidden = true;
const controls = new InputController({ enabled: () => !!active && screen === 'fight' && !modal.open && !active.finished, getBindings: () => profile.settings.bindings, onPause: () => pauseGame(), onHelp: () => showControls(), onNavigate: action => navigateMenu(action) });
const binding = (action, player = 0) => formatBinding(profile.settings.bindings, player, action, profile.settings.layout);
function moveLabel(slot) {
  const special = binding('special'), down = binding('down');
  return ({ low: down + ' + ' + binding('light'), specialDown: down + ' + ' + special, specialForward: 'Avant + ' + special, specialBack: 'Arrière + ' + special })[slot] || binding(slot);
}

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
    const latest = validateProfile(JSON.parse(raw), { strictProgram: false });
    latest.settings = profile.settings;
    profile = latest;
  } catch { /* The current session remains playable and exportable. */ }
}
function applySettings() {
  document.body.classList.toggle('reduced-motion', profile.settings.reducedMotion);
  if (active) active.showHitboxes = profile.settings.hitboxes;
  syncAudio();
}
function syncAudio() {
  audio.setTheme(active && screen === 'fight' ? active.stage.id : 'menu');
  audio.setPaused(document.hidden || !osVisible || !!(active && screen === 'fight' && active.engine.paused && !active.finished));
}
function sound(kind) { audio.play(kind); }
function setScreen(next) {
  const changed = screen !== next;
  screen = next; currentObserver?.disconnect();
  main.classList.toggle('combat-main', next === 'fight');
  document.querySelectorAll('.masthead [data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === next || b.dataset.nav === 'home' && ['select','fight','challenges'].includes(next)));
  if (next !== 'fight') main.scrollIntoView({ block:'start' });
  if (changed && next !== 'fight') queueMicrotask(() => main.focus({ preventScroll: true }));
  syncAudio();
}
function showDialog(content, { story = false, finale = false } = {}) { finisherGallery?.dispose(); finisherGallery = null; modal.classList.toggle('finisher-preview-dialog', finale); modal.classList.remove('wardrobe-dialog'); modal.classList.toggle('story-reader', story); if (!story) storyReader = null; $('#modal-content').innerHTML = content; if (!modal.open) modal.showModal(); else modal.querySelector('button:not(:disabled)')?.focus(); syncAudio(); }
function closeDialog() { finisherGallery?.dispose(); finisherGallery = null; modal.classList.remove('finisher-preview-dialog'); bindingCapture = null; storyReader = null; modal.classList.remove('wardrobe-dialog', 'story-reader'); modal.close(); }
function title(eyebrow, heading, description='') { return `<div class="page-title"><span class="ticket-label">${escapeHTML(eyebrow)}</span><h1>${escapeHTML(heading)}</h1>${description ? `<p>${escapeHTML(description)}</p>` : ''}</div>`; }
async function paintPortrait(canvas) {
  const item = ARCHIVE.find(f => f.id === canvas.dataset.portrait) || getFighter(canvas.dataset.portrait);
  // Full combat definitions provide the animated original appearance.
  const fighter = FIGHTERS.find(f => f.id === item.id) || item;
  try {
    if (!await drawPortrait(canvas, fighter)) throw new Error('Portrait indisponible');
  } catch { canvas.setAttribute('aria-label', `${fighter.name} — illustration indisponible`); }
}
function portraits() {
  const nodes = main.querySelectorAll('canvas[data-portrait]');
  const load = canvas => { void paintPortrait(canvas); };
  if ('IntersectionObserver' in window) {
    currentObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { load(entry.target); currentObserver.unobserve(entry.target); } }), { rootMargin:'160px' });
    nodes.forEach(node => currentObserver.observe(node));
  } else nodes.forEach(load);
}
function portraitMarkup(id, className='', width=200, height=230) { return `<canvas class="${className}" width="${width}" height="${height}" data-portrait="${escapeHTML(id)}" role="img" aria-label="${escapeHTML(FIGHTERS.find(f=>f.id===id)?.name || ARCHIVE.find(f=>f.id===id)?.name || id)}"></canvas>`; }

function renderHome() {
  active = null; controls.clear(); setScreen('home');
  main.innerHTML = `<section class="hero"><div class="hero-copy"><span class="ticket-label">CAINOS PRÉSENTE · ENTRÉE LIBRE</span><h1>LE SPECTACLE<em>RECOMMENCE.</em></h1><p>Les mêmes visages. De nouvelles rivalités.<br>Entre dans l’arène et invente ton prochain grand numéro.</p><div class="hero-bottom"><button class="primary" data-mode="versus">ENTRER EN SCÈNE &nbsp; ↗</button><div class="hero-stats"><span><b>${FIGHTERS.length}</b>ARTISTES</span><span><b>${STAGES.length}</b>ARÈNES</span><span><b>${MODES.length}</b>MODES</span></div></div></div><div class="hero-poster" aria-label="Pomni contre Jax"><span class="poster-title">THE AMAZING DIGITAL CIRCUS</span><span class="poster-star a" aria-hidden="true">✧</span><span class="poster-star b" aria-hidden="true">✦</span>${portraitMarkup('pomni','poster-art first',300,350)}${portraitMarkup('jax','poster-art second',300,350)}<span class="poster-vs">VS</span><span class="poster-badge">LE GRAND DUEL</span></div></section>
    ${checkpointBanner()}<section aria-labelledby="modes-title"><div class="section-heading"><h2 id="modes-title">Choisis ton numéro</h2><span>LE RIDEAU NE TOMBE JAMAIS</span></div><div class="modes-grid">${MODES.map(m=>`<button class="mode-card" data-mode="${m.id}"><span class="eyebrow">${m.eyebrow}</span><span class="mode-icon" aria-hidden="true">${m.icon}</span><h3>${m.name}</h3><p>${m.description}</p><span class="card-label">${m.label}</span><span class="mode-arrow" aria-hidden="true">↗</span></button>`).join('')}<div class="mode-card replay-card"><span class="eyebrow">LES ARCHIVES DU SPECTACLE</span><span class="mode-icon" aria-hidden="true">▷</span><h3>Revoir la dernière scène</h3><p>Ton dernier duel enregistré, image par image.</p><div class="replay-actions"><button data-action="last-replay">Revoir</button><button data-action="import-replay">Importer</button><button data-action="export-replay">Exporter</button></div></div></div></section>`;
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
  const single = [...PROGRAM_MODES,'challenge'].includes(selection.mode);
  const challenge = CHALLENGES.find(c=>c.id===selection.challenge);
  const previewStage = getStage(selection.mode==='story' ? getStoryRoute(selected[0].id)?.chapters[0]?.stageId : selection.stage);
  main.innerHTML = `${title(mode.eyebrow,selection.mode==='challenge'?challenge.name:'Qui entre en scène ?',selection.mode==='challenge'?challenge.text:mode.description)}
    <div class="pick-header"><h2>Les artistes</h2><div class="pick-side"><button data-side="0" class="${selection.side===0?'active':''}">JOUEUR 1</button>${single?'':`<button data-side="1" class="${selection.side===1?'active':''}">${selection.mode==='local'?'JOUEUR 2':'ADVERSAIRE'}</button>`}</div></div>
    <div class="roster">${FIGHTERS.map(f=>`<button class="fighter-card ${selection.fighters[0]===f.id?'selected':''} ${!single&&selection.fighters[1]===f.id?'rival':''}" data-fighter="${f.id}" aria-label="Choisir ${escapeHTML(f.name)}" aria-pressed="${selection.fighters[selection.side]===f.id}">${portraitMarkup(f.id)}<strong>${escapeHTML(f.name)}</strong><small>${escapeHTML(f.role)}</small>${selection.fighters[0]===f.id?'<span class="fighter-chip">J1</span>':!single&&selection.fighters[1]===f.id?'<span class="fighter-chip p2">J2</span>':''}</button>`).join('')}</div>
    <div class="selection-summary">${selectionArtist(0)}<div class="selection-vs" aria-hidden="true">VS</div>${single?`<div class="selection-program"><h3>${selection.mode==='arcade'?'Les six actes':selection.mode==='boss'?'Les anomalies':selection.mode==='survival'?'Dix vagues':selection.mode==='story'?'Quatre chapitres':selection.mode==='tournament'?'La coupe du cirque':'Le mannequin'}</h3><p>Une succession de défis préparée par Caine.</p></div>`:selectionArtist(1)}</div>
    ${selection.mode==='story'?storyLibraryMarkup(selected[0].id):''}<div class="selection-controls"><label class="field"><span>APPARENCE JOUEUR 1</span><select id="variant-0">${variantOptions(0)}</select></label>${single?'':`<label class="field"><span>APPARENCE ${selection.mode==='local'?'JOUEUR 2':'ADVERSAIRE'}</span><select id="variant-1">${variantOptions(1)}</select></label>`}<label class="field"><span>DIFFICULTÉ CPU</span><select id="select-difficulty">${[['easy','Détente'],['normal','Équilibrée'],['hard','Exigeante']].map(([id,name])=>`<option value="${id}" ${profile.settings.difficulty===id?'selected':''}>${name}</option>`).join('')}</select></label><button class="primary" data-action="start">LEVER LE RIDEAU ↗</button></div>
    <div class="section-heading"><h2>Le décor</h2><span>${selection.mode==='story'?'LES SCÈNES SUIVENT L’HISTOIRE':PROGRAM_MODES.includes(selection.mode)?'DÉCOR DU PREMIER DUEL':'ARÈNES SANS DANGER ALÉATOIRE'}</span></div><div class="stages">${STAGES.map((stage,i)=>`<button class="stage-card ${previewStage.id===stage.id?'selected':''}" data-stage="${stage.id}" ${selection.mode==='story'?'disabled':''} aria-pressed="${previewStage.id===stage.id}" style="--stage-color:${stage.palette.accent}"><b>${escapeHTML(stage.name)}</b><span>SCÈNE ${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div><section class="stage-preview" aria-labelledby="stage-preview-title"><canvas id="stage-preview" role="img" aria-label="Aperçu : ${escapeHTML(previewStage.name)}" data-stage-preview="${previewStage.id}"></canvas><div><span class="eyebrow">${selection.mode==='story'?'PREMIER CHAPITRE':'PROCHAINE SCÈNE'}</span><h3 id="stage-preview-title">${escapeHTML(previewStage.name)}</h3><p>${escapeHTML(previewStage.description)}</p>${fidelityDetails(previewStage.fidelity,'Repères du décor','stage-fidelity')}</div></section><p class="small-note">Les apparences proviennent des archives de CainOS. Les capacités et leurs valeurs sont des adaptations pour le combat. Les anciens membres et formes abstraites sont des adversaires simulés dans ce mode libre.</p>`;
  new CombatRenderer($('#stage-preview')).render(null,{stage:previewStage,reducedMotion:true});
  portraits();
}
function variantOptions(side) {
  return `<option value="">Apparence originale</option>` + VARIANTS.filter(v=>v.fighterId===selection.fighters[side]).map(v=>`<option value="${v.id}" ${selection.variants[side]===v.id?'selected':''}>${escapeHTML(v.name)} · archive</option>`).join('');
}
function selectionArtist(side) {
  const fighter = getFighter(selection.fighters[side]);
  const appearance = VARIANTS.find(v=>v.id===selection.variants[side] && v.fighterId===fighter.id) || fighter;
  return `<div class="selected-artist" data-selection-artist="${side}" data-appearance-id="${appearance.id}">${portraitMarkup(appearance.id,'selected-portrait',240,280)}<div><span class="eyebrow">${side===0?'JOUEUR 1':selection.mode==='local'?'JOUEUR 2':'ADVERSAIRE'}</span><h3>${escapeHTML(fighter.name)}</h3><p class="selected-costume">${escapeHTML(appearance===fighter?'Apparence originale':appearance.name)}</p><p>${escapeHTML(fighter.role)} · 10 techniques</p><button class="text-button" data-appearance="${appearance.id}" aria-label="Comparer l’apparence de ${escapeHTML(fighter.name)}">Voir la tenue ↗</button></div></div>`;
}
function refreshSelectionArtist(side) {
  const current = main.querySelector(`[data-selection-artist="${side}"]`);
  if (!current) return;
  const previousCanvas = current.querySelector('canvas');
  if (previousCanvas) currentObserver?.unobserve(previousCanvas);
  current.outerHTML = selectionArtist(side);
  const target = main.querySelector(`[data-selection-artist="${side}"] canvas`);
  if (target) void paintPortrait(target);
}
function costume(fighter, id) {
  const variant = VARIANTS.find(v=>v.id===id && v.fighterId===fighter.id);
  return variant ? { ...fighter, sprite:variant.sprite, animation:variant.animation || null, visual:{...fighter.visual,...variant.visual}, costume:id } : fighter;
}
async function showAppearance(id, restoreSelect=false) {
  const variant = VARIANTS.find(v=>v.id===id);
  const fighter = variant ? getFighter(variant.fighterId) : FIGHTERS.find(f=>f.id===id);
  if (!fighter) return;
  const appearance = variant || fighter;
  const choices = [fighter,...VARIANTS.filter(v=>v.fighterId===fighter.id)];
  showDialog(`<span class="ticket-label">LA GARDE-ROBE</span><h2 id="modal-title">Les apparences de ${escapeHTML(fighter.name)}</h2><label class="field wardrobe-field"><span>APPARENCE À COMPARER</span><select id="wardrobe-variant">${choices.map(item=>`<option value="${item.id}" ${item.id===appearance.id?'selected':''}>${escapeHTML(item===fighter?'Apparence originale':item.name)}</option>`).join('')}</select></label><div class="wardrobe-labels"><span>Apparence originale</span><span>${escapeHTML(variant?.name || 'Apparence originale')}</span></div><canvas id="wardrobe-preview" data-appearance-id="${appearance.id}" role="img" aria-label="Comparaison à la même échelle : ${escapeHTML(fighter.name)} et ${escapeHTML(variant?.name || 'son apparence originale')}"></canvas><p id="wardrobe-load" class="small-note" role="status">Préparation des illustrations…</p><p class="small-note">Les deux apparences sont montrées à l’échelle utilisée dans l’arène. Changer de tenue conserve les mêmes techniques.</p>${fidelityDetails(appearance.fidelity,'Repères de cette apparence','costume-fidelity')}${costumeReviewDetails(appearance.fidelity?.assetReview)}<div class="modal-actions"><button class="primary" data-try-appearance="${appearance.id}">Essayer en entraînement</button><button class="secondary" data-action="close-modal">Fermer</button></div>`);
  modal.classList.add('wardrobe-dialog');
  if (restoreSelect) $('#wardrobe-variant')?.focus({preventScroll:true});
  const target = $('#wardrobe-preview'), message = $('#wardrobe-load');
  const fighters = [fighter,costume(fighter,variant?.id || '')], stage = getStage('training');
  const renderer = new CombatRenderer(target);
  const preview = new CombatEngine({fighters,stage,mode:'training',cpu:[false,false],difficulty:'normal',seed:0,roundTime:90,roundsToWin:1});
  const loaded = await renderer.preload(fighters,[stage]);
  if (!target.isConnected) return;
  renderer.render(preview.state,{stage,reducedMotion:true});
  message.textContent = loaded.errors.length ? 'Une illustration est indisponible. Vérifie la connexion ou le pack d’illustrations, puis recharge le jeu.' : '';
}
function fidelityDetails(record, label, className='') {
  if (!record) return '';
  const references = getFidelitySources(record.sourceIds);
  return `<details class="fidelity-details ${className}"><summary>${escapeHTML(label)}</summary><div class="fidelity-copy"><p class="small-note fidelity-review-status">${escapeHTML(record.reviewStatus || '')}</p>${record.observedTraits?.length ? `<ul>${record.observedTraits.map(trait=>`<li>${escapeHTML(trait)}</li>`).join('')}</ul>` : ''}<p><strong>Dans Encore.</strong> ${escapeHTML(record.combatAdaptation)}</p><p class="fidelity-scope">${escapeHTML(record.reviewScope)}</p>${references.length ? `<ul class="fidelity-sources" aria-label="Sources de référence">${references.map(source=>`<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul>` : ''}</div></details>`;
}
function costumeReviewDetails(review) {
  if (!review) return '';
  const fields = [['Identité',review.identityEvidence],['Cadrage',review.framing],['Fond et détourage',review.transparency],['Proportions',review.proportions]];
  return `<details class="fidelity-details costume-review"><summary>État de cette illustration</summary><div class="fidelity-copy"><p>${escapeHTML(review.status)}</p><ul>${review.visibleTraits.map(trait=>`<li>${escapeHTML(trait)}</li>`).join('')}</ul>${fields.map(([label,value])=>`<p><strong>${label}.</strong> ${escapeHTML(value)}</p>`).join('')}${review.issues.length ? `<p><strong>Éléments à améliorer.</strong></p><ul>${review.issues.map(issue=>`<li>${escapeHTML(issue)}</li>`).join('')}</ul>` : ''}</div></details>`;
}
function moveTable(fighter) {
  return `<div class="scroll-table"><table class="move-table"><thead><tr><th>COMMANDE J1</th><th>TECHNIQUE / EFFET</th><th>DÉBUT · ACTIVE · FIN</th><th>DÉGÂTS</th></tr></thead><tbody>${MOVE_SLOTS.map(slot=>{const m=fighter.moves[slot];return `<tr><td><kbd>${escapeHTML(moveLabel(slot))}</kbd><small>${SLOT_LABELS[slot]}</small></td><td><strong>${escapeHTML(m.name)}</strong><small>${escapeHTML(m.description)}${m.cost?` · Stabilité : ${m.cost}`:''}${m.meter?` · Finale : ${m.meter}%`:''}</small>${fidelityDetails(m.fidelity,'Inspiration et adaptation','move-fidelity')}</td><td>${m.startup} · ${m.active} · ${m.recovery}<small>images à 60 Hz</small></td><td>${number(m.damage)}</td></tr>`;}).join('')}</tbody></table></div>`;
}
function renderCodex() {
  setScreen('codex'); const fighter=getFighter(codexId);
  main.innerHTML=`${title('LE PROGRAMME','Les artistes et leurs techniques','Chaque combattant possède ses dix techniques, une ressource de stabilité et un grand final. Les dégâts ci-dessous précèdent les modificateurs de puissance, de combo et de garde.')}<div class="codex-layout"><aside class="codex-list" aria-label="Liste des combattants">${FIGHTERS.map(f=>`<button data-codex="${f.id}" class="${f.id===codexId?'active':''}">${portraitMarkup(f.id,'',100,120)}<span><strong>${escapeHTML(f.name)}</strong><small>${escapeHTML(f.role)}</small></span></button>`).join('')}</aside><section><div class="codex-head">${portraitMarkup(fighter.id)}<div><span class="eyebrow">${escapeHTML(fighter.role)}</span><h2>${escapeHTML(fighter.name)}</h2><p>${escapeHTML(fighter.title)}<br>Vie : 10 000 · Puissance ×${fighter.power} · Vitesse ×${fighter.speed}</p><button class="secondary" data-practice="${fighter.id}">Répéter avec ${escapeHTML(fighter.name)}</button><button class="secondary" data-finale-fighter="${fighter.id}">Les trois finales de spectacle</button></div></div>${fidelityDetails(fighter.fidelity,`Repères de ${fighter.name}`,'fighter-fidelity')}${moveTable(fighter)}<p class="small-note">Enchaînements sur touche confirmée : léger → fort ; bas → spécial ; fort → spécial avant. Les projectiles, boucliers, parades et déplacements varient selon l’artiste. Le labo permet de voir les zones de contact.</p><p class="small-note">Les techniques sont des créations pour le jeu. Leurs fiches indiquent les repères visuels et les références qui ont servi à leur adaptation.</p></section></div>`;
  portraits();
}
async function showFinisherGallery(fighterId, finisherId = '', variantId = '') {
  const base = getFighter(fighterId);
  const choices = FINISHER_CATALOG.filter(item => item.fighterId === base.id);
  const definition = choices.find(item => item.id === finisherId) || choices[0];
  if (!definition) throw new Error('Aucune finale pour cet artiste.');
  const costumes = VARIANTS.filter(item => item.fighterId === base.id);
  const selectedCostume = costumes.some(item => item.id === variantId) ? variantId : '';
  const fighter = costume(base, selectedCostume);
  const opponent = FIGHTERS.find(item => item.id !== base.id);
  const stage = getStage(selection.stage);
  showDialog('<span class="ticket-label">LES FINALES DE SPECTACLE</span><h2 id="modal-title">' + escapeHTML(base.name) + '</h2>' +
    '<p class="small-note">' + escapeHTML(FINISHER_NOTICE) + '</p>' +
    '<div class="finale-choices" aria-label="Choisir une finale">' + choices.map(item => '<button class="secondary" data-finale-id="' + item.id + '" data-finale-artist="' + base.id + '" aria-pressed="' + (item.id === definition.id) + '">' + escapeHTML(item.title) + '</button>').join('') + '</div>' +
    '<label class="finale-costume">Tenue <select id="finale-costume"><option value="">Apparence originale</option>' + costumes.map(item => '<option value="' + item.id + '"' + (selectedCostume === item.id ? ' selected' : '') + '>' + escapeHTML(item.name) + '</option>').join('') + '</select></label>' +
    '<canvas id="finale-preview" width="1280" height="720" role="img" aria-label="' + escapeHTML(definition.title + ' — aperçu sans combat ni récompense.') + '"></canvas>' +
    '<div class="finale-reader-copy" aria-live="polite"><h3 id="finale-beat-title">Préparation de la scène…</h3><p id="finale-beat-copy"></p></div>' +
    '<div class="modal-actions"><button class="primary" data-action="finale-toggle">Pause</button><button class="secondary" data-action="finale-replay">Rejouer la scène</button><button class="secondary" data-action="close-modal">Fermer</button></div>', { finale: true });
  const view = new FinisherGallery({ canvas: $('#finale-preview'), fighters: [fighter, opponent], stage, definition,
    onChange: value => {
      if (finisherGallery !== view || !modal.open) return;
      $('#finale-beat-title').textContent = value.beat?.title || definition.title;
      $('#finale-beat-copy').textContent = value.beat?.description || '';
      const button = $('[data-action="finale-toggle"]');
      button.textContent = value.done ? 'Revoir la scène' : value.playing ? 'Pause' : 'Continuer';
      button.setAttribute('aria-pressed', String(!value.playing));
    } });
  finisherGallery = view;
  const result = await view.prepare();
  if (finisherGallery !== view || !modal.open) return;
  if (result?.errors?.length) toast('Certaines illustrations de cet aperçu sont indisponibles.');
  view.tick(performance.now(), { reducedMotion: profile.settings.reducedMotion || reducedMotionPreference.matches });
  $('[data-finale-id="' + definition.id + '"]')?.focus({ preventScroll: true });
}
function renderArchives() {
  setScreen('archives');
  const matching = ARCHIVE.filter(item=>(`${item.name} ${item.id}`.toLocaleLowerCase('fr').includes(archiveQuery.toLocaleLowerCase('fr'))) && (archiveFilter==='all'||archiveFilter==='playable'&&FIGHTERS.some(f=>f.id===item.id)||archiveFilter==='variant'&&VARIANTS.some(v=>v.id===item.id)||archiveFilter==='archive'&&!FIGHTERS.some(f=>f.id===item.id)&&!VARIANTS.some(v=>v.id===item.id)));
  const pages=Math.max(1,Math.ceil(matching.length/24)); archivePage=Math.min(archivePage,pages-1);
  main.innerHTML=`${title('LA MÉMOIRE DU CIRQUE','Les archives de CainOS',`${ARCHIVE.length} apparences inventoriées, dont ${FIGHTERS.length} combattants et ${VARIANTS.length} variantes d’apparence. Les fiches d’archive ne deviennent pas automatiquement des combattants.`)}<div class="toolbar"><input type="search" id="archive-search" value="${escapeHTML(archiveQuery)}" placeholder="Chercher un personnage ou une variante…" aria-label="Rechercher dans les archives"><select id="archive-filter" aria-label="Filtrer les archives">${[['all','Toutes les apparences'],['playable','Combattants jouables'],['variant','Costumes de combattants'],['archive','Archives à adapter']].map(([id,name])=>`<option value="${id}" ${archiveFilter===id?'selected':''}>${name}</option>`).join('')}</select><span class="small-note">${matching.length} résultats</span></div><div class="archive-grid">${matching.slice(archivePage*24,archivePage*24+24).map(item=>`<article class="archive-card" data-archive-id="${item.id}">${portraitMarkup(item.id)}<h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.provenance)}</p><span class="badge ${FIGHTERS.some(f=>f.id===item.id)?'success':''}">${FIGHTERS.some(f=>f.id===item.id)?'COMBATTANT':VARIANTS.some(v=>v.id===item.id)?'APPARENCE':'ARCHIVE'}</span>${item.baseFighterId?`<button class="text-button archive-appearance" data-appearance="${item.id}" aria-label="Voir ${escapeHTML(item.name)} dans la garde-robe">Voir la tenue ↗</button>`:''}</article>`).join('')||'<p class="empty-state">Aucune apparition ne correspond à cette recherche.</p>'}</div><div class="toolbar"><button class="secondary" data-page="-1" ${archivePage===0?'disabled':''}>← Précédent</button><span class="small-note">Page ${archivePage+1} / ${pages}</span><button class="secondary" data-page="1" ${archivePage===pages-1?'disabled':''}>Suivant →</button></div>`;
  portraits();
}
function renderSettings() {
  setScreen('settings'); const s=profile.settings;
  const select=(key,values)=>`<select data-setting="${key}">${values.map(([v,label])=>`<option value="${v}" ${String(s[key])===String(v)?'selected':''}>${label}</option>`).join('')}</select>`;
  const check=key=>`<input type="checkbox" data-setting="${key}" ${s[key]?'checked':''}>`;
  main.innerHTML=`${title('EN COULISSES','Les règles de ton spectacle','Le profil conserve tes réglages, tes résultats et le prochain duel de ton parcours. CainOS et la version autonome partagent ce profil sur le même site.')}
  <div class="settings-grid">
    <section class="settings-block"><h2>Combat et commandes</h2>
      <label class="settings-row">Disposition clavier ${select('layout',[['azerty','AZERTY'],['qwerty','QWERTY']])}</label>
      <label class="settings-row">Difficulté CPU ${select('difficulty',[['easy','Détente'],['normal','Équilibrée'],['hard','Exigeante']])}</label>
      <label class="settings-row">Durée d’une manche ${select('seconds',[[60,'60 secondes'],[90,'90 secondes'],[120,'120 secondes']])}</label>
      <label class="settings-row">Manches gagnantes ${select('rounds',[[1,'1 manche'],[2,'2 manches'],[3,'3 manches']])}</label>
      <label class="settings-row">Commandes tactiles ${select('touch',[['auto','Automatiques'],['on','Toujours visibles'],['off','Masquées']])}</label>
      <button class="text-button" data-action="controls">Afficher toutes les commandes ↗</button>
      <p class="small-note">Les parcours fixent leurs règles au départ et se jouent en une manche gagnante. Deux manettes standard sont prises en charge. Dans les menus : croix ou stick, A pour choisir, B pour revenir.</p>
    </section>
    <section class="settings-block"><h2>Confort du spectacle</h2>
      <label class="settings-row">Effets sonores ${check('sound')}</label>
      <label class="settings-row">Volume des effets <input type="range" min="0" max="1" step="0.05" value="${s.volume}" data-setting="volume" aria-label="Volume des effets"></label>
      <label class="settings-row">Musique des arènes ${check('music')}</label>
      <label class="settings-row">Volume de la musique <input type="range" min="0" max="1" step="0.05" value="${s.musicVolume}" data-setting="musicVolume" aria-label="Volume de la musique"></label>
      <label class="settings-row">Ambiance des arènes ${check('ambience')}</label>
      <label class="settings-row">Volume de l’ambiance <input type="range" min="0" max="1" step="0.05" value="${s.ambienceVolume}" data-setting="ambienceVolume" aria-label="Volume de l’ambiance"></label>
      <label class="settings-row">Finales après un KO ${check('finishers')}</label>
      <label class="settings-row">Réduire les mouvements ${check('reducedMotion')}</label>
      <label class="settings-row">Afficher les zones de contact ${check('hitboxes')}</label>
      <p class="small-note">Douze thèmes et douze ambiances originales accompagnent les arènes, avec des volumes séparés. Les finales peuvent être passées immédiatement ; la réduction des mouvements en montre une composition fixe.</p>
      <button class="secondary" data-mode="training">Ouvrir les répétitions</button>
    </section>
    <section class="settings-block"><h2>Ton palmarès · joueur 1</h2>
      ${[['matches','Duels terminés'],['wins','Victoires'],['losses','Défaites'],['bestSurvival','Meilleure série de survie'],['damage','Dégâts cumulés']].map(([key,label])=>`<div class="stats-row">${label}<b>${number(profile.stats[key])}</b></div>`).join('')}
      <div class="stats-row">Défis accomplis <b>${profile.challenges.length}/${CHALLENGES.length}</b></div>
      <div class="stats-row">Histoires terminées <b>${profile.stories.length}/${FIGHTERS.length}</b></div>
      <div class="medals">${PROGRAM_MODES.map(mode=>`<span class="badge ${profile.medals.includes(mode)?'success':''}">${profile.medals.includes(mode)?'✦ ':''}${escapeHTML(MODES.find(m=>m.id===mode).name)}</span>`).join('')}</div>
      ${profile.stories.length?`<p class="small-note">Histoires : ${profile.stories.map(id=>escapeHTML(getFighter(id).name)).join(', ')}.</p>`:''}
    </section>
    <section class="settings-block"><h2>Profil et replays</h2>
      <p class="small-note">Exporte ton profil pour transférer tes touches, ton palmarès et ton parcours en cours. Le duel interrompu recommence à son entrée ; les rencontres déjà gagnées restent acquises.</p>
      <div class="modal-actions"><button class="secondary" data-action="export-profile">Exporter le profil</button><button class="secondary" data-action="import-profile">Importer un profil</button></div>
      <div class="modal-actions"><button class="secondary" data-action="export-replay">Exporter le dernier duel</button><button class="secondary" data-action="import-replay">Lire un replay</button></div>
      <p class="small-note">Les replays conservent les commandes, la graine et les costumes. Versions compatibles : ${REPLAY_VERSIONS.join(', ')}. Chaque enregistrement conserve ses règles de déplacement.</p>
    </section>
    <section class="settings-block offline-block"><h2>Emporter le spectacle</h2>
      <p class="small-note">Télécharge toutes les illustrations pour jouer sans connexion. Ouvre ensuite le raccourci installé ou cette page du jeu directement. Ton navigateur peut libérer ce téléchargement si son stockage manque.</p>
      <p id="offline-status" role="status"></p><progress id="offline-progress" max="1" value="0" aria-label="Illustrations disponibles hors ligne"></progress>
      <div class="modal-actions"><button class="secondary" data-action="offline-retry" hidden>Réessayer le mode hors ligne</button><button class="primary" data-action="offline-prepare">Télécharger le spectacle</button><button class="secondary" data-action="offline-install" hidden>Installer le jeu</button><button class="secondary" data-action="offline-update" hidden>Appliquer la mise à jour</button><button class="text-button" data-action="offline-clear">Libérer les illustrations</button></div>
      <p id="offline-error" class="small-note" role="status"></p>
    </section>
  </div>
  <section class="settings-block binding-block"><div class="section-heading"><h2>Des touches à ta mesure</h2><button class="secondary" data-action="reset-bindings">Rétablir les touches</button></div>
    <p class="small-note">Choisis une case puis appuie sur une touche. Chaque commande peut avoir une alternative ; une touche appartient à un seul joueur. Échap annule, Retour arrière retire une alternative. Les coups bas et spéciaux directionnels combinent ces touches.</p>
    <div class="binding-players">${[0,1].map(player=>`<section><h3>Joueur ${player+1}</h3><div class="binding-list">${BINDING_ACTIONS.map(({id,label})=>`<div class="binding-row"><span>${label}</span>${[0,1].map(slot=>`<button class="secondary" data-bind-player="${player}" data-bind-action="${id}" data-bind-slot="${slot}" aria-label="Joueur ${player+1}, ${label}, ${slot?'alternative':'principale'}">${s.bindings[player][id][slot]?escapeHTML(keyLabel(s.bindings[player][id][slot],s.layout)):'Ajouter…'}</button>`).join('')}</div>`).join('')}</div></section>`).join('')}</div>
  </section>`;
  updateOfflinePanel();
}
function updateOfflinePanel() {
  if (screen !== 'settings' || !$('#offline-status')) return;
  const state = offline.getState();
  $('#offline-status').textContent = !state.supported ? 'Le hors ligne nécessite HTTPS ou localhost et un navigateur compatible.' : !state.ready ? (state.initError ? 'Le mode hors ligne est indisponible. Tu peux réessayer.' : 'Préparation du mode hors ligne…') : state.complete ? 'Spectacle prêt hors ligne · ' + state.cached + ' illustrations.' : (state.busy ? 'Téléchargement : ' : 'Illustrations disponibles : ') + state.cached + '/' + state.total + ' · ' + Math.ceil(state.bytes/1048576) + ' Mo pour le pack complet.';
  $('#offline-progress').max = state.total || 1; $('#offline-progress').value = state.cached;
  $('[data-action="offline-retry"]').hidden = !state.supported || state.ready || !state.initError;
  $('[data-action="offline-retry"]').disabled = state.busy;
  $('[data-action="offline-prepare"]').disabled = !state.ready || state.busy;
  $('[data-action="offline-clear"]').disabled = !state.ready || state.busy;
  $('[data-action="offline-install"]').hidden = !state.installable || embedded;
  $('[data-action="offline-update"]').hidden = !state.update;
  $('[data-action="offline-update"]').disabled = state.busy;
  $('#offline-error').textContent = state.error;
}
function checkpointBanner() {
  const run = profile.program;
  if (!run) return '';
  const encounter = programEncounter(run);
  return `<section class="checkpoint-card" aria-label="Parcours sauvegardé"><div><span class="ticket-label">TON PROCHAIN ACTE</span><h2>${escapeHTML(MODES.find(m=>m.id===run.mode).name)}</h2><p>${escapeHTML(getFighter(run.playerId).name)} · rencontre ${encounter.number}/${encounter.total} · contre ${escapeHTML(getFighter(encounter.opponentId).name)}</p><p class="small-note">Le duel en cours recommence à son entrée. Les victoires précédentes sont conservées.</p></div><button class="primary" data-action="resume-program">REPRENDRE LE PARCOURS ↗</button></section>`;
}

function renderFight() {
  setScreen('fight');
  const f=active.fighters, mode=active.replay?'REPLAY LOCAL':MODES.find(m=>m.id===active.mode)?.name;
  const touch=profile.settings.touch==='on'||profile.settings.touch==='auto'&&matchMedia('(pointer:coarse)').matches;
  main.innerHTML=`<div class="fight-toolbar"><span class="fight-caption">${escapeHTML(mode)} · ${escapeHTML(active.stage.name)}${active.run?` · ${active.run.index+1}/${active.run.opponents.length}`:''}</span><button class="secondary" data-action="pause">Ⅱ Pause</button><button class="secondary" data-action="movelist">Techniques</button><button class="secondary" data-action="controls">Commandes</button>${active.run?.mode==='tournament'?'<button class="secondary" data-action="bracket">Tableau</button>':''}<button class="secondary" data-action="fullscreen">⛶ Plein écran</button></div>${active.mode==='challenge'?`<div class="challenge-progress"><span>${escapeHTML(active.challenge.text)}</span><progress id="challenge-bar" max="${active.challenge.goal}" value="0"></progress><b id="challenge-value">0/${active.challenge.goal}</b><span id="challenge-time">60 s</span></div>`:''}<section class="arena-wrap" aria-label="Arène de combat"><canvas id="arena" width="1280" height="720" tabindex="0" aria-label="Combat. Les commandes sont disponibles au-dessus de l’arène."></canvas><div class="hud">${hudPlayer(f[0],0)}<div class="hud-timer"><span id="round-time">90</span><small id="round-label">MANCHE 1</small></div>${hudPlayer(f[1],1)}</div><div id="announcement" class="fight-announcement" aria-live="polite"></div><div class="fight-bottom"><span id="feedback-0" class="fight-feedback"></span><span id="feedback-1" class="fight-feedback second"></span></div></section>${active.training?trainingMarkup():''}<div class="control-strip"><span>${['left','right','jump','down','light','heavy','special','throw','super','utility'].map(action=>`<kbd>${escapeHTML(binding(action))}</kbd> ${escapeHTML(BINDING_ACTIONS.find(a=>a.id===action).label)}`).join(' · ')}</span><span><kbd>${escapeHTML(binding('guard'))}</kbd> Garde · <kbd>${escapeHTML(binding('dash'))}</kbd> Dash · <kbd>Échap</kbd> Pause</span></div>${touch?touchMarkup():''}`;
  active.renderer=new CombatRenderer($('#arena')); controls.bindTouch(main);
  $('#arena').focus({preventScroll:true}); updateHUD();
}
function trainingMarkup() {
  return `<section class="training-lab" aria-labelledby="training-title"><div class="training-heading"><div><span class="ticket-label">LE LABORATOIRE</span><h2 id="training-title">Répéter, image par image.</h2></div><span id="training-frame" class="small-note"></span></div><div class="training-panel"><label>Mannequin <select id="training-dummy"><option value="idle">Immobile</option><option value="block">Garde haute</option><option value="crouch">Garde basse</option><option value="jump">Sauts</option><option value="after">Garde après impact</option><option value="cpu">CPU</option><option value="playback" disabled>Séquence manuelle</option></select></label><label>Vitesse <select id="training-speed"><option value="1">×1</option><option value="0.5">×0,5</option><option value="0.25">×0,25</option></select></label><label><input type="checkbox" id="training-meter" checked> Finale libre</label><label><input type="checkbox" id="training-resource" checked> Ressource libre</label><label><input type="checkbox" id="training-heal" checked> Soin automatique</label><label><input type="checkbox" id="training-boxes" ${active.showHitboxes?'checked':''}> Zones de contact</label></div><div class="training-actions"><button class="secondary" data-action="training-freeze" aria-pressed="false">Figer</button><button class="secondary" data-action="training-step" disabled>+1 image</button><button class="secondary" data-action="reset-training">Replacer</button><button class="secondary" data-action="training-history">Effacer l’historique</button></div><div class="training-readouts">${[0,1].map(i=>`<div><strong>${i?'Mannequin':'Joueur 1'}</strong><p id="training-readout-${i}"></p></div>`).join('')}</div><p id="training-data" class="training-data"></p><div class="training-recorder"><div><h3>La séquence du mannequin</h3><p>Enregistre jusqu’à 10 secondes : les commandes J1 pilotent le mannequin, J1 reste neutre. Enregistrer ou lire replace les artistes. La lecture suit le côté vers lequel regarde le mannequin.</p></div><div class="training-actions"><button class="secondary" data-action="training-record">Enregistrer</button><button class="secondary" data-action="training-play" disabled>Lire</button><button class="secondary" data-action="training-stop" disabled>Arrêter</button><button class="secondary" data-action="training-clear" disabled>Effacer la séquence</button><label><input type="checkbox" id="training-loop"> En boucle</label></div><p id="training-tape-status" role="status"></p></div><div class="training-histories">${[0,1].map(i=>`<section><h3>Commandes ${i?'du mannequin':'J1'} <small>12 dernières entrées</small></h3><ol id="training-history-${i}"></ol></section>`).join('')}</div></section>`;
}
function sampleLiveInputs() {
  const lab=active.training,actors=active.engine.state.fighters;
  const inputs=controls.poll(lab?.mode==='recording'?[actors[1],actors[0]]:actors,active.mode==='local');
  if(!lab||modal.open||active.engine.paused&&!lab.frozen)return inputs;
  active.engine.setTraining({...lab.settings,dummy:lab.drivesDummy?'playback':lab.settings.dummy});
  return lab.sample(inputs,actors);
}
function resetTraining() {
  if(!active?.training)return;
  const lab=active.training;
  lab.reset();active.engine.reset();active.engine.setTraining(lab.settings);active.engine.pause(lab.frozen);
  active.stats=createMatchStats();accumulator=0;controls.clear();updateHUD();syncAudio();
}
function updateTrainingHUD() {
  if(!active?.training||!$('#training-frame'))return;
  const view=active.training.snapshot(active.engine.state.fighters),lab=active.training;
  $('#training-frame').textContent=`Image ${number(active.engine.state.frame)} · ${view.frozen?'figé':`vitesse ×${String(view.settings.speed).replace('.',',')}`}`;
  const freeze=$('[data-action="training-freeze"]');freeze.textContent=view.frozen?'Reprendre le temps':'Figer';freeze.setAttribute('aria-pressed',String(view.frozen));
  $('[data-action="training-step"]').disabled=!view.frozen;
  $('#training-dummy').value=lab.drivesDummy?'playback':view.settings.dummy;
  $('#training-speed').value=String(view.settings.speed);
  $('[data-action="training-record"]').textContent=view.mode==='recording'?'Terminer l’enregistrement':'Enregistrer';
  $('[data-action="training-play"]').disabled=!view.tapeFrames;
  $('[data-action="training-stop"]').disabled=view.mode==='idle';
  $('[data-action="training-clear"]').disabled=!view.tapeFrames;
  const mode=view.mode==='recording'?'Enregistrement · commandes J1 → mannequin':view.mode==='playback'?`Lecture ${view.loop?'en boucle':'unique'}`:'Séquence prête';
  $('#training-tape-status').textContent=`${view.tapeFrames?mode:'Aucune séquence'} · ${view.tapeFrames}/600 images (${(view.tapeFrames/60).toFixed(1).replace('.',',')} s)${view.mode==='playback'?` · image ${view.cursor}`:''}`;
  view.readouts.forEach((readout,index)=>{$(`#training-readout-${index}`).textContent=`${readout.name} · ${readout.phase}${readout.total?` ${readout.elapsed}/${readout.total}`:''} · ${readout.remaining} image(s) restante(s)${readout.reaction?` · réaction ${readout.reaction}`:''}`;});
  $('#training-data').textContent=`Dégâts ${number(active.stats[0].damage)} · Impacts ${active.stats[0].hits} · Gardes du mannequin ${active.stats[1].blocked}`;
  view.history.forEach((rows,index)=>{const node=$(`#training-history-${index}`),html=rows.length?rows.map(row=>`<li><span>${escapeHTML(row.label)}</span><b>${row.frames} i</b></li>`).join(''):'<li><span>Aucune commande observée</span></li>';if(node.innerHTML!==html)node.innerHTML=html;});
}
function hudPlayer(f,index) { return `<div class="hud-player ${index?'second':''}"><div class="hud-name"><span>${escapeHTML(f.name)}</span><span>${index?active.mode==='local'?'J2':'CPU':'J1'}</span></div><div class="health-track"><div id="health-${index}" class="health-fill"></div></div><div class="guard-track"><div id="guard-${index}" class="guard-fill"></div></div><div class="meter-track"><div id="meter-${index}" class="meter-fill"></div></div><div class="hud-bars-meta"><span id="hp-${index}">10 000</span><span id="resource-${index}">STABILITÉ 100</span><span id="super-${index}">FINALE 0%</span></div><div class="round-pips" id="wins-${index}">○ ○</div></div>`; }
function touchMarkup() {
  const button=(action,label,style='')=>`<button data-control="${action}" class="${style}" aria-label="${escapeHTML(action)}">${label}</button>`;
  return `<div class="touch-controls" aria-label="Commandes tactiles joueur 1"><div class="touch-move"><span></span>${button('jump','↑')}<span></span>${button('left','←')}${button('down','↓')}${button('right','→')}${button('guard','Garde','guard')}${button('dash','Dash')}<span></span></div><div class="touch-buttons">${button('light','Léger')}${button('heavy','Fort')}${button('special','Spéc.','accent')}${button('throw','Saisie')}${button('low','Bas')}${button('utility','Repos')}${button('super','Finale','accent')}${button('tech','Déchope')}</div></div><div class="touch-extra">${button('specialDown','Spécial ↓')}${button('specialForward','Spécial avant')}${button('specialBack','Spécial arrière')}</div>`;
}
function requestStart() {
  if (PROGRAM_MODES.includes(selection.mode) && profile.program) {
    showDialog(`<span class="ticket-label">UN PARCOURS EST EN COURS</span><h2 id="modal-title">Commencer un nouveau programme ?</h2><p class="result-copy">Le point de reprise de ${escapeHTML(getFighter(profile.program.playerId).name)} sera remplacé. Les victoires déjà inscrites au palmarès restent conservées.</p><div class="modal-actions"><button class="primary" data-action="start-new">Commencer ce programme</button><button class="secondary" data-action="resume-program">Reprendre le parcours sauvegardé</button><button class="secondary" data-action="close-modal">Annuler</button></div>`);
    return;
  }
  return startMatch();
}
async function startMatch(options={}) {
  closeDialog(); controls.clear();
  const mode = options.mode || selection.mode;
  const run = options.replay ? null : options.run || (PROGRAM_MODES.includes(mode) ? createProgram(mode,selection.fighters[0],FIGHTERS,STAGES,{
    seed:crypto.getRandomValues(new Uint32Array(1))[0],stage:selection.stage,variantId:selection.variants[0],difficulty:profile.settings.difficulty,roundTime:profile.settings.seconds
  }) : null);
  const encounter = run ? programEncounter(run) : null;
  if (run && !encounter) throw new Error('Ce programme est terminé. Lance un nouveau parcours.');
  const config = options.replay?.config;
  const fighterIds = config?.fighters || [run?.playerId || selection.fighters[0], encounter?.opponentId || selection.fighters[1]];
  const variants = config?.variants || (run ? [run.variantId,''] : [...selection.variants]);
  const fighters = fighterIds.map((id,i)=>costume(options.replay ? getReplayFighter(id,options.replay.version) : getFighter(id),variants[i]));
  const stage = getStage(config?.stage || encounter?.stageId || selection.stage);
  if (run) {
    selection = {...selection,mode,fighters:[...fighterIds],variants:[...variants],stage:run.initialStage};
    profile.program = run; persist();
  }
  const challenge = mode==='challenge' ? CHALLENGES.find(c=>c.id===selection.challenge) : null;
  const matchConfig = {fighters,stage,rulesVersion:replayRulesVersion(options.replay?.version||GAME_VERSION),mode:mode==='training'||mode==='challenge'?'training':mode==='local'?'local':'versus',cpu:config?.cpu||[false,!['local','training','challenge'].includes(mode)],difficulty:config?.difficulty||run?.difficulty||profile.settings.difficulty,seed:config?.seed??encounter?.seed??crypto.getRandomValues(new Uint32Array(1))[0],roundTime:config?.roundTime||run?.roundTime||profile.settings.seconds,roundsToWin:config?.roundsToWin||(run?1:profile.settings.rounds)};
  const engine = new CombatEngine(matchConfig);
  const initialHealth = config?.initialHealth || encounter?.initialHealth || [10000,10000];
  engine.state.fighters.forEach((f,i)=>{f.life=initialHealth[i];});
  if (challenge) engine.setTraining({dummy:challenge.dummy,freeMeter:true,freeResource:true,autoheal:true});
  active = {engine,fighters,stage,mode,run,pendingNext:null,challenge,replay:!!options.replay,replaySource:options.replay,replayIterator:options.replay?replayInputs(options.replay):null,replayFrame:0,replayTotal:options.replay?.frames,record:{format:'circus-encore-replay',version:GAME_VERSION,config:{fighters:fighterIds,variants,stage:stage.id,cpu:matchConfig.cpu,difficulty:matchConfig.difficulty,seed:matchConfig.seed,roundTime:matchConfig.roundTime,roundsToWin:matchConfig.roundsToWin,initialHealth},runs:[]},recordFrames:0,stats:createMatchStats(),elapsed:0,showHitboxes:profile.settings.hitboxes,finished:false,ready:false,storyPending:mode==='story'&&!options.replay,announcement:'',roundDelay:0,training:mode==='training'?new TrainingLab():null,presentationPhase:engine.state.phase,presentationElapsed:0,ambientElapsed:0,resultPresented:false,finisher:null};
  if (active.storyPending) engine.pause();
  renderFight(); const match = active;
  $('#announcement').innerHTML = '<strong>LE RIDEAU SE LÈVE</strong><span>Préparation des artistes…</span>';
  const load = await active.renderer.preload(fighters,[stage]);
  if (active !== match) return;
  active.ready = true; active.announcement = null; accumulator = 0; previousTime = performance.now();
  if (load?.errors?.length) toast('Certaines illustrations sont indisponibles. Le combat reste accessible avec un repère visuel.');
  if (active.storyPending) showStoryScene();
  sound('start'); syncAudio();
}
function showStoryScene() {
  const run = active?.run;
  if (!run || run.mode !== 'story' || active.finished) return;
  active.engine.pause(); controls.clear();
  storyReader = { presentation:active.storyPresentation || createStoryPresentation(run.playerId,'chapter',run.index), origin:'match' };
  renderStoryReader();
}
function storyLibraryMarkup(fighterId) {
  const route = getStoryRoute(fighterId), completed = profile.stories.includes(fighterId);
  return `<section class="story-library" aria-labelledby="story-library-title"><div><span class="eyebrow">UNE HISTOIRE EN QUATRE RENCONTRES</span><h2 id="story-library-title">${escapeHTML(route.title)}</h2><p>${escapeHTML(STORY_NOTICE)}. Prologue et épilogue en trois tableaux chacun.</p></div><div class="story-library-actions"><button class="secondary" data-action="story-preview">Lire le prologue</button><button class="secondary" data-action="story-ending-library" ${completed?'':'disabled'} aria-describedby="story-ending-access">Relire l’épilogue</button><small id="story-ending-access">${completed?'Épilogue débloqué · lecture libre sans résultat supplémentaire':'Termine les quatre rencontres pour débloquer l’épilogue.'}</small></div></section>`;
}
function openStoryReader(fighterId, kind, origin) {
  const presentation = createStoryPresentation(fighterId,kind);
  if (!presentation) return;
  storyReader = { presentation, origin }; renderStoryReader();
}
function renderStoryReader() {
  if (!storyReader) return;
  const { presentation, origin } = storyReader;
  if (origin === 'match' && active) active.storyPresentation = presentation;
  const leaveLabel = origin === 'match' ? 'Reprendre plus tard' : origin === 'result' ? 'Retour au résultat' : 'Retour à l’affiche';
  showDialog(storyPresentationMarkup(presentation,{leaveLabel}),{story:true});
  modal.scrollTop = 0;
  modal.querySelector('.story-actions .primary')?.focus({preventScroll:true});
  void paintStoryPresentation(modal,presentation.panels[presentation.index]);
}
function moveStoryReader(delta) {
  if (!storyReader) return;
  storyReader.presentation = stepStoryPresentation(storyReader.presentation,delta); renderStoryReader();
}
function leaveStoryReader() {
  if (!storyReader) return;
  const { origin, presentation } = storyReader;
  closeDialog();
  if (origin === 'match') renderHome();
  else if (origin === 'result') renderMatchResult();
  else main.querySelector(`[data-action="${presentation.kind==='epilogue'?'story-ending-library':'story-preview'}"]`)?.focus({preventScroll:true});
}
function skipStoryReader() {
  if (!storyReader) return;
  const next = skipStoryPresentation(storyReader.presentation);
  if (next) { storyReader.presentation=next; renderStoryReader(); }
  else leaveStoryReader();
}
function bracketMarkup(run) {
  const name = id => id ? escapeHTML(getFighter(id).name) : 'À déterminer';
  return `<div class="tournament-bracket">${run.tournament.rounds.map(round=>`<section><h3>${escapeHTML(round.label)}</h3>${round.matches.map(match=>`<article class="bracket-match ${match.a===run.playerId||match.b===run.playerId?'player-match':''}"><span class="${match.winner===match.a?'winner':''}">${name(match.a)}${match.a===run.playerId?' · TOI':''}</span><span class="${match.winner===match.b?'winner':''}">${name(match.b)}${match.b===run.playerId?' · TOI':''}</span><small>${match.method==='simulated'?'Résultat CPU simulé':match.method==='played'?'Duel joué':'Rencontre à venir'}</small></article>`).join('')}</section>`).join('')}</div>${run.tournament.champion?`<p class="bracket-champion">✦ ${name(run.tournament.champion)} remporte la coupe.</p>`:''}`;
}
function showBracket() {
  if (!active?.run?.tournament) return;
  if (!active.finished) { active.engine.pause(); controls.clear(); }
  const run = active.pendingNext || active.run;
  showDialog(`<span class="ticket-label">LA COUPE DU CIRQUE</span><h2 id="modal-title">Le tableau du tournoi</h2><p class="small-note">Tes rencontres se jouent dans l’arène. Les autres résultats sont simulés à partir du tirage du tournoi.</p>${bracketMarkup(run)}<div class="modal-actions"><button class="primary" data-action="${active.finished?'result-screen':'resume'}">${active.finished?'Revenir au résultat':'Reprendre le duel'}</button></div>`);
}

function updateHUD() {
  if(!active || screen!=='fight')return;
  const s=active.engine.state;
  s.fighters.forEach((p,i)=>{
    $(`#health-${i}`).style.width=`${Math.max(0,p.life/p.max*100)}%`;
    $(`#guard-${i}`).style.width=`${p.guard}%`; $(`#meter-${i}`).style.width=`${p.meter}%`;
    $(`#hp-${i}`).textContent=number(p.life); $(`#resource-${i}`).textContent=`STAB. ${Math.round(p.r)}`; $(`#super-${i}`).textContent=`FINALE ${Math.round(p.meter)}%`;
    $(`#wins-${i}`).textContent=Array.from({length:s.roundsToWin},(_,n)=>n<s.wins[i]?'●':'○').join(' ');
    const combo = s.fighters[1-i].comboHits || 0;
    $(`#feedback-${i}`).textContent = p.feedbackT>0 ? p.feedback : combo>=2 ? `${combo} IMPACTS` : '';
  });
  $('#round-time').textContent=Number.isFinite(s.timer)?String(Math.max(0,Math.ceil(s.timer))).padStart(2,'0'):'∞';
  $('#round-label').textContent=active.replay?'REPLAY':`MANCHE ${s.round}`;
  let announcement='';
  if(s.phase==='intro')announcement=`<strong>ACTE ${s.round}</strong><span>${s.introRemaining>.6?'EN PLACE…':'EN SCÈNE !'}</span>`;
  if(s.phase==='roundOver'){
    const draw=!Number.isInteger(s.roundWinner)||s.roundWinner<0;
    announcement=`<strong>${draw?'ÉGALITÉ':escapeHTML(active.fighters[s.roundWinner].name).toUpperCase()}</strong><span>${draw?'ON REJOUE CET ACTE':'REMPORTE LA MANCHE'}</span>`;
  }
  if(s.phase==='matchOver'){const draw=!Number.isInteger(s.winner)||s.winner<0;announcement=`<strong>${draw?'ÉGALITÉ':escapeHTML(active.fighters[s.winner].name).toUpperCase()}</strong><span>${draw?'LE PUBLIC SALUE LES DEUX ARTISTES':'REMPORTE LE DUEL'}</span>`;}
  if(active.finisher&&!active.resultPresented)announcement='';
  if(announcement!==active.announcement && active.ready){$('#announcement').innerHTML=announcement;active.announcement=announcement;}
  if(active.training)updateTrainingHUD();
  if(active.challenge){const value=challengeValue();$('#challenge-bar').value=value;$('#challenge-value').textContent=`${Math.min(value,active.challenge.goal)}/${active.challenge.goal}`;$('#challenge-time').textContent=`${Math.ceil(Math.max(0,60-active.elapsed/60))} s`;}
}
function challengeValue() {return challengeProgress(active.challenge,active.stats[0]);}
function collectEvents(events) {
  const effect=collectMatchStats(active.stats,events,active.engine.state);
  if(active.engine.state.phase==='matchOver')active.finisher=profile.settings.finishers?selectMatchFinisher(active.engine.state,events,{mode:active.mode,replay:active.replay}):null;
  const cues = events.map(event => event.type==='roundEnd'&&active.engine.state.fighters.some(f=>f.life<=0)?'ko':event.type==='trapPlaced'||event.type==='trapTrigger'?'trap':event.type === 'activate'
    ? event.slot === 'super' ? 'super' : event.slot?.startsWith('special') ? 'special' : event.slot === 'utility' ? 'recover' : null
    : ['parry','reflect','throwTech','guardBreak','jump','dash','explosion','heal','barrier','recover','denied'].includes(event.type) ? event.type : null).filter(Boolean);
  const priority = ['ko','super','guardBreak','parry','reflect','throwTech','explosion','trap'].find(cue => cues.includes(cue));
  const cue = priority || effect || cues[0];
  if (cue) sound(cue);
}
function loop(now) {
  requestAnimationFrame(loop);
  finisherGallery?.tick(now,{visible:modal.open&&!document.hidden&&osVisible,reducedMotion:profile.settings.reducedMotion||reducedMotionPreference.matches});
  if (!active || screen !== 'fight' || modal.open || active.finished) controls.pollMenu(now, { disabled: !!bindingCapture || document.hidden || !osVisible });
  const dt=Math.min(.1,Math.max(0,(now-previousTime)/1000)); previousTime=now;
  if(!active||screen!=='fight'||!active.ready)return;
  if(!active.finished&&!active.engine.paused&&!modal.open){
    if(active.engine.state.phase==='roundOver'){
      active.roundDelay+=dt;
      if(active.roundDelay>1.8){active.engine.nextRound();active.roundDelay=0;accumulator=0;controls.clear();}
    }else{
      accumulator+=dt*(active.training?.settings.speed||1);
      while(accumulator>=FIXED_DT&&!active.finished&&!active.engine.paused&&!modal.open){
        accumulator-=FIXED_DT;
        let inputs;
        if(active.replay){
          // Read only device pause/help commands; replay inputs remain authoritative.
          controls.poll(active.engine.state.fighters,false);
          if(active.engine.paused||modal.open)break;
          const next=active.replayIterator.next();if(next.done){finishReplay();break;}inputs=next.value;active.replayFrame++;
        }
        else inputs=sampleLiveInputs();
        if(active.engine.paused||modal.open)break;
        if(!active.replay&&active.mode!=='training'&&active.mode!=='challenge'&&active.recordFrames<72000){appendReplayFrame(active.record.runs,inputs);active.recordFrames++;}
        active.engine.step(FIXED_DT,inputs); collectEvents(active.engine.drainEvents());
        if(active.training)active.training.observe(active.engine.lastInputs||inputs);
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
  const phase=active.engine.state.phase;
  if(phase!==active.presentationPhase){active.presentationPhase=phase;active.presentationElapsed=0;}
  else if(!modal.open&&!document.hidden&&osVisible&&(!active.engine.paused||active.finished&&phase==='matchOver'))active.presentationElapsed+=dt;
  if(!modal.open&&!document.hidden&&osVisible&&(!active.engine.paused||active.finished))active.ambientElapsed+=dt;
  if(active.finished&&!active.replay&&phase==='matchOver'&&!active.resultPresented&&active.presentationElapsed>=(active.finisher&&!profile.settings.reducedMotion&&!reducedMotionPreference.matches?active.finisher.durationFrames/60:2.2))renderMatchResult();
  active.renderer.render(active.engine.state,{stage:active.stage,finisher:active.finisher&&!active.resultPresented?active.finisher:null,hitboxes:active.showHitboxes,reducedMotion:profile.settings.reducedMotion||reducedMotionPreference.matches,presentationFrame:Math.floor(active.presentationElapsed*60),ambientFrame:Math.floor(active.ambientElapsed*60)});updateHUD();
}
function storeReplay() {
  if(!active.recordFrames||active.recordFrames>=72000)return false;
  try{storage.setItem(REPLAY_KEY,JSON.stringify(active.record));return true;}catch{toast('Le replay ne peut pas être conservé dans ce navigateur.');return false;}
}
function finishMatch() {
  if (active.finished) return;
  active.finished = true; active.engine.pause(); controls.clear(); active.replaySaved = storeReplay();
  active.won = active.engine.state.winner === 0;
  const won = active.won, stats = active.stats[0];
  refreshStoredProfile();
  profile.stats.matches++; profile.stats[won?'wins':'losses']++; profile.stats.damage += stats.damage;
  if (active.run) {
    active.pendingNext = recordProgramResult(active.run,{won,health:active.engine.state.a.life});
    const next = active.pendingNext;
    // Persist the next encounter before showing its button. Reloading cannot award this duel twice.
    profile.program = next.status === 'active' ? next : null;
    if (active.mode === 'survival' && won) profile.stats.bestSurvival = Math.max(profile.stats.bestSurvival,next.index);
    if (next.status === 'complete') {
      profile.medals = [...new Set([...profile.medals,active.mode])];
      if (active.mode === 'story') profile.stories = [...new Set([...profile.stories,active.run.playerId])];
    } else if (next.status === 'eliminated' && !['survival','tournament'].includes(active.mode)) {
      // A loss in these modes permits retrying the same encounter after a reload.
      profile.program = retryProgram(next);
    }
  }
  profile.history.unshift({fighter:active.fighters[0].id,opponent:active.fighters[1].id,mode:active.mode,won,at:new Date().toISOString()});
  profile.history = profile.history.slice(0,12); persist(); syncAudio(); sound(won?'win':'lose');
  active.presentationPhase='matchOver'; active.presentationElapsed=0;
  $('.arena-wrap').classList.toggle('finishing',!!active.finisher);
  if(active.finisher)$('#arena').setAttribute('aria-label',active.finisher.title+' — finale de spectacle. Le résultat du duel est déjà enregistré.');
  const skip=document.createElement('button'); skip.className='primary outcome-skip'; skip.dataset.action='result-screen'; skip.textContent='Voir le résultat'; $('.arena-wrap').append(skip); skip.focus({preventScroll:true});
}
function renderMatchResult() {
  if(!active?.finished)return;
  active.resultPresented=true; $('.outcome-skip')?.remove(); $('.arena-wrap')?.classList.remove('finishing');
  const won = active.won, run = active.run, next = active.pendingNext;
  const continuing = next?.status === 'active', completed = next?.status === 'complete';
  if (completed && active.mode === 'story' && !active.storyEndingPresented) {
    active.storyEndingPresented = true;
    openStoryReader(run.playerId,'epilogue','result'); return;
  }
  const titleText = active.mode==='local' ? (active.engine.state.winner>=0?`${active.fighters[active.engine.state.winner].name} remporte le duel`:'Le duel se termine sur une égalité') : won ? 'Le public en redemande.' : 'Un autre numéro t’attend.';
  const ending = completed && active.mode==='story' ? `<section class="story-ending"><h3>Épilogue · ${escapeHTML(getStoryRoute(run.playerId).title)}</h3><p>${escapeHTML(getStoryEnding(run.playerId))}</p><span class="small-note">${escapeHTML(STORY_NOTICE)}</span><button class="secondary" data-action="story-ending-result">Relire les trois tableaux</button></section>` : '';
  showDialog(`<span class="ticket-label">${won?'RAPPEL !':'FIN DE L’ACTE'}</span><h2 id="modal-title">${escapeHTML(titleText)}</h2>
    <p class="result-copy">${run?`${run.index+1}/${run.opponents.length} rencontres. `:''}${continuing?'La prochaine scène est prête et sauvegardée.':completed?'Le programme est terminé. Une médaille a été ajoutée au profil.':run&&['tournament','survival'].includes(active.mode)?'Ce parcours est terminé. Rejouer démarre une nouvelle tentative.':active.replaySaved?'Le duel a été enregistré dans les replays locaux.':'Le duel est terminé. Son replay n’a pas pu être conservé.'}${continuing&&active.mode==='survival'?` Santé au prochain duel : ${number(next.health)}.`:''}</p>
    ${resultStats(active.stats[0])}${ending}
    <div class="modal-actions">${continuing?'<button class="primary" data-action="next-fight">SCÈNE SUIVANTE ↗</button>':'<button class="primary" data-action="rematch">REJOUER</button>'}${run?.tournament?'<button class="secondary" data-action="bracket">Voir le tableau</button>':''}<button class="secondary" data-action="select-again">Changer d’affiche</button><button class="secondary" data-action="home">Accueil</button></div>`);
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
function resumeGame(){if(!active||active.finished)return;if(active.storyPending){showStoryScene();return;}closeDialog();active.engine.pause(active.training?.frozen||false);accumulator=0;previousTime=performance.now();controls.clear();$('#arena')?.focus({preventScroll:true});syncAudio();}
function showMoveList(){
  if(active&&!active.finished)active.engine.pause();controls.clear();
  const fighter=active?.fighters[0]||getFighter(codexId);
  showDialog(`<span class="ticket-label">${escapeHTML(fighter.name)}</span><h2 id="modal-title">Le répertoire</h2>${moveTable(fighter)}<p class="small-note">Le spécial dépend de la direction au moment de la pression. Avant et arrière sont relatifs au rival. La garde haute ne protège pas des coups bas ; une saisie traverse la garde.</p><div class="modal-actions"><button class="primary" data-action="${active&&!active.finished?'resume':'close-modal'}">${active&&!active.finished?'Reprendre':'Fermer'}</button><button class="secondary" data-action="controls">Commandes complètes</button></div>`);
}
function showControls(){
  if(active&&!active.finished)active.engine.pause();controls.clear();
  showDialog(`<span class="ticket-label">LE CARNET DES RÉPÉTITIONS</span><h2 id="modal-title">Les commandes</h2><div class="keys-grid">${[0,1].map(player=>`<section><h3>Joueur ${player+1}${player?' · duel local':''}</h3><dl class="controls-list">${BINDING_ACTIONS.map(({id,label})=>`<div><dt>${escapeHTML(label)}</dt><dd><kbd>${escapeHTML(binding(id,player))}</kbd></dd></div>`).join('')}</dl></section>`).join('')}<section><h3>Manette standard</h3><p>Stick / croix : déplacement<br>A / × : saut · X / □ : léger<br>Y / △ : fort · B / ○ : spécial<br>LB / L1 : garde · RB / R1 : saisie<br>RT / R2 : dash · L3 : finale · R3 : ressource<br>Start / Options : pause</p><p>Menus : stick / croix pour naviguer, A / × pour choisir, B / ○ pour revenir.</p></section><section><h3>Les combinaisons</h3><p>Accroupi + léger : coup bas.<br>Bas, avant ou arrière + spécial : technique directionnelle. Avant est toujours dirigé vers le rival.<br>Garde + accroupi : garde basse.<br>Une saisie traverse la garde ; la touche de saisie permet aussi une déchope au bon moment.</p><p><kbd>Échap</kbd> met en pause. Les réglages permettent de modifier les touches de chaque joueur.</p></section></div><div class="modal-actions"><button class="primary" data-action="${active&&!active.finished?'resume':'close-modal'}">${active&&!active.finished?'Reprendre':'Fermer'}</button></div>`);
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
function captureBinding(button) {
  bindingCapture={player:Number(button.dataset.bindPlayer),action:button.dataset.bindAction,slot:Number(button.dataset.bindSlot)};
  controls.clear();
  const action=BINDING_ACTIONS.find(a=>a.id===bindingCapture.action);
  showDialog(`<span class="ticket-label">JOUEUR ${bindingCapture.player+1} · CLAVIER</span><h2 id="modal-title">${escapeHTML(action.label)}</h2><p class="result-copy">Appuie sur la touche souhaitée. Échap annule.${bindingCapture.slot?' Retour arrière retire cette alternative.':''}</p><p id="binding-error" class="binding-error" role="status"></p><div class="modal-actions"><button class="secondary" data-action="close-modal">Annuler</button></div>`);
}
function navigateMenu(action) {
  if(bindingCapture||document.hidden||!osVisible)return;
  if(storyReader&&action==='back'){leaveStoryReader();return;}
  if(action==='back'){
    if(modal.open){if(active&&screen==='fight'){if(!active.finished)resumeGame();}else closeDialog();}
    else if(screen!=='home')navigate('home');
    return;
  }
  const scope=modal.open?modal:document;
  const items=[...scope.querySelectorAll('button:not(:disabled),a[href],select,input[type=range],input[type=checkbox],input[type=radio]')].filter(el=>!el.hidden&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  if(!items.length)return;
  const focused=document.activeElement, index=items.indexOf(focused);
  if(action==='select'){
    if(index<0){items[0].focus();return;}
    if(focused.tagName==='SELECT')return;
    focused.click();return;
  }
  if(index>=0&&['left','right'].includes(action)&&['SELECT','INPUT'].includes(focused.tagName)){
    if(focused.tagName==='SELECT')focused.selectedIndex=Math.max(0,Math.min(focused.options.length-1,focused.selectedIndex+(action==='right'?1:-1)));
    else if(focused.type==='range')focused.value=String(Math.max(Number(focused.min),Math.min(Number(focused.max),Number(focused.value)+(action==='right'?1:-1)*Number(focused.step||.05))));
    else return;
    focused.dispatchEvent(new Event('change',{bubbles:true}));return;
  }
  if(index<0){items[0].focus();return;}
  const origin=focused.getBoundingClientRect(), x=origin.x+origin.width/2, y=origin.y+origin.height/2;
  const vertical=action==='up'||action==='down', sign=action==='up'||action==='left'?-1:1;
  const candidates=items.filter(el=>el!==focused).map(el=>{
    const r=el.getBoundingClientRect(), dx=r.x+r.width/2-x, dy=r.y+r.height/2-y;
    const ahead=(vertical?dy:dx)*sign, side=Math.abs(vertical?dx:dy);
    return {el,ahead,score:ahead+side*3};
  }).filter(c=>c.ahead>3).sort((a,b)=>a.score-b.score);
  (candidates[0]?.el||items[(index+(sign>0?1:-1)+items.length)%items.length]).focus();
}
async function handleClick(event){
  const button=event.target.closest('button');if(!button||button.disabled)return;
  void audio.unlock().then(() => sound(button.dataset.action==='home'||button.dataset.action==='close-modal'?'back':'select'));
  try{
    if(button.dataset.bindAction){captureBinding(button);return;}
    if(button.dataset.nav){navigate(button.dataset.nav);return;}
    if(button.dataset.leave){completeNavigation(button.dataset.leave);return;}
    if(button.dataset.mode){chooseMode(button.dataset.mode);return;}
    if(button.dataset.challenge){selection.challenge=button.dataset.challenge;selection.mode='challenge';selection.side=0;renderSelect();return;}
    if(button.dataset.side){selection.side=Number(button.dataset.side);renderSelect();return;}
    if(button.dataset.fighter){selection.fighters[selection.side]=button.dataset.fighter;selection.variants[selection.side]='';renderSelect();return;}
    if(button.dataset.stage){selection.stage=button.dataset.stage;renderSelect();return;}
    if(button.dataset.finaleFighter){await showFinisherGallery(button.dataset.finaleFighter);return;}
    if(button.dataset.finaleId){await showFinisherGallery(button.dataset.finaleArtist,button.dataset.finaleId,$('#finale-costume')?.value||'');return;}
    if(button.dataset.codex){codexId=button.dataset.codex;renderCodex();return;}
    if(button.dataset.practice){selection.fighters[0]=button.dataset.practice;selection.variants[0]='';chooseMode('training');return;}
    if(button.dataset.page){archivePage+=Number(button.dataset.page);renderArchives();return;}
    if(button.dataset.appearance){await showAppearance(button.dataset.appearance);return;}
    if(button.dataset.tryAppearance){
      const variant=VARIANTS.find(v=>v.id===button.dataset.tryAppearance);
      const fighter=variant?getFighter(variant.fighterId):FIGHTERS.find(f=>f.id===button.dataset.tryAppearance);
      if(!fighter)return;
      selection.fighters[0]=fighter.id;selection.variants[0]=variant?.id||'';selection.mode='training';selection.side=0;
      closeDialog();await startMatch({mode:'training'});return;
    }
    switch(button.dataset.action){
      case 'finale-toggle':finisherGallery?.toggle();break;
      case 'finale-replay':finisherGallery?.replay();break;
      case 'start':await requestStart();break;
      case 'start-new':await startMatch();break;
      case 'resume-program':if(profile.program)await startMatch({mode:profile.program.mode,run:profile.program});break;
      case 'story-start':if(active?.storyPending&&storyReader?.presentation.panels[storyReader.presentation.index].kind==='chapter'){active.storyPending=false;resumeGame();}break;
      case 'story-next':moveStoryReader(1);break;
      case 'story-prev':moveStoryReader(-1);break;
      case 'story-skip':skipStoryReader();break;
      case 'story-done':case 'story-leave':leaveStoryReader();break;
      case 'story-preview':openStoryReader(selection.fighters[0],'prologue','library');break;
      case 'story-ending-library':if(profile.stories.includes(selection.fighters[0]))openStoryReader(selection.fighters[0],'epilogue','library');break;
      case 'story-ending-result':if(active?.mode==='story'&&active.pendingNext?.status==='complete')openStoryReader(active.run.playerId,'epilogue','result');break;
      case 'bracket':showBracket();break;
      case 'result-screen':renderMatchResult();break;
      case 'reset-bindings':profile.settings=cleanSettings({...profile.settings,bindings:DEFAULT_BINDINGS});persist();renderSettings();toast('Touches par défaut rétablies.');break;
      case 'offline-retry':await offline.init();if(offline.getState().ready)toast('Le mode hors ligne est prêt.');break;
      case 'offline-prepare':await offline.prepare();toast('Le spectacle est prêt pour une visite hors ligne.');break;
      case 'offline-clear':await offline.clearAssets();toast('Illustrations libérées. Le profil est conservé.');break;
      case 'offline-install':await offline.install();break;
      case 'offline-update':await offline.applyUpdate();break;
      case 'pause':pauseGame();break;
      case 'resume':resumeGame();break;
      case 'movelist':showMoveList();break;
      case 'controls':showControls();break;
      case 'close-modal':closeDialog();break;
      case 'home':closeDialog();renderHome();break;
      case 'select-again':closeDialog();active=null;renderSelect();break;
      case 'challenges':closeDialog();active=null;renderChallenges();break;
      case 'rematch':{const run=active.pendingNext?.status==='eliminated'?retryProgram(active.pendingNext):null;await startMatch({mode:active.mode,run});break;}
      case 'next-fight':if(active.pendingNext?.status==='active')await startMatch({mode:active.mode,run:active.pendingNext});break;
      case 'reset-training':resetTraining();break;
      case 'training-freeze':if(active?.training){active.training.setFrozen(!active.training.frozen);active.engine.pause(active.training.frozen);accumulator=0;controls.clear();updateTrainingHUD();syncAudio();}break;
      case 'training-step':if(active?.training?.frozen&&!modal.open){const inputs=sampleLiveInputs();active.engine.stepFrame(inputs);collectEvents(active.engine.drainEvents());active.training.observe(active.engine.lastInputs||inputs);updateHUD();}break;
      case 'training-history':if(active?.training){active.training.clearHistory();updateTrainingHUD();}break;
      case 'training-record':if(active?.training){if(active.training.mode==='recording')active.training.stop();else{resetTraining();active.training.startRecording();}controls.clear();updateTrainingHUD();}break;
      case 'training-play':if(active?.training?.tape.length){resetTraining();active.training.startPlayback($('#training-loop').checked);controls.clear();updateTrainingHUD();}break;
      case 'training-stop':if(active?.training){active.training.stop();controls.clear();updateTrainingHUD();}break;
      case 'training-clear':if(active?.training){active.training.clearTape();controls.clear();updateTrainingHUD();}break;
      case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else await main.requestFullscreen();}catch{toast('Le plein écran n’est pas disponible dans ce navigateur.');}break;
      case 'export-profile':download('Digital_Circus_Encore_Profil.json',profile);break;
      case 'import-profile':$('#import-profile').click();break;
      case 'last-replay':await replayLast();break;
      case 'repeat-replay':await startMatch({mode:'versus',replay:active.replaySource});break;
      case 'export-replay':download('Digital_Circus_Encore_Replay.json',readSavedReplay());break;
      case 'import-replay':$('#import-replay').click();break;
    }
  }catch(error){console.error(error);toast(`Impossible de terminer l’action : ${error.message}`);if(active&&!active.finished)pauseGame('Le jeu a été mis en pause après une erreur.');}
  finally {
    // Rebuilt rosters and lists keep keyboard/gamepad focus on the chosen item.
    if (!button.isConnected && !modal.open && screen !== 'fight') {
      const attribute = ['data-fighter','data-side','data-stage','data-codex','data-page','data-action'].find(name=>button.hasAttribute(name));
      if (attribute) main.querySelector(`[${attribute}="${CSS.escape(button.getAttribute(attribute))}"]`)?.focus({preventScroll:true});
    }
  }
}
document.addEventListener('click',handleClick);
document.addEventListener('keydown',event=>{
  void audio.unlock();
  if(!bindingCapture)return;
  event.preventDefault();event.stopImmediatePropagation();
  if(event.repeat)return;
  if(event.code==='Escape'){closeDialog();return;}
  if(event.altKey||event.metaKey||(event.ctrlKey&&!event.code.startsWith('Control'))){$('#binding-error').textContent='Choisis une touche seule, sans raccourci du navigateur.';return;}
  const {player,action,slot}=bindingCapture;
  const value=event.code==='Backspace'&&slot===1?null:event.code;
  const result=rebindAction(profile.settings.bindings,player,action,value,slot);
  if(!result.ok){$('#binding-error').textContent=result.error;return;}
  profile.settings=cleanSettings({...profile.settings,bindings:result.bindings});persist();controls.clear();closeDialog();renderSettings();
  main.querySelector(`[data-bind-player="${player}"][data-bind-action="${action}"][data-bind-slot="${slot}"]`)?.focus();
  toast('Commande enregistrée.');
},true);
document.addEventListener('change',event=>{
  const target=event.target;
  if(target.dataset.setting){const key=target.dataset.setting;const value=target.type==='checkbox'?target.checked:['seconds','rounds','volume','musicVolume','ambienceVolume'].includes(key)?Number(target.value):target.value;profile.settings=cleanSettings({...profile.settings,[key]:value});persist();applySettings();if(key==='layout'){renderSettings();$('[data-setting="layout"]').focus();}return;}
  if(target.id.startsWith('variant-')){const side=Number(target.id.at(-1));selection.variants[side]=target.value;refreshSelectionArtist(side);}
  if(target.id==='finale-costume'&&finisherGallery){const entry=finisherGallery.entry;void showFinisherGallery(entry.fighterId,entry.id,target.value).catch(error=>toast(error.message));return;}
  if(target.id==='wardrobe-variant'){void showAppearance(target.value,true).catch(()=>toast('Cette apparence ne peut pas être affichée.'));return;}
  if(target.id==='select-difficulty'){profile.settings.difficulty=target.value;persist();}
  if(target.id==='archive-filter'){archiveFilter=target.value;archivePage=0;renderArchives();}
  if(target.id.startsWith('training-')&&active?.training){
    const lab=active.training;
    if(target.id==='training-dummy')lab.stop();
    lab.setSettings({dummy:$('#training-dummy').value,speed:Number($('#training-speed').value),freeMeter:$('#training-meter').checked,freeResource:$('#training-resource').checked,autoheal:$('#training-heal').checked});
    lab.loop=$('#training-loop').checked;
    active.engine.setTraining({...lab.settings,dummy:lab.drivesDummy?'playback':lab.settings.dummy});
    active.showHitboxes=$('#training-boxes').checked;accumulator=0;controls.clear();updateTrainingHUD();
  }
});
let searchTimer;
document.addEventListener('input',event=>{if(event.target.id==='archive-search'){archiveQuery=event.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{archivePage=0;renderArchives();const input=$('#archive-search');input.focus();input.setSelectionRange(input.value.length,input.value.length);},200);}});
modal.addEventListener('cancel',event=>{
  event.preventDefault();
  if(storyReader){leaveStoryReader();return;}
  if(active&&screen==='fight'){
    // Results contain the only continuation controls for a campaign or replay.
    if(!active.finished)resumeGame();
  }else closeDialog();
});
modal.addEventListener('keydown',event=>{
  if(!storyReader||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  if(event.target.closest('input,select,textarea,summary,a'))return;
  event.preventDefault();moveStoryReader(event.key==='ArrowLeft'?-1:1);
});
window.addEventListener('blur',()=>{if(active&&screen==='fight'&&!active.finished&&!modal.open)pauseGame('La fenêtre a perdu le focus. Reprends lorsque tu es prêt.');});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&active&&!active.finished)pauseGame('Le jeu a été masqué. La rencontre est suspendue.');syncAudio();});
window.addEventListener('message',event=>{if(!embedded||event.source!==window.parent||event.origin!==location.origin)return;if(event.data?.type==='cainos:combat:visibility'){osVisible=event.data.active!==false;if(!osVisible){controls.clear();if(active&&!active.finished)pauseGame('La fenêtre de combat a été masquée dans CainOS.');}syncAudio();}});
window.addEventListener('storage',event=>{if(event.key===SAVE_KEY&&!profileDirty){profile=readProfile(storage);applySettings();if(screen==='settings')renderSettings();else if(screen==='home')renderHome();}});
$('#import-profile').addEventListener('change',async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  try{if(file.size>2_000_000)throw new Error('Ce fichier de profil est trop volumineux.');const imported=validateProfile(JSON.parse(await file.text()));showDialog('<span class="ticket-label">PROFIL IMPORTÉ</span><h2 id="modal-title">Remplacer ce profil local ?</h2><p class="result-copy">Les réglages et le palmarès de ce navigateur seront remplacés par ceux du fichier choisi.</p><div class="modal-actions"><button class="primary" id="confirm-import">Importer ce profil</button><button class="secondary" data-action="close-modal">Annuler</button></div>');$('#confirm-import').addEventListener('click',()=>{profile=imported;persist();applySettings();closeDialog();renderSettings();toast('Profil importé.');},{once:true});}catch(error){toast(error.message);}
});
$('#import-replay').addEventListener('change',async event=>{
  const file=event.target.files[0];event.target.value='';if(!file)return;
  try{if(file.size>2_000_000)throw new Error('Ce replay est trop volumineux.');const replay=validateReplay(JSON.parse(await file.text()),FIGHTERS.map(f=>f.id),STAGES.map(s=>s.id));await startMatch({mode:'versus',replay});}catch(error){toast(error.message);}
});
// A read-only view enables QA without injecting commands into game logic.
window.Encore=Object.freeze({version:GAME_VERSION,get screen(){return screen;},get ready(){return active?.ready||false;},get paused(){return active?.engine.paused||false;},get snapshot(){return active?.engine.getSnapshot()||null;},get training(){return active?.training?.snapshot(active.engine.state.fighters)||null;},get finales(){return finisherGallery?.snapshot||null;},get presentation(){return active?{finisherId:active.finisher?.id||null,finisherDuration:active.finisher?.durationFrames||0,phase:active.presentationPhase,frames:Math.floor(active.presentationElapsed*60),resultPresented:active.resultPresented}:null;},get stats(){return active?JSON.parse(JSON.stringify(active.stats.map(s=>({...s,unique:[...s.unique]})))):null;},get profile(){return JSON.parse(JSON.stringify(profile));},get program(){return active?.run?JSON.parse(JSON.stringify(active.pendingNext||active.run)):null;},get offline(){return offline.getState();},get audio(){return audio.diagnostics;}});
applySettings();renderHome();requestAnimationFrame(loop);void offline.init();
