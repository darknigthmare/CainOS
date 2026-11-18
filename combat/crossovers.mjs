/** Original Encore costume collections inspired by the credited GLITCH series. */
import { CROSSOVER_DESIGNS } from './crossover-designs.mjs';

export const CROSSOVER_SERIES = Object.freeze(Object.entries(CROSSOVER_DESIGNS).map(
  ([id, design]) => Object.freeze({ id, name: design.label })
));

export const CROSSOVER_STYLES = Object.freeze({ hommage: 'Hommage', resident: 'Résident de l’univers' });

export function createCrossoverCostumes(fighters) {
  return CROSSOVER_SERIES.flatMap(series => fighters.flatMap(fighter =>
    Object.keys(CROSSOVER_STYLES).map(style => {
      const directory = `../assets/encore/crossovers/${series.id}/${fighter.id}/${style}`;
      const design = CROSSOVER_DESIGNS[series.id];
      const title = style === 'hommage' ? 'Hommage · ' + design.hommage : design.residents[fighter.id];
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
