import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const storage = new Map();
const context = {
  console,
  performance: { now: () => 0 },
  requestAnimationFrame: () => 0,
  cancelAnimationFrame: () => {},
  setTimeout: () => 0,
  clearTimeout: () => {},
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
    key: index => [...storage.keys()][index] ?? null,
    get length() { return storage.size; }
  },
  document: {
    body: { classList: { toggle: () => false, add: () => {}, remove: () => {} }, dataset: {} },
    getElementById: () => ({}),
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  navigator: { getGamepads: () => [] },
  window: { addEventListener: () => {}, removeEventListener: () => {} },
  Image: class {},
  Audio: class {},
  AudioContext: class {},
  webkitAudioContext: class {}
};
context.window.window = context.window;
context.window.document = context.document;
vm.createContext(context);
vm.runInContext(`${source}\n;globalThis.__CainOS = OS;`, context, { filename: 'app.js' });

const OS = context.__CainOS;
const failures = [];
const virtual = new Set(['visit', 'survive', 'give']);
const officialTitles = {
  1: 'Pilot',
  2: 'Candy Carrier Chaos!',
  3: 'The Mystery Of Mildenhall Manor',
  4: 'Fast Food Masquerade',
  5: 'Untitled',
  6: 'They All Get Guns',
  7: 'Beach Episode',
  8: 'hjsakldfhl',
  9: 'Remember'
};
let stageCount = 0;
const canonPackEPlacements = {
  candyguardcyan: 32,
  candyguardblue: 32,
  candyguardpurple: 32,
  gummyworm: 6,
  barrelmonkey: 3,
  jeffery: 11
};
const canonPackEProfileKeys = {
  candyguardcyan: 'CANDY_GUARD',
  candyguardblue: 'CANDY_GUARD',
  candyguardpurple: 'CANDY_GUARD',
  gummyworm: 'GUMMY_WORM',
  barrelmonkey: 'BARREL_MONKEY',
  jeffery: 'JEFFERY'
};
const canonPackFPlacements = {
  redmannequin: 32,
  orangemannequin: 32,
  yellowmannequin: 32,
  magentamannequin: 32,
  mildenhallsouls: 9,
  albertspudsy: 10
};
const canonPackFProfileKeys = {
  redmannequin: 'COLORED_MANNEQUIN',
  orangemannequin: 'COLORED_MANNEQUIN',
  yellowmannequin: 'COLORED_MANNEQUIN',
  magentamannequin: 'COLORED_MANNEQUIN',
  mildenhallsouls: 'MILDENHALL_SOULS',
  albertspudsy: 'ALBERT_SPUDSY'
};
const canonPackGPlacements = {
  truthtellerfish: 14,
  liarfish: 14,
  stupidburgermannequin: 10,
  cerealmannequin: 10
};
const canonPackGProfileKeys = {
  truthtellerfish: 'TRUTH_TELLER_NPC',
  liarfish: 'LIAR_NPC',
  stupidburgermannequin: 'SPUDSY_BURGER_CUSTOMER',
  cerealmannequin: 'SPUDSY_CEREAL_CUSTOMER'
};
const canonPackHSpritePlacements = {
  ragathamothershadow: 16,
  laughingshadows: 16
};
const canonPackHPropPlacements = {
  paintedmasks: 16,
  zoobleparts: 16
};
const canonPackHProfileKeys = {
  ragathamothershadow: 'FEMININE_SHADOW',
  paintedmasks: 'PAINTED_MASKS',
  zoobleparts: 'ZOOBLE_PARTS_MIRRORS',
  laughingshadows: 'LAUGHING_SHADOWS'
};
const canonPackKSpritePlacements = {
  sun: 3,
  moon: 3,
  abstractedkaufmo: 4,
  cellarabstraction: 4,
  aquaticabstraction: 22,
  fourthcrocodile: 16
};
const canonPackKProfileKeys = {
  sun: 'SUN_NPC',
  moon: 'MOON',
  abstractedkaufmo: 'ABSTRACTED_KAUFMO',
  cellarabstraction: 'CELLAR_ABSTRACTION',
  aquaticabstraction: 'AQUATIC_ABSTRACTION',
  fourthcrocodile: 'FOURTH_CROCODILE'
};
const canonPackLProfileKeys = {
  floatingworm: 'FLOATING_WORM',
  creditsfish: 'CREDITS_FISH',
  stabbedragdolls: 'STABBED_RAGDOLLS',
  coiledcentipedes: 'COILED_CENTIPEDES',
  unusedbrainscans: 'UNUSED_BRAINSCANS'
};
const canonPackLPropPlacements = {
  creditsfish: 19,
  stabbedragdolls: 16,
  coiledcentipedes: 16,
  unusedbrainscans: 16
};
const canonPackMProfileKeys = {
  abstractedjax: 'JAX',
  abstractedqueeniedark: 'QUEENIE',
  abstractedqueenie: 'QUEENIE',
  peeledjax: 'JAX',
  jaxmindviolent: 'JAX',
  jaxmindcomic: 'JAX'
};
const canonPackMGates = {
  abstractedjax: [9, 4],
  abstractedqueeniedark: [3, 7],
  abstractedqueenie: [8, 1],
  peeledjax: [8, 7],
  jaxmindviolent: [9, 4],
  jaxmindcomic: [9, 4]
};
const canonPackMFirstCast = {
  abstractedjax: 9,
  abstractedqueeniedark: 3,
  abstractedqueenie: 8,
  peeledjax: 8,
  jaxmindviolent: 9,
  jaxmindcomic: 9
};
const canonPackNProfileKeys = {
  jaxmindtrapped: 'JAX',
  spudsypomni: 'POMNI',
  spudsyjax: 'JAX',
  spudsyragatha: 'RAGATHA',
  spudsyzooble: 'ZOOBLE',
  peekingmannequin: 'COLORED_MANNEQUIN'
};
const canonPackNGates = {
  jaxmindtrapped: [9, 4],
  spudsypomni: [4, 2],
  spudsyjax: [4, 2],
  spudsyragatha: [4, 2],
  spudsyzooble: [4, 2],
  peekingmannequin: [2, 1]
};
const canonPackNFirstCast = {
  jaxmindtrapped: 9,
  spudsypomni: 4,
  spudsyjax: 4,
  spudsyragatha: 4,
  spudsyzooble: 4,
  peekingmannequin: 2
};
const canonPackIProfileKeys = {
  abigailbrooks: 'ABIGAIL',
  suzieackerman: 'SUZIE_ACKERMAN',
  zoeyraghavan: 'ZOEY_RAGHAVAN',
  rileyverselis: 'RILEY_VERSELIS',
  grantbest: 'GRANT_BEST',
  leeroymateo: 'LEEROY_MATEO'
};
const canonPackJProfileKeys = {
  jaxfather: 'JAX_FATHER',
  jaxmother: 'JAX_MOTHER',
  abigailfriendone: 'ABIGAIL_FRIEND_ONE',
  abigailfriendtwo: 'ABIGAIL_FRIEND_TWO',
  bestchildren: 'BEST_CHILDREN'
};
const canonPackJGates = {
  jaxfather: 4,
  jaxmother: 4,
  abigailfriendone: 7,
  abigailfriendtwo: 7,
  bestchildren: 7
};
const canonPackJStatuses = {
  jaxfather: 'FAMILLE HUMAINE / ARCHIVE',
  jaxmother: 'FAMILLE HUMAINE / ARCHIVE',
  abigailfriendone: 'HUMAIN DU MONDE REEL',
  abigailfriendtwo: 'HUMAIN DU MONDE REEL',
  bestchildren: 'FAMILLE HUMAINE / ARCHIVE'
};

