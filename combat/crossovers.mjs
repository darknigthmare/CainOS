/** Original Encore costume collections inspired by the credited GLITCH series. */
import { CROSSOVER_DESIGNS } from './crossover-designs.mjs';
import { CROSSOVER_FUSIONS } from './crossover-fusions.mjs';

export const CROSSOVER_SERIES = Object.freeze(Object.entries(CROSSOVER_DESIGNS).map(
  ([id, design]) => Object.freeze({ id, name: design.label })
));

export const CROSSOVER_STYLES = Object.freeze({
  hommage: 'Hommage', resident: 'Résident de l’univers', fusion: 'Fusion originale',
});

export function crossoverStylesFor(series, fighterId) {
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

export function createCrossoverCostumes(fighters) {
  return CROSSOVER_SERIES.flatMap(series => fighters.flatMap(fighter =>
    crossoverStylesFor(series.id, fighter.id).map(style => {
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

export function matchesCostumeFilter(costume, series = '', style = '') {
  if (series && series !== (costume?.crossover?.series || 'circus')) return false;
  return !style || costume?.crossover?.style === style;
}
