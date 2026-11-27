import { CROSSOVER_STAGES, CROSSOVER_STAGE_SOURCES } from './crossover-stages.mjs';
import { EXPANSION_DEFS } from './roster-expansion.mjs';
import { ABSTRACTION_DEFS, ABSTRACTION_SOURCES, abstractionFidelity } from './abstractions-content.mjs';
import { COSTUME_ADDITION_SOURCES } from './costume-additions.mjs';
import { BASE_SPRITE_SOURCES } from './base-sprite-content.mjs';
import { COMPLETED_STAGE_SOURCES, COMPLETED_STAGE_FIDELITY } from './fidelity-completion-stages-20261127.mjs';
import { MAX_ILLUSTRATED_SOURCES, MAX_ILLUSTRATED_FIDELITY } from './fidelity-max-illustrated-20261127.mjs';

/**
 * Shared provenance for the codex and the planning workbook.
 * A source identifies what to compare; it does not certify an atlas, a costume,
 * an animation or a fighting ability. Observations describe the images actually inspected; third-party copies are
 * explicitly distinguished from official references. Combat remains an original fan-game.
 */
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

const episode = (id, title, video, scope) => ({ id, title: `GLITCH — ${title}`, url: `https://www.youtube.com/watch?v=${video}`, kind: 'Épisode officiel', scope });
const still = (id, title, file, scope) => ({ id, title: `GLITCH — ${title}`, url: `https://static.wixstatic.com/media/${file}`, kind: 'Visuel officiel', scope: `${scope} Image publiée sur https://www.glitchprod.com/digital-circus et consultée pour cette revue.` });
const merchandise = (id, title, file, page, scope) => ({ id, title: `GLITCH Store — ${title}`, url: `https://glitchproductions.store/cdn/shop/files/${file}`, kind: 'Produit dérivé officiel', scope: `${scope} Photographie consultée sur https://glitchproductions.store/products/${page}. Ce produit stylisé ne mesure pas les proportions ni les poses de la série.` });
export const FIDELITY_SOURCES = freeze([
  ...ABSTRACTION_SOURCES,
  ...COSTUME_ADDITION_SOURCES,
  ...BASE_SPRITE_SOURCES,
  ...CROSSOVER_STAGE_SOURCES,
  ...COMPLETED_STAGE_SOURCES,
  ...MAX_ILLUSTRATED_SOURCES,
  { id: 'glitch', title: 'GLITCH — The Amazing Digital Circus', url: 'https://www.glitchprod.com/digital-circus', kind: 'Source primaire', scope: 'Présentation officielle et galerie de la série. La page ne documente ni les règles de combat ni les dimensions du jeu.' },
  episode('ep1', 'Pilot', 'HwAPLk_sQ3w', 'Référence du cirque, de ses résidents, de Caine, Bubble, Kaufmo et des Gloinks. Les plans non décrits dans les visuels consultés restent à revoir.'),
  episode('ep2', 'Candy Carrier Chaos!', '4ofJpOEXrZs', 'Référence de Candy Canyon et de ses personnages. Les attaques du fan-game ne sont pas attestées par ce lien.'),
  episode('ep3', 'The Mystery Of Mildenhall Manor', 'bKjfw77cxeQ', 'Référence du manoir et de ses personnages. Comparaison des plans et des accessoires à poursuivre.'),
  episode('ep4', 'Fast Food Masquerade', 'Q9KWcWKo2T8', 'Référence de Spudsy et de la tenue de travail de Gangle. Lien d’épisode ; aucun atlas de costume n’est validé automatiquement.'),
  episode('ep5', 'Untitled', 'L4p2gN2CzsA', 'Épisode officiel identifié. Les scènes et costumes attribués à cet épisode dans les archives demandent une comparaison visuelle individuelle.'),
  episode('ep6', 'They All Get Guns', 'mOvhHim78YA', 'Épisode officiel identifié. Les accessoires et actions de cet épisode ne valident pas automatiquement les kits du jeu.'),
  episode('ep7', 'Beach Episode', 'oaOG1xOk7XY', 'Lien de l’épisode identifié. Comparaison des scènes, des tenues et des archives à effectuer ; aucun horodatage de validation revendiqué.'),
  episode('ep8', 'hjsakldfhl', 'DMNlzf8PiEM', 'Épisode officiel identifié. Les variantes et états visuels tardifs restent à comparer individuellement à la vidéo.'),
  episode('ep9', 'Remember', 'PVy-bcTsO8A', 'Épisode officiel identifié. Les personnes et contreparties des archives restent à vérifier ; ce lien ne leur attribue aucun kit de combat.'),
  still('glitch-cast', 'portrait du groupe au cirque', '84ed6a_e3bac825d5c140a4a665ba898b3ff51b~mv2.png', 'Repères de costume, de visage et de silhouette pour Pomni, Jax, Ragatha, Gangle, Zooble, Kinger et Caine.'),
  still('glitch-cellar', 'le cellier et ses yeux dans l’obscurité', '84ed6a_de54a5d816fe4ba0966cc96385ab8f8b~mv2.jpg', 'Obscurité presque noire, yeux multicolores et lumière centrale. Aucun couloir de portes dans ce plan.'),
  still('glitch-void', 'Pomni dans le Vide irisé', '84ed6a_9f2c0f92fcc340fea405c155a304e362~mv2.png', 'Espace blanc aux reflets pâles et bandes chromatiques. Cette référence ne montre ni escalier ni panneau EXIT.'),
  still('glitch-candy-court', 'le groupe à la cour de Candy Canyon', '84ed6a_bd08976f81644a659cbc9a8e112fb5dc~mv2.png', 'Jax au premier plan, Loolilalu et le palais de confiserie à l’arrière-plan. Les petits accessoires sont trop éloignés pour une validation détaillée.'),
  still('glitch-circus-props', 'Pomni parmi les accessoires du cirque', '84ed6a_e7edb891769b4d1d9d06939d1d4db6a7~mv2.png', 'Dés, cubes, rideau rouge et sol à damier. Repères de décor, sans mesure de l’espace jouable.'),
  still('glitch-undermap', 'Pomni et Gummigoo sous la carte', '84ed6a_0558e3b65a3146b5b04b7828da5b4d0e~mv2.png', 'Gummigoo vert et jaune translucide avec son chapeau, dans un environnement quadrillé bleu. Cet espace ne sert pas de référence au Vide blanc du pilote.'),
  still('glitch-false-exit', 'Pomni dans le couloir de la fausse sortie', '84ed6a_3fb3c4ec9e8947e5a659c4cf10657ecc~mv2.png', 'Porte rouge EXIT et couloir gris. Ce plan ne représente pas le couloir des chambres des résidents.'),
  { id: 'glitch-softballfield-storyboards', title: 'GLITCH — le stade de softball de l’épisode 5', url: 'https://www.youtube.com/watch?v=L4p2gN2CzsA&t=1120', kind: 'Vignettes de l’épisode officiel', scope: 'Storyboards publics YouTube récupérés directement et inspectés : M12 cellule 4 vers 1120 s, M15 cellules 5/8 vers 1400/1430 s. Chaque cellule mesure 320 × 180. Tribunes, auvents, projecteurs blancs, herbe verte et terre ocre observés ; géométrie complète, mesures et textes fins non certifiés. Aucun visionnage du flux complet revendiqué.' },
  { id: 'glitch-barnoir-storyboards', title: 'GLITCH — le bar de l’épisode 5', url: 'https://www.youtube.com/watch?v=L4p2gN2CzsA&t=690', kind: 'Vignettes de l’épisode officiel', scope: 'Storyboards publics YouTube récupérés directement et inspectés : M7 cellule 6 vers 690 s, M10 cellules 1/4 vers 910/940 s et M11 cellule 1 vers 1000 s. Chaque cellule mesure 320 × 180. Néons, suspensions, comptoir, étagères et damier observés ; géographie complète, mesures et textes fins non certifiés. Aucun visionnage du flux complet revendiqué.' },
  { id: 'temmer-interview', title: 'Kevin Temmer — entretien sur l’animation du pilote, 4 décembre 2023', url: 'https://www.comicsbeat.com/interview-with-kevin-temmer-of-the-amazing-digital-circus/', kind: 'Entretien primaire', scope: 'Propos directs du lead animator : mouvements nerveux de Pomni, gestuelle de poupée de Ragatha et animation des rubans de Gangle. Ces principes ne certifient aucune pose ni aucun costume d’Encore.' },
  merchandise('store-gangle-masks', 'Gangle et ses masques', 'Gangle-Plush_05.png?v=1762243060&width=1600', 'gangle-plush', 'Masque triste blanc avec larmes bleues, rubans rouges et masque souriant détaché. L’état du masque dans cette photo ne valide pas celui de l’atlas.'),
  merchandise('store-gangle-figure', 'Gangle Animatez', 'gangle-animatez-1.png?v=1762247039&width=1600', 'gangle-animatez', 'Masque triste entier, rubans rouges et fragments du masque souriant au pied de la figurine.'),
  merchandise('store-maid-jax', 'Maid Jax Animatez', 'Animatez_MaidJax_Box_1.png?v=1763022885&width=1600', 'maid-jax-animatez', 'Robe noire, tablier et coiffe blancs, cœur violet sur le buste, bas blancs et chaussures noires. Comparaison limitée à ces détails de vêtement.'),
  merchandise('store-spudsy-gangle', 'Spudsy Gangle Plush', 'spudsy-gangle-plush-2.png?v=1762501000&width=1600', 'spudsy-gangle-plush', 'Chemise gris bleu clair, cravate bleu pâle, badge de responsable et masque souriant denté, avec une étoile sur la joue.'),
  merchandise('store-costume-group', 'Costume Adventure Series — groupe', '78.png?v=1762387272&width=1600', 'digital-circus-animiniz-costume-adventure-series', 'Anime Gangle porte un col marin bleu, un nœud rouge et une jupe bleue. Les yeux noirs, la bouche, le sac et les rubans peuvent être comparés ; aucune attribution d’épisode ne découle de cette photo.'),
  merchandise('store-spudsy-ragatha', 'Costume Adventure Series — Ragatha en uniforme', '85.png?v=1762387272&width=1600', 'digital-circus-animiniz-costume-adventure-series', 'Ragatha porte une visière et un uniforme gris foncé, avec un badge clair. Cette figurine nommée Spudsy dans la fiche et Stupid sur l’emballage n’atteste pas toutes les tenues de l’épisode.'),
  {"id": "netflix-spudsy-counter", "title": "Netflix — Spudsy, vignette de Fast Food Masquerade", "url": "https://occ-0-3012-114.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABY7TJYmplbg8lnHqbjKLMs9jVNbYeIHivWTdEufLA0d-90FfapefydK8i59MTeahWLBWGxlNMM4radrd0MARwM-FxSHl7ekrwgfjyuQ1bbOZIBhn7QqT5PHh.jpg?r=b1e", "kind": "Visuel du distributeur officiel", "scope": "Vignette de 300 × 169 pixels publiée par Netflix pour l’épisode 4. Le comptoir, la cuisine, les couleurs et le logo S sont observables ; les textes des offres et les dimensions ne sont pas validés."},
  {"id": "pilot-residents-copy-near", "title": "Copie attribuée au pilote — portes des résidents", "url": "https://static.wikia.nocookie.net/tadc/images/f/fa/Kaufmo_Pilot_1.png/revision/latest/scale-to-width-down/1200?cb=20231014163019", "kind": "Copie sur un hébergement tiers", "scope": "Image attribuée au pilote, inspectée sur un hébergement tiers. La vidéo officielle a été identifiée, mais aucun frame du flux n’a chargé ; l’authenticité de cette copie n’est pas vérifiée directement. Ne pas compter comme visuel primaire consulté."},
  {"id": "pilot-residents-copy-wide", "title": "Copie attribuée au pilote — vue longue du couloir", "url": "https://pbs.twimg.com/media/F8W0oVkWoAAmW9v.jpg", "kind": "Copie sur un hébergement tiers", "scope": "Vue attribuée au pilote et republiée sur X. Repères concordants avec l’autre copie, sans mesure ni comparaison directe au flux officiel. Les modifications de portes, cadres et perspective restent une recomposition partielle."},
]);

