/**
 * 0.6 presentation replacements. Original atlas files and archive identities
 * remain intact; these rectangles select newly generated native-alpha art.
 * Product-reference comparisons establish the listed details, not a measured
 * reconstruction of the series' 3D models or an episode appearance.
 */
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const sprite = (sheet, x, y, width, height, extra = {}) => ({
  src: `../assets/images/cainos-costumes-${sheet}-0.6.0.png`,
  sheet: `${sheet}-0.6.0`, cols: 1, rows: 1, col: 0, row: 0,
  sourceRect: { x, y, width, height }, matteMode: 'native-alpha', ...extra,
});
const alpha = 'Alpha natif de la nouvelle image 0.6.0 conservé, y compris les ouvertures entre membres. Aucun détourage par couleur noire ou blanche et aucun fond quadrillé à retirer.';
const framing = 'Rectangle individuel de la nouvelle planche 0.6.0, indépendant de sa grille indicative. Le personnage entier est contrôlé dans la garde-robe et en combat ; les apparences historiques restent archivées.';
const repaired = (spec, resolvedIssues, fields = {}) => ({ sprite: spec, resolvedIssues, framing, transparency: alpha, issues: [], ...fields });

export const COSTUME_REFINEMENTS = freeze({
  maidjax: repaired(sprite('uniforms', 40, 15, 477, 985), ['Cœur violet manquant.', 'Jambes violettes et jarretières à la place des bas blancs.'], {
    visibleTraits: ['Lapin violet aux longues oreilles, yeux et dents jaunes, coiffe et gants blancs.', 'Robe noire à cœur violet, tablier blanc à volants, bas blancs et chaussures noires à nœuds noirs.'],
    shape: 'Silhouette de lapin élancée, robe courte et longues jambes couvertes de bas ; proportions adaptées au sprite du jeu.',
    reviewScope: 'Les détails visibles sur Maid Jax Animatez sont repris dans le nouveau dessin : cœur violet, coiffe, tablier, bas blancs et nœuds noirs. La pose et les proportions restent une adaptation en pixel art ; aucun plan des épisodes 5 ou 9 ni modèle 3D mesuré n’est certifié.',
  }),
  workgangle: repaired(sprite('uniforms', 527, 145, 528, 855), ['Chemise saturée et cravate noire.', 'Absence de l’étoile et du masque souriant de responsable dans la référence choisie.'], {
    visibleTraits: ['Masque blanc au large sourire denté, yeux noirs à anneaux blancs, joue rose et petite étoile jaune.', 'Chemise gris bleu clair, cravate bleu pâle, badge beige, pantalon noir et bras constitués de rubans rouges.'],
    shape: 'Masque large, torse vêtu et deux jambes de pantalon ; les bras restent des rubans sans mains humaines.',
    reviewScope: 'Le nouvel état de responsable reprend la chemise claire, la cravate pâle, le badge et le masque denté avec étoile de la photo officielle Spudsy Gangle. Le produit présente plusieurs visages ; cette variante ne remplace pas la diversité des états de Gangle dans l’épisode 4. La pose debout est une adaptation du jeu.',
  }),
  spudsyragatha: repaired(sprite('uniforms', 1050, 115, 465, 885), ['Nœud bleu, chemise bleu pétrole et badge jaune différents de la référence consultée.'], {
    visibleTraits: ['Cheveux rouges en laine, œil en bouton bleu, paupière violette et visière sombre.', 'Uniforme et tablier gris foncé, badge clair, pantalon sombre et chaussures noires.'],
    shape: 'Poupée debout à cheveux de laine épais ; le tablier et la visière suivent la référence de produit, les proportions restent celles du jeu.',
    reviewScope: 'Visière, uniforme gris foncé et badge clair corrigés d’après Spudsy Ragatha Animiniz. L’œil en bouton bleu et la paupière violette sont repris. La pose, la silhouette élancée et le visage restent une interprétation en pixel art ; la scène exacte de l’épisode 4 n’est pas validée par la figurine.',
  }),
  ganglecomedy: repaired(sprite('gangle', 15, 140, 580, 815), ['Mains humaines blanches ajoutées aux rubans.'], {
    visibleTraits: ['Masque blanc entier, yeux noirs arqués et large bouche souriante.', 'Torse en spirale et membres de rubans rouges ; les bras se terminent par des boucles rouges, sans gants blancs.'],
    shape: 'Grand masque au-dessus d’une spirale rouge ; bras courbés et deux extrémités de ruban à la base.',
    reviewScope: 'Le nouveau dessin reprend le masque comique blanc et les rubans rouges de la référence officielle. Les mains humaines blanches ont été remplacées par des extrémités de ruban. Le masque entier et la pose sont une adaptation de l’état comique, sans certification des proportions de la série.',
  }),
  gangletragedy: repaired(sprite('gangle', 602, 198, 410, 757), ['Fissure ajoutée au masque triste.', 'Rubans bleu violet corrigés auparavant par recoloration locale.', 'Mains humaines blanches et débris emportés avec le personnage.'], {
    visibleTraits: ['Masque triste blanc entier et non fissuré, yeux noirs tombants, deux larmes turquoise et bouche triste.', 'Corps et membres en rubans rouges, bras recourbés vers le visage ; aucun gant ni débris au sol attaché.'],
    shape: 'Masque incliné et posture affaissée sur une spirale rouge ; les extrémités de ruban forment la base.',
    reviewScope: 'La figurine officielle distingue le masque triste entier des fragments du masque comique. Le nouveau masque triste est intact, ses membres sont rouges et sans mains humaines. Les fragments au sol ne sont pas incorporés au personnage mobile. La pose et les proportions restent une adaptation en pixel art.',
  }),
  japanesegangle: repaired(sprite('gangle', 1065, 180, 455, 780), ['Yeux étoilés dorés, fleur et pétales absents de la référence Anime Gangle.', 'Sac sombre manquant.'], {
    visibleTraits: ['Masque blanc aux grandes formes noires des yeux, joues roses et petite bouche souriante.', 'Col marin et jupe bleus, nœud rouge, membres de rubans rouges et sac sombre à nœud rouge ; aucune fleur ni étoile dorée dans les yeux.'],
    shape: 'Grand masque, blouse et jupe au milieu du corps, deux extrémités de ruban et sac latéral.',
    reviewScope: 'Le nouveau dessin suit les motifs de la figurine Anime Gangle : yeux noirs, uniforme marin bleu et blanc, nœud rouge, rubans et sac sombre. Fleur, pétales et étoiles dorées ont été retirés. La comparaison porte sur le produit officiel ; aucun plan de l’épisode 5 ni proportion de modèle n’est certifié.',
  }),
  shadowpomni: repaired(sprite('shadow', 75, 125, 308, 417), ['Rectangle à damier conservé pour éviter de perforer le corps noir.']),
  shadowjax: repaired(sprite('shadow', 444, 0, 270, 540), ['Damier, halos voisins et extrémité traversée par la grille.']),
  shadowragatha: repaired(sprite('shadow', 803, 70, 315, 470), ['Rectangle à damier et halos voisins conservés avec le corps noir.']),
  shadowkinger: repaired(sprite('shadow', 1190, 22, 275, 523), ['Damier et halos voisins inclus dans le calcul de hauteur.']),
  shadowgangle: repaired(sprite('shadow', 65, 565, 302, 459), ['Damier entre les rubans et dessin traversé par le bord gauche de la cellule.']),
  shadowzooble: repaired(sprite('shadow', 433, 536, 300, 488), ['Damier et halos voisins dans la silhouette extraite.']),
  shadowcaine: repaired(sprite('shadow', 810, 535, 335, 489), ['Rectangle à damier conservé pour protéger les volutes noires.']),
  horrorpomnivoid: repaired(sprite('horror', 300, 5, 370, 477), ['Rectangle sombre et lignes du fond réduisant la taille apparente.']),
  horrorpomnispiral: repaired(sprite('horror', 880, 0, 380, 480, { component: 'largest' }), ['Rectangle sombre, lignes du fond et trace d’une cellule voisine.']),
  horrorpomniskull: repaired(sprite('horror', 300, 505, 380, 500), ['Rectangle sombre et lignes du fond réduisant la taille apparente.']),
  hunterjax: repaired(sprite('horror', 900, 455, 405, 563, { component: 'largest' }), ['Fond quadrillé lié à la silhouette.']),
  rhinogangle: repaired(sprite('creatures', 290, 495, 380, 518), ['Socle de pierres et d’herbe entraîné pendant les déplacements.'], {
    visibleTraits: ['Tête de rhinocéros gris clair, corne, chapeau de safari et gilet beige.', 'Corps et membres en rubans rouges, sans socle, pierre ni herbe attachés.'],
    shape: 'Tête de rhinocéros large sur une spirale étroite et libre de rubans rouges.',
  }),
  gloinkqueenscale: repaired(sprite('creatures', 0, 0, 1536, 565, { component: 'largest', nativeFacing: -1 }), ['Fond quadrillé reliant la reine aux petits Gloinks.', 'Petits Gloinks attachés à la même extraction.'], {
    visibleTraits: ['Long corps rose à taches jaunes, nombreux yeux et grande bouche dentée à bord bleu.', 'La reine est isolée ; aucun petit Gloink ni quadrillage n’accompagne le dessin.'],
    framing: 'Cadre supérieur de la planche 0.6.0 et sélection explicite de la grande composante : elle conserve la reine entière et exclut la petite portion de la tête de rhinocéros située dans le rectangle voisin.',
    issues: ['Le libellé historique True Scale ne constitue toujours pas une mesure canonique de la taille.'],
  }),
  inertbubble: repaired(sprite('creatures', 918, 665, 325, 297), ['Remplissage violet opaque et ombre au sol inclus dans l’ancien dessin.'], {
    visibleTraits: ['Bulle ronde à contour lavande, deux traits noirs pour les yeux et reflets blancs.', 'Centre réellement translucide en alpha natif, sans ombre au sol attachée.'],
    transparency: 'Alpha natif partiel au centre de la bulle ; le décor reste visible à travers sa matière. Les yeux et les reflets sont davantage opaques. Aucun filtre d’opacité uniforme n’est appliqué au personnage.',
    shape: 'Sphère presque ronde, sans socle ni ombre externe dans la silhouette.',
  }),
});

export const REFINED_COSTUME_IDS = Object.freeze(Object.keys(COSTUME_REFINEMENTS));
export const REFINED_COSTUME_SPRITES = freeze(Object.fromEntries(Object.entries(COSTUME_REFINEMENTS).map(([id, record]) => [id, record.sprite])));
