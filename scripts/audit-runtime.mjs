import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const episodes = fs.readFileSync(new URL('../episodes.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../index.css', import.meta.url), 'utf8');
const canonPackEUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-e.png', import.meta.url);
const canonPackFUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-f.png', import.meta.url);
const canonPackGUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-g.png', import.meta.url);
const canonPackHUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-h.png', import.meta.url);
const canonPackIUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-i.png', import.meta.url);
const canonPackJUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-j.png', import.meta.url);
const canonPackKUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-k.png', import.meta.url);
const canonPackLUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-l.png', import.meta.url);
const canonPackMUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-m.png', import.meta.url);
const canonPackNUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-n.png', import.meta.url);
const canonPackOUrl = new URL('../assets/images/cainos-pixel-cast-sheet-canon-npc-pack-o.png', import.meta.url);

const failures = [];
const requireMarker = (source, marker, label = marker) => {
  if (!source.includes(marker)) failures.push(`ABSENT: ${label}`);
};

for (let episode = 1; episode <= 9; episode++) {
  requireMarker(episodes, `${episode}: [`, `checkpoints EP${episode}`);
}

[
  'SPUDSY_BURGER_CUSTOMER',
  'SPUDSY_CEREAL_CUSTOMER',
  'NPC1: "SPUDSY_BURGER_CUSTOMER"',
  'NPC2: "SPUDSY_CEREAL_CUSTOMER"',
  'getStorySceneAvatarMarkup',
  'KINGERANDGANGLE: ["KINGER", "GANGLE"]',
  'KINGERQUEENIE: ["KINGER", "QUEENIE"]',
  'RAGATHAJAX: ["RAGATHA", "JAX"]',
  'Red Crappy Looking Fish',
  'Orange Crappy Looking Fish',
  'TRAININGVIDEO: "GANGLE"',
  'STRANGECUSTOMER: "ORBSMAN"',
  'BONE_PASTOR',
  'FOURTH_CROCODILE',
  'PAINTED_MASKS',
  'ZOOBLE_PARTS_MIRRORS',
  'LAUGHING_SHADOWS',
  'ABSTRACTED_KAUFMO',
  'CELLAR_ABSTRACTION',
  'AQUATIC_ABSTRACTION',
  'FLOATING_WORM',
  'CREDITS_FISH',
  'STABBED_RAGDOLLS',
  'COILED_CENTIPEDES',
  'UNUSED_BRAINSCANS',
  'Abigail Brooks / Abby',
  'Suzie J. Ackerman',
  'Zoey Raghavan',
  'Riley Verselis',
  'Grant Best',
  'Leeroy Mateo',
  "Jax's Father",
  "Jax's Mother",
  "Abigail's Friend A",
  "Abigail's Friend B",
  'Anne and Sam Best'
].forEach(marker => requireMarker(episodes, marker));

