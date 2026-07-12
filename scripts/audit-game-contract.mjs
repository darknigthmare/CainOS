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
let stageCount = 0;

for (let episode = 1; episode <= 9; episode++) {
  const campaign = OS.getCircusFpsCampaignDefinition(episode);
  if (!campaign) {
    failures.push(`EP${episode}: campagne absente`);
    continue;
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

if (stageCount !== 72) failures.push(`${stageCount}/72 actes`);
if (failures.length) {
  console.error(`CONTRAT GAMEPLAY: ECHEC (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('CONTRAT GAMEPLAY: OK | toutes les campagnes pointent vers des PNJ et objets presents');
