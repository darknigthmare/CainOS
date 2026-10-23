/**
 * Individual costume reviews. Atlas observations describe the project's art;
 * observedTraits is reserved for the primary reference actually consulted.
 * Neither a completed technical review nor an episode label certifies a costume.
 */
import { COSTUME_REFINEMENTS, REFINED_COSTUME_SPRITES } from './costume-refinements.mjs';

const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

// Absolute pixel rectangles, reviewed against the complete original PNGs.
// Keep the historical grid coordinates intact for archive/profile compatibility.
// These rectangles change extraction only, never the fighter or collision body.
const rect = (x, y, width, height) => ({ sourceRect: { x, y, width, height } });
export const COSTUME_SPRITE_OVERRIDES = freeze({
  ganglecomedy: rect(100, 340, 270, 290),
  gangletragedy: { ...rect(450, 340, 245, 285), paletteSwap: 'gangle-red-ribbons' },
  darkduojax: rect(115, 25, 310, 730),
  darkduogangle: rect(430, 145, 400, 610),
  maidragatha: rect(1165, 130, 375, 620),
  beachgangle: rect(40, 40, 320, 455),
  japanesegangle: rect(365, 70, 290, 425),
  rhinogangle: rect(665, 60, 255, 435),
  japanesepomni: rect(355, 560, 275, 410),
  japanesekinger: rect(660, 495, 240, 475),
  japanesegummigoo: rect(1200, 525, 325, 445),
  baseballjax: rect(90, 25, 300, 645),
  baseballzooble: rect(420, 80, 350, 590),
  baseballgangle: rect(790, 130, 280, 535),
  spudsyzooble: rect(1430, 80, 315, 575),
  possessedpomni: rect(405, 190, 325, 530),
  monstrouscaine: rect(805, 125, 510, 600),
  shadowpomni: { matteMode: 'preserve-source' },
  shadowragatha: { matteMode: 'preserve-source' },
  shadowcaine: { matteMode: 'preserve-source' },
  ...REFINED_COSTUME_SPRITES,
});

const names = { pomni: 'Pomni', jax: 'Jax', ragatha: 'Ragatha', gangle: 'Gangle', zooble: 'Zooble', kinger: 'Kinger', caine: 'Caine', bubble: 'Bubble', gummigoo: 'Gummigoo', gloinkqueen: 'la reine des Gloinks' };
const nativeAlpha = new Set(['peeledjax', 'spudsypomni', 'spudsyjax', 'spudsyragatha', 'spudsyzooble', 'possessedpomni', 'monstrouscaine', 'flamingozooble', 'mouthlesspomni', 'mouthlessjax', 'mouthlesszooble', 'inertbubble', 'groundedcaine']);
const textured = new Set(['shadowpomni', 'shadowjax', 'shadowragatha', 'shadowkinger', 'shadowgangle', 'shadowzooble', 'shadowcaine', 'horrorpomnivoid', 'horrorpomnispiral', 'horrorpomniskull', 'hunterjax', 'gloinkqueenscale']);
const preserveSource = new Set(['shadowpomni', 'shadowragatha', 'shadowcaine']);
const episodeTargets = {
  maidjax: ['ep5', 'ep9'], beachgangle: ['ep7'], japanesegangle: ['ep5'], rhinogangle: ['ep5'], workgangle: ['ep4'],
  japanesejax: ['ep5'], japaneseragatha: ['ep5'], japanesepomni: ['ep5'], japanesekinger: ['ep5'], japanesezooble: ['ep5'],
  baseballjax: ['ep5'], baseballzooble: ['ep5'], baseballgangle: ['ep5'], baseballragatha: ['ep5'], baseballpomni: ['ep5'], baseballkinger: ['ep5'],
  hunterjax: ['ep5'], gloinkqueenscale: ['ep1'], peeledjax: ['ep8'],
  spudsypomni: ['ep4'], spudsyjax: ['ep4'], spudsyragatha: ['ep4'], spudsyzooble: ['ep4'],
  possessedpomni: ['ep3'], monstrouscaine: ['ep8'], flamingozooble: ['ep5'],
  mouthlesspomni: ['ep8'], mouthlessjax: ['ep8'], mouthlesszooble: ['ep8'], inertbubble: ['ep9'], groundedcaine: ['ep9'],
};
const cropNotes = {
  ganglecomedy: 'Cadre absolu arrêté avant la rangée suivante : le nœud et les cheveux de Ragatha présents dans la cellule 0.3.0 sont exclus.',
  gangletragedy: 'Cadre absolu arrêté avant la croix de Kinger de la rangée suivante ; le masque, les rubans et les débris de Gangle restent visibles.',
  darkduojax: 'Cadre élargi à droite pour conserver la pointe du manteau et la chaussure ; aucun fragment de Gangle dans le cadre corrigé.',
  darkduogangle: 'Cadre élargi jusqu’aux doigts et aux rubans de droite, sans emporter Maid Jax.',
  maidragatha: 'Cadre déplacé vers la gauche pour conserver la main tendue, auparavant coupée par la grille de cinq colonnes.',
  beachgangle: 'Cadre élargi à droite pour conserver le bord du chapeau, le nœud bleu et le ruban ; aucun morceau de la tenue voisine.',
  japanesegangle: 'Cadre indépendant de la grille : rubans de droite et pétales conservés, chapeau de la Gangle voisine exclu.',
  rhinogangle: 'Cadre resserré autour de la tête, des rubans et du socle ; les pétales et rubans de la tenue voisine sont exclus.',
  japanesepomni: 'Cadre élargi à droite pour conserver le pompon jaune du bonnet ; Kinger et ses gouttes restent hors du cadre.',
  japanesekinger: 'Cadre remonté avant la croix et resserré latéralement ; la croix auparavant coupée est visible en entier.',
  japanesegummigoo: 'Cadre élargi à gauche pour conserver les doigts près du chapeau ; la queue et les chaussures restent dans le cadre.',
  baseballjax: 'Cadre élargi à droite pour conserver le bord de la chaussure ; Zooble reste hors du cadre.',
  baseballzooble: 'Cadre élargi à droite pour conserver le gant de baseball et les antennes ; la Gangle voisine est exclue.',
  baseballgangle: 'Cadre resserré sur Gangle : le fragment de l’antenne de Zooble en haut à gauche est exclu du calcul de hauteur.',
  spudsyzooble: 'Cadre élargi à gauche pour conserver l’extrémité de l’aile rose ; l’alpha du PNG est conservé.',
  possessedpomni: 'Cadre décalé à gauche pour conserver le pompon jaune ; les mains de Caine dans la cellule d’origine sont exclues.',
  monstrouscaine: 'Cadre élargi à gauche pour conserver les trois mains de ce côté ; les six mains sont maintenant dans le cadre.',
};