[
  'getCircusFpsCampaignDefinition',
  'updateCircusCampaignTimedProgress',
  'updateCircusEventDirector',
  'drawCircusMissionJournal',
  'getCircusCustomAdventureProps',
  'getCainOSProfileSlots',
  'getCircusControlBindings',
  'separateCircusNpcCrowd',
  'getCainOSProvenanceMeta',
  'getWackyProvenanceKind',
  'getWackyDisplayFacts',
  'circusAvatarCoreReady',
  'syncCircusDoomCanvasSize',
  'getCircusCanvasTextLines',
  "channel: 'scene'",
  'SCENE SOCIALE CAINOS',
  'fpsInteractionChannel',
  'fpsCampaignEpisodes',
  'fpsCampaignStages',
  "canonE: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-e.png'",
  "canonF: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-f.png'",
  "canonG: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-g.png'",
  "canonH: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-h.png'",
  "canonI: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-i.png'",
  "canonJ: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-j.png'",
  "canonK: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-k.png'",
  "canonL: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-l.png'",
  "canonM: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-m.png'",
  "canonN: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-n.png'",
  "canonO: 'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-o.png'",
  'candyguardcyan: [0, 0]',
  'gummyworm: [3, 0]',
  'barrelmonkey: [4, 0]',
  'jeffery: [5, 0]',
  'redmannequin: [0, 0]',
  'mildenhallsouls: [4, 0]',
  'albertspudsy: [5, 0]',
  'truthtellerfish: [0, 0]',
  'liarfish: [1, 0]',
  'stupidburgermannequin: [2, 0]',
  'cerealmannequin: [3, 0]',
  'bonepastor: [0, 0]',
  'fourthcrocodile: [5, 0]',
  'ragathamothershadow: [2, 0]',
  'paintedmasks: [3, 0]',
  'zoobleparts: [4, 0]',
  'laughingshadows: [5, 0]',
  'abigailbrooks: [0, 0]',
  'suzieackerman: [1, 0]',
  'zoeyraghavan: [2, 0]',
  'rileyverselis: [3, 0]',
  'grantbest: [4, 0]',
  'leeroymateo: [5, 0]',
  'jaxfather: [0, 0]',
  'jaxmother: [1, 0]',
  'abigailfriendone: [2, 0]',
  'abigailfriendtwo: [3, 0]',
  'bestchildren: [4, 0]',
  'abstractedkaufmo: [2, 0]',
  'cellarabstraction: [3, 0]',
  'aquaticabstraction: [4, 0]',
  'floatingworm: [0, 0]',
  'creditsfish: [1, 0]',
  'stabbedragdolls: [2, 0]',
  'coiledcentipedes: [3, 0]',
  'unusedbrainscans: [4, 0]',
  'abstractedjax: [0, 0]',
  'abstractedqueeniedark: [1, 0]',
  'abstractedqueenie: [2, 0]',
  'peeledjax: [3, 0]',
  'jaxmindviolent: [4, 0]',
  'jaxmindcomic: [5, 0]',
  'jaxmindtrapped: [0, 0]',
  'spudsypomni: [1, 0]',
  'spudsyjax: [2, 0]',
  'spudsyragatha: [3, 0]',
  'spudsyzooble: [4, 0]',
  'peekingmannequin: [5, 0]',
  'abstractedribbit: [0, 0]',
  'destinybest: [1, 0]',
  'whatifragatha: [2, 0]',
  'whatifgangle: [3, 0]',
  'jumbledragatha: [4, 0]',
  'jumbledpomni: [5, 0]',
  "name: 'SHRIMP TOWN / CONTREFACTUEL'",
  "name: 'SNOWY TUNDRA'",
  'C&A BRAIN SCANNER ROOM',
  "name: 'JAX PSYCHE / FIVE-DOOR FOYER'",
  'EXPANDED GROUNDS / EPILOGUE PROJECTION',
  'getCircusCanonRoomDefinitions',
  "name: 'DR. FOOTBALL BATHROOM'",
  "name: 'MILDENHALL ENTRY HALL'",
  "name: 'PRIVATE TRUST EXERCISE ROOM'",
  "name: 'ADMINISTRATOR ZONE'",
  "name: 'EXIT OFFICE CUBICLE LOOP'",
  "kind: 'partition'",
  "kind: 'watercooler'",
  "kind: 'sofa'",
  "name: 'JAX PSYCHE / FOUR PERSONAS ROOM'",
  "name: 'RESTORED TENT / JAX PILLOW FORT'",
  'getCircusDormHallDoorProps',
  'getCircusNpcAnnexDoorProps',
  "kind: 'lorebillboard', avatar: 'paintedmasks'",
  "kind: 'lorebillboard', avatar: 'zoobleparts'",
  "kind: 'lorebillboard', avatar: 'abigailbrooks'",
  "kind: 'lorebillboard', avatar: 'leeroymateo'",
  "kind: 'lorebillboard', avatar: 'jaxfather'",
  "kind: 'lorebillboard', avatar: 'bestchildren'",
  "kind: 'lorebillboard', avatar: 'stabbedragdolls'",
  "kind: 'lorebillboard', avatar: 'coiledcentipedes'",
  "kind: 'lorebillboard', avatar: 'unusedbrainscans'",
  "kind: 'lorebillboard', avatar: 'creditsfish'",
  'drawCircusMildenhallFly',
  "id: 'mildenhall_fly'",
  "typeof EpisodeManager.stopActiveGame === 'function'",
  "name: 'Blue AI'",
  "blueai: { episode: 9, subepisode: 6 }",
  "if (sprite.loreGate && !this.hasCircusLoreGate(sprite.loreGate)) return false",
  "blueai: ['IA canonique developpee par C&A",
  'drawCircusCanonEventVfx',
  "id === 'gummigoo_delete'",
  "id === 'world_collapse'"
].forEach(marker => requireMarker(app, marker));

