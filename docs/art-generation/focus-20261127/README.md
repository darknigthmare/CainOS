# Pomni, Caine et abstractions — 27 novembre 2026

Cette tranche ajoute **34 PNG natifs** au complément déjà préparé de 63 fichiers.
Le catalogue intégré contient **64 combattants, 640 techniques, 575 costumes,
465 crossovers, 91 familles de bases statiques, 27 arènes et 6 315 illustrations**.
Les 34 fichiers représentent **55 345 848 octets** ; leurs empreintes et leur
identité avec les sorties de génération sont consignées dans le
[manifeste consolidé](manifest.json).

## Contenu intégré

| Ensemble | Ajout | Usage réel |
| --- | --- | --- |
| God Caine — Animatez | Un portrait et une garde séparés | Apparence de Caine ; composition du produit officiel, accessoires et globes conservés. |
| Evil Pomni — Pendantz | Un portrait et une garde séparés | Représentation du PNJ adverse avec le kit de Pomni ; les deux anciennes archives partagent le portrait corrigé. |
| Dix abstractions | Dix motifs de tir distincts | Treize techniques existantes, avec direction et dessin conservés après renvoi. |
| Dix routes d’abstraction | Vingt peintures narratives | Premier tableau du prologue et dernier tableau de l’épilogue de chaque route. |

Il n’y a ni nouveau cycle animé, ni combattant supplémentaire, ni changement
de technique, collision, sauvegarde ou règle de replay. Les nouveaux tableaux
utilisent les scènes déjà prévues : le seuil de l’abstraction pour cinq formes,
le chapiteau des souvenirs brisés pour les cinq créations originales, puis la
salle de calibration pour les dix conclusions. Les quarante autres tableaux
de ces routes gardent leur composition dynamique existante.

## Fidélité et identité

Les [références primaires et leur portée](references.md) séparent les épisodes,
les produits officiels et les adaptations Encore. God Caine est fondé sur
Animatez ; cette présentation reste distincte de `monstrouscaine` et
`badendcaine`. Les références ne justifient pas un nouveau kit de pouvoirs.

`evilpomni` et `rivalbaseballpomni` décrivent la même identité adverse. Les
anciens dessins, dont plusieurs traits étaient incohérents avec la référence,
sont conservés comme sources historiques. Le nouveau portrait est utilisé
seulement lorsque la paire complète est disponible et revue. Les identifiants
restent inchangés ; le PNJ n’est pas présenté comme une transformation de Pomni.

Les vingt scènes et dix accessoires sont des **créations originales Encore**.
Les cinq formes `originalabstracted*` gardent ce statut. Les attributions du
cellier, de l’aquatique et de Ribbit restent ouvertes. La comparaison des
peintures avec les sprites existants ne certifie pas les modèles de la série
à 1:1 ; elle contrôle la continuité du dessin dans le jeu.

## Voir les dessins et les preuves

- [Galerie des bases, projectiles et tableaux](gallery.md).
- [Bases : fichiers natifs](bases/native-receipts.json),
  [briefs de génération](bases/generation-briefs.json),
  [revue des références](bases/asset-review.json) et
  [contrôle du rendu](bases/runtime-review.json).
- [God Caine en situation](bases/canvas/base-godcaine.jpg) et
  [Evil Pomni en situation](bases/canvas/base-evilpomni-pendantz.jpg).
- [Portrait partagé des archives](bases/evil-archive-aliases.jpg) et
  [preuve du véritable chargement](bases/archive-portrait-review.json).
- [Projectiles : prompts et mesures](projectiles/native-receipts.json),
  [revue](projectiles/asset-review.json) et
  [tirs / renvois dans le moteur](projectiles/canvas/projectiles-native-and-reflected.png).
- [Dix tableaux des formes d’archive](campaign-lore/manifest.json) et
  [dix tableaux des formes originales](campaign-original/manifest.json).
- [Travaux ouverts et limites](remaining-work.md).

La dernière suite complète comporte **486 tests Node réussis, zéro échec et
zéro test ignoré**. Les contrôles de syntaxe, de contrat, des guides et des
assets ont réussi. Le [rapport de la campagne locale](qa/full-qa.json)
conserve aussi les essais précédents et leurs erreurs corrigées.

La copie du build autonome a ensuite été interrompue avec le code **137**
dans le volume temporaire en mémoire. Cette campagne locale ne valide donc
ni une distribution autonome complète, ni un build CainOS, ni leurs octets.
La CI du commit publié doit exécuter ces builds et les 22 suites navigateur.
Ses résultats restent distincts du relevé local.

La [preuve de conservation](qa/preservation.json) confirme les 6 218 images
historiques, les 64 combattants, les 640 techniques et les champs mécaniques
des 27 arènes et 64 arrangements. Les deux familles de base ont 40 contrôles
état/direction et 120 rendus Canvas ; les dix motifs ont 20 tirs et 20 renvois
réels contrôlés. Ces preuves locales de rendu ne remplacent pas une exécution
navigateur.
L’[attestation Chromium](chromium-local-result.json) décrit le téléchargement
officiel refusé par HTTP 403 ; la validation navigateur doit être lue sur le
commit exact de la PR.

## Lot précédent finalisé dans la même publication

Le [complément de 63 PNG](../completion-20261127/README.md) rassemble 27 paires
de Kaufmo/Max et neuf peintures de décors. Les six familles Kaufmo Lackadaisy et
SMG4 qui existaient sur disque sont désormais reliées au catalogue. Les deux
tranches totalisent **97 nouveaux PNG par rapport à `cc972c8`**, sans modifier
les 6 218 images historiques. Les 16 PNG du commit précédent ne sont pas
recomptés dans ces 97 fichiers.

## Suivi de production

Le [classeur de suivi](../../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) conserve ses
14 feuilles et ses 42 formules. Le focus ajoute 36 lignes Production
(34 fichiers et deux apparences), met à jour 27 lignes existantes et ajoute
11 constats QA datés. Les notes et les identifiants historiques sont conservés.
La [preuve du classeur](../../combat-focus-workbook-verification.json) détaille
la comparaison native des 97 677 cellules historiques et les modifications
déclarées.

Les trois [générateurs de bible vérifiés](qa/guide-checks.log) concordent avec
le catalogue : 104 tableaux d’introduction/conclusion disposent d’une peinture,
les 280 autres utilisent une composition existante. Le total de 160 fichiers
de campagne comprend d’autres peintures et n’est pas le nombre de ces tableaux.
La [vérification finale](verification-final.json) rassemble les preuves natives,
le résultat local, la conservation et les empreintes du suivi. Les résultats
de CI ultérieurs à l’export restent identifiables par leur commit et leur run.