for (let episode = 1; episode <= 9; episode++) {
  const campaign = OS.getCircusFpsCampaignDefinition(episode);
  if (!campaign) {
    failures.push(`EP${episode}: campagne absente`);
    continue;
  }
  if (campaign.title !== `${officialTitles[episode]} / CAMPAGNE FPS`) {
    failures.push(`EP${episode}: titre FPS incorrect (${campaign.title})`);
  }
  if (campaign.stages.length !== 8) failures.push(`EP${episode}: ${campaign.stages.length}/8 actes`);
  stageCount += campaign.stages.length;
  campaign.stages.forEach((stage, stageIndex) => stage.requirements.forEach(requirement => {
    if (virtual.has(requirement.action)) return;
    if (requirement.action === 'talk') {
      const found = OS.getCircusZoneSprites(stage.zone).some(sprite => (sprite.avatar || sprite.type) === requirement.target);
      if (!found) failures.push(`EP${episode}.${stageIndex + 1}: PNJ ${requirement.target} absent zone ${stage.zone}`);
      return;
    }
    const found = OS.getCircusZoneProps(stage.zone).some(prop => prop.kind === requirement.target);
    if (!found) failures.push(`EP${episode}.${stageIndex + 1}: OBJET ${requirement.target} absent zone ${stage.zone}`);
  }));
}