[
  'gangle:jax', 'gangle:kinger', 'gangle:pomni', 'gangle:ragatha', 'gangle:zooble',
  'jax:kinger', 'jax:pomni', 'jax:ragatha', 'jax:zooble',
  'kinger:pomni', 'kinger:ragatha', 'kinger:zooble',
  'pomni:ragatha', 'pomni:zooble', 'ragatha:zooble'
].forEach(pair => requireMarker(app, `'${pair}':`, `scene sociale ${pair}`));

for (let episode = 2; episode <= 9; episode++) {
  requireMarker(app, `${episode}: { title:`, `campagne FPS EP${episode}`);
}

[
  'circus-fps-journal',
  'save-slot-list',
  'setting-fps-invert-mouse',
  'setting-fps-interaction-assist',
  'setting-fps-motion-intensity',
  'cainos-provenance-bar',
  'watch-profile-provenance',
  'tools-canon-strict-toggle',
  'setting-canon-strict',
  'setting-ui-scale',
  'setting-scanline-intensity',
  'circus-fps-loading',
  'story-micro-provenance',
  'data-fps-binding="forward"',
  'data-fps-binding="journal"'
].forEach(marker => requireMarker(html, marker));

[
  '.circus-doom-hud.conversation-active',
  '.circus-doom-hud.journal-active',
  '.circus-dos-overlay.doom.cinematic-active .circus-fps-toolbar',
  '.pixel-sheet-avatar-canon-e',
  '.pixel-sheet-avatar-canon-f',
  '.pixel-sheet-avatar-canon-g',
  '.pixel-sheet-avatar-canon-h',
  '.pixel-sheet-avatar-canon-i',
  '.pixel-sheet-avatar-canon-j',
  '.pixel-sheet-avatar-canon-k',
  '.pixel-sheet-avatar-canon-l',
  '.pixel-sheet-avatar-canon-m',
  '.pixel-sheet-avatar-canon-n',
  '.pixel-sheet-avatar-canon-o',
  '.avatar-ce-c5-r0',
  '.avatar-cf-c5-r0',
  '.avatar-cg-c3-r0',
  '.avatar-ch-c5-r0',
  '.avatar-ci-c5-r0',
  '.avatar-cj-c4-r0',
  '.avatar-ck-c5-r0',
  '.avatar-cl-c4-r0',
  '.avatar-cm-c5-r0',
  '.avatar-cn-c5-r0',
  '.avatar-co-c5-r0'
].forEach(marker => requireMarker(css, marker));

if (!fs.existsSync(canonPackEUrl)) {
  failures.push('Planche canon NPC pack E absente');
} else if (fs.statSync(canonPackEUrl).size < 100000) {
  failures.push('Planche canon NPC pack E vide ou tronquee');
}

if (!fs.existsSync(canonPackFUrl)) {
  failures.push('Planche canon NPC pack F absente');
} else if (fs.statSync(canonPackFUrl).size < 100000) {
  failures.push('Planche canon NPC pack F vide ou tronquee');
}

if (!fs.existsSync(canonPackGUrl)) {
  failures.push('Planche canon NPC pack G absente');
} else if (fs.statSync(canonPackGUrl).size < 100000) {
  failures.push('Planche canon NPC pack G vide ou tronquee');
}

if (!fs.existsSync(canonPackHUrl)) {
  failures.push('Planche canon NPC pack H absente');
} else if (fs.statSync(canonPackHUrl).size < 100000) {
  failures.push('Planche canon NPC pack H vide ou tronquee');
}

if (!fs.existsSync(canonPackIUrl)) {
  failures.push('Planche canon NPC pack I absente');
} else if (fs.statSync(canonPackIUrl).size < 100000) {
  failures.push('Planche canon NPC pack I vide ou tronquee');
}

if (!fs.existsSync(canonPackJUrl)) {
  failures.push('Planche canon NPC pack J absente');
} else if (fs.statSync(canonPackJUrl).size < 100000) {
  failures.push('Planche canon NPC pack J vide ou tronquee');
}

if (!fs.existsSync(canonPackKUrl)) {
  failures.push('Planche canon NPC pack K absente');
} else if (fs.statSync(canonPackKUrl).size < 100000) {
  failures.push('Planche canon NPC pack K vide ou tronquee');
}

if (!fs.existsSync(canonPackLUrl)) {
  failures.push('Planche canon NPC pack L absente');
} else if (fs.statSync(canonPackLUrl).size < 100000) {
  failures.push('Planche canon NPC pack L vide ou tronquee');
}

if (!fs.existsSync(canonPackMUrl)) {
  failures.push('Planche canon NPC pack M absente');
} else if (fs.statSync(canonPackMUrl).size < 100000) {
  failures.push('Planche canon NPC pack M vide ou tronquee');
}