const record = (sourceIds, observedTraits, combatAdaptation, reviewStatus, reviewScope) => ({ sourceIds, observedTraits, combatAdaptation, reviewStatus, reviewScope });
const appearance = (sourceIds, observedTraits, combatAdaptation, scope) => record(sourceIds, observedTraits, combatAdaptation, 'Référence visuelle consultée', `${scope} Ce repère ne valide ni l’ensemble du rendu, ni ses dimensions, ni les autres apparences.`);
const pending = (sourceIds, combatAdaptation, scope) => record(sourceIds, [], combatAdaptation, 'Épisode à revoir', scope);

// Technical review of the forty archive sprites promoted in 0.7.0. Every observation
// below describes the project's own atlas cell, extracted from its sheet and grid
// coordinates. No consulted official visual shows these background NPCs, so an atlas
// observation never becomes a canonical trait and every record stays open.
const expansionSheets = {
  base: { file: 'cainos-pixel-cast-sheet.png', transparency: 'Planche RVB au fond noir presque opaque : le fond et le damier clair sont retirés par le détourage du rendu, aucun alpha natif n’est disponible.' },
  abstracted: { file: 'cainos-pixel-cast-sheet-abstracted.png', transparency: 'Planche RVB au fond noir : le détourage du rendu retire le fond, aucun alpha natif n’est disponible.' },
  variants: { file: 'cainos-pixel-cast-sheet-variants.png', transparency: 'Planche RVB au fond noir : le détourage du rendu retire le fond, aucun alpha natif n’est disponible.' },
  ming: { file: 'cainos-pixel-cast-sheet-ming.png', transparency: 'Planche RVB dédiée au fond noir : le détourage du rendu retire le fond, le halo vert est peint dans le dessin.' },
  canonA: { file: 'cainos-pixel-cast-sheet-canon-npc-pack-a.png', transparency: 'Planche RVB au fond noir : le détourage du rendu retire le fond, aucun alpha natif n’est disponible.' },
  canonB: { file: 'cainos-pixel-cast-sheet-canon-npc-pack-b.png', transparency: 'Planche RVB au fond noir : le détourage du rendu retire le fond, aucun alpha natif n’est disponible.' },
  canonC: { file: 'cainos-pixel-cast-sheet-canon-npc-pack-c.png', transparency: 'Planche RVB contenant un décor complet sur fond noir ; le détourage ne peut pas isoler une silhouette de combattant.' },
  canonD: { file: 'cainos-pixel-cast-sheet-canon-npc-pack-d.png', transparency: 'Planche RVB au damier clair peint : le damier est retiré par le détourage du rendu, aucun alpha natif n’est disponible.' },
  canonE: { file: 'cainos-pixel-cast-sheet-canon-npc-pack-e.png', transparency: 'Planche RGBA à alpha natif ; le fond est déjà transparent et aucun détourage de fond n’est requis.' },
  canonF: { file: 'cainos-pixel-cast-sheet-canon-npc-pack-f.png', transparency: 'Planche RGBA à alpha natif ; le fond est déjà transparent et aucun détourage de fond n’est requis.' },
};

