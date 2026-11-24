/** Original Encore costume collections inspired by the credited GLITCH series. */
import { CROSSOVER_DESIGNS } from './crossover-designs.mjs';
import { CROSSOVER_FUSIONS } from './crossover-fusions.mjs';
import { NPC_CROSSOVER_DEFINITIONS } from './crossover-npc-additions.mjs';
import { createBaseSpriteCostumes, publishedBaseSpriteDefinitions } from './base-sprite-content.mjs';

export const CROSSOVER_SERIES = Object.freeze(Object.entries(CROSSOVER_DESIGNS).map(
  ([id, design]) => Object.freeze({ id, name: design.label })
));

export const CROSSOVER_STYLES = Object.freeze({
  hommage: 'Hommage', resident: 'Résident de l’univers', fusion: 'Fusion originale',
});

function legacyStylesFor(series, fighterId) {
  const designs = series ? [CROSSOVER_DESIGNS[series]].filter(Boolean) : Object.values(CROSSOVER_DESIGNS);
  const styles = [];
  // Only expose a body when that artist has a design. Promoting an archive NPC
  // must not manufacture costume IDs pointing to drawings that do not exist.
  if (designs.some(design => design.hommage && design.residents[fighterId])) styles.push('hommage');
  if (designs.some(design => design.residents[fighterId])) styles.push('resident');
  const hasFusion = series
    ? Boolean(CROSSOVER_FUSIONS[series]?.[fighterId])
    : Object.values(CROSSOVER_FUSIONS).some(roster => roster[fighterId]);
  if (hasFusion) styles.push('fusion');
  return styles;
}

export function crossoverStylesFor(series, fighterId) {
  const styles = new Set(legacyStylesFor(series, fighterId));
  for (const entry of NPC_CROSSOVER_DEFINITIONS) {
    if (entry.fighterId === fighterId && (!series || entry.series === series)) styles.add(entry.style);
  }
  for (const entry of publishedBaseSpriteDefinitions()) {
    if (entry.crossover && entry.fighterId === fighterId && (!series || entry.crossover.series === series)) styles.add(entry.crossover.style);
  }
  return Object.keys(CROSSOVER_STYLES).filter(style => styles.has(style));
}

// Keep the original 378 records in their historical series/fighter order.
// Partial NPC coverage must never make this builder invent other outfits.
export function createLegacyCrossoverCostumes(fighters) {
  return CROSSOVER_SERIES.flatMap(series => fighters.flatMap(fighter =>
    legacyStylesFor(series.id, fighter.id).map(style => {
      const directory = `../assets/encore/crossovers/${series.id}/${fighter.id}/${style}`;
      const design = CROSSOVER_DESIGNS[series.id];
      const title = {
        hommage: 'Hommage · ' + design.hommage,
        resident: design.residents[fighter.id],
        fusion: CROSSOVER_FUSIONS[series.id]?.[fighter.id],
      }[style];
      return {
        id: `glitch-${series.id}-${fighter.id}-${style}`,
        fighterId: fighter.id, baseFighterId: fighter.id,
        name: `${series.name} · ${title}`,
        crossover: { series: series.id, style },
        sprite: { src: directory + '/stance.webp', crossoverDirectory: directory, nativeFacing: 1 },
      };
    })
  ));
}

export function createNpcCrossoverCostumes(fighters) {
  const owners = new Set(fighters.map(fighter => fighter.id));
  return NPC_CROSSOVER_DEFINITIONS.filter(entry => owners.has(entry.fighterId)).map(entry => {
    const directory = `../assets/encore/crossovers/${entry.series}/${entry.fighterId}/${entry.style}`;
    return {
      id: entry.id, fighterId: entry.fighterId, baseFighterId: entry.fighterId,
      name: entry.name, crossover: { series: entry.series, style: entry.style },
      introducedOn: entry.introducedOn,
      sourceKind: entry.sourceKind, canonicalCostumeClaim: false,
      sprite: { src: `${directory}/stance.${entry.format}`, crossoverDirectory: directory, nativeFacing: 1 },
    };
  });
}

export function createCrossoverCostumes(fighters) {
  return [...createLegacyCrossoverCostumes(fighters), ...createNpcCrossoverCostumes(fighters),
    ...createBaseSpriteCostumes(fighters).filter(costume => costume.crossover)];
}

export function matchesCostumeFilter(costume, series = '', style = '') {
  if (series && series !== (costume?.crossover?.series || 'circus')) return false;
  return !style || costume?.crossover?.style === style;
}
