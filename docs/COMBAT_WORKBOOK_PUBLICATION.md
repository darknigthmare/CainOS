# Publication du classeur de suivi

## Association du guide à la bible — 25 novembre 2026

La passe documentaire ajoute **Guide combat** : 30 rubriques, 100 exigences
associées et une colonne de notes utilisateur. Les 93 042 cellules des onze
feuilles précédentes ont été comparées, ainsi que leurs styles, tables,
validations et notes. Les 42 formules sont préservées, recalculées puis
réimportées. Deux textes sont corrigés : `Synthèse!H9` et
`Fonctionnalités!G95` indiquent désormais **27 arènes, dont 18 hors crossovers
et 9 escales GLITCH**. Le JSON compagnon conserve cette même répartition.

Le [rapport canonique courant](combat-workbook-verification.json) porte les
empreintes du XLSX et du JSON enrichis. Il renvoie au
[contrôle de cette passe](combat-guide-workbook-verification.json), à ses
[rendus](verification/guide-workbook-20261125/guide-overview.png) et à la
[copie intégrale du rapport précédent](verification/guide-workbook-20261125/previous-workbook-verification.json).
Cette copie garde exactement ses octets d’origine ; ses résultats QA restent
historiques. **Aucun test du jeu n’a été réexécuté par cette mise à jour du
classeur.** `releaseReviewed` reste `false` et aucune preuve de campagne QA
complète n’est attribuée à cette passe. Le gate de
`scripts/package-combat-release.mjs` reste donc fermé jusqu’à une revue du jeu
accompagnée des preuves requises.

Le générateur [update-combat-workbook-guide.mjs](../scripts/update-combat-workbook-guide.mjs)
utilise le moteur tableur principal pour son mode `--build`. Le mode
`--publish-staged` reprend les fichiers déjà vérifiés en contrôlant leurs
empreintes, sans réimporter ni réécrire le classeur. L’historique et les rendus
sont préparés avant le remplacement des quatre fichiers canoniques : XLSX,
JSON de suivi, rapport canonique et rapport détaillé du guide. Ce remplacement
utilise `publishWorkbookArtifacts`, avec staging, sauvegardes et restauration
sur erreur interceptée. Les limites d’atomicité décrites ci-dessous restent
applicables.

## Publication historique de la version 0.7

Le générateur `scripts/build-combat-workbook.mjs` publie ensemble quatre résultats validés pour Encore 0.7 :

- `DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx` ;
- `combat-tracker-data.json` ;
- `combat-workbook-verification.json` ;
- `combat-qa-evidence-0.7.0.json`.

Les trois premiers fichiers existaient en 0.6. Le quatrième conserve les preuves
effectivement utilisées par cette édition du classeur. La publication 0.7 utilise
`build-combat-workbook-current.mjs` et le moteur tableur principal pour importer
le fichier existant, recalculer les formules, vérifier les notes et exporter.
La CI vérifie le classeur publié puis assemble le jeu ; elle ne modifie pas ses
cellules. Le fichier de vérification lie les octets XLSX, le JSON de suivi, les
preuves, les sources du jeu et celles des tests par leurs empreintes SHA-256.

`scripts/workbook-publication.mjs` assure leur restauration si un remplacement échoue pendant l’exécution. Il est indépendant du moteur de calcul Excel : ses tests peuvent provoquer des pannes de fichiers sans reconstruire un classeur.

## Préparation et remplacement

Le générateur termine d’abord l’export XLSX, sa réimportation et la vérification des notes. Ses fichiers d’export intermédiaires restent dans un dossier privé `.tracker-*`, créé par `mkdtemp` dans le dossier des aperçus. Les PNG sont à l’extérieur de ce dossier.

La publication suit ensuite cet ordre :

1. Acquérir `.workbook-publication.lock` par création exclusive. Un second processus utilisant ce module ne peut pas publier dans le même dossier tant que ce verrou existe.
2. Créer un dossier privé `.workbook-publication-*` dans le dossier de sortie. Copier les nouvelles sorties dans son sous-dossier `staged`. Ces copies placent les remplacements sur le même système de fichiers que leurs destinations.
3. Examiner chaque destination. Un fichier régulier existant est copié dans `backups` ; une destination absente est enregistrée comme telle. Les liens symboliques et les répertoires sont refusés. Toutes les sauvegardes doivent réussir avant le premier remplacement.
4. Écrire `recovery.json`, avec les noms des fichiers, leur présence initiale, les chemins relatifs des sauvegardes et les modes et dates des fichiers existants.
5. Remplacer successivement les destinations par `rename`. Les permissions d’un fichier existant sont conservées sur son remplaçant.
6. Après succès, supprimer uniquement le dossier privé de cette publication et son verrou. Le générateur nettoie séparément son propre dossier privé d’export. Les PNG et les fichiers voisins restent en place.