for (const [avatar, zone] of Object.entries(canonPackEPlacements)) {
  const sprite = OS.getCircusZoneSprites(zone).find(entry => (entry.avatar || entry.type) === avatar);
  if (!sprite) failures.push(`PACK E: ${avatar} absent zone ${zone}`);
  const profileKey = OS.getCircusCharacterProfileKey({ avatar });
  if (profileKey !== canonPackEProfileKeys[avatar]) failures.push(`PACK E: profil ${avatar} incorrect (${profileKey})`);
  const portrait = OS.getPixelAvatarSvg(avatar, 48);
  if (!portrait.includes('pixel-sheet-avatar-canon-e')) failures.push(`PACK E: portrait ${avatar} hors planche E`);
}

for (const [avatar, zone] of Object.entries(canonPackFPlacements)) {
  const sprite = OS.getCircusZoneSprites(zone).find(entry => (entry.avatar || entry.type) === avatar);
  if (!sprite) failures.push(`PACK F: ${avatar} absent zone ${zone}`);
  const profileKey = OS.getCircusCharacterProfileKey({ avatar });
  if (profileKey !== canonPackFProfileKeys[avatar]) failures.push(`PACK F: profil ${avatar} incorrect (${profileKey})`);
  const portrait = OS.getPixelAvatarSvg(avatar, 48);
  if (!portrait.includes('pixel-sheet-avatar-canon-f')) failures.push(`PACK F: portrait ${avatar} hors planche F`);
}

for (const [avatar, zone] of Object.entries(canonPackGPlacements)) {
  const sprite = OS.getCircusZoneSprites(zone).find(entry => (entry.avatar || entry.type) === avatar);
  if (!sprite) failures.push(`PACK G: ${avatar} absent zone ${zone}`);
  const profileKey = OS.getCircusCharacterProfileKey({ avatar });
  if (profileKey !== canonPackGProfileKeys[avatar]) failures.push(`PACK G: profil ${avatar} incorrect (${profileKey})`);
  const portrait = OS.getPixelAvatarSvg(avatar, 48);
  if (!portrait.includes('pixel-sheet-avatar-canon-g')) failures.push(`PACK G: portrait ${avatar} hors planche G`);
}

for (const [avatar, zone] of Object.entries(canonPackHSpritePlacements)) {
  const sprite = OS.getCircusZoneSprites(zone).find(entry => (entry.avatar || entry.type) === avatar);
  if (!sprite) failures.push(`PACK H: ${avatar} absent zone ${zone}`);
  if (!sprite?.loreGate) failures.push(`PACK H: ${avatar} sans verrou lore FPS`);
  const profileKey = OS.getCircusCharacterProfileKey({ avatar });
  if (profileKey !== canonPackHProfileKeys[avatar]) failures.push(`PACK H: profil ${avatar} incorrect (${profileKey})`);
  const portrait = OS.getPixelAvatarSvg(avatar, 48);
  if (!portrait.includes('pixel-sheet-avatar-canon-h')) failures.push(`PACK H: portrait ${avatar} hors planche H`);
}

