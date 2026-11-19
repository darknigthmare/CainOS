/**
 * PNJ archive promotion for Encore. Every entry below already has an existing
 * full-body sprite in the CainOS atlas. The combat kits are original fan-game
 * adaptations, not canonical powers. Routes and tournament text are generated
 * from the same records so the roster stays coherent without inventing canon.
 */
const row = (id, name, title, role, color, sourceId, rivalId, power, speed, reach, height, width) =>
  Object.freeze({ id, name, title, role, color, sourceId, rivalId, power, speed, reach, height, width });

export const EXPANSION_DEFS = Object.freeze([
  row('queenie', 'Queenie', 'Le souvenir du chapiteau', 'Soutien', '#c9a7e8', 'ep1', 'kinger', 0.92, 0.98, 1, 215, 76),
  row('kaufmo', 'Kaufmo', 'Le clown d’avant', 'Pression', '#e6a15c', 'ep1', 'ragatha', 1.01, 0.97, 1.03, 235, 84),
  row('ribbit', 'Ribbit', 'La grenouille du groupe', 'Mobilité', '#9fd68a', 'ep1', 'pomni', 0.9, 1.12, 0.96, 190, 74),
  row('scratch', 'Scratch', 'Le chat rayé', 'Pièges', '#d7b17a', 'ep1', 'jax', 0.96, 1.02, 1, 205, 78),
  row('wormo', 'Wormo', 'Le ver du chapiteau', 'Défense', '#b8c47a', 'ep1', 'gangle', 0.98, 0.9, 0.95, 210, 88),
  row('bizco', 'Bizco', 'Le biscuit vivant', 'Endurance', '#dba57d', 'ep1', 'zooble', 1, 0.95, 0.98, 195, 80),
  row('rattie', 'Rattie', 'La rate du cirque', 'Précision', '#b7a9c9', 'ep1', 'jax', 0.94, 1.08, 1.02, 185, 70),
  row('spike', 'Spike', 'Le petit piquant', 'Assaut', '#9fbfc9', 'ep1', 'gloinkqueen', 1.02, 1.04, 1, 200, 76),
  row('pinkcyclops', 'Pink Furry Cyclops', 'Le spectateur velu', 'Colosse', '#e8a0c2', 'ep1', 'fudge', 1.1, 0.82, 1.08, 260, 120),
  row('yellowclown', 'Frowning Yellow Clown', 'Le clown qui boude', 'Contrôle', '#e6cf6e', 'ep1', 'caine', 0.97, 0.96, 1.02, 220, 82),
  row('oyster', 'The Oyster', 'La perle du décor', 'Défense', '#c9d6d8', 'ep1', 'bubble', 0.95, 0.88, 0.98, 205, 90),
  row('bulbcreature', 'Light Green Bulb Creature', 'La lanterne du cirque', 'Distance', '#b7e39b', 'ep1', 'gangle', 0.93, 0.94, 1.04, 200, 76),
  row('abel', 'Abel', 'La silhouette du programme', 'Polyvalence', '#c4b3a0', 'ep1', 'pomni', 1, 1, 1, 225, 82),
  row('max', 'Max', 'Le caïman de tête', 'Pression', '#8fce9c', 'ep2', 'gummigoo', 1.04, 0.98, 1.04, 240, 96),
  row('chad', 'Chad', 'Le caïman costaud', 'Colosse', '#9ec98e', 'ep2', 'fudge', 1.08, 0.86, 1.05, 255, 110),
  row('orbsman', 'Orbsman', 'Le guide du manoir', 'Distance', '#a9c8d6', 'ep3', 'kinger', 0.92, 1.01, 1, 215, 80),
  row('ming', 'Ming', 'L’invitée du programme', 'Mobilité', '#e0b8a2', 'ep1', 'zooble', 0.94, 1.1, 0.98, 195, 72),
  row('marthamildenhall', 'Martha Mildenhall', 'La voix du manoir', 'Précision', '#c9d8c2', 'ep3', 'baronmildenhall', 0.96, 1, 1.02, 225, 80),
  row('ghostly', 'Ghostly', 'Le spectre de passage', 'Mobilité', '#cfd7e6', 'ep3', 'ragatha', 0.9, 1.14, 0.96, 210, 74),
  row('angel', 'Angel', 'L’ange du manoir', 'Soutien', '#e8dfc7', 'ep3', 'loolilalu', 0.93, 1.02, 1, 220, 78),
  row('disappearingguy', 'Disappearing Guy', 'Le figurant qui s’efface', 'Pièges', '#b0b7c9', 'ep1', 'jax', 0.95, 1.06, 0.98, 205, 76),
  row('committeemember', 'Committee Member', 'Le comité du cirque', 'Contrôle', '#c2b6a6', 'ep1', 'caine', 0.98, 0.94, 1.02, 220, 84),
  row('shrimpnpc', 'Shrimp NPC', 'La crevette de service', 'Mobilité', '#e7b49b', 'ep2', 'bubble', 0.9, 1.12, 0.95, 180, 68),
  row('chineseroomnpc', 'Chinese Room NPC', 'La chambre des règles', 'Défense', '#b7c3b0', 'ep1', 'zooble', 0.97, 0.9, 1, 215, 82),
  row('blueai', 'Blue AI', 'L’assistant bleu', 'Distance', '#9ec4e6', 'ep1', 'caine', 0.94, 1, 1.03, 210, 78),
  row('cookiebutterfly', 'Cookie Butterfly', 'Le papillon de sucre', 'Mobilité', '#e6c99e', 'ep2', 'loolilalu', 0.88, 1.16, 0.94, 175, 66),
  row('gummyelephant', 'Gummy Elephant', 'Le pachyderme gommeux', 'Colosse', '#9fd6b2', 'ep2', 'gummigoo', 1.1, 0.8, 1.06, 260, 120),
  row('giantcentipede', 'Giant Centipede', 'Le mille-pattes du canyon', 'Pression', '#b9a0cf', 'ep2', 'fudge', 1.02, 1, 1.05, 225, 95),
  row('spudsycustomer', 'Spudsy Customer', 'Le client affamé', 'Endurance', '#d7b18f', 'ep4', 'fudge', 0.99, 0.96, 1, 215, 82),
  row('candyguardcyan', 'Candy Guard Cyan', 'La garde cyan', 'Défense', '#9ee0df', 'ep2', 'loolilalu', 0.98, 0.93, 1.02, 225, 84),
  row('candyguardblue', 'Candy Guard Blue', 'La garde bleue', 'Précision', '#9eb8e6', 'ep2', 'gloinkqueen', 0.97, 1, 1.03, 225, 84),
  row('candyguardpurple', 'Candy Guard Violet', 'La garde violette', 'Contrôle', '#c7a6e0', 'ep2', 'loolilalu', 0.98, 0.97, 1.01, 225, 84),
  row('gummyworm', 'Gummy Worm', 'Le ver gommeux', 'Mobilité', '#a6d6a0', 'ep2', 'gummigoo', 0.9, 1.1, 0.98, 190, 72),
  row('barrelmonkey', 'Barrel Monkey', 'Le singe du tonneau', 'Assaut', '#c9a27e', 'ep1', 'jax', 1, 1.06, 1, 205, 78),
  row('jeffery', 'Jeffery', 'Le résident discret', 'Polyvalence', '#bfb39f', 'ep1', 'pomni', 0.97, 1, 1, 215, 80),
  row('mildenhallsouls', 'Mildenhall Souls', 'Les âmes du manoir', 'Distance', '#b7c8c9', 'ep3', 'baronmildenhall', 0.94, 0.99, 1.02, 220, 82),
  row('redmannequin', 'Red Mannequin', 'Le mannequin rouge', 'Défense', '#d99a9a', 'ep1', 'ragatha', 1, 0.92, 1, 230, 86),
  row('orangemannequin', 'Orange Mannequin', 'Le mannequin orange', 'Endurance', '#e0b087', 'ep1', 'gangle', 1.01, 0.9, 1, 230, 86),
  row('yellowmannequin', 'Yellow Mannequin', 'Le mannequin jaune', 'Contrôle', '#e0d08f', 'ep1', 'zooble', 0.96, 0.96, 1.02, 230, 86),
  row('magentamannequin', 'Magenta Mannequin', 'Le mannequin magenta', 'Précision', '#d99ac9', 'ep1', 'pomni', 0.95, 1.02, 1.03, 230, 86)
]);