Les noms de destination doivent être de simples noms de fichiers. Les doublons, y compris ceux qui ne diffèrent que par la casse, les chemins relatifs avec séparateurs et les noms réservés `.workbook-publication*` sont refusés avant toute écriture.

## Restauration après une erreur

Une erreur avant le premier remplacement laisse les contenus et la présence des sorties existantes inchangés. Une erreur pendant les remplacements déclenche une restauration de toutes les destinations, dans l’ordre inverse :

- Pour un fichier initialement présent, le module copie sa sauvegarde vers un fichier de restauration privé, restaure son mode et ses dates, puis renomme cette copie vers la destination. La sauvegarde elle-même n’est jamais déplacée ni consommée.
- Pour un fichier initialement absent, le module supprime uniquement cette destination, sans suppression récursive.
- Une erreur de restauration n’empêche pas les autres restaurations d’être tentées.

Si toutes les restaurations réussissent, les contenus binaires et les absences antérieures sont rétablis, puis les temporaires privés et le verrou sont nettoyés. Le générateur signale tout de même l’échec de publication ; il ne présente pas cette tentative comme une nouvelle génération réussie.

Si une restauration échoue, **toutes les sauvegardes, le dossier privé et le verrou sont conservés**. Le journal reçoit l’état `rollback-incomplete` et la liste des erreurs si son actualisation réussit. Si cette actualisation échoue elle aussi, le journal initial `prepared` et les sauvegardes restent disponibles. L’erreur retournée indique `recoveryDirectory` et `lockPath`. Le nettoyage du générateur n’efface jamais ce dossier de récupération.

| Code d’erreur | État des résultats et action à mener |
| --- | --- |
| `WORKBOOK_PUBLICATION_LOCKED` | Une autre exécution ou une récupération à terminer possède déjà le verrou. Examiner cette situation avant de relancer. |
| `WORKBOOK_PUBLICATION_PREPARE_FAILED` | Aucun remplacement final n’a commencé. Corriger la cause de préparation avant de relancer. |
| `WORKBOOK_PUBLICATION_ROLLED_BACK` | Les contenus et les absences antérieures ont été restaurés. La nouvelle génération n’a pas été publiée. |
| `WORKBOOK_ROLLBACK_INCOMPLETE` | L’état final peut être mélangé. Utiliser les sauvegardes conservées pour terminer la récupération avant toute nouvelle publication. |
| `WORKBOOK_PUBLICATION_CLEANUP_FAILED` | Les remplacements ont abouti, mais le nettoyage privé a échoué. Vérifier le champ `committed` et les chemins signalés avant de nettoyer. |

Une erreur de nettoyage secondaire est attachée à l’erreur principale ; elle ne masque pas les informations de récupération.

## Limites du système de fichiers

Chaque renommage est atomique sur le système de fichiers de destination. Les noms ne changent pas simultanément : un lecteur qui ouvre plusieurs fichiers pendant la courte phase de remplacement peut observer des générations différentes. Les consommateurs doivent utiliser les sorties après la fin réussie du générateur, ou attendre la disparition du verrou.

Cette procédure réagit aux erreurs de fichiers interceptées par le processus. Elle ne garantit pas une transaction résistante à une coupure de courant, à l’arrêt brutal du processus ou à une panne du support ; elle n’utilise pas de protocole de synchronisation durable des répertoires et fichiers. Un arrêt brutal peut laisser un verrou et un dossier privé à examiner. Aucun verrou ancien n’est supprimé automatiquement.

La restauration porte sur les octets, la présence ou l’absence, le mode et les dates enregistrées lorsque le système de fichiers permet leur rétablissement. Elle ne promet pas de conserver le numéro d’inode, les liens physiques, le propriétaire, les attributs étendus ou la date de changement de métadonnées. La lecture des fichiers peut modifier leur date d’accès. Les écritures externes qui ignorent le verrou ne sont pas coordonnées par ce module.

## Récupération manuelle si nécessaire

1. Arrêter les générateurs et vérifier qu’aucun processus ne publie encore dans le dossier concerné. Conserver le verrou et le dossier désigné par `recoveryDirectory` pendant toute la récupération.
2. Lire son `recovery.json`. Vérifier le dossier de sortie, tous les noms attendus et la présence de chaque sauvegarde déclarée. Un journal `prepared` peut également être celui d’une exécution interrompue ; il décrit l’état antérieur aux remplacements.
3. Pour chaque entrée dont `existed` vaut `true`, copier sa sauvegarde vers un nouveau fichier temporaire privé placé sur le système de fichiers de destination, lui appliquer les métadonnées enregistrées, puis le renommer vers le nom de sortie. Garder la sauvegarde intacte jusqu’à la vérification complète.
4. Pour chaque entrée dont `existed` vaut `false`, retirer seulement le fichier de sortie nommé dans cette entrée. Ne supprimer aucun répertoire de façon récursive pour réaliser cette étape.
5. Comparer les contenus restaurés à chaque sauvegarde et vérifier les absences enregistrées. En cas d’erreur, conserver toutes les sauvegardes et le verrou pour poursuivre la récupération.
6. Une fois la récupération complète vérifiée, retirer uniquement le dossier privé identifié et son verrou. Les aperçus PNG et les autres fichiers ne font pas partie de ce nettoyage. Relancer ensuite la génération complète.

