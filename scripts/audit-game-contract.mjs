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
if (source.includes('const elevationOffset = (h * (sprite.elevation || 0)')) {
  failures.push('RENDU FPS: elevation des imposteurs appliquee deux fois');
}
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
const campaignEpisodes = Object.keys(officialTitles).map(Number);
const minimumStagesPerEpisode = 8;
let stageCount = 0;
const canonPackEPlacements = {
  candyguardcyan: 32,
  candyguardblue: 32,
  candyguardpurple: 32,
  gummyworm: 6,
  barrelmonkey: 2,
  jeffery: 164
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
  mildenhallsouls: 34,
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
  truthtellerfish: 40,
  liarfish: 40,
  stupidburgermannequin: 10,
  cerealmannequin: 155
};
const canonPackGProfileKeys = {
  truthtellerfish: 'TRUTH_TELLER_NPC',
  liarfish: 'LIAR_NPC',
  stupidburgermannequin: 'SPUDSY_BURGER_CUSTOMER',
  cerealmannequin: 'SPUDSY_CEREAL_CUSTOMER'
};
const canonPackHSpritePlacements = {
  ragathamothershadow: 114
};
const canonPackHPropPlacements = {
  paintedmasks: 115,
  zoobleparts: 116,
  laughingshadows: 117
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
  fourthcrocodile: 118
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
  stabbedragdolls: 114,
  coiledcentipedes: 114,
  unusedbrainscans: 73
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

for (const episode of campaignEpisodes) {
  const campaign = OS.getCircusFpsCampaignDefinition(episode);
  if (!campaign) {
    failures.push(`EP${episode}: campagne absente`);
    continue;
  }
  if (campaign.title !== `${officialTitles[episode]} / CAMPAGNE FPS`) {
    failures.push(`EP${episode}: titre FPS incorrect (${campaign.title})`);
  }
  const stages = Array.isArray(campaign.stages) ? campaign.stages : [];
  if (!Array.isArray(campaign.stages)) failures.push(`EP${episode}: liste d actes absente`);
  if (stages.length < minimumStagesPerEpisode) {
    failures.push(`EP${episode}: ${stages.length}/${minimumStagesPerEpisode} actes minimum`);
  }
  stageCount += stages.length;
  stages.forEach((stage, stageIndex) => {
    const requirements = Array.isArray(stage.requirements) ? stage.requirements : [];
    if (!Array.isArray(stage.requirements)) {
      failures.push(`EP${episode}.${stageIndex + 1}: exigences absentes`);
    }
    if (!Array.isArray(stage.route) || !stage.route.includes(stage.zone)) {
      failures.push(`EP${episode}.${stageIndex + 1}: route FPS absente ou sans zone cible`);
    }
    const visitTargets = new Set(requirements
      .filter(requirement => requirement.action === 'visit')
      .map(requirement => Number(requirement.target)));
    for (const zone of stage.route || []) {
      if (!visitTargets.has(zone)) failures.push(`EP${episode}.${stageIndex + 1}: zone ${zone} absente des visites de route`);
    }
    requirements.forEach(requirement => {
      if (virtual.has(requirement.action)) return;
      const requirementZone = Number.isFinite(Number(requirement.zone)) ? Number(requirement.zone) : stage.zone;
      if (requirement.action === 'talk') {
        const found = OS.getCircusZoneSprites(requirementZone)
          .some(sprite => OS.getCircusCharacterIdentityAliases(sprite).includes(requirement.target));
        if (!found) failures.push(`EP${episode}.${stageIndex + 1}: PNJ ${requirement.target} absent zone ${requirementZone}`);
        return;
      }
      const matches = OS.getCircusZoneProps(requirementZone)
        .filter(prop => (prop.campaignTarget || prop.kind) === requirement.target);
      if (!matches.length) failures.push(`EP${episode}.${stageIndex + 1}: OBJET ${requirement.target} absent zone ${requirementZone}`);
      if (requirement.distinct && matches.length < requirement.count) {
        failures.push(`EP${episode}.${stageIndex + 1}: OBJETS DISTINCTS ${requirement.target} ${matches.length}/${requirement.count} zone ${requirementZone}`);
      }
    });
  });
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

const floatingWormGate = OS.getWackyProfileGate('floatingworm');
if (floatingWormGate?.episode !== 9 || floatingWormGate?.subepisode !== 2) {
  failures.push('PACK L: Floating Worm mal verrouille dans les archives');
}
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
  abstractedjax: 109,
  abstractedqueeniedark: 17,
  jaxmindviolent: 104,
  jaxmindcomic: 104,
  jaxmindtrapped: 104,
  spudsypomni: 10,
  spudsyjax: 10,
  spudsyragatha: 10,
  spudsyzooble: 35,
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
const blueSprite = OS.getCircusZoneSprites(264).find(entry => entry.avatar === 'blueai');
if (
  blueSprite?.name !== 'Blue AI'
  || blueSprite?.silent !== true
  || blueSprite?.campaignGate
) {
  failures.push('BLUE AI: liberation EP9 zone 264 absente, sonore ou liee a un campaignGate');
}
const legacyBlueRoom = OS.getCircusCanonRoomDefinitions()[108];
const legacyBlueSprite = OS.getCircusZoneSprites(108).find(entry => entry.avatar === 'blueai');
if (
  legacyBlueRoom?.provenance !== 'projection'
  || legacyBlueRoom?.nonPhysical !== true
  || legacyBlueSprite?.silent !== true
) {
  failures.push('BLUE AI: projection legacy silencieuse de la zone 108 invalide');
}
if (OS.getWackyCastData().fly) failures.push('MOUCHE MILDENHALL: ne doit pas avoir de profil Wacky Watch');

const episodeOneCast = OS.getEpisodeCastKeys(1) || [];
for (const avatar of ['abstractedkaufmo', 'cellarabstraction', 'jumbledragatha']) {
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
for (const avatar of ['moon', 'aquaticabstraction', 'floatingworm', 'creditsfish', 'unusedbrainscans', 'abstractedribbit', 'destinybest', 'whatifragatha', 'whatifgangle', 'jumbledpomni']) {
  if (!episodeNineCast.includes(avatar)) failures.push(`EP9: ${avatar} absent de la distribution`);
}
for (const avatar of ['abstractedribbit', 'destinybest', 'whatifragatha', 'whatifgangle', 'jumbledragatha', 'jumbledpomni']) {
  if (!OS.getWackyCastData()[avatar]) failures.push(`PACK O: fiche ${avatar} absente`);
  if (!OS.getPixelAvatarSvg(avatar, 48).includes('pixel-sheet-avatar-canon-o')) failures.push(`PACK O: portrait ${avatar} hors planche O`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK O: provenance ${avatar} incorrecte`);
}
if (OS.getWackyProfileStatus('abstractedribbit') !== 'ARCHIVE') failures.push('PACK O: Ribbit abstraite doit rester archivee');
if (OS.getWackyProfileStatus('destinybest') !== 'CONTREPARTIE HUMAINE') failures.push('PACK O: Destiny Best mal classee');
for (const avatar of ['whatifragatha', 'whatifgangle']) {
  if (OS.getWackyProfileStatus(avatar) !== 'PROJECTION MENTALE') failures.push(`PACK O: ${avatar} doit rester une projection mentale`);
}
for (const avatar of ['jumbledragatha', 'jumbledpomni']) {
  if (OS.getWackyProfileStatus(avatar) !== 'VFX / ETAT TEMPORAIRE') failures.push(`PACK O: ${avatar} doit rester un VFX temporaire`);
}
if (OS.getCircusZoneSprites(73).some(entry => entry.avatar === 'abstractedribbit')) {
  failures.push('PACK O: Ribbit abstraite ne doit pas devenir un PNJ physique dans le flashback C&A');
}
if (!OS.getCircusZoneProps(19).some(entry => entry.avatar === 'destinybest' && entry.kind === 'lorebillboard')) {
  failures.push('PACK O: projection humaine Destiny Best absente des archives');
}
for (const [zone, kinds] of [[70, ['building', 'wave']], [71, ['stairs', 'candle']], [72, ['building', 'spotlight']], [73, ['desk', 'console', 'memory']], [74, ['memory', 'archive']], [75, ['tower', 'ring']]]) {
  const props = OS.getCircusZoneProps(zone);
  for (const kind of kinds) if (!props.some(prop => prop.kind === kind)) failures.push(`FPS ${zone}: decor ${kind} absent`);
}
const canonRoomDefinitions = OS.getCircusCanonRoomDefinitions();
const fpsZoneMax = OS.getCircusFpsZoneMax();
const minimumFpsZoneMax = 275;
if (!Number.isInteger(fpsZoneMax) || fpsZoneMax < minimumFpsZoneMax) {
  failures.push(`FPS: borne de zones ${fpsZoneMax}/${minimumFpsZoneMax} minimum`);
}
const canonRoomEntries = Object.entries(canonRoomDefinitions);
const minimumCanonRoomCount = 134;
if (canonRoomEntries.length < minimumCanonRoomCount) {
  failures.push(`FPS: ${canonRoomEntries.length}/${minimumCanonRoomCount} pieces canoniques ou balisees minimum`);
}
canonRoomEntries.forEach(([zoneId]) => {
  const zone = Number(zoneId);
  if (!Number.isInteger(zone) || zone > fpsZoneMax) failures.push(`FPS: piece ${zoneId} hors borne ${fpsZoneMax}`);
});
const episodeTwoCampaign = OS.getCircusFpsCampaignDefinition(2);
if (episodeTwoCampaign?.version !== 2) failures.push('EP2 FPS: version de campagne 2 absente');
if (episodeTwoCampaign?.stages?.length !== 21) {
  failures.push(`EP2 FPS: ${episodeTwoCampaign?.stages?.length ?? 0}/21 actes attendus`);
}
if (episodeTwoCampaign?.stages?.[0]?.zone !== 147 || episodeTwoCampaign?.stages?.at(-1)?.zone !== 148) {
  failures.push('EP2 FPS: la campagne doit commencer par le cauchemar 147 et finir aux funerailles 148');
}
for (let zone = 133; zone <= 148; zone++) {
  if (!canonRoomDefinitions[zone]) failures.push(`EP2 FPS: piece ${zone} absente`);
}
const episodeTwoPhysicalGraph = new Map([
  [133, [134]],
  [134, [133, 83]],
  [135, [83, 136, 138]],
  [136, [135, 137]],
  [137, [136, 138]],
  [138, [137, 139, 141, 135]],
  [139, [138, 140]],
  [140, [139, 141]],
  [141, [140, 138]]
]);
for (const [zone, expectedExits] of episodeTwoPhysicalGraph) {
  const room = canonRoomDefinitions[zone];
  const exits = new Set(room?.exits || []);
  if (room?.nonPhysical) failures.push(`EP2 FPS ${zone}: piece physique marquee nonPhysical`);
  for (const exit of expectedExits) {
    if (!exits.has(exit)) failures.push(`EP2 FPS ${zone}: sortie physique ${exit} absente`);
  }
  if (exits.size !== expectedExits.length) {
    failures.push(`EP2 FPS ${zone}: ${exits.size}/${expectedExits.length} sorties physiques attendues`);
  }
}
for (let zone = 142; zone <= 148; zone++) {
  const room = canonRoomDefinitions[zone];
  if (!room?.nonPhysical || (room?.exits || []).length) {
    failures.push(`EP2 FPS ${zone}: projection/couche technique reliee au graphe physique`);
  }
  if (zone <= 146 && room?.layer !== 'under-map') {
    failures.push(`EP2 FPS ${zone}: couche under-map absente`);
  }
}
const modelVaultProps = OS.getCircusZoneProps(144);
if (!modelVaultProps.some(prop => prop.campaignTarget === 'gummigoomodel')) {
  failures.push('EP2 FPS 144: modele inerte de Gummigoo absent');
}
if (modelVaultProps.filter(prop => prop.kind === 'lorebillboard' && prop.campaignTarget === 'npcmodel').length < 2) {
  failures.push('EP2 FPS 144: galerie de modeles PNJ inertes insuffisante');
}
const modelVaultAvatars = new Set(OS.getCircusZoneSprites(144).map(sprite => sprite.avatar || sprite.type));
if (modelVaultAvatars.size !== 2 || !modelVaultAvatars.has('pomni') || !modelVaultAvatars.has('gummigoo')) {
  failures.push('EP2 FPS 144: seuls Pomni et Gummigoo doivent etre des personnages actifs');
}
if (OS.getCircusZoneProps(146).filter(prop => prop.kind === 'teapot').length !== 3) {
  failures.push('EP2 FPS 146: trois theieres Utah attendues');
}
const funeralSprites = OS.getCircusZoneSprites(148);
const funeralRoster = new Set(funeralSprites.map(sprite => sprite.avatar || sprite.type));
const expectedFuneralRoster = new Set(['pomni', 'ragatha', 'zooble', 'gangle', 'kinger']);
if (funeralRoster.size !== expectedFuneralRoster.size
  || [...expectedFuneralRoster].some(avatar => !funeralRoster.has(avatar))
  || funeralSprites.some(sprite => !sprite.silent)) {
  failures.push('EP2 FPS 148: cortege funeraire silencieux incorrect');
}
if (funeralRoster.has('jax') || funeralRoster.has('caine')) {
  failures.push('EP2 FPS 148: Jax et Caine doivent etre absents');
}
if (OS.getCircusZoneSprites(135).some(sprite => (sprite.avatar || sprite.type) === 'caine')) {
  failures.push('EP2 FPS 135: Caine ne doit pas etre physiquement au palais');
}
if (OS.getCircusZoneSprites(141).some(sprite => (sprite.avatar || sprite.type) === 'zooble')) {
  failures.push('EP2 FPS 141: Zooble ne participe pas au bassin Chocolate River');
}
const episodeThreeCampaign = OS.getCircusFpsCampaignDefinition(3);
if (episodeThreeCampaign?.version !== 2) failures.push('EP3 FPS: version de campagne 2 absente');
if (episodeThreeCampaign?.stages?.length !== 19) {
  failures.push(`EP3 FPS: ${episodeThreeCampaign?.stages?.length ?? 0}/19 actes attendus`);
}
if (episodeThreeCampaign?.stages?.[0]?.zone !== 2 || episodeThreeCampaign?.stages?.at(-1)?.zone !== 2) {
  failures.push('EP3 FPS: la campagne doit commencer au briefing zone 2 et finir au chapiteau zone 2');
}
const episodeThreeCampaignZones = new Set((episodeThreeCampaign?.stages || [])
  .flatMap(stage => Array.isArray(stage.route) ? stage.route : [stage.zone])
  .map(Number));
for (const zone of [149, 150, 151, 152]) {
  if (!episodeThreeCampaignZones.has(zone)) failures.push(`EP3 FPS: piece ${zone} absente du parcours de campagne`);
  if (!canonRoomDefinitions[zone]) failures.push(`EP3 FPS: piece ${zone} absente`);
}
const episodeThreePhysicalGraph = new Map([
  [87, [88]],
  [88, [87, 149]],
  [149, [88, 89]],
  [89, [149, 9]],
  [9, [89, 34]],
  [34, [9, 150]],
  [150, [34, 151]],
  [151, [150, 126]],
  [126, [151, 125]],
  [125, [126, 86]],
  [86, [125]]
]);
const strictEpisodeThreeSeparationZones = new Set([88, 149, 150, 151]);
for (const [zone, expectedExits] of episodeThreePhysicalGraph) {
  const room = canonRoomDefinitions[zone];
  const exits = new Set(room?.exits || []);
  if (room?.nonPhysical) failures.push(`EP3 FPS ${zone}: piece physique marquee nonPhysical`);
  for (const exit of expectedExits) {
    if (!exits.has(exit)) failures.push(`EP3 FPS ${zone}: sortie physique ${exit} absente`);
  }
  if (strictEpisodeThreeSeparationZones.has(zone)
    && (exits.size !== expectedExits.length || [...exits].some(exit => !expectedExits.includes(exit)))) {
    failures.push(`EP3 FPS ${zone}: separation canonique incorrecte (${[...exits].join(', ') || 'aucune sortie'})`);
  }
}
const therapyRoom = canonRoomDefinitions[152];
if (!therapyRoom?.nonPhysical || (therapyRoom?.exits || []).length) {
  failures.push('EP3 FPS 152: le plateau de therapie doit rester non physique et sans sortie');
}
const getCampaignTarget = entry => entry?.campaignTarget || entry?.kind;
const getTargetCount = (entries, target) => entries.filter(entry => getCampaignTarget(entry) === target).length;
const episodeNineCampaign = OS.getCircusFpsCampaignDefinition(9);
const episodeNineWorld = OS.getCircusAdventureWorlds().find(world => world.episode === 9);
const episodeNineExpectedZones = [
  245, 246, 247, 248, 249, 250, 74, 101, 102, 103, 104, 251, 252,
  253, 254, 255, 23, 256, 257, 106, 258, 259, 260, 261, 262, 263,
  264, 265, 266, 267, 268, 269, 270, 271, 75, 272, 273, 274, 275
];
const episodeNineStages = Array.isArray(episodeNineCampaign?.stages) ? episodeNineCampaign.stages : [];
const episodeNineZones = episodeNineStages.map(stage => stage.zone);
if (episodeNineWorld?.target !== 245) {
  failures.push(`EP9 FPS: portail d entree ${episodeNineWorld?.target ?? 'absent'}/245`);
}
if (episodeNineCampaign?.version !== 2) failures.push('EP9 FPS: version de campagne 2 absente');
if (episodeNineStages.length !== 39) {
  failures.push(`EP9 FPS: ${episodeNineStages.length}/39 actes attendus`);
}
if (JSON.stringify(episodeNineZones) !== JSON.stringify(episodeNineExpectedZones)) {
  failures.push(`EP9 FPS: sequence de zones incorrecte (${episodeNineZones.join(', ')})`);
}
const episodeNineTranscriptAfter = episodeNineStages.map(stage => Number(stage.transcriptAfter));
if (episodeNineTranscriptAfter[0] !== 16) {
  failures.push(`EP9 FPS: premiere borne transcript ${episodeNineTranscriptAfter[0] ?? 'absente'}/16`);
}
if (episodeNineTranscriptAfter.at(-1) !== 935) {
  failures.push(`EP9 FPS: derniere borne transcript ${episodeNineTranscriptAfter.at(-1) ?? 'absente'}/935`);
}
if (episodeNineTranscriptAfter.some(after => !Number.isFinite(after) || after <= 0)) {
  failures.push('EP9 FPS: une borne transcript est absente, nulle ou invalide');
}
for (let index = 1; index < episodeNineTranscriptAfter.length; index += 1) {
  if (episodeNineTranscriptAfter[index] < episodeNineTranscriptAfter[index - 1]) {
    failures.push(`EP9 FPS: borne transcript decroissante a l acte ${index + 1}`);
  }
}
for (let zone = 245; zone <= 275; zone += 1) {
  const room = canonRoomDefinitions[zone];
  if (!room) {
    failures.push(`EP9 FPS: piece ${zone} absente`);
  } else if (!Array.isArray(room.props) || !room.props.length || !OS.getCircusZoneProps(zone).length) {
    failures.push(`EP9 FPS: piece ${zone} sans decor`);
  }
}
const episodeNineOpeningRoster = new Set(OS.getCircusZoneSprites(245).map(sprite => sprite.avatar || sprite.type));
if (episodeNineOpeningRoster.has('caine') || episodeNineOpeningRoster.has('bubble')) {
  failures.push('EP9 FPS 245: Caine ou Bubble apparait dans l ouverture alteree');
}
for (const zone of [249, 250]) {
  const abstractedJax = OS.getCircusZoneSprites(zone)
    .find(sprite => (sprite.avatar || sprite.type) === 'abstractedjax');
  if (!abstractedJax || abstractedJax.silent !== true) {
    failures.push(`EP9 FPS ${zone}: Jax abstrait absent ou verbal`);
  }
}
if (getTargetCount(OS.getCircusZoneProps(250), 'huntlight') !== 6) {
  failures.push('EP9 FPS 250: six lampes de chasse attendues');
}
const ribbitBedroomProps = OS.getCircusZoneProps(254);
if (!ribbitBedroomProps.some(prop => prop.kind === 'bed')
  || ribbitBedroomProps.filter(prop => prop.kind === 'plant').length < 2
  || getTargetCount(ribbitBedroomProps, 'starprojector') !== 1
  || ribbitBedroomProps.filter(prop => prop.kind === 'toyblock').length !== 2) {
  failures.push('EP9 FPS 254: chambre de Ribbit incomplete');
}
const inertBubble = OS.getCircusZoneSprites(260)
  .find(sprite => (sprite.avatar || sprite.type) === 'inertbubble');
if (!inertBubble || inertBubble.silent !== true
  || getTargetCount(OS.getCircusZoneProps(260), 'inertbubble') !== 1) {
  failures.push('EP9 FPS 260: Bubble doit rester silencieuse et liee a inertbubble');
}
const humanCounterpartAvatars = new Set([
  'abigailbrooks', 'suzieackerman', 'zoeyraghavan',
  'rileyverselis', 'grantbest', 'leeroymateo'
]);
const externalLivesProps = OS.getCircusZoneProps(267);
const externalLivesSprites = OS.getCircusZoneSprites(267);
if (getTargetCount(externalLivesProps, 'lifeprofile') !== 6) {
  failures.push('EP9 FPS 267: six profils de vies exterieures attendus');
}
if (externalLivesSprites.some(sprite => (
  sprite.type === 'human' || humanCounterpartAvatars.has(sprite.avatar || sprite.type)
))) {
  failures.push('EP9 FPS 267: un humain est materialise comme sprite dans le Circus');
}
const aquariumExpectedRoster = [
  'abstractedjax', 'abstractedribbit', 'abstractedkaufmo', 'abstractedqueeniedark'
].sort();
const aquariumSprites = OS.getCircusZoneSprites(269);
const aquariumAbstractions = aquariumSprites.filter(sprite => sprite.type === 'abstract');
const aquariumActualRoster = aquariumAbstractions.map(sprite => sprite.avatar || sprite.type).sort();
if (JSON.stringify(aquariumActualRoster) !== JSON.stringify(aquariumExpectedRoster)) {
  failures.push(`EP9 FPS 269: roster incorrect (${aquariumActualRoster.join(', ')})`);
}
if (aquariumAbstractions.some(sprite => sprite.silent !== true || sprite.threatActive !== false)) {
  failures.push('EP9 FPS 269: les quatre abstractions doivent etre silencieuses et non hostiles');
}
const aquariumObservers = new Set(
  aquariumSprites.filter(sprite => sprite.type !== 'abstract').map(sprite => sprite.avatar || sprite.type)
);
if (JSON.stringify([...aquariumObservers].sort()) !== JSON.stringify(['kinger', 'pomni'])) {
  failures.push(`EP9 FPS 269: observateurs incorrects (${[...aquariumObservers].sort().join(', ')})`);
}
const finalDinnerSprites = OS.getCircusZoneSprites(273);
const finalDinnerRoster = finalDinnerSprites.map(sprite => sprite.avatar || sprite.type).sort();
const finalDinnerExpectedRoster = ['caine', 'gangle', 'kinger', 'pomni', 'ragatha', 'zooble'];
if (JSON.stringify(finalDinnerRoster) !== JSON.stringify(finalDinnerExpectedRoster)) {
  failures.push(`EP9 FPS 273: convives incorrects (${finalDinnerRoster.join(', ')})`);
}
if (getTargetCount(OS.getCircusZoneProps(273), 'dinnerplace') !== 6) {
  failures.push('EP9 FPS 273: six places de diner attendues');
}
const realWorldRoom = canonRoomDefinitions[275];
const realWorldSprites = OS.getCircusZoneSprites(275);
if (realWorldRoom?.provenance !== 'projection'
  || realWorldRoom?.nonPhysical !== true
  || realWorldRoom?.layer !== 'real-world') {
  failures.push('EP9 FPS 275: arret de bus non classe comme projection non physique du monde reel');
}
if (realWorldSprites.length !== 6
  || realWorldSprites.some(sprite => sprite.type !== 'human' || sprite.silent !== true)) {
  failures.push('EP9 FPS 275: six humains silencieux exactement attendus');
}
const episodeNineNonPhysicalLayers = new Set([
  'projection', 'projector', 'memory', 'mind', 'network', 'void', 'real-world'
]);
const episodeNineBaseNonPhysicalMarkers = new Map([
  [23, [
    "23: { name: 'SNOWY SUMMIT / MEMORY'",
    "23: { exits: [], motif: 'snow', size: 17, nonPhysical: true, layer: 'memory' }"
  ]],
  [74, [
    "74: { name: 'JAX PSYCHE / FIVE-DOOR FOYER'",
    "74: { exits: [], motif: 'memory', size: 17, nonPhysical: true, layer: 'mind' }"
  ]]
]);
for (const zone of new Set(episodeNineExpectedZones)) {
  const room = canonRoomDefinitions[zone];
  const stage = episodeNineStages.find(candidate => candidate.zone === zone);
  const mustBeNonPhysical = room?.provenance === 'projection'
    || episodeNineNonPhysicalLayers.has(room?.layer)
    || episodeNineNonPhysicalLayers.has(stage?.entryMode);
  const baseRoomIsNonPhysical = (episodeNineBaseNonPhysicalMarkers.get(zone) || [])
    .every(marker => source.includes(marker));
  if (mustBeNonPhysical && room?.nonPhysical !== true && !baseRoomIsNonPhysical) {
    failures.push(`EP9 FPS ${zone}: couche ${room?.layer || stage?.entryMode} non balisee nonPhysical`);
  }
}
for (const legacyZone of [105, 107, 108, 109, 121]) {
  if (episodeNineZones.includes(legacyZone)) {
    failures.push(`EP9 FPS: zone legacy ${legacyZone} encore presente dans la campagne v2`);
  }
}
const trophyRoomProps = OS.getCircusZoneProps(88);
const trophyRoomTapeTargets = trophyRoomProps
  .map(getCampaignTarget)
  .filter(target => /^tape\d+$/i.test(String(target || '')));
if (getTargetCount(trophyRoomProps, 'tape01') !== 1
  || trophyRoomTapeTargets.some(target => target !== 'tape01')) {
  failures.push('EP3 FPS 88: seule la bande tape01 doit rester dans la salle des trophees');
}
const evidenceRoomProps = OS.getCircusZoneProps(149);
for (const target of ['tape02', 'dumbwaiterkey', 'powercut']) {
  if (!getTargetCount(evidenceRoomProps, target)) failures.push(`EP3 FPS 149: ${target} absent`);
}
if (getTargetCount(evidenceRoomProps, 'evidence') < 4) {
  failures.push(`EP3 FPS 149: ${getTargetCount(evidenceRoomProps, 'evidence')}/4 preuves minimum`);
}
const soulFogProps = OS.getCircusZoneProps(150);
for (const target of ['kingereye', 'hellstairs']) {
  if (!getTargetCount(soulFogProps, target)) failures.push(`EP3 FPS 150: ${target} absent`);
}
if (!getTargetCount(OS.getCircusZoneProps(151), 'darkalcove')) {
  failures.push('EP3 FPS 151: darkalcove absent');
}
const therapyProps = OS.getCircusZoneProps(152);
for (const target of ['beedrawing', 'caineglitch']) {
  if (!getTargetCount(therapyProps, target)) failures.push(`EP3 FPS 152: ${target} absent`);
}
if (getTargetCount(therapyProps, 'inkblot') < 3) {
  failures.push(`EP3 FPS 152: ${getTargetCount(therapyProps, 'inkblot')}/3 tests inkblot minimum`);
}
const therapyRoster = new Set(OS.getCircusZoneSprites(152).map(sprite => sprite.avatar || sprite.type));
for (const avatar of ['caine', 'zooble']) {
  if (!therapyRoster.has(avatar)) failures.push(`EP3 FPS 152: ${avatar} absent du plateau de therapie`);
}
const episodeFourCampaign = OS.getCircusFpsCampaignDefinition(4);
if (episodeFourCampaign?.version !== 2) failures.push('EP4 FPS: version de campagne 2 absente');
if (episodeFourCampaign?.stages?.length !== 23) {
  failures.push(`EP4 FPS: ${episodeFourCampaign?.stages?.length ?? 0}/23 actes attendus`);
}
if (episodeFourCampaign?.stages?.[0]?.zone !== 2 || episodeFourCampaign?.stages?.at(-1)?.zone !== 28) {
  failures.push('EP4 FPS: la campagne doit commencer par la lecon au Tent et finir par l epilogue Gangle/Zooble');
}
const episodeFourCampaignZones = new Set((episodeFourCampaign?.stages || []).flatMap(stage => stage.route || [stage.zone]));
for (const zone of [10, 35, 37, 72, 127, 128, 129, 130, 131, 132, 153, 154, 155, 156, 157, 158]) {
  if (!episodeFourCampaignZones.has(zone)) failures.push(`EP4 FPS: zone ${zone} absente du parcours`);
  if (!canonRoomDefinitions[zone]) failures.push(`EP4 FPS: piece ${zone} absente`);
}
const episodeFourPhysicalGraph = new Map([
  [127, [10, 72, 153, 157]],
  [153, [127, 35]],
  [35, [10, 37, 129, 130, 153]],
  [10, [127, 35, 37, 128, 154, 155]],
  [128, [10, 127]],
  [154, [10]],
  [155, [10]],
  [37, [10, 35]],
  [130, [35, 72, 129]],
  [129, [35, 130]],
  [72, [127, 130, 131, 157]],
  [157, [127, 72, 131]],
  [131, [72, 157]]
]);
for (const [zone, expectedExits] of episodeFourPhysicalGraph) {
  const room = canonRoomDefinitions[zone];
  const exits = new Set(room?.exits || []);
  if (room?.nonPhysical) failures.push(`EP4 FPS ${zone}: piece physique marquee nonPhysical`);
  if (exits.size !== expectedExits.length || expectedExits.some(exit => !exits.has(exit))) {
    failures.push(`EP4 FPS ${zone}: topologie incorrecte (${[...exits].join(', ') || 'aucune sortie'})`);
  }
}
for (const zone of [132, 156, 158]) {
  const room = canonRoomDefinitions[zone];
  if (!room?.nonPhysical || (room?.exits || []).length) {
    failures.push(`EP4 FPS ${zone}: coupe non physique mal isolee`);
  }
}
if (canonRoomDefinitions[156]?.layer !== 'time-state') failures.push('EP4 FPS 156: fermeture non classee comme etat temporel');
if (canonRoomDefinitions[158]?.layer !== 'projection') failures.push('EP4 FPS 158: hallucination non classee comme projection');

const savedCircusDoom = OS.circusDoom;
const savedBeginCircusDoorTransition = OS.beginCircusDoorTransition;
try {
  let capturedCut = null;
  OS.circusDoom = {
    currentZoneId: 35,
    portals: { 158: {} },
    doorTransition: null,
    portalTransition: null,
    interactionMessage: '',
    interactionUntil: 0,
    interactionChannel: '',
    interactionSpeaker: ''
  };
  OS.beginCircusDoorTransition = (targetId, fromZoneId, kind) => {
    capturedCut = { targetId, fromZoneId, kind };
  };
  const projectionStage = {
    entryMode: 'projection',
    entryZone: 35,
    zone: 158,
    title: 'Projection Ragatha'
  };
  const projectionPending = {
    stage: projectionStage,
    requirements: [
      { complete: false, action: 'visit', target: '158' },
      { complete: false, action: 'talk', target: 'ragatha', zone: 158 }
    ]
  };
  if (!OS.enterCircusCampaignPendingCut(projectionPending)
    || capturedCut?.targetId !== 158
    || capturedCut?.fromZoneId !== 35
    || capturedCut?.kind !== 'projection') {
    failures.push('EP4 FPS 158: coupe hallucinee non declenchee depuis la cuisine');
  }

  capturedCut = null;
  const physicalActionPending = {
    stage: projectionStage,
    requirements: [
      { complete: false, action: 'interact', target: 'stupidsauce', zone: 35 },
      { complete: false, action: 'visit', target: '158' }
    ]
  };
  if (OS.enterCircusCampaignPendingCut(physicalActionPending) || capturedCut) {
    failures.push('EP4 FPS 158: coupe declenchee avant la fin des actions physiques');
  }
} finally {
  OS.circusDoom = savedCircusDoom;
  OS.beginCircusDoorTransition = savedBeginCircusDoorTransition;
}

const episodeFourTargets = new Map([
  [2, { softballball: 1, brokencomedymask: 1 }],
  [28, { spudsysuggestion: 1, suggestionbox: 1, waterleak: 1, zoobletrapdoor: 1, gangleart: 1, waitinggroup: 1 }],
  [48, { newmask: 1, zooblebox: 1 }],
  [127, { spudsysign: 1, frontdoor: 1 }],
  [153, { startupmachine: 3, ceilingtrapdoor: 1, deepfryer: 1, managementphone: 1, drinkstation: 1 }],
  [10, { register: 1, order57: 1, lunchmenu: 1, biohazarddoor: 1, brokenclock: 1, ganglewatch: 1 }],
  [35, { stupidsauce: 1, stupidburger: 1, assemblyburger: 6, assemblycounter: 1 }],
  [154, { bandittable: 1, gatortruckwindow: 1, diningexit: 1 }],
  [128, { orderwindow: 1, driveclock: 1, queenoutside: 1 }],
  [155, { cerealbowl: 1, eatenqueue: 1, threehundredticket: 1, namedgloinks: 3 }],
  [37, { trainingtv: 1, restraintchair: 1, maskflash: 2 }],
  [130, { backdoor: 1, trashbag: 1, removedmask: 1 }],
  [72, { jaxcar: 1, jaxplate: 1, discardedhat: 1, timeclock: 1 }],
  [129, { timesheet: 1, clockrack: 1 }],
  [156, { darkrestaurant: 1, closingchecklist: 1, clockoutcard: 1 }],
  [157, { discardedmask: 1, frontdoor: 1 }],
  [131, { streetlamp: 1, curb: 1, oncomingtruck: 1 }],
  [132, { reviewgrade: 1, reviewboard: 1, kingergrade: 1, caineglitch: 1 }],
  [158, { hallucinationgangle: 1 }]
]);
for (const [zone, targets] of episodeFourTargets) {
  const props = OS.getCircusZoneProps(zone);
  for (const [target, expectedCount] of Object.entries(targets)) {
    const count = getTargetCount(props, target);
    if (count < expectedCount) failures.push(`EP4 FPS ${zone}: ${target} ${count}/${expectedCount}`);
  }
}
if (OS.getCircusZoneProps(37).filter(prop => prop.kind === 'toyglove').length !== 4) {
  failures.push('EP4 FPS 37: quatre mains geantes attendues');
}
const physicalSpudsyZones = [...episodeFourPhysicalGraph.keys()];
for (const zone of physicalSpudsyZones) {
  if (OS.getCircusZoneSprites(zone).some(sprite => (sprite.avatar || sprite.type) === 'kinger')) {
    failures.push(`EP4 FPS ${zone}: Kinger ne doit pas travailler chez Spudsy`);
  }
}
if (!OS.getCircusZoneSprites(10).some(sprite => (sprite.avatar || sprite.type) === 'orbsman')) {
  failures.push('EP4 FPS 10: Orbsman absent du petit-dejeuner');
}
if (OS.getCircusZoneSprites(11).some(sprite => (sprite.avatar || sprite.type) === 'orbsman')) {
  failures.push('EP4 FPS 11: Orbsman encore range dans les variantes');
}
const trainingRoster = OS.getCircusZoneSprites(37).map(sprite => sprite.avatar || sprite.type);
if (trainingRoster.length !== 1 || trainingRoster[0] !== 'spudsyjax') {
  failures.push(`EP4 FPS 37: roster de formation incorrect (${trainingRoster.join(', ')})`);
}
const reviewRoster = new Set(OS.getCircusZoneSprites(132).map(sprite => sprite.avatar || sprite.type));
if (reviewRoster.size !== 2 || !reviewRoster.has('caine') || !reviewRoster.has('workgangle')) {
  failures.push(`EP4 FPS 132: roster d evaluation incorrect (${[...reviewRoster].join(', ')})`);
}
for (const zone of [128, 155]) {
  const queen = OS.getCircusZoneSprites(zone).find(sprite => (sprite.avatar || sprite.type) === 'gloinkqueenscale');
  if (!queen || Number(queen.sizeScale) < 2.5) failures.push(`EP4 FPS ${zone}: echelle de la Gloink Queen insuffisante`);
}
for (let zone = 0; zone <= fpsZoneMax; zone += 1) {
  for (const sprite of OS.getCircusZoneSprites(zone)) {
    const avatar = sprite.avatar || sprite.type;
    if (avatar === 'spudsycustomer') failures.push(`EP4 FPS ${zone}: faux client Spudsy actif`);
    if (avatar === 'albertspudsy' && !sprite.silent) failures.push(`EP4 FPS ${zone}: Albert Spudsy traite comme PNJ parlant`);
  }
}
const episodeFiveCampaign = OS.getCircusFpsCampaignDefinition(5);
const episodeFiveExpectedZones = [28, 159, 24, 160, 26, 161, 25, 162, 163, 164, 165, 110, 166, 167, 168, 169, 170];
const episodeFiveActualZones = (episodeFiveCampaign?.stages || []).map(stage => stage.zone);
if (episodeFiveCampaign?.version !== 2) failures.push('EP5 FPS: version de campagne 2 absente');
if (episodeFiveCampaign?.stages?.length !== episodeFiveExpectedZones.length) {
  failures.push(`EP5 FPS: ${episodeFiveCampaign?.stages?.length ?? 0}/${episodeFiveExpectedZones.length} actes montres attendus`);
}
if (JSON.stringify(episodeFiveActualZones) !== JSON.stringify(episodeFiveExpectedZones)) {
  failures.push(`EP5 FPS: chronologie de zones incorrecte (${episodeFiveActualZones.join(', ')})`);
}
if ((episodeFiveCampaign?.stages || []).some(stage => /deux bombes|two bombs|debrief/i.test(`${stage.title} ${stage.guide}`))) {
  failures.push('EP5 FPS: evenement invente encore present dans la campagne');
}
for (const zone of [11, 12, 24, 25, 26, 110, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170]) {
  const room = canonRoomDefinitions[zone];
  if (!room?.nonPhysical || (room?.exits || []).length) {
    failures.push(`EP5 FPS ${zone}: coupe/reconstruction reliee au graphe physique`);
  }
}
if (!/71:\s*\{\s*exits:\s*\[\],\s*motif:\s*'snow',\s*size:\s*19,\s*nonPhysical:\s*true\s*\}/.test(source)) {
  failures.push('EP5 FPS 71: toundra non confirmee encore reliee au lightning round');
}
const suggestionRoster = OS.getCircusZoneSprites(11).map(sprite => sprite.avatar || sprite.type);
if (JSON.stringify(suggestionRoster) !== JSON.stringify(['caine', 'zooble'])) {
  failures.push(`EP5 FPS 11: selecteur CainOS peuple de personnages non montres (${suggestionRoster.join(', ')})`);
}
const freeFieldProps = OS.getCircusZoneProps(12);
if (freeFieldProps.filter(prop => prop.kind === 'base').length !== 3) {
  failures.push('EP5 FPS 12: le terrain libre doit contenir exactement trois bases');
}
if (OS.getCircusZoneSprites(12).some(sprite => (sprite.avatar || sprite.type) === 'maidjax')) {
  failures.push('EP5 FPS 12: Maid Jax ne doit pas apparaitre dans la vue libre initiale');
}
if (getTargetCount(OS.getCircusZoneProps(24), 'preytrace') !== 5) {
  failures.push('EP5 FPS 24: cinq traces de proies attendues');
}
const bombStateProps = OS.getCircusZoneProps(161);
if (getTargetCount(bombStateProps, 'spiderbomb') !== 1 || getTargetCount(bombStateProps, 'bombwire') !== 2) {
  failures.push('EP5 FPS 161: une bombe araignee et deux fils exactement attendus');
}
const stargazingProps = OS.getCircusZoneProps(163);
const stargazingRoster = new Set(OS.getCircusZoneSprites(163).map(sprite => sprite.avatar || sprite.type));
for (const avatar of ['pomni', 'jax', 'ragatha', 'kinger', 'gangle', 'zooble']) {
  if (!stargazingRoster.has(avatar)) failures.push(`EP5 FPS 163: ${avatar} absent du pique-nique nocturne`);
}
if (stargazingRoster.has('sun') || getTargetCount(stargazingProps, 'firefly') !== 3) {
  failures.push('EP5 FPS 163: ciel nocturne ou trois lucioles incorrects');
}
const observationRoster = OS.getCircusZoneSprites(164);
const jeffery = observationRoster.find(sprite => (sprite.avatar || sprite.type) === 'jeffery');
if (!jeffery?.silent || !observationRoster.some(sprite => (sprite.avatar || sprite.type) === 'caine')
  || !observationRoster.some(sprite => (sprite.avatar || sprite.type) === 'bubble')) {
  failures.push('EP5 FPS 164: plan Caine, Bubble et Jeffery silencieux incomplet');
}
const barOpeningRoster = new Set(OS.getCircusZoneSprites(110).map(sprite => sprite.avatar || sprite.type));
if (getTargetCount(OS.getCircusZoneProps(110), 'drinkorder') !== 3
  || ['caine', 'bubble', 'disappearingguy'].some(avatar => barOpeningRoster.has(avatar))) {
  failures.push('EP5 FPS 110: commandes ou distribution du debut du bar incorrectes');
}
const barEndingRoster = new Set(OS.getCircusZoneSprites(166).map(sprite => sprite.avatar || sprite.type));
if (!barEndingRoster.has('disappearingguy') || !barEndingRoster.has('bubble') || barEndingRoster.has('caine')) {
  failures.push('EP5 FPS 166: fin du bar sans Disappearing Guy/Bubble ou avec Caine');
}
const teamRoster = OS.getCircusZoneSprites(167);
const evilOrbsman = teamRoster.find(sprite => (sprite.avatar || sprite.type) === 'rivalbaseballpinkgiant');
if (!evilOrbsman?.aliases?.includes('evilorbsman') || teamRoster.some(sprite => /pink giant/i.test(sprite.name || ''))) {
  failures.push('EP5 FPS 167: Evil Orbsman mal identifie dans le roster adverse');
}
const maidInningRoster = new Set(OS.getCircusZoneSprites(168).map(sprite => sprite.avatar || sprite.type));
if (!maidInningRoster.has('maidjax') || maidInningRoster.has('baseballjax')) {
  failures.push('EP5 FPS 168: Jax doit utiliser uniquement sa variante maid');
}
const homeRunLabels = OS.getCircusZoneProps(169)
  .filter(prop => getCampaignTarget(prop) === 'homerun')
  .map(prop => prop.label);
if (JSON.stringify(homeRunLabels) !== JSON.stringify(['Home run 1 / Gangle', 'Home run 2 / Zooble', 'Home run 3 / Ragatha'])) {
  failures.push(`EP5 FPS 169: ordre des home runs incorrect (${homeRunLabels.join(', ')})`);
}
const finalStateProps = OS.getCircusZoneProps(170);
const returnPortal = finalStateProps.find(prop => getCampaignTarget(prop) === 'returnportal');
if (!returnPortal || returnPortal.kind !== 'caineportal' || returnPortal.target !== 28
  || getTargetCount(finalStateProps, 'unknownsignal') !== 1) {
  failures.push('EP5 FPS 170: victoire, signal inconnu ou portail final incorrect');
}
const episodeSixCampaign = OS.getCircusFpsCampaignDefinition(6);
const episodeSixExpectedZones = [122, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191];
const episodeSixActualZones = (episodeSixCampaign?.stages || []).map(stage => stage.zone);
if (episodeSixCampaign?.version !== 2) failures.push('EP6 FPS: version de campagne 2 absente');
if (episodeSixCampaign?.stages?.length !== episodeSixExpectedZones.length) {
  failures.push(`EP6 FPS: ${episodeSixCampaign?.stages?.length ?? 0}/${episodeSixExpectedZones.length} actes montres attendus`);
}
if (JSON.stringify(episodeSixActualZones) !== JSON.stringify(episodeSixExpectedZones)) {
  failures.push(`EP6 FPS: chronologie de zones incorrecte (${episodeSixActualZones.join(', ')})`);
}
for (let zone = 171; zone <= 191; zone += 1) {
  const room = canonRoomDefinitions[zone];
  if (!room) {
    failures.push(`EP6 FPS ${zone}: etat temporel absent`);
  } else if (!room.nonPhysical || (room.exits || []).length || room.layer !== 'time-state' && room.layer !== 'cut') {
    failures.push(`EP6 FPS ${zone}: coupe temporelle reliee au graphe physique`);
  }
}
const episodeSixTargetContract = new Map([
  [171, { awardtease: 1, exerciseboard: 1 }],
  [172, { privacywall: 2, loadedgun: 1 }],
  [173, { teamcard: 3, countdown: 1, ragathalife: 1 }],
  [174, { butterflyheal: 1, missingheart: 1 }],
  [175, { hallcover: 3, shotcan: 1 }],
  [176, { balconyrail: 2, sniperposition: 1 }],
  [177, { flagderringer: 1, ragathahearts: 1 }],
  [178, { ak74: 1, maskkeeper: 1 }],
  [179, { ricochet: 3, lighter: 1 }],
  [180, { aquariumwindow: 1, bubblecamera: 1 }],
  [181, { piperoute: 3, tommygun: 1 }],
  [182, { snipershot: 1, brokencomedymask: 1, collapsedpipe: 1 }],
  [183, { archiveplate: 3, zooblelock: 1 }],
  [184, { zoobleweapon: 4, flashbang: 1, daisykey: 1 }],
  [185, { discardedweapon: 4, finalsniper: 1 }],
  [186, { twowinners: 1, betrayalprompt: 1 }],
  [187, { funeralmemory: 1 }],
  [188, { auditoriumdoor: 1, awardposter: 1 }],
  [189, { awardtitle: 1, honorablementions: 1 }],
  [190, { bathroommirror: 1, toiletstall: 1 }],
  [191, { favoriteaward: 1, cainevote: 1, finalglitch: 1, returnportal: 1 }]
]);
for (const [zone, targets] of episodeSixTargetContract) {
  const props = OS.getCircusZoneProps(zone);
  for (const [target, expectedCount] of Object.entries(targets)) {
    const count = getTargetCount(props, target);
    if (count !== expectedCount) failures.push(`EP6 FPS ${zone}: ${target} ${count}/${expectedCount}`);
  }
}
const episodeSixRosterContract = new Map([
  [172, ['caine', 'jax', 'zooble']],
  [174, ['kinger', 'ragatha']],
  [176, ['gangle', 'zooble']],
  [178, ['gangle', 'zooble']],
  [179, ['jax', 'kinger', 'pomni']],
  [180, ['bubble', 'kinger', 'ragatha']],
  [181, ['gangle', 'jax', 'pomni', 'zooble']],
  [184, ['jax', 'pomni', 'zooble']],
  [186, ['jax', 'pomni']],
  [187, ['jax', 'pomni']],
  [190, ['disappearingguy', 'jax']],
  [191, ['bubble', 'caine', 'committeemember', 'ming', 'zooble']]
]);
for (const [zone, expected] of episodeSixRosterContract) {
  const actual = OS.getCircusZoneSprites(zone).map(sprite => sprite.avatar || sprite.type).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    failures.push(`EP6 FPS ${zone}: roster incorrect (${actual.join(', ')})`);
  }
}
const teamFormationRoster = new Set(OS.getCircusZoneSprites(173).map(sprite => sprite.avatar || sprite.type));
for (const avatar of ['caine', 'pomni', 'ragatha', 'jax', 'kinger', 'gangle', 'zooble']) {
  if (!teamFormationRoster.has(avatar)) failures.push(`EP6 FPS 173: ${avatar} absent de la formation des equipes`);
}
if (teamFormationRoster.has('bubble') || teamFormationRoster.size !== 7) {
  failures.push('EP6 FPS 173: distribution de formation des equipes incorrecte');
}
const zoobleSiegeWeapons = OS.getCircusZoneProps(184)
  .filter(prop => getCampaignTarget(prop) === 'zoobleweapon')
  .map(prop => prop.label);
for (const weapon of ['AK-74', 'Thompson', 'Uzi', 'M16A1']) {
  if (!zoobleSiegeWeapons.some(label => label.includes(weapon))) failures.push(`EP6 FPS 184: arme de Zooble absente (${weapon})`);
}
const episodeSixReturnPortal = OS.getCircusZoneProps(191).find(prop => getCampaignTarget(prop) === 'returnportal');
if (!episodeSixReturnPortal || episodeSixReturnPortal.kind !== 'caineportal' || episodeSixReturnPortal.target !== 28) {
  failures.push('EP6 FPS 191: portail final vers le Tent incorrect');
}
if (!OS.getCircusZoneProps(180).some(prop => getCampaignTarget(prop) === 'aquariumwindow')
  || OS.getCircusZoneSprites(180).some(sprite => (sprite.avatar || sprite.type) === 'aquaticabstraction')) {
  failures.push('EP6 FPS 180: Loser Corner confondu avec l aquarium de Remember');
}
const episodeSevenCampaign = OS.getCircusFpsCampaignDefinition(7);
const episodeSevenExpectedZones = [
  192, 193, 194, 197, 195, 196, 215, 216, 198, 199, 200, 201, 202, 203,
  204, 205, 206, 207, 208, 209, 217, 210, 218, 211, 212, 219, 213, 214
];
const episodeSevenActualZones = (episodeSevenCampaign?.stages || []).map(stage => stage.zone);
if (episodeSevenCampaign?.version !== 2) failures.push('EP7 FPS: version de campagne 2 absente');
if (episodeSevenCampaign?.stages?.length !== episodeSevenExpectedZones.length) {
  failures.push(`EP7 FPS: ${episodeSevenCampaign?.stages?.length ?? 0}/${episodeSevenExpectedZones.length} actes montres attendus`);
}
if (JSON.stringify(episodeSevenActualZones) !== JSON.stringify(episodeSevenExpectedZones)) {
  failures.push(`EP7 FPS: chronologie de zones incorrecte (${episodeSevenActualZones.join(', ')})`);
}
for (const zone of episodeSevenExpectedZones) {
  const room = canonRoomDefinitions[zone];
  if (!room) {
    failures.push(`EP7 FPS ${zone}: etat temporel absent`);
  } else if (!room.nonPhysical || (room.exits || []).length
    || !['time-state', 'cut', 'mind'].includes(room.layer)) {
    failures.push(`EP7 FPS ${zone}: coupe temporelle reliee au graphe physique`);
  }
}
const episodeSevenTargetContract = new Map([
  [192, { hidinglid: 1 }],
  [193, { chinesedoor: 1, writtenreply: 1 }],
  [194, { changingbooth: 1, shade: 1 }],
  [197, { watermelonjax: 1, jaxlounge: 1, ragathaeye: 1 }],
  [195, { emptychest: 1, missingeye: 1 }],
  [196, { shrimpsizzle: 1 }],
  [215, { hidingrock: 1, shrimpscorch: 1 }],
  [216, { blacktriangle: 1, greenhand: 1, hallucinationface: 3 }],
  [198, { doorbell: 1, abelblank: 1, keybucket: 1 }],
  [199, { keyring: 1, chineseinnerdoor: 1 }],
  [200, { abelclaim: 3 }],
  [201, { drawnface: 1, keydiagram: 1 }],
  [202, { salmonmenu: 1, keyattempt: 1 }],
  [203, { routeanchor: 1, adminwallportal: 1 }],
  [204, { macroversephoto: 3, jaxkey: 1 }],
  [205, { jaxkey: 1 }],
  [206, { adminpass: 6 }],
  [207, { passflare: 6 }],
  [208, { cubeanchor: 3, jaxball: 1, upwardslot: 1 }],
  [209, { purposeorb: 1 }],
  [217, { officekeycard: 1, officedoor: 1, grandstairs: 1, adventureglobe: 4 }],
  [210, { bookcase: 1, secretdoor: 1 }],
  [218, { armature: 4, columnpath: 3, terminaldoor: 1 }],
  [211, { mainconsole: 1 }],
  [212, { redbutton: 1, bluebutton: 1 }],
  [219, { redscreen: 1, whitevoid: 1 }],
  [213, { fabricationreveal: 1, deletepulse: 1, hotdoglocket: 1 }],
  [214, { giftbasket: 1, scratchquestion: 1 }]
]);
for (const [zone, targets] of episodeSevenTargetContract) {
  const props = OS.getCircusZoneProps(zone);
  for (const [target, expectedCount] of Object.entries(targets)) {
    const count = getTargetCount(props, target);
    if (count !== expectedCount) failures.push(`EP7 FPS ${zone}: ${target} ${count}/${expectedCount}`);
  }
}
const episodeSevenRosterContract = new Map([
  [192, ['caine', 'gangle', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [193, ['bubble', 'caine', 'gangle', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [194, ['beachgangle', 'kinger', 'pomni', 'ragatha', 'sun', 'zooble']],
  [197, ['beachgangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [195, ['liarfish', 'pomni', 'truthtellerfish']],
  [196, ['jax', 'pomni', 'sun', 'zooble']],
  [215, ['abelmannequin', 'pomni']],
  [216, ['jax']],
  [198, ['abelmannequin', 'jax', 'pomni', 'ragatha']],
  [199, ['abelmannequin', 'chineseroomnpc', 'jax', 'pomni', 'zooble']],
  [200, ['abelmannequin', 'jax', 'pomni', 'zooble']],
  [201, ['abelmannequin', 'jax', 'pomni']],
  [202, ['caine', 'jax']],
  [203, ['abelmannequin', 'pomni', 'ragatha']],
  [204, ['caine', 'jax']],
  [205, ['gangle', 'jax', 'kinger', 'zooble']],
  [206, ['abelmannequin', 'pomni', 'ragatha']],
  [207, ['abelmannequin', 'gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [208, ['abelmannequin', 'kinger', 'pomni']],
  [209, ['bubble', 'caine']],
  [217, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [210, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [218, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [211, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [212, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [219, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [213, ['abelmannequin', 'bubble', 'caine', 'gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [214, ['caine', 'gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']]
]);
for (const [zone, expected] of episodeSevenRosterContract) {
  const actual = OS.getCircusZoneSprites(zone).map(sprite => sprite.avatar || sprite.type).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    failures.push(`EP7 FPS ${zone}: roster incorrect (${actual.join(', ')})`);
  }
}
const ragathaEye = OS.getCircusZoneProps(197).find(prop => getCampaignTarget(prop) === 'ragathaeye');
if (!/Ragatha/i.test(ragathaEye?.label || '') || /Zooble/i.test(ragathaEye?.label || '')) {
  failures.push('EP7 FPS 197: oeil-bouton attribue au mauvais personnage');
}
for (const zone of episodeSevenExpectedZones.slice(0, episodeSevenExpectedZones.indexOf(213))) {
  if (OS.getCircusZoneProps(zone).some(prop => getCampaignTarget(prop) === 'fabricationreveal')) {
    failures.push(`EP7 FPS ${zone}: revelation de l aventure de Caine declenchee trop tot`);
  }
}
const redChoice = OS.getCircusZoneProps(212).find(prop => getCampaignTarget(prop) === 'redbutton');
const blueChoice = OS.getCircusZoneProps(212).find(prop => getCampaignTarget(prop) === 'bluebutton');
if (redChoice?.color !== '#e53935' || blueChoice?.color !== '#2a58d8'
  || !/rester/i.test(redChoice?.label || '') || !/deconnecter/i.test(blueChoice?.label || '')) {
  failures.push('EP7 FPS 212: fonctions ou couleurs des boutons rouge et bleu incorrectes');
}
const choiceStage = episodeSevenCampaign?.stages?.find(stage => stage.zone === 212);
if (!choiceStage?.requirements?.some(item => item.action === 'use' && item.target === 'redbutton')
  || choiceStage.requirements.some(item => item.action === 'use' && item.target === 'bluebutton')) {
  failures.push('EP7 FPS 212: la campagne ne reproduit pas le choix rouge de Jax');
}
const finalScratchProp = OS.getCircusZoneProps(214).find(prop => getCampaignTarget(prop) === 'scratchquestion');
if (!/question/i.test(finalScratchProp?.label || '')
  || OS.getCircusZoneSprites(214).some(sprite => (sprite.avatar || sprite.type) === 'scratch')) {
  failures.push('EP7 FPS 214: Scratch doit rester une question de Kinger, pas un PNJ restaure');
}
if (OS.getCircusZoneProps(214).some(prop => getCampaignTarget(prop) === 'returnportal')) {
  failures.push('EP7 FPS 214: portail de retour invente dans l espace final');
}
for (const [zone, target] of [[44, 'doorbell'], [94, 'adminpass'], [96, 'jaxkey'], [16, 'giftbasket']]) {
  const fixedProps = OS.getCircusZoneProps(zone).filter(prop => getCampaignTarget(prop) === target);
  if (!fixedProps.length || fixedProps.some(prop => OS.isCircusPropPortable(prop))) {
    failures.push(`EP7 FPS ${zone}: accessoire fixe ${target} encore ramassable`);
  }
}
const episodeEightCampaign = OS.getCircusFpsCampaignDefinition(8);
const episodeEightExpectedZones = [
  220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233,
  234, 235, 236, 237, 238, 239, 240, 111, 112, 124, 241, 242, 118, 114,
  115, 116, 117, 243, 244, 119
];
const episodeEightActualZones = (episodeEightCampaign?.stages || []).map(stage => stage.zone);
if (episodeEightCampaign?.version !== 2) failures.push('EP8 FPS: version de campagne 2 absente');
if (episodeEightCampaign?.stages?.length !== episodeEightExpectedZones.length) {
  failures.push(`EP8 FPS: ${episodeEightCampaign?.stages?.length ?? 0}/${episodeEightExpectedZones.length} actes montres attendus`);
}
if (JSON.stringify(episodeEightActualZones) !== JSON.stringify(episodeEightExpectedZones)) {
  failures.push(`EP8 FPS: chronologie de zones incorrecte (${episodeEightActualZones.join(', ')})`);
}
for (let zone = 220; zone <= 244; zone += 1) {
  const room = canonRoomDefinitions[zone];
  if (!room) {
    failures.push(`EP8 FPS ${zone}: couche temporelle absente`);
  } else if (!room.nonPhysical || (room.exits || []).length
    || !['projection', 'memory', 'time-state', 'cut'].includes(room.layer)) {
    failures.push(`EP8 FPS ${zone}: couche temporelle reliee au graphe physique`);
  }
}
const episodeEightTargetContract = new Map([
  [220, { trainingimage: 6 }],
  [221, { redbluefusion: 1, firsttent: 1 }],
  [222, { memberstation: 3 }],
  [223, { reunionmemory: 1 }],
  [224, { queeniefracture: 1, cellardrop: 1 }],
  [225, { arrivalportal: 1 }],
  [226, { redchoiceecho: 1 }],
  [227, { groupcircle: 1 }],
  [228, { faultvoice: 3 }],
  [229, { godpulse: 1, redblueeye: 2 }],
  [230, { adventurebrief: 1 }],
  [231, { showpiano: 1, mouthseal: 3 }],
  [232, { coerciongag: 6 }],
  [233, { adventureportal: 3, brainextractor: 1 }],
  [234, { shreddedtrace: 1, rapidcounter: 1 }],
  [235, { cafestool: 6, stabbedreturn: 1 }],
  [236, { kingersbucket: 1, darkcanopy: 1 }],
  [237, { caorigin: 1, scratcharchive: 1 }],
  [238, { plansigil: 1, exitdiagram: 1 }],
  [239, { conjuredexit: 1 }],
  [240, { dentalfloss: 1, redcar: 1 }],
  [111, { bowlingrifle: 1, bowlingpin: 3 }],
  [112, { humantree: 1, humanglob: 1 }],
  [124, { portablepc: 1, calogo: 1 }],
  [241, { tangledgroup: 1, absencecheck: 1 }],
  [242, { multiarmpulse: 1, wallpin: 5 }],
  [118, { crocodile: 1 }],
  [114, { centipedetable: 1, mothersilhouette: 1 }],
  [115, { paintedmasks: 1, memorytruck: 1 }],
  [116, { blackmirror: 2, zooblepartpile: 1 }],
  [117, { laughingshadow: 1, skinpeel: 1 }],
  [243, { authlayer: 10, wackylockout: 1 }],
  [244, { deletekey: 1, cainepopup: 1, bubblepopup: 1, purgepulse: 1 }],
  [119, { voidhole: 3 }]
]);
for (const [zone, targets] of episodeEightTargetContract) {
  const props = OS.getCircusZoneProps(zone);
  for (const [target, expectedCount] of Object.entries(targets)) {
    const count = getTargetCount(props, target);
    if (count !== expectedCount) failures.push(`EP8 FPS ${zone}: ${target} ${count}/${expectedCount}`);
  }
}
const episodeEightRosterContract = new Map([
  [222, ['bizco', 'kinger', 'queenie', 'rattie', 'scratch', 'spike', 'wormo']],
  [225, ['caine', 'kinger', 'ragatha']],
  [228, ['bubble', 'caine']],
  [230, ['caine', 'gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [235, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']],
  [240, ['caine', 'jax']],
  [241, ['bubble', 'caine', 'gangle', 'jax', 'pomni', 'ragatha', 'zooble']],
  [242, ['gangle', 'jax', 'monstrouscaine', 'pomni', 'ragatha', 'zooble']],
  [243, ['kinger']],
  [244, ['caine', 'kinger']],
  [119, ['gangle', 'jax', 'kinger', 'pomni', 'ragatha', 'zooble']]
]);
for (const [zone, expected] of episodeEightRosterContract) {
  const actual = OS.getCircusZoneSprites(zone).map(sprite => sprite.avatar || sprite.type).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    failures.push(`EP8 FPS ${zone}: roster incorrect (${actual.join(', ')})`);
  }
}
if (OS.getCircusZoneSprites(220).length || OS.getCircusZoneSprites(221).length) {
  failures.push('EP8 FPS: la genese abstraite ne doit pas contenir de PNJ physiques');
}
if (OS.getCircusZoneSprites(225).some(sprite => (sprite.avatar || sprite.type) === 'pomni')) {
  failures.push('EP8 FPS 225: Pomni apparait avant son arrivee dans le Cirque');
}
const jaxTormentSprites = OS.getCircusZoneSprites(117);
if (!jaxTormentSprites.some(sprite => sprite.avatar === 'peeledjax')
  || jaxTormentSprites.some(sprite => sprite.avatar === 'jax')) {
  failures.push('EP8 FPS 117: etat temporaire peeled Jax absent ou remplace par Jax normal');
}
const deadTentProps = OS.getCircusZoneProps(119);
const deadTentRoster = new Set(OS.getCircusZoneSprites(119).map(sprite => sprite.avatar || sprite.type));
if (deadTentProps.some(prop => prop.kind === 'crate' || getCampaignTarget(prop) === 'stableform')
  || deadTentRoster.has('caine') || deadTentRoster.has('bubble')) {
  failures.push('EP8 FPS 119: etat final contamine par la reparation de Remember ou par Caine/Bubble');
}
if (JSON.stringify(canonRoomDefinitions[119]?.floorPalette) !== JSON.stringify(['#29292d', '#434349', '#050507'])
  || JSON.stringify(canonRoomDefinitions[119]?.horizonPalette) !== JSON.stringify(['#4f4f55', '#161619'])) {
  failures.push('EP8 FPS 119: palette monochrome du chapiteau mort absente');
}
const deadTentShell = deadTentProps.find(prop => prop.kind === 'tent');
if (!deadTentShell || deadTentShell.color !== '#65656b' || deadTentShell.accent !== '#8d8d93'
  || deadTentShell.doorColor !== '#4b4b50' || deadTentShell.flagColor !== '#6c6c72'
  || deadTentShell.roofColorA !== '#56565c' || deadTentShell.roofColorB !== '#7a7a80') {
  failures.push('EP8 FPS 119: coque du chapiteau mort encore coloree');
}
if (!Array.isArray(canonRoomDefinitions[121]?.floorPalette)
  || !Array.isArray(canonRoomDefinitions[121]?.horizonPalette)) {
  failures.push('EP9 FPS 121: palette monochrome du chapiteau detruit absente');
}
if (!OS.getCircusZoneProps(239).some(prop => getCampaignTarget(prop) === 'conjuredexit' && prop.kind === 'pilotexitdoor')) {
  failures.push('EP8 FPS 239: porte EXIT du Pilote non reutilisee');
}
if (OS.getCircusZoneSprites(233).some(sprite => !sprite.silent && (sprite.avatar || sprite.type) !== 'caine')) {
  failures.push('EP8 FPS 233: figurants du montage transformes en interlocuteurs actifs');
}
const legacyCandyStoryActors = new Set(['gummigoo', 'max', 'chad', 'loolilalu', 'fudge', 'pomni']);
if (OS.getCircusZoneSprites(6).some(sprite => legacyCandyStoryActors.has(sprite.avatar || sprite.type))) {
  failures.push('EP2 FPS 6: ancien regroupement generique des personnages Candy encore actif');
}
if (OS.getCircusZoneSprites(7).length) {
  failures.push('EP2 FPS 7: les modeles de compatibilite doivent rester inertes');
}
if ((canonRoomDefinitions[98]?.exits || []).includes(73) || (canonRoomDefinitions[99]?.exits || []).includes(73)) {
  failures.push('EP1/EP9 FPS: le flashback scanner 73 ne doit pas couper la boucle de fausse sortie');
}
if (!(canonRoomDefinitions[85]?.exits || []).includes(64)) {
  failures.push('EP3 FPS: le vestibule ne raccorde pas l etage Mildenhall reconstruit');
}
const forcedDeletionEvent = OS.getCircusZoneAmbientEvent(2, {
  forcedAmbientEvent: {
    zoneId: 2,
    startedAt: 0,
    until: 1800,
    event: { id: 'gummigoo_delete', label: 'NPC DELETE', detail: 'test', color: '#d8a23a' }
  }
});
if (forcedDeletionEvent?.id !== 'gummigoo_delete') {
  failures.push('EP2 FPS: VFX force de suppression de Gummigoo absent');
}
const spawnContext = { circusDoom: { room: { center: { x: 10, z: 10 } } } };
const restaurantSpawn = OS.getCircusAuthoredSpawn.call(spawnContext, 120);
const feastSpawn = OS.getCircusAuthoredSpawn.call(spawnContext, 43);
if (restaurantSpawn?.z !== 12 || restaurantSpawn?.revision !== 1 || restaurantSpawn?.a !== -Math.PI / 2) {
  failures.push('EP1 FPS 120: point d arrivee cadre invalide');
}
if (feastSpawn?.z !== 12.35 || feastSpawn?.revision !== 1 || feastSpawn?.a !== -Math.PI / 2) {
  failures.push('EP1 FPS 43: point d arrivee cadre invalide');
}
const episodeFourSpawnOffsets = new Map([
  [10, 2.4],
  [35, 2.3],
  [37, 1.9],
  [72, 2.6],
  [127, 1.8],
  [128, 2.0],
  [129, 1.7],
  [130, 2.0],
  [131, 2.0],
  [132, 1.5],
  [153, 2.2],
  [154, 2.2],
  [155, 2.0],
  [156, 1.9],
  [157, 1.2],
  [158, 1.6]
]);
for (const [zone, offset] of episodeFourSpawnOffsets) {
  const spawn = OS.getCircusAuthoredSpawn.call(spawnContext, zone);
  if (spawn?.x !== 10 || spawn?.z !== 10 + offset || spawn?.revision !== 2 || spawn?.a !== -Math.PI / 2) {
    failures.push(`EP4 FPS ${zone}: point d arrivee cadre invalide`);
  }
}
const localGameplayContracts = new Map([
  [35, [['take', 'card'], ['use', 'counter'], ['give', 'card']]],
  [85, [['look', 'stairs'], ['look', 'console'], ['talk', 'ghostly']]],
  [86, [['look', 'doorframe'], ['talk', 'jax'], ['talk', 'gangle']]],
  [151, [['talk', 'kinger'], ['talk', 'pomni'], ['look', 'memory']]],
  [152, [['talk', 'zooble'], ['look', 'wallart'], ['use', 'card'], ['look', 'gridnode']]]
]);
for (const [zone, expectedSteps] of localGameplayContracts) {
  const actualSteps = OS.getCircusZoneGameplayConfig(zone)?.steps || [];
  const signature = actualSteps.map(step => [step.action, step.kind]);
  if (JSON.stringify(signature) !== JSON.stringify(expectedSteps)) {
    failures.push(`FPS ${zone}: contrat d actions locales incorrect (${JSON.stringify(signature)})`);
  }
}
const savedArchiveDetector = OS.isCircusBedroomArchived;
try {
  OS.isCircusBedroomArchived = () => true;
  const archivedJaxProps = OS.getCircusBedroomProps(44) || [];
  if (!archivedJaxProps.some(prop => prop.campaignTarget === 'doorbell')) {
    failures.push('EP7 FPS 44: doorbell absent du replay apres archivage de Jax');
  }
} finally {
  OS.isCircusBedroomArchived = savedArchiveDetector;
}
const episodeOneRoomChecks = new Map([
  [76, ['bathtub', 'toilet', 'sink']],
  [77, ['wave', 'window']],
  [78, ['toyglove', 'toyblock']],
  [79, ['carousel']],
  [80, ['doorframe', 'ring']],
  [81, ['ring', 'archive']],
  [82, ['base', 'archive']],
  [97, ['partition', 'desk', 'crt', 'console', 'watercooler']],
  [98, ['sofa', 'table', 'floorlamp', 'watercooler', 'archive']],
  [99, ['wallart', 'console']],
  [100, ['doorframe', 'exitframe']],
  [120, ['window', 'table', 'plant', 'wackywatch', 'ceilinglight']]
]);
for (const [zone, expectedKinds] of episodeOneRoomChecks) {
  const kinds = new Set(OS.getCircusZoneProps(zone).map(prop => prop.kind));
  for (const kind of expectedKinds) {
    if (!kinds.has(kind)) failures.push(`EP1 FPS ${zone}: decor canonique ${kind} absent`);
  }
}
const officeCubicleProps = OS.getCircusZoneProps(97);
if (officeCubicleProps.filter(prop => prop.kind === 'partition').length < 4) {
  failures.push('EP1 FPS 97: reseau de cloisons de cubicles insuffisant');
}
if (officeCubicleProps.filter(prop => prop.kind === 'desk').length < 4) {
  failures.push('EP1 FPS 97: boucle de postes de travail insuffisante');
}
if (OS.getCircusZoneProps(98).filter(prop => prop.kind === 'sofa').length < 2) {
  failures.push('EP1 FPS 98: salon C&A sans ses deux canapes volumetriques');
}
const episodeOneBaseChecks = new Map([
  [2, ['stagecurtain', 'stagevalance', 'ring']],
  [3, ['tent', 'tower', 'building', 'wave', 'fence', 'plant', 'pilotexitdoor']],
  [4, ['cellaropening', 'eye']],
  [5, ['pilotexitdoor', 'exitframe']],
  [31, ['gloinknest', 'zooblepart', 'caveglow', 'caveslide', 'escalator']],
  [43, ['banquettable', 'feastplatter', 'stagecurtain', 'stagevalance']]
]);
for (const [zone, expectedKinds] of episodeOneBaseChecks) {
  const kinds = new Set(OS.getCircusZoneProps(zone).map(prop => prop.kind));
  for (const kind of expectedKinds) {
    if (!kinds.has(kind)) failures.push(`EP1 FPS ${zone}: element ${kind} absent`);
  }
}
if (OS.getCircusZoneProps(5).filter(prop => prop.kind === 'exitframe').length < 3) {
  failures.push('EP1 FPS 5: le labyrinthe ne contient pas ses trois cadres testables');
}
if (!OS.getCircusZoneProps(3).some(prop => prop.kind === 'pilotexitdoor' && prop.unstable)) {
  failures.push('EP1 FPS 3: la porte EXIT du tour doit rester instable');
}
if (OS.getCircusZoneProps(43).filter(prop => prop.kind === 'feastplatter').length !== 4) {
  failures.push('EP1 FPS 43: quatre services du banquet attendus');
}
const feastGameplayKinds = new Set(OS.getCircusZoneGameplayConfig(43)?.steps?.map(step => step.kind) || []);
for (const kind of ['banquettable', 'feastplatter']) {
  if (!feastGameplayKinds.has(kind)) failures.push(`EP1 FPS 43: gameplay du festin sans ${kind}`);
}
const kaufmoGameplayKinds = new Set(OS.getCircusZoneGameplayConfig(52)?.steps?.map(step => step.kind) || []);
for (const kind of ['graffiti', 'crt', 'wallart']) {
  if (!kaufmoGameplayKinds.has(kind)) failures.push(`EP1 FPS 52: gameplay Kaufmo sans ${kind}`);
}
const kaufmoRoom = OS.getCircusBedroomDefinitions()[52];
if (kaufmoRoom?.gateEpisode !== 1 || kaufmoRoom?.gateSubepisode !== 4 || kaufmoRoom?.motif !== 'kaufmoroom') {
  failures.push('EP1 FPS: chambre de Kaufmo verrouillee hors de sa scene du PILOT');
}
const kaufmoProps = OS.getCircusZoneProps(52);
if (kaufmoProps.filter(prop => prop.kind === 'graffiti').length < 5 || !kaufmoProps.some(prop => prop.kind === 'crt') || kaufmoProps.some(prop => prop.kind === 'bed')) {
  failures.push('EP1 FPS: chambre de Kaufmo non conforme aux graffiti EXIT et au mobilier montre');
}
const carouselProps = OS.getCircusZoneProps(79).filter(prop => prop.kind === 'carousel');
if (carouselProps.length < 8 || new Set(carouselProps.map(prop => prop.elevation || 0)).size < 5) {
  failures.push('EP1 FPS: le vide des carrousels ne restitue pas les empilements verticaux du PILOT');
}
const dormProps = OS.getCircusZoneProps(20);
if (dormProps.filter(prop => prop.kind === 'wallart').length < 12) failures.push('EP1 FPS: tableaux du couloir des chambres insuffisants');
if (dormProps.filter(prop => prop.kind === 'ceilinglight' && prop.fixture === 'dome').length < 7) failures.push('EP1 FPS: plafonniers ronds du dortoir absents');
const groundsAvatars = new Set(OS.getCircusZoneSprites(3).map(sprite => sprite.avatar || sprite.type));
if (groundsAvatars.has('gloinkqueenscale')) failures.push('EP1 FPS: Gloink Queen placee a tort sur le Grounds');
const cellarAvatars = new Set(OS.getCircusZoneSprites(4).map(sprite => sprite.avatar || sprite.type));
for (const avatar of ['pomni', 'ragatha', 'zooble', 'gloinkround']) {
  if (cellarAvatars.has(avatar)) failures.push(`EP1 FPS: ${avatar} ne doit pas etre resident actif du Cellar`);
}
const cellarEvents = OS.getCircusDynamicEventDefinitions(4);
if (cellarEvents.some(event => event.avatar || event.avatars?.length || event.channel !== 'system')) {
  failures.push('EP1 FPS: le Cellar fait apparaitre ou parler un resident absent de l ouverture finale');
}
const exitMazeAvatars = OS.getCircusZoneSprites(5).map(sprite => sprite.avatar || sprite.type);
if (exitMazeAvatars.length !== 1 || exitMazeAvatars[0] !== 'pomni') {
  failures.push('EP1 FPS: la fausse sortie doit isoler Pomni du reste du groupe');
}
if (OS.getCircusDynamicEventDefinitions(5).some(event => event.avatar && event.avatar !== 'pomni')) {
  failures.push('EP1 FPS: un personnage autre que Pomni apparait physiquement dans la fausse sortie');
}
const nestAvatars = new Set(OS.getCircusZoneSprites(31).map(sprite => sprite.avatar || sprite.type));
for (const avatar of ['jax', 'kinger', 'gangle', 'zooble', 'gloinkqueenscale', 'gloinkstar', 'gloinkcube', 'gloinkpyramid', 'gloinkcrescent', 'gloinkpin', 'gloinkround']) {
  if (!nestAvatars.has(avatar)) failures.push(`EP1 FPS: ${avatar} absent de la scene du Nid`);
}
for (const avatar of ['pomni', 'ragatha']) {
  if (nestAvatars.has(avatar)) failures.push(`EP1 FPS: ${avatar} placee a tort dans le Nid`);
}
const pilotCampaign = OS.getCircusFpsCampaignDefinition(1);
const kaufmoStage = pilotCampaign.stages.find(stage => stage.zone === 52);
if (!kaufmoStage || !kaufmoStage.requirements.some(requirement => requirement.target === 'graffiti')) {
  failures.push('EP1 FPS: acte de la chambre de Kaufmo absent de la campagne');
}
if (pilotCampaign.stages.some(stage => stage.zone === 4 && stage.requirements.some(requirement => requirement.target === 'candle'))) {
  failures.push('EP1 FPS: ancien combat invente dans le Cellar encore actif');
}
const pilotVisitTargets = new Set(pilotCampaign.stages.flatMap(stage => stage.requirements
  .filter(requirement => requirement.action === 'visit')
  .map(requirement => Number(requirement.target))));
for (const zone of [3, 42, 20, 52, 31, 29, 76, 77, 78, 79, 80, 5, 97, 98, 99, 100, 27, 120, 4, 43]) {
  if (!pilotVisitTargets.has(zone)) failures.push(`EP1 FPS: zone ${zone} absente du parcours de campagne`);
}
for (const zone of [76, 77, 78, 79, 80]) {
  if (canonRoomDefinitions[zone]?.provenance !== 'shown') failures.push(`EP1 FPS: piece aleatoire montree ${zone} mal classee`);
}
const restaurantSprites = OS.getCircusZoneSprites(120);
const restaurantAvatars = new Set(restaurantSprites.map(sprite => sprite.avatar || sprite.type));
for (const avatar of ['caine', 'bubble']) {
  if (!restaurantAvatars.has(avatar)) failures.push(`EP1 FPS 120: ${avatar} absent du restaurant`);
}
const restaurantMannequins = restaurantSprites.filter(sprite => sprite.type === 'mannequin');
if (restaurantMannequins.length < 4 || restaurantMannequins.some(sprite => !sprite.silent)) {
  failures.push('EP1 FPS 120: figurants mannequins silencieux insuffisants');
}
if (!OS.getCircusDynamicEventDefinitions(120).some(event => event.id === 'wackywatch-alert' && event.avatar === 'caine')) {
  failures.push('EP1 FPS 120: alerte WackyWatch de Caine absente');
}
const feastSprites = OS.getCircusZoneSprites(43);
const feastAvatars = new Set(feastSprites.map(sprite => sprite.avatar || sprite.type));
for (const avatar of ['jax', 'gangle', 'kinger', 'pomni', 'ragatha', 'zooble', 'bubble']) {
  if (!feastAvatars.has(avatar)) failures.push(`EP1 FPS 43: ${avatar} absent du festin`);
}
if (feastAvatars.has('caine')) failures.push('EP1 FPS 43: Caine ne doit pas etre assis au festin final');
if (!feastSprites.some(sprite => (sprite.avatar || sprite.type) === 'bubble' && sprite.costume === 'chef')) {
  failures.push('EP1 FPS 43: Bubble doit porter sa tenue de chef');
}
if (!feastSprites.some(sprite => (sprite.avatar || sprite.type) === 'pomni' && sprite.silent)) {
  failures.push('EP1 FPS 43: Pomni doit rester silencieuse au centre du plan final');
}
const zoneObjectiveAudit = OS.auditCircusZoneObjectives();
if (!zoneObjectiveAudit.ok) zoneObjectiveAudit.errors.forEach(error => failures.push(`OBJECTIF FPS: ${error}`));
for (const [zoneId] of canonRoomEntries) {
  const zone = Number(zoneId);
  if (!OS.getCircusZoneProps(zone).length) failures.push(`FPS: piece ${zone} sans decor`);
}
for (const zone of [81, 82]) {
  if (canonRoomDefinitions[zone]?.provenance !== 'mentioned') failures.push(`FPS: piece mentionnee ${zone} non balisee comme reconstruction`);
}
for (const zone of [101, 102, 103, 108, 113]) {
  if (canonRoomDefinitions[zone]?.provenance !== 'projection' || !canonRoomDefinitions[zone]?.nonPhysical) {
    failures.push(`FPS: projection non physique ${zone} mal classee`);
  }
}
if (!canonRoomDefinitions[110]?.nonPhysical) {
  failures.push('EP5: transition du bar non classee comme espace non physique');
}
for (const zone of [114, 115, 116, 117, 118]) {
  if (!canonRoomDefinitions[zone]?.name.includes('TORMENT')) failures.push(`EP8: tourment ${zone} non isole`);
}
const officePropAvatars = OS.getCircusZoneProps(16).map(prop => prop.avatar).filter(Boolean);
const officeSpriteAvatars = OS.getCircusZoneSprites(16).map(sprite => sprite.avatar || sprite.type);
for (const avatar of ['paintedmasks', 'zoobleparts', 'stabbedragdolls', 'coiledcentipedes', 'fourthcrocodile', 'ragathamothershadow', 'laughingshadows']) {
  if (officePropAvatars.includes(avatar) || officeSpriteAvatars.includes(avatar)) failures.push(`EP8: ${avatar} encore fusionne au bureau de Caine`);
}
const centralDormDoors = OS.getCircusZoneProps(20).filter(prop => prop.kind === 'roomdoor');
if (centralDormDoors.length !== 28) failures.push(`DORTOIR: ${centralDormDoors.length}/28 portes dans le couloir principal`);
if (centralDormDoors.filter(prop => Number.isFinite(prop.target)).length !== 18) failures.push('DORTOIR: 18 portes de residents nommes attendues');
for (const zone of [50, 51]) {
  const annexDoors = OS.getCircusZoneProps(zone).filter(prop => prop.kind === 'roomdoor');
  if (annexDoors.length !== 28 || annexDoors.some(prop => !prop.npcRoom || Number.isFinite(prop.target))) {
    failures.push(`DORTOIR: annexe ${zone} non reservee aux 28 chambres PNJ`);
  }
}
for (const avatar of ['horrorghost', 'horrormonster', 'horrorpomnivoid', 'horrorpomnispiral', 'horrorpomniskull', 'shadowpomni', 'shadowkinger']) {
  if (OS.getWackyProvenanceKind(avatar) !== 'fan') failures.push(`FAN: ${avatar} n est pas isole hors timeline`);
}
for (const avatar of ['bonepastor', 'themachine']) {
  if (OS.getWackyProfileStatus(avatar) !== 'PRODUCTION / HORS TIMELINE') failures.push(`PRODUCTION: statut ${avatar} incorrect`);
  if (OS.getWackyProvenanceKind(avatar) !== 'production') failures.push(`PRODUCTION: provenance ${avatar} incorrecte`);
  for (let zone = 0; zone <= OS.getCircusFpsZoneMax(); zone += 1) {
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

const allVisualAvatars = new Set(
  Object.values(OS.getWackyCastData())
    .map(character => character.avatar)
    .filter(Boolean)
);
const allRenderedPropKinds = new Set();
for (let zone = 0; zone <= OS.getCircusFpsZoneMax(); zone += 1) {
  for (const sprite of OS.getCircusZoneSprites(zone)) {
    const avatar = sprite.avatar || sprite.type;
    if (avatar) allVisualAvatars.add(avatar);
  }
  for (const prop of OS.getCircusZoneProps(zone)) {
    if (prop.avatar) allVisualAvatars.add(prop.avatar);
    if (prop.kind) allRenderedPropKinds.add(prop.kind);
  }
}

const avatarSourcePaths = new Map(
  [...source.matchAll(/^\s+([A-Za-z][A-Za-z0-9]*):\s*'([^']+\.png)'[,]?$/gm)]
    .map(match => [match[1], match[2]])
);
for (const avatar of [...allVisualAvatars].sort()) {
  const staticSpec = OS.getCircusAvatarSheetSpec(avatar);
  if (!staticSpec) {
    failures.push(`SPRITE: ${avatar} sans cellule de planche`);
    continue;
  }
  const animationSpec = OS.getCircusAvatarAnimationSpec(avatar, { name: avatar, routine: 'walk' });
  if (!animationSpec || (!animationSpec.customSheet && !animationSpec.procedural)) {
    failures.push(`ANIMATION: ${avatar} sans animation dediee ni procedurale`);
  }
  const sourcePath = avatarSourcePaths.get(staticSpec.sheet);
  if (!sourcePath) {
    failures.push(`SPRITE: source de planche ${staticSpec.sheet} introuvable pour ${avatar}`);
  } else if (!fs.existsSync(new URL(`../${sourcePath}`, import.meta.url))) {
    failures.push(`SPRITE: fichier ${sourcePath} absent pour ${avatar}`);
  }
}

for (const kind of [...allRenderedPropKinds].sort()) {
  if (!OS.getCircusPropRenderClass(kind)) {
    failures.push(`PROP 3D: ${kind} sans classe de rendu`);
  }
}

const canonStateCoverage = {
  angelhead: ['canonP', 3],
  possessedpomni: ['canonP', 3],
  monstrouscaine: ['canonP', 8],
  flamingozooble: ['canonP', 5],
  mouthlesspomni: ['canonQ', 8],
  mouthlessjax: ['canonQ', 8],
  mouthlesszooble: ['canonQ', 8],
  inertbubble: ['canonQ', 9],
  groundedcaine: ['canonR', 9],
  healingbutterfly: ['canonR', 6],
  plasticganglemask: ['canonR', 4],
  charredshrimp: ['canonR', 7]
};
for (const [avatar, [sheet, episode]] of Object.entries(canonStateCoverage)) {
  if (OS.getCircusAvatarSheetSpec(avatar)?.sheet !== sheet) failures.push(`PACK P-R: ${avatar} absent de ${sheet}`);
  if (!(OS.getEpisodeCastKeys(episode) || []).includes(avatar)) failures.push(`PACK P-R: ${avatar} absent de l episode ${episode}`);
  if (OS.getWackyProvenanceKind(avatar) !== 'canon-visual') failures.push(`PACK P-R: provenance ${avatar} incorrecte`);
  if (!OS.getPixelAvatarSvg(avatar, 46).includes(`pixel-sheet-avatar-canon-${sheet.slice(-1).toLowerCase()}`)) {
    failures.push(`PACK P-R: portrait Wacky Watch absent pour ${avatar}`);
  }
}
for (const path of [
  'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-p.png',
  'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-q.png',
  'assets/images/cainos-pixel-cast-sheet-canon-npc-pack-r.png'
]) {
  if (!fs.existsSync(new URL(`../${path}`, import.meta.url))) failures.push(`PACK P-R: fichier ${path} absent`);
}
if (OS.getCircusPropRenderClass('heart') !== 'effect') failures.push('PROP 3D: heart sans rendu VFX');
if (OS.getCircusPropRenderClass('projector') !== 'geometry') failures.push('PROP 3D: projector sans volume');

const minimumStageCount = campaignEpisodes.length * minimumStagesPerEpisode;
if (stageCount < minimumStageCount) failures.push(`${stageCount}/${minimumStageCount} actes minimum`);
if (failures.length) {
  console.error(`CONTRAT GAMEPLAY: ECHEC (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`CONTRAT GAMEPLAY: OK | ${stageCount} actes | ${allVisualAvatars.size} avatars animes | ${allRenderedPropKinds.size} types de props rendus`);