export const EXPANSION_RIVALS = Object.freeze(Object.fromEntries(EXPANSION_DEFS.map(def => [def.id, def.rivalId])));
export const EXPANSION_IDS = Object.freeze(EXPANSION_DEFS.map(def => def.id));

const moveText = {
  light: ['Coup léger', 'une frappe rapide de contact'],
  heavy: ['Coup fort', 'une frappe haute plus lente'],
  low: ['Coup bas', 'une attaque basse de contrôle'],
  throw: ['Saisie', 'une projection au contact'],
  special: ['Projectile', 'un accessoire lancé à distance'],
  specialDown: ['Piège au sol', 'un accessoire posé au sol'],
  specialForward: ['Avancée', 'une frappe qui avance'],
  specialBack: ['Riposte', 'une défense de contact'],
  super: ['Finale', 'une grande finale de spectacle'],
  utility: ['Récupération', 'une pause de stabilité']
};

export function buildExpansionKit(def) {
  return Object.fromEntries(Object.entries(moveText).map(([slot, [label, action]]) => [slot, {
    name: `${label} de ${def.name}`,
    description: `${def.name} utilise ${action} adaptée pour Encore, sans reproduire une scène de la série.`,
    fields: slot === 'specialDown' ? { level: 'mid' } : {}
  }]));
}

export function expansionFighterConfig(def) {
  return {
    power: def.power, speed: def.speed, reach: def.reach,
    width: def.width, height: def.height, profile: def.role === 'Colosse' ? 'giant' : 'humanoid'
  };
}

export function getExpansionDef(id) {
  return EXPANSION_DEFS.find(def => def.id === id) || null;
}