## Vérifications automatisées

Les tests de fichiers utilisent des dossiers temporaires réels et les opérations Node de production. Ils injectent seulement l’échec de l’appel ciblé avec `node:test` ; le module livré n’a ni drapeau de panne ni branche de comportement réservée aux tests.

```sh
node tests/combat-workbook-publication.test.mjs
```

Les onze tests couvrent les huit combinaisons de présence initiale des trois résultats en cas de succès, puis les mêmes huit combinaisons après un échec du premier, du deuxième et du troisième remplacement. Ils vérifient aussi la copie partielle d’une nouvelle source, la sauvegarde partielle, l’existence de toutes les sauvegardes et du journal avant remplacement, l’échec d’une restauration, l’échec du rétablissement d’une absence, la conservation des sauvegardes et du verrou, le rejet des liens symboliques et la validation des noms. Les aperçus et des fichiers voisins témoins doivent rester identiques.

La suite est également incluse par le motif `tests/combat-*.test.mjs` de `npm run test:combat`. La conservation des notes Excel est vérifiée séparément avec des classeurs de test, en incluant les formules relatives, un texte commençant par `=`, la valeur `0` et le booléen `false`. Ces notes de test ne sont jamais ajoutées au classeur livré.

Pour la passe 0.7, le résultat de la fixture de dix notes sur huit feuilles est
conservé dans [combat-workbook-notes-0.7.0.json](combat-workbook-notes-0.7.0.json).
Elle vérifie aussi le tri d’un tableau et la conservation d’une hauteur utilisateur
supérieure. Les deux contrôles de refus d’archive sont dans
[combat-package-gates-0.7.0.json](combat-package-gates-0.7.0.json) : ancienne version
du classeur et JSON compagnon modifié après revue. Ils utilisent une copie
temporaire isolée et n’altèrent pas les documents de production.

## Extension PNJ du 17 novembre 2026

Le runtime tableur principal (`@oai/artifact-tool`) n’était pas disponible dans
l’environnement de cette extension. Le classeur a donc été étendu de façon ciblée
avec `openpyxl`, sur une copie de sauvegarde préalable :

- 40 lignes dans **Combattants**, 400 dans **Techniques**, 240 dans **Scénarios**
  (40 routes, 160 chapitres, 40 tournois) et 1 560 dans **Production** ;
- une feuille **Extension PNJ** de 40 lignes synthétisant kit, histoire, rival,
  finales et fidélité ;
- six constats dans **QA** et l’extension des plages des formules de Synthèse.

Les notes utilisateur existantes ne sont pas modifiées. Les formules étendues
n’ont pas été recalculées par le moteur officiel : Excel les recalcule à
l’ouverture. Le générateur officiel reste requis pour une publication certifiée,
un recalcul contrôlé et l’égalité stricte entre classeur et JSON. La
[vérification](combat-workbook-verification.json) et la
[preuve QA](combat-qa-evidence-expansion-0.7.0.json) déclarent explicitement
cette limite, ainsi que l’absence des suites Chromium complètes et des
comparaisons canoniques 1:1 des 40 nouveaux sprites.

## Réconciliation et complétion des personnages du 19 novembre 2026

La passe du 19 novembre repart du classeur réconcilié entre la branche principale
et le travail PNJ. Elle utilise le runtime tableur principal
(`@oai/artifact-tool`) pour importer le fichier existant, étendre son suivi,
recalculer les formules, exporter puis réimporter le résultat. L’historique du
17 novembre ci-dessus reste conservé ; les nouveaux constats sont datés et
identifiés séparément.

Le générateur [update-combat-character-workbook.mjs](../scripts/update-combat-character-workbook.mjs)
ajoute **179 lignes `COV-`** pour la couverture des apparences, **168 lignes
`SERIES-`** pour les formes à comparer aux références, et **six constats QA**
`CHARCOV26-`. Les lignes préexistantes gardent leur ordre, leur identifiant et
leurs notes utilisateur. Le résultat comprend **3 092 lignes de Production**
et **2 255 lignes de QA**, dans les **11 feuilles et 10 tableaux natifs**.

### Couverture enregistrée

La [matrice de couverture](combat-character-coverage-2026-11-19.json) suit
**1 234 fichiers de personnages**, tous inclus dans le manifeste final :