// These are observations of the actual project sprites on the contact sheets,
// not assertions about GLITCH's models. Every row has its own identity evidence.
const designs = [
  ['ganglekawaii', 'gangle', ['Masque clair arrondi aux grands yeux brillants et joues roses.', 'Rubans pastel, gros nœuds roses à cœur, mains blanches et étoiles.'], 'Le masque et le corps en rubans motivent le rattachement à Gangle ; les accessoires pastel sont propres à ce dessin.', 'Tête et nœuds volumineux, corps court et rubans largement déployés.'],
  ['ganglecomedy', 'gangle', ['Masque blanc souriant aux yeux noirs arqués.', 'Corps de rubans rouges, deux mains blanches et extrémités de ruban au sol.'], 'Le masque de théâtre souriant et les rubans rouges identifient la variante de Gangle dans l’atlas.', 'Masque large au-dessus d’un corps de rubans court ; les mains élargissent la silhouette.'],
  ['gangletragedy', 'gangle', ['Masque blanc triste fissuré, ouverture noire et larmes bleues.', 'Rubans bleu violet dans l’atlas ; correction locale vers le rouge au rendu, une main sur la joue et débris au pied du corps.'], 'Le visage de théâtre et le corps en rubans motivent le rattachement à Gangle ; la correction de couleur ne change ni le masque ni l’identité.', 'Pose affaissée, masque large et rubans rassemblés au sol.'],
  ['darkduojax', 'jax', ['Lapin violet aux longues oreilles, yeux et dents jaunes.', 'Long manteau noir doublé de rouge, rose au revers, cravate et chaussures sombres.'], 'Oreilles, museau et dentition de lapin violet identifient Jax sous le costume gothique.', 'Silhouette haute et mince ; les pans du manteau occupent davantage de largeur que les jambes.'],
  ['darkduogangle', 'gangle', ['Masque blanc souriant et rubans rouges.', 'Corsage et jupe noirs à bordures rouges, gants sombres et plusieurs boucles de ruban.'], 'Le masque et les membres de ruban demeurent visibles malgré la robe gothique.', 'Le vêtement élargit le torse ; le bas du corps reste une spirale de ruban.'],
  ['maidjax', 'jax', ['Lapin violet aux yeux jaunes, coiffe blanche entre les oreilles.', 'Robe noire, tablier blanc à volants, manchettes, jarretières et chaussures noires.'], 'Le visage, les oreilles et les membres violets maintiennent l’identité de Jax.', 'Longues jambes violettes, jupe courte et tête petite relativement à la hauteur totale.'],
  ['maidragatha', 'ragatha', ['Cheveux de laine rouges et œil en bouton bleu.', 'Coiffe blanche, longue robe noire, tablier blanc à bouton bleu et main tendue.'], 'Cheveux de laine, bouton bleu et visage de poupée identifient Ragatha.', 'Longue jupe évasée, bras tendu latéralement et tête large par rapport aux épaules.'],
  ['maidpomni', 'pomni', ['Visage blanc, cheveux bruns et iris rouges et bleus.', 'Bonnet de bouffon sombre, coiffe à volants, robe noire et tablier blanc.'], 'Les iris, les cheveux et le bonnet de bouffon identifient Pomni malgré la palette du vêtement.', 'Très grosse tête, petits membres et pose des mains devant le tablier.'],
  ['maidgangle', 'gangle', ['Masque blanc souriant au-dessus d’un corps de rubans rouges.', 'Coiffe et tablier blancs, robe noire, nœuds rouges et mains blanches écartées.'], 'Masque et rubans visibles au-dessus et sous la robe identifient la variante de Gangle.', 'Robe courte au milieu d’une longue spirale de ruban ; mains largement écartées.'],
  ['jaxgirl', 'jax', ['Visage de lapin violet, longues oreilles et yeux jaunes.', 'Longs cheveux bleu vert, nœud rose, tee-shirt clair, manches rayées et pantalon sombre.'], 'Le visage de lapin est conservé ; cheveux et vêtements constituent une réinterprétation visuelle du projet.', 'Longue chevelure et pantalon ample élargissent une silhouette de lapin élancée.'],
  ['beachgangle', 'gangle', ['Masque blanc et rubans rouges.', 'Grand chapeau de paille à fleur rose, paréo bleu fleuri à étoile et noix de coco avec ombrelle.'], 'Le corps de rubans et le masque restent reconnaissables sous les accessoires de plage.', 'Chapeau plus large que le torse, paréo enveloppant les rubans et boisson portée à côté.'],
  ['japanesegangle', 'gangle', ['Masque blanc aux yeux étoilés dorés, fleur rose et pétales.', 'Col marin bleu, nœud rouge, jupe plissée bleue et rubans rouges.'], 'Le masque et les rubans rouges motivent le rattachement à Gangle dans cette tenue scolaire.', 'Tête large, jupe au milieu du corps et rubans visibles à la place des jambes.'],
  ['rhinogangle', 'gangle', ['Tête de rhinocéros gris clair avec corne et chapeau de safari.', 'Gilet beige, corps de rubans rouges et petit socle de pierres et d’herbe.'], 'Le corps en rubans rattache ce dessin à Gangle ; la tête de rhinocéros ne prouve pas à elle seule une transformation de la série.', 'Tête lourde et large sur une spirale étroite ; le socle fait partie du dessin.'],
  ['workgangle', 'gangle', ['Masque blanc triste avec larme bleue et main de ruban près du visage.', 'Chemise bleue, cravate noire, petit badge jaune et pantalon noir.'], 'Masque triste et bras de ruban rouge restent visibles malgré le pantalon de travail.', 'Deux jambes de pantalon remplacent la spirale visible dans les autres variantes ; la forme de la tête reste large.'],
  ['japanesejax', 'jax', ['Longues oreilles et visage de lapin violet aux yeux jaunes.', 'Veste scolaire noire, cravate rouge rayée, sac brun et pantalon sombre.'], 'Oreilles, visage et pieds violets identifient Jax dans l’uniforme scolaire.', 'Silhouette haute, petites épaules et jambes longues ; sac posé derrière le flanc.'],
  ['japaneseragatha', 'ragatha', ['Cheveux de laine rouges, nœud bleu et œil en bouton.', 'Veste noire, nœud rouge, jupe à carreaux bleue et guêtres blanches.'], 'Le bouton de l’œil et la coiffure de laine identifient Ragatha sous l’uniforme.', 'Tête large, jupe courte et jambes apparentes ; sac latéral compris dans la silhouette.'],
  ['japanesepomni', 'pomni', ['Bonnet de bouffon rouge et bleu, iris des deux couleurs et cheveux bruns.', 'Col marin, nœud rouge, jupe bleue à carreaux, collants rouges et sac à dos.'], 'Les iris et le bonnet identifient Pomni malgré le vêtement scolaire.', 'Bonnet très large par rapport au torse ; petites jambes et mains tenant les bretelles.'],
  ['japanesekinger', 'kinger', ['Tête de roi en bois avec croix et grands yeux débordants.', 'Veste noire, cravate verte, sac à dos et gants blancs.'], 'La croix, la matière du visage et les yeux identifient Kinger dans cette tenue.', 'Tête de pièce d’échecs longue au-dessus de jambes de pantalon ; sac saillant à droite.'],
  ['japanesezooble', 'zooble', ['Tête triangulaire rose, yeux dépareillés et antennes de formes différentes.', 'Chemisier blanc, nœud vert, jupe bleue et sac noir ; membres modulaires multicolores.'], 'L’assemblage asymétrique et la tête triangulaire identifient Zooble.', 'Bras et jambes de longueurs et de formes différentes ; la jupe ne remplace pas les membres modulaires.'],
  ['japanesegummigoo', 'gummigoo', ['Crocodile jaune orangé, museau denté, crêtes de dos et long appendice caudal.', 'Chapeau brun décoré de bonbons, veste noire, cravate et pantalon à carreaux bleus.'], 'Museau de crocodile et chapeau de confiserie motivent le rattachement ; la couleur diffère de l’image officielle de Gummigoo consultée.', 'Corps trapu, museau large et queue latérale ; la tenue opaque masque la matière de confiserie.'],
  ['baseballjax', 'jax', ['Lapin violet aux yeux jaunes avec une balle dans la main.', 'Casquette bleue, haut bleu et salopette rose rayée.'], 'Visage, oreilles et salopette rose identifient Jax avec des accessoires de baseball.', 'Longues jambes et oreilles droites ; la balle est un accessoire du sprite, pas un projectile supplémentaire.'],
  ['baseballzooble', 'zooble', ['Tête triangulaire rose, antennes et membres asymétriques.', 'Casquette bleue, maillot blanc rayé et gros gant contenant une balle.'], 'La tête et les modules corporels identifient Zooble malgré le maillot.', 'Gant volumineux à droite, aile à gauche et jambes de formes différentes.'],
  ['baseballgangle', 'gangle', ['Masque blanc triste, larme bleue et rubans rouges.', 'Casquette bleue, maillot blanc rayé et gant de baseball brun.'], 'Le masque triste et la spirale de ruban identifient Gangle.', 'Tête et maillot au-dessus d’une spirale basse ; gant plus large que le bras de ruban.'],
  ['baseballragatha', 'ragatha', ['Cheveux rouges en laine, bouton bleu à l’œil et casquette bleue.', 'Robe bleue à rayures et pièces de tissu ; batte tenue près de l’épaule.'], 'La chevelure, le bouton et la robe de poupée identifient Ragatha.', 'Jupe évasée et tête large ; la batte élargit le cadre près de l’épaule.'],
  ['baseballpomni', 'pomni', ['Bonnet de bouffon rouge et bleu avec casquette bleue superposée.', 'Iris rouges et bleus, gants de couleurs différentes et combinaison de bouffon.'], 'Le visage et le vêtement de bouffon restent ceux du dessin de Pomni.', 'Grande tête et petites jambes ; les mains sont rapprochées devant le torse.'],
  ['baseballkinger', 'kinger', ['Tête de roi en bois, croix, gros yeux et casquette bleue.', 'Manteau violet bordé de fourrure tachetée, gant de baseball et gouttes bleues.'], 'La tête d’échecs et le manteau royal identifient Kinger.', 'Tête étroite et haute, longue robe royale, gant à droite et gouttes latérales.'],
  ['shadowpomni', 'pomni', ['Bonnet de bouffon sombre, iris en spirale lumineux et sourire denté.', 'Corps noir, griffes et contour vert sur un fond à damier vert sombre.'], 'Bonnet et proportions générales de bouffon rappellent Pomni ; griffes et sourire monstrueux sont une réinterprétation.', 'Pose penchée avec longues griffes et grands souliers recourbés.'],
  ['shadowjax', 'jax', ['Lapin noir aux très longues oreilles, yeux et sourire jaunes.', 'Contour vert, doigts étirés et traces rouges de vêtement.'], 'Oreilles de lapin et visage souriant permettent le rattachement à Jax malgré la palette noire.', 'Silhouette très haute et maigre, mains allongées et buste incliné.'],
  ['shadowragatha', 'ragatha', ['Coiffure de mèches rigides, bouton rouge à un œil et robe à pièces.', 'Silhouette noire avec contour vert et mains étirées.'], 'Cheveux, bouton et robe de poupée motivent le rattachement à Ragatha.', 'Robe large et courte, pieds séparés et bras étendus de manière asymétrique.'],
  ['shadowkinger', 'kinger', ['Croix de roi, grands yeux bleus et longue tête sombre.', 'Manteau noir ondulant, deux mains étirées et contour vert.'], 'La croix et la tête de pièce d’échecs motivent le rattachement à Kinger.', 'Silhouette verticale au socle élargi ; les bras sont placés sur un côté du corps.'],
  ['shadowgangle', 'gangle', ['Masque noir triste aux yeux et à la bouche jaunes.', 'Corps en spirales de ruban noir et rouge, mains en crochet et contour vert.'], 'Masque triste et structure de ruban restent reconnaissables comme variante de Gangle.', 'Tête large au-dessus d’un enroulement vertical de rubans, sans jambes séparées.'],
  ['shadowzooble', 'zooble', ['Tête triangulaire noire, yeux dépareillés et antennes asymétriques.', 'Membres géométriques noirs à contour vert, mains en pinces et segments de tailles différentes.'], 'Tête triangulaire et assemblage modulaire motivent le rattachement à Zooble.', 'Silhouette asymétrique large, grands segments séparés et jambes longues.'],
  ['shadowcaine', 'caine', ['Chapeau haut-de-forme, mâchoires dentées et yeux flottants lumineux.', 'Vêtement noir, nœud rouge, mains en griffes et bas du corps en volutes.'], 'Le haut-de-forme et les mâchoires identifient Caine ; le corps en volutes est une réinterprétation du dessin.', 'Corps sans jambes dessinées, terminé en pans recourbés ; mains écartées.'],
  ['horrorpomnivoid', 'pomni', ['Bonnet et combinaison de bouffon rouges et bleus.', 'Orbites noires, coulures sombres et deux globes oculaires portés dans les mains.'], 'Bonnet et combinaison rattachent cette variation d’horreur à Pomni.', 'Grande tête au-dessus d’un torse court ; les deux objets sphériques élargissent les bras.'],
  ['horrorpomnispiral', 'pomni', ['Bonnet et combinaison de bouffon rouges et bleus.', 'Yeux orange en spirale, sourire denté, mains tendues et contour lumineux vert.'], 'L’habit de bouffon est maintenu ; yeux et sourire constituent une variation d’horreur.', 'Pose penchée avec bras tendus, grandes chaussures et tête large.'],
  ['horrorpomniskull', 'pomni', ['Bonnet et combinaison de bouffon rouges et bleus.', 'Visage de crâne jaune, orbites sombres, bouche dentée et mains serrées devant le torse.'], 'L’habit de bouffon motive le rattachement à Pomni ; le visage de crâne n’est pas un état canonique établi par cette revue.', 'Tête large, torse court et jambes droites ; les mains restent devant le corps.'],
  ['hunterjax', 'jax', ['Lapin violet aux yeux jaunes, chapeau de safari et fusil vertical.', 'Chemise et short beiges, gilet vert, ceintures et bottes brunes ; une jambe repliée.'], 'Les oreilles et le visage violets identifient Jax dans ce dessin de chasseur.', 'Pose basse avec jambe repliée, longues oreilles et fusil dépassant le coude.'],
  ['gloinkqueenscale', 'gloinkqueen', ['Long corps rose à taches jaunes, nombreux yeux et longue bouche dentée bordée de bleu.', 'Petits Gloinks alignés sous la partie avant et fond quadrillé sombre.'], 'La créature principale est la même identité de reine ; les petits Gloinks sont des éléments séparés de la planche.', 'Silhouette très allongée horizontalement ; le nom historique True Scale ne repose sur aucune mesure canonique.'],
  ['peeledjax', 'jax', ['Lapin jaune très mince aux grands yeux blancs et longues oreilles.', 'Lambeaux de salopette rose et posture repliée.'], 'Oreilles, museau et restes de salopette motivent le rattachement ; l’état narratif de peau retirée reste à vérifier dans l’épisode.', 'Membres très fins et tête plus petite que dans le Jax habituel ; cette silhouette ne change pas les collisions.'],
  ['spudsypomni', 'pomni', ['Bonnet rouge et bleu, visage blanc et cheveux bruns.', 'Chemise bleu pétrole à badge jaune, pantalon noir et bras tombants.'], 'Bonnet, visage et cheveux identifient Pomni dans ce dessin de travail.', 'Buste penché et bras longs, tête moins ronde que dans certaines autres planches.'],
  ['spudsyjax', 'jax', ['Lapin violet aux longues oreilles et yeux jaunes.', 'Chemise bleu pétrole à badge jaune, pantalon noir et mains près des poches.'], 'Oreilles et visage violets identifient Jax sous l’uniforme.', 'Longues jambes, épaules étroites et petite tête ; l’échelle de collision reste celle de Jax.'],
  ['spudsyragatha', 'ragatha', ['Cheveux rouges en laine, nœud bleu et œil en bouton bleu.', 'Chemise bleu pétrole à badge jaune, pantalon noir et mains croisées devant le corps.'], 'La coiffure et le bouton de l’œil identifient Ragatha dans cette tenue de travail.', 'Corps humanoïde mince et jambes de pantalon longues, avec une grosse tête de poupée.'],
  ['spudsyzooble', 'zooble', ['Tête triangulaire rose, antennes et aile rose latérale.', 'Chemise bleu pétrole, badge jaune, short noir et jambes modulaires asymétriques.'], 'La tête triangulaire, l’aile et les membres dépareillés identifient Zooble.', 'Aile largement étendue à gauche, jambes de longueurs différentes et torse compact.'],
  ['possessedpomni', 'pomni', ['Bonnet rouge et bleu et combinaison à boutons jaunes.', 'Orbites noires avec motifs rouges et bleus, coulures rouges et petite bouche rouge.'], 'Le bonnet et la combinaison maintiennent l’identité visuelle de Pomni ; la cause narrative reste à établir.', 'Pose droite, gros visage et courtes jambes ; le bonnet élargit le haut du cadre.'],
  ['monstrouscaine', 'caine', ['Mâchoires dentées, deux yeux, haut-de-forme noir et queue-de-pie rouge.', 'Six bras gantés blancs déployés de part et d’autre du corps.'], 'Les mâchoires, le chapeau et la tenue de cérémonie identifient Caine malgré les bras supplémentaires.', 'Les six bras élargissent fortement la silhouette ; seul le corps de collision du Caine existant est utilisé.'],
  ['flamingozooble', 'zooble', ['Tête triangulaire rose, antennes et corps modulaire jaune à taches roses.', 'Cou rose recourbé et longues jambes terminées par des pieds d’oiseau roses.'], 'Tête et modules conservent l’identité de Zooble ; les membres d’oiseau constituent cette variante visuelle.', 'Longues jambes fines et cou recourbé, sans corps de flamant complet.'],
  ['mouthlesspomni', 'pomni', ['Bonnet rouge et bleu, grands iris et combinaison de bouffon.', 'Zone blanche continue à la place de la bouche.'], 'Les yeux, le bonnet et le vêtement identifient Pomni ; l’absence de bouche est visible dans le dessin.', 'Grosse tête et membres courts ; le visage fermé ne modifie pas le kit de combat.'],
  ['mouthlessjax', 'jax', ['Lapin violet aux yeux jaunes et longues oreilles.', 'Salopette rose et visage sans bouche dessinée.'], 'Oreilles, yeux et salopette identifient Jax malgré l’absence de son sourire.', 'Silhouette de lapin debout à longues jambes, conservée sans étirement du dessin.'],
  ['mouthlesszooble', 'zooble', ['Tête triangulaire rose aux deux yeux dépareillés.', 'Aucune bouche dessinée ; corps et membres géométriques multicolores.'], 'La tête triangulaire et l’assemblage asymétrique identifient Zooble ; l’absence de bouche ne suffit pas à dater la scène.', 'Grandes pièces latérales et jambes de formes différentes ; le cadre inclut tous les modules visibles.'],
  ['inertbubble', 'bubble', ['Corps sphérique violet clair, deux traits noirs à la place des yeux.', 'Reflet blanc supérieur et ombre ovale sous la sphère.'], 'La forme de bulle est reconnaissable ; le nom inerte est une attribution narrative non prouvée par l’image seule.', 'Silhouette presque ronde avec petite ombre incluse dans les limites de dessin.'],
  ['groundedcaine', 'caine', ['Mâchoires et yeux baissés, haut-de-forme et queue-de-pie rouge.', 'Bras tombants, genoux fléchis et canne dirigée vers le sol.'], 'Tête dentée et tenue de cérémonie identifient Caine ; la posture ne démontre pas une perte de pouvoirs.', 'Pose penchée et genoux fléchis ; la canne ajoute une extension latérale sans modifier la collision.'],
];

