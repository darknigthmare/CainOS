/** Records the actual sheet inspections performed on 2026-11-25.
 * No image or production source is changed by this report writer.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const output = fileURLToPath(new URL('.', import.meta.url));
const projectileOutput = path.resolve(output, '../canvas-projectiles-current');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(root, file);
const artifact = async file => {
  const bytes = await fs.readFile(file);
  return { file: relative(file), bytes: bytes.length, sha256: sha(bytes) };
};
const base = JSON.parse(await fs.readFile(path.join(output, 'base-canvas-review.json'), 'utf8'));
const projectile = JSON.parse(await fs.readFile(path.join(projectileOutput, 'projectile-canvas-review.json'), 'utf8'));
const reviewedAt = new Date().toISOString();

const baseObservations = {
  bunnyjax: ['Portrait frontal et garde avec regard latéral distincts ; oreilles entières, nœud rose et bouton jaune lisibles.', 'Le miroir inverse proprement la garde ; silhouette et extrémités restent dans le cadre.'],
  maidribbit: ['Yeux sombres brillants, peau verte, coiffe et dentelle blanche restent distincts sur le fond quadrillé.', 'Le vêtement et la base entiers sont visibles dans les deux gardes.'],
  ghostlyvacuum: ['Spectre menthe et machine grise avec tuyau conservés ; aucun élément de la silhouette aspirateur ne manque.', 'La buse et le regard changent de côté avec le miroir ; pas de rectangle opaque autour de l’ensemble.'],
  mingtrophy: ['Couronne de lauriers, silhouette menthe, socle rouge et or et plaque de trophée bien visibles.', 'Le texte de la plaque devient miroir dans la garde gauche : conséquence visible du miroir intégral, déjà connue.'],
  disappearingguymicrophone: ['Visage rouge sans traits, grand chapeau brun et microphone sur pied conservés.', 'L’orientation native gauche est correctement inversée pour la colonne droite ; chapeau, pieds et pied de micro restent entiers.'],
  'glitch-murderdrones-queenie-hommage': ['Tête de reine en bois et yeux orangés, tenue violette à capuche et gants détachés cohérents entre portrait et garde.', 'Le bas de robe et la couronne restent entiers dans les deux orientations.'],
  'glitch-murderdrones-queenie-resident': ['Loupe latérale, vêtement sombre, sangles et pochettes distinguent clairement cette résidente.', 'Portrait et garde reprennent les mêmes couleurs et accessoires ; socle entier.'],
  'glitch-murderdrones-queenie-fusion': ['Tête et mains mécaniques couleur bronze, robe bordeaux et col d’hermine lisibles.', 'La silhouette garde sa base de pièce d’échecs ; pas de compression ou de membre coupé visible.'],
  'glitch-metarunner-queenie-hommage': ['Veste bleue à liserés cyan, gants blancs et une main mécanique, jupe bordeaux et tête en bois concordent.', 'Le regard et les mains s’inversent avec la garde gauche sans déformer la veste.'],
  'glitch-metarunner-queenie-resident': ['Long manteau magenta et turquoise, dispositif cyan et petits détails numériques lisibles.', 'La grande silhouette reste proportionnée et ancrée ; les deux bases sont complètes.'],
  'glitch-metarunner-queenie-fusion': ['Tête bleue, couronne et robe à accents cyan, blancs et or, mains segmentées visibles.', 'Les lignes verticales et le socle polygonal restent réguliers dans les deux orientations.'],
  'glitch-sunsetparadise-queenie-hommage': ['Lunettes orange et violettes sur la couronne, tunique blanche et foulard rose identifiables.', 'Portrait buste et garde entière partagent les mêmes accessoires ; gants détachés lisibles.'],
  'glitch-sunsetparadise-queenie-resident': ['Cape vert profond à bordure dorée, foulard rouge et chaînes conservés.', 'Le miroir garde la silhouette nette et toute la bordure inférieure visible.'],
  'glitch-sunsetparadise-queenie-fusion': ['Couronne de corail, vêtement rouge organique et bijoux turquoise reconnaissables.', 'Les branches de corail et la base de coquillage restent entières dans les gardes.'],
  'glitch-gaslightdistrict-queenie-hommage': ['Écharpe crème et panneaux de cuivre superposés cohérents entre portrait et garde.', 'Tête de reine, gants blancs détachés et socle d’hermine restent complets et bien orientés.'],
  'glitch-gaslightdistrict-queenie-resident': ['Manteau sombre bleu pétrole, broche coquillage et ceinture orange à cartes/pochettes lisibles.', 'La silhouette et les gants ne se confondent pas avec le fond ; les deux orientations conservent le socle.'],
  'glitch-gaslightdistrict-queenie-fusion': ['Couronne de pierre usée, corail, algues et lanterne ambrée visibles ; mains vert d’eau distinctes.', 'Les déchirures du vêtement restent transparentes sur le quadrillage ; aucune boîte de fond visible.'],
  'glitch-knightsofguinevere-queenie-hommage': ['Coiffe violette à étoiles, robe lavande à liserés or et tête en bois cohérentes.', 'Le miroir conserve les deux volumes de la coiffe et la silhouette entière.'],
  'glitch-knightsofguinevere-queenie-resident': ['Gilet crème, col bleu, petite pierre ambre, ceinture bordeaux, clés et pochettes visibles.', 'Portrait buste et garde entière conservent les mêmes détails ; les gants flottants sont distincts.'],
  'glitch-knightsofguinevere-queenie-fusion': ['Porcelaine crème et lavande, ornements dorés, cou articulé et médaillon mécanique bien lisibles.', 'Le socle complet, les broderies et les gants restent proportionnés et cohérents au miroir.'],
  'glitch-gameoverse-queenie-hommage': ['Gilet jaune, écusson rond à étoile, gants jaunes et robe noire/jaune reconnaissables.', 'Les deux gardes sont entières ; couronne en bois et yeux rouges conservés.'],
  'glitch-gameoverse-queenie-resident': ['Manteau bordeaux et vert, motifs losanges, col d’hermine et petites clés lisibles.', 'La silhouette conique et les deux gants restent distincts et non rognés.'],
  'glitch-gameoverse-queenie-fusion': ['Corps cristallin violet à facettes, montures dorées et grand losange vert cohérents.', 'Les facettes ne sont pas étirées ; socle polygonal complet dans les deux sens.'],
  'glitch-lackadaisy-queenie-hommage': ['Chapeau et manteau bleu pétrole, gilet jaune et chaîne dorée cohérents entre buste et garde.', 'Le volume de pièce d’échecs reste complet ; pas de jambe ajoutée par le rendu.'],
  'glitch-lackadaisy-queenie-resident': ['Plume verte, col de fourrure claire, robe bordeaux et multiples chaînes dorées distincts.', 'La plume ne dépasse pas du cadre ; le miroir préserve la robe et le socle entiers.'],
  'glitch-lackadaisy-queenie-fusion': ['Oreilles, museau, moustaches et queue rayée identifient la variante féline, avec nœud vert et robe art déco.', 'La queue reste entièrement visible sur son côté respectif dans les deux gardes.'],
  'glitch-smg4-queenie-hommage': ['Casquette bleue, symbole de caméra, tenue blanche et bleue et bretelles jaunes cohérents.', 'Tête de reine et gants détachés restent lisibles ; base de robe complète.'],
  'glitch-smg4-queenie-resident': ['Casque autour du cou, veste magenta, étoile rose et petit crayon/accessoire jaune visibles.', 'L’accessoire change de côté avec le miroir sans perte ; socle entier.'],
  'glitch-smg4-queenie-fusion': ['Tête dorée à facettes, plastron blanc/bleu, cœur lumineux cyan et cape rouge cohérents.', 'Le miroir préserve le volume mécanique et la cape ; aucun élément essentiel coupé.'],
  'glitch-ultrajumpmania-queenie-hommage': ['Feuilles et fruits près de la couronne, chemise jaune à fleurs, nœud rose et jupe corail cohérents.', 'Les feuilles, gants et base sont entièrement visibles dans les deux gardes.'],
  'glitch-ultrajumpmania-queenie-resident': ['Couronne en bois, fleur blanche, cape de feuilles, robe tressée et foulard rouge identifiables.', 'Le motif tressé et la base d’hermine gardent leurs proportions ; silhouette entière.'],
  'glitch-ultrajumpmania-queenie-fusion': ['Palmes sur la couronne, texture de bois, collier de fleurs, feuillage rouge et racines tressées cohérents.', 'Le miroir préserve la couronne de palmes et la base de racines ; pas d’aplat opaque autour du personnage.'],
};

const projectileObservations = {
  juggle: 'Balle à secteurs jaune, rouge et bleu identifiable à 1× ; silhouette ronde conservée après renvoi.',
  key: 'Clé dorée avec anneau et dents distincts ; côté des dents et orientation correctement inversés.',
  button: 'Bouton bleu à couture croisée claire reconnaissable dans les quatre colonnes.',
  'comedy-mask': 'Masque blanc souriant et nœud rouge entiers ; même motif après renvoi.',
  module: 'Assemblage géométrique rose, cyan et jaune lisible ; sa pointe change de côté.',
  pellet: 'Petite pièce d’échecs dorée orientée dans le sens de la vitesse ; renvois inversés.',
  confetti: 'Étoile jaune avec rubans cyan et rose ; étoile en tête et rubans à l’arrière dans les deux sens.',
  bubble: 'Contour circulaire fin cyan et rose, centre transparent ; petite traînée horizontale visible dans ce centre. Le code drawProjectile trace cette traînée avant l’image : ce n’est pas un rectangle du PNG. Lisibilité plus faible que les motifs pleins à 1×.',
  candy: 'Petit crocodile gommeux vert et jaune entier ; tête vers le sens du déplacement.',
  sugar: 'Éclat rose facetté lisible ; pointe inversée avec la direction et les renvois.',
  gloink: 'Forme triangulaire jaune à yeux noirs et côtés cyan/rose distincts à 1×.',
  fudge: 'Masse brune brillante à reliefs lisible ; silhouette conservée au miroir.',
  corruption: 'Fragment noir/violet à yeux colorés, étroit à 1× mais identifiable ; détail 3× confirme le dessin.',
  'spectral-shot': 'Trait vert pointu lisible avec sa pointe dans le sens de la vitesse.',
  'trick-box': 'Boîte violette à couvercle rouge, ressort doré et étoile rouge visibles dans les deux sens ; les colonnes de renvoi indiquent correctement non réfléchissable.',
  'queenie-royal': 'Petit projectile royal doré à pierre rouge, très fin à 1× ; l’agrandissement 3× permet de distinguer la couronne et la pointe. Renvoi cohérent.',
  'ribbit-lily': 'Bulle turquoise contenant un nénuphar vert et un point rose ; centre et contour restent lisibles.',
  'kaufmo-ball': 'Balle rouge et jaune à grande étoile rouge identifiable dans les quatre colonnes.',
  'ming-star': 'Étoile pêche et menthe avec centre clair visible ; mêmes cinq branches après renvoi.',
  'ghostly-wisp': 'Flamme spectrale menthe à deux taches crème ; queue à l’arrière et tête arrondie vers le déplacement, inversées après renvoi.',
  'orbsman-orb': 'Orbe cobalt à anneau cyan clair et cœur bleu sombre ; motif identique et non aplati dans les quatre colonnes.',
  'oyster-pearl': 'Perle ivoire et rose à reflets nacrés ; silhouette ronde entière à 1× et au détail 3×.',
  'abel-program': 'Module carré rouge et ivoire à losange rouge et contacts latéraux dorés ; les contacts changent de côté au miroir.',
};

assert.equal(base.summary.pass, true);
assert.deepEqual([base.summary.appearances, base.summary.authoredDrawings, base.summary.sourceAndFacingChecks, base.summary.actualStateDraws], [32, 64, 640, 1920]);
assert.equal(Object.keys(baseObservations).length, 32);
assert.equal(Object.keys(projectileObservations).length, 23);

const currentSources = { ...base.sources };
for (const [file, hash] of Object.entries(projectile.sourceHashes)) {
  if (file in currentSources) assert.equal(currentSources[file], hash, 'Different runtime snapshots: ' + file);
  currentSources[file] = hash;
}
for (const [file, hash] of Object.entries(currentSources))
  assert.equal(sha(await fs.readFile(path.join(root, file))), hash, 'Current source differs: ' + file);

const appearances = [];
for (const row of base.appearances) {
  assert.ok(baseObservations[row.id], row.id);
  const nativeFiles = {};
  for (const [slot, file] of Object.entries(row.files)) {
    const current = await artifact(path.join(root, file.file));
    assert.equal(current.sha256, file.sha256);
    assert.equal(current.bytes, file.bytes);
    nativeFiles[slot] = current;
  }
  const sheet = await artifact(path.join(output, 'base-' + row.id + '.jpg'));
  assert.equal(sheet.sha256, base.sheetHashes[path.basename(sheet.file)]);
  appearances.push({ id: row.id, status: 'reviewed', sheet, nativeFiles,
    inspectedViews: ['portrait', 'stance-right', 'stance-left'],
    observations: baseObservations[row.id], blockingIssues: [] });
}
const baseReview = {
  schema: 'encore-current-static-base-visual-review/v1', reviewedAt,
  status: 'reviewed', result: 'pass-with-observations', offlineVersion: base.offlineVersion,
  method: 'All 32 current individual Canvas sheets were opened with view_image, followed by the current 32-family overview. Visual inspection covers portrait and full stance in both facings; source, transform and static-state checks come from the associated production-render report.',
  technicalReport: await artifact(path.join(output, 'base-canvas-review.json')),
  overview: await artifact(path.join(output, 'bases-overview.jpg')),
  summary: { ...base.summary, individuallyInspectedSheets: appearances.length, overviewInspected: true, blockingVisualIssues: 0 },
  integrity: { sourceSha256VerifiedAtReview: base.sources, nativeFilesVerifiedAtReview: 64, sheetSha256VerifiedAtReview: 33 },
  observations: [
    'Les 32 portraits et les 64 vues de garde sont présents, correctement cadrés et lisibles sur le fond quadrillé de Canvas.',
    'Aucun fond rectangulaire opaque, écrasement de proportions ou rognage essentiel constaté sur les feuilles actuelles.',
    'Les 27 variantes Queenie gardent leurs formes de pièce d’échecs, avec palettes et matériaux différenciés selon les univers ; les variantes de fusion ont leurs attributs propres.',
    'Le texte du trophée Ming apparaît inversé dans la garde gauche. C’est le miroir intégral prévu, pas une perte de l’image.',
    'L’overview permet de lire les 32 paires ; son détail réduit ne remplace pas les feuilles individuelles ouvertes séparément.',
  ],
  appearances,
  limitations: [
    'Revue Canvas native sous Node/Skia, sans navigateur, DOM, commandes, audio, service worker ou appareil physique.',
    'Une garde réemployée dans dix états reste un seul dessin de garde ; cette revue ne crée ni animation ni dessin d’action supplémentaire.',
    'Pas de certification de fidélité canonique 1:1 ; cette revue contrôle le rendu des PNG installés.',
    'Les feuilles JPEG composées ne prouvent pas seules chaque valeur alpha des PNG. Les fichiers natifs sont inchangés et leur SHA256 a été revérifié.',
    'Le premier passage a rencontré ENOSPC après 28 familles. La reprise a conservé ces captures seulement après vérification des SHA des sources et des PNG, puis rendu les quatre dernières familles ; les 32 JPEG ont été redécodés pour l’overview.',
  ],
  changes: 'Only new review artifacts in canvas-all and canvas-projectiles-current; no runtime, manifest or native asset modification.',
};
await fs.writeFile(path.join(output, 'visual-review.json'), JSON.stringify(baseReview, null, 2) + '\n');

const motifs = [];
for (const row of projectile.shots) {
  const source = projectile.images.find(image => image.id === row.id);
  const current = await artifact(path.join(root, source.file));
  assert.equal(current.sha256, source.sha256);
  assert.equal(current.bytes, source.bytes);
  assert.ok(row.drawChecks.every(check => check.exactSource && check.uniformScale && check.facingVerified));
  assert.equal(row.drawChecks.length, row.reflectable ? 4 : 2);
  if (row.reflectable) {
    assert.equal(row.rightReflection.reflections, 1);
    assert.equal(row.leftReflection.reflections, 1);
    assert.equal(row.rightReflection.owner, 1);
    assert.equal(row.leftReflection.owner, 1);
    assert.ok(row.rightSpawn.vx > 0 && row.rightReflection.vx < 0);
    assert.ok(row.leftSpawn.vx < 0 && row.leftReflection.vx > 0);
  }
  motifs.push({ id: row.id, fighter: row.fighter, status: 'reviewed', nativeFile: current,
    reflectable: row.reflectable, checkedRenderedViews: row.drawChecks.length,
    detail3xInspected: true, observations: [projectileObservations[row.id]], blockingIssues: [] });
}
const projectileReview = {
  schema: 'encore-current-projectile-visual-review/v1', reviewedAt,
  status: 'reviewed', result: 'pass-with-observations',
  method: 'Current production Canvas gallery opened in full with view_image: 23 motifs, normal shots in both directions, actual reflected shots in both directions where allowed, and 3x detail. Bubble source and drawProjectile were additionally inspected to identify the visible central trail.',
  technicalReport: await artifact(path.join(projectileOutput, 'projectile-canvas-review.json')),
  gallery: await artifact(path.join(projectileOutput, 'projectiles-native-and-reflected.png')),
  summary: { ...projectile.counts, inspectedMotifs: motifs.length, blockingVisualIssues: 0 },
  integrity: { sourceSha256VerifiedAtReview: projectile.sourceHashes, nativeFilesVerifiedAtReview: 23 },
  observations: [
    'Les 23 motifs sont présents et conservent leur identité après changement de propriétaire lors des 44 renvois réels.',
    'La boîte à ressort est correctement marquée non réfléchissable ; deux vues normales existent et aucun faux renvoi n’est présenté.',
    'La transparence se compose sur le quadrillage ; aucun fond rectangulaire opaque constaté.',
    'Bubble a un contour fin et Queenie royal un dessin très étroit à taille de jeu ; les détails 3× rendent leurs formes plus faciles à apprécier.',
    'La barre translucide visible au centre de Bubble vient de la traînée dessinée par le moteur avant le PNG, confirmée dans combat/render.mjs drawProjectile.',
  ],
  motifs,
  limitations: projectile.limitations.concat([
    'Gallery review at reduced motion and selected simulated instants; it does not verify continuous motion or every stage background.',
    'No optional full combat scenes or aquatic-origin scenarios were requested in this command; their counters are zero.',
  ]),
  changes: 'Review output only; native PNG and production code unchanged.',
};
await fs.writeFile(path.join(projectileOutput, 'visual-review.json'), JSON.stringify(projectileReview, null, 2) + '\n');
console.log(JSON.stringify({ base: await artifact(path.join(output, 'visual-review.json')),
  projectiles: await artifact(path.join(projectileOutput, 'visual-review.json')),
  overview: baseReview.overview, gallery: projectileReview.gallery,
  currentSourcesVerified: Object.keys(currentSources).length,
  nativeAssetHashesVerified: 64 + motifs.length }, null, 2));
