/**
 * Recovery plan for the three original Ribbit / Sunset Paradise designs.
 * These definitions are deliberately inactive until all 33 native PNGs are
 * received and independently checked. The installer appends them once complete.
 */
export const SUNSET_RECOVERY_SLOTS = Object.freeze(['selection','stance','intro','attack','heavy','hit','walk','jump','crouch','victory','defeat']);
export const SUNSET_RECOVERY_DEFINITIONS = Object.freeze([
  { id: 'glitch-sunsetparadise-ribbit-hommage', fighterId: 'ribbit', series: 'sunsetparadise', style: 'hommage', name: 'Sunset Paradise · Hommage · Meggy', introducedOn: '2026-11-24', sourceKind: 'Création originale pour Encore', format: 'png' },
  { id: 'glitch-sunsetparadise-ribbit-resident', fighterId: 'ribbit', series: 'sunsetparadise', style: 'resident', name: 'Sunset Paradise · Résidente de Port Aurora', introducedOn: '2026-11-24', sourceKind: 'Création originale pour Encore', format: 'png' },
  { id: 'glitch-sunsetparadise-ribbit-fusion', fighterId: 'ribbit', series: 'sunsetparadise', style: 'fusion', name: 'Sunset Paradise · Fusion amphibienne', introducedOn: '2026-11-24', sourceKind: 'Création originale pour Encore', format: 'png' },
].map(entry => Object.freeze(entry)));