for (const [avatar, zone] of Object.entries(canonPackHPropPlacements)) {
  const prop = OS.getCircusZoneProps(zone).find(entry => entry.kind === 'lorebillboard' && entry.avatar === avatar);
  if (!prop) failures.push(`PACK H: objet ${avatar} absent zone ${zone}`);
  if (!prop?.loreGate || !prop?.loreText) failures.push(`PACK H: objet ${avatar} sans contexte lore`);
  const profileKey = OS.getCircusCharacterProfileKey({ avatar });
  if (profileKey !== canonPackHProfileKeys[avatar]) failures.push(`PACK H: profil ${avatar} incorrect (${profileKey})`);
  const portrait = OS.getPixelAvatarSvg(avatar, 48);
  if (!portrait.includes('pixel-sheet-avatar-canon-h')) failures.push(`PACK H: portrait ${avatar} hors planche H`);
}

for (const [avatar, zone] of Object.entries(canonPackKSpritePlacements)) {
  const sprite = OS.getCircusZoneSprites(zone).find(entry => (entry.avatar || entry.type) === avatar);
  if (!sprite) failures.push(`PACK K: ${avatar} absent zone ${zone}`);
  if (['abstractedkaufmo', 'cellarabstraction', 'aquaticabstraction'].includes(avatar) && !sprite?.silent) {
    failures.push(`PACK K: abstraction ${avatar} ne doit pas parler`);
  }
  if (['cellarabstraction', 'aquaticabstraction'].includes(avatar) && sprite?.threatActive !== false) {
    failures.push(`PACK K: abstraction captive ${avatar} ne doit pas poursuivre le joueur`);
  }
  const profileKey = OS.getCircusCharacterProfileKey({ avatar });
  if (profileKey !== canonPackKProfileKeys[avatar]) failures.push(`PACK K: profil ${avatar} incorrect (${profileKey})`);
  if (!OS.getPixelAvatarSvg(avatar, 48).includes('pixel-sheet-avatar-canon-k')) failures.push(`PACK K: portrait ${avatar} hors planche K`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK K: provenance ${avatar} incorrecte`);
}

const floatingWorm = OS.getCircusZoneSprites(18).find(entry => entry.avatar === 'floatingworm');
if (!floatingWorm?.silent || floatingWorm?.loreGate?.episode !== 9) failures.push('PACK L: Floating Worm absent ou non silencieux');
for (const [avatar, zone] of Object.entries(canonPackLPropPlacements)) {
  const prop = OS.getCircusZoneProps(zone).find(entry => entry.kind === 'lorebillboard' && entry.avatar === avatar);
  if (!prop?.loreText || !prop?.loreGate) failures.push(`PACK L: objet ${avatar} absent ou sans contexte lore`);
}
for (const [avatar, profileKey] of Object.entries(canonPackLProfileKeys)) {
  if (!OS.getWackyCastData()[avatar]) failures.push(`PACK L: fiche ${avatar} absente`);
  if (OS.getCircusCharacterProfileKey({ avatar }) !== profileKey) failures.push(`PACK L: profil ${avatar} incorrect`);
  if (!OS.getPixelAvatarSvg(avatar, 48).includes('pixel-sheet-avatar-canon-l')) failures.push(`PACK L: portrait ${avatar} hors planche L`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK L: provenance ${avatar} incorrecte`);
}

