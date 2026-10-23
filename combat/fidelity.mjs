/**
 * Shared provenance for the codex and the planning workbook.
 * A source identifies what to compare; it does not certify an atlas, a costume,
 * an animation or a fighting ability. Observations below only describe the
 * official stills actually consulted. The combat remains an original fan-game.
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
  { id: 'temmer-interview', title: 'Kevin Temmer — entretien sur l’animation du pilote, 4 décembre 2023', url: 'https://www.comicsbeat.com/interview-with-kevin-temmer-of-the-amazing-digital-circus/', kind: 'Entretien primaire', scope: 'Propos directs du lead animator : mouvements nerveux de Pomni, gestuelle de poupée de Ragatha et animation des rubans de Gangle. Ces principes ne certifient aucune pose ni aucun costume d’Encore.' },
  merchandise('store-gangle-masks', 'Gangle et ses masques', 'Gangle-Plush_05.png?v=1762243060&width=1600', 'gangle-plush', 'Masque triste blanc avec larmes bleues, rubans rouges et masque souriant détaché. L’état du masque dans cette photo ne valide pas celui de l’atlas.'),
  merchandise('store-gangle-figure', 'Gangle Animatez', 'gangle-animatez-1.png?v=1762247039&width=1600', 'gangle-animatez', 'Masque triste entier, rubans rouges et fragments du masque souriant au pied de la figurine.'),
  merchandise('store-maid-jax', 'Maid Jax Animatez', 'Animatez_MaidJax_Box_1.png?v=1763022885&width=1600', 'maid-jax-animatez', 'Robe noire, tablier et coiffe blancs, cœur violet sur le buste, bas blancs et chaussures noires. Comparaison limitée à ces détails de vêtement.'),
  merchandise('store-spudsy-gangle', 'Spudsy Gangle Plush', 'spudsy-gangle-plush-2.png?v=1762501000&width=1600', 'spudsy-gangle-plush', 'Chemise gris bleu clair, cravate bleu pâle, badge de responsable et masque souriant denté, avec une étoile sur la joue.'),
  merchandise('store-costume-group', 'Costume Adventure Series — groupe', '78.png?v=1762387272&width=1600', 'digital-circus-animiniz-costume-adventure-series', 'Anime Gangle porte un col marin bleu, un nœud rouge et une jupe bleue. Les yeux noirs, la bouche, le sac et les rubans peuvent être comparés ; aucune attribution d’épisode ne découle de cette photo.'),
  merchandise('store-spudsy-ragatha', 'Costume Adventure Series — Ragatha en uniforme', '85.png?v=1762387272&width=1600', 'digital-circus-animiniz-costume-adventure-series', 'Ragatha porte une visière et un uniforme gris foncé, avec un badge clair. Cette figurine nommée Spudsy dans la fiche et Stupid sur l’emballage n’atteste pas toutes les tenues de l’épisode.'),
]);

const record = (sourceIds, observedTraits, combatAdaptation, reviewStatus, reviewScope) => ({ sourceIds, observedTraits, combatAdaptation, reviewStatus, reviewScope });
const appearance = (sourceIds, observedTraits, combatAdaptation, scope) => record(sourceIds, observedTraits, combatAdaptation, 'Référence visuelle consultée', `${scope} Ce repère ne valide ni l’ensemble du rendu, ni ses dimensions, ni les autres apparences.`);
const pending = (sourceIds, combatAdaptation, scope) => record(sourceIds, [], combatAdaptation, 'Épisode à revoir', scope);

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
export const MOVE_FIDELITY = freeze(Object.fromEntries(Object.entries(moveAdaptations).flatMap(([fighterId, descriptions]) => slots.map((slot, i) => {
  const parent = FIGHTER_FIDELITY[fighterId];
  return [`${fighterId}.${slot}`, record([...parent.sourceIds], [...parent.observedTraits], descriptions[i], 'Adaptation de combat', 'Les repères observés décrivent l’apparence du personnage, pas l’exécution du coup. Nom, chorégraphie, portée, dégâts, ressources et fenêtres sont créés pour Encore.')];
}))));

export const STAGE_FIDELITY = freeze({
  bigtop: appearance(['ep1', 'glitch-cast', 'glitch-circus-props'], ['Rideaux rouges et accessoires de jeu de grande taille, dont dés et cubes.', 'Damier au sol, murs colorés et portes arrondies dans les vues consultées.'], 'Piste horizontale, limites du ring et perspective simplifiée créées pour le duel.', 'Palette et objets comparés à deux visuels officiels ; disposition complète du chapiteau non reconstruite.'),
  candy: pending(['ep2'], 'La route du convoi et le canyon deviennent une piste horizontale de combat.', 'Épisode 2 identifié ; relief, route, confiseries et lumière à comparer sur des plans du canyon. Le visuel de la cour ne valide pas ce paysage.'),
  manor: pending(['ep3'], 'Salle du manoir reconstruite en décor de duel sans parcours d’exploration.', 'Épisode 3 identifié ; architecture, portraits et bougies à contrôler sur les plans de la salle choisie.'),
  spudsy: pending(['ep4'], 'Comptoir de restaurant utilisé comme fond de duel ; espace jouable et placement des accessoires adaptés.', 'Épisode 4 identifié ; enseigne, couleurs, comptoir et accessoires à comparer à des frames primaires.'),
  cellar: appearance(['ep1', 'glitch-cellar'], ['Espace presque noir rempli d’yeux multicolores.', 'Lumière blanche centrale et reflet faible sur le sol.'], 'Sol jouable et distance entre les combattants créés pour le duel ; les yeux servent de décor.', 'Ambiance et motifs observés dans l’image officielle du cellier ; aucune porte d’archives déduite de ce plan.'),
  void: appearance(['ep1', 'glitch-void'], ['Espace blanc aux nuances bleu pâle et lilas.', 'Bandes et franges multicolores dans le plan de Pomni.'], 'Une limite de sol est nécessaire au duel ; elle constitue une convention de jeu. Le plan de référence ne fournit pas de ring mesurable.', 'Le Vide est comparé à son propre visuel officiel ; le couloir EXIT et le quadrillage sous Candy Canyon correspondent à d’autres lieux.'),
  lake: record([], [], 'Rive issue des décors de CainOS, conservée comme adaptation à vérifier.', 'Source primaire à identifier', 'Aucun visuel primaire précis rattaché à ce décor dans cette revue. Son nom ne constitue pas une validation de lieu canonique.'),
  training: record([], [], 'Grille, repères et espace de mesure entièrement créés pour l’entraînement du fan-game.', 'Création originale', 'Décor utilitaire du jeu ; aucune reproduction d’un lieu de la série revendiquée.'),
  gloink: pending(['ep1'], 'Le nid devient un ring parsemé de motifs géométriques ; aucune reproduction de sa géographie complète.', 'Pilote identifié ; matière, palette, volumes et disposition du nid à comparer à une séquence primaire.'),
  kingdom: appearance(['ep2', 'glitch-candy-court'], ['Architecture rose et rouge avec des ornements clairs rappelant le glaçage.', 'Grands éléments verticaux de confiserie derrière les personnages.'], 'La cour du palais est ramenée à un fond de duel ; arches, distances et sol sont simplifiés.', 'Repères de palette et d’ornement vus à l’arrière-plan du visuel officiel ; architecture complète et échelle non mesurées.'),
  grounds: pending(['ep1'], 'Extérieur du cirque utilisé comme piste de duel avec une pelouse simplifiée.', 'Pilote identifié ; chapiteau, végétation, horizon et éclairage de l’extérieur à comparer sur un plan dédié.'),
  backstage: pending(['ep1'], 'Couloir des chambres utilisé comme fond de scène ; les emplacements de portes doivent être comparés avant une reproduction détaillée.', 'Aucune frame du couloir des résidents validée dans cette revue. Le couloir gris à porte EXIT de la galerie officielle est un autre lieu et ne sert pas de modèle.'),
});

const own = (registry, id) => typeof id === 'string' && Object.hasOwn(registry, id) ? registry[id] : null;
const sourcesById = Object.fromEntries(FIDELITY_SOURCES.map(source => [source.id, source]));
export const getFighterFidelity = id => own(FIGHTER_FIDELITY, id);
export const getMoveFidelity = (fighterId, slot) => own(MOVE_FIDELITY, `${fighterId}.${slot}`);
export const getStageFidelity = id => own(STAGE_FIDELITY, id);
export const getFidelitySources = sourceIds => Array.isArray(sourceIds) ? [...new Set(sourceIds)].map(id => own(sourcesById, id)).filter(Boolean) : [];