if (!fs.existsSync(canonPackNUrl)) {
  failures.push('Planche canon NPC pack N absente');
} else if (fs.statSync(canonPackNUrl).size < 100000) {
  failures.push('Planche canon NPC pack N vide ou tronquee');
}

if (!fs.existsSync(canonPackOUrl)) {
  failures.push('Planche canon NPC pack O absente');
} else if (fs.statSync(canonPackOUrl).size < 100000) {
  failures.push('Planche canon NPC pack O vide ou tronquee');
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) failures.push(`ID HTML DUPLIQUES: ${duplicateIds.join(', ')}`);

if (!/campaigns\.length\s*!==\s*9/.test(app)) failures.push('Audit 9 campagnes absent');
const zoneMaxMatch = app.match(/getCircusFpsZoneMax\(\)\s*\{\s*return\s+(\d+)\s*;/);
const fpsZoneMax = zoneMaxMatch ? Number(zoneMaxMatch[1]) : Number.NaN;
const minimumFpsZoneMax = 152;
if (!Number.isInteger(fpsZoneMax) || fpsZoneMax < minimumFpsZoneMax) {
  failures.push(`Borne FPS ${Number.isFinite(fpsZoneMax) ? fpsZoneMax : 'introuvable'}/${minimumFpsZoneMax} minimum`);
}
if (!/exits:\s*room\.nonPhysical\s*\?\s*\[\]\s*:\s*\[\.\.\.new Set\(room\.exits \|\| \[\]\)\]/.test(app)
  || !/Object\.entries\(canonRooms\)\.forEach\(\(\[zoneId, room\]\) => \{[\s\S]*?if \(room\.nonPhysical\) return;[\s\S]*?\(room\.exits \|\| \[\]\)\.forEach/.test(app)) {
  failures.push('Isolation des pieces non physiques dans le graphe FPS absente');
}
if (!/const route = \(Array\.isArray\(step\.route\)/.test(app) || !/route\.forEach\(zoneId =>/.test(app)) {
  failures.push('Parcours FPS multi-zones absent des campagnes');
}
if (!/storyMicroAbortBtn\.addEventListener\('click',\s*\(\)\s*=>\s*\{[\s\S]*?this\.returnFromStoryMicroGame\(\);/.test(episodes)) {
  failures.push('Retour texte persistant apres echec mini-jeu absent');
}
const focusWindowBlock = app.slice(app.indexOf('focusWindow(winId)'), app.indexOf('toggleMaximize(winId)'));
if (/\bfixture\b|\bctx\b|\bprop\b/.test(focusWindowBlock)) failures.push('Rendu de luminaire injecte dans focusWindow');
if (!/fixture === 'dome'/.test(app) || !/fixture === 'barebulb'/.test(app)) failures.push('Rendu des plafonniers du pilote incomplet');
if (!/getCircusAuthoredSpawn\(zoneId\)/.test(app)
  || !/43:\s*\{\s*x:\s*center\.x,\s*z:\s*center\.z\s*\+\s*2\.35/.test(app)
  || !/120:\s*\{\s*x:\s*center\.x,\s*z:\s*center\.z\s*\+\s*2\.0/.test(app)) {
  failures.push('Points d arrivee cadres du restaurant et du festin absents');
}
if (!/zonePositionRevisions:\s*state\.zonePositionRevisions/.test(app)) {
  failures.push('Migration versionnee des positions FPS absente');
}
if (!/getSubepisodeProgress\(episode\)/.test(app) || /getSubepisodeProgress\(1\)/.test(app.slice(
  app.indexOf('getCircusTimelineContext()'),
  app.indexOf('getCircusScheduledNpcPlacements(state)')
))) {
  failures.push('Contexte FPS encore bloque sur la progression du PILOT');
}
if (!/importCainOSSave\(save\)[\s\S]*?EpisodeManager\.updateLocksUI\?\.\(\);[\s\S]*?this\.selectEpisodeForCurrentProgress\(\);/.test(app)) {
  failures.push('Rafraichissement immediat des verrous apres import absent');
}
for (const marker of [
  "motif: 'kaufmoroom'",
  "motif: 'pilotrestaurant'",
  "kind: 'pilotexitdoor'",
  "kind: 'gloinknest'",
  "kind: 'cellaropening'",
  "kind: 'toyglove'",
  "kind: 'carousel'",
  "kind: 'banquettable'",
  "kind: 'feastplatter'",
  "kind: 'wackywatch'"
]) {
  if (!app.includes(marker)) failures.push(`Passe FPS EP1 absente: ${marker}`);
}
for (const marker of [
  "name: 'CANDY WAGON APPROACH'",
  "name: 'TEST LEVEL NPC MODEL VAULT'",
  "name: 'TEST LEVEL OOB SURFACE'",
  "name: 'KAUFMO FUNERAL / SILENT RECONSTRUCTION'",
  "version: 2",
  "definitionVersion",
  "forcedAmbientEvent",
  "id: 'gummigoo_delete'"
]) {
  if (!app.includes(marker)) failures.push(`Passe FPS EP2 absente: ${marker}`);
}
if (!/2:\s*\{\s*title:\s*'Candy Carrier Chaos!',\s*version:\s*2,\s*steps:\s*\[/.test(app)) {
  failures.push('Campagne FPS EP2 versionnee absente');
}
for (const marker of [
  "name: 'MILDENHALL EVIDENCE ROOM'",
  "name: 'MILDENHALL SOUL FOG CORRIDOR'",
  "name: 'MILDENHALL DARK REST CHAMBER'",
  "name: 'CAINE AND ZOOBLE THERAPY SET'",
  "campaignTarget: 'tape01'",
  "campaignTarget: 'tape02'",
  "campaignTarget: 'evidence'",
  "campaignTarget: 'dumbwaiterkey'",
  "campaignTarget: 'powercut'",
  "campaignTarget: 'kingereye'",
  "campaignTarget: 'hellstairs'",
  "campaignTarget: 'darkalcove'",
  "campaignTarget: 'beedrawing'",
  "campaignTarget: 'inkblot'",
  "campaignTarget: 'caineglitch'"
]) {
  if (!app.includes(marker)) failures.push(`Passe FPS EP3 absente: ${marker}`);
}
if (!/3:\s*\{\s*title:\s*'The Mystery Of Mildenhall Manor',\s*version:\s*2,\s*steps:\s*\[/.test(app)) {
  failures.push('Campagne FPS EP3 versionnee absente');
}
if (!app.includes("name: 'UNTITLED BAR'")) failures.push('Bar canonique de Untitled absent');
for (const marker of ['RAGATHA TORMENT', 'GANGLE TORMENT', 'ZOOBLE TORMENT', 'JAX TORMENT', 'POMNI TORMENT']) {
  if (!app.includes(marker)) failures.push(`Sous-espace EP8 absent: ${marker}`);
}
if (!app.includes("name: 'DEAD TENT / CAINE DELETED'")) failures.push('Etat mort du chapiteau absent');
if (!/CainOS_SAVE_V1/.test(app)) failures.push('Schema de sauvegarde absent');
if (app.includes('CHARGEMENT DU NOYAU D\'ADMINISTRATION CHARLES')) failures.push('Boot Charles presente comme canon');
if (app.includes("8: { title: 'REMEMBER'")) failures.push('Ancien titre FPS EP8 encore present');
if (app.includes("9: { title: 'THE AMAZING DIGITAL CIRCUS'")) failures.push('Ancien titre FPS EP9 encore present');
if (episodes.includes('speaker: "CANDY KINGDOM NPC"')) failures.push('Replique de Caine encore attribuee a un faux Candy Kingdom NPC');
if (!episodes.includes("eventId === 'mildenhall_fly'")) failures.push('Bourdonnement Mildenhall absent du moteur audio');
if (episodes.includes('Blue AI (reconstruction CainOS)')) failures.push('Ancienne classification non canonique de Blue AI encore presente');
if (episodes.includes('TRAINING_VIDEO: {') || episodes.includes('STRANGE_CUSTOMER: {')) failures.push('Faux profils de speakers EP4 encore presents');
if (episodes.includes('Easter egg squelettique visible dans Mildenhall Manor')) failures.push('Bone Pastor encore presente comme canon EP3');
if (app.includes("avatar: 'bonepastor', x:")) failures.push('Bone Pastor encore presente comme PNJ FPS');
if (app.includes("avatar: 'spudsycustomer', x:")) failures.push('Faux client Spudsy encore present comme PNJ FPS');

if (failures.length) {
  console.error(`AUDIT CAINOS: ECHEC (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`AUDIT CAINOS: OK | ${ids.length} ids uniques | 9 campagnes a actes variables | borne FPS ${fpsZoneMax} | journal, profils, atelier et controles presents`);