- **54 combattants et 51 variantes d’archive** disposent chacun de leur
  sélection, de leur garde et de neuf actions distinctes : introduction,
  attaque, attaque forte, impact reçu, marche, saut, accroupissement, victoire
  et défaite. Ces 105 ensembles comptent **945 dessins d’action et 105 gardes**.
- **179 fiches d’archive** disposent de **184 portraits individuels**. Les
  groupes Best Children A/B, Âmes de Mildenhall A/B/C et Ombres rieuses A/B/C
  conservent leurs sujets séparés. Les membres supplémentaires de ces groupes
  sont des sujets de galerie ; ils n’ajoutent pas de kits de combat.
- Aucun emplacement de dessin attendu n’est manquant. L’inventaire conserve
  aussi les priorités principal, secondaire et tertiaire, les variantes et les
  entrées encore à identifier. Ces catégories servent à la production du jeu.

Les 168 formes issues de la recherche comprennent des états de base, des
accessoires et des candidats à vérifier. Elles ne représentent pas 168
personnages supplémentaires. Leurs lignes restent « À vérifier ». Les cycles
d’animation complets et la comparaison canonique plan par plan restent ouverts,
même lorsque les onze repères statiques d’une apparence sont présents.

### Vérification du classeur et preuves du jeu

La [revue du classeur](combat-character-workbook-review-2026-11-19.json) lie
l’export XLSX, son JSON compagnon, la matrice, le générateur et le manifeste
par leurs empreintes. **42 formules ont été recalculées sans erreur** ; une
modification temporaire de statut a vérifié le recalcul des totaux avant d’être
annulée. La réimportation a confirmé l’égalité des tableaux avec leur JSON, la
conservation des notes et des formules, ainsi que les valeurs des feuilles
hors périmètre.

La [comparaison de mise en forme](combat-character-workbook-layout-review-2026-11-19.json)
contrôle **74 737 cellules préexistantes** : aucune différence de style, de
largeur de colonne, de gel des volets, de fusion ou de réglage de page.
Aucune hauteur de ligne existante n’a diminué. Le pied de la feuille Références
a été déplacé de 36 lignes pour préserver sa légende après l’ajout des sources.
Les aperçus de Synthèse, Combattants, Atlas, Production, QA et Références ont
été relus ; l’[aperçu de Synthèse](images/character-workbook-2026-11-19/summary.png)
montre les totaux publiés.

Les cinq constats du jeu sont importés depuis la
[vérification finale](combat-character-verification-2026-11-19.json), après
contrôle des empreintes des preuves, du runtime, des tests et des images :

| Constat QA | Preuve et résultat |
| --- | --- |
| `CHARCOV26-inventory` | [Inventaire des images](combat-character-art-inventory-2026-11-19.json) : 1 234 fichiers, zéro emplacement manquant, 586 nouveaux chemins par rapport à la révision de comparaison et 517 rapprochements avec les octets natifs de génération. |
| `CHARCOV26-canvas` | [Rendus des personnages](images/character-completion-2026-11-19/character-canvas-review.json) : 945 actions dans les deux sens, soit 1 890 contrôles de dessin, et 184 portraits. Aucun fichier manquant. |
| `CHARCOV26-scenes` | [Rendus des scènes PNJ](images/character-scenes-2026-11-19/canvas-review.json) : 80 images de garde/sélection et dix scènes à trois plans. |
| `CHARCOV26-node` | [Journal de `npm run qa`](combat-character-qa-2026-11-19.log) : 399 tests réussis, aucun échec ni test ignoré, puis construction de CainOS et d’Encore. |
| `CHARCOV26-browser` | **Non exécuté** : 21 configurations recensées, syntaxe des 20 scripts uniques contrôlée ; l’accès au navigateur a été bloqué par la politique de l’environnement. |

Le signal de bord à faible alpha de `Scratch/intro` reste visible dans
l’inventaire. Sa revue sur fond gris opaque n’a montré ni halo visible, ni
fragment, ni anatomie coupée ; le PNG natif a été conservé sans retouche.
Les revues Canvas utilisent les modules de production avec Node et Skia et
n’attestent pas les interactions DOM, l’audio ou les périphériques physiques.
Aucune campagne navigateur historique n’est présentée comme une exécution de
cette passe.

L’export correspond au manifeste **`0.7.0-9d40b0881496`**, à l’art
**`0e03085d0a637d14`**, et à ses **5 331 illustrations / 2 538 831 567 octets**
pour l’ensemble du jeu. Les six sorties du classeur sont remplacées ensemble
avec `publishWorkbookArtifacts`, après la revue et la réimportation. La
vérification conserve `releaseReviewed: false` et `fullCiExecuted: false` :
cette publication du suivi n’affirme pas qu’une campagne navigateur complète
ou une validation canonique a eu lieu.