for (const [avatar, profileKey] of Object.entries(canonPackMProfileKeys)) {
  if (!OS.getWackyCastData()[avatar]) failures.push(`PACK M: fiche ${avatar} absente`);
  if (OS.getCircusCharacterProfileKey({ avatar }) !== profileKey) failures.push(`PACK M: profil ${avatar} incorrect`);
  if (!OS.getPixelAvatarSvg(avatar, 48).includes('pixel-sheet-avatar-canon-m')) failures.push(`PACK M: portrait ${avatar} hors planche M`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK M: provenance ${avatar} incorrecte`);
  const [episode, subepisode] = canonPackMGates[avatar];
  const gate = OS.getWackyProfileGate(avatar);
  if (gate?.episode !== episode || gate?.subepisode !== subepisode) failures.push(`PACK M: verrou ${avatar} incorrect`);
  if (!(OS.getEpisodeCastKeys(canonPackMFirstCast[avatar]) || []).includes(avatar)) failures.push(`PACK M: ${avatar} absent de son episode`);
}

for (const [avatar, profileKey] of Object.entries(canonPackNProfileKeys)) {
  if (!OS.getWackyCastData()[avatar]) failures.push(`PACK N: fiche ${avatar} absente`);
  if (OS.getCircusCharacterProfileKey({ avatar }) !== profileKey) failures.push(`PACK N: profil ${avatar} incorrect`);
  if (!OS.getPixelAvatarSvg(avatar, 48).includes('pixel-sheet-avatar-canon-n')) failures.push(`PACK N: portrait ${avatar} hors planche N`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK N: provenance ${avatar} incorrecte`);
  const [episode, subepisode] = canonPackNGates[avatar];
  const gate = OS.getWackyProfileGate(avatar);
  if (gate?.episode !== episode || gate?.subepisode !== subepisode) failures.push(`PACK N: verrou ${avatar} incorrect`);
  if (!(OS.getEpisodeCastKeys(canonPackNFirstCast[avatar]) || []).includes(avatar)) failures.push(`PACK N: ${avatar} absent de son episode`);
}

for (const [avatar, zone] of Object.entries({
  abstractedjax: 18,
  abstractedqueeniedark: 17,
  jaxmindviolent: 41,
  jaxmindcomic: 41,
  jaxmindtrapped: 41,
  spudsypomni: 10,
  spudsyjax: 10,
  spudsyragatha: 10,
  spudsyzooble: 10,
  peekingmannequin: 6
})) {
  const sprite = OS.getCircusZoneSprites(zone).find(entry => (entry.avatar || entry.type) === avatar);
  if (!sprite) failures.push(`PACK M/N: ${avatar} absent de la zone ${zone}`);
  if (['abstractedjax', 'abstractedqueeniedark', 'jaxmindviolent', 'jaxmindcomic', 'jaxmindtrapped', 'peekingmannequin'].includes(avatar) && !sprite?.silent) {
    failures.push(`PACK M/N: ${avatar} doit rester non verbal`);
  }
}

if (OS.getWackyProfileStatus('abstractedjax') !== 'ARCHIVE') failures.push('PACK M: Jax abstrait doit rester archive');
if (OS.getWackyProfileStatus('abstractedqueeniedark') !== 'ARCHIVE' || OS.getWackyProfileStatus('abstractedqueenie') !== 'ARCHIVE') failures.push('PACK M: Queenie abstraite doit rester archivee');
if (OS.getWackyProfileStatus('peeledjax') !== 'VARIANTE') failures.push('PACK M: Peeled Jax doit rester une variante temporaire');
for (const avatar of ['jaxmindviolent', 'jaxmindcomic', 'jaxmindtrapped']) {
  if (OS.getWackyProfileStatus(avatar) !== 'PROJECTION MENTALE') failures.push(`PACK M/N: ${avatar} doit rester une projection mentale`);
}

