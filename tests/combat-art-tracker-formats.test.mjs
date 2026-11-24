import test from 'node:test';
import assert from 'node:assert/strict';
import { updateIllustratedTracker } from '../scripts/combat-illustrated-tracker.mjs';
import { updateCrossoverTracker } from '../scripts/combat-crossover-tracker.mjs';
import { COSTUMES, FIGHTERS, STAGES, VARIANTS } from '../combat/data.mjs';

test('published PNG art updates real tracker paths without closing animation or reference reviews', () => {
  const production = [
    ['ART-queenie-guard', '', '', '', 'Prévu', '', '', '', 'Animation à dessiner', 'Note conservée'],
    ['ART-queenie-heavy', '', '', '', 'Partiel', '', '', '', 'Comparer la référence', 'Autre note'],
    ['ART-falseexit-background', '', '', '', 'Prévu', '', '', '', '', 'Placement à revoir'],
    ['ART-falseexit-foreground', '', '', '', 'Prévu', '', '', '', '', ''],
    ['BOARD-queenie-prologue-1', '', '', '', 'Partiel', '', '', '', 'Voix à ajouter', ''],
  ];
  const data = { production, roster: [['queenie']], atlas: [['queenie']],
    stages: [['falseexit']], features: [], sources: [], counts: {}, scenarios: [] };
  const ART_FILES = [
    '../assets/encore/selection/queenie.png', '../assets/encore/stance/queenie.png',
    '../assets/encore/poses/queenie/heavy.png', '../assets/encore/stages/falseexit/far.png',
    '../assets/encore/stages/falseexit/mid.png', '../assets/encore/stages/falseexit/near.png',
    '../assets/encore/campaign/queenie/queenie-prologue-1.png',
  ];
  updateIllustratedTracker(data, { ART_FILES, ART_BYTES: 12345 });
  updateCrossoverTracker(data, { ART_FILES }, { FIGHTERS, VARIANTS, COSTUMES: [], STAGES });
  assert.equal(production[0][6], 'assets/encore/stance/queenie.png');
  assert.equal(production[0][4], 'Implémenté');
  assert.equal(production[0][8], 'Animation à dessiner');
  assert.equal(production[0].at(-1), 'Note conservée');
  assert.equal(production[1][6], 'assets/encore/poses/queenie/heavy.png');
  assert.equal(production[1][4], 'Partiel');
  assert.equal(production[1].at(-1), 'Autre note');
  assert.equal(data.stages[0][3], 'Implémenté');
  assert.equal(production[2][6], 'assets/encore/stages/falseexit/far.png');
  assert.match(production[2][7], /mid\.png/);
  assert.equal(production[2].at(-1), 'Placement à revoir');
  assert.equal(production[3][6], 'assets/encore/stages/falseexit/near.png');
  assert.match(production[4][6], /queenie-prologue-1\.png/);
  assert.equal(production[4][8], 'Voix à ajouter');
  assert.match(data.roster[0][14], /heavy/);
  assert.doesNotMatch(data.roster[0][14], /heavy\.png/);
  assert.equal(data.counts.offlineImages, 7);
  assert.equal(data.counts.offlineBytes, 12345);
});

test('a mixed-format crossover counts its actual PNG heavy and preserves editorial notes', () => {
  const costume = COSTUMES.find(item => item.crossover?.style === 'fusion');
  const directory = costume.sprite.crossoverDirectory;
  const ART_FILES = ['selection','stance','attack','victory','intro','walk','jump','crouch','hit','defeat']
    .map((pose, index) => `${directory}/${pose}.${index % 2 ? 'png' : 'webp'}`);
  const data = { production: [], stages: [], scenarios: [], sources: [], features: [], counts: {}, illustratedAssets: {} };
  const content = { FIGHTERS, VARIANTS, COSTUMES: [costume], STAGES: [] };
  updateCrossoverTracker(data, { ART_FILES }, content);
  data.production[0][9] = 'Comparer les proportions du visage';
  updateCrossoverTracker(data, { ART_FILES: [...ART_FILES, `${directory}/heavy.png`] }, content);
  assert.equal(data.production.length, 1);
  assert.equal(data.crossoverArt.costumeDrawings, 11);
  assert.match(data.production[0][7], /coup fort/);
  assert.equal(data.production[0].at(-1), 'Comparer les proportions du visage');
});

test('a declared static base needs only portrait and stance and preserves its review note', () => {
  const directory = '../assets/encore/crossovers/static-fixture/ribbit/fusion';
  const costume = {
    id: 'static-base-tracker-fixture', fighterId: 'ribbit', name: 'Ribbit — base statique',
    baseOnly: true, presentation: 'static', authoredSlots: ['selection', 'stance'],
    crossover: { series: 'static-fixture', style: 'fusion' },
    sprite: { baseOnly: true, crossoverDirectory: directory },
  };
  const data = { production: [], stages: [], scenarios: [], sources: [], features: [], counts: {}, illustratedAssets: {} };
  const content = { FIGHTERS, VARIANTS, COSTUMES: [costume], STAGES: [] };
  updateCrossoverTracker(data, { ART_FILES: [`${directory}/selection.png`] }, content);
  assert.equal(data.production.length, 0, 'a portrait alone cannot publish the family');
  const ART_FILES = ['selection', 'stance'].map(slot => `${directory}/${slot}.png`);
  updateCrossoverTracker(data, { ART_FILES }, content);
  assert.equal(data.production.length, 1);
  assert.equal(data.production[0][4], 'Implémenté');
  assert.equal(data.crossoverArt.costumeDrawings, 2);
  assert.equal(data.counts.variants, 1);
  assert.match(data.production[0][8], /neuf poses d’action sont hors périmètre/);
  assert.doesNotMatch(data.production[0][8], /À illustrer/);
  data.production[0][9] = 'Conserver les proportions de la base';
  updateCrossoverTracker(data, { ART_FILES: [...ART_FILES, `${directory}/attack.png`, `${directory}/heavy.png`] }, content);
  assert.equal(data.production.length, 1, 'an update does not duplicate the family');
  assert.equal(data.crossoverArt.costumeDrawings, 2, 'unrequested action files do not redefine the two-slot contract');
  assert.equal(data.production[0].at(-1), 'Conserver les proportions de la base');
  const ordinary = { ...costume, baseOnly: false, sprite: { ...costume.sprite, baseOnly: false } };
  const fullPoseData = { production: [], stages: [], scenarios: [], sources: [], features: [], counts: {}, illustratedAssets: {} };
  updateCrossoverTracker(fullPoseData, { ART_FILES }, { ...content, COSTUMES: [ordinary] });
  assert.equal(fullPoseData.production[0][4], 'Partiel', 'ordinary families still require their authored action slots');
  assert.match(fullPoseData.production[0][8], /À illustrer en priorité/);
});