const comparisons = {
  ganglecomedy: {
    sourceIds: ['store-gangle-masks'],
    observedTraits: ['Masque souriant blanc avec yeux noirs arqués visible parmi les deux masques de la peluche.', 'Corps de rubans rouges sur le produit officiel.'],
    reviewScope: 'Comparaison des couleurs et du motif du masque à la photographie officielle des deux masques. Les mains blanches, la pose et le masque intact du sprite ne sont pas validés par cette photo de produit.',
  },
  gangletragedy: {
    sourceIds: ['store-gangle-figure', 'store-gangle-masks'],
    observedTraits: ['Masque triste blanc, yeux noirs et larmes bleues.', 'Rubans rouges et masque triste entier sur la figurine ; fragments du masque souriant à son pied.'],
    reviewScope: 'La figurine officielle montre des rubans rouges et un masque triste entier. Les pixels bleu violet des rubans sont décalés vers le rouge dans le cadre revu ; masque et larmes sont protégés. La fissure du masque triste et les mains blanches du dessin restent des écarts ; aucune conformité complète n’est revendiquée.',
  },
  maidjax: {
    sourceIds: ['store-maid-jax', 'ep5', 'ep9'],
    observedTraits: ['Coiffe et tablier blancs sur une robe noire.', 'Cœur violet au buste, bas blancs et chaussures noires à nœud sur la figurine.'],
    reviewScope: 'Motif général de la tenue comparé à Maid Jax Animatez. Le sprite n’a pas le cœur violet du buste et montre les jambes violettes avec jarretières ; les bas, la silhouette et les détails diffèrent. Les attributions aux épisodes 5 et 9 restent à vérifier sur leurs plans.',
  },
  japanesegangle: {
    sourceIds: ['store-costume-group', 'ep5'],
    observedTraits: ['Anime Gangle porte un col marin bleu, un nœud rouge et une jupe bleue.', 'Masque blanc avec grandes formes noires aux yeux, rubans rouges et sac sombre sur la figurine de groupe.'],
    reviewScope: 'Le motif scolaire est documenté par le produit officiel. Yeux étoilés dorés, fleur rose et pétales du sprite diffèrent de la figurine consultée ; aucun plan de l’épisode 5 ni proportion de modèle n’est certifié.',
  },
  workgangle: {
    sourceIds: ['store-spudsy-gangle', 'ep4'],
    observedTraits: ['Chemise gris bleu clair, cravate bleu pâle et badge de responsable.', 'Masque souriant aux dents nombreuses, yeux ronds noirs et blancs et étoile jaune sur la joue.'],
    reviewScope: 'Écarts avec cette photo de Spudsy Gangle : notre chemise est bleue saturée, la cravate noire et le masque triste sans étoile. Le produit a plusieurs faces ; cette photo ne permet donc pas d’exclure tous les autres états de masque de l’épisode 4.',
  },
  japanesegummigoo: {
    sourceIds: ['glitch-undermap'],
    observedTraits: ['Gummigoo apparaît vert et jaune translucide dans le plan officiel sous la carte.', 'Museau de crocodile et chapeau brun sont visibles dans ce plan.'],
    reviewScope: 'Comparaison limitée à l’identité et à la couleur de base : le costume scolaire de l’atlas est jaune orangé et opaque. Aucune tenue scolaire de Gummigoo n’est documentée par cette image ; son vêtement reste une réinterprétation du projet.',
  },
  spudsyragatha: {
    sourceIds: ['store-spudsy-ragatha', 'ep4'],
    observedTraits: ['Figurine de Ragatha avec visière, uniforme gris foncé et badge clair.', 'Cheveux rouges, œil en bouton bleu et paupières violettes.'],
    reviewScope: 'La tenue du sprite (nœud bleu, chemise bleu pétrole, badge jaune) diffère de cette figurine en uniforme. La photo de produit ne démontre ni que toutes les tenues de l’épisode sont identiques, ni que notre état de personnage est la même scène.',
  },
};