const EXPANSION_SPRITE_REVIEWS = {
  queenie: {
    sheet: 'base', cell: 'rangée 2, colonne 3', size: '256 × 342 px',
    visibleTraits: ['Reine âgée au visage pâle et aux paupières tombantes, couronne dorée à pointes.', 'Robe lie-de-vin à col et revers de fourrure blanche, mains jointes devant le buste.'],
    framing: 'Cadre extrait sans fragment d’une cellule voisine ; les pieds et la couronne sont entièrement contenus.',
    identity: 'La couronne et la robe de cérémonie donnent une figure royale de cirque ; ni le nom Queenie ni son rôle ne sont documentés par une source consultée.',
    issues: [],
    gap: 'Le catalogue d’archive étiquette ce sprite « Archive » sans épisode, alors que la route de Queenie cite le pilote.',
  },
  kaufmo: {
    sheet: 'base', cell: 'rangée 2, colonne 4', size: '256 × 342 px',
    visibleTraits: ['Clown au visage blanc, nez rouge, bouche bleue et collerette à volants bleue.', 'Combinaison jaune à boutons rouges, chapeau pointu à pompon, gants blancs et chaussures rouges.'],
    framing: 'Cadre extrait sans fragment d’une cellule voisine ; la pointe du chapeau reste dans la cellule.',
    identity: 'La tenue de clown rend l’identité de Kaufmo lisible, mais le sprite ne montre pas l’état abstrait que l’archive distingue pour ce personnage.',
    issues: ['Le costume du sprite est jaune et bleu ; sa correspondance avec la tenue du pilote n’est pas vérifiée.'],
    gap: 'Kaufmo apparaît dans le pilote, mais aucun plan officiel consulté ne le montre entier et de face.',
  },
  ribbit: {
    sheet: 'abstracted', cell: 'rangée 1, colonne 1', size: '307 × 512 px',
    visibleTraits: ['Grenouille verte debout, grands yeux blancs sur le dessus de la tête et nœud papillon rose.', 'Ventre crème, membres longs et mains à trois doigts.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'Silhouette de grenouille anthropomorphe cohérente avec le nom Ribbit ; l’archive ne nomme aucun épisode.',
    issues: [],
    gap: 'Aucun visuel officiel consulté ne montre cette grenouille ; l’archive la classe « pré-abstraction / abstrait ensuite » sans source datée.',
  },
  scratch: {
    sheet: 'abstracted', cell: 'rangée 1, colonne 2', size: '307 × 512 px',
    visibleTraits: ['Chien jaune mâtiné de brun, longues oreilles tombantes, museau brun et truffe noire.', 'Pull rouge, gants blancs et chaussures brunes ; aucune rayure sur le pelage.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'Le dessin est un chien anthropomorphe de dessin animé ; il ne correspond pas au chat rayé annoncé par la route générée de Scratch.',
    issues: ['Contradiction d’identité : la fiche de route parle d’un chat rayé alors que le sprite est un chien.', 'Le nom Scratch n’est rattaché à aucun personnage attesté dans une source consultée.'],
    gap: 'Aucun plan primaire ne documente Scratch ; le titre de la route devra être corrigé ou justifié avant toute promotion narrative.',
  },
  wormo: {
    sheet: 'abstracted', cell: 'rangée 1, colonne 3', size: '308 × 512 px',
    visibleTraits: ['Ver vertical segmenté, alternance de segments orange et verts et deux grands yeux bleus.', 'Joues en spirale rose et fine antenne recourbée au sommet.'],
    framing: 'Un fragment blanc d’une cellule voisine reste collé au bord droit du cadre extrait.',
    identity: 'Le ver anthropomorphe est cohérent avec le nom Wormo ; l’archive ne cite ni épisode ni source.',
    issues: ['Le cadre contient un débris blanc de la cellule voisine à droite.', 'Le sprite est suspendu à un crochet peint, qui fera partie de la silhouette de combat.'],
    gap: 'Aucun visuel officiel consulté ne montre Wormo ; son échelle et sa pose de duel restent à comparer à un plan primaire.',
  },
  bizco: {
    sheet: 'abstracted', cell: 'rangée 1, colonne 4', size: '307 × 512 px',
    visibleTraits: ['Bouffon au visage rond blanc, joues rouges et chapeau à grelots violet et rouge.', 'Combinaison violette à pois, gants blancs et chaussures rouges.'],
    framing: 'Un fragment rayé rouge et blanc d’une cellule voisine apparaît en bas à droite du cadre extrait.',
    identity: 'Le costume de bouffon explique le nom Bizco, mais aucune source consultée ne rattache ce dessin à un résident nommé de la série.',
    issues: ['Un fragment rayé de la cellule voisine reste dans le cadre en bas à droite.'],
    gap: 'Aucun plan primaire ne documente Bizco ; la revue reste limitée au sprite et à son détourage.',
  },
  rattie: {
    sheet: 'abstracted', cell: 'rangée 1, colonne 5', size: '307 × 512 px',
    visibleTraits: ['Rousse anthropomorphe gris-brun, oreilles rondes à intérieur bleu et mèche rouge.', 'Fleur rose sur le torse, dents visibles et longue queue spiralée.'],
    framing: 'Cadre occupant toute la cellule ; un petit point blanc traîne au pied droit.',
    identity: 'La rousse anthropomorphe correspond au nom Rattie ; la mèche rouge et la fleur sont des détails du dessin, non des traits attestés.',
    issues: [],
    gap: 'Aucun visuel officiel consulté ne montre Rattie ; aucune source ne précise son gabarit canonique.',
  },
  spike: {
    sheet: 'abstracted', cell: 'rangée 2, colonne 1', size: '307 × 512 px',
    visibleTraits: ['Dinosaure violet à crêtes orange, taches multicolores et ventre crème.', 'Chapeau de fête jaune, griffes bleues et longue queue.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'Le sprite est un dinosaure de fête ; il ne montre ni piquant dominant ni lecture de hérisson, alors que la fiche le nomme « Le petit piquant ».',
    issues: ['Le titre « Le petit piquant » ne décrit pas la crête du dinosaure.'],
    gap: 'Aucun plan primaire ne documente Spike ; l’identité de dinosaure n’est attestée que par l’atlas.',
  },
  pinkcyclops: {
    sheet: 'abstracted', cell: 'rangée 2, colonne 2', size: '307 × 512 px',
    visibleTraits: ['Monstre rose à fourrure longue, un seul œil bleu et deux petits pieds.', 'Petite queue et bras courts terminés par des mains à trois doigts.'],
    framing: 'Un fragment bleu-violet d’une cellule voisine reste collé au bord gauche du cadre extrait.',
    identity: 'Le cyclope rose velu correspond exactement au nom descriptif de l’archive Pink Furry Cyclops.',
    issues: ['Un fragment bleu-violet de la cellule voisine reste dans le cadre à gauche.'],
    gap: 'Aucun visuel officiel consulté ne montre ce cyclope ; son échelle de colosse est une règle du jeu.',
  },
  yellowclown: {
    sheet: 'abstracted', cell: 'rangée 2, colonne 3', size: '308 × 512 px',
    visibleTraits: ['Clown jaune au visage triste, larmes bleues, nez rouge et collerette bleue à volants.', 'Deux antennes à pompons, corps jaune à boutons rouges et pieds orange.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'Le clown jaune qui boude correspond au nom descriptif Frowning Yellow Clown de l’archive.',
    issues: [],
    gap: 'Aucun plan primaire ne documente ce clown ; la tristesse du visage est observée dans le dessin, pas dans la série.',
  },
  oyster: {
    sheet: 'abstracted', cell: 'rangée 2, colonne 4', size: '307 × 512 px',
    visibleTraits: ['Coquille bleu-gris à bord ondulé, ouverte sur une grande perle blanche.', 'La perle porte deux yeux noirs et un bec ; deux petits pieds violets dépassent.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'L’huître à perle vivante correspond au nom The Oyster ; l’archive ne cite aucun épisode.',
    issues: [],
    gap: 'Aucun visuel officiel consulté ne montre cette huître ; sa coquille n’est pas comparée à un plan primaire.',
  },
  bulbcreature: {
    sheet: 'abstracted', cell: 'rangée 2, colonne 5', size: '307 × 512 px',
    visibleTraits: ['Créature verte en forme d’ampoule, grands yeux violets et nœud papillon rose.', 'Petit corps rouge et blanc, chaussures roses.'],
    framing: 'Un mince fragment coloré d’une cellule voisine touche le bord droit du cadre extrait.',
    identity: 'La créature en ampoule verte correspond au nom Light Green Bulb Creature de l’archive.',
    issues: ['Un mince fragment de la cellule voisine reste dans le cadre à droite.'],
    gap: 'Aucun plan primaire ne documente cette créature ; son rôle de lanterne est une invention de fan-game.',
  },
  abel: {
    sheet: 'base', cell: 'rangée 3, colonne 4', size: '256 × 341 px', archiveEpisodes: ['ep7'],
    visibleTraits: ['Enfant blond auréolé, robe blanche à liseré doré et ceinture dorée.', 'Bottes blanches et une main levée en geste d’accueil.'],
    framing: 'Un fragment orange d’une cellule voisine apparaît au bord droit du cadre extrait.',
    identity: 'L’archive nomme Abel et le date de l’épisode 7, mais le sprite est un angelot ; aucune source consultée ne confirme cette identité.',
    issues: ['Le fragment orange du voisin reste dans le cadre à droite.', 'L’attribution à l’épisode 7 ne vient que du catalogue d’archive.'],
    gap: 'La route d’Abel cite le pilote alors que l’archive le date de l’épisode 7 ; cette contradiction reste ouverte.',
  },
  max: {
    sheet: 'variants', cell: 'rangée 1, colonne 1', size: '384 × 341 px',
    visibleTraits: ['Crocodile de confiserie vert, chapeau de cowboy brun à fleur rose et bandana rouge.', 'Ceinture à boucle, crêtes dorsales, longue queue et sucette rose tenue à la main.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'Le crocodile vert en tenue de cowboy appartient à la famille visuelle de Gummigoo et de son convoi ; aucun plan ne permet de certifier Max nommément.',
    issues: [],
    gap: 'Le plan officiel de Candy Canyon consulté ne montre aucun membre du convoi : la parenté avec Gummigoo reste une lecture du dessin.',
  },
  chad: {
    sheet: 'variants', cell: 'rangée 1, colonne 2', size: '384 × 341 px',
    visibleTraits: ['Crocodile vert plus large, chapeau sombre, bandana violet et pantalon écossais brun-rouge.', 'Sucette tenue devant le torse, crêtes et queue visibles.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'La silhouette trapue de crocodile de confiserie évoque le convoi de Gummigoo ; le nom Chad ne vient que du catalogue.',
    issues: ['Le gabarit de colosse est une décision de jeu, non une mesure de l’épisode.'],
    gap: 'Aucun plan primaire consulté ne montre Chad ; sa parenté avec Gummigoo n’est pas démontrée.',
  },
  orbsman: {
    sheet: 'variants', cell: 'rangée 1, colonne 3', size: '384 × 341 px',
    visibleTraits: ['Personnage de foire assemblé en sphères colorées, tête verte et haut-de-forme violet.', 'Gants blancs, chaussures rouges et nœud papillon rouge.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'La figure sphérique correspond au nom Orbsman de l’archive ; aucun épisode n’est nommé par une source consultée.',
    issues: [],
    gap: 'Orbsman est daté de l’épisode 3 par la fiche, mais aucun plan du manoir consulté ne montre ce personnage.',
  },
  ming: {
    sheet: 'ming', cell: 'planche dédiée, figure unique', size: '1024 × 1536 px',
    visibleTraits: ['Androïde gris articulé, visière verte et grands yeux ronds, membres à rotules.', 'Debout sur une ellipse verte lumineuse incluse dans le dessin.'],
    framing: 'La planche dédiée ne contient qu’une figure et son halo ; aucun voisin.',
    identity: 'Figure de mannequin-machine ; ni le nom Ming ni l’épisode 1 de la fiche ne sont étayés par une source consultée.',
    issues: ['L’ellipse lumineuse est peinte dans le dessin et sera détourée comme partie du sprite.'],
    gap: 'Aucun plan primaire ne documente Ming ; son apparence d’androïde reste une donnée d’archive.',
  },
  marthamildenhall: {
    sheet: 'canonA', cell: 'rangée 1, colonne 2', size: '443 × 887 px',
    visibleTraits: ['Femme translucide verte, large capeline et robe longue à plis.', 'Tient une petite tasse à deux mains ; les traits du visage sont effacés par la transparence.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'La silhouette spectrale féminine est cohérente avec le manoir de l’épisode 3 et le nom Martha Mildenhall, sans plan primaire consulté.',
    issues: ['Le sprite est entièrement translucide ; son opacité de rendu n’est pas comparée à la série.'],
    gap: 'Aucun visuel officiel consulté ne montre Martha Mildenhall ; le manoir n’est documenté que par le lien d’épisode.',
  },
  ghostly: {
    sheet: 'canonA', cell: 'rangée 1, colonne 3', size: '443 × 887 px',
    visibleTraits: ['Petit fantôme vert d’eau aux grands yeux blancs et à la bouche ouverte.', 'Corps en goutte terminé par une queue ondulante.'],
    framing: 'Une griffe blanche d’une cellule voisine reste collée au bord droit du cadre extrait.',
    identity: 'Le fantôme goutte correspond au nom Ghostly de l’archive ; aucune source consultée ne lui attribue un rôle dans le manoir.',
    issues: ['Une griffe blanche du voisin reste dans le cadre à droite.'],
    gap: 'Aucun plan primaire ne documente Ghostly ; son apparence complète reste non comparée.',
  },
  angel: {
    sheet: 'canonA', cell: 'rangée 1, colonne 4', size: '444 × 887 px',
    visibleTraits: ['Silhouette décharnée gris pâle, crâne étroit aux orbites sombres.', 'Très longs bras à doigts crochus et deux grandes ailes nervurées déployées.'],
    framing: 'Cadre occupant toute la cellule ; les ailes touchent les bords sans inclure de voisin.',
    identity: 'L’archive nomme Angel une figure d’ange décharnée ; le sprite est plus proche d’un spectre du manoir que de l’angelot Abel.',
    issues: ['Deux fiches voisines, Abel et Angel, proposent des anges très différents sans source primaire.'],
    gap: 'Aucun plan primaire ne documente Angel ; l’identité angélique n’est attestée que par le nom du catalogue.',
  },
  disappearingguy: {
    sheet: 'canonB', cell: 'rangée 1, colonne 1', size: '355 × 887 px', archiveEpisodes: ['ep5', 'ep6'],
    visibleTraits: ['Silhouette rouge articulée, chapeau à large bord et visage sans traits.', 'Membres à rotules, gants et bottes de la même teinte rouge.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'La figure encapuchonnée rouge ne montre aucun effet de disparition ; son nom vient uniquement du catalogue.',
    issues: ['Le nom Disappearing Guy n’est soutenu par aucun élément visible du dessin.'],
    gap: 'L’archive date ce sprite des épisodes 5 et 6 alors que la route actuelle cite le pilote ; aucune des deux attributions n’est vérifiée.',
  },
  committeemember: {
    sheet: 'canonB', cell: 'rangée 1, colonne 2', size: '355 × 887 px', archiveEpisodes: ['ep6'],
    visibleTraits: ['Mannequin gris argenté, visage lisse sans traits et articulations visibles.', 'Tient un badge rond bleu à ruban devant le torse.'],
    framing: 'Un fragment orange d’une cellule voisine reste collé au bord droit du cadre extrait.',
    identity: 'Le mannequin à badge évoque un membre de comité ; aucun plan consulté ne documente ce personnage.',
    issues: ['Le fragment orange du voisin reste dans le cadre à droite.'],
    gap: 'L’archive date ce sprite de l’épisode 6 alors que la route cite le pilote ; la contradiction reste ouverte.',
  },
  shrimpnpc: {
    sheet: 'canonB', cell: 'rangée 1, colonne 5', size: '355 × 887 px', archiveEpisodes: ['ep7'],
    visibleTraits: ['Crevette orange recourbée, longues antennes et gros œil noir.', 'Nombreuses pattes, segments dorsaux et éventail caudal.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'La crevette correspond au nom descriptif Shrimp NPC ; l’archive la date de l’épisode 7.',
    issues: [],
    gap: 'La route cite l’épisode 2 alors que l’archive date ce sprite de l’épisode 7 ; la crevette n’apparaît dans aucun visuel consulté.',
  },
  chineseroomnpc: {
    sheet: 'canonC', cell: 'planche entière, scène unique', size: '1254 × 1254 px',
    visibleTraits: ['Bureau de bois verni, fauteuil sombre et grand livre ouvert au titre « ARTIFICIAL CHINESE DICTIONARY ».', 'Lampe sphérique, dossier noir et paravent à cartes colorées derrière la scène.'],
    framing: 'Le cadre extrait est la scène entière : aucun détourage de personnage n’est possible dans cette cellule.',
    identity: 'La cellule ne contient pas un combattant mais un décor de bureau ; le nom Chinese Room NPC désigne une expérience de pensée et non un personnage attesté.',
    issues: ['Le sprite jouable est un diorama complet : sa silhouette de combat ne correspond à aucun personnage.', 'Le livre affiche un titre anglais lisible qui restera minuscule à l’échelle du duel.'],
    gap: 'Aucun plan primaire ne documente cette scène ; l’archive la date de l’épisode 7 alors que la route cite le pilote.',
  },
  blueai: {
    sheet: 'canonD', cell: 'rangée 1, colonne 1', size: '322 × 330 px', archiveEpisodes: ['ep9'],
    visibleTraits: ['Anneau holographique cyan composé de cercles concentriques et de crochets lumineux.', 'Cœur blanc surexposé au centre et socle circulaire bleu.'],
    framing: 'Cadre resserré autour de l’anneau lumineux ; les coins du damier sont exclus.',
    identity: 'L’anneau lumineux suggère une interface plutôt qu’un résident ; le nom Blue AI et l’épisode 9 viennent du catalogue.',
    issues: ['Le cœur blanc saturé ne laisse lire aucun détail interne.'],
    gap: 'L’archive date ce sprite de l’épisode 9 alors que la route cite le pilote ; aucune source consultée ne montre cette interface.',
  },
  cookiebutterfly: {
    sheet: 'canonD', cell: 'rangée 1, colonne 2', size: '325 × 345 px',
    visibleTraits: ['Papillon orange aux ailes décorées de motifs clairs en croissant.', 'Corps brun fin et antennes recourbées.'],
    framing: 'Cadre resserré sur les ailes ; le damier clair est exclu.',
    identity: 'Le papillon biscuité correspond au nom Cookie Butterfly ; aucune source consultée ne le rattache à Candy Canyon.',
    issues: [],
    gap: 'Aucun plan primaire ne documente ce papillon ; son appartenance à l’épisode 2 n’est pas démontrée.',
  },
  gummyelephant: {
    sheet: 'canonD', cell: 'rangée 1, colonne 3', size: '362 × 363 px',
    visibleTraits: ['Éléphant translucide rose et jaune, longue trompe courbée et petit œil sombre.', 'Quatre pattes arrondies et corps brillant de matière gommeuse.'],
    framing: 'Un fragment d’une cellule voisine touche le bord gauche du cadre extrait.',
    identity: 'L’éléphant de gomme correspond au nom Gummy Elephant ; sa translucidité est peinte, pas native.',
    issues: ['Un fragment de la cellule voisine reste dans le cadre à gauche.'],
    gap: 'Aucun plan primaire ne documente cet éléphant ; son gabarit de colosse est une règle du duel.',
  },
  giantcentipede: {
    sheet: 'canonD', cell: 'rangée 1, colonne 4', size: '362 × 592 px',
    visibleTraits: ['Mille-pattes brun clair à tête rouge sombre et longues antennes.', 'Nombreux segments et pattes latérales, corps arqué.'],
    framing: 'Cadre resserré sur le mille-pattes ; le damier clair est exclu.',
    identity: 'Le mille-pattes correspond au nom Giant Centipede ; l’échelle « géante » reste une donnée du duel.',
    issues: [],
    gap: 'Aucun plan primaire consulté ne montre ce mille-pattes dans le canyon.',
  },
  spudsycustomer: {
    sheet: 'canonD', cell: 'rangée 1, colonne 6', size: '310 × 523 px',
    visibleTraits: ['Client humain aux cheveux bruns en bataille et aux yeux inquiets.', 'Casquette rouge et jaune marquée SPUDSY, chemise jaune à badge du même nom.'],
    framing: 'Cadre resserré sur le personnage ; le damier clair est exclu.',
    identity: 'Le sprite reprend l’uniforme Spudsy de l’épisode 4 ; le visage et la coiffure ne sont attestés par aucun plan consulté.',
    issues: ['Le personnage est une reconstruction : la vignette officielle du comptoir ne montre aucun client.'],
    gap: 'Le comptoir Spudsy de Netflix ne montre aucun client ; le costume et le visage restent à comparer à une frame de l’épisode 4.',
  },
  candyguardcyan: {
    sheet: 'canonE', cell: 'rangée 1, colonne 1', size: '216 × 513 px',
    visibleTraits: ['Mannequin articulé entièrement cyan, visage lisse sans traits et membres à rotules.', 'Aucun motif de confiserie, aucun insigne ni armure visibles.'],
    framing: 'Un fin trait cyan traîne sous le pied gauche dans le cadre extrait.',
    identity: 'La couleur et le nom « garde » viennent de la fiche ; le sprite ne porte ni lance, ni casque, ni emblème de garde.',
    issues: ['Un trait cyan isolé reste sous le pied gauche.', 'Nom de garde sans accessoire distinctif ; les trois gardes ne diffèrent que par la couleur.'],
    gap: 'Le plan officiel de Candy Canyon consulté montre des habitants flous à l’arrière-plan, sans garde identifiable.',
  },
  candyguardblue: {
    sheet: 'canonE', cell: 'rangée 1, colonne 2', size: '295 × 510 px',
    visibleTraits: ['Mannequin articulé entièrement bleu, visage lisse et membres à rotules.', 'Aucun motif de confiserie ni accessoire de garde visible.'],
    framing: 'Un trait bleu isolé apparaît à gauche du corps dans le cadre extrait.',
    identity: 'Même figure que la garde cyan, déclinée en bleu ; aucune source consultée ne nomme cette garde.',
    issues: ['Un trait bleu isolé reste à gauche du corps.'],
    gap: 'Aucun plan primaire ne montre cette garde ; le plan de cour consulté ne permet pas de distinguer les gardes.',
  },
  candyguardpurple: {
    sheet: 'canonE', cell: 'rangée 1, colonne 3', size: '294 × 510 px',
    visibleTraits: ['Mannequin articulé entièrement violet, visage lisse et membres à rotules.', 'Aucun motif de confiserie ni accessoire de garde visible.'],
    framing: 'Un trait violet isolé apparaît à gauche du corps dans le cadre extrait.',
    identity: 'Même figure que les deux autres gardes, déclinée en violet ; aucune source consultée ne nomme cette garde.',
    issues: ['Un trait violet isolé reste à gauche du corps.'],
    gap: 'Aucun plan primaire ne montre cette garde ; son rôle de contrôle est une règle du jeu.',
  },
  gummyworm: {
    sheet: 'canonE', cell: 'rangée 1, colonne 4', size: '229 × 314 px',
    visibleTraits: ['Ver rose segmenté, petits yeux noirs et bouche à peine visible au sommet.', 'Corps en S et anneaux plus sombres.'],
    framing: 'Deux fragments détachés du ver flottent à droite et en bas à droite du cadre extrait.',
    identity: 'Le ver gommeux correspond au nom Gummy Worm ; sa matière translucide n’est pas rendue dans le sprite.',
    issues: ['Deux fragments détachés restent dans le cadre à droite.'],
    gap: 'Aucun plan primaire ne documente ce ver ; le plan de cour consulté ne le montre pas.',
  },
  barrelmonkey: {
    sheet: 'canonE', cell: 'rangée 1, colonne 5', size: '296 × 391 px',
    visibleTraits: ['Singe rouge aux longs bras et à la queue recourbée en point d’interrogation.', 'Anneau sombre autour de la taille et gants blancs.'],
    framing: 'Un fragment blanc d’une cellule voisine reste au bord supérieur droit du cadre extrait.',
    identity: 'Le singe correspond au nom Barrel Monkey, mais aucun tonneau n’est visible dans le dessin.',
    issues: ['Un fragment blanc du voisin reste dans le cadre en haut à droite.', 'Aucun tonneau n’est représenté malgré le nom du personnage.'],
    gap: 'Aucun plan primaire ne documente ce singe ; le tonneau annoncé par son nom reste à retrouver.',
  },
  jeffery: {
    sheet: 'canonE', cell: 'rangée 1, colonne 6', size: '260 × 503 px',
    visibleTraits: ['Tête pâle pointue à un œil, surmontée d’un haut-de-forme noir.', 'Veste rouge et jaune à rayures, gants blancs et chaussures noires.'],
    framing: 'Cadre occupant toute la cellule ; aucun fragment voisin n’est visible.',
    identity: 'Créature en queue-de-pie ; l’archive la décrit comme une extension de Caine, ce que le sprite ne démontre pas.',
    issues: ['L’identité « extension de Caine » ne repose sur aucun élément visible du dessin.'],
    gap: 'Aucun plan primaire ne documente Jeffery ; sa parenté avec Caine reste une hypothèse d’archive.',
  },
  mildenhallsouls: {
    sheet: 'canonF', cell: 'rangée 1, colonne 5', size: '362 × 442 px',
    visibleTraits: ['Spectre vert d’eau translucide, deux yeux lumineux et corps en pointe.', 'Une corne blanche appartenant à une autre entité occupe le bord droit du cadre.'],
    framing: 'Le cadre extrait contient un second élément blanc à droite, séparé du spectre.',
    identity: 'Le spectre correspond au nom Mildenhall Souls ; la corne blanche n’appartient pas à cette entité.',
    issues: ['Le sprite assemble deux entités distinctes dans une même cellule.'],
    gap: 'Aucun plan primaire ne documente les âmes du manoir ; leur apparence reste non comparée.',
  },
  redmannequin: {
    sheet: 'canonF', cell: 'rangée 1, colonne 1', size: '175 × 577 px', archiveEpisodes: ['ep2'],
    visibleTraits: ['Mannequin d’artiste rouge, articulations sombres et visage sans traits.', 'Aucun vêtement ni accessoire.'],
    framing: 'Cadre resserré sur la seule figure ; aucun fragment voisin n’est visible.',
    identity: 'Mannequin d’atelier monochrome ; la couleur et le nom viennent du catalogue, aucune garde-robe ni épisode n’est attesté.',
    issues: [],
    gap: 'L’archive date les mannequins de l’épisode 2 alors que la route cite le pilote ; aucune des deux attributions n’est vérifiée.',
  },
  orangemannequin: {
    sheet: 'canonF', cell: 'rangée 1, colonne 2', size: '330 × 577 px', archiveEpisodes: ['ep2'],
    visibleTraits: ['Mannequin orange à rotules sombres et tête ovale sans visage.', 'Aucun vêtement ni accessoire.'],
    framing: 'Une fine tige orange détachée apparaît à droite du cadre extrait.',
    identity: 'Même mannequin d’atelier que le rouge, décliné en orange ; aucune source consultée ne nomme cette variante.',
    issues: ['Une tige orange détachée reste dans le cadre à droite.'],
    gap: 'Même contradiction d’épisode que les autres mannequins ; aucun plan primaire consulté ne les montre.',
  },
  yellowmannequin: {
    sheet: 'canonF', cell: 'rangée 1, colonne 3', size: '362 × 578 px', archiveEpisodes: ['ep2'],
    visibleTraits: ['Mannequin jaune articulé, tête ovale et mains à peine marquées.', 'Aucun vêtement ni accessoire.'],
    framing: 'Un segment jaune détaché flotte à droite du cadre extrait.',
    identity: 'Même mannequin d’atelier que le rouge, décliné en jaune ; aucune source consultée ne nomme cette variante.',
    issues: ['Un segment jaune détaché reste dans le cadre à droite.'],
    gap: 'Même contradiction d’épisode que les autres mannequins ; aucun plan primaire consulté ne les montre.',
  },
  magentamannequin: {
    sheet: 'canonF', cell: 'rangée 1, colonne 4', size: '362 × 577 px', archiveEpisodes: ['ep2'],
    visibleTraits: ['Mannequin magenta articulé et tête ovale sans traits.', 'Aucun vêtement ni accessoire.'],
    framing: 'Un fragment gris de l’entité voisine reste au bord droit du cadre extrait.',
    identity: 'Même mannequin d’atelier que le rouge, décliné en magenta ; aucune source consultée ne nomme cette variante.',
    issues: ['Un fragment gris du voisin reste dans le cadre à droite.'],
    gap: 'Même contradiction d’épisode que les autres mannequins ; aucun plan primaire consulté ne les montre.',
  },
};

const expansionFidelity = def => {
  const review = EXPANSION_SPRITE_REVIEWS[def.id];
  const sheet = expansionSheets[review.sheet];
  return {
    ...pending(
      [...new Set([def.sourceId, ...(review.archiveEpisodes || [])])],
      `Le PNJ ${def.name} reçoit un kit de dix techniques originales pour le duel. Rôle, portée, dégâts et ressources sont des règles de fan-game.`,
      `${review.gap} Aucun visuel officiel consulté ne montre ${def.name} : la revue reste technique et porte sur la cellule d’atlas ${sheet.file} (${review.cell}, ${review.size}). Les proportions, les gestes et le costume canoniques restent à confronter à un plan primaire de l’épisode cité ; aucune capacité de combat canonique n’est déclarée.`,
    ),
    assetReview: {
      status: 'Revue technique 0.7.0 effectuée',
      captureId: `expansion-sprites-0.7.0#${def.id}`,
      sheet: sheet.file,
      cell: review.cell,
      extractedSize: review.size,
      visibleTraits: review.visibleTraits,
      framing: review.framing,
      transparency: sheet.transparency,
      proportions: `Cadre extrait ${review.size} pour un corps de simulation ${def.width} × ${def.height} px ; l’échelle du duel est une décision de jeu, pas une mesure de l’épisode.`,
      identityEvidence: review.identity,
      issues: review.issues,
    },
  };
};

export const FIGHTER_FIDELITY = freeze({
  pomni: appearance(['ep1', 'glitch-cast', 'glitch-void'], ['Costume de bouffon partagé entre rouge et bleu, avec pompons et boutons jaunes.', 'Visage clair, cheveux courts sombres, grands yeux et gants de couleurs différentes.'], 'L’esquive, les frappes et les accessoires lancés forment un kit original. Le recul de la version 0.3.0 se déroule physiquement sur 15 images actives.', 'Costume de base et visage observés sur les images du groupe et du Vide ; aucune capacité de téléportation attribuée par cette revue.'),
  jax: appearance(['ep1', 'glitch-cast', 'glitch-candy-court'], ['Lapin violet élancé aux longues oreilles droites.', 'Yeux, dents et gants jaunes ; salopette rose à boutons jaunes.'], 'Les coups de pied, la clef boomerang, le piège et l’explosion sont des choix du fan-game. Le portrait souriant ne prouve aucune technique.', 'Silhouette et tenue de base observées sur deux visuels officiels. La planche 0.5.0 corrige les huit cellules : peau violette, salopette rose, yeux et gants jaunes, dents jaunes sur les sept bouches ouvertes. La pose pointée garde la bouche fermée. Image régénérée avec transparence conservée et racines remesurées ; les contours ne sont pas identiques pixel par pixel à la source historique. Aucun dessin de combat dédié ni validation canonique 1:1. Comportement narratif non réévalué à partir d’images fixes.'),
  ragatha: appearance(['ep1', 'glitch-cast'], ['Poupée de tissu aux cheveux de laine rouges et au nœud bleu.', 'Un œil en bouton bleu, un œil blanc et une robe bleue avec pièces de tissu.'], 'Les boutons lancés, la réduction de dégâts et le soin de vie récupérable interprètent son apparence de poupée pour le duel.', 'Repères du visage, des cheveux et de la robe observés sur le portrait du groupe ; aucune vitesse de réparation canonique déduite.'),
  gangle: appearance(['ep1', 'ep4', 'glitch-cast'], ['Corps composé de rubans rouges.', 'Masque de théâtre blanc avec ouvertures sombres.'], 'Les rubans offensifs, le masque projectile et la barrière sont des mécaniques créées pour le combat.', 'Corps et masque visibles sur le portrait du groupe ; états de masque et tenue de travail à comparer dans leurs séquences respectives.'),
  zooble: appearance(['ep1', 'glitch-cast'], ['Corps composé de pièces géométriques de formes et de couleurs différentes.', 'Tête triangulaire rose, yeux et membres asymétriques.'], 'L’allonge, les pièces boomerangs et les blocs piégés sont réglés pour le jeu. La modularité visuelle ne prouve pas ces attaques.', 'Assemblage de base observé sur le portrait du groupe ; les configurations alternatives exigent chacune une référence.'),
  kinger: appearance(['ep1', 'ep3', 'glitch-cast'], ['Tête de pièce de roi en bois avec croix et grands yeux.', 'Manteau royal violet bordé de fourrure claire tachetée.'], 'Les frappes, la salve, la barrière et le renvoi de projectiles sont des adaptations. Les images fixes ne documentent pas ses moments de lucidité.', 'Silhouette et manteau observés sur le portrait du groupe ; accessoires et comportements du manoir à revoir dans l’épisode 3.'),
  caine: appearance(['ep1', 'glitch', 'glitch-cast'], ['Tête formée de mâchoires dentées et de deux yeux, sans visage humain.', 'Queue-de-pie rouge, gants blancs, pantalon noir et canne.'], 'La présentation de maître de cérémonie inspire les confettis et la mise en scène. La téléportation de duel, sa distance et ses fenêtres restent une mécanique du jeu.', 'Tenue et tête observées dans le portrait officiel ; aucune puissance ni limite de ses interventions déduite de cette image.'),
  bubble: pending(['ep1'], 'La petite silhouette flottante de l’atlas reçoit des morsures, des rebonds, des bulles offensives et un renvoi de projectile créés pour le duel.', 'Le pilote est identifié. Comparaison visuelle de Bubble, de sa transparence et de sa bouche encore à faire sur une image primaire dédiée ; aucune échelle canonique mesurée.'),
  gummigoo: appearance(['ep2', 'glitch-undermap'], ['Crocodile de confiserie vert et jaune dont la matière paraît translucide.', 'Museau allongé, membres arrondis et chapeau brun tenu devant le corps dans le plan consulté.'], 'Les bonbons lancés, la gomme collante et la charge de convoi sont des adaptations. Aucune production corporelle de projectiles n’est attestée par cette image.', 'Matière, couleurs et chapeau observés dans le plan sous la carte ; ce repère ne valide pas automatiquement ses proportions dans l’atlas.'),
  loolilalu: appearance(['ep2', 'glitch-candy-court'], ['Silhouette royale rose et blanche dans le palais de confiserie.', 'Robe large et motifs clairs évoquant le glaçage.'], 'Le sceptre utilisé comme arme, les projectiles de sucre et la barrière sont des choix de combat à distinguer de la tenue observée.', 'Repères généraux visibles à l’arrière-plan du visuel officiel ; visage, couronne et petits accessoires restent à contrôler sur un gros plan.'),
  gloinkqueen: pending(['ep1'], 'La reine est adaptée en colosse horizontal. La taille 420 × 150 du corps de simulation, les portées, les Gloinks lancés et l’armure sont des règles du duel.', 'Pilote identifié, mais aucune frame dédiée n’a été validée pour les proportions de cet atlas. Le détourage et l’orientation sont des contrôles techniques, pas des mesures canoniques.'),
  fudge: pending(['ep2'], 'La masse de l’atlas devient un colosse jouable ; boulets, flaques, armure et dégâts sont réglés pour le combat.', 'Épisode 2 identifié. Matière, yeux, bouche et proportions à comparer à des plans primaires ; aucune taille réelle ni capacité de tir certifiée.'),
  abstractedkaufmo: pending(['ep1'], 'La forme abstraite possède un kit original de contact, de charges et d’effets de simulation. Le repli 0.3.0 est une translation physique de 135 pixels sur 15 images actives.', 'Pilote identifié. La silhouette sombre et ses yeux demandent une comparaison sur des frames dédiées ; la forme non abstraite de Kaufmo reste une identité visuelle distincte dans les archives.'),
  baronmildenhall: pending(['ep3'], 'Le personnage du manoir est transformé en combattant de précision. La cadence des tirs, les pièges, les contres et la récupération de stabilité sont créés pour le jeu.', 'Épisode 3 identifié. Apparence, arme, état spectral et gestes à comparer aux plans primaires ; aucun arsenal complet du jeu déclaré canonique.'),
  ...Object.fromEntries(EXPANSION_DEFS.map(def => [def.id, expansionFidelity(def)])),
  ...Object.fromEntries(ABSTRACTION_DEFS.map(def => [def.id, abstractionFidelity(def)])),
});

// Each row follows the ten authored slots, but gives a distinct explanation of
// the game rule rather than turning a visual motif into a canonical power.
const slots = ['light', 'heavy', 'low', 'throw', 'special', 'specialDown', 'specialForward', 'specialBack', 'super', 'utility'];
const moveAdaptations = {
  pomni: [
    'Frappe réflexe inventée pour donner une interruption rapide au personnage.',
    'Coup de pied haut chorégraphié pour le duel ; aucune pose de l’épisode n’est reproduite à l’identique.',
    'Glissade offensive basse créée pour passer sous une attaque haute.',
    'Saisie et dégagement créés pour les règles de projection du moteur.',
    'Balle de jonglerie utilisée comme accessoire projectile ; ce lancer est une création du jeu.',
    'Recul bas continu de 72 pixels nominaux sur 12 images actives ; fenêtre d’esquive créée pour le duel.',
    'Course offensive inspirée du motif des sorties, sans ouvrir de porte ni changer de lieu.',
    'Recul physique de 150 pixels nominaux : préparation 5, déplacement 15 à −10 pixels/image, récupération 10 ; coût 25. Aucune téléportation dans les règles 0.3.0.',
    'Traversée offensive et impact final créés pour la jauge de finale.',
    'Pause de récupération de stabilité, ressource propre au jeu et sans équivalent canonique mesuré.',
  ],
  jax: [
    'Jab rapide inventé pour commencer les enchaînements.',
    'Coup de pied à grande portée conçu autour de la silhouette élancée.',
    'Croche-patte inventé comme attaque basse du kit.',
    'Projection courte créée pour éloigner l’adversaire dans le ring.',
    'Clef transformée en projectile boomerang ; retour automatique et ricochets relèvent des règles du jeu.',
    'Piège retardé posé au sol ; déclenchement et dégâts sont des inventions de combat.',
    'Coup avançant avec léger lancement vertical, conçu pour les enchaînements.',
    'Contre de mêlée avec fenêtre active réglée par le moteur.',
    'Projectile à explosion retardée inventé pour la finale ; aucun explosif canonique validé par cette fiche.',
    'Pose de récupération de stabilité ; le sourire n’est pas présenté comme une source de pouvoir.',
  ],
  ragatha: [
    'Frappe courte créée à partir de la silhouette de poupée.',
    'Impact ample de corps chorégraphié pour le duel.',
    'Attaque basse de contrôle ; portée définie pour l’équilibrage.',
    'Étreinte convertie en projection offensive par les règles du jeu.',
    'Bouton utilisé comme accessoire lancé et rebondissant ; sa création et son retour ne sont pas des pouvoirs attestés.',
    'Couture interprétée comme réduction du prochain impact ; cette armure chiffrée est une règle originale.',
    'Avancée offensive lourde inventée pour rapprocher le personnage.',
    'Riposte de contact créée pour le système de parade.',
    'Grand impact avec projection verticale, créé pour la jauge de finale.',
    'Réparation interprétée comme soin limité à la vie récupérable ; quantité, coût et délai sont des règles du jeu.',
  ],
  gangle: [
    'Ruban utilisé comme frappe de contact à portée allongée.',
    'Ruban mis en scène comme fouet haut ; trajectoire et dégâts originaux.',
    'Ruban utilisé comme balayage bas avec récupération volontairement longue.',
    'Nœud de rubans converti en saisie par le système de projection.',
    'Masque de comédie lancé comme accessoire projectile ; aucune capacité canonique de lancer n’est certifiée.',
    'Ruban au sol transformé en piège ralentissant ; durée et statut viennent du moteur.',
    'Déploiement de rubans chorégraphié comme frappe longue, presque stationnaire.',
    'Masque interprété comme barrière à un impact ; absorption des projectiles créée pour le jeu.',
    'Large fouetté de rubans inventé comme finale.',
    'Ajustement du masque associé à une récupération de stabilité propre au duel.',
  ],
  zooble: [
    'Coup droit créé à partir des membres asymétriques.',
    'Bras utilisé pour une frappe lourde allongée ; portée réglée pour le duel.',
    'Attaque basse du membre inférieur ; le nom du coup décrit le kit, pas toutes les configurations de Zooble.',
    'Projection inventée autour du thème de l’assemblage.',
    'Pièce détachée convertie en projectile à retour automatique ; comportement de boomerang inventé.',
    'Bloc géométrique déposé comme piège destructible ; ce comportement n’est pas attesté par le portrait.',
    'Extension offensive des pièces inventée pour couvrir une longue distance.',
    'Changement de pièce mis en scène comme parade de mêlée.',
    'Assemblage offensif et projection verticale créés pour la finale.',
    'Réassemblage associé à la jauge de stabilité du jeu.',
  ],
  kinger: [
    'Frappe de main créée pour le duel ; animation et portée à comparer séparément.',
    'Impact haut et lourd conçu pour le rôle défensif du kit.',
    'Socle utilisé comme balayage dans une chorégraphie originale.',
    'Projection de proximité inventée pour le système de saisies.',
    'Salve de trois projectiles virtuels ; le nom évoque le manoir sans attribuer un pouvoir d’écho au personnage.',
    'Fort de coussins interprété comme barrière à deux projectiles ; absorption et durée sont des règles originales.',
    'Sortie du fort transformée en avancée offensive lente.',
    'Parade renvoyant un projectile simple ; la réflexion n’est pas une faculté attestée par les références consultées.',
    'Impact de finale inspiré du vocabulaire des échecs, avec dégâts et portée créés pour le jeu.',
    'Pause de récupération nommée en référence au personnage ; la lucidité n’est pas réduite à une statistique canonique.',
  ],
  caine: [
    'Canne visible dans le portrait utilisée comme arme de contact par adaptation.',
    'Geste de présentation converti en coup haut.',
    'Balayage de canne chorégraphié comme attaque basse.',
    'Saisie mettant le rival en place pour le spectacle, inventée pour le duel.',
    'Confettis de spectacle convertis en projectile offensif ; dégâts et vitesse originaux.',
    'Marque lumineuse au sol transformée en piège appliquant un statut de simulation.',
    'Entrée en scène convertie en frappe avançante.',
    'Repositionnement instantané de 180 pixels créé pour le maître de cérémonie ; cette distance et ses fenêtres ne sont pas des données de l’épisode.',
    'Série de cinq projectiles de spectacle créée pour la jauge de finale.',
    'Préparation d’un numéro associée à la récupération de stabilité du moteur.',
  ],
  bubble: [
    'Courte morsure virtuelle inventée pour le personnage flottant.',
    'Claquement de bouche plus lent, réglé comme frappe forte.',
    'Rebond au ras du sol conçu comme attaque basse.',
    'Bouchée convertie en saisie courte par les règles de projection.',
    'Petite bulle offensive créée comme projectile lent ; aucune production de bulles attestée ici.',
    'Recul physique de 80 pixels nominaux sur 10 images actives, créé pour le duel.',
    'Charge de la silhouette flottante inventée comme attaque avançante.',
    'Surface de bulle interprétée comme renvoi de projectile ; pouvoir de réflexion non certifié.',
    'Bulle avec explosion retardée créée pour la finale.',
    'Regonflement associé à la récupération de stabilité propre au jeu.',
  ],
  gummigoo: [
    'Coup de poing court inventé pour le combat de proximité.',
    'Coup de queue chorégraphié comme frappe haute.',
    'Queue utilisée pour un balayage bas original.',
    'Projection inspirée du vocabulaire du convoi, sans reproduction d’une scène.',
    'Bonbon lancé comme accessoire rebondissant ; l’image de matière gommeuse ne prouve pas cette attaque.',
    'Flaque de gomme utilisée comme piège ralentissant ; création de la flaque et statut sont des règles de jeu.',
    'Charge offensive nommée d’après le convoi ; aucun véhicule n’est invoqué.',
    'Riposte de mêlée créée pour la fenêtre de parade.',
    'Charge lourde avec lancement vertical, créée pour la finale.',
    'Pause du convoyeur associée à la récupération de stabilité.',
  ],
  loolilalu: [
    'Sceptre choisi comme accessoire d’arme pour un coup léger ; cet usage offensif reste une adaptation.',
    'Coup long de sceptre inventé pour le contrôle de distance.',
    'Balayage de sceptre créé comme attaque basse, sans cercle magique attesté.',
    'Projection courte inspirée du palais et créée pour le duel.',
    'Éclat de sucre utilisé comme projectile de jeu ; aucun pouvoir de création de sucre certifié.',
    'Carreau de bonbon transformé en piège au sol.',
    'Grand geste de sceptre chorégraphié pour une frappe longue.',
    'Barrière de sucre absorbant un impact créée pour le système défensif.',
    'Trois projectiles de sucre successifs créés pour la finale.',
    'Geste royal associé à la récupération de stabilité du jeu.',
  ],
  gloinkqueen: [
    'Impact de bouche créé pour dépasser le large corps de collision du boss.',
    'Frappe lourde et lente réglée pour le rôle de colosse.',
    'Roulis du corps transformé en balayage massif.',
    'Prise au contact inventée pour les règles de saisie.',
    'Gloink géométrique utilisé comme projectile ; trajectoire, coût et dégâts adaptés au duel.',
    'Nid converti en piège unique destructible avec un délai d’armement.',
    'Charge horizontale créée pour la silhouette allongée du boss.',
    'Carapace interprétée comme réduction de deux impacts ; cette résistance chiffrée est une création.',
    'Choc frontal de finale ; le nom n’entraîne aucune transformation de l’adversaire en Gloink.',
    'Réorganisation du nid associée à une récupération de stabilité.',
  ],
  fudge: [
    'Courte coulée utilisée comme frappe de contact du colosse.',
    'Vague de matière chorégraphiée comme frappe lourde.',
    'Flot rampant transformé en attaque basse.',
    'Enrobage converti en saisie par les règles du moteur.',
    'Boulet de matière chocolatée créé comme projectile lent ; capacité de tir non validée ici.',
    'Mare de matière transformée en piège ralentissant à durée fixe.',
    'Déferlante utilisée comme avancée offensive lente.',
    'Compacité interprétée comme réduction d’un impact ; valeur d’armure créée pour le jeu.',
    'Grand projectile de finale ; le nom n’implique aucune inondation effective de l’arène.',
    'Rassemblement de la masse associé à une récupération de stabilité.',
  ],
  abstractedkaufmo: [
    'Griffe déformée chorégraphiée comme frappe courte.',
    'Masse du corps utilisée pour une frappe haute et une légère projection.',
    'Membre allongé mis en scène comme attaque basse ; forme exacte à comparer à une frame primaire.',
    'Contact converti en saisie ; dégâts et protection après projection définis par le moteur.',
    'Éclat visuel converti en projectile appliquant une marque ; ce tir n’est pas déclaré canonique.',
    'Trace au sol transformée en piège de perturbation ; statut et durée créés pour le duel.',
    'Ruée physique originale avec récupération longue pour permettre la punition.',
    'Recul physique de 135 pixels nominaux : préparation 8, déplacement 15 à −9 pixels/image, récupération 13 ; coût 28. Aucune téléportation dans les règles 0.3.0.',
    'Large impact de finale évoquant le cellier ; il ne libère pas d’autres abstractions dans le match.',
    'Récupération de stabilité de simulation ; le nom ne signifie ni guérison ni réversion canonique de l’abstraction.',
  ],
  baronmildenhall: [
    'Coup de crosse court créé pour le combat de proximité.',
    'Grand coup de crosse chorégraphié comme attaque haute.',
    'Balayage bas original pour protéger l’espace proche.',
    'Projection courte inspirée du manoir et créée pour le duel.',
    'Tir virtuel de précision ; vitesse, dégâts et portée ne proviennent pas d’une mesure de l’épisode.',
    'Piège de chasse créé pour le sol du ring ; présence d’un tel piège dans la série non attestée ici.',
    'Avancée à la crosse conçue comme attaque de mêlée.',
    'Contre de contact inventé pour la fenêtre de parade.',
    'Trois tirs espacés créés pour la jauge de finale.',
    'Préparation de cartouche associée à la stabilité du jeu ; aucune capacité de munitions canonique chiffrée.',
  ],
};
export const MOVE_FIDELITY = freeze({
  ...Object.fromEntries(ABSTRACTION_DEFS.flatMap(def => slots.map(slot => [def.id + '.' + slot, {
    ...abstractionFidelity(def),
    combatAdaptation: 'Technique ' + slot + ' propre à ' + def.name + '. Nom, effets numériques, portée, dégâts, ressources et fenêtres sont créés pour Encore.',
    reviewStatus: 'Adaptation de combat',
    reviewScope: 'Les sources et le classement décrivent l’identité de la silhouette, pas l’exécution du coup. Les gestes de combat et les formes originales restent des créations du fan-game.',
  }]))),
  ...Object.fromEntries(Object.entries(moveAdaptations).flatMap(([fighterId, descriptions]) => slots.map((slot, i) => {
    const parent = FIGHTER_FIDELITY[fighterId];
    return [`${fighterId}.${slot}`, record([...parent.sourceIds], [...parent.observedTraits], descriptions[i], 'Adaptation de combat', 'Les repères observés décrivent l’apparence du personnage, pas l’exécution du coup. Nom, chorégraphie, portée, dégâts, ressources et fenêtres sont créés pour Encore.')];
  }))),
  ...Object.fromEntries(EXPANSION_DEFS.flatMap(def => slots.map(slot => {
    const parent = FIGHTER_FIDELITY[def.id];
    return [`${def.id}.${slot}`, record([...parent.sourceIds], [], `Technique ${slot} générée pour ${def.name} : nom, portée, dégâts et fenêtres sont des règles originales d’Encore, sans geste canonique reproduit.`, 'Adaptation de combat', 'Les repères observés décrivent l’apparence du PNJ, pas l’exécution du coup. Nom, chorégraphie, portée, dégâts, ressources et fenêtres sont créés pour Encore.')];
  })))
});

export const STAGE_FIDELITY = freeze({
  memoryfracture: record([], ['Arches rouge-violet disjointes, miroir ovale fracturé et éclats de verre suspendus dans le décor original du jeu.'], 'Composition originale pour les abstractions inventées : trois plans, piste à y568, lumières et musique créées pour Encore.', 'Création originale Encore', 'Ce lieu est inventé. Les références du cirque fixent une direction artistique ; aucune scène officielle ni reproduction canonique 1:1 n’est revendiquée.'),
  abstractionthreshold: record([], ['Faille noire facettée, arches d’obsidienne et petits yeux colorés dans le lointain ; passerelle horizontale dégagée.'], 'Composition originale pour les abstractions : parallaxe, piste à y568, pulsations discrètes et ambiance sonore créées pour Encore.', 'Création originale Encore', 'Ce seuil est un lieu de fan-game inventé. Aucun plan officiel, aucune géographie canonique ni dimension mesurée n’est revendiqué.'),
  falseexit: record(['ep1', 'glitch-false-exit'],
    ['Une porte rouge identifiée par le mot EXIT se détache des parois grises du couloir.'],
    'La piste est élargie pour accueillir deux combattants. Le mobilier, les plafonniers et les distances entre les plans sont recomposés pour Encore.',
    'Référence visuelle consultée', 'Le visuel officiel renseigne la porte et la palette du couloir. La géométrie du duel est une adaptation.'),
  ...Object.fromEntries(CROSSOVER_STAGES.map(({ id, sourceId, observed, description }) => [
    id, record(id === 'showgrounds' ? [sourceId, 'smg4-showgrounds-map'] : [sourceId], [observed],
      description + ' Les trois plans et le sol horizontal sont composés pour le duel.',
      'Adaptation crossover documentée', 'La composition en parallaxe, les accessoires et leurs proportions sont interprétés pour Encore.'),
  ])),
  bigtop: appearance(['ep1', 'glitch-cast', 'glitch-circus-props'], ['Rideaux rouges et accessoires de jeu de grande taille, dont dés et cubes.', 'Damier au sol, murs colorés et portes arrondies dans les vues consultées.'], 'Piste horizontale, limites du ring et perspective simplifiée créées pour le duel.', 'Palette et objets comparés à deux visuels officiels ; disposition complète du chapiteau non reconstruite.'),
  candy: pending(['ep2'], 'La route du convoi et le canyon deviennent une piste horizontale de combat.', 'Épisode 2 identifié ; relief, route, confiseries et lumière à comparer sur des plans du canyon. Le visuel de la cour ne valide pas ce paysage.'),
  manor: pending(['ep3'], 'Salle du manoir reconstruite en décor de duel sans parcours d’exploration.', 'Épisode 3 identifié ; architecture, portraits et bougies à contrôler sur les plans de la salle choisie.'),
  spudsy: {"sourceIds": ["ep4", "netflix-spudsy-counter"], "observedTraits": ["Façade supérieure bordeaux, grands panneaux de menu jaunes et cuisine ouverte claire/inox derrière le service.", "Comptoir clair avec devant rouge à bandes horizontales dorées.", "Logo circulaire clair à centre rouge portant un S, postes de caisse sombres et équipements de cuisine visibles."], "combatAdaptation": "Recomposition frontale : comptoir blanc/rouge continu, passe de cuisine, hotte, gril, paniers de cuisson, distributeur et caisse. Les cinq panneaux et les mots français lisibles décrivent des catégories du jeu ; ils ne transcrivent pas les offres de la série. La vapeur décorative est rattachée à la surface de cuisson, au-dessus du sol fixe.", "reviewStatus": "Référence visuelle consultée — comparaison partielle", "reviewScope": "Comparaison avec la vignette officielle du distributeur Netflix de l’épisode 4. Faible résolution 300 × 169 : couleurs et grandes masses observées, texte fin et mesures non certifiés. Le placement exact des équipements, le nombre de menus et le plan du restaurant complet restent à revoir dans la vidéo."},
  cellar: appearance(['ep1', 'glitch-cellar'], ['Espace presque noir rempli d’yeux multicolores.', 'Lumière blanche centrale et reflet faible sur le sol.'], 'Sol jouable et distance entre les combattants créés pour le duel ; les yeux servent de décor.', 'Ambiance et motifs observés dans l’image officielle du cellier ; aucune porte d’archives déduite de ce plan.'),
  void: appearance(['ep1', 'glitch-void'], ['Espace blanc aux nuances bleu pâle et lilas.', 'Bandes et franges multicolores dans le plan de Pomni.'], 'Une limite de sol est nécessaire au duel ; elle constitue une convention de jeu. Le plan de référence ne fournit pas de ring mesurable.', 'Le Vide est comparé à son propre visuel officiel ; le couloir EXIT et le quadrillage sous Candy Canyon correspondent à d’autres lieux.'),
  lake: record([], [], 'Rive issue des décors de CainOS, conservée comme adaptation à vérifier.', 'Source primaire à identifier', 'Aucun visuel primaire précis rattaché à ce décor dans cette revue. Son nom ne constitue pas une validation de lieu canonique.'),
  training: record([], [], 'Grille, repères et espace de mesure entièrement créés pour l’entraînement du fan-game.', 'Création originale', 'Décor utilitaire du jeu ; aucune reproduction d’un lieu de la série revendiquée.'),
  undermap: appearance(['ep2', 'glitch-undermap'], ['Espace indigo sombre parcouru de grandes lignes quadrillées bleu cobalt.', 'Sol brillant avec perspective et reflets bleus, distinct du Vide blanc du pilote.'], 'Les personnages du visuel sont retirés ; trois plans séparés, une piste horizontale à y568 et des reflets de premier plan composent une arène originale pour Encore. La disposition de la grille et la profondeur sont adaptées au duel.', 'Palette, grille et matière du sol comparées au visuel officiel GLITCH de Pomni et Gummigoo sous la carte. Un seul plan de référence est consulté : aucune géographie complète, mesure du lieu ni animation canonique n’est certifiée.'),
  barnoir: appearance(['ep5', 'glitch-barnoir-storyboards'], ['Intérieur sombre aux suspensions claires segmentées, étagères de verres et bouteilles et long comptoir à liseré lumineux.', 'Sol noir et blanc en damier, éclairages rose, jaune et vert dont un cocktail et un chien en ballon dessinés en néon.'], 'Le bar devient une composition frontale vide : arrière-plan, comptoir et sol, puis reflets bas en trois plans. Piste horizontale à y568, proportions, éclairage animé et ambiance musicale sont des adaptations originales du jeu. Les enseignes sont simplifiées en motifs sans texte.', 'Comparaison avec trois planches de storyboards publics de l’épisode officiel. Les cellules de 320 × 180 permettent de comparer les grandes masses et les motifs, mais pas les détails fins ni les éléments masqués. Ce décor ne requalifie pas les costumes cachés derrière le comptoir.'),
  gloink: pending(['ep1'], 'Le nid devient un ring parsemé de motifs géométriques ; aucune reproduction de sa géographie complète.', 'Pilote identifié ; matière, palette, volumes et disposition du nid à comparer à une séquence primaire.'),
  softballfield: appearance(['ep5', 'glitch-softballfield-storyboards'], ['Grandes tribunes aux sièges bruns et rouges, structures bleues, auvents et projecteurs rectangulaires blancs sous un ciel bleu sombre.', 'Terrain herbeux vert et zones de terre ocre ; tableau et panneaux de couleur visibles dans les vues larges.'], 'Le stade devient une vue frontale vide à trois plans avec une bande de terre dégagée à y568. Les distances, le point de vue, la séparation des plans, les lumières animées et la musique sont des adaptations originales pour le duel. Personnages, chiffres du score temporaire et textes fins ne sont pas reproduits.', 'Comparaison avec deux planches de storyboards publics de l’épisode officiel, dont trois cellules larges de 320 × 180. Elles qualifient les grandes masses et matériaux, pas les dimensions, les revers masqués ni la géographie complète. La zone CainOS existante et cette nouvelle arène Encore représentent le même lieu ; aucune salle de bowling distincte n’est inférée.'),
  kingdom: {"sourceIds": ["ep2", "glitch-candy-court"], "observedTraits": ["Architecture de confiserie rouge/rose dans la cour, ouvertures cintrées en retrait et large passage ornementé.", "Volutes de glaçage clair autour du passage, décors arrondis et larges piliers au premier plan.", "Petites ouvertures en arcade dans les façades plus éloignées et sol rose visible."], "combatAdaptation": "La façade générique à deux tours pointues devient une cour recomposée : piliers de premier plan, arcades latérales, ouvertures en retrait, portail large et volutes de glaçage. Les marches de fond restent au-dessus de y568 et ne modifient pas la piste. La symétrie, les proportions, les ornements secondaires et les joints du sol sont des choix lisibles pour le duel.", "reviewStatus": "Référence visuelle consultée — comparaison partielle", "reviewScope": "Comparaison du palais avec le visuel officiel GLITCH déjà identifié, cette fois inspecté pour l’architecture. Le cadrage et les personnages masquent une partie de la cour : aucune mesure, géographie complète ou reproduction exhaustive n’est revendiquée. Cette image ne valide pas la route du canyon, qui reste une autre arène."},
  grounds: pending(['ep1'], 'Extérieur du cirque utilisé comme piste de duel avec une pelouse simplifiée.', 'Pilote identifié ; chapiteau, végétation, horizon et éclairage de l’extérieur à comparer sur un plan dédié.'),
  backstage: {"sourceIds": ["ep1", "pilot-residents-copy-near", "pilot-residents-copy-wide"], "observedTraits": ["Dans les copies attribuées au pilote : long couloir à murs rose, rouge et orange, grands panneaux verticaux, tapis rouge et plinthes claires.", "Portes en bois plus basses que les murs, boutons dorés et médaillons de visages ; Kaufmo apparaît sur le plan proche.", "Cadres de bois clair contenant des images abstraites, arche rouge au fond, pots de plantes et cubes colorés sur le plan large."], "combatAdaptation": "La loge générique avec miroir à ampoules et caisses est remplacée par une recomposition du couloir. Six portes et médaillons dessinés en Canvas, tableaux abstraits, trois plafonniers, profondeur centrale et tapis rouge conservent une ligne de combat horizontale à y568. Ordre des chambres, portraits simplifiés, nombre de cadres, perspective et dimensions sont des choix du jeu.", "reviewStatus": "Comparaison partielle — copies du pilote à confirmer", "reviewScope": "Les deux copies ont été inspectées, mais le flux de l’épisode officiel n’a fourni aucun plan visible dans cet environnement. Aucune frame directe ni aucun horodatage canonique n’est déclaré validé. Aucun panneau EXIT, couloir de bureaux ou fausse sortie n’est substitué aux chambres. La référence au produit dérivé de chambres a été écartée comme preuve du couloir."},
  ...COMPLETED_STAGE_FIDELITY,
});

const own = (registry, id) => typeof id === 'string' && Object.hasOwn(registry, id) ? registry[id] : null;
const sourcesById = Object.fromEntries(FIDELITY_SOURCES.map(source => [source.id, source]));
export const getFighterFidelity = id => own(FIGHTER_FIDELITY, id);
// Keep the historical atlas records stable. The illustrated codex can disclose
// newer source observations without silently rewriting archived sprite reviews.
export const getIllustratedFighterFidelity = id => id === 'max' ? MAX_ILLUSTRATED_FIDELITY : getFighterFidelity(id);
export const getMoveFidelity = (fighterId, slot) => own(MOVE_FIDELITY, `${fighterId}.${slot}`);
export const getStageFidelity = id => own(STAGE_FIDELITY, id);
export const getFidelitySources = sourceIds => Array.isArray(sourceIds) ? [...new Set(sourceIds)].map(id => own(sourcesById, id)).filter(Boolean) : [];