const episodeNineCast = OS.getEpisodeCastKeys(9) || [];
for (const [avatar, profileKey] of Object.entries(canonPackIProfileKeys)) {
  const profile = OS.getWackyCastData()[avatar];
  if (!profile) failures.push(`PACK I: fiche ${avatar} absente`);
  if (OS.getCircusCharacterProfileKey({ avatar }) !== profileKey) failures.push(`PACK I: profil ${avatar} incorrect`);
  if (!OS.getPixelAvatarSvg(avatar, 48).includes('pixel-sheet-avatar-canon-i')) failures.push(`PACK I: portrait ${avatar} hors planche I`);
  if (!episodeNineCast.includes(avatar)) failures.push(`PACK I: ${avatar} absent de la distribution EP9`);
  const gate = OS.getWackyProfileGate(avatar);
  if (gate?.episode !== 9 || gate?.subepisode !== 7) failures.push(`PACK I: verrou ${avatar} incorrect`);
  if (OS.getWackyProfileStatus(avatar) !== 'CONTREPARTIE HUMAINE') failures.push(`PACK I: statut ${avatar} incorrect`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK I: provenance ${avatar} incorrecte`);
  const archiveProp = OS.getCircusZoneProps(19).find(entry => entry.kind === 'lorebillboard' && entry.avatar === avatar);
  if (!archiveProp?.loreText || archiveProp?.loreGate?.episode !== 9 || archiveProp?.loreGate?.subepisode !== 7) {
    failures.push(`PACK I: projection archive ${avatar} absente ou mal verrouillee`);
  }
  for (let zone = 0; zone <= 32; zone += 1) {
    if (OS.getCircusZoneSprites(zone).some(entry => (entry.avatar || entry.type) === avatar)) {
      failures.push(`PACK I: ${avatar} apparait comme PNJ physique en zone ${zone}`);
    }
  }
}

for (const [avatar, profileKey] of Object.entries(canonPackJProfileKeys)) {
  const profile = OS.getWackyCastData()[avatar];
  if (!profile) failures.push(`PACK J: fiche ${avatar} absente`);
  if (OS.getCircusCharacterProfileKey({ avatar }) !== profileKey) failures.push(`PACK J: profil ${avatar} incorrect`);
  if (!OS.getPixelAvatarSvg(avatar, 48).includes('pixel-sheet-avatar-canon-j')) failures.push(`PACK J: portrait ${avatar} hors planche J`);
  if (!episodeNineCast.includes(avatar)) failures.push(`PACK J: ${avatar} absent de la distribution EP9`);
  const gate = OS.getWackyProfileGate(avatar);
  if (gate?.episode !== 9 || gate?.subepisode !== canonPackJGates[avatar]) failures.push(`PACK J: verrou ${avatar} incorrect`);
  if (OS.getWackyProfileStatus(avatar) !== canonPackJStatuses[avatar]) failures.push(`PACK J: statut ${avatar} incorrect`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK J: provenance ${avatar} incorrecte`);
  const archiveProp = OS.getCircusZoneProps(19).find(entry => entry.kind === 'lorebillboard' && entry.avatar === avatar);
  if (!archiveProp?.loreText || archiveProp?.loreGate?.episode !== 9 || archiveProp?.loreGate?.subepisode !== canonPackJGates[avatar]) {
    failures.push(`PACK J: projection archive ${avatar} absente ou mal verrouillee`);
  }
  for (let zone = 0; zone <= 49; zone += 1) {
    if (OS.getCircusZoneSprites(zone).some(entry => (entry.avatar || entry.type) === avatar)) {
      failures.push(`PACK J: ${avatar} apparait comme PNJ physique en zone ${zone}`);
    }
  }
}

const bestChildrenFacts = OS.getWackyCastData().bestchildren?.facts || [];
if (!bestChildrenFacts.some(fact => fact.includes('fiche duo'))) failures.push('PACK J: Anne et Sam sont arbitrairement separees');

for (const [id, profile] of Object.entries(OS.getWackyCastData())) {
  const portrait = OS.getPixelAvatarSvg(profile.avatar || id, 48);
  if (portrait.includes('pixel-avatar-svg')) failures.push(`WACKY WATCH: ${id} utilise encore le fallback SVG generique`);
}

const bonusFusionCast = OS.getEpisodeCastKeys(-2) || [];
if (bonusFusionCast.includes('blueai')) failures.push('BLUE AI: encore rattachee a la mission bonus Fusion 1993');
for (const episode of [8, 9]) {
  if (!(OS.getEpisodeCastKeys(episode) || []).includes('blueai')) failures.push(`BLUE AI: absente de la chronologie canon EP${episode}`);
}
if (OS.getWackyProfileStatus('blueai') !== 'PNJ / DECOR') failures.push('BLUE AI: statut Wacky Watch non canonique');
if (OS.getWackyProvenanceKind('blueai') !== 'canon-visual') failures.push('BLUE AI: provenance non canonique');
const blueGate = OS.getWackyProfileGate('blueai');
if (blueGate?.episode !== 9 || blueGate?.subepisode !== 6) failures.push('BLUE AI: mauvais verrou de progression');
const blueSprite = OS.getCircusZoneSprites(16).find(entry => entry.avatar === 'blueai');
if (blueSprite?.name !== 'Blue AI' || blueSprite?.loreGate?.episode !== 9) failures.push('BLUE AI: signal FPS mal classe');
if (OS.getWackyCastData().fly) failures.push('MOUCHE MILDENHALL: ne doit pas avoir de profil Wacky Watch');