const specificIssues = {
  rhinogangle: ['Le socle de pierres et d’herbe reste attaché au sprite ; il suit le personnage pendant les déplacements.'],
  shadowpomni: ['Le détourage initial supprimait des zones noires du corps. La cellule source est maintenant conservée intégralement : corps préservé, fond rectangulaire à damier toujours opaque.'],
  shadowjax: ['La cellule uniforme inclut des halos voisins et coupe une extrémité ; le fond à damier reste visible.'],
  shadowragatha: ['Le détourage initial supprimait des zones noires du corps. La cellule source est maintenant conservée intégralement ; le damier opaque et les halos voisins restent inclus dans le cadre.'],
  shadowkinger: ['Des halos voisins et le damier font partie du cadre extrait ; la hauteur visible ne mesure pas seulement le corps.'],
  shadowgangle: ['Le damier demeure entre les rubans et autour du corps ; le bord gauche de la cellule traverse le dessin.'],
  shadowzooble: ['Le damier et des halos voisins restent inclus dans la silhouette extraite.'],
  shadowcaine: ['Le détourage initial perforait les zones noires des volutes. La cellule source est maintenant conservée intégralement : corps préservé, fond rectangulaire à damier toujours opaque.'],
  horrorpomnivoid: ['Un grand rectangle sombre et les lignes du fond sont conservés ; ils réduisent la taille apparente du personnage.'],
  horrorpomnispiral: ['Un grand rectangle sombre et les lignes du fond sont conservés ; une trace de la cellule voisine est visible à gauche.'],
  horrorpomniskull: ['Un grand rectangle sombre et les lignes du fond sont conservés ; ils réduisent la taille apparente du personnage.'],
  hunterjax: ['Le fond quadrillé reste lié à la silhouette ; sa hauteur incluse dans les limites réduit la taille apparente de Jax.'],
  gloinkqueenscale: ['Le fond quadrillé relie encore la reine et les petits Gloinks : sélectionner la plus grande composante ne les sépare pas.', 'Le libellé historique True Scale ne constitue pas une mesure de taille de la série.'],
  inertbubble: ['Le remplissage violet opaque du dessin n’imite pas une bulle entièrement transparente ; l’alpha autour du sprite est distinct.'],
};

