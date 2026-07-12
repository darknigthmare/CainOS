import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const episodes = fs.readFileSync(new URL('../episodes.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const failures = [];
const requireMarker = (source, marker, label = marker) => {
  if (!source.includes(marker)) failures.push(`ABSENT: ${label}`);
};

for (let episode = 1; episode <= 9; episode++) {
  requireMarker(episodes, `${episode}: [`, `checkpoints EP${episode}`);
}

[
  'getCircusFpsCampaignDefinition',
  'updateCircusCampaignTimedProgress',
  'updateCircusEventDirector',
  'drawCircusMissionJournal',
  'getCircusCustomAdventureProps',
  'getCainOSProfileSlots',
  'getCircusControlBindings',
  'separateCircusNpcCrowd',
  'fpsCampaignEpisodes',
  'fpsCampaignStages'
].forEach(marker => requireMarker(app, marker));

for (let episode = 2; episode <= 9; episode++) {
  requireMarker(app, `${episode}: { title:`, `campagne FPS EP${episode}`);
}

[
  'circus-fps-journal',
  'save-slot-list',
  'setting-fps-invert-mouse',
  'setting-fps-interaction-assist',
  'setting-fps-motion-intensity',
  'data-fps-binding="forward"',
  'data-fps-binding="journal"'
].forEach(marker => requireMarker(html, marker));

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) failures.push(`ID HTML DUPLIQUES: ${duplicateIds.join(', ')}`);

if (!/campaignStages\s*!==\s*72/.test(app)) failures.push('Audit 72 actes absent');
if (!/campaigns\.length\s*!==\s*9/.test(app)) failures.push('Audit 9 campagnes absent');
if (!/CainOS_SAVE_V1/.test(app)) failures.push('Schema de sauvegarde absent');

if (failures.length) {
  console.error(`AUDIT CAINOS: ECHEC (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`AUDIT CAINOS: OK | ${ids.length} ids uniques | 9 campagnes | 72 actes | journal, profils, atelier et controles presents`);