const episodeOneCast = OS.getEpisodeCastKeys(1) || [];
for (const avatar of ['abstractedkaufmo', 'cellarabstraction']) {
  if (!episodeOneCast.includes(avatar)) failures.push(`EP1: ${avatar} absent de la distribution canon`);
}
const episodeThreeCast = OS.getEpisodeCastKeys(3) || [];
for (const avatar of ['horrorghost', 'horrormonster', 'horrorpomnivoid', 'horrorpomnispiral', 'horrorpomniskull', 'bonepastor', 'shadowpomni', 'shadowkinger', 'shadowjax', 'shadowcaine']) {
  if (episodeThreeCast.includes(avatar)) failures.push(`EP3: contenu fan/production ${avatar} present dans la distribution canon`);
}
if ((OS.getEpisodeCastKeys(4) || []).includes('spudsycustomer')) failures.push('EP4: faux client Spudsy encore dans la distribution canon');
for (const avatar of ['stabbedragdolls', 'coiledcentipedes']) {
  if (!(OS.getEpisodeCastKeys(8) || []).includes(avatar)) failures.push(`EP8: decor ${avatar} absent`);
}
for (const avatar of ['moon', 'aquaticabstraction', 'floatingworm', 'creditsfish', 'unusedbrainscans']) {
  if (!episodeNineCast.includes(avatar)) failures.push(`EP9: ${avatar} absent de la distribution`);
}
for (const avatar of ['horrorghost', 'horrormonster', 'horrorpomnivoid', 'horrorpomnispiral', 'horrorpomniskull', 'shadowpomni', 'shadowkinger']) {
  if (OS.getWackyProvenanceKind(avatar) !== 'fan') failures.push(`FAN: ${avatar} n est pas isole hors timeline`);
}
for (const avatar of ['bonepastor', 'themachine']) {
  if (OS.getWackyProfileStatus(avatar) !== 'PRODUCTION / HORS TIMELINE') failures.push(`PRODUCTION: statut ${avatar} incorrect`);
  if (OS.getWackyProvenanceKind(avatar) !== 'production') failures.push(`PRODUCTION: provenance ${avatar} incorrecte`);
  for (let zone = 0; zone <= 69; zone += 1) {
    if (OS.getCircusZoneSprites(zone).some(entry => (entry.avatar || entry.type) === avatar)) {
      failures.push(`PRODUCTION: ${avatar} apparait comme PNJ physique en zone ${zone}`);
    }
  }
}
if (OS.getWackyProfileStatus('additionalvoices') !== 'PNJ / DECOR') failures.push('EP2: Pink Mannequin mal classe');
if (OS.getWackyProvenanceKind('additionalvoices') !== 'canon-visual') failures.push('EP2: provenance Pink Mannequin incorrecte');
if (OS.getCircusCharacterProfileKey({ avatar: 'additionalvoices' }) !== 'COLORED_MANNEQUIN') failures.push('EP2: profil Pink Mannequin incorrect');
const pinkMannequin = OS.getCircusZoneSprites(6).find(entry => entry.avatar === 'additionalvoices');
if (!pinkMannequin?.silent || pinkMannequin?.loreGate?.episode !== 2) failures.push('EP2: Pink Mannequin absent ou non silencieux');
if (OS.getWackyProfileStatus('spudsycustomer') !== 'RECONSTRUCTION CAINOS') failures.push('SPUDSY: faux client non classe comme reconstruction');

if (stageCount !== 72) failures.push(`${stageCount}/72 actes`);
if (failures.length) {
  console.error(`CONTRAT GAMEPLAY: ECHEC (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('CONTRAT GAMEPLAY: OK | toutes les campagnes pointent vers des PNJ et objets presents');