export const COSTUME_FIDELITY = freeze(Object.fromEntries(designs.map(([id, baseFighterId, visibleTraits, identityEvidence, shape], index) => {
  const refinement = COSTUME_REFINEMENTS[id];
  const comparison = comparisons[id];
  const sourceIds = comparison?.sourceIds || episodeTargets[id] || [];
  const issues = refinement?.issues || specificIssues[id] || [];
  const reviewScope = refinement?.reviewScope || comparison?.reviewScope || (sourceIds.length
    ? 'L’épisode indiqué par les archives est une cible de comparaison. Aucun plan de cette tenue n’a été vérifié dans cette revue ; son nom, sa disponibilité et sa fiche technique ne prouvent pas son apparence canonique.'
    : 'Revue du sprite du projet uniquement. Aucune image primaire de cette tenue n’a été comparée ; les noms et les rattachements de jeu ne prouvent pas une apparition dans la série.');
  return [id, {
    sourceIds,
    observedTraits: comparison?.observedTraits || [],
    combatAdaptation: `Variante visuelle de ${names[baseFighterId]} : mêmes dix techniques, ressources et corps de collision que le combattant de base. Les accessoires, les masques et les membres supplémentaires du dessin n’ajoutent aucune règle ni aucun pouvoir.`,
    reviewStatus: comparison ? refinement ? 'Comparaison partielle — détails corrigés en 0.6.0' : 'Comparaison partielle — écarts ou limites' : sourceIds.length ? 'Épisode à revoir' : 'Référence de costume à identifier',
    reviewScope,
    assetReview: {
      status: refinement ? issues.length ? 'Revue technique 0.6.0 effectuée — limites consignées' : 'Revue technique 0.6.0 effectuée' : issues.length ? 'Revue technique effectuée — limites consignées' : 'Revue technique effectuée',
      visibleTraits: refinement?.visibleTraits || visibleTraits.map(trait => refinement ? trait.replace(' sur un fond à damier vert sombre', '') : trait),
      identityEvidence: id === 'gangletragedy' && refinement
        ? 'Le masque de théâtre triste entier, les larmes et le corps de rubans rouges identifient Gangle ; l’ancien filtre de recoloration n’est plus utilisé.'
        : id === 'workgangle' && refinement
          ? 'Le masque de théâtre blanc souriant et denté, l’étoile sur la joue et les bras en rubans rouges identifient Gangle sous l’uniforme de responsable.'
          : identityEvidence,
      framing: refinement?.framing || cropNotes[id] || (textured.has(id) ? 'La grille source est encore utilisée. Des pixels de fond texturé participent aux limites de l’image ; la découpe ne vaut pas détourage du corps.' : 'Cellule source et extraction comparées côte à côte ; aucun membre coupé ni personnage voisin visible dans le cadre retenu.'),
      transparency: refinement?.transparency || (preserveSource.has(id)
        ? 'Mode explicite de préservation de la source : aucune couleur ni valeur alpha de la cellule n’est supprimée. Le fond texturé reste opaque pour éviter de perforer les parties noires indiscernables du corps.'
        : nativeAlpha.has(id)
        ? 'Alpha natif du PNG conservé. Les zones opaques à l’intérieur du dessin ne sont pas rendues transparentes par une clef de couleur.'
        : textured.has(id)
          ? 'Fond opaque texturé : un retrait exact ne peut pas être déduit du seul noir. Les motifs et halos restants sont consignés ; les détails noirs du corps doivent être préservés.'
          : 'Fond noir uni retiré depuis les bords ; aucun trou majeur supplémentaire constaté sur la planche de comparaison.'),
      proportions: `Dessin : ${refinement?.shape || shape} Affichage : mise à l’échelle uniforme du cadre extrait ; le portrait et la pose de combat sont contrôlés séparément. Aucune proportion canonique mesurée.`,
      issues,
      resolvedIssues: refinement?.resolvedIssues || [],
      captureId: refinement ? `costumes-0.6.0#${id}` : `costumes-0.4.0-page-${Math.floor(index / 12) + 1}#${id}`,
    },
  }];
})));

export function getCostumeFidelity(id) {
  return Object.hasOwn(COSTUME_FIDELITY, id) ? COSTUME_FIDELITY[id] : null;
}

