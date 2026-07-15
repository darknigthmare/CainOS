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
  bonepastor: 8,
  fourthcrocodile: 16,
  ragathamothershadow: 16,
  laughingshadows: 16
};
const canonPackHPropPlacements = {
  paintedmasks: 16,
  zoobleparts: 16
};
const canonPackHProfileKeys = {
  bonepastor: 'BONE_PASTOR',
  fourthcrocodile: 'FOURTH_CROCODILE',
  ragathamothershadow: 'FEMININE_SHADOW',
  paintedmasks: 'PAINTED_MASKS',
  zoobleparts: 'ZOOBLE_PARTS_MIRRORS',
  laughingshadows: 'LAUGHING_SHADOWS'
};
const canonPackIProfileKeys = {
  abigailbrooks: 'ABIGAIL',
  suzieackerman: 'SUZIE_ACKERMAN',
  zoeyraghavan: 'ZOEY_RAGHAVAN',
  rileyverselis: 'RILEY_VERSELIS',
  grantbest: 'GRANT_BEST',
  leeroymateo: 'LEEROY_MATEO'
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

if (stageCount !== 72) failures.push(`${stageCount}/72 actes`);
if (failures.length) {
  console.error(`CONTRAT GAMEPLAY: ECHEC (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('CONTRAT GAMEPLAY: OK | toutes les campagnes pointent vers des PNJ et objets presents');
