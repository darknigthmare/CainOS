/** These locations are adapted for Encore's level fighting floor. */
const arena = (id, series, name, description, palette, ambience, source, observed) => ({
  id, series, name, description,
  palette: Object.fromEntries(['sky', 'back', 'accent', 'floor', 'grid'].map((role, i) => [role, palette[i]])),
  ambience, sourceId: 'stage-' + id, source, observed,
});

export const CROSSOVER_STAGES = Object.freeze([
  arena('coppernine', 'murderdrones', 'Copper 9 · Colonie gelée', 'Une route ensevelie sous la neige, entre les ruines industrielles de Murder Drones.',
    ['#161b38','#334665','#cedaff','#344561','#769ab9'], 'Neige de Copper 9',
    'https://www.glitchprod.com/murder-drones', 'Le paysage nocturne officiel montre les masses sombres des installations, la neige bleue et la brume froide.'),
  arena('silicacity', 'metarunner', 'Silica City · Les toits', 'Les tours et les écrans de la ville de Meta Runner éclairent une terrasse de service.',
    ['#241d42','#433663','#f5a4f5','#313952','#55759a'], 'Balises des toits',
    'https://www.glitchprod.com/meta-runner', 'La vue officielle de Silica City présente des gratte-ciel verticaux aux enseignes lumineuses cyan, roses et violettes.'),
  arena('portaurora', 'sunsetparadise', 'Port Aurora · La promenade', 'Une promenade claire entre les palmiers et les bâtiments du port de Sunset Paradise.',
    ['#65b8d7','#70b5c7','#ffe6a3','#e7b698','#fff1c4'], 'Embruns de Port Aurora',
    'https://www.glitchprod.com/sunset-paradise', 'Le bord de mer illustré présente des palmiers, des terrasses et pavillons clairs aux accents bleus sous un ciel vif.'),
  arena('gaslightwharf', 'gaslightdistrict', 'Gaslight District · Les quais', 'Le bois humide d’un ponton longe les ateliers de la ville des morts-vivants.',
    ['#1b2926','#31423a','#e6d688','#403d33','#81765a'], 'Brume des quais',
    'https://www.glitchprod.com/gaslight-district', 'Les visuels de la série associent les silhouettes très sombres à une lumière jaune-verte. Le port est une recomposition pour Encore.'),
  arena('parkplanet', 'knightsofguinevere', 'Park Planet · La terrasse', 'Le jardin suspendu de Knights of Guinevere domine une mer de nuages.',
    ['#859bc4','#82a995','#f9e7b5','#b9a38d','#e7d6ad'], 'Pollen de la terrasse',
    'https://www.glitchprod.com/knights-of-guinevere', 'La présentation officielle situe le parc d’attractions dans les nuages et montre un jardin de conte aux couleurs douces.'),
  arena('gameoverse', 'gameoverse', 'Gameoverse · En orbite', 'Une plate-forme de jeu surplombe l’horizon pixellisé de la planète bleue.',
    ['#191b49','#3154a6','#96e9ff','#293558','#6c8fc0'], 'Éclats en orbite',
    'https://www.glitchprod.com/gameoverse', 'Le fond officiel montre un astre bleu quadrillé de motifs clairs devant un espace violet et étoilé.'),
  arena('littledaisy', 'lackadaisy', 'Little Daisy · Le club clandestin', 'Sous le Little Daisy Café, le parquet de la salle de jazz fait office de piste.',
    ['#372e35','#554034','#e6ae65','#765444','#b5825c'], 'Poussière du cabaret',
    'https://www.glitchprod.com/lackadaisy', 'La série situe le club clandestin sous le Little Daisy Café. La palette nocturne s’appuie sur l’illustration officielle de Saint-Louis.'),
  arena('showgrounds', 'smg4', 'Showgrounds · Le parvis du château', 'La grande roue se dresse à côté du château de SMG4, coiffé de sa casquette bleue.',
    ['#c58268','#8b956b','#fff1a3','#aa794f','#dba874'], 'Lueurs du parc',
    'https://www.youtube.com/watch?v=wDk0-_NqkdE', 'La vue du Showgrounds publiée par SMG4 Official montre le château rond, son emblème, ses frises bleu et blanc et la grande roue.'),
  arena('simpleflipisland', 'ultrajumpmania', 'Ultra Jump Mania! · L’île de Theo', 'Une corniche de sable et d’herbe domine la plage où commence le pilote de Theo.',
    ['#62bce0','#64bd9c','#ffe37d','#dba55e','#ffdf8e'], 'Brise de l’île',
    'https://www.youtube.com/watch?v=HZoOzz1CrAk', 'Les images du pilote de GLITCH montrent la plage, la lumière tropicale, l’herbe vive et les reliefs stylisés de l’île.'),
]);

export const CROSSOVER_STAGE_SOURCES = Object.freeze([
  ...CROSSOVER_STAGES.map(({ sourceId, name, source, observed }) => ({
    id: sourceId, title: name, url: source, kind: 'Source primaire', scope: observed,
  })),
  {
    id: 'smg4-showgrounds-map', title: 'SMG4 Official — The Showgrounds', kind: 'Carte officielle',
    url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2992370946',
    scope: 'La capture de la carte publiée par SMG4 Official montre la façade et la place au coucher du soleil.',
  },
]);
